<template>
  <div class="home-banner">
    <XtxCarousel :sliders="sliders" :auto-play="true" />
  </div>
</template>
<script>
import { findBanner } from '@/api/home'
import { ref } from 'vue'
export default {
  name: 'HomeBanner',
  setup() {
    const sliders = ref([])
    findBanner().then((data) => {
      sliders.value = data.result
    })
    return { sliders }
  }
}
</script>
<style scoped lang="less">
.home-banner {
  width: 100%;
  height: 600px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  .xtx-carousel {
    ::v-deep .carousel-btn.prev {
      left: 270px;
    }
    ::v-deep .carousel-indicator {
      padding-left: 250px;
    }
  }
}
</style>
