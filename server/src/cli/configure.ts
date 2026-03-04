#!/usr/bin/env node
/**
 * PhishyX CLI — configure and fire the phishing lure.
 *
 * Usage:
 *   npm run configure                 interactive menu
 *   npm run configure add <email>     add a lure recipient
 *   npm run configure remove <email>  remove a recipient
 *   npm run configure list            list recipients + current URL
 *   npm run configure clear           remove all recipients
 *   npm run configure url <url>       set the phishing page URL
 *   npm run configure send            send lure email to all recipients NOW
 */
import "dotenv/config";
import readline from "readline";
import { readConfig, writeConfig } from "../config/phishyx.config";
import { generateLoginAlertEmail } from "../templates/login-alert.template";
import { sendMail } from "../services/mailer.service";

// ── helpers ──────────────────────────────────────────────────────────────────

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}

function printStatus(): void {
  const cfg = readConfig();
  console.log("\n📋  Recipients:");
  if (cfg.alertTo.length === 0) {
    console.log("     (none)");
  } else {
    cfg.alertTo.forEach((e, i) => console.log(`     [${i + 1}] ${e}`));
  }
  console.log(`\n🔗  Phishing URL: ${cfg.phishingUrl}\n`);
}

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

// ── send lure ────────────────────────────────────────────────────────────────

async function sendLure(recipients: string[], phishingUrl: string): Promise<void> {
  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER;
  if (!from) {
    console.error("❌  SMTP sender not configured. Check server/.env (MAIL_FROM / SMTP_USER).");
    process.exit(1);
  }

  // Use generic but realistic-looking device info for the lure
  const now = new Date();
  const lureData = {
    username: "",          // filled per-recipient below
    os: "Windows 11",
    browser: "Chrome",
    city: "",
    country: "",
    publicIp: "",
    phishingUrl,
  };

  console.log(`\n📤  Sending lure to ${recipients.length} recipient(s)…\n`);

  for (const to of recipients) {
    const { subject, html, text } = generateLoginAlertEmail({ ...lureData, username: to });
    try {
      await sendMail({ from, to, subject, html, text });
      console.log(`  ✅  Sent → ${to}`);
    } catch (err) {
      console.error(`  ❌  Failed → ${to}:`, err instanceof Error ? err.message : err);
    }
  }
  console.log();
}

// ── sub-commands ──────────────────────────────────────────────────────────────

function cmdList(): void {
  printStatus();
}

function cmdAdd(email: string): void {
  const e = email.trim();
  if (!isValidEmail(e)) { console.error(`❌  Invalid email: ${e}`); process.exit(1); }
  const cfg = readConfig();
  if (cfg.alertTo.includes(e)) { console.log(`ℹ️   ${e} is already in the list.`); return; }
  cfg.alertTo.push(e);
  writeConfig(cfg);
  console.log(`✅  Added: ${e}`);
}

function cmdRemove(email: string): void {
  const e = email.trim();
  const cfg = readConfig();
  const before = cfg.alertTo.length;
  cfg.alertTo = cfg.alertTo.filter((x) => x !== e);
  if (cfg.alertTo.length === before) { console.log(`ℹ️   ${e} was not found.`); return; }
  writeConfig(cfg);
  console.log(`🗑️   Removed: ${e}`);
}

function cmdClear(): void {
  const cfg = readConfig();
  cfg.alertTo = [];
  writeConfig(cfg);
  console.log("🗑️   All recipients cleared.");
}

function cmdSetUrl(url: string): void {
  const u = url.trim();
  if (!u.startsWith("http")) { console.error("❌  URL must start with http:// or https://"); process.exit(1); }
  const cfg = readConfig();
  cfg.phishingUrl = u;
  writeConfig(cfg);
  console.log(`✅  Phishing URL set to: ${u}`);
}

async function cmdSend(): Promise<void> {
  const cfg = readConfig();
  if (cfg.alertTo.length === 0) {
    console.error("❌  No recipients configured. Add one first:\n    npm run configure add <email>");
    process.exit(1);
  }
  await sendLure(cfg.alertTo, cfg.phishingUrl);
}

// ── interactive menu ──────────────────────────────────────────────────────────

async function interactiveMenu(): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log("\n╔═══════════════════════════════════════════╗");
  console.log("║         PhishyX — Control Panel          ║");
  console.log("╚═══════════════════════════════════════════╝");

  let running = true;
  while (running) {
    printStatus();
    console.log("  1) Add recipient email");
    console.log("  2) Remove recipient email");
    console.log("  3) Set phishing URL");
    console.log("  4) Send lure email to all recipients NOW");
    console.log("  5) Clear all recipients");
    console.log("  6) Exit");
    console.log();

    const choice = (await prompt(rl, "Choose [1-6]: ")).trim();

    switch (choice) {
      case "1": {
        const raw = await prompt(rl, "  Email to add: ");
        const e = raw.trim();
        if (!isValidEmail(e)) { console.log("  ❌  Invalid email.\n"); break; }
        const cfg = readConfig();
        if (cfg.alertTo.includes(e)) { console.log("  ℹ️   Already in list.\n"); break; }
        cfg.alertTo.push(e);
        writeConfig(cfg);
        console.log(`  ✅  Added ${e}\n`);
        break;
      }
      case "2": {
        const cfg = readConfig();
        if (cfg.alertTo.length === 0) { console.log("  ℹ️   List is empty.\n"); break; }
        const raw = await prompt(rl, "  Email to remove: ");
        const e = raw.trim();
        const before = cfg.alertTo.length;
        cfg.alertTo = cfg.alertTo.filter((x) => x !== e);
        if (cfg.alertTo.length === before) { console.log("  ℹ️   Not found.\n"); break; }
        writeConfig(cfg);
        console.log(`  🗑️   Removed ${e}\n`);
        break;
      }
      case "3": {
        const cfg = readConfig();
        const raw = await prompt(rl, `  New phishing URL [${cfg.phishingUrl}]: `);
        const u = raw.trim();
        if (!u) { console.log("  ℹ️   Unchanged.\n"); break; }
        if (!u.startsWith("http")) { console.log("  ❌  Must start with http:// or https://\n"); break; }
        cfg.phishingUrl = u;
        writeConfig(cfg);
        console.log(`  ✅  URL updated to ${u}\n`);
        break;
      }
      case "4": {
        const cfg = readConfig();
        if (cfg.alertTo.length === 0) { console.log("  ❌  No recipients. Add one first.\n"); break; }
        const confirm = await prompt(
          rl,
          `  Send lure to ${cfg.alertTo.length} recipient(s)? [y/N]: `
        );
        if (confirm.trim().toLowerCase() !== "y") { console.log("  Cancelled.\n"); break; }
        rl.pause();
        await sendLure(cfg.alertTo, cfg.phishingUrl);
        rl.resume();
        break;
      }
      case "5": {
        const confirm = await prompt(rl, "  Clear all recipients? [y/N]: ");
        if (confirm.trim().toLowerCase() === "y") {
          const cfg = readConfig();
          cfg.alertTo = [];
          writeConfig(cfg);
          console.log("  🗑️   Cleared.\n");
        } else {
          console.log("  Cancelled.\n");
        }
        break;
      }
      case "6":
        running = false;
        break;
      default:
        console.log("  Invalid choice.\n");
    }
  }

  rl.close();
  console.log("Bye!\n");
}

// ── entry point ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const [, , cmd, arg] = process.argv;

  switch (cmd) {
    case "list":
      cmdList();
      break;
    case "add":
      if (!arg) { console.error("Usage: npm run configure add <email>"); process.exit(1); }
      cmdAdd(arg);
      break;
    case "remove":
    case "rm":
      if (!arg) { console.error("Usage: npm run configure remove <email>"); process.exit(1); }
      cmdRemove(arg);
      break;
    case "clear":
      cmdClear();
      break;
    case "url":
      if (!arg) { console.error("Usage: npm run configure url <url>"); process.exit(1); }
      cmdSetUrl(arg);
      break;
    case "send":
      await cmdSend();
      break;
    default:
      await interactiveMenu();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });


