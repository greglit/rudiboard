<template>
  <div>
    <b-form @submit="onSubmit">
      <b-container class="mt-4 pb-3 px-3">
      <b-row>
        <b-col>
          Team 1
        </b-col>
        <b-col cols="1" class="p-0">vs.</b-col>
        <b-col>
          Team 2
        </b-col>
      </b-row>
      <b-row class="">
        <b-col class="px-1">
          <vue-tags-input v-model="team1current" :tags="team1" :autocomplete-items="filteredItems"
            @tags-changed="newTags => team1 = newTags" placeholder="Add members" class="w-100 mw-100"
            :add-on-key="[',' , 32 , 13]" :autocomplete-min-length="0"
          />
        </b-col>
        <b-col class="px-1">
          <vue-tags-input v-model="team2current" :tags="team2" :autocomplete-items="filteredItems"
            @tags-changed="newTags => team2 = newTags" placeholder="Add members" class="w-100 mw-100"
            :add-on-key="[',' , 32 , 13]" :autocomplete-min-length="0"
          />
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-form-invalid-feedback :state="false">
          {{validationText}}
        </b-form-invalid-feedback>
      </b-row>
      <b-row class="mb-2">
        <b-col class="px-1">
          <b-form-input v-model="team1Score" type="tel" placeholder="Score team 1" class="rounded-0" required :state="validScore1"></b-form-input>
          <b-form-invalid-feedback :state="validScore1">
            Please enter a number.
          </b-form-invalid-feedback>
        </b-col>
        <b-col cols="1" class="p-0">:</b-col>
        <b-col class="px-1">
          <b-form-input v-model="team2Score" type="tel" placeholder="Score team 2" class="rounded-0" required :state="validScore2"></b-form-input>
          <b-form-invalid-feedback :state="validScore2">
            Please enter a number.
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      </b-container>
      
      <b-button type="submit" variant="rudi" :disabled="validationText != '' || waitForGameAdded">
        <b-icon v-if="!waitForGameAdded" icon="trophy" class="mr-2"/>
        <b-spinner v-else label="Spinning" class="mr-2" small></b-spinner>
        Add Game
      </b-button>
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

      triedToSubmit: false,
      waitForGameAdded: false,
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
    team1Array() {
      return this.team1.map(i => {
        return i.text;
      });
    },
    team2Array() {
      return this.team2.map(i => {
        return i.text;
      });
    },
    validationText() {
      if (!this.triedToSubmit) {
        return '';
      }
      var errorText = '';
      if (this.team1.length == 0) {
        errorText += 'Team 1 must contain at least one member. '
      }
      if (this.team2.length == 0) {
        errorText += 'Team 2 must contain at least one member. '
      }
      if (this.arraysHaveCommonElement(this.team1Array, this.team2Array)) {
        errorText += `A player can't be in two teams at once. `
      }
      return errorText;
    },
    validScore2() {
      if (this.team2Score == '' || Number.isInteger(Number(this.team2Score))) {
        return null;
      } else {
        return false;
      }
    },
    validScore1() {
      if (this.team1Score == '' || Number.isInteger(Number(this.team1Score))) {
        return null;
      } else {
        return false;
      }
    },
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.triedToSubmit = true;
      if (this.validationText == '' && this.validScore2 !== false && this.validScore1 !== false) {
        this.addGame();
      }
    },
    addGame() {
      this.waitForGameAdded = true;
      let gameData = {
        boardId : this.boardId,
        team1 : this.team1Array,
        team2 : this.team2Array,
        team1Score : this.team1Score,
        team2Score : this.team2Score,
      }
      new this.$Parse.Object("Game", gameData).save().then((game) => {
        this.waitForGameAdded = false;
        this.triedToSubmit = false;
        console.log(`Game succesfully added.`)
      }, (error) => {
        this.waitForGameAdded = false;
        alert('Failed to add game, with error code: ' + error.message);
      });
    },
    arraysHaveCommonElement(arr1, arr2) {
      return arr1.some(item => arr2.includes(item));
    },
  },
}
</script>

<style scoped>

</style>
