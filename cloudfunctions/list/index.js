// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const COLLECTION_NAME = 'shareHistory'

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const { isMyList = false } = event
  let list = []
  try {
    if (isMyList) {
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