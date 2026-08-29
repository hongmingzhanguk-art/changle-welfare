const api = require('../../utils/api')

Page({
  data: { tabs: ['全部', '待付款', '待发货', '待收货', '已完成'], cur: 0, allList: [], list: [] },
  onLoad() {
    // TODO: 接口联调 getOrders
    api.getOrders({}).then((res) => {
      const allList = res.list || []
      this.setData({ allList, list: this.filterList(allList, 0) })
    })
  },
  filterList(all, cur) {
    const status = this.data.tabs[cur]
    if (!cur || status === '全部') return all
    return all.filter((o) => o.status === status)
  },
  onTab(e) {
    const cur = e.currentTarget.dataset.i
    this.setData({ cur, list: this.filterList(this.data.allList, cur) })
  },
  goDetail(e) {
    wx.navigateTo({ url: '/pages/order-detail/index?id=' + e.currentTarget.dataset.id })
  }
})
