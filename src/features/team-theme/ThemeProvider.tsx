import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { TeamId, getTeamTheme } from "./teamThemes";

const STORAGE_KEY = "f1-tracker:favorite-team";

interface ThemeContextValue {
  teamId: TeamId;
  setTeamId: (id: TeamId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function TeamThemeProvider({ children }: { children: ReactNode }) {
  const [teamId, setTeamId] = useState<TeamId>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as TeamId) || "mercedes";
  });

  useEffect(() => {
    const theme = getTeamTheme(teamId);
    document.documentElement.style.setProperty("--color-primary", theme.primary);
    document.documentElement.style.setProperty("--color-primary-ink", theme.ink);
    document.documentElement.style.setProperty("--color-bg", theme.bg);
    document.documentElement.style.setProperty("--color-text", theme.text);
    localStorage.setItem(STORAGE_KEY, teamId);
  }, [teamId]);

  return (
    <ThemeContext.Provider value={{ teamId, setTeamId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTeamTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTeamTheme must be used within TeamThemeProvider");
  return ctx;
}
