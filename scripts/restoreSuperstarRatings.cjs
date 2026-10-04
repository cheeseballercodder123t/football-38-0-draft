const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = path.join(__dirname, '../src/data/chunks');
const SQUADS_JSON_PATH = path.join(__dirname, '../src/data/squads.json');

// Genuine superstar base ratings on their peak historic squads
const SUPERSTAR_PEAKS = {
  'Lionel Messi': 98,
  'Cristiano Ronaldo': 97,
  'Zinedine Zidane': 96,
  'Ronaldo R9': 97,
  'Ronaldo Nazario': 97,
  'Ronaldinho': 95,
  'Thierry Henry': 95,
  'Kylian Mbappé': 94,
  'Kylian Mbappe': 94,
  'Karim Benzema': 95,
  'Andrés Iniesta': 94,
  'Andres Iniesta': 94,
  'Xavi Hernandez': 95,
  'Neymar Jr': 93,
  'Neymar': 93,
  'Luis Suarez': 94,
  'Luis Suárez': 94,
  'Luka Modric': 93,
  'Luka Modrić': 93,
  'Gareth Bale': 92,
  'Sergio Ramos': 93,
  'Iker Casillas': 93,
  'Gianluigi Buffon': 94,
  'Paolo Maldini': 95,
  'Alessandro Nesta': 93,
  'Fabio Cannavaro': 93,
  'Carles Puyol': 92,
  'Gerard Pique': 90,
  'Dani Alves': 91,
  'Marcelo': 90,
  'Xabi Alonso': 91,
  'Sergio Busquets': 91,
  'Mesut Ozil': 91,
  'Mesut Özil': 91,
  'David Villa': 91,
  'Samuel Eto\'o': 92,
  'Arjen Robben': 92,
  'Franck Ribery': 92,
  'Manuel Neuer': 94,
  'Robert Lewandowski': 94,
  'Kevin De Bruyne': 93,
  'Erling Haaland': 93,
  'Mohamed Salah': 92,
  'Virgil van Dijk': 93,
  'Wayne Rooney': 93,
  'Paul Scholes': 91,
  'Ryan Giggs': 90,
  'Roy Keane': 91,
  'Steven Gerrard': 92,
  'Frank Lampard': 92,
  'Didier Drogba': 92,
  'Petr Cech': 91,
  'John Terry': 91,
  'Rio Ferdinand': 91,
  'Nemanja Vidic': 91,
  'Patrick Vieira': 92,
  'Dennis Bergkamp': 93,
  'Robert Pires': 89,
  'Sol Campbell': 90,
  'Kaka': 94,
  'Kaká': 94,
  'Andriy Shevchenko': 93,
  'Clarence Seedorf': 90,
  'Andrea Pirlo': 93,
  'Gennaro Gattuso': 89,
  'Filippo Inzaghi': 89,
  'Hernan Crespo': 90,
  'Gabriel Batistuta': 93,
  'Juan Roman Riquelme': 91,
  'Javier Zanetti': 92,
  'Diego Forlan': 90,
  'Radamel Falcao': 90,
  'Antoine Griezmann': 91
};

const chunkFiles = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.json'));
const allSquads = [];
let restoredCount = 0;

for (const file of chunkFiles) {
  const filePath = path.join(CHUNKS_DIR, file);
  const squads = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const s of squads) {
    for (const p of s.players) {
      const peakOvr = SUPERSTAR_PEAKS[p.name];
      if (peakOvr && p.overall < peakOvr) {
        // Only boost if on an elite/championship tier squad or national team
        if (s.tier === 'elite' || s.type === 'country' || s.fullName.includes('Peak') || s.fullName.includes('Champions') || s.fullName.includes('Double') || s.fullName.includes('Treble')) {
          p.overall = peakOvr;
          restoredCount++;
          // Scale their sub-attributes to match
          if (p.position === 'FWD') {
            p.shooting = Math.max(p.shooting, peakOvr + 1);
            p.dribbling = Math.max(p.dribbling, peakOvr);
            p.composure = Math.max(p.composure, peakOvr + 2);
          } else if (p.position === 'MID') {
            p.passing = Math.max(p.passing, peakOvr + 1);
            p.dribbling = Math.max(p.dribbling, peakOvr);
            p.composure = Math.max(p.composure, peakOvr + 2);
          } else if (p.position === 'DEF') {
            p.defending = Math.max(p.defending, peakOvr + 1);
            p.physical = Math.max(p.physical, peakOvr);
            p.composure = Math.max(p.composure, peakOvr + 2);
          } else if (p.position === 'GK') {
            p.defending = peakOvr;
            p.composure = peakOvr + 2;
          }
        }
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(squads, null, 2), 'utf8');
  allSquads.push(...squads);
}

console.log(`Restored ${restoredCount} superstar ratings to their authentic peak.`);
fs.writeFileSync(SQUADS_JSON_PATH, JSON.stringify(allSquads, null, 2), 'utf8');
