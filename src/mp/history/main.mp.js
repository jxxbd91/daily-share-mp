import Vue from 'vue'
import List from './List.vue'
import { CLOUD_ENV, subscribeTemplateIds } from '../../constants'

export default async function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)
  const isMySelf = (decodeURIComponent(location.search).match(/isMySelf=([^&\b]*)/) || [])[1] === 'true'
  wx.cloud.init({
    env: CLOUD_ENV
  })

  Vue.config.productionTip = false

  const { subscriptionsSetting: { mainSwitch, itemSettings = {} } } = await wx.getSetting({
    withSubscriptions: true
  })

  if (!mainSwitch) {
    wx.showModal({
      title: '请开启消息订阅',
      showCancel: false
    })

    return null
  }

  if (!itemSettings[subscribeTemplateIds.message] && !itemSettings[subscribeTemplateIds.todo]) {
    try {
      wx.showModal({
        title: '请订阅消息推送',
        content: '您将接收到别人分享的消息推送，请勾选保持开启',
        showCancel: false,
        confirmText: '订阅',
        success() {
          wx.requestSubscribeMessage({
            tmplIds: Object.values(subscribeTemplateIds)
          })
        }
      })
    } catch (err) {
      console.log(err)
      wx.reLaunch()
    }
  }

  if (!itemSettings[subscribeTemplateIds.message]) {
    try {
      await wx.requestSubscribeMessage({
        tmplIds: [subscribeTemplateIds.message]
      })
    } catch (err) {
      wx.relaunch()
    }
  }

  if (!itemSettings[subscribeTemplateIds.todo]) {
    try {
      await wx.requestSubscribeMessage({
        tmplIds: [subscribeTemplateIds.todo]
      })
    } catch (err) {
      wx.relaunch()
    }
  }

  return new Vue({
    el: '#app',
    render: h => h(List, {
      props: {
        isMySelf
      }
    })
  })
}
