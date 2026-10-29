import { useEffect } from 'react';
import { Circle, CircleMarker, LayersControl, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { DEMO_FAULTS, DEMO_OCCURRENCES, STUDY_AREA_BOUNDS } from '../data/demo';
import type { Target } from '../data/targets';
import type { Ranked } from '../scoring/score';
import { fmt, SCORE_CLASSES, scoreColour } from './ui';

export interface LayerState {
  faults: boolean;
  occurrences: boolean;
  footprints: boolean;
}

interface Props {
  ranked: Ranked<Target>[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  layers: LayerState;
}

function FlyToSelected({ target }: { target: Target | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target.centre, Math.max(map.getZoom(), 9), { duration: 0.8 });
  }, [target, map]);
  return null;
}

export function MapView({ ranked, selectedId, onSelect, layers }: Props) {
  const selected = ranked.find((r) => r.item.id === selectedId)?.item;

  return (
    <div className="map-wrap">
      <MapContainer bounds={STUDY_AREA_BOUNDS} className="map" scrollWheelZoom zoomSnap={0.5}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Topographic (Esri)">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, USGS, FAO, NPS, and others"
              maxZoom={18}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Streets (OpenStreetMap)">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite (Esri)">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
              maxZoom={18}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {layers.faults &&
          DEMO_FAULTS.map((f) => (
            <Polyline key={f.id} positions={f.path} pathOptions={{ color: '#1F3B35', weight: 2.5, dashArray: '8 6' }}>
              <Tooltip sticky>{f.name} · demo</Tooltip>
            </Polyline>
          ))}

        {layers.occurrences &&
          DEMO_OCCURRENCES.map((o) => (
            <CircleMarker
              key={o.id}
              center={o.position}
              radius={5}
              pathOptions={{ color: '#fff', weight: 1.5, fillColor: '#3D6FB6', fillOpacity: 1 }}
            >
              <Tooltip>
                {o.name} — {o.kind} · demo
              </Tooltip>
            </CircleMarker>
          ))}

        {layers.footprints &&
          ranked.map(({ item }) => (
            <Circle
              key={`fp-${item.id}`}
              center={item.centre}
              radius={Math.sqrt(item.areaKm2 / Math.PI) * 1000}
              interactive={false}
              pathOptions={{ color: '#13201C', weight: 1, opacity: 0.5, fillOpacity: 0.06 }}
            />
          ))}

        {ranked.map(({ item, result, rank }) => {
          const isSel = item.id === selectedId;
          return (
            <CircleMarker
              key={item.id}
              center={item.centre}
              radius={isSel ? 14 : 10}
              pathOptions={{
                color: isSel ? '#13201C' : '#ffffff',
                weight: isSel ? 3 : 2,
                fillColor: scoreColour(result.score),
                fillOpacity: 0.95,
              }}
              eventHandlers={{ click: () => onSelect(item.id) }}
            >
              <Tooltip direction="top" offset={[0, -8]} permanent={isSel}>
                <strong>
                  #{rank} {item.name}
                </strong>
                <br />
                Priority {fmt(result.score)} · {item.id}
              </Tooltip>
            </CircleMarker>
          );
        })}

        <FlyToSelected target={selected} />
      </MapContainer>

      <div className="legend" aria-label="Map legend">
        <div className="legend-title">Priority score</div>
        {SCORE_CLASSES.map((c) => (
          <div key={c.label} className="legend-row">
            <span className="swatch" style={{ background: c.colour }} />
            {c.label}
          </div>
        ))}
        <div className="legend-row">
          <span className="swatch line" />
          Fault (demo)
        </div>
        <div className="legend-row">
          <span className="swatch dot" />
          Occurrence (demo)
        </div>
      </div>
      <div className="map-watermark">DEMONSTRATION DATA — NOT FOR EXPLORATION DECISIONS</div>
    </div>
  );
}
