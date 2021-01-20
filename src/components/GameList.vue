<template>
  <div>
    <b-navbar class="border-top p-0">
    <b-navbar-nav>
      <b-nav-text>
        <h4 class="">Games</h4>
      </b-nav-text>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <b-nav-item right>
        <b-button variant="outline-secondary" size="sm" @click="showAll = !showAll">
          <div v-if="!showAll">
            Show more
            <b-icon-arrow-down/>
          </div>
          <div v-else>
            Show less
            <b-icon-arrow-up/>
          </div>
        </b-button>
      </b-nav-item>
    </b-navbar-nav>
    </b-navbar>
    
    
    <div :key="'game'+game.objectId+key" v-for="(game, key) in displayedGames" :class="game.id == newestGameId ?'tdFadeInUp':''">
      <game-card :game="game"/>
    </div>
  </div>
</template>

<script>
import GameCard from './GameCard.vue'
export default {
  components: { 
    GameCard,
  },
  name: 'GameList',
  props: ['games', 'newestGameId'],
  data() {
    return {
      showAll: false,
      numberGamesDisplayed: 5,
    }
  },
  computed: {
    displayedGames() {
      if (this.showAll) {
        return this.games
      } else {
        return this.games.slice(0, this.numberGamesDisplayed);
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
