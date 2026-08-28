const api = require('../../utils/api')

Page({
  data: { tabs: ['全部', '待付款', '待发货', '待收货', '已完成'], cur: 0, list: [] },
  onLoad() {
    // TODO: 接口联调 getOrders
    api.getOrders({}).then((res) => this.setData({ list: res.list }))
  },
  onTab(e) { this.setData({ cur: e.currentTarget.dataset.i }) },
  goDetail(e) {
    wx.navigateTo({ url: '/pages/order-detail/index?id=' + e.currentTarget.dataset.id })
  }
})
