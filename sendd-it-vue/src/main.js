// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import firebaseApp from './firebase'
// import database from './db'
Vue.config.productionTip = false
// Vue.use(firebaseApp)
// Vue.use(database)
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
