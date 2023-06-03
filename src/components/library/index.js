// import XtxSkeleton from './xtx-skeleton'
// import XtxCarousel from './xtx-carousel'
// import XtxMore from './xtx-more'
// import XtxBread from './xtx-bread'
// import XtxBreadItem from './xtx-bread-item'
import defaultImg from '@/assets/images/200.png'

import Message from './Message'

// 1.使用 require 提供的函数 context 加载某一个目录下的所有 .vue 后缀的文件。
// 2.然后 context 函数会返回一个导入函数 importFn
// 3.它又一个属性 keys() 获取所有的文件路径
// 4.通过文件路径数组，通过遍历数组，再使用 importFn 根据路径导入组件对象
// 5.遍历的同时进行全局注册即可

const importFn = require.context('./', false, /\.vue$/)

export default {
  install(app) {
    // 在app上进行扩展，app提供component directive函数
    // 如果要挂载原型app.config.globalProperties方式
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)

    // 根据keys批量注册
    importFn.keys().forEach((path) => {
      // 导入组件
      const component = importFn(path).default
      // 进行注册
      app.component(component.name, component)
    })

    // 定义指令
    defineDirective(app)

    // 定义原型函数
    app.config.globalProperties.$message = Message
  }
}

// 定义指令
const defineDirective = (app) => {
  // 图片懒加载指令
  // 原理：存储图片地址不能在src上，当图片进入可视区，将你存储图片地址设置给图片元素即可
  app.directive('lazy', {
    mounted(el, binding) {
      // 创建一个观察对象，来观察当前使用指令的元素
      const observe = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            // 停止观察
            observe.unobserve(el)
            // 把指令的值设置给el的src属性
            el.onerror = () => {
              // 加载失败，设置默认图片
              el.src = defaultImg
            }
            el.src = binding.value
          }
        },
        {
          threshold: 0
        }
      )
      observe.observe(el)
    }
  })
}
