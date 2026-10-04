import { OpponentTeam } from '../types/football';

// 2011-12 La Liga (The hardest La Liga season: 100pt Real Madrid, Pep's 91-pt Barcelona, Falcao Atletico)
export const LA_LIGA_HARDEST_OPPONENTS: OpponentTeam[] = [
  { name: 'Real Madrid (2011-12 Centurions)', rating: 94, attackRating: 96, midfieldRating: 93, defenseRating: 91, gkRating: 93, tactic: 'Direct Vertical', managerName: 'Jose Mourinho' },
  { name: 'Barcelona (2011-12 Pep Peak)', rating: 95, attackRating: 96, midfieldRating: 96, defenseRating: 90, gkRating: 90, tactic: 'Tiki-Taka', managerName: 'Pep Guardiola' },
  { name: 'Valencia', rating: 86, attackRating: 87, midfieldRating: 85, defenseRating: 85, gkRating: 87, tactic: 'Direct Vertical', managerName: 'Unai Emery' },
  { name: 'Malaga', rating: 85, attackRating: 85, midfieldRating: 86, defenseRating: 84, gkRating: 84, tactic: 'Tiki-Taka', managerName: 'Manuel Pellegrini' },
  { name: 'Atletico Madrid (Falcao Era)', rating: 88, attackRating: 89, midfieldRating: 86, defenseRating: 88, gkRating: 90, tactic: 'Low-Block Counter', managerName: 'Diego Simeone' },
  { name: 'Levante', rating: 82, attackRating: 81, midfieldRating: 82, defenseRating: 84, gkRating: 83, tactic: 'Low-Block Counter', managerName: 'Juan Ignacio Martinez' },
  { name: 'Osasuna', rating: 81, attackRating: 80, midfieldRating: 81, defenseRating: 82, gkRating: 82, tactic: 'Low-Block Counter', managerName: 'Jose Luis Mendilibar' },
  { name: 'Mallorca', rating: 80, attackRating: 80, midfieldRating: 80, defenseRating: 81, gkRating: 81, tactic: 'Direct Vertical', managerName: 'Joaquin Caparros' },
  { name: 'Sevilla', rating: 84, attackRating: 85, midfieldRating: 84, defenseRating: 83, gkRating: 85, tactic: 'Direct Vertical', managerName: 'Michel' },
  { name: 'Athletic Bilbao (Bielsa)', rating: 86, attackRating: 87, midfieldRating: 86, defenseRating: 84, gkRating: 85, tactic: 'Gegenpress', managerName: 'Marcelo Bielsa' },
  { name: 'Getafe', rating: 79, attackRating: 79, midfieldRating: 79, defenseRating: 80, gkRating: 80, tactic: 'Low-Block Counter', managerName: 'Luis Garcia' },
  { name: 'Real Sociedad', rating: 82, attackRating: 83, midfieldRating: 82, defenseRating: 81, gkRating: 83, tactic: 'Direct Vertical', managerName: 'Philippe Montanier' },
  { name: 'Real Betis', rating: 82, attackRating: 83, midfieldRating: 82, defenseRating: 80, gkRating: 81, tactic: 'Direct Vertical', managerName: 'Pepe Mel' },
  { name: 'Espanyol', rating: 80, attackRating: 80, midfieldRating: 80, defenseRating: 81, gkRating: 81, tactic: 'Low-Block Counter', managerName: 'Mauricio Pochettino' },
  { name: 'Rayo Vallecano', rating: 79, attackRating: 81, midfieldRating: 79, defenseRating: 77, gkRating: 79, tactic: 'Gegenpress', managerName: 'Jose Ramon Sandoval' },
  { name: 'Real Zaragoza', rating: 78, attackRating: 78, midfieldRating: 78, defenseRating: 78, gkRating: 80, tactic: 'Low-Block Counter', managerName: 'Manolo Jimenez' },
  { name: 'Granada', rating: 77, attackRating: 77, midfieldRating: 77, defenseRating: 78, gkRating: 79, tactic: 'Low-Block Counter', managerName: 'Abel Resino' },
  { name: 'Villarreal', rating: 81, attackRating: 81, midfieldRating: 81, defenseRating: 80, gkRating: 83, tactic: 'Tiki-Taka', managerName: 'Miguel Angel Lotina' },
  { name: 'Sporting Gijon', rating: 76, attackRating: 76, midfieldRating: 76, defenseRating: 77, gkRating: 78, tactic: 'Direct Vertical', managerName: 'Javier Clemente' },
  { name: 'Racing Santander', rating: 75, attackRating: 74, midfieldRating: 75, defenseRating: 76, gkRating: 77, tactic: 'Low-Block Counter', managerName: 'Alvaro Cervera' },
];

// 2018-19 Premier League (The hardest Premier League season: 98pt Man City, 97pt Liverpool, Hazard Chelsea, Poch Spurs)
export const PREMIER_LEAGUE_HARDEST_OPPONENTS: OpponentTeam[] = [
  { name: 'Manchester City (2018-19)', rating: 94, attackRating: 95, midfieldRating: 94, defenseRating: 91, gkRating: 91, tactic: 'Tiki-Taka', managerName: 'Pep Guardiola' },
  { name: 'Liverpool (2018-19)', rating: 93, attackRating: 93, midfieldRating: 90, defenseRating: 95, gkRating: 93, tactic: 'Gegenpress', managerName: 'Jurgen Klopp' },
  { name: 'Chelsea (Hazard Era)', rating: 87, attackRating: 89, midfieldRating: 87, defenseRating: 86, gkRating: 84, tactic: 'Tiki-Taka', managerName: 'Maurizio Sarri' },
  { name: 'Tottenham Hotspur (UCL Finalists)', rating: 88, attackRating: 89, midfieldRating: 88, defenseRating: 86, gkRating: 88, tactic: 'Direct Vertical', managerName: 'Mauricio Pochettino' },
  { name: 'Arsenal', rating: 85, attackRating: 88, midfieldRating: 84, defenseRating: 82, gkRating: 85, tactic: 'Direct Vertical', managerName: 'Unai Emery' },
  { name: 'Manchester United', rating: 85, attackRating: 86, midfieldRating: 85, defenseRating: 83, gkRating: 89, tactic: 'Direct Vertical', managerName: 'Ole Gunnar Solskjaer' },
  { name: 'Wolverhampton Wanderers', rating: 82, attackRating: 83, midfieldRating: 82, defenseRating: 83, gkRating: 84, tactic: 'Low-Block Counter', managerName: 'Nuno Espirito Santo' },
  { name: 'Everton', rating: 82, attackRating: 82, midfieldRating: 82, defenseRating: 81, gkRating: 83, tactic: 'Direct Vertical', managerName: 'Marco Silva' },
  { name: 'Leicester City', rating: 83, attackRating: 84, midfieldRating: 83, defenseRating: 82, gkRating: 85, tactic: 'Direct Vertical', managerName: 'Brendan Rodgers' },
  { name: 'West Ham United', rating: 81, attackRating: 82, midfieldRating: 81, defenseRating: 80, gkRating: 82, tactic: 'Direct Vertical', managerName: 'Manuel Pellegrini' },
  { name: 'Watford', rating: 80, attackRating: 81, midfieldRating: 80, defenseRating: 80, gkRating: 82, tactic: 'Direct Vertical', managerName: 'Javi Gracia' },
  { name: 'Crystal Palace', rating: 80, attackRating: 82, midfieldRating: 79, defenseRating: 80, gkRating: 82, tactic: 'Low-Block Counter', managerName: 'Roy Hodgson' },
  { name: 'Newcastle United', rating: 79, attackRating: 79, midfieldRating: 79, defenseRating: 81, gkRating: 82, tactic: 'Low-Block Counter', managerName: 'Rafa Benitez' },
  { name: 'Bournemouth', rating: 79, attackRating: 82, midfieldRating: 79, defenseRating: 77, gkRating: 79, tactic: 'Direct Vertical', managerName: 'Eddie Howe' },
  { name: 'Burnley', rating: 78, attackRating: 77, midfieldRating: 78, defenseRating: 81, gkRating: 82, tactic: 'Low-Block Counter', managerName: 'Sean Dyche' },
  { name: 'Southampton', rating: 78, attackRating: 79, midfieldRating: 78, defenseRating: 78, gkRating: 80, tactic: 'Gegenpress', managerName: 'Ralph Hasenhuttl' },
  { name: 'Brighton & Hove Albion', rating: 78, attackRating: 77, midfieldRating: 78, defenseRating: 79, gkRating: 81, tactic: 'Low-Block Counter', managerName: 'Chris Hughton' },
  { name: 'Cardiff City', rating: 75, attackRating: 74, midfieldRating: 75, defenseRating: 76, gkRating: 78, tactic: 'Direct Vertical', managerName: 'Neil Warnock' },
  { name: 'Fulham', rating: 76, attackRating: 78, midfieldRating: 76, defenseRating: 74, gkRating: 77, tactic: 'Tiki-Taka', managerName: 'Scott Parker' },
  { name: 'Huddersfield Town', rating: 74, attackRating: 72, midfieldRating: 74, defenseRating: 75, gkRating: 76, tactic: 'Low-Block Counter', managerName: 'Jan Siewert' },
];

// 1998-99 Serie A (The Seven Sisters era: Milan, Lazio, Fiorentina, Parma, Roma, Juventus, Inter)
export const SERIE_A_HARDEST_OPPONENTS: OpponentTeam[] = [
  { name: 'AC Milan (Zaccheroni Scudetto)', rating: 91, attackRating: 92, midfieldRating: 90, defenseRating: 91, gkRating: 90, tactic: 'Direct Vertical', managerName: 'Alberto Zaccheroni' },
  { name: 'Lazio (Vieri, Salas, Nedved)', rating: 92, attackRating: 93, midfieldRating: 92, defenseRating: 92, gkRating: 91, tactic: 'Direct Vertical', managerName: 'Sven-Goran Eriksson' },
  { name: 'Fiorentina (Batistuta, Rui Costa)', rating: 90, attackRating: 93, midfieldRating: 91, defenseRating: 87, gkRating: 91, tactic: 'Direct Vertical', managerName: 'Giovanni Trapattoni' },
  { name: 'Parma (Crespo, Veron, Buffon)', rating: 91, attackRating: 91, midfieldRating: 91, defenseRating: 93, gkRating: 94, tactic: 'Direct Vertical', managerName: 'Alberto Malesani' },
  { name: 'Roma (Totti, Cafu)', rating: 88, attackRating: 90, midfieldRating: 88, defenseRating: 87, gkRating: 87, tactic: 'Direct Vertical', managerName: 'Zdenek Zeman' },
  { name: 'Juventus (Zidane, Inzaghi, Davids)', rating: 92, attackRating: 91, midfieldRating: 93, defenseRating: 92, gkRating: 91, tactic: 'Low-Block Counter', managerName: 'Carlo Ancelotti' },
  { name: 'Inter Milan (Ronaldo R9, Baggio)', rating: 91, attackRating: 94, midfieldRating: 89, defenseRating: 89, gkRating: 91, tactic: 'Direct Vertical', managerName: 'Mircea Lucescu' },
  { name: 'Udinese (Amoroso 22 gls)', rating: 84, attackRating: 86, midfieldRating: 83, defenseRating: 83, gkRating: 84, tactic: 'Direct Vertical', managerName: 'Francesco Guidolin' },
  { name: 'Bologna (Signori)', rating: 83, attackRating: 84, midfieldRating: 83, defenseRating: 82, gkRating: 83, tactic: 'Low-Block Counter', managerName: 'Carlo Mazzone' },
  { name: 'Perugia (Nakata)', rating: 80, attackRating: 80, midfieldRating: 82, defenseRating: 80, gkRating: 80, tactic: 'Direct Vertical', managerName: 'Serse Cosmi' },
  { name: 'Bari', rating: 79, attackRating: 78, midfieldRating: 79, defenseRating: 80, gkRating: 80, tactic: 'Low-Block Counter', managerName: 'Eugenio Fascetti' },
  { name: 'Piacenza', rating: 78, attackRating: 78, midfieldRating: 78, defenseRating: 79, gkRating: 80, tactic: 'Low-Block Counter', managerName: 'Giuseppe Materazzi' },
  { name: 'Cagliari', rating: 78, attackRating: 78, midfieldRating: 78, defenseRating: 79, gkRating: 79, tactic: 'Direct Vertical', managerName: 'Gian Piero Ventura' },
  { name: 'Vicenza', rating: 77, attackRating: 77, midfieldRating: 77, defenseRating: 78, gkRating: 78, tactic: 'Low-Block Counter', managerName: 'Edoardo Reja' },
  { name: 'Sampdoria', rating: 81, attackRating: 82, midfieldRating: 80, defenseRating: 80, gkRating: 82, tactic: 'Direct Vertical', managerName: 'Luciano Spalletti' },
  { name: 'Salernitana', rating: 76, attackRating: 77, midfieldRating: 76, defenseRating: 76, gkRating: 77, tactic: 'Direct Vertical', managerName: 'Delio Rossi' },
  { name: 'Empoli', rating: 75, attackRating: 75, midfieldRating: 75, defenseRating: 76, gkRating: 77, tactic: 'Low-Block Counter', managerName: 'Corrado Orrico' },
  { name: 'Venezia', rating: 75, attackRating: 76, midfieldRating: 75, defenseRating: 75, gkRating: 76, tactic: 'Direct Vertical', managerName: 'Walter Novellino' },
];

export const UCL_OPPONENTS: OpponentTeam[] = [
  { name: 'Real Madrid', rating: 93, attackRating: 94, midfieldRating: 93, defenseRating: 91, gkRating: 92, tactic: 'Direct Vertical', managerName: 'Carlo Ancelotti' },
  { name: 'Bayern Munich', rating: 91, attackRating: 92, midfieldRating: 90, defenseRating: 89, gkRating: 91, tactic: 'Gegenpress', managerName: 'Vincent Kompany' },
  { name: 'Barcelona', rating: 90, attackRating: 92, midfieldRating: 90, defenseRating: 88, gkRating: 89, tactic: 'Tiki-Taka', managerName: 'Hansi Flick' },
  { name: 'Paris Saint-Germain', rating: 89, attackRating: 90, midfieldRating: 88, defenseRating: 88, gkRating: 90, tactic: 'Tiki-Taka', managerName: 'Luis Enrique' },
  { name: 'Inter Milan', rating: 89, attackRating: 88, midfieldRating: 89, defenseRating: 90, gkRating: 89, tactic: 'Low-Block Counter', managerName: 'Simone Inzaghi' },
  { name: 'Bayer Leverkusen', rating: 88, attackRating: 88, midfieldRating: 89, defenseRating: 87, gkRating: 87, tactic: 'Tiki-Taka', managerName: 'Xabi Alonso' },
  { name: 'Atletico Madrid', rating: 88, attackRating: 87, midfieldRating: 87, defenseRating: 90, gkRating: 92, tactic: 'Low-Block Counter', managerName: 'Diego Simeone' },
  { name: 'Borussia Dortmund', rating: 86, attackRating: 87, midfieldRating: 85, defenseRating: 85, gkRating: 88, tactic: 'Gegenpress', managerName: 'Nuri Sahin' },
];

export const WORLD_CUP_OPPONENTS: OpponentTeam[] = [
  { name: 'France', rating: 92, attackRating: 94, midfieldRating: 91, defenseRating: 91, gkRating: 90, tactic: 'Direct Vertical' },
  { name: 'Argentina', rating: 92, attackRating: 93, midfieldRating: 91, defenseRating: 90, gkRating: 91, tactic: 'Direct Vertical' },
  { name: 'Brazil', rating: 90, attackRating: 92, midfieldRating: 89, defenseRating: 89, gkRating: 91, tactic: 'Direct Vertical' },
  { name: 'Spain', rating: 91, attackRating: 89, midfieldRating: 93, defenseRating: 89, gkRating: 88, tactic: 'Tiki-Taka' },
  { name: 'England', rating: 90, attackRating: 92, midfieldRating: 90, defenseRating: 88, gkRating: 88, tactic: 'Direct Vertical' },
  { name: 'Germany', rating: 89, attackRating: 89, midfieldRating: 91, defenseRating: 88, gkRating: 91, tactic: 'Gegenpress' },
  { name: 'Portugal', rating: 89, attackRating: 91, midfieldRating: 89, defenseRating: 87, gkRating: 89, tactic: 'Tiki-Taka' },
  { name: 'Netherlands', rating: 87, attackRating: 86, midfieldRating: 87, defenseRating: 89, gkRating: 84, tactic: 'Direct Vertical' },
];

export const RIVALRY_DERBY_OPPONENTS: OpponentTeam[] = [
  { name: 'Real Madrid (El Clásico Rival)', rating: 94, attackRating: 96, midfieldRating: 94, defenseRating: 91, gkRating: 93, tactic: 'Direct Vertical', managerName: 'Carlo Ancelotti' },
  { name: 'AC Milan (Derby della Madonnina Rival)', rating: 92, attackRating: 91, midfieldRating: 92, defenseRating: 93, gkRating: 92, tactic: 'Low-Block Counter', managerName: 'Arrigo Sacchi' },
  { name: 'Tottenham Hotspur (North London Derby)', rating: 89, attackRating: 90, midfieldRating: 88, defenseRating: 87, gkRating: 88, tactic: 'Direct Vertical', managerName: 'Mauricio Pochettino' },
  { name: 'Borussia Dortmund (Der Klassiker Rival)', rating: 90, attackRating: 91, midfieldRating: 89, defenseRating: 88, gkRating: 90, tactic: 'Gegenpress', managerName: 'Jurgen Klopp' },
  { name: 'Boca Juniors (Superclásico Fiery Rival)', rating: 91, attackRating: 92, midfieldRating: 90, defenseRating: 90, gkRating: 89, tactic: 'Low-Block Counter', managerName: 'Carlos Bianchi' },
];

export const ROGUELIKE_BOSS_OPPONENTS: OpponentTeam[] = [
  { name: 'Floor 1: Ajax (Total Football Vanguard)', rating: 84, attackRating: 85, midfieldRating: 85, defenseRating: 82, gkRating: 84, tactic: 'Tiki-Taka', managerName: 'Louis van Gaal' },
  { name: 'Floor 2: Benfica (Eagles of Lisbon)', rating: 85, attackRating: 86, midfieldRating: 84, defenseRating: 85, gkRating: 85, tactic: 'Direct Vertical', managerName: 'Bela Guttmann' },
  { name: 'Floor 3: Napoli (Maradona Heritage XI)', rating: 87, attackRating: 90, midfieldRating: 86, defenseRating: 85, gkRating: 86, tactic: 'Direct Vertical', managerName: 'Ottavio Bianchi' },
  { name: 'Floor 4: Arsenal (Invincibles 2003-04)', rating: 89, attackRating: 91, midfieldRating: 89, defenseRating: 88, gkRating: 89, tactic: 'Direct Vertical', managerName: 'Arsene Wenger' },
  { name: 'Floor 5: Juventus (90s European Champions)', rating: 90, attackRating: 89, midfieldRating: 91, defenseRating: 92, gkRating: 91, tactic: 'Low-Block Counter', managerName: 'Marcello Lippi' },
  { name: 'Floor 6: Manchester United (1999 Treble)', rating: 92, attackRating: 93, midfieldRating: 92, defenseRating: 90, gkRating: 94, tactic: 'Direct Vertical', managerName: 'Sir Alex Ferguson' },
  { name: 'Floor 7: Milan (2005 Ancelotti Diamond)', rating: 93, attackRating: 92, midfieldRating: 95, defenseRating: 94, gkRating: 92, tactic: 'Tiki-Taka', managerName: 'Carlo Ancelotti' },
  { name: 'Floor 8: Barcelona (2011 Pep Peak)', rating: 95, attackRating: 96, midfieldRating: 97, defenseRating: 91, gkRating: 91, tactic: 'Tiki-Taka', managerName: 'Pep Guardiola' },
  { name: 'Floor 9: Real Madrid (3-Peat Dynasty 2016-18)', rating: 96, attackRating: 97, midfieldRating: 95, defenseRating: 93, gkRating: 94, tactic: 'Direct Vertical', managerName: 'Zinedine Zidane' },
  { name: 'Floor 10 (Apex Boss): The All-Time Galácticos', rating: 98, attackRating: 99, midfieldRating: 97, defenseRating: 96, gkRating: 98, tactic: 'Direct Vertical', managerName: 'Vicente del Bosque' },
];

export function getLeagueOpponents(mode: string): OpponentTeam[] {
  if (mode === 'rivalry_derby') return RIVALRY_DERBY_OPPONENTS;
  if (mode === 'draft_roguelike') return ROGUELIKE_BOSS_OPPONENTS;
  if (mode === 'la_liga' || mode === 'salary_cap') return LA_LIGA_HARDEST_OPPONENTS;
  if (mode === 'serie_a') return SERIE_A_HARDEST_OPPONENTS;
  return PREMIER_LEAGUE_HARDEST_OPPONENTS;
}
