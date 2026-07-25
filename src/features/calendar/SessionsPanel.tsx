import { useState } from "react";
import { Trophy } from "lucide-react";
import { Race, RaceSession } from "@/shared/api/jolpicaClient";
import { useQualifyingResults, useRaceResults, useSprintResults } from "@/shared/api/hooks";
import { Modal } from "@/shared/ui/Modal";
import { Skeleton } from "@/shared/ui/Skeleton";
import { formatSessionTime } from "@/shared/lib/date";
import { ResultsList } from "@/features/race-results/ResultsList";

type SessionKind = "qualifying" | "sprint" | "race";

export interface SessionDef {
  key: string;
  label: string;
  session: RaceSession;
  /** Durée estimée en minutes, pour détecter le statut "en cours". */
  durationMin: number;
  /** Seules qualifs/sprint/course ont des résultats exposés par l'API. */
  resultsKind?: SessionKind;
}

export function buildSessions(race: Race): SessionDef[] {
  const defs: SessionDef[] = [
    { key: "fp1", label: "Essais Libres 1", session: race.FirstPractice, durationMin: 60 },
    { key: "fp2", label: "Essais Libres 2", session: race.SecondPractice, durationMin: 60 },
    { key: "fp3", label: "Essais Libres 3", session: race.ThirdPractice, durationMin: 60 },
    { key: "sprintQualifying", label: "Qualifs Sprint", session: race.SprintQualifying, durationMin: 45 },
    { key: "sprint", label: "Sprint", session: race.Sprint, durationMin: 45, resultsKind: "sprint" },
    { key: "qualifying", label: "Qualifications", session: race.Qualifying, durationMin: 60, resultsKind: "qualifying" },
    { key: "race", label: "Course", session: { date: race.date, time: race.time }, durationMin: 120, resultsKind: "race" },
  ].filter((d): d is SessionDef & { session: RaceSession } => !!d.session?.date);

  return defs.sort((a, b) => sessionStart(a.session) - sessionStart(b.session));
}

export function sessionStart(session: RaceSession) {
  return new Date(`${session.date}T${session.time ?? "00:00:00Z"}`).getTime();
}

export function getStatus(session: RaceSession, durationMin: number): "upcoming" | "live" | "done" {
  const start = sessionStart(session);
  const end = start + durationMin * 60_000;
  const now = Date.now();
  if (now < start) return "upcoming";
  if (now < end) return "live";
  return "done";
}

function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-red-400">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
      Live
    </span>
  );
}

function SessionResultsModal({
  kind,
  round,
  label,
  onClose,
}: {
  kind: SessionKind;
  round: number;
  label: string;
  onClose: () => void;
}) {
  const qualifying = useQualifyingResults(round, kind === "qualifying");
  const sprint = useSprintResults(round, kind === "sprint");
  const race = useRaceResults(round, kind === "race");

  const isLoading =
    kind === "qualifying" ? qualifying.isLoading : kind === "sprint" ? sprint.isLoading : race.isLoading;

  let rows:
    | {
        position: string;
        driverId: string;
        driverName: string;
        constructorId: string;
        detail: string;
        subDetail?: string;
      }[]
    | undefined;
  if (kind === "qualifying") {
    rows = qualifying.data?.QualifyingResults?.map((r) => ({
      position: r.position,
      driverId: r.Driver.driverId,
      driverName: `${r.Driver.givenName[0]}. ${r.Driver.familyName}`,
      constructorId: r.Constructor.constructorId,
      detail: r.Q3 ?? r.Q2 ?? r.Q1 ?? "—",
    }));
  } else if (kind === "sprint") {
    rows = sprint.data?.SprintResults?.map((r) => ({
      position: r.position,
      driverId: r.Driver.driverId,
      driverName: `${r.Driver.givenName[0]}. ${r.Driver.familyName}`,
      constructorId: r.Constructor.constructorId,
      detail: `${r.points} pts`,
      subDetail: r.Time?.time ?? r.status,
    }));
  } else {
    rows = race.data?.Results?.map((r) => ({
      position: r.position,
      driverId: r.Driver.driverId,
      driverName: `${r.Driver.givenName[0]}. ${r.Driver.familyName}`,
      constructorId: r.Constructor.constructorId,
      detail: `${r.points} pts`,
      subDetail: r.Time?.time ?? r.status,
    }));
  }

  return (
    <Modal open onClose={onClose} title={label}>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : rows?.length ? (
        <ResultsList rows={rows} />
      ) : (
        <div className="p-2 text-sm text-white/50">Résultats pas encore disponibles.</div>
      )}
    </Modal>
  );
}

export function SessionsPanel({ race }: { race: Race }) {
  const [openSession, setOpenSession] = useState<{ kind: SessionKind; label: string } | null>(null);

  return (
    <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 border-t border-white/10 pt-3 text-xs sm:grid-cols-4">
      {buildSessions(race).map(({ key, label, session, durationMin, resultsKind }) => {
        const status = getStatus(session, durationMin);
        return (
          <div key={key} className="flex items-center justify-between gap-2">
            <span className="text-white/40">{label}</span>
            {status === "live" ? (
              <LiveBadge />
            ) : status === "done" && resultsKind ? (
              <button
                onClick={() => setOpenSession({ kind: resultsKind, label })}
                className="flex items-center gap-1 font-mono text-white/80 transition hover:text-[var(--color-primary)]"
                aria-label={`Résultats — ${label}`}
              >
                <Trophy size={12} />
              </button>
            ) : (
              <span className={`font-mono ${status === "done" ? "text-white/30" : "text-white/80"}`}>
                {formatSessionTime(session.date, session.time)}
              </span>
            )}
          </div>
        );
      })}

      {openSession && (
        <SessionResultsModal
          kind={openSession.kind}
          round={Number(race.round)}
          label={openSession.label}
          onClose={() => setOpenSession(null)}
        />
      )}
    </div>
  );
}
