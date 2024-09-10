<template>
    <div class="message-box-content">
        <div class="message-image" v-if="imageTipName">
            <img :src="getImg()">
        </div>
        <div class="message-tip-content">
            <div class="first-tip" v-if="messageText">
                <span v-html="messageText"></span>
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
    props: ['imageTipName', 'messageText', 'secondTip'],
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
    .message-tip-content {
        .first-tip {
            word-break: break-all;
            width: 100%;
            overflow-y: auto;
            max-height: 600px;
            margin: 0 auto;
            padding-top: 40px;
            font-size: 32px;
            font-weight: 700;
            line-height: 1.5;
            span.red {
                color: red;
		font-size: 36px;
            }
            span.blur {
                color: #298bfc;
                font-size: 36px;
            }
        }
        .second-tip {
            font-size: 24px;
            color: #666666;
            padding: 20px 0;
            line-height: 38px;
        }
    }
}
</style>