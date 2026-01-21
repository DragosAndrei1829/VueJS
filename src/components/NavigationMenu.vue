<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">
        <h1>Reservation System</h1>
      </router-link>
      <ul class="nav-links">
        <li>
          <router-link to="/" class="nav-link">Home</router-link>
        </li>
        <li>
          <router-link to="/reservations" class="nav-link">Reservations</router-link>
        </li>
        <li>
          <router-link to="/reservations/new" class="nav-link btn-new">+ New Reservation</router-link>
        </li>
        <li>
          <router-link to="/database" class="nav-link">Database</router-link>
        </li>
        <li v-if="isAuthenticated" class="user-info">
          <span>👤 {{ userName }}</span>
          <button @click="handleLogout" class="btn-logout">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NavigationMenu',
  computed: {
    ...mapGetters('user', ['isAuthenticated', 'userName'])
  },
  methods: {
    ...mapActions('user', ['logout']),
    handleLogout() {
      this.logout()
    }
  }
}
</script>

<style scoped>
.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: #1a1a1a;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 0.5rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
}

.nav-link:hover {
  background: #f5f5f5;
  color: #1a1a1a;
}

.nav-link.router-link-active {
  background: #1a1a1a;
  color: #ffffff;
}

.btn-new {
  background: #1a1a1a;
  color: #ffffff !important;
}

.btn-new:hover {
  background: #333;
}

.user-info {
  color: #666;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 0.875rem;
}

.btn-logout {
  padding: 0.375rem 0.75rem;
  background: transparent;
  color: #666;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #f5f5f5;
  border-color: #d0d0d0;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
    padding: 0 16px;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .logo h1 {
    font-size: 1.25rem;
  }
}
</style>
