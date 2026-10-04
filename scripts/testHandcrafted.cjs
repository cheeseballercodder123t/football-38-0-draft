const fs = require('fs');
const path = require('path');

const squadsJsonPath = path.join(__dirname, '../src/data/squads.json');
const currentSquads = JSON.parse(fs.readFileSync(squadsJsonPath, 'utf8'));

// Filter out existing handcrafted squads
const handcraftedExisting = currentSquads.filter(s => 
  (s.fullName && s.fullName.includes('(')) ||
  s.id === 'real-betis-2022-23' ||
  s.type === 'country'
);

console.log(`Starting with ${handcraftedExisting.length} existing handcrafted squads.`);

// Function to clean fake reserve names from existing squads
// If squad is Real Betis 2022-23, keep all 24 (all real!).
// If squad had real custom bench (Arsenal 2004, Real Madrid 2012, Barca 2011), keep up to the real bench players.
// Otherwise, keep the 11 authentic starters.
const FAKE_RESERVE_NAMES = new Set([
  'Jonas Davenport', 'Leon Sinclair', 'Leo Hayward', 'Toby Fontaine', 'Lucas Montoya', 'Sam Castillo'
]);

function cleanSquadPlayers(squad) {
  if (squad.id === 'real-betis-2022-23') {
    return squad.players; // 100% verified real 24 players
  }

  // Remove any fake reserve names
  let filtered = squad.players.filter(p => !FAKE_RESERVE_NAMES.has(p.name));

  // If squad had procedural reserves added by fixPlaceholdersAndRebalance (-pgk-, -pcb-, -plb-, etc.)
  // keep only the authentic starters and authentic bench
  if (squad.id === 'arsenal-2003-04' || squad.id === 'barcelona-2010-11' || squad.id === 'real-madrid-2011-12') {
    filtered = filtered.filter(p => p.id.includes('-p') || p.id.includes('-bench-'));
  } else {
    // For other squads, if players 11-23 had generated synthetic names like "-pgk-", keep the 11 real starters
    filtered = filtered.filter(p => !p.id.includes('-pgk-') && !p.id.includes('-pcb-') && !p.id.includes('-plb-') &&
                                    !p.id.includes('-prb-') && !p.id.includes('-pcm-') && !p.id.includes('-pcam-') &&
                                    !p.id.includes('-pcdm-') && !p.id.includes('-pst-') && !p.id.includes('-plm-') &&
                                    !p.id.includes('-prm-') && !p.id.includes('-pcf-') && !p.id.includes('-res-'));
  }

  return filtered;
}

// Clean all existing handcrafted squads
const cleanedExisting = handcraftedExisting.map(s => ({
  ...s,
  players: cleanSquadPlayers(s)
}));

console.log(`Cleaned players on existing squads. Average player count: ${(cleanedExisting.reduce((acc, s) => acc + s.players.length, 0) / cleanedExisting.length).toFixed(1)}`);
