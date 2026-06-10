const haptic = (pattern = [8]) => { if (navigator.vibrate) navigator.vibrate(pattern); };

const ToastPopup = {
    props: ['toast'],
    template: `<div class="toast-popup" :class="{ show: toast.visible }"><span class="material-symbols-rounded" style="font-size: 18px;">{{ toast.icon || 'info' }}</span><span v-html="toast.message"></span></div>`
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
    template: `<header class="app-header" :class="{ hidden: !isHeaderVisible }" v-if="['home','clips','feed','more'].includes(currentTab)"><div style="display:flex; align-items:center; gap:10px;"><div style="width:28px;height:28px; cursor:pointer;" v-html="logoSvg('header')" @click="$emit('open-profile'); haptic()"></div><span class="gradient-text" style="font-size:20px; font-weight:900;">MikoTok</span></div><div style="display:flex; align-items:center; gap: 15px;"><a href="https://twitch.tv/codemiko" target="_blank" class="header-status-wrapper" @click="haptic()"><div class="story-ring" :class="isLive ? 'live' : 'offline'"><img src="1000018850.png?v=2" class="story-avatar" alt="Miko"><div class="header-badge" :class="isLive ? 'live' : 'offline'">{{ isLive ? 'LIVE' : 'OFFLINE' }}</div></div></a></div></header>`
};

const BottomNav = {
    props: ['currentTab'],
    template: `<nav class="bottom-nav">
        <div class="nav-item" :class="{ active: currentTab === 'home' }" @click="$emit('change-tab', 'home')">
            <span class="material-symbols-rounded">home</span><span class="nav-label">Home</span>
        </div>
        <div class="nav-item" :class="{ active: currentTab === 'clips' }" @click="$emit('change-tab', 'clips')">
            <span class="material-symbols-rounded">view_carousel</span><span class="nav-label">Clips</span>
        </div>
        <div class="nav-item" :class="{ active: currentTab === 'feed' }" @click="$emit('change-tab', 'feed')">
            <span class="material-symbols-rounded">forum</span><span class="nav-label">Social</span>
        </div>
        <div class="nav-item" :class="{ 'active': currentTab === 'gerald' }" @click="$emit('change-tab', 'gerald')">
            <span class="material-symbols-rounded" style="color: var(--gerald)">graphic_eq</span><span class="nav-label">Gerald</span>
        </div>
        <div class="nav-item" :class="{ active: currentTab === 'more' }" @click="$emit('change-tab', 'more')">
            <span class="material-symbols-rounded">apps</span><span class="nav-label">More</span>
        </div>
    </nav>`
};

const FilterMenu = {
    props: ['isOpen', 'currentFilter'],
    template: `<div class="sheet-overlay" :class="{ open: isOpen }" @click.self="$emit('close')"><div class="bottom-sheet" @click.stop><div class="drag-handle"></div><button class="sheet-option" :class="{ active: currentFilter === 'latest' }" @click="$emit('apply', 'latest', 'Latest')">Latest</button><button class="sheet-option" :class="{ active: currentFilter === 'weekly' }" @click="$emit('apply', 'weekly', 'Weekly')">Weekly</button><button class="sheet-option" :class="{ active: currentFilter === 'month' }" @click="$emit('apply', 'month', 'Monthly')">Monthly</button><button class="sheet-option" :class="{ active: currentFilter === 'alltime' }" @click="$emit('apply', 'alltime', 'All Time')">All Time</button></div></div>`
};

const ProfileModal = {
    props: ['isOpen', 'currentUser', 'loginEmail', 'loginPass', 'apiConfig', 'syncState', 'wipeState', 'logoutState'],
    template: `<div class="modal-overlay" :class="{ open: isOpen }" @click.self="$emit('close')"><div class="modal-content" @touchstart="$emit('touch-start', $event)" @touchmove="$emit('touch-move', $event)" @touchend="$emit('touch-end', $event)"><div class="drag-handle"></div><div v-if="!currentUser"><input type="text" :value="loginEmail" @change="$emit('update-email', $event.target.value)" class="input-box" style="margin-top: 10px;" placeholder="Email"><input type="password" :value="loginPass" @change="$emit('update-pass', $event.target.value)" class="input-box" @keyup.enter="$emit('login')" placeholder="Password"><button class="sync-btn" @click="$emit('login')">LOGIN</button></div><div v-else><div style="display:flex; justify-content:center; align-items:center; gap:8px; margin-bottom:20px; font-size:13px; color:var(--success); font-weight:600;"><div class="pulse"></div> SYSTEM READY</div><input type="text" class="input-box" :value="apiConfig.cid" @change="$emit('update-api', 'cid', $event.target.value)" placeholder="Twitch Client ID"><input type="password" class="input-box" :value="apiConfig.tkn" @change="$emit('update-api', 'tkn', $event.target.value)" placeholder="Twitch Access Token" style="margin-bottom:20px;"><button class="sync-btn" style="background:#2c2c2e" @click="$emit('sync')">{{ syncState === 'syncing' ? 'SYNCING...' : 'FORCE SYNC DATA' }}</button><button class="sync-btn" style="background:rgba(255,69,58,0.2); color:var(--danger);" @click="$emit('wipe')">WIPE GERALD MEMORY</button><button class="sync-btn" style="background:transparent; border:1px solid #3a3a3c; color:#a1a1aa;" @click="$emit('logout')">SIGN OUT</button></div></div></div>`
};

const GeraldView = {
    props: ['currentTab', 'geraldMessages', 'isGeraldTyping', 'geraldInput', 'showEmotePicker', 'showMinigames', 'customEmotes', 'parseMarkdown'],
    template: `<div class="gerald-container" v-show="currentTab === 'gerald'"><div class="gerald-header" @click="$emit('close-pickers')"><div style="width: 70px; height: 70px; border-radius: 50%; border: 2px solid var(--gerald); overflow: hidden; margin-bottom: 8px;"><img src="gerald.png" style="width: 100%; height: 100%; object-fit: cover;" alt="G"></div><div style="font-size:11px; color:var(--text-muted); font-weight:700; text-transform: uppercase;">Gerald OS // Online</div></div><transition-group name="msg" tag="div" class="gerald-messages" id="gerald-msgs" @click="$emit('close-pickers')"><template v-for="(m, i) in geraldMessages" :key="i"><div v-if="i === 0 && m.role === 'gerald'" class="terminal-intro"><div class="terminal-header"><span class="material-symbols-rounded" style="font-size: 14px;">terminal</span> Initialized</div><div class="terminal-text">> "{{ m.content }}"</div></div><div v-else class="chat-bubble" :class="m.role" v-html="parseMarkdown(m.content)"></div></template><div v-if="isGeraldTyping" key="typing" class="typing-indicator"><div class="pulse" style="background:var(--gerald);"></div>COMPUTING...</div></transition-group><div style="display:flex; flex-direction:column; background: #000; width: 100%;"><transition name="tray"><div class="tray-container" v-show="showEmotePicker"><img v-for="(emote, name) in customEmotes" :key="name" :src="emote.url ? emote.url : \`https://cdn.discordapp.com/emojis/\${emote.id}.\${emote.animated ? 'gif' : 'png'}?size=44\`" class="emote-picker-img" @click="$emit('insert-emote', name)"></div></transition><div class="gerald-input-area"><div class="gerald-input-wrapper"><button class="emote-toggle-btn" @click="$emit('toggle-emotes')"><span class="material-symbols-rounded">mood</span></button><textarea class="gerald-input" rows="1" placeholder="Query Gerald..." :value="geraldInput" @input="$emit('update-input', $event.target.value)" @keydown="$emit('key-down', $event)" id="gerald-txt-input" @focus="$emit('close-pickers')"></textarea></div><button class="gerald-send" @click="$emit('send')"><span class="material-symbols-rounded">arrow_upward</span></button></div></div></div>`
};

const FeedView = {
    props: ['currentTab', 'isRefreshing', 'ytFeed', 'ytCurrentIndex', 'redditFeed', 'redditCurrentIndex', 'formatNumber'],
    template: `<div class="feed-layout" v-show="currentTab === 'feed'">
        <div id="yt-wrapper">
            <div v-if="isRefreshing" class="skeleton-card" style="aspect-ratio:16/9;"><div class="skeleton-img"></div></div>
            <template v-else-if="ytFeed && ytFeed.length > 0">
                <div class="video-container" style="border-radius:16px; border:1px solid var(--border-color)"><iframe v-if="currentTab === 'feed'" :src="'https://www.youtube.com/embed/' + ytFeed[ytCurrentIndex].id" allowfullscreen loading="lazy"></iframe></div>
                <div class="carousel-controls"><button class="carousel-btn" :class="{ 'hidden-arrow': ytCurrentIndex <= 0 }" @click.stop="$emit('prev-yt')"><span class="material-symbols-rounded">chevron_left</span></button><button class="carousel-btn" :class="{ 'hidden-arrow': ytCurrentIndex >= ytFeed.length - 1 }" @click.stop="$emit('next-yt')"><span class="material-symbols-rounded">chevron_right</span></button></div>
            </template>
        </div>
        <div id="reddit-wrapper">
            <div v-if="isRefreshing" class="skeleton-card" style="flex:1"><div class="skeleton-line" style="margin-top:20px; width:40%"></div><div class="skeleton-line" style="width:80%"></div><div class="skeleton-line" style="width:70%"></div></div>
            <template v-else-if="redditFeed && redditFeed.length > 0">
                <a :href="'https://reddit.com' + redditFeed[redditCurrentIndex].permalink" target="_blank" class="reddit-compact-card" style="flex:1">
                    <div class="reddit-header"><div class="reddit-author">Posted • {{ redditFeed[redditCurrentIndex].date }}<br><span>u/{{ redditFeed[redditCurrentIndex].author }}</span></div></div>
                    <div v-if="redditFeed[redditCurrentIndex].thumbnail && redditFeed[redditCurrentIndex].thumbnail.startsWith('http')" class="reddit-img-container"><img :src="redditFeed[redditCurrentIndex].thumbnail" onerror="this.style.display='none'"></div>
                    <div class="reddit-post-title">{{ redditFeed[redditCurrentIndex].title }}</div>
                </a>
                <div class="carousel-controls"><button class="carousel-btn" :class="{ 'hidden-arrow': redditCurrentIndex <= 0 }" @click.stop="$emit('prev-reddit')"><span class="material-symbols-rounded">chevron_left</span></button><button class="carousel-btn" :class="{ 'hidden-arrow': redditCurrentIndex >= redditFeed.length - 1 }" @click.stop="$emit('next-reddit')"><span class="material-symbols-rounded">chevron_right</span></button></div>
            </template>
        </div>
    </div>`
};

const HomeView = {
    props: ['currentTab', 'isRefreshing', 'currentVodIndex', 'recentVods', 'isLive', 'activeFeedVideo', 'hostname'],
    template: `<div class="dashboard-grid-container" v-show="currentTab === 'home'">
        <div class="dashboard-stream-box">
            <div class="dashboard-header">
                <div class="premium-badge live" v-if="currentVodIndex === -1"><div class="dot"></div>LIVE NOW</div>
                <div class="premium-badge vod" v-else-if="recentVods && recentVods.length > 0"><div class="dot"></div>VOD • {{ recentVods[currentVodIndex] ? recentVods[currentVodIndex].date : '' }}</div>
            </div>
            <div class="video-container" style="border-radius:0;">
                <iframe v-if="activeFeedVideo === 'featured' && currentTab === 'home' && currentVodIndex === -1" id="miko-live-player" :src="'https://player.twitch.tv/?channel=codemiko&parent=' + hostname + '&autoplay=true&muted=true'" allowfullscreen></iframe>
                <iframe v-else-if="activeFeedVideo === 'featured' && currentTab === 'home' && recentVods && recentVods[currentVodIndex]" :src="'https://player.twitch.tv/?video=' + recentVods[currentVodIndex].id + '&parent=' + hostname + '&autoplay=true&muted=true'" allowfullscreen></iframe>
            </div>
            <div class="carousel-controls" v-if="recentVods && recentVods.length > 0 && !isLive">
                <button class="carousel-btn" :class="{ 'hidden-arrow': currentVodIndex <= 0 }" @click.stop="$emit('prev-vod')"><span class="material-symbols-rounded">chevron_left</span></button>
                <button class="carousel-btn" :class="{ 'hidden-arrow': currentVodIndex >= recentVods.length - 1 }" @click.stop="$emit('next-vod')"><span class="material-symbols-rounded">chevron_right</span></button>
            </div>
        </div>
        <div class="dashboard-chat-box">
            <iframe v-if="currentTab === 'home'" :src="'https://www.twitch.tv/embed/codemiko/chat?parent=' + hostname + '&darkpopout'" style="width: 100%; height: 100%; border: none;"></iframe>
        </div>
    </div>`
};

const ClipsView = {
    props: ['currentTab', 'clips', 'isRefreshing', 'activeFeedVideo', 'activeFilterLabel', 'hostname', 'optimizeTwitchImg', 'formatViews', 'formatDate'],
    template: `<div class="scroll-area" id="clips-scroll" v-show="currentTab === 'clips'" @scroll="$emit('scroll', $event)">
        <div v-if="isRefreshing" class="feed-snap-item"><div class="skeleton-img" style="height:100%"></div></div>
        <div v-else class="feed-snap-item" v-for="(clip, index) in clips" :key="clip.id" :data-id="clip.id">
            <div v-if="index === 0" class="clips-header"><button class="filter-btn-tiny" @click="$emit('open-filter')"><span class="material-symbols-rounded" style="font-size: 16px;">sort</span>{{ activeFilterLabel }}</button></div>
            <div class="video-container">
                <img :src="clip.thumbnail_url ? optimizeTwitchImg(clip.thumbnail_url) : ''" loading="lazy">
                <iframe v-if="activeFeedVideo === clip.id && currentTab === 'clips'" :src="'https://clips.twitch.tv/embed?clip=' + clip.id + '&parent=' + hostname + '&autoplay=true&muted=false'" allowfullscreen></iframe>
            </div>
            <div class="miko-metadata">
                <div class="author-info">
                    <img src="1000018850.png?v=2" loading="lazy">
                    <div>
                        <div class="author-name">{{ clip.title }}</div>
                        <div class="clip-stats">{{ formatViews(clip.view_count) }} views • {{ formatDate(clip.created_at) }}</div>
                    </div>
                </div>
                <button class="share-btn" @click.stop="$emit('share-clip', clip)"><span class="material-symbols-rounded">ios_share</span></button>
            </div>
        </div>
    </div>`
};

const MoreView = {
    props: ['currentTab'],
    template: `<div class="scroll-area" v-show="currentTab === 'more'" style="padding: max(100px, env(safe-area-inset-top, 100px)) 20px 95px;">
        <h2 style="font-family:'Outfit'; font-weight:900; font-size:28px; margin:0 0 5px;">Link Hub</h2>
        <p style="color:var(--text-muted); font-size:14px; margin:0 0 25px;">Official ecosystem & tracking nodes.</p>
        <div class="social-matrix-grid">
            <a href="https://twitch.tv/codemiko" target="_blank" class="matrix-card twitch"><span class="material-symbols-rounded">live_tv</span>Twitch</a>
            <a href="https://youtube.com/@CodeMiko" target="_blank" class="matrix-card youtube"><span class="material-symbols-rounded">video_library</span>YouTube</a>
            <a href="https://reddit.com/r/CodeMiko" target="_blank" class="matrix-card reddit"><span class="material-symbols-rounded">forum</span>Reddit</a>
            <a href="https://x.com/codemiko" target="_blank" class="matrix-card twitter"><span class="material-symbols-rounded">alternate_email</span>Twitter</a>
            <a href="https://discord.gg/codemiko" target="_blank" class="matrix-card discord" style="grid-column: span 2; flex-direction: row; justify-content: center;"><span class="material-symbols-rounded">groups</span>Discord Server</a>
        </div>
    </div>`
};

const { createApp, ref, onMounted, nextTick, watch } = Vue;
const sbClient = supabase.createClient('https://yhxcuayiwqpjvalyrcqv.supabase.co', 'sb_publishable_VyFcNARHblJg10qlC_O7Dg_coouXK92');

createApp({
    components: {
        ToastPopup, SplashScreen, PullToRefresh, 
        AppHeader, BottomNav, FilterMenu, 
        ProfileModal, GeraldView, FeedView, HomeView, ClipsView, MoreView
    },
    setup() {
        const initialHash = window.location.hash.replace('#', '');
        const validTabs = ['home', 'clips', 'feed', 'gerald', 'more'];
        const currentTab = ref(validTabs.includes(initialHash) ? initialHash : 'home');
        
        const splashVisible = ref(true), splashOpacity = ref(1), clips = ref([]), allClips = ref([]), modals = ref({profile: false}), isLive = ref(false), currentUser = ref(null), loginEmail = ref(''), loginPass = ref(''), toast = ref({visible: false, message: '', icon: ''}), latestVodId = ref(null), hostname = window.location.hostname || 'meowoccino.github.io', activeFeedVideo = ref('featured');
        
        const syncState = ref('idle'), wipeState = ref('idle'), logoutState = ref('idle');
        const apiConfig = ref({ cid: localStorage.getItem('twitch_cid') || '', tkn: localStorage.getItem('twitch_tkn') || '' });

        const customEmotes = ref({
            "KEKW": { id: "1456296327964262453", animated: false }, "mkoNOTED": { id: "1369891690898391070", animated: false }, "mkoHype": { id: "870761283035734086", animated: false }, "mkoMania": { id: "1503598179751432212", animated: false }, "mkoLove": { id: "1150505635721519115", animated: false }, "WOWERS": { id: "780097274939965490", animated: false }, "Shruge": { id: "1456297412875518078", animated: false }, "PAUSERS": { id: "802261333403762740", animated: false }, "slayyy": { id: "1456297602910916760", animated: false }, "monkaLaugh": { id: "1434154468303306873", animated: false }, "D_": { id: "1456295688626241619", animated: false }, "GOTTEM": { id: "1456295684272689227", animated: false }, "GeraldStare": { id: "1159443810913370142", animated: false }, "Sleepy": { id: "746777321171845161", animated: false }, "mkoGiggle": { id: "1369906899293569024", animated: false }, "Bedge": { id: "1369823782084022423", animated: false }, "mkoCoffee": { id: "1369891686544834570", animated: false }, "peepoPoo": { id: "693055750955597885", animated: false }, "mkoDabbing": { id: "1200367139018776666", animated: false }, "BASED": { id: "1456295686101274684", animated: false }, "mkoPETTHEGERALD": { id: "1200367119968251904", animated: false }, "mkoPETTHETECH": { id: "1200367128797257799", animated: false }, "CAUGHT": { id: "1456296592133849201", animated: false }, "Catgasm": { id: "746777956810096781", animated: false }, "KEKWait": { id: "692783542589194310", animated: false }, "mkoPepeGlitch": { id: "1200367134094655508", animated: false }, "GeraldFook": { id: "1229010692007395328", animated: false }, "mkoSiren": { url: "https://cdn.7tv.app/emote/01G04HWGX00008WN11V1V5ABXE/2x.webp" }
        });

        const getGreeting = () => "System initialized. State your inquiry.";
        const geraldInput = ref(''), geraldMessages = ref([{role:'gerald', content: getGreeting()}]), isGeraldTyping = ref(false), showEmotePicker = ref(false), showMinigames = ref(false);
        
        const pullTimestamps = ref([]);
        const currentFilter = ref('latest'), activeFilterLabel = ref('Latest'), isFilterMenuOpen = ref(false);
        const isPulling = ref(false), refreshTransform = ref('translateY(-100%)'), isRefreshing = ref(false);
        let touchStartY = 0, pullDistance = 0;

        const recentVods = ref([]), currentVodIndex = ref(0), ytFeed = ref([]), ytCurrentIndex = ref(0), redditFeed = ref([]), redditCurrentIndex = ref(0);

        const nextVod = () => { haptic(); if (currentVodIndex.value < recentVods.value.length - 1) currentVodIndex.value++; };
        const prevVod = () => { haptic(); const minIndex = isLive.value ? -1 : 0; if (currentVodIndex.value > minIndex) currentVodIndex.value--; };
        const nextYt = () => { haptic(); if (ytCurrentIndex.value < ytFeed.value.length - 1) ytCurrentIndex.value++; };
        const prevYt = () => { haptic(); if (ytCurrentIndex.value > 0) ytCurrentIndex.value--; };
        const nextReddit = () => { haptic(); if (redditCurrentIndex.value < redditFeed.value.length - 1) redditCurrentIndex.value++; };
        const prevReddit = () => { haptic(); if (redditCurrentIndex.value > 0) redditCurrentIndex.value--; };

        const formatNumber = (num) => (num && num > 999) ? (num/1000).toFixed(1) + 'k' : (num || 0);
        const closeFilterMenu = () => { isFilterMenuOpen.value = false; };
        const insertEmote = (name) => { haptic(); const inputEl = document.getElementById('gerald-txt-input'); if (inputEl) { inputEl.value += `:${name}: `; geraldInput.value = inputEl.value; } else { geraldInput.value += `:${name}: `; } };

        const scrollToBottom = () => { const b = document.getElementById('gerald-msgs'); if (!b) return; nextTick(() => { b.scrollTo({ top: b.scrollHeight, behavior: 'smooth' }); setTimeout(() => { b.scrollTop = b.scrollHeight; }, 50); }); };

        const runNeonAnimation = () => { isRefreshing.value = true; setTimeout(() => { isRefreshing.value = false; }, 1200); };

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
            haptic(); currentFilter.value = filterKey; activeFilterLabel.value = label; isFilterMenuOpen.value = false; runNeonAnimation();
            const feedContainer = document.getElementById('clips-scroll');
            if(feedContainer) {
                clips.value = sortData(filterKey);
                nextTick(() => {
                    feedContainer.style.scrollSnapType = 'none'; feedContainer.scrollTop = 0; setTimeout(() => { feedContainer.style.scrollSnapType = 'y mandatory'; }, 50);
                });
            }
        };

        const getActiveScrollEl = () => ['home','clips'].includes(currentTab.value) ? document.getElementById(currentTab.value === 'clips' ? 'clips-scroll' : 'feed-scroll') : null;

        const handlePullStart = (e) => {
            const activeScroll = getActiveScrollEl();
            if (activeScroll && typeof activeScroll.scrollTop !== 'undefined' && activeScroll.scrollTop <= 0 && !isRefreshing.value) {
                touchStartY = e.touches[0].clientY; isPulling.value = true;
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
                haptic([15, 10, 15]);
                const now = Date.now();
                pullTimestamps.value.push(now); pullTimestamps.value = pullTimestamps.value.filter(t => now - t < 10000);
                if (pullTimestamps.value.length >= 3) {
                    showToast("Rate limited. Breathe.", "warning");
                    pullTimestamps.value = [];
                } else {
                    runNeonAnimation(); 
                    if (currentTab.value === 'feed') { fetchSocialFeeds(); } else { loadData(); }
                }
            }
            isPulling.value = false; pullDistance = 0; refreshTransform.value = 'translateY(-100%)';
        };

        const changeTab = (tab) => {
            haptic();
            if (!document.startViewTransition) {
                currentTab.value = tab;
            } else {
                document.startViewTransition(() => {
                    currentTab.value = tab;
                });
            }
        };

        watch(currentTab, (newTab) => { 
            if (window.location.hash !== `#${newTab}`) { window.history.pushState(null, '', `#${newTab}`); }
            if (newTab === 'gerald') { setTimeout(scrollToBottom, 50); }
            if (newTab !== 'clips' && newTab !== 'home') { activeFeedVideo.value = null; }
            else if (newTab === 'home') { activeFeedVideo.value = 'featured'; }
        });
        window.addEventListener('popstate', () => { const hash = window.location.hash.replace('#', ''); if (validTabs.includes(hash)) { changeTab(hash); } else { changeTab('home'); }});
        
        const isHeaderVisible = ref(true); let lastScrollY = 0;
        const handleScroll = (e) => { 
            const currentScrollY = e.target.scrollTop; 
            if (currentScrollY <= 0) { isHeaderVisible.value = true; return; } 
            if (Math.abs(currentScrollY - lastScrollY) < 10) return; 
            isHeaderVisible.value = currentScrollY < lastScrollY; 
            lastScrollY = currentScrollY; 
        };

        let modalStartY = 0, currentDeltaY = 0;
        const handleModalTouchStart = (e) => { if (e.currentTarget.scrollTop <= 0) { modalStartY = e.touches[0].clientY; currentDeltaY = 0; } };
        const handleModalTouchMove = (e) => { if (!modalStartY) return; currentDeltaY = e.touches[0].clientY - modalStartY; if (currentDeltaY > 0) { e.currentTarget.style.transform = `translateY(${currentDeltaY}px)`; e.currentTarget.style.transition = 'none'; } };
        const handleModalTouchEnd = (e) => { if (!modalStartY) return; e.currentTarget.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'; if (currentDeltaY > 100) { modals.value.profile = false; } e.currentTarget.style.transform = ''; modalStartY = 0; };

        const logoSvg = (id) => `<svg viewBox="0 0 100 100"><defs><linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#9146FF"/></linearGradient></defs><circle cx="50" cy="50" r="40" fill="none" stroke="url(#grad-${id})" stroke-width="8"/><path d="M 33 38 L 48 62 L 62 38 L 62 55 Q 62 65 69 64" fill="none" stroke="url(#grad-${id})" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        const showToast = (msg, icon = 'info_i') => { 
            haptic([12,6,12]);
            toast.value = { message: msg, icon: icon, visible: true }; 
            setTimeout(() => toast.value.visible = false, 3000); 
        };
        
        const parseMarkdown = (text) => {
            if (!text) return '';
            let html = text.replace(/</g, '<').replace(/>/g, '>');
            html = html.replace(/(^|\W)'([^']+)'(\W|$)/g, '$1<strong>$2</strong>$3');
            html = html.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1'); 
            html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/gi, '<a href="$2" target="_blank" style="color: inherit; text-decoration: underline; font-weight: bold;">$1</a>');
            html = html.replace(/(^|[^"'])(https?:\/\/[^\s<)]+)/gi, '$1<a href="$2" target="_blank" style="color: inherit; text-decoration: underline; word-break: break-all;">$2</a>');
            html = html.replace(/`?:([^:\s]+):`?/g, (match, name) => {
                const emote = customEmotes.value[name];
                if (emote) { return `<img src="${emote.url ? emote.url : `https://cdn.discordapp.com/emojis/${emote.id}.${emote.animated ? 'gif' : 'png'}?size=44`}" style="height: 1.5em; vertical-align: middle; display: inline-block;">`; }
                return match;
            });
            return html;
        };

        const shareClip = async (clip) => { haptic(); const url = `https://clips.twitch.tv/${clip.id}`; if (navigator.share) { try { await navigator.share({ title: clip.title, url: url }); } catch (err) {} } else { navigator.clipboard.writeText(url); showToast("Link copied", "content_copy"); } };
        const handleGeraldEnter = (e) => { if (!e.shiftKey && e.key === 'Enter') { e.preventDefault(); talkToGerald(); } };

        const toggleEmotes = () => { haptic(); showEmotePicker.value = !showEmotePicker.value; showMinigames.value = false; };
        const toggleMinigames = () => { haptic(); showMinigames.value = !showMinigames.value; showEmotePicker.value = false; };
        const closePickers = () => { showEmotePicker.value = false; showMinigames.value = false; };

        const talkToGerald = async () => {
            const inputEl = document.getElementById('gerald-txt-input');
            if (inputEl && inputEl.value !== geraldInput.value) { geraldInput.value = inputEl.value; }
            if (!geraldInput.value.trim() || isGeraldTyping.value) return;
            
            haptic();
            const userMsg = geraldInput.value;
            geraldMessages.value.push({ role: 'user', content: userMsg });

            if (currentUser.value) { sbClient.from('gerald_history').insert({ role: 'user', content: userMsg, user_id: currentUser.value.id }).then(); }
            
            geraldInput.value = ''; 
            if (inputEl) { inputEl.value = ''; inputEl.style.height = 'auto'; } 
            
            isGeraldTyping.value = true; closePickers(); scrollToBottom();
            
            const recentContextWindow = geraldMessages.value.slice(-10);
            const geminiHistory = [];
            recentContextWindow.forEach((m, index) => {
                if (index === 0 && m.role === 'gerald' && m.content.includes("Synapses loaded")) return; 
                geminiHistory.push({ role: m.role === 'gerald' ? 'model' : 'user', parts: [{ text: m.content }] });
            });
            
            try {
                const { data, error } = await sbClient.functions.invoke('gerald-chat', { body: { history: geminiHistory } });
                if (error) throw error;
                if (data && data.reply) {
                    let cleanReply = data.reply.trim().charAt(0).toUpperCase() + data.reply.trim().slice(1);
                    haptic();
                    geraldMessages.value.push({ role: 'gerald', content: cleanReply });
                    if (currentUser.value) { sbClient.from('gerald_history').insert({ role: 'gerald', content: cleanReply, user_id: currentUser.value.id }).then(); }
                } else if (data && data.error) { throw new Error(data.error); }
            } catch (e) { geraldMessages.value.push({ role: 'gerald', content: 'SYSTEM ERROR: ' + (e.message || JSON.stringify(e)) }); 
            } finally { isGeraldTyping.value = false; scrollToBottom(); }
        };

        const setupObserver = () => {
            if (window.feedObserver) window.feedObserver.disconnect();
            const scrollContainer = document.getElementById('clips-scroll');
            if (!scrollContainer) return;
            window.feedObserver = new IntersectionObserver((entries) => {
                let maxRatio = 0; let bestMatch = activeFeedVideo.value;
                entries.forEach(entry => { 
                    if (entry.isIntersecting && entry.intersectionRatio > maxRatio) { 
                        maxRatio = entry.intersectionRatio; 
                        bestMatch = entry.target.getAttribute('data-id'); 
                    } 
                });
                if (maxRatio > 0.5 && bestMatch !== activeFeedVideo.value) { 
                    activeFeedVideo.value = bestMatch;
                    haptic([5]); // subtle tick on snap
                }
            }, { root: scrollContainer, threshold: [0.1, 0.5, 0.9] });
            nextTick(() => { const items = document.querySelectorAll('#clips-scroll .feed-snap-item'); items.forEach(el => window.feedObserver.observe(el)); });
        };

        const loadData = async () => {
            isRefreshing.value = true;
            const { data: dbEmotes } = await sbClient.from('emotes').select('*');
            if (dbEmotes) { dbEmotes.forEach(e => { customEmotes.value[e.name] = { id: e.id, animated: e.animated }; }); }

            const { data: c } = await sbClient.from('clips').select('*').order('created_at', { ascending: false }).limit(3000);
            allClips.value = c || []; clips.value = sortData(currentFilter.value);
            isRefreshing.value = false;
            if (currentTab.value === 'clips') setupObserver();
        };

        const fetchSocialFeeds = () => {
            isRefreshing.value = true;
            const abortController = new AbortController();
            setTimeout(() => abortController.abort(), 8000);

            fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.reddit.com/r/CodeMiko/new.json?limit=15'), { signal: abortController.signal })
                .then(res => res.json())
                .then(data => {
                    if (data && data.contents) {
                        const parsed = JSON.parse(data.contents);
                        if (parsed && parsed.data && parsed.data.children) {
                            redditFeed.value = parsed.data.children.filter(child => !child.data.stickied).slice(0, 10).map(child => {
                                let d = child.data;
                                return {
                                    id: d.id, author: d.author, title: d.title, url: d.url, thumbnail: d.thumbnail,
                                    ups: d.ups, num_comments: d.num_comments, permalink: d.permalink, link_flair_text: d.link_flair_text,
                                    date: new Date(d.created_utc * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                                }
                            });
                        }
                    }
                })
                .catch(err => { redditFeed.value = [{ permalink: '/r/CodeMiko', author: 'System Sync', title: "Reddit timeline parsed cleanly.", thumbnail: '', ups: 10, num_comments: 2, date: "Live Feed" }]; });

            const ytFeedUrl = encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=UCO9kIeDrtsX0j83HbVljzSQ');
            fetch(`https://api.rss2json.com/v1/api.json?rss_url=${ytFeedUrl}`, { signal: abortController.signal })
                .then(res => res.json())
                .then(data => {
                    if (data && data.items && data.items.length > 0) {
                        ytFeed.value = data.items.slice(0, 10).map(item => {
                            let vidId = item.link.split('v=')[1] || item.guid.split(':').pop();
                            return { id: vidId, title: item.title, date: new Date(item.pubDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) };
                        });
                    }
                })
                .catch(err => { ytFeed.value = [{ id: 'NlRcbGkXy2A', title: "YouTube streams synchronized.", date: "Today" }]; })
                .finally(() => { isRefreshing.value = false; });
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
                const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(); 
                let totalSynced = 0, cursor = '';
                do {
                    const cR = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${uD.data[0].id}&started_at=${startDate}&ended_at=${endDate}&first=100${cursor ? '&after='+cursor : ''}`, { headers: {'Client-Id': apiConfig.value.cid, 'Authorization': `Bearer ${apiConfig.value.tkn}`} });
                    const cD = await cR.json();
                    if (cD.data?.length > 0) {
                        const ins = cD.data.map(x => ({ id: x.id, thumbnail_url: x.thumbnail_url, title: x.view_count, created_at: x.created_at, added_by: 'CodeMiko' }));
                        await sbClient.from('clips').upsert(ins, { onConflict: 'id' }); totalSynced += cD.data.length;
                    }
                    cursor = cD.pagination?.cursor;
                } while (cursor && totalSynced < 1000); 
                await loadData(); syncState.value = 'sync-success'; setTimeout(() => syncState.value = 'idle', 2000);
            } catch (e) { syncState.value = 'idle'; }
        };

        onMounted(async () => {
            if (currentTab.value === 'home') activeFeedVideo.value = 'featured';
            const { data: { session } } = await sbClient.auth.getSession();
            if (session?.user) { currentUser.value = session.user; loadGeraldHistory(); }
            loadData(); checkLive(); fetchSocialFeeds(); 
            
            const audioUnmuteTrigger = () => {
                const livePlayerFrame = document.getElementById('miko-live-player');
                if (livePlayerFrame && livePlayerFrame.src.includes('muted=true')) { livePlayerFrame.src = livePlayerFrame.src.replace('muted=true', 'muted=false'); }
                window.removeEventListener('click', audioUnmuteTrigger);
                window.removeEventListener('touchstart', audioUnmuteTrigger);
            };
            window.addEventListener('click', audioUnmuteTrigger);
            window.addEventListener('touchstart', audioUnmuteTrigger);

            setInterval(fetchSocialFeeds, 14400000); 
            setInterval(checkLive, 60000); 
            setTimeout(() => { splashOpacity.value = 0; setTimeout(() => splashVisible.value = false, 400); }, 1500);
        });

        return { 
            hostname, splashVisible, splashOpacity, currentTab, changeTab, clips, modals, isLive, toast, currentUser, loginEmail, loginPass, apiConfig, latestVodId, activeFeedVideo, geraldInput, geraldMessages, isGeraldTyping, talkToGerald, logoSvg, syncState, wipeState, logoutState, runSync, isHeaderVisible, handleScroll, handleModalTouchStart, handleModalTouchMove, handleModalTouchEnd, currentFilter, activeFilterLabel, isFilterMenuOpen, closeFilterMenu, applyFilter, parseMarkdown, shareClip, recentVods, currentVodIndex, getVodLabel, nextVod, prevVod, customEmotes, showEmotePicker, showMinigames, insertEmote, clearGeraldHistory, isPulling, refreshTransform, isRefreshing, handlePullStart, handlePullMove, handlePullEnd, handleGeraldEnter, toggleEmotes, toggleMinigames, closePickers, ytFeed, ytCurrentIndex, nextYt, prevYt, redditFeed, redditCurrentIndex, nextReddit, prevReddit, formatNumber, playMinigame: () => {},
            handleLogin: async () => { const email = loginEmail.value.includes('@') ? loginEmail.value : `${loginEmail.value}@miko.com`; const { data } = await sbClient.auth.signInWithPassword({ email, password: loginPass.value }); if(data.user) { currentUser.value = data.user; modals.value.profile = false; loadGeraldHistory(); } }, 
            handleLogout: () => { if (logoutState.value !== 'idle') return; logoutState.value = 'logging_out'; setTimeout(() => { sbClient.auth.signOut(); currentUser.value = null; modals.value.profile = false; logoutState.value = 'idle'; }, 1500); },
            optimizeTwitchImg: (u) => u ? u.replace('%{width}', '480').replace('%{height}', '270') : '', 
            formatViews: (v) => v ? v.toLocaleString() : '0', 
            formatDate: (d) => new Date(d).toLocaleDateString([], {month:'short', day:'numeric'})
        };
    }
}).mount('#app-container');
