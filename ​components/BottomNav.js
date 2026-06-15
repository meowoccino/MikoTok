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
            <div class="nav-item" :class="{ active: currentTab === 'tomato' }" @click="$emit('change-tab', 'tomato')">
                <svg viewBox="0 0 24 24" style="width:24px; height:24px; fill:currentColor; margin-bottom:4px;">
                    <path d="M12.1 2C10.7 2 9.5 2.9 9.1 4.2 8.7 3.8 8.1 3.5 7.5 3.5 6.1 3.5 5 4.6 5 6c0 .7.3 1.4.7 1.8C4.1 8.9 3 10.9 3 13.3c0 4.1 3.6 7.7 8.3 8.2 1.4.1 2.8 0 4.1-.5 3.8-1.5 6.1-5.4 5.6-9.5-.4-3.3-2.8-6-6.1-6.8C14.7 4.2 14.5 4 14.2 4 13.9 4 13.7 4.1 13.5 4.3 13.3 3 12.8 2 12.1 2zm0 1.5c.3 0 .6.4.8 1.1l-1.3 1.3C11.5 4.7 11.7 3.5 12.1 3.5zm-4.6.5c.6 0 1 .4 1 1 0 .6-.4 1-1 1s-1-.4-1-1 .4-1 1-1z"/>
                </svg>
                <span class="nav-label">tomato_24</span>
            </div>
        </nav>
    `
};