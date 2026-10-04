const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = path.join(__dirname, '../src/data/chunks');
const SQUADS_JSON_PATH = path.join(__dirname, '../src/data/squads.json');
const CATALOG_JSON_PATH = path.join(__dirname, '../src/data/squadCatalog.json');

// 1. GENUINE LEGENDS WHITELIST
// Maps iconic players to the ONLY squad ID patterns or fullNames they actually played for.
const LEGEND_AFFILIATIONS = {
  'Zinedine Zidane': ['france-1998', 'real-madrid-2001', 'real-madrid-2002', 'real-madrid-2003', 'real-madrid-2004', 'real-madrid-2005', 'real-madrid-2006', 'juventus-1996', 'juventus-1997', 'juventus-1998', 'juventus-1999', 'juventus-2000', 'juventus-2001', 'bordeaux'],
  'Lionel Messi': ['barcelona', 'fc-barcelona', 'argentina', 'paris-saint-germain', 'inter-miami'],
  'Cristiano Ronaldo': ['portugal', 'manchester-united', 'real-madrid', 'juventus', 'sporting'],
  'Diego Maradona': ['argentina', 'napoli', 'ssc-napoli', 'barcelona', 'boca'],
  'Thierry Henry': ['arsenal', 'france', 'barcelona', 'fc-barcelona', 'monaco'],
  'Kylian Mbappé': ['france', 'monaco', 'as-monaco', 'paris-saint-germain', 'real-madrid'],
  'Kylian Mbappe': ['france', 'monaco', 'as-monaco', 'paris-saint-germain', 'real-madrid'],
  'Karim Benzema': ['france', 'real-madrid', 'lyon', 'olympique-lyonnais'],
  'Ronaldinho': ['brazil', 'barcelona', 'fc-barcelona', 'paris-saint-germain', 'ac-milan', 'flamengo', 'gremio'],
  'Ronaldo R9': ['brazil', 'inter-milan', 'real-madrid', 'barcelona', 'fc-barcelona', 'psv', 'ac-milan', 'cruzeiro'],
  'Ronaldo Nazario': ['brazil', 'inter-milan', 'real-madrid', 'barcelona', 'fc-barcelona', 'psv', 'ac-milan'],
  'Andrés Iniesta': ['spain', 'barcelona', 'fc-barcelona', 'vissel-kobe'],
  'Andres Iniesta': ['spain', 'barcelona', 'fc-barcelona', 'vissel-kobe'],
  'Iker Casillas': ['spain', 'real-madrid', 'porto', 'fc-porto'],
  'Gianluigi Buffon': ['italy', 'juventus', 'parma', 'paris-saint-germain'],
  'Paolo Maldini': ['italy', 'ac-milan'],
  'Andrea Pirlo': ['italy', 'ac-milan', 'juventus', 'inter-milan', 'brescia', 'nycfc'],
  'Francesco Totti': ['italy', 'as-roma', 'roma'],
  'Wayne Rooney': ['england', 'manchester-united', 'everton', 'dc-united'],
  'Steven Gerrard': ['england', 'liverpool', 'la-galaxy'],
  'Frank Lampard': ['england', 'chelsea', 'west-ham', 'manchester-city', 'nycfc'],
  'Didier Drogba': ['chelsea', 'marseille', 'galatasaray', 'ivory-coast'],
  'N\'Golo Kante': ['france', 'leicester-city', 'chelsea'],
  'Paul Pogba': ['france', 'juventus', 'manchester-united']
};

function isLegitimateAppearance(playerName, squadId) {
  const normName = playerName.trim();
  for (const [legend, allowedPatterns] of Object.entries(LEGEND_AFFILIATIONS)) {
    if (normName.toLowerCase() === legend.toLowerCase()) {
      return allowedPatterns.some(p => squadId.toLowerCase().includes(p.toLowerCase()));
    }
  }
  return true;
}

// 2. AUTHENTIC COMMON NAMES (STRICTLY NO FAMOUS SURNAMES)
const CLEAN_NAME_POOLS = {
  France: {
    first: ['Alexandre', 'Mathieu', 'Julien', 'Romain', 'Guillaume', 'Florian', 'Nicolas', 'Maxime', 'Lucas', 'Clement', 'Thomas', 'Quentin', 'Hugo', 'Pierre', 'Valentin', 'Alexis', 'Benjamin', 'Adrien', 'Arthur', 'Enzo', 'Leo', 'Theo', 'Corentin', 'Sebastien', 'Benoit', 'Remi', 'Tristan', 'Gaetan', 'Dorian', 'Axel'],
    last: ['Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard', 'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent', 'Mercier', 'Faure', 'Blanc', 'Guerin', 'Boyer', 'Garnier', 'Chevalier', 'Francois', 'Legrand', 'Gauthier', 'Perrin', 'Robin']
  },
  Spain: {
    first: ['Adrian', 'Pablo', 'Javier', 'Carlos', 'Marcos', 'Alvaro', 'Ruben', 'Diego', 'Manuel', 'Alejandro', 'Jorge', 'Victor', 'Guillermo', 'Ivan', 'Raul', 'Borja', 'Hector', 'Gonzalo', 'Mario', 'Sergio', 'Hugo', 'Daniel', 'Lucas', 'Oscar', 'Angel', 'Brais', 'Inigo', 'Unai', 'Aitor', 'Mikel'],
    last: ['Navarro', 'Serrano', 'Cano', 'Gil', 'Castillo', 'Vidal', 'Mendez', 'Garrido', 'Santos', 'Cortes', 'Lozano', 'Guerrero', 'Prieto', 'Molina', 'Ortiz', 'Delgado', 'Castro', 'Rubio', 'Marin', 'Sanz', 'Nunez', 'Medina', 'Iglesias', 'Cabrera', 'Calvo', 'Gallego', 'Vargas', 'Reyes', 'Campos', 'Vega']
  },
  England: {
    first: ['Jack', 'Harry', 'Oliver', 'George', 'Charlie', 'Jacob', 'Thomas', 'William', 'James', 'Daniel', 'Matthew', 'Joseph', 'Samuel', 'Alexander', 'Benjamin', 'Luke', 'Edward', 'Adam', 'Liam', 'Connor', 'Callum', 'Ryan', 'Nathan', 'Jordan', 'Aaron', 'Lewis', 'Harvey', 'Declan', 'Mason', 'Dean'],
    last: ['Walker', 'Wood', 'Watson', 'Brooks', 'Kelly', 'Price', 'Bennett', 'Woodward', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Butler', 'Simmons', 'Foster', 'Bryant', 'Russell', 'Griffin', 'Hayes', 'Myers', 'Ford', 'Graham', 'Fisher', 'Ellis', 'Harrison']
  },
  Germany: {
    first: ['Lukas', 'Felix', 'Niklas', 'Jan', 'Tim', 'Tobias', 'Jonas', 'Finn', 'Leon', 'Paul', 'Moritz', 'Simon', 'David', 'Fabian', 'Sebastian', 'Christian', 'Florian', 'Dominik', 'Marco', 'Daniel', 'Marc', 'Marvin', 'Stefan', 'Christoph', 'Philipp', 'Alexander', 'Maximilian', 'Julian', 'Nico', 'Robin'],
    last: ['Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schroder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Kruger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier', 'Lehmann', 'Schmid', 'Herrmann', 'Walter']
  },
  Italy: {
    first: ['Matteo', 'Luca', 'Davide', 'Simone', 'Lorenzo', 'Federico', 'Marco', 'Andrea', 'Fabio', 'Stefano', 'Michele', 'Gabriele', 'Christian', 'Daniele', 'Riccardo', 'Edoardo', 'Filippo', 'Tommaso', 'Nicola', 'Alessio', 'Giovanni', 'Pietro', 'Jacopo', 'Samuele', 'Alberto', 'Giacomo', 'Manuel', 'Gianluca', 'Diego', 'Massimo'],
    last: ['Ferrari', 'Russo', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Galli', 'Conti', 'De Luca', 'Costa', 'Giordano', 'Mancini', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferraro', 'Pellegrini', 'Marchetti', 'Leone', 'Gatti', 'Palumbo']
  },
  Brazil: {
    first: ['Lucas', 'Matheus', 'Gabriel', 'Guilherme', 'Leonardo', 'Felipe', 'Bruno', 'Gustavo', 'Vinicius', 'Rodrigo', 'Rafael', 'Diego', 'Thiago', 'Marcelo', 'Caio', 'Danilo', 'Igor', 'Eduardo', 'Andre', 'Renan', 'Vitor', 'Arthur', 'Henrique', 'Murilo', 'Alex', 'Douglas', 'Leandro', 'Fabio', 'Otavio', 'Breno'],
    last: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Carvalho', 'Martins', 'Araujo', 'Melo', 'Barbosa', 'Ramos', 'Teixeira', 'Rocha', 'Dias', 'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Barros', 'Santana']
  },
  Argentina: {
    first: ['Lucas', 'Mateo', 'Joaquin', 'Nicolas', 'Tomas', 'Facundo', 'Santiago', 'Ignacio', 'Valentin', 'Agustin', 'Franco', 'Martin', 'Bautista', 'Lautaro', 'Ramiro', 'Gonzalo', 'Matias', 'Julian', 'Nahuel', 'Ezequiel', 'Luciano', 'Mauro', 'Maximiliano', 'Federico', 'Alejo', 'Leandro', 'Rodrigo', 'Cristian', 'Esteban', 'Damian'],
    last: ['Lopez', 'Gonzalez', 'Rodriguez', 'Garcia', 'Martinez', 'Perez', 'Alvarez', 'Gomez', 'Sanchez', 'Diaz', 'Vazquez', 'Romero', 'Herrera', 'Medina', 'Castillo', 'Morales', 'Rios', 'Sosa', 'Gutierrez', 'Mendez', 'Benitez', 'Flores', 'Aguilar', 'Acuna', 'Rojas', 'Molina', 'Suarez', 'Blanco', 'Gimenez', 'Ferrer']
  }
};

function getRandomCleanName(country, usedNames) {
  const pool = CLEAN_NAME_POOLS[country] || CLEAN_NAME_POOLS['Spain'];
  let attempts = 0;
  while (attempts < 200) {
    const first = pool.first[Math.floor(Math.random() * pool.first.length)];
    const last = pool.last[Math.floor(Math.random() * pool.last.length)];
    const name = `${first} ${last}`;
    if (!usedNames.has(name)) {
      usedNames.add(name);
      return name;
    }
    attempts++;
  }
  const fallback = `${pool.first[attempts % pool.first.length]} ${pool.last[(attempts * 2) % pool.last.length]}`;
  usedNames.add(fallback);
  return fallback;
}

// 3. HANDCRAFTED REAL SQUADS FOR MODERN LA LIGA
const REAL_SQUADS = {
  'real-betis-2022-23': {
    id: 'real-betis-2022-23',
    clubName: 'Real Betis',
    year: '2022-23',
    fullName: 'Real Betis 2022-23 (Copa Champions & Top 6)',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#0BB364',
    accentColor: '#FFFFFF',
    primaryTactic: 'Tiki-Taka',
    tier: 'high',
    players: [
      // Starting XI
      { name: 'Rui Silva', country: 'Portugal', pos: 'GK', spec: 'GK', ovr: 82, pac: 52, sho: 20, pas: 74, dri: 50, def: 83, phy: 80, com: 83 },
      { name: 'Juan Miranda', country: 'Spain', pos: 'DEF', spec: 'LB', ovr: 79, pac: 80, sho: 62, pas: 75, dri: 76, def: 77, phy: 75, com: 78 },
      { name: 'Germán Pezzella', country: 'Argentina', pos: 'DEF', spec: 'CB', ovr: 82, pac: 68, sho: 45, pas: 72, dri: 65, def: 84, phy: 85, com: 84, aura: { id: 'pezzella-aerial', name: 'Aerial Sentinel', description: '+15% aerial duel win rate and clearances.', shortDesc: '+15% aerial', rarity: 'Rare' } },
      { name: 'Luiz Felipe', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 81, pac: 75, sho: 40, pas: 70, dri: 68, def: 82, phy: 82, com: 80 },
      { name: 'Youssouf Sabaly', country: 'Senegal', pos: 'DEF', spec: 'RB', ovr: 79, pac: 83, sho: 55, pas: 74, dri: 78, def: 77, phy: 76, com: 78 },
      { name: 'Guido Rodríguez', country: 'Argentina', pos: 'MID', spec: 'CDM', ovr: 84, pac: 68, sho: 65, pas: 80, dri: 76, def: 86, phy: 85, com: 85, aura: { id: 'guido-enforcer', name: 'The Enforcer', description: '+10% turnover pressure in midfield duels.', shortDesc: '+10% press', rarity: 'Rare' } },
      { name: 'William Carvalho', country: 'Portugal', pos: 'MID', spec: 'CM', ovr: 82, pac: 58, sho: 70, pas: 84, dri: 82, def: 80, phy: 86, com: 86 },
      { name: 'Sergio Canales', country: 'Spain', pos: 'MID', spec: 'CAM', ovr: 85, pac: 78, sho: 82, pas: 88, dri: 86, def: 62, phy: 73, com: 88, aura: { id: 'canales-vision', name: 'Deep Playmaker', description: '+12% key pass creation on transition.', shortDesc: '+12% vision', rarity: 'Epic' } },
      { name: 'Nabil Fekir', country: 'France', pos: 'MID', spec: 'CAM', ovr: 86, pac: 80, sho: 84, pas: 86, dri: 89, def: 42, phy: 82, com: 89, aura: { id: 'fekir-flair', name: '1v1 Specialist', description: '+12% take-on success in attacking third.', shortDesc: '+12% take-on', rarity: 'Rare' } },
      { name: 'Juanmi', country: 'Spain', pos: 'FWD', spec: 'LW', ovr: 80, pac: 82, sho: 80, pas: 74, dri: 81, def: 38, phy: 68, com: 80 },
      { name: 'Borja Iglesias', country: 'Spain', pos: 'FWD', spec: 'ST', ovr: 83, pac: 78, sho: 85, pas: 72, dri: 79, def: 38, phy: 84, com: 85, aura: { id: 'panda-poacher', name: 'Clinical Poacher', description: '+12% finishing accuracy inside the box.', shortDesc: '+12% box xG', rarity: 'Epic' } },
      // Bench & Depth
      { name: 'Claudio Bravo', country: 'Chile', pos: 'GK', spec: 'GK', ovr: 80, pac: 50, sho: 20, pas: 78, dri: 52, def: 81, phy: 76, com: 85 },
      { name: 'Álex Moreno', country: 'Spain', pos: 'DEF', spec: 'LB', ovr: 80, pac: 88, sho: 65, pas: 76, dri: 80, def: 76, phy: 74, com: 78 },
      { name: 'Edgar González', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 78, pac: 66, sho: 40, pas: 72, dri: 65, def: 79, phy: 80, com: 77 },
      { name: 'Aitor Ruibal', country: 'Spain', pos: 'DEF', spec: 'RB', ovr: 78, pac: 84, sho: 70, pas: 74, dri: 78, def: 75, phy: 76, com: 77 },
      { name: 'Andrés Guardado', country: 'Mexico', pos: 'MID', spec: 'CM', ovr: 78, pac: 65, sho: 72, pas: 82, dri: 78, def: 74, phy: 72, com: 84 },
      { name: 'Rodri Sánchez', country: 'Spain', pos: 'MID', spec: 'CAM', ovr: 78, pac: 80, sho: 73, pas: 80, dri: 82, def: 45, phy: 65, com: 78 },
      { name: 'Ayoze Pérez', country: 'Spain', pos: 'FWD', spec: 'LW', ovr: 80, pac: 81, sho: 80, pas: 76, dri: 82, def: 42, phy: 68, com: 80 },
      { name: 'Joaquín', country: 'Spain', pos: 'FWD', spec: 'RW', ovr: 81, pac: 72, sho: 77, pas: 82, dri: 84, def: 38, phy: 66, com: 88, aura: { id: 'joaquin-architect', name: 'Dead-Ball Architect', description: '+12% conversion from direct set-pieces.', shortDesc: '+12% set-piece', rarity: 'Rare' } },
      { name: 'Willian José', country: 'Brazil', pos: 'FWD', spec: 'ST', ovr: 79, pac: 72, sho: 80, pas: 72, dri: 76, def: 35, phy: 80, com: 78 },
      { name: 'Abner Vinícius', country: 'Brazil', pos: 'DEF', spec: 'LB', ovr: 76, pac: 82, sho: 55, pas: 70, dri: 74, def: 74, phy: 74, com: 74 },
      { name: 'Víctor Ruiz', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 76, pac: 60, sho: 40, pas: 68, dri: 62, def: 78, phy: 76, com: 76 },
      { name: 'Paul Akouokou', country: 'Ivory Coast', pos: 'MID', spec: 'CDM', ovr: 75, pac: 65, sho: 55, pas: 72, dri: 72, def: 77, phy: 82, com: 74 },
      { name: 'Dani Martín', country: 'Spain', pos: 'GK', spec: 'GK', ovr: 73, pac: 50, sho: 20, pas: 64, dri: 48, def: 74, phy: 72, com: 74 }
    ]
  },
  'real-sociedad-2022-23': {
    id: 'real-sociedad-2022-23',
    clubName: 'Real Sociedad',
    year: '2022-23',
    fullName: 'Real Sociedad 2022-23 (Champions League Return)',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#0067B1',
    accentColor: '#FFFFFF',
    primaryTactic: 'Tiki-Taka',
    tier: 'high',
    players: [
      { name: 'Álex Remiro', country: 'Spain', pos: 'GK', spec: 'GK', ovr: 83, pac: 52, sho: 20, pas: 76, dri: 52, def: 84, phy: 80, com: 84 },
      { name: 'Aihen Muñoz', country: 'Spain', pos: 'DEF', spec: 'LB', ovr: 78, pac: 81, sho: 52, pas: 74, dri: 75, def: 77, phy: 74, com: 76 },
      { name: 'Robin Le Normand', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 83, pac: 72, sho: 40, pas: 72, dri: 66, def: 85, phy: 84, com: 83, aura: { id: 'lenormand-block', name: 'Defensive Colossus', description: '+12% box block rate and deflection.', shortDesc: '+12% blocks', rarity: 'Epic' } },
      { name: 'Igor Zubeldia', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 80, pac: 68, sho: 50, pas: 76, dri: 70, def: 81, phy: 81, com: 80 },
      { name: 'Andoni Gorosabel', country: 'Spain', pos: 'DEF', spec: 'RB', ovr: 78, pac: 82, sho: 52, pas: 74, dri: 76, def: 77, phy: 75, com: 77 },
      { name: 'Martín Zubimendi', country: 'Spain', pos: 'MID', spec: 'CDM', ovr: 84, pac: 72, sho: 68, pas: 84, dri: 82, def: 84, phy: 80, com: 86, aura: { id: 'zubi-metro', name: 'Midfield Metronome', description: '+8% passing accuracy and possession control.', shortDesc: '+8% tempo', rarity: 'Epic' } },
      { name: 'Mikel Merino', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 84, pac: 72, sho: 77, pas: 83, dri: 82, def: 82, phy: 86, com: 85 },
      { name: 'David Silva', country: 'Spain', pos: 'MID', spec: 'CAM', ovr: 83, pac: 68, sho: 76, pas: 88, dri: 87, def: 52, phy: 60, com: 90, aura: { id: 'silva-vision', name: 'Deep Playmaker', description: '+12% key pass creation on counter.', shortDesc: '+12% vision', rarity: 'Epic' } },
      { name: 'Takefusa Kubo', country: 'Japan', pos: 'FWD', spec: 'RW', ovr: 82, pac: 86, sho: 78, pas: 81, dri: 87, def: 42, phy: 64, com: 80, aura: { id: 'kubo-dribble', name: '1v1 Specialist', description: '+12% take-on success rate on wing.', shortDesc: '+12% take-on', rarity: 'Rare' } },
      { name: 'Mikel Oyarzabal', country: 'Spain', pos: 'FWD', spec: 'LW', ovr: 85, pac: 82, sho: 84, pas: 83, dri: 85, def: 50, phy: 75, com: 88, aura: { id: 'oyarzabal-deadball', name: 'Dead-Ball Architect', description: '+12% set-piece conversion.', shortDesc: '+12% set-piece', rarity: 'Rare' } },
      { name: 'Alexander Sørloth', country: 'Norway', pos: 'FWD', spec: 'ST', ovr: 81, pac: 82, sho: 82, pas: 70, dri: 77, def: 35, phy: 87, com: 81 },
      { name: 'Unai Marrero', country: 'Spain', pos: 'GK', spec: 'GK', ovr: 74, pac: 50, sho: 20, pas: 65, dri: 48, def: 75, phy: 73, com: 73 },
      { name: 'Aritz Elustondo', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 79, pac: 72, sho: 45, pas: 70, dri: 65, def: 80, phy: 80, com: 78 },
      { name: 'Diego Rico', country: 'Spain', pos: 'DEF', spec: 'LB', ovr: 77, pac: 78, sho: 58, pas: 72, dri: 73, def: 76, phy: 76, com: 76 },
      { name: 'Jon Pacheco', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 76, pac: 68, sho: 38, pas: 72, dri: 65, def: 78, phy: 77, com: 76 },
      { name: 'Asier Illarramendi', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 77, pac: 64, sho: 70, pas: 80, dri: 77, def: 75, phy: 74, com: 82 },
      { name: 'Brais Méndez', country: 'Spain', pos: 'MID', spec: 'CAM', ovr: 82, pac: 75, sho: 80, pas: 82, dri: 82, def: 65, phy: 74, com: 82 },
      { name: 'Beñat Turrientes', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 76, pac: 72, sho: 68, pas: 78, dri: 77, def: 72, phy: 72, com: 76 },
      { name: 'Robert Navarro', country: 'Spain', pos: 'MID', spec: 'CAM', ovr: 76, pac: 80, sho: 72, pas: 76, dri: 81, def: 40, phy: 62, com: 76 },
      { name: 'Mohamed-Ali Cho', country: 'France', pos: 'FWD', spec: 'RW', ovr: 76, pac: 88, sho: 72, pas: 68, dri: 80, def: 35, phy: 66, com: 74 },
      { name: 'Carlos Fernández', country: 'Spain', pos: 'FWD', spec: 'ST', ovr: 77, pac: 76, sho: 78, pas: 72, dri: 76, def: 38, phy: 78, com: 76 },
      { name: 'Ander Barrenetxea', country: 'Spain', pos: 'FWD', spec: 'LW', ovr: 78, pac: 84, sho: 74, pas: 75, dri: 82, def: 40, phy: 68, com: 78 },
      { name: 'Jon Karrikaburu', country: 'Spain', pos: 'FWD', spec: 'ST', ovr: 74, pac: 78, sho: 76, pas: 64, dri: 72, def: 32, phy: 76, com: 74 },
      { name: 'Urko González', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 73, pac: 64, sho: 35, pas: 68, dri: 62, def: 74, phy: 76, com: 73 }
    ]
  }
};

// 4. SMART DIVERSE TALISMAN SELECTION
// Rather than scanning left-to-right (which lands on index 5 = CDM!), pick talisman position dynamically:
// Striker (35%), CAM Playmaker (25%), Electric Winger (20%), Dynamic Box-to-Box (12%), Central Defender (8%)
function selectSmartTalisman(squad) {
  // Use a pseudo-random seed from squad ID so it is deterministic per club/season
  let seed = 0;
  for (let i = 0; i < squad.id.length; i++) {
    seed = (seed * 31 + squad.id.charCodeAt(i)) % 1000;
  }

  const starters = squad.players.slice(0, 11);
  const roll = seed % 100;

  let candidate = null;
  if (roll < 35) {
    // Top Goalscorer / Striker
    candidate = starters.find(p => p.specificPosition === 'ST' || p.specificPosition === 'CF') || starters[9];
  } else if (roll < 60) {
    // Star Playmaker / Number 10
    candidate = starters.find(p => p.specificPosition === 'CAM') || starters[7];
  } else if (roll < 80) {
    // Electric Winger
    candidate = starters.find(p => p.specificPosition === 'LW' || p.specificPosition === 'RW' || p.specificPosition === 'LM' || p.specificPosition === 'RM') || starters[8] || starters[10];
  } else if (roll < 92) {
    // Dynamic Box-to-Box / Engine
    candidate = starters.find(p => p.specificPosition === 'CM') || starters[6];
  } else {
    // Rock-Solid Center Back or World-Class GK
    candidate = starters.find(p => p.specificPosition === 'CB') || starters[2];
  }

  return candidate || starters[9] || starters[0];
}

// 5. PROCESS ALL SQUADS
console.log('--- PURGING FAKE LEGENDS & REBALANCING TALISMAN DIVERSITY ---');

const chunkFiles = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.json'));
const allProcessedSquads = [];

let totalFakeLegendsReplaced = 0;
let talismansByPosition = { ST: 0, CAM: 0, Winger: 0, CM: 0, CDM: 0, CB: 0, GK: 0, Other: 0 };
let talismanOvrCounts = {};

for (const file of chunkFiles) {
  const filePath = path.join(CHUNKS_DIR, file);
  const squads = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (let sIdx = 0; sIdx < squads.length; sIdx++) {
    let s = squads[sIdx];

    // If we have a handcrafted real squad (e.g. Real Betis 2022-23), swap it in!
    if (REAL_SQUADS[s.id]) {
      const real = REAL_SQUADS[s.id];
      s.clubName = real.clubName;
      s.fullName = real.fullName;
      s.year = real.year;
      s.tier = real.tier;
      s.badgeColor = real.badgeColor;
      s.accentColor = real.accentColor;
      s.primaryTactic = real.primaryTactic;
      s.players = real.players.map((p, pIdx) => ({
        id: `${s.id}-p${pIdx + 1}`,
        name: p.name,
        clubYear: real.fullName,
        clubName: real.clubName,
        year: real.year,
        country: p.country,
        league: s.league,
        position: p.pos,
        specificPosition: p.spec,
        overall: p.ovr,
        pace: p.pac,
        shooting: p.sho,
        passing: p.pas,
        dribbling: p.dri,
        defending: p.def,
        physical: p.phy,
        composure: p.com,
        auraTrait: p.aura || undefined
      }));
      console.log(`[HANDCRAFTED] Injected real squad for: ${s.fullName}`);
    }

    const tier = s.tier || 'mid';
    const usedNames = new Set(s.players.map(p => p.name));

    // A. PURGE FALSE LEGENDS
    s.players.forEach(p => {
      // Check if player name matches any legend on a non-affiliated team
      if (!isLegitimateAppearance(p.name, s.id)) {
        totalFakeLegendsReplaced++;
        const oldName = p.name;
        usedNames.delete(oldName);
        p.name = getRandomCleanName(p.country || 'Spain', usedNames);
      }

      // Also clean up any accidental generic hybrid legend names
      const legendSurnames = ['Zidane', 'Messi', 'Maradona', 'Henry', 'Mbappe', 'Pelé', 'Cruyff'];
      for (const legSur of legendSurnames) {
        if (new RegExp('\\b' + legSur + '\\b', 'i').test(p.name) && !isLegitimateAppearance(p.name, s.id)) {
          totalFakeLegendsReplaced++;
          usedNames.delete(p.name);
          p.name = getRandomCleanName(p.country || 'Spain', usedNames);
          break;
        }
      }
    });

    // B. DIVERSE TALISMAN ALLOCATION & REALISTIC OVERALL VARIANCE
    // Calculate deterministic variance (0 to 3) based on squad ID hash
    let hashVal = 0;
    for (let c = 0; c < s.id.length; c++) hashVal = (hashVal * 23 + s.id.charCodeAt(c)) % 100;

    let targetTalismanOvr = 88;
    if (tier === 'elite') {
      targetTalismanOvr = 91 + (hashVal % 5); // 91 to 95 OVR
    } else if (tier === 'high') {
      targetTalismanOvr = 87 + (hashVal % 4); // 87 to 90 OVR (NO LONGER FLAT 88!)
    } else if (tier === 'mid') {
      targetTalismanOvr = 83 + (hashVal % 4); // 83 to 86 OVR
    } else {
      targetTalismanOvr = 81 + (hashVal % 3); // 81 to 83 OVR
    }

    talismanOvrCounts[targetTalismanOvr] = (talismanOvrCounts[targetTalismanOvr] || 0) + 1;

    // Pick smart talisman
    const talisman = selectSmartTalisman(s);
    talisman.overall = Math.max(talisman.overall, targetTalismanOvr);

    // Track tally by position
    const spec = talisman.specificPosition;
    if (spec === 'ST' || spec === 'CF') talismansByPosition.ST++;
    else if (spec === 'CAM') talismansByPosition.CAM++;
    else if (spec.includes('W') || spec === 'LM' || spec === 'RM') talismansByPosition.Winger++;
    else if (spec === 'CM') talismansByPosition.CM++;
    else if (spec === 'CDM') talismansByPosition.CDM++;
    else if (spec === 'CB') talismansByPosition.CB++;
    else if (spec === 'GK') talismansByPosition.GK++;
    else talismansByPosition.Other++;

    // Scale talisman sub-attributes
    const ovr = talisman.overall;
    if (talisman.position === 'FWD') {
      talisman.shooting = Math.max(talisman.shooting, ovr + 2);
      talisman.dribbling = Math.max(talisman.dribbling, ovr);
      talisman.pace = Math.max(talisman.pace, spec.includes('W') ? ovr + 4 : ovr - 1);
      talisman.composure = Math.max(talisman.composure, ovr);
      talisman.passing = Math.max(talisman.passing, ovr - 6);
    } else if (talisman.position === 'MID') {
      talisman.passing = Math.max(talisman.passing, ovr + 2);
      talisman.dribbling = Math.max(talisman.dribbling, ovr);
      talisman.shooting = Math.max(talisman.shooting, spec === 'CAM' ? ovr : ovr - 6);
      talisman.composure = Math.max(talisman.composure, ovr);
      talisman.pace = Math.max(talisman.pace, ovr - 3);
    } else if (talisman.position === 'DEF') {
      talisman.defending = Math.max(talisman.defending, ovr + 2);
      talisman.physical = Math.max(talisman.physical, ovr + 1);
      talisman.composure = Math.max(talisman.composure, ovr);
    }

    // Give talisman an Aura if missing
    if (!talisman.auraTrait) {
      if (talisman.position === 'FWD') {
        talisman.auraTrait = { id: `${talisman.id}-poacher`, name: 'Clinical Poacher', description: '+12% finishing accuracy inside the box.', shortDesc: '+12% box xG', rarity: 'Epic' };
      } else if (talisman.position === 'MID') {
        talisman.auraTrait = { id: `${talisman.id}-playmaker`, name: 'Deep Playmaker', description: '+12% key pass creation on counter attacks.', shortDesc: '+12% vision', rarity: 'Epic' };
      } else {
        talisman.auraTrait = { id: `${talisman.id}-colossus`, name: 'Defensive Colossus', description: '+12% central box block rate and shot deflection.', shortDesc: '+12% blocks', rarity: 'Epic' };
      }
    }

    // Scale starter variance (so starters aren't flat identical numbers)
    s.players.slice(0, 11).forEach((p, idx) => {
      if (p.id !== talisman.id) {
        const starterBase = tier === 'elite' ? 86 : (tier === 'high' ? 82 : (tier === 'mid' ? 78 : 76));
        // Individual player variance between -2 and +3
        const delta = ((hashVal + idx * 7) % 5) - 2;
        p.overall = Math.max(68, starterBase + delta);
      }
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(squads, null, 2), 'utf8');
  allProcessedSquads.push(...squads);
}

console.log(`Replaced ${totalFakeLegendsReplaced} illegitimate legend appearances.`);
console.log('Talisman breakdown by position (No more CDM monopoly!):', talismansByPosition);
console.log('Talisman overall distribution (No more flat 88!):', talismanOvrCounts);

// Write squads.json
fs.writeFileSync(SQUADS_JSON_PATH, JSON.stringify(allProcessedSquads, null, 2), 'utf8');

// Update catalog
const catalog = allProcessedSquads.map(s => ({
  id: s.id,
  clubName: s.clubName,
  year: s.year,
  fullName: s.fullName,
  type: s.type,
  league: s.league,
  countryCode: s.countryCode,
  badgeColor: s.badgeColor,
  accentColor: s.accentColor,
  primaryTactic: s.primaryTactic,
  chunkId: s.chunkId,
  playerCount: s.players.length,
  tier: s.tier
}));
fs.writeFileSync(CATALOG_JSON_PATH, JSON.stringify(catalog, null, 2), 'utf8');

console.log('--- REBALANCING AND SQUAD PURGE COMPLETE ---');
