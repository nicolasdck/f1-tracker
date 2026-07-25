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

export interface DriverInfo {
  driverId: string;
  givenName: string;
  familyName: string;
  nationality: string;
  code?: string;
  permanentNumber?: string;
  dateOfBirth?: string;
  url?: string;
}

export interface ConstructorInfo {
  constructorId: string;
  name: string;
  nationality: string;
  url?: string;
}

export interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: DriverInfo;
  Constructors: ConstructorInfo[];
}

export interface ConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: ConstructorInfo;
}

export interface RaceResult {
  number: string;
  position: string;
  points: string;
  Driver: DriverInfo;
  Constructor: ConstructorInfo;
  status: string;
  Time?: { time: string };
}

export interface QualifyingResult {
  position: string;
  Driver: DriverInfo;
  Constructor: ConstructorInfo;
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

export interface SprintResult {
  position: string;
  points: string;
  Driver: DriverInfo;
  Constructor: ConstructorInfo;
  status: string;
  Time?: { time: string };
}

export const jolpica = {
  currentSeason: () =>
    jolpicaFetch<{ MRData: { RaceTable: { Races: Race[] } } }>("/current"),

  raceResults: (round: number) =>
    jolpicaFetch<{ MRData: { RaceTable: { Races: (Race & { Results: RaceResult[] })[] } } }>(
      `/current/${round}/results`
    ),

  qualifyingResults: (round: number) =>
    jolpicaFetch<{ MRData: { RaceTable: { Races: (Race & { QualifyingResults: QualifyingResult[] })[] } } }>(
      `/current/${round}/qualifying`
    ),

  sprintResults: (round: number) =>
    jolpicaFetch<{ MRData: { RaceTable: { Races: (Race & { SprintResults: SprintResult[] })[] } } }>(
      `/current/${round}/sprint`
    ),

  driverStandings: (round?: number) =>
    jolpicaFetch<{ MRData: { StandingsTable: { StandingsLists: { DriverStandings: DriverStanding[] }[] } } }>(
      round ? `/current/${round}/driverStandings` : "/current/driverStandings"
    ),

  constructorStandings: (round?: number) =>
    jolpicaFetch<{ MRData: { StandingsTable: { StandingsLists: { ConstructorStandings: ConstructorStanding[] }[] } } }>(
      round ? `/current/${round}/constructorStandings` : "/current/constructorStandings"
    ),

  circuitResults: (circuitId: string) =>
    jolpicaFetch<{ MRData: { RaceTable: { Races: (Race & { Results: RaceResult[] })[] } } }>(
      `/circuits/${circuitId}/results/1`
    ),

  driverSeasonResults: (driverId: string) =>
    jolpicaFetch<{ MRData: { RaceTable: { Races: (Race & { Results: RaceResult[] })[] } } }>(
      `/current/drivers/${driverId}/results`
    ),

  constructorSeasonResults: (constructorId: string) =>
    jolpicaFetch<{ MRData: { RaceTable: { Races: (Race & { Results: RaceResult[] })[] } } }>(
      `/current/constructors/${constructorId}/results`
    ),
};
