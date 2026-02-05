import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Location } from '../model/types';

// Fix for default marker icons in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapControllerProps {
  locations: Location[];
}

function MapController({ locations }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;

    if (locations.length === 1) {
      // Center on single location
      const location = locations[0];
      if (location) {
        map.setView([Number(location.latitude), Number(location.longitude)], 13);
      }
    } else {
      // Fit bounds to show all markers
      const bounds = L.latLngBounds(
        locations.map((loc) => [Number(loc.latitude), Number(loc.longitude)] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

interface LocationsMapProps {
  locations: Location[];
}

export function LocationsMap({ locations }: LocationsMapProps) {
  if (locations.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] rounded-lg border bg-muted">
        <p className="text-muted-foreground">Нет локаций для отображения на карте</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[0, 0]}
      zoom={13}
      style={{ height: '600px', width: '100%' }}
      className="rounded-lg border"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController locations={locations} />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[Number(location.latitude), Number(location.longitude)]}
        >
          <Popup>
            <div className="space-y-2 p-2">
              <div>
                <span className="font-semibold">ID пользователя:</span>{' '}
                <span className="font-mono text-sm">{location.userId}</span>
              </div>
              <div>
                <span className="font-semibold">Имя:</span> {location.fullName}
              </div>
              <div>
                <span className="font-semibold">Координаты:</span>{' '}
                <span className="font-mono text-sm">
                  {Number(location.latitude).toFixed(6)}, {Number(location.longitude).toFixed(6)}
                </span>
              </div>
              <div>
                <span className="font-semibold">Время:</span>{' '}
                <span className="text-sm">
                  {new Date(location.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
