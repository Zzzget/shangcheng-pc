<template>
  <div class="home-box">
    <!-- 轮播图 -->
    <HomeBanner />
    <div class="container">
      <!-- 新鲜好物 -->
      <div class="home-entry">
        <!-- 左侧分类 -->
        <HomeCategory />
        <HomeNew />
        <!-- 热门品牌 -->
        <HomeBrand />
        <!-- 商品区域 -->
        <HomeProduct />
        <!-- 最新专题 -->
        <HomeSpecial />
      </div>
    </div>
  </div>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeBrand from './components/home-brand.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special.vue'
export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  }
}
</script>

<style scoped lang="less">
/* .home-entry {
  width: 1240px;
  margin: 0 auto;
  position: relative;
} */
.home-box {
  width: 100%;
  position: relative;
}
</style>
