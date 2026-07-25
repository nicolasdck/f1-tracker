import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TeamThemeProvider } from "./features/team-theme/ThemeProvider";
import { setupServiceWorker } from "./pwa/registerServiceWorker";
import { setupInstallPrompt } from "./pwa/installPrompt";
import "./index.css";

setupServiceWorker();
setupInstallPrompt();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 min — les données de course ne changent pas souvent
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TeamThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TeamThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
