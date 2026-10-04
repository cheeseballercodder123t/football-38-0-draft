import { Player, TacticalStyle } from '../types/football';

export interface ActiveAuraEffects {
  titanRoar: boolean;
  enforcerCount: number;
  raumdeuter: boolean;
  clutch9248: boolean;
  metronome: boolean;
  soloAnarchyPlayers: Player[];
  sweeperKeeper: boolean;
  colossusDef: boolean;
  mindGamesKeeper: boolean;
  fideoClutch: boolean;
  superSubCount: number;
  deadBallArchitect: boolean;
  pressingTriggerCount: number;
  boxToBoxCount: number;
  specialistLowBlock: boolean;
  fergieTimeEligible: boolean;
  kloppPressActive: boolean;
}

/**
 * Evaluates the squad's active Aura traits and computes balanced passive buffs
 */
export function analyzeSquadAuras(
  squad: (Player | null)[],
  managerPerkName?: string
): ActiveAuraEffects {
  const activePlayers = squad.filter((p): p is Player => p !== null);
  const traits = activePlayers.map(p => p.auraTrait?.id).filter(Boolean);

  const soloAnarchyPlayers = activePlayers.filter(
    p => p.auraTrait?.id?.includes('solo-anarchy')
  );

  return {
    titanRoar: traits.some(t => t?.includes('titans-roar') || t?.includes('titan-roar')),
    enforcerCount: traits.filter(t => t?.includes('enforcer')).length,
    raumdeuter: traits.some(t => t?.includes('raumdeuter')),
    clutch9248: traits.some(t => t?.includes('92-48') || t?.includes('clutch-gene')),
    metronome: traits.some(t => t?.includes('metronome') || t?.includes('deep-playmaker')),
    soloAnarchyPlayers,
    sweeperKeeper: traits.some(t => t?.includes('sweeper-keeper')),
    colossusDef: traits.some(t => t?.includes('colossus') || t?.includes('aerial-sentinel')),
    mindGamesKeeper: traits.some(t => t?.includes('mindgames') || t?.includes('dibu-psyche')),
    fideoClutch: traits.some(t => t?.includes('fideo') || t?.includes('clutch-finisher')),
    superSubCount: traits.filter(t => t?.includes('super-sub')).length,
    deadBallArchitect: traits.some(t => t?.includes('dead-ball') || t?.includes('set-piece')),
    pressingTriggerCount: traits.filter(t => t?.includes('pressing-trigger')).length,
    boxToBoxCount: traits.filter(t => t?.includes('box-to-box')).length,
    specialistLowBlock: managerPerkName === 'The Special Low-Block',
    fergieTimeEligible: managerPerkName === 'Fergie Time',
    kloppPressActive: managerPerkName === 'Heavy Metal Football',
  };
}

/**
 * Applies balanced static buffs to player attributes before simulation begins
 * Rebalanced: moderate +3 to +6 stat boosts rather than extreme overrides
 */
export function applyPreMatchAuraBuffs(
  squad: (Player | null)[],
  auras: ActiveAuraEffects
): Player[] {
  return squad.filter((p): p is Player => p !== null).map(player => {
    const copy = { ...player };

    // Balanced Titan's Roar: Boosts defensive organization (+4 defending, max 86)
    if (auras.titanRoar && copy.position === 'DEF' && copy.defending < 86) {
      copy.defending = Math.min(86, copy.defending + 4);
      copy.overall = Math.min(88, copy.overall + 2);
    }

    // Balanced Metronome: Midfielders receive +3 composure and +3 passing
    if (auras.metronome && copy.position === 'MID') {
      copy.passing = Math.min(96, copy.passing + 3);
      copy.composure = Math.min(96, copy.composure + 3);
    }

    return copy;
  });
}

/**
 * Computes Tactical Advantage matrix (Rock-Paper-Scissors)
 * Balanced multipliers (+8% to +12% rather than +25%)
 */
export function getTacticalModifier(
  userTactic: TacticalStyle,
  oppTactic: TacticalStyle
): {
  possessionDelta: number;
  userXgMultiplier: number;
  oppXgMultiplier: number;
  counterChanceBoost: number;
} {
  let possessionDelta = 0;
  let userXgMultiplier = 1.0;
  let oppXgMultiplier = 1.0;
  let counterChanceBoost = 0;

  if (userTactic === 'Gegenpress') {
    if (oppTactic === 'Tiki-Taka') {
      possessionDelta = 4;
      userXgMultiplier = 1.10;
      oppXgMultiplier = 0.92;
    } else if (oppTactic === 'Low-Block Counter') {
      possessionDelta = 8;
      userXgMultiplier = 0.94;
      oppXgMultiplier = 1.12;
      counterChanceBoost = 0.08;
    } else {
      userXgMultiplier = 1.04;
    }
  } else if (userTactic === 'Tiki-Taka') {
    if (oppTactic === 'Low-Block Counter') {
      possessionDelta = 12;
      userXgMultiplier = 1.10;
      oppXgMultiplier = 0.92;
    } else if (oppTactic === 'Gegenpress') {
      possessionDelta = -4;
      userXgMultiplier = 0.92;
      oppXgMultiplier = 1.10;
    } else {
      possessionDelta = 6;
      userXgMultiplier = 1.05;
    }
  } else if (userTactic === 'Low-Block Counter') {
    if (oppTactic === 'Gegenpress') {
      possessionDelta = -8;
      userXgMultiplier = 1.12;
      oppXgMultiplier = 0.88;
      counterChanceBoost = 0.10;
    } else if (oppTactic === 'Tiki-Taka') {
      possessionDelta = -12;
      userXgMultiplier = 0.92;
      oppXgMultiplier = 1.10;
    } else {
      possessionDelta = -4;
      oppXgMultiplier = 0.95;
    }
  } else {
    // Direct Vertical
    possessionDelta = 0;
    userXgMultiplier = 1.04;
    oppXgMultiplier = 1.0;
  }

  return { possessionDelta, userXgMultiplier, oppXgMultiplier, counterChanceBoost };
}
