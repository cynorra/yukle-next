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
  locale?: string;
}

// Fallback coordinates dictionary for key logistics hubs
const CITY_FALLBACKS: Record<string, [number, number]> = {
  'istanbul': [41.0082, 28.9784],
  'ankara': [39.9334, 32.8597],
  'izmir': [38.4237, 27.1428],
  'bursa': [40.1885, 29.0610],
  'antalya': [36.8969, 30.7133],
  'adana': [37.0000, 35.3213],
  'mersin': [36.8121, 34.6415],
  'gaziantep': [37.0662, 37.3833],
  'kocaeli': [40.8533, 29.8815],
  'tekirdag': [40.9780, 27.5110],
  'edirne': [41.6771, 26.5557],
  'berlin': [52.5200, 13.4050],
  'hamburg': [53.5511, 9.9937],
  'munich': [48.1351, 11.5820],
  'frankfurt': [50.1109, 8.6821],
  'rotterdam': [51.9244, 4.4777],
  'amsterdam': [52.3676, 4.9041],
  'antwerp': [51.2194, 4.4025],
  'paris': [48.8566, 2.3522],
  'london': [51.5074, -0.1278],
  'warsaw': [52.2297, 21.0122],
  'madrid': [40.4168, -3.7038],
  'rome': [41.9028, 12.4964],
  'vienna': [48.2082, 16.3738],
  'sofia': [42.6977, 23.3219],
  'bucharest': [44.4323, 26.1063],
  'athens': [37.9838, 23.7275],
  'tbilisi': [41.7151, 44.8271],
  'baku': [40.4093, 49.8671],
  'almaty': [43.2220, 76.8512],
  'tashkent': [41.2995, 69.2401],
  'boston': [42.3601, -71.0589],
  'indianapolis': [39.7684, -86.1581],
  'new york': [40.7128, -74.0060],
  'chicago': [41.8781, -87.6298],
  'los angeles': [34.0522, -118.2437],
  'houston': [29.7604, -95.3698],
};

function getFallbackCoords(query: string): [number, number] | null {
  const lower = query.toLowerCase();
  for (const [key, coords] of Object.entries(CITY_FALLBACKS)) {
    if (lower.includes(key)) {
      return coords;
    }
  }
  return null;
}

async function geocodeSingle(query: string): Promise<[number, number] | null> {
  const fallback = getFallbackCoords(query);

  try {
    // Primary geocoder: Open-Meteo Free Geocoding API (Fast, CORS friendly, no user-agent blocks)
    const cleanCity = query.split(',')[0].trim();
    const openMeteoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=en`
    );
    if (openMeteoRes.ok) {
      const data = await openMeteoRes.json();
      if (data?.results?.[0]?.latitude && data?.results?.[0]?.longitude) {
        return [data.results[0].latitude, data.results[0].longitude];
      }
    }

    // Secondary geocoder: Nominatim
    const nomRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    if (nomRes.ok) {
      const data = await nomRes.json();
      if (data?.[0]?.lat && data?.[0]?.lon) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    }
  } catch (err) {
    console.warn('Geocoding network error:', err);
  }

  return fallback;
}

export default function RouteMap({ origin, destination, locale = 'en' }: RouteMapProps) {
  const [coords, setCoords] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchCoords() {
      setLoading(true);
      const [c1, c2] = await Promise.all([geocodeSingle(origin), geocodeSingle(destination)]);

      if (!isMounted) return;

      if (c1 && c2) {
        setCoords([c1, c2]);
      } else if (c1) {
        setCoords([c1, [c1[0] + 0.5, c1[1] + 0.5]]);
      } else if (c2) {
        setCoords([[c2[0] - 0.5, c2[1] - 0.5], c2]);
      } else {
        // Fallback default: Istanbul to Munich
        setCoords([[41.0082, 28.9784], [48.1351, 11.5820]]);
      }
      setLoading(false);
    }
    fetchCoords();
    return () => {
      isMounted = false;
    };
  }, [origin, destination]);

  if (loading || coords.length < 2) {
    return (
      <div className="w-full h-64 bg-accent/5 animate-pulse rounded-2xl flex items-center justify-center text-accent/50 font-medium">
        {locale === 'tr' ? 'Harita yükleniyor...' : 'Loading map...'}
      </div>
    );
  }

  const center = [
    (coords[0][0] + coords[1][0]) / 2,
    (coords[0][1] + coords[1][1]) / 2,
  ] as [number, number];

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
          <Popup>Kalkış / Origin: {origin}</Popup>
        </Marker>
        <Marker position={coords[1]}>
          <Popup>Varış / Destination: {destination}</Popup>
        </Marker>
        <Polyline positions={coords} color="#F5A623" weight={4} dashArray="5, 10" />
      </MapContainer>
    </div>
  );
}
