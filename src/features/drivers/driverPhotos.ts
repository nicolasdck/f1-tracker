// Photos officielles pilotes, extraites de https://www.formula1.com/en/drivers
// (CDN media.formula1.com, format "silhouette detouree" utilise sur le site officiel).
// Verifie manuellement (HTTP 200) pour chaque pilote le 2026-07-25.
const BASE =
  "https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026";

function photoUrl(team: string, code: string) {
  return `${BASE}/${team}/${code}/2026${team}${code}right.webp`;
}

// Cle = driverId Jolpica
const DRIVER_PHOTOS: Record<string, string> = {
  antonelli: photoUrl("mercedes", "andant01"),
  hamilton: photoUrl("ferrari", "lewham01"),
  russell: photoUrl("mercedes", "georus01"),
  leclerc: photoUrl("ferrari", "chalec01"),
  norris: photoUrl("mclaren", "lannor01"),
  piastri: photoUrl("mclaren", "oscpia01"),
  max_verstappen: photoUrl("redbullracing", "maxver01"),
  hadjar: photoUrl("redbullracing", "isahad01"),
  gasly: photoUrl("alpine", "piegas01"),
  lawson: photoUrl("racingbulls", "lialaw01"),
  arvid_lindblad: photoUrl("racingbulls", "arvlin01"),
  colapinto: photoUrl("alpine", "fracol01"),
  bearman: photoUrl("haasf1team", "olibea01"),
  bortoleto: photoUrl("audi", "gabbor01"),
  sainz: photoUrl("williams", "carsai01"),
  albon: photoUrl("williams", "alealb01"),
  ocon: photoUrl("haasf1team", "estoco01"),
  alonso: photoUrl("astonmartin", "feralo01"),
  hulkenberg: photoUrl("audi", "nichul01"),
  bottas: photoUrl("cadillac", "valbot01"),
  perez: photoUrl("cadillac", "serper01"),
  stroll: photoUrl("astonmartin", "lanstr01"),
};

export function getDriverPhoto(driverId: string): string | undefined {
  return DRIVER_PHOTOS[driverId];
}
