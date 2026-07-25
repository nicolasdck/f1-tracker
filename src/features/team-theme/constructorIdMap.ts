import { TeamId } from "./teamThemes";

// Jolpica utilise ses propres constructorId (ex: "red_bull", "rb"), a mapper vers nos TeamId internes
export const CONSTRUCTOR_ID_MAP: Record<string, TeamId> = {
  mclaren: "mclaren",
  mercedes: "mercedes",
  red_bull: "redbull",
  ferrari: "ferrari",
  williams: "williams",
  haas: "haas",
  aston_martin: "astonmartin",
  rb: "racingbulls",
  alpine: "alpine",
  audi: "audi",
  cadillac: "cadillac",
};
