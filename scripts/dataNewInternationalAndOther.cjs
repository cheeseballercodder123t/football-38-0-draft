const { p, makeSquad } = require('./squadBuilderHelpers.cjs');

const newInternationalAndOtherSquads = [
  // 1. Brazil 1970 (The Greatest Team in History)
  makeSquad('brazil-1970', 'Brazil', '1970', 'Brazil 1970 (Pelé & The Greatest World Cup Team)', 'International', 'BRA', '#FED100', '#009739', 'Tiki-Taka', 'elite', [
    p('bra70-pele', 'Pelé', null, null, null, 'Brazil', null, 'FWD', 'CF', 98, 95, 98, 94, 97, 48, 88, 99, { id: 'pele-king', name: 'O Rei Azteca Masterpiece', description: '+40% match-winning flair and assist vision.', shortDesc: '+40% GOAT xG', rarity: 'Legendary' }),
    p('bra70-jairzinho', 'Jairzinho', null, null, null, 'Brazil', null, 'FWD', 'RW', 92, 94, 91, 84, 92, 45, 84, 92, { id: 'jair-furacao', name: 'Furacão Scoring in Every Game', description: '+35% scoring in every single match.', shortDesc: '+35% every game goal', rarity: 'Legendary' }),
    p('bra70-tostao', 'Tostão', null, null, null, 'Brazil', null, 'FWD', 'ST', 90, 84, 90, 88, 92, 42, 74, 92),
    p('bra70-rivellino', 'Rivellino', null, null, null, 'Brazil', null, 'MID', 'LM', 91, 86, 92, 92, 93, 50, 78, 92, { id: 'rive-patada', name: 'Patada Atômica & Elastic Dribble', description: '+35% elastico dribble and long range thunder.', shortDesc: '+35% elastico/shot', rarity: 'Legendary' }),
    p('bra70-gerson', 'Gérson', null, null, null, 'Brazil', null, 'MID', 'CM', 92, 75, 84, 97, 88, 68, 76, 96, { id: 'gerson-golden', name: 'Canhotinha de Ouro Long Pass', description: '+35% 50m pinpoint long ball assist.', shortDesc: '+35% long passes', rarity: 'Legendary' }),
    p('bra70-clodoaldo', 'Clodoaldo', null, null, null, 'Brazil', null, 'MID', 'CDM', 87, 82, 72, 86, 90, 84, 82, 90, { id: 'clodo-dribble', name: '4-Man Dribble in Italy Final', description: '+30% deep midfield solo evasion.', shortDesc: '+30% deep dribble', rarity: 'Legendary' }),
    p('bra70-everaldo', 'Everaldo', null, null, null, 'Brazil', null, 'DEF', 'LB', 84, 82, 55, 78, 76, 84, 82, 85),
    p('bra70-brito', 'Brito', null, null, null, 'Brazil', null, 'DEF', 'CB', 85, 76, 42, 72, 68, 88, 88, 86),
    p('bra70-piazza', 'Piazza', null, null, null, 'Brazil', null, 'DEF', 'CB', 85, 74, 55, 80, 74, 87, 84, 88),
    p('bra70-carlosalberto', 'Carlos Alberto', null, null, null, 'Brazil', null, 'DEF', 'RB', 93, 89, 82, 88, 88, 89, 86, 96, { id: 'capita-goal', name: 'The Greatest World Cup Goal', description: '+35% overlap blast from edge of the box.', shortDesc: '+35% captain goal', rarity: 'Legendary' }),
    p('bra70-felix', 'Félix', null, null, null, 'Brazil', null, 'GK', 'GK', 83, 54, 20, 72, 50, 84, 78, 84)
  ]),

  // 2. Argentina 1986 (Maradona Aztec Triumph)
  makeSquad('argentina-1986', 'Argentina', '1986', 'Argentina 1986 (Maradona Aztec Solo World Champions)', 'International', 'ARG', '#75AADB', '#FFFFFF', 'Direct Vertical', 'elite', [
    p('arg86-maradona', 'Diego Maradona', null, null, null, 'Argentina', null, 'MID', 'CAM', 99, 93, 96, 98, 99, 52, 86, 99, { id: 'diego-century', name: 'Goal of the Century (5-Man Solo)', description: '+45% conversion when taking on 3+ defenders.', shortDesc: '+45% solo legend', rarity: 'Legendary' }),
    p('arg86-valdano', 'Jorge Valdano', null, null, null, 'Argentina', null, 'FWD', 'ST', 87, 82, 89, 80, 84, 45, 84, 88, { id: 'valdano-final', name: 'Azteca Final Strike', description: '+25% counter-attack finish in finals.', shortDesc: '+25% final xG', rarity: 'Epic' }),
    p('arg86-burruchaga', 'Jorge Burruchaga', null, null, null, 'Argentina', null, 'MID', 'CAM', 87, 84, 86, 85, 86, 60, 80, 92, { id: 'burru-84th', name: '84th Min World Cup Winner', description: '+35% 80+ min winning goal breakaway.', shortDesc: '+35% late winner', rarity: 'Legendary' }),
    p('arg86-enrique', 'Héctor Enrique', null, null, null, 'Argentina', null, 'MID', 'CM', 83, 78, 74, 82, 80, 80, 82, 84),
    p('arg86-giusti', 'Ricardo Giusti', null, null, null, 'Argentina', null, 'MID', 'CM', 82, 76, 70, 80, 77, 83, 84, 85),
    p('arg86-batista', 'Sergio Batista', null, null, null, 'Argentina', null, 'MID', 'CDM', 84, 68, 65, 80, 75, 88, 88, 86),
    p('arg86-olarticoechea', 'Julio Olarticoechea', null, null, null, 'Argentina', null, 'DEF', 'LWB', 83, 84, 65, 78, 79, 82, 82, 84),
    p('arg86-ruggeri', 'Oscar Ruggeri', null, null, null, 'Argentina', null, 'DEF', 'CB', 88, 76, 45, 72, 68, 91, 91, 92, { id: 'ruggeri-cabezon', name: 'El Cabezón Iron Marking', description: '+25% box duel win rate against opposing striker.', shortDesc: '+25% box marking', rarity: 'Legendary' }),
    p('arg86-brown', 'José Luis Brown', null, null, null, 'Argentina', null, 'DEF', 'CB', 84, 70, 62, 70, 65, 86, 88, 90, { id: 'brown-dislocated', name: 'Dislocated Shoulder Header Goal', description: '+30% set piece header with injury courage.', shortDesc: '+30% header courage', rarity: 'Epic' }),
    p('arg86-cuciuffo', 'José Luis Cuciuffo', null, null, null, 'Argentina', null, 'DEF', 'CB', 82, 76, 45, 72, 70, 84, 84, 83),
    p('arg86-pumpido', 'Nery Pumpido', null, null, null, 'Argentina', null, 'GK', 'GK', 84, 52, 20, 72, 50, 85, 80, 86)
  ]),

  // 3. Netherlands 1974 (Cruyff Total Football)
  makeSquad('netherlands-1974', 'Netherlands', '1974', 'Netherlands 1974 (Cruyff Total Football Revolution)', 'International', 'NED', '#F36C21', '#FFFFFF', 'Tiki-Taka', 'elite', [
    p('ned74-cruyff', 'Johan Cruyff', null, null, null, 'Netherlands', null, 'FWD', 'CF', 97, 93, 94, 96, 98, 55, 80, 98, { id: 'cruyff-turn', name: 'The Iconic Cruyff Turn', description: '+40% evasion and box penetration.', shortDesc: '+40% cruyff turn', rarity: 'Legendary' }),
    p('ned74-rep', 'Johnny Rep', null, null, null, 'Netherlands', null, 'FWD', 'RW', 87, 88, 88, 78, 86, 45, 78, 86),
    p('ned74-rensenbrink', 'Rob Rensenbrink', null, null, null, 'Netherlands', null, 'FWD', 'LW', 89, 87, 90, 84, 91, 40, 76, 90, { id: 'rob-serpent', name: 'The Snake Inside Cut', description: '+30% curling left-foot precision.', shortDesc: '+30% curling shots', rarity: 'Epic' }),
    p('ned74-neeskens', 'Johan Neeskens', null, null, null, 'Netherlands', null, 'MID', 'CM', 91, 84, 88, 88, 85, 88, 92, 94, { id: 'neeskens-second', name: 'Johan Segon Iron Press', description: '+30% penalty power and box-to-box duel wins.', shortDesc: '+30% b2b duels', rarity: 'Legendary' }),
    p('ned74-vanhanegem', 'Willem van Hanegem', null, null, null, 'Netherlands', null, 'MID', 'CM', 90, 68, 84, 95, 88, 80, 82, 94, { id: 'kromme-pass', name: 'De Kromme Outside Curve', description: '+30% curve assist through defensive line.', shortDesc: '+30% curved passes', rarity: 'Legendary' }),
    p('ned74-jansen', 'Wim Jansen', null, null, null, 'Netherlands', null, 'MID', 'CDM', 85, 76, 70, 84, 82, 85, 82, 88),
    p('ned74-krol', 'Ruud Krol', null, null, null, 'Netherlands', null, 'DEF', 'LB', 90, 84, 76, 88, 84, 90, 85, 92, { id: 'krol-libero', name: 'Modern Overlapping Libero', description: '+25% defensive orchestration and overlap.', shortDesc: '+25% libero overlap', rarity: 'Legendary' }),
    p('ned74-haan', 'Arie Haan', null, null, null, 'Netherlands', null, 'DEF', 'CB', 87, 76, 86, 84, 78, 86, 86, 88, { id: 'haan-torpedo', name: '40-Yard Torpedo Blaster', description: '+30% long-range shot conversion.', shortDesc: '+30% long shot power', rarity: 'Epic' }),
    p('ned74-rijsbergen', 'Wim Rijsbergen', null, null, null, 'Netherlands', null, 'DEF', 'CB', 84, 75, 45, 78, 72, 86, 84, 85),
    p('ned74-suurbier', 'Wim Suurbier', null, null, null, 'Netherlands', null, 'DEF', 'RB', 85, 88, 66, 82, 80, 84, 84, 86),
    p('ned74-jongbloed', 'Jan Jongbloed', null, null, null, 'Netherlands', null, 'GK', 'GK', 83, 62, 20, 82, 60, 82, 74, 86, { id: 'jan-sweeper', name: 'First Modern Sweeper Keeper', description: '+25% box clearance out to midfield.', shortDesc: '+25% sweep clearance', rarity: 'Rare' })
  ]),

  // 4. France 2018 (Moscow World Champions)
  makeSquad('france-2018', 'France', '2018', 'France 2018 (Mbappé Flash Moscow World Champions)', 'International', 'FRA', '#002654', '#ED2939', 'Direct Vertical', 'elite', [
    p('fra18-mbappe', 'Kylian Mbappé', null, null, null, 'France', null, 'FWD', 'RW', 91, 97, 88, 82, 92, 38, 78, 90, { id: 'mbappe-kazan', name: 'Kazan 38km/h Argentina Solo', description: '+35% sprint counter breakaway conversion.', shortDesc: '+35% sprint breakaway', rarity: 'Legendary' }),
    p('fra18-giroud', 'Olivier Giroud', null, null, null, 'France', null, 'FWD', 'ST', 84, 68, 85, 78, 78, 45, 89, 86),
    p('fra18-griezmann', 'Antoine Griezmann', null, null, null, 'France', null, 'FWD', 'CAM', 90, 84, 88, 88, 89, 62, 72, 92, { id: 'grizou-brain', name: 'Tournament Playmaker MVP', description: '+30% set piece assist and transition linkup.', shortDesc: '+30% set piece assists', rarity: 'Legendary' }),
    p('fra18-matuidi', 'Blaise Matuidi', null, null, null, 'France', null, 'MID', 'LM', 85, 80, 72, 78, 80, 85, 86, 86),
    p('fra18-pogba', 'Paul Pogba', null, null, null, 'France', null, 'MID', 'CM', 89, 78, 85, 92, 90, 75, 88, 92, { id: 'pogba-final', name: 'Final Curler & 70m Switch', description: '+30% diagonal through-ball accuracy.', shortDesc: '+30% long vision', rarity: 'Legendary' }),
    p('fra18-kante', 'N\'Golo Kanté', null, null, null, 'France', null, 'MID', 'CDM', 91, 82, 68, 82, 84, 94, 88, 94, { id: 'kante-everywhere', name: 'Praise Kanté Everywhere', description: '+35% midfield interception and duel recovery.', shortDesc: '+35% recoveries', rarity: 'Legendary' }),
    p('fra18-lucas', 'Lucas Hernandez', null, null, null, 'France', null, 'DEF', 'LB', 84, 82, 55, 76, 78, 86, 84, 86),
    p('fra18-umtiti', 'Samuel Umtiti', null, null, null, 'France', null, 'DEF', 'CB', 87, 75, 62, 78, 74, 88, 85, 88, { id: 'umtiti-semi', name: 'Semi-Final Corner Winner', description: '+25% defensive aerial duel win rate.', shortDesc: '+25% aerial clearances', rarity: 'Epic' }),
    p('fra18-varane', 'Raphaël Varane', null, null, null, 'France', null, 'DEF', 'CB', 88, 85, 52, 76, 72, 90, 84, 88),
    p('fra18-pavard', 'Benjamin Pavard', null, null, null, 'France', null, 'DEF', 'RB', 83, 78, 76, 78, 77, 83, 79, 84, { id: 'pavard-volley', name: 'Second Poteau Pavard', description: '+35% outside box half-volley goal conversion.', shortDesc: '+35% volley goals', rarity: 'Epic' }),
    p('fra18-lloris', 'Hugo Lloris', null, null, null, 'France', null, 'GK', 'GK', 88, 54, 20, 75, 55, 90, 80, 91)
  ]),

  // 5. Italy 2020 (Wembley Euro Champions)
  makeSquad('italy-2020', 'Italy', '2020', 'Italy 2020 (Mancini Wembley Euro Champions)', 'International', 'ITA', '#004A97', '#FFFFFF', 'Tiki-Taka', 'elite', [
    p('ita20-immobile', 'Ciro Immobile', null, null, null, 'Italy', null, 'FWD', 'ST', 86, 85, 88, 72, 81, 40, 78, 85),
    p('ita20-insigne', 'Lorenzo Insigne', null, null, null, 'Italy', null, 'FWD', 'LW', 86, 87, 82, 85, 90, 38, 58, 86, { id: 'insigne-tiragir', name: 'Il Tiraggiro Munich Curler', description: '+30% right-footed curling finish.', shortDesc: '+30% finesse curl', rarity: 'Epic' }),
    p('ita20-chiesa', 'Federico Chiesa', null, null, null, 'Italy', null, 'FWD', 'RW', 87, 92, 84, 80, 88, 52, 78, 88, { id: 'chiesa-roar', name: 'Wembley Semi-Final Blast', description: '+35% rapid transition burst and finish.', shortDesc: '+35% burst finish', rarity: 'Legendary' }),
    p('ita20-verratti', 'Marco Verratti', null, null, null, 'Italy', null, 'MID', 'CM', 88, 68, 66, 92, 92, 82, 75, 92),
    p('ita20-jorginho', 'Jorginho', null, null, null, 'Italy', null, 'MID', 'CDM', 87, 56, 72, 91, 84, 82, 72, 94, { id: 'jorginho-hop', name: 'Hop-Step-Jump Pen Specialist', description: '+30% penalty composure and possession tempo.', shortDesc: '+30% tempo/pens', rarity: 'Epic' }),
    p('ita20-barella', 'Nicolò Barella', null, null, null, 'Italy', null, 'MID', 'CM', 87, 82, 78, 85, 86, 80, 82, 86),
    p('ita20-spinazzola', 'Leonardo Spinazzola', null, null, null, 'Italy', null, 'DEF', 'LB', 84, 91, 65, 80, 84, 78, 76, 82, { id: 'spina-freight', name: 'Freight Train Flank Overlap', description: '+30% left wing burst and goal-line clearance.', shortDesc: '+30% flank run/clear', rarity: 'Epic' }),
    p('ita20-chiellini', 'Giorgio Chiellini', null, null, null, 'Italy', null, 'DEF', 'CB', 89, 70, 45, 68, 62, 94, 90, 95, { id: 'giorgio-grin', name: 'The Wembley Saka Collar Pull', description: '+30% cynical tackle without conceding red.', shortDesc: '+30% tactical tackle', rarity: 'Legendary' }),
    p('ita20-bonucci', 'Leonardo Bonucci', null, null, null, 'Italy', null, 'DEF', 'CB', 88, 68, 64, 85, 74, 90, 82, 92, { id: 'leo-pasta', name: 'It\'s Coming Rome Equalizer', description: '+30% clutch corner equalizer.', shortDesc: '+30% corner goals', rarity: 'Epic' }),
    p('ita20-dilorenzo', 'Giovanni Di Lorenzo', null, null, null, 'Italy', null, 'DEF', 'RB', 82, 82, 60, 76, 78, 81, 82, 82),
    p('ita20-donnarumma', 'Gianluigi Donnarumma', null, null, null, 'Italy', null, 'GK', 'GK', 90, 52, 22, 76, 52, 92, 86, 96, { id: 'gigio-euro-mvp', name: 'Euro 2020 Player of Tournament', description: '+40% penalty shootout save rate.', shortDesc: '+40% penalty saves', rarity: 'Legendary' })
  ]),

  // 6. Morocco 2022 (Historic World Cup Semifinalists)
  makeSquad('morocco-2022', 'Morocco', '2022', 'Morocco 2022 (First African World Cup Semifinalists)', 'International', 'MAR', '#C1272D', '#006233', 'Low-Block Counter', 'high', [
    p('mar22-ennesyri', 'Youssef En-Nesyri', null, null, null, 'Morocco', null, 'FWD', 'ST', 84, 84, 84, 68, 76, 42, 88, 85, { id: 'ennesyri-278m', name: '2.78m Portugal Header in the Sky', description: '+35% maximum vertical leap header conversion.', shortDesc: '+35% leap headers', rarity: 'Epic' }),
    p('mar22-ziyech', 'Hakim Ziyech', null, null, null, 'Morocco', null, 'FWD', 'RW', 85, 78, 83, 89, 87, 55, 66, 86, { id: 'ziyech-wizard', name: 'Atlas Wizard Whipped Ball', description: '+25% crossfield pass delivery.', shortDesc: '+25% cross delivery', rarity: 'Epic' }),
    p('mar22-boufal', 'Sofiane Boufal', null, null, null, 'Morocco', null, 'FWD', 'LW', 82, 86, 76, 78, 90, 36, 60, 82),
    p('mar22-amrabat', 'Sofyan Amrabat', null, null, null, 'Morocco', null, 'MID', 'CDM', 85, 74, 65, 82, 80, 88, 92, 88, { id: 'amrabat-beast', name: 'The Mbappé Tackle Hero', description: '+30% slide tackle from behind on fast counters.', shortDesc: '+30% recovery tackle', rarity: 'Epic' }),
    p('mar22-ounahi', 'Azzedine Ounahi', null, null, null, 'Morocco', null, 'MID', 'CM', 83, 80, 72, 84, 88, 70, 68, 84, { id: 'ounahi-spain', name: 'Madre Mía! Where Did He Come From?', description: '+25% press evasion in central midfield.', shortDesc: '+25% press evasion', rarity: 'Rare' }),
    p('mar22-amallah', 'Selim Amallah', null, null, null, 'Morocco', null, 'MID', 'CM', 79, 74, 72, 76, 78, 78, 82, 80),
    p('mar22-mazraoui', 'Noussair Mazraoui', null, null, null, 'Morocco', null, 'DEF', 'LB', 82, 84, 68, 80, 83, 80, 76, 82),
    p('mar22-saiss', 'Romain Saïss', null, null, null, 'Morocco', null, 'DEF', 'CB', 83, 68, 55, 74, 68, 86, 88, 88),
    p('mar22-aguerd', 'Nayef Aguerd', null, null, null, 'Morocco', null, 'DEF', 'CB', 83, 78, 45, 75, 70, 85, 84, 84),
    p('mar22-hakimi', 'Achraf Hakimi', null, null, null, 'Morocco', null, 'DEF', 'RB', 87, 95, 76, 81, 84, 78, 79, 88, { id: 'hakimi-panenka', name: 'Panenka Penalty vs Spain', description: '+35% penalty shootout ice composure.', shortDesc: '+35% shootout ice', rarity: 'Legendary' }),
    p('mar22-bono', 'Yassine Bounou', null, null, null, 'Morocco', null, 'GK', 'GK', 87, 52, 22, 78, 55, 89, 82, 92, { id: 'bono-spain', name: '0 Goals Conceded in Shootout', description: '+35% shootout penalty read and saves.', shortDesc: '+35% pen shootout', rarity: 'Legendary' })
  ]),

  // 7. Real Madrid 2023-24 (15th UCL & La Liga Double)
  makeSquad('real-madrid-2023-24', 'Real Madrid', '2023-24', 'Real Madrid 2023-24 (15th UCL & La Liga Double)', 'La Liga', 'ESP', '#FEBE10', '#00529F', 'Direct Vertical', 'elite', [
    p('rm24-vini', 'Vinícius Jr', null, null, null, 'Brazil', null, 'FWD', 'LW', 92, 96, 86, 82, 94, 38, 74, 91, { id: 'vini-wembley', name: 'Wembley Final Goal & Ballon d\'Or Form', description: '+35% take-on and knockout finish.', shortDesc: '+35% KO goals', rarity: 'Legendary' }),
    p('rm24-rodrygo', 'Rodrygo', null, null, null, 'Brazil', null, 'FWD', 'RW', 87, 89, 84, 82, 88, 42, 68, 86, { id: 'rodrygo-mancity', name: 'Etihad Stadium Clutch Strike', description: '+25% fast breakaway finish in UCL.', shortDesc: '+25% UCL break', rarity: 'Epic' }),
    p('rm24-bellingham', 'Jude Bellingham', null, null, null, 'England', null, 'MID', 'CAM', 91, 84, 88, 88, 89, 78, 86, 94, { id: 'jude-heymarty', name: 'Hey Jude 95th Min Remontada', description: '+35% 90+ min stoppage time match-winners.', shortDesc: '+35% late winner', rarity: 'Legendary' }),
    p('rm24-kroos', 'Toni Kroos', null, null, null, 'Germany', null, 'MID', 'CM', 90, 52, 82, 97, 84, 76, 70, 98, { id: 'kroos-farewell', name: 'The Final Pass at Wembley', description: '+30% press-free vision and corner assists.', shortDesc: '+30% final corners', rarity: 'Legendary' }),
    p('rm24-valverde', 'Federico Valverde', null, null, null, 'Uruguay', null, 'MID', 'CM', 89, 91, 84, 85, 84, 82, 86, 90, { id: 'fede-falcon', name: 'El Halcón 120km/h Volley', description: '+30% transition pace and thunderous volleys.', shortDesc: '+30% volley power', rarity: 'Legendary' }),
    p('rm24-camavinga', 'Eduardo Camavinga', null, null, null, 'France', null, 'MID', 'CDM', 86, 84, 72, 84, 87, 84, 82, 86),
    p('rm24-mendy', 'Ferland Mendy', null, null, null, 'France', null, 'DEF', 'LB', 84, 91, 62, 76, 80, 85, 86, 84),
    p('rm24-rudiger', 'Antonio Rüdiger', null, null, null, 'Germany', null, 'DEF', 'CB', 89, 84, 55, 74, 68, 91, 92, 94, { id: 'rudiger-lockdown', name: 'Pocketing Haaland Over 180 Mins', description: '+35% physical box bullying vs elite strikers.', shortDesc: '+35% striker lockdown', rarity: 'Legendary' }),
    p('rm24-nacho', 'Nacho Fernández', null, null, null, 'Spain', null, 'DEF', 'CB', 83, 76, 45, 74, 70, 84, 80, 86),
    p('rm24-carvajal', 'Dani Carvajal', null, null, null, 'Spain', null, 'DEF', 'RB', 87, 83, 62, 82, 82, 86, 84, 92, { id: 'dani-header', name: 'Wembley Opening Corner Header', description: '+30% corner duel and big-game grit.', shortDesc: '+30% big-game grit', rarity: 'Epic' }),
    p('rm24-courtois', 'Thibaut Courtois', null, null, null, 'Belgium', null, 'GK', 'GK', 90, 50, 20, 75, 48, 92, 85, 94)
  ]),

  // 8. Paris Saint-Germain 2019-20 (UCL Finalists)
  makeSquad('psg-2019-20', 'Paris Saint-Germain', '2019-20', 'Paris Saint-Germain 2019-20 (UCL Finalists Lisbon)', 'Other', 'FRA', '#004170', '#DA291C', 'Tiki-Taka', 'elite', [
    p('psg20-mbappe', 'Kylian Mbappé', null, null, null, 'France', null, 'FWD', 'LW', 92, 96, 89, 82, 93, 38, 78, 89),
    p('psg20-neymar', 'Neymar Jr', null, null, null, 'Brazil', null, 'FWD', 'CAM', 93, 91, 86, 91, 96, 38, 64, 94, { id: 'neymar-atalanta', name: 'Lisbon 16 Take-Ons Record', description: '+35% take-on and foul-drawing rate.', shortDesc: '+35% take-ons', rarity: 'Legendary' }),
    p('psg20-dimaria', 'Ángel Di María', null, null, null, 'Argentina', null, 'FWD', 'RW', 88, 86, 83, 89, 90, 52, 70, 88),
    p('psg20-verratti', 'Marco Verratti', null, null, null, 'Italy', null, 'MID', 'CM', 87, 68, 65, 90, 92, 81, 74, 90),
    p('psg20-marquinhos', 'Marquinhos', null, null, null, 'Brazil', null, 'MID', 'CDM', 88, 76, 55, 78, 76, 90, 85, 89, { id: 'marqui-clutch', name: 'Atalanta & Leipzig Clutch Goals', description: '+30% late box header equalizers.', shortDesc: '+30% late headers', rarity: 'Epic' }),
    p('psg20-gueye', 'Idrissa Gueye', null, null, null, 'Senegal', null, 'MID', 'CM', 83, 76, 68, 78, 78, 86, 84, 84),
    p('psg20-bernat', 'Juan Bernat', null, null, null, 'Spain', null, 'DEF', 'LB', 81, 84, 70, 78, 82, 77, 68, 81),
    p('psg20-kimpembe', 'Presnel Kimpembe', null, null, null, 'France', null, 'DEF', 'CB', 84, 78, 42, 72, 70, 86, 86, 82),
    p('psg20-silva', 'Thiago Silva', null, null, null, 'Brazil', null, 'DEF', 'CB', 88, 66, 54, 78, 74, 91, 82, 94, { id: 'monstro-clearance', name: 'O Monstro Goal-Line Clearance', description: '+30% goal-line defensive block saves.', shortDesc: '+30% line clearances', rarity: 'Legendary' }),
    p('psg20-kehrer', 'Thilo Kehrer', null, null, null, 'Germany', null, 'DEF', 'RB', 79, 80, 50, 72, 74, 80, 80, 78),
    p('psg20-navas', 'Keylor Navas', null, null, null, 'Costa Rica', null, 'GK', 'GK', 88, 54, 20, 75, 52, 90, 80, 92)
  ]),

  // 9. AFC Ajax 2018-19 (Ten Hag Bernabeu & Turin Storm)
  makeSquad('ajax-2018-19', 'AFC Ajax', '2018-19', 'AFC Ajax 2018-19 (Ten Hag Bernabeu & Turin Masterclass)', 'Other', 'NED', '#E20613', '#FFFFFF', 'Tiki-Taka', 'elite', [
    p('ajx19-tadic', 'Dušan Tadić', null, null, null, 'Serbia', null, 'FWD', 'CF', 87, 76, 86, 88, 90, 45, 78, 92, { id: 'tadic-bernabeu', name: 'Bernabeu 10/10 Masterclass Roulette', description: '+35% 360-degree roulette and box finish.', shortDesc: '+35% roulette/xG', rarity: 'Legendary' }),
    p('ajx19-neres', 'David Neres', null, null, null, 'Brazil', null, 'FWD', 'LW', 83, 89, 78, 78, 88, 38, 68, 82),
    p('ajx19-ziyech', 'Hakim Ziyech', null, null, null, 'Morocco', null, 'FWD', 'RW', 86, 82, 84, 90, 89, 58, 68, 87, { id: 'ziyech-curler', name: 'Turin & Bernabeu Curling Snipers', description: '+30% first-time curling shot accuracy.', shortDesc: '+30% curling goals', rarity: 'Epic' }),
    p('ajx19-vandebeek', 'Donny van de Beek', null, null, null, 'Netherlands', null, 'MID', 'CAM', 84, 78, 82, 82, 82, 74, 80, 85),
    p('ajx19-dejong', 'Frenkie de Jong', null, null, null, 'Netherlands', null, 'MID', 'CM', 87, 82, 72, 89, 91, 79, 78, 91, { id: 'dejong-drop', name: 'Modric Drop-Body Feint Escape', description: '+35% deep phase turn and line-breaking run.', shortDesc: '+35% press escape', rarity: 'Legendary' }),
    p('ajx19-schone', 'Lasse Schöne', null, null, null, 'Denmark', null, 'MID', 'CDM', 81, 62, 80, 83, 76, 76, 74, 86, { id: 'schone-courtois', name: 'Bernabeu Touchline Free Kick', description: '+30% impossible angle direct free-kick goals.', shortDesc: '+30% free kicks', rarity: 'Rare' }),
    p('ajx19-tagliafico', 'Nicolás Tagliafico', null, null, null, 'Argentina', null, 'DEF', 'LB', 83, 82, 60, 76, 78, 84, 84, 86),
    p('ajx19-blind', 'Daley Blind', null, null, null, 'Netherlands', null, 'DEF', 'CB', 83, 62, 70, 86, 79, 84, 76, 88),
    p('ajx19-deligt', 'Matthijs de Ligt', null, null, null, 'Netherlands', null, 'DEF', 'CB', 87, 72, 60, 75, 70, 89, 88, 92, { id: 'deligt-turin', name: 'Turin Quarter-Final Bullet Header', description: '+35% aerial duel win rate and corner goals.', shortDesc: '+35% corner headers', rarity: 'Legendary' }),
    p('ajx19-mazraoui', 'Noussair Mazraoui', null, null, null, 'Morocco', null, 'DEF', 'RB', 81, 82, 66, 80, 82, 78, 74, 82),
    p('ajx19-onana', 'André Onana', null, null, null, 'Cameroon', null, 'GK', 'GK', 85, 54, 20, 84, 55, 87, 80, 86)
  ]),

  // 10. Sporting CP 2023-24 (Amorim Gyökeres Title)
  makeSquad('sporting-cp-2023-24', 'Sporting CP', '2023-24', 'Sporting CP 2023-24 (Amorim & Gyökeres 43 Goals Title)', 'Other', 'POR', '#006233', '#FFFFFF', 'Direct Vertical', 'high', [
    p('spo24-gyokeres', 'Viktor Gyökeres', null, null, null, 'Sweden', null, 'FWD', 'ST', 88, 91, 91, 78, 86, 45, 92, 92, { id: 'gyokeres-mask', name: '43 Goals Mask Celebration', description: '+35% counter-attack solo channel sprint and finish.', shortDesc: '+35% channel finish', rarity: 'Legendary' }),
    p('spo24-trincao', 'Francisco Trincão', null, null, null, 'Portugal', null, 'FWD', 'RW', 82, 85, 78, 82, 86, 42, 68, 82),
    p('spo24-goncalves', 'Pedro Gonçalves', null, null, null, 'Portugal', null, 'MID', 'CAM', 84, 78, 84, 85, 85, 62, 72, 86, { id: 'pote-clutch', name: 'Pote Clinical Midfield xG', description: '+25% penalty box edge arrivals.', shortDesc: '+25% edge arrivals', rarity: 'Epic' }),
    p('spo24-hjulmand', 'Morten Hjulmand', null, null, null, 'Denmark', null, 'MID', 'CDM', 84, 74, 76, 84, 81, 86, 87, 86, { id: 'hjulmand-rocket', name: 'Euro Long-Range Missile', description: '+25% outside box shooting power.', shortDesc: '+25% long shots', rarity: 'Epic' }),
    p('spo24-morita', 'Hidemasa Morita', null, null, null, 'Japan', null, 'MID', 'CM', 82, 75, 70, 83, 82, 81, 80, 84),
    p('spo24-santos', 'Nuno Santos', null, null, null, 'Portugal', null, 'DEF', 'LWB', 81, 82, 78, 82, 80, 74, 76, 84, { id: 'santos-rabona', name: 'Rabona Wonder Goal', description: '+25% left wing crossing and flair.', shortDesc: '+25% wing flair', rarity: 'Rare' }),
    p('spo24-catamo', 'Geny Catamo', null, null, null, 'Mozambique', null, 'DEF', 'RWB', 80, 89, 74, 76, 84, 68, 70, 80),
    p('spo24-inacio', 'Gonçalo Inácio', null, null, null, 'Portugal', null, 'DEF', 'CB', 83, 76, 48, 82, 74, 84, 82, 84),
    p('spo24-coates', 'Sebastián Coates', null, null, null, 'Uruguay', null, 'DEF', 'CB', 83, 55, 62, 72, 64, 86, 92, 88, { id: 'coates-tower', name: 'Alvalade Towering Captain', description: '+30% defensive and attacking aerial duels.', shortDesc: '+30% aerial headers', rarity: 'Epic' }),
    p('spo24-diomande', 'Ousmane Diomande', null, null, null, 'Ivory Coast', null, 'DEF', 'CB', 82, 80, 38, 74, 72, 83, 86, 80),
    p('spo24-israel', 'Franco Israel', null, null, null, 'Uruguay', null, 'GK', 'GK', 80, 50, 20, 72, 48, 82, 78, 80)
  ])
];

module.exports = { newInternationalAndOtherSquads };
