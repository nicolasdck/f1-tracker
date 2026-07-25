import { useQuery } from "@tanstack/react-query";
import { jolpica, DriverStanding, ConstructorStanding } from "./jolpicaClient";
import { getCached, setCached } from "./persistentCache";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Un round deja couru a un classement definitif qui ne changera plus jamais:
// on le met en cache localStorage indefiniment pour ne plus jamais le re-fetcher.
// Les appels sont sequences (pas Promise.all) pour ne pas saturer le rate-limit
// de l'API gratuite Jolpica (429 en cas de rafale).
async function fetchRoundsSequential<T>(
  rounds: number[],
  cacheNamespace: string,
  fetchRound: (round: number) => Promise<T>
): Promise<{ round: number; standings: T }[]> {
  const results: { round: number; standings: T }[] = [];
  for (const round of rounds) {
    const cacheKey = `${cacheNamespace}:${round}`;
    const cached = getCached<T>(cacheKey);
    if (cached) {
      results.push({ round, standings: cached });
      continue;
    }
    const standings = await fetchRound(round);
    setCached(cacheKey, standings);
    results.push({ round, standings });
    await sleep(120);
  }
  return results;
}

export function useCurrentSeason() {
  return useQuery({
    queryKey: ["season", "current"],
    queryFn: async () => (await jolpica.currentSeason()).MRData.RaceTable.Races,
  });
}

export function useRaceResults(round: number, enabled = true) {
  return useQuery({
    queryKey: ["race", round, "results"],
    queryFn: async () => (await jolpica.raceResults(round)).MRData.RaceTable.Races[0] ?? null,
    enabled: !!round && enabled,
  });
}

export function useQualifyingResults(round: number, enabled = true) {
  return useQuery({
    queryKey: ["race", round, "qualifying"],
    queryFn: async () => (await jolpica.qualifyingResults(round)).MRData.RaceTable.Races[0] ?? null,
    enabled: !!round && enabled,
  });
}

export function useSprintResults(round: number, enabled = true) {
  return useQuery({
    queryKey: ["race", round, "sprint"],
    queryFn: async () => (await jolpica.sprintResults(round)).MRData.RaceTable.Races[0] ?? null,
    enabled: !!round && enabled,
  });
}

export function useDriverStandings(round?: number, enabled = true) {
  return useQuery({
    queryKey: ["standings", "drivers", round ?? "current"],
    queryFn: async () =>
      (await jolpica.driverStandings(round)).MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [],
    enabled,
  });
}

export function useConstructorStandings(round?: number, enabled = true) {
  return useQuery({
    queryKey: ["standings", "constructors", round ?? "current"],
    queryFn: async () =>
      (await jolpica.constructorStandings(round)).MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [],
    enabled,
  });
}

// Reconstruit l'evolution des points en appelant chaque round deja couru.
// Sequence + mis en cache localStorage (voir fetchRoundsSequential) pour n'appeler
// l'API qu'une seule fois par round, jamais plus. `enabled` permet de ne fetcher
// que si l'onglet Evolution est reellement affiche.
export function useStandingsEvolution(completedRounds: number[], enabled = true) {
  return useQuery({
    queryKey: ["standings", "evolution", "drivers", completedRounds],
    queryFn: () =>
      fetchRoundsSequential<DriverStanding[]>(completedRounds, "driverStandings", async (round) => {
        const res = await jolpica.driverStandings(round);
        return res.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
      }),
    enabled: completedRounds.length > 0 && enabled,
    staleTime: Infinity,
  });
}

export function useConstructorStandingsEvolution(completedRounds: number[], enabled = true) {
  return useQuery({
    queryKey: ["standings", "evolution", "constructors", completedRounds],
    queryFn: () =>
      fetchRoundsSequential<ConstructorStanding[]>(completedRounds, "constructorStandings", async (round) => {
        const res = await jolpica.constructorStandings(round);
        return res.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];
      }),
    enabled: completedRounds.length > 0 && enabled,
    staleTime: Infinity,
  });
}

export function useCircuitHistory(circuitId: string) {
  return useQuery({
    queryKey: ["circuit", circuitId, "history"],
    queryFn: async () => (await jolpica.circuitResults(circuitId)).MRData.RaceTable.Races,
    enabled: !!circuitId,
  });
}
