import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, Check, ArrowRight, Radar, Brain, CheckCircle2, Bell, ShieldAlert, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import RiskBadge from '../components/ui/RiskBadge';
import { riskColor } from '../lib/riskModel';

const workflow = [
  { label: 'Risk Detected', icon: Radar, color: 'bg-blue-100 text-blue-700' },
  { label: 'AI Assessment', icon: Brain, color: 'bg-navy-100 text-navy-700' },
  { label: 'Risk Confirmed', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700' },
  { label: 'Authority Alert', icon: Bell, color: 'bg-orange-100 text-orange-700' },
  { label: 'Community Warning', icon: ShieldAlert, color: 'bg-red-100 text-red-700' },
  { label: 'Preventive Action', icon: Activity, color: 'bg-green-100 text-green-700' },
];

export default function EarlyWarnings() {
  const { alerts, acknowledgeAlert } = useApp();
  const navigate = useNavigate();

  const active = alerts.filter((a) => !a.acknowledged);
  const critical = active.filter((a) => a.risk === 'CRITICAL').length;
  const high = active.filter((a) => a.risk === 'HIGH').length;

  const summary = [
    { label: 'Active Alerts', value: active.length, color: 'bg-navy-700' },
    { label: 'Critical', value: critical, color: 'bg-red-600' },
    { label: 'High', value: high, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Early Warning & Alerts</h1>
        <p className="mt-1 text-sm text-slate-500">Active landslide risk warnings and response workflow</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {summary.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color} text-white`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-navy-800">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert workflow */}
      <Card title="Alert Workflow" subtitle="From risk detection to preventive action">
        <div className="flex flex-wrap items-center justify-between gap-2 overflow-x-auto py-2">
          {workflow.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-2">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${step.color}`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="max-w-[80px] text-center text-[11px] font-semibold text-navy-700">{step.label}</span>
              </div>
              {i < workflow.length - 1 && <ArrowRight className="mb-5 h-4 w-4 flex-shrink-0 text-slate-300" />}
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-100">
          Demo: In the prototype, alerts are not actually sent to government authorities. This workflow illustrates the intended response chain.
        </div>
      </Card>

      {/* Alert cards */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-navy-800">Active Alert Cards</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {alerts.map((a) => {
            const isCritical = a.risk === 'CRITICAL';
            return (
              <div
                key={a.id}
                className={`animate-fade-in-up rounded-2xl border bg-white shadow-card ${isCritical ? 'border-red-200' : 'border-slate-200'}`}
              >
                <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: riskColor(a.risk) + '33' }}>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ backgroundColor: riskColor(a.risk) }}>
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: riskColor(a.risk) }}>{a.risk} ALERT</p>
                      <p className="text-xs text-slate-500">{a.time}</p>
                    </div>
                  </div>
                  <RiskBadge level={a.risk} variant="solid" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-navy-800">
                    <MapPin className="h-4 w-4 text-navy-500" /> {a.location}, {a.state}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{a.message}</p>
                  <div className="mt-3 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-400">Recommended Action</p>
                    <p className="mt-1 text-sm text-navy-700">{a.action}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate('/map')}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-navy-200 px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
                    >
                      <MapPin className="h-4 w-4" /> View Location
                    </button>
                    <button
                      onClick={() => acknowledgeAlert(a.id)}
                      disabled={a.acknowledged}
                      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
                        a.acknowledged
                          ? 'cursor-default bg-green-100 text-green-700'
                          : 'bg-navy-700 text-white hover:bg-navy-800'
                      }`}
                    >
                      {a.acknowledged ? <><CheckCircle2 className="h-4 w-4" /> Acknowledged</> : <><Check className="h-4 w-4" /> Acknowledge</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
