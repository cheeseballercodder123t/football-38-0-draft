import { SquadData, GameMode } from '../types/football';
import { getEligibleSquadsForMode, getSquadById, SQUAD_CATALOG } from './squadLoader';

// Export all official authentic squads loaded via the modular loader
export const SQUADS: SquadData[] = getEligibleSquadsForMode('invincible');

export function getEligibleSquads(mode: GameMode, _squads?: SquadData[]): SquadData[] {
  return getEligibleSquadsForMode(mode);
}

export { getSquadById, SQUAD_CATALOG };
