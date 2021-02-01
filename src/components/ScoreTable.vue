<template>
  <div>
    <section-nav 
      :title="teams? 'Team Standings' : 'Player Standings'" 
      :showMore.sync="showMore"
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
  props: ['games', 'players', 'teams'],
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
      ]
    }
  },
  computed: {
    displayedItems() {
      if (this.showMore) {
        return this.items
      } else {
        return this.items.slice(0, this.numberItemsDisplayed);
      }
    },
    items() {
      var playerDict = {};
      for (const player of this.players) {
        playerDict[player] = {
          gamesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor : 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points : 0,
          winsToZero: 0,
        };
      }
      for (const game of this.games) {
        if (this.teams) {
          if (game.get('team1').length > 1) {
            var team1name = this.getTeamNameList(game.get('team1'));
            playerDict[team1name] = this.assignPoints(playerDict[team1name], game.get('team1Score'), game.get('team2Score'));
          }
          if (game.get('team2').length > 1) {
            var team2name = this.getTeamNameList(game.get('team2'));
            playerDict[team2name] = this.assignPoints(playerDict[team2name], game.get('team2Score'), game.get('team1Score'));
          }
        } else {
          for (const player of game.get('team1')) {
            playerDict[player] = this.assignPoints(playerDict[player], game.get('team1Score'), game.get('team2Score'));
          }
          for (const player of game.get('team2')) {
            playerDict[player] = this.assignPoints(playerDict[player], game.get('team2Score'), game.get('team1Score'));
          }
        }
      }
      var playerList = [];
      for (const [key, value] of Object.entries(playerDict)) {
        value['name'] = key;
        playerList.push(value);
      }
      return playerList;
    },
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
