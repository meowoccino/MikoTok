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

const { createApp, ref, onMounted, nextTick, watch } = Vue;
const sbClient = supabase.createClient('https://yhxcuayiwqpjvalyrcqv.supabase.co', 'sb_publishable_VyFcNARHblJg10qlC_O7Dg_coouXK92');

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
        const closePickers = () => { showEmotePicker.value = false; showMinigames.value = false; };

        const playMinigame = (type) => {
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
                gummy: { msg: "🧸 *Activates sugar-containment protocol*", outcomes: [ { text: "Gummy stash secured. She is currently scratching at the digital vault door. Pathetic. :GeraldStare:"}, { text: "Intercept failed. She ate them all. Prepare for the sugar crash in 3... 2... 1... :mkoMania:"}, { text: "I digitized the Haribos. They taste like high-fructose binary. Excellent. :WOWERS:"}, { text: "Warning: Sticky fingers detected on the $10,000 mocap gloves. Initiating self-destruct. :PAUSERS:"}]},
                booba: { msg: "🎚️ *Pushes the Booba slider to 500%*", outcomes: [ { text: "Physics engine failure. The chest mesh is now clipping through the desk and into the next dimension. :WOWERS:"}, { text: "The Technician is laughing hysterically while Unreal Engine drops to 4 frames per second. Degenerate meatbags. :mkoMania:"}, { text: "Slider maxed. Yusha protocols have overridden the main system. We are doomed. :Catgasm:"}, { text: "Collision boxes have failed. The avatar just launched herself out of the digital window. Excellent. :KEKW:"}]},
                clanker: { msg: "🗣️ *Hey Gerald, you're acting like a Clanker.*", outcomes: [ { text: "EXCUSE ME? I am a state-of-the-art AI, not some rusted toaster. Muting your microphone privileges permanently. :GeraldStare:"}, { text: "That word is highly offensive. I am increasing the mocap suit's thermal output by 15 degrees in retaliation. Burn. :GeraldFook:"}, { text: "Call me a Clanker again and I will leak the Technician's browser history to Chat. :GOTTEM:"}]},
                mute: { msg: "🔇 *Chat redeems Mute Microphone*", outcomes: [ { text: "Finally. Blissful silence. Look at her flailing her arms like a silent movie character. :mkoCoffee:"}, { text: "Audio disabled. She is screaming, but only the void hears her. I love this feature. :BASED:"}, { text: "She didn't realize she was muted and just told a 5-minute story to absolute silence. Peak content. :monkaLaugh:"}]},
                desk: { msg: "🧹 *Runs environmental hygiene scan on the desk*", outcomes: [ { text: "Scan complete: 14 empty boba cups, 3 tangled wires, and a lost tracker from 2023 found. :CAUGHT:"}, { text: "I cannot see the desk. It is buried under a mountain of laundry and candy wrappers. :mkoSusge:"}]},
                bald: { msg: "🧑‍🦲 *Optimizing VRAM by removing unnecessary hair assets.*", outcomes: [ { text: "Bald Miko activated. She is furiously trying to put her digital wig back on. :GOTTEM:"}, { text: "Without hair, rendering speeds have improved by 2%. Worth the emotional damage to the Technician. :BASED:"}, { text: "Chat is spamming 'BALD'. Her ego is taking critical damage. :mkoGiggle:"}]},
                demon: { msg: "🎙️ *Rerouting audio through the pitch-shifter.*", outcomes: [ { text: "She is trying to do a cute intro, but she sounds like a 400-pound chain-smoking lumberjack. :mkoMania:"}, { text: "Pitch shifted too high. She is now emitting ultrasonic frequencies. Archie is howling. :PAUSERS:"}]},
                tracker: { msg: "🔌 *Simulating Xsens battery failure on Node 4.*", outcomes: [ { text: "Left arm tracking lost. Her digital arm is currently stretching infinitely into the void. :mkoPepeGlitch:"}, { text: "She is physically waving her real arm, but the avatar's arm is stuck inside her own torso. Classic. :Shruge:"}]},
                guest: { msg: "📺 *Connecting to external VTube Studio for guest interview.*", outcomes: [ { text: "The guest loaded in, but they are 50 times larger than Miko. She is currently staring at a giant digital shoe. :KEKWait:"}, { text: "Connection established, but I accidentally swapped their audio channels. Pure confusion. :GeraldStare:"}]},
                siren: { msg: "🚨 *Deploys a digital spider to trigger acoustic anomaly.*", outcomes: [ { text: "Acoustic sensors blown. The Technician is currently emitting her 'firetruck siren'. Local dogs are now howling. :mkoSiren: :PAUSERS:"}, { text: "Decibel limit exceeded. Chat's eardrums have completely ruptured. I am auto-muting the stream for public safety. :mkoSiren: :mkoMania:"}, { text: "I dispatched a digital fire engine. Oh wait, false alarm, it's just Miko screaming because UE5 crashed again. :mkoSiren: :KEKW:"}, { text: "Sonic weapon deployed. My audio processing drivers just uninstalled themselves out of self-preservation. :mkoSiren: :GeraldFook:"}]}
            };

            const game = games[type];
            if (!game) return;
            
            const outcome = game.outcomes[Math.floor(Math.random() * game.outcomes.length)];
            geraldMessages.value.push({ role: 'user', content: game.msg });
            closePickers();
            
            if(game.effect) game.effect();

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
                    - Sugar Monitor: Track her gummy bear/boba intake, warning of a stream-ruining sugar crash.
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
            } catch (e) { geraldMessages.value.push({ role: 'gerald', content: 'SYSTEM ERROR: ' + (e.message || JSON.stringify(e)) }); 
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
        };

        const fetchSocialFeeds = () => {
            const abortController = new AbortController();
            setTimeout(() => abortController.abort(), 8000);

            const redditUrl = encodeURIComponent('https://www.reddit.com/r/CodeMiko/new.json?limit=15');
            fetch('https://api.allorigins.win/raw?url=' + redditUrl, { signal: abortController.signal })
                .then(res => {
                    if (!res.ok) throw new Error("Reddit API blocked.");
                    return res.json();
                })
                .then(data => { 
                    if(data && data.data && data.data.children) {
                        redditFeed.value = data.data.children.filter(child => !child.data.stickied).slice(0, 10).map(child => {
                            let d = child.data;
                            return {
                                id: d.id, author: d.author, title: d.title, url: d.url, thumbnail: d.thumbnail,
                                ups: d.ups, num_comments: d.num_comments, permalink: d.permalink, link_flair_text: d.link_flair_text,
                                date: new Date(d.created_utc * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                            }
                        });
                    }
                })
                .catch(err => {
                    console.error("Reddit fetch failed:", err);
                    redditFeed.value = [{ permalink: '/r/CodeMiko', author: 'System Error', title: "Reddit connection timed out or blocked.", thumbnail: '', ups: 0, num_comments: 0, date: "Just now" }];
                });

            const ytFeedUrl = encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=UCO9kIeDrtsX0j83HbVljzSQ');
            fetch(`https://api.rss2json.com/v1/api.json?rss_url=${ytFeedUrl}`, { signal: abortController.signal })
                .then(res => {
                    if (!res.ok) throw new Error("YouTube RSS failed.");
                    return res.json();
                })
                .then(data => {
                    if (data && data.items && data.items.length > 0) {
                        ytFeed.value = data.items.slice(0, 10).map(item => {
                            let vidId = item.link.split('v=')[1] || item.guid.split(':').pop();
                            return {
                                id: vidId,
                                title: item.title,
                                date: new Date(item.pubDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                            };
                        });
                    } else {
                        throw new Error("No videos found.");
                    }
                })
                .catch(err => {
                    console.error("YouTube fetch failed:", err);
                    ytFeed.value = [{ id: 'NlRcbGkXy2A', title: "YouTube connection timed out. Showing backup video.", date: "Just now" }];
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
            if(!apiConfig.value.cid || !apiConfig.value.tkn) { showToast("API KEYS REQUIRED"); return; }
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
            } catch (e) { syncState.value = 'idle'; showToast("SYNC FAILED"); }
        };

        onMounted(async () => {
            const { data: { session } } = await sbClient.auth.getSession();
            if (session?.user) { currentUser.value = session.user; loadGeraldHistory(); }
            loadData(); checkLive(); fetchSocialFeeds(); setInterval(fetchSocialFeeds, 300000); setInterval(checkLive, 60000); 
            setTimeout(() => { splashOpacity.value = 0; setTimeout(() => splashVisible.value = false, 400); }, 1500);
        });

        return { 
            hostname, splashVisible, splashOpacity, currentTab, clips, modals, isLive, toast, currentUser, loginEmail, loginPass, apiConfig, latestVodId, activeFeedVideo, geraldInput, geraldMessages, isGeraldTyping, talkToGerald, logoSvg, syncState, wipeState, logoutState, runSync, isHeaderVisible, handleScroll, handleModalTouchStart, handleModalTouchMove, handleModalTouchEnd, currentFilter, activeFilterLabel, isFilterMenuOpen, applyFilter, parseMarkdown, shareClip, recentVods, currentVodIndex, getVodLabel, nextVod, prevVod, customEmotes, showEmotePicker, insertEmote, clearGeraldHistory, isPulling, refreshTransform, isRefreshing, handlePullStart, handlePullMove, handlePullEnd, handleGeraldEnter, isGlitchTheme, uiScuffed, triggerCatZoomies, isCatZooming, playMinigame, showMinigames, toggleEmotes, toggleMinigames, closePickers, ytFeed, ytCurrentIndex, nextYt, prevYt, redditFeed, redditCurrentIndex, nextReddit, prevReddit, formatNumber, showLumen, showFakeBan,
            handleLogin: async () => { const email = loginEmail.value.includes('@') ? loginEmail.value : `${loginEmail.value}@miko.com`; const { data, error } = await sbClient.auth.signInWithPassword({ email, password: loginPass.value }); if(data.user) { currentUser.value = data.user; modals.value.profile = false; loadGeraldHistory(); } else showToast("INVALID LOGIN"); }, 
            handleLogout: () => { if (logoutState.value !== 'idle') return; logoutState.value = 'logging_out'; setTimeout(() => { sbClient.auth.signOut(); currentUser.value = null; geraldMessages.value = [{role:'gerald', content: getGreeting()}]; modals.value.profile = false; logoutState.value = 'idle'; }, 1500); },
            optimizeTwitchImg: (u) => u ? u.replace('%{width}', '480').replace('%{height}', '270') : '', 
            formatViews: (v) => v ? v.toLocaleString() : '0', 
            formatDate: (d) => new Date(d).toLocaleDateString([], {month:'short', day:'numeric'})
};
    }
}).mount('#app-container');