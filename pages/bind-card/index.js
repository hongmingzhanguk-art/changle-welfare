const api = require('../../utils/api')

Page({
  data: { no: '', pwd: '' },
  onNo(e) { this.setData({ no: e.detail.value }) },
  onPwd(e) { this.setData({ pwd: e.detail.value }) },
  scan() {
    wx.scanCode({
      success: (res) => this.setData({ no: res.result || this.data.no }),
      fail: () => wx.showToast({ title: '扫码能力待真机调试', icon: 'none' })
    })
  },
  bind() {
    if (!this.data.no || !this.data.pwd) {
      wx.showToast({ title: '请输入卡号和密码', icon: 'none' })
      return
    }
    // TODO: 接口联调 bindCard
    api.bindCard({ no: this.data.no, pwd: this.data.pwd }).then(() => {
      wx.showToast({ title: '绑定成功', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 800)
    })
  }
})
