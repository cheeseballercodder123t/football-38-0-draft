import {
  Player,
  MatchResult,
  HexagonSkills,
  TacticalPartnershipReport,
  AftergameReport,
} from '../types/football';

/**
 * Calculates 6-axis Hexagon Skill ratings for an individual player (0-99 scale)
 */
export function calculatePlayerHexagonSkills(player: Player): HexagonSkills {
  const isFwd = player.position === 'FWD';
  const isMid = player.position === 'MID';
  const isDef = player.position === 'DEF';
  const isGk = player.position === 'GK';

  // 1. Finishing: Goal lethality, composure, conversion in the box
  let finishing = Math.round(
    player.shooting * (isFwd ? 1.05 : isMid ? 0.95 : isDef ? 0.8 : 0.4) +
      (player.composure ? player.composure * 0.08 : 6)
  );

  // 2. Creation: Vision, key passes, assist danger, cross precision
  let creation = Math.round(
    player.passing * 0.65 + player.dribbling * 0.25 + (isMid ? 8 : isFwd ? 5 : 0)
  );

  // 3. Build-Up: Passing security, tempo control, circulation under pressure
  let buildUp = Math.round(
    player.passing * 0.55 + player.overall * 0.35 + (player.composure ? player.composure * 0.1 : 6)
  );

  // 4. Defense: Pressing tackle success, clearances, positioning
  let defense = isGk
    ? Math.round(player.overall * 0.88 + player.defending * 0.15)
    : Math.round(player.defending * 0.75 + player.physical * 0.25);

  // 5. Physicality: Aerial duels, stamina endurance, duels won
  let physicality = Math.round(player.physical * 0.65 + player.pace * 0.35);

  // 6. Carrying: Progressive carries, 1v1 take-ons, press evasion
  let carrying = Math.round(
    player.dribbling * 0.6 + player.pace * 0.35 + (player.composure ? player.composure * 0.05 : 3)
  );

  const clamp = (val: number) => Math.max(35, Math.min(99, Math.round(val)));
  finishing = clamp(finishing);
  creation = clamp(creation);
  buildUp = clamp(buildUp);
  defense = clamp(defense);
  physicality = clamp(physicality);
  carrying = clamp(carrying);

  const overallIndex = Math.round(
    (finishing + creation + buildUp + defense + physicality + carrying) / 6
  );

  return {
    finishing,
    creation,
    buildUp,
    defense,
    physicality,
    carrying,
    overallIndex,
  };
}

/**
 * Calculates composite 6-axis Hexagon Skill ratings for a Starting XI squad
 */
export function calculateSquadHexagonSkills(squad: (Player | null)[]): HexagonSkills {
  const active = squad.filter((p): p is Player => p !== null);
  if (active.length === 0) {
    return {
      finishing: 70,
      creation: 70,
      buildUp: 70,
      defense: 70,
      physicality: 70,
      carrying: 70,
      overallIndex: 70,
    };
  }

  const fwds = active.filter(p => p.position === 'FWD');
  const mids = active.filter(p => p.position === 'MID');
  const defs = active.filter(p => p.position === 'DEF');
  const gk = active.find(p => p.position === 'GK') || active[0];

  // Finishing: Heavily weighted by forwards & attacking mids
  const fwdFinish = fwds.length > 0 ? fwds.reduce((acc, p) => acc + p.shooting, 0) / fwds.length : 75;
  const midFinish = mids.length > 0 ? mids.reduce((acc, p) => acc + p.shooting, 0) / mids.length : 70;
  const finishing = Math.round(fwdFinish * 0.7 + midFinish * 0.3);

  // Creation: Midfield vision + winger flair
  const midPassing = mids.length > 0 ? mids.reduce((acc, p) => acc + p.passing, 0) / mids.length : 75;
  const squadDribble = active.reduce((acc, p) => acc + p.dribbling, 0) / active.length;
  const creation = Math.round(midPassing * 0.65 + squadDribble * 0.35);

  // Build-Up: Overall squad passing fluidity and composure
  const squadPassing = active.reduce((acc, p) => acc + p.passing, 0) / active.length;
  const squadOvr = active.reduce((acc, p) => acc + p.overall, 0) / active.length;
  const buildUp = Math.round(squadPassing * 0.6 + squadOvr * 0.4);

  // Defense: Defenders + GK + DMs
  const defDef = defs.length > 0 ? defs.reduce((acc, p) => acc + p.defending, 0) / defs.length : 75;
  const gkDef = gk.overall;
  const defense = Math.round(defDef * 0.7 + gkDef * 0.3);

  // Physicality: Whole squad physical battle capacity
  const squadPhys = active.reduce((acc, p) => acc + p.physical, 0) / active.length;
  const squadPace = active.reduce((acc, p) => acc + p.pace, 0) / active.length;
  const physicality = Math.round(squadPhys * 0.65 + squadPace * 0.35);

  // Carrying: Forwards & Midfielders line-breaking dribbling
  const frontPack = [...fwds, ...mids];
  const frontDribble = frontPack.length > 0 ? frontPack.reduce((acc, p) => acc + p.dribbling, 0) / frontPack.length : 75;
  const frontPace = frontPack.length > 0 ? frontPack.reduce((acc, p) => acc + p.pace, 0) / frontPack.length : 75;
  const carrying = Math.round(frontDribble * 0.6 + frontPace * 0.4);

  const clamp = (val: number) => Math.max(40, Math.min(99, Math.round(val)));
  const f = clamp(finishing);
  const c = clamp(creation);
  const b = clamp(buildUp);
  const d = clamp(defense);
  const p = clamp(physicality);
  const car = clamp(carrying);

  const overallIndex = Math.round((f + c + b + d + p + car) / 6);

  return {
    finishing: f,
    creation: c,
    buildUp: b,
    defense: d,
    physicality: p,
    carrying: car,
    overallIndex,
  };
}

/**
 * Generates an in-depth Aftergame Tactical Summary & Team Report inspired by One Two & 38-0
 */
export function generateAftergameReport(
  match: MatchResult,
  userSquad: (Player | null)[],
  managerName = 'Alex Ferguson'
): AftergameReport {
  const isHome = match.homeTeam === 'Your Starting XI';
  const userStats = isHome ? match.homeStats : match.awayStats;
  const oppStats = isHome ? match.awayStats : match.homeStats;
  const opponentName = isHome ? match.awayTeam : match.homeTeam;

  const userScore = userStats.score;
  const oppScore = oppStats.score;
  const resultOutcome: 'win' | 'draw' | 'loss' =
    userScore > oppScore ? 'win' : userScore === oppScore ? 'draw' : 'loss';

  // Dominance Index (0-100%): weighted by possession, shots on target share, and xG share
  const totalXg = Math.max(0.01, userStats.xG + oppStats.xG);
  const xgShare = (userStats.xG / totalXg) * 100;
  const totalSot = Math.max(1, userStats.shotsOnTarget + oppStats.shotsOnTarget);
  const sotShare = (userStats.shotsOnTarget / totalSot) * 100;
  const dominanceIndex = Math.round(userStats.possession * 0.4 + xgShare * 0.4 + sotShare * 0.2);

  const xgDelta = +(userStats.xG - oppStats.xG).toFixed(2);
  const conversionRate = userStats.shotsOnTarget > 0
    ? Math.round((userStats.score / userStats.shotsOnTarget) * 100)
    : 0;

  // Compute Squad Hexagon Skills
  const squadSkills = calculateSquadHexagonSkills(userSquad);

  // Compute Opponent Skills based on their stats
  const oppSkills: HexagonSkills = {
    finishing: Math.min(96, Math.max(50, Math.round(oppStats.score * 12 + 62))),
    creation: Math.min(95, Math.max(50, Math.round(oppStats.shotsOnTarget * 6 + 60))),
    buildUp: Math.min(95, Math.max(48, Math.round(oppStats.passAccuracy * 0.95))),
    defense: Math.min(95, Math.max(50, Math.round(90 - userStats.xG * 10))),
    physicality: Math.min(94, Math.max(55, Math.round(oppStats.tacklesWon * 3 + 60))),
    carrying: Math.min(93, Math.max(50, Math.round(oppStats.possession * 0.8 + 30))),
    overallIndex: 78,
  };
  oppSkills.overallIndex = Math.round(
    (oppSkills.finishing + oppSkills.creation + oppSkills.buildUp + oppSkills.defense + oppSkills.physicality + oppSkills.carrying) / 6
  );

  // Tactical Archetype derivation
  let tacticalArchetype = 'Balanced Total Football';
  if (userStats.possession >= 58 && squadSkills.buildUp >= 82) {
    tacticalArchetype = '🪄 Juego de Posición Dominance';
  } else if (userStats.possession <= 46 && userStats.score >= 2) {
    tacticalArchetype = '⚡ Lethal Transition Blitz';
  } else if (oppStats.score === 0 && squadSkills.defense >= 84) {
    tacticalArchetype = '🛡️ Iron Curtain High-Press';
  } else if (userStats.xG >= 2.4 || userStats.score >= 3) {
    tacticalArchetype = '🎯 Clinical Heavy-Metal Onslaught';
  } else if (dominanceIndex >= 65) {
    tacticalArchetype = '👑 Masterclass Pitch Control';
  }

  // Manager Rating (1.0 to 10.0 scale)
  let managerRating = 6.5;
  if (resultOutcome === 'win') {
    managerRating = +(7.5 + (userScore - oppScore) * 0.5 + (xgDelta > 1 ? 0.6 : 0)).toFixed(1);
    if (oppScore === 0) managerRating += 0.4;
  } else if (resultOutcome === 'draw') {
    managerRating = +(6.2 + (xgDelta > 0 ? 0.4 : -0.3)).toFixed(1);
  } else {
    managerRating = +(5.0 - (oppScore - userScore) * 0.4).toFixed(1);
  }
  managerRating = Math.max(3.5, Math.min(9.9, +managerRating.toFixed(1)));

  // Identify Key Partnerships
  const activeStarters = userSquad.filter((p): p is Player => p !== null);
  const cbs = activeStarters.filter(p => p.position === 'DEF').slice(0, 2);
  const midAxis = activeStarters.filter(p => p.position === 'MID').slice(0, 2);
  const attackLine = activeStarters.filter(p => p.position === 'FWD').slice(0, 2);

  const partnerships: TacticalPartnershipReport[] = [];

  if (cbs.length >= 2) {
    const cbRating = Math.round((cbs[0].defending + cbs[1].defending) / 2);
    partnerships.push({
      name: 'Central Defensive Pairing',
      rating: cbRating,
      verdict: oppScore === 0
        ? 'Impenetrable partnership! Maintained flawless spatial distance and extinguished central counter-attacks.'
        : 'Solid aerial cover, though occasional gaps appeared between defensive lines on wide overloads.',
      players: [cbs[0].name, cbs[1].name],
    });
  }

  if (midAxis.length >= 2) {
    const midRating = Math.round((midAxis[0].passing + midAxis[1].passing) / 2);
    partnerships.push({
      name: 'Engine Room Double Pivot',
      rating: midRating,
      verdict: userStats.possession >= 52
        ? 'Commanded the tempo flawlessly! Dictated transition flow and provided press resistance under duress.'
        : 'High-workrate battle against opponent pressure. Anchored second-ball recoveries effectively.',
      players: [midAxis[0].name, midAxis[1].name],
    });
  }

  if (attackLine.length >= 2) {
    const atkRating = Math.round((attackLine[0].shooting + attackLine[1].shooting) / 2);
    partnerships.push({
      name: 'Offensive Spearhead Tandem',
      rating: atkRating,
      verdict: userScore >= 2
        ? 'Devastating interplay! Sharp diagonal decoy runs disoriented the backline and carved open shooting corridors.'
        : 'Dangerous movement in the half-spaces, applying constant threat to the opponent center-halves.',
      players: [attackLine[0].name, attackLine[1].name],
    });
  }

  // Tactical Scout Debrief
  const strengths: string[] = [];
  const vulnerabilities: string[] = [];

  if (userStats.score >= 2) {
    strengths.push(`Clinical execution in the final third yielding ${userStats.score} goals from ${userStats.xG.toFixed(2)} xG.`);
  }
  if (userStats.possession >= 54) {
    strengths.push(`Total midfield stranglehold with ${userStats.possession}% possession and ${userStats.passAccuracy}% passing accuracy.`);
  }
  if (oppScore === 0) {
    strengths.push('Clean sheet achieved through disciplined compact shape and zero high-danger cutbacks conceded.');
  }
  if (strengths.length === 0) {
    strengths.push('Resilient tactical discipline under physical opposition press.');
  }

  if (oppStats.xG >= 1.4) {
    vulnerabilities.push(`Opponent managed ${oppStats.xG.toFixed(2)} xG: need quicker defensive transition tracking.`);
  }
  if (userStats.yellowCards >= 2) {
    vulnerabilities.push(`${userStats.yellowCards} yellow cards conceded: risk of disciplinary fouls on late challenges.`);
  }
  if (conversionRate < 35 && userStats.shots >= 7) {
    vulnerabilities.push('Chance conversion was sub-optimal; shots from low-probability angles could be recycled.');
  }
  if (vulnerabilities.length === 0) {
    vulnerabilities.push('Minor vulnerability to wide diagonal set-pieces if defensive line drops too deep.');
  }

  // Identify MVP
  let mvpPlayer = userStats.playerStats && userStats.playerStats.length > 0
    ? [...userStats.playerStats].sort((a, b) => b.matchRating - a.matchRating || b.goals - a.goals || b.assists - a.assists)[0]
    : null;

  const mvpPlayerId = mvpPlayer?.playerId || (activeStarters[0]?.id ?? 'mvp-1');
  const mvpName = mvpPlayer?.playerName || (activeStarters[0]?.name ?? 'Star Performer');
  const mvpRating = mvpPlayer ? +mvpPlayer.matchRating.toFixed(1) : 8.4;
  const mvpStats = mvpPlayer
    ? `${mvpPlayer.goals} Goals · ${mvpPlayer.assists} Assists · ${mvpPlayer.shots} Shots · ${mvpPlayer.keyPasses} Key Passes`
    : 'Influential 90-minute display dominating the pitch';

  return {
    matchId: match.id,
    matchday: match.matchday,
    opponentName,
    scoreline: `${userScore} - ${oppScore}`,
    resultOutcome,
    tacticalArchetype,
    managerRating,
    dominanceIndex,
    xgDelta,
    conversionRate,
    squadSkills,
    opponentSkills: oppSkills,
    partnerships,
    scoutDebrief: {
      strengths,
      vulnerabilities,
    },
    mvpPlayerId,
    mvpName,
    mvpRating,
    mvpStats,
  };
}
