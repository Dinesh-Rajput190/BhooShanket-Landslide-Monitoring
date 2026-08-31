import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  initialLocations,
  initialSensors,
  initialAlerts,
  type MonitoringLocation,
  type SensorReading,
  type AlertItem,
  type RiskLevel,
} from '../data/mockData';
import { computeRiskScore } from '../lib/riskModel';

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'critical';
}

interface AppState {
  locations: MonitoringLocation[];
  sensors: SensorReading[];
  alerts: AlertItem[];
  toasts: Toast[];
  simulateRiskEvent: (locationId?: string) => void;
  acknowledgeAlert: (id: string) => void;
  pushToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  updateLocation: (id: string, patch: Partial<MonitoringLocation>) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<MonitoringLocation[]>(initialLocations);
  const [sensors, setSensors] = useState<SensorReading[]>(initialSensors);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `T${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateLocation = (id: string, patch: Partial<MonitoringLocation>) => {
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const simulateRiskEvent = (locationId?: string) => {
    const targetId = locationId || 'L02'; // East Khasi Hills by default
    setLocations((prev) =>
      prev.map((l) => {
        if (l.id !== targetId) return l;
        const updated: MonitoringLocation = {
          ...l,
          rainfall: 95,
          soilMoisture: 87,
          slopeMovement: 17,
          lastUpdated: 'just now',
        };
        const { score, level } = computeRiskScore({
          rainfall: updated.rainfall,
          soilMoisture: updated.soilMoisture,
          slopeMovement: updated.slopeMovement,
          slope: updated.slope,
          historicalRisk: updated.historicalRisk,
        });
        updated.riskScore = score;
        updated.riskLevel = level;
        return updated;
      })
    );

    const target = locations.find((l) => l.id === targetId);
    const name = target?.name || 'East Khasi Hills';
    const state = target?.state || 'Meghalaya';

    setAlerts((prev) => [
      {
        id: `A${Date.now()}`,
        location: name,
        state,
        risk: 'CRITICAL',
        message: 'Critical landslide risk detected due to heavy rainfall and accelerating slope movement.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        action: 'Prepare evacuation and restrict access to vulnerable slopes.',
        acknowledged: false,
      },
      ...prev,
    ]);

    pushToast(`Critical landslide risk detected in ${name}, ${state}.`, 'critical');
  };

  return (
    <AppContext.Provider
      value={{
        locations,
        sensors,
        alerts,
        toasts,
        simulateRiskEvent,
        acknowledgeAlert,
        pushToast,
        dismissToast,
        updateLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export type { RiskLevel };
