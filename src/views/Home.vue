<template>
  <div class="home">
    <b-container>
      <b-row class="mt-4 mx-auto" style="max-width:700px" >
        <b-col>
          <div style="opacity:0.3; position:absolute; z-index:-1000; width:202px; right:0px; left:0px; top:50px;" class="mx-auto">
            <b-iconstack shift-v="0" class="mt-5 mb-0" scale="8.0">
            <b-icon stacked icon="hexagon-fill" variant="rudi" scale="1.8"></b-icon>
            </b-iconstack>
            <h1 class="marker" style="margin-top:-195px; margin-right: -20px; font-size:200pt; color:white">r</h1>
          </div>
          <h1 class="text-center marker display-5">This is rudiboard, it's awesome! :D</h1>
          <h5 style="max-width:500px" class="mx-auto">Track <b>games</b> and <b>scores</b> and plan <b>tournaments</b> at the office, in your shared flat or your favorite bar.</h5>
          
          <h5 style="max-width:700px" class="mx-auto">
            <div class="d-inline-block ml-3"><b-icon-check-circle class="mr-1"/>No app install </div>
            <div class="d-inline-block ml-3"><b-icon-check-circle class="mr-1"/>No signup/setup </div>
            <!--<div class="d-inline-block ml-3"><b-icon-check-circle class="mr-1"/>Completely free </div>-->
            <div class="d-inline-block ml-3"><b-icon-check-circle class="mr-1"/>Easy sharing on all devices</div>
            <!--<div class="d-inline-block ml-3"><b-icon-check-circle class="mr-1"/>Works everywhere </div>-->
          </h5>
        </b-col>
      </b-row>
      <b-row  class="mt-5 mx-auto" style="max-width:700px">
        <b-col>
          <h4  class="text-left">Create a new score board</h4>
          <b-form @submit="createBoard">
            <b-form-group>
            <b-form-input required size="lg" class="" v-model="newBoardName" placeholder="Score board name"></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="success" size="lg" style="width:7rem">Create!</b-button>
          </b-form>
        </b-col>
      </b-row>
      <hr style="max-width:700px">
      <b-row class="mx-auto" style="max-width:700px">
        <b-col>
          <h4 class="text-left">...or join an existing one!</h4>
          <b-form @submit="joinBoard">
            <b-form-group valid-feedback="" invalid-feedback="Whoopsy! We couldn't find a board with this board code, maybe a typo?" :state="!boardNotFound">
              <b-form-input required size="lg" v-model="joinBoardID" placeholder="Board code" @update="boardNotFound=false;"></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="success" size="lg" style="width:7rem">Join!</b-button>
          </b-form>
        </b-col>
      </b-row>  
      <br> 
      <br>
      <br>
      <br>
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
    async joinBoard(e) {
      e.preventDefault();
      var boardQuery = new this.$Parse.Query('Board');
      boardQuery.equalTo("boardId", this.joinBoardID);
      var boardQueryResult = await boardQuery.find();
      if (boardQueryResult != 0) {
        //console.log('boardfound')
        var board = boardQueryResult[0]
        this.$router.push(`board/${board.get('boardName')}/${board.get("boardId")}`)
      } else {
        //console.log('boardnotfound')
        this.boardNotFound = true;
      }
      
    },
    createBoard(e) {
      e.preventDefault();
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

<style lang="scss" scoped>
  
</style>
