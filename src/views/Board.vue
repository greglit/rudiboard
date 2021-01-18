<template>
  <div>
    <b-container>
      <div v-if="loading">
        <b-card class="mt-4">
          <b-skeleton width="85%"></b-skeleton>
          <b-skeleton width="55%"></b-skeleton>
          <b-skeleton width="70%"></b-skeleton>
        </b-card>
      </div>

      <div v-else>
        <h1 class="my-4">Board "{{board.get('boardName')}}"  ID:{{$route.params.boardId}}</h1>
        
        <add-game />
        <div :key="'game'+game.objectId+key" v-for="(game, key) in games.slice().reverse()" :class="game.id == newestGameId ?'tdFadeInUp':''">
          <game-card :game="game"/>
        </div>
      </div>
      
    </b-container>
  </div>
</template>

<script>
import {Howl} from 'howler';
import AddGame from '../components/AddGame'
import GameCard from '../components/GameCard'

export default {
  name: 'Board',
  components: {
    AddGame,
    GameCard,
  },
  data() {
    return {
      loading: true,
      numberGamesDisplayed: 5,
      games: [],
      board: Object,
      notifySound: Object,
      newestGameId: String,
    }
  },
  created () {
    this.loading = true;
    this.notifySound = new Howl({ src: ['notify.mp3'] })
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  async mounted() {
    var query = new this.$Parse.Query('Game');
    query.equalTo("boardId", this.$route.params.boardId)
    let subscription = await query.subscribe();
    subscription.on('create', game => {
      this.notifySound.play();
      this.newestGameId = game.id;
      this.games.push(game);
    });
    subscription.on('delete', game => {
      this.fetchData()
    });
  },
  methods: {
    async fetchData() {
      var gameQuery = new this.$Parse.Query('Game');
      gameQuery.equalTo("boardId", this.$route.params.boardId).ascending('createdAt');//.limit(this.numberGamesDisplayed);
      this.games = await gameQuery.find();

      var boardQuery = new this.$Parse.Query('Board');
      boardQuery.equalTo("boardId", this.$route.params.boardId);
      var boardQueryResult = await boardQuery.find();
      this.board = boardQueryResult[0]
      this.loading = false;
    },
    isNew(game) { //:class="isNew(game) ?'tdFadeInUp':''"
      let createdAt = game.get('createdAt');
      let tenSecondsAgo = Date.now() - 10 * 1000 //millliseconds
      if (createdAt > tenSecondsAgo) {
        console.log("new!")
        this.notifySound.play();
        return true;
      }
    },
  }
}
</script>

<style scoped>
  .tdFadeInUp {
    -webkit-animation-duration: 0.4s;
            animation-duration: 0.4s;
    -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
    -webkit-animation-name: tdFadeInUp;
            animation-name: tdFadeInUp;
  }
  @-webkit-keyframes tdFadeInUp {
    0% {
      opacity: 0;
      transform: translateY(10px);
      -webkit-animation-timing-function: cubic-bezier(0, 0.59, 0.375, 1);
              animation-timing-function: cubic-bezier(0, 0.59, 0.375, 1);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes tdFadeInUp {
    0% {
      opacity: 0;
      transform: translateY(10px);
      -webkit-animation-timing-function: cubic-bezier(0, 0.59, 0.375, 1);
              animation-timing-function: cubic-bezier(0, 0.59, 0.375, 1);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>