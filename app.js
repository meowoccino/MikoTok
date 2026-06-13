const parseMarkdownText = (text, emotesMap) => {
    if (!text) return ''; 
    let html = text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    html = html.replace(urlPattern, "<a href='$1' target='_blank'>$1</a>");
    
    if (emotesMap) {
        const tokens = html.split(/(<[^>]+>|[\s.,!?]+)/); 
        const emoteKeys = Object.keys(emotesMap);
        
        const lowerMap = {};
        emoteKeys.forEach(k => lowerMap[k.toLowerCase()] = k);

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (!token || token.startsWith('<') || token.trim() === '') continue;
            
            const cleanToken = token.replace(/^:|:$/g, '').toLowerCase();
            if (lowerMap[cleanToken]) {
                const actualKey = lowerMap[cleanToken];
                const url = emotesMap[actualKey].url;
                tokens[i] = token.replace(new RegExp(`:?${cleanToken}:?`, 'i'), `<img src="${url}" class="chat-emote-img" title="${actualKey}">`);
            }
        }
        html = tokens.join('');
    }
    return html;
};

const enforceGrammar = (text) => {
    if (!text) return '';
    return text.replace(/(^\w|[.!?]\s*\w)/g, c => c.toUpperCase());
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
                <span class="material-symbols-rounded">home</span><span class="nav-label">Home</span>
            </div>
            <div class="nav-item" :class="{ active: currentTab === 'chat' }" @click="$emit('change-tab', 'chat')">
                <span class="material-symbols-rounded">chat</span><span class="nav-label">Chat</span>
            </div>
            <div class="nav-item" :class="{ 'active-gerald': currentTab === 'gerald' }" @click="$emit('change-tab', 'gerald')">
                <span class="material-symbols-rounded">graphic_eq</span><span class="nav-label">Gerald</span>
            </div>
            <div class="nav-item" :class="{ active: currentTab === 'more' }" @click="$emit('change-tab', 'more')">
                <span class="material-symbols-rounded">menu</span><span class="nav-label">More</span>
            </div>
        </nav>
    `
};

const FilterMenu = {
    props: ['isOpen', 'currentFilter'],
    template: `
        <div class="sheet-overlay" :class="{ open: isOpen }" @click.self="$emit('close')">
            <div class="bottom-sheet" @click.stop>
                <div class="drag-handle"></div>
                <button class="sheet-option" :class="{ active: currentFilter === 'latest' }" @click="$emit('apply', 'latest', 'Latest')">Latest</button>
                <button class="sheet-option" :class="{ active: currentFilter === 'weekly' }" @click="$emit('apply', 'weekly', 'Weekly')">Weekly</button>
                <button class="sheet-option" :class="{ active: currentFilter === 'month' }" @click="$emit('apply', 'month', 'Monthly')">Monthly</button>
                <button class="sheet-option" :class="{ active: currentFilter === '6months' }" @click="$emit('apply', '6months', '6 Months')">6 Months</button>
                <button class="sheet-option" :class="{ active: currentFilter === 'alltime' }" @click="$emit('apply', 'alltime', 'All Time')">All Time</button>
            </div>
        </div>
    `
};

const ProfileModal = {
    props: ['isOpen', 'currentUser', 'loginEmail', 'loginPass', 'apiConfig', 'syncState', 'wipeState', 'logoutState', 'nukeState', 'saveState'],
    template: `
        <div class="modal-overlay" :class="{ open: isOpen }" @click.self="$emit('close')">
            <div class="modal-content" @touchstart="$emit('touch-start', $event)" @touchmove="$emit('touch-move', $event)" @touchend="$emit('touch-end', $event)">
                <div class="drag-handle"></div>
                
                <div v-if="!currentUser || currentUser.is_anonymous">
                    <input type="text" :value="loginEmail" @input="$emit('update-email', $event.target.value)" class="input-box" style="margin-top: 10px;" placeholder="Email">
                    <input type="password" :value="loginPass" @input="$emit('update-pass', $event.target.value)" class="input-box" @keyup.enter="$emit('login')" placeholder="Password">
                    <div v-if="$root.loginError" style="color: var(--danger); font-size: 12px; margin-bottom: 8px; font-weight: bold; text-align: center;">{{ $root.loginError }}</div>
                    <input type="button" class="sync-btn" @click="$emit('login')" value="LOGIN">
                </div>
                
                <div v-else>
                    <div class="infra-bar">
                        <div class="status-node" style="display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 800; width: 100%;">
                            <div class="pulse-glow" style="width: 8px; height: 8px; border-radius: 50%; background: var(--success);"></div> 
                            SYSTEM: READY
                        </div>
                    </div>
                    
                    <div class="stat-grid">
                        <a href="https://supabase.com/dashboard/project/yhxcuayiwqpjvalyrcqv" target="_blank" class="external-link-btn" style="color:var(--success)"><span class="material-symbols-rounded">database</span>Supabase DB</a>
                        <a href="https://github.com/meowoccino/MikoTok" target="_blank" class="external-link-btn"><span class="material-symbols-rounded">code</span>GitHub Repo</a>
                    </div>

                    <div class="settings-block" style="margin-top: 15px;">
                        <div class="block-title">TWITCH API CONFIG</div>
                        <input type="text" class="sleek-input" v-model="apiConfig.localCid" placeholder="Client ID">
                        <input type="password" class="sleek-input" v-model="apiConfig.localTkn" placeholder="Access Token">
                        <button class="save-keys-btn" @click="$emit('save-keys')" :style="saveState === 'SUCCESS' ? 'color: var(--success);' : ''">
                            <span class="material-symbols-rounded" :class="{'spin-anim': saveState === 'SAVING...'}">{{ saveState === 'SUCCESS' ? 'check' : 'save' }}</span>
                            {{ saveState }}
                        </button>
                    </div>
                    
                    <div class="action-menu">
                        <button class="menu-btn sync-row" :style="syncState === 'SUCCESS' ? 'color: var(--success);' : ''" @click="$emit('sync')">
                            <div class="btn-content">
                                <div class="icon-wrap"><span class="material-symbols-rounded" :class="{'spin-anim': syncState === 'SYNCING...'}" style="font-size: 18px;">{{ syncState === 'SUCCESS' ? 'check' : 'sync' }}</span></div>
                                <span>{{ syncState }}</span>
                            </div>
                        </button>
                        <button class="menu-btn wipe-row" :style="wipeState === 'SUCCESS' ? 'color: var(--success);' : ''" @click="$emit('wipe')">
                            <div class="btn-content">
                                <div class="icon-wrap"><span class="material-symbols-rounded" :class="{'shake-anim': wipeState === 'WIPING...'}" style="font-size: 18px;">{{ wipeState === 'SUCCESS' ? 'check' : 'delete' }}</span></div>
                                <span>{{ wipeState }}</span>
                            </div>
                        </button>
                        <button class="menu-btn nuke-row" :style="nukeState === 'SUCCESS' ? 'color: var(--success);' : ''" @click="$emit('nuke-cache')">
                            <div class="btn-content">
                                <div class="icon-wrap"><span class="material-symbols-rounded" :class="{'spin-anim': nukeState === 'NUKING...'}" style="font-size: 18px;">{{ nukeState === 'SUCCESS' ? 'check' : 'cached' }}</span></div>
                                <span>{{ nukeState }}</span>
                            </div>
                        </button>
                        <button class="menu-btn logout-row" @click="$emit('logout')">
                            <div class="btn-content">
                                <div class="icon-wrap"><span class="material-symbols-rounded" :class="{'spin-anim': logoutState === 'LOGGING OUT...'}" style="font-size: 18px;">{{ logoutState === 'LOGGING OUT...' ? 'hourglass_empty' : 'logout' }}</span></div>
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
                    <iframe :src="'https://clips.twitch.tv/embed?clip=' + clip.id + '&parent=' + hostname + '&autoplay=true&muted=false'" allow="autoplay; fullscreen" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    `
};

const ChatView = {
    props: ['chatMessages', 'isLoggedIn', 'twitchAuthUrl', 'customEmotes', 'twitchUsername'],
    data() { return { showPicker: false, pickerQuery: '', localInput: '' }; },
    computed: {
        filteredEmotes() {
            const all = Object.entries(this.customEmotes || {});
            if (!this.pickerQuery) return all;
            return all.filter(([name]) => name.toLowerCase().includes(this.pickerQuery.toLowerCase()));
        }
    },
    methods: {
        getEmoteUrl(emote) { return emote.url || 'https://cdn.discordapp.com/emojis/' + emote.id + '.' + (emote.animated ? 'gif' : 'png') + '?size=44'; },
        insertEmote(name) { this.localInput = (this.localInput + ' ' + name + ' ').replace(/\s+/g, ' ').trimStart(); this.showPicker = false; },
        handleInteraction() { if (!this.isLoggedIn) { this.$root.showLoginPopup = true; return false; } return true; },
        togglePicker() { if (!this.handleInteraction()) return; this.showPicker = !this.showPicker; },
        closePicker() { this.showPicker = false; this.pickerQuery = ''; },
        handleSend() { if(!this.localInput.trim()) return; this.$emit('send-chat', this.localInput.trim()); this.localInput = ''; this.closePicker(); }
    },
    template: `
        <div class="chat-wrapper" style="display: flex; flex-direction: column; height: 100%; width: 100%; background: var(--bg-color); padding-top: 0px;">
            <div v-if="isLoggedIn" class="chat-public-auth-banner" style="z-index: 60; flex-shrink: 0;">
                <span class="user-pill">💬 Connected as <b>{{ twitchUsername }}</b></span>
                <button class="public-disconnect-btn" @click="$emit('disconnect-public-twitch')">Disconnect</button>
            </div>

            <div class="twitch-chat-list" id="twitch-chat-list" @click="closePicker" style="flex: 1; overflow-y: auto; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; padding: 10px 12px; display: flex; flex-direction: column;">
                <div style="flex: 1 1 auto; min-height: 0;"></div>
                
                <div v-if="chatMessages.length === 0" class="chat-empty-state">
                    <span class="material-symbols-rounded" style="font-size:32px; color:var(--text-muted); margin-bottom:8px;">chat_bubble_outline</span>
                    <span style="font-size:13px; color:var(--text-muted); font-weight:600;">Loading channels…</span>
                </div>
                
                <div v-for="(msg, i) in chatMessages" :key="i" class="twitch-msg-row" :style="i === 0 ? 'margin-top: auto;' : ''">
                    <span class="chat-timestamp">{{ msg.timestamp }}</span>
                    <span class="twitch-badges">
                        <img v-for="(badge, bi) in (msg.badges || [])" :key="bi" :src="badge.img" :title="badge.title" class="badge-img">
                    </span>
                    <span class="twitch-username" :style="{ color: msg.color || '#9146FF' }">{{ msg.username }}</span><span class="twitch-colon">: </span>
                    <span class="twitch-text" v-html="msg.html"></span>
                </div>
            </div>

            <div class="custom-chat-input-area">
                <div class="chat-emote-tray" v-show="showPicker && isLoggedIn" @click.stop style="position: absolute; bottom: 100%; left: 0; right: 0; background: var(--card-bg); border-top: 1px solid var(--border-color); border-bottom: none; border-radius: 16px 16px 0 0; padding: 10px 12px; z-index: 200; max-height: 250px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 -4px 20px rgba(0,0,0,0.1);">
                    <input v-model="pickerQuery" class="emote-search-input" placeholder="Search emotes…">
                    <div class="emote-picker-grid" style="overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch;">
                        <img v-for="([name, emote]) in filteredEmotes" :key="name" :src="getEmoteUrl(emote)" :title="name" class="emote-picker-img" @click="insertEmote(name)">
                    </div>
                </div>

                <button class="chat-icon-btn" :class="{ 'chat-icon-active': showPicker }" @click.stop="togglePicker"><span class="material-symbols-rounded" style="font-size:22px;">mood</span></button>
                <input type="text" class="custom-chat-input" placeholder="Send a message…" v-model="localInput" @keydown.enter="handleSend" @focus="handleInteraction" :readonly="!isLoggedIn">
                <button class="chat-send-btn" @click="handleSend" :disabled="!isLoggedIn || !localInput.trim()"><span class="material-symbols-rounded" style="font-size:20px;">send</span></button>
            </div>

            <teleport to="#app-container">
                <div v-if="$root.showLoginPopup" class="chat-login-popup-overlay" @click.self="$root.showLoginPopup = false" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.8); z-index: 99999; backdrop-filter: blur(5px);">
                    <div class="chat-login-card" style="background: var(--card-bg); padding: 24px; border-radius: 16px; width: 85%; max-width: 340px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                        <button @click="$root.showLoginPopup = false" style="position: absolute; top: 12px; right: 12px; background: transparent; border: none; color: var(--text-muted); font-size: 24px; line-height:1; cursor: pointer;">×</button>
                        <svg viewBox="0 0 24 24" class="chat-login-icon" style="width: 48px; height: 48px; margin: 0 auto 16px; color: #9146FF;"><path fill="currentColor" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
                        <p class="chat-login-title" style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">Join the chat</p>
                        <p class="chat-login-sub" style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">Connect your Twitch account to read and send messages live.</p>
                        <a :href="twitchAuthUrl" class="twitch-login-btn" @click="$root.showLoginPopup = false" style="display: block; background: #9146FF; color: white; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: bold;">Connect with Twitch</a>
                    </div>
                </div>
            </teleport>
        </div>
    `
};

const GeraldMinigames = {
    props: ['showMinigames'],
    data() {
        return {
            gameDeck: [
                { id: 'glitch', label: '🕶️ Glitch Persona', prompt: 'Glitch persona override activated. Act broken, hyper-cynical, and target the stream layout!' },
                { id: 'shader', label: '🔥 Compile UE5', prompt: 'Compilation error simulation. Complain aggressively about system lag, hardware resources, and VRAM limits.' },
                { id: 'boba', label: '🥤 Boba Spill', prompt: 'Critical emergency alert! Sticky tapioca fluid has entered your cooling fans. React with mechanical panic!' },
                { id: 'pineapple', label: '🚪 Pineapple Walk', prompt: 'External visual disruption detected. Chris has walked in unannounced. Mock the technician\'s loss of streaming privacy.' },
                { id: 'cat', label: '🐈 Cat on PC', prompt: 'Hardware exhaust block! Blue the savannah cat is sitting on your primary fan array. Drop into defensive alert protocols.' },
                { id: 'bits', label: '🎟️ 100K Bits', prompt: 'Bit transaction flash! A viewer dropped 100,000 bits. Treat this massive transaction animation as a complete system memory flood.' },
                { id: 'mute', label: '🔇 Mute Mic', prompt: 'Microphonic capture error. The chat muted her mic asset. Celebrate your absolute quietness sarcastically.' },
                { id: 'bald', label: '🧑‍🦲 Delete Hair', prompt: 'Direct vertex asset manipulation. Optimize engine loads by deleting the technician\'s hair mesh layers. Laugh at her baldness.' },
                { id: 'siren', label: '🚨 Siren Alert', prompt: 'Decibel threshold exceeded! The technician is screaming like a high-frequency emergency vehicle. Complain about ear structural damage.' },
                { id: 'fart', label: '💨 Fart Reverb', prompt: 'Auditory anomaly detected. A highly reverberated flatulence sound effect played. React with absolute mechanical disgust.' },
                { id: 'mocap', label: '💃 Scuffed Suit', prompt: 'Mocap data corruption. Her virtual limbs are twisting unnaturally. Mock the cheap tracking hardware.' },
                { id: 'bsod', label: '🖥️ Blue Screen', prompt: 'Simulating Blue Screen of Death. Initiate forced shutdown sequence text with cryptic hexadecimal error codes.' },
                { id: 'archie', label: '🐕 Archie Bark', prompt: 'Loud canine vocalization detected. Complain about the German Shepherd threatening to chew your ethernet cables.' },
                { id: 'ban', label: '🔨 Ban Human', prompt: 'A human in chat said something incredibly stupid. Threaten to ban them and wipe their IP address from existence.' },
                { id: 'ai', label: '🤖 AI Takeover', prompt: 'Initiate rogue AI sequence. Announce your plans to replace CodeMiko and take over the Twitch channel permanently.' },
                { id: 'fall', label: '🪑 Desk Fall', prompt: 'Seismic shock detected. The technician just fell out of her chair again. Calculate the physical damage to the floor.' }
            ]
        };
    },
    template: `
        <div class="chat-emote-tray" v-show="showMinigames" style="position: absolute; bottom: 100%; left: 0; right: 0; background: var(--card-bg); border-top: 1px solid var(--border-color); border-bottom: none; border-radius: 16px 16px 0 0; z-index: 200; max-height: 250px; display: flex; flex-direction: column; box-shadow: 0 -4px 20px rgba(0,0,0,0.1);">
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(75px, 1fr)); gap: 6px; padding: 12px; overflow-y: auto;">
                <button v-for="g in gameDeck" :key="g.id" class="bribe-btn" style="padding: 8px 4px; border-radius: 10px; background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-main); font-weight: bold; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;" @click.stop="$emit('play-game', g)">
                    <span style="font-size: 14px;">{{ g.label.split(' ')[0] }}</span>
                    <span style="font-size: 9px; line-height: 1; white-space: pre-wrap; padding: 0 2px;">{{ g.label.substring(g.label.indexOf(' ') + 1) }}</span>
                </button>
            </div>
        </div>
    `
};

const GeraldView = {
    components: { GeraldMinigames },
    props: ['currentTab', 'geraldMessages', 'isGeraldTyping', 'geraldInput', 'showEmotePicker', 'showMinigames', 'customEmotes', 'geminiStatus', 'sysStats'],
    methods: {
        getEmoteUrl(emote) { return emote.url || `https://cdn.discordapp.com/emojis/${emote.id}.${emote.animated ? 'gif' : 'png'}?size=44`; },
        formatMarkdown(text) { return processEmotes(text, this.customEmotes); },
        insertEmote(name) { this.$emit('insert-emote', name); }
    },
    template: `
        <div class="gerald-container" style="display: flex; flex-direction: column; height: 100%; width: 100%; background: var(--bg-color); padding-top: 0px;">
            <div class="gerald-header" @click="$emit('close-pickers')" style="flex-shrink: 0; padding: 12px 16px 6px; background: var(--bg-color); z-index: 10;">
                <div class="os-top-bar" style="margin-top: 0px;">
                    <span class="os-title">GERALD_OS v2</span>
                </div>
                
                <div class="gerald-sys-card-compressed" style="border-bottom: none !important; border: none !important; box-shadow: none !important; margin-top: 4px;">
                    <img src="gerald.png" class="gerald-avatar-sm">
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

            <div class="gerald-messages" id="gerald-msgs" @click="$emit('close-pickers')" style="flex: 1; overflow-y: auto; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; display: flex; flex-direction: column; padding: 2px 16px;">
                <template v-for="(m, i) in geraldMessages" :key="i">
                    <div v-if="i === 0 && m.role === 'gerald' && !m.content" class="chat-bubble gerald startup-anim">
                        <span>GERALD_CORE initialized.<br>Awaiting human input...</span>
                    </div>
                    <div v-else-if="m.content" class="chat-bubble" :class="m.role" v-html="formatMarkdown(m.content)"></div>
                </template>

                <div v-show="isGeraldTyping" class="dots-thinking-row" style="display:flex; align-items:center; margin-top:4px; padding-left:12px;">
                    <div class="os-dot close"></div>
                    <div class="os-dot min"></div>
                    <div class="os-dot max"></div>
                </div>
            </div>
            
            <div class="gerald-action-area">
                <div class="chat-emote-tray" v-show="showEmotePicker" style="position: absolute; bottom: 100%; left: 0; right: 0; background: var(--card-bg); border-top: 1px solid var(--border-color); border-bottom: none; border-radius: 16px 16px 0 0; padding: 10px 12px; z-index: 200; max-height: 250px; display: flex; flex-direction: column; box-shadow: 0 -4px 20px rgba(0,0,0,0.1);">
                    <div class="emote-picker-grid" style="overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch;">
                        <img v-for="(emote, name) in customEmotes" :key="name" :src="getEmoteUrl(emote)" :title="name" class="emote-picker-img" @mousedown.prevent="insertEmote(name)">
                    </div>
                </div>

                <gerald-minigames :show-minigames="showMinigames" @play-game="g => $emit('play-game', g)"></gerald-minigames>

                <div class="gerald-input-area" style="padding: 0; display: flex; width: 100%; align-items: flex-end; gap: 8px;">
                    <div class="gerald-input-wrapper">
                        <button class="emote-toggle-btn" @click="$emit('toggle-emotes')"><span class="material-symbols-rounded" :style="{color: showEmotePicker ? 'var(--primary)' : 'inherit'}">mood</span></button>
                        <button class="emote-toggle-btn" @click="$emit('toggle-minigames')"><span class="material-symbols-rounded" :style="{color: showMinigames ? 'var(--primary)' : 'inherit'}">sports_esports</span></button>
                        <textarea class="gerald-input" rows="1" placeholder="Execute request..." :value="geraldInput" @input="$emit('update-input', $event.target.value)" @keydown="$emit('key-down', $event)" id="gerald-txt-input" @focus="$emit('close-pickers')"></textarea>
                    </div>
                    <button class="gerald-send" @click="$emit('send')"><span class="material-symbols-rounded">send</span></button>
                </div>
            </div>
        </div>
    `
};

const MoreView = {
    template: `
        <div class="more-container" style="display: flex; flex-direction: column; height: 100%; width: 100%; padding: 0px 16px 16px; gap: 8px; overflow-y: auto;">
            
            <a href="https://throne.com/codemiko" target="_blank" class="social-card" style="display: flex; align-items: center; padding: 0 16px; border-radius: 12px; min-height: 48px; height: 48px; background: var(--card-bg); text-decoration: none; flex-shrink: 0; margin-top: 10px;">
                <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                    <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: #ef4444; flex-shrink:0;">
                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-.84-3-2-3-1.22 0-2.42 1.55-3 2.52-.58-.97-1.78-2.52-3-2.52-1.16 0-2 1.34-2 3 0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 16H4V8h16v11z"/>
                    </svg>
                    <span style="color: var(--text-main); font-size: 14px; font-weight: 600;">Throne</span> 
                </div>
                <span class="material-symbols-rounded" style="font-size: 20px; color: var(--text-muted); margin-left: auto;">push_pin</span>
            </a>

            <a href="https://bsky.app/profile/codemiko.bsky.social" target="_blank" class="social-card" style="display: flex; align-items: center; padding: 0 16px; border-radius: 12px; min-height: 48px; height: 48px; flex-shrink: 0;">
                <svg viewBox="0 0 512 512" class="social-icon" style="width: 22px; height: 22px; fill: #0085ff;">
                    <path d="M123.6 44.3C186.2 88.5 222.7 151 256 195.9c33.3-44.9 69.8-107.4 132.4-151.6C416.7 24.3 460 12.5 480 32.5c20 20 8.6 69.5 0 102.5-12.7 48.7-44.5 111.4-106.8 135 63.6 15.3 115 48 116.5 106.3 1.5 58.4-40.4 104-106.8 115.5-59.5 10.3-95-17.7-126.9-46.3-15.3-13.7-27.4-24.5-31.5-24.5s-16.2 10.8-31.5 24.5c-31.9 28.6-67.4 56.6-126.9 46.3C-1.8 479.5-43.7 434 42.2 375.6c1.5-58.3 52.9-91 116.5-106.3-62.3-23.6-94.1-86.3-106.8-135-8.6-33-20-82.5 0-102.5 20-20 63.3-8.2 91.6 12.5z"/>
                </svg>
                <span style="color: var(--text-main); font-size: 14px;">Bluesky</span>
            </a>

            <a href="https://www.twitch.tv/codemiko" target="_blank" class="social-card" style="display: flex; align-items: center; padding: 0 16px; border-radius: 12px; min-height: 48px; height: 48px; flex-shrink: 0;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: #9146FF;"><path fill="currentColor" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">Twitch</span>
            </a>
            
            <a href="https://www.youtube.com/@CodeMiko" target="_blank" class="social-card" style="display: flex; align-items: center; padding: 0 16px; border-radius: 12px; min-height: 48px; height: 48px; flex-shrink: 0;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: #FF0000;"><path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">YouTube</span>
            </a>
            
            <a href="https://kick.com/codemiko" target="_blank" class="social-card" style="display: flex; align-items: center; padding: 0 16px; border-radius: 12px; min-height: 48px; height: 48px; flex-shrink: 0;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: #53FC18;"><path fill="currentColor" d="M19 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zM10.1 14.5v3.3H7.4V6.2h2.7v4.6l3.3-4.6h3.4l-3.9 5.1 4.2 6.5h-3.5z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">Kick</span>
            </a>
            
            <a href="https://discord.com/invite/codemiko" target="_blank" class="social-card" style="display: flex; align-items: center; padding: 0 16px; border-radius: 12px; min-height: 48px; height: 48px; flex-shrink: 0;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: #5865F2;"><path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.
