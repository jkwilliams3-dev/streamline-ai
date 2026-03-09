import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { trafficSources } from '../../data/mockData';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { name: string; color: string } }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  return (
    <div
      className="rounded-lg p-3 text-sm"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #334155',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <p className="text-gray-500 mb-1.5 font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: item.payload.color }}
        />
        <span className="text-white font-semibold">
          {new Intl.NumberFormat('en-US').format(item.value)} visitors
        </span>
      </div>
    </div>
  );
}

export default function TrafficChart() {
  return (
    <div
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderColor: 'rgba(51, 65, 85, 0.5)',
      }}
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white">Traffic Sources</h3>
        <p className="text-sm text-gray-500 mt-0.5">Visitor breakdown by acquisition channel</p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={trafficSources}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          barCategoryGap="35%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
          <Bar dataKey="visitors" radius={[4, 4, 0, 0]}>
            {trafficSources.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
