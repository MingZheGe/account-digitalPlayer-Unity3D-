<template>
  <div class="password-msg">
      <div class="pwd-title">
          {{title}}
      </div>
      <div class="pwd-content">
          <span class="info" v-if="info !=''">{{info}}</span>
          <el-input ref='password' type="password" class="PASSWORD" v-model="passwordValue"/>
          <div class="err-text" v-if="errorText != ''">{{errorText}}</div>
          <div class="forget-content" v-if="showForget">
            <el-button class="forget-password" @click="forgetPassword">忘记密码？</el-button>
          </div>
          <div class="password-tips" v-if="passwordTips != ''">{{passwordTips}}</div>
      </div>
  </div>
</template>

<script>

export default {
    props: ['info', 'title', 'psd', 'showForget', 'passwordTips'],
    data() {
        return {
            passwordValue: '',
            canPass: false,
            errorText: '',
        }
    },
    watch: {
        
    },
    mounted() {
        this.$refs.password.focus();
    },
    methods: {
        beforeConfirmAction () {
            let that = this;
            if (that.passwordValue.length < 6 || that.passwordValue.length > 8) {
                that.errorText = "请输入6到8位密码"
                return false;
            }else{
                return {
                    password: that.passwordValue
                };
            }
        },
        afterConfirmAction (res){
            let that = this;
            if (res.checkResult === false) {
                that.passwordValue = "";
                that.errorText = res.errorText;
                return false;
            } else{
                return true;
            }
        },
        forgetPassword() {
            this.$emit('forgetPassword');
        }
    }
}
</script>

<style lang="less">
.password-msg {
    font-family: Alibaba PuHuiTi;
    .pwd-title {
        font-weight: 700;
        color: #252525;
        font-size: 32px;
        line-height: 32px;
        text-align: center;
    }
    .pwd-content {
        width: 722px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        margin-top: 38px;
        background-color: #f7f7fa;
        border-radius: 4px;
        position: relative;
        .el-input {
            width: 300px;
            .el-input__inner {
                font-size: 24px;
                height: 50px;
            }
        }
        .info {
            display: block;
            margin-right: 20px;
            font-size: 20px;
        }
        .err-text {
            position: absolute;
            top: 125px;
            left: 221px;
            font-family: Alibaba PuHuiTi;
            font-size: 17px;
            color: #f75d5d;
        }
        .forget-content {
            position: absolute;
            top: 103px;
            right: 86px;
            .forget-password {
                padding: 0px;
                background: transparent;
                border: none;
                color: #298cfc;
                font-family: Alibaba PuHuiTi;
                font-size: 20px;
            }
        }
        .password-tips {
            width: 412px;
            position: absolute;
            color: #686868;
            bottom: 17px;
            left: 166px;
        }
    }
}
</style>