import type { RiskLevel } from '../../data/mockData';
import { riskSolidClass, riskBgClass } from '../../lib/riskModel';

interface Props {
  level: RiskLevel;
  variant?: 'solid' | 'soft';
  size?: 'sm' | 'md';
}

export default function RiskBadge({ level, variant = 'soft', size = 'sm' }: Props) {
  const cls = variant === 'solid' ? riskSolidClass(level) : riskBgClass(level);
  const sizeCls = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold ${cls} ${sizeCls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}
