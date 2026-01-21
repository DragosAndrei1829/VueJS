<template>
  <div class="reservation-form-container">
    <CardComponent>
      <template #header>
        <h2>{{ isEdit ? 'Edit Reservation' : 'Create New Reservation' }}</h2>
      </template>
      <template #default>
        <div v-if="!isAuthenticated" class="auth-required">
          <p>You must be logged in to create a reservation.</p>
          <router-link to="/" class="btn btn-primary">Go to Login</router-link>
        </div>
        <form v-else @submit.prevent="handleSubmit" class="form">
          <div class="form-section">
            <h3 class="section-title">Customer Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="customerName">Full Name *</label>
                <input
                  id="customerName"
                  v-model="formData.customerName"
                  type="text"
                  :class="{ 'error': errors.customerName }"
                  placeholder="Enter customer name"
                />
                <span v-if="errors.customerName" class="error-message">{{ errors.customerName }}</span>
              </div>

              <div class="form-group">
                <label for="customerEmail">Email *</label>
                <input
                  id="customerEmail"
                  v-model="formData.customerEmail"
                  type="email"
                  :class="{ 'error': errors.customerEmail }"
                  placeholder="customer@example.com"
                />
                <span v-if="errors.customerEmail" class="error-message">{{ errors.customerEmail }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="customerPhone">Phone Number *</label>
                <input
                  id="customerPhone"
                  v-model="formData.customerPhone"
                  type="tel"
                  :class="{ 'error': errors.customerPhone }"
                  placeholder="+1-555-123-4567"
                />
                <span v-if="errors.customerPhone" class="error-message">{{ errors.customerPhone }}</span>
              </div>

              <div class="form-group">
                <label for="numberOfGuests">Number of Guests *</label>
                <input
                  id="numberOfGuests"
                  v-model.number="formData.numberOfGuests"
                  type="number"
                  min="1"
                  max="20"
                  :class="{ 'error': errors.numberOfGuests }"
                  placeholder="2"
                />
                <span v-if="errors.numberOfGuests" class="error-message">{{ errors.numberOfGuests }}</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Reservation Details</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="reservationType">Reservation Type *</label>
                <select id="reservationType" v-model="formData.reservationType" :class="{ 'error': errors.reservationType }">
                  <option value="">Select type</option>
                  <option value="dinner">Dinner</option>
                  <option value="lunch">Lunch</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="event">Special Event</option>
                </select>
                <span v-if="errors.reservationType" class="error-message">{{ errors.reservationType }}</span>
              </div>

              <div class="form-group">
                <label for="status">Status *</label>
                <select id="status" v-model="formData.status" :class="{ 'error': errors.status }">
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                <span v-if="errors.status" class="error-message">{{ errors.status }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="reservationDate">Reservation Date *</label>
                <input
                  id="reservationDate"
                  v-model="formData.reservationDate"
                  type="date"
                  :min="new Date().toISOString().split('T')[0]"
                  :class="{ 'error': errors.reservationDate }"
                />
                <span v-if="errors.reservationDate" class="error-message">{{ errors.reservationDate }}</span>
              </div>

              <div class="form-group">
                <label for="reservationTime">Reservation Time *</label>
                <input
                  id="reservationTime"
                  v-model="formData.reservationTime"
                  type="time"
                  :class="{ 'error': errors.reservationTime }"
                />
                <span v-if="errors.reservationTime" class="error-message">{{ errors.reservationTime }}</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-group">
              <label for="specialRequests">Special Requests</label>
              <textarea
                id="specialRequests"
                v-model="formData.specialRequests"
                rows="4"
                placeholder="Any special requests or dietary requirements..."
              ></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="handleCancel" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update Reservation' : 'Create Reservation' }}</button>
          </div>
        </form>
      </template>
    </CardComponent>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CardComponent from './CardComponent.vue'

export default {
  name: 'ReservationForm',
  components: {
    CardComponent
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    reservationId: {
      type: String,
      default: null
    },
    initialData: {
      type: Object,
      default: null
    }
  },
  emits: ['submit', 'cancel'],
  computed: {
    ...mapGetters('user', ['isAuthenticated'])
  },
  data() {
    return {
      formData: {
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        reservationType: '',
        numberOfGuests: 2,
        reservationDate: '',
        reservationTime: '',
        status: 'pending',
        specialRequests: ''
      },
      errors: {}
    }
  },
  created() {
    if (this.initialData) {
      this.formData = { ...this.initialData }
    } else if (this.isEdit && this.reservationId) {
      const reservation = this.$store.getters['reservations/reservationById'](this.reservationId)
      if (reservation) {
        this.formData = {
          customerName: reservation.customerName || '',
          customerEmail: reservation.customerEmail || '',
          customerPhone: reservation.customerPhone || '',
          reservationType: reservation.reservationType || '',
          numberOfGuests: reservation.numberOfGuests || 2,
          reservationDate: reservation.reservationDate || '',
          reservationTime: reservation.reservationTime || '',
          status: reservation.status || 'pending',
          specialRequests: reservation.specialRequests || ''
        }
      }
    }
  },
  methods: {
    validate() {
      this.errors = {}
      let isValid = true

      if (!this.formData.customerName || this.formData.customerName.trim().length < 2) {
        this.errors.customerName = 'Name must be at least 2 characters'
        isValid = false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.formData.customerEmail || !emailRegex.test(this.formData.customerEmail)) {
        this.errors.customerEmail = 'Please enter a valid email address'
        isValid = false
      }

      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
      if (!this.formData.customerPhone || !phoneRegex.test(this.formData.customerPhone)) {
        this.errors.customerPhone = 'Please enter a valid phone number'
        isValid = false
      }

      if (!this.formData.reservationType) {
        this.errors.reservationType = 'Reservation type is required'
        isValid = false
      }

      if (!this.formData.status) {
        this.errors.status = 'Status is required'
        isValid = false
      }

      if (!this.formData.reservationDate) {
        this.errors.reservationDate = 'Reservation date is required'
        isValid = false
      }

      if (!this.formData.reservationTime) {
        this.errors.reservationTime = 'Reservation time is required'
        isValid = false
      }

      if (!this.formData.numberOfGuests || this.formData.numberOfGuests < 1 || this.formData.numberOfGuests > 20) {
        this.errors.numberOfGuests = 'Number of guests must be between 1 and 20'
        isValid = false
      }

      return isValid
    },
    handleSubmit() {
      if (this.validate()) {
        this.$emit('submit', { ...this.formData })
      }
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.auth-required {
  text-align: center;
  padding: 3rem 2rem;
}

.auth-required p {
  color: #666;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.auth-required .btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.auth-required .btn-primary {
  background: #1a1a1a;
  color: #ffffff;
}

.auth-required .btn-primary:hover {
  background: #333;
}
.reservation-form-container {
  max-width: 800px;
  margin: 0 auto;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: #fafafa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.section-title {
  margin: 0 0 1.5rem 0;
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #1a1a1a;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9375rem;
  transition: all 0.2s;
  background: #ffffff;
  color: #1a1a1a;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #1a1a1a;
}

.form-group input.error,
.form-group select.error {
  border-color: #d32f2f;
}

.error-message {
  color: #d32f2f;
  font-size: 0.8125rem;
  font-weight: 400;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e5e5;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #1a1a1a;
  color: #ffffff;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  background: #ffffff;
  color: #1a1a1a;
  border: 1px solid #e5e5e5;
}

.btn-secondary:hover {
  background: #fafafa;
  border-color: #d0d0d0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>

