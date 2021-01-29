import Vue from 'vue'
import Container from './Container.vue'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  wx.cloud.init()

  Vue.config.productionTip = false

  return new Vue({
    el: '#app',
    render: h => h(Container)
  })
}
