import QiscusSDK from '../sdk'
import Vue from 'vue'
import QiscusWidget from './App'

// Let's initiate the SDK
QiscusSDK.setUser('dragonfly', 'e2@qiscus.com', 'password', 'evn2');
QiscusSDK.init();
QiscusSDK.setParticipants([
  {username: 'fikri', email: 'fikri@qiscus.com'},
  {username: 'uddin_penyok', email: 'apiep.test@gg.com'},
  {username: 'evan', email: 'e2@qiscus.com'}
])
/* eslint-disable no-new */
window.vm = new Vue({
  el: 'body',
  components: { QiscusWidget }
})
