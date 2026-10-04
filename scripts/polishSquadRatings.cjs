const fs = require('fs');
const path = require('path');

const squadsJsonPath = path.join(__dirname, '../src/data/squads.json');
const catalogJsonPath = path.join(__dirname, '../src/data/squadCatalog.json');
const catalogTsPath = path.join(__dirname, '../src/data/squadCatalog.ts');
const CHUNKS_DIR = path.join(__dirname, '../src/data/chunks');

const squads = JSON.parse(fs.readFileSync(squadsJsonPath, 'utf8'));

// Polish Liverpool 2004-05
const liv05 = squads.find(s => s.id === 'liverpool-2004-05');
if (liv05) {
  liv05.players.forEach(p => {
    if (p.name.includes('Gerrard')) {
      p.overall = 94;
      p.shooting = 93;
      p.passing = 94;
      p.physical = 88;
      p.auraTrait = { id: 'gerrard-istanbul', name: 'Miracle of Istanbul Captain', description: '+35% team surge when trailing in 2nd half.', shortDesc: '+35% 2nd half comeback', rarity: 'Legendary' };
    } else if (p.name.includes('Baros')) {
      p.overall = 82;
      p.shooting = 83;
    } else if (p.name.includes('Traore')) {
      p.overall = 76;
    } else if (p.name.includes('Finnan')) {
      p.overall = 82;
    } else if (p.name.includes('Alonso')) {
      p.overall = 89;
    } else if (p.name.includes('Carragher')) {
      p.overall = 88;
    } else if (p.name.includes('Hyypia')) {
      p.overall = 87;
    }
  });
}

// Polish AC Milan 2006-07
const mil07 = squads.find(s => s.id === 'ac-milan-2006-07');
if (mil07) {
  mil07.players.forEach(p => {
    if (p.name.includes('Kaka') || p.name.includes('Kaká')) {
      p.overall = 95;
      p.pace = 93;
      p.shooting = 90;
      p.passing = 91;
      p.dribbling = 94;
      p.auraTrait = { id: 'kaka-ballondor', name: 'Ballon d\'Or 10 UCL Goals', description: '+35% central solo acceleration and finish.', shortDesc: '+35% solo burst', rarity: 'Legendary' };
    }
  });
}

// Polish Inter 2009-10
const int10 = squads.find(s => s.id === 'inter-2009-10');
if (int10) {
  int10.players.forEach(p => {
    if (p.name.includes('Milito')) {
      p.overall = 92;
      p.shooting = 94;
      p.auraTrait = { id: 'milito-principe', name: 'Il Principe Bernabeu Brace', description: '+35% clinical 1v1 finish in finals.', shortDesc: '+35% final brace', rarity: 'Legendary' };
    } else if (p.name.includes('Sneijder')) {
      p.overall = 92;
      p.passing = 95;
      p.shooting = 89;
      p.auraTrait = { id: 'sneijder-treble', name: 'Treble Assist Master', description: '+30% final through ball vision.', shortDesc: '+30% through balls', rarity: 'Legendary' };
    }
  });
}

// Save squads.json
fs.writeFileSync(squadsJsonPath, JSON.stringify(squads, null, 2), 'utf8');

// Update chunks
const chunkMap = {};
squads.forEach(s => {
  if (!chunkMap[s.chunkId]) chunkMap[s.chunkId] = [];
  chunkMap[s.chunkId].push(s);
});

Object.keys(chunkMap).forEach(chunkName => {
  const p = path.join(CHUNKS_DIR, `${chunkName}.json`);
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(chunkMap[chunkName], null, 2), 'utf8');
  }
});

// Update catalog
const catalog = squads.map(s => {
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
console.log('Polished squad ratings & updated catalog successfully!');
