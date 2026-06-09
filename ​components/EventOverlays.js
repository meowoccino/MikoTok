export default {
    props: ['isCatZooming', 'showLumen', 'showFakeBan'],
    template: `
        <!-- We wrap these in a single div because Vue components require one root element -->
        <div>
            <div class="cat-overlay" :class="{ 'zooming': isCatZooming }">🐆</div>
            <div class="lumen-overload" v-if="showLumen"></div>
            
            <div class="fake-ban-overlay" :class="{'show': showFakeBan}">
                <span class="material-symbols-rounded" style="font-size: 60px; color: var(--danger); margin-bottom: 15px;">gavel</span>
                <h1 style="font-family: 'Outfit'; font-size: 28px; margin: 0 0 10px;">CHANNEL SUSPENDED</h1>
                <p style="color: var(--text-muted); font-size: 14px;">This channel is temporarily unavailable due to a violation of Twitch's Community Guidelines or Terms of Service.</p>
            </div>
        </div>
    `
};
