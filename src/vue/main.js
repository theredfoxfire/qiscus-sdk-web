import QiscusSDK from '../sdk'
import Vue from 'vue'
import QiscusWidget from './App'

QiscusSDK.setUser('fikri@qiscus.com', 'password', 'fikri')
QiscusSDK.init({AppId: 'dragonfly'})
/* let's render the view layer */
window.vm = new Vue({
  render(h) {
    return h(QiscusWidget)
  }
}).$mount('#qiscus-widget')
