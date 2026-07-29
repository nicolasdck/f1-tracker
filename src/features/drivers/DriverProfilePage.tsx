import { Link, useParams } from 'react-router-dom';
import { useDriverSeasonResults, useDriverStandings } from '@/shared/api/hooks';
import { Skeleton } from '@/shared/ui/Skeleton';
import { TableRow } from '@/shared/ui/Table';
import { Flag } from '@/shared/ui/Flag';
import { TeamLogo } from '@/shared/ui/TeamLogo';
import { getCountryFlagCode, getNationalityFlagCode } from '@/shared/lib/flags';
import { getTeamTheme } from '@/features/team-theme/teamThemes';
import { CONSTRUCTOR_ID_MAP } from '@/features/team-theme/constructorIdMap';
import { getDriverPhoto } from './driverPhotos';

function StatTile({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-black/20 bg-white/[0.02] p-3 text-center">
			<div className="font-mono text-xl font-semibold text-white">{value}</div>
			<div className="text-[10px] uppercase tracking-widest text-white/40">
				{label}
			</div>
		</div>
	);
}

export function DriverProfilePage() {
	const { driverId } = useParams();
	const { data: standings, isLoading: standingsLoading } = useDriverStandings();
	const { data: races, isLoading: resultsLoading } = useDriverSeasonResults(
		driverId ?? '',
	);

	if (standingsLoading || resultsLoading) {
		return (
			<div className="space-y-2 p-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
			</div>
		);
	}

	const entry = standings?.find((d) => d.Driver.driverId === driverId);
	const firstResult = races?.[0]?.Results[0];
	const driver = entry?.Driver ?? firstResult?.Driver;
	const constructorInfo = entry?.Constructors[0] ?? firstResult?.Constructor;
	const mappedTeam = constructorInfo
		? CONSTRUCTOR_ID_MAP[constructorInfo.constructorId]
		: undefined;
	const theme = mappedTeam ? getTeamTheme(mappedTeam) : undefined;
	const photo = driverId ? getDriverPhoto(driverId) : undefined;

	if (!driver) {
		return <div className="p-6 text-sm text-white/50">Pilote introuvable.</div>;
	}

	return (
		<div className="p-6">
			<div
				className="mb-4 flex items-center justify-between gap-3 overflow-hidden rounded-lg border border-black/20"
				style={{ backgroundColor: theme ? `${theme.primary}14` : undefined }}
			>
				<div className="p-4">
					<div className="mb-1 flex items-center gap-2">
						<Flag code={getNationalityFlagCode(driver.nationality)} />
						{driver.permanentNumber && (
							<span className="font-mono text-xs text-white/40">
								#{driver.permanentNumber}
							</span>
						)}
					</div>
					<div className="text-xl font-medium text-white">
						{driver.givenName} {driver.familyName}
					</div>
					{constructorInfo && (
						<Link
							to={`/teams/${constructorInfo.constructorId}`}
							className="mt-1 flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80"
						>
							<TeamLogo teamId={mappedTeam} />
							{constructorInfo.name}
						</Link>
					)}
				</div>
				{photo && (
					<img
						src={photo}
						alt=""
						className="h-40 w-auto shrink-0 object-contain object-bottom"
						onError={(e) => {
							e.currentTarget.style.display = 'none';
						}}
					/>
				)}
			</div>

			{entry && (
				<div className="mb-4 grid grid-cols-3 gap-2">
					<StatTile label="Position" value={entry.position} />
					<StatTile label="Points" value={entry.points} />
					<StatTile label="Victoires" value={entry.wins} />
				</div>
			)}

			<div className="mb-2 text-xs font-mono uppercase tracking-widest text-white/40">
				Saison en cours
			</div>
			<div className="overflow-hidden rounded-lg border border-black/20">
				{races?.map((race, i) => {
					const result = race.Results[0];
					const isFavRow =
						mappedTeam === CONSTRUCTOR_ID_MAP[result.Constructor.constructorId];
					return (
						<TableRow
							key={race.round}
							index={i}
							highlight={isFavRow}
							highlightColor={theme?.primary}
						>
							<div className="flex items-center gap-3">
								<span className="w-5 font-mono text-white/40">
									{race.round}
								</span>
								<Flag
									code={getCountryFlagCode(race.Circuit.Location.country)}
								/>
								<span className="text-white">{race.raceName}</span>
							</div>
							<div className="text-right">
								<div className="font-mono text-white/70">{result.position}</div>
								<div className="font-mono text-[10px] text-white/40">
									{result.points} pts
								</div>
							</div>
						</TableRow>
					);
				})}
			</div>
		</div>
	);
}
