import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import Parse from 'parse'
Vue.prototype.$parseAppId = 'bXXXBwI0yPdP41daYTIcSTBU5LoJOQ2Q8JYOpfj5';
Vue.prototype.$parseJsKey = 'rdCXaBV9yLuCm0AxFhv4w3Zwp3VJODV0F5xf5qiK';
Vue.prototype.$parseServerURL = 'rudiboard.b4a.io';
Parse.initialize(Vue.prototype.$parseAppId, Vue.prototype.$parseJsKey);
Parse.serverURL = 'https://' + Vue.prototype.$parseServerURL
Vue.prototype.$Parse = Parse 
/*
// test parse connection
new Parse.Object("Test", {"text" : "testing"}).save()
.then(function (obj) {
console.log("Success", obj);
})
.catch(function (e) {
alert("Error saving test object!" + e.message);
});*/


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
