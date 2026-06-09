export default {
    props: ['currentTab', 'geraldMessages', 'isGeraldTyping', 'geraldInput', 'showEmotePicker', 'showMinigames', 'customEmotes', 'parseMarkdown'],
    template: `
        <div class="gerald-container" v-show="currentTab === 'gerald'">
            <div class="gerald-header" @click="$emit('close-pickers')">
                <div style="position:relative; z-index: 10;">
                    <div style="width: 70px; height: 70px; border-radius: 50%; border: 2px solid var(--gerald); box-shadow: 0 0 20px rgba(14, 165, 233, 0.3); overflow: hidden; margin-bottom: 6px; background-color: #111; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <img src="gerald.png" style="width: 100%; height: 100%; object-fit: cover;" alt="G">
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px; margin-top:0px;">
                    <div class="pulse" style="background:var(--gerald); box-shadow:0 0 10px var(--gerald);"></div>
                    <div style="font-size:11px; color:var(--text-muted); font-weight:800; letter-spacing:1px; text-transform: uppercase;">System Online</div>
                </div>
            </div>
            
            <transition-group name="msg" tag="div" class="gerald-messages" id="gerald-msgs" @click="$emit('close-pickers')">
                <template v-for="(m, i) in geraldMessages" :key="i">
                    <div v-if="i === 0 && m.role === 'gerald'" class="terminal-intro">
                        <div class="terminal-header"><span class="material-symbols-rounded" style="font-size: 14px;">terminal</span> Session Initialized</div>
                        <div class="terminal-text">> Loading synapses...<br>> "{{ m.content }}"</div>
                    </div>
                    <div v-else class="chat-bubble" :class="m.role" v-html="parseMarkdown(m.content)"></div>
                </template>
                <div v-if="isGeraldTyping" key="typing" class="typing-indicator">
                    <div class="pulse" style="background:var(--gerald); box-shadow:0 0 10px var(--gerald);"></div>COMPUTING...
                </div>
            </transition-group>
            
            <div style="display:flex; flex-direction:column; background: var(--bg-color); width: 100%;">
                <transition name="tray">
                    <div class="tray-container" v-show="showEmotePicker">
                        <img v-for="(emote, name) in customEmotes" :key="name" :src="emote.url ? emote.url : 'https://cdn.discordapp.com/emojis/' + emote.id + '.' + (emote.animated ? 'gif' : 'png') + '?size=44'" class="emote-picker-img" @click="$emit('insert-emote', name)">
                    </div>
                </transition>

                <transition name="tray">
                    <div class="tray-container" v-show="showMinigames">
                        <button class="bribe-btn" @click="$emit('play-game', 'glitch')">🕶️ Glitch Persona</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'shader')">🔥 Compile UE5</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'drift')">🩰 Fix Foot Drift</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'boba')">🥤 Boba Spill</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'pineapple')">🚪 Pineapple Walk-In</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'cat')">🐈 Cat on PC</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'bits')">🎟️ 100K Bits</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'dust')">🎤 Dusty Mic</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'ban')">🚫 Fake Ban</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'lumen')">💡 Re-Bake Lumen</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'throttle')">📉 Throttling</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'sniper')">🎯 Counter Snipers</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'yusha')">👑 Yusha Logic</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'asmr')">👂 ASMR Mode</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'intercept')">🧋 Intercept Tea</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'charge')">🔋 Charge Xsens</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'ping')">🔔 Ping @everyone</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'chroma')">🟢 Clear Chroma</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'speedrun')">⏱️ Speedrun Fail</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'router')">📡 Kick Router</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'taco')">🌮 Offer Taco</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'whiskey')">🥃 Pour Whiskey</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'egg')">🥚 Ostrich Egg</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'gummy')">🧸 Gummy Bears</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'booba')">🎚️ Booba Slider</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'clanker')">🤖 Call Clanker</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'mute')">🔇 Mute Mic</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'desk')">🧹 Scan Desk</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'bald')">🧑‍🦲 Delete Hair</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'demon')">🎙️ Demon Voice</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'tracker')">🔌 Drop Tracker</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'guest')">📺 Guest Crash</button>
                        <button class="bribe-btn" @click="$emit('play-game', 'siren')">🚨 Firetruck Siren</button>
                    </div>
                </transition>

                <div class="gerald-input-area">
                    <div class="gerald-input-wrapper">
                        <button class="emote-toggle-btn" @click="$emit('toggle-emotes')"><span class="material-symbols-rounded" :style="{ color: showEmotePicker ? 'var(--gerald)' : 'inherit' }">mood</span></button>
                        <button class="emote-toggle-btn" @click="$emit('toggle-minigames')"><span class="material-symbols-rounded" :style="{ color: showMinigames ? 'var(--gerald)' : 'inherit' }">sports_esports</span></button>
                        <textarea class="gerald-input" rows="1" placeholder="Query the system..." :value="geraldInput" @input="$emit('update-input', $event)" @keydown="$emit('key-down', $event)" id="gerald-txt-input" @focus="$emit('close-pickers')"></textarea>
                    </div>
                    <button class="gerald-send" @click="$emit('send')"><span class="material-symbols-rounded">send</span></button>
                </div>
            </div>
        </div>
    `
};
