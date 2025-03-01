<template>
  <footer class="footer">
    <div class="footer-container">
      <p class="footer-text">© 2025 ELSTY API. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterMenu",
};
</script>

<style scoped>
.footer {
  padding: 16px;
  text-align: center;
  /* Agar selalu di bawah */
  margin-top: auto;
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.footer-text {
  font-size: 14px;
  margin: 0;
}
</style>