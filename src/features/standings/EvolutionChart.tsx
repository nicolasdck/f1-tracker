import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getTeamTheme, TeamId } from "@/features/team-theme/teamThemes";

interface EvolutionPoint {
  round: number;
  [driverName: string]: number;
}

interface DriverMeta {
  name: string;
  teamId: TeamId;
}

export function EvolutionChart({
  data,
  drivers,
  favoriteTeam,
}: {
  data: EvolutionPoint[];
  drivers: DriverMeta[];
  favoriteTeam: TeamId;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="round" stroke="rgba(255,255,255,0.3)" fontSize={11} tickFormatter={(r) => `R${r}`} />
        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
        <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 }} />
        {drivers.map((d) => (
          <Line
            key={d.name}
            type="monotone"
            dataKey={d.name}
            stroke={getTeamTheme(d.teamId).primary}
            strokeWidth={d.teamId === favoriteTeam ? 3 : 1.5}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
