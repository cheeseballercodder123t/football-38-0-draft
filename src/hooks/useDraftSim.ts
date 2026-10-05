import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  GameMode,
  GameDifficulty,
  FormationName,
  Manager,
  Player,
  SquadData,
  MatchResult,
  SeasonTableEntry,
  SeasonAwards,
  OpponentTeam,
  DynastyState,
  FacilityUpgrades,
  TransferMarketListing,
  SetPieceTakers,
  PlayerFormArrow,
  RoguelikePerk,
  CommercialSponsor,
  DynastyStaffMember,
  PreSeasonTour,
  OnTheMoneyState,
  TacticalChipType,
  TacticalChipsState,
} from '../types/football';
import { SQUADS, getEligibleSquads } from '../data/squads';
import { MANAGERS } from '../data/managers';
import { FORMATIONS } from '../data/formations';
import {
  getLeagueOpponents,
  UCL_OPPONENTS,
  WORLD_CUP_OPPONENTS,
  LA_LIGA_HARDEST_OPPONENTS,
  PREMIER_LEAGUE_HARDEST_OPPONENTS,
  SERIE_A_HARDEST_OPPONENTS,
  RIVALRY_DERBY_OPPONENTS,
  ROGUELIKE_BOSS_OPPONENTS,
} from '../data/opponents';
import { getRandomRoguelikePerks } from '../data/perks';
import { simulateMatch, calculateSeasonAwards } from '../engine/simulationEngine';

const ALL_OPPONENTS_CACHE: OpponentTeam[] = [
  ...LA_LIGA_HARDEST_OPPONENTS,
  ...PREMIER_LEAGUE_HARDEST_OPPONENTS,
  ...SERIE_A_HARDEST_OPPONENTS,
  ...UCL_OPPONENTS,
  ...WORLD_CUP_OPPONENTS,
  ...RIVALRY_DERBY_OPPONENTS,
  ...ROGUELIKE_BOSS_OPPONENTS,
];

function resolveTeamRatings(
  teamName: string,
  opps: OpponentTeam[]
): { rating: number; attackRating: number; defenseRating: number } {
  // 1. Direct match in current mode opps
  const direct = opps.find(o => o.name.toLowerCase() === teamName.toLowerCase());
  if (direct) {
    return {
      rating: direct.rating,
      attackRating: direct.attackRating ?? direct.rating,
      defenseRating: direct.defenseRating ?? direct.rating,
    };
  }

  // 2. Partial match in current mode opps
  const partial = opps.find(
    o =>
      o.name.toLowerCase().includes(teamName.toLowerCase()) ||
      teamName.toLowerCase().includes(o.name.toLowerCase())
  );
  if (partial) {
    return {
      rating: partial.rating,
      attackRating: partial.attackRating ?? partial.rating,
      defenseRating: partial.defenseRating ?? partial.rating,
    };
  }

  // 3. Fallback across all opponents
  const globalDirect = ALL_OPPONENTS_CACHE.find(
    o => o.name.toLowerCase() === teamName.toLowerCase()
  );
  if (globalDirect) {
    return {
      rating: globalDirect.rating,
      attackRating: globalDirect.attackRating ?? globalDirect.rating,
      defenseRating: globalDirect.defenseRating ?? globalDirect.rating,
    };
  }

  const globalPartial = ALL_OPPONENTS_CACHE.find(
    o =>
      o.name.toLowerCase().includes(teamName.toLowerCase()) ||
      teamName.toLowerCase().includes(o.name.toLowerCase())
  );
  if (globalPartial) {
    return {
      rating: globalPartial.rating,
      attackRating: globalPartial.attackRating ?? globalPartial.rating,
      defenseRating: globalPartial.defenseRating ?? globalPartial.rating,
    };
  }

  // 4. Known club heuristics
  const lower = teamName.toLowerCase();
  if (
    lower.includes('real madrid') ||
    lower.includes('barcelona') ||
    lower.includes('manchester city') ||
    lower.includes('bayern')
  ) {
    return { rating: 93, attackRating: 95, defenseRating: 91 };
  }
  if (
    lower.includes('liverpool') ||
    lower.includes('arsenal') ||
    lower.includes('milan') ||
    lower.includes('juventus') ||
    lower.includes('inter') ||
    lower.includes('psg') ||
    lower.includes('chelsea')
  ) {
    return { rating: 89, attackRating: 90, defenseRating: 88 };
  }
  if (
    lower.includes('atletico') ||
    lower.includes('tottenham') ||
    lower.includes('dortmund') ||
    lower.includes('napoli') ||
    lower.includes('united')
  ) {
    return { rating: 86, attackRating: 87, defenseRating: 86 };
  }

  // Default mid-tier fallback
  return { rating: 80, attackRating: 80, defenseRating: 80 };
}
import {
  initializeDynastyState,
  processSeasonAdvance,
  SeasonTransitionReport,
  FACILITY_UPGRADE_COSTS,
  calculatePlayerSaleValue,
  hireStaffMember,
  signCommercialSponsor,
  loanOutPlayer,
  conductPreSeasonTour,
} from '../engine/dynastyEngine';
import { isDuplicatePlayer, calculateTeamChemistry, calculatePlayerForm } from '../engine/chemistryEngine';
import { TournamentStage } from '../components/TournamentBracket';
import { getWeightedRandomSquad } from '../utils/rollEngine';

const STORAGE_KEY = 'tactical_draft_save_v2';

export function getPlayerSalaryValue(overall: number): number {
  if (overall >= 94) return 110;
  if (overall >= 92) return 85;
  if (overall >= 90) return 65;
  if (overall >= 88) return 48;
  if (overall >= 86) return 36;
  if (overall >= 84) return 26;
  if (overall >= 82) return 18;
  if (overall >= 80) return 12;
  if (overall >= 78) return 8;
  return 5;
}

export interface SwapSelection {
  type: 'starter' | 'bench';
  index: number;
}

export function useDraftSim() {
  // Game Setup
  const [gameMode, setGameMode] = useState<GameMode>('la_liga');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('classic');

  // Manager & Formation
  const [manager, setManager] = useState<Manager>(MANAGERS[0]);
  const [rolledManager, setRolledManager] = useState<Manager>(MANAGERS[0]);
  const [managerRollsLeft, setManagerRollsLeft] = useState<number>(3);
  const [isManagerRolling, setIsManagerRolling] = useState<boolean>(false);
  const [formationName, setFormationName] = useState<FormationName>('4-3-3');
  const formation = FORMATIONS[formationName];

  // Navigation & Phases: mode_select -> manager_roll -> drafting -> season_hub / tournament_hub / dynasty_hub
  const [draftPhase, setDraftPhase] = useState<
    'mode_select' | 'manager_roll' | 'drafting' | 'season_hub' | 'tournament_hub' | 'dynasty_hub'
  >('mode_select');

  // Squad State: Starting XI (11) + Bench (5)
  const [startingXI, setStartingXI] = useState<(Player | null)[]>(new Array(11).fill(null));
  const [bench, setBench] = useState<(Player | null)[]>(new Array(5).fill(null));
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [swapSelection, setSwapSelection] = useState<SwapSelection | null>(null);
  const [playerToAssign, setPlayerToAssign] = useState<Player | null>(null);
  const [swapNotice, setSwapNotice] = useState<string | null>(null);

  const showSwapNotice = useCallback((msg: string) => {
    setSwapNotice(msg);
    setTimeout(() => {
      setSwapNotice(prev => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Drafting Loop State
  const [draftRound, setDraftRound] = useState<number>(1); // Total 16 rounds (11 starters + 5 bench)
  const [currentSquadPool, setCurrentSquadPool] = useState<SquadData>(SQUADS[0]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [freeRerollAvailable, setFreeRerollAvailable] = useState<boolean>(true);
  const [isRerollSpin, setIsRerollSpin] = useState<boolean>(false);
  const [scoutTokens, setScoutTokens] = useState<number>(3);

  // League & Match Simulation State
  const [matchday, setMatchday] = useState<number>(1);
  const [matchHistory, setMatchHistory] = useState<MatchResult[]>([]);
  const [activeModalMatch, setActiveModalMatch] = useState<MatchResult | null>(null);
  const [leagueTable, setLeagueTable] = useState<SeasonTableEntry[]>([]);
  const [seasonAwards, setSeasonAwards] = useState<SeasonAwards | null>(null);
  const [isSeasonComplete, setIsSeasonComplete] = useState<boolean>(false);
  const [invincibleAchieved, setInvincibleAchieved] = useState<boolean>(false);

  // Restart Confirmation Dialog State
  const [showRestartConfirm, setShowRestartConfirm] = useState<boolean>(false);

  // Tournament State (UCL Knockouts)
  const [tournamentStages, setTournamentStages] = useState<TournamentStage[]>([]);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isTournamentEliminated, setIsTournamentEliminated] = useState<boolean>(false);

  // Dynasty State
  const [dynastyState, setDynastyState] = useState<DynastyState>(initializeDynastyState('Arsenal'));
  const [seasonTransitionReport, setSeasonTransitionReport] = useState<SeasonTransitionReport | null>(null);

  // Set-Piece Specialists
  const [setPieceTakers, setSetPieceTakers] = useState<SetPieceTakers>({
    penalty: null,
    freeKick: null,
    corner: null,
  });

  const assignSetPieceTaker = (role: 'penalty' | 'freeKick' | 'corner', playerId: string | null) => {
    setSetPieceTakers(prev => ({
      ...prev,
      [role]: playerId,
    }));
  };

  // Dynamic Player Form (up, neutral, down)
  const [playerFormMap, setPlayerFormMap] = useState<Record<string, PlayerFormArrow>>({});

  // Roguelike Tower State
  const [roguelikePerks, setRoguelikePerks] = useState<RoguelikePerk[]>([]);
  const [pendingRoguelikeChoice, setPendingRoguelikeChoice] = useState<RoguelikePerk[] | null>(null);

  const selectRoguelikePerk = (perk: RoguelikePerk) => {
    setRoguelikePerks(prev => [...prev, perk]);
    if (perk.effectType === 'token_boost') {
      setScoutTokens(t => t + perk.value);
    }
    setPendingRoguelikeChoice(null);
  };

  // Salary Cap Calculation (Max: $350M)
  const salaryCapSpent = useMemo(() => {
    const allPlayers = [...startingXI, ...bench].filter((p): p is Player => p !== null);
    return allPlayers.reduce((acc, p) => acc + getPlayerSalaryValue(p.overall), 0);
  }, [startingXI, bench]);

  // On The Money State (38-0-0 signature mode)
  const [onTheMoneyState, setOnTheMoneyState] = useState<OnTheMoneyState>({
    targetPoints: 78,
    isTargetSpun: false,
    projectedPoints: 78,
    pointsDelta: 0,
  });

  const handleSetOnTheMoneyTarget = (target: number) => {
    setOnTheMoneyState(prev => ({
      ...prev,
      targetPoints: target,
      isTargetSpun: true,
      pointsDelta: Math.abs(prev.projectedPoints - target),
    }));
  };

  // 38-0-0 regression anchors formula for projected points
  const calculateProjectedPoints = (avgOvr: number): number => {
    if (avgOvr <= 60) return 6;
    if (avgOvr >= 93) return 114;
    if (avgOvr <= 73) return Math.round(6 + (avgOvr - 60) * (27 / 13));
    if (avgOvr <= 80) return Math.round(33 + (avgOvr - 73) * (31 / 7));
    if (avgOvr <= 84) return Math.round(64 + (avgOvr - 80) * (25 / 4));
    if (avgOvr <= 87) return Math.round(89 + (avgOvr - 84) * (11 / 3));
    return Math.round(100 + (avgOvr - 87) * (14 / 6));
  };

  useEffect(() => {
    const filledStarters = startingXI.filter((p): p is Player => p !== null);
    if (filledStarters.length > 0) {
      const avg = filledStarters.reduce((acc, p) => acc + p.overall, 0) / filledStarters.length;
      const proj = calculateProjectedPoints(avg);
      setOnTheMoneyState(prev => ({
        ...prev,
        projectedPoints: proj,
        pointsDelta: Math.abs(proj - prev.targetPoints),
      }));
    }
  }, [startingXI]);

  // Tactical Consumable Power Chips State (One Two Inspired)
  const [tacticalChips, setTacticalChips] = useState<TacticalChipsState>({
    tripleCaptainUsed: false,
    benchBoostUsed: false,
    freeHitUsed: false,
    wildcardUsed: false,
    activeChipForNextMatch: null,
  });

  const handleActivateChip = useCallback((chip: TacticalChipType) => {
    setTacticalChips(prev => {
      if (prev.activeChipForNextMatch === chip) {
        return { ...prev, activeChipForNextMatch: null };
      }
      return { ...prev, activeChipForNextMatch: chip };
    });
  }, []);

  // January Transfer Window Modal State (Matchday 19)
  const [isJanuaryModalOpen, setIsJanuaryModalOpen] = useState<boolean>(false);

  const handleSignJanuaryPlayer = (newPlayer: Player, slotIndex: number) => {
    setStartingXI(prev => {
      const copy = [...prev];
      copy[slotIndex] = newPlayer;
      return copy;
    });
    setIsJanuaryModalOpen(false);
  };

  const handleApplyJanuaryMoraleBoost = () => {
    setPlayerFormMap(prev => {
      const updated = { ...prev };
      startingXI.forEach(p => {
        if (p) updated[p.id] = 'up';
      });
      return updated;
    });
    setIsJanuaryModalOpen(false);
  };

  // Tactical Mid-Match Substitution Handler
  const handleSubPlayer = (outIndex: number, inPlayer: Player) => {
    const currentOut = startingXI[outIndex];
    const benchIdx = bench.findIndex(b => b?.id === inPlayer.id);

    const updatedXI = [...startingXI];
    updatedXI[outIndex] = inPlayer;
    setStartingXI(updatedXI);

    if (benchIdx !== -1 && currentOut) {
      const updatedBench = [...bench];
      updatedBench[benchIdx] = currentOut;
      setBench(updatedBench);
    }
  };

  // Initialize League Table for selected game mode
  const initLeagueTable = useCallback((mode: GameMode) => {
    const opps = getLeagueOpponents(mode);
    const teams = ['Your Starting XI', ...opps.map(o => o.name)];
    const table: SeasonTableEntry[] = teams.map((team, idx) => ({
      rank: idx + 1,
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
      form: [],
    }));
    setLeagueTable(table);
  }, []);

  // Initialize Tournament Stages (UCL & World Cup)
  const initTournament = useCallback((mode: GameMode = 'champions_league') => {
    if (mode === 'world_cup') {
      const stages: TournamentStage[] = [
        { name: 'Round of 16', opponentName: 'Netherlands', isTwoLegged: false, isComplete: false, userAdvanced: false },
        { name: 'Quarter-Final', opponentName: 'England', isTwoLegged: false, isComplete: false, userAdvanced: false },
        { name: 'Semi-Final', opponentName: 'Brazil', isTwoLegged: false, isComplete: false, userAdvanced: false },
        { name: 'World Cup Final', opponentName: 'France', isTwoLegged: false, isComplete: false, userAdvanced: false },
      ];
      setTournamentStages(stages);
      setCurrentStageIdx(0);
      setIsTournamentEliminated(false);
    } else {
      const stages: TournamentStage[] = [
        { name: 'Round of 16', opponentName: 'Borussia Dortmund', isTwoLegged: true, isComplete: false, userAdvanced: false },
        { name: 'Quarter-Final', opponentName: 'Bayern Munich', isTwoLegged: true, isComplete: false, userAdvanced: false },
        { name: 'Semi-Final', opponentName: 'Paris Saint-Germain', isTwoLegged: true, isComplete: false, userAdvanced: false },
        { name: 'UCL Final', opponentName: 'Real Madrid', isTwoLegged: false, isComplete: false, userAdvanced: false },
      ];
      setTournamentStages(stages);
      setCurrentStageIdx(0);
      setIsTournamentEliminated(false);
    }
  }, []);

  // Local storage save / load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.scoutTokens !== undefined) setScoutTokens(parsed.scoutTokens);
        if (parsed.difficulty) setDifficulty(parsed.difficulty);
      }
    } catch (e) {
      console.warn('Local storage load failure:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ scoutTokens, difficulty }));
    } catch (e) {
      console.warn('Local storage save failure:', e);
    }
  }, [scoutTokens, difficulty]);

  // =========================================================================
  // MANAGER ROLLING
  // =========================================================================
  const startManagerRoll = (mode: GameMode) => {
    if (draftPhase === 'drafting') return;
    setGameMode(mode);
    setManagerRollsLeft(3);
    const initialRoll = MANAGERS[Math.floor(Math.random() * MANAGERS.length)];
    setRolledManager(initialRoll);
    // Pre-seed squad pool with eligible squads for this mode using weighted selection
    const eligible = getEligibleSquads(mode);
    setCurrentSquadPool(getWeightedRandomSquad(eligible, mode, difficulty));
    setDraftPhase('manager_roll');
  };

  const handleRollManager = () => {
    if (managerRollsLeft <= 0 || isManagerRolling) return;
    setIsManagerRolling(true);
    setManagerRollsLeft(prev => prev - 1);

    setTimeout(() => {
      // Pick random manager different from current if possible
      const filtered = MANAGERS.filter(m => m.id !== rolledManager.id);
      const nextRoll = filtered[Math.floor(Math.random() * filtered.length)] || MANAGERS[0];
      setRolledManager(nextRoll);
      setIsManagerRolling(false);
    }, 280);
  };

  const handleConfirmManager = () => {
    setManager(rolledManager);
    setFormationName(rolledManager.preferredFormation);
    // Initialize squad arrays
    setStartingXI(new Array(11).fill(null));
    setBench(new Array(5).fill(null));
    setDraftRound(1);
    setFreeRerollAvailable(true);
    setIsRerollSpin(false);
    setMatchHistory([]);
    setMatchday(1);
    setSeasonAwards(null);
    setIsSeasonComplete(false);
    setInvincibleAchieved(false);
    setIsTournamentEliminated(false);
    setSelectedSlotIndex(null);
    setSwapSelection(null);
    setPlayerToAssign(null);

    // Pick first squad pool strictly from eligible squads for this mode with mode-aware probability
    const eligible = getEligibleSquads(gameMode);
    const randomSquad = getWeightedRandomSquad(eligible, gameMode, difficulty);
    setCurrentSquadPool(randomSquad);
    setDraftPhase('drafting');

    if (gameMode === 'champions_league' || gameMode === 'world_cup') {
      initTournament(gameMode);
    } else {
      initLeagueTable(gameMode);
    }
  };

  // =========================================================================
  // DRAFTING & WHEEL
  // =========================================================================
  const handleReroll = () => {
    if (freeRerollAvailable) {
      setFreeRerollAvailable(false);
      setIsRerollSpin(true);
      setIsSpinning(true);
    } else if (scoutTokens > 0) {
      setScoutTokens(prev => prev - 1);
      setIsRerollSpin(true);
      setIsSpinning(true);
    }
  };

  const handleSpinComplete = (newSquad: SquadData) => {
    setCurrentSquadPool(newSquad);
    setIsSpinning(false);
    setIsRerollSpin(false);
  };

  const handleSelectPlayerToDraft = (player: Player) => {
    if (isDuplicatePlayer(player, [...startingXI, ...bench])) {
      showSwapNotice(`[RESTRICTION: ${player.name} IS ALREADY IN YOUR SQUAD]`);
      return;
    }
    if (gameMode === 'salary_cap') {
      const val = getPlayerSalaryValue(player.overall);
      if (salaryCapSpent + val > 350) {
        showSwapNotice(`[CAP RESTRICTION: $${salaryCapSpent + val}M EXCEEDS $350M BUDGET (REMAINING: $${350 - salaryCapSpent}M)]`);
        return;
      }
    }
    setPlayerToAssign(player);
  };

  const handleCancelAssign = () => {
    setPlayerToAssign(null);
  };

  const handleAssignPlayerToSlot = (slotType: 'starter' | 'bench', slotIndex: number) => {
    if (!playerToAssign) return;

    if (gameMode === 'salary_cap') {
      const val = getPlayerSalaryValue(playerToAssign.overall);
      if (salaryCapSpent + val > 350) {
        showSwapNotice(`[CAP RESTRICTION: $${salaryCapSpent + val}M EXCEEDS $350M BUDGET (REMAINING: $${350 - salaryCapSpent}M)]`);
        return;
      }
    }

    // Strict occupied slot check: cannot draft into an already occupied position
    if (slotType === 'starter' && startingXI[slotIndex] !== null) {
      showSwapNotice('[RESTRICTION: POSITION IS ALREADY OCCUPIED]');
      return;
    }
    if (slotType === 'bench' && bench[slotIndex] !== null) {
      showSwapNotice('[RESTRICTION: BENCH SLOT IS ALREADY OCCUPIED]');
      return;
    }

    // Strict duplicate check across active squad
    const activeSquad = slotType === 'starter'
      ? [...startingXI.slice(0, slotIndex), ...startingXI.slice(slotIndex + 1), ...bench]
      : [...startingXI, ...bench.slice(0, slotIndex), ...bench.slice(slotIndex + 1)];

    if (isDuplicatePlayer(playerToAssign, activeSquad)) {
      showSwapNotice(`[RESTRICTION: CANNOT HAVE DUPLICATE OF ${playerToAssign.name} ON SQUAD]`);
      return;
    }

    const isGK = playerToAssign.position === 'GK';

    // Strict GK constraints
    if (isGK && slotType === 'starter' && slotIndex !== 0) {
      showSwapNotice('[RESTRICTION: GOALKEEPER CANNOT BE ASSIGNED TO OUTFIELD]');
      return;
    }
    if (!isGK && slotType === 'starter' && slotIndex === 0) {
      showSwapNotice('[RESTRICTION: OUTFIELD PLAYER CANNOT BE ASSIGNED TO GOAL]');
      return;
    }

    if (slotType === 'starter') {
      const updatedXI = [...startingXI];
      updatedXI[slotIndex] = playerToAssign;
      setStartingXI(updatedXI);
      setPlayerToAssign(null);
      setSelectedSlotIndex(null);
      advanceDraftRound(updatedXI, bench, playerToAssign);
    } else {
      const updatedBench = [...bench];
      updatedBench[slotIndex] = playerToAssign;
      setBench(updatedBench);
      setPlayerToAssign(null);
      setSelectedSlotIndex(null);
      advanceDraftRound(startingXI, updatedBench, playerToAssign);
    }
  };

  const handleDraftPlayer = (player: Player) => {
    handleSelectPlayerToDraft(player);
  };

  const advanceDraftRound = (
    currentXI: (Player | null)[],
    currentBench: (Player | null)[],
    player: Player
  ) => {
    if (player.auraTrait?.rarity === 'Legendary') {
      setScoutTokens(prev => prev + 1);
    }

    const nextRound = draftRound + 1;
    // Check if starting XI is complete
    const xiComplete = currentXI.every(p => p !== null);
    const benchComplete = currentBench.every(p => p !== null);

    if (xiComplete && (nextRound > 16 || benchComplete)) {
      if (gameMode === 'champions_league' || gameMode === 'world_cup') {
        setDraftPhase('tournament_hub');
      } else if (gameMode === 'dynasty') {
        setDraftPhase('dynasty_hub');
      } else {
        setDraftPhase('season_hub');
      }
    } else {
      setDraftRound(nextRound);
      setFreeRerollAvailable(true);
      setIsRerollSpin(false);
      setIsSpinning(true);
    }
  };

  // =========================================================================
  // LINEUP MANAGEMENT & SWAPPING
  // =========================================================================
  const handleChangeFormation = (newFmtName: FormationName) => {
    setFormationName(newFmtName);
  };

  const handleSelectForSwap = (type: 'starter' | 'bench', index: number) => {
    if (!swapSelection) {
      // First player selected for swap
      setSwapSelection({ type, index });
      return;
    }

    // Second player selected: perform swap!
    const src = swapSelection;
    const dst = { type, index };

    if (src.type === dst.type && src.index === dst.index) {
      setSwapSelection(null);
      return;
    }

    if (src.type === 'starter' && dst.type === 'starter') {
      // GK constraint: starter slot 0 can never be swapped with outfield starter (1-10)
      if (src.index === 0 || dst.index === 0) {
        showSwapNotice('[RESTRICTION: GOALKEEPER CANNOT BE SWAPPED TO OUTFIELD]');
        setSwapSelection(null);
        return;
      }

      // Legal swap between outfield starters
      const updatedXI = [...startingXI];
      const temp = updatedXI[src.index];
      updatedXI[src.index] = updatedXI[dst.index];
      updatedXI[dst.index] = temp;
      setStartingXI(updatedXI);
    } else if ((src.type === 'starter' && dst.type === 'bench') || (src.type === 'bench' && dst.type === 'starter')) {
      const starterIdx = src.type === 'starter' ? src.index : dst.index;
      const benchIdx = src.type === 'bench' ? src.index : dst.index;
      const benchPlayer = bench[benchIdx];

      // GK constraint: if target starter slot is 0 (GK slot), bench player MUST be a GK
      if (starterIdx === 0) {
        if (benchPlayer !== null && benchPlayer.position !== 'GK') {
          showSwapNotice('[RESTRICTION: OUTFIELD PLAYER CANNOT PLAY IN GOAL]');
          setSwapSelection(null);
          return;
        }
      }

      // GK constraint: if target starter slot is outfield (1-10), bench player CANNOT be a GK
      if (starterIdx > 0) {
        if (benchPlayer !== null && benchPlayer.position === 'GK') {
          showSwapNotice('[RESTRICTION: GOALKEEPER CANNOT PLAY OUTFIELD]');
          setSwapSelection(null);
          return;
        }
      }

      // Legal swap between starter and bench
      const updatedXI = [...startingXI];
      const updatedBench = [...bench];
      const tempStarter = updatedXI[starterIdx];
      updatedXI[starterIdx] = updatedBench[benchIdx];
      updatedBench[benchIdx] = tempStarter;
      setStartingXI(updatedXI);
      setBench(updatedBench);
    } else if (src.type === 'bench' && dst.type === 'bench') {
      // Swap two bench players
      const updatedBench = [...bench];
      const temp = updatedBench[src.index];
      updatedBench[src.index] = updatedBench[dst.index];
      updatedBench[dst.index] = temp;
      setBench(updatedBench);
    }

    setSwapSelection(null);
  };

  const handleCancelSwap = () => {
    setSwapSelection(null);
  };

  // =========================================================================
  // SIMULATION: SINGLE MATCH & FULL 38-GAME SEASON FAST FORWARD
  // =========================================================================
  const handleSimulateNextLeagueMatch = (
    tacticalAdvantage = false,
    mindGameAdvantage: 'composure' | 'aggression' | 'counter' | null = null
  ) => {
    const maxMatchdays =
      gameMode === 'rivalry_derby'
        ? 5
        : gameMode === 'draft_roguelike'
        ? 10
        : 38;

    if (matchday > maxMatchdays || isTournamentEliminated) return;

    const opps = getLeagueOpponents(gameMode);
    const oppIndex = (matchday - 1) % opps.length;
    const opponent = opps[oppIndex];
    const isHome = matchday % 2 === 1;

    const compName =
      gameMode === 'rivalry_derby'
        ? 'Rivalry Derby Gauntlet'
        : gameMode === 'draft_roguelike'
        ? `Roguelike Boss Tower (Floor ${matchday})`
        : gameMode === 'salary_cap'
        ? 'Salary Cap Championship'
        : gameMode === 'la_liga'
        ? 'La Liga (2011-12 Season)'
        : gameMode === 'premier_league'
        ? 'Premier League (2018-19 Season)'
        : gameMode === 'serie_a'
        ? 'Serie A (1998-99 Season)'
        : 'Invincible League';

    const result = simulateMatch({
      userSquad: startingXI,
      userTactic: manager.tacticalStyle,
      manager,
      opponent,
      competition: compName,
      matchday,
      isHome,
      formation,
      tacticalScoutAdvantage: tacticalAdvantage,
      trainingFocus: dynastyState.trainingFocus,
      mindGameAdvantage,
      activeChip: tacticalChips.activeChipForNextMatch,
      selectedCaptainId: dynastyState.selectedCaptainId,
    });

    if (tacticalChips.activeChipForNextMatch) {
      const active = tacticalChips.activeChipForNextMatch;
      setTacticalChips(prev => ({
        ...prev,
        tripleCaptainUsed: prev.tripleCaptainUsed || active === 'triple_captain',
        benchBoostUsed: prev.benchBoostUsed || active === 'bench_boost',
        freeHitUsed: prev.freeHitUsed || active === 'free_hit',
        wildcardUsed: prev.wildcardUsed || active === 'wildcard',
        activeChipForNextMatch: null,
      }));
      if (active === 'wildcard') {
        setPlayerFormMap(prev => {
          const updated = { ...prev };
          startingXI.forEach(p => {
            if (p) updated[p.id] = 'up';
          });
          return updated;
        });
      }
    }

    const newHistory = [result, ...matchHistory];
    setMatchHistory(newHistory);
    setActiveModalMatch(result);

    // Update dynamic player form arrows from match ratings
    const userPlayerStats =
      result.homeStats.playerStats && result.homeStats.playerStats.length > 0
        ? result.homeStats.playerStats
        : result.awayStats.playerStats;

    setPlayerFormMap(prev => {
      const updated = { ...prev };
      userPlayerStats.forEach(ps => {
        updated[ps.playerId] = calculatePlayerForm(ps.matchRating);
      });
      return updated;
    });

    // Award roguelike perk draft if boss floor is cleared
    const userWon = result.winner === (isHome ? 'home' : 'away');
    if (gameMode === 'draft_roguelike') {
      if (userWon) {
        setPendingRoguelikeChoice(getRandomRoguelikePerks(3));
      } else {
        setIsTournamentEliminated(true);
        updateTableWithMatch(result, opponent, isHome);
        return;
      }
    }

    // Update league table
    updateTableWithMatch(result, opponent, isHome);

    const nextMatchday = matchday + 1;
    setMatchday(nextMatchday);

    if (nextMatchday === 19 && maxMatchdays === 38) {
      setIsJanuaryModalOpen(true);
    }

    if (nextMatchday > maxMatchdays) {
      setIsSeasonComplete(true);
      const fullStartingXI = startingXI.filter((p): p is Player => p !== null);
      const awards = calculateSeasonAwards(newHistory, fullStartingXI);
      setSeasonAwards(awards);

      const userWins = newHistory.filter(m => {
        const isHomeTeam = m.homeTeam === 'Your Starting XI';
        return m.winner === (isHomeTeam ? 'home' : 'away');
      }).length;
      if (userWins === maxMatchdays) {
        setInvincibleAchieved(true);
      }
    }
  };

  // Realistic Rating-Based AI League Match Simulator
  const simulateAiTeamMatch = (entry: SeasonTableEntry, opps: OpponentTeam[]) => {
    const { rating: teamRating, attackRating: teamAtt, defenseRating: teamDef } = resolveTeamRatings(
      entry.team,
      opps
    );

    // Realistic tiered probability curve
    let winProb: number;
    let drawProb: number;

    if (teamRating >= 94) {
      winProb = 0.83 + (Math.random() * 0.04 - 0.02);
      drawProb = 0.11 + (Math.random() * 0.02 - 0.01);
    } else if (teamRating >= 92) {
      winProb = 0.76 + (Math.random() * 0.04 - 0.02);
      drawProb = 0.14 + (Math.random() * 0.03 - 0.015);
    } else if (teamRating >= 88) {
      winProb = 0.65 + (Math.random() * 0.04 - 0.02);
      drawProb = 0.18 + (Math.random() * 0.03 - 0.015);
    } else if (teamRating >= 84) {
      winProb = 0.52 + (Math.random() * 0.05 - 0.025);
      drawProb = 0.24 + (Math.random() * 0.03 - 0.015);
    } else if (teamRating >= 81) {
      winProb = 0.40 + (Math.random() * 0.05 - 0.025);
      drawProb = 0.27 + (Math.random() * 0.03 - 0.015);
    } else if (teamRating >= 78) {
      winProb = 0.29 + (Math.random() * 0.04 - 0.02);
      drawProb = 0.26 + (Math.random() * 0.03 - 0.015);
    } else {
      winProb = 0.18 + (Math.random() * 0.04 - 0.02);
      drawProb = 0.22 + (Math.random() * 0.03 - 0.015);
    }

    winProb = Math.min(0.92, Math.max(0.08, winProb));
    drawProb = Math.min(0.35, Math.max(0.06, drawProb));

    const roll = Math.random();
    const isWin = roll < winProb;
    const isDraw = !isWin && roll < (winProb + drawProb);

    let matchGf = 0;
    let matchGa = 0;

    if (isWin) {
      matchGf = Math.max(1, Math.round(1.5 + (teamAtt - 80) * 0.08 + Math.random() * 1.8));
      matchGa = Math.max(0, Math.round(0.7 - (teamDef - 80) * 0.04 + Math.random() * 0.8));
      if (matchGf <= matchGa) matchGf = matchGa + 1;
    } else if (isDraw) {
      const goals = Math.random() < 0.35 ? 0 : Math.random() < 0.65 ? 1 : 2;
      matchGf = goals;
      matchGa = goals;
    } else {
      matchGa = Math.max(1, Math.round(1.6 - (teamDef - 80) * 0.05 + Math.random() * 1.5));
      matchGf = Math.max(0, Math.round(0.6 + (teamAtt - 80) * 0.04 + Math.random() * 0.7));
      if (matchGf >= matchGa) matchGa = matchGf + 1;
    }

    const formChar: 'W' | 'D' | 'L' = isWin ? 'W' : isDraw ? 'D' : 'L';

    return {
      won: entry.won + (isWin ? 1 : 0),
      drawn: entry.drawn + (isDraw ? 1 : 0),
      lost: entry.lost + (!isWin && !isDraw ? 1 : 0),
      gf: entry.gf + matchGf,
      ga: entry.ga + matchGa,
      gd: entry.gd + (matchGf - matchGa),
      points: entry.points + (isWin ? 3 : isDraw ? 1 : 0),
      formChar,
    };
  };

  const updateTableWithMatch = (
    result: MatchResult,
    opponent: { name: string },
    isHome: boolean
  ) => {
    const opps = getLeagueOpponents(gameMode);
    setLeagueTable(prevTable => {
      const userWon = result.winner === (isHome ? 'home' : 'away');
      const oppWon = result.winner === (!isHome ? 'home' : 'away');
      const isDraw = result.winner === 'draw';

      const userGf = isHome ? result.homeScore : result.awayScore;
      const userGa = isHome ? result.awayScore : result.homeScore;

      const updated = prevTable.map(entry => {
        if (entry.team === 'Your Starting XI') {
          return {
            ...entry,
            played: entry.played + 1,
            won: entry.won + (userWon ? 1 : 0),
            drawn: entry.drawn + (isDraw ? 1 : 0),
            lost: entry.lost + (oppWon ? 1 : 0),
            gf: entry.gf + userGf,
            ga: entry.ga + userGa,
            gd: entry.gd + (userGf - userGa),
            points: entry.points + (userWon ? 3 : isDraw ? 1 : 0),
            form: [...entry.form, userWon ? 'W' : isDraw ? 'D' : 'L'] as ('W' | 'D' | 'L')[],
          };
        } else if (entry.team === opponent.name) {
          return {
            ...entry,
            played: entry.played + 1,
            won: entry.won + (oppWon ? 1 : 0),
            drawn: entry.drawn + (isDraw ? 1 : 0),
            lost: entry.lost + (userWon ? 1 : 0),
            gf: entry.gf + userGa,
            ga: entry.ga + userGf,
            gd: entry.gd + (userGa - userGf),
            points: entry.points + (oppWon ? 3 : isDraw ? 1 : 0),
            form: [...entry.form, oppWon ? 'W' : isDraw ? 'D' : 'L'] as ('W' | 'D' | 'L')[],
          };
        } else {
          const sim = simulateAiTeamMatch(entry, opps);
          return {
            ...entry,
            played: entry.played + 1,
            won: sim.won,
            drawn: sim.drawn,
            lost: sim.lost,
            gf: sim.gf,
            ga: sim.ga,
            gd: sim.gd,
            points: sim.points,
            form: [...entry.form, sim.formChar] as ('W' | 'D' | 'L')[],
          };
        }
      });

      updated.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
      return updated.map((e, idx) => ({ ...e, rank: idx + 1 }));
    });
  };

  // Fast Simulate All Remaining Matches
  const handleSimulateFullSeason = () => {
    const maxMatchdays =
      gameMode === 'rivalry_derby'
        ? 5
        : gameMode === 'draft_roguelike'
        ? 10
        : 38;

    if (matchday > maxMatchdays || isTournamentEliminated) return;

    const opps = getLeagueOpponents(gameMode);
    const compName =
      gameMode === 'rivalry_derby'
        ? 'Rivalry Derby Gauntlet'
        : gameMode === 'draft_roguelike'
        ? 'Roguelike Boss Tower'
        : gameMode === 'salary_cap'
        ? 'Salary Cap Championship'
        : gameMode === 'la_liga'
        ? 'La Liga (2011-12 Season)'
        : gameMode === 'premier_league'
        ? 'Premier League (2018-19 Season)'
        : gameMode === 'serie_a'
        ? 'Serie A (1998-99 Season)'
        : 'Invincible League';

    const currentMatches: MatchResult[] = [...matchHistory];
    let workingTable = [...leagueTable];
    let eliminatedDuringSim = false;

    for (let currentMd = matchday; currentMd <= maxMatchdays; currentMd++) {
      const oppIndex = (currentMd - 1) % opps.length;
      const opponent = opps[oppIndex];
      const isHome = currentMd % 2 === 1;

      const result = simulateMatch({
        userSquad: startingXI,
        userTactic: manager.tacticalStyle,
        manager,
        opponent,
        competition: compName,
        matchday: currentMd,
        isHome,
        formation,
        trainingFocus: dynastyState.trainingFocus,
      });

      currentMatches.unshift(result);

      // Update table
      const userWon = result.winner === (isHome ? 'home' : 'away');
      const oppWon = result.winner === (!isHome ? 'home' : 'away');
      const isDraw = result.winner === 'draw';
      const userGf = isHome ? result.homeScore : result.awayScore;
      const userGa = isHome ? result.awayScore : result.homeScore;

      workingTable = workingTable.map(entry => {
        if (entry.team === 'Your Starting XI') {
          return {
            ...entry,
            played: entry.played + 1,
            won: entry.won + (userWon ? 1 : 0),
            drawn: entry.drawn + (isDraw ? 1 : 0),
            lost: entry.lost + (oppWon ? 1 : 0),
            gf: entry.gf + userGf,
            ga: entry.ga + userGa,
            gd: entry.gd + (userGf - userGa),
            points: entry.points + (userWon ? 3 : isDraw ? 1 : 0),
            form: [...entry.form, userWon ? 'W' : isDraw ? 'D' : 'L'] as ('W' | 'D' | 'L')[],
          };
        } else if (entry.team === opponent.name) {
          return {
            ...entry,
            played: entry.played + 1,
            won: entry.won + (oppWon ? 1 : 0),
            drawn: entry.drawn + (isDraw ? 1 : 0),
            lost: entry.lost + (userWon ? 1 : 0),
            gf: entry.gf + userGa,
            ga: entry.ga + userGf,
            gd: entry.gd + (userGa - userGf),
            points: entry.points + (oppWon ? 3 : isDraw ? 1 : 0),
            form: [...entry.form, oppWon ? 'W' : isDraw ? 'D' : 'L'] as ('W' | 'D' | 'L')[],
          };
        } else {
          const sim = simulateAiTeamMatch(entry, opps);
          return {
            ...entry,
            played: entry.played + 1,
            won: sim.won,
            drawn: sim.drawn,
            lost: sim.lost,
            gf: sim.gf,
            ga: sim.ga,
            gd: sim.gd,
            points: sim.points,
            form: [...entry.form, sim.formChar] as ('W' | 'D' | 'L')[],
          };
        }
      });

      if (gameMode === 'draft_roguelike' && !userWon) {
        eliminatedDuringSim = true;
        setMatchday(currentMd);
        break;
      }
    }

    workingTable.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
    const finalTable = workingTable.map((e, idx) => ({ ...e, rank: idx + 1 }));

    setLeagueTable(finalTable);
    setMatchHistory(currentMatches);

    if (eliminatedDuringSim) {
      setIsTournamentEliminated(true);
      return;
    }

    setMatchday(maxMatchdays + 1);
    setIsSeasonComplete(true);

    const fullStartingXI = startingXI.filter((p): p is Player => p !== null);
    const awards = calculateSeasonAwards(currentMatches, fullStartingXI);
    setSeasonAwards(awards);

    const userEntry = finalTable.find(e => e.team === 'Your Starting XI');
    if (userEntry && userEntry.won === maxMatchdays) {
      setInvincibleAchieved(true);
    }
  };

  // =========================================================================
  // TOURNAMENT SIMULATION
  // =========================================================================
  const handleSimulateTournamentLeg = (
    tacticalAdvantage = false,
    mindGameAdvantage: 'composure' | 'aggression' | 'counter' | null = null
  ) => {
    if (isTournamentEliminated) return;

    const stage = tournamentStages[currentStageIdx];
    if (!stage || stage.isComplete) return;

    const oppPool = gameMode === 'world_cup' ? WORLD_CUP_OPPONENTS : UCL_OPPONENTS;
    const oppTeamData = oppPool.find(o => o.name === stage.opponentName) || oppPool[0];
    const isLeg1 = !stage.leg1;
    const legNum: 1 | 2 = isLeg1 ? 1 : 2;
    const isHome = isLeg1 ? true : false;
    const compName = gameMode === 'world_cup' ? 'FIFA World Cup Knockouts' : 'UEFA Champions League';

    const result = simulateMatch({
      userSquad: startingXI,
      userTactic: manager.tacticalStyle,
      manager,
      opponent: oppTeamData,
      competition: compName,
      matchday: currentStageIdx + 1,
      isHome,
      isTwoLegged: stage.isTwoLegged,
      leg: legNum,
      firstLegResult: stage.leg1
        ? { homeScore: stage.leg1.homeScore, awayScore: stage.leg1.awayScore }
        : undefined,
      formation,
      tacticalScoutAdvantage: tacticalAdvantage,
      trainingFocus: dynastyState.trainingFocus,
      mindGameAdvantage,
      activeChip: tacticalChips.activeChipForNextMatch,
      selectedCaptainId: dynastyState.selectedCaptainId,
    });

    if (tacticalChips.activeChipForNextMatch) {
      const active = tacticalChips.activeChipForNextMatch;
      setTacticalChips(prev => ({
        ...prev,
        tripleCaptainUsed: prev.tripleCaptainUsed || active === 'triple_captain',
        benchBoostUsed: prev.benchBoostUsed || active === 'bench_boost',
        freeHitUsed: prev.freeHitUsed || active === 'free_hit',
        wildcardUsed: prev.wildcardUsed || active === 'wildcard',
        activeChipForNextMatch: null,
      }));
      if (active === 'wildcard') {
        setPlayerFormMap(prev => {
          const updated = { ...prev };
          startingXI.forEach(p => {
            if (p) updated[p.id] = 'up';
          });
          return updated;
        });
      }
    }

    setActiveModalMatch(result);
    const updatedHistory = [result, ...matchHistory];
    setMatchHistory(updatedHistory);

    const isTieFinished = !stage.isTwoLegged || !isLeg1;
    let didAdvance = false;

    if (isTieFinished) {
      if (!stage.isTwoLegged) {
        // Single leg match (e.g. World Cup knockout or UCL Final)
        didAdvance =
          (result.homeTeam === 'Your Starting XI' && result.winner === 'home') ||
          (result.awayTeam === 'Your Starting XI' && result.winner === 'away');
      } else {
        // Second leg of two-legged tie
        const totalUser =
          result.homeTeam === 'Your Starting XI'
            ? result.aggregateScore?.homeTeamTotal || result.homeScore
            : result.aggregateScore?.awayTeamTotal || result.awayScore;
        const totalOpp =
          result.homeTeam === 'Your Starting XI'
            ? result.aggregateScore?.awayTeamTotal || result.awayScore
            : result.aggregateScore?.homeTeamTotal || result.homeScore;

        if (totalUser > totalOpp) {
          didAdvance = true;
        } else if (totalUser < totalOpp) {
          didAdvance = false;
        } else {
          // Tied on aggregate after extra time -> penalties
          didAdvance =
            (result.homeTeam === 'Your Starting XI' && result.winner === 'home') ||
            (result.awayTeam === 'Your Starting XI' && result.winner === 'away');
        }
      }
    }

    setTournamentStages(prev => {
      const copy = [...prev];
      const cur = { ...copy[currentStageIdx] };

      if (isLeg1) {
        cur.leg1 = result;
        if (!cur.isTwoLegged) {
          cur.isComplete = true;
          cur.userAdvanced = didAdvance;
        }
      } else {
        cur.leg2 = result;
        cur.isComplete = true;
        cur.userAdvanced = didAdvance;
      }

      copy[currentStageIdx] = cur;
      return copy;
    });

    if (isTieFinished) {
      if (didAdvance) {
        if (currentStageIdx < tournamentStages.length - 1) {
          setCurrentStageIdx(prev => prev + 1);
          setScoutTokens(prev => prev + 2);
        } else {
          setScoutTokens(prev => prev + 5);
          const fullStartingXI = startingXI.filter((p): p is Player => p !== null);
          const awards = calculateSeasonAwards(updatedHistory, fullStartingXI);
          setSeasonAwards(awards);
        }
      } else {
        setIsTournamentEliminated(true);
      }
    }
  };

  // Dynasty actions
  const handleAdvanceDynastySeason = () => {
    const trophies: string[] = [];
    if (leagueTable[0]?.team === 'Your Starting XI') trophies.push('League Champions');
    if (tournamentStages[tournamentStages.length - 1]?.userAdvanced) trophies.push('Champions League');

    const { updatedSquad, updatedBench, updatedState, report } = processSeasonAdvance(
      startingXI,
      dynastyState,
      trophies,
      bench
    );

    setStartingXI(updatedSquad);
    setBench(updatedBench);
    setDynastyState(updatedState);
    setMatchday(1);
    setMatchHistory([]);
    setIsSeasonComplete(false);
    setSeasonAwards(null);
    initLeagueTable(gameMode);
    setSeasonTransitionReport(report);
    setTacticalChips({
      tripleCaptainUsed: false,
      benchBoostUsed: false,
      freeHitUsed: false,
      wildcardUsed: false,
      activeChipForNextMatch: null,
    });
  };

  const handleSetTrainingFocus = (focus: 'gegenpress' | 'finishing' | 'defense' | 'tiki_taka' | 'youth' | null) => {
    setDynastyState(prev => ({
      ...prev,
      trainingFocus: focus,
    }));
  };

  const handleRenewContract = (playerId: string) => {
    const extensionFee = 4; // $4M signing bonus
    if (dynastyState.budgetM < extensionFee) return;

    setDynastyState(prev => {
      const curContracts = prev.playerContracts || {};
      const playerContract = curContracts[playerId] || { yearsLeft: 1, morale: 'content' };
      return {
        ...prev,
        budgetM: prev.budgetM - extensionFee,
        playerContracts: {
          ...curContracts,
          [playerId]: {
            yearsLeft: playerContract.yearsLeft + 3,
            morale: 'superb',
          },
        },
      };
    });
  };

  const handleSetCaptain = (playerId: string) => {
    setDynastyState(prev => ({
      ...prev,
      selectedCaptainId: playerId,
    }));
  };

  const handleDraftWonderkid = (wonderkid: Player) => {
    let emptyStarterIdx = startingXI.findIndex(p => p === null);
    let emptyBenchIdx = bench.findIndex(p => p === null);

    if (emptyStarterIdx !== -1) {
      const updatedXI = [...startingXI];
      updatedXI[emptyStarterIdx] = wonderkid;
      setStartingXI(updatedXI);
    } else if (emptyBenchIdx !== -1) {
      const updatedBench = [...bench];
      updatedBench[emptyBenchIdx] = wonderkid;
      setBench(updatedBench);
    } else {
      return;
    }

    setDynastyState(prev => ({
      ...prev,
      budgetM: Math.max(0, prev.budgetM - (wonderkid.valueM || 50)),
      wonderkidsDrafted: [...prev.wonderkidsDrafted, wonderkid.id],
      playerContracts: {
        ...(prev.playerContracts || {}),
        [wonderkid.id]: { yearsLeft: 4, morale: 'superb' },
      },
    }));
  };

  const handleUpgradeFacility = (facility: keyof FacilityUpgrades) => {
    const curLevel = dynastyState.facilities[facility];
    if (curLevel >= 5) return;
    const cost = FACILITY_UPGRADE_COSTS[curLevel + 1];
    if (dynastyState.budgetM < cost) return;

    setDynastyState(prev => ({
      ...prev,
      budgetM: prev.budgetM - cost,
      facilities: {
        ...prev.facilities,
        [facility]: curLevel + 1,
      },
    }));
  };

  const handleBuyTransferPlayer = (listing: TransferMarketListing) => {
    if (dynastyState.budgetM < listing.askingPriceM) return;
    let emptyStarterIdx = startingXI.findIndex(p => p === null);
    let emptyBenchIdx = bench.findIndex(p => p === null);

    if (emptyStarterIdx !== -1) {
      const updatedXI = [...startingXI];
      updatedXI[emptyStarterIdx] = listing.player;
      setStartingXI(updatedXI);
    } else if (emptyBenchIdx !== -1) {
      const updatedBench = [...bench];
      updatedBench[emptyBenchIdx] = listing.player;
      setBench(updatedBench);
    } else {
      return;
    }

    setDynastyState(prev => ({
      ...prev,
      budgetM: prev.budgetM - listing.askingPriceM,
      playerContracts: {
        ...(prev.playerContracts || {}),
        [listing.player.id]: { yearsLeft: 3, morale: 'high' },
      },
    }));
  };

  const handleSellPlayer = (playerId: string) => {
    const starterIdx = startingXI.findIndex(p => p?.id === playerId);
    const benchIdx = bench.findIndex(p => p?.id === playerId);
    let soldPlayer: Player | null = null;

    if (starterIdx !== -1) {
      soldPlayer = startingXI[starterIdx];
      const updated = [...startingXI];
      updated[starterIdx] = null;
      setStartingXI(updated);
    } else if (benchIdx !== -1) {
      soldPlayer = bench[benchIdx];
      const updated = [...bench];
      updated[benchIdx] = null;
      setBench(updated);
    }

    if (!soldPlayer) return;
    const salePrice = calculatePlayerSaleValue(soldPlayer);

    setDynastyState(prev => {
      const curContracts = { ...(prev.playerContracts || {}) };
      delete curContracts[playerId];
      return {
        ...prev,
        budgetM: prev.budgetM + salePrice,
        playerContracts: curContracts,
      };
    });
  };

  const handleHireStaff = (staff: DynastyStaffMember) => {
    setDynastyState(prev => hireStaffMember(prev, staff));
  };

  const handleSignSponsor = (sponsor: CommercialSponsor) => {
    setDynastyState(prev => signCommercialSponsor(prev, sponsor));
  };

  const handleLoanPlayer = (playerId: string, destinationClub: string) => {
    const starterIdx = startingXI.findIndex(p => p?.id === playerId);
    const benchIdx = bench.findIndex(p => p?.id === playerId);
    let targetPlayer: Player | null = null;

    if (starterIdx !== -1) {
      targetPlayer = startingXI[starterIdx];
      const updated = [...startingXI];
      updated[starterIdx] = null;
      setStartingXI(updated);
    } else if (benchIdx !== -1) {
      targetPlayer = bench[benchIdx];
      const updated = [...bench];
      updated[benchIdx] = null;
      setBench(updated);
    }

    if (!targetPlayer) return;
    setDynastyState(prev => loanOutPlayer(prev, targetPlayer, destinationClub).updatedState);
  };

  const handleStartTour = (tour: PreSeasonTour) => {
    setDynastyState(prev => conductPreSeasonTour(prev, tour));
  };

  // Home & Restart
  const handleGoHome = () => {
    setIsTournamentEliminated(false);
    setActiveModalMatch(null);
    setIsJanuaryModalOpen(false);
    setDraftPhase('mode_select');
  };

  const handleRestartGame = () => {
    setStartingXI(new Array(11).fill(null));
    setBench(new Array(5).fill(null));
    setMatchHistory([]);
    setLeagueTable([]);
    setActiveModalMatch(null);
    setIsJanuaryModalOpen(false);
    setMatchday(1);
    setSeasonAwards(null);
    setIsSeasonComplete(false);
    setInvincibleAchieved(false);
    setIsTournamentEliminated(false);
    setSelectedSlotIndex(null);
    setSwapSelection(null);
    setShowRestartConfirm(false);
    setSetPieceTakers({ penalty: null, freeKick: null, corner: null });
    setPlayerFormMap({});
    setRoguelikePerks([]);
    setPendingRoguelikeChoice(null);
    setTacticalChips({
      tripleCaptainUsed: false,
      benchBoostUsed: false,
      freeHitUsed: false,
      wildcardUsed: false,
      activeChipForNextMatch: null,
    });
    setDraftPhase('mode_select');
  };

  const teamChemistry = calculateTeamChemistry(startingXI, formation);

  return {
    gameMode,
    setGameMode,
    teamChemistry,
    difficulty,
    setDifficulty: (diff: GameDifficulty) => {
      if (draftPhase === 'drafting') return;
      setDifficulty(diff);
    },
    toggleDifficulty: () => {
      if (draftPhase === 'drafting') return;
      setDifficulty(d => (d === 'classic' ? 'expert' : d === 'expert' ? 'super_expert' : 'classic'));
    },
    manager,
    setManager,
    rolledManager,
    managerRollsLeft,
    isManagerRolling,
    startManagerRoll,
    handleRollManager,
    handleConfirmManager,
    formationName,
    setFormationName,
    formation,
    handleChangeFormation,
    draftPhase,
    setDraftPhase,
    draftRound,
    currentSquadPool,
    isSpinning,
    isRerollSpin,
    freeRerollAvailable,
    scoutTokens,
    setScoutTokens,
    startingXI,
    setStartingXI,
    bench,
    setBench,
    selectedSlotIndex,
    setSelectedSlotIndex,
    swapSelection,
    handleSelectForSwap,
    handleCancelSwap,
    playerToAssign,
    handleSelectPlayerToDraft,
    handleAssignPlayerToSlot,
    handleCancelAssign,
    swapNotice,
    setSwapNotice,
    matchday,
    matchHistory,
    activeModalMatch,
    setActiveModalMatch,
    leagueTable,
    seasonAwards,
    setSeasonAwards,
    isSeasonComplete,
    invincibleAchieved,
    showRestartConfirm,
    setShowRestartConfirm,
    tournamentStages,
    currentStageIdx,
    isTournamentEliminated,
    dynastyState,
    setPieceTakers,
    assignSetPieceTaker,
    playerFormMap,
    salaryCapSpent,
    roguelikePerks,
    pendingRoguelikeChoice,
    selectRoguelikePerk,
    handleSubPlayer,
    handleReroll,
    handleSpinComplete,
    handleDraftPlayer,
    handleSimulateNextLeagueMatch,
    handleSimulateFullSeason,
    handleSimulateTournamentLeg,
    handleAdvanceDynastySeason,
    handleDraftWonderkid,
    handleUpgradeFacility,
    handleBuyTransferPlayer,
    handleSellPlayer,
    handleHireStaff,
    handleSignSponsor,
    handleLoanPlayer,
    handleStartTour,
    handleGoHome,
    handleRestartGame,
    seasonTransitionReport,
    setSeasonTransitionReport,
    handleSetTrainingFocus,
    handleRenewContract,
    handleSetCaptain,
    onTheMoneyState,
    setOnTheMoneyState,
    handleSetOnTheMoneyTarget,
    isJanuaryModalOpen,
    setIsJanuaryModalOpen,
    handleSignJanuaryPlayer,
    handleApplyJanuaryMoraleBoost,
    tacticalChips,
    handleActivateChip,
  };
}
