<template>
  <wx-web-view :src="url"/>
</template>

<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  beforeCreate() {
    window.addEventListener('wxload', (params) => {
      this.url = decodeURIComponent(decodeURIComponent(params.targeturl).replace(/.*targetUrl=(.*)(&|\b)/, '$1'))
    })
  }
}
</script>

<style>

</style>
