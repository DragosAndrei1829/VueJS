<template>
  <div class="reservation-timeline">
    <h3>⏱️ Activity Timeline</h3>
    <div v-if="timeline.length === 0" class="no-timeline">
      <p>No activity recorded for this reservation.</p>
    </div>
    <div v-else class="timeline-list">
      <div v-for="entry in timeline" :key="entry.id" class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-action">{{ entry.action }}</span>
            <span class="timeline-date">{{ formatDate(entry.date) }}</span>
          </div>
          <p v-if="entry.details" class="timeline-details">{{ entry.details }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReservationTimeline',
  props: {
    reservationId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timeline: []
    }
  },
  created() {
    this.timeline = [
      {
        id: 1,
        action: 'Reservation created',
        details: 'Initial reservation request submitted',
        date: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 2,
        action: 'Status changed to Confirmed',
        details: 'Reservation confirmed by staff',
        date: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        action: 'Customer information updated',
        details: 'Phone number updated',
        date: new Date(Date.now() - 43200000).toISOString()
      }
    ]
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>

<style scoped>
.reservation-timeline {
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 8px;
  margin-top: 1.5rem;
  border: 1px solid #e5e5e5;
}

.timeline-list {
  position: relative;
  padding-left: 2rem;
  margin-top: 1rem;
}

.timeline-list::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #e5e5e5;
}

.timeline-item {
  position: relative;
  margin-bottom: 1rem;
}

.timeline-dot {
  position: absolute;
  left: -1.75rem;
  top: 0.25rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1a1a1a;
  border: 2px solid #ffffff;
}

.timeline-content {
  background: #ffffff;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-action {
  font-weight: 600;
  color: #2d3748;
}

.timeline-date {
  font-size: 0.875rem;
  color: #718096;
}

.timeline-details {
  margin: 0;
  color: #4a5568;
  font-size: 0.9rem;
}

.no-timeline {
  text-align: center;
  padding: 3rem;
  color: #718096;
}
</style>

