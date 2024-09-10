<template>
  <div class='cust-360'>
    <div class='mask-back'>
      <div class="close" @click="close360"></div> 
      <div class='cust360-content'>
        <div class='cust360-basicInfo group'>
          <div class="title">
            <div class="text-wrap">
            <div class="logo"></div>
            <div class="titleContent">
                客户信息
            </div>
            </div>
          </div>
          <div class='basicItem' v-for='(item,itemKey) in custBasicInfo' :key='itemKey'>
            <div class="itemTitle">{{item.title}}</div>
            <div class="itemValue" :class="item.longField ? 'longField' : ''">{{item.value}}</div>
          </div>
        </div>
        <div class='cust360-accountInfo group'>
          <div class="title">
            <div class="text-wrap">
            <div class="logo"></div>
            <div class="titleContent">
                系统内账户信息
            </div>
            </div>
          </div>
          <div class="myTable"  v-for="(infoTable, key) in custTable" :key='key'>
            <div class="tableTitle"  v-show="isShowModules(infoTable)">{{infoTable.title}}</div>
            <div class="tableScrollBox"></div>
            <div class="sys-table-box table-box">
              <el-table v-show="isShowModules(infoTable)" :data="infoTable.tableData" border  header-row-class-name="headerRow">
                <el-table-column  align="center" v-for="(column, index) in infoTable.tableColumns" :prop="column.prop" :label="column.label" :key="column.prop+index" :width="column.width"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dict from "@/tools/dict"
import csdcSevice from "@/service/csdc-service"
import org from '@/tools/org'
import date from '../../tools/date'

export default {
  data () {
    return {
      //客户信息
      custBasicInfo:{
        CUST_CODE:{
          title: "客户代码",
          value:""
        },
        CUST_FNAME:{
          title: "客户全称",
          value:""
        },
        ID_TYPE:{
          title: "证件类型",
          value:""
        },
        ID_CODE:{
          title: "证件号码",
          value:""
        },
        OPEN_DATE:{
          title:"开户日期",
          value:""
        },
        USER_TYPE:{
          title:"用户类型",
          value:""
        },
        CITIZENSHIP:{
          title:"国籍",
          value:""
        },
        MOBILE_TEL:{
          title:"手机号码",
          value:""
        },
        TEL:{
          title:"固定电话",
          value:""
        },
        ADDRESS:{
          title:"联系地址",
          value:"",
          longField: true
        },
      },
      //系统内 客户账户信息
      custTable:{
        // 资金账户（对应客户360的“客户信息-资产账号”）：资金账号（含主、辅、信用、期权）、账号属性（对应客户360的“资产账号属性”）、开户日期、销户日期、账号状态（对应客户360的“资产账号状态”）、货币（对应客户360的货币代码）、银行名称、银行账户、签约状态、主资金账号；
        cuacctInfo:{
          title:"资金账户",
          tableData:[],
          tableColumns:[{
            prop:"CUACCT_CODE",
            label:"资金账号",
            width:202,
          },{
            prop:"CUACCT_ATTR_TEXT",
            label:"资金账号属性",
            dicts:"CUACCT_ATTR",
            width:250
          },{
            prop:"OPEN_DATE",
            label:"开户日期",
            width:250
          },
          {
            prop:"CUACCT_STATUS_TEXT",
            label:"资金账号状态",
            dicts:"CUACCT_STATUS",
            width:250,
          },{
            prop:"MAIN_FLAG_TEXT",
            label:"主资金账号",
            dicts:"YES_NO",
          }]
        },
        bankInfo: {
          title:"银证账户",
          tableData:[],
          tableColumns:[{
            prop:"CUACCT_CODE",
            label:"资金账号",
            width:202,
          },{
            prop:"EXT_ORG_NAME",
            label:"银行名称",
            width:205,
          },{
            prop:"CURRENCY_TEXT",
            label:"货币类型",
            dicts:"CURRENCY"
          },{
            prop:"CONTRACT_STATUS_TEXT",
            label:"签约状态",
            dicts:"CONTRACT_STATUS",
            width:120,
          },{
            prop:"BANK_ACCT",
            label:"银行账户",
            width:230,
          },{
            prop:"BDMF_ACCT",
            label:"存管账户",
            width:230,
          }]
        },
        // 证券账户（对应360的证券账户）：市场板块、证券账户、账户类别、账户状态、指定状态、回购指定状态、交易单元、开户日期、销户日期；
        stockInfo: {
          title:"证券账户",
          tableData:[],
          tableColumns:[{
            prop:"STKBD_TEXT",
            label:"交易板块",
            dicts:"STKBD"
          },{
            prop:"TRDACCT",
            label:"证券账户"
          },{
            prop:"TRDACCT_EXCLS_TEXT",
            label:"账户类别",
            dicts:"TRDACCT_EXCLS"
          },{
            prop:"TRDACCT_STATUS_TEXT",
            label:"账户状态",
            dicts:"TRDACCT_STATUS"
          },{
            prop:"TREG_STATUS_TEXT",
            label:"指定状态",
            dicts:"TREG_STATUS"
          },{
            prop:"STKPBU",
            label:"交易单元",
            width:205,
          },{
            prop:"OPEN_DATE",
            label:"开户日期",
            width:205,
          },
          // {
          //   prop:"CLOSE_DATE",
          //   label:"销户日期"
          // }
          ]
        },
        // 期权账户（对应客户360的股票期权-合约账户）：市场板块、证券账户、合约账户、证券账户状态、合约账户状态、申报状态、合约账户级别、
        // 指定状态、回购指定状态、交易单元、开户日期、销户日期；（客户没有期权账户时，隐藏此栏）
        ggqqInfo: {
          title:"期权账户",
          tableData:[],
          tableColumns:[{
              prop:"STKBD_TEXT",
              label:"交易板块",
              dicts:"STKBD",
              width:150,
            },{
              prop:"TRDACCT",
              label:"证券账户",
              width:200,
            },{
              prop:"OPT_TRDACCT",
              label:"期权合约账户",
              width:200,
            },{
              prop:"TRDACCT_STATUS_TEXT",
              label:"合约账户状态",
              dicts:"SUBACCT_STATUS",
              width:150,
            },{
              prop:"TREG_STATUS_TEXT",
              label:"指定状态",
              dicts:"TREG_STATUS",
              width:150,
            },{
              prop:"STKPBU",
              label:"交易单元",
            },{
              prop:"OPEN_DATE",
              label:"开户日期",
              width:150,
            },
            // {
            //   prop:"CLOSE_DATE",
            //   label:"销户日期"
            // }
            ]
          },
        // 基金账户（360的基金账户OTC）：登记机构（代码-名称）、登记账号、基金交易账户、账户状态、开户日期；（客户没有基金账户时，隐藏此栏）
        fundInfo: {
          title:"基金账户",
          tableData:[],
          tableColumns:[
          {
            prop:"TA_NAME",
            label:"基金公司",
            width: 250
          },{
            prop:"OFACCT_NAME",
            label:"基金账户名称",
            width: 250
          },{
            prop:"OF_TRDACCT",
            label:"基金交易账户",
            width: 240
          },{
            prop:"OFACCT",
            label:"基金账户",
            width:230
          },{
            prop:"OFACCT_STATUS_TEXT",
            label:"账户状态",
            dicts:"OFACCT_STATUS"
          },{
            prop:"OPEN_DATE",
            label:"开户日期"
          }]
        },
      },
    }
  },
  components: {
  
  },
  computed: {
    custInfo(){
      return this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO) || {};
    },
   
  },
  props: {
    title: String,
    leftOptions: Object,
    rightOptions: Object,
    useNavStep: Boolean,
    busiName: String
  },
  methods: {
    //没有数据的时候只隐藏期权跟基金
    isShowModules(table){
      return table.tableData.length || (["期权账户","基金账户"].indexOf(table.title) == -1 && !table.tableData.length)
    },
    close360(){
      this.$emit("close360")
    },
    initData(){
      //加载客户基础信息
      this.loadCustBasicInfo();
      //内部客户，先加载系统内信息
      this.loadCustTable();
    
 
    },
    loadCustBasicInfo(){
      //加载客户基础信息
      //翻译字典
      return dict.transformDict(this.custInfo, ["ID_TYPE","CITIZENSHIP","USER_TYPE"]).then(res=>{
        for(let key in this.custBasicInfo){
          if(key == "ID_TYPE"){
            this.custBasicInfo[key].value = res.ID_TYPE_TEXT;
          }else if(key == "CITIZENSHIP") {
            this.custBasicInfo[key].value = res.CITIZENSHIP_TEXT;
          }else if(key == "USER_TYPE") {
            this.custBasicInfo[key].value = res.USER_TYPE_TEXT;
          }else{
            this.custBasicInfo[key].value = res[key];
          }
        }
      })  
    },
    //加载系统内信息
    loadCustTable(){
      let custInfo = this.custInfo,
      that = this,
      serviceList = [{
        //资金账户
        service:'Y3000045',
        F_FUNCTION:'980105012',
        p_gnbh:'980105012',
        QUERY_MODE:'QUERY',
        resultKey: 'CUACCT_INFO'
      },{
        //银证账户
        service:'Y3000045',
        F_FUNCTION:'980105015',
        p_gnbh:'980105015',
        QUERY_MODE:'QUERY',
        funcid:'L1262562',
        resultKey: 'BANK_INFO'
      },{
        //证券账户
        service:'Y3000045',
        F_FUNCTION:'980105013',
        p_gnbh:'980105013',
        QUERY_MODE:'QUERY',
        resultKey: 'SYS_ACCT_INFO'
      },{
        //基金账户
        service:'Y3000045',
        F_FUNCTION:'980105014',
        p_gnbh:'980105014',
        QUERY_MODE:'QUERY',
        resultKey: 'FUND_ACCT_OTC_INFO'
      }],
      params = {
        CUST_CODE: custInfo.CUST_CODE,
        USER_CODE: custInfo.CUST_CODE,
        CUSTID: custInfo.CUST_CODE,
        SYS_CUST_NO: custInfo.CUST_CODE,
        BEGINDATE: date.formatDate(new Date(), "yyyyMMdd"),
        ENDDATE: date.formatDate(new Date(), "yyyyMMdd"),
        RELADATE: '19000101',
        DATASOURCE: '0',
        F_CUST_ORG_CODE: custInfo.INT_ORG,
        SINGLEFLAG: custInfo.USER_TYPE == "0" ? "0" : "1"
      }
      _.each(serviceList, obj => {
        obj = _.extend(obj,params);
      });
      serviceList.push({
        //期权合约账户
        service:'Y3300204',
        bex_codes:'GGQ_GeneralQuery',
        F_FUNCTION:'850090204',
        p_gnbh:'850090204',
        QUERY_MODE:'QUERY',
        NOT_SERVICE_TRANS: true,
        menuId: "850090100",
        PAGE_RECNUM: "1",
        page: 1,
        pagecount: 999999999,
        rows: 999999999,
        CUST_CODE: custInfo.CUST_CODE,
        USER_CODE: custInfo.CUST_CODE,
        resultKey: 'STOCK_OPTION_ACCT_INFO'
      });
      return this.$syscfg.K_Request("W0000351", {
        serviceList:  serviceList
        }).then(res=>{
        if(res.Code == "0"){
          let data = res.Data[0];

          that.custTable.cuacctInfo.tableData =  data.CUACCT_INFO;
          that.custTable.bankInfo.tableData =  data.BANK_INFO;
          that.custTable.stockInfo.tableData = data.SYS_ACCT_INFO|| [];//系统内证券账户
          that.custTable.ggqqInfo.tableData = data.STOCK_OPTION_ACCT_INFO || [];//系统内期权账户
          
          //翻译数据里的字典
          that.transformDict(that.custTable.cuacctInfo);
          that.transformDict(that.custTable.bankInfo);
          that.transformDict(that.custTable.stockInfo);
          that.transformDict(that.custTable.ggqqInfo);
          
          //翻译基金公司名称
          let orgList = that.$storage.getJsonSession(that.$definecfg.OrgData) || [];
          let allFundName = _.filter(orgList, function (obj) {return obj.ORG_TYPE === '3'});
          if(!_.isEmpty(data.FUND_ACCT_OTC_INFO)){
            _.each(data.FUND_ACCT_OTC_INFO,v => {
              v.TA_NAME = that.viewFundOrgInfo(allFundName,v.TA_CODE);
            })
          }
          _.each(data.FUND_ACCT_OTC_INFO, v => {
              if (v.TA_CODE.length == 1) {
                  v.TA_CODE = "000" + v.TA_CODE
              } else if (v.TA_CODE.length == 2) {
                  v.TA_CODE = "00" + v.TA_CODE
              } else if (v.TA_CODE.length == 3) {
                  v.TA_CODE = "0" + v.TA_CODE
              }
          })
          that.custTable.fundInfo.tableData = data.FUND_ACCT_OTC_INFO|| [];//系统内基金账户
          that.transformDict(that.custTable.fundInfo);
        }else{
          throw res.MSg;
        }
      }).catch(err=>{
        this.alert("信息查询失败"+err.toString());
      })
    },
    //翻译字典
    transformDict(data){
      if(!data){
        console.info("data不能为空",data)
        return;
      }
      let dictKeys = [];
      _.forEach(data.tableColumns, item=>{
        let fieldId = item.prop.replace("_TEXT","");
        let dictKey = item.targetDict || item.dicts;
        if(dictKey){
          dictKeys.push({
            [fieldId]:dictKey
          })
        }
      })
      let that=this;   
      return dict.transformDict(data.tableData, dictKeys).then(function (newData) {
        if(data.title === "银证账户"){
          return org.getOrgDataByType("1").then(allBankData=>{
            _.forEach(newData, v=>{
              //翻译银行名称    
              let orgItem = _.find(allBankData, (orgObj)=>{return orgObj.ORG_CODE == v.EXT_ORG}) 
              v.EXT_ORG_NAME =  orgItem && orgItem.ORG_NAME;
            })
            data.tableData = newData;
          })
        }else if(data.title === "基金账户"){
          return org.getOrgDataByType("3").then(allFundData => {
            _.forEach(newData, v=>{
              let fundObj = _.find(allFundData, (fundItem) => {
                return fundItem.ORG_CODE == v.TA_CODE
              })
              v.TA_NAME = (fundObj && fundObj.ORG_NAME) || "";
            })
            data.tableData = newData;
          })
        }else{
          data.tableData = newData;
        }
      });
    },
    viewFundOrgInfo: function (allFundName,orgCode) {
      let that = this
      var orgObj = _.find(allFundName, function (data) {
          return data.ORG_CODE == that.transOrgCode(orgCode);
      });
      return (orgObj && orgObj.ORG_NAME) || orgCode;
    },
    transOrgCode: function (orgCode) {
        return that.$basecfg.isWin ? ("0000" + orgCode).substr(-4) : parseInt(orgCode) + "";
    },
  },
  created(){
    this.initData()
  },
  mounted(){
  }
}
</script>

<style lang="less">
@import "~@/styles/less/variable.less";
.cust-360 {
  .mask-back{
    position:fixed ;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(9,7,10,.5);
    // opacity: 0.8;
    z-index: 3002;
    display: block;
    justify-content: center;
    // overflow: scroll;
    .cust360-content{
      position: relative;
      display: block;
      height: 850px;
      background: #FFFFFF;
      border-radius: 10px;
      margin: 120px 310px 70px;
      flex-direction: column;
      overflow: auto;
      .group{
        margin: 0 40px 64px 50px; 
        // flex-direction: column;
        display: block;
        height: auto;
        // flex-wrap: wrap;
        .title {
          height: 26px;
          font-size: 26px;
          font-weight: 700;
          display: flex;
          margin-top: 50px;
          margin-bottom: 30px;
          width: 100%;
          .text-wrap{
            display: flex;
            width: 50%;
            justify-content: flex-start;
            .logo {
                width: 10px;
                height: 26px;
                border-radius:20px;
                background-color: #3b6aff;
            }
            .titleContent {
                padding-left: 12px;
                color: #3b6aff;
                font-weight: 700;
            }
          }
        }
        .myTable{
          position: relative;
          .tableScrollBox{
            height: ~"calc(100% - 40px)";
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 102;
            // background: red;
          }
          .el-table{
            z-index: 100;/* IE平台饿了么table组件bug，如果不设置z-index,会被重置为1，导致页面滑动卡顿*/
          }
          .tableTitle{
            font-size: 18px;
            font-weight: bold;
            color: #4A4E53;
            line-height: 30px;
            margin: 10px 0 20px 0;
            &::before{
              content: "·";
              font-size: 18px;
              line-height: 18px;
              font-weight: bold;
            }
          }
        }
      }
      .cust360-basicInfo{
        // flex-direction: row;
        // flex-wrap: wrap;
        .basicItem{
          display: inline-block;
          padding-left: 30px;
        }
        display: block;
        .itemTitle{
          width: 89px;
          height: 19px;
          font-size: 20px;
          color: #808992;
          line-height: 30px;
          display: inline-block;
          margin: 20px 0 0;
        }
        .itemValue{
          width: 260px;
          height: 19px;
          font-size: 20px;
          font-family: Source Han Sans SC;
          font-weight: 500;
          color: #232323;
          line-height: 30px;
          display: inline-block;
          margin: 20px 0 0;
          &.longField{
            width: 1000px;
          }
        }
      }
      .myTable .el-table .el-table__body-wrapper{
        -ms-overflow-style: scrollbar;
      }
      .myTable .el-table .el-table__header-wrapper .el-table__header .headerRow th{
        background: #f7f7fa;;
        border: none;
        font-size: 18px;
        font-weight: 500;
        color: #666666;;
      }
      .el-table--enable-row-transition .el-table__body td {
        font-size: 18px;
        font-weight: 500;
        border: none;
        color: #252525;
        line-height: 48px;
        background: white;
      }
      .el-table.el-table--fit{
        border:1px solid;
        border-color:#d9d9d9;
        border-radius:8px;
        box-shadow:0px 3px 22px rgba(0, 0, 0, 0.03);
      }
    }
    .close{
      position: absolute;
      top: 65px;
      right: 252px;
      width: 70px;
      height: 67px;
      border-radius: 70px;
      border: 1px solid white;
      &::before{
        content: "x";
        font-size: 37px;
        color: white;
        line-height: 45px;
        position: absolute;
        left: 26px;
        top: 7px;
      }
    }
  }
}
</style>