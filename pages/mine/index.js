const app = getApp()

Page({
  data: {
    statusBarHeight: 20,
    loggedIn: true,
    user: {},
    welfareCount: 9,
    guestShow: false
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    const loggedIn = app.globalData.loggedIn
    this.setData({
      loggedIn,
      welfareCount: loggedIn ? 9 : 0,
      user: loggedIn
        ? app.globalData.userInfo
        : { nickname: '游客用户', phone: '体验平台', avatar: '' }
    })
  },

  onLoad() {
    this.setData({ statusBarHeight: app.globalData.statusBarHeight })
  },

  guard(cb) {
    if (!app.globalData.loggedIn) {
      this.setData({ guestShow: true })
      return
    }
    cb && cb()
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/login/index' })
  },

  goBind() {
    this.guard(() => wx.navigateTo({ url: '/pages/bind-card/index' }))
  },

  goWelfare() {
    this.guard(() => wx.navigateTo({ url: '/pages/welfare/index' }))
  },

  goOrders() {
    this.guard(() => wx.navigateTo({ url: '/pages/orders/index' }))
  },

  goAddress() {
    this.guard(() => wx.navigateTo({ url: '/pages/address/index' }))
  },

  goFeedback() {
    this.guard(() => wx.navigateTo({ url: '/pages/feedback/index' }))
  },

  goProfile() {
    this.guard(() => wx.showToast({ title: '个人资料待接口联调', icon: 'none' }))
  },

  goService() {
    wx.showToast({ title: '客服待接口联调', icon: 'none' })
  },

  goAbout() {
    wx.showToast({ title: '常乐福利 v1.0.0', icon: 'none' })
  },

  onStay() {
    this.setData({ guestShow: false })
  },

  onGoLogin() {
    this.setData({ guestShow: false })
    wx.navigateTo({ url: '/pages/login/index' })
  }
})
