import {
  Player,
  DynastyState,
  FacilityUpgrades,
  BoardObjective,
  DynastyLegend,
  DynastySeasonHistoryEntry,
  CommercialSponsor,
  LoanedPlayer,
  PreSeasonTour,
  DynastyStaffMember,
} from '../types/football';
import { WONDERKIDS_POOL } from '../data/wonderkids';
import { TRANSFER_MARKET_POOL } from '../data/transferMarket';

export interface SeasonTransitionReport {
  newSeason: number;
  prizeMoneyEarned: number;
  stadiumRevenueEarned: number;
  sponsorRevenueEarned: number;
  staffSalariesPaid: number;
  boardBonusesEarned: number;
  newBudget: number;
  retiredPlayers: Player[];
  progressedPlayers: { player: Player; deltaOvr: number }[];
  completedObjectives: BoardObjective[];
  newLegends: DynastyLegend[];
  returnedFromLoan?: Player[];
  expiringContracts?: Player[];
}

export const FACILITY_UPGRADE_COSTS: Record<number, number> = {
  1: 0,
  2: 25, // $25M
  3: 45, // $45M
  4: 70, // $70M
  5: 100, // $100M
};

export const FACILITY_INFO: Record<keyof FacilityUpgrades, { name: string; icon: string; description: string }> = {
  youthAcademy: {
    name: 'La Masia Youth Academy',
    icon: 'Sparkles',
    description: 'Generates generational wonderkids with higher base OVR and 95+ potential.',
  },
  trainingGround: {
    name: 'State-of-the-Art Training Complex',
    icon: 'TrendingUp',
    description: 'Accelerates player attribute growth per season (+1 to +4 OVR for players under 26).',
  },
  scoutingNetwork: {
    name: 'Global Scouting Network',
    icon: 'Globe',
    description: 'Unlocks exclusive transfer listings and negotiates up to 25% transfer fee discounts.',
  },
  stadium: {
    name: 'Grand Stadium Expansion',
    icon: 'Trophy',
    description: 'Expands capacity, generating up to $50M in seasonal matchday gate receipts.',
  },
  medicalCentre: {
    name: 'High-Performance Medical Lab',
    icon: 'Shield',
    description: 'Combats aging and physical decay, prolonging veteran player careers up to age 38.',
  },
};

export function generateInitialBoardObjectives(season: number): BoardObjective[] {
  return [
    {
      id: `obj-trophy-${season}`,
      title: 'Lift Major Silverware',
      description: 'Win either the League Title or the Champions League trophy.',
      targetCount: 1,
      currentCount: 0,
      rewardBudgetM: 50,
      isCompleted: false,
      type: 'trophy',
    },
    {
      id: `obj-youth-${season}`,
      title: 'Youth Revolution',
      description: 'Sign or develop at least one prodigy with 90+ Potential.',
      targetCount: 1,
      currentCount: 0,
      rewardBudgetM: 25,
      isCompleted: false,
      type: 'youth',
    },
    {
      id: `obj-facility-${season}`,
      title: 'Modernize Club Infrastructure',
      description: 'Upgrade any club facility to Level 2 or higher.',
      targetCount: 1,
      currentCount: 0,
      rewardBudgetM: 30,
      isCompleted: false,
      type: 'facility',
    },
    {
      id: `obj-financial-${season}`,
      title: 'Maintain Fiscal Prudence',
      description: 'Finish the season with at least $40M in the reserve war chest.',
      targetCount: 40,
      currentCount: 0,
      rewardBudgetM: 20,
      isCompleted: false,
      type: 'financial',
    },
  ];
}

export function initializeDynastyState(startingClubName: string = 'Arsenal'): DynastyState {
  return {
    season: 1,
    budgetM: 150, // $150M starting war chest
    clubName: startingClubName,
    trophyCabinet: [],
    retiredPlayers: [],
    wonderkidsDrafted: [],
    facilities: {
      youthAcademy: 1,
      trainingGround: 1,
      scoutingNetwork: 1,
      stadium: 1,
      medicalCentre: 1,
    },
    boardConfidence: 85,
    boardObjectives: generateInitialBoardObjectives(1),
    legends: [],
    history: [],
    staff: {
      assistantManager: {
        id: 'staff-queiroz',
        name: 'Carlos Queiroz',
        role: 'Assistant Manager',
        level: 2,
        salaryM: 4,
        perkDescription: 'Defensive Mastermind: +15% Low-Block and Cautious solidity against elite opposition.',
      },
      chiefScout: {
        id: 'staff-de-visser',
        name: 'Piet de Visser',
        role: 'Chief Scout',
        level: 2,
        salaryM: 3,
        perkDescription: 'Generational Eye: 25% discount on all Youth Academy wonderkid signings.',
      },
      headPhysio: {
        id: 'staff-muller',
        name: 'Dr. Müller-Wohlfahrt',
        role: 'Head Physio',
        level: 2,
        salaryM: 3,
        perkDescription: 'Legend Healer: Extends veteran career longevity, postponing retirement up to age 39.',
      },
    },
    activeSponsor: {
      id: 'sp-emirates',
      name: 'Fly Emirates Global',
      tier: 'Global Tier 1',
      basePayoutM: 38,
      bonusGoal: 'Champions League Silverware',
      bonusPayoutM: 18,
      signed: true,
    },
    loanedPlayers: [],
    preSeasonTourCompleted: false,
    selectedCaptainId: null,
  };
}

export function hireStaffMember(
  currentState: DynastyState,
  newStaff: DynastyStaffMember
): DynastyState {
  const hiringFee = newStaff.salaryM * 2;
  const staffCategory =
    newStaff.role === 'Assistant Manager'
      ? 'assistantManager'
      : newStaff.role === 'Chief Scout'
      ? 'chiefScout'
      : 'headPhysio';

  return {
    ...currentState,
    budgetM: Math.max(0, currentState.budgetM - hiringFee),
    boardConfidence: Math.min(100, currentState.boardConfidence + 4),
    staff: {
      ...currentState.staff,
      [staffCategory]: newStaff,
    },
  };
}

export function signCommercialSponsor(
  currentState: DynastyState,
  sponsor: CommercialSponsor
): DynastyState {
  return {
    ...currentState,
    budgetM: currentState.budgetM + Math.floor(sponsor.basePayoutM / 2),
    boardConfidence: Math.min(100, currentState.boardConfidence + 5),
    activeSponsor: {
      ...sponsor,
      signed: true,
    },
  };
}

export function loanOutPlayer(
  currentState: DynastyState,
  player: Player,
  destinationClub: string
): { updatedState: DynastyState; updatedPlayerId: string } {
  const loanRecord: LoanedPlayer = {
    player: { ...player },
    destinationClub,
    seasonsRemaining: 1,
    projectedGrowth: 4,
  };

  return {
    updatedState: {
      ...currentState,
      budgetM: currentState.budgetM + 6, // $6M loan fee collected
      loanedPlayers: [...(currentState.loanedPlayers || []), loanRecord],
    },
    updatedPlayerId: player.id,
  };
}

export function conductPreSeasonTour(
  currentState: DynastyState,
  tour: PreSeasonTour
): DynastyState {
  return {
    ...currentState,
    budgetM: currentState.budgetM + tour.revenueM,
    boardConfidence: Math.min(100, currentState.boardConfidence + 4),
    preSeasonTourCompleted: true,
  };
}

export function calculatePlayerSaleValue(player: Player): number {
  const age = player.age || 26;
  const ovr = player.overall;

  let base = 25;
  if (ovr >= 90) base = 110;
  else if (ovr >= 87) base = 75;
  else if (ovr >= 84) base = 48;
  else if (ovr >= 80) base = 30;
  else base = 18;

  // Age multiplier
  let ageMult = 1.0;
  if (age <= 21) ageMult = 1.4;
  else if (age <= 24) ageMult = 1.25;
  else if (age <= 28) ageMult = 1.05;
  else if (age <= 31) ageMult = 0.85;
  else if (age <= 33) ageMult = 0.55;
  else ageMult = 0.3;

  return Math.max(8, Math.round(base * ageMult));
}

export function processSeasonAdvance(
  currentSquad: (Player | null)[],
  currentState: DynastyState,
  trophiesWonThisSeason: string[],
  currentBench: (Player | null)[] = []
): {
  updatedSquad: (Player | null)[];
  updatedBench: (Player | null)[];
  updatedState: DynastyState;
  report: SeasonTransitionReport;
} {
  // 1. Prize Money & Matchday Gate Revenue
  let prizeMoney = 35; // Base league participation
  trophiesWonThisSeason.forEach(trophy => {
    if (trophy.includes('Champions')) prizeMoney += 110;
    else if (trophy.includes('League') || trophy.includes('Invincible')) prizeMoney += 75;
    else if (trophy.includes('Cup') || trophy.includes('Derby')) prizeMoney += 35;
  });

  // Stadium gate receipts: Level 1 = $15M, Level 5 = $60M
  const stadiumRev = 15 + (currentState.facilities.stadium - 1) * 12;

  // Commercial Sponsor Payout
  let sponsorRevenue = 0;
  if (currentState.activeSponsor) {
    sponsorRevenue += currentState.activeSponsor.basePayoutM;
    if (trophiesWonThisSeason.length > 0) {
      sponsorRevenue += currentState.activeSponsor.bonusPayoutM;
    } else if (currentState.activeSponsor.penaltyM) {
      sponsorRevenue = Math.max(0, sponsorRevenue - currentState.activeSponsor.penaltyM);
    }
  }

  // Staff Salaries
  const staffSalaries =
    (currentState.staff.assistantManager?.salaryM || 0) +
    (currentState.staff.chiefScout?.salaryM || 0) +
    (currentState.staff.headPhysio?.salaryM || 0);

  // 2. Evaluate Board Objectives
  let boardBonus = 0;
  const updatedObjectives = currentState.boardObjectives.map(obj => {
    let completed = false;
    if (obj.type === 'trophy' && trophiesWonThisSeason.length > 0) completed = true;
    if (obj.type === 'youth' && currentState.wonderkidsDrafted.length > 0) completed = true;
    if (obj.type === 'facility') {
      const anyUpgraded = Object.values(currentState.facilities).some(lvl => lvl > 1);
      if (anyUpgraded) completed = true;
    }
    if (obj.type === 'financial' && currentState.budgetM >= 40) completed = true;

    if (completed && !obj.isCompleted) {
      boardBonus += obj.rewardBudgetM;
      return { ...obj, isCompleted: true, currentCount: obj.targetCount };
    }
    return obj;
  });

  // 3. Squad Aging, Retirement & Progression (Applied to both Starters and Bench)
  const retiredPlayers: Player[] = [];
  const progressedPlayers: { player: Player; deltaOvr: number }[] = [];
  const newLegends: DynastyLegend[] = [];

  const trainingBonus = currentState.facilities.trainingGround; // 1 to 5
  const medicalProtection = currentState.facilities.medicalCentre; // 1 to 5

  const processRosterList = (list: (Player | null)[]) => {
    return list.map(player => {
      if (!player) return null;

      const copy = { ...player };
      copy.age = (copy.age || 26) + 1;

      // Retirement check: delayed by medical lab
      const retirementThreshold = 35 + Math.floor(medicalProtection / 2);
      if (copy.age >= retirementThreshold) {
        const retireChance = (copy.age - (retirementThreshold - 1)) * (0.35 - medicalProtection * 0.04);
        if (Math.random() < Math.max(0.2, retireChance)) {
          retiredPlayers.push(copy);

          // Check if player deserves Hall of Fame / Club Legend status
          if (copy.overall >= 86 || (copy.caps && copy.caps >= 50)) {
            newLegends.push({
              id: `legend-${copy.id}-${currentState.season}`,
              name: copy.name,
              position: copy.specificPosition,
              peakOverall: copy.overall,
              retiredSeason: currentState.season,
              trophiesWon: currentState.trophyCabinet.length + trophiesWonThisSeason.length,
              caps: (copy.caps || 38) + 38,
              legacyStatus: copy.overall >= 89 ? 'Hall of Fame' : 'Club Legend',
            });
          }
          return null; // Slot opens up
        }
      }

      // Progression / Regression
      let delta = 0;
      if (copy.age <= 24 && copy.potential) {
        // Youth development: boosted by training ground
        const growthCap = Math.max(1, copy.potential - copy.overall);
        const baseGain = Math.min(growthCap, Math.floor(1 + Math.random() * 2 + trainingBonus * 0.4));
        delta = baseGain;
        copy.overall += delta;
        copy.pace = Math.min(99, copy.pace + 1);
        copy.shooting = Math.min(99, copy.shooting + delta);
        copy.passing = Math.min(99, copy.passing + delta);
        copy.dribbling = Math.min(99, copy.dribbling + delta);
      } else if (copy.age >= 33) {
        // Age decline: cushioned by medical center
        const rawDecline = Math.floor(1 + Math.random() * 2);
        const softenedDecline = Math.max(1, rawDecline - Math.floor(medicalProtection / 3));
        delta = -softenedDecline;
        copy.overall = Math.max(72, copy.overall + delta);
        copy.pace = Math.max(50, copy.pace - 1);
        copy.physical = Math.max(60, copy.physical - 1);
      }

      if (delta !== 0) {
        progressedPlayers.push({ player: copy, deltaOvr: delta });
      }

      return copy;
    });
  };

  const updatedSquad = processRosterList(currentSquad);
  const updatedBench = processRosterList(currentBench);

  // Contract Decrements & Expiry Warnings
  const expiringContracts: Player[] = [];
  const updatedContracts: Record<string, { yearsLeft: number; morale: 'superb' | 'high' | 'content' | 'disgruntled' }> = {};
  const existingContracts = currentState.playerContracts || {};

  [...updatedSquad, ...updatedBench].forEach(p => {
    if (!p) return;
    const existing = existingContracts[p.id] || { yearsLeft: 3, morale: 'high' };
    const yearsLeft = Math.max(0, existing.yearsLeft - 1);
    const morale =
      yearsLeft === 0
        ? 'disgruntled'
        : yearsLeft === 1
        ? 'content'
        : existing.morale;
    updatedContracts[p.id] = { yearsLeft, morale };
    if (yearsLeft <= 1) {
      expiringContracts.push(p);
    }
  });

  // Loaned players growth & return
  const returnedFromLoan: Player[] = [];
  const remainingLoaned: LoanedPlayer[] = [];

  (currentState.loanedPlayers || []).forEach(loan => {
    const upgradedPlayer = { ...loan.player };
    upgradedPlayer.age = (upgradedPlayer.age || 20) + 1;
    upgradedPlayer.overall = Math.min(
      upgradedPlayer.potential || 92,
      upgradedPlayer.overall + loan.projectedGrowth
    );
    upgradedPlayer.pace = Math.min(99, upgradedPlayer.pace + 2);
    upgradedPlayer.shooting = Math.min(99, upgradedPlayer.shooting + 2);
    upgradedPlayer.passing = Math.min(99, upgradedPlayer.passing + 2);
    upgradedPlayer.dribbling = Math.min(99, upgradedPlayer.dribbling + 2);

    if (loan.seasonsRemaining <= 1) {
      returnedFromLoan.push(upgradedPlayer);
    } else {
      remainingLoaned.push({
        ...loan,
        player: upgradedPlayer,
        seasonsRemaining: loan.seasonsRemaining - 1,
      });
    }
  });

  const totalSeasonIncome = prizeMoney + stadiumRev + sponsorRevenue + boardBonus - staffSalaries;
  const newBudget = Math.max(0, currentState.budgetM + totalSeasonIncome);

  // 4. Update Board Confidence
  let newConfidence = currentState.boardConfidence;
  if (trophiesWonThisSeason.length > 0) newConfidence = Math.min(100, newConfidence + 14);
  else newConfidence = Math.max(40, newConfidence - 8);

  // 5. Create Season History Record
  const activeStar = updatedSquad.find(p => p !== null) || updatedBench.find(p => p !== null) || null;
  const historyEntry: DynastySeasonHistoryEntry = {
    season: currentState.season,
    trophiesWon: trophiesWonThisSeason.length > 0 ? trophiesWonThisSeason : ['Domestic Contenders'],
    finalBudgetM: newBudget,
    squadRating: activeStar ? activeStar.overall : 85,
    topPerformer: activeStar ? `${activeStar.name} (${activeStar.overall} OVR)` : 'Team Effort',
  };

  const nextSeason = currentState.season + 1;
  const updatedState: DynastyState = {
    ...currentState,
    season: nextSeason,
    budgetM: newBudget,
    trophyCabinet: [...currentState.trophyCabinet, ...trophiesWonThisSeason],
    retiredPlayers: [
      ...currentState.retiredPlayers,
      ...retiredPlayers.map(p => `${p.name} (Season ${currentState.season})`),
    ],
    boardConfidence: newConfidence,
    boardObjectives: generateInitialBoardObjectives(nextSeason),
    legends: [...currentState.legends, ...newLegends],
    history: [historyEntry, ...currentState.history],
    loanedPlayers: remainingLoaned,
    preSeasonTourCompleted: false,
    playerContracts: updatedContracts,
  };

  const report: SeasonTransitionReport = {
    newSeason: nextSeason,
    prizeMoneyEarned: prizeMoney,
    stadiumRevenueEarned: stadiumRev,
    sponsorRevenueEarned: sponsorRevenue,
    staffSalariesPaid: staffSalaries,
    boardBonusesEarned: boardBonus,
    newBudget,
    retiredPlayers,
    progressedPlayers,
    completedObjectives: updatedObjectives.filter(o => o.isCompleted),
    newLegends,
    returnedFromLoan,
    expiringContracts,
  };

  return { updatedSquad, updatedBench, updatedState, report };
}
