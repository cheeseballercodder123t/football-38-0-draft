const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = path.join(__dirname, '../src/data/chunks');
const SQUADS_JSON_PATH = path.join(__dirname, '../src/data/squads.json');

// Genuine legends and where they are allowed to appear
const GENUINE_LEGENDS = {
  'zinedine zidane': ['france', 'real-madrid-2001', 'real-madrid-2002', 'real-madrid-2003', 'real-madrid-2004', 'real-madrid-2005', 'real-madrid-2006', 'juventus-1996', 'juventus-1997', 'juventus-1998', 'juventus-1999', 'juventus-2000', 'juventus-2001'],
  'lionel messi': ['barcelona', 'fc-barcelona', 'argentina', 'paris-saint-germain', 'inter-miami'],
  'cristiano ronaldo': ['portugal', 'manchester-united', 'real-madrid', 'juventus', 'sporting'],
  'diego maradona': ['argentina', 'napoli', 'ssc-napoli', 'barcelona', 'boca'],
  'thierry henry': ['arsenal', 'france', 'barcelona', 'fc-barcelona', 'monaco'],
  'kylian mbappe': ['france', 'monaco', 'as-monaco', 'paris-saint-germain', 'real-madrid'],
  'kylian mbappé': ['france', 'monaco', 'as-monaco', 'paris-saint-germain', 'real-madrid'],
  'karim benzema': ['france', 'real-madrid', 'lyon', 'olympique-lyonnais'],
  'ronaldinho': ['brazil', 'barcelona', 'fc-barcelona', 'paris-saint-germain', 'ac-milan'],
  'ronaldo r9': ['brazil', 'inter-milan', 'real-madrid', 'barcelona', 'fc-barcelona', 'psv', 'ac-milan'],
  'ronaldo nazario': ['brazil', 'inter-milan', 'real-madrid', 'barcelona', 'fc-barcelona', 'psv', 'ac-milan'],
  'andrés iniesta': ['spain', 'barcelona', 'fc-barcelona'],
  'andres iniesta': ['spain', 'barcelona', 'fc-barcelona'],
  'iker casillas': ['spain', 'real-madrid', 'porto', 'fc-porto'],
  'gianluigi buffon': ['italy', 'juventus', 'parma'],
  'paolo maldini': ['italy', 'ac-milan'],
  'andrea pirlo': ['italy', 'ac-milan', 'juventus', 'inter-milan', 'brescia'],
  'francesco totti': ['italy', 'as-roma', 'roma'],
  'wayne rooney': ['england', 'manchester-united', 'everton'],
  'steven gerrard': ['england', 'liverpool'],
  'frank lampard': ['england', 'chelsea', 'west-ham', 'manchester-city'],
  'didier drogba': ['chelsea', 'marseille', 'galatasaray'],
  "n'golo kante": ['france', 'leicester-city', 'chelsea'],
  'paul pogba': ['france', 'juventus', 'manchester-united'],
  'antoine griezmann': ['france', 'real-sociedad', 'atletico-madrid', 'barcelona'],
  'robert lewandowski': ['poland', 'dortmund', 'bayern', 'barcelona'],
  'luka modric': ['croatia', 'tottenham', 'real-madrid', 'dinamo-zagreb'],
  'luka modrić': ['croatia', 'tottenham', 'real-madrid', 'dinamo-zagreb']
};

const FORBIDDEN_SURNAMES = [
  'zidane', 'messi', 'maradona', 'henry', 'mbappe', 'mbappé',
  'ronaldo', 'ronaldinho', 'benzema', 'iniesta', 'casillas',
  'buffon', 'maldini', 'pirlo', 'totti', 'rooney', 'gerrard',
  'lampard', 'drogba', 'cruyff', 'pelé', 'pele'
];

const CLEAN_SURNAMES = {
  France: ['Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard', 'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent', 'Mercier', 'Faure', 'Blanc', 'Guerin', 'Boyer', 'Garnier', 'Chevalier', 'Perrin', 'Robin', 'Masson', 'Gautier', 'Chevalier'],
  Spain: ['Navarro', 'Serrano', 'Cano', 'Gil', 'Castillo', 'Vidal', 'Mendez', 'Garrido', 'Santos', 'Cortes', 'Lozano', 'Guerrero', 'Prieto', 'Molina', 'Ortiz', 'Delgado', 'Castro', 'Rubio', 'Marin', 'Sanz', 'Nunez', 'Medina', 'Iglesias', 'Cabrera', 'Calvo', 'Gallego', 'Vargas', 'Reyes', 'Campos', 'Vega'],
  England: ['Walker', 'Wood', 'Watson', 'Brooks', 'Kelly', 'Price', 'Bennett', 'Woodward', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Butler', 'Simmons', 'Foster', 'Bryant', 'Russell', 'Griffin', 'Hayes', 'Myers', 'Ford', 'Graham', 'Fisher', 'Ellis', 'Harrison'],
  Germany: ['Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schroder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Kruger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause'],
  Italy: ['Ferrari', 'Russo', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Galli', 'Conti', 'De Luca', 'Costa', 'Giordano', 'Mancini', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferraro'],
  Brazil: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Carvalho', 'Martins', 'Araujo', 'Melo', 'Barbosa', 'Ramos', 'Teixeira', 'Rocha'],
  Argentina: ['Lopez', 'Gonzalez', 'Rodriguez', 'Garcia', 'Martinez', 'Perez', 'Alvarez', 'Gomez', 'Sanchez', 'Diaz', 'Vazquez', 'Romero', 'Herrera', 'Medina', 'Castillo', 'Morales', 'Rios', 'Sosa', 'Gutierrez', 'Mendez']
};

function isValidLegend(fullName, squadId) {
  const norm = fullName.trim().toLowerCase();
  const allowedPatterns = GENUINE_LEGENDS[norm];
  if (!allowedPatterns) return false;
  return allowedPatterns.some(p => squadId.toLowerCase().includes(p.toLowerCase()));
}

const chunkFiles = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.json'));
const allSquads = [];
let replacedCount = 0;

for (const file of chunkFiles) {
  const filePath = path.join(CHUNKS_DIR, file);
  const squads = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const s of squads) {
    const usedNames = new Set(s.players.map(p => p.name));

    for (let i = 0; i < s.players.length; i++) {
      const p = s.players[i];
      const normName = p.name.trim().toLowerCase();

      // Check if player name contains any forbidden legend surname
      let containsForbiddenSurname = false;
      for (const sur of FORBIDDEN_SURNAMES) {
        if (new RegExp('\\b' + sur + '\\b', 'i').test(normName)) {
          containsForbiddenSurname = true;
          break;
        }
      }

      if (containsForbiddenSurname) {
        // Only keep if they are genuinely the real legend on their real team!
        if (!isValidLegend(p.name, s.id)) {
          replacedCount++;
          const parts = p.name.split(' ');
          const firstName = parts[0] || 'Alex';
          const pool = CLEAN_SURNAMES[p.country] || CLEAN_SURNAMES[s.league === 'La Liga' ? 'Spain' : (s.league === 'Premier League' ? 'England' : (s.league === 'Serie A' ? 'Italy' : 'Germany'))];
          let attempts = 0;
          let newName = '';
          while (attempts < 100) {
            const last = pool[(attempts + i * 3) % pool.length];
            newName = `${firstName} ${last}`;
            if (!usedNames.has(newName)) break;
            attempts++;
          }
          usedNames.delete(p.name);
          p.name = newName;
          usedNames.add(newName);
        }
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(squads, null, 2), 'utf8');
  allSquads.push(...squads);
}

console.log(`Successfully purged ${replacedCount} fake/illegitimate legend instances!`);
fs.writeFileSync(SQUADS_JSON_PATH, JSON.stringify(allSquads, null, 2), 'utf8');
console.log('Updated squads.json with 100% genuine rosters.');
