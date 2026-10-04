const fs = require('fs');
const path = require('path');

const { AUTHENTIC_BENCHES } = require('./authenticBenches.cjs');
const { newBundesligaSquads } = require('./dataNewBundesliga.cjs');
const { newSerieASquads } = require('./dataNewSerieA.cjs');
const { newPremierLeagueSquads } = require('./dataNewPremierLeague.cjs');
const { newLaLigaSquads } = require('./dataNewLaLiga.cjs');
const { newInternationalAndOtherSquads } = require('./dataNewInternationalAndOther.cjs');
const { iconicTrioSquads } = require('./dataIconicTrio.cjs');

const CHUNKS_DIR = path.join(__dirname, '../src/data/chunks');
const squadsJsonPath = path.join(__dirname, '../src/data/squads.json');
const catalogJsonPath = path.join(__dirname, '../src/data/squadCatalog.json');
const catalogTsPath = path.join(__dirname, '../src/data/squadCatalog.ts');

const currentSquads = JSON.parse(fs.readFileSync(squadsJsonPath, 'utf8'));

// Filter only the handcrafted squads from the current database
const handcraftedExisting = currentSquads.filter(s => 
  (s.fullName && s.fullName.includes('(')) ||
  s.id === 'real-betis-2022-23' ||
  s.type === 'country'
);

console.log(`Loaded ${handcraftedExisting.length} existing handcrafted squads.`);

const FAKE_RESERVE_NAMES = new Set([
  'Jonas Davenport', 'Leon Sinclair', 'Leo Hayward', 'Toby Fontaine', 'Lucas Montoya', 'Sam Castillo'
]);

function cleanSquadPlayers(squad) {
  if (squad.id === 'real-betis-2022-23') {
    return squad.players; // 100% verified real 24 players
  }

  // Remove any fake reserve names
  let filtered = squad.players.filter(p => !FAKE_RESERVE_NAMES.has(p.name));

  // If squad had authentic -bench- IDs (Arsenal, Barca, Real Madrid 2012), keep them
  if (squad.id === 'arsenal-2003-04' || squad.id === 'barcelona-2010-11' || squad.id === 'real-madrid-2011-12') {
    filtered = filtered.filter(p => p.id.includes('-p') || p.id.includes('-bench-'));
  } else {
    // For other squads, filter out procedural IDs like -pgk-, -pcb-, -res-
    filtered = filtered.filter(p => !p.id.includes('-pgk-') && !p.id.includes('-pcb-') && !p.id.includes('-plb-') &&
                                    !p.id.includes('-prb-') && !p.id.includes('-pcm-') && !p.id.includes('-pcam-') &&
                                    !p.id.includes('-pcdm-') && !p.id.includes('-pst-') && !p.id.includes('-plm-') &&
                                    !p.id.includes('-prm-') && !p.id.includes('-pcf-') && !p.id.includes('-res-'));
  }

  // Now check if authentic bench is available in AUTHENTIC_BENCHES
  const benchToAdd = AUTHENTIC_BENCHES[squad.id];
  if (benchToAdd && benchToAdd.length > 0) {
    const existingPlayerNames = new Set(filtered.map(p => p.name.toLowerCase()));
    benchToAdd.forEach((b, idx) => {
      if (!existingPlayerNames.has(b.name.toLowerCase())) {
        filtered.push({
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
          auraTrait: b.aura || undefined
        });
      }
    });
  }

  return filtered;
}

// Clean and attach authentic benches
const cleanedExisting = handcraftedExisting.map(s => ({
  ...s,
  players: cleanSquadPlayers(s)
}));

// Combine all existing cleaned squads with all new authentic squads
const allNewSquads = [
  ...newBundesligaSquads,
  ...newSerieASquads,
  ...newPremierLeagueSquads,
  ...newLaLigaSquads,
  ...newInternationalAndOtherSquads,
  ...iconicTrioSquads
];

// Deduplicate squads by ID (prefer new definitions if duplicates exist)
const squadMap = new Map();
cleanedExisting.forEach(s => squadMap.set(s.id, s));
allNewSquads.forEach(s => squadMap.set(s.id, s));

const finalSquads = Array.from(squadMap.values());
console.log(`Total authentic squads after merge: ${finalSquads.length}`);

// Function to classify squad into one of the 17 chunks
function getChunkId(squad) {
  if (squad.type === 'country' || squad.league === 'Other' || squad.league === 'International') {
    return 'international_and_special';
  }

  const league = squad.league;
  let yearNum = 2000;
  if (squad.year) {
    const match = squad.year.match(/^(\d{4})/);
    if (match) yearNum = parseInt(match[1], 10);
  }

  let decade = '2000s';
  if (yearNum < 2000) decade = '1990s';
  else if (yearNum < 2010) decade = '2000s';
  else if (yearNum < 2020) decade = '2010s';
  else decade = '2020s';

  if (league === 'Premier League') return `epl_${decade}`;
  if (league === 'La Liga') return `laliga_${decade}`;
  if (league === 'Serie A') return `seriea_${decade}`;
  if (league === 'Bundesliga') return `bundesliga_${decade}`;

  return 'international_and_special';
}

// Assign chunkId to each squad
finalSquads.forEach(s => {
  s.chunkId = getChunkId(s);
  // Ensure tier is set
  if (!s.tier) {
    const avg = s.players.reduce((sum, p) => sum + p.overall, 0) / s.players.length;
    if (avg >= 86) s.tier = 'elite';
    else if (avg >= 81) s.tier = 'high';
    else if (avg >= 75) s.tier = 'mid';
    else s.tier = 'low';
  }
});

// Group squads into chunks
const chunks = {
  epl_1990s: [],
  epl_2000s: [],
  epl_2010s: [],
  epl_2020s: [],
  laliga_1990s: [],
  laliga_2000s: [],
  laliga_2010s: [],
  laliga_2020s: [],
  seriea_1990s: [],
  seriea_2000s: [],
  seriea_2010s: [],
  seriea_2020s: [],
  bundesliga_1990s: [],
  bundesliga_2000s: [],
  bundesliga_2010s: [],
  bundesliga_2020s: [],
  international_and_special: []
};

finalSquads.forEach(s => {
  if (chunks[s.chunkId]) {
    chunks[s.chunkId].push(s);
  } else {
    chunks.international_and_special.push(s);
  }
});

// Write each chunk file
Object.keys(chunks).forEach(chunkName => {
  const chunkFile = path.join(CHUNKS_DIR, `${chunkName}.json`);
  fs.writeFileSync(chunkFile, JSON.stringify(chunks[chunkName], null, 2), 'utf8');
  console.log(`Wrote ${chunks[chunkName].length} squads to chunk: ${chunkName}.json`);
});

// Write master squads.json
fs.writeFileSync(squadsJsonPath, JSON.stringify(finalSquads, null, 2), 'utf8');
console.log(`Wrote ${finalSquads.length} squads to squads.json`);

// Build squadCatalog.json
const catalog = finalSquads.map(s => {
  const sortedPlayers = [...s.players].sort((a, b) => b.overall - a.overall);
  const avg = Math.round(s.players.reduce((sum, p) => sum + p.overall, 0) / s.players.length);
  return {
    id: s.id,
    clubName: s.clubName,
    fullName: s.fullName,
    year: s.year,
    league: s.league,
    tier: s.tier,
    countryCode: s.countryCode,
    badgeColor: s.badgeColor,
    accentColor: s.accentColor,
    primaryTactic: s.primaryTactic,
    type: s.type,
    starPlayer: sortedPlayers[0] ? `${sortedPlayers[0].name} (${sortedPlayers[0].overall})` : '',
    topStars: sortedPlayers.slice(0, 3).map(p => `${p.name} (${p.overall})`),
    avgOverall: avg,
    chunkId: s.chunkId
  };
});

fs.writeFileSync(catalogJsonPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`Wrote ${catalog.length} entries to squadCatalog.json`);

// Update squadCatalog.ts
const catalogTsContent = `import catalogJson from './squadCatalog.json';

export interface SquadSummary {
  id: string;
  clubName: string;
  fullName: string;
  year: string;
  league: string;
  tier: 'elite' | 'high' | 'mid' | 'low';
  countryCode: string;
  badgeColor: string;
  accentColor: string;
  primaryTactic: string;
  type: 'club' | 'country';
  starPlayer: string;
  topStars: string[];
  avgOverall: number;
  chunkId: string;
}

export const SQUAD_CATALOG: SquadSummary[] = catalogJson as SquadSummary[];
`;
fs.writeFileSync(catalogTsPath, catalogTsContent, 'utf8');
console.log(`Updated squadCatalog.ts`);

// Audit the resulting database: ensure 0 fake reserves and check distribution
let totalPlayers = 0;
let suspiciousFound = 0;
const tierCounts = {};
const leagueCounts = {};

finalSquads.forEach(s => {
  totalPlayers += s.players.length;
  tierCounts[s.tier] = (tierCounts[s.tier] || 0) + 1;
  const l = s.type === 'country' ? 'International' : s.league;
  leagueCounts[l] = (leagueCounts[l] || 0) + 1;

  s.players.forEach(p => {
    if (FAKE_RESERVE_NAMES.has(p.name) || p.name.includes('res.') || p.name.includes('CB 1') || p.id.includes('-res-') || p.id.includes('-pgk-')) {
      suspiciousFound++;
      console.warn(`Suspicious player found: ${p.name} in ${s.fullName}`);
    }
  });
});

console.log('\n--- AUDIT SUMMARY ---');
console.log(`Total Official Squads: ${finalSquads.length}`);
console.log(`Total Official Players: ${totalPlayers}`);
console.log(`Suspicious / Fake Players Found: ${suspiciousFound}`);
console.log(`Tier Counts:`, tierCounts);
console.log(`League Counts:`, leagueCounts);
console.log('---------------------');
