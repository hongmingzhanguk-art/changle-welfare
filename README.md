# 常乐福利 微信小程序

根据设计稿 `Downloads/常乐福利` 实现的静态微信小程序（WXML + WXSS）。无后端联调，页面交互与跳转可用，接口在 `utils/api.js` 中统一预留。

## 打开方式

1. 安装并打开 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入项目，目录选择本文件夹 `changle-welfare`
3. AppID 已配置为 `wx042ebfe52fb1d995`
4. 基础库建议 2.32+ / 3.x

## 页面对照

| 设计稿 | 页面 |
| --- | --- |
| 常乐首页 | `pages/index` |
| 分类 / 全部分类 | `pages/category` |
| 购物车（有商品 / 空 / 左滑） | `pages/cart` |
| 我的 / 游客弹窗 | `pages/mine` |
| 登录 | `pages/login` |
| 商品详情 / 滑动顶栏 / 规格选择 | `pages/detail` + `components/sku-popup` |
| 提交订单 / 确认支付 | `pages/order` |
| 订单详情 | `pages/order-detail` |
| 我的福利 / 次卡转换 | `pages/welfare` |
| 绑定新卡 | `pages/bind-card` |
| 意见反馈 | `pages/feedback` |

另含搜索、收货地址、订单列表，便于跳转闭环。

## 接口预留

所有请求集中在 `utils/api.js`：

- `BASE_URL` 改为真实网关
- 打开 `request()` 里的 `wx.request`
- 去掉各方法中 `|| mock` 的本地回退

当前会 `console.log('[API placeholder]', method, path, data)`，方便联调时对照参数。

## 目录

```
app.js / app.json / app.wxss
custom-tab-bar/          自定义底部 Tab
components/              导航栏、弹窗、规格弹层
pages/                   业务页面
utils/api.js             接口层（待联调）
utils/mock.js            静态数据
images/                  设计稿裁切 + 商品图
```
