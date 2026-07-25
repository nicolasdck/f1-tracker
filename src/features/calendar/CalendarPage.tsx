import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { useCurrentSeason } from '@/shared/api/hooks';
import { Race } from '@/shared/api/jolpicaClient';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Skeleton } from '@/shared/ui/Skeleton';
import { formatDate, formatSessionTime } from '@/shared/lib/date';

function isPast(dateStr: string) {
	return new Date(dateStr) < new Date();
}

function getSessions(race: Race) {
	const sessions = [
		{ label: 'Essais Libres 1', session: race.FirstPractice },
		{ label: 'Essais Libres 2', session: race.SecondPractice },
		{ label: 'Essais Libres 3', session: race.ThirdPractice },
		{ label: 'Qualifs Sprint', session: race.SprintQualifying },
		{ label: 'Sprint', session: race.Sprint },
		{ label: 'Qualifications', session: race.Qualifying },
		{ label: 'Course', session: { date: race.date, time: race.time } },
	].filter(
		(s): s is { label: string; session: NonNullable<typeof s.session> } =>
			!!s.session,
	);

	return sessions.sort(
		(a, b) =>
			new Date(`${a.session.date}T${a.session.time ?? '00:00:00Z'}`).getTime() -
			new Date(`${b.session.date}T${b.session.time ?? '00:00:00Z'}`).getTime(),
	);
}

export function CalendarPage() {
	const { data: races, isLoading, error } = useCurrentSeason();
	const nextRaceRef = useRef<HTMLDivElement>(null);
	const nextRoundForScroll = races?.find((r) => !isPast(r.date))?.round;

	useEffect(() => {
		if (!nextRoundForScroll) return;
		nextRaceRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	}, [nextRoundForScroll]);

	if (isLoading) {
		return (
			<div className="space-y-2 p-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={i} className="h-16 w-full" />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6 text-sm text-white/50">
				Impossible de charger le calendrier.
			</div>
		);
	}

	const nextRace = races?.find((r) => !isPast(r.date));

	return (
		<div className="space-y-2 p-6">
			{races?.map((race) => {
				const done = isPast(race.date);
				const isNext = race.round === nextRace?.round;
				return (
					<Card
						key={race.round}
						ref={isNext ? nextRaceRef : undefined}
						className="px-4 py-3"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<span className="font-mono text-xs text-white/30">
									{race.round.padStart(2, '0')}
								</span>
								<div>
									<div className="text-sm font-medium text-white">
										{race.raceName}
									</div>
									<div className="flex items-center gap-1 text-xs text-white/40">
										<MapPin size={11} /> {race.Circuit.Location.locality} ·{' '}
										{formatDate(race.date, race.time)}
									</div>
								</div>
							</div>
							{isNext ? (
								<Badge variant="primary">Prochaine</Badge>
							) : done ? (
								<Link to={`/race/${race.round}`}>
									<ChevronRight
										size={16}
										className="text-white/25 hover:text-white/60"
									/>
								</Link>
							) : (
								<Badge>À venir</Badge>
							)}
						</div>
						{isNext && (
							<div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 border-t border-white/10 pt-3 text-xs sm:grid-cols-4">
								{getSessions(race).map(({ label, session }) => (
									<div
										key={label}
										className="flex items-center justify-between gap-2"
									>
										<span className="text-white/40">{label}</span>
										<span className="font-mono text-white/80">
											{formatSessionTime(session.date, session.time)}
										</span>
									</div>
								))}
							</div>
						)}
					</Card>
				);
			})}
		</div>
	);
}
