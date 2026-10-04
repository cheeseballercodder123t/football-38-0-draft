export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export type TacticalStyle = 'Gegenpress' | 'Tiki-Taka' | 'Low-Block Counter' | 'Direct Vertical';

export type FormationName = '4-3-3' | '4-2-3-1' | '3-5-2' | '4-4-2' | '5-3-2';

export interface FormationSlot {
  id: string;
  label: string;
  category: PlayerPosition;
  gridX: number; // 0 to 100
  gridY: number; // 0 to 100
}

export interface Formation {
  name: FormationName;
  slots: FormationSlot[];
  tacticalSynergy: TacticalStyle;
  description: string;
}

export interface AuraTrait {
  id: string;
  name: string;
  description: string;
  shortDesc: string;
  rarity: 'Legendary' | 'Epic' | 'Rare';
}

export interface Player {
  id: string;
  name: string;
  clubYear: string;
  clubName: string;
  year: string;
  country: string;
  league: 'La Liga' | 'Premier League' | 'Serie A' | 'Bundesliga' | 'International' | 'Other';
  position: PlayerPosition;
  specificPosition: string;
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  composure: number;
  auraTrait?: AuraTrait;
  // Dynasty attributes
  age?: number;
  potential?: number;
  valueM?: number;
  wageM?: number;
  caps?: number;
}

export interface SquadData {
  id: string;
  clubName: string;
  year: string;
  fullName: string;
  type: 'club' | 'country';
  league: 'La Liga' | 'Premier League' | 'Serie A' | 'Bundesliga' | 'International' | 'Other';
  countryCode: string;
  badgeColor: string;
  accentColor: string;
  primaryTactic: TacticalStyle;
  tier?: 'elite' | 'high' | 'mid' | 'low';
  players: Player[];
}

export interface Manager {
  id: string;
  name: string;
  nationality: string;
  preferredFormation: FormationName;
  tacticalStyle: TacticalStyle;
  perkName: string;
  perkDescription: string;
  clubAssociation?: string;
}

export interface MatchPlayerStats {
  playerId: string;
  playerName: string;
  position: PlayerPosition;
  minutes: number;
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  xG: number;
  xA: number;
  keyPasses: number;
  tacklesWon: number;
  saves: number;
  cleanSheet: boolean;
  yellowCard: boolean;
  redCard: boolean;
  matchRating: number;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'shot' | 'save' | 'yellow_card' | 'red_card' | 'aura_trigger' | 'penalty_shootout';
  team: 'home' | 'away';
  scorerId?: string;
  scorerName?: string;
  assistId?: string;
  assistName?: string;
  xG?: number;
  description: string;
  isFergieTime?: boolean;
  shotX?: number; // 0 to 100 on attacking pitch width (50 = center)
  shotY?: number; // 0 to 100 on attacking pitch depth (0 = goal line, 100 = midfield edge)
  shotOutcome?: 'goal' | 'saved' | 'missed' | 'blocked' | 'woodwork';
}

export interface TeamMatchStats {
  teamName: string;
  score: number;
  xG: number;
  shots: number;
  shotsOnTarget: number;
  possession: number;
  passesCompleted: number;
  passAccuracy: number;
  tacklesWon: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  ppda: number;
  playerStats: MatchPlayerStats[];
}

export interface MatchResult {
  id: string;
  matchday: number;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  isTwoLegged?: boolean;
  leg?: 1 | 2;
  firstLegResult?: { homeScore: number; awayScore: number };
  aggregateScore?: { homeTeamTotal: number; awayTeamTotal: number };
  extraTime?: boolean;
  penalties?: { home: number; away: number };
  homeStats: TeamMatchStats;
  awayStats: TeamMatchStats;
  events: MatchEvent[];
  winner: 'home' | 'away' | 'draw';
  managerDecisions?: ManagerDecisionEvent[];
}

export interface OpponentTeam {
  name: string;
  rating: number;
  attackRating: number;
  midfieldRating: number;
  defenseRating: number;
  gkRating: number;
  tactic: TacticalStyle;
  managerName?: string;
}

export interface SeasonTableEntry {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface SeasonAwards {
  goldenBoot: { player: string; team: string; goals: number };
  playmakerAward: { player: string; team: string; assists: number };
  goldenGlove: { player: string; team: string; cleanSheets: number };
  ballonDor: { player: string; team: string; rating: number; goals: number; assists: number };
  tots: {
    gk: string;
    defenders: string[];
    midfielders: string[];
    forwards: string[];
  };
}

export type GameDifficulty = 'classic' | 'expert' | 'super_expert';

export type GameMode =
  | 'invincible'
  | 'premier_league'
  | 'la_liga'
  | 'serie_a'
  | 'bundesliga'
  | 'champions_league'
  | 'world_cup'
  | 'dynasty'
  | 'rivalry_derby'
  | 'salary_cap'
  | 'draft_roguelike'
  | 'on_the_money'
  | 'build_a_player'
  | 'last_one_standing'
  | 'teammate_chain'
  | 'player_career';

export interface OnTheMoneyState {
  targetPoints: number;
  isTargetSpun: boolean;
  projectedPoints: number;
  pointsDelta: number;
}

export type TacticalChipType = 'triple_captain' | 'bench_boost' | 'free_hit' | 'wildcard';

export interface TacticalChipsState {
  tripleCaptainUsed: boolean;
  benchBoostUsed: boolean;
  freeHitUsed: boolean;
  wildcardUsed: boolean;
  activeChipForNextMatch: TacticalChipType | null;
}

export interface MysteryPlayerClue {
  name: string;
  club: string;
  league: string;
  nation: string;
  nationFlag: string;
  position: PlayerPosition;
  overall: number;
  age: number;
}

export interface MysteryGuessResult {
  guessedName: string;
  nationMatch: 'exact' | 'same_region' | 'wrong';
  nationText: string;
  leagueMatch: 'exact' | 'wrong';
  leagueText: string;
  clubMatch: 'exact' | 'wrong';
  clubText: string;
  posMatch: 'exact' | 'close' | 'wrong';
  posText: string;
  ovrMatch: 'exact' | 'higher' | 'lower';
  ovrText: number;
  ageMatch: 'exact' | 'higher' | 'lower';
  ageText: number;
}

export interface ManagerDNAProfile {
  managerName: string;
  tacticalPhilosophy: 'Heavy-Metal Press' | 'Total Football' | 'Pragmatic Counter' | 'Tiki-Taka Purist' | 'Chaos Maverick';
  archetypeBadge: string;
  riskAppetite: 'Calculated Risk-Taker' | 'Bold Gambler' | 'Safety First' | 'Tactical Scientist';
  luckIndex: number;
  favoriteFormation: string;
  totalMatchesManaged: number;
  winRatePercent: number;
  trophiesLifted: number;
  perfectSeasonsCount: number;
  scoutEfficiencyRating: number;
}

export interface HexagonSkills {
  finishing: number;     // 0-100: Box lethality, shot conversion, xG overperformance
  creation: number;      // 0-100: Chance generation, key passes, assist danger
  buildUp: number;       // 0-100: Passing fluency, possession dominance, tempo control
  defense: number;       // 0-100: Tackles, press resistance, aerial clearances, clean sheet stability
  physicality: number;   // 0-100: Duels won, stamina endurance, recovery pressing
  carrying: number;      // 0-100: Progressive carries, 1v1 take-ons, dribble penetration
  overallIndex: number;  // 0-100: Composite skill index
}

export interface TacticalPartnershipReport {
  name: string;
  rating: number; // 0-100
  verdict: string;
  players: string[];
}

export interface AftergameReport {
  matchId: string;
  matchday: number;
  opponentName: string;
  scoreline: string;
  resultOutcome: 'win' | 'draw' | 'loss';
  tacticalArchetype: string;
  managerRating: number; // 1-10
  dominanceIndex: number; // 0-100%
  xgDelta: number;
  conversionRate: number; // %
  squadSkills: HexagonSkills;
  opponentSkills: HexagonSkills;
  partnerships: TacticalPartnershipReport[];
  scoutDebrief: {
    strengths: string[];
    vulnerabilities: string[];
  };
  mvpPlayerId: string;
  mvpName: string;
  mvpRating: number;
  mvpStats: string;
}

export type OutfieldAttributeKey =
  | 'HEA'
  | 'IQ'
  | 'SHO'
  | 'PAS'
  | 'WF'
  | 'SKL'
  | 'PHY'
  | 'DEF'
  | 'PAC'
  | 'CTL'
  | 'STA';

export type GKAttributeKey =
  | 'DIV'
  | 'HAN'
  | 'KIC'
  | 'REF'
  | 'SPD'
  | 'POS'
  | 'AER'
  | '1V1'
  | 'IQ'
  | 'THR'
  | 'STA';

export type PlayerAttributeKey = OutfieldAttributeKey | GKAttributeKey;

export interface BuildAPlayerAttributeSlot {
  key: OutfieldAttributeKey;
  label: string;
  shortDesc: string;
  assignedValue: number | null;
  donorPlayerName: string | null;
  donorClubYear: string | null;
}

export interface BuiltPlayerResult {
  name: string;
  position: PlayerPosition;
  overall: number;
  tier: 'GOAT' | 'Legend' | 'World Class' | 'Star' | 'Fan Favourite' | 'Cult Hero' | 'Journeyman';
  archetype?: string;
  playstyles?: string[];
  attributes: Record<string, number>;
  career: {
    ballonDor: number;
    goals: number;
    assists: number;
    leagueTitles: number;
    europeanCups: number;
    internationalCaps: number;
  };
  scoutSummary: string;
}

export interface JanuaryTransferWindowModalState {
  isOpen: boolean;
  matchdayTriggered: number;
  options: {
    id: string;
    type: 'shortlist' | 'super_spin' | 'morale_boost' | 'loan_deal' | 'flash_sale';
    title: string;
    tagline: string;
    description: string;
    tokenCost: number;
  }[];
  scoutedShortlist?: Player[];
  loanStar?: Player;
  flashSale?: { player: Player; discountPercent: number; tokenCost: number };
  hasResolved: boolean;
}

export interface SurvivalRound {
  roundNumber: number;
  title: string;
  targetObjective: string;
  targetDesc: string;
  opponent: OpponentTeam;
  isCompleted: boolean;
  isPassed: boolean;
  mutator?: { name: string; description: string; effect: string };
  result?: MatchResult;
}

export interface CareerClub {
  name: string;
  league: string;
  strength: number;
  badgeColor: string;
  reputation: number;
}

export type CareerPosition = 'ST' | 'CAM' | 'LW' | 'RW' | 'CM' | 'CDM' | 'CB' | 'LB' | 'RB' | 'GK';
export type CareerArchetype =
  | 'Poacher'
  | 'Playmaker'
  | 'Speedster'
  | 'BoxToBox'
  | 'Anchor'
  | 'SweeperKeeper'
  | 'ShotStopper'
  | 'CommandingWall'
  | 'PenaltySpecialist';

export interface CareerMatchMoment {
  id: string;
  minute: number;
  matchContext: string;
  situation: string;
  options: {
    label: string;
    actionDesc: string;
    requiredAttr: PlayerAttributeKey;
    difficultyVal: number;
    reward: { goals: number; assists: number; ratingDelta: number };
  }[];
}

export interface CareerSeasonRecord {
  seasonYear: number;
  age: number;
  clubName: string;
  league: string;
  leagueFinish: number;
  apps: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  avgRating: number;
  trophies: string[];
  awards: string[];
}

export interface PlayerCareerState {
  playerName: string;
  nationality: string;
  position: CareerPosition;
  archetype: CareerArchetype;
  age: number;
  seasonNumber: number;
  overall: number;
  attributes: Record<string, number>;
  currentClub: CareerClub;
  contractYearsLeft: number;
  weeklyWageK: number;
  marketValueM: number;
  trainingXP: number;
  skillPoints: number;
  unlockedPlayStyles: string[];
  currentMatchday: number;
  totalSeasonMatches: number;
  seasonApps: number;
  seasonGoals: number;
  seasonAssists: number;
  seasonCleanSheets: number;
  seasonMatchRatings: number[];
  careerGoals: number;
  careerAssists: number;
  careerApps: number;
  careerCleanSheets: number;
  careerHistory: CareerSeasonRecord[];
  trophies: {
    leagueTitles: number;
    domesticCups: number;
    championsLeagues: number;
    worldCups: number;
    continentalCups: number;
    ballonDors: number;
    goldenBoots: number;
  };
  nationalCaps: number;
  nationalGoals: number;
  internationalTournamentYear: boolean;
  isRetired: boolean;
  activeMoment: CareerMatchMoment | null;
  matchLog: string[];
}

export interface TeammateChainPuzzle {
  id: string;
  startPlayerName: string;
  targetPlayerName: string;
  startClub: string;
  targetClub: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  pathLength: number;
  viablePool: {
    playerName: string;
    club: string;
    year: string;
    country: string;
    connectedTo: string[];
  }[];
}

export interface FacilityUpgrades {
  youthAcademy: number;    // Level 1-5 (boosts prospect OVR and youth generation)
  trainingGround: number;  // Level 1-5 (boosts player development delta)
  scoutingNetwork: number; // Level 1-5 (discounts transfer fees & reveals hidden wonderkids)
  stadium: number;         // Level 1-5 (boosts matchday income & home buff)
  medicalCentre: number;   // Level 1-5 (prevents premature retirement & softens age regression)
}

export interface BoardObjective {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardBudgetM: number;
  isCompleted: boolean;
  type: 'trophy' | 'youth' | 'financial' | 'facility';
}

export interface TransferMarketListing {
  player: Player;
  askingPriceM: number;
  sellerClub: string;
  reason: 'Transfer Listed' | 'Contract Expiring' | 'Star Target' | 'Veteran Bargain';
}

export interface DynastyLegend {
  id: string;
  name: string;
  position: string;
  peakOverall: number;
  retiredSeason: number;
  trophiesWon: number;
  caps: number;
  legacyStatus: 'Club Legend' | 'Hall of Fame' | 'Golden Era Captain';
}

export interface DynastyStaffMember {
  id: string;
  name: string;
  role: 'Assistant Manager' | 'Chief Scout' | 'Head Physio';
  level: number; // 1-3
  salaryM: number;
  perkDescription: string;
}

export interface DynastySeasonHistoryEntry {
  season: number;
  trophiesWon: string[];
  finalBudgetM: number;
  squadRating: number;
  topPerformer: string;
}

export interface CommercialSponsor {
  id: string;
  name: string;
  tier: 'Global Tier 1' | 'Elite Corporate' | 'Venture Disruptor';
  basePayoutM: number;
  bonusGoal: string;
  bonusPayoutM: number;
  penaltyCondition?: string;
  penaltyM?: number;
  signed: boolean;
}

export interface LoanedPlayer {
  player: Player;
  destinationClub: string;
  seasonsRemaining: number;
  projectedGrowth: number;
}

export interface PreSeasonTour {
  id: string;
  destination: string;
  revenueM: number;
  squadSharpnessBonus: number;
  staminaConditioning: number;
}

export interface DynastyState {
  season: number;
  budgetM: number;
  clubName: string;
  trophyCabinet: string[];
  retiredPlayers: string[];
  wonderkidsDrafted: string[];
  facilities: FacilityUpgrades;
  boardConfidence: number; // 0 - 100
  boardObjectives: BoardObjective[];
  legends: DynastyLegend[];
  history: DynastySeasonHistoryEntry[];
  staff: {
    assistantManager: DynastyStaffMember;
    chiefScout: DynastyStaffMember;
    headPhysio: DynastyStaffMember;
  };
  activeSponsor?: CommercialSponsor | null;
  loanedPlayers?: LoanedPlayer[];
  preSeasonTourCompleted?: boolean;
  selectedCaptainId?: string | null;
  trainingFocus?: 'gegenpress' | 'finishing' | 'defense' | 'tiki_taka' | 'youth' | null;
  playerContracts?: Record<string, { yearsLeft: number; morale: 'superb' | 'high' | 'content' | 'disgruntled' }>;
}

export interface HalftimeTalkOption {
  id: string;
  label: string;
  quote: string;
  tone: 'passionate' | 'tactical' | 'furious' | 'encouraging';
  staminaImpact: number;
  momentumShift: number; // -100 to +100
  boostDescription: string;
}

export interface PressConferenceOption {
  id: string;
  text: string;
  tone: 'diplomatic' | 'combative' | 'inspirational';
  boardConfidenceDelta: number;
  moraleDelta: number;
}

export interface PressConferenceQuestion {
  id: string;
  headline: string;
  journalist: string;
  outlet: string;
  question: string;
  options: PressConferenceOption[];
}

export type PlayerFormArrow = 'up' | 'neutral' | 'down';

export interface SetPieceTakers {
  penalty: string | null;   // playerId
  freeKick: string | null;  // playerId
  corner: string | null;    // playerId
  captain?: string | null;  // playerId
}

export type MatchTempo = 'possession' | 'balanced' | 'blitz';
export type MatchPressing = 'low_block' | 'mid_block' | 'high_press';
export type MatchMentality = 'park_the_bus' | 'balanced' | 'all_out_attack' | 'ultra_defensive' | 'attacking';

export interface ManagerDecisionOption {
  id: string;
  label: string;
  tacticalDescription: string;
  risk: 'conservative' | 'balanced' | 'aggressive';
  userChanceBoost: number;
  oppCounterRisk: number;
  moraleOutcome: string;
}

export interface ManagerDecisionEvent {
  id: string;
  minute: number;
  scenarioTitle: string;
  scenarioContext: string;
  options: ManagerDecisionOption[];
}

export interface RoguelikePerk {
  id: string;
  name: string;
  desc: string;
  iconName: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  effectType: 'att_boost' | 'def_boost' | 'mid_boost' | 'aura_boost' | 'sub_boost' | 'token_boost';
  value: number;
}

export interface ChemistryLaserLink {
  fromSlotIndex: number;
  toSlotIndex: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  tier: 'strong' | 'medium' | 'weak';
  color: string;
}
