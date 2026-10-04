import { SquadData, GameMode, GameDifficulty } from '../types/football';

export interface TierWeights {
  elite: number;
  high: number;
  mid: number;
  low: number;
}

/**
 * Baseline tier probabilities per game mode
 */
export const MODE_TIER_WEIGHTS: Record<GameMode, TierWeights> = {
  // Harder competitions have high probabilities of rolling Elite & High tier squads
  champions_league: { elite: 0.65, high: 0.30, mid: 0.05, low: 0.00 },
  world_cup: { elite: 0.60, high: 0.30, mid: 0.10, low: 0.00 },
  rivalry_derby: { elite: 0.70, high: 0.30, mid: 0.00, low: 0.00 },
  draft_roguelike: { elite: 0.55, high: 0.35, mid: 0.10, low: 0.00 },
  invincible: { elite: 0.55, high: 0.35, mid: 0.10, low: 0.00 },

  // Standard domestic leagues: competitive mix with strong representation of top clubs
  premier_league: { elite: 0.45, high: 0.35, mid: 0.16, low: 0.04 },
  la_liga: { elite: 0.45, high: 0.35, mid: 0.16, low: 0.04 },
  serie_a: { elite: 0.45, high: 0.35, mid: 0.16, low: 0.04 },
  bundesliga: { elite: 0.45, high: 0.35, mid: 0.16, low: 0.04 },

  // Tactical / Challenge modes
  salary_cap: { elite: 0.35, high: 0.40, mid: 0.20, low: 0.05 },
  dynasty: { elite: 0.40, high: 0.35, mid: 0.20, low: 0.05 },
  on_the_money: { elite: 0.35, high: 0.40, mid: 0.20, low: 0.05 },
  build_a_player: { elite: 0.45, high: 0.35, mid: 0.15, low: 0.05 },
  last_one_standing: { elite: 0.40, high: 0.40, mid: 0.15, low: 0.05 },
  teammate_chain: { elite: 0.45, high: 0.35, mid: 0.15, low: 0.05 },
  player_career: { elite: 0.45, high: 0.35, mid: 0.15, low: 0.05 },
};

/**
 * Calculates adjusted tier weights based on difficulty and reroll status
 */
export function getAdjustedTierWeights(
  mode: GameMode,
  difficulty: GameDifficulty = 'classic',
  isReroll: boolean = false
): TierWeights {
  const base = { ...(MODE_TIER_WEIGHTS[mode] || MODE_TIER_WEIGHTS.premier_league) };

  // In Classic mode, give a player-friendly +5% boost to elite tier
  if (difficulty === 'classic') {
    base.elite = Math.min(0.90, base.elite + 0.05);
    base.mid = Math.max(0.02, base.mid - 0.03);
    base.low = Math.max(0.00, base.low - 0.02);
  }

  // Tactical Rerolls give a "Lucky Scout" bonus: +15% chance of rolling an Elite squad
  if (isReroll) {
    base.elite = Math.min(0.95, base.elite + 0.15);
    base.high = Math.max(0.04, base.high - 0.08);
    base.mid = Math.max(0.01, base.mid - 0.05);
    base.low = 0.00;
  }

  // Normalize weights so sum equals 1.0
  const total = base.elite + base.high + base.mid + base.low;
  return {
    elite: base.elite / total,
    high: base.high / total,
    mid: base.mid / total,
    low: base.low / total,
  };
}

/**
 * Weighted random squad selection engine
 * Ensures harder competitions like Champions League and World Cup feel competitive, rewarding, and fun.
 */
export function getWeightedRandomSquad(
  pool: SquadData[],
  mode: GameMode,
  difficulty: GameDifficulty = 'classic',
  isReroll: boolean = false
): SquadData {
  if (!pool || pool.length === 0) {
    throw new Error('Squad pool cannot be empty.');
  }

  if (pool.length === 1) return pool[0];

  // Group squads by tier
  const elitePool: SquadData[] = [];
  const highPool: SquadData[] = [];
  const midPool: SquadData[] = [];
  const lowPool: SquadData[] = [];

  for (const s of pool) {
    const tier = s.tier || 'mid';
    if (tier === 'elite') elitePool.push(s);
    else if (tier === 'high') highPool.push(s);
    else if (tier === 'mid') midPool.push(s);
    else lowPool.push(s);
  }

  const weights = getAdjustedTierWeights(mode, difficulty, isReroll);

  // Determine target tier via roulette wheel selection
  const rand = Math.random();
  let chosenPool: SquadData[] = [];

  if (rand < weights.elite && elitePool.length > 0) {
    chosenPool = elitePool;
  } else if (rand < weights.elite + weights.high && highPool.length > 0) {
    chosenPool = highPool;
  } else if (rand < weights.elite + weights.high + weights.mid && midPool.length > 0) {
    chosenPool = midPool;
  } else if (lowPool.length > 0) {
    chosenPool = lowPool;
  }

  // Fallbacks if selected tier has no candidates in current mode
  if (chosenPool.length === 0) {
    if (elitePool.length > 0) chosenPool = elitePool;
    else if (highPool.length > 0) chosenPool = highPool;
    else if (midPool.length > 0) chosenPool = midPool;
    else chosenPool = pool;
  }

  const selectedIndex = Math.floor(Math.random() * chosenPool.length);
  return chosenPool[selectedIndex];
}
