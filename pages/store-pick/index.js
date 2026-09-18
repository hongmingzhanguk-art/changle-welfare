const api = require('../../utils/api')
const app = getApp()
const cdnBehavior = require('../../behaviors/cdn')

Page({
  behaviors: [cdnBehavior],
  data: {
    city: '常州',
    keyword: '',
    list: []
  },

  onLoad() {
    this.setData({ city: app.globalData.selectedCity || '常州' })
    this.load()
  },

  load() {
    // TODO: 接口联调 getCakeStores
    api.getCakeStores({ keyword: this.data.keyword }).then((res) => {
      this.setData({ list: res.list || [] })
    })
  },

  goCity() {
    const cities = ['常州', '南京', '苏州', '无锡']
    wx.showActionSheet({
      itemList: cities,
      success: (res) => {
        const city = cities[res.tapIndex]
        app.globalData.selectedCity = city
        this.setData({ city })
      }
    })
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  search() {
    this.load()
  },

  pick(e) {
    const id = e.currentTarget.dataset.id
    const store = (this.data.list || []).find((s) => s.id === id)
    if (!store) return
    wx.setStorageSync('cakePickedStore', store)
    const pages = getCurrentPages()
    const prev = pages.length > 1 ? pages[pages.length - 2] : null
    if (prev && prev.route === 'pages/cake-order/index') {
      wx.navigateBack()
      return
    }
    wx.navigateTo({ url: '/pages/cake-order/index?mode=pickup' })
  }
})
