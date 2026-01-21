<template>
  <div class="reservations-list-view">
    <CardComponent>
      <template #header>
        <div class="header-content">
          <h2>Reservations Management</h2>
          <router-link to="/reservations/new" class="btn-add">+ New Reservation</router-link>
        </div>
      </template>
      <template #default>
        <ReservationList
          :reservations="allReservations"
          :loading="loading"
          @delete="handleDelete"
          @status-change="handleStatusChange"
        />
      </template>
    </CardComponent>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CardComponent from '../components/CardComponent.vue'
import ReservationList from '../components/ReservationList.vue'

export default {
  name: 'ReservationsList',
  components: {
    CardComponent,
    ReservationList
  },
  computed: {
    ...mapGetters('reservations', ['allReservations']),
    loading() {
      return this.$store.state.reservations.loading
    }
  },
  created() {
    try {
      this.fetchReservations().catch(error => {
        console.error('Error fetching reservations:', error)
      })
    } catch (error) {
      console.error('Error in created hook:', error)
    }
  },
  methods: {
    ...mapActions('reservations', ['fetchReservations', 'deleteReservation', 'updateReservation']),
    handleDelete(reservationId) {
      try {
        if (!reservationId) {
          throw new Error('Reservation ID is required')
        }
        this.deleteReservation(reservationId)
      } catch (error) {
        console.error('Error deleting reservation:', error)
        alert(error.message || 'An error occurred while deleting the reservation.')
      }
    },
    handleStatusChange(reservationId, newStatus) {
      try {
        if (!reservationId || !newStatus) {
          throw new Error('Reservation ID and status are required')
        }
        
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
        if (!validStatuses.includes(newStatus)) {
          throw new Error('Invalid status')
        }
        
        const reservation = this.allReservations.find(r => r && r.id === reservationId)
        if (!reservation) {
          throw new Error('Reservation not found')
        }
        
        this.updateReservation({
          ...reservation,
          status: newStatus
        })
      } catch (error) {
        console.error('Error changing reservation status:', error)
        alert(error.message || 'An error occurred while updating the status.')
      }
    }
  }
}
</script>

<style scoped>
.reservations-list-view {
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-content h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: #ffffff;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.btn-add:hover {
  background: #333;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-add {
    width: 100%;
    text-align: center;
  }
}
</style>

