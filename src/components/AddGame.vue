<template>
  <div>
    <b-form @submit="onSubmit">
      <b-container class="mt-5 pb-2 px-0">
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
          <b-form-input v-model="team1Score" type="tel" placeholder="Score team 1" class="rounded-0" required></b-form-input>
        </b-col>
        <b-col cols="1" class="p-0">:</b-col>
        <b-col class="px-1">
          <b-form-input v-model="team2Score" type="tel" placeholder="Score team 2" class="rounded-0" required></b-form-input>
        </b-col>
      </b-row>
      </b-container>
      <b-form-invalid-feedback :state="false">
        {{validationText}}<br>
      </b-form-invalid-feedback>
      <b-button type="submit" variant="rudi" :disabled="validationText != '' || waitForGameAdded">
        <b-icon v-if="waitForGameAdded" icon="arrow-clockwise" animation="spin" font-scale="1"/>Add Game
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

      triedToSubmit: false;
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
    formInputsWrapper() {
      return `${this.team1}|${this.team2}`;
    },
    validationText() {
      var errorText = '';
      if (this.team1.length == 0) {
        errorText += 'Team 1 must contain at least one member. '
      }
      if (this.team2.length == 0 &&) {
        errorText += 'Team 2 must contain at least one member. '
      }
      if (this.arraysHaveCommonElement(this.team1Array, this.team2Array)) {
        errorText += `A player can't be in two teams at once. `
      }
      return errorText;
    },
  },
  watch: {
    formInputsWrapper(newVal, oldVal) {
      const [oldTeam1, oldTeam2] = oldVal.split('|');
      const [newTeam1, newTeam2] = newVal.split('|');
      if (!this.team1gotInput) {
        this.team1gotInput = newTeam1 != '';
      }
      if (!this.team2gotInput) {
        this.team2gotInput = newTeam2 != '';
      }
      this.validateForm()
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      if (this.validationText == '') {
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
