const api = require('../../utils/api')
const app = getApp()
const cdnBehavior = require('../../behaviors/cdn')

Page({
  behaviors: [cdnBehavior],
  data: {
    statusBarHeight: 20,
    product: {},
    skuShow: false,
    skuMode: 'buy',
    cartCount: 2,
    loaded: false
  },

  onShow() {
    this.setData({ cartCount: getApp().globalData.cartCount || 0 })
  },

  onLoad(q) {
    this.setData({ statusBarHeight: app.globalData.statusBarHeight })
    this.load(q.id || 'c-yuni')
  },

  load(id) {
    // TODO: 接口联调 getCakeDetail
    api.getCakeDetail(id).then((p) => {
      this.setData({ product: p, loaded: true })
    })
  },

  onBack() {
    const pages = getCurrentPages()
    if (pages.length > 1) wx.navigateBack()
    else wx.switchTab({ url: '/pages/index/index' })
  },

  goShop() {
    wx.navigateTo({ url: '/pages/brand-shop/index?id=' + (this.data.product.brandId || 'ganso') })
  },

  goCart() {
    wx.switchTab({ url: '/pages/cart/index' })
  },

  goService() {
    wx.showToast({ title: '客服待接口联调', icon: 'none' })
  },

  openSkuBuy() {
    this.setData({ skuShow: true, skuMode: 'buy' })
  },

  openSkuCart() {
    this.setData({ skuShow: true, skuMode: 'cart' })
  },

  closeSku() {
    this.setData({ skuShow: false })
  },

  onSkuConfirm(e) {
    const { qty, spec, price } = e.detail || {}
    const p = this.data.product
    this.setData({ skuShow: false })
    if (this.data.skuMode === 'cart') {
      api.addCart({ productId: p.id, qty, spec }).then(() => {
        const cartCount = getApp().bumpCartCount(qty || 1)
        this.setData({ cartCount })
        wx.showToast({ title: '已加入购物车', icon: 'success' })
      })
      return
    }
    const draft = {
      productId: p.id,
      title: p.title,
      spec,
      price: Number(price || p.skuPrice || p.price),
      qty: qty || 1,
      image: p.image,
      shop: p.shop || '元祖蛋糕'
    }
    wx.setStorageSync('cakeOrderDraft', draft)
    wx.navigateTo({ url: '/pages/cake-order/index' })
  }
})
