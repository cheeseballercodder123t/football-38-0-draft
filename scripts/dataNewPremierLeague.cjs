const { p, makeSquad } = require('./squadBuilderHelpers.cjs');

const newPremierLeagueSquads = [
  // 1. Arsenal 1997-98 (Wenger First Double)
  makeSquad('arsenal-1997-98', 'Arsenal', '1997-98', 'Arsenal 1997-98 (Wenger First Premier League Double)', 'Premier League', 'ENG', '#EF0107', '#063672', 'Tiki-Taka', 'elite', [
    p('ars98-bergkamp', 'Dennis Bergkamp', null, null, null, 'Netherlands', null, 'FWD', 'CF', 92, 82, 91, 93, 94, 38, 78, 97, { id: 'bergkamp-iceman', name: 'The Iceman Pure Touch', description: '+30% first-time control and vision assist.', shortDesc: '+30% first touch', rarity: 'Legendary' }),
    p('ars98-wright', 'Ian Wright', null, null, null, 'England', null, 'FWD', 'ST', 88, 88, 90, 72, 85, 38, 80, 88, { id: 'wright-record', name: 'Highbury All-Time Poacher', description: '+25% penalty box conversion rate.', shortDesc: '+25% poacher xG', rarity: 'Epic' }),
    p('ars98-overmars', 'Marc Overmars', null, null, null, 'Netherlands', null, 'MID', 'LM', 88, 95, 83, 82, 88, 42, 70, 86, { id: 'overmars-roadrunner', name: 'Roadrunner Acceleration', description: '+30% transition pace and Old Trafford winners.', shortDesc: '+30% burst pace', rarity: 'Epic' }),
    p('ars98-parlour', 'Ray Parlour', null, null, null, 'England', null, 'MID', 'RM', 83, 80, 76, 82, 80, 78, 84, 84),
    p('ars98-vieira', 'Patrick Vieira', null, null, null, 'France', null, 'MID', 'CM', 90, 83, 76, 86, 84, 91, 93, 92, { id: 'vieira-colossus', name: 'Highbury Colossus', description: '+30% midfield dominance and ground recoveries.', shortDesc: '+30% dominance', rarity: 'Legendary' }),
    p('ars98-petit', 'Emmanuel Petit', null, null, null, 'France', null, 'MID', 'CM', 86, 75, 80, 86, 81, 85, 86, 88),
    p('ars98-winterburn', 'Nigel Winterburn', null, null, null, 'England', null, 'DEF', 'LB', 83, 78, 62, 78, 75, 84, 82, 84),
    p('ars98-adams', 'Tony Adams', null, null, null, 'England', null, 'DEF', 'CB', 91, 72, 55, 75, 68, 94, 92, 96, { id: 'adams-captain', name: 'Mr. Arsenal Leadership', description: '+30% defensive line organization and composure.', shortDesc: '+30% org/composure', rarity: 'Legendary' }),
    p('ars98-bould', 'Steve Bould', null, null, null, 'England', null, 'DEF', 'CB', 83, 68, 45, 74, 64, 86, 88, 84),
    p('ars98-dixon', 'Lee Dixon', null, null, null, 'England', null, 'DEF', 'RB', 84, 80, 62, 79, 77, 85, 80, 86),
    p('ars98-seaman', 'David Seaman', null, null, null, 'England', null, 'GK', 'GK', 89, 52, 20, 75, 50, 90, 86, 94, { id: 'seaman-safehands', name: 'Safe Hands Highbury', description: '+25% penalty box cross claiming.', shortDesc: '+25% cross claim', rarity: 'Legendary' })
  ]),

  // 2. Chelsea 2011-12 (Munich Champions League)
  makeSquad('chelsea-2011-12', 'Chelsea', '2011-12', 'Chelsea 2011-12 (Miracle of Munich UCL Champions)', 'Premier League', 'ENG', '#034694', '#EE242C', 'Low-Block Counter', 'elite', [
    p('che12-drogba', 'Didier Drogba', null, null, null, 'Ivory Coast', null, 'FWD', 'ST', 91, 84, 92, 78, 84, 45, 93, 96, { id: 'drogba-munich', name: '88th Min Bullet Header', description: '+35% clutch header scoring in cup finals.', shortDesc: '+35% final headers', rarity: 'Legendary' }),
    p('che12-mata', 'Juan Mata', null, null, null, 'Spain', null, 'MID', 'CAM', 87, 78, 83, 90, 88, 42, 65, 88, { id: 'mata-wizard', name: 'Corner Delivery to Drogba', description: '+25% dead-ball assist conversion.', shortDesc: '+25% dead-ball', rarity: 'Epic' }),
    p('che12-kalou', 'Salomon Kalou', null, null, null, 'Ivory Coast', null, 'FWD', 'RW', 82, 85, 80, 76, 83, 40, 76, 80),
    p('che12-lampard', 'Frank Lampard', null, null, null, 'England', null, 'MID', 'CM', 90, 74, 92, 89, 83, 76, 84, 94, { id: 'lampard-box', name: 'All-Time Midfield Finisher', description: '+30% late penalty box arrival goals.', shortDesc: '+30% box goals', rarity: 'Legendary' }),
    p('che12-mikel', 'John Obi Mikel', null, null, null, 'Nigeria', null, 'MID', 'CDM', 82, 68, 60, 80, 78, 84, 85, 84),
    p('che12-ramires', 'Ramires', null, null, null, 'Brazil', null, 'MID', 'CM', 84, 90, 76, 78, 82, 78, 86, 84, { id: 'ramires-chip', name: 'Camp Nou 45th Min Chip', description: '+30% breakaway counter-attack pace.', shortDesc: '+30% break pace', rarity: 'Epic' }),
    p('che12-cole', 'Ashley Cole', null, null, null, 'England', null, 'DEF', 'LB', 88, 86, 62, 82, 82, 88, 78, 88, { id: 'cole-lockdown', name: 'Lockdown Robben & Ronaldo', description: '+30% 1v1 tackle win rate vs world wingers.', shortDesc: '+30% wide tackles', rarity: 'Legendary' }),
    p('che12-luiz', 'David Luiz', null, null, null, 'Brazil', null, 'DEF', 'CB', 84, 76, 70, 78, 75, 84, 85, 83),
    p('che12-cahill', 'Gary Cahill', null, null, null, 'England', null, 'DEF', 'CB', 84, 72, 50, 72, 68, 86, 86, 84),
    p('che12-bosingwa', 'José Bosingwa', null, null, null, 'Portugal', null, 'DEF', 'RB', 81, 84, 64, 76, 78, 79, 78, 80),
    p('che12-cech', 'Petr Čech', null, null, null, 'Czech Republic', null, 'GK', 'GK', 91, 52, 20, 75, 52, 92, 88, 96, { id: 'cech-helmet', name: 'Munich 6-Penalty Read', description: '+35% penalty shootout save rate.', shortDesc: '+35% penalty saves', rarity: 'Legendary' })
  ]),

  // 3. Chelsea 2016-17 (Conte 30 Wins Title)
  makeSquad('chelsea-2016-17', 'Chelsea', '2016-17', 'Chelsea 2016-17 (Conte 30-Win 3-4-3 Title)', 'Premier League', 'ENG', '#034694', '#EE242C', 'Direct Vertical', 'elite', [
    p('che17-costa', 'Diego Costa', null, null, null, 'Spain', null, 'FWD', 'ST', 88, 82, 89, 74, 82, 45, 91, 89, { id: 'costa-beast', name: 'Beast of the Bridge', description: '+25% physical box bully finishing.', shortDesc: '+25% box strength', rarity: 'Epic' }),
    p('che17-hazard', 'Eden Hazard', null, null, null, 'Belgium', null, 'FWD', 'LW', 92, 91, 86, 87, 95, 38, 72, 91, { id: 'hazard-magic', name: 'Solo Anarchy from Halfway', description: '+35% take-on conversion through central block.', shortDesc: '+35% solo dribble', rarity: 'Legendary' }),
    p('che17-pedro', 'Pedro', null, null, null, 'Spain', null, 'FWD', 'RW', 84, 86, 82, 80, 84, 46, 68, 83),
    p('che17-kante', 'N\'Golo Kanté', null, null, null, 'France', null, 'MID', 'CM', 89, 82, 68, 82, 83, 92, 88, 92, { id: 'kante-earth', name: 'Covers 71% of the Earth', description: '+35% interception and turnover recovery.', shortDesc: '+35% turnovers', rarity: 'Legendary' }),
    p('che17-matic', 'Nemanja Matić', null, null, null, 'Serbia', null, 'MID', 'CM', 85, 70, 72, 82, 79, 86, 88, 86),
    p('che17-alonso', 'Marcos Alonso', null, null, null, 'Spain', null, 'DEF', 'LWB', 84, 78, 82, 80, 81, 79, 82, 85, { id: 'alonso-freekick', name: 'Wingback Free-Kick Sniper', description: '+25% direct set piece and far-post goals.', shortDesc: '+25% wingback goals', rarity: 'Rare' }),
    p('che17-moses', 'Victor Moses', null, null, null, 'Nigeria', null, 'DEF', 'RWB', 81, 88, 72, 75, 82, 74, 80, 80),
    p('che17-cahill', 'Gary Cahill', null, null, null, 'England', null, 'DEF', 'CB', 84, 72, 52, 72, 68, 86, 86, 85),
    p('che17-luiz', 'David Luiz', null, null, null, 'Brazil', null, 'DEF', 'CB', 85, 75, 72, 80, 76, 86, 85, 84, { id: 'luiz-sweeper', name: 'Libero Central Distributor', description: '+20% long counter-ball distribution.', shortDesc: '+20% counter passes', rarity: 'Rare' }),
    p('che17-azpilicueta', 'César Azpilicueta', null, null, null, 'Spain', null, 'DEF', 'CB', 86, 80, 58, 80, 78, 88, 82, 88, { id: 'dave-reliable', name: 'Azpi Pinpoint Early Cross', description: '+25% cross delivery accuracy to far post.', shortDesc: '+25% crossing', rarity: 'Epic' }),
    p('che17-courtois', 'Thibaut Courtois', null, null, null, 'Belgium', null, 'GK', 'GK', 89, 52, 20, 75, 50, 90, 85, 90)
  ]),

  // 4. Liverpool 2013-14 (SAS 101 Goals)
  makeSquad('liverpool-2013-14', 'Liverpool', '2013-14', 'Liverpool 2013-14 (Suarez & Sturridge 101 Goals)', 'Premier League', 'ENG', '#C8102E', '#00B2A9', 'Direct Vertical', 'elite', [
    p('liv14-suarez', 'Luis Suárez', null, null, null, 'Uruguay', null, 'FWD', 'ST', 95, 88, 96, 85, 93, 55, 86, 94, { id: 'suarez-godmode', name: '31 Goals in 33 Matches (0 Pens)', description: '+35% impossible-angle scoring and volleys.', shortDesc: '+35% world-class xG', rarity: 'Legendary' }),
    p('liv14-sturridge', 'Daniel Sturridge', null, null, null, 'England', null, 'FWD', 'ST', 86, 89, 88, 76, 86, 36, 75, 86, { id: 'sturridge-arms', name: 'The Waving Arms Finish', description: '+25% rapid 1v1 dink and finish.', shortDesc: '+25% 1v1 finish', rarity: 'Epic' }),
    p('liv14-sterling', 'Raheem Sterling', null, null, null, 'England', null, 'MID', 'CAM', 83, 93, 76, 78, 88, 42, 65, 80),
    p('liv14-coutinho', 'Philippe Coutinho', null, null, null, 'Brazil', null, 'MID', 'CAM', 84, 82, 80, 88, 90, 48, 62, 84),
    p('liv14-gerrard', 'Steven Gerrard', null, null, null, 'England', null, 'MID', 'CDM', 87, 66, 87, 94, 82, 79, 82, 95, { id: 'gerrard-hollywood', name: 'Hollywood 60-Yard Switch', description: '+30% crossfield long pass accuracy.', shortDesc: '+30% long passes', rarity: 'Legendary' }),
    p('liv14-henderson', 'Jordan Henderson', null, null, null, 'England', null, 'MID', 'CM', 82, 80, 74, 82, 79, 78, 85, 84),
    p('liv14-flanagan', 'Jon Flanagan', null, null, null, 'England', null, 'DEF', 'LB', 76, 76, 52, 70, 70, 78, 80, 77),
    p('liv14-skrtel', 'Martin Škrtel', null, null, null, 'Slovakia', null, 'DEF', 'CB', 82, 68, 55, 66, 62, 84, 88, 82, { id: 'skrtel-corners', name: 'Corner Header Threat (7 Goals)', description: '+25% corner header goal threat.', shortDesc: '+25% corner headers', rarity: 'Rare' }),
    p('liv14-agger', 'Daniel Agger', null, null, null, 'Denmark', null, 'DEF', 'CB', 83, 70, 60, 76, 72, 84, 82, 85),
    p('liv14-johnson', 'Glen Johnson', null, null, null, 'England', null, 'DEF', 'RB', 80, 82, 68, 77, 80, 77, 78, 80),
    p('liv14-mignolet', 'Simon Mignolet', null, null, null, 'Belgium', null, 'GK', 'GK', 81, 50, 20, 68, 48, 82, 78, 80)
  ]),

  // 5. Manchester City 2011-12 (93:20 Aguerooo)
  makeSquad('man-city-2011-12', 'Manchester City', '2011-12', 'Manchester City 2011-12 (Aguerooo 93:20 Champions)', 'Premier League', 'ENG', '#6CABDD', '#1C2C5B', 'Direct Vertical', 'elite', [
    p('mcfc12-aguero', 'Sergio Agüero', null, null, null, 'Argentina', null, 'FWD', 'ST', 90, 88, 92, 78, 90, 36, 80, 96, { id: 'aguero-9320', name: '93:20 AGUEROOOOO', description: '+35% stoppage-time winning goal conversion.', shortDesc: '+35% late winner', rarity: 'Legendary' }),
    p('mcfc12-tevez', 'Carlos Tévez', null, null, null, 'Argentina', null, 'FWD', 'ST', 88, 84, 89, 82, 88, 52, 86, 90),
    p('mcfc12-silva', 'David Silva', null, null, null, 'Spain', null, 'MID', 'CAM', 89, 78, 80, 92, 92, 45, 60, 92, { id: 'silva-merlin', name: 'El Mago Vision', description: '+25% defense-splitting key passes.', shortDesc: '+25% through balls', rarity: 'Legendary' }),
    p('mcfc12-nasri', 'Samir Nasri', null, null, null, 'France', null, 'MID', 'LM', 85, 82, 80, 87, 88, 45, 65, 84),
    p('mcfc12-toure', 'Yaya Touré', null, null, null, 'Ivory Coast', null, 'MID', 'CM', 90, 82, 86, 88, 87, 82, 92, 92, { id: 'toure-juggernaut', name: 'Ivorian Juggernaut Surge', description: '+30% physical burst through central midfield.', shortDesc: '+30% physical burst', rarity: 'Legendary' }),
    p('mcfc12-barry', 'Gareth Barry', null, null, null, 'England', null, 'MID', 'CDM', 82, 65, 72, 82, 76, 83, 80, 85),
    p('mcfc12-clichy', 'Gaël Clichy', null, null, null, 'France', null, 'DEF', 'LB', 81, 88, 55, 76, 78, 80, 76, 80),
    p('mcfc12-kompany', 'Vincent Kompany', null, null, null, 'Belgium', null, 'DEF', 'CB', 89, 74, 55, 76, 72, 91, 90, 95, { id: 'kompany-captain', name: 'Derby Header & Leader', description: '+25% defensive aerial duels.', shortDesc: '+25% aerials', rarity: 'Legendary' }),
    p('mcfc12-lescott', 'Joleon Lescott', null, null, null, 'England', null, 'DEF', 'CB', 83, 72, 48, 70, 66, 85, 86, 82),
    p('mcfc12-zabaleta', 'Pablo Zabaleta', null, null, null, 'Argentina', null, 'DEF', 'RB', 83, 80, 62, 78, 77, 84, 85, 86),
    p('mcfc12-hart', 'Joe Hart', null, null, null, 'England', null, 'GK', 'GK', 86, 55, 20, 72, 52, 87, 82, 86)
  ]),

  // 6. Arsenal 2022-23 (Arteta Title Challenge)
  makeSquad('arsenal-2022-23', 'Arsenal', '2022-23', 'Arsenal 2022-23 (Arteta Title Challenge & UCL Return)', 'Premier League', 'ENG', '#EF0107', '#063672', 'Tiki-Taka', 'high', [
    p('ars23-jesus', 'Gabriel Jesus', null, null, null, 'Brazil', null, 'FWD', 'ST', 84, 85, 82, 78, 87, 45, 76, 84),
    p('ars23-martinelli', 'Gabriel Martinelli', null, null, null, 'Brazil', null, 'FWD', 'LW', 84, 91, 80, 78, 86, 45, 74, 82),
    p('ars23-saka', 'Bukayo Saka', null, null, null, 'England', null, 'FWD', 'RW', 87, 87, 83, 84, 88, 62, 76, 88, { id: 'saka-starboy', name: 'Starboy Cut Inside', description: '+25% right-wing curling finish accuracy.', shortDesc: '+25% curl xG', rarity: 'Epic' }),
    p('ars23-odegaard', 'Martin Ødegaard', null, null, null, 'Norway', null, 'MID', 'CAM', 88, 78, 84, 90, 89, 64, 68, 90, { id: 'odegaard-maestro', name: 'Skipper No-Look Pass', description: '+25% key pass vision in the final third.', shortDesc: '+25% final ball', rarity: 'Epic' }),
    p('ars23-xhaka', 'Granit Xhaka', null, null, null, 'Switzerland', null, 'MID', 'CM', 83, 68, 80, 85, 78, 80, 84, 86),
    p('ars23-partey', 'Thomas Partey', null, null, null, 'Ghana', null, 'MID', 'CDM', 85, 72, 75, 84, 83, 85, 85, 86),
    p('ars23-zinchenko', 'Oleksandr Zinchenko', null, null, null, 'Ukraine', null, 'DEF', 'LB', 82, 76, 68, 85, 83, 78, 72, 84),
    p('ars23-gabriel', 'Gabriel Magalhães', null, null, null, 'Brazil', null, 'DEF', 'CB', 85, 74, 52, 72, 70, 86, 88, 85),
    p('ars23-saliba', 'William Saliba', null, null, null, 'France', null, 'DEF', 'CB', 86, 83, 40, 78, 78, 87, 85, 88, { id: 'saliba-rollsroyce', name: 'Rolls Royce Recovery', description: '+25% recovery tackle without conceding fouls.', shortDesc: '+25% recovery tackles', rarity: 'Epic' }),
    p('ars23-white', 'Ben White', null, null, null, 'England', null, 'DEF', 'RB', 82, 78, 55, 78, 77, 82, 80, 84),
    p('ars23-ramsdale', 'Aaron Ramsdale', null, null, null, 'England', null, 'GK', 'GK', 83, 52, 22, 82, 55, 84, 78, 84)
  ]),

  // 7. Aston Villa 2023-24 (Emery UCL Return)
  makeSquad('aston-villa-2023-24', 'Aston Villa', '2023-24', 'Aston Villa 2023-24 (Emery Champions League Return)', 'Premier League', 'ENG', '#95BFE5', '#670E36', 'Direct Vertical', 'high', [
    p('avl24-watkins', 'Ollie Watkins', null, null, null, 'England', null, 'FWD', 'ST', 86, 88, 87, 78, 83, 42, 82, 86, { id: 'watkins-double', name: '19 Goals & 13 Assists', description: '+25% counter-attack box clinical finish.', shortDesc: '+25% counter finish', rarity: 'Epic' }),
    p('avl24-bailey', 'Leon Bailey', null, null, null, 'Jamaica', null, 'FWD', 'RW', 83, 91, 80, 80, 86, 40, 68, 82),
    p('avl24-diaby', 'Moussa Diaby', null, null, null, 'France', null, 'FWD', 'LW', 83, 93, 77, 78, 86, 38, 64, 80),
    p('avl24-mcginn', 'John McGinn', null, null, null, 'Scotland', null, 'MID', 'CM', 83, 76, 78, 82, 82, 80, 86, 86, { id: 'mcginn-meatball', name: 'Meatball Shield & Turn', description: '+25% possession protection under pressure.', shortDesc: '+25% ball shield', rarity: 'Rare' }),
    p('avl24-luiz', 'Douglas Luiz', null, null, null, 'Brazil', null, 'MID', 'CM', 84, 74, 82, 85, 83, 80, 78, 86, { id: 'luiz-olympic', name: 'Corner Olimpico Threat', description: '+25% direct set piece and penalty accuracy.', shortDesc: '+25% set-piece', rarity: 'Rare' }),
    p('avl24-kamara', 'Boubacar Kamara', null, null, null, 'France', null, 'MID', 'CDM', 82, 74, 62, 80, 79, 83, 82, 82),
    p('avl24-digne', 'Lucas Digne', null, null, null, 'France', null, 'DEF', 'LB', 81, 78, 70, 82, 78, 78, 76, 82),
    p('avl24-torres', 'Pau Torres', null, null, null, 'Spain', null, 'DEF', 'CB', 84, 72, 45, 82, 76, 85, 78, 85),
    p('avl24-carlos', 'Diego Carlos', null, null, null, 'Brazil', null, 'DEF', 'CB', 81, 74, 45, 68, 65, 83, 88, 80),
    p('avl24-konsa', 'Ezri Konsa', null, null, null, 'England', null, 'DEF', 'RB', 82, 80, 40, 74, 72, 83, 82, 82),
    p('avl24-martinez', 'Emiliano Martínez', null, null, null, 'Argentina', null, 'GK', 'GK', 87, 52, 22, 78, 55, 88, 86, 94, { id: 'dibu-psyche', name: 'Dibu Mindgames & Saves', description: '+35% penalty shootout and 1v1 save probability.', shortDesc: '+35% mindgames saves', rarity: 'Legendary' })
  ]),

  // 8. Newcastle United 2022-23 (Howe Top 4 Surge)
  makeSquad('newcastle-2022-23', 'Newcastle United', '2022-23', 'Newcastle United 2022-23 (Howe 20-Yr UCL Return)', 'Premier League', 'ENG', '#241F20', '#41B6E6', 'Gegenpress', 'high', [
    p('nufc23-isak', 'Alexander Isak', null, null, null, 'Sweden', null, 'FWD', 'ST', 86, 90, 86, 78, 88, 38, 76, 86, { id: 'isak-henry', name: 'St. James\' Grace & Glide', description: '+25% take-on and precision box finish.', shortDesc: '+25% dribble finish', rarity: 'Epic' }),
    p('nufc23-wilson', 'Callum Wilson', null, null, null, 'England', null, 'FWD', 'ST', 82, 82, 84, 68, 78, 40, 82, 83),
    p('nufc23-almiron', 'Miguel Almirón', null, null, null, 'Paraguay', null, 'FWD', 'RW', 82, 88, 80, 77, 83, 58, 74, 82),
    p('nufc23-bruno', 'Bruno Guimarães', null, null, null, 'Brazil', null, 'MID', 'CM', 86, 76, 80, 87, 86, 81, 84, 88, { id: 'bruno-geordie', name: 'Geordie Brazilian Maestro', description: '+25% turnover escape and incisive pass.', shortDesc: '+25% escape passes', rarity: 'Epic' }),
    p('nufc23-joelinton', 'Joelinton', null, null, null, 'Brazil', null, 'MID', 'CM', 83, 78, 76, 78, 80, 82, 90, 84),
    p('nufc23-willock', 'Joe Willock', null, null, null, 'England', null, 'MID', 'CM', 80, 82, 75, 78, 80, 72, 76, 80),
    p('nufc23-burn', 'Dan Burn', null, null, null, 'England', null, 'DEF', 'LB', 80, 68, 48, 72, 68, 82, 90, 82),
    p('nufc23-botman', 'Sven Botman', null, null, null, 'Netherlands', null, 'DEF', 'CB', 83, 72, 40, 72, 66, 85, 86, 84),
    p('nufc23-schar', 'Fabian Schär', null, null, null, 'Switzerland', null, 'DEF', 'CB', 82, 68, 75, 78, 72, 83, 80, 85),
    p('nufc23-trippier', 'Kieran Trippier', null, null, null, 'England', null, 'DEF', 'RB', 85, 76, 74, 88, 81, 82, 74, 88, { id: 'trippier-cross', name: 'Dead-Ball Specialist', description: '+30% set piece assist and crossing delivery.', shortDesc: '+30% set-piece', rarity: 'Epic' }),
    p('nufc23-pope', 'Nick Pope', null, null, null, 'England', null, 'GK', 'GK', 84, 50, 20, 68, 48, 86, 82, 85)
  ])
];

module.exports = { newPremierLeagueSquads };
