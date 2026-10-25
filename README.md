# Web Lock

**Ask for a password in Chrome: on every new tab, and (optionally) before any new page loads.**
**Chrome-এ নতুন ট্যাবে এবং (ঐচ্ছিকভাবে) যেকোনো নতুন পেজ খোলার আগে পাসওয়ার্ড চাইবে।**

[English](#english) | [বাংলা](#বাংলা)

---

## English

### Two lock modes
| Mode | What it locks |
|---|---|
| **New tab only** (default) | Opening a new tab (Ctrl+T) |
| **Browser Lock** (version 2) | New tab **plus** typed addresses, bookmarks and clicked links while locked. Asks once, then stays unlocked until you are idle for N minutes. |

Browser Lock needs one extra, **optional** Chrome permission (`webNavigation`, shown as "read your browsing history"). It is requested only when you switch Browser Lock on in Settings. Nothing is stored or sent anywhere.

### Features
- Create your own password on first run. A **recovery key** lets you reset a forgotten password.
- Slows down guessing: 5 wrong attempts trigger a temporary lock that grows longer.
- **Click the toolbar icon to lock now.**
- Settings: lock mode, idle timeout, and the page that opens after unlocking (Google, Bing, DuckDuckGo or your own URL).
- 100% offline. No data is collected or sent. Only salted PBKDF2-SHA256 hashes are stored on your device.

### What it does NOT do (please read)
- It does **not** hide or lock tabs that are **already open** (for example a Gmail tab you left open).
- It does **not** work in **Incognito** windows.
- It **cannot stop someone from removing** the extension.
- In Browser Lock mode a page may flash for a moment before the lock screen appears.
- It is a privacy tool against casual snooping, not a replacement for locking your computer (Win + L).

### Install (free, Chrome / Chromium browsers)
1. Go to the [**Releases**](../../releases) page and download `web-lock-v2.0.0.zip`.
2. **Extract** it to a permanent folder, for example `Documents\WebLock`. Do not delete or move this folder afterwards.
3. Open `chrome://extensions` in Chrome.
4. Turn on **Developer mode** (top right).
5. Click **Load unpacked** and select the extracted folder (the one containing `manifest.json`).
6. A new tab opens: create your password and **save your recovery key**.
7. (Optional) Open Settings and choose **Browser Lock**.

Notes:
- Chrome may show a "Developer mode extensions" warning at startup. This is normal for extensions installed this way.
- If Chrome says *Manifest file is missing*, you selected the wrong folder. Select the folder that directly contains `manifest.json`.
- Updating: extract the new version **over the same folder**, then click the reload icon on the Web Lock card in `chrome://extensions`. Your password and settings are kept as long as the folder stays in the same place.
- If you move the folder, the extension is treated as new and you will have to set up again.

### Using it
- **Lock now:** click the Web Lock icon in the toolbar.
- **Settings:** right-click the icon and choose *Options*, or click *Settings* on the lock screen. The password is required.
- **Forgot your password?** Click *Forgot password?* on the lock screen and enter your recovery key. A new recovery key is issued after a reset. If you lost both, remove the extension and install it again (this erases its data).

### Privacy and terms
See [PRIVACY.md](PRIVACY.md) and [TERMS.md](TERMS.md).

### License
[MIT](LICENSE)

---

## বাংলা

### দুটো লক মোড
| মোড | কী লক করে |
|---|---|
| **New tab only** (ডিফল্ট) | নতুন ট্যাব খোলা (Ctrl+T) |
| **Browser Lock** (ভার্সন ২) | নতুন ট্যাব **এবং** লক অবস্থায় অ্যাড্রেস বারে লেখা ঠিকানা, বুকমার্ক ও লিংক। একবার পাসওয়ার্ড দিলে N মিনিট নিষ্ক্রিয় না থাকা পর্যন্ত আনলক থাকে। |

Browser Lock-এর জন্য একটা বাড়তি **ঐচ্ছিক** Chrome অনুমতি লাগে (`webNavigation`, Chrome এটাকে "browsing history পড়া" হিসেবে দেখায়)। Settings-এ Browser Lock চালু করলেই শুধু এটা চাওয়া হয়। কোনো ঠিকানা সংরক্ষণ বা কোথাও পাঠানো হয় না।

### সুবিধা
- প্রথমবার নিজের পাসওয়ার্ড বানাবে। ভুলে গেলে **Recovery Key** দিয়ে রিসেট করা যায়।
- ভুল পাসওয়ার্ডে গতি কমে: ৫ বার ভুলে সাময়িক লক, সময় ক্রমে বাড়ে।
- **টুলবারে আইকনে চাপলে সঙ্গে সঙ্গে লক হয় (Lock now)।**
- Settings-এ লক মোড, নিষ্ক্রিয়তার সময়, আর আনলকের পর কোন পেজ খুলবে (Google, Bing, DuckDuckGo বা নিজের URL) ঠিক করা যায়।
- পুরোটা অফলাইনে চলে। কোনো ডেটা সংগ্রহ বা পাঠানো হয় না। শুধু salt সহ PBKDF2-SHA256 hash তোমার ডিভাইসে থাকে।

### যা করে **না** (অবশ্যই পড়ো)
- **আগে থেকে খোলা ট্যাব** (যেমন খুলে রাখা Gmail) লুকায় না বা লক করে না।
- **Incognito** উইন্ডোতে কাজ করে না।
- কেউ extension **মুছে ফেললে আটকাতে পারে না**।
- Browser Lock মোডে লক স্ক্রিন আসার আগে পেজ এক মুহূর্তের জন্য ঝলক দিতে পারে।
- এটা সাধারণ কৌতূহল ঠেকানোর টুল, কম্পিউটার লক করার (Win + L) বিকল্প নয়।

### ইনস্টল (ফ্রি, Chrome / Chromium ব্রাউজার)
1. [**Releases**](../../releases) পেজ থেকে `web-lock-v2.0.0.zip` ডাউনলোড করো।
2. একটা **স্থায়ী ফোল্ডারে Extract** করো, যেমন `Documents\WebLock`। পরে এই ফোল্ডার মুছবে না বা সরাবে না।
3. Chrome-এ `chrome://extensions` খোলো।
4. ডান উপরে **Developer mode** চালু করো।
5. **Load unpacked** চাপো এবং Extract করা ফোল্ডারটা (যার ভেতরে সরাসরি `manifest.json` আছে) বেছে নাও।
6. নতুন ট্যাব খুলবে: পাসওয়ার্ড সেট করো এবং **Recovery Key সংরক্ষণ** করো।
7. (ঐচ্ছিক) Settings খুলে **Browser Lock** বেছে নাও।

জেনে রাখো:
- Chrome চালুর সময় "Developer mode extensions" সতর্কবার্তা আসতে পারে। এভাবে ইনস্টল করা extension-এ এটা স্বাভাবিক।
- *Manifest file is missing* দেখালে ভুল ফোল্ডার বেছেছ। যে ফোল্ডারে সরাসরি `manifest.json` আছে সেটা বেছে নাও।
- আপডেট: নতুন ভার্সন **একই ফোল্ডারে** Extract করে `chrome://extensions`-এ Web Lock কার্ডের রিলোড (↻) চাপো। ফোল্ডারের জায়গা না বদলালে পাসওয়ার্ড ও settings থেকে যায়।
- ফোল্ডারের জায়গা বদলালে extension নতুন ধরা হবে এবং আবার সেটআপ করতে হবে।

### ব্যবহার
- **এখনই লক:** টুলবারে Web Lock আইকনে চাপো।
- **Settings:** আইকনে রাইট-ক্লিক করে *Options* বেছে নাও, বা লক স্ক্রিনে *Settings* চাপো। পাসওয়ার্ড লাগবে।
- **পাসওয়ার্ড ভুলে গেলে:** লক স্ক্রিনে *Forgot password?* চেপে Recovery Key দাও। রিসেটের পর নতুন Recovery Key দেওয়া হবে। দুটোই হারালে extension মুছে আবার ইনস্টল করতে হবে (এতে সব ডেটা মুছে যায়)।

### গোপনীয়তা ও শর্ত
[PRIVACY.md](PRIVACY.md) ও [TERMS.md](TERMS.md) দেখো।

### License
[MIT](LICENSE)
