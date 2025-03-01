<template>
  <div class="reset-password-container">
    <div class="reset-box">
      <header class="reset-header">
        <h1 class="reset-title">Reset Password</h1>
        <p class="reset-subtitle">Masukkan email Anda untuk mengatur ulang password.</p>
      </header>

      <!-- 🔹 Form Reset Password -->
      <form @submit.prevent="resetPassword" class="reset-form">
        <div class="input-group">
          <label for="email">Email:</label>
          <input v-model="email" type="email" id="email" required />
        </div>

        <button class="reset-button" :disabled="isLoading">
          <span v-if="!isLoading">Kirim Email Reset</span>
          <span v-else class="loading-icon">
            <i class="fas fa-spinner animate-spin"></i> Mengirim...
          </span>
        </button>
      </form>

      <p v-if="message" :class="isError ? 'error-message' : 'success-message'">{{ message }}</p>

      <p class="back-login">Sudah ingat password? 
        <router-link to="/auth/login" class="login-link">Login di sini</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { supabase } from "../supabase";

export default {
  setup() {
    const email = ref("");
    const message = ref("");
    const isError = ref(false);
    const isLoading = ref(false);

    const resetPassword = async () => {
      isLoading.value = true;
      message.value = "";

      const { error } = await supabase.auth.resetPasswordForEmail(email.value);

      if (error) {
        message.value = error.message;
        isError.value = true;
      } else {
        message.value = "Email untuk reset password telah dikirim!";
        isError.value = false;
      }

      isLoading.value = false;
    };

    return { email, resetPassword, message, isError, isLoading };
  }
};
</script>

<style scoped>
/* 🔹 Pastikan tampilan fullscreen */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 🔹 Fullscreen Container */
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  background-color: var(--bg-color, #f5f5f5);
  
}

/* 🔹 Perbesar form reset password */
.reset-box {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: var(--dash-color, white);
  text-align: center;
  color: var(--text-color);
  width: 100%;
  max-width: 500px;
}

/* 🔹 Header */
.reset-title {
  font-size: 2rem;
  font-weight: 600;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.reset-subtitle {
  font-size: 0.875rem;
  color: var(--texttra-color, #666);
  margin-bottom: 20px;
}

/* 🔹 Form */
.reset-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 🔹 Input fields */
.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-size: 0.875rem;
  color: var(--texttra-color, #333);
  margin-bottom: 5px;
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

/* 🔹 Tombol Reset */
.reset-button {
  padding: 12px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s;
}

.reset-button:hover {
  background-color: #3b3b98;
  transform: scale(1.05);
}

.reset-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 🔹 Loading Icon */
.loading-icon {
  font-size: 1.2em;
  animation: spin 1s infinite linear;
}

/* 🔹 Pesan Error & Sukses */
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.success-message {
  color: green;
  font-size: 14px;
  margin-top: 10px;
}

/* 🔹 Link Login */
.back-login {
  margin-top: 20px;
  font-size: 14px;
}

.login-link {
  color: #4f46e5;
  font-weight: bold;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

/* 🔹 Animasi Spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 🔹 Responsif */
@media (max-width: 768px) {
  .reset-box {
    width: 90%;
    padding: 30px;
  }
}
</style>