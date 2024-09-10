<template>
<div class="ocrNode">
  <div class="open-height-cam" v-if="showOCR">
    <div class="prop-scan-conent">
      <img @click="closeHighCamera('self')" class="prop-close" :src="require('@img/yinhe/imageNode/idcard/icon_guanbi.png')">
      <div class="high-box"></div>
      <div class="start-scan-box">
        <el-button @click="capture" class="start-scan-button" icon='el-icon-scan'>点击扫描</el-button>
      </div>
    </div>
  </div>
  <div class="animated" v-if="chooseIdType">
    <div class="close-wrap">
      <i class="close-btn" @click="closeIdTypeBtn()"></i>
    </div>
    <div class="animated-main">
      <div class="animated-title">请选择证件类型</div>
      <div class="animated-content">
        <el-row type="flex" class="row-bg" :gutter="20">
          <el-col v-for="(item, index) in filterIdType(idTypeList)" :key="index" :span="6">
            <div class="grid-content icon-gray"  @click="openOcrCardType(item.ID_TYPE)">
              <div class="grid-content-bg" :class="{'open-color-one': item.ID_TYPE == '00','open-color-two': item.ID_TYPE == '10','open-color-three': item.ID_TYPE == '20',}">
                <img :src="require('../../icons/yinheVTM/cardScan/' + (item.PIC) + '.svg')" alt="">
              </div>
              <span>{{item.ID_TYPE_TEXT}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
  <div class="ocrCard" v-else-if="ocrCardType =='0'">
    <div class="searchTitle">{{"请扫描：二代身份证"}}</div>
    <div class="frontImage" @click="exCardInfo('face')">
       <div class="imgTitle">
        {{"身份证人像面"}}
      </div>
      <!-- <img :src="getUrl(frontImage)" alt="" v-if="frontImage"> -->
      <div class="infoBox" :style="frontImage ? 'background:url(' + getUrl(frontImage) + ')' + 'center no-repeat' : ''">   
        <p><img class = "scanImgClass" :src ="require('../../icons/yinheVTM/imageNode/imageScan/icon-img-idcardscan.svg')">点击扫描</p>
      </div>
    </div>
    <div class="backImage" @click="exCardInfo('back')">
       <div class="imgTitle">
        {{"身份证国徽面"}}
      </div>
      <!-- <img :src="getUrl(backImage)" alt="" v-if="backImage"> -->
      <div class="infoBox" :style="backImage ? 'background:url(' + getUrl(backImage) + ')' + 'center no-repeat' : ''">  
        <p><img class = "scanImgClass" :src ="require('../../icons/yinheVTM/imageNode/imageScan/icon-img-idcardscan.svg')">点击扫描</p>
      </div>
    </div>
    <!-- <p style="color:#fff;position:absolute;bottom:120px;width:100%;left:0;">{{ocrData}}</p> -->
    <div class="otherLogin">
      <el-button @click="jumpTo" class="jumpButton">{{exitButtonText}}</el-button>
    </div>
    <div class="spotButton">
      <el-button @click="getCardInfo" class="spot" v-show="showButton">开始识别</el-button>
    </div> 
  </div>
 
  <div class="orgOpen ocrCard" v-else-if="ocrCardType=='1'">
    <div class="searchTitle">拍证识别</div>
    <div class="frontImage" @click="exCardInfo('10')">
      <img :src="getUrl(orgImage)" alt="" v-if="orgImage">
      <div class="infoBox" v-else>
        <p>点击采集工商营业执照</p>
      </div>
    </div>
    <div class="otherLogin">
      <el-button @click="jumpTo" class="jumpButton">{{exitButtonText}}</el-button>
    </div>
    <div class="spotButton">
      <el-button @click="getOrgCardInfo" class="spot" v-show="showButton">开始识别</el-button>
    </div>
  </div>
   <div class="ocr-result-info" v-if="ocrResult">
      <div class="ocr-result-title">请确认本次识别数据</div>
      <div class="ocr-result-content">
        <el-form >
          <div :class="['listbox',{'longBox':field.FIELD_TYPE=='long'}]" v-for ="(field,index) in filteredOrgResList" :key="index">
              <div class="label">{{field.FIELD_TITLE+':'}}</div>
              <el-input type="text" v-model="field.DEFAULT_VALUE" :disabled="field.DISABLE"></el-input>
          </div>
        </el-form>
      </div>
      <div class="ocr-result-footer">
        <el-button class="button redo" @click="redo">重新识别</el-button>
        <el-button class="button submit" @click="submit">确认无误</el-button>
      </div>
    </div>
</div>
</template>

<script>
import cardInfoShow from '../../components/common/cardInfoShow'
import { ocrGetInfoByYinhe} from "../../service/image-service"
import messageBox from "../../components/common/messageBox"
import { googlePlayVoice,googleStopVoice } from "../../device/voice/voice"
export default {
  data() {
    return {
      frontImage:"" ,
      frontImageUrl:"",
      backImage:"" ,
      backImageUrl:"",
      orgImage:"",
      orgImageUrl:"",
      cardImage:"",
      cardImageUrl:"",
      ocrResult:false,
      showButton:false,
      scaneObj:null,
      showOCR: false,
      showResult:false,
      chooseIdType: true,
      canScan: false,         // 用于判断预览窗口是否打开完成 能否进行采集
      iwidth: 730,
      iheight: 900,
      itop: 52,
      ileft: 595,
      cardObj:{},
      scanObj: null,
      idTypeList: [{
        ID_TYPE: "00",
        ID_TYPE_TEXT: "身份证",
        PIC: "pic-idcard-small"
      },{
        ID_TYPE:"10",
        ID_TYPE_TEXT:"营业执照",
        PIC: "pic-yyzz-small"
      }],
      faceData:[],
      backData:[],
      personDataFields: [{
        FIELD_ID:"CUST_NAME",
        FIELD_TITLE:"客户姓名",
        DEFAULT_VALUE:""
      },{
        FIELD_ID:"ID_TYPE_TEXT",
        FIELD_TITLE:"证件类型",
        DEFAULT_VALUE:"身份证",
        DISABLE: true
      },{
        FIELD_ID:"ID_CODE",
        FIELD_TITLE:"证件号码",
        DEFAULT_VALUE:"",
        FIELD_TYPE:""
      },{
        FIELD_ID:"NATION",
        FIELD_TITLE:"民族",
        DEFAULT_VALUE:""
      },{
        FIELD_ID:"SEX",
        FIELD_TITLE:"性别",
        DEFAULT_VALUE:""
      },{
        FIELD_ID:"BIRTHDAY",
        FIELD_TITLE:"出生日期",
        DEFAULT_VALUE:""
      },{
        FIELD_ID:"BEGIN_DATE",
        FIELD_TITLE:"证件开始日期",
        DEFAULT_VALUE:""
      },{
        FIELD_ID:"END_DATE",
        FIELD_TITLE:"证件结束日期",
        DEFAULT_VALUE:""
      },{
        FIELD_ID:"ID_ADDR",
        FIELD_TITLE:"证件地址",
        DEFAULT_VALUE:"",
        FIELD_TYPE:"long"
      }
      // ,{
      //   FIELD_ID:"AGENCY",
      //   FIELD_TITLE:"发证机关",
      //   DEFAULT_VALUE:""
      // }
      ],
      orgDataFields: [{
        FIELD_ID:"CUST_FNAME",
        FIELD_TITLE:"名称",
        DEFAULT_VALUE:"",
        FIELD_TYPE:""
       },{
        FIELD_ID:"ID_TYPE_TEXT",
        FIELD_TITLE: "证件类型",
        DEFAULT_VALUE: "营业执照",
        DISABLE: true
       },{
        FIELD_ID:"FOUND_DATE",
        FIELD_TITLE:"成立日期",
        DEFAULT_VALUE:"",
       },{
        FIELD_ID:"ID_CODE",
        FIELD_TITLE:"证件号码",
        DEFAULT_VALUE:""
       },{
        FIELD_ID:"REGISTER_FUND",
        FIELD_TITLE:"注册资本（万元）",
        DEFAULT_VALUE:""
       },{
        FIELD_ID:"ID_BEG_DATE",
        FIELD_TITLE:"开始日期",
        DEFAULT_VALUE:""
       },{
        FIELD_ID:"ID_END_DATE",
        FIELD_TITLE:"结束日期",
        DEFAULT_VALUE:""
       },{
        FIELD_ID:"BUSINESS_SCOPE",
        FIELD_TITLE:"经营范围",
        DEFAULT_VALUE:"",
        FIELD_TYPE:""
       },{
        FIELD_ID:"ID_ADDR",
        FIELD_TITLE:"证件地址",
        DEFAULT_VALUE:"",
        FIELD_TYPE:"long"
       },
      //  {
      //   FIELD_ID: "REG_AUTHORITY",
      //   FIELD_TITLE:"发证机关",
      //   DEFAULT_VALUE:"",
      //   FIELD_TYPE:""
      // }
      ],
      ocrData: []
    };
  },
  props:["ocrCardType", "ocrBackType", "isOrgManager", "isModulePage", 'isByForce', 'isSleepFlag'],
  components: {
    cardInfoShow,
    messageBox
  },
  computed: {
    busiCode() {
      return this.$store.state.busicode;
    },
    userType() {
      return this.$store.state.usertype;
    },
    exitButtonText(){
      return this.ocrBackType =="1"?"返 回 >":"手动输入 >";
    },
      // 非生产环境不调用硬件
    isVTMDevice() {
      return this.$store.state.isVTMDevice;
    },
    filteredOrgResList() {
      return _.filter(this.ocrData, item => {
        return !item.isHide;
      })
    }
  },
  destroyed() {
    this.scanObj && this.scanObj.destroyHighCamera();
  },
  methods: {
    filterIdType(IdTypeList) {
      if (this.isOrgManager) {
        return [IdTypeList[0]];
      }
      if(this.$route.query && !_.isEmpty(this.$route.query.ocrCardType)) {
        return this.$route.query.ocrCardType == '0'? [IdTypeList[0]]: [IdTypeList[1]] ;
      }
      else {
        return IdTypeList;
      }
    },
    messageWaringAlert(msg, callBack, cancel) {
      let that = this;
      that.messageBox({
        typeMessage: 'question',
        messageText: msg,
        confirmButtonText: '确认',
        confirmedAction: function(){
            callBack && callBack()
        },
        canceledAction: function() {
            cancel && cancel()
        }
      });
    },
    capture() {
      let that = this;
      if(!that.isVTMDevice) {
        this.canScan = false;
        return;
      }
      // 可以扫描
      if (that.canScan) {
        this.scanObj.Capture();
        //无论拍照成功或者失败 关闭高拍仪
        setTimeout(() => {
          this.closeHighCamera();
        }, 200)
      }
    },
    redo(){
      let that = this;
      that.ocrData = [];
      that.ocrResult = false;
      that.chooseIdType = false;
      that.frontImage = "";
      that.backImage = "";
      that.orgImage = "";
      that.showButton = false;
      googlePlayVoice("请您重新识别身份证明文件");
    },
     submit(){
      let that = this;
      // that.$router.replace({name: "customerLogin", params:{ocrIdCode: that.idCode}}); 
      let saveOcrData = {};
      that.ocrData.forEach(i => {
          saveOcrData[i.FIELD_ID] = i.DEFAULT_VALUE;
      });
      if(that.ocrCardType == "0"){
        saveOcrData.ID_TYPE = "00";
        saveOcrData.ID_BEG_DATE = saveOcrData.BEGIN_DATE;
        saveOcrData.ID_EXP_DATE = saveOcrData.END_DATE;
      }else if(that.ocrCardType == "1"){
        saveOcrData.ID_TYPE = "10";
        saveOcrData.ID_BEG_DATE = saveOcrData.ID_BEG_DATE;
        saveOcrData.ID_EXP_DATE = saveOcrData.ID_END_DATE;
      }
      saveOcrData.CUST_FNAME = saveOcrData.CUST_NAME || saveOcrData.CUST_FNAME;
      this.$emit('ocrSeccessAction',saveOcrData);
    },
    captureExtend(type,collectedImage) {
      let that = this;
      if(!collectedImage){
        alert("识别证件信息失败!");
        return ;
      };
      if(type == "face"){
        that.frontImage = collectedImage;
      }else if(type == "back"){
        that.backImage =  collectedImage;
      }else if(type =="10"){
        that.orgImage = collectedImage
      }
      var reLoading = loading("识别中...")
      return ocrGetInfoByYinhe(type,collectedImage).then(function(data){
        reLoading.close();
        if(data.Code == "0"){
          if(data.Data && data.Data.length && data.Data[0] && data.Data[0].ERROR_CODE == "0"){
            let sideType = data.Data[0].SIDE;
            if(sideType != undefined && sideType != ""){
              if(type == "face"){
                if(sideType == "front"){
                  that.getCardInfoSuccess(data.Data[0],type);   
                }else{
                  that.messageWaringAlert("请您把身份证人像面放在上面");
                  googlePlayVoice("请您把身份证人像面放在上面");
                  that.frontImage = "";
                }
              }
              else if(type == "back"){
                if(sideType == "back"){
                  that.getCardInfoSuccess(data.Data[0],type);           
                }else{
                  that.messageWaringAlert("请您把身份证国徽面放在上面");
                  googlePlayVoice("请您把身份证国徽面放在上面");
                  that.backImage = "";
                }
              }
            }
            else if(type == "10"){
              that.getCardInfoSuccess(data.Data[0],type);
            }
            else{
              that.messageWaringAlert("请您放置正确的身份证明文件");
              googlePlayVoice("请您放置正确的身份证明文件");
              if (type == "face") {
                that.frontImage = "";
              } else if (type == "back") {
                that.backImage = "";
              } else if (type == "10") {
                that.orgImage = "";
              }
            }
          }else{
            if(type == "face"){
              that.messageWaringAlert("请您把身份证人像面放在上面");
              googlePlayVoice("请您把身份证人像面放在上面");
              that.frontImage = "";
            }else if(type == "back"){
              that.messageWaringAlert("请您把身份证国徽面放在上面");
              googlePlayVoice("请您把身份证国徽面放在上面");
              that.backImage = "";
            }else if(type == "10"){
              that.messageWaringAlert("请您把工商营业执照放在上面");
              googlePlayVoice("请您把工商营业执照放在上面");
              that.orgImage = "";
            }else{
              that.messageWaringAlert("请您放置正确的身份证明文件");
              googlePlayVoice("请您放置正确的身份证明文件");
              if (type == "face") {
                that.frontImage = "";
              } else if (type == "back") {
                that.backImage = "";
              } else if (type == "10") {
                that.orgImage = "";
              }
            }
          }
        }
      }).catch(function(err){
        reLoading.close();
        that.messageWaringAlert('OCR识别失败' + err);
        googlePlayVoice("OCR识别失败");
        if (type == "face") {
          that.frontImage = "";
        } else if (type == "back") {
          that.backImage = "";
        } else if (type == "10") {
          that.orgImage = "";
        }
        throw 'OCR识别失败' + err;
      })
    },
    closeHighCamera (isSelf) {
      if(this.isVTMDevice){
        this.scanObj && this.scanObj.hidCameraWin();
      }
      //等高拍仪硬件窗口关闭再关闭
      setTimeout(() => {
        this.canScan = false;
        this.showOCR = false;
        this.loading = isSelf ? false : true;
        this.loadingText = isSelf ? "" : "正在识别中...";
        isSelf ? this.chooseIdType = true : "";
      }, 500);
        
    },
    openOcrCardType(idType){
      this.chooseIdType = false;
      this.$emit('ocrBackCardType',idType);
    },
    startTakePictureOver() {
      let that = this;
      // 延迟一段时间再设置可以 扫描，否则可能预览窗口没打开就能进行采集
      setTimeout(function() {
          that.canScan = true;
      }, 1500);
    },
    openHighCamera(type) {
      let that = this;
      if (type == "10") {
        googlePlayVoice("请将工商营业执照放置扫描区");
      } else {
        googlePlayVoice("请将身份证明文件放置扫描区");
      }
      that.showOCR = true;
      if(type == "10"){
        that.idType = "10";
      }else{
        that.idType = "00";
      }
      that.chooseIdType = false;
      //开发模式模拟调用硬件成功
      if(!that.isVTMDevice){
          return;
      }
      let param = {
          iwidth: that.iwidth,
          iheight: that.iheight,
          itop: that.itop,
          ileft: that.ileft,
      }
      console.log("调用预览窗口，入参值为:" + JSON.stringify(param));
      highcamera.HighCameraInstance(function(cbParams) {
          switch (cbParams.type) {
              case "StartTakePictureOver":
                  console.log("开始拍照事件完成了")
                  that.startTakePictureOver();
                  break;
              case "StopTakePictureOver":
                  console.log("关闭高拍仪窗口成功")
                  break;
              case "GetPictureSyncOver":
                  if (cbParams.result == "0") {
                      that.captureExtend(type,cbParams.collectedImage);
                  } else {
                      console.error("拍照失败");
                  }
                  break;
              case "DeviceError":
                  console.error(cbParams.msg);
                  that.messageWaringAlert("请您放置正确的身份证明文件");
                  googlePlayVoice("请您放置正确的身份证明文件");
                  break
              default:
                  console.log("走了默认的事件");
                  break;  
          }
      }, param);
      that.scanObj = highcamera;
    },
    closeIdTypeBtn(){
      this.$emit('ocrBackAction', false);
      // this.$router.replace({ path: this.$bizhomecfg.getHomeConfig() });
    },
    exCardInfo(type){
      this.openHighCamera(type);
    },
    getCardInfoSuccess(custInfo,type){
      let that = this;
      if(type=="face"){
        that.personDataFields.forEach(i => {
          if(custInfo && custInfo[i.FIELD_ID]){
            i.DEFAULT_VALUE = custInfo[i.FIELD_ID];
            i.FIELD_ID == "ID_CODE" && (that.idCode = custInfo[i.FIELD_ID]);
          }
        });
        that.ocrData = that.personDataFields;
      }else if(type=="back"){
         that.personDataFields.forEach(i => {
          if(custInfo && custInfo[i.FIELD_ID]){
            i.DEFAULT_VALUE = custInfo[i.FIELD_ID];
            i.FIELD_ID == "ID_CODE" && (that.idCode = custInfo[i.FIELD_ID]);
          }
        });
        that.ocrData = that.personDataFields;

      }
      if(that.frontImage && that.backImage){
        that.showButton = true;
      }else if(type =="10"){
        that.showButton = true;
        that.orgDataFields.forEach(i => {
          if(custInfo && custInfo[i.FIELD_ID]){
            i.DEFAULT_VALUE = custInfo[i.FIELD_ID];
            i.FIELD_ID == "ID_CODE" && (that.idCode = custInfo[i.FIELD_ID]);
          }
        });
        // V0106【账户注册资料修改】机构户OCR识别，资料录入节点没有的字段，无需在识别结果中展示
        if(that.busiCode == 'V0106') {
          let filterList = ['FOUND_DATE', 'REGISTER_FUND', 'ID_BEG_DATE', 'BUSINESS_SCOPE'];
          _.each(that.orgDataFields, item => {
            if(filterList.indexOf(item.FIELD_ID) > -1) {
              item.isHide = true;
            }
          })
        }
        that.ocrData = that.orgDataFields;
      }
    },
  
    getOcrData(type, img){
      let that = this;
      // that.myLoading("识别中...");
      //调用借口识别 身份证
      return ocrGetInfo(type, img).then(function(idData){
        // if(idData.Code != '0'){
        //   throw 'Ocr识别失败'+ idData.Msg;
        // }
        return  idData ;
      }).catch(function(err){
        throw 'Ocr识别失败'+ err;
      })
    },
    getCardInfo(){
      let that = this;
      if(that.ocrData && that.ocrData.length){
        that.ocrResult = true;
      }else{
        return Promise.all([
          ocrGetInfoByYinhe("face",that.frontImage),
          ocrGetInfoByYinhe("back",that.backImage)]).then(function(res){
          if(res[0].Code == "0"){
            if(res[0].Data && res[0].Data.length && res[0].Data[0] && res[0].Data[0].ERROR_CODE == "0"){
              let sideType = res[0].Data[0].SIDE;
              if(sideType == "front"){
                that.getCardInfoSuccess(res[0].Data[0],"face");   
              }
            }
          }
          if(res[1].Code == "0"){ 
            if(res[1].Data && res[1].Data.length && res[1].Data[0] && res[1].Data[0].ERROR_CODE == "0"){
              let sideType = res[1].Data[0].SIDE;
              if(sideType == "back"){
                that.getCardInfoSuccess(res[1].Data[0],"back");   
              }
            }
          }
          if(res[0].Code == "0" && res[1].Code == "0"){
            that.ocrResult = true;
          }else{
            that.messageWaringAlert("OCR识别失败，请返回重新识别");
          }
        }).catch(function(err){
          that.messageWaringAlert("OCR识别失败，原因是：" + err.toString());
        })
      }
      if (that.isOrgManager || !that.isModulePage) {
        that.$storage.setSession(that.$definecfg.IMAGE_INFO, {
          valfront: that.frontImage,
          valback: that.backImage,
          valface:that.frontImage
        });
      }
    },
    //获取机构工商营业执照OCR识别
    getOrgCardInfo(){
      if(this.ocrData && this.ocrData.length){
        this.ocrResult = true;
      }
    },
    getUrl(data){
      return "data:image/jpeg;base64," + data;
    },
    jumpTo(){
      this.$storage.setSession(this.$definecfg.READ_CARD,"0");
      this.$emit("ocrBackAction",false);
    },
    startRead(){
      this.showResult = false;
    },
    getBankInfoByCardNo(cardNo) {
      return this.$syscfg.K_Request('W0000007',{
          bankCardCode:cardNo
      }).then((res) => {
        return _.get(res,"Data[0]",{})
      })
    }
  }
};
</script>

<style lang="less">
.ocrNode{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 1);//#efefef;
  .ocrCard{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    .searchTitle{
      width: 100%;
      height:58px;
      font-family:Alibaba PuHuiTi;
      font-weight:700;
      color:#252525;
      font-size:42px;
      line-height:68px;
      text-align:center;
      margin-top: 60px;
    }
    .frontImage{
      margin-right: 103px;
      margin-left: 103px;
      width:528px;
      height:458px;
      background-color:#f9fafc;
      border-radius:3px 3px 0px 0px;
      img{
        width: 353px;
        height: 206px;
        content: none !important;
      }
      .imgTitle{
        position: relative;
        width:528px;
        font-family:Alibaba PuHuiTi;
        font-weight:500;
        color:#424954;
        font-size:26px;
        padding-bottom:5px;
        text-align:center;
        line-height: 63px;
        background-color:#F9FAFC;
        border-radius:0px 0px 3px 0px;
        box-shadow:0px 0px 3px 0px #e0e1e2;
      }
      .infoBox{
        width:528px;
        height:424px;
        position: relative;
        background: url("~@icons/yinheVTM/cardScan/pic-Front-IDcard.svg") center no-repeat;
        border-radius:0px 0px 3px 0px;
        box-shadow:0px 0px 3px 0px #e0e1e2;
        p{
          position:absolute;
          left: 0;
          bottom: -56px;
          width:100%;
          font-family:Alibaba PuHuiTi;
          font-weight:700;
          color:#3b6aff;
          font-size:26px;
          font-weight: 700;
          text-align:center;
          margin-top: -5px;
          line-height: 63px;
          background-image:linear-gradient(180deg,#f4f4f7 0%,#e7e8eb 100%);
          border-radius:0px 0px 3px 0px;
          box-shadow:0px 0px 3px 0px #e0e1e2;
        }
        .scanImgClass{
          width: 25.18px;
          height: 24.48px;
          margin-right: 10px;
          position: initial;
        }
      }
    }
    .backImage{
      margin-right: 103px;
      margin-left: 103px;
      width:528px;
      height:458px;
      background-color:#f9fafc;
      border-radius:3px 3px 0px 0px;
      img{
        width: 353px;
        height: 206px;
        content: none !important;
      }
      .imgTitle{
        position: relative;
        width:528px;
        font-family:Alibaba PuHuiTi;
        font-weight:500;
        color:#424954;
        font-size:26px;
        padding-bottom:5px;
        text-align:center;
        line-height: 63px;
        background-color:#F9FAFC;
        border-radius:0px 0px 3px 0px;
        box-shadow:0px 0px 3px 0px #e0e1e2;
      }
      .infoBox{
        width:528px;
        height:424px;
        position: relative;
        background: url("~@icons/yinheVTM/cardScan/pic-Reverse-IDcard.svg") center no-repeat;
        border-radius:0px 0px 3px 0px;
        box-shadow:0px 0px 3px 0px #e0e1e2;
        &.infoBoxBg{
          background:none;
          height: 0px;
          width: 0px;
        }
        p{
          position:absolute;
          left: 0;
          bottom: -56px;
          width:100%;
          font-family:Alibaba PuHuiTi;
          font-weight:700;
          color:#3b6aff;
          font-size:26px;
          text-align:center;
          margin-top: -5px;
          line-height: 63px;
          font-weight: 700;
          background-image:linear-gradient(180deg,#f4f4f7 0%,#e7e8eb 100%);
          border-radius:0px 0px 3px 0px;
          box-shadow:0px 0px 3px 0px #e0e1e2;
        }
        .scanImgClass{
          width: 25.18px;
          height: 24.48px;
          margin-right: 10px;
          position: initial;
        }
      }
    }
    .spotButton{
      position: absolute;
      bottom: 50px;
      width: 340px;
      border-radius: 8px;
      height: 74px;
      text-align: center;
      .el-button{
        color:#fff;
        background-color: #1f5ade;
        border-radius: 4px;
        width:180px;
        height: 54px;
        font-size:20px;
      }
    }
    .otherLogin{
      position: relative;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 0 40px;
      justify-content: flex-end;
      .el-button {
        background-color:rgba(0,0,0,0.0);
        border-radius: 100px;
        border: none;
        width:180px;
        height: 54px;
        color: #1f5ade;
        font-size: 28px;
        font-family: PingFangSC-Medium;
        justify-self: flex-end;
        span{
          font-family: PingFangSC-Medium;
          font-size: 21px;
          color: #1f5ade;
          letter-spacing: -0.58px;
        }
      }
    }
    
  }
  .open-height-cam {
    width: 1920px;
    height: 1080px;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 11;
    background-color:rgba(0, 0, 0, 0.5);
    
    .prop-scan-conent {
        width: 733px;
        height: 967px;
        margin: 56px auto;
        position: relative;
        background-color: #efefef;
        .prop-close {
            position: absolute;
            top: -45px;
            right: -69px;
        }
        .high-box {
            height: 895px;
        }
        .start-scan-box {
            height: 72px;
            .start-scan-button {
                width: 100%;
                height: 72px;
                border: none;
                font-size: 24px;
                font-weight: 700;
                font-family: Alibaba PuHuiTi;
                color: #3b6aff;

                background-image:linear-gradient(180deg,#f0f0f5 0%,#cecfd6 100%);
                border-radius:0px 0px 4px 4px;
                box-shadow:0px 4px 16px rgba(0, 0, 0, 0.06);
            }
          }
      }
  }
  .animated {
    width: 1920px;
    height: 1080px;
    position: fixed;
    left: 0;
    top: 0;
    padding-left: 371px;
    padding-top: 125px;
    text-align: center;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.5);
    .close-wrap {
      position: relative;
      width: 1246px;
      height: 70px;
      .close-btn {
        position: absolute;
        right: 0;
        display: block;
        width: 70px;
        height: 70px;
        background: url('../../icons/common/icon-windows-close.svg');
      }
    }
    .animated-main {
      width: 1178px;
      height: 762px;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      .animated-title {
        font-family: Alibaba PuHuiTi;
        font-size: 42px;
        font-weight: bolder;
        letter-spacing: 0px;
        color: #222222;
        margin-top: 88px;
      }
      .animated-content {
        margin-top: 60px;
        .el-row--flex {
          display: flex;
          justify-content: space-evenly;
          .el-col {
            width:342px;
            height:382px;
            .grid-content {
              display: flex;
              .grid-content-bg {
                width:342px;
                height:382px;
                background-image:linear-gradient(135.98deg,#697cff 0%,#a3ceff 100%);
                border-radius:8px;
                display: flex;
                justify-content: center;
                align-items: center;
                // &.open-color-one {
                //   background-image: linear-gradient(0deg,#4141d7 0%,#3e46db 10%,#3a4bdf 20%,#3750e3 30%,#3455e7 40%,#315aeb 50%,#2d5fef 60%,#2a64f3 70%,#2769f7 80%,#236efb 90%,#2073ff 100%);
                // }
                // &.open-color-two {
                //   background-image: linear-gradient(180deg,#ffce47 0%,#fbc948 10%,#f7c449 20%,#f4bf4a 30%,#f0ba4b 40%,#ecb54d 50%,#e8b04e 60%,#e5ab4f 70%,#e1a650 80%,#dda152 90%,#da9c53 100%);
                // }
                // &.open-color-three {
                //   background-image: linear-gradient(180deg,#20ceff 0%,#20c8ff 10%,#20c1ff 20%,#20baff 30%,#20b3ff 40%,#20adff 50%,#20a6ff 60%,#209fff 70%,#2098ff 80%,#2092ff 90%,#208bff 100%);
                // }
                img {
                  width: 336px;
                  height: 228px;
                  margin-top: -50px;
                  content: none !important;
                  
                }
              }
              span {
                display: block;
                font-family:PingFangSC-Medium;
                color:#ffffff;
                font-size:26px;
                text-align:center;
                width:335px;
                height:74px;
                background-color:rgba(111, 144, 255, 0.25);
                border-radius:0px 0px 8px 8px;
                position: absolute;
                line-height: 74px;
                bottom: 0;
              }
            }
          }
          .el-col:first-child {
            margin-left:0px
          }
        }
      }
    }
  }
  .ocr-result-info{
      display: flex;
      background-color: white;
      position: absolute;
      top: 0;
      width: 100%;
      bottom: 0;
      flex-direction: column;
      align-items: center;
      z-index:100;
      .ocr-result-title{
        width:414px;
        height:58px;
        margin-top: 80px;
        margin-bottom: 40px;
        font-weight:700;
        color:#252525;
        font-size:42px;
        line-height:68px;
        text-align:center;
      }
      .ocr-result-content{
        .el-form{
          flex-wrap: wrap;
          display: flex;
          width:80%;
          margin: 0 auto;
          overflow: scroll;
          .listbox{
            display: flex;
            align-items: center;
            width: 50%;
            height: 60px;      
            margin-bottom: 25px;
            line-height: 55px;
            .label{
              width: 200px;
              flex: 0 0 auto;
              margin-right: 15px;
              color:#252525;
              font-size:24px;
              line-height:55px;
              text-align:right;
              height: 55px;
            }
            .el-input{
              width: 60%;
              font-size:24px;
              .el-input__inner {
                height: 55px;
              }
            }
          }
          .longBox {
            width: 100%;
            .el-input{
              width: 80%;
              font-size:24px;
            }
          }
          .el-form-item{
            width:60%;
            .el-form-item__label{
              font-size: 20px;
              color: rgba(0,22,51,0.50);
            }
            .el-form-item__content{
              font-size: 20px;
              color: rgba(0,22,51,0.75);
              line-height: 55px;
            }
          }
        }
      }
      .ocr-result-footer{
        position: absolute;
        bottom: 40px;
        .redo{
          width:180px;
          height:54px;
          border:1px solid;
          border-color:#3b6aff;
          border-radius:2px;
          font-size: 24px;
          font-weight:500;
          color:#3b6aff;
          span{
            width:94px;
            height:33px;
            text-align:center;
          }
        }
        .submit{
          width:180px;
          height:54px;
          font-size: 24px;
          color:#fffdfd;
          background-image:linear-gradient(90deg,#3b6aff 0%,#208bff 100%);
          border-radius:2px;
          span{
            width:94px;
            height:33px;
            font-weight:500;
            text-align:center;
          }
        }
      }
  }
}

</style>