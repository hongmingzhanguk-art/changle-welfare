const api = require('../../utils/api')
const app = getApp()
const cdnBehavior = require('../../behaviors/cdn')

Page({
  behaviors: [cdnBehavior],
  data: {
    statusBarHeight: 20,
    cats: [],
    catId: 'birthday',
    delivery: 'sameCity',
    list: []
  },

  onLoad(q) {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      catId: (q && q.cat) || 'birthday'
    })
    this.load()
  },

  load() {
    // TODO: 接口联调 getCakeList
    api.getCakeList({ cat: this.data.catId, delivery: this.data.delivery }).then((res) => {
      this.setData({
        cats: res.cats || [],
        list: res.list || []
      })
    })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  goSearch() {
    wx.navigateTo({ url: '/pages/search/index?from=cake' })
  },

  onCat(e) {
    this.setData({ catId: e.currentTarget.dataset.id })
    this.load()
  },

  onDelivery(e) {
    this.setData({ delivery: e.currentTarget.dataset.d })
    this.load()
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/cake-detail/index?id=' + (e.currentTarget.dataset.id || 'c-yuni') })
  }
})
