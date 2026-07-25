import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TeamThemeProvider } from "./features/team-theme/ThemeProvider";
import { InstallPromptProvider } from "./pwa/InstallPromptProvider";
import { setupServiceWorker } from "./pwa/registerServiceWorker";
import "./index.css";

setupServiceWorker();

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
        <InstallPromptProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </InstallPromptProvider>
      </TeamThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
