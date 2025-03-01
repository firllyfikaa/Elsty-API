<template>
  <div class="layout">
    <!-- Loading Screen -->
    <div v-if="isLoading" class="loading-screen">
      <div class="spinner"></div>
    </div>
    <!-- Sidebar -->
    <SidebarMenu
      v-bind:isCollapsed="isSidebarCollapsed"
      @update:isCollapsed="isSidebarCollapsed = $event"
    />
    
    <!-- Sidebar -->
    <SidebarMenu
      v-bind:isCollapsed="isSidebarCollapsed"
      @update:isCollapsed="isSidebarCollapsed = $event"
      :isDarkMode="isDarkMode"
      @toggle-dark-mode="toggleDarkMode"
    />

    <!-- Konten Utama -->
    <main
      class="main-content"
      :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
    >
      <router-view />

      
    </main>
  </div>
  <!-- Footer -->
      <FooterMenu 
      class="footer-content"
      :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
      />
</template>
<script>
import { nextTick, ref, onMounted } from "vue"; // Tambahkan onMounted di sini
import SidebarMenu from "./components/SidebarMenu.vue";
import FooterMenu from "./components/FooterMenu.vue";

export default {
  components: {
    SidebarMenu,
    FooterMenu,
  },
  setup() {
    const isSidebarCollapsed = ref(true);
    const isLoading = ref(true);
    const isDarkMode = ref(false);
    
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        isSidebarCollapsed.value = false;
      } else {
        isSidebarCollapsed.value = true;
      }
    };

    onMounted(() => {
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
    });

    // Simulate loading screen
    nextTick(() => {
      setTimeout(() => {
        isLoading.value = false;
      }, 1600);
    });

    // Check dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      isDarkMode.value = JSON.parse(savedDarkMode);
      document.documentElement.classList.toggle("dark-mode", isDarkMode.value);
    }

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      document.documentElement.classList.toggle("dark-mode", isDarkMode.value);
      localStorage.setItem("darkMode", isDarkMode.value);
    };

    return { isSidebarCollapsed, isLoading, isDarkMode, toggleDarkMode };
  },
};
</script>

<style scoped src="./assets/style.css">

</style>
