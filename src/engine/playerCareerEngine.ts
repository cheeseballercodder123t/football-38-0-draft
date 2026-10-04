import {
  PlayerAttributeKey,
  CareerClub,
  CareerPosition,
  CareerArchetype,
  CareerMatchMoment,
  CareerSeasonRecord,
  PlayerCareerState,
  BuiltPlayerResult,
} from '../types/football';

export interface PlayStyleDefinition {
  id: string;
  name: string;
  category: 'Shooting' | 'Passing' | 'Defending' | 'Physical' | 'Mental';
  icon: string;
  description: string;
  costXP: number;
}

export const PLAYSTYLE_CATALOG: PlayStyleDefinition[] = [
  {
    id: 'finesse_shot',
    name: 'Finesse Shot+',
    category: 'Shooting',
    icon: 'Target',
    description: 'Curled shots gain +15% accuracy and extreme dip into the top corners.',
    costXP: 250,
  },
  {
    id: 'trivela',
    name: 'Trivela Master',
    category: 'Shooting',
    icon: 'Sparkles',
    description: 'Effortless outside-of-the-boot screamers from outside the 18-yard box.',
    costXP: 280,
  },
  {
    id: 'ice_in_veins',
    name: 'Ice In The Veins',
    category: 'Mental',
    icon: 'Flame',
    description: '+25% success rate in 85th+ minute stoppage time clutch moments.',
    costXP: 300,
  },
  {
    id: 'incisive_pass',
    name: 'Incisive Vision+',
    category: 'Passing',
    icon: 'Eye',
    description: 'Through balls unlock 2x more assist opportunities through tight backlines.',
    costXP: 240,
  },
  {
    id: 'relentless_motor',
    name: 'Relentless Engine',
    category: 'Physical',
    icon: 'Zap',
    description: 'Stamina remains at 95%+ throughout extra time and heavy fixture congestion.',
    costXP: 260,
  },
  {
    id: 'acrobatic_finisher',
    name: 'Acrobatic Poacher',
    category: 'Shooting',
    icon: 'Trophy',
    description: 'Enables scissor kicks, diving headers, and acrobatic goal mouth scrambles.',
    costXP: 270,
  },
  {
    id: 'intercept_plus',
    name: 'Intercept+ Titan',
    category: 'Defending',
    icon: 'Shield',
    description: 'Snuffs out opposition counter-attacks and triggers instant breakout passes.',
    costXP: 250,
  },
  {
    id: 'speed_dribbler',
    name: 'Rapid Turbo+',
    category: 'Physical',
    icon: 'FastForward',
    description: 'Explosive acceleration burst when knocking the ball past the last defender.',
    costXP: 260,
  },
];

export const CAREER_NATIONALITIES = [
  { code: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', region: 'Europe' },
  { code: 'FRA', name: 'France', flag: '🇫🇷', region: 'Europe' },
  { code: 'BRA', name: 'Brazil', flag: '🇧🇷', region: 'South America' },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', region: 'South America' },
  { code: 'ESP', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
  { code: 'GER', name: 'Germany', flag: '🇩🇪', region: 'Europe' },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', region: 'Europe' },
  { code: 'NED', name: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'ITA', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
  { code: 'NOR', name: 'Norway', flag: '🇳🇴', region: 'Europe' },
  { code: 'BEL', name: 'Belgium', flag: '🇧🇪', region: 'Europe' },
  { code: 'CRO', name: 'Croatia', flag: '🇭🇷', region: 'Europe' },
  { code: 'URU', name: 'Uruguay', flag: '🇺🇾', region: 'South America' },
  { code: 'COL', name: 'Colombia', flag: '🇨🇴', region: 'South America' },
  { code: 'NGA', name: 'Nigeria', flag: '🇳🇬', region: 'Africa' },
  { code: 'SEN', name: 'Senegal', flag: '🇸🇳', region: 'Africa' },
  { code: 'MAR', name: 'Morocco', flag: '🇲🇦', region: 'Africa' },
  { code: 'JPN', name: 'Japan', flag: '🇯🇵', region: 'Asia' },
  { code: 'KOR', name: 'South Korea', flag: '🇰🇷', region: 'Asia' },
  { code: 'USA', name: 'United States', flag: '🇺🇸', region: 'North America' },
  { code: 'MEX', name: 'Mexico', flag: '🇲🇽', region: 'North America' },
];

export const CAREER_CLUBS_POOL: CareerClub[] = [
  // England
  { name: 'Man City', league: 'EPL', strength: 89, badgeColor: '#6CABDD', reputation: 95 },
  { name: 'Arsenal', league: 'EPL', strength: 87, badgeColor: '#EF0107', reputation: 91 },
  { name: 'Liverpool', league: 'EPL', strength: 87, badgeColor: '#C8102E', reputation: 92 },
  { name: 'Chelsea', league: 'EPL', strength: 83, badgeColor: '#034694', reputation: 86 },
  { name: 'Man United', league: 'EPL', strength: 83, badgeColor: '#DA291C', reputation: 88 },
  { name: 'Tottenham', league: 'EPL', strength: 82, badgeColor: '#132257', reputation: 83 },
  { name: 'Newcastle', league: 'EPL', strength: 82, badgeColor: '#241F20', reputation: 82 },
  { name: 'Aston Villa', league: 'EPL', strength: 81, badgeColor: '#670E36', reputation: 80 },
  { name: 'Brighton', league: 'EPL', strength: 78, badgeColor: '#0057B8', reputation: 77 },
  { name: 'West Ham', league: 'EPL', strength: 77, badgeColor: '#7A263A', reputation: 76 },
  { name: 'Crystal Palace', league: 'EPL', strength: 76, badgeColor: '#1B458F', reputation: 74 },
  { name: 'Everton', league: 'EPL', strength: 75, badgeColor: '#003399', reputation: 75 },
  { name: 'Brentford', league: 'EPL', strength: 74, badgeColor: '#E30613', reputation: 72 },
  { name: 'Bournemouth', league: 'EPL', strength: 74, badgeColor: '#DA291C', reputation: 71 },
  // Spain
  { name: 'Real Madrid', league: 'La Liga', strength: 90, badgeColor: '#FEBE10', reputation: 98 },
  { name: 'Barcelona', league: 'La Liga', strength: 88, badgeColor: '#004D98', reputation: 96 },
  { name: 'Atlético Madrid', league: 'La Liga', strength: 85, badgeColor: '#CB3524', reputation: 87 },
  { name: 'Athletic Bilbao', league: 'La Liga', strength: 81, badgeColor: '#EE2524', reputation: 80 },
  { name: 'Real Sociedad', league: 'La Liga', strength: 80, badgeColor: '#0067B1', reputation: 79 },
  { name: 'Real Betis', league: 'La Liga', strength: 79, badgeColor: '#0BB364', reputation: 78 },
  { name: 'Villarreal', league: 'La Liga', strength: 79, badgeColor: '#FFE600', reputation: 78 },
  { name: 'Sevilla', league: 'La Liga', strength: 77, badgeColor: '#D4001F', reputation: 81 },
  { name: 'Valencia', league: 'La Liga', strength: 76, badgeColor: '#FF6600', reputation: 79 },
  // Italy
  { name: 'Inter Milan', league: 'Serie A', strength: 88, badgeColor: '#010E80', reputation: 91 },
  { name: 'Juventus', league: 'Serie A', strength: 85, badgeColor: '#000000', reputation: 90 },
  { name: 'AC Milan', league: 'Serie A', strength: 84, badgeColor: '#FB090B', reputation: 89 },
  { name: 'Napoli', league: 'Serie A', strength: 84, badgeColor: '#12A0D7', reputation: 85 },
  { name: 'Atalanta', league: 'Serie A', strength: 83, badgeColor: '#1E71B8', reputation: 82 },
  { name: 'Roma', league: 'Serie A', strength: 81, badgeColor: '#8E1F2F', reputation: 83 },
  { name: 'Lazio', league: 'Serie A', strength: 80, badgeColor: '#87D8F7', reputation: 81 },
  { name: 'Fiorentina', league: 'Serie A', strength: 78, badgeColor: '#4F2365', reputation: 77 },
  // Germany
  { name: 'Bayern Munich', league: 'Bundesliga', strength: 88, badgeColor: '#DC052D', reputation: 94 },
  { name: 'Bayer Leverkusen', league: 'Bundesliga', strength: 85, badgeColor: '#E32221', reputation: 87 },
  { name: 'Borussia Dortmund', league: 'Bundesliga', strength: 83, badgeColor: '#FDE100', reputation: 88 },
  { name: 'RB Leipzig', league: 'Bundesliga', strength: 82, badgeColor: '#DD0741', reputation: 81 },
  { name: 'Eintracht Frankfurt', league: 'Bundesliga', strength: 79, badgeColor: '#E1000F', reputation: 78 },
  // France
  { name: 'Paris SG', league: 'Ligue 1', strength: 87, badgeColor: '#004170', reputation: 92 },
  { name: 'Monaco', league: 'Ligue 1', strength: 82, badgeColor: '#E20613', reputation: 81 },
  { name: 'Marseille', league: 'Ligue 1', strength: 80, badgeColor: '#2FAEE0', reputation: 82 },
  { name: 'Lille', league: 'Ligue 1', strength: 79, badgeColor: '#E01E2B', reputation: 78 },
];

export const POSITION_WEIGHTS: Record<CareerPosition, Record<PlayerAttributeKey, number>> = {
  ST: { SHO: 3.2, PAC: 2.2, SKL: 1.8, CTL: 1.8, WF: 1.5, IQ: 1.4, HEA: 1.2, PHY: 1.1, STA: 0.9, PAS: 0.8, DEF: 0.2 },
  LW: { PAC: 3.0, SKL: 2.4, CTL: 2.2, SHO: 2.0, PAS: 1.6, WF: 1.4, IQ: 1.3, STA: 1.0, PHY: 0.8, HEA: 0.5, DEF: 0.3 },
  RW: { PAC: 3.0, SKL: 2.4, CTL: 2.2, SHO: 2.0, PAS: 1.6, WF: 1.4, IQ: 1.3, STA: 1.0, PHY: 0.8, HEA: 0.5, DEF: 0.3 },
  CAM: { PAS: 2.8, IQ: 2.6, CTL: 2.5, SHO: 2.0, SKL: 1.8, WF: 1.4, PAC: 1.3, STA: 1.2, PHY: 0.9, HEA: 0.6, DEF: 0.4 },
  CM: { PAS: 2.6, IQ: 2.5, CTL: 2.2, STA: 2.0, DEF: 1.4, PHY: 1.3, SHO: 1.2, SKL: 1.2, PAC: 1.1, WF: 1.0, HEA: 0.8 },
  CDM: { DEF: 2.8, PHY: 2.4, IQ: 2.2, PAS: 2.0, STA: 2.0, HEA: 1.4, CTL: 1.3, PAC: 1.1, SHO: 0.6, SKL: 0.6, WF: 0.6 },
  CB: { DEF: 4.0, PHY: 3.0, HEA: 2.5, IQ: 2.0, STA: 1.4, PAC: 1.4, CTL: 0.7, PAS: 0.6, WF: 0.3, SHO: 0.2, SKL: 0.2 },
  LB: { PAC: 2.6, DEF: 2.4, STA: 2.2, PHY: 1.8, PAS: 1.6, CTL: 1.4, IQ: 1.3, HEA: 0.8, SKL: 0.7, WF: 0.6, SHO: 0.4 },
  RB: { PAC: 2.6, DEF: 2.4, STA: 2.2, PHY: 1.8, PAS: 1.6, CTL: 1.4, IQ: 1.3, HEA: 0.8, SKL: 0.7, WF: 0.6, SHO: 0.4 },
  GK: { DEF: 4.5, IQ: 3.0, PHY: 2.5, HEA: 1.8, CTL: 1.2, STA: 1.0, PAS: 1.0, PAC: 0.8, WF: 0.4, SHO: 0.2, SKL: 0.2 },
};

export function calculateCareerOVR(
  attrs: Record<PlayerAttributeKey, number>,
  pos: CareerPosition
): number {
  const weights = POSITION_WEIGHTS[pos] || POSITION_WEIGHTS.ST;
  let sum = 0;
  let tot = 0;
  for (const k of Object.keys(weights) as PlayerAttributeKey[]) {
    const w = weights[k] || 1;
    sum += (attrs[k] || 60) * w;
    tot += w;
  }
  return Math.round(sum / tot);
}

export function createInitialPlayerCareer(
  playerName: string,
  nationality: string,
  position: CareerPosition,
  archetype: CareerArchetype,
  importedAttrs?: Record<PlayerAttributeKey, number>
): PlayerCareerState {
  const baseAttrs: Record<PlayerAttributeKey, number> = importedAttrs
    ? { ...importedAttrs }
    : generateStartingAttributes(position, archetype);

  const initialOvr = calculateCareerOVR(baseAttrs, position);

  // Start at a promising bottom-half or mid-table club
  const eligibleStartingClubs = CAREER_CLUBS_POOL.filter(c => c.strength <= 78);
  const startingClub =
    eligibleStartingClubs[Math.floor(Math.random() * eligibleStartingClubs.length)] ||
    CAREER_CLUBS_POOL[CAREER_CLUBS_POOL.length - 1];

  const weeklyWageK = Math.round(15 + (initialOvr - 68) * 3);
  const marketValueM = Math.round(5 + (initialOvr - 68) * 2.5);

  return {
    playerName: playerName.trim() || 'Alex Mercer',
    nationality: nationality || 'England',
    position,
    archetype,
    age: 17,
    seasonNumber: 1,
    overall: initialOvr,
    attributes: baseAttrs,
    currentClub: startingClub,
    contractYearsLeft: 3,
    weeklyWageK: Math.max(8, weeklyWageK),
    marketValueM: Math.max(3, marketValueM),
    trainingXP: 100,
    skillPoints: 3,
    unlockedPlayStyles: [getDefaultPlayStyleForArchetype(archetype)],
    currentMatchday: 0,
    totalSeasonMatches: 38,
    seasonApps: 0,
    seasonGoals: 0,
    seasonAssists: 0,
    seasonCleanSheets: 0,
    seasonMatchRatings: [],
    careerGoals: 0,
    careerAssists: 0,
    careerApps: 0,
    careerCleanSheets: 0,
    careerHistory: [],
    trophies: {
      leagueTitles: 0,
      domesticCups: 0,
      championsLeagues: 0,
      worldCups: 0,
      continentalCups: 0,
      ballonDors: 0,
      goldenBoots: 0,
    },
    nationalCaps: 0,
    nationalGoals: 0,
    internationalTournamentYear: false,
    isRetired: false,
    activeMoment: null,
    matchLog: [
      `✍️ Signed breakthrough 3-year professional contract at ${startingClub.name} (${startingClub.league})!`,
    ],
  };
}

function getDefaultPlayStyleForArchetype(archetype: CareerArchetype): string {
  switch (archetype) {
    case 'Poacher': return 'finesse_shot';
    case 'Playmaker': return 'incisive_pass';
    case 'Speedster': return 'speed_dribbler';
    case 'BoxToBox': return 'relentless_motor';
    case 'Anchor': return 'intercept_plus';
    case 'SweeperKeeper': return 'ice_in_veins';
  }
}

function generateStartingAttributes(
  position: CareerPosition,
  archetype: CareerArchetype
): Record<PlayerAttributeKey, number> {
  const attrs: Record<PlayerAttributeKey, number> = {
    HEA: 60,
    IQ: 65,
    SHO: 62,
    PAS: 64,
    WF: 60,
    SKL: 64,
    PHY: 65,
    DEF: 55,
    PAC: 72,
    CTL: 68,
    STA: 70,
  };

  // Adjust by Position
  if (['ST', 'LW', 'RW'].includes(position)) {
    attrs.SHO += 10;
    attrs.PAC += 8;
    attrs.SKL += 6;
    attrs.DEF -= 15;
  } else if (['CAM', 'CM'].includes(position)) {
    attrs.PAS += 10;
    attrs.CTL += 8;
    attrs.IQ += 8;
    attrs.SHO += 4;
  } else if (['CDM', 'CB', 'LB', 'RB'].includes(position)) {
    attrs.DEF += 18;
    attrs.PHY += 12;
    attrs.HEA += 10;
    attrs.SHO -= 16;
  } else if (position === 'GK') {
    attrs.DEF += 22;
    attrs.PHY += 8;
    attrs.SHO = 40;
    attrs.SKL = 45;
  }

  // Adjust by Archetype
  if (archetype === 'Poacher') {
    attrs.SHO += 6;
    attrs.HEA += 5;
  } else if (archetype === 'Playmaker') {
    attrs.PAS += 6;
    attrs.IQ += 5;
  } else if (archetype === 'Speedster') {
    attrs.PAC += 8;
    attrs.SKL += 4;
  } else if (archetype === 'BoxToBox') {
    attrs.STA += 8;
    attrs.PHY += 5;
  } else if (archetype === 'Anchor') {
    attrs.DEF += 6;
    attrs.PHY += 6;
  }

  // Clamp within 45 to 84 for wonderkid starting baseline
  for (const k of Object.keys(attrs) as PlayerAttributeKey[]) {
    attrs[k] = Math.max(45, Math.min(84, Math.round(attrs[k] + (Math.random() * 6 - 3))));
  }

  return attrs;
}

export function simulateCareerMatchday(state: PlayerCareerState): {
  updatedState: PlayerCareerState;
  logSummary: string;
  triggeredMoment: CareerMatchMoment | null;
} {
  const matchday = state.currentMatchday + 1;
  const club = state.currentClub;

  // Pick random opponent from league
  const leagueOpponents = CAREER_CLUBS_POOL.filter(c => c.league === club.league && c.name !== club.name);
  const opp = leagueOpponents[Math.floor(Math.random() * leagueOpponents.length)] || {
    name: 'Opponent FC',
    strength: 78,
  };

  // Club match calculation
  const strengthDiff = club.strength - opp.strength;
  const playerBonus = (state.overall - 75) * 0.15;
  const winProb = 0.40 + strengthDiff * 0.02 + playerBonus * 0.02;

  let clubGoals = 0;
  let oppGoals = 0;
  const roll = Math.random();

  if (roll < winProb) {
    clubGoals = 1 + Math.floor(Math.random() * 3);
    oppGoals = Math.floor(Math.random() * Math.min(2, clubGoals));
  } else if (roll < winProb + 0.30) {
    clubGoals = Math.floor(Math.random() * 3);
    oppGoals = clubGoals;
  } else {
    oppGoals = 1 + Math.floor(Math.random() * 3);
    clubGoals = Math.floor(Math.random() * oppGoals);
  }

  // Individual player contribution
  const isAttacker = ['ST', 'LW', 'RW', 'CAM'].includes(state.position);
  const isMid = ['CM', 'CDM'].includes(state.position);
  const isDef = ['CB', 'LB', 'RB', 'GK'].includes(state.position);

  let playerGoals = 0;
  let playerAssists = 0;
  let playerCleanSheet = 0;

  if (clubGoals > 0) {
    if (isAttacker) {
      if (Math.random() < 0.38 + (state.attributes.SHO - 70) * 0.015) {
        playerGoals = 1;
        if (clubGoals >= 2 && Math.random() < 0.22) playerGoals = 2;
        if (clubGoals >= 3 && Math.random() < 0.06) playerGoals = 3;
      }
      if (Math.random() < 0.25 + (state.attributes.PAS - 70) * 0.01) {
        playerAssists = 1;
      }
    } else if (isMid) {
      if (Math.random() < 0.18 + (state.attributes.SHO - 70) * 0.01) playerGoals = 1;
      if (Math.random() < 0.32 + (state.attributes.PAS - 70) * 0.015) playerAssists = 1;
    } else {
      if (Math.random() < 0.06 + (state.attributes.HEA - 70) * 0.005) playerGoals = 1;
      if (Math.random() < 0.08) playerAssists = 1;
    }
  }

  if (isDef && oppGoals === 0) {
    playerCleanSheet = 1;
  }

  // Compute Match Rating
  let baseRating = 6.2 + (state.overall - 70) * 0.04;
  baseRating += playerGoals * 1.3;
  baseRating += playerAssists * 0.8;
  baseRating += playerCleanSheet * 0.7;
  if (clubGoals > oppGoals) baseRating += 0.4;
  if (clubGoals < oppGoals) baseRating -= 0.3;
  const matchRating = Math.max(5.5, Math.min(10.0, Math.round((baseRating + (Math.random() * 0.8 - 0.4)) * 10) / 10));

  const earnedXP = Math.round(matchRating * 16 + (playerGoals * 25) + (playerAssists * 15));

  // Determine if a clutch moment triggers
  let triggeredMoment: CareerMatchMoment | null = null;
  const isHighStakes = opp.strength >= 84 || matchday % 8 === 0;
  if (Math.random() < (isHighStakes ? 0.45 : 0.25)) {
    triggeredMoment = generateClutchMoment(state, opp.name, clubGoals, oppGoals);
  }

  const resultTag = clubGoals > oppGoals ? 'WIN' : clubGoals === oppGoals ? 'DRAW' : 'LOSS';
  const statsTag = [
    playerGoals > 0 ? `${playerGoals}G` : '',
    playerAssists > 0 ? `${playerAssists}A` : '',
    playerCleanSheet > 0 ? 'CS' : '',
  ].filter(Boolean).join(', ');

  const logEntry = `MD${matchday}: ${club.name} ${clubGoals}-${oppGoals} ${opp.name} (${resultTag}) · Rating: ${matchRating.toFixed(1)}${statsTag ? ` [${statsTag}]` : ''}`;

  const updatedState: PlayerCareerState = {
    ...state,
    currentMatchday: matchday,
    seasonApps: state.seasonApps + 1,
    seasonGoals: state.seasonGoals + playerGoals,
    seasonAssists: state.seasonAssists + playerAssists,
    seasonCleanSheets: state.seasonCleanSheets + playerCleanSheet,
    seasonMatchRatings: [...state.seasonMatchRatings, matchRating],
    careerGoals: state.careerGoals + playerGoals,
    careerAssists: state.careerAssists + playerAssists,
    careerApps: state.careerApps + 1,
    careerCleanSheets: state.careerCleanSheets + playerCleanSheet,
    trainingXP: state.trainingXP + earnedXP,
    activeMoment: triggeredMoment,
    matchLog: [logEntry, ...state.matchLog.slice(0, 30)],
  };

  return {
    updatedState,
    logSummary: logEntry,
    triggeredMoment,
  };
}

function generateClutchMoment(
  state: PlayerCareerState,
  oppName: string,
  clubGoals: number,
  oppGoals: number
): CareerMatchMoment {
  const minute = 80 + Math.floor(Math.random() * 11);
  const isAttacking = ['ST', 'LW', 'RW', 'CAM', 'CM'].includes(state.position);

  if (isAttacking) {
    return {
      id: `moment-${Date.now()}`,
      minute,
      matchContext: `${minute}' vs ${oppName} (${clubGoals}-${oppGoals})`,
      situation: `You break into the penalty box with seconds on the clock! The goalkeeper rushes off their line while two defenders slide in.`,
      options: [
        {
          label: 'Curl Finesse Far Corner',
          actionDesc: 'Bend a guided curling strike around the outstretched gloves',
          requiredAttr: 'SHO',
          difficultyVal: 72,
          reward: { goals: 1, assists: 0, ratingDelta: 0.8 },
        },
        {
          label: 'Deft Dribble & Chip',
          actionDesc: 'Scoop an audacious dink over the sliding keeper',
          requiredAttr: 'SKL',
          difficultyVal: 74,
          reward: { goals: 1, assists: 0, ratingDelta: 1.0 },
        },
        {
          label: 'Square Pass to Unmarked Teammate',
          actionDesc: 'Slot a selfless pass across the 6-yard box for an open tap-in',
          requiredAttr: 'PAS',
          difficultyVal: 68,
          reward: { goals: 0, assists: 1, ratingDelta: 0.6 },
        },
      ],
    };
  } else {
    return {
      id: `moment-${Date.now()}`,
      minute,
      matchContext: `${minute}' vs ${oppName} (${clubGoals}-${oppGoals})`,
      situation: `Opposition striker bursts clear on a dangerous counter-attack heading 1-on-1 towards goal!`,
      options: [
        {
          label: 'Last-Ditch Sliding Tackle',
          actionDesc: 'Hook the ball cleanly away with perfect timing',
          requiredAttr: 'DEF',
          difficultyVal: 72,
          reward: { goals: 0, assists: 0, ratingDelta: 0.9 },
        },
        {
          label: 'Body Check & Shield Out of Play',
          actionDesc: 'Use your frame to muscle the attacker off the ball',
          requiredAttr: 'PHY',
          difficultyVal: 70,
          reward: { goals: 0, assists: 0, ratingDelta: 0.7 },
        },
        {
          label: 'Interception & Quick Launch',
          actionDesc: 'Read the passing lane and spark an instant counter-attack',
          requiredAttr: 'IQ',
          difficultyVal: 73,
          reward: { goals: 0, assists: 1, ratingDelta: 1.0 },
        },
      ],
    };
  }
}

export function resolveClutchMoment(
  state: PlayerCareerState,
  optionIndex: number
): {
  success: boolean;
  storyResult: string;
  updatedState: PlayerCareerState;
} {
  if (!state.activeMoment) {
    return { success: false, storyResult: 'No active moment found.', updatedState: state };
  }

  const option = state.activeMoment.options[optionIndex];
  if (!option) {
    return { success: false, storyResult: 'Invalid option selected.', updatedState: state };
  }

  const playerStat = state.attributes[option.requiredAttr] || 65;
  const hasClutchPerk = state.unlockedPlayStyles.includes('ice_in_veins');
  const perkBonus = hasClutchPerk ? 6 : 0;
  const roll = Math.random() * 20;
  const totalScore = playerStat * 0.8 + roll + perkBonus;

  const success = totalScore >= option.difficultyVal;

  let storyResult = '';
  let updatedState = { ...state };

  if (success) {
    storyResult = `🔥 GOAL / CLUTCH MOMENT CONVERTED! (${option.label}) - ${option.actionDesc}! You set the stadium erupting in celebration!`;
    updatedState = {
      ...updatedState,
      careerGoals: updatedState.careerGoals + option.reward.goals,
      seasonGoals: updatedState.seasonGoals + option.reward.goals,
      careerAssists: updatedState.careerAssists + option.reward.assists,
      seasonAssists: updatedState.seasonAssists + option.reward.assists,
      trainingXP: updatedState.trainingXP + 150,
      matchLog: [
        `⭐ [MOMENT SUCCESS] ${option.label} in ${state.activeMoment.minute}'! +150 XP`,
        ...updatedState.matchLog,
      ],
    };
  } else {
    storyResult = `❌ AGONIZING NEAR MISS! Opposition reacted swiftly to shut down the play. The crowd gasps as the ball misses by inches!`;
    updatedState = {
      ...updatedState,
      trainingXP: updatedState.trainingXP + 35,
      matchLog: [
        `⚠️ [MOMENT MISSED] ${option.label} in ${state.activeMoment.minute}' - Shut down by opposition`,
        ...updatedState.matchLog,
      ],
    };
  }

  updatedState.activeMoment = null;
  return { success, storyResult, updatedState };
}

export function advanceCareerSeason(state: PlayerCareerState): {
  updatedState: PlayerCareerState;
  seasonSummary: CareerSeasonRecord;
  wonBallonDor: boolean;
  wonGoldenBoot: boolean;
  transferOffers: CareerClub[];
} {
  const avgRating =
    state.seasonMatchRatings.length > 0
      ? state.seasonMatchRatings.reduce((a, b) => a + b, 0) / state.seasonMatchRatings.length
      : 7.2;

  // Determine League Finish
  const clubPower = state.currentClub.strength + (state.overall - 75) * 0.25;
  let leagueFinish = 1;
  if (clubPower > 86) leagueFinish = Math.random() < 0.65 ? 1 : 2;
  else if (clubPower > 82) leagueFinish = 2 + Math.floor(Math.random() * 4);
  else if (clubPower > 78) leagueFinish = 5 + Math.floor(Math.random() * 6);
  else leagueFinish = 9 + Math.floor(Math.random() * 8);

  const trophiesWon: string[] = [];
  let wonLeague = false;
  let wonUCL = false;
  let wonCup = false;

  if (leagueFinish === 1) {
    trophiesWon.push(`${state.currentClub.league} Champions`);
    wonLeague = true;
  }
  if (Math.random() < (clubPower > 83 ? 0.35 : 0.15)) {
    trophiesWon.push('Domestic Cup Winners');
    wonCup = true;
  }
  if (clubPower >= 85 && Math.random() < 0.28) {
    trophiesWon.push('UEFA Champions League');
    wonUCL = true;
  }

  // International tournament every 4 years
  const isTourneyYear = state.seasonNumber % 4 === 0;
  let wonWorldCup = false;
  let wonContinental = false;
  let tournamentCaps = 0;
  let tournamentGoals = 0;

  if (isTourneyYear && state.overall >= 78) {
    tournamentCaps = 5 + Math.floor(Math.random() * 3);
    tournamentGoals = Math.floor(Math.random() * 5);
    if (Math.random() < 0.25) {
      trophiesWon.push('FIFA World Cup Champions');
      wonWorldCup = true;
    }
  }

  // Personal Awards
  const isTopScorer = state.seasonGoals >= 22;
  const wonGoldenBoot = isTopScorer;
  if (wonGoldenBoot) trophiesWon.push('European Golden Boot');

  // Ballon d'Or calculation
  const ballonDorPoints =
    state.seasonGoals * 1.5 +
    state.seasonAssists * 1.2 +
    (wonLeague ? 25 : 0) +
    (wonUCL ? 40 : 0) +
    (wonWorldCup ? 50 : 0) +
    (avgRating - 7.0) * 20;

  const wonBallonDor = ballonDorPoints >= 70;
  if (wonBallonDor) trophiesWon.push("Ballon d'Or Award Winner");

  const seasonRecord: CareerSeasonRecord = {
    seasonYear: 2024 + state.seasonNumber,
    age: state.age,
    clubName: state.currentClub.name,
    league: state.currentClub.league,
    leagueFinish,
    apps: state.seasonApps,
    goals: state.seasonGoals,
    assists: state.seasonAssists,
    cleanSheets: state.seasonCleanSheets,
    avgRating: Math.round(avgRating * 10) / 10,
    trophies: trophiesWon,
    awards: [wonBallonDor ? "Ballon d'Or" : '', wonGoldenBoot ? 'Golden Boot' : ''].filter(Boolean),
  };

  // Progression & Age decay
  const newAge = state.age + 1;
  const updatedAttrs = { ...state.attributes };

  if (newAge <= 27) {
    // Prime growth
    const growthKeys: PlayerAttributeKey[] = ['SHO', 'PAS', 'IQ', 'CTL', 'PAC', 'STA'];
    growthKeys.forEach(k => {
      updatedAttrs[k] = Math.min(99, updatedAttrs[k] + 1 + Math.floor(Math.random() * 2));
    });
  } else if (newAge >= 33) {
    // Veteran decay
    updatedAttrs.PAC = Math.max(50, updatedAttrs.PAC - 2);
    updatedAttrs.STA = Math.max(50, updatedAttrs.STA - 2);
    updatedAttrs.IQ = Math.min(99, updatedAttrs.IQ + 1); // Football IQ stays high
  }

  const newOverall = calculateCareerOVR(updatedAttrs, state.position);

  // Generate Transfer Offers
  const transferOffers = CAREER_CLUBS_POOL.filter(
    c => c.name !== state.currentClub.name && c.strength <= newOverall + 6 && c.strength >= newOverall - 4
  ).slice(0, 3);

  // Value update
  const newMarketValue = Math.round(
    Math.max(5, (newOverall - 65) * 4.5 + (newAge <= 26 ? 30 : newAge >= 33 ? -20 : 10))
  );

  const updatedState: PlayerCareerState = {
    ...state,
    age: newAge,
    seasonNumber: state.seasonNumber + 1,
    overall: newOverall,
    attributes: updatedAttrs,
    contractYearsLeft: Math.max(1, state.contractYearsLeft - 1),
    marketValueM: newMarketValue,
    currentMatchday: 0,
    seasonApps: 0,
    seasonGoals: 0,
    seasonAssists: 0,
    seasonCleanSheets: 0,
    seasonMatchRatings: [],
    skillPoints: state.skillPoints + (wonBallonDor ? 4 : 2),
    careerHistory: [...state.careerHistory, seasonRecord],
    nationalCaps: state.nationalCaps + tournamentCaps,
    nationalGoals: state.nationalGoals + tournamentGoals,
    trophies: {
      leagueTitles: state.trophies.leagueTitles + (wonLeague ? 1 : 0),
      domesticCups: state.trophies.domesticCups + (wonCup ? 1 : 0),
      championsLeagues: state.trophies.championsLeagues + (wonUCL ? 1 : 0),
      worldCups: state.trophies.worldCups + (wonWorldCup ? 1 : 0),
      continentalCups: state.trophies.continentalCups + (wonContinental ? 1 : 0),
      ballonDors: state.trophies.ballonDors + (wonBallonDor ? 1 : 0),
      goldenBoots: state.trophies.goldenBoots + (wonGoldenBoot ? 1 : 0),
    },
    isRetired: newAge >= 38 || state.seasonNumber >= 20,
    activeMoment: null,
    matchLog: [
      `🏁 Season ${state.seasonNumber} Complete! Rated ${avgRating.toFixed(1)} with ${trophiesWon.length} trophies lifted.`,
      ...state.matchLog,
    ],
  };

  return {
    updatedState,
    seasonSummary: seasonRecord,
    wonBallonDor,
    wonGoldenBoot,
    transferOffers,
  };
}

export function calculateGOATScore(state: PlayerCareerState): {
  goatScore: number;
  rankTitle: string;
  comparisonTable: { name: string; score: number; trophies: string; era: string }[];
} {
  const t = state.trophies;
  const score = Math.round(
    t.ballonDors * 25 +
    t.worldCups * 35 +
    t.championsLeagues * 20 +
    t.leagueTitles * 10 +
    t.domesticCups * 5 +
    state.careerGoals * 0.15 +
    state.careerAssists * 0.1 +
    state.careerApps * 0.05
  );

  let rankTitle = 'Aspiring Prospect';
  if (score >= 480) rankTitle = 'The Undisputed GOAT';
  else if (score >= 380) rankTitle = 'Pantheon of Legends';
  else if (score >= 280) rankTitle = 'All-Time Icon';
  else if (score >= 180) rankTitle = 'Continental Superstar';
  else if (score >= 90) rankTitle = 'Club Legend';

  const comparisonTable = [
    { name: 'Lionel Messi', score: 510, trophies: '8 Ballon d\'Or, 1 World Cup, 4 UCL', era: 'Modern Era' },
    { name: 'Cristiano Ronaldo', score: 460, trophies: '5 Ballon d\'Or, 5 UCL, 1 Euro', era: 'Modern Era' },
    { name: 'Pelé', score: 420, trophies: '3 World Cups, 1,000+ Goals', era: 'Classic Era' },
    { name: 'Diego Maradona', score: 370, trophies: '1 World Cup, Eternal Icon', era: '80s-90s Era' },
    { name: 'Zinedine Zidane', score: 320, trophies: '1 Ballon d\'Or, 1 World Cup, 1 UCL', era: 'Galáctico Era' },
  ];

  return { goatScore: score, rankTitle, comparisonTable };
}
