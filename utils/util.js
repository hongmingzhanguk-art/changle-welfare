function formatPrice(n) {
  const num = Number(n)
  if (Number.isNaN(num)) return '0.00'
  return num.toFixed(2)
}

function pad2(n) {
  return n < 10 ? '0' + n : '' + n
}

function formatShipDate(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + (offsetDays == null ? 2 : offsetDays))
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
}

function resolveAddress() {
  try {
    const g = getApp().globalData.selectedAddress
    if (g && g.full) return g
  } catch (e) { /* ignore */ }
  try {
    const stored = wx.getStorageSync('selectedAddress')
    if (stored && stored.full) return stored
  } catch (e) { /* ignore */ }
  const list = require('./mock').addresses || []
  return list[1] || list[0] || {}
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
  formatShipDate,
  resolveAddress,
  toast,
  navTo,
  switchTab,
  requireLogin
}
