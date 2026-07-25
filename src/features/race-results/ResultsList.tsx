import { TableRow } from "@/shared/ui/Table";
import { getTeamTheme, TeamId } from "@/features/team-theme/teamThemes";
import { CONSTRUCTOR_ID_MAP } from "@/features/team-theme/constructorIdMap";

export interface ResultItem {
  position: string;
  driverName: string;
  constructorId: string;
  detail: string;
  /** Ligne secondaire discrète, ex: temps à l'arrivée ou statut (Abandon, +1 Lap...). */
  subDetail?: string;
}

export function ResultsList({ rows, favoriteTeam }: { rows: ResultItem[]; favoriteTeam?: TeamId }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/8">
      {rows.map((r, i) => {
        const mappedTeam = CONSTRUCTOR_ID_MAP[r.constructorId];
        const theme = mappedTeam ? getTeamTheme(mappedTeam) : undefined;
        const isFav = !!mappedTeam && mappedTeam === favoriteTeam;
        return (
          <TableRow key={r.position} index={i} highlight={isFav} highlightColor={theme?.primary}>
            <div className="flex items-center gap-3">
              <span className="w-5 font-mono text-white/40">{r.position}</span>
              {theme && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />}
              <span className="text-white">{r.driverName}</span>
            </div>
            <div className="text-right">
              <div className="font-mono text-white/70">{r.detail}</div>
              {r.subDetail && <div className="font-mono text-[10px] text-white/40">{r.subDetail}</div>}
            </div>
          </TableRow>
        );
      })}
    </div>
  );
}
