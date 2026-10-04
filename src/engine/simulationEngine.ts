import {
  Player,
  TacticalStyle,
  Manager,
  OpponentTeam,
  MatchResult,
  MatchEvent,
  MatchPlayerStats,
  TeamMatchStats,
  SeasonAwards,
  Formation,
  ManagerDecisionEvent,
  TacticalChipType
} from '../types/football';
import {
  analyzeSquadAuras,
  applyPreMatchAuraBuffs,
  getTacticalModifier
} from './auraEngine';
import { calculateTeamChemistry } from './chemistryEngine';
import { applyPositionFitToPlayer } from './positionEngine';

export interface SimulationOptions {
  userSquad: (Player | null)[];
  userTactic: TacticalStyle;
  manager: Manager | null;
  opponent: OpponentTeam;
  competition: string;
  matchday: number;
  isHome?: boolean;
  isTwoLegged?: boolean;
  leg?: 1 | 2;
  firstLegResult?: { homeScore: number; awayScore: number };
  formation?: Formation;
  tacticalScoutAdvantage?: boolean;
  trainingFocus?: 'gegenpress' | 'finishing' | 'defense' | 'tiki_taka' | 'youth' | null;
  mindGameAdvantage?: 'composure' | 'aggression' | 'counter' | null;
  activeChip?: TacticalChipType | null;
  selectedCaptainId?: string | null;
}

/**
 * Normalizes random number with normal-like distribution around mean
 */
function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

/**
 * Generates realistic pitch coordinates (0 to 100 on width, 0 to 100 from goal line)
 * for a shot based on its xG quality.
 */
function generateShotCoordinates(xg: number): { shotX: number; shotY: number } {
  if (xg >= 0.40) {
    // High danger: 6-yard box or central penalty area (x: 40-60, y: 6-18)
    const shotX = Math.round(50 + (Math.random() - 0.5) * 20);
    const shotY = Math.round(6 + Math.random() * 12);
    return { shotX, shotY };
  } else if (xg >= 0.20) {
    // Medium danger: Penalty box (x: 30-70, y: 15-32)
    const shotX = Math.round(50 + (Math.random() - 0.5) * 40);
    const shotY = Math.round(15 + Math.random() * 17);
    return { shotX, shotY };
  } else {
    // Long range or acute angle: (x: 18-82, y: 28-60)
    const isWideAngle = Math.random() < 0.45;
    const shotX = isWideAngle
      ? Math.round(Math.random() < 0.5 ? 18 + Math.random() * 16 : 66 + Math.random() * 16)
      : Math.round(50 + (Math.random() - 0.5) * 32);
    const shotY = Math.round(28 + Math.random() * 32);
    return { shotX, shotY };
  }
}

/**
 * Calculates dynamic player match rating on a 6.0 to 10.0 scale
 */
function calculateMatchRating(stats: Partial<MatchPlayerStats>, wonGame: boolean): number {
  let rating = 6.4;

  if (stats.goals) rating += stats.goals * 1.1;
  if (stats.assists) rating += stats.assists * 0.7;
  if (stats.cleanSheet && (stats.position === 'DEF' || stats.position === 'GK')) rating += 0.8;
  if (stats.saves) rating += Math.min(stats.saves * 0.35, 1.8);
  if (stats.tacklesWon) rating += Math.min(stats.tacklesWon * 0.15, 1.0);
  if (stats.keyPasses) rating += Math.min(stats.keyPasses * 0.15, 0.8);
  if (stats.yellowCard) rating -= 0.3;
  if (stats.redCard) rating -= 1.8;
  if (wonGame) rating += 0.2;

  // Gaussian noise
  rating += (Math.random() - 0.5) * 0.2;
  return Math.min(10.0, Math.max(5.8, Math.round(rating * 10) / 10));
}

/**
 * Main Match Simulation Function
 */
export function simulateMatch(options: SimulationOptions): MatchResult {
  const {
    userSquad,
    userTactic,
    manager,
    opponent,
    competition,
    matchday,
    isHome = true,
    isTwoLegged = false,
    leg = 1,
    firstLegResult,
    formation,
  } = options;

  const chemistry = calculateTeamChemistry(userSquad);
  const userAuras = analyzeSquadAuras(userSquad, manager?.perkName);
  const preBuffed = applyPreMatchAuraBuffs(userSquad, userAuras);

  // Apply position fit penalties & map players to their active slot categories
  const activePlayers = preBuffed.map((player, idx) => {
    if (formation?.slots[idx]) {
      const slot = formation.slots[idx];
      const adapted = applyPositionFitToPlayer(player, slot.label);
      return {
        ...adapted,
        position: slot.category,
      };
    }
    return player;
  });

  // Group user squad by position
  const gks = activePlayers.filter(p => p.position === 'GK');
  const defs = activePlayers.filter(p => p.position === 'DEF');
  const mids = activePlayers.filter(p => p.position === 'MID');
  const fwds = activePlayers.filter(p => p.position === 'FWD');

  const userGk = gks[0] || null;
  const userGkRating = userGk ? userGk.overall : 75;

  // Calculate sector ratings
  const userAttRating = fwds.length > 0
    ? fwds.reduce((acc, p) => acc + (p.shooting + p.pace + p.dribbling) / 3, 0) / fwds.length
    : 75;

  const userMidRating = mids.length > 0
    ? mids.reduce((acc, p) => acc + (p.passing + p.dribbling + p.physical) / 3, 0) / mids.length
    : 75;

  const baseDefRating = defs.length > 0
    ? defs.reduce((acc, p) => acc + (p.defending + p.physical + p.pace) / 3, 0) / defs.length
    : 75;
  const userDefRating = baseDefRating * (1 + chemistry.defendingBonus);

  // Tactical modifiers
  const tacticalMod = getTacticalModifier(userTactic, opponent.tactic);

  // Possession calculation
  const midDiff = userMidRating - opponent.midfieldRating;
  let userPossession = 50 + midDiff * 0.8 + tacticalMod.possessionDelta + Math.round(chemistry.passingBonus * 50);

  // Manager: Pep Guardiola "Juego de Posición" (+15% possession control)
  if (manager?.perkName === 'Juego de Posición') {
    userPossession += 7;
  }

  // Aura: The Enforcer (-12% opp possession, capped per enforcer)
  if (userAuras.enforcerCount > 0) {
    userPossession += Math.min(12, userAuras.enforcerCount * 6);
  }

  // Pre-match Tactical Scouting Dossier Counter-Tactic edge
  if (options.tacticalScoutAdvantage) {
    userPossession += 5;
    tacticalMod.userXgMultiplier *= 1.10;
  }

  // Dynasty Club Training Regimen Focus
  if (options.trainingFocus === 'gegenpress') {
    userPossession += 4;
    tacticalMod.oppXgMultiplier *= 0.92;
  } else if (options.trainingFocus === 'tiki_taka') {
    userPossession += 6;
  } else if (options.trainingFocus === 'finishing') {
    tacticalMod.userXgMultiplier *= 1.12;
  } else if (options.trainingFocus === 'defense') {
    tacticalMod.oppXgMultiplier *= 0.88;
  }

  // Pre-match Opposition Mind Games & Press Duel Edge
  if (options.mindGameAdvantage === 'composure') {
    userPossession += 4;
    tacticalMod.oppXgMultiplier *= 0.94;
  } else if (options.mindGameAdvantage === 'aggression') {
    tacticalMod.oppXgMultiplier *= 0.88;
    tacticalMod.userXgMultiplier *= 1.05;
  } else if (options.mindGameAdvantage === 'counter') {
    tacticalMod.userXgMultiplier *= 1.15;
    userPossession -= 2;
  }

  // Tactical Consumable Power Chips (FPL / One Two Inspired)
  if (options.activeChip === 'triple_captain') {
    tacticalMod.userXgMultiplier *= 1.25;
  } else if (options.activeChip === 'bench_boost') {
    userPossession += 5;
    tacticalMod.userXgMultiplier *= 1.15;
    tacticalMod.oppXgMultiplier *= 0.88;
  } else if (options.activeChip === 'free_hit') {
    userPossession += 6;
    tacticalMod.userXgMultiplier *= 1.30;
  } else if (options.activeChip === 'wildcard') {
    userPossession += 5;
    tacticalMod.userXgMultiplier *= 1.20;
    tacticalMod.oppXgMultiplier *= 0.86;
  }

  // Bound possession between 32% and 72%
  userPossession = Math.max(32, Math.min(72, Math.round(userPossession)));
  const oppPossession = 100 - userPossession;

  // Initialize player match stats
  const playerStatsMap = new Map<string, MatchPlayerStats>();
  activePlayers.forEach(p => {
    playerStatsMap.set(p.id, {
      playerId: p.id,
      playerName: p.name,
      position: p.position,
      minutes: 90,
      goals: 0,
      assists: 0,
      shots: 0,
      shotsOnTarget: 0,
      xG: 0,
      xA: 0,
      keyPasses: 0,
      tacklesWon: 0,
      saves: 0,
      cleanSheet: false,
      yellowCard: false,
      redCard: false,
      matchRating: 6.5,
    });
  });

  const events: MatchEvent[] = [];
  if (options.mindGameAdvantage) {
    const mindGameDesc =
      options.mindGameAdvantage === 'composure'
        ? '🧊 MIND GAMES IMPACT: Your squad displays supreme ice-cold composure under intense press, refusing to yield possession!'
        : options.mindGameAdvantage === 'aggression'
        ? '⚔️ MIND GAMES IMPACT: Battle cry echoes across the pitch! Your team dominates early 50/50 challenges and physical duels!'
        : '🧠 MIND GAMES IMPACT: Mastermind counter-ambush sprung! Your side lures the opposition forward, priming lethal breaks!';
    events.push({
      minute: 2,
      type: 'aura_trigger',
      team: isHome ? 'home' : 'away',
      description: mindGameDesc,
    });
  }

  if (options.activeChip) {
    const chipDesc =
      options.activeChip === 'triple_captain'
        ? '👑 TRIPLE CAPTAIN CHIP ACTIVATED: The captain commands the pitch with 3x tactical output & leadership presence!'
        : options.activeChip === 'bench_boost'
        ? '⚡ BENCH BOOST CHIP ACTIVATED: Roster depth overwhelms the opposition with fresh intensity and relentless pressing!'
        : options.activeChip === 'free_hit'
        ? '🌟 FREE HIT CHIP ACTIVATED: Elite marquee loanee spearheads a lethal offensive blitz!'
        : '🃏 TACTICAL WILDCARD CHIP ACTIVATED: Complete tactical overhaul blindsides the opposition defensive structure!';
    events.push({
      minute: 1,
      type: 'aura_trigger',
      team: isHome ? 'home' : 'away',
      description: chipDesc,
    });
  }
  let userScore = 0;
  let oppScore = 0;
  let userTotalXg = 0;
  let oppTotalXg = 0;
  let userShots = 0;
  let userShotsOnTarget = 0;
  let oppShots = 0;
  let oppShotsOnTarget = 0;
  let userTackles = 0;
  let oppTackles = 0;
  let userYellows = 0;
  let oppYellows = 0;
  let userReds = 0;
  let oppReds = 0;

  // Home advantage (+8% attack rating buff)
  const userHomeBuff = isHome ? 1.08 : 0.96;
  const oppHomeBuff = !isHome ? 1.08 : 0.96;

  // Number of chances (10 to 14 possession events)
  const totalEvents = Math.floor(10 + Math.random() * 5);

  // Time milestones for simulation
  const minuteSteps: number[] = [];
  for (let i = 0; i < totalEvents; i++) {
    minuteSteps.push(Math.floor(4 + (88 / totalEvents) * i + (Math.random() * 4 - 2)));
  }
  minuteSteps.sort((a, b) => a - b);

  // Check second leg aggregate context
  const isSecondLeg = isTwoLegged && leg === 2 && firstLegResult;
  let userAggScore = isSecondLeg
    ? (isHome ? firstLegResult.awayScore : firstLegResult.homeScore)
    : 0;
  let oppAggScore = isSecondLeg
    ? (isHome ? firstLegResult.homeScore : firstLegResult.awayScore)
    : 0;

  // Simulate regulation 90 minutes
  for (const minute of minuteSteps) {
    // Check second-leg desperation (All-Out Attack past 60 min if trailing)
    let userAllOutAttack = false;
    let oppAllOutAttack = false;

    if (isSecondLeg && minute >= 60) {
      const curUserAgg = userAggScore + userScore;
      const curOppAgg = oppAggScore + oppScore;
      if (curUserAgg < curOppAgg) userAllOutAttack = true;
      if (curOppAgg < curUserAgg) oppAllOutAttack = true;
    }

    // Determine possession of this chance based on possession share
    const isUserChance = (Math.random() * 100) < userPossession;

    if (isUserChance) {
      // USER ATTACK CHANCE
      userShots++;
      let shotXg = 0.08 + Math.random() * 0.35;

      // Sector calculation: User Attack vs Opponent Defense
      const attAdvantage = (userAttRating * userHomeBuff) / (opponent.defenseRating * oppHomeBuff);
      shotXg *= attAdvantage * tacticalMod.userXgMultiplier * chemistry.xgMultiplier;

      if (userAllOutAttack) {
        shotXg *= 1.25; // Balanced All-Out attack boost
      }

      // Check Solo Anarchy Aura (Messi, R9, Henry)
      const anarchyPlayer = userAuras.soloAnarchyPlayers.length > 0 && Math.random() < 0.20
        ? userAuras.soloAnarchyPlayers[Math.floor(Math.random() * userAuras.soloAnarchyPlayers.length)]
        : null;

      let shooter: Player | null = null;
      let assister: Player | null = null;

      if (anarchyPlayer) {
        shooter = anarchyPlayer;
        shotXg = Math.min(0.65, Math.max(0.42, shotXg * 1.35));
        events.push({
          minute,
          type: 'aura_trigger',
          team: isHome ? 'home' : 'away',
          scorerId: anarchyPlayer.id,
          scorerName: anarchyPlayer.name,
          description: `[AURA TRIGGER] ${anarchyPlayer.name} unleashes [Solo Anarchy]! Dribbles through defense with explosive burst!`
        });
      } else {
        // Pick shooter from FWDs or attacking MIDs
        const potentialShooters = [...fwds, ...mids];
        if (potentialShooters.length > 0) {
          const weights = potentialShooters.map(p => {
            let w = p.shooting + (p.position === 'FWD' ? 30 : 0);
            if (options.activeChip === 'triple_captain' && options.selectedCaptainId === p.id) {
              w *= 3.0;
            }
            return w;
          });
          const totalW = weights.reduce((a, b) => a + b, 0);
          let r = Math.random() * totalW;
          for (let k = 0; k < potentialShooters.length; k++) {
            if (r <= weights[k]) {
              shooter = potentialShooters[k];
              break;
            }
            r -= weights[k];
          }
          if (!shooter) shooter = potentialShooters[0];
          if (options.activeChip === 'triple_captain' && shooter.id === options.selectedCaptainId) {
            shotXg *= 1.20;
          }
        }

        // Pick assister from mids/defs
        const potentialAssisters = activePlayers.filter(p => p.id !== shooter?.id);
        if (potentialAssisters.length > 0 && Math.random() < 0.75) {
          assister = potentialAssisters[Math.floor(Math.random() * potentialAssisters.length)];
        }
      }

      // Aura: Raumdeuter (Muller elevates partner striker conversion +15%)
      if (userAuras.raumdeuter && shooter?.position === 'FWD' && shooter.id !== 'bay-muller' && shooter.id !== 'ger-muller') {
        shotXg *= 1.15;
      }

      // Aura: 92:48 Clutch (Ramos / Drogba in 80th+ minute knockout when trailing/tied)
      const isKnockout = competition.includes('Champions') || competition.includes('Cup') || competition.includes('Tournament');
      const isClutchTime = minute >= 80;
      const isTrailingOrTied = userScore <= oppScore;

      if (userAuras.clutch9248 && isKnockout && isClutchTime && isTrailingOrTied) {
        shotXg *= 1.40; // Balanced set-piece scoring boost
        events.push({
          minute,
          type: 'aura_trigger',
          team: isHome ? 'home' : 'away',
          description: `[AURA TRIGGER] 92:48 Clutch Header! Desperate late set-piece launched into the box with immense composure!`
        });
      }

      // Manager: Fergie Time (+0.15 xG during 85-95 min if drawing or losing)
      let fergieBuff = false;
      if (userAuras.fergieTimeEligible && minute >= 85 && userScore <= oppScore) {
        shotXg += 0.15;
        fergieBuff = true;
      }

      // Bound shot xG to maximum 0.88
      shotXg = Math.min(0.88, Math.max(0.04, Math.round(shotXg * 100) / 100));
      userTotalXg += shotXg;

      // Update shooter & assister stats
      if (shooter) {
        const sStat = playerStatsMap.get(shooter.id);
        if (sStat) {
          sStat.shots++;
          sStat.xG += shotXg;
        }
      }
      if (assister) {
        const aStat = playerStatsMap.get(assister.id);
        if (aStat) {
          aStat.keyPasses++;
          aStat.xA += shotXg * 0.7;
        }
      }

      // Opponent goalkeeper save check
      const gkSaveSkill = opponent.gkRating / 100;
      const isShotOnTarget = Math.random() < 0.65 + (shooter ? shooter.shooting / 400 : 0);

      const { shotX, shotY } = generateShotCoordinates(shotXg);

      if (isShotOnTarget) {
        userShotsOnTarget++;
        if (shooter) {
          const sStat = playerStatsMap.get(shooter.id);
          if (sStat) sStat.shotsOnTarget++;
        }

        // Shot conversion check against xG and GK quality
        const conversionThreshold = shotXg * (1.15 - gkSaveSkill * 0.35);
        const isGoal = Math.random() < conversionThreshold;

        if (isGoal) {
          userScore++;
          if (shooter) {
            const sStat = playerStatsMap.get(shooter.id);
            if (sStat) sStat.goals++;
          }
          if (assister) {
            const aStat = playerStatsMap.get(assister.id);
            if (aStat) aStat.assists++;
          }

          events.push({
            minute,
            type: 'goal',
            team: isHome ? 'home' : 'away',
            scorerId: shooter?.id,
            scorerName: shooter?.name || 'Striker',
            assistId: assister?.id,
            assistName: assister?.name,
            xG: shotXg,
            isFergieTime: fergieBuff,
            shotX,
            shotY,
            shotOutcome: 'goal',
            description: `${shooter?.name || 'Player'} buries a clinical strike (${shotXg.toFixed(2)} xG)${assister ? ` assisted by ${assister.name}` : ''}${fergieBuff ? ' in FERGIE TIME!' : '!'}`
          });
        } else {
          events.push({
            minute,
            type: 'save',
            team: isHome ? 'home' : 'away',
            scorerName: shooter?.name,
            xG: shotXg,
            shotX,
            shotY,
            shotOutcome: 'saved',
            description: `${shooter?.name || 'Attacker'} tests the keeper with a sharp shot (${shotXg.toFixed(2)} xG), but it's parried away!`
          });
        }
      } else {
        const missRand = Math.random();
        let shotOutcome: 'woodwork' | 'blocked' | 'missed';
        let missDesc: string;

        if (missRand < 0.16) {
          shotOutcome = 'woodwork';
          missDesc = `${shooter?.name || 'Attacker'} rattles the woodwork! Thumps off the post/crossbar (${shotXg.toFixed(2)} xG)!`;
        } else if (missRand < 0.38) {
          shotOutcome = 'blocked';
          missDesc = `${shooter?.name || 'Attacker'} has a goalbound effort heroically blocked by a defender (${shotXg.toFixed(2)} xG)!`;
        } else {
          shotOutcome = 'missed';
          missDesc = `${shooter?.name || 'Attacker'} fires from distance (${shotXg.toFixed(2)} xG) - just wide of the post.`;
        }

        events.push({
          minute,
          type: 'shot',
          team: isHome ? 'home' : 'away',
          scorerName: shooter?.name,
          xG: shotXg,
          shotX,
          shotY,
          shotOutcome,
          description: missDesc
        });
      }
    } else {
      // OPPONENT ATTACK CHANCE
      oppShots++;
      let oppShotXg = 0.08 + Math.random() * 0.34;

      // Sector calculation: Opponent Attack vs User Defense
      const oppAttAdvantage = (opponent.attackRating * oppHomeBuff) / (userDefRating * userHomeBuff);
      oppShotXg *= oppAttAdvantage * tacticalMod.oppXgMultiplier;

      // Aura: Sweeper Keeper (Neuer stops 20% of breakaways before they turn into shots)
      if (userAuras.sweeperKeeper && Math.random() < 0.20) {
        if (userGk) {
          const gkStat = playerStatsMap.get(userGk.id);
          if (gkStat) gkStat.saves++;
        }
        events.push({
          minute,
          type: 'aura_trigger',
          team: isHome ? 'away' : 'home',
          description: `[SWEEPER KEEPER] ${userGk?.name || 'Goalkeeper'} dashes off his line, intercepting the through ball with composure!`
        });
        continue;
      }

      // Aura: Titan's Roar (Oliver Kahn suppresses opponent 6-yard box xG by 12%)
      if (userAuras.titanRoar) {
        oppShotXg *= 0.88;
      }

      // Aura: The Colossus (Van Dijk suppresses central xG by 15%)
      if (userAuras.colossusDef) {
        oppShotXg *= 0.85;
      }

      // Manager: Mourinho The Special Low-Block (-20% opp xG when leading after 60 min)
      if (userAuras.specialistLowBlock && minute >= 60 && userScore > oppScore) {
        oppShotXg *= 0.80;
      }

      // Counter-attack vulnerability if user is pushing All-Out Attack
      if (userAllOutAttack) {
        oppShotXg *= 1.35;
      }

      oppShotXg = Math.min(0.85, Math.max(0.04, Math.round(oppShotXg * 100) / 100));
      oppTotalXg += oppShotXg;

      // User defenders tackling chances
      if (defs.length > 0) {
        const tackler = defs[Math.floor(Math.random() * defs.length)];
        const tStat = playerStatsMap.get(tackler.id);
        if (tStat && Math.random() < 0.45) {
          tStat.tacklesWon++;
          userTackles++;
        }
      }

      const { shotX: oppShotX, shotY: oppShotY } = generateShotCoordinates(oppShotXg);
      const isShotOnTarget = Math.random() < 0.62;
      if (isShotOnTarget) {
        oppShotsOnTarget++;
        // User GK Save check
        let saveProb = 1 - oppShotXg * (1.1 - (userGkRating / 150));

        // Aura: Mind Games King (Dibu Martinez stops 1v1 breakaway shots)
        if (userAuras.mindGamesKeeper && oppShotXg > 0.45) {
          saveProb = Math.max(saveProb, 0.70);
        }

        const isSaved = Math.random() < saveProb;

        if (!isSaved) {
          oppScore++;
          events.push({
            minute,
            type: 'goal',
            team: isHome ? 'away' : 'home',
            scorerName: opponent.name,
            xG: oppShotXg,
            shotX: oppShotX,
            shotY: oppShotY,
            shotOutcome: 'goal',
            description: `${opponent.name} finds a gap in the defense to score! (${oppShotXg.toFixed(2)} xG)`
          });
        } else {
          if (userGk) {
            const gkStat = playerStatsMap.get(userGk.id);
            if (gkStat) gkStat.saves++;
          }
          events.push({
            minute,
            type: 'save',
            team: isHome ? 'away' : 'home',
            xG: oppShotXg,
            shotX: oppShotX,
            shotY: oppShotY,
            shotOutcome: 'saved',
            description: `Huge save by ${userGk?.name || 'Goalkeeper'} denying a dangerous attempt from ${opponent.name}!`
          });
        }
      } else {
        const missRand = Math.random();
        let shotOutcome: 'woodwork' | 'blocked' | 'missed';
        let missDesc: string;

        if (missRand < 0.16) {
          shotOutcome = 'woodwork';
          missDesc = `${opponent.name} rattles the woodwork with a thunderous effort (${oppShotXg.toFixed(2)} xG)!`;
        } else if (missRand < 0.38) {
          shotOutcome = 'blocked';
          missDesc = `${opponent.name} has a goalbound strike heroically blocked by your center-backs (${oppShotXg.toFixed(2)} xG)!`;
        } else {
          shotOutcome = 'missed';
          missDesc = `${opponent.name} strikes from outside the box (${oppShotXg.toFixed(2)} xG), sailing harmlessly wide.`;
        }

        events.push({
          minute,
          type: 'shot',
          team: isHome ? 'away' : 'home',
          xG: oppShotXg,
          shotX: oppShotX,
          shotY: oppShotY,
          shotOutcome,
          description: missDesc
        });
      }
    }

    // Occasional Yellow cards & physical fouls
    if (Math.random() < 0.07) {
      if (Math.random() < 0.5) {
        userYellows++;
        const cardTarget = activePlayers[Math.floor(Math.random() * activePlayers.length)];
        const cStat = playerStatsMap.get(cardTarget.id);
        if (cStat && !cStat.yellowCard) {
          cStat.yellowCard = true;
          events.push({
            minute,
            type: 'yellow_card',
            team: isHome ? 'home' : 'away',
            description: `Yellow card issued to ${cardTarget.name} for a tactical foul.`
          });
        }
      } else {
        oppYellows++;
      }
    }
  }

  // Determine Clean Sheet
  if (oppScore === 0) {
    activePlayers.forEach(p => {
      if (p.position === 'DEF' || p.position === 'GK') {
        const stat = playerStatsMap.get(p.id);
        if (stat) stat.cleanSheet = true;
      }
    });
  }

  // Knockout Tie Aggregate & Extra Time Logic
  let wentToExtraTime = false;
  let penaltyResult: { home: number; away: number } | undefined = undefined;

  const homeScore = isHome ? userScore : oppScore;
  const awayScore = isHome ? oppScore : userScore;

  let totalUserAgg = userScore;
  let totalOppAgg = oppScore;

  // Check if this match requires a decisive winner:
  // 1. Second leg of a two-legged tie where aggregate is tied
  // 2. Single-leg knockout match (World Cup or UCL Final) where score is tied
  const isKnockoutMatch = competition.includes('Knockouts') || competition.includes('World Cup') || competition.includes('Champions') || competition.includes('Final');
  const isSingleLegKnockout = !isTwoLegged && isKnockoutMatch;

  if (isSecondLeg) {
    totalUserAgg = userAggScore + userScore;
    totalOppAgg = oppAggScore + oppScore;
  }

  const isTiedAt90 = isSecondLeg
    ? totalUserAgg === totalOppAgg
    : isSingleLegKnockout && userScore === oppScore;

  if (isTiedAt90) {
    wentToExtraTime = true;
    events.push({
      minute: 90,
      type: 'aura_trigger',
      team: 'home',
      description: isSecondLeg
        ? `⏱️ FULL TIME (AGGREGATE TIED ${totalUserAgg}-${totalOppAgg})! The tie heads into 30 minutes of EXTRA TIME!`
        : `⏱️ FULL TIME (TIED ${userScore}-${oppScore})! Knockout match heads into 30 minutes of EXTRA TIME!`
    });

    // Extra time simulation (100' and 115')
    const etUserChance = Math.random() < 0.45;
    const etOppChance = Math.random() < 0.35;

    // Aura: Iniesta "116th Minute Hero" (+50% goal probability in ET)
    const iniestaBuff = activePlayers.some(p => p.auraTrait?.id?.includes('world-cup-winner-iniesta'));

    if (etUserChance || iniestaBuff) {
      userScore++;
      totalUserAgg++;
      const etScorer = fwds[0] || mids[0] || activePlayers[0];
      const sStat = playerStatsMap.get(etScorer.id);
      if (sStat) sStat.goals++;
      events.push({
        minute: 116,
        type: 'goal',
        team: isHome ? 'home' : 'away',
        scorerId: etScorer.id,
        scorerName: etScorer.name,
        xG: 0.54,
        shotX: 52,
        shotY: 12,
        shotOutcome: 'goal',
        description: `[EXTRA TIME GOAL] ${etScorer.name} strikes in the 116th minute to break the aggregate deadlock!`
      });
    } else if (etOppChance) {
      oppScore++;
      totalOppAgg++;
      events.push({
        minute: 108,
        type: 'goal',
        team: isHome ? 'away' : 'home',
        scorerName: opponent.name,
        xG: 0.49,
        shotX: 48,
        shotY: 14,
        shotOutcome: 'goal',
        description: `[EXTRA TIME GOAL] ${opponent.name} finds a dramatic extra-time goal!`
      });
    }

    const isStillTied = isSecondLeg ? totalUserAgg === totalOppAgg : userScore === oppScore;

    // If STILL tied after extra time: Penalty Shootout!
    if (isStillTied) {
      events.push({
        minute: 120,
        type: 'penalty_shootout',
        team: 'home',
        description: `[PENALTY SHOOTOUT] Composure, nerves of steel, and goalkeeping heroics will decide who advances!`
      });

      let userPenScore = 0;
      let oppPenScore = 0;

      // Penalty takers chosen by Composure
      const sortedTakers = [...activePlayers].sort((a, b) => b.composure - a.composure);

      for (let round = 0; round < 5; round++) {
        const taker = sortedTakers[round % sortedTakers.length];
        // User penalty conversion based on composure
        const userConversionProb = Math.min(0.95, (taker.composure / 100) * 0.92);
        if (Math.random() < userConversionProb) userPenScore++;

        // Opponent penalty conversion based on user GK shot-stopping and auras
        let oppConversionProb = 0.78;
        if (userAuras.mindGamesKeeper) oppConversionProb = 0.50; // Dibu Martinez penalty mind games
        if (userGk && userGk.defending > 90) oppConversionProb -= 0.12;

        if (Math.random() < oppConversionProb) oppPenScore++;
      }

      // Sudden death if tied after 5 rounds
      while (userPenScore === oppPenScore) {
        if (Math.random() < 0.80) userPenScore++;
        if (Math.random() < 0.75) oppPenScore++;
      }

      penaltyResult = isHome
        ? { home: userPenScore, away: oppPenScore }
        : { home: oppPenScore, away: userPenScore };

      events.push({
        minute: 120,
        type: 'penalty_shootout',
        team: userPenScore > oppPenScore ? (isHome ? 'home' : 'away') : (isHome ? 'away' : 'home'),
        description: `Shootout concluded: ${userPenScore > oppPenScore ? 'User Squad' : opponent.name} wins ${isHome ? `${userPenScore}-${oppPenScore}` : `${oppPenScore}-${userPenScore}`} on penalties!`
      });
    }
  }

  // Recalculate dynamic player ratings
  const userWon = userScore > oppScore || (penaltyResult !== undefined && (isHome ? penaltyResult.home > penaltyResult.away : penaltyResult.away > penaltyResult.home));
  activePlayers.forEach(p => {
    const stat = playerStatsMap.get(p.id);
    if (stat) {
      stat.matchRating = calculateMatchRating(stat, userWon);
    }
  });

  const finalHomeScore = isHome ? userScore : oppScore;
  const finalAwayScore = isHome ? oppScore : userScore;

  const userStats: TeamMatchStats = {
    teamName: 'Your Starting XI',
    score: userScore,
    xG: Math.round(userTotalXg * 100) / 100,
    shots: userShots,
    shotsOnTarget: userShotsOnTarget,
    possession: userPossession,
    passesCompleted: Math.round(userPossession * 8.5),
    passAccuracy: userAuras.metronome ? 92 : Math.min(94, Math.round(78 + userMidRating * 0.14)),
    tacklesWon: userTackles,
    fouls: Math.floor(userYellows * 2.5 + Math.random() * 4),
    yellowCards: userYellows,
    redCards: userReds,
    ppda: Math.round((10 - (userTactic === 'Gegenpress' ? 3.5 : 0)) * 10) / 10,
    playerStats: Array.from(playerStatsMap.values()),
  };

  const oppStats: TeamMatchStats = {
    teamName: opponent.name,
    score: oppScore,
    xG: Math.round(oppTotalXg * 100) / 100,
    shots: oppShots,
    shotsOnTarget: oppShotsOnTarget,
    possession: oppPossession,
    passesCompleted: Math.round(oppPossession * 8.2),
    passAccuracy: Math.min(91, Math.round(76 + opponent.midfieldRating * 0.12)),
    tacklesWon: oppTackles,
    fouls: Math.floor(oppYellows * 2.2 + Math.random() * 5),
    yellowCards: oppYellows,
    redCards: oppReds,
    ppda: 11.2,
    playerStats: [],
  };

  let winner: 'home' | 'away' | 'draw' = 'draw';
  if (finalHomeScore > finalAwayScore) winner = 'home';
  else if (finalAwayScore > finalHomeScore) winner = 'away';

  if (penaltyResult) {
    winner = penaltyResult.home > penaltyResult.away ? 'home' : 'away';
  }

  const managerDecisions: ManagerDecisionEvent[] = [
    {
      id: `dec-1-${matchday}`,
      minute: 60,
      scenarioTitle: '60\' Midfield Crossroads',
      scenarioContext: userScore >= oppScore
        ? `Holding a ${userScore}-${oppScore} advantage. ${opponent.name} is ramping up high pressing.`
        : `Trailing ${userScore}-${oppScore} against ${opponent.name}. Midfield requires fresh tactical instruction.`,
      options: [
        {
          id: 'opt-direct-counter',
          label: 'Explosive Vertical Counter',
          tacticalDescription: 'Bypass midfield with direct balls into wide channels for speedy wingers.',
          risk: 'aggressive',
          userChanceBoost: 0.35,
          oppCounterRisk: 0.12,
          moraleOutcome: 'High vertical tempo, explosive breakaway chances!',
        },
        {
          id: 'opt-control-possession',
          label: 'Calm Tiki-Taka Freeze',
          tacticalDescription: 'Suck opponent in, retain 70%+ possession, and deny shooting angles.',
          risk: 'conservative',
          userChanceBoost: 0.10,
          oppCounterRisk: 0.02,
          moraleOutcome: 'Smothers opponent momentum with pristine ball retention.',
        },
        {
          id: 'opt-gegenpress-trap',
          label: 'High-Line Pressing Trap',
          tacticalDescription: 'Trigger a synchronized double-team whenever their center-backs receive the ball.',
          risk: 'balanced',
          userChanceBoost: 0.24,
          oppCounterRisk: 0.07,
          moraleOutcome: 'Forces high-turnover panic in the opposition defense.',
        },
      ],
    },
    {
      id: `dec-2-${matchday}`,
      minute: 82,
      scenarioTitle: '82\' Crunch Time Dilemma',
      scenarioContext: userScore > oppScore
        ? `Leading ${userScore}-${oppScore}! Opposition throwing bodies forward in desperation.`
        : userScore === oppScore
        ? `Deadlocked at ${userScore}-${oppScore}! Stoppage time looms and 3 points hang in the balance.`
        : `Trailing by a goal! Final attacking surge required from the bench and touchline.`,
      options: [
        {
          id: 'opt-allout-siege',
          label: 'All-Out Chaos Siege',
          tacticalDescription: 'Commit 8 players into the penalty box and deliver continuous aerial bombardments.',
          risk: 'aggressive',
          userChanceBoost: 0.42,
          oppCounterRisk: 0.22,
          moraleOutcome: 'Maximum drama, heart-stopping goalmouth scrambles!',
        },
        {
          id: 'opt-catenaccio-lock',
          label: 'Catenaccio Steel Fortress',
          tacticalDescription: 'Drop into an impenetrable 5-4-1 low block and waste seconds at throw-ins.',
          risk: 'conservative',
          userChanceBoost: 0.04,
          oppCounterRisk: 0.01,
          moraleOutcome: 'Suffocates opponent space and secures clean defensive sheet.',
        },
        {
          id: 'opt-balanced-surge',
          label: 'Methodical Wing Overload',
          tacticalDescription: 'Maintain structural integrity while full-backs create 2v1 overlaps.',
          risk: 'balanced',
          userChanceBoost: 0.20,
          oppCounterRisk: 0.05,
          moraleOutcome: 'Composed tactical precision under peak late-match pressure.',
        },
      ],
    },
  ];

  return {
    id: `match-${competition}-${matchday}-${Date.now()}`,
    matchday,
    competition,
    homeTeam: isHome ? 'Your Starting XI' : opponent.name,
    awayTeam: isHome ? opponent.name : 'Your Starting XI',
    homeScore: finalHomeScore,
    awayScore: finalAwayScore,
    isTwoLegged,
    leg,
    firstLegResult,
    aggregateScore: isSecondLeg
      ? {
          homeTeamTotal: isHome ? totalUserAgg : totalOppAgg,
          awayTeamTotal: isHome ? totalOppAgg : totalUserAgg
        }
      : undefined,
    extraTime: wentToExtraTime,
    penalties: penaltyResult,
    homeStats: isHome ? userStats : oppStats,
    awayStats: isHome ? oppStats : userStats,
    events,
    winner,
    managerDecisions,
  };
}

/**
 * Calculates End of Season Awards:
 * - Golden Boot
 * - Playmaker Award
 * - Golden Glove
 * - Ballon d'Or
 * - Team of the Season (TOTS)
 */
export function calculateSeasonAwards(
  allMatches: MatchResult[],
  startingSquad: Player[]
): SeasonAwards {
  const playerStatsSummary = new Map<string, {
    player: Player;
    goals: number;
    assists: number;
    cleanSheets: number;
    avgRating: number;
    ratings: number[];
  }>();

  startingSquad.forEach(p => {
    playerStatsSummary.set(p.id, {
      player: p,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      avgRating: 7.0,
      ratings: [],
    });
  });

  allMatches.forEach(m => {
    const userTeamStats = m.homeTeam === 'Your Starting XI' ? m.homeStats : m.awayStats;
    userTeamStats.playerStats.forEach(ps => {
      const summary = playerStatsSummary.get(ps.playerId);
      if (summary) {
        summary.goals += ps.goals;
        summary.assists += ps.assists;
        if (ps.cleanSheet) summary.cleanSheets++;
        summary.ratings.push(ps.matchRating);
      }
    });
  });

  // Calculate averages
  playerStatsSummary.forEach(s => {
    if (s.ratings.length > 0) {
      s.avgRating = Math.round((s.ratings.reduce((a, b) => a + b, 0) / s.ratings.length) * 100) / 100;
    }
  });

  const list = Array.from(playerStatsSummary.values());

  // Golden Boot (Most Goals)
  const sortedGoals = [...list].sort((a, b) => b.goals - a.goals);
  const goldenBootWinner = sortedGoals[0] || { player: { name: 'Thierry Henry' }, goals: 28 };

  // Playmaker Award (Most Assists)
  const sortedAssists = [...list].sort((a, b) => b.assists - a.assists);
  const playmakerWinner = sortedAssists[0] || { player: { name: 'Kevin De Bruyne' }, assists: 18 };

  // Golden Glove (Most Clean Sheets)
  const gks = list.filter(item => item.player.position === 'GK');
  const sortedCleanSheets = [...gks].sort((a, b) => b.cleanSheets - a.cleanSheets);
  const goldenGloveWinner = sortedCleanSheets[0] || { player: { name: 'Petr Čech' }, cleanSheets: 18 };

  // Ballon d'Or (Highest composite score: rating * 0.5 + goals * 0.3 + assists * 0.2)
  const sortedBallonDor = [...list].sort((a, b) => {
    const scoreA = a.avgRating * 4 + a.goals * 0.8 + a.assists * 0.5;
    const scoreB = b.avgRating * 4 + b.goals * 0.8 + b.assists * 0.5;
    return scoreB - scoreA;
  });
  const ballonDorWinner = sortedBallonDor[0] || { player: { name: 'Lionel Messi' }, avgRating: 8.85, goals: 34, assists: 16 };

  // Team of the Season (TOTS) 4-3-3 shape
  const totsGk = gks.sort((a, b) => b.avgRating - a.avgRating)[0]?.player.name || 'Goalkeeper';
  const totsDefs = list
    .filter(i => i.player.position === 'DEF')
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 4)
    .map(i => i.player.name);
  const totsMids = list
    .filter(i => i.player.position === 'MID')
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3)
    .map(i => i.player.name);
  const totsFwds = list
    .filter(i => i.player.position === 'FWD')
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3)
    .map(i => i.player.name);

  return {
    goldenBoot: {
      player: goldenBootWinner.player.name,
      team: 'Your Starting XI',
      goals: Math.max(goldenBootWinner.goals, 22),
    },
    playmakerAward: {
      player: playmakerWinner.player.name,
      team: 'Your Starting XI',
      assists: Math.max(playmakerWinner.assists, 14),
    },
    goldenGlove: {
      player: goldenGloveWinner.player.name,
      team: 'Your Starting XI',
      cleanSheets: Math.max(goldenGloveWinner.cleanSheets, 16),
    },
    ballonDor: {
      player: ballonDorWinner.player.name,
      team: 'Your Starting XI',
      rating: ballonDorWinner.avgRating,
      goals: ballonDorWinner.goals,
      assists: ballonDorWinner.assists,
    },
    tots: {
      gk: totsGk,
      defenders: totsDefs.length === 4 ? totsDefs : ['Paolo Maldini', 'Sergio Ramos', 'Virgil van Dijk', 'Ashley Cole'],
      midfielders: totsMids.length === 3 ? totsMids : ['Zinedine Zidane', 'Andrés Iniesta', 'Luka Modrić'],
      forwards: totsFwds.length === 3 ? totsFwds : ['Lionel Messi', 'Cristiano Ronaldo', 'Thierry Henry'],
    }
  };
}
