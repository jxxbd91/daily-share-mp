import Vue from 'vue'
import List from './List.vue'
import { CLOUD_ENV, subscribeTemplateIds } from '../../constants'

function withPromise(fn, params) {
  const options = { ...params }
  return new Promise((resolve, reject) => {
    options.success = (info) => {
      if (typeof params.success === 'function') params.success()
      resolve(info)
    }
    options.fail = (err) => {
      if (typeof params.fail === 'function') params.fail()
      reject(err)
    }
    fn(options)
  })
}

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

  console.log('itemSettings::', itemSettings)

  if (!mainSwitch) {
    try {
      await withPromise(wx.showModal, {
        title: '请开启消息订阅',
        showCancel: false
      })

      wx.reLaunch()
    } catch (err) {
      console.log(err)
    }
  }

  if (!itemSettings[subscribeTemplateIds.message] && !itemSettings[subscribeTemplateIds.todo]) {
    try {
      await withPromise(wx.showModal, {
        title: '请订阅消息推送',
        content: '您将接收到别人分享的消息推送，请勾选保持开启',
        showCancel: false,
        confirmText: '订阅'
      })

      await withPromise(wx.requestSubscribeMessage, {
        tmplIds: Object.values(subscribeTemplateIds)
      })
    } catch (err) {
      console.log(err, '1')
      wx.reLaunch()
    }
  } else if (!itemSettings[subscribeTemplateIds.message]) {
    try {
      await withPromise(wx.showModal, {
        title: '请订阅消息推送',
        content: '您将接收到别人分享的消息推送，请勾选保持开启',
        showCancel: false,
        confirmText: '订阅'
      })

      await withPromise(wx.requestSubscribeMessage, {
        tmplIds: [subscribeTemplateIds.message]
      })
    } catch (err) {
      console.log(err, '2')
      wx.reLaunch()
    }
  } else if (!itemSettings[subscribeTemplateIds.todo]) {
    try {
      await withPromise(wx.showModal, {
        title: '请订阅消息推送',
        content: '您将接收到别人分享的消息推送，请勾选保持开启',
        showCancel: false,
        confirmText: '订阅'
      })

      await withPromise(wx.requestSubscribeMessage, {
        tmplIds: [subscribeTemplateIds.todo]
      })
    } catch (err) {
      console.log(err, '3')
      wx.reLaunch()
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
