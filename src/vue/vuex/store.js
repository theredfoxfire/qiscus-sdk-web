import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'

// Make vue aware of Vuex
Vue.use(Vuex)

// Create an object to hold the initial state when
// the app starts up
const state = {
  qiscus: qiscus,
  selected: qiscus.selected,
  windowStatus: false,
  participants: qiscus.participants
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
      state.selected = qiscus.selected;
      state.windowStatus = true;
    })
  },
  BACK_TO_HOME (state) {
    state.selected = null;
  },
  SUBMIT_COMMENT (state, payload) {
    return qiscus.submitComment(payload.topic_id, payload.comment)
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

// Set the Getters
const getters = {
  triggerLabel: (state) => {
    if(!state.qiscus.isLogin) return `initializing qiscus widget ...`;
    if(state.qiscus.isLoading) return `loading chat data ...`;
    return 'Chat'
  }
}

window.vStore = null;
export default (function QiscusStoreSingleton() {
  if (!vStore) vStore = new Vuex.Store({
    state,
    mutations,
    getters,
    actions
  })
  return vStore;
})();
