const api = require('../../utils/api')
const app = getApp()
const cdnBehavior = require('../../behaviors/cdn')

Page({
  behaviors: [cdnBehavior],
  data: {
    statusBarHeight: 20,
    navBarHeight: 64,
    city: '常州',
    banners: [],
    categories: [],
    movies: [],
    brands: [],
    popular: [],
    tabs: [],
    tabId: 'hot',
    products: [],
    allProducts: []
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        cartCount: getApp().globalData.cartCount || 0
      })
    }
    this.setData({ city: app.globalData.selectedCity })
  },

  onLoad() {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      navBarHeight: app.globalData.navBarHeight,
      city: app.globalData.selectedCity
    })
    this.loadData()
  },

  loadData() {
    // TODO: 接口联调 getHomeData
    api.getHomeData().then((data) => {
      const all = require('../../utils/mock').products
      this.setData({
        banners: data.banners,
        categories: data.categories,
        movies: data.movies,
        brands: data.brands,
        popular: data.popular,
        tabs: data.tabs,
        allProducts: all,
        products: this.filterByTab(all, 'hot')
      })
    })
  },

  filterByTab(list, tabId) {
    if (tabId === 'hot') return list.filter((p) => ['p-yipin', 'p-panpan', 'p-franzzi', 'p-haodi', 'p-chooduo', 'p-dettol'].indexOf(p.id) > -1)
    if (tabId === 'snack') return list.filter((p) => p.categoryId === 'snack')
    if (tabId === 'care') return list.filter((p) => p.categoryId === 'care')
    if (tabId === 'digital') return list.filter((p) => p.categoryId === 'digital')
    return list.slice(0, 6)
  },

  onTab(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ tabId: id, products: this.filterByTab(this.data.allProducts, id) })
  },

  goSearch() {
    wx.navigateTo({ url: '/pages/search/index' })
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

  goCate(e) {
    const { id, name } = e.currentTarget.dataset
    if (id === 'movie') {
      wx.navigateTo({ url: '/pages/movie/index' })
      return
    }
    if (id === 'cake') {
      wx.navigateTo({ url: '/pages/cake-list/index' })
      return
    }
    if (id === 'all') {
      wx.switchTab({ url: '/pages/category/index' })
      return
    }
    wx.setStorageSync('cateEnter', { id, name })
    wx.switchTab({ url: '/pages/category/index' })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id || 'p-airpods'
    wx.navigateTo({ url: '/pages/detail/index?id=' + id })
  },

  addCart(e) {
    const id = e.currentTarget.dataset.id
    // TODO: 接口联调 addCart
    api.addCart({ productId: id, qty: 1 }).then(() => {
      getApp().bumpCartCount(1)
      wx.showToast({ title: '已加入购物车', icon: 'success' })
    })
  },

  buyTicket() {
    wx.navigateTo({ url: '/pages/movie/index' })
  },

  goOps(e) {
    const t = e.currentTarget.dataset.t
    if (t === '节日礼包') {
      wx.navigateTo({ url: '/pages/birthday/index' })
      return
    }
    wx.showToast({ title: (t || '功能') + '待接口联调', icon: 'none' })
  }
})
