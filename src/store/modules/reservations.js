import axios from 'axios'

class LocalDatabase {
  constructor() {
    this.dbName = 'reservations_db'
    this.init()
  }

  init() {
    try {
      if (!localStorage.getItem(this.dbName)) {
        localStorage.setItem(this.dbName, JSON.stringify({
          reservations: [],
          users: [],
          settings: {}
        }))
      }
    } catch (error) {
      console.error('Error initializing database:', error)
    }
  }

  getDB() {
    try {
      const stored = localStorage.getItem(this.dbName)
      if (!stored) {
        return { reservations: [], users: [], settings: {} }
      }
      return JSON.parse(stored)
    } catch (error) {
      console.error('Error reading from database:', error)
      return { reservations: [], users: [], settings: {} }
    }
  }

  saveDB(data) {
    try {
      localStorage.setItem(this.dbName, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to database:', error)
      if (error.name === 'QuotaExceededError') {
        try {
          const db = this.getDB()
          if (db.reservations && db.reservations.length > 50) {
            db.reservations = db.reservations.slice(-50)
            localStorage.setItem(this.dbName, JSON.stringify(db))
          }
        } catch (e) {
          console.error('Error clearing space:', e)
        }
      }
    }
  }

  getAllReservations() {
    try {
      const db = this.getDB()
      return Array.isArray(db.reservations) ? db.reservations : []
    } catch (error) {
      console.error('Error getting all reservations:', error)
      return []
    }
  }

  saveReservation(reservation) {
    try {
      if (!reservation || !reservation.id) {
        throw new Error('Invalid reservation data')
      }
      const db = this.getDB()
      if (!Array.isArray(db.reservations)) db.reservations = []
      db.reservations.push(reservation)
      this.saveDB(db)
      return reservation
    } catch (error) {
      console.error('Error saving reservation:', error)
      throw error
    }
  }

  updateReservation(id, updates) {
    try {
      if (!id) {
        throw new Error('Reservation ID is required')
      }
      const db = this.getDB()
      if (!Array.isArray(db.reservations)) {
        return null
      }
      const index = db.reservations.findIndex(r => r && r.id === id)
      if (index !== -1) {
        db.reservations[index] = { ...db.reservations[index], ...updates }
        this.saveDB(db)
        return db.reservations[index]
      }
      return null
    } catch (error) {
      console.error('Error updating reservation:', error)
      return null
    }
  }

  deleteReservation(id) {
    try {
      if (!id) {
        throw new Error('Reservation ID is required')
      }
      const db = this.getDB()
      if (!Array.isArray(db.reservations)) {
        return
      }
      db.reservations = db.reservations.filter(r => r && r.id !== id)
      this.saveDB(db)
    } catch (error) {
      console.error('Error deleting reservation:', error)
    }
  }

  getReservationById(id) {
    try {
      if (!id) {
        return null
      }
      const db = this.getDB()
      if (!Array.isArray(db.reservations)) {
        return null
      }
      return db.reservations.find(r => r && r.id === id) || null
    } catch (error) {
      console.error('Error getting reservation by ID:', error)
      return null
    }
  }

  getAllUsers() {
    try {
      const db = this.getDB()
      return Array.isArray(db.users) ? db.users : []
    } catch (error) {
      console.error('Error getting all users:', error)
      return []
    }
  }

  saveUser(user) {
    try {
      if (!user || !user.id) {
        throw new Error('Invalid user data')
      }
      const db = this.getDB()
      if (!Array.isArray(db.users)) db.users = []
      
      const existingIndex = db.users.findIndex(u => u && u.email === user.email)
      if (existingIndex !== -1) {
        db.users[existingIndex] = { ...db.users[existingIndex], ...user }
      } else {
        db.users.push(user)
      }
      this.saveDB(db)
      return user
    } catch (error) {
      console.error('Error saving user:', error)
      throw error
    }
  }

  getUserById(id) {
    try {
      if (!id) {
        return null
      }
      const db = this.getDB()
      if (!Array.isArray(db.users)) {
        return null
      }
      return db.users.find(u => u && u.id === id) || null
    } catch (error) {
      console.error('Error getting user by ID:', error)
      return null
    }
  }

  getUserByEmail(email) {
    try {
      if (!email) {
        return null
      }
      const db = this.getDB()
      if (!Array.isArray(db.users)) {
        return null
      }
      return db.users.find(u => u && u.email === email.toLowerCase()) || null
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }
}

const localDB = new LocalDatabase()

const state = {
  reservations: localDB.getAllReservations(),
  loading: false,
  error: null
}

const mutations = {
  SET_RESERVATIONS(state, reservations) {
    try {
      if (!Array.isArray(reservations)) {
        console.warn('SET_RESERVATIONS: reservations is not an array')
        state.reservations = []
        return
      }
      state.reservations = reservations
      const db = localDB.getDB()
      db.reservations = reservations
      localDB.saveDB(db)
    } catch (error) {
      console.error('Error in SET_RESERVATIONS:', error)
      state.error = 'Error saving reservations'
    }
  },
  ADD_RESERVATION(state, reservation) {
    try {
      if (!reservation || !reservation.id) {
        throw new Error('Invalid reservation data')
      }
      if (!Array.isArray(state.reservations)) {
        state.reservations = []
      }
      state.reservations.push(reservation)
      localDB.saveReservation(reservation)
    } catch (error) {
      console.error('Error in ADD_RESERVATION:', error)
      state.error = 'Error adding reservation'
      throw error
    }
  },
  UPDATE_RESERVATION(state, updatedReservation) {
    try {
      if (!updatedReservation || !updatedReservation.id) {
        throw new Error('Invalid reservation data')
      }
      if (!Array.isArray(state.reservations)) {
        state.reservations = []
        return
      }
      const index = state.reservations.findIndex(r => r && r.id === updatedReservation.id)
      if (index !== -1) {
        state.reservations[index] = updatedReservation
        localDB.updateReservation(updatedReservation.id, updatedReservation)
      }
    } catch (error) {
      console.error('Error in UPDATE_RESERVATION:', error)
      state.error = 'Error updating reservation'
    }
  },
  DELETE_RESERVATION(state, reservationId) {
    try {
      if (!reservationId) {
        throw new Error('Reservation ID is required')
      }
      if (!Array.isArray(state.reservations)) {
        state.reservations = []
        return
      }
      state.reservations = state.reservations.filter(r => r && r.id !== reservationId)
      localDB.deleteReservation(reservationId)
    } catch (error) {
      console.error('Error in DELETE_RESERVATION:', error)
      state.error = 'Error deleting reservation'
    }
  },
  SET_LOADING(state, loading) {
    state.loading = Boolean(loading)
  },
  SET_ERROR(state, error) {
    state.error = error || null
  }
}

const actions = {
  async fetchReservations({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const timeout = 10000
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await axios.get('https://jsonplaceholder.typicode.com/users?_limit=3', {
        timeout: timeout,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid API response format')
      }
      
      const sampleReservations = response.data
        .filter(user => user && user.id && user.name && user.email)
        .map((user, index) => {
          try {
            const date = new Date()
            date.setDate(date.getDate() + index + 1)
            return {
              id: `sample-${user.id}`,
              customerName: String(user.name || '').trim() || 'Unknown Customer',
              customerEmail: String(user.email || '').trim() || 'unknown@example.com',
              customerPhone: `+1-555-${1000 + (user.id || index)}`,
              reservationType: ['dinner', 'lunch', 'event'][index % 3] || 'dinner',
              numberOfGuests: [2, 4, 6][index % 3] || 2,
              reservationDate: date.toISOString().split('T')[0],
              reservationTime: ['19:00', '12:30', '18:00'][index % 3] || '19:00',
              status: ['pending', 'confirmed', 'confirmed'][index % 3] || 'pending',
              specialRequests: `Special request for ${user.name}`,
              createdBy: `Staff Member ${index + 1}`,
              createdAt: new Date().toISOString()
            }
          } catch (err) {
            console.error('Error creating sample reservation:', err)
            return null
          }
        })
        .filter(res => res !== null)

      const existingReservations = localDB.getAllReservations()
      const allReservations = [...existingReservations, ...sampleReservations]
      
      const uniqueReservations = allReservations.filter((res, index, self) =>
        res && res.id && index === self.findIndex(r => r && r.id === res.id)
      )

      commit('SET_RESERVATIONS', uniqueReservations)
      commit('SET_ERROR', null)
    } catch (error) {
      let errorMessage = 'Error loading reservations'
      
      if (error.code === 'ECONNABORTED' || error.message === 'canceled') {
        errorMessage = 'Request timeout. Please check your connection.'
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status}`
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.message || 'Error loading reservations'
      }
      
      commit('SET_ERROR', errorMessage)
      console.error('Error fetching reservations:', error)
      
      try {
        const localReservations = localDB.getAllReservations()
        commit('SET_RESERVATIONS', localReservations)
      } catch (localError) {
        console.error('Error loading local reservations:', localError)
        commit('SET_RESERVATIONS', [])
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },
  addReservation({ commit, rootGetters }, reservation) {
    try {
      if (!reservation || typeof reservation !== 'object') {
        throw new Error('Reservation data is required')
      }
      
      const customerName = reservation.customerName ? String(reservation.customerName).trim() : ''
      if (!customerName || customerName.length < 2) {
        throw new Error('Customer name must be at least 2 characters')
      }
      
      const customerEmail = reservation.customerEmail ? String(reservation.customerEmail).trim() : ''
      if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        throw new Error('Valid email is required')
      }
      
      const customerPhone = reservation.customerPhone ? String(reservation.customerPhone).trim() : ''
      if (customerPhone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        if (!phoneRegex.test(customerPhone)) {
          throw new Error('Please enter a valid phone number')
        }
      }
      
      if (!reservation.reservationType) {
        throw new Error('Reservation type is required')
      }
      
      if (!reservation.reservationDate) {
        throw new Error('Reservation date is required')
      }
      
      if (!reservation.reservationTime) {
        throw new Error('Reservation time is required')
      }
      
      const numberOfGuests = parseInt(reservation.numberOfGuests) || 2
      if (numberOfGuests < 1 || numberOfGuests > 20) {
        throw new Error('Number of guests must be between 1 and 20')
      }
      
      const currentUser = rootGetters['user/currentUser']
      const newReservation = {
        ...reservation,
        id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        status: reservation.status || 'pending',
        createdBy: currentUser ? String(currentUser.name || 'Unknown') : 'Unknown',
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        reservationType: String(reservation.reservationType),
        numberOfGuests: numberOfGuests,
        reservationDate: String(reservation.reservationDate),
        reservationTime: String(reservation.reservationTime),
        specialRequests: reservation.specialRequests ? String(reservation.specialRequests).trim() : ''
      }
      
      commit('ADD_RESERVATION', newReservation)
      return newReservation
    } catch (error) {
      console.error('Error adding reservation:', error)
      commit('SET_ERROR', error.message || 'Error adding reservation')
      throw error
    }
  },
  updateReservation({ commit }, reservation) {
    try {
      if (!reservation || !reservation.id) {
        throw new Error('Invalid reservation data')
      }
      commit('UPDATE_RESERVATION', reservation)
    } catch (error) {
      console.error('Error updating reservation:', error)
      commit('SET_ERROR', error.message || 'Error updating reservation')
      throw error
    }
  },
  deleteReservation({ commit }, reservationId) {
    try {
      if (!reservationId) {
        throw new Error('Reservation ID is required')
      }
      commit('DELETE_RESERVATION', reservationId)
    } catch (error) {
      console.error('Error deleting reservation:', error)
      commit('SET_ERROR', error.message || 'Error deleting reservation')
      throw error
    }
  }
}

const getters = {
  allReservations: (state) => state.reservations,
  reservationById: (state) => (id) => state.reservations.find(r => r.id === id),
  reservationsByStatus: (state) => (status) => state.reservations.filter(r => r.status === status),
  reservationsByType: (state) => (type) => state.reservations.filter(r => r.reservationType === type),
  reservationsByDate: (state) => (date) => state.reservations.filter(r => r.reservationDate === date)
}

export { localDB }

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

