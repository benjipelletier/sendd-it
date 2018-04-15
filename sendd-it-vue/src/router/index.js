import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Track from '@/components/Track'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      meta: { title: 'Sendd.it' }
    },
    {
      path: '/track/:id',
      name: 'Track',
      component: Track,
      meta: {
        title: 'Sendd.it'
      }
    }
  ]
})

export default router

router.afterEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})
