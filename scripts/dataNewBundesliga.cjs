const { p, makeSquad } = require('./squadBuilderHelpers.cjs');

const newBundesligaSquads = [
  // 1. Borussia Dortmund 2010-11 (Klopp's First Title)
  makeSquad('dortmund-2010-11', 'Borussia Dortmund', '2010-11', 'Borussia Dortmund 2010-11 (Klopp Young Champions)', 'Bundesliga', 'GER', '#FDE100', '#000000', 'Gegenpress', 'elite', [
    p('bvb11-barrios', 'Lucas Barrios', null, null, null, 'Paraguay', null, 'FWD', 'ST', 84, 82, 86, 72, 80, 36, 82, 84),
    p('bvb11-lewandowski', 'Robert Lewandowski', null, null, null, 'Poland', null, 'FWD', 'ST', 82, 80, 84, 74, 80, 38, 80, 83),
    p('bvb11-gotze', 'Mario Götze', null, null, null, 'Germany', null, 'MID', 'CAM', 85, 83, 80, 87, 89, 45, 66, 86, { id: 'gotze-wonder', name: 'Golden Boy Vision', description: '+20% key pass accuracy.', shortDesc: '+20% key pass', rarity: 'Epic' }),
    p('bvb11-kagawa', 'Shinji Kagawa', null, null, null, 'Japan', null, 'MID', 'CAM', 84, 84, 80, 85, 88, 42, 64, 85),
    p('bvb11-sahin', 'Nuri Şahin', null, null, null, 'Turkey', null, 'MID', 'CM', 85, 74, 78, 89, 83, 76, 75, 88, { id: 'sahin-maestro', name: 'Westfalen Metronome', description: '+18% tempo control and long passes.', shortDesc: '+18% passing', rarity: 'Rare' }),
    p('bvb11-bender', 'Sven Bender', null, null, null, 'Germany', null, 'MID', 'CDM', 82, 72, 58, 76, 72, 85, 86, 82),
    p('bvb11-schmelzer', 'Marcel Schmelzer', null, null, null, 'Germany', null, 'DEF', 'LB', 81, 82, 58, 78, 76, 80, 80, 80),
    p('bvb11-hummels', 'Mats Hummels', null, null, null, 'Germany', null, 'DEF', 'CB', 87, 68, 62, 82, 75, 89, 84, 90, { id: 'hummels-laser', name: 'Aussenrist Delivery', description: '+25% defensive clearance into counter.', shortDesc: '+25% counter launch', rarity: 'Epic' }),
    p('bvb11-subotic', 'Neven Subotić', null, null, null, 'Serbia', null, 'DEF', 'CB', 83, 72, 40, 68, 62, 85, 86, 81),
    p('bvb11-piszczek', 'Łukasz Piszczek', null, null, null, 'Poland', null, 'DEF', 'RB', 83, 84, 65, 78, 78, 82, 82, 82),
    p('bvb11-weidenfeller', 'Roman Weidenfeller', null, null, null, 'Germany', null, 'GK', 'GK', 84, 52, 22, 72, 50, 85, 80, 86)
  ]),

  // 2. Borussia Dortmund 2012-13 (UCL Finalists)
  makeSquad('dortmund-2012-13', 'Borussia Dortmund', '2012-13', 'Borussia Dortmund 2012-13 (UCL Finalists Wembley)', 'Bundesliga', 'GER', '#FDE100', '#000000', 'Gegenpress', 'elite', [
    p('bvb13-lewa', 'Robert Lewandowski', null, null, null, 'Poland', null, 'FWD', 'ST', 89, 83, 90, 78, 85, 42, 84, 90, { id: 'lewa-poker', name: '4-Goal Bernabeu Blitz', description: '+30% clinical finishing in knockout ties.', shortDesc: '+30% KO finishing', rarity: 'Legendary' }),
    p('bvb13-reus', 'Marco Reus', null, null, null, 'Germany', null, 'FWD', 'LW', 88, 90, 86, 85, 89, 45, 74, 88, { id: 'reus-flash', name: 'Rolls Reus Velocity', description: '+25% transition pace on breakaways.', shortDesc: '+25% break pace', rarity: 'Epic' }),
    p('bvb13-kuba', 'Jakub Błaszczykowski', null, null, null, 'Poland', null, 'MID', 'RM', 84, 88, 79, 80, 83, 62, 78, 82),
    p('bvb13-gundogan', 'İlkay Gündoğan', null, null, null, 'Germany', null, 'MID', 'CM', 85, 78, 78, 88, 87, 72, 72, 87),
    p('bvb13-bender', 'Sven Bender', null, null, null, 'Germany', null, 'MID', 'CDM', 82, 72, 56, 76, 72, 85, 86, 82),
    p('bvb13-kehl', 'Sebastian Kehl', null, null, null, 'Germany', null, 'MID', 'CDM', 80, 65, 68, 78, 72, 83, 85, 84),
    p('bvb13-schmelzer', 'Marcel Schmelzer', null, null, null, 'Germany', null, 'DEF', 'LB', 81, 82, 58, 78, 76, 80, 80, 80),
    p('bvb13-hummels', 'Mats Hummels', null, null, null, 'Germany', null, 'DEF', 'CB', 87, 68, 62, 82, 75, 89, 84, 90),
    p('bvb13-subotic', 'Neven Subotić', null, null, null, 'Serbia', null, 'DEF', 'CB', 83, 72, 40, 68, 62, 85, 86, 81),
    p('bvb13-piszczek', 'Łukasz Piszczek', null, null, null, 'Poland', null, 'DEF', 'RB', 83, 84, 65, 78, 78, 82, 82, 82),
    p('bvb13-weidenfeller', 'Roman Weidenfeller', null, null, null, 'Germany', null, 'GK', 'GK', 85, 52, 22, 72, 50, 86, 81, 87)
  ]),

  // 3. Borussia Dortmund 1996-97 (UCL Winners)
  makeSquad('dortmund-1996-97', 'Borussia Dortmund', '1996-97', 'Borussia Dortmund 1996-97 (Champions League Winners)', 'Bundesliga', 'GER', '#FDE100', '#000000', 'Direct Vertical', 'elite', [
    p('bvb97-riedle', 'Karl-Heinz Riedle', null, null, null, 'Germany', null, 'FWD', 'ST', 86, 82, 88, 74, 80, 42, 85, 88),
    p('bvb97-chapuisat', 'Stéphane Chapuisat', null, null, null, 'Switzerland', null, 'FWD', 'ST', 86, 84, 87, 78, 86, 38, 78, 86),
    p('bvb97-moller', 'Andreas Möller', null, null, null, 'Germany', null, 'MID', 'CAM', 89, 84, 85, 90, 88, 55, 75, 88, { id: 'moller-dynamo', name: 'Westfalen Conductor', description: '+20% through-ball accuracy.', shortDesc: '+20% vision', rarity: 'Epic' }),
    p('bvb97-lambert', 'Paul Lambert', null, null, null, 'Scotland', null, 'MID', 'CDM', 84, 76, 70, 82, 78, 87, 85, 86, { id: 'lambert-lockdown', name: 'Zidane Shadow', description: '+30% interception against opposition talisman.', shortDesc: '+30% talisman mark', rarity: 'Epic' }),
    p('bvb97-sousa', 'Paulo Sousa', null, null, null, 'Portugal', null, 'MID', 'CM', 86, 75, 74, 89, 87, 78, 76, 88),
    p('bvb97-heinrich', 'Jörg Heinrich', null, null, null, 'Germany', null, 'DEF', 'LWB', 83, 84, 72, 80, 80, 80, 82, 82),
    p('bvb97-sammer', 'Matthias Sammer', null, null, null, 'Germany', null, 'DEF', 'CB', 92, 80, 78, 86, 84, 93, 88, 94, { id: 'sammer-ballon-dor', name: 'Libero Ballon d\'Or', description: '+25% defensive command and counter orchestration.', shortDesc: '+25% defense aura', rarity: 'Legendary' }),
    p('bvb97-kohler', 'Jürgen Kohler', null, null, null, 'Germany', null, 'DEF', 'CB', 89, 74, 45, 72, 68, 93, 91, 90, { id: 'kohler-iron', name: 'Der Kokser Stopper', description: '+25% 1v1 duel win rate inside box.', shortDesc: '+25% box tackle', rarity: 'Epic' }),
    p('bvb97-kree', 'Martin Kree', null, null, null, 'Germany', null, 'DEF', 'CB', 82, 70, 68, 72, 64, 83, 85, 81),
    p('bvb97-reuter', 'Stefan Reuter', null, null, null, 'Germany', null, 'DEF', 'RWB', 85, 89, 68, 80, 82, 82, 84, 85),
    p('bvb97-klos', 'Stefan Klos', null, null, null, 'Germany', null, 'GK', 'GK', 85, 54, 20, 72, 52, 86, 82, 87)
  ]),

  // 4. Bayern Munich 2000-01 (Kahn Champions League)
  makeSquad('bayern-2000-01', 'FC Bayern Munich', '2000-01', 'Bayern Munich 2000-01 (Kahn San Siro UCL Champions)', 'Bundesliga', 'GER', '#DC052D', '#0066B2', 'Direct Vertical', 'elite', [
    p('fcb01-elber', 'Giovane Élber', null, null, null, 'Brazil', null, 'FWD', 'ST', 88, 85, 89, 78, 87, 40, 80, 88),
    p('fcb01-jancker', 'Carsten Jancker', null, null, null, 'Germany', null, 'FWD', 'ST', 83, 70, 84, 68, 70, 42, 94, 82),
    p('fcb01-scholl', 'Mehmet Scholl', null, null, null, 'Germany', null, 'MID', 'CAM', 87, 83, 85, 89, 90, 45, 68, 88, { id: 'scholl-flair', name: 'Curved Free-Kick Mastery', description: '+25% conversion on direct free kicks.', shortDesc: '+25% set-piece', rarity: 'Epic' }),
    p('fcb01-effenberg', 'Stefan Effenberg', null, null, null, 'Germany', null, 'MID', 'CM', 89, 72, 86, 91, 84, 82, 88, 94, { id: 'effenberg-tiger', name: 'Der Chefboss Presence', description: '+20% team composure in hostile grounds.', shortDesc: '+20% composure', rarity: 'Legendary' }),
    p('fcb01-jeremies', 'Jens Jeremies', null, null, null, 'Germany', null, 'MID', 'CDM', 84, 76, 68, 78, 74, 87, 88, 86),
    p('fcb01-salihamidzic', 'Hasan Salihamidžić', null, null, null, 'Bosnia', null, 'MID', 'RM', 84, 86, 75, 80, 82, 78, 84, 84),
    p('fcb01-lizarazu', 'Bixente Lizarazu', null, null, null, 'France', null, 'DEF', 'LB', 88, 86, 64, 82, 84, 87, 80, 88),
    p('fcb01-kuffour', 'Samuel Kuffour', null, null, null, 'Ghana', null, 'DEF', 'CB', 85, 78, 42, 68, 64, 87, 88, 83),
    p('fcb01-linke', 'Thomas Linke', null, null, null, 'Germany', null, 'DEF', 'CB', 84, 72, 40, 72, 66, 86, 84, 85),
    p('fcb01-sagnol', 'Willy Sagnol', null, null, null, 'France', null, 'DEF', 'RB', 86, 81, 66, 88, 81, 84, 80, 86),
    p('fcb01-kahn', 'Oliver Kahn', null, null, null, 'Germany', null, 'GK', 'GK', 93, 56, 25, 75, 55, 94, 92, 98, { id: 'kahn-titan', name: 'Der Titan San Siro', description: '+35% penalty shootout save probability.', shortDesc: '+35% penalty saves', rarity: 'Legendary' })
  ]),

  // 5. Bayern Munich 2015-16 (Pep Guardiola 88 Pts)
  makeSquad('bayern-2015-16', 'FC Bayern Munich', '2015-16', 'Bayern Munich 2015-16 (Pep 88 Pts Dominance)', 'Bundesliga', 'GER', '#DC052D', '#0066B2', 'Tiki-Taka', 'elite', [
    p('fcb16-lewa', 'Robert Lewandowski', null, null, null, 'Poland', null, 'FWD', 'ST', 92, 84, 93, 80, 87, 44, 85, 92, { id: 'lewa-nine-mins', name: '5 Goals in 9 Minutes', description: '+35% scoring surge when trailing.', shortDesc: '+35% blitz xG', rarity: 'Legendary' }),
    p('fcb16-muller', 'Thomas Müller', null, null, null, 'Germany', null, 'FWD', 'CAM', 88, 78, 87, 83, 82, 54, 76, 92, { id: 'muller-raumdeuter', name: 'Raumdeuter Instinct', description: '+25% unmarked box ghosting chance.', shortDesc: '+25% box space', rarity: 'Epic' }),
    p('fcb16-costa', 'Douglas Costa', null, null, null, 'Brazil', null, 'FWD', 'LW', 86, 94, 78, 83, 90, 42, 70, 82),
    p('fcb16-vidal', 'Arturo Vidal', null, null, null, 'Chile', null, 'MID', 'CM', 88, 78, 83, 82, 82, 88, 90, 88, { id: 'vidal-warrior', name: 'El Guerrero Press', description: '+25% transition turnover tackles.', shortDesc: '+25% press tackle', rarity: 'Epic' }),
    p('fcb16-alonso', 'Xabi Alonso', null, null, null, 'Spain', null, 'MID', 'CDM', 87, 58, 82, 93, 80, 82, 76, 94),
    p('fcb16-thiago', 'Thiago Alcântara', null, null, null, 'Spain', null, 'MID', 'CM', 87, 78, 76, 90, 92, 72, 68, 88),
    p('fcb16-alaba', 'David Alaba', null, null, null, 'Austria', null, 'DEF', 'LB', 88, 86, 78, 84, 85, 84, 78, 86),
    p('fcb16-boateng', 'Jérôme Boateng', null, null, null, 'Germany', null, 'DEF', 'CB', 89, 78, 55, 84, 74, 91, 87, 88),
    p('fcb16-martinez', 'Javi Martínez', null, null, null, 'Spain', null, 'DEF', 'CB', 85, 66, 60, 78, 72, 88, 87, 85),
    p('fcb16-lahm', 'Philipp Lahm', null, null, null, 'Germany', null, 'DEF', 'RB', 89, 78, 62, 88, 85, 89, 72, 94, { id: 'lahm-perfection', name: 'Tackle Without Fouling', description: '+20% clean tackle retention rate.', shortDesc: '+20% clean tackles', rarity: 'Legendary' }),
    p('fcb16-neuer', 'Manuel Neuer', null, null, null, 'Germany', null, 'GK', 'GK', 93, 60, 30, 88, 62, 93, 89, 96)
  ]),

  // 6. RB Leipzig 2019-20 (Nagelsmann UCL Semis)
  makeSquad('rb-leipzig-2019-20', 'RB Leipzig', '2019-20', 'RB Leipzig 2019-20 (Nagelsmann UCL Semi-Finalists)', 'Bundesliga', 'GER', '#001E42', '#D4001F', 'Gegenpress', 'high', [
    p('rbl20-werner', 'Timo Werner', null, null, null, 'Germany', null, 'FWD', 'ST', 86, 93, 85, 75, 84, 38, 74, 83),
    p('rbl20-schick', 'Patrik Schick', null, null, null, 'Czech Republic', null, 'FWD', 'ST', 82, 78, 83, 74, 81, 36, 80, 80),
    p('rbl20-nkunku', 'Christopher Nkunku', null, null, null, 'France', null, 'MID', 'CAM', 83, 86, 78, 84, 87, 62, 68, 82),
    p('rbl20-sabitzer', 'Marcel Sabitzer', null, null, null, 'Austria', null, 'MID', 'CM', 84, 79, 84, 82, 82, 74, 80, 84, { id: 'sabitzer-rocket', name: 'Alpine Long-Range Cannon', description: '+25% shooting power outside box.', shortDesc: '+25% long shots', rarity: 'Rare' }),
    p('rbl20-laimer', 'Konrad Laimer', null, null, null, 'Austria', null, 'MID', 'CDM', 82, 82, 68, 78, 79, 83, 84, 82),
    p('rbl20-angelino', 'Angeliño', null, null, null, 'Spain', null, 'DEF', 'LWB', 82, 84, 72, 82, 83, 76, 72, 80),
    p('rbl20-upamecano', 'Dayot Upamecano', null, null, null, 'France', null, 'DEF', 'CB', 84, 84, 45, 74, 72, 85, 88, 82),
    p('rbl20-halstenberg', 'Marcel Halstenberg', null, null, null, 'Germany', null, 'DEF', 'CB', 81, 74, 68, 76, 72, 82, 82, 80),
    p('rbl20-klostermann', 'Lukas Klostermann', null, null, null, 'Germany', null, 'DEF', 'CB', 81, 88, 52, 72, 70, 82, 82, 78),
    p('rbl20-mukiele', 'Nordi Mukiele', null, null, null, 'France', null, 'DEF', 'RWB', 81, 82, 58, 72, 76, 82, 83, 79),
    p('rbl20-gulacsi', 'Péter Gulácsi', null, null, null, 'Hungary', null, 'GK', 'GK', 84, 50, 20, 70, 48, 85, 78, 84)
  ]),

  // 7. Eintracht Frankfurt 2021-22 (Europa League Invincibles)
  makeSquad('frankfurt-2021-22', 'Eintracht Frankfurt', '2021-22', 'Eintracht Frankfurt 2021-22 (Europa League Champions)', 'Bundesliga', 'GER', '#E1000F', '#000000', 'Direct Vertical', 'high', [
    p('sge22-borre', 'Rafael Santos Borré', null, null, null, 'Colombia', null, 'FWD', 'ST', 82, 82, 82, 74, 80, 48, 80, 84, { id: 'borre-seville', name: 'Seville Penalty Clutch', description: '+25% penalty composure.', shortDesc: '+25% pens', rarity: 'Rare' }),
    p('sge22-kamada', 'Daichi Kamada', null, null, null, 'Japan', null, 'MID', 'CAM', 83, 76, 80, 84, 85, 55, 68, 84),
    p('sge22-lindstrom', 'Jesper Lindstrøm', null, null, null, 'Denmark', null, 'MID', 'CAM', 80, 86, 75, 78, 82, 42, 65, 78),
    p('sge22-kostic', 'Filip Kostić', null, null, null, 'Serbia', null, 'DEF', 'LWB', 85, 87, 80, 87, 84, 72, 82, 85, { id: 'kostic-whiplash', name: 'Whipped Cross Machine', description: '+30% cross assist conversion.', shortDesc: '+30% crossing', rarity: 'Epic' }),
    p('sge22-sow', 'Djibril Sow', null, null, null, 'Switzerland', null, 'MID', 'CM', 81, 80, 70, 80, 80, 78, 78, 80),
    p('sge22-rode', 'Sebastian Rode', null, null, null, 'Germany', null, 'MID', 'CM', 80, 72, 70, 78, 76, 81, 84, 85),
    p('sge22-knauff', 'Ansgar Knauff', null, null, null, 'Germany', null, 'DEF', 'RWB', 79, 89, 72, 74, 80, 68, 72, 77),
    p('sge22-ndicka', 'Evan Ndicka', null, null, null, 'France', null, 'DEF', 'CB', 82, 76, 50, 72, 70, 84, 85, 80),
    p('sge22-hinteregger', 'Martin Hinteregger', null, null, null, 'Austria', null, 'DEF', 'CB', 82, 68, 64, 72, 68, 84, 88, 85),
    p('sge22-tuta', 'Tuta', null, null, null, 'Brazil', null, 'DEF', 'CB', 79, 76, 42, 68, 68, 80, 80, 78),
    p('sge22-trapp', 'Kevin Trapp', null, null, null, 'Germany', null, 'GK', 'GK', 85, 52, 22, 72, 50, 86, 80, 88, { id: 'trapp-kent', name: '118th Min Miracle Save', description: '+30% 1v1 close-range reflexes.', shortDesc: '+30% 1v1 save', rarity: 'Epic' })
  ]),

  // 8. VfB Stuttgart 2023-24 (Hoeness 2nd Place Wonder)
  makeSquad('stuttgart-2023-24', 'VfB Stuttgart', '2023-24', 'VfB Stuttgart 2023-24 (Hoeness 2nd Place Miracle)', 'Bundesliga', 'GER', '#E32219', '#FFFFFF', 'Tiki-Taka', 'high', [
    p('vfb24-guirassy', 'Serhou Guirassy', null, null, null, 'Guinea', null, 'FWD', 'ST', 86, 84, 89, 74, 82, 38, 86, 88, { id: 'guirassy-lethal', name: '28 Goals in 28 Games', description: '+25% box xG conversion rate.', shortDesc: '+25% clinical', rarity: 'Epic' }),
    p('vfb24-undav', 'Deniz Undav', null, null, null, 'Germany', null, 'FWD', 'CF', 83, 76, 84, 80, 82, 45, 80, 84),
    p('vfb24-fuhrich', 'Chris Führich', null, null, null, 'Germany', null, 'MID', 'LM', 82, 85, 78, 80, 86, 52, 68, 81),
    p('vfb24-millot', 'Enzo Millot', null, null, null, 'France', null, 'MID', 'CAM', 81, 80, 76, 82, 84, 60, 68, 80),
    p('vfb24-stiller', 'Angelo Stiller', null, null, null, 'Germany', null, 'MID', 'CM', 82, 70, 72, 86, 82, 78, 76, 84),
    p('vfb24-karazor', 'Atakan Karazor', null, null, null, 'Germany', null, 'MID', 'CDM', 80, 68, 58, 76, 72, 83, 86, 82),
    p('vfb24-mittelstadt', 'Maximilian Mittelstädt', null, null, null, 'Germany', null, 'DEF', 'LB', 82, 82, 68, 80, 78, 79, 78, 80),
    p('vfb24-anton', 'Waldemar Anton', null, null, null, 'Germany', null, 'DEF', 'CB', 83, 74, 45, 75, 70, 85, 85, 83),
    p('vfb24-ito', 'Hiroki Ito', null, null, null, 'Japan', null, 'DEF', 'CB', 81, 78, 50, 78, 74, 82, 80, 81),
    p('vfb24-vagnoman', 'Josha Vagnoman', null, null, null, 'Germany', null, 'DEF', 'RB', 79, 84, 60, 74, 76, 78, 82, 78),
    p('vfb24-nubel', 'Alexander Nübel', null, null, null, 'Germany', null, 'GK', 'GK', 83, 50, 20, 75, 52, 84, 78, 82)
  ]),

  // 9. Werder Bremen 2008-09 (Diego UEFA Cup Finalists)
  makeSquad('werder-bremen-2008-09', 'SV Werder Bremen', '2008-09', 'Werder Bremen 2008-09 (Diego & Pizarro UEFA Cup Final)', 'Bundesliga', 'GER', '#1D9053', '#FFFFFF', 'Direct Vertical', 'high', [
    p('svw09-pizarro', 'Claudio Pizarro', null, null, null, 'Peru', null, 'FWD', 'ST', 86, 78, 88, 78, 83, 38, 82, 88),
    p('svw09-almeida', 'Hugo Almeida', null, null, null, 'Portugal', null, 'FWD', 'ST', 81, 76, 84, 66, 74, 35, 88, 78),
    p('svw09-diego', 'Diego', null, null, null, 'Brazil', null, 'MID', 'CAM', 88, 82, 84, 90, 92, 45, 70, 89, { id: 'diego-magic', name: 'Weserstadion Magician', description: '+25% dribble success and solo goals.', shortDesc: '+25% dribble', rarity: 'Epic' }),
    p('svw09-ozil', 'Mesut Özil', null, null, null, 'Germany', null, 'MID', 'CAM', 84, 82, 75, 88, 87, 38, 62, 84),
    p('svw09-frings', 'Torsten Frings', null, null, null, 'Germany', null, 'MID', 'CM', 85, 72, 82, 86, 80, 84, 86, 88),
    p('svw09-baumann', 'Frank Baumann', null, null, null, 'Germany', null, 'MID', 'CDM', 80, 65, 62, 78, 72, 82, 82, 84),
    p('svw09-boenisch', 'Sebastian Boenisch', null, null, null, 'Poland', null, 'DEF', 'LB', 78, 82, 58, 74, 74, 77, 80, 76),
    p('svw09-naldo', 'Naldo', null, null, null, 'Brazil', null, 'DEF', 'CB', 85, 74, 82, 72, 68, 86, 90, 84, { id: 'naldo-bullet', name: '130km/h Free Kick Blast', description: '+25% long set-piece conversion.', shortDesc: '+25% free kick', rarity: 'Rare' }),
    p('svw09-mertesacker', 'Per Mertesacker', null, null, null, 'Germany', null, 'DEF', 'CB', 86, 52, 40, 74, 62, 89, 88, 88),
    p('svw09-fritz', 'Clemens Fritz', null, null, null, 'Germany', null, 'DEF', 'RB', 81, 82, 62, 78, 78, 80, 80, 82),
    p('svw09-wiese', 'Tim Wiese', null, null, null, 'Germany', null, 'GK', 'GK', 83, 52, 20, 70, 48, 84, 88, 82)
  ]),

  // 10. Schalke 04 2000-01 (4-Minute Champions & Cup Double)
  makeSquad('schalke-2000-01', 'FC Schalke 04', '2000-01', 'Schalke 04 2000-01 (Heartbreak 4-Minute Champions)', 'Bundesliga', 'GER', '#004D9D', '#FFFFFF', 'Direct Vertical', 'high', [
    p('s0401-sand', 'Ebbe Sand', null, null, null, 'Denmark', null, 'FWD', 'ST', 86, 80, 88, 74, 80, 40, 84, 86, { id: 'sand-topscorer', name: 'Torjägerkanone 22 Goals', description: '+25% header and box finishing.', shortDesc: '+25% finishing', rarity: 'Epic' }),
    p('s0401-mpenza', 'Émile Mpenza', null, null, null, 'Belgium', null, 'FWD', 'ST', 84, 91, 82, 72, 84, 36, 78, 81),
    p('s0401-asamoah', 'Gerald Asamoah', null, null, null, 'Germany', null, 'FWD', 'RW', 82, 84, 76, 76, 81, 62, 86, 82),
    p('s0401-bohme', 'Jörg Böhme', null, null, null, 'Germany', null, 'MID', 'LM', 83, 82, 84, 83, 82, 60, 76, 84),
    p('s0401-nemec', 'Jiří Němec', null, null, null, 'Czech Republic', null, 'MID', 'CM', 82, 70, 68, 82, 78, 84, 82, 85),
    p('s0401-hajto', 'Tomasz Hajto', null, null, null, 'Poland', null, 'DEF', 'CB', 82, 68, 70, 74, 65, 84, 89, 81),
    p('s0401-vankerckhoven', 'Nico Van Kerckhoven', null, null, null, 'Belgium', null, 'DEF', 'LB', 80, 78, 62, 76, 75, 79, 78, 80),
    p('s0401-waldoch', 'Tomasz Wałdoch', null, null, null, 'Poland', null, 'DEF', 'CB', 83, 68, 45, 72, 66, 85, 86, 84),
    p('s0401-vanhoogdalem', 'Marco van Hoogdalem', null, null, null, 'Netherlands', null, 'DEF', 'CB', 80, 70, 50, 72, 66, 81, 82, 80),
    p('s0401-latal', 'Radoslav Látal', null, null, null, 'Czech Republic', null, 'DEF', 'RB', 81, 80, 64, 78, 77, 80, 80, 82),
    p('s0401-reck', 'Oliver Reck', null, null, null, 'Germany', null, 'GK', 'GK', 82, 50, 20, 68, 48, 83, 80, 82)
  ])
];

module.exports = { newBundesligaSquads };
