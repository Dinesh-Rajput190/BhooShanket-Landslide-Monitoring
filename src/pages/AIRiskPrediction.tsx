import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudRain, Droplets, Mountain, Compass, History, Brain, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import RiskBadge from '../components/ui/RiskBadge';
import { computeRiskScore, predictTimeline, riskColor } from '../lib/riskModel';
import { NER_STATES, type MonitoringLocation } from '../data/mockData';

const historicalMap = { Low: 'Low', Moderate: 'Moderate', High: 'High' } as const;

export default function AIRiskPrediction() {
  const { locations, pushToast } = useApp();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('L02'); // East Khasi Hills

  const selected = locations.find((l) => l.id === selectedId) || locations[0];
  const factors = {
    rainfall: selected.rainfall,
    soilMoisture: selected.soilMoisture,
    slopeMovement: selected.slopeMovement,
    slope: selected.slope,
    historicalRisk: historicalMap[selected.historicalRisk],
  };

  const { score, level, contributions } = useMemo(() => computeRiskScore(factors), [selected]);
  const timeline = useMemo(() => predictTimeline(factors), [selected]);
  const confidence = Math.min(98, 75 + Math.round(score / 8));

  const groupedByState = NER_STATES.reduce<Record<string, MonitoringLocation[]>>((acc, s) => {
    acc[s] = locations.filter((l) => l.state === s);
    return acc;
  }, {});

  const inputFactors = [
    { label: 'Rainfall', value: `${factors.rainfall} mm`, icon: CloudRain, color: 'text-blue-600 bg-blue-50' },
    { label: 'Soil Moisture', value: `${factors.soilMoisture}%`, icon: Droplets, color: 'text-cyan-600 bg-cyan-50' },
    { label: 'Slope Movement', value: `${factors.slopeMovement} mm/day`, icon: Mountain, color: 'text-orange-600 bg-orange-50' },
    { label: 'Terrain/Slope', value: `${factors.slope}°`, icon: Compass, color: 'text-navy-600 bg-navy-50' },
    { label: 'Historical Risk', value: factors.historicalRisk, icon: History, color: 'text-purple-600 bg-purple-50' },
  ];

  const explanations: { text: string; show: boolean }[] = [
    { text: 'Heavy rainfall detected above warning threshold', show: factors.rainfall > 60 },
    { text: 'Soil moisture above safe threshold', show: factors.soilMoisture > 70 },
    { text: 'Increasing slope movement detected', show: factors.slopeMovement > 8 },
    { text: 'Area has previous landslide history', show: factors.historicalRisk === 'High' },
    { text: 'Steep terrain increases vulnerability', show: factors.slope > 30 },
  ].filter((e) => e.show) as { text: string; show: boolean }[];

  // Gauge as conic gradient
  const gaugeDeg = (score / 100) * 360;
  const gaugeColor = riskColor(level);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">AI Risk Prediction</h1>
        <p className="mt-1 text-sm text-slate-500">Machine learning-based landslide probability assessment</p>
      </div>

      {/* Location selector */}
      <Card title="Select Monitoring Zone" subtitle="Choose a location to run the Prototype AI Risk Model">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedId(l.id)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                selectedId === l.id
                  ? 'border-navy-500 bg-navy-50 ring-1 ring-navy-300'
                  : 'border-slate-200 bg-white hover:border-navy-300'
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-navy-800">{l.name}</p>
                <p className="text-xs text-slate-400">{l.state}</p>
              </div>
              <RiskBadge level={l.riskLevel} />
            </button>
          ))}
        </div>
      </Card>

      {/* Prediction results */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gauge */}
        <Card title="Landslide Probability" subtitle={selected.name}>
          <div className="flex flex-col items-center py-4">
            <div
              className="relative flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${gaugeColor} ${gaugeDeg}deg, #e2e8f0 ${gaugeDeg}deg)`,
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                <p className="text-4xl font-bold" style={{ color: gaugeColor }}>{score}%</p>
                <p className="text-xs text-slate-400">Risk Score</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <RiskBadge level={level} variant="solid" size="md" />
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <Brain className="h-4 w-4 text-navy-500" />
                Confidence: <span className="font-semibold text-navy-700">{confidence}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Input factors */}
        <div className="lg:col-span-2">
          <Card title="Input Factors" subtitle="Live sensor & terrain data feeding the model">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {inputFactors.map((f) => (
                <div key={f.label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className={`mb-2 inline-flex rounded-lg p-1.5 ${f.color}`}>
                    <f.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-slate-500">{f.label}</p>
                  <p className="text-lg font-bold text-navy-800">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Contribution bars */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Model Contribution Breakdown</p>
              <div className="space-y-2">
                {contributions.map((c) => (
                  <div key={c.label}>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">{c.label} <span className="text-slate-300">({Math.round(c.weight * 100)}% weight)</span></span>
                      <span className="font-semibold text-navy-700">{Math.round(c.value)}/100</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-navy-500" style={{ width: `${c.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Explanation + Timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title={`Why is this zone ${level} risk?`} subtitle="Explainable AI — transparent reasoning">
          <div className="space-y-2.5">
            {explanations.length > 0 ? (
              explanations.map((e, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-100">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                  <span>{e.text}</span>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl bg-green-50 p-3 text-sm text-green-800 ring-1 ring-green-100">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>All factors within safe thresholds. Low landslide probability.</span>
              </div>
            )}
            <div className="mt-3 rounded-xl bg-navy-50 p-3 text-xs text-navy-600 ring-1 ring-navy-100">
              Prototype AI Risk Model: weighted heuristic combining rainfall (30%), soil moisture (25%), slope movement (25%), terrain (10%) and historical risk (10%). Not a production-validated ML model.
            </div>
          </div>
        </Card>

        <Card title="Prediction Timeline" subtitle="Projected risk over next 24 hours">
          <div className="flex items-center justify-between gap-2">
            {timeline.map((t, i) => (
              <div key={t.label} className="flex flex-1 flex-col items-center">
                <div className="flex h-24 w-full items-end justify-center">
                  <div
                    className="w-full max-w-[60px] rounded-t-lg transition-all"
                    style={{ height: `${t.score}%`, backgroundColor: riskColor(t.level) }}
                    title={`${t.score}% — ${t.level}`}
                  />
                </div>
                <div className="mt-2 flex flex-col items-center">
                  <RiskBadge level={t.level} />
                  <span className="mt-1 text-xs font-semibold text-navy-700">{t.score}%</span>
                  <span className="text-[11px] text-slate-400">{t.label}</span>
                </div>
                {i < timeline.length - 1 && <div className="mt-1 hidden text-slate-300 sm:block">→</div>}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              pushToast('Demo risk report generated successfully.', 'info');
              navigate('/reports');
            }}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            <FileText className="h-4 w-4" /> Generate Risk Report
          </button>
        </Card>
      </div>
    </div>
  );
}
