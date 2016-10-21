import QiscusSDK from '../sdk'
import Vue from 'vue'
import QiscusWidget from './App'

// Let's initiate the SDK
// QiscusSDK.setUser('e2@qiscus.com', 'password', 'evn2');
// QiscusSDK.setUser('fikri@qiscus.com', 'password', 'fikri');
// QiscusSDK.init({
//   newMessagesCallBack,
//   AppId: 'dragonfly'
// }); 
// function newMessagesCallBack(data){
//   // console.info('New messages', data);
// };

/* eslint-disable no-new */
// window.vm = new Vue({
//   el: 'body',
//   components: { QiscusWidget }
// })
window.vm = new Vue({
  render(h) {
    return h(QiscusWidget)
  }
}).$mount('#qiscus-widget')
