import fs from "fs";
import path from "path";

const CONFIG_PATH = path.resolve(__dirname, "../../phishyx.config.json");

export interface PhishyxConfig {
  /** Email address(es) that receive the Instagram-style lure alert */
  alertTo: string[];
  /** The phishing page URL embedded in the lure email ("secure your account" link) */
  phishingUrl: string;
}

const DEFAULT_CONFIG: PhishyxConfig = { alertTo: [], phishingUrl: "http://localhost:5173" };

export function readConfig(): PhishyxConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, "utf8");
      return { ...DEFAULT_CONFIG, ...(JSON.parse(raw) as Partial<PhishyxConfig>) };
    }
  } catch {
    // corrupted file — fall back to default
  }
  return { ...DEFAULT_CONFIG };
}

export function writeConfig(cfg: PhishyxConfig): void {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + "\n", "utf8");
}
