<template>
  <div class="register-container">
    <div class="register-box">
      <header class="register-header">
        <h1 class="register-title">Daftar Akun</h1>
        <p class="register-subtitle">Silakan buat akun baru</p>
      </header>

      <form class="register-form" @submit.prevent="register">
        <div class="input-group">
          <label for="email">Email:</label>
          <input v-model="email" type="email" id="email" required />
          <p class="error-message" v-if="errorMessageEmail">{{ errorMessageEmail }}</p>
        </div>

        <div class="input-group">
          <label for="password">Password:</label>
          <input v-model="password" type="password" id="password" required />
          <small v-if="password.length > 0 && password.length < 6" class="warning">
            Password minimal 6 karakter
          </small>
          <p class="error-message" v-if="errorMessagePassword">{{ errorMessagePassword }}</p>
        </div>

        <div class="input-group">
          <label for="confirm-password">Konfirmasi Password:</label>
          <input v-model="confirmPassword" type="password" id="confirm-password" required />
          <p class="error-message" v-if="errorMessageConfirmPassword">{{ errorMessageConfirmPassword }}</p>
        </div>

        <button class="register-button" :disabled="isLoading || password.length < 6 || confirmPassword.length < 6">
          <span v-if="!isLoading">DAFTAR</span>
          <span v-else class="loading-icon">
            <i class="fas fa-spinner animate-spin"></i> Loading...
          </span>
        </button>
      </form>

      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      <p class="success-message" v-if="successMessage">{{ successMessage }}</p>

      <p class="login-prompt">Sudah punya akun? 
        <router-link to="/auth/login" class="login-link">Login di sini</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../supabase';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const errorMessageEmail = ref('');
    const errorMessagePassword = ref('');
    const errorMessageConfirmPassword = ref('');
    const errorMessage = ref('');
    const successMessage = ref('');
    const isLoading = ref(false);

    const register = async () => {
      if (password.value.length < 6) {
        errorMessagePassword.value = "Password minimal 6 karakter!";
      } else if (confirmPassword.value.length < 6) {
        errorMessageConfirmPassword.value = "Konfirmasi Password minimal 6 karakter!";
      } else if (password.value !== confirmPassword.value) {
        errorMessage.value = "Password dan Konfirmasi Password tidak sama!";
      } else {
        isLoading.value = true;
        errorMessage.value = "";
        errorMessageEmail.value = "";
        errorMessagePassword.value = "";
        errorMessageConfirmPassword.value = "";
        successMessage.value = "";

        const { error } = await supabase.auth.signUp({
          email: email.value,
          password: password.value
        });

        if (error) {
          errorMessage.value = error.message;
        } else {
          successMessage.value = "Registrasi berhasil! Silakan cek email untuk verifikasi.";
          setTimeout(() => (window.location.href = '/auth/login'), 2000);
        }

        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      confirmPassword,
      errorMessageEmail,
      errorMessagePassword,
      errorMessageConfirmPassword,
      register,
      errorMessage,
      successMessage,
      isLoading
    }
  }
};
</script>

<style scoped>
/* 🔹 Struktur & Tata Letak */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--bg-color, #f5f5f5);
  overflow-y: auto;
}

/* 🔹 Box Registrasi */
.register-box {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: var(--dash-color, white);
  text-align: center;
  max-width: 400px;
  width: 100%;
  margin-bottom: 20px;
}

/* 🔹 Responsif */
@media (max-width: 768px) {
  .register-box {
    width: 95%;
    padding: 25px;
  }
}

/* 🔹 Header */
.register-title {
  font-size: 24px;
  font-weight: bold;
}

.register-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

/* 🔹 Form */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  margin-bottom: 4px;
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
  box-shadow: 0 0 4px rgba(79, 70, 229, 0.4);
}

/* 🔹 Tombol Register */
.register-button {
  padding: 10px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.register-button:hover {
  background-color: #3b3b98;
}

.register-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 🔹 Pesan error & sukses */
.error-message {
  color: red;
  font-size: 12px;
}

.success-message {
  color: green;
  font-size: 12px;
}

/* 🔹 Link Login */
.login-prompt {
  margin-top: 15px;
  font-size: 13px;
  color: #666;
}

.login-link {
  color: #4f46e5;
  font-weight: bold;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

/* 🔹 Responsive */
@media (max-width: 768px) {
  .register-box {
    width: 95%;
    padding: 25px;
  }
}
</style>