# Web Lock

**Ask for a password every time you open a new tab in Chrome.**
**Chrome-এ নতুন ট্যাব খুললেই পাসওয়ার্ড চাইবে।**

[English](#english) | [বাংলা](#বাংলা)

---

## English

### What it does
- Shows a password screen whenever you open a **new tab** (Ctrl+T) in a normal Chrome window.
- You create your own password on first run. A **recovery key** is given so you can reset a forgotten password.
- Wrong passwords are slowed down: 5 failures trigger a temporary lock that grows longer.
- Settings: ask every time or once per N minutes, and choose the page that opens after unlocking (Google, Bing, DuckDuckGo or your own URL).
- 100% offline: **no data is collected or sent anywhere.** The only permission requested is `storage`. Only salted PBKDF2-SHA256 hashes are stored, on your own device.

### What it does NOT do (please read)
- It does **not** lock tabs that are already open (for example a Gmail tab you left open).
- It does **not** work in **Incognito** windows.
- It **cannot stop someone from removing** the extension from `chrome://extensions`.
- It is a privacy tool against casual snooping, not a replacement for locking your computer (Win + L).

### Install (free, Chrome / Chromium browsers)
1. Go to the [**Releases**](../../releases) page and download `web-lock-v1.0.0.zip`.
2. **Extract** it to a permanent folder, for example `Documents\WebLock`. Do not delete or move this folder afterwards.
3. Open `chrome://extensions` in Chrome.
4. Turn on **Developer mode** (top right).
5. Click **Load unpacked** and select the extracted folder (the one that contains `manifest.json`).
6. A new tab opens: create your password and **save your recovery key**.

Notes:
- Chrome may show a "Developer mode extensions" warning at startup. This is normal for extensions installed this way.
- If Chrome says *Manifest file is missing*, you selected the wrong folder. Select the folder that directly contains `manifest.json`.
- Chrome does not auto-update extensions installed this way. To update, extract the new version **over the same folder**, then click the reload icon on the Web Lock card in `chrome://extensions`.
- If you move the folder, the extension is treated as new and you will have to set up your password again.

### Forgot your password?
Click **Forgot password?** on the lock screen and enter your recovery key. A new recovery key is issued after a reset. If you lost both, remove the extension and install it again (this erases its data).

### Settings
Click the Web Lock icon in the Chrome toolbar (or right-click the icon, then Options). The password is required to open settings.

### Privacy and terms
See [PRIVACY.md](PRIVACY.md) and [TERMS.md](TERMS.md).

### License
[MIT](LICENSE)

---

## বাংলা

### এটা কী করে
- Chrome-এর সাধারণ উইন্ডোতে **নতুন ট্যাব** (Ctrl+T) খুললেই পাসওয়ার্ড চাইবে।
- প্রথমবার চালালে তুমি নিজের পাসওয়ার্ড বানাবে। পাসওয়ার্ড ভুলে গেলে রিসেটের জন্য একটা **Recovery Key** দেওয়া হয়।
- ভুল পাসওয়ার্ড দিলে গতি কমানো হয়: ৫ বার ভুলে সাময়িক লক হয়, এবং সময় ক্রমে বাড়ে।
- Settings-এ ঠিক করা যায় প্রতিবার চাইবে নাকি N মিনিটে একবার, আর আনলকের পর কোন পেজ খুলবে (Google, Bing, DuckDuckGo বা নিজের URL)।
- পুরোটা অফলাইনে চলে: **কোনো ডেটা সংগ্রহ বা কোথাও পাঠানো হয় না।** শুধু `storage` অনুমতি লাগে। তোমার নিজের ডিভাইসে কেবল salt সহ PBKDF2-SHA256 hash রাখা হয়।

### যা করে **না** (অবশ্যই পড়ো)
- আগে থেকে **খোলা ট্যাব** (যেমন খুলে রাখা Gmail) লক করে না।
- **Incognito** উইন্ডোতে কাজ করে না।
- কেউ `chrome://extensions` থেকে extension **মুছে ফেললে আটকাতে পারে না**।
- এটা সাধারণ কৌতূহল ঠেকানোর টুল, কম্পিউটার লক করার (Win + L) বিকল্প নয়।

### ইনস্টল (ফ্রি, Chrome / Chromium ব্রাউজার)
1. [**Releases**](../../releases) পেজ থেকে `web-lock-v1.0.0.zip` ডাউনলোড করো।
2. একটা **স্থায়ী ফোল্ডারে Extract** করো, যেমন `Documents\WebLock`। পরে এই ফোল্ডার মুছবে না বা সরাবে না।
3. Chrome-এ `chrome://extensions` খোলো।
4. ডান উপরে **Developer mode** চালু করো।
5. **Load unpacked** চাপো এবং Extract করা ফোল্ডারটা (যার ভেতরে সরাসরি `manifest.json` আছে) বেছে নাও।
6. নতুন ট্যাব খুলবে: পাসওয়ার্ড সেট করো এবং **Recovery Key সংরক্ষণ** করো।

জেনে রাখো:
- Chrome চালুর সময় "Developer mode extensions" সতর্কবার্তা আসতে পারে। এভাবে ইনস্টল করা extension-এ এটা স্বাভাবিক।
- *Manifest file is missing* দেখালে ভুল ফোল্ডার বেছেছ। যে ফোল্ডারে সরাসরি `manifest.json` আছে সেটা বেছে নাও।
- এভাবে ইনস্টল করলে Chrome নিজে থেকে আপডেট করে না। আপডেট করতে নতুন ভার্সন **একই ফোল্ডারে** Extract করে `chrome://extensions`-এ Web Lock কার্ডের রিলোড (↻) চাপো।
- ফোল্ডারের জায়গা বদলালে extension নতুন হিসেবে ধরা হবে এবং পাসওয়ার্ড আবার সেট করতে হবে।

### পাসওয়ার্ড ভুলে গেলে
লক স্ক্রিনে **Forgot password?** চেপে Recovery Key দাও। রিসেটের পর নতুন Recovery Key দেওয়া হবে। দুটোই হারালে extension মুছে আবার ইনস্টল করতে হবে (এতে এর সব ডেটা মুছে যায়)।

### Settings
Chrome-এর উপরের টুলবারে Web Lock আইকনে চাপো (বা আইকনে রাইট-ক্লিক করে Options)। Settings খুলতে পাসওয়ার্ড লাগবে।

### গোপনীয়তা ও শর্ত
[PRIVACY.md](PRIVACY.md) ও [TERMS.md](TERMS.md) দেখো।

### License
[MIT](LICENSE)
