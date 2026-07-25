// Client pour l'API Jolpica-F1 (remplaçant communautaire d'Ergast, compatible, sans auth)
// Base URL a reverifier dans la doc officielle si elle change: https://api.jolpi.ca/ergast/
const BASE_URL = "https://api.jolpi.ca/ergast/f1";

async function jolpicaFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}.json`);
  if (!res.ok) {
    throw new Error(`Jolpica API error ${res.status} sur ${path}`);
  }
  return res.json();
}

export interface RaceSession {
  date: string;
  time?: string;
}

export interface Race {
  round: string;
  raceName: string;
  date: string;
  time?: string;
  FirstPractice?: RaceSession;
  SecondPractice?: RaceSession;
  ThirdPractice?: RaceSession;
  Qualifying?: RaceSession;
  Sprint?: RaceSession;
  SprintQualifying?: RaceSession;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: { locality: string; country: string };
  };
}

export interface DriverStanding {
  position: string;
  points: string;
  Driver: { driverId: string; givenName: string; familyName: string };
  Constructors: { constructorId: string; name: string }[];
}

export interface ConstructorStanding {
  position: string;
  points: string;
  Constructor: { constructorId: string; name: string };
}

export interface RaceResult {
  number: string;
  position: string;
  points: string;
  Driver: { driverId: string; givenName: string; familyName: string };
  Constructor: { constructorId: string; name: string };
  status: string;
}

export const jolpica = {
  currentSeason: () =>
    jolpicaFetch<{ MRData: { RaceTable: { Races: Race[] } } }>("/current"),

  raceResults: (round: number) =>
    jolpicaFetch<{ MRData: { RaceTable: { Races: (Race & { Results: RaceResult[] })[] } } }>(
      `/current/${round}/results`
    ),

  driverStandings: (round?: number) =>
    jolpicaFetch<{ MRData: { StandingsTable: { StandingsLists: { DriverStandings: DriverStanding[] }[] } } }>(
      round ? `/current/${round}/driverStandings` : "/current/driverStandings"
    ),

  constructorStandings: () =>
    jolpicaFetch<{ MRData: { StandingsTable: { StandingsLists: { ConstructorStandings: ConstructorStanding[] }[] } } }>(
      "/current/constructorStandings"
    ),

  circuitResults: (circuitId: string) =>
    jolpicaFetch<{ MRData: { RaceTable: { Races: (Race & { Results: RaceResult[] })[] } } }>(
      `/circuits/${circuitId}/results/1`
    ),
};
