import { DynastyStaffMember } from '../types/football';

export const AVAILABLE_STAFF_POOL: DynastyStaffMember[] = [
  // Assistant Managers
  {
    id: 'staff-pep-lijnders',
    name: 'Pep Lijnders',
    role: 'Assistant Manager',
    level: 3,
    salaryM: 6,
    perkDescription: 'Tactical Innovator: +20% success probability on all live manager match decisions.',
  },
  {
    id: 'staff-zidane',
    name: 'Zinedine Zidane',
    role: 'Assistant Manager',
    level: 3,
    salaryM: 9,
    perkDescription: 'Champions Whisperer: +25% clutch goal likelihood in knockout finals and derbies.',
  },
  {
    id: 'staff-queiroz',
    name: 'Carlos Queiroz',
    role: 'Assistant Manager',
    level: 2,
    salaryM: 4,
    perkDescription: 'Defensive Mastermind: +15% Low-Block and Cautious solidity against elite opposition.',
  },
  {
    id: 'staff-flick',
    name: 'Hansi Flick',
    role: 'Assistant Manager',
    level: 3,
    salaryM: 8,
    perkDescription: 'Gegenpress Relentlessness: Opponents concede 25% more turnovers in final third.',
  },

  // Chief Scouts
  {
    id: 'staff-de-visser',
    name: 'Piet de Visser',
    role: 'Chief Scout',
    level: 2,
    salaryM: 3,
    perkDescription: 'Generational Eye: 25% discount on all Youth Academy wonderkid signings.',
  },
  {
    id: 'staff-edwards',
    name: 'Michael Edwards',
    role: 'Chief Scout',
    level: 3,
    salaryM: 6,
    perkDescription: 'Moneyball Mogul: Player sales fetch 20% higher transfer fees on the open market.',
  },
  {
    id: 'staff-txiki',
    name: 'Txiki Begiristain',
    role: 'Chief Scout',
    level: 3,
    salaryM: 7,
    perkDescription: 'Elite Network: 15% discount on world-class superstar transfer market listings.',
  },

  // Head Physios
  {
    id: 'staff-muller',
    name: 'Dr. Müller-Wohlfahrt',
    role: 'Head Physio',
    level: 3,
    salaryM: 5,
    perkDescription: 'Legend Healer: Extends veteran career longevity, postponing retirement up to age 39.',
  },
  {
    id: 'staff-carneiro',
    name: 'Eva Carneiro',
    role: 'Head Physio',
    level: 2,
    salaryM: 4,
    perkDescription: 'Rapid Recovery: Reduces in-match stamina decay by 25%, maintaining late-game sharpness.',
  },
];
