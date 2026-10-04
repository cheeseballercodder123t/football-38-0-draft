import { RoguelikePerk } from '../types/football';

export const ROGUELIKE_PERKS_POOL: RoguelikePerk[] = [
  {
    id: 'perk-gegenpress-frenzy',
    name: 'Gegenpress Frenzy',
    desc: 'Intense high-energy press: Squad gets +4 Pace and reduces opponent passing rhythm.',
    iconName: 'Zap',
    rarity: 'Legendary',
    effectType: 'att_boost',
    value: 4,
  },
  {
    id: 'perk-catenaccio-vault',
    name: 'Catenaccio Vault',
    desc: 'Impenetrable Italian backline: All defenders gain +5 Defending and goalkeeper save bonus.',
    iconName: 'Shield',
    rarity: 'Rare',
    effectType: 'def_boost',
    value: 5,
  },
  {
    id: 'perk-samba-flair',
    name: 'Joga Bonito Samba',
    desc: 'Unpredictable dribbling: Attackers and Wingers gain +5 Dribbling and higher 1v1 success.',
    iconName: 'Flame',
    rarity: 'Rare',
    effectType: 'att_boost',
    value: 5,
  },
  {
    id: 'perk-clinical-finisher',
    name: 'Clinical Fox in the Box',
    desc: 'Deadly finishing in front of goal: Shooting boosted by +5 across all forwards.',
    iconName: 'Target',
    rarity: 'Legendary',
    effectType: 'att_boost',
    value: 5,
  },
  {
    id: 'perk-metronome-pulse',
    name: 'Metronome Maestro',
    desc: 'Midfield dictates tempo: +5 Passing and +10% overall possession dominance.',
    iconName: 'Activity',
    rarity: 'Common',
    effectType: 'mid_boost',
    value: 5,
  },
  {
    id: 'perk-super-sub-dynamo',
    name: 'Impact Super-Sub',
    desc: 'Bench weapons: Substitutes enter the pitch with an additional +4 OVR surge.',
    iconName: 'Sparkles',
    rarity: 'Rare',
    effectType: 'sub_boost',
    value: 4,
  },
  {
    id: 'perk-scouting-patron',
    name: 'Billionaire Scout Network',
    desc: 'Fresh financial injection: Instantly awards +3 Scout Tokens for club drafting.',
    iconName: 'Coins',
    rarity: 'Common',
    effectType: 'token_boost',
    value: 3,
  },
  {
    id: 'perk-aura-amplifier',
    name: 'Legendary Aura Surge',
    desc: 'Presence of titans: All club and iconic player aura traits trigger with 30% greater power.',
    iconName: 'Award',
    rarity: 'Legendary',
    effectType: 'aura_boost',
    value: 30,
  },
];

export function getRandomRoguelikePerks(count = 3): RoguelikePerk[] {
  const shuffled = [...ROGUELIKE_PERKS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
