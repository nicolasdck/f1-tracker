const formatter = new Intl.DateTimeFormat("fr-BE", {
  timeZone: "Europe/Brussels",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const sessionTimeFormatter = new Intl.DateTimeFormat("fr-BE", {
  timeZone: "Europe/Brussels",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/** Formate une date (+ heure optionnelle) Jolpica en JJ/MM/AAAA, heure de Bruxelles (gère le DST). */
export function formatDate(dateStr: string, timeStr?: string): string {
  const date = new Date(timeStr ? `${dateStr}T${timeStr}` : dateStr);
  return formatter.format(date);
}

/** Formate une session (essais/qualifs/course) Jolpica en "ven. 13:30", heure de Bruxelles. */
export function formatSessionTime(dateStr: string, timeStr?: string): string {
  const date = new Date(timeStr ? `${dateStr}T${timeStr}` : dateStr);
  return sessionTimeFormatter.format(date);
}

const RACE_DURATION_MS = 2 * 60 * 60 * 1000;

/**
 * Vrai une fois la course reellement terminee (heure de depart + duree
 * estimee), pas juste passe minuit UTC le jour J - sinon la course du jour
 * bascule "passee" des 00h00 UTC (~2h du matin en Europe), des heures avant
 * qu'elle n'ait meme commence.
 */
export function isRacePast(dateStr: string, timeStr?: string): boolean {
  const start = new Date(timeStr ? `${dateStr}T${timeStr}` : dateStr).getTime();
  return Date.now() > start + RACE_DURATION_MS;
}

const WEEKEND_LOOKAHEAD_MS = 24 * 60 * 60 * 1000;

/**
 * Vrai a partir de la veille de la course (debut du week-end de course).
 * Sert a distinguer "prochaine course" (chronologiquement) de "en cours"
 * (le week-end a reellement commence) - une course dans 3 semaines ne doit
 * pas afficher "en cours" juste parce que c'est la suivante.
 */
export function isRaceWeekendStarted(dateStr: string, timeStr?: string): boolean {
  const start = new Date(timeStr ? `${dateStr}T${timeStr}` : dateStr).getTime();
  return Date.now() >= start - WEEKEND_LOOKAHEAD_MS;
}
