<template>
  <div class="music-menu">
    <h2 class="title">Music Playlist</h2>
    <!-- Now Playing -->
    <div v-if="currentPlayingName" class="now-playing">
      <span class="material-symbols-rounded">volume_up</span>  
      Sedang diputar: <strong>{{ currentPlayingName }}</strong>
    </div>
    <!-- Music List -->
    <ul class="music-list">
      <li
        v-for="song in musicList"
        :key="song.file"
        @click="playMusic(song.file, song.name)"
        :class="{ playing: song.file === currentPlaying }"
      >
        <span class="material-symbols-rounded">
          {{ song.file === currentPlaying ? 'graphic_eq' : 'music_note' }}
        </span>
        {{ song.name }}
      </li>
    </ul>
    <!-- Audio Player -->
    <audio ref="audioPlayer" controls @ended="resetPlaying"></audio>
    <!-- WhatsApp Bot Script -->
    <div class="bot-script">
      <div class="script-header">
        <h3>WhatsApp Bot Script</h3>
        <button @click="copyScript" class="copy-button">
          <span class="material-symbols-rounded">content_copy</span> Copy
        </button>
      </div>
      <pre><code v-html="highlightedBotScript" class="javascript"></code></pre>
    </div>
    <!-- Notification -->
    <transition name="fade">
      <div v-if="showCopyNotification" class="copy-notification">
        <span class="material-symbols-rounded">check_circle</span>
        Script copied successfully!
      </div>
    </transition>
  </div>
</template>

<script>
import { musicList } from "../data/musicData.js";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css"; // Tema mirip VS Code

export default {
  data() {
    return {
      musicList,
      currentPlaying: null,
      currentPlayingName: "",
      botScript: `
case 'lagu1':
case 'lagu2':
case 'lagu3':
case 'lagu4':
case 'lagu5':
case 'lagu6':
case 'lagu7':
case 'lagu8':
case 'lagu9':
case 'lagu10':
case 'lagu11':
case 'lagu12':
case 'lagu13':
case 'lagu14':
case 'lagu15':
case 'lagu16':
case 'lagu17':
case 'lagu18':
case 'lagu19':
case 'lagu20':
case 'lagu21':
case 'lagu22':
case 'lagu23':
case 'lagu24': {
    try {
        let audioUrl = \`https://github.com/firllyfikaa/FavLagu/raw/master/\${command}.mp3\`;
        let fikaa = await getBuffer(audioUrl);

        if (!fikaa) {
            return m.reply("❌ Gagal mengambil lagu. Coba lagi nanti.");
        }

        await firly.sendMessage(
            m.chat, 
            { audio: fikaa, mimetype: 'audio/mpeg' }, 
            { quoted: m }
        );

        console.log(\`✅ Berhasil mengirim \${command}.mp3\`);
    } catch (error) {
        console.error(\`❌ Error mengirim \${command}.mp3:\`, error);
        m.reply("❌ Terjadi kesalahan saat mengirim lagu.");
    }
    break;
}`,
      showCopyNotification: false,
    };
  },
  computed: {
    highlightedBotScript() {
      return hljs.highlight(this.botScript, { language: "javascript" }).value;
    },
  },
  methods: {
    playMusic(file, name) {
      const audio = this.$refs.audioPlayer;
      if (this.currentPlaying === file) {
        audio.paused ? audio.play() : audio.pause();
      } else {
        audio.src = `https://github.com/firllyfikaa/FavLagu/raw/master/${file}`;
        audio.play();
        this.currentPlaying = file;
        this.currentPlayingName = name;
      }
    },
    resetPlaying() {
      this.currentPlaying = null;
      this.currentPlayingName = "";
    },
    copyScript() {
      navigator.clipboard
        .writeText(this.botScript.trim())
        .then(() => {
          this.showCopyNotification = true;
          setTimeout(() => {
            this.showCopyNotification = false;
          }, 2000);
        })
        .catch(() => {
          console.error("Failed to copy script");
        });
    },
  },
  mounted() {
    hljs.highlightAll();
  },
};
</script>
<style scoped>
/* Global Styles */
.music-menu {
  padding: 24px;
  color: #151a2d;
  text-align: start;
  max-width: 700px;
  margin: auto;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 20px;
}

/* Now Playing */
.now-playing {
  padding: 12px;
  background: var(--dash-color);
  color: var(--text-color);
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.now-playing span {
  font-size: 20px;
}

/* Music List */
.music-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}
.music-list li {
  padding: 12px;
  margin-bottom: 8px;
  background: var(--dash-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  color: var(--text-color);
  gap: 10px;
}
.music-list li:hover {
  background: #eef2ff;
}
.music-list li.playing {
  background: #4f46e5;
  color: var(--text-color);
  font-weight: 600;
}
.music-list span {
  font-size: 20px;
}

/* Audio Player */
audio {
  width: 100%;
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
}

/* Bot Script */
.bot-script {
  margin-top: 20px;
  padding: 20px;
  background: var(--dash-color);
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.05);
}
.bot-script h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 10px;
}
.script-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.copy-button {
  background: #4f46e5;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}
.copy-button:hover {
  background: #4338ca;
}
pre {
  background: #1e1e2e;
  color: #ffffff;
  padding: 0px;
  border-radius: 8px;
  font-size: 14px;
  overflow-x: auto;
  line-height: 1.5;
}

/* Notification */
.copy-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .music-menu {
    padding: 16px;
    margin-top: 5px;
    max-width: 100%;
  }
  .title {
    font-size: 24px;
  }
  .now-playing {
    padding: 10px;
    font-size: 14px;
  }
  .music-list li {
    padding: 10px;
    font-size: 14px;
  }
  .music-list span {
    font-size: 18px;
  }
  audio {
    height: 40px;
  }
  .bot-script {
    padding: 12px;
  }
  pre {
    font-size: 12px;
  }
  .copy-notification {
    bottom: 10px;
    right: 10px;
    padding: 8px 16px;
    font-size: 12px;
  }
}
</style>