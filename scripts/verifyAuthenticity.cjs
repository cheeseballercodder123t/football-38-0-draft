const fs = require('fs');
const path = require('path');

const squads = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/squads.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/squadCatalog.json'), 'utf8'));

console.log('--- TESTING ALL MODES AND SQUAD INTEGRITY ---');

const modes = [
  'premier_league',
  'la_liga',
  'serie_a',
  'bundesliga',
  'champions_league',
  'world_cup',
  'invincible'
];

modes.forEach(mode => {
  let eligible = [];
  if (mode === 'world_cup') {
    eligible = catalog.filter(s => s.type === 'country');
  } else if (mode === 'champions_league') {
    eligible = catalog.filter(s => s.type === 'club' && (s.tier === 'elite' || s.tier === 'high' || s.league === 'Other'));
  } else if (mode === 'premier_league') {
    eligible = catalog.filter(s => s.league === 'Premier League');
  } else if (mode === 'la_liga') {
    eligible = catalog.filter(s => s.league === 'La Liga');
  } else if (mode === 'serie_a') {
    eligible = catalog.filter(s => s.league === 'Serie A');
  } else if (mode === 'bundesliga') {
    eligible = catalog.filter(s => s.league === 'Bundesliga');
  } else {
    eligible = catalog.filter(s => s.type === 'club');
  }

  console.log(`Mode: ${mode.padEnd(18)} -> ${eligible.length} official squads available`);
});

// Check if any squad has 0 players
const emptySquads = squads.filter(s => !s.players || s.players.length === 0);
console.log('\nEmpty squads count:', emptySquads.length);

// Check sample players from a few squads
console.log('\nSample Squads & Starters:');
const sampleIds = ['arsenal-2003-04', 'barcelona-2008-09', 'brazil-1970', 'dortmund-2012-13', 'ac-milan-2002-03', 'real-betis-2022-23'];
sampleIds.forEach(id => {
  const sq = squads.find(s => s.id === id);
  if (sq) {
    console.log(`\n[${sq.league || sq.type}] ${sq.fullName} (${sq.players.length} players):`);
    console.log('Starters:', sq.players.slice(0, 5).map(p => `${p.name} (${p.specificPosition} ${p.overall})`).join(', '));
    if (sq.players.length > 11) {
      console.log('Bench sample:', sq.players.slice(11, 15).map(p => `${p.name} (${p.specificPosition} ${p.overall})`).join(', '));
    }
  }
});
