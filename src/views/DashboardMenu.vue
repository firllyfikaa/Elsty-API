<template>
  <div class="dashboard">
    <!-- Website Title and Description -->
    <div class="header" data-aos="zoom-up">
      <h1 class="header-title">ELSTY API</h1>
      <p class="header-desc">
        Platform API modern yang dirancang untuk memantau, mengelola, dan mengakses berbagai fitur dengan mudah.
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="stats-grid">
      <div class="stat-card" data-aos="fade-up">
        <div class="stat-header">
          <span class="material-symbols-rounded">api</span>
          <h3>Total Endpoints</h3>
        </div>
        <p class="stat-value">50+</p>
        <p class="stat-desc">Available API endpoints</p>
      </div>

      <div class="stat-card" data-aos="fade-up">
        <div class="stat-header">
          <span class="material-symbols-rounded">speed</span>
          <h3>API Calls</h3>
        </div>
        <p class="stat-value">1.2M</p>
        <p class="stat-desc">Total API requests today</p>
      </div>

      <div class="stat-card" data-aos="fade-up">
        <div class="stat-header">
          <span class="material-symbols-rounded">person</span>
          <h3>Users</h3>
        </div>
        <p class="stat-value">5,234</p>
        <p class="stat-desc">Active API users</p>
      </div>

      <div class="stat-card" data-aos="fade-up">
        <div class="stat-header">
          <span class="material-symbols-rounded">memory</span>
          <h3>Server Status</h3>
        </div>
        <p class="stat-value">99.9%</p>
        <p class="stat-desc">Uptime this month</p>
      </div>
    </div>

    <!-- Quick Access -->
    <div class="quick-access">
      <div data-aos="zoom-right">
        <h2>Quick Access</h2>
      </div>
      <div class="endpoint-grid">
        <!-- AI Endpoints -->
        <div class="endpoint-card" data-aos="fade-right">
          <div class="endpoint-icon">
            <span class="material-symbols-rounded">smart_toy</span>
          </div>
          <h3>AI Endpoints</h3>
          <p>Access AI-powered features</p>
          <router-link to="/endpoint/ai" class="endpoint-link">
            View Details
            <span class="material-symbols-rounded">arrow_forward</span>
          </router-link>
        </div>

        <!-- Downloads -->
        <div class="endpoint-card" data-aos="fade-right">
          <div class="endpoint-icon">
            <span class="material-symbols-rounded">download</span>
          </div>
          <h3>Downloads</h3>
          <p>Media download endpoints</p>
          <router-link to="/endpoint/downloads" class="endpoint-link">
            View Details
            <span class="material-symbols-rounded">arrow_forward</span>
          </router-link>
        </div>

        <!-- Search -->
        <div class="endpoint-card" data-aos="fade-right">
          <div class="endpoint-icon">
            <span class="material-symbols-rounded">search</span>
          </div>
          <h3>Search API</h3>
          <p>Quick access to search</p>
          <router-link to="/endpoint/search" class="endpoint-link">
            View Details
            <span class="material-symbols-rounded">arrow_forward</span>
          </router-link>
        </div>

        <!-- Random -->
        <div class="endpoint-card" data-aos="fade-right">
          <div class="endpoint-icon">
            <span class="material-symbols-rounded">shuffle</span>
          </div>
          <h3>Random API</h3>
          <p>Get a random or fun content</p>
          <router-link to="/endpoint/random" class="endpoint-link">
            View Details
            <span class="material-symbols-rounded">arrow_forward</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard,
.stats-grid,
.quick-access {
  overflow: visible;
}

.dashboard {
  padding: 24px;
}

/* Header Title and Description */
.header {
  text-align: start;
  margin-bottom: 32px;
}

.header-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color);
}

.header-desc {
  font-size: 16px;
  color: var(--texttra-color);
  margin-top: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--dash-color);
  padding: 24px;
  border-radius: 12px;
  position: relative; /* Tambahkan ini */
  display: block; /* Tambahkan ini */
  cursor: pointer; /* Tambahkan ini */
  transform: translateY(0);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0);
  transition: all 0.3s ease; /* Sederhanakan transition */
  will-change: transform; /* Tambahkan ini */
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px) !important; /* Tambahkan !important */
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-header span {
  font-size: 28px;
  color: #4f46e5;
}

.stat-header h3 {
  font-size: 16px;
  color: var(--text-color);
  font-weight: 600;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--stat-value-color);
  margin-bottom: 8px;
}

.stat-desc {
  color: var(--texttra-color);
  font-size: 14px;
}

/* Quick Access - Endpoint Cards */
.endpoint-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.endpoint-card {
  background: var(--endp-color);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid var(--texttra-color);
}

.endpoint-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-color: #6366f1;
}

.endpoint-icon {
  width: 52px;
  height: 52px;
  background: #6366f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: background 0.3s;
}

.endpoint-icon span {
  font-size: 28px;
  color: white;
}

.endpoint-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 8px;
}

.endpoint-card p {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 16px;
}

.endpoint-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s;
}

.endpoint-link:hover {
  color: #4338ca;
}

.endpoint-link span {
  font-size: 18px;
}
</style>
