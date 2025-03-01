import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../supabase"; // Pastikan supabase diimpor

import LoginMenu from "../views/LoginMenu.vue";
import DashboardMenu from "../views/DashboardMenu.vue";
import RegisterMenu from "../views/RegisterMenu.vue";
import ResetPassword from "../views/ResetPassword.vue";
import AccountMenu from "../views/AccountMenu.vue";
import EndpointMenu from "../views/EndpointMenu.vue";
import ChangelogMenu from "../views/ChangelogMenu.vue";
import ContributorMenu from "../views/ContributorMenu.vue";
import MusicMenu from "../views/MusicMenu.vue";
import YoutubeMenu from "../views/YoutubeMenu.vue";
import TiktokMenu from "../views/TiktokMenu.vue";
import NotFound from "../views/NotFound.vue";
import FaqMenu from "../views/FaqMenu.vue";
import PrivacyPolicy from "../views/PrivacyPolicy.vue";
import MonitorMenu from "../views/MonitorMenu.vue";

const routes = [
  { path: "/auth/login", component: LoginMenu },
  { path: "/auth/register", component: RegisterMenu },
  { path: "/reset-password", component: ResetPassword },
  { path: "/privacy-policy", component: PrivacyPolicy },
  { path: "/changelog", component: ChangelogMenu, meta: { requiresAuth: true } },
  { path: "/contributor", component: ContributorMenu, meta: { requiresAuth: true } },
  { path: "/monitor", component: MonitorMenu, meta: { requiresAuth: true } },
  { path: "/music", component: MusicMenu, meta: { requiresAuth: true } },
  { path: "/ytdl", component: YoutubeMenu, meta: { requiresAuth: true } },
  { path: "/tiktok", component: TiktokMenu, meta: { requiresAuth: true } },
  { path: "/faq", component: FaqMenu, meta: { requiresAuth: true } },
  { path: "/account", component: AccountMenu, meta: { requiresAuth: true } },
  { path: "/", component: DashboardMenu, meta: { requiresAuth: true } },
  { 
    path: "/endpoint/:type?", 
    component: EndpointMenu, 
    props: route => ({ endpointType: route.params.type }), 
    meta: { requiresAuth: true }
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard untuk proteksi halaman yang membutuhkan login
router.beforeEach(async (to, from, next) => {
  const app = document.getElementById("app");
  if (app) app.classList.add("loading");

  const { data: { user } } = await supabase.auth.getUser();

  if (to.meta.requiresAuth && !user) {
    next("/auth/login"); // Redirect ke halaman login jika belum login
  } else {
    next();
  }

  setTimeout(() => {
    if (app) app.classList.remove("loading");
  }, 500);
});

export default router;