export interface GeoInfo {
  city: string;
  country: string;
  region: string;
  timezone: string;
}

const UNKNOWN: GeoInfo = { city: "Unknown", country: "Unknown", region: "", timezone: "" };

/**
 * Resolve approximate geolocation for a public IP using ip-api.com (free, no key).
 * Returns UNKNOWN fields when the IP is private/loopback or the request fails.
 */
export async function resolveGeo(ip: string): Promise<GeoInfo> {
  // Private / loopback — no point querying
  if (
    !ip ||
    ip === "unknown" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.") ||
    ip === "::1" ||
    ip === "127.0.0.1"
  ) {
    return UNKNOWN;
  }

  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,country,regionName,timezone`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return UNKNOWN;
    const data = (await res.json()) as {
      status: string;
      city?: string;
      country?: string;
      regionName?: string;
      timezone?: string;
    };
    if (data.status !== "success") return UNKNOWN;
    return {
      city: data.city ?? "Unknown",
      country: data.country ?? "Unknown",
      region: data.regionName ?? "",
      timezone: data.timezone ?? "",
    };
  } catch {
    return UNKNOWN;
  }
}
