<template>
    <div class="user-verify">
        <div class="title">
            <div class="verify-title">尊敬的客户您好</div>
            <div class="verify-tips">在进行纸质资料扫描前，请联系现场服务人员，并由<b style="color:#c93e2c">客户本人</b>输入现场服务人员代码（CRM系统8位数字代码）。</div>
        </div>
        <div class="verify-info">
            <span class="verify-label">现场服务人员代码:</span>
            <el-input ref='staffId' class="staff-id" v-model="staffId">
            </el-input>
            <div class="verify-error-text">{{errorText}}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            staffId: "",
            errorText: ""
        }
    },
    mounted() {

    },
    methods: {
        beforeConfirmAction () {
            let that = this;
            if (that.staffId.length != 8) {
                that.errorText = "请您输入正确的8位服务人代码"
                return false;
            }else{
                return {
                    staffId: that.staffId
                };
            }
        },
        afterConfirmAction (res){
            let that = this;
            if (res.checkResult === false) {
                that.staffId = "";
                that.errorText = res.errorText;
                return false;
            } else{
                return true;
            }
        },
    }
}
</script>

<style lang="less">
.user-verify {
    .title {
        .verify-title {
            width: 670px;
            height: 48px;
            font-family: Alibaba PuHuiTi;
            font-weight: 700;
            color: #252525;
            font-size: 32px;
            line-height: 0px;
            text-align: center;
        }
        .verify-tips {
            width:745px;
            height:84px;
            margin-top: 27px;
            font-family:Alibaba PuHuiTi;
            color:#666666;
            font-size:26px;
            line-height:52px;
            text-align: left;
            text-indent: 52px;
        }
    }
    .verify-info {
        margin-top: 80px;
    }
    .staff-id {
        width:460px;
        height:56px;
        background:#ffffff;
        border:1px solid;
        border-color:#3b6aff;
        border-radius:2px;
        box-shadow:0px 1px 6px rgba(59, 106, 255, 0.3);
        .el-input__inner {
            width:460px;
            height:56px;
            border-radius:2px;
            font-size: 24px;
        }
    }
    .verify-label {
        width:213px;
        height:33px;
        font-family:Alibaba PuHuiTi;
        color:#252525;
        font-size:24px;
        text-align:right;
    }
    .verify-error-text {
        text-align: left;
        padding-top: 10px;
        padding-left: 240px;
        color: #e90e0e;
    }
}
</style>