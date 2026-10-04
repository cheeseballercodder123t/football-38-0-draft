const { p, makeSquad } = require('./squadBuilderHelpers.cjs');

const newSerieASquads = [
  // 1. Juventus 1995-96 (Lippi Champions League Winners)
  makeSquad('juventus-1995-96', 'Juventus', '1995-96', 'Juventus 1995-96 (Lippi Champions League Winners)', 'Serie A', 'ITA', '#000000', '#FFFFFF', 'Direct Vertical', 'elite', [
    p('juv96-delpiero', 'Alessandro Del Piero', null, null, null, 'Italy', null, 'FWD', 'CF', 90, 85, 91, 88, 92, 40, 72, 92, { id: 'delpiero-zone', name: 'Zona Del Piero Curl', description: '+30% finesse shot accuracy outside box.', shortDesc: '+30% finesse', rarity: 'Legendary' }),
    p('juv96-vialli', 'Gianluca Vialli', null, null, null, 'Italy', null, 'FWD', 'ST', 89, 83, 90, 78, 84, 45, 87, 92, { id: 'vialli-captain', name: 'Stadio Olimpico Glory', description: '+25% leadership and duel win rate.', shortDesc: '+25% leadership', rarity: 'Legendary' }),
    p('juv96-ravanelli', 'Fabrizio Ravanelli', null, null, null, 'Italy', null, 'FWD', 'ST', 86, 84, 88, 74, 80, 48, 85, 87),
    p('juv96-deschamps', 'Didier Deschamps', null, null, null, 'France', null, 'MID', 'CDM', 88, 72, 70, 87, 80, 89, 86, 94, { id: 'deschamps-watercarrier', name: 'The Water Carrier', description: '+20% possession turnover recovery.', shortDesc: '+20% recoveries', rarity: 'Epic' }),
    p('juv96-conte', 'Antonio Conte', null, null, null, 'Italy', null, 'MID', 'CM', 85, 78, 77, 82, 80, 84, 88, 89),
    p('juv96-sousa', 'Paulo Sousa', null, null, null, 'Portugal', null, 'MID', 'CM', 86, 75, 74, 89, 87, 78, 76, 88),
    p('juv96-pessotto', 'Gianluca Pessotto', null, null, null, 'Italy', null, 'DEF', 'LB', 83, 80, 60, 78, 76, 84, 80, 86),
    p('juv96-vierchowod', 'Pietro Vierchowod', null, null, null, 'Italy', null, 'DEF', 'CB', 88, 82, 40, 68, 64, 93, 90, 90, { id: 'vierchowod-tsar', name: 'The Iron Tsar', description: '+25% physical tackle power.', shortDesc: '+25% tackle power', rarity: 'Epic' }),
    p('juv96-ferrara', 'Ciro Ferrara', null, null, null, 'Italy', null, 'DEF', 'CB', 88, 75, 50, 72, 68, 91, 88, 90),
    p('juv96-torricelli', 'Moreno Torricelli', null, null, null, 'Italy', null, 'DEF', 'RB', 83, 84, 62, 75, 77, 82, 85, 84),
    p('juv96-peruzzi', 'Angelo Peruzzi', null, null, null, 'Italy', null, 'GK', 'GK', 89, 58, 22, 74, 52, 90, 88, 92, { id: 'peruzzi-iron', name: 'The Boar Penalty Wall', description: '+30% shootout penalty save rate.', shortDesc: '+30% pen saves', rarity: 'Epic' })
  ]),

  // 2. AC Milan 2002-03 (Ancelotti Old Trafford UCL)
  makeSquad('ac-milan-2002-03', 'AC Milan', '2002-03', 'AC Milan 2002-03 (Ancelotti Old Trafford UCL Champions)', 'Serie A', 'ITA', '#FB090B', '#000000', 'Tiki-Taka', 'elite', [
    p('mil03-sheva', 'Andriy Shevchenko', null, null, null, 'Ukraine', null, 'FWD', 'ST', 92, 91, 93, 80, 89, 42, 82, 93, { id: 'sheva-ice', name: 'Old Trafford Deciding Penalty', description: '+30% match-winning clinical xG.', shortDesc: '+30% decider xG', rarity: 'Legendary' }),
    p('mil03-inzaghi', 'Filippo Inzaghi', null, null, null, 'Italy', null, 'FWD', 'ST', 88, 80, 92, 65, 76, 32, 74, 94, { id: 'inzaghi-offside', name: 'Born Offside Instinct', description: '+35% penalty box tap-in conversion.', shortDesc: '+35% poacher xG', rarity: 'Legendary' }),
    p('mil03-ruicosta', 'Rui Costa', null, null, null, 'Portugal', null, 'MID', 'CAM', 89, 78, 82, 94, 91, 48, 70, 92, { id: 'ruicosta-vision', name: 'Il Maestro Assist Vision', description: '+25% through ball precision.', shortDesc: '+25% through ball', rarity: 'Legendary' }),
    p('mil03-seedorf', 'Clarence Seedorf', null, null, null, 'Netherlands', null, 'MID', 'CM', 89, 79, 85, 89, 90, 78, 86, 92, { id: 'seedorf-mrcl', name: 'Mr. Champions League', description: '+20% midfield control in UCL matches.', shortDesc: '+20% UCL control', rarity: 'Legendary' }),
    p('mil03-pirlo', 'Andrea Pirlo', null, null, null, 'Italy', null, 'MID', 'CDM', 90, 68, 82, 96, 90, 72, 68, 96, { id: 'pirlo-regista', name: 'Architect Deep Regista', description: '+30% deep ball counter launching.', shortDesc: '+30% deep passes', rarity: 'Legendary' }),
    p('mil03-gattuso', 'Gennaro Gattuso', null, null, null, 'Italy', null, 'MID', 'CDM', 87, 75, 62, 78, 74, 92, 94, 92, { id: 'gattuso-braveheart', name: 'Ringhio Rabid Press', description: '+30% midfield tackle and duel win rate.', shortDesc: '+30% duels', rarity: 'Legendary' }),
    p('mil03-kaladze', 'Kakha Kaladze', null, null, null, 'Georgia', null, 'DEF', 'LB', 83, 76, 52, 76, 74, 85, 84, 83),
    p('mil03-maldini', 'Paolo Maldini', null, null, null, 'Italy', null, 'DEF', 'CB', 94, 82, 58, 84, 80, 96, 86, 98, { id: 'maldini-immortal', name: 'Il Capitano Perfection', description: '+30% sliding tackle precision with 0 fouls.', shortDesc: '+30% clean tackles', rarity: 'Legendary' }),
    p('mil03-nesta', 'Alessandro Nesta', null, null, null, 'Italy', null, 'DEF', 'CB', 93, 83, 40, 76, 75, 96, 85, 95, { id: 'nesta-art', name: 'The Art of Defending', description: '+25% defensive interception success.', shortDesc: '+25% interceptions', rarity: 'Legendary' }),
    p('mil03-costacurta', 'Alessandro Costacurta', null, null, null, 'Italy', null, 'DEF', 'RB', 85, 72, 45, 78, 70, 89, 82, 92),
    p('mil03-dida', 'Dida', null, null, null, 'Brazil', null, 'GK', 'GK', 88, 54, 20, 72, 52, 90, 88, 91, { id: 'dida-penalty', name: 'Old Trafford Shootout Wall', description: '+35% penalty shootout save rate.', shortDesc: '+35% pen saves', rarity: 'Epic' })
  ]),

  // 3. Juventus 2014-15 (Allegri Double & Berlin UCL Final)
  makeSquad('juventus-2014-15', 'Juventus', '2014-15', 'Juventus 2014-15 (Allegri Double & UCL Finalists)', 'Serie A', 'ITA', '#000000', '#FFFFFF', 'Low-Block Counter', 'elite', [
    p('juv15-tevez', 'Carlos Tévez', null, null, null, 'Argentina', null, 'FWD', 'ST', 88, 84, 89, 82, 88, 50, 86, 90, { id: 'tevez-apache', name: 'El Apache Relentless Drive', description: '+25% high-intensity pressing and box finish.', shortDesc: '+25% drive xG', rarity: 'Epic' }),
    p('juv15-morata', 'Álvaro Morata', null, null, null, 'Spain', null, 'FWD', 'ST', 83, 85, 84, 75, 82, 35, 78, 82),
    p('juv15-vidal', 'Arturo Vidal', null, null, null, 'Chile', null, 'MID', 'CAM', 87, 78, 83, 82, 82, 87, 88, 88),
    p('juv15-pogba', 'Paul Pogba', null, null, null, 'France', null, 'MID', 'CM', 88, 78, 84, 88, 90, 76, 88, 87, { id: 'pogba-pogboom', name: 'Pogboom Thunderstrike', description: '+30% outside box long shot conversion.', shortDesc: '+30% long shots', rarity: 'Legendary' }),
    p('juv15-marchisio', 'Claudio Marchisio', null, null, null, 'Italy', null, 'MID', 'CM', 86, 78, 80, 86, 85, 82, 80, 88),
    p('juv15-pirlo', 'Andrea Pirlo', null, null, null, 'Italy', null, 'MID', 'CDM', 87, 56, 78, 94, 88, 68, 62, 95, { id: 'pirlo-maestro', name: 'Il Maestro Farewell', description: '+30% free kick conversion rate.', shortDesc: '+30% free kick', rarity: 'Legendary' }),
    p('juv15-evra', 'Patrice Evra', null, null, null, 'France', null, 'DEF', 'LB', 83, 78, 62, 78, 80, 83, 78, 86),
    p('juv15-chiellini', 'Giorgio Chiellini', null, null, null, 'Italy', null, 'DEF', 'CB', 89, 74, 45, 68, 62, 93, 91, 91, { id: 'chiellini-gladiator', name: 'Gladiator Box Defense', description: '+25% box duel and header clearances.', shortDesc: '+25% box clearances', rarity: 'Legendary' }),
    p('juv15-bonucci', 'Leonardo Bonucci', null, null, null, 'Italy', null, 'DEF', 'CB', 87, 70, 58, 84, 74, 89, 83, 88),
    p('juv15-lichtsteiner', 'Stephan Lichtsteiner', null, null, null, 'Switzerland', null, 'DEF', 'RB', 83, 84, 66, 78, 77, 82, 85, 84),
    p('juv15-buffon', 'Gianluigi Buffon', null, null, null, 'Italy', null, 'GK', 'GK', 92, 50, 20, 76, 50, 93, 86, 98, { id: 'buffon-superman', name: 'Superman Reflexes', description: '+30% reaction saves inside 6-yard box.', shortDesc: '+30% close saves', rarity: 'Legendary' })
  ]),

  // 4. Inter Milan 2020-21 (Conte Scudetto)
  makeSquad('inter-2020-21', 'Inter Milan', '2020-21', 'Inter Milan 2020-21 (Conte Scudetto Ending Juve Run)', 'Serie A', 'ITA', '#0068A8', '#000000', 'Direct Vertical', 'elite', [
    p('int21-lukaku', 'Romelu Lukaku', null, null, null, 'Belgium', null, 'FWD', 'ST', 89, 86, 88, 78, 82, 38, 92, 88, { id: 'lukaku-tank', name: 'LuLa Bulldozer Pace', description: '+30% counter-attack transition power.', shortDesc: '+30% counter strength', rarity: 'Epic' }),
    p('int21-lautaro', 'Lautaro Martínez', null, null, null, 'Argentina', null, 'FWD', 'ST', 87, 84, 87, 78, 86, 48, 83, 86, { id: 'lautaro-bull', name: 'El Toro Tenacity', description: '+25% second-chance box finishing.', shortDesc: '+25% second balls', rarity: 'Epic' }),
    p('int21-barella', 'Nicolò Barella', null, null, null, 'Italy', null, 'MID', 'CM', 87, 82, 76, 85, 86, 80, 82, 86, { id: 'barella-dynamo', name: 'Sardinian Dynamo', description: '+20% stamina recovery and transition duel wins.', shortDesc: '+20% b2b engine', rarity: 'Epic' }),
    p('int21-brozovic', 'Marcelo Brozović', null, null, null, 'Croatia', null, 'MID', 'CDM', 86, 74, 76, 87, 82, 84, 85, 87, { id: 'brozo-epic', name: 'Epic Crocodile Slide', description: '+25% ground duel tackle recovery.', shortDesc: '+25% ground tackles', rarity: 'Rare' }),
    p('int21-eriksen', 'Christian Eriksen', null, null, null, 'Denmark', null, 'MID', 'CAM', 85, 70, 82, 90, 84, 52, 65, 88),
    p('int21-perisic', 'Ivan Perišić', null, null, null, 'Croatia', null, 'DEF', 'LWB', 84, 86, 81, 80, 83, 74, 80, 84),
    p('int21-hakimi', 'Achraf Hakimi', null, null, null, 'Morocco', null, 'DEF', 'RWB', 86, 95, 75, 80, 83, 76, 78, 82, { id: 'hakimi-rocket', name: '36km/h Flank Jet', description: '+30% overlap crossing speed.', shortDesc: '+30% wing pace', rarity: 'Epic' }),
    p('int21-bastoni', 'Alessandro Bastoni', null, null, null, 'Italy', null, 'DEF', 'CB', 85, 76, 45, 82, 78, 86, 83, 85),
    p('int21-devrij', 'Stefan de Vrij', null, null, null, 'Netherlands', null, 'DEF', 'CB', 86, 70, 40, 78, 72, 89, 82, 87),
    p('int21-skriniar', 'Milan Škriniar', null, null, null, 'Slovakia', null, 'DEF', 'CB', 86, 72, 38, 72, 66, 89, 87, 86),
    p('int21-handanovic', 'Samir Handanovič', null, null, null, 'Slovenia', null, 'GK', 'GK', 87, 50, 20, 74, 50, 88, 80, 88)
  ]),

  // 5. AC Milan 2021-22 (Pioli 11-Yr Scudetto Wait)
  makeSquad('ac-milan-2021-22', 'AC Milan', '2021-22', 'AC Milan 2021-22 (Pioli 11-Yr Scudetto Wait Return)', 'Serie A', 'ITA', '#FB090B', '#000000', 'Direct Vertical', 'high', [
    p('mil22-giroud', 'Olivier Giroud', null, null, null, 'France', null, 'FWD', 'ST', 84, 68, 86, 74, 76, 42, 88, 89, { id: 'giroud-derby', name: 'Giroud Si È Girato', description: '+30% derby and title-deciding box goals.', shortDesc: '+30% clutch goals', rarity: 'Epic' }),
    p('mil22-leao', 'Rafael Leão', null, null, null, 'Portugal', null, 'FWD', 'LW', 87, 94, 82, 78, 90, 35, 78, 84, { id: 'leao-smile', name: 'Smiling Flank Sorcery', description: '+35% take-on conversion down the left wing.', shortDesc: '+35% wing take-on', rarity: 'Legendary' }),
    p('mil22-saelemaekers', 'Alexis Saelemaekers', null, null, null, 'Belgium', null, 'MID', 'RM', 80, 82, 70, 77, 81, 65, 72, 78),
    p('mil22-kessie', 'Franck Kessié', null, null, null, 'Ivory Coast', null, 'MID', 'CM', 85, 78, 78, 80, 81, 84, 90, 86),
    p('mil22-tonali', 'Sandro Tonali', null, null, null, 'Italy', null, 'MID', 'CM', 84, 82, 76, 83, 82, 81, 82, 85, { id: 'tonali-heart', name: 'Cuore Rossonero Tackle', description: '+25% stoppage-time transition duel wins.', shortDesc: '+25% late duels', rarity: 'Rare' }),
    p('mil22-bennacer', 'Ismaël Bennacer', null, null, null, 'Algeria', null, 'MID', 'CDM', 83, 78, 70, 84, 86, 80, 75, 83),
    p('mil22-theo', 'Theo Hernández', null, null, null, 'France', null, 'DEF', 'LB', 87, 95, 75, 80, 84, 80, 84, 85, { id: 'theo-coasttocoast', name: 'Coast-to-Coast Locomotive', description: '+35% full pitch box-to-box solo runs.', shortDesc: '+35% solo run pace', rarity: 'Legendary' }),
    p('mil22-tomori', 'Fikayo Tomori', null, null, null, 'England', null, 'DEF', 'CB', 84, 86, 40, 70, 68, 86, 84, 83),
    p('mil22-kalulu', 'Pierre Kalulu', null, null, null, 'France', null, 'DEF', 'CB', 81, 84, 45, 72, 74, 82, 78, 80),
    p('mil22-calabria', 'Davide Calabria', null, null, null, 'Italy', null, 'DEF', 'RB', 81, 80, 62, 78, 78, 81, 76, 82),
    p('mil22-maignan', 'Mike Maignan', null, null, null, 'France', null, 'GK', 'GK', 87, 58, 25, 84, 55, 88, 84, 90, { id: 'maignan-magic', name: 'Magic Mike Distribution', description: '+25% long pass assists and penalty saves.', shortDesc: '+25% keeper assists', rarity: 'Epic' })
  ]),

  // 6. Inter Milan 2023-24 (Inzaghi 2nd Star 20th Scudetto)
  makeSquad('inter-2023-24', 'Inter Milan', '2023-24', 'Inter Milan 2023-24 (Inzaghi 20th Scudetto Second Star)', 'Serie A', 'ITA', '#0068A8', '#000000', 'Tiki-Taka', 'elite', [
    p('int24-lautaro', 'Lautaro Martínez', null, null, null, 'Argentina', null, 'FWD', 'ST', 90, 85, 91, 80, 88, 52, 85, 90, { id: 'lautaro-capocannoniere', name: 'Capocannoniere 24 Goals', description: '+25% first-time box shot conversion.', shortDesc: '+25% first-time xG', rarity: 'Legendary' }),
    p('int24-thuram', 'Marcus Thuram', null, null, null, 'France', null, 'FWD', 'ST', 85, 89, 82, 78, 85, 45, 84, 83),
    p('int24-calhanoglu', 'Hakan Çalhanoğlu', null, null, null, 'Turkey', null, 'MID', 'CDM', 87, 72, 85, 91, 84, 80, 76, 92, { id: 'calha-ice', name: '17/17 Perfect Penalties', description: '+35% penalty conversion accuracy.', shortDesc: '+35% pen xG', rarity: 'Legendary' }),
    p('int24-barella', 'Nicolò Barella', null, null, null, 'Italy', null, 'MID', 'CM', 88, 82, 78, 86, 87, 81, 83, 88),
    p('int24-mkhitaryan', 'Henrikh Mkhitaryan', null, null, null, 'Armenia', null, 'MID', 'CM', 84, 76, 80, 84, 85, 68, 70, 86),
    p('int24-dimarco', 'Federico Dimarco', null, null, null, 'Italy', null, 'DEF', 'LWB', 86, 84, 82, 88, 83, 76, 75, 86, { id: 'dimarco-laser', name: 'Verona 56m Wonderstrike', description: '+30% crossing and direct volley conversion.', shortDesc: '+30% crosses/volleys', rarity: 'Epic' }),
    p('int24-darmian', 'Matteo Darmian', null, null, null, 'Italy', null, 'DEF', 'RWB', 82, 76, 68, 78, 76, 83, 78, 85),
    p('int24-bastoni', 'Alessandro Bastoni', null, null, null, 'Italy', null, 'DEF', 'CB', 87, 78, 48, 85, 80, 88, 85, 87, { id: 'bastoni-cross', name: 'Overlapping CB Delivery', description: '+25% deep open play assist threat.', shortDesc: '+25% cb assists', rarity: 'Epic' }),
    p('int24-acerbi', 'Francesco Acerbi', null, null, null, 'Italy', null, 'DEF', 'CB', 84, 62, 45, 74, 68, 87, 85, 88),
    p('int24-pavard', 'Benjamin Pavard', null, null, null, 'France', null, 'DEF', 'CB', 84, 78, 68, 78, 78, 86, 80, 85),
    p('int24-sommer', 'Yann Sommer', null, null, null, 'Switzerland', null, 'GK', 'GK', 86, 52, 22, 80, 52, 87, 76, 89)
  ]),

  // 7. AS Roma 2017-18 (Remontada UCL Semis)
  makeSquad('as-roma-2017-18', 'AS Roma', '2017-18', 'AS Roma 2017-18 (Barca 3-0 Remontada UCL Semis)', 'Serie A', 'ITA', '#8E1F2F', '#F0BC42', 'Direct Vertical', 'high', [
    p('rom18-dzeko', 'Edin Džeko', null, null, null, 'Bosnia', null, 'FWD', 'ST', 86, 75, 88, 76, 80, 42, 86, 88, { id: 'dzeko-remontada', name: 'Olimpico Remontada Spark', description: '+30% aerial header finish in European nights.', shortDesc: '+30% header xG', rarity: 'Epic' }),
    p('rom18-elshaarawy', 'Stephan El Shaarawy', null, null, null, 'Italy', null, 'FWD', 'LW', 82, 86, 79, 77, 84, 48, 68, 82),
    p('rom18-under', 'Cengiz Ünder', null, null, null, 'Turkey', null, 'FWD', 'RW', 80, 84, 78, 76, 83, 36, 64, 78),
    p('rom18-nainggolan', 'Radja Nainggolan', null, null, null, 'Belgium', null, 'MID', 'CAM', 86, 80, 84, 82, 84, 83, 88, 88, { id: 'radja-ninja', name: 'Il Ninja Rocket', description: '+25% ferocious long-range thunderbolts.', shortDesc: '+25% long shots', rarity: 'Epic' }),
    p('rom18-derossi', 'Daniele De Rossi', null, null, null, 'Italy', null, 'MID', 'CDM', 85, 66, 76, 84, 78, 86, 86, 92, { id: 'derossi-heart', name: 'Capitan Futuro Grit', description: '+25% leadership tackle boost.', shortDesc: '+25% leader tackles', rarity: 'Legendary' }),
    p('rom18-strootman', 'Kevin Strootman', null, null, null, 'Netherlands', null, 'MID', 'CM', 82, 70, 76, 82, 78, 80, 84, 84),
    p('rom18-kolarov', 'Aleksandar Kolarov', null, null, null, 'Serbia', null, 'DEF', 'LB', 83, 76, 84, 84, 80, 80, 82, 85, { id: 'kolarov-hammer', name: 'Left-Foot Sledgehammer', description: '+30% direct free-kick power.', shortDesc: '+30% free kick', rarity: 'Rare' }),
    p('rom18-fazio', 'Federico Fazio', null, null, null, 'Argentina', null, 'DEF', 'CB', 82, 54, 40, 72, 60, 85, 88, 82),
    p('rom18-manolas', 'Kostas Manolas', null, null, null, 'Greece', null, 'DEF', 'CB', 85, 84, 30, 64, 62, 88, 84, 86, { id: 'manolas-greek-god', name: 'The Greek God in Rome', description: '+35% winning goal headers on corners.', shortDesc: '+35% corner goals', rarity: 'Epic' }),
    p('rom18-florenzi', 'Alessandro Florenzi', null, null, null, 'Italy', null, 'DEF', 'RB', 82, 84, 75, 80, 81, 78, 76, 83),
    p('rom18-alisson', 'Alisson Becker', null, null, null, 'Brazil', null, 'GK', 'GK', 87, 56, 20, 82, 58, 88, 84, 90)
  ]),

  // 8. Atalanta BC 2023-24 (Dublin Europa League Champions)
  makeSquad('atalanta-2023-24', 'Atalanta BC', '2023-24', 'Atalanta BC 2023-24 (Dublin Europa League Champions)', 'Serie A', 'ITA', '#1F2421', '#005CA9', 'Gegenpress', 'high', [
    p('ata24-lookman', 'Ademola Lookman', null, null, null, 'Nigeria', null, 'FWD', 'LW', 86, 89, 86, 80, 89, 45, 72, 88, { id: 'lookman-hattrick', name: 'Dublin Final Hat-Trick', description: '+35% solo dribble and finish in finals.', shortDesc: '+35% final xG', rarity: 'Legendary' }),
    p('ata24-scamacca', 'Gianluca Scamacca', null, null, null, 'Italy', null, 'FWD', 'ST', 83, 76, 86, 74, 80, 38, 88, 82),
    p('ata24-deketelaere', 'Charles De Ketelaere', null, null, null, 'Belgium', null, 'MID', 'CAM', 83, 80, 80, 84, 86, 55, 78, 82),
    p('ata24-koopmeiners', 'Teun Koopmeiners', null, null, null, 'Netherlands', null, 'MID', 'CM', 85, 75, 85, 86, 82, 78, 82, 86, { id: 'koop-artillery', name: 'Dutch Midfield Artillery', description: '+25% direct free kick and long shot threat.', shortDesc: '+25% long shots', rarity: 'Epic' }),
    p('ata24-ederson', 'Éderson', null, null, null, 'Brazil', null, 'MID', 'CM', 83, 80, 74, 80, 82, 83, 85, 84),
    p('ata24-deroon', 'Marten de Roon', null, null, null, 'Netherlands', null, 'MID', 'CDM', 82, 70, 68, 78, 75, 84, 85, 85),
    p('ata24-ruggeri', 'Matteo Ruggeri', null, null, null, 'Italy', null, 'DEF', 'LWB', 80, 82, 64, 78, 78, 78, 76, 78),
    p('ata24-zappacosta', 'Davide Zappacosta', null, null, null, 'Italy', null, 'DEF', 'RWB', 81, 84, 70, 77, 80, 78, 78, 81),
    p('ata24-kolasinac', 'Sead Kolašinac', null, null, null, 'Bosnia', null, 'DEF', 'CB', 82, 74, 62, 72, 70, 84, 90, 84),
    p('ata24-hien', 'Isak Hien', null, null, null, 'Sweden', null, 'DEF', 'CB', 82, 78, 38, 68, 65, 85, 87, 81),
    p('ata24-musso', 'Juan Musso', null, null, null, 'Argentina', null, 'GK', 'GK', 82, 50, 20, 70, 48, 84, 78, 83)
  ])
];

module.exports = { newSerieASquads };
