<template>
  <div :class="showMore ? 'show less' : 'show more'">
    <b-button @click="toggleShowMore()" class="m-2" variant="outline-primary" size="md">
      <div v-if="!showMore">
        Show more
        <b-icon-arrow-down/>
      </div>
      <div v-else>
        Show less
        <b-icon-arrow-up/>
      </div>
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'ShowMore',
  props: ['showMore'],
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
.show {
  
  left:0px;
  right: 0px;
  z-index: 10;
  background-color: white;
  box-shadow: 0 -10px 10px -10px #333;
}

.more {
  position: absolute;
  bottom: 0;
}

.less {
  position: sticky;
  bottom: 0;
}
</style>
