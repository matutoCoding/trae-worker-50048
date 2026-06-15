export default defineAppConfig({
  pages: [
    'pages/orders/index',
    'pages/styles/index',
    'pages/workspace/index',
    'pages/delivery/index',
    'pages/settlement/index',
    'pages/couplet/index',
    'pages/dispatch/index',
    'pages/delivery-detail/index',
    'pages/arrangement/index',
    'pages/order-detail/index',
    'pages/refund/index',
    'pages/style-detail/index',
    'pages/order-create/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2D5A4B',
    navigationBarTitleText: '殡仪鲜花服务',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F7F6F3'
  },
  tabBar: {
    color: '#8A9099',
    selectedColor: '#2D5A4B',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/orders/index',
        text: '订单'
      },
      {
        pagePath: 'pages/styles/index',
        text: '款式库'
      },
      {
        pagePath: 'pages/workspace/index',
        text: '工作台'
      },
      {
        pagePath: 'pages/delivery/index',
        text: '配送'
      },
      {
        pagePath: 'pages/settlement/index',
        text: '对账'
      }
    ]
  }
})
