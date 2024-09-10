// vtm感应到没人时 10s退出系统
// @author liwei2
<template>
    <div class="circle-progress-wrap" 
        v-if='showProgress'
        @click="updateOperateState" 
        @touchmove="updateOperateState">
        <h1 class="circle-progress-title">您已离开VTM操作范围，为保证您的信息安全，系统将在</h1>
        <div class="circle-progress-top">
            <el-progress type="circle" 
                :percentage="percentage" 
                :stroke-width='strokeWidth' 
                :width="220" 
                :show-text='false'>
            </el-progress>
            <span class="circle-progress-text"><b>{{cirProRemainTime}}s</b>后自动退出</span>
        </div>
        <el-button type="primary" @click="closeProgress">继续办理业务</el-button>
        <div class = 'bottomWaveClass'>
        </div>
    </div>
</template>

<script>
import { googlePlayVoice, googleStopVoice } from "../../device/voice/voice"
import oppService from '../../service/opp-service';
import * as utils from "../../tools/util";

export default {
    data(){
        return {
            percentage: 0,
            timerInter:'',
            timerOut: '',
            cirProRemainTime: 20, //用做倒计时的
            cirProRemainLongTime: 20, //固定不变的
            strokeWidth: 8,
            showProgress: false,
            needTimer: true, // 是否需要进行计时
        }
    },
    computed: {
        hasPerson(){
            return this.$store.state.hasPerson;
        },
        remainTime(){
            let configTime = oppService.getSysCommonParamsFromCacheObjs('VTM_AUTO_LOGOUT_TIME') || 60;
            return parseInt(configTime);
        }
    },
    watch: {
        hasPerson(val){   //   0： : 感应器不存  1： : 有人  2： : 无人   
            if(val == 1){
                this.closeProgress();
                console.log("hasPerson:" + val);
                // 如果有人 一直站在机器前 则不进行计时
                this.needTimer = false;
            } else {
                console.log("noPerson:" + val);
                // 没人的话就计时
                this.needTimer = true;
            }
        },
        showProgress(flag){
            if(flag){
                this.logOut();
                googleStopVoice();
                setTimeout(()=>{
                    googlePlayVoice(`您已离开VTM操作范围，为保证您的信息安全，系统将在${utils.toChinesNum(this.cirProRemainLongTime)}"秒后自动退出`);
                }, 1000);
            }else{
                googleStopVoice();
            }
        }
    },
    mounted() {
        this.checkOperatetimeout();
    },
    methods: {
        updateOperateState() {
            // 刷新操作状态,点击一次就清零
            this.closeProgress();
        },
        checkOperatetimeout() {
            let that = this;
            // 为避免环境升级后出现多个定时器，绑定到window对象上
            window.operate_timer && clearInterval(window.operate_timer);
            window.operate_timer = setInterval(() => {
                let currentRoute = that.$store.state.route;
                
                if (currentRoute.name == "commonHome" 
                    || currentRoute.name == "vtmBind" 
                    || !that.needTimer) {
                    // 在首页及VTM绑定页时不计时
                    return;
                }
                //自动计数
                that.timeCount++;
                // 获取的配置 倒计时时间
                let operateTimeout = that.remainTime;
                if (operateTimeout > 0) {
                    let now = new Date();
                    // 还剩多少s
                    let countdown = operateTimeout - that.timeCount;
                    if (countdown <= that.cirProRemainLongTime) {
                        console.log("开始倒计时");
                        if (that.$route.name == "localRecord") {
                            //双录节点不计时
                            that.updateOperateState();
                        } else {
                            that.showProgress = true;
                        }
                    }
                    if (that.timeCount >= operateTimeout) {
                        that.showProgress = false;
                        //操作超时需要退出到homeVtm页，如果已经在homeVtm页面则不操作
                        if (that.$route.name !== that.$bizhomecfg.getHomeConfig()) {
                            that.$storage.removeSession(that.$definecfg.CUSTOMER_INFO);
                            that.$store.commit(that.$types.IS_AIDED_USER_LOGIN, "0");
                            that.$store.commit(that.$types.AIDED_USER_INFO, null);
                            that.$router.replace({ path: that.$bizhomecfg.getHomeConfig() });
                        } else {
                            console.log("已经超时，已经在homeVtm页面");
                        }
                    }
                }
            }, 1000)
        },
        initData(){
            this.cirProRemainTime = this.cirProRemainLongTime;
            this.percentage = 0;
        },
        closeProgress(){
            this.showProgress = false;
            this.timeCount = 0;
            this.percentage = 0;
            this.cirProRemainTime = 20;
            this.timerInter && clearInterval(this.timerInter);
        },
        logOut: _.debounce(function() {
            this.initData(); 
            this.timerInter = setInterval(function(){
                this.percentage += (100 / this.cirProRemainLongTime);
                this.cirProRemainTime--;
                if(this.cirProRemainTime <= 0){
                    this.closeProgress();
                }
            }.bind(this), 1000)
        }, 500, { 'trailing': true, "maxWait": 1000 }),
    },
}
</script>

<style lang='less'>
.circle-progress-wrap{
    width: 100%;
    height: 100%;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2022;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    align-items: center;
    background-image: linear-gradient(180deg,#1632cb 0%,#8199ff 100%);
    .circle-progress-title{
        font-size: 32px;
        color: #ffffff;
        letter-spacing: 0;
        margin-top: 100px;
        font-weight: 700;
        text-align: center;
        font-family:Alibaba PuHuiTi;
        width:570px;
        line-height:50px;        
    }
    .circle-progress-top{
        position: relative;
        background-image: url("../../icons/yinheVTM/icon-countdwon-bg.svg");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width:478.36px;
        height:382.55px;
        .el-progress{
            width:100%;
            height: 100%;
            .el-progress-circle{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }
        }
        .circle-progress-text{
            position: absolute;
            display: block;
            top: 50%;
            left: 50%;
            color: #fff;
            text-align: center;
            font-size: 22px;
            color: #4059de;
            transform: translate(-50%, -50%);
            line-height: 1.6;
            b{
                display: block;
                font-size: 61px;
                width:118px;
                height:104px;
                font-family:Alibaba PuHuiTi;
                color:#222222;
                font-size:76px;
                text-align:center;
                letter-spacing: 5px;
            }
        }
    }

    .el-button{
        margin-top: 188px;
        width: 258px;
        height: 60px;
        background-image:linear-gradient(90deg,#ffffff 0%,#ffffff 46.64%,#ffffff 100%);
        border-radius:4px;
        color:#4059de;
        font-size: 26px;
        font-family:Alibaba PuHuiTi;
        font-weight:700;
    }
    .bottomWaveClass{
        background-image: url("../../icons/yinheVTM/pic-bottom-wave.svg");
        bottom: 0;
        position: absolute;
        width: 100%;
        height: 110px;
    }
}
</style>
