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
	if (!teamId) {
		// Ecurie historique non mappee (vieux constructeur, etc.) - un placeholder
		// garde l'alignement des colonnes au lieu de laisser un trou.
		return (
			<span
				style={style}
				className={`inline-block h-5 w-5 shrink-0 rounded-sm border border-white/10 bg-white/5 ${className}`}
			/>
		);
	}
	return (
		<img
			src={getTeamLogoUrl(teamId)}
			alt=""
			style={style}
			className={`inline-block h-5 w-5 shrink-0 object-contain ${className}`}
		/>
	);
}
