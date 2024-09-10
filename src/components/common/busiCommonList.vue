业务列表组件 前面显示板块 后面显示证券账户

  A股账户 深A:A0990-正常  深A A00333-异常
  B股账户 深B:B0990-正常  深A B00333-异常

@liwei2
<template>
 <div class="busi-common-list-wrap">
   <h1 class="busi-common-list-title">
     {{title}}
   </h1>
   <ul class="busi-common-list-content"  v-if='JSON.stringify(busiDataList) != "{}"'>
     <li v-for='(list,key) in busiDataList' :key='key'  v-if='list.FIELD_DICT_NAME.length>0'>
        <kChecker  
          :class="{'choosed-all':list.isShowAllBtn,'has-border':hasBorder,'single-choose':!isMuti}"
          id="CUST_FNAME"
          :label="list.label" 
          :isShowAllBtn='list.isShowAllBtn'
          :value.sync="list.value" 
          :fieldChange='fieldChange'
          :dicts="list.FIELD_DICT_NAME"/>
     </li>
   </ul>
   <p v-else class="no-csdc-data">暂无数据</p>
 </div>
</template>

<script>
/**
 * 业务列表数据格式
 * [
      {
        label:'税收类型',
        isShowAllBtn:false,
        FIELD_DICT_NAME:[
          {
            DICT_CODE: "TAX_FLAG",
            DICT_ITEM: "1",
            DICT_ITEM_NAME: "仅为中国税收居民",
            DICT_ORD: "0",
            ORG_CODE: "0000",
          },
          {
            DICT_CODE: "TAX_FLAG",
            DICT_ITEM: "2",
            DICT_ITEM_NAME: "仅为非居民",
            DICT_ORD: "0",
            ORG_CODE: "0000"
          },
        ]
      }
    ]
*/
import kChecker from '../../components/baseUI/kChecker'

export default {
  data() {
    return {
    
    };
  },
  props:{
    busiDataList: {},
    title:{
      type: String,
      default:'业务列表'
    },
    hasBorder:{
      type:Boolean,
      default:true
    },
    fieldChange: {// 字段值变化事件
      type: Function,
      default: (v) => {
        if(!this.isMuti){//单选
          v.DEFAULT_VALUE = v.FIELD_LAST_CHOOSE_VALUE;
        };
      }
    },
    isMuti:{
      type:Boolean,
      default:true
    }                     
  },
  components:{
    kChecker
  },
  methods: {
    
  },
};
</script>

<style lang="less">
.busi-common-list-wrap{
  width: inherit;
  .busi-common-list-title{
    font-size: 28px;
    font-weight: normal;
    color: #2e79db;
    text-align: center;
    margin-bottom: 35px;
  }
  .busi-common-list-content{
    padding: 0;
    li{
      list-style: none;
      margin-bottom: 45px;
      .self-checker{
        display: flex;	
        margin-bottom: 0;
        padding: 20px 0;
        border-radius: 10px;
        position: relative;
        background: rgba(233, 233, 233, 0.55);
        &.has-border{
          background: none;
          border: solid 1px #b8b8b8;
          .el-form-item__label{
            &::after{
              display: inline-block;
              content: '';
              height: 100%;
              width: 1px;
              border-left: solid 1px #b8b8b8;
              position: absolute;
              right: 0;
            }
          }
        }
        &.choosed-all{
          .el-form-item__label{
            text-indent: 40px;
            width: 200px
          }
          .el-form-item__content{
            &>.el-checkbox{
              position: absolute;
              left: -170px;
              .el-checkbox__label{
                display: none;
              }
            }
            .el-checkbox-group{     
              .el-checkbox {
                .el-checkbox__input{
                  display: none;
                }
              }
            }

          }
        }
        &.single-choose{
          .el-checkbox__inner{
            border-radius: 50%;
          }
        }
        .el-form-item__label{
          font-size: 20px;
          color: #000000;
          text-align: center;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 0 0  auto;
        }
        .el-form-item__content{
          flex: 1 1 auto;
          padding-left: 66px;
          .el-checkbox-group{           
            display: flex;
            flex-wrap: wrap;
            .el-checkbox{
              flex:  0 0 50%;
              margin-left: 0;
              margin-bottom: 10px;
              &.is-checked{
                color: red;
              }
            }
          }
        }
      }
    }
  }
  .no-csdc-data{
    text-align: center;
    font-size: 26px;
  }
}
</style>


