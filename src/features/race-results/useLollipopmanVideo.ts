import { useQuery } from "@tanstack/react-query";
import { Race } from "@/shared/api/jolpicaClient";
import { getCached, setCached } from "@/shared/api/persistentCache";

function buildKeywords(race: Race): string[] {
  return [race.raceName.split(" ")[0], race.Circuit.Location.locality, race.Circuit.Location.country].filter(
    Boolean
  );
}

// Recherche automatique (via /api/lollipopman-video, fonction serverless Vercel)
// de la video de recap de la chaine Lollipopman Comics correspondant a une course.
// Un match trouve est definitif (le round est passe, la video ne va pas disparaitre)
// donc mis en cache localStorage indefiniment - seul un "pas encore trouve" est
// re-tente a chaque visite (la chaine peut publier en retard).
export function useLollipopmanVideo(race: Race | undefined) {
  const round = race?.round;

  return useQuery({
    queryKey: ["lollipopman-video", round],
    queryFn: async (): Promise<string | null> => {
      const cacheKey = `lollipopmanVideo:${round}`;
      const cached = getCached<string>(cacheKey);
      if (cached) return cached;

      const keywords = buildKeywords(race!).join(",");
      const url = `/api/lollipopman-video?raceDate=${encodeURIComponent(race!.date)}&keywords=${encodeURIComponent(keywords)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`lollipopman-video lookup failed (${res.status})`);
      const data: { videoId: string | null } = await res.json();

      if (data.videoId) setCached(cacheKey, data.videoId);
      return data.videoId;
    },
    enabled: !!race,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
}
