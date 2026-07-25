// Photos officielles des monoplaces, extraites de https://www.formula1.com/en/teams
// (CDN media.formula1.com). Verifie manuellement (HTTP 200) pour chaque ecurie le 2026-07-25.
const BASE =
  "https://media.formula1.com/image/upload/c_lfill,h_224/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026";

function carUrl(team: string) {
  return `${BASE}/${team}/2026${team}carright.webp`;
}

// Cle = constructorId Jolpica
const TEAM_CAR_PHOTOS: Record<string, string> = {
  mercedes: carUrl("mercedes"),
  ferrari: carUrl("ferrari"),
  mclaren: carUrl("mclaren"),
  red_bull: carUrl("redbullracing"),
  alpine: carUrl("alpine"),
  rb: carUrl("racingbulls"),
  haas: carUrl("haasf1team"),
  williams: carUrl("williams"),
  audi: carUrl("audi"),
  aston_martin: carUrl("astonmartin"),
  cadillac: carUrl("cadillac"),
};

export function getTeamCarPhoto(constructorId: string): string | undefined {
  return TEAM_CAR_PHOTOS[constructorId];
}
