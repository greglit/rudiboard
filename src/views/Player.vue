<template>
  <div>
    <b-container class="mt-4 px-md-0">
      <div v-if="loading">
        <b-card>
          <b-skeleton width="85%"></b-skeleton>
          <b-skeleton width="55%"></b-skeleton>
          <b-skeleton width="70%"></b-skeleton>
        </b-card>
      </div>
      <div v-else>

        <h1 class="display-5">{{playerName}}</h1>
        <hr>
        <h2>Points: {{playerData.points}}</h2>
        <h2>Goal Difference: {{playerData.goalDifference}}</h2>
        <hr>
        <pie-chart :pieData="[playerData.wins, playerData.draws, playerData.losses]"/>

      </div>
      
    </b-container>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import PieChart from '../components/PieChart.vue';

export default {
  name: 'Player',
  components: {
    Navbar,
    PieChart
  },
  data() {
    return {
      loading: true,
      games: [],
      board: Object,
      playerName: this.$route.params.playerName,
    }
  },
  created () {
    this.loading = true;
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  async mounted() {
    var query = new this.$Parse.Query('Game');
    query.equalTo("boardId", this.$route.params.boardId)
    let subscription = await query.subscribe();
    subscription.on('create', game => {
      this.fetchData()
    });
    subscription.on('delete', game => {
      this.fetchData()
    });
  },
  computed: {
    playerData() {
      var playerDict = {
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor : 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points : 0,
      };
      for (const game of this.games) {
        if (this.playerName.includes(',')) { //playername is actually a team
          if (this.getTeamNameList(game.get('team1')) == this.playerName) {

            playerDict = this.assignPoints(playerDict, game.get('team1Score'), game.get('team2Score'));

          } else if (this.getTeamNameList(game.get('team2')) == this.playerName) {

            playerDict = this.assignPoints(playerDict, game.get('team2Score'), game.get('team1Score'));
          }
        } else { //player
          for (const player of game.get('team1')) {
            if (player == this.playerName) {
              playerDict = this.assignPoints(playerDict, game.get('team1Score'), game.get('team2Score'));
            }
          }
          for (const player of game.get('team2')) {
            if (player == this.playerName) {
              playerDict = this.assignPoints(playerDict, game.get('team2Score'), game.get('team1Score'));
            }
          }
        }
      }
      return playerDict;
    },
  },
  methods: {
    async fetchData() {
      var gameQuery = new this.$Parse.Query('Game');
      gameQuery.equalTo("boardId", this.$route.params.boardId).descending('createdAt');
      this.games = await gameQuery.find();

      var boardQuery = new this.$Parse.Query('Board');
      boardQuery.equalTo("boardId", this.$route.params.boardId);
      var boardQueryResult = await boardQuery.find();
      this.board = boardQueryResult[0]
      this.loading = false;
    },
  }
}
</script>

<style scoped>
  .board-title {
    color: white;
  }

  .abs-center-x {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
</style>