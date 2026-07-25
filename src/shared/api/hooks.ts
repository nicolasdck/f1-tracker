import { useQuery } from "@tanstack/react-query";
import { jolpica } from "./jolpicaClient";

export function useCurrentSeason() {
  return useQuery({
    queryKey: ["season", "current"],
    queryFn: async () => (await jolpica.currentSeason()).MRData.RaceTable.Races,
  });
}

export function useRaceResults(round: number) {
  return useQuery({
    queryKey: ["race", round, "results"],
    queryFn: async () => (await jolpica.raceResults(round)).MRData.RaceTable.Races[0],
    enabled: !!round,
  });
}

export function useDriverStandings(round?: number) {
  return useQuery({
    queryKey: ["standings", "drivers", round ?? "current"],
    queryFn: async () =>
      (await jolpica.driverStandings(round)).MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [],
  });
}

export function useConstructorStandings() {
  return useQuery({
    queryKey: ["standings", "constructors"],
    queryFn: async () =>
      (await jolpica.constructorStandings()).MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [],
  });
}

// Reconstruit l'evolution des points en appelant chaque round deja couru.
// Mis en cache par TanStack Query, donc calcule une seule fois par saison.
export function useStandingsEvolution(completedRounds: number[]) {
  return useQuery({
    queryKey: ["standings", "evolution", completedRounds],
    queryFn: async () => {
      const results = await Promise.all(
        completedRounds.map(async (round) => {
          const standings = (await jolpica.driverStandings(round)).MRData.StandingsTable
            .StandingsLists[0]?.DriverStandings ?? [];
          return { round, standings };
        })
      );
      return results;
    },
    enabled: completedRounds.length > 0,
  });
}

export function useCircuitHistory(circuitId: string) {
  return useQuery({
    queryKey: ["circuit", circuitId, "history"],
    queryFn: async () => (await jolpica.circuitResults(circuitId)).MRData.RaceTable.Races,
    enabled: !!circuitId,
  });
}
