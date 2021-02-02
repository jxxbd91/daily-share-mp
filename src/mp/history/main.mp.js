import Vue from 'vue'
import List from './List.vue'
import { CLOUD_ENV } from '../../constants'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)
  const isMySelf = (decodeURIComponent(location.search).match(/isMySelf=([^&\b]*)/) || [])[1] === 'true'
  wx.cloud.init({
    env: CLOUD_ENV
  })

  Vue.config.productionTip = false

  return new Vue({
    el: '#app',
    render: h => h(List, {
      props: {
        isMySelf
      }
    })
  })
}
