<template>
  <div class="home-category" @mouseleave="categoryId = null">
    <ul class="menu">
      <li
        :class="{ active: categoryId === item.id }"
        v-for="item in menuList"
        :key="item.id"
        @mouseover="categoryId = item.id"
      >
        <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        <template v-if="item.children">
          <RouterLink
            class="sub"
            v-for="sub in item.children"
            :key="sub.id"
            :to="`/category/sub/${sub.id}`"
            >{{ sub.name }}</RouterLink
          >
        </template>
        <!-- 骨架 -->
        <template v-else>
          <xtxSkeleton
            width="60px"
            height="26px"
            bg="rgba(255,255,255,0.2)"
            style="margin-right: 5px"
          />
          <xtxSkeleton width="50px" height="26px" bg="rgba(255,255,255,0.2)" />
        </template>
      </li>
    </ul>
    <!-- 弹层 -->
    <!-- 此处需要判断categoryId是否有数据，
      在categoryId没有数据的时候currCategory.goods是undefined，会报错 -->
    <div class="layer" v-if="categoryId">
      <h4 v-if="currCategory">
        {{ currCategory.id === 'brand' ? '品牌' : '分类' }}推荐
        <small>根据您的购买或浏览记录推荐</small>
      </h4>
      <!-- 商品 -->
      <ul>
        <li v-for="item in currCategory.goods" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desct6rf }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌 -->
      <ul v-if="categoryId === 'brand'">
        <li class="brand" v-for="item in currCategory.brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.logo" alt="" />
            <div class="info">
              <p class="place">
                <i class="iconfont icon-dingwei"></i>{{ item.place }}
              </p>
              <p class="name ellipsis">{{ item.naem }}</p>
              <p class="desc ellipsis-2">{{ item.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
import { findBrand } from '@/api/home'
export default {
  name: 'HomeCategory',
  setup() {
    const brand = reactive({
      id: 'brand',
      name: '品牌推荐',
      children: [{ id: 'brand-chilren', name: '品牌推荐' }],
      // 品牌列表
      brands: []
    })
    const store = useStore()
    const menuList = computed(() => {
      const list = store.state.category.list.map((item) => {
        return {
          id: item.id,
          name: item.name,
          children: item.children && item.children.splice(0, 2),
          goods: item.goods
        }
      })
      list.push(brand)
      return list
    })
    console.log(menuList)

    // 热门商品
    const categoryId = ref(null)
    const currCategory = computed(() => {
      return menuList.value.find((item) => item.id === categoryId.value)
    })
    console.log(currCategory)
    // 获取品牌数据,尽量不能使用async在setup上
    findBrand().then((data) => {
      brand.brands = data.result
    })
    return { menuList, categoryId, currCategory }
  }
}
</script>

<style scoped lang="less">
.home-category {
  width: 250px;
  height: 600px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 60px;
      line-height: 50px;
      &:hover,
      &.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 20px;
        }
      }
    }
  }
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;

        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      // 品牌的样式
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
// 骨架动画
.xtx-skeleton {
  animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
</style>
