<template>
    <div class="readCard">
        <div class="readCard-page">
            <div class="content-container">
                <div class="idcard-img-box">
                    <div>{{imgBox.imgBoxMessage}}</div>
                    <img class = "leftImgClass" :src="imgBox.imgSrc">
                </div>
                <div class="content-box">
                    <div class="idcard-text-box" v-if="idcardTextBox.idCardTextShow">
                        <div class="idcard-text-title" :class="{blue:idcardTextBox.colorFlag}">{{idcardTextBox.title1}}</div>
                        <div class="idcard-text-title">{{idcardTextBox.title2}}</div>
                        <div class="idcard-text-message" v-if="idcardTextBox.messageShow">{{idcardTextBox.message}}</div>
                    </div>
                    <div class="other-login-content">
                        <el-button class="other-login ocr" @click="jumpTo('OCR')" :disabled='canNotChange' v-if="showOCR">{{OcrBtnText}}</el-button>
                        <span class="separate" v-if="showOCR && !isByForce && canOtherLog"></span>
                        <el-button class="other-login" @click="jumpTo('acctLog')" v-if='!isByForce && canOtherLog' :disabled="canNotChange">{{otherLogTxt}} ></el-button>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="check-mask" v-if="mask.maskShow">
            <div class="mask-content-box">
                <img :src="mask.imgSrc" alt="">
                <div class="maskText">{{mask.maskText}}</div>
            </div>
        </div>
        <police-validate v-if="showPoliceValidate" :isJustCustLogin=isJustCustLogin @re-check="reCheckPolice"></police-validate>
        <ocr-card v-if="showOcrCard" 
            :isOrgManager="isOrgManager"
            :isModulePage="isModulePage"
            :isSleepFlag="isSleepFlag"
            :isByForce="isByForce"
            @ocrBackAction ="ocrBackAction"
            @ocrBackCardType ="ocrBackCardType"
            @ocrSeccessAction="ocrSeccessAction"  
            :ocrBackType="'1'"  
            :ocrCardType = "ocrCardType">
        </ocr-card>
        <!-- <ocr-recognize v-if="showOcrCard" @ocrSeccessAction="ocrSeccessAction" @ocrCloseAction="ocrCloseAction"></ocr-recognize> -->
    </div>
</template>

<script>
import { googlePlayVoice, googleStopVoice } from "../../device/voice/voice"

//导入图片
import idCardInImg from '../../icons/yinheVTM/pic/pic-idcard-in.png'
import idCardOutImg from '../../icons/yinheVTM/pic/pic-idcard-out.png'
import policeValidate from '../policevalidate/policeValidate'
// import ocrRecognize from '../ocrRecognize/ocrRecognize'
import ocrCard from '../ocrCard/ocrCard';
import dict from '../../tools/dict';
import * as utils from '../../tools/util'
import date from '../../tools/date'
import { deleteAllCustFile } from '../../device/changcheng/chrome/localApi';
import _ from 'lodash'

export default {
    data() {
        return {
            cardData: {},
            idcardTextBox: {
                title1: '请插入您的',
                title2: '二代身份证/港澳台居民居住证',
                message: "其它证件请选择账号识别方式",
                messageShow: true,
                colorFlag: false,
                idCardTextShow: true,
            },
            imgBox: {
                imgSrc: idCardInImg,
                imgBoxMessage: '请按图示放置证件',
            },
            mask:{
                maskShow:false,
                maskText: '正在进行公安联网校验',
                imgSrc: ''
            },

            resetNum: 0,//重新初始化次数 大于3就不再重新初始化了
            isSuccess: false,
            readCardHasError: false, //读卡失败
            otherLogTxt: '账号登录',
            OcrBtnText: "OCR识别登录",
            canOtherLog: true,
            canNotChange: true,
            voiceTitletTxt: "请在屏幕右下方插入您的证件,或选择其他方式登录",
            showPoliceValidate: false,
            showOCR: true,
            showOcrCard:false,  //默认不展示OCR识别
            ocrCardType: "",
            cardReadSuccess: false, // 是否读卡成功
            isOcrResult: false,
        };
    },
    props: ['isOrgManager', 'isJustCustLogin', 'isByForce', 'isSleepFlag'],
    components: {
        policeValidate,
        ocrCard,
    },
    computed: {
        busiCode() {
            return this.$store.state.busicode;
        },
        userType() {
            return this.$store.state.usertype;
        },
        deviceType() {
            return this.$store.state.deviceType;
        },
        isModulePage() {
            return "_modulePage" in this.$route.query && this.$route.query["_modulePage"];
        },
        isCustLogin() {
            return this.$syscfg.isCustLogin();
        },
        loginType() {
            // loginType 1 - 法定代表人登录 2 - 代理人登录
            return this.$storage.getJsonSession(this.$definecfg.LOGIN_TYPE);
        },
        // 非生产环境不调用硬件
        isVTMDevice() {
            return this.$store.state.isVTMDevice;
        }
    },
    mounted() {
        console.log("业务初始化mounted");
    },
    activated() {
        console.log("业务初始化actived");
    },
    deactivated() {
        console.log("当前页面离开");
        if (this.isVTMDevice) {
            try {
                idcard.CancelAccept(); //取消阅读
            } catch (error) {
                console.error("弹出读卡设备调用失败，原因：" + error.message);
                this.alert("弹出卡片失败！");
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // 以下三个数据可能会在第一次读卡的时候被改变，因此重新进入界面时需要把它们重新初始化
            vm.canOtherLog = true;
            vm.showOCR = true;
            vm.idcardTextBox = {
                title1: '请插入您的',
                title2: '二代身份证/港澳台居民居住证',
                message: "其它证件请选择账号识别方式",
                messageShow: true,
                colorFlag: false,
                idCardTextShow: true,
            }
            vm.init(vm);
        })
    },
    beforeDestroy() {
        console.log("当前页面beforeDestroy");
        if (this.isVTMDevice) {
            try {
                idcard.CancelAccept();//取消阅读
            } catch (error) {
                console.error("弹出读卡设备调用失败，原因：" + error.message);
            }
        }
    },
    destroyed() {
        googleStopVoice();
    },
    methods: {
        init(that) {
            // 进入读卡先清空数据，防止读卡经办人信息不一致时返回手动录入，再次进读卡界面，但未读卡，再返回手动录入界面，此时仍提示信息不一致弹框
            that.$store.commit(that.$types.UPDATE_CARD_DATA, {});
            // 机构经办人登录
            if (that.isOrgManager) {
                // 获取登录类型
                that.otherLogTxt = '证件信息认证';            
                that.voiceTitletTxt = '请按图示放置证件，或点击右下角手动录入经办人信息';
                that.showOCR = false;
                if(that.busiCode  == 'V0050' || that.busiCode == 'V0051') {
                    that.showOCR = true;
                }
            } else if (that.isModulePage) {
                that.voiceTitletTxt = "请在屏幕右下方插入您的证件";
                that.idcardTextBox.message = ""
                that.otherLogTxt = '返回';
                that.showOCR = false;
                that.OcrBtnText = "";
                // 如果模块需要支持ocr, 通过路由参数判断需要支持哪类证件
                // ocrCardType ocr类型:0-身份证 1-工商营业执照 '' 默认两个都要
                if(!_.isEmpty(that.$route.query) && !_.isEmpty(that.$route.query.ocrCardType)) {
                    that.ocrCardType = that.$route.query.ocrCardType;
                    that.showOCR = true;
                    that.OcrBtnText = "OCR识别";
                    // 无需播放语音，直接展示 OCR 选择页
                    that.voiceTitletTxt = "";
                    that.showOcrCard = true;
                    that.idcardTextBox.title1 = "请点击屏幕右下方"
                    that.idcardTextBox.title2 = "选择 OCR 识别"
                }
            } else if (this.isByForce) { //登陆后强制读卡      
                // TODO
            } else if (this.busiCode == "V0052" || this.busiCode == "V1022"){
                that.otherLogTxt = "证件信息开户";
                that.OcrBtnText = "拍证识别";
                that.ocrCardType = "0";
                that.$route.query.ocrCardType = that.ocrCardType;
            } else if(this.busiCode  == 'V0050' || this.busiCode == 'V0051' || this.busiCode == "V1023") {
                that.ocrCardType = '10';
                that.showOCR = true;
                that.OcrBtnText = "OCR识别";
                // 无需播放语音，直接展示 OCR 选择页
                that.voiceTitletTxt = "";
                that.showOcrCard = true;
                that.idcardTextBox.title1 = "请点击屏幕右下方"
                that.idcardTextBox.title2 = "选择 OCR 识别"
                that.otherLogTxt = '证件信息开户';

                this.jumpTo('OCR');
            } 
            // 调用读卡硬件
            if (that.isVTMDevice) {
                console.log("初始化读卡")
                that.initBindIdCard();
            }
            googlePlayVoice(this.voiceTitletTxt);
            setTimeout(function() {
                that.canNotChange = false;
            }, 2000)
        },
        // 判断是否将证件信息
        judgeSaveCardImageToSession(imageInfo) {
            let that = this;
            imageInfo = JSON.parse(imageInfo);
            // 代理人读卡  模块nei
            if (!_.isEmpty(imageInfo) && 
                (that.isOrgManager || !that.isModulePage)) {
                // 登录时的 证件图片信息应该保存在session中。 便于影像上传获取
                let cardImg = [];
                cardImg.push(utyDevice.onExec("readfile64", {
                    "filename": imageInfo.frontImage
                }));
                cardImg.push(utyDevice.onExec("readfile64", {
                    "filename": imageInfo.backImage
                }));
                cardImg.push(utyDevice.onExec("readfile64", {
                    "filename": imageInfo.faceImage
                }));
                return Promise.all(cardImg).then(res => {
                    let valfront = res[0], valback = res[1], valface = res[2];
                    console.log("valfront: " + valfront.data)
                    console.log("valback: " + valback.data)
                    console.log("valface: " + valface.data)
                    that.$storage.setSession(that.$definecfg.IMAGE_INFO, {
                        valfront: valfront.data,
                        valback: valback.data,
                        valface: valface.data
                    });
                })
            }
        },
        // 初始化idcard实例
        initBindIdCard() {
            let that = this;
            // device/changcheng/chrome 目录下
            // cbParams 返回得是回调函数
            idcard.IdCardInstance(function(cbParams) {
                switch (cbParams.type) {
                    case "OpenConnectionOver":          //打开连接成功回调
                        console.log("readcard 打开连接成功了");
                        break;
                    case "AcceptAndReadTracksOver":     // 获取到得读卡数据回调
                        console.log("准备要把卡弹出去了");
                        console.log("读卡返回得数据cardData:" + cbParams.cardData)
                        that.judgeSaveCardImageToSession(cbParams.cardData.IMAGE_INFO);
                        that.EjectStart();
                        break;
                    case "CardInvalid":                 // 非法卡片回调
                        console.log("非法磁道信息 可能插入的不是身份证！！");
                        break;
                    case "ErrorInfoReceived":           // 设备错误回调
                        console.log("设备错误回调");
                        break;
                    case "EjectOver":                   // 退卡结束回调
                        that.EjectOver();
                        googleStopVoice();
                        setTimeout(() => {
                            googlePlayVoice("请取走您的身份证");
                        }, 500);
                        break;
                    case "CardTaken":                   // 取卡回调 读卡失败时的取卡回调
                        console.log("卡被取走了");
                        break;
                    case "hasNodata":                   // 读卡信息为空的回调
                        console.log("读卡信息为空:" + cbParams.msg);
                        that.cardReadSuccess = false;
                        break;
                    case "CardInserted":                // 卡插入时的回调
                        console.log("有卡插入");
                        that.CardInserted();
                        break;
                    case "readCardSuccess":             // 取卡回调 取卡成功时的取卡回调
                        console.log("读取数据成功，取卡！！ cardData" + cbParams.cardData);
                        that.cardReadSuccess = true;
                        that.readCardSuccess(cbParams.cardData);
                        break;
                    case "DeviceError":
                        that.cardReadSuccess = false;
                        that.isReRead();
                        break;
                    default:
                        if (cbParams.args == "-14" || cbParams.args == "-48" || cbParams.args == "-205") {
                            that.alert(cbParams.msg);
                        }
                }
            }, 776)
        },
        /*
         *@Description: 退卡开始，提示用户取走证件
         *@MethodAuthor: LJC
         *@Date: 2020-12-02 09:20:08
        */
        EjectStart() {
            let that = this;
            that.idcardTextBox.title1 = "识别成功！";
            that.idcardTextBox.title2 = "请取走您的证件。";
            that.idcardTextBox.messageShow = false;
            that.idcardTextBox.colorFlag = true;
        },
        /*
         *@Description: 切换读卡方式
         *@MethodAuthor: LJC
         *@Date: 2020-11-20 14:31:36
        */
        jumpTo: _.throttle(function(type) {
            if (this.isVTMDevice) {
                try {
                    idcard.CancelAccept(); //取消阅读
                } catch (error) {
                    console.error("弹出读卡设备调用失败，原因：" + error.message);
                    this.alert("弹出卡片失败！");
                }
            }
            // 0-未读卡 1-读卡
            this.$storage.setSession(this.$definecfg.READ_CARD, "0");
            // isModulePage其他模块跳转到改页面会传入一个参数
            if(type == "OCR"){
                // this.$router.replace({path: "/ocrRecognize"});
                this.showOcrCard = true;
            } else if(this.isModulePage) {
                // 资料修改取消读卡需要定位显示到之前点击读卡的模块
                this.$store.commit(this.$types.UPDATE_READ_CARD_CANCEL_INFO, {
                    READ_CARD: '0',
                    groupInfo: this.$route.query.groupInfo || {},
                });

                this.$router.goBackCurrent();
            } else if((this.$syscfg.isOpenAcctBiz(this.busiCode) || this.$syscfg.isOpenDobuleBiz(this.busiCode)) && !this.isOrgManager) {
                //开户业务 可以不读卡跳转客户识别，然后手动输入三要素（custData不为空），但是证件类型为身份证，则会回到读卡页面，读卡成功后才能继续公安联网校验
                this.$router.replace({ name: 'customerRecognition'});
            } else if (this.isOrgManager && this.$syscfg.isOpenAcctBiz(this.busiCode)){
                this.$router.replace({ name: "orgManager" });
            } else if(this.isOrgManager && !this.$syscfg.isOpenAcctBiz(this.busiCode)) { //手动录入经办人信息
                this.$router.replace({ name: "orgManager", params: {isJustCustLogin: this.isJustCustLogin} });
            } else {
                if(type == "acctLog"){
                    this.$router.replace({ path: "/customerLogin"});
                }
            }
        }, 2000, { 'trailing': false }),
        isReRead() {
            let that = this;
            let msg = "", secondTip = "", 
                confirmBtnText = "", cancelBtnText = "";

            if (that.cardReadSuccess) {
                msg = "您的证件已过期，请使用有效证件办理业务！";
                secondTip = "";
                confirmBtnText = "重新读卡";
                cancelBtnText = "返回首页";
            } else {
                msg = "信息读取失败，请收好您的证件";
                secondTip = "您可选择【重新读卡】或选择【证件信息认证】方式";
                confirmBtnText = "重新读卡";
                cancelBtnText = "证件信息认证";
            }
            that.messageBox({
                typeMessage: 'error',
                imageTipName: 'error',
                messageText: msg,
                secondTip: secondTip,
                confirmButtonText: confirmBtnText,
                cancelButtonText: cancelBtnText,
                confirmedAction () {
                    that.idcardTextBox = {
                        title1: '请插入您的',
                        title2: '二代身份证/港澳台居民居住证',
                        message: "其它证件请选择账号识别方式",
                        messageShow: true,
                        colorFlag: false,
                        idCardTextShow: true,
                    };
                    setTimeout(function() {
                        idcard.Reset();
                        idcard.reRead();
                    }, 1000);
                },
                canceledAction () {
                    if (!that.cardReadSuccess) {
                        that.jumpTo('acctLog');
                    } else {
                        that.$router.replace({path: that.$bizhomecfg.getHomeConfig()});
                    }
                }
            })
        },
        isReOcr() {
            let that = this;
            that.messageBox({
                typeMessage: 'error',
                imageTipName: 'error',
                messageText: "您的证件已过期，请使用有效证件办理业务！",
                confirmButtonText: "重新识别",
                cancelButtonText: "返回首页",
                confirmedAction () {
                    that.jumpTo('OCR');
                },
                canceledAction () {
                    that.$router.replace({path: that.$bizhomecfg.getHomeConfig()});
                }
            })
        },
        // 判断结果是否满足业务办理需求
        judegReReadStatu(data) {
            let that = this;
            // 重新读卡
            if (!that.isOcrResult) {
                if (!that.cardReadSuccess) {
                    that.isReRead();
                    return false;
                }
                // 如果证件有效期过期
                if (date.getDifferDays(date.getClientDate() ,data.ID_EXP_DATE) == -1) {
                    that.isReRead();
                    return false;
                }
            } 
            // 重新识别
            else {
                // 如果证件有效期过期
                if (date.getDifferDays(date.getClientDate() ,data.ID_EXP_DATE) == -1) {
                    that.isReOcr();
                    return false;
                }
            }
        },
        async readCardSuccess(data, isOcrResult) {
            let that = this;
            // OCR返回的结果
            that.isOcrResult = isOcrResult;
            // 兼容有效期为长期的情况
            if (data.ID_EXP_DATE == "长期") {
                data.ID_EXP_DATE = "30001231";
            }
            if (!that.isModulePage) {
                let checkReuslt = that.judegReReadStatu(data) === false ? true : false;
                if (checkReuslt) {
                    return;
                }
            }
            // 是否读卡 由于有两个读卡的过程(登录读卡与经办人读卡) 这个值的设置
            // ocr不算读卡
            if (!that.isOrgManager && !that.isModulePage && !isOcrResult) {
                that.$storage.setSession(that.$definecfg.READ_CARD, "1");
            }
            let countryDict = await dict.getDictData("NATIONALITY");
            data.NATIONALITY_TEXT = data.NATIONALITY;
            data.NATIONALITY = this.getDictKeyByValue(countryDict.NATIONALITY, data.NATIONALITY);
            //读卡成功后 将id_add地址 全角转半角
            data.ID_ADDR = utils.toCDB(data.ID_ADDR);
            that.$store.commit(that.$types.UPDATE_CARD_DATA, data);
            that.custData = that.userType == '0' ? that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO) : that.$storage.getJsonSession(that.$definecfg.ORG_CURRENT_AGENT);
            
            // 机构开户或产品开户开户ocr识别数据，需要回填到资料录入部分，为防止被代理人读卡或OCR数据覆盖
            if (that.$syscfg.isOpenAcctBiz(that.busiCode) && !that.isOrgManager && isOcrResult){
                this.$store.commit('UPDATE_OCR_READ_INFO', data);
            }

            // 是否为休眠账户读卡界面
            if (this.isSleepFlag 
                && !this.isModulePage
                && !this.isOrgManager) {
                let customerInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO);
                // 判断读卡信息和证件信息是否一致
                // 可包含升位的
                if (data.CUST_FNAME == customerInfo.CUST_FNAME && data.ID_TYPE == customerInfo.ID_TYPE) {
                    if (customerInfo.ID_TYPE == "00") {
                        if ((customerInfo.ID_CODE.length == 15 && utils.updateCardNo(customerInfo.ID_CODE) == data.ID_CODE)
                            || (customerInfo.ID_CODE.length == 18 && customerInfo.ID_CODE == data.ID_CODE)) {
                            // 对比一样登录成功
                            this.showPoliceValidate = true;
                        } else {
                            // TODO 弹窗提示 前往柜台办理
                            that.messageBox({
                                typeMessage: "warn",
                                messageText: "身份识别未通过，请前往柜台办理。",
                                confirmButtonText: '确认',
                                confirmedAction: function(){  
                                that.$router.replace({ path: that.$bizhomecfg.getHomeConfig() });
                                },
                            })
                        }
                    } else {
                        if (data.ID_CODE == customerInfo.ID_CODE) {
                            // 对比一样登录成功
                            this.showPoliceValidate = true;
                        } else {
                            // TODO 弹窗提示 前往柜台办理
                            that.messageBox({
                                typeMessage: "warn",
                                messageText: "身份识别未通过，请前往柜台办理。",
                                confirmButtonText: '确认',
                                confirmedAction: function(){  
                                that.$router.replace({ path: that.$bizhomecfg.getHomeConfig() });
                                },
                            })
                        }
                    }
                } else {
                    // TODO 弹窗提示 前往柜台办理
                    that.messageBox({
                        typeMessage: "warn",
                        messageText: "身份识别未通过，请前往柜台办理。",
                        confirmButtonText: '确认',
                        confirmedAction: function(){  
                        that.$router.replace({ path: that.$bizhomecfg.getHomeConfig() });
                        },
                    })
                }
            } else if (that.isModulePage) {
                let readCardInfo = {
                    moduleId: that.$route.query.moduleId || "",
                    groupInfo: that.$route.query.groupInfo || {},
                    cardInfo: data,
                    from: "readCard"
                }
                that.$store.commit(that.$types.UPDATE_READ_CARD_SUCCESS, readCardInfo);
                that.$router.goBackCurrent(readCardInfo);
            } else if (that.custData) {// 开户业务 如果已经手动输入三要素（custData不为空），且证件类型为身份证，则会回到读卡页面，读卡成功后才能继续公安联网校验
                that.showPoliceValidate = true;
            } else if (that.$syscfg.isOpenAcctBiz(that.busiCode) && that.userType == "0") {// 开户业务，读卡成功后跳转公安联网，但因为没有跳转客户识别页面，所以要手动保存客户三要素
                let customerInfo = Object.assign(data, {
                    USER_TYPE: this.userType,
                    USER_FNAME: data.CUST_FNAME,
                    CUST_NAME: data.CUST_FNAME
                })
                let userInfo = that.$storage.getJsonSession(that.$definecfg.USER_INFO);
                customerInfo.INT_ORG = userInfo.ORG_CODE;
                customerInfo.ORG_CODE = userInfo.ORG_CODE;
                customerInfo.ORG_NAME = userInfo.ORG_NAME;
                this.$storage.setSession(this.$definecfg.CUSTOMER_INFO, customerInfo);
                this.showPoliceValidate = true;
            } else if (this.isOrgManager) { //机构经办人读卡成功以后跳转到机构经办人
                // 将读卡信息保存在 customerInfo 中，便资料录入是填充
                let custInfo =  that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO) || {};
                custInfo.AGENT_CARD_INFO = data;
                that.$storage.setSession(that.$definecfg.CUSTOMER_INFO, custInfo);
                this.$router.replace({ name: "orgManager", params: {isJustCustLogin: this.isJustCustLogin} });
            } else if (that.$syscfg.isOpenAcctBiz(that.busiCode) || that.$syscfg.isOpenDobuleBiz(that.busiCode)) { //机构、产品开户
                this.$router.replace({ name: "customerRecognition" });
            } else {
                if (this.isCustLogin) {
                    //已经登陆过了  直接跳公安
                    this.showPoliceValidate = true;
                } else {
                    this.$router.replace({ path: "/customerLogin" });
                }
            }
        },
        reCheckPolice(val) {
          this.showPoliceValidate = val;  
        },
        CardInserted () {
            // 插入卡后不展示其他方式登录
            this.canOtherLog = false;
            this.showOCR = false;
        },
        EjectOver () {
            this.canOtherLog = true;
            this.imgBox.imgSrc = idCardOutImg;
        },
        /**
         * 根据字典项名称获取字典项
         * @param {Object} dictData 字典数组
         * @param {String} value 字典项名称
         * @returns 字典项
         */
        getDictKeyByValue(dictData, value) {
            let dict = _.find(dictData, obj => {
                return obj.DICT_ITEM_NAME == value;
            })
            return _.isEmpty(dict) ? "" : dict.DICT_ITEM;
        }, 
        removeCardInfo() {
            this.$storage.removeSession(this.$definecfg.IMAGE_INFO);
            this.$store.commit(this.$types.UPDATE_CARD_DATA, null);
            this.$storage.removeSession(this.$definecfg.READ_CARD);
            this.isVTMDevice && deleteAllCustFile();
        },

        ocrBackAction:function(val){
            this.removeCardInfo();
            this.showOcrCard = val;
        },
        ocrBackCardType:function(val){
            if(val == "00"){
                this.ocrCardType = "0";
            }else if(val == "10"){
                this.ocrCardType = "1";
            }
        },
        //OCR回调结果
        ocrSeccessAction(val){
            let that = this;
            that.showOcrCard = false;
            if (val.ID_TYPE == "10") {
                that.parseBusinessLicence(val);
            }
            val.IS_OCR = true;
            that.cardReadSuccess = true;
            that.readCardSuccess(val, true);
        },
        parseBusinessLicence(val) {
            // 成立日期要去掉中文
            val.FOUND_DATE = val.FOUND_DATE.replace(new RegExp("[\\u4E00-\\u9FFF]+","g"), "");
            // 处理注册货币类型、注册资金
            if (val.REGISTER_FUND.includes("人民币")) {
                val.REGISTER_CURRENCY = "CNY";
            } else if (val.REGISTER_FUND.includes("港币")) {
                val.REGISTER_CURRENCY = "HKD";
            } else if (val.REGISTER_FUND.includes("美元")) {
                val.REGISTER_CURRENCY = "USD";
            }
            val.REGISTER_FUND = val.REGISTER_FUND.replace(new RegExp("[\\u4E00-\\u9FFF]+","g"), "");
            // 简称
            val.CUST_NAME = utils.getCustName(val.CUST_FNAME);
        },
        ocrCloseAction(val){
            if(val == false){
                this.showOcrCard =  false;
            }
            console.log("OCR回调ocrCloseAction结果=",val);
        },
        messageAlert(msg, typeMessage, callBack, cancel) {
            let that = this;
            that.messageBox({
                typeMessage: typeMessage || 'question',
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
    }
};
</script>

<style lang="less" scoped>
.readCard {
    color: #4A90E2;
    text-align: center;
    height: 926px;
    background-image: linear-gradient(270deg, #E0EEFF 0%, #EAF3FC 100%);
    box-shadow: 0px 4px 16px 0px 
        rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    // margin: 10px 59px 34px 59px;
    padding: 0;
    width: 1802px;
    position: relative;
    z-index: 2;
    .readCard-page {
        width: 100%;
        height: 100%;
        position: relative;
        .content-container {
            display: flex;
            width: 100%;
            height: 100%;
            position: relative;
            .idcard-img-box {
                height: 80%;
                width: 50%;
                padding-top: 86px;
                // padding-left: 60px;//156px
                // padding-right: 118px;
                div {
                    font-family:Alibaba PuHuiTi;
                    color:#252525;
                    font-size:26px;
                    text-align: center;
                    line-height: 36px;
                    
                }
                .leftImgClass {
                    margin-top: -36px;
                    width: 685.356px;
	                height: 672.343px;
                }
            }
            .content-box {
                position: relative;
                height: 100%;
                width: 50%;// 754px
                .idcard-text-box {
                    width: 90%;//754px;
                    height: 650px;
                    box-sizing: border-box;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    margin: 128px 0 0 0; 
                    // padding-left: 86px; //yangyp
                    border-radius: 8px;	
                    line-height: 138px;
                    background-color: #fdfeff;
                    box-shadow:0px 2px 10px rgba(0, 79, 255, 0.2);
                    .blue {
                        color: rgba(31, 89, 219, 1) !important;
                    }
                    .idcard-text-title {
                        width: 620px;
                        font-family: Alibaba PuHuiTi;
                        font-size: 42px;
                        text-align: left;
                        font-weight: 700;
                        line-height: 68px;
                        color:#252525;
                        margin-left: 5%;
                    }
                    .idcard-text-message {
                        width: 500px;
                        padding-top: 14px;
                        font-family: Alibaba PuHuiTi;
                        font-size: 24px;
                        font-weight: normal;
                        text-align: left;
                        line-height: 68px;
                        color:#464646;
                        margin-left: 5%;
                    }
                }
            }
        }
        .other-login-content {
            position: absolute;
            right: 10%;
            top: 818px;
            .other-login {
                background: rgba(1,1,1,0);
                border: none;
                color: #1f5ade;
                font-size: 26px;
                padding: 0px;
            }
            .separate{
                width: 0px;
				height:24px;
				margin: 0px 20px;
				border:1px solid;
				border-color:#b7b7b7;
            }
            .el-button.other-login.is-disabled{
                opacity: 0.5;
            }
        }
    }
    .check-mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        .mask-content-box {
            width: 52vw;
            height: 36vw;
            background-color: white;
            opacity: 1;
            border-radius: 1vw;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            img {
                display: block;
                width: 23vw;
                height: 23vw;
            }
            .maskText {
                font-size: 2.4vw;
                font-weight: bold;
                // font-family: yahei;
                text-align: center;
                margin-top: 2.4vw;
            }
        }
    }
}
</style>