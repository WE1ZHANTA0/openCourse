// 数组响应式
// 1.替换数组原型中的七个方法
const orginalProto = Array.prototype
// 备份
const arrayProto = Object.create(orginalProto)
const arrMethodName = ['push', 'pop', 'shift', 'unshift']
arrMethodName.forEach(method => {
  arrayProto[method] = function() {
    // 原始操作
    orginalProto[method].apply(this, arguments)
    // 覆盖操作 通知更新
    console.log('数组执行方法'+ method + ':', arguments)
  }
})


// 对象响应式

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

  // 判断传入的Obj类型
  if (Array.isArray(obj)) {
    // 覆盖原型 替换7个变更操作
    obj.__proto__ = arrayProto
    // 对数组内部的元素执行响应化
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      observe(obj[i])
    }
  } else {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key])
    })
  }
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

obj.arr.push(345)
console.log(obj.arr)