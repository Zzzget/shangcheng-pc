<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter />
      <!-- 结果区 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort />
        <!-- 列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <GoodsItem :Goods="item" />
          </li>
        </ul>
        <!-- <XtxSkeleton
          width="220px"
          height="300px"
          :animated="true"
          v-else
          class="goods-item"
        /> -->
        <!-- 加载 -->
        <XtxInfiniteLoading
          :loading="loading"
          :finished="finished"
          @infinite="getData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SubBread from './sub-bread.vue'
import SubFilter from './sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { findCategoryGoods } from '@/api/category'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  name: 'SubCategory',
  setup() {
    const route = useRoute()
    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    let params = {
      page: 1,
      pagsize: 20
    }

    const getData = () => {
      loading.value = true
      params.categoryId = route.params.id
      findCategoryGoods(params).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items)
          params.page++
        } else {
          finished.value = true
        }
        loading.value = false
      })
    }

    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && route.path === `/category/sub/${newVal}`) {
          goodsList.value = []
          params = {
            page: 1,
            pagsize: 20
          }
          finished.value = false
        }
      }
    )

    return { goodsList, getData, loading, finished }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
