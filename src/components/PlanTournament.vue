<template>
  <div class="mt-4">
    <b-form v-if="tournament == undefined">
      <b-form-input v-model="tourName" placeholder="Enter tournament name" class="rounded-0"></b-form-input>
      <vue-tags-input
        v-model="tourPlayersCurrent"
        :tags="tourPlayers"
        :autocomplete-items="filteredItems"
        @tags-changed="newTags => tourPlayers = newTags"
        placeholder="Add players to the tournament"
        class="w-100 mw-100 py-3"
      />
      <b-form-group label="">
        <b-form-radio-group
            v-model="teamAlgoSelected" :options="teamAlgoOptions"
            button-variant="outline-primary" buttons size="sm" class="w-100"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group label="">
        <b-form-radio-group
            v-model="tourModeSelected" :options="tourModeOptions"
            button-variant="outline-primary" buttons size="sm" class="w-100 pb-3"
        ></b-form-radio-group>
      </b-form-group>

      <b-button @click="startTournament()" variant="rudi">Start Tournament!</b-button>
    </b-form>

    <b-form v-else>
      <b-navbar class="p-0">
        <b-navbar-nav>
          <b-nav-text>
            <h5>Running Tournament</h5>
          </b-nav-text>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item right>
            <b-button variant="outline-rudi" size="sm" @click="cancelTournament()">Cancel</b-button>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>
      <span class="float-left">Next Games:</span>
      <b-container class="px-0 mt-5">
        <div :key="index" v-for="(game, index) in openGames" class="mt-4">
          <b-row>
            <b-col>
              <player-badge :name="getTeamNameList(game.team1)" class="float-right pb-2"/>
            </b-col>
            <b-col cols="1" class="p-0">vs.</b-col>
            <b-col class="">
              <player-badge :name="getTeamNameList(game.team2)"  class="float-left pb-2"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="px-1">
              <b-form-input v-model="game.team1Score" placeholder="Score team 1" class="rounded-0"></b-form-input>
            </b-col>
            <b-col cols="1" class="p-0">:</b-col>
            <b-col class="px-1">
              <b-form-input v-model="game.team2Score" placeholder="Score team 2" class="rounded-0"></b-form-input>
            </b-col>
          </b-row>
          <b-button @click="addGame(game)" variant="rudi" class="mt-2">Enter Game</b-button>
        </div>
      </b-container>
    </b-form>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
import PlayerBadge from './PlayerBadge.vue';

export default {
  name: 'PlanTournament',
  components: {
    VueTagsInput,
    PlayerBadge,
  },
  props: ['players', 'games'],
  data() {
    return {
      boardId: this.$route.params.boardId,
      tournament: undefined,

      tourName: '',
      tourPlayers: [],
      tourPlayersCurrent: '',

      teamAlgoSelected: 'random',
      teamAlgoOptions: [
        { text: 'random teams', value: 'random' },
        { text: 'balanced teams', value: 'balanced', disabled: true },
      ],

      tourModeSelected: 'elimination',
      tourModeOptions: [
        { text: 'elimination tournament', value: 'elimination' },
        { text: 'table tournament', value: 'table', disabled: true },
      ],



      team1Score: '',
      team2Score: '',
    }
  },
  computed: {
    filteredItems() {
      return this.autocompleteItems.filter(i => {
        let tag = this.tourPlayersCurrent;
        return i.text.toLowerCase().indexOf(tag.toLowerCase()) !== -1;
      });
    },
    autocompleteItems() {
      return this.players.map(i => {
        return { text: i};
      });
    },
    openGames() {
      if (this.tournament != undefined) {
        var openGames = [];
        var teams = this.tournament.get('teams');
        var teamsNextRound = [];
        while (openGames.length == 0 && teams.length > 1) {
          for (var i = 0; i < teams.length - 1; i += 2) {
            var team1Players = teams[i];
            var team2Players = teams[i + 1];
            if (team2Players == undefined) {
              teamsNextRound.push(team1Players);
              break;
            }
            var foundGame = false;
            for (const game of this.tourGames) {
              const team1str = this.getTeamNameList(team1Players);
              const team2str = this.getTeamNameList(team2Players);
              const gameTeam1str = this.getTeamNameList(game.get('team1'));
              const gameTeam2str = this.getTeamNameList(game.get('team2'));
              if (team1str == gameTeam1str && team2str == gameTeam2str) {
                if (game.get('team1Score') > game.get('team2Score')){
                  teamsNextRound.push(game.get('team1'));
                } else {
                  teamsNextRound.push(game.get('team2'));
                }
                foundGame = true;
                break;
              }
            }
            if (!foundGame) {
              var newGame = {
                boardId : this.boardId,
                team1 : team1Players,
                team2 : team2Players,
                team1Score : undefined,
                team2Score : undefined,
                tournamentId : this.tournament.id,
                description : this.tournament.get('tourName'),
              }
              openGames.push(newGame);
            }
          }
          teams = teamsNextRound;
          teamsNextRound = [];
        }
        if (teams.length == 1) {
          alert(`Team ${teams[0]} has won the tournament "${this.tournament.get('tourName')}"!`);
          this.tournament.set('active', false);
          this.tournament.save().then(() => {
            console.log(`Tounament succesfully canceled.`)
          }, (error) => {
            alert('Failed to cancel tournament, with error code: ' + error.message);
          });
        }
        console.log(openGames);
        return openGames;
      }
    },
    tourGames() {
      console.log(this.tournament.id);
      console.log(this.games[0].get('tournamentId'));
      return this.games.filter(game => game.get('tournamentId') === this.tournament.id);
    }
  },
  methods: {
    startTournament() {
      var players = this.tourPlayers.map(i => {
        return i.text;
      });
      var tourTeams = [];
      while (players.length > 1) {
        var team = [];
        team.push(players.splice(this.randNum(0, players.length-1), 1)[0])
        team.push(players.splice(this.randNum(0, players.length-1), 1)[0])
        tourTeams.push(team);
      }

      let tourData = {
        boardId : this.boardId,
        tourName : this.tourName,
        teams : tourTeams,
        active : true,
      }
      new this.$Parse.Object("Tournament", tourData).save().then((game) => {
        console.log(`Tournament succesfully added.`)
      }, (error) => {
        alert('Failed to add tournament, with error code: ' + error.message);
      });
    },
    cancelTournament() {
      if (confirm(`Are you sure you want to cancel the running tournament? All already added games will stay on the board.`)) {
        this.tournament.set('active', false);
        this.tournament.save().then(() => {
          console.log(`Tounament succesfully canceled.`)
        }, (error) => {
          alert('Failed to cancel tournament, with error code: ' + error.message);
        });
      }
    },
    async fetchData() {
      var query = new this.$Parse.Query('Tournament');
      query.equalTo("boardId", this.boardId).equalTo("active", true)
      var tournamentQueryResult = await query.find();
      this.tournament = tournamentQueryResult[0];
    },
    addGame(gameData) {
      new this.$Parse.Object("Game", gameData).save().then((game) => {
        console.log(`Game succesfully added.`)
      }, (error) => {
        alert('Failed to add game, with error code: ' + error.message);
      });
    }
  },
  created () {
    this.fetchData()
  },
  async mounted() {
    var query = new this.$Parse.Query('Tournament');
    query.equalTo("boardId", this.boardId);
    let subscription = await query.subscribe();
    subscription.on('create', game => {
      //console.log('create')
      this.fetchData()
    });
    subscription.on('delete', game => {
      //console.log('delete')
      this.fetchData()
    });
    subscription.on('update', game => {
      //console.log('update')
      this.fetchData()
    });
  },
}
</script>

<style scoped>

</style>
