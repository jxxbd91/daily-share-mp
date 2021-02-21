// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const COLLECTION_NAME = 'shareHistory'
const OPENID_LIST_COLLECTION_NAME = 'openidList'

const beginDate = new Date('2021-2-22').getTime()

async function queryTodayOpenid() {
  const time = new Date().toLocaleDateString()
  const currentDate = new Date(time).getTime()
  const dur = (currentDate - beginDate) / 24 / 3600 / 1000
  const { data: userList = [] } = await db.collection(OPENID_LIST_COLLECTION_NAME).get()
  console.log(dur, 'dur:::')
  return (userList[dur] || {}).openid
}

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()

  const { data: shareListData } = await db.collection(COLLECTION_NAME).orderBy('timestramp', 'desc').limit(1).get()

  let theManShared = false

  const todayOpenid = await queryTodayOpenid()

  console.log('todayOpenid--', todayOpenid)

  if (shareListData && shareListData[0]) {
    const { openid: lastOpenid, timestramp: lastTimestramp } = shareListData[0]
    const lastDate = new Date(lastTimestramp).toLocaleDateString()
    const currentDate = new Date().toLocaleDateString()
    theManShared = currentDate === lastDate && lastOpenid === todayOpenid
  }


  if (!theManShared && todayOpenid) {
    try {
      await cloud.openapi.subscribeMessage.send({
        touser: todayOpenid,
        templateId: 'SSbI4_53wpx2EF097sQ8RhKImsWdGZULyQm0M7irfwc',
        page: 'pages/home/index',
        miniprogramState: 'trial',
        data: {
          thing1: {
            value: '请开始你的分享'
          },
          time2: {
            value: new Date().toLocaleDateString()
          },
          thing4: {
            value: '工作再忙，别忘了今天的分享哦'
          },
          phrase8: {
            value: '待分享'
          }
        }
      })
    } catch (err) {
      console.log(err, 'err::')
    }
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
