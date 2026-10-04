import React, { useState, useMemo } from 'react';
import { useDraftSim, getPlayerSalaryValue } from './hooks/useDraftSim';
import { Navbar } from './components/Navbar';
import { SlotWheel } from './components/SlotWheel';
import { DraftCard } from './components/DraftCard';
import { PitchView } from './components/PitchView';
import { MatchSimModal } from './components/MatchSimModal';
import { SeasonTable } from './components/SeasonTable';
import { AwardsModal } from './components/AwardsModal';
import { DynastyHub } from './components/DynastyHub';
import { SeasonTransitionModal } from './components/SeasonTransitionModal';
import { TournamentBracket } from './components/TournamentBracket';
import { ShareTeamModal } from './components/ShareTeamModal';
import { SuperExpertDraftInput } from './components/SuperExpertDraftInput';
import { WalkoutCeremony } from './components/WalkoutCeremony';
import { soundEngine } from './utils/soundEngine';
import { GameMode, Player, BuiltPlayerResult, MatchResult } from './types/football';
import { getLeagueOpponents } from './data/opponents';
import { getEligibleSquads } from './data/squads';
import { isDuplicatePlayer, getChemistryBonusForDraft } from './engine/chemistryEngine';
import { calculatePositionFit } from './engine/positionEngine';
import { simulateMatch } from './engine/simulationEngine';
import { OnTheMoneyTombola, OnTheMoneyPaceBanner } from './components/OnTheMoneyTombola';
import { BuildAPlayerStudio } from './components/BuildAPlayerStudio';
import { JanuaryDeadlineModal } from './components/JanuaryDeadlineModal';
import { SurvivalGauntlet } from './components/SurvivalGauntlet';
import { TeammateChainPuzzleModal } from './components/TeammateChainPuzzleModal';
import { PlayerCareerMode } from './components/PlayerCareerMode';
import { TacticalChipsBar } from './components/TacticalChipsBar';
import { MysteryPlayerWordleModal } from './components/MysteryPlayerWordleModal';
import { ManagerProfileCardModal } from './components/ManagerProfileCardModal';
import { SquadReportModal } from './components/SquadReportModal';
import { AftergameSummaryModal } from './components/AftergameSummaryModal';
import { Crown, Trophy, Sparkles, Flame, Shield, Swords, Globe, ArrowRight, Zap, Play, FastForward, CheckCircle2, ChevronRight, RefreshCw, Calendar, Users, History, BarChart3, Coins, Target, Lock, ArrowUpDown, SlidersHorizontal, AlertCircle, Crosshair, Compass, BookOpen, Building2, Mic, MessageSquare, ShieldAlert, Link2, HelpCircle, UserCheck, Activity } from 'lucide-react';

export function App() {
  const {
    gameMode,
    difficulty,
    setDifficulty,
    toggleDifficulty,
    manager,
    rolledManager,
    managerRollsLeft,
    isManagerRolling,
    startManagerRoll,
    handleRollManager,
    handleConfirmManager,
    formationName,
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
    bench,
    selectedSlotIndex,
    setSelectedSlotIndex,
    swapSelection,
    handleSelectForSwap,
    playerToAssign,
    handleSelectPlayerToDraft,
    handleAssignPlayerToSlot,
    handleCancelAssign,
    swapNotice,
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
    teamChemistry,
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
    handleSetOnTheMoneyTarget,
    isJanuaryModalOpen,
    setIsJanuaryModalOpen,
    handleSignJanuaryPlayer,
    handleApplyJanuaryMoraleBoost,
    setStartingXI,
    tacticalChips,
    handleActivateChip,
  } = useDraftSim();

  // Tab state in Season Hub
  const [hubTab, setHubTab] = useState<'pitch' | 'table' | 'history'>('pitch');
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD'>('ALL');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSetPieceDrawerOpen, setIsSetPieceDrawerOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(soundEngine.isMuted());
  const [walkoutPlayer, setWalkoutPlayer] = useState<Player | null>(null);
  const [showScoutingModal, setShowScoutingModal] = useState(false);
  const [tacticalEdgeActive, setTacticalEdgeActive] = useState(false);
  const [mindGameChoice, setMindGameChoice] = useState<'composure' | 'aggression' | 'counter' | null>(null);

  // 38-0-0 & One Two Feature Modals
  const [showTeammateChainModal, setShowTeammateChainModal] = useState(false);
  const [showBuildAPlayerStudio, setShowBuildAPlayerStudio] = useState(false);
  const [showSurvivalGauntlet, setShowSurvivalGauntlet] = useState(false);
  const [showOnTheMoneyTombola, setShowOnTheMoneyTombola] = useState(false);
  const [showPlayerCareer, setShowPlayerCareer] = useState(false);
  const [playerCareerImportCandidate, setPlayerCareerImportCandidate] = useState<BuiltPlayerResult | null>(null);
  const [showMysteryWordle, setShowMysteryWordle] = useState(false);
  const [showManagerDNA, setShowManagerDNA] = useState(false);
  const [showSquadReportModal, setShowSquadReportModal] = useState(false);
  const [summaryModalMatch, setSummaryModalMatch] = useState<MatchResult | null>(null);

  const captainPlayer = useMemo(() => {
    return startingXI.find(p => p?.id === dynastyState.selectedCaptainId) || startingXI.find(p => p !== null) || null;
  }, [startingXI, dynastyState.selectedCaptainId]);

  const handleDraftWithWalkout = (player: Player) => {
    handleSelectPlayerToDraft(player);
    if (player.overall >= 88 || player.auraTrait?.rarity === 'Legendary') {
      setWalkoutPlayer(player);
    }
  };

  // Check empty slots in starting XI
  const hasEmptyGkSlot = useMemo(() => startingXI[0] === null, [startingXI]);
  const hasEmptyOutfieldSlot = useMemo(() => startingXI.slice(1).some(s => s === null), [startingXI]);
  const emptyStarterSlots = useMemo(() => {
    return formation.slots
      .map((slot, idx) => ({ slot, idx }))
      .filter(item => startingXI[item.idx] === null);
  }, [formation.slots, startingXI]);

  const maxMatchdays = useMemo(() => {
    return gameMode === 'rivalry_derby' ? 5 : gameMode === 'draft_roguelike' ? 10 : 38;
  }, [gameMode]);

  const leagueOpps = useMemo(() => getLeagueOpponents(gameMode), [gameMode]);
  const nextOpponent = matchday <= maxMatchdays ? leagueOpps[(matchday - 1) % leagueOpps.length] : null;

  // Memoized squad lookup to prevent redundant looping on every render
  const activeSquad = useMemo(() => [...startingXI, ...bench], [startingXI, bench]);
  const draftedIdsSet = useMemo(() => {
    const set = new Set<string>();
    activeSquad.forEach(p => {
      if (p) set.add(p.id);
    });
    return set;
  }, [activeSquad]);
  const hasEmptyBench = useMemo(() => bench.some(b => b === null), [bench]);

  const teamRating = useMemo(() => {
    const starters = startingXI.filter((p): p is Player => p !== null);
    if (starters.length === 0) return 0;
    return Math.round(starters.reduce((acc, p) => acc + p.overall, 0) / starters.length);
  }, [startingXI]);

  // Mid-draft mode locking confirmation state
  const [showDraftAbandonConfirm, setShowDraftAbandonConfirm] = useState(false);

  const handleSafeGoHome = () => {
    if (draftPhase === 'drafting') {
      setShowDraftAbandonConfirm(true);
    } else {
      handleGoHome();
    }
  };

  // Automatically sort by highest OVR in Classic mode; keep raw squad order secret in Expert/Super Expert
  const availablePlayers = useMemo(() => {
    const filtered = positionFilter === 'ALL'
      ? currentSquadPool.players
      : currentSquadPool.players.filter(p => p.position === positionFilter);

    if (difficulty === 'classic') {
      return [...filtered].sort((a, b) => b.overall - a.overall);
    }
    return filtered;
  }, [currentSquadPool.players, positionFilter, difficulty]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#080d15] via-[#0a1019] to-[#06090f] text-[#c9d1d9] flex flex-col font-sans pb-12 select-none overflow-x-hidden">
      {/* Stadium Ambient Floodlight Aura Beam Overlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute top-48 left-10 w-[300px] h-[300px] bg-amber-500/5 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-48 right-10 w-[300px] h-[300px] bg-cyan-500/5 blur-3xl pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <Navbar
        scoutTokens={scoutTokens}
        freeRerollAvailable={freeRerollAvailable}
        gameMode={gameMode}
        difficulty={difficulty}
        onToggleDifficulty={toggleDifficulty}
        draftRound={draftRound}
        isDraftPhase={draftPhase === 'drafting'}
        onGoHome={handleSafeGoHome}
        onRestart={() => setShowRestartConfirm(true)}
        isMuted={soundMuted}
        onToggleMute={() => {
          const m = soundEngine.toggleMute();
          setSoundMuted(m);
        }}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 py-4 space-y-4">
        {/* Global Restriction Notice Banner */}
        {swapNotice && (
          <div className="p-3 bg-gradient-to-r from-rose-950/90 via-[#21090e] to-rose-950/90 border border-rose-600 text-rose-200 text-xs font-mono font-bold uppercase text-center tracking-wide rounded-xl shadow-md">
            {swapNotice}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. ORIGINAL HOME SCREEN CAMPAIGN SELECTION (RESTORED & SELECTIVELY REFINED) */}
        {/* ========================================================================= */}
        {draftPhase === 'mode_select' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Hero Banner with Stadium Championship Ambience */}
            <div className="relative text-center py-8 px-4 rounded-3xl bg-gradient-to-b from-[#131d2c]/90 via-[#0e1520]/80 to-[#070b10] border border-slate-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.7)] overflow-hidden space-y-4">
              {/* Rotating Divine God-Rays */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none opacity-25 animate-divine-rays">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-transparent blur-2xl" />
              </div>
              <div className="absolute inset-0 pointer-events-none holo-sheen opacity-20" />

              <div className="relative z-10 inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-amber-400/25 to-yellow-500/10 border-2 border-amber-400/60 text-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.4)]">
                <Crown className="w-10 h-10 text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
              </div>
              <h1 className="relative z-10 text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase font-sans drop-shadow-lg">
                <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent">
                  Tactical Draft: 38-0
                </span>
              </h1>
              <p className="relative z-10 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
                Draft 16 world-class footballers across verified historic eras, unlock authentic Club & Country Aura chemistry, and chase absolute football immortality.
              </p>
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-mono">
                <span className="px-3 py-1 rounded-xl bg-[#141c28]/90 border border-slate-700/80 text-slate-200 font-bold shadow-sm">
                  162 Real Official Squads (1990–2024)
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                  Club & Nation Chemistry
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  Tactician Perks & Shapes
                </span>
              </div>

              {/* Quick Minigame Shortcuts */}
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs font-mono">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setShowPlayerCareer(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border border-amber-500/50 hover:border-amber-400 hover:bg-amber-950/60 text-amber-300 font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚽ Player Career Mode</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setShowBuildAPlayerStudio(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-950/60 text-emerald-300 font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>⭐ Build A Player Studio</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setShowTeammateChainModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600/30 to-cyan-600/30 border border-teal-500/50 hover:border-teal-400 hover:bg-teal-950/60 text-teal-300 font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  <Link2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>🔗 Teammate Chain</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setShowMysteryWordle(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 hover:border-purple-400 hover:bg-purple-950/60 text-purple-300 font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>❓ "Who Are Ya?" Wordle</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setShowManagerDNA(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600/30 to-indigo-600/30 border border-sky-500/50 hover:border-sky-400 hover:bg-sky-950/60 text-sky-300 font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>👔 Manager DNA Card</span>
                </button>
              </div>
            </div>

            {/* Difficulty Mode Selection Prior to Starting Campaign */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-gradient-to-r from-[#141d2b] to-[#0f1724] border border-slate-700/80 rounded-2xl shadow-xl font-mono">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <SlidersHorizontal className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-1.5">
                    SELECT DRAFT DIFFICULTY
                    <span className="text-[10px] text-amber-400 font-bold">(LOCKED ONCE DRAFT STARTS)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                    {difficulty === 'classic'
                      ? 'Classic: Visible OVR ratings automatically sorted by highest OVR'
                      : difficulty === 'expert'
                      ? 'Expert: Hidden OVR & auras with true tactical attribute scouting'
                      : 'Super Expert: Textbox recall challenge with mystery roster board'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                {(['classic', 'expert', 'super_expert'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => {
                      soundEngine.playClick();
                      setDifficulty(d);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold border transition-all duration-150 active:scale-95 flex items-center gap-1.5 ${
                      difficulty === d
                        ? d === 'super_expert'
                          ? 'bg-gradient-to-r from-rose-950 via-[#360812] to-amber-950 border-rose-500 text-rose-200 shadow-[0_0_14px_rgba(244,63,94,0.45)] ring-1 ring-rose-400/60'
                          : d === 'expert'
                          ? 'bg-gradient-to-r from-purple-950 via-[#230f36] to-purple-950 border-purple-500/90 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                          : 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                        : 'bg-[#18212e]/70 border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {d === 'super_expert' && <Flame className="w-3.5 h-3.5 text-rose-400 fill-current animate-pulse" />}
                    <span>{d === 'super_expert' ? 'SUPER EXPERT' : d.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Challenge Cards Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-black font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                  Select Game Campaign
                </label>
                <span className="text-[11px] font-mono text-slate-400 font-medium">
                  Choose a challenge to roll your tactician
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'invincible',
                    title: 'The Invincible 38-0-0',
                    desc: 'The benchmark of perfection. Full 38-game league campaign. Win every single match with zero draws or losses for immortal status.',
                    icon: Crown,
                    badge: 'THE GAUNTLET',
                    category: '38 Matches · League Table',
                    accentColor: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/15 shadow-[0_0_15px_rgba(52,211,153,0.3)]',
                    badgeColor: 'border-emerald-500/60 bg-emerald-950/90 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.2)]',
                    hoverBorder: 'hover:border-emerald-400 hover:shadow-[0_10px_35px_rgba(52,211,153,0.25)]',
                    glowGradient: 'from-emerald-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-emerald-400/50',
                  },
                  {
                    id: 'la_liga',
                    title: 'Hardest La Liga (2011-12)',
                    desc: 'Can you achieve 38-0-0 against Mourinho\'s record 100-pt Real Madrid, Guardiola\'s peak Barcelona, and Falcao\'s Atletico?',
                    icon: Flame,
                    badge: 'PEAK DIFFICULTY',
                    category: '38 Matches · Spanish Top Flight',
                    accentColor: 'border-rose-500/50 text-rose-400 bg-rose-500/15 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
                    badgeColor: 'border-rose-500/60 bg-rose-950/90 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.2)]',
                    hoverBorder: 'hover:border-rose-400 hover:shadow-[0_10px_35px_rgba(244,63,94,0.25)]',
                    glowGradient: 'from-rose-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-rose-400/50',
                  },
                  {
                    id: 'premier_league',
                    title: 'Hardest Premier League (2018-19)',
                    desc: 'Run the gauntlet against 98-pt Manchester City, 97-pt Liverpool, and Eden Hazard\'s Europa-winning Chelsea.',
                    icon: Swords,
                    badge: 'ULTRA COMPETITIVE',
                    category: '38 Matches · English Gauntlet',
                    accentColor: 'border-sky-500/50 text-sky-400 bg-sky-500/15 shadow-[0_0_15px_rgba(56,189,248,0.3)]',
                    badgeColor: 'border-sky-500/60 bg-sky-950/90 text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.2)]',
                    hoverBorder: 'hover:border-sky-400 hover:shadow-[0_10px_35px_rgba(56,189,248,0.25)]',
                    glowGradient: 'from-sky-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-sky-400/50',
                  },
                  {
                    id: 'serie_a',
                    title: 'Hardest Serie A (1998-99)',
                    desc: 'Survive the golden era of the Seven Sisters: AC Milan, Lazio, Batistuta\'s Fiorentina, Parma, Roma, Juventus, and Inter.',
                    icon: Shield,
                    badge: 'CALCIO SEVEN SISTERS',
                    category: '38 Matches · Italian Golden Era',
                    accentColor: 'border-amber-500/50 text-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
                    badgeColor: 'border-amber-500/60 bg-amber-950/90 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
                    hoverBorder: 'hover:border-amber-400 hover:shadow-[0_10px_35px_rgba(245,158,11,0.25)]',
                    glowGradient: 'from-amber-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-amber-400/50',
                  },
                  {
                    id: 'champions_league',
                    title: 'UEFA Champions League',
                    desc: 'High stakes 2-legged knockout ties exclusively against Europe\'s greatest historical clubs leading to the European Cup Final.',
                    icon: Trophy,
                    badge: 'CLUB TOURNAMENT',
                    category: 'Knockout Ties · European Glory',
                    accentColor: 'border-indigo-500/50 text-indigo-400 bg-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
                    badgeColor: 'border-indigo-500/60 bg-indigo-950/90 text-indigo-300 shadow-[0_0_8px_rgba(99,102,241,0.2)]',
                    hoverBorder: 'hover:border-indigo-400 hover:shadow-[0_10px_35px_rgba(99,102,241,0.3)]',
                    glowGradient: 'from-indigo-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-indigo-400/50',
                  },
                  {
                    id: 'world_cup',
                    title: 'FIFA World Cup',
                    desc: 'Draft strictly from national teams (underdogs and powerhouses). 4 single-elimination knockout battles for international glory.',
                    icon: Globe,
                    badge: 'INTERNATIONAL GLORY',
                    category: 'Knockout Drama · National Teams Only',
                    accentColor: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/15 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
                    badgeColor: 'border-yellow-500/60 bg-yellow-950/90 text-yellow-300 shadow-[0_0_8px_rgba(234,179,8,0.2)]',
                    hoverBorder: 'hover:border-yellow-400 hover:shadow-[0_10px_35px_rgba(234,179,8,0.3)]',
                    glowGradient: 'from-yellow-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-yellow-400/50',
                  },
                  {
                    id: 'dynasty',
                    title: 'Dynasty Franchise Mode',
                    desc: 'Multi-season campaign with squad aging, retirements, transfer budget management, and youth academy wonderkid signings.',
                    icon: Sparkles,
                    badge: 'MULTI-SEASON LEGACY',
                    category: 'Endless Seasons · Wonderkid Academy',
                    accentColor: 'border-purple-500/50 text-purple-400 bg-purple-500/15 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
                    badgeColor: 'border-purple-500/60 bg-purple-950/90 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.2)]',
                    hoverBorder: 'hover:border-purple-400 hover:shadow-[0_10px_35px_rgba(168,85,247,0.3)]',
                    glowGradient: 'from-purple-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-purple-400/50',
                  },
                  {
                    id: 'rivalry_derby',
                    title: 'Rivalry Derby Gauntlet',
                    desc: '5 of world football\'s most fiery derbies: El Clásico, Derby della Madonnina, Der Klassiker, North London, and Superclásico. Extreme cards and aura tension.',
                    icon: Swords,
                    badge: '5 RIVAL CLASHES',
                    category: '5 High-Stakes Clashes · Rivalry Tension',
                    accentColor: 'border-red-500/50 text-red-400 bg-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
                    badgeColor: 'border-red-500/60 bg-red-950/90 text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.2)]',
                    hoverBorder: 'hover:border-red-400 hover:shadow-[0_10px_35px_rgba(239,68,68,0.3)]',
                    glowGradient: 'from-red-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-red-400/50',
                  },
                  {
                    id: 'salary_cap',
                    title: 'Salary Cap Challenge ($350M)',
                    desc: 'Strict financial budgeting. Draft your 16-player squad within a hard $350M budget. Balance 90+ Galácticos with high-IQ budget gems.',
                    icon: Coins,
                    badge: 'BUDGET MANAGEMENT',
                    category: '38 Matches · $350M Hard Cap',
                    accentColor: 'border-amber-500/50 text-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
                    badgeColor: 'border-amber-500/60 bg-amber-950/90 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
                    hoverBorder: 'hover:border-amber-400 hover:shadow-[0_10px_35px_rgba(245,158,11,0.3)]',
                    glowGradient: 'from-amber-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-amber-400/50',
                  },
                  {
                    id: 'draft_roguelike',
                    title: 'Roguelike Boss Tower',
                    desc: 'Ascend a 10-floor tower of all-time football titans. After each boss victory, draft powerful Roguelike Perk Cards to supercharge your squad tactics.',
                    icon: Zap,
                    badge: '10-FLOOR TOWER',
                    category: '10 Boss Floors · Roguelike Perks',
                    accentColor: 'border-violet-500/50 text-violet-400 bg-violet-500/15 shadow-[0_0_15px_rgba(139,92,246,0.3)]',
                    badgeColor: 'border-violet-500/60 bg-violet-950/90 text-violet-300 shadow-[0_0_8px_rgba(139,92,246,0.2)]',
                    hoverBorder: 'hover:border-violet-400 hover:shadow-[0_10px_35px_rgba(139,92,246,0.3)]',
                    glowGradient: 'from-violet-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-violet-400/50',
                  },
                  {
                    id: 'on_the_money',
                    title: 'On The Money 🎯',
                    desc: 'Spin a points target (35–105 pts) and draft an XI to land your projected 38-game season right on it. Nail it exactly to go On The Money!',
                    icon: Target,
                    badge: '38-0-0 SIGNATURE',
                    category: '38 Matches · Points Target Challenge',
                    accentColor: 'border-amber-500/50 text-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
                    badgeColor: 'border-amber-500/60 bg-amber-950/90 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
                    hoverBorder: 'hover:border-amber-400 hover:shadow-[0_10px_35px_rgba(245,158,11,0.3)]',
                    glowGradient: 'from-amber-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-amber-400/50',
                  },
                  {
                    id: 'build_a_player',
                    title: 'Build A Player ⭐',
                    desc: 'Spin 11 footballers. Take one attribute from each across 11 key metrics (Pace, Shooting, Passing, Defending, IQ, etc.). Simulate their career & draft them into your squad!',
                    icon: Sparkles,
                    badge: 'PLAYER STUDIO',
                    category: '11 Attribute Draft · Procedural Career',
                    accentColor: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/15 shadow-[0_0_15px_rgba(52,211,153,0.3)]',
                    badgeColor: 'border-emerald-500/60 bg-emerald-950/90 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.2)]',
                    hoverBorder: 'hover:border-emerald-400 hover:shadow-[0_10px_35px_rgba(52,211,153,0.3)]',
                    glowGradient: 'from-emerald-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-emerald-400/50',
                  },
                  {
                    id: 'last_one_standing',
                    title: 'Last One Standing ⚔️',
                    desc: 'Cutthroat 5-round elimination tournament. Hit the score or clean-sheet target each round or face instant elimination! Includes 1 Redemption Playoff chance.',
                    icon: ShieldAlert,
                    badge: 'SURVIVAL GAUNTLET',
                    category: '5 Elimination Rounds · Redemption Life',
                    accentColor: 'border-rose-500/50 text-rose-400 bg-rose-500/15 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
                    badgeColor: 'border-rose-500/60 bg-rose-950/90 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.2)]',
                    hoverBorder: 'hover:border-rose-400 hover:shadow-[0_10px_35px_rgba(244,63,94,0.3)]',
                    glowGradient: 'from-rose-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-rose-400/50',
                  },
                  {
                    id: 'teammate_chain',
                    title: 'Teammate Chain 🔗',
                    desc: 'Connect legendary football icons (e.g. Cristiano Ronaldo to Thierry Henry) through mutual dressing room teammates in historic seasons! Earn Scout Tokens & bonus perks.',
                    icon: Link2,
                    badge: 'TRIVIA PUZZLE',
                    category: 'Locker Room Pathfinder · Scout Rewards',
                    accentColor: 'border-teal-500/50 text-teal-400 bg-teal-500/15 shadow-[0_0_15px_rgba(20,184,166,0.3)]',
                    badgeColor: 'border-teal-500/60 bg-teal-950/90 text-teal-300 shadow-[0_0_8px_rgba(20,184,166,0.2)]',
                    hoverBorder: 'hover:border-teal-400 hover:shadow-[0_10px_35px_rgba(20,184,166,0.3)]',
                    glowGradient: 'from-teal-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-teal-400/50',
                  },
                  {
                    id: 'player_career',
                    title: 'Player Career Mode ⚽',
                    desc: 'Live 20 legendary seasons as a footballer! Breakthrough as a wonderkid, face 85th-min hero moments, earn skill points, sign transfer deals with Real Madrid or Man City, and chase the Ballon d\'Or.',
                    icon: Crown,
                    badge: 'PRO CAREER 2.0',
                    category: '20 Seasons · RPG Skill Tree · GOAT Index',
                    accentColor: 'border-amber-500/50 text-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
                    badgeColor: 'border-amber-500/60 bg-amber-950/90 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
                    hoverBorder: 'hover:border-amber-400 hover:shadow-[0_10px_35px_rgba(245,158,11,0.3)]',
                    glowGradient: 'from-amber-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-amber-400/50',
                  },
                  {
                    id: 'who_are_ya',
                    title: 'Who Are Ya? Mystery Player ❓',
                    desc: 'Guess the mystery superstar in 6 attempts! Color-coded clue tiles reveal Nationality, League, Club, Position, OVR & Age higher/lower hints. Earn Scout Tokens & build streaks!',
                    icon: HelpCircle,
                    badge: 'ONE TWO MINI-GAME',
                    category: 'Football Wordle · 6 Attempts · Daily Streak',
                    accentColor: 'border-purple-500/50 text-purple-400 bg-purple-500/15 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
                    badgeColor: 'border-purple-500/60 bg-purple-950/90 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.2)]',
                    hoverBorder: 'hover:border-purple-400 hover:shadow-[0_10px_35px_rgba(168,85,247,0.3)]',
                    glowGradient: 'from-purple-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-purple-400/50',
                  },
                  {
                    id: 'manager_dna',
                    title: 'Manager Tactical DNA 👔',
                    desc: 'Inspect your holographic managerial identity! Analyzes your tactical philosophy, win rate, 38-0 Invincible runs, risk index, and shareable scout credentials card.',
                    icon: UserCheck,
                    badge: 'ONE TWO SOCIAL PROFILE',
                    category: 'Holographic Card · Tactical Analysis · Share',
                    accentColor: 'border-sky-500/50 text-sky-400 bg-sky-500/15 shadow-[0_0_15px_rgba(14,165,233,0.3)]',
                    badgeColor: 'border-sky-500/60 bg-sky-950/90 text-sky-300 shadow-[0_0_8px_rgba(14,165,233,0.2)]',
                    hoverBorder: 'hover:border-sky-400 hover:shadow-[0_10px_35px_rgba(14,165,233,0.3)]',
                    glowGradient: 'from-sky-950/40 via-[#131b26] to-[#0a1017]',
                    topLineColor: 'via-sky-400/50',
                  },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        soundEngine.playClick();
                        if (m.id === 'player_career') {
                          setShowPlayerCareer(true);
                        } else if (m.id === 'who_are_ya') {
                          setShowMysteryWordle(true);
                        } else if (m.id === 'manager_dna') {
                          setShowManagerDNA(true);
                        } else if (m.id === 'build_a_player') {
                          setShowBuildAPlayerStudio(true);
                        } else if (m.id === 'last_one_standing') {
                          setShowSurvivalGauntlet(true);
                        } else if (m.id === 'teammate_chain') {
                          setShowTeammateChainModal(true);
                        } else if (m.id === 'on_the_money') {
                          startManagerRoll('on_the_money');
                          setShowOnTheMoneyTombola(true);
                        } else {
                          startManagerRoll(m.id as GameMode);
                        }
                      }}
                      className={`group relative p-4 sm:p-5 bg-gradient-to-br ${m.glowGradient} hover:bg-[#161f2c] border border-slate-800/90 ${m.hoverBorder} rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between active:scale-[0.99] shadow-lg hover:-translate-y-1 overflow-hidden`}
                    >
                      {/* Top ambient highlight hairline */}
                      <div className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${m.topLineColor} to-transparent opacity-75 group-hover:opacity-100 transition-opacity`} />

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2.5 rounded-xl border flex items-center justify-center ${m.accentColor}`}>
                            <Icon className="w-5 h-5 drop-shadow-sm" />
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border tracking-wider uppercase shadow-xs ${m.badgeColor}`}>
                            [{m.badge}]
                          </span>
                        </div>
                        <div className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors font-sans tracking-tight">
                          {m.title}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mt-1.5 font-sans font-normal">
                          {m.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400 font-medium">
                          {m.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                          SELECT <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. MANAGER ROLLING SCREEN (STADIUM PRESS ROOM STYLING)                    */}
        {/* ========================================================================= */}
        {draftPhase === 'manager_roll' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="text-center py-4 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                [STEP 1 OF 2] TACTICIAN ALLOCATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mt-1 tracking-tight drop-shadow-sm">
                Roll For Your Manager
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm mx-auto">
                Each tactician brings a preferred system and a game-changing tactical aura perk.
              </p>
            </div>

            {/* Manager Card Display */}
            <div className="p-5 bg-gradient-to-br from-[#161f2c] via-[#111722] to-[#0c1017] border-2 border-slate-700/80 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-mono font-bold tracking-wider">ROLLED TACTICIAN</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5 font-sans">{rolledManager.name}</div>
                  <div className="text-xs text-slate-300 font-mono font-medium">{rolledManager.nationality}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-slate-400 font-mono font-bold tracking-wider">PREFERRED SHAPE</div>
                  <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">{rolledManager.preferredFormation}</div>
                  <div className="text-[10px] text-slate-300 font-mono font-medium">{rolledManager.tacticalStyle}</div>
                </div>
              </div>

              {/* Manager Perk Banner */}
              <div className="p-3.5 bg-gradient-to-r from-amber-950/60 to-[#181308] border border-amber-500/50 rounded-xl shadow-md">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>TACTICAL PERK: {rolledManager.perkName}</span>
                </div>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed font-sans font-normal">
                  {rolledManager.perkDescription}
                </p>
              </div>

              {/* Rerolls Remaining Counter */}
              <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-800 font-mono">
                <span className="text-slate-400">Rerolls remaining:</span>
                <span className="font-bold text-amber-400 text-sm">{managerRollsLeft} / 3</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                disabled={managerRollsLeft <= 0 || isManagerRolling}
                onClick={handleRollManager}
                className={`flex-1 py-3 px-3 border rounded-xl font-bold text-xs uppercase font-mono transition-all duration-150 active:scale-95 shadow-sm ${
                  managerRollsLeft > 0
                    ? 'bg-[#1e2736] hover:bg-[#283447] text-amber-300 border-amber-500/60'
                    : 'bg-[#0d1117] text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                {isManagerRolling ? '[ROLLING...]' : `[ROLL AGAIN (${managerRollsLeft} LEFT)]`}
              </button>

              <button
                onClick={handleConfirmManager}
                className="flex-1 py-3 px-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider font-mono rounded-xl shadow-lg shadow-emerald-950/60 transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>CONFIRM TACTICIAN & ENTER DRAFT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => setDraftPhase('mode_select')}
                className="text-xs text-slate-400 hover:text-white font-mono transition-colors"
              >
                &larr; Return to Campaign Selection
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. DRAFTING INTERFACE (SNAPPY, RESPONSIVE SPLIT SCREEN)                   */}
        {/* ========================================================================= */}
        {draftPhase === 'drafting' && (
          <div className="space-y-4">
            {/* Slot Reel & Controls */}
            <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
              <div className="w-full md:w-auto flex-1">
                <SlotWheel
                  currentSquad={currentSquadPool}
                  onSpinComplete={handleSpinComplete}
                  isSpinning={isSpinning}
                  squadPool={getEligibleSquads(gameMode)}
                  gameMode={gameMode}
                  difficulty={difficulty}
                  isReroll={isRerollSpin}
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-48 font-mono text-xs">
                <button
                  disabled={isSpinning || (!freeRerollAvailable && scoutTokens <= 0)}
                  onClick={handleReroll}
                  className={`w-full py-3 px-4 border rounded-2xl font-black uppercase tracking-wider transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-sm ${
                    freeRerollAvailable
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 shadow-emerald-950/60'
                      : scoutTokens > 0
                      ? 'bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border-amber-600/70 shadow-amber-950/40'
                      : 'bg-[#21262d] text-slate-500 border-[#30363d] cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>
                    {isSpinning
                      ? 'SPINNING...'
                      : freeRerollAvailable
                      ? 'FREE REROLL'
                      : `REROLL (1 TOKEN)`}
                  </span>
                </button>

                <div className="text-center text-[11px] text-slate-400 font-sans">
                  {freeRerollAvailable
                    ? '1 free tactical reroll ready'
                    : `${scoutTokens} scout tokens available`}
                </div>
              </div>
            </div>

            {/* Salary Cap Progress Bar */}
            {gameMode === 'salary_cap' && (
              <div className="p-3.5 bg-gradient-to-r from-amber-950/40 via-[#161b22] to-amber-950/40 border border-amber-500/50 rounded-2xl flex flex-col gap-1.5 font-mono text-xs shadow-md animate-in fade-in">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    SALARY CAP CHALLENGE: $350M BUDGET
                  </span>
                  <span className="text-white font-black">
                    ${salaryCapSpent}M / $350M (${350 - salaryCapSpent}M Remaining)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      salaryCapSpent > 300
                        ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                        : salaryCapSpent > 220
                        ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                        : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    }`}
                    style={{ width: `${Math.min(100, (salaryCapSpent / 350) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* On The Money Target & Pace Telemetry */}
            {gameMode === 'on_the_money' && (
              <OnTheMoneyPaceBanner
                targetPoints={onTheMoneyState.targetPoints}
                projectedPoints={onTheMoneyState.projectedPoints}
                matchday={matchday}
              />
            )}

            {/* Split Screen: Pitch View & Draft Pool */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left Column: Pitch View with Dynamic Slot Assignment & Glowing Slots */}
              <div className="lg:col-span-6 space-y-2">
                <PitchView
                  formation={formation}
                  draftedPlayers={startingXI}
                  bench={bench}
                  difficulty={difficulty}
                  selectedSlotIndex={selectedSlotIndex}
                  onSlotClick={idx => setSelectedSlotIndex(idx === selectedSlotIndex ? null : idx)}
                  swapSelection={swapSelection}
                  onSelectForSwap={handleSelectForSwap}
                  onChangeFormation={handleChangeFormation}
                  swapNotice={swapNotice}
                  playerToAssign={playerToAssign}
                  onAssignToSlot={handleAssignPlayerToSlot}
                  onCancelAssign={handleCancelAssign}
                  playerFormMap={playerFormMap}
                  setPieceTakers={setPieceTakers}
                />
              </div>

              {/* Right Column: Draft Pool Cards OR Super Expert Input Terminal */}
              <div className="lg:col-span-6 space-y-2.5">
                {difficulty === 'super_expert' ? (
                  <SuperExpertDraftInput
                    squad={currentSquadPool}
                    draftedIdsSet={draftedIdsSet}
                    activeSquad={activeSquad}
                    onSelectPlayer={handleDraftWithWalkout}
                    playerToAssign={playerToAssign}
                    scoutTokens={scoutTokens}
                    onUseScoutToken={() => setScoutTokens(t => Math.max(0, t - 1))}
                    onAwardScoutToken={() => setScoutTokens(t => t + 1)}
                    draftRound={draftRound}
                    onReroll={handleReroll}
                    freeRerollAvailable={freeRerollAvailable}
                    isSpinning={isSpinning}
                    hasEmptyGkSlot={hasEmptyGkSlot}
                    hasEmptyOutfieldSlot={hasEmptyOutfieldSlot}
                    hasEmptyBench={hasEmptyBench}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-[#141b26] to-[#0f151f] border border-slate-800 rounded-2xl font-mono text-xs shadow-md">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white uppercase tracking-wider">AVAILABLE PLAYERS</span>
                        <span className="text-slate-400 font-medium">
                          ({currentSquadPool.players.length} in pool)
                        </span>
                        {difficulty === 'classic' && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/50 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <ArrowUpDown className="w-2.5 h-2.5" />
                            Sorted: Highest OVR
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-amber-300 font-black px-2.5 py-0.5 rounded-lg bg-amber-950/70 border border-amber-500/50 shadow-xs">
                        Round {draftRound}/16
                      </span>
                    </div>

                    {/* Position Filter Tabs */}
                    <div className="flex items-center gap-1.5 font-mono text-[11px] overflow-x-auto pb-1">
                      {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map(pos => {
                        const count =
                          pos === 'ALL'
                            ? currentSquadPool.players.length
                            : currentSquadPool.players.filter(p => p.position === pos).length;

                        const getActiveTabStyle = () => {
                          switch (pos) {
                            case 'GK':
                              return 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black border-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.5)]';
                            case 'DEF':
                              return 'bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 text-slate-950 font-black border-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.5)]';
                            case 'MID':
                              return 'bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-500 text-slate-950 font-black border-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.5)]';
                            case 'FWD':
                              return 'bg-gradient-to-r from-rose-500 via-rose-400 to-red-600 text-white font-black border-rose-400 shadow-[0_0_14px_rgba(244,63,94,0.5)]';
                            default:
                              return 'bg-gradient-to-r from-slate-200 via-white to-slate-300 text-slate-950 font-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]';
                          }
                        };

                        return (
                          <button
                            key={pos}
                            onClick={() => setPositionFilter(pos)}
                            className={`px-3 py-1.5 border rounded-xl font-bold transition-all duration-150 whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${
                              positionFilter === pos
                                ? getActiveTabStyle()
                                : 'bg-[#121924]/90 text-slate-400 border-slate-700/80 hover:text-white hover:border-slate-500 shadow-sm'
                            }`}
                          >
                            <span>{pos}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                                positionFilter === pos
                                  ? 'bg-black/25 text-inherit'
                                  : 'bg-[#1b2535] text-slate-400'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[580px] overflow-y-auto pr-1">
                      {availablePlayers.map(player => {
                        const isDrafted = draftedIdsSet.has(player.id);
                        const isDuplicate = !isDrafted && isDuplicatePlayer(player, activeSquad);
                        const chemBonus = getChemistryBonusForDraft(player, activeSquad);

                        // Check compatibility: Outfield players can fill any outfield slot or bench; GK strictly requires GK slot or bench
                        const hasStarterSlot = player.position === 'GK' ? hasEmptyGkSlot : hasEmptyOutfieldSlot;
                        const isCompatible = (hasStarterSlot || hasEmptyBench) && !isDuplicate;
                        const isSelected = playerToAssign?.id === player.id;

                        // Calculate best available position fit among open starting slots
                        let bestFitNotice: { penaltyOvr: number; label: string } | null = null;
                        if (!isDrafted && !isDuplicate && emptyStarterSlots.length > 0) {
                          let minPenalty = 999;
                          let bestLabel = '';
                          emptyStarterSlots.forEach(({ slot }) => {
                            const fit = calculatePositionFit(player.specificPosition, slot.label);
                            if (fit.tier !== 'invalid' && fit.penaltyOvr < minPenalty) {
                              minPenalty = fit.penaltyOvr;
                              bestLabel = fit.label;
                            }
                          });
                          if (minPenalty < 999) {
                            bestFitNotice = { penaltyOvr: minPenalty, label: bestLabel };
                          }
                        }

                        return (
                          <DraftCard
                            key={player.id}
                            player={player}
                            difficulty={difficulty}
                            isCompatible={isCompatible}
                            onSelect={handleDraftWithWalkout}
                            isDrafted={isDrafted}
                            isDuplicate={isDuplicate}
                            isSelected={isSelected}
                            chemistrySynergies={chemBonus.synergies}
                            bestFitNotice={bestFitNotice}
                            salaryValue={gameMode === 'salary_cap' ? getPlayerSalaryValue(player.overall) : undefined}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. SEASON HUB: LEAGUE CAMPAIGN & FAST SIMULATION                           */}
        {/* ========================================================================= */}
        {draftPhase === 'season_hub' && (
          <div className="space-y-4 font-sans select-none">
            {/* On The Money Target & Live Pace Telemetry */}
            {gameMode === 'on_the_money' && (
              <OnTheMoneyPaceBanner
                targetPoints={onTheMoneyState.targetPoints}
                projectedPoints={onTheMoneyState.projectedPoints}
                actualPointsSoFar={leagueTable.find(e => e.team === 'Your Starting XI')?.points ?? 0}
                matchday={matchday}
                isSeasonComplete={isSeasonComplete}
              />
            )}

            {/* Broadcast Fixture Header Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#141d2b] via-[#0f1724] to-[#141d2b] border-2 border-slate-700/80 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/50 via-teal-400/40 to-transparent pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none holo-sheen opacity-15" />

              <div className="text-center sm:text-left relative z-10">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  </span>
                  <span className="text-slate-400 uppercase font-mono font-bold text-[10px] tracking-wider">
                    BROADCAST MATCHDAY HUB
                  </span>
                </div>
                <div className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  {matchday <= maxMatchdays ? (
                    <>MATCHDAY {matchday} OF {maxMatchdays}: vs <span className="text-amber-400">{nextOpponent?.name || 'Opponent'}</span></>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <Trophy className="w-6 h-6 text-amber-400 drop-shadow shrink-0" />
                      CAMPAIGN COMPLETED ({maxMatchdays} MATCHDAYS PLAYED)
                    </span>
                  )}
                </div>
                {nextOpponent && (
                  <div className="mt-2.5 flex flex-col sm:flex-row items-center gap-2.5">
                    {/* Head-to-Head Duel Power Comparison */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#0c121a] border border-slate-700/80 font-mono text-[11px] shadow-inner">
                      <span className="font-black text-emerald-400">YOU {teamRating}</span>
                      <div className="w-16 sm:w-20 bg-slate-800 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-400 h-full shadow-[0_0_6px_#34d399]"
                          style={{ width: `${(teamRating / Math.max(1, teamRating + nextOpponent.rating)) * 100}%` }}
                        />
                        <div
                          className="bg-rose-500 h-full shadow-[0_0_6px_#f43f5e]"
                          style={{ width: `${(nextOpponent.rating / Math.max(1, teamRating + nextOpponent.rating)) * 100}%` }}
                        />
                      </div>
                      <span className="font-black text-rose-400">{nextOpponent.rating} OPP</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 font-mono text-[10px]">
                      <span className="px-2.5 py-0.5 rounded-lg bg-rose-950/80 text-rose-300 font-bold border border-rose-800/70 shadow-xs">
                        ATK {nextOpponent.attackRating}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/70 shadow-xs">
                        MID {nextOpponent.midfieldRating}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-950/80 text-blue-300 font-bold border border-blue-800/70 shadow-xs">
                        DEF {nextOpponent.defenseRating}
                      </span>

                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setShowScoutingModal(true);
                        }}
                        className={`px-2.5 py-0.5 rounded-lg font-bold flex items-center gap-1 transition-all active:scale-95 border ${
                          tacticalEdgeActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 border-emerald-400 font-black shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                            : 'bg-[#182333] hover:bg-[#202f45] text-amber-300 border-amber-500/60 shadow-xs'
                        }`}
                      >
                        <Crosshair className="w-3 h-3 text-amber-400" />
                        <span>{tacticalEdgeActive ? 'TACTICAL EDGE (+10%)' : 'SCOUTING DOSSIER'}</span>
                      </button>

                      {gameMode === 'dynasty' && (
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            setDraftPhase('dynasty_hub');
                          }}
                          className="px-2.5 py-0.5 rounded-lg font-bold flex items-center gap-1 transition-all active:scale-95 border bg-[#132233] hover:bg-[#1a2e45] text-cyan-300 border-cyan-500/60 shadow-xs"
                        >
                          <Building2 className="w-3 h-3 text-cyan-400" />
                          <span>DYNASTY HQ (S{dynastyState.season})</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setShowSquadReportModal(true);
                        }}
                        className="px-2.5 py-0.5 rounded-lg font-bold flex items-center gap-1 transition-all active:scale-95 border bg-[#11212f] hover:bg-[#183146] text-teal-300 border-teal-500/60 shadow-xs"
                      >
                        <Activity className="w-3 h-3 text-teal-400" />
                        <span>SQUAD RADAR</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tactical Consumable Power Chips (One Two FPL Inspired) */}
              {!isSeasonComplete && !isTournamentEliminated && (
                <div className="relative z-10 w-full my-2">
                  <TacticalChipsBar
                    chipsState={tacticalChips}
                    onActivateChip={handleActivateChip}
                    captainName={captainPlayer?.name}
                  />
                </div>
              )}

              {/* Simulation Controls */}
              <div className="flex items-center gap-2 flex-wrap font-mono relative z-10">
                {isTournamentEliminated ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-300 font-bold text-xs uppercase flex items-center gap-1.5 shadow-sm">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      RUN OVER: DEFEATED ON FLOOR {matchday}
                    </span>
                    <button
                      onClick={() => setShowRestartConfirm(true)}
                      className="py-2 px-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
                    >
                      TRY AGAIN
                    </button>
                    <button
                      onClick={handleSafeGoHome}
                      className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95"
                    >
                      MAIN MENU
                    </button>
                  </div>
                ) : matchday <= maxMatchdays ? (
                  <>
                    <button
                      onClick={() => {
                        handleSimulateNextLeagueMatch(tacticalEdgeActive, mindGameChoice);
                        setTacticalEdgeActive(false);
                        setMindGameChoice(null);
                      }}
                      className="py-2.5 px-4 sm:px-5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/70 transition-all duration-150 active:scale-95 flex items-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>SIMULATE MD {matchday}</span>
                    </button>
                    {mindGameChoice && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-950/90 border border-amber-500/70 text-amber-300 font-bold text-[10px] uppercase flex items-center gap-1.5 shadow-sm animate-pulse">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>
                          {mindGameChoice === 'composure'
                            ? 'ICE-COLD COMPOSURE ACTIVE'
                            : mindGameChoice === 'aggression'
                            ? 'BATTLE CRY PRIMED'
                            : 'MASTERMIND TRAP ARMED'}
                        </span>
                      </span>
                    )}
                    {maxMatchdays > 5 && (
                      <button
                        onClick={handleSimulateFullSeason}
                        className="py-2.5 px-3.5 bg-[#1b2332] hover:bg-[#243044] text-amber-300 border border-amber-500/50 hover:border-amber-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-sm"
                        title="Simulates all remaining matches rapidly"
                      >
                        <FastForward className="w-3.5 h-3.5 text-amber-400" />
                        <span>FAST SIM ALL</span>
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        if (seasonAwards) setSeasonAwards(seasonAwards);
                      }}
                      className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-950/60 transition-all duration-150 active:scale-95 flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4 text-slate-950" />
                      <span>AWARDS GALA CEREMONY</span>
                    </button>
                    {gameMode === 'dynasty' && (
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setDraftPhase('dynasty_hub');
                        }}
                        className="py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>DYNASTY HQ & ADVANCE</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Segmented Navigation Tabs for Hub */}
            <div className="flex p-1.5 bg-[#121822] border border-slate-800 rounded-2xl gap-1 text-xs font-mono shadow-md overflow-x-auto no-scrollbar">
              <button
                onClick={() => setHubTab('pitch')}
                className={`flex-1 py-2 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                  hubTab === 'pitch'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-950/60 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>LINEUP & SHAPE</span>
              </button>
              <button
                onClick={() => setHubTab('table')}
                className={`flex-1 py-2 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                  hubTab === 'table'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-950/60 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>STANDINGS & STATS</span>
              </button>
              <button
                onClick={() => setHubTab('history')}
                className={`flex-1 py-2 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                  hubTab === 'history'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-950/60 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>RESULTS LOG ({matchHistory.length})</span>
              </button>
              {gameMode === 'dynasty' && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setDraftPhase('dynasty_hub');
                  }}
                  className="flex-1 py-2 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 text-cyan-300 hover:text-white hover:bg-slate-800/40 shrink-0"
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DYNASTY HQ</span>
                </button>
              )}
            </div>

            {/* Hub Tab Views */}
            {hubTab === 'pitch' && (
              <div className="space-y-3">
                {/* Roguelike Tower Active Perks Banner */}
                {roguelikePerks.length > 0 && (
                  <div className="p-3 bg-gradient-to-r from-violet-950/50 via-[#161b22] to-violet-950/50 border border-violet-500/60 rounded-2xl flex flex-col gap-1.5 font-mono text-xs shadow-md">
                    <div className="flex items-center gap-1.5 text-violet-300 font-bold text-[11px] uppercase">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      ACTIVE ROGUELIKE TOWER PERKS ({roguelikePerks.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {roguelikePerks.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-violet-950/80 border border-violet-500/60 text-violet-200 text-[10px] font-bold flex items-center gap-1"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tactical pitch control bar */}
                <div className="flex items-center justify-between font-mono text-xs px-1">
                  <span className="text-slate-400 font-bold uppercase text-[11px]">TACTICAL PITCH CONTROL</span>
                  <button
                    onClick={() => setIsSetPieceDrawerOpen(true)}
                    className="py-1.5 px-3 bg-[#161b22] hover:bg-[#21262d] text-amber-300 border border-amber-500/60 hover:border-amber-400 rounded-xl font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all text-[11px]"
                  >
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>ASSIGN SET-PIECE SPECIALISTS</span>
                  </button>
                </div>

                <PitchView
                  formation={formation}
                  draftedPlayers={startingXI}
                  bench={bench}
                  difficulty={difficulty}
                  swapSelection={swapSelection}
                  onSelectForSwap={handleSelectForSwap}
                  onChangeFormation={handleChangeFormation}
                  swapNotice={swapNotice}
                  playerFormMap={playerFormMap}
                  setPieceTakers={setPieceTakers}
                />
              </div>
            )}

            {hubTab === 'table' && (
              <div>
                <SeasonTable
                  table={leagueTable}
                  matches={matchHistory}
                  squad={startingXI}
                />
              </div>
            )}

            {hubTab === 'history' && (
              <div className="space-y-2 max-w-xl mx-auto font-mono">
                {matchHistory.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-400 italic border border-[#30363d] rounded-2xl bg-[#161b22]">
                    No matches played yet. Simulate matchday 1 or run the fast season simulation.
                  </div>
                ) : (
                  matchHistory.map((m, idx) => {
                    const isUserHome = m.homeTeam === 'Your Starting XI';
                    const userScore = isUserHome ? m.homeScore : m.awayScore;
                    const oppScore = isUserHome ? m.awayScore : m.homeScore;
                    const oppName = isUserHome ? m.awayTeam : m.homeTeam;
                    const userWon = m.winner === (isUserHome ? 'home' : 'away');
                    const isDraw = m.winner === 'draw';

                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveModalMatch(m)}
                        className="p-3 bg-[#161b22] hover:bg-[#1f2633] border border-[#30363d] rounded-2xl flex items-center justify-between text-xs cursor-pointer transition-all duration-150 shadow-sm active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                              userWon
                                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                                : isDraw
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {userWon ? 'W' : isDraw ? 'D' : 'L'}
                          </span>
                          <span className="text-slate-400 text-[11px] shrink-0">MD {m.matchday}:</span>
                          <span className="text-white font-bold truncate">vs {oppName}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-black text-white text-sm bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                            {userScore} - {oppScore}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                            DETAILS <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. TOURNAMENT HUB: UCL & WORLD CUP KNOCKOUTS                              */}
        {/* ========================================================================= */}
        {draftPhase === 'tournament_hub' && (
          <div className="space-y-4 font-sans select-none">
            {/* Tournament Navigation Tabs */}
            <div className="flex p-1 bg-[#161b22] border border-[#30363d] rounded-2xl gap-1 text-xs font-mono">
              <button
                onClick={() => setHubTab('history')}
                className={`flex-1 py-2 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  hubTab !== 'pitch'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>{gameMode === 'world_cup' ? 'WORLD CUP BRACKET' : 'UCL KNOCKOUT BRACKET'}</span>
              </button>
              <button
                onClick={() => setHubTab('pitch')}
                className={`flex-1 py-2 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  hubTab === 'pitch'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>LINEUP & FORMATION</span>
              </button>
            </div>

            {hubTab === 'pitch' ? (
              <div className="space-y-3">
                <PitchView
                  formation={formation}
                  draftedPlayers={startingXI}
                  bench={bench}
                  difficulty={difficulty}
                  swapSelection={swapSelection}
                  onSelectForSwap={handleSelectForSwap}
                  onChangeFormation={handleChangeFormation}
                  swapNotice={swapNotice}
                  playerFormMap={playerFormMap}
                  setPieceTakers={setPieceTakers}
                />
              </div>
            ) : (
              <TournamentBracket
                stages={tournamentStages}
                currentStageIndex={currentStageIdx}
                onPlayNextLeg={handleSimulateTournamentLeg}
                competitionName={gameMode === 'world_cup' ? 'FIFA World Cup' : 'UEFA Champions League'}
                isEliminated={isTournamentEliminated}
                onRestart={() => setShowRestartConfirm(true)}
                onGoHome={handleSafeGoHome}
                onOpenAwards={() => {
                  if (seasonAwards) setSeasonAwards(seasonAwards);
                }}
              />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. DYNASTY HUB: FRANCHISE MANAGEMENT                                      */}
        {/* ========================================================================= */}
        {draftPhase === 'dynasty_hub' && (
          <div className="space-y-4">
            <DynastyHub
              dynastyState={dynastyState}
              squad={startingXI}
              bench={bench}
              onDraftWonderkid={handleDraftWonderkid}
              onAdvanceSeason={handleAdvanceDynastySeason}
              onUpgradeFacility={handleUpgradeFacility}
              onBuyTransferPlayer={handleBuyTransferPlayer}
              onSellPlayer={handleSellPlayer}
              onHireStaff={handleHireStaff}
              onSignSponsor={handleSignSponsor}
              onLoanPlayer={handleLoanPlayer}
              onStartTour={handleStartTour}
              onEnterMatchdayHub={() => setDraftPhase('season_hub')}
              matchday={matchday}
              maxMatchdays={maxMatchdays}
              isSeasonComplete={isSeasonComplete}
              onSetTrainingFocus={handleSetTrainingFocus}
              onRenewContract={handleRenewContract}
              onSetCaptain={handleSetCaptain}
            />
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODALS & OVERLAYS                                                         */}
      {/* ========================================================================= */}

      {/* Off-Season Transition Gala Modal */}
      {seasonTransitionReport && (
        <SeasonTransitionModal
          report={seasonTransitionReport}
          dynastyState={dynastyState}
          onClose={() => setSeasonTransitionReport(null)}
        />
      )}

      {/* Match Simulation Modal */}
      {activeModalMatch && (
        <MatchSimModal
          key={activeModalMatch.id}
          match={activeModalMatch}
          bench={bench}
          startingXI={startingXI}
          onSubPlayer={handleSubPlayer}
          onClose={() => setActiveModalMatch(null)}
          onNextMatch={
            draftPhase === 'season_hub' && matchday <= maxMatchdays && !isTournamentEliminated
              ? () => {
                  handleSimulateNextLeagueMatch(tacticalEdgeActive, mindGameChoice);
                  setTacticalEdgeActive(false);
                  setMindGameChoice(null);
                }
              : undefined
          }
        />
      )}

      {/* Shareable Ultimate XI Squad Card Modal */}
      {isShareModalOpen && (
        <ShareTeamModal
          startingXI={startingXI}
          bench={bench}
          formation={formation}
          manager={manager}
          chemistry={teamChemistry.percentage}
          teamRating={teamRating}
          campaignTitle={
            gameMode === 'rivalry_derby'
              ? 'Rivalry Derby Gauntlet'
              : gameMode === 'draft_roguelike'
              ? 'Roguelike Boss Tower'
              : gameMode === 'salary_cap'
              ? 'Salary Cap Championship'
              : 'Tactical Draft: 38-0'
          }
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Roguelike Boss Tower Perk Draft Modal */}
      {pendingRoguelikeChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#18112e] via-[#0f0a1f] to-[#080512] border-2 border-violet-500/80 rounded-3xl p-5 space-y-4 shadow-2xl shadow-violet-950/80 animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950 border border-violet-500/60 text-violet-300 text-xs font-mono font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                BOSS FLOOR CONQUERED!
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Draft a Roguelike Tactical Perk
              </h2>
              <p className="text-xs text-slate-400">
                Choose 1 persistent passive tactical buff for the upcoming tower challenges:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {pendingRoguelikeChoice.map(perk => (
                <button
                  key={perk.id}
                  onClick={() => {
                    soundEngine.playAuraSurge();
                    selectRoguelikePerk(perk);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all active:scale-[0.98] group flex items-start gap-3 ${
                    perk.rarity === 'Legendary'
                      ? 'bg-amber-950/40 hover:bg-amber-950/70 border-amber-500/60 hover:border-amber-400'
                      : perk.rarity === 'Rare'
                      ? 'bg-violet-950/40 hover:bg-violet-950/70 border-violet-500/60 hover:border-violet-400'
                      : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-700/80 hover:border-emerald-500/60'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 ${
                      perk.rarity === 'Legendary'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : perk.rarity === 'Rare'
                        ? 'bg-violet-500/20 border-violet-400 text-violet-300'
                        : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                        {perk.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md border uppercase ${
                          perk.rarity === 'Legendary'
                            ? 'bg-amber-950 text-amber-300 border-amber-500'
                            : perk.rarity === 'Rare'
                            ? 'bg-violet-950 text-violet-300 border-violet-500'
                            : 'bg-slate-950 text-slate-300 border-slate-700'
                        }`}
                      >
                        {perk.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {perk.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Opposition Tactical Dossier & Pre-Match Scouting Report Modal */}
      {showScoutingModal && nextOpponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-mono text-xs select-none animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#141e2e] via-[#0d1522] to-[#070b12] border-2 border-amber-500/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.35)] animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            {/* Top gold hairline */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-2 rounded-xl bg-amber-400/20 border border-amber-400/60 text-amber-300 shrink-0">
                  <Crosshair className="w-5 h-5 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block truncate">
                    CONFIDENTIAL TACTICAL DOSSIER · MATCHDAY {matchday}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white truncate font-sans">
                    {nextOpponent.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowScoutingModal(false)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Manager & Tactical Identity Card */}
            <div className="p-3.5 rounded-2xl bg-[#090f18] border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Head Tactician:</span>
                <span className="text-white font-black">{nextOpponent.managerName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Tactical Philosophy:</span>
                <span className="text-amber-300 font-black px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/60 text-[11px]">
                  {nextOpponent.tactic}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed pt-1 border-t border-slate-800">
                {nextOpponent.tactic === 'Gegenpress'
                  ? 'Executes suffocating full-pitch pressing upon ball loss. Backline commits aggressively high to compress vertical space.'
                  : nextOpponent.tactic === 'Tiki-Taka'
                  ? 'Relies on immaculate positional triangles, slow tempo recirculation, and pulling opponents out of structural alignment.'
                  : nextOpponent.tactic === 'Low-Block Counter'
                  ? 'Retreats entire squad into a deep impenetrable 18-yard fortress, springing venomous diagonal transitions into wide channels.'
                  : 'Deploys direct vertical direct balls into towering target men, aggressively contesting second balls in the final third.'}
              </p>
            </div>

            {/* Head-to-Head Sector Combat Comparison */}
            <div className="p-3.5 rounded-2xl bg-[#0c1422] border border-slate-800 space-y-2.5">
              <span className="text-slate-400 uppercase text-[10px] font-black tracking-wider block">
                HEAD-TO-HEAD SECTOR POWER COMPARISON
              </span>

              <div className="space-y-2 text-xs">
                {/* Attack vs Defense */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold">Your Attack: {teamRating}</span>
                    <span className="text-slate-500">vs</span>
                    <span className="text-rose-400 font-bold">Opp Defense: {nextOpponent.defenseRating}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      className="bg-emerald-400 h-full"
                      style={{ width: `${(teamRating / Math.max(1, teamRating + nextOpponent.defenseRating)) * 100}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${(nextOpponent.defenseRating / Math.max(1, teamRating + nextOpponent.defenseRating)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Midfield Battle */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold">Your Midfield: {teamRating}</span>
                    <span className="text-slate-500">vs</span>
                    <span className="text-rose-400 font-bold">Opp Midfield: {nextOpponent.midfieldRating}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      className="bg-emerald-400 h-full"
                      style={{ width: `${(teamRating / Math.max(1, teamRating + nextOpponent.midfieldRating)) * 100}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${(nextOpponent.midfieldRating / Math.max(1, teamRating + nextOpponent.midfieldRating)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Defense vs Attack */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold">Your Defense: {teamRating}</span>
                    <span className="text-slate-500">vs</span>
                    <span className="text-rose-400 font-bold">Opp Attack: {nextOpponent.attackRating}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      className="bg-emerald-400 h-full"
                      style={{ width: `${(teamRating / Math.max(1, teamRating + nextOpponent.attackRating)) * 100}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${(nextOpponent.attackRating / Math.max(1, teamRating + nextOpponent.attackRating)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tactical Vulnerability & Recommended Counter */}
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/50 space-y-1.5">
              <span className="text-amber-400 font-black text-xs uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                EXPLOITABLE TACTICAL VULNERABILITY
              </span>
              <p className="text-[11px] text-amber-200/90 font-sans leading-relaxed">
                {nextOpponent.tactic === 'Gegenpress'
                  ? 'Extremely vulnerable to rapid direct vertical balls into the wide flanks behind their high-line center-backs.'
                  : nextOpponent.tactic === 'Tiki-Taka'
                  ? 'Prone to high-turnover panic when confronted with aggressive central midfield pressing traps and double-teams.'
                  : nextOpponent.tactic === 'Low-Block Counter'
                  ? 'Surrenders pitch territorial possession; vulnerable to patient wing overloads and cutbacks from the byline.'
                  : 'Vulnerable to disciplined zonal defensive containment and sweeper-keepers neutralizing direct aerial balls.'}
              </p>
            </div>

            {/* Pre-Match Opposition Mind Games & Press Duels */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#0f1726] to-[#0a101b] border border-cyan-500/50 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-cyan-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  PRE-MATCH PRESS DUEL & MIND GAMES
                </span>
                <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50">
                  {mindGameChoice ? 'TACTICAL ADVANTAGE PRIMED' : 'SELECT RESPONSE'}
                </span>
              </div>

              {/* Rival Gaffer's Bold Psychological Challenge */}
              <div className="p-3 rounded-xl bg-[#141e30] border border-slate-700/80 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>{nextOpponent.managerName || 'Opposition Manager'} (Press Conference):</span>
                </div>
                <p className="text-[11px] text-slate-200 font-serif italic leading-relaxed">
                  {nextOpponent.tactic === 'Gegenpress'
                    ? `"We are going to suffocatingly press them from minute one. They won't have time to breathe or turn. Let's see if their composure holds up under true intensity."`
                    : nextOpponent.tactic === 'Tiki-Taka'
                    ? `"They will be chasing shadows all evening. We will starve them of possession and pick apart their defensive structure with clinical patience."`
                    : nextOpponent.tactic === 'Low-Block Counter'
                    ? `"They are naive in transition. Let them have all the meaningless possession they want — we will absorb everything and punish them brutally on the break."`
                    : `"They hate direct physical battles. We will bombard their penalty area, win every 50/50 header, and impose our physical dominance."`}
                </p>
              </div>

              {/* 3 Selectable Press Responses */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  CHOOSE YOUR PUBLIC RESPONSE & TACTICAL STANCE:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      id: 'composure' as const,
                      title: 'Ice-Cold Composure',
                      badge: '+4 Composure',
                      quote: '"We do our talking on the pitch. Keep calm and execute the system."',
                      effect: 'Suppresses opponent pressing turnovers (-6% Opp xG, +4% Poss)',
                      color: 'from-cyan-950/80 to-blue-950/80 border-cyan-500/60 text-cyan-200',
                      activeColor: 'bg-cyan-900 border-cyan-400 text-cyan-100 ring-2 ring-cyan-400/50',
                    },
                    {
                      id: 'aggression' as const,
                      title: 'Warrior Battle Cry',
                      badge: '+8 Duel Aggression',
                      quote: '"Tell them to bring everything. We will out-fight them in every duel."',
                      effect: 'Dominates 50/50 tackles (-12% Opp xG, +5% User xG)',
                      color: 'from-rose-950/80 to-amber-950/80 border-rose-500/60 text-rose-200',
                      activeColor: 'bg-rose-900 border-rose-400 text-rose-100 ring-2 ring-rose-400/50',
                    },
                    {
                      id: 'counter' as const,
                      title: 'Mastermind Ambush',
                      badge: '+15% Counter xG',
                      quote: '"Let them think they solved us. We have prepared a tactical ambush."',
                      effect: 'Baits high line into lethal counter-breaks (+15% User xG, Full Edge)',
                      color: 'from-purple-950/80 to-emerald-950/80 border-purple-500/60 text-purple-200',
                      activeColor: 'bg-purple-900 border-purple-400 text-purple-100 ring-2 ring-purple-400/50',
                    },
                  ].map(opt => {
                    const isSelected = mindGameChoice === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playSuccessChime();
                          setMindGameChoice(opt.id);
                          setTacticalEdgeActive(true);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all duration-150 active:scale-95 flex flex-col justify-between space-y-1.5 shadow-sm ${
                          isSelected
                            ? opt.activeColor
                            : `bg-gradient-to-br ${opt.color} hover:border-slate-500 opacity-85 hover:opacity-100`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[11px] uppercase tracking-wide flex items-center gap-1">
                            {opt.title}
                          </span>
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-black/50 border border-white/20">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[10px] italic font-serif opacity-90 leading-tight">
                          {opt.quote}
                        </p>
                        <div className="text-[9px] font-mono text-amber-300 font-semibold pt-1 border-t border-white/10">
                          {opt.effect}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  soundEngine.playSuccessChime();
                  setTacticalEdgeActive(true);
                  if (!mindGameChoice) {
                    setMindGameChoice('counter');
                  }
                  const counterShape =
                    nextOpponent.tactic === 'Gegenpress'
                      ? '4-3-3'
                      : nextOpponent.tactic === 'Tiki-Taka'
                      ? '4-2-3-1'
                      : nextOpponent.tactic === 'Low-Block Counter'
                      ? '3-5-2'
                      : '5-3-2';
                  if (counterShape && handleChangeFormation) {
                    handleChangeFormation(counterShape);
                  }
                  setShowScoutingModal(false);
                }}
                className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-lg ${
                  tacticalEdgeActive
                    ? 'bg-emerald-950 border-2 border-emerald-400 text-emerald-300'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-slate-950 shadow-emerald-950/70'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {tacticalEdgeActive
                    ? 'TACTICAL & PSYCHOLOGICAL EDGE ACTIVE (+10% MOMENTUM)'
                    : 'APPLY COUNTER-TACTIC & MIND GAMES (+10% EDGE)'}
                </span>
              </button>

              <button
                onClick={() => setShowScoutingModal(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs transition-colors"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set-Piece Specialist Selector Drawer */}
      {isSetPieceDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono text-xs">
          <div className="relative w-full max-w-md bg-[#161b22] border-2 border-emerald-500/70 rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-emerald-400 font-black text-sm flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                SET-PIECE SPECIALISTS
              </span>
              <button
                onClick={() => setIsSetPieceDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
              Designate your primary dead-ball specialists. Specialists display distinctive role badges on the pitch and take crucial high-leverage set-pieces:
            </p>

            {/* Penalty Taker (PK) */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-950 border border-amber-500 flex items-center justify-center text-[9px] font-black text-amber-300 shadow-sm">
                  PK
                </span>
                PRIMARY PENALTY TAKER:
              </label>
              <select
                value={setPieceTakers.penalty || ''}
                onChange={e => {
                  soundEngine.playClick();
                  assignSetPieceTaker('penalty', e.target.value || null);
                }}
                className="w-full p-2 bg-[#0d1117] border border-slate-700 rounded-xl text-white font-bold"
              >
                <option value="">Auto (Best Composure / Shooting)</option>
                {startingXI
                  .filter((p): p is Player => p !== null)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.position}, SHO {p.shooting}, OVR {p.overall})
                    </option>
                  ))}
              </select>
            </div>

            {/* Free-Kick Taker (FK) */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-cyan-950 border border-cyan-500 flex items-center justify-center text-[9px] font-black text-cyan-300 shadow-sm">
                  FK
                </span>
                DIRECT FREE-KICK SPECIALIST:
              </label>
              <select
                value={setPieceTakers.freeKick || ''}
                onChange={e => {
                  soundEngine.playClick();
                  assignSetPieceTaker('freeKick', e.target.value || null);
                }}
                className="w-full p-2 bg-[#0d1117] border border-slate-700 rounded-xl text-white font-bold"
              >
                <option value="">Auto (Highest Passing & Curve)</option>
                {startingXI
                  .filter((p): p is Player => p !== null)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.position}, PAS {p.passing}, SHO {p.shooting})
                    </option>
                  ))}
              </select>
            </div>

            {/* Corner Taker (CR) */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-emerald-950 border border-emerald-500 flex items-center justify-center text-[9px] font-black text-emerald-300 shadow-sm">
                  CR
                </span>
                CORNER KICK SPECIALIST:
              </label>
              <select
                value={setPieceTakers.corner || ''}
                onChange={e => {
                  soundEngine.playClick();
                  assignSetPieceTaker('corner', e.target.value || null);
                }}
                className="w-full p-2 bg-[#0d1117] border border-slate-700 rounded-xl text-white font-bold"
              >
                <option value="">Auto (Highest Crossing / Vision)</option>
                {startingXI
                  .filter((p): p is Player => p !== null)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.position}, PAS {p.passing})
                    </option>
                  ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsSetPieceDrawerOpen(false);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black rounded-xl uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-emerald-950/50"
              >
                CONFIRM SPECIALISTS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Season Awards Gala */}
      {seasonAwards && (
        <AwardsModal
          awards={seasonAwards}
          isInvincible={invincibleAchieved}
          onClose={() => setSeasonAwards(null)}
        />
      )}

      {/* EA FC Style Superstar Walkout Ceremony */}
      {walkoutPlayer && (
        <WalkoutCeremony
          player={walkoutPlayer}
          onDismiss={() => setWalkoutPlayer(null)}
        />
      )}

      {/* 38-0-0 Feature Modals */}

      {/* 1. On The Money Tombola Modal */}
      {showOnTheMoneyTombola && (
        <OnTheMoneyTombola
          targetPoints={onTheMoneyState.targetPoints}
          isTargetSpun={onTheMoneyState.isTargetSpun}
          onSpinTarget={target => {
            handleSetOnTheMoneyTarget(target);
          }}
          onStartDrafting={() => {
            setShowOnTheMoneyTombola(false);
          }}
        />
      )}

      {/* 2. Build A Player Studio Modal */}
      {showBuildAPlayerStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
          <BuildAPlayerStudio
            onImportPlayerToSquad={player => {
              setStartingXI((prev: (Player | null)[]) => {
                const copy = [...prev];
                const firstEmpty = copy.findIndex(s => s === null);
                if (firstEmpty !== -1) copy[firstEmpty] = player;
                else copy[0] = player;
                return copy;
              });
              setShowBuildAPlayerStudio(false);
            }}
            onExportToPlayerCareer={builtPlayer => {
              setPlayerCareerImportCandidate(builtPlayer);
              setShowBuildAPlayerStudio(false);
              setShowPlayerCareer(true);
            }}
            onExit={() => setShowBuildAPlayerStudio(false)}
          />
        </div>
      )}

      {/* 2B. Player Career Mode Modal */}
      {showPlayerCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
          <PlayerCareerMode
            initialBuiltPlayer={playerCareerImportCandidate}
            onExit={() => {
              setShowPlayerCareer(false);
              setPlayerCareerImportCandidate(null);
            }}
          />
        </div>
      )}

      {/* 3. Survival Gauntlet Modal */}
      {showSurvivalGauntlet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
          <SurvivalGauntlet
            startingXI={startingXI}
            onSimulateRound={async (roundIdx, roundData) => {
              const res = simulateMatch({
                userSquad: startingXI,
                userTactic: manager.tacticalStyle,
                manager,
                opponent: roundData.opponent,
                competition: `Last One Standing - ${roundData.title}`,
                matchday: roundIdx + 1,
                isHome: true,
                formation,
              });
              return res;
            }}
            onCompleteGauntlet={() => {
              soundEngine.playCoins();
              setScoutTokens(prev => prev + 5);
            }}
            onExit={() => setShowSurvivalGauntlet(false)}
          />
        </div>
      )}

      {/* 4. Teammate Chain Puzzle Modal */}
      {showTeammateChainModal && (
        <TeammateChainPuzzleModal
          onAwardTokens={tokens => {
            setScoutTokens(prev => prev + tokens);
            soundEngine.playCoins();
          }}
          onClose={() => setShowTeammateChainModal(false)}
        />
      )}

      {/* 5. January Transfer Window: Matchday 19 */}
      {isJanuaryModalOpen && (
        <JanuaryDeadlineModal
          startingXI={startingXI}
          scoutTokens={scoutTokens}
          onSignReplacement={(newPlayer, slotIndex) => {
            handleSignJanuaryPlayer(newPlayer, slotIndex);
          }}
          onApplyMoraleBoost={() => {
            handleApplyJanuaryMoraleBoost();
          }}
          onClose={() => setIsJanuaryModalOpen(false)}
        />
      )}

      {/* 6. Who Are Ya? Football Wordle Modal */}
      {showMysteryWordle && (
        <MysteryPlayerWordleModal
          onAwardTokens={tokens => {
            setScoutTokens(prev => prev + tokens);
            soundEngine.playCoins();
          }}
          onClose={() => setShowMysteryWordle(false)}
        />
      )}

      {/* 7. Manager Tactical DNA Profile Modal */}
      {showManagerDNA && (
        <ManagerProfileCardModal
          managerName={manager?.name || 'Head Coach'}
          formationName={formationName}
          onClose={() => setShowManagerDNA(false)}
        />
      )}

      {/* 8. Squad Tactical Report & Hexagon Radar Modal */}
      {showSquadReportModal && (
        <SquadReportModal
          startingXI={startingXI}
          formationName={formationName}
          managerName={manager?.name}
          onClose={() => setShowSquadReportModal(false)}
        />
      )}

      {/* 9. Standalone Aftergame Summary & Hexagon Modal */}
      {summaryModalMatch && (
        <AftergameSummaryModal
          match={summaryModalMatch}
          startingXI={startingXI}
          managerName={manager?.name}
          onClose={() => setSummaryModalMatch(null)}
          onNextMatch={
            draftPhase === 'season_hub' && matchday <= maxMatchdays && !isTournamentEliminated
              ? () => {
                  handleSimulateNextLeagueMatch(tacticalEdgeActive, mindGameChoice);
                  setTacticalEdgeActive(false);
                  setMindGameChoice(null);
                  setSummaryModalMatch(null);
                }
              : undefined
          }
        />
      )}

      {/* Restart Confirmation Dialog */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md font-mono text-xs">
          <div className="bg-gradient-to-b from-[#18212e] to-[#0e141d] border border-slate-700/80 p-5 max-w-sm w-full space-y-4 rounded-3xl shadow-2xl">
            <div className="text-white font-black uppercase text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              CONFIRM CAMPAIGN RESET
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              Are you sure you want to restart? Your current Starting XI, Dugout bench, and campaign progress will be reset.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRestartGame}
                className="flex-1 py-2 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black rounded-xl border border-rose-500 shadow-md transition-all active:scale-95"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mid-Draft Mode Lock / Abandon Confirmation Modal */}
      {showDraftAbandonConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md font-mono text-xs">
          <div className="bg-gradient-to-b from-[#18212e] to-[#0e141d] border border-amber-500/70 p-5 max-w-sm w-full space-y-4 rounded-3xl shadow-2xl">
            <div className="text-white font-black uppercase text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              MODE LOCKED DURING DRAFT
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              You are currently in the middle of drafting (Round <span className="text-amber-400 font-bold">{draftRound}/16</span>). Changing game modes or returning to the main menu requires forfeiting your active draft.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowDraftAbandonConfirm(false)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl transition-all shadow-md active:scale-95"
              >
                Keep Drafting
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowDraftAbandonConfirm(false);
                  handleRestartGame();
                }}
                className="flex-1 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-200 rounded-xl font-bold transition-all active:scale-95"
              >
                Forfeit & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
