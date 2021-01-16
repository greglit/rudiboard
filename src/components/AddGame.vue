<template>
  <div>
      <b-form-input v-model="team1" placeholder="name team 1" class="b-inline"></b-form-input>vs.
      <b-form-input v-model="team2" placeholder="name team 2" class="b-inline"></b-form-input><br>
      <b-form-input v-model="team1Score" placeholder="score team 1" class="b-inline"></b-form-input>:
      <b-form-input v-model="team2Score" placeholder="score team 2" class="b-inline"></b-form-input><br>
      <b-button @click="addGame()">Add Game</b-button>
  </div>
</template>

<script>
export default {
  name: 'AddGame',
  data() {
    return {
      boardId: this.$route.params.boardId,
      team1: '',
      team2: '',
      team1Score: '',
      team2Score: '',
    }
  },
  methods: {
    addGame() {
      new this.$Parse.Object("Game", this.$data).save();
    }
  },
}
</script>

<style scoped>

</style>
