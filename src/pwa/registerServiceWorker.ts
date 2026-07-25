import { registerSW } from "virtual:pwa-register";

/**
 * Enregistre le service worker et vérifie la présence d'une mise à jour à
 * chaque chargement de l'app. Si une nouvelle version est disponible, elle
 * est activée et la page est rechargée automatiquement (pas de prompt).
 */
export function setupServiceWorker() {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateSW(true);
    },
    onRegisteredSW(_url, registration) {
      registration?.update();
    },
  });
}
