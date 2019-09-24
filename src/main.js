import Vue from 'vue'
import App from './App.vue'
import uswds from 'uswds'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons'
import { faWater } from '@fortawesome/free-solid-svg-icons'

Vue.component('font-awesome-icon', FontAwesomeIcon)

library.add(faHandHoldingHeart)
library.add(faLayerGroup)
library.add(faMinusSquare)
library.add(faWater)

Vue.config.productionTip = false
Vue.use(uswds)

new Vue({
  render: h => h(App),
}).$mount('#app')
