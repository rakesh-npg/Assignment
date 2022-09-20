import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import routes from './routes'
import SearchBox from './components/SearchBox.vue'
Vue.use(VueRouter)
Vue.config.productionTip = false

Vue.component('SearchBox', SearchBox)

const router = new VueRouter({
  routes: routes, 
  mode: 'history'
});

new Vue({
  router, 
  vuetify,
  render: h => h(App)
}).$mount('#app')
