import { TeamId } from "./teamThemes";

// Logos officiels (blanc, carre, taille uniforme), extraits de
// https://www.formula1.com/en/teams (CDN media.formula1.com).
// Verifie manuellement (HTTP 200) pour chaque ecurie le 2026-07-25.
// Remplace les anciens badges extraits d'une affiche (public/team-logos/),
// dont les proportions variables cassaient l'alignement dans les tableaux.
const TEAM_FOLDER: Record<TeamId, string> = {
  mclaren: "mclaren",
  mercedes: "mercedes",
  redbull: "redbullracing",
  ferrari: "ferrari",
  williams: "williams",
  haas: "haasf1team",
  astonmartin: "astonmartin",
  racingbulls: "racingbulls",
  alpine: "alpine",
  audi: "audi",
  cadillac: "cadillac",
};

const BASE = "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026";

export function getTeamLogoUrl(teamId: TeamId): string {
  const folder = TEAM_FOLDER[teamId];
  return `${BASE}/${folder}/2026${folder}logowhite.webp`;
}
