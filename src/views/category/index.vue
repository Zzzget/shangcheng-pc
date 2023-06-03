<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <transition name="fade-right" mode="out-in">
          <XtxBreadItem :key="topCategory.id">{{
            topCategory.name
          }}</XtxBreadItem>
        </transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height: 500px" :auto-play="true" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory.children" :key="item.id">
            <a :href="`/Category/${item.id}`">
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <div class="ref-goods" v-for="item in goodsList" :key="item.id">
        <div class="head">
          <h3>{{ item.name }}</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore />
        </div>
        <div class="body">
          <GoodsItem
            v-for="goods in item.goods"
            :key="goods.id"
            :Goods="goods"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { findBanner } from '@/api/home'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from './components/goods-item.vue'
import { findCategory } from '@/api/category'
export default {
  name: 'TopCategory',
  components: { GoodsItem },
  setup() {
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      // 确保计算属性一定有返回的数据
      let cate = {}
      const list = store.state.category.list.find(
        (item) => item.id === route.params.id
      )
      if (list) cate = list
      return cate
    })
    // console.log(topCategory)
    const sliders = ref([])
    findBanner().then((data) => {
      sliders.value = data.result
    })

    // 获取相关商品信息
    const goodsList = ref([])
    const getGoods = () => {
      findCategory(route.params.id).then((data) => {
        goodsList.value = data.result.children
      })
    }

    // console.log(goodsList)
    // 侦听id的变化，重新调用findCategory接口
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && `/category/${newVal}` === route.path) {
          getGoods()
          console.log('商品--------------------------')
        }
      },
      { immediate: true }
    )
    return { sliders, topCategory, goodsList }
  }
}
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
