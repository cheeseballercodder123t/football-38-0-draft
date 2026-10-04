const fs = require('fs');
const path = require('path');

const squadsJsonPath = path.join(__dirname, '../src/data/squads.json');
const squadsTsPath = path.join(__dirname, '../src/data/squads.ts');

const currentSquads = JSON.parse(fs.readFileSync(squadsJsonPath, 'utf8'));

// Helper to build a squad
function makeSquad(id, clubName, year, fullName, league, countryCode, badgeColor, accentColor, primaryTactic, players) {
  return {
    id,
    clubName,
    year,
    fullName,
    type: 'club',
    league,
    countryCode,
    badgeColor,
    accentColor,
    primaryTactic,
    players: players.map((p, idx) => ({
      id: `${id}-p${idx + 1}`,
      name: p.name,
      clubYear: `${clubName} ${year}`,
      clubName,
      year,
      country: p.country,
      league,
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
    }))
  };
}

const massiveClubs = [
  // 1. Monaco 2016-17
  makeSquad('monaco-2016-17', 'AS Monaco', '2016-17', 'AS Monaco 2016-17 (Mbappé Breakthrough)', 'Other', 'FRA', '#E20613', '#FFFFFF', 'Direct Vertical', [
    { name: 'Kylian Mbappé', country: 'France', pos: 'FWD', spec: 'ST', ovr: 89, pac: 96, sho: 88, pas: 80, dri: 91, def: 36, phy: 78, com: 88, aura: { id: 'mbappe-breakout', name: 'Golden Boy Velocity', description: '+35% acceleration on counter-attacks.', shortDesc: '+35% counter pace', rarity: 'Legendary' } },
    { name: 'Radamel Falcao', country: 'Colombia', pos: 'FWD', spec: 'ST', ovr: 88, pac: 80, sho: 90, pas: 72, dri: 82, def: 38, phy: 84, com: 89, aura: { id: 'falcao-tiger', name: 'El Tigre Resurgence', description: '+30% penalty box header conversion.', shortDesc: '+30% header xG', rarity: 'Epic' } },
    { name: 'Bernardo Silva', country: 'Portugal', pos: 'MID', spec: 'RM', ovr: 88, pac: 82, sho: 79, pas: 89, dri: 92, def: 58, phy: 68, com: 89 },
    { name: 'Thomas Lemar', country: 'France', pos: 'MID', spec: 'LM', ovr: 84, pac: 84, sho: 80, pas: 85, dri: 86, def: 52, phy: 70, com: 82 },
    { name: 'Fabinho', country: 'Brazil', pos: 'MID', spec: 'CDM', ovr: 86, pac: 72, sho: 74, pas: 82, dri: 79, def: 88, phy: 86, com: 87 },
    { name: 'Tiemoué Bakayoko', country: 'France', pos: 'MID', spec: 'CDM', ovr: 83, pac: 74, sho: 68, pas: 78, dri: 78, def: 84, phy: 88, com: 80 },
    { name: 'Benjamin Mendy', country: 'France', pos: 'DEF', spec: 'LB', ovr: 83, pac: 87, sho: 64, pas: 82, dri: 80, def: 79, phy: 84, com: 79 },
    { name: 'Kamil Glik', country: 'Poland', pos: 'DEF', spec: 'CB', ovr: 84, pac: 58, sho: 48, pas: 65, dri: 60, def: 87, phy: 89, com: 83 },
    { name: 'Jemerson', country: 'Brazil', pos: 'DEF', spec: 'CB', ovr: 81, pac: 70, sho: 38, pas: 64, dri: 62, def: 83, phy: 82, com: 78 },
    { name: 'Djibril Sidibé', country: 'France', pos: 'DEF', spec: 'RB', ovr: 82, pac: 82, sho: 66, pas: 76, dri: 78, def: 80, phy: 81, com: 79 },
    { name: 'Danijel Subašić', country: 'Croatia', pos: 'GK', spec: 'GK', ovr: 84, pac: 55, sho: 24, pas: 74, dri: 48, def: 85, phy: 80, com: 86 }
  ]),

  // 2. Lyon 2004-05
  makeSquad('lyon-2004-05', 'Olympique Lyonnais', '2004-05', 'Olympique Lyonnais 2004-05 (Juninho Magic)', 'Other', 'FRA', '#FFFFFF', '#002B7F', 'Tiki-Taka', [
    { name: 'Sylvain Wiltord', country: 'France', pos: 'FWD', spec: 'ST', ovr: 84, pac: 83, sho: 84, pas: 78, dri: 82, def: 42, phy: 76, com: 84 },
    { name: 'Sidney Govou', country: 'France', pos: 'FWD', spec: 'RW', ovr: 83, pac: 88, sho: 80, pas: 77, dri: 84, def: 48, phy: 78, com: 81 },
    { name: 'Florent Malouda', country: 'France', pos: 'MID', spec: 'LM', ovr: 85, pac: 84, sho: 81, pas: 83, dri: 85, def: 60, phy: 79, com: 84 },
    { name: 'Juninho Pernambucano', country: 'Brazil', pos: 'MID', spec: 'CAM', ovr: 89, pac: 74, sho: 90, pas: 93, dri: 85, def: 65, phy: 72, com: 92, aura: { id: 'juninho-fk-king', name: 'Free Kick King', description: '+50% conversion on direct free kicks from anywhere within 35 yards.', shortDesc: '+50% direct FK xG', rarity: 'Legendary' } },
    { name: 'Michael Essien', country: 'Ghana', pos: 'MID', spec: 'CM', ovr: 87, pac: 83, sho: 82, pas: 83, dri: 82, def: 86, phy: 90, com: 86 },
    { name: 'Mahamadou Diarra', country: 'Mali', pos: 'MID', spec: 'CDM', ovr: 84, pac: 72, sho: 68, pas: 78, dri: 75, def: 86, phy: 88, com: 82 },
    { name: 'Eric Abidal', country: 'France', pos: 'DEF', spec: 'LB', ovr: 85, pac: 84, sho: 55, pas: 76, dri: 78, def: 86, phy: 84, com: 85 },
    { name: 'Cris', country: 'Brazil', pos: 'DEF', spec: 'CB', ovr: 86, pac: 70, sho: 45, pas: 68, dri: 64, def: 88, phy: 87, com: 86, aura: { id: 'cris-policeman', name: 'Le Policier', description: '+25% defensive tackle recovery in the 18-yard box.', shortDesc: '+25% box tackle success', rarity: 'Epic' } },
    { name: 'Caçapa', country: 'Brazil', pos: 'DEF', spec: 'CB', ovr: 82, pac: 68, sho: 40, pas: 66, dri: 62, def: 83, phy: 84, com: 81 },
    { name: 'Anthony Réveillère', country: 'France', pos: 'DEF', spec: 'RB', ovr: 82, pac: 81, sho: 56, pas: 76, dri: 77, def: 82, phy: 79, com: 80 },
    { name: 'Grégory Coupet', country: 'France', pos: 'GK', spec: 'GK', ovr: 87, pac: 60, sho: 28, pas: 75, dri: 52, def: 89, phy: 83, com: 89 }
  ]),

  // 3. Marseille 1992-93
  makeSquad('marseille-1992-93', 'Olympique de Marseille', '1992-93', 'Marseille 1992-93 (Champions League Winners)', 'Other', 'FRA', '#0099FF', '#FFFFFF', 'Low-Block Counter', [
    { name: 'Rudi Völler', country: 'Germany', pos: 'FWD', spec: 'ST', ovr: 87, pac: 82, sho: 88, pas: 76, dri: 84, def: 42, phy: 82, com: 89 },
    { name: 'Alen Bokšić', country: 'Croatia', pos: 'FWD', spec: 'ST', ovr: 86, pac: 89, sho: 86, pas: 74, dri: 86, def: 40, phy: 85, com: 84 },
    { name: 'Abedi Pele', country: 'Ghana', pos: 'MID', spec: 'CAM', ovr: 88, pac: 88, sho: 83, pas: 89, dri: 92, def: 52, phy: 76, com: 88, aura: { id: 'abedi-maestro', name: 'African Footballer of the Year', description: '+30% assist creation in knockout ties.', shortDesc: '+30% assist xA', rarity: 'Legendary' } },
    { name: 'Didier Deschamps', country: 'France', pos: 'MID', spec: 'CDM', ovr: 87, pac: 72, sho: 68, pas: 85, dri: 78, def: 89, phy: 84, com: 92 },
    { name: 'Franck Sauzée', country: 'France', pos: 'MID', spec: 'CM', ovr: 85, pac: 74, sho: 86, pas: 83, dri: 79, def: 82, phy: 84, com: 85 },
    { name: 'Jean-Jacques Eydelie', country: 'France', pos: 'MID', spec: 'CM', ovr: 80, pac: 75, sho: 70, pas: 76, dri: 74, def: 78, phy: 80, com: 79 },
    { name: 'Éric Di Meco', country: 'France', pos: 'DEF', spec: 'LB', ovr: 82, pac: 78, sho: 58, pas: 72, dri: 73, def: 84, phy: 85, com: 83 },
    { name: 'Basile Boli', country: 'France', pos: 'DEF', spec: 'CB', ovr: 87, pac: 74, sho: 60, pas: 68, dri: 65, def: 89, phy: 91, com: 88, aura: { id: 'boli-bullet', name: 'Munich Header Hero', description: '+35% conversion on set piece headers in UCL finals.', shortDesc: '+35% UCL set-piece goals', rarity: 'Epic' } },
    { name: 'Marcel Desailly', country: 'France', pos: 'DEF', spec: 'CB', ovr: 89, pac: 81, sho: 55, pas: 74, dri: 72, def: 92, phy: 92, com: 90 },
    { name: 'Jocelyn Angloma', country: 'France', pos: 'DEF', spec: 'RB', ovr: 84, pac: 85, sho: 62, pas: 76, dri: 78, def: 83, phy: 83, com: 82 },
    { name: 'Fabien Barthez', country: 'France', pos: 'GK', spec: 'GK', ovr: 88, pac: 66, sho: 28, pas: 78, dri: 60, def: 90, phy: 80, com: 91 }
  ]),

  // 4. Lille 2010-11
  makeSquad('lille-2010-11', 'LOSC Lille', '2010-11', 'LOSC Lille 2010-11 (Hazard & Sow Double)', 'Other', 'FRA', '#E2001A', '#FFFFFF', 'Direct Vertical', [
    { name: 'Eden Hazard', country: 'Belgium', pos: 'FWD', spec: 'LW', ovr: 89, pac: 91, sho: 83, pas: 87, dri: 94, def: 38, phy: 70, com: 89, aura: { id: 'hazard-prodigy', name: 'Ligue 1 Prodigy', description: '+35% take-on win rate; unstoppable dribbler.', shortDesc: '+35% dribble win rate', rarity: 'Legendary' } },
    { name: 'Moussa Sow', country: 'Senegal', pos: 'FWD', spec: 'ST', ovr: 85, pac: 84, sho: 88, pas: 68, dri: 79, def: 35, phy: 82, com: 85 },
    { name: 'Gervinho', country: 'Ivory Coast', pos: 'FWD', spec: 'RW', ovr: 84, pac: 93, sho: 79, pas: 76, dri: 87, def: 38, phy: 72, com: 80 },
    { name: 'Yohan Cabaye', country: 'France', pos: 'MID', spec: 'CM', ovr: 84, pac: 73, sho: 80, pas: 86, dri: 80, def: 78, phy: 76, com: 85 },
    { name: 'Rio Mavuba', country: 'France', pos: 'MID', spec: 'CDM', ovr: 83, pac: 72, sho: 60, pas: 80, dri: 76, def: 85, phy: 82, com: 84 },
    { name: 'Ludovic Obraniak', country: 'Poland', pos: 'MID', spec: 'CAM', ovr: 80, pac: 75, sho: 77, pas: 82, dri: 79, def: 55, phy: 70, com: 80 },
    { name: 'Franck Béria', country: 'France', pos: 'DEF', spec: 'LB', ovr: 80, pac: 78, sho: 50, pas: 71, dri: 72, def: 81, phy: 78, com: 79 },
    { name: 'Aurélien Chedjou', country: 'Cameroon', pos: 'DEF', spec: 'CB', ovr: 82, pac: 72, sho: 48, pas: 66, dri: 64, def: 84, phy: 85, com: 81 },
    { name: 'Adil Rami', country: 'France', pos: 'DEF', spec: 'CB', ovr: 83, pac: 68, sho: 54, pas: 68, dri: 60, def: 85, phy: 88, com: 82 },
    { name: 'Mathieu Debuchy', country: 'France', pos: 'DEF', spec: 'RB', ovr: 82, pac: 80, sho: 65, pas: 77, dri: 76, def: 82, phy: 80, com: 81 },
    { name: 'Mickaël Landreau', country: 'France', pos: 'GK', spec: 'GK', ovr: 83, pac: 54, sho: 22, pas: 74, dri: 48, def: 85, phy: 77, com: 86 }
  ]),

  // 5. Porto 2003-04
  makeSquad('porto-2003-04', 'FC Porto', '2003-04', 'FC Porto 2003-04 (Mourinho UCL Champions)', 'Other', 'POR', '#002B7F', '#FFFFFF', 'Low-Block Counter', [
    { name: 'Derlei', country: 'Brazil', pos: 'FWD', spec: 'ST', ovr: 85, pac: 86, sho: 84, pas: 74, dri: 84, def: 44, phy: 80, com: 85 },
    { name: 'Carlos Alberto', country: 'Brazil', pos: 'FWD', spec: 'ST', ovr: 83, pac: 85, sho: 80, pas: 78, dri: 86, def: 42, phy: 76, com: 82 },
    { name: 'Deco', country: 'Portugal', pos: 'MID', spec: 'CAM', ovr: 91, pac: 80, sho: 85, pas: 93, dri: 92, def: 68, phy: 75, com: 94, aura: { id: 'deco-magician', name: 'O Mágico', description: '+35% key pass accuracy in European finals; UEFA Club Footballer of the Year.', shortDesc: '+35% European key passes', rarity: 'Legendary' } },
    { name: 'Maniche', country: 'Portugal', pos: 'MID', spec: 'CM', ovr: 85, pac: 78, sho: 85, pas: 84, dri: 80, def: 80, phy: 83, com: 86 },
    { name: 'Costinha', country: 'Portugal', pos: 'MID', spec: 'CDM', ovr: 85, pac: 70, sho: 68, pas: 80, dri: 75, def: 88, phy: 86, com: 88 },
    { name: 'Pedro Mendes', country: 'Portugal', pos: 'MID', spec: 'CM', ovr: 82, pac: 74, sho: 76, pas: 81, dri: 78, def: 78, phy: 78, com: 81 },
    { name: 'Nuno Valente', country: 'Portugal', pos: 'DEF', spec: 'LB', ovr: 83, pac: 80, sho: 58, pas: 75, dri: 76, def: 83, phy: 80, com: 82 },
    { name: 'Ricardo Carvalho', country: 'Portugal', pos: 'DEF', spec: 'CB', ovr: 89, pac: 80, sho: 45, pas: 76, dri: 72, def: 92, phy: 85, com: 93, aura: { id: 'carvalho-intellect', name: 'Master Anticipator', description: '+30% interception success; 2004 UEFA Best Defender.', shortDesc: '+30% interceptions', rarity: 'Legendary' } },
    { name: 'Jorge Costa', country: 'Portugal', pos: 'DEF', spec: 'CB', ovr: 85, pac: 66, sho: 42, pas: 65, dri: 58, def: 88, phy: 90, com: 89 },
    { name: 'Paulo Ferreira', country: 'Portugal', pos: 'DEF', spec: 'RB', ovr: 85, pac: 82, sho: 55, pas: 78, dri: 78, def: 86, phy: 82, com: 86 },
    { name: 'Vítor Baía', country: 'Portugal', pos: 'GK', spec: 'GK', ovr: 87, pac: 58, sho: 25, pas: 76, dri: 52, def: 89, phy: 81, com: 92 }
  ]),

  // 6. Benfica 2013-14
  makeSquad('benfica-2013-14', 'SL Benfica', '2013-14', 'SL Benfica 2013-14 (Domestic Treble & Finalists)', 'Other', 'POR', '#E20613', '#FFFFFF', 'Direct Vertical', [
    { name: 'Rodrigo', country: 'Spain', pos: 'FWD', spec: 'ST', ovr: 84, pac: 86, sho: 83, pas: 76, dri: 83, def: 42, phy: 76, com: 82 },
    { name: 'Lima', country: 'Brazil', pos: 'FWD', spec: 'ST', ovr: 83, pac: 81, sho: 85, pas: 71, dri: 79, def: 38, phy: 79, com: 83 },
    { name: 'Nicolás Gaitán', country: 'Argentina', pos: 'MID', spec: 'LW', ovr: 86, pac: 85, sho: 78, pas: 88, dri: 89, def: 45, phy: 68, com: 86 },
    { name: 'Enzo Pérez', country: 'Argentina', pos: 'MID', spec: 'CM', ovr: 85, pac: 79, sho: 76, pas: 84, dri: 83, def: 82, phy: 84, com: 85 },
    { name: 'Lazar Marković', country: 'Serbia', pos: 'MID', spec: 'RW', ovr: 82, pac: 91, sho: 74, pas: 76, dri: 85, def: 40, phy: 66, com: 79 },
    { name: 'Ljubomir Fejsa', country: 'Serbia', pos: 'MID', spec: 'CDM', ovr: 82, pac: 68, sho: 58, pas: 76, dri: 72, def: 85, phy: 84, com: 81 },
    { name: 'Guilherme Siqueira', country: 'Brazil', pos: 'DEF', spec: 'LB', ovr: 82, pac: 83, sho: 64, pas: 76, dri: 79, def: 80, phy: 78, com: 80 },
    { name: 'Ezequiel Garay', country: 'Argentina', pos: 'DEF', spec: 'CB', ovr: 86, pac: 72, sho: 58, pas: 72, dri: 66, def: 88, phy: 86, com: 87 },
    { name: 'Luisão', country: 'Brazil', pos: 'DEF', spec: 'CB', ovr: 85, pac: 58, sho: 48, pas: 68, dri: 58, def: 87, phy: 90, com: 88 },
    { name: 'Maxi Pereira', country: 'Uruguay', pos: 'DEF', spec: 'RB', ovr: 82, pac: 78, sho: 65, pas: 75, dri: 76, def: 82, phy: 84, com: 83 },
    { name: 'Jan Oblak', country: 'Slovenia', pos: 'GK', spec: 'GK', ovr: 86, pac: 52, sho: 20, pas: 72, dri: 45, def: 89, phy: 82, com: 89, aura: { id: 'oblak-rising', name: 'Breakthrough Wall', description: '+25% clean sheet bonus in high pressure matches.', shortDesc: '+25% clean sheet bonus', rarity: 'Epic' } }
  ]),

  // 7. Ajax 1994-95
  makeSquad('ajax-1994-95', 'AFC Ajax', '1994-95', 'AFC Ajax 1994-95 (Invincible UCL Winners)', 'Other', 'NED', '#FFFFFF', '#D2122E', 'Tiki-Taka', [
    { name: 'Patrick Kluivert', country: 'Netherlands', pos: 'FWD', spec: 'ST', ovr: 88, pac: 86, sho: 89, pas: 78, dri: 86, def: 40, phy: 84, com: 90, aura: { id: 'kluivert-toe-poke', name: 'Vienna Miracle Winner', description: '+35% conversion in UCL final minutes.', shortDesc: '+35% late final xG', rarity: 'Epic' } },
    { name: 'Marc Overmars', country: 'Netherlands', pos: 'FWD', spec: 'LW', ovr: 88, pac: 96, sho: 82, pas: 84, dri: 89, def: 42, phy: 72, com: 85 },
    { name: 'Finidi George', country: 'Nigeria', pos: 'FWD', spec: 'RW', ovr: 86, pac: 90, sho: 81, pas: 85, dri: 87, def: 45, phy: 76, com: 84 },
    { name: 'Jari Litmanen', country: 'Finland', pos: 'MID', spec: 'CAM', ovr: 90, pac: 80, sho: 90, pas: 91, dri: 88, def: 52, phy: 76, com: 93, aura: { id: 'litmanen-professor', name: 'The Flying Finn', description: '+30% shot accuracy in European knockouts; UCL top scorer.', shortDesc: '+30% UCL shot accuracy', rarity: 'Legendary' } },
    { name: 'Edgar Davids', country: 'Netherlands', pos: 'MID', spec: 'CDM', ovr: 89, pac: 86, sho: 78, pas: 83, dri: 88, def: 89, phy: 89, com: 88, aura: { id: 'davids-pitbull', name: 'The Pitbull', description: '+35% ground duel tackle success; aggressive ball recovery.', shortDesc: '+35% tackle recovery', rarity: 'Legendary' } },
    { name: 'Clarence Seedorf', country: 'Netherlands', pos: 'MID', spec: 'CM', ovr: 87, pac: 82, sho: 83, pas: 88, dri: 86, def: 78, phy: 84, com: 88 },
    { name: 'Frank Rijkaard', country: 'Netherlands', pos: 'DEF', spec: 'CB', ovr: 92, pac: 78, sho: 75, pas: 88, dri: 82, def: 94, phy: 91, com: 96, aura: { id: 'rijkaard-general', name: 'Total Football Master', description: '+20% passing composure for all backline teammates.', shortDesc: '+20% team backline passing', rarity: 'Legendary' } },
    { name: 'Danny Blind', country: 'Netherlands', pos: 'DEF', spec: 'CB', ovr: 87, pac: 72, sho: 65, pas: 84, dri: 74, def: 89, phy: 82, com: 92 },
    { name: 'Frank de Boer', country: 'Netherlands', pos: 'DEF', spec: 'LB', ovr: 88, pac: 74, sho: 78, pas: 89, dri: 77, def: 88, phy: 83, com: 90 },
    { name: 'Michael Reiziger', country: 'Netherlands', pos: 'DEF', spec: 'RB', ovr: 84, pac: 87, sho: 50, pas: 76, dri: 78, def: 84, phy: 82, com: 82 },
    { name: 'Edwin van der Sar', country: 'Netherlands', pos: 'GK', spec: 'GK', ovr: 90, pac: 58, sho: 25, pas: 85, dri: 56, def: 92, phy: 82, com: 94 }
  ]),

  // 8. PSV 2004-05
  makeSquad('psv-2004-05', 'PSV Eindhoven', '2004-05', 'PSV Eindhoven 2004-05 (UCL Semi-Final Miracle)', 'Other', 'NED', '#E20613', '#FFFFFF', 'Low-Block Counter', [
    { name: 'Jefferson Farfán', country: 'Peru', pos: 'FWD', spec: 'RW', ovr: 84, pac: 89, sho: 81, pas: 78, dri: 86, def: 44, phy: 78, com: 82 },
    { name: 'Jan Vennegoor of Hesselink', country: 'Netherlands', pos: 'FWD', spec: 'ST', ovr: 82, pac: 68, sho: 83, pas: 68, dri: 72, def: 38, phy: 89, com: 81 },
    { name: 'DaMarcus Beasley', country: 'USA', pos: 'MID', spec: 'LM', ovr: 82, pac: 92, sho: 74, pas: 76, dri: 84, def: 52, phy: 68, com: 79 },
    { name: 'Mark van Bommel', country: 'Netherlands', pos: 'MID', spec: 'CM', ovr: 86, pac: 72, sho: 80, pas: 85, dri: 78, def: 86, phy: 88, com: 88 },
    { name: 'Phillip Cocu', country: 'Netherlands', pos: 'MID', spec: 'CM', ovr: 87, pac: 74, sho: 82, pas: 88, dri: 82, def: 85, phy: 84, com: 90, aura: { id: 'cocu-brain', name: 'Tactical General', description: '+15% team possession stability in tense knockout ties.', shortDesc: '+15% team composure', rarity: 'Legendary' } },
    { name: 'Johann Vogel', country: 'Switzerland', pos: 'MID', spec: 'CDM', ovr: 82, pac: 70, sho: 62, pas: 82, dri: 75, def: 83, phy: 78, com: 83 },
    { name: 'Young-Pyo Lee', country: 'South Korea', pos: 'DEF', spec: 'LB', ovr: 83, pac: 86, sho: 62, pas: 78, dri: 82, def: 81, phy: 75, com: 83 },
    { name: 'Alex', country: 'Brazil', pos: 'DEF', spec: 'CB', ovr: 86, pac: 66, sho: 78, pas: 68, dri: 62, def: 88, phy: 93, com: 85, aura: { id: 'alex-cannon', name: 'The Tank', description: '+35% free kick shot power; impenetrable aerial wall.', shortDesc: '+35% free-kick power', rarity: 'Epic' } },
    { name: 'Wilfred Bouma', country: 'Netherlands', pos: 'DEF', spec: 'CB', ovr: 82, pac: 74, sho: 58, pas: 72, dri: 68, def: 82, phy: 85, com: 81 },
    { name: 'André Ooijer', country: 'Netherlands', pos: 'DEF', spec: 'RB', ovr: 82, pac: 76, sho: 58, pas: 75, dri: 72, def: 83, phy: 83, com: 82 },
    { name: 'Heurelho Gomes', country: 'Brazil', pos: 'GK', spec: 'GK', ovr: 85, pac: 56, sho: 22, pas: 72, dri: 50, def: 87, phy: 84, com: 86 }
  ]),

  // 9. Celtic 2002-03
  makeSquad('celtic-2002-03', 'Celtic FC', '2002-03', 'Celtic FC 2002-03 (Seville UEFA Cup Finalists)', 'Other', 'SCO', '#00853F', '#FFFFFF', 'Direct Vertical', [
    { name: 'Henrik Larsson', country: 'Sweden', pos: 'FWD', spec: 'ST', ovr: 90, pac: 88, sho: 92, pas: 81, dri: 88, def: 48, phy: 82, com: 93, aura: { id: 'larsson-king', name: 'King of Kings', description: '+35% conversion in European finals; scored twice in Seville 2003.', shortDesc: '+35% European final goals', rarity: 'Legendary' } },
    { name: 'Chris Sutton', country: 'England', pos: 'FWD', spec: 'ST', ovr: 85, pac: 76, sho: 86, pas: 78, dri: 78, def: 55, phy: 88, com: 85 },
    { name: 'Stiliyan Petrov', country: 'Bulgaria', pos: 'MID', spec: 'CM', ovr: 85, pac: 78, sho: 82, pas: 84, dri: 81, def: 79, phy: 84, com: 86 },
    { name: 'Neil Lennon', country: 'Northern Ireland', pos: 'MID', spec: 'CDM', ovr: 84, pac: 68, sho: 60, pas: 82, dri: 74, def: 87, phy: 86, com: 88 },
    { name: 'Paul Lambert', country: 'Scotland', pos: 'MID', spec: 'CM', ovr: 84, pac: 72, sho: 74, pas: 85, dri: 78, def: 82, phy: 80, com: 89 },
    { name: 'Alan Thompson', country: 'England', pos: 'MID', spec: 'LM', ovr: 83, pac: 75, sho: 84, pas: 84, dri: 78, def: 65, phy: 78, com: 83 },
    { name: 'Didier Agathe', country: 'France', pos: 'DEF', spec: 'RB', ovr: 83, pac: 93, sho: 65, pas: 75, dri: 82, def: 76, phy: 80, com: 79 },
    { name: 'Bobo Baldé', country: 'Guinea', pos: 'DEF', spec: 'CB', ovr: 84, pac: 65, sho: 38, pas: 60, dri: 54, def: 86, phy: 94, com: 82 },
    { name: 'Joos Valgaeren', country: 'Belgium', pos: 'DEF', spec: 'CB', ovr: 81, pac: 68, sho: 40, pas: 65, dri: 60, def: 82, phy: 84, com: 80 },
    { name: 'Jackie McNamara', country: 'Scotland', pos: 'DEF', spec: 'LB', ovr: 82, pac: 80, sho: 60, pas: 78, dri: 77, def: 81, phy: 78, com: 83 },
    { name: 'Robert Douglas', country: 'Scotland', pos: 'GK', spec: 'GK', ovr: 81, pac: 52, sho: 20, pas: 68, dri: 45, def: 82, phy: 84, com: 80 }
  ]),

  // 10. Galatasaray 1999-00
  makeSquad('galatasaray-1999-00', 'Galatasaray', '1999-00', 'Galatasaray 1999-00 (UEFA Cup Champions)', 'Other', 'TUR', '#A32638', '#FDB913', 'Direct Vertical', [
    { name: 'Hakan Şükür', country: 'Turkey', pos: 'FWD', spec: 'ST', ovr: 87, pac: 83, sho: 88, pas: 72, dri: 80, def: 42, phy: 88, com: 87, aura: { id: 'sukur-bull', name: 'Bull of the Bosphorus', description: '+30% aerial duel win rate and headed goals.', shortDesc: '+30% aerial duels', rarity: 'Epic' } },
    { name: 'Arif Erdem', country: 'Turkey', pos: 'FWD', spec: 'ST', ovr: 83, pac: 85, sho: 82, pas: 75, dri: 82, def: 38, phy: 75, com: 81 },
    { name: 'Gheorghe Hagi', country: 'Romania', pos: 'MID', spec: 'CAM', ovr: 91, pac: 77, sho: 92, pas: 94, dri: 91, def: 55, phy: 74, com: 93, aura: { id: 'hagi-commander', name: 'The Commander', description: '+40% long-range shot conversion from outside 25 yards.', shortDesc: '+40% long-range xG', rarity: 'Legendary' } },
    { name: 'Okan Buruk', country: 'Turkey', pos: 'MID', spec: 'RM', ovr: 83, pac: 84, sho: 76, pas: 80, dri: 82, def: 68, phy: 74, com: 82 },
    { name: 'Emre Belözoğlu', country: 'Turkey', pos: 'MID', spec: 'CM', ovr: 84, pac: 80, sho: 78, pas: 85, dri: 86, def: 72, phy: 75, com: 83 },
    { name: 'Suat Kaya', country: 'Turkey', pos: 'MID', spec: 'CDM', ovr: 82, pac: 72, sho: 64, pas: 78, dri: 74, def: 84, phy: 81, com: 82 },
    { name: 'Ergün Penbe', country: 'Turkey', pos: 'DEF', spec: 'LB', ovr: 82, pac: 80, sho: 62, pas: 80, dri: 77, def: 81, phy: 76, com: 84 },
    { name: 'Gheorghe Popescu', country: 'Romania', pos: 'DEF', spec: 'CB', ovr: 87, pac: 72, sho: 68, pas: 82, dri: 74, def: 89, phy: 86, com: 92, aura: { id: 'popescu-penalty', name: 'Copenhagen Decider', description: '+30% penalty shootout accuracy under extreme pressure.', shortDesc: '+30% penalty composure', rarity: 'Epic' } },
    { name: 'Bülent Korkmaz', country: 'Turkey', pos: 'DEF', spec: 'CB', ovr: 85, pac: 68, sho: 40, pas: 68, dri: 60, def: 88, phy: 88, com: 90 },
    { name: 'Capone', country: 'Brazil', pos: 'DEF', spec: 'RB', ovr: 81, pac: 81, sho: 58, pas: 73, dri: 74, def: 80, phy: 81, com: 79 },
    { name: 'Cláudio Taffarel', country: 'Brazil', pos: 'GK', spec: 'GK', ovr: 88, pac: 60, sho: 24, pas: 75, dri: 54, def: 90, phy: 80, com: 93, aura: { id: 'taffarel-wall', name: 'World Cup Winner GK', description: '+35% saves in penalty shootouts.', shortDesc: '+35% penalty saves', rarity: 'Legendary' } }
  ]),

  // 11. Shakhtar Donetsk 2008-09
  makeSquad('shakhtar-2008-09', 'Shakhtar Donetsk', '2008-09', 'Shakhtar Donetsk 2008-09 (UEFA Cup Winners)', 'Other', 'UKR', '#F36C21', '#000000', 'Tiki-Taka', [
    { name: 'Luiz Adriano', country: 'Brazil', pos: 'FWD', spec: 'ST', ovr: 84, pac: 85, sho: 83, pas: 72, dri: 82, def: 38, phy: 81, com: 81 },
    { name: 'Willian', country: 'Brazil', pos: 'FWD', spec: 'LW', ovr: 86, pac: 89, sho: 79, pas: 84, dri: 88, def: 45, phy: 70, com: 84 },
    { name: 'Ilsinho', country: 'Brazil', pos: 'FWD', spec: 'RW', ovr: 83, pac: 85, sho: 78, pas: 79, dri: 87, def: 52, phy: 73, com: 82 },
    { name: 'Jádson', country: 'Brazil', pos: 'MID', spec: 'CAM', ovr: 86, pac: 78, sho: 84, pas: 88, dri: 86, def: 50, phy: 68, com: 87, aura: { id: 'jadson-final', name: 'Istanbul Matchwinner', description: '+30% conversion on extra-time decisive shots.', shortDesc: '+30% extra-time winner xG', rarity: 'Epic' } },
    { name: 'Fernandinho', country: 'Brazil', pos: 'MID', spec: 'CM', ovr: 87, pac: 80, sho: 82, pas: 87, dri: 84, def: 85, phy: 83, com: 88 },
    { name: 'Mariusz Lewandowski', country: 'Poland', pos: 'MID', spec: 'CDM', ovr: 82, pac: 66, sho: 66, pas: 76, dri: 70, def: 84, phy: 87, com: 82 },
    { name: 'Răzvan Raț', country: 'Romania', pos: 'DEF', spec: 'LB', ovr: 82, pac: 82, sho: 60, pas: 78, dri: 77, def: 81, phy: 78, com: 81 },
    { name: 'Dmytro Chygrynskyi', country: 'Ukraine', pos: 'DEF', spec: 'CB', ovr: 84, pac: 68, sho: 52, pas: 80, dri: 68, def: 86, phy: 86, com: 84 },
    { name: 'Oleksandr Kucher', country: 'Ukraine', pos: 'DEF', spec: 'CB', ovr: 82, pac: 68, sho: 38, pas: 68, dri: 62, def: 83, phy: 85, com: 80 },
    { name: 'Darijo Srna', country: 'Croatia', pos: 'DEF', spec: 'RB', ovr: 88, pac: 84, sho: 78, pas: 90, dri: 82, def: 84, phy: 82, com: 90, aura: { id: 'srna-cross', name: 'The Crossing Wizard', description: '+40% assist probability from set-piece deliveries and crosses.', shortDesc: '+40% crossing assists', rarity: 'Legendary' } },
    { name: 'Andriy Pyatov', country: 'Ukraine', pos: 'GK', spec: 'GK', ovr: 83, pac: 52, sho: 20, pas: 70, dri: 48, def: 85, phy: 78, com: 84 }
  ]),

  // 12. Dynamo Kyiv 1998-99
  makeSquad('dynamo-kyiv-1998-99', 'Dynamo Kyiv', '1998-99', 'Dynamo Kyiv 1998-99 (Lobanovskyi UCL Semis)', 'Other', 'UKR', '#0047AB', '#FFFFFF', 'Gegenpress', [
    { name: 'Andriy Shevchenko', country: 'Ukraine', pos: 'FWD', spec: 'ST', ovr: 92, pac: 92, sho: 93, pas: 79, dri: 89, def: 42, phy: 84, com: 94, aura: { id: 'sheva-dynamo', name: 'Sheva Dynamite', description: '+35% finishing vs European giants; crushed Real Madrid in 1999.', shortDesc: '+35% giant-killing goals', rarity: 'Legendary' } },
    { name: 'Serhiy Rebrov', country: 'Ukraine', pos: 'FWD', spec: 'ST', ovr: 87, pac: 86, sho: 88, pas: 80, dri: 85, def: 44, phy: 78, com: 88 },
    { name: 'Vitaliy Kosovskyi', country: 'Ukraine', pos: 'MID', spec: 'LM', ovr: 83, pac: 87, sho: 78, pas: 82, dri: 83, def: 52, phy: 74, com: 81 },
    { name: 'Aliaksandr Khatskevich', country: 'Belarus', pos: 'MID', spec: 'CM', ovr: 83, pac: 76, sho: 76, pas: 83, dri: 79, def: 78, phy: 82, com: 83 },
    { name: 'Andriy Husin', country: 'Ukraine', pos: 'MID', spec: 'CDM', ovr: 85, pac: 78, sho: 74, pas: 81, dri: 77, def: 86, phy: 88, com: 86 },
    { name: 'Valiantsin Bialkevich', country: 'Belarus', pos: 'MID', spec: 'CAM', ovr: 85, pac: 78, sho: 80, pas: 89, dri: 87, def: 48, phy: 72, com: 86 },
    { name: 'Yuriy Dmytrulin', country: 'Ukraine', pos: 'DEF', spec: 'LB', ovr: 82, pac: 80, sho: 54, pas: 75, dri: 74, def: 82, phy: 81, com: 82 },
    { name: 'Oleksandr Holovko', country: 'Ukraine', pos: 'DEF', spec: 'CB', ovr: 85, pac: 72, sho: 45, pas: 70, dri: 64, def: 88, phy: 86, com: 87 },
    { name: 'Vladyslav Vashchuk', country: 'Ukraine', pos: 'DEF', spec: 'CB', ovr: 84, pac: 74, sho: 50, pas: 76, dri: 68, def: 86, phy: 83, com: 85 },
    { name: 'Oleh Luzhnyi', country: 'Ukraine', pos: 'DEF', spec: 'RB', ovr: 84, pac: 83, sho: 58, pas: 77, dri: 76, def: 85, phy: 87, com: 86, aura: { id: 'luzhnyi-horse', name: 'The Horse', description: '+25% defensive work rate and stamina across full 90 minutes.', shortDesc: '+25% defensive stamina', rarity: 'Epic' } },
    { name: 'Oleksandr Shovkovskyi', country: 'Ukraine', pos: 'GK', spec: 'GK', ovr: 86, pac: 54, sho: 22, pas: 72, dri: 48, def: 88, phy: 80, com: 89 }
  ]),

  // 13. Tottenham 2018-19
  makeSquad('tottenham-2018-19', 'Tottenham Hotspur', '2018-19', 'Tottenham Hotspur 2018-19 (UCL Finalists)', 'Premier League', 'ENG', '#132257', '#FFFFFF', 'Gegenpress', [
    { name: 'Harry Kane', country: 'England', pos: 'FWD', spec: 'ST', ovr: 90, pac: 74, sho: 93, pas: 85, dri: 83, def: 48, phy: 84, com: 93 },
    { name: 'Son Heung-min', country: 'South Korea', pos: 'FWD', spec: 'LW', ovr: 89, pac: 91, sho: 89, pas: 82, dri: 88, def: 44, phy: 76, com: 88, aura: { id: 'sonny-both-feet', name: 'Two-Footed Lethality', description: '+30% conversion on either foot from edge of box.', shortDesc: '+30% two-footed finishing', rarity: 'Legendary' } },
    { name: 'Lucas Moura', country: 'Brazil', pos: 'FWD', spec: 'RW', ovr: 84, pac: 93, sho: 80, pas: 76, dri: 88, def: 45, phy: 68, com: 84, aura: { id: 'lucas-amsterdam', name: 'Amsterdam Hat-Trick Hero', description: '+40% acceleration and clinical finishing in 95th minute.', shortDesc: '+40% clutch 95th min xG', rarity: 'Epic' } },
    { name: 'Christian Eriksen', country: 'Denmark', pos: 'MID', spec: 'CAM', ovr: 88, pac: 74, sho: 84, pas: 92, dri: 86, def: 54, phy: 66, com: 90 },
    { name: 'Dele Alli', country: 'England', pos: 'MID', spec: 'CAM', ovr: 85, pac: 76, sho: 82, pas: 81, dri: 84, def: 64, phy: 78, com: 84 },
    { name: 'Moussa Sissoko', country: 'France', pos: 'MID', spec: 'CM', ovr: 83, pac: 82, sho: 68, pas: 77, dri: 79, def: 81, phy: 89, com: 80 },
    { name: 'Danny Rose', country: 'England', pos: 'DEF', spec: 'LB', ovr: 82, pac: 84, sho: 60, pas: 75, dri: 78, def: 81, phy: 80, com: 80 },
    { name: 'Jan Vertonghen', country: 'Belgium', pos: 'DEF', spec: 'CB', ovr: 87, pac: 68, sho: 62, pas: 79, dri: 72, def: 89, phy: 83, com: 88 },
    { name: 'Toby Alderweireld', country: 'Belgium', pos: 'DEF', spec: 'CB', ovr: 88, pac: 66, sho: 58, pas: 83, dri: 68, def: 90, phy: 82, com: 89 },
    { name: 'Kieran Trippier', country: 'England', pos: 'DEF', spec: 'RB', ovr: 83, pac: 78, sho: 68, pas: 84, dri: 78, def: 80, phy: 74, com: 82 },
    { name: 'Hugo Lloris', country: 'France', pos: 'GK', spec: 'GK', ovr: 88, pac: 64, sho: 22, pas: 74, dri: 55, def: 90, phy: 78, com: 88 }
  ]),

  // 14. Newcastle 1995-96
  makeSquad('newcastle-1995-96', 'Newcastle United', '1995-96', 'Newcastle United 1995-96 (The Entertainers)', 'Premier League', 'ENG', '#000000', '#FFFFFF', 'Direct Vertical', [
    { name: 'Les Ferdinand', country: 'England', pos: 'FWD', spec: 'ST', ovr: 88, pac: 86, sho: 90, pas: 72, dri: 82, def: 38, phy: 89, com: 88, aura: { id: 'sir-les-power', name: 'Sir Les Aerial Power', description: '+35% headed goal conversion rate.', shortDesc: '+35% header goals', rarity: 'Epic' } },
    { name: 'Peter Beardsley', country: 'England', pos: 'FWD', spec: 'ST', ovr: 87, pac: 78, sho: 85, pas: 89, dri: 89, def: 48, phy: 72, com: 91 },
    { name: 'David Ginola', country: 'France', pos: 'MID', spec: 'LW', ovr: 88, pac: 86, sho: 84, pas: 87, dri: 92, def: 42, phy: 80, com: 89, aura: { id: 'ginola-flair', name: 'Flamboyant Maestro', description: '+35% take-on success rate down the flank.', shortDesc: '+35% wing take-ons', rarity: 'Legendary' } },
    { name: 'Rob Lee', country: 'England', pos: 'MID', spec: 'CM', ovr: 85, pac: 80, sho: 82, pas: 84, dri: 81, def: 75, phy: 82, com: 85 },
    { name: 'Keith Gillespie', country: 'Northern Ireland', pos: 'MID', spec: 'RW', ovr: 82, pac: 91, sho: 74, pas: 80, dri: 84, def: 45, phy: 70, com: 79 },
    { name: 'David Batty', country: 'England', pos: 'MID', spec: 'CDM', ovr: 85, pac: 72, sho: 60, pas: 81, dri: 74, def: 88, phy: 87, com: 87 },
    { name: 'John Beresford', country: 'England', pos: 'DEF', spec: 'LB', ovr: 82, pac: 85, sho: 62, pas: 76, dri: 78, def: 79, phy: 76, com: 80 },
    { name: 'Philippe Albert', country: 'Belgium', pos: 'DEF', spec: 'CB', ovr: 85, pac: 72, sho: 74, pas: 78, dri: 76, def: 85, phy: 86, com: 87, aura: { id: 'albert-chip', name: 'The Albert Chip', description: '+30% conversion on adventurous centre-back long chips.', shortDesc: '+30% CB chip goals', rarity: 'Epic' } },
    { name: 'Steve Howey', country: 'England', pos: 'DEF', spec: 'CB', ovr: 82, pac: 70, sho: 40, pas: 68, dri: 62, def: 83, phy: 84, com: 81 },
    { name: 'Warren Barton', country: 'England', pos: 'DEF', spec: 'RB', ovr: 81, pac: 80, sho: 54, pas: 74, dri: 74, def: 80, phy: 79, com: 79 },
    { name: 'Pavel Srníček', country: 'Czech Republic', pos: 'GK', spec: 'GK', ovr: 83, pac: 58, sho: 20, pas: 70, dri: 50, def: 85, phy: 80, com: 84 }
  ]),

  // 15. Blackburn 1994-95
  makeSquad('blackburn-1994-95', 'Blackburn Rovers', '1994-95', 'Blackburn Rovers 1994-95 (Premier League Champions)', 'Premier League', 'ENG', '#002B7F', '#FFFFFF', 'Direct Vertical', [
    { name: 'Alan Shearer', country: 'England', pos: 'FWD', spec: 'ST', ovr: 92, pac: 84, sho: 96, pas: 78, dri: 82, def: 42, phy: 90, com: 95, aura: { id: 'shearer-34-goals', name: 'SAS Record Breaker', description: '+35% shot power; scored 34 league goals in 94-95.', shortDesc: '+35% shot power & xG', rarity: 'Legendary' } },
    { name: 'Chris Sutton', country: 'England', pos: 'FWD', spec: 'ST', ovr: 86, pac: 80, sho: 87, pas: 76, dri: 80, def: 48, phy: 86, com: 86 },
    { name: 'Stuart Ripley', country: 'England', pos: 'MID', spec: 'RM', ovr: 83, pac: 87, sho: 75, pas: 83, dri: 82, def: 48, phy: 74, com: 80 },
    { name: 'Jason Wilcox', country: 'England', pos: 'MID', spec: 'LM', ovr: 83, pac: 85, sho: 76, pas: 83, dri: 82, def: 52, phy: 75, com: 81 },
    { name: 'Tim Sherwood', country: 'England', pos: 'MID', spec: 'CM', ovr: 85, pac: 74, sho: 78, pas: 84, dri: 79, def: 82, phy: 83, com: 88 },
    { name: 'Mark Atkins', country: 'England', pos: 'MID', spec: 'CM', ovr: 81, pac: 72, sho: 74, pas: 78, dri: 74, def: 78, phy: 80, com: 80 },
    { name: 'Graeme Le Saux', country: 'England', pos: 'DEF', spec: 'LB', ovr: 86, pac: 85, sho: 68, pas: 82, dri: 82, def: 85, phy: 82, com: 86 },
    { name: 'Colin Hendry', country: 'Scotland', pos: 'DEF', spec: 'CB', ovr: 87, pac: 68, sho: 45, pas: 68, dri: 60, def: 90, phy: 92, com: 89, aura: { id: 'hendry-braveheart', name: 'Braveheart', description: '+30% last-ditch blocks in the penalty area.', shortDesc: '+30% penalty box blocks', rarity: 'Epic' } },
    { name: 'Ian Pearce', country: 'England', pos: 'DEF', spec: 'CB', ovr: 82, pac: 72, sho: 44, pas: 66, dri: 62, def: 83, phy: 84, com: 81 },
    { name: 'Henning Berg', country: 'Norway', pos: 'DEF', spec: 'RB', ovr: 83, pac: 78, sho: 50, pas: 74, dri: 72, def: 84, phy: 82, com: 84 },
    { name: 'Tim Flowers', country: 'England', pos: 'GK', spec: 'GK', ovr: 86, pac: 56, sho: 24, pas: 72, dri: 48, def: 88, phy: 82, com: 89 }
  ]),

  // 16. Leeds 2000-01
  makeSquad('leeds-2000-01', 'Leeds United', '2000-01', 'Leeds United 2000-01 (O\'Leary UCL Semis)', 'Premier League', 'ENG', '#FFFFFF', '#002B7F', 'Gegenpress', [
    { name: 'Mark Viduka', country: 'Australia', pos: 'FWD', spec: 'ST', ovr: 87, pac: 76, sho: 90, pas: 78, dri: 86, def: 38, phy: 91, com: 89, aura: { id: 'viduka-strength', name: 'The Big Aussie', description: '+35% back-to-goal hold-up duel win rate.', shortDesc: '+35% hold-up play', rarity: 'Epic' } },
    { name: 'Alan Smith', country: 'England', pos: 'FWD', spec: 'ST', ovr: 84, pac: 84, sho: 84, pas: 74, dri: 81, def: 58, phy: 86, com: 82 },
    { name: 'Harry Kewell', country: 'Australia', pos: 'MID', spec: 'LM', ovr: 87, pac: 88, sho: 85, pas: 85, dri: 89, def: 48, phy: 76, com: 87 },
    { name: 'Lee Bowyer', country: 'England', pos: 'MID', spec: 'CM', ovr: 86, pac: 82, sho: 84, pas: 82, dri: 82, def: 78, phy: 84, com: 84 },
    { name: 'Olivier Dacourt', country: 'France', pos: 'MID', spec: 'CDM', ovr: 85, pac: 72, sho: 72, pas: 84, dri: 79, def: 86, phy: 86, com: 86 },
    { name: 'David Batty', country: 'England', pos: 'MID', spec: 'CDM', ovr: 84, pac: 70, sho: 58, pas: 80, dri: 72, def: 87, phy: 86, com: 86 },
    { name: 'Ian Harte', country: 'Ireland', pos: 'DEF', spec: 'LB', ovr: 84, pac: 72, sho: 84, pas: 82, dri: 74, def: 80, phy: 78, com: 85, aura: { id: 'harte-freekick', name: 'Dead-Ball Specialist', description: '+35% direct free kick and long penalty conversion.', shortDesc: '+35% direct free-kicks', rarity: 'Epic' } },
    { name: 'Rio Ferdinand', country: 'England', pos: 'DEF', spec: 'CB', ovr: 88, pac: 82, sho: 45, pas: 80, dri: 78, def: 90, phy: 86, com: 91 },
    { name: 'Dominic Matteo', country: 'Scotland', pos: 'DEF', spec: 'CB', ovr: 82, pac: 72, sho: 48, pas: 72, dri: 66, def: 83, phy: 83, com: 82 },
    { name: 'Danny Mills', country: 'England', pos: 'DEF', spec: 'RB', ovr: 82, pac: 83, sho: 52, pas: 74, dri: 74, def: 82, phy: 84, com: 80 },
    { name: 'Nigel Martyn', country: 'England', pos: 'GK', spec: 'GK', ovr: 87, pac: 54, sho: 22, pas: 74, dri: 48, def: 89, phy: 82, com: 90 }
  ]),

  // 17. West Ham 2015-16
  makeSquad('west-ham-2015-16', 'West Ham United', '2015-16', 'West Ham United 2015-16 (Payet Boleyn Farewell)', 'Premier League', 'ENG', '#7A263A', '#1BB1E7', 'Direct Vertical', [
    { name: 'Michail Antonio', country: 'Jamaica', pos: 'FWD', spec: 'ST', ovr: 83, pac: 87, sho: 80, pas: 72, dri: 81, def: 55, phy: 88, com: 80 },
    { name: 'Dimitri Payet', country: 'France', pos: 'MID', spec: 'CAM', ovr: 89, pac: 80, sho: 87, pas: 93, dri: 91, def: 42, phy: 72, com: 92, aura: { id: 'payet-sway', name: 'Boleyn Ground Magician', description: '+45% free kick curl and outside-box wonder strike rate.', shortDesc: '+45% free kick & curl xG', rarity: 'Legendary' } },
    { name: 'Manuel Lanzini', country: 'Argentina', pos: 'MID', spec: 'CAM', ovr: 82, pac: 82, sho: 78, pas: 83, dri: 85, def: 48, phy: 62, com: 82 },
    { name: 'Mark Noble', country: 'England', pos: 'MID', spec: 'CM', ovr: 82, pac: 68, sho: 74, pas: 83, dri: 76, def: 80, phy: 78, com: 92, aura: { id: 'noble-penalties', name: 'Mr. West Ham Penalty', description: '+40% penalty conversion reliability; flawless spot-kicker.', shortDesc: '+40% penalty accuracy', rarity: 'Epic' } },
    { name: 'Cheikhou Kouyaté', country: 'Senegal', pos: 'MID', spec: 'CDM', ovr: 82, pac: 78, sho: 68, pas: 76, dri: 75, def: 83, phy: 88, com: 80 },
    { name: 'Pedro Obiang', country: 'Equatorial Guinea', pos: 'MID', spec: 'CM', ovr: 79, pac: 72, sho: 68, pas: 78, dri: 76, def: 79, phy: 81, com: 79 },
    { name: 'Aaron Cresswell', country: 'England', pos: 'DEF', spec: 'LB', ovr: 81, pac: 80, sho: 66, pas: 80, dri: 76, def: 79, phy: 74, com: 80 },
    { name: 'Angelo Ogbonna', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 82, pac: 74, sho: 38, pas: 66, dri: 62, def: 83, phy: 85, com: 81 },
    { name: 'Winston Reid', country: 'New Zealand', pos: 'DEF', spec: 'CB', ovr: 83, pac: 72, sho: 45, pas: 68, dri: 62, def: 84, phy: 85, com: 83 },
    { name: 'Michail Antonio (RB)', country: 'England', pos: 'DEF', spec: 'RB', ovr: 80, pac: 86, sho: 74, pas: 74, dri: 78, def: 77, phy: 84, com: 78 },
    { name: 'Adrián', country: 'Spain', pos: 'GK', spec: 'GK', ovr: 82, pac: 54, sho: 20, pas: 70, dri: 48, def: 84, phy: 77, com: 82 }
  ]),

  // 18. Everton 2004-05
  makeSquad('everton-2004-05', 'Everton', '2004-05', 'Everton 2004-05 (Moyes 4th Place Miracle)', 'Premier League', 'ENG', '#003399', '#FFFFFF', 'Low-Block Counter', [
    { name: 'Marcus Bent', country: 'England', pos: 'FWD', spec: 'ST', ovr: 80, pac: 83, sho: 78, pas: 68, dri: 76, def: 42, phy: 83, com: 78 },
    { name: 'Tim Cahill', country: 'Australia', pos: 'MID', spec: 'CAM', ovr: 86, pac: 78, sho: 84, pas: 78, dri: 79, def: 68, phy: 86, com: 88, aura: { id: 'cahill-corner-flag', name: 'Boxing the Corner Flag', description: '+40% header accuracy in crowded penalty boxes.', shortDesc: '+40% headed goals', rarity: 'Legendary' } },
    { name: 'Mikel Arteta', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 84, pac: 74, sho: 78, pas: 87, dri: 84, def: 72, phy: 70, com: 88 },
    { name: 'Thomas Gravesen', country: 'Denmark', pos: 'MID', spec: 'CDM', ovr: 84, pac: 74, sho: 74, pas: 82, dri: 78, def: 85, phy: 88, com: 84, aura: { id: 'gravesen-mad-dog', name: 'The Mad Dog', description: '+30% ball recovery tackle aggression.', shortDesc: '+30% tackling aggression', rarity: 'Epic' } },
    { name: 'Lee Carsley', country: 'Ireland', pos: 'MID', spec: 'CDM', ovr: 82, pac: 68, sho: 72, pas: 78, dri: 72, def: 84, phy: 85, com: 83 },
    { name: 'Kevin Kilbane', country: 'Ireland', pos: 'MID', spec: 'LM', ovr: 80, pac: 76, sho: 72, pas: 76, dri: 76, def: 68, phy: 80, com: 79 },
    { name: 'Alessandro Pistone', country: 'Italy', pos: 'DEF', spec: 'LB', ovr: 80, pac: 78, sho: 54, pas: 74, dri: 74, def: 81, phy: 78, com: 80 },
    { name: 'David Weir', country: 'Scotland', pos: 'DEF', spec: 'CB', ovr: 82, pac: 60, sho: 40, pas: 68, dri: 58, def: 85, phy: 83, com: 86 },
    { name: 'Alan Stubbs', country: 'England', pos: 'DEF', spec: 'CB', ovr: 82, pac: 62, sho: 55, pas: 70, dri: 60, def: 84, phy: 85, com: 85 },
    { name: 'Tony Hibbert', country: 'England', pos: 'DEF', spec: 'RB', ovr: 80, pac: 76, sho: 30, pas: 70, dri: 68, def: 83, phy: 81, com: 82 },
    { name: 'Nigel Martyn', country: 'England', pos: 'GK', spec: 'GK', ovr: 86, pac: 52, sho: 20, pas: 72, dri: 45, def: 88, phy: 80, com: 89 }
  ]),

  // 19. Fulham 2009-10
  makeSquad('fulham-2009-10', 'Fulham FC', '2009-10', 'Fulham FC 2009-10 (Europa League Finalists)', 'Premier League', 'ENG', '#FFFFFF', '#000000', 'Low-Block Counter', [
    { name: 'Bobby Zamora', country: 'England', pos: 'FWD', spec: 'ST', ovr: 84, pac: 76, sho: 84, pas: 76, dri: 79, def: 42, phy: 88, com: 84 },
    { name: 'Clint Dempsey', country: 'USA', pos: 'FWD', spec: 'LW', ovr: 85, pac: 79, sho: 85, pas: 79, dri: 83, def: 58, phy: 82, com: 87, aura: { id: 'dempsey-chip', name: 'Juventus Chip Wonder', description: '+35% chip shot and clutch goal execution.', shortDesc: '+35% chip shot xG', rarity: 'Epic' } },
    { name: 'Damien Duff', country: 'Ireland', pos: 'MID', spec: 'RW', ovr: 83, pac: 84, sho: 78, pas: 82, dri: 85, def: 55, phy: 72, com: 83 },
    { name: 'Danny Murphy', country: 'England', pos: 'MID', spec: 'CM', ovr: 84, pac: 68, sho: 80, pas: 87, dri: 80, def: 75, phy: 74, com: 90, aura: { id: 'murphy-calm', name: 'Captain Cool', description: '+30% penalty and set piece accuracy.', shortDesc: '+30% set-piece accuracy', rarity: 'Epic' } },
    { name: 'Dickson Etuhu', country: 'Nigeria', pos: 'MID', spec: 'CDM', ovr: 81, pac: 72, sho: 64, pas: 75, dri: 72, def: 82, phy: 88, com: 79 },
    { name: 'Zoltán Gera', country: 'Hungary', pos: 'MID', spec: 'CAM', ovr: 83, pac: 78, sho: 82, pas: 80, dri: 82, def: 58, phy: 74, com: 84 },
    { name: 'Paul Konchesky', country: 'England', pos: 'DEF', spec: 'LB', ovr: 81, pac: 79, sho: 65, pas: 75, dri: 74, def: 80, phy: 80, com: 80 },
    { name: 'Brede Hangeland', country: 'Norway', pos: 'DEF', spec: 'CB', ovr: 86, pac: 60, sho: 48, pas: 72, dri: 60, def: 88, phy: 91, com: 88, aura: { id: 'hangeland-colossus', name: 'Cottage Colossus', description: '+35% aerial duel dominance and defensive headers.', shortDesc: '+35% aerial duel win', rarity: 'Epic' } },
    { name: 'Aaron Hughes', country: 'Northern Ireland', pos: 'DEF', spec: 'CB', ovr: 82, pac: 72, sho: 38, pas: 70, dri: 64, def: 84, phy: 79, com: 84 },
    { name: 'John Paintsil', country: 'Ghana', pos: 'DEF', spec: 'RB', ovr: 80, pac: 81, sho: 50, pas: 72, dri: 74, def: 79, phy: 78, com: 78 },
    { name: 'Mark Schwarzer', country: 'Australia', pos: 'GK', spec: 'GK', ovr: 86, pac: 50, sho: 20, pas: 74, dri: 46, def: 88, phy: 83, com: 89 }
  ]),

  // 20. Middlesbrough 2005-06
  makeSquad('middlesbrough-2005-06', 'Middlesbrough', '2005-06', 'Middlesbrough 2005-06 (UEFA Cup Comeback Kings)', 'Premier League', 'ENG', '#E20613', '#FFFFFF', 'Direct Vertical', [
    { name: 'Mark Viduka', country: 'Australia', pos: 'FWD', spec: 'ST', ovr: 86, pac: 75, sho: 89, pas: 78, dri: 84, def: 38, phy: 90, com: 88 },
    { name: 'Jimmy Floyd Hasselbaink', country: 'Netherlands', pos: 'FWD', spec: 'ST', ovr: 86, pac: 78, sho: 92, pas: 75, dri: 80, def: 40, phy: 86, com: 88, aura: { id: 'jfh-thunder', name: 'Thunderstrike', description: '+35% shot power on strikes from edge of box.', shortDesc: '+35% shot power', rarity: 'Epic' } },
    { name: 'Stewart Downing', country: 'England', pos: 'MID', spec: 'LM', ovr: 84, pac: 84, sho: 78, pas: 86, dri: 84, def: 52, phy: 72, com: 82 },
    { name: 'Fábio Rochemback', country: 'Brazil', pos: 'MID', spec: 'CM', ovr: 82, pac: 72, sho: 82, pas: 82, dri: 78, def: 76, phy: 84, com: 80 },
    { name: 'George Boateng', country: 'Netherlands', pos: 'MID', spec: 'CDM', ovr: 83, pac: 74, sho: 64, pas: 78, dri: 74, def: 85, phy: 87, com: 83 },
    { name: 'Gaizka Mendieta', country: 'Spain', pos: 'MID', spec: 'RM', ovr: 83, pac: 70, sho: 80, pas: 87, dri: 82, def: 64, phy: 70, com: 88 },
    { name: 'Franck Queudrue', country: 'France', pos: 'DEF', spec: 'LB', ovr: 81, pac: 78, sho: 64, pas: 75, dri: 74, def: 81, phy: 83, com: 79 },
    { name: 'Gareth Southgate', country: 'England', pos: 'DEF', spec: 'CB', ovr: 84, pac: 66, sho: 40, pas: 74, dri: 62, def: 86, phy: 82, com: 89, aura: { id: 'southgate-captain', name: 'Riverside Skipper', description: '+20% team defensive composure when trailing.', shortDesc: '+20% comeback composure', rarity: 'Epic' } },
    { name: 'Chris Riggott', country: 'England', pos: 'DEF', spec: 'CB', ovr: 81, pac: 68, sho: 48, pas: 65, dri: 58, def: 82, phy: 84, com: 80 },
    { name: 'Stuart Parnaby', country: 'England', pos: 'DEF', spec: 'RB', ovr: 79, pac: 78, sho: 48, pas: 71, dri: 72, def: 79, phy: 77, com: 78 },
    { name: 'Mark Schwarzer', country: 'Australia', pos: 'GK', spec: 'GK', ovr: 85, pac: 50, sho: 20, pas: 72, dri: 46, def: 87, phy: 82, com: 88 }
  ]),

  // 21. Portsmouth 2007-08
  makeSquad('portsmouth-2007-08', 'Portsmouth', '2007-08', 'Portsmouth 2007-08 (Redknapp FA Cup Winners)', 'Premier League', 'ENG', '#002B7F', '#FFFFFF', 'Direct Vertical', [
    { name: 'Nwankwo Kanu', country: 'Nigeria', pos: 'FWD', spec: 'ST', ovr: 85, pac: 74, sho: 84, pas: 84, dri: 89, def: 42, phy: 82, com: 92, aura: { id: 'kanu-magic', name: 'Kanu Wembley Touch', description: '+35% close-control finishing in cup semifinals & finals.', shortDesc: '+35% cup winner xG', rarity: 'Legendary' } },
    { name: 'Jermain Defoe', country: 'England', pos: 'FWD', spec: 'ST', ovr: 85, pac: 88, sho: 88, pas: 72, dri: 84, def: 35, phy: 72, com: 86 },
    { name: 'Niko Kranjčar', country: 'Croatia', pos: 'MID', spec: 'LM', ovr: 84, pac: 76, sho: 84, pas: 87, dri: 86, def: 52, phy: 75, com: 86 },
    { name: 'Sulley Muntari', country: 'Ghana', pos: 'MID', spec: 'CM', ovr: 85, pac: 78, sho: 84, pas: 82, dri: 81, def: 81, phy: 86, com: 84 },
    { name: 'Lassana Diarra', country: 'France', pos: 'MID', spec: 'CDM', ovr: 86, pac: 82, sho: 64, pas: 83, dri: 85, def: 88, phy: 84, com: 87 },
    { name: 'Papa Bouba Diop', country: 'Senegal', pos: 'MID', spec: 'CDM', ovr: 83, pac: 68, sho: 72, pas: 76, dri: 74, def: 84, phy: 92, com: 82 },
    { name: 'Hermann Hreiðarsson', country: 'Iceland', pos: 'DEF', spec: 'LB', ovr: 81, pac: 76, sho: 58, pas: 72, dri: 70, def: 82, phy: 88, com: 81 },
    { name: 'Sol Campbell', country: 'England', pos: 'DEF', spec: 'CB', ovr: 86, pac: 72, sho: 45, pas: 68, dri: 60, def: 89, phy: 92, com: 89, aura: { id: 'sol-rock', name: 'Rock of Fratton', description: '+30% physical aerial duel win rate in the 6-yard box.', shortDesc: '+30% 6-yard box duels', rarity: 'Epic' } },
    { name: 'Sylvain Distin', country: 'France', pos: 'DEF', spec: 'CB', ovr: 84, pac: 80, sho: 45, pas: 70, dri: 65, def: 85, phy: 88, com: 84 },
    { name: 'Glen Johnson', country: 'England', pos: 'DEF', spec: 'RB', ovr: 83, pac: 85, sho: 68, pas: 78, dri: 82, def: 81, phy: 79, com: 82 },
    { name: 'David James', country: 'England', pos: 'GK', spec: 'GK', ovr: 86, pac: 60, sho: 24, pas: 74, dri: 52, def: 88, phy: 86, com: 86 }
  ]),

  // 22. Stoke City 2010-11
  makeSquad('stoke-city-2010-11', 'Stoke City', '2010-11', 'Stoke City 2010-11 (Pulis Delap Long Throw Era)', 'Premier League', 'ENG', '#E20613', '#FFFFFF', 'Direct Vertical', [
    { name: 'Kenwyne Jones', country: 'Trinidad and Tobago', pos: 'FWD', spec: 'ST', ovr: 82, pac: 78, sho: 81, pas: 64, dri: 72, def: 38, phy: 92, com: 79 },
    { name: 'Jonathan Walters', country: 'Ireland', pos: 'FWD', spec: 'ST', ovr: 81, pac: 77, sho: 79, pas: 72, dri: 75, def: 58, phy: 86, com: 82 },
    { name: 'Matthew Etherington', country: 'England', pos: 'MID', spec: 'LM', ovr: 82, pac: 86, sho: 76, pas: 81, dri: 82, def: 52, phy: 70, com: 80 },
    { name: 'Rory Delap', country: 'Ireland', pos: 'MID', spec: 'RM', ovr: 80, pac: 74, sho: 70, pas: 75, dri: 72, def: 74, phy: 86, com: 82, aura: { id: 'delap-javelin', name: 'The Human Javelin', description: '+50% threat on long throw-ins creating chaotic box scrambles.', shortDesc: '+50% long throw chaos', rarity: 'Legendary' } },
    { name: 'Glenn Whelan', country: 'Ireland', pos: 'MID', spec: 'CM', ovr: 80, pac: 68, sho: 74, pas: 80, dri: 72, def: 80, phy: 82, com: 82 },
    { name: 'Dean Whitehead', country: 'England', pos: 'MID', spec: 'CM', ovr: 79, pac: 70, sho: 68, pas: 78, dri: 73, def: 80, phy: 82, com: 80 },
    { name: 'Marc Wilson', country: 'Ireland', pos: 'DEF', spec: 'LB', ovr: 79, pac: 74, sho: 58, pas: 73, dri: 70, def: 80, phy: 82, com: 78 },
    { name: 'Ryan Shawcross', country: 'England', pos: 'DEF', spec: 'CB', ovr: 84, pac: 66, sho: 44, pas: 65, dri: 58, def: 87, phy: 91, com: 84, aura: { id: 'shawcross-iron', name: 'Britannia Iron', description: '+30% physical tackling aggression and aerial clearances.', shortDesc: '+30% clearances & duels', rarity: 'Epic' } },
    { name: 'Robert Huth', country: 'Germany', pos: 'DEF', spec: 'CB', ovr: 84, pac: 60, sho: 65, pas: 62, dri: 54, def: 86, phy: 93, com: 83, aura: { id: 'huth-berlin-wall', name: 'The Berlin Wall', description: '+35% headed goal conversion on set piece deliveries.', shortDesc: '+35% set-piece headers', rarity: 'Epic' } },
    { name: 'Andy Wilkinson', country: 'England', pos: 'DEF', spec: 'RB', ovr: 78, pac: 75, sho: 40, pas: 68, dri: 66, def: 80, phy: 85, com: 78 },
    { name: 'Asmir Begović', country: 'Bosnia and Herzegovina', pos: 'GK', spec: 'GK', ovr: 83, pac: 52, sho: 20, pas: 72, dri: 46, def: 85, phy: 82, com: 84 }
  ]),

  // 23. Swansea City 2012-13
  makeSquad('swansea-2012-13', 'Swansea City', '2012-13', 'Swansea City 2012-13 (Laudrup Michu League Cup)', 'Premier League', 'WAL', '#FFFFFF', '#000000', 'Tiki-Taka', [
    { name: 'Michu', country: 'Spain', pos: 'FWD', spec: 'ST', ovr: 86, pac: 80, sho: 88, pas: 78, dri: 84, def: 48, phy: 84, com: 89, aura: { id: 'michu-bargain', name: 'The £2M Bargain Masterclass', description: '+35% first-touch finishing efficiency in the penalty box.', shortDesc: '+35% first-touch finishing', rarity: 'Legendary' } },
    { name: 'Pablo Hernández', country: 'Spain', pos: 'FWD', spec: 'RW', ovr: 83, pac: 82, sho: 77, pas: 85, dri: 86, def: 44, phy: 66, com: 83 },
    { name: 'Nathan Dyer', country: 'England', pos: 'FWD', spec: 'LW', ovr: 81, pac: 92, sho: 72, pas: 75, dri: 84, def: 40, phy: 62, com: 79 },
    { name: 'Jonathan de Guzmán', country: 'Netherlands', pos: 'MID', spec: 'CAM', ovr: 83, pac: 78, sho: 80, pas: 84, dri: 82, def: 65, phy: 72, com: 84 },
    { name: 'Leon Britton', country: 'England', pos: 'MID', spec: 'CDM', ovr: 82, pac: 68, sho: 58, pas: 90, dri: 82, def: 78, phy: 68, com: 91, aura: { id: 'britton-metronome', name: 'Swansea Xavi', description: '+20% team passing accuracy; rarely ever gives ball away.', shortDesc: '+20% pass retention', rarity: 'Epic' } },
    { name: 'Ki Sung-yueng', country: 'South Korea', pos: 'MID', spec: 'CM', ovr: 82, pac: 72, sho: 76, pas: 84, dri: 79, def: 77, phy: 80, com: 84 },
    { name: 'Ben Davies', country: 'Wales', pos: 'DEF', spec: 'LB', ovr: 80, pac: 78, sho: 55, pas: 75, dri: 74, def: 81, phy: 78, com: 80 },
    { name: 'Ashley Williams', country: 'Wales', pos: 'DEF', spec: 'CB', ovr: 84, pac: 70, sho: 45, pas: 75, dri: 65, def: 86, phy: 87, com: 86 },
    { name: 'Chico Flores', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 81, pac: 68, sho: 42, pas: 72, dri: 64, def: 83, phy: 83, com: 81 },
    { name: 'Àngel Rangel', country: 'Spain', pos: 'DEF', spec: 'RB', ovr: 81, pac: 78, sho: 58, pas: 77, dri: 77, def: 81, phy: 77, com: 82 },
    { name: 'Michel Vorm', country: 'Netherlands', pos: 'GK', spec: 'GK', ovr: 83, pac: 58, sho: 20, pas: 78, dri: 52, def: 85, phy: 76, com: 85 }
  ]),

  // 24. Wigan 2012-13
  makeSquad('wigan-2012-13', 'Wigan Athletic', '2012-13', 'Wigan Athletic 2012-13 (FA Cup Winners & Relegated)', 'Premier League', 'ENG', '#002B7F', '#FFFFFF', 'Tiki-Taka', [
    { name: 'Arouna Koné', country: 'Ivory Coast', pos: 'FWD', spec: 'ST', ovr: 82, pac: 83, sho: 81, pas: 70, dri: 80, def: 38, phy: 84, com: 80 },
    { name: 'Shaun Maloney', country: 'Scotland', pos: 'MID', spec: 'LW', ovr: 82, pac: 80, sho: 78, pas: 84, dri: 85, def: 45, phy: 64, com: 84 },
    { name: 'Callum McManaman', country: 'England', pos: 'MID', spec: 'RW', ovr: 81, pac: 88, sho: 76, pas: 75, dri: 86, def: 40, phy: 70, com: 82, aura: { id: 'mcmanaman-wembley', name: 'Wembley MOTM', description: '+35% take-on dribble success in cup finals.', shortDesc: '+35% cup final dribbles', rarity: 'Epic' } },
    { name: 'James McCarthy', country: 'Ireland', pos: 'MID', spec: 'CM', ovr: 82, pac: 76, sho: 72, pas: 82, dri: 79, def: 80, phy: 80, com: 83 },
    { name: 'Jordi Gómez', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 79, pac: 70, sho: 76, pas: 82, dri: 80, def: 64, phy: 68, com: 81 },
    { name: 'Ben Watson', country: 'England', pos: 'MID', spec: 'CM', ovr: 80, pac: 70, sho: 74, pas: 79, dri: 74, def: 78, phy: 80, com: 86, aura: { id: 'watson-91st', name: '91st Minute Header', description: '+40% header conversion from corners in 90th+ minute.', shortDesc: '+40% stoppage header goals', rarity: 'Epic' } },
    { name: 'Maynor Figueroa', country: 'Honduras', pos: 'DEF', spec: 'LB', ovr: 80, pac: 78, sho: 68, pas: 74, dri: 72, def: 80, phy: 83, com: 79 },
    { name: 'Paul Scharner', country: 'Austria', pos: 'DEF', spec: 'CB', ovr: 80, pac: 72, sho: 64, pas: 70, dri: 70, def: 81, phy: 84, com: 82 },
    { name: 'Emmerson Boyce', country: 'Barbados', pos: 'DEF', spec: 'CB', ovr: 81, pac: 74, sho: 45, pas: 68, dri: 66, def: 83, phy: 83, com: 84 },
    { name: 'Antolín Alcaraz', country: 'Paraguay', pos: 'DEF', spec: 'CB', ovr: 80, pac: 68, sho: 40, pas: 66, dri: 62, def: 82, phy: 82, com: 80 },
    { name: 'Joel Robles', country: 'Spain', pos: 'GK', spec: 'GK', ovr: 81, pac: 54, sho: 20, pas: 70, dri: 48, def: 83, phy: 78, com: 83 }
  ]),

  // 25. Espanyol 2006-07
  makeSquad('espanyol-2006-07', 'RCD Espanyol', '2006-07', 'RCD Espanyol 2006-07 (UEFA Cup Finalists)', 'La Liga', 'ESP', '#007FFF', '#FFFFFF', 'Low-Block Counter', [
    { name: 'Raúl Tamudo', country: 'Spain', pos: 'FWD', spec: 'ST', ovr: 87, pac: 85, sho: 89, pas: 76, dri: 84, def: 42, phy: 78, com: 92, aura: { id: 'tamudo-tamudazo', name: 'El Tamudazo', description: '+40% conversion vs title rivals in away derby clashes.', shortDesc: '+40% derby clutch xG', rarity: 'Legendary' } },
    { name: 'Walter Pandiani', country: 'Uruguay', pos: 'FWD', spec: 'ST', ovr: 85, pac: 76, sho: 88, pas: 68, dri: 77, def: 44, phy: 87, com: 86, aura: { id: 'pandiani-rifle', name: 'El Rifle', description: '+30% shot power; top scorer of 2006-07 UEFA Cup (11 goals).', shortDesc: '+30% European goal rate', rarity: 'Epic' } },
    { name: 'Albert Riera', country: 'Spain', pos: 'MID', spec: 'LM', ovr: 84, pac: 84, sho: 80, pas: 84, dri: 85, def: 55, phy: 79, com: 83 },
    { name: 'Iván de la Peña', country: 'Spain', pos: 'MID', spec: 'CAM', ovr: 88, pac: 72, sho: 78, pas: 95, dri: 89, def: 52, phy: 68, com: 92, aura: { id: 'delapena-buda', name: 'El Pequeño Buda', description: '+45% through-ball visionary assist completion.', shortDesc: '+45% visionary through-balls', rarity: 'Legendary' } },
    { name: 'Moisés Hurtado', country: 'Spain', pos: 'MID', spec: 'CDM', ovr: 82, pac: 70, sho: 60, pas: 78, dri: 74, def: 85, phy: 84, com: 81 },
    { name: 'Francisco Rufete', country: 'Spain', pos: 'MID', spec: 'RM', ovr: 82, pac: 82, sho: 75, pas: 80, dri: 81, def: 60, phy: 74, com: 81 },
    { name: 'David García', country: 'Spain', pos: 'DEF', spec: 'LB', ovr: 80, pac: 78, sho: 50, pas: 73, dri: 72, def: 81, phy: 78, com: 79 },
    { name: 'Dani Jarque', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 85, pac: 72, sho: 50, pas: 74, dri: 68, def: 88, phy: 85, com: 89, aura: { id: 'jarque-eternal', name: 'Eterno Capitán', description: '+25% defensive stability and composure across backline.', shortDesc: '+25% backline composure', rarity: 'Legendary' } },
    { name: 'Marc Torrejón', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 81, pac: 70, sho: 38, pas: 68, dri: 62, def: 83, phy: 83, com: 80 },
    { name: 'Pablo Zabaleta', country: 'Argentina', pos: 'DEF', spec: 'RB', ovr: 83, pac: 80, sho: 58, pas: 76, dri: 77, def: 84, phy: 85, com: 84 },
    { name: 'Carlos Kameni', country: 'Cameroon', pos: 'GK', spec: 'GK', ovr: 86, pac: 65, sho: 24, pas: 74, dri: 52, def: 88, phy: 84, com: 88 }
  ]),

  // 26. Real Zaragoza 2003-04
  makeSquad('zaragoza-2003-04', 'Real Zaragoza', '2003-04', 'Real Zaragoza 2003-04 (Copa del Rey Champions)', 'La Liga', 'ESP', '#002B7F', '#FFFFFF', 'Direct Vertical', [
    { name: 'David Villa', country: 'Spain', pos: 'FWD', spec: 'ST', ovr: 88, pac: 89, sho: 91, pas: 78, dri: 87, def: 40, phy: 76, com: 90, aura: { id: 'villa-guaje-breakthrough', name: 'El Guaje Eruption', description: '+35% clinical finishing on fast breaks; destroyed Galacticos.', shortDesc: '+35% break finish xG', rarity: 'Legendary' } },
    { name: 'Sávio', country: 'Brazil', pos: 'FWD', spec: 'LW', ovr: 85, pac: 84, sho: 80, pas: 86, dri: 88, def: 42, phy: 70, com: 86 },
    { name: 'Luciano Galletti', country: 'Argentina', pos: 'FWD', spec: 'RW', ovr: 83, pac: 85, sho: 81, pas: 78, dri: 84, def: 45, phy: 74, com: 84, aura: { id: 'galletti-cup-winner', name: 'Montjuïc Extra Time Strike', description: '+40% conversion in Copa del Rey extra-time.', shortDesc: '+40% extra-time winner', rarity: 'Epic' } },
    { name: 'Cani', country: 'Spain', pos: 'MID', spec: 'CAM', ovr: 83, pac: 78, sho: 76, pas: 85, dri: 86, def: 52, phy: 68, com: 83 },
    { name: 'José María Movilla', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 82, pac: 74, sho: 72, pas: 83, dri: 79, def: 78, phy: 78, com: 83 },
    { name: 'Leonardo Ponzio', country: 'Argentina', pos: 'MID', spec: 'CDM', ovr: 82, pac: 76, sho: 68, pas: 78, dri: 75, def: 84, phy: 86, com: 82 },
    { name: 'Delio Toledo', country: 'Paraguay', pos: 'DEF', spec: 'LB', ovr: 80, pac: 80, sho: 60, pas: 73, dri: 72, def: 80, phy: 81, com: 79 },
    { name: 'Gabriel Milito', country: 'Argentina', pos: 'DEF', spec: 'CB', ovr: 87, pac: 76, sho: 50, pas: 76, dri: 70, def: 90, phy: 87, com: 90, aura: { id: 'gabi-milito-wall', name: 'El Mariscal', description: '+30% slide tackle interception success against star forwards.', shortDesc: '+30% slide tackle win', rarity: 'Epic' } },
    { name: 'Álvaro', country: 'Brazil', pos: 'DEF', spec: 'CB', ovr: 82, pac: 72, sho: 42, pas: 68, dri: 64, def: 83, phy: 84, com: 82 },
    { name: 'Luis Cuartero', country: 'Spain', pos: 'DEF', spec: 'RB', ovr: 80, pac: 77, sho: 48, pas: 73, dri: 72, def: 81, phy: 78, com: 82 },
    { name: 'César Láinez', country: 'Spain', pos: 'GK', spec: 'GK', ovr: 82, pac: 54, sho: 20, pas: 70, dri: 48, def: 84, phy: 78, com: 84 }
  ]),

  // 27. Getafe 2007-08
  makeSquad('getafe-2007-08', 'Getafe CF', '2007-08', 'Getafe CF 2007-08 (Laudrup UEFA Cup Miracle)', 'La Liga', 'ESP', '#005BBB', '#FFFFFF', 'Tiki-Taka', [
    { name: 'Manu del Moral', country: 'Spain', pos: 'FWD', spec: 'ST', ovr: 82, pac: 83, sho: 82, pas: 74, dri: 81, def: 40, phy: 76, com: 81 },
    { name: 'Juan Ángel Albín', country: 'Uruguay', pos: 'FWD', spec: 'ST', ovr: 82, pac: 82, sho: 82, pas: 79, dri: 84, def: 42, phy: 72, com: 82 },
    { name: 'Esteban Granero', country: 'Spain', pos: 'MID', spec: 'CAM', ovr: 83, pac: 75, sho: 80, pas: 86, dri: 84, def: 62, phy: 74, com: 84 },
    { name: 'Rubén de la Red', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 85, pac: 78, sho: 82, pas: 88, dri: 85, def: 78, phy: 80, com: 87, aura: { id: 'delared-genius', name: 'Euro 2008 Talent', description: '+30% deep-lying playmaker pass accuracy and vision.', shortDesc: '+30% playmaking vision', rarity: 'Epic' } },
    { name: 'Javier Casquero', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 83, pac: 72, sho: 84, pas: 82, dri: 78, def: 76, phy: 80, com: 84, aura: { id: 'casquero-missile', name: 'Coliseum Screamer', description: '+35% long range goals from 25+ yards; scored vs Bayern.', shortDesc: '+35% 25yd strike xG', rarity: 'Epic' } },
    { name: 'Pablo Hernández', country: 'Spain', pos: 'MID', spec: 'RM', ovr: 82, pac: 83, sho: 76, pas: 83, dri: 85, def: 48, phy: 66, com: 82 },
    { name: 'Lucas Licht', country: 'Argentina', pos: 'DEF', spec: 'LB', ovr: 80, pac: 78, sho: 60, pas: 74, dri: 74, def: 80, phy: 78, com: 79 },
    { name: 'Daniel Díaz', country: 'Argentina', pos: 'DEF', spec: 'CB', ovr: 84, pac: 70, sho: 55, pas: 72, dri: 64, def: 86, phy: 88, com: 85, aura: { id: 'cata-diaz-iron', name: 'Cata Díaz Enforcer', description: '+30% hard sliding tackle win rate.', shortDesc: '+30% hard tackles', rarity: 'Epic' } },
    { name: 'Mario', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 80, pac: 68, sho: 40, pas: 66, dri: 60, def: 81, phy: 82, com: 79 },
    { name: 'David Cortés', country: 'Spain', pos: 'DEF', spec: 'RB', ovr: 80, pac: 79, sho: 50, pas: 73, dri: 73, def: 80, phy: 78, com: 80 },
    { name: 'Roberto Abbondanzieri', country: 'Argentina', pos: 'GK', spec: 'GK', ovr: 84, pac: 52, sho: 24, pas: 76, dri: 48, def: 86, phy: 78, com: 86 }
  ]),

  // 28. Mallorca 2002-03
  makeSquad('mallorca-2002-03', 'RCD Mallorca', '2002-03', 'RCD Mallorca 2002-03 (Eto\'o Copa del Rey Champions)', 'La Liga', 'ESP', '#E20613', '#000000', 'Direct Vertical', [
    { name: 'Samuel Eto\'o', country: 'Cameroon', pos: 'FWD', spec: 'ST', ovr: 89, pac: 94, sho: 89, pas: 78, dri: 88, def: 42, phy: 83, com: 90, aura: { id: 'etoo-indomitable', name: 'Son Moix Whirlwind', description: '+40% breakaway speed and clinical brace in Copa final.', shortDesc: '+40% breakaway finishing', rarity: 'Legendary' } },
    { name: 'Walter Pandiani', country: 'Uruguay', pos: 'FWD', spec: 'ST', ovr: 84, pac: 76, sho: 86, pas: 68, dri: 76, def: 44, phy: 86, com: 84 },
    { name: 'Albert Riera', country: 'Spain', pos: 'MID', spec: 'LM', ovr: 83, pac: 83, sho: 78, pas: 82, dri: 84, def: 52, phy: 78, com: 81 },
    { name: 'Ariel Ibagaza', country: 'Argentina', pos: 'MID', spec: 'CAM', ovr: 86, pac: 76, sho: 78, pas: 92, dri: 88, def: 48, phy: 64, com: 89, aura: { id: 'ibagaza-caño', name: 'El Caño Playmaker', description: '+35% visionary through-balls behind backlines.', shortDesc: '+35% through-ball xA', rarity: 'Epic' } },
    { name: 'Harold Lozano', country: 'Colombia', pos: 'MID', spec: 'CDM', ovr: 82, pac: 72, sho: 68, pas: 79, dri: 75, def: 83, phy: 86, com: 82 },
    { name: 'Alejandro Campano', country: 'Spain', pos: 'MID', spec: 'RM', ovr: 79, pac: 78, sho: 72, pas: 77, dri: 78, def: 58, phy: 72, com: 78 },
    { name: 'Miquel Soler', country: 'Spain', pos: 'DEF', spec: 'LB', ovr: 81, pac: 76, sho: 55, pas: 76, dri: 74, def: 82, phy: 78, com: 84 },
    { name: 'Fernando Niño', country: 'Spain', pos: 'DEF', spec: 'CB', ovr: 81, pac: 68, sho: 40, pas: 68, dri: 62, def: 83, phy: 84, com: 81 },
    { name: 'Federico Lussenhoff', country: 'Argentina', pos: 'DEF', spec: 'CB', ovr: 80, pac: 68, sho: 42, pas: 66, dri: 60, def: 82, phy: 84, com: 80 },
    { name: 'David Cortés', country: 'Spain', pos: 'DEF', spec: 'RB', ovr: 80, pac: 79, sho: 50, pas: 74, dri: 73, def: 80, phy: 78, com: 80 },
    { name: 'Leo Franco', country: 'Argentina', pos: 'GK', spec: 'GK', ovr: 84, pac: 54, sho: 20, pas: 72, dri: 48, def: 86, phy: 80, com: 85 }
  ]),

  // 29. Fiorentina 1998-99
  makeSquad('fiorentina-1998-99', 'ACF Fiorentina', '1998-99', 'ACF Fiorentina 1998-99 (Batigol & Rui Costa Magic)', 'Serie A', 'ITA', '#4B0082', '#FFFFFF', 'Direct Vertical', [
    { name: 'Gabriel Batistuta', country: 'Argentina', pos: 'FWD', spec: 'ST', ovr: 93, pac: 88, sho: 97, pas: 79, dri: 86, def: 40, phy: 92, com: 95, aura: { id: 'batigol-machinegun', name: 'Batigol Machine Gun', description: '+45% shot power and clinical finishing from impossible angles.', shortDesc: '+45% shot power & xG', rarity: 'Legendary' } },
    { name: 'Edmundo', country: 'Brazil', pos: 'FWD', spec: 'ST', ovr: 87, pac: 89, sho: 86, pas: 80, dri: 91, def: 40, phy: 80, com: 84, aura: { id: 'edmundo-animal', name: 'O Animal', description: '+35% dribbling flair and unpredictability in 1v1 duels.', shortDesc: '+35% 1v1 dribble wins', rarity: 'Epic' } },
    { name: 'Rui Costa', country: 'Portugal', pos: 'MID', spec: 'CAM', ovr: 92, pac: 80, sho: 85, pas: 96, dri: 93, def: 55, phy: 76, com: 94, aura: { id: 'ruicosta-vision', name: 'Il Maestro di Firenze', description: '+40% assist completion on incisive through balls to Batigol.', shortDesc: '+40% through-ball assists', rarity: 'Legendary' } },
    { name: 'Christian Amoroso', country: 'Italy', pos: 'MID', spec: 'CM', ovr: 81, pac: 74, sho: 70, pas: 80, dri: 76, def: 81, phy: 80, com: 82 },
    { name: 'Guillermo Amor', country: 'Spain', pos: 'MID', spec: 'CM', ovr: 83, pac: 72, sho: 74, pas: 85, dri: 79, def: 78, phy: 76, com: 88 },
    { name: 'Jörg Heinrich', country: 'Germany', pos: 'DEF', spec: 'LB', ovr: 84, pac: 82, sho: 72, pas: 80, dri: 78, def: 83, phy: 83, com: 84 },
    { name: 'Moreno Torricelli', country: 'Italy', pos: 'DEF', spec: 'RB', ovr: 84, pac: 82, sho: 58, pas: 75, dri: 76, def: 85, phy: 85, com: 86 },
    { name: 'Tomáš Řepka', country: 'Czech Republic', pos: 'DEF', spec: 'CB', ovr: 83, pac: 74, sho: 40, pas: 65, dri: 60, def: 86, phy: 89, com: 78 },
    { name: 'Pasquale Padalino', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 83, pac: 70, sho: 45, pas: 70, dri: 64, def: 85, phy: 84, com: 83 },
    { name: 'Aldo Firicano', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 81, pac: 66, sho: 38, pas: 66, dri: 58, def: 83, phy: 83, com: 81 },
    { name: 'Francesco Toldo', country: 'Italy', pos: 'GK', spec: 'GK', ovr: 90, pac: 58, sho: 25, pas: 76, dri: 54, def: 92, phy: 88, com: 93, aura: { id: 'toldo-giant', name: 'The Colossus of Florence', description: '+35% penalty reflex saves; impenetrable shot-stopper.', shortDesc: '+35% penalty saves', rarity: 'Legendary' } }
  ]),

  // 30. Sampdoria 1990-91
  makeSquad('sampdoria-1990-91', 'Sampdoria', '1990-91', 'Sampdoria 1990-91 (Vialli & Mancini Historic Scudetto)', 'Serie A', 'ITA', '#002B7F', '#FFFFFF', 'Direct Vertical', [
    { name: 'Gianluca Vialli', country: 'Italy', pos: 'FWD', spec: 'ST', ovr: 91, pac: 87, sho: 92, pas: 80, dri: 86, def: 48, phy: 88, com: 93, aura: { id: 'vialli-scudetto', name: 'Capocannoniere Champion', description: '+35% acrobatic volley and clinical finishing; 19 goals.', shortDesc: '+35% volley & finish xG', rarity: 'Legendary' } },
    { name: 'Roberto Mancini', country: 'Italy', pos: 'FWD', spec: 'ST', ovr: 90, pac: 82, sho: 88, pas: 92, dri: 92, def: 45, phy: 78, com: 94, aura: { id: 'mancini-vision', name: 'Il Mancio Genius', description: '+35% key pass vision in the final third.', shortDesc: '+35% final third vision', rarity: 'Legendary' } },
    { name: 'Attilio Lombardo', country: 'Italy', pos: 'MID', spec: 'RM', ovr: 87, pac: 91, sho: 80, pas: 84, dri: 86, def: 65, phy: 82, com: 86, aura: { id: 'lombardo-ostrich', name: 'Popeye Wing Velocity', description: '+30% sprint recovery down the right flank.', shortDesc: '+30% flank sprint speed', rarity: 'Epic' } },
    { name: 'Toninho Cerezo', country: 'Brazil', pos: 'MID', spec: 'CM', ovr: 88, pac: 75, sho: 80, pas: 90, dri: 88, def: 82, phy: 80, com: 92 },
    { name: 'Fausto Pari', country: 'Italy', pos: 'MID', spec: 'CDM', ovr: 84, pac: 74, sho: 64, pas: 80, dri: 75, def: 86, phy: 85, com: 84 },
    { name: 'Srečko Katanec', country: 'Slovenia', pos: 'MID', spec: 'LM', ovr: 85, pac: 78, sho: 78, pas: 83, dri: 80, def: 82, phy: 86, com: 86 },
    { name: 'Moreno Mannini', country: 'Italy', pos: 'DEF', spec: 'RB', ovr: 85, pac: 84, sho: 54, pas: 76, dri: 78, def: 86, phy: 84, com: 85 },
    { name: 'Pietro Vierchowod', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 90, pac: 88, sho: 50, pas: 72, dri: 68, def: 94, phy: 92, com: 93, aura: { id: 'vierchowod-tsar', name: 'The Tsar', description: '+40% 1v1 recovery tackle pace; Diego Maradona called him his toughest rival.', shortDesc: '+40% 1v1 recovery tackle', rarity: 'Legendary' } },
    { name: 'Marco Lanna', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 83, pac: 74, sho: 40, pas: 70, dri: 64, def: 84, phy: 82, com: 82 },
    { name: 'Ivano Bonetti', country: 'Italy', pos: 'DEF', spec: 'LB', ovr: 82, pac: 80, sho: 58, pas: 76, dri: 76, def: 81, phy: 80, com: 82 },
    { name: 'Gianluca Pagliuca', country: 'Italy', pos: 'GK', spec: 'GK', ovr: 90, pac: 62, sho: 26, pas: 78, dri: 54, def: 92, phy: 84, com: 93, aura: { id: 'pagliuca-cat', name: 'Scudetto Wall', description: '+35% close-range reflex saves.', shortDesc: '+35% reflex saves', rarity: 'Legendary' } }
  ]),

  // 31. Atalanta 2019-20
  makeSquad('atalanta-2019-20', 'Atalanta BC', '2019-20', 'Atalanta BC 2019-20 (Gasperini 98 League Goals)', 'Serie A', 'ITA', '#002B7F', '#000000', 'Gegenpress', [
    { name: 'Duván Zapata', country: 'Colombia', pos: 'FWD', spec: 'ST', ovr: 88, pac: 84, sho: 89, pas: 76, dri: 84, def: 42, phy: 93, com: 87, aura: { id: 'zapata-tank', name: 'The Bull of Bergamo', description: '+35% physical hold-up duel dominance.', shortDesc: '+35% physical hold-up', rarity: 'Epic' } },
    { name: 'Josip Iličić', country: 'Slovenia', pos: 'FWD', spec: 'RW', ovr: 89, pac: 78, sho: 90, pas: 89, dri: 92, def: 44, phy: 80, com: 91, aura: { id: 'ilicic-valencia-poker', name: 'Mestalla 4-Goal Poker', description: '+40% clinical finishing in knockout ties.', shortDesc: '+40% knockout finishing xG', rarity: 'Legendary' } },
    { name: 'Papu Gómez', country: 'Argentina', pos: 'MID', spec: 'CAM', ovr: 89, pac: 88, sho: 84, pas: 91, dri: 93, def: 48, phy: 60, com: 91, aura: { id: 'papu-dance', name: 'Baila Como El Papu', description: '+35% low centre of gravity dribble success in box.', shortDesc: '+35% box dribbling', rarity: 'Legendary' } },
    { name: 'Robin Gosens', country: 'Germany', pos: 'DEF', spec: 'LB', ovr: 86, pac: 85, sho: 82, pas: 80, dri: 81, def: 81, phy: 84, com: 84, aura: { id: 'gosens-back-post', name: 'Back Post Ghost', description: '+35% conversion arriving late at the far post.', shortDesc: '+35% far post goals', rarity: 'Epic' } },
    { name: 'Hans Hateboer', country: 'Netherlands', pos: 'DEF', spec: 'RB', ovr: 83, pac: 86, sho: 70, pas: 77, dri: 79, def: 80, phy: 84, com: 81 },
    { name: 'Marten de Roon', country: 'Netherlands', pos: 'MID', spec: 'CDM', ovr: 84, pac: 72, sho: 70, pas: 82, dri: 77, def: 86, phy: 86, com: 86 },
    { name: 'Remo Freuler', country: 'Switzerland', pos: 'MID', spec: 'CM', ovr: 84, pac: 76, sho: 76, pas: 84, dri: 82, def: 81, phy: 80, com: 85 },
    { name: 'Rafael Tolói', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 84, pac: 74, sho: 58, pas: 78, dri: 74, def: 85, phy: 83, com: 85 },
    { name: 'José Luis Palomino', country: 'Argentina', pos: 'DEF', spec: 'CB', ovr: 82, pac: 70, sho: 40, pas: 68, dri: 62, def: 84, phy: 87, com: 81 },
    { name: 'Berat Djimsiti', country: 'Albania', pos: 'DEF', spec: 'CB', ovr: 82, pac: 72, sho: 42, pas: 70, dri: 64, def: 83, phy: 85, com: 82 },
    { name: 'Pierluigi Gollini', country: 'Italy', pos: 'GK', spec: 'GK', ovr: 83, pac: 56, sho: 20, pas: 74, dri: 50, def: 85, phy: 78, com: 84 }
  ]),

  // 32. Udinese 2010-11
  makeSquad('udinese-2010-11', 'Udinese', '2010-11', 'Udinese 2010-11 (Di Natale & Alexis UCL Miracle)', 'Serie A', 'ITA', '#000000', '#FFFFFF', 'Low-Block Counter', [
    { name: 'Antonio Di Natale', country: 'Italy', pos: 'FWD', spec: 'ST', ovr: 91, pac: 88, sho: 94, pas: 85, dri: 90, def: 38, phy: 70, com: 95, aura: { id: 'totò-capocannoniere', name: 'Totò 28-Goal Capocannoniere', description: '+40% first-time curling shot accuracy from inside 20 yards.', shortDesc: '+40% first-time curling xG', rarity: 'Legendary' } },
    { name: 'Alexis Sánchez', country: 'Chile', pos: 'FWD', spec: 'RW', ovr: 89, pac: 92, sho: 85, pas: 84, dri: 92, def: 48, phy: 78, com: 88, aura: { id: 'alexis-wonderkid', name: 'El Niño Maravilla', description: '+35% acceleration on counter-attacks; scored 4 vs Palermo.', shortDesc: '+35% counter acceleration', rarity: 'Legendary' } },
    { name: 'Pablo Armero', country: 'Colombia', pos: 'MID', spec: 'LM', ovr: 83, pac: 94, sho: 70, pas: 78, dri: 84, def: 72, phy: 78, com: 79 },
    { name: 'Kwadwo Asamoah', country: 'Ghana', pos: 'MID', spec: 'CM', ovr: 84, pac: 83, sho: 78, pas: 82, dri: 85, def: 78, phy: 82, com: 84 },
    { name: 'Gökhan Inler', country: 'Switzerland', pos: 'MID', spec: 'CDM', ovr: 85, pac: 72, sho: 85, pas: 86, dri: 80, def: 84, phy: 84, com: 87, aura: { id: 'inler-rocket', name: 'Swiss Cannon', description: '+30% conversion on strikes from outside 25 yards.', shortDesc: '+30% long shot power', rarity: 'Epic' } },
    { name: 'Giampiero Pinzi', country: 'Italy', pos: 'MID', spec: 'CM', ovr: 81, pac: 72, sho: 68, pas: 78, dri: 74, def: 81, phy: 82, com: 82 },
    { name: 'Mauricio Isla', country: 'Chile', pos: 'DEF', spec: 'RB', ovr: 83, pac: 86, sho: 72, pas: 80, dri: 82, def: 80, phy: 80, com: 82 },
    { name: 'Cristián Zapata', country: 'Colombia', pos: 'DEF', spec: 'CB', ovr: 84, pac: 84, sho: 40, pas: 68, dri: 65, def: 85, phy: 85, com: 82 },
    { name: 'Medhi Benatia', country: 'Morocco', pos: 'DEF', spec: 'CB', ovr: 85, pac: 75, sho: 48, pas: 70, dri: 68, def: 87, phy: 88, com: 85 },
    { name: 'Maurizio Domizzi', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 81, pac: 66, sho: 62, pas: 72, dri: 64, def: 83, phy: 84, com: 83 },
    { name: 'Samir Handanovič', country: 'Slovenia', pos: 'GK', spec: 'GK', ovr: 88, pac: 58, sho: 22, pas: 74, dri: 52, def: 90, phy: 84, com: 91, aura: { id: 'handanovic-penalty-king', name: 'Serie A Penalty Specialist', description: '+45% penalty kick save success; stopped 6 penalties in 2010-11.', shortDesc: '+45% penalty save rate', rarity: 'Legendary' } }
  ]),

  // 33. Brescia 2001-02
  makeSquad('brescia-2001-02', 'Brescia Calcio', '2001-02', 'Brescia Calcio 2001-02 (Baggio & Guardiola Cult Team)', 'Serie A', 'ITA', '#002B7F', '#FFFFFF', 'Tiki-Taka', [
    { name: 'Roberto Baggio', country: 'Italy', pos: 'FWD', spec: 'CF', ovr: 91, pac: 80, sho: 92, pas: 94, dri: 95, def: 40, phy: 68, com: 97, aura: { id: 'baggio-divin-codino', name: 'Il Divin Codino', description: '+40% free-kick, chip and visionary goal creation; pure football genius.', shortDesc: '+40% genius creation xG', rarity: 'Legendary' } },
    { name: 'Luca Toni', country: 'Italy', pos: 'FWD', spec: 'ST', ovr: 85, pac: 76, sho: 88, pas: 68, dri: 78, def: 38, phy: 92, com: 86 },
    { name: 'Igli Tare', country: 'Albania', pos: 'FWD', spec: 'ST', ovr: 80, pac: 70, sho: 80, pas: 65, dri: 70, def: 42, phy: 88, com: 79 },
    { name: 'Pep Guardiola', country: 'Spain', pos: 'MID', spec: 'CDM', ovr: 88, pac: 68, sho: 74, pas: 95, dri: 84, def: 84, phy: 74, com: 95, aura: { id: 'pep-rigamonti', name: 'The Metronome', description: '+25% team passing rhythm and tempo control.', shortDesc: '+25% team pass control', rarity: 'Legendary' } },
    { name: 'Roberto Baronio', country: 'Italy', pos: 'MID', spec: 'CM', ovr: 81, pac: 72, sho: 75, pas: 84, dri: 79, def: 75, phy: 74, com: 82 },
    { name: 'Jonathan Bachini', country: 'Italy', pos: 'MID', spec: 'RM', ovr: 80, pac: 82, sho: 72, pas: 78, dri: 81, def: 58, phy: 72, com: 79 },
    { name: 'Aimo Diana', country: 'Italy', pos: 'DEF', spec: 'RB', ovr: 81, pac: 84, sho: 65, pas: 76, dri: 78, def: 80, phy: 78, com: 81 },
    { name: 'Fabio Petruzzi', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 81, pac: 68, sho: 38, pas: 68, dri: 60, def: 83, phy: 83, com: 82 },
    { name: 'Daniele Bonera', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 83, pac: 76, sho: 40, pas: 72, dri: 68, def: 85, phy: 82, com: 84 },
    { name: 'Vittorio Mero', country: 'Italy', pos: 'DEF', spec: 'LB', ovr: 79, pac: 76, sho: 50, pas: 72, dri: 70, def: 80, phy: 79, com: 81 },
    { name: 'Luca Castellazzi', country: 'Italy', pos: 'GK', spec: 'GK', ovr: 82, pac: 52, sho: 20, pas: 70, dri: 48, def: 84, phy: 78, com: 83 }
  ]),

  // 34. Chievo Verona 2001-02
  makeSquad('chievo-2001-02', 'Chievo Verona', '2001-02', 'Chievo Verona 2001-02 (Delneri Flying Donkeys)', 'Serie A', 'ITA', '#FDB913', '#002B7F', 'Gegenpress', [
    { name: 'Massimo Marazzina', country: 'Italy', pos: 'FWD', spec: 'ST', ovr: 84, pac: 82, sho: 85, pas: 72, dri: 80, def: 42, phy: 82, com: 83 },
    { name: 'Bernardo Corradi', country: 'Italy', pos: 'FWD', spec: 'ST', ovr: 83, pac: 75, sho: 83, pas: 72, dri: 76, def: 45, phy: 89, com: 83 },
    { name: 'Christian Manfredini', country: 'Ivory Coast', pos: 'MID', spec: 'LM', ovr: 83, pac: 87, sho: 78, pas: 80, dri: 84, def: 58, phy: 78, com: 81 },
    { name: 'Eriberto (Luciano)', country: 'Brazil', pos: 'MID', spec: 'RM', ovr: 84, pac: 92, sho: 76, pas: 79, dri: 87, def: 54, phy: 74, com: 80, aura: { id: 'eriberto-lightning', name: 'Flying Donkey Wing Blitz', description: '+35% pace and crossing down the flank.', shortDesc: '+35% flank pace', rarity: 'Epic' } },
    { name: 'Eugenio Corini', country: 'Italy', pos: 'MID', spec: 'CDM', ovr: 86, pac: 70, sho: 82, pas: 90, dri: 80, def: 82, phy: 78, com: 89, aura: { id: 'corini-architect', name: 'Il Regista di Verona', description: '+35% set-piece and long passing accuracy.', shortDesc: '+35% set-piece passing', rarity: 'Epic' } },
    { name: 'Simone Perrotta', country: 'Italy', pos: 'MID', spec: 'CM', ovr: 84, pac: 80, sho: 76, pas: 81, dri: 80, def: 84, phy: 85, com: 84 },
    { name: 'Salvatore Lanna', country: 'Italy', pos: 'DEF', spec: 'LB', ovr: 81, pac: 78, sho: 54, pas: 74, dri: 73, def: 81, phy: 78, com: 81 },
    { name: 'Maurizio D\'Angelo', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 81, pac: 66, sho: 38, pas: 66, dri: 58, def: 83, phy: 82, com: 83 },
    { name: 'Lorenzo D\'Anna', country: 'Italy', pos: 'DEF', spec: 'CB', ovr: 82, pac: 68, sho: 52, pas: 68, dri: 60, def: 84, phy: 84, com: 84 },
    { name: 'Fabio Moro', country: 'Italy', pos: 'DEF', spec: 'RB', ovr: 80, pac: 78, sho: 48, pas: 72, dri: 72, def: 81, phy: 79, com: 80 },
    { name: 'Cristiano Lupatelli', country: 'Italy', pos: 'GK', spec: 'GK', ovr: 83, pac: 55, sho: 20, pas: 70, dri: 48, def: 85, phy: 78, com: 84 }
  ]),

  // 35. Kaiserslautern 1997-98
  makeSquad('kaiserslautern-1997-98', '1. FC Kaiserslautern', '1997-98', '1. FC Kaiserslautern 1997-98 (Promoted Champions Miracle)', 'Bundesliga', 'GER', '#E20613', '#FFFFFF', 'Direct Vertical', [
    { name: 'Olaf Marschall', country: 'Germany', pos: 'FWD', spec: 'ST', ovr: 87, pac: 82, sho: 90, pas: 74, dri: 81, def: 42, phy: 86, com: 90, aura: { id: 'marschall-miracle', name: 'Betzenberg 21 Goals', description: '+35% clinical box finishing on crosses.', shortDesc: '+35% cross finishing', rarity: 'Legendary' } },
    { name: 'Jürgen Rische', country: 'Germany', pos: 'FWD', spec: 'ST', ovr: 83, pac: 80, sho: 83, pas: 72, dri: 78, def: 40, phy: 82, com: 82 },
    { name: 'Ratinho', country: 'Brazil', pos: 'MID', spec: 'RM', ovr: 84, pac: 87, sho: 77, pas: 84, dri: 88, def: 50, phy: 70, com: 83, aura: { id: 'ratinho-magic', name: 'The Magic Mouse', description: '+30% flank dribble take-on success.', shortDesc: '+30% take-on dribbles', rarity: 'Epic' } },
    { name: 'Ciriaco Sforza', country: 'Switzerland', pos: 'MID', spec: 'CM', ovr: 88, pac: 76, sho: 80, pas: 91, dri: 84, def: 84, phy: 82, com: 92, aura: { id: 'sforza-general', name: 'Betzenberg Conductor', description: '+25% team possession stability and transition speed.', shortDesc: '+25% midfield control', rarity: 'Legendary' } },
    { name: 'Michael Ballack', country: 'Germany', pos: 'MID', spec: 'CM', ovr: 84, pac: 80, sho: 84, pas: 83, dri: 82, def: 78, phy: 85, com: 86 },
    { name: 'Martin Wagner', country: 'Germany', pos: 'MID', spec: 'LM', ovr: 83, pac: 80, sho: 78, pas: 82, dri: 80, def: 72, phy: 80, com: 83 },
    { name: 'Andreas Brehme', country: 'Germany', pos: 'DEF', spec: 'LB', ovr: 86, pac: 72, sho: 84, pas: 89, dri: 78, def: 86, phy: 80, com: 94, aura: { id: 'brehme-two-footed', name: 'Two-Footed Master', description: '+40% set piece and penalty accuracy with either foot.', shortDesc: '+40% two-footed set-pieces', rarity: 'Legendary' } },
    { name: 'Miroslav Kadlec', country: 'Czech Republic', pos: 'DEF', spec: 'CB', ovr: 85, pac: 72, sho: 60, pas: 75, dri: 68, def: 87, phy: 86, com: 88 },
    { name: 'Harry Koch', country: 'Germany', pos: 'DEF', spec: 'CB', ovr: 82, pac: 70, sho: 58, pas: 70, dri: 62, def: 84, phy: 86, com: 84 },
    { name: 'Marian Hristov', country: 'Bulgaria', pos: 'DEF', spec: 'RB', ovr: 82, pac: 76, sho: 74, pas: 76, dri: 75, def: 82, phy: 86, com: 82 },
    { name: 'Andreas Reinke', country: 'Germany', pos: 'GK', spec: 'GK', ovr: 85, pac: 54, sho: 22, pas: 72, dri: 48, def: 87, phy: 84, com: 87 }
  ]),

  // 36. Werder Bremen 2003-04
  makeSquad('werder-bremen-2003-04', 'Werder Bremen', '2003-04', 'Werder Bremen 2003-04 (Schaaf Double Winners)', 'Bundesliga', 'GER', '#007F3E', '#FFFFFF', 'Direct Vertical', [
    { name: 'Aílton', country: 'Brazil', pos: 'FWD', spec: 'ST', ovr: 90, pac: 91, sho: 92, pas: 76, dri: 88, def: 38, phy: 85, com: 91, aura: { id: 'ailton-kugelblitz', name: 'Der Kugelblitz', description: '+35% burst pace and clinical conversion; 28 Bundesliga goals.', shortDesc: '+35% burst finishing xG', rarity: 'Legendary' } },
    { name: 'Ivan Klasnić', country: 'Croatia', pos: 'FWD', spec: 'ST', ovr: 86, pac: 82, sho: 87, pas: 79, dri: 84, def: 42, phy: 82, com: 87 },
    { name: 'Johan Micoud', country: 'France', pos: 'MID', spec: 'CAM', ovr: 89, pac: 76, sho: 84, pas: 94, dri: 89, def: 58, phy: 76, com: 93, aura: { id: 'micoud-chef', name: 'Le Chef', description: '+40% through-ball assists; orchestrator of the Double.', shortDesc: '+40% through-ball assists', rarity: 'Legendary' } },
    { name: 'Fabian Ernst', country: 'Germany', pos: 'MID', spec: 'CM', ovr: 84, pac: 74, sho: 76, pas: 84, dri: 80, def: 82, phy: 84, com: 85 },
    { name: 'Frank Baumann', country: 'Germany', pos: 'MID', spec: 'CDM', ovr: 85, pac: 70, sho: 68, pas: 83, dri: 76, def: 87, phy: 84, com: 88 },
    { name: 'Krisztián Lisztes', country: 'Hungary', pos: 'MID', spec: 'CM', ovr: 82, pac: 76, sho: 76, pas: 82, dri: 82, def: 72, phy: 76, com: 82 },
    { name: 'Christian Schulz', country: 'Germany', pos: 'DEF', spec: 'LB', ovr: 81, pac: 78, sho: 62, pas: 76, dri: 74, def: 82, phy: 80, com: 81 },
    { name: 'Valérien Ismaël', country: 'France', pos: 'DEF', spec: 'CB', ovr: 85, pac: 70, sho: 60, pas: 75, dri: 68, def: 87, phy: 88, com: 86 },
    { name: 'Mladen Krstajić', country: 'Serbia', pos: 'DEF', spec: 'CB', ovr: 85, pac: 72, sho: 50, pas: 74, dri: 66, def: 87, phy: 87, com: 86 },
    { name: 'Paul Stalteri', country: 'Canada', pos: 'DEF', spec: 'RB', ovr: 81, pac: 80, sho: 60, pas: 75, dri: 76, def: 81, phy: 80, com: 82 },
    { name: 'Andreas Reinke', country: 'Germany', pos: 'GK', spec: 'GK', ovr: 84, pac: 52, sho: 20, pas: 72, dri: 48, def: 86, phy: 84, com: 86 }
  ]),

  // 37. Stuttgart 2006-07
  makeSquad('stuttgart-2006-07', 'VfB Stuttgart', '2006-07', 'VfB Stuttgart 2006-07 (Young Wild Champions)', 'Bundesliga', 'GER', '#E20613', '#FFFFFF', 'Direct Vertical', [
    { name: 'Mario Gómez', country: 'Germany', pos: 'FWD', spec: 'ST', ovr: 88, pac: 86, sho: 90, pas: 74, dri: 83, def: 38, phy: 87, com: 88, aura: { id: 'gomez-torero', name: 'Der Torero', description: '+35% box poacher finishing; German Footballer of the Year.', shortDesc: '+35% box finishing xG', rarity: 'Legendary' } },
    { name: 'Cacau', country: 'Germany', pos: 'FWD', spec: 'ST', ovr: 85, pac: 85, sho: 85, pas: 77, dri: 85, def: 44, phy: 78, com: 84 },
    { name: 'Roberto Hilbert', country: 'Germany', pos: 'MID', spec: 'RM', ovr: 83, pac: 87, sho: 76, pas: 81, dri: 83, def: 64, phy: 78, com: 82 },
    { name: 'Sami Khedira', country: 'Germany', pos: 'MID', spec: 'CM', ovr: 85, pac: 80, sho: 78, pas: 82, dri: 81, def: 84, phy: 87, com: 87, aura: { id: 'khedira-title-header', name: 'Scudetto Decider Header', description: '+35% conversion arriving late into the box on matchdays 30+.', shortDesc: '+35% clutch late run goals', rarity: 'Epic' } },
    { name: 'Pável Pardo', country: 'Mexico', pos: 'MID', spec: 'CDM', ovr: 85, pac: 72, sho: 78, pas: 88, dri: 79, def: 84, phy: 78, com: 89, aura: { id: 'pardo-boss', name: 'El Jefe Pardo', description: '+30% set-piece delivery accuracy and leadership.', shortDesc: '+30% set-piece delivery', rarity: 'Epic' } },
    { name: 'Thomas Hitzlsperger', country: 'Germany', pos: 'MID', spec: 'LM', ovr: 84, pac: 76, sho: 88, pas: 82, dri: 79, def: 72, phy: 84, com: 85, aura: { id: 'hitz-hammer', name: 'The Hammer', description: '+35% long range rocket conversion from outside box.', shortDesc: '+35% outside box rockets', rarity: 'Epic' } },
    { name: 'Ludovic Magnin', country: 'Switzerland', pos: 'DEF', spec: 'LB', ovr: 81, pac: 82, sho: 62, pas: 76, dri: 76, def: 80, phy: 79, com: 81 },
    { name: 'Fernando Meira', country: 'Portugal', pos: 'DEF', spec: 'CB', ovr: 85, pac: 72, sho: 50, pas: 74, dri: 66, def: 87, phy: 86, com: 88 },
    { name: 'Matthieu Delpierre', country: 'France', pos: 'DEF', spec: 'CB', ovr: 84, pac: 70, sho: 42, pas: 70, dri: 62, def: 86, phy: 88, com: 84 },
    { name: 'Ricardo Osorio', country: 'Mexico', pos: 'DEF', spec: 'RB', ovr: 82, pac: 82, sho: 52, pas: 75, dri: 76, def: 82, phy: 78, com: 83 },
    { name: 'Timo Hildebrand', country: 'Germany', pos: 'GK', spec: 'GK', ovr: 86, pac: 58, sho: 22, pas: 74, dri: 52, def: 88, phy: 80, com: 89 }
  ]),

  // 38. Bayer Leverkusen 2001-02
  makeSquad('leverkusen-2001-02', 'Bayer Leverkusen', '2001-02', 'Bayer Leverkusen 2001-02 (Neverkusen Treble Finalists)', 'Bundesliga', 'GER', '#E20613', '#000000', 'Tiki-Taka', [
    { name: 'Dimitar Berbatov', country: 'Bulgaria', pos: 'FWD', spec: 'ST', ovr: 87, pac: 82, sho: 88, pas: 82, dri: 91, def: 38, phy: 78, com: 93, aura: { id: 'berba-touch', name: 'Velvet Touch', description: '+35% sublime first touch control under defensive pressure.', shortDesc: '+35% first touch control', rarity: 'Legendary' } },
    { name: 'Oliver Neuville', country: 'Germany', pos: 'FWD', spec: 'ST', ovr: 85, pac: 88, sho: 85, pas: 78, dri: 85, def: 42, phy: 72, com: 86 },
    { name: 'Zé Roberto', country: 'Brazil', pos: 'MID', spec: 'LM', ovr: 88, pac: 87, sho: 80, pas: 88, dri: 91, def: 74, phy: 79, com: 89 },
    { name: 'Michael Ballack', country: 'Germany', pos: 'MID', spec: 'CAM', ovr: 92, pac: 82, sho: 92, pas: 89, dri: 86, def: 82, phy: 90, com: 94, aura: { id: 'ballack-complete', name: 'Der Capitano Peak', description: '+35% long range bullet shots and towering headed goals.', shortDesc: '+35% long shots & headers', rarity: 'Legendary' } },
    { name: 'Bernd Schneider', country: 'Germany', pos: 'MID', spec: 'RM', ovr: 87, pac: 83, sho: 82, pas: 90, dri: 89, def: 68, phy: 74, com: 90, aura: { id: 'schneider-white-brazilian', name: 'The White Brazilian', description: '+35% crossing and dribble accuracy on the right wing.', shortDesc: '+35% wing delivery', rarity: 'Epic' } },
    { name: 'Carsten Ramelow', country: 'Germany', pos: 'MID', spec: 'CDM', ovr: 85, pac: 70, sho: 65, pas: 80, dri: 74, def: 88, phy: 87, com: 87 },
    { name: 'Diego Placente', country: 'Argentina', pos: 'DEF', spec: 'LB', ovr: 83, pac: 82, sho: 58, pas: 78, dri: 79, def: 83, phy: 78, com: 84 },
    { name: 'Lúcio', country: 'Brazil', pos: 'DEF', spec: 'CB', ovr: 90, pac: 84, sho: 70, pas: 78, dri: 82, def: 91, phy: 92, com: 91, aura: { id: 'lucio-locomotive', name: 'The Marauding Locomotive', description: '+35% box-to-box driving runs from centre-back into attack.', shortDesc: '+35% CB attacking runs', rarity: 'Legendary' } },
    { name: 'Jens Nowotny', country: 'Germany', pos: 'DEF', spec: 'CB', ovr: 87, pac: 74, sho: 45, pas: 74, dri: 68, def: 89, phy: 87, com: 89 },
    { name: 'Zoltán Sebescen', country: 'Germany', pos: 'DEF', spec: 'RB', ovr: 80, pac: 79, sho: 56, pas: 74, dri: 74, def: 80, phy: 79, com: 80 },
    { name: 'Hans-Jörg Butt', country: 'Germany', pos: 'GK', spec: 'GK', ovr: 85, pac: 52, sho: 78, pas: 76, dri: 50, def: 86, phy: 82, com: 94, aura: { id: 'butt-penalty-gk', name: 'The Penalty-Taking Goalie', description: '+45% penalty kick conversion when stepping up to take them.', shortDesc: '+45% penalty taker GK', rarity: 'Legendary' } }
  ]),

  // 39. Norwich 2021-22 (Relegation struggle)
  makeSquad('norwich-2021-22', 'Norwich City', '2021-22', 'Norwich City 2021-22 (22 Pts Relegation)', 'Premier League', 'ENG', '#FFF200', '#00A650', 'Direct Vertical', [
    { name: 'Teemu Pukki', country: 'Finland', pos: 'FWD', spec: 'ST', ovr: 77, pac: 80, sho: 79, pas: 68, dri: 76, def: 35, phy: 72, com: 80 },
    { name: 'Milot Rashica', country: 'Kosovo', pos: 'FWD', spec: 'LW', ovr: 76, pac: 86, sho: 76, pas: 73, dri: 81, def: 40, phy: 68, com: 75 },
    { name: 'Josh Sargent', country: 'USA', pos: 'FWD', spec: 'RW', ovr: 75, pac: 80, sho: 74, pas: 68, dri: 75, def: 48, phy: 79, com: 74 },
    { name: 'Pierre Lees-Melou', country: 'France', pos: 'MID', spec: 'CM', ovr: 76, pac: 72, sho: 74, pas: 78, dri: 76, def: 74, phy: 74, com: 77 },
    { name: 'Mathias Normann', country: 'Norway', pos: 'MID', spec: 'CDM', ovr: 77, pac: 74, sho: 76, pas: 79, dri: 78, def: 76, phy: 78, com: 78 },
    { name: 'Kenny McLean', country: 'Scotland', pos: 'MID', spec: 'CM', ovr: 74, pac: 70, sho: 70, pas: 74, dri: 73, def: 74, phy: 76, com: 75 },
    { name: 'Brandon Williams', country: 'England', pos: 'DEF', spec: 'LB', ovr: 75, pac: 80, sho: 52, pas: 69, dri: 74, def: 74, phy: 75, com: 74 },
    { name: 'Grant Hanley', country: 'Scotland', pos: 'DEF', spec: 'CB', ovr: 76, pac: 60, sho: 38, pas: 62, dri: 58, def: 78, phy: 86, com: 76 },
    { name: 'Ben Gibson', country: 'England', pos: 'DEF', spec: 'CB', ovr: 75, pac: 60, sho: 36, pas: 66, dri: 60, def: 77, phy: 80, com: 76 },
    { name: 'Max Aarons', country: 'England', pos: 'DEF', spec: 'RB', ovr: 77, pac: 87, sho: 54, pas: 72, dri: 79, def: 75, phy: 72, com: 75 },
    { name: 'Tim Krul', country: 'Netherlands', pos: 'GK', spec: 'GK', ovr: 77, pac: 50, sho: 20, pas: 68, dri: 46, def: 79, phy: 76, com: 84 }
  ]),

  // 40. Sheffield United 2020-21 (Relegation 23 Pts)
  makeSquad('sheffield-utd-2020-21', 'Sheffield United', '2020-21', 'Sheffield United 2020-21 (23 Pts Relegation)', 'Premier League', 'ENG', '#EE2737', '#FFFFFF', 'Low-Block Counter', [
    { name: 'David McGoldrick', country: 'Ireland', pos: 'FWD', spec: 'ST', ovr: 76, pac: 72, sho: 77, pas: 74, dri: 78, def: 45, phy: 78, com: 80 },
    { name: 'Rhian Brewster', country: 'England', pos: 'FWD', spec: 'ST', ovr: 73, pac: 80, sho: 74, pas: 62, dri: 74, def: 32, phy: 68, com: 72 },
    { name: 'Oliver Burke', country: 'Scotland', pos: 'FWD', spec: 'RW', ovr: 73, pac: 90, sho: 71, pas: 64, dri: 75, def: 38, phy: 78, com: 70 },
    { name: 'John Fleck', country: 'Scotland', pos: 'MID', spec: 'CM', ovr: 76, pac: 71, sho: 72, pas: 78, dri: 76, def: 74, phy: 77, com: 77 },
    { name: 'Oliver Norwood', country: 'Northern Ireland', pos: 'MID', spec: 'CDM', ovr: 76, pac: 64, sho: 70, pas: 82, dri: 73, def: 75, phy: 76, com: 80 },
    { name: 'John Lundstram', country: 'England', pos: 'MID', spec: 'CM', ovr: 75, pac: 74, sho: 74, pas: 74, dri: 74, def: 73, phy: 79, com: 75 },
    { name: 'Enda Stevens', country: 'Ireland', pos: 'DEF', spec: 'LB', ovr: 75, pac: 74, sho: 58, pas: 73, dri: 74, def: 75, phy: 75, com: 76 },
    { name: 'John Egan', country: 'Ireland', pos: 'DEF', spec: 'CB', ovr: 78, pac: 62, sho: 38, pas: 67, dri: 60, def: 80, phy: 83, com: 78 },
    { name: 'Chris Basham', country: 'England', pos: 'DEF', spec: 'CB', ovr: 76, pac: 68, sho: 52, pas: 70, dri: 70, def: 78, phy: 80, com: 77 },
    { name: 'George Baldock', country: 'Greece', pos: 'DEF', spec: 'RB', ovr: 76, pac: 82, sho: 54, pas: 70, dri: 74, def: 75, phy: 78, com: 75 },
    { name: 'Aaron Ramsdale', country: 'England', pos: 'GK', spec: 'GK', ovr: 78, pac: 56, sho: 20, pas: 72, dri: 48, def: 80, phy: 77, com: 78 }
  ])
];

// Combine and save
const allSquads = [...currentSquads, ...massiveClubs];
fs.writeFileSync(squadsJsonPath, JSON.stringify(allSquads, null, 2), 'utf8');

const tsContent = `import { SquadData, GameMode } from '../types/football';

export const SQUADS: SquadData[] = ${JSON.stringify(allSquads, null, 2)};

export function getEligibleSquads(mode: GameMode, squads: SquadData[] = SQUADS): SquadData[] {
  if (mode === 'champions_league') {
    return squads.filter(s => s.type === 'club');
  }
  if (mode === 'world_cup') {
    return squads.filter(s => s.type === 'country');
  }
  if (
    mode === 'la_liga' ||
    mode === 'premier_league' ||
    mode === 'serie_a' ||
    mode === 'bundesliga' ||
    mode === 'invincible' ||
    mode === 'dynasty'
  ) {
    return squads.filter(s => s.type === 'club');
  }
  return squads;
}
`;

fs.writeFileSync(squadsTsPath, tsContent, 'utf8');
console.log(`Successfully added 40 massive clubs! Total squads: ${allSquads.length}`);
