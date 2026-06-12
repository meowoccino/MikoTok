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
        <header class="app-header safe-top-padding" v-show="currentTab === 'home'" style="background-color: var(--bg-color); z-index: 100; border-bottom: none !important;">
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
        <nav class="bottom-nav" style="z-index: 100; background-color: var(--card-bg);">
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
    props: ['isOpen', 'currentUser', 'loginEmail', 'loginPass', 'apiConfig', 'syncState', 'wipeState', 'logoutState', 'nukeState', 'allClipsCount'],
    template: `
        <div class="modal-overlay" :class="{ open: isOpen }" @click.self="$emit('close')">
            <div class="modal-content" @touchstart="$emit('touch-start', $event)" @touchmove="$emit('touch-move', $event)" @touchend="$emit('touch-end', $event)">
                <div class="drag-handle"></div>
                
                <div v-if="!currentUser || currentUser.is_anonymous">
                    <input type="text" :value="loginEmail" @input="$emit('update-email', $event.target.value)" class="input-box" style="margin-top: 10px;" placeholder="Email">
                    <input type="password" :value="loginPass" @input="$emit('update-pass', $event.target.value)" class="input-box" @keyup.enter="$emit('login')" placeholder="Password">
                    <div v-if="$root.loginError" style="color: var(--danger); font-size: 12px; margin-bottom: 8px; font-weight: bold; text-align: center;">{{ $root.loginError }}</div>
                    <button class="sync-btn" @click="$emit('login')">LOGIN</button>
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
                    
                    <div class="settings-block" style="padding-bottom: 5px;">
                        <div style="font-size:42px; color:var(--primary); font-family: monospace; font-weight:900; text-align:center;">
                            {{ allClipsCount || 0 }}
                        </div>
                    </div>

                    <div class="settings-block">
                        <div class="block-title">TWITCH API CONFIG</div>
                        <input type="text" class="sleek-input" v-model="apiConfig.localCid" placeholder="Client ID">
                        <input type="password" class="sleek-input" v-model="apiConfig.localTkn" placeholder="Access Token">
                        <button class="save-keys-btn" @click="$emit('save-keys')"><span class="material-symbols-rounded">save</span>Save Credentials</button>
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
        getEmoteUrl(emote) { return emote.url || `https://cdn.discordapp.com/emojis/${emote.id}.${emote.animated ? 'gif' : 'png'}?size=44`; },
        insertEmote(name) { this.localInput = (this.localInput + ' ' + name + ' ').replace(/\s+/g, ' ').trimStart(); this.showPicker = false; },
        handleInteraction() { if (!this.isLoggedIn) { this.$root.showLoginPopup = true; return false; } return true; },
        togglePicker() { if (!this.handleInteraction()) return; this.showPicker = !this.showPicker; },
        closePicker() { this.showPicker = false; this.pickerQuery = ''; },
        handleSend() { if(!this.localInput.trim()) return; this.$emit('send-chat', this.localInput.trim()); this.localInput = ''; this.closePicker(); }
    },
    template: `
        <!-- Viewport height strict column bounds -->
        <div class="chat-wrapper safe-top-padding" style="flex: 1; display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden;">
            <div v-if="isLoggedIn" class="chat-public-auth-banner" style="z-index: 60; flex-shrink: 0;">
                <span class="user-pill">💬 Connected as <b>{{ twitchUsername }}</b></span>
                <button class="public-disconnect-btn" @click="$emit('disconnect-public-twitch')">Disconnect</button>
            </div>

            <!-- Absolute Bottom Layout: Flex spacer pushes list structure to base window layout natively -->
            <div class="twitch-chat-list" id="twitch-chat-list" @click="closePicker" style="flex: 1; display: flex; flex-direction: column; overflow-y: auto; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; padding: 10px 12px 0;">
                <div style="flex: 1 1 auto; min-height: 0;"></div>
                
                <div v-if="chatMessages.length === 0" class="chat-empty-state">
                    <span class="material-symbols-rounded" style="font-size:32px; color:var(--text-muted); margin-bottom:8px;">chat_bubble_outline</span>
                    <span style="font-size:13px; color:var(--text-muted); font-weight:600;">Loading channels…</span>
                </div>
                
                <div v-for="(msg, i) in chatMessages" :key="i" class="twitch-msg-row">
                    <span class="chat-timestamp">{{ msg.timestamp }}</span>
                    <span class="twitch-badges">
                        <img v-for="(badge, bi) in (msg.badges || [])" :key="bi" :src="badge.img" :title="badge.title" class="badge-img">
                    </span>
                    <span class="twitch-username" :style="{ color: msg.color || '#9146FF' }">{{ msg.username }}</span><span class="twitch-colon">: </span>
                    <span class="twitch-text" v-html="msg.html"></span>
                </div>
                
                <!-- Bottom buffer clears input area space cleanly -->
                <div style="height: 75px; flex-shrink: 0; min-height: 75px;"></div>
            </div>

            <div class="chat-emote-tray" v-show="showPicker && isLoggedIn" @click.stop style="position: absolute; bottom: calc(65px + 75px + env(safe-area-inset-bottom, 0px)); z-index: 70; width: 100%;">
                <input v-model="pickerQuery" class="emote-search-input" placeholder="Search emotes…">
                <div class="emote-picker-grid" style="overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch;">
                    <img v-for="([name, emote]) in filteredEmotes" :key="name" :src="getEmoteUrl(emote)" :title="name" class="emote-picker-img" @mousedown.prevent="insertEmote(name)">
                </div>
            </div>

            <!-- Absolute Lift: Fixed above navigation layout explicitly -->
            <div class="custom-chat-input-area" style="position: absolute; bottom: calc(65px + env(safe-area-inset-bottom, 0px)); width: 100%; z-index: 60; padding-bottom: 5px;">
                <button class="chat-icon-btn" :class="{ 'chat-icon-active': showPicker }" @click.stop="togglePicker"><span class="material-symbols-rounded" style="font-size:22px;">mood</span></button>
                <input type="text" class="custom-chat-input" placeholder="Send a message…" v-model="localInput" @keydown.enter="handleSend" @focus="handleInteraction" :readonly="!isLoggedIn">
                <button class="chat-send-btn" @click="handleSend" :disabled="!isLoggedIn || !localInput.trim()"><span class="material-symbols-rounded" style="font-size:20px;">send</span></button>
            </div>

            <!-- Centered Popup Layout Constraint -->
            <div class="chat-login-popup-overlay" v-if="$root.showLoginPopup" @click.self="$root.showLoginPopup = false" style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.8); z-index: 99999;">
                <div class="chat-login-card" style="background: var(--card-bg); padding: 24px; border-radius: 16px; width: 85%; max-width: 340px; text-align: center; position: relative;">
                    <button @click="$root.showLoginPopup = false" style="position: absolute; top: 12px; right: 12px; background: transparent; border: none; color: var(--text-muted); font-size: 24px; line-height:1; cursor: pointer;">×</button>
                    <svg viewBox="0 0 24 24" class="chat-login-icon" style="width: 48px; height: 48px; margin: 0 auto 16px; color: #9146FF;"><path fill="currentColor" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
                    <p class="chat-login-title" style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">Join the chat</p>
                    <p class="chat-login-sub" style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">Connect your Twitch account to read and send messages live.</p>
                    <a :href="twitchAuthUrl" class="twitch-login-btn" @click="$root.showLoginPopup = false" style="display: block; background: #9146FF; color: white; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: bold;">Connect with Twitch</a>
                </div>
            </div>
        </div>
    `
};

const MoreView = {
    template: `
        <div class="more-container safe-top-padding" style="flex: 1; overflow-y: auto; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; padding-left: 16px; padding-right: 16px; display: flex; flex-direction: column; gap: 8px;">
            
            <!-- Throne layout matched exactly to social row structure, sitting below safe bar -->
            <a href="https://throne.com/codemiko" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px; margin-bottom: 4px; background: var(--card-bg);">
                <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                    <!-- Gift Box SVG Icon next to Throne text -->
                    <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: #0ea5e9; flex-shrink:0;"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-.84-3-2-3-1.22 0-2.42 1.55-3 2.52-.58-.97-1.78-2.52-3-2.52-1.16 0-2 1.34-2 3 0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 16H4V8h16v11z"/></svg>
                    <span style="color: var(--text-main); font-size: 14px; font-weight: 600;">Throne</span> 
                    <span class="material-symbols-rounded" style="font-size: 20px; color: var(--text-muted); margin-left: auto;">push_pin</span>
                </div>
            </a>

            <a href="https://www.twitch.tv/codemiko" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: #9146FF;"><path fill="currentColor" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">Twitch</span>
            </a>
            
            <a href="https://www.youtube.com/@CodeMiko" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: #FF0000;"><path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">YouTube</span>
            </a>
            
            <a href="https://kick.com/codemiko" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: #53FC18;"><path fill="currentColor" d="M19 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zM10.1 14.5v3.3H7.4V6.2h2.7v4.6l3.3-4.6h3.4l-3.9 5.1 4.2 6.5h-3.5z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">Kick</span>
            </a>
            
            <a href="https://discord.com/invite/codemiko" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: #5865F2;"><path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">Discord</span>
            </a>

            <a href="https://app.fanfix.io/@codeyuna" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px;">
                    <defs>
                        <linearGradient id="fanfix-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#80f1f1" />
                            <stop offset="50%" stop-color="#d4a3fa" />
                            <stop offset="100%" stop-color="#ffd5af" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#fanfix-grad)" d="M11.23 1.59c.43-.65 1.11-.65 1.54 0l1.19 1.83c.22.33.7.53 1.09.43l2.12-.51c.74-.18 1.22.29 1.04 1.04l-.51 2.12c-.1.39.1.87.43 1.09l1.83 1.19c.65.43.65 1.11 0 1.54l-1.83 1.19c-.33.22-.53.7-.43 1.09l.51 2.12c.18.74-.29 1.22-1.04 1.04l-2.12-.51c-.39-.1-.87.1-1.09.43l-1.19 1.83c-.43.65-1.11.65-1.54 0l-1.19-1.83c-.22-.33-.7-.53-1.09-.43l-2.12.51c-.74.18-1.22-.29-1.04-1.04l.51-2.12c.1-.39-.1-.87-.43-1.09l-1.83-1.19c-.65-.43-.65-1.11 0-1.54l1.83-1.19c.33-.22.53-.7.43-1.09l-.51-2.12c-.18-.74.29-1.22 1.04-1.04l2.12.51c.39.1.87-.1 1.09-.43l1.19-1.83z"/>
                    <path fill="#000" d="M10.4 15.6l-3.2-3.2 1.4-1.4 1.8 1.8 4.8-4.8 1.4 1.4-6.2 6.2z"/>
                </svg>
                <span style="color: var(--text-main); font-size: 14px;">Fanfix</span>
            </a>
            
            <a href="https://www.tiktok.com/@codemiko" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: var(--text-main);"><path fill="currentColor" d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.41-.02-.21-.02-.41-.02-.62.07-1.44.62-2.83 1.51-3.89 1.05-1.25 2.55-2.06 4.15-2.28 1.1-.15 2.23-.04 3.27.35v4.06c-.34-.13-.7-.2-1.07-.22-.92-.04-1.84.28-2.51.86-.67.57-1.08 1.4-1.1 2.31-.01.91.38 1.77 1.03 2.38.65.61 1.56.93 2.49.88.92-.04 1.78-.45 2.38-1.11.58-.65.88-1.54.88-2.45V.02h-.03z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">TikTok</span>
            </a>
            
            <a href="https://twitter.com/codemiko" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: var(--text-main);"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">X</span>
            </a>
            
            <a href="https://www.instagram.com/thecodemiko/" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: #E1306C;"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">Instagram</span>
            </a>
            
            <a href="https://www.threads.net/@thecodemiko" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px;">
                <svg viewBox="0 0 192 192" class="social-icon" style="width: 22px; height: 22px; color: var(--text-main);"><path fill="currentColor" d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 148.82 38.8167C156.92 49.1302 161.965 62.4633 163.606 78.4714L179.626 76.5161C177.625 57.8427 171.603 42.4437 162.016 30.2526C148.337 12.8797 127.351 4.14819 97.0132 4C66.5826 4.15048 45.6416 12.9231 32.2274 30.0097C19.7891 45.8524 13.5676 68.1687 13.3333 96C13.5676 123.831 19.7891 146.148 32.2274 161.99C45.6416 179.077 66.5826 187.85 97.0135 188C120.89 187.828 137.234 181.71 151.782 167.175C168.181 150.793 167.149 127.877 155.839 116.666C153.491 114.339 150.569 112.502 147.289 111.164C145.452 110.387 143.541 109.664 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.0476C101.066 97.8658 103.146 97.7499 105.311 97.6976C105.328 103.626 104.996 109.431 103.743 114.862C102.593 119.851 100.865 124.316 98.4405 129.507Z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">Threads</span>
            </a>

            <a href="https://www.snapchat.com/add/codemiko" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: #FFFC00;"><path fill="currentColor" d="M12.126 23.955c-1.472-.036-2.502-.455-3.633-.949-.556-.242-1.077-.384-1.657-.202-1.542.483-3.082 1.054-4.73 1.127-1.393.061-1.777-.52-1.205-1.651.488-.962 1.031-1.895 1.48-2.871.21-.453.208-.857-.042-1.272-1.071-1.782-1.637-3.708-1.764-5.748-.04-.633-.037-1.27-.037-1.936 0-3.923 2.115-6.843 5.437-8.318C8.384.975 10.94.39 13.626.54c4.12.232 7.152 2.647 8.527 6.643.518 1.503.655 3.066.621 4.646-.025 1.156-.168 2.298-.485 3.407-.346 1.208-.887 2.336-1.688 3.32-.429.529-.395.96.012 1.488.35.452.704.9 1.057 1.349.52.661.274 1.236-.532 1.274-1.506.072-2.923-.509-4.321-1.052-.777-.302-1.411-.122-2.072.164-1.045.451-2.146.862-3.32.969-.379.034-.764.03-1.299.207z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">Snapchat</span>
            </a>
            
            <a href="https://www.facebook.com/codemikoofficial" target="_blank" class="social-card" style="flex: 1; padding: 0 16px; border-radius: 12px; min-height: 48px;">
                <svg viewBox="0 0 24 24" class="social-icon" style="width: 22px; height: 22px; color: #1877F2;"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span style="color: var(--text-main); font-size: 14px;">Facebook</span>
            </a>
            
            <div style="height: 80px; flex-shrink: 0;"></div>
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
        <div class="chat-emote-tray" v-show="showMinigames" style="position: absolute; bottom: 100%; border-bottom:none; border-radius:16px 16px 0 0; background: var(--bg-color); width: 100%;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 8px; width: 100%;">
                <button v-for="g in gameDeck" :key="g.id" class="bribe-btn" style="padding: 4px 2px; border-radius: 8px; background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-main); font-weight: bold; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;" @click.stop="$emit('play-game', g)">
                    <span style="font-size: 14px;">{{ g.label.split(' ')[0] }}</span>
                    <span style="font-size: 9px; line-height: 1; white-space: pre-wrap; padding: 0 2px;">{{ g.label.substring(g.label.indexOf(' ') + 1) }}</span>
                </button>
            </div>
        </div>
    `
};

const GeraldView = {
    components: { GeraldMinigames },
    props: ['currentTab', 'geraldMessages', 'isGeraldTyping', 'geraldInput', 'showEmotePicker', 'showMinigames', 'customEmotes', 'parseMarkdown', 'geminiStatus', 'sysStats'],
    methods: {
        getEmoteUrl(emote) { return emote.url || `https://cdn.discordapp.com/emojis/${emote.id}.${emote.animated ? 'gif' : 'png'}?size=44`; }
    },
    template: `
        <div class="gerald-container safe-top-padding" style="flex: 1; display: flex; flex-direction: column; height: 100%; overflow: hidden; position: relative;">
            <!-- Removed border-bottom styling to wipe the thin browser line error -->
            <div class="gerald-header" @click="$emit('close-pickers')" style="flex-shrink: 0; z-index: 50; border-bottom: none !important; box-shadow: none !important;">
                <div class="os-top-bar">
                    <span class="os-title">GERALD_OS v2</span>
                </div>
                
                <div class="gerald-sys-card-compressed" style="border-bottom: none !important;">
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

            <div class="gerald-messages" id="gerald-msgs" @click="$emit('close-pickers')" style="flex: 1; overflow-y: auto; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; display: flex; flex-direction: column; padding: 10px 16px 0;">
                <template v-for="(m, i) in geraldMessages" :key="i">
                    <div v-if="i === 0 && m.role === 'gerald' && !m.content" class="chat-bubble gerald startup-anim">
                        <span>> GERALD_CORE initialized.<br>> Awaiting human input...</span>
                    </div>
                    <div v-else-if="m.content" class="chat-bubble" :class="m.role" v-html="parseMarkdown(m.content)"></div>
                </template>

                <div v-show="isGeraldTyping" class="dots-thinking-row" style="display:flex; align-items:center; margin-top:8px; padding-left:12px;">
                    <div class="os-dot close"></div>
                    <div class="os-dot min"></div>
                    <div class="os-dot max"></div>
                </div>
                
                <div style="height: 75px; flex-shrink: 0; min-height: 75px;"></div>
            </div>
            
            <div class="gerald-action-area" style="position: absolute; bottom: calc(65px + env(safe-area-inset-bottom, 0px)); width: 100%; z-index: 50; padding-bottom: 5px;">
                <div class="chat-emote-tray" v-show="showEmotePicker" style="position: absolute; bottom: 100%; border-bottom:none; border-radius:16px 16px 0 0;">
                    <div class="emote-picker-grid" style="overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch;">
                        <img v-for="(emote, name) in customEmotes" :key="name" :src="getEmoteUrl(emote)" :title="name" class="emote-picker-img" @mousedown.prevent="$emit('insert-emote', name)">
                    </div>
                </div>

                <gerald-minigames :show-minigames="showMinigames" @play-game="g => $emit('play-game', g)"></gerald-minigames>

                <div class="gerald-input-area">
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

const HomeView = {
    props: ['currentTab', 'currentVodIndex', 'recentVods', 'isLive', 'hostname', 'clips', 'activeFilterLabel', 'optimizeTwitchImg', 'formatViews', 'formatDate', 'activeClipId'],
    template: `
        <div style="flex: 1; overflow-y: auto; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; padding-bottom: calc(85px + env(safe-area-inset-bottom, 0px));">
            <div class="hero-section">
                <div class="header-controls" style="margin-bottom:12px; display:flex;">
                    <div :class="['premium-badge', isLive ? 'live-badge' : 'vod']">
                        <div class="dot"></div>
                        <span>{{ isLive ? 'LIVE' : (recentVods[currentVodIndex] ? 'VOD • ' + recentVods[currentVodIndex].date : 'PAST STREAM') }}</span>
                    </div>
                </div>
                <div class="video-wrapper-outer">
                    <div class="video-container">
                        <iframe v-if="currentVodIndex === -1" id="miko-live-player" :src="'https://player.twitch.tv/?channel=codemiko&parent=' + hostname + '&autoplay=true&muted=true'" allow="autoplay; fullscreen" allowfullscreen></iframe>
                        <iframe v-else-if="recentVods && recentVods[currentVodIndex]" :src="'https://player.twitch.tv/?video=' + recentVods[currentVodIndex].id + '&parent=' + hostname + '&autoplay=false'" allow="autoplay; fullscreen" allowfullscreen></iframe>
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
    components: { SplashScreen, AppHeader, BottomNav, FilterMenu, ProfileModal, GeraldView, HomeView, ChatView, MoreView, ClipModal },
    setup() {
        const tabs = ['home', 'chat', 'gerald', 'more'];
        const initialHash = window.location.hash.replace('#', '');
        const currentTab = ref(tabs.includes(initialHash) ? initialHash : 'home');
        const appTheme = ref(localStorage.getItem('miko_theme') || 'light');
        const splashVisible = ref(true), splashOpacity = ref(1);
        const clips = ref([]), allClips = ref([]);
        const allClipsCount = computed(() => allClips.value.length);
        const modals = ref({ profile: false });
        const isLive = ref(false);
        const currentUser = ref(null);
        
        const loginEmail = ref('');
        const loginPass = ref('');
        const loginError = ref(''); 
        const showLoginPopup = ref(false);

        const hostname = window.location.hostname || 'meowoccino.github.io';
        const syncState = ref('Force Data Sync');
        const wipeState = ref('Wipe Gerald Memory');
        const logoutState = ref('Sign Out');
        const nukeState = ref('Nuke App Cache');
        
        const isHeaderVisible = ref(true);

        const apiConfig = ref({ localCid: localStorage.getItem('miko_twitch_cid') || '', localTkn: localStorage.getItem('twitch_tkn') || '' });
        const hiddenFallbackCid = 'i2fjxfk0oq6ybixle760zryrtvdqjg';
        const geminiStatus = ref('TESTING BRAIN...');
        const sysStats = ref({ cpu: 23, mem: 1.8, temp: 74 });

        const customEmotes = ref({});
        const myTwitchBadges = ref([]); 
        const activeClipId = ref(null);
        const currentClipOffset = ref(0);
        const isLoadingMore = ref(false);
        const allClipsLoaded = ref(false);

        const geraldInput = ref(''), geraldMessages = ref([{ role: 'gerald', content: '' }]);
        const isGeraldTyping = ref(false), showEmotePicker = ref(false), showMinigames = ref(false);
        const currentFilter = ref('latest'), activeFilterLabel = ref('Latest'), isFilterMenuOpen = ref(false);
        const recentVods = ref([]), currentVodIndex = ref(0);
        const selectedClip = ref(null);
        const chatMessages = ref([]);
        const twitchChatToken = ref(localStorage.getItem('tw_chat_token') || null);
        const twitchUsername = ref(localStorage.getItem('tw_username') || null);
        const twitchAuthUrl = ref('');
        let twitchWs = null;
        let wsAuthenticated = false;
        const badgeAssets = {};

        const tabOrder = ['home', 'chat', 'gerald', 'more'];
        const initialTabIdx = tabOrder.indexOf(tabs.includes(window.location.hash.replace('#','')) ? window.location.hash.replace('#','') : 'home');
        const tabOffset = ref(initialTabIdx * -25);

        const switchTab = (tab) => {
            currentTab.value = tab;
            tabOffset.value = tabOrder.indexOf(tab) * -25;
            window.history.pushState(null, '', `#${tab}`);
            if (tab === 'chat') setTimeout(() => { const l = document.getElementById('twitch-chat-list'); if (l) l.scrollTop = l.scrollHeight; }, 150);
            if (tab === 'gerald') setTimeout(scrollToBottom, 150);
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

        const clearGeraldHistory = async () => {
            if (!currentUser.value) return;
            wipeState.value = 'WIPING...';
            try {
                await sbClient.from('gerald_history').delete().eq('user_id', currentUser.value.id);
                geraldMessages.value = [{ role: 'gerald', content: '' }];
                wipeState.value = 'SUCCESS';
            } catch {
                wipeState.value = 'Wipe Gerald Memory';
            }
            setTimeout(() => { wipeState.value = 'Wipe Gerald Memory'; }, 2500);
        };

        const updateThemeClass = () => {
            document.body.className = 'theme-' + appTheme.value;
            const bgHex = appTheme.value === 'light' ? '#f8f9fa' : '#0d0d11';
            const m = document.querySelector('meta[name="theme-color"]');
            if (m) m.setAttribute('content', bgHex);
            document.documentElement.style.backgroundColor = bgHex;
            document.body.style.backgroundColor = bgHex;
        };
        
        const toggleTheme = () => { appTheme.value = appTheme.value === 'light' ? 'dark' : 'light'; localStorage.setItem('miko_theme', appTheme.value); updateThemeClass(); };
        const scrollChatToBottom = () => { setTimeout(() => { const l = document.getElementById('twitch-chat-list'); if (l) l.scrollTop = l.scrollHeight; }, 100); };

        const processEmotes = (text) => {
            let out = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const words = out.split(' ');
            const emoteKeys = Object.keys(customEmotes.value);
            for (let i = 0; i < words.length; i++) {
                const cleanWord = words[i].replace(/^:|:$/g, '');
                const actualKey = emoteKeys.find(k => k.toLowerCase() === cleanWord.toLowerCase());
                if (actualKey) { 
                    const match = customEmotes.value[actualKey];
                    if (match && match.url) words[i] = `<img src="${match.url}" class="chat-emote-img" title="${actualKey}">`; 
                }
            }
            return words.join(' ');
        };

        const parseIrcMessage = (raw) => {
            if (!raw || !raw.includes('PRIVMSG')) return;
            let tags = {}, line = raw;
            if (line.startsWith('@')) {
                const sp = line.indexOf(' ');
                line.substring(1, sp).split(';').forEach(t => { const [k, ...v] = t.split('='); tags[k] = v.join('='); });
                line = line.substring(sp + 1);
            }
            const matchUser = line.match(/:([^!]+)!/);
            const matchText = line.match(/PRIVMSG #[a-zA-Z0-9_]+ :(.+)/);
            if (!matchUser || !matchText) return;

            const user = tags['display-name'] || matchUser[1];
            const color = tags['color'] || '#9146FF';
            const text = matchText[1].trim();
            const d = new Date(tags['tmi-sent-ts'] ? parseInt(tags['tmi-sent-ts']) : Date.now());
            const timestamp = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const badges = [];
            if (tags['badges']) {
                tags['badges'].split(',').forEach(b => { const imgUrl = badgeAssets[b]; if (imgUrl) badges.push({ title: b.split('/')[0], img: imgUrl }); });
            }

            let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            if (tags['emotes']) {
                const replacements = [];
                tags['emotes'].split('/').forEach(e => {
                    const [id, positions] = e.split(':');
                    if (!positions) return;
                    positions.split(',').forEach(pos => { const [s, en] = pos.split('-').map(Number); replacements.push({ s, en, id }); });
                });
                replacements.sort((a, b) => b.s - a.s);
                const chars = [...text];
                replacements.forEach(({ s, en, id }) => {
                    const emoteName = chars.slice(s, en + 1).join('');
                    chars.splice(s, en - s + 1, `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0" class="chat-emote-img" title="${emoteName}">`);
                });
                html = chars.join('');
            } else {
                html = processEmotes(text);
            }

            chatMessages.value.push({ timestamp, username: user, html, color, badges });
            if (chatMessages.value.length > 200) chatMessages.value.shift();
            if (currentTab.value === 'chat') scrollChatToBottom();

            sbClient.from('twitch_chat_logs').insert({
                username: user,
                message: text,
                color: color,
                badges: badges 
            }).then();
        };

        const loadChatHistory = async () => {
            try {
                const { data } = await sbClient
                    .from('twitch_chat_logs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50);
                if (!data) return;
                const dbHistory = data.reverse().map(row => {
                    const ts = new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    let badges = [];
                    if (Array.isArray(row.badges)) {
                        badges = row.badges.filter(b => b && b.img);
                    }
                    return {
                        timestamp: ts,
                        username: row.username || 'user',
                        html: row.message.includes('<img') ? row.message : processEmotes(row.message),
                        color: row.color || '#9146FF',
                        badges
                    };
                });
                chatMessages.value = dbHistory;
                scrollChatToBottom();
            } catch(e) {}
        };

        const connectTwitchChat = () => {
            if (twitchWs) { try { twitchWs.close(); } catch(e) {} }
            wsAuthenticated = false;
            twitchWs = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
            twitchWs.onopen = () => {
                twitchWs.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
                if (twitchChatToken.value && twitchUsername.value) {
                    twitchWs.send(`PASS oauth:${twitchChatToken.value}`); twitchWs.send(`NICK ${twitchUsername.value}`); twitchWs.send('JOIN #codemiko');
                } else {
                    twitchWs.send('PASS oauth:anonymous'); twitchWs.send('NICK justinfan12345'); twitchWs.send('JOIN #codemiko');
                }
                wsAuthenticated = true;
            };
            twitchWs.onmessage = (e) => { 
                e.data.split('\r\n').forEach(raw => { 
                    if (raw.startsWith('PING')) { 
                        twitchWs.send('PONG :tmi.twitch.tv'); 
                    } else { 
                        if (raw.includes('USERSTATE') || raw.includes('GLOBALUSERSTATE')) {
                            let tags = {};
                            const tagsPart = raw.split(' ')[0];
                            if (tagsPart.startsWith('@')) {
                                tagsPart.substring(1).split(';').forEach(t => { const [k, ...v] = t.split('='); tags[k] = v.join('='); });
                                if (tags['badges']) {
                                    const parsedBadges = [];
                                    tags['badges'].split(',').forEach(b => { 
                                        const imgUrl = badgeAssets[b]; 
                                        if (imgUrl) parsedBadges.push({ title: b.split('/')[0], img: imgUrl }); 
                                    });
                                    myTwitchBadges.value = parsedBadges;
                                }
                            }
                        }
                        parseIrcMessage(raw); 
                    } 
                }); 
            };
        };

        const sendTwitchChatMessage = (msg) => {
            if (!msg || !twitchWs || !wsAuthenticated) return;
            twitchWs.send(`PRIVMSG #codemiko :${msg}`);
            const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            let myBadges = [];
            try {
                const storedBadges = localStorage.getItem('my_twitch_badges');
                if (storedBadges) myBadges = JSON.parse(storedBadges);
            } catch(e) {}

            const htmlMsg = processEmotes(msg);

            chatMessages.value.push({
                timestamp: ts,
                username: twitchUsername.value || 'You',
                html: htmlMsg,
                color: '#9146FF',
                badges: myTwitchBadges.value,
                isSelf: true
            });
            scrollChatToBottom();

            sbClient.from('twitch_chat_logs').insert({
                username: twitchUsername.value || 'You',
                message: msg,
                color: '#9146FF',
                badges: myTwitchBadges.value 
            }).then();
        };

        const disconnectTwitch = () => {
            twitchChatToken.value = null; twitchUsername.value = null;
            localStorage.removeItem('tw_chat_token'); localStorage.removeItem('tw_username');
            myTwitchBadges.value = [];
            loadChatHistory().then(() => connectTwitchChat());
        };

        const saveApiKeys = () => {
            localStorage.setItem('miko_twitch_cid', apiConfig.value.localCid);
            localStorage.setItem('twitch_tkn', apiConfig.value.localTkn);
            
            const activeCid = apiConfig.value.localCid || hiddenFallbackCid;
            twitchAuthUrl.value = 'https://id.twitch.tv/oauth2/authorize?client_id=' + activeCid + '&redirect_uri=' + encodeURIComponent('https://meowoccino.github.io/MikoTok/') + '&redirect_uri=' + encodeURIComponent(window.location.origin + window.location.pathname) + '&response_type=token&scope=chat:read+chat:edit&force_verify=true';
        };

        const loadTwitchBadges = async () => {
            const cid = apiConfig.value.localCid || hiddenFallbackCid;
            const token = apiConfig.value.localTkn || twitchChatToken.value;
            if (!token) return false;
            try {
                const [gRes, cRes] = await Promise.all([
                    fetch('https://api.twitch.tv/helix/chat/badges/global', { headers: { 'Client-ID': cid, 'Authorization': `Bearer ${token}` } }),
                    fetch('https://api.twitch.tv/helix/chat/badges?broadcaster_id=500128827', { headers: { 'Client-ID': cid, 'Authorization': `Bearer ${token}` } })
                ]);
                if (gRes.status === 401 || cRes.status === 401) return false;
                const gData = await gRes.json(), cData = await cRes.json();
                if (gData?.data) gData.data.forEach(s => s.versions.forEach(v => { badgeAssets[`${s.set_id}/${v.id}`] = v.image_url_1x; }));
                if (cData?.data) cData.data.forEach(s => s.versions.forEach(v => { badgeAssets[`${s.set_id}/${v.id}`] = v.image_url_1x; }));
                return true;
            } catch { return false; }
        };

        const load7TVEmotes = async () => {
            try {
                const [gRes, cRes] = await Promise.all([
                    fetch('https://7tv.io/v3/emote-sets/global'), fetch('https://7tv.io/v3/users/twitch/500128827')
                ]);
                const gData = await gRes.json(), cData = await cRes.json();
                if (gData.emotes) gData.emotes.forEach(e => { customEmotes.value[e.name] = { url: `https://cdn.7tv.app/emote/${e.data.id}/1x.webp` }; });
                if (cData.emote_set?.emotes) cData.emote_set.emotes.forEach(e => { customEmotes.value[e.name] = { url: `https://cdn.7tv.app/emote/${e.data.id}/1x.webp` }; });
            } catch {}
        };

        const testGeminiBrain = async () => {
            try {
                const { data, error } = await sbClient.functions.invoke('gerald-chat', { body: { history: [{ role: 'user', parts: [{ text: 'ping' }] }] } });
                geminiStatus.value = (!error && data) ? 'API_CONNECTED' : 'API_DISCONNECTED';
            } catch { geminiStatus.value = 'API_DISCONNECTED'; }
        };

        const handleGeraldEnter = (e) => {
            if (!e.shiftKey && e.key === 'Enter') {
                e.preventDefault();
                talkToGerald();
            }
        };

        const triggerAiMinigame = (gameObj) => {
            geraldInput.value = "";
            closePickers();
            
            const logMsg = `**[EVENT: ${gameObj.label} Protocol Activated]**`;
            geraldMessages.value.push({ role: 'user', content: logMsg });
            
            if (currentUser.value) {
                sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'user', content: logMsg }).then();
            }
            
            isGeraldTyping.value = true;
            nextTick(scrollToBottom);

            const contextHistory = geraldMessages.value.slice(-10).map(m => ({ role: m.role === 'gerald' ? 'model' : 'user', parts: [{ text: m.content }] }));

            sbClient.functions.invoke('gerald-chat', { 
                body: { history: contextHistory, system_directive: gameObj.prompt } 
            }).then(({ data, error }) => {
                if (!error && data?.reply) {
                    geraldMessages.value.push({ role: 'gerald', content: data.reply.trim() });
                    if (currentUser.value) {
                        sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'gerald', content: data.reply.trim() }).then();
                    }
                } else {
                    geraldMessages.value.push({ role: 'gerald', content: '> MALFUNCTION: Internal hardware override processing failure.' });
                }
            }).catch(() => {
                geraldMessages.value.push({ role: 'gerald', content: '> MALFUNCTION: Core logic offline.' });
            }).finally(() => {
                isGeraldTyping.value = false;
                nextTick(scrollToBottom);
            });
        };

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

            isGeraldTyping.value = true; closePickers(); nextTick(scrollToBottom);
            const geminiHistory = geraldMessages.value.slice(-12).map(m => ({ role: m.role === 'gerald' ? 'model' : 'user', parts: [{ text: m.content }] }));

            try {
                const { data, error } = await sbClient.functions.invoke('gerald-chat', { body: { history: geminiHistory } });
                if (!error && data?.reply) {
                    geraldMessages.value.push({ role: 'gerald', content: data.reply.trim() });
                    if (currentUser.value) {
                        sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'gerald', content: data.reply.trim() }).then();
                    }
                } else throw error;
            } catch { geraldMessages.value.push({ role: 'gerald', content: '> SYSTEM FAILURE: Core sync interrupted.' }); }
            finally { isGeraldTyping.value = false; nextTick(scrollToBottom); }
        };

        const nextVod = () => { if (currentVodIndex.value < recentVods.value.length - 1) currentVodIndex.value++; };
        const prevVod = () => { if (currentVodIndex.value > (isLive.value ? -1 : 0)) currentVodIndex.value--; };
        const closeFilterMenu = () => { isFilterMenuOpen.value = false; };
        const playClip = (clip) => { selectedClip.value = clip; };
        const insertEmote = (name) => { if (currentTab.value === 'gerald') geraldInput.value += ` :${name}: `; };
        const scrollToBottom = () => { const b = document.getElementById('gerald-msgs'); if (b) b.scrollTop = b.scrollHeight; };
        const toggleEmotes = () => { showEmotePicker.value = !showEmotePicker.value; showMinigames.value = false; };
        const toggleMinigames = () => { showMinigames.value = !showMinigames.value; showEmotePicker.value = false; };
        const closePickers = () => { showEmotePicker.value = false; showMinigames.value = false; };

        const applyFilter = (key, label) => {
            currentFilter.value = key; activeFilterLabel.value = label; isFilterMenuOpen.value = false;
            allClipsLoaded.value = false;
            allClips.value = [];
            currentClipOffset.value = 0;
            const el = document.getElementById('home-scroll'); if (el) nextTick(() => el.scrollTop = 0);
            loadData(false);
        };

        const handleScroll = (e) => {
            if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 200) { if (currentTab.value === 'home') loadData(true); }
        };

        const loadData = async (isLoadMore = false) => {
            if (isLoadingMore.value || allClipsLoaded.value) return; isLoadingMore.value = true;
            try {
                if (!isLoadMore) {
                    currentClipOffset.value = 0; allClipsLoaded.value = false; allClips.value = [];
                    const { data } = await sbClient.from('emotes').select('*');
                    if (data) data.forEach(e => { customEmotes.value[e.name] = { id: e.id, animated: e.animated }; });
                }
                
                let query = sbClient.from('clips').select('*');
                const now = new Date();
                
                if (currentFilter.value === 'weekly') {
                    const weeklyDate = new Date(now.getTime() - 7*24*3600*1000).toISOString();
                    query = query.gte('created_at', weeklyDate);
                } else if (currentFilter.value === 'month') {
                    const monthlyDate = new Date(now.getTime() - 30*24*3600*1000).toISOString();
                    query = query.gte('created_at', monthlyDate);
                } else if (currentFilter.value === '6months') {
                    const sixMonthDate = new Date(now.getTime() - 180*24*3600*1000).toISOString();
                    query = query.gte('created_at', sixMonthDate);
                } else {
                    const yearAgo = new Date(now.getTime() - 365*24*3600*1000).toISOString();
                    query = query.gte('created_at', yearAgo);
                }

                if (currentFilter.value === 'latest') {
                    query = query.order('created_at', { ascending: false });
                } else {
                    query = query.order('view_count', { ascending: false });
                }

                const { data: c } = await query.range(currentClipOffset.value, currentClipOffset.value + 99);
                if (c && c.length > 0) { allClips.value.push(...c); currentClipOffset.value += 100; clips.value = allClips.value; }
                else { allClipsLoaded.value = true; }
            } catch {} finally { isLoadingMore.value = false; }
        };

        const checkLive = async () => {
            try {
                const res = await fetch('https://decapi.me/twitch/uptime/codemiko');
                isLive.value = !(await res.text()).includes('offline');
                const gql = await fetch('https://gql.twitch.tv/gql', { method: 'POST', headers: { 'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko' }, body: JSON.stringify({ query: `query{user(login:"codemiko"){videos(first:10){edges{node{id createdAt}}}}}` }) });
                const edges = (await gql.json()).data.user.videos.edges;
                recentVods.value = edges.map(e => ({ id: e.node.id, date: new Date(e.node.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() }));
                if (currentVodIndex.value === 0 || currentVodIndex.value === -1) currentVodIndex.value = isLive.value ? -1 : 0;
            } catch {}
        };

        const runSync = async () => {
            syncState.value = 'SYNCING...';
            await load7TVEmotes();
            const success = await loadTwitchBadges();
            if (!success && apiConfig.value.localTkn) { syncState.value = 'ERROR'; setTimeout(() => { syncState.value = 'Force Data Sync'; }, 2500); return; }
            await loadData(false); await checkLive(); await testGeminiBrain();
            syncState.value = 'SUCCESS'; setTimeout(() => { syncState.value = 'Force Data Sync'; }, 2500);
        };

        const parseMarkdown = (t) => {
            if (!t) return ''; 
            let html = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
            const words = html.split(' ');
            const emoteKeys = Object.keys(customEmotes.value);
            for (let i = 0; i < words.length; i++) {
                const clean = words[i].replace(/^:|:$/g, ''); 
                const actualKey = emoteKeys.find(k => k.toLowerCase() === clean.toLowerCase());
                if (actualKey) {
                    const m = customEmotes.value[actualKey];
                    words[i] = `<img src="${m.url || `https://cdn.discordapp.com/emojis/${m.id}.png`}" style="height:1.65em; vertical-align:middle; display:inline-block; margin:0 2px;" title="${actualKey}">`;
                }
            }
            return words.join(' ');
        };

        const nukeCache = async () => {
            if (nukeState.value !== 'Nuke App Cache') return; nukeState.value = 'NUKING...';
            try {
                if ('serviceWorker' in navigator) { const regs = await navigator.serviceWorker.getRegistrations(); for (let r of regs) await r.unregister(); }
                if ('caches' in window) { const keys = await caches.keys(); for (let k of keys) await caches.delete(k); }
                nukeState.value = 'SUCCESS'; setTimeout(() => { window.location.reload(); }, 1000);
            } catch { nukeState.value = 'ERROR'; setTimeout(() => { nukeState.value = 'Nuke App Cache'; }, 2500); }
        };

        onMounted(async () => {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
            document.documentElement.style.overflow = 'hidden';

            updateThemeClass();
            if (window.location.hash.includes('access_token')) {
                const params = new URLSearchParams(window.location.hash.substring(1));
                if (params.get('access_token')) { twitchChatToken.value = params.get('access_token'); localStorage.setItem('tw_chat_token', twitchChatToken.value); window.location.hash = '#chat'; }
            }

            const activeCid = apiConfig.value.localCid || hiddenFallbackCid;
            twitchAuthUrl.value = 'https://id.twitch.tv/oauth2/authorize?client_id=' + activeCid + '&redirect_uri = ' + encodeURIComponent('https://meowoccino.github.io/MikoTok/') + '&redirect_uri=' + encodeURIComponent(window.location.origin + window.location.pathname) + '&response_type=token&scope=chat:read+chat:edit&force_verify=true';

            await load7TVEmotes();
            await loadTwitchBadges();
            await loadChatHistory();
            
            if (twitchChatToken.value) {
                fetch('https://id.twitch.tv/oauth2/validate', { headers: { 'Authorization': 'OAuth ' + twitchChatToken.value } }).then(r => r.json()).then(d => { if (d.login) { twitchUsername.value = d.login; localStorage.setItem('tw_username', d.login); connectTwitchChat(); } else disconnectTwitch(); }).catch(() => connectTwitchChat());
            } else connectTwitchChat();

            try { 
                const { data } = await sbClient.auth.getSession(); 
                if (data?.session?.user) {
                    currentUser.value = data.session.user; 
                    const { data: hist } = await sbClient.from('gerald_history').select('*').eq('user_id', currentUser.value.id).order('created_at', { ascending: true });
                    if (hist && hist.length > 0) {
                        geraldMessages.value = hist.map(r => ({ role: r.role, content: r.content }));
                    } else {
                        geraldMessages.value = [{ role: 'gerald', content: '' }];
                    }
                }
            } catch {}

            await loadData(false); await checkLive(); await testGeminiBrain();

            setInterval(() => {
                sysStats.value.cpu = Math.floor(Math.random() * (48 - 14 + 1)) + 14;
                sysStats.value.temp = Math.floor(Math.random() * (89 - 68 + 1)) + 68;
            }, 3500);

            splashOpacity.value = 0; 
            splashVisible.value = false;
        });

        return {
            hostname, splashVisible, splashOpacity, currentTab, tabOffset, appTheme, toggleTheme, clips, allClipsCount, modals, isLive, currentUser, loginEmail, loginPass, loginError, showLoginPopup, apiConfig, geraldInput, geraldMessages, isGeraldTyping, talkToGerald, syncState, wipeState, logoutState, nukeState, isHeaderVisible, handleScroll, currentFilter, activeFilterLabel, isFilterMenuOpen, closeFilterMenu, applyFilter, parseMarkdown, recentVods, currentVodIndex, nextVod, prevVod, customEmotes, showEmotePicker, insertEmote, handleGeraldEnter, toggleEmotes, toggleMinigames, closePickers, nukeCache, activeClipId, switchTab, playClip, selectedClip, showMinigames, runSync, disconnectTwitch, saveApiKeys, triggerAiMinigame, geminiStatus, sysStats, chatMessages, twitchChatToken, twitchAuthUrl, twitchUsername, sendTwitchChatMessage, handleSwipeStart, handleSwipeEnd, handleModalTouchStart, handleModalTouchMove, handleModalTouchEnd, clearGeraldHistory, logoSvg: (id) => `<svg viewBox="0 0 100 100"><defs><linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9146FF"/><stop offset="100%" stop-color="#a970ff"/></linearGradient></defs><circle cx="50" cy="50" r="40" fill="url(#grad-${id})"/><path d="M 33 38 L 48 62 L 62 38 L 62 55 Q 62 65 69 64" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            handleLogin: async () => { 
                loginError.value = '';
                try {
                    if (!loginEmail.value || !loginPass.value) {
                        loginError.value = 'Please enter email and password.';
                        return;
                    }
                    const email = loginEmail.value.includes('@') ? loginEmail.value : `${loginEmail.value}@miko.com`; 
                    const { data, error } = await sbClient.auth.signInWithPassword({ email, password: loginPass.value }); 
                    
                    if (error) {
                        loginError.value = 'Invalid email or password.';
                        return;
                    }
                    if (data.user) { 
                        currentUser.value = data.user; 
                        modals.value.profile = false; 
                        loginEmail.value = '';
                        loginPass.value = '';
                        
                        const { data: hist } = await sbClient.from('gerald_history').select('*').eq('user_id', currentUser.value.id).order('created_at', { ascending: true });
                        if (hist && hist.length > 0) { 
                            geraldMessages.value = hist.map(r => ({ role: r.role, content: r.content })); 
                        }
                        await loadChatHistory();
                    } 
                } catch (err) {
                    loginError.value = 'System Error. Please try again.';
                }
            },
            handleLogout: () => { logoutState.value = 'LOGGING OUT...'; setTimeout(() => { sbClient.auth.signOut(); currentUser.value = null; modals.value.profile = false; logoutState.value = 'Sign Out'; }, 1000); },
            optimizeTwitchImg: (u) => u ? u.replace('%{width}', '480').replace('%{height}', '270') : '',
            formatViews: (v) => v ? v.toLocaleString() : '0',
            formatDate: (d) => new Date(d).toLocaleDateString([], {month:'short', day:'numeric'})
        };
    }
}).mount('#app-container');
