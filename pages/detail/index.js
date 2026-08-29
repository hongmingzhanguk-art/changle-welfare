const api = require('../../utils/api')
const util = require('../../utils/util')
const app = getApp()

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 64,
    product: {},
    rec: [],
    tab: 'goods',
    sticky: false,
    skuShow: false,
    skuMode: 'buy',
    specText: '默认规格',
    shipDate: '',
    cartCount: 2,
    address: {}
  },

  onShow() {
    this.setData({
      cartCount: getApp().globalData.cartCount || 0,
      address: util.resolveAddress()
    })
  },

  onLoad(q) {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      navBarHeight: app.globalData.navBarHeight,
      address: util.resolveAddress(),
      shipDate: util.formatShipDate(2)
    })
    this.load(q.id || 'p-airpods')
  },

  load(id) {
    // TODO: 接口联调 getProductDetail
    api.getProductDetail(id).then((p) => {
      this.setData({ product: p, rec: p.rec || [], specText: '默认规格' })
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

  onMenu() {
    wx.showToast({ title: '更多功能待接入', icon: 'none' })
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ tab })
    const nav = this.data.statusBarHeight + Math.round(88 * wx.getSystemInfoSync().windowWidth / 750)
    const q = wx.createSelectorQuery()
    q.select('#' + tab).boundingClientRect()
    q.selectViewport().scrollOffset()
    q.exec((res) => {
      const rect = res && res[0]
      const scroll = res && res[1]
      if (!rect || !scroll) return
      wx.pageScrollTo({
        scrollTop: Math.max(0, scroll.scrollTop + rect.top - nav),
        duration: 300
      })
    })
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/index' })
  },

  openSku() {
    this.setData({ skuShow: true, skuMode: 'buy' })
  },

  openSkuCart() {
    this.setData({ skuShow: true, skuMode: 'cart' })
  },

  closeSku() {
    this.setData({ skuShow: false })
  },

  specFromSelected(selected) {
    const vals = selected ? Object.values(selected).filter(Boolean) : []
    return vals.length ? vals.join(' | ') : '默认规格'
  },

  onSkuConfirm(e) {
    const { qty, selected, action } = e.detail || {}
    const spec = this.specFromSelected(selected)
    this.setData({ skuShow: false, specText: spec })
    if (action === 'cart') {
      api.addCart({ productId: this.data.product.id, qty, spec, selected }).then(() => {
        const cartCount = getApp().bumpCartCount(qty || 1)
        this.setData({ cartCount })
        wx.showToast({ title: '已加入购物车', icon: 'success' })
      }).catch(() => {
        wx.showToast({ title: '加入失败，请重试', icon: 'none' })
      })
      return
    }
    wx.navigateTo({
      url: `/pages/order/index?id=${this.data.product.id}&qty=${qty}&spec=${encodeURIComponent(spec)}`
    })
  },

  goCart() {
    wx.switchTab({ url: '/pages/cart/index' })
  },

  goService() {
    wx.showToast({ title: '客服待接口联调', icon: 'none' })
  },

  goDetail(e) {
    wx.redirectTo({ url: '/pages/detail/index?id=' + e.currentTarget.dataset.id })
  },

  addRec(e) {
    const id = e.currentTarget.dataset.id
    if (!id || id === this.data.product.id) return
    api.addCart({ productId: id, qty: 1 }).then(() => {
      const cartCount = getApp().bumpCartCount(1)
      this.setData({ cartCount })
      wx.showToast({ title: '已加入购物车', icon: 'success' })
    }).catch(() => {
      wx.showToast({ title: '加入失败，请重试', icon: 'none' })
    })
  }
})
