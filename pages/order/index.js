const api = require('../../utils/api')
const mock = require('../../utils/mock')

Page({
  data: {
    address: {},
    items: [],
    payType: 'points',
    total: '0.00',
    points: 7652,
    confirmShow: false
  },

  onLoad(q) {
    const address = mock.address
    let items = []
    if (q.from === 'cart') {
      items = wx.getStorageSync('checkoutItems') || []
    } else if (q.id) {
      const p = mock.products.find((x) => x.id === q.id) || mock.products[0]
      items = [{
        title: p.title,
        spec: decodeURIComponent(q.spec || '默认规格'),
        price: p.price,
        qty: Number(q.qty || 1),
        image: p.image,
        tag: '超市'
      }]
    } else {
      items = wx.getStorageSync('checkoutItems') || []
    }
    if (!items.length) {
      items = [
        { title: 'Apple AirPods Max 2-午夜暗...', spec: 'AirPods Max2 | 午夜色', price: 2209, qty: 1, image: '/images/products/airpods-black.png', tag: '超市' }
      ]
    }
    const total = items.reduce((s, it) => s + it.price * it.qty, 0)
    this.setData({
      address,
      items,
      total: total.toFixed(2),
      points: getApp().globalData.userInfo.points
    })
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/index' })
  },

  setPay(e) {
    this.setData({ payType: e.currentTarget.dataset.t })
  },

  submit() {
    this.setData({ confirmShow: true })
  },

  closeConfirm() {
    this.setData({ confirmShow: false })
  },

  doPay() {
    this.setData({ confirmShow: false })
    // TODO: 接口联调 createOrder + payOrder
    wx.showLoading({ title: '支付中' })
    api.createOrder({ items: this.data.items, payType: this.data.payType, address: this.data.address, amount: this.data.total }).then((res) => {
      return api.payOrder({ orderId: res.orderId, payType: this.data.payType }).then(() => res)
    }).then((res) => {
      wx.hideLoading()
      wx.redirectTo({ url: '/pages/order-detail/index?id=' + (res.orderId || '') })
    })
  }
})
