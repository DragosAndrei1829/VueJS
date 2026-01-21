<template>
  <div class="reservation-notes">
    <h3>📝 Notes & Comments</h3>
    <div v-if="notes.length === 0" class="no-notes">
      <p>No notes added for this reservation.</p>
    </div>
    <div v-else class="notes-list">
      <div v-for="note in notes" :key="note.id" class="note-item">
        <div class="note-header">
          <span class="note-author">{{ note.author }}</span>
          <span class="note-date">{{ formatDate(note.date) }}</span>
        </div>
        <p class="note-text">{{ note.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReservationNotes',
  props: {
    reservationId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      notes: []
    }
  },
  created() {
    this.notes = [
      {
        id: 1,
        text: 'Customer requested a window seat.',
        author: 'Staff',
        date: new Date().toISOString()
      },
      {
        id: 2,
        text: 'Allergy: Gluten-free menu required.',
        author: 'Manager',
        date: new Date(Date.now() - 86400000).toISOString()
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
.reservation-notes {
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 8px;
  margin-top: 1.5rem;
  border: 1px solid #e5e5e5;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.note-item {
  background: #ffffff;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.note-author {
  font-weight: 600;
  color: #2d3748;
}

.note-date {
  font-size: 0.875rem;
  color: #718096;
}

.note-text {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
}

.no-notes {
  text-align: center;
  padding: 3rem;
  color: #718096;
}
</style>

