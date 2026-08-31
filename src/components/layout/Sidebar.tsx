import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Radio,
  Brain,
  Bell,
  BarChart3,
  FileText,
  Settings,
  Mountain,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/map', label: 'Live Risk Map', icon: Map },
  { to: '/sensors', label: 'Sensor Monitoring', icon: Radio },
  { to: '/prediction', label: 'AI Risk Prediction', icon: Brain },
  { to: '/warnings', label: 'Early Warnings', icon: Bell },
  { to: '/historical', label: 'Historical Analysis', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-navy-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-navy-800 text-navy-50 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-navy-700 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-500 to-navy-700 ring-1 ring-white/10">
              <Mountain className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-white">BhuSanket</p>
              <p className="text-xs text-navy-200">AI for Safer NER</p>
            </div>
          </div>
          <button onClick={onClose} className="text-navy-200 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-navy-800 shadow-sm'
                    : 'text-navy-100 hover:bg-navy-700 hover:text-white'
                }`
              }
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer disclaimer */}
        <div className="border-t border-navy-700 px-4 py-3">
          <p className="text-[11px] leading-relaxed text-navy-200">
            Prototype Demo: Sensor readings, risk scores and alerts shown here are simulated for demonstration purposes.
          </p>
        </div>
      </aside>
    </>
  );
}
