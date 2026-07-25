export function Loader({ size = 128 }: { size?: number }) {
	return (
		<div className="flex items-center justify-center py-16">
			<img
				src="/loader.png"
				alt="Chargement…"
				className="animate-spin"
				style={{ width: size, height: size }}
			/>
		</div>
	);
}
