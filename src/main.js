/*!

=========================================================
* Vue Argon Design System - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system/blob/master/LICENSE.md)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import store from './store'

import Argon from "./plugins/argon-kit";
import './registerServiceWorker'
import Vuex from 'vuex'
import * as filters from './filters' // global filters
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import VueI18n from 'vue-i18n'
import zh_CN from './lang/zh_CN'

import ElementUI from 'element-ui';
import './element-variables.scss'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import './assets/iconfont.css'
import VueAnalytics from 'vue-analytics';

import './permission' // permission control

const messages = {
  zh_CN
}

Vue.config.productionTip = false;

Vue.use(VueI18n)
Vue.use(Vuex)
Vue.use(Argon)
Vue.use(ElementUI)
Vue.use(Toast, {
  position: "bottom-right",
})
Vue.use(VueAnalytics, {
  id: 'G-24BN5J40ZY',
  router
})
Vue.use(mavonEditor)

const i18n = new VueI18n({
  locale: 'zh_CN', // set locale
  messages, // set locale messages
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
