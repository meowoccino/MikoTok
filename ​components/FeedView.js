export default {
    props: ['currentTab', 'isRefreshing', 'ytFeed', 'ytCurrentIndex', 'redditFeed', 'redditCurrentIndex', 'formatNumber'],
    template: `
        <div class="feed-layout" :class="{ active: isRefreshing }" v-show="currentTab === 'feed'">
            <div id="yt-wrapper">
                <div v-if="ytFeed.length > 0">
                    <div class="vod-animated-border" style="background-image: linear-gradient(90deg, #27272a, var(--youtube), #27272a);">
                        <div class="video-container">
                            <iframe v-if="ytFeed[ytCurrentIndex] && currentTab === 'feed'" :src="'https://www.youtube.com/embed/' + ytFeed[ytCurrentIndex].id" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
                        </div>
                    </div>
                    <div class="carousel-controls">
                        <button class="carousel-btn" :class="{ 'hidden-arrow': ytCurrentIndex <= 0 }" @click.stop="$emit('prev-yt')"><span class="material-symbols-rounded">chevron_left</span></button>
                        <button class="carousel-btn" :class="{ 'hidden-arrow': ytCurrentIndex >= ytFeed.length - 1 }" @click.stop="$emit('next-yt')"><span class="material-symbols-rounded">chevron_right</span></button>
                    </div>
                </div>
                <div v-else style="display: flex; justify-content: center; padding: 40px; color: var(--text-muted); font-size: 12px; font-style: italic;">
                    <span class="material-symbols-rounded spin-anim" style="margin-right: 8px;">sync</span> Fetching from YouTube...
                </div>
            </div>

            <div id="reddit-wrapper">
                <div v-if="redditFeed.length > 0" style="display:flex; flex-direction:column; height:100%;">
                    <a :href="'https://reddit.com' + redditFeed[redditCurrentIndex].permalink" target="_blank" class="reddit-compact-card">
                        <div class="reddit-header">
                            <div class="reddit-author">Posted • {{ redditFeed[redditCurrentIndex].date }}<br><span>u/{{ redditFeed[redditCurrentIndex].author }}</span></div>
                            <span v-if="redditFeed[redditCurrentIndex].link_flair_text" style="background: rgba(255, 69, 0, 0.15); border: 1px solid rgba(255, 69, 0, 0.3); color: var(--reddit); font-size: 9px; font-weight: 800; padding: 3px 6px; border-radius: 6px; text-transform: uppercase;">
                                {{ redditFeed[redditCurrentIndex].link_flair_text }}
                            </span>
                        </div>
                        
                        <div v-if="redditFeed[redditCurrentIndex] && redditFeed[redditCurrentIndex].thumbnail && redditFeed[redditCurrentIndex].thumbnail.startsWith('http')" class="reddit-img-container">
                            <img :src="redditFeed[redditCurrentIndex].thumbnail" onerror="this.closest('div').style.display='none'" alt="Reddit Media">
                        </div>
                        
                        <div class="reddit-post-title" :style="redditFeed[redditCurrentIndex] && redditFeed[redditCurrentIndex].thumbnail && redditFeed[redditCurrentIndex].thumbnail.startsWith('http') ? '' : 'flex: 1;'">{{ redditFeed[redditCurrentIndex].title }}</div>
                        
                        <div class="reddit-actions">
                            <div style="display: flex; align-items: center; gap: 4px; color: var(--reddit);"><span class="material-symbols-rounded" style="font-size: 16px;">arrow_upward</span> {{ formatNumber(redditFeed[redditCurrentIndex].ups) }}</div>
                            <div style="display: flex; align-items: center; gap: 4px;"><span class="material-symbols-rounded" style="font-size: 16px;">chat_bubble</span> {{ redditFeed[redditCurrentIndex].num_comments }}</div>
                            <div style="margin-left: auto; color: #a1a1aa; display: flex; align-items: center; gap: 4px; font-size: 11px; text-transform: uppercase;">Open <span class="material-symbols-rounded" style="font-size: 14px;">open_in_new</span></div>
                        </div>
                    </a>
                    <div class="carousel-controls">
                        <button class="carousel-btn" :class="{ 'hidden-arrow': redditCurrentIndex <= 0 }" @click.stop="$emit('prev-reddit')"><span class="material-symbols-rounded">chevron_left</span></button>
                        <button class="carousel-btn" :class="{ 'hidden-arrow': redditCurrentIndex >= redditFeed.length - 1 }" @click.stop="$emit('next-reddit')"><span class="material-symbols-rounded">chevron_right</span></button>
                    </div>
                </div>
                <div v-else style="display: flex; justify-content: center; padding: 40px; color: var(--text-muted); font-size: 12px; font-style: italic;">
                    <span class="material-symbols-rounded spin-anim" style="margin-right: 8px;">sync</span> Fetching from Reddit...
                </div>
            </div>
        </div>
    `
};
