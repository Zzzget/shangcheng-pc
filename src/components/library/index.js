import XtxSkeleton from './xtx-skeleton'
import XtxCarousel from './xtx-carousel'
import XtxMore from './xtx-more'
import defaultImg from '@/assets/images/200.png'

export default {
  install(app) {
    // 在app上进行扩展，app提供component directive函数
    // 如果要挂载原型app.config.globalProperties方式
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)

    // 定义指令
    defineDirective(app)
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
