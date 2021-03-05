<template>
  <div>
    <b-card bg-variant="light" class="border-0">
      <b-form @submit="onSubmit">
        <b-row>
        <b-col>
          <team-list :team="game.team1" class="float-right pb-2"/>
        </b-col>
        <b-col cols="1" class="p-0">vs</b-col>
        <b-col class="">
          <team-list :team="game.team2"  class="float-left pb-2"/>
        </b-col>
        </b-row>
        <b-row>
        <b-col class="px-1">
          <b-form-input required type="tel" :state="validScore1" v-model="game.team1Score" placeholder="Score 1" class="rounded-0"></b-form-input>
        </b-col>
        <b-col cols="1" class="pt-1 p-0">:</b-col>
        <b-col class="px-1">
          <b-form-input required type="tel" :state="validScore2" v-model="game.team2Score" placeholder="Score 2" class="rounded-0"></b-form-input>
        </b-col>
        </b-row>
        <b-button type="submit" variant="rudi" class="mt-2" :disabled="waitForGameAdded">
          <b-spinner v-if="waitForGameAdded" label="Spinning" class="mr-2" small></b-spinner>
          <b-icon-trophy v-else  class="mr-2"/>
          Enter Game
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import TeamList from './TeamList.vue';
export default {
  components: { 
    TeamList,
  },
  name: 'TourAddGame',
  props: ['gameData'],
  data() {
    return {
      game: this.gameData,
      waitForGameAdded: false,
    }
  },
  computed: {
    validScore2() {
      if (this.game.team2Score == '' || Number.isInteger(Number(this.game.team2Score))) {
        return null;
      } else {
        return false;
      }
    },
    validScore1() {
      if (this.game.team1Score == '' || Number.isInteger(Number(this.game.team1Score))) {
        return null;
      } else {
        return false;
      }
    },
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      if (this.validScore2 !== false && this.validScore1 !== false) {
        this.addGame(this.game);
      }
    },
    addGame(gameData) {
      this.waitForGameAdded = true;
      //this.game = {};
      new this.$Parse.Object("Game", gameData).save().then((game) => {
        this.waitForGameAdded = false;
        console.log(`Game succesfully added.`);
      }, (error) => {
        this.waitForGameAdded = false;
        alert('Failed to add game, with error code: ' + error.message);
      });
    },
  }
}
</script>

<style scoped>

</style>
