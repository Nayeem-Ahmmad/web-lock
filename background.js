// Web Lock - background service worker (v2)
//  - On install: open a new tab so the user lands on the setup screen.
//  - Toolbar icon click: "Lock now" (ends the unlocked session, opens the lock screen).
//  - Browser Lock mode: when locked, any new top-level navigation is sent to the
//    lock screen first, then continues to the original address after unlock.
//    This uses the OPTIONAL "webNavigation" permission, requested only if the
//    user turns Browser Lock on in Settings.
import * as WL from "./shared.js";

const LOCK_PAGE = chrome.runtime.getURL("newtab.html");
let navRegistered = false;

async function onBeforeNavigate(details) {
  try {
    if (details.frameId !== 0) return; // only top-level page loads
    if (!WL.shouldGuardUrl(details.url)) return;

    const cfg = await WL.getConfig();
    if (!cfg || cfg.lockMode !== "browser") return;

    if (await WL.isUnlocked()) {
      await WL.touchUnlock(cfg);
      return;
    }
    const dest = LOCK_PAGE + "?next=" + encodeURIComponent(details.url);
    await chrome.tabs.update(details.tabId, { url: dest });
  } catch (e) {
    // never break browsing because of an internal error
  }
}

function registerNavGuard() {
  if (navRegistered) return;
  if (!chrome.webNavigation || !chrome.webNavigation.onBeforeNavigate) return;
  chrome.webNavigation.onBeforeNavigate.addListener(onBeforeNavigate);
  navRegistered = true;
}

// Must run on every service-worker start (listeners are not persisted).
registerNavGuard();
// If the user grants the optional permission while the worker is running.
chrome.permissions.onAdded.addListener(registerNavGuard);

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({});
  }
});

chrome.action.onClicked.addListener(async () => {
  await WL.clearUnlock();
  await chrome.tabs.create({});
});
