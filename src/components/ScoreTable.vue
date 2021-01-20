<template>
  <div>
    <b-navbar class="border-top p-0">
    <b-navbar-nav>
      <b-nav-text>
        <h4 class="">Player Standings</h4>
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
    
    <div style="overflow:hidden">
      <b-table responsive
        :items="displayedItems"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        striped 
        bordered
      >
      
      </b-table>
    </div>
  </div>
</template>

<script>
import GameCard from './GameCard.vue'
export default {
  components: { 
    GameCard,
  },
  name: 'ScoreTable',
  props: ['games', 'players'],
  data() {
    return {
      showAll: false,
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
      ]
    }
  },
  computed: {
    displayedItems() {
      if (this.showAll) {
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
        };
      }
      for (const game of this.games) {
        for (const player of game.get('team1')) {
          playerDict[player] = this.assignPoints(playerDict[player], game.get('team1Score'), game.get('team2Score'));
        }
        for (const player of game.get('team2')) {
          playerDict[player] = this.assignPoints(playerDict[player], game.get('team2Score'), game.get('team1Score'));
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
    }
  }
}
</script>

<style scoped>

</style>
