<template>
  <button class="qcw-trigger-btn" @click="toggleChatWindow">
    <Loader v-if="loading"></Loader> {{ label || 'Chat' }}
  </button>
</template>

<script>
import Loader from './Loader.vue'

export default {
  props: ['label', 'loading'],
  components: { Loader },
  methods: { 
    toggleChatWindow() {
      this.$store.dispatch('toggleChatWindow');
    } 
  }
}
</script>

<style lang="scss">
.qcw-trigger-btn {
  position: fixed;
  bottom: 5px;
  right: 5px;
  border: 0;
  border-bottom: 5px solid darken(#16a085, 10);
  border-radius: 5px;
  background: #16a085;
  color: #ecf0f1;
  padding: 10px 25px;
  cursor: pointer;
  transition: all .32s ease;
  &:hover {
    transform: translateY(-10px);
  }
}
</style>
