<template>
  <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <div ref="target" style="position: relative; height: 426px">
      <Transition name="fade">
        <ul ref="pannel" v-if="goods.length" class="goods-list">
          <li v-for="item in goods" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
              <img :src="item.picture" alt="" />
              <p class="name">{{ item.title }}</p>
              <p class="desc">{{ item.alt }}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeleton v-else />
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './home-panel'
import HomeSkeleton from './home-skeleton.vue'
import { findHot } from '@/api/home'
import { useLazyData } from '@/hooks'

export default {
  name: 'HomeHot',
  components: { HomePanel, HomeSkeleton },
  setup() {
    // const goods = ref([])
    // findHot().then((data) => {
    //   goods.value = data.result
    // })
    const target = ref(null)
    const result = useLazyData(target, findHot)
    return { goods: result, target }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
