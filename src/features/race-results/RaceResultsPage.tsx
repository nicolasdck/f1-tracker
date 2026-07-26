import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQualifyingResults, useRaceResults, useSprintResults } from "@/shared/api/hooks";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Loader } from "@/shared/ui/Loader";
import { useTeamTheme } from "@/features/team-theme/ThemeProvider";
import { ResultsList } from "./ResultsList";
import { LollipopmanVideo } from "./LollipopmanVideo";
import { useLollipopmanVideo } from "./useLollipopmanVideo";

type Tab = "sprint" | "qualifying" | "race";

export function RaceResultsPage() {
  const { round } = useParams();
  const roundNumber = Number(round);
  const { teamId } = useTeamTheme();

  const race = useRaceResults(roundNumber);
  const qualifying = useQualifyingResults(roundNumber);
  const sprint = useSprintResults(roundNumber);
  const lollipopmanVideo = useLollipopmanVideo(race.data);

  const hasSprint = !!sprint.data?.SprintResults?.length;
  const hasQualifying = !!qualifying.data?.QualifyingResults?.length;

  const tabs: { key: Tab; label: string }[] = [
    ...(hasSprint ? [{ key: "sprint" as const, label: "Sprint" }] : []),
    ...(hasQualifying ? [{ key: "qualifying" as const, label: "Qualifs" }] : []),
    { key: "race", label: "Course" },
  ];

  const [tab, setTab] = useState<Tab>("race");
  const activeTab = tabs.some((t) => t.key === tab) ? tab : "race";

  if (race.isLoading) {
    return (
      <div className="space-y-2 p-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!race.data) {
    return <div className="p-6 text-sm text-white/50">Résultats introuvables pour ce round.</div>;
  }

  const rows =
    activeTab === "sprint"
      ? sprint.data?.SprintResults?.map((r) => ({
          position: r.position,
          driverId: r.Driver.driverId,
          driverName: `${r.Driver.givenName[0]}. ${r.Driver.familyName}`,
          constructorId: r.Constructor.constructorId,
          detail: `${r.points} pts`,
          subDetail: r.Time?.time ?? r.status,
        }))
      : activeTab === "qualifying"
        ? qualifying.data?.QualifyingResults?.map((r) => ({
            position: r.position,
            driverId: r.Driver.driverId,
            driverName: `${r.Driver.givenName[0]}. ${r.Driver.familyName}`,
            constructorId: r.Constructor.constructorId,
            detail: r.Q3 ?? r.Q2 ?? r.Q1 ?? "—",
          }))
        : race.data.Results.map((r) => ({
            position: r.position,
            driverId: r.Driver.driverId,
            driverName: `${r.Driver.givenName[0]}. ${r.Driver.familyName}`,
            constructorId: r.Constructor.constructorId,
            detail: `${r.points} pts`,
            subDetail: r.Time?.time ?? r.status,
          }));

  const rowsLoading =
    activeTab === "sprint" ? sprint.isLoading : activeTab === "qualifying" ? qualifying.isLoading : race.isLoading;

  const videoId = lollipopmanVideo.data;

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="text-lg font-medium text-white">{race.data.raceName}</div>
        <div className="text-xs text-white/40">{race.data.Circuit.circuitName}</div>
      </div>

      {lollipopmanVideo.isLoading ? (
        <div className="mb-4">
          <Loader size={32} />
        </div>
      ) : videoId ? (
        <LollipopmanVideo videoId={videoId} />
      ) : null}

      {tabs.length > 1 && (
        <div className="mb-4 flex w-fit items-center gap-1 rounded-full bg-white/5 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="rounded-full px-3 py-1 text-xs font-medium transition"
              style={
                activeTab === t.key
                  ? { backgroundColor: "var(--color-primary)", color: "var(--color-primary-ink)" }
                  : { color: "rgba(255,255,255,0.5)" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {rowsLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : rows?.length ? (
        <ResultsList rows={rows} favoriteTeam={teamId} />
      ) : (
        <div className="p-2 text-sm text-white/50">Résultats pas encore disponibles.</div>
      )}
    </div>
  );
}
