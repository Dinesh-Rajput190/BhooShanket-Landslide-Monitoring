import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import type { MonitoringLocation } from '../data/mockData';
import { riskColor } from '../lib/riskModel';

interface Props {
  locations: MonitoringLocation[];
  onMarkerClick?: (loc: MonitoringLocation) => void;
  height?: string;
  showLabels?: boolean;
}

// Custom div icon that draws a colored circle with pulse for critical
function makeIcon(level: string, score: number) {
  const color = riskColor(level as MonitoringLocation['riskLevel']);
  const pulse = level === 'CRITICAL' || level === 'HIGH';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="position:relative;width:18px;height:18px;">
      ${pulse ? `<span class="risk-pulse" style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.4;"></span>` : ''}
      <span style="position:absolute;inset:0;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></span>
    </div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function RiskMap({ locations, onMarkerClick, height = '400px', showLabels = false }: Props) {
  const center: [number, number] = [25.5, 92.5]; // center of NER
  const zoom = 6;

  return (
    <div style={{ height }} className="h-full w-full overflow-hidden rounded-xl">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={makeIcon(loc.riskLevel, loc.riskScore)}
            eventHandlers={{
              click: () => onMarkerClick?.(loc),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="mb-2 flex items-center justify-between">
                  <strong className="text-navy-800">{loc.name}</strong>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                    style={{ backgroundColor: riskColor(loc.riskLevel) }}
                  >
                    {loc.riskLevel}
                  </span>
                </div>
                <dl className="space-y-1 text-[12px] text-slate-600">
                  <div className="flex justify-between"><dt>State</dt><dd className="font-medium">{loc.state}</dd></div>
                  <div className="flex justify-between"><dt>Risk Score</dt><dd className="font-medium">{loc.riskScore}/100</dd></div>
                  <div className="flex justify-between"><dt>Rainfall</dt><dd className="font-medium">{loc.rainfall} mm</dd></div>
                  <div className="flex justify-between"><dt>Soil Moisture</dt><dd className="font-medium">{loc.soilMoisture}%</dd></div>
                  <div className="flex justify-between"><dt>Slope Movement</dt><dd className="font-medium">{loc.slopeMovement} mm/day</dd></div>
                  <div className="flex justify-between"><dt>Temperature</dt><dd className="font-medium">{loc.temperature}°C</dd></div>
                  <div className="flex justify-between border-t pt-1"><dt>Last Updated</dt><dd className="font-medium">{loc.lastUpdated}</dd></div>
                </dl>
              </div>
            </Popup>
          </Marker>
        ))}
        {showLabels &&
          locations.map((loc) => (
            <CircleMarker
              key={`bg-${loc.id}`}
              center={[loc.lat, loc.lng]}
              radius={20}
              pathOptions={{
                color: riskColor(loc.riskLevel),
                fillColor: riskColor(loc.riskLevel),
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
          ))}
      </MapContainer>
    </div>
  );
}
