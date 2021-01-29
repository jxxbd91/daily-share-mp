<template>
  <div id="app" class="wrap">
    <div class="user-info">
      <img class="avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" />
      <span class="nick-name">{{nickNameInUI}}你好:</span>
    </div>
    <label for="url" class="lb">
      请粘贴所需要分享的链接：
      <input v-model="url" id="url" class="url-box" :focus="true"/>
    </label>
    <label for="content" class="lb">
      请输入想要分享的内容：
      <textarea v-model="content" rows="4" class="content-box"></textarea>
    </label>
    <div class="btn-box">
      <wx-button
      type="primary" class="btn" open-type="getUserInfo" @getuserinfo="submitHandle">分享</wx-button>
      <wx-button type="default" class="btn" @click="viewHandle">查看记录</wx-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  data() {
    return {
      url: '',
      content: '',
      userInfo: {},
      initSuccess: false
    }
  },
  computed: {
    nickNameInUI() {
      return this.userInfo && this.userInfo.nickName ? (`${this.userInfo.nickName},`) : ''
    }
  },
  async created() {
    try {
      const userInfo = (await wx.getUserInfo()).userInfo
      this.userInfo = userInfo
      this.initSuccess = true
    } catch (err) {
      console.log(err, 'err')
    }
  },
  methods: {
    submitHandle(event) {
      const { userInfo } = event.$_detail
      if (userInfo) {
        if (!this.initSuccess) {
          this.userInfo = userInfo
        }
        wx.cloud.callFunction({
          name: 'submit',
          data: {
            url: this.url,
            content: this.content,
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName
          }
        }).then((res) => {
          if (res.result.resultCode === '1000') {
            wx.showToast({
              title: '分享成功',
              icon: 'success'
            })
          } else {
            wx.showModal({
              title: res.result.resultMessage,
              showCancel: false
            })
          }
        }, (err) => {
          console.log('err', err)
        })
      }
    },
    viewHandle() {
      window.open('/history')
    }
  }
})
</script>

<style>
  .wrap {
    padding: 20px;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    color: #999;
  }

  .user-info {
    display: flex;
    margin: 10px 0 20px;
  }

  .avatar {
    height: 30px;
    width: 30px;
    border-radius: 100%;
    margin-right: 10px;
  }

  .nick-name {
    color: #000;
  }

  .url-box {
    height: 30px;
    line-height: 30px;
  }

  .url-box, .content-box {
    margin-top: 10px;
    border: 1px solid #eeeeee;
    width: 100%;
    margin-bottom: 20px;
    padding: 2px;
  }

  .btn-box {
    display: flex;
    justify-content: center;
  }

  .btn {
    align-self: center;
    padding: 5px 10px;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 3px;
  }

</style>
