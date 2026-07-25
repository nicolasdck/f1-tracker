import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Download, Settings } from 'lucide-react';
import { TeamSelector } from '@/features/team-theme/TeamSelector';
import { Modal } from '@/shared/ui/Modal';
import { useInstallPrompt } from '@/pwa/InstallPromptProvider';
import { CalendarPage } from '@/features/calendar/CalendarPage';
import { RaceResultsPage } from '@/features/race-results/RaceResultsPage';
import { StandingsPage } from '@/features/standings/StandingsPage';
import { CircuitsPage } from '@/features/circuits/CircuitsPage';
import { CircuitHistoryPage } from '@/features/circuits/CircuitHistoryPage';

const LAST_PATH_KEY = 'f1-tracker:last-path';

// Au premier chargement, si on atterrit sur la racine (ex: lancement de la PWA),
// on redirige vers le dernier onglet visite plutot que de toujours revenir au Calendrier.
function useRestoreLastPath() {
	const location = useLocation();
	const navigate = useNavigate();
	const hasRestored = useRef(false);

	useEffect(() => {
		if (!hasRestored.current) {
			hasRestored.current = true;
			if (location.pathname === '/') {
				const lastPath = localStorage.getItem(LAST_PATH_KEY);
				if (lastPath && lastPath !== '/') {
					navigate(lastPath, { replace: true });
					return;
				}
			}
		}
		localStorage.setItem(LAST_PATH_KEY, location.pathname + location.search);
	}, [location, navigate]);
}

const NAV = [
	{ to: '/', label: 'Calendrier' },
	{ to: '/standings', label: 'Classements' },
	{ to: '/circuits', label: 'Circuits' },
];

function Header({ onOpenSettings }: { onOpenSettings: () => void }) {
	const location = useLocation();
	return (
		<div className="flex flex-col items-center justify-between border-b border-white/10 px-3 py-2">
			<div className="w-full flex items-center justify-between gap-2 mb-3">
				<img src="/f1.png" alt="F1" width="150" height="100" className="" />
				<button
					onClick={onOpenSettings}
					className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white/90"
					aria-label="Préférences"
				>
					<Settings size={18} />
				</button>
			</div>
			<nav className="flex gap-1">
				{NAV.map((item) => {
					const active = location.pathname === item.to;
					return (
						<Link
							key={item.to}
							to={item.to}
							className="rounded-full px-4 py-1.5 text-sm font-medium transition"
							style={
								active
									? {
											backgroundColor: 'var(--color-primary)',
											color: 'var(--color-primary-ink)',
										}
									: { color: 'rgba(255,255,255,0.6)' }
							}
						>
							{item.label}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}

function InstallBanner() {
	const { canInstall, promptInstall } = useInstallPrompt();
	if (!canInstall) return null;
	return (
		<div
			className="flex items-center justify-between gap-3 px-4 py-2 text-sm"
			style={{
				backgroundColor: 'var(--color-primary)',
				color: 'var(--color-primary-ink)',
			}}
		>
			<span className="flex items-center gap-2 font-medium">
				<Download size={16} />
				Installer "F1 Tracker" sur cet appareil
			</span>
			<button
				onClick={promptInstall}
				className="shrink-0 rounded-full bg-black/15 px-3 py-1 font-medium transition hover:bg-black/25"
			>
				Installer
			</button>
		</div>
	);
}

export default function App() {
	const [settingsOpen, setSettingsOpen] = useState(false);
	useRestoreLastPath();
	return (
		<div className="min-h-screen font-sans">
			<Header onOpenSettings={() => setSettingsOpen(true)} />
			<InstallBanner />
			<Modal
				open={settingsOpen}
				onClose={() => setSettingsOpen(false)}
				title="Écurie préférée"
			>
				<TeamSelector />
			</Modal>
			<Routes>
				<Route path="/" element={<CalendarPage />} />
				<Route path="/race/:round" element={<RaceResultsPage />} />
				<Route path="/standings" element={<StandingsPage />} />
				<Route path="/circuits" element={<CircuitsPage />} />
				<Route path="/circuits/:circuitId" element={<CircuitHistoryPage />} />
			</Routes>
		</div>
	);
}
