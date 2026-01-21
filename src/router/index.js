import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ReservationsList from '../views/ReservationsList.vue'
import ReservationDetails from '../views/ReservationDetails.vue'
import ReservationForm from '../views/ReservationForm.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/reservations',
    name: 'ReservationsList',
    component: ReservationsList
  },
  {
    path: '/reservations/:id',
    component: ReservationDetails,
    props: true,
    children: [
      {
        path: 'notes',
        name: 'ReservationNotes',
        component: () => import('../components/ReservationNotes.vue'),
        props: route => ({ reservationId: route.params.id })
      },
      {
        path: 'timeline',
        name: 'ReservationTimeline',
        component: () => import('../components/ReservationTimeline.vue'),
        props: route => ({ reservationId: route.params.id })
      }
    ]
  },
  {
    path: '/reservations/new',
    name: 'ReservationFormNew',
    component: ReservationForm,
    props: { isEdit: false }
  },
  {
    path: '/reservations/:id/edit',
    name: 'ReservationFormEdit',
    component: ReservationForm,
    props: route => ({ isEdit: true, reservationId: route.params.id })
  },
  {
    path: '/database',
    name: 'DatabaseView',
    component: () => import('../views/DatabaseView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.onError((error) => {
  console.error('Router error:', error)
})

export default router
