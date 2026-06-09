export default {
    props: ['currentTab', 'isRefreshing', 'currentVodIndex', 'recentVods', 'isLive', 'activeFeedVideo', 'hostname', 'clips', 'activeFilterLabel', 'optimizeTwitchImg', 'formatViews', 'formatDate'],
    template: `
        <div class="scroll-area content-shimmer" :class="{ active: isRefreshing }" id="feed-scroll" v-show="currentTab === 'home'" @scroll="$emit('scroll', $event)">
            <div class="feed-snap-item" data-id="featured" style="padding-top: 110px;">
                <div class="header-controls" style="margin-bottom: 20px; min-height: 28px; display: flex; justify-content: flex-start;">
                    <div class="premium-badge live" v-if="currentVodIndex === -1"><div class="dot"></div><span>LIVE NOW</span></div>
                    <div class="premium-badge vod" v-else-if="recentVods.length > 0"><div class="dot"></div><span>{{ recentVods[currentVodIndex] ? ('VOD • ' + recentVods[currentVodIndex].date) : 'PAST BROADCAST' }}</span></div>
                </div>
                
                <div class="vod-animated-border">
                    <div class="video-container">
                        <template v-if="activeFeedVideo === 'featured' && currentTab === 'home'">
                            <iframe v-if="currentVodIndex === -1" :src="'https://player.twitch.tv/?channel=codemiko&parent=' + hostname + '&autoplay=true&muted=false'" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>
                            <iframe v-else-if="recentVods[currentVodIndex]" :src="'https://player.twitch.tv/?video=' + recentVods[currentVodIndex].id + '&parent=' + hostname + '&autoplay=true&muted=false'" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>
                        </template>
                    </div>
                </div>
                
                <div class="carousel-controls" v-if="recentVods.length > 0 && !isLive">
                    <button class="carousel-btn" :class="{ 'hidden-arrow': currentVodIndex <= 0 }" @click.stop="$emit('prev-vod')"><span class="material-symbols-rounded">chevron_left</span></button>
                    <button class="carousel-btn" :class="{ 'hidden-arrow': currentVodIndex >= recentVods.length - 1 }" @click.stop="$emit('next-vod')"><span class="material-symbols-rounded">chevron_right</span></button>
                </div>
            </div>
            
            <div class="feed-snap-item" v-for="(clip, index) in clips" :key="clip.id" :data-id="clip.id">
                <div v-if="index === 0" class="clips-header">
                    <div class="filter-wrapper" @click.stop>
                        <button class="filter-btn-tiny" @click="$emit('open-filter')"><span class="material-symbols-rounded" style="font-size: 14px;">sort</span><span>{{ activeFilterLabel }}</span></button>
                    </div>
                </div>
                <div class="video-container">
                    <img :src="clip.thumbnail_url ? optimizeTwitchImg(clip.thumbnail_url) : ''" loading="lazy" alt="Clip Thumbnail">
                    <iframe v-if="activeFeedVideo === clip.id && currentTab === 'home'" :src="'https://clips.twitch.tv/embed?clip=' + clip.id + '&parent=' + hostname + '&autoplay=true&muted=false'" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>
                </div>
                <div class="miko-metadata">
                    <div class="author-info">
                        <img src="1000018850.png?v=2" loading="lazy" alt="Miko">
                        <div class="author-text-block">
                            <span class="author-name">{{ clip.title }}</span>
                            <div class="clip-stats">{{ formatViews(clip.view_count) }} views • {{ formatDate(clip.created_at) }}</div>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="share-btn" @click.stop="$emit('share-clip', clip)" title="Share"><span class="material-symbols-rounded gradient-icon" style="font-size: 22px;">send</span></button>
                    </div>
                </div>
            </div>
        </div>
    `
};
