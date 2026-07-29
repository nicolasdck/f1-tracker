import { ReactNode, forwardRef } from 'react';
import { getTeamTheme, TeamId } from '@/features/team-theme/teamThemes';

export const Card = forwardRef<
	HTMLDivElement,
	{ children: ReactNode; className?: string; favoriteTeam?: TeamId }
>(function Card({ children, className = '', favoriteTeam }, ref) {
	const theme = favoriteTeam ? getTeamTheme(favoriteTeam) : undefined;

	return (
		<div ref={ref} className={`rounded ${className}`}>
			{children}
			{/*theme?.id}
			<br />
			{theme?.name}
			<br />
			{theme?.primary}
			<br />
			{theme?.ink}
			<br />
			{theme?.bg}
			<br />
			{theme?.text*/}
		</div>
	);
});
