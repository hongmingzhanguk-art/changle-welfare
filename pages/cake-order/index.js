const api = require('../../utils/api')
const mock = require('../../utils/mock')
const { resolve } = require('../../utils/cdn')
const cdnBehavior = require('../../behaviors/cdn')

function pointsOf(price) {
  const n = Number(price) || 0
  return (n * 2269.58 / 198).toFixed(2)
}

Page({
  behaviors: [cdnBehavior],
  data: {
    address: {},
    item: {},
    ship: 'pickup',
    store: { id: 's-wenchang', name: '文昌店' },
    pickupTime: '2026-09-25 10:00-12:00',
    deliveryTime: '',
    remark: '',
    payType: 'points',
    price: '198.00',
    pointsNeed: '2269.58',
    pointsText: '7652.00',
    fee: '0'
  },

  onLoad(q) {
    const draft = wx.getStorageSync('cakeOrderDraft') || {}
    const price = Number(draft.price || 198)
    const ship = q.mode === 'delivery' ? 'delivery' : 'pickup'
    this.setData({
      ship,
      item: {
        title: draft.title || '芋泥在一起奶油蛋糕',
        spec: draft.spec || '1磅',
        price: price.toFixed(2),
        qty: draft.qty || 1,
        image: resolve(draft.image || '/images/cake/product-hero.png'),
        shop: draft.shop || '元祖蛋糕'
      },
      price: price.toFixed(2),
      pointsNeed: pointsOf(price)
    })
    this.refreshAddress()
    this.refreshStore()
  },

  onShow() {
    this.refreshAddress()
    this.refreshStore()
  },

  refreshAddress() {
    const g = getApp().globalData.selectedAddress
    let stored = null
    try { stored = wx.getStorageSync('selectedAddress') } catch (e) { /* ignore */ }
    this.setData({
      address: (g && g.full) || (stored && stored.full) ? (g || stored) : mock.address
    })
  },

  refreshStore() {
    const store = wx.getStorageSync('cakePickedStore')
    if (!store || !store.name) return
    const patch = { store }
    if (this._fromStorePick) {
      patch.ship = 'pickup'
      this._fromStorePick = false
    }
    this.setData(patch)
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/index' })
  },

  setShip(e) {
    this.setData({ ship: e.currentTarget.dataset.s })
  },

  goStore() {
    this._fromStorePick = true
    wx.navigateTo({ url: '/pages/store-pick/index' })
  },

  pickTime() {
    if (this.data.ship === 'pickup') {
      const slots = ['2026-09-25 10:00-12:00', '2026-09-25 14:00-16:00', '2026-09-26 10:00-12:00']
      wx.showActionSheet({
        itemList: slots,
        success: (res) => this.setData({ pickupTime: slots[res.tapIndex] })
      })
      return
    }
    const slots = ['尽快送达', '今天 14:00-16:00', '明天 10:00-12:00']
    wx.showActionSheet({
      itemList: slots,
      success: (res) => this.setData({ deliveryTime: slots[res.tapIndex] })
    })
  },

  onRemark(e) {
    this.setData({ remark: e.detail.value })
  },

  setPay(e) {
    this.setData({ payType: e.currentTarget.dataset.t })
  },

  submit() {
    if (this.data.ship === 'pickup' && !(this.data.store && this.data.store.name)) {
      wx.showToast({ title: '请选择自取门店', icon: 'none' })
      return
    }
    if (this.data.ship === 'delivery' && !this.data.deliveryTime) {
      wx.showToast({ title: '请选择配送时间', icon: 'none' })
      return
    }
    if (this._paying) return
    this._paying = true
    // TODO: 接口联调 createOrder + payOrder
    wx.showLoading({ title: '支付中' })
    const it = this.data.item
    api.createOrder({
      items: [{ title: it.title, spec: it.spec, price: it.price, qty: it.qty, image: it.image, tag: '蛋糕' }],
      payType: this.data.payType,
      address: this.data.address,
      amount: this.data.price,
      ship: this.data.ship,
      store: this.data.store,
      remark: this.data.remark
    }).then((res) => {
      return api.payOrder({ orderId: res.orderId, payType: this.data.payType }).then(() => res)
    }).then((res) => {
      wx.hideLoading()
      this._paying = false
      wx.redirectTo({ url: '/pages/order-detail/index?id=' + (res.orderId || '') })
    }).catch(() => {
      wx.hideLoading()
      this._paying = false
      wx.showToast({ title: '支付失败可重试', icon: 'none' })
    })
  }
})
