// Mapping circuitId -> videoId YouTube, chaine Lollipopman Comics
// (https://www.youtube.com/@lollipopmancomics) - recaps comiques publies le
// mercredi apres chaque course, certaines courses sont parfois sautees par
// la chaine. Verifie via l'API oEmbed YouTube (author_name) le 2026-07-25.
// A completer manuellement au fil de la saison.
export const LOLLIPOPMAN_VIDEOS: Record<string, string> = {
  albert_park: "04O1qGMO7Aw", // Australian GP 2026 | Highlights | Comedy
  shanghai: "xbK2vM2OCOA", // Chinese GP 2026 | Highlights | Comedy
  miami: "OEfowUnLjpA", // Miami GP 2026 | Highlights | Comedy
  villeneuve: "Damx5skEqJg", // Silver Wars | Canadian GP 2026
  monaco: "VIGYvJyClH8", // Penalty Principality | Monaco GP 2026
  catalunya: "3hYbOhE8fhA", // Hammertime | Barcelona GP 2026
  red_bull_ring: "QA6Lb566wAk", // Peak Pace | Austrian GP 2026
  silverstone: "nUGQJM-9w6c", // The Philosopher's Silverstone | British GP 2026
};
