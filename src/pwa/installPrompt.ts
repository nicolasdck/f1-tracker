interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

/**
 * Sur Android/Chrome, déclenche immédiatement la boîte de dialogue native
 * d'installation dès qu'elle devient disponible (au lieu d'attendre un clic
 * sur un bouton "Installer"). Sans effet sur les navigateurs qui ne
 * supportent pas beforeinstallprompt (iOS Safari notamment).
 */
export function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    (event as BeforeInstallPromptEvent).prompt();
  });
}
