<script>
export default {
  name: 'YoutubeDownloader',
  data() {
    return {
      videoUrl: '',
      videoInfo: null,
      videoLinks: [],
      audioLinks: [],
      selectedQuality: '',
      selectedAudioQuality: '',
      error: null,
      loading: false,
      downloadProgress: null,
      isDownloading: false,
      progressInterval: null
    };
  },
  computed: {
    apiBaseUrl() {
      // Gunakan localhost:3000 saat development, dan URL website saat production
      return process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000/api/download/youtube' 
        : 'https://api.elsty.xyz/api/download/youtube';
    }
  },
  methods: {
    validateYoutubeUrl(url) {
      const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      return pattern.test(url);
    },
    isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    },
    async fetchVideoInfo() {
      if (!this.videoUrl) {
        this.error = 'Silakan masukkan URL YouTube.';
        return;
      }
      if (!this.validateYoutubeUrl(this.videoUrl)) {
        this.error = 'URL tidak valid. Masukkan URL YouTube yang benar.';
        return;
      }
      
      this.loading = true;
      this.error = null;
      this.videoInfo = null;
      this.videoLinks = [];
      this.audioLinks = [];
      this.selectedQuality = '';
      this.selectedAudioQuality = '';

      try {
        const response = await fetch(
          `${this.apiBaseUrl}?url=${encodeURIComponent(this.videoUrl)}`
        );
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data dari server.');
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error('Tidak dapat memproses video ini.');
        }

        // Set video info dari response
        this.videoInfo = {
          title: data.audio[0]?.title || data.video[0]?.title || 'Judul Tidak Diketahui',
          thumbnail: data.audio[0]?.image || data.video[0]?.image || '',
          author: 'Unknown', // Karena tidak ada data author dari API
          seconds: 0 // Karena tidak ada data durasi dari API
        };

        // Process video links
        this.videoLinks = data.video
          .filter(v => v.downloadUrl)
          .map(v => {
            let qualityNum = 0;
            const format = v.format.toLowerCase();
            
            if (format === '4k') {
              qualityNum = 2160;
            } else {
              qualityNum = parseInt(format) || 0;
            }
            
            return {
              url: v.downloadUrl,
              quality: v.format,
              qualityNum: qualityNum
            };
          })
          .sort((a, b) => b.qualityNum - a.qualityNum)
          .map(({ url, quality }) => ({ url, quality }));

        // Process audio links
        this.audioLinks = data.audio
          .filter(a => a.downloadUrl)
          .map(a => ({
            url: a.downloadUrl,
            quality: a.format.toUpperCase()
          }));

        if (this.videoLinks.length === 0 && this.audioLinks.length === 0) {
          throw new Error('Tidak ada tautan unduhan yang tersedia.');
        }

        // Set kualitas default
        if (this.videoLinks.length > 0) {
          this.selectedQuality = this.videoLinks[0].url;
        }
        if (this.audioLinks.length > 0) {
          this.selectedAudioQuality = this.audioLinks[0].url;
        }
      } catch (err) {
        console.error('Error:', err);
        this.error = err.message || 'Terjadi kesalahan saat memproses video.';
      } finally {
        this.loading = false;
      }
    },
    simulateProgress() {
      let progress = 0;
      this.progressInterval = setInterval(() => {
        if (progress < 90) {
          progress += Math.random() * 5;
          this.downloadProgress = Math.min(progress, 90);
        }
      }, 300);
    },
    async downloadMp4() {
      if (!this.selectedQuality) {
        this.error = 'Pilih kualitas video terlebih dahulu.';
        return;
      }
      
      this.isDownloading = true;
      this.downloadProgress = 0;
      this.error = null;

      try {
        this.simulateProgress();
        const response = await fetch(this.selectedQuality, { redirect: 'follow' });
        
        if (!response.ok) {
          throw new Error('Gagal mengunduh video.');
        }

        const blob = await response.blob();
        const fileName = `${this.sanitizeFileName(this.videoInfo.title)}.mp4`;
        this.triggerDownload(blob, fileName);

        clearInterval(this.progressInterval);
        this.downloadProgress = 100;
      } catch (error) {
        console.error('Download error:', error);
        this.error = `Gagal mengunduh video: ${error.message}`;
      } finally {
        this.isDownloading = false;
        setTimeout(() => {
          this.downloadProgress = null;
        }, 1000);
      }
    },
    async downloadMp3() {
      if (!this.selectedAudioQuality) {
        this.error = 'Pilih kualitas audio terlebih dahulu.';
        return;
      }
      
      this.isDownloading = true;
      this.downloadProgress = 0;
      this.error = null;

      try {
        this.simulateProgress();
        const response = await fetch(this.selectedAudioQuality, { redirect: 'follow' });
        
        if (!response.ok) {
          throw new Error('Gagal mengunduh audio.');
        }

        const blob = await response.blob();
        const fileName = `${this.sanitizeFileName(this.videoInfo.title)}.mp3`;
        this.triggerDownload(blob, fileName);

        clearInterval(this.progressInterval);
        this.downloadProgress = 100;
      } catch (error) {
        console.error('Download error:', error);
        this.error = `Gagal mengunduh MP3: ${error.message}`;
      } finally {
        this.isDownloading = false;
        setTimeout(() => {
          this.downloadProgress = null;
        }, 1000);
      }
    },
    triggerDownload(blob, fileName) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    sanitizeFileName(fileName) {
      return fileName
        .replace(/[<>:"/\\|?*]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();
    },
    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }
};
</script>

<template>
  <div class="youtube-downloader">
    <div class="yt-header">
      <h2>
        <span class="icon-youtube"></span>
        YouTube Downloader
      </h2>
    </div>

    <div class="yt-content">
      <!-- Input URL -->
      <div class="input-container">
        <input
          v-model="videoUrl"
          type="text"
          placeholder="Masukkan URL YouTube"
          @keyup.enter="fetchVideoInfo"
          :disabled="loading || isDownloading"
          aria-label="Masukkan URL YouTube"
        />
        <button 
          @click="fetchVideoInfo" 
          :disabled="loading || isDownloading"
          class="search-btn"
          aria-label="Cari informasi video"
        >
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

      <!-- Video Info -->
      <div v-if="videoInfo && !loading" class="video-info">
        <img :src="videoInfo.thumbnail" :alt="videoInfo.title" />
        <div class="video-details">
          <h3>
            <span class="material-symbols-rounded">title</span>
            {{ videoInfo.title }}
          </h3>
          <p>
            <span class="material-symbols-rounded">person</span>
            {{ videoInfo.author }}
            <span class="material-symbols-rounded">schedule</span>
            {{ formatDuration(videoInfo.seconds) }}
          </p>
        </div>

        <!-- Download Options -->
        <div v-if="videoLinks.length > 0 || audioLinks.length > 0" class="download-section">
          <!-- Quality Selector for Video -->
          <div class="quality-selector" v-if="videoLinks.length > 0">
            <label for="video-quality">
              <span class="material-symbols-rounded">settings</span>
              Pilih Kualitas Video:
            </label>
            <div class="select-wrapper">
              <select 
                id="video-quality"
                v-model="selectedQuality"
                :disabled="isDownloading"
                aria-label="Pilih kualitas video"
              >
                <option value="">Pilih kualitas video</option>
                <option
                  v-for="(link, index) in videoLinks"
                  :key="index"
                  :value="link.url"
                >
                  {{ link.quality }}
                </option>
              </select>
              <span class="material-symbols-rounded dropdown-icon">expand_more</span>
            </div>
          </div>

          <!-- Quality Selector for Audio -->
          <div class="quality-selector" v-if="audioLinks.length > 0">
            <label for="audio-quality">
              <span class="material-symbols-rounded">music_note</span>
              Pilih Kualitas Audio:
            </label>
            <div class="select-wrapper">
              <select 
                id="audio-quality"
                v-model="selectedAudioQuality"
                :disabled="isDownloading"
                aria-label="Pilih kualitas audio"
              >
                <option value="">Pilih kualitas audio</option>
                <option
                  v-for="(link, index) in audioLinks"
                  :key="index"
                  :value="link.url"
                >
                  {{ link.quality }}
                </option>
              </select>
              <span class="material-symbols-rounded dropdown-icon">expand_more</span>
            </div>
          </div>

          <!-- Download Buttons -->
          <div class="download-buttons">
            <button 
              @click="downloadMp4"
              :disabled="!selectedQuality || isDownloading"
              aria-label="Unduh video dalam format MP4"
            >
              <span class="material-symbols-rounded">download</span>
              Unduh MP4
            </button>
            <button 
              @click="downloadMp3"
              :disabled="!selectedAudioQuality || isDownloading"
              aria-label="Unduh audio dalam format MP3"
            >
              <span class="material-symbols-rounded">music_note</span>
              Unduh MP3
            </button>
          </div>
        </div>

        <!-- Download Progress -->
        <div v-if="downloadProgress !== null" class="progress-container">
          <p>Mengunduh: {{ downloadProgress }}%</p>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${downloadProgress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Variables */
:root {
  --secondary-text-color: #4b5563;
  --background-color: #ffffff;
  --border-color: #e5e7eb;
  --shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}


/* Global Styles */
.youtube-downloader {
  max-width: 600px;
  margin: auto;
  padding: 24px;
  color: var(--text-color);
  font-family: 'Poppins', sans-serif;
  overflow: hidden; /* Untuk memastikan animasi tidak "tumpah" */
}

/* Header */
.yt-header h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: fadeIn 0.5s ease-in-out;
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
  text-align: center;
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

/* Quality Selector */
.quality-selector {
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.quality-selector label {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  background: var(--input-color);
  color: var(--text-color);
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}
select:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 5px rgba(79, 70, 229, 0.2);
}
.dropdown-icon {
  position: absolute;
  right: 12px;
  pointer-events: none;
  color: var(--secondary-text-color);
  transition: transform 0.3s ease;
}
select:focus + .dropdown-icon {
  transform: rotate(180deg);
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
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;
}
.download-buttons button:first-child {
  background: var(--success-color);
}
.download-buttons button:first-child:hover {
  background: #10b981;
  transform: translateY(-2px);
}
.download-buttons button:nth-child(2) {
  background: var(--warning-color);
}
.download-buttons button:nth-child(2):hover {
  background: #d97706;
  transform: translateY(-2px);
}
.download-buttons button:last-child {
  background: var(--info-color);
}
.download-buttons button:last-child:hover {
  background: #3b82f6;
  transform: translateY(-2px);
}

/* Progress Bar */
.progress-container {
  text-align: center;
  margin: 20px 0;
  animation: fadeIn 0.5s ease-in-out;
}
.progress-container p {
  font-size: 14px;
  color: var(--secondary-text-color);
  margin-bottom: 8px;
}
.progress-bar {
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}
.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease-in-out;
  animation: fillProgress 1s ease-in-out;
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

/* Responsive Design */
@media (max-width: 480px) {
  .youtube-downloader {
    padding: 16px;
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
</style>