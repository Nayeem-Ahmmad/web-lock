# Web Lock - Privacy Policy

_Last updated: 2026-10-25_

**Web Lock does not collect, transmit, or share any personal data.**

## What is stored
Web Lock stores the following **only on your own device**, using the browser's `chrome.storage` area:

- A salted PBKDF2-SHA256 hash of your password (never the password itself)
- A salted PBKDF2-SHA256 hash of your recovery key (never the key itself)
- Your settings (unlock duration, landing page)
- A counter of failed attempts, used to slow down guessing
- A temporary "unlocked until" timestamp, kept in memory and cleared when the browser closes

## What is NOT done
- No data is sent to any server. Web Lock makes no network requests.
- No analytics, tracking, advertising, or third-party code.
- Web Lock does not read your browsing history, page contents, passwords saved in the browser, or any website data. The only permission it requests is `storage`.

## Removing your data
Removing the extension from `chrome://extensions` deletes all data it stored.

## Changes
If this policy changes, the new version will be published with the extension and the date above will be updated.
