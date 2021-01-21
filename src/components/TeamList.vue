<template>
  <span>
    <b-badge :key="key" v-for="(name, key) in team" class="mr-1" :href="'/player/'+name">
        {{name}}
    </b-badge>
  </span>
</template>

<script>
export default {
  name: 'TeamList',
  props: {
      team : Array,
  },
  data() {
      return {

      }
  },
}
</script>

<style scoped>

</style>
