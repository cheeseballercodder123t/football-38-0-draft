const fs = require('fs');
const path = require('path');

const squads = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/squads.json'), 'utf8'));

const handcrafted = squads.filter(s => 
  (s.fullName && s.fullName.includes('(')) ||
  s.id === 'real-betis-2022-23' ||
  s.type === 'country'
);

// Check Real Betis 2022-23
const betis = handcrafted.find(s => s.id === 'real-betis-2022-23');
console.log('Real Betis players count:', betis.players.length);
console.log('Betis players:', betis.players.map(p => p.name).join(', '));

// Check Arsenal 2003-04
const arsenal = handcrafted.find(s => s.id === 'arsenal-2003-04');
console.log('\nArsenal 2003-04 players count:', arsenal.players.length);
console.log('Arsenal players:', arsenal.players.map(p => p.name).join(', '));

// Check Barcelona 2010-11
const barca = handcrafted.find(s => s.id === 'barcelona-2010-11');
console.log('\nBarcelona 2010-11 players count:', barca.players.length);
console.log('Barca players:', barca.players.map(p => p.name).join(', '));

// Check Real Madrid 2011-12
const rm = handcrafted.find(s => s.id === 'real-madrid-2011-12');
console.log('\nReal Madrid 2011-12 players count:', rm.players.length);
console.log('Real Madrid players:', rm.players.map(p => p.name).join(', '));
