// lib/services.ts
//
// The single entry point for reading service data. Display components must
// import from here, never from data/services.ts directly.
//
// Phase 1: reads the local array.
// Phase 2: this function starts querying Supabase instead. Nothing that
// calls getServices() needs to change.

import { services, type Service } from "@/data/services";

export type { Service };

export async function getServices(): Promise<Service[]> {
  return services
    .filter((s) => s.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getServicesForScreen(screen: number): Promise<Service[]> {
  const all = await getServices();
  return all.filter((s) => s.screens.includes(screen));
}
