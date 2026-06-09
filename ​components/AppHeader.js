export default {
    props: ['isHeaderVisible', 'currentTab', 'isLive', 'logoSvg'],
    template: `
        <header class="app-header" :class="{ hidden: !isHeaderVisible }" v-if="currentTab === 'home' || currentTab === 'feed'">
            <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:28px;height:28px; cursor:pointer;" v-html="logoSvg('header')" @click="$emit('open-profile')"></div>
                <span class="gradient-text" style="font-size:20px; font-weight:900; cursor:pointer;" @click="$emit('trigger-cat')" title="Summon Cat">MikoTok</span>
            </div>

            <div style="display:flex; align-items:center; gap: 15px;">
                <a href="https://twitch.tv/codemiko" target="_blank" class="header-status-wrapper">
                    <div class="story-ring" :class="isLive ? 'live' : 'offline'">
                        <img src="1000018850.png?v=2" class="story-avatar" alt="Miko">
                        <div class="header-badge" :class="isLive ? 'live' : 'offline'">{{ isLive ? 'LIVE' : 'OFFLINE' }}</div>
                    </div>
                </a>
            </div>
        </header>
    `
};
