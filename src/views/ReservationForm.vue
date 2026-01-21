<template>
  <div class="reservation-form-view">
    <ReservationFormComponent
      :is-edit="isEdit"
      :reservation-id="reservationId"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ReservationFormComponent from '../components/ReservationForm.vue'

export default {
  name: 'ReservationForm',
  components: {
    ReservationFormComponent
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    reservationId: {
      type: String,
      default: null
    }
  },
  methods: {
    ...mapActions('reservations', ['addReservation', 'updateReservation']),
    async handleSubmit(reservationData) {
      try {
        if (this.isEdit && this.reservationId) {
          const reservation = this.$store.getters['reservations/reservationById'](this.reservationId)
          if (!reservation) {
            alert('Reservation not found')
            this.$router.push('/reservations')
            return
          }
          this.updateReservation({
            ...reservation,
            ...reservationData,
            createdBy: reservation.createdBy
          })
          this.$router.push(`/reservations/${this.reservationId}`)
        } else {
          const newReservation = await this.addReservation(reservationData)
          if (newReservation && newReservation.id) {
            this.$router.push(`/reservations/${newReservation.id}`)
          } else {
            throw new Error('Failed to create reservation')
          }
        }
      } catch (error) {
        console.error('Error submitting reservation:', error)
        alert(error.message || 'An error occurred while saving the reservation. Please try again.')
      }
    },
    handleCancel() {
      if (this.isEdit && this.reservationId) {
        this.$router.push(`/reservations/${this.reservationId}`)
      } else {
        this.$router.push('/reservations')
      }
    }
  }
}
</script>

<style scoped>
.reservation-form-view {
  width: 100%;
}
</style>

