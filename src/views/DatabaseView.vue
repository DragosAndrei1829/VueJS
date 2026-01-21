<template>
  <div class="database-view">
    <CardComponent>
      <template #header>
        <h2>Local Database Viewer</h2>
      </template>
      <template #default>
        <div class="db-info">
          <div class="info-section">
            <h3>Database Name: <code>reservations_db</code></h3>
            <p>Location: Browser LocalStorage</p>
          </div>

          <div class="data-section">
            <h3>Reservations ({{ reservations.length }})</h3>
            <div class="data-display">
              <pre>{{ JSON.stringify(reservations, null, 2) }}</pre>
            </div>
          </div>

          <div class="data-section">
            <h3>Current User</h3>
            <div class="data-display">
              <pre>{{ JSON.stringify(currentUser, null, 2) }}</pre>
            </div>
          </div>

          <div class="data-section">
            <h3>Users in Database ({{ users.length }})</h3>
            <div class="data-display">
              <pre>{{ JSON.stringify(users, null, 2) }}</pre>
            </div>
          </div>

          <div class="data-section">
            <h3>Settings</h3>
            <div class="data-display">
              <pre>{{ JSON.stringify(settings, null, 2) }}</pre>
            </div>
          </div>

          <div class="actions">
            <button @click="refreshData" class="btn-refresh">Refresh Data</button>
            <button @click="clearDatabase" class="btn-clear">Clear Database</button>
            <button @click="exportData" class="btn-export">Export JSON</button>
          </div>
        </div>
      </template>
    </CardComponent>
  </div>
</template>

<script>
import CardComponent from '../components/CardComponent.vue'

export default {
  name: 'DatabaseView',
  components: {
    CardComponent
  },
  data() {
    return {
      reservations: [],
      users: [],
      settings: {},
      currentUser: null
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      try {
        const dbData = localStorage.getItem('reservations_db')
        if (dbData) {
          const db = JSON.parse(dbData)
          this.reservations = db.reservations || []
          this.users = db.users || []
          this.settings = db.settings || {}
        }
        
        const userData = localStorage.getItem('user')
        if (userData) {
          this.currentUser = JSON.parse(userData)
        } else {
          this.currentUser = null
        }
      } catch (error) {
        console.error('Error loading database:', error)
        alert('Error loading database data')
      }
    },
    refreshData() {
      this.loadData()
      alert('Data refreshed!')
    },
    clearDatabase() {
      if (confirm('Are you sure you want to clear the entire database? This cannot be undone!')) {
        try {
          localStorage.removeItem('reservations_db')
          localStorage.removeItem('user')
          this.reservations = []
          this.users = []
          this.settings = {}
          this.currentUser = null
          alert('Database cleared! Please refresh the page.')
        } catch (error) {
          console.error('Error clearing database:', error)
          alert('Error clearing database')
        }
      }
    },
    exportData() {
      try {
        const dbData = localStorage.getItem('reservations_db')
        if (dbData) {
          const blob = new Blob([dbData], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `reservations_db_${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        } else {
          alert('No data to export')
        }
      } catch (error) {
        console.error('Error exporting data:', error)
        alert('Error exporting data')
      }
    }
  }
}
</script>

<style scoped>
.database-view {
  width: 100%;
}

.db-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  padding: 1rem;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
}

.info-section h3 {
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 600;
}

.info-section code {
  background: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1a1a1a;
}

.info-section p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.data-section h3 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 600;
}

.data-display {
  background: #1a1a1a;
  color: #00ff00;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.data-display pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid #e5e5e5;
}

.actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh {
  background: #1a1a1a;
  color: #ffffff;
}

.btn-refresh:hover {
  background: #333;
}

.btn-clear {
  background: #dc2626;
  color: #ffffff;
}

.btn-clear:hover {
  background: #b91c1c;
}

.btn-export {
  background: #059669;
  color: #ffffff;
}

.btn-export:hover {
  background: #047857;
}

@media (max-width: 768px) {
  .actions {
    flex-direction: column;
  }

  .actions button {
    width: 100%;
  }
}
</style>

