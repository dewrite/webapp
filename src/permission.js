import router from './router'
import store from './store'
import getPageTitle from '@/utils/get-page-title'

const whiteList = ['/', '/last', '/auth-redirect']

router.beforeEach(async (to, from, next) => {
  document.title = getPageTitle(to.meta.title)
  const hasToken = store.getters.token

  // console.log(to.path, 'hasToken: ', hasToken, 'address:', address)
  // 白名单自动跳转
  if (whiteList.indexOf(to.path) !== -1) {
    // console.log('whiteList')
    next()
  } else {
    if (hasToken) {
      next()
    } else {
      // 未登陆，也不再白名单里，跳转到登陆页面
      next('/')
    }
  }
})
