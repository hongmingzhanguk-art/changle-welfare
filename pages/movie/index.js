const api = require('../../utils/api')
const app = getApp()
const cdnBehavior = require('../../behaviors/cdn')

Page({
  behaviors: [cdnBehavior],
  data: {
    city: '南京',
    tab: 'cinema',
    filter: '',
    districtId: 'all',
    brandIds: [],
    sort: 'near',
    keyword: '燃烧吧爸爸离别...',
    districts: [],
    brands: [],
    cinemas: [],
    movies: [],
    shownCinemas: [],
    banner: ''
  },

  onLoad() {
    this.setData({ city: app.globalData.selectedCity === '常州' ? '南京' : (app.globalData.selectedCity || '南京') })
    this.load()
  },

  load() {
    // TODO: 接口联调 getMovieChannel
    api.getMovieChannel({}).then((data) => {
      this.setData({
        districts: data.districts || [],
        brands: data.brands || [],
        cinemas: data.cinemas || [],
        movies: data.movies || [],
        banner: data.banner || '',
        shownCinemas: data.cinemas || []
      })
    })
  },

  goCity() {
    const cities = ['南京', '常州', '苏州', '无锡']
    wx.showActionSheet({
      itemList: cities,
      success: (res) => {
        this.setData({ city: cities[res.tapIndex] })
      }
    })
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  noop() {},

  search() {
    const k = (this.data.keyword || '').trim()
    const sample = '燃烧吧爸爸离别...'
    const list = (this.data.cinemas || []).filter((c) => !k || k === sample || (c.name + c.addr).indexOf(k) > -1)
    this.setData({ shownCinemas: list, tab: 'cinema' })
  },

  onTab(e) {
    this.setData({ tab: e.currentTarget.dataset.t, filter: '' })
  },

  toggleFilter(e) {
    const f = e.currentTarget.dataset.f
    this.setData({ filter: this.data.filter === f ? '' : f })
  },

  closeFilter() {
    this.setData({ filter: '' })
  },

  pickDistrict(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ districtId: id, filter: '' })
    this.applyFilter()
  },

  pickBrand(e) {
    const id = e.currentTarget.dataset.id
    const cur = this.data.brandIds.slice()
    const i = cur.indexOf(id)
    if (i > -1) cur.splice(i, 1)
    else cur.push(id)
    this.setData({ brandIds: cur })
  },

  resetBrand() {
    this.setData({ brandIds: [] })
  },

  confirmBrand() {
    this.setData({ filter: '' })
    this.applyFilter()
  },

  pickSort(e) {
    this.setData({ sort: e.currentTarget.dataset.s, filter: '' })
    this.applyFilter()
  },

  applyFilter() {
    let list = (this.data.cinemas || []).slice()
    if (this.data.brandIds.length) {
      const set = {}
      this.data.brandIds.forEach((id) => { set[id] = true })
      list = list.filter((c) => set[c.brand])
    }
    if (this.data.sort === 'price') {
      list.sort((a, b) => a.price - b.price)
    } else {
      list.sort((a, b) => a.distKm - b.distKm)
    }
    this.setData({ shownCinemas: list })
  }
})
