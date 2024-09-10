<template>
  <!--左部整体导航-->
  <div class="leftPart">
    <div class="listItem" v-for="(item, index) in stepsObj" :key="index">
      <div  @click="clickSonItem(index)" :class="['parentBox', getItemState(index)]">
          <div class="stepInfo">
            <div :class="['upline', isFrist(index) ? 'isFirst' : '']"></div>
            <div class="icon"><img :src="getImgSrc(index)"></div>
            <div :class="['downLine', isLast(index) ? 'isLast' : '']"></div>
          </div>
          <div class="contentItem">
            <span>{{item.name || item}}</span>
          </div>
      </div>
      <div class="subnav-wrap" v-if="item.subNav && item.subNav.length && index == stepIndex">        
          <div class="sonbox" v-for="(nav, nindex) in item.subNav" @click="handleSubnavChange(nav,nindex)" :key="nindex">
            <div class="contentSon" >
              <div class="icon">
                <img :src="getImgSrc(nindex,'nav', nav)">
              </div>
              <div :class="['text', getItemState(nindex,'nav', nav)]">
                {{nav.name}}
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      stepIndex: 0,
      stepsObj: [],
      canClickSubNav: true,
      currentSubnavIndex: 0,
      subnavClickedIndex:0,
    }
  },
  mounted () {
    this.initLeftStep();
    this.initSteps();
  },
  activated () {
    this.initSteps();
  },
  deactivated () {
    this.$destroy();
  },
  computed: {
    showUserLoginDrawer () {
      return this.$store.state.showUserLoginDrawer
    },
    navTitle() {
      if(this.$route.path.split("/")[1]=="bizFlow"){
        let stepVal = this.$route.path.split("/")[4];
        let routeName = ""
        switch (stepVal){
          case "baseInfoNode":
            routeName = "资料录入";
            break;
          case "evaluatingNode":
            routeName = "风险评测";
            break;
          case "evaluatingNodeCredit":
            routeName = "征信测评";
            break;
          case "evaluatingNodeKno":
            routeName = "知识测评";
            break;
          case "acctInfoNode":
            routeName = "账户信息";
            break;
          case "creditReportingNode":
            routeName = "关联人信息";
            break;
          case "amountInfoNode":
            routeName = "额度信息";
            break;
          // case 'firstMatchResultNode':
          //   routeName = "适当性信息";
          //   break;
          case 'firstMatchResultNode': 
            routeName = "适当性信息";
            break;
        }
        return routeName;
      }else{
        return this.$route.meta.title||this.$route.meta.name;
      }
    },
    subNavIndex () {
      return this.$store.state.subnavIndex;
    },
    bizRouteTable () {
      return this.$store.state.bizRouteTable;
    },
    bizRouteIndex () {
      return this.$store.state.bizRouteIndex;
    },
    updateRouteTableFlag(){
      return this.$store.state.updateRouteTableFlag
    },
    navRouteTable () {
      let that = this,
        newNavRoute = [];
      // console.log("that.$store.state.navRouteTable")
      // console.log(that.$store.state.navRouteTable)
      that.$store.state.navRouteTable && _.forEach(that.$store.state.navRouteTable, function (nav) {
        let navName = nav.name || nav;
        newNavRoute.push({
          subNav: nav.subNav || [],
          name: navName,
          isRejected: nav.isRejected || false,
          imgCls: nav.imgCls,
          // icon: that.addNavIcon(navName)
        })
      });
      return newNavRoute;
    }
  },
  watch: {
    $route (to, from) {
      this.initSteps();
    },
    showUserLoginDrawer (v) {
      this.canClickSubNav = !v;
    },
    subNavIndex (v) {
      this.currentSubnavIndex = v;
      this.initSteps();
    },
    navRouteTable () {
      this.initSteps();
    },
    navTitle () {
      this.subnavClickedIndex = 0;
      this.initSteps();
    },
    updateRouteTableFlag(){
      this.initLeftStep();
      this.initSteps();
      this.$store.commit(this.$types.UPDATE_ROUTE_TABLE_FLAG, false);
    }
  },
  methods: {
    handleSubnavChange (nav, index, item) {
      // TODO 目前没这个需求，后期再添加
      let routerIndex = this.$router.getRouteIndex(nav.name);
      let routerItem = this.$router.getRoute(routerIndex);
      let flag = true;
      for (let index = 0; index < routerIndex; index++) {
        let tableItem = this.bizRouteTable[index];
        if (tableItem.stepState == "isWaiting") {
          flag = false;
          break
        }
      }
      if (routerItem.stepState == "isSonFinish" && flag) {
        this.$store.commit(this.$types.UPDATE_ROUTE_JUMP, nav.name);
      }
      return;
      if(this.subnavClickedIndex<index-1){
        return false;
      }
      if(this.$route.path.split("/")[1]=="bizFlow"){
        this.$router.goRoute(nav.name);
      }
      this.$store.commit(this.$types.UPDATE_SUBNAV_INDEX, index);
    },
    clickSonItem(index){
      // TODO 目前没这个需求，后期再添加
      return;
      // let currentIndex =  this.navRouteTable.indexOf(this.stepsObj[this.stepIndex]);
      let routeName = this.navRouteTable[index].name||"";
      if(index<this.stepIndex){
        switch (this.navRouteTable[index].name){
          case "资料录入":
            routeName = "baseInfoNode";
            break;
          case "风险评测":
            routeName = "evaluatingNode";
            break;
          case "账户信息":
            routeName = "acctInfoNode";
            break;
          case "关联人信息":
            routeName = "creditReportingNode";
            break;
          case "额度信息":
            routeName = "amountInfoNode";
            break;
          case '适当性匹配结果':
            routeName = "firstMatchResultNode";
            break;
          case '影像扫描':
            routeName = "imageCollection";
            break;
          case '证件采集':
            routeName = "idCardCollection";
            break;
          case '双录视频':
            routeName = "localRecord";
            break;
          case '协议签署':
            routeName = "formSign";
            break;
          case '影像扫描':
            routeName = "imageScan";
            break;
          default:
            break;
        }
        routeName&&this.goToRouter(routeName);
      }
    },
    goToRouter(rouName){
      let index = _.findIndex(this.bizRouteTable,(item)=>{
        return item.path.indexOf(rouName)>-1
      })
      this.$router.goRoute(index);
    },
    updateRejectImgStatus (navStepsArr) {
      let imgStateObj = this.$store.state.imageCollectObj;
      function updateImgSta (arr) {
        _.forEach(arr, function (item) {
          item.imgCls && imgStateObj[item.imgCls] && imgStateObj[item.imgCls].B_SNO && (item.isRejected = false);
          item.subNav && item.subNav.length && updateImgSta(item.subNav);
        })
      }
      !_.isEmpty(imgStateObj) && updateImgSta(navStepsArr);

      //如果次级导航全部不是驳回的 主菜单也不能为驳回状态
      _.forEach(navStepsArr, function (item) {
        let hasRejectFlag = item.subNav.length ? !!_.filter(item.subNav, item1 => item1.isRejected == true).length : 1;
        !hasRejectFlag && (item.isRejected = false);
      })
      return navStepsArr;
    },
    isFrist(index){
      return index == 0;
    },
    isLast(index){
      return index == this.stepsObj.length-1;
    },
    getImgSrc(index, type, nav){
      let imgSrc = "";
      let state = this.getItemState(index, type, nav);
      if(type=="nav"){      //二级导航
        if(state == "isSonFinish"){
          imgSrc = require('../../icons/yinheVTM/icon-leftmenu2-finsh.svg');
        }
        if(state == "isSonDoing"){
          imgSrc = require('../../icons/yinheVTM/icon-leftmenu2-doing.svg');
        }
        if(state == "isWaiting"){
          imgSrc = require('../../icons/yinheVTM/icon-leftmenu-wait.svg');
        }
      }else{          //一级导航
        if(state == "isFinish"){
          imgSrc = require('../../icons/yinheVTM/icon-step-finish.svg');
        }
        if(state == "isDoing"){
          imgSrc = require('../../icons/yinheVTM/icon-step-doing.svg');
        }
        if(state == "isWaiting"){
          imgSrc = require('../../icons/yinheVTM/icon-step-waitng.svg');
        }
      }
      return imgSrc;
    },
    getItemState(index, type, nav){
      let itemState = "";
      if(type=="nav"){        //二级导航
        let routerIndex = this.$router.getRouteIndex(nav.name);
        let routeItem = this.$router.getRoute(routerIndex);
        if(this.currentSubnavIndex > parseInt(index)){
          itemState = 'isSonFinish'
        }
        if(this.currentSubnavIndex == index){
          itemState = 'isSonDoing'
        }
        if(this.currentSubnavIndex < index){
          itemState = "isWaiting"
        }
        //路由状态变更
        if (routeItem.stepState && itemState != 'isSonDoing') {
          itemState = routeItem.stepState; 
        }
      }
      if (type != "nav") {                  //一级导航
        if(this.stepIndex > parseInt(index)){
          itemState = 'isFinish'
        }
        if(this.stepIndex == index){
          itemState = 'isDoing'
        }
        if(this.stepIndex < index){
          itemState = "isWaiting"
        }
      }
      return itemState;
    },
    initSteps: _.debounce(function () {
      let that = this,
          steps = _.cloneDeep(that.navRouteTable),
          currentSIdx = "";
      _.each(steps,(element,index)=>{
        let elementName = element.name||element;
        if(elementName == that.navTitle){
          currentSIdx = index;
        }
      })
      if(this.$route.path.split("/")[1]=="bizFlow"){          //客户资料节点
        let  from = this.bizRouteTable&&this.bizRouteTable[this.bizRouteIndex].from||"";
        if(from){
          let subNavArr = [];
          let subNavName = this.bizRouteTable&&this.bizRouteTable[this.bizRouteIndex].name||"";
          
          steps[currentSIdx] && (steps[currentSIdx].subNav = []);
          _.forEach(this.bizRouteTable,(item)=>{
            let secNavObj = {
              name: item.name,
            }
            if(item.show && from == item.from && !item.notShowTheLeft){
              subNavArr.push(secNavObj)
            }
          })
          this.currentSubnavIndex = _.findIndex(subNavArr,(litem)=>{
            return litem.name == subNavName;
          })
          this.subnavClickedIndex = this.currentSubnavIndex > this.subnavClickedIndex ? this.currentSubnavIndex : this.subnavClickedIndex;
          if(subNavArr.length>1){
            steps[currentSIdx] && (steps[currentSIdx].subNav = subNavArr);
          }
        }
      }

      //这里更新驳回影像的状态
      //这里取的是VUEX里面的数据 影像节点存储了数据
      that.stepIndex = currentSIdx;
      that.$set(that, 'stepsObj', that.updateRejectImgStatus(steps));

    }, 200, { 'trailing': true, "maxWait": 500 }),
    //重新计算左侧导航
    initLeftStep: _.debounce(function () {
      let newNavArr = [];
      _.each(this.bizRouteTable,(bizItem)=>{
        if(bizItem.path.indexOf("bizFlow")>-1&&bizItem.show&&!bizItem.withoutNavstep){        //客户资料部分与影像部分单独处理
          let rc = _.split(bizItem.path, "/")[4];
          switch (rc) {
            case "baseInfoNode":
                (newNavArr.indexOf('资料录入') == -1 )&&(newNavArr.push("资料录入"));
                break;
            case "evaluatingNode":
                (newNavArr.indexOf('风险评测') == -1 )&&(newNavArr.push("风险评测"));
                break;
            case "evaluatingNodeCredit":
                (newNavArr.indexOf('征信测评') == -1 )&&(newNavArr.push("征信测评"));
                break;
            case "evaluatingNodeKno":
                (newNavArr.indexOf('知识测评') == -1 )&&(newNavArr.push("知识测评"));
                break;
            case "acctInfoNode":
                (newNavArr.indexOf('账户信息') == -1 )&&(newNavArr.push("账户信息"));
                break;
            case "creditReportingNode": 
                (newNavArr.indexOf('关联人信息') == -1 )&&(newNavArr.push("关联人信息"));
                break; 
            case "amountInfoNode": 
                (newNavArr.indexOf('额度信息') == -1 )&&(newNavArr.push("额度信息"));
                break; 
            // case 'firstMatchResultNode':
            //     (newNavArr.indexOf('适当性信息') == -1 )&&(newNavArr.push("适当性信息"));
            //     break;
            case 'firstMatchResultNode': 
                (newNavArr.indexOf('适当性信息') == -1 )&&(newNavArr.push("适当性信息"));
                break;
            case 'cancelCheck':
                (newNavArr.indexOf('销户检查') == -1 )&&(newNavArr.push("销户检查"));
                break;
            default:
                break;
          }
        }else if(bizItem.show&&!bizItem.withoutNavstep){
          let navText = bizItem.title||bizItem.name;
          if(newNavArr.indexOf(navText)==-1){
            if(navText != "现场免冠照上传") {
              newNavArr.push(bizItem.title||bizItem.name);
            }
          }
        }
      })
      this.$store.commit(this.$types.UPDATE_NAV_ROUTE_TABLE, newNavArr);
    }, 200, { 'trailing': true, "maxWait": 500 }),
  }
}
</script>

<style lang="less">
.leftPart{
  height: 926px;
  width: 292px;
  position: relative;
  background-color: #EBF0FF;
  box-shadow: 0px 4px 16px 0px 
          rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  overflow: auto;
  .listItem {
    width: 292px;
    min-height: 80px;
    position:relative;
    .parentBox {
      display: flex;
      .stepInfo {
        position: relative;
        left: 9px;
        .upline {
          position: absolute;
          width: 46%;
          height: 46px;
          // top: 5px;
          border-right: solid #ffffff 4px;
        }
        .upline.isFirst {
          border: none;
        }
        .icon {
          position: relative;
          z-index: 1;
          padding-top: 6px;
        }
        
        .downLine {
          position: absolute;
          width: 46%;
          height: 46px;
          bottom: 0px;
          border-right: solid #ffffff 4px;
        }
        .downLine.isLast {
          border: none;
        }
      }
      .contentItem {
        min-height: 80px;
        line-height: 80px;
        font-size: 26px;
        color: #505152;
      }
    }
    .parentBox.isFinish {
      .stepInfo {
        .upline { 
          border-right: solid #93c9ff 4px;
        }
        .icon {
          padding-left: 11px;
          padding-right: 12px;
          padding-top: 12px;
        }
        .downLine {
          border-right: solid #93c9ff 4px;
        }
        .downLine.isLast {
          border: none;
        }
        .upline.isFirst {
          border: none;
        }
      }
      .contentItem {
        color: #2860dd
      }
    }
    .parentBox.isDoing {
      background: white;
      .stepInfo {
        .upline { 
          border-right: solid #93c9ff 4px;
        }
        .icon {
          padding-top: 12px;
        }
        .downLine {
          border-right: solid #93c9ff 4px;
        }
        .downLine.isLast {
          border: none;
        }
        .upline.isFirst {
          border: none;
        }
      }
      .contentItem {
        color: #222222;
        font-weight: 700;
      }
    }
    .parentBox.isWaiting{
      .upline { 
        border-right: solid #fff 4px;
      }
      .downLine {
        border-right: solid #fff 4px;
      }
      .contentItem {
        color:#4d4d4d;
      }
    }
    .sonbox {
      margin-left: 41px;
      border-left: 4px solid #ffffff;
      .contentSon {
        padding-left: 22px;
        padding-right: 12px;
        padding-top: 20px;
        // line-height: 8px;
        padding-bottom: 11px;
        font-size: 26px;
        display: flex;
        .icon {
          width: 20px;
        }
        .text {
          margin-left: 8px;
          color: #505152;
        }
        .text.isSonDoing {
          color: #222222;
          font-weight: 700;
        }
        .text.isSonFinish {
          color: #2860dd;
        }
      }
    }
  }
}
</style>