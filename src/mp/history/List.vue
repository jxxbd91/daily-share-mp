<template>
  <div class="history-box">
    历史记录
    <ul class="history-list">
      <li class="history-item" v-for="item in finalList" :key="item._id">
        <a :href="item.url" target="_blank">{{item.title}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      historyList: []
    }
  },
  async created() {
    this.historyList = (await this.queryList()).result.data || []
    console.log(this.historyList)
    window.addEventListener('reachbottom', () => {
      console.log('reachbottom1')
    })
  },
  computed: {
    finalList() {
      return this.historyList.map(item => ({
        ...item,
        url: `/container?targetUrl=${encodeURIComponent(item.url)}`
      }))
    }
  },
  methods: {
    queryList(isMyself = false) {
      return wx.cloud.callFunction({
        name: 'list',
        data: {
          isMyself
        }
      })
    }
  }
}
</script>

<style>
  .history-box {
    padding: 20px;
  }

  .history-list {
    padding: 0;
    margin: 0;
  }

  .history-item {
    padding: 0;
    padding-left: 10px;
    margin: 10px 0;
    list-style: none;
    color: #4e6ef2;
  }
</style>
