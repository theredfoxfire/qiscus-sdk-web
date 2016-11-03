import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import MqttAdapter from '../../MqttAdapter'

// Make vue aware of Vuex
Vue.use(Vuex)

// Setup Callbacks for Mqtt
const callbacks = {
  typing: function(topic, message){
    vStore.dispatch('setTyping', {topic, message});
  }
}

// Create an object to hold the initial state when
// the app starts up
const state = {
  qiscus: qiscus,
  selected: qiscus.selected,
  windowStatus: false,
  participants: qiscus.participants,
  mqtt: new MqttAdapter("ws://52.77.234.57:1884", callbacks),
  mqttData: {
    typing: ''
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
    state.mqttData.typing = '';
    if(state.selected) state.mqtt.unsubscribe(`r/${state.selected.id}/${state.selected.last_comment_topic_id}/+/t`);
    qiscus.chatTarget(email)
    .then((response) => {
      state.windowStatus = true;
      state.selected = state.qiscus.selected;
      state.mqtt.subscribe(`r/${state.selected.id}/${state.selected.last_comment_topic_id}/+/t`);
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
  SET_TYPING (state, payload) {
    if(payload.message == 1){
      state.mqttData.typing = payload.topic;
    } else {
      state.mqttData.typing = '';
    }
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
