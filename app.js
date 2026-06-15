// Injects global CSS to fix structural margins, clear gaps, and configure color schemes
const styleReset = document.createElement('style');
styleReset.innerHTML = `
    .app-wrapper { border-left: none !important; border-right: none !important; max-width: 100% !important; }
    html, body { overscroll-behavior-y: none; background-color: var(--bg-color) !important; margin: 0; padding: 0; height: 100%; width: 100%; }
    ::-webkit-scrollbar { width: 0px; background: transparent; }
    
    /* Native Slide Transition Classes */
    .nav-slide-enter-active, .nav-slide-leave-active { transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); will-change: transform; }
    .nav-slide-enter-from, .nav-slide-leave-to { transform: translateX(100%); }
    .sub-view-overlay { position: absolute; top:0; left:0; right:0; bottom:0; background: var(--bg-color); z-index: 50; overflow-y: auto; padding: 20px 16px; box-sizing: border-box; }
`;
document.head.appendChild(styleReset);

const parseMarkdownText = (text, emotesMap) => {
    if (!text) return ''; 
    let html = text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
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

const { createApp, ref, onMounted, nextTick, computed, watch } = Vue;
const sbClient = supabase.createClient('https://yhxcuayiwqpjvalyrcqv.supabase.co', 'sb_publishable_VyFcNARHblJg10qlC_O7Dg_coouXK92');

createApp({
    components: { SplashScreen, AppHeader, BottomNav, FilterMenu, ProfileModal, ClipModal, ChatView, GeraldMinigames, GeraldView, TomatoView, MoreView, HomeView },
    setup() {
        const tabs = ['home', 'chat', 'gerald', 'tomato', 'more'];
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
        
        const hostname = window.location.hostname || 'meowoccino.github.io';
        const syncState = ref('Refresh Feed');
        const wipeState = ref('Wipe Gerald Memory');
        const logoutState = ref('Sign Out');
        const nukeState = ref('Nuke App Cache');
        
        const chatMessages = ref([]);
        const twitchChatToken = ref(null);
        const twitchAuthUrl = ref('');
        const twitchUsername = ref('');
        const showLoginPopup = ref(false);
        const apiConfig = ref({});
        const saveState = ref('');
        
        const isHeaderVisible = ref(true);
        const geminiStatus = ref('TESTING BRAIN...');
        const sysStats = ref({ cpu: 23, mem: 1.8, temp: 74 });

        const activeClipId = ref(null);
        const isLoadingMore = ref(false);
        const allClipsLoaded = ref(false);
        
        const customEmotes = ref({});

        const geraldInput = ref(''), geraldMessages = ref([{ role: 'gerald', content: '' }]);
        const isGeraldTyping = ref(false), showEmotePicker = ref(false), showMinigames = ref(false);
        const currentFilter = ref('latest'), activeFilterLabel = ref('Latest'), isFilterMenuOpen = ref(false);
        const recentVods = ref([]), currentVodIndex = ref(0);
        const selectedClip = ref(null);

        const tabOrder = ['home', 'chat', 'gerald', 'tomato', 'more'];
        const initialTabIdx = tabOrder.indexOf(tabs.includes(window.location.hash.replace('#','')) ? window.location.hash.replace('#','') : 'home');
        const tabOffset = ref(initialTabIdx * -25);

        const updateThemeClass = () => {
            document.body.className = 'theme-' + appTheme.value;
            
            const isDark = appTheme.value === 'dark';
            document.documentElement.style.setProperty('--bg-color', isDark ? '#0d0d11' : '#f8f9fa');
            document.documentElement.style.backgroundColor = isDark ? '#0d0d11' : '#f8f9fa';
            document.body.style.backgroundColor = isDark ? '#0d0d11' : '#f8f9fa';
            
            document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
            
            let metaTheme = document.querySelector('meta[name="theme-color"]');
            if (!metaTheme) {
                metaTheme = document.createElement('meta');
                metaTheme.name = "theme-color";
                document.head.appendChild(metaTheme);
            }
            metaTheme.setAttribute('content', isDark ? '#0d0d11' : '#f8f9fa');
        };

        const switchTab = (tab) => {
            currentTab.value = tab;
            tabOffset.value = tabOrder.indexOf(tab) * -25;
            window.history.pushState(null, '', `#${tab}`);
            if (tab === 'gerald') setTimeout(() => { const b = document.getElementById('gerald-msgs'); if (b) b.scrollTop = b.scrollHeight; }, 300);
        };

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
                
                const gql = await fetch('https://gql.twitch.tv/gql', { 
                    method: 'POST', 
                    headers: { 'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko' }, 
                    body: JSON.stringify({ query: `query{user(login:"codemiko"){videos(first:10){edges{node{id createdAt}}}}}` }) 
                });
                const d = await gql.json();
                const edges = d.data?.user?.videos?.edges || [];
                recentVods.value = edges.map(e => ({ id: e.node.id, date: new Date(e.node.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() }));
                
                if (currentVodIndex.value === 0 || currentVodIndex.value === -1) {
                    currentVodIndex.value = isLive.value ? -1 : 0;
                }
            } catch (err) {}
        };
        
        const loadData = async (isLoadMore = false) => {
            if (isLoadingMore.value || allClipsLoaded.value) return; 
            isLoadingMore.value = true;
            try {
                if (!isLoadMore) {
                    allClipsLoaded.value = false; 
                    allClips.value = [];
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

                const startOffset = allClips.value.length;
                const fetchAmount = 24; 
                
                const { data: c, error } = await query.range(startOffset, startOffset + fetchAmount);
                
                if (error) throw error; 

                if (c && c.length > 0) { 
                    allClips.value.push(...c); 
                    clips.value = allClips.value; 
                    if (c.length < fetchAmount + 1) allClipsLoaded.value = true;
                } else { 
                    allClipsLoaded.value = true; 
                }
            } catch (err) {} finally { isLoadingMore.value = false; }
        };

        const handleScroll = (e) => {
            const st = e.target.scrollTop;
            if (st > lastScrollTop && st > 50) {
                isHeaderVisible.value = false;
            } else if (st < lastScrollTop) {
                isHeaderVisible.value = true;
            }
            lastScrollTop = st <= 0 ? 0 : st;

            if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 600) { 
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
        const clearGeraldHistory = async () => { wipeState.value = 'WIPING...'; await sbClient.from('gerald_history').delete().eq('user_id', currentUser.value.id); geraldMessages.value = [{ role: 'gerald', content: '' }]; wipeState.value = 'SUCCESS'; setTimeout(() => wipeState.value = 'Wipe Gerald Memory', 1500); };
        const nukeCache = () => { nukeState.value = 'NUKING...'; setTimeout(() => { localStorage.clear(); caches.keys().then(names => { for (let n of names) caches.delete(n); }); nukeState.value = 'SUCCESS'; setTimeout(() => window.location.reload(), 1000); }, 50); };

        const talkToGerald = async () => {
            const inputEl = document.getElementById('gerald-txt-input');
            if (inputEl && inputEl.value !== geraldInput.value) { geraldInput.value = inputEl.value; }
            if (!geraldInput.value.trim() || isGeraldTyping.value) return;

            const userMsg = geraldInput.value;
            geraldMessages.value.push({ role: 'user', content: userMsg });

            if (currentUser.value) sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'user', content: userMsg }).then();

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
                const { data, error } = await sbClient.functions.invoke('gerald-chat', { body: { history: geminiHistory, system_directive: getGeraldSystemDirective(customEmotes.value) } });
                if (!error && data?.reply) {
                    let formattedReply = enforceGrammar(data.reply.trim());
                    geraldMessages.value.push({ role: 'gerald', content: formattedReply });
                    if (currentUser.value) sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'gerald', content: formattedReply }).then();
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
            
            if (currentUser.value) sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'user', content: logMsg }).then();
            
            isGeraldTyping.value = true;
            nextTick(() => { const b = document.getElementById('gerald-msgs'); if(b) b.scrollTop = b.scrollHeight; });

            const contextHistory = geraldMessages.value.slice(-10).map(m => ({ role: m.role === 'gerald' ? 'model' : 'user', parts: [{ text: m.content }] }));

            sbClient.functions.invoke('gerald-chat', { body: { history: contextHistory, system_directive: getGeraldSystemDirective(customEmotes.value, gameObj.prompt) } }).then(({ data, error }) => {
                if (!error && data?.reply) {
                    let formattedReply = enforceGrammar(data.reply.trim());
                    geraldMessages.value.push({ role: 'gerald', content: formattedReply });
                    if (currentUser.value) sbClient.from('gerald_history').insert({ user_id: currentUser.value.id, role: 'gerald', content: formattedReply }).then();
                } else geraldMessages.value.push({ role: 'gerald', content: 'MALFUNCTION: Internal hardware override processing failure.' });
            }).catch(() => { geraldMessages.value.push({ role: 'gerald', content: 'MALFUNCTION: Core logic offline.' }); }).finally(() => {
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

            Promise.all([loadEmotesFromSupabase(), loadData(), checkLive(), testGeminiBrain()]).then(() => {
                splashOpacity.value = 0; setTimeout(() => { splashVisible.value = false; }, 300);
            });

            setInterval(() => { sysStats.value.cpu = Math.floor(15 + Math.random() * 25); sysStats.value.temp = Math.floor(71 + Math.random() * 8); }, 4000);
            document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkLive(); });
            sbClient.channel('public:clips').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'clips' }, payload => {
                if (payload.new) { allClips.value.unshift(payload.new); if (currentFilter.value === 'latest') clips.value = allClips.value; }
            }).subscribe();
        });

        return {
            hostname, splashVisible, splashOpacity, currentTab, tabOffset, appTheme, toggleTheme, clips, currentUser, loginEmail, loginPass, loginError, geraldInput, geraldMessages, isGeraldTyping, syncState, wipeState, logoutState, nukeState, isHeaderVisible, currentFilter, activeFilterLabel, isFilterMenuOpen, recentVods, currentVodIndex, customEmotes, showEmotePicker, showMinigames, activeClipId, switchTab, geminiStatus, sysStats, handleSwipeStart, handleSwipeEnd, handleModalTouchStart, handleModalTouchMove, handleModalTouchEnd, handleScroll, apiConfig, saveState, selectedClip, modals, allClipsCount, isLive, chatMessages, twitchChatToken, twitchAuthUrl, twitchUsername, showLoginPopup,
            logoSvg: (id) => `<svg viewBox="0 0 100 100"><defs><linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9146FF"/><stop offset="100%" stop-color="#a970ff"/></linearGradient></defs><circle cx="50" cy="50" r="40" fill="url(#grad-${id})"/><path d="M 33 38 L 48 62 L 62 38 L 62 55 Q 62 65 69 64" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            optimizeTwitchImg: (u) => u ? u.replace('%{width}', '480').replace('%{height}', '270') : '',
            formatViews: (v) => v ? v.toLocaleString() : '0',
            formatDate: (d) => new Date(d).toLocaleDateString([], {month:'short', day:'numeric'}),
            closeFilterMenu: () => { isFilterMenuOpen.value = false; },
            applyFilter: (key, label) => { currentFilter.value = key; activeFilterLabel.value = label; isFilterMenuOpen.value = false; allClipsLoaded.value = false; allClips.value = []; loadData(false); },
            prevVod: () => { if (currentVodIndex.value > (isLive.value ? -1 : 0)) currentVodIndex.value--; },
            nextVod: () => { if (currentVodIndex.value < recentVods.value.length - 1) currentVodIndex.value++; },
            playClip: (clip) => { selectedClip.value = clip; },
            handleLogin, handleLogout, runSync, clearGeraldHistory, nukeCache, talkToGerald, triggerAiMinigame,
            closePickers: () => { showEmotePicker.value = false; showMinigames.value = false; },
            insertEmote: (name) => { geraldInput.value += (geraldInput.value && !geraldInput.value.endsWith(' ') ? ' ' : '') + name + ' '; showEmotePicker.value = false; },
            toggleEmotes: () => { showEmotePicker.value = !showEmotePicker.value; showMinigames.value = false; },
            toggleMinigames: () => { showMinigames.value = !showMinigames.value; showEmotePicker.value = false; },
            sendTwitchChatMessage: () => {}, disconnectTwitch: () => {}, saveApiKeys: () => {}
        };
    }
}).mount('#app-container');
