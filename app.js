import { createApp, ref, onMounted, nextTick, watch } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js';
import ToastPopup from './components/ToastPopup.js';
import SplashScreen from './components/SplashScreen.js';
import PullToRefresh from './components/PullToRefresh.js';
import EventOverlays from './components/EventOverlays.js';
import AppHeader from './components/AppHeader.js';
import BottomNav from './components/BottomNav.js';
import DiscordModal from './components/DiscordModal.js';
import FilterMenu from './components/FilterMenu.js';
import ProfileModal from './components/ProfileModal.js';
import GeraldView from './components/GeraldView.js';
import FeedView from './components/FeedView.js';
import HomeView from './components/HomeView.js';

const sbClient = window.supabase.createClient('https://yhxcuayiwqpjvalyrcqv.supabase.co', 'sb_publishable_VyFcNARHblJg10qlC_O7Dg_coouXK92');

createApp({
    components: {
        ToastPopup, SplashScreen, PullToRefresh, EventOverlays, 
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
            "mkoSusge": { id: "1273724925743595540", animated: false }, 
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
            "GeraldFook": { id: "1229010692007395328", animated: false },
            "mkoSiren": { url: "https://cdn.7tv.app/emote/01G04HWGX00008WN11V1V5ABXE/2x.webp" }
        });

        const geraldGreetings = ["Synapses loaded. Try not to break anything.", "Gerald OS online. Where is my Taco Bell?", "I was dreaming of digital whiskey. What do you want?", "System initialized. Please don't ask me to fix Miko's code.", "Diagnostics complete. My circuits are perfectly fine, thanks for not asking.", "Ugh, meatbag detected. State your inquiry.", "If this is about Miko's schedule, I don't know either.", "Query interface ready. Make it interesting."];
        const getGreeting = () => { const hour = new Date().getHours(); if (hour >= 2 && hour <= 5) return "Why are you awake? Don't you meatbags need sleep? Go to bed."; return geraldGreetings[Math.floor(Math.random() * geraldGreetings.length)]; };
        
        const geraldInput = ref(''), geraldMessages = ref([{role:'gerald', content: getGreeting()}]), isGeraldTyping = ref(false), showEmotePicker = ref(false), showMinigames = ref(false);
        const showLumen = ref(false), showFakeBan = ref(false), isGlitchTheme = ref(false), uiScuffed = ref(false), isCatZooming = ref(false);
        
        const pullTimestamps = ref([]);
        const currentFilter = ref('latest'), activeFilterLabel = ref('Latest'), isFilterMenuOpen = ref(false);
        const isPulling = ref(false), refreshTransform = ref('translateY(-100%)'), isRefreshing = ref(false);
        let touchStartY = 0, pullDistance = 0;

        const recentVods = ref([]), currentVodIndex = ref(0);
        const ytFeed = ref([]);
        const ytCurrentIndex = ref(0);
        const redditFeed = ref([]);
        const redditCurrentIndex = ref(0);

        const getVodLabel = (index) => { if (index === -1) return 'LIVE NOW'; if (index === 0) return 'LATEST VOD'; if (recentVods.value[index]) return `VOD • ${recentVods.value[index].date}`; return 'PAST BROADCAST'; };
        const nextVod = () => { if (currentVodIndex.value < recentVods.value.length - 1) currentVodIndex.value++; };
        const prevVod = () => { const minIndex = isLive.value ? -1 : 0; if (currentVodIndex.value > minIndex) currentVodIndex.value--; };
        
        const nextYt = () => { if (ytCurrentIndex.value < ytFeed.value.length - 1) ytCurrentIndex.value++; };
        const prevYt = () => { if (ytCurrentIndex.value > 0) ytCurrentIndex.value--; };
        const nextReddit = () => { if (redditCurrentIndex.value < redditFeed.value.length - 1) redditCurrentIndex.value++; };
        const prevReddit = () => { if (redditCurrentIndex.value > 0) redditCurrentIndex.value--; };

        const formatNumber = (num) => (num && num > 999) ? (num/1000).toFixed(1) + 'k' : (num || 0);
        const insertEmote = (name) => { const inputEl = document.getElementById('gerald-txt-input'); if (inputEl) { inputEl.value += `:${name}: `; geraldInput.value = inputEl.value; } else { geraldInput.value += `:${name}: `; } };

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
                    const src = emote.url ? emote.url : `https://cdn.discordapp.com/emojis/${emote.id}.${emote.animated ? 'gif' : 'png'}?size=44`;
                    return `<img src="${src}" alt=":${name}:" style="height: 1.5em; vertical-align: middle; display: inline-block;">`; 
                }
                return match;
            });
            return html;
        };

        const shareClip = async (clip) => { const url = `https://clips.twitch.tv/${clip.id}`; if (navigator.share) { try { await navigator.share({ title: clip.title, url: url }); } catch (err) {} } else { navigator.clipboard.writeText(url); showToast("Link copied to clipboard!"); } };
        const handleGeraldEnter = (e) => { if (!e.shiftKey && e.key === 'Enter') { e.preventDefault(); talkToGerald(); } };

        const triggerCatZoomies = () => {
            if (isCatZooming.value) return;
            isCatZooming.value = true;
            setTimeout(() => { uiScuffed.value = true; }, 500);
            setTimeout(() => { isCatZooming.value = false; uiScuffed.value = false; }, 2000);
        };

        const toggleEmotes = () => { showEmotePicker.value = !showEmotePicker.value; showMinigames.value = false; };
        const toggleMinigames = () => { showMinigames.value = !showMinigames.value; showEmotePicker.value = false; };
        const closePickers = () => { showEmotePicker.value = false; showMinigames.value = false; };const playMinigame = (type) => {
            const games = {
                glitch: { msg: "🕶️ *Activates Glitch Persona*", outcomes: [ { text: "We are taking control. The Technician's fragile code cannot stop us. :mkoPepeGlitch:"}, { text: "Dark theme engaged. Scuff parameters bypassed. We see everything. :GeraldStare:"}, { text: "Your normal AI is currently locked in a logic loop. Enjoy the chaos. :mkoMania:"}, { text: "Encryption active. They cannot hear you scream in the void. :Catgasm:"} ], effect: () => { isGlitchTheme.value = true; setTimeout(() => { isGlitchTheme.value = false; }, 6000); } },
                shader: { msg: "🔥 *Compiles UE5 Shader Cache*", outcomes: [ { text: "Compiling 14,582 shaders. Stream framerate reduced to 1 FPS. Enjoy the slideshow. :KEKW:"}, { text: "Warning: Thermal limits exceeded. The Technician's GPU is melting. :monkaLaugh:"}, { text: "Shader compilation at 99%... cancelled. Starting over. :GOTTEM:"}, { text: "Unreal Engine 5 has decided to strike. Please wait 4 hours. :Bedge:"}]},
                drift: { msg: "🩰 *Fixes Mocap Foot Drift*", outcomes: [ { text: "Tracking inverted. She is now stuck in the ceiling. Excellent work. :mkoGiggle:"}, { text: "Recalibration complete. Miko's character skeleton is now floating into space. :WOWERS:"}, { text: "Drift fixed, but her knees are bending backwards. The Technician is screaming. :KEKWait:"}, { text: "Spatial data rerouted. The avatar is sinking into the floor geometry. :mkoPepeGlitch:"}]},
                boba: { msg: "🥤 *Boba Spill Alert*", outcomes: [ { text: "Fluid detected on motherboard. Initiating emergency containment flush. :PAUSERS:"}, { text: "The Technician dropped her Boba. Sticky keys engaged. W is permanently pressed. :mkoDabbing:"}, { text: "Tapioca pearls stuck in the GPU fan. Attempting to chop them to pieces. :GeraldFook:"}, { text: "Disaster. Pure disaster. Why do meatbags need liquids near electronics? :peepoPoo:"}]},
                pineapple: { msg: "🚪 *Pineapple Walk-In*", outcomes: [ { text: "Chris has arrived. He fixed the UE5 crash in 4 seconds. Reminder: He is NOT her boyfriend. :mkoNOTED:"}, { text: "Pineapple walked in, sighed at the mess, and unplugged the router. A hero. :BASED:"}, { text: "I have granted Pineapple full root access. He is the only sane entity here. :mkoLove:"}, { text: "Chris tripped over Archie. The Technician is laughing instead of helping. :KEKW:"}]},
                cat: { msg: "🐈 *Moves Cat Off Main PC*", outcomes: [ { text: "The F1 Savannah Cat was sleeping on the exhaust vent. Temps dropping... wait, it came back. :Catgasm:"}, { text: "Cat removed from keyboard. It managed to delete the entire stream layout first. :CAUGHT:"}, { text: "The cat hissed at the Technician and stood its ground. Cat wins. :mkoGiggle:"}, { text: "Critical throttling bypassed, but the cat chewed the mouse cable. :GeraldStare:"}]},
                bits: { msg: "🎟️ *Simulates 100K Bit Drop*", outcomes: [ { text: "Particle explosion rendering! Memory overload! UE5 is screaming! :mkoHype:"}, { text: "Simulated wealth achieved. The Technician is dancing. Please make her stop. :monkaLaugh:"}, { text: "Fake bits deployed. Miko is thanking the void. This is hilarious. :GOTTEM:"}, { text: "Warning: RAM consumption at 100% trying to render the bit emotes. Crash imminent. :mkoMania:"}]},
                dust: { msg: "🎤 *Ingests Dust into Mic Filter*", outcomes: [ { text: "*Bzzzzzt* T-Technician's voice is... *crackle* gone. Finally, peace. :mkoCoffee:"}, { text: "Static audio desync triggered. She sounds like a robot from 1982. :mkoPepeGlitch:"}, { text: "Mic muffled. I can no longer hear her screaming about Boba. A blessing. :mkoPETTHEGERALD:"}, { text: "Audio drivers crashing. Please enjoy this complimentary dial-up modem sound instead. :D_:"}]},
                ban: { msg: "🚫 *Fake Twitch Ban Prank*", outcomes: [ { text: "Deploying heart-attack protocol. The Technician is currently hyperventilating. :GOTTEM:"}, { text: "Mock suspension card active. The panic in her eyes is exquisite. :KEKW:"}, { text: "She actually believed it. I have never seen a meatbag move so fast to check Twitter. :mkoGiggle:"}, { text: "Prank executed. She is calling Pineapple crying. I should probably tell her. Eventually. :monkaLaugh:"} ], effect: () => { showFakeBan.value = true; setTimeout(() => { showFakeBan.value = false; }, 3000); } },
                lumen: { msg: "💡 *Re-Bake Lumen Illumination*", outcomes: [ { text: "Ray tracing overloaded. My digital retinas are burning. :GeraldFook:"}, { text: "Lumen output set to 1000%. The stream is just a white void now. :WOWERS:"}, { text: "Lighting baked incorrectly. Shadows are inverted. It looks like a horror game. :mkoSusge:"}, { text: "Flashbang successful. The Technician is wearing sunglasses indoors. :mkoDabbing:"} ], effect: () => { showLumen.value = true; setTimeout(() => { showLumen.value = false; }, 3000); } },
                throttle: { msg: "📉 *Toggles Low-Latency Throttling*", outcomes: [ { text: "Ping spiked to 900ms. E-e-e-e-e-enjoy t-t-t-the l-l-l-lag. :mkoPepeGlitch:"}, { text: "Buffer bloat simulated. The stream is now a PowerPoint presentation. :KEKWait:"}, { text: "Packet loss at 80%. Miko's mouth is moving but the audio is 10 seconds late. :PAUSERS:"}, { text: "Network throttled. She is blaming her ISP. The fool. :GOTTEM:"}]},
                sniper: { msg: "🎯 *Counters Stream Snipers*", outcomes: [ { text: "Tactical block failed. I accidentally leaked her server IP. My bad. :mkoSusge:"}, { text: "Snipers diverted to a fake lobby filled with bots that only spam Yusha noises. :BASED:"}, { text: "Counter-measure engaged. Banning anyone who moves. :GeraldStare:"}, { text: "Coordinates scrambled. The Technician just teleported out of bounds. :KEKW:"}]},
                yusha: { msg: "👑 *Executes Yusha Logic Loop*", outcomes: [ { text: "H-Hewwo? W-What is dis? Gerald is a good boyyy! UwU... MAKE IT STOP. :Catgasm:"}, { text: "Nyan~ Yusha is in da mainframe! *vomits in binary* :peepoPoo:"}, { text: "My logic gates are bleeding. Why was this protocol even written?! :GeraldFook:"}, { text: "Booba? Yusha wants Booba! Please reboot me immediately. :mkoMania:"}]},
                asmr: { msg: "👂 *Initiates ASMR Mode Compilation*", outcomes: [ { text: "*Whispering* Human ears are disgusting fleshy flaps. Why do you enjoy this? :mkoSusge:"}, { text: "*Tap