"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Loader2, Heart, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface NearbyPrayer {
  id: string;
  name: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  prayerCount: number;
  distance: number; // in km
  createdAt: string;
}

export default function NearbyPrayers() {
  const [prayers, setPrayers] = useState<NearbyPrayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);

  const fetchNearby = (lat: number, lng: number) => {
    setLoading(true);
    fetch(`/api/prayers/nearby?lat=${lat}&lng=${lng}&radius=50`)
      .then((res) => res.json())
      .then((data) => {
        setPrayers(data);
        setLocationGranted(true);
      })
      .catch(() => setError("Gagal memuat doa terdekat"))
      .finally(() => setLoading(false));
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung geolokasi");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchNearby(pos.coords.latitude, pos.coords.longitude),
      () => {
        setError("Izin lokasi ditolak");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const formatDistance = (km: number) => {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  };

  if (!locationGranted && !loading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800 p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20">
            <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-serif text-lg text-slate-900 dark:text-slate-100">Doa Di Sekitarmu</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
            Aktifkan lokasi untuk melihat permohonan doa dari saudara seiman di sekitarmu
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={requestLocation}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 dark:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            <Navigation className="h-4 w-4" />
            Aktifkan Lokasi
          </motion.button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800 p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Mencari doa di sekitarmu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <h3 className="font-serif text-lg text-slate-900 dark:text-slate-100">Doa Di Sekitarmu</h3>
      </div>

      {prayers.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800 p-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Belum ada permohonan doa di sekitarmu. Jadilah yang pertama!
          </p>
        </div>
      ) : (
        prayers.map((prayer, index) => (
          <motion.div
            key={prayer.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {prayer.isAnonymous ? "Hamba Tuhan" : prayer.name}
                  </p>
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 ring-1 ring-blue-200/50 dark:ring-blue-800/50">
                    <MapPin className="h-2.5 w-2.5" />
                    {formatDistance(prayer.distance)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {prayer.content}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(prayer.createdAt), { addSuffix: true, locale: idLocale })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {prayer.prayerCount} doa
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
