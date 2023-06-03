<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{
      category.top.name
    }}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{
        category.sub.name
      }}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>
<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'SubBread',
  setup() {
    const store = useStore()
    const route = useRoute()
    const category = computed(() => {
      const obj = {}
      store.state.category.list.forEach((top) => {
        top.children &&
          top.children.forEach((sub) => {
            if (sub.id === route.params.id) {
              obj.sub = { name: sub.name, id: sub.id }
              obj.top = { name: top.name, id: top.id }
            }
          })
      })
      return obj
    })

    return { category }
  }
}
</script>
<style lang="less" scoped></style>
