const api = require('../../utils/api')
const cdnBehavior = require('../../behaviors/cdn')

Page({
  behaviors: [cdnBehavior],
  data: { cards: [], rules: '', convertShow: false, current: null },
  onLoad() {
    // TODO: 接口联调 getWelfare
    api.getWelfare().then((res) => this.setData({ cards: res.cards, rules: res.rules }))
  },
  copyNo(e) {
    wx.setClipboardData({ data: e.currentTarget.dataset.no })
  },
  convert(e) {
    this.setData({ convertShow: true, current: e.currentTarget.dataset.item })
  },
  close() { this.setData({ convertShow: false }) },
  confirm() {
    // TODO: 接口联调 convertCard
    api.convertCard({ id: this.data.current.id }).then(() => {
      this.setData({ convertShow: false })
      wx.showToast({ title: '转换成功', icon: 'success' })
    })
  }
})
