import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { findLollipopmanVideo } from './api/_lib/lollipopmanLookup';

// `npm run dev` (Vite seul) ne sert pas les fonctions serverless de /api -
// seul `vercel dev` le fait. Ce plugin reproduit le comportement de
// api/lollipopman-video.ts en local pour que les deux workflows se comportent
// pareil, en reutilisant la meme logique de matching (api/_lib).
function lollipopmanDevApi(apiKey: string | undefined): Plugin {
	return {
		name: 'lollipopman-dev-api',
		configureServer(server) {
			server.middlewares.use('/api/lollipopman-video', async (req, res) => {
				res.setHeader('Content-Type', 'application/json');
				if (!apiKey) {
					res.statusCode = 500;
					res.end(JSON.stringify({ error: 'YOUTUBE_API_KEY manquante (voir .env.local)' }));
					return;
				}

				const url = new URL(req.url ?? '', 'http://localhost');
				const raceDate = url.searchParams.get('raceDate');
				const keywords = (url.searchParams.get('keywords') ?? '')
					.split(',')
					.map((k) => k.trim().toLowerCase())
					.filter(Boolean);

				if (!raceDate || keywords.length === 0) {
					res.statusCode = 400;
					res.end(JSON.stringify({ error: 'Paramètres raceDate et keywords requis' }));
					return;
				}

				try {
					const match = await findLollipopmanVideo(apiKey, raceDate, keywords);
					res.statusCode = 200;
					res.end(JSON.stringify(match));
				} catch (err) {
					res.statusCode = 502;
					res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Erreur inconnue' }));
				}
			});
		},
	};
}

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			react(),
			lollipopmanDevApi(env.YOUTUBE_API_KEY),
			VitePWA({
				registerType: 'autoUpdate',
				injectRegister: null,
				manifest: {
					name: 'F1 Tracker',
					short_name: 'F1',
					description: 'Calendrier, résultats et classements F1',
					start_url: '/',
					scope: '/',
					display: 'standalone',
					background_color: '#0B0D10',
					theme_color: '#0B0D10',
					icons: [
						{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
						{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
						{
							src: '/icons/icon-512-maskable.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'maskable',
						},
					],
				},
				workbox: {
					cleanupOutdatedCaches: true,
					clientsClaim: true,
					skipWaiting: true,
				},
			}),
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
	};
});
