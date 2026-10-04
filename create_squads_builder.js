import fs from 'fs';
import path from 'path';

// Script to build the complete 42-squad dataset
const scriptPath = path.resolve('generate_squads.js');

const code = `
const fs = require('fs');

const squads = [
  // -------------------------------------------------------------
  // LA LIGA (11 TEAMS)
  // -------------------------------------------------------------
  {
    id: 'real-madrid-2011-12',
    clubName: 'Real Madrid',
    year: '2011-12',
    fullName: 'Real Madrid 2011-12',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#EEEEEF',
    accentColor: '#1A3B8B',
    primaryTactic: 'Direct Vertical',
    players: [
      { id: 'rm12-cr7', name: 'Cristiano Ronaldo', clubYear: 'Real Madrid 2011-12', clubName: 'Real Madrid', year: '2011-12', country: 'Portugal', league: 'La Liga', position: 'FWD', specificPosition: 'LW', overall: 96, pace: 94, shooting: 96, passing: 83, dribbling: 92, defending: 38, physical: 87, composure: 98, auraTrait: { id: 'calma-calma', name: 'Calma at Camp Nou', description: '+35% conversion in away matches against league rivals.', shortDesc: '+35% away rival xG', rarity: 'Legendary' } },
      { id: 'rm12-benz', name: 'Karim Benzema', clubYear: 'Real Madrid 2011-12', clubName: 'Real Madrid', year: '2011-12', country: 'France', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 91, pace: 84, shooting: 89, passing: 84, dribbling: 88, defending: 36, physical: 81, composure: 90 },
      { id: 'rm12-higuain', name: 'Gonzalo Higuain', clubYear: 'Real Madrid 2011-12', clubName: 'Real Madrid', year: '2011-12', country: 'Argentina', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 89, pace: 84, shooting: 90, passing: 76, dribbling: 83, defending: 35, physical: 82, composure: 87 },
      { id: 'rm12-ozil', name: 'Mesut Ozil', clubYear: 'Real Madrid 2011-12', clubName: 'Real Madrid', year: '2011-12', country: 'Germany', league: 'La Liga', position: 'MID', specificPosition: 'CAM', overall: 92, pace: 78, shooting: 78, passing: 96, dribbling: 91, defending: 35, physical: 66, composure: 91, auraTrait: { id: 'centurion-assist', name: 'Centurion Playmaker', description: 'Assists 1.2 high xG chances per match on counter attacks.', shortDesc: '+0.40 xA on transitions', rarity: 'Epic' } },
      { id: 'rm12-alonso', name: 'Xabi Alonso', clubYear: 'Real Madrid 2011-12', clubName: 'Real Madrid', year: '2011-12', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'CDM', overall: 91, pace: 70, shooting: 82, passing: 95, dribbling: 80, defending: 87, physical: 83, composure: 94 },
      { id: 'rm12-khedira', name: 'Sami Khedira', clubYear: 'Real Madrid 2011-12', clubName: 'Real Madrid', year: '2011-12', country: 'Germany', league: 'La Liga', position: 'MID', specificPosition: 'CM', overall: 85, pace: 74, shooting: 74, passing: 80, dribbling: 76, defending: 84, physical: 87, composure: 83 },
      { id: 'rm12-marcelo', name: 'Marcelo', clubYear: 'Real Madrid 2011-12', clubName: 'Real Madrid', year: '2011-12', country: 'Brazil', league: 'La Liga', position: 'DEF', specificPosition: 'LB', overall: 88, pace: 86, shooting: 73, passing: 83, dribbling: 88, defending: 80, physical: 78, composure: 87 },
      { id: 'rm12-ramos', name: 'Sergio Ramos', clubYear: 'Real Madrid 2011-12', clubName: 'Real Madrid', year: '2011-12', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 92, pace: 82, shooting: 68, passing: 76, dribbling: 72, defending: 92, physical: 89, composure: 95 },
      { id: 'rm12-pepe', name: 'Pepe', clubYear: 'Real Madrid 2011-12', clubName: 'Real Madrid', year: '2011-12', country: 'Portugal', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 89, pace: 81, shooting: 52, passing: 66, dribbling: 64, defending: 92, physical: 93, composure: 86 },
      { id: 'rm12-arbeloa', name: 'Alvaro Arbeloa', clubYear: 'Real Madrid 2011-12', clubName: 'Real Madrid', year: '2011-12', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'RB', overall: 83, pace: 78, shooting: 48, passing: 74, dribbling: 72, defending: 84, physical: 80, composure: 82 },
      { id: 'rm12-casillas', name: 'Iker Casillas', clubYear: 'Real Madrid 2011-12', clubName: 'Real Madrid', year: '2011-12', country: 'Spain', league: 'La Liga', position: 'GK', specificPosition: 'GK', overall: 93, pace: 58, shooting: 25, passing: 74, dribbling: 52, defending: 94, physical: 79, composure: 96 }
    ]
  },
  {
    id: 'barcelona-2010-11',
    clubName: 'Barcelona',
    year: '2010-11',
    fullName: 'Barcelona 2010-11',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#A50044',
    accentColor: '#004D98',
    primaryTactic: 'Tiki-Taka',
    players: [
      { id: 'bar-messi', name: 'Lionel Messi', clubYear: 'Barcelona 2010-11', clubName: 'Barcelona', year: '2010-11', country: 'Argentina', league: 'La Liga', position: 'FWD', specificPosition: 'CF', overall: 98, pace: 95, shooting: 96, passing: 94, dribbling: 99, defending: 40, physical: 76, composure: 99, auraTrait: { id: 'solo-anarchy-messi', name: 'Solo Anarchy', description: '20% chance per match to trigger a solo breakaway generating an isolated 0.85 xG shot.', shortDesc: '20% solo breakaway (0.85 xG)', rarity: 'Legendary' } },
      { id: 'bar-villa', name: 'David Villa', clubYear: 'Barcelona 2010-11', clubName: 'Barcelona', year: '2010-11', country: 'Spain', league: 'La Liga', position: 'FWD', specificPosition: 'LW', overall: 90, pace: 89, shooting: 92, passing: 80, dribbling: 87, defending: 44, physical: 76, composure: 92 },
      { id: 'bar-pedro', name: 'Pedro', clubYear: 'Barcelona 2010-11', clubName: 'Barcelona', year: '2010-11', country: 'Spain', league: 'La Liga', position: 'FWD', specificPosition: 'RW', overall: 86, pace: 88, shooting: 84, passing: 80, dribbling: 85, defending: 52, physical: 71, composure: 86 },
      { id: 'bar-xavi', name: 'Xavi Hernandez', clubYear: 'Barcelona 2010-11', clubName: 'Barcelona', year: '2010-11', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'CM', overall: 95, pace: 72, shooting: 78, passing: 98, dribbling: 91, defending: 76, physical: 71, composure: 98, auraTrait: { id: 'metronome-xavi', name: 'Metronome', description: 'Team is completely immune to high-press stamina drain; passing completion locked above 90%.', shortDesc: 'Immune to press drain, >90% passes', rarity: 'Legendary' } },
      { id: 'bar-iniesta', name: 'Andres Iniesta', clubYear: 'Barcelona 2010-11', clubName: 'Barcelona', year: '2010-11', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'CM', overall: 94, pace: 82, shooting: 79, passing: 95, dribbling: 96, defending: 68, physical: 67, composure: 97 },
      { id: 'bar-busquets', name: 'Sergio Busquets', clubYear: 'Barcelona 2010-11', clubName: 'Barcelona', year: '2010-11', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'CDM', overall: 90, pace: 56, shooting: 64, passing: 89, dribbling: 84, defending: 89, physical: 82, composure: 95 },
      { id: 'bar-alves', name: 'Dani Alves', clubYear: 'Barcelona 2010-11', clubName: 'Barcelona', year: '2010-11', country: 'Brazil', league: 'La Liga', position: 'DEF', specificPosition: 'RB', overall: 91, pace: 91, shooting: 74, passing: 86, dribbling: 87, defending: 83, physical: 81, composure: 87 },
      { id: 'bar-puyol', name: 'Carles Puyol', clubYear: 'Barcelona 2010-11', clubName: 'Barcelona', year: '2010-11', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 92, pace: 76, shooting: 45, passing: 70, dribbling: 64, defending: 95, physical: 92, composure: 95 },
      { id: 'bar-pique', name: 'Gerard Pique', clubYear: 'Barcelona 2010-11', clubName: 'Barcelona', year: '2010-11', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 89, pace: 68, shooting: 60, passing: 81, dribbling: 72, defending: 91, physical: 85, composure: 90 },
      { id: 'bar-abidal', name: 'Eric Abidal', clubYear: 'Barcelona 2010-11', clubName: 'Barcelona', year: '2010-11', country: 'France', league: 'La Liga', position: 'DEF', specificPosition: 'LB', overall: 86, pace: 82, shooting: 48, passing: 74, dribbling: 75, defending: 88, physical: 84, composure: 86 },
      { id: 'bar-valdes', name: 'Victor Valdes', clubYear: 'Barcelona 2010-11', clubName: 'Barcelona', year: '2010-11', country: 'Spain', league: 'La Liga', position: 'GK', specificPosition: 'GK', overall: 88, pace: 55, shooting: 25, passing: 84, dribbling: 60, defending: 88, physical: 78, composure: 89 }
    ]
  },
  {
    id: 'barcelona-2014-15',
    clubName: 'Barcelona',
    year: '2014-15',
    fullName: 'Barcelona 2014-15 (MSN)',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#A50044',
    accentColor: '#004D98',
    primaryTactic: 'Direct Vertical',
    players: [
      { id: 'msn-messi', name: 'Lionel Messi', clubYear: 'Barcelona 2014-15', clubName: 'Barcelona', year: '2014-15', country: 'Argentina', league: 'La Liga', position: 'FWD', specificPosition: 'RW', overall: 98, pace: 94, shooting: 96, passing: 96, dribbling: 98, defending: 38, physical: 75, composure: 99 },
      { id: 'msn-suarez', name: 'Luis Suarez', clubYear: 'Barcelona 2014-15', clubName: 'Barcelona', year: '2014-15', country: 'Uruguay', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 95, pace: 88, shooting: 95, passing: 84, dribbling: 90, defending: 50, physical: 89, composure: 96, auraTrait: { id: 'msn-trident', name: 'MSN Chemistry', description: 'When playing alongside other South American forwards, all attackers gain +20% shot accuracy.', shortDesc: '+20% forward accuracy', rarity: 'Legendary' } },
      { id: 'msn-neymar', name: 'Neymar Jr', clubYear: 'Barcelona 2014-15', clubName: 'Barcelona', year: '2014-15', country: 'Brazil', league: 'La Liga', position: 'FWD', specificPosition: 'LW', overall: 93, pace: 94, shooting: 88, passing: 87, dribbling: 96, defending: 36, physical: 70, composure: 92 },
      { id: 'msn-rakitic', name: 'Ivan Rakitic', clubYear: 'Barcelona 2014-15', clubName: 'Barcelona', year: '2014-15', country: 'Croatia', league: 'La Liga', position: 'MID', specificPosition: 'CM', overall: 88, pace: 74, shooting: 84, passing: 88, dribbling: 82, defending: 76, physical: 78, composure: 89 },
      { id: 'msn-iniesta', name: 'Andres Iniesta', clubYear: 'Barcelona 2014-15', clubName: 'Barcelona', year: '2014-15', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'CM', overall: 91, pace: 78, shooting: 76, passing: 93, dribbling: 93, defending: 64, physical: 65, composure: 95 },
      { id: 'msn-busquets', name: 'Sergio Busquets', clubYear: 'Barcelona 2014-15', clubName: 'Barcelona', year: '2014-15', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'CDM', overall: 90, pace: 54, shooting: 63, passing: 88, dribbling: 83, defending: 89, physical: 81, composure: 95 },
      { id: 'msn-alves', name: 'Dani Alves', clubYear: 'Barcelona 2014-15', clubName: 'Barcelona', year: '2014-15', country: 'Brazil', league: 'La Liga', position: 'DEF', specificPosition: 'RB', overall: 89, pace: 88, shooting: 72, passing: 85, dribbling: 85, defending: 81, physical: 79, composure: 86 },
      { id: 'msn-pique', name: 'Gerard Pique', clubYear: 'Barcelona 2014-15', clubName: 'Barcelona', year: '2014-15', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 88, pace: 67, shooting: 58, passing: 80, dribbling: 70, defending: 90, physical: 84, composure: 89 },
      { id: 'msn-mascherano', name: 'Javier Mascherano', clubYear: 'Barcelona 2014-15', clubName: 'Barcelona', year: '2014-15', country: 'Argentina', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 89, pace: 76, shooting: 48, passing: 78, dribbling: 72, defending: 92, physical: 88, composure: 92 },
      { id: 'msn-alba', name: 'Jordi Alba', clubYear: 'Barcelona 2014-15', clubName: 'Barcelona', year: '2014-15', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'LB', overall: 87, pace: 92, shooting: 68, passing: 81, dribbling: 83, defending: 82, physical: 74, composure: 85 },
      { id: 'msn-terstegen', name: 'Marc-Andre ter Stegen', clubYear: 'Barcelona 2014-15', clubName: 'Barcelona', year: '2014-15', country: 'Germany', league: 'La Liga', position: 'GK', specificPosition: 'GK', overall: 88, pace: 55, shooting: 25, passing: 87, dribbling: 58, defending: 88, physical: 80, composure: 90 }
    ]
  },
  {
    id: 'atletico-2013-14',
    clubName: 'Atletico Madrid',
    year: '2013-14',
    fullName: 'Atletico Madrid 2013-14',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#CB3524',
    accentColor: '#172B4D',
    primaryTactic: 'Low-Block Counter',
    players: [
      { id: 'atm-costa', name: 'Diego Costa', clubYear: 'Atletico Madrid 2013-14', clubName: 'Atletico Madrid', year: '2013-14', country: 'Spain', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 91, pace: 85, shooting: 91, passing: 72, dribbling: 82, defending: 48, physical: 93, composure: 91, auraTrait: { id: 'the-battering-ram', name: 'The Battering Ram', description: '+30% physical duel conversion; breaks open congested low blocks.', shortDesc: '+30% duel conversion', rarity: 'Epic' } },
      { id: 'atm-villa', name: 'David Villa', clubYear: 'Atletico Madrid 2013-14', clubName: 'Atletico Madrid', year: '2013-14', country: 'Spain', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 87, pace: 80, shooting: 88, passing: 78, dribbling: 82, defending: 38, physical: 74, composure: 90 },
      { id: 'atm-koke', name: 'Koke', clubYear: 'Atletico Madrid 2013-14', clubName: 'Atletico Madrid', year: '2013-14', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'LM', overall: 88, pace: 78, shooting: 78, passing: 89, dribbling: 84, defending: 79, physical: 82, composure: 89 },
      { id: 'atm-turan', name: 'Arda Turan', clubYear: 'Atletico Madrid 2013-14', clubName: 'Atletico Madrid', year: '2013-14', country: 'Turkey', league: 'La Liga', position: 'MID', specificPosition: 'RM', overall: 87, pace: 78, shooting: 80, passing: 86, dribbling: 89, defending: 68, physical: 80, composure: 88 },
      { id: 'atm-gabi', name: 'Gabi', clubYear: 'Atletico Madrid 2013-14', clubName: 'Atletico Madrid', year: '2013-14', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'CM', overall: 87, pace: 72, shooting: 75, passing: 84, dribbling: 78, defending: 88, physical: 86, composure: 92 },
      { id: 'atm-tiago', name: 'Tiago Mendes', clubYear: 'Atletico Madrid 2013-14', clubName: 'Atletico Madrid', year: '2013-14', country: 'Portugal', league: 'La Liga', position: 'MID', specificPosition: 'CM', overall: 85, pace: 70, shooting: 74, passing: 82, dribbling: 78, defending: 84, physical: 82, composure: 86 },
      { id: 'atm-filipe', name: 'Filipe Luis', clubYear: 'Atletico Madrid 2013-14', clubName: 'Atletico Madrid', year: '2013-14', country: 'Brazil', league: 'La Liga', position: 'DEF', specificPosition: 'LB', overall: 88, pace: 82, shooting: 64, passing: 81, dribbling: 83, defending: 88, physical: 82, composure: 87 },
      { id: 'atm-godin', name: 'Diego Godin', clubYear: 'Atletico Madrid 2013-14', clubName: 'Atletico Madrid', year: '2013-14', country: 'Uruguay', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 93, pace: 72, shooting: 54, passing: 70, dribbling: 66, defending: 96, physical: 92, composure: 96, auraTrait: { id: 'uruguayan-pharaoh', name: 'The Pharaoh Header', description: '+50% corner kick heading conversion in decisive league matches.', shortDesc: '+50% corner heading xG', rarity: 'Legendary' } },
      { id: 'atm-miranda', name: 'Miranda', clubYear: 'Atletico Madrid 2013-14', clubName: 'Atletico Madrid', year: '2013-14', country: 'Brazil', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 88, pace: 75, shooting: 45, passing: 68, dribbling: 66, defending: 90, physical: 87, composure: 88 },
      { id: 'atm-juanfran', name: 'Juanfran', clubYear: 'Atletico Madrid 2013-14', clubName: 'Atletico Madrid', year: '2013-14', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'RB', overall: 86, pace: 83, shooting: 55, passing: 79, dribbling: 80, defending: 86, physical: 81, composure: 85 },
      { id: 'atm-courtois', name: 'Thibaut Courtois', clubYear: 'Atletico Madrid 2013-14', clubName: 'Atletico Madrid', year: '2013-14', country: 'Belgium', league: 'La Liga', position: 'GK', specificPosition: 'GK', overall: 92, pace: 52, shooting: 20, passing: 72, dribbling: 45, defending: 94, physical: 84, composure: 94 }
    ]
  },
  {
    id: 'valencia-2003-04',
    clubName: 'Valencia',
    year: '2003-04',
    fullName: 'Valencia 2003-04',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#EE7500',
    accentColor: '#000000',
    primaryTactic: 'Low-Block Counter',
    players: [
      { id: 'val-mista', name: 'Mista', clubYear: 'Valencia 2003-04', clubName: 'Valencia', year: '2003-04', country: 'Spain', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 87, pace: 84, shooting: 88, passing: 74, dribbling: 80, defending: 42, physical: 80, composure: 87 },
      { id: 'val-oliveira', name: 'Ricardo Oliveira', clubYear: 'Valencia 2003-04', clubName: 'Valencia', year: '2003-04', country: 'Brazil', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 85, pace: 86, shooting: 85, passing: 70, dribbling: 82, defending: 36, physical: 78, composure: 84 },
      { id: 'val-vicente', name: 'Vicente Rodriguez', clubYear: 'Valencia 2003-04', clubName: 'Valencia', year: '2003-04', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'LM', overall: 90, pace: 92, shooting: 83, passing: 87, dribbling: 91, defending: 48, physical: 76, composure: 88 },
      { id: 'val-aimar', name: 'Pablo Aimar', clubYear: 'Valencia 2003-04', clubName: 'Valencia', year: '2003-04', country: 'Argentina', league: 'La Liga', position: 'MID', specificPosition: 'CAM', overall: 91, pace: 86, shooting: 82, passing: 92, dribbling: 93, defending: 40, physical: 68, composure: 92, auraTrait: { id: 'el-mago-aimar', name: 'El Payaso', description: '+25% dribble success; creates 2 breakthrough chances per match.', shortDesc: '+25% dribble success', rarity: 'Epic' } },
      { id: 'val-baraja', name: 'Ruben Baraja', clubYear: 'Valencia 2003-04', clubName: 'Valencia', year: '2003-04', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'CM', overall: 89, pace: 76, shooting: 86, passing: 88, dribbling: 80, defending: 85, physical: 85, composure: 90 },
      { id: 'val-albelda', name: 'David Albelda', clubYear: 'Valencia 2003-04', clubName: 'Valencia', year: '2003-04', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'CDM', overall: 88, pace: 73, shooting: 60, passing: 80, dribbling: 74, defending: 91, physical: 90, composure: 89 },
      { id: 'val-carboni', name: 'Amedeo Carboni', clubYear: 'Valencia 2003-04', clubName: 'Valencia', year: '2003-04', country: 'Italy', league: 'La Liga', position: 'DEF', specificPosition: 'LB', overall: 86, pace: 78, shooting: 48, passing: 76, dribbling: 74, defending: 88, physical: 82, composure: 92 },
      { id: 'val-ayala', name: 'Roberto Ayala', clubYear: 'Valencia 2003-04', clubName: 'Valencia', year: '2003-04', country: 'Argentina', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 92, pace: 80, shooting: 48, passing: 68, dribbling: 66, defending: 95, physical: 89, composure: 94, auraTrait: { id: 'el-raton', name: 'El Raton Aerialist', description: 'Wins 95% of aerial duels despite height; cuts opponent crosses by 30%.', shortDesc: '95% aerial win rate', rarity: 'Legendary' } },
      { id: 'val-marchena', name: 'Carlos Marchena', clubYear: 'Valencia 2003-04', clubName: 'Valencia', year: '2003-04', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 87, pace: 72, shooting: 52, passing: 74, dribbling: 68, defending: 89, physical: 87, composure: 88 },
      { id: 'val-torres', name: 'Curro Torres', clubYear: 'Valencia 2003-04', clubName: 'Valencia', year: '2003-04', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'RB', overall: 83, pace: 80, shooting: 45, passing: 74, dribbling: 74, defending: 84, physical: 80, composure: 81 },
      { id: 'val-canizares', name: 'Santiago Canizares', clubYear: 'Valencia 2003-04', clubName: 'Valencia', year: '2003-04', country: 'Spain', league: 'La Liga', position: 'GK', specificPosition: 'GK', overall: 91, pace: 56, shooting: 20, passing: 72, dribbling: 50, defending: 93, physical: 82, composure: 93 }
    ]
  },
  {
    id: 'depor-1999-00',
    clubName: 'Deportivo La Coruna',
    year: '1999-00',
    fullName: 'Deportivo La Coruna 1999-00',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#00529F',
    accentColor: '#FFFFFF',
    primaryTactic: 'Direct Vertical',
    players: [
      { id: 'dep-makaay', name: 'Roy Makaay', clubYear: 'Deportivo La Coruna 1999-00', clubName: 'Deportivo La Coruna', year: '1999-00', country: 'Netherlands', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 91, pace: 88, shooting: 93, passing: 75, dribbling: 82, defending: 38, physical: 82, composure: 94, auraTrait: { id: 'das-phantom', name: 'Das Phantom', description: '+35% first-time shot conversion inside the 18-yard box.', shortDesc: '+35% first-time shot xG', rarity: 'Epic' } },
      { id: 'dep-pauleta', name: 'Pedro Pauleta', clubYear: 'Deportivo La Coruna 1999-00', clubName: 'Deportivo La Coruna', year: '1999-00', country: 'Portugal', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 86, pace: 82, shooting: 88, passing: 70, dribbling: 80, defending: 36, physical: 80, composure: 87 },
      { id: 'dep-djalminha', name: 'Djalminha', clubYear: 'Deportivo La Coruna 1999-00', clubName: 'Deportivo La Coruna', year: '1999-00', country: 'Brazil', league: 'La Liga', position: 'MID', specificPosition: 'CAM', overall: 91, pace: 80, shooting: 87, passing: 94, dribbling: 95, defending: 38, physical: 72, composure: 94, auraTrait: { id: 'lambretta-magician', name: 'The Lambretta Master', description: 'Can perform trick passes that completely bypass defensive mid lines.', shortDesc: 'Bypasses mid blocks', rarity: 'Legendary' } },
      { id: 'dep-fran', name: 'Fran', clubYear: 'Deportivo La Coruna 1999-00', clubName: 'Deportivo La Coruna', year: '1999-00', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'LM', overall: 87, pace: 82, shooting: 80, passing: 88, dribbling: 87, defending: 55, physical: 74, composure: 89 },
      { id: 'dep-maurosilva', name: 'Mauro Silva', clubYear: 'Deportivo La Coruna 1999-00', clubName: 'Deportivo La Coruna', year: '1999-00', country: 'Brazil', league: 'La Liga', position: 'MID', specificPosition: 'CDM', overall: 91, pace: 72, shooting: 60, passing: 83, dribbling: 78, defending: 94, physical: 91, composure: 95 },
      { id: 'dep-victor', name: 'Victor Sanchez', clubYear: 'Deportivo La Coruna 1999-00', clubName: 'Deportivo La Coruna', year: '1999-00', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'RM', overall: 84, pace: 84, shooting: 78, passing: 82, dribbling: 83, defending: 56, physical: 76, composure: 82 },
      { id: 'dep-romero', name: 'Enrique Romero', clubYear: 'Deportivo La Coruna 1999-00', clubName: 'Deportivo La Coruna', year: '1999-00', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'LB', overall: 85, pace: 82, shooting: 54, passing: 76, dribbling: 77, defending: 85, physical: 80, composure: 84 },
      { id: 'dep-naybet', name: 'Noureddine Naybet', clubYear: 'Deportivo La Coruna 1999-00', clubName: 'Deportivo La Coruna', year: '1999-00', country: 'Morocco', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 89, pace: 74, shooting: 48, passing: 72, dribbling: 68, defending: 92, physical: 88, composure: 90 },
      { id: 'dep-donato', name: 'Donato', clubYear: 'Deportivo La Coruna 1999-00', clubName: 'Deportivo La Coruna', year: '1999-00', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 87, pace: 68, shooting: 74, passing: 78, dribbling: 70, defending: 89, physical: 90, composure: 93 },
      { id: 'dep-pablo', name: 'Manuel Pablo', clubYear: 'Deportivo La Coruna 1999-00', clubName: 'Deportivo La Coruna', year: '1999-00', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'RB', overall: 86, pace: 88, shooting: 50, passing: 78, dribbling: 80, defending: 85, physical: 82, composure: 84 },
      { id: 'dep-songoo', name: "Jacques Songo'o", clubYear: 'Deportivo La Coruna 1999-00', clubName: 'Deportivo La Coruna', year: '1999-00', country: 'Cameroon', league: 'La Liga', position: 'GK', specificPosition: 'GK', overall: 88, pace: 58, shooting: 20, passing: 70, dribbling: 48, defending: 90, physical: 84, composure: 88 }
    ]
  },
  {
    id: 'sevilla-2006-07',
    clubName: 'Sevilla',
    year: '2006-07',
    fullName: 'Sevilla 2006-07',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#D40028',
    accentColor: '#FFFFFF',
    primaryTactic: 'Direct Vertical',
    players: [
      { id: 'sev-kanoute', name: 'Frederic Kanoute', clubYear: 'Sevilla 2006-07', clubName: 'Sevilla', year: '2006-07', country: 'Mali', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 90, pace: 82, shooting: 92, passing: 78, dribbling: 84, defending: 44, physical: 90, composure: 94 },
      { id: 'sev-fabiano', name: 'Luis Fabiano', clubYear: 'Sevilla 2006-07', clubName: 'Sevilla', year: '2006-07', country: 'Brazil', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 89, pace: 86, shooting: 90, passing: 74, dribbling: 85, defending: 38, physical: 82, composure: 89 },
      { id: 'sev-navas', name: 'Jesus Navas', clubYear: 'Sevilla 2006-07', clubName: 'Sevilla', year: '2006-07', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'RM', overall: 88, pace: 94, shooting: 74, passing: 84, dribbling: 90, defending: 55, physical: 68, composure: 85 },
      { id: 'sev-adriano', name: 'Adriano Correia', clubYear: 'Sevilla 2006-07', clubName: 'Sevilla', year: '2006-07', country: 'Brazil', league: 'La Liga', position: 'MID', specificPosition: 'LM', overall: 85, pace: 88, shooting: 78, passing: 81, dribbling: 84, defending: 76, physical: 78, composure: 84 },
      { id: 'sev-poulsen', name: 'Christian Poulsen', clubYear: 'Sevilla 2006-07', clubName: 'Sevilla', year: '2006-07', country: 'Denmark', league: 'La Liga', position: 'MID', specificPosition: 'CDM', overall: 86, pace: 70, shooting: 64, passing: 80, dribbling: 74, defending: 89, physical: 89, composure: 85 },
      { id: 'sev-maresca', name: 'Enzo Maresca', clubYear: 'Sevilla 2006-07', clubName: 'Sevilla', year: '2006-07', country: 'Italy', league: 'La Liga', position: 'MID', specificPosition: 'CM', overall: 85, pace: 72, shooting: 80, passing: 86, dribbling: 82, defending: 76, physical: 78, composure: 86 },
      { id: 'sev-alves', name: 'Dani Alves', clubYear: 'Sevilla 2006-07', clubName: 'Sevilla', year: '2006-07', country: 'Brazil', league: 'La Liga', position: 'DEF', specificPosition: 'RB', overall: 91, pace: 92, shooting: 75, passing: 86, dribbling: 88, defending: 83, physical: 82, composure: 88, auraTrait: { id: 'rampage-fullback', name: 'The Sanchez Pizjuan Engine', description: '+30% offensive output on right flank counter-attacks.', shortDesc: '+30% flank counter xG', rarity: 'Epic' } },
      { id: 'sev-navarro', name: 'Javi Navarro', clubYear: 'Sevilla 2006-07', clubName: 'Sevilla', year: '2006-07', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 87, pace: 70, shooting: 40, passing: 66, dribbling: 60, defending: 91, physical: 92, composure: 88 },
      { id: 'sev-escude', name: 'Julien Escude', clubYear: 'Sevilla 2006-07', clubName: 'Sevilla', year: '2006-07', country: 'France', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 85, pace: 74, shooting: 48, passing: 72, dribbling: 66, defending: 87, physical: 84, composure: 84 },
      { id: 'sev-dragutinovic', name: 'Ivica Dragutinovic', clubYear: 'Sevilla 2006-07', clubName: 'Sevilla', year: '2006-07', country: 'Serbia', league: 'La Liga', position: 'DEF', specificPosition: 'LB', overall: 84, pace: 78, shooting: 55, passing: 75, dribbling: 72, defending: 85, physical: 84, composure: 82 },
      { id: 'sev-palop', name: 'Andres Palop', clubYear: 'Sevilla 2006-07', clubName: 'Sevilla', year: '2006-07', country: 'Spain', league: 'La Liga', position: 'GK', specificPosition: 'GK', overall: 89, pace: 54, shooting: 30, passing: 75, dribbling: 48, defending: 91, physical: 84, composure: 94 }
    ]
  },
  {
    id: 'villarreal-2005-06',
    clubName: 'Villarreal',
    year: '2005-06',
    fullName: 'Villarreal 2005-06',
    type: 'club',
    league: 'La Liga',
    countryCode: 'ESP',
    badgeColor: '#FFE000',
    accentColor: '#00529F',
    primaryTactic: 'Tiki-Taka',
    players: [
      { id: 'vil-forlan', name: 'Diego Forlan', clubYear: 'Villarreal 2005-06', clubName: 'Villarreal', year: '2005-06', country: 'Uruguay', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 90, pace: 86, shooting: 93, passing: 78, dribbling: 84, defending: 40, physical: 82, composure: 92 },
      { id: 'vil-josemari', name: 'Jose Mari', clubYear: 'Villarreal 2005-06', clubName: 'Villarreal', year: '2005-06', country: 'Spain', league: 'La Liga', position: 'FWD', specificPosition: 'ST', overall: 83, pace: 84, shooting: 82, passing: 74, dribbling: 80, defending: 42, physical: 78, composure: 82 },
      { id: 'vil-riquelme', name: 'Juan Roman Riquelme', clubYear: 'Villarreal 2005-06', clubName: 'Villarreal', year: '2005-06', country: 'Argentina', league: 'La Liga', position: 'MID', specificPosition: 'CAM', overall: 94, pace: 68, shooting: 88, passing: 98, dribbling: 94, defending: 42, physical: 78, composure: 97, auraTrait: { id: 'the-last-enganche', name: 'The Last Enganche', description: 'Generates +0.45 xA per game; opposition pressing cannot dispossess him in final third.', shortDesc: '+0.45 xA, press immune', rarity: 'Legendary' } },
      { id: 'vil-senna', name: 'Marcos Senna', clubYear: 'Villarreal 2005-06', clubName: 'Villarreal', year: '2005-06', country: 'Spain', league: 'La Liga', position: 'MID', specificPosition: 'CDM', overall: 89, pace: 74, shooting: 82, passing: 88, dribbling: 80, defending: 90, physical: 86, composure: 92 },
      { id: 'vil-sorin', name: 'Juan Pablo Sorin', clubYear: 'Villarreal 2005-06', clubName: 'Villarreal', year: '2005-06', country: 'Argentina', league: 'La Liga', position: 'MID', specificPosition: 'LM', overall: 86, pace: 82, shooting: 76, passing: 81, dribbling: 82, defending: 82, physical: 84, composure: 88 },
      { id: 'vil-tacchinardi', name: 'Alessio Tacchinardi', clubYear: 'Villarreal 2005-06', clubName: 'Villarreal', year: '2005-06', country: 'Italy', league: 'La Liga', position: 'MID', specificPosition: 'CM', overall: 84, pace: 68, shooting: 72, passing: 81, dribbling: 74, defending: 85, physical: 85, composure: 85 },
      { id: 'vil-arruabarrena', name: 'Rodolfo Arruabarrena', clubYear: 'Villarreal 2005-06', clubName: 'Villarreal', year: '2005-06', country: 'Argentina', league: 'La Liga', position: 'DEF', specificPosition: 'LB', overall: 85, pace: 78, shooting: 60, passing: 78, dribbling: 76, defending: 85, physical: 80, composure: 86 },
      { id: 'vil-gonzalo', name: 'Gonzalo Rodriguez', clubYear: 'Villarreal 2005-06', clubName: 'Villarreal', year: '2005-06', country: 'Argentina', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 86, pace: 74, shooting: 44, passing: 70, dribbling: 66, defending: 88, physical: 84, composure: 85 },
      { id: 'vil-alvarez', name: 'Quique Alvarez', clubYear: 'Villarreal 2005-06', clubName: 'Villarreal', year: '2005-06', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'CB', overall: 83, pace: 70, shooting: 42, passing: 68, dribbling: 62, defending: 85, physical: 82, composure: 82 },
      { id: 'vil-venta', name: 'Javi Venta', clubYear: 'Villarreal 2005-06', clubName: 'Villarreal', year: '2005-06', country: 'Spain', league: 'La Liga', position: 'DEF', specificPosition: 'RB', overall: 83, pace: 81, shooting: 50, passing: 75, dribbling: 74, defending: 83, physical: 80, composure: 81 },
      { id: 'vil-barbosa', name: 'Mariano Barbosa', clubYear: 'Villarreal 2005-06', clubName: 'Villarreal', year: '2005-06', country: 'Argentina', league: 'La Liga', position: 'GK', specificPosition: 'GK', overall: 85, pace: 52, shooting: 20, passing: 70, dribbling: 45, defending: 87, physical: 78, composure: 84 }
    ]
  }
];

fs.writeFileSync('temp_squads.json', JSON.stringify(squads, null, 2));
console.log('Generated squads chunk');
`;

fs.writeFileSync(scriptPath, code);
