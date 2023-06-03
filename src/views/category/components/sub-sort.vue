<template>
  <div class="sub-sort">
    <div class="sort">
      <a
        :class="{ active: sortParams.sortField === null }"
        @click="changeSort(null)"
        href="javascript:;"
        >默认排序</a
      >
      <a
        :class="{ active: sortParams.sortField === 'publishTime' }"
        @click="changeSort('publishTime')"
        href="javascript:;"
        >最新商品</a
      >
      <a
        :class="{ active: sortParams.sortField === 'orderNum' }"
        @click="changeSort('orderNum')"
        href="javascript:;"
        >最高人气</a
      >
      <a
        :class="{ active: sortParams.sortField === 'evaluateNum' }"
        @click="changeSort('evaluateNum')"
        href="javascript:;"
        >评论最多</a
      >
      <a @click="changeSort('price')" href="javascript:;">
        价格排序
        <i
          class="arrow up"
          :class="{
            active:
              sortParams.sortField === 'price' && sortParams.sortMethod == 'asc'
          }"
        />
        <i
          class="arrow down"
          :class="{
            active:
              sortParams.sortField === 'price' &&
              sortParams.sortMethod == 'desc'
          }"
        />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox v-model="sortParams.onlyDiscount"
        >仅显示特惠商品</XtxCheckbox
      >
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  setup() {
    /* const Dom = ref(null)
    // 动态为dom元素绑定点击事件和修改class属性
    onMounted(() => {
      console.log(Dom.value.children)
      for (let i = 0; i < Dom.value.children.length - 1; i++) {
        Dom.value.children[i].onclick = () => {
          for (let j = 0; j < Dom.value.children.length - 1; j++) {
            Dom.value.children[j].className = ''
          }
          Dom.value.children[i].className = 'active'
        }
      }
    }) */
    // const sort = ref(true)

    const sortParams = reactive({
      inventory: false,
      onlyDiscount: false,
      // 排序字段，取值范围：[publishTime,orderNum,price,evaluateNum]
      sortField: null,
      sortMethod: null
    })

    const changeSort = (sortField) => {
      // 1.判断实参是否为price，是的话就赋值
      // 2.再判断sortMethod是否为null，是就默认为正序，不是就取反
      // 3.如果实参不为price那么就直接赋值给sortField
      if (sortField === 'price') {
        sortParams.sortField = sortField
        if (sortParams.sortMethod === 'null') {
          sortParams.sortMethod = 'asc'
        } else {
          sortParams.sortMethod =
            sortParams.sortMethod === 'asc' ? 'desc' : 'asc'
        }
      } else {
        if (sortParams.sortField === sortField) return
        sortParams.sortField = sortField
      }
    }

    return { sortParams, changeSort }
  }
}
</script>
<style scoped lang="less">
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
