import { createStore } from 'vuex'
import reservationsModule from './modules/reservations'
import userModule from './modules/user'

export default createStore({
  modules: {
    reservations: reservationsModule,
    user: userModule
  }
})
