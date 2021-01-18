<template>
  <div>
    <b-card bg-variant="light" class="mb-4">
      <b-form>
        <vue-tags-input
          v-model="team1current"
          :tags="team1"
          :autocomplete-items="filteredItems"
          @tags-changed="newTags => team1 = newTags"
          placeholder="Add members to team 1"
          class="w-100 mw-100"
        />
        <span class="mx-auto">vs.</span>
        <vue-tags-input
          v-model="team2current"
          :tags="team2"
          :autocomplete-items="filteredItems"
          @tags-changed="newTags => team2 = newTags"
          class="mb-4 w-100 mw-100"
          placeholder="Add members to team 2"
        />
        
        <b-form-input v-model="team1Score" placeholder="score team 1" class="rounded-0"></b-form-input>
        <span class="mx-auto">:</span>
        <b-form-input v-model="team2Score" placeholder="score team 2" class="rounded-0"></b-form-input><br>
        <b-button @click="addGame()" class="">Add Game</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: 'AddGame',
  components: {
    VueTagsInput,
  },
  data() {
    return {
      boardId: this.$route.params.boardId,
      team1: [],
      team1current: '',
      team2: [],
      team2current: '',
      team1Score: '',
      team2Score: '',
      autocompleteItems: [{
        text: 'Gregor',
      }, {
        text: 'Pia',
      }, {
        text: 'Lukas',
      }, {
        text: 'Lena',
      }, {
        text: 'Davina',
      }],
    }
  },
  computed: {
    filteredItems() {
      return this.autocompleteItems.filter(i => {
        let tag = this.team1current != '' ? this.team1current : this.team2current;
        return i.text.toLowerCase().indexOf(tag.toLowerCase()) !== -1;
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
