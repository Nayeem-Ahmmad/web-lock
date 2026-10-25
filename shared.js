// Web Lock - shared logic (hashing, storage, lockout, unlock session)
// Only salted + hashed values are stored. The real password and the real
// recovery key are never saved anywhere.

const CONFIG_KEY = "wl_config";
const GUARD_KEY = "wl_guard";
const SESSION_KEY = "wl_unlockedUntil";

export const PBKDF2_ITERATIONS = 210000;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_ATTEMPTS_BEFORE_LOCK = 5;

export const LANDING_PRESETS = {
  google: "https://www.google.com/",
  bing: "https://www.bing.com/",
  duckduckgo: "https://duckduckgo.com/"
};

// ---------- small helpers ----------

function toB64(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function fromB64(str) {
  const s = atob(str);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

function randomBytes(n) {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  return a;
}

function safeEqual(a, b) {
  // constant-time style string comparison
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function derive(secret, saltB64, iterations) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fromB64(saltB64), iterations },
    baseKey,
    256
  );
  return toB64(new Uint8Array(bits));
}

async function makeHash(secret) {
  const salt = toB64(randomBytes(16));
  const hash = await derive(secret, salt, PBKDF2_ITERATIONS);
  return { salt, hash };
}

// ---------- storage ----------

export async function getConfig() {
  const r = await chrome.storage.local.get(CONFIG_KEY);
  return r[CONFIG_KEY] || null;
}

export async function saveConfig(cfg) {
  await chrome.storage.local.set({ [CONFIG_KEY]: cfg });
}

async function getGuard() {
  const r = await chrome.storage.local.get(GUARD_KEY);
  return r[GUARD_KEY] || { failCount: 0, lockUntil: 0 };
}

async function saveGuard(g) {
  await chrome.storage.local.set({ [GUARD_KEY]: g });
}

// ---------- recovery key ----------

const KEY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 chars, no I/O/0/1

export function generateRecoveryKey() {
  const bytes = randomBytes(20);
  let raw = "";
  for (const b of bytes) raw += KEY_ALPHABET[b & 31]; // 32 symbols -> no bias
  return raw.match(/.{5}/g).join("-"); // XXXXX-XXXXX-XXXXX-XXXXX
}

export function normalizeKey(k) {
  return String(k || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// ---------- credential creation ----------

export function validatePassword(pw) {
  if (typeof pw !== "string" || pw.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export async function buildCredentials(password, recoveryKey) {
  const p = await makeHash(password);
  const r = await makeHash(normalizeKey(recoveryKey));
  return {
    pwSalt: p.salt,
    pwHash: p.hash,
    recSalt: r.salt,
    recHash: r.hash,
    iterations: PBKDF2_ITERATIONS
  };
}

export async function createInitialConfig(password, recoveryKey) {
  const creds = await buildCredentials(password, recoveryKey);
  const cfg = {
    version: 1,
    ...creds,
    timeoutMin: 0, // 0 = ask every time (new-tab mode only)
    lockMode: "newtab", // "newtab" | "browser"
    landing: "google",
    customLanding: ""
  };
  await saveConfig(cfg);
  return cfg;
}

export async function setNewPassword(cfg, newPassword) {
  const p = await makeHash(newPassword);
  cfg.pwSalt = p.salt;
  cfg.pwHash = p.hash;
  cfg.iterations = PBKDF2_ITERATIONS;
  await saveConfig(cfg);
  return cfg;
}

export async function setNewRecoveryKey(cfg, recoveryKey) {
  const r = await makeHash(normalizeKey(recoveryKey));
  cfg.recSalt = r.salt;
  cfg.recHash = r.hash;
  await saveConfig(cfg);
  return cfg;
}

// ---------- verification with lockout ----------

export async function lockRemainingMs() {
  const g = await getGuard();
  return Math.max(0, (g.lockUntil || 0) - Date.now());
}

export async function attemptsLeft() {
  const g = await getGuard();
  return MAX_ATTEMPTS_BEFORE_LOCK - ((g.failCount || 0) % MAX_ATTEMPTS_BEFORE_LOCK);
}

async function registerFail() {
  const g = await getGuard();
  g.failCount = (g.failCount || 0) + 1;
  if (g.failCount % MAX_ATTEMPTS_BEFORE_LOCK === 0) {
    const step = g.failCount / MAX_ATTEMPTS_BEFORE_LOCK; // 1,2,3...
    const ms = Math.min(30000 * Math.pow(2, step - 1), 15 * 60 * 1000);
    g.lockUntil = Date.now() + ms;
  }
  await saveGuard(g);
  return g;
}

async function resetGuard() {
  await saveGuard({ failCount: 0, lockUntil: 0 });
}

async function verifyAgainst(cfg, secret, saltField, hashField) {
  const wait = await lockRemainingMs();
  if (wait > 0) return { ok: false, lockedMs: wait };

  const hash = await derive(secret, cfg[saltField], cfg.iterations || PBKDF2_ITERATIONS);
  if (safeEqual(hash, cfg[hashField])) {
    await resetGuard();
    return { ok: true, lockedMs: 0 };
  }
  await registerFail();
  return { ok: false, lockedMs: await lockRemainingMs() };
}

export function verifyPassword(cfg, password) {
  return verifyAgainst(cfg, password, "pwSalt", "pwHash");
}

export function verifyRecoveryKey(cfg, key) {
  return verifyAgainst(cfg, normalizeKey(key), "recSalt", "recHash");
}

// ---------- unlock session ----------
// chrome.storage.session lives only in memory and is cleared when the
// browser closes, so an "unlocked" state never survives a restart.

export async function markUnlocked(timeoutMin) {
  if (!timeoutMin || timeoutMin <= 0) return;
  await chrome.storage.session.set({
    [SESSION_KEY]: Date.now() + timeoutMin * 60 * 1000
  });
}

export async function isUnlocked() {
  const r = await chrome.storage.session.get(SESSION_KEY);
  return typeof r[SESSION_KEY] === "number" && r[SESSION_KEY] > Date.now();
}

export async function clearUnlock() {
  await chrome.storage.session.remove(SESSION_KEY);
}

// In "browser" mode, "ask every time" makes no sense (every click would ask),
// so a minimum idle timeout is applied (default 5 minutes).
export function effectiveTimeout(cfg) {
  const t = Number(cfg && cfg.timeoutMin) || 0;
  if (cfg && cfg.lockMode === "browser") return t >= 1 ? t : 5;
  return t;
}

// Sliding idle timeout: while the user is active and unlocked, push the
// expiry forward again.
export async function touchUnlock(cfg) {
  if (await isUnlocked()) await markUnlocked(effectiveTimeout(cfg));
}

// ---------- which addresses the Browser Lock guards ----------
const SKIP_INTERNAL_HOSTS = ["newtab", "new-tab-page", "new-tab-page-third-party"];

export function shouldGuardUrl(url) {
  let u;
  try {
    u = new URL(url);
  } catch (e) {
    return false;
  }
  const p = u.protocol;
  if (p === "http:" || p === "https:" || p === "ftp:" || p === "file:") return true;
  if (p === "chrome:" || p === "brave:" || p === "edge:") {
    return !SKIP_INTERNAL_HOSTS.includes(u.hostname);
  }
  return false; // chrome-extension:, about:, data:, blob:, javascript: ...
}

// ---------- landing page ----------

export function resolveLandingUrl(cfg) {
  if (cfg.landing === "custom") {
    try {
      const u = new URL(cfg.customLanding);
      if (u.protocol === "https:" || u.protocol === "http:") return u.href;
    } catch (e) { /* fall through */ }
    return LANDING_PRESETS.google;
  }
  return LANDING_PRESETS[cfg.landing] || LANDING_PRESETS.google;
}

export function validateCustomUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch (e) {
    return false;
  }
}

// ---------- misc ----------

export function formatDuration(ms) {
  const s = Math.ceil(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}
