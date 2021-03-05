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

        <b-card class="mb-4">
          <b-tabs pills fill>
            <hr>
            <b-tab title="Add Game" :active="tournament == undefined">
              <add-game :players="playerList"/>
            </b-tab>
            <b-tab :title="(tournament == undefined ? 'Plan' : 'Running') +' Tournament'" :active="tournament != undefined">
              <plan-tournament :tournament="tournament" :players="playerList" :games="games" :playerData="playerData"/>
            </b-tab>
          </b-tabs>
        </b-card>
        
        <br>
        <br>
        <game-list :games="games" :newestGameId="newestGameId" class="mb-4"/>
        <br>
        <br>
        <score-table :playersData="playerData"/>
        <br>
        <br>
        <score-table :playersData="teamData" teams="true"/>
        <br>
        <br>

      </div>
      
    </b-container>
  </div>
</template>

<script>
//import {Howl} from 'howler';
import AddGame from '../components/AddGame'
import GameCard from '../components/GameCard'
import Navbar from '../components/Navbar.vue';
import GameList from '../components/GameList.vue';
import ScoreTable from '../components/ScoreTable.vue';
import PlanTournament from '../components/PlanTournament.vue';

export default {
  name: 'Board',
  components: {
    AddGame,
    GameCard,
    Navbar,
    GameList,
    ScoreTable,
    PlanTournament,
  },
  data() {
    return {
      loading: true,
      games: [],
      board: Object,
      tournament: undefined,
      //notifySound: Object,
      newestGameId: String,
    }
  },
  created () {
    this.loading = true;
    //this.notifySound = new Howl({ src: ['notify.mp3'] })
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  async mounted() {
    var gameQuery = new this.$Parse.Query('Game');
    gameQuery.equalTo("boardId", this.$route.params.boardId)
    let gameSubscription = await gameQuery.subscribe();
    gameSubscription.on('create', game => {
      //this.notifySound.play();
      this.newestGameId = game.id;
      this.fetchData()
    });
    gameSubscription.on('delete', game => {
      this.fetchData()
    });

    var tourQuery = new this.$Parse.Query('Tournament');
    tourQuery.equalTo("boardId", this.$route.params.boardId);
    let tourSubscription = await tourQuery.subscribe();
    tourSubscription.on('create', game => {
      //console.log('create')
      this.fetchData();
    });
    tourSubscription.on('delete', game => {
      //console.log('delete')
      this.fetchData();
    });
    tourSubscription.on('update', game => {
      //console.log('update')
      this.fetchData();
    });
  },
  computed: {
    playerList() {
      var playerList = [];
      for (const game of this.games) {
        var players = game.get('team1').concat(game.get('team2'));
        for (const player of players){
          if (playerList.indexOf(player) === -1) {
            playerList.push(player);
          }
        }
      }
      return playerList;
    },
    playerData() {
      //console.log('playerDatacompute')
      return this.getPlayersDataList(this.playerList, false);
    },
    teamList() {
      var teamList = [];
      for (const game of this.games) {
        if (game.get('team1').length > 1) {
          var team1name = this.getTeamNameList(game.get('team1'));
          if (teamList.indexOf(team1name) === -1) {
            teamList.push(team1name);
          }
        }
        if (game.get('team2').length > 1) {
          var team2name = this.getTeamNameList(game.get('team2'));
          if (teamList.indexOf(team2name) === -1) {
            teamList.push(team2name);
          }
        }
      }
      return teamList;
    },
    teamData(){
      //console.log('teamDatacompute')
      return this.getPlayersDataList(this.teamList, true);
    }
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

      var tourQuery = new this.$Parse.Query('Tournament');
      tourQuery.equalTo("boardId", this.$route.params.boardId).equalTo("active", true);
      var tournamentQueryResult = await tourQuery.find();
      this.tournament = tournamentQueryResult[0];

      
    },
    getPlayersDataList(players, playersAreTeams) {
      var playerDict = {};
      for (const player of players) {
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
        if (playersAreTeams) {
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
    /*isNew(game) { //:class="isNew(game) ?'tdFadeInUp':''"
      let createdAt = game.get('createdAt');
      let tenSecondsAgo = Date.now() - 10 * 1000 //millliseconds
      if (createdAt > tenSecondsAgo) {
        //console.log("new!")
        this.notifySound.play();
        return true;
      }
    },*/
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