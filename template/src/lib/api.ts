/**
 * Venpu API Client (Server-side only)
 *
 * Uses VENPU_API_KEY for authentication via X-API-Key header.
 * These functions must only be called from Astro frontmatter (server-side).
 * The API key is never exposed to the browser.
 */

import type {
  Vehicle,
  VehicleListResponse,
  VehicleDetailResponse,
} from "../types/vehicle";

function getApiConfig() {
  const apiUrl = import.meta.env.VENPU_API_URL;
  const apiKey = import.meta.env.VENPU_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error(
      "VENPU_API_URL and VENPU_API_KEY environment variables are required"
    );
  }

  return { apiUrl, apiKey };
}

async function apiFetch<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const { apiUrl, apiKey } = getApiConfig();

  const url = new URL(path, apiUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Fetch all vehicles for this organization.
 * Uses a high limit since dealer sites typically have <200 vehicles
 * and client-side filtering needs the full dataset.
 */
export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const response = await apiFetch<VehicleListResponse>("/v1/vehicles", {
      limit: "500",
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
}

/**
 * Fetch a single vehicle by its unique code.
 * Direct lookup — no need to fetch all vehicles first.
 */
export async function getVehicleByCode(
  code: string
): Promise<Vehicle | null> {
  try {
    const response = await apiFetch<VehicleDetailResponse>(
      `/v1/vehicles/${encodeURIComponent(code)}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching vehicle ${code}:`, error);
    return null;
  }
}

/**
 * Fetch featured vehicles (most recently published).
 */
export async function getFeaturedVehicles(
  limit: number = 10
): Promise<Vehicle[]> {
  try {
    const response = await apiFetch<VehicleListResponse>("/v1/vehicles", {
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: String(limit),
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching featured vehicles:", error);
    return [];
  }
}
