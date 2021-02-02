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

  const { isMySelf = false, pageSize = 10, pageNo = 1 } = event
  const pageNoStart = pageNo - 1
  let list = []
  let total = 0
  const p = await db.collection(COLLECTION_NAME)
  try {
    if (isMySelf) {
      total = (await p.count()).total
      list = await p.where({
        openid: wxContext.OPENID
      })
        .orderBy('timestramp', 'desc')
        .skip(pageNoStart * pageSize)
        .limit(pageSize)
        .get()
    } else {
      total = (await p.count()).total
      list = await p
        .orderBy('timestramp', 'desc')
        .skip(pageNoStart * pageSize)
        .limit(pageSize)
        .get()
    }
  } catch (err) {
    return {
      resultCode: '2001',
      resultMsg: '查询失败'
    }
  }
  list.total = total
  return {
    resultCode: '1000',
    ...list
  }
}
