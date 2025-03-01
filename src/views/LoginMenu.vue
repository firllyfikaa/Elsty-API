<template>
  <div class="login-container">
    <div class="login-box">
      <header class="login-header">
        <h1 class="login-title">Selamat Datang!</h1>
        <p class="login-subtitle">Silakan login ke akun Anda</p>
      </header>

      <div class="social-login">
        <button class="google-button" @click="loginWithGoogle">
          <img src="/google.svg" alt="Google" /> Login dengan Google
        </button>
        <button class="discord-button" @click="loginWithDiscord">
          <img src="/discord.svg" alt="Discord" /> Login dengan Discord
        </button>
      </div>

      <div class="separator">atau</div>

      <form class="login-form" @submit.prevent="login">
        <div class="input-group">
          <label for="email">Email:</label>
          <input v-model="email" type="email" id="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password:</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="!loading">LOGIN</span>
          <span v-else class="loading-icon">
            <i class="fas fa-spinner animate-spin"></i>
          </span>
        </button>
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      </form>

      <footer class="login-footer">
        <div class="links">
          <span>Belum punya akun? <router-link to="/auth/register">DAFTAR</router-link></span>
        </div>
        <div class="links">
          <span>Lupa password? <router-link to="/reset-password">RESET PASSWORD</router-link></span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const loading = ref(false);
    const router = useRouter();

    // 🔹 Cek sesi pengguna saat komponen dimuat
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Session Data:", session, "Error:", error);
      if (session?.user) {
        router.push("/"); // Redirect jika pengguna sudah login
      }
    };

    onMounted(() => {
      checkSession();

      // 🔹 Listener untuk perubahan sesi
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          router.push("/");
          setTimeout(() => {
            location.reload();
          }, 650);
        }
      });

      onUnmounted(() => {
        listener?.subscription?.unsubscribe();
      });
    });

    // 🔹 Login Manual
    const login = async () => {
      loading.value = true;
      errorMessage.value = "";

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });

      loading.value = false;

      if (error) {
        errorMessage.value = error.message;
      } else {
        if (data?.user) {
          router.push("/");
          setTimeout(() => {
            location.reload(); // Reload setelah login untuk memastikan sesi terupdate
          }, 650);
        }
      }
    };

    // 🔹 Login dengan Google
    const loginWithGoogle = async () => {
      loading.value = true;
      errorMessage.value = "";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: "https://api.elsty.xyz" },
      });

      if (error) {
        errorMessage.value = error.message;
      } else {
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            router.push("/");
            location.reload();
          }
        }, 1500);
      }

      loading.value = false;
    };

    // 🔹 Login dengan Discord
    const loginWithDiscord = async () => {
      loading.value = true;
      errorMessage.value = "";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: { redirectTo: "https://api.elsty.xyz" },
      });

      if (error) {
        errorMessage.value = error.message;
      } else {
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            router.push("/");
            location.reload();
          }
        }, 1500);
      }

      loading.value = false;
    };

    return { email, password, login, loginWithGoogle, loginWithDiscord, errorMessage, loading };
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--bg-color, #f5f5f5);
}

.login-box {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: var(--dash-color, white);
  width: 100%;
  max-width: 400px;
}

.login-header {
  margin-bottom: 1.5rem;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 0.875rem;
  color: var(--texttra-color, #666);
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.google-button, .discord-button {
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.google-button {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
}

.discord-button {
  background-color: #5865F2;
  color: white;
}

.google-button:hover, .discord-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.google-button img, .discord-button img {
  width: 18px;
  height: 18px;
}

.separator {
  color: var(--texttra-color, #666);
  margin: 1rem 0;
  text-align: center;
  position: relative;
}

.separator::before,
.separator::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: var(--border-color, #ddd);
}

.separator::before {
  left: 0;
}

.separator::after {
  right: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-size: 0.875rem;
  color: var(--texttra-color, #333);
}

input {
  padding: 0.75rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: var(--input-color, white);
  color: var(--text-color, #333);
  transition: border-color 0.2s;
}

input:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.login-button {
  padding: 0.75rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.login-button:hover:not(:disabled) {
  background-color: #4338ca;
  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
}

.login-footer {
  margin-top: 1.5rem;
}

.links {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--texttra-color, #666);
}

.links a {
  color: #4f46e5;
  font-weight: 500;
  text-decoration: none;
  margin-left: 0.25rem;
}

.links a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-box {
    padding: 1.5rem;
  }
}
</style>
