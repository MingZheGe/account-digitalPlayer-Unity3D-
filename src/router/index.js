import Vue from 'vue'
import VueRouter  from 'vue-router'
Vue.use(VueRouter) 
 
//import Home from '../mainPage.vue'
import page1 from '../components/1.vue'
import page2 from '../components/2.vue'
import page3 from '../components/3.vue'
import page4 from '../components/4.vue'
import page5 from '../components/5.vue'
import page6 from '../components/6.vue'
import page7 from '../components/7.vue'
import page8 from '../components/8.vue'
import mainPage from '../mainPage.vue'
import kaihu from '../pages/kaihu.vue'
import ad from '../pages/ad.vue'
 
//2、在Vue实例内绑定路由和hash的对应关系
const router = new VueRouter({
  //在路由的实例对象中
  //用一个 routes:[]数组，来定义 hash地址与组件之间的对应关系
  routes:[
    {
      path:'/', //path指的是路由的hash地址，跳转的时候用这个路径跳转到对应组件，如果path只给了一个 /，则是首页默认展示
      component:ad
    },
    {path:'/mainPage',component:mainPage},
    {path:'/1',component:page1},
    {path:'/2',component:page2},
    {path:'/3',component:page3},
    {path:'/4',component:page4},
    {path:'/5',component:page5},
    {path:'/6',component:page6},
    {path:'/7',component:page7},
    {path:'/8',component:page8},
    {path:'/kaihu',component:kaihu},
  ]
})

export default router