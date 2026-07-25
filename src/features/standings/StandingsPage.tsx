import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  useConstructorStandings,
  useConstructorStandingsEvolution,
  useCurrentSeason,
  useDriverStandings,
  useStandingsEvolution,
} from "@/shared/api/hooks";
import { Skeleton } from "@/shared/ui/Skeleton";
import { TableRow } from "@/shared/ui/Table";
import { useTeamTheme } from "@/features/team-theme/ThemeProvider";
import { getTeamTheme } from "@/features/team-theme/teamThemes";
import { CONSTRUCTOR_ID_MAP } from "@/features/team-theme/constructorIdMap";
import { getNationalityFlagCode } from "@/shared/lib/flags";
import { Flag } from "@/shared/ui/Flag";
import { EvolutionChart } from "./EvolutionChart";

type Category = "drivers" | "constructors";
type View = "current" | "evolution";

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

function Pills<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
}) {
  return (
    <div className="flex w-fit items-center gap-1 rounded-full bg-white/5 p-1">
      {options.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className="rounded-full px-3 py-1 text-xs font-medium transition"
          style={
            value === v
              ? { backgroundColor: "var(--color-primary)", color: "var(--color-primary-ink)" }
              : { color: "rgba(255,255,255,0.5)" }
          }
        >
          {labels[v]}
        </button>
      ))}
    </div>
  );
}

export function StandingsPage() {
  const [category, setCategory] = useState<Category>("drivers");
  const [view, setView] = useState<View>("current");
  const { teamId } = useTeamTheme();
  const { data: races } = useCurrentSeason();

  const isDrivers = category === "drivers";

  // Toujours necessaire (pas seulement en vue "Actuel"): sert aussi de legende
  // (nom + ecurie) pour le graphique d'evolution. Un seul appel, pas cher.
  const { data: driverStandings, isLoading: driversLoading } = useDriverStandings(undefined, isDrivers);
  const { data: constructorStandings, isLoading: constructorsLoading } = useConstructorStandings(
    undefined,
    !isDrivers
  );

  const completedRounds = useMemo(
    () => (races ?? []).filter((r) => isPast(r.date)).map((r) => Number(r.round)),
    [races]
  );

  const { data: driverEvolutionRaw, isLoading: driverEvolutionLoading } = useStandingsEvolution(
    completedRounds,
    isDrivers && view === "evolution"
  );
  const { data: constructorEvolutionRaw, isLoading: constructorEvolutionLoading } = useConstructorStandingsEvolution(
    completedRounds,
    !isDrivers && view === "evolution"
  );

  const driverChartData = useMemo(() => {
    if (!driverEvolutionRaw) return [];
    return driverEvolutionRaw.map(({ round, standings: s }) => {
      const point: Record<string, number> = { round };
      s.forEach((d) => {
        point[`${d.Driver.givenName[0]}. ${d.Driver.familyName}`] = Number(d.points);
      });
      return point as { round: number; [k: string]: number };
    });
  }, [driverEvolutionRaw]);

  const constructorChartData = useMemo(() => {
    if (!constructorEvolutionRaw) return [];
    return constructorEvolutionRaw.map(({ round, standings: s }) => {
      const point: Record<string, number> = { round };
      s.forEach((c) => {
        point[c.Constructor.name] = Number(c.points);
      });
      return point as { round: number; [k: string]: number };
    });
  }, [constructorEvolutionRaw]);

  const driverSeries = useMemo(() => {
    if (!driverStandings) return [];
    return driverStandings.map((d) => ({
      name: `${d.Driver.givenName[0]}. ${d.Driver.familyName}`,
      teamId: CONSTRUCTOR_ID_MAP[d.Constructors[0]?.constructorId] ?? "mercedes",
    }));
  }, [driverStandings]);

  const constructorSeries = useMemo(() => {
    if (!constructorStandings) return [];
    return constructorStandings.map((c) => ({
      name: c.Constructor.name,
      teamId: CONSTRUCTOR_ID_MAP[c.Constructor.constructorId] ?? "mercedes",
    }));
  }, [constructorStandings]);

  const isLoading = isDrivers ? driversLoading : constructorsLoading;
  const evolutionLoading = isDrivers ? driverEvolutionLoading : constructorEvolutionLoading;

  return (
    <div className="space-y-3 p-6">
      <Pills
        options={["drivers", "constructors"] as const}
        value={category}
        onChange={setCategory}
        labels={{ drivers: "Pilotes", constructors: "Constructeurs" }}
      />
      <Pills
        options={["current", "evolution"] as const}
        value={view}
        onChange={setView}
        labels={{ current: "Actuel", evolution: "Évolution" }}
      />

      {view === "current" ? (
        isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isDrivers ? (
          <div className="overflow-hidden rounded-lg border border-white/8">
            {driverStandings?.map((d, i) => {
              const mappedTeam = CONSTRUCTOR_ID_MAP[d.Constructors[0]?.constructorId];
              const theme = mappedTeam ? getTeamTheme(mappedTeam) : undefined;
              const isFav = mappedTeam === teamId;
              return (
                <TableRow key={d.position} index={i} highlight={isFav} highlightColor={theme?.primary}>
                  <div className="flex items-center gap-3">
                    <span className="w-5 font-mono text-white/40">{d.position}</span>
                    {theme && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />}
                    <span className="text-white">
                      <Flag code={getNationalityFlagCode(d.Driver.nationality)} className="mr-1.5" />
                      {d.Driver.givenName[0]}. {d.Driver.familyName}
                    </span>
                  </div>
                  <span className="font-mono text-white/70">{d.points} pts</span>
                </TableRow>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-white/8">
            {constructorStandings?.map((c, i) => {
              const mappedTeam = CONSTRUCTOR_ID_MAP[c.Constructor.constructorId];
              const theme = mappedTeam ? getTeamTheme(mappedTeam) : undefined;
              const isFav = mappedTeam === teamId;
              return (
                <TableRow key={c.position} index={i} highlight={isFav} highlightColor={theme?.primary}>
                  <div className="flex items-center gap-3">
                    <span className="w-5 font-mono text-white/40">{c.position}</span>
                    {theme && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />}
                    <span className="text-white">
                      <Flag code={getNationalityFlagCode(c.Constructor.nationality)} className="mr-1.5" />
                      {c.Constructor.name}
                    </span>
                  </div>
                  <span className="font-mono text-white/70">{c.points} pts</span>
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
          <EvolutionChart
            data={isDrivers ? driverChartData : constructorChartData}
            series={isDrivers ? driverSeries : constructorSeries}
            favoriteTeam={teamId}
          />
        </div>
      )}
    </div>
  );
}
