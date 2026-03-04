import { Request } from "express";

/**
 * Extracts the real client IP from a request, checking all common
 * proxy / CDN headers in priority order before falling back to the
 * raw socket address.
 *
 * Header priority:
 *  1. cf-connecting-ip   – Cloudflare
 *  2. x-real-ip          – Nginx / common reverse proxies
 *  3. x-forwarded-for    – Standard proxy chain (first = original client)
 *  4. x-client-ip        – Some load balancers
 *  5. x-cluster-client-ip – Some cluster setups
 *  6. req.ip             – Express built-in (requires trust proxy)
 *  7. socket.remoteAddress – Raw TCP connection
 */
export function extractIp(req: Request): string {
  const header = (name: string): string | undefined => {
    const val = req.headers[name];
    if (!val) return undefined;
    // x-forwarded-for can be a comma-separated list; take the first (client) IP
    return (Array.isArray(val) ? val[0] : val).split(",")[0].trim();
  };

  return (
    header("cf-connecting-ip") ??
    header("x-real-ip") ??
    header("x-forwarded-for") ??
    header("x-client-ip") ??
    header("x-cluster-client-ip") ??
    req.ip ??
    req.socket.remoteAddress ??
    "unknown"
  );
}
