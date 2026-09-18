const app = getApp()
const cdnBehavior = require('../../behaviors/cdn')

Component({
  behaviors: [cdnBehavior],
  properties: {
    title: { type: String, value: '' },
    back: { type: Boolean, value: true },
    color: { type: String, value: '#1A1A1A' },
    background: { type: String, value: 'transparent' },
    home: { type: Boolean, value: false },
    light: { type: Boolean, value: false },
    titleSize: { type: String, value: '32rpx' },
    titleWeight: { type: String, value: '600' },
    backSize: { type: String, value: '36rpx' },
    backIcon: { type: String, value: '' }
  },
  data: {
    statusBarHeight: 20,
    navBarHeight: 64,
    menuRight: 100
  },
  lifetimes: {
    attached() {
      const g = app.globalData
      const menu = g.menuButton || wx.getMenuButtonBoundingClientRect()
      this.setData({
        statusBarHeight: g.statusBarHeight,
        navBarHeight: g.navBarHeight,
        menuRight: menu ? menu.width + 16 : 100
      })
    }
  },
  methods: {
    onBack() {
      if (this.data.home) {
        wx.switchTab({ url: '/pages/index/index' })
        return
      }
      const pages = getCurrentPages()
      if (pages.length > 1) wx.navigateBack()
      else wx.switchTab({ url: '/pages/index/index' })
    }
  }
})
