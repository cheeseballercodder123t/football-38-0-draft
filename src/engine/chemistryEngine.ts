import { Player, Formation, ChemistryLaserLink, PlayerFormArrow } from '../types/football';

export interface PlayerSynergy {
  score: number;
  reasons: string[];
}

export interface TeamChemistryResult {
  totalScore: number;
  percentage: number; // 0 to 100
  tier: 'Low' | 'Medium' | 'High' | 'Maximum';
  passingBonus: number; // e.g. 0.04 = +4%
  defendingBonus: number;
  xgMultiplier: number;
  synergyHighlights: string[];
}

/**
 * Normalizes player name for duplicate checking and matching
 */
export function normalizePlayerName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Checks if a player already exists in the lineup or bench
 */
export function isDuplicatePlayer(candidate: Player, squad: (Player | null)[]): boolean {
  const candidateNorm = normalizePlayerName(candidate.name);
  return squad.some(p => {
    if (!p) return false;
    return normalizePlayerName(p.name) === candidateNorm;
  });
}

/**
 * Extracts starting year integer from season string (e.g. "2003-04" -> 2003)
 */
function parseSeasonYear(yearStr: string): number {
  const parts = yearStr.split('-');
  const y = parseInt(parts[0], 10);
  return isNaN(y) ? 2000 : y;
}

/**
 * Calculates chemistry between two players
 * Checks:
 * 1. Current/overlapping teammates (same club and year)
 * 2. Shared club history before or currently (e.g. played for same club in past/present)
 * 3. Nationality synergy
 * 4. League synergy
 */
export function calculatePairwiseChemistry(p1: Player, p2: Player): PlayerSynergy {
  let score = 0;
  const reasons: string[] = [];

  const sameClub = p1.clubName.toLowerCase() === p2.clubName.toLowerCase() && p1.league !== 'International';
  const y1 = parseSeasonYear(p1.year);
  const y2 = parseSeasonYear(p2.year);

  if (sameClub) {
    if (p1.year === p2.year) {
      // Direct teammates in the exact same season
      score += 16;
      reasons.push(`${p1.clubName} ${p1.year} Teammates (+16)`);
    } else {
      // Both played for the same club
      // One player played before or at the same era (shared club culture)
      const diff = Math.abs(y1 - y2);
      if (diff <= 5) {
        score += 12;
        reasons.push(`${p1.clubName} Era Connection (${p1.year} & ${p2.year}) (+12)`);
      } else {
        score += 8;
        reasons.push(`${p1.clubName} Club Heritage (+8)`);
      }
    }
  }

  // Same Nationality
  if (p1.country.toLowerCase() === p2.country.toLowerCase()) {
    score += 8;
    reasons.push(`${p1.country} Compatriots (+8)`);
  }

  // Same League
  if (p1.league === p2.league && p1.league !== 'International' && !sameClub) {
    score += 4;
    reasons.push(`Shared League (${p1.league}) (+4)`);
  }

  return { score, reasons };
}

/**
 * Returns potential chemistry bonus and reasons if a drafted player is added to current squad
 */
export function getChemistryBonusForDraft(
  candidate: Player,
  currentSquad: (Player | null)[]
): { chemPoints: number; synergies: string[] } {
  let chemPoints = 0;
  const synergies: string[] = [];

  currentSquad.forEach(p => {
    if (!p) return;
    const syn = calculatePairwiseChemistry(candidate, p);
    if (syn.score > 0) {
      chemPoints += syn.score;
      syn.reasons.forEach(r => {
        if (!synergies.includes(`${p.name}: ${r}`)) {
          synergies.push(`${p.name}: ${r}`);
        }
      });
    }
  });

  return { chemPoints, synergies };
}

/**
 * Computes overall team chemistry from starting XI and formation links
 */
export function calculateTeamChemistry(
  startingXI: (Player | null)[],
  formation?: Formation
): TeamChemistryResult {
  const activePlayers = startingXI.filter((p): p is Player => p !== null);
  if (activePlayers.length < 2) {
    return {
      totalScore: 0,
      percentage: 0,
      tier: 'Low',
      passingBonus: 0,
      defendingBonus: 0,
      xgMultiplier: 1.0,
      synergyHighlights: []
    };
  }

  let totalScore = 0;
  const highlights: string[] = [];

  // Pairwise links across all active starters
  for (let i = 0; i < activePlayers.length; i++) {
    for (let j = i + 1; j < activePlayers.length; j++) {
      const p1 = activePlayers[i];
      const p2 = activePlayers[j];
      const syn = calculatePairwiseChemistry(p1, p2);
      if (syn.score > 0) {
        totalScore += syn.score;
        if (syn.score >= 12 && highlights.length < 4) {
          highlights.push(`${p1.name} + ${p2.name}: ${syn.reasons[0]}`);
        }
      }
    }
  }

  // Normalized percentage scale (0 to 100)
  // Max realistic score for 11 players is ~120-160
  const percentage = Math.min(100, Math.round((totalScore / 110) * 100));

  let tier: 'Low' | 'Medium' | 'High' | 'Maximum' = 'Low';
  let passingBonus = 0;
  let defendingBonus = 0;
  let xgMultiplier = 1.0;

  if (percentage >= 85) {
    tier = 'Maximum';
    passingBonus = 0.08;
    defendingBonus = 0.06;
    xgMultiplier = 1.12;
  } else if (percentage >= 65) {
    tier = 'High';
    passingBonus = 0.05;
    defendingBonus = 0.04;
    xgMultiplier = 1.08;
  } else if (percentage >= 40) {
    tier = 'Medium';
    passingBonus = 0.02;
    defendingBonus = 0.02;
    xgMultiplier = 1.04;
  } else {
    tier = 'Low';
    passingBonus = -0.03;
    defendingBonus = -0.02;
    xgMultiplier = 0.96;
  }

  return {
    totalScore,
    percentage,
    tier,
    passingBonus,
    defendingBonus,
    xgMultiplier,
    synergyHighlights: highlights
  };
}

/**
 * Calculates visual laser links between adjacent formation slots on the pitch
 */
export function calculateLaserChemistryLinks(
  formation: Formation,
  startingXI: (Player | null)[]
): ChemistryLaserLink[] {
  const links: ChemistryLaserLink[] = [];
  const slots = formation.slots;

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const s1 = slots[i];
      const s2 = slots[j];

      // Calculate Euclidean distance on pitch grid (0-100)
      const dist = Math.hypot(s1.gridX - s2.gridX, s1.gridY - s2.gridY);
      // Connect adjacent slots (typically within ~36% pitch distance)
      if (dist <= 37) {
        const p1 = startingXI[i];
        const p2 = startingXI[j];

        let tier: 'strong' | 'medium' | 'weak' = 'weak';
        let color = 'rgba(48, 54, 61, 0.4)'; // Dim slate

        if (p1 && p2) {
          const syn = calculatePairwiseChemistry(p1, p2);
          if (syn.score >= 12) {
            tier = 'strong';
            color = '#10b981'; // Emerald laser
          } else if (syn.score >= 4) {
            tier = 'medium';
            color = '#f59e0b'; // Amber laser
          } else {
            color = '#f43f5e'; // Red disconnect
          }
        }

        links.push({
          fromSlotIndex: i,
          toSlotIndex: j,
          x1: s1.gridX,
          y1: 100 - s1.gridY, // SVG coordinate conversion (origin top-left)
          x2: s2.gridX,
          y2: 100 - s2.gridY,
          tier,
          color,
        });
      }
    }
  }

  return links;
}

/**
 * Evaluates individual player matchday form arrow from recent match performance
 */
export function calculatePlayerForm(recentRating?: number): PlayerFormArrow {
  if (recentRating === undefined) return 'neutral';
  if (recentRating >= 7.7) return 'up';
  if (recentRating < 6.4) return 'down';
  return 'neutral';
}
