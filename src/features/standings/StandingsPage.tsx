import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { useCurrentSeason, useDriverStandings, useStandingsEvolution } from "@/shared/api/hooks";
import { Skeleton } from "@/shared/ui/Skeleton";
import { TableRow } from "@/shared/ui/Table";
import { useTeamTheme } from "@/features/team-theme/ThemeProvider";
import { getTeamTheme } from "@/features/team-theme/teamThemes";
import { CONSTRUCTOR_ID_MAP } from "@/features/team-theme/constructorIdMap";
import { EvolutionChart } from "./EvolutionChart";

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export function StandingsPage() {
  const [view, setView] = useState<"current" | "evolution">("current");
  const { teamId } = useTeamTheme();
  const { data: standings, isLoading } = useDriverStandings();
  const { data: races } = useCurrentSeason();

  const completedRounds = useMemo(
    () => (races ?? []).filter((r) => isPast(r.date)).map((r) => Number(r.round)),
    [races]
  );
  const { data: evolutionRaw, isLoading: evolutionLoading } = useStandingsEvolution(completedRounds);

  const chartData = useMemo(() => {
    if (!evolutionRaw) return [];
    return evolutionRaw.map(({ round, standings: s }) => {
      const point: Record<string, number> = { round };
      s.forEach((d) => {
        point[`${d.Driver.givenName[0]}. ${d.Driver.familyName}`] = Number(d.points);
      });
      return point as { round: number; [k: string]: number };
    });
  }, [evolutionRaw]);

  const driverMeta = useMemo(() => {
    if (!standings) return [];
    return standings.map((d) => ({
      name: `${d.Driver.givenName[0]}. ${d.Driver.familyName}`,
      teamId: CONSTRUCTOR_ID_MAP[d.Constructors[0]?.constructorId] ?? "mercedes",
    }));
  }, [standings]);

  return (
    <div className="p-6">
      <div className="mb-4 flex w-fit items-center gap-1 rounded-full bg-white/5 p-1">
        {(["current", "evolution"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="rounded-full px-3 py-1 text-xs font-medium transition"
            style={
              view === v
                ? { backgroundColor: "var(--color-primary)", color: "var(--color-primary-ink)" }
                : { color: "rgba(255,255,255,0.5)" }
            }
          >
            {v === "current" ? "Actuel" : "Évolution"}
          </button>
        ))}
      </div>

      {view === "current" ? (
        isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-white/8">
            {standings?.map((d, i) => {
              const mappedTeam = CONSTRUCTOR_ID_MAP[d.Constructors[0]?.constructorId];
              const theme = mappedTeam ? getTeamTheme(mappedTeam) : undefined;
              const isFav = mappedTeam === teamId;
              return (
                <TableRow key={d.position} index={i} highlight={isFav} highlightColor={theme?.primary}>
                  <div className="flex items-center gap-3">
                    <span className="w-5 font-mono text-white/40">{d.position}</span>
                    {theme && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />}
                    <span className="text-white">
                      {d.Driver.givenName[0]}. {d.Driver.familyName}
                    </span>
                  </div>
                  <span className="font-mono text-white/70">{d.points} pts</span>
                </TableRow>
              );
            })}
          </div>
        )
      ) : evolutionLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center gap-1.5 text-xs text-white/40">
            <TrendingUp size={12} /> Points cumulés par round
          </div>
          <EvolutionChart data={chartData} drivers={driverMeta} favoriteTeam={teamId} />
        </div>
      )}
    </div>
  );
}
