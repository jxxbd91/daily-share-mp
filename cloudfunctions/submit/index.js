// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

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

exports.main = async (event, context) => {
  let result = null
  try {
    await validate(event)
    result = await db.collection(COLLECTION_NAME).add({
      data: {
        ...event,
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