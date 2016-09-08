import Vue from 'vue'
import Vuex from 'vuex'

// Make vue aware of Vuex
Vue.use(Vuex)

// Create an object to hold the initial state when
// the app starts up
const state = {
  rooms: qiscus.rooms,
  selected: qiscus.selected,
  windowStatus: false,
  UserData: {
    email: qiscus.email,
    username: qiscus.username,
    baseURL: qiscus.baseURL,
    userData: qiscus.userData
  }
}

// Create an object storing various mutations. We will write the mutation
const mutations = {
  CHANGE_ROOM (state, room) {
    state.selected = room
  },
  TOGGLE_CHAT_WINDOW (state) {
    state.windowStatus = !state.windowStatus
  },
  CHAT_TARGET (state, email) {
    qiscus.chatTarget(email)
    .then((response) => {
      state.selected = qiscus.selected
    })
  },
  BACK_TO_HOME (state) {
    state.selected = null;
  },
  SUBMIT_COMMENT (state, topic_id, comment) {
    return qiscus.submitComment(topic_id, comment)
    .then((response) => {
      state.selected = qiscus.selected;
      return Promise.resolve(state.selected);
    })
  },
  LOAD_COMMENTS (state, topic_id, last_comment_id, timestamp, after) {
    return qiscus.loadComments(topic_id, last_comment_id, timestamp, after)
    .then((response) => {
      return Promise.resolve(state.selected);
    })
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
