const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/data/chunks');
const files = fs.readdirSync(dir);
const placeholderRegex = /(Res\.|Reserve|Placeholder|Bench \d|Player \d|Sub \d|[A-Z]{2,3} \d)/i;
let totalPlaceholders = 0;
const samples = new Set();

for (const file of files) {
  if (!file.endsWith('.json')) continue;
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const data = JSON.parse(content);
  for (const squad of data) {
    for (const player of squad.players) {
      if (placeholderRegex.test(player.name)) {
        totalPlaceholders++;
        if (samples.size < 20) samples.add(player.name);
      }
    }
  }
}

console.log('Total matching placeholders:', totalPlaceholders);
console.log('Samples:', Array.from(samples));
