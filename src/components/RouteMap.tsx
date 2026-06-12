'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteMapProps {
  origin: string;
  destination: string;
}

export default function RouteMap({ origin, destination }: RouteMapProps) {
  const [coords, setCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    async function fetchCoords() {
      try {
        const res1 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origin)}`);
        const data1 = await res1.json();
        
        const res2 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`);
        const data2 = await res2.json();

        if (data1[0] && data2[0]) {
          setCoords([
            [parseFloat(data1[0].lat), parseFloat(data1[0].lon)],
            [parseFloat(data2[0].lat), parseFloat(data2[0].lon)]
          ]);
        }
      } catch (err) {
        console.error('Failed to geocode', err);
      }
    }
    fetchCoords();
  }, [origin, destination]);

  if (coords.length < 2) {
    return (
      <div className="w-full h-64 bg-accent/5 animate-pulse rounded-2xl flex items-center justify-center text-accent/50 font-medium">
        Harita yükleniyor...
      </div>
    );
  }

  const center = [
    (coords[0][0] + coords[1][0]) / 2,
    (coords[0][1] + coords[1][1]) / 2
  ] as [number, number];

  // Calculate rough distance for zoom level (simple heuristic)
  const latDiff = Math.abs(coords[0][0] - coords[1][0]);
  const lonDiff = Math.abs(coords[0][1] - coords[1][1]);
  const maxDiff = Math.max(latDiff, lonDiff);
  let zoom = 4;
  if (maxDiff < 2) zoom = 7;
  else if (maxDiff < 5) zoom = 6;
  else if (maxDiff < 10) zoom = 5;

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-inner border border-border-light dark:border-border-dark relative z-0">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={coords[0]}>
          <Popup>Kalkış: {origin}</Popup>
        </Marker>
        <Marker position={coords[1]}>
          <Popup>Varış: {destination}</Popup>
        </Marker>
        <Polyline positions={coords} color="#F5A623" weight={4} dashArray="5, 10" />
      </MapContainer>
    </div>
  );
}
