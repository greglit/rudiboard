<template>
  <div class="home">
    <b-navbar variant="light" type="light">
      <b-container>
        <b-navbar-brand href="#">
          <img src="../assets/logo.png" class="d-inline-block align-top logo" alt="rudiboard">
          rudiboard
        </b-navbar-brand>
      </b-container>
    </b-navbar>
    <b-container>
      <b-row class="mt-5">
        <b-col>
          <h1 class="text-center">This is rudiboard, it's awesome! :D</h1>
        </b-col>
      </b-row>
      <b-row  class="mt-5">
        <b-col>
          <h2 class="text-left">Join an existing score board</h2>
          <b-form inline>
            <b-form-input size="lg" class="mr-2" v-model="joinBoardID" placeholder="enter board code"></b-form-input>
            <b-button variant="success" size="lg" @click="joinBoard()">Join!</b-button>
          </b-form>
        </b-col>
        <b-col class="border-left">
          <h2  class="text-right">... or create a new one.</h2>
          <b-form inline class="float-right">
            <b-form-input size="lg" class="mr-2" v-model="createBoardName" placeholder="enter score board name"></b-form-input>
            <b-button variant="success" size="lg" @click="createBoard()">Create!</b-button>
          </b-form>
          
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      joinBoardID : '',
      createBoardName : '',
    }
  },
  methods: {
    joinBoard() {
      this.$router.push('board/'+this.joinBoardID)
    }
  }
}
</script>

<style scoped>
.logo {
  height: 30px;
  width: 30px;
}
</style>
