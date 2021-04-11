<template>
  <div style="position:relative;" :class="!showMore? 'show-less':''">
    <section-nav 
      :title="teams? 'Team Standings' : 'Player Standings'"
    />
    <b-container style="overflow:hidden;" class="m-0 p-0">
      <b-row>
        <b-col>
<b-table responsive
  :items="sortedPlayersData"
  :fields="fields"
  striped
  :key="JSON.stringify(sortedPlayersData)"
    >

  <template #head()="data">
    <div @click="setSort(data.column)" style="cursor:pointer;">
      {{ data.label }}
      <b-badge v-if="data.column == sortFirst">
        <b-icon-sort-down v-if="sortFirstDesc"/>
        <b-icon-sort-up v-else/>
        <span v-if="sortSecond != ''">1. prio</span>
      </b-badge>
      <b-badge v-if="data.column == sortSecond">
        <b-icon-sort-down v-if="sortSecondDesc"/>
        <b-icon-sort-up v-else/>
        2. prio
      </b-badge>
    </div>
  </template>

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
      sortFirst: 'points',
      sortSecond: 'goalDifference',
      sortFirstDesc: true,
      sortSecondDesc: true,


      fields: [
        { key: "name", label: "Name", sortable: false },
        { key: "points", label: "Points", sortable: false },
        { key: "goalDifference", label: "Goal Difference", sortable: false },
        { key: "gamesPlayed", label: "Games Played", sortable: false },
        { key: "wins", label: "Wins", sortable: false },
        { key: "draws", label: "Draws", sortable: false },
        { key: "losses", label: "Losses", sortable: false },
        { key: "goalsFor", label: "Goals For", sortable: false },
        { key: "goalsAgainst", label: "Goals Against", sortable: false },
        { key: "winsToZero", label: "Wins To Zero", sortable: false },
      ],
    }
  },
  computed: {
    sortedPlayersData() {
      const sorted = this.playersData.sort((a,b) => {
        const sortVal = this.sortFirstDesc ? b[this.sortFirst] - a[this.sortFirst] : a[this.sortFirst] - b[this.sortFirst]
        if (sortVal === 0) {
          return this.sortSecondDesc ? b[this.sortSecond] - a[this.sortSecond] : a[this.sortSecond] - b[this.sortSecond]
        }
        return sortVal
      });
      return sorted
    },
  },
  methods: {
    setSort(fieldKey) {
      if (this.sortFirst === fieldKey) {
        if (this.sortFirstDesc === false) {
          this.sortFirst = this.sortSecond;
          this.sortSecond = '';
          this.sortFirstDesc = this.sortSecondDesc;
          this.sortSecondDesc = true;
        } else {
          this.sortFirstDesc = !this.sortFirstDesc;
        }
      } else if (this.sortSecond === fieldKey) {
        if (this.sortSecondDesc === false) {
          this.sortSecond = '';
          this.sortSecondDesc = true;
        } else {
          this.sortSecondDesc = !this.sortSecondDesc;
        }
      } else if (this.sortFirst === '') {
        this.sortFirst = fieldKey;
      } else if (this.sortFirst !== '' && this.sortSecond === '') {
        this.sortSecond = fieldKey
      } else if (this.sortFirst !== '' && this.sortSecond !== '') {
        this.sortFirst = fieldKey;
        this.sortFirstDesc = true;
        this.sortSecond = '';
        this.sortSecondDesc = true;
      }
    }
  }
}

</script>

<style scoped>
.show-less {
  max-height: 400px;
  overflow-y:hidden;
}
</style>
