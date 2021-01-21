<template>
  <div>
    <section-nav title="Games" :showMore.sync="showMore" />

    <div :key="'game'+game.objectId+key" v-for="(game, key) in displayedGames" :class="game.id == newestGameId ?'tdFadeInUp':''">
      <game-card :game="game"/>
    </div>
  </div>
</template>

<script>
import GameCard from './GameCard.vue'
import SectionNav from './SectionNav.vue'

export default {
  components: { 
    GameCard,
    SectionNav,
  },
  name: 'GameList',
  props: ['games', 'newestGameId'],
  data() {
    return {
      showMore: false,
      numberGamesDisplayed: 3,
    }
  },
  computed: {
    displayedGames() {
      if (this.showMore) {
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
