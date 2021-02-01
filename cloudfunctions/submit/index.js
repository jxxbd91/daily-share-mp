// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const COLLECTION_NAME = 'shareHistory'

function notNull(val, key) {
  if (!val) throw `【${key}】 不能为空`
}

async function validate(submitData) {
  notNull(submitData, 'data')
  const { avatarUrl, nickName, url } = submitData
  notNull(avatarUrl, '头像')
  notNull(nickName, '用户昵称')
  notNull(url, '分享链接')
  console.log(url, 'url')
  try {
    const { data } = await db.collection(COLLECTION_NAME).where({
      url
    }).get()
    if (data.length > 0) {
      console.log(data, 'urlHistory')
      const [urlHistory] = data
      throw `用户【${urlHistory.nickName}】已经分享过同样的内容`
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

exports.main = async (event) => {
  let result = null
  const context = cloud.getWXContext()
  try {
    await validate(event)
    console.log(event)
    const docTitle = await getDocTitle(event.url) || event.url
    result = await db.collection(COLLECTION_NAME).add({
      data: {
        ...event,
        title: docTitle,
        openid: context.OPENID,
        appId: context.APPID,
        timestramp: Date.now()
      }
    })
  } catch (err) {
    return {
      resultCode: '2001',
      resultMessage: err
    }
  }

  return {
    resultCode: '1000',
    data: result
  }
}
