export interface ParsedUA {
  os: string;
  browser: string;
}

/**
 * Lightweight User-Agent parser — no deps.
 * Extracts a human-readable OS and browser name from a UA string.
 */
export function parseUserAgent(ua: string): ParsedUA {
  const s = ua ?? "";

  // ── OS ──────────────────────────────────────────────────────────
  let os = "Unknown OS";
  if (/android/i.test(s)) {
    const m = s.match(/Android\s([\d.]+)/i);
    os = `Android${m ? " " + m[1] : ""}`;
  } else if (/iphone|ipad|ipod/i.test(s)) {
    const m = s.match(/OS\s([\d_]+)/i);
    os = `iOS${m ? " " + m[1].replace(/_/g, ".") : ""}`;
  } else if (/macintosh|mac os x/i.test(s)) {
    const m = s.match(/Mac OS X\s([\d_.]+)/i);
    os = `macOS${m ? " " + m[1].replace(/_/g, ".") : ""}`;
  } else if (/windows nt/i.test(s)) {
    const versions: Record<string, string> = {
      "10.0": "10/11", "6.3": "8.1", "6.2": "8", "6.1": "7",
    };
    const m = s.match(/Windows NT\s([\d.]+)/i);
    const ver = m ? (versions[m[1]] ?? m[1]) : "";
    os = `Windows${ver ? " " + ver : ""}`;
  } else if (/linux/i.test(s)) {
    os = "Linux";
  } else if (/cros/i.test(s)) {
    os = "ChromeOS";
  }

  // ── Browser ──────────────────────────────────────────────────────
  let browser = "Unknown Browser";
  if (/edg\//i.test(s)) {
    const m = s.match(/Edg\/([\d.]+)/i);
    browser = `Edge${m ? " " + m[1].split(".")[0] : ""}`;
  } else if (/opr\//i.test(s)) {
    const m = s.match(/OPR\/([\d.]+)/i);
    browser = `Opera${m ? " " + m[1].split(".")[0] : ""}`;
  } else if (/chrome\//i.test(s) && !/chromium/i.test(s)) {
    const m = s.match(/Chrome\/([\d.]+)/i);
    browser = `Chrome${m ? " " + m[1].split(".")[0] : ""}`;
  } else if (/firefox\//i.test(s)) {
    const m = s.match(/Firefox\/([\d.]+)/i);
    browser = `Firefox${m ? " " + m[1].split(".")[0] : ""}`;
  } else if (/safari\//i.test(s)) {
    const m = s.match(/Version\/([\d.]+)/i);
    browser = `Safari${m ? " " + m[1].split(".")[0] : ""}`;
  } else if (/msie|trident/i.test(s)) {
    browser = "Internet Explorer";
  }

  return { os, browser };
}
