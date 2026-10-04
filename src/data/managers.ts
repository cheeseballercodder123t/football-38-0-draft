import { Manager } from '../types/football';

export const MANAGERS: Manager[] = [
  {
    id: 'mgr-ferguson',
    name: 'Sir Alex Ferguson',
    nationality: 'Scotland',
    preferredFormation: '4-4-2',
    tacticalStyle: 'Direct Vertical',
    perkName: 'Fergie Time',
    perkDescription: '+0.40 xG during 85-95 minutes if drawing or losing.'
  },
  {
    id: 'mgr-guardiola',
    name: 'Pep Guardiola',
    nationality: 'Spain',
    preferredFormation: '4-3-3',
    tacticalStyle: 'Tiki-Taka',
    perkName: 'Juego de Posicion',
    perkDescription: '+15% midfield possession control and +10% passing accuracy.'
  },
  {
    id: 'mgr-mourinho',
    name: 'Jose Mourinho',
    nationality: 'Portugal',
    preferredFormation: '4-2-3-1',
    tacticalStyle: 'Low-Block Counter',
    perkName: 'The Special Low-Block',
    perkDescription: '-40% opponent xG when leading after 60 minutes, +25% counter transition speed.'
  },
  {
    id: 'mgr-klopp',
    name: 'Jurgen Klopp',
    nationality: 'Germany',
    preferredFormation: '4-3-3',
    tacticalStyle: 'Gegenpress',
    perkName: 'Heavy Metal Football',
    perkDescription: '+20% press turnover rate in opponent third; +25% counter-press xG.'
  },
  {
    id: 'mgr-ancelotti',
    name: 'Carlo Ancelotti',
    nationality: 'Italy',
    preferredFormation: '4-3-3',
    tacticalStyle: 'Direct Vertical',
    perkName: 'The UCL Whisperer',
    perkDescription: '+15% composure and finishing boost across all knockout round matches.'
  },
  {
    id: 'mgr-wenger',
    name: 'Arsene Wenger',
    nationality: 'France',
    preferredFormation: '4-4-2',
    tacticalStyle: 'Direct Vertical',
    perkName: 'Wengerball',
    perkDescription: '+20% team xA on one-touch passing sequences; unlocks Invincible chemistry.'
  },
  {
    id: 'mgr-zidane',
    name: 'Zinedine Zidane',
    nationality: 'France',
    preferredFormation: '4-3-3',
    tacticalStyle: 'Direct Vertical',
    perkName: 'Three-Peat Magic',
    perkDescription: '+35% penalty conversion and +25% clutch deflection goals in 85+ minutes.'
  },
  {
    id: 'mgr-simeone',
    name: 'Diego Simeone',
    nationality: 'Argentina',
    preferredFormation: '4-4-2',
    tacticalStyle: 'Low-Block Counter',
    perkName: 'Cholismo Fortress',
    perkDescription: 'Cuts opponent box shots by 35% and increases tackle aggression without card spikes.'
  },
  {
    id: 'mgr-bielsa',
    name: 'Marcelo Bielsa',
    nationality: 'Argentina',
    preferredFormation: '4-3-3',
    tacticalStyle: 'Gegenpress',
    perkName: 'El Loco Press',
    perkDescription: 'Man-to-man suffocating press; cuts opponent passing accuracy by 14%.'
  },
  {
    id: 'mgr-conte',
    name: 'Antonio Conte',
    nationality: 'Italy',
    preferredFormation: '3-5-2',
    tacticalStyle: 'Low-Block Counter',
    perkName: 'Scudetto Automations',
    perkDescription: 'Wing-backs gain +25% crossing assist accuracy; defensive line gains +12 tackling.'
  },
  {
    id: 'mgr-delbosque',
    name: 'Vicente del Bosque',
    nationality: 'Spain',
    preferredFormation: '4-2-3-1',
    tacticalStyle: 'Tiki-Taka',
    perkName: 'Quiet Harmony',
    perkDescription: 'Squad chemistry locked at 100%; eliminates dressing room tactical friction.'
  },
  {
    id: 'mgr-capello',
    name: 'Fabio Capello',
    nationality: 'Italy',
    preferredFormation: '4-4-2',
    tacticalStyle: 'Low-Block Counter',
    perkName: 'The Iron Wall',
    perkDescription: 'Suppresses opponent shots on target to fewer than 3 per game.'
  }
];
