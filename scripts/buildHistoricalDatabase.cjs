const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = path.join(__dirname, '../src/data/chunks');
if (!fs.existsSync(CHUNKS_DIR)) {
  fs.mkdirSync(CHUNKS_DIR, { recursive: true });
}

// Load existing handcrafted squads
const existingSquads = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/squads.json'), 'utf8'));
console.log(`Loaded ${existingSquads.length} existing squads.`);

// 24-man roster blueprint (Starting XI + 8 Bench + 5 Reserves)
const POSITION_BLUEPRINTS = [
  // Starting XI (0-10)
  { pos: 'GK', spec: 'GK' },
  { pos: 'DEF', spec: 'LB' },
  { pos: 'DEF', spec: 'CB' },
  { pos: 'DEF', spec: 'CB' },
  { pos: 'DEF', spec: 'RB' },
  { pos: 'MID', spec: 'CDM' },
  { pos: 'MID', spec: 'CM' },
  { pos: 'MID', spec: 'CAM' },
  { pos: 'FWD', spec: 'LW' },
  { pos: 'FWD', spec: 'ST' },
  { pos: 'FWD', spec: 'RW' },
  // Full Matchday Bench (11-18)
  { pos: 'GK', spec: 'GK' },
  { pos: 'DEF', spec: 'CB' },
  { pos: 'DEF', spec: 'LB' },
  { pos: 'DEF', spec: 'RB' },
  { pos: 'MID', spec: 'CM' },
  { pos: 'MID', spec: 'CDM' },
  { pos: 'MID', spec: 'CAM' },
  { pos: 'FWD', spec: 'ST' },
  // Squad Reserves & Youth Depth (19-23)
  { pos: 'GK', spec: 'GK' },
  { pos: 'DEF', spec: 'CB' },
  { pos: 'MID', spec: 'LM' },
  { pos: 'MID', spec: 'RM' },
  { pos: 'FWD', spec: 'CF' }
];

// Balanced Aura traits catalog across positions (realistic bonuses +8% to +15%)
const AURA_DEFINITIONS = {
  GK: [
    { id: 'sweeper-keeper', name: 'Sweeper Keeper', desc: '+15% interception on opponent through balls.', shortDesc: '+15% sweep', rarity: 'Rare' },
    { id: 'penalty-mindgames', name: 'Penalty Psyche', desc: '+14% penalty and 1v1 save probability.', shortDesc: '+14% 1v1 saves', rarity: 'Epic' },
    { id: 'commanding-voice', name: 'Box Commander', desc: '+10% defensive composure across the back line.', shortDesc: '+10% org', rarity: 'Rare' }
  ],
  DEF: [
    { id: 'aerial-sentinel', name: 'Aerial Sentinel', desc: '+15% aerial duel win rate and headed clearances.', shortDesc: '+15% aerial', rarity: 'Rare' },
    { id: 'colossus', name: 'Defensive Colossus', desc: '+12% central box block rate and shot deflection.', shortDesc: '+12% blocks', rarity: 'Epic' },
    { id: 'lockdown-fullback', name: 'Lockdown Fullback', desc: '+14% tackle success against opposing wingers.', shortDesc: '+14% wide def', rarity: 'Rare' },
    { id: 'overlap-engine', name: 'Overlap Engine', desc: '+12% accurate crossing delivery from wide areas.', shortDesc: '+12% crosses', rarity: 'Rare' }
  ],
  MID: [
    { id: 'the-enforcer', name: 'The Enforcer', desc: '+10% turnover pressure in central midfield duels.', shortDesc: '+10% press', rarity: 'Rare' },
    { id: 'metronome', name: 'Midfield Metronome', desc: '+8% passing accuracy and possession retention.', shortDesc: '+8% tempo', rarity: 'Epic' },
    { id: 'box-to-box', name: 'Box-to-Box Engine', desc: '+10% stamina in transition and second-ball recovery.', shortDesc: '+10% b2b', rarity: 'Rare' },
    { id: 'deep-playmaker', name: 'Deep Playmaker', desc: '+12% key pass creation on counter attacks.', shortDesc: '+12% vision', rarity: 'Epic' },
    { id: 'dead-ball', name: 'Dead-Ball Architect', desc: '+12% conversion from direct and indirect set-pieces.', shortDesc: '+12% set-piece', rarity: 'Rare' }
  ],
  FWD: [
    { id: 'clinical-poacher', name: 'Clinical Poacher', desc: '+12% finishing accuracy inside the 18-yard box.', shortDesc: '+12% box xG', rarity: 'Epic' },
    { id: 'counter-burst', name: 'Counter Burst', desc: '+14% transition pace and rapid breakaway threat.', shortDesc: '+14% break pace', rarity: 'Rare' },
    { id: 'flair-dribbler', name: '1v1 Specialist', desc: '+12% successful take-on rate on the wing.', shortDesc: '+12% take-on', rarity: 'Rare' },
    { id: 'solo-anarchy', name: 'Solo Anarchy', desc: '+15% conversion when taking on isolated defenders.', shortDesc: '+15% solo run', rarity: 'Legendary' }
  ],
  SUB: [
    { id: 'super-sub', name: 'Impact Super Sub', desc: '+12% shot conversion when brought on as substitute.', shortDesc: '+12% sub xG', rarity: 'Rare' }
  ]
};

// Expand existing squads to 24 players (starters + full bench + reserves)
function expandExistingSquad(squad) {
  if (squad.primaryTactic === 'Fluid Possession') squad.primaryTactic = 'Tiki-Taka';
  if (squad.players.length >= 24) return squad;

  const currentCount = squad.players.length;
  const needed = 24 - currentCount;

  // Real bench stars for famous iconic clubs
  const realBenchLookup = {
    'arsenal-2003-04': [
      { name: 'Sylvain Wiltord', pos: 'FWD', spec: 'ST', country: 'France', ovr: 83, pac: 85, sho: 83, pas: 78, dri: 82, def: 38, phy: 78, com: 84, aura: AURA_DEFINITIONS.SUB[0] },
      { name: 'Ray Parlour', pos: 'MID', spec: 'CM', country: 'England', ovr: 82, pac: 78, sho: 75, pas: 82, dri: 79, def: 80, phy: 84, com: 83, aura: AURA_DEFINITIONS.MID[2] },
      { name: 'Martin Keown', pos: 'DEF', spec: 'CB', country: 'England', ovr: 82, pac: 70, sho: 40, pas: 68, dri: 64, def: 86, phy: 88, com: 85, aura: AURA_DEFINITIONS.DEF[0] },
      { name: 'Edu Gaspar', pos: 'MID', spec: 'CM', country: 'Brazil', ovr: 82, pac: 75, sho: 76, pas: 84, dri: 82, def: 75, phy: 78, com: 82, aura: AURA_DEFINITIONS.MID[1] },
      { name: 'Pascal Cygan', pos: 'DEF', spec: 'CB', country: 'France', ovr: 78, pac: 65, sho: 35, pas: 66, dri: 62, def: 80, phy: 82, com: 77 },
      { name: 'Jérémie Aliadière', pos: 'FWD', spec: 'ST', country: 'France', ovr: 76, pac: 88, sho: 74, pas: 68, dri: 78, def: 32, phy: 70, com: 75 },
      { name: 'Gaël Clichy', pos: 'DEF', spec: 'LB', country: 'France', ovr: 78, pac: 86, sho: 50, pas: 74, dri: 78, def: 77, phy: 75, com: 77 },
      { name: 'David Bentley', pos: 'MID', spec: 'RM', country: 'England', ovr: 75, pac: 78, sho: 74, pas: 78, dri: 78, def: 55, phy: 70, com: 76 },
      { name: 'Justin Hoyte', pos: 'DEF', spec: 'RB', country: 'England', ovr: 74, pac: 82, sho: 40, pas: 68, dri: 70, def: 74, phy: 74, com: 74 },
      { name: 'Graham Stack', pos: 'GK', spec: 'GK', country: 'Ireland', ovr: 72, pac: 50, sho: 20, pas: 60, dri: 45, def: 74, phy: 72, com: 72 },
      { name: 'Stuart Taylor', pos: 'GK', spec: 'GK', country: 'England', ovr: 76, pac: 50, sho: 20, pas: 65, dri: 45, def: 77, phy: 75, com: 76 }
    ],
    'barcelona-2010-11': [
      { name: 'Javier Mascherano', pos: 'MID', spec: 'CDM', country: 'Argentina', ovr: 86, pac: 78, sho: 60, pas: 80, dri: 75, def: 88, phy: 86, com: 87, aura: AURA_DEFINITIONS.MID[0] },
      { name: 'Seydou Keita', pos: 'MID', spec: 'CM', country: 'Mali', ovr: 83, pac: 76, sho: 78, pas: 82, dri: 80, def: 79, phy: 83, com: 84, aura: AURA_DEFINITIONS.MID[2] },
      { name: 'Bojan Krkić', pos: 'FWD', spec: 'ST', country: 'Spain', ovr: 80, pac: 84, sho: 80, pas: 78, dri: 85, def: 32, phy: 65, com: 78, aura: AURA_DEFINITIONS.SUB[0] },
      { name: 'Maxwell', pos: 'DEF', spec: 'LB', country: 'Brazil', ovr: 81, pac: 80, sho: 68, pas: 80, dri: 82, def: 78, phy: 76, com: 81 },
      { name: 'Adriano Correia', pos: 'DEF', spec: 'RB', country: 'Brazil', ovr: 80, pac: 82, sho: 75, pas: 77, dri: 80, def: 77, phy: 75, com: 79 },
      { name: 'Ibrahim Afellay', pos: 'MID', spec: 'CAM', country: 'Netherlands', ovr: 80, pac: 83, sho: 78, pas: 80, dri: 84, def: 45, phy: 70, com: 78 },
      { name: 'Thiago Alcântara', pos: 'MID', spec: 'CM', country: 'Spain', ovr: 80, pac: 78, sho: 74, pas: 85, dri: 87, def: 68, phy: 68, com: 84, aura: AURA_DEFINITIONS.MID[1] },
      { name: 'Gabriel Milito', pos: 'DEF', spec: 'CB', country: 'Argentina', ovr: 79, pac: 68, sho: 40, pas: 72, dri: 65, def: 82, phy: 80, com: 80 },
      { name: 'Jeffrén Suárez', pos: 'FWD', spec: 'LW', country: 'Spain', ovr: 76, pac: 86, sho: 72, pas: 72, dri: 80, def: 35, phy: 68, com: 74 },
      { name: 'Oier Olazábal', pos: 'GK', spec: 'GK', country: 'Spain', ovr: 73, pac: 50, sho: 20, pas: 62, dri: 48, def: 74, phy: 72, com: 73 },
      { name: 'José Manuel Pinto', pos: 'GK', spec: 'GK', country: 'Spain', ovr: 77, pac: 50, sho: 25, pas: 68, dri: 55, def: 78, phy: 76, com: 80 }
    ],
    'real-madrid-2011-12': [
      { name: 'Gonzalo Higuaín', pos: 'FWD', spec: 'ST', country: 'Argentina', ovr: 87, pac: 85, sho: 88, pas: 78, dri: 83, def: 38, phy: 80, com: 86, aura: AURA_DEFINITIONS.FWD[0] },
      { name: 'Kaká', pos: 'MID', spec: 'CAM', country: 'Brazil', ovr: 86, pac: 82, sho: 84, pas: 87, dri: 86, def: 42, phy: 73, com: 88, aura: AURA_DEFINITIONS.MID[3] },
      { name: 'José Callejón', pos: 'FWD', spec: 'RW', country: 'Spain', ovr: 81, pac: 87, sho: 80, pas: 75, dri: 81, def: 46, phy: 74, com: 80, aura: AURA_DEFINITIONS.SUB[0] },
      { name: 'Esteban Granero', pos: 'MID', spec: 'CM', country: 'Spain', ovr: 80, pac: 73, sho: 77, pas: 82, dri: 79, def: 72, phy: 75, com: 80 },
      { name: 'Raúl Albiol', pos: 'DEF', spec: 'CB', country: 'Spain', ovr: 82, pac: 72, sho: 45, pas: 70, dri: 66, def: 84, phy: 82, com: 81, aura: AURA_DEFINITIONS.DEF[0] },
      { name: 'Fábio Coentrão', pos: 'DEF', spec: 'LB', country: 'Portugal', ovr: 82, pac: 85, sho: 72, pas: 79, dri: 81, def: 80, phy: 78, com: 81 },
      { name: 'Hamit Altıntop', pos: 'MID', spec: 'RM', country: 'Turkey', ovr: 79, pac: 76, sho: 78, pas: 80, dri: 78, def: 70, phy: 78, com: 80 },
      { name: 'Nuri Şahin', pos: 'MID', spec: 'CM', country: 'Turkey', ovr: 81, pac: 72, sho: 76, pas: 86, dri: 80, def: 74, phy: 72, com: 82 },
      { name: 'Raphaël Varane', pos: 'DEF', spec: 'CB', country: 'France', ovr: 79, pac: 83, sho: 42, pas: 68, dri: 68, def: 81, phy: 80, com: 79 },
      { name: 'Jesús Fernández', pos: 'GK', spec: 'GK', country: 'Spain', ovr: 72, pac: 50, sho: 20, pas: 60, dri: 45, def: 73, phy: 72, com: 72 },
      { name: 'Antonio Adán', pos: 'GK', spec: 'GK', country: 'Spain', ovr: 77, pac: 50, sho: 20, pas: 65, dri: 48, def: 78, phy: 75, com: 76 }
    ]
  };

  const customBench = realBenchLookup[squad.id];
  if (customBench && customBench.length >= needed) {
    customBench.slice(0, needed).forEach((b, idx) => {
      squad.players.push({
        id: `${squad.id}-bench-${idx + 1}`,
        name: b.name,
        clubYear: squad.fullName,
        clubName: squad.clubName,
        year: squad.year,
        country: b.country,
        league: squad.league,
        position: b.pos,
        specificPosition: b.spec,
        overall: b.ovr,
        pace: b.pac,
        shooting: b.sho,
        passing: b.pas,
        dribbling: b.dri,
        defending: b.def,
        physical: b.phy,
        composure: b.com,
        auraTrait: b.aura
      });
    });
    return squad;
  }

  // Calculate average starter overall
  const avgOvr = Math.round(squad.players.reduce((acc, p) => acc + p.overall, 0) / squad.players.length);
  const benchOvr = Math.max(68, avgOvr - 5);

  const defaultNationalities = squad.type === 'country' 
    ? [squad.clubName] 
    : (squad.league === 'La Liga' ? ['Spain', 'Argentina', 'Brazil', 'Uruguay', 'France']
      : squad.league === 'Premier League' ? ['England', 'Scotland', 'Ireland', 'France', 'Netherlands']
      : squad.league === 'Serie A' ? ['Italy', 'Argentina', 'Brazil', 'Croatia', 'Serbia']
      : squad.league === 'Bundesliga' ? ['Germany', 'Austria', 'Switzerland', 'Poland', 'Brazil']
      : ['France', 'Portugal', 'Netherlands', 'Belgium', 'Brazil']);

  const benchTemplates = POSITION_BLUEPRINTS.slice(currentCount);

  for (let i = 0; i < needed; i++) {
    const template = benchTemplates[i % benchTemplates.length] || { pos: 'MID', spec: 'CM' };
    const nat = defaultNationalities[i % defaultNationalities.length];
    const id = `${squad.id}-res-${i + 1}`;
    const ovr = Math.max(65, benchOvr - (i >= 6 ? 3 : 0) + (i % 2 === 0 ? 1 : -1));

    let pac = 72, sho = 65, pas = 70, dri = 70, def = 65, phy = 72, com = 74;
    if (template.pos === 'GK') {
      pac = 52; sho = 20; pas = 64; dri = 48; def = ovr; phy = ovr - 3; com = ovr;
    } else if (template.pos === 'DEF') {
      pac = 74; sho = 45; pas = 68; dri = 66; def = ovr; phy = ovr - 1; com = ovr - 2;
    } else if (template.pos === 'MID') {
      pac = 75; sho = 72; pas = ovr; dri = ovr - 2; def = 68; phy = 72; com = ovr - 1;
    } else if (template.pos === 'FWD') {
      pac = 82; sho = ovr; pas = 70; dri = ovr - 1; def = 38; phy = 74; com = ovr - 1;
    }

    // Give super-sub aura to 1st bench striker
    let auraTrait = undefined;
    if (template.pos === 'FWD' && i < 4) {
      auraTrait = AURA_DEFINITIONS.SUB[0];
    } else if (template.pos === 'MID' && i === 1) {
      auraTrait = AURA_DEFINITIONS.MID[2]; // Box to box
    }

    squad.players.push({
      id,
      name: getRandomName(nat),
      clubYear: squad.fullName,
      clubName: squad.clubName,
      year: squad.year,
      country: nat,
      league: squad.league,
      position: template.pos,
      specificPosition: template.spec,
      overall: ovr,
      pace: pac,
      shooting: sho,
      passing: pas,
      dribbling: dri,
      defending: def,
      physical: phy,
      composure: com,
      auraTrait
    });
  }

  return squad;
}

// Expand all existing squads
const expandedExisting = existingSquads.map(expandExistingSquad);
console.log(`Expanded all existing squads to 24-player rosters.`);

// 2. HISTORICAL LEAGUE SEASONS GENERATOR (1990 to 2026)
const SEASONS = [];
for (let y = 1990; y <= 2025; y++) {
  const nextY = (y + 1) % 100;
  const nextYStr = nextY < 10 ? `0${nextY}` : `${nextY}`;
  SEASONS.push(`${y}-${nextYStr}`);
}

const CLUBS_CONFIG = {
  'Premier League': [
    { name: 'Arsenal', code: 'ENG', badge: '#EF0107', accent: '#063672', tactic: 'Tiki-Taka', tier: 'elite' },
    { name: 'Aston Villa', code: 'ENG', badge: '#95BFE5', accent: '#670E36', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'Blackburn Rovers', code: 'ENG', badge: '#005CA9', accent: '#D11242', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Chelsea', code: 'ENG', badge: '#034694', accent: '#EE242C', tactic: 'Low-Block Counter', tier: 'elite' },
    { name: 'Coventry City', code: 'ENG', badge: '#00A3E0', accent: '#111827', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'Crystal Palace', code: 'ENG', badge: '#1B458F', accent: '#C4122E', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Everton', code: 'ENG', badge: '#003399', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'high' },
    { name: 'Leeds United', code: 'ENG', badge: '#FFCD00', accent: '#1D428A', tactic: 'Gegenpress', tier: 'high' },
    { name: 'Leicester City', code: 'ENG', badge: '#003090', accent: '#FDBE11', tactic: 'Low-Block Counter', tier: 'high' },
    { name: 'Liverpool', code: 'ENG', badge: '#C8102E', accent: '#00B2A9', tactic: 'Gegenpress', tier: 'elite' },
    { name: 'Manchester City', code: 'ENG', badge: '#6CABDD', accent: '#1C2C5B', tactic: 'Tiki-Taka', tier: 'elite' },
    { name: 'Manchester United', code: 'ENG', badge: '#DA291C', accent: '#FBE122', tactic: 'Direct Vertical', tier: 'elite' },
    { name: 'Middlesbrough', code: 'ENG', badge: '#DC002C', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Newcastle United', code: 'ENG', badge: '#241F20', accent: '#41B6E6', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'Norwich City', code: 'ENG', badge: '#FFF200', accent: '#00A650', tactic: 'Tiki-Taka', tier: 'low' },
    { name: 'Nottingham Forest', code: 'ENG', badge: '#DD0000', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Sheffield Wednesday', code: 'ENG', badge: '#0E4496', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Southampton', code: 'ENG', badge: '#D4001F', accent: '#132238', tactic: 'Gegenpress', tier: 'mid' },
    { name: 'Tottenham Hotspur', code: 'ENG', badge: '#132257', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'West Ham United', code: 'ENG', badge: '#7A263A', accent: '#1BB1E7', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'Wimbledon', code: 'ENG', badge: '#002B49', accent: '#FFD700', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'Bolton Wanderers', code: 'ENG', badge: '#001A4B', accent: '#ED1B2D', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Fulham', code: 'ENG', badge: '#000000', accent: '#CC0000', tactic: 'Tiki-Taka', tier: 'mid' },
    { name: 'Charlton Athletic', code: 'ENG', badge: '#D4001F', accent: '#000000', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Stoke City', code: 'ENG', badge: '#E03A3E', accent: '#1B458F', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Sunderland', code: 'ENG', badge: '#EB172B', accent: '#000000', tactic: 'Low-Block Counter', tier: 'low' },
    { name: 'West Bromwich Albion', code: 'ENG', badge: '#091453', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Wigan Athletic', code: 'ENG', badge: '#00539F', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Wolverhampton Wanderers', code: 'ENG', badge: '#FDB913', accent: '#231F20', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Brighton & Hove Albion', code: 'ENG', badge: '#0057B8', accent: '#FFCD00', tactic: 'Tiki-Taka', tier: 'high' },
    { name: 'Brentford', code: 'ENG', badge: '#D20000', accent: '#000000', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Burnley', code: 'ENG', badge: '#6C1D45', accent: '#99D6EA', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Bournemouth', code: 'ENG', badge: '#B50E12', accent: '#000000', tactic: 'Gegenpress', tier: 'mid' },
    { name: 'Portsmouth', code: 'ENG', badge: '#001489', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Watford', code: 'ENG', badge: '#FBEE23', accent: '#ED2127', tactic: 'Direct Vertical', tier: 'low' }
  ],
  'La Liga': [
    { name: 'Real Madrid', code: 'ESP', badge: '#FEBE10', accent: '#00529F', tactic: 'Direct Vertical', tier: 'elite' },
    { name: 'FC Barcelona', code: 'ESP', badge: '#A50044', accent: '#004D98', tactic: 'Tiki-Taka', tier: 'elite' },
    { name: 'Atletico Madrid', code: 'ESP', badge: '#CB3524', accent: '#272E61', tactic: 'Low-Block Counter', tier: 'elite' },
    { name: 'Valencia CF', code: 'ESP', badge: '#FF7300', accent: '#000000', tactic: 'Low-Block Counter', tier: 'high' },
    { name: 'Sevilla FC', code: 'ESP', badge: '#D4001F', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'Athletic Bilbao', code: 'ESP', badge: '#EE2524', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'Real Sociedad', code: 'ESP', badge: '#0067B1', accent: '#FFFFFF', tactic: 'Tiki-Taka', tier: 'high' },
    { name: 'Real Betis', code: 'ESP', badge: '#0BB364', accent: '#FFFFFF', tactic: 'Tiki-Taka', tier: 'high' },
    { name: 'Villarreal CF', code: 'ESP', badge: '#FFE600', accent: '#00509B', tactic: 'Tiki-Taka', tier: 'high' },
    { name: 'Deportivo La Coruna', code: 'ESP', badge: '#0055A5', accent: '#FFFFFF', tactic: 'Tiki-Taka', tier: 'high' },
    { name: 'Celta Vigo', code: 'ESP', badge: '#8AC3EE', accent: '#C41230', tactic: 'Tiki-Taka', tier: 'mid' },
    { name: 'RCD Espanyol', code: 'ESP', badge: '#007EC8', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Real Zaragoza', code: 'ESP', badge: '#0033A0', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'RCD Mallorca', code: 'ESP', badge: '#E20613', accent: '#000000', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'CA Osasuna', code: 'ESP', badge: '#D91A2A', accent: '#112548', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Getafe CF', code: 'ESP', badge: '#005999', accent: '#E30613', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Malaga CF', code: 'ESP', badge: '#70B9E5', accent: '#FFFFFF', tactic: 'Tiki-Taka', tier: 'mid' },
    { name: 'Rayo Vallecano', code: 'ESP', badge: '#E30613', accent: '#FFFFFF', tactic: 'Gegenpress', tier: 'mid' },
    { name: 'Real Valladolid', code: 'ESP', badge: '#5B2C82', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'low' },
    { name: 'Racing Santander', code: 'ESP', badge: '#00843D', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'Sporting Gijon', code: 'ESP', badge: '#D21417', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'Real Oviedo', code: 'ESP', badge: '#0047AB', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'Tenerife', code: 'ESP', badge: '#005BAB', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'Albacete', code: 'ESP', badge: '#FFFFFF', accent: '#000000', tactic: 'Low-Block Counter', tier: 'low' },
    { name: 'Deportivo Alaves', code: 'ESP', badge: '#0055A5', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Granada CF', code: 'ESP', badge: '#C8102E', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Levante UD', code: 'ESP', badge: '#00438A', accent: '#BA0C2F', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Girona FC', code: 'ESP', badge: '#CC0000', accent: '#FFFFFF', tactic: 'Tiki-Taka', tier: 'high' },
    { name: 'Cadiz CF', code: 'ESP', badge: '#FFF200', accent: '#003A70', tactic: 'Low-Block Counter', tier: 'low' },
    { name: 'Elche CF', code: 'ESP', badge: '#008751', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'low' }
  ],
  'Serie A': [
    { name: 'Juventus', code: 'ITA', badge: '#000000', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'elite' },
    { name: 'AC Milan', code: 'ITA', badge: '#FB090B', accent: '#000000', tactic: 'Tiki-Taka', tier: 'elite' },
    { name: 'Inter Milan', code: 'ITA', badge: '#0068A8', accent: '#000000', tactic: 'Direct Vertical', tier: 'elite' },
    { name: 'AS Roma', code: 'ITA', badge: '#8E1F2F', accent: '#F0BC42', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'SS Lazio', code: 'ITA', badge: '#87D8F7', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'SSC Napoli', code: 'ITA', badge: '#0080C8', accent: '#FFFFFF', tactic: 'Gegenpress', tier: 'elite' },
    { name: 'ACF Fiorentina', code: 'ITA', badge: '#4F2683', accent: '#FFFFFF', tactic: 'Tiki-Taka', tier: 'high' },
    { name: 'Parma Calcio', code: 'ITA', badge: '#FFED00', accent: '#002B7F', tactic: 'Low-Block Counter', tier: 'high' },
    { name: 'UC Sampdoria', code: 'ITA', badge: '#004A97', accent: '#D62718', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'Atalanta BC', code: 'ITA', badge: '#1F2421', accent: '#005CA9', tactic: 'Gegenpress', tier: 'high' },
    { name: 'Udinese Calcio', code: 'ITA', badge: '#000000', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Torino FC', code: 'ITA', badge: '#8B0000', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Bologna FC', code: 'ITA', badge: '#1A2B4C', accent: '#9B1B30', tactic: 'Tiki-Taka', tier: 'mid' },
    { name: 'Cagliari Calcio', code: 'ITA', badge: '#002B49', accent: '#BA0C2F', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: 'Genoa CFC', code: 'ITA', badge: '#9B1B30', accent: '#002B49', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Hellas Verona', code: 'ITA', badge: '#FFEB00', accent: '#002B7F', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'US Palermo', code: 'ITA', badge: '#F38BA8', accent: '#000000', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Chievo Verona', code: 'ITA', badge: '#FFED00', accent: '#003399', tactic: 'Low-Block Counter', tier: 'low' },
    { name: 'Empoli FC', code: 'ITA', badge: '#005CA9', accent: '#FFFFFF', tactic: 'Tiki-Taka', tier: 'low' },
    { name: 'Brescia Calcio', code: 'ITA', badge: '#002D62', accent: '#FFFFFF', tactic: 'Tiki-Taka', tier: 'low' },
    { name: 'US Lecce', code: 'ITA', badge: '#FFD700', accent: '#D4001F', tactic: 'Low-Block Counter', tier: 'low' },
    { name: 'US Sassuolo', code: 'ITA', badge: '#00A651', accent: '#000000', tactic: 'Tiki-Taka', tier: 'mid' },
    { name: 'AC Siena', code: 'ITA', badge: '#000000', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'low' },
    { name: 'Calcio Catania', code: 'ITA', badge: '#C8102E', accent: '#003A70', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'Reggina 1914', code: 'ITA', badge: '#800020', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'low' },
    { name: 'AC Perugia', code: 'ITA', badge: '#D4001F', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'Piacenza Calcio', code: 'ITA', badge: '#D4001F', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'low' },
    { name: 'SSC Bari', code: 'ITA', badge: '#D4001F', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'LR Vicenza', code: 'ITA', badge: '#D4001F', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'AS Livorno', code: 'ITA', badge: '#800000', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'AC Monza', code: 'ITA', badge: '#D4001F', accent: '#FFFFFF', tactic: 'Tiki-Taka', tier: 'mid' },
    { name: 'US Salernitana', code: 'ITA', badge: '#70191B', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'low' }
  ],
  'Bundesliga': [
    { name: 'FC Bayern Munich', code: 'GER', badge: '#DC052D', accent: '#0066B2', tactic: 'Tiki-Taka', tier: 'elite' },
    { name: 'Borussia Dortmund', code: 'GER', badge: '#FDE100', accent: '#000000', tactic: 'Gegenpress', tier: 'elite' },
    { name: 'Bayer 04 Leverkusen', code: 'GER', badge: '#E32219', accent: '#000000', tactic: 'Tiki-Taka', tier: 'elite' },
    { name: 'FC Schalke 04', code: 'GER', badge: '#004D9D', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'SV Werder Bremen', code: 'GER', badge: '#1D9053', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'VfB Stuttgart', code: 'GER', badge: '#E32219', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'Hamburger SV', code: 'GER', badge: '#004A99', accent: '#000000', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'Borussia Monchengladbach', code: 'GER', badge: '#000000', accent: '#158C38', tactic: 'Gegenpress', tier: 'high' },
    { name: 'VfL Wolfsburg', code: 'GER', badge: '#65B32E', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'high' },
    { name: 'Eintracht Frankfurt', code: 'GER', badge: '#E1000F', accent: '#000000', tactic: 'Gegenpress', tier: 'high' },
    { name: 'Hertha BSC', code: 'GER', badge: '#005CA9', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: '1. FC Koln', code: 'GER', badge: '#ED1C24', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: '1. FC Kaiserslautern', code: 'GER', badge: '#D4001F', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'SC Freiburg', code: 'GER', badge: '#000000', accent: '#D4001F', tactic: 'Gegenpress', tier: 'high' },
    { name: 'Hannover 96', code: 'GER', badge: '#1A7A40', accent: '#000000', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: '1. FC Nurnberg', code: 'GER', badge: '#861B2D', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'VfL Bochum', code: 'GER', badge: '#005CA9', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'low' },
    { name: '1. FSV Mainz 05', code: 'GER', badge: '#C41230', accent: '#FFFFFF', tactic: 'Gegenpress', tier: 'mid' },
    { name: 'TSG 1899 Hoffenheim', code: 'GER', badge: '#005CA9', accent: '#FFFFFF', tactic: 'Gegenpress', tier: 'high' },
    { name: 'RB Leipzig', code: 'GER', badge: '#001E42', accent: '#D4001F', tactic: 'Gegenpress', tier: 'elite' },
    { name: 'FC Augsburg', code: 'GER', badge: '#BA171D', accent: '#00633C', tactic: 'Low-Block Counter', tier: 'mid' },
    { name: '1. FC Union Berlin', code: 'GER', badge: '#E32219', accent: '#FFD700', tactic: 'Low-Block Counter', tier: 'high' },
    { name: 'Arminia Bielefeld', code: 'GER', badge: '#000000', accent: '#005CA9', tactic: 'Low-Block Counter', tier: 'low' },
    { name: 'MSV Duisburg', code: 'GER', badge: '#003399', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'Hansa Rostock', code: 'GER', badge: '#005CA9', accent: '#ED1C24', tactic: 'Direct Vertical', tier: 'low' },
    { name: 'Energie Cottbus', code: 'GER', badge: '#ED1C24', accent: '#FFFFFF', tactic: 'Low-Block Counter', tier: 'low' },
    { name: 'Karlsruher SC', code: 'GER', badge: '#005CA9', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'TSV 1860 Munich', code: 'GER', badge: '#70B9E5', accent: '#002B49', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'Fortuna Dusseldorf', code: 'GER', badge: '#D4001F', accent: '#FFFFFF', tactic: 'Direct Vertical', tier: 'mid' },
    { name: 'FC St. Pauli', code: 'GER', badge: '#593822', accent: '#FFFFFF', tactic: 'Gegenpress', tier: 'low' },
    { name: '1. FC Heidenheim', code: 'GER', badge: '#003399', accent: '#D4001F', tactic: 'Direct Vertical', tier: 'mid' }
  ]
};

const NAME_POOLS = {
  England: {
    first: ['James', 'David', 'John', 'Michael', 'Chris', 'Paul', 'Mark', 'Gary', 'Steve', 'Rob', 'Andy', 'Lee', 'Phil', 'Ian', 'Darren', 'Danny', 'Matt', 'Luke', 'Tom', 'Jack', 'Harry', 'Declan', 'Marcus', 'Jude', 'Bukayo', 'Trent', 'Jordan', 'Callum'],
    last: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright', 'Walker', 'Hall', 'Green', 'Clarke', 'Edwards', 'Hughes', 'Ferdinand', 'Cole', 'Campbell', 'Lampard', 'Gerrard', 'Rooney', 'Kane', 'Sterling', 'Bellingham', 'Rice', 'Saka', 'Foden']
  },
  Spain: {
    first: ['Raul', 'Fernando', 'Iker', 'David', 'Sergio', 'Carles', 'Andres', 'Xavi', 'Cesc', 'Alvaro', 'Gabi', 'Koke', 'Rodri', 'Pedri', 'Gavi', 'Lamine', 'Dani', 'Nico', 'Ferran', 'Mikel', 'Inigo', 'Unai', 'Jesus', 'Pablo', 'Aitor', 'Ruben', 'Carlos', 'Jose'],
    last: ['Garcia', 'Martinez', 'Lopez', 'Gonzalez', 'Rodriguez', 'Fernandez', 'Perez', 'Gomez', 'Sanchez', 'Diaz', 'Navarro', 'Torres', 'Ramos', 'Casillas', 'Iniesta', 'Hernandez', 'Silva', 'Alonso', 'Busquets', 'Morata', 'Olmo', 'Williams', 'Yamal', 'Gaviria', 'Merino', 'Zubimendi']
  },
  Italy: {
    first: ['Paolo', 'Alessandro', 'Francesco', 'Gianluigi', 'Roberto', 'Andrea', 'Fabio', 'Christian', 'Gennaro', 'Filippo', 'Giorgio', 'Leonardo', 'Marco', 'Ciro', 'Federico', 'Nicolo', 'Lorenzo', 'Gianluca', 'Davide', 'Manuel', 'Matteo', 'Sandro', 'Giacomo'],
    last: ['Rossi', 'Ferrari', 'Russo', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Maldini', 'Del Piero', 'Totti', 'Buffon', 'Cannavaro', 'Pirlo', 'Nesta', 'Baggio', 'Inzaghi', 'Chiellini', 'Bonucci', 'Verratti', 'Barella', 'Chiesa', 'Bastoni', 'Tonali', 'Dimarco']
  },
  Germany: {
    first: ['Oliver', 'Michael', 'Bastian', 'Philipp', 'Thomas', 'Manuel', 'Toni', 'Mario', 'Mats', 'Mesut', 'Jerome', 'Joshua', 'Leon', 'Florian', 'Jamal', 'Leroy', 'Kai', 'Serge', 'Ilkay', 'Antonio', 'Marc', 'Nico', 'Robin', 'Lukas', 'Julian', 'Maximilian'],
    last: ['Muller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Kahn', 'Ballack', 'Schweinsteiger', 'Lahm', 'Kroos', 'Neuer', 'Boateng', 'Hummels', 'Gotze', 'Kimmich', 'Goretzka', 'Musiala', 'Wirtz', 'Sane', 'Havertz', 'Rudiger', 'Gundogan']
  },
  France: {
    first: ['Zinedine', 'Thierry', 'Patrick', 'Marcel', 'Lilian', 'Didier', 'David', 'Nicolas', 'Franck', 'Karim', 'Antoine', 'Paul', 'N\'Golo', 'Kylian', 'Aurelien', 'Eduardo', 'Ousmane', 'Kingsley', 'Jules', 'Theo', 'Dayot', 'William', 'Mike', 'Adrien', 'Youssouf'],
    last: ['Zidane', 'Henry', 'Vieira', 'Desailly', 'Thuram', 'Deschamps', 'Trezeguet', 'Anelka', 'Ribery', 'Benzema', 'Griezmann', 'Pogba', 'Kante', 'Mbappe', 'Tchouameni', 'Camavinga', 'Dembele', 'Coman', 'Kounde', 'Hernandez', 'Upamecano', 'Saliba', 'Maignan', 'Rabiot', 'Fofana']
  },
  Brazil: {
    first: ['Ronaldo', 'Rivaldo', 'Ronaldinho', 'Roberto', 'Cafu', 'Kaka', 'Lucio', 'Adriano', 'Neymar', 'Marcelo', 'Casemiro', 'Alisson', 'Ederson', 'Marquinhos', 'Thiago', 'Vinicius', 'Rodrygo', 'Gabriel', 'Richarlison', 'Bruno', 'Lucas', 'Raphinha'],
    last: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Carvalho', 'Junior', 'Nazario', 'Guimaraes', 'Magalhaes', 'Jesus', 'Martinelli']
  },
  Argentina: {
    first: ['Diego', 'Gabriel', 'Javier', 'Juan', 'Hernan', 'Lionel', 'Angel', 'Sergio', 'Gonzalo', 'Lautaro', 'Julian', 'Alexis', 'Enzo', 'Rodrigo', 'Emiliano', 'Cristian', 'Nahuel', 'Nicolas', 'Lisandro', 'Paulo', 'Leandro'],
    last: ['Maradona', 'Batistuta', 'Zanetti', 'Riquelme', 'Crespo', 'Messi', 'Di Maria', 'Aguero', 'Higuain', 'Martinez', 'Alvarez', 'Mac Allister', 'Fernandez', 'De Paul', 'Romero', 'Molina', 'Otamendi', 'Tagliafico', 'Dybala', 'Paredes']
  }
};

function getRandomName(nat) {
  const pool = NAME_POOLS[nat] || NAME_POOLS['England'];
  const first = pool.first[Math.floor(Math.random() * pool.first.length)];
  const last = pool.last[Math.floor(Math.random() * pool.last.length)];
  return `${first} ${last}`;
}

const existingSquadIds = new Set(expandedExisting.map(s => s.id));
const allGeneratedSquads = [...expandedExisting];

const CHUNK_MAP = {
  'epl_1990s': [],
  'epl_2000s': [],
  'epl_2010s': [],
  'epl_2020s': [],
  'laliga_1990s': [],
  'laliga_2000s': [],
  'laliga_2010s': [],
  'laliga_2020s': [],
  'seriea_1990s': [],
  'seriea_2000s': [],
  'seriea_2010s': [],
  'seriea_2020s': [],
  'bundesliga_1990s': [],
  'bundesliga_2000s': [],
  'bundesliga_2010s': [],
  'bundesliga_2020s': [],
  'international_and_special': []
};

function getChunkId(league, year, type) {
  if (type === 'country' || league === 'International' || league === 'Other') {
    return 'international_and_special';
  }
  const startYear = parseInt(year.split('-')[0], 10);
  let era = '1990s';
  if (startYear >= 2020) era = '2020s';
  else if (startYear >= 2010) era = '2010s';
  else if (startYear >= 2000) era = '2000s';

  if (league === 'Premier League') return `epl_${era}`;
  if (league === 'La Liga') return `laliga_${era}`;
  if (league === 'Serie A') return `seriea_${era}`;
  if (league === 'Bundesliga') return `bundesliga_${era}`;
  return 'international_and_special';
}

expandedExisting.forEach(squad => {
  const chunkId = getChunkId(squad.league, squad.year, squad.type);
  CHUNK_MAP[chunkId].push(squad);
});

// Generate 18-20 clubs per season with full 24-player rosters
Object.entries(CLUBS_CONFIG).forEach(([league, clubs]) => {
  SEASONS.forEach(seasonYear => {
    const targetCount = league === 'Bundesliga' ? 18 : 20;
    const seasonClubs = clubs.slice(0, targetCount);

    seasonClubs.forEach((clubCfg, clubIdx) => {
      const slugName = clubCfg.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const squadId = `${slugName}-${seasonYear}`;

      if (existingSquadIds.has(squadId)) {
        return;
      }

      let baseOvr = 75;
      if (clubCfg.tier === 'elite') baseOvr = 85 + (clubIdx % 3);
      else if (clubCfg.tier === 'high') baseOvr = 80 + (clubIdx % 4);
      else if (clubCfg.tier === 'mid') baseOvr = 75 + (clubIdx % 4);
      else baseOvr = 70 + (clubIdx % 5);

      const fullName = `${clubCfg.name} ${seasonYear}`;
      const players = [];

      const primaryNat = league === 'Premier League' ? 'England'
        : league === 'La Liga' ? 'Spain'
        : league === 'Serie A' ? 'Italy'
        : 'Germany';

      const secondaryNats = league === 'Premier League' ? ['England', 'France', 'Brazil', 'Argentina', 'Spain', 'Germany']
        : league === 'La Liga' ? ['Spain', 'Argentina', 'Brazil', 'France', 'Uruguay', 'Portugal']
        : league === 'Serie A' ? ['Italy', 'Argentina', 'Brazil', 'Croatia', 'Serbia', 'France']
        : ['Germany', 'Austria', 'Switzerland', 'Poland', 'Brazil', 'France'];

      POSITION_BLUEPRINTS.forEach((bp, pIdx) => {
        const isStarter = pIdx < 11;
        const playerOvr = isStarter 
          ? Math.min(94, Math.max(68, baseOvr + (pIdx === 0 || pIdx === 9 ? 2 : (pIdx % 3 === 0 ? 1 : -1))))
          : Math.min(88, Math.max(65, baseOvr - 4 + (pIdx % 2)));

        const nat = pIdx < 7 || Math.random() > 0.45 ? primaryNat : secondaryNats[pIdx % secondaryNats.length];
        const playerName = getRandomName(nat);
        const playerId = `${squadId}-p${pIdx + 1}`;

        let pac = 72, sho = 68, pas = 72, dri = 70, def = 65, phy = 72, com = playerOvr;
        if (bp.pos === 'GK') {
          pac = 50 + (pIdx % 10); sho = 20; pas = 64; dri = 45; def = playerOvr; phy = playerOvr - 2; com = playerOvr;
        } else if (bp.pos === 'DEF') {
          pac = bp.spec.includes('W') || bp.spec.includes('B') && !bp.spec.includes('C') ? 80 : 70;
          sho = 44; pas = 68; dri = 66; def = playerOvr + 1; phy = playerOvr; com = playerOvr - 2;
        } else if (bp.pos === 'MID') {
          pac = bp.spec.includes('M') ? 80 : 74;
          sho = bp.spec === 'CAM' ? playerOvr - 2 : 72;
          pas = playerOvr + 1; dri = playerOvr; def = bp.spec === 'CDM' ? playerOvr : 68; phy = 74; com = playerOvr;
        } else if (bp.pos === 'FWD') {
          pac = bp.spec.includes('W') ? 86 : 80;
          sho = playerOvr + 2; pas = 72; dri = playerOvr; def = 35; phy = 76; com = playerOvr;
        }

        // Assign realistic Aura traits to 6-8 players per squad across starters and bench
        let auraTrait = undefined;
        if (pIdx === 0 && (clubCfg.tier === 'elite' || clubIdx % 2 === 0)) {
          // Starter GK
          const defAura = AURA_DEFINITIONS.GK[clubIdx % AURA_DEFINITIONS.GK.length];
          auraTrait = { id: `${playerId}-${defAura.id}`, name: defAura.name, description: defAura.desc, shortDesc: defAura.shortDesc, rarity: defAura.rarity };
        } else if (pIdx === 2) {
          // Starter CB
          const defAura = AURA_DEFINITIONS.DEF[0]; // Aerial Sentinel
          auraTrait = { id: `${playerId}-${defAura.id}`, name: defAura.name, description: defAura.desc, shortDesc: defAura.shortDesc, rarity: defAura.rarity };
        } else if (pIdx === 4 && clubIdx % 2 === 1) {
          // Starter Fullback
          const defAura = AURA_DEFINITIONS.DEF[2]; // Lockdown Fullback
          auraTrait = { id: `${playerId}-${defAura.id}`, name: defAura.name, description: defAura.desc, shortDesc: defAura.shortDesc, rarity: defAura.rarity };
        } else if (pIdx === 5) {
          // Starter CDM
          const defAura = AURA_DEFINITIONS.MID[0]; // The Enforcer
          auraTrait = { id: `${playerId}-${defAura.id}`, name: defAura.name, description: defAura.desc, shortDesc: defAura.shortDesc, rarity: defAura.rarity };
        } else if (pIdx === 7) {
          // Starter CAM
          const defAura = clubCfg.tier === 'elite' ? AURA_DEFINITIONS.MID[1] : AURA_DEFINITIONS.MID[4]; // Metronome or Dead-Ball
          auraTrait = { id: `${playerId}-${defAura.id}`, name: defAura.name, description: defAura.desc, shortDesc: defAura.shortDesc, rarity: defAura.rarity };
        } else if (pIdx === 9) {
          // Starter ST
          const defAura = clubCfg.tier === 'elite' ? AURA_DEFINITIONS.FWD[3] : AURA_DEFINITIONS.FWD[0]; // Solo Anarchy or Clinical Poacher
          auraTrait = { id: `${playerId}-${defAura.id}`, name: defAura.name, description: defAura.desc, shortDesc: defAura.shortDesc, rarity: defAura.rarity };
        } else if (pIdx === 8 && clubIdx % 2 === 0) {
          // Starter Winger
          const defAura = AURA_DEFINITIONS.FWD[1]; // Counter Burst
          auraTrait = { id: `${playerId}-${defAura.id}`, name: defAura.name, description: defAura.desc, shortDesc: defAura.shortDesc, rarity: defAura.rarity };
        } else if (pIdx === 18) {
          // Bench Striker (Super Sub!)
          const defAura = AURA_DEFINITIONS.SUB[0]; // Impact Super Sub
          auraTrait = { id: `${playerId}-${defAura.id}`, name: defAura.name, description: defAura.desc, shortDesc: defAura.shortDesc, rarity: defAura.rarity };
        }

        players.push({
          id: playerId,
          name: playerName,
          clubYear: fullName,
          clubName: clubCfg.name,
          year: seasonYear,
          country: nat,
          league,
          position: bp.pos,
          specificPosition: bp.spec,
          overall: playerOvr,
          pace: pac,
          shooting: sho,
          passing: pas,
          dribbling: dri,
          defending: def,
          physical: phy,
          composure: com,
          auraTrait
        });
      });

      const newSquad = {
        id: squadId,
        clubName: clubCfg.name,
        year: seasonYear,
        fullName,
        type: 'club',
        league,
        countryCode: clubCfg.code,
        badgeColor: clubCfg.badge,
        accentColor: clubCfg.accent,
        primaryTactic: clubCfg.tactic,
        players
      };

      existingSquadIds.add(squadId);
      allGeneratedSquads.push(newSquad);

      const chunkId = getChunkId(league, seasonYear, 'club');
      CHUNK_MAP[chunkId].push(newSquad);
    });
  });
});

console.log(`Generated total squads: ${allGeneratedSquads.length}`);

// Write chunk JSON files
let totalChunkSize = 0;
Object.entries(CHUNK_MAP).forEach(([chunkId, squadsInChunk]) => {
  const filePath = path.join(CHUNKS_DIR, `${chunkId}.json`);
  const content = JSON.stringify(squadsInChunk, null, 2);
  fs.writeFileSync(filePath, content, 'utf8');
  const sizeKb = Math.round(content.length / 1024);
  totalChunkSize += sizeKb;
  console.log(`Chunk [${chunkId}]: ${squadsInChunk.length} squads (~${sizeKb} KB)`);
});
console.log(`Total chunked database size: ~${Math.round(totalChunkSize / 1024 * 10) / 10} MB across 17 modular chunks.`);

// Write Squad Manifest / Catalog
const catalog = allGeneratedSquads.map(s => ({
  id: s.id,
  clubName: s.clubName,
  year: s.year,
  fullName: s.fullName,
  type: s.type,
  league: s.league,
  countryCode: s.countryCode,
  badgeColor: s.badgeColor,
  accentColor: s.accentColor,
  primaryTactic: s.primaryTactic,
  chunkId: getChunkId(s.league, s.year, s.type),
  playerCount: s.players.length,
  tier: s.tier || 'mid'
}));

const catalogJsonPath = path.join(__dirname, '../src/data/squadCatalog.json');
fs.writeFileSync(catalogJsonPath, JSON.stringify(catalog, null, 2), 'utf8');

const catalogFilePath = path.join(__dirname, '../src/data/squadCatalog.ts');
const catalogTsContent = `import { TacticalStyle } from '../types/football';
import catalogJson from './squadCatalog.json';

export interface SquadSummary {
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
  chunkId: string;
  playerCount: number;
  tier: 'elite' | 'high' | 'mid' | 'low';
}

export const SQUAD_CATALOG: SquadSummary[] = catalogJson as SquadSummary[];
`;
fs.writeFileSync(catalogFilePath, catalogTsContent, 'utf8');
console.log(`Wrote squadCatalog.json and squadCatalog.ts with ${catalog.length} squad summaries.`);

// Also write squads.json
fs.writeFileSync(path.join(__dirname, '../src/data/squads.json'), JSON.stringify(allGeneratedSquads, null, 2), 'utf8');

console.log(`DONE! Total squads generated and indexed: ${allGeneratedSquads.length}`);
