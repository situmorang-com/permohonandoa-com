"use client";

import { useState } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";

interface LocationPickerProps {
  onLocationChange: (data: { location: string; latitude: number; longitude: number }) => void;
  defaultValue?: string;
}

export default function LocationPicker({ onLocationChange, defaultValue = "" }: LocationPickerProps) {
  const [location, setLocation] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) return;

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            data.address?.state ||
            "Lokasi saya";
          setLocation(city);
          onLocationChange({ location: city, latitude, longitude });
        } catch {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          onLocationChange({ location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, latitude, longitude });
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleInputChange = (value: string) => {
    setLocation(value);
    onLocationChange({ location: value, latitude: 0, longitude: 0 });
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Kota atau daerah..."
          value={location}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 outline-none transition-all focus:border-indigo-400 dark:focus:border-indigo-500 placeholder:text-slate-400"
        />
      </div>
      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Navigation className="h-3.5 w-3.5" />
        )}
        Gunakan lokasi saya
      </button>
    </div>
  );
}
