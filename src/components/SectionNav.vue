<template>
  <b-navbar class="border-top p-0">
    <b-navbar-nav>
      <b-nav-text>
        <h2  class="title marker">{{title}}</h2>
      </b-nav-text>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    title : String,
  },
}
</script>

<style scoped>
    .title {
        color: black;
    }
</style>
