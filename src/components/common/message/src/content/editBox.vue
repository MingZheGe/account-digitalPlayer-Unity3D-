<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: Lindewen
 * @Date: 2021-06-18 14:38:49
 * @LastEditors: Lindewen
 * @LastEditTime: 2021-06-18 17:48:18
-->
<template>
    <div class="editBox-wrap">
        <div class="title">{{title}}</div>
        <div class="input-wrap">
            <el-form ref="editForm">
                <el-form-item 
                    :label="options.label ? options.label + '：' : ''" 
                    prop="inputVal" 
                    :ref="options.name || 'input'" 
                    :error="message">
                    <el-input
                        :placeholder="options.placeholder || ''"
                        :type="options.type || 'text'"
                        v-model="inputVal">
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            inputVal: '',
            message: '',
        }
    },
    props:{
        title: '',
        options: {},
    },
    mounted () {
        this.inputVal = '';
    },
    methods: {
        beforeConfirmAction () {
            let that = this;
            if(that.options.pattern){
                if(!that.options.pattern.test(that.inputVal)){
                    that.message = that.options.errorMessage || '请输入正确的' + that.options.label;
                    return false;
                }
            }
            return that.inputVal;
        },
        afterConfirmAction (res){
            let that = this;
            if (res.checkResult === false) {
                that.message = res.errorText;
                that.inputVal = '';
                return false;
            } else{
                return true;
            }
        },
    },
    watch:{
        inputVal(val){
            if(this.options.pattern){
                if(this.options.pattern.test(val)){
                    this.message = '';
                }
            }else{
                this.message = '';
            }
        }
    }
}
</script>
<style lang='less'>
.editBox-wrap{
    .title{
        font-weight:700;
        color:#252525;
        font-size:42px;
        line-height:68px;
        text-align:center;
        position: relative;
        top: -24px;
    }
    .input-wrap{
        margin-top: 16px;
        width: 100%;
        height: 180px;
        background-color:#f7f7fa;
        border-radius:4px;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-form{
            .el-form-item{
                display: flex;
                align-items: center;
                margin-bottom: 0;
                .el-form-item__label{
                    color:#252525;
                    font-size:24px;
                    line-height:68px;
                    margin-right: 12px;
                }
                .el-form-item__content{
                    display: inline-block;
                    .el-input{
                        .el-input__inner{
                            width:406.08px;
                            height:56px;
                            background-color:#ffffff;
                            border:1px solid;
                            border-color:#8d8d8d;
                            border-radius:2px;
                            color:#222222;
                            font-size:24px;
                            letter-spacing:2.86px;
                        }
                    }
                    .el-form-item__error{
                        font-size: 22px;
                        text-align: left;
                    }
                }
                &.is-error{
                    .el-form-item__content{
                        .el-input{
                            .el-input__inner{
                                border-color: #f56c6c;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>