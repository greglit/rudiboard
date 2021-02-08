<template>
  <div>
    <section-nav 
      :title="teams? 'Team Standings' : 'Player Standings'" 
      :showMore.sync="showMore"
      :showMoreNeeded="playersData.length > numberItemsDisplayed"
    />
    
    <div style="overflow:hidden">
      <b-table responsive
        :items="displayedItems"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        striped 
      >
        <template v-slot:cell(name)="data">
          <player-badge :name="data.value" />
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import _template from '../_template.vue'
import GameCard from './GameCard.vue'
import PlayerBadge from './PlayerBadge.vue'
import SectionNav from './SectionNav.vue'

export default {
  components: { 
    GameCard,
    SectionNav,
    PlayerBadge,
  },
  name: 'GameList',
  props: ['playersData', 'teams'],
  data() {
    return {
      showMore: false,
      numberItemsDisplayed: 5,
      sortBy: 'points',
      sortDesc: true,

      fields: [
        { key: "name", label: "Name", sortable: true },
        { key: "points", label: "Points", sortable: true },
        { key: "goalDifference", label: "Goal Difference", sortable: true },
        { key: "gamesPlayed", label: "Games Played", sortable: true },
        { key: "wins", label: "Wins", sortable: true },
        { key: "draws", label: "Draws", sortable: true },
        { key: "losses", label: "Losses", sortable: true },
        { key: "goalsFor", label: "Goals For", sortable: true },
        { key: "goalsAgainst", label: "Goals Against", sortable: true },
        { key: "winsToZero", label: "Wins To Zero", sortable: true },
      ],
    }
  },
  computed: {
    displayedItems() {
      if (this.showMore) {
        return this.playersData
      } else {
        return this.playersData.slice(0, this.numberItemsDisplayed);
      }
    },
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
