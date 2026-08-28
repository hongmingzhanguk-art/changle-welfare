const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 64,
    product: {},
    rec: [],
    tab: 'goods',
    sticky: false,
    skuShow: false
  },

  onLoad(q) {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      navBarHeight: app.globalData.navBarHeight
    })
    this.load(q.id || 'p-airpods')
  },

  load(id) {
    // TODO: 接口联调 getProductDetail
    api.getProductDetail(id).then((p) => {
      this.setData({ product: p, rec: p.rec || [] })
    })
  },

  onPageScroll(e) {
    this.setData({ sticky: e.scrollTop > 280 })
  },

  onBack() {
    const pages = getCurrentPages()
    if (pages.length > 1) wx.navigateBack()
    else wx.switchTab({ url: '/pages/index/index' })
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ tab })
  },

  openSku() {
    this.setData({ skuShow: true })
  },

  closeSku() {
    this.setData({ skuShow: false })
  },

  onSkuConfirm(e) {
    const { qty, selected } = e.detail
    this.setData({ skuShow: false })
    const spec = Object.values(selected).join(' | ')
    wx.navigateTo({
      url: `/pages/order/index?id=${this.data.product.id}&qty=${qty}&spec=${encodeURIComponent(spec)}`
    })
  },

  addCart() {
    api.addCart({ productId: this.data.product.id, qty: 1 }).then(() => {
      wx.showToast({ title: '已加入购物车', icon: 'success' })
    })
  },

  goCart() {
    wx.switchTab({ url: '/pages/cart/index' })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  goDetail(e) {
    wx.redirectTo({ url: '/pages/detail/index?id=' + e.currentTarget.dataset.id })
  }
})
