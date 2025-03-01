<template>
  <div class="server-monitor">
    <header class="header">
      <h1>Monitoring</h1>
      <div class="status-container">
 
      </div>
    </header>

    <div class="stats-container">
      <h2>Server Statistics</h2>
      <table class="stats-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Graph</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Requests</td>
            <td>{{ totalRequests }}</td>
            <td>
              <div class="bar" :style="{ width: getBarWidth(totalRequests) }"></div>
            </td>
          </tr>
          <tr>
            <td>Yesterday's Requests</td>
            <td>{{ yesterdayRequests }}</td>
            <td>
              <div class="bar" :style="{ width: getBarWidth(yesterdayRequests) }"></div>
            </td>
          </tr>
          <tr>
            <td>Memory Usage</td>
            <td>{{ memoryUsage }}%</td>
            <td>
              <div class="bar" :style="{ width: `${memoryUsage}%` }"></div>
            </td>
          </tr>
          <tr>
            <td>CPU Usage</td>
            <td>{{ cpuUsage }}%</td>
            <td>
              <div class="bar" :style="{ width: `${cpuUsage}%` }"></div>
            </td>
          </tr>
          <tr>
            <td>Request Rate</td>
            <td>{{ requestRate }}/sec</td>
            <td>
              <div class="bar" :style="{ width: getBarWidth(requestRate) }"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="charts-container">
      <div class="chart-card">
        <h3>Memory Usage</h3>
        <canvas ref="memoryChart"></canvas>
      </div>
      <div class="chart-card">
        <h3>CPU Usage</h3>
        <canvas ref="cpuChart"></canvas>
      </div>
      <div class="chart-card">
        <h3>Request Rate (Realtime)</h3>
        <canvas ref="requestChart"></canvas>
      </div>
    </div>

    <div class="logs-container">
      <h2>Recent Logs</h2>
      <table class="logs-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Method</th>
            <th>URL</th>
            <th>Status</th>
            <th>Duration</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(log, index) in logs" :key="index" :class="getStatusClass(log.status)">
            <td>{{ formatDate(log.timestamp) }}</td>
            <td>{{ log.method }}</td>
            <td class="url-cell">{{ log.url }}</td>
            <td>{{ log.status }}</td>
            <td>{{ log.duration }}</td>
            <td>{{ log.ip }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="refresh-container">
      <button @click="fetchLogs" class="refresh-button">Refresh Data</button>
      <div class="last-updated">Last updated: {{ lastUpdated }}</div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: "ServerMonitor",
  data() {
    return {
      isOnline: true,
      totalRequests: 0,
      yesterdayRequests: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      requestRate: 0,
      logs: [],
      lastUpdated: "-",
      apiUrl: process.env.NODE_ENV === 'production' 
        ? '/api/logs'
        : 'http://localhost:3000/api/logs',
      chartInstances: {
        memory: null,
        cpu: null,
        request: null
      },
      refreshInterval: null
    };
  },
  mounted() {
    this.initCharts(); // Inisialisasi chart pertama kali
    this.fetchLogs(); // Ambil data pertama kali
    this.startAutoRefresh(); // Mulai auto-refresh
  },
  beforeUnmount() {
    // Hancurkan chart saat komponen di-unmount
    Object.values(this.chartInstances).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.stopAutoRefresh(); // Hentikan auto-refresh
  },
  methods: {
    async fetchLogs() {
      try {
        const response = await fetch(this.apiUrl);
        if (!response.ok) throw new Error("Network error");

        const data = await response.json();
        this.updateData(data); // Update data dari API
        this.isOnline = true;
        this.lastUpdated = this.formatDate(new Date());
      } catch (error) {
        console.error("Error fetching logs:", error);
        this.isOnline = false;
      }
    },
    
    updateData(data) {
      this.totalRequests = data.totalRequests;
      this.yesterdayRequests = data.yesterdayRequests;
      this.memoryUsage = parseFloat(data.memoryUsage);
      this.cpuUsage = parseFloat(data.cpuUsage);
      this.requestRate = data.requestRate;
      this.logs = data.logs;

      // Update chart dengan data baru
      this.updateChartData('memory', this.memoryUsage);
      this.updateChartData('cpu', this.cpuUsage);
      this.updateRequestRate(this.requestRate);
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);
    },

    getBarWidth(value, isMs = false) {
      const max = isMs ? 5000 : Math.max(value * 2, 100);
      const width = Math.min((value / max) * 100, 100);
      return width + "%";
    },

    getStatusClass(status) {
      if (status >= 500) return "status-error";
      if (status >= 400) return "status-warning";
      if (status >= 300) return "status-redirect";
      if (status >= 200) return "status-success";
      return "";
    },

    initCharts() {
      const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 500,
          easing: 'easeOutQuart'
        },
        elements: {
          point: {
            radius: 3,
            hoverRadius: 5
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: '#eee'
            },
            title: {
              display: true,
              text: 'Percentage (%)'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              callback: (val, index) => index + 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      };

      // Memory Chart
      this.chartInstances.memory = new Chart(this.$refs.memoryChart, {
        type: 'line',
        data: {
          labels: Array(20).fill(''),
          datasets: [{
            label: 'Memory Usage',
            data: Array(20).fill(0), // Inisialisasi dengan 20 nilai 0
            borderColor: '#4CAF50',
            tension: 0.3,
            fill: true,
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#4CAF50'
          }]
        },
        options: commonOptions
      });

      // CPU Chart
      this.chartInstances.cpu = new Chart(this.$refs.cpuChart, {
        type: 'line',
        data: {
          labels: Array(20).fill(''),
          datasets: [{
            label: 'CPU Usage',
            data: Array(20).fill(0), // Inisialisasi dengan 20 nilai 0
            borderColor: '#2196F3',
            tension: 0.3,
            fill: true,
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#2196F3'
          }]
        },
        options: commonOptions
      });

      // Request Rate Chart
      this.chartInstances.request = new Chart(this.$refs.requestChart, {
        type: 'bar',
        data: {
          labels: Array(10).fill('').map((_, i) => `Req ${i + 1}`),
          datasets: [{
            label: 'Requests/s',
            data: Array(10).fill(0), // Inisialisasi dengan 10 nilai 0
            backgroundColor: '#FF9800',
            borderColor: '#FF9800',
            borderWidth: 1,
            barPercentage: 0.8
          }]
        },
        options: {
          ...commonOptions,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { 
                stepSize: 1,
                precision: 0
              }
            }
          }
        }
      });
    },

    updateChartData(chartName, newValue) {
      const chart = this.chartInstances[chartName];
      if (chart) {
        chart.data.datasets[0].data.push(newValue);
        if (chart.data.datasets[0].data.length > 20) {
          chart.data.datasets[0].data.shift();
        }
        
        // Update labels dengan timestamp
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        
        chart.data.labels.push(time);
        if (chart.data.labels.length > 20) {
          chart.data.labels.shift();
        }
        
        chart.update();
      }
    },

    updateRequestRate(newValue) {
      const chart = this.chartInstances.request;
      if (chart) {
        chart.data.datasets[0].data.push(newValue);
        if (chart.data.datasets[0].data.length > 10) {
          chart.data.datasets[0].data.shift();
        }
        
        // Update labels
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        
        chart.data.labels.push(time);
        if (chart.data.labels.length > 10) {
          chart.data.labels.shift();
        }
        
        chart.update();
      }
    },

    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        this.fetchLogs();
      }, 2000); // Refresh setiap 2 detik
    },

    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    }
  }
};
</script>

<style scoped>
.server-monitor {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-container {
  margin-bottom: 20px;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table th, .stats-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.stats-table th {
  background-color: var(--dash-color);
}

.bar {
  height: 12px;
  background-color: #4285f4;
  border-radius: 6px;
}

.logs-container {;
  padding: 20px;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
}

.logs-table th, .logs-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.logs-table th {
  background-color: var(--dash-color);
}

.refresh-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.refresh-button {
  padding: 10px 16px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-button:hover {
  background-color: #3367d6;
}

.last-updated {
  font-size: 14px;
  color: #5f6368;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: var(--dash-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  position: relative;
}

.chart-card h3 {
  color: var(--text-color);
  font-size: 1.2em;
  margin-bottom: 15px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

canvas {
  width: 100%!important;
  min-height: 200px !important;
  max-height: 1200px !important;
  transition: opacity 0.3s ease;
}

.stats-table .bar {
  transition: width 0.5s ease-in-out;
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    height: auto;
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .stats-table, .logs-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
