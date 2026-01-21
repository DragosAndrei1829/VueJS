<template>
  <div class="reservation-details-view">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="!reservation" class="error">
      <p>Reservation not found.</p>
      <router-link to="/reservations" class="btn-back">Back to List</router-link>
    </div>
    <div v-else>
      <CardComponent>
        <template #header>
          <div class="header-actions">
            <h2>{{ reservation.customerName }}'s Reservation</h2>
            <div class="actions">
              <router-link :to="`/reservations/${reservation.id}/edit`" class="btn btn-edit">Edit</router-link>
              <router-link to="/reservations" class="btn btn-back">Back</router-link>
            </div>
          </div>
        </template>
        <template #default>
          <div class="reservation-details">
            <div class="detail-section">
              <h3>Customer Information</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="label">Name:</span>
                  <span class="value">{{ reservation.customerName }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Email:</span>
                  <span class="value">{{ reservation.customerEmail }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Phone:</span>
                  <span class="value">{{ reservation.customerPhone }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Number of Guests:</span>
                  <span class="value">{{ reservation.numberOfGuests }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>Reservation Details</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="label">Type:</span>
                  <span class="type-badge" :class="`type-${reservation.reservationType}`">{{ typeLabel }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Status:</span>
                  <span class="status-badge" :class="`status-${reservation.status}`">{{ statusLabel }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Date:</span>
                  <span class="value">{{ formatDate(reservation.reservationDate) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Time:</span>
                  <span class="value">{{ formatTime(reservation.reservationTime) }}</span>
                </div>
              </div>
            </div>

            <div v-if="reservation.specialRequests" class="detail-section">
              <h3>Special Requests</h3>
              <p class="special-requests-text">{{ reservation.specialRequests }}</p>
            </div>

            <div class="detail-section">
              <h3>Reservation Information</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="label">Created by:</span>
                  <span class="value">{{ reservation.createdBy || 'Unknown' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Created:</span>
                  <span class="value">{{ formatDateTime(reservation.createdAt) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Reservation ID:</span>
                  <span class="value code">{{ reservation.id }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </CardComponent>

      <div class="nested-routes">
        <nav class="nested-nav">
          <router-link :to="`/reservations/${reservation.id}/notes`" class="nested-link">Notes</router-link>
          <router-link :to="`/reservations/${reservation.id}/timeline`" class="nested-link">Timeline</router-link>
        </nav>
        <router-view :reservation-id="reservation.id" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CardComponent from '../components/CardComponent.vue'

export default {
  name: 'ReservationDetails',
  components: {
    CardComponent
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters('reservations', ['reservationById']),
    reservation() {
      return this.reservationById(this.id)
    },
    loading() {
      return this.$store.state.reservations.loading
    },
    statusLabel() {
      const labels = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        completed: 'Completed'
      }
      return labels[this.reservation?.status] || this.reservation?.status
    },
    typeLabel() {
      const labels = {
        dinner: 'Dinner',
        lunch: 'Lunch',
        breakfast: 'Breakfast',
        event: 'Special Event'
      }
      return labels[this.reservation?.reservationType] || this.reservation?.reservationType
    }
  },
  created() {
    try {
      const allReservations = this.$store.getters['reservations/allReservations']
      if (!allReservations || allReservations.length === 0) {
        this.$store.dispatch('reservations/fetchReservations').catch(error => {
          console.error('Error fetching reservations:', error)
        })
      }
    } catch (error) {
      console.error('Error in created hook:', error)
    }
  },
  methods: {
    formatDate(dateString) {
      try {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return 'Invalid Date'
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      } catch (error) {
        console.error('Error formatting date:', error)
        return 'Invalid Date'
      }
    },
    formatTime(timeString) {
      try {
        if (!timeString) return 'N/A'
        const [hours, minutes] = timeString.split(':')
        const hour = parseInt(hours)
        if (isNaN(hour) || hour < 0 || hour > 23) return 'Invalid Time'
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour % 12 || 12
        return `${displayHour}:${minutes || '00'} ${ampm}`
      } catch (error) {
        console.error('Error formatting time:', error)
        return 'Invalid Time'
      }
    },
    formatDateTime(dateString) {
      try {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return 'Invalid Date'
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      } catch (error) {
        console.error('Error formatting date/time:', error)
        return 'Invalid Date'
      }
    }
  }
}
</script>

<style scoped>
.reservation-details-view {
  width: 100%;
}

.loading,
.error {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 15px;
  color: #718096;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-actions h2 {
  margin: 0;
  flex: 1;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-block;
}

.btn-edit {
  background: #1a1a1a;
  color: #ffffff;
}

.btn-edit:hover {
  background: #333;
}

.btn-back {
  background: #ffffff;
  color: #1a1a1a;
  border: 1px solid #e5e5e5;
}

.btn-back:hover {
  background: #fafafa;
  border-color: #d0d0d0;
}

.reservation-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section {
  background: #fafafa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.detail-section h3 {
  margin: 0 0 1rem 0;
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-weight: 500;
  color: #666;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  color: #1a1a1a;
  font-size: 0.9375rem;
  font-weight: 400;
}

.value.code {
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
}

.type-badge,
.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  width: fit-content;
}

.type-dinner,
.type-lunch,
.type-breakfast,
.type-event {
  background: #f5f5f5;
  color: #666;
}

.status-pending {
  background: #fff3e0;
  color: #e65100;
}

.status-confirmed {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-cancelled {
  background: #ffebee;
  color: #c62828;
}

.status-completed {
  background: #e3f2fd;
  color: #1565c0;
}

.special-requests-text {
  margin: 0;
  color: #666;
  line-height: 1.6;
  padding: 1rem;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
}

.nested-routes {
  margin-top: 1.5rem;
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e5e5e5;
}

.nested-nav {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 1rem;
}

.nested-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.nested-link:hover,
.nested-link.router-link-active {
  background: #1a1a1a;
  color: #ffffff;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    text-align: center;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>

