<template>
  <div class="cart-sku">
    <div class="attrs">
      <span class="ellipsis" @click="displaySku">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="display">
      <!-- 商品规格 -->
      <GoodsSku
        :goods="skuData"
        v-if="skuData && !loading"
        @change="changeSku"
      />
      <div class="loading" v-else></div>
      <XtxButton type="primary" size="mini" @click="updateCart">确定</XtxButton>
    </div>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { findGoodsSku } from '@/api/product'
import GoodsSku from '@/views/goods/components/goods-sku.vue'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
export default {
  name: 'CartSku',
  components: { GoodsSku },
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
    const display = ref(null)
    // sku数据
    const skuData = ref(null)
    const show = () => {
      display.value = true
    }
    const hide = () => {
      display.value = false
    }

    // 加载状态
    const loading = ref(true)
    const displaySku = () => {
      loading.value = true
      if (display.value) {
        hide()
      } else {
        show()
        findGoodsSku(props.skuId).then((data) => {
          console.log(data.result)
          skuData.value = data.result
          setTimeout(() => {
            loading.value = false
          }, 100)
        })
      }
    }

    const currSku = ref(null)
    const store = useStore()
    const newSku = reactive({
      price: null,
      nowPrice: null,
      attrsText: null,
      stock: null,
      skuId: null,
      oldSkuId: props.skuId,
      count: props.count
    })
    watch(
      () => props.skuId,
      (newValue) => {
        newSku.oldSkuId = newValue
      }
    )
    const changeSku = (sku) => {
      if (sku.skuId) {
        newSku.price = sku.price
        newSku.oldPrice = sku.oldPrice
        newSku.stock = sku.inventory
        newSku.attrsText = sku.specsText
        newSku.skuId = sku.skuId
        currSku.value = sku
      } else {
        currSku.value = null
      }
    }

    const updateCart = () => {
      if (currSku.value && newSku.skuId !== props.skuId) {
        store.dispatch('cart/updateCart', newSku).then(() => {
          hide()
          currSku.value = null
        })
      } else if (newSku.skuId === props.skuId) {
        Message({ text: '规格相同，请重新选择', type: 'warn' })
      } else {
        Message({ text: '请填写完整规格', type: 'warn' })
      }
    }

    return {
      display,
      displaySku,
      skuData,
      loading,
      hide,
      changeSku,
      updateCart
    }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: '';
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
