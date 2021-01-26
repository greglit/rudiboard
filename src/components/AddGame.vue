<template>
  <div>
    <b-form>
      <b-container class="mt-5 pb-3 px-0">
      <b-row class="">
        <b-col class="">
          Team 1
        </b-col>
        <b-col cols="1" class="p-0">vs.</b-col>
        <b-col class="">
          Team 2
        </b-col>
      </b-row>
      <b-row class="pb-3">
        <b-col class="px-1">
          <vue-tags-input v-model="team1current" :tags="team1" :autocomplete-items="filteredItems"
            @tags-changed="newTags => team1 = newTags" placeholder="Add members" class="w-100 mw-100"
          />
        </b-col>
        <b-col class="px-1">
          <vue-tags-input v-model="team2current" :tags="team2" :autocomplete-items="filteredItems"
            @tags-changed="newTags => team2 = newTags" placeholder="Add members" class="w-100 mw-100"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col class="px-1">
          <b-form-input v-model="team1Score" placeholder="Score team 1" class="rounded-0"></b-form-input>
        </b-col>
        <b-col cols="1" class="p-0">:</b-col>
        <b-col class="px-1">
          <b-form-input v-model="team2Score" placeholder="Score team 2" class="rounded-0"></b-form-input>
        </b-col>
      </b-row>
      </b-container>
      <b-button @click="addGame()" variant="rudi">Add Game</b-button>
    </b-form>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: 'AddGame',
  components: {
    VueTagsInput,
  },
  props: ['players'],
  data() {
    return {
      boardId: this.$route.params.boardId,
      team1: [],
      team1current: '',
      team2: [],
      team2current: '',
      team1Score: '',
      team2Score: '',
    }
  },
  computed: {
    filteredItems() {
      return this.autocompleteItems.filter(i => {
        let tag = this.team1current != '' ? this.team1current : this.team2current;
        return i.text.toLowerCase().indexOf(tag.toLowerCase()) !== -1;
      });
    },
    autocompleteItems() {
      return this.players.map(i => {
        return { text: i};
      });
    },
  },
  methods: {
    addGame() {
      var team1Names = this.team1.map(i => {
        return i.text;
      });
      var team2Names = this.team2.map(i => {
        return i.text;
      });
      let gameData = {
        boardId : this.boardId,
        team1 : team1Names,
        team2 : team2Names,
        team1Score : this.team1Score,
        team2Score : this.team2Score,
      }
      new this.$Parse.Object("Game", gameData).save().then((game) => {
        console.log(`Game succesfully added.`)
      }, (error) => {
        alert('Failed to add game, with error code: ' + error.message);
      });
    }
  },
}
</script>

<style scoped>

</style>
