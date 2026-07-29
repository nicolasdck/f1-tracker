import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCurrentSeason } from '@/shared/api/hooks';
import { Card } from '@/shared/ui/Card';
import { Loader } from '@/shared/ui/Loader';
import { useMinDelay } from '@/shared/lib/useMinDelay';
import { getCountryFlagCode } from '@/shared/lib/flags';
import { Flag } from '@/shared/ui/Flag';

// Liste des circuits derivee du calendrier en cours (evite un appel API dedie)
export function CircuitsPage() {
	const { data: races, isLoading } = useCurrentSeason();
	const showLoader = useMinDelay(isLoading);

	if (showLoader) {
		return <Loader />;
	}

	return (
		<div className="space-y-2 p-6">
			{races?.map((race) => (
				<Link
					key={race.Circuit.circuitId}
					to={`/circuits/${race.Circuit.circuitId}`}
				>
					<Card className="bg-black/15 flex items-center justify-between gap-3 px-4 py-3 mb-2 hover:border-white/20">
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
								<div className="flex items-center gap-1.5 text-base font-medium text-white">
									<Flag
										code={getCountryFlagCode(race.Circuit.Location.country)}
									/>
									{race.Circuit.circuitName}
								</div>
								<div className="text-sm text-white/40">
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
