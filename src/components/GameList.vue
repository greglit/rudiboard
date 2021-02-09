<template>
  <div style="position:relative;" :class="!showMore? 'show-less':''">
    <section-nav title="Games" :showMore.sync="showMore" :showMoreNeeded="false"/>

    <div :key="'game'+game.objectId+key" v-for="(game, key) in games" :class="game.id == newestGameId ?'tdFadeInUp':''">
      <game-card :game="game"/>
    </div>

    <show-more :showMore.sync="showMore" v-if="games.length > numberGamesDisplayed"/>
  </div>
</template>

<script>
import GameCard from './GameCard.vue'
import SectionNav from './SectionNav.vue'
import ShowMore from './ShowMore.vue'
import TeamList from './TeamList.vue'

export default {
  components: { 
    GameCard,
    SectionNav,
    TeamList,
    ShowMore,
  },
  name: 'GameList',
  props: ['games', 'newestGameId'],
  data() {
    return {
      showMore: false,
      numberGamesDisplayed: 3,
    }
  },
}
</script>

<style scoped>
.show-less {
  max-height: 400px;
  overflow-y:hidden;
}
</style>
