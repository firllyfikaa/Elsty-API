<template>
  <div class="changelog-container" data-aos="fade-up">
    <h1 class="changelog-title">
      <span class="material-symbols-rounded">update</span>
      Changelog
    </h1>
    <div class="changelog-box">
      <div
        v-for="(log, index) in changelogData"
        :key="index"
        class="changelog-entry"
      >
        <h3 class="release-title">
          <div class="left">
            <span class="material-symbols-rounded">new_releases</span>
            <span class="release-text">{{ log.version }}</span>
          </div>
          <span class="release-date">{{ log.date }}</span>
        </h3>
        <ul class="change-list">
          <li v-for="(change, i) in log.changes" :key="i">
            <span class="material-symbols-rounded">check_circle</span>
            {{ change }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import changelogData from "../data/changelogData.js";

export default {
  data() {
    return {
      changelogData,
    };
  },
};
</script>

<style scoped>
/* Container */
.changelog-container {
  max-width: 640px;
  margin: 40px auto;
  padding: 24px;
  background: var(--changelog-color);
  border-radius: 16px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
  color: white;
  text-align: left;
}

/* Judul */
.changelog-title {
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.2);
}
.changelog-title .material-symbols-rounded {
  font-size: 30px;
}

/* Box Changelog */
.changelog-box {
  background: var(--dash-color);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08);
}

/* Entry */
.changelog-entry {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(100, 116, 139, 0.15);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.changelog-entry:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

/* Versi & Tanggal */
.release-title {
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--stat-value-color);
}
.release-title .left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.release-title .material-symbols-rounded {
  font-size: 24px;
  color: #2563eb;
}
.release-text {
  font-weight: bold;
  color: var(--stat-value-color);
}
.release-date {
  font-size: 1rem;
  color: #64748b;
}

/* Daftar Perubahan */
.change-list {
  padding-left: 20px;
  margin-top: 10px;
}
.change-list li {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--texttra-color);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  transition: color 0.3s ease-in-out;
}
.change-list li:hover {
  color: #2563eb;
  font-weight: 600;
}
.change-list li .material-symbols-rounded {
  font-size: 20px;
  color: #2563eb;
}

/* Responsif */
@media screen and (max-width: 600px) {
  .changelog-container {
    width: 95%;
    padding: 18px;
  }
  .changelog-title {
    font-size: 1.6rem;
  }
  .release-title {
    font-size: 1.1rem;
    flex-wrap: wrap;
  }
  .release-date {
    font-size: 0.9rem;
  }
  .change-list li {
    font-size: 0.9rem;
  }
}
</style>
