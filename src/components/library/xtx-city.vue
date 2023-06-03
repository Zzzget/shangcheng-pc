<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{ active: visible }">
      <span class="placeholder">{{ fullLocation }}</span>
      <span class="value"></span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span
          class="ellipsis"
          v-for="item in currList.currList"
          :key="item.code"
          @click="changeItem(item)"
          >{{ item.name }}</span
        >
      </template>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { ref, reactive, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const cityData = ref([])
    const loading = ref(false)
    const visible = ref(false)
    // const finalAddress = ref('')
    // 将请求城市函数，封装成一个Promise
    // 控制展开收起,默认收起
    const getCityData = () => {
      return new Promise((resolve, reject) => {
        if (window.cityData) {
          resolve(window.cityData)
        } else {
          const url =
            'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
          axios.get(url).then((res) => {
            window.cityData = res.data
            resolve(window.cityData)
          })
        }
      })
    }

    // const toggleDialog = () => {
    //   active.value = !active.value
    //   // selectAddress()
    // }

    // 显示
    const open = () => {
      loading.value = true
      visible.value = true
      getCityData().then((data) => {
        cityData.value = data
        loading.value = false
        console.log(currList.value)
      })

      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }

    // 隐藏
    const close = () => {
      visible.value = false
    }

    const toggle = () => {
      visible.value ? close() : open()
    }

    // 点击其他位置隐藏
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })

    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })

    const changeItem = (item) => {
      // 省份
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      // 市
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }

      // 区
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        close()
        console.log('1111')
        emit('change', changeResult)
      }
    }

    const currList = computed(() => {
      let currList = cityData.value
      if (changeResult.provinceCode) {
        currList = currList.find(
          (item) => item.code === changeResult.provinceCode
        ).areaList
      }
      if (changeResult.cityCode) {
        currList = currList.find(
          (item) => item.code === changeResult.cityCode
        ).areaList
      }

      return { currList }
    })

    // const selectAddress = (index) => {
    //   isShow.value && (finalAddress.value += ' ' + address.value[index].name)
    //   console.log(address.value)
    //   if (isShow.value === null) {
    //     finalAddress.value = ''
    //     address.value = window.cityData
    //     isShow.value = 'economize'
    //   } else if (isShow.value === 'economize') {
    //     console.log('lllll')
    //     isShow.value = 'market'
    //     address.value = address.value[index].areaList
    //     console.log(address.value)
    //   } else if (isShow.value === 'market') {
    //     isShow.value = 'distinguish'
    //     address.value = address.value[index].areaList
    //   } else {
    //     isShow.value = null
    //     active.value = false
    //   }
    // }
    return { toggle, visible, target, changeItem, currList, loading }
  }
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
