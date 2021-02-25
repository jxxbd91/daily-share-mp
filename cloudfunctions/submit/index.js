// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const SHARE_HISTORY_COLLECTION_NAME = 'shareHistory'
const OPENID_LIST_COLLECTION_NAME = 'openidList'

function notNull(val, key) {
  if (!val) throw new Error(`【${key}】 不能为空`)
}

async function validate(submitData) {
  notNull(submitData, 'data')
  const { avatarUrl, nickName, url } = submitData
  notNull(avatarUrl, '头像')
  notNull(nickName, '用户昵称')
  notNull(url, '分享链接')
  console.log(url, 'url')
  try {
    const { data } = await db.collection(SHARE_HISTORY_COLLECTION_NAME).where({
      url
    }).get()
    if (data.length > 0) {
      console.log(data, 'urlHistory')
      const [urlHistory] = data
      throw new Error(`用户【${urlHistory.nickName}】已经分享过同样的内容`)
    }
  } catch (err) {
    throw err
  }
}

async function getDocTitle(url) {
  const html = (await axios.get(url)).data
  const reg = /<title.*>(.*)<\/title>/g
  const res = reg.exec(html) || []
  return res[1]
}

async function queryOpenidList() {
  try {
    const { data } = await db.collection(OPENID_LIST_COLLECTION_NAME).get()
    return data
  } catch (err) {
    console.log(err)
    return []
  }
}

/**
 * 消息推送
 */
async function sendMsg({ userName, content, title, url }) {
  const date = new Date()
  const openidList = await queryOpenidList()
  if (openidList.length === 0) return

  const pageUrl = `https://test.miniprogram.com/container?targetUrl=${url}`

  const page = `pages/container/index?type=open&targeturl=${encodeURIComponent(pageUrl)}`

  try {
    const titleValue = title.length > 10 ? `${title.substring(0, 10)}...` : title
    const contentValue = content.length > 10 ? `${content.substring(0, 10)}...` : content
    await Promise.all(
      openidList.map(
        ({ openid }) => cloud.openapi.subscribeMessage.send({
          touser: openid,
          templateId: 'ENXmRqo56mNUsQXWWHjCv7xS8SwEbUMOqsP_7XattGo',
          page,
          miniprogramState: 'formal',
          data: {
            thing1: {
              value: titleValue
            },
            thing3: {
              value: contentValue
            },
            date4: {
              value: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            },
            thing2: {
              value: userName
            }
          }
        }).catch((err) => {
          console.log('send err::', err)
        })
      )
    )
  } catch (err) {
    console.log(err, 'err')
  }
}

exports.main = async (event) => {
  let result = null
  const context = cloud.getWXContext()
  try {
    await validate(event)
    console.log(event)
    const docTitle = await getDocTitle(event.url) || event.url
    result = await db.collection(SHARE_HISTORY_COLLECTION_NAME).add({
      data: {
        ...event,
        title: docTitle,
        openid: context.OPENID,
        appId: context.APPID,
        timestramp: Date.now()
      }
    })
    await sendMsg({
      userName: event.nickName,
      title: docTitle,
      content: event.content || '你的好友有新的分享',
      url: event.url
    })
  } catch (err) {
    return {
      resultCode: '2001',
      resultMessage: String(err)
    }
  }

  return {
    resultCode: '1000',
    data: result
  }
}
