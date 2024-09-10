<template>
    <div v-if='flowTips.length>0'  class="flow-div" v-bind:style="fadenum" >
      <div class="flow-tip" 
           :class="getTypeClass(info.type)"
           v-for="(info,index) in flowShowTips"
           :key='index'
      >
      <div class="form" v-if="info.isshow_bank_form">
        <div class="form-tip">
            <div class="flow-tip-icon-ACCT"></div>
            <div class="flow-tip-content-ACCT">{{info.title}}</div>
        </div>
        <div class="confirmBox-ACCT">
                <div class="leftServiceName">
                    客户代码
                </div>
                <div class="midServiceName">
                    市场
                </div>
                <div class="rightServiceName">
                    证券账户
                </div>
            <div class="serviceConfirm" v-for="(service, index) in info.acctconfirm" :key="index">
                <div class="leftContainer">
                    {{service.FIELD_DICT_NAME[0].CUST_CODE}}
                </div>
                <div class="midContainer">
                    {{service.label}}
                </div>                    
                <div class="rightContainer">
                    {{service.FIELD_DICT_NAME[0].DICT_ITEM}}
                </div>
            </div>
          <div class="confirmtip">
            注：沪A市场包含沪A和沪信用证券账户；深A市场包括深A和深信用证券账户。    
        </div>
        </div>
      </div>
      <div class = "flow-tip-else" v-else>
            <div class="flow-tip-icon"></div>
            <div class="flow-tip-content">{{info.title}}</div>
            <div class="flow-tip-button" v-if="info.isShowButton" @click="info.buttonFn(info)">{{info.buttonText}}</div>
            <div class="flow-tip-cancel" v-if="info.isShowCloseButton || false" @click="closeFlowtipClick(info)">{{info.closeButtonText || "关闭"}}</div>
          </div> 
      </div>
      <span class="show-more-info" @click="clickShowMore" v-if='isMoreThanFourRow'>
          <i class="el-icon-arrow-down"  v-if="isShowMore">更多</i>
          <i class="el-icon-arrow-up"   v-else>收起</i>
      </span>
    </div>
</template>

<script>

  // tip = {
  //   title:'显示内容',
  //   type:'提示类型', success/warning/info/error
  //   key:'当前提示内容的key值'
  // }
  export default {
    data() {
      return {
        flowTips:[],
        flowShowTips:[],
        fadenum: {
          animation: 'fadenum 4s 1 linear'
        },
        isMoreThanFourRow: false,//是否显示 显示更多/收起 按钮
        isShowMore: false,//界面显示 显示更多还是收起按钮
      };
    },
    watch:{
      flowTips(val){
        val && (this.flowTips = val);
        console.log("v watch this.flowTips.length===",this.flowTips.length);
        if(this.flowTips.length > 2){
            // 显示展开收起按钮
          this.isMoreThanFourRow = true;
          this.isShowMore = true;
          this.flowShowTips = [];
          let that = this;
          that.flowTips.forEach(function(item,i){
            if(i < 2){
              that.flowShowTips.push(item);
            }
          })
        }else{
          // 不显示展开收起按钮
          this.isMoreThanFourRow = false;
          this.isShowMore = false;
          this.flowShowTips = this.flowTips;
          if(_.get(this.flowTips, "[0].isshow_bank_form") == true){
            this.isMoreThanFourRow = true;
            this.isShowMore = false;
            this.flowShowTips = this.flowTips;
          }
        }
      }
    },
    computed:{
      parentPage: function() {
        return this.$parent.$parent.$parent.$parent;
      },
    },
    methods:{
      getTypeClass(type) {
        let typeClassObj = {
          warning: "warning",
          error: "error",
        }
        return typeClassObj[type] || "warning"
      },
      getIconImage(type) {
        let typeObj = {
          warning: require('@icons/V0014/icon-warning.svg'),
          error: require('@icons/V0014/icon-warning.svg'),
        }
        return typeObj[type] || require('@icons/V0014/icon-warning.svg');
      },
      clickShowMore: function(){
        this.isMoreThanFourRow = true;
        if(!(_.get(this.flowTips, "[0].isshow_bank_form")== true)){
        if(this.isShowMore){
          this.flowShowTips = this.flowTips;
        }else{
          this.flowShowTips = [];
          let that = this;
          that.flowTips.forEach(function(item,i){
            if(i < 2){
              that.flowShowTips.push(item);
            }
          })
        }}else{
          if(this.isShowMore){
          this.flowShowTips = this.flowTips;
        }else{
          this.flowShowTips = [];
          let that = this;
        }

        }
        this.isShowMore = !this.isShowMore;
      },
      //返回准入项里 指定类型的项目 如果有就是对应项目的index 否则返回0
      getTypeLength(type){
        return _.findIndex(this.flowTips, function(o) { 
          return o.type == type; 
        });
      },
      closeCurrentTip(info){
        if(info.type != 'error'){
          this.removeFlowTip(info.key);
        }
      },
      pushFlowTip(tip){
        //移除key相同的tip
        this.removeFlowTip(tip.key);
        this.flowTips = _.chain(this.flowTips).concat(tip).uniqWith(_.isEqual).value();
        console.log(this.flowTips);
      },
      removeFlowTip(key){
        this.flowTips = _.filter(this.flowTips,function(n){
          return n.key != key;
        })
      },
      removeFlowTipByParam(param, value) {
        this.flowTips = _.filter(this.flowTips,function(n){
          return n[param] === undefined || (n[param] && n[param] !== value);
        })
      },
      removeFlowTipWithoutParam(param) {
        if(param  == '') {
          this.removeAllFlowTip();
          return;
        }
        this.flowTips = _.filter(this.flowTips, function(n, key){
          return key != param;
        })
      },
      closeFlowtipClick(info){
        console.log("closeFlowtipClick===",info)
        let that = this;
        that.removeFlowTip(info.key);
        //没有深拷贝，则点击第一次取消以后，点击第二次不会触发函数
        let x = _.cloneDeep(info)
        return that.$store.commit(that.$types.CLOSE_FLOWTIP_CLICK, x);
      },
      removeAllFlowTip(){
        this.flowTips = [];
      }
      
    }
  };
</script>

<style lang="less">
.flow-div{
  position: relative;
  font-size: 21px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .limit-show{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    // 防止打包丢失 -webkit-box-orient样式
    /*! autoprefixer: off */ 
    -webkit-box-orient: vertical;
    /*! autoprefixer: on */  
    -webkit-line-clamp: 4;
  }
   .show-more-info{
      width: 60px;
      height: 30px;
      display: block;
      margin: 0 auto;
      border:1px solid #c52525;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      line-height: 30px;
      color: #c52525;
      text-align: center;
      margin-top: 15px;
      font-size:14px;
    }
  }
.flow-tip{
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 14px 24px;
  box-sizing: border-box;
  margin-top: 20px;
  .flow-tip-else {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .flow-tip-icon {
    width: 26px;
    height: 26px;
    margin-right: 18px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    flex-shrink: 0;
  }
  .flow-tip-content {
    flex: 1 1 auto;
    font-size: 24px;
    color: #eb6e20;
    font-family: Alibaba PuHuiTi;
    line-height: 32px;
  }
  .flow-tip-button {
    line-height: 32px;
    color: #3b6aff;
    font-family: Alibaba PuHuiTi;
    padding-left: 18px;
  }
  .flow-tip-cancel {
    line-height: 32px;
    color: #3b6aff;
    font-family: Alibaba PuHuiTi;
    padding-left: 18px;
  }
  &.warning {
    background-color: #fff9f0;
    .flow-tip-icon {
      background-image: url("~@icons/V0014/icon-warning.svg");
    }
  }
  &.error {
    background-color: #fff1f0;
    .flow-tip-icon {
      background-image: url("~@icons/V0014/icon-prohibit.svg");
    }
  }
}

  .flow-form{
    width: 944px;
    .flow-formleft{
      width: 272.84px;
      height: 38px;
    }
    .flow-formmid{
      width: 272.84px;
      height: 38px;
    }
    .flow-formright{
      width: 216.04px;
      height: 38px;
    }
  }
  .form {
    background-color: #fff9f0;
  .form-tip {
    display: flex;
  }
  .flow-tip-icon-ACCT {
    background-image: url("~@icons/V0014/icon-warning.svg");
    width: 26px;
    height: 26px;
    margin-right: 18px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  
  
  .flow-tip-content-ACCT {
    flex: 1 1 auto;
    font-size: 24px;
    color: #eb6e20;
    font-family: Alibaba PuHuiTi;
    line-height: 32px;
  }
  
  .confirmBox-ACCT {
    overflow: hidden;
    margin-left: 72px;
    width: 946px;
    margin-top: 5.42px;

    .leftServiceName {
      border:1px solid;
      border-color:#ffe2c7;
      width: 269.84px;
      height: 38px;
      font-family: Alibaba PuHuiTi;
      font-weight: 700;
      color: #252525;
      font-size: 24px;
      // letter-spacing: -24px;
      line-height: 32px;
      padding: 8.68px 72.89px 2.32px 21.77px;
      float: left;
      justify-content: center;
      align-items: center;
      float: left;
      background-color:#fff6ed;
    }
    .midServiceName {
      border:1px solid;
      border-color:#ffe2c7;
      width: 270.84px;
      height: 38px;
      font-family: Alibaba PuHuiTi;
      font-weight: 700;
      color: #252525;
      font-size: 24px;
      // letter-spacing: -24px;
      line-height: 32px;
      float: left;
      padding: 8.68px 25.56px 2.32px 21.6px;
      justify-content: center;
      align-items: center;
      float: left;
      background-color:#fff6ed;

    }
    .rightServiceName {
      border:1px solid;
      border-color:#ffe2c7;
      width: 214.04px;
      height: 38px;
      font-family: Alibaba PuHuiTi;
      font-weight: 700;
      color: #252525;
      font-size: 24px;
      // letter-spacing: -24px;
      line-height: 32px;
      float: left;
      padding: 8.68px 19.86px 2.32px 20.86px;
      justify-content: center;
      align-items: center;
      float: left;
      background-color:#fff6ed;
    }
    .serviceConfirm {
        //margin-top: 20px;
        //display: flex;
        display: left;
        .leftContainer {
          border-top: 0;
            border:1px solid;
            border-color:#ffe2c7;
            width:269.84px;
            height:38px;
            font-family:Alibaba PuHuiTi;
            color:#252525;
            font-size:24px;
            // letter-spacing: -24px;
            // line-height: 32px;
            //padding: 8.68px 72.89px 2.32px 21.77px;
            padding: 11.58px 72.89px 4.42px 21.77px;
            float: left;
            justify-content: center;
            align-items: center;
            float: left;
        }
        .midContainer {
          border-top: 0;
            border:1px solid;
            border-color:#ffe2c7;
            width:270.84px;
            height:38px;
            font-family:Alibaba PuHuiTi;
            color:#252525;
            font-size:24px;
            padding: 11.58px 25.56px 4.42px 21.6px;
            float: left;
        }
        .rightContainer {
          border-top: 0;
            border:1px solid;
            border-color:#ffe2c7;
            width:214.04px;
            height:38px;
            font-family:Alibaba PuHuiTi;
            color:#252525;
            font-size:24px;
            padding: 11.58px 19.86px 4.42px 20.86px;
            float: left;
        }
    }
    .confirmtip {
      margin-top: 16px;
      margin-bottom: 22px;
      float: left;
      width: 1302.23px;
      height: 30px;
      font-family: Alibaba PuHuiTi;
      color: #252525;
      font-size: 24px;
    }
}}
</style>


