import { useState } from 'react';
import { User, Bell, SlidersHorizontal, Radio, Map, Save } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';

const thresholds = [
  { level: 'LOW', range: '0–30', color: 'bg-green-500' },
  { level: 'MODERATE', range: '31–60', color: 'bg-yellow-500' },
  { level: 'HIGH', range: '61–80', color: 'bg-orange-500' },
  { level: 'CRITICAL', range: '81–100', color: 'bg-red-600' },
];

interface Toggle {
  key: string;
  label: string;
  desc: string;
}

const toggles: Toggle[] = [
  { key: 'sms', label: 'SMS Alerts', desc: 'Send critical alerts via SMS to registered responders' },
  { key: 'email', label: 'Email Alerts', desc: 'Email summary of daily risk and active warnings' },
  { key: 'dashboard', label: 'Dashboard Notifications', desc: 'Show in-app notifications for new alerts' },
  { key: 'emergency', label: 'Emergency Alerts', desc: 'Override quiet hours for critical events' },
];

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${on ? 'bg-navy-600' : 'bg-slate-300'}`}
      role="switch"
      aria-checked={on}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

const sections: { title: string; subtitle: string; icon: LucideIcon }[] = [
  { title: 'Profile Settings', subtitle: 'Account and organization details', icon: User },
  { title: 'Notification Preferences', subtitle: 'Alert delivery channels', icon: Bell },
  { title: 'Risk Thresholds', subtitle: 'Risk score classification ranges', icon: SlidersHorizontal },
  { title: 'Sensor Configuration', subtitle: 'Sampling intervals and calibration', icon: Radio },
  { title: 'Map Settings', subtitle: 'Default view and layer options', icon: Map },
];

export default function SettingsPage() {
  const { pushToast } = useApp();
  const [toggleState, setToggleState] = useState<Record<string, boolean>>({
    sms: true,
    email: true,
    dashboard: true,
    emergency: false,
  });

  const flip = (key: string) => setToggleState((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = () => pushToast('Settings saved. Notification settings are simulated in Demo Mode.', 'info');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Configure profile, notifications, thresholds and sensors</p>
      </div>

      {/* Profile */}
      <Card title="Profile Settings" subtitle="Account and organization details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name" value="Disaster Management Admin" />
          <Field label="Email" value="admin@bhusanket-ner.gov.in" />
          <Field label="Role" value="Regional Administrator" />
          <Field label="Region" value="North Eastern Region" />
          <Field label="Organization" value="SDMA / NER Command Center" />
          <Field label="Phone" value="+91 98XXX XXXXX" />
        </div>
      </Card>

      {/* Notifications */}
      <Card title="Notification Preferences" subtitle="Alert delivery channels">
        <div className="space-y-3">
          {toggles.map((t) => (
            <div key={t.key} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-navy-800">{t.label}</p>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </div>
              <ToggleSwitch on={toggleState[t.key]} onToggle={() => flip(t.key)} />
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-100">
          Notification settings are simulated in Demo Mode.
        </div>
      </Card>

      {/* Risk thresholds */}
      <Card title="Risk Thresholds" subtitle="Risk score classification ranges (0–100)">
        <div className="space-y-3">
          {thresholds.map((t) => (
            <div key={t.level} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className={`h-4 w-4 rounded-full ${t.color}`} />
                <span className="text-sm font-semibold text-navy-800">{t.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  defaultValue={t.range}
                  className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-center text-sm text-navy-700 focus:border-navy-400 focus:outline-none"
                />
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sensor + Map config */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Sensor Configuration" subtitle="Sampling intervals and calibration">
          <div className="space-y-3">
            <Field label="Default Sampling Interval" value="60 seconds" />
            <Field label="Rainfall Calibration Factor" value="1.02" />
            <Field label="Soil Moisture Offset" value="−1.5%" />
            <Field label="Slope Movement Sensitivity" value="High" />
          </div>
        </Card>
        <Card title="Map Settings" subtitle="Default view and layer options">
          <div className="space-y-3">
            <Field label="Default Center" value="NER (25.5°N, 92.5°E)" />
            <Field label="Default Zoom" value="6" />
            <Field label="Base Layer" value="OpenStreetMap Standard" />
            <Field label="Show Risk Halos" value="Enabled" />
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          <Save className="h-4 w-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <input
        type="text"
        defaultValue={value}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-navy-700 focus:border-navy-400 focus:outline-none"
      />
    </div>
  );
}
