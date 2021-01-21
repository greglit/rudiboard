<template>
  <b-navbar size="sm" sticky variant="dark" type="dark">
    <b-container>
      <b-navbar-brand href="/">
        <img src="../assets/logo.png" class="d-inline-block align-top logo" alt="rudiboard">
        <span v-if="brandname" class="ml-2">rudiboard</span>
      </b-navbar-brand>
      <slot></slot>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    brandname : Boolean,
  }
}
</script>

<style scoped>
.logo {
  height: 30px;
  width: 30px;
}
</style>
