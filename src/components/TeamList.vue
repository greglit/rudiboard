<template>
  <span>
    <player-badge :key="key" v-for="(name, key) in team" :name="name" />
  </span>
</template>

<script>
import PlayerBadge from './PlayerBadge.vue'
export default {
  name: 'TeamList',
  components: {
    PlayerBadge,

  },
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
