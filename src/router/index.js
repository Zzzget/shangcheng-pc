import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const Category = () => import('@/views/category')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods')
const PageLogin = () => import('@/views/login')
const Cart = () => import('@/views/cart')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: Category },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: Cart }
    ]
  },
  { path: '/login', component: PageLogin }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0, left: 0 }
  }
})

export default router
