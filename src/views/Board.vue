<template>
  <div>
    <navbar>
      <h3 class="text-center">{{$route.params.boardName}}</h3>
      <b-icon-share-fill class="float-right" v-b-modal.shareModal/>
    </navbar>
    <b-modal hide-footer size="lg" id="shareModal" title="Share this board with others">
      ID:{{$route.params.boardId}}
    </b-modal>
    <b-container class="mt-4 px-md-0">
      <div v-if="loading">
        <b-card>
          <b-skeleton width="85%"></b-skeleton>
          <b-skeleton width="55%"></b-skeleton>
          <b-skeleton width="70%"></b-skeleton>
        </b-card>
      </div>
      <div v-else>

        <add-game :players="playerList" class="mb-4 mr-0"/>

        <game-list :games="games" :newestGameId="newestGameId" class="mb-4"/>

        <score-table :games="games" :players="playerList"/>

      </div>
      
    </b-container>
  </div>
</template>

<script>
import {Howl} from 'howler';
import AddGame from '../components/AddGame'
import GameCard from '../components/GameCard'
import Navbar from '../components/Navbar.vue';
import GameList from '../components/GameList.vue';
import ScoreTable from '../components/ScoreTable.vue';

export default {
  name: 'Board',
  components: {
    AddGame,
    GameCard,
    Navbar,
    GameList,
    ScoreTable,
  },
  data() {
    return {
      loading: true,
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
      this.fetchData()
    });
    subscription.on('delete', game => {
      this.fetchData()
    });
  },
  computed: {
    playerList() {
      var playerList = [];
      for (const game of this.games) {
        var players = game.get('team1').concat(game.get('team2'));
        for (const player of players){
          if (playerList.indexOf(player) === -1) {
            playerList.push(player);
          }
        }
      }
      return playerList;
    }
  },
  methods: {
    async fetchData() {
      var gameQuery = new this.$Parse.Query('Game');
      gameQuery.equalTo("boardId", this.$route.params.boardId).descending('createdAt');
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