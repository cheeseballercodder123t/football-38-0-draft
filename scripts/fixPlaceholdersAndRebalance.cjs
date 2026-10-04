const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = path.join(__dirname, '../src/data/chunks');
const SQUADS_JSON_PATH = path.join(__dirname, '../src/data/squads.json');
const CATALOG_JSON_PATH = path.join(__dirname, '../src/data/squadCatalog.json');

// 1. COMPREHENSIVE NAME POOLS
const NAME_POOLS = {
  England: {
    first: [
      'James', 'David', 'John', 'Michael', 'Chris', 'Paul', 'Mark', 'Gary', 'Steve', 'Rob',
      'Andy', 'Lee', 'Phil', 'Ian', 'Darren', 'Danny', 'Matt', 'Luke', 'Tom', 'Jack',
      'Harry', 'Declan', 'Marcus', 'Jude', 'Bukayo', 'Trent', 'Jordan', 'Callum', 'Kieran', 'Ollie',
      'Cole', 'Jarrod', 'Eberechi', 'Adam', 'Conor', 'Joe', 'Ben', 'Lewis', 'Harvey', 'Curtis',
      'Mason', 'Dominic', 'Aaron', 'Dean', 'Tyrone', 'Ezri', 'Levi', 'Tino', 'Jacob', 'Morgan',
      'Anthony', 'Kyle', 'Ashley', 'Teddy', 'Nicky', 'Les', 'Sol', 'Rio', 'Wayne', 'Frank'
    ],
    last: [
      'Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright',
      'Walker', 'Hall', 'Green', 'Clarke', 'Edwards', 'Hughes', 'Ferdinand', 'Cole', 'Campbell', 'Lampard',
      'Gerrard', 'Rooney', 'Kane', 'Sterling', 'Bellingham', 'Rice', 'Saka', 'Foden', 'Pickford', 'Stones',
      'Maguire', 'Trippier', 'Shaw', 'Henderson', 'Alexander-Arnold', 'Palmer', 'Watkins', 'Bowen', 'Eze', 'Gallagher',
      'Konsa', 'Colwill', 'Livramento', 'Gordon', 'Madueke', 'Mainoo', 'Wharton', 'Barnes', 'Maddison', 'White'
    ]
  },
  Spain: {
    first: [
      'Raul', 'Fernando', 'Iker', 'David', 'Sergio', 'Carles', 'Andres', 'Xavi', 'Cesc', 'Alvaro',
      'Gabi', 'Koke', 'Rodri', 'Pedri', 'Gavi', 'Lamine', 'Dani', 'Nico', 'Ferran', 'Mikel',
      'Inigo', 'Unai', 'Jesus', 'Pablo', 'Aitor', 'Ruben', 'Carlos', 'Jose', 'Marc', 'Alex',
      'Alejandro', 'Pau', 'Martin', 'Brais', 'Borja', 'Yeremy', 'Bryan', 'Fabian', 'Robin', 'Aymeric',
      'Gerard', 'Jordi', 'Cesar', 'Marcos', 'Guillermo', 'Lucas', 'Juan', 'Diego', 'Adrian', 'Victor'
    ],
    last: [
      'Garcia', 'Martinez', 'Lopez', 'Gonzalez', 'Rodriguez', 'Fernandez', 'Perez', 'Gomez', 'Sanchez', 'Diaz',
      'Navarro', 'Torres', 'Ramos', 'Casillas', 'Iniesta', 'Hernandez', 'Silva', 'Alonso', 'Busquets', 'Morata',
      'Olmo', 'Williams', 'Yamal', 'Merino', 'Zubimendi', 'Ruiz', 'Le Normand', 'Laporte', 'Cucurella', 'Carvajal',
      'Simon', 'Raya', 'Vivian', 'Baena', 'Oyarzabal', 'Joselu', 'Pino', 'Zaragoza', 'Sancet', 'Barrenetxea'
    ]
  },
  Italy: {
    first: [
      'Paolo', 'Alessandro', 'Francesco', 'Gianluigi', 'Roberto', 'Andrea', 'Fabio', 'Christian', 'Gennaro', 'Filippo',
      'Giorgio', 'Leonardo', 'Marco', 'Ciro', 'Federico', 'Nicolo', 'Lorenzo', 'Gianluca', 'Davide', 'Manuel',
      'Matteo', 'Sandro', 'Giacomo', 'Riccardo', 'Samuele', 'Raoul', 'Destiny', 'Michael', 'Tommaso', 'Bryan',
      'Domenico', 'Stephan', 'Moise', 'Gianluca', 'Mateo', 'Giovanni', 'Mattia', 'Alessio', 'Federico', 'Luca'
    ],
    last: [
      'Rossi', 'Ferrari', 'Russo', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno',
      'Maldini', 'Del Piero', 'Totti', 'Buffon', 'Cannavaro', 'Pirlo', 'Nesta', 'Baggio', 'Inzaghi', 'Chiellini',
      'Bonucci', 'Verratti', 'Barella', 'Chiesa', 'Bastoni', 'Tonali', 'Dimarco', 'Donnarumma', 'Calafiori', 'Frattesi',
      'Scamacca', 'Retegui', 'Raspadori', 'Pellegrini', 'Cristante', 'Locatelli', 'Bellanova', 'Udogie', 'Buongiorno', 'Gatti'
    ]
  },
  Germany: {
    first: [
      'Oliver', 'Michael', 'Bastian', 'Philipp', 'Thomas', 'Manuel', 'Toni', 'Mario', 'Mats', 'Mesut',
      'Jerome', 'Joshua', 'Leon', 'Florian', 'Jamal', 'Leroy', 'Kai', 'Serge', 'Ilkay', 'Antonio',
      'Marc', 'Nico', 'Robin', 'Lukas', 'Julian', 'Maximilian', 'Waldemar', 'Robert', 'Chris', 'Pascal',
      'Deniz', 'Maximilian', 'David', 'Alexander', 'Kevin', 'Jonathan', 'Jan', 'Timo', 'Felix', 'Florian'
    ],
    last: [
      'Muller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
      'Kahn', 'Ballack', 'Schweinsteiger', 'Lahm', 'Kroos', 'Neuer', 'Boateng', 'Hummels', 'Gotze', 'Kimmich',
      'Goretzka', 'Musiala', 'Wirtz', 'Sane', 'Havertz', 'Rudiger', 'Gundogan', 'Tah', 'Schlotterbeck', 'Raum',
      'Mittelstadt', 'Andrich', 'Gross', 'Undav', 'Beier', 'Fuhrich', 'Anton', 'Koch', 'Henrichs', 'Ter Stegen'
    ]
  },
  France: {
    first: [
      'Zinedine', 'Thierry', 'Patrick', 'Marcel', 'Lilian', 'Didier', 'David', 'Nicolas', 'Franck', 'Karim',
      'Antoine', 'Paul', 'N\'Golo', 'Kylian', 'Aurelien', 'Eduardo', 'Ousmane', 'Kingsley', 'Jules', 'Theo',
      'Dayot', 'William', 'Mike', 'Adrien', 'Youssouf', 'Bradley', 'Randal', 'Christopher', 'Moussa', 'Warren',
      'Manu', 'Michael', 'Ibrahima', 'Benjamin', 'Ferland', 'Lucas', 'Brice', 'Alphonse', 'Axel', 'Malo'
    ],
    last: [
      'Zidane', 'Henry', 'Vieira', 'Desailly', 'Thuram', 'Deschamps', 'Trezeguet', 'Anelka', 'Ribery', 'Benzema',
      'Griezmann', 'Pogba', 'Kante', 'Mbappe', 'Tchouameni', 'Camavinga', 'Dembele', 'Coman', 'Kounde', 'Hernandez',
      'Upamecano', 'Saliba', 'Maignan', 'Rabiot', 'Fofana', 'Barcola', 'Kolo Muani', 'Nkunku', 'Diaby', 'Zaire-Emery',
      'Kone', 'Olise', 'Konate', 'Pavard', 'Mendy', 'Samba', 'Areola', 'Disasi', 'Gusto', 'Clauss'
    ]
  },
  Brazil: {
    first: [
      'Ronaldo', 'Rivaldo', 'Ronaldinho', 'Roberto', 'Cafu', 'Kaka', 'Lucio', 'Adriano', 'Neymar', 'Marcelo',
      'Casemiro', 'Alisson', 'Ederson', 'Marquinhos', 'Thiago', 'Vinicius', 'Rodrygo', 'Gabriel', 'Richarlison', 'Bruno',
      'Lucas', 'Raphinha', 'Bremer', 'Douglas', 'Danilo', 'Savinho', 'Endrick', 'Bento', 'Yan', 'Lucas',
      'Andre', 'Wendell', 'Guilherme', 'Murillo', 'Igor', 'Pepe', 'Vitor', 'Caio', 'Matheus', 'Luiz'
    ],
    last: [
      'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
      'Costa', 'Ribeiro', 'Carvalho', 'Junior', 'Nazario', 'Guimaraes', 'Magalhaes', 'Jesus', 'Martinelli', 'Paqueta',
      'Coutinho', 'Firmino', 'Fabinho', 'Militão', 'Beraldo', 'Couto', 'Roque', 'Henrique', 'Moura', 'Nenê'
    ]
  },
  Argentina: {
    first: [
      'Diego', 'Gabriel', 'Javier', 'Juan', 'Hernan', 'Lionel', 'Angel', 'Sergio', 'Gonzalo', 'Lautaro',
      'Julian', 'Alexis', 'Enzo', 'Rodrigo', 'Emiliano', 'Cristian', 'Nahuel', 'Nicolas', 'Lisandro', 'Paulo',
      'Leandro', 'Giovani', 'Exequiel', 'Alejandro', 'Valentin', 'Lucas', 'Thiago', 'Facundo', 'Matias', 'Gerónimo'
    ],
    last: [
      'Maradona', 'Batistuta', 'Zanetti', 'Riquelme', 'Crespo', 'Messi', 'Di Maria', 'Aguero', 'Higuain', 'Martinez',
      'Alvarez', 'Mac Allister', 'Fernandez', 'De Paul', 'Romero', 'Molina', 'Otamendi', 'Tagliafico', 'Dybala', 'Paredes',
      'Lo Celso', 'Palacios', 'Garnacho', 'Carboni', 'Beltran', 'Almada', 'Buonanotte', 'Barco', 'Rulli', 'Musso'
    ]
  },
  Netherlands: {
    first: [
      'Virgil', 'Frenkie', 'Memphis', 'Cody', 'Denzel', 'Nathan', 'Matthijs', 'Xavi', 'Tijjani', 'Jeremie',
      'Teun', 'Joey', 'Stefan', 'Bart', 'Mark', 'Marten', 'Quinten', 'Brian', 'Wout', 'Steven'
    ],
    last: [
      'van Dijk', 'de Jong', 'Depay', 'Gakpo', 'Dumfries', 'Ake', 'de Ligt', 'Simons', 'Reijnders', 'Frimpong',
      'Koopmeiners', 'Veerman', 'de Vrij', 'Verbruggen', 'Flekken', 'de Roon', 'Timber', 'Brobbey', 'Weghorst', 'Bergwijn'
    ]
  },
  Portugal: {
    first: [
      'Cristiano', 'Bernardo', 'Bruno', 'Ruben', 'Rafael', 'Diogo', 'Joao', 'Goncalo', 'Pedro', 'Vitinha',
      'Nuno', 'Matheus', 'Nelson', 'Danilo', 'Antonio', 'Francisco', 'Fabio', 'Otavio', 'Jose', 'Rui'
    ],
    last: [
      'Ronaldo', 'Silva', 'Fernandes', 'Dias', 'Leao', 'Jota', 'Felix', 'Cancelo', 'Ramos', 'Neto',
      'Mendes', 'Neves', 'Palhinha', 'Costa', 'Semedo', 'Inacio', 'Conceicao', 'Vieira', 'Sa', 'Patricio'
    ]
  },
  Croatia: {
    first: ['Luka', 'Mateo', 'Marcelo', 'Ivan', 'Andrej', 'Josko', 'Dominik', 'Josip', 'Borna', 'Mario', 'Lovro', 'Martin'],
    last: ['Modric', 'Kovacic', 'Brozovic', 'Perisic', 'Kramaric', 'Gvardiol', 'Livakovic', 'Stanisic', 'Sosa', 'Pasalic', 'Majer', 'Baturina']
  },
  Austria: {
    first: ['David', 'Marcel', 'Christoph', 'Konrad', 'Nicolas', 'Florian', 'Michael', 'Patrick', 'Stefan', 'Maximilian'],
    last: ['Alaba', 'Sabitzer', 'Baumgartner', 'Laimer', 'Seiwald', 'Grillitsch', 'Gregoritsch', 'Wimmer', 'Posch', 'Danso']
  },
  Switzerland: {
    first: ['Granit', 'Manuel', 'Yann', 'Breel', 'Denis', 'Remo', 'Fabian', 'Michel', 'Dan', 'Silvan'],
    last: ['Xhaka', 'Akanji', 'Sommer', 'Embolo', 'Zakaria', 'Freuler', 'Schar', 'Aebischer', 'Ndoye', 'Widmer']
  },
  Poland: {
    first: ['Robert', 'Piotr', 'Wojciech', 'Jakub', 'Sebastian', 'Nicola', 'Jan', 'Krzysztof', 'Bartosz', 'Przemyslaw'],
    last: ['Lewandowski', 'Zielinski', 'Szczesny', 'Kiwior', 'Szymanski', 'Zalewski', 'Bednarek', 'Piatek', 'Slisz', 'Frankowski']
  },
  Scotland: {
    first: ['Andrew', 'Scott', 'John', 'Billy', 'Kieran', 'Callum', 'Che', 'Grant', 'Ryan', 'Lyndon'],
    last: ['Robertson', 'McTominay', 'McGinn', 'Gilmour', 'Tierney', 'McGregor', 'Adams', 'Hanley', 'Christie', 'Dykes']
  },
  Ireland: {
    first: ['Evan', 'Nathan', 'Caoimhin', 'Matt', 'John', 'Josh', 'Chiedozie', 'Seamus', 'Jason', 'Will'],
    last: ['Ferguson', 'Collins', 'Kelleher', 'Doherty', 'Egan', 'Cullen', 'Ogbene', 'Coleman', 'Knight', 'Smallbone']
  },
  Uruguay: {
    first: ['Federico', 'Darwin', 'Ronald', 'Jose', 'Manuel', 'Rodrigo', 'Facundo', 'Mathias', 'Sebastian', 'Sergio'],
    last: ['Valverde', 'Nunez', 'Araujo', 'Gimenez', 'Ugarte', 'Bentancur', 'Pellistri', 'Olivera', 'Caceres', 'Rochet']
  }
};

// 2. CLUB TIER DICTIONARY
const CLUB_TIERS = {
  // ELITE
  'Real Madrid': 'elite',
  'FC Barcelona': 'elite',
  'Barcelona': 'elite',
  'Atletico Madrid': 'elite',
  'Arsenal': 'elite',
  'Manchester United': 'elite',
  'Manchester City': 'elite',
  'Chelsea': 'elite',
  'Liverpool': 'elite',
  'AC Milan': 'elite',
  'Inter Milan': 'elite',
  'Juventus': 'elite',
  'Napoli': 'elite',
  'SSC Napoli': 'elite',
  'FC Bayern Munich': 'elite',
  'Bayern Munich': 'elite',
  'Borussia Dortmund': 'elite',
  'Bayer 04 Leverkusen': 'elite',
  'Bayer Leverkusen': 'elite',
  'Brazil': 'elite',
  'France': 'elite',
  'Spain': 'elite',
  'Argentina': 'elite',
  'Germany': 'elite',
  'Italy': 'elite',
  'AFC Ajax': 'elite',
  'FC Porto': 'elite',
  'Olympique de Marseille': 'elite',
  'Marseille': 'elite',

  // HIGH
  'Tottenham Hotspur': 'high',
  'Newcastle United': 'high',
  'Aston Villa': 'high',
  'Leeds United': 'high',
  'Leicester City': 'high',
  'Everton': 'high',
  'West Ham United': 'high',
  'Brighton & Hove Albion': 'high',
  'Valencia': 'high',
  'Valencia CF': 'high',
  'Sevilla': 'high',
  'Sevilla FC': 'high',
  'Athletic Bilbao': 'high',
  'Real Sociedad': 'high',
  'Villarreal': 'high',
  'Villarreal CF': 'high',
  'Deportivo La Coruna': 'high',
  'Real Betis': 'high',
  'Celta Vigo': 'high',
  'Girona FC': 'high',
  'AS Roma': 'high',
  'SS Lazio': 'high',
  'ACF Fiorentina': 'high',
  'Parma': 'high',
  'Parma Calcio': 'high',
  'Atalanta BC': 'high',
  'UC Sampdoria': 'high',
  'Sampdoria': 'high',
  'FC Schalke 04': 'high',
  'Schalke 04': 'high',
  'SV Werder Bremen': 'high',
  'Werder Bremen': 'high',
  'VfB Stuttgart': 'high',
  'Hamburger SV': 'high',
  'Borussia Monchengladbach': 'high',
  'VfL Wolfsburg': 'high',
  'Wolfsburg': 'high',
  'Eintracht Frankfurt': 'high',
  'SC Freiburg': 'high',
  'RB Leipzig': 'high',
  'TSG 1899 Hoffenheim': 'high',
  '1. FC Union Berlin': 'high',
  'Portugal': 'high',
  'England': 'high',
  'Netherlands': 'high',
  'Croatia': 'high',
  'AS Monaco': 'high',
  'Olympique Lyonnais': 'high',
  'LOSC Lille': 'high',
  'SL Benfica': 'high',
  'PSV Eindhoven': 'high',
  'Celtic FC': 'high',
  'Galatasaray': 'high',
  'Shakhtar Donetsk': 'high',
  'Dynamo Kyiv': 'high',

  // MID
  'Blackburn Rovers': 'mid',
  'Crystal Palace': 'mid',
  'Middlesbrough': 'mid',
  'Nottingham Forest': 'mid',
  'Southampton': 'mid',
  'Sheffield Wednesday': 'mid',
  'Bolton Wanderers': 'mid',
  'Fulham': 'mid',
  'Fulham FC': 'mid',
  'Charlton Athletic': 'mid',
  'Stoke City': 'mid',
  'West Bromwich Albion': 'mid',
  'Wigan Athletic': 'mid',
  'Wolverhampton Wanderers': 'mid',
  'Brentford': 'mid',
  'Burnley': 'mid',
  'Bournemouth': 'mid',
  'Portsmouth': 'mid',
  'Swansea City': 'mid',
  'RCD Espanyol': 'mid',
  'Real Zaragoza': 'mid',
  'RCD Mallorca': 'mid',
  'CA Osasuna': 'mid',
  'Getafe CF': 'mid',
  'Malaga': 'mid',
  'Malaga CF': 'mid',
  'Rayo Vallecano': 'mid',
  'Deportivo Alaves': 'mid',
  'Granada CF': 'mid',
  'Levante UD': 'mid',
  'Udinese': 'mid',
  'Udinese Calcio': 'mid',
  'Torino FC': 'mid',
  'Bologna FC': 'mid',
  'Cagliari Calcio': 'mid',
  'Genoa CFC': 'mid',
  'Hellas Verona': 'mid',
  'US Palermo': 'mid',
  'US Sassuolo': 'mid',
  'Brescia Calcio': 'mid',
  'Chievo Verona': 'mid',
  'AC Monza': 'mid',
  '1. FC Kaiserslautern': 'mid',
  'Hertha BSC': 'mid',
  '1. FC Koln': 'mid',
  'Hannover 96': 'mid',
  '1. FC Nurnberg': 'mid',
  '1. FSV Mainz 05': 'mid',
  'FC Augsburg': 'mid',
  'Karlsruher SC': 'mid',
  'TSV 1860 Munich': 'mid',
  'Fortuna Dusseldorf': 'mid',
  '1. FC Heidenheim': 'mid',
  'Senegal': 'mid',
  'Ghana': 'mid',
  'Costa Rica': 'mid',
  'Greece': 'mid',
  'South Korea': 'mid',
  'Saudi Arabia': 'mid',
  'Anzhi Makhachkala': 'mid',
  'Anorthosis Famagusta': 'mid'
};

function getTierForClub(clubName, league) {
  if (CLUB_TIERS[clubName]) return CLUB_TIERS[clubName];
  // Check substring
  for (const [key, tier] of Object.entries(CLUB_TIERS)) {
    if (clubName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(clubName.toLowerCase())) {
      return tier;
    }
  }
  return 'low';
}

// 3. AURA CATALOG FOR TALISMANS
const TALISMAN_AURAS = [
  { id: 'solo-anarchy', name: 'Solo Anarchy', description: '+15% conversion when taking on isolated defenders.', shortDesc: '+15% solo run', rarity: 'Legendary' },
  { id: 'clinical-poacher', name: 'Clinical Poacher', description: '+12% finishing accuracy inside the 18-yard box.', shortDesc: '+12% box xG', rarity: 'Epic' },
  { id: 'deep-playmaker', name: 'Deep Playmaker', description: '+12% key pass creation on counter attacks.', shortDesc: '+12% vision', rarity: 'Epic' },
  { id: 'dead-ball', name: 'Dead-Ball Architect', description: '+12% conversion from direct and indirect set-pieces.', shortDesc: '+12% set-piece', rarity: 'Rare' },
  { id: 'counter-burst', name: 'Counter Burst', description: '+14% transition pace and rapid breakaway threat.', shortDesc: '+14% break pace', rarity: 'Rare' },
  { id: 'flair-dribbler', name: '1v1 Specialist', description: '+12% successful take-on rate on the wing.', shortDesc: '+12% take-on', rarity: 'Rare' },
  { id: 'colossus', name: 'Defensive Colossus', description: '+12% central box block rate and shot deflection.', shortDesc: '+12% blocks', rarity: 'Epic' },
  { id: 'metronome', name: 'Midfield Metronome', description: '+8% passing accuracy and possession retention.', shortDesc: '+8% tempo', rarity: 'Epic' }
];

function generateAuthenticName(country, usedNamesInSquad) {
  const pool = NAME_POOLS[country] || NAME_POOLS['England'];
  let attempts = 0;
  let chosenName = '';
  while (attempts < 200) {
    const first = pool.first[Math.floor(Math.random() * pool.first.length)];
    const last = pool.last[Math.floor(Math.random() * pool.last.length)];
    chosenName = `${first} ${last}`;
    if (!usedNamesInSquad.has(chosenName)) {
      usedNamesInSquad.add(chosenName);
      return chosenName;
    }
    attempts++;
  }
  // Fallback with unique suffix if somehow exhausted
  const last = pool.last[Math.floor(Math.random() * pool.last.length)];
  chosenName = `Alex ${last}`;
  usedNamesInSquad.add(chosenName);
  return chosenName;
}

// 4. STAT REBALANCER FOR A SQUAD
function rebalanceSquad(squad) {
  const tier = getTierForClub(squad.clubName, squad.league);
  squad.tier = tier;

  // Track all names in squad to ensure 0 duplicates
  const usedNamesInSquad = new Set();
  squad.players.forEach(p => {
    if (!/Res\./i.test(p.name)) {
      usedNamesInSquad.add(p.name);
    }
  });

  // Step 1: Replace all placeholders
  squad.players.forEach(p => {
    if (/Res\./i.test(p.name)) {
      const realName = generateAuthenticName(p.country || 'England', usedNamesInSquad);
      p.name = realName;
      // Clean up player id if it contained res
      p.id = `${squad.id}-p${p.specificPosition.toLowerCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    }
  });

  // Step 2: Establish tier targets
  // ELITE: Superstars 91-96, Starters 86-90, Bench 82-85, Reserves 76-80
  // HIGH:  Talisman 88-91, Starters 82-86, Bench 78-82, Reserves 74-77
  // MID:   Talisman 84-86, Starters 78-82, Bench 75-78, Reserves 72-75
  // LOW:   Talisman 82-84, Starters 76-79, Bench 73-76, Reserves 70-73
  const minTalismanOvr = tier === 'elite' ? 92 : (tier === 'high' ? 88 : (tier === 'mid' ? 84 : 82));
  const starterFloor = tier === 'elite' ? 85 : (tier === 'high' ? 82 : (tier === 'mid' ? 78 : 76));
  const benchFloor = tier === 'elite' ? 81 : (tier === 'high' ? 77 : (tier === 'mid' ? 74 : 72));
  const reserveFloor = tier === 'elite' ? 76 : (tier === 'high' ? 73 : (tier === 'mid' ? 70 : 68));

  // Find current top player
  let maxPlayer = squad.players[0];
  squad.players.forEach(p => {
    if (p.overall > maxPlayer.overall) {
      maxPlayer = p;
    }
  });

  // Ensure Talisman Guarantee:
  // If squad's best player is below minTalismanOvr, promote best attacking/midfield starter
  if (maxPlayer.overall < minTalismanOvr) {
    const talismanCandidate = squad.players.slice(0, 11).find(p => p.position === 'FWD' || p.position === 'MID') || squad.players[0];
    talismanCandidate.overall = minTalismanOvr;
    if (!talismanCandidate.auraTrait) {
      const aura = TALISMAN_AURAS[Math.floor(Math.random() * TALISMAN_AURAS.length)];
      talismanCandidate.auraTrait = {
        id: `${talismanCandidate.id}-${aura.id}`,
        name: aura.name,
        description: aura.description,
        shortDesc: aura.shortDesc,
        rarity: aura.rarity
      };
    }
  }

  // Lift starters, bench, and reserves to their competitive floors
  squad.players.forEach((p, idx) => {
    const isStarter = idx < 11;
    const isMatchdayBench = idx >= 11 && idx < 19;
    const isReserve = idx >= 19;

    if (isStarter && p.overall < starterFloor) {
      p.overall = starterFloor + (idx % 3 === 0 ? 1 : 0);
    } else if (isMatchdayBench && p.overall < benchFloor) {
      p.overall = benchFloor + (idx % 2 === 0 ? 1 : 0);
    } else if (isReserve && p.overall < reserveFloor) {
      p.overall = reserveFloor;
    }

    // Scale attributes proportionally to overall
    const ovr = p.overall;
    if (p.position === 'GK') {
      p.defending = ovr;
      p.composure = ovr;
      p.physical = Math.max(70, ovr - 2);
      p.passing = Math.max(62, ovr - 12);
      p.pace = Math.max(50, ovr - 28);
      p.dribbling = Math.max(48, ovr - 30);
    } else if (p.position === 'DEF') {
      p.defending = Math.max(p.defending, ovr + 1);
      p.physical = Math.max(p.physical, ovr);
      p.composure = Math.max(p.composure, ovr - 2);
      p.passing = Math.max(p.passing, ovr - 8);
      p.pace = Math.max(p.pace, p.specificPosition.includes('B') && !p.specificPosition.includes('C') ? ovr : ovr - 8);
    } else if (p.position === 'MID') {
      p.passing = Math.max(p.passing, ovr + 1);
      p.dribbling = Math.max(p.dribbling, ovr);
      p.composure = Math.max(p.composure, ovr);
      p.physical = Math.max(p.physical, ovr - 4);
      p.pace = Math.max(p.pace, ovr - 4);
      p.shooting = Math.max(p.shooting, p.specificPosition === 'CAM' ? ovr - 2 : ovr - 8);
      if (p.specificPosition === 'CDM') p.defending = Math.max(p.defending, ovr);
    } else if (p.position === 'FWD') {
      p.shooting = Math.max(p.shooting, ovr + 2);
      p.dribbling = Math.max(p.dribbling, ovr);
      p.pace = Math.max(p.pace, p.specificPosition.includes('W') ? ovr + 4 : ovr - 1);
      p.composure = Math.max(p.composure, ovr);
      p.physical = Math.max(p.physical, ovr - 5);
      p.passing = Math.max(p.passing, ovr - 7);
    }
  });

  return squad;
}

// 5. PROCESS ALL CHUNKS AND WRITE UPDATES
console.log('--- STARTING PLACEHOLDER REMOVAL & REBALANCING ---');
const chunkFiles = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.json'));
const allProcessedSquads = [];

let totalPlaceholdersReplaced = 0;
let tierCounts = { elite: 0, high: 0, mid: 0, low: 0 };

for (const file of chunkFiles) {
  const filePath = path.join(CHUNKS_DIR, file);
  const squads = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const processed = squads.map(s => {
    s.chunkId = file.replace('.json', '');
    s.players.forEach(p => {
      if (/Res\./i.test(p.name)) totalPlaceholdersReplaced++;
    });
    const rebalanced = rebalanceSquad(s);
    tierCounts[rebalanced.tier]++;
    return rebalanced;
  });

  fs.writeFileSync(filePath, JSON.stringify(processed, null, 2), 'utf8');
  allProcessedSquads.push(...processed);
  console.log(`Updated chunk: ${file} (${processed.length} squads)`);
}

console.log(`Replaced ${totalPlaceholdersReplaced} placeholders across chunks.`);
console.log('Tier breakdown:', tierCounts);

// Write squads.json
fs.writeFileSync(SQUADS_JSON_PATH, JSON.stringify(allProcessedSquads, null, 2), 'utf8');
console.log(`Updated squads.json (${allProcessedSquads.length} squads).`);

// Update squadCatalog.json with tier
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
console.log(`Updated squadCatalog.json (${catalog.length} squad summaries with tier).`);

console.log('--- REBALANCING & PLACEHOLDER CLEANUP COMPLETE ---');
