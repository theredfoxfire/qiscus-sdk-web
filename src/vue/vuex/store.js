import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import MqttAdapter from '../../MqttAdapter'
import MqttCallback from '../../MqttCallback'

// Make vue aware of Vuex
Vue.use(Vuex)

// Create an object to hold the initial state when
// the app starts up
const state = {
  qiscus: qiscus,
  selected: qiscus.selected,
  windowStatus: false,
  participants: qiscus.participants,
  // mqtt: new MqttAdapter("wss://mqtt.qiscus.com:1886", callbacks),
  mqtt: new MqttAdapter("wss://mqtt.qiscus.com:1886/mqtt", MqttCallback),
  mqttData: {
    typing: ''
  },
  init: qiscus.isInit,
  isLoadingComments: false,
  imageModalLink: '',
  imageModalOn: false
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
    if(state.selected) {
      state.mqtt.unsubscribe(`r/${state.selected.id}/${state.selected.last_comment_topic_id}/+/t`);
      state.mqtt.unsubscribe(`r/${state.selected.id}/${state.selected.last_comment_topic_id}/+/t`);
      state.mqtt.unsubscribe(`${state.qiscus.userData.token}/c`);
    }
    qiscus.chatTarget(email)
    .then((response) => {
      state.windowStatus = true;
      state.selected = state.qiscus.selected;
      state.mqtt.subscribe(`r/${state.selected.id}/${state.selected.last_comment_topic_id}/+/t`);
      state.mqtt.subscribe(`${state.qiscus.userData.token}/c`);
    })
  },
  LOAD_COMMENTS (state, payload) {
    state.isLoadingComments = true;
    qiscus.loadComments(payload.topic_id, payload.last_comment_id).then((response) => {
      state.isLoadingComments = false;
      state.selected = qiscus.selected;
    }, (error) => {
      console.error('Error loading Comments', error);
      state.isLoadingComments = false;
    })
  },
  UPDATE_SELECTED (state) {
    state.selected = qiscus.selected;
  },
  BACK_TO_HOME (state) {
    state.selected = null;
  },
  SUBMIT_COMMENT (state, payload) {
    state.selected = payload;
    // state.selected = qiscus.selected;
    // return qiscus.submitComment(payload.topic_id, payload.comment)
    // .then((response) => {
    //   state.selected = qiscus.selected;
    //   return Promise.resolve(state.selected);
    // })
  },
  SET_TYPING (state, payload) {
    if(payload.topic == state.qiscus.email) return
    if(payload.message == 1){
      state.mqttData.typing = payload.topic;
    } else {
      state.mqttData.typing = '';
    }
  },
  SET_READ (state, payload) {
    state.mqtt.publish(`r/${state.selected.id}/${state.selected.last_comment_topic_id}/${state.qiscus.email}/d`, `${payload.id}:${payload.unique_id}`);
    state.mqtt.publish(`r/${state.selected.id}/${state.selected.last_comment_topic_id}/${state.qiscus.email}/r`, `${payload.id}:${payload.unique_id}`);
    state.selected = qiscus.selected;
  },
  TOGGLE_INIT (state, payload) {
    state.init = !state.init 
  },
  OPEN_IMAGE_MODAL (state, payload) {
    state.imageModalOn = true;
    state.imageModalLink = payload;
  },
  CLOSE_IMAGE_MODAL (state) {
    state.imageModalLink = '';
    state.imageModalOn = false;
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
