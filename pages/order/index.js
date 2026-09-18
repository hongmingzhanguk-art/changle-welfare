const api = require('../../utils/api')
const util = require('../../utils/util')
const mock = require('../../utils/mock')
const cdnBehavior = require('../../behaviors/cdn')

function formatPoints(n) {
  const x = Number(n)
  if (!isFinite(x)) return '0'
  const cents = Math.round(x * 100)
  if (cents % 100 === 0) return String(cents / 100)
  if (cents % 10 === 0) return (cents / 100).toFixed(1)
  return (cents / 100).toFixed(2)
}

function pointsCopy(payType, points, total) {
  const p = Number(points)
  const t = Number(total)
  const pointsShort = payType === 'points' && p < t
  return {
    pointsText: formatPoints(p),
    pointsAmount: formatPoints(t),
    pointsShort,
    pointsGap: pointsShort ? formatPoints(Math.max(0, t - p)) : '0'
  }
}

Page({
  behaviors: [cdnBehavior],
  data: {
    address: {},
    items: [],
    payType: 'points',
    total: '0.00',
    points: 7652,
    pointsText: '7652',
    pointsAmount: '0',
    confirmShow: false,
    pointsShort: false,
    pointsGap: '0'
  },

  onLoad(q) {
    this.applyItems(q || {})
    this.refreshAddress()
  },

  onShow() {
    this.refreshAddress()
  },

  refreshAddress() {
    this.setData({ address: util.resolveAddress() })
  },

  applyItems(q) {
    let items = []
    if (q.from === 'cart') {
      items = api.hydrateItems(wx.getStorageSync('checkoutItems') || [])
    } else if (q.id) {
      const p = mock.products.find((x) => x.id === q.id)
      if (p) {
        items = [{
          title: p.title,
          spec: decodeURIComponent(q.spec || '默认规格'),
          price: p.price,
          qty: Number(q.qty || 1),
          image: p.image,
          tag: '超市'
        }]
      }
    } else {
      items = api.hydrateItems(wx.getStorageSync('checkoutItems') || [])
    }
    if (!Array.isArray(items)) items = []
    if (!items.length) {
      wx.showToast({ title: '请选择商品', icon: 'none' })
      setTimeout(() => {
        wx.navigateBack({ fail() { wx.switchTab({ url: '/pages/cart/index' }) } })
      }, 1600)
      const points = getApp().globalData.userInfo.points
      this.setData(Object.assign({
        items: [],
        total: '0.00',
        points
      }, pointsCopy(this.data.payType, points, 0)))
      return
    }
    const total = items.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0)
    const points = getApp().globalData.userInfo.points
    const totalStr = total.toFixed(2)
    this.setData(Object.assign({
      items,
      total: totalStr,
      points
    }, pointsCopy(this.data.payType, points, totalStr)))
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/index' })
  },

  setPay(e) {
    const payType = e.currentTarget.dataset.t
    this.setData(Object.assign({
      payType
    }, pointsCopy(payType, this.data.points, this.data.total)))
  },

  pointsBlocked() {
    return this.data.payType === 'points' && Number(this.data.points) < Number(this.data.total)
  },

  submit() {
    if (this.pointsBlocked()) {
      wx.showToast({ title: '积分余额不足', icon: 'none' })
      return
    }
    if (!this.data.items.length) {
      wx.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    this.setData({ confirmShow: true })
  },

  closeConfirm() {
    this.setData({ confirmShow: false })
  },

  doPay() {
    if (this._paying) return
    if (this.pointsBlocked()) {
      wx.showToast({ title: '积分余额不足', icon: 'none' })
      return
    }
    if (!this.data.items.length) {
      wx.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    this.setData({ confirmShow: false })
    this._paying = true
    // TODO: 接口联调 createOrder + payOrder
    wx.showLoading({ title: '支付中' })
    api.createOrder({
      items: this.data.items,
      payType: this.data.payType,
      address: this.data.address,
      amount: this.data.total
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
