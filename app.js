// Injects global CSS to fix the HTML wrapper borders and add native slide animations
const styleReset = document.createElement('style');
styleReset.innerHTML = `
    .app-wrapper { border-left: none !important; border-right: none !important; max-width: 100% !important; }
    html, body { overscroll-behavior-y: none; background-color: var(--bg-color) !important; }
    ::-webkit-scrollbar { width: 0px; background: transparent; }
    
    /* Native Slide Transition Classes */
    .nav-slide-enter-active, .nav-slide-leave-active { transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); will-change: transform; }
    .nav-slide-enter-from, .nav-slide-leave-to { transform: translateX(100%); }
    .sub-view-overlay { position: absolute; top:0; left:0; right:0; bottom:0; background: var(--bg-color); z-index: 50; overflow-y: auto; padding: 20px 16px; box-sizing: border-box; }
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
    return text.replace(/(^\w|[.!?]\s*\w)/g, c => c.toUpperCase());
};

const getGeraldSystemDirective = (customEmotesMap, basePrompt = "You are GERALD_OS v2, an edgy, mechanical AI system.") => {
    const keys = Object.keys(customEmotesMap || {});
    if (keys.length === 0) return basePrompt;
    const vocab = keys.sort(() => 0.5 - Math.random()).slice(0, 50).join(', ');
    return `${basePrompt}\n\n[SYSTEM DIRECTIVE: You have full access to the stream's custom Twitch emotes. Express emotion by using them naturally in your text. Just type the exact emote name. Your current available emote vocabulary: ${vocab}]`;
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
                    
                    <div class="action-menu" style="margin-top: 15px;">
                        <button class="menu-btn sync-row" :style="syncState === 'SUCCESS' ? 'color: var(--success);' : ''" @click="$emit('sync')">
                            <div class="btn-content">
                                <div class="icon-wrap"><span class="material-symbols-rounded" :class="{'spin-anim': syncState === 'REFRESHING...'}" style="font-size: 18px;">{{ syncState === 'SUCCESS' ? 'check' : 'sync' }}</span></div>
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
            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 14px; z-index: 1000; background: transparent;" @touchstart="$emit('edge-swipe-start', $event)" @touchend="$emit('edge-swipe-end', $event)"></div>
            <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 14px; z-index: 1000; background: transparent;" @touchstart="$emit('edge-swipe-start', $event)" @touchend="$emit('edge-swipe-end', $event)"></div>

            <div style="flex: 1; overflow: hidden; position: relative; width: 100%; height: 100%; margin-top: 4px;">
                <iframe 
                    :src="chatUrl" 
                    style="position: absolute; top: -38px; left: 0; width: 100%; height: calc(100% + 38px); border: none;"
                    allowfullscreen>
                </iframe>
            </div>
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 10px; background: linear-gradient(to bottom, var(--bg-color) 0%, transparent 100%); pointer-events: none; z-index: 10;"></div>
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
                { id: 'bald', label: '🧑\u200D🦲 Delete Hair', prompt: 'Direct vertex asset manipulation. Optimize engine loads by deleting the technician\'s hair mesh layers. Laugh at her baldness.' },
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
        formatMarkdown(text) { return parseMarkdownText(text, this.customEmotes); },
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
                        <img v-for="(emote, name) in customEmotes" :key="name" :src="emote.url" :title="name" class="emote-picker-img" @mousedown.prevent="insertEmote(name)">
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
    props: ['isLive'],
    setup(props) {
        const { ref, onMounted, onUnmounted, watch } = Vue;
        
        const activeSubView = ref('main');
        const statTimeframe = ref('week');
        const streamState = ref('awaiting'); 
        const countdownText = ref('--:--:--');
        const nextStreamTime = ref(null);
        
        const channelStats = ref({
            followers: '...', total_views: '...', avg_viewers: '...', peak_viewers: '...', active_subs: '...', account_created: '...',
            week_hours: '...', week_category: '...', week_days: '...',
            month_hours: '...', month_category: '...', month_days: '...',
            year_hours: '...', year_category: '...', year_days: '...'
        });
        
        let timerInterval;

        const updateClock = () => {
            if (props.isLive) {
                streamState.value = 'live';
                return;
            }
            if (!nextStreamTime.value) {
                streamState.value = 'awaiting';
                return;
            }
            let d = nextStreamTime.value - new Date().getTime();
            if (d < 0) {
                streamState.value = 'late';
            } else {
                streamState.value = 'future';
                let h = String(Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
                let m = String(Math.floor((d % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                let s = String(Math.floor((d % (1000 * 60)) / 1000)).padStart(2, '0');
                countdownText.value = h + ":" + m + ":" + s;
            }
        };

        onMounted(async () => {
            sbClient.from('channel_stats').select('*').eq('id', 1).single().then(({data}) => {
                if (data) channelStats.value = data;
            });

            try {
                const res = await fetch('https://yhxcuayiwqpjvalyrcqv.supabase.co/functions/v1/twitch-schedule');
                const d = await res.json();
                const schedEdges = d.data?.user?.channel?.schedule?.segments?.edges;
                if (schedEdges && schedEdges.length > 0) {
                    const now = Date.now();
                    const upcoming = schedEdges.find(e => {
                        if (!e.node.startAt) return false;
                        const estimatedEndTime = new Date(e.node.startAt).getTime() + (4 * 60 * 60 * 1000); 
                        return estimatedEndTime > now;
                    });
                    if (upcoming) {
                        nextStreamTime.value = new Date(upcoming.node.startAt).getTime();
                    }
                }
            } catch {}

            updateClock();
            timerInterval = setInterval(updateClock, 1000);
        });

        onUnmounted(() => { clearInterval(timerInterval); });
        watch(() => props.isLive, updateClock);

        return { activeSubView, statTimeframe, streamState, countdownText, channelStats };
    },
    template: `
        <div class="more-container" style="position: relative; height: 100%; width: 100%; background: var(--bg-color); overflow: hidden;">
            
            <div style="height: 100%; overflow-y: auto; padding: 0 16px 20px;" v-show="activeSubView === 'main'">
                
                <div v-if="streamState === 'future'" style="background: linear-gradient(135deg, rgba(145, 70, 255, 0.15), rgba(145, 70, 255, 0.05)); border: 1px solid rgba(145, 70, 255, 0.3); border-radius: 16px; padding: 20px; margin-bottom: 24px; margin-top: 8px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="color: var(--primary); font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <span class="material-symbols-rounded" style="font-size: 18px;">calendar_month</span> NEXT STREAM IN
                    </div>
                    <div style="font-size: 32px; font-weight: 900; font-variant-numeric: tabular-nums; letter-spacing: 2px; text-shadow: 0 0 10px rgba(145, 70, 255, 0.3); color: var(--text-main);">{{ countdownText }}</div>
                </div>

                <div v-else-if="streamState === 'late'" style="background: linear-gradient(135deg, rgba(255, 152, 0, 0.15), rgba(255, 152, 0, 0.05)); border: 1px solid rgba(255, 152, 0, 0.3); border-radius: 16px; padding: 20px; margin-bottom: 24px; margin-top: 8px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="color: var(--warning); font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <span class="material-symbols-rounded" style="font-size: 18px;">warning</span> Waiting for Broadcast
                    </div>
                    <div style="font-size: 22px; font-weight: 900; letter-spacing: 1px; color: var(--warning); text-shadow: 0 0 15px rgba(255, 152, 0, 0.4);">PREPARING SCUFF...</div>
                </div>

                <a v-else-if="streamState === 'live'" href="https://www.twitch.tv/codemiko" target="_blank" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(145, 70, 255, 0.05)); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 16px; padding: 20px; margin-bottom: 24px; margin-top: 8px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none;">
                    <div style="color: var(--danger); font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <span class="material-symbols-rounded" style="font-size: 18px;">podcasts</span> STREAM IS LIVE
                    </div>
                    <div style="font-size: 24px; font-weight: 900; letter-spacing: 1px; color: var(--danger); text-shadow: 0 0 15px rgba(239, 68, 68, 0.6);">EMBRACE THE CHAOS</div>
                </a>

                <div v-else-if="streamState === 'awaiting'" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; margin-bottom: 24px; margin-top: 8px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="color: var(--text-muted); font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <span class="material-symbols-rounded" style="font-size: 18px;">calendar_month</span> AWAITING SCHEDULE
                    </div>
                    <div style="font-size: 32px; font-weight: 900; font-variant-numeric: tabular-nums; letter-spacing: 2px; color: var(--text-muted);">--:--:--</div>
                </div>

                <div style="font-size: 12px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-muted); margin: 28px 0 10px 8px;">Explore</div>
                <button @click="activeSubView = 'about'" style="display: flex; align-items: center; width: 100%; padding: 0 16px; border-radius: 12px; min-height: 48px; background: var(--card-bg); border: 1px solid transparent; cursor: pointer; margin-bottom: 8px;">
                    <span class="material-symbols-rounded" style="color: #0085ff; width:24px; display:flex; justify-content:center;">info</span>
                    <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">About CodeMiko</span>
                    <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">chevron_right</span>
                </button>
                <button @click="activeSubView = 'stats'" style="display: flex; align-items: center; width: 100%; padding: 0 16px; border-radius: 12px; min-height: 48px; background: var(--card-bg); border: 1px solid transparent; cursor: pointer; margin-bottom: 8px;">
                    <span class="material-symbols-rounded" style="color: #ff9800; width:24px; display:flex; justify-content:center;">query_stats</span>
                    <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Channel Statistics</span>
                    <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 20px;">chevron_right</span>
                </button>

                <div style="font-size: 12px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-muted); margin: 28px 0 10px 8px;">Support</div>
                <a href="https://throne.com/codemiko" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 12px; min-height: 48px; background: var(--card-bg); text-decoration: none; margin-bottom: 8px;">
                    <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: #ef4444;"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-.84-3-2-3-1.22 0-2.42 1.55-3 2.52-.58-.97-1.78-2.52-3-2.52-1.16 0-2 1.34-2 3 0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 16H4V8h16v11z"/></svg>
                    <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Throne</span>
                    <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 16px;">open_in_new</span>
                </a>
                <a href="https://streamelements.com/codemiko/tip" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 12px; min-height: 48px; background: var(--card-bg); text-decoration: none; margin-bottom: 8px;">
                    <span class="material-symbols-rounded" style="color: #10B981; width:22px; text-align:center;">payments</span>
                    <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Tip Jar</span>
                    <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 16px;">open_in_new</span>
                </a>

                <div style="font-size: 12px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-muted); margin: 28px 0 10px 8px;">Social Links</div>
                <a href="https://www.twitch.tv/codemiko" target="_blank" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding: 0 16px; border-radius: 12px; min-height: 48px; background: var(--card-bg); text-decoration: none; margin-bottom: 8px;">
                    <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; color: #9146FF;"><path fill="currentColor" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
                    <span style="color: var(--text-main); font-size: 14px; font-weight: 600; margin-left: 12px;">Twitch</span>
                    <span class="material-symbols-rounded" style="color: var(--text-muted); margin-left: auto; font-size: 16px;">open_in_new</span>
                </a>
            </div>

            <transition name="nav-slide">
                <div v-if="activeSubView === 'about'" class="sub-view-overlay">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px; font-size: 18px; font-weight: bold; color: var(--text-main);">
                        <button @click="activeSubView = 'main'" style="background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-main); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <span class="material-symbols-rounded">arrow_back</span>
                        </button>
                        About CodeMiko
                    </div>
                    <div style="text-align: center; margin-bottom: 24px;">
                        <img src="https://raw.githubusercontent.com/meowoccino/MikoTok/main/1000018850.png" style="width: 110px; height: 110px; border-radius: 50%; margin-bottom: 12px;" alt="Avatar">
                        <h2 style="margin:0; color: var(--text-main);">CodeMiko</h2>
                        <div style="color:var(--text-muted); font-size:14px; margin-top:4px;">Youna Kang • VTuber & Dev</div>
                    </div>
                    <div style="color: var(--text-main); font-size: 14px; line-height: 1.6; background: var(--card-bg); padding: 16px; border-radius: 12px; margin-bottom: 16px; border: 1px solid var(--border-color);">
                        <div style="text-align: center; margin-bottom: 12px;"><strong style="color:var(--text-main);">The Glitch in the System</strong></div>
                        CodeMiko is a groundbreaking interactive VTuber project created and operated by "The Technician" (Youna Kang). Using a state-of-the-art Xsens full-body motion capture suit and Unreal Engine 5, Miko pushes the absolute boundaries of digital broadcasting.<br><br>
                        What makes the stream unique is its interactivity. Chatters can use Bits and channel points to directly trigger interactions, minigames, and catastrophic visual glitches on Miko's avatar in real-time.
                    </div>
                </div>
            </transition>

            <transition name="nav-slide">
                <div v-if="activeSubView === 'stats'" class="sub-view-overlay">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px; font-size: 18px; font-weight: bold; color: var(--text-main);">
                        <button @click="activeSubView = 'main'" style="background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-main); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <span class="material-symbols-rounded">arrow_back</span>
                        </button>
                        Channel Statistics
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
                        <div style="background: var(--card-bg); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid var(--border-color);">
                            <div style="font-size: 20px; font-weight: bold; color: var(--primary); margin-bottom: 4px;">{{ channelStats.followers }}</div>
                            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Followers</div>
                        </div>
                        <div style="background: var(--card-bg); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid var(--border-color);">
                            <div style="font-size: 20px; font-weight: bold; color: var(--primary); margin-bottom: 4px;">{{ channelStats.total_views }}</div>
                            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Total Views</div>
                        </div>
                        <div style="background: var(--card-bg); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid var(--border-color);">
                            <div style="font-size: 20px; font-weight: bold; color: var(--primary); margin-bottom: 4px;">{{ channelStats.avg_viewers }}</div>
                            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Avg Viewers</div>
                        </div>
                        <div style="background: var(--card-bg); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid var(--border-color);">
                            <div style="font-size: 20px; font-weight: bold; color: var(--primary); margin-bottom: 4px;">{{ channelStats.peak_viewers }}</div>
                            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">All-Time Peak</div>
                        </div>
                        <div style="background: var(--card-bg); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid var(--border-color);">
                            <div style="font-size: 20px; font-weight: bold; color: var(--primary); margin-bottom: 4px;">{{ channelStats.active_subs }}</div>
                            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Active Subs</div>
                        </div>
                        <div style="background: var(--card-bg); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; border: 1px solid var(--border-color);">
                            <div style="font-size: 16px; font-weight: bold; color: var(--primary); margin-top: 4px; margin-bottom: 4px;">{{ channelStats.account_created }}</div>
                            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Account Created</div>
                        </div>
                    </div>

                    <div style="font-size:12px; font-weight:bold; color:var(--primary); margin: 24px 0 12px 8px; text-transform:uppercase;">Recent Broadcasting</div>
                    
                    <div style="display: flex; gap: 8px; margin-bottom: 12px; background: rgba(145, 70, 255, 0.1); padding: 4px; border-radius: 8px;">
                        <button @click="statTimeframe = 'week'" :style="statTimeframe === 'week' ? 'background: var(--card-bg); color: var(--text-main); box-shadow: 0 2px 5px rgba(0,0,0,0.1);' : 'background: transparent; color: var(--text-muted);'" style="flex: 1; padding: 8px 0; text-align: center; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; border:none;">Week</button>
                        <button @click="statTimeframe = 'month'" :style="statTimeframe === 'month' ? 'background: var(--card-bg); color: var(--text-main); box-shadow: 0 2px 5px rgba(0,0,0,0.1);' : 'background: transparent; color: var(--text-muted);'" style="flex: 1; padding: 8px 0; text-align: center; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; border:none;">Month</button>
                        <button @click="statTimeframe = 'year'" :style="statTimeframe === 'year' ? 'background: var(--card-bg); color: var(--text-main); box-shadow: 0 2px 5px rgba(0,0,0,0.1);' : 'background: transparent; color: var(--text-muted);'" style="flex: 1; padding: 8px 0; text-align: center; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; border:none;">Year</button>
                    </div>

                    <div v-if="statTimeframe === 'week'" style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="background: var(--card-bg); padding: 12px 16px; border-radius: 10px; display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); border: 1px solid var(--border-color);"><span>Hours Streamed</span><strong style="color: var(--text-main);">{{ channelStats.week_hours }} Hours</strong></div>
                        <div style="background: var(--card-bg); padding: 12px 16px; border-radius: 10px; display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); border: 1px solid var(--border-color);"><span>Top Category</span><strong style="color: var(--text-main);">{{ channelStats.week_category }}</strong></div>
                        <div style="background: var(--card-bg); padding: 12px 16px; border-radius: 10px; display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); border: 1px solid var(--border-color);"><span>Active Days</span><strong style="color: var(--text-main);">{{ channelStats.week_days }} days / week</strong></div>
                    </div>
                    <div v-if="statTimeframe === 'month'" style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="background: var(--card-bg); padding: 12px 16px; border-radius: 10px; display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); border: 1px solid var(--border-color);"><span>Hours Streamed</span><strong style="color: var(--text-main);">{{ channelStats.month_hours }} Hours</strong></div>
                        <div style="background: var(--card-bg); padding: 12px 16px; border-radius: 10px; display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); border: 1px solid var(--border-color);"><span>Top Category</span><strong style="color: var(--text-main);">{{ channelStats.month_category }}</strong></div>
                        <div style="background: var(--card-bg); padding: 12px 16px; border-radius: 10px; display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); border: 1px solid var(--border-color);"><span>Active Days</span><strong style="color: var(--text-main);">{{ channelStats.month_days }} days / week</strong></div>
                    </div>
                    <div v-if="statTimeframe === 'year'" style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="background: var(--card-bg); padding: 12px 16px; border-radius: 10px; display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); border: 1px solid var(--border-color);"><span>Hours Streamed</span><strong style="color: var(--text-main);">{{ channelStats.year_hours }} Hours</strong></div>
                        <div style="background: var(--card-bg); padding: 12px 16px; border-radius: 10px; display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); border: 1px solid var(--border-color);"><span>Top Category</span><strong style="color: var(--text-main);">{{ channelStats.year_category }}</strong></div>
                        <div style="background: var(--card-bg); padding: 12px 16px; border-radius: 10px; display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); border: 1px solid var(--border-color);"><span>Active Days</span><strong style="color: var(--text-main);">{{ channelStats.year_days }} days / week</strong></div>
                    </div>
                </div>
            </transition>
        </div>
    `
};

const HomeView = {
    props: ['currentTab', 'currentVodIndex', 'recentVods', 'isLive', 'hostname', 'clips', 'activeFilterLabel', 'optimizeTwitchImg', 'formatViews', 'formatDate', 'activeClipId'],
    template: `
        <div style="flex: 1; overflow-y: auto; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; padding-bottom: 20px;" @scroll="$emit('home-scroll', $event)" id="home-scroll-element">
            <div class="hero-section">
                <div class="header-controls" style="margin-bottom:12px; display:flex;">
                    <div :class="['premium-badge', isLive ? 'live-badge' : 'vod']">
                        <div class="dot"></div>
                        <span>{{ isLive ? 'LIVE' : (recentVods[currentVodIndex] ? 'VOD • ' + recentVods[currentVodIndex].date : 'PAST STREAM') }}</span>
                    </div>
                </div>
                <div class="video-wrapper-outer">
                    <div class="video-container">
                        <iframe v-if="currentVodIndex === -1" id="miko-live-player" :src="'https://player.twitch.tv/?channel=codemiko&parent=' + hostname + '&autoplay=true&muted=true'" allow="autoplay; fullscreen" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>
                        <iframe v-else-if="recentVods && recentVods[currentVodIndex]" :src="'https://player.twitch.tv/?video=' + recentVods[currentVodIndex].id + '&parent=' + hostname + '&autoplay=false'" allow="autoplay; fullscreen" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>
                    </div>
                </div>
                <div class="carousel-controls" v-if="recentVods && recentVods.length > 0 && !isLive" style="margin-top:12px; justify-content:flex-end;">
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
        const modals = ref({ profile: false });
        const isLive = ref(false);
        const currentUser = ref(null);
        
        const loginEmail = ref('');
        const loginPass = ref('');
        const loginError = ref(''); 
        
        const hostname = window.location.hostname || 'meowoccino.github.io';
        const syncState = ref('Refresh Feed');
        const wipeState = ref('Wipe Gerald Memory');
        const logoutState = ref('Sign Out');
        const nukeState = ref('Nuke App Cache');
        
        const apiConfig = ref({});
        const saveState = ref('');
        
        const isHeaderVisible = ref(true);
        const geminiStatus = ref('TESTING BRAIN...');
        const sysStats = ref({ cpu: 23, mem: 1.8, temp: 74 });

        const activeClipId = ref(null);
        const currentClipOffset = ref(0);
        const isLoadingMore = ref(false);
        const allClipsLoaded = ref(false);
        
        const customEmotes = ref({});

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
            document.documentElement.style.colorScheme = appTheme.value;
            const bgHex = appTheme.value === 'light' ? '#f8f9fa' : '#0d0d11';
            
            let metaTheme = document.querySelector('meta[name="theme-color"]');
            if (!metaTheme) {
                metaTheme = document.createElement('meta');
                metaTheme.name = "theme-color";
                document.head.appendChild(metaTheme);
            }
            metaTheme.setAttribute('content', bgHex);
            document.body.style.backgroundColor = bgHex;
            document.documentElement.style.backgroundColor = bgHex;
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
            const dx = e.changedTouches[0].clientX - swipeStartX;
            if (Math.abs(dx) < 50) return;
            const idx = tabOrder.indexOf(currentTab.value);
            if (dx < 0 && idx < tabOrder.length - 1) switchTab(tabOrder[idx + 1]);
            if (dx > 0 && idx > 0) switchTab(tabOrder[idx - 1]);
        };

        let modalDragStartY = 0;
        const handleModalTouchStart = (e) => { modalDragStartY = e.touches[0].clientY; };
        const handleModalTouchMove = () => {};
        const handleModalTouchEnd = (e) => {
            const dy = e.changedTouches[0].clientY - modalDragStartY;
            if (dy > 80) modals.value.profile = false;
        };

        const toggleTheme = () => { appTheme.value = appTheme.value === 'light' ? 'dark' : 'light'; localStorage.setItem('miko_theme', appTheme.value); updateThemeClass(); };

        const loadEmotesFromSupabase = async () => {
            try {
                let fetchMore = true;
                let currentOffset = 0;
                const step = 1000;

                while (fetchMore) {
                    const { data } = await sbClient.from('emotes').select('name,url').range(currentOffset, currentOffset + step - 1);
                    if (data && data.length > 0) {
                        data.forEach(item => { if (item.url) { customEmotes.value[item.name] = { url: item.url }; } });
                        currentOffset += step;
                        if (data.length < step) fetchMore = false;
                    } else { fetchMore = false; }
                }
            } catch (e) {}
        };

        const testGeminiBrain = async () => {
            try {
                const { data, error } = await sbClient.functions.invoke('gerald-chat', { body: { history: [{ role: 'user', parts: [{ text: 'ping' }] }] } });
                geminiStatus.value = (!error && data && data.reply) ? 'API_CONNECTED' : 'API_DISCONNECTED';
            } catch { geminiStatus.value = 'API_DISCONNECTED'; }
        };

        const checkLive = async () => {
            try {
                const res = await fetch('https://decapi.me/twitch/uptime/codemiko');
                isLive.value = !(await res.text()).includes('offline');
                const gql = await fetch('https://yhxcuayiwqpjvalyrcqv.supabase.co/functions/v1/twitch-schedule');
                const edges = (await gql.json()).data?.user?.videos?.edges || [];
                recentVods.value = edges.map(e => ({ id: e.node.id, date: new Date(e.node.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() }));
                if (currentVodIndex.value === 0 || currentVodIndex.value === -1) currentVodIndex.value = isLive.value ? -1 : 0;
            } catch {}
        };
        
        const loadData = async (isLoadMore = false) => {
            if (isLoadingMore.value || allClipsLoaded.value) return; isLoadingMore.value = true;
            try {
                if (!isLoadMore) {
                    currentClipOffset.value = 0; allClipsLoaded.value = false; allClips.value = [];
                }
                
                let query = sbClient.from('clips').select('*');
                
                if (currentFilter.value === 'latest') {
                    query = query.order('created_at', { ascending: false });
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

                const fetchAmount = isLoadMore ? 25 : 24;
                const { data: c } = await query.range(currentClipOffset.value, currentClipOffset.value + fetchAmount);
                if (c && c.length > 0) { allClips.value.push(...c); currentClipOffset.value += fetchAmount + 1; clips.value = allClips.value; }
                else { allClipsLoaded.value = true; }
            } catch {} finally { isLoadingMore.value = false; }
        };

        const handleScroll = (e) => {
            const st = e.target.scrollTop;
            if (st > lastScrollTop && st > 50) {
                isHeaderVisible.value = false;
            } else if (st < lastScrollTop) {
                isHeaderVisible.value = true;
            }
            lastScrollTop = st <= 0 ? 0 : st;

            if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 200) { 
                if (currentTab.value === 'home') loadData(true); 
            }
        };
        
        let lastScrollTop = 0;

        const handleLogin = async () => {
            if (!loginEmail.value || !loginPass.value) { loginError.value = "Missing credentials."; return; }
            try {
                const { data, error } = await sbClient.auth.signInWithPassword({ email: loginEmail.value, password: loginPass.value });
                if (error) { loginError.value = error.message; return; }
                if (data?.user) { currentUser.value = data.user; modals.value.profile = false; loginEmail.value = ''; loginPass.value = ''; }
            } catch { loginError.value = "System login failure."; }
        };

        const handleLogout = async () => { logoutState.value = 'LOGGING OUT...'; await sbClient.auth.signOut(); currentUser.value = null; modals.value.profile = false; logoutState.value = 'Sign Out'; };
        const runSync = async () => { syncState.value = 'REFRESHING...'; await loadData(false); syncState.value = 'SUCCESS'; setTimeout(() => syncState.value = 'Refresh Feed', 1500); };
        const clearGeraldHistory = async () => { wipeState.value = 'WIPING...'; geraldMessages.value = [{ role: 'gerald', content: '' }]; wipeState.value = 'SUCCESS'; setTimeout(() => wipeState.value = 'Wipe Gerald Memory', 1500); };
        const nukeCache = () => { nukeState.value = 'NUKING...'; localStorage.clear(); caches.keys().then(names => { for (let n of names) caches.delete(n); }); nukeState.value = 'SUCCESS'; setTimeout(() => window.location.reload(), 1000); };

        const talkToGerald = async () => {
            const inputEl = document.getElementById('gerald-txt-input');
            if (inputEl && inputEl.value !== geraldInput.value) { geraldInput.value = inputEl.value; }
            if (!geraldInput.value.trim() || isGeraldTyping.value) return;

            const userMsg = geraldInput.value;
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

            const geminiHistory = geraldMessages.value.slice(-12).map(m => ({ role: m.role === 'gerald' ? 'model' : 'user', parts: [{ text: m.content }] }));

            try {
                const { data, error } = await sbClient.functions.invoke('gerald-chat', { 
                    body: { history: geminiHistory, system_directive: getGeraldSystemDirective(customEmotes.value) } 
                });
                if (!error && data?.reply) {
                    let formattedReply = enforceGrammar(data.reply.trim());
                    geraldMessages.value.push({ role: 'gerald', content: formattedReply });
                    if (currentUser.value) {
                        sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'gerald', content: formattedReply }).then();
                    }
                } else throw error;
            } catch { geraldMessages.value.push({ role: 'gerald', content: 'SYSTEM FAILURE: Core sync interrupted.' }); }
            finally { isGeraldTyping.value = false; nextTick(() => { if(b) b.scrollTop = b.scrollHeight; }); }
        };

        const triggerAiMinigame = (gameObj) => {
            geraldInput.value = "";
            showEmotePicker.value = false;
            showMinigames.value = false;
            
            const logMsg = `**[EVENT: ${gameObj.label} Protocol Activated]**`;
            geraldMessages.value.push({ role: 'user', content: logMsg });
            
            if (currentUser.value) {
                sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'user', content: logMsg }).then();
            }
            
            isGeraldTyping.value = true;
            nextTick(() => { const b = document.getElementById('gerald-msgs'); if(b) b.scrollTop = b.scrollHeight; });

            const contextHistory = geraldMessages.value.slice(-10).map(m => ({ role: m.role === 'gerald' ? 'model' : 'user', parts: [{ text: m.content }] }));

            sbClient.functions.invoke('gerald-chat', { 
                body: { history: contextHistory, system_directive: getGeraldSystemDirective(customEmotes.value, gameObj.prompt) } 
            }).then(({ data, error }) => {
                if (!error && data?.reply) {
                    let formattedReply = enforceGrammar(data.reply.trim());
                    geraldMessages.value.push({ role: 'gerald', content: formattedReply });
                    if (currentUser.value) {
                        sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'gerald', content: formattedReply }).then();
                    }
                } else {
                    geraldMessages.value.push({ role: 'gerald', content: 'MALFUNCTION: Internal hardware override processing failure.' });
                }
            }).catch(() => {
                geraldMessages.value.push({ role: 'gerald', content: 'MALFUNCTION: Core logic offline.' });
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
                if (sessionData?.session?.user) currentUser.value = sessionData.session.user;
                sbClient.auth.onAuthStateChange((event, session) => { currentUser.value = session?.user || null; });
            });

            Promise.all([
                loadEmotesFromSupabase(),
                loadData(),
                checkLive(),
                testGeminiBrain()
            ]).then(() => {
                splashOpacity.value = 0; 
                setTimeout(() => { splashVisible.value = false; }, 300);
            });

            setInterval(() => {
                sysStats.value.cpu = Math.floor(15 + Math.random() * 25);
                sysStats.value.temp = Math.floor(71 + Math.random() * 8);
            }, 4000);
        });

        return {
            hostname, splashVisible, splashOpacity, currentTab, tabOffset, appTheme, toggleTheme, clips, currentUser, loginEmail, loginPass, loginError, geraldInput, geraldMessages, isGeraldTyping, syncState, wipeState, logoutState, nukeState, isHeaderVisible, currentFilter, activeFilterLabel, isFilterMenuOpen, recentVods, currentVodIndex, customEmotes, showEmotePicker, showMinigames, activeClipId, switchTab, geminiStatus, sysStats, handleSwipeStart, handleSwipeEnd, handleModalTouchStart, handleModalTouchMove, handleModalTouchEnd, handleScroll, apiConfig, saveState, selectedClip, modals,
            logoSvg: (id) => `<svg viewBox="0 0 100 100"><defs><linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9146FF"/><stop offset="100%" stop-color="#a970ff"/></linearGradient></defs><circle cx="50" cy="50" r="40" fill="url(#grad-${id})"/><path d="M 33 38 L 48 62 L 62 38 L 62 55 Q 62 65 69 64" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            optimizeTwitchImg: (u) => u ? u.replace('%{width}', '480').replace('%{height}', '270') : '',
            formatViews: (v) => v ? v.toLocaleString() : '0',
            formatDate: (d) => new Date(d).toLocaleDateString([], {month:'short', day:'numeric'}),
            closeFilterMenu: () => { isFilterMenuOpen.value = false; },
            applyFilter: (key, label) => {
                currentFilter.value = key; activeFilterLabel.value = label; isFilterMenuOpen.value = false;
                allClipsLoaded.value = false; allClips.value = []; currentClipOffset.value = 0;
                loadData(false);
            },
            prevVod: () => { if (currentVodIndex.value > (isLive.value ? -1 : 0)) currentVodIndex.value--; },
            nextVod: () => { if (currentVodIndex.value < recentVods.value.length - 1) currentVodIndex.value++; },
            playClip: (clip) => { selectedClip.value = clip; },
            handleLogin, handleLogout, runSync, clearGeraldHistory, nukeCache, talkToGerald, triggerAiMinigame,
            closePickers: () => { showEmotePicker.value = false; showMinigames.value = false; },
            insertEmote: (name) => { geraldInput.value += ' ' + name + ' '; showEmotePicker.value = false; },
            toggleEmotes: () => { showEmotePicker.value = !showEmotePicker.value; showMinigames.value = false; },
            toggleMinigames: () => { showMinigames.value = !showMinigames.value; showEmotePicker.value = false; },
            handleGeraldEnter: (e) => { if (!e.shiftKey && e.key === 'Enter') { e.preventDefault(); talkToGerald(); } }
        };
    }
}).mount('#app-container');
