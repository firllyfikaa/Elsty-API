<template>
  <div class="endpoint-page">
    <!-- Header Section -->
    <div class="endpoint-header" data-aos="zoom-up">
      <h1>{{ endpointType }} Endpoints</h1>
      <div class="search-bar" data-aos="fade-up">
        <span class="material-symbols-rounded">search</span>
        <input
          type="text"
          placeholder="Search endpoints..."
          v-model="searchQuery"
        />
      </div>
    </div>

    <!-- Jika Tidak Ada Data -->
    <p v-if="filteredEndpoints.length === 0" class="no-data">No endpoints available.</p>

    <!-- Endpoints Grid -->
    <div class="endpoints-grid" v-else>
      <div
        v-for="(endpoint, index) in filteredEndpoints"
        :key="endpoint.path"
        class="endpoint-item"
        :data-aos="index % 2 === 0 ? 'fade-up' : 'zoom-in'"
      >
        <!-- Endpoint Method -->
        <div class="endpoint-method" :class="endpoint.method.toLowerCase()">
          <span class="method-label">{{ endpoint.method }}</span>
          <button class="try-button" @click="tryEndpoint(endpoint.path)">
            Try
          </button>
        </div>

        <!-- Endpoint Info -->
        <div class="endpoint-info">
          <h3>{{ endpoint.name }}</h3>
          <p class="endpoint-path">{{ endpoint.path }}</p>
          <p class="endpoint-desc">{{ endpoint.description }}</p>
          <div class="endpoint-meta">
            <span class="endpoint-tag">{{ endpoint.category }}</span>
            <span class="endpoint-status" :class="endpoint.status">
              {{ endpoint.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { endpoints } from "../data/endpoints";

export default {
  props: {
    endpointType: {
      type: String,
      required: true,
    },
  },
  data() {
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    return {
      searchQuery: "",
      baseApiUrl: isLocalhost ? "http://localhost:3000" : "https://api.elsty.xyz",
      endpoints,
    };
  },
  computed: {
      filteredEndpoints() {
        const filtered = this.endpoints.filter(
          (endpoint) =>
            endpoint.category.toLowerCase() === this.endpointType.toLowerCase() &&
            (endpoint.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              endpoint.path.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
        
        console.log("Filtered Endpoints:", filtered); // Debugging
        return filtered;
      },
    },
  methods: {
    tryEndpoint(path) {
      const fullUrl = `${this.baseApiUrl}${path}`;
      window.open(fullUrl, "_blank");
    },
  },
  mounted() {
    console.log("Loaded endpoints:", this.endpoints);
  },
};
</script>

<style scoped>
.endpoint-page {
  padding: 32px 16px;
  max-width: 1200px;
  margin: 0 auto;
  overflow-y: auto;
}

/* Header Section */
.endpoint-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 16px;
  margin-bottom: 32px;
}

.endpoint-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--input-color);
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 300px;
}

.search-bar span {
  font-size: 20px;
  color: #64748b;
}

.search-bar input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  background: var(--input-color);
  color: var(--texttra-color);
}

/* Endpoints Grid */
.endpoints-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

/* Endpoint Item */
.endpoint-item {
  background: var(--input-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.endpoint-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

/* Endpoint Method */
.endpoint-method {
  padding: 10px 16px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.endpoint-method .method-label {
  letter-spacing: 0.5px;
}

/* Warna background berdasarkan method */
.endpoint-method.get {
  background: #dcfce7;
  color: #166534;
}

.endpoint-method.post {
  background: #dbeafe;
  color: #1e40af;
}

/* Tambahan contoh untuk method lain */
.endpoint-method.put {
  background: #fee2e2;
  color: #b91c1c;
}

.endpoint-method.down {
  background: #ffe4e6;
  color: #9f1239;
}

/* Tombol Try */
.try-button {
  padding: 6px 12px;
  font-size: 12px;
  color: #ffffff;
  background: #2563eb;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.try-button:hover {
  background: #1e40af;
}

/* Endpoint Info */
.endpoint-info {
  padding: 16px;
}

.endpoint-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
}

.endpoint-path {
  font-family: monospace;
  background: var(--input-color);
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 8px;
  overflow-x: auto;
  color: var(--texttra-color);
  white-space: nowrap;
}

.endpoint-desc {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 12px;
}

/* Meta Information */
.endpoint-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.endpoint-tag {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.endpoint-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.endpoint-status.active {
  background: #dcfce7;
  color: #166534;
}
.endpoint-status.error {
  background: #ffe4e6;
  color: #9f1239;
}

.no-data {
  text-align: center;
  font-size: 16px;
  color: #64748b;
  margin-top: 20px;
}

/* Responsif */
@media (max-width: 768px) {
  .endpoint-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .search-bar {
    width: 100%;
  }
}
</style>
