<template>
  <div class="history-box">
    <div class="history-btn-box">
      <wx-button
        type="primary"
        class="to-share history-btn"
        @click="toShareHandle"
      >我要分享</wx-button>
      <p
        class="history-scope-btn"
        @click="() => this.isMySelf = !this.isMySelf"
      >查看{{!isMySelf ? '我的' : '全部'}} ⬇️</p>
    </div>
    <ul class="history-list" v-if="finalList.length > 0">
      <li class="history-item" v-for="item in finalList" :key="item._id">
        <p class="history-info">
          <span class="history-user">分享者: {{item.nickName}}</span>
          <span class="history-time">{{item.time}}</span>
        </p>
        <a :href="item.url" target="_blank">{{item.title}}</a>
        <div class="history-content" v-if="item.content">{{item.content}}</div>
      </li>
      <li v-if="isEnd" class="history-end-line">没有更多内容了~</li>
    </ul>
    <div v-else class="history-empty">
      <wx-button
        type="primary"
        class="to-share history-btn"
        @click="toShareHandle"
      >去分享</wx-button>
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
      isMySelf: false
    }
  },
  created() {
    this.fetchAnRender()
    window.addEventListener('reachbottom', this.reachbottomFn)
  },
  computed: {
    finalList() {
      return this.historyList.map(item => ({
        ...item,
        url: `/container?targetUrl=${encodeURIComponent(item.url)}`,
        time: this.getTime(item.timestramp)
      }))
    }
  },
  watch: {
    isMySelf() {
      this.historyList = []
      this.pageNo = 1
      this.fetchAnRender()
    }
  },
  methods: {
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
      const { data = [], total } = (await this.queryList()).result
      this.historyList = [...this.historyList, ...data]
      this.total = total
      if (this.total <= this.historyList.length) {
        this.isEnd = true
        window.removeEventListener('reachbottom', this.reachbottomFn)
      } else {
        this.isEnd = false
      }
    },
    toShareHandle() {
      window.open('/home')
    },
    myShareHandle() {

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

  .history-item {
    margin: 10px 0;
    list-style: none;
    color: #4e6ef2;
    box-shadow: 1px 1px 2px 2px #ddd;
    padding: 10px 5px;
    padding-bottom: 5px;
    border-radius: 5px;
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

  .history-scope-btn {
    color: #333;
    font-size: 14px;
  }
</style>
