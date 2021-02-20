// 云函数入口文件
const cloud = require('wx-server-sdk')

const OPENID_LIST_COLLECTION_NAME = 'openidList'


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

async function isExist(openid) {
  const { data } = await db.collection(OPENID_LIST_COLLECTION_NAME).where({
    openid
  }).get()
  return data.length > 0
}

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  let result
  try {
    if (!(await isExist(wxContext.OPENID))) {
      result = await db.collection(OPENID_LIST_COLLECTION_NAME).add({
        data: {
          ...event,
          openid: wxContext.OPENID,
          appid: wxContext.APPID,
          unionid: wxContext.UNIONID,
        }
      })
    }
    return {
      resultCode: '1000',
      data: result
    }
  } catch (err) {
    return {
      resultCode: '2001',
      resultMessage: err
    }
  }
}
