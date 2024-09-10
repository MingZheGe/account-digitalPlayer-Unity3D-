地址输入框，包含国家，省，市，街道等分段输入框

ID_ADDR: Object
    BUSI_CODE:"V0034"
    DEFAULT_VALUE:"19811216"
    FIELD_ADDITION:Object (empty)
    FIELD_BUSI_PLAT:""
    FIELD_CONTROL:"0"
    FIELD_DICT:""
    FIELD_DICT_FILTER:""
    FIELD_FUNCTION:"CHECK_BIRTHDAY"
    FIELD_ID:"BIRTHDAY"
    FIELD_REQUIRED:"0"
    FIELD_SEQ:"40"
    FIELD_TITLE:"出生日期"
    FIELD_TYPE:"normalText"
    IS_SHOW_BUTTON:false
    MODULE_ID:"CUST_BASIC_IMPORT_MODULE"
    PLACE_HOLDER:""
    USER_TYPE:"0"
    VALID_TYPE:"birthday"
    component:"normalText"
    correct:"true"
    message:""
    showchange:false
    showerr:false

<template>
    <textItem :field.sync="field" :isBaseUI="isBaseUI"  @click-button="clickButton"  @field-change="fieldChange" />
</template>

<script>
import textItem from '../preEntry/normalTextItem'
import kMixins from './kMixins';

export default {
    mixins: [kMixins],
    data() {
        return {
            isBaseUI: true,
            field: {
                DEFAULT_VALUE: this.value,
                FIELD_CONTROL: this.hide ? "1" : (this.disabled ? "2" : "0"),
                FIELD_FUNCTION:  "",
                FIELD_ID: this.id,
                FIELD_REQUIRED: this.required ? "1" : "0",
                FIELD_TITLE: this.label,
                IS_SHOW_BUTTON: typeof this.buttontxt != 'undefined',
                FIELD_BUTTON_TXT: this.buttontxt,                
                showchange: this.change,
                correct: true,
                message: "",
                showerr: false,
            }
        }
    },
    props: {
        id: String,             // 字段id，必填
        label: String,          // 字段标题，必填
        value: String,          // 字段值
        change: Boolean,        // 字段是否显示改变状态
        buttontxt: String,      // 字段按钮值，不填按钮隐藏
        buttonEnable: Boolean,   // 字段按钮是否可点击
        required: Boolean,      // 字段是否显示必填状态
        disabled: Boolean,      // 字段是否禁止
        hide: Boolean,          // 字段是否隐藏    
        clickButton: {
            type: Function,
            default: () => {}
        },                   
        fieldChange: {
            type: Function,
            default: () => {}
        },                      // 字段值变化事件
    },
    components: {
        textItem
    },
    watch: {
        'field.DEFAULT_VALUE'(val) {
            this.$emit('update:value', val)
        },
        value(val) {
            this.field["DEFAULT_VALUE"] = val
        },
        change(val) {
            this.field["showchange"] = val
        },
        required(val) {
            this.field["FIELD_REQUIRED"] = this.required ? "1" : "0"
        },
        disabled(val) {
            this.field["FIELD_CONTROL"] = this.hide ? "1" : (this.disabled ? "2" : "0")
        },
        hide(val) {
            this.field["FIELD_CONTROL"] = this.hide ? "1" : (this.disabled ? "2" : "0")
        }
    }
}
</script>

<style lang="less">

</style>
