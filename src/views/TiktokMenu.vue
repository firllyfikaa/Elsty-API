<script>
import axios from "axios";

export default {
  data() {
    return {
      url: "",
      tiktokInfo: null,
      error: null,
      loading: false,
      downloading: false,
      downloadProgress: 0,
    };
  },
  computed: {
    apiBaseUrl() {
      // Gunakan localhost:3000 saat development, dan URL website saat production
      return process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000/api/download/tiktok' 
        : 'https://api.elsty.xyz/api/download/tiktok';
    }
  },
  methods: {
    isValidTiktokUrl(url) {
      // Memastikan URL hanya berasal dari TikTok dengan format yang benar
      const tiktokPattern = /^https?:\/\/(vm\.|vt\.)?tiktok\.com\/[a-zA-Z0-9]+(\/)?$|^https?:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+$/i;
      return tiktokPattern.test(url);
    },

    async fetchTiktokInfo() {
      this.error = null; // Reset error saat mulai validasi

      if (!this.url) {
        this.error = "Silakan masukkan URL TikTok.";
        return;
      }

      if (!this.isValidTiktokUrl(this.url)) {
        this.error = "URL TikTok tidak valid.";
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(
          `${this.apiBaseUrl}?url=${encodeURIComponent(this.url)}`
        );

        if (response.data && response.data.success) {
          this.tiktokInfo = response.data.result;
        } else {
          this.error = "Data tidak ditemukan.";
        }
      } catch (err) {
        console.error('Error:', err);
        this.error = "Gagal mengambil informasi TikTok.";
      } finally {
        this.loading = false;
      }
    },

    async downloadFile(type) {
      if (!this.tiktokInfo || !this.tiktokInfo.downloadLinks) {
        this.error = "Informasi TikTok tidak valid.";
        return;
      }

      const downloadUrl = this.tiktokInfo.downloadLinks[type];
      if (!downloadUrl) {
        this.error = `Tautan unduhan ${type} tidak tersedia.`;
        return;
      }

      try {
        const fileName = `TikTok_${type}_${Date.now()}.${type === 'audio' ? 'mp3' : 'mp4'}`;
        this.startDownload(downloadUrl, fileName);
      } catch (error) {
        console.error('Download error:', error);
        this.error = "Gagal mengunduh file.";
      }
    },

    async downloadAudio() {
      if (!this.tiktokInfo || !this.tiktokInfo.downloadLinks?.audio) {
        this.error = "Informasi TikTok tidak valid.";
        return;
      }

      try {
        const downloadUrl = this.tiktokInfo.downloadLinks.audio;
        const fileName = `TikTok_audio_${Date.now()}.mp3`;
        this.startDownload(downloadUrl, fileName);
      } catch (error) {
        console.error('Download error:', error);
        this.error = "Gagal mengunduh audio.";
      }
    },

    startDownload(url, fileName) {
      this.downloading = true;
      this.downloadProgress = 0;

      axios
        .get(url, {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              this.downloadProgress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
            }
          },
        })
        .then((response) => {
          const blob = new Blob([response.data]);
          const blobUrl = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = blobUrl;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(blobUrl);
        })
        .catch((error) => {
          console.error('Download error:', error);
          this.error = "Gagal mengunduh file.";
        })
        .finally(() => {
          setTimeout(() => {
            this.downloading = false;
            this.downloadProgress = 0;
          }, 1000);
        });
    },
  },
};
</script>

<template>
  <div class="tiktok-menu">
    <h2>
      <span class="fab fa-tiktok"></span>
      TikTok Downloader
    </h2>
    <!-- Input URL -->
    <div class="input-container">
      <input
        v-model="url"
        type="text"
        placeholder="Masukkan URL TikTok"
      />
      <button @click="fetchTiktokInfo">
        <span class="material-symbols-rounded">search</span>
        {{ loading ? 'Wait...' : 'Cari' }}
      </button>
    </div>
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <span class="material-symbols-rounded spin">sync</span>
      Sedang memuat...
    </div>
    <!-- Error -->
    <div v-if="error" class="error">
      <span class="material-symbols-rounded">error</span>
      {{ error }}
    </div>
    <!-- Informasi TikTok -->
    <div v-if="tiktokInfo" class="video-info">
      <h3>
        <span class="material-symbols-rounded">person</span>
        {{ tiktokInfo.username }}
      </h3>
      <p>
        <span class="fab fa-solid fa-address-card"></span>
        Handle: "{{ tiktokInfo.userHandle }}"
      </p>
      <p>
        <span class="fab fa-solid fa-newspaper"></span>
        Deskripsi: "{{ tiktokInfo.description }}"
      </p>
      <img :src="tiktokInfo.userProfileImage" alt="Profil Pengguna" />
      <!-- Progress Bar -->
      <div v-if="downloading" class="progress-container">
        <p>Unduhan: {{ downloadProgress }}%</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: downloadProgress + '%' }"></div>
        </div>
      </div>
      <!-- Tombol Unduh -->
      <div class="download-buttons">
        <button @click="downloadFile('noWatermark')">
          <span class="material-symbols-rounded">download</span>
           Video NoWM
        </button>
        <button @click="downloadFile('withWatermark')">
          <span class="material-symbols-rounded">water_drop</span>
           Video
        </button>
        <button @click="downloadAudio">
          <span class="material-symbols-rounded">music_note</span>
           Audio
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Global Styles */
.tiktok-menu {
  padding: 24px;
  color: var(--text-color);
  text-align: start;
  max-width: 600px;
  margin: auto;
}

h2 {
  font-size: 28px;
  text-align: left;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 24px;
}

/* Input Container */
.input-container {
  display: flex;
  gap: 12px;
  margin: 25px 0;
}
input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  background: var(--input-color);
  color: var(--text-color);
  transition: all 0.3s ease;
}
input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 5px rgba(79, 70, 229, 0.2);
  transform: scale(1.02);
}

button {
  background: var(--primary-color);
  color: white;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;
}
button:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading and Error */
.loading,
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  padding: 12px;
  border-radius: 8px;
  margin-top: 10px;
  animation: fadeIn 0.5s ease-in-out;
}
.loading {
  color: var(--primary-color);
  background: #eef2ff;
}
.error {
  color: #ef4444;
  background: #fee2e2;
}
.material-symbols-rounded.spin {
  animation: spin 1.5s linear infinite;
}

/* Video Info */
.video-info {
  text-align: left;
  margin-top: 20px;
  animation: fadeIn 0.5s ease-in-out;
}
.video-info img {
  width: 100%;
  max-width: 350px;
  border-radius: 12px;
  margin: 15px 0;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}
.video-info img:hover {
  transform: scale(1.03);
}
.video-details {
  text-align: left;
  margin-top: 10px;
}
.video-details h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  margin: 10px 0 20px 0;
  gap: 8px;
}
.video-details p {
  font-size: 14px;
  color: var(--secondary-text-color);
  display: flex;
  align-items: center;
  gap: 8px;
}
.material-symbols-rounded {
  font-size: 20px;
}

/* Download Buttons */
.download-buttons {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 20px;
  flex-wrap: wrap;
}
.download-buttons button {
  padding: 12px 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.download-buttons button:first-child {
  background: #10b981;
}
.download-buttons button:first-child:hover {
  background: #059669;
}
.download-buttons button:nth-child(2) {
  background: #f59e0b;
}
.download-buttons button:nth-child(2):hover {
  background: #d97706;
}
.download-buttons button:last-child {
  background: #3b82f6;
}
.download-buttons button:last-child:hover {
  background: #2563eb;
}

/* Progress Bar */
.progress-container {
  text-align: center;
  margin: 20px 0;
}
.progress-container p {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 8px;
}
.progress-bar {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background-color: #4f46e5;
  transition: width 0.3s ease-in-out;
}

/* Responsive Design */
@media (max-width: 480px) {
  .tiktok-menu {
    padding: 16px;
    margin-top: 5px;
    max-width: 100%;
  }
  input {
    font-size: 14px;
    padding: 8px;
  }
  button {
    font-size: 14px;
    padding: 8px 12px;
  }
  .video-info img {
    max-width: 100%;
  }
  .download-buttons {
    flex-direction: column;
    gap: 10px;
  }
  .progress-container p {
    font-size: 12px;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fillProgress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>