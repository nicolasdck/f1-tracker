import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import { useCurrentSeason } from "@/shared/api/hooks";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { Skeleton } from "@/shared/ui/Skeleton";

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export function CalendarPage() {
  const { data: races, isLoading, error } = useCurrentSeason();
  const nextRaceRef = useRef<HTMLDivElement>(null);
  const nextRoundForScroll = races?.find((r) => !isPast(r.date))?.round;

  useEffect(() => {
    if (!nextRoundForScroll) return;
    nextRaceRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [nextRoundForScroll]);

  if (isLoading) {
    return (
      <div className="space-y-2 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-sm text-white/50">Impossible de charger le calendrier.</div>;
  }

  const nextRace = races?.find((r) => !isPast(r.date));

  return (
    <div className="space-y-2 p-6">
      {races?.map((race) => {
        const done = isPast(race.date);
        const isNext = race.round === nextRace?.round;
        return (
          <Card
            key={race.round}
            ref={isNext ? nextRaceRef : undefined}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-white/30">
                {race.round.padStart(2, "0")}
              </span>
              <div>
                <div className="text-sm font-medium text-white">{race.raceName}</div>
                <div className="flex items-center gap-1 text-xs text-white/40">
                  <MapPin size={11} /> {race.Circuit.Location.locality} · {race.date}
                </div>
              </div>
            </div>
            {isNext ? (
              <Badge variant="primary">Prochaine</Badge>
            ) : done ? (
              <Link to={`/race/${race.round}`}>
                <ChevronRight size={16} className="text-white/25 hover:text-white/60" />
              </Link>
            ) : (
              <Badge>À venir</Badge>
            )}
          </Card>
        );
      })}
    </div>
  );
}
