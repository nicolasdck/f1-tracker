// Cache localStorage pour des reponses d'API immuables (ex: classement apres un
// round deja couru, qui ne changera plus jamais). Evite de re-fetcher a chaque
// rechargement de page et de saturer le rate-limit de l'API gratuite Jolpica.
const PREFIX = "f1-tracker:cache:";

export function getCached<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

export function setCached<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // quota depasse ou storage indisponible (navigation privee) - tant pis, pas critique
  }
}
