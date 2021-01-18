<template>
  <div>
    <b-alert show fade>
      <span class="float-right delete" @click="deleteGame()">
        <b-icon-trash-fill/>
      </span>
      <team-list :team="game.get('team1')" class="b-inline"/>
      vs.
      <team-list :team="game.get('team2')" class="b-inline"/><br>
      {{game.get("team1Score")}} : {{game.get("team2Score")}}
    </b-alert>
  </div>
</template>

<script>
import TeamList from './TeamList.vue';

export default {
  name: "GameCard",
  components: {
    TeamList
  },
  props: {
    game: Object, //objectId, team1, team2, team1Score, team2Score
  }, 
  data() {
    return {
    };
  },
  mounted: function() {
  },
  methods: {
      deleteGame() {
        if (confirm(`Are you sure you want to delete the game ${this.game.get("team1")} vs. ${this.game.get("team2")} ${this.game.get("team1Score")}:${this.game.get("team2Score")}`)) {
          this.game.destroy().then((game) => {
            console.log(`Game succesfully destroyed.`)
          }, (error) => {
            alert('Failed to destroy game, with error code: ' + error.message);
          });
        }
      }
  },
};
</script>

<style scoped>
.delete {
    color: rgb(94, 94, 94);
}
.delete:hover {
    cursor: pointer;
    color: rgb(39, 39, 39);
}
</style>