import { localDB } from './reservations.js'

const loadUserFromStorage = () => {
  try {
    const stored = localStorage.getItem('user')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (parsed && typeof parsed === 'object' && parsed.name) {
      return parsed
    }
    return null
  } catch (error) {
    console.error('Error loading user from storage:', error)
    try {
      localStorage.removeItem('user')
    } catch (e) {
      console.error('Error clearing corrupted user data:', e)
    }
    return null
  }
}

const saveUserToStorage = (user) => {
  try {
    if (user) {
      if (!user.name || typeof user.name !== 'string') {
        throw new Error('Invalid user data: name is required')
      }
      localStorage.setItem('user', JSON.stringify(user))
      try {
        localDB.saveUser(user)
      } catch (dbError) {
        console.error('Error saving user to database:', dbError)
      }
    } else {
      localStorage.removeItem('user')
    }
  } catch (error) {
    console.error('Error saving user to storage:', error)
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please clear some data.')
    }
    throw error
  }
}

const state = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage()
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
    saveUserToStorage(user)
  },
  LOGOUT(state) {
    state.user = null
    state.isAuthenticated = false
    saveUserToStorage(null)
  }
}

const actions = {
  login({ commit }, userData) {
    try {
      if (!userData) {
        throw new Error('User data is required')
      }
      
      if (!userData.name || typeof userData.name !== 'string' || userData.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters')
      }
      
      if (!userData.email || typeof userData.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        throw new Error('Valid email is required')
      }
      
      const user = {
        id: Date.now().toString(),
        name: String(userData.name).trim(),
        email: String(userData.email).trim().toLowerCase(),
        loginTime: new Date().toISOString()
      }
      
      commit('SET_USER', user)
      return user
    } catch (error) {
      console.error('Error in login action:', error)
      throw error
    }
  },
  logout({ commit }) {
    try {
      commit('LOGOUT')
    } catch (error) {
      console.error('Error in logout action:', error)
    }
  },
  updateUser({ commit, state }, userData) {
    try {
      if (!state.user) {
        throw new Error('No user to update')
      }
      
      if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid user data')
      }
      
      const updatedUser = {
        ...state.user,
        ...userData
      }
      
      if (updatedUser.name && (typeof updatedUser.name !== 'string' || updatedUser.name.trim().length < 2)) {
        throw new Error('Name must be at least 2 characters')
      }
      
      if (updatedUser.email && (typeof updatedUser.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedUser.email))) {
        throw new Error('Valid email is required')
      }
      
      commit('SET_USER', updatedUser)
    } catch (error) {
      console.error('Error in updateUser action:', error)
      throw error
    }
  }
}

const getters = {
  currentUser: (state) => state.user,
  isAuthenticated: (state) => state.isAuthenticated,
  userName: (state) => state.user?.name || 'Guest'
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

