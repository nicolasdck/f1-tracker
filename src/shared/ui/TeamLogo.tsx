import { CSSProperties } from 'react';
import { TeamId } from '@/features/team-theme/teamThemes';

export function TeamLogo({
	teamId,
	className = '',
	style,
}: {
	teamId: TeamId | undefined;
	className?: string;
	style?: CSSProperties;
}) {
	if (!teamId) return null;
	return (
		<img
			src={`/team-logos/${teamId}.png`}
			alt=""
			style={style}
			className={`inline-block h-6 rounded object-cover ${className}`}
		/>
	);
}
