App({
  globalData: {
    statusBarHeight: 20,
    navBarHeight: 64,
    menuButton: null,
    loggedIn: true,
    userInfo: {
      nickname: '在海边摸螃蟹',
      phone: '13856786789',
      avatar: '/images/avatar.png',
      points: 7652
    },
    cartCount: 2,
    selectedCity: '常州',
    selectedAddress: null
  },

  onLaunch() {
    const sys = wx.getSystemInfoSync()
    const menu = wx.getMenuButtonBoundingClientRect()
    this.globalData.statusBarHeight = sys.statusBarHeight
    this.globalData.menuButton = menu
    this.globalData.navBarHeight = (menu.top - sys.statusBarHeight) * 2 + menu.height + sys.statusBarHeight
  },

  setLogin(loggedIn, userInfo) {
    this.globalData.loggedIn = loggedIn
    if (userInfo) this.globalData.userInfo = userInfo
  },

  bumpCartCount(delta) {
    const next = Math.max(0, (this.globalData.cartCount || 0) + (delta || 0))
    this.globalData.cartCount = next
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    if (page && typeof page.getTabBar === 'function' && page.getTabBar()) {
      page.getTabBar().setData({ cartCount: next })
    }
    return next
  }
})
