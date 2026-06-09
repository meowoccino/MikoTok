export default {
    props: ['splashVisible', 'splashOpacity', 'logoSvg'],
    template: `
        <div id="splash-screen" v-if="splashVisible" :style="{ opacity: splashOpacity }">
            <div style="width:100px;height:100px;margin-bottom:20px;" v-html="logoSvg('splash')"></div>
            <div class="gradient-text" style="font-size: 32px; font-weight: 900;">MikoTok</div>
            <div class="progress-bar"><div class="progress-fill"></div></div>
        </div>
    `
};
