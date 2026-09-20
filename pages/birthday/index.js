const api = require('../../utils/api')
const app = getApp()
const cdnBehavior = require('../../behaviors/cdn')

Page({
  behaviors: [cdnBehavior],
  data: {
    city: '常州',
    cats: [],
    brands: [],
    tabs: [],
    tabId: 'rec',
    products: [],
    loaded: false
  },

  onLoad() {
    this.setData({ city: app.globalData.selectedCity || '常州' })
    this.load()
  },

  load() {
    // TODO: 接口联调 getBirthdayHome
    api.getBirthdayHome().then((data) => {
      this._products = data.products || []
      const tabId = this.data.tabId
      this.setData({
        loaded: true,
        cats: data.cats || [],
        brands: data.brands || [],
        tabs: data.tabs || [],
        products: this.productsOf(tabId)
      })
    })
  },

  productsOf(tabId) {
    return (this._products || []).filter((p) => (p.tab || 'rec') === tabId)
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

  goSearch() {
    wx.navigateTo({ url: '/pages/search/index?from=cake' })
  },

  goBrandHall() {
    wx.navigateTo({ url: '/pages/brand-hall/index' })
  },

  goBrand(e) {
    const id = e.currentTarget.dataset.id || 'ganso'
    wx.navigateTo({ url: '/pages/brand-shop/index?id=' + id })
  },

  goCakeList(e) {
    const cat = (e.currentTarget.dataset && e.currentTarget.dataset.id) || 'birthday'
    wx.navigateTo({ url: '/pages/cake-list/index?cat=' + cat })
  },

  onTab(e) {
    const tabId = e.currentTarget.dataset.id
    this.setData({ tabId, products: this.productsOf(tabId) })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id || 'c-yuni'
    wx.navigateTo({ url: '/pages/cake-detail/index?id=' + id })
  },

  addCart(e) {
    const id = e.currentTarget.dataset.id
    // TODO: 接口联调 addCart
    api.addCart({ productId: id, qty: 1, spec: '1磅' }).then(() => {
      getApp().bumpCartCount(1)
      wx.showToast({ title: '已加入购物车', icon: 'success' })
    })
  }
})
