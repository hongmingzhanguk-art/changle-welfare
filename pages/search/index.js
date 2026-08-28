const api = require('../../utils/api')

Page({
  data: { keyword: '', list: [], history: ['挂面', '耳机', '蛋糕'] },
  onInput(e) { this.setData({ keyword: e.detail.value }) },
  search(e) {
    const keyword = (e.detail && e.detail.value) || this.data.keyword
    this.setData({ keyword })
    // TODO: 接口联调 searchProducts
    api.searchProducts(keyword).then((res) => this.setData({ list: res.list }))
  },
  tapHis(e) {
    this.setData({ keyword: e.currentTarget.dataset.k })
    this.search({ detail: { value: e.currentTarget.dataset.k } })
  },
  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/index?id=' + e.currentTarget.dataset.id })
  }
})
