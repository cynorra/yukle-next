'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface LocationSearchProps {
  placeholder?: string;
  initialValue?: string;
  onSelect: (location: { city: string; state: string | null; country: string }) => void;
  className?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    suburb?: string;
    state?: string;
    region?: string;
    country?: string;
  };
}

export default function LocationSearch({
  placeholder,
  initialValue = '',
  onSelect,
  className = '',
}: LocationSearchProps) {
  const { locale, t } = useTranslation();
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced API fetch
  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&limit=5&accept-language=${locale}`,
          {
            headers: {
              'User-Agent': 'LoadlyAppLojistikPlatform/1.0',
            },
          }
        );
        if (response.ok) {
          const data: NominatimResult[] = await response.json();
          setSuggestions(data);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, locale]);

  const handleSelect = (item: NominatimResult) => {
    const { address } = item;
    
    // Resolve city/town/village name
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.suburb ||
      '';

    const state = address.state || address.region || null;
    const country = address.country || '';

    // If city is missing, fallback to display name part
    const resolvedCity = city || item.display_name.split(',')[0].trim();

    onSelect({ city: resolvedCity, state, country });
    setQuery(`${resolvedCity}, ${country}`);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div className="relative flex items-center">
        <MapPin size={18} className="absolute left-4 text-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          placeholder={placeholder || t.marketplace.searchPlaceholder}
          className="w-full pl-12 pr-10 py-3.5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-fg rounded-xl placeholder:text-muted/50 focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all font-medium text-sm outline-none"
        />
        {isLoading && (
          <Loader2 size={16} className="absolute right-4 text-accent animate-spin" />
        )}
        {!isLoading && query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 text-muted hover:text-fg p-0.5 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <button
              key={item.place_id}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full px-5 py-3 text-left hover:bg-background-light dark:hover:bg-background-dark transition-colors flex items-start gap-3 border-b border-border-light/40 dark:border-border-dark/40 last:border-b-0 text-sm font-semibold text-fg/90"
            >
              <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
              <span>{item.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
