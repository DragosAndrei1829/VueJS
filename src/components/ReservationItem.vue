<template>
  <div class="reservation-item" :class="reservationClass">
    <div class="reservation-header">
      <div class="customer-info">
        <h3 class="customer-name">{{ reservation.customerName }}</h3>
        <span class="reservation-type" :class="typeClass">{{ typeLabel }}</span>
      </div>
      <span class="status-badge" :class="statusClass">{{ statusLabel }}</span>
    </div>

    <div class="reservation-details">
      <div class="detail-row">
        <span class="detail-icon">📧</span>
        <span class="detail-text">{{ reservation.customerEmail }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-icon">📞</span>
        <span class="detail-text">{{ reservation.customerPhone }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-icon">👥</span>
        <span class="detail-text">{{ reservation.numberOfGuests }} {{ reservation.numberOfGuests === 1 ? 'guest' : 'guests' }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-icon">📅</span>
        <span class="detail-text">{{ formatDate(reservation.reservationDate) }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-icon">🕐</span>
        <span class="detail-text">{{ formatTime(reservation.reservationTime) }}</span>
      </div>
      <div v-if="reservation.createdBy" class="detail-row">
        <span class="detail-icon">👤</span>
        <span class="detail-text">Created by: <strong>{{ reservation.createdBy }}</strong></span>
      </div>
    </div>

    <div v-if="reservation.specialRequests" class="special-requests">
      <strong>Special Requests:</strong>
      <p>{{ reservation.specialRequests }}</p>
    </div>

    <div class="reservation-actions">
      <router-link :to="`/reservations/${reservation.id}`" class="btn btn-view">View Details</router-link>
      <router-link :to="`/reservations/${reservation.id}/edit`" class="btn btn-edit">Edit</router-link>
      <select
        :value="reservation.status"
        @change="handleStatusChange"
        class="status-select"
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
        <option value="completed">Completed</option>
      </select>
      <button @click="handleDelete" class="btn btn-delete">Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReservationItem',
  props: {
    reservation: {
      type: Object,
      required: true
    }
  },
  emits: ['delete', 'status-change'],
  computed: {
    reservationClass() {
      return {
        'reservation-confirmed': this.reservation.status === 'confirmed',
        'reservation-pending': this.reservation.status === 'pending',
        'reservation-cancelled': this.reservation.status === 'cancelled',
        'reservation-completed': this.reservation.status === 'completed'
      }
    },
    statusClass() {
      return `status-${this.reservation.status}`
    },
    typeClass() {
      return `type-${this.reservation.reservationType}`
    },
    statusLabel() {
      const labels = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        completed: 'Completed'
      }
      return labels[this.reservation.status] || this.reservation.status
    },
    typeLabel() {
      const labels = {
        dinner: 'Dinner',
        lunch: 'Lunch',
        breakfast: 'Breakfast',
        event: 'Special Event'
      }
      return labels[this.reservation.reservationType] || this.reservation.reservationType
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
    handleDelete() {
      try {
        if (!this.reservation || !this.reservation.id) {
          throw new Error('Invalid reservation data')
        }
        if (confirm('Are you sure you want to delete this reservation?')) {
          this.$emit('delete', this.reservation.id)
        }
      } catch (error) {
        console.error('Error in handleDelete:', error)
        alert(error.message || 'An error occurred while deleting.')
      }
    },
    handleStatusChange(event) {
      try {
        if (!this.reservation || !this.reservation.id) {
          throw new Error('Invalid reservation data')
        }
        if (!event || !event.target || !event.target.value) {
          throw new Error('Invalid status value')
        }
        this.$emit('status-change', this.reservation.id, event.target.value)
      } catch (error) {
        console.error('Error in handleStatusChange:', error)
        alert(error.message || 'An error occurred while changing status.')
      }
    }
  }
}
</script>

<style scoped>
.reservation-item {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  transition: all 0.2s ease;
}

.reservation-item:hover {
  border-color: #d0d0d0;
}

.reservation-confirmed {
  border-left: 3px solid #4caf50;
}

.reservation-pending {
  border-left: 3px solid #ff9800;
}

.reservation-cancelled {
  border-left: 3px solid #f44336;
  opacity: 0.7;
}

.reservation-completed {
  border-left: 3px solid #2196f3;
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;
}

.customer-info {
  flex: 1;
}

.customer-name {
  font-size: 1.125rem;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.reservation-type {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #f5f5f5;
  color: #666;
}

.type-dinner {
  background: #f5f5f5;
  color: #666;
}

.type-lunch {
  background: #f5f5f5;
  color: #666;
}

.type-breakfast {
  background: #f5f5f5;
  color: #666;
}

.type-event {
  background: #f5f5f5;
  color: #666;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
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

.reservation-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.detail-icon {
  font-size: 1rem;
  opacity: 0.6;
}

.detail-text {
  font-size: 0.875rem;
}

.special-requests {
  background: #fafafa;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #e5e5e5;
}

.special-requests strong {
  color: #1a1a1a;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
}

.special-requests p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
  line-height: 1.5;
}

.reservation-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid #e5e5e5;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
  text-align: center;
}

.btn-view {
  background: #1a1a1a;
  color: #ffffff;
}

.btn-view:hover {
  background: #333;
}

.btn-edit {
  background: #ffffff;
  color: #1a1a1a;
  border: 1px solid #e5e5e5;
}

.btn-edit:hover {
  background: #fafafa;
  border-color: #d0d0d0;
}

.btn-delete {
  background: #ffffff;
  color: #d32f2f;
  border: 1px solid #e5e5e5;
}

.btn-delete:hover {
  background: #fafafa;
  border-color: #d0d0d0;
}

.status-select {
  padding: 0.5rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.8125rem;
  cursor: pointer;
  background: #ffffff;
  transition: all 0.2s;
}

.status-select:focus {
  outline: none;
  border-color: #1a1a1a;
}

@media (max-width: 768px) {
  .reservation-actions {
    flex-direction: column;
  }

  .btn,
  .status-select {
    width: 100%;
  }
}
</style>

