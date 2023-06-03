<template>
  <div class="xtx-carousel" @mouseover="stop" @mouseleave="start">
    <ul class="carousel-body">
      <li class="carousel-item" :class="{ fade: next === 1 }">
        <RouterLink to="/">
          <img src="../../assets/images/carousel_1.jpg" alt="" />
        </RouterLink>
      </li>
      <li class="carousel-item" :class="{ fade: next === 2 }">
        <RouterLink to="/">
          <img src="../../assets/images/carousel_2.jpg" alt="" />
        </RouterLink>
      </li>
      <li class="carousel-item" :class="{ fade: next === 3 }">
        <RouterLink to="/">
          <img src="../../assets/images/carousel_3.jpg" alt="" />
        </RouterLink>
      </li>
      <li class="carousel-item" :class="{ fade: next === 4 }">
        <RouterLink to="/">
          <img src="../../assets/images/carousel_4.jpg" alt="" />
        </RouterLink>
      </li>
      <li class="carousel-item" :class="{ fade: next === 5 }">
        <RouterLink to="/">
          <img src="../../assets/images/carousel_5.jpg" alt="" />
        </RouterLink>
      </li>
    </ul>
    <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)"
      ><i class="iconfont icon-angle-left"></i
    ></a>
    <a href="javascript:;" class="carousel-btn next" @click="toggle(1)"
      ><i class="iconfont icon-angle-right"></i
    ></a>
    <div class="carousel-indicator">
      <span
        v-for="index in 5"
        :key="index"
        @click="next = index"
        :class="{ active: index === next }"
      ></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'

export default {
  name: 'XtxCarousel',
  // 将轮播图定义带父组件比较好
  props: {
    // 轮播图数据
    sliders: {
      type: Array,
      default: () => []
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 间隔时长
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup(props) {
    const next = ref(1)
    // console.log(props.sliders.length)
    // 轮播图右侧按钮方法
    /* const getNext = () => {
      if (next.value === props.sliders.length - 1) {
        next.value = 0
      } else {
        next.value++
      }
    }
    // 轮播图左侧按钮方法
    const getPrev = () => {
      if (next.value === 0) {
        next.value = props.sliders.length - 1
      } else {
        next.value--
      }
    } */
    // 轮播图按钮函数方法
    const toggle = (num) => {
      const nweNext = next.value + num
      if (nweNext > props.sliders.length) {
        next.value = 1
        return
      }
      if (nweNext <= 0) {
        next.value = props.sliders.length
        return
      }
      next.value = nweNext
    }
    // 自动轮播方法
    let timer = null
    const autoPlayFn = () => {
      // 清除之前定时器，避免重复添加
      clearInterval(timer)
      timer = setInterval(() => {
        toggle(1)
      }, props.duration)
    }
    // 鼠标进入暂停和离开开启
    const stop = () => {
      if (timer) {
        clearInterval(timer)
      }
    }
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }
    // 侦听是否开启自动播放
    watch(
      () => props.sliders,
      (newVal) => {
        if (newVal.length && props.autoPlay) {
          autoPlayFn()
        }
      },
      { immediate: true }
    )
    // 4.组件卸载，清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })
    return { next, toggle, autoPlayFn, timer, stop, start }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
