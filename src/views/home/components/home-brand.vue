<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a
        href="javascript:;"
        class="iconfont icon-angle-left prev"
        :class="{ disabled: !increase }"
        @click="increase = false"
      ></a>
      <a
        href="javascript:;"
        class="iconfont icon-angle-right next"
        :class="{ disabled: increase }"
        @click="increase = true"
      ></a>
    </template>
    <div class="box" ref="target">
      <Transition name="fade">
        <ul class="list" :class="{ slither: increase }" v-if="brands.length">
          <li v-for="item in brands" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
              <img :src="item.picture" :alt="item.name" />
            </RouterLink>
          </li>
        </ul>
        <div v-else class="skeleton">
          <XtxSkeleton
            class="item"
            v-for="i in 5"
            :key="i"
            animated
            bg="#e4e4e4"
            width="240px"
            height="305px"
          />
        </div>
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './home-panel'
import { findBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup() {
    const increase = ref(false)
    // const brands = ref([])
    // findBrand(10).then((data) => {
    //   brands.value = data.result
    // })
    const target = ref(null)
    const result = useLazyData(target, findBrand, 10)
    return { increase, brands: result, target }
  }
}
</script>

<style scoped lang="less">
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
    &.slither {
      transform: translateX(-50%);
    }
  }
}
</style>
