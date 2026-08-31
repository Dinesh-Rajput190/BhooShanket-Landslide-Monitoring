import type { RiskLevel } from '../data/mockData';

// Transparent, simulated Prototype AI Risk Model.
// This is NOT a production-validated ML model — it is a weighted,
// normalized heuristic shown in the UI as "Prototype AI Risk Model".

export interface RiskFactors {
  rainfall: number; // mm
  soilMoisture: number; // %
  slopeMovement: number; // mm/day
  slope: number; // degrees
  historicalRisk: 'Low' | 'Moderate' | 'High';
}

interface RiskContribution {
  label: string;
  value: number; // 0-100 normalized contribution
  weight: number;
}

// Normalize a value within a range to 0-100
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

export function computeRiskScore(factors: RiskFactors): {
  score: number;
  level: RiskLevel;
  contributions: RiskContribution[];
} {
  const rainfallContribution = normalize(factors.rainfall, 0, 120);
  const soilContribution = normalize(factors.soilMoisture, 20, 100);
  const slopeMovementContribution = normalize(factors.slopeMovement, 0, 20);
  const slopeContribution = normalize(factors.slope, 0, 50);
  const historicalMap = { Low: 20, Moderate: 55, High: 85 } as const;
  const historicalContribution = historicalMap[factors.historicalRisk];

  const contributions: RiskContribution[] = [
    { label: 'Rainfall', value: rainfallContribution, weight: 0.3 },
    { label: 'Soil Moisture', value: soilContribution, weight: 0.25 },
    { label: 'Slope Movement', value: slopeMovementContribution, weight: 0.25 },
    { label: 'Terrain/Slope', value: slopeContribution, weight: 0.1 },
    { label: 'Historical Risk', value: historicalContribution, weight: 0.1 },
  ];

  const score = Math.round(
    contributions.reduce((acc, c) => acc + c.value * c.weight, 0)
  );
  const level = scoreToLevel(score);

  return { score, level, contributions };
}

export function scoreToLevel(score: number): RiskLevel {
  if (score <= 30) return 'LOW';
  if (score <= 60) return 'MODERATE';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return '#16a34a';
    case 'MODERATE':
      return '#eab308';
    case 'HIGH':
      return '#f97316';
    case 'CRITICAL':
      return '#dc2626';
  }
}

export function riskBgClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'MODERATE':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'CRITICAL':
      return 'bg-red-100 text-red-800 border-red-200';
  }
}

export function riskSolidClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return 'bg-green-500 text-white';
    case 'MODERATE':
      return 'bg-yellow-500 text-white';
    case 'HIGH':
      return 'bg-orange-500 text-white';
    case 'CRITICAL':
      return 'bg-red-600 text-white';
  }
}

// Predict a timeline of risk scores over the next 24h given current factors.
// Simulated: assumes continued rainfall trend decaying over time.
export function predictTimeline(factors: RiskFactors): {
  label: string;
  score: number;
  level: RiskLevel;
}[] {
  const current = computeRiskScore(factors);
  const decay = (hours: number, factor: number) => {
    const f: RiskFactors = {
      ...factors,
      rainfall: Math.max(0, factors.rainfall * (1 - 0.15 * hours * factor)),
      soilMoisture: Math.max(20, factors.soilMoisture * (1 - 0.08 * hours * factor)),
      slopeMovement: Math.max(0, factors.slopeMovement * (1 - 0.05 * hours * factor)),
    };
    return computeRiskScore(f);
  };
  return [
    { label: 'Current', score: current.score, level: current.level },
    { label: '+6h', ...decay(6, 0.6) },
    { label: '+12h', ...decay(12, 0.8) },
    { label: '+24h', ...decay(24, 1) },
  ].map((p) => ({ label: p.label, score: p.score, level: p.level }));
}
