import Vue from 'vue'
import App from './App.vue'
import Vuex from "vuex"
import vuetify from './plugins/vuetify'
import storeConfig from './store'
import router from './router'

Vue.config.productionTip = false
Vue.use(Vuex)

const store = new Vuex.Store(storeConfig)

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
