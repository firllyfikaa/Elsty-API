<template>
  <div class="page-wrapper">
    <div class="profile-container">
      <!-- Header Section -->
      <div class="profile-header">
        <h2>Profile Settings</h2>
      </div>

      <!-- Profile Content -->
      <div class="profile-content">
        <!-- Avatar Section -->
        <div class="avatar-section">
          <img 
            :src="avatarUrl || '/profile.png'" 
            alt="Profile" 
            class="avatar-image"
          />
          <div 
            class="upload-zone"
            @dragover.prevent 
            @drop="handleDrop" 
            @click="triggerFileInput"
          >
            <div class="upload-text">
              <span class="upload-icon">⇣</span>
              <p>Drop your image here or <span class="browse-text">browse</span></p>
              <p class="upload-subtitle">PNG, JPG, JPEG (max. 5MB)</p>
            </div>
          </div>
          <input 
            type="file" 
            ref="fileInput" 
            @change="uploadAvatar" 
            class="hidden-input" 
            accept="image/*"
          />
        </div>

        <!-- Form Section -->
        <div class="form-section">
          <div class="form-group">
            <label>Username</label>
            <input 
              v-model="username" 
              type="text" 
              placeholder="Enter username"
            />
          </div>
          
          <div class="form-group">
            <label>Phone Number</label>
            <input 
              v-model="phone" 
              type="tel" 
              placeholder="Enter phone number"
            />
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input 
              v-model="email" 
              type="email" 
              disabled
            />
          </div>

          <!-- Action Buttons -->
          <div class="button-group">
            <button class="btn primary" @click="updateProfile">
              Save Changes
            </button>
            <button class="btn secondary" @click="resetPassword">
              Reset Password
            </button>
            <button class="btn outline" @click="logoutUser">
              Logout
            </button>
          </div>

          <!-- Delete Account -->
          <div class="delete-section">
            <button class="btn delete" @click="showDeleteModal = true">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <div class="warning-icon">!</div>
          <h3>Delete Account</h3>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        </div>
        <div class="modal-actions">
          <button class="btn outline" @click="showDeleteModal = false">
            Cancel
          </button>
          <button class="btn delete" @click="deleteAccount">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <transition name="fade">
      <div 
        v-if="showNotification" 
        :class="['notification', notificationStatus]"
      >
        <span class="notification-icon">
          {{ getIcon }}
        </span>
        <span class="notification-message">{{ notificationMessage }}</span>
        <button class="notification-close" @click="close">×</button>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { supabase } from "../supabase";
import { useRouter } from "vue-router";

export default {
  setup() {
    const avatarUrl = ref(null);
    const username = ref("");
    const phone = ref("");
    const email = ref("");
    const notificationMessage = ref("");
    const notificationStatus = ref("info"); 
    const showNotification = ref(false);
    const isUploading = ref(false);
    const fileInput = ref(null);
    const showDeleteModal = ref(false);
    const router = useRouter();

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (user) {
          username.value = user.user_metadata?.username || "";
          phone.value = user.user_metadata?.phone || "";
          email.value = user.email;
          avatarUrl.value = user.user_metadata?.avatar_url || "/profile.png";
        }
      } catch (error) {
        triggerNotification("Gagal memuat data pengguna", "error");
      }
    };

    // Fungsi untuk menghapus avatar lama di Supabase Storage
    const deleteOldAvatar = async (oldAvatarUrl) => {
      if (!oldAvatarUrl || oldAvatarUrl.includes("/profile.png")) {
        console.log("Avatar lama kosong atau default, tidak perlu dihapus.");
        return;
      }
    
      try {
        const filePathMatch = oldAvatarUrl.match(/avatars\/.+$/);
        if (!filePathMatch) {
          console.log("Format URL avatar tidak valid");
          return;
        }
        
        const oldFilePath = filePathMatch[0];
        console.log("Mencoba menghapus file:", oldFilePath);
    
        const { error } = await supabase.storage
          .from("Avatar")
          .remove([oldFilePath]);
    
        if (error) throw error;
        
        console.log("Avatar lama berhasil dihapus:", oldFilePath);
      } catch (error) {
        console.error("Gagal menghapus avatar lama:", error.message);
        throw error;
      }
    };
    
    // Fungsi Upload Avatar
    const uploadAvatar = async (event) => {
      const file = event.target.files[0] || event.dataTransfer?.files[0];
      if (!file) return;
    
      if (file.size > 5 * 1024 * 1024) {
        triggerNotification("Ukuran file terlalu besar! Maksimal 5MB", "warning", 4000);
        return;
      }
    
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        triggerNotification("Format file tidak didukung! Gunakan PNG atau JPG", "warning", 4000);
        return;
      }
    
      isUploading.value = true;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User tidak ditemukan");
        
        const oldAvatarUrl = user.user_metadata?.avatar_url;
        if (oldAvatarUrl) {
          await deleteOldAvatar(oldAvatarUrl)
            .catch(error => console.error("Gagal menghapus avatar lama:", error));
        }
    
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
    
        const { error: uploadError } = await supabase.storage
          .from("Avatar")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false
          });
    
        if (uploadError) throw uploadError;
    
        const { data: { publicUrl }, error: urlError } = supabase.storage
          .from("Avatar")
          .getPublicUrl(filePath);
    
        if (urlError) throw urlError;
    
        const { error: updateError } = await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        });
    
        if (updateError) throw updateError;
    
        avatarUrl.value = publicUrl;
        triggerNotification("Foto profil berhasil diperbarui!", "success", 2000);
        
        setTimeout(() => location.reload(), 2000);
      } catch (error) {
        console.error("Error dalam proses upload:", error);
        triggerNotification(`Gagal mengupload avatar: ${error.message}`, "error", 4000);
      } finally {
        isUploading.value = false;
      }
    };
    
    // Update profile
    const updateProfile = async () => {
      try {
        const { error } = await supabase.auth.updateUser({
          data: { username: username.value, phone: phone.value },
        });
        if (error) throw error;
        
        triggerNotification("Profil berhasil diperbarui!", "success", 2000);
        setTimeout(() => location.reload(), 2000);
      } catch (error) {
        console.error("Error update profile:", error);
        triggerNotification("Gagal menyimpan perubahan profil", "error", 4000);
      }
    };

    // Reset password
    const resetPassword = async () => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.value);
        if (error) throw error;
        
        triggerNotification("Email reset password telah dikirim!", "success", 3000);
      } catch (error) {
        console.error("Error reset password:", error);
        triggerNotification("Gagal mengirim email reset password", "error", 4000);
      }
    };

    // Logout
    const logoutUser = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        triggerNotification("Logout berhasil!", "success", 2000);
        setTimeout(() => location.reload(), 2000);
      } catch (error) {
        console.error("Error logout:", error);
        triggerNotification("Gagal melakukan logout", "error", 4000);
      }
    };

    // Hapus akun
    const deleteAccount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User tidak ditemukan");

        if (user.user_metadata?.avatar_url) {
          await deleteOldAvatar(user.user_metadata.avatar_url)
            .catch(error => console.error("Gagal menghapus avatar:", error));
        }

        const { error: deleteError } = await supabase
          .from("users")
          .delete()
          .match({ id: user.id });

        if (deleteError) throw deleteError;

        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;

        showDeleteModal.value = false;
        triggerNotification("Akun berhasil dihapus", "success", 2000);
        
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (error) {
        console.error("Error delete account:", error);
        triggerNotification("Gagal menghapus akun", "error", 4000);
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

    // Fungsi untuk menampilkan notifikasi yang ditingkatkan
    const triggerNotification = (message, status = "info", duration = 3000) => {
      notificationMessage.value = message;
      notificationStatus.value = status;
      showNotification.value = true;

      // Clear existing timeout
      if (window.notificationTimeout) {
        clearTimeout(window.notificationTimeout);
      }

      // Set new timeout
      window.notificationTimeout = setTimeout(() => {
        showNotification.value = false;
      }, duration);
    };

    // Lifecycle hooks
    onMounted(fetchUserData);

    // Fungsi untuk menentukan ikon berdasarkan status notifikasi
    const getIcon = computed(() => {
      switch (notificationStatus.value) {
        case "success":
          return "✓"; // Icon sukses
        case "error":
          return "✕"; // Icon error
        case "warning":
          return "!"; // Icon warning
        case "info":
          return "i"; // Icon info
        default:
          return "i"; // Default icon
      }
    });


    return {
      avatarUrl,
      username,
      phone,
      email,
      uploadAvatar,
      updateProfile,
      resetPassword,
      logoutUser,
      deleteAccount,
      handleDrop,
      triggerFileInput,
      fileInput,
      notificationMessage,
      notificationStatus,
      getIcon,
      showNotification,
      isUploading,
      showDeleteModal,
    };
  },
};
</script>

<style scoped>
/* Reset dan Variables */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


/* Page Layout */
.page-wrapper {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.profile-container {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

/* Header */
.profile-header {
  background: var(--profile-color);
  /* background: linear-gradient(to right, #4f46e5, #7c3aed); */
  padding: 2rem;
  color: var(--white);
  text-align: center;
  border-bottom: 2px solid var(--endp-color);
}

.profile-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

/* Profile Content */
.profile-content {
  padding: 2rem;
}

/* Avatar Section */
.avatar-section {
  margin-top: -4rem;
  text-align: center;
  margin-bottom: 2rem;
}

.avatar-image {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  border: 4px solid var(--white);
  box-shadow: var(--shadow-md);
  object-fit: cover;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.avatar-image:hover {
  transform: scale(1.05);
}

.upload-zone {
  padding: 1.5rem;
  border: 2px dashed var(--gray-medium);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-zone:hover {
  border-color: var(--primary-color);
}

.upload-icon {
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.upload-text {
  color: var(--texttra-color);
}

.browse-text {
  color: var(--primary-color);
  font-weight: 500;
}

.upload-subtitle {
  font-size: 0.875rem;
  color: var(--gray-dark);
  margin-top: 0.5rem;
}

/* Form Styles */
.form-section {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-dark);
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-medium);
  background: var(--input-color);
  color: var(--text-color);
  border-radius: 6px;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 5px rgba(79, 70, 229, 0.2);
}

input:disabled {
  background-color: var(--input-color) !important;
  color: var(--text-color) !important;
  opacity: 0.5;
  pointer-events: auto;
  cursor: not-allowed;
}

/* Buttons */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.primary {
  background-color: var(--primary-color);
  color: var(--white);
  box-shadow: var(--shadow-sm);
}

.primary:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-md);
}

.secondary {
  background-color: var(--secondary-color);
  color: var(--white);
}

.secondary:hover {
  opacity: 0.9;
}

.outline {
  background-color: var(--white);
  border: 1px solid var(--gray-medium);
  color: var(--gray-dark);
}

.outline:hover {
  background-color: var(--gray-light);
}

.delete {
  background-color: var(--danger-color);
  border: 1px solid var(--danger-color);
  color: var(--white);
}

.delete:hover {
  background-color: var(--white);
  color: var(--danger-color);
}

/* Delete Section */
.delete-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-medium);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}

.modal-content {
  background: var(--dash-color);
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 400px;
  width: 100%;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.warning-icon {
  width: 48px;
  height: 48px;
  background-color: var(--danger-light);
  color: var(--danger-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Notifikasi Container */
.notification {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: auto;
  max-width: 380px;
  max-height: 80px; /* Tambahkan ini jika ingin membatasi tinggi */
  background: var(--dash-color, #ffffff);
  color: var(--endp-color);
  padding: 0.5rem;
  border-radius: 8px;
  border-left: 4px solid #4f46e5;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 50;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease-out;
}

/* Tambahan: Pastikan tidak full screen */
.notification * {
  max-width: 100%; 
  overflow: hidden;
}

/* Icon Container */
.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ecfdf5;
  color: var(--primary-color);
  flex-shrink: 0;
}

/* Status Colors */
.notification.success {
  border-left-color: #10b981;
}

.notification.error {
  border-left-color: #ef4444;
}

.notification.warning {
  border-left-color: #f59e0b;
}

.notification.info {
  border-left-color: #3b82f6;
}

/* Icon Colors */
.notification.success .notification-icon {
  background-color: #ecfdf5;
  color: #10b981;
}

.notification.error .notification-icon {
  background-color: #fef2f2;
  color: #ef4444;
}

.notification.warning .notification-icon {
  background-color: #fffbeb;
  color: #f59e0b;
}

.notification.info .notification-icon {
  background-color: #eff6ff;
  color: #3b82f6;
}

/* Message Text */
.notification-message {
  flex-grow: 1;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--text-color);
}

/* Close Button */
.notification-close {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background-color: var(--gray-light, #f3f4f6);
  color: var(--gray-dark, #6b7280);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;
  font-size: 14px;
}

.notification-close:hover {
  background-color: var(--gray-medium, #e5e7eb);
  color: var(--gray-darker, #374151);
}

/* Animations */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.notification.fade-enter-active {
  animation: slideIn 0.3s ease-out;
}

.notification.fade-leave-active {
  animation: slideOut 0.3s ease-in;
}

/* Responsive Design */
@media (max-width: 640px) {
  .notification {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
    max-width: none;
  }
}

/* Multiple Notifications Stack */
.notification + .notification {
  margin-bottom: 0.75rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 640px) {
  .page-wrapper {
    padding: 1rem;
  }

  .profile-container {
    border-radius: 8px;
  }

  .profile-content {
    padding: 1.5rem;
  }

  .avatar-image {
    width: 96px;
    height: 96px;
  }

  .modal-content {
    margin: 0 1rem;
  }
}

.hidden-input {
  display: none;
}
</style>
