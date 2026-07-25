import { CSSProperties } from 'react';
import { TeamId } from '@/features/team-theme/teamThemes';
import { getTeamLogoUrl } from '@/features/team-theme/teamLogoUrls';

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
			src={getTeamLogoUrl(teamId)}
			alt=""
			style={style}
			className={`inline-block h-5 w-5 shrink-0 object-contain ${className}`}
		/>
	);
}
