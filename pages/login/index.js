const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    agreed: false
  },

  toggle() {
    this.setData({ agreed: !this.data.agreed })
  },

  login() {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先阅读并同意相关协议', icon: 'none' })
      return
    }
    // TODO: 接口联调 loginByPhone / wx.login
    wx.showLoading({ title: '登录中' })
    api.loginByPhone({ code: 'mock' }).then((res) => {
      wx.hideLoading()
      app.setLogin(true, res.userInfo)
      wx.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        const pages = getCurrentPages()
        if (pages.length > 1) wx.navigateBack()
        else wx.switchTab({ url: '/pages/mine/index' })
      }, 600)
    })
  },

  openDoc(e) {
    wx.showToast({ title: e.currentTarget.dataset.t + '（静态占位）', icon: 'none' })
  }
})
