import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
//following imports moved to App.vue style section
//import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import Parse from 'parse'
Vue.prototype.$parseAppId = 'bXXXBwI0yPdP41daYTIcSTBU5LoJOQ2Q8JYOpfj5';
Vue.prototype.$parseJsKey = 'rdCXaBV9yLuCm0AxFhv4w3Zwp3VJODV0F5xf5qiK';
Vue.prototype.$parseServerURL = 'rudiboard.b4a.io';
Parse.initialize(Vue.prototype.$parseAppId, Vue.prototype.$parseJsKey);
Parse.serverURL = 'https://' + Vue.prototype.$parseServerURL
Vue.prototype.$Parse = Parse 

Vue.config.productionTip = false

// Mixins
Vue.mixin({
  methods: {
    getTeamNameList(team) {
      var teamNameList = ''
      for (const [i, name] of team.entries()) {
        teamNameList += name;
        teamNameList += i != team.length-1 ? ', ' : '';
      }
      return teamNameList;
    },
    getDateAsString(d) {
      return ("0"+d.getDate()).slice(-2)+"."+("0"+(d.getMonth()+1)).slice(-2)+"."+d.getFullYear()+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);
    },
    assignPoints(player, ownScore, otherScore) {
      player['gamesPlayed'] += 1
      player['goalsFor'] += Number(ownScore)
      player['goalsAgainst'] += Number(otherScore)
      player['goalDifference'] += Number(ownScore)
      player['goalDifference'] -= Number(otherScore)
      if (ownScore - otherScore > 0) { //team1 won
        player['wins'] += 1
        player['points'] += 3
      } else if (ownScore - otherScore == 0) { //draw
        player['draws'] += 1
        player['points'] += 1
      } else { //team2 won
        player['losses'] += 1
      }
      return player;
    },
    randNum(min, max) {
      return Math.random() * (max - min) + min;
    },
  },
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
