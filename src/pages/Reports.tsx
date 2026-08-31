import { FileText, Download, Eye, Calendar, Map, Database, BarChart3, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';

interface ReportType {
  title: string;
  desc: string;
  icon: LucideIcon;
  date: string;
  color: string;
}

const reports: ReportType[] = [
  { title: 'Daily Risk Report', desc: 'Summary of risk scores, alerts and sensor status for today.', icon: Calendar, date: '31 Aug 2026', color: 'bg-navy-100 text-navy-700' },
  { title: 'Weekly Regional Report', desc: 'Week-over-week risk trends across all NER monitored zones.', icon: Map, date: '25–31 Aug 2026', color: 'bg-blue-100 text-blue-700' },
  { title: 'Monthly Landslide Analysis', desc: 'In-depth analysis of landslide events, rainfall correlation and hotspots.', icon: BarChart3, date: 'Aug 2026', color: 'bg-orange-100 text-orange-700' },
  { title: 'Sensor Health Report', desc: 'Network uptime, offline sensors, calibration and maintenance log.', icon: Database, date: '31 Aug 2026', color: 'bg-green-100 text-green-700' },
];

export default function Reports() {
  const { pushToast } = useApp();

  const handleView = (title: string) => {
    pushToast(`Opening "${title}" — demo preview.`, 'info');
  };
  const handleDownload = (title: string) => {
    pushToast(`Demo report generated successfully: ${title}.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Generate and download operational reports</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {reports.map((r) => (
          <div key={r.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:shadow-card-hover">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${r.color}`}>
                <r.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-navy-800">{r.title}</h3>
                  <span className="text-xs text-slate-400">{r.date}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{r.desc}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleView(r.title)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
                  >
                    <Eye className="h-4 w-4" /> View
                  </button>
                  <button
                    onClick={() => handleDownload(r.title)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-navy-700 px-3 py-2 text-sm font-medium text-white hover:bg-navy-800"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card title="Recently Generated" subtitle="Demo report history">
        <div className="space-y-2">
          {['Weekly Regional Report — 18 Aug 2026', 'Daily Risk Report — 30 Aug 2026', 'Sensor Health Report — 29 Aug 2026'].map((t, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-navy-500" />
                <span className="text-sm font-medium text-navy-700">{t}</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 className="h-4 w-4" /> Ready
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Demo: PDF download generates a notification in prototype mode — no real file is produced.
        </div>
      </Card>
    </div>
  );
}
