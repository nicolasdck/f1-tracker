import { TeamId } from '@/features/team-theme/teamThemes';

export function TeamLogo({
	teamId,
	className = '',
}: {
	teamId: TeamId | undefined;
	className?: string;
}) {
	if (!teamId) return null;
	return (
		<img
			src={`/team-logos/${teamId}.png`}
			alt=""
			className={`inline-block h-6 rounded object-cover ${className}`}
		/>
	);
}
