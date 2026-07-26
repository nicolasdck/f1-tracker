import { Check } from 'lucide-react';
import { TEAM_THEMES } from './teamThemes';
import { useTeamTheme } from './ThemeProvider';
import { getTeamLogoUrl } from './teamLogoUrls';

export function TeamSelector() {
	const { teamId, setTeamId } = useTeamTheme();
	return (
		<div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
			{TEAM_THEMES.map((t) => {
				const active = teamId === t.id;
				return (
					<button
						key={t.id}
						onClick={() => setTeamId(t.id)}
						className="relative flex flex-col items-center gap-2 rounded p-3 transition"
						style={{
							border: active ? `1px solid ${t.primary}` : '1px solid transparent',
							backgroundColor: active ? `${t.primary}26` : `${t.primary}0d`,
						}}
					>
						{active && (
							<span
								className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full"
								style={{ backgroundColor: t.primary, color: t.ink }}
							>
								<Check size={10} strokeWidth={3} />
							</span>
						)}
						<img
							src={getTeamLogoUrl(t.id)}
							alt={t.name}
							className="h-10 w-10 object-contain"
						/>
						<span
							className="text-center text-xs font-medium"
							style={{ color: active ? t.primary : 'rgba(255,255,255,0.7)' }}
						>
							{t.name}
						</span>
					</button>
				);
			})}
		</div>
	);
}
