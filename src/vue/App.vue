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
  vuex: {
    getters: {
      triggerLabel: function(state){
        if(!state.qiscus.isLogin) return `initializing qiscus widget ...`;
        if(state.qiscus.isLoading) return `loading chat data ...`;
        return 'Chat'
      },
      loading: function(state) {
        if(!state.qiscus.isLogin || state.qiscus.isLoading) return true;
        return false;
      }
    }
  },
  store
}
</script>
