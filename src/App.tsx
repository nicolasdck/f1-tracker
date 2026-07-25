import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { TeamSelector } from '@/features/team-theme/TeamSelector';
import { Modal } from '@/shared/ui/Modal';
import { CalendarPage } from '@/features/calendar/CalendarPage';
import { RaceResultsPage } from '@/features/race-results/RaceResultsPage';
import { StandingsPage } from '@/features/standings/StandingsPage';
import { CircuitsPage } from '@/features/circuits/CircuitsPage';
import { CircuitHistoryPage } from '@/features/circuits/CircuitHistoryPage';

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

export default function App() {
	const [settingsOpen, setSettingsOpen] = useState(false);
	return (
		<div className="min-h-screen font-sans">
			<Header onOpenSettings={() => setSettingsOpen(true)} />
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
