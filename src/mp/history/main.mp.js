import Vue from 'vue'
import List from './List.vue'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)
  document.title = '分享记录'

  wx.cloud.init()

  Vue.config.productionTip = false

  return new Vue({
    el: '#app',
    render: h => h(List)
  })
}
