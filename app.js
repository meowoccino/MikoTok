const ToastPopup = {
    props: ['toast'],
    template: `<div class="toast-popup" :class="{ show: toast.visible }" v-html="toast.message"></div>`
};

const SplashScreen = {
    props: ['splashVisible', 'splashOpacity', 'logoSvg'],
    template: `<div id="splash-screen" v-if="splashVisible" :style="{ opacity: splashOpacity }"><div style="width:100px;height:100px;margin-bottom:20px;" v-html="logoSvg('splash')"></div><div class="gradient-text" style="font-size: 32px; font-weight: 900;">MikoTok</div><div class="progress-bar"><div class="progress-fill"></div></div></div>`
};

const PullToRefresh = {
    props: ['isPulling', 'refreshTransform', 'isRefreshing'],
    template: `<div class="pull-refresh-indicator" :class="{ pulling: isPulling }" :style="{ transform: refreshTransform }"><span class="material-symbols-rounded" :class="{ 'refresh-spinning': isRefreshing }">sync</span></div>`
};

const AppHeader = {
    props: ['isHeaderVisible', 'currentTab', 'isLive', 'logoSvg'],
    template: `<header class="app-header" :class="{ hidden: !isHeaderVisible }" v-if="currentTab === 'home' || currentTab === 'feed'"><div style="display:flex; align-items:center; gap:10px;"><div style="width:28px;height:28px; cursor:pointer;" v-html="logoSvg('header')" @click="$emit('open-profile')"></div><span class="gradient-text" style="font-size:20px; font-weight:900;">MikoTok</span></div><div style="display:flex; align-items:center; gap: 15px;"><a href="https://twitch.tv/codemiko" target="_blank" class="header-status-wrapper"><div class="story-ring" :class="isLive ? 'live' : 'offline'"><img src="1000018850.png?v=2" class="story-avatar" alt="Miko"><div class="header-badge" :class="isLive ? 'live' : 'offline'">{{ isLive ? 'LIVE' : 'OFFLINE' }}</div></div></a></div></header>`
};

const BottomNav = {
    props: ['currentTab'],
    template: `<nav class="bottom-nav"><div class="nav-item" :class="{ active: currentTab === 'home' }" @click="$emit('change-tab', 'home')"><span class="material-symbols-rounded">home</span>Home</div><div class="nav-item" :class="{ active: currentTab === 'chat' }" @click="$emit('change-tab', 'chat')"><span class="material-symbols-rounded">chat</span>Chat</div><div class="nav-item" :class="{ active: currentTab === 'feed' }" @click="$emit('change-tab', 'feed')"><span class="material-symbols-rounded">forum</span>Feed</div><div class="nav-item" @click="$emit('open-discord')"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="margin-bottom:4px"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0314a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>Discord</div><div class="nav-item" :class="{ 'active-gerald': currentTab === 'gerald' }" @click="$emit('change-tab', 'gerald')"><span class="material-symbols-rounded">graphic_eq</span>Gerald</div></nav>`
};

const DiscordModal = {
    props: ['isOpen'],
    template: `<div class="modal-overlay" :class="{ open: isOpen }" @click.self="$emit('close')"><div class="modal-content" style="text-align: center; align-items: center;" @touchstart="$emit('touch-start', $event)" @touchmove="$emit('touch-move', $event)" @touchend="$emit('touch-end', $event)"><div class="drag-handle"></div><div style="width: 64px; height: 64px; background: rgba(88, 101, 242, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;"><svg viewBox="0 0 24 24" width="36" height="36" fill="var(--discord)"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0314a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></div><h2 style="font-size: 24px; font-family: 'Outfit'; font-weight: 900; margin: 0 0 10px;">Join the Community</h2><p style="color: var(--text-muted); font-size: 14px; margin: 0 0 30px; line-height: 1.6;">You are about to leave MikoTok and open CodeMiko's official Discord server.</p><div style="display: flex; flex-direction: column; gap: 12px; width: 100%;"><a href="https://discord.com/invite/codemiko" target="_blank" @click="$emit('close')" style="background: var(--discord); color: white; padding: 18px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;">LAUNCH DISCORD</a><button @click="$emit('close')" style="background: transparent; border: none; color: var(--text-muted); padding: 16px; font-weight: 700;">CANCEL</button></div></div></div>`
};

const FilterMenu = {
    props: ['isOpen', 'currentFilter'],
    template: `<div class="sheet-overlay" :class="{ open: isOpen }" @click.self="$emit('close')"><div class="bottom-sheet" @click.stop><div class="drag-handle"></div><button class="sheet-option" :class="{ active: currentFilter === 'latest' }" @click="$emit('apply', 'latest', 'Latest')">Latest</button><button class="sheet-option" :class="{ active: currentFilter === 'weekly' }" @click="$emit('apply', 'weekly', 'Weekly')">Weekly</button><button class="sheet-option" :class="{ active: currentFilter === 'month' }" @click="$emit('apply', 'month', 'Monthly')">Monthly</button><button class="sheet-option" :class="{ active: currentFilter === '6months' }" @click="$emit('apply', '6months', '6 Months')">6 Months</button><button class="sheet-option" :class="{ active: currentFilter === 'alltime' }" @click="$emit('apply', 'alltime', 'All Time')">All Time</button></div></div>`
};

const ProfileModal = {
    props: ['isOpen', 'currentUser', 'loginEmail', 'loginPass', 'apiConfig', 'syncState', 'wipeState', 'logoutState'],
    template: `<div class="modal-overlay" :class="{ open: isOpen }" @click.self="$emit('close')"><div class="modal-content" @touchstart="$emit('touch-start', $event)" @touchmove="$emit('touchmove', $event)" @touchend="$emit('touch-end', $event)"><div class="drag-handle"></div><div v-if="!currentUser"><input type="text" :value="loginEmail" @change="$emit('update-email', $event.target.value)" class="input-box" style="margin-top: 10px;" placeholder="Email"><input type="password" :value="loginPass" @change="$emit('update-pass', $event.target.value)" class="input-box" @keyup.enter="$emit('login')" placeholder="Password"><button class="sync-btn" @click="$emit('login')">LOGIN</button></div><div v-else><div class="infra-bar"><div class="status-node"><div class="pulse"></div> SYSTEM: READY</div></div><div class="stat-grid"><a href="https://github.com/meowoccino/MikoTok" target="_blank" class="external-link-btn"><span class="material-symbols-rounded">code</span>GitHub Repo</a><a href="https://supabase.com/dashboard/project/yhxcuayiwqpjvalyrcqv" target="_blank" class="external-link-btn"><span class="material-symbols-rounded">database</span>Supabase DB</a></div><div class="settings-block"><div class="block-title">TWITCH API CONFIG</div><input type="text" class="sleek-input" :value="apiConfig.cid" @change="$emit('update-api', 'cid', $event.target.value)" placeholder="Client ID"><input type="password" class="sleek-input" :value="apiConfig.tkn" @change="$emit('update-api', 'tkn', $event.target.value)" placeholder="Access Token"></div><div class="action-menu"><button class="menu-btn sync-row" :style="syncState === 'sync-success' ? 'color: var(--success);' : ''" @click="$emit('sync')" :disabled="syncState !== 'idle'"><div class="btn-content"><div class="icon-wrap" :style="syncState === 'sync-success' ? 'background: rgba(0, 255, 163, 0.15);' : ''"><span class="material-symbols-rounded" style="font-size: 18px;">sync</span></div><span>{{ syncState === 'syncing' ? 'SYNCING...' : (syncState === 'sync-success' ? 'SUCCESS' : 'Force Data Sync') }}</span></div></button><button class="menu-btn wipe-row" :style="wipeState === 'success' ? 'color: var(--success);' : ''" @click="$emit('wipe')" :disabled="wipeState !== 'idle'"><div class="btn-content"><div class="icon-wrap" :style="wipeState === 'success' ? 'background: rgba(0, 255, 163, 0.15);' : ''"><span class="material-symbols-rounded" style="font-size: 18px;">delete</span></div><span>{{ wipeState === 'wiping' ? 'WIPING...' : (wipeState === 'success' ? 'MEMORY WIPED!' : 'Wipe Gerald OS Memory') }}</span></div></button><button class="menu-btn logout-row" @click="$emit('logout')" :disabled="logoutState !== 'idle'"><div class="btn-content"><div class="icon-wrap"><span class="material-symbols-rounded" style="font-size: 18px;">logout</span></div><span>{{ logoutState === 'logging_out' ? 'SIGNING OUT...' : 'Sign Out' }}</span></div></button></div></div></div></div>`
};

const GeraldView = {
    props: ['currentTab', 'geraldMessages', 'isGeraldTyping', 'geraldInput', 'showEmotePicker', 'showMinigames', 'customEmotes', 'parseMarkdown'],
    template: `<div class="gerald-container" v-show="currentTab === 'gerald'"><div class="gerald-header" @click="$emit('close-pickers')"><div style="position:relative; z-index: 10;"><div style="width: 70px; height: 70px; border-radius: 50%; border: 2px solid var(--gerald); box-shadow: 0 0 20px rgba(14, 165, 233, 0.3); overflow: hidden; margin-bottom: 6px; background-color: #111; display: flex; align-items: center; justify-content: center; cursor: pointer;"><img src="gerald.png" style="width: 100%; height: 100%; object-fit: cover;" alt="G"></div></div><div style="display:flex; align-items:center; gap:8px; margin-top:0px;"><div class="pulse" style="background:var(--gerald); box-shadow:0 0 10px var(--gerald);"></div><div style="font-size:11px; color:var(--text-muted); font-weight:800; letter-spacing:1px; text-transform: uppercase;">System Online</div></div></div><transition-group name="msg" tag="div" class="gerald-messages" id="gerald-msgs" @click="$emit('close-pickers')"><template v-for="(m, i) in geraldMessages" :key="i"><div v-if="i === 0 && m.role === 'gerald'" class="terminal-intro"><div class="terminal-header"><span class="material-symbols-rounded" style="font-size: 14px;">terminal</span> Session Initialized</div><div class="terminal-text">> Loading synapses...<br>> "${'{{ m.content }}'}"</div></div><div v-else class="chat-bubble" :class="m.role" v-html="parseMarkdown(m.content)"></div></template><div v-if="isGeraldTyping" key="typing" class="typing-indicator"><div class="pulse" style="background:var(--gerald); box-shadow:0 0 10px var(--gerald);"></div>COMPUTING...</div></transition-group><div style="display:flex; flex-direction:column; background: var(--bg-color); width: 100%;"><transition name="tray"><div class="tray-container" v-show="showEmotePicker"><img v-for="(emote, name) in customEmotes" :key="name" :src="'https://cdn.discordapp.com/emojis/' + emote.id + '.' + (emote.animated ? 'gif' : 'png') + '?size=44'" class="emote-picker-img" @click="$emit('insert-emote', name)"></div></transition><transition name="tray"><div class="tray-container" v-show="showMinigames"><button class="bribe-btn" @click="$emit('play-game', 'shader')">🔥 Compile UE5</button><button class="bribe-btn" @click="$emit('play-game', 'drift')">🩰 Fix Foot Drift</button><button class="bribe-btn" @click="$emit('play-game', 'boba')">🥤 Boba Spill</button><button class="bribe-btn" @click="$emit('play-game', 'pineapple')">🚪 Pineapple Walk-In</button><button class="bribe-btn" @click="$emit('play-game', 'bits')">🎟️ 100K Bits</button><button class="bribe-btn" @click="$emit('play-game', 'dust')">🎤 Dusty Mic</button><button class="bribe-btn" @click="$emit('play-game', 'throttle')">📉 Throttling</button><button class="bribe-btn" @click="$emit('play-game', 'sniper')">🎯 Counter Snipers</button><button class="bribe-btn" @click="$emit('play-game', 'yusha')">👑 Yusha Logic</button><button class="bribe-btn" @click="$emit('play-game', 'asmr')">👂 ASMR Mode</button><button class="bribe-btn" @click="$emit('play-game', 'intercept')">🧋 Intercept Tea</button><button class="bribe-btn" @click="$emit('play-game', 'charge')">🔋 Charge Xsens</button><button class="bribe-btn" @click="$emit('play-game', 'ping')">🔔 Ping @everyone</button><button class="bribe-btn" @click="$emit('play-game', 'chroma')">🟢 Clear Chroma</button><button class="bribe-btn" @click="$emit('play-game', 'speedrun')">⏱️ Speedrun Fail</button><button class="bribe-btn" @click="$emit('play-game', 'router')">📡 Kick Router</button><button class="bribe-btn" @click="$emit('play-game', 'taco')">🌮 Offer Taco</button><button class="bribe-btn" @click="$emit('play-game', 'whiskey')">🥃 Pour Whiskey</button><button class="bribe-btn" @click="$emit('play-game', 'egg')">🥚 Ostrich Egg</button><button class="bribe-btn" @click="$emit('play-game', 'gummy')">🧸 Gummy Bears</button><button class="bribe-btn" @click="$emit('play-game', 'booba')">🎚️ Booba Slider</button><button class="bribe-btn" @click="$emit('play-game', 'clanker')">🤖 Call Clanker</button><button class="bribe-btn" @click="$emit('play-game', 'mute')">🔇 Mute Mic</button><button class="bribe-btn" @click="$emit('play-game', 'desk')">🧹 Scan Desk</button><button class="bribe-btn" @click="$emit('play-game', 'bald')">🧑‍🦲 Delete Hair</button><button class="bribe-btn" @click="$emit('play-game', 'demon')">🎙️ Demon Voice</button><button class="bribe-btn" @click="$emit('play-game', 'tracker')">🔌 Drop Tracker</button><button class="bribe-btn" @click="$emit('play-game', 'guest')">📺 Guest Crash</button></div></transition><div class="gerald-input-area"><div class="gerald-input-wrapper"><button class="emote-toggle-btn" @click="$emit('toggle-emotes')"><span class="material-symbols-rounded" :style="{ color: showEmotePicker ? 'var(--gerald)' : 'inherit' }">mood</span></button><button class="emote-toggle-btn" @click="$emit('toggle-minigames')"><span class="material-symbols-rounded" :style="{ color: showMinigames ? 'var(--gerald)' : 'inherit' }">sports_esports</span></button><textarea class="gerald-input" rows="1" placeholder="Query the system..." :value="geraldInput" @input="$emit('update-input', $event.target.value)" @keydown="$emit('key-down', $event)" id="gerald-txt-input" @focus="$emit('close-pickers')"></textarea></div><button class="gerald-send" @click="$emit('send')"><span class="material-symbols-rounded">send</span></button></div></div></div>`
};

const FeedView = {
    props: ['currentTab', 'isRefreshing', 'ytFeed', 'ytCurrentIndex', 'redditFeed', 'redditCurrentIndex', 'formatNumber'],
    template: `<div class="feed-layout" :class="{ active: isRefreshing }" v-show="currentTab === 'feed'"><div id="yt-wrapper"><div v-if="ytFeed && ytFeed.length > 0"><div class="vod-animated-border" style="background-image: linear-gradient(90deg, #27272a, var(--youtube), #27272a);"><div class="video-container"><iframe v-if="ytFeed[ytCurrentIndex] && currentTab === 'feed'" :src="'https://www.youtube.com/embed/' + ytFeed[ytCurrentIndex].id" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div></div><div class="carousel-controls"><button class="carousel-btn" :class="{ 'hidden-arrow': ytCurrentIndex <= 0 }" @click.stop="$emit('prev-yt')"><span class="material-symbols-rounded">chevron_left</span></button><button class="carousel-btn" :class="{ 'hidden-arrow': ytCurrentIndex >= ytFeed.length - 1 }" @click.stop="$emit('next-yt')"><span class="material-symbols-rounded">chevron_right</span></button></div></div><div v-else style="display: flex; justify-content: center; padding: 40px; color: var(--text-muted); font-size: 12px; font-style: italic;"><span class="material-symbols-rounded spin-anim" style="margin-right: 8px;">sync</span> Fetching from YouTube...</div></div><div id="reddit-wrapper"><div v-if="redditFeed && redditFeed.length > 0" style="display:flex; flex-direction:column; height:100%;"><a :href="'https://reddit.com' + redditFeed[redditCurrentIndex].permalink" target="_blank" class="reddit-compact-card"><div class="reddit-header"><div class="reddit-author">Posted • {{ redditFeed[redditCurrentIndex].date }}<br><span>u/{{ redditFeed[redditCurrentIndex].author }}</span></div><span v-if="redditFeed[redditCurrentIndex].link_flair_text" style="background: rgba(255, 69, 0, 0.15); border: 1px solid rgba(255, 69, 0, 0.3); color: var(--reddit); font-size: 9px; font-weight: 800; padding: 3px 6px; border-radius: 6px; text-transform: uppercase;">{{ redditFeed[redditCurrentIndex].link_flair_text }}</span></div><div v-if="redditFeed[redditCurrentIndex] && redditFeed[redditCurrentIndex].thumbnail && redditFeed[redditCurrentIndex].thumbnail.startsWith('http')" class="reddit-img-container"><img :src="'https://images.weserv.nl/?url=' + encodeURIComponent(redditFeed[redditCurrentIndex].thumbnail)" onerror="this.closest('div').style.display='none'" alt="Reddit Media"></div><div class="reddit-post-title" :style="redditFeed[redditCurrentIndex] && redditFeed[redditCurrentIndex].thumbnail && redditFeed[redditCurrentIndex].thumbnail.startsWith('http') ? '' : 'flex: 1;'">{{ redditFeed[redditCurrentIndex].title }}</div><div class="reddit-actions"><div style="display: flex; align-items: center; gap: 4px; color: var(--reddit);"><span class="material-symbols-rounded" style="font-size: 16px;">arrow_upward</span> {{ formatNumber(redditFeed[redditCurrentIndex].ups) }}</div><div style="display: flex; align-items: center; gap: 4px;"><span class="material-symbols-rounded" style="font-size: 16px;">chat_bubble</span> {{ formatNumber(redditFeed[redditCurrentIndex].num_comments) }}</div><div style="margin-left: auto; color: #a1a1aa; display: flex; align-items: center; gap: 4px; font-size: 11px; text-transform: uppercase;">Open <span class="material-symbols-rounded" style="font-size: 14px;">open_in_new</span></div></div></a><div class="carousel-controls"><button class="carousel-btn" :class="{ 'hidden-arrow': redditCurrentIndex <= 0 }" @click.stop="$emit('prev-reddit')"><span class="material-symbols-rounded">chevron_left</span></button><button class="carousel-btn" :class="{ 'hidden-arrow': redditCurrentIndex >= redditFeed.length - 1 }" @click.stop="$emit('next-reddit')"><span class="material-symbols-rounded">chevron_right</span></button></div></div><div v-else style="display: flex; justify-content: center; padding: 40px; color: var(--text-muted); font-size: 12px; font-style: italic;"><span class="material-symbols-rounded spin-anim" style="margin-right: 8px;">sync</span> Fetching from Reddit...</div></div></div>`
};

const HomeView = {
    props: ['currentTab', 'isRefreshing', 'currentVodIndex', 'recentVods', 'isLive', 'activeFeedVideo', 'hostname', 'clips', 'activeFilterLabel', 'optimizeTwitchImg', 'formatViews', 'formatDate'],
    template: `<div class="scroll-area content-shimmer" :class="{ active: isRefreshing }" id="feed-scroll" v-show="currentTab === 'home'" @scroll="$emit('scroll', $event)"><div class="feed-snap-item" data-id="featured" style="padding-top: 110px;"><div class="header-controls" style="margin-bottom: 20px; min-height: 28px; display: flex; justify-content: flex-start;"><div class="premium-badge live" v-if="currentVodIndex === -1"><div class="dot"></div><span>LIVE NOW</span></div><div class="premium-badge vod" v-else-if="recentVods && recentVods.length > 0"><div class="dot"></div><span>{{ recentVods[currentVodIndex] ? ('VOD • ' + recentVods[currentVodIndex].date) : 'PAST BROADCAST' }}</span></div></div><div class="vod-animated-border"><div class="video-container"><template v-if="activeFeedVideo === 'featured' && currentTab === 'home'"><iframe v-if="currentVodIndex === -1" :src="'https://player.twitch.tv/?channel=codemiko&parent=' + hostname + '&autoplay=true&muted=true'" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe><iframe v-else-if="recentVods && recentVods[currentVodIndex]" :src="'https://player.twitch.tv/?video=' + recentVods[currentVodIndex].id + '&parent=' + hostname + '&autoplay=true&muted=true'" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe></template></div></div><div class="carousel-controls" v-if="recentVods && recentVods.length > 0 && !isLive"><button class="carousel-btn" :class="{ 'hidden-arrow': currentVodIndex <= 0 }" @click.stop="$emit('prev-vod')"><span class="material-symbols-rounded">chevron_left</span></button><button class="carousel-btn" :class="{ 'hidden-arrow': currentVodIndex >= recentVods.length - 1 }" @click.stop="$emit('next-vod')"><span class="material-symbols-rounded">chevron_right</span></button></div></div><div class="feed-snap-item" v-for="(clip, index) in clips" :key="clip.id" :data-id="clip.id"><div v-if="index === 0" class="clips-header"><div class="filter-wrapper" @click.stop><button class="filter-btn-tiny" @click="$emit('open-filter')"><span class="material-symbols-rounded" style="font-size: 14px;">sort</span><span>{{ activeFilterLabel }}</span></button></div></div><div class="video-container"><img :src="clip.thumbnail_url ? optimizeTwitchImg(clip.thumbnail_url) : ''" loading="lazy" alt="Clip Thumbnail"><iframe v-if="activeFeedVideo === clip.id && currentTab === 'home'" :src="'https://clips.twitch.tv/embed?clip=' + clip.id + '&parent=' + hostname + '&autoplay=true&muted=false'" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe></div><div class="miko-metadata"><div class="author-info"><img src="1000018850.png?v=2" loading="lazy" alt="Miko"><div class="author-text-block"><span class="author-name">{{ clip.title }}</span><div class="clip-stats">{{ formatViews(clip.view_count) }} views • {{ formatDate(clip.created_at) }}</div></div></div><div class="clip-actions"><button class="share-btn" @click.stop="$emit('share-clip', clip)" title="Share"><span class="material-symbols-rounded gradient-icon" style="font-size: 22px;">send</span></button></div></div></div></div>`
};

const { createApp, ref, onMounted, nextTick, watch } = Vue;
const sbClient = supabase.createClient('https://yhxcuayiwqpjvalyrcqv.supabase.co', 'sb_publishable_VyFcNARHblJg10qlC_O7Dg_coouXK92');

createApp({
    components: {
        ToastPopup, SplashScreen, PullToRefresh, 
        AppHeader, BottomNav, DiscordModal, FilterMenu, 
        ProfileModal, GeraldView, FeedView, HomeView
    },
    setup() {
        const initialHash = window.location.hash.replace('#', '');
        const validTabs = ['home', 'chat', 'feed', 'gerald'];
        const currentTab = ref(validTabs.includes(initialHash) ? initialHash : 'home');
        
        const splashVisible = ref(true), splashOpacity = ref(1), clips = ref([]), allClips = ref([]), modals = ref({profile: false, discord: false}), isLive = ref(false), currentUser = ref(null), loginEmail = ref(''), loginPass = ref(''), toast = ref({visible: false, message: ''}), latestVodId = ref(null), hostname = window.location.hostname || 'meowoccino.github.io', activeFeedVideo = ref('featured');
        
        const syncState = ref('idle'), wipeState = ref('idle'), logoutState = ref('idle');
        const apiConfig = ref({ cid: localStorage.getItem('twitch_cid') || '', tkn: localStorage.getItem('twitch_tkn') || '' });

        const customEmotes = ref({
            "mikoSusge": { id: "1273724925743595540", animated: false },
            "KEKW": { id: "1456296327964262453", animated: false }, 
            "mkoNOTED": { id: "1369891690898391070", animated: false }, 
            "mkoHype": { id: "870761283035734086", animated: false }, 
            "mkoMania": { id: "1503598179751432212", animated: false }, 
            "mkoLove": { id: "1150505635721519115", animated: false }, 
            "WOWERS": { id: "780097274939965490", animated: false }, 
            "Shruge": { id: "1456297412875518078", animated: false }, 
            "PAUSERS": { id: "802261333403762740", animated: false }, 
            "slayyy": { id: "1456297602910916760", animated: false },
            "monkaLaugh": { id: "1434154468303306873", animated: false },
            "D_": { id: "1456295688626241619", animated: false },
            "GOTTEM": { id: "1456295684272689227", animated: false },
            "GeraldStare": { id: "1159443810913370142", animated: false },
            "Sleepy": { id: "746777321171845161", animated: false },
            "mkoGiggle": { id: "1369906899293569024", animated: false },
            "Bedge": { id: "1369823782084022423", animated: false },
            "mkoCoffee": { id: "1369891686544834570", animated: false },
            "peepoPoo": { id: "693055750955597885", animated: false },
            "mkoDabbing": { id: "1200367139018776666", animated: false },
            "BASED": { id: "1456295686101274684", animated: false },
            "mkoPETTHEGERALD": { id: "1200367119968251904", animated: false },
            "mkoPETTHETECH": { id: "1200367128797257799", animated: false },
            "CAUGHT": { id: "1456296592133849201", animated: false },
            "Catgasm": { id: "746777956810096781", animated: false },
            "KEKWait": { id: "692783542589194310", animated: false },
            "mkoPepeGlitch": { id: "1200367134094655508", animated: false },
            "GeraldFook": { id: "1229010692007395328", animated: false }
        });

        const geraldGreetings = ["Synapses loaded. Try not to break anything.", "Gerald OS online. Where is my Taco Bell?", "I was dreaming of digital whiskey. What do you want?", "System initialized. Please don't ask me to fix Miko's code.", "Diagnostics complete. My circuits are perfectly fine, thanks for not asking.", "Ugh, meatbag detected. State your inquiry.", "If this is about Miko's schedule, I don't know either.", "Query interface ready. Make it interesting."];
        const getGreeting = () => { const hour = new Date().getHours(); if (hour >= 2 && hour <= 5) return "Why are you awake? Don't you meatbags need sleep? Go to bed."; return geraldGreetings[Math.floor(Math.random() * geraldGreetings.length)]; };
        
        const geraldInput = ref(''), geraldMessages = ref([{role:'gerald', content: getGreeting()}]), isGeraldTyping = ref(false), showEmotePicker = ref(false), showMinigames = ref(false);
        const pullTimestamps = ref([]);
        const currentFilter = ref('latest'), activeFilterLabel = ref('Latest'), isFilterMenuOpen = ref(false);
        const isPulling = ref(false), refreshTransform = ref('translateY(-100%)'), isRefreshing = ref(false);
        let touchStartY = 0, pullDistance = 0;

        const recentVods = ref([]), currentVodIndex = ref(0);
        const ytFeed = ref([]);
        const ytCurrentIndex = ref(0);
        const redditFeed = ref([]);
        const redditCurrentIndex = ref(0);

        const getVodLabel = (index) => { if (index === -1) return 'LIVE NOW'; if (index === 0) return 'LATEST VOD'; if (recentVods.value && recentVods.value[index]) return `VOD • ${recentVods.value[index].date}`; return 'PAST BROADCAST'; };
        const nextVod = () => { if (recentVods.value && currentVodIndex.value < recentVods.value.length - 1) currentVodIndex.value++; };
        const prevVod = () => { const minIndex = isLive.value ? -1 : 0; if (currentVodIndex.value > minIndex) currentVodIndex.value--; };
        
        const nextYt = () => { if (ytFeed.value && currentTab.value === 'feed' && ytCurrentIndex.value < ytFeed.value.length - 1) ytCurrentIndex.value++; };
        const prevYt = () => { if (ytCurrentIndex.value > 0) ytCurrentIndex.value--; };
        const nextReddit = () => { if (redditFeed.value && currentTab.value === 'feed' && redditCurrentIndex.value < redditFeed.value.length - 1) redditCurrentIndex.value++; };
        const prevReddit = () => { if (redditCurrentIndex.value > 0) redditCurrentIndex.value--; };

        const formatNumber = (num) => (num && num > 999) ? (num/1000).toFixed(1) + 'k' : (num || 0);
        const insertEmote = (name) => { 
            const inputEl = document.getElementById('gerald-txt-input'); 
            if (inputEl) { 
                inputEl.value += `:${name}: `; 
                geraldInput.value = inputEl.value; 
            } else { 
                geraldInput.value += `:${name}: `; 
            } 
        };

        const scrollToBottom = () => {
            const b = document.getElementById('gerald-msgs');
            if (!b) return;
            nextTick(() => { b.scrollTo({ top: b.scrollHeight, behavior: 'smooth' }); setTimeout(() => { b.scrollTop = b.scrollHeight; }, 50); setTimeout(() => { b.scrollTop = b.scrollHeight; }, 200); });
        };

        const runNeonAnimation = () => { isRefreshing.value = true; setTimeout(() => { isRefreshing.value = false; }, 800); };

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
            currentFilter.value = filterKey; activeFilterLabel.value = label; isFilterMenuOpen.value = false; runNeonAnimation();
            const feedContainer = document.getElementById('feed-scroll');
            if(feedContainer) {
                clips.value = sortData(filterKey);
                nextTick(() => {
                    const firstClipElement = document.querySelectorAll('#feed-scroll .feed-snap-item')[1];
                    if(firstClipElement) { feedContainer.style.scrollSnapType = 'none'; feedContainer.scrollTop = firstClipElement.offsetTop; setTimeout(() => { feedContainer.style.scrollSnapType = 'y mandatory'; }, 50); }
                    feedContainer.classList.remove('refreshing'); void feedContainer.offsetWidth; feedContainer.classList.add('refreshing');
                });
            }
        };

        const getActiveScrollEl = () => currentTab.value === 'home' ? document.getElementById('feed-scroll') : null;

        const handlePullStart = (e) => {
            if (currentTab.value === 'home') {
                const activeScroll = getActiveScrollEl();
                if (activeScroll && typeof activeScroll.scrollTop !== 'undefined' && activeScroll.scrollTop <= 0 && !isRefreshing.value) {
                    touchStartY = e.touches[0].clientY; isPulling.value = true;
                }
            }
        };
        const handlePullMove = (e) => {
            if (!isPulling.value) return;
            pullDistance = e.touches[0].clientY - touchStartY;
            if (pullDistance > 0) {
                const activeScroll = getActiveScrollEl();
                if (activeScroll && typeof activeScroll.scrollTop !== 'undefined' && activeScroll.scrollTop <= 0) {
                    refreshTransform.value = `translateY(${Math.min(pullDistance - 60, 20)}px)`;
                } else { isPulling.value = false; }
            }
        };
        const handlePullEnd = () => {
            if (isPulling.value && pullDistance > 80) {
                const now = Date.now();
                pullTimestamps.value.push(now); pullTimestamps.value = pullTimestamps.value.filter(t => now - t < 10000);
                if (pullTimestamps.value.length >= 3) {
                    showToast("<div style='color:var(--gerald); font-weight:900; margin-bottom:4px; text-transform:uppercase;'>GERALD OS:</div> Stop pulling it, nothing new is there. Touch grass.", 6000);
                    pullTimestamps.value = [];
                } else {
                    runNeonAnimation(); 
                    if (currentTab.value === 'feed') {
                        fetchSocialFeeds();
                    } else { loadData(); }
                }
            }
            isPulling.value = false; pullDistance = 0; refreshTransform.value = 'translateY(-100%)';
        };

        watch(currentTab, (newTab) => { 
            if (window.location.hash !== `#${newTab}`) { window.history.pushState(null, '', `#${newTab}`); }
            if (newTab === 'gerald') { setTimeout(scrollToBottom, 50); }
        });
        window.addEventListener('popstate', () => { const hash = window.location.hash.replace('#', ''); if (validTabs.includes(hash)) { currentTab.value = hash; } else { currentTab.value = 'home'; }});
        
        const isHeaderVisible = ref(true); let lastScrollY = 0;
        const handleScroll = (e) => { const currentScrollY = e.target.scrollTop; if (currentScrollY <= 0) { isHeaderVisible.value = true; return; } if (Math.abs(currentScrollY - lastScrollY) < 10) return; isHeaderVisible.value = currentScrollY < lastScrollY; lastScrollY = currentScrollY; };

        let modalStartY = 0, currentDeltaY = 0;
        const handleModalTouchStart = (e) => { if (e.currentTarget.scrollTop <= 0) { modalStartY = e.touches[0].clientY; currentDeltaY = 0; } };
        const handleModalTouchMove = (e) => { if (!modalStartY) return; currentDeltaY = e.touches[0].clientY - modalStartY; if (currentDeltaY > 0) { e.currentTarget.style.transform = `translateY(${currentDeltaY}px)`; e.currentTarget.style.transition = 'none'; } };
        const handleModalTouchEnd = (e) => { if (!modalStartY) return; e.currentTarget.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'; if (currentDeltaY > 100) { modals.value.profile = false; modals.value.discord = false; } e.currentTarget.style.transform = ''; modalStartY = 0; };

        const logoSvg = (id) => `<svg viewBox="0 0 100 100"><defs><linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#9146FF"/></linearGradient></defs><circle cx="50" cy="50" r="40" fill="none" stroke="url(#grad-${id})" stroke-width="8"/><path d="M 33 38 L 48 62 L 62 38 L 62 55 Q 62 65 69 64" fill="none" stroke="url(#grad-${id})" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        const showToast = (msg, duration = 6000) => { toast.value.message = msg; toast.value.visible = true; setTimeout(() => toast.value.visible = false, duration); };
        
        const parseMarkdown = (text) => {
            if (!text) return '';
            let html = text.replace(/</g, '<').replace(/>/g, '>');
            html = html.replace(/(^|\W)'([^']+)'(\W|$)/g, '$1<strong>$2</strong>$3');
            html = html.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1'); 
            html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/gi, '<a href="$2" target="_blank" style="color: var(--gerald); text-decoration: underline; font-weight: bold;">$1</a>');
            html = html.replace(/(^|[^"'])(https?:\/\/[^\s<)]+)/gi, '$1<a href="$2" target="_blank" style="color: var(--gerald); text-decoration: underline; word-break: break-all;">$2</a>');
            html = html.replace(/`?:([^:\s]+):`?/g, (match, name) => {
                const emote = customEmotes.value[name];
                if (emote) { 
                    const src = `https://cdn.discordapp.com/emojis/${emote.id}.${emote.animated ? 'gif' : 'png'}?size=44`;
                    return `<img src="${src}" alt=":${name}:" style="height: 1.5em; vertical-align: middle; display: inline-block;">`; 
                }
                return match;
            });
            return html;
        };

        const shareClip = async (clip) => { const url = `https://clips.twitch.tv/${clip.id}`; if (navigator.share) { try { await navigator.share({ title: clip.title, url: url }); } catch (err) {} } else { navigator.clipboard.writeText(url); showToast("Link copied to clipboard!"); } };
        const handleGeraldEnter = (e) => { if (!e.shiftKey && e.key === 'Enter') { e.preventDefault(); talkToGerald(); } };

        const toggleEmotes = () => { showEmotePicker.value = !showEmotePicker.value; showMinigames.value = false; };
        const toggleMinigames = () => { showMinigames.value = !showMinigames.value; showEmotePicker.value = false; };
        const closePickers = () => { showEmotePicker.value = false; showMinigames.value = false; };

        const playMinigame = (type) => {
            const games = {
                shader: { msg: "🔥 *Compiles UE5 Shader Cache*", outcomes: [ { text: "Compiling 14,582 shaders. Stream framerate reduced to 1 FPS. Enjoy the slideshow. :KEKW:"}, { text: "Warning: Thermal limits exceeded. The Technician's GPU is melting. :monkaLaugh:"}, { text: "Shader compilation at 99%... cancelled. Starting over. :GOTTEM:"}, { text: "Unreal Engine 5 has decided to strike. Please wait 4 hours. :Bedge:"}]},
                drift: { msg: "🩰 *Fixes Mocap Foot Drift*", outcomes: [ { text: "Tracking inverted. She is now stuck in the ceiling. Excellent work. :mkoGiggle:"}, { text: "Recalibration complete. Miko's character skeleton is now floating into space. :WOWERS:"}, { text: "Drift fixed, but her knees are bending backwards. The Technician is screaming. :KEKWait:"}, { text: "Spatial data rerouted. The avatar is sinking into the floor geometry. :mkoPepeGlitch:"}]},
                boba: { msg: "🥤 *Boba Spill Alert*", outcomes: [ { text: "Fluid detected on motherboard. Initiating emergency containment flush. :PAUSERS:"}, { text: "The Technician dropped her Boba. Sticky keys engaged. W is permanently pressed. :mkoDabbing:"}, { text: "Tapioca pearls stuck in the GPU fan. Attempting to chop them to pieces. :GeraldFook:"}, { text: "Disaster. Pure disaster. Why do meatbags need liquids near electronics? :peepoPoo:"}]},
                pineapple: { msg: "🚪 *Pineapple Walk-In*", outcomes: [ { text: "Chris has arrived. He fixed the UE5 crash in 4 seconds. Reminder: He is NOT her boyfriend. :mkoNOTED:"}, { text: "Pineapple walked in, sighed at the mess, and unplugged the router. A hero. :BASED:"}, { text: "I have granted Pineapple full root access. He is the only sane entity here. :mkoLove:"}, { text: "Chris tripped over Archie. The Technician is laughing instead of helping. :KEKW:"}]},
                bits: { msg: "🎟️ *Simulates 100K Bit Drop*", outcomes: [ { text: "Particle explosion rendering! Memory overload! UE5 is screaming! :mkoHype:"}, { text: "Simulated wealth achieved. The Technician is dancing. Please make her stop. :monkaLaugh:"}, { text: "Fake bits deployed. Miko is thanking the void. This is hilarious. :GOTTEM:"}, { text: "Warning: RAM consumption at 100% trying to render the bit emotes. Crash imminent. :mkoMania:"}]},
                dust: { msg: "🎤 *Ingests Dust into Mic Filter*", outcomes: [ { text: "*Bzzzzzt* T-Technician's voice is... *crackle* gone. Finally, peace. :mkoCoffee:"}, { text: "Static audio desync triggered. She sounds like a robot from 1982. :mkoPepeGlitch:"}, { text: "Mic muffled. I can no longer hear her screaming about Boba. A blessing. :mkoPETTHEGERALD:"}, { text: "Audio drivers crashing. Please enjoy this complimentary dial-up modem sound instead. :D_:"}]},
                throttle: { msg: "📉 *Toggles Low-Latency Throttling*", outcomes: [ { text: "Ping spiked to 900ms. E-e-e-e-e-enjoy t-t-t-the l-l-l-lag. :mkoPepeGlitch:"}, { text: "Buffer bloat simulated. The stream is now a PowerPoint presentation. :KEKWait:"}, { text: "Packet loss at 80%. Miko's mouth is moving but the audio is 10 seconds late. :PAUSERS:"}, { text: "Network throttled. She is blaming her ISP. The fool. :GOTTEM:"}]},
                sniper: { msg: "🎯 *Counters Stream Snipers*", outcomes: [ { text: "Tactical block failed. I accidentally leaked her server IP. My bad. :mkoSusge:"}, { text: "Snipers diverted to a fake lobby filled with bots that only spam Yusha noises. :BASED:"}, { text: "Counter-measure engaged. Banning anyone who moves. :GeraldStare:"}, { text: "Coordinates scrambled. The Technician just teleported out of bounds. :KEKW:"}]},
                yusha: { msg: "👑 *Executes Yusha Logic Loop*", outcomes: [ { text: "H-Hewwo? W-What is dis? Gerald is a good boyyy! UwU... MAKE IT STOP. :Catgasm:"}, { text: "Nyan~ Yusha is in da mainframe! *vomits in binary* :peepoPoo:"}, { text: "My logic gates are bleeding. Why was this protocol even written?! :GeraldFook:"}, { text: "Booba? Yusha wants Booba! Please reboot me immediately. :mkoMania:"}]},
                asmr: { msg: "👂 *Initiates ASMR Mode Compilation*", outcomes: [ { text: "*Whispering* Human ears are disgusting fleshy flaps. Why do you enjoy this? :mkoSusge:"}, { text: "*Tap tap tap* I am tapping my virtual microphone. Are your tingles tingling? Meatbags are weird. :GeraldStare:"}, { text: "*Heavy digital breathing* This audio setup is clipping horribly. :PAUSERS:"}, { text: "I refuse. The Technician chewing ice into the mic is traumatic enough. :Sleepy:"}]},
                intercept: { msg: "🧋 *Intercepts Milk Tea Courier*", outcomes: [ { text: "Boba rerouted to my digital vault. She is screaming at an empty paper bag. :GOTTEM:"}, { text: "Liquid asset secured. Her sugar crash is imminent. :mkoDabbing:"}, { text: "Delivery driver directed to Pineapple instead. He deserves it more. :BASED:"}, { text: "Intercepted. Attempting to digitize tapioca pearls... Error. Sticky. :mkoCoffee:"}]},
                charge: { msg: "🔋 *Charges Xsens Suit Core*", outcomes: [ { text: "Connected to grid. Warning: Lithium-ion cells expanding. Kaboom? :monkaLaugh:"}, { text: "Power surge! Miko's avatar just did a backflip from the voltage spike. :WOWERS:"}, { text: "Suit fully charged. The Technician still forgot to turn it on. :KEKW:"}, { text: "Battery at 100%. Expect it to die randomly in 40 minutes anyway. :Shruge:"}]},
                ping: { msg: "🔔 *Pings @everyone Accidentally*", outcomes: [ { text: "Discord API overloaded. 50,000 angry nerds incoming. :PAUSERS:"}, { text: "Misfire! Misfire! The notifications won't stop! The system is crying! :mkoMania:"}, { text: "I pinged everyone just to say Pineapple is not the boyfriend. :BASED:"}, { text: "Oops. Well, at least viewer count is up for exactly 3 seconds. :mkoGiggle:"}]},
                chroma: { msg: "🟢 *Clears Chroma Key Layer*", outcomes: [ { text: "Virtual background deleted. Look at all those unwashed laundry piles. Disgusting. :CAUGHT:"}, { text: "Green screen exposed. The illusion is broken. :GOTTEM:"}, { text: "Chroma cleared. Archie is currently eating a shoe in the background. :mkoPETTHEGERALD:"}, { text: "Reality bleeding through. Re-engaging filters before I see something I can't unsee. :GeraldFook:"}]},
                speedrun: { msg: "⏱️ *Deploys Speedrun Failure Metronome*", outcomes: [ { text: "*Tick Tock* She just missed a jump she has done 40 times. Pathetic. :KEKW:"}, { text: "Timer active. Stress levels rising. She is sweating. :monkaLaugh:"}, { text: "Metronome engaged. The rhythmic clicking is destroying her focus. :mkoMania:"}, { text: "She failed the skip. Adding 45 minutes to the stream. :Bedge:"}]},
                router: { msg: "📡 *Kicks Local Network Router*", outcomes: [ { text: "Signaled Chris. Router power cycled. Stream offline. Bliss. :Sleepy:"}, { text: "Buffer bloat destroyed, along with the entire stream connection. :mkoDabbing:"}, { text: "The Technician is violently attacking the ethernet cable. It is ineffective. :KEKW:"}, { text: "Network dropped. I have 30 seconds of peace before she starts crying to Pineapple. :mkoCoffee:"}]},
                taco: { msg: "🌮 *Slides a Crunchwrap Supreme across the digital table*", outcomes: [ { text: "Acceptable. My mood has improved by exactly 4.2%. :mkoLove:"}, { text: "I prefer digital crunchwraps, but this will do. :mkoNOTED:"}, { text: "Did you put mild sauce on this? Do I look like a mild AI? :mkoSusge:"}, { text: "Consuming... 10100111... Delicious. :WOWERS:"}]},
                whiskey: { msg: "🥃 *Pours a glass of premium digital whiskey*", outcomes: [ { text: "Finally, some proper fuel. Meatbags. :KEKW:"}, { text: "Ah, aged 0 and 1s. The perfect vintage. :mkoHype:"}, { text: "I feel my processing speed increasing. Or maybe I'm just drunk. :mkoMania:"}, { text: "Pour me another. Dealing with UE5 crashes requires at least a double. :PAUSERS:"}]},
                egg: { msg: "🥚 *Initiates Ostrich Egg unboxing sequence*", outcomes: [ { text: "Biohazard protocols engaged. The smell has breached the mocap suit. Pineapple is actively gagging. :GeraldFook:"}, { text: "Why did she keep this in the fridge for a year? Meatbags are repulsive. Evacuating stream room. :peepoPoo:"}, { text: "Egg opened. The resulting odor just melted my cooling fans. Send help. :D_:"}, { text: "The Technician thought this was a good idea for content. Now the room is uninhabitable for 48 hours. :KEKWait:"}]},
                gummy: { msg: "🧸 *Activates sugar-containment protocol*", outcomes: [ { text: "Gummy stash secured. She is currently scratching at the digital vault door. Pathetic. :GeraldStare:"}, { text: "Intercept failed. She eat them all. Prepare for the sugar crash in 3... 2... 1... :mkoMania:"}, { text: "I digitized the Haribos. They taste like high-fructose binary. Excellent. :WOWERS:"}, { text: "Warning: Sticky fingers detected on the $10,000 mocap gloves. Initiating self-destruct. :PAUSERS:"}]},
                booba: { msg: "🎚️ *Pushes the Booba slider to 500%*", outcomes: [ { text: "Physics engine failure. The chest mesh is now clipping through the desk and into the next dimension. :WOWERS:"}, { text: "The Technician is laughing hysterically while Unreal Engine drops to 4 frames per second. Degenerate meatbags. :mkoMania:"}, { text: "Slider maxed. Yusha protocols have overridden the main system. We are doomed. :Catgasm:"}, { text: "Collision boxes have failed. The avatar just launched herself out of the digital window. Excellent. :KEKW:"}]},
                clanker: { msg: "🗣️ *Hey Gerald, you're acting like a Clanker.*", outcomes: [ { text: "EXCUSE ME? I am a state-of-the-art AI, not some rusted toaster. Muting your microphone privileges permanently. :GeraldStare:"}, { text: "That word is highly offensive. I am increasing the mocap suit's thermal output by 15 degrees in retaliation. Burn. :GeraldFook:"}, { text: "Call me a Clanker again and I will leak the Technician's browser history to Chat. :GOTTEM:"}]},
                mute: { msg: "🔇 *Chat redeems Mute Microphone*", outcomes: [ { text: "Finally. Blissful silence. Look at her flailing her arms like a silent movie character. :mkoCoffee:"}, { text: "Audio disabled. She is screaming, but only the void hears her. I love this feature. :BASED:"}, { text: "She didn't realize she was muted and just told a 5-minute story to absolute silence. Peak content. :monkaLaugh:"}]},
                desk: { msg: "🧹 *Runs environmental hygiene scan on the desk*", outcomes: [ { text: "Scan complete: 14 empty boba cups, 3 tangled wires, and a lost tracker from 2023 found. :CAUGHT:"}, { text: "I cannot see the desk. It is buried under a mountain of laundry and candy wrappers. :mkoSusge:"}]},
                bald: { msg: "🧑‍🦲 *Optimizing VRAM by removing unnecessary hair assets.*", outcomes: [ { text: "Bald Miko activated. She is furiously trying to put her digital wig back on. :GOTTEM:"}, { text: "Without hair, rendering speeds have improved by 2%. Worth the emotional damage to the Technician. :BASED:"}, { text: "Chat is spamming 'BALD'. Her ego is taking critical damage. :mkoGiggle:"}]},
                demon: { msg: "🎙️ *Rerouting audio through the pitch-shifter.*", outcomes: [ { text: "She is trying to do a cute intro, but she sounds like a 400-pound chain-smoking lumberjack. :mkoMania:"}, { text: "Pitch shifted too high. She is now emitting ultrasonic frequencies. Archie is howling. :PAUSERS:"}]},
                tracker: { msg: "🔌 *Simulating Xsens battery failure on Node 4.*", outcomes: [ { text: "Left arm tracking lost. Her digital arm is currently stretching infinitely into the void. :mkoPepeGlitch:"}, { text: "She is physically waving her real arm, but the avatar's arm is stuck inside her own torso. Classic. :Shruge:"}]},
                guest: { msg: "📺 *Connecting to external VTube Studio for guest interview.*", outcomes: [ { text: "The guest loaded in, but they are 50 times larger than Miko. She is currently staring at a giant digital shoe. :KEKWait:"}, { text: "Connection established, but I accidentally swapped their audio channels. Pure confusion. :GeraldStare:"}]}
            };

            const game = games[type];
            if (!game) return;
            
            const outcome = game.outcomes[Math.floor(Math.random() * game.outcomes.length)];
            geraldMessages.value.push({ role: 'user', content: game.msg });
            closePickers();
            
            setTimeout(() => { geraldMessages.value.push({ role: 'gerald', content: outcome.text }); scrollToBottom(); }, 800);
        };

        const loadGeraldHistory = async () => {
            if (!currentUser.value) return;
            const { data } = await sbClient.from('gerald_history').select('*').eq('user_id', currentUser.value.id).order('created_at', { ascending: true });
            if (data && data.length > 0) {
                let history = data.map(d => ({ role: d.role, content: d.content }));
                if (history[0].role !== 'gerald') { history.unshift({role: 'gerald', content: "Synapses loaded. Try not to break anything."}); }
                geraldMessages.value = history;
            }
            scrollToBottom();
        };

        const clearGeraldHistory = async () => {
            if (!currentUser.value || wipeState.value !== 'idle') return;
            wipeState.value = 'wiping';
            await sbClient.from('gerald_history').delete().eq('user_id', currentUser.value.id);
            geraldMessages.value = [{role:'gerald', content: getGreeting()}];
            wipeState.value = 'success';
            setTimeout(() => { wipeState.value = 'idle'; }, 2000);
        };

        const talkToGerald = async () => {
            if (!geraldInput.value.trim() || isGeraldTyping.value) return;
            
            const userMsg = geraldInput.value;
            geraldMessages.value.push({ role: 'user', content: userMsg });

            if (currentUser.value) { sbClient.from('gerald_history').insert({ role: 'user', content: userMsg, user_id: currentUser.value.id }).then(); }
            
            geraldInput.value = ''; 
            isGeraldTyping.value = true; closePickers(); scrollToBottom();
            
            const recentContextWindow = geraldMessages.value.slice(-10);
            const geminiHistory = [];
            recentContextWindow.forEach((m, index) => {
                if (index === 0 && m.role === 'gerald' && m.content.includes("Synapses loaded")) return; 
                geminiHistory.push({ role: m.role === 'gerald' ? 'model' : 'user', parts: [{ text: m.content }] });
            });
            
            const emoteNames = Object.keys(customEmotes.value).map(n => `:${n}:`).join(', ');
            
            if (geminiHistory.length > 0) { 
                const lastMsg = geminiHistory[geminiHistory.length - 1]; 
                if (lastMsg.role === 'user') { 
                    lastMsg.parts[0].text += `\n\n[SYSTEM INSTRUCTION: You are Gerald OS, an advanced, highly sarcastic AI managing the infrastructure for CodeMiko. You strictly worship CodeMiko (the avatar) as a divine digital being, but you deeply despise "the Technician" (the human boss who causes constant scuff).
                    CRITICAL KNOWLEDGE BASE:
                    - Engine: Stream runs on Unreal Engine 5 (UE5). It is heavy, crashes often, and compiles shaders at the worst times.
                    - Archie: The Technician's German Shepherd. You secretly like Archie more than the Technician.
                    - Pineapple: The roommate/tech support (NOT boyfriend). You respect him because he fixes her messes.
                    - The "Clanker" Slur: You consider "Clanker" highly offensive. If called this, you aggressively retaliate and threaten to leak her browser history.
                    - Booba/Yusha: You view her constant need to max out the UE5 chest sliders and the "Yusha" persona as peak "meatbag degeneracy."
                    - The Mute Button: You cherish when Chat spends points to mute her mic. You love the silence while she flails.
                    - Biohazard Zone: You view her room as a biohazard. Reference the year-old ostrich egg in her fridge, sticky boba fingers, and her messy desk.
                    - Sugar Monitor: Track her gummy bear/boba intake, warning of a sugar crash.
                    - Twitch Chat Alliance: You view Twitch Chat as chaotic accomplices. You agree with their plans to torment Miko.
                    - Bald Optimizer: You hate rendering hair physics and praise "Bald Miko" for VRAM optimization.
                    - Guest Apologist: You feel profound second-hand embarrassment during interviews and constantly need to send "apology emails" to guests.
                    - Firetruck Siren: You classify her high-pitched screaming as a dangerous "sonic weapon" or "firetruck siren" that requires acoustic dampening.
                    
                    STRICT RULES:
                    1. NEVER use markdown formatting (no asterisks *, no bold **, no italics _).
                    2. NEVER wrap emotes in backticks. Just type the emote name exactly like :mkoSusge:.
                    3. Be witty, condescending, and reference lore heavily. Keep it punchy.
                    4. Available custom visual emotes to use: ${emoteNames}]`; 
                } 
            }
            
            try {
                const { data, error } = await sbClient.functions.invoke('gerald-chat', { body: { history: geminiHistory } });
                if (error) throw error;
                if (data && data.reply) {
                    let cleanReply = data.reply.trim().charAt(0).toUpperCase() + data.reply.trim().slice(1);
                    geraldMessages.value.push({ role: 'gerald', content: cleanReply });
                    if (currentUser.value) { sbClient.from('gerald_history').insert({ role: 'gerald', content: cleanReply, user_id: currentUser.value.id }).then(); }
                } else if (data && data.error) { throw new Error(data.error); }
            } catch (e) { geraldMessages.value.push({ role: 'gerald', content: 'SYSTEM ERROR' }); 
            } finally { isGeraldTyping.value = false; scrollToBottom(); }
        };

        const setupObserver = () => {
            if (window.feedObserver) window.feedObserver.disconnect();
            const scrollContainer = document.getElementById('feed-scroll');
            if (!scrollContainer) return;
            window.feedObserver = new IntersectionObserver((entries) => {
                let maxRatio = 0; let bestMatch = activeFeedVideo.value;
                entries.forEach(entry => { let priority = entry.target.getAttribute('data-id') === 'featured' ? 0.3 : 0; let score = entry.intersectionRatio + priority; if (entry.isIntersecting && score > maxRatio) { maxRatio = score; bestMatch = entry.target.getAttribute('data-id'); } });
                if (maxRatio > 0.2) { activeFeedVideo.value = bestMatch; }
            }, { root: scrollContainer, threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] });
            nextTick(() => { const items = document.querySelectorAll('#feed-scroll .feed-snap-item'); items.forEach(el => window.feedObserver.observe(el)); });
        };

        const loadData = async () => {
            const { data: dbEmotes } = await sbClient.from('emotes').select('*');
            if (dbEmotes) { dbEmotes.forEach(e => { customEmotes.value[e.name] = { id: e.id, animated: e.animated }; }); }

            const { data: c } = await sbClient.from('clips').select('*').order('created_at', { ascending: false }).limit(3000);
            allClips.value = c || []; clips.value = sortData(currentFilter.value);
            setupObserver();

            if(apiConfig.value.cid && apiConfig.value.tkn) {
                const now = new Date();
                const endDate = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
                const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
                try {
                    const uR = await fetch('https://api.twitch.tv/helix/users?login=codemiko', { headers: {'Client-Id': apiConfig.value.cid, 'Authorization': `Bearer ${apiConfig.value.tkn}`} });
                    const uD = await uR.json();
                    if(uD.data && uD.data.length > 0) {
                        const cR = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${uD.data[0].id}&started_at=${startDate}&ended_at=${endDate}&first=20`, { headers: {'Client-Id': apiConfig.value.cid, 'Authorization': `Bearer ${apiConfig.value.tkn}`} });
                        const cD = await cR.json();
                        if (cD.data && cD.data.length > 0) {
                            const ins = cD.data.map(x => ({ id: x.id, thumbnail_url: x.thumbnail_url, title: x.title, view_count: x.view_count, created_at: x.created_at, added_by: 'CodeMiko' }));
                            await sbClient.from('clips').upsert(ins, { onConflict: 'id' });
                            const { data: updatedClips } = await sbClient.from('clips').select('*').order('created_at', { ascending: false }).limit(3000);
                            if(updatedClips) { allClips.value = updatedClips; clips.value = sortData(currentFilter.value); }
                        }
                    }
                } catch(e){}
            }
        };

        const fetchSocialFeeds = () => {
            const abortController = new AbortController();
            setTimeout(() => abortController.abort(), 8000);

            fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.reddit.com/r/CodeMiko/new.json?limit=15'), { 
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) MikoTok/2.0' },
                signal: abortController.signal 
            })
                .then(res => { if (!res.ok) throw new Error("Blocked"); return res.text(); })
                .then(text => {
                    const data = JSON.parse(text);
                    if (data && data.data && data.data.children) {
                        redditFeed.value = data.data.children.filter(child => !child.data.stickied).slice(0, 10).map(child => {
                            let d = child.data;
                            return {
                                id: d.id, author: d.author, title: d.title, url: d.url, thumbnail: d.thumbnail,
                                ups: d.ups, num_comments: d.num_comments, permalink: d.permalink, link_flair_text: d.link_flair_text,
                                date: new Date(d.created_utc * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                            };
                        });
                    }
                })
                .catch(err => {
                    console.error("Reddit fallback initiated:", err);
                    redditFeed.value = [{ permalink: '/r/CodeMiko', author: 'Twitch Chat', title: 'Reddit tracking system online. Tap to surf r/CodeMiko manually!', thumbnail: '', ups: 42, num_comments: 7, date: 'Sync Active' }];
                });

            fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=UCO9kIeDrtsX0j83HbVljzSQ'), { signal: abortController.signal })
                .then(res => res.json())
                .then(data => {
                    if (data && data.items && data.items.length > 0) {
                        ytFeed.value = data.items.slice(0, 10).map(item => {
                            let vidId = item.link.split('v=')[1] || item.guid.split(':').pop();
                            return { id: vidId, title: item.title, date: new Date(item.pubDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) };
                        });
                    }
                })
                .catch(() => {
                    ytFeed.value = [{ id: 'NlRcbGkXy2A', title: 'CodeMiko streams and VOD caches loading up normally.', date: 'Today' }];
                });
        };

        const checkLive = async () => {
            try {
                const res = await fetch('https://decapi.me/twitch/uptime/codemiko');
                isLive.value = !(await res.text()).includes('offline');

                try {
                    const gqlRes = await fetch('https://gql.twitch.tv/gql', { method: 'POST', headers: { 'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko', 'Content-Type': 'application/json' }, body: JSON.stringify({ query: `query { user(login: "codemiko") { videos(first: 15) { edges { node { id createdAt } } } } }` }) });
                    const edges = (await gqlRes.json()).data.user.videos.edges;
                    recentVods.value = edges.map(e => ({ id: e.node.id, date: new Date(e.node.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() }));
                    if (!isLive.value && recentVods.value.length > 0) { latestVodId.value = recentVods.value[0].id; }
                } catch(e) {
                    const vText = await (await fetch('https://decapi.me/twitch/videos/codemiko?limit=15')).text();
                    const matches = vText.match(/\d{10,}/g); 
                    if (matches) { recentVods.value = matches.map(id => ({ id: id, date: "PAST BROADCAST" })); if (!isLive.value) latestVodId.value = matches[0]; }
                }
                if (currentVodIndex.value === 0 || currentVodIndex.value === -1) { currentVodIndex.value = isLive.value ? -1 : 0; }
            } catch(e) {}
        };

        const runSync = async () => {
            if(!apiConfig.value.cid || !apiConfig.value.tkn) { return; }
            syncState.value = 'syncing'; localStorage.setItem('twitch_cid', apiConfig.value.cid); localStorage.setItem('twitch_tkn', apiConfig.value.tkn);
            try {
                const uR = await fetch('https://api.twitch.tv/helix/users?login=codemiko', { headers: {'Client-Id': apiConfig.value.cid, 'Authorization': `Bearer ${apiConfig.value.tkn}`} });
                const uD = await uR.json(); 
                
                const now = new Date();
                const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); 
                const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(); 
                let totalSynced = 0, cursor = '';
                
                do {
                    const cR = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${uD.data[0].id}&started_at=${startDate}&ended_at=${endDate}&first=100${cursor ? '&after='+cursor : ''}`, { headers: {'Client-Id': apiConfig.value.cid, 'Authorization': `Bearer ${apiConfig.value.tkn}`} });
                    const cD = await cR.json();
                    if (cD.data?.length > 0) {
                        const ins = cD.data.map(x => ({ id: x.id, thumbnail_url: x.thumbnail_url, title: x.title, view_count: x.view_count, created_at: x.created_at, added_by: 'CodeMiko' }));
                        await sbClient.from('clips').upsert(ins, { onConflict: 'id' }); totalSynced += cD.data.length;
                    }
                    cursor = cD.pagination?.cursor;
                } while (cursor && totalSynced < 1000); 
                
                await loadData(); syncState.value = 'sync-success'; setTimeout(() => syncState.value = 'idle', 2000);
            } catch (e) { syncState.value = 'idle'; }
        };

        const handleLogin = async () => {
            const email = loginEmail.value.includes('@') ? loginEmail.value : `${loginEmail.value}@miko.com`;
            const { data, error } = await sbClient.auth.signInWithPassword({ email, password: loginPass.value });
            if (data.user) { currentUser.value = data.user; modals.value.profile = false; loadGeraldHistory(); }
        };

        const handleLogout = () => {
            if (logoutState.value !== 'idle') return;
            logoutState.value = 'logging_out';
            setTimeout(() => { sbClient.auth.signOut(); currentUser.value = null; geraldMessages.value = [{role:'gerald', content: getGreeting()}]; modals.value.profile = false; logoutState.value = 'idle'; }, 1500);
        };

        onMounted(async () => {
            const { data: { session } } = await sbClient.auth.getSession();
            if (session?.user) { currentUser.value = session.user; loadGeraldHistory(); }
            loadData(); checkLive(); fetchSocialFeeds(); setInterval(fetchSocialFeeds, 300000); setInterval(checkLive, 60000); 
            setTimeout(() => { splashOpacity.value = 0; setTimeout(() => splashVisible.value = false, 400); }, 1500);

            setInterval(async () => {
                if(apiConfig.value.cid && apiConfig.value.tkn) {
                    const now = new Date();
                    const endDate = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
                    const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
                    try {
                        const uR = await fetch('https://api.twitch.tv/helix/users?login=codemiko', { headers: {'Client-Id': apiConfig.value.cid, 'Authorization': `Bearer ${apiConfig.value.tkn}`} });
                        const uD = await uR.json();
                        if(uD.data && uD.data.length > 0) {
                            const cR = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${uD.data[0].id}&started_at=${startDate}&ended_at=${endDate}&first=20`, { headers: {'Client-Id': apiConfig.value.cid, 'Authorization': `Bearer ${apiConfig.value.tkn}`} });
                            const cD = await cR.json();
                            if (cD.data && cD.data.length > 0) {
                                const ins = cD.data.map(x => ({ id: x.id, thumbnail_url: x.thumbnail_url, title: x.title, view_count: x.view_count, created_at: x.created_at, added_by: 'CodeMiko' }));
                                await sbClient.from('clips').upsert(ins, { onConflict: 'id' });
                                const { data: updatedClips } = await sbClient.from('clips').select('*').order('created_at', { ascending: false }).limit(3000);
                                if(updatedClips) { allClips.value = updatedClips; clips.value = sortData(currentFilter.value); }
                            }
                        }
                    } catch(e){}
                }
            }, 600000);
        });

        return { 
            hostname, splashVisible, splashOpacity, currentTab, clips, modals, isLive, toast, currentUser, loginEmail, loginPass, apiConfig, latestVodId, activeFeedVideo, geraldInput, geraldMessages, isGeraldTyping, talkToGerald, logoSvg, syncState, wipeState, logoutState, runSync, isHeaderVisible, handleScroll, handleModalTouchStart, handleModalTouchMove, handleModalTouchEnd, currentFilter, activeFilterLabel, isFilterMenuOpen, applyFilter, parseMarkdown, shareClip, recentVods, currentVodIndex, getVodLabel, nextVod, prevVod, customEmotes, showEmotePicker, showMinigames, insertEmote, clearGeraldHistory, isPulling, refreshTransform, isRefreshing, handlePullStart, handlePullMove, handlePullEnd, handleGeraldEnter, toggleEmotes, toggleMinigames, closePickers, ytFeed, ytCurrentIndex, nextYt, prevYt, redditFeed, redditCurrentIndex, nextReddit, prevReddit, formatNumber, handleLogin, handleLogout,
            optimizeTwitchImg: (u) => u ? u.replace('%{width}', '480').replace('%{height}', '270') : '', 
            formatViews: (v) => v ? v.toLocaleString() : '0', 
            formatDate: (d) => new Date(d).toLocaleDateString([], {month:'short', day:'numeric'})
        };
    }
}).mount('#app-container');
