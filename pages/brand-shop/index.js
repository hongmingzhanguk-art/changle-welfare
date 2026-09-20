const api = require('../../utils/api')
const cdnBehavior = require('../../behaviors/cdn')

Page({
  behaviors: [cdnBehavior],
  data: {
    brand: { name: '元祖' },
    sort: 'new',
    sorts: [
      { id: 'new', name: '最新' },
      { id: 'hot', name: '人气' },
      { id: 'sales', name: '销量' },
      { id: 'price', name: '价格' }
    ],
    list: [],
    loaded: false
  },

  onLoad(q) {
    this.brandId = q.id || 'ganso'
    this.load()
  },

  load() {
    // TODO: 接口联调 getBrandShop
    api.getBrandShop({ brandId: this.brandId, sort: this.data.sort }).then((res) => {
      this.setData({
        brand: res.brand || { name: '元祖' },
        list: res.list || [],
        loaded: true
      })
    })
  },

  onSort(e) {
    this.setData({ sort: e.currentTarget.dataset.id }, () => this.load())
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/cake-detail/index?id=' + (e.currentTarget.dataset.id || 'c-yuni') })
  }
})
