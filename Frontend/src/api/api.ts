import type { Release } from '../types/types';

const BASE = '/api/releases';

async function fetchRelease(path: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res;
}

export async function getReleases(): Promise<Release[]> {
  const res = await fetchRelease(BASE);
  return res.json();
}

export async function getRelease(id: number): Promise<Release> {
  const res = await fetchRelease(`${BASE}/${id}`);
  return res.json();
}

export async function createRelease(data: { name: string; date: string; additionalInfo?: string }): Promise<Release> {
  const res = await fetchRelease(BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateRelease(id: number, data: { name?: string; date?: string; additionalInfo?: string }): Promise<Release> {
  const res = await fetchRelease(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function toggleStep(id: number, stepIndex: number): Promise<Release> {
  const res = await fetchRelease(`${BASE}/${id}/steps/${stepIndex}`, {
    method: 'PATCH',
  });
  return res.json();
}

export async function deleteRelease(id: number): Promise<void> {
  await fetchRelease(`${BASE}/${id}`, { method: 'DELETE' });
}
