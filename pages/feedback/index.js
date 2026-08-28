const api = require('../../utils/api')
const mock = require('../../utils/mock')

Page({
  data: {
    types: mock.feedbackTypes,
    typeIndex: 0,
    content: ''
  },
  onType(e) {
    this.setData({ typeIndex: Number(e.detail.value) })
  },
  onInput(e) {
    this.setData({ content: e.detail.value })
  },
  submit() {
    if ((this.data.content || '').trim().length < 10) {
      wx.showToast({ title: '请至少输入10个字符', icon: 'none' })
      return
    }
    // TODO: 接口联调 submitFeedback
    api.submitFeedback({
      type: this.data.types[this.data.typeIndex],
      content: this.data.content
    }).then(() => {
      wx.showToast({ title: '提交成功', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 800)
    })
  }
})
