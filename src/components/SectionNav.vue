<template>
  <b-navbar class="border-top p-0">
    <b-navbar-nav>
      <b-nav-text>
        <h2  class="title marker">{{title}}</h2>
      </b-nav-text>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <b-nav-item right>
        <b-button v-if="showMoreNeeded" variant="outline-primary" size="sm" @click="toggleShowMore()">
          <div v-if="!showMore">
            Show more
            <b-icon-arrow-down/>
          </div>
          <div v-else>
            Show less
            <b-icon-arrow-up/>
          </div>
        </b-button>
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    title : String,
    showMore : Boolean,
    showMoreNeeded: Boolean,
  },
  data() {
      return {
          data_showMore : this.showMore,
      }
  },
  methods: {
      toggleShowMore() {
          this.data_showMore = !this.data_showMore;
          this.$emit('update:showMore', this.data_showMore);
      }
  }
}
</script>

<style scoped>
    .title {
        color: black;
    }
</style>
