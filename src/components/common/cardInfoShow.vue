<template>
    <div class="cardInfoShow">
        <div  class="card-data-box">
            <div class="card-title">请确认识别数据</div>
            <div v-show='cardDataFields' class="card-box-content">
                <el-form >
                <div :class="['listbox',{'textareaBox':field.FIELD_TYPE=='textarea'}]" v-for ="(field,index) in domDate " :key="index">
                    <div class="label">{{field.FIELD_TITLE+':'}}</div>
                    <el-input type="textarea" autosize v-model="field.DEFAULT_VALUE" v-if="field.FIELD_TYPE=='textarea'"></el-input>
                    <el-input type="text" v-model="field.DEFAULT_VALUE" v-else></el-input>
                </div>
                </el-form>
            </div>
            <div class="card-box-footer">
                <el-button class="button restore" @click="startRead">重新识别</el-button>
                <el-button class="button light-button " @click="goNext">确认无误</el-button>
            </div>
        </div>
    </div>  
</template>
<script>
import kText from '../../components/baseUI/kText'
import date from '../../tools/date';
export default {
    data() {
        return {
            cardDataFields:[{
                  FIELD_ID:'CUST_NAME',
                  FIELD_TITLE:"客户姓名",
                  DEFAULT_VALUE:""
              },{
                  FIELD_ID:'ID_TYPE_TEXT',
                  FIELD_TITLE:"证件类型",
                  DEFAULT_VALUE:""
              },{
                  FIELD_ID:'ID_CODE',
                  FIELD_TITLE:"证件号码",
                  DEFAULT_VALUE:"",
                  FIELD_TYPE:"textarea",
              },{
                  FIELD_ID:'NATION',
                  FIELD_TITLE:"民族",
                  DEFAULT_VALUE:""
              },{
                  FIELD_ID:'SEX_TEXT',
                  FIELD_TITLE:"性别",
                  DEFAULT_VALUE:""
              },{
                  FIELD_ID:'BIRTHDAY',
                  FIELD_TITLE:"出生日期",
                  DEFAULT_VALUE:""
              },{
                  FIELD_ID:'BEGIN_DATE',
                  FIELD_TITLE:"证件开始日期",
                  DEFAULT_VALUE:""
              },{
                  FIELD_ID:'END_DATE',
                  FIELD_TITLE:"证件结束日期",
                  DEFAULT_VALUE:""
              },{
                FIELD_ID:'ID_ISS_AGCY',
                FIELD_TITLE:"发证机关",
                DEFAULT_VALUE:"",
              },{
                  FIELD_ID:'ID_ADDR',
                  FIELD_TITLE:"证件地址",
                  DEFAULT_VALUE:"",
                  FIELD_TYPE:"textarea",
              }
            ],
            orgCardDataFields:[{
                FIELD_ID:'CUST_NAME',
                FIELD_TITLE:"客户全称",
                DEFAULT_VALUE:"",
                FIELD_TYPE:"textarea",
              },{
                FIELD_ID:'ID_TYPE_TEXT',
                FIELD_TITLE:"类型",
                DEFAULT_VALUE:"",
              },{
                  FIELD_ID:'FOUND_DATE',
                  FIELD_TITLE:"成立日期",
                  DEFAULT_VALUE:"",
              },{
                FIELD_ID:'ID_CODE',
                FIELD_TITLE:"证件号码",
                DEFAULT_VALUE:""
              },{
                FIELD_ID:'REGISTER_FUND',
                FIELD_TITLE:"注册资本（万元）",
                DEFAULT_VALUE:""
              },{
                FIELD_ID:'BEGIN_DATE',
                FIELD_TITLE:"开始日期",
                DEFAULT_VALUE:""
              },{
                FIELD_ID:'END_DATE',
                FIELD_TITLE:"结束日期",
                DEFAULT_VALUE:""
              },{
                FIELD_ID:'BUSINESS_SCOPE',
                FIELD_TITLE:"经营范围",
                DEFAULT_VALUE:"",
                FIELD_TYPE:"textarea",
              },{
                FIELD_ID:'ID_ADDR',
                FIELD_TITLE:"证件地址",
                DEFAULT_VALUE:"",
                FIELD_TYPE:"textarea",
              },{
                  FIELD_ID: "REG_AUTHORITY",
                  FIELD_TITLE:"发证机关",
                  DEFAULT_VALUE:"",
                  FIELD_TYPE:"textarea",
              }
            ],
            bankCardDataFields:[{
                FIELD_ID:'BANK_NAME',
                FIELD_TITLE:"银行名称",
                DEFAULT_VALUE:""
              },
              {
                FIELD_ID:'CARD_NAME',
                FIELD_TITLE:"银行卡名称",
                DEFAULT_VALUE:""
              },
              {
                FIELD_ID:'CARD_TYPE',
                FIELD_TITLE:"银行卡类型",
                DEFAULT_VALUE:""
              },
              {
                FIELD_ID:'CARD_NO',
                FIELD_TITLE:"银行卡账户",
                DEFAULT_VALUE:""
              },
              {
                FIELD_ID:'ORG_CODE',
                FIELD_TITLE:"存管代码",
                DEFAULT_VALUE:""
              }
            ],
            domDate:[],
        };
    },
    mounted(){
      if(this.ocrCardType=="0"){
        this.cardDataFields.forEach(v=>{
            v.DEFAULT_VALUE = this.cardData&&this.cardData[v.FIELD_ID]||"";
            this.domDate.push(v);
        })
      }else if(this.ocrCardType=="1"){
        this.orgCardDataFields.forEach(v=>{
            v.DEFAULT_VALUE = this.cardData&&this.cardData[v.FIELD_ID]||"";
            this.domDate.push(v);
        })
      }else if(this.ocrCardType=="2"){
        this.bankCardDataFields.forEach(v=>{
            v.DEFAULT_VALUE = this.cardData&&this.cardData[v.FIELD_ID]||"";
            this.domDate.push(v);
        })
      }
    },
    components: {
        kText,
    },
    computed: {
        cardData:function(){
            return this.$store.state.cardData;
        }
    },
    props: ["ocrCardType"],
    methods: {
      goNext(){
        let cardInfo = {};
        this.domDate.forEach((item)=>{
          this.$set(cardInfo,item.FIELD_ID,item.DEFAULT_VALUE);
        })
        if(cardInfo.END_DATE){
          if(cardInfo.END_DATE=="长期"){
            cardInfo.END_DATE = "30001231"
          }
        }
        if(cardInfo.CUST_NAME){
           cardInfo.CUST_NAME = cardInfo.CUST_NAME.replace(/\(/g, '（');
           cardInfo.CUST_NAME = cardInfo.CUST_NAME.replace(/\)/g, '）');
        }
        if(cardInfo.BUSINESS_SCOPE){
           cardInfo.BUSINESS_SCOPE = cardInfo.BUSINESS_SCOPE.replace(/\(/g, '（');
           cardInfo.BUSINESS_SCOPE = cardInfo.BUSINESS_SCOPE.replace(/\)/g, '）');
        }
        if(cardInfo.ID_ADDR){
           cardInfo.ID_ADDR = cardInfo.ID_ADDR.replace(/\(/g, '（');
           cardInfo.ID_ADDR = cardInfo.ID_ADDR.replace(/\)/g, '）');
        }

        this.$emit("gotoNext",cardInfo);
      },
      startRead(){
        this.$emit("startRead");
      },
      validate(cardInfo) {
          if (cardInfo.length != "8") {
              return false;
          } else {
              let pattern = /((\d{3}[1-9]|\d{2}[1-9]\d|\d[1-9]\d{2}|[1-9]\d{3})(((0[13578]|1[02])(0[1-9]|[12]\d|3[01]))|((0[469]|11)(0[1-9]|[12]\d|30))|(02(0[1-9]|[1]\d|2[0-8]))))|(((\d{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
              return pattern.test(cardInfo);
          }
      }
    },
};
</script>

<style lang="less" scoped>
.cardInfoShow{
  position: fixed;
  left:0;
  top:0;
  padding-top:65px;
  bottom: 0;
  background: #fff;;
  .card-data-box{
    width: 100%;
    position: relative;
    background: #fff;

    border-radius: 3px;
    .titleImg{
      width: 100%;
      text-align: center;
      position: absolute;
      top: 30px;
      img{
        width: 54px;
        height: 54px;
        margin-bottom: 16px;
      }
    }
    .card-title{
      width: 100%;
      font-size: 28px;
      color: rgba(0,22,51,0.75);
      text-align: center;
      height:100px;
      line-height:100px;
      background:#fff;
      margin-bottom:10px;
    }
    .card-box-content{
        height: 540px;
        overflow-y: auto;
        display: flex;
      align-items: center;
      padding:5px 0;
      .el-form{
        flex-wrap: wrap;
        display: flex;
        width:90%;
        margin: 0 auto;
        .listbox{
          display: flex;
          width: 50%;          
          margin-bottom: 22px;
          .label{
            width: 168px;
            flex: 0 0 auto;
            margin-right: 15px;
            text-align: right;
            line-height: 40px;
            font-size: 17px;
          }
          .el-input{
            width: 70%;
            font-size: 17px;
          }
        }
        .listbox.textareaBox{
          display: flex;
          width: 100%;
          .el-textarea{
            min-height: 40px;
            font-size: 17px;
          }
        }
        .el-form-item{
          width:50%;
          .el-form-item__label{
            font-size: 17px;
            color: rgba(0,22,51,0.50);
          }
          .el-form-item__content{
            font-size: 17px;
            color: rgba(0,22,51,0.75);
            line-height: 32px;
          }
        }
      }
    }
  }
    .card-box-footer{
        width: 100%;
        display: flex;
        height: 80px;
        background:#fff;
        justify-content: center;
        align-items: center;
        .button {
            margin: 0 18px 0;
            font-size:17px;
            width:113px;
            border-radius: 4px;
        }
        .light-button {
        color:#fff;
        background-color: #c52727;
        }
        .restore {
            color: #c52727;
            border: solid 1px #c52727
        }
    }
    
}

</style>