<template>
  <div class="V0052-addFund">
    <flowTip ref="flowTip" class="flowTip"></flowTip>
    <div class="fund-list">
      <div class="title">
          <div class="logo"></div>
          <div class="titleContent">
              请选择需要开通的基金公司
          </div>
          <div class="lookOpened">
              <el-button @click="showMore">
                  <img :src="require('@icons/common/icon-biz-seemore.svg')"/>
                  <span class="show-more">查看已有基金账户</span>
              </el-button>
          </div>
      </div>
      <div class="content" v-if="!showAddBtn">
        <div class="tipImg">
          <img :src="require('@icons/yinheVTM/icon-fund-info.svg')">
        </div>
        <div class="addFundContent" @click="addFund(false)">
          开立基金账户
        </div>
      </div>
      <div class="fund-check-list" v-show="showAddBtn">
        <div class="fund-item" v-for="item in fundList" :key="item.TA_CODE">
          <div class="fund-label">基金公司:</div>
          <el-input v-model="item.showValue" disabled></el-input>
          <div class="fund-del">
            <img :src="require('@icons/yinheVTM/icon-area-del-normal.svg')" @click="deleteFund(item.TA_CODE)">
          </div>
        </div>
      </div>
      <div class="add-box" v-show="showAddBtn">
        <el-button class="add-btn" icon='add-icon' @click="addFund(false)">添加基金公司</el-button>
      </div>
    </div>    
    <loading :loadingText="loadingText" :showLoading="isLoading" ownClass="movi" ></loading>
  </div>
</template>

<script>
import flowTip from '../../../../components/common/flowTip';
import loading from "../../../../components/common/loading";
import oppService from '../../../../service/opp-service'
import sysConfig from '../../../../config/sysConfig'
import dict from '../../../../tools/dict'
export default {
  components: {
    flowTip,
    loading,
  },
  data() {
      return {
        fundList: [],
        dialogVisible: false,
        hasFundOpenData: [],

        isLoading: false,
        loadingText: '',
      }
  },
  computed: {
    busiCode() {
        return this.$store.state.busicode;
    },
    userType() {
        return this.$store.state.usertype;
    },
    showAddBtn() {
      return this.fundList.length;
    }
  },
  watch: {
    fundList(list) {
      let that = this;
      if(!list.length) {
        console.log('更新路由的next按钮，文字和跳转');
        that.$refs.flowTip.pushFlowTip({
            title: "如您不开通开放式基金账户，请点击“跳过”后继续办理。",
            type: 'warn',
            key: 'noAccount'
        })
        this.$router.updateRoute(this.$router.getCurrentRouteIndex(), "nextBtnText", "跳过");
      }
      else {
        this.$refs.flowTip.removeFlowTip("noAccount");
        this.$router.updateRoute(this.$router.getCurrentRouteIndex(), "nextBtnText", "下一步");
      }
    }
  },
  props: ["bizData", "historyData", "oppBusiData", "groupData"],
  mounted() {
    let that = this;
    let customerInfo = this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO) || {};
    let allFundCompany = that.$storage.getJsonSession(that.$definecfg.ALL_FUND_COMPANY);

    let canJump = _.isEmpty(allFundCompany) ? true: false;

    that.isLoading = true;
    that.loadingText = '正在请求所有基金公司信息，请稍候……';

    that.getFundData(customerInfo.CUST_CODE, customerInfo)
    .then( res => {
      let hasFundsData = res[0].Data, // 已经开通的基金公司
      fundsData = res[1].Data; // 所有的基金公司未经过过滤
      that.oppBusiData.euserStatus = _.get(res[3], "Data[0].EUSER_STATUS", "")
      // 为以开通的基金公司 的TA_CODE补全 0 补充到四位
      _.each(hasFundsData, v => {
          if (v.TA_CODE.length == 1) {
              v.TA_CODE = "000" + v.TA_CODE
          } else if (v.TA_CODE.length == 2) {
              v.TA_CODE = "00" + v.TA_CODE
          } else if (v.TA_CODE.length == 3) {
              v.TA_CODE = "0" + v.TA_CODE
          }
          // 为已经开通的基金公司添加属性 基金公司名称属性
          var obj = _.find(fundsData, function (item) {
              return v.TA_CODE == (item.ORG_CODE || 0);
          });
          if (obj) {
              v.OFACCT_FNAME = obj && obj.ORG_FULL_NAME || obj.ORG_NAME || '';
          }
      })
      // 过滤掉开通了的 但是注销了的 
      var lastTmpArr = _.filter(hasFundsData, function (item) {
          return item.OFACCT_STATUS !== "9"
      });
      let hasFundsTaCodes = _.map(lastTmpArr, "TA_CODE") || [];
      // 可以选择的所有基金公司 屏蔽客户在系统内开通的非注销的基金公司，基金公司需屏蔽交银施罗德；(0249)
      hasFundsTaCodes.push("0249");
      fundsData = _.filter(fundsData, item => {
          return (_.indexOf(hasFundsTaCodes, item.ORG_CODE) == -1 && _.indexOf(["9"], item.ORG_STATUS) == -1)
      });

      //银河证券不展示机构类别为50-基金代销的基金公司
      if(sysConfig.$syscfg.isQSMZ('YINHE')) {
          fundsData = _.filter(fundsData, item => {
              return item.ORG_CLS != '50'
          });
      }

      let ofAcctStatusDict = res[2] && res[2].OFACCT_STATUS;
      _.each(hasFundsData, v => {
          let temp = _.find(ofAcctStatusDict, dict => dict.DICT_ITEM == v.OFACCT_STATUS) || {};
          v.OFACCT_STATUS_TEXT = temp.DICT_ITEM_NAME || '';
      })

      // 所有的可以开通的基金公司
      that.$storage.setSession(that.$definecfg.ALL_FUND_COMPANY, fundsData);
      // 已开通的公司

      that.oppBusiData.hasFundsData = hasFundsData;
      that.oppBusiData.youngFlag = customerInfo.AGE < 16 ? "1" : "0";
      that.oppBusiData.SZ_SH_FUND = oppService.getSysCommonParamsFromCacheObjs('SZ_SH_FUND');
      that.oppBusiData.CUACCT_CODE = customerInfo.CUACCT_CODE;
      that.oppBusiData.fundsData = fundsData;
      
      that.isLoading = false;

        that.initData(canJump);
      })
  },
  methods: {
    initData(canJump) {
      let that = this;
      that.hasFundOpenData = that.oppBusiData.hasFundsData;
      if (that.historyData && !_.isEmpty(that.historyData.FUNDACCT_INFO_LIST)) {
        let allFundCompany = that.oppBusiData.fundsData;
        _.each(that.historyData.FUNDACCT_INFO_LIST, function(item) {
          let moduleFundInfo = _.find(allFundCompany, v => {
            return v.ORG_CODE == item.ORG_CODE
          })
          if(moduleFundInfo) {
            that.fundList.push({
              showValue: moduleFundInfo.ORG_NAME,
              ORG_CODE: moduleFundInfo.ORG_CODE,
              TA_CODE: moduleFundInfo.ORG_CODE,
              ORG_NAME: moduleFundInfo.ORG_NAME,
              BILL_MAIL_TYPE: moduleFundInfo.BILL_MAIL_TYPE || that.oppBusiData.busiCommonParams.DEFAULT_BILL_MAIL_TYPE,
              DIV_METHOD: (moduleFundInfo.DIV_METHOD || that.oppBusiData.busiCommonParams.DEFAULT_DIV_METHOD)
            })
          } 
        })
      } else {
        // 不是第一次进才进基金公司选择页，判断是否第一次进的条件是是否请求了全部基金公司
        canJump && that.addFund(true);
      }
    },
    showMore() {
      let dataList = this.oppBusiData.hasFundsData;
      let itemObjList = [{
        prop: "OFACCT_FNAME",
        label: '基金公司'
      }, {
        prop: "OFACCT",
        label: '基金账户'
      },{
        prop: "OFACCT_STATUS_TEXT",
        label: '账户状态'
      }];
      this.$router.goModule("dataList", { 
        dataList: dataList,
        itemObjList: itemObjList
      });
    },
    // firstIn: 判断是否第一次进模块，第一次进，在基金公司选择模块则不展示返回按钮
    // 现在要求第一次进进基金公司选择模块，否则直接进选择结果页，也就是不跳转
    addFund(firstIn) {
      let that = this;
      if (that.fundList.length > 0) {
        that.$storage.setSession(that.$definecfg.FUND_LIST, that.fundList);
      } else {
        that.$storage.setSession(that.$definecfg.FUND_LIST, []);
      }
      that.$router.goModule("selectFundModule", { firstIn: firstIn || false });
    },
    deleteFund(taCode) {
      let that = this;
      let index = _.findIndex(that.fundList, function(o) {
        return o.TA_CODE == taCode
      });
      if (index > -1) {
        that.fundList.splice(index, 1);
        that.$storage.setSession(that.$definecfg.FUND_LIST, []);
      }
    },
    getFundData(custCode, customerInfo){
      return Promise.all([
        // 已经开通的基金公司
        this.$syscfg.K_Request("Y3000038", {CUST_CODE: custCode}),
        // 所有的基金公司列表
        this.$syscfg.K_Request("Y1001888", {ORG_TYPE: "3", "NEED_CHECK": "1"}),
        dict.getDictData("OFACCT_STATUS"),
        // 中登实名关注对象
        this.$syscfg.K_Request("YG210056", { 
            ID_TYPE: customerInfo.ID_TYPE,
            ID_CODE: customerInfo.ID_CODE
        }),
      ])

    },
    pageActivated: (_this) => {
      let that = _this.$refs.V0052_openBizFundAcctNode;
      if(!_.isEmpty(that)) {
        if(!_.isEmpty(that.$route.query) && that.$route.query.skipFlag == '1') {
          that.$emit('on-next-click');
          return;
        }
        let sessionFundList = that.$storage.getJsonSession(that.$definecfg.FUND_LIST) || [];
        // 遍历增加基金机构o
        _.each(sessionFundList, (orgItem, index) => {
          that.fundList.push({
            showValue: orgItem.ORG_NAME,
            ORG_CODE: orgItem.ORG_CODE,
            TA_CODE: orgItem.ORG_CODE,
            BILL_MAIL_TYPE: orgItem.BILL_MAIL_TYPE || that.oppBusiData.busiCommonParams.DEFAULT_BILL_MAIL_TYPE,
            DIV_METHOD: "1"
          })
        })
        that.fundList = _.uniqBy(that.fundList, 'TA_CODE');
      }
    },
    validate(_this) {
        let that = _this.$refs.V0052_openBizFundAcctNode;
        // if (_.isEmpty(that.fundList)) {
        //     that.$blMethod.showMsgBox(that, "请至少选择一个需要开通的基金公司");
        //     return false;
        // }
        _this.oppBusiData.syscodesFlag = false;
        let allFundCompany = that.$storage.getJsonSession(that.$definecfg.ALL_FUND_COMPANY);
        if (!_this.oppBusiData.syscodesFlag) {
          _.each(that.fundList, function (item) {
            let moduleFundInfo = _.find(allFundCompany, v => {
              return v.ORG_CODE == item.TA_CODE
            })
            if (moduleFundInfo && moduleFundInfo.SYS_CODES && _.indexOf(moduleFundInfo.SYS_CODES.split(","), "40") != -1) {
              _this.oppBusiData.syscodesFlag = true;
            }
          })
        }
        return true;
    },
    beforeSave(_this, params) {
      _this.loading = true;
      let that = _this.$refs.V0052_openBizFundAcctNode,
          FUNDACCT_INFO_LIST = [],
          //基金账户类别，
          // 1.仅开通上海和深圳（98，99）则为0，
          // 2.仅开通非上海和深圳（非98，99）为1，
          // 3.既开通98，99又开通非98和99的为2
           FUNDACCT_TYPE = "",
           tempAcctType_0 = "",
           tempAcctType_1 = "",
           selectAllVal = "";
      let busiCommonParamsArray = {};
      _.each(_this.$storage.getJsonSession(_this.$definecfg.BUSI_COMM_PARAM), function (item) {
        busiCommonParamsArray[item.PARAM_CODE] = item;
      })
      _.each(that.fundList, function(item) {
        let formData = {
          OF_ACCT: "",
          TA_CODE: item.TA_CODE,
          BILL_MAIL_TYPE: item.BILL_MAIL_TYPE,
          DIV_METHOD: item.DIV_METHOD
        }
        if (formData.TA_CODE) {
          let allFundCompany = that.$storage.getJsonSession(that.$definecfg.ALL_FUND_COMPANY);
          if (_.indexOf(that.oppBusiData.SZ_SH_FUND, formData.TA_CODE) > -1) {
              tempAcctType_0 = "0"
          } else {
              tempAcctType_1 = "1";
          }
          let moduleFundInfo = _.find(allFundCompany, v => {
            return v.ORG_CODE == formData.TA_CODE
          })
          FUNDACCT_INFO_LIST.push({
            BILL_MAIL_TYPE: busiCommonParamsArray["DEFAULT_BILL_MAIL_TYPE"].PARAM_VALUE,//邮寄类型类型不显示时，取业务公共参数的默认值（DEFAULT_BILL_MAIL_TYPE）
            DIV_METHOD: busiCommonParamsArray["DEFAULT_DIV_METHOD"].PARAM_VALUE,//分红方式不显示时，取业务公共参数的默认值（DEFAULT_DIV_METHOD）
            ORG_SPELL: moduleFundInfo && moduleFundInfo.ORG_SPELL && moduleFundInfo.ORG_SPELL[0].toLowerCase(),
            TA_CODE_SNO: moduleFundInfo.CHECK_OBJ && moduleFundInfo.CHECK_OBJ.TA_CODE_SNO || "",
            SYS_CODES: moduleFundInfo.SYS_CODES || "",
            SPEC_ORG_CODE: moduleFundInfo.SPEC_ORG_CODE || "",
            ORG_PREFIX: moduleFundInfo.ORG_PREFIX || "",
            TA_CODE_TEXT: moduleFundInfo ? moduleFundInfo.ORG_NAME : "",
            TA_ORG_CLS: moduleFundInfo.CHECK_OBJ && moduleFundInfo.CHECK_OBJ.TA_ORG_CLS || "",    //用来储存基金公司类型，是否是迁移的
            ORG_CODE: formData.TA_CODE,
            TA_CODE: formData.TA_CODE,
          })
        }
      })
      FUNDACCT_TYPE = (tempAcctType_0 !== "" && tempAcctType_1 !== "") ? "2" : (tempAcctType_0 || tempAcctType_1);
      // let returnObj = {
      //   SELECT_ALL_VAL: selectAllVal,//是否勾选【全选】基金公司，1：勾选，否则未勾选
      //   FUNDACCT_TYPE: FUNDACCT_TYPE,
      //   FUNDACCT_INFO_LIST: FUNDACCT_INFO_LIST,
      //   SELECT_ORG_NUM: that.fundList.length + "",
      //   syscodesFlag: _this.oppBusiData.syscodesFlag ? 1 : 0,
      //   SYNC_OPEN_FUND_AGMT: "" //银河需要自动开通基金自动开户协议
      // }
      // _.each(FUNDACCT_INFO_LIST, v => {
      //     v.TA_CODE  == "0098" ?   v.SZ_TRDACCT = v.TRDACCT :  v.SZ_TRDACCT="";
      //     v.TA_CODE  == "0099" ?   v.SH_TRDACCT = v.TRDACCT :  v.SH_TRDACCT="";
      //     v.YOUNG_FLAG = that.oppBusiData.youngFlag;//未成年标志
      //     v.YOUNG_ID = "";
      //     if(v.DIV_METHOD == null ) v.DIV_METHOD = "1";
      //     if(v.BILL_MAIL_TYPE == null ) v.BILL_MAIL_TYPE = "1";
      //     v.CUACCT_CODE = that.oppBusiData.CUACCT_CODE;
      //     v.OFACCT_FNAME = v.TA_CODE_TEXT;
      //   })
      // let customerInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO);
      // let resultObj = _.extend({}, returnObj, {
      //       CHK_FUNC_CODE: '353000070',
      //       CHK_INT_ORG: '0',
      //       CHK_LBM_IDS: 'L2100302',
      //       EUSER_STATUS: _this.oppBusiData.euserStatus,
      //       PROF_INVESTOR_SOURCE: customerInfo.PROF_INVESTOR_SOURCE
      //   })
      let ACCT_INFO = Object.assign(params.ACCT_INFO, {
        FUNDACCT_INFO_LIST
      }) 
      let resultObj = {
        FUNDACCT_FLAG:  _this.oppBusiData.syscodesFlag ? 1 : 0,  //1、需要签署203电子协议、201电子约定书 0 不需要签
        SELECT_ALL_VAL: selectAllVal,  //是否全选基金公司  
        // // 以下为长城证券需采集影像表单回填数据  注：银河复用  中登无深市证券账户选择加挂股转账户  需采集证券账户开立申请表
        IS_OPEN_FUNDACCT_FLAG : FUNDACCT_INFO_LIST.length > 0 ? "1" : "0",
        SELECT_ORG_NUM: FUNDACCT_INFO_LIST.length, // 选择的基金公司数量 
        // CC_SZA_TRDACCT: stockInfo.SZA_TRDACCT,
        // CC_SZB_TRDACCT: stockInfo.SZB_TRDACCT,
        // CC_SHA_TRDACCT: stockInfo.SHA_TRDACCT,
        // CC_SHB_TRDACCT: stockInfo.SHB_TRDACCT,
        // CC_GZA_TRDACCT: stockInfo.GZA_TRDACCT,
        // CC_GZB_TRDACCT: stockInfo.GZB_TRDACCT,
        // CC_SJJ_TRDACCT: stockInfo.SJJ_TRDACCT,
        // CC_HJJ_TRDACCT: stockInfo.HJJ_TRDACCT,
        // //以上为长城证券需采集影像表单回填数据
        SYNC_OPEN_FUND_AGMT:  "1", //银河可自动开通基金自动开户协议设置，开户默认开通
        ACCT_INFO,
        FUNDACCT_INFO_LIST
      }
      
      Object.assign(params, resultObj);
    }
  }
}
</script>
<style lang="less">
.V0052-addFund{
  font-family: Alibaba PuHuiTi;
  margin-left: 46px;
  margin-right: 62px;
  .fund-list {
    .title {
        height: 30px;
        line-height: 30px;
        font-size: 24px;
        font-weight: 700;
        display: flex;
        align-items: center;
        margin-top: 25px;
        margin-bottom: 25px;
    }
    .logo {
        width: 10px;
        height: 30px;
        background-color: #3b6aff;
        border-radius: 20px;
    }
    .titleContent {
        width: 1127px;
        padding-left: 10px;
        font-family: Alibaba PuHuiTi;
        font-weight: 500;
        color: #3b6aff;
        font-size: 26px;
    }
    .lookOpened {
        width: 200px;
        height: 50px;
        .el-button {
            background-color: #f7f7fa;
            border-radius: 4px;
            font-family: Alibaba PuHuiTi;
            color: #666666;
            font-size: 24px;
            width: 252px;
            height: 60px;
            .show-more {
                position: relative;
                top: -4px;
            }
        }
    }
    .content {
      width: 575px;
      margin: 0 auto;
      margin-top: 136px;
      .tipImg {
        margin-left: 250px;
      }
      .addFundContent {
        width: 527px;
        height: 140px;
        padding-left: 25px;
        background: #fafafa;
        border: 1px solid #bfbfbf;
        border-radius: 11px;
        line-height: 140px;
        font-size: 24px;
        color: #215bdb;
        text-align: center;
        background-image: url('../../../../icons/yinheVTM/icon-bank-open.svg');
        background-repeat: no-repeat;
        background-position-x: 185px;
        background-position-y: 58px;
      }
    }
    .fund-check-list {
      width: 1402px;
      margin-top: 50px;
      max-height: 624px;
      overflow: auto;
      .fund-item {
        width: 1402px;
        height: 128px;
        margin-bottom: 30px;
        display: flex;
        align-items: center;

        background-color: #f7f7fa;
        border-radius: 4px;
        .fund-label {
          width: 260px;
          text-align: center;
          font-size: 24px;
          font-family: Alibaba PuHuiTi;
          color: #252525;
        }
        .el-input {
          .el-input__inner {
            width: 348px;
            height: 54px;
            font-size: 24px;
            font-family: Alibaba PuHuiTi;
            color: #777777;
            border: 1px solid #8d8d8d;
            background-color: #edf0f8;
          }
        }
      }
    }
    .add-box {
      width: 1402px;
      height: 72px;
      .add-btn {
        width: 1402px;
        height: 72px;
        background-color: #f8faff;
        border: 1px solid #bed0ff;
        border-radius: 4px;
        font-size: 26px;
        color: #3b6aff;
        span {
          padding-left: 14px;
          display: inline-block;
        }
      }
      .add-icon {
        background: url("~@icons/yinheVTM/icon-bank-open.svg");
        background-size: cover;
      }
      .add-icon::before {
        content: "重";
        font-size: 30px;
        visibility: hidden;
      }
    }
  }

  .el-dialog {
      .el-dialog__title {
          font-size: 32px;
      }
      .el-table {
          font-size: 22px;
      }
  }
}
</style>