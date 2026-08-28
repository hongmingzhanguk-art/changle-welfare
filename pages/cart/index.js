const api = require('../../utils/api')
const mock = require('../../utils/mock')
const app = getApp()

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 64,
    groups: [],
    guess: [],
    managing: false,
    allChecked: false,
    total: '0.00',
    count: 0,
    itemCount: 0
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    this.loadCart()
  },

  onLoad() {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      navBarHeight: app.globalData.navBarHeight
    })
  },

  loadCart() {
    // TODO: 接口联调 getCart
    api.getCart().then((res) => {
      const groups = (res.groups || []).map((g) => ({
        ...g,
        items: g.items.map((it) => ({ ...it, x: 0 }))
      }))
      this.setData({
        groups,
        guess: ['p-huawei', 'p-luxihe', 'p-franzzi', 'p-chicken']
          .map((id) => mock.products.find((p) => p.id === id))
          .filter(Boolean)
      })
      this.recalc()
    })
  },

  recalc() {
    let total = 0
    let count = 0
    let itemCount = 0
    let all = this.data.groups.length > 0
    this.data.groups.forEach((g) => {
      g.items.forEach((it) => {
        itemCount += 1
        if (it.checked) {
          total += it.price * it.qty
          count += 1
        } else all = false
      })
    })
    if (!this.data.groups.length) all = false
    this.setData({ total: total.toFixed(2), count, itemCount, allChecked: all })
  },

  toggleItem(e) {
    const { gi, ii } = e.currentTarget.dataset
    const key = `groups[${gi}].items[${ii}].checked`
    const checked = !this.data.groups[gi].items[ii].checked
    this.setData({ [key]: checked })
    const g = this.data.groups[gi]
    this.setData({
      [`groups[${gi}].checked`]: g.items.every((it) => it.checked)
    })
    this.recalc()
  },

  toggleShop(e) {
    const gi = e.currentTarget.dataset.gi
    const checked = !this.data.groups[gi].checked
    const patch = { [`groups[${gi}].checked`]: checked }
    this.data.groups[gi].items.forEach((_, i) => {
      patch[`groups[${gi}].items[${i}].checked`] = checked
    })
    this.setData(patch)
    this.recalc()
  },

  toggleAll() {
    const all = !this.data.allChecked
    const groups = this.data.groups.map((g) => ({
      ...g,
      checked: all,
      items: g.items.map((it) => ({ ...it, checked: all }))
    }))
    this.setData({ groups, allChecked: all })
    this.recalc()
  },

  onChange(e) {
    const { gi, ii } = e.currentTarget.dataset
    this.setData({ [`groups[${gi}].items[${ii}].x`]: e.detail.x })
  },

  delItem(e) {
    const { gi, ii } = e.currentTarget.dataset
    const item = this.data.groups[gi].items[ii]
    // TODO: 接口联调 deleteCart
    api.deleteCart({ id: item.id }).then(() => {
      const groups = this.data.groups.slice()
      groups[gi].items.splice(ii, 1)
      if (!groups[gi].items.length) groups.splice(gi, 1)
      this.setData({ groups })
      this.recalc()
      wx.showToast({ title: '已删除', icon: 'none' })
    })
  },

  favItem() {
    wx.showToast({ title: '已移入收藏', icon: 'none' })
  },

  checkout() {
    if (!this.data.count) {
      wx.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    if (!getApp().globalData.loggedIn) {
      wx.navigateTo({ url: '/pages/login/index' })
      return
    }
    const items = []
    this.data.groups.forEach((g) => {
      g.items.forEach((it) => {
        if (it.checked) {
          items.push({
            title: it.title,
            spec: it.spec,
            price: it.price,
            qty: it.qty,
            image: it.image,
            tag: '超市'
          })
        }
      })
    })
    wx.setStorageSync('checkoutItems', items)
    wx.navigateTo({ url: '/pages/order/index?from=cart' })
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/index' })
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/index?id=' + e.currentTarget.dataset.id })
  },

  addCart(e) {
    api.addCart({ productId: e.currentTarget.dataset.id, qty: 1 }).then(() => {
      wx.showToast({ title: '已加入购物车', icon: 'success' })
    })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
