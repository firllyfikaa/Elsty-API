<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>Halaman yang Anda cari tidak ditemukan.</p>
      <router-link to="/" class="home-link">
        <span class="material-symbols-rounded">arrow_back</span>
        Kembali ke Beranda
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
  color: #151A2D;
}

.content {
  max-width: 500px;
}

h1 {
  font-size: 6rem;
  margin: 0;
  font-weight: 700;
  color: #6366f1;
}

p {
  font-size: 1.5rem;
  margin: 20px 0;
}

.home-link {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #4f46e5;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  font-size: 1rem;
}

.home-link:hover {
  background-color: #4338ca;
}

.home-link span {
  font-size: 1.2rem;
  margin-right: 8px;
}
</style>
