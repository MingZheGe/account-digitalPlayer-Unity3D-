<template>
    <div class="id-card-scan">
        <div class="scan-content">
            <div class="scan-title">
                <span>请扫描：{{clsInfo.IMG_CLS_NAME}}{{clsInfo.IMG_CLS == '022' ? '(请将证件横向放入扫描箱)' : ''}}</span>
            </div>
            <!-- 确定帧数 -->
            <div class="scan-info" v-if="!showAdd">
                <div class="scan-box" v-for="i in minClsNum" :key="i">
                    <div class="scan-box-title">
                        {{titleTextArr[i-1]}}
                    </div>
                    <div class="scan-box-img">
                        <div class="scan-img">
                            <img @click="showBig(i)" :src="(scanImgList[i - 1] && scanImgList[i - 1].imgSrc) || require('@icons/yinheVTM/cardScan/pic-Front-IDcard.svg')">
                        </div>
                    </div>
                    <div class="scan-box-footer">
                        <el-button @click="startScan(i - 1)" class="scanning" icon="el-icon-scan">
                            点击扫描
                        </el-button>
                    </div>
                </div>
            </div>
            <!-- 不确定帧数 -->
            <!-- <div class="scan-add-info" v-else>
                <el-carousel :autoplay="false" type="card" indicator-position="none" :loop="false">
                    <el-carousel-item v-for="item in minClsNum" :key="item">
                        <h3 class="medium">{{ item }}</h3>
                    </el-carousel-item>
                </el-carousel>
            </div> -->
            <div class="scan-add-info" v-else>
                <!-- 循环多少次要看 已经采集了多少帧 -->
                <div 
                    class="scan-add-box"
                    :class="i == activeIndex ? 'is-activate' : ''"
                    v-for="i in (scanImgList.length + 1)" 
                    :key="i"
                    v-if="
                    i == activeIndex - 1 ||
                    i == activeIndex ||
                    i == activeIndex + 1"
                >
                    <div class="add-box" v-if="i == (scanImgList.length + 1)">
                        <div class="scan-box-title">
                            第{{i}}页
                        </div>
                        <div @click="addScanBox" class="add-box-oper">
                            <img :src="require('@icons/yinheVTM/imageNode/imageScan/icon-img-add.svg')">
                        </div>
                    </div>
                    <div class="scan-box" v-else>
                        <div class="scan-box-title">
                            第{{i}}页
                        </div>
                        <div class="scan-box-img">
                            <div class="scan-img">
                                <img @click="showBig(i)" :src="
                                    (scanImgList[i - 1] && scanImgList[i - 1].imgSrc) || require('@icons/yinheVTM/cardScan/pic-Front-IDcard.svg')
                                ">
                            </div>
                        </div>
                        <div class="scan-box-footer">
                            <el-button @click="startScan(i - 1)" class="scanning" icon="el-icon-scan">
                                点击扫描
                            </el-button>
                        </div>
                    </div>
                </div>
                <section v-if="scanImgList.length >= 3" class="button-arrow-wrap">
                    <button
                        type="button"
                        class="el-carousel__arrow el-carousel__arrow--left"
                        @click="changeCurrentScane(-1)"
                    >
                        <i class="el-icon-arrow-left"></i>
                    </button>
                    <button
                        type="button"
                        class="el-carousel__arrow el-carousel__arrow--right"
                        @click="changeCurrentScane(+1)"
                    >
                        <i class="el-icon-arrow-right"></i>
                    </button>
                </section>
            </div>
        </div>
        <div class="footer">
            <el-button class="go-to-blzflow" @click="goToBizFlow">
                <img :src="require('@icons/common/icon-back-edit.svg')"/>
                <span class="show-more">修改资料</span>
            </el-button>
            <el-button v-show="isShowPreBtn" @click="prevStep" class="prev-step">上一步</el-button>
            <el-button :disabled="!canGoNext" @click="submitScan" class="scan-over">采集完毕</el-button>
            <el-button class="scan-pass" v-if="isForTest" @click="goNext">跳过</el-button>
        </div>
        <div v-if="isStartCam" class="open-height-cam">
            <div class="prop-scan-conent">
                <img @click="closeHighCamera" class="prop-close" :src="require('@img/yinhe/imageNode/idcard/icon_guanbi.png')">
                <div class="high-box">

                </div>
                <div class="start-scan-box">
                    <el-button @click="capture" class="start-scan-button" icon='el-icon-scan'>
                        点击扫描
                    </el-button>
                </div>
            </div>
        </div>
        <div v-if="showBigImg" class="show-big">
            <div class="show-big-box">
                <img @click="closeHighCamera" class="prop-close" :src="require('@img/yinhe/imageNode/idcard/icon_guanbi.png')">
                <img :class="mainWidth ? 'big-img-main-wdith': 'big-img-main-height'" ref="bigImg" :src="currentBigImg">
            </div>
        </div>
        <loading :showLoading="showLoading" :loadingText="loadingText"></loading>
    </div>
</template>
<script>
import { googlePlayVoice } from '../../../device/voice/voice';
import { checkIDCardStatus, getImgBase64, ocrGetInfoByYinhe } from "../../../service/image-service"
import dict from "../../../tools/dict"
import loading from "../../../components/common/loading";

export default {
    data() {
        return {
            activeIndex: 1,
            minClsNum: 1,
            iwidth: 730,
            iheight: 900,
            itop: 52,
            ileft: 595,
            scanImgList: [],
            titleTextArr: [],
            showAdd: false,         // 是否采集多帧
            isStartCam: false,      // 是否展示高拍仪
            scanObj: null,
            canScan: false,         // 用于判断预览窗口是否打开完成 能否进行采集
            clickIndex: 0,          // 当前正在操作的数据索引
            canGoNext: false,       // 是否可以进行下一步  
            pageNumArr: [], 
            currentBigImg: '',
            showBigImg: false,
            mainWidth: false,       // 展示大图时 以宽为准 还是以高为准
            showLoading: false,
            loadingText: '正在查询您的数据信息....',
            specialBusiCode: ['V0049'],
            RULE_LIST: {
                "022": ["20001", "20002"],
                "11h": ["20006", "20007"],
            }
        }
    },
    props: [
        "clsInfo",
        "persionIdArr", // 个人确定帧
        "orgIdArr",     // 代理人确定帧
        "othersArr",    // 其他不确定帧
        "imgStateObj",
        "imageSnObj",
        "pageNumObj",
        "isForTest",
        "isShowPreBtn",
        "historyIdCardInfo"
    ],
    computed: {
        // 非生产环境不调用硬件
        isVTMDevice() {
            return this.$store.state.isVTMDevice;
        },
        busiCode(){
            return this.$store.state.busicode;
        },
    },
    components: {
        loading
    },
    mounted() {
        console.log("idcardscan mounted");
        this.initInfo()
    },
    destroyed() {
        this.scanObj && this.scanObj.destroyHighCamera();
    },
    methods: {
        // 上一步
        prevStep() {
            this.$emit("prevStep")
        },
        goToBizFlow() {
            this.$router.goRoute(this.$router.getDataInputNodeIndex());
        },
        goNext () {
            this.$emit('jumpTo', { jumpTo: true });
        },
        showBig(index) {
            let that = this;
            if (that.scanImgList[index - 1] && that.scanImgList[index - 1].imgSrc) {
                that.showBigImg = true;
                that.currentBigImg = that.scanImgList[index - 1].imgSrc;
                let image = new Image();
                image.onload = (e) => {
                    console.log(e)
                    let target = e.target;
                    // 如果宽大于高  
                    if (target.width > target.height) {
                        that.mainWidth = true;
                    } else {
                        that.mainWidth = false;
                    }
                }
                image.src = that.currentBigImg;
            } else {
                this.showBigImg = false;
                this.currentBigImg = "";
            }
        },
        initInfo() {
            let that = this;
            let custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO);
            let busiData = JSON.parse(this.$storage.getSession(this.$definecfg.BUSI_INFO)) || {};
            //只要调用了这个组件，证明开始扫描新的影像类别，然后这个影像类别就播放一次语音即可
            googlePlayVoice("请将" + that.clsInfo.IMG_CLS_NAME + "放入扫描箱");
            that.showLoading = true;
            that.loadingText = "正在查询您的数据信息....";
            return Promise.all([
                dict.transformDict(custInfo, ["ID_TYPE"]),
            ]).then(function (resultData) {
                // 获取影像的最小帧
                that.minClsNum = parseInt(that.clsInfo.MIN_PAGE_CNT || that.clsInfo.MIN_PAGENUM || 1);
                that.activeIndex = 1;
                custInfo = resultData[0];
                if (
                    custInfo.USER_TYPE == "0" 
                    && that.persionIdArr 
                    && that.persionIdArr.indexOf(that.clsInfo.IMG_CLS) != -1
                ) {
                    // 展示两帧
                    that.showAdd = false;
                    that.minClsNum = 2;
                    let idType = custInfo.ID_TYPE;
                    if (_.indexOf(that.specialBusiCode, that.busiCode) > -1) {
                        idType = busiData.NEW_BASE_INFO && busiData.NEW_BASE_INFO.ID_TYPE || custInfo.ID_TYPE;
                    }
                    that.titleTextArr = that.getIdDic(idType) || [];
                } else if (
                    custInfo.USER_TYPE != "0" 
                    && that.clsInfo 
                    && that.orgIdArr.indexOf(that.clsInfo.IMG_CLS) != -1
                ) {
                    // 展示两帧
                    that.showAdd = false;
                    //代理人（经办人）身份证明文件（开户代理人身份证明文件）
                    let orgManager = that.$storage.getJsonSession(that.$definecfg.ORG_CURRENT_AGENT);
                    let idType = orgManager.ID_TYPE;
                    that.titleTextArr = that.getIdDic(idType) || [];
                } else {
                    //  采集多帧 展示两帧
                    that.showAdd = true;
                }
                //判断是否有采集的历史影像 有的话需要展示
                let imgSn = that.imageSnObj[that.clsInfo.IMG_CLS];
                if (imgSn) {
                    that.pageNumArr = that.pageNumObj[that.clsInfo.IMG_CLS];
                    let reqArr = []
                    _.each(that.pageNumArr, pageNum => {
                        reqArr.push(getImgBase64({
                            IMG_SN: imgSn,
                            PAGE_NUM: pageNum
                        }))
                    })
                    
                    return Promise.all(reqArr).then(res => {
                        let newcollectedImgData = [];
                        _.each(res, item => {
                            let imgData = _.get(item, "Data[0].IMG_DATA", "");
                            let pageNum = _.get(item, "Data[0].PAGE_NUM", "");
                            newcollectedImgData.push({
                                src: imgData,
                                imagecls: that.clsInfo.IMG_CLS,
                                imgfmt: that.clsInfo.IMG_FMT,
                                pageNum: pageNum,
                                imgSrc: "data:image/jpg;base64," + imgData
                            })
                        })
                        that.scanImgList = newcollectedImgData;
                        that.activeIndex = that.scanImgList.length;
                        that.changeCanGoNextButtonStatus();
                    }).catch(err => {
                        console.error(err)
                        that.messageBox({
                            typeMessage: "error",
                            messageText: "" + err,
                            confirmButtonText: "确定",
                            confirmedAction: function(){},
                        })
                        if (that.showAdd) {
                            let scanItem = {
                                src: "",
                                imgSrc: "",
                                imagecls: that.clsInfo.IMG_CLS,
                                imgfmt: that.clsInfo.IMG_FMT,
                                pageNum: ""
                            };
                            that.scanImgList.push(scanItem);
                        } else {
                            let readCardInfo = JSON.parse(that.$storage.getSession(that.$definecfg.IMAGE_INFO));
                            let newcollectedImgData = [];
                            if(readCardInfo){
                                newcollectedImgData.push({
                                    src: readCardInfo.valfront,
                                    imagecls: that.clsInfo.IMG_CLS,
                                    imgfmt: that.clsInfo.IMG_FMT,
                                    pageNum: "",
                                    imgSrc: "data:image/jpg;base64," + readCardInfo.valfront
                                });
                                newcollectedImgData.push({
                                    src: readCardInfo.valback,
                                    imagecls: that.clsInfo.IMG_CLS,
                                    imgfmt: that.clsInfo.IMG_FMT,
                                    pageNum: "",
                                    imgSrc: "data:image/jpg;base64," + readCardInfo.valback
                                });
                                that.scanImgList = newcollectedImgData;
                                that.activeIndex = that.scanImgList.length;
                                that.changeCanGoNextButtonStatus();
                            } else {
                                that.scanImgList = [];
                            }
                        }   
                    })
                } else if (that.historyIdCardInfo.length > 0) {
                    let reqArr = [];
                    _.each(that.historyIdCardInfo, item => {
                        reqArr.push(getImgBase64({
                            IMG_SN: item.IMG_SN,
                            PAGE_NUM: item.PAGE_NUM
                        }))
                    })

                    return Promise.all(reqArr).then(res => {
                        let newcollectedImgData = [];
                        _.each(res, item => {
                            let imgData = _.get(item, "Data[0].IMG_DATA", "");
                            newcollectedImgData.push({
                                src: imgData,
                                imagecls: that.clsInfo.IMG_CLS,
                                imgfmt: that.clsInfo.IMG_FMT,
                                pageNum: "",
                                imgSrc: "data:image/jpg;base64," + imgData
                            })
                        })
                        that.scanImgList = newcollectedImgData;
                        that.activeIndex = that.scanImgList.length;
                        that.changeCanGoNextButtonStatus();
                    }) 
                } else {
                    if (that.showAdd) {
                        let scanItem = {
                            src: "",
                            imgSrc: "",
                            imagecls: that.clsInfo.IMG_CLS,
                            imgfmt: that.clsInfo.IMG_FMT,
                            pageNum: ""
                        };
                        that.scanImgList.push(scanItem);
                    } else {
                        let readCardInfo = JSON.parse(that.$storage.getSession(that.$definecfg.IMAGE_INFO));
                        let newcollectedImgData = [];
                        if(readCardInfo){
                            newcollectedImgData.push({
                                src: readCardInfo.valfront,
                                imagecls: that.clsInfo.IMG_CLS,
                                imgfmt: that.clsInfo.IMG_FMT,
                                pageNum: "",
                                imgSrc: "data:image/jpg;base64," + readCardInfo.valfront
                            });
                            newcollectedImgData.push({
                                src: readCardInfo.valback,
                                imagecls: that.clsInfo.IMG_CLS,
                                imgfmt: that.clsInfo.IMG_FMT,
                                pageNum: "",
                                imgSrc: "data:image/jpg;base64," + readCardInfo.valback
                            });
                            that.scanImgList = newcollectedImgData;
                            that.activeIndex = that.scanImgList.length;
                            that.changeCanGoNextButtonStatus();
                        } else {
                            that.scanImgList = [];
                        }
                    }   
                }
            }).finally(() => {
                that.showLoading = false;
            })
        },

        changeCurrentScane (i) {
            if (this.activeIndex + i >= (this.scanImgList.length + 1) || this.activeIndex + i <= 1) {
                return
            }
            //展示当前选择的扫描件
            this.activeIndex += i;
        },
        // 添加
        addScanBox() {
            let that = this;
            let scanLength = that.scanImgList.length;
            let lastImg = that.scanImgList[scanLength -1];
            if (lastImg.imgSrc) {
                let scanItem = {
                    src: "",
                    imgSrc: "",
                    imagecls: that.clsInfo.IMG_CLS,
                    imgfmt: that.clsInfo.IMG_FMT,
                    pageNum: ""
                };
                that.scanImgList.push(scanItem);
                that.activeIndex = that.scanImgList.length;
                that.startScan(that.scanImgList.length - 1)
            } 
        },
        startScan(index) {
            this.isStartCam = true;
            this.clickIndex = index;
            //调用高拍仪硬件
            this.openHighCamera();
        },
        openHighCamera() {
            let that = this
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
                    case "StopTakePictureOver":
                        console.log("外传的停止关闭高拍仪");
                        break;
                    case "GetPictureSyncOver":
                        if (cbParams.result == "0") {
                            that.captureExtend(cbParams.collectedImage);
                        } else {
                            console.error("拍照失败");
                        }
                        break;
                    case "DeviceError":
                        console.error(cbParams.msg);
                        break
                    default:
                        console.log("走了默认的事件");
                        break;  
                }
            }, param);
            that.scanObj = highcamera;
        },
        closeHighCamera () {
            if (this.showBigImg) {
                this.showBigImg = false;
                this.currentBigImg = "";
            } else {
                if (this.isVTMDevice) {
                    this.scanObj && this.scanObj.hidCameraWin();
                }
                //等高拍仪硬件窗口关闭再关闭
                setTimeout(() => {
                    this.isStartCam = false;
                    this.canScan = false;
                }, 500)
            }
        },
        capture() {
            let that = this;
            if (!that.isVTMDevice) {
                this.canScan = false;
                this.isStartCam = false;
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
        startTakePictureOver() {
            let that = this;
            // 延迟一段时间再设置可以 扫描，否则可能预览窗口没打开就能进行采集
            setTimeout(function() {
                that.canScan = true;
            }, 1500);
        },
        captureExtend(collectedImage) {
            let that = this;
            that.collectedImage = collectedImage;
            let custInfo = that.$storage.getJsonSession(that.$definecfg.CUSTOMER_INFO);
            let busiData = JSON.parse(this.$storage.getSession(this.$definecfg.BUSI_INFO)) || {};

            let scanItem = {
                src: that.collectedImage,
                imgSrc: "data:image/jpg;base64," + that.collectedImage,
                imagecls: that.clsInfo.IMG_CLS,
                imgfmt: that.clsInfo.IMG_FMT,
                pageNum: ""
            };
            if (that.clsInfo.IMG_CLS == "022" || that.clsInfo.IMG_CLS == "11h") {
                that.showLoading = true;
                that.loadingText = "证件照质检中...";
                return checkIDCardStatus({
                    RULE_CODE: that.RULE_LIST[that.clsInfo.IMG_CLS][that.clickIndex],
                    CUST_NAME: custInfo.CUST_NAME,
                    ID_CODE: custInfo.ID_CODE,
                    CUST_CODE: custInfo.CUST_CODE,
                    ID_TYPE: custInfo.ID_TYPE,
                    IMG_PHOTO1: collectedImage, // 现场照
                }).then(async (res) => {
                    let isPass = true;
                    _.each(_.get(res, "Data[0].RESULT_LIST[0].DIFF"), item => {
                        if (item.IS_PASS == "0") {
                            isPass = false;
                            return false;
                        }
                    })
                    if (isPass) {
                        // 客户资料变更 TODO OCR识别客户证件有效期，看是否一致
                        // 反面需要识别出有效期
                        if(that.specialBusiCode.indexOf(that.busiCode) > -1&& that.clickIndex == 1) {
                            let data = await ocrGetInfoByYinhe("back", collectedImage);
                            if(data.Code == "0"){
                                if(data.Data && data.Data.length && data.Data[0] && data.Data[0].ERROR_CODE == "0"){
                                    let sideType = data.Data[0].SIDE;
                                    if(sideType != undefined && sideType != ""){
                                        let beginData = _.get(data, "Data[0].BEGIN_DATE", "");
                                        let endDate = _.get(data, "Data[0].END_DATE", "");
                                        // 证件有效期和数据中的不一致则需要提示
                                        if (endDate != busiData.CUST_BASIC_INFO.ID_EXP_DATE || beginData != busiData.CUST_BASIC_INFO.ID_BEG_DATE) {
                                            that.messageBox({
                                                typeMessage: "warn",
                                                messageText: "证件开始日期/有效期与系统内证件开始日期/有效期不一致，请返回更改。",
                                                confirmButtonText: "资料修改",
                                                confirmedAction: function(){
                                                    that.goToBizFlow()
                                                },
                                            })
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                        that.showLoading = false;
                        that.scanImgList.splice(that.clickIndex, 1, scanItem);
                        that.changeCanGoNextButtonStatus();
                    } else {
                        that.showLoading = false;
                        that.messageBox({
                            typeMessage: "warn",
                            messageText: "证件照拍摄不规范，是否重新拍摄？",
                            confirmButtonText: "重拍",
                            confirmedAction: function(){},
                            cancelButtonText: "保留",
                            canceledAction: () => {
                                that.scanImgList.splice(that.clickIndex, 1, scanItem);
                                that.changeCanGoNextButtonStatus();
                            }
                        })
                    }
                }).catch(err => {
                    that.showLoading = false;
                    that.messageBox({
                        typeMessage: "warn",
                        messageText: "证件照质检失败，是否重新拍摄？",
                        confirmButtonText: "重拍",
                        confirmedAction: function(){},
                        cancelButtonText: "保留",
                        canceledAction: () => {
                            that.scanImgList.splice(that.clickIndex, 1, scanItem);
                            that.changeCanGoNextButtonStatus();
                        }
                    })
                })
            } else {
                that.scanImgList.splice(that.clickIndex, 1, scanItem);
                that.changeCanGoNextButtonStatus();
            }
            
        },
        changeCanGoNextButtonStatus() {
            if (_.compact(this.scanImgList).length >= this.minClsNum) {
                this.canGoNext = true
            } else {
                this.canGoNext = false;
            }
        },
        submitScan () {
            let that = this;
            _.each(that.scanImgList, (item, index) => {
                item["pageNum"] = that.pageNumArr[index] || "";
            })
            this.$emit("submitScan", that.scanImgList);
        },
        getIdDic (idType) {
            if (["00", "0s", "0i", "0j"].indexOf(idType) != -1) {
                return ["头像面", "徽章面"];
            } else if (["0b", "0c", "0d"].indexOf(idType) != -1) {
                return ["头像面", "签注面"];
            }
        },
    }
}
</script>
<style lang="less">
.id-card-scan {
    font-family: Alibaba PuHuiTi;
    .el-icon-scan {
        background: url("~@icons/yinheVTM/imageNode/imageScan/icon-img-idcardscan.svg");
        background-size: cover;
    }
    .el-icon-scan::before {
        content: "重";
        font-size: 24px;
        visibility: hidden;
    }
    .scan-content {
        width: 1510px;
        height: 750px;
        .scan-title {
            width: 100%;
            padding-top: 86px;
            padding-bottom: 60px;
            
            color:#252525;
            font-size:42px;
            font-weight: 700;
            font-family: Alibaba PuHuiTi;
            line-height:68px;
            text-align:center;
        }
        .scan-box {
            width: 532px;
            height: 500px;
            border:1px solid;
            border-color:#abaeb4;
            border-radius:4px;
            box-shadow:0px 4px 16px rgba(0, 0, 0, 0.06);
            .scan-box-title {
                width: 100%;
                height: 63px;
                border-bottom: 2px solid;
                border-color: #e0e1e2;
                line-height: 63px;
                text-align: center;
                font-size: 24px;
                font-family: Alibaba PuHuiTi;
            }
            .scan-box-img {
                height: 74.4%;
                .scan-img {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    img {
                        height: 68%;
                    }
                }
            }
            .scan-box-footer {
                height: 63px;
                .scanning {
                    width: 100%;
                    height: 100%;
                    border: none;
                    font-size: 24px;
                    font-weight: 700;
                    font-family: Alibaba PuHuiTi;
                    color: #3b6aff;

                    background-image:linear-gradient(180deg,#f4f4f7 0%,#e7e8eb 100%);
                    border-radius:0px 0px 3px 3px;
                    box-shadow:0px 3px 18px rgba(0, 0, 0, 0.03);
                }
            }
        }
        .scan-info {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 1364px;
            margin: 0 auto;
        }
        .scan-add-info {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 1364px;
            margin: 0 auto;
            .scan-add-box {
                width: 360px;
                height: 360px;
                border:1px solid;
                border-color:#abaeb4;
                border-radius:4px;
                box-shadow:0px 4px 16px rgba(0, 0, 0, 0.06);
                .add-box {
                    width: 360px;
                    height: 360px;
                    background-color: #f9fafc;
                    .scan-box-title {
                        width: 100%;
                        height: 63px;
                        border-bottom: 2px solid;
                        border-color: #e0e1e2;
                        line-height: 63px;
                        text-align: center;
                        font-size: 24px;
                        font-family: Alibaba PuHuiTi;
                    }
                    .add-box-oper {
                        height: 82%;
                        img {
                            position: relative;
                            left: 50%;
                            top: 50%;
                            transform: translate(-50%, -50%);
                        }
                    }
                }
                .scan-box {
                    width: 360px;
                    height: 360px;
                }
                .scan-box-img {
                    height: 64.4%;
                    .scan-img {
                        height: 100%;
                        img {
                            height: 68%;
                        }
                    }
                }
                &.is-activate {
                    width: 530px;
                    height: 500px;
                    margin: 0 56px;
                    .scan-box {
                        width: 530px;
                        height: 500px;
                    }
                    .scan-box-img {
                        height: 74.4%;
                        .scan-img {
                            height: 100%;
                            img {
                                height: 68%;
                            }
                        }
                    }
                }
                
            }
            .button-arrow-wrap {
                .el-carousel__arrow {
                    background: none;
                    .el-icon-arrow-left::before, .el-icon-arrow-right::before {
                        color: #cecece;
                        font-size: 50px;
                    }
                }
            }
        }
    }
    .footer {
        display: flex;
        justify-content: center;
        padding-top: 50px;
        .go-to-blzflow {
            position: absolute;
            left: 81px;
            font-size: 24px;
            border: none;
            border-radius: 2px;
            background-color: #fff;
            background-image: none;
            color: #666666;
            img {
                position: relative;
                top: 6px;
            }
        }
        .scan-over, .scan-pass, .prev-step {
            width: 170px;
            height: 60px;
            font-weight: 500;
            color: #fffdfd;
            font-size: 24px;
            font-family: Alibaba PuHuiTi;
            background-image: linear-gradient(90deg, #3b6aff 0%,#208bff 100%);
            border-radius: 2px;
            &.is-disabled {
                opacity: 0.5;
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
    .show-big {
        width: 1920px;
        height: 1080px;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 11;
        background-color:rgba(0, 0, 0, 0.5);
        .show-big-box {
            width: 733px;
            height: 967px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 56px auto;
            position: relative;
            background-color: #efefef;
            .prop-close {
                position: absolute;
                top: -45px;
                right: -69px;
            }
            .big-img-main-wdith {
                width: 100%;
            }
            .big-img-main-height {
                height: 100%;
            }
        }
    }
}
</style>