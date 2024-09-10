<template>
    <div class="one-click-input">
        <div class="input-warp">
            <div class="notation-title">
                为保障您的投资权益请输入以下声明：
            </div>
            <div class="notation-content">
                {{ titleConent }}
            </div>
            <div class="notation-input">
                <el-input type="textarea" :rows="8" placeholder="请输入声明内容" resize="none" v-model="inputNotationContent"></el-input>
                <div class="input-btx" @click="clickInput">一键录入</div>
            </div>
            <div class="notation-footer">
              <el-button class="btn-rewrite" @click="cancel">取消</el-button>
              <el-button class="btn-confirm" @click="confirm">确定</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            inputNotationContent: "",
            titleConent: ""
        }
    },
    props: ['notationContent'],
    mounted() {
        this.titleConent = this.notationContent.replace(/<pen>/ig, "").replace(/<\/>/ig, "");
    },
    methods: {
        cancel() {
            this.$emit('notationOver', false)
        },
        confirm() {
            if (this.inputNotationContent != this.notationContent.replace(/<pen>/ig, "").replace(/<\/>/ig, "")) {
                this.messageBox({
                    typeMessage: "error",
                    messageText: "请完整正确输入声明内容",
                    confirmButtonText: "确定",
                    confirmedAction: function(){},
                })
                return;
            }
            this.$emit('notationOver', this.inputNotationContent)
        },
        clickInput() {
            this.inputNotationContent = this.notationContent.replace(/<pen>/ig, "").replace(/<\/>/ig, "");
        }
    }
}
</script>

<style lang="less">
.one-click-input {
    width: 1920px;
    height: 1080px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    .input-warp {
        width: 900px;
        height: 500px;
        background-color: #e9edf4;
        border-radius: 8px;
        margin: 0 auto;
        .notation-title {
            font-size: 24px;
            font-weight: 700;
            padding-left: 36px;
            padding-top: 30px;
            padding-bottom: 20px;
        }
        .notation-content {
            font-size: 24px;
            padding-left: 36px;
            padding-right: 36px;
            padding-bottom: 20px;
        }
        .notation-input {
            position: relative;
            padding-left: 36px;
            padding-right: 36px;
            
            .el-textarea {
                .el-textarea__inner {
                    font-size: 20px;
                }
            }
            .input-btx {
                position: absolute;
                font-size: 20px;
                right: 56px;
                bottom: 13px;
                background: rgb(147,147,147,0.6);
                padding: 12px 36px;
                color: #fff;
                border-radius: 25px;
            }
        }
        .notation-footer {
            padding-top: 20px;
            text-align: center;
            .el-button {
                height: 54px;
                width: 162px;
                border-radius: 4px;
                &.btn-confirm {
                    font-size: 24px;
                    letter-spacing: -0.58px;
                    margin-left: 3.1%;
                    background-image: linear-gradient(270deg,#1f59db,#217fff);
                    border-width: 0px;
                    color: #ffffff;
                    border-width: 0px;
                }
                &.btn-rewrite {
                    border-radius: 4px;
                    font-size: 24px;
                    letter-spacing: -0.58px;
                    border: 1px solid #b0b0b0;
                    color: #b0b0b0;
                    background-color: #ffffff;
                }
            }
        }
    }
}
</style>