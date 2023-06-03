<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="'/category/' + goods.categories[0].id">{{
          goods.categories[0].name
        }}</XtxBreadItem>
        <XtxBreadItem :to="'/category/sub/' + goods.categories[1].id">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales :goodsSales="goodsSales" />
        </div>
        <div class="spec">
          <GoodsName :goods="goods" />
          <GoodsSku :goods="goods" :skuId="'300485150'" @change="changeSku" />
          <XtxNumbox v-model="count" />
          <XtxButton type="primary" style="margin-top: 20px" @click="addCart">
            加入购物车
          </XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import { ref, nextTick, watch } from 'vue'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku },
  setup() {
    // 获取商品详情
    const useGoods = () => {
      // 出现路由地址商品ID发生变化，但是不会重新初始化组件
      const goods = ref(null)
      const route = useRoute()
      watch(
        () => route.params.id,
        (newVal) => {
          if (newVal && `/product/${newVal}` === route.path) {
            findGoods(route.params.id).then((data) => {
              // 让商品数据为null让后使用v-if的组件可以重新销毁和创建
              goods.value = null
              nextTick(() => {
                goods.value = data.result
              })
            })
          }
        },
        { immediate: true }
      )
      return goods
    }
    const goods = useGoods()
    const changeSku = (sku) => {
      console.log(sku)
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
        currSku.value = sku
      } else {
        currSku.value = null
      }
    }
    // 选择的数量
    const count = ref(1)

    const goodsSales = ref({})
    watch(goods, (newVal) => {
      if (newVal) {
        goodsSales.value.brandName = goods.value.brand.name
        goodsSales.value.salesCount = goods.value.salesCount
        goodsSales.value.commentCount = goods.value.commentCount
        goodsSales.value.collectCount = goods.value.collectCount
      }
    })

    console.log(goods)
    // 购物车逻辑
    const store = useStore()
    const currSku = ref(null)
    const addCart = () => {
      if (currSku.value) {
        store
          .dispatch('cart/insertCart', {
            id: goods.value.id,
            name: goods.value.name,
            count: count.value,
            price: goods.value.price,
            nowPrice: null,
            picture: goods.value.mainPictures[0],
            attrsText: currSku.value.specsText,
            stock: goods.value.inventory,
            skuId: currSku.value.skuId,
            selected: true,
            isEffective: true
          })
          .then(() => {
            Message({ text: '加入购物车', type: 'success' })
          })
      } else if (count.value > goods.inventory) {
        Message({ text: '库存不足', type: 'warn' })
      } else {
        Message({ text: '请填写完整规格', type: 'warn' })
      }
    }
    return { goods, goodsSales, changeSku, count, addCart }
  }
}
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
