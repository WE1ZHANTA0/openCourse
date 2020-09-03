import Link from './krouter-link'
import View from './krouter-view'

let Vue

// 实现一个插件挂载$router

class KVueRouter {
  constructor(params) {
    this.$params = params

    // 需要创建响应式的current属性
    // this.current = '/'
    Vue.util.defineReactive(this, 'current', '/')

    // 监控url变化
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    // 重新加载的时候执行
    window.addEventListener('load', this.onHashChange.bind(this))

    // 创建一个映射表
    this.routerMap = {}
    params.routes.forEach((router) => {
      this.routerMap[router.path] = router
      // if (router.path === this.$router.current) {
      //   component = router.component
      // }
    })
  }
  onHashChange() {
    this.current = window.location.hash.slice(1)
  }
}



KVueRouter.install = function(_Vue) {
  // 保存构造函数 在kVueRouter里使用
  Vue = _Vue

  // 挂载$router
  // 获取到根实例中router的选项
  Vue.mixin({
    beforeCreate() {
      // 确保根实例的时候执行 this ---- 每个挂载上去的组件
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
        // console.log(Vue.prototype.$router)
      }
    },
  })

  // 全局注册Link和 view组件
  Vue.component('router-link', Link)
  Vue.component('router-view', View)
}

export default KVueRouter