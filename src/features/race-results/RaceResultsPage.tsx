import { useParams } from "react-router-dom";
import { useRaceResults } from "@/shared/api/hooks";
import { Skeleton } from "@/shared/ui/Skeleton";
import { TableRow } from "@/shared/ui/Table";
import { useTeamTheme } from "@/features/team-theme/ThemeProvider";
import { getTeamTheme } from "@/features/team-theme/teamThemes";
import { CONSTRUCTOR_ID_MAP } from "@/features/team-theme/constructorIdMap";

export function RaceResultsPage() {
  const { round } = useParams();
  const { data: race, isLoading } = useRaceResults(Number(round));
  const { teamId } = useTeamTheme();

  if (isLoading) {
    return (
      <div className="space-y-2 p-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!race) {
    return <div className="p-6 text-sm text-white/50">Résultats introuvables pour ce round.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="text-lg font-medium text-white">{race.raceName}</div>
        <div className="text-xs text-white/40">{race.Circuit.circuitName}</div>
      </div>
      <div className="overflow-hidden rounded-lg border border-white/8">
        {race.Results.map((r, i) => {
          const mappedTeam = CONSTRUCTOR_ID_MAP[r.Constructor.constructorId];
          const theme = mappedTeam ? getTeamTheme(mappedTeam) : undefined;
          const isFav = mappedTeam === teamId;
          return (
            <TableRow key={r.position} index={i} highlight={isFav} highlightColor={theme?.primary}>
              <div className="flex items-center gap-3">
                <span className="w-5 font-mono text-white/40">{r.position}</span>
                {theme && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />}
                <span className="text-white">
                  {r.Driver.givenName[0]}. {r.Driver.familyName}
                </span>
              </div>
              <span className="font-mono text-white/70">{r.points} pts</span>
            </TableRow>
          );
        })}
      </div>
    </div>
  );
}
