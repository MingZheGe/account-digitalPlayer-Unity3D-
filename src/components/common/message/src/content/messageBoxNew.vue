<template>
    
    <div class="message-box-content">
        <div class="message-image" v-if="imageTipName">
            <img :src="getImg()">
        </div>
            <header class="header">
            <h2 class="title">{{title}}</h2>
            </header>
        <div class="message-tip-content">
            <div v-if="messageText">
                <div v-for="(service, index) in messageText" :key="index" >
                    <span class="first-tip">{{service}}</span>
                </div>
            </div>
            <div class="second-tip" v-if="secondTip">
                <span>{{secondTip}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // messageText: "公安联网校验失败",
            // secondTip: "请点击返回首页，或联系现场工作人员处理！",
        }
    },
    props: ['title','imageTipName', 'messageText', 'secondTip'],
    methods: {
        // 根据传入参数返回图片
        getImg() {
            switch(this.imageTipName) {
                case 'error': 
                    return require('@icons/message/pic-police-notpass.svg');
                    break;
                default:
                    return '';
                    break;
            }
        }
    }
}
</script>

<style lang="less">
.message-box-content {
    font-family: Alibaba PuHuiTi;
    width: 100%;
    .header{
        position: relative;
        top: -50px;
        .title {
        margin-top: 0px;
        box-sizing: border-box;
        font-size: 35px;
        color: #000;
        letter-spacing: 0;
        line-height: 54px;
      }
}
    
    .message-tip-content {
        position: relative;
        top: -25px;
        //background-color: #bdb9b9;
        .first-tip {
            width: 677px;
            margin: 0 auto;
            padding-top: 40px;
            font-size: 32px;
            font-weight: 700;
            line-height: 1.5;
        }
        .second-tip {
            font-size: 24px;
            color: #666666;
            padding: 20px 0;
        }
    }
}
</style>