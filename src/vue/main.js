import QiscusSDK from '../sdk'
import Vue from 'vue'
import QiscusWidget from './App'

// Let's initiate the SDK
QiscusSDK.setUser('dragonfly', 'e2@qiscus.com', 'password', 'evn2');
QiscusSDK.init();

/* eslint-disable no-new */
window.vm = new Vue({
  el: 'body',
  components: { QiscusWidget }
})
