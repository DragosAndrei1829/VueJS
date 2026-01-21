<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; 2025 Reservation System. All rights reserved.</p>
      <p class="footer-info">Restaurant Reservation Management System built with Vue.js</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.footer {
  background: #ffffff;
  padding: 2rem;
  margin-top: auto;
  text-align: center;
  border-top: 1px solid #e5e5e5;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.875rem;
}

.footer-info {
  font-size: 0.8125rem;
  color: #999;
}
</style>

