<template>
  <div class="home">
    <navbar brandname>
    </navbar>
    <b-container>
      <b-row class="mt-5">
        <b-col>
          <h1 class="text-center">This is rudiboard, it's awesome! :D</h1>
        </b-col>
      </b-row>
      <b-row  class="mt-5">
        <b-col>
          <h2 class="text-left">Join an existing score board</h2>
          <b-form>
            <b-form-group valid-feedback="" invalid-feedback="Oops! We couldn't find a board with this board code, maybe a typo?" :state="!boardNotFound">
              <b-form-input size="lg" class="" v-model="joinBoardID" placeholder="enter board code" @update="boardNotFound=false;"></b-form-input>
            </b-form-group>
            <b-button variant="success" size="lg" @click="joinBoard()">Join!</b-button>
          </b-form>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col>
          <h2  class="text-left">... or create a new one.</h2>
          <b-form>
            <b-form-group>
              <b-form-input size="lg" class="" v-model="newBoardName" placeholder="enter score board name"></b-form-input>
            </b-form-group>
            <b-button variant="success" size="lg" @click="createBoard()">Create!</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';

export default {
  name: 'Home',
  components: {
    Navbar
  },
  data() {
    return {
      joinBoardID : '',
      newBoardName : '',
      boardNotFound : false,
    }
  },
  methods: {
    async joinBoard() {
      var boardQuery = new this.$Parse.Query('Board');
      boardQuery.equalTo("boardId", this.joinBoardID);
      var boardQueryResult = await boardQuery.find();
      if (boardQueryResult != 0) {
        console.log('boardfound')
        var board = boardQueryResult[0]
        this.$router.push(`board/${board.get('boardName')}/${board.get("boardId")}`)
      } else {
        console.log('boardnotfound')
        this.boardNotFound = true;
      }
      
    },
    createBoard() {
      var board = new this.$Parse.Object('Board', {
        boardName: this.newBoardName, 
        boardId: Math.random().toString(36).substr(2, 5),
      });
      board.save()
      .then((board) => {
        this.$router.push(`board/${board.get('boardName')}/${board.get("boardId")}`);
      }, (error) => {
        alert('Failed to create new board, with error code: ' + error.message);
      });
    }
  }
}
</script>

<style scoped>
</style>
