import Vue from 'vue'
import Container from './Container.vue'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  document.title = '每日分享'

  wx.cloud.init()

  wx.setEnableDebug({
    enableDebug: true
  })

  Vue.config.productionTip = false

  return new Vue({
    el: '#app',
    render: h => h(Container)
  })
}
