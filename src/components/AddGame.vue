<template>
  <div>
    <b-card bg-variant="light" class="mb-4">
      <b-form>
        <b-form-input v-model="team1" placeholder="name team 1" class=""></b-form-input>
        <span class="mx-auto">vs.</span>
        <b-form-input v-model="team2" placeholder="name team 2" class="mb-4"></b-form-input>
        
        <b-form-input v-model="team1Score" placeholder="score team 1" class=""></b-form-input>
        <span class="mx-auto">:</span>
        <b-form-input v-model="team2Score" placeholder="score team 2" class=""></b-form-input><br>
        <b-button @click="addGame()" class="">Add Game</b-button>
      </b-form>
    </b-card>
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
