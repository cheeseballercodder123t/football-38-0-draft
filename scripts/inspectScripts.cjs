const fs = require('fs');

function inspectSquadsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Look at first 3 squad definitions
  console.log('--- Inspecting:', filePath, '---');
  const lines = content.split('\n');
  let currentSquad = null;
  let samplePlayers = [];
  let squadsFound = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes('clubName:') || l.includes('makeSquad(')) {
      if (currentSquad && squadsFound < 5) {
        console.log(`Squad: ${currentSquad}, Players: ${samplePlayers.slice(0, 5).join(', ')}`);
      }
      currentSquad = l.trim();
      samplePlayers = [];
      squadsFound++;
    }
    if (l.includes('name:') && !l.includes('clubName:') && !l.includes('auraTrait')) {
      const match = l.match(/name:\s*['"]([^'"]+)['"]/);
      if (match) samplePlayers.push(match[1]);
    }
  }
}

inspectSquadsInFile('./scripts/expandSquads.cjs');
inspectSquadsInFile('./scripts/appendMoreSquads.cjs');
inspectSquadsInFile('./scripts/appendBadSquads.cjs');
