import { useState } from "react";
import { Film, Play } from "lucide-react";

export function LollipopmanVideo({ videoId }: { videoId: string }) {
  const [shown, setShown] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setShown((v) => !v)}
        aria-pressed={shown}
        className="mb-2 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest transition"
        style={{ color: shown ? "var(--color-primary)" : "rgba(255,255,255,0.4)" }}
      >
        Lollipopman Comics
        <Film size={13} />
      </button>

      {shown &&
        (playing ? (
          <div className="relative w-full overflow-hidden rounded-lg border border-white/8 pb-[56.25%]">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Lollipopman Comics"
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group relative block w-full overflow-hidden rounded-lg border border-white/8 pb-[56.25%]"
            aria-label="Lire la vidéo Lollipopman Comics"
          >
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/10">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white transition group-hover:scale-110 group-hover:bg-red-600">
                <Play size={22} fill="currentColor" className="ml-0.5" />
              </span>
            </span>
          </button>
        ))}
    </div>
  );
}
