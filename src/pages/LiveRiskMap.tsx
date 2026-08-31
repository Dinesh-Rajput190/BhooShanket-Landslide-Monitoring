import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RiskMap from '../components/RiskMap';
import Card from '../components/ui/Card';
import RiskBadge from '../components/ui/RiskBadge';
import { riskColor } from '../lib/riskModel';
import { NER_STATES, type RiskLevel, type MonitoringLocation } from '../data/mockData';

const riskLevels: RiskLevel[] = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];

export default function LiveRiskMap() {
  const { locations } = useApp();
  const navigate = useNavigate();
  const [stateFilter, setStateFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');
  const [selected, setSelected] = useState<MonitoringLocation | null>(null);

  const filtered = locations.filter(
    (l) => (stateFilter === 'All' || l.state === stateFilter) && (riskFilter === 'All' || l.riskLevel === riskFilter)
  );
  const highCritical = locations.filter((l) => l.riskLevel === 'HIGH' || l.riskLevel === 'CRITICAL').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Live Landslide Risk Map</h1>
        <p className="mt-1 text-sm text-slate-500">Real-time visualization of monitored and vulnerable zones</p>
      </div>

      {/* Floating-style filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Filter className="h-4 w-4" /> Filters:
        </div>
        <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-navy-700 focus:border-navy-400 focus:outline-none">
          <option value="All">All States</option>
          {NER_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as 'All' | RiskLevel)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-navy-700 focus:border-navy-400 focus:outline-none">
          <option value="All">All Risk Levels</option>
          {riskLevels.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-4 text-xs">
          {riskLevels.map((l) => (
            <span key={l} className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: riskColor(l) }} />
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Map + side panel */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="relative h-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <RiskMap locations={filtered} height="600px" onMarkerClick={setSelected} />
            <div className="absolute left-4 top-4 z-[1000] flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-navy-700 shadow-md ring-1 ring-slate-200">
              <ShieldAlert className="h-4 w-4 text-red-600" />
              {highCritical} High/Critical zones detected
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:col-span-1">
          {selected ? (
            <Card title={selected.name} subtitle={selected.state}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <RiskBadge level={selected.riskLevel} size="md" />
                  <span className="text-sm font-bold text-navy-700">{selected.riskScore}/100</span>
                </div>
                <dl className="space-y-2 text-sm">
                  <Row label="Rainfall" value={`${selected.rainfall} mm`} />
                  <Row label="Soil Moisture" value={`${selected.soilMoisture}%`} />
                  <Row label="Slope Movement" value={`${selected.slopeMovement} mm/day`} />
                  <Row label="Temperature" value={`${selected.temperature}°C`} />
                  <Row label="Slope" value={`${selected.slope}°`} />
                  <Row label="Historical Risk" value={selected.historicalRisk} />
                  <Row label="Last Updated" value={selected.lastUpdated} />
                </dl>
                <button
                  onClick={() => navigate('/prediction')}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
                >
                  View Detailed Risk <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ) : (
            <Card title="Zone Details" subtitle="Click a marker">
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <ShieldAlert className="h-7 w-7 text-slate-400" />
                </div>
                <p className="mt-3 text-sm text-slate-500">Select a location marker on the map to view detailed risk information.</p>
              </div>
              <div className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-100">
                Demo: Map markers show simulated risk data for {locations.length} monitored NER zones.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-navy-800">{value}</dd>
    </div>
  );
}
