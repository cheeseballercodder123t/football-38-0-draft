import { SquadData, GameMode } from '../types/football';
import { SQUAD_CATALOG, SquadSummary } from './squadCatalog';

// Statically import all chunks for zero-latency instant offline mobile access
import epl_1990s from './chunks/epl_1990s.json';
import epl_2000s from './chunks/epl_2000s.json';
import epl_2010s from './chunks/epl_2010s.json';
import epl_2020s from './chunks/epl_2020s.json';
import laliga_1990s from './chunks/laliga_1990s.json';
import laliga_2000s from './chunks/laliga_2000s.json';
import laliga_2010s from './chunks/laliga_2010s.json';
import laliga_2020s from './chunks/laliga_2020s.json';
import seriea_1990s from './chunks/seriea_1990s.json';
import seriea_2000s from './chunks/seriea_2000s.json';
import seriea_2010s from './chunks/seriea_2010s.json';
import seriea_2020s from './chunks/seriea_2020s.json';
import bundesliga_1990s from './chunks/bundesliga_1990s.json';
import bundesliga_2000s from './chunks/bundesliga_2000s.json';
import bundesliga_2010s from './chunks/bundesliga_2010s.json';
import bundesliga_2020s from './chunks/bundesliga_2020s.json';
import international_and_special from './chunks/international_and_special.json';

const CHUNK_CACHE: Record<string, SquadData[]> = {
  epl_1990s: epl_1990s as unknown as SquadData[],
  epl_2000s: epl_2000s as unknown as SquadData[],
  epl_2010s: epl_2010s as unknown as SquadData[],
  epl_2020s: epl_2020s as unknown as SquadData[],
  laliga_1990s: laliga_1990s as unknown as SquadData[],
  laliga_2000s: laliga_2000s as unknown as SquadData[],
  laliga_2010s: laliga_2010s as unknown as SquadData[],
  laliga_2020s: laliga_2020s as unknown as SquadData[],
  seriea_1990s: seriea_1990s as unknown as SquadData[],
  seriea_2000s: seriea_2000s as unknown as SquadData[],
  seriea_2010s: seriea_2010s as unknown as SquadData[],
  seriea_2020s: seriea_2020s as unknown as SquadData[],
  bundesliga_1990s: bundesliga_1990s as unknown as SquadData[],
  bundesliga_2000s: bundesliga_2000s as unknown as SquadData[],
  bundesliga_2010s: bundesliga_2010s as unknown as SquadData[],
  bundesliga_2020s: bundesliga_2020s as unknown as SquadData[],
  international_and_special: international_and_special as unknown as SquadData[]
};

// Global index for O(1) retrieval
const SQUAD_MAP: Map<string, SquadData> = new Map();
Object.values(CHUNK_CACHE).forEach(chunk => {
  chunk.forEach(squad => {
    SQUAD_MAP.set(squad.id, squad);
  });
});

export function getSquadById(id: string): SquadData | undefined {
  return SQUAD_MAP.get(id);
}

export function getAllSquadSummaries(mode: GameMode): SquadSummary[] {
  if (mode === 'world_cup') {
    return SQUAD_CATALOG.filter(s => s.type === 'country');
  }
  if (mode === 'champions_league') {
    return SQUAD_CATALOG.filter(s => s.type === 'club' && (s.tier === 'elite' || s.tier === 'high' || s.league === 'Other'));
  }
  if (mode === 'premier_league') {
    return SQUAD_CATALOG.filter(s => s.league === 'Premier League');
  }
  if (mode === 'la_liga') {
    return SQUAD_CATALOG.filter(s => s.league === 'La Liga');
  }
  if (mode === 'serie_a') {
    return SQUAD_CATALOG.filter(s => s.league === 'Serie A');
  }
  if (mode === 'bundesliga') {
    return SQUAD_CATALOG.filter(s => s.league === 'Bundesliga');
  }
  return SQUAD_CATALOG.filter(s => s.type === 'club');
}

export function getEligibleSquadsForMode(mode: GameMode): SquadData[] {
  const summaries = getAllSquadSummaries(mode);
  const result: SquadData[] = [];
  for (const sum of summaries) {
    const sq = SQUAD_MAP.get(sum.id);
    if (sq) result.push(sq);
  }
  return result;
}

export { SQUAD_CATALOG };
