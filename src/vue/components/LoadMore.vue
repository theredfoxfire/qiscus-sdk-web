<template>
  <li class="load-more-button" @click="clickHandler">
    <Loader v-if="isLoadingComments"></Loader> Load more comments
  </li> 
</template>

<script>
  import Loader from './Loader.vue'
  export default {
    name: 'LoadMoreButton',
    components: {Loader},
    props: ['isLoadingComments', 'clickHandler']
  }
</script>

<style lang="scss">
  .load-more-button {
    background: #ccc;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    font-size: 12px;
    border-radius: 30px;
    width: 170px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }
</style>