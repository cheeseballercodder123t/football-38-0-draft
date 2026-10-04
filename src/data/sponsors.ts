import { CommercialSponsor, PreSeasonTour } from '../types/football';

export const SPONSORS_POOL: CommercialSponsor[] = [
  {
    id: 'sp-emirates',
    name: 'Fly Emirates Global',
    tier: 'Global Tier 1',
    basePayoutM: 38,
    bonusGoal: 'Champions League Silverware',
    bonusPayoutM: 18,
    signed: false,
  },
  {
    id: 'sp-spotify',
    name: 'Spotify Soundstage',
    tier: 'Elite Corporate',
    basePayoutM: 28,
    bonusGoal: 'Youth Academy Revolution (Draft 2+ wonderkids)',
    bonusPayoutM: 12,
    signed: false,
  },
  {
    id: 'sp-redbull',
    name: 'Red Bull Athletic Energy',
    tier: 'Venture Disruptor',
    basePayoutM: 52,
    bonusGoal: 'Win Any Domestic or European Trophy',
    bonusPayoutM: 15,
    penaltyCondition: 'Finish Season Trophy-less (-$15M Clawback)',
    penaltyM: 15,
    signed: false,
  },
  {
    id: 'sp-rolex',
    name: 'Rolex Precision Time',
    tier: 'Global Tier 1',
    basePayoutM: 32,
    bonusGoal: 'League Title & Invincible Defense',
    bonusPayoutM: 14,
    signed: false,
  },
  {
    id: 'sp-qatar',
    name: 'Qatar Airways Luxury',
    tier: 'Global Tier 1',
    basePayoutM: 42,
    bonusGoal: 'Reach Champions League Final',
    bonusPayoutM: 12,
    signed: false,
  },
];

export const PRE_SEASON_TOURS: PreSeasonTour[] = [
  {
    id: 'tour-asia',
    destination: 'Seoul & Tokyo East Asia Tour',
    revenueM: 18,
    squadSharpnessBonus: 2,
    staminaConditioning: 5,
  },
  {
    id: 'tour-usa',
    destination: 'USA Coast-to-Coast Stadium Series',
    revenueM: 22,
    squadSharpnessBonus: 3,
    staminaConditioning: 4,
  },
  {
    id: 'tour-alps',
    destination: 'Swiss Alps High-Altitude Training Camp',
    revenueM: 10,
    squadSharpnessBonus: 4,
    staminaConditioning: 8,
  },
];
