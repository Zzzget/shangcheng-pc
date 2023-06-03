<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          href="javascript:;"
          v-for="item in filterData.brands"
          :key="item.id"
          :class="{ active: filterData.selectedBrands === item.id }"
          @click="filterData.selectedBrands = item.id"
          >{{ item.name }}
        </a>
      </div>
    </div>
    <div class="item" v-for="ftr in filterData.saleProperties" :key="ftr.id">
      <div class="head">{{ ftr.name }}</div>
      <div class="body">
        <a
          href="javascript:;"
          v-for="prop in ftr.properties"
          :key="prop.id"
          :class="{ active: prop.id === ftr.selecteProp }"
          @click="ftr.selecteProp = prop.id"
          >{{ prop.name }}</a
        >
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>
<script>
import { findfilter } from '@/api/category'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
export default {
  name: 'SubFilter',
  setup() {
    const route = useRoute()
    const filterData = ref({})
    // 获取筛选数据和添加全部选项和选择的筛选
    const getfilter = () => {
      findfilter(route.params.id).then((data) => {
        const { result } = data
        result.selectedBrands = null
        result.brands.unshift({ id: null, name: '全部' })
        result.saleProperties.forEach((item) => {
          item.selecteProp = null
          item.properties.unshift({ id: null, name: '全部' })
        })
        filterData.value = data.result
      })
    }

    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && `/category/sub/${route.params.id}` === route.path) {
          getfilter()
        }
      },
      {
        immediate: true
      }
    )

    return { filterData }
  }
}
</script>
<style scoped lang="less">
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
  .xtx-skeleton {
    padding: 10px 0;
  }
}
</style>
