// Emoji drapeau par pays (Circuit.Location.country de l'API Jolpica)
const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺",
  China: "🇨🇳",
  Japan: "🇯🇵",
  Bahrain: "🇧🇭",
  "Saudi Arabia": "🇸🇦",
  USA: "🇺🇸",
  Canada: "🇨🇦",
  Monaco: "🇲🇨",
  Spain: "🇪🇸",
  Austria: "🇦🇹",
  UK: "🇬🇧",
  Belgium: "🇧🇪",
  Hungary: "🇭🇺",
  Netherlands: "🇳🇱",
  Italy: "🇮🇹",
  Azerbaijan: "🇦🇿",
  Singapore: "🇸🇬",
  Mexico: "🇲🇽",
  Brazil: "🇧🇷",
  Qatar: "🇶🇦",
  UAE: "🇦🇪",
};

// Emoji drapeau par nationalite (Driver.nationality / Constructor.nationality de l'API Jolpica)
const NATIONALITY_FLAGS: Record<string, string> = {
  Italian: "🇮🇹",
  British: "🇬🇧",
  Monegasque: "🇲🇨",
  Australian: "🇦🇺",
  Dutch: "🇳🇱",
  French: "🇫🇷",
  "New Zealander": "🇳🇿",
  Argentine: "🇦🇷",
  Brazilian: "🇧🇷",
  Spanish: "🇪🇸",
  Thai: "🇹🇭",
  German: "🇩🇪",
  Finnish: "🇫🇮",
  Mexican: "🇲🇽",
  Canadian: "🇨🇦",
  American: "🇺🇸",
  Austrian: "🇦🇹",
  Japanese: "🇯🇵",
  Danish: "🇩🇰",
  Polish: "🇵🇱",
  Russian: "🇷🇺",
  Swiss: "🇨🇭",
  Belgian: "🇧🇪",
  Indian: "🇮🇳",
  Swedish: "🇸🇪",
  Chinese: "🇨🇳",
  Indonesian: "🇮🇩",
};

export function getCountryFlag(country: string): string | undefined {
  return COUNTRY_FLAGS[country];
}

export function getNationalityFlag(nationality: string): string | undefined {
  return NATIONALITY_FLAGS[nationality];
}
