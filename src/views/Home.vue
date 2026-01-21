<template>
  <div class="home">
    <CardComponent>
      <template #header>
        <h1>Reservation System</h1>
      </template>
      <template #default>
        <div class="home-content">
          <p class="intro-text">
            Manage your restaurant reservations efficiently. 
            Create, track, and organize reservations with ease.
          </p>
          
          <div class="stats-section">
            <div class="stat-card">
              <h3>{{ totalReservations }}</h3>
              <p>Total Reservations</p>
            </div>
            <div class="stat-card">
              <h3>{{ pendingReservations }}</h3>
              <p>Pending</p>
            </div>
            <div class="stat-card">
              <h3>{{ confirmedReservations }}</h3>
              <p>Confirmed</p>
            </div>
            <div class="stat-card">
              <h3>{{ todayReservations }}</h3>
              <p>Today</p>
            </div>
          </div>

          <div v-if="!isAuthenticated" class="login-section">
            <h3>Sign in to manage reservations</h3>
            <div class="login-form">
              <input
                v-model="loginName"
                type="text"
                placeholder="Enter your name"
                class="login-input"
              />
              <input
                v-model="loginEmail"
                type="email"
                placeholder="Enter your email"
                class="login-input"
              />
              <button @click="handleLogin" class="action-btn primary">Sign In</button>
            </div>
          </div>
          <div v-else class="user-welcome">
            <p>Hello, <strong>{{ currentUserName }}</strong>! 👋</p>
          </div>
          <div class="quick-actions">
            <router-link to="/reservations" class="action-btn primary">
              View All Reservations
            </router-link>
            <router-link to="/reservations/new" class="action-btn secondary">
              Create New Reservation
            </router-link>
          </div>
        </div>
      </template>
    </CardComponent>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CardComponent from '../components/CardComponent.vue'

export default {
  name: 'Home',
  components: {
    CardComponent
  },
  data() {
    return {
      loginName: '',
      loginEmail: ''
    }
  },
  computed: {
    ...mapGetters('reservations', ['allReservations']),
    ...mapGetters('user', ['isAuthenticated', 'userName']),
    currentUserName() {
      return this.userName || 'Guest'
    },
    totalReservations() {
      return this.allReservations.length
    },
    pendingReservations() {
      return this.allReservations.filter(r => r.status === 'pending').length
    },
    confirmedReservations() {
      return this.allReservations.filter(r => r.status === 'confirmed').length
    },
    todayReservations() {
      const today = new Date().toISOString().split('T')[0]
      return this.allReservations.filter(r => r.reservationDate === today).length
    }
  },
  mounted() {
    if (this.allReservations.length === 0) {
      this.$store.dispatch('reservations/fetchReservations')
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    async handleLogin() {
      try {
        if (!this.loginName || !this.loginEmail) {
          alert('Please fill in all fields')
          return
        }
        
        if (this.loginName.trim().length < 2) {
          alert('Name must be at least 2 characters')
          return
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(this.loginEmail)) {
          alert('Please enter a valid email address')
          return
        }
        
        await this.login({
          name: this.loginName.trim(),
          email: this.loginEmail.trim()
        })
        this.loginName = ''
        this.loginEmail = ''
      } catch (error) {
        console.error('Error during login:', error)
        alert(error.message || 'An error occurred during login. Please try again.')
      }
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
}

.home-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.intro-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: left;
  border: 1px solid #e5e5e5;
  transition: border-color 0.2s;
}

.stat-card:hover {
  border-color: #d0d0d0;
}

.stat-card h3 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.stat-card p {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  font-weight: 400;
}

.quick-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s;
  display: inline-block;
}

.action-btn.primary {
  background: #1a1a1a;
  color: #ffffff;
}

.action-btn.primary:hover {
  background: #333;
}

.action-btn.secondary {
  background: #ffffff;
  color: #1a1a1a;
  border: 1px solid #e5e5e5;
}

.action-btn.secondary:hover {
  background: #fafafa;
  border-color: #d0d0d0;
}

.login-section {
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e5e5e5;
}

.login-section h3 {
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  font-size: 1.125rem;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  margin: 0 auto;
}

.login-input {
  padding: 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9375rem;
  transition: all 0.2s;
  background: #ffffff;
  color: #1a1a1a;
}

.login-input::placeholder {
  color: #999;
}

.login-input:focus {
  outline: none;
  border-color: #1a1a1a;
}

.user-welcome {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-size: 0.9375rem;
}

@media (max-width: 768px) {
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .action-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
