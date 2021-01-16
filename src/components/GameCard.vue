<template>
  <div>
    <b-alert show fade>
      <span class="float-right delete" @click="deleteGame()">
        <b-icon-trash-fill/>
      </span>
      {{game.get("team1")}} vs. {{game.get("team2")}} <br>
      {{game.get("team1Score")}} : {{game.get("team2Score")}}
    </b-alert>
  </div>
</template>

<script>

export default {
  name: "GameCard",
  components: {
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
            this.game.destroy()
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