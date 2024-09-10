import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import audio from 'vue-mobile-audio'
import router from './router' 
import './font.css'
import * as THREE from 'three';
import storage from "./tools/storage.js";
import { createPinia, PiniaVuePlugin } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
const pinia = createPinia()
Vue.use(storage);
pinia.use(piniaPersist)
Vue.use(PiniaVuePlugin)
Vue.config.productionTip = false
Vue.use(audio)
Vue.use(ElementUI);


window.isOpenDigital = window.navigator.userAgent.indexOf("Chrome") > -1;
if (isOpenDigital) {
  //谷歌版本默认加载数字人./public/digitalPlayer/DigitalService.js
  import("../public/digitalPlayer/DigitalService").then(digtalInstall => {
    digtalInstall.DigitalService.initDigitalService();
    Vue.use(digtalInstall); // this.$digitalService
  });
}

window.vm = new Vue({
  el: '#app',
  router,
  THREE,
  pinia,
  render: h => h(App)
}).$mount('#app');

import second from '../public/second/second.vue'



/* eslint-disable no-new */
new Vue({
  render: h => h(second)
}).$mount('#second')


