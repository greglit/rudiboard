<template>
  <div>
    <b-card bg-variant="light" class="border-0">
      <b-form @submit="onSubmit">
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
          <b-form-input required type="number" v-model="game.team1Score" placeholder="Score team 1" class="rounded-0"></b-form-input>
        </b-col>
        <b-col cols="1" class="p-0">:</b-col>
        <b-col class="px-1">
          <b-form-input required type="number" v-model="game.team2Score" placeholder="Score team 2" class="rounded-0"></b-form-input>
        </b-col>
        </b-row>
        <b-button type="submit" variant="rudi" class="mt-2" :disabled="waitForGameAdded">
          <b-icon v-if="waitForGameAdded" icon="arrow-clockwise" animation="spin" font-scale="1"/>Enter Game
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import PlayerBadge from './PlayerBadge.vue';
export default {
  components: { 
    PlayerBadge,
  },
  name: 'TourAddGame',
  props: ['gameData'],
  data() {
    return {
      game: this.gameData,
      waitForGameAdded: false,
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.addGame(this.game);
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
