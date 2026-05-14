'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';
import type { City, District } from '@/types/database';
import { MapPin, ChevronDown } from 'lucide-react';
import { useT } from '@/hooks/useT';

interface CitySelectProps {
  value: number | null;
  onChange: (cityId: number | null, districtId: number | null) => void;
  placeholder?: string;
  districtValue?: number | null;
}

export default function CitySelect({ value, onChange, placeholder = 'Şehir seçin', districtValue }: CitySelectProps) {
  const t = useT();
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('cities').select('*').order('name').then(({ data }) => {
      if (data) setCities(data);
    });
  }, []);

  useEffect(() => {
    if (value) {
      supabase.from('districts').select('*').eq('city_id', value).order('name').then(({ data }) => {
        if (data) setDistricts(data);
      });
    } else {
      setDistricts([]);
    }
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleOpen() {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 260;

    if (spaceBelow < dropdownHeight) {
      // Yukarı aç
      setDropdownStyle({
        position: 'fixed',
        top: rect.top - dropdownHeight - 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    } else {
      // Aşağı aç
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
    setOpen(!open);
  }

  const filtered = cities.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const selectedCity = cities.find((c) => c.id === value);

  const dropdown = open ? createPortal(
    <div
      style={dropdownStyle}
      className={[t.isDark ? "bg-[#111]" : "bg-white", t.divider, "border rounded-xl shadow-2xl overflow-hidden"].join(" ")}
    >
      <div className="p-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ara..."
          className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#F5A623]/40 ${t.input}`}
          autoFocus
        />
      </div>
      <div className="max-h-48 overflow-y-auto">
        {filtered.map((city) => (
          <button
            key={city.id}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onChange(city.id, null);
              setOpen(false);
              setSearch('');
            }}
            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-black/5 transition-colors ${t.isDark ? "" : "hover:bg-black/[0.04]"} ${
              city.id === value ? `text-[#F5A623] bg-[#F5A623]/5` : t.body
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between gap-2 transition-colors ${t.input} hover:border-[#F5A623]/30`}
      >
        <span className={`flex items-center gap-2 ${selectedCity ? t.heading : t.muted}`}>
          <MapPin size={16} className="text-[#F5A623] shrink-0" />
          {selectedCity?.name || placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {dropdown}

      {districts.length > 0 && (
        <select
          value={districtValue ?? ''}
          onChange={(e) => onChange(value, e.target.value ? Number(e.target.value) : null)}
          className={`mt-2 w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#F5A623]/40 ${t.select}`}
        >
          <option value="">İlçe seçin (opsiyonel)</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      )}
    </div>
  );
}
