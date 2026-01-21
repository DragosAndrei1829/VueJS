import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style.css'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Error info:', info)
}

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  event.preventDefault()
})

app.use(router)
app.use(store)
app.mount('#app')

