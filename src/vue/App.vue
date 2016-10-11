<template>
  <div id="qcw-app">
    <chat-trigger :label="triggerLabel" :loading="loading"></chat-trigger>
    <chat-window></chat-window>
  </div>
</template>

<script>
/**
 * This component rely on ChatWindow and ChatTrigger Component
 * This component sets Vuex Store, so that all the children
 * able to access Vuex Store
 */
import store from './vuex/store'
import { changeRoom } from './vuex/actions'
import { getSelected, getRooms } from './vuex/getters'
import ChatWindow from './components/ChatWindow.vue'
import ChatTrigger from './components/ChatTrigger.vue'

export default {
  components: {
    ChatWindow, ChatTrigger
  },
  name: 'QiscusWidget',
  computed: {
    triggerLabel() {
      return this.$store.getters.triggerLabel;
    },
    loading() {
      if(!this.$store.state.qiscus.isLogin || this.$store.state.qiscus.isLoading) return true;
      return false;
    }
  },
  store
}
</script>
