<template>
  <div class="reservation-list-container">
    <div class="filters-section">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by customer name, email, or phone..."
          class="search-input"
        />
      </div>
      <div class="filter-controls">
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <select v-model="filterType" class="filter-select">
          <option value="">All Types</option>
          <option value="dinner">Dinner</option>
          <option value="lunch">Lunch</option>
          <option value="breakfast">Breakfast</option>
          <option value="event">Special Event</option>
        </select>
        <select v-model="filterDate" class="filter-select">
          <option value="">All Dates</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="thisWeek">This Week</option>
          <option value="nextWeek">Next Week</option>
        </select>
        <select v-model="sortBy" class="filter-select">
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="guests">Sort by Guests</option>
          <option value="type">Sort by Type</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading reservations...</p>
    </div>
    <div v-else-if="filteredReservations.length === 0" class="no-reservations">
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No reservations found</h3>
        <p>No reservations match your criteria.</p>
        <router-link to="/reservations/new" class="btn-create">Create New Reservation</router-link>
      </div>
    </div>
    <div v-else class="reservations-grid">
      <ReservationItem
        v-for="reservation in filteredReservations"
        :key="reservation.id"
        :reservation="reservation"
        @delete="handleDelete"
        @status-change="handleStatusChange"
      />
    </div>
  </div>
</template>

<script>
import ReservationItem from './ReservationItem.vue'

export default {
  name: 'ReservationList',
  components: {
    ReservationItem
  },
  props: {
    reservations: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['delete', 'status-change'],
  data() {
    return {
      searchQuery: '',
      filterStatus: '',
      filterType: '',
      filterDate: '',
      sortBy: 'date'
    }
  },
  computed: {
    filteredReservations() {
      try {
        if (!Array.isArray(this.reservations)) {
          return []
        }
        
        let filtered = [...this.reservations].filter(r => r && r.id)

        if (this.searchQuery && this.searchQuery.trim()) {
          const query = this.searchQuery.toLowerCase().trim()
          filtered = filtered.filter(reservation => {
            try {
              const name = (reservation.customerName || '').toLowerCase()
              const email = (reservation.customerEmail || '').toLowerCase()
              const phone = (reservation.customerPhone || '').toString()
              return name.includes(query) || email.includes(query) || phone.includes(query)
            } catch (e) {
              return false
            }
          })
        }

        if (this.filterStatus) {
          filtered = filtered.filter(reservation => reservation.status === this.filterStatus)
        }

        if (this.filterType) {
          filtered = filtered.filter(reservation => reservation.reservationType === this.filterType)
        }

        if (this.filterDate) {
          try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            const nextWeek = new Date(today)
            nextWeek.setDate(nextWeek.getDate() + 7)

            filtered = filtered.filter(reservation => {
              try {
                if (!reservation.reservationDate) return false
                const resDate = new Date(reservation.reservationDate)
                if (isNaN(resDate.getTime())) return false
                resDate.setHours(0, 0, 0, 0)

                switch (this.filterDate) {
                  case 'today':
                    return resDate.getTime() === today.getTime()
                  case 'tomorrow':
                    return resDate.getTime() === tomorrow.getTime()
                  case 'thisWeek':
                    return resDate >= today && resDate < nextWeek
                  case 'nextWeek':
                    const weekAfter = new Date(nextWeek)
                    weekAfter.setDate(weekAfter.getDate() + 7)
                    return resDate >= nextWeek && resDate < weekAfter
                  default:
                    return true
                }
              } catch (e) {
                return false
              }
            })
          } catch (e) {
            console.error('Error in date filter:', e)
          }
        }

        try {
          filtered.sort((a, b) => {
            try {
              switch (this.sortBy) {
                case 'name':
                  return (a.customerName || '').localeCompare(b.customerName || '')
                case 'guests':
                  return (b.numberOfGuests || 0) - (a.numberOfGuests || 0)
                case 'type':
                  return (a.reservationType || '').localeCompare(b.reservationType || '')
                case 'date':
                default:
                  const dateA = new Date((a.reservationDate || '') + ' ' + (a.reservationTime || ''))
                  const dateB = new Date((b.reservationDate || '') + ' ' + (b.reservationTime || ''))
                  if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0
                  return dateA - dateB
              }
            } catch (e) {
              return 0
            }
          })
        } catch (e) {
          console.error('Error in sort:', e)
        }

        return filtered
      } catch (error) {
        console.error('Error in filteredReservations:', error)
        return []
      }
    }
  },
  methods: {
    handleDelete(reservationId) {
      this.$emit('delete', reservationId)
    },
    handleStatusChange(reservationId, newStatus) {
      this.$emit('status-change', reservationId, newStatus)
    }
  }
}
</script>

<style scoped>
.reservation-list-container {
  width: 100%;
}

.filters-section {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #e5e5e5;
}

.search-box {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9375rem;
  transition: all 0.2s;
  background: #ffffff;
}

.search-input:focus {
  outline: none;
  border-color: #1a1a1a;
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #1a1a1a;
}

.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.spinner {
  border: 2px solid #f5f5f5;
  border-top: 2px solid #1a1a1a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-reservations {
  background: #ffffff;
  border-radius: 8px;
  padding: 3rem;
  border: 1px solid #e5e5e5;
}

.empty-state {
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

.btn-create {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: #ffffff;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.btn-create:hover {
  background: #333;
}

@media (max-width: 768px) {
  .filter-controls {
    grid-template-columns: 1fr;
  }

  .reservations-grid {
    grid-template-columns: 1fr;
  }
}
</style>

