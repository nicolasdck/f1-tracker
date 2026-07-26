export type TeamId =
  | "mclaren" | "mercedes" | "redbull" | "ferrari" | "williams"
  | "haas" | "astonmartin" | "racingbulls" | "alpine" | "audi" | "cadillac";

export interface TeamTheme {
  id: TeamId;
  name: string;
  primary: string;
  ink: string;
  /** Couleur de fond de l'app, extraite du logo de l'écurie (public/{id}.jpg) */
  bg: string;
  /** Couleur de texte de l'app, extraite du logo de l'écurie (public/{id}.jpg) */
  text: string;
}

// Couleurs statiques choisies une fois — voir discussion projet.
// A ajuster si un rebrand officiel change une livree.
// bg/text sont extraites par script (dominante + accent) depuis les logos de public/.
// bg/text pousses a un contraste minimum de ~5.5 (lisibilite du texte sur
// tout l'app, feedback utilisateur du 2026-07-25) en assombrissant bg /
// eclaircissant text depuis les couleurs extraites d'origine.
export const TEAM_THEMES: TeamTheme[] = [
  { id: "mclaren", name: "McLaren", primary: "#FF8000", ink: "#1a1200", bg: "#8D5401", text: "#FFFFFF" },
  { id: "mercedes", name: "Mercedes", primary: "#27F4D2", ink: "#04201c", bg: "#256F6C", text: "#FFFFFF" },
  { id: "redbull", name: "Red Bull", primary: "#3671C6", ink: "#0a1526", bg: "#011628", text: "#FCD702" },
  { id: "ferrari", name: "Ferrari", primary: "#E8002D", ink: "#22030a", bg: "#BC0202", text: "#FEF017" },
  { id: "williams", name: "Williams", primary: "#64C4FF", ink: "#071c2c", bg: "#000000", text: "#169EDA" },
  { id: "haas", name: "Haas", primary: "#B6BABD", ink: "#1a1a1a", bg: "#C91532", text: "#FFFFFF" },
  { id: "astonmartin", name: "Aston Martin", primary: "#229971", ink: "#04140f", bg: "#0A5A4F", text: "#C8DBD9" },
  { id: "racingbulls", name: "Racing Bulls", primary: "#6692FF", ink: "#0a1226", bg: "#5C5E61", text: "#F9F9F9" },
  { id: "alpine", name: "Alpine", primary: "#FF87BC", ink: "#25051a", bg: "#023E72", text: "#ECA5DA" },
  { id: "audi", name: "Audi", primary: "#BB0A30", ink: "#1c0308", bg: "#C72300", text: "#FFFFFF" },
  { id: "cadillac", name: "Cadillac", primary: "#D4001A", ink: "#0a0a0a", bg: "#010101", text: "#FFFFFF" },
];

export function getTeamTheme(id: TeamId): TeamTheme {
  return TEAM_THEMES.find((t) => t.id === id) ?? TEAM_THEMES[1];
}
