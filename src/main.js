import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { 
  AlertPlugin, 
  BadgePlugin,
  ButtonPlugin,
  ButtonGroupPlugin,
  CardPlugin,
  FormPlugin,
  FormGroupPlugin,
  FormInputPlugin,
  FormRadioPlugin,
  InputGroupPlugin,
  LayoutPlugin,
  ModalPlugin,
  NavPlugin,
  NavbarPlugin,
  SkeletonPlugin,
  SpinnerPlugin,
  TablePlugin,
  TabsPlugin,
  ToastPlugin,
  IconsPlugin 
} from 'bootstrap-vue'

Vue.use(AlertPlugin)
Vue.use(BadgePlugin)
Vue.use(ButtonPlugin)
Vue.use(ButtonGroupPlugin)
Vue.use(CardPlugin)
Vue.use(FormPlugin)
Vue.use(FormGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(FormRadioPlugin)
Vue.use(InputGroupPlugin)
Vue.use(LayoutPlugin)
Vue.use(ModalPlugin)
Vue.use(NavPlugin)
Vue.use(NavbarPlugin)
Vue.use(SkeletonPlugin)
Vue.use(SpinnerPlugin)
Vue.use(TablePlugin)
Vue.use(TabsPlugin)
Vue.use(ToastPlugin)
Vue.use(IconsPlugin)

import VueClipboard from 'vue-clipboard2'
//VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)

import Parse from 'parse'
Vue.prototype.$parseAppId = 'bXXXBwI0yPdP41daYTIcSTBU5LoJOQ2Q8JYOpfj5';
Vue.prototype.$parseJsKey = 'rdCXaBV9yLuCm0AxFhv4w3Zwp3VJODV0F5xf5qiK';
Vue.prototype.$parseServerURL = 'rudiboard.b4a.io';
Parse.initialize(Vue.prototype.$parseAppId, Vue.prototype.$parseJsKey);
Parse.serverURL = 'https://' + Vue.prototype.$parseServerURL
Vue.prototype.$Parse = Parse 

Vue.config.productionTip = false

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
      return ("0"+d.getDate()).slice(-2)+"."+("0"+(d.getMonth()+1)).slice(-2)+"."+String(d.getFullYear()).slice(-2)+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);
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
        if (otherScore == 0) {
          player['winsToZero'] += 1;
        }
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
    makeToast(message) {
      this.$bvToast.toast(message, {
        //title: ``,
        autoHideDelay: 2000,
        appendToast: false,
        variant: 'success',
        toaster: 'b-toaster-top-center',
        solid: true,
        headerClass: 'd-none'
      })
    },
  },
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
