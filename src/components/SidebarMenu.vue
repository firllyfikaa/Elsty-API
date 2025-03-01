<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }" ref="sidebar">
    <!-- Tombol hamburger -->
    <button
      v-if="isMobile && isCollapsed"
      class="sidebar-menu-button"
      @click="toggleSidebar"
    >
      <span class="material-symbols-rounded">menu</span>
    </button>

    <!-- Header -->
    <header class="sidebar-header">
      <router-link to="/account" class="header-logo">
        <img :src="userAvatar || '/profile.png'" alt="User Avatar" class="user-avatar" />
      </router-link>
      <button class="sidebar-toggler" @click="toggleSidebar">
        <span class="material-symbols-rounded">chevron_left</span>
      </button>
    </header>

    <!-- Navigasi -->
    <nav class="sidebar-nav">
      <ul class="nav-list primary-nav">
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <span class="material-symbols-rounded">dashboard</span>
            <span class="nav-label" v-if="!isCollapsed">Dashboard</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/account" class="nav-link">
            <span class="material-symbols-rounded">account_circle</span>
            <span class="nav-label" v-if="!isCollapsed">Akun</span>
          </router-link>
        </li>
        <li class="nav-item dropdown-container" :class="{ open: isDropdownOpen }">
          <a href="#" class="nav-link dropdown-toggle" @click="toggleDropdown">
            <span class="material-symbols-rounded">local_library</span>
            <span class="nav-label" v-if="!isCollapsed">Endpoint</span>
            <span class="dropdown-icon material-symbols-rounded" v-if="!isCollapsed">
              keyboard_arrow_down
            </span>
          </a>
          <ul class="dropdown-menu" ref="dropdownMenu">
            <li class="nav-item">
              <router-link to="/endpoint/ai" class="nav-link">AI Endpoint</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/endpoint/downloads" class="nav-link">Downloads Endpoint</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/endpoint/search" class="nav-link">Search Endpoint</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/endpoint/anime" class="nav-link">Anime Endpoint</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/endpoint/random" class="nav-link">Random Endpoint</router-link>
            </li>
          </ul>
        </li>
        <li class="nav-item">
          <router-link to="/changelog" class="nav-link">
            <span class="material-symbols-rounded">calendar_today</span>
            <span class="nav-label" v-if="!isCollapsed">Changelog</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/ytdl" class="nav-link">
             <span class="fab fa-youtube icon-youtube"></span>
            <span class="nav-label" v-if="!isCollapsed">YouTube</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/tiktok" class="nav-link">
            <span class="material-symbols-rounded">audiotrack</span>
            <span class="nav-label" v-if="!isCollapsed">Tiktok</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/music" class="nav-link">
            <span class="material-symbols-rounded">play_arrow</span>
            <span class="nav-label" v-if="!isCollapsed">Music</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/faq" class="nav-link">
            <span class="material-symbols-rounded">help_outline</span>
            <span class="nav-label" v-if="!isCollapsed">Faq</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/contributor" class="nav-link">
            <span class="material-symbols-rounded">group</span>
            <span class="nav-label" v-if="!isCollapsed">Contributor</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/monitor" class="nav-link">
            <span class="material-symbols-rounded">monitoring</span>
            <span class="nav-label" v-if="!isCollapsed">Monitor</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/privacy-policy" class="nav-link">
            <span class="material-symbols-rounded">shield_lock</span>
            <span class="nav-label" v-if="!isCollapsed">Privacy Policy</span>
          </router-link>
        </li>
        <li class="nav-item">
          <a href="https://whatsapp.com/channel/0029Vaq1uFeCRs1pLHKlmK0V" class="nav-link" target="_blank" rel="noopener noreferrer">
            <span class="fab fa-whatsapp icon-large"></span>
            <span class="nav-label" v-if="!isCollapsed">WhatsApp Channel</span>
          </a>
        </li>
      </ul>
    </nav>
    <!-- Tombol Dark Mode -->
    <button class="dark-mode-toggle" @click="$emit('toggle-dark-mode')">
      <span class="icon material-symbols-rounded">{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</span>
    </button>
  </aside>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { supabase } from "../supabase"; // Pastikan path sesuai

export default {
  props: {
    isDarkMode: Boolean,
    isCollapsed: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const userAvatar = ref(null);
    const isMobile = ref(window.innerWidth < 768);
    const isDropdownOpen = ref(false);
    const dropdownMenu = ref(null);

    // Mengambil avatar pengguna dari Supabase
    const fetchUserAvatar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      userAvatar.value = user?.user_metadata?.avatar_url || null;
    };

    const checkMobile = () => {
      isMobile.value = window.innerWidth < 768;
      if (isMobile.value) emit("update:isCollapsed", true);
    };

    onMounted(() => {
      fetchUserAvatar();
      window.addEventListener("resize", checkMobile);
      document.addEventListener("click", closeDropdownOnClickOutside);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("click", closeDropdownOnClickOutside);
    });

    const toggleSidebar = () => {
      emit("update:isCollapsed", !props.isCollapsed);
    };

    const toggleDropdown = async (event) => {
      event.preventDefault();
      isDropdownOpen.value = !isDropdownOpen.value;

      await nextTick();
      if (dropdownMenu.value) {
        dropdownMenu.value.style.height = isDropdownOpen.value ? `${dropdownMenu.value.scrollHeight}px` : "0";
      }
    };

    const closeDropdownOnClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        isDropdownOpen.value = false;
        if (dropdownMenu.value) dropdownMenu.value.style.height = "0";
      }
    };

    return { userAvatar, isMobile, toggleSidebar, isDropdownOpen, toggleDropdown, dropdownMenu };
  },
};
</script>

<style>
.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
.dropdown-menu {
  overflow: hidden;
  height: 0;
  transition: height 0.3s ease-out;
}
.dropdown-container.open .dropdown-menu {
  height: auto;
}
/* Sidebar Styling */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 270px;
  height: 100vh;
  background: #151A2D;
  transition: all 0.4s ease;
}

.sidebar.collapsed {
  width: 85px;
}

.sidebar .sidebar-header {
  display: flex;
  position: relative;
  padding: 25px 20px;
  align-items: center;
  justify-content: space-between;
}

.sidebar-header .header-logo img {
  width: 46px;
  height: 46px;
  display: block;
  object-fit: contain;
  border-radius: 50%;
}

.sidebar-header .sidebar-toggler {
  position: absolute;
  right: 20px;
  height: 35px;
  width: 35px;
  color: #151A2D;
  border: none;
  cursor: pointer;
  display: flex;
  background: #EEF2FF;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.4s ease;
}

.sidebar.collapsed .sidebar-header .sidebar-toggler {
  transform: translate(-4px, 65px);
}

.sidebar-header .sidebar-toggler span {
  font-size: 1.75rem;
  transition: transform 0.4s ease;
}

.sidebar.collapsed .sidebar-header .sidebar-toggler span {
  transform: rotate(180deg);
}

.sidebar-header .sidebar-toggler:hover {
  background: #d9e1fd;
}

/* Sidebar Menu and Navigation */
.sidebar-nav .nav-list {
  list-style: none;
  display: flex;
  gap: 4px;
  padding: 0 15px;
  flex-direction: column;
  transform: translateY(15px);
  transition: transform 0.4s ease;
}

.sidebar .sidebar-nav .primary-nav {
  overflow-y: auto;
  scrollbar-width: thin;
  padding-bottom: 20px;
  height: calc(100vh - 227px);
  scrollbar-color: transparent transparent;
}

.sidebar .sidebar-nav .primary-nav:hover {
  scrollbar-color: #EEF2FF transparent;
}

.sidebar.collapsed .sidebar-nav .primary-nav {
  overflow: unset;
  transform: translateY(65px);
}

.sidebar-nav .nav-item .nav-link {
  color: #fff;
  display: flex;
  gap: 12px;
  white-space: nowrap;
  border-radius: 8px;
  padding: 11px 15px;
  align-items: center;
  text-decoration: none;
  border: 1px solid #151A2D;
  transition: all 0.4s ease;
}

.sidebar-nav .nav-item:is(:hover, .open)>.nav-link:not(.dropdown-title) {
  color: #151A2D;
  background: #EEF2FF;
}

.sidebar .nav-link .nav-label {
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .nav-link :where(.nav-label, .dropdown-icon) {
  opacity: 0;
  pointer-events: none;
}

.sidebar.collapsed .nav-link .dropdown-icon {
  transition: opacity 0.3s ease;
}

.sidebar-nav .secondary-nav {
  position: absolute;
  bottom: 35px;
  width: 100%;
  background: #151A2D;
}

.sidebar-nav .nav-item {
  position: relative;
}

/* Dropdown Styling */
.sidebar-nav .dropdown-container .dropdown-icon {
  margin: 0 -4px 0 auto;
  transition: transform 0.4s ease;
}

.sidebar-nav .dropdown-container.open .dropdown-icon {
  transform: rotate(180deg);
}

.sidebar-nav .dropdown-menu {
  height: 0;
  overflow-y: hidden;
  list-style: none;
  padding-left: 15px;
  transition: height 0.4s ease;
}

.sidebar.collapsed .dropdown-menu {
  position: absolute;
  top: -10px;
  left: 100%;
  opacity: 0;
  height: auto !important;
  padding-right: 10px;
  overflow-y: unset;
  pointer-events: none;
  border-radius: 0 10px 10px 0;
  background: #151A2D;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.sidebar.collapsed .dropdown-menu:has(.dropdown-link) {
  padding: 7px 10px 7px 24px;
}

.sidebar.collapsed .nav-item:hover>.dropdown-menu {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(12px);
}

.sidebar.collapsed .nav-item:hover>.dropdown-menu:has(.dropdown-link) {
  transform: translateY(10px);
}

.dropdown-menu .nav-item .nav-link {
  color: #F1F4FF;
  padding: 9px 15px;
}

.sidebar.collapsed .dropdown-menu .nav-link {
  padding: 7px 15px;
}

.dropdown-menu .nav-item .nav-link.dropdown-title {
  display: none;
  color: #fff;
  padding: 9px 15px;
}

.dropdown-menu:has(.dropdown-link) .nav-item .dropdown-title {
  font-weight: 500;
  padding: 7px 15px;
}

.sidebar.collapsed .dropdown-menu .nav-item .dropdown-title {
  display: block;
}

/* Tombol Dark Mode */
.sidebar.collapsed .dark-mode-toggle {
  display: none;
}
.dark-mode-toggle {
  position: absolute;
  bottom: 75px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: var(--primary-color);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode-toggle:hover {
  background: #4338ca; /* Warna lebih gelap saat hover */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Efek shadow lebih tebal */
}

.dark-mode-toggle .icon {
  transition: transform 0.3s ease;
}

.dark-mode-toggle:hover .icon {
  transform: scale(1.2); /* Animasi zoom pada ikon saat hover */
}

/* Sidebar Menu Button (Mobile) */
.sidebar-menu-button {
  position: fixed;
  right: 20px;
  top: 20px;
  height: 40px;
  width: 42px;
  z-index: 5;
  color: #F1F4FF;
  background: #151A2D;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
}

.sidebar-menu-button span {
  font-size: 1.75rem;
}

/* Responsive media query for small screens */
@media (max-width: 768px) {
  .sidebar {
    width: 270px;
  }

  .sidebar.collapsed {
    width: 270px;
    left: -270px;
  }

  .sidebar .nav-link :where(.nav-label, .dropdown-icon) {
    opacity: 1;
    pointer-events: auto;
  }

  .sidebar.collapsed .sidebar-header .sidebar-toggler {
    transform: none;
  }

  .sidebar.collapsed .sidebar-nav .primary-nav {
    transform: translateY(15px);
  }
}
.icon-large {
  font-size: 23px;
  margin-right: 5px;
}
.icon-youtube {
  font-size: 20px;
}
</style>
