import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { TrendingUp, Lightbulb, BarChart3 } from 'lucide-react';
import Card from '../components/ui/Card';
import { yearlyTotals, historicalEvents, stateRiskDistribution } from '../data/mockData';

const years = ['2022', '2023', '2024', '2025', '2026'];

export default function HistoricalAnalysis() {
  const [year, setYear] = useState('2026');
  const monthly = historicalEvents[year] || [];
  const rainfallVsEvents = monthly.map((m) => ({ month: `M${monthly.indexOf(m) + 1}`, events: m.events, rainfall: m.rainfall }));

  const stackedData = stateRiskDistribution.map((s) => ({
    state: s.state.replace('Arunachal Pradesh', 'A.P.').replace('Meghalaya', 'Megh.'),
    low: s.low,
    moderate: s.moderate,
    high: s.high,
    critical: s.critical,
  }));

  const insights = [
    'High rainfall periods show increased landslide risk. Monsoon months (Jun–Sep) consistently correlate with event spikes.',
    'Historical data improves model learning and risk assessment. Zones with prior landslide history show 3x higher recurrence.',
    'Meghalaya and Mizoram account for the highest density of critical-risk zones due to terrain and rainfall patterns.',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Historical Analysis</h1>
          <p className="mt-1 text-sm text-slate-500">Landslide event trends and rainfall correlation across NER</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${year === y ? 'bg-white text-navy-800 shadow-sm' : 'text-slate-500 hover:text-navy-700'}`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Yearly totals */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {yearlyTotals.map((y) => (
          <div key={y.year} className={`rounded-xl border p-4 ${year === y.year ? 'border-navy-300 bg-navy-50' : 'border-slate-200 bg-white'}`}>
            <p className="text-xs text-slate-500">{y.year}</p>
            <p className="text-2xl font-bold text-navy-800">{y.events}</p>
            <p className="text-[11px] text-slate-400">events</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Landslide Events by Year" subtitle="Total recorded events per year">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyTotals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="events" fill="#1e4a87" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={`Rainfall vs Landslide Events — ${year}`} subtitle="Monthly correlation">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={rainfallVsEvents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar yAxisId="right" dataKey="rainfall" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
                <Line yAxisId="left" type="monotone" dataKey="events" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} name="Events" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Risk Distribution by State" subtitle="Current zone count by risk level across NER states">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="state" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="low" stackId="a" fill="#16a34a" name="Low" radius={[0, 0, 0, 0]} />
              <Bar dataKey="moderate" stackId="a" fill="#eab308" name="Moderate" />
              <Bar dataKey="high" stackId="a" fill="#f97316" name="High" />
              <Bar dataKey="critical" stackId="a" fill="#dc2626" name="Critical" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Insights */}
      <Card title="Key Insights" subtitle="Patterns derived from historical data">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {insights.map((ins, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold uppercase text-slate-400">Insight {i + 1}</span>
              </div>
              <p className="text-sm text-slate-600">{ins}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Demo: Historical event data is simulated for prototype demonstration.
        </div>
      </Card>
    </div>
  );
}
