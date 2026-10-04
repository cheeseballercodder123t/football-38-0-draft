import { Formation, FormationName } from '../types/football';

export const FORMATIONS: Record<FormationName, Formation> = {
  '4-3-3': {
    name: '4-3-3',
    tacticalSynergy: 'Tiki-Taka',
    description: 'Classic high-tempo system with balanced wing play, single pivot, and dynamic inside forwards.',
    slots: [
      { id: 'gk', label: 'GK', category: 'GK', gridX: 50, gridY: 8 },
      { id: 'lb', label: 'LB', category: 'DEF', gridX: 15, gridY: 26 },
      { id: 'cb1', label: 'CB', category: 'DEF', gridX: 38, gridY: 22 },
      { id: 'cb2', label: 'CB', category: 'DEF', gridX: 62, gridY: 22 },
      { id: 'rb', label: 'RB', category: 'DEF', gridX: 85, gridY: 26 },
      { id: 'cdm', label: 'CDM', category: 'MID', gridX: 50, gridY: 42 },
      { id: 'cm1', label: 'CM', category: 'MID', gridX: 30, gridY: 56 },
      { id: 'cm2', label: 'CM', category: 'MID', gridX: 70, gridY: 56 },
      { id: 'lw', label: 'LW', category: 'FWD', gridX: 18, gridY: 78 },
      { id: 'st', label: 'ST', category: 'FWD', gridX: 50, gridY: 86 },
      { id: 'rw', label: 'RW', category: 'FWD', gridX: 82, gridY: 78 },
    ]
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    tacticalSynergy: 'Direct Vertical',
    description: 'Double pivot solidity with an attacking midfielder playmaker supporting a lone target man.',
    slots: [
      { id: 'gk', label: 'GK', category: 'GK', gridX: 50, gridY: 8 },
      { id: 'lb', label: 'LB', category: 'DEF', gridX: 15, gridY: 26 },
      { id: 'cb1', label: 'CB', category: 'DEF', gridX: 38, gridY: 22 },
      { id: 'cb2', label: 'CB', category: 'DEF', gridX: 62, gridY: 22 },
      { id: 'rb', label: 'RB', category: 'DEF', gridX: 85, gridY: 26 },
      { id: 'cdm1', label: 'CDM', category: 'MID', gridX: 35, gridY: 42 },
      { id: 'cdm2', label: 'CDM', category: 'MID', gridX: 65, gridY: 42 },
      { id: 'lm', label: 'LM', category: 'MID', gridX: 18, gridY: 64 },
      { id: 'cam', label: 'CAM', category: 'MID', gridX: 50, gridY: 66 },
      { id: 'rm', label: 'RM', category: 'MID', gridX: 82, gridY: 64 },
      { id: 'st', label: 'ST', category: 'FWD', gridX: 50, gridY: 88 },
    ]
  },
  '3-5-2': {
    name: '3-5-2',
    tacticalSynergy: 'Low-Block Counter',
    description: 'Overloads the midfield engine, features twin strikers, and relies on explosive wing-backs.',
    slots: [
      { id: 'gk', label: 'GK', category: 'GK', gridX: 50, gridY: 8 },
      { id: 'cb1', label: 'CB', category: 'DEF', gridX: 25, gridY: 23 },
      { id: 'cb2', label: 'CB', category: 'DEF', gridX: 50, gridY: 20 },
      { id: 'cb3', label: 'CB', category: 'DEF', gridX: 75, gridY: 23 },
      { id: 'lwb', label: 'LWB', category: 'DEF', gridX: 12, gridY: 50 },
      { id: 'cm1', label: 'CM', category: 'MID', gridX: 35, gridY: 48 },
      { id: 'cam', label: 'CAM', category: 'MID', gridX: 50, gridY: 63 },
      { id: 'cm2', label: 'CM', category: 'MID', gridX: 65, gridY: 48 },
      { id: 'rwb', label: 'RWB', category: 'DEF', gridX: 88, gridY: 50 },
      { id: 'st1', label: 'ST', category: 'FWD', gridX: 34, gridY: 85 },
      { id: 'st2', label: 'ST', category: 'FWD', gridX: 66, gridY: 85 },
    ]
  },
  '4-4-2': {
    name: '4-4-2',
    tacticalSynergy: 'Direct Vertical',
    description: 'The classic British shape: solid back four, wide midfielders whipping crosses, and striking partnerships.',
    slots: [
      { id: 'gk', label: 'GK', category: 'GK', gridX: 50, gridY: 8 },
      { id: 'lb', label: 'LB', category: 'DEF', gridX: 15, gridY: 25 },
      { id: 'cb1', label: 'CB', category: 'DEF', gridX: 38, gridY: 22 },
      { id: 'cb2', label: 'CB', category: 'DEF', gridX: 62, gridY: 22 },
      { id: 'rb', label: 'RB', category: 'DEF', gridX: 85, gridY: 25 },
      { id: 'lm', label: 'LM', category: 'MID', gridX: 16, gridY: 54 },
      { id: 'cm1', label: 'CM', category: 'MID', gridX: 38, gridY: 52 },
      { id: 'cm2', label: 'CM', category: 'MID', gridX: 62, gridY: 52 },
      { id: 'rm', label: 'RM', category: 'MID', gridX: 84, gridY: 54 },
      { id: 'st1', label: 'ST', category: 'FWD', gridX: 36, gridY: 84 },
      { id: 'st2', label: 'ST', category: 'FWD', gridX: 64, gridY: 84 },
    ]
  },
  '5-3-2': {
    name: '5-3-2',
    tacticalSynergy: 'Low-Block Counter',
    description: 'Impenetrable defensive low-block designed to choke elite attacks and strike on lethal counters.',
    slots: [
      { id: 'gk', label: 'GK', category: 'GK', gridX: 50, gridY: 8 },
      { id: 'lwb', label: 'LWB', category: 'DEF', gridX: 12, gridY: 34 },
      { id: 'cb1', label: 'CB', category: 'DEF', gridX: 30, gridY: 23 },
      { id: 'cb2', label: 'CB', category: 'DEF', gridX: 50, gridY: 20 },
      { id: 'cb3', label: 'CB', category: 'DEF', gridX: 70, gridY: 23 },
      { id: 'rwb', label: 'RWB', category: 'DEF', gridX: 88, gridY: 34 },
      { id: 'cm1', label: 'CM', category: 'MID', gridX: 30, gridY: 55 },
      { id: 'cm2', label: 'CM', category: 'MID', gridX: 50, gridY: 52 },
      { id: 'cm3', label: 'CM', category: 'MID', gridX: 70, gridY: 55 },
      { id: 'st1', label: 'ST', category: 'FWD', gridX: 36, gridY: 84 },
      { id: 'st2', label: 'ST', category: 'FWD', gridX: 64, gridY: 84 },
    ]
  }
};
