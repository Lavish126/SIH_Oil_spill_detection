// MapView — React-Leaflet interactive map with spills and vessels
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getSeverityStyle, getRiskLevel } from '../../utils/correlation';

// Fix Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createSpillIcon(severity) {
  const color = severity === 'CRITICAL' ? '#ef4444' :
    severity === 'HIGH' ? '#f97316' :
    severity === 'MEDIUM' ? '#eab308' : '#22c55e';
  return L.divIcon({
    className: '',
    html: `<div style="
      width:24px;height:24px;border-radius:50%;
      background:${color}30;border:2px solid ${color};
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 12px ${color}60;
      position:relative;
    ">
      <div style="width:8px;height:8px;border-radius:50%;background:${color};"></div>
      <div style="position:absolute;width:24px;height:24px;border-radius:50%;border:2px solid ${color};animation:ping 2s ease-in-out infinite;opacity:0.4;"></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

function createVesselIcon(status) {
  const color = status === 'Suspicious' ? '#ef4444' : status === 'Moderate' ? '#f97316' : '#22d3ee';
  return L.divIcon({
    className: '',
    html: `<div style="
      width:20px;height:20px;
      background:${color}20;border:1.5px solid ${color};
      border-radius:4px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 8px ${color}40;
    ">
      <div style="
        width:0;height:0;
        border-left:4px solid transparent;
        border-right:4px solid transparent;
        border-bottom:7px solid ${color};
      "></div>
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
}

function SetView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom]);
  return null;
}

export default function MapView({
  spills = [],
  vessels = [],
  center = [15, 78],
  zoom = 6,
  height = '100%',
  showTracks = true,
  showPolygons = true,
  onSpillClick,
  onVesselClick,
  showDetectionRadius = false,
}) {
  return (
    <div style={{ height, width: '100%' }} className="rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
          className="map-tiles"
        />

        <SetView center={center} zoom={zoom} />

        {/* Spill polygons */}
        {showPolygons && spills.map(spill => spill.polygon && (
          <Polygon
            key={`poly-${spill.id}`}
            positions={spill.polygon}
            pathOptions={{
              color: spill.severity === 'CRITICAL' ? '#ef4444' :
                     spill.severity === 'HIGH' ? '#f97316' :
                     spill.severity === 'MEDIUM' ? '#eab308' : '#22c55e',
              fillColor: spill.severity === 'CRITICAL' ? '#ef4444' :
                         spill.severity === 'HIGH' ? '#f97316' :
                         spill.severity === 'MEDIUM' ? '#eab308' : '#22c55e',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '6 4',
            }}
            eventHandlers={{ click: () => onSpillClick?.(spill) }}
          />
        ))}

        {/* Detection radius */}
        {showDetectionRadius && spills.map(spill => (
          <Circle
            key={`radius-${spill.id}`}
            center={[spill.lat, spill.lng]}
            radius={20000}
            pathOptions={{
              color: '#22d3ee', fillColor: '#22d3ee',
              fillOpacity: 0.03, weight: 1, dashArray: '4 6',
            }}
          />
        ))}

        {/* Spill markers */}
        {spills.map(spill => (
          <Marker
            key={spill.id}
            position={[spill.lat, spill.lng]}
            icon={createSpillIcon(spill.severity)}
            eventHandlers={{ click: () => onSpillClick?.(spill) }}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '200px' }}>
                <div style={{ borderBottom: '1px solid rgba(34,211,238,0.2)', paddingBottom: '8px', marginBottom: '8px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Oil Spill</div>
                  <div style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>{spill.id}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px' }}>
                  <div><div style={{ color: '#64748b' }}>Location</div><div style={{ color: '#e2e8f0' }}>{spill.location}</div></div>
                  <div><div style={{ color: '#64748b' }}>Area</div><div style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{spill.area} km²</div></div>
                  <div><div style={{ color: '#64748b' }}>Severity</div><div style={{ color: spill.severity === 'CRITICAL' ? '#f87171' : spill.severity === 'HIGH' ? '#fb923c' : spill.severity === 'MEDIUM' ? '#fbbf24' : '#4ade80', fontWeight: '700' }}>{spill.severity}</div></div>
                  <div><div style={{ color: '#64748b' }}>Confidence</div><div style={{ color: '#22d3ee', fontFamily: 'monospace', fontWeight: '700' }}>{spill.confidence}%</div></div>
                  <div style={{ gridColumn: '1/-1' }}><div style={{ color: '#64748b' }}>Coordinates</div><div style={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: '11px' }}>{spill.lat.toFixed(4)}°N, {spill.lng.toFixed(4)}°E</div></div>
                  <div style={{ gridColumn: '1/-1' }}><div style={{ color: '#64748b' }}>Satellite</div><div style={{ color: '#e2e8f0' }}>{spill.satellite}</div></div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Vessel tracks */}
        {showTracks && vessels.map(vessel => vessel.track && (
          <Polyline
            key={`track-${vessel.id}`}
            positions={vessel.track.map(p => [p.lat, p.lng])}
            pathOptions={{
              color: vessel.status === 'Suspicious' ? '#ef4444' :
                     vessel.status === 'Moderate' ? '#f97316' : '#22d3ee',
              weight: 2,
              opacity: 0.7,
              dashArray: vessel.status === 'Normal' ? '4 4' : undefined,
            }}
          />
        ))}

        {/* Vessel markers */}
        {vessels.map(vessel => (
          <Marker
            key={vessel.id}
            position={[vessel.lat, vessel.lng]}
            icon={createVesselIcon(vessel.status)}
            eventHandlers={{ click: () => onVesselClick?.(vessel) }}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '200px' }}>
                <div style={{ borderBottom: '1px solid rgba(34,211,238,0.2)', paddingBottom: '8px', marginBottom: '8px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vessel</div>
                  <div style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>{vessel.name}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px' }}>
                  <div style={{ gridColumn: '1/-1' }}><div style={{ color: '#64748b' }}>MMSI</div><div style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{vessel.mmsi}</div></div>
                  <div><div style={{ color: '#64748b' }}>Type</div><div style={{ color: '#e2e8f0' }}>{vessel.type}</div></div>
                  <div><div style={{ color: '#64748b' }}>Flag</div><div style={{ color: '#e2e8f0' }}>{vessel.flag}</div></div>
                  <div><div style={{ color: '#64748b' }}>Speed</div><div style={{ color: '#22d3ee', fontFamily: 'monospace' }}>{vessel.speed} kts</div></div>
                  <div><div style={{ color: '#64748b' }}>Course</div><div style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{vessel.course}°</div></div>
                  <div><div style={{ color: '#64748b' }}>Distance</div><div style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{vessel.distanceFromSpill} km</div></div>
                  <div><div style={{ color: '#64748b' }}>Risk Score</div>
                    <div style={{ color: vessel.correlationScore >= 80 ? '#f87171' : vessel.correlationScore >= 60 ? '#fb923c' : '#4ade80', fontWeight: '700', fontFamily: 'monospace' }}>
                      {vessel.correlationScore}%
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
