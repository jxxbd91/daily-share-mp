<template>
  <div class="history-box">
    <div class="history-btn-box" v-if="!initLoading">
      <div class="btn-list">
        <wx-button
          type="primary"
          class="to-share history-btn"
          @click="toShareHandle"
        >去分享</wx-button>
        <wx-button
          type="primary"
          class="history-btn"
          @click="copyHandle">{{ selectBtnStatus === 'init' ? '选择复制' : '开始复制' }}</wx-button>
      </div>
      <p
        class="history-scope-btn"
        @click="() => this.isMySelf = !this.isMySelf"
      >查看{{!isMySelf ? '我的' : '全部'}}分享 ⬇️</p>
    </div>
    <ul class="history-list" :class="{'empty': isListEmpty}" v-if="!isListEmpty">
      <li
        v-for="(item, index) in finalList"
        :key="item._id"
        class="history-li"
      >
        <input
          v-if="selectBtnStatus === 'select'" type="checkbox" v-model="selectListModel[index]" />
        <div class="history-item"
          :class="{'select': selectBtnStatus === 'select'}"
          @click="itemHandle(item)">
          <p class="history-info">
            <span class="history-user">分享者: {{item.nickName}}</span>
            <span class="history-time">{{item.time}}</span>
          </p>
          <a>{{item.title}}</a>
          <div class="history-content" v-if="item.content">{{item.content}}</div>
        </div>
      </li>
      <li v-if="isEnd" class="history-end-line">没有更多内容了~</li>
    </ul>
    <div v-else-if="!initLoading && isListEmpty" class="history-empty">
      <p class="history-empty-txt">暂无分享记录~~</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      historyList: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      isEnd: false,
      isMySelf: false,
      initLoading: true,
      selectListModel: [],
      selectBtnStatus: 'init' // init select
    }
  },
  created() {
    this.fetchAnRender()
    this.openidInit()
    window.addEventListener('reachbottom', this.reachbottomFn)
  },
  computed: {
    finalList() {
      return this.historyList.map(item => ({
        ...item,
        url: `/container?targetUrl=${encodeURIComponent(item.url)}`,
        time: this.getTime(item.timestramp)
      }))
    },
    isListEmpty() {
      return this.finalList.length === 0
    }
  },
  watch: {
    isMySelf() {
      this.historyList = []
      this.pageNo = 1
      this.isEnd = false
      this.initLoading = true
      this.fetchAnRender()
    },
    finalList(newVal) {
      this.selectListModel = newVal.map((item, index) => this.selectListModel[index] || false)
    }
  },
  methods: {
    openidInit() {
      wx.cloud.callFunction({
        name: 'openidInit'
      })
    },
    queryList() {
      return wx.cloud.callFunction({
        name: 'list',
        data: {
          isMySelf: this.isMySelf,
          pageSize: this.pageSize,
          pageNo: this.pageNo
        }
      })
    },
    getTime(time) {
      const d = new Date(time)
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    },
    reachbottomFn() {
      if (this.historyList.length < this.total) {
        this.pageNo += 1
        this.fetchAnRender()
      }
    },
    async fetchAnRender() {
      if (this.initLoading) {
        wx.showLoading({
          title: '加载中'
        })
      }
      const { data = [], total } = (await this.queryList()).result
      if (this.initLoading) {
        wx.hideLoading()
      }
      this.initLoading = false
      this.historyList = [...this.historyList, ...data]
      this.total = total
      if (this.total <= this.historyList.length) {
        this.isEnd = true
      } else {
        this.isEnd = false
      }
    },
    toShareHandle() {
      window.open('/home')
    },
    itemHandle(item) {
      window.open(item.url)
    },
    async copyHandle() {
      if (this.selectBtnStatus === 'init') {
        this.selectBtnStatus = 'select'
      } else {
        const list = this.finalList.filter((_item, index) => this.selectListModel[index])
        if (list.length < 1) {
          this.selectBtnStatus = 'init'
          return
        }
        const urlstring = list.map(({ url }) => decodeURIComponent(url.substring(url.indexOf('targetUrl=') + 10))).join('\r\n\r\n')
        await wx.setClipboardData({
          data: urlstring
        })
        this.selectBtnStatus = 'init'
      }
    }
  }
}
</script>

<style>
  .history-box {
    padding: 10px;
  }

  .history-list {
    padding: 0;
    margin: 50px 0 0;
  }

  .btn-list {
    display: flex;
    align-items: center;
  }

  .history-list.empty {
    margin-top: 0;
  }


  .history-li {
    display: flex;
    align-items: center;
  }

  .history-item {
    margin: 10px 0;
    list-style: none;
    color: #4e6ef2;
    box-shadow: 1px 1px 2px 2px #ddd;
    padding: 10px 5px;
    padding-bottom: 5px;
    border-radius: 5px;
    transform: translateX(0);
    transition: 0.3s;
    width: 680rpx;
    flex-shrink: 0;
  }

  .history-item.select {
    transform: translateX(20px);
  }

  .history-info {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    margin: 0;
    padding-bottom: 5px;
    margin-bottom: 5px;
    font-size: 12px;
  }

  .history-user {
    color: #666;
  }

  .history-time {
    color: #ccc;
  }

  .history-content {
    color: #333;
    font-size: 12px;
    padding: 5px;
  }

  .history-empty {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #bbb;
    flex-direction: column;
  }

  .history-empty-txt {
    font-size: 14px;
    margin-bottom: 10px;
    color: #666;
  }

  .history-end-line {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #888;
  }

  .history-btn-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    padding: 10px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0 1px 2px #ccc;
  }

  .history-btn {
    padding: 5px 10px;
  }

  .to-share {
    margin-right: 10px;
  }

  .history-scope-btn {
    color: #333;
    font-size: 14px;
  }
</style>
