<template>
  <div class="contributors">
    <h2 class="title" data-aos="fade-up">Contributors</h2>
    <p class="subtitle" data-aos="fade-up">
      Terima kasih kepada para kontributor yang telah membantu pengembangan ELSTY API!
    </p>

    <div class="contributor-grid">
      <a
        v-for="contributor in contributors"
        :key="contributor.username"
        :href="`https://github.com/${contributor.username}`"
        target="_blank"
        class="contributor-card"
        data-aos="zoom-in"
      >
        <img :src="contributor.avatar" :alt="contributor.name" class="avatar" />
        <div class="info">
          <h3 class="name">{{ contributor.name }}</h3>
          <p class="username">@{{ contributor.username }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import contributors from "../data/contributorsData.js";

export default {
  data() {
    return {
      contributors,
    };
  },
};
</script>

<style scoped>
.contributors {
  text-align: start;
  padding: 40px 20px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 24px;
}

.contributor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
}

.contributor-card {
  background: var(--dash-color);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: 0.3s;
  border: 1px solid transparent;
}

.contributor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid white;
}

.info {
  text-align: left;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: var(--stat-value-color);
}

.username {
  font-size: 14px;
  color: var(--texttra-color);
}
</style>
