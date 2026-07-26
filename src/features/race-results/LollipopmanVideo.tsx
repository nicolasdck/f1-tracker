import { Film } from 'lucide-react';

export function LollipopmanVideo({ videoId }: { videoId: string }) {
	return (
		<div className="mb-4">
			<div className="mb-2 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-white/40">
				<Film size={13} />
				Lollipopman Comics
			</div>
			<div className="relative w-full overflow-hidden rounded border border-black/20 pb-[56.25%]">
				<iframe
					src={`https://www.youtube.com/embed/${videoId}`}
					title="Lollipopman Comics"
					className="absolute inset-0 h-full w-full"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
				/>
			</div>
		</div>
	);
}
