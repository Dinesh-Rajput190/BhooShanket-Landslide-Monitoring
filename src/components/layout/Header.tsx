import { Menu, Bell, User, Mountain } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: Props) {
  const { alerts } = useApp();
  const activeAlerts = alerts.filter((a) => !a.acknowledged).length;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-navy-700 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <Mountain className="h-6 w-6 text-navy-700" />
            <span className="text-lg font-bold text-navy-800">BhuSanket</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-slate-500">North Eastern Region Command Center</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            DEMO MODE
          </span>
          <button className="relative rounded-lg p-2 text-navy-700 hover:bg-slate-100" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {activeAlerts > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {activeAlerts}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-white">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-navy-800">Admin</p>
              <p className="text-[11px] text-slate-500">Disaster Mgmt</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
