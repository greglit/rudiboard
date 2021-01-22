<template>
  <router-link :to="'/player/'+$route.params.boardName+'/'+$route.params.boardId+'/'+name">
    <b-badge class="mr-1 player" variant="info">
      {{name}}
    </b-badge>
  </router-link>
      
  
</template>

<script>
export default {
  name: 'PlayerBadge',
  props: {
    name: String,
  }
}
</script>

<style scoped>
.player {
  border-radius: 2px;
  font-size: 11pt;
}
</style>
