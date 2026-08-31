import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  iconBg?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, iconBg = 'bg-navy-100 text-navy-700' }: Props) {
  const TrendIcon = trendUp === undefined ? Minus : trendUp ? TrendingUp : TrendingDown;
  const trendColor = trendUp === undefined ? 'text-slate-500' : trendUp ? 'text-orange-600' : 'text-green-600';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-navy-800">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {trend}
        </div>
      )}
    </div>
  );
}
