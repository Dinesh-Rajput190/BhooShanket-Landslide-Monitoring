import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ToastContainer from './components/ui/ToastContainer';
import Dashboard from './pages/Dashboard';
import LiveRiskMap from './pages/LiveRiskMap';
import SensorMonitoring from './pages/SensorMonitoring';
import AIRiskPrediction from './pages/AIRiskPrediction';
import EarlyWarnings from './pages/EarlyWarnings';
import HistoricalAnalysis from './pages/HistoricalAnalysis';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-100">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="lg:pl-64">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={<LiveRiskMap />} />
                <Route path="/sensors" element={<SensorMonitoring />} />
                <Route path="/prediction" element={<AIRiskPrediction />} />
                <Route path="/warnings" element={<EarlyWarnings />} />
                <Route path="/historical" element={<HistoricalAnalysis />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
