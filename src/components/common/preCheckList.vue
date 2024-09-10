业务准入提示信息列表组件
@liwei2
<template>
  <div class="checkList-wrap" v-if='checkList.length > 0'>
    <p class="title">{{getCheckTitle()}}</p>
    <p class="titleTip">{{getTitleTip()}}</p>
    <!-- 不需要合并 -->
    <template v-if="!needMerge">
      <ul>
        <li v-for="(list,key) in checkList" :key="key" class="icons">
          <img class='img' :src="getIconName(list.RESTRICT_TYPE)">
          <span class='text'>{{getText(list.RESTRICT_TYPE)}}</span>
          <div class="content-wrap">
            <span>{{list.HANDLE_TIP}}</span>
          </div>
          <button @click="clickItem(list)" v-if="list.MENU_ID != '0' && list.MENU_ID != ''">  
            <div class="buttonText">{{list.MENU_NAME}} </div>
          </button>
          <button @click="list.buttonFn" v-if="list.buttonText">  
            <div class="buttonText">{{list.buttonText}} </div>
          </button>
        </li>
      </ul>
    </template>
    <!-- 需要合并 -->
    <template v-else>
      <div class="ul"> 
        <template v-for="(accessArr, key) in mergeAccessData">
          <template v-if="(accessArr.length == 1 || key === '0' || key === '')">
            <div class="acs-type" v-for="(acsData, index) in accessArr" :key="key + index">
              <img class='img' :src="getIconName(acsData.RESTRICT_TYPE)">
              <span class='text'>{{getText(acsData.RESTRICT_TYPE)}}</span>
              <div class="content-wrap">
                <span>{{acsData.HANDLE_TIP}}</span>
              </div>
              <button @click="clickItem(acsData)" v-if="acsData.MENU_ID != '0' && acsData.MENU_ID != ''">  
                <div class="buttonText">{{acsData.MENU_NAME}} </div>
              </button>
            </div>
          </template>
          <!-- 长度不为 1 的走这个分支 -->
          <template v-else-if="accessArr.length > 1 && (key !== '0' && key !== '')">
            <div class="merge-acs" :key="key">
              <div class="merge-left">
                <div class="merge-acs-type" v-for="(acsData, index) in accessArr" :key="key + index">
                  <img class='img' :src="getIconName(acsData.RESTRICT_TYPE)">
                  <span class='text'>{{getText(acsData.RESTRICT_TYPE)}}</span>
                  <div class="content-wrap">
                    <span>{{acsData.HANDLE_TIP}}</span>
                  </div>
                </div>
              </div>
              <div class="merge-right">
                <button @click="clickItem(accessArr[0])" v-if="accessArr[0].MENU_ID != '0' && accessArr[0].MENU_ID != ''">
                  <div class="buttonText">{{accessArr[0].MENU_NAME}} </div>
                </button>
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>
    <div class="footer">
      <el-button class='goback' @click="goToHome">{{leftBtnText}}</el-button>
      <el-button class='sure' @click="skip" v-if="isShowRightBtn">下一步</el-button>
    </div>
  </div>
</template>

<script>
  import custService from '../../service/cust-service'
  export default {
    data() {
      return {
        // hasForbin: false,//是否存在禁止项
        mergeAccessData: {}
      };
    },
    props:{
      checkList:{
        type: Array,
        default: []
      },
      availableMenuIdArr: {
        type: Array,
        default: []
      },
      accessType:{
        type: Number,
        default:0
      },
      dealButtonTxt:{
        type: String,
        default:'点击完善'
      },
      isCurBusiAble: {
        type: Boolean,
        default: false
      },
      hasAbleBusi: {
        type: Boolean,
        default: false
      },
      needMerge: {
        type: Boolean,
        default: false
      }, // 合并后的展示列表
    },
    computed: {
      busiCode() {
        return this.$store.state.busicode;
      },
      isCustLogin(){
        return this.$syscfg.isCustLogin();
      },
      custInfo(){
        return this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO) || {};
      },
      hasForbin() {
        let flag = false;
        this.checkList.forEach(item => {
          if(["0","1"].indexOf(item.RESTRICT_TYPE) != -1){
            //存在禁止项
            flag = true;
          }
          if(item.MENU_NAME){
          }
        });
        return flag;
      },
      leftBtnText(){
        // 当为规范性检查界面时, 如果是从首页欢迎登录入口登录，且豁免菜单不存在时， 注销登录并返回首页
        if(this.accessType == 1 && !this.busiCode && !this.hasAbleBusi) {
          return '我要退出'
        }else {
          return '返回首页'
        }
      },
      isShowRightBtn() {
        //如果是规范性检查
        if(this.accessType == 1){
          // 只有从业务入口登录且当前是豁免菜单 或者从首页入口进入存在豁免菜单是可以跳过
          return ((this.busiCode && this.isCurBusiAble) || ((!this.busiCode && this.hasAbleBusi) )? true: false);
        }
        // 如果是前置校验和静态准入有禁止项，就不显示
        else {
          return this.hasForbin? false: true;
        }
      }
    },
    mounted() {
      let that = this;
      let refuseItem = _.filter(this.checkList, i => i.RESTRICT_TYPE == "0");
      if(refuseItem.length){
        this.checkList = refuseItem;
        _.each(this.checkList, i => {
          let menuObj = {}
          if(i.MENU_ID != "0" && i.MENU_ID != ""){
            menuObj = _.find(that.$storage.getJsonSession(that.$definecfg.ALL_MENU), o => o.MENU_ID == i.MENU_ID);
          }
          that.$set(i, "MENU_NAME", menuObj && menuObj.MENU_NAME || "");
          that.$set(i, "menuDesc", menuObj && menuObj.BUSI_DESC || "");
        });
        if (this.needMerge) {
          this.mergeSameAccessTips()
        }
      }else{
        _.each(this.checkList, i => {
          let menuObj = {}
          if(i.MENU_ID != "0" && i.MENU_ID != ""){
            menuObj = _.find(that.$storage.getJsonSession(that.$definecfg.ALL_MENU), o => o.MENU_ID == i.MENU_ID);
          }
          that.$set(i, "MENU_NAME", menuObj && menuObj.MENU_NAME || "");
          that.$set(i, "menuDesc", menuObj && menuObj.BUSI_DESC || "");
        });
        if (this.needMerge) {
          this.mergeSameAccessTips();
        }
      }
    },
    methods:{
      getCheckTitle(){
        switch(this.accessType){
          case 0 : 
            return "前置校验";
            break;
          case 1 : 
            return "规范性检查";
            break;
          case 2 : 
            return "业务准入";
            break;
          default:
            return "前置校验";
        }
      },
      getTitleTip(){
        if(this.accessType == "1"){
          return "您的账号状态出现异常，请联系工作人员协助处理！"
        }else{
          return this.getCheckTitle() + "存在以下问题，如有疑问，请联系工作人员"
        }
      },
      // 合并所有相同的菜单
      mergeSameAccessTips() {
          let that = this;
          // 准入数据
          let accessDataArr = that.checkList;
          //_.sortBy(accessDataArr, item => { return item.MENU_ID })
          // 设置一个二维数组
          let mergeAccessData = {};
          _.each(accessDataArr, item => {
              // 如果准入对象中存在 该准入的菜单id 则往当前内容直接添加
              if (_.indexOf(_.keys(mergeAccessData), item.MENU_ID) > -1) {
                  mergeAccessData[item.MENU_ID].push(item);
              } 
              // 如果准入菜单id不为空则直接放上去即可 
              else if (item.MENU_ID != ""){
                  mergeAccessData[item.MENU_ID] = [];
                  mergeAccessData[item.MENU_ID].push(item);
              }
          })
          that.mergeAccessData = mergeAccessData;
      },
      getIconName(listIconType){
        // 0拒绝办理业务，1禁止办理,2警告，3提示
        switch(listIconType){
          case '0':
            return require('@icons/yinheVTM/customerCheck/icon-refuse.svg');
          case '1':
            return require('@icons/yinheVTM/customerCheck/icon-prohibit.svg');
            break;
          case '2':
            return require('@icons/yinheVTM/customerCheck/icon-warning.svg');
            break;
          case '3':
            return require('@icons/yinheVTM/customerCheck/icon-to-improve.svg');
            break;
          default:
            return require('@icons/yinheVTM/customerCheck/icon-to-improve.svg');
            break;
        }
      },
      getText(listIconType){
        // 0拒绝办理业务，1禁止办理,2警告，3提示
        switch(listIconType){
          case '0':
            return '拒绝';
          case '1':
            return '禁止';
            break;
          case '2':
            return '警告';
            break;
          case '3':
            return '提示';
            break;
          default:
            return '提示';
            break;
        }
      },
      goToHome(){
        // 当为规范性检查界面时, 如果是从首页欢迎登录入口登录，且豁免菜单不存在时， 注销登录并返回首页
        // 考虑到销户状态可以办理客户状态变更
        if(this.accessType == 1 && !this.busiCode && !this.hasAbleBusi) {
          this.$storage.removeSession(this.$definecfg.CUSTOMER_INFO);
          this.$store.commit('updateCustInfo', '');
          this.$router.replace({path: this.$bizhomecfg.getHomeConfig()})
        }
        else {
          //已经登录成功且不是销户状态 跳转登陆后的首页
          if(this.isCustLogin && this.busiCode != 'V0009' && this.custInfo.CUST_STATUS != '9'){ 
            this.$router.replace({
              path: this.$bizhomecfg.getHomeCustomerConfig()
            })
          }else{
            this.$router.replace({
              path: this.$bizhomecfg.getHomeConfig()
            })
          }
        }
      },
      skip(){
        this.$emit("skip")
      },
      clickItem(menu) {
        let that = this,
            custInfo = this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO);
        
        if(menu.IS_RECOD_CUST){
          //调用账户系统接口L1102335留痕“已提示客户为‘失联客户’” toDo 
          custService.W0000201({SPECIAL_FLAG_TYPE:'02',INT_ORG: custInfo.INT_ORG,CUST_CODE: custInfo.CUST_CODE}).then(function(flag){
            if(flag){
              //同时本地存已经提示过客户的标识
              that.$storage.setSession(that.$definecfg.HAS_REMIND_CUST,'1');
              that.goToMenu(menu);
            }
          }).catch(function(err){
            that.alert(err)
          })
        }else{
          that.goToMenu(menu);
        }
      },
      goToMenu(menu){
        //统一自动跳到配置的另一个业务菜单的业务简介页面去
        if (!menu.BUSI_CODE_ACS) {
          //如果没有配置业务代码
          let tempMenu = _.find(this.$storage.getJsonSession(this.$definecfg.ALL_MENU), {MENU_ID:menu.MENU_ID});
          menu = Object.assign(menu,tempMenu);
        }else{
          menu.BUSI_CODE = menu.BUSI_CODE_ACS;
        }
        if (this.availableMenuIdArr.length && _.indexOf(this.availableMenuIdArr, menu.MENU_ID) == -1) {
          this.messageBox({
            typeMessage: "info",
            messageText:   "您的账户信息不规范，无法办理此业务",
            confirmButtonText: "确定",
          });
          return false;
        }
        if(!menu.BUSI_CODE) {
          this.$message.error("菜单配置错误：没有子菜单或页面");
          return;
        }
        //更新业务名称和业务代码
        this.$store.commit(this.$types.UPDATE_BUSI_CODE, menu.BUSI_CODE);
        this.$storage.setSession(this.$definecfg.BUSI_NAME,menu.MENU_NAME);
        this.$store.commit(this.$types.UPDATE_MENU_NAME, menu.MENU_NAME);
        //如果是双录业务 需要保存标志
        if(menu.MENU_ID=="99665000" || _.startsWith(menu.BUSI_CODE,"P")){
          console.log("保存双录标志");
          this.$storage.setSession(this.$definecfg.IS_DOUBLE_RECORD,1);
        }else{
          this.$storage.removeSession(this.$definecfg.IS_DOUBLE_RECORD);
        }
        if(this.$syscfg.isPersonOpenAcctBiz(menu.BUSI_CODE)){
          menu.userType = "0"
        }else if(this.$syscfg.isOrgOpenAcctBiz(menu.BUSI_CODE)){
          menu.userType = "1"
        }else if(this.$syscfg.isProOpenAcctBiz(menu.BUSI_CODE)){
          menu.userType = "2"
        }
        let ps = { busiCode: menu.BUSI_CODE, userType: ' ', menuDesc: menu.BUSI_DESC };
        if("userType" in menu) {
          this.$store.commit(this.$types.UPDATE_USER_TYPE, menu.userType);
          ps["userType"] = menu.userType;
        }
          
        this.$router.replace({
          name: 'bizInfo',
          params: ps
        });
      }
    },
   
  };
</script>

<style lang="less" scoped>
  .checkList-wrap{
    width: 100%;
    height: 832px;
    display: flex;
    flex: 0 1 auto;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    img{
      width: 66px;
      height: 66px;
    }
    p{
      font-size: 24px;
      color: #FFFFFF;
      font-weight: normal;
      font-stretch: normal;
    }
    .title{
        line-height: 58px;
        font-family: Alibaba PuHuiTi;
        font-weight: bold;
        color: #252525;
        font-size: 42px;
        margin: 14px 0 0;
    }
    .titleTip{
        line-height: 45px;
        font-family: Alibaba PuHuiTi;
        color: #666666;
        font-size: 26px;
        margin: 13px auto 24px
    }
    ul{
      background: #FFFFFF;
      border-radius:15px;
      margin-bottom: 100px;
      list-style: none;
      overflow: scroll;
      flex: 2;
      padding: 0;
      width: 100%;
      margin: 0;
      height: auto;
      flex: 0 0 502px;
      li {
        font-size: 24px;
        color: rgba(0,22,51,0.50);
        line-height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ebf0ff;
        border-radius: 8px;
        width: 1140px;
        min-height: 100px;
        margin: 0 auto 40px;
        box-sizing: border-box;
        padding: 10px 33px 10px 0;
        
        .content-wrap{
          margin-right: 10px;
          flex: 1 1 auto;
          text-align: left;
          width: 730px;
          span{
            color:#252525;
            font-size:26px;
            line-height:42px;
          }
        }
        button{
            font-family:Alibaba PuHuiTi;
            font-weight: 500;
            width: 215px;
            color: #3b6aff;
            font-size: 26px;
            line-height: 32px;
            border: none;
            background: none;
            padding: 0;
        }
        .text{
            margin-left: 19px;
            margin-right: 32px;
            font-family: Alibaba PuHuiTi;
            font-weight: 500;
            color: #c93e2c;
            font-size: 26px;
            width: 55px;
            line-height: 32px;
        }
        .img{
          width: 26px;
          height: 26px;
          margin: 0 12px 0 50px;
        }
      }
    }
    .ul {
      background: #FFFFFF;
      border-radius:15px;
      margin-bottom: 100px;
      list-style: none;
      overflow: scroll;
      flex: 2;
      padding: 0;
      width: 100%;
      margin: 0;
      height: auto;
      flex: 0 0 502px;
      .acs-type {
        width: 1140px;
        min-height: 100px;
        margin: 0 auto 40px;
        padding: 10px 33px 10px 0;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 24px;
        color: rgba(0,22,51,0.50);
        line-height: 32px;
        
        background-color: #ebf0ff;
        border-radius: 8px;
        box-sizing: border-box;
        .content-wrap{
          margin-right: 10px;
          flex: 1 1 auto;
          text-align: left;
          width: 730px;
          span{
            color:#252525;
            font-size:26px;
            line-height:42px;
          }
        }
        button{
            font-family:Alibaba PuHuiTi;
            font-weight: 500;
            width: 215px;
            color: #3b6aff;
            font-size: 26px;
            line-height: 32px;
            border: none;
            background: none;
            padding: 0;
        }
        .text{
            margin-left: 19px;
            margin-right: 32px;
            font-family: Alibaba PuHuiTi;
            font-weight: 500;
            color: #c93e2c;
            font-size: 26px;
            width: 55px;
            line-height: 32px;
        }
        .img{
          width: 26px;
          height: 26px;
          margin: 0 12px 0 50px;
        }
      }
      .merge-acs {
        width: 1140px;
        margin: 0 auto 40px;
        padding: 10px 33px 10px 0;

        display: flex;
        align-items: center;

        font-size: 24px;
        color: rgba(0,22,51,0.50);
        line-height: 32px;

        background-color: #ebf0ff;
        border-radius: 8px;
        box-sizing: border-box;
        .merge-left {
          width: 868px;
          .merge-acs-type {
            min-height: 100px;
            display: flex;
            align-items: center;

            border-bottom: 1px dotted;
            border-color: #a8bdff;
            margin-left: 47px;
            .content-wrap{
              margin-right: 10px;
              flex: 1 1 auto;
              text-align: left;
              width: 700px;
              span{
                color:#252525;
                font-size:26px;
                line-height:42px;
              }
            }
            .text{
              margin-left: 19px;
              margin-right: 32px;
              font-family: Alibaba PuHuiTi;
              font-weight: 500;
              color: #c93e2c;
              font-size: 26px;
              width: 55px;
              line-height: 32px;
            }
            .img{
              width: 26px;
              height: 26px;
              margin: 0 15px 0 0px;
            }
          }
          .merge-acs-type:last-child {
            border: none;
          }
        }
        .merge-right {
          button{
            font-family:Alibaba PuHuiTi;
            font-weight: 500;
            width: 215px;
            color: #3b6aff;
            font-size: 26px;
            line-height: 32px;
            border: none;
            background: none;
            padding: 0;
          }
        }
      }
    }
    .footer{
      flex: 0 1 100px;
      display: flex;
      align-items: center;
      text-align: center;
      .el-button{
        width: 170px;
        height: 60px;
        border-radius: 4px;
        border: solid 1px #1f59db;
        background-image: linear-gradient(270deg, 
        #1f59db 0%, 
        #217fff 100%);
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 33px;
        letter-spacing: 0px;
        color: #fffdfd;
      }
      .goback{
        margin-right: 48px;
        background: white;
       	color: #1f59db;
      }

    }
  }
</style>


