// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const COLLECTION_NAME = 'shareHistory'

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()

  const { isMySelf = false } = event
  let list = []
  try {
    if (isMySelf) {
      list = await db.collection(COLLECTION_NAME).where({
        openid: wxContext.OPENID
      }).get()
    } else {
      list = await db.collection(COLLECTION_NAME).get()
    }
  } catch (err) {
    return {
      resultCode: '2001',
      resultMsg: '查询失败'
    }
  }
  return {
    resultCode: '1000',
    ...list
  }
}
