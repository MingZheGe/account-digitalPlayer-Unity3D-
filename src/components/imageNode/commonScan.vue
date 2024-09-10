<template>
    <div id="common-scan-box" class="common-scan-box">
        <div class="chack-scan">
            <div class="left-part">
                <div class="top-info">
                    <div class="info-title">{{clsInfo.IMG_CLS_NAME}}<span class="info-tips" v-if="isShowTipsBtn()" @click="showTips(true)">（查看提示）</span><div class='agent-tips shake-vertical'>特别提示：纸质表单经办人处需填写“VTM自助办理”</div></div>
                </div>
                <div class="main-cont">
                    <div class="scan-content">
                        <div id="ScanWindow">
                            <div class="scan-bg">
                                <img src="@icons/yinheVTM/imageNode/imageScan/pic-image-scanloading.svg" alt="">
                                <div class="no-image-tips">别急，正在开启您的扫描之旅~</div>
                            </div>
                        </div>
                    </div>
                    <div class="scan-img-content">
                        <div class="img-num-tips"><p>已拍<b>{{scanItemLength}}</b>张</p></div>
                        <div class="scroll-box">
                            <div class="no-image-box" v-if="scanImgList.length == 0 && !this.hideRightTitle">
                                <div class="no-image-text">当前无影像!</div>
                            </div>

                            <div
                                class="scanImg"
                                v-else
                                v-for="n in minClsNum"
                                :key="n"
                                :class="{'nextScanImg':scanImgList.length == n-1, 
                                        'collected-choose': (clickIndex !== '' && clickIndex == n-1)}"
                            >
                                <div class="collected" v-if="scanImgList.length > n - 1">
                                    <div class="imgIndex">第{{n}}张</div>
                                    <img
                                        :src="scanImgList[n - 1].imgSrc"
                                        alt
                                        @click="showBigImg(n - 1)"
                                    />
                                    <div class="delete" @click="deleteImg(n - 1)">
                                    </div>
                                </div>
                                <div class="uncollected" @click="showBigImg(-1)" v-else>
                                    <div class="uncollectBox"></div>
                                </div>
                            </div>
                        </div>
                        <el-button
                            class="take-photos"
                            @click.native="startScan"
                        >
                            <img src="@icons/yinheVTM/imageNode/imageScan/icon-image-scanbtn.svg"/>
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="collect-button-scan">
                <el-button @click="goToBizFlow" class="go-to-blzflow">
                    <img :src="require('@icons/common/icon-back-edit.svg')"/>
                    <span class="show-more">修改资料</span>
                </el-button>
                <el-button class="prev-step" v-if="isShowPreBtn" @click.native="prevStep">
                    {{ currentIndex == 0 ? "上一步" : "上一份" }}
                </el-button>
                <el-button
                    :class="{'scanButton': true, 'scanBtnToSubmit': !showBigImage && collectedAll}"
                    @click.native="closeCommonScan"
                    :disabled="showBigImage || !collectedAll"
                >
                    {{currentIndex == scanImg.length - 1 ? "提交" : nextButtonText}}
                </el-button>
                <!-- 如果当前表单是打印表单，则提供重新打印的入口 -->
                <el-button v-if="isPrint" class="re-print" @click="rePrint">
                    重新打印
                </el-button>
                <el-button class="pass" v-if="clsInfo.ADDITIONAL == '1' && oppBusiData && oppBusiData.BUSI_CODE != 'V8004'" @click.native="jumpTo(true)">
                    事后补采
                </el-button>
                <el-button class="pass" v-if="isForTest" @click.native="jumpTo(false)">
                    跳过
                </el-button>
            </div>
        </div>
        <div class="showBigImage" v-if="showBigImage">
            <div class="big-image-content">
                <div class="carousel-box">
                    <div class="image-index">{{activateIndex}} / {{scanImgList.length}}</div>
                    <el-carousel
                        arrow="always"
                        :autoplay="false"
                        class="carousel-container"
                        indicator-position="none"
                        :initial-index="clickIndex"
                        :loop="false"
                        v-on:change="carouselChange"
                        ref="carousel">
                        <el-carousel-item v-for="(item,index) in scanImgList" :key="index">
                            <img :src="item.imgSrc" alt>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                
                <div class="show-page">
                    <el-button class="re-scan" icon="el-icon-re-scan" @click.native="reScanPage">重新扫描</el-button>
                    <el-button class="close-big-img" icon="el-icon-big-img" @click.native="closeShowPage">关闭</el-button>
                </div>
            </div>
        </div>
        <loading :showLoading='showLoading' :loadingText='loadingText'></loading> 
    </div>
</template>

<script>
import _ from 'lodash'
import rightPart from './imageRightPart'
import loading from '../common/loading.vue'

export default {
    data() {
        return {
            scanImgList: [], // 扫描的到的数据列表
            collectedImage: "", // 扫描后得到的图片的base64码
            minClsNum: 2, // 最少采集帧数
            // 以下四项为设置高拍仪窗口位置和宽高
            iwidth: 559,
            iheight: 744,
            itop: 200,
            ileft: 555,
            canClick: true, // 防止频点 true可以点击， false不能点击
            highInitOkBool: false, // 判断高拍仪是否初始化成功 true 初始化成功 成功后即可点击扫描按钮
            facade: true, // 正面
            showBigImage: false, // 查看扫描后的大图照
            clickIndex: "", // 设置的初始状态 查看大图的索引
            collectedAll: false, // 是否采集完成了当前影像类别的所有页
            titleText: "", // 提示词
            titleTextArr: [], // 身份证明文件提示语 如 ['正面照', '徽章面']
            idTypeTxt: "", // 证件类型字段转换中文
            scanObj: null, // 高拍仪对象
            activateIndex: 0,
            showLoading: false,
            loadingText: true,
            nextButtonText:"下一份"
        };
    },
    props: [
        "clsInfo",
        "chackImg",
        "pageNumArr",
        "hideRightTitle",
        "scanImg",
        "isForTest",
        "scanObjList",
        "currentIndex",
        "isShowPreBtn",
        "imageSyncUpload",
        "oppBusiData"
    ],
    components: {
        rightPart,
        loading
    },
    created() {
    },
    mounted() {
        console.log("commonScanMounted");
    },
    activated() {
    },
    deactivated() {
    },
    destroyed() {
        // 离开页面请空
        this.scanImgList = [];
        this.scanObj && this.scanObj.destroyHighCamera();
        //this.$store.commit(this.$types.UPDATE_HANDWARE_TYPE, "");
    },
    updated() {},
    computed: {
        scanItemLength: function () {
            return this.scanImgList.length;
        },
        // 非生产环境不调用硬件
        isVTMDevice() {
            return this.$store.state.isVTMDevice;
        },
        currentCls: function () {
            return this.clsInfo.IMG_CLS;
        },
        isPrint: function() {
            return this.clsInfo.IMG_GET_MODE == "8";
        },
    },
    watch: {
        // chackImg的作用是判断是否展示 扫描组件 也即组件调用成功 则初始化高拍仪
        chackImg: {
            handler(val) {
                let that = this;
                console.log("commonScanCheckImg");
                that.initInfo();
                if (that.isVTMDevice) {
                    if (val) {
                        that.initBindHighcamera();
                    }
                }
            },
            immediate: true
        },
        // 监听已扫描的影像列表长度 判断是否采集完成
        scanItemLength: {
            handler(val) {
                //只有证件类的才有最小采集限制
                if (val > 0){
                    this.collectedAll = true;
                } else {
                    this.$emit("setOper", true);
                    this.collectedAll = false;
                }
            },
            immediate: true
        },
        currentCls: function (val) {
            let that = this;
            if (val) {
                that.initInfo()
                that.showTips();
            }
        },
    },
    methods: {
        rePrint() {
            this.$emit("rePrint")
        },
        slideBanner() {
            let that = this;
            let box = document.querySelector('.el-carousel__container');
            let startPoint = 0;
            let stopPoint = 0;
            let resetPoint =  function(){
				startPoint = 0;
				stopPoint = 0;
			}
            //手指按下
		    box.addEventListener("touchstart",function(e){
		        startPoint = e.changedTouches[0].pageX;
		    });
            box.addEventListener("touchmove",function(e){
		        stopPoint = e.changedTouches[0].pageX;
		    });
            box.addEventListener("touchend",function(e){
                console.log("1："+startPoint);
                console.log("2："+stopPoint);
                if(stopPoint == 0 || startPoint - stopPoint == 0){
                    resetPoint();
                    return;
                }
                if(startPoint - stopPoint > 0){
                    resetPoint();
                    that.$refs.carousel.next();
                    return;
                }
                if(startPoint - stopPoint < 0){
                    resetPoint();
                    that.$refs.carousel.prev();
                    return;
                }
            });
        },
        carouselChange(cIndex, prevIndex) {
            console.log(prevIndex + " - " + cIndex);
            this.activateIndex = cIndex + 1;
        },
        goToBizFlow() {
            this.$router.goRoute(this.$router.getDataInputNodeIndex());
        },
        // 初始化高拍仪
        initBindHighcamera() {
            let that = this;
            try {
                that.showLoading = true;
                that.loadingText = "正在启动扫描仪，请稍候....";
                let param = {
                    iwidth: that.iwidth,
                    iheight: that.iheight,
                    itop: that.itop,
                    ileft: that.ileft,
                };
                highcamera.HighCameraInstance(function (cbParams) {
                    switch (cbParams.type) {
                        case "StartTakePictureOver":
                            console.log("开始拍照事件完成了");
                            setTimeout(() => {
                                that.showLoading = false;
                            }, 100)
                            !that.highInitOkBool && setTimeout(() => {
                                that.showTips()
                            }, 1000)
                            that.highInitOkBool = true;
                            break;
                        case "StopTakePictureOver":
                            console.log("关闭高拍仪窗口成功");
                            break;
                        case "GetPictureSyncOver":
                            if (cbParams.result == "0") {
                                that.captureExtend(cbParams.collectedImage);
                            } else {
                                that.alert("拍照失败");
                            }
                            break;
                        case "DeviceError":
                            if (cbParams.errorCode == "-15") {
                                that.showMessageBox("未检查到您需要采集的资料")
                            } else {
                                that.messageBox({
                                    typeMessage: "error",
                                    messageText: "自定义硬件错误: " + cbParams.msg,
                                    confirmButtonText: "确定",
                                    confirmedAction: function(){
                                    }
                                })
                            }
                            console.log("拍照失败" + cbParams.msg);
                            break;
                        default:
                            console.log("走了默认的事件");
                            break;
                    }
                }, param);
                that.scanObj = highcamera;
                // 高拍仪
                that.$store.commit(that.$types.UPDATE_HANDWARE_TYPE, 
                                    that.$definecfg.HANDWARE_TYPE.HIGHCAMERA);
            } catch (err) {
                console.error("高拍仪初始化失败:" + err);
            }
        },
        // 初始化影像信息
        initInfo() {
            let that = this; 
            that.minClsNum = 1;
            that.titleTextArr = [];
            that.scanImgList = that.scanObjList[that.currentCls] || [];
            if (that.scanImgList.length) {
                if (that.scanImgList.length > 0) {
                    that.minClsNum = that.scanImgList.length + 1;
                }
                that.collectedAll = true;
                that.$nextTick(() => {
                    that.scrollImage();
                })
            } else {
                that.collectedAll = false;
            }
            
        },
        isShowTipsBtn() {
            return _.indexOf(['x487', 'x206', 'x204', 'y198', 'y200', 'x030', 'x243', 'y080'], this.currentCls) > -1
        },
        // 是否弹窗提示
        showTips(val) {
            if ((!val && this.collectedAll === false) || val) {
                let busiData = JSON.parse(this.$storage.getSession(this.$definecfg.BUSI_INFO)) || {};
                // 提示条件， 1. 表单没采集过  2. 指定的影像类别
                // 失信执行人
                if(this.currentCls == 'x487') {
                    // 需要隐藏高拍仪预览
                    this.scanObj.hidCameraWin();
                    this.tips({
                        tipList: [
                            "1. “中国执行信息公开网失信被执行人查询结果”截图需完整（应能看到网站名称或网址）；",
                            "2. 查询结果搜索范围应选择<b style='color: #3b6aff'>“全国”</b>；",
                            "3. 查询的客户姓名和身份证号应与系统内一致。"
                        ],
                        confirmButtonText: "确定",
                        cancelButtonText : '',
                        confirmedAction: () => {
                            this.scanObj.showHighCamera();
                        }
                    })
                }
                // 信用三方
                if (this.currentCls == 'x206') {
                    this.scanObj.hidCameraWin();
                    // 存管银行变更显示变更了存管银行的资金账号
                    let CUACCT_CODE = "";
                    if (busiData.BUSI_CODE == 'V0006') {
                        CUACCT_CODE = !_.isEmpty(busiData.CUACCT_INFO_CLOSE)? busiData.CUACCT_INFO_CLOSE[0].CUACCT_CODE : '';
                    } else if (busiData.BUSI_CODE == 'V0024') {
                        CUACCT_CODE = !_.isEmpty(busiData.ACCT_INFO.CUACCT_INFO)? busiData.ACCT_INFO.CUACCT_INFO.CUACCT_CODE : '';
                    }
                    this.tips({
                        tipList: [
                            "1. 经办人处请填写“VTM自助办理”",
                            "2. 资金账号处请填写：" + CUACCT_CODE,
                        ],
                        confirmButtonText: "确定",
                        cancelButtonText : '',
                        confirmedAction: () => {
                            this.scanObj.showHighCamera();
                        }
                    })
                }
                // 期权银行 银衍账户开户
                if (this.currentCls == 'x204') {
                    this.scanObj.hidCameraWin();
                    // 存管银行变更显示变更了存管银行的资金账号
                    let CUACCT_CODE = "";
                    if (busiData.BUSI_CODE == 'V0154') {
                        CUACCT_CODE = busiData.CUACCT_INFO.CUACCT_CODE;
                    } else if (busiData.BUSI_CODE == 'V0020') {
                        CUACCT_CODE = !_.isEmpty(busiData.BANK_SIGN_INFO)? busiData.BANK_SIGN_INFO.CUACCT_CODE : '';
                    }
                    this.tips({
                        tipList: [
                            "1. 经办人处请填写“VTM自助办理”",
                            "2. 资金账号处请填写：" + CUACCT_CODE,
                        ],
                        confirmButtonText: "确定",
                        cancelButtonText : '',
                        confirmedAction: () => {
                            this.scanObj.showHighCamera();
                        }
                    })
                }
                // 回访问卷
                if (this.currentCls == 'y198' || this.currentCls == 'y200') {
                    this.scanObj.hidCameraWin();
                    this.tips({
                        tipList: [
                            "1. 经办人处请填写“VTM自助办理”",
                        ],
                        confirmButtonText: "确定",
                        cancelButtonText : '',
                        confirmedAction: () => {
                            this.scanObj.showHighCamera();
                        }
                    })
                }
                // 开户 休眠账户激活用到 三方协议
                if (this.currentCls == 'x030') {
                    this.scanObj.hidCameraWin();
                    let CUACCT_CODE = "";
                    if (busiData.BUSI_CODE == 'V0163') {
                        let bankList = [];
                        _.each(busiData.THREE_ACCT_CONF, bank => {
                            if (!_.isEmpty(bank.EXT_ORG_NAME)) {
                                CUACCT_CODE = CUACCT_CODE + bank.EXT_ORG_NAME + "(" + bank.CUACCT_CODE + ");"
                            }
                        })
                    } else {
                        CUACCT_CODE = busiData.CUST_CODE;
                    }
                    this.tips({
                        tipList: [
                            "1. 经办人处请填写“VTM自助办理”",
                            "2. 资金账号处请填写：" + CUACCT_CODE,
                        ],
                        confirmButtonText: "确定",
                        cancelButtonText : '',
                        confirmedAction: () => {
                            this.scanObj.showHighCamera();
                        }
                    })
                }
                // 存管账户开户 三方变更 新增存管银行
                if (this.currentCls == 'x243') {
                    this.scanObj.hidCameraWin();
                    let CUACCT_CODE = "";
                    if (busiData.BUSI_CODE == "V0006") {
                        CUACCT_CODE = !_.isEmpty(busiData.CUACCT_INFO_CLOSE)? busiData.CUACCT_INFO_CLOSE[0].CUACCT_CODE : '';
                    } else if (busiData.BUSI_CODE == "V0062") {
                        CUACCT_CODE = busiData.CUACCT_CODE;
                    } else if (busiData.BUSI_CODE == "V0111") {
                        _.each(busiData.bank, bank => {
                            CUACCT_CODE = CUACCT_CODE + bank.EXT_ORG_NAME + "(" + bank.CUACCT_CODE + ");"
                        })
                    }
                    this.tips({
                        tipList: [
                            "1. 经办人处请填写“VTM自助办理”",
                            "2. 资金账号处请填写：" + CUACCT_CODE,
                        ],
                        confirmButtonText: "确定",
                        cancelButtonText : '',
                        confirmedAction: () => {
                            this.scanObj.showHighCamera();
                        }
                    })
                }
                // 客户提前终止融资融券合同申请
                if(this.currentCls == 'y080') {
                    this.scanObj.hidCameraWin();
                    this.tips({
                        tipList: [
                            "1. 完整填写后需加盖信用章"
                        ],
                        confirmButtonText: "确定",
                        cancelButtonText : '',
                        confirmedAction: () => {
                            this.scanObj.showHighCamera();
                        }
                    })
                }
            }
        },
        startScan: _.throttle(function () {
            let maxPageNum = this.clsInfo.IMG_PAGE_CNT || this.clsInfo.MAX_PAGENUM;
            if (this.scanImgList.length == maxPageNum && this.clickIndex === "") {
                this.showMessageBox("该影像最大采集帧数为" + maxPageNum + "帧");
            } else {
                this.capture();
            }
        }, 1000, { 'trailing': false }),            
        submitScan() {
            let that = this;
            if (that.scanImgList.length == 0) {
                that.$emit("closeScan");
            } else {
                _.each(that.scanImgList, (item, index) => {
                    item["pageNum"] = that.pageNumArr[index] || "";
                });
                that.scanObjList[that.clsInfo.IMG_CLS] = that.scanImgList;
                that.$emit("submitScan", that.scanImgList);
            }
        },
        jumpTo(val) {
            if (this.currentIndex >= this.scanImg.length - 1) {
                this.scanObj && this.scanObj.hidCameraWin();
            }
            this.$emit('jumpTo', val)
        },
        closeCommonScan: _.throttle(function(isAuto) {
            if (isAuto !== true) {
                this.$emit("setOper", false);
            }
            let minPageNum =
                this.clsInfo.MIN_PAGE_CNT || this.clsInfo.MIN_PAGENUM || 1;
            if (this.scanImgList.length < minPageNum) {
                this.showMessageBox("该影像至少采集" + minPageNum + "帧");
            } else {
                // 开发环境不进行提交
                if (!this.isVTMDevice) {
                    return;
                }
                // 异步上传不需要隐藏
                if (!(this.imageSyncUpload && this.currentIndex < this.scanImg.length - 1)) {
                    this.scanObj.hidCameraWin();
                }
                setTimeout(() => {
                    this.submitScan();
                }, 1200);
            }
        }, 2000, {'trailing': false}),
        deleteImg(index) {
            this.scanImgList.splice(index, 1);
            if (this.minClsNum > 1) {
                this.minClsNum--;
            }
            this.$emit("setOper", true);
        },
        async capture() {
            let that = this;
            // 不是真机
            if (!that.isVTMDevice) return;
            // 高拍仪启动成功
            if (that.highInitOkBool) {
                try {
                    // 拍照完成进入回调 GetPictureSyncOver 后转base64码captureExtend
                    this.scanObj.Capture();
                } catch (e) {
                    console.error("高拍仪拍照失败");
                }
            }
        },
        captureExtend(collectedImage) {
            let that = this;
            that.collectedImage = collectedImage;
            let scanItem = {
                src: that.collectedImage,
                imgSrc: "data:image/jpg;base64," + that.collectedImage,
                imagecls: that.clsInfo.IMG_CLS,
                imgfmt: that.clsInfo.IMG_FMT,
                pageNum: "",
            };
            if (that.clickIndex !== "") {
                that.$set(that.scanImgList, that.clickIndex, scanItem);
                that.clickIndex = "";
                //that.scanImgList[that.clickIndex] = scanItem;
            } else {
                that.scanImgList.push(scanItem);
                that.minClsNum++;
                that.$nextTick(() => {
                    that.scrollImage();
                })
            }
            that.$emit("setOper", true);
        },
        scrollImage() {
            let that = this;
            if (that.scanImgList.length >= 2) {
                let scrollBoxDom = document.getElementsByClassName("scroll-box");
                let scanImgDom = document.getElementsByClassName("scanImg");
                scrollBoxDom[0].scrollTop =
                    scanImgDom[that.scanImgList.length - 1].offsetTop;
            }
        },
        showMessageBox(mestext) {
            let that = this;
            that.scanObj.hidCameraWin();
            setTimeout(() => {
                that.messageBox({
                    messageText: mestext,
                    confirmButtonText: "确定",
                    typeMessage: "warn",
                    confirmedAction: function () {
                        that.messageconfirmed();
                    },
                });
            }, 1000);
        },
        messageconfirmed() {
            this.scanObj.showHighCamera();
        },
        showBigImg(index) {
            let that = this;
            if (index == -1) {
                that.clickIndex = "";
            } else {
                that.scanObj.hidCameraWin();
                setTimeout(() => {
                    that.clickIndex = index;
                    that.activateIndex = index + 1;
                    that.showBigImage = true;
                    that.$nextTick(function() {
                        that.slideBanner();
                    })
                }, 1000);
            }      
        },
        closeShowPage() {
            let that = this;
            that.reScanPage();
            that.clickIndex = "";
        },
        reScanPage() {
            this.clickIndex = this.activateIndex - 1;
            this.showBigImage = false;
            this.scanObj.showHighCamera();
        },
        prevStep() {
            this.$emit("prevStep");
        },
    },
};
</script>

<style lang="less">
    #common-scan-box.common-scan-box {
        width: 1185px;
        height: 925px;
        font-family: Alibaba PuHuiTi;
        background-color: #ffffff;
        .chack-scan {
            height: 100%;
            .left-part {
                padding-left: 75px;
                padding-top: 18px;
            }
            .collect-button-scan {
                display: flex;
                justify-content: center;
                padding-top: 20px;
                padding-left: 371px;

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
            }
            .top-info {
                height: 54px;
                font-size: 32px;
            }
            .info-title {
                font-weight: 700;
                line-height: 54px;
                color: #222222;
                .info-tips {
                    color: #3b6aff;
                }
            }
            .main-cont {
                width: 1110px;
                height: 756px;
                position: relative;
                display: flex;
                border-radius: 4px 0 0 4px;
                background: #eaecf0;
            }
            .scan-content {
                width: 816px;
                height: 100%;
                padding-top: 7px;
                border: 0;
                border-radius: 8px;
            }
            #ScanWindow {
                width: 559px;
                height: 744px;
                background: #fff;
                margin: 0 auto;
                border-radius: 4px;
                position: relative;
                .scan-bg {
                    height: 744px;
                    img {
                        width: 42%;
                        margin: 222px 152px;
                        height: auto;
                        max-height: 682px;
                    }
                    .no-image-tips {
                        top: 415px;
                        left: 122px;
                        font-size: 20px;
                        color: #888;
                        position: absolute;
                    }
                }
            }
            .take-photos {
                position: relative;
                height: 88px;
                width: 88px;
                margin: 28px 80px;
                border: 0px;
                border-radius: 50%;
                box-shadow: 0 0 9px 3px #eee;
                img {
                    position: absolute;
                    top: -21px;
                    left: -24px;
                }
            }
            .lineBox {
                width: 4px;
                height: 888px;
                background: rgba(0, 0, 0, 0.1);
                margin-top: 33px;
                float: left;
            }
            
            .prev-step, .scanButton.el-button {
                display: flex;
                justify-content: center;
                min-width: 200px;
                height: 60px;
                line-height: 33px;
                bottom: 38px;
                right: 688px;
                color: #fffdfd;
                font-size: 24px;
                border-radius: 4px;
                background-image:linear-gradient(90deg,#3b6aff 0%,#208bff 100%);
            }
            .scanButton.el-button.is-disabled {
                opacity: 0.5;
            }
            .pass{
                min-width: 200px;
                height: 60px;
                font-size: 24px;
                background-image:linear-gradient(90deg,#3b6aff 0%,#208bff 100%);
                border-radius: 4px;
                color: #fffdfd;
                right: 441px;
                bottom: 38px;
            }
            .re-print {
                min-width: 200px;
                height: 60px;
                font-size: 24px;
                background-image:linear-gradient(90deg,#3b6aff 0%,#208bff 100%);
                border-radius: 4px;
                color: #fffdfd;
                right: 441px;
                bottom: 38px;
            }
            .scanBtnCantSubmit {
                background: rgb(198, 215, 255);
            }
            .scanBtnToSubmit {
                background-image: linear-gradient(90deg, #4a90e2 0%, #497ee7 100%);
            }
            .scan-img-content {
                width: 293px;
                height: 100%;
                position: relative;
                border-left: 4px dotted #ccc;
                .img-num-tips {
                    width: 24px;
                    position: absolute;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 24px;
                    background: #eaecf0;
                    p {
                        width: 100%;
                        vertical-align: middle;
                        text-align: center;
                    }
                }
                .scroll-box {
                    width: 100%;
                    height: 612px;
                    margin: 0 auto;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    .no-image-box {
                        width: 100%;
                        height: 100%;
                        .no-image-text {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: #a1a7b4;
                            font-size: 24px;
                        }
                    }
                    
                    .imgIndex {
                        text-align: center;
                    }
                    .scanImg {
                        height: 168px;
                        padding-top: 4px;
                        font-weight: bold;
                        width: 146px;
                        margin: 22px auto;
                        position: relative;
                        background-color: #ffffff;
                        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
                        border-radius: 4px;
                        border: solid 1px #dbdbdb;
                        &.collected-choose {
                            border:2px solid #3b6aff;
                        }
                        .collected {
                            width: 100%;
                            height: 100%;
                            img {
                                position: relative;
                                width: 100px;
                                height: 128px;
                                margin-left: 24px;
                                margin-top: 2px;
                            }

                            .delete {
                                position: absolute;
                                top: -18px;
                                right: -16px;
                                width: 36px;
                                height: 36px;
                                border-radius: 18px;
                                background-color: #fff;
                                background: url("../../icons/common/close-white.svg") no-repeat;
                                img {
                                    width: 100%;
                                    height: 100%;
                                    position: absolute;
                                    top: 0px;
                                    right: 0px
                                }
                            }
                            .delete:hover {
                                background: url("../../icons/common/close-red.svg") no-repeat;
                            }
                        }
                        .uncollected {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background-color: #ffffff;
                            .uncollectBox {
                                font-size: 24px;
                                // color: #cccccc;
                            }
                        }
                    }
                }
                .scroll-box::-webkit-scrollbar {
                    display: none;
                }
                .infoBox {
                    width: 389px;
                    height: 170px;
                    //margin-left: 38px;
                    padding-top: 40px;
                    box-sizing: border-box;
                    background: #26346c;
                    text-align: center;
                    position: absolute;
                    left: -402px;
                    bottom: 1px;
                    p {
                        padding: 0;
                        margin: 0;
                        font-size: 36px;
                        line-height: 50px;
                        color: #fff;
                    }
                    span {
                        font-size: 32px;
                        line-height: 38px;
                        color: #fff;
                    }
                    .iocnBox {
                        position: absolute;
                        left: 180px;
                        bottom: -15px;
                        width: 30px;
                        height: 30px;
                        background: #26346c;
                        transform: rotate(45deg);
                    }
                }
                .clsNumInfo {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 66px;
                    text-align: center;
                    background-image: linear-gradient(271deg, #9dcbff 0%, #a3dcff 100%);
                    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.06);
                    border-radius: 0px 0px 8px 8px;
                    .scanBtn {
                        background-image: url("../../icons/common/icon-scan-btn.svg");
                        background-repeat: no-repeat;
                        height: 100%;
                        background-position-y: 50%;
                        background-position-x: 116px;
                        .beginScan {
                            width: 98%;
                            height: 100%;
                            margin-left: 10px;
                            background-color: transparent;
                            color: #4983e6;
                            font-size: 24px;
                            border: 0px;
                        }
                    }
                    .scanBtn.is-disable {
                        background-color: #dedddd;
                    }
                }
            }
        }
        .chack-scan::after {
            clear: both;
        }
        .showBigImage {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 200;
            display: flex;
            justify-content: center;
            align-items: center;
            .big-image-content {
                height: 950px;
                background-color: #f7f7f7;
                border-radius: 4px;
                .carousel-box {
                    width: 744px;
                    height: 878px;
                    .image-index {
                        height: 36px;
                        line-height: 36px;
                        text-align: center;
                    }
                    .carousel-container {
                        width: 744px;
                        height: 809px;
                        margin: 0 auto;
                        .el-carousel__container {
                            height: 809px;
                            .el-carousel__item {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                img {
                                    max-width: 640px;
                                    height: auto;
                                    max-height: 100%;
                                }
                            }
                            .el-carousel__arrow {
                                width: 88px;
                                height: 88px;
                                font-size: 42px;
                                &.el-carousel__arrow--left{
                                    // position: relative;
                                    // left: -15px;
                                    padding-right: 60px;
                                    background-color: transparent;
                                }
                                &.el-carousel__arrow--right {
                                    // position: relative;
                                    // left: 580px;
                                    padding-left: 48px;
                                    background-color: transparent;
                                }
                                .el-icon-arrow-right:before, .el-icon-arrow-left:before {
                                    color: #cecece;
                                }
                            }
                            .el-carousel__arrow:hover {
                                background-color: transparent;
                            }
                        }
                    }
                }
                .show-page {
                    width: 744px;
                    height: 72px;
                    display: flex;
                    .el-button {
                        width: 50%;
                        margin: 0px;
                        font-size: 24px;
                        background-image:linear-gradient(180deg,#f2f2f7 0%,#dadbe2 100%);
                        border-radius:0px 0px 4px 4px;
                        box-shadow:0px 4px 16px rgba(0, 0, 0, 0.06);
                        &.close-big-img {
                            font-weight:700;
                            color:#252525;
                        }
                        &.re-scan {
                            font-weight: 700;
                            color: #3b6aff;
                        }
                        .el-icon-re-scan {
                            background: url("~@icons/yinheVTM/imageNode/imageScan/icon-img-reset.svg");
                            background-size: cover;
                        }
                        .el-icon-re-scan::before {
                            content: "重";
                            font-size: 24px;
                            visibility: hidden;
                        }
                        .el-icon-big-img {
                            background: url("~@icons/yinheVTM/imageNode/imageScan/icon-img-close.svg");
                            background-size: cover;
                        }
                        .el-icon-big-img::before {
                            content: "放";
                            font-size: 24px;
                            visibility: hidden;
                        }
                    }
                }
            }   
        }
    }
</style>
