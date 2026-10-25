// Web Lock - background service worker
// 1) On first install, open a new tab so the user lands on the setup screen.
// 2) Clicking the toolbar icon opens the settings page.

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({});
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
