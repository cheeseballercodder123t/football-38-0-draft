const { p, makeSquad } = require('./squadBuilderHelpers.cjs');

const newLaLigaSquads = [
  // 1. FC Barcelona 2008-09 (Pep Sextuple)
  makeSquad('barcelona-2008-09', 'FC Barcelona', '2008-09', 'FC Barcelona 2008-09 (Pep Guardiola Historic Sextuple)', 'La Liga', 'ESP', '#A50044', '#004D98', 'Tiki-Taka', 'elite', [
    p('fcb09-messi', 'Lionel Messi', null, null, null, 'Argentina', null, 'FWD', 'RW', 96, 95, 94, 91, 98, 38, 72, 95, { id: 'messi-rome', name: 'Rome Header & First Ballon d\'Or', description: '+35% take-on conversion and big-match goals.', shortDesc: '+35% solo goals', rarity: 'Legendary' }),
    p('fcb09-etoo', 'Samuel Eto\'o', null, null, null, 'Cameroon', null, 'FWD', 'ST', 91, 92, 93, 78, 89, 45, 84, 92, { id: 'etoo-rome', name: 'Rome Opening Strike', description: '+30% first 15 mins goal probability.', shortDesc: '+30% early xG', rarity: 'Legendary' }),
    p('fcb09-henry', 'Thierry Henry', null, null, null, 'France', null, 'FWD', 'LW', 90, 91, 90, 84, 90, 36, 78, 92),
    p('fcb09-iniesta', 'Andrés Iniesta', null, null, null, 'Spain', null, 'MID', 'CAM', 92, 85, 82, 95, 96, 62, 65, 96, { id: 'iniesta-stamford', name: 'Stamford Bridge Iniestazo', description: '+35% 93rd min box edge equalizer.', shortDesc: '+35% late winner', rarity: 'Legendary' }),
    p('fcb09-xavi', 'Xavi Hernández', null, null, null, 'Spain', null, 'MID', 'CM', 94, 75, 78, 98, 92, 74, 68, 98, { id: 'xavi-maestro', name: 'Bernabeu 6-2 4-Assist Masterclass', description: '+30% possession retention and through balls.', shortDesc: '+30% through balls', rarity: 'Legendary' }),
    p('fcb09-toure', 'Yaya Touré', null, null, null, 'Ivory Coast', null, 'MID', 'CDM', 87, 80, 82, 85, 84, 86, 92, 88),
    p('fcb09-abidal', 'Éric Abidal', null, null, null, 'France', null, 'DEF', 'LB', 84, 82, 50, 78, 76, 86, 82, 86),
    p('fcb09-puyol', 'Carles Puyol', null, null, null, 'Spain', null, 'DEF', 'CB', 91, 78, 55, 74, 68, 94, 91, 97, { id: 'puyol-armband', name: 'Senyera Kiss at Bernabeu', description: '+30% corner header finish and box clearances.', shortDesc: '+30% header/clearance', rarity: 'Legendary' }),
    p('fcb09-pique', 'Gerard Piqué', null, null, null, 'Spain', null, 'DEF', 'CB', 87, 72, 62, 82, 75, 88, 86, 88),
    p('fcb09-alves', 'Dani Alves', null, null, null, 'Brazil', null, 'DEF', 'RB', 90, 93, 76, 88, 90, 84, 82, 88, { id: 'alves-engine', name: 'Flank Highway Express', description: '+25% overlap crosses to Messi.', shortDesc: '+25% crosses', rarity: 'Legendary' }),
    p('fcb09-valdes', 'Víctor Valdés', null, null, null, 'Spain', null, 'GK', 'GK', 87, 56, 20, 84, 55, 88, 80, 90)
  ]),

  // 2. Real Madrid 2013-14 (La Décima 92:48)
  makeSquad('real-madrid-2013-14', 'Real Madrid', '2013-14', 'Real Madrid 2013-14 (La Décima Ramos 92:48 Champions)', 'La Liga', 'ESP', '#FEBE10', '#00529F', 'Direct Vertical', 'elite', [
    p('rm14-ronaldo', 'Cristiano Ronaldo', null, null, null, 'Portugal', null, 'FWD', 'LW', 97, 95, 98, 86, 94, 38, 88, 96, { id: 'cr7-17goals', name: 'UCL Record 17 Goals', description: '+35% scoring surge in European ties.', shortDesc: '+35% UCL goals', rarity: 'Legendary' }),
    p('rm14-benzema', 'Karim Benzema', null, null, null, 'France', null, 'FWD', 'ST', 88, 83, 89, 84, 87, 38, 78, 88),
    p('rm14-bale', 'Gareth Bale', null, null, null, 'Wales', null, 'FWD', 'RW', 91, 96, 90, 85, 90, 68, 84, 88, { id: 'bale-bartra', name: 'Copa del Rey Touchline Sprint', description: '+35% blistering pace on breakaways.', shortDesc: '+35% sprint speed', rarity: 'Legendary' }),
    p('rm14-dimaria', 'Ángel Di María', null, null, null, 'Argentina', null, 'MID', 'CM', 89, 90, 82, 89, 91, 68, 74, 90, { id: 'dimaria-lisbon', name: 'Man of the Match Lisbon Solo', description: '+30% extra-time dribble breakthrough.', shortDesc: '+30% extra-time dribble', rarity: 'Legendary' }),
    p('rm14-modric', 'Luka Modrić', null, null, null, 'Croatia', null, 'MID', 'CM', 90, 78, 80, 92, 92, 75, 70, 94, { id: 'modric-corner', name: 'The 92:48 Corner Delivery', description: '+30% 90+ min corner delivery accuracy.', shortDesc: '+30% late corners', rarity: 'Legendary' }),
    p('rm14-alonso', 'Xabi Alonso', null, null, null, 'Spain', null, 'MID', 'CDM', 88, 62, 84, 94, 82, 84, 78, 94),
    p('rm14-coentrao', 'Fábio Coentrão', null, null, null, 'Portugal', null, 'DEF', 'LB', 83, 85, 70, 80, 82, 81, 78, 83),
    p('rm14-ramos', 'Sergio Ramos', null, null, null, 'Spain', null, 'DEF', 'CB', 92, 82, 76, 78, 74, 93, 88, 99, { id: 'ramos-9248', name: '92:48 La Décima Miracle', description: '+40% stoppage-time corner headers when trailing.', shortDesc: '+40% clutch headers', rarity: 'Legendary' }),
    p('rm14-varane', 'Raphaël Varane', null, null, null, 'France', null, 'DEF', 'CB', 84, 86, 45, 74, 70, 86, 82, 84),
    p('rm14-carvajal', 'Dani Carvajal', null, null, null, 'Spain', null, 'DEF', 'RB', 84, 86, 55, 78, 80, 82, 80, 85),
    p('rm14-casillas', 'Iker Casillas', null, null, null, 'Spain', null, 'GK', 'GK', 89, 58, 22, 75, 55, 91, 80, 95, { id: 'casillas-saint', name: 'San Iker Trophy Lift', description: '+25% reaction saves inside box.', shortDesc: '+25% close saves', rarity: 'Legendary' })
  ]),

  // 3. Real Madrid 2017-18 (UCL Three-Peat)
  makeSquad('real-madrid-2017-18', 'Real Madrid', '2017-18', 'Real Madrid 2017-18 (Historic UCL Three-Peat Kiev)', 'La Liga', 'ESP', '#FEBE10', '#00529F', 'Direct Vertical', 'elite', [
    p('rm18-ronaldo', 'Cristiano Ronaldo', null, null, null, 'Portugal', null, 'FWD', 'ST', 96, 92, 97, 84, 91, 38, 86, 96, { id: 'cr7-overhead', name: 'Turin Bicycle Kick in the Clouds', description: '+35% acrobatics and header conversion.', shortDesc: '+35% acrobatic xG', rarity: 'Legendary' }),
    p('rm18-benzema', 'Karim Benzema', null, null, null, 'France', null, 'FWD', 'CF', 89, 80, 88, 86, 89, 40, 80, 90),
    p('rm18-isco', 'Isco', null, null, null, 'Spain', null, 'MID', 'CAM', 88, 78, 82, 89, 93, 58, 70, 89),
    p('rm18-kroos', 'Toni Kroos', null, null, null, 'Germany', null, 'MID', 'CM', 91, 56, 85, 96, 85, 78, 72, 97, { id: 'kroos-sniper', name: 'German Precision Compass', description: '+30% pass completion under intense press.', shortDesc: '+30% pass accuracy', rarity: 'Legendary' }),
    p('rm18-modric', 'Luka Modrić', null, null, null, 'Croatia', null, 'MID', 'CM', 92, 80, 82, 94, 94, 76, 70, 96, { id: 'modric-ballondor', name: 'Ballon d\'Or Trivela', description: '+30% trivela through balls and tempo.', shortDesc: '+30% trivela', rarity: 'Legendary' }),
    p('rm18-casemiro', 'Casemiro', null, null, null, 'Brazil', null, 'MID', 'CDM', 89, 66, 75, 80, 76, 91, 92, 91, { id: 'casemiro-tank', name: 'The Bermuda Triangle Wall', description: '+30% tackle retention and defensive blocks.', shortDesc: '+30% blocks', rarity: 'Legendary' }),
    p('rm18-marcelo', 'Marcelo', null, null, null, 'Brazil', null, 'DEF', 'LB', 89, 85, 76, 86, 92, 82, 80, 88, { id: 'marcelo-flair', name: 'Wingback Dribbling Maestro', description: '+30% take-on and cross from the left touchline.', shortDesc: '+30% wing take-on', rarity: 'Legendary' }),
    p('rm18-ramos', 'Sergio Ramos', null, null, null, 'Spain', null, 'DEF', 'CB', 92, 80, 75, 78, 74, 93, 88, 99),
    p('rm18-varane', 'Raphaël Varane', null, null, null, 'France', null, 'DEF', 'CB', 87, 86, 45, 76, 72, 88, 84, 86),
    p('rm18-carvajal', 'Dani Carvajal', null, null, null, 'Spain', null, 'DEF', 'RB', 86, 84, 58, 80, 82, 84, 82, 87),
    p('rm18-navas', 'Keylor Navas', null, null, null, 'Costa Rica', null, 'GK', 'GK', 89, 58, 20, 76, 56, 92, 82, 94, { id: 'navas-clutch', name: 'Three-Peat Miracle Reflexes', description: '+30% reactionary double saves.', shortDesc: '+30% reaction saves', rarity: 'Legendary' })
  ]),

  // 4. Atletico Madrid 2013-14 (Simeone Title & UCL Final)
  makeSquad('atletico-madrid-2013-14', 'Atletico Madrid', '2013-14', 'Atletico Madrid 2013-14 (Simeone Camp Nou Title Champions)', 'La Liga', 'ESP', '#CB3524', '#272E61', 'Low-Block Counter', 'elite', [
    p('atm14-costa', 'Diego Costa', null, null, null, 'Spain', null, 'FWD', 'ST', 89, 85, 91, 75, 84, 48, 92, 90, { id: 'costa-rabid', name: 'Cholismo Beast 36 Goals', description: '+30% physical box finishing and duels.', shortDesc: '+30% box strength', rarity: 'Legendary' }),
    p('atm14-villa', 'David Villa', null, null, null, 'Spain', null, 'FWD', 'ST', 85, 78, 89, 78, 83, 38, 72, 88),
    p('atm14-koke', 'Koke', null, null, null, 'Spain', null, 'MID', 'LM', 86, 76, 78, 88, 84, 76, 80, 88),
    p('atm14-gabi', 'Gabi', null, null, null, 'Spain', null, 'MID', 'CM', 85, 72, 76, 84, 78, 86, 85, 92, { id: 'gabi-captain', name: 'Capitán Cholista Heart', description: '+25% defensive team work rate.', shortDesc: '+25% team press', rarity: 'Epic' }),
    p('atm14-tiago', 'Tiago', null, null, null, 'Portugal', null, 'MID', 'CM', 83, 70, 74, 83, 78, 82, 80, 86),
    p('atm14-ardaturan', 'Arda Turan', null, null, null, 'Turkey', null, 'MID', 'RM', 86, 78, 78, 85, 89, 64, 76, 86, { id: 'arda-magic', name: 'Turkish Delight Footwork', description: '+25% dribble retention under heavy pressure.', shortDesc: '+25% tight dribble', rarity: 'Epic' }),
    p('atm14-filipeluis', 'Filipe Luís', null, null, null, 'Brazil', null, 'DEF', 'LB', 86, 80, 65, 82, 82, 87, 82, 86),
    p('atm14-godin', 'Diego Godín', null, null, null, 'Uruguay', null, 'DEF', 'CB', 90, 72, 55, 70, 65, 94, 90, 95, { id: 'godin-campnou', name: 'Camp Nou Title Header', description: '+35% aerial duel win rate and corner headers.', shortDesc: '+35% corner headers', rarity: 'Legendary' }),
    p('atm14-miranda', 'Miranda', null, null, null, 'Brazil', null, 'DEF', 'CB', 86, 74, 45, 72, 68, 89, 86, 87),
    p('atm14-juanfran', 'Juanfran', null, null, null, 'Spain', null, 'DEF', 'RB', 84, 82, 62, 78, 79, 84, 82, 85),
    p('atm14-courtois', 'Thibaut Courtois', null, null, null, 'Belgium', null, 'GK', 'GK', 89, 52, 20, 75, 50, 91, 85, 90, { id: 'courtois-zamora', name: 'Trofeo Zamora 24 Clean Sheets', description: '+30% save probability inside the box.', shortDesc: '+30% box saves', rarity: 'Legendary' })
  ]),

  // 5. FC Barcelona 2018-19 (Messi Peak Carrying)
  makeSquad('barcelona-2018-19', 'FC Barcelona', '2018-19', 'FC Barcelona 2018-19 (Messi 51 Goals Masterclass)', 'La Liga', 'ESP', '#A50044', '#004D98', 'Tiki-Taka', 'elite', [
    p('fcb19-messi', 'Lionel Messi', null, null, null, 'Argentina', null, 'FWD', 'RW', 98, 92, 98, 97, 99, 42, 74, 99, { id: 'messi-51goals', name: '51 Goals & Free-Kick God', description: '+40% direct free-kick and outside box finishing.', shortDesc: '+40% free-kick/xG', rarity: 'Legendary' }),
    p('fcb19-suarez', 'Luis Suárez', null, null, null, 'Uruguay', null, 'FWD', 'ST', 91, 80, 92, 82, 87, 50, 85, 92),
    p('fcb19-dembele', 'Ousmane Dembélé', null, null, null, 'France', null, 'FWD', 'LW', 85, 94, 78, 80, 90, 38, 62, 78),
    p('fcb19-coutinho', 'Philippe Coutinho', null, null, null, 'Brazil', null, 'MID', 'CAM', 86, 80, 84, 87, 90, 48, 65, 84),
    p('fcb19-busquets', 'Sergio Busquets', null, null, null, 'Spain', null, 'MID', 'CDM', 89, 50, 64, 91, 88, 86, 78, 95, { id: 'busquets-turn', name: 'The Infinite Turn Escape', description: '+30% press evasion in first phase.', shortDesc: '+30% press resist', rarity: 'Legendary' }),
    p('fcb19-rakitic', 'Ivan Rakitić', null, null, null, 'Croatia', null, 'MID', 'CM', 87, 72, 84, 88, 82, 78, 80, 88),
    p('fcb19-alba', 'Jordi Alba', null, null, null, 'Spain', null, 'DEF', 'LB', 88, 93, 72, 84, 84, 80, 76, 86, { id: 'alba-telepathy', name: 'Messi-Alba Cutback Connection', description: '+30% cutback assist conversion to Messi.', shortDesc: '+30% cutback assists', rarity: 'Epic' }),
    p('fcb19-pique', 'Gerard Piqué', null, null, null, 'Spain', null, 'DEF', 'CB', 89, 68, 64, 82, 74, 91, 85, 90),
    p('fcb19-lenglet', 'Clément Lenglet', null, null, null, 'France', null, 'DEF', 'CB', 84, 74, 45, 78, 74, 86, 82, 82),
    p('fcb19-semedo', 'Nélson Semedo', null, null, null, 'Portugal', null, 'DEF', 'RB', 81, 92, 55, 76, 82, 78, 74, 79),
    p('fcb19-terstegen', 'Marc-André ter Stegen', null, null, null, 'Germany', null, 'GK', 'GK', 91, 54, 25, 88, 56, 91, 85, 93, { id: 'mats-wall', name: 'German Sweeper Wall', description: '+30% 1v1 spread save reflex.', shortDesc: '+30% 1v1 saves', rarity: 'Legendary' })
  ]),

  // 6. FC Barcelona 2022-23 (Xavi 26 Clean Sheets)
  makeSquad('barcelona-2022-23', 'FC Barcelona', '2022-23', 'FC Barcelona 2022-23 (Xavi 26 Clean Sheets Title)', 'La Liga', 'ESP', '#A50044', '#004D98', 'Tiki-Taka', 'high', [
    p('fcb23-lewa', 'Robert Lewandowski', null, null, null, 'Poland', null, 'FWD', 'ST', 91, 82, 92, 80, 86, 44, 83, 91, { id: 'lewa-pichichi', name: 'Trofeo Pichichi 23 Goals', description: '+25% penalty box one-touch finishing.', shortDesc: '+25% box xG', rarity: 'Legendary' }),
    p('fcb23-raphinha', 'Raphinha', null, null, null, 'Brazil', null, 'FWD', 'RW', 85, 88, 82, 82, 87, 52, 74, 84),
    p('fcb23-gavi', 'Gavi', null, null, null, 'Spain', null, 'MID', 'CM', 84, 82, 72, 83, 85, 78, 84, 86, { id: 'gavi-warrior', name: 'Golden Boy Heart Duel', description: '+25% ground sliding duel win rate.', shortDesc: '+25% ground duels', rarity: 'Rare' }),
    p('fcb23-pedri', 'Pedri', null, null, null, 'Spain', null, 'MID', 'CAM', 87, 80, 78, 90, 89, 70, 68, 92, { id: 'pedri-pause', name: 'La Pausa Vision', description: '+25% unlocking low blocks with final ball.', shortDesc: '+25% final pass', rarity: 'Epic' }),
    p('fcb23-dejong', 'Frenkie de Jong', null, null, null, 'Netherlands', null, 'MID', 'CM', 88, 83, 76, 89, 90, 80, 79, 90),
    p('fcb23-busquets', 'Sergio Busquets', null, null, null, 'Spain', null, 'MID', 'CDM', 86, 48, 62, 89, 85, 84, 75, 94),
    p('fcb23-balde', 'Alejandro Balde', null, null, null, 'Spain', null, 'DEF', 'LB', 82, 94, 58, 78, 82, 76, 70, 79),
    p('fcb23-christensen', 'Andreas Christensen', null, null, null, 'Denmark', null, 'DEF', 'CB', 84, 72, 45, 84, 76, 86, 80, 86),
    p('fcb23-araujo', 'Ronald Araújo', null, null, null, 'Uruguay', null, 'DEF', 'CB', 87, 86, 50, 70, 68, 89, 90, 88, { id: 'araujo-wall', name: 'El Búfalo 1v1 Lockdown', description: '+30% 1v1 recovery tackle against fast wingers.', shortDesc: '+30% 1v1 defense', rarity: 'Epic' }),
    p('fcb23-kounde', 'Jules Koundé', null, null, null, 'France', null, 'DEF', 'RB', 85, 83, 50, 78, 76, 87, 82, 85),
    p('fcb23-terstegen', 'Marc-André ter Stegen', null, null, null, 'Germany', null, 'GK', 'GK', 89, 52, 22, 86, 54, 90, 82, 92, { id: 'mats-record', name: '26 Clean Sheets La Liga Record', description: '+30% shot deflection and clean sheet retention.', shortDesc: '+30% clean sheets', rarity: 'Legendary' })
  ]),

  // 7. Girona FC 2023-24 (Sensational 3rd Place)
  makeSquad('girona-2023-24', 'Girona FC', '2023-24', 'Girona FC 2023-24 (Sensational 3rd Place UCL Miracle)', 'La Liga', 'ESP', '#CC0000', '#FFFFFF', 'Tiki-Taka', 'high', [
    p('gir24-dovbyk', 'Artem Dovbyk', null, null, null, 'Ukraine', null, 'FWD', 'ST', 86, 84, 88, 72, 80, 40, 88, 86, { id: 'dovbyk-pichichi', name: 'Trofeo Pichichi 24 Goals', description: '+25% penalty box header and poacher finish.', shortDesc: '+25% box goals', rarity: 'Epic' }),
    p('gir24-savinho', 'Savinho', null, null, null, 'Brazil', null, 'FWD', 'LW', 84, 92, 78, 80, 89, 38, 65, 82, { id: 'savinho-dribble', name: 'La Liga Top Take-On King', description: '+30% touchline wing take-on rate.', shortDesc: '+30% take-on', rarity: 'Rare' }),
    p('gir24-tsygankov', 'Viktor Tsygankov', null, null, null, 'Ukraine', null, 'FWD', 'RW', 82, 84, 81, 82, 83, 45, 68, 83),
    p('gir24-aleix', 'Aleix García', null, null, null, 'Spain', null, 'MID', 'CM', 84, 72, 78, 88, 83, 76, 75, 86, { id: 'aleix-compass', name: 'Montilivi Maestro Switch', description: '+25% long diagonal pass accuracy.', shortDesc: '+25% long passes', rarity: 'Rare' }),
    p('gir24-herrera', 'Yangel Herrera', null, null, null, 'Venezuela', null, 'MID', 'CM', 81, 76, 76, 78, 79, 80, 85, 82),
    p('gir24-martin', 'Iván Martín', null, null, null, 'Spain', null, 'MID', 'CM', 80, 76, 74, 82, 82, 72, 74, 80),
    p('gir24-gutierrez', 'Miguel Gutiérrez', null, null, null, 'Spain', null, 'DEF', 'LB', 82, 86, 70, 82, 83, 76, 74, 82),
    p('gir24-blind', 'Daley Blind', null, null, null, 'Netherlands', null, 'DEF', 'CB', 82, 60, 68, 85, 78, 83, 75, 88),
    p('gir24-lopez', 'David López', null, null, null, 'Spain', null, 'DEF', 'CB', 80, 65, 62, 76, 72, 82, 80, 82),
    p('gir24-couto', 'Yan Couto', null, null, null, 'Brazil', null, 'DEF', 'RB', 81, 89, 62, 80, 84, 72, 68, 79),
    p('gir24-gazzaniga', 'Paulo Gazzaniga', null, null, null, 'Argentina', null, 'GK', 'GK', 81, 50, 20, 72, 50, 82, 78, 82)
  ]),

  // 8. Athletic Bilbao 2023-24 (Copa del Rey Champions)
  makeSquad('athletic-bilbao-2023-24', 'Athletic Bilbao', '2023-24', 'Athletic Bilbao 2023-24 (Copa del Rey 40-Year Wait)', 'La Liga', 'ESP', '#EE2524', '#FFFFFF', 'Direct Vertical', 'high', [
    p('ath24-guruzeta', 'Gorka Guruzeta', null, null, null, 'Spain', null, 'FWD', 'ST', 82, 80, 84, 74, 79, 44, 80, 82),
    p('ath24-nicowilliams', 'Nico Williams', null, null, null, 'Spain', null, 'FWD', 'LW', 86, 95, 80, 82, 89, 42, 70, 84, { id: 'nico-rocket', name: 'Euro Finalist Lightning', description: '+35% left-flank burst and 1v1 take-on.', shortDesc: '+35% flank pace', rarity: 'Epic' }),
    p('ath24-inakiwilliams', 'Iñaki Williams', null, null, null, 'Ghana', null, 'FWD', 'RW', 84, 93, 82, 78, 82, 45, 84, 85),
    p('ath24-sancet', 'Oihan Sancet', null, null, null, 'Spain', null, 'MID', 'CAM', 83, 78, 82, 84, 85, 60, 80, 84),
    p('ath24-galarreta', 'Íñigo Ruiz de Galarreta', null, null, null, 'Spain', null, 'MID', 'CM', 81, 74, 70, 83, 80, 78, 75, 84),
    p('ath24-prados', 'Beñat Prados', null, null, null, 'Spain', null, 'MID', 'CM', 80, 78, 65, 78, 78, 81, 80, 80),
    p('ath24-berchiche', 'Yuri Berchiche', null, null, null, 'Spain', null, 'DEF', 'LB', 81, 82, 72, 78, 77, 81, 84, 82),
    p('ath24-vivian', 'Dani Vivian', null, null, null, 'Spain', null, 'DEF', 'CB', 83, 78, 42, 70, 68, 86, 86, 83),
    p('ath24-paredes', 'Aitor Paredes', null, null, null, 'Spain', null, 'DEF', 'CB', 81, 74, 40, 70, 68, 83, 84, 80),
    p('ath24-demarcos', 'Óscar de Marcos', null, null, null, 'Spain', null, 'DEF', 'RB', 81, 80, 68, 78, 78, 80, 78, 86),
    p('ath24-simon', 'Unai Simón', null, null, null, 'Spain', null, 'GK', 'GK', 86, 52, 22, 78, 52, 87, 82, 88, { id: 'simon-zamora', name: 'Trofeo Zamora San Mamés', description: '+25% penalty save and reflex stopping.', shortDesc: '+25% reflexes', rarity: 'Epic' })
  ])
];

module.exports = { newLaLigaSquads };
