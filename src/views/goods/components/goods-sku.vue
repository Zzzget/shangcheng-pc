<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="G in item.values" :key="G.name">
          <img
            v-if="G.picture"
            @click="clickSpecs(item, G)"
            :class="{ selected: G.selected, disabled: G.disabled }"
            :src="G.picture"
            :alt="G.name"
          />
          <span
            v-if="G.picture == null"
            @click="clickSpecs(item, G)"
            :class="{ selected: G.selected, disabled: G.disabled }"
            >{{ G.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
// import { ref } from 'vue'
import getPowerSet from '@/vender/power-set'
const spliter = '★'
// 根据skus数据得到路径字典对象
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach((sku) => {
    // 1. 过滤出有库存有效的sku
    if (sku.inventory) {
      // 2. 得到sku属性值数组
      const specs = sku.specs.map((spec) => spec.valueName)
      // 3. 得到sku属性值数组的子集
      const powerSet = getPowerSet(specs)
      // 4. 设置给路径字典对象
      powerSet.forEach((set) => {
        const key = set.join(spliter)
        if (pathMap[key]) {
          // 已经有key往数组追加
          pathMap[key].push(sku.id)
        } else {
          // 没有key设置一个数组
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

// 得到当前选中规格集合
const getSelectedArr = (specs) => {
  const selectedArr = []
  specs.forEach((spec) => {
    const selectedVal = spec.values.find((val) => val.selected)
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}

// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((spec, i) => {
    const selectedArr = getSelectedArr(specs)
    spec.values.forEach((val) => {
      // 已经选中的按钮不用判断
      if (val.name === selectedArr[i]) return false
      // 未选中的替换对应的值
      selectedArr[i] = val.name
      // 过滤无效值得到key
      const key = selectedArr.filter((v) => v).join(spliter)
      // 设置禁用状态
      val.disabled = !pathMap[key]
    })
  })
}
// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // 1.找出sku的信息
  // 2.遍历每一个按钮，按钮的值和sku记录的值相同，就选中
  const sku = goods.skus.find((sku) => sku.id === skuId)
  if (sku) {
    goods.specs.forEach((item, i) => {
      const val = item.values.find((val) => val.name === sku.specs[i].valueName)
      val.selected = true
    })
  }
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({ specs: [], skus: [] })
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    /* const selectState = ref(null)
    const setSelect = (index) => {
      if (selectState.value !== index) {
        selectState.value = index
      } else if (selectState.value === index) {
        selectState.value = null
      }
    } */
    console.log(props.goods)
    const pathMap = getPathMap(props.goods.skus)
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    updateDisabledStatus(props.goods.specs, pathMap)

    const clickSpecs = (item, val) => {
      // 如果是禁用状态不作为
      if (val.disabled) return false

      // 1. 选中与取消选中逻辑
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach((bv) => {
          bv.selected = false
        })
        val.selected = true
      }
      // 点击的时候更新禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)

      // 将你选择的sku信息通知父组件{skuId,price,oldPrice,inventory,specsText}
      // 1.选择完整的sku组合按钮，才可以拿到这些信息，提交父组件
      // 2.不是完整的sku组合按钮，提交空对象给父组件
      const validSelectedValues = getSelectedArr(props.goods.specs).filter(
        (v) => v
      )
      if (validSelectedValues.length === props.goods.specs.length) {
        // 完整
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find((sku) => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs
            .reduce((p, c) => `${p} ${c.name}: ${c.valueName}`, '')
            .trim()
        })
      } else {
        // 没选完
        // 父组件需要判断是否规格选择完整，不完整不能加购物车
        emit('change', {})
      }
    }
    return { clickSpecs }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
