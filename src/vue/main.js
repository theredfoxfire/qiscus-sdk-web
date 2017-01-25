import QiscusSDK from '../sdk'
import Vue from 'vue'
import QiscusWidget from './App'

// QiscusSDK.mode = 'wide';
// QiscusSDK.setUser('fikri@qiscus.com', 'password', 'fikri');
// QiscusSDK.init({
//   AppId: 'dragongo',
//   options: {
//     headerClickedCallback(response) {
//       console.info('header di click', response);
//     }
//   }
// });

/* let's render the view layer */
window.vm = new Vue({
  render(h) {
    return h(QiscusWidget)
  }
}).$mount('#qiscus-widget')