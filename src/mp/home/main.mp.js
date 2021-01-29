import Vue from 'vue'
import App from './App.vue'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)
  document.title = '每日分享'

  Vue.config.productionTip = false

  wx.cloud.init()

  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
