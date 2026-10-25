// Web Lock - new tab page logic
import * as WL from "./shared.js";

const $ = (id) => document.getElementById(id);
const views = ["setup", "key", "lock", "forgot"];

let cfg = null;
let countdownTimer = null;
let afterKey = null; // what to do when the user presses "Finish" on the key screen

function show(name) {
  for (const v of views) $("view-" + v).hidden = v !== name;
  document.body.classList.add("ready");
  const first = document.querySelector(`#view-${name} input:not([type=checkbox])`);
  if (first) first.focus();
}

function say(id, text, kind) {
  const el = $(id);
  el.textContent = text;
  el.className = "msg" + (kind ? " " + kind : "");
}

function goLanding() {
  location.replace(WL.resolveLandingUrl(cfg));
}

// ---------- show/hide password buttons ----------
document.querySelectorAll(".toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = $(btn.dataset.target);
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    btn.textContent = hidden ? "Hide" : "Show";
  });
});

// ---------- recovery key screen ----------
function showKeyScreen(key, onFinish) {
  $("key-value").textContent = key;
  $("key-saved").checked = false;
  $("btn-key-continue").disabled = true;
  say("msg-key", "");
  afterKey = onFinish;
  show("key");
}

$("key-saved").addEventListener("change", (e) => {
  $("btn-key-continue").disabled = !e.target.checked;
});

$("btn-copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("key-value").textContent);
    say("msg-key", "Copied to clipboard.", "ok");
  } catch (e) {
    say("msg-key", "Could not copy. Please select the key and copy it manually.", "error");
  }
});

$("btn-download").addEventListener("click", () => {
  const key = $("key-value").textContent;
  const text =
    "Web Lock - Recovery Key\n\n" + key +
    "\n\nKeep this file somewhere safe and private. " +
    "Anyone with this key can reset your Web Lock password.\n";
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "web-lock-recovery-key.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$("btn-key-continue").addEventListener("click", async () => {
  $("btn-key-continue").disabled = true;
  if (afterKey) await afterKey();
});

// ---------- setup ----------
$("form-setup").addEventListener("submit", async (e) => {
  e.preventDefault();
  const pw = $("setup-pw").value;
  const pw2 = $("setup-pw2").value;
  const err = WL.validatePassword(pw);
  if (err) return say("msg-setup", err, "error");
  if (pw !== pw2) return say("msg-setup", "Passwords do not match.", "error");

  const key = WL.generateRecoveryKey();
  // Nothing is saved until the user confirms they stored the recovery key.
  showKeyScreen(key, async () => {
    cfg = await WL.createInitialConfig(pw, key);
    await WL.markUnlocked(cfg.timeoutMin);
    goLanding();
  });
});

// ---------- lock ----------
function startCountdown(ms) {
  clearInterval(countdownTimer);
  const until = Date.now() + ms;
  $("btn-unlock").disabled = true;
  $("lock-pw").disabled = true;
  const tick = () => {
    const left = until - Date.now();
    if (left <= 0) {
      clearInterval(countdownTimer);
      $("btn-unlock").disabled = false;
      $("lock-pw").disabled = false;
      say("msg-lock", "");
      $("lock-pw").focus();
      return;
    }
    say("msg-lock", `Too many attempts. Try again in ${WL.formatDuration(left)}.`, "error");
  };
  tick();
  countdownTimer = setInterval(tick, 500);
}

$("form-lock").addEventListener("submit", async (e) => {
  e.preventDefault();
  const pw = $("lock-pw").value;
  if (!pw) return;
  $("btn-unlock").disabled = true;
  const res = await WL.verifyPassword(cfg, pw);
  if (res.ok) {
    await WL.markUnlocked(cfg.timeoutMin);
    return goLanding();
  }
  $("lock-pw").value = "";
  if (res.lockedMs > 0) return startCountdown(res.lockedMs);
  $("btn-unlock").disabled = false;
  const left = await WL.attemptsLeft();
  say("msg-lock", `Wrong password. ${left} attempt(s) left before a temporary lock.`, "error");
  $("lock-pw").focus();
});

$("link-forgot").addEventListener("click", () => show("forgot"));
$("link-back").addEventListener("click", () => show("lock"));

// ---------- forgot / reset ----------
$("form-forgot").addEventListener("submit", async (e) => {
  e.preventDefault();
  const key = $("forgot-key").value;
  const pw = $("forgot-pw").value;
  const pw2 = $("forgot-pw2").value;
  const err = WL.validatePassword(pw);
  if (err) return say("msg-forgot", err, "error");
  if (pw !== pw2) return say("msg-forgot", "Passwords do not match.", "error");

  $("btn-reset").disabled = true;
  const res = await WL.verifyRecoveryKey(cfg, key);
  $("btn-reset").disabled = false;

  if (!res.ok) {
    if (res.lockedMs > 0) {
      return say("msg-forgot", `Too many attempts. Try again in ${WL.formatDuration(res.lockedMs)}.`, "error");
    }
    return say("msg-forgot", "That recovery key is not correct.", "error");
  }

  // Key was correct: set the new password and issue a fresh recovery key
  // (the old key is now invalid).
  const newKey = WL.generateRecoveryKey();
  await WL.setNewPassword(cfg, pw);
  await WL.setNewRecoveryKey(cfg, newKey);
  showKeyScreen(newKey, async () => {
    await WL.markUnlocked(cfg.timeoutMin);
    goLanding();
  });
});

// ---------- start ----------
(async function init() {
  cfg = await WL.getConfig();
  if (!cfg) return show("setup");
  if (await WL.isUnlocked()) return goLanding();

  const wait = await WL.lockRemainingMs();
  show("lock");
  if (wait > 0) startCountdown(wait);
})();
