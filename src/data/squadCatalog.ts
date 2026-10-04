import catalogJson from './squadCatalog.json';

export interface SquadSummary {
  id: string;
  clubName: string;
  fullName: string;
  year: string;
  league: string;
  tier: 'elite' | 'high' | 'mid' | 'low';
  countryCode: string;
  badgeColor: string;
  accentColor: string;
  primaryTactic: string;
  type: 'club' | 'country';
  starPlayer: string;
  topStars: string[];
  avgOverall: number;
  chunkId: string;
}

export const SQUAD_CATALOG: SquadSummary[] = catalogJson as SquadSummary[];
