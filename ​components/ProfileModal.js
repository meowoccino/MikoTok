export default {
    props: ['isOpen', 'currentUser', 'loginEmail', 'loginPass', 'apiConfig', 'syncState', 'wipeState', 'logoutState'],
    template: `
        <div class="modal-overlay" :class="{ open: isOpen }" @click.self="$emit('close')">
            <div class="modal-content" @touchstart="$emit('touch-start', $event)" @touchmove="$emit('touch-move', $event)" @touchend="$emit('touch-end', $event)">
                <div class="drag-handle"></div>
                
                <div v-if="!currentUser">
                    <input type="text" :value="loginEmail" @change="$emit('update-email', $event.target.value)" class="input-box" style="margin-top: 10px;" placeholder="Email">
                    <input type="password" :value="loginPass" @change="$emit('update-pass', $event.target.value)" class="input-box" @keyup.enter="$emit('login')" placeholder="Password">
                    <button class="sync-btn" @click="$emit('login')">LOGIN</button>
                </div>
                
                <div v-else>
                    <div class="infra-bar"><div class="status-node"><div class="pulse"></div> SYSTEM: READY</div></div>
                    <div class="stat-grid">
                        <a href="https://github.com/meowoccino/MikoTok" target="_blank" class="external-link-btn"><span class="material-symbols-rounded">code</span>GitHub Repo</a>
                        <a href="https://supabase.com/dashboard/project/yhxcuayiwqpjvalyrcqv" target="_blank" class="external-link-btn"><span class="material-symbols-rounded">database</span>Supabase DB</a>
                    </div>
                    
                    <div class="settings-block">
                        <div class="block-title">TWITCH API CONFIG</div>
                        <input type="text" class="sleek-input" :value="apiConfig.cid" @change="$emit('update-api', 'cid', $event.target.value)" placeholder="Client ID">
                        <input type="password" class="sleek-input" :value="apiConfig.tkn" @change="$emit('update-api', 'tkn', $event.target.value)" placeholder="Access Token">
                    </div>

                    <div class="action-menu">
                        <button class="menu-btn sync-row" :style="syncState === 'sync-success' ? 'color: var(--success);' : ''" @click="$emit('sync')" :disabled="syncState !== 'idle'">
                            <div class="btn-content">
                                <div class="icon-wrap" :style="syncState === 'sync-success' ? 'background: rgba(0, 255, 163, 0.15);' : ''">
                                    <span class="material-symbols-rounded" :class="{'spin-anim': syncState === 'syncing'}" style="font-size: 18px;">
                                        {{ syncState === 'sync-success' ? 'check' : 'sync' }}
                                    </span>
                                </div>
                                <span>{{ syncState === 'syncing' ? 'SYNCING...' : (syncState === 'sync-success' ? 'SUCCESS' : 'Force Data Sync') }}</span>
                            </div>
                        </button>
                        
                        <button class="menu-btn wipe-row" :style="wipeState === 'success' ? 'color: var(--success);' : ''" @click="$emit('wipe')" :disabled="wipeState !== 'idle'">
                            <div class="btn-content">
                                <div class="icon-wrap" :style="wipeState === 'success' ? 'background: rgba(0, 255, 163, 0.15);' : ''">
                                    <span class="material-symbols-rounded" :class="{'shake-anim': wipeState === 'wiping'}" style="font-size: 18px;">
                                        {{ wipeState === 'success' ? 'delete' : 'delete' }}
                                    </span>
                                </div>
                                <span>{{ wipeState === 'wiping' ? 'WIPING...' : (wipeState === 'success' ? 'MEMORY WIPED!' : 'Wipe Gerald\\'s Memory') }}</span>
                            </div>
                        </button>

                        <button class="menu-btn logout-row" @click="$emit('logout')" :disabled="logoutState !== 'idle'">
                            <div class="btn-content">
                                <div class="icon-wrap">
                                    <span class="material-symbols-rounded" :class="{'spin-anim': logoutState === 'logging_out'}" style="font-size: 18px;">
                                        {{ logoutState === 'logging_out' ? 'hourglass_empty' : 'logout' }}
                                    </span>
                                </div>
                                <span>{{ logoutState === 'logging_out' ? 'SIGNING OUT...' : 'Sign Out' }}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};
