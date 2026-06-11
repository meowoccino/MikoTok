const ToastPopup = {
    props: ['toast'],
    template: `
        <div class="toast-popup" :class="{ show: toast.visible }" v-html="toast.message"></div>
    `
};

const SplashScreen = {
    props: ['splashVisible', 'splashOpacity', 'logoSvg'],
    template: `
        <div id="splash-screen" v-if="splashVisible" :style="{ opacity: splashOpacity }">
            <div style="width:100px;height:100px;margin-bottom:20px;" v-html="logoSvg('splash')"></div>
            <div class="header-title" style="font-size: 32px; font-weight: 900;">MikoTok</div>
            <div class="progress-bar"><div class="progress-fill"></div></div>
        </div>
    `
};

const AppHeader = {
    props: ['isHeaderVisible', 'currentTab', 'logoSvg', 'appTheme'],
    template: `
        <header class="app-header" :class="{ hidden: !isHeaderVisible }">
            <div style="display:flex; align-items:center; gap:8px;">
                <div style="width:24px;height:24px; cursor:pointer;" v-html="logoSvg('header')" @click="$emit('open-profile')"></div>
                <span class="header-title" style="font-size:18px; font-weight:900;">MikoTok</span>
            </div>
            <button class="theme-toggle-btn" @click="$emit('toggle-theme')">
                <span class="material-symbols-rounded" style="font-size: 22px;">{{ appTheme === 'light' ? 'dark_mode' : 'light_mode' }}</span>
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
    props: ['isOpen', 'currentUser', 'loginEmail', 'loginPass', 'apiConfig', 'syncState', 'wipeState', 'logoutState'],
    template: `
        <div class="modal-overlay" :class="{ open: isOpen }" @click.self="$emit('close')">
            <div class="modal-content" @touchstart="$emit('touch-start', $event)" @touchmove="$emit('touch-move', $event)" @touchend="$emit('touch-end', $event)">
                <div class="drag-handle"></div>
                <div v-if="!currentUser">
                    <input type="text" :value="loginEmail" @change="$emit('update-email', $event.target.value)" class="input-box" style="margin-top: 10px;" placeholder="Email">
                    <input type="password" :value="loginPass" @change="$emit('update-pass', $event.target.value)" class="input-box" @keyup.enter="$emit('login')" placeholder="Password">
                    <button class="sync-btn" @click="$emit('login')">LOGIN</button>
                </div>
                <div v-else>
                    <div class="infra-bar"><div class="status-node"><div class="pulse"></div> SYSTEM: READY</div></div>
                    <div class="stat-grid">
                        <a href="https://supabase.com/dashboard/project/yhxcuayiwqpjvalyrcqv" target="_blank" class="external-link-btn" style="color:var(--success)"><span class="material-symbols-rounded">database</span>Supabase DB</a>
                        <a href="https://github.com/meowoccino/MikoTok" target="_blank" class="external-link-btn"><span class="material-symbols-rounded">code</span>GitHub Repo</a>
                    </div>
                    <div class="settings-block">
                        <div class="block-title">TWITCH API CONFIG</div>
                        <input type="text" class="sleek-input" :value="apiConfig.cid" @change="$emit('update-api', 'cid', $event.target.value)" placeholder="Client ID">
                        <input type="password" class="sleek-input" :value="apiConfig.tkn" @change="$emit('update-api', 'tkn', $event.target.value)" placeholder="Access Token">
                    </div>
                    <div class="action-menu">
                        <button class="menu-btn logout-row" @click="$emit('logout')" :disabled="logoutState !== 'idle'">
                            <div class="btn-content">
                                <div class="icon-wrap"><span class="material-symbols-rounded" :class="{'spin-anim': logoutState === 'logging_out'}" style="font-size: 18px;">{{ logoutState === 'logging_out' ? 'hourglass_empty' : 'logout' }}</span></div>
                                <span>{{ logoutState === 'logging_out' ? 'SIGNING OUT...' : 'Sign Out' }}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};

const ChatView = {
    props: ['currentTab', 'chatMessages', 'chatInput', 'isLoggedIn', 'twitchAuthUrl'],
    template: `
        <div class="chat-wrapper">
            <div class="twitch-chat-list" id="twitch-chat-list">
                <div v-if="!isLoggedIn" class="chat-login-prompt">
                    <span class="material-symbols-rounded" style="font-size:48px; color:var(--primary); margin-bottom:10px;">login</span>
                    <p style="color:var(--text-main); font-weight:700; margin-bottom:15px;">Login to chat and use emotes.</p>
                    <a :href="twitchAuthUrl" class="twitch-login-btn">Connect Twitch</a>
                </div>
                <div v-for="(msg, i) in chatMessages" :key="i" class="twitch-msg-row">
                    <span class="twitch-username" :style="{color: msg.color}">{{ msg.username }}</span>
                    <span class="twitch-text" v-html="msg.html"></span>
                </div>
            </div>
            <div class="custom-chat-input-area">
                <input type="text" class="custom-chat-input" placeholder="Send a message..." :value="chatInput" @input="$emit('update-input', $event.target.value)" @keydown.enter="$emit('send-chat')" :disabled="!isLoggedIn">
                <button class="icon-btn" @click="$emit('send-chat')" :disabled="!isLoggedIn || !chatInput.trim()">
                    <span class="material-symbols-rounded" style="font-size: 20px;">send</span>
                </button>
            </div>
        </div>
    `
};

const MoreView = {
    template: `
        <div class="more-container">
            <div class="more-header">Official Links</div>
            <div class="social-grid">
                <a href="https://www.youtube.com/@CodeMiko" target="_blank" class="social-card yt">
                    <svg viewBox="0 0 24 24" class="social-icon"><path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span>YouTube</span>
                </a>
                <a href="https://www.twitch.tv/codemiko" target="_blank" class="social-card twitch">
                    <svg viewBox="0 0 24 24" class="social-icon"><path fill="currentColor" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
                    <span>Twitch</span>
                </a>
                <a href="https://x.com/thecodemiko" target="_blank" class="social-card x-twitter">
                    <svg viewBox="0 0 24 24" class="social-icon"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <span>X (Twitter)</span>
                </a>
                <a href="https://www.instagram.com/thecodemiko/" target="_blank" class="social-card instagram">
                    <svg viewBox="0 0 24 24" class="social-icon"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                    <span>Instagram</span>
                </a>
                <a href="https://www.reddit.com/r/CodeMiko/" target="_blank" class="social-card reddit">
                    <svg viewBox="0 0 24 24" class="social-icon"><path fill="currentColor" d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-6.07-1.72.08-1.1.4-3.05 1.52-3.7.72-.4 1.73-.24 3 .5C17.2 6.3 18.46 7.5 20 7.5c1.65 0 3-1.35 3-3s-1.35-3-3-3c-1.38 0-2.54.94-2.88 2.22-1.43-.72-2.64-.8-3.6-.25-1.64.94-1.95 3.47-2 4.55-2.33.08-4.45.7-6.1 1.72C4.86 8.98 3.96 8.5 3 8.5c-1.65 0-3 1.35-3 3 0 1.32.84 2.44 2.05 2.84-.03.22-.05.44-.05.66 0 3.86 4.5 7 10 7s10-3.14 10-7c0-.22-.02-.44-.05-.66 1.2-.4 2.05-1.54 2.05-2.84zM2.3 13.37C1.5 13.07 1 12.35 1 11.5c0-1.1.9-2 2-2 .64 0 1.22.32 1.6.82-1.1.85-1.92 1.9-2.3 3.05zm3.7.13c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9.8 4.8c-1.08.63-2.42.96-3.8.96-1.4 0-2.74-.34-3.8-.95-.24-.13-.32-.44-.2-.68.15-.24.46-.32.7-.18 1.83 1.06 4.76 1.06 6.6 0 .23-.13.53-.05.67.2.14.23.06.54-.18.67zm.2-2.8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5.7-2.13c-.38-1.16-1.2-2.2-2.3-3.05.38-.5.96-.82 1.6-.82 1.1 0 2 .9 2 2 0 .84-.53 1.57-1.3 1.87z"/></svg>
                    <span>Reddit</span>
                </a>
                <a href="https://app.fanfix.io/@codeyuna" target="_blank" class="social-card fanfix">
                    <span class="material-symbols-rounded social-icon" style="font-size: 28px;">favorite</span>
                    <span>Fanfix</span>
                </a>
            </div>
        </div>
    `
};

const GeraldView = {
    props: ['currentTab', 'geraldMessages', 'isGeraldTyping', 'geraldInput', 'showEmotePicker', 'showMinigames', 'customEmotes', 'parseMarkdown', 'apiConnected'],
    template: `
        <div class="gerald-container">
            <div class="gerald-header" @click="$emit('close-pickers')">
                <div class="gerald-avatar-wrapper">
                    <img src="gerald.png" class="gerald-avatar" alt="Gerald">
                    <div class="gerald-title-block">
                        <span class="gerald-name-text">Gerald OS</span>
                        <div :class="apiConnected ? 'pulse-dot-live' : 'pulse-dot-offline'"></div>
                    </div>
                </div>
            </div>
            <div class="gerald-messages" id="gerald-msgs" @click="$emit('close-pickers')">
                <template v-for="(m, i) in geraldMessages" :key="i">
                    <div v-if="i === 0 && m.role === 'gerald'" class="terminal-intro">
                        <div class="terminal-text">> Human detected.<br>> State your inquiry.</div>
                        <div class="gerald-system-card startup-anim">
                            <div class="gerald-sys-row"><span class="sys-label">CORE:</span> <span class="sys-value">ONLINE</span></div>
                            <div class="gerald-sys-row"><span class="sys-label">MOOD:</span> <span class="sys-value">SARCASTIC</span></div>
                            <div class="gerald-sys-row"><span class="sys-label">PATIENCE:</span> <span class="sys-value">125ms</span></div>
                        </div>
                    </div>
                    <div v-else class="chat-bubble" :class="m.role" v-html="parseMarkdown(m.content)"></div>
                </template>
                <div v-if="isGeraldTyping" key="typing" class="typing-indicator">COMPUTING...</div>
            </div>
            <div class="gerald-action-area">
                <transition name="tray">
                    <div class="tray-container" v-show="showEmotePicker">
                        <img v-for="(emote, name) in customEmotes" :key="name" :src="emote.url ? emote.url : 'https://cdn.discordapp.com/emojis/' + emote.id + '.' + (emote.animated ? 'gif' : 'png') + '?size=44'" class="emote-picker-img" @click="$emit('insert-emote', name)">
                    </div>
                </transition>
                <transition name="tray">
                    <div class="tray-container" v-show="showMinigames">
                        <button class="bribe-btn" @click="$emit('play-game', 'glitch')">🕶️ Glitch Persona</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'shader')">🔥 Compile UE5</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'boba')">🥤 Boba Spill</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'pineapple')">🚪 Pineapple Walk-In</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'cat')">🐈 Cat on PC</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'bits')">🎟️ 100K Bits</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'mute')">🔇 Mute Mic</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'bald')">🧑‍🦲 Delete Hair</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'siren')">🚨 Firetruck Siren</button>
                    </div>
                </transition>
                <div class="gerald-input-area">
                    <div class="gerald-input-wrapper">
                        <button class="emote-toggle-btn" @click="$emit('toggle-emotes')"><span class="material-symbols-rounded" :style="{ color: showEmotePicker ? 'var(--primary)' : 'inherit' }">mood</span></button>
                        <button class="emote-toggle-btn" @click="$emit('toggle-minigames')"><span class="material-symbols-rounded" :style="{ color: showMinigames ? 'var(--primary)' : 'inherit' }">sports_esports</span></button>
                        <textarea class="gerald-input" rows="1" placeholder="Message Gerald..." :value="geraldInput" @input="$emit('update-input', $event.target.value)" @keydown="$emit('key-down', $event)" id="gerald-txt-input" @focus="$emit('close-pickers')"></textarea>
                    </div>
                    <button class="gerald-send" @click="$emit('send')"><span class="material-symbols-rounded">send</span></button>
                </div>
            </div>
        </div>
    `
};

const HomeView = {
    props: ['currentTab', 'currentVodIndex', 'recentVods', 'isLive', 'hostname', 'clips', 'activeFilterLabel', 'optimizeTwitchImg', 'formatViews', 'formatDate', 'activeClipId'],
    template: `
        <div class="hero-section">
            <div class="header-controls" style="margin-bottom: 12px; display: flex; justify-content: flex-start;" v-if="!isLive">
                <div class="premium-badge vod" v-if="recentVods && recentVods.length > 0">
                    <div class="dot"></div><span>{{ recentVods[currentVodIndex] ? ('VOD • ' + recentVods[currentVodIndex].date) : 'PAST BROADCAST' }}</span>
                </div>
            </div>
            <div class="video-container" style="border-radius:12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <iframe v-if="currentVodIndex === -1" id="miko-live-player" :src="'https://player.twitch.tv/?channel=codemiko&parent=' + hostname + '&autoplay=true&muted=true'" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>
                <iframe v-else-if="recentVods && recentVods[currentVodIndex]" :src="'https://player.twitch.tv/?video=' + recentVods[currentVodIndex].id + '&parent=' + hostname + '&autoplay=true&muted=true'" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>
            </div>
            <div class="carousel-controls" v-if="recentVods && recentVods.length > 0 && !isLive" style="margin-top: 12px; justify-content: flex-end;">
                <button class="carousel-btn" :class="{ 'hidden-arrow': currentVodIndex <= 0 }" @click.stop="$emit('prev-vod')"><span class="material-symbols-rounded">chevron_left</span></button>
                <button class="carousel-btn" :class="{ 'hidden-arrow': currentVodIndex >= recentVods.length - 1 }" @click.stop="$emit('next-vod')"><span class="material-symbols-rounded">chevron_right</span></button>
            </div>
        </div>
        <div class="clips-list-container">
            <div class="clips-header">
                <div class="filter-wrapper">
                    <button class="filter-btn-tiny" @click="$emit('open-filter')">
                        <span class="material-symbols-rounded" style="font-size: 16px;">sort</span><span>{{ activeFilterLabel }}</span>
                    </button>
                </div>
            </div>
            <div class="clip-list-item" v-for="clip in clips" :key="clip.id" @click="$emit('play-clip', clip)">
                <div class="clip-thumb-wrapper">
                    <img :src="clip.thumbnail_url ? optimizeTwitchImg(clip.thumbnail_url) : ''" loading="lazy" alt="Thumbnail">
                    <iframe v-if="activeClipId === clip.id" :src="'https://clips.twitch.tv/embed?clip=' + clip.id + '&parent=' + hostname + '&autoplay=true&muted=false'" allow="autoplay; fullscreen" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 5;"></iframe>
                    <div class="duration-badge">0:45</div>
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
    `
};

const { createApp, ref, onMounted, nextTick, watch, computed } = Vue;
const sbClient = supabase.createClient('https://yhxcuayiwqpjvalyrcqv.supabase.co', 'sb_publishable_VyFcNARHblJg10qlC_O7Dg_coouXK92');

createApp({
    components: {
        ToastPopup, SplashScreen, AppHeader, BottomNav, FilterMenu, 
        ProfileModal, GeraldView, HomeView, ChatView, MoreView
    },
    setup() {
        const tabs = ['home', 'chat', 'gerald', 'more'];
        const initialHash = window.location.hash.replace('#', '');
        const currentTab = ref(tabs.includes(initialHash) ? initialHash : 'home');
        
        const tabOffset = computed(() => {
            const index = tabs.indexOf(currentTab.value);
            return -(index * 25);
        });

        const appTheme = ref(localStorage.getItem('miko_theme') || 'light');
        const splashVisible = ref(true), splashOpacity = ref(1), clips = ref([]), allClips = ref([]), modals = ref({profile: false, discord: false}), isLive = ref(false), currentUser = ref(null), loginEmail = ref(''), loginPass = ref(''), toast = ref({visible: false, message: ''}), hostname = window.location.hostname || 'meowoccino.github.io';
        const syncState = ref('idle'), wipeState = ref('idle'), logoutState = ref('idle');
        const apiConfig = ref({ cid: localStorage.getItem('twitch_cid') || '', tkn: localStorage.getItem('twitch_tkn') || '' });
        
        const customEmotes = ref({
            "mkoSusge": { id: "1273724925743595540", animated: false }, "KEKW": { id: "1456296327964262453", animated: false }, "mkoNOTED": { id: "1369891690898391070", animated: false }, "mkoHype": { id: "870761283035734086", animated: false }, "Shruge": { id: "1456297412875518078", animated: false }, "Bedge": { id: "1369823782084022423", animated: false }, "mkoCoffee": { id: "1369891686544834570", animated: false }, "D_": { id: "1456295688626241619", animated: false }, "mkoLove": { id: "1150505635721519115", animated: false }
        });

        const geraldInput = ref(''), geraldMessages = ref([{role:'gerald', content: ''}]), isGeraldTyping = ref(false), showEmotePicker = ref(false), showMinigames = ref(false);
        const currentFilter = ref('latest'), activeFilterLabel = ref('Latest'), isFilterMenuOpen = ref(false);
        const recentVods = ref([]), currentVodIndex = ref(0);
        
        const activeClipId = ref(null);
        const chatMessages = ref([]);
        const chatInput = ref('');
        const twitchChatToken = ref(localStorage.getItem('tw_chat_token') || null);
        const twitchAuthUrl = ref('');
        let twitchWs = null;

        let touchStartX = 0;
        const handleSwipeStart = (e) => { touchStartX = e.touches[0].clientX; };
        const handleSwipeEnd = (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            const threshold = 60;
            const currentIndex = tabs.indexOf(currentTab.value);
            
            if (diff > threshold && currentIndex < tabs.length - 1) {
                switchTab(tabs[currentIndex + 1]);
            } else if (diff < -threshold && currentIndex > 0) {
                switchTab(tabs[currentIndex - 1]);
            }
        };

        const switchTab = (tab) => {
            currentTab.value = tab;
            window.history.pushState(null, '', `#${tab}`);
            if (tab === 'chat') { setTimeout(() => { const list = document.getElementById('twitch-chat-list'); if (list) list.scrollTop = list.scrollHeight; }, 100); }
            if (tab === 'gerald') { setTimeout(scrollToBottom, 50); }
        };

        const updateThemeClass = () => {
            const body = document.body;
            body.className = '';
            body.classList.add('theme-' + appTheme.value);
            const metaTheme = document.querySelector('meta[name="theme-color"]');
            if (metaTheme) {
                metaTheme.setAttribute('content', appTheme.value === 'light' ? '#f8f9fa' : '#0d0d11');
            }
        };

        const toggleTheme = () => {
            appTheme.value = appTheme.value === 'light' ? 'dark' : 'light';
            localStorage.setItem('miko_theme', appTheme.value);
            updateThemeClass();
        };

        const connectTwitchChat = () => {
            if (twitchWs) { try { twitchWs.close(); } catch(e){} }
            twitchWs = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
            twitchWs.onopen = () => {
                twitchWs.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
                if (twitchChatToken.value) {
                    twitchWs.send(`PASS oauth:${twitchChatToken.value}`);
                    fetch('https://id.twitch.tv/oauth2/validate', { headers: { 'Authorization': `OAuth ${twitchChatToken.value}` } })
                        .then(res => res.json())
                        .then(data => {
                            if(data.login) { twitchWs.send(`NICK ${data.login}`); twitchWs.send('JOIN #codemiko'); }
                        }).catch(() => { twitchWs.send('NICK justinfan123'); twitchWs.send('JOIN #codemiko'); });
                } else {
                    twitchWs.send('PASS oauth:anonymous');
                    twitchWs.send('NICK justinfan12345');
                    twitchWs.send('JOIN #codemiko');
                }
            };

            twitchWs.onmessage = (event) => {
                const msgs = event.data.split('\r\n');
                msgs.forEach(message => {
                    if (message.startsWith('PING')) { twitchWs.send('PONG :tmi.twitch.tv'); return; }
                    if (message.includes('PRIVMSG')) {
                        let tags = {}, user = 'User', text = '';
                        if (message.startsWith('@')) {
                            let parts = message.split(' :');
                            let tagString = parts[0].substring(1);
                            message = parts.slice(1).join(' :');
                            tagString.split(';').forEach(t => { let [k,v] = t.split('='); tags[k] = v; });
                        }
                        const matchUser = message.match(/:([^!]+)!/);
                        const matchText = message.match(/PRIVMSG #[a-zA-Z0-9_]+ :(.+)/);
                        if (matchUser && matchText) {
                            user = tags['display-name'] || matchUser[1];
                            text = matchText[1].trim();
                            
                            chatMessages.value.push({ username: user, html: text, color: tags['color'] || '#9146FF' });
                            if (chatMessages.value.length > 100) chatMessages.value.shift();
                            
                            if (currentTab.value === 'chat') {
                                nextTick(() => { const list = document.getElementById('twitch-chat-list'); if (list) list.scrollTop = list.scrollHeight; });
                            }
                        }
                    }
                });
            };
        };

        const sendTwitchChatMessage = () => {
            if (!chatInput.value.trim() || !twitchWs || !twitchChatToken.value) return;
            twitchWs.send(`PRIVMSG #codemiko :${chatInput.value}`);
            chatMessages.value.push({ username: 'You', html: chatInput.value, color: '#9146FF' });
            chatInput.value = '';
            nextTick(() => { const list = document.getElementById('twitch-chat-list'); if (list) list.scrollTop = list.scrollHeight; });
        };

        const nextVod = () => { if (currentVodIndex.value < recentVods.value.length - 1) currentVodIndex.value++; };
        const prevVod = () => { const minIndex = isLive.value ? -1 : 0; if (currentVodIndex.value > minIndex) currentVodIndex.value--; };
        
        const formatNumber = (num) => (num && num > 999) ? (num/1000).toFixed(1) + 'k' : (num || 0);
        const closeFilterMenu = () => { isFilterMenuOpen.value = false; };
        const insertEmote = (name) => { const inputEl = document.getElementById('gerald-txt-input'); if (inputEl) { inputEl.value += `:${name}: `; geraldInput.value = inputEl.value; } else { geraldInput.value += `:${name}: `; } };

        const playClip = (clip) => { activeClipId.value = clip.id; };
        const playYt = (yt) => { yt.playing = true; };

        const scrollToBottom = () => {
            const b = document.getElementById('gerald-msgs');
            if (!b) return;
            nextTick(() => { b.scrollTo({ top: b.scrollHeight, behavior: 'smooth' }); setTimeout(() => { b.scrollTop = b.scrollHeight; }, 50); setTimeout(() => { b.scrollTop = b.scrollHeight; }, 200); });
        };

        const sortData = (filterKey) => {
            let sorted = [...allClips.value]; const now = new Date();
            if (filterKey === 'latest') { sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); } else {
                if (filterKey === 'weekly') { sorted = sorted.filter(c => new Date(c.created_at) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)); } 
                else if (filterKey === 'month') { sorted = sorted.filter(c => new Date(c.created_at) >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)); } 
                else if (filterKey === '6months') { sorted = sorted.filter(c => new Date(c.created_at) >= new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)); }
                sorted.sort((a, b) => b.view_count - a.view_count);
            }
            return sorted;
        };

        const applyFilter = (filterKey, label) => {
            currentFilter.value = filterKey; activeFilterLabel.value = label; isFilterMenuOpen.value = false;
            const feedContainer = document.getElementById('home-scroll');
            if(feedContainer) {
                clips.value = sortData(filterKey);
                nextTick(() => { feedContainer.scrollTop = 0; });
            }
        };

        window.addEventListener('popstate', () => { const hash = window.location.hash.replace('#', ''); if (tabs.includes(hash)) { currentTab.value = hash; } else { currentTab.value = 'home'; }});
        
        const isHeaderVisible = ref(true); let lastScrollY = 0;
        const handleScroll = (e) => { const currentScrollY = e.target.scrollTop; if (currentScrollY <= 0) { isHeaderVisible.value = true; return; } if (Math.abs(currentScrollY - lastScrollY) < 10) return; isHeaderVisible.value = currentScrollY < lastScrollY; lastScrollY = currentScrollY; };

        let modalStartY = 0, currentDeltaY = 0;
        const handleModalTouchStart = (e) => { if (e.currentTarget.scrollTop <= 0) { modalStartY = e.touches[0].clientY; currentDeltaY = 0; } };
        const handleModalTouchMove = (e) => { if (!modalStartY) return; currentDeltaY = e.touches[0].clientY - modalStartY; if (currentDeltaY > 0) { e.currentTarget.style.transform = `translateY(${currentDeltaY}px)`; e.currentTarget.style.transition = 'none'; } };
        const handleModalTouchEnd = (e) => { if (!modalStartY) return; e.currentTarget.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'; if (currentDeltaY > 100) { modals.value.profile = false; modals.value.discord = false; } e.currentTarget.style.transform = ''; modalStartY = 0; };

        const logoSvg = (id) => `<svg viewBox="0 0 100 100"><defs><linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9146FF"/><stop offset="100%" stop-color="#a970ff"/></linearGradient></defs><circle cx="50" cy="50" r="40" fill="url(#grad-${id})"/><path d="M 33 38 L 48 62 L 62 38 L 62 55 Q 62 65 69 64" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        const showToast = (msg, duration = 6000) => { toast.value.message = msg; toast.value.visible = true; setTimeout(() => toast.value.visible = false, duration); };
        
        const parseMarkdown = (text) => {
            if (!text) return '';
            let html = text.replace(/</g, '<').replace(/>/g, '>');
            html = html.replace(/(^|\W)'([^']+)'(\W|$)/g, '$1<strong>$2</strong>$3');
            html = html.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1'); 
            html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/gi, '<a href="$2" target="_blank" style="color: var(--primary); text-decoration: underline; font-weight: bold;">$1</a>');
            html = html.replace(/(^|[^"'])(https?:\/\/[^\s<)]+)/gi, '$1<a href="$2" target="_blank" style="color: var(--primary); text-decoration: underline; word-break: break-all;">$2</a>');
            return html;
        };

        const handleGeraldEnter = (e) => { if (!e.shiftKey && e.key === 'Enter') { e.preventDefault(); talkToGerald(); } };
        const toggleEmotes = () => { showEmotePicker.value = !showEmotePicker.value; showMinigames.value = false; };
        const toggleMinigames = () => { showMinigames.value = !showMinigames.value; showEmotePicker.value = false; };
        const closePickers = () => { showEmotePicker.value = false; showMinigames.value = false; };

        const playMinigame = (type) => {
            const games = {
                glitch: { msg: "🕶️ *Activates Glitch Persona*", text: "We are taking control. The Technician's fragile code cannot stop us." },
                shader: { msg: "🔥 *Compiles UE5 Shader Cache*", text: "Compiling 14,582 shaders. Stream framerate reduced to 1 FPS." },
                boba: { msg: "🥤 *Boba Spill Alert*", text: "Fluid detected on motherboard. Initiating emergency containment flush." },
                pineapple: { msg: "🚪 *Pineapple Walk-In*", text: "Chris has arrived. Reminder: He is NOT her boyfriend." },
                cat: { msg: "🐈 *Moves Cat Off Main PC*", text: "The Savannah Cat was sleeping on the exhaust vent. Temps dropping." },
                bits: { msg: "🎟️ *Simulates 100K Bit Drop*", text: "Particle explosion rendering! Memory overload!" },
                mute: { msg: "🔇 *Chat redeems Mute Microphone*", text: "Finally. Blissful silence. Look at her flail." },
                bald: { msg: "🧑‍🦲 *Optimizing VRAM by removing hair assets.*", text: "Bald Miko activated." },
                siren: { msg: "🚨 *Triggers acoustic anomaly.*", text: "Acoustic sensors blown. The Technician is emitting her 'firetruck siren'." }
            };
            const game = games[type];
            if (!game) return;
            geraldMessages.value.push({ role: 'user', content: game.msg });
            closePickers();
            setTimeout(() => { geraldMessages.value.push({ role: 'gerald', content: game.text }); scrollToBottom(); }, 800);
        };

        const loadGeraldHistory = async () => {
            if (!currentUser.value) return;
            const { data } = await sbClient.from('gerald_history').select('*').eq('user_id', currentUser.value.id).order('created_at', { ascending: true });
            if (data && data.length > 0) {
                let history = data.map(d => ({ role: d.role, content: d.content }));
                geraldMessages.value = history;
            }
            scrollToBottom();
        };

        const clearGeraldHistory = async () => {
            if (!currentUser.value || wipeState.value !== 'idle') return;
            wipeState.value = 'wiping';
            await sbClient.from('gerald_history').delete().eq('user_id', currentUser.value.id);
            geraldMessages.value = [{role:'gerald', content: ''}];
            wipeState.value = 'success';
            setTimeout(() => { wipeState.value = 'idle'; }, 2000);
        };

        const talkToGerald = async () => {
            const inputEl = document.getElementById('gerald-txt-input');
            if (inputEl && inputEl.value !== geraldInput.value) { geraldInput.value = inputEl.value; }
            if (!geraldInput.value.trim() || isGeraldTyping.value) return;
            
            const userMsg = geraldInput.value;
            geraldMessages.value.push({ role: 'user', content: userMsg });
            if (currentUser.value) { sbClient.from('gerald_history').insert({ role: 'user', content: userMsg, user_id: currentUser.value.id }).then(); }
            
            geraldInput.value = ''; 
            if (inputEl) { inputEl.value = ''; inputEl.style.height = 'auto'; } 
            
            isGeraldTyping.value = true; closePickers(); scrollToBottom();
            
            const recentContextWindow = geraldMessages.value.slice(-10);
            const geminiHistory = recentContextWindow.map(m => ({ role: m.role === 'gerald' ? 'model' : 'user', parts: [{ text: m.content }] }));
            
            try {
                const { data, error } = await sbClient.functions.invoke('gerald-chat', { body: { history: geminiHistory } });
                if (error) throw error;
                if (data && data.reply) {
                    let cleanReply = data.reply.trim();
                    geraldMessages.value.push({ role: 'gerald', content: cleanReply });
                    if (currentUser.value) { sbClient.from('gerald_history').insert({ role: 'gerald', content: cleanReply, user_id: currentUser.value.id }).then(); }
                }
            } catch (e) { 
                geraldMessages.value.push({ role: 'gerald', content: 'SYSTEM ERROR: Offline Subroutines active.' }); 
            } finally { isGeraldTyping.value = false; scrollToBottom(); }
        };

        const nukeCache = async () => {
            showToast("Nuking app cache storage layers...");
            try {
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (let registration of registrations) { await registration.unregister(); }
                }
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    for (let name of cacheNames) { await caches.delete(name); }
                }
                showToast("Cache purged cleanly. Re-loading pipeline...", 2000);
                setTimeout(() => {
                    window.location.href = window.location.origin + window.location.pathname + '?cb=' + Date.now() + window.location.hash;
                }, 1000);
            } catch (e) { showToast("Cache purge error."); }
        };

        const loadData = async () => {
            const { data: dbEmotes } = await sbClient.from('emotes').select('*');
            if (dbEmotes) { dbEmotes.forEach(e => { customEmotes.value[e.name] = { id: e.id, animated: e.animated }; }); }

            const { data: c } = await sbClient.from('clips').select('*').order('created_at', { ascending: false }).limit(3000);
            allClips.value = c || []; clips.value = sortData(currentFilter.value);
        };

        const checkLive = async () => {
            try {
                const res = await fetch('https://decapi.me/twitch/uptime/codemiko');
                isLive.value = !(await res.text()).includes('offline');

                try {
                    const gqlRes = await fetch('https://gql.twitch.tv/gql', { method: 'POST', headers: { 'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko', 'Content-Type': 'application/json' }, body: JSON.stringify({ query: `query { user(login: "codemiko") { videos(first: 10) { edges { node { id createdAt } } } } }` }) });
                    const edges = (await gqlRes.json()).data.user.videos.edges;
                    recentVods.value = edges.map(e => ({ id: e.node.id, date: new Date(e.node.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() }));
                } catch(e) { }
                if (currentVodIndex.value === 0 || currentVodIndex.value === -1) { currentVodIndex.value = isLive.value ? -1 : 0; }
            } catch(e) {}
        };

        const runSync = async () => {};

        onMounted(async () => {
            const clientId = apiConfig.value.cid || 'kimne78kx3ncx6brgo4mv6wki5h1ko';
            // Force strict formatting exactly matching Github Pages root path (NO trailing slash) to bypass mismatch
            let baseUri = window.location.origin + window.location.pathname;
            if (baseUri.endsWith('/')) { baseUri = baseUri.slice(0, -1); }
            twitchAuthUrl.value = 'https://id.twitch.tv/oauth2/authorize?client_id=' + clientId + '&redirect_uri=' + encodeURIComponent(baseUri) + '&response_type=token&scope=chat:read+chat:edit&force_verify=true';
            
            updateThemeClass();
            if (window.location.hash.includes('access_token')) {
                const params = new URLSearchParams(window.location.hash.substring(1));
                if (params.get('access_token')) {
                    twitchChatToken.value = params.get('access_token');
                    localStorage.setItem('tw_chat_token', twitchChatToken.value);
                    window.history.replaceState({}, document.title, window.location.pathname + '#chat');
                    currentTab.value = 'chat';
                }
            }

            const { data: { session } } = await sbClient.auth.getSession();
            if (session?.user) { currentUser.value = session.user; loadGeraldHistory(); }
            loadData(); checkLive(); connectTwitchChat();
            
            setInterval(loadData, 21600000);
            setInterval(checkLive, 60000); 
            setTimeout(() => { splashOpacity.value = 0; setTimeout(() => splashVisible.value = false, 400); }, 1500);
        });

        return { 
            hostname, splashVisible, splashOpacity, currentTab, appTheme, toggleTheme, clips, modals, isLive, toast, currentUser, loginEmail, loginPass, apiConfig, geraldInput, geraldMessages, isGeraldTyping, talkToGerald, logoSvg, syncState, wipeState, logoutState, runSync, isHeaderVisible, handleScroll, handleModalTouchStart, handleModalTouchMove, handleModalTouchEnd, currentFilter, activeFilterLabel, isFilterMenuOpen, closeFilterMenu, applyFilter, parseMarkdown, recentVods, currentVodIndex, nextVod, prevVod, customEmotes, showEmotePicker, insertEmote, clearGeraldHistory, handleGeraldEnter, toggleEmotes, toggleMinigames, closePickers, formatNumber, showMinigames, playMinigame, nukeCache, activeClipId, tabOffset, switchTab, handleSwipeStart, handleSwipeEnd,
            chatMessages, chatInput, twitchChatToken, twitchAuthUrl, sendTwitchChatMessage, playClip, playYt,
            handleLogin: async () => { const email = loginEmail.value.includes('@') ? loginEmail.value : `${loginEmail.value}@miko.com`; const { data } = await sbClient.auth.signInWithPassword({ email, password: loginPass.value }); if(data.user) { currentUser.value = data.user; modals.value.profile = false; loadGeraldHistory(); } }, 
            handleLogout: () => { if (logoutState.value !== 'idle') return; logoutState.value = 'logging_out'; setTimeout(() => { sbClient.auth.signOut(); currentUser.value = null; geraldMessages.value = [{role:'gerald', content: ''}]; modals.value.profile = false; logoutState.value = 'idle'; }, 1500); },
            optimizeTwitchImg: (u) => u ? u.replace('%{width}', '480').replace('%{height}', '270') : '', 
            formatViews: (v) => v ? v.toLocaleString() : '0', 
            formatDate: (d) => new Date(d).toLocaleDateString([], {month:'short', day:'numeric'})
        };
    }
}).mount('#app-container');
