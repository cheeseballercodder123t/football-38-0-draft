const { p } = require('./squadBuilderHelpers.cjs');

// Real, official substitutes who played for these historic squads
const AUTHENTIC_BENCHES = {
  'man-united-1998-99': [
    { name: 'Ole Gunnar Solskjær', pos: 'FWD', spec: 'ST', country: 'Norway', ovr: 84, pac: 80, sho: 87, pas: 74, dri: 80, def: 32, phy: 74, com: 90, aura: { id: 'solskjaer-supersub', name: 'Baby-Faced Assassin', description: '+25% clutch finishing after 75th min.', shortDesc: '+25% late xG', rarity: 'Legendary' } },
    { name: 'Teddy Sheringham', pos: 'FWD', spec: 'CF', country: 'England', ovr: 83, pac: 72, sho: 85, pas: 80, dri: 81, def: 38, phy: 78, com: 88 },
    { name: 'Phil Neville', pos: 'DEF', spec: 'LB', country: 'England', ovr: 80, pac: 76, sho: 58, pas: 76, dri: 74, def: 81, phy: 80, com: 80 },
    { name: 'Wes Brown', pos: 'DEF', spec: 'CB', country: 'England', ovr: 79, pac: 75, sho: 40, pas: 68, dri: 65, def: 81, phy: 82, com: 78 },
    { name: 'Raimond van der Gouw', pos: 'GK', spec: 'GK', country: 'Netherlands', ovr: 77, pac: 50, sho: 20, pas: 65, dri: 48, def: 78, phy: 76, com: 78 }
  ],
  'chelsea-2004-05': [
    { name: 'Eiður Guðjohnsen', pos: 'FWD', spec: 'ST', country: 'Iceland', ovr: 84, pac: 78, sho: 83, pas: 82, dri: 84, def: 42, phy: 80, com: 85 },
    { name: 'Joe Cole', pos: 'MID', spec: 'CAM', country: 'England', ovr: 84, pac: 84, sho: 80, pas: 85, dri: 88, def: 45, phy: 70, com: 84 },
    { name: 'Geremi', pos: 'MID', spec: 'RM', country: 'Cameroon', ovr: 80, pac: 76, sho: 78, pas: 80, dri: 78, def: 78, phy: 84, com: 81 },
    { name: 'Robert Huth', pos: 'DEF', spec: 'CB', country: 'Germany', ovr: 78, pac: 60, sho: 42, pas: 62, dri: 55, def: 82, phy: 88, com: 78 },
    { name: 'Carlo Cudicini', pos: 'GK', spec: 'GK', country: 'Italy', ovr: 82, pac: 52, sho: 22, pas: 68, dri: 50, def: 83, phy: 78, com: 82 }
  ],
  'chelsea-2009-10': [
    { name: 'Salomon Kalou', pos: 'FWD', spec: 'LW', country: 'Ivory Coast', ovr: 82, pac: 85, sho: 80, pas: 76, dri: 83, def: 40, phy: 76, com: 81 },
    { name: 'Deco', pos: 'MID', spec: 'CAM', country: 'Portugal', ovr: 84, pac: 72, sho: 80, pas: 88, dri: 87, def: 65, phy: 68, com: 88 },
    { name: 'Michael Ballack', pos: 'MID', spec: 'CM', country: 'Germany', ovr: 85, pac: 72, sho: 84, pas: 85, dri: 80, def: 78, phy: 84, com: 88 },
    { name: 'Alex', pos: 'DEF', spec: 'CB', country: 'Brazil', ovr: 82, pac: 64, sho: 82, pas: 68, dri: 62, def: 84, phy: 88, com: 80 },
    { name: 'Juliano Belletti', pos: 'DEF', spec: 'RB', country: 'Brazil', ovr: 79, pac: 78, sho: 72, pas: 77, dri: 77, def: 78, phy: 78, com: 80 }
  ],
  'man-united-2007-08': [
    { name: 'Nani', pos: 'FWD', spec: 'LW', country: 'Portugal', ovr: 84, pac: 88, sho: 81, pas: 82, dri: 88, def: 40, phy: 72, com: 83 },
    { name: 'Anderson', pos: 'MID', spec: 'CM', country: 'Brazil', ovr: 82, pac: 82, sho: 74, pas: 82, dri: 85, def: 70, phy: 78, com: 82 },
    { name: 'Park Ji-sung', pos: 'MID', spec: 'LM', country: 'South Korea', ovr: 83, pac: 84, sho: 74, pas: 80, dri: 82, def: 74, phy: 86, com: 86 },
    { name: 'Darren Fletcher', pos: 'MID', spec: 'CM', country: 'Scotland', ovr: 81, pac: 76, sho: 74, pas: 82, dri: 78, def: 80, phy: 82, com: 82 },
    { name: 'John O\'Shea', pos: 'DEF', spec: 'CB', country: 'Ireland', ovr: 80, pac: 72, sho: 60, pas: 74, dri: 70, def: 81, phy: 82, com: 82 }
  ],
  'ac-milan-2006-07': [
    { name: 'Alberto Gilardino', pos: 'FWD', spec: 'ST', country: 'Italy', ovr: 85, pac: 80, sho: 86, pas: 72, dri: 81, def: 35, phy: 80, com: 85 },
    { name: 'Cafu', pos: 'DEF', spec: 'RB', country: 'Brazil', ovr: 84, pac: 82, sho: 68, pas: 82, dri: 83, def: 82, phy: 80, com: 86 },
    { name: 'Serginho', pos: 'DEF', spec: 'LB', country: 'Brazil', ovr: 82, pac: 86, sho: 74, pas: 80, dri: 84, def: 76, phy: 76, com: 82 },
    { name: 'Kakha Kaladze', pos: 'DEF', spec: 'CB', country: 'Georgia', ovr: 82, pac: 70, sho: 45, pas: 72, dri: 68, def: 84, phy: 84, com: 82 },
    { name: 'Yoann Gourcuff', pos: 'MID', spec: 'CAM', country: 'France', ovr: 80, pac: 76, sho: 76, pas: 83, dri: 83, def: 55, phy: 74, com: 80 }
  ],
  'inter-2009-10': [
    { name: 'Mario Balotelli', pos: 'FWD', spec: 'ST', country: 'Italy', ovr: 83, pac: 86, sho: 85, pas: 74, dri: 85, def: 35, phy: 84, com: 80 },
    { name: 'Dejan Stanković', pos: 'MID', spec: 'CM', country: 'Serbia', ovr: 84, pac: 74, sho: 86, pas: 84, dri: 80, def: 78, phy: 84, com: 85 },
    { name: 'Thiago Motta', pos: 'MID', spec: 'CM', country: 'Italy', ovr: 83, pac: 68, sho: 76, pas: 85, dri: 80, def: 82, phy: 82, com: 85 },
    { name: 'Marco Materazzi', pos: 'DEF', spec: 'CB', country: 'Italy', ovr: 82, pac: 58, sho: 60, pas: 70, dri: 60, def: 86, phy: 89, com: 85 },
    { name: 'Iván Córdoba', pos: 'DEF', spec: 'CB', country: 'Colombia', ovr: 82, pac: 84, sho: 40, pas: 65, dri: 62, def: 84, phy: 82, com: 82 }
  ],
  'bayern-2012-13': [
    { name: 'Mario Gomez', pos: 'FWD', spec: 'ST', country: 'Germany', ovr: 86, pac: 80, sho: 88, pas: 68, dri: 79, def: 35, phy: 85, com: 86 },
    { name: 'Claudio Pizarro', pos: 'FWD', spec: 'ST', country: 'Peru', ovr: 82, pac: 72, sho: 84, pas: 78, dri: 81, def: 38, phy: 78, com: 88 },
    { name: 'Xherdan Shaqiri', pos: 'MID', spec: 'RW', country: 'Switzerland', ovr: 81, pac: 86, sho: 80, pas: 81, dri: 85, def: 48, phy: 76, com: 80 },
    { name: 'Luiz Gustavo', pos: 'MID', spec: 'CDM', country: 'Brazil', ovr: 83, pac: 76, sho: 68, pas: 80, dri: 76, def: 85, phy: 85, com: 82 },
    { name: 'Holger Badstuber', pos: 'DEF', spec: 'CB', country: 'Germany', ovr: 82, pac: 68, sho: 55, pas: 80, dri: 68, def: 84, phy: 82, com: 83 }
  ],
  'barcelona-2014-15': [
    { name: 'Xavi Hernández', pos: 'MID', spec: 'CM', country: 'Spain', ovr: 87, pac: 66, sho: 74, pas: 93, dri: 86, def: 70, phy: 68, com: 95 },
    { name: 'Pedro Rodríguez', pos: 'FWD', spec: 'RW', country: 'Spain', ovr: 84, pac: 87, sho: 82, pas: 80, dri: 84, def: 48, phy: 70, com: 83 },
    { name: 'Rafinha Alcântara', pos: 'MID', spec: 'CM', country: 'Brazil', ovr: 80, pac: 78, sho: 74, pas: 82, dri: 84, def: 68, phy: 72, com: 81 },
    { name: 'Jérémy Mathieu', pos: 'DEF', spec: 'CB', country: 'France', ovr: 81, pac: 80, sho: 65, pas: 74, dri: 70, def: 82, phy: 84, com: 79 },
    { name: 'Adriano Correia', pos: 'DEF', spec: 'LB', country: 'Brazil', ovr: 79, pac: 80, sho: 74, pas: 76, dri: 78, def: 77, phy: 74, com: 78 }
  ],
  'real-madrid-2016-17': [
    { name: 'Isco', pos: 'MID', spec: 'CAM', country: 'Spain', ovr: 88, pac: 78, sho: 82, pas: 88, dri: 92, def: 58, phy: 70, com: 89 },
    { name: 'Álvaro Morata', pos: 'FWD', spec: 'ST', country: 'Spain', ovr: 84, pac: 85, sho: 84, pas: 74, dri: 80, def: 35, phy: 80, com: 82 },
    { name: 'James Rodríguez', pos: 'MID', spec: 'CAM', country: 'Colombia', ovr: 86, pac: 76, sho: 86, pas: 89, dri: 86, def: 48, phy: 72, com: 87 },
    { name: 'Marco Asensio', pos: 'MID', spec: 'RW', country: 'Spain', ovr: 83, pac: 84, sho: 83, pas: 82, dri: 85, def: 42, phy: 70, com: 82 },
    { name: 'Mateo Kovačić', pos: 'MID', spec: 'CM', country: 'Croatia', ovr: 83, pac: 82, sho: 72, pas: 84, dri: 88, def: 74, phy: 76, com: 84 },
    { name: 'Nacho Fernández', pos: 'DEF', spec: 'CB', country: 'Spain', ovr: 82, pac: 78, sho: 45, pas: 74, dri: 72, def: 83, phy: 80, com: 82 }
  ],
  'liverpool-2019-20': [
    { name: 'Divock Origi', pos: 'FWD', spec: 'ST', country: 'Belgium', ovr: 80, pac: 84, sho: 80, pas: 72, dri: 79, def: 35, phy: 80, com: 85 },
    { name: 'James Milner', pos: 'MID', spec: 'CM', country: 'England', ovr: 81, pac: 72, sho: 76, pas: 82, dri: 78, def: 79, phy: 80, com: 86 },
    { name: 'Naby Keïta', pos: 'MID', spec: 'CM', country: 'Guinea', ovr: 82, pac: 78, sho: 75, pas: 83, dri: 86, def: 72, phy: 70, com: 82 },
    { name: 'Alex Oxlade-Chamberlain', pos: 'MID', spec: 'CM', country: 'England', ovr: 80, pac: 84, sho: 78, pas: 79, dri: 83, def: 65, phy: 76, com: 80 },
    { name: 'Joe Gomez', pos: 'DEF', spec: 'CB', country: 'England', ovr: 82, pac: 84, sho: 35, pas: 70, dri: 70, def: 83, phy: 81, com: 80 }
  ],
  'man-city-2022-23': [
    { name: 'Julián Álvarez', pos: 'FWD', spec: 'ST', country: 'Argentina', ovr: 84, pac: 86, sho: 84, pas: 80, dri: 84, def: 55, phy: 78, com: 85 },
    { name: 'Riyad Mahrez', pos: 'FWD', spec: 'RW', country: 'Algeria', ovr: 86, pac: 80, sho: 83, pas: 86, dri: 90, def: 38, phy: 62, com: 87 },
    { name: 'Phil Foden', pos: 'MID', spec: 'CAM', country: 'England', ovr: 87, pac: 86, sho: 83, pas: 86, dri: 90, def: 58, phy: 66, com: 86 },
    { name: 'Aymeric Laporte', pos: 'DEF', spec: 'CB', country: 'Spain', ovr: 85, pac: 68, sho: 50, pas: 82, dri: 72, def: 87, phy: 82, com: 85 },
    { name: 'Stefan Ortega', pos: 'GK', spec: 'GK', country: 'Germany', ovr: 80, pac: 50, sho: 20, pas: 78, dri: 52, def: 81, phy: 76, com: 82 }
  ],
  'france-1998': [
    { name: 'David Trezeguet', pos: 'FWD', spec: 'ST', country: 'France', ovr: 84, pac: 82, sho: 87, pas: 68, dri: 78, def: 32, phy: 80, com: 86 },
    { name: 'Robert Pires', pos: 'MID', spec: 'LM', country: 'France', ovr: 83, pac: 82, sho: 80, pas: 84, dri: 85, def: 42, phy: 72, com: 83 },
    { name: 'Patrick Vieira', pos: 'MID', spec: 'CDM', country: 'France', ovr: 86, pac: 80, sho: 72, pas: 82, dri: 80, def: 88, phy: 90, com: 86 },
    { name: 'Alain Boghossian', pos: 'MID', spec: 'CM', country: 'France', ovr: 80, pac: 74, sho: 72, pas: 80, dri: 76, def: 80, phy: 82, com: 80 },
    { name: 'Bernard Lama', pos: 'GK', spec: 'GK', country: 'France', ovr: 83, pac: 55, sho: 22, pas: 70, dri: 52, def: 84, phy: 80, com: 83 }
  ],
  'brazil-2002': [
    { name: 'Edmílson', pos: 'DEF', spec: 'CB', country: 'Brazil', ovr: 82, pac: 74, sho: 60, pas: 78, dri: 76, def: 83, phy: 82, com: 82 },
    { name: 'Juninho Paulista', pos: 'MID', spec: 'CAM', country: 'Brazil', ovr: 83, pac: 84, sho: 80, pas: 84, dri: 87, def: 45, phy: 68, com: 84 },
    { name: 'Denílson', pos: 'MID', spec: 'LW', country: 'Brazil', ovr: 82, pac: 88, sho: 72, pas: 80, dri: 92, def: 35, phy: 65, com: 81 },
    { name: 'Vampeta', pos: 'MID', spec: 'CM', country: 'Brazil', ovr: 80, pac: 75, sho: 74, pas: 81, dri: 79, def: 78, phy: 80, com: 80 },
    { name: 'Rogério Ceni', pos: 'GK', spec: 'GK', country: 'Brazil', ovr: 82, pac: 55, sho: 78, pas: 82, dri: 55, def: 82, phy: 78, com: 86 }
  ],
  'spain-2010': [
    { name: 'Cesc Fàbregas', pos: 'MID', spec: 'CAM', country: 'Spain', ovr: 88, pac: 76, sho: 82, pas: 91, dri: 85, def: 68, phy: 72, com: 90 },
    { name: 'Fernando Torres', pos: 'FWD', spec: 'ST', country: 'Spain', ovr: 87, pac: 89, sho: 87, pas: 76, dri: 84, def: 38, phy: 80, com: 86 },
    { name: 'Jesús Navas', pos: 'MID', spec: 'RM', country: 'Spain', ovr: 84, pac: 92, sho: 74, pas: 82, dri: 86, def: 50, phy: 64, com: 81 },
    { name: 'Javi Martínez', pos: 'MID', spec: 'CDM', country: 'Spain', ovr: 83, pac: 70, sho: 68, pas: 80, dri: 74, def: 85, phy: 88, com: 82 },
    { name: 'Pepe Reina', pos: 'GK', spec: 'GK', country: 'Spain', ovr: 84, pac: 52, sho: 20, pas: 76, dri: 50, def: 85, phy: 80, com: 86 }
  ],
  'argentina-2022': [
    { name: 'Lautaro Martínez', pos: 'FWD', spec: 'ST', country: 'Argentina', ovr: 86, pac: 84, sho: 86, pas: 76, dri: 85, def: 42, phy: 84, com: 85 },
    { name: 'Leandro Paredes', pos: 'MID', spec: 'CDM', country: 'Argentina', ovr: 82, pac: 70, sho: 78, pas: 86, dri: 81, def: 80, phy: 80, com: 84 },
    { name: 'Lisandro Martínez', pos: 'DEF', spec: 'CB', country: 'Argentina', ovr: 84, pac: 78, sho: 58, pas: 81, dri: 79, def: 86, phy: 85, com: 86 },
    { name: 'Gonzalo Montiel', pos: 'DEF', spec: 'RB', country: 'Argentina', ovr: 80, pac: 80, sho: 55, pas: 74, dri: 76, def: 79, phy: 80, com: 85 },
    { name: 'Franco Armani', pos: 'GK', spec: 'GK', country: 'Argentina', ovr: 79, pac: 50, sho: 20, pas: 68, dri: 48, def: 80, phy: 78, com: 80 }
  ]
};

module.exports = { AUTHENTIC_BENCHES };
