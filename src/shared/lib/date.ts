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
