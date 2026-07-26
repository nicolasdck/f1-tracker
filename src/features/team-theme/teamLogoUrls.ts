import { TeamId } from "./teamThemes";

// Logos officiels (blanc, carre, taille uniforme), extraits une fois de
// https://www.formula1.com/en/teams et stockes localement dans public/team-logos/
// (aucun lien externe au runtime - fonctionne aussi hors-ligne dans la PWA).
export function getTeamLogoUrl(teamId: TeamId): string {
  return `/team-logos/${teamId}.webp`;
}
