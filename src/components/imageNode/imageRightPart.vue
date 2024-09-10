// 影像右侧列表
<template>
    <div class="right-part" :class="isChangeStyle? 'right-part-modified': ''">
        <div class="additional-remark">
            <span class="remark-text" @click="showRemarkList">
                {{ remarkText }}
            </span>
            <transition name="fade">
                <div v-if="showRemarkListFalg" class="dropdown-box">
                        <div class="dropdown" v-for="(item, index) in remarkLit" :key="index">
                            <span v-for="(el, key) in item" :key="key">{{ el }}</span>
                        </div>
                </div>
            </transition>
        </div>
        <div class="right-cls-nav">
            <div class="cls-item all-cls">
                <div class="title-box"><span class="cls-title cls-box-title">协议列表</span></div>
            </div>
            <div class="cls-box" id="cls-box" ref='clsBox'>
                <div class="cls-item" v-for="(item, cindex) in imageItems" :key="cindex" :ref="'clsItem'+ cindex">
                    <div class="title-box"  
                        :class="{
                            'is-disable': collectStatusRight[item.IMG_CLS] === '', 
                            'is-activite': cindex == currentIndex 
                        }"
                        @click="gotoCurrentForm(cindex)">
                        <div class="cls-icon">
                            <img v-if="collectStatusRight[item.IMG_CLS] === '2'" :src="rejectIcon" alt="">
                            <img v-else-if="cindex == currentIndex" :src="collectIconActivited" alt="">
                            <img v-else-if="collectStatusRight[item.IMG_CLS] === '1'" :src="collectIcon" alt="">
                        </div>
                        <div class="cls-title-box">
                            <span class="cls-title">{{item.IMG_CLS_NAME}}
                            </span>
                            <div v-if="item.IS_DEFINED_CLS === '1'" class="oper-cls-icon">
                                <img :src="deleteIcon" @click="deleteDefineCls($event ,item)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div  v-if="showAddBtn" class="add-cls-box">
                <div class="add-content" v-show="showAddBox" ref="add-content">
                    <div class="all-img-list">
                        <el-select
                            v-model="selectValue"
                            multiple
                            filterable
                            collapse-tags
                            popper-class='up-dir'
                            style="margin-left: 20px;"
                            placeholder="请选择">
                            <el-option
                            v-for="item in canCollectDefinecls"
                                :key="item.IMG_CLS"
                                :label="item.IMG_CLS_NAME"
                                :value="item.IMG_CLS">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="choose-btn">
                        <el-button @click="cancelAdd($event)" class="cancel">取消</el-button>
                        <el-button @click="addCls($event)" class="add">添加</el-button>
                    </div>
                </div>
                <el-button @click="addClsHandler($event)" class="add-scan" icon="el-icon-scan">
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'imageItems',
        'currentIndex',
        'collectStatus',
        'showAddBtn',
        'canCollectDefinecls'
    ],
    data() {
        return {
            collectIcon: require('../../icons/yinheVTM/imageNode/imageScan/icon-img-list-finsh.svg'),
            collectIconActivited: require('../../icons/yinheVTM/imageNode/imageScan/icon-img-list-finsh-white.svg'),
            rejectIcon: require('../../icons/yinheVTM/imageNode/imageScan/icon-img-list-fail.svg'),
            deleteIcon: require('@icons/yinheVTM/icon-area-del-normal-66.svg'),
            collectStatusRight: {},
            isChangeStyle: false,

            remarkLit: [],
            showRemarkFlag: false,
            selectValue: [],
            showAddBox: false,
        }
    },
    computed: {
        showRemarkListFalg() {
            return this.remarkLit.length && this.showRemarkFlag;
        },
        remarkText () {
            let busiData = JSON.parse(this.$storage.getSession(this.$definecfg.BUSI_INFO)) || {};
            let userInfo = JSON.parse(this.$storage.getSession(this.$definecfg.USER_INFO)) || {};
            let custInfo = JSON.parse(this.$storage.getSession(this.$definecfg.CUSTOMER_INFO)) || {};
            if(this.$route.path.indexOf('imageScan') > -1) {
                if(busiData.BUSI_CODE == 'V0006') {
                    // 存管银行变更显示变更了存管银行的资金账号
                    let CUACCT_CODE = !_.isEmpty(busiData.CUACCT_INFO_CLOSE)? busiData.CUACCT_INFO_CLOSE[0].CUACCT_CODE : '';
                    return '资金账号：' + CUACCT_CODE;
                }
                else if(['V0050', 'V0051', 'V0052'].indexOf(busiData.BUSI_CODE) > -1) {
                    // 开户显示客户代码
                    return '客户号：' + busiData.CUST_CODE;
                }
                else if (busiData.BUSI_CODE == 'V0111') {
                    // 新增存管银行显示下拉【存管银行 - 资金号】列表
                    // EXT_ORG_NAME - CUACCT_CODE
                    let bankList = [];
                    _.each(busiData.bank, bank => {
                        bankList.push({
                            EXT_ORG_NAME: bank.EXT_ORG_NAME,
                            CUACCT_CODE: bank.CUACCT_CODE,
                        })
                    })
                    this.remarkLit = bankList;
                    return '点此查看新增资金账户'
                } else if (busiData.BUSI_CODE == 'V0163') {
                    let bankList = [];
                    _.each(busiData.THREE_ACCT_CONF, bank => {
                        if (!_.isEmpty(bank.EXT_ORG_NAME)) {
                            bankList.push({
                                EXT_ORG_NAME: bank.EXT_ORG_NAME,
                                CUACCT_CODE: bank.CUACCT_CODE,
                            })
                        }
                    })
                    this.remarkLit = bankList;
                    return '点此查看资金账户'
                }else if (busiData.BUSI_CODE == 'V0020') {
                    // 存管银行变更显示变更了存管银行的资金账号
                    let CUACCT_CODE = !_.isEmpty(busiData.BANK_SIGN_INFO)? busiData.BANK_SIGN_INFO.CUACCT_CODE : '';
                    return '资金账号：' + CUACCT_CODE;
                } else if (busiData.BUSI_CODE == 'V0024') {
                    // 存管银行变更显示变更了存管银行的资金账号
                    let CUACCT_CODE = !_.isEmpty(busiData.ACCT_INFO.CUACCT_INFO)? busiData.ACCT_INFO.CUACCT_INFO.CUACCT_CODE : '';
                    return '资金账号：' + CUACCT_CODE;
                } else if (busiData.BUSI_CODE == "V0062") {
                    return '资金账号：' + busiData.CUACCT_CODE;
                } else if (busiData.BUSI_CODE == "V0154") {
                    return '资金账号：' + busiData.CUACCT_INFO.CUACCT_CODE;
                }
                this.showRemarkFlag = true;
            }
            return '';
        }
    },
    watch:{
        currentIndex: {
            handler(val) {
                console.log('right---currentIndex' + val);
                val++
                // 判断选择的表单的位置，能滚动的话，置其于视口中间偏下位置
                let clsBox = document.getElementsByClassName("cls-box")[0];
                let clsItem = document.getElementsByClassName("cls-item")[val];
                if(clsBox.scrollHeight > clsBox.offsetHeight) {
                    clsBox.scrollTop = clsItem.offsetTop - clsBox.offsetHeight + clsItem.offsetHeight
                    // if(clsItem.offsetTop > clsBox.offsetHeight - clsItem.offsetHeight) {
                    //     clsBox.scrollTop = clsBox.scrollTop + clsItem.offsetHeight;
                    // }
                }
            },
            deep: true,
            immediate: false,
        },
        collectStatus: {
            handler(val) {
                this.collectStatusRight = val;
            },
            deep: true,
            immediate: false,
        }
    },
    mounted() {
        console.log("----------");
        this.collectStatusRight = this.collectStatus;
        this.showAddBtn && this.bindEvent();
    },
    methods: {
        deleteDefineCls(e, item) {
            let that = this;
            this.stopBubble(e)
            window.highcamera && window.highcamera.hidCameraWin();
            this.messageBox({
                messageText: "是否删除当前业务配置的影像类别及影像数据?",
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                typeMessage: 'warn',
                confirmedAction: function () {
                    window.highcamera && window.highcamera.showHighCamera();
                    that.$emit('deleteCls', item)
                },
                canceledAction: function () {
                    window.highcamera && window.highcamera.showHighCamera();
                }
            })
            
        },
        gotoCurrentForm(cindex) {
            this.$emit('gotoCurrentForm', cindex);
        },
        showRemarkList() {
            this.showRemarkFlag = !this.showRemarkFlag;
        },
        bindEvent() {
            let that = this;
            let scanContent = document.getElementsByClassName("collect-scan")[0];
            scanContent.addEventListener('click', function(e) {
                that.showAddBox = false;
            });
            let addBox = document.getElementsByClassName("add-content")[0];
            addBox.addEventListener('click', function(e) {
                that.showAddBox = true;
                that.stopBubble(e)
            });
        },
        stopBubble(e) {
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        },
        addClsHandler(e) {
            this.showAddBox = !this.showAddBox;
            this.selectValue = [];
            this.stopBubble(e);
        },
        addCls(e) {
            this.showAddBox = false;
            this.stopBubble(e);
            let selectValue = this.selectValue;
            this.$emit('updateImageList', selectValue);
        },
        cancelAdd(e) {
            this.showAddBox = false;
            this.stopBubble(e)
        },
    }
}
</script>

<style lang="less">
.up-dir {
    top: 401px;
    .el-popper[x-placement^=bottom].popper__arrow:after{
        border-bottom-width: 0;
        border-top-color: #fff;
    }
}
.right-part {
    width: 250px;
    // height: 710px;
    margin-top: 18px;
	border-radius: 0 4px 4px 0;
    .additional-remark {
        height: 53px;
        position: relative;
        .remark-text {
            position: absolute;
            display: inline-block;
            height: 100%;
            right: 0;
            line-height: 43px;
            white-space: nowrap;
            font-family: Alibaba PuHuiTi;
            font-size: 26px;
            color: #222;
            &>:hover {
                color: orange;
                text-decoration: underline;
            }
        }
        .dropdown-box {
            position: absolute;
            border: 1px solid;
            border-color: #d9d9d9;
            border-radius: 8px;
            box-shadow: 0px 3px 22px #00000008;
            min-width: 272px;
            max-width: 468px;
            top: 50px;
            right: 0;
            padding: 10px 20px;
            background: #fff;
            z-index: 100;
            .dropdown {
                display: flex;
                justify-content: space-between;
                span {
                    display: inline-block;
                    height: 48px;
                    line-height: 48px;
                    font-size: 20px;
                    font-family: Alibaba PuHuiTi;
                    color: #666666;
                }
            }
        }
        .fade-enter-active, .fade-leave-active {
            transition: opacity .5s
        }
        .fade-enter, .fade-leave-active {
            opacity: 0
        }
    }
    .right-cls-nav {
        height: 757px;
        background: #f5f7f8;
        position: relative;
        #cls-box {
            height: 625px;
            overflow: scroll;
            &::-webkit-scrollbar {
                display: block;
                width: 5px
            }
            &::-webkit-scrollbar-track {
                background-color: rgba(128, 128, 128, 0);
                -webkit-border-radius: 2em;
                -moz-border-radius: 2em;
                border-radius: 2em
            }
            &::-webkit-scrollbar-thumb {
                background-color: #dbdbdb;
                -webkit-border-radius: 2em;
                -moz-border-radius: 2em;
                border-radius: 2em
            }
        }
        .el-icon-scan {
            background: url("~@icons/yinheVTM/icon-bank-open.svg");
            background-size: cover;
        }
        .el-icon-scan::before {
            content: "重";
            font-size: 24px;
            visibility: hidden;
        }
        .cls-item {
            border-bottom: 1px solid #d6d6d6;
            min-height: 86px;
            font-size: 20px;
            &.all-cls {
                height: 66px;
                font-weight: 700;
                .title-box {
                    height: 81px;
                    min-height: 81px;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
            .title-box {
                display: flex;
                min-height: 100px;
                width: 100%;
                font-family:Alibaba PuHuiTi;
                color:#3b6aff;
                .cls-box-title {
                    font-size: 28px;
                    font-weight: bold;
                    color: #222;
                }
                &.is-disable {
                    color: #bab9b9;
                }
                &.is-activite {
                    background: rgb(59, 106, 255);
                    color: #fff;
                }
                .cls-icon{
                    width: 52px;
                    display: flex;
                    justify-content: center;
                    img {
                        width: 26px;
                    }
                }
                .cls-title-box {
                    width: 187px;
                    display: flex;
                    padding-left: 5px;
                    align-items: center;
                    justify-content: flex-start;
                    font-size: 22px;
                    .oper-cls-icon{
                        img {
                            width: 56px;
                        }
                    }
                }
                
            }
        }
        .add-cls-box {
            .add-scan {
                width: 100%;
                position: absolute;
                bottom: 1px;
                background: transparent;
                border-radius: 0px;
                font-size: 22px;
                border-left: none;
                border-right: none;
            }
            .add-content {
                position: fixed;
                width: 537px;
                height: 220px;
                background: #eceded;
                box-shadow: 1px 1px 7px #888888;
                right: 137px;
                bottom: 205px;
                .all-img-list {
                    height: 141px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .el-select {
                        width: 400px;
                        .el-input__inner {
                            height: 45px;
                            font-size: 18px;
                            line-height: 18px;
                        }
                    }
                }
                .choose-btn {
                    text-align: center;
                    .el-button {
                        width: 106px;
                        height: 45px;
                        font-size: 18px;
                        box-sizing: border-box;
                        color: #fff;
                        background-image: linear-gradient(90deg,#3b6aff 0%,#208bff 100%);
                        border-radius: 4px;
                        padding: 0;
                        line-height: 45px;
                    }
                    .el-button.cancel {
                        width: 106px;
                        height: 45px;
                        border:1px solid;
                        border-color:#3b6aff;
                        background-color: #fff;
                        background-image: none;
                        border-radius:2px;
                        font-weight:500;
                        color:#3b6aff;
                        font-size: 18px;
                        line-height: 45px;
                        text-align:center;
                        box-sizing: border-box;
                    }
                }
            }
            .add-content::before {
                width: 0;
                height: 0;
                content: ' ';
                border: 20px solid transparent;
                border-top-color: #c7c8c9;
                position: absolute;
                bottom: -39px;
                right: 104px;
            }
            .add-content::after {
                width: 0;
                height: 0;
                content: " ";
                border: 19px solid transparent;
                border-top-color: #eceded;
                position: absolute;
                bottom: -34px;
                right: 105px;
            }
        }
    }
}
.right-part-modified {
    margin-top: 58px;
    // height: 666px;
    .right-cls-nav {
        height: 713px;
    }
}
</style>