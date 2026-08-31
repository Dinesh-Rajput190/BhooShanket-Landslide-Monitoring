import { useApp } from '../../context/AppContext';
import { AlertTriangle, X, Info, ShieldAlert } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[1200] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = t.type === 'critical' ? AlertTriangle : t.type === 'warning' ? ShieldAlert : Info;
        const colors =
          t.type === 'critical'
            ? 'bg-red-600 text-white'
            : t.type === 'warning'
              ? 'bg-orange-500 text-white'
              : 'bg-navy-700 text-white';
        return (
          <div
            key={t.id}
            className={`animate-slide-in-right pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg ${colors}`}
          >
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button onClick={() => dismissToast(t.id)} className="flex-shrink-0 opacity-80 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
