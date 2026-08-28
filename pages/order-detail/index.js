const api = require('../../utils/api')

Page({
  data: { order: {} },
  onLoad(q) {
    // TODO: 接口联调 getOrderDetail
    api.getOrderDetail(q.id).then((order) => this.setData({ order }))
  },
  copyNo() {
    wx.setClipboardData({ data: this.data.order.no })
  },
  goList() {
    wx.redirectTo({ url: '/pages/orders/index' })
  }
})
