import qiscusCore from '../sdk'
import Vue from 'vue'
import QiscusWidget from './App'
import Toasted from 'vue-toasted';

Vue.use(Toasted, {
  position: 'bottom-right',
  duration: 2000
})

/* let's render the view layer */
// let renderWidget = function() {
//   return new Vue({
//     render(h) {
//       return h(QiscusWidget)
//     }
//   }).$mount('#qiscus-widget')
// };

// if (typeof module === "object" && exports) {
//   module.exports = renderWidget;
// } else if (typeof define === 'function' && define.amd) {
//   define('qiscus_vm', [], function() {
//     return qiscus_vm = renderWidget();
//   });
// } else {
//   window.vm = renderWidget();
// }

function renderSDK() {
  new Vue({
    render(h) {
      return h(QiscusWidget)
    }
  }).$mount('#qiscus-widget')
};

module.exports = {
  core: qiscusCore,
  render: renderSDK
}