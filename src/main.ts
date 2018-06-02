import Vue from 'vue';


import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/fonts/material-icons.css';//burası test edilmeli veya kısaca index.html' e ekle.

import VueChart from 'vue-chart-js';

import App from './App.vue';
import router from './router';
import store from './store/index';

import registerComponents from '@/registerComponents';


Vue.use(Vuetify);
Vue.use(VueChart);

registerComponents();
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
