// Web Lock - settings page logic
import * as WL from "./shared.js";

const $ = (id) => document.getElementById(id);
let cfg = null;
let countdownTimer = null;

function showOnly(name) {
  for (const v of ["gate", "nosetup", "settings"]) $("view-" + v).hidden = v !== name;
  document.body.classList.add("ready");
}

function say(id, text, kind) {
  const el = $(id);
  el.textContent = text;
  el.className = "msg" + (kind ? " " + kind : "");
}

document.querySelectorAll(".toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = $(btn.dataset.target);
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    btn.textContent = hidden ? "Hide" : "Show";
  });
});

// ---------- gate ----------
function startCountdown(ms) {
  clearInterval(countdownTimer);
  const until = Date.now() + ms;
  $("btn-gate").disabled = true;
  $("gate-pw").disabled = true;
  const tick = () => {
    const left = until - Date.now();
    if (left <= 0) {
      clearInterval(countdownTimer);
      $("btn-gate").disabled = false;
      $("gate-pw").disabled = false;
      say("msg-gate", "");
      $("gate-pw").focus();
      return;
    }
    say("msg-gate", `Too many attempts. Try again in ${WL.formatDuration(left)}.`, "error");
  };
  tick();
  countdownTimer = setInterval(tick, 500);
}

$("form-gate").addEventListener("submit", async (e) => {
  e.preventDefault();
  const pw = $("gate-pw").value;
  if (!pw) return;
  $("btn-gate").disabled = true;
  const res = await WL.verifyPassword(cfg, pw);
  if (res.ok) {
    $("gate-pw").value = "";
    loadSettings();
    return showOnly("settings");
  }
  $("gate-pw").value = "";
  if (res.lockedMs > 0) return startCountdown(res.lockedMs);
  $("btn-gate").disabled = false;
  const left = await WL.attemptsLeft();
  say("msg-gate", `Wrong password. ${left} attempt(s) left before a temporary lock.`, "error");
  $("gate-pw").focus();
});

// ---------- settings ----------
const MODE_HINTS = {
  newtab: "Asks for the password when you open a new tab.",
  browser: "Also asks when you type an address, use a bookmark or click a link while locked. " +
    "Chrome will ask your permission to \"read your browsing history\" (webNavigation). " +
    "Web Lock does not store or send any address."
};

function syncMode() {
  const mode = $("set-mode").value;
  $("mode-hint").textContent = MODE_HINTS[mode];
  $("opt-every").disabled = mode === "browser";
  if (mode === "browser" && $("set-timeout").value === "0") $("set-timeout").value = "5";
}
$("set-mode").addEventListener("change", syncMode);

function loadSettings() {
  $("set-mode").value = cfg.lockMode === "browser" ? "browser" : "newtab";
  $("set-timeout").value = String(cfg.timeoutMin || 0);
  $("set-landing").value = cfg.landing || "google";
  $("set-custom").value = cfg.customLanding || "";
  $("set-custom").hidden = $("set-landing").value !== "custom";
  syncMode();
}

$("set-landing").addEventListener("change", () => {
  $("set-custom").hidden = $("set-landing").value !== "custom";
});

$("btn-save-settings").addEventListener("click", async () => {
  let mode = $("set-mode").value;
  if (mode === "browser") {
    // Must be called straight from the click (user gesture).
    let granted = false;
    try {
      granted = await chrome.permissions.request({ permissions: ["webNavigation"] });
    } catch (e) { granted = false; }
    if (!granted) {
      $("set-mode").value = "newtab";
      syncMode();
      return say("msg-settings", "Browser Lock needs the permission, which was not granted. Mode stays 'New tab only'.", "error");
    }
  } else {
    try { await chrome.permissions.remove({ permissions: ["webNavigation"] }); } catch (e) { /* ignore */ }
  }
  const landing = $("set-landing").value;
  const custom = $("set-custom").value.trim();
  if (landing === "custom" && !WL.validateCustomUrl(custom)) {
    return say("msg-settings", "Enter a valid address starting with https:// or http://", "error");
  }
  cfg.lockMode = mode;
  cfg.timeoutMin = parseInt($("set-timeout").value, 10) || 0;
  if (mode === "browser" && cfg.timeoutMin < 1) cfg.timeoutMin = 5;
  cfg.landing = landing;
  cfg.customLanding = landing === "custom" ? custom : "";
  await WL.saveConfig(cfg);
  await WL.clearUnlock(); // apply the new timeout cleanly
  say("msg-settings", "Settings saved.", "ok");
});

$("btn-change-pw").addEventListener("click", async () => {
  const pw = $("chg-pw").value;
  const pw2 = $("chg-pw2").value;
  const err = WL.validatePassword(pw);
  if (err) return say("msg-pw", err, "error");
  if (pw !== pw2) return say("msg-pw", "Passwords do not match.", "error");
  await WL.setNewPassword(cfg, pw);
  await WL.clearUnlock();
  $("chg-pw").value = "";
  $("chg-pw2").value = "";
  say("msg-pw", "Password changed.", "ok");
});

$("btn-new-key").addEventListener("click", async () => {
  const key = WL.generateRecoveryKey();
  await WL.setNewRecoveryKey(cfg, key);
  const box = $("new-key-box");
  box.textContent = key;
  box.hidden = false;
  say("msg-key", "Save this key now. It will not be shown again.", "ok");
});

// ---------- start ----------
(async function init() {
  cfg = await WL.getConfig();
  if (!cfg) return showOnly("nosetup");
  showOnly("gate");
  const wait = await WL.lockRemainingMs();
  if (wait > 0) startCountdown(wait);
})();
