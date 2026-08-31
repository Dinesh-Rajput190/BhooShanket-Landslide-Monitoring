import { useNavigate } from 'react-router-dom';
import { Map, Radio, AlertTriangle, Bell, ArrowRight, Play, Zap, Database, Brain, MapPin, ShieldAlert, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import RiskBadge from '../components/ui/RiskBadge';
import RiskMap from '../components/RiskMap';
import { riskColor } from '../lib/riskModel';
import type { RiskLevel } from '../data/mockData';

const riskSummary: { level: RiskLevel; count: number; desc: string }[] = [
  { level: 'LOW', count: 78, desc: 'Stable zones' },
  { level: 'MODERATE', count: 24, desc: 'Monitor closely' },
  { level: 'HIGH', count: 18, desc: 'Elevated risk' },
  { level: 'CRITICAL', count: 8, desc: 'Immediate action' },
];

const processSteps = [
  { label: 'DATA COLLECTION', icon: Database },
  { label: 'AI RISK PREDICTION', icon: Brain },
  { label: 'GIS VISUALIZATION', icon: MapPin },
  { label: 'EARLY WARNING', icon: ShieldAlert },
  { label: 'PREVENTIVE ACTION', icon: Activity },
];

export default function Dashboard() {
  const { locations, alerts, simulateRiskEvent } = useApp();
  const navigate = useNavigate();

  const highCritical = locations.filter((l) => l.riskLevel === 'HIGH' || l.riskLevel === 'CRITICAL').length;
  const activeAlerts = alerts.filter((a) => !a.acknowledged).length;
  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Good Morning, Disaster Management Team</h1>
          <p className="mt-1 text-sm text-slate-500">Real-time landslide risk monitoring across the North Eastern Region</p>
        </div>
        <button
          onClick={() => simulateRiskEvent()}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95"
        >
          <Zap className="h-4 w-4" />
          Simulate Risk Event
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Monitored Zones" value={128} icon={Map} trend="+8% from last week" trendUp iconBg="bg-navy-100 text-navy-700" />
        <StatCard title="Active Sensors" value={342} icon={Radio} trend="+12 sensors added" trendUp iconBg="bg-blue-100 text-blue-700" />
        <StatCard title="High/Critical Risk Zones" value={highCritical} icon={AlertTriangle} trend="+3 since yesterday" trendUp iconBg="bg-orange-100 text-orange-700" />
        <StatCard title="Active Warnings" value={activeAlerts} icon={Bell} trend="2 new alerts" trendUp iconBg="bg-red-100 text-red-700" />
      </div>

      {/* Process banner */}
      <Card title="How BhuSanket Works" subtitle="Integrated IoT + AI + GIS pipeline for early landslide warning">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
          {processSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <step.icon className="h-4 w-4 text-navy-600" />
                <span className="text-xs font-semibold text-navy-700">{step.label}</span>
              </div>
              {i < processSteps.length - 1 && <ArrowRight className="h-4 w-4 text-slate-300" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Risk overview + Map */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card title="Regional Risk Overview" subtitle="Distribution across 128 monitored zones">
            <div className="space-y-3">
              {riskSummary.map((r) => (
                <div key={r.level} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: riskColor(r.level) }} />
                    <div>
                      <p className="text-sm font-bold text-navy-800">{r.level}</p>
                      <p className="text-xs text-slate-500">{r.desc}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: riskColor(r.level) }}>
                    {r.count}
                    <span className="ml-1 text-xs font-medium text-slate-400">zones</span>
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card
            title="Live Risk Map Preview"
            subtitle="Real-time monitoring across NER"
            action={
              <button onClick={() => navigate('/map')} className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:text-navy-800">
                Full map <ArrowRight className="h-4 w-4" />
              </button>
            }
          >
            <RiskMap locations={locations} height="360px" />
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              {(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((l) => (
                <span key={l} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: riskColor(l) }} />
                  {l}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent alerts + mission statement */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Recent Alerts"
            subtitle="Latest risk warnings across the region"
            action={
              <button onClick={() => navigate('/warnings')} className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:text-navy-800">
                View All Alerts <ArrowRight className="h-4 w-4" />
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase text-slate-400">
                    <th className="pb-2 pr-4">Location</th>
                    <th className="pb-2 pr-4">Risk</th>
                    <th className="pb-2 pr-4">Alert</th>
                    <th className="pb-2">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentAlerts.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-navy-800">{a.location}</p>
                        <p className="text-xs text-slate-400">{a.state}</p>
                      </td>
                      <td className="py-3 pr-4"><RiskBadge level={a.risk} /></td>
                      <td className="py-3 pr-4 text-slate-600">{a.message.slice(0, 45)}…</td>
                      <td className="py-3 text-slate-400">{a.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="Project Mission" subtitle="BhuSanket SIH 26001">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-slate-600">
                BhuSanket integrates IoT sensing, AI/ML prediction and GIS visualization to detect landslide risk early and support timely preventive action.
              </p>
              <div className="rounded-xl bg-navy-800 p-4 text-navy-50">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-200">Prototype AI Risk Model</p>
                <p className="mt-1 text-sm text-navy-100">
                  Transparent weighted scoring of rainfall, soil moisture, slope movement, terrain and historical risk — normalized 0–100.
                </p>
              </div>
              <button
                onClick={() => navigate('/prediction')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-navy-200 bg-navy-50 px-4 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-100"
              >
                <Play className="h-4 w-4" /> Explore AI Prediction
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
