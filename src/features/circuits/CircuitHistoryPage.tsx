import { useParams } from "react-router-dom";
import { Trophy } from "lucide-react";
import { useCircuitHistory } from "@/shared/api/hooks";
import { Skeleton } from "@/shared/ui/Skeleton";
import { TableRow } from "@/shared/ui/Table";
import { getTeamTheme } from "@/features/team-theme/teamThemes";
import { CONSTRUCTOR_ID_MAP } from "@/features/team-theme/constructorIdMap";

export function CircuitHistoryPage() {
  const { circuitId } = useParams();
  const { data: races, isLoading } = useCircuitHistory(circuitId ?? "");

  if (isLoading) {
    return (
      <div className="space-y-2 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const sorted = [...(races ?? [])].sort((a, b) => Number(b.date.slice(0, 4)) - Number(a.date.slice(0, 4)));

  return (
    <div className="p-6">
      <div className="mb-3 text-sm font-medium text-white">
        {sorted[0]?.Circuit.circuitName ?? circuitId} — historique des vainqueurs
      </div>
      <div className="overflow-hidden rounded-lg border border-white/8">
        {sorted.map((race, i) => {
          const winner = race.Results?.[0];
          if (!winner) return null;
          const mappedTeam = CONSTRUCTOR_ID_MAP[winner.Constructor.constructorId];
          const theme = mappedTeam ? getTeamTheme(mappedTeam) : undefined;
          return (
            <TableRow key={race.date} index={i}>
              <span className="font-mono text-white/40">{race.date.slice(0, 4)}</span>
              <div className="flex items-center gap-2">
                {i === 0 && <Trophy size={12} style={{ color: "var(--color-primary)" }} />}
                <span className="text-white">
                  {winner.Driver.givenName[0]}. {winner.Driver.familyName}
                </span>
                {theme && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />}
              </div>
            </TableRow>
          );
        })}
      </div>
    </div>
  );
}
