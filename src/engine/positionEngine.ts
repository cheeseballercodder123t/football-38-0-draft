export type FitTier = 'natural' | 'proficient' | 'adaptable' | 'out_of_position' | 'invalid';

export interface PositionFit {
  penaltyOvr: number; // Overall rating reduction
  statMultiplier: number; // Multiplier applied to core attributes (0.0 - 1.0)
  tier: FitTier;
  label: string;
  shortBadge: string;
  description: string;
}

/**
 * Normalizes a position string (e.g. "CB1" -> "CB", "st2" -> "ST")
 */
export function normalizePosition(pos: string): string {
  if (!pos) return '';
  return pos.toUpperCase().replace(/[0-9]/g, '').trim();
}

/**
 * Helper to check category of position
 */
export function getPositionCategory(pos: string): 'GK' | 'DEF' | 'MID' | 'FWD' {
  const p = normalizePosition(pos);
  if (p === 'GK') return 'GK';
  if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p)) return 'DEF';
  if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(p)) return 'MID';
  return 'FWD'; // ST, CF, LW, RW
}

/**
 * Calculates the positional fit and stat penalty when a player is placed into a specific formation slot.
 *
 * Designed with authentic football logic:
 * - RM <-> RW: Small penalty (-2 OVR), wide attacking wingers sharing flank progression.
 * - LM <-> LW: Small penalty (-2 OVR).
 * - ST <-> CF: Minimal adaptation (-1 OVR).
 * - LB <-> LWB / RB <-> RWB: Minor adaptation (-2 OVR).
 * - Opposite flanks (RW <-> LW, RB <-> LB): Proficient (-3 OVR).
 * - CAM <-> CM / CM <-> CDM: Proficient (-3 OVR).
 * - ST <-> CAM (False 9 / Shadow Striker): Proficient (-3 OVR).
 * - Wingers to ST / CAM: Adaptable (-4 to -5 OVR).
 * - CB to CDM: Proficient (-4 OVR).
 * - Full-backs to CB: Adaptable (-5 to -6 OVR).
 * - Catastrophic mismatches (e.g. ST at CB): Severe penalty (-25+ OVR).
 * - GK <-> Outfield: Strictly INVALID.
 */
export function calculatePositionFit(
  playerPos: string,
  slotPos: string
): PositionFit {
  const p = normalizePosition(playerPos);
  const s = normalizePosition(slotPos);

  // 1. Goalkeeper constraints
  if (p === 'GK' && s === 'GK') {
    return {
      penaltyOvr: 0,
      statMultiplier: 1.0,
      tier: 'natural',
      label: 'Natural Fit',
      shortBadge: 'FIT',
      description: 'Player is in their natural goalkeeper position.',
    };
  }
  if (p === 'GK' || s === 'GK') {
    return {
      penaltyOvr: 99,
      statMultiplier: 0.2,
      tier: 'invalid',
      label: 'Invalid Position',
      shortBadge: 'INVALID',
      description: 'Goalkeepers cannot play outfield, and outfield players cannot play in goal.',
    };
  }

  // 2. Exact Natural Match
  if (p === s) {
    return {
      penaltyOvr: 0,
      statMultiplier: 1.0,
      tier: 'natural',
      label: 'Natural Fit',
      shortBadge: 'FIT',
      description: 'Player is in their natural tactical position at 100% effectiveness.',
    };
  }

  // 3. Strikers & Central Forwards (ST <-> CF)
  if ((p === 'ST' && s === 'CF') || (p === 'CF' && s === 'ST')) {
    return {
      penaltyOvr: 1,
      statMultiplier: 0.98,
      tier: 'natural',
      label: 'Natural Forward (-1 OVR)',
      shortBadge: '-1 OVR',
      description: 'Striker and center-forward roles are functionally interchangeable.',
    };
  }

  // 4. Same-Flank Wingers & Wide Midfielders (RM <-> RW, LM <-> LW)
  if (
    (p === 'RM' && s === 'RW') ||
    (p === 'RW' && s === 'RM') ||
    (p === 'LM' && s === 'LW') ||
    (p === 'LW' && s === 'LM')
  ) {
    return {
      penaltyOvr: 2,
      statMultiplier: 0.97,
      tier: 'proficient',
      label: 'Wide Flank Fit (-2 OVR)',
      shortBadge: '-2 OVR',
      description: 'Shares the same flank and attacking duties with only minor role height adaptation.',
    };
  }

  // 5. Full-Back & Wing-Back Synergy (LB <-> LWB, RB <-> RWB)
  if (
    (p === 'LB' && s === 'LWB') ||
    (p === 'LWB' && s === 'LB') ||
    (p === 'RB' && s === 'RWB') ||
    (p === 'RWB' && s === 'RB')
  ) {
    return {
      penaltyOvr: 2,
      statMultiplier: 0.97,
      tier: 'proficient',
      label: 'Flank Defender Fit (-2 OVR)',
      shortBadge: '-2 OVR',
      description: 'Operates on their natural defensive flank with adjusted pitch depth.',
    };
  }

  // 6. Inverted / Opposite Flank Symmetry (RW <-> LW, RM <-> LM, RB <-> LB, RWB <-> LWB)
  if (
    (p === 'RW' && s === 'LW') ||
    (p === 'LW' && s === 'RW') ||
    (p === 'RM' && s === 'LM') ||
    (p === 'LM' && s === 'RM') ||
    (p === 'RB' && s === 'LB') ||
    (p === 'LB' && s === 'RB') ||
    (p === 'RWB' && s === 'LWB') ||
    (p === 'LWB' && s === 'RWB')
  ) {
    return {
      penaltyOvr: 3,
      statMultiplier: 0.95,
      tier: 'proficient',
      label: 'Inverted Flank (-3 OVR)',
      shortBadge: '-3 OVR',
      description: 'Proficient inverted wing play; cuts inside onto preferred foot.',
    };
  }

  // 7. Cross-Flank Wing to Wide Mid (e.g. RW at LM, LW at RM)
  if (
    (p === 'RW' && s === 'LM') ||
    (p === 'LW' && s === 'RM') ||
    (p === 'RM' && s === 'LW') ||
    (p === 'LM' && s === 'RW')
  ) {
    return {
      penaltyOvr: 4,
      statMultiplier: 0.94,
      tier: 'proficient',
      label: 'Opposite Wing Mid (-4 OVR)',
      shortBadge: '-4 OVR',
      description: 'Inverted wide midfield play with increased positional tracking.',
    };
  }

  // 8. Central Midfield Spine (CAM <-> CM, CM <-> CDM)
  if (
    (p === 'CAM' && s === 'CM') ||
    (p === 'CM' && s === 'CAM') ||
    (p === 'CM' && s === 'CDM') ||
    (p === 'CDM' && s === 'CM')
  ) {
    return {
      penaltyOvr: 3,
      statMultiplier: 0.95,
      tier: 'proficient',
      label: 'Central Midfield Fit (-3 OVR)',
      shortBadge: '-3 OVR',
      description: 'Natural central midfield understanding across box-to-box and pivot zones.',
    };
  }

  // 9. Attacking Midfielder / Shadow Striker / False 9 (CAM <-> ST/CF)
  if (
    (p === 'CAM' && (s === 'ST' || s === 'CF')) ||
    ((p === 'ST' || p === 'CF') && s === 'CAM')
  ) {
    return {
      penaltyOvr: 3,
      statMultiplier: 0.95,
      tier: 'proficient',
      label: 'False 9 / Shadow Striker (-3 OVR)',
      shortBadge: '-3 OVR',
      description: 'Comfortable operating between the lines and dropping deep to link play.',
    };
  }

  // 10. Wingers to Central Striker (RW/LW <-> ST/CF)
  if (
    ((p === 'RW' || p === 'LW') && (s === 'ST' || s === 'CF')) ||
    ((p === 'ST' || p === 'CF') && (s === 'RW' || s === 'LW'))
  ) {
    return {
      penaltyOvr: 4,
      statMultiplier: 0.94,
      tier: 'proficient',
      label: 'Wide Forward / Inside Cut (-4 OVR)',
      shortBadge: '-4 OVR',
      description: 'Mobile forward adapting between central finishing and wide channel runs.',
    };
  }

  // 11. Attacking Midfield to Wing (CAM <-> RW/LW)
  if (
    (p === 'CAM' && (s === 'RW' || s === 'LW')) ||
    ((p === 'RW' || p === 'LW') && s === 'CAM')
  ) {
    return {
      penaltyOvr: 4,
      statMultiplier: 0.94,
      tier: 'proficient',
      label: 'Wide Playmaker (-4 OVR)',
      shortBadge: '-4 OVR',
      description: 'Creative playmaker operating from wide half-spaces.',
    };
  }

  // 12. Center Back to Defensive Midfield Anchor (CB <-> CDM)
  if (
    (p === 'CB' && s === 'CDM') ||
    (p === 'CDM' && s === 'CB')
  ) {
    return {
      penaltyOvr: 4,
      statMultiplier: 0.94,
      tier: 'proficient',
      label: 'Defensive Anchor / Stopper (-4 OVR)',
      shortBadge: '-4 OVR',
      description: 'Combative defensive skill set translates smoothly between central defense and pivot.',
    };
  }

  // 13. Full-Backs to Center Back (LB/RB <-> CB)
  if (
    ((p === 'LB' || p === 'RB') && s === 'CB') ||
    (p === 'CB' && (s === 'LB' || s === 'RB'))
  ) {
    return {
      penaltyOvr: 5,
      statMultiplier: 0.92,
      tier: 'adaptable',
      label: 'Defensive Line Cover (-5 OVR)',
      shortBadge: '-5 OVR',
      description: 'Reliable defensive fundamentals with tactical adjustments in aerial and wide marking.',
    };
  }

  // 14. Full-Backs / Wing-Backs to Wide Midfield (LB/LWB <-> LM, RB/RWB <-> RM)
  if (
    ((p === 'LB' || p === 'LWB') && s === 'LM') ||
    (p === 'LM' && (s === 'LB' || s === 'LWB')) ||
    ((p === 'RB' || p === 'RWB') && s === 'RM') ||
    (p === 'RM' && (s === 'RB' || s === 'RWB'))
  ) {
    return {
      penaltyOvr: 4,
      statMultiplier: 0.94,
      tier: 'proficient',
      label: 'Flank Wing-Progression (-4 OVR)',
      shortBadge: '-4 OVR',
      description: 'High work-rate wide play covering flank progression and tracking.',
    };
  }

  // 15. Central Midfield to Wide Midfield (CM/CAM <-> LM/RM)
  if (
    ((p === 'CM' || p === 'CAM') && (s === 'LM' || s === 'RM')) ||
    ((p === 'LM' || p === 'RM') && (s === 'CM' || s === 'CAM'))
  ) {
    return {
      penaltyOvr: 5,
      statMultiplier: 0.92,
      tier: 'adaptable',
      label: 'Central to Wide Mid (-5 OVR)',
      shortBadge: '-5 OVR',
      description: 'Creative midfielder tucked inside from wide positions.',
    };
  }

  // 16. Full-Backs to Inverted Midfield Anchor (LB/RB/LWB/RWB <-> CDM/CM)
  if (
    (['LB', 'RB', 'LWB', 'RWB'].includes(p) && (s === 'CDM' || s === 'CM')) ||
    (['CDM', 'CM'].includes(p) && ['LB', 'RB', 'LWB', 'RWB'].includes(s))
  ) {
    return {
      penaltyOvr: 7,
      statMultiplier: 0.88,
      tier: 'adaptable',
      label: 'Inverted Midfield Role (-7 OVR)',
      shortBadge: '-7 OVR',
      description: 'Modern inverted full-back stepping into central midfield channels.',
    };
  }

  // 17. Deep Midfield to Attacking Midfield Extremes (CDM <-> CAM)
  if (
    (p === 'CDM' && s === 'CAM') ||
    (p === 'CAM' && s === 'CDM')
  ) {
    return {
      penaltyOvr: 7,
      statMultiplier: 0.88,
      tier: 'adaptable',
      label: 'Midfield Extremes (-7 OVR)',
      shortBadge: '-7 OVR',
      description: 'Significant gap in creative vs ball-winning duties.',
    };
  }

  // 18. Wide Midfielders to Striker (RM/LM <-> ST/CF)
  if (
    (['RM', 'LM'].includes(p) && (s === 'ST' || s === 'CF')) ||
    ((p === 'ST' || p === 'CF') && ['RM', 'LM'].includes(s))
  ) {
    return {
      penaltyOvr: 7,
      statMultiplier: 0.88,
      tier: 'adaptable',
      label: 'Wide Mid to Striker (-7 OVR)',
      shortBadge: '-7 OVR',
      description: 'Wide runner pushed into central forward responsibilities.',
    };
  }

  // 19. Full-Backs to True Wingers (LB/RB/LWB/RWB <-> LW/RW)
  if (
    (['LB', 'RB', 'LWB', 'RWB'].includes(p) && (s === 'LW' || s === 'RW')) ||
    (['LW', 'RW'].includes(p) && ['LB', 'RB', 'LWB', 'RWB'].includes(s))
  ) {
    return {
      penaltyOvr: 8,
      statMultiplier: 0.86,
      tier: 'adaptable',
      label: 'Advanced Winger Stretch (-8 OVR)',
      shortBadge: '-8 OVR',
      description: 'Extreme attacking responsibility for a natural defender.',
    };
  }

  // 20. Central Defender to Midfield Controller (CB <-> CM)
  if (
    (p === 'CB' && s === 'CM') ||
    (p === 'CM' && s === 'CB')
  ) {
    return {
      penaltyOvr: 12,
      statMultiplier: 0.80,
      tier: 'out_of_position',
      label: 'Out of Position (-12 OVR)',
      shortBadge: '-12 OVR',
      description: 'Lack of central mobility and possession composure under press.',
    };
  }

  // 21. Attackers to Deep Defensive Pivot (ST/CF/RW/LW <-> CDM)
  if (
    (['ST', 'CF', 'RW', 'LW'].includes(p) && s === 'CDM') ||
    (p === 'CDM' && ['ST', 'CF', 'RW', 'LW'].includes(s))
  ) {
    return {
      penaltyOvr: 16,
      statMultiplier: 0.74,
      tier: 'out_of_position',
      label: 'Defensive Anchor Mismatch (-16 OVR)',
      shortBadge: '-16 OVR',
      description: 'Attacker lacks defensive tackling instincts and positional discipline.',
    };
  }

  // 22. Full-Backs to Striker (LB/RB/LWB/RWB <-> ST/CF)
  if (
    (['LB', 'RB', 'LWB', 'RWB'].includes(p) && (s === 'ST' || s === 'CF')) ||
    ((p === 'ST' || p === 'CF') && ['LB', 'RB', 'LWB', 'RWB'].includes(s))
  ) {
    return {
      penaltyOvr: 20,
      statMultiplier: 0.68,
      tier: 'out_of_position',
      label: 'Severe Forward Mismatch (-20 OVR)',
      shortBadge: '-20 OVR',
      description: 'Defender lacks clinical box movement and finishing composure.',
    };
  }

  // 23. Severe Positional Mismatch: Striker or Winger at Center Back
  if (
    (['ST', 'CF', 'RW', 'LW', 'RM', 'LM', 'CAM'].includes(p) && s === 'CB') ||
    (p === 'CB' && ['ST', 'CF', 'RW', 'LW', 'RM', 'LM', 'CAM'].includes(s))
  ) {
    return {
      penaltyOvr: 26,
      statMultiplier: 0.58,
      tier: 'out_of_position',
      label: 'Severe Positional Mismatch (-26 OVR)',
      shortBadge: '-26 OVR',
      description: 'Catastrophic mismatch; player cannot properly read opposing runs or maintain the defensive line.',
    };
  }

  // 24. General Category Proximity Fallback
  const pCat = getPositionCategory(p);
  const sCat = getPositionCategory(s);

  if (pCat === sCat) {
    return {
      penaltyOvr: 4,
      statMultiplier: 0.94,
      tier: 'proficient',
      label: 'Same Sector Adaptation (-4 OVR)',
      shortBadge: '-4 OVR',
      description: 'Player plays in their general sector with slight role adjustments.',
    };
  }

  const isAdjacent =
    (pCat === 'DEF' && sCat === 'MID') ||
    (pCat === 'MID' && sCat === 'DEF') ||
    (pCat === 'MID' && sCat === 'FWD') ||
    (pCat === 'FWD' && sCat === 'MID');

  if (isAdjacent) {
    return {
      penaltyOvr: 9,
      statMultiplier: 0.85,
      tier: 'adaptable',
      label: 'Sector Stretch (-9 OVR)',
      shortBadge: '-9 OVR',
      description: 'Player is pushed one line forward or backward from their natural sector.',
    };
  }

  // 2 sectors away (DEF <-> FWD)
  return {
    penaltyOvr: 22,
    statMultiplier: 0.65,
    tier: 'out_of_position',
    label: 'Major Out of Position (-22 OVR)',
    shortBadge: '-22 OVR',
    description: 'Extreme mismatch between defensive and attacking responsibilities.',
  };
}

/**
 * Returns a clone of the player with stats scaled down if they are playing out of position.
 */
export function applyPositionFitToPlayer<T extends {
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  composure: number;
  specificPosition: string;
}>(player: T, slotPos: string): T & { fit: PositionFit; effectiveOverall: number } {
  const fit = calculatePositionFit(player.specificPosition, slotPos);
  const effectiveOverall = Math.max(40, player.overall - fit.penaltyOvr);

  if (fit.penaltyOvr === 0) {
    return {
      ...player,
      fit,
      effectiveOverall: player.overall,
    };
  }

  const mult = fit.statMultiplier;

  return {
    ...player,
    overall: effectiveOverall,
    effectiveOverall,
    pace: Math.max(30, Math.round(player.pace * mult)),
    shooting: Math.max(30, Math.round(player.shooting * mult)),
    passing: Math.max(30, Math.round(player.passing * mult)),
    dribbling: Math.max(30, Math.round(player.dribbling * mult)),
    defending: Math.max(30, Math.round(player.defending * mult)),
    physical: Math.max(30, Math.round(player.physical * mult)),
    composure: Math.max(30, Math.round(player.composure * mult)),
    fit,
  };
}
