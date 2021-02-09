<template>
  <div style="position:relative;" :class="!showMore? 'show-less':''">
    <section-nav 
      :title="teams? 'Team Standings' : 'Player Standings'"
    />
    <b-container style="overflow:hidden;" class="m-0 p-0">
      <b-row>
        <b-col>
        <b-table responsive
          :items="playersData"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          striped  >
          <template v-slot:cell(name)="data">
            <player-badge :name="data.value" />
          </template>
        </b-table>
        </b-col>
      </b-row>
    </b-container>

    <show-more v-if="playersData.length > numberItemsDisplayed" :showMore.sync="showMore"/>
  </div>
</template>

<script>
import _template from '../_template.vue'
import GameCard from './GameCard.vue'
import PlayerBadge from './PlayerBadge.vue'
import SectionNav from './SectionNav.vue'
import ShowMore from './ShowMore.vue'

export default {
  components: { 
    GameCard,
    SectionNav,
    PlayerBadge,
    ShowMore,
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
}
</script>

<style scoped>
.show-less {
  max-height: 400px;
  overflow-y:hidden;
}
</style>
