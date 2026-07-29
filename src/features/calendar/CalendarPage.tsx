import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { useCurrentSeason } from '@/shared/api/hooks';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Loader } from '@/shared/ui/Loader';
import { useMinDelay } from '@/shared/lib/useMinDelay';
import {
	formatDate,
	isRacePast,
	isRaceWeekendStarted,
} from '@/shared/lib/date';
import { getCountryFlagCode } from '@/shared/lib/flags';
import { Flag } from '@/shared/ui/Flag';
import { SessionsPanel } from './SessionsPanel';
import { Countdown } from './Countdown';
import { useTeamTheme } from '@/features/team-theme/ThemeProvider';

function isPast(race: { date: string; time?: string }) {
	return isRacePast(race.date, race.time);
}

export function CalendarPage() {
	const { data: races, isLoading, error } = useCurrentSeason();
	const showLoader = useMinDelay(isLoading);
	const nextRaceRef = useRef<HTMLDivElement>(null);
	const nextRoundForScroll = races?.find((r) => !isPast(r))?.round;

	const { teamId } = useTeamTheme();

	useEffect(() => {
		// Le loader reste affiche au moins 1s (useMinDelay): tant que showLoader
		// est true, la liste n'est pas montee et la ref est encore null - il faut
		// que l'effet se redeclenche une fois la liste reellement affichee.
		if (!nextRoundForScroll || showLoader) return;
		nextRaceRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	}, [nextRoundForScroll, showLoader]);

	if (showLoader) {
		return <Loader />;
	}

	if (error) {
		return (
			<div className="p-6 text-sm text-white/50">
				Impossible de charger le calendrier.
			</div>
		);
	}

	const nextRace = races?.find((r) => !isPast(r));

	return (
		<div className="space-y-2 p-6">
			{races?.map((race) => {
				const done = isPast(race);
				const isNext = race.round === nextRace?.round;
				const isCurrent = isNext && isRaceWeekendStarted(race.date, race.time);
				const cardBody = (
					<Card
						ref={isNext ? nextRaceRef : undefined}
						className={`bg-black/15 px-4 py-3 ${done ? 'transition hover:border-white/20' : ''}`}
						favoriteTeam={teamId}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<span className="font-mono text-xs text-white/30">
									{race.round.padStart(2, '0')}
								</span>
								<div>
									<div className="flex items-center gap-1.5 text-base font-medium text-white">
										<Flag
											code={getCountryFlagCode(race.Circuit.Location.country)}
										/>
										{race.raceName}
									</div>
									<div className="flex items-center gap-1 text-sm text-white/40">
										<MapPin size={11} /> {race.Circuit.Location.locality} ·{' '}
										{formatDate(race.date, race.time)}
									</div>
								</div>
							</div>
							{isCurrent ? (
								<Badge variant="primary">En Cours</Badge>
							) : done ? (
								<ChevronRight size={16} className="text-white/25" />
							) : (
								<Badge>À venir</Badge>
							)}
						</div>
						{isNext && (
							<div className="mt-3">
								<Countdown race={race} />
							</div>
						)}
						{isNext && <SessionsPanel race={race} />}
					</Card>
				);

				if (done) {
					return (
						<Link key={race.round} to={`/race/${race.round}`} className="block">
							{cardBody}
						</Link>
					);
				}
				return <div key={race.round}>{cardBody}</div>;
			})}
		</div>
	);
}
