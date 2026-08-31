import { useState } from 'react';
import { CloudRain, Droplets, Mountain, Thermometer, Radio } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import type { LucideIcon } from 'lucide-react';

const statusClass: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Warning: 'bg-yellow-100 text-yellow-700',
  Critical: 'bg-red-100 text-red-700',
  Offline: 'bg-slate-200 text-slate-600',
};

const timeRanges = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days'];

function genSeries(points: number, base: number, variance: number, trend = 0) {
  return Array.from({ length: points }, (_, i) => ({
    label: `${i}h`,
    value: Math.max(0, Math.round(base + Math.sin(i / 2) * variance + trend * i)),
  }));
}

function genDays(points: number, base: number, variance: number) {
  return Array.from({ length: points }, (_, i) => ({
    label: `D${i + 1}`,
    value: Math.max(0, Math.round(base + Math.sin(i / 1.5) * variance)),
  }));
}

export default function SensorMonitoring() {
  const { sensors } = useApp();
  const [range, setRange] = useState(timeRanges[0]);

  const rainfallData = range === 'Last 24 Hours' ? genSeries(24, 55, 25) : range === 'Last 7 Days' ? genDays(7, 60, 30) : genDays(30, 50, 35);
  const soilData = range === 'Last 24 Hours' ? genSeries(24, 68, 12) : range === 'Last 7 Days' ? genDays(7, 65, 14) : genDays(30, 62, 18);
  const slopeData = range === 'Last 24 Hours' ? genSeries(24, 7, 4, 0.1) : range === 'Last 7 Days' ? genDays(7, 8, 5) : genDays(30, 6, 6);

  const summary = [
    { title: 'Rainfall Sensors', value: 96, icon: CloudRain, color: 'bg-blue-100 text-blue-700' },
    { title: 'Soil Moisture Sensors', value: 88, icon: Droplets, color: 'bg-cyan-100 text-cyan-700' },
    { title: 'Slope Movement Sensors', value: 72, icon: Mountain, color: 'bg-orange-100 text-orange-700' },
    { title: 'Weather Sensors', value: 86, icon: Thermometer, color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Sensor Monitoring</h1>
          <p className="mt-1 text-sm text-slate-500">Real-time IoT sensor network across NER monitoring zones</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-green-100">
          <span className="live-dot h-2 w-2 rounded-full bg-green-500" />
          LIVE UPDATES — Demo simulation
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summary.map((s) => (
          <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-800">{s.value}</p>
                <p className="text-xs text-slate-500">{s.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sensor table */}
      <Card title="Sensor Network Status" subtitle={`${sensors.length} sensors reporting`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase text-slate-400">
                <th className="pb-2 pr-4">Sensor ID</th>
                <th className="pb-2 pr-4">Location</th>
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Value</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sensors.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4 font-mono text-xs font-semibold text-navy-700">{s.id}</td>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-navy-800">{s.location}</p>
                    <p className="text-xs text-slate-400">{s.state}</p>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{s.type}</td>
                  <td className="py-3 pr-4 font-semibold text-navy-800">{s.value}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="py-3 text-slate-400">{s.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-800">Sensor Trends</h2>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${range === r ? 'bg-white text-navy-800 shadow-sm' : 'text-slate-500 hover:text-navy-700'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Rainfall Trend" subtitle="mm over time">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallData}>
                <defs>
                  <linearGradient id="gRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#gRain)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Soil Moisture Trend" subtitle="% over time">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={soilData}>
                <defs>
                  <linearGradient id="gSoil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fill="url(#gSoil)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Slope Movement Trend" subtitle="mm/day over time">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={slopeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500 ring-1 ring-slate-100">
        Demo: Sensor readings are simulated and refreshed in-memory for prototype demonstration.
      </div>
    </div>
  );
}
