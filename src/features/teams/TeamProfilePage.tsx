import { Link, useParams } from "react-router-dom";
import { useConstructorSeasonResults, useConstructorStandings } from "@/shared/api/hooks";
import { Skeleton } from "@/shared/ui/Skeleton";
import { TableRow } from "@/shared/ui/Table";
import { Flag } from "@/shared/ui/Flag";
import { TeamLogo } from "@/shared/ui/TeamLogo";
import { getCountryFlagCode, getNationalityFlagCode } from "@/shared/lib/flags";
import { getTeamTheme } from "@/features/team-theme/teamThemes";
import { CONSTRUCTOR_ID_MAP } from "@/features/team-theme/constructorIdMap";
import { getTeamCarPhoto } from "./teamCarPhotos";

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/20 bg-white/[0.02] p-3 text-center">
      <div className="font-mono text-xl font-semibold text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-white/40">{label}</div>
    </div>
  );
}

export function TeamProfilePage() {
  const { constructorId } = useParams();
  const { data: standings, isLoading: standingsLoading } = useConstructorStandings();
  const { data: races, isLoading: resultsLoading } = useConstructorSeasonResults(constructorId ?? "");

  if (standingsLoading || resultsLoading) {
    return (
      <div className="space-y-2 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const entry = standings?.find((c) => c.Constructor.constructorId === constructorId);
  const constructorInfo = entry?.Constructor ?? races?.[0]?.Results[0]?.Constructor;
  const mappedTeam = constructorInfo ? CONSTRUCTOR_ID_MAP[constructorInfo.constructorId] : undefined;
  const theme = mappedTeam ? getTeamTheme(mappedTeam) : undefined;
  const carPhoto = constructorInfo ? getTeamCarPhoto(constructorInfo.constructorId) : undefined;

  if (!constructorInfo) {
    return <div className="p-6 text-sm text-white/50">Écurie introuvable.</div>;
  }

  const rows = (races ?? []).flatMap((race) =>
    race.Results.map((result) => ({
      round: race.round,
      raceName: race.raceName,
      country: race.Circuit.Location.country,
      driverId: result.Driver.driverId,
      driverName: `${result.Driver.givenName[0]}. ${result.Driver.familyName}`,
      position: result.position,
      points: result.points,
    }))
  );

  return (
    <div className="p-6">
      <div
        className="mb-4 overflow-hidden rounded-lg border border-black/20"
        style={{ backgroundColor: theme ? `${theme.primary}14` : undefined }}
      >
        {carPhoto && (
          <img
            src={carPhoto}
            alt=""
            className="h-28 w-full object-contain p-2"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        <div className="flex items-center gap-4 p-4 pt-0">
          <TeamLogo
            teamId={mappedTeam}
            className="h-10 w-14 border"
            style={{ borderColor: theme?.primary ?? "transparent" }}
          />
          <div>
            <div className="text-lg font-medium text-white">{constructorInfo.name}</div>
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Flag code={getNationalityFlagCode(constructorInfo.nationality)} />
              {constructorInfo.nationality}
            </div>
          </div>
        </div>
      </div>

      {entry && (
        <div className="mb-4 grid grid-cols-3 gap-2">
          <StatTile label="Position" value={entry.position} />
          <StatTile label="Points" value={entry.points} />
          <StatTile label="Victoires" value={entry.wins} />
        </div>
      )}

      <div className="mb-2 text-xs font-mono uppercase tracking-widest text-white/40">Saison en cours</div>
      <div className="overflow-hidden rounded-lg border border-black/20">
        {rows.map((r, i) => (
          <TableRow key={`${r.round}-${r.driverId}`} index={i}>
            <div className="flex items-center gap-3">
              <span className="w-5 font-mono text-white/40">{r.round}</span>
              <Flag code={getCountryFlagCode(r.country)} />
              <div>
                <div className="text-white">{r.raceName}</div>
                <Link
                  to={`/drivers/${r.driverId}`}
                  className="text-[10px] text-white/40 hover:text-white/70"
                >
                  {r.driverName}
                </Link>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-white/70">{r.position}</div>
              <div className="font-mono text-[10px] text-white/40">{r.points} pts</div>
            </div>
          </TableRow>
        ))}
      </div>
    </div>
  );
}
