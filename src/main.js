import Vue from 'vue'
import App from './App.vue'
import uswds from 'uswds'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)

library.add(faLayerGroup)

Vue.config.productionTip = false
Vue.use(uswds)

new Vue({
  render: h => h(App),
}).$mount('#app')
