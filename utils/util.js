function formatPrice(n) {
  const num = Number(n)
  if (Number.isNaN(num)) return '0.00'
  return num.toFixed(2)
}

function toast(title, icon = 'none') {
  wx.showToast({ title, icon, duration: 1800 })
}

function navTo(url) {
  wx.navigateTo({ url })
}

function switchTab(url) {
  wx.switchTab({ url })
}

function requireLogin() {
  const app = getApp()
  if (app.globalData.loggedIn) return true
  return false
}

module.exports = {
  formatPrice,
  toast,
  navTo,
  switchTab,
  requireLogin
}
