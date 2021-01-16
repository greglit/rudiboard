<template>
  <div>
      <div :key="'game'+game.objectId+key" v-for="(game, key) in games" class="tdFadeInUp">
        <game-card :game="game"/>
      </div>
      <add-game/>
  </div>
</template>

<script>
import Parse from 'parse'
import AddGame from './AddGame.vue'
import GameCard from './GameCard.vue'

export default {
  name: 'Board',
  components: {
    AddGame,
    GameCard,
  },
  data() {
    return {
      numberGamesDisplayed: 5,
      games: []
    }
  },
  async mounted() {
    this.getGames()

    var query = new this.$Parse.Query('Game');
    let subscription = await query.subscribe();
    subscription.on('create', game => {
      this.getGames()
    });
    subscription.on('delete', game => {
      this.getGames()
    });
  },
  methods: {
    async getGames() {
      var query = new this.$Parse.Query('Game');
      query.ascending('createdAt');//.limit(this.numberGamesDisplayed);
      this.games = await query.find();
    }
  }
}
</script>

<style scoped>
  .tdFadeInUp {
    -webkit-animation-duration: 0.4s;
            animation-duration: 0.4s;
    -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
    -webkit-animation-name: tdFadeInUp;
            animation-name: tdFadeInUp;
  }
  @-webkit-keyframes tdFadeInUp {
    0% {
      opacity: 0;
      transform: translateY(10px);
      -webkit-animation-timing-function: cubic-bezier(0, 0.59, 0.375, 1);
              animation-timing-function: cubic-bezier(0, 0.59, 0.375, 1);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes tdFadeInUp {
    0% {
      opacity: 0;
      transform: translateY(10px);
      -webkit-animation-timing-function: cubic-bezier(0, 0.59, 0.375, 1);
              animation-timing-function: cubic-bezier(0, 0.59, 0.375, 1);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>