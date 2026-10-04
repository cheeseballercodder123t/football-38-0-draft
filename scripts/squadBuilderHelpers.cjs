const fs = require('fs');
const path = require('path');

// Helper to create a player
function p(id, name, clubYear, clubName, year, country, league, pos, spec, ovr, pac, sho, pas, dri, def, phy, com, aura) {
  return {
    id,
    name,
    clubYear,
    clubName,
    year,
    country,
    league,
    position: pos,
    specificPosition: spec,
    overall: ovr,
    pace: pac,
    shooting: sho,
    passing: pas,
    dribbling: dri,
    defending: def,
    physical: phy,
    composure: com,
    auraTrait: aura || undefined
  };
}

// Helper to create a squad
function makeSquad(id, clubName, year, fullName, league, countryCode, badgeColor, accentColor, primaryTactic, tier, players) {
  const type = countryCode.length === 3 && (league === 'International' || league === 'Other' && !fullName.includes('(')) ? 'country' : (league === 'International' ? 'country' : 'club');
  return {
    id,
    clubName,
    year,
    fullName,
    type,
    league,
    countryCode,
    badgeColor,
    accentColor,
    primaryTactic,
    tier,
    players: players.map((pl, idx) => ({
      ...pl,
      id: pl.id || `${id}-p${idx + 1}`,
      clubYear: pl.clubYear || fullName,
      clubName: pl.clubName || clubName,
      year: pl.year || year,
      league: pl.league || league
    }))
  };
}

module.exports = { p, makeSquad };
