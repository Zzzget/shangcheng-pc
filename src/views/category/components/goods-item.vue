<template>
  <RouterLink to="/" class="goods-item" v-if="Goods">
    <img :src="Goods.picture" alt="" />
    <p class="name ellipsis">{{ Goods.name }}</p>
    <p class="desc ellipsis">{{ Goods.desc }}</p>
    <p class="price">&yen;{{ Goods.price }}</p>
  </RouterLink>
</template>

<script>
export default {
  name: 'GoodsItem',
  props: {
    Goods: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped lang="less">
.goods-item {
  display: block;
  width: 220px;
  padding: 20px 30px;
  text-align: center;
  .hoverShadow();
  img {
    width: 160px;
    height: 160px;
  }
  p {
    padding-top: 10px;
  }
  .name {
    font-size: 16px;
  }
  .desc {
    color: #999;
    height: 29px;
  }
  .price {
    color: @priceColor;
    font-size: 20px;
  }
}
</style>
