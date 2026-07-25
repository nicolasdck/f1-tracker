// Logique pure (pas de req/res) partagee entre la fonction serverless Vercel
// (api/lollipopman-video.ts) et le middleware de dev Vite (vite.config.ts), pour
// que `npm run dev` ET le deploiement Vercel se comportent identiquement.

// Chaine Lollipopman Comics (https://www.youtube.com/@lollipopmancomics), channel id
// UCvBO5Do9eiSDVY3qY7tfX7A. Uploads playlist = channel id avec "UC" remplace par "UU"
// (convention YouTube standard).
const UPLOADS_PLAYLIST_ID = "UUvBO5Do9eiSDVY3qY7tfX7A";

// Les vraies videos de recap ont toujours un titre du type
// "... | {Course} GP {annee}" (ex: "Peak Pace | Austrian GP 2026").
// Ca les distingue des shorts/memes/autres contenus postes entre deux.
const RECAP_TITLE_PATTERN = /\bGP\s*20\d{2}\b/i;

// La chaine publie generalement le mercredi suivant le week-end de course.
const MATCH_WINDOW_DAYS = 10;
const MAX_PAGES = 5;

interface PlaylistItem {
  snippet: {
    publishedAt: string;
    title: string;
    resourceId: { videoId: string };
  };
}

async function fetchPlaylistPage(apiKey: string, pageToken?: string) {
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("playlistId", UPLOADS_PLAYLIST_ID);
  url.searchParams.set("maxResults", "50");
  url.searchParams.set("key", apiKey);
  if (pageToken) url.searchParams.set("pageToken", pageToken);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`YouTube API error ${res.status}`);
  }
  return res.json() as Promise<{ items: PlaylistItem[]; nextPageToken?: string }>;
}

export interface LollipopmanMatch {
  videoId: string | null;
  title?: string;
}

export async function findLollipopmanVideo(
  apiKey: string,
  raceDate: string,
  keywords: string[]
): Promise<LollipopmanMatch> {
  const windowStart = new Date(raceDate).getTime();
  const windowEnd = windowStart + MATCH_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  let pageToken: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await fetchPlaylistPage(apiKey, pageToken);

    for (const item of data.items) {
      const publishedAt = new Date(item.snippet.publishedAt).getTime();
      if (publishedAt < windowStart) {
        // Playlist triee du plus recent au plus ancien: passe la fenetre, on arrete.
        return { videoId: null };
      }
      if (publishedAt > windowEnd) continue;

      const title = item.snippet.title.toLowerCase();
      if (!RECAP_TITLE_PATTERN.test(item.snippet.title)) continue;
      if (keywords.some((k) => title.includes(k))) {
        return { videoId: item.snippet.resourceId.videoId, title: item.snippet.title };
      }
    }

    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }

  return { videoId: null };
}
