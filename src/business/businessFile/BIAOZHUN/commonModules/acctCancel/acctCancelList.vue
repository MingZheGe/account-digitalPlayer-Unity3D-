// 客户销户选择
<template>
    <div class="accountMerge">
        <div class="title">
            <div class="text-wrap">
            <div class="logo"></div>
            <div class="titleContent">
                您有以下账户，本次将为您全部注销
            </div>
            </div>
        </div>
        <div class="accountList">
            <div class="checkbox-group">
                <div v-for="(acctObj, index) in acctList" :key="index" class="checkbox">
                    <div class="fold-checkbox" v-if="acctObj.accountList.length <= 4">
                        <div class="ymt-image"></div>
                        <div class="ymtcode"><b>{{acctObj.name}}</b></div>
                        <div class="trdacct">
                        <span class="trdacct-box" v-for="(acct, index1) in acctObj.accountList" :key="index1">{{ (acct.ACCT_TYPE_TEXT ? (acct.ACCT_TYPE_TEXT + ":") : "") + acct.ACCT}}</span>
                        </div>
                    </div>
                    <div class="unfold-checkbox" v-else>
                        <div class="ymt-image"></div>
                        <div class="text-box">
                        <div class="ymtcode"><b>{{acctObj.name}}</b></div>
                        <div class="trdacct">
                            <span class="trdacct-box" v-for="(acct, index1) in acctObj.accountList" :key="index1">{{(acct.ACCT_TYPE_TEXT ? (acct.ACCT_TYPE_TEXT + ":") : "") + acct.ACCT}}</span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import busiCommonList from '../../../../../components/common/busiCommonList'
import oppService from '../../../../../service/opp-service'
import dict from '../../../../../tools/dict'
import des from '../../../../../tools/libs/des'
import custService from '../../../../../service/cust-service'

export default {
    data() {
        return {
          showAsset: false,
          FUND_PWD: '',
        }
    },
    /*
        acctList: [{
            name: '客户号',
            accountList: [{ ACCT: "", ACCT_TYPE: ""}]
        }]
    */
    props: ["acctList"],
    components:{
    },
    created() {
    },
    mounted() {
    },
    computed: {
        
    },
    methods: {
        myAsset() {
            this.showAsset = true;
        },
        close() {
            this.showAsset = false;
        },
        //框架钩子函数
        pageActivated(_this) {

        },
        validate(_this) {
            
        },
    }
}
</script>

<style lang="less">
.accountMerge {
  .title {
      height: 26px;
      font-size: 26px;
      font-weight: 700;
      display: flex;
      margin-top: 20px;
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
  .accountList {
    margin-top: 40px;
    .checkbox-group{
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      .checkbox{
        width: 100%;
        min-height:125px;
        height: auto;
        background-color:#ffffff;
        border:1px solid;
        border-color:#eaeaea;
        border-radius:4px;
        box-shadow:0px 3px 18px rgba(0, 0, 0, 0.03);
        box-sizing: border-box;
        margin-right: 0;
        margin-bottom: 20px;
        background-repeat: no-repeat;
        background-position: right bottom;
        background-size: 45px 45px;
        .fold-checkbox{
          width: 100%;
          height: 125px;
          display: flex;
          padding-left: 50px;
          align-items: center;
          .ymt-image{
            height: 96px;
            width: 96px;
            background: url("../../../../../images/icon-bank-rmb-uncheck.png");
          }
          .ymtcode{
            font-size: 26px;
            color: #252525;
            width: 200px;
            margin-left: 30px;
          }
          .trdacct{
            padding-left: 30px;
            border-left:1px solid;  
            border-color:#dedede;
            color: #666666;
            font-size: 22px;
            height: 60px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            .trdacct-box{
              width: 230px;
              text-align: center;
            }
          }
          .more-trdacct{
            font-size: 26px;
            color: #666666;
          }
        }
        .unfold-checkbox{
          width: 100%;
          display: flex;
          padding-left: 50px;
          .ymt-image{
            height: 96px;
            width: 96px;
            margin-top: 14.5px;
            background: url("../../../../../images/icon-bank-rmb-uncheck.png");
          }
          .text-box{
            width: 1150px;
            margin-left: 30px;
            display: flex;
            align-self: center;
            flex-direction: column;
            margin-top: 53px;
            margin-bottom: 36px;
            .ymtcode{
              font-size: 26px;
              color: #252525;
              width: 200px;
              margin-bottom: 20px;
            }
            .trdacct{
              color: #666666;
              font-size: 22px;
              display: flex;
              align-items: center;
              padding-top: 12px;
              border-top:1px solid;
              border-color:#dedede;
              flex-wrap: wrap;
              .trdacct-box{
                width: 230px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }
          .more-trdacct{
            font-size: 26px;
            color: #666666;
            margin-top: 49.5px;
            margin-left: 10px;
          }
        }
        &.is-checked{
          border-color:#3b6aff;
          background-color:#ebf0ff;
          background-image: url('../../../../../icons/common/radio-mark-selected.svg');
          .fold-checkbox{
            .ymt-image{
              background: url("../../../../../images/icon-bank-rmb.png");
            }
          }
          .unfold-checkbox{
            .ymt-image{
              background: url("../../../../../images/icon-bank-rmb.png");
            }
          }
        }
        &.is-disabled{
          background: #f5f5f5;
          background-image:none;
          border-color:#eaeaea;
          .fold-checkbox{
            .ymt-image{
              background: url("../../../../../images/icon-bank-rmb.png");
            }
            .ymtcode{
              color:#999999;
            }
            .trdacct{
              color:#999999;
            }
          }
          .unfold-checkbox{
            .ymt-image{
              background: url("../../../../../images/icon-bank-rmb.png");
            }
            .text-box{
              .ymtcode{
                color:#999999;
              }
              .trdacct{
                color:#999999;
              }
            }
          }
        }
      }
    }
  }
}
</style>
