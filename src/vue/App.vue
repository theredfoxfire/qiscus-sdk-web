<template>
  <div id="qcw-app">
    <chat-trigger label="Chat"></chat-trigger>
    <chat-window :users="users"></chat-window>
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
  data() {
    return {
      users: [
        {username: 'fikri', email: 'fikri@qiscus.com'},
        {username: 'uddin_penyok', email: 'apiep.test@gg.com'},
        {username: 'evan', email: 'e2@qiscus.com'}
      ]
    }
  },
  store
}
</script>

<style>
#qcw-app *, #qcw-app *:before, #qcw-app*:after {
  margin: 0 auto; padding: 0;
}
</style>
