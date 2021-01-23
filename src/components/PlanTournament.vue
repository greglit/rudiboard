<template>
  <div>
    <b-form v-if="!tournament">
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
      <b-form-input v-model="team1Score" placeholder="score team 1" class="rounded-0"></b-form-input>
      <span class="mx-auto">:</span>
      <b-form-input v-model="team2Score" placeholder="score team 2" class="rounded-0"></b-form-input>
    </b-form>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: 'PlanTournament',
  components: {
    VueTagsInput,
  },
  props: ['players'],
  data() {
    return {
      boardId: this.$route.params.boardId,
      tournament: false,

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
  },
  methods: {
    startTournament() {
      var players = this.tourPlayers.map(i => {
        return i.text;
      });
      
      let tourData = {
        boardId : this.boardId,
        team1 : team1Names,
        team2 : team2Names,
        team1Score : this.team1Score,
        team2Score : this.team2Score,
      }
      new this.$Parse.Object("Tournament", tourData).save().then((game) => {
        console.log(`Game succesfully added.`)
      }, (error) => {
        alert('Failed to add game, with error code: ' + error.message);
      });
    },
    addGame() {
      var team1Names = this.team1.map(i => {
        return i.text;
      });
      var team2Names = this.team2.map(i => {
        return i.text;
      });
      let gameData = {
        boardId : this.boardId,
        team1 : team1Names,
        team2 : team2Names,
        team1Score : this.team1Score,
        team2Score : this.team2Score,
      }
      new this.$Parse.Object("Game", gameData).save().then((game) => {
        console.log(`Game succesfully added.`)
      }, (error) => {
        alert('Failed to add game, with error code: ' + error.message);
      });
    }
  },
}
</script>

<style scoped>

</style>
