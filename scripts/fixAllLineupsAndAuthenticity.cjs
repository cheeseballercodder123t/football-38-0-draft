const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = path.join(__dirname, '../src/data/chunks');
const SQUADS_JSON_PATH = path.join(__dirname, '../src/data/squads.json');
const CATALOG_JSON_PATH = path.join(__dirname, '../src/data/squadCatalog.json');

// 1. GENUINE LEGENDS WHITELIST
const LEGEND_AFFILIATIONS = {
  'Zinedine Zidane': ['france', 'real-madrid-2001', 'real-madrid-2002', 'real-madrid-2003', 'real-madrid-2004', 'real-madrid-2005', 'real-madrid-2006', 'juventus-1996', 'juventus-1997', 'juventus-1998', 'juventus-1999', 'juventus-2000', 'juventus-2001'],
  'Lionel Messi': ['barcelona', 'fc-barcelona', 'argentina', 'paris-saint-germain', 'inter-miami'],
  'Cristiano Ronaldo': ['portugal', 'manchester-united', 'real-madrid', 'juventus', 'sporting'],
  'Diego Maradona': ['argentina', 'napoli', 'ssc-napoli', 'barcelona', 'boca'],
  'Thierry Henry': ['arsenal', 'france', 'barcelona', 'fc-barcelona', 'monaco'],
  'Kylian Mbappé': ['france', 'monaco', 'as-monaco', 'paris-saint-germain', 'real-madrid'],
  'Kylian Mbappe': ['france', 'monaco', 'as-monaco', 'paris-saint-germain', 'real-madrid'],
  'Karim Benzema': ['france', 'real-madrid', 'lyon', 'olympique-lyonnais'],
  'Ronaldinho': ['brazil', 'barcelona', 'fc-barcelona', 'paris-saint-germain', 'ac-milan'],
  'Ronaldo R9': ['brazil', 'inter-milan', 'real-madrid', 'barcelona', 'fc-barcelona', 'psv', 'ac-milan'],
  'Andrés Iniesta': ['spain', 'barcelona', 'fc-barcelona'],
  'Andres Iniesta': ['spain', 'barcelona', 'fc-barcelona'],
  'Iker Casillas': ['spain', 'real-madrid', 'porto', 'fc-porto'],
  'Gianluigi Buffon': ['italy', 'juventus', 'parma'],
  'Paolo Maldini': ['italy', 'ac-milan'],
  'Andrea Pirlo': ['italy', 'ac-milan', 'juventus', 'inter-milan', 'brescia'],
  'Francesco Totti': ['italy', 'as-roma', 'roma'],
  'Wayne Rooney': ['england', 'manchester-united', 'everton'],
  'Steven Gerrard': ['england', 'liverpool'],
  'Frank Lampard': ['england', 'chelsea', 'west-ham', 'manchester-city']
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

// 2. CLEAN NAME POOLS
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

// 3. REAL SQUADS (AUTHENTIC 24-MAN ROSTERS FOR LA LIGA CONTENDERS)
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
  'villarreal-cf-2022-23': {
    id: 'villarreal-cf-2022-23',
    clubName: 'Villarreal CF',
    year: '2022-23',
    fullName: 'Villarreal CF 2022-23 (Yellow Submarine)',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#FFE600',
    accentColor: '#00509B',
    primaryTactic: 'Tiki-Taka',
    tier: 'high',
    players: [
      { name: 'Gerónimo Rulli', country: 'Argentina', pos: 'GK', spec: 'GK', ovr: 82, pac: 52, sho: 20, pas: 75, dri: 50, def: 83, phy: 79, com: 83 },
      { name: 'Alfonso Pedraza', country: 'Spain', pos: 'DEF', spec: 'LB', ovr: 80, pac: 84, sho: 68, pas: 76, dri: 78, def: 78, phy: 79, com: 78 },
      { name: 'Pau Torres', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 84, pac: 74, sho: 45, pas: 82, dri: 76, def: 85, phy: 80, com: 86, aura: { id: 'pau-playmaker', name: 'Deep Playmaker', description: '+12% key pass creation from defense.', shortDesc: '+12% vision', rarity: 'Epic' } },
      { name: 'Raúl Albiol', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 81, pac: 64, sho: 40, pas: 70, dri: 64, def: 83, phy: 82, com: 84 },
      { name: 'Juan Foyth', country: 'Argentina', pos: 'DEF', spec: 'RB', ovr: 81, pac: 78, sho: 50, pas: 74, dri: 76, def: 83, phy: 82, com: 81 },
      { name: 'Etienne Capoue', country: 'France', pos: 'MID', spec: 'CDM', ovr: 81, pac: 68, sho: 70, pas: 78, dri: 76, def: 82, phy: 84, com: 82 },
      { name: 'Dani Parejo', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 85, pac: 52, sho: 82, pas: 90, dri: 82, def: 74, phy: 70, com: 89, aura: { id: 'parejo-metro', name: 'Midfield Metronome', description: '+8% passing accuracy and possession retention.', shortDesc: '+8% tempo', rarity: 'Epic' } },
      { name: 'Álex Baena', country: 'Spain', pos: 'MID', spec: 'CAM', ovr: 82, pac: 78, sho: 80, pas: 84, dri: 83, def: 60, phy: 72, com: 82 },
      { name: 'Samuel Chukwueze', country: 'Nigeria', pos: 'FWD', spec: 'RW', ovr: 82, pac: 91, sho: 78, pas: 76, dri: 87, def: 38, phy: 68, com: 79, aura: { id: 'chuku-burst', name: 'Counter Burst', description: '+14% transition pace and rapid breakaway.', shortDesc: '+14% break pace', rarity: 'Rare' } },
      { name: 'Yeremy Pino', country: 'Spain', pos: 'FWD', spec: 'LW', ovr: 80, pac: 84, sho: 78, pas: 76, dri: 83, def: 42, phy: 66, com: 80 },
      { name: 'Gerard Moreno', country: 'Spain', pos: 'FWD', spec: 'ST', ovr: 86, pac: 80, sho: 87, pas: 83, dri: 85, def: 45, phy: 75, com: 88, aura: { id: 'gerard-poacher', name: 'Clinical Poacher', description: '+12% finishing accuracy inside the 18-yard box.', shortDesc: '+12% box xG', rarity: 'Epic' } },
      { name: 'Pepe Reina', country: 'Spain', pos: 'GK', spec: 'GK', ovr: 77, pac: 48, sho: 20, pas: 76, dri: 50, def: 78, phy: 75, com: 84 },
      { name: 'Aïssa Mandi', country: 'Algeria', pos: 'DEF', spec: 'CB', ovr: 78, pac: 68, sho: 45, pas: 72, dri: 66, def: 79, phy: 79, com: 78 },
      { name: 'Jorge Cuenca', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 77, pac: 70, sho: 38, pas: 72, dri: 65, def: 78, phy: 79, com: 77 },
      { name: 'Kiko Femenía', country: 'Spain', pos: 'DEF', spec: 'RB', ovr: 77, pac: 80, sho: 55, pas: 73, dri: 75, def: 75, phy: 74, com: 76 },
      { name: 'Francis Coquelin', country: 'France', pos: 'MID', spec: 'CDM', ovr: 79, pac: 70, sho: 64, pas: 76, dri: 76, def: 81, phy: 80, com: 79 },
      { name: 'Manu Trigueros', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 78, pac: 66, sho: 74, pas: 82, dri: 78, def: 70, phy: 70, com: 80 },
      { name: 'Giovani Lo Celso', country: 'Argentina', pos: 'MID', spec: 'CAM', ovr: 81, pac: 78, sho: 78, pas: 83, dri: 84, def: 65, phy: 72, com: 82 },
      { name: 'José Luis Morales', country: 'Spain', pos: 'FWD', spec: 'ST', ovr: 79, pac: 83, sho: 80, pas: 74, dri: 80, def: 40, phy: 70, com: 81 },
      { name: 'Nicolas Jackson', country: 'Senegal', pos: 'FWD', spec: 'ST', ovr: 80, pac: 88, sho: 80, pas: 72, dri: 82, def: 35, phy: 78, com: 78 },
      { name: 'Alberto Moreno', country: 'Spain', pos: 'DEF', spec: 'LB', ovr: 77, pac: 84, sho: 66, pas: 74, dri: 77, def: 73, phy: 72, com: 76 },
      { name: 'Ramon Terrats', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 76, pac: 70, sho: 68, pas: 78, dri: 76, def: 74, phy: 74, com: 76 },
      { name: 'Filip Jörgensen', country: 'Denmark', pos: 'GK', spec: 'GK', ovr: 75, pac: 50, sho: 20, pas: 68, dri: 50, def: 76, phy: 74, com: 75 },
      { name: 'Diego Collado', country: 'Spain', pos: 'FWD', spec: 'RW', ovr: 74, pac: 82, sho: 72, pas: 68, dri: 76, def: 32, phy: 66, com: 74 }
    ]
  },
  'sevilla-fc-2022-23': {
    id: 'sevilla-fc-2022-23',
    clubName: 'Sevilla FC',
    year: '2022-23',
    fullName: 'Sevilla FC 2022-23 (7th Europa League Title)',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#D4001F',
    accentColor: '#FFFFFF',
    primaryTactic: 'Direct Vertical',
    tier: 'high',
    players: [
      { name: 'Yassine Bounou Bono', country: 'Morocco', pos: 'GK', spec: 'GK', ovr: 85, pac: 52, sho: 20, pas: 76, dri: 52, def: 86, phy: 82, com: 88, aura: { id: 'bono-psyche', name: 'Penalty Psyche', description: '+14% penalty and 1v1 save probability.', shortDesc: '+14% 1v1 saves', rarity: 'Epic' } },
      { name: 'Marcos Acuña', country: 'Argentina', pos: 'DEF', spec: 'LB', ovr: 83, pac: 80, sho: 74, pas: 82, dri: 82, def: 80, phy: 84, com: 84 },
      { name: 'Loïc Badé', country: 'France', pos: 'DEF', spec: 'CB', ovr: 80, pac: 74, sho: 40, pas: 70, dri: 66, def: 82, phy: 84, com: 80 },
      { name: 'Nemanja Gudelj', country: 'Serbia', pos: 'DEF', spec: 'CB', ovr: 80, pac: 68, sho: 74, pas: 78, dri: 72, def: 81, phy: 85, com: 81 },
      { name: 'Jesús Navas', country: 'Spain', pos: 'DEF', spec: 'RB', ovr: 81, pac: 82, sho: 68, pas: 81, dri: 82, def: 77, phy: 72, com: 86, aura: { id: 'navas-overlap', name: 'Overlap Engine', description: '+12% accurate crossing delivery from wide areas.', shortDesc: '+12% crosses', rarity: 'Rare' } },
      { name: 'Fernando', country: 'Brazil', pos: 'MID', spec: 'CDM', ovr: 81, pac: 65, sho: 62, pas: 78, dri: 75, def: 84, phy: 82, com: 83 },
      { name: 'Ivan Rakitić', country: 'Croatia', pos: 'MID', spec: 'CM', ovr: 82, pac: 56, sho: 82, pas: 88, dri: 80, def: 74, phy: 75, com: 88, aura: { id: 'rakitic-deadball', name: 'Dead-Ball Architect', description: '+12% conversion from direct and indirect set-pieces.', shortDesc: '+12% set-piece', rarity: 'Rare' } },
      { name: 'Óliver Torres', country: 'Spain', pos: 'MID', spec: 'CAM', ovr: 79, pac: 76, sho: 72, pas: 82, dri: 83, def: 58, phy: 66, com: 80 },
      { name: 'Lucas Ocampos', country: 'Argentina', pos: 'FWD', spec: 'LW', ovr: 81, pac: 84, sho: 80, pas: 76, dri: 82, def: 62, phy: 84, com: 82 },
      { name: 'Erik Lamela', country: 'Argentina', pos: 'FWD', spec: 'RW', ovr: 80, pac: 78, sho: 80, pas: 80, dri: 84, def: 52, phy: 74, com: 82 },
      { name: 'Youssef En-Nesyri', country: 'Morocco', pos: 'FWD', spec: 'ST', ovr: 84, pac: 86, sho: 84, pas: 68, dri: 78, def: 42, phy: 86, com: 83, aura: { id: 'ennesyri-aerial', name: 'Aerial Sentinel', description: '+15% aerial duel conversion and headers.', shortDesc: '+15% aerial', rarity: 'Rare' } },
      { name: 'Marko Dmitrović', country: 'Serbia', pos: 'GK', spec: 'GK', ovr: 78, pac: 48, sho: 20, pas: 70, dri: 50, def: 79, phy: 78, com: 79 },
      { name: 'Gonzalo Montiel', country: 'Argentina', pos: 'DEF', spec: 'RB', ovr: 79, pac: 80, sho: 60, pas: 74, dri: 76, def: 78, phy: 78, com: 82 },
      { name: 'Karim Rekik', country: 'Netherlands', pos: 'DEF', spec: 'CB', ovr: 77, pac: 68, sho: 40, pas: 68, dri: 64, def: 78, phy: 80, com: 76 },
      { name: 'Alex Telles', country: 'Brazil', pos: 'DEF', spec: 'LB', ovr: 79, pac: 82, sho: 72, pas: 80, dri: 79, def: 75, phy: 74, com: 78 },
      { name: 'Pape Gueye', country: 'Senegal', pos: 'MID', spec: 'CDM', ovr: 78, pac: 72, sho: 68, pas: 76, dri: 76, def: 79, phy: 83, com: 77 },
      { name: 'Joan Jordán', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 78, pac: 68, sho: 74, pas: 80, dri: 78, def: 75, phy: 76, com: 79 },
      { name: 'Suso', country: 'Spain', pos: 'MID', spec: 'CAM', ovr: 79, pac: 70, sho: 80, pas: 84, dri: 84, def: 40, phy: 62, com: 82 },
      { name: 'Papu Gómez', country: 'Argentina', pos: 'MID', spec: 'CAM', ovr: 80, pac: 76, sho: 78, pas: 83, dri: 86, def: 42, phy: 60, com: 82 },
      { name: 'Bryan Gil', country: 'Spain', pos: 'FWD', spec: 'LW', ovr: 78, pac: 85, sho: 72, pas: 76, dri: 84, def: 42, phy: 62, com: 78 },
      { name: 'Rafa Mir', country: 'Spain', pos: 'FWD', spec: 'ST', ovr: 78, pac: 82, sho: 80, pas: 66, dri: 74, def: 35, phy: 84, com: 77 },
      { name: 'Tanguy Nianzou', country: 'France', pos: 'DEF', spec: 'CB', ovr: 76, pac: 72, sho: 45, pas: 70, dri: 66, def: 77, phy: 80, com: 75 },
      { name: 'Tecatito Corona', country: 'Mexico', pos: 'FWD', spec: 'RW', ovr: 78, pac: 82, sho: 74, pas: 78, dri: 85, def: 48, phy: 64, com: 80 },
      { name: 'Alberto Flores', country: 'Spain', pos: 'GK', spec: 'GK', ovr: 72, pac: 48, sho: 20, pas: 62, dri: 48, def: 73, phy: 71, com: 72 }
    ]
  }
};

// 4. SMART DETERMINISTIC TALISMAN PICKER
// Picks ST (35%), CAM (25%), Winger (20%), CM (12%), CB (8%)
function pickDiverseTalisman(squad) {
  let hash = 0;
  for (let i = 0; i < squad.id.length; i++) hash = (hash * 37 + squad.id.charCodeAt(i)) % 1000;
  const roll = hash % 100;

  // Search within whole squad players
  let candidate = null;
  if (roll < 35) {
    candidate = squad.players.find(p => p.specificPosition === 'ST' || p.specificPosition === 'CF') || squad.players.find(p => p.position === 'FWD');
  } else if (roll < 60) {
    candidate = squad.players.find(p => p.specificPosition === 'CAM') || squad.players.find(p => p.specificPosition === 'CM');
  } else if (roll < 80) {
    candidate = squad.players.find(p => p.specificPosition === 'LW' || p.specificPosition === 'RW' || p.specificPosition === 'LM' || p.specificPosition === 'RM');
  } else if (roll < 92) {
    candidate = squad.players.find(p => p.specificPosition === 'CM' || p.specificPosition === 'CDM');
  } else {
    candidate = squad.players.find(p => p.specificPosition === 'CB') || squad.players.find(p => p.position === 'DEF');
  }

  return candidate || squad.players[0];
}

console.log('--- STARTING TOTAL DATABASE RESTORATION & AUTHENTICITY AUDIT ---');

const chunkFiles = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.json'));
const allProcessedSquads = [];

let purgedLegendsCount = 0;
let talismansByPos = { ST: 0, CAM: 0, Winger: 0, CM: 0, CDM: 0, CB: 0, GK: 0, Other: 0 };
let talismanOvrTally = {};

for (const file of chunkFiles) {
  const filePath = path.join(CHUNKS_DIR, file);
  const squads = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (let sIdx = 0; sIdx < squads.length; sIdx++) {
    let s = squads[sIdx];

    // Check if we have an authentic handcrafted replacement (e.g. Betis, Villarreal, Sevilla)
    if (REAL_SQUADS[s.id]) {
      const real = REAL_SQUADS[s.id];
      s.clubName = real.clubName;
      s.fullName = real.fullName;
      s.year = real.year;
      s.tier = real.tier;
      s.badgeColor = real.badgeColor;
      s.accentColor = real.accentColor;
      s.primaryTactic = real.primaryTactic;
      s.players = real.players.map((p, idx) => ({
        id: `${s.id}-p${idx + 1}`,
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
      console.log(`[REAL SQUAD INJECTED]: ${s.fullName}`);
      continue;
    }

    const tier = s.tier || 'mid';
    const usedNames = new Set(s.players.map(p => p.name));

    // A. PURGE FALSE LEGENDS
    s.players.forEach(p => {
      if (!isLegitimateAppearance(p.name, s.id)) {
        purgedLegendsCount++;
        usedNames.delete(p.name);
        p.name = getRandomCleanName(p.country || 'Spain', usedNames);
      }
      const legendSurnames = ['Zidane', 'Messi', 'Maradona', 'Henry', 'Mbappe', 'Pelé', 'Cruyff', 'Ronaldo'];
      for (const sur of legendSurnames) {
        if (new RegExp('\\b' + sur + '\\b', 'i').test(p.name) && !isLegitimateAppearance(p.name, s.id)) {
          purgedLegendsCount++;
          usedNames.delete(p.name);
          p.name = getRandomCleanName(p.country || 'Spain', usedNames);
          break;
        }
      }
    });

    // B. DIVERSE TALISMAN & REALISTIC VARIANCE
    let hash = 0;
    for (let c = 0; c < s.id.length; c++) hash = (hash * 31 + s.id.charCodeAt(c)) % 100;

    let targetOvr = 88;
    if (tier === 'elite') targetOvr = 91 + (hash % 5);      // 91 - 95
    else if (tier === 'high') targetOvr = 87 + (hash % 4);  // 87 - 90
    else if (tier === 'mid') targetOvr = 83 + (hash % 4);   // 83 - 86
    else targetOvr = 81 + (hash % 3);                       // 81 - 83

    talismanOvrTally[targetOvr] = (talismanOvrTally[targetOvr] || 0) + 1;

    // Pick diverse talisman
    const talisman = pickDiverseTalisman(s);
    talisman.overall = Math.max(talisman.overall, targetOvr);

    const spec = talisman.specificPosition;
    if (spec === 'ST' || spec === 'CF') talismansByPos.ST++;
    else if (spec === 'CAM') talismansByPos.CAM++;
    else if (spec.includes('W') || spec === 'LM' || spec === 'RM') talismansByPos.Winger++;
    else if (spec === 'CM') talismansByPos.CM++;
    else if (spec === 'CDM') talismansByPos.CDM++;
    else if (spec === 'CB') talismansByPos.CB++;
    else if (spec === 'GK') talismansByPos.GK++;
    else talismansByPos.Other++;

    // Sub-stats scaling for talisman
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
        const delta = ((hash + idx * 7) % 5) - 2; // -2 to +2
        p.overall = Math.max(68, starterBase + delta);
      }
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(squads, null, 2), 'utf8');
  allProcessedSquads.push(...squads);
}

console.log(`Purged ${purgedLegendsCount} illegitimate legend appearances.`);
console.log('Talisman distribution by position:', talismansByPos);
console.log('Talisman ratings distribution:', talismanOvrTally);

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

console.log('--- AUDIT AND RESTORATION COMPLETE ---');
