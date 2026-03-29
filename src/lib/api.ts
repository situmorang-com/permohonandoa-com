import { PrayerCategory } from "./types";

const BASE = "/api/prayers";

export interface PrayerData {
  id: string;
  name: string;
  category: string;
  content: string;
  isAnonymous: boolean;
  prayerCount: number;
  isAnswered: boolean;
  isUrgent: boolean;
  answeredAt: string | null;
  answeredTestimony: string | null;
  scriptureVerse: string | null;
  createdAt: string;
  updatedAt: string;
  updates?: { id: string; content: string; createdAt: string }[];
}

export async function fetchPrayers(params?: {
  tab?: string;
  category?: string;
  search?: string;
}): Promise<PrayerData[]> {
  const url = new URL(BASE, window.location.origin);
  if (params?.tab && params.tab !== "semua") url.searchParams.set("tab", params.tab);
  if (params?.category && params.category !== "semua") url.searchParams.set("category", params.category);
  if (params?.search) url.searchParams.set("search", params.search);
  const res = await fetch(url.toString());
  return res.json();
}

export async function fetchStats(): Promise<{
  total: number;
  answered: number;
  prayerCount: number;
}> {
  const res = await fetch(`${BASE}/stats`);
  return res.json();
}

export async function createPrayer(data: {
  name: string;
  category: PrayerCategory;
  content: string;
  isAnonymous: boolean;
  isUrgent: boolean;
  scriptureVerse?: string;
}): Promise<PrayerData> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function prayForRequest(id: string): Promise<PrayerData> {
  const res = await fetch(`${BASE}/${id}/pray`, { method: "POST" });
  return res.json();
}

export async function markAnswered(id: string, testimony: string): Promise<PrayerData> {
  const res = await fetch(`${BASE}/${id}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testimony }),
  });
  return res.json();
}

export async function addPrayerUpdate(id: string, content: string): Promise<PrayerData> {
  const res = await fetch(`${BASE}/${id}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function deletePrayerRequest(id: string): Promise<void> {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}
