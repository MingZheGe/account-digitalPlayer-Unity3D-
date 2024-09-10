import Vue from 'vue'
import VueRouter  from 'vue-router'
Vue.use(VueRouter) 
 
//import Home from '../mainPage.vue'
import page1 from '../components/1.vue'
import page2 from '../components/2.vue'
import page4 from '../components/4.vue'
import page5 from '../components/5.vue'
import page6 from '../components/6.vue'
import page7 from '../components/7.vue'
import page8 from '../components/8.vue'
import page9 from '../components/9.vue'
import page10 from '../components/10.vue'
import page11 from '../components/11.vue'
import page12 from '../components/12.vue'
import page13 from '../components/13.vue'
import mainPage from '../mainPage.vue'
import kaihu from '../pages/kaihu.vue'
import ad from '../pages/ad.vue'
import login from '../pages/login.vue'
import idlogin from '../pages/IDcardLogin.vue'
import camera from '../pages/camera.vue'
import dd from '../test3D.vue'
import progress from '../pages/progress.vue'
import shuanglu from '../test/shuangLu.vue'
import highCamera from '../test/highCameraTest.vue'
//import test from '../pages/readCard/readCard.vue'
/*
import lg1 from '../components/9-2.vue'
import lg2 from '../components/10-2.vue'
*/
 
//2、在Vue实例内绑定路由和hash的对应关系
const router = new VueRouter({
  //在路由的实例对象中
  //用一个 routes:[]数组，来定义 hash地址与组件之间的对应关系
  routes:[
    
    {
      path:'/', //path指的是路由的hash地址，跳转的时候用这个路径跳转到对应组件，如果path只给了一个 /，则是首页默认展示
      component:mainPage, //component指的是组件的名称，组件名称是组件的文件名，不带后缀，例如：Home.vue
    },
    
   // {path:'/test',component:test},
    {path:'/mainPage',component:mainPage},
    {path:'/shuanglu',component:shuanglu},
    {path:'/highcamera',component:highCamera},
    {path:'/1',component:page1},
    {path:'/2',component:page2},
    {path:'/4',component:page4},
    {path:'/5',component:page5},
    {path:'/6',component:page6},
    {path:'/7',component:page7},
    {path:'/8',component:page8},
    {path:'/9',component:page9},
    {path:'/10',component:page10},
    {path:'/11',component:page11},
    {path:'/12',component:page12},
    {path:'/13',component:page13},

    {path:'/kaihu',component:kaihu},
    {path:'/idlogin',component:idlogin},
    {path:'/l',component:login},
    {path:'/camera',component:camera},
    {path:'/3d',component:dd},
    {path:'/progress',component:progress},
    {path:'/ad',component:ad},
    //{path:'/lg1',component:lg1},
    //{path:'/lg2',component:lg2},
  ]
})

router.beforeEach((to, from, next) => {
  isOpenDigital && window.vm && vm.$digitalService && vm.$digitalService.routerBeforeEach(to, from, next);
  next();
});

router.afterEach((to) => {
    isOpenDigital && window.vm && vm.$digitalService && vm.$digitalService.routerAfterEach(to);
});

export default router