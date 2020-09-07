let Vue 
class Store{
  constructor(options) {
    this._mutations = options.mutations
    this._actions = options.actions
    this._wrappedGetters = options.getters
    // this.state = new Vue({
    //   data: options.state
    // })

    // 定义我们computed选项
    const computed = {}
    this.getters = {}
    // {doubleCounter(state){}}
    const store = this
    Object.keys(this._wrappedGetters).forEach((key) => {
      // 获取用户定义的getter
      const fn = store._wrappedGetters[key]
      // 转换为computed的可使用的无参数形式
      computed[key] = function() {
        return fn(store.state)
      }
      // 劫持 为getters定义只读属性
      Object.defineProperty(store.getters, key, {
        get: () => store._vm[key]
      })
    })


    this._vm = new Vue({
      data: {
        // 加两个$ vue 不会去做代理  意味着vm里访问不大this._vm.data.$$store   只能this._vm._data.$$store访问
        $$store: options.state
      },
      computed
    })

    // 绑定commit 和 dispatch上下文为store实例
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  get state() {
    // console.log(this._vm)
    return this._vm._data.$$store
  }

  set state(v) {
    // console.error('gun')
  }


  // type mutation的类型
  // payload 载荷： 参数
  commit(type, payload) {
    const entry = this._mutations[type]
    if (entry) {
      entry(this.state, payload)
    }
  }

  dispatch(type, payload) {
    const entry = this._actions[type]
    if (entry) {
      entry(this, payload)
    }
  }
}

function install(_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      // 当前的this指向个个组件    根组件挂载$store方法
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

// Vuex
export default {
  Store,
  install
}