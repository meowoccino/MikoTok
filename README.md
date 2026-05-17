# 📱 MikoTok

The ultimate, all-in-one mobile Progressive Web App (PWA) built exclusively for the CodeMiko community. 

MikoTok brings the Twitch stream, YouTube uploads, Reddit memes, and the scuff directly to your pocket. It features a fully integrated, lore-accurate AI chatbot named **Gerald OS**, who worships Miko, hates the Technician, and allows you to trigger virtual meltdowns.

🔗 **[MikoTok](https://meowoccino.github.io/MikoTok/)**

---

## 💜 Support The CodeMiko
Make sure to support CodeMiko across all her official channels!
* 📺 **Twitch:** [twitch.tv/codemiko](https://www.twitch.tv/codemiko)
* 🎥 **YouTube:** [youtube.com/@CodeMiko](https://www.youtube.com/@CodeMiko)
* 💬 **Discord:** [discord.gg/codemiko](https://discord.com/invite/codemiko)
* 🐦 **X (Twitter):** [@codemikotv](https://twitter.com/codemikotv)
* 🤖 **Reddit:** [r/CodeMiko](https://www.reddit.com/r/CodeMiko/)

---

## ✨ Features

* **🔴 Auto-Live Twitch Integration:** Automatically detects when CodeMiko goes live and snaps the player to the live broadcast. Swipe through the latest VODs when offline.
* **🌐 Dynamic Social Feeds:** Auto-updating carousels that pull the 10 latest YouTube videos (playable in-app) and the 10 hottest posts from `r/CodeMiko`. 
* **🤖 Gerald OS Chatbot:** An advanced AI powered by Supabase Edge Functions. Gerald is fully aware of CodeMiko lore (Pineapple, Archie, Savannah Cat, UE5 crashes) and will roast you accordingly.
* **🎮 Scuff Minigames:** 20 interactive minigames designed to sabotage the stream (e.g., Spill Boba, Compile UE5, Touch Grass). Spamming these fills the "Scuff Meter." Hit 100%, and the app triggers a catastrophic visual meltdown.
* **🐸 Custom Emote Keyboard:** Fully integrated custom Discord emotes to use while chatting with Gerald.

---

## 📲 How to Install (PWA)

MikoTok is a Progressive Web App, meaning you can install it directly to your phone without going through an App Store.

**For iOS (Safari):**
1. Open the app link in Safari.
2. Tap the **Share** button at the bottom of the screen.
3. Scroll down and tap **Add to Home Screen**.

**For Android (Chrome):**
1. Open the app link in Chrome.
2. Tap the **Three Dots (Menu)** in the top right corner.
3. Tap **Add to Home screen** (or "Install app").

---

## 🛠️ Tech Stack

This project was built to be lightweight, fast, and completely serverless on the frontend.

* **Frontend:** HTML5, CSS3, Vue.js 3 (via CDN)
* **Backend / Database:** Supabase (PostgreSQL, Edge Functions, User Auth)
* **APIs Used:** * Twitch Helix API (VODs, Clips, Live Status)
  * Reddit JSON Feed
  * RSS-to-JSON (YouTube channel tracking)

---

## ⚙️ Local Development

If you want to fork this repository and run it locally, you will need to set up your own Supabase project and Twitch Developer application.

1. Clone the repository.
2. Open `index.html`.
3. Replace the `supabase.createClient(...)` keys with your own Supabase URL and Anon Key.
4. Set up the Supabase Edge Function (`gerald-chat`) to handle the AI interactions.
5. In the app's Profile Tab, enter your Twitch **Client ID** and **Access Token** to allow the app to fetch clips and VODs.

---

## 💻 Built With

* ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
* ![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
* ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
* **APIs:** Twitch Helix API, Reddit JSON, RSS-to-JSON

---

## 📄 License

This project is licensed under the MIT License.

**MIT License**
Copyright (c) 2024 Tomato_24

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


> *"Built by Tomato_24. Gerald OS is running flawlessly. Please keep the Technician away from the cables."* <
