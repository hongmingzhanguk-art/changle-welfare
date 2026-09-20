const api = require('../../utils/api')
const cdnBehavior = require('../../behaviors/cdn')

Page({
  behaviors: [cdnBehavior],
  data: {
    keyword: '',
    list: [],
    loaded: false
  },

  onLoad() {
    this.load()
  },

  load() {
    // TODO: 接口联调 getBrandHall
    api.getBrandHall({ keyword: this.data.keyword }).then((res) => {
      this.setData({ loaded: true, list: res.list || [] })
    })
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  search() {
    this.load()
  },

  goShop(e) {
    const id = e.currentTarget.dataset.id || 'ganso'
    wx.navigateTo({ url: '/pages/brand-shop/index?id=' + id })
  }
})
