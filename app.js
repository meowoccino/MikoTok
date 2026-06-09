const ToastPopup = {
    props: ['toast'],
    template: `<div class="toast-popup" :class="{ show: toast.visible }" v-html="toast.message"></div>`
};

const SplashScreen = {
    props: ['splashVisible', 'splashOpacity', 'logoSvg'],
    template: `<div id="splash-screen" v-if="splashVisible" :style="{ opacity: splashOpacity, position:'fixed', inset:0, zIndex:9999, background:'var(--bg-color)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }"><div style="width:100px;height:100px;margin-bottom:20px;" v-html="logoSvg('splash')"></div><div style="font-size: 32px; font-weight: 900; color:var(--primary);">MikoTok</div></div>`
};

const PullToRefresh = {
    props: ['isPulling', 'refreshTransform', 'isRefreshing'],
    template: `<div class="pull-refresh-indicator" :class="{ pulling: isPulling }" :style="{ transform: refreshTransform, position:'absolute', top:0, left:'50%', zIndex:100 }"><span class="material-symbols-rounded" :class="{ 'refresh-spinning': isRefreshing }">sync</span></div>`
};

const AppHeader = {
    props: ['isHeaderVisible', 'currentTab', 'isLive', 'logoSvg'],
    template: `<header class="app-header" v-if="currentTab !== 'chat'"><div style="display:flex; align-items:center; gap:10px;"><div style="width:24px;height:24px; cursor:pointer; color:var(--primary);" v-html="logoSvg('header')" @click="$emit('open-profile')"></div><span style="font-size:18px; font-weight:900;">MikoTok</span></div><div style="display:flex; align-items:center; gap: 15px;"><a href="https://twitch.tv/codemiko" target="_blank" style="text-decoration:none;"><div class="story-ring" :class="isLive ? 'live' : 'offline'"><img src="1000018850.png?v=2" class="story-avatar" alt="Miko"><div class="header-badge" :class="isLive ? 'live' : 'offline'">{{ isLive ? 'LIVE' : 'OFFLINE' }}</div></div></a></div></header>`
};

const BottomNav = {
    props: ['currentTab'],
    template: `<nav class="bottom-nav"><div class="nav-item" :class="{ active: currentTab === 'home' }" @click="$emit('change-tab', 'home')"><span class="material-symbols-rounded">home</span>Home</div><div class="nav-item" :class="{ active: currentTab === 'chat' }" @click="$emit('change-tab', 'chat')"><span class="material-symbols-rounded">chat</span>Chat</div><div class="nav-item" :class="{ active: currentTab === 'feed' }" @click="$emit('change-tab', 'feed')"><span class="material-symbols-rounded">video_library</span>Feeds</div><div class="nav-item" :class="{ active: currentTab === 'gerald' }" @click="$emit('change-tab', 'gerald')"><span class="material-symbols-rounded">terminal</span>Gerald</div></nav>`
};

const DiscordModal = {
    props: ['isOpen'],
    template: `<div class="modal-overlay" :class="{ open: isOpen }" @click.self="$emit('close')"><div class="modal-content" style="text-align: center; align-items: center;" @touchstart="$emit('touch-start', $event)" @touchmove="$emit('touch-move', $event)" @touchend="$emit('touch-end', $event)"><div style="width: 40px; height: 5px; background: rgba(255,255,255,0.2); border-radius: 3px; margin: 0 auto 24px;"></div><h2 style="font-size: 20px; font-weight: 800; margin-bottom: 20px;">Join Discord</h2><div style="display: flex; flex-direction: column; gap: 12px; width: 100%;"><a href="https://discord.com/invite/codemiko" target="_blank" @click="$emit('close')" style="background: var(--discord); color: white; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">Launch Server</a><button @click="$emit('close')" style="background: transparent; border: none; color: var(--text-muted); padding: 16px; font-weight: 600;">Cancel</button></div></div></div>`
};

const FilterMenu = {
    props: ['isOpen', 'currentFilter'],
    template: `<div class="sheet-overlay" :class="{ open: isOpen }" @click.self="$emit('close')"><div class="bottom-sheet" @click.stop><div style="width: 40px; height: 5px; background: rgba(255,255,255,0.2); border-radius: 3px; margin: 0 auto 24px;"></div><button class="sheet-option" :class="{ active: currentFilter === 'latest' }" @click="$emit('apply', 'latest', 'Latest')">Latest</button><button class="sheet-option" :class="{ active: currentFilter === 'weekly' }" @click="$emit('apply', 'weekly', 'Weekly')">Weekly</button><button class="sheet-option" :class="{ active: currentFilter === 'month' }" @click="$emit('apply', 'month', 'Monthly')">Monthly</button><button class="sheet-option" :class="{ active: currentFilter === 'alltime' }" @click="$emit('apply', 'alltime', 'All Time')">All Time</button></div></div>`
};

const ProfileModal = {
    props: ['isOpen', 'currentUser', 'loginEmail', 'loginPass', 'apiConfig', 'syncState', 'wipeState', 'logoutState'],
    template: `<div class="modal-overlay" :class="{ open: isOpen }" @click.self="$emit('close')"><div class="modal-content" @touchstart="$emit('touch-start', $event)" @touchmove="$emit('touchmove', $event)" @touchend="$emit('touch-end', $event)"><div style="width: 40px; height: 5px; background: rgba(255,255,255,0.2); border-radius: 3px; margin: 0 auto 24px;"></div><div v-if="!currentUser"><input type="text" :value="loginEmail" @change="$emit('update-email', $event.target.value)" style="width: 100%; padding: 12px; border-radius: 8px; border: none; margin-bottom: 12px; background: #000; color: white;" placeholder="Email"><input type="password" :value="loginPass" @change="$emit('update-pass', $event.target.value)" style="width: 100%; padding: 12px; border-radius: 8px; border: none; margin-bottom: 12px; background: #000; color: white;" @keyup.enter="$emit('login')" placeholder="Password"><button style="width: 100%; padding: 12px; background: var(--primary); color: #000; border: none; border-radius: 8px; font-weight: bold;" @click="$emit('login')">LOGIN</button></div><div v-else><div style="margin-bottom: 20px;">System Ready</div><button style="width: 100%; padding: 12px; background: var(--surface-hover); color: white; border: none; border-radius: 8px; margin-bottom: 12px;" @click="$emit('sync')">{{ syncState === 'syncing' ? 'Syncing...' : 'Force Data Sync' }}</button><button style="width: 100%; padding: 12px; background: #3f3f46; color: white; border: none; border-radius: 8px;" @click="$emit('logout')">Sign Out</button></div></div></div>`
};

const GeraldView = {
    props: ['currentTab', 'geraldMessages', 'isGeraldTyping', 'geraldInput', 'showEmotePicker', 'showMinigames', 'customEmotes', 'parseMarkdown'],
    template: `<div class="gerald-container" v-show="currentTab === 'gerald'"><div style="overflow-y: auto; flex: 1; padding: 16px; display: flex; flex-direction: column;" id="gerald-msgs" @click="$emit('close-pickers')"><template v-for="(m, i) in geraldMessages" :key="i"><div class="chat-bubble" :class="m.role" v-html="parseMarkdown(m.content)"></div></template><div v-if="isGeraldTyping" class="chat-bubble gerald">...</div></div><div v-show="showEmotePicker" class="tray-container"><img v-for="(emote, name) in customEmotes" :key="name" :src="'https://cdn.discordapp.com/emojis/' + emote.id + '.' + (emote.animated ? 'gif' : 'png') + '?size=44'" style="width:32px;height:32px;cursor:pointer;" @click="$emit('insert-emote', name)"></div><div v-show="showMinigames" class="tray-container"><button class="bribe-btn" @click="$emit('play-game', 'shader')">Compile UE5</button><button class="bribe-btn" @click="$emit('play-game', 'boba')">Boba Spill</button><button class="bribe-btn" @click="$emit('play-game', 'pineapple')">Pineapple</button><button class="bribe-btn" @click="$emit('play-game', 'yusha')">Yusha Logic</button></div><div class="gerald-input-area"><button class="emote-toggle-btn" @click="$emit('toggle-emotes')"><span class="material-symbols-rounded">mood</span></button><button class="emote-toggle-btn" @click="$emit('toggle-minigames')"><span class="material-symbols-rounded">sports_esports</span></button><input type="text" class="gerald-input" placeholder="Message Gerald..." :value="geraldInput" @input="$emit('update-input', $event.target.value)" @keydown.enter="$emit('send')" id="gerald-txt-input" @focus="$emit('close-pickers')"><button class="gerald-send" @click="$emit('send')"><span class="material-symbols-rounded">send</span></button></div></div>`
};

const FeedView = {
    props: ['currentTab', 'isRefreshing', 'ytFeed', 'ytCurrentIndex', 'redditFeed', 'redditCurrentIndex', 'formatNumber'],
    data() { return { feedSegment: 'youtube' } },
    template: `
    <div class="view-port" v-show="currentTab === 'feed'">
        <div class="page-scroll-container">
            <div class="segment-tabs-container">
                <button class="segment-tab-btn" :class="{ active: feedSegment === 'youtube' }" @click="feedSegment = 'youtube'">YouTube</button>
                <button class="segment-tab-btn" :class="{ active: feedSegment === 'reddit' }" @click="feedSegment = 'reddit'">Reddit</button>
            </div>
            
            <div v-if="feedSegment === 'youtube'">
                <div v-if="ytFeed && ytFeed.length > 0">
                    <div class="list-card" v-for="(item, index) in ytFeed" :key="item.id" @click="$emit('play-yt', index)">
                        <div class="list-thumb">
                            <img :src="'https://img.youtube.com/vi/' + item.id + '/mqdefault.jpg'" alt="YouTube Thumbnail">
                        </div>
                        <div class="list-details">
                            <h4>{{ item.title }}</h4>
                            <p class="list-sub">CodeMiko Shorts</p>
                            <p class="list-sub">{{ item.date }}</p>
                        </div>
                    </div>
                </div>
                <div v-else style="text-align:center; padding: 40px; color: var(--text-muted);">Loading YouTube...</div>
            </div>
            
            <div v-if="feedSegment === 'reddit'">
                <div v-if="redditFeed && redditFeed.length > 0">
                    <a :href="'https://reddit.com' + item.permalink" target="_blank" class="reddit-card" v-for="item in redditFeed" :key="item.id">
                        <p style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">u/{{ item.author }} • {{ item.date }}</p>
                        <h4 style="font-size:15px; margin-bottom:8px; line-height:1.4;">{{ item.title }}</h4>
                        <span v-if="item.link_flair_text" class="reddit-flair-badge">{{ item.link_flair_text }}</span>
                        <img v-if="item.thumbnail && item.thumbnail.startsWith('http')" :src="item.thumbnail" onerror="this.style.display='none'">
                        <div style="display:flex; gap:16px; margin-top:12px; color:var(--text-muted); font-size:13px; font-weight:600;">
                            <div style="display:flex; align-items:center; gap:4px;"><span class="material-symbols-rounded" style="font-size:16px;">arrow_upward</span>{{ formatNumber(item.ups) }}</div>
                            <div style="display:flex; align-items:center; gap:4px;"><span class="material-symbols-rounded" style="font-size:16px;">chat_bubble</span>{{ formatNumber(item.num_comments) }}</div>
                        </div>
                    </a>
                </div>
                <div v-else style="text-align:center; padding: 40px; color: var(--text-muted);">Loading Reddit...</div>
            </div>
        </div>
    </div>`
};

const HomeView = {
    props: ['currentTab', 'isRefreshing', 'currentVodIndex', 'recentVods', 'isLive', 'hostname', 'clips', 'activeFilterLabel', 'optimizeTwitchImg', 'formatViews', 'formatDate'],
    template: `
    <div class="view-port" v-show="currentTab === 'home'" @scroll="$emit('scroll', $event)">
        <div class="page-scroll-container">
            <div class="hero-section">
                <div class="video-player-16-9">
                    <iframe v-if="currentVodIndex === -1" :src="'https://player.twitch.tv/?channel=codemiko&parent=' + hostname + '&autoplay=true&muted=true'" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>
                    <iframe v-else-if="recentVods && recentVods[currentVodIndex]" :src="'https://player.twitch.tv/?video=' + recentVods[currentVodIndex].id + '&parent=' + hostname + '&autoplay=true&muted=true'" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>
                </div>
                <div class="hero-meta">
                    <h2>CodeMiko is {{ isLive ? 'LIVE!' : 'Offline' }}</h2>
                    <p>Just Chatting • {{ isLive ? 'Live Now' : 'Recent Broadcast' }}</p>
                </div>
            </div>
            
            <div class="section-heading">
                <h3>Latest Clips</h3>
                <button class="view-all-btn" @click="$emit('open-filter')">{{ activeFilterLabel }} <span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle;">expand_more</span></button>
            </div>
            
            <div class="clips-list">
                <div class="list-card" v-for="clip in clips" :key="clip.id" @click="$emit('share-clip', clip)">
                    <div class="list-thumb">
                        <img :src="clip.thumbnail_url ? optimizeTwitchImg(clip.thumbnail_url) : ''" loading="lazy" alt="Clip Thumbnail">
                        <div class="thumb-badge">Clip</div>
                    </div>
                    <div class="list-details">
                        <h4>{{ clip.title }}</h4>
                        <p class="list-sub">Just Chatting • {{ formatDate(clip.created_at) }}</p>
                        <p class="list-sub" style="color:var(--text-main);">{{ formatViews(clip.view_count) }} views</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`
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
        
        const playYt = (index) => { ytCurrentIndex.value = index; showToast("Playing video..."); };

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
            clips.value = sortData(filterKey);
        };

        const handlePullStart = (e) => {
            if (currentTab.value === 'home') {
                touchStartY = e.touches[0].clientY; isPulling.value = true;
            }
        };
        const handlePullMove = (e) => {
            if (!isPulling.value) return;
            pullDistance = e.touches[0].clientY - touchStartY;
            if (pullDistance > 0) {
                refreshTransform.value = `translateY(${Math.min(pullDistance - 60, 20)}px)`;
            }
        };
        const handlePullEnd = () => {
            if (isPulling.value && pullDistance > 80) {
                runNeonAnimation(); loadData(); fetchSocialFeeds();
            }
            isPulling.value = false; pullDistance = 0; refreshTransform.value = 'translateY(-100%)';
        };

        watch(currentTab, (newTab) => { 
            if (window.location.hash !== `#${newTab}`) { window.history.pushState(null, '', `#${newTab}`); }
            if (newTab === 'gerald') { 
                document.getElementById('app-container').classList.add('gerald-skin-active');
                setTimeout(scrollToBottom, 50); 
            } else {
                document.getElementById('app-container').classList.remove('gerald-skin-active');
            }
        });
        window.addEventListener('popstate', () => { const hash = window.location.hash.replace('#', ''); if (validTabs.includes(hash)) { currentTab.value = hash; } else { currentTab.value = 'home'; }});
        
        const isHeaderVisible = ref(true); let lastScrollY = 0;
        const handleScroll = (e) => { const currentScrollY = e.target.scrollTop; if (currentScrollY <= 0) { isHeaderVisible.value = true; return; } if (Math.abs(currentScrollY - lastScrollY) < 10) return; isHeaderVisible.value = currentScrollY < lastScrollY; lastScrollY = currentScrollY; };

        let modalStartY = 0, currentDeltaY = 0;
        const handleModalTouchStart = (e) => { if (e.currentTarget.scrollTop <= 0) { modalStartY = e.touches[0].clientY; currentDeltaY = 0; } };
        const handleModalTouchMove = (e) => { if (!modalStartY) return; currentDeltaY = e.touches[0].clientY - modalStartY; if (currentDeltaY > 0) { e.currentTarget.style.transform = `translateY(${currentDeltaY}px)`; e.currentTarget.style.transition = 'none'; } };
        const handleModalTouchEnd = (e) => { if (!modalStartY) return; e.currentTarget.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'; if (currentDeltaY > 100) { modals.value.profile = false; modals.value.discord = false; } e.currentTarget.style.transform = ''; modalStartY = 0; };

        const logoSvg = (id) => `<svg viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="8"/><path d="M 33 38 L 48 62 L 62 38 L 62 55 Q 62 65 69 64" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        const showToast = (msg, duration = 4000) => { toast.value.message = msg; toast.value.visible = true; setTimeout(() => toast.value.visible = false, duration); };
        
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
        const handleGeraldEnter = (e) => { if (!e.shiftKey) { e.preventDefault(); talkToGerald(); } };

        const toggleEmotes = () => { showEmotePicker.value = !showEmotePicker.value; showMinigames.value = false; };
        const toggleMinigames = () => { showMinigames.value = !showMinigames.value; showEmotePicker.value = false; };
        const closePickers = () => { showEmotePicker.value = false; showMinigames.value = false; };

        const playMinigame = (type) => {
            const games = {
                shader: { msg: "Compile UE5", text: "Compiling 14,582 shaders. Framerate reduced to 1 FPS." },
                boba: { msg: "Boba Spill", text: "Fluid detected on motherboard. Emergency flush initiated." },
                pineapple: { msg: "Pineapple", text: "Chris has arrived. Reminder: He is NOT her boyfriend." },
                yusha: { msg: "Yusha Logic", text: "Nyan~ Yusha is in da mainframe! *vomits in binary*" }
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
            const geminiHistory = recentContextWindow.map(m => ({ role: m.role === 'gerald' ? 'model' : 'user', parts: [{ text: m.content }] }));
            
            try {
                const { data, error } = await sbClient.functions.invoke('gerald-chat', { body: { history: geminiHistory } });
                if (error) throw error;
                if (data && data.reply) {
                    geraldMessages.value.push({ role: 'gerald', content: data.reply });
                    if (currentUser.value) { sbClient.from('gerald_history').insert({ role: 'gerald', content: data.reply, user_id: currentUser.value.id }).then(); }
                } else if (data && data.error) { throw new Error(data.error); }
            } catch (e) { geraldMessages.value.push({ role: 'gerald', content: 'SYSTEM ERROR' }); 
            } finally { isGeraldTyping.value = false; scrollToBottom(); }
        };

        const loadData = async () => {
            const { data: dbEmotes } = await sbClient.from('emotes').select('*');
            if (dbEmotes) { dbEmotes.forEach(e => { customEmotes.value[e.name] = { id: e.id, animated: e.animated }; }); }
            const { data: c } = await sbClient.from('clips').select('*').order('created_at', { ascending: false }).limit(50);
            allClips.value = c || []; clips.value = sortData(currentFilter.value);
        };

        const fetchSocialFeeds = () => {
            fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.reddit.com/r/CodeMiko/new.json?limit=15'))
                .then(res => res.json())
                .then(data => {
                    if (data && data.contents) {
                        const parsed = JSON.parse(data.contents);
                        if (parsed && parsed.data && parsed.data.children) {
                            redditFeed.value = parsed.data.children.filter(child => !child.data.stickied).map(child => {
                                let d = child.data;
                                return {
                                    id: d.id, author: d.author, title: d.title, url: d.url, thumbnail: d.thumbnail,
                                    ups: d.ups, num_comments: d.num_comments, permalink: d.permalink, link_flair_text: d.link_flair_text,
                                    date: new Date(d.created_utc * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' })
                                };
                            });
                        }
                    }
                }).catch(() => {});

            fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=UCwX993DUCwXo9E3dKipGAmYg'))
                .then(res => res.json())
                .then(data => {
                    if (data && data.items) {
                        ytFeed.value = data.items.map(item => {
                            let vidId = item.link.split('v=')[1] || item.guid.split(':').pop();
                            return { id: vidId, title: item.title, date: new Date(item.pubDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) };
                        });
                    }
                }).catch(() => {});
        };

        const checkLive = async () => {
            try {
                const res = await fetch('https://decapi.me/twitch/uptime/codemiko');
                isLive.value = !(await res.text()).includes('offline');
                const vText = await (await fetch('https://decapi.me/twitch/videos/codemiko?limit=5')).text();
                const matches = vText.match(/\d{10,}/g); 
                if (matches) { recentVods.value = matches.map(id => ({ id: id, date: "PAST BROADCAST" })); if (!isLive.value) latestVodId.value = matches[0]; }
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
                const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); 
                const cR = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${uD.data[0].id}&started_at=${startDate}&ended_at=${endDate}&first=50`, { headers: {'Client-Id': apiConfig.value.cid, 'Authorization': `Bearer ${apiConfig.value.tkn}`} });
                const cD = await cR.json();
                if (cD.data?.length > 0) {
                    const ins = cD.data.map(x => ({ id: x.id, thumbnail_url: x.thumbnail_url, title: x.title, view_count: x.view_count, created_at: x.created_at, added_by: 'CodeMiko' }));
                    await sbClient.from('clips').upsert(ins, { onConflict: 'id' });
                }
                await loadData(); syncState.value = 'sync-success'; setTimeout(() => syncState.value = 'idle', 2000);
            } catch (e) { syncState.value = 'idle'; }
        };

        const handleLogin = async () => {
            const email = loginEmail.value.includes('@') ? loginEmail.value : `${loginEmail.value}@miko.com`;
            const { data, error } = await sbClient.auth.signInWithPassword({ email, password: loginPass.value });
            if (data.user) { currentUser.value = data.user; modals.value.profile = false; loadGeraldHistory(); }
        };

        const handleLogout = () => {
            logoutState.value = 'logging_out';
            setTimeout(() => { sbClient.auth.signOut(); currentUser.value = null; geraldMessages.value = [{role:'gerald', content: getGreeting()}]; modals.value.profile = false; logoutState.value = 'idle'; }, 1000);
        };

        onMounted(async () => {
            const { data: { session } } = await sbClient.auth.getSession();
            if (session?.user) { currentUser.value = session.user; loadGeraldHistory(); }
            loadData(); checkLive(); fetchSocialFeeds(); 
            setTimeout(() => { splashOpacity.value = 0; setTimeout(() => splashVisible.value = false, 400); }, 1500);
        });

        return { 
            hostname, splashVisible, splashOpacity, currentTab, clips, modals, isLive, toast, currentUser, loginEmail, loginPass, apiConfig, latestVodId, activeFeedVideo, geraldInput, geraldMessages, isGeraldTyping, talkToGerald, logoSvg, syncState, wipeState, logoutState, runSync, isHeaderVisible, handleScroll, handleModalTouchStart, handleModalTouchMove, handleModalTouchEnd, currentFilter, activeFilterLabel, isFilterMenuOpen, applyFilter, parseMarkdown, shareClip, recentVods, currentVodIndex, getVodLabel, nextVod, prevVod, customEmotes, showEmotePicker, showMinigames, insertEmote, clearGeraldHistory, isPulling, refreshTransform, isRefreshing, handlePullStart, handlePullMove, handlePullEnd, handleGeraldEnter, toggleEmotes, toggleMinigames, closePickers, ytFeed, ytCurrentIndex, nextYt, prevYt, redditFeed, redditCurrentIndex, nextReddit, prevReddit, formatNumber, handleLogin, handleLogout, playMinigame, playYt,
            optimizeTwitchImg: (u) => u ? u.replace('%{width}', '480').replace('%{height}', '270') : '', 
            formatViews: (v) => v ? v.toLocaleString() : '0', 
            formatDate: (d) => new Date(d).toLocaleDateString([], {month:'short', day:'numeric'})
        };
    }
}).mount('#app-container');
