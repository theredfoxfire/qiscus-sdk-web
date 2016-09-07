import Vue from 'vue'
import Vuex from 'vuex'

// Make vue aware of Vuex
Vue.use(Vuex)

// Create an object to hold the initial state when
// the app starts up
const state = {
  rooms: qiscus.rooms,
  selected: qiscus.selected,
  windowStatus: false
}

// Create an object storing various mutations. We will write the mutation
const mutations = {
  CHANGE_ROOM (state, room) {
    state.selected = room
  },
  TOGGLE_CHAT_WINDOW (state) {
    state.windowStatus = !state.windowStatus
  }
}

// Combine the initial state and the mutations to create a Vuex store.
// This store can be linked to our app.
// export default new Vuex.Store({
//   state,
//   mutations
// })
window.vStore = null;
export default (function QiscusStoreSingleton() {
  if (!vStore) vStore = new Vuex.Store({
    state,
    mutations
  })
  return vStore;
})();
