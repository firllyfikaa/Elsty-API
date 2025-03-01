<template>
  <div class="account-container">
    <h2 class="account-title">Account Settings</h2>
    <div class="profile-card">
      <!-- Avatar -->
      <img :src="avatarUrl || '/profile.png'" alt="User Avatar" class="profile-avatar" />
      <!-- Area Drag & Drop di bawah Avatar -->
      <div class="drop-zone" @dragover.prevent @drop="handleDrop" @click="triggerFileInput">
        <p>Click to upload or drag and drop <span class="drop-span"><br> PNG, JPG, JPEG (MAX. 800x400px)</span></p>
      </div>
      <!-- Input File (Hidden) -->
      <input type="file" ref="fileInput" @change="uploadAvatar" hidden />
      <div class="user-info">
        <div class="input-group">
          <label>Username</label>
          <input v-model="username" type="text" placeholder="Enter your username" />
        </div>
        <div class="input-group">
          <label>Nomor Telepon</label>
          <input v-model="phone" type="number" placeholder="Enter your phone number" />
        </div>
        <div class="input-group">
          <label>Email</label>
          <input v-model="email" type="text" disabled placeholder="Your email address" />
        </div>
      </div>
      <!-- Tombol Aksi -->
      <div class="action-buttons">
        <button class="save-btn" @click="updateProfile">Save Changes</button>
        <button class="reset-btn" @click="resetPassword">Reset Password</button>
        <button class="logout-btn" @click="logoutUser">Logout</button>
      </div>
    </div>
    <!-- Notification -->
    <transition name="fade">
      <div v-if="showNotification" class="copy-notification">
        <span class="material-symbols-rounded">check_circle</span>
        {{ notificationMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";
import { useRouter } from "vue-router";

export default {
  setup() {
    const avatarUrl = ref(null);
    const username = ref("");
    const phone = ref("");
    const email = ref("");
    const notificationMessage = ref("");
    const showNotification = ref(false); // Variabel untuk menampilkan notifikasi
    const isUploading = ref(false);
    const fileInput = ref(null);
    const router = useRouter();

    // Fetch user data
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        username.value = user.user_metadata?.username || "";
        phone.value = user.user_metadata?.phone || "";
        email.value = user.email;
        avatarUrl.value = user.user_metadata?.avatar_url || "/profile.png";
      }
    };

    // Upload avatar
    const uploadAvatar = async (event) => {
      const file = event.target.files[0] || event.dataTransfer?.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        triggerNotification("Ukuran file terlalu besar! Maksimal 5MB.");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        triggerNotification("Format file tidak didukung! Gunakan PNG atau JPG.");
        return;
      }

      isUploading.value = true;
      try {
        const filePath = `avatars/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from("Avatar").upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });
        if (error) throw error;

        const { data: urlData, error: urlError } = supabase.storage.from("Avatar").getPublicUrl(filePath);
        if (urlError) throw urlError;

        avatarUrl.value = encodeURI(urlData.publicUrl);
        await supabase.auth.updateUser({ data: { avatar_url: avatarUrl.value } });
        triggerNotification("Foto profil berhasil diperbarui!");
        setTimeout(() => location.reload(), 1200); // Reload setelah 1.2 detik
      } catch (error) {
        triggerNotification(`Terjadi kesalahan: ${error.message}`);
      } finally {
        isUploading.value = false;
      }
    };

    // Update profile
    const updateProfile = async () => {
      const { error } = await supabase.auth.updateUser({
        data: { username: username.value, phone: phone.value },
      });
      if (error) {
        triggerNotification("Gagal menyimpan perubahan!");
      } else {
        triggerNotification("Perubahan berhasil disimpan!");
        setTimeout(() => location.reload(), 1200); // Reload setelah 1.2 detik
      }
    };

    // Reset password
    const resetPassword = async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email.value);
      if (error) {
        triggerNotification("Gagal mengirim reset password!");
      } else {
        triggerNotification("Email reset password telah dikirim!");
      }
    };

    // Logout
    const logoutUser = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        triggerNotification("Gagal logout!");
      } else {
        triggerNotification("Logout berhasil! Memuat ulang...");
        setTimeout(() => location.reload(), 1000); // Reload setelah 1 detik
      }
    };

    // Handle drop event
    const handleDrop = (event) => {
      event.preventDefault();
      uploadAvatar(event);
    };

    // Trigger file input
    const triggerFileInput = () => {
      fileInput.value.click();
    };

    // Fungsi untuk menampilkan notifikasi
    const triggerNotification = (message) => {
      notificationMessage.value = message;
      showNotification.value = true;

      // Sembunyikan notifikasi setelah 3 detik
      setTimeout(() => {
        showNotification.value = false;
      }, 3000);
    };

    onMounted(fetchUserData);

    return {
      avatarUrl,
      username,
      phone,
      email,
      uploadAvatar,
      updateProfile,
      resetPassword,
      logoutUser,
      handleDrop,
      triggerFileInput,
      fileInput,
      notificationMessage,
      showNotification,
      isUploading,
    };
  },
};
</script>

<style scoped>
/* Global Styles */
.account-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: var(--text-color);
}

.account-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 20px;
}

/* Avatar */
.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  border: 3px solid #e0e0e0;
  transition: border-color 0.3s;
}
.profile-avatar:hover {
  border-color: #4f46e5;
}

/* Drag & Drop Zone */
.drop-zone {
  width: 100%;
  padding: 15px;
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s;
  margin-bottom: 20px;
}
.drop-zone:hover {
  background: rgba(0, 0, 0, 0.05);
  border-color: #4f46e5;
}
.drop-span {
  color: #6b7280;
  font-size: 12px;
}

/* Form */
.user-info {
  margin-top: 20px;
}
.input-group {
  margin-bottom: 15px;
  text-align: left;
}
label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--text-color);
}
input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: var(--input-color);
  color: var(--text-color);
  transition: border-color 0.3s;
}
input:disabled {
  background-color: var(--input-color) !important;
  color: var(--text-color) !important;
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: auto;
}
input:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 5px rgba(79, 70, 229, 0.2);
}
input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}
.save-btn, .reset-btn, .logout-btn {
  padding: 12px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}
.save-btn {
  background-color: #4f46e5;
}
.save-btn:hover {
  background-color: #4338ca;
}
.reset-btn {
  background-color: #ef4444;
}
.reset-btn:hover {
  background-color: #dc2626;
}
.logout-btn {
  background-color: #1e293b;
}
.logout-btn:hover {
  background-color: #0f172a;
}

/* Notification */
.copy-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

/* Transition Animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 600px) {
  .account-container {
    padding: 20px;
    margin: 20px 10px; /* Tambahkan margin kiri dan kanan */
  }
  .profile-avatar {
    width: 100px;
    height: 100px;
  }
  .account-title {
    font-size: 20px;
  }
  input {
    padding: 10px;
  }
  .copy-notification {
    bottom: 10px;
    right: 10px;
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>