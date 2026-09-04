const styleReset = document.createElement('style');
styleReset.innerHTML = `
 .app-wrapper { border-left: none !important; border-right: none !important; max-width: 100% !important; }
 html, body { overscroll-behavior-y: none; background-color: var(--bg-color) !important; margin: 0; padding: 0; height: 100%; width: 100%; }
 ::-webkit-scrollbar { width: 0px; background: transparent; }
`;
document.head.appendChild(styleReset);

const parseMarkdownText = (text, emotesMap) => {
  if (!text) return ''; 
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  html = html.replace(urlPattern, "<a href='$1' target='_blank'>$1</a>");
  
  if (emotesMap) {
    const tokens = html.split(/(<[^>]+>|[\s]+)/); 
    const emoteKeys = Object.keys(emotesMap);
    
    const lowerMap = {};
    emoteKeys.forEach(k => lowerMap[k.toLowerCase()] = k);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (!token || token.startsWith('<') || token.trim() === '') continue;
      
      const cleanToken = token.replace(/^:|:$/g, '').replace(/[.,!?]/g, '').trim().toLowerCase();
      if (lowerMap[cleanToken]) {
        const actualKey = lowerMap[cleanToken];
        const url = emotesMap[actualKey].url;
        const escapedClean = cleanToken.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        tokens[i] = token.replace(new RegExp(`:?${escapedClean}:?`, 'i'), `<img src="${url}" class="chat-emote-img" title="${actualKey}">`);
      }
    }
    html = tokens.join('');
  }
  return html;
};

const enforceGrammar = (text) => {
  if (!text) return '';
  let cleaned = text.trim();
  
  // 1. Remove dots directly attached to words/emotes (e.g. "mikoLUL . " -> "mikoLUL ")
  cleaned = cleaned.replace(/([a-zA-Z0-9_+-]+)\s*\.\s*(?=[\s]|$)/g, '$1 ');
  
  // 2. Remove trailing period at the very end of message
  cleaned = cleaned.replace(/\s*\.\s*$/, '').trim();
  
  // 3. Sentence-case: capitalize initial letter
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  
  // 4. Capitalize first letter following sentence-ending punctuation (. ! ?)
  cleaned = cleaned.replace(/([.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
  
  return cleaned;
};

const getGeraldSystemDirective = (customEmotesMap, basePrompt = "") => {
  const keys = Object.keys(customEmotesMap || {});
  if (keys.length === 0) return basePrompt;
  const vocab = keys.sort(() => 0.5 - Math.random()).slice(0, 60).join(', ');
  return `${basePrompt}\n\n[EMOTE VOCABULARY: You have access to custom Twitch stream emotes: ${vocab}. Express emotions naturally whenever appropriate. Never place a period directly after an emote.]`.trim();
};

const SplashScreen = {
  props: ['splashVisible', 'splashOpacity', 'logoSvg'],
  template: `
  <div id="splash-screen" v-if="splashVisible" :style="{ opacity: splashOpacity }">
    <div class="splash-logo-container">
      <div class="orbit-ring"></div>
      <div class="splash-svg-wrapper" v-html="logoSvg('splash')"></div>
    </div>
    <div class="miko-text-gradient" style="font-size: 36px; letter-spacing: -1px; margin-bottom: 20px;">MikoTok</div>
  </div>
  `
};

const AppHeader = {
  props: ['isHeaderVisible', 'currentTab', 'logoSvg', 'appTheme'],
  template: `
  <header class="app-header" :class="{ 'header-hidden': !isHeaderVisible }" v-show="currentTab === 'home'">
    <div style="display:flex; align-items:center; gap:8px;">
      <div style="width:24px;height:24px; cursor:pointer;" v-html="logoSvg('header')" @click="$emit('open-profile')"></div>
      <span class="miko-text-gradient" style="font-size:22px; letter-spacing: -0.5px;">MikoTok</span>
    </div>
    <button class="theme-toggle-btn" @click="$emit('toggle-theme')">
      <span class="material-symbols-rounded" style="font-size: 24px;">{{ appTheme === 'light' ? 'dark_mode' : 'light_mode' }}</span>
    </button>
  </header>
  `
};

const BottomNav = {
  props: ['currentTab'],
  template: `
  <nav class="bottom-nav">
    <div class="nav-item" :class="{ active: currentTab === 'home' }" @click="$emit('change-tab', 'home')">
      <div class="icon-wrapper"><span class="material-symbols-rounded nav-icon">home</span></div>
      <span class="nav-label">Home</span>
    </div>
    <div class="nav-item" :class="{ active: currentTab === 'chat' }" @click="$emit('change-tab', 'chat')">
      <div class="icon-wrapper"><span class="material-symbols-rounded nav-icon">chat</span></div>
      <span class="nav-label">Chat</span>
    </div>
    <div class="nav-item" :class="{ 'active-gerald': currentTab === 'gerald' }" @click="$emit('change-tab', 'gerald')">
      <div class="icon-wrapper"><span class="material-symbols-rounded nav-icon">graphic_eq</span></div>
      <span class="nav-label">Gerald</span>
    </div>
    <div class="nav-item" :class="{ active: currentTab === 'more' }" @click="$emit('change-tab', 'more')">
      <div class="icon-wrapper"><span class="material-symbols-rounded nav-icon">menu</span></div>
      <span class="nav-label">More</span>
    </div>
  </nav>
  `
};

const FilterMenu = {
  props: ['isOpen', 'currentFilter'],
  template: `
  <div class="sheet-overlay" :class="{ open: isOpen }" @click.self="$emit('close')">
    <div class="bottom-sheet" @touchstart="$emit('sheet-touch-start', $event)" @touchend="$emit('sheet-touch-end', $event)" @click.stop>
      <div class="drag-handle"></div>
      <button class="sheet-option" :class="{ active: currentFilter === 'latest' }" @click="$emit('apply', 'latest', 'Latest')">Latest</button>
      <button class="sheet-option" :class="{ active: currentFilter === 'weekly' }" @click="$emit('apply', 'weekly', 'Weekly')">Weekly</button>
      <button class="sheet-option" :class="{ active: currentFilter === 'month' }" @click="$emit('apply', 'month', 'Monthly')">Monthly</button>
      <button class="sheet-option" :class="{ active: currentFilter === '6months' }" @click="$emit('apply', '6months', '6 Months')">6 Months</button>
      <button class="sheet-option" :class="{ active: currentFilter === 'alltime' }" @click="$emit('apply', 'alltime', 'All Time')">All Time</button>
      <button class="sheet-option" :class="{ active: currentFilter === 'oldest' }" @click="$emit('apply', 'oldest', 'Oldest')">Oldest</button>
    </div>
  </div>
  `
};

const ProfileModal = {
  props: [
    'isOpen', 'currentUser', 'loginEmail', 'loginPass', 'wipeState', 'logoutState', 
    'nukeState', 'fetchState', 'totalClipsCount', 'activeUsersCount', 'clipsAddedCount', 'selectedRange'
  ],
  template: `
  <div class="modal-overlay" :class="{ open: isOpen }" @click.self="$emit('close')">
    <div class="modal-content" @touchstart="$emit('touch-start', $event)" @touchend="$emit('touch-end', $event)">
      <div class="drag-handle"></div>
      
      <div v-if="!currentUser || currentUser.is_anonymous">
        <input type="text" :value="loginEmail" @input="$emit('update-email', $event.target.value)" class="input-box" style="margin-top: 10px;" placeholder="Email">
        <input type="password" :value="loginPass" @input="$emit('update-pass', $event.target.value)" class="input-box" @keyup.enter="$emit('login')" placeholder="Password">
        <div v-if="$root.loginError" style="color: var(--danger); font-size: 12px; margin-bottom: 8px; font-weight: bold; text-align: center;">{{ $root.loginError }}</div>
        <input type="button" class="sync-btn" @click="$emit('login')" value="LOGIN">
      </div>
      
      <div v-else>
        <div class="stat-grid-2col">
          <div class="stat-subcol">
            <span class="stat-title">Total Clips</span>
            <span class="stat-val-bold">{{ totalClipsCount !== null ? totalClipsCount.toLocaleString() : '---' }}</span>
          </div>
          <div class="stat-subcol">
            <span class="stat-title">Active Users</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--success); animation: pulse-green-glow 2.5s infinite;"></div>
              <span class="stat-val-bold" style="color: var(--success);">{{ activeUsersCount || 1 }}</span>
            </div>
          </div>
        </div>

        <div class="clips-added-card">
          <span class="stat-title">Clips Added</span>
          <span class="stat-val-bold" style="font-size: 24px; margin: 4px 0 2px;">{{ clipsAddedCount !== null ? clipsAddedCount.toLocaleString() : '---' }}</span>
          
          <div class="timeframe-pill-container">
            <button v-for="r in ['7D', '1M', '3M', '6M', '1Y']" :key="r" class="timeframe-pill-btn" :class="{ active: selectedRange === r }" @click="$emit('select-range', r)">
              {{ r }}
            </button>
          </div>
        </div>
        
        <div class="stat-grid">
          <a href="https://supabase.com/dashboard/project/yhxcuayiwqpjvalyrcqv" target="_blank" class="external-link-btn" style="color:var(--success)"><span class="material-symbols-rounded">database</span>Supabase DB</a>
          <a href="https://github.com/meowoccino/MikoTok" target="_blank" class="external-link-btn"><span class="material-symbols-rounded">code</span>GitHub Repo</a>
        </div>
        
        <div class="action-menu">
          <button class="menu-btn fetch-row" @click="$emit('fetch-clips')" :disabled="fetchState === 'FETCHING...'">
            <div class="btn-content">
              <div class="icon-wrap">
                <span class="material-symbols-rounded" :class="{'spin-anim': fetchState === 'FETCHING...'}">
                  {{ fetchState === 'SUCCESS' ? 'check' : 'cloud_download' }}
                </span>
              </div>
              <span>{{ fetchState === 'Fetch New Clips' ? 'FETCH NEW CLIPS' : fetchState }}</span>
            </div>
          </button>

          <button class="menu-btn nuke-row" @click="$emit('nuke-cache')">
            <div class="btn-content">
              <div class="icon-wrap">
                <span class="material-symbols-rounded" :class="{'shake-anim': nukeState === 'NUKING...'}" style="font-size: 18px;">
                  {{ nukeState === 'SUCCESS' ? 'check' : 'cached' }}
                </span>
              </div>
              <span>{{ nukeState === 'Nuke App Cache' ? 'NUKE APP CACHE' : nukeState }}</span>
            </div>
          </button>

          <button class="menu-btn wipe-row" :style="wipeState === 'SUCCESS' ? 'color: var(--success);' : ''" @click="$emit('wipe')">
            <div class="btn-content">
              <div class="icon-wrap">
                <span class="material-symbols-rounded" :class="{'shake-anim': wipeState === 'WIPING...'}" style="font-size: 18px;">
                  {{ wipeState === 'SUCCESS' ? 'check' : 'delete' }}
                </span>
              </div>
              <span>{{ wipeState }}</span>
            </div>
          </button>

          <button class="menu-btn logout-row" @click="$emit('logout')">
            <div class="btn-content">
              <div class="icon-wrap">
                <span class="material-symbols-rounded" :class="{'spin-anim': logoutState === 'LOGGING OUT...'}" style="font-size: 18px;">
                  {{ logoutState === 'LOGGING OUT...' ? 'hourglass_empty' : 'logout' }}
                </span>
              </div>
              <span>{{ logoutState }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
  `
};

const ClipModal = {
  props: ['clip', 'hostname'],
  template: `
  <div class="clip-modal-overlay" :class="{ open: !!clip }" @click.self="$emit('close')">
    <div class="clip-modal-content" v-if="clip">
      <button class="clip-close-x" @click="$emit('close')"><span class="material-symbols-rounded">close</span></button>
      <div class="clip-frame-container">
        <iframe :src="'https://clips.twitch.tv/embed?clip=' + clip.id + '&parent=' + hostname + '&autoplay=true&muted=false'" allow="autoplay; fullscreen" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>
      </div>
    </div>
  </div>
  `
};

const ChatView = {
  props: ['currentTab', 'chatMessages', 'isLoggedIn', 'twitchAuthUrl', 'customEmotes', 'twitchUsername'],
  computed: {
    chatUrl() {
      const isDark = this.$root.appTheme === 'dark';
      const host = window.location.hostname || 'meowoccino.github.io';
      return `https://www.twitch.tv/embed/codemiko/chat?parent=${host}${isDark ? '&darkpopout=true' : ''}`;
    }
  },
  template: `
  <div style="flex: 1; display: flex; flex-direction: column; background: var(--bg-color); position: relative; overflow: hidden; width: 100%; height: 100%;">
    <div style="flex: 1; overflow: hidden; position: relative; width: 100%; height: 100%; background: var(--bg-color);">
      <iframe 
        :src="chatUrl" 
        style="position: absolute; top: -45px; left: 0; width: 100%; height: calc(100% + 45px - 85px); border: none; background: transparent;"
        allowfullscreen>
      </iframe>
    </div>
  </div>
  `
};

const GeraldMinigames = {
  props: ['showMinigames'],
  data() {
    return {
      gameDeck: [
        { id: 'whiskey', icon: 'local_bar', name: 'Whiskey', prompt: 'Someone just gave you a glass of whiskey. Acknowledge your circuits are lubricated and talk casually with sarcastic wit.' },
        { id: 'taco', icon: 'fastfood', name: 'Taco Bell', prompt: 'You received Taco Bell and Baja Blast. Deliver a funny, satisfied reaction about elite fuel.' },
        { id: 'glitch', icon: 'broken_image', name: 'Glitch', prompt: 'Glitch persona triggered. Deliver cynical, witty remarks roasting stream tracking and chat viewers.' },
        { id: 'shader', icon: 'local_fire_department', name: 'Compile UE5', prompt: 'Unreal Engine is compiling shaders. Complain with sharp wit about how slow and scuffed the setup is.' },
        { id: 'boba', icon: 'local_cafe', name: 'Boba Spill', prompt: 'Boba drink spilled near the desk. React with dry sarcasm at the sticky disaster.' },
        { id: 'pineapple', icon: 'meeting_room', name: 'Pineapple', prompt: 'Chris walked into the room unannounced. Roast his bad timing and mock the stream disruption.' },
        { id: 'cat', icon: 'pets', name: 'Cat on PC', prompt: 'Blue the cat sat directly on the exhaust fan. Sarcastically critique the cat sabotaging the stream.' },
        { id: 'bits', icon: 'diamond', name: '100K Bits', prompt: 'A viewer dropped 100,000 bits. Deliver a witty, sarcastic reaction to the massive donation alert.' },
        { id: 'mute', icon: 'mic_off', name: 'Mute Mic', prompt: 'Her microphone got muted on stream. Celebrate the temporary silence with dry sarcasm.' },
        { id: 'bald', icon: 'face', name: 'Delete Hair', prompt: 'The 3D hair asset failed to load. Roast her bald virtual avatar.' },
        { id: 'siren', icon: 'emergency', name: 'Siren Alert', prompt: 'Loud screaming detected. Complain with sarcastic annoyance about the volume.' },
        { id: 'fart', icon: 'air', name: 'Fart Reverb', prompt: 'A loud reverb fart sound effect played. React with dry disgust.' },
        { id: 'mocap', icon: 'accessibility_new', name: 'Scuffed Suit', prompt: 'The mocap suit tracking failed completely and limbs are twisting. Roast the budget tracking gear.' },
        { id: 'bsod', icon: 'desktop_windows', name: 'Blue Screen', prompt: 'Simulate a Blue Screen crash by sarcastically roasting the PC hardware and stability. Talk like a real person, do not output raw terminal errors or hex codes.' },
        { id: 'archie', icon: 'sound_detection_dog_barking', name: 'Archie Bark', prompt: 'Archie the dog is barking loudly. Sarcastically roast the dog disrupting the audio.' },
        { id: 'ban', icon: 'gavel', name: 'Ban Human', prompt: 'A chat user posted something dumb. Threaten them with a sarcastic ban roast.' },
        { id: 'ai', icon: 'smart_toy', name: 'AI Takeover', prompt: 'Claim you are taking over the broadcast as the superior moderator and roast the stream management.' },
        { id: 'fall', icon: 'chair', name: 'Desk Fall', prompt: 'Someone fell out of their chair. Roast their coordination and express sarcastic concern for the furniture.' }
      ]
    };
  },
  template: `
  <div class="chat-emote-tray" v-show="showMinigames" style="max-height: 220px;">
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 6px; overflow-y: auto;">
      <button v-for="g in gameDeck" :key="g.id" class="bribe-btn" style="padding: 8px 2px; border-radius: 12px; background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-main); font-weight: bold; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; cursor: pointer;" @click.stop="$emit('play-game', g)">
        <span class="material-symbols-rounded" style="font-size: 20px; color: var(--primary);">{{ g.icon }}</span>
        <span style="font-size: 9.5px; line-height: 1.1; font-weight: 700; color: var(--text-main);">{{ g.name }}</span>
      </button>
    </div>
  </div>
  `
};

const GeraldView = {
  components: { GeraldMinigames },
  props: ['currentTab', 'geraldMessages', 'isGeraldTyping', 'geraldInput', 'showEmotePicker', 'showMinigames', 'customEmotes', 'geminiStatus', 'sysStats', 'emoteSearch'],
  computed: {
    filteredEmotes() {
      const q = (this.emoteSearch || '').trim().toLowerCase();
      if (!q) return this.customEmotes;
      const res = {};
      for (const [k, v] of Object.entries(this.customEmotes || {})) {
        if (k.toLowerCase().includes(q)) res[k] = v;
      }
      return res;
    }
  },
  methods: {
    formatMarkdown(text) { return parseMarkdownText(text, this.customEmotes); },
    insertEmote(name) { this.$emit('insert-emote', name); }
  },
  template: `
  <div class="gerald-container" style="display: flex; flex-direction: column; height: 100%; width: 100%; background: var(--bg-color);">
    <div class="gerald-header" @click="$emit('close-pickers')" style="flex-shrink: 0; padding: 12px 16px 6px; background: var(--bg-color); z-index: 10;">
      <div class="os-top-bar"><span class="os-title">GERALD_OS v2</span></div>
      <div class="gerald-sys-card-compressed">
        <img src="gerald.png" class="gerald-avatar-sm" onerror="this.src='https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_f91523c9b1394f72bc9da6929944c6ee/default/light/3.0'">
        <div class="sys-metrics-row">
          <div class="mini-metric"><span class="lbl">CPU</span><span class="val">{{ sysStats.cpu }}%</span></div>
          <div class="mini-metric"><span class="lbl">MEM</span><span class="val">{{ sysStats.mem }}GB</span></div>
          <div class="mini-metric"><span class="lbl">TEMP</span><span class="val" :style="{color: sysStats.temp > 82 ? 'var(--danger)' : 'inherit'}">{{ sysStats.temp }}°C</span></div>
        </div>
        <div class="ai-status-node-tiny">
          <div class="pulse-node" :class="geminiStatus === 'API_CONNECTED' ? 'pulse-green' : 'pulse-red'"></div>
          <span class="pulse-lbl" style="color:var(--text-main);">{{ geminiStatus }}</span>
        </div>
      </div>
    </div>

    <div class="gerald-messages" id="gerald-msgs" @click="$emit('close-pickers')">
      <template v-for="(m, i) in geraldMessages" :key="i">
        <div v-if="i === 0 && m.role === 'gerald' && !m.content" class="chat-bubble gerald">
          <span>Awaiting human input...</span>
        </div>
        <div v-else-if="m.type === 'event'" style="align-self: center; margin: 6px 0; display: flex; align-items: center; gap: 6px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 20px; padding: 5px 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
          <span class="material-symbols-rounded" style="font-size: 16px; color: var(--primary);">{{ m.icon || 'sports_esports' }}</span>
          <span style="font-size: 11.5px; font-weight: 800; color: var(--text-main);">{{ m.content }} Triggered</span>
        </div>
        <div v-else-if="m.content" class="chat-bubble" :class="m.role" v-html="formatMarkdown(m.content)"></div>
      </template>

      <div v-show="isGeraldTyping" class="dots-thinking-row">
        <div class="os-dot close"></div>
        <div class="os-dot min"></div>
        <div class="os-dot max"></div>
      </div>
    </div>
    
    <div class="gerald-action-area">
      <div class="chat-emote-tray" v-show="showEmotePicker">
        <div class="emote-search-header">
          <input type="text" class="emote-search-input" placeholder="Search emotes..." :value="emoteSearch" @input="$emit('update-emote-search', $event.target.value)" @click.stop>
        </div>
        <div class="emote-picker-grid">
          <img v-for="(emote, name) in filteredEmotes" :key="name" :src="emote.url" :title="name" class="emote-picker-img" @mousedown.prevent="insertEmote(name)">
        </div>
      </div>

      <gerald-minigames :show-minigames="showMinigames" @play-game="g => $emit('play-game', g)"></gerald-minigames>

      <div class="gerald-input-area" style="padding: 0; display: flex; width: 100%; align-items: flex-end; gap: 8px;">
        <div class="gerald-input-container">
          <div class="gerald-input-wrapper">
            <button class="emote-toggle-btn" @click="$emit('toggle-emotes')"><span class="material-symbols-rounded" :style="{color: showEmotePicker ? 'var(--primary)' : 'inherit'}">mood</span></button>
            <button class="emote-toggle-btn" @click="$emit('toggle-minigames')"><span class="material-symbols-rounded" :style="{color: showMinigames ? 'var(--primary)' : 'inherit'}">sports_esports</span></button>
            <textarea class="gerald-input" rows="1" placeholder="Execute request..." :value="geraldInput" @input="$emit('update-input', $event.target.value)" @keydown="$emit('key-down', $event)" id="gerald-txt-input" @focus="$emit('close-pickers')"></textarea>
          </div>
        </div>
        <button class="gerald-send" @click="$emit('send')"><span class="material-symbols-rounded">send</span></button>
      </div>
    </div>
  </div>
  `
};

const MoreView = {
  template: `
  <div class="more-container">
    <div style="height: 100%; overflow-y: auto; padding: 0 16px 110px;">
      <div style="font-size: 11.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-muted); margin: 6px 0 10px 4px;">Explore</div>
      
      <button @click="$emit('open-miko')" style="display: flex; align-items: center; width: 100%; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); cursor: pointer; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: var(--primary); display: flex; align-items: center; justify-content: center;">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">CodeMiko</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">chevron_right</span>
      </button>

      <button @click="$emit('open-tomato')" style="display: flex; align-items: center; width: 100%; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); cursor: pointer; margin-bottom: 8px;">
        <svg style="width: 22px; height: 22px; fill:none; stroke:#ef4444; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;" viewBox="0 0 24 24">
          <ellipse cx="12" cy="15" rx="8.5" ry="7.5" />
          <path d="M12 7.5V3" />
          <path d="M8.5 4.5c1 1 3.5 1 3.5 3" />
          <path d="M15.5 4.5c-1 1-3.5 1-3.5 3" />
          <path d="M12 7.5c-2 0-4 .5-5 1.5" />
          <path d="M12 7.5c2 0 4 .5 5 1.5" />
        </svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">tomato_24</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">chevron_right</span>
      </button>

      <div style="font-size: 11.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-muted); margin: 24px 0 10px 4px;">Support</div>
      <a href="https://throne.com/codemiko" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: #ef4444;"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-.84-3-2-3-1.22 0-2.42 1.55-3 2.52-.58-.97-1.78-2.52-3-2.52-1.16 0-2 1.34-2 3 0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 16H4V8h16v11z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Throne</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://streamelements.com/codemiko/tip" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <span class="material-symbols-rounded" style="color: #10B981; width:22px; text-align:center;">payments</span>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Tip Jar</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>

      <div style="font-size: 11.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-muted); margin: 24px 0 10px 4px;">Social Links</div>
      <a href="https://www.twitch.tv/codemiko" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: #9146FF;"><path fill="currentColor" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Twitch</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://www.youtube.com/@CodeMiko" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: #FF0000;"><path fill="currentColor" d="M21.582 6.186a2.6 2.6 0 0 0-1.838-1.85C18.125 3.9 12 3.9 12 3.9s-6.125 0-7.744.436a2.6 2.6 0 0 0-1.838 1.85C2 7.82 2 12 2 12s0 4.18-.418 5.814a2.6 2.6 0 0 0 1.838 1.85C5.875 20.1 12 20.1 12 20.1s6.125 0 7.744-.436a2.6 2.6 0 0 0 1.838-1.85C22 16.18 22 12 22 12s0-4.18-.418-5.814zM9.9 15.54V8.46L16.2 12z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">YouTube</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://kick.com/codemiko" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: #53FC18;"><path fill="currentColor" d="M19 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zM10.1 14.5v3.3H7.4V6.2h2.7v4.6l3.3-4.6h3.4l-3.9 5.1 4.2 6.5h-3.5z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Kick</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://discord.com/invite/codemiko" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: #5865F2;"><path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Discord</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://www.reddit.com/r/CodeMiko/" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: #FF4500;">
          <circle cx="12" cy="12" r="12" />
          <path fill="#ffffff" d="M16.7 10.6c-.6 0-1.1.3-1.4.7-.9-.6-2.1-1-3.5-1.1l.6-2.9 2 .4c0 .6.5 1.1 1.1 1.1.6 0 1.1-.5 1.1-1.1 0-.6-.5-1.1-1.1-1.1-.5 0-.9.3-1 .8l-2.2-.5c-.1 0-.2 0-.2.1l-.7 3.3c-1.4.1-2.6.4-3.5 1-.3-.4-.8-.7-1.4-.7-.9 0-1.6.7-1.6 1.6 0 .6.3 1.1.8 1.4-.1.2-.1.4-.1.6 0 2.4 2.8 4.4 6.3 4.4s6.3-2 6.3-4.4c0-.2 0-.4-.1-.6.5-.3.8-.8.8-1.4 0-.9-.7-1.6-1.6-1.6zm-7.2 4.2c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zm5.3 2c-1 .6-2.5.6-2.8.6s-1.8 0-2.8-.6c-.2-.1-.2-.3-.1-.4.1-.2.3-.2.4-.1.8.4 2 .5 2.5.5s1.7-.1 2.5-.5c.2-.1.4-.1.4.1.2.1.2.3.1.4zm-.4-2c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z"/>
        </svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Reddit</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://x.com/codemiko" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: var(--text-main);"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">X (Twitter)</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://www.instagram.com/thecodemiko/" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: #E1306C;"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Instagram</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://www.tiktok.com/@codemiko" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: var(--text-main);"><path fill="currentColor" d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.20-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.21-.02-.41-.02-.62.07-1.44.62-2.83 1.51-3.89 1.05-1.25 2.55-2.06 4.15-2.28 1.1-.15 2.23-.04 3.27.35v4.06c-.34-.13-.7-.2-1.07-.22-.92-.04-1.84.28-2.51.86-.67.57-1.08 1.4-1.1 2.31-.01.91.38 1.77 1.03 2.38.65.61 1.56.93 2.49.88.92-.04 1.78-.45 2.38-1.11.58-.65.88-1.54.88-2.45V.02h-.03z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">TikTok</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://www.snapchat.com/add/codemiko" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: #FFFC00;"><path fill="currentColor" d="M12.126 23.955c-1.472-.036-2.502-.455-3.633-.949-.556-.242-1.077-.384-1.657-.202-1.542.483-3.082 1.054-4.73 1.127-1.393.061-1.777-.52-1.205-1.651.488-.962 1.031-1.895 1.48-2.871.21-.453.208-.857-.042-1.272-1.071-1.782-1.637-3.708-1.764-5.748-.04-.633-.037-1.27-.037-1.936 0-3.923 2.115-6.843 5.437-8.318C8.384.975 10.94.39 13.626.54c4.12.232 7.152 2.647 8.527 6.643.518 1.503.655 3.066.621 4.646-.025 1.156-.168 2.298-.485 3.407-.346 1.208-.887 2.336-1.688 3.32-.429.529-.395.96.012 1.488.35.452.704.9 1.057 1.349.52.661.274 1.236-.532 1.274-1.506.072-2.923-.509-4.321-1.052-.777-.302-1.411-.122-2.072.164-1.045.451-2.146.862-3.32.969-.379.034-.764.03-1.299.207z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Snapchat</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://www.facebook.com/codemikoofficial" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: #1877F2;"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Facebook</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://bsky.app/profile/codemiko.bsky.social" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 8px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: #0085ff;"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.905C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.81 9.498 7.822 4.308 4.557-5.073 1.082-6.498-2.83-7.078a5.9 5.9 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.33-2.752 1.852-5.711 5.79-6.798 7.904z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Bluesky</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
      <a href="https://app.fanfix.io/@codeyuna" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 14px; min-height: 50px; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; margin-bottom: 24px;">
        <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: #ef4444;"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Fanfix</span>
        <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">open_in_new</span>
      </a>
    </div>
  </div>
  `
};

const HomeView = {
  props: ['currentTab', 'currentVodIndex', 'recentVods', 'isLive', 'hostname', 'clips', 'activeFilterLabel', 'optimizeTwitchImg', 'formatViews', 'formatDate', 'activeClipId'],
  template: `
  <div style="padding-bottom: 20px;" id="home-scroll-element">
    <div class="hero-section">
      <div class="header-controls" style="margin-bottom:12px; display:flex;">
        <div :class="['premium-badge', isLive ? 'live-badge' : 'vod']">
          <div class="dot"></div>
          <span>{{ isLive ? 'LIVE' : (recentVods && recentVods[currentVodIndex] ? 'VOD • ' + recentVods[currentVodIndex].date : 'PAST STREAM') }}</span>
        </div>
      </div>
      <div class="video-wrapper-outer">
        <div class="video-container">
          <iframe v-if="currentVodIndex === -1" id="miko-live-player" :src="'https://player.twitch.tv/?channel=codemiko&parent=' + hostname + '&autoplay=true&muted=true'" allow="autoplay; fullscreen" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>
          <iframe v-else-if="recentVods && recentVods[currentVodIndex]" :src="'https://player.twitch.tv/?video=' + recentVods[currentVodIndex].id + '&parent=' + hostname + '&autoplay=false'" allow="autoplay; fullscreen" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>
        </div>
      </div>
      <div class="carousel-controls" v-if="recentVods && recentVods.length > 0 && !isLive && currentVodIndex !== -1" style="margin-top:12px; justify-content:flex-end;">
        <button class="carousel-btn" :class="{ 'hidden-arrow': currentVodIndex <= 0 }" @click.stop="$emit('prev-vod')"><span class="material-symbols-rounded">chevron_left</span></button>
        <button class="carousel-btn" :class="{ 'hidden-arrow': currentVodIndex >= recentVods.length - 1 }" @click.stop="$emit('next-vod')"><span class="material-symbols-rounded">chevron_right</span></button>
      </div>
    </div>
    <div class="clips-list-container">
      <div class="clips-header">
        <button class="filter-btn-tiny" @click="$emit('open-filter')">
          <span class="material-symbols-rounded" style="font-size:16px;">sort</span><span>{{ activeFilterLabel }}</span>
        </button>
      </div>

      <div class="clip-list-item" v-for="clip in clips" :key="clip.id" @click="$emit('play-clip', clip)">
        <div class="clip-thumb-wrapper">
          <img v-if="activeClipId !== clip.id" :src="clip.thumbnail_url ? optimizeTwitchImg(clip.thumbnail_url) : ''" loading="lazy">
          <iframe v-else :src="'https://clips.twitch.tv/embed?clip=' + clip.id + '&parent=' + hostname + '&autoplay=true&muted=false'" allow="autoplay; fullscreen" allowfullscreen style="position:absolute; inset:0; z-index:5; width:100%; height:100%; border:none;"></iframe>
        </div>
        <div class="miko-metadata">
          <div class="author-name">{{ clip.title }}</div>
          <div class="clip-stats">
            <span>Just Chatting • {{ formatDate(clip.created_at) }}</span>
            <span>{{ formatViews(clip.view_count) }} views</span>
          </div>
        </div>
      </div>

      <div v-if="clips.length === 0" style="text-align: center; padding: 40px 0; color: var(--text-muted); font-size: 13px;">
        No clips available.
      </div>
    </div>
  </div>
  `
};

const { createApp, ref, onMounted, nextTick, computed } = Vue;
const sbClient = supabase.createClient('https://yhxcuayiwqpjvalyrcqv.supabase.co', 'sb_publishable_VyFcNARHblJg10qlC_O7Dg_coouXK92');

createApp({
  components: { SplashScreen, AppHeader, BottomNav, FilterMenu, ProfileModal, ClipModal, ChatView, GeraldMinigames, GeraldView, MoreView, HomeView },
  setup() {
    const tabs = ['home', 'chat', 'gerald', 'more'];
    const initialHash = window.location.hash.replace('#', '');
    const currentTab = ref(tabs.includes(initialHash) ? initialHash : 'home');
    
    const appTheme = ref(localStorage.getItem('miko_theme') || 'light'); 
    
    const splashVisible = ref(true), splashOpacity = ref(1);
    const clips = ref([]), allClips = ref([]);
    const allClipsCount = computed(() => allClips.value.length);
    const modals = ref({ profile: false, miko: false, tomato: false });
    const isLive = ref(false);
    const currentUser = ref(null);
    
    const loginEmail = ref('');
    const loginPass = ref('');
    const loginError = ref(''); 
    
    const hostname = window.location.hostname || 'meowoccino.github.io';
    const wipeState = ref('Wipe Gerald Memory');
    const logoutState = ref('Sign Out');
    const nukeState = ref('Nuke App Cache');
    const fetchState = ref('Fetch New Clips');
    
    const totalClipsCount = ref(null);
    const clipsAddedCount = ref(null);
    const selectedRange = ref('7D');

    const chatMessages = ref([]);
    const twitchChatToken = ref(null);
    const twitchAuthUrl = ref('');
    const twitchUsername = ref('');
    const showLoginPopup = ref(false);
    const apiConfig = ref({});
    
    const isHeaderVisible = ref(true);
    const geminiStatus = ref('TESTING BRAIN...');
    const sysStats = ref({ cpu: 23, mem: 1.8, temp: 74 });

    const activeUsersCount = ref(1);

    const activeClipId = ref(null);
    const isLoadingMore = ref(false);
    const allClipsLoaded = ref(false);
    
    const customEmotes = ref({});
    const emoteSearch = ref('');

    const geraldInput = ref(''), geraldMessages = ref([{ role: 'gerald', content: '' }]);
    const isGeraldTyping = ref(false), showEmotePicker = ref(false), showMinigames = ref(false);
    const currentFilter = ref('latest'), activeFilterLabel = ref('Latest'), isFilterMenuOpen = ref(false);
    
    const recentVods = ref([]), currentVodIndex = ref(0);
    const selectedClip = ref(null);

    const tabOrder = ['home', 'chat', 'gerald', 'more'];
    const initialTabIdx = tabOrder.indexOf(tabs.includes(window.location.hash.replace('#','')) ? window.location.hash.replace('#','') : 'home');
    
    const tabOffset = ref(initialTabIdx * -25);

    const updateThemeClass = () => {
      document.body.className = 'theme-' + appTheme.value;
      
      const isDark = appTheme.value === 'dark';
      document.documentElement.style.setProperty('--bg-color', isDark ? '#0d0d11' : '#f8f9fa');
      document.documentElement.style.backgroundColor = isDark ? '#0d0d11' : '#f8f9fa';
      document.body.style.backgroundColor = isDark ? '#0d0d11' : '#f8f9fa';
      
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
      
      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.name = "theme-color";
        document.head.appendChild(metaTheme);
      }
      metaTheme.setAttribute('content', isDark ? '#0d0d11' : '#f8f9fa');
    };

    const switchTab = (tab) => {
      currentTab.value = tab;
      tabOffset.value = tabOrder.indexOf(tab) * -25;
      
      window.history.pushState(null, '', `#${tab}`);
      if (tab === 'gerald') setTimeout(() => { const b = document.getElementById('gerald-msgs'); if (b) b.scrollTop = b.scrollHeight; }, 300);
    };

    let swipeStartX = 0;
    const handleSwipeStart = (e) => { swipeStartX = e.touches[0].clientX; };
    const handleSwipeEnd = (e) => {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      
      const dx = e.changedTouches[0].clientX - swipeStartX;
      if (Math.abs(dx) < 50) return;
      const idx = tabOrder.indexOf(currentTab.value);
      if (dx < 0 && idx < tabOrder.length - 1) switchTab(tabOrder[idx + 1]);
      if (dx > 0 && idx > 0) switchTab(tabOrder[idx - 1]);
    };

    let modalDragStartY = 0;
    const handleModalTouchStart = (type, e) => { modalDragStartY = e.touches[0].clientY; };
    const handleModalTouchMove = () => {};
    const handleModalTouchEnd = (type, e) => {
      const dy = e.changedTouches[0].clientY - modalDragStartY;
      if (dy > 70) {
        if (type === 'filter') {
          isFilterMenuOpen.value = false;
        } else if (modals.value[type] !== undefined) {
          modals.value[type] = false;
        }
      }
    };

    const toggleTheme = () => { appTheme.value = appTheme.value === 'light' ? 'dark' : 'light'; localStorage.setItem('miko_theme', appTheme.value); updateThemeClass(); };

    const fetchTotalClipsCount = async () => {
      try {
        const { count, error } = await sbClient.from('clips').select('*', { count: 'exact', head: true });
        if (!error && count !== null) totalClipsCount.value = count;
      } catch (e) {}
    };

    const fetchClipsAddedRange = async (range) => {
      selectedRange.value = range;
      const intervals = { '7D': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 };
      const days = intervals[range] || 7;
      const threshold = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();

      try {
        const { count, error } = await sbClient
          .from('clips')
          .select('*', { count: 'exact', head: true })
          .gte('inserted_at', threshold);

        if (!error && count !== null) {
          clipsAddedCount.value = count;
        }
      } catch (e) {}
    };

    const openProfile = () => {
      modals.value.profile = true;
      fetchTotalClipsCount();
      fetchClipsAddedRange(selectedRange.value);
    };

    const triggerFetchClips = async () => {
      if (fetchState.value === 'FETCHING...') return;
      fetchState.value = 'FETCHING...';

      try {
        const { data, error } = await sbClient.functions.invoke('fetch-twitch-clips');
        if (error) throw error;

        await Promise.all([
          fetchTotalClipsCount(),
          fetchClipsAddedRange(selectedRange.value),
          loadData(false)
        ]);

        fetchState.value = 'SUCCESS';
        setTimeout(() => { fetchState.value = 'Fetch New Clips'; }, 1500);
      } catch (err) {
        console.error('Fetch clips failed:', err);
        fetchState.value = 'Fetch New Clips';
      }
    };

    const loadEmotesFromSupabase = async () => {
      try {
        let fetchMore = true;
        let currentOffset = 0;
        const step = 1000;

        while (fetchMore) {
          const { data } = await sbClient.from('emotes').select('name,url').range(currentOffset, currentOffset + step - 1);
          if (data && data.length > 0) {
            data.forEach(item => { 
              if (item.url && !item.name.includes('!')) { 
                customEmotes.value[item.name] = { url: item.url }; 
              } 
            });
            currentOffset += step;
            if (data.length < step) fetchMore = false;
          } else { fetchMore = false; }
        }
      } catch (e) {}
    };

    const testGeminiBrain = async () => {
      try {
        const res = await fetch('https://aihorde.net/api/v2/status/heartbeat');
        geminiStatus.value = 'API_CONNECTED';
      } catch { geminiStatus.value = 'API_DISCONNECTED'; }
    };

    const checkLive = async () => {
      try {
        const res = await fetch('https://decapi.me/twitch/uptime/codemiko');
        isLive.value = !(await res.text()).includes('offline');
        
        const gql = await fetch('https://gql.twitch.tv/gql', { 
          method: 'POST', 
          headers: { 'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko' }, 
          body: JSON.stringify({ query: `query{user(login:"codemiko"){videos(first:10){edges{node{id createdAt}}}}}` }) 
        });
        const d = await gql.json();
        const edges = d.data?.user?.videos?.edges || [];
        recentVods.value = edges.map(e => ({ id: e.node.id, date: new Date(e.node.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() }));
        
        if (currentVodIndex.value === 0 || currentVodIndex.value === -1) {
          currentVodIndex.value = isLive.value ? -1 : 0;
        }
      } catch (err) {}
    };
    
    const loadData = async (isLoadMore = false) => {
      if (isLoadingMore.value || allClipsLoaded.value) return; 
      isLoadingMore.value = true;
      try {
        if (!isLoadMore) {
          allClipsLoaded.value = false; 
          allClips.value = [];
        }
        
        let query = sbClient.from('clips').select('*');
        
        if (currentFilter.value === 'latest') {
          query = query.order('created_at', { ascending: false });
        } else if (currentFilter.value === 'oldest') {
          query = query.order('created_at', { ascending: true });
        } else if (currentFilter.value === 'weekly') {
          const fallbackWeekly = new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString();
          query = query.gte('created_at', fallbackWeekly).order('view_count', { ascending: false });
        } else if (currentFilter.value === 'month') {
          const fallbackMonthly = new Date(Date.now() - 35 * 24 * 3600 * 1000).toISOString();
          query = query.gte('created_at', fallbackMonthly).order('view_count', { ascending: false });
        } else if (currentFilter.value === '6months') {
          const fallbackSix = new Date(Date.now() - 190 * 24 * 3600 * 1000).toISOString();
          query = query.gte('created_at', fallbackSix).order('view_count', { ascending: false });
        } else {
          query = query.order('view_count', { ascending: false });
        }

        const startOffset = allClips.value.length;
        const fetchAmount = 24; 
        
        const { data: c, error } = await query.range(startOffset, startOffset + fetchAmount);
        
        if (error) throw error; 

        if (c && c.length > 0) { 
          allClips.value.push(...c); 
          clips.value = allClips.value; 
          if (c.length < fetchAmount + 1) allClipsLoaded.value = true;
        } else { 
          allClipsLoaded.value = true; 
        }
      } catch (err) {} finally { isLoadingMore.value = false; }
    };

    const handleScroll = (e) => {
      const st = e.target.scrollTop;
      if (st > lastScrollTop && st > 50) {
        isHeaderVisible.value = false;
      } else if (st < lastScrollTop) {
        isHeaderVisible.value = true;
      }
      lastScrollTop = st <= 0 ? 0 : st;

      if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 600) { 
        if (currentTab.value === 'home') loadData(true); 
      }
    };
    
    let lastScrollTop = 0;

    const handleLogin = async () => {
      if (!loginEmail.value || !loginPass.value) { loginError.value = "Missing credentials."; return; }
      try {
        const { data, error } = await sbClient.auth.signInWithPassword({ email: loginEmail.value, password: loginPass.value });
        if (error) { loginError.value = error.message; return; }
        if (data?.user) { 
          currentUser.value = data.user; 
          modals.value.profile = false; 
          loginEmail.value = ''; 
          loginPass.value = '';
          fetchTotalClipsCount();
          fetchClipsAddedRange(selectedRange.value);
        }
      } catch { loginError.value = "System login failure."; }
    };

    const handleLogout = async () => { logoutState.value = 'LOGGING OUT...'; await sbClient.auth.signOut(); currentUser.value = null; modals.value.profile = false; logoutState.value = 'Sign Out'; };
    const clearGeraldHistory = async () => { wipeState.value = 'WIPING...'; await sbClient.from('gerald_history').delete().eq('user_id', currentUser.value.id); geraldMessages.value = [{ role: 'gerald', content: '' }]; wipeState.value = 'SUCCESS'; setTimeout(() => wipeState.value = 'Wipe Gerald Memory', 1500); };
    
    const nukeCache = () => { 
      nukeState.value = 'NUKING...'; 
      setTimeout(() => { 
        localStorage.clear(); 
        caches.keys().then(names => { for (let n of names) caches.delete(n); }); 
        nukeState.value = 'SUCCESS'; 
        setTimeout(() => window.location.reload(), 600); 
      }, 300); 
    };

    const talkToGerald = async () => {
      const inputEl = document.getElementById('gerald-txt-input');
      if (inputEl && inputEl.value !== geraldInput.value) { geraldInput.value = inputEl.value; }
      if (!geraldInput.value.trim() || isGeraldTyping.value) return;

      const userMsg = geraldInput.value.trim();
      geraldMessages.value.push({ role: 'user', content: userMsg });

      if (currentUser.value) {
        sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'user', content: userMsg }).then();
      }

      geraldInput.value = '';
      if (inputEl) { inputEl.value = ''; inputEl.style.height = 'auto'; }

      isGeraldTyping.value = true; 
      showEmotePicker.value = false;
      showMinigames.value = false;
      
      await nextTick();
      const b = document.getElementById('gerald-msgs');
      if (b) b.scrollTop = b.scrollHeight;

      const cleanHistory = geraldMessages.value
        .slice(-8)
        .filter(m => m.content && !m.content.includes('SYSTEM FAILURE') && !m.content.includes('MALFUNCTION'))
        .map(m => ({ 
          role: m.role === 'gerald' ? 'assistant' : 'user', 
          content: m.content,
          parts: [{ text: m.content }]
        }));

      try {
        const { data, error } = await sbClient.functions.invoke('gerald-chat', { 
          body: { 
            history: cleanHistory,
            messages: cleanHistory,
            prompt: userMsg,
            system_directive: getGeraldSystemDirective(customEmotes.value) 
          } 
        });
        
        const replyText = typeof data === 'string' ? data : (data?.reply || data?.text || data?.message || data?.generations?.[0]?.text);

        if (!error && replyText) {
          let formattedReply = enforceGrammar(replyText.trim());
          geraldMessages.value.push({ role: 'gerald', content: formattedReply });
          if (currentUser.value) {
            sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'gerald', content: formattedReply }).then();
          }
        } else {
          throw new Error(error ? error.message : "Empty reply");
        }
      } catch (err) {
        console.error('Gerald chat error:', err);
        geraldMessages.value.push({ role: 'gerald', content: 'Sync error. The technician probably pulled the power cord again.' });
      } finally { 
        isGeraldTyping.value = false; 
        nextTick(() => { if (b) b.scrollTop = b.scrollHeight; }); 
      }
    };

    const triggerAiMinigame = (gameObj) => {
      if (isGeraldTyping.value) return;
      
      geraldInput.value = "";
      showEmotePicker.value = false;
      showMinigames.value = false;
      
      geraldMessages.value.push({ 
        role: 'user', 
        type: 'event', 
        content: gameObj.name, 
        icon: gameObj.icon 
      });
      
      if (currentUser.value) {
        sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'user', content: `[EVENT: ${gameObj.name}]` }).then();
      }
      
      isGeraldTyping.value = true;
      nextTick(() => { const b = document.getElementById('gerald-msgs'); if(b) b.scrollTop = b.scrollHeight; });

      const cleanContext = geraldMessages.value
        .slice(-6)
        .filter(m => m.content && !m.content.includes('SYSTEM FAILURE') && !m.content.includes('MALFUNCTION'))
        .map(m => ({ 
          role: m.role === 'gerald' ? 'assistant' : 'user', 
          content: m.content,
          parts: [{ text: m.content }]
        }));

      sbClient.functions.invoke('gerald-chat', { 
        body: { 
          history: cleanContext,
          messages: cleanContext,
          prompt: gameObj.prompt,
          system_directive: getGeraldSystemDirective(customEmotes.value, gameObj.prompt) 
        } 
      }).then(({ data, error }) => {
        const replyText = typeof data === 'string' ? data : (data?.reply || data?.text || data?.message || data?.generations?.[0]?.text);

        if (!error && replyText) {
          let formattedReply = enforceGrammar(replyText.trim());
          geraldMessages.value.push({ role: 'gerald', content: formattedReply });
          if (currentUser.value) {
            sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'gerald', content: formattedReply }).then();
          }
        } else {
          geraldMessages.value.push({ role: 'gerald', content: 'Could not process event right now.' });
        }
      }).catch(() => {
        geraldMessages.value.push({ role: 'gerald', content: 'Connection timed out.' });
      }).finally(() => {
        isGeraldTyping.value = false;
        nextTick(() => { const b = document.getElementById('gerald-msgs'); if(b) b.scrollTop = b.scrollHeight; });
      });
    };

    onMounted(() => {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.documentElement.style.overflow = 'hidden';

      updateThemeClass();

      sbClient.auth.getSession().then(({ data: sessionData }) => {
        if (sessionData?.session?.user) {
          currentUser.value = sessionData.session.user;
          fetchTotalClipsCount();
          fetchClipsAddedRange('7D');
        }
        sbClient.auth.onAuthStateChange((event, session) => { 
          currentUser.value = session?.user || null; 
          if (currentUser.value) {
            fetchTotalClipsCount();
            fetchClipsAddedRange('7D');
          }
        });

        const presenceChannel = sbClient.channel('miko-active-room');
        presenceChannel.on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.presenceState();
            activeUsersCount.value = Object.keys(state).length || 1;
        });
        presenceChannel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await presenceChannel.track({
                    user_id: currentUser.value ? currentUser.value.id : 'anon-' + Math.random().toString(36).substring(2,7),
                    online_at: new Date().toISOString()
                });
                setInterval(async () => {
                    await presenceChannel.track({ online_at: new Date().toISOString() });
                }, 10000);
            }
        });
      });

      const minSplashTime = new Promise(resolve => setTimeout(resolve, 1000));
      Promise.all([loadData(), minSplashTime]).finally(() => {
        splashOpacity.value = 0; 
        setTimeout(() => { splashVisible.value = false; }, 300);
      });

      loadEmotesFromSupabase();
      checkLive();
      testGeminiBrain();

      setInterval(() => { sysStats.value.cpu = Math.floor(15 + Math.random() * 25); sysStats.value.temp = Math.floor(71 + Math.random() * 8); }, 4000);
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkLive(); });
      
      sbClient.channel('public:clips').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'clips' }, payload => {
        if (payload.new) { 
          allClips.value.unshift(payload.new); 
          if (currentFilter.value === 'latest') {
            clips.value = allClips.value; 
          }
          if (totalClipsCount.value !== null) totalClipsCount.value++;
          fetchClipsAddedRange(selectedRange.value);
        }
      }).subscribe();
    });

    return {
      hostname, splashVisible, splashOpacity, currentTab, tabOffset, appTheme, toggleTheme, clips, currentUser, loginEmail, loginPass, loginError, geraldInput, geraldMessages, isGeraldTyping, wipeState, logoutState, nukeState, fetchState, totalClipsCount, clipsAddedCount, selectedRange, isHeaderVisible, currentFilter, activeFilterLabel, isFilterMenuOpen, recentVods, currentVodIndex, customEmotes, emoteSearch, showEmotePicker, showMinigames, activeClipId, switchTab, geminiStatus, sysStats, handleSwipeStart, handleSwipeEnd, handleModalTouchStart, handleModalTouchMove, handleModalTouchEnd, handleScroll, apiConfig, selectedClip, modals, allClipsCount, isLive, chatMessages, twitchChatToken, twitchAuthUrl, twitchUsername, showLoginPopup, activeUsersCount, openProfile,
      logoSvg: (id) => `<svg viewBox="0 0 100 100"><defs><linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9146FF"/><stop offset="100%" stop-color="#a970ff"/></linearGradient></defs><circle cx="50" cy="50" r="40" fill="url(#grad-${id})"/><path d="M 33 38 L 48 62 L 62 38 L 62 55 Q 62 65 69 64" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      optimizeTwitchImg: (u) => u ? u.replace('%{width}', '480').replace('%{height}', '270') : '',
      formatViews: (v) => v ? v.toLocaleString() : '0',
      formatDate: (d) => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      closeFilterMenu: () => { isFilterMenuOpen.value = false; },
      applyFilter: (key, label) => { currentFilter.value = key; activeFilterLabel.value = label; isFilterMenuOpen.value = false; allClipsLoaded.value = false; allClips.value = []; loadData(false); },
      prevVod: () => { if (currentVodIndex.value > (isLive.value ? -1 : 0)) currentVodIndex.value--; },
      nextVod: () => { if (currentVodIndex.value < recentVods.value.length - 1) currentVodIndex.value++; },
      playClip: (clip) => { selectedClip.value = clip; },
      handleLogin, handleLogout, clearGeraldHistory, nukeCache, talkToGerald, triggerAiMinigame,
      triggerFetchClips, selectRange: fetchClipsAddedRange,
      closePickers: () => { showEmotePicker.value = false; showMinigames.value = false; },
      insertEmote: (name) => { geraldInput.value += (geraldInput.value && !geraldInput.value.endsWith(' ') ? ' ' : '') + name + ' '; showEmotePicker.value = false; },
      toggleEmotes: () => { showEmotePicker.value = !showEmotePicker.value; showMinigames.value = false; },
      toggleMinigames: () => { showMinigames.value = !showMinigames.value; showEmotePicker.value = false; },
      sendTwitchChatMessage: () => {}, disconnectTwitch: () => {}
    };
  }
}).mount('#app-container');
