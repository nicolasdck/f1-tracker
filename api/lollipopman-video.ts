import type { VercelRequest, VercelResponse } from "@vercel/node";
import { findLollipopmanVideo } from "./_lib/lollipopmanLookup.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "YOUTUBE_API_KEY manquante côté serveur" });
    return;
  }

  const raceDate = typeof req.query.raceDate === "string" ? req.query.raceDate : undefined;
  const keywordsParam = typeof req.query.keywords === "string" ? req.query.keywords : "";
  const keywords = keywordsParam
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  if (!raceDate || keywords.length === 0) {
    res.status(400).json({ error: "Paramètres raceDate et keywords requis" });
    return;
  }

  try {
    const match = await findLollipopmanVideo(apiKey, raceDate, keywords);
    const cacheControl = match.videoId
      ? "public, s-maxage=86400, stale-while-revalidate=604800"
      : "public, s-maxage=3600, stale-while-revalidate=86400";
    res.setHeader("Cache-Control", cacheControl);
    res.status(200).json(match);
  } catch (err) {
    res.status(502).json({ error: err instanceof Error ? err.message : "Erreur inconnue" });
  }
}
