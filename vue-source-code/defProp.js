// 响应式

function defineReactive(obj, key, val) {
  // 递归
  observe(val)

  // 对传入的obj进行访问的拦截
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key)
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log('set', key, newVal)
        // 如果传入的newVal是object 需要响应化处理
        observe(newVal)
        val = newVal
      }
    }
  })
}

function observe(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return
  }
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key])
  })
}

// 添加新的属性需要调用
function set(obj, key, val) { 
  defineReactive(obj, key, val)
}

const obj = {
  foo: 'foo',
  bar: 'bar',
  baz: {a: 1},
  arr: [1, 2, 4] // object.defineProperty对数组无效  通过替换数组实例的原型方法来实现
}
observe(obj)