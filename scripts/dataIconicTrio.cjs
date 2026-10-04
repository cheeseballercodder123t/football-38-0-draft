const { p, makeSquad } = require('./squadBuilderHelpers.cjs');

const iconicTrioSquads = [
  // 1. Arsenal 2003-04 (Invincibles)
  makeSquad('arsenal-2003-04', 'Arsenal', '2003-04', 'Arsenal 2003-04 (The Invincibles 26-12-0)', 'Premier League', 'ENG', '#EF0107', '#063672', 'Direct Vertical', 'elite', [
    p('ars04-henry', 'Thierry Henry', null, null, null, 'France', null, 'FWD', 'ST', 95, 96, 95, 88, 95, 42, 82, 96, { id: 'henry-va-va-voom', name: 'Va-Va-Voom Highbury Grace', description: '+35% left channel cut inside finesse finish.', shortDesc: '+35% finesse finish', rarity: 'Legendary' }),
    p('ars04-bergkamp', 'Dennis Bergkamp', null, null, null, 'Netherlands', null, 'FWD', 'CF', 92, 82, 91, 93, 94, 38, 78, 97, { id: 'bergkamp-iceman', name: 'The Iceman Pure Touch', description: '+30% first-time control and vision assist.', shortDesc: '+30% first touch', rarity: 'Legendary' }),
    p('ars04-pires', 'Robert Pires', null, null, null, 'France', null, 'MID', 'LM', 89, 84, 86, 88, 89, 45, 74, 88, { id: 'pires-curler', name: 'Highbury Curler', description: '+25% far-post curling finish.', shortDesc: '+25% far-post curl', rarity: 'Epic' }),
    p('ars04-ljungberg', 'Freddie Ljungberg', null, null, null, 'Sweden', null, 'MID', 'RM', 87, 88, 84, 80, 85, 52, 78, 86),
    p('ars04-vieira', 'Patrick Vieira', null, null, null, 'France', null, 'MID', 'CM', 91, 84, 78, 88, 85, 92, 94, 94, { id: 'vieira-engine', name: 'Captain Invincible Strides', description: '+30% physical duel dominance in central midfield.', shortDesc: '+30% duels', rarity: 'Legendary' }),
    p('ars04-gilberto', 'Gilberto Silva', null, null, null, 'Brazil', null, 'MID', 'CDM', 87, 74, 68, 82, 78, 88, 86, 88, { id: 'gilberto-invisible', name: 'The Invisible Wall', description: '+25% defensive transition interception.', shortDesc: '+25% interceptions', rarity: 'Epic' }),
    p('ars04-cole', 'Ashley Cole', null, null, null, 'England', null, 'DEF', 'LB', 89, 89, 62, 82, 84, 89, 80, 88, { id: 'cole-lockdown', name: 'World-Class 1v1 Fullback', description: '+25% tackle recovery against fast wingers.', shortDesc: '+25% fullback tackles', rarity: 'Legendary' }),
    p('ars04-campbell', 'Sol Campbell', null, null, null, 'England', null, 'DEF', 'CB', 90, 78, 45, 72, 68, 93, 94, 92, { id: 'campbell-rock', name: 'The Rock of London', description: '+30% box clearance and strength.', shortDesc: '+30% box rock', rarity: 'Legendary' }),
    p('ars04-toure', 'Kolo Touré', null, null, null, 'Ivory Coast', null, 'DEF', 'CB', 86, 85, 45, 74, 72, 87, 86, 85),
    p('ars04-lauren', 'Lauren', null, null, null, 'Cameroon', null, 'DEF', 'RB', 84, 82, 65, 78, 79, 84, 85, 86),
    p('ars04-lehmann', 'Jens Lehmann', null, null, null, 'Germany', null, 'GK', 'GK', 87, 54, 20, 75, 52, 88, 85, 90, { id: 'lehmann-zero', name: 'Invincible 0-Loss Goalkeeping', description: '+25% high-claim dominance in box.', shortDesc: '+25% cross claim', rarity: 'Epic' }),
    // Bench
    p('ars04-wiltord', 'Sylvain Wiltord', null, null, null, 'France', null, 'FWD', 'ST', 83, 85, 83, 78, 82, 38, 78, 84),
    p('ars04-parlour', 'Ray Parlour', null, null, null, 'England', null, 'MID', 'CM', 82, 78, 75, 82, 79, 80, 84, 83),
    p('ars04-keown', 'Martin Keown', null, null, null, 'England', null, 'DEF', 'CB', 82, 70, 40, 68, 64, 86, 88, 85),
    p('ars04-edu', 'Edu Gaspar', null, null, null, 'Brazil', null, 'MID', 'CM', 82, 75, 76, 84, 82, 75, 78, 82),
    p('ars04-cygan', 'Pascal Cygan', null, null, null, 'France', null, 'DEF', 'CB', 78, 65, 35, 66, 62, 80, 82, 77),
    p('ars04-clichy', 'Gaël Clichy', null, null, null, 'France', null, 'DEF', 'LB', 78, 86, 50, 74, 78, 77, 75, 77),
    p('ars04-taylor', 'Stuart Taylor', null, null, null, 'England', null, 'GK', 'GK', 76, 50, 20, 65, 45, 77, 75, 76)
  ]),

  // 2. Barcelona 2010-11 (Pep Peak)
  makeSquad('barcelona-2010-11', 'FC Barcelona', '2010-11', 'FC Barcelona 2010-11 (Pep Guardiola Peak Wembley)', 'La Liga', 'ESP', '#A50044', '#004D98', 'Tiki-Taka', 'elite', [
    p('fcb11-messi', 'Lionel Messi', null, null, null, 'Argentina', null, 'FWD', 'CF', 98, 96, 96, 93, 99, 40, 74, 98, { id: 'messi-false9', name: 'The False 9 Masterpiece', description: '+40% through-ball and box finish synergy.', shortDesc: '+40% false 9 xG', rarity: 'Legendary' }),
    p('fcb11-villa', 'David Villa', null, null, null, 'Spain', null, 'FWD', 'LW', 90, 88, 93, 80, 88, 40, 76, 92, { id: 'villa-wembley', name: 'Wembley Curler to Top Corner', description: '+30% far-post curling top-corner finish.', shortDesc: '+30% top-corner curl', rarity: 'Legendary' }),
    p('fcb11-pedro', 'Pedro', null, null, null, 'Spain', null, 'FWD', 'RW', 86, 88, 84, 82, 85, 48, 70, 86, { id: 'pedro-firsttime', name: 'Wembley Opening Strike', description: '+25% first-time precision box strike.', shortDesc: '+25% 1st touch xG', rarity: 'Epic' }),
    p('fcb11-xavi', 'Xavi Hernández', null, null, null, 'Spain', null, 'MID', 'CM', 95, 72, 78, 99, 93, 74, 68, 99, { id: 'xavi-control', name: 'The Metronome of History', description: '+35% complete possession retention under press.', shortDesc: '+35% ball control', rarity: 'Legendary' }),
    p('fcb11-iniesta', 'Andrés Iniesta', null, null, null, 'Spain', null, 'MID', 'CM', 94, 84, 84, 96, 97, 65, 68, 98, { id: 'iniesta-glide', name: 'Croqueta Past 3 Defenders', description: '+35% croqueta dribble breakthrough.', shortDesc: '+35% croqueta', rarity: 'Legendary' }),
    p('fcb11-busquets', 'Sergio Busquets', null, null, null, 'Spain', null, 'MID', 'CDM', 90, 52, 65, 92, 89, 88, 80, 96, { id: 'busquets-octopus', name: 'Octopus of Badia', description: '+30% first-touch press evasion and turnover.', shortDesc: '+30% press escape', rarity: 'Legendary' }),
    p('fcb11-abidal', 'Éric Abidal', null, null, null, 'France', null, 'DEF', 'LB', 86, 82, 52, 80, 78, 88, 84, 94, { id: 'abidal-wembley', name: 'Wembley Trophy Lift Inspiration', description: '+30% defensive team morale boost.', shortDesc: '+30% team morale', rarity: 'Legendary' }),
    p('fcb11-puyol', 'Carles Puyol', null, null, null, 'Spain', null, 'DEF', 'CB', 92, 78, 55, 74, 68, 95, 91, 98, { id: 'puyol-tarzan', name: 'El Tiburón Heart', description: '+30% box block and clearance.', shortDesc: '+30% box blocks', rarity: 'Legendary' }),
    p('fcb11-pique', 'Gerard Piqué', null, null, null, 'Spain', null, 'DEF', 'CB', 90, 72, 65, 85, 76, 91, 87, 90, { id: 'pique-piquenbauer', name: 'Piquenbauer Distribution', description: '+25% line-breaking passes from defense.', shortDesc: '+25% build-up passes', rarity: 'Epic' }),
    p('fcb11-alves', 'Dani Alves', null, null, null, 'Brazil', null, 'DEF', 'RB', 91, 93, 78, 89, 91, 85, 82, 90, { id: 'alves-express', name: 'Right Flank Highway Express', description: '+30% overlap linkup with Messi.', shortDesc: '+30% wing linkup', rarity: 'Legendary' }),
    p('fcb11-valdes', 'Víctor Valdés', null, null, null, 'Spain', null, 'GK', 'GK', 88, 56, 20, 86, 56, 89, 82, 91),
    // Bench
    p('fcb11-mascherano', 'Javier Mascherano', null, null, null, 'Argentina', null, 'MID', 'CDM', 86, 78, 60, 80, 75, 88, 86, 87),
    p('fcb11-keita', 'Seydou Keita', null, null, null, 'Mali', null, 'MID', 'CM', 83, 76, 78, 82, 80, 79, 83, 84),
    p('fcb11-bojan', 'Bojan Krkić', null, null, null, 'Spain', null, 'FWD', 'ST', 80, 84, 80, 78, 85, 32, 65, 78),
    p('fcb11-maxwell', 'Maxwell', null, null, null, 'Brazil', null, 'DEF', 'LB', 81, 80, 68, 80, 82, 78, 76, 81),
    p('fcb11-adriano', 'Adriano Correia', null, null, null, 'Brazil', null, 'DEF', 'RB', 80, 82, 75, 77, 80, 77, 75, 79),
    p('fcb11-afellay', 'Ibrahim Afellay', null, null, null, 'Netherlands', null, 'MID', 'CAM', 80, 83, 78, 80, 84, 45, 70, 78),
    p('fcb11-thiago', 'Thiago Alcântara', null, null, null, 'Spain', null, 'MID', 'CM', 80, 78, 74, 85, 87, 68, 68, 84),
    p('fcb11-pinto', 'José Manuel Pinto', null, null, null, 'Spain', null, 'GK', 'GK', 77, 50, 25, 68, 55, 78, 76, 80)
  ]),

  // 3. Real Madrid 2011-12 (Mourinho 100 Pts 121 Gls)
  makeSquad('real-madrid-2011-12', 'Real Madrid', '2011-12', 'Real Madrid 2011-12 (Mourinho 100 Pts 121 Goals)', 'La Liga', 'ESP', '#FEBE10', '#00529F', 'Direct Vertical', 'elite', [
    p('rm12-cr7', 'Cristiano Ronaldo', null, null, null, 'Portugal', null, 'FWD', 'LW', 97, 96, 98, 85, 94, 38, 88, 97, { id: 'cr7-calma', name: 'Calma, Calma at Camp Nou', description: '+35% title-deciding breakaway conversion.', shortDesc: '+35% title-decider xG', rarity: 'Legendary' }),
    p('rm12-benzema', 'Karim Benzema', null, null, null, 'France', null, 'FWD', 'ST', 89, 84, 90, 84, 88, 40, 80, 90),
    p('rm12-higuain', 'Gonzalo Higuaín', null, null, null, 'Argentina', null, 'FWD', 'ST', 88, 86, 90, 78, 84, 38, 80, 88, { id: 'pipita-22goals', name: 'El Pipita 22 League Goals', description: '+25% clinical counter-attack strike.', shortDesc: '+25% counter xG', rarity: 'Epic' }),
    p('rm12-ozil', 'Mesut Özil', null, null, null, 'Germany', null, 'MID', 'CAM', 91, 82, 78, 96, 90, 38, 65, 92, { id: 'ozil-bounce', name: 'Bounce Pass Master (17 Assists)', description: '+35% counter-attack final through ball.', shortDesc: '+35% counter assist', rarity: 'Legendary' }),
    p('rm12-alonso', 'Xabi Alonso', null, null, null, 'Spain', null, 'MID', 'CDM', 90, 64, 84, 96, 82, 85, 80, 95, { id: 'xabi-quarterback', name: 'Quarterback 70-Yard Laser', description: '+30% long diagonal counter release.', shortDesc: '+30% diagonal switch', rarity: 'Legendary' }),
    p('rm12-khedira', 'Sami Khedira', null, null, null, 'Germany', null, 'MID', 'CM', 84, 76, 75, 80, 78, 84, 88, 84),
    p('rm12-marcelo', 'Marcelo', null, null, null, 'Brazil', null, 'DEF', 'LB', 88, 86, 74, 85, 91, 80, 78, 86),
    p('rm12-ramos', 'Sergio Ramos', null, null, null, 'Spain', null, 'DEF', 'CB', 91, 82, 74, 78, 74, 92, 88, 97, { id: 'ramos-titan', name: 'Central Rock Transition', description: '+25% box duel win rate and headed clearance.', shortDesc: '+25% clearances', rarity: 'Legendary' }),
    p('rm12-pepe', 'Pepe', null, null, null, 'Portugal', null, 'DEF', 'CB', 89, 82, 45, 68, 65, 93, 91, 90, { id: 'pepe-ferocious', name: 'Ferocious Aerial & Ground Dominance', description: '+30% physical challenge duel wins.', shortDesc: '+30% physical duels', rarity: 'Epic' }),
    p('rm12-arbeloa', 'Álvaro Arbeloa', null, null, null, 'Spain', null, 'DEF', 'RB', 82, 78, 52, 75, 74, 83, 80, 85),
    p('rm12-casillas', 'Iker Casillas', null, null, null, 'Spain', null, 'GK', 'GK', 92, 60, 22, 76, 56, 93, 82, 97, { id: 'casillas-saint', name: 'San Iker Miracle Saves', description: '+30% 1v1 reflex stopping against world-class strikers.', shortDesc: '+30% 1v1 reflex', rarity: 'Legendary' }),
    // Bench
    p('rm12-kaka', 'Kaká', null, null, null, 'Brazil', null, 'MID', 'CAM', 86, 82, 84, 87, 86, 42, 73, 88),
    p('rm12-callejon', 'José Callejón', null, null, null, 'Spain', null, 'FWD', 'RW', 81, 87, 80, 75, 81, 46, 74, 80),
    p('rm12-granero', 'Esteban Granero', null, null, null, 'Spain', null, 'MID', 'CM', 80, 73, 77, 82, 79, 72, 75, 80),
    p('rm12-albiol', 'Raúl Albiol', null, null, null, 'Spain', null, 'DEF', 'CB', 82, 72, 45, 70, 66, 84, 82, 81),
    p('rm12-coentrao', 'Fábio Coentrão', null, null, null, 'Portugal', null, 'DEF', 'LB', 82, 85, 72, 79, 81, 80, 78, 81),
    p('rm12-varane', 'Raphaël Varane', null, null, null, 'France', null, 'DEF', 'CB', 79, 83, 42, 68, 68, 81, 80, 79),
    p('rm12-adan', 'Antonio Adán', null, null, null, 'Spain', null, 'GK', 'GK', 77, 50, 20, 65, 48, 78, 75, 76)
  ])
];

module.exports = { iconicTrioSquads };
