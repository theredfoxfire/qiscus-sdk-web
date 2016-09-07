<template>
  <button class="qcw-trigger-btn" @click="toggleChatWindow">
    {{ label || 'Chat' }}
  </button>
</template>

<script>
import {toggleChatWindow} from '../vuex/actions'

export default {
  props: ['label'],
  vuex: {
    actions: {
      toggleChatWindow
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
