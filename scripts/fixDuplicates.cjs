const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = path.join(__dirname, '../src/data/chunks');
const SQUADS_JSON_PATH = path.join(__dirname, '../src/data/squads.json');

// Read files
const chunkFiles = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.json'));
const allProcessedSquads = [];

// Large pool of supplementary first & last names to ensure 100% uniqueness
const FIRST_EXTRA = ['Leo', 'Toby', 'Lucas', 'Sam', 'Dan', 'Hugo', 'Enzo', 'Max', 'Finn', 'Nico', 'Theo', 'Felix', 'Oscar', 'Arthur', 'Louis', 'Noah', 'Liam', 'Zack', 'Jonas', 'Leon'];
const LAST_EXTRA = ['Vance', 'Sterling', 'Mercer', 'Davenport', 'Sinclair', 'Hayward', 'Fontaine', 'Montoya', 'Castillo', 'Moretti', 'De Luca', 'Santoro', 'Kruger', 'Vogel', 'Richter'];

let totalDuplicatesFixed = 0;

for (const file of chunkFiles) {
  const filePath = path.join(CHUNKS_DIR, file);
  const squads = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const s of squads) {
    const seenNames = new Set();
    for (let i = 0; i < s.players.length; i++) {
      const p = s.players[i];
      if (seenNames.has(p.name)) {
        totalDuplicatesFixed++;
        // Generate a unique name
        let attempts = 0;
        let newName = '';
        while (attempts < 500) {
          const first = FIRST_EXTRA[(attempts + i) % FIRST_EXTRA.length];
          const last = LAST_EXTRA[(attempts * 3 + i) % LAST_EXTRA.length];
          newName = `${first} ${last}`;
          if (!seenNames.has(newName)) {
            break;
          }
          attempts++;
        }
        p.name = newName;
      }
      seenNames.add(p.name);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(squads, null, 2), 'utf8');
  allProcessedSquads.push(...squads);
}

console.log(`Fixed ${totalDuplicatesFixed} duplicate names across squads.`);
fs.writeFileSync(SQUADS_JSON_PATH, JSON.stringify(allProcessedSquads, null, 2), 'utf8');
console.log('Updated squads.json with 0 duplicates.');
