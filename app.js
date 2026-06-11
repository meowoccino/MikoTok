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
        <header class="app-header" :class="{ hidden: !isHeaderVisible }">
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
                        <button class="menu-btn sync-row" :style="syncState === 'sync-success' ? 'color: var(--success);' : ''" @click="$emit('sync')" :disabled="syncState !== 'idle'">
                            <div class="btn-content">
                                <div class="icon-wrap" :style="syncState === 'sync-success' ? 'background: rgba(16, 185, 129, 0.15);' : ''"><span class="material-symbols-rounded" :class="{'spin-anim': syncState === 'syncing'}" style="font-size: 18px;">{{ syncState === 'sync-success' ? 'check' : 'sync' }}</span></div>
                                <span>{{ syncState === 'syncing' ? 'SYNCING...' : (syncState === 'sync-success' ? 'SUCCESS' : 'Force Data Sync') }}</span>
                            </div>
                        </button>
                        <button class="menu-btn wipe-row" :style="wipeState === 'success' ? 'color: var(--success);' : ''" @click="$emit('wipe')" :disabled="wipeState !== 'idle'">
                            <div class="btn-content">
                                <div class="icon-wrap"><span class="material-symbols-rounded" :class="{'shake-anim': wipeState === 'wiping'}" style="font-size: 18px;">delete</span></div>
                                <span>{{ wipeState === 'wiping' ? 'WIPING...' : (wipeState === 'success' ? 'MEMORY WIPED!' : 'Wipe Gerald Memory') }}</span>
                            </div>
                        </button>
                        <button class="menu-btn sync-row" style="color: #ff4500;" @click="$emit('nuke-cache')">
                            <div class="btn-content">
                                <div class="icon-wrap" style="background: rgba(255, 69, 0, 0.15);"><span class="material-symbols-rounded" style="font-size: 18px;">cached</span></div>
                                <span>Nuke App Cache</span>
                            </div>
                        </button>
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
    props: ['currentTab', 'chatMessages', 'chatInput', 'isLoggedIn', 'twitchAuthUrl', 'customEmotes'],
    data() { return { showEmotes: false }; },
    template: `
        <div class="chat-wrapper">
            <div class="twitch-chat-list" id="twitch-chat-list" @click="showEmotes = false">
                <div v-if="!isLoggedIn" class="chat-login-prompt">
                    <span class="material-symbols-rounded" style="font-size:48px; color:var(--primary); margin-bottom:10px;">login</span>
                    <p style="color:var(--text-main); font-weight:700; margin-bottom:15px;">Login to chat and use emotes.</p>
                    <a :href="twitchAuthUrl" class="twitch-login-btn">Connect Twitch</a>
                </div>
                <div v-for="(msg, i) in chatMessages" :key="i" class="twitch-msg-row">
                    <span class="twitch-badges">
                        <img v-for="(badge, bi) in msg.badges" :key="bi" :src="badge.img" :title="badge.title" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;border-radius:2px;">
                    </span>
                    <span class="twitch-username" :style="{color: msg.color}">{{ msg.username }}</span>
                    <span class="twitch-text" v-html="' ' + msg.html"></span>
                </div>
            </div>
            
            <transition name="tray">
                <div class="chat-tray-container" v-show="showEmotes">
                    <img v-for="(emote, name) in customEmotes" :key="name" :src="emote.url ? emote.url : 'https://cdn.discordapp.com/emojis/' + emote.id + '.' + (emote.animated ? 'gif' : 'png') + '?size=44'" class="emote-picker-img" @click="$emit('insert-chat-emote', ':' + name + ':'); showEmotes = false;">
                </div>
            </transition>
            
            <div class="custom-chat-input-area">
                <button class="emote-toggle-btn" style="padding:0; width:36px; height:36px; justify-content:center; flex-shrink:0; margin-right:5px;" @click="showEmotes = !showEmotes" :disabled="!isLoggedIn">
                    <span class="material-symbols-rounded" :style="{ color: showEmotes ? 'var(--primary)' : 'inherit' }">mood</span>
                </button>
                <input type="text" class="custom-chat-input" placeholder="Send a message..." :value="chatInput" @input="$emit('update-input', $event.target.value)" @keydown.enter="$emit('send-chat')" :disabled="!isLoggedIn" @focus="showEmotes = false">
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
            <div class="social-grid">
                
                <a href="https://throne.com/codemiko" target="_blank" class="social-card throne">
                    <div style="display:flex; align-items:center; gap:15px; flex:1;">
                        <span class="material-symbols-rounded social-icon" style="font-size: 28px; color: #0ea5e9;">redeem</span>
                        <span style="color: var(--text-main);">Throne</span>
                    </div>
                    <span class="material-symbols-rounded" style="color: var(--text-muted); font-size: 20px; transform: rotate(45deg);">push_pin</span>
                </a>
                
                <div style="height: 4px;"></div>
                
                <a href="https://www.twitch.tv/codemiko" target="_blank" class="social-card">
                    <svg viewBox="0 0 24 24" class="social-icon" style="color: #9146FF;"><path fill="currentColor" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
                    <span style="color: var(--text-main);">Twitch</span>
                </a>
                <a href="https://www.youtube.com/@CodeMiko" target="_blank" class="social-card">
                    <svg viewBox="0 0 24 24" class="social-icon" style="color: #FF0000;"><path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span style="color: var(--text-main);">YouTube</span>
                </a>
                <a href="https://kick.com/codemiko" target="_blank" class="social-card">
                    <svg viewBox="0 0 24 24" class="social-icon" style="color: #53FC18;"><path fill="currentColor" d="M1.4 1.56v20.88h5.96V16h2.15v2.89h2.52v3.55h10.54V1.56h-10.54v3.55h-2.52v2.89H7.36V1.56z"/></svg>
                    <span style="color: var(--text-main);">Kick</span>
                </a>
                <a href="https://www.tiktok.com/@codemiko" target="_blank" class="social-card">
                    <svg viewBox="0 0 24 24" class="social-icon" style="color: var(--text-main);"><path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                    <span style="color: var(--text-main);">TikTok</span>
                </a>
                <a href="https://x.com/thecodemiko" target="_blank" class="social-card">
                    <svg viewBox="0 0 24 24" class="social-icon" style="color: var(--text-main);"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <span style="color: var(--text-main);">X (Twitter)</span>
                </a>
                <a href="https://www.instagram.com/thecodemiko/" target="_blank" class="social-card">
                    <svg viewBox="0 0 24 24" class="social-icon" style="color: #E1306C;"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                    <span style="color: var(--text-main);">Instagram</span>
                </a>
                <a href="https://www.snapchat.com/add/codemiko" target="_blank" class="social-card">
                    <svg viewBox="0 0 24 24" class="social-icon" style="color: #FFD500;"><path fill="currentColor" d="M12.02.042C9.406.1 7.155.875 5.56 2.646c-1.1 1.229-1.636 2.822-1.636 4.801 0 1.25-.094 2.52-1.073 3.666-.312.385-.687.729-1.093 1.042-.209.156-.469.343-.844.521-.635.291-.885.812-.666 1.343.145.375.468.625.864.719 1.094.26 2.302.395 3.323.51a19.78 19.78 0 00-.77 2.135 4.3 4.3 0 00-.094.885c0 .48.24.969.833 1.23.49.208 1.135.03 1.636-.261.27-.156.552-.354.833-.562.916-.656 1.937-1.385 3.25-1.396 2.197-.02 4.311.604 6.27 1.76.125.073.26.135.396.188.427.146.854.125 1.125-.115.354-.302.406-.823.167-1.312a20.082 20.082 0 00-1.042-2.031c1.073-.136 2.375-.323 3.614-.625.688-.167 1.125-.667 1.094-1.24-.031-.573-.521-1.031-1.25-1.208-1.573-.427-2.614-1.614-2.885-2.093-.729-1.219-.74-2.583-.74-3.927 0-2.02-.552-3.666-1.74-4.885C16.907.969 14.656.094 12.02.042zm6.27 18.061c.428.188.897.459 1.417.813.438.302.688.75.615 1.198-.073.437-.448.791-1.01.916a8.473 8.473 0 01-1.532.146c-.77.01-1.614-.156-2.52-.375-1.021-.26-2.125-.562-3.23-.562s-2.208.302-3.23.562c-.906.219-1.75.385-2.52.375a8.463 8.463 0 01-1.531-.146c-.562-.125-.937-.479-1.01-.916-.073-.448.177-.896.614-1.198.521-.354.99-.625 1.417-.813a3.522 3.522 0 011.083 2.115c.125.75 1.094 1.343 2.656 1.635.886.167 1.834.198 2.521.198.688 0 1.635-.031 2.521-.198 1.562-.292 2.531-.885 2.656-1.635a3.52 3.52 0 011.083-2.115z"/></svg>
                    <span style="color: var(--text-main);">Snapchat</span>
                </a>
                <a href="https://www.facebook.com/thecodemiko/" target="_blank" class="social-card">
                    <svg viewBox="0 0 24 24" class="social-icon" style="color: #1877F2;"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span style="color: var(--text-main);">Facebook</span>
                </a>
                <a href="https://discord.com/invite/codemiko" target="_blank" class="social-card">
                    <svg viewBox="0 0 24 24" class="social-icon" style="color: #5865F2;"><path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                    <span style="color: var(--text-main);">Discord</span>
                </a>
                <a href="https://www.reddit.com/r/CodeMiko/" target="_blank" class="social-card">
                    <svg viewBox="0 0 24 24" class="social-icon" style="color: #FF4500;"><path fill="currentColor" d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-6.07-1.72.08-1.1.4-3.05 1.52-3.7.72-.4 1.73-.24 3 .5C17.2 6.3 18.46 7.5 20 7.5c1.65 0 3-1.35 3-3s-1.35-3-3-3c-1.38 0-2.54.94-2.88 2.22-1.43-.72-2.64-.8-3.6-.25-1.64.94-1.95 3.47-2 4.55-2.33.08-4.45.7-6.1 1.72C4.86 8.98 3.96 8.5 3 8.5c-1.65 0-3 1.35-3 3 0 1.32.84 2.44 2.05 2.84-.03.22-.05.44-.05.66 0 3.86 4.5 7 10 7s10-3.14 10-7c0-.22-.02-.44-.05-.66 1.2-.4 2.05-1.54 2.05-2.84zM2.3 13.37C1.5 13.07 1 12.35 1 11.5c0-1.1.9-2 2-2 .64 0 1.22.32 1.6.82-1.1.85-1.92 1.9-2.3 3.05zm3.7.13c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9.8 4.8c-1.08.63-2.42.96-3.8.96-1.4 0-2.74-.34-3.8-.95-.24-.13-.32-.44-.2-.68.15-.24.46-.32.7-.18 1.83 1.06 4.76 1.06 6.6 0 .23-.13.53-.05.67.2.14.23.06.54-.18.67zm.2-2.8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5.7-2.13c-.38-1.16-1.2-2.2-2.3-3.05.38-.5.96-.82 1.6-.82 1.1 0 2 .9 2 2 0 .84-.53 1.57-1.3 1.87z"/></svg>
                    <span style="color: var(--text-main);">Reddit</span>
                </a>
                <a href="https://app.fanfix.io/@codeyuna" target="_blank" class="social-card">
                    <span class="material-symbols-rounded social-icon" style="font-size: 28px; color: #FF3366;">favorite</span>
                    <span style="color: var(--text-main);">Fanfix</span>
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
                <img src="gerald.png" class="gerald-avatar" alt="Gerald">
                <div class="gerald-title-block">
                    <span class="gerald-name-text">Gerald O.S.</span>
                    <div :class="apiConnected ? 'pulse-dot-live' : 'pulse-dot-offline'"></div>
                </div>
            </div>
            <div class="gerald-messages" id="gerald-msgs" @click="$emit('close-pickers')">
                <template v-for="(m, i) in geraldMessages" :key="i">
                    <div v-if="i === 0 && m.role === 'gerald'" class="terminal-intro">
                        <div class="terminal-text startup-anim">
                            > Human detected.<br>
                            > What do you want?
                        </div>
                    </div>
                    <div v-else class="chat-bubble" :class="m.role" v-html="parseMarkdown(m.content)"></div>
                </template>
                <div v-if="isGeraldTyping" key="typing" class="typing-indicator">COMPUTING...</div>
            </div>
            <div class="gerald-action-area">
                <transition name="tray">
                    <div class="tray-container" v-show="showEmotePicker">
                        <img v-for="(emote, name) in customEmotes" :key="name" :src="emote.url ? emote.url : 'https://cdn.discordapp.com/emojis/' + emote.id + '.' + (emote.animated ? 'gif' : 'png') + '?size=44'" class="emote-picker-img" @click="$emit('insert-emote', ':' + name + ':')">
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
    props: ['currentTab', 'currentVodIndex', 'recentVods', 'isLive', 'hostname', 'clips', 'activeFilterLabel', 'optimizeTwitchImg', 'formatViews', 'formatDate'],
    template: `
        <div>
            <div class="hero-section">
                <div class="header-controls" style="margin-bottom: 12px; display: flex; justify-content: flex-start;" v-if="!isLive">
                    <div class="premium-badge vod" v-if="recentVods && recentVods.length > 0">
                        <div class="dot"></div><span>{{ recentVods[currentVodIndex] ? ('VOD • ' + recentVods[currentVodIndex].date) : 'PAST BROADCAST' }}</span>
                    </div>
                </div>
                <div class="video-container">
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
        </div>
    `
};

const { createApp, ref, onMounted, nextTick, watch, computed } = Vue;
const sbClient = supabase.createClient('https://yhxcuayiwqpjvalyrcqv.supabase.co', 'sb_publishable_VyFcNARHblJg10qlC_O7Dg_coouXK92');

createApp({
    components: {
        ToastPopup, SplashScreen, AppHeader, BottomNav, FilterMenu, 
        ProfileModal, GeraldView, HomeView, ChatView, MoreView, ClipModal
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
        const apiConfig = ref({ cid: localStorage.getItem('twitch_cid') || 'i2fjxfk0oq6ybixle760zryrtvdqjg', tkn: localStorage.getItem('twitch_tkn') || '' });
        
        const customEmotes = ref({
            "mkoSusge": { id: "1273724925743595540", animated: false }, "KEKW": { id: "1456296327964262453", animated: false }, "mkoNOTED": { id: "1369891690898391070", animated: false }, "mkoHype": { id: "870761283035734086", animated: false }, "Shruge": { id: "1456297412875518078", animated: false }, "Bedge": { id: "1369823782084022423", animated: false }, "mkoCoffee": { id: "1369891686544834570", animated: false }, "D_": { id: "1456295688626241619", animated: false }, "mkoLove": { id: "1150505635721519115", animated: false }
        });

        const geraldInput = ref('');
        const geraldMessages = ref([{role:'gerald', content: ''}]);
        const isGeraldTyping = ref(false), showEmotePicker = ref(false), showMinigames = ref(false);
        
        const currentFilter = ref('latest'), activeFilterLabel = ref('Latest'), isFilterMenuOpen = ref(false);
        const recentVods = ref([]), currentVodIndex = ref(0);
        
        const selectedClip = ref(null);
        const chatMessages = ref([]);
        const chatInput = ref('');
        const twitchChatToken = ref(localStorage.getItem('tw_chat_token') || null);
        const twitchUsername = ref(null);
        const twitchAuthUrl = ref('');
        let twitchWs = null;

        let touchStartX = 0;
        let touchStartY = 0;
        const handleSwipeStart = (e) => { 
            touchStartX = e.touches[0].clientX; 
            touchStartY = e.touches[0].clientY;
        };
        const handleSwipeEnd = (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
                const currentIndex = tabs.indexOf(currentTab.value);
                if (diffX > 0 && currentIndex < tabs.length - 1) {
                    switchTab(tabs[currentIndex + 1]);
                } else if (diffX < 0 && currentIndex > 0) {
                    switchTab(tabs[currentIndex - 1]);
                }
            }
        };

        const switchTab = (tab) => {
            currentTab.value = tab;
            window.history.pushState(null, '', `#${tab}`);
            if (tab === 'chat') { setTimeout(() => { const list = document.getElementById('twitch-chat-list'); if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' }); }, 150); }
            if (tab === 'gerald') { setTimeout(scrollToBottom, 150); }
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

        const parseIrcMessage = (raw) => {
            if (!raw || !raw.includes('PRIVMSG')) return;
            let tags = {};
            let line = raw;
            if (line.startsWith('@')) {
                const spaceIdx = line.indexOf(' ');
                const tagString = line.substring(1, spaceIdx);
                tagString.split(';').forEach(t => {
                    const [k, ...v] = t.split('=');
                    tags[k] = v.join('=');
                });
                line = line.substring(spaceIdx + 1);
            }
            const matchUser = line.match(/:([^!]+)!/);
            const matchText = line.match(/PRIVMSG #[a-zA-Z0-9_]+ :(.+)/);
            if (!matchUser || !matchText) return;
            
            const user = tags['display-name'] || matchUser[1];
            const color = tags['color'] || '#9146FF';
            let text = matchText[1].trim();
            
            const badges = [];
            if (tags['badges']) {
                tags['badges'].split(',').forEach(b => {
                    const [type, version] = b.split('/');
                    if (type === 'broadcaster') badges.push({ title: 'Broadcaster', img: 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1' });
                    else if (type === 'moderator') badges.push({ title: 'Mod', img: 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1' });
                    else if (type === 'vip') badges.push({ title: 'VIP', img: 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1' });
                    else if (type === 'subscriber') badges.push({ title: `Sub (${version}mo)`, img: `https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1` });
                    else if (type === 'turbo') badges.push({ title: 'Turbo', img: 'https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/1' });
                });
            }
            
            let html = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            if (tags['emotes']) {
                let replacements = [];
                tags['emotes'].split('/').forEach(e => {
                    const [id, positions] = e.split(':');
                    if (!positions) return;
                    positions.split(',').forEach(pos => {
                        const [start, end] = pos.split('-').map(Number);
                        replacements.push({ start, end, id });
                    });
                });
                replacements.sort((a, b) => b.start - a.start);
                let chars = [...text];
                replacements.forEach(({ start, end, id }) => {
                    const img = `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0" style="height:22px;vertical-align:middle;margin:0 2px;" title="${chars.slice(start, end+1).join('')}">`;
                    chars.splice(start, end - start + 1, img);
                });
                html = chars.join('');
            }
            
            chatMessages.value.push({ username: user, html, color, badges });
            if (chatMessages.value.length > 150) chatMessages.value.shift();
            
            if (currentTab.value === 'chat') {
                setTimeout(() => { const list = document.getElementById('twitch-chat-list'); if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' }); }, 100);
            }
        };

        const connectTwitchChat = () => {
            if (twitchWs) { try { twitchWs.close(); } catch(e){} }
            twitchWs = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
            twitchWs.onopen = () => {
                twitchWs.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
                if (twitchChatToken.value) {
                    twitchWs.send(`PASS oauth:${twitchChatToken.value}`);
                    if (twitchUsername.value) {
                        twitchWs.send(`NICK ${twitchUsername.value}`);
                        twitchWs.send('JOIN #codemiko');
                    }
                } else {
                    twitchWs.send('PASS oauth:anonymous');
                    twitchWs.send('NICK justinfan12345');
                    twitchWs.send('JOIN #codemiko');
                }
                
                fetch('https://recent-messages.robotty.de/api/v2/recent-messages/codemiko?limit=50')
                    .then(r => r.json())
                    .then(data => {
                        if (data.messages) { data.messages.forEach(raw => parseIrcMessage(raw)); }
                    }).catch(() => {});
            };

            twitchWs.onmessage = (event) => {
                event.data.split('\r\n').forEach(raw => {
                    if (raw.startsWith('PING')) { twitchWs.send('PONG :tmi.twitch.tv'); return; }
                    parseIrcMessage(raw);
                });
            };
        };

        const sendTwitchChatMessage = () => {
            if (!chatInput.value.trim() || !twitchWs || !twitchChatToken.value) return;
            twitchWs.send(`PRIVMSG #codemiko :${chatInput.value}`);
            chatMessages.value.push({ username: twitchUsername.value || 'You', html: parseMarkdown(chatInput.value), color: '#9146FF' });
            chatInput.value = '';
            setTimeout(() => { const list = document.getElementById('twitch-chat-list'); if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' }); }, 100);
        };

        const nextVod = () => { if (currentVodIndex.value < recentVods.value.length - 1) currentVodIndex.value++; };
        const prevVod = () => { const minIndex = isLive.value ? -1 : 0; if (currentVodIndex.value > minIndex) currentVodIndex.value--; };
        
        const formatNumber = (num) => (num && num > 999) ? (num/1000).toFixed(1) + 'k' : (num || 0);
        const closeFilterMenu = () => { isFilterMenuOpen.value = false; };
        
        const playClip = (clip) => { selectedClip.value = clip; };

        const scrollToBottom = () => {
            setTimeout(() => {
                const b = document.getElementById('gerald-msgs');
                if (b) { b.scrollTo({ top: b.scrollHeight, behavior: 'smooth' }); }
            }, 100);
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
            html = html.replace(/`?:([^:\s]+):`?/g, (match, name) => {
                const emote = customEmotes.value[name];
                if (emote) { 
                    const src = emote.url ? emote.url : `https://cdn.discordapp.com/emojis/${emote.id}.${emote.animated ? 'gif' : 'png'}?size=44`;
                    return `<img src="${src}" alt=":${name}:" style="height: 1.5em; vertical-align: middle; display: inline-block;">`; 
                }
                return match;
            });
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
            const clientId = apiConfig.value.cid || 'i2fjxfk0oq6ybixle760zryrtvdqjg';
            twitchAuthUrl.value = 'https://id.twitch.tv/oauth2/authorize?client_id=' + clientId + '&redirect_uri=' + encodeURIComponent('https://meowoccino.github.io/MikoTok/') + '&response_type=token&scope=chat:read+chat:edit&force_verify=true';
            
            updateThemeClass();
            if (window.location.hash.includes('access_token')) {
                const params = new URLSearchParams(window.location.hash.substring(1));
                if (params.get('access_token')) {
                    twitchChatToken.value = params.get('access_token');
                    localStorage.setItem('tw_chat_token', twitchChatToken.value);
                    window.history.replaceState({}, document.title, window.location.pathname + '#chat');
                    currentTab.value = 'chat';
                    
                    fetch('https://id.twitch.tv/oauth2/validate', { headers: { 'Authorization': 'OAuth ' + twitchChatToken.value } })
                        .then(res => res.json())
                        .then(data => {
                            if (data.login) {
                                twitchUsername.value = data.login;
                                connectTwitchChat();
                            } else {
                                twitchChatToken.value = null; 
                                localStorage.removeItem('tw_chat_token');
                                connectTwitchChat();
                            }
                        }).catch(e => { console.error(e); connectTwitchChat(); });
                } else { connectTwitchChat(); }
            } else { connectTwitchChat(); }

            const { data: { session } } = await sbClient.auth.getSession();
            if (session?.user) { currentUser.value = session.user; loadGeraldHistory(); }
            loadData(); checkLive();
            
            setInterval(loadData, 21600000);
            setInterval(checkLive, 60000); 
            setTimeout(() => { splashOpacity.value = 0; setTimeout(() => splashVisible.value = false, 400); }, 1500);
        });

        return { 
            hostname, splashVisible, splashOpacity, currentTab, appTheme, toggleTheme, clips, modals, isLive, toast, currentUser, loginEmail, loginPass, apiConfig, geraldInput, geraldMessages, isGeraldTyping, talkToGerald, logoSvg, syncState, wipeState, logoutState, runSync, isHeaderVisible, handleScroll, handleModalTouchStart, handleModalTouchMove, handleModalTouchEnd, currentFilter, activeFilterLabel, isFilterMenuOpen, closeFilterMenu, applyFilter, parseMarkdown, recentVods, currentVodIndex, nextVod, prevVod, customEmotes, showEmotePicker, insertEmote, clearGeraldHistory, handleGeraldEnter, toggleEmotes, toggleMinigames, closePickers, nukeCache, activeClipId, tabOffset, switchTab, handleSwipeStart, handleSwipeEnd, playClip, selectedClip,
            chatMessages, chatInput, twitchChatToken, twitchAuthUrl, sendTwitchChatMessage,
            handleLogin: async () => { const email = loginEmail.value.includes('@') ? loginEmail.value : `${loginEmail.value}@miko.com`; const { data } = await sbClient.auth.signInWithPassword({ email, password: loginPass.value }); if(data.user) { currentUser.value = data.user; modals.value.profile = false; loadGeraldHistory(); } }, 
            handleLogout: () => { if (logoutState.value !== 'idle') return; logoutState.value = 'logging_out'; setTimeout(() => { sbClient.auth.signOut(); currentUser.value = null; geraldMessages.value = [{role:'gerald', content: ''}]; modals.value.profile = false; logoutState.value = 'idle'; }, 1500); },
            optimizeTwitchImg: (u) => u ? u.replace('%{width}', '480').replace('%{height}', '270') : '', 
            formatViews: (v) => v ? v.toLocaleString() : '0', 
            formatDate: (d) => new Date(d).toLocaleDateString([], {month:'short', day:'numeric'})
        };
    }
}).mount('#app-container');
