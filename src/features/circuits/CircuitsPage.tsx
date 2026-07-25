import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCurrentSeason } from '@/shared/api/hooks';
import { Card } from '@/shared/ui/Card';
import { Skeleton } from '@/shared/ui/Skeleton';
import { getCountryFlag } from '@/shared/lib/flags';

// Liste des circuits derivee du calendrier en cours (evite un appel API dedie)
export function CircuitsPage() {
	const { data: races, isLoading } = useCurrentSeason();

	if (isLoading) {
		return (
			<div className="space-y-2 p-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={i} className="h-14 w-full" />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-2 p-6">
			{races?.map((race) => (
				<Link
					key={race.Circuit.circuitId}
					to={`/circuits/${race.Circuit.circuitId}`}
				>
					<Card className="flex items-center justify-between gap-3 px-4 py-3 mb-2 hover:border-white/20">
						<div className="flex items-center gap-3">
							<img
								src={`/circuits/${race.Circuit.circuitId}.png`}
								alt=""
								className="h-10 w-14 shrink-0 object-contain opacity-70"
								onError={(e) => {
									e.currentTarget.style.display = 'none';
								}}
							/>
							<div>
								<div className="flex items-center gap-1.5 text-sm font-medium text-white">
									<span>{getCountryFlag(race.Circuit.Location.country)}</span>
									{race.Circuit.circuitName}
								</div>
								<div className="text-xs text-white/40">
									{race.Circuit.Location.country}
								</div>
							</div>
						</div>
						<ChevronRight size={16} className="text-white/25" />
					</Card>
				</Link>
			))}
		</div>
	);
}
