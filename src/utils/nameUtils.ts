/**
 * Smart football player name formatting utility.
 * Formats full names into broadcast/pitch friendly short names
 * respecting compound surnames, patronymics, and mononyms.
 */

const PREFIXES = new Set([
  'de', 'van', 'di', 'da', 'do', 'dos', 'das', 'del', 'della', 'der', 'den',
  'le', 'la', 'al', 'el', 'san', 'santa', 'von', 'st.'
]);

const SUFFIXES = new Set([
  'júnior', 'junior', 'jr.', 'jr', 'ii', 'iii', 'iv', 'filho', 'neto', 'sobrinho'
]);

export function getShortDisplayName(fullName: string): string {
  if (!fullName) return '';
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length <= 1) {
    return trimmed;
  }

  // Check for suffixes like Jr, Júnior, III
  const lastPart = parts[parts.length - 1];
  const lowerLast = lastPart.toLowerCase();
  if (SUFFIXES.has(lowerLast) && parts.length >= 2) {
    const parentName = parts[parts.length - 2];
    const cleanSuffix = lowerLast.startsWith('jr') || lowerLast.startsWith('jún') ? 'Jr' : lastPart;
    // Check if parent also has a prefix like "de"
    if (parts.length >= 3 && PREFIXES.has(parts[parts.length - 3].toLowerCase())) {
      return `${parts[parts.length - 3]} ${parentName} ${cleanSuffix}`;
    }
    return `${parentName} ${cleanSuffix}`;
  }

  // Check for 3-part compound prefixes like "van de Ven", "van der Sar"
  if (parts.length >= 3) {
    const p1 = parts[parts.length - 3].toLowerCase();
    const p2 = parts[parts.length - 2].toLowerCase();
    if (PREFIXES.has(p1) && (PREFIXES.has(p2) || ['der', 'den', 'de', 'la'].includes(p2))) {
      return `${parts[parts.length - 3]} ${parts[parts.length - 2]} ${parts[parts.length - 1]}`;
    }
  }

  // Check for 2-part compound prefixes like "De Bruyne", "Van Dijk", "De Jong", "Di Maria", "Del Piero", "De Gea"
  if (parts.length >= 2) {
    const pPrev = parts[parts.length - 2].toLowerCase();
    if (PREFIXES.has(pPrev)) {
      return `${parts[parts.length - 2]} ${parts[parts.length - 1]}`;
    }
  }

  // Default to standard surname
  return parts[parts.length - 1];
}
