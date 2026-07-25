import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { Race } from "@/shared/api/jolpicaClient";
import { buildSessions, getStatus, sessionStart } from "./SessionsPanel";

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  if (days > 0) return `${days}j ${pad(hours)}h ${pad(minutes)}m`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function Countdown({ race }: { race: Race }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const sessions = buildSessions(race);
  const live = sessions.find((s) => getStatus(s.session, s.durationMin) === "live");
  const next = sessions.find((s) => getStatus(s.session, s.durationMin) === "upcoming");

  if (live) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
        {live.label} en direct
      </div>
    );
  }

  if (!next) return null;

  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-medium"
      style={{ backgroundColor: "var(--color-primary)22", color: "var(--color-primary)" }}
    >
      <Timer size={12} />
      {next.label} dans {formatRemaining(sessionStart(next.session) - now)}
    </div>
  );
}
