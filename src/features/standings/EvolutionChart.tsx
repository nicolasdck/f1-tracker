import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import { getTeamTheme, TeamId } from "@/features/team-theme/teamThemes";

interface EvolutionPoint {
  round: number;
  [seriesName: string]: number;
}

interface SeriesMeta {
  name: string;
  teamId: TeamId;
}

function EvolutionTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="max-w-[280px] rounded-md border border-white/10 bg-[#111] p-2.5 text-xs">
      <div className="mb-1.5 font-mono text-white/50">Round {label}</div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {payload.map((p) => (
          <div key={p.dataKey} style={{ color: p.color }} className="truncate">
            {p.dataKey} : {p.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EvolutionChart({
  data,
  series,
  favoriteTeam,
}: {
  data: EvolutionPoint[];
  series: SeriesMeta[];
  favoriteTeam: TeamId;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="round" stroke="rgba(255,255,255,0.3)" fontSize={11} tickFormatter={(r) => `R${r}`} />
        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
        <Tooltip content={<EvolutionTooltip />} />
        {series.map((s) => (
          <Line
            key={s.name}
            type="monotone"
            dataKey={s.name}
            stroke={getTeamTheme(s.teamId).primary}
            strokeWidth={s.teamId === favoriteTeam ? 3 : 1.5}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
