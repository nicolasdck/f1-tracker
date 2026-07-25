import { useEffect, useRef, useState } from "react";

/**
 * Garde `active` a true pendant au moins `minMs`, meme si la valeur source
 * redevient false plus tot - evite un flash du loader si les donnees
 * arrivent tres vite, sans jamais rallonger un chargement deja plus long.
 */
export function useMinDelay(active: boolean, minMs = 1000): boolean {
  const [show, setShow] = useState(active);
  const startedAt = useRef<number | null>(active ? Date.now() : null);

  useEffect(() => {
    if (active) {
      startedAt.current = Date.now();
      setShow(true);
      return;
    }
    const elapsed = startedAt.current ? Date.now() - startedAt.current : minMs;
    const remaining = Math.max(0, minMs - elapsed);
    const timer = setTimeout(() => setShow(false), remaining);
    return () => clearTimeout(timer);
  }, [active, minMs]);

  return show;
}
