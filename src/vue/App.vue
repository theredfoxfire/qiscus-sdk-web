<template>
  <div id="qcw-app">
    <chat-trigger label="Chat"></chat-trigger>
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
  store
}
</script>
