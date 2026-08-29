const api = require('../../utils/api')

Page({
  data: { list: [] },
  onLoad() {
    // TODO: 接口联调 getAddressList
    api.getAddressList().then((res) => this.setData({ list: res.list }))
  },
  pick(e) {
    const id = e.currentTarget.dataset.id
    const item = (this.data.list || []).find((a) => a.id === id)
    if (!item) return
    wx.setStorageSync('selectedAddress', item)
    getApp().globalData.selectedAddress = item
    wx.showToast({ title: '已选择该地址', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 500)
  },
  add() {
    wx.showToast({ title: '新增地址待接口联调', icon: 'none' })
  }
})
