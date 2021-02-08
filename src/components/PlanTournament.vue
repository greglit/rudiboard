<template>
  <div class="mt-4">
    <b-form v-if="tournament == undefined" @submit="onSubmit">
      <b-form-input v-model="tourName" placeholder="Enter tournament name (optional)" class="rounded-0"></b-form-input>
      <vue-tags-input
        v-model="tourPlayersCurrent"
        :tags="tourPlayers"
        :autocomplete-items="filteredItems"
        @tags-changed="newTags => tourPlayers = newTags"
        placeholder="Add players to the tournament"
        class="w-100 mw-100 mt-3"
      />
      <b-form-text>
        {{validationText}}
      </b-form-text>
      <b-form-text>
        {{warningText}}
      </b-form-text>
      <b-form-group label="Select team size:" label-size="sm" label-cols="6" class="mt-3">
        <b-form-spinbutton
          min="1" max="100"
          v-model="teamSizeSelected"
          class="rounded-0"
        />
      </b-form-group>
      <b-form-group label="Select team grouping" label-size="sm" :description="teamAlgoDescription[teamAlgoSelected]">
        <b-form-radio-group
            v-model="teamAlgoSelected" :options="teamAlgoOptions" :disabled="teamSizeSelected <= 1"
            button-variant="outline-primary" buttons size="sm" class="w-100"
        ></b-form-radio-group>

      </b-form-group>
      <!--
      <b-form-group>
        <b-form-radio-group
            v-model="tourModeSelected" :options="tourModeOptions"
            button-variant="outline-primary" buttons size="sm" class="w-100 pb-3"
        ></b-form-radio-group>
      </b-form-group>-->
      <b-button type="submit" variant="rudi" :disabled="validationText != '' || waitForTournamentStarted">
        <b-icon v-if="waitForTournamentStarted" icon="arrow-clockwise" animation="spin" class="mr-2"/>
        <b-icon-flag v-else class="mr-2"/>
        Start Tournament!
      </b-button>
    </b-form>

    <div v-else>
      <b-navbar class="p-0">
        <b-navbar-nav>
          <b-nav-text>
            <h5>Running Tournament {{strTourNameIfSet(tournament.get('tourName'))}}</h5>
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
        <tour-add-game :key="index+game.team1+game.team2" v-for="(game, index) in openGames" class="mt-4" :gameData="game"/>
      </b-container>
    </div>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
import PlayerBadge from './PlayerBadge.vue';
import TourAddGame from './TourAddGame.vue';

export default {
  name: 'PlanTournament',
  components: {
    VueTagsInput,
    PlayerBadge,
    TourAddGame,
  },
  props: ['tournament','players', 'games', 'playerData'],
  data() {
    return {
      boardId: this.$route.params.boardId,

      tourName: String,
      tourPlayers: Array,
      teamSizeSelected: Number,
      tourPlayersCurrent: String,

      teamAlgoSelected: String,
      teamAlgoOptions: [
        { text: 'random', value: 'random' },
        { text: 'balanced', value: 'balanced'},
        { text: 'linear', value: 'linear' },
      ],
      teamAlgoDescription: {
        random : 'Players are randomely grouped into tournament teams.',
        balanced : 'Players are grouped into balanced teams using "advanced AI" ;)',
        linear : 'Players are grouped from left to right. So the players order in the input field determines teams.',
      },

      /*tourModeSelected: String,
      tourModeOptions: [
        { text: 'elimination tournament', value: 'elimination' },
        { text: 'table tournament', value: 'table', disabled: true },
      ],*/

      formDefaults: {
        tourName: '',
        tourPlayers: [],
        teamSizeSelected: 2,
        tourPlayersCurrent: '',
        teamAlgoSelected: 'random',
        tourModeSelected: 'elimination',
      },

      validationText: '',
      warningText: '',
      waitForTournamentStarted: false,
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
      var openGames = [];
      var teamsThisRound = this.tournament.get('teams');
      var teamsNextRound = [];
      while (openGames.length == 0 && teamsThisRound.length > 1) { //search for open games until a new open game is found or the tournament is finished
        //console.log('teamsThisRound: '+teamsThisRound);
        //console.log('teamsNextRound: '+teamsNextRound);
        for (var i = 0; i < teamsThisRound.length - 1; i += 2) { //iterate over all teams in pairs of two in this tournament round 
          var team1Players = teamsThisRound[i];
          var team2Players = teamsThisRound[i + 1];
          //console.log('team1: '+team1Players);
          //console.log('team2: '+team2Players);
          var foundGame = false;
          for (const game of this.tourGames) { //search for already exiting tournament gaes with those players
            if (this.arraysEqual(team1Players, game.get('team1')) && this.arraysEqual(team2Players, game.get('team2'))) { //if found they have already played
              if (game.get('team1Score') > game.get('team2Score')){ //determine which team will go into next tournament round
                teamsNextRound.push(game.get('team1'));
              } else {
                teamsNextRound.push(game.get('team2'));
              }
              foundGame = true;
              break;
            }
            //console.log('teamsNextRound: '+teamsNextRound);
          }
          if (!foundGame) { //if the two teams didn't play already, a new game object is created added to the open games
            var newGame = {
              boardId : this.boardId,
              team1 : team1Players,
              team2 : team2Players,
              team1Score : '',
              team2Score : '',
              tournamentId : this.tournament.id,
              description : `Tournament${this.strTourNameIfSet(this.tournament.get('tourName'))}`,
            }
            openGames.push(newGame);
          }
        }
        if (teamsThisRound.length % 2 == 1) { //in case of an odd team number the leftover team is directly added to the next round
          //console.log('lonely team!')
          teamsNextRound.unshift(teamsThisRound[teamsThisRound.length-1]);
        }
        teamsThisRound = teamsNextRound;
        teamsNextRound = [];
        //console.log('teamsThisRound: '+teamsThisRound);
        //console.log('teamsNextRound: '+teamsNextRound);
      }
      if (teamsThisRound.length == 1 && openGames.length == 0) { //if only one team remains and there are no open games, then this team has won!
        alert(`Team ${teamsThisRound[0]} has won the tournament${this.strTourNameIfSet(this.tournament.get('tourName'))}!`);
        this.tournament.set('active', false);
        this.tournament.save().then(() => {
          console.log(`Tounament succesfully canceled.`)
        }, (error) => {
          alert('Failed to cancel tournament, with error code: ' + error.message);
        });
      }
      //console.log('openGames: '+openGames);
      return openGames;
    },
    tourGames() {
      return this.games.filter(game => game.get('tournamentId') === this.tournament.id);
    },
    tourPlayersList() {
      return this.tourPlayers.map(i => {
        return i.text;
      });
    } ,
    formInputsValidationWrapper() {
      return `${this.tourPlayers}|${this.teamSizeSelected}`;
    },
  },
  watch: {
    formInputsValidationWrapper(newVal, oldVal) {
      //const [oldTourPlayers, oldteamSizeSelected] = oldVal.split('|');
      //const [newtourPlayers, newteamSizeSelected] = newVal.split('|');
      this.validateForm()
    },
  },
  methods: {
    validateForm() {
      var errorText = '';
      var warningText = '';
      if (this.tourPlayersList.length < this.teamSizeSelected*2) {
        errorText += `Please add at least ${this.teamSizeSelected*2-this.tourPlayersList.length} more player(s) for a tournament with ${this.teamSizeSelected} player(s) per team.`
      } else if (this.tourPlayersList.length % this.teamSizeSelected != 0) {
        warningText += `Add ${this.teamSizeSelected - this.tourPlayersList.length % this.teamSizeSelected} more player(s). If not, ${this.tourPlayersList.length % this.teamSizeSelected} player(s) will not participate.`
      }
      this.warningText = warningText;
      this.validationText = errorText;
    },
    setFormDefaults(){
      this.tourName = this.formDefaults.tourName;
      this.tourPlayers = this.formDefaults.tourPlayers;
      this.teamSizeSelected = this.formDefaults.teamSizeSelected;
      this.tourPlayersCurrent = this.formDefaults.tourPlayersCurrent;
      this.teamAlgoSelected = this.formDefaults.teamAlgoSelected;
      //this.tourModeSelected = this.formDefaults.tourModeSelected;
    },
    onSubmit(e) {
      e.preventDefault();
      if (this.validationText == '') {
        this.startTournament();
      }
    },
    getRandomTeams(tourPlayersList, teamSizeSelected) {
      var tourTeams = [];
      while (tourPlayersList.length > teamSizeSelected-1) {
        var team = [];
        for (var i = 0; i < teamSizeSelected; i++) {
          team.push(tourPlayersList.splice(this.randNum(0, tourPlayersList.length-1), 1)[0])
        }
        tourTeams.push(team);
      }
      return tourTeams;
    },
    getLinearTeams(tourPlayersList, teamSizeSelected) {
      var tourTeams = [];
      while (tourPlayersList.length > teamSizeSelected-1) {
        var team = [];
        for (var i = 0; i < teamSizeSelected; i++) {
          team.push(tourPlayersList.shift())
        }
        tourTeams.push(team);
      }
      return tourTeams;
    },
    getBalancedTeams(tourPlayersList, teamSizeSelected) {
      for (var i = 0; i < tourPlayersList.length % teamSizeSelected; i++) {
        tourPlayersList.splice(this.randNum(0, tourPlayersList.length-1), 1);
      }
      //console.log(tourPlayersList);
      const playersToSort = this.playerData.filter(player => tourPlayersList.includes(player.name));
      //console.log(JSON.stringify(playersToSort));
      var sortedPlayers = playersToSort.sort((a, b) => b.points-a.points);
      //console.log(JSON.stringify(sortedPlayers))
      for (const player of tourPlayersList) {
        for (const sortPlayer of sortedPlayers) {
          var found = false;
          if (sortPlayer.name == player) {
            found = true;
            break;
          }
        }
        if (!found) {
          sortedPlayers.push({name:player});
        } 
      }
      //console.log(JSON.stringify(sortedPlayers))
      var tourTeams = [];
      while (sortedPlayers.length > 0) {
        var team = [];
        for (var i = 0; i < this.teamSizeSelected; i++) {
          if (i % 2 != 0){
            team.push(sortedPlayers.pop().name)
          } else {
            team.push(sortedPlayers.shift().name)
          }
        }
        tourTeams.push(team);
      }
      //console.log(JSON.stringify(tourTeams))
      return tourTeams;
    },
    startTournament() {
      this.waitForTournamentStarted = true;
      var tourTeams;
      if (this.teamAlgoSelected == 'balanced') {
        tourTeams = this.getBalancedTeams(this.tourPlayersList, this.teamSizeSelected);
      } else if (this.teamAlgoSelected == 'linear') { 
        tourTeams = this.getLinearTeams(this.tourPlayersList, this.teamSizeSelected);
      } else {
        tourTeams = this.getRandomTeams(this.tourPlayersList, this.teamSizeSelected);
      }
      //console.log(tourTeams);
      let tourData = {
        boardId : this.boardId,
        tourName : this.tourName,
        teams : tourTeams,
        active : true,
      };
      new this.$Parse.Object("Tournament", tourData).save().then((game) => {
        this.waitForTournamentStarted = false;
        console.log(`Tournament succesfully added.`);
        this.setFormDefaults();
      }, (error) => {
        this.waitForTournamentStarted = false;
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
    strTourNameIfSet(tourName){
      return tourName != '' ? ' "'+this.tournament.get('tourName')+'"' : '';
    },
    arraysEqual(arr1, arr2) {
      if(arr1.sort().join(',')=== arr2.sort().join(',')){
        return true;
      }
      return false;
    }
  },
  created () {
    this.setFormDefaults();
  },
}
</script>

<style scoped>

</style>
