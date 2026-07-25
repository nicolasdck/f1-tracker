// Codes ISO 3166-1 alpha-2 par pays (Circuit.Location.country de l'API Jolpica).
// Les emoji drapeau ne s'affichent pas sur Chrome/Edge Windows (Microsoft n'a
// jamais ajoute les glyphes couleur correspondants) -> on utilise des SVG
// auto-heberges dans public/flags/ (extraits du package flag-icons).
const COUNTRY_CODES: Record<string, string> = {
  Australia: "au",
  China: "cn",
  Japan: "jp",
  Bahrain: "bh",
  "Saudi Arabia": "sa",
  USA: "us",
  Canada: "ca",
  Monaco: "mc",
  Spain: "es",
  Austria: "at",
  UK: "gb",
  Belgium: "be",
  Hungary: "hu",
  Netherlands: "nl",
  Italy: "it",
  Azerbaijan: "az",
  Singapore: "sg",
  Mexico: "mx",
  Brazil: "br",
  Qatar: "qa",
  UAE: "ae",
};

// Codes ISO par nationalite (Driver.nationality / Constructor.nationality de l'API Jolpica)
const NATIONALITY_CODES: Record<string, string> = {
  Italian: "it",
  British: "gb",
  Monegasque: "mc",
  Australian: "au",
  Dutch: "nl",
  French: "fr",
  "New Zealander": "nz",
  Argentine: "ar",
  Brazilian: "br",
  Spanish: "es",
  Thai: "th",
  German: "de",
  Finnish: "fi",
  Mexican: "mx",
  Canadian: "ca",
  American: "us",
  Austrian: "at",
  Japanese: "jp",
  Danish: "dk",
  Polish: "pl",
  Russian: "ru",
  Swiss: "ch",
  Belgian: "be",
  Indian: "in",
  Swedish: "se",
  Chinese: "cn",
  Indonesian: "id",
};

export function getCountryFlagCode(country: string): string | undefined {
  return COUNTRY_CODES[country];
}

export function getNationalityFlagCode(nationality: string): string | undefined {
  return NATIONALITY_CODES[nationality];
}
