```text
# 📱 MikoTok

The ultimate, lightweight mobile Progressive Web App (PWA) built exclusively for the CodeMiko community. 

MikoTok brings the Twitch live stream, recent VODs, interactive chat logs, and community features directly to your pocket. It features a fully integrated, lore-accurate AI chatbot named **Gerald OS**, who monitors app system metrics, handles user queries, and reacts dynamically to stream-sabotaging layout events.

🔗 **[MikoTok App Link](https://meowoccino.github.io/MikoTok/)**

---

## 💜 Support CodeMiko
Make sure to support CodeMiko across all her official channels!

* 🎁 **Throne:** [throne.com/codemiko](https://throne.com/codemiko) (Pinned)
* 🔮 **Twitch:** [twitch.tv/codemiko](https://www.twitch.tv/codemiko)
* 🎥 **YouTube:** [youtube.com/@CodeMiko](https://youtube.com/@CodeMiko)
* 🦋 **Bluesky:** [bsky.app/profile/codemiko.bsky.social](https://bsky.app/profile/codemiko.bsky.social)
* 💚 **Kick:** [kick.com/codemiko](https://kick.com/codemiko)
* 💬 **Discord:** [discord.gg/codemiko](https://discord.com/invite/codemiko)
* 💖 **Fanfix:** [app.fanfix.io/@codeyuna](https://app.fanfix.io/@codeyuna)
* 🖤 **TikTok:** [tiktok.com/@codemiko](https://www.tiktok.com/@codemiko)
* 𝕏 **X (Twitter):** [x.com/codemiko](https://x.com/codemiko)
* 📸 **Instagram:** [instagram.com/thecodemiko/](https://www.instagram.com/thecodemiko/)
* 💛 **Snapchat:** [snapchat.com/add/codemiko](https://snapchat.com/add/codemiko)
* 💙 **Facebook:** [facebook.com/codemikoofficial](https://www.facebook.com/codemikoofficial)

---

## ✨ Features

* **🔴 Auto-Live Twitch Integration:** Automatically detects when CodeMiko goes live and maps the player container directly to the active broadcast. Swipe or tap through chronological historical VODs when offline.
* **🎬 Infinite Scroll Clip Vault:** Implements a high-performance, foolproof bounding-range infinite scrolling feed serving 3,000+ historical clips. Features accurate arithmetic sorting using native integer datasets across specialized filters (**Latest, Weekly, Monthly, 6 Months, All Time**).
* **⏱️ 4-Hour Time-Chunked Background Sync:** Runs an advanced background scraping pipeline utilizing Supabase `pg_cron` routines on a strict 4-hour cycle. Rather than fetching single-block years which trigger Twitch Helix 1,000-clip limitation walls, the engine queries time data in 30-day "chunks" across the last 12 months. This catches everything from 200k+ viral hits to micro-scale 1-view community moments with seamless `upsert` duplication protection.
* **🌗 Native Android OS UI Synchronization:** Features progressive layout adaptability that intercepts theme switches. Leverages standard platform overlay styling (`color-scheme`) to force Android system navigation controls (Back, Home, Multitasking menu bars) to invert dynamically, eliminating bright white contrast breaks in Dark Mode.
* **🤖 Gerald OS Chatbot:** An advanced AI layout wrapper powered by serverless Supabase Edge Functions. Gerald features real-time simulated system metrics (CPU, Memory, VRAM Temp) and dynamically tracks system API connectivity.
* **🎮 16x Protocol Event Grid:** Launch 16 unique layout-disrupting minigames/events (e.g., *Boba Spill, Compile UE5, Scuffed Suit, Mute Mic, Delete Hair*) that dynamically override Gerald's baseline system prompt, triggering chaotic, mechanical panic responses.
* **⌨️ Global 7TV Emote Integration:** Automatically fetches global and channel-specific 7TV asset sets. Implements a responsive mood picker tray to inject high-fidelity emotes natively into chat logs and AI history maps.

---

## 📲 How to Install (PWA)

MikoTok behaves as a Progressive Web App, enabling you to pin it straight to your mobile system launcher without utilizing an app marketplace.

**For Android (Chrome):**
1. Load the site link inside **Chrome**.
2. Tap the **Three Dots (Menu)** utility in the top-right corner.
3. Tap **Add to Home screen** (or "Install app").

**For iOS (Safari):**
1. Load the site link inside **Safari**.
2. Tap the system **Share** action tab at the bottom toolbar.
3. Scroll down the panel and tap **Add to Home Screen**.

---

## 🛠️ Tech Stack

This project is engineered to run completely serverless, providing rapid execution environments on mobile viewport targets.

* **Frontend Framework:** HTML5, CSS3, Vue.js 3 (Production CDN Distribution)
* **Backend Database & Automation:** Supabase PostgreSQL Database, `pg_cron` Engine extension
* **Serverless Compute Layer:** Supabase Edge Functions (Deno DBR Runtime Env)
* **API Providers:** Twitch Helix GraphQL API, 7TV CDN Asset Pipeline, DecAPI

---

## ⚙️ Project Architecture & Deployment

To clone this layout configuration and manage it locally, you will need to map your own database architecture and developer credentials.

### 1. Database Table Initialization
Execute the following schema configurations within your Supabase SQL Editor to map the clips, custom emotes, and profile matrices correctly:

```sql
-- Clips Master Data Storage
CREATE TABLE clips (
    id TEXT PRIMARY KEY,
    title TEXT,
    view_count INTEGER, -- Explicitly integer for true value mathematical sorting
    created_at TIMESTAMPTZ,
    thumbnail_url TEXT
);

-- Channel Statistics Container Row
CREATE TABLE channel_stats (
    id INTEGER PRIMARY KEY,
    followers TEXT,
    total_views TEXT,
    peak_viewers TEXT,
    account_created TEXT,
    week_hours TEXT,
    week_category TEXT,
    week_days TEXT
);

```
### 2. Edge Function Deployments
Deploy two core Supabase serverless edge routines:
 * gerald-chat: Integrates with Gemini AI models, pulling emote vocab lists dynamically.
 * fetch-clips: Handles the 12-month chunked backend Twitch sweep.
### 3. Autopilot Background Synchronization
To automate data retrieval every 4 hours, arm a single master automated background worker inside your SQL panel:
```sql
SELECT cron.schedule(
  'master-clip-fetcher-4h',
  '0 */4 * * *', -- Fires every 4 hours on the dot
  $$
  SELECT net.http_post(
      url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/fetch-clips',
      headers := '{"Content-Type": "application/json"}'::jsonb
  )
  $$
);

```
### 4. Application Linkage
 * Map your live keys to app.js via supabase.createClient('URL', 'KEY');.
 * Tap the **MikoTok Logo** inside your mobile layout header to unlock the admin gateway, authenticate your credentials, update your Twitch Application secrets, and execute a cash-forward sweep!
## 📄 License
This project is licensed under the MIT License - see the code manifest for raw authorization tracking details.
> *"Maintained by tomato_24. Gerald OS is operational. Please ensure the Technician doesn't spill boba on the primary server chassis."*
> 
```

```
