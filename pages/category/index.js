const api = require('../../utils/api')
const app = getApp()
const cdnBehavior = require('../../behaviors/cdn')

Page({
  behaviors: [cdnBehavior],
  data: {
    statusBarHeight: 20,
    navBarHeight: 64,
    categories: [],
    subCategories: {},
    current: 'grain',
    currentName: '米面粮油',
    subs: [],
    subIndex: 0,
    sort: '综合',
    list: [],
    showAll: false
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        cartCount: getApp().globalData.cartCount || 0
      })
    }
    const enter = wx.getStorageSync('cateEnter')
    if (enter && enter.id) {
      wx.removeStorageSync('cateEnter')
      this.selectCate(enter.id)
    }
  },

  onLoad() {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      navBarHeight: app.globalData.navBarHeight
    })
    this.loadTree()
  },

  loadTree() {
    // TODO: 接口联调 getCategoryTree
    api.getCategoryTree().then((data) => {
      this.setData({
        categories: data.categories,
        subCategories: data.subCategories
      }, () => this.selectCate(this.data.current))
    })
  },

  selectCate(id) {
    const cat = (this.data.categories.length
      ? this.data.categories
      : require('../../utils/mock').categories
    ).find((c) => c.id === id) || { name: '米面粮油' }
    const subs = this.data.subCategories[id] || require('../../utils/mock').subCategories[id] || []
    const subIndex = 0
    this.setData({
      current: id,
      currentName: cat.name,
      subs,
      subIndex,
      showAll: false
    })
    this.loadList()
  },

  onCat(e) {
    const id = e.currentTarget.dataset.id
    if (id === 'all') {
      this.setData({ showAll: true })
      return
    }
    this.selectCate(id)
  },

  toggleAll() {
    this.setData({ showAll: !this.data.showAll })
  },

  pickAll(e) {
    const id = e.currentTarget.dataset.id
    if (id === 'all') {
      this.setData({ showAll: false })
      return
    }
    this.selectCate(id)
  },

  onSub(e) {
    this.setData({ subIndex: e.currentTarget.dataset.index })
    this.loadList()
  },

  onSort(e) {
    this.setData({ sort: e.currentTarget.dataset.sort })
    this.loadList()
  },

  loadList() {
    const { current, subs, subIndex, sort } = this.data
    const subCate = subs[subIndex]
    // TODO: 接口联调 getCategoryProducts
    api.getCategoryProducts({
      categoryId: current,
      subCate,
      sort: sort === '销量' ? 'sales' : 'default'
    }).then((res) => {
      let list = res.list || []
      if (!list.length && subCate) {
        list = require('../../utils/mock').products.filter((p) => p.categoryId === current)
      }
      this.setData({ list })
    })
  },

  goSearch() {
    wx.navigateTo({ url: '/pages/search/index' })
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/index?id=' + e.currentTarget.dataset.id })
  },

  noop() {},

  addCart(e) {
    api.addCart({ productId: e.currentTarget.dataset.id, qty: 1 }).then(() => {
      getApp().bumpCartCount(1)
      wx.showToast({ title: '已加入购物车', icon: 'success' })
    })
  }
})
