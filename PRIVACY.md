# Web Lock - Privacy Policy

_Last updated: 2026-10-25 (version 2.0.0)_

**Web Lock does not collect, transmit, or share any personal data.**

## What is stored
Web Lock stores the following **only on your own device**, using the browser's `chrome.storage` area:

- A salted PBKDF2-SHA256 hash of your password (never the password itself)
- A salted PBKDF2-SHA256 hash of your recovery key (never the key itself)
- Your settings (lock mode, idle timeout, landing page)
- A counter of failed attempts, used to slow down guessing
- A temporary "unlocked until" timestamp, kept in memory and cleared when the browser closes

## Permissions
- `storage` (always): to keep the items above.
- `webNavigation` (**optional**, requested only if you turn on "Browser Lock" in Settings): lets Web Lock notice that a page is about to load so it can ask for your password first. The address is used only in memory to send you to the lock screen and then on to the page you wanted. Web Lock does **not** record, store, or send your browsing history. While the lock screen is shown, the address you were heading to is part of the lock page's own address inside your browser, so it can appear in your local browser history like any other page.

## What is NOT done
- No data is sent to any server. Web Lock makes no network requests.
- No analytics, tracking, advertising, or third-party code.
- Web Lock does not read page contents, saved browser passwords, or any website data.

## Removing your data
Removing the extension from `chrome://extensions` deletes all data it stored.

## Changes
If this policy changes, the new version will be published with the extension and the date above will be updated.
