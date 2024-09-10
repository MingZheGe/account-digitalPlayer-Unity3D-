电话输入框，包含国号，区号和号码

TEL: Object
    BUSI_CODE: "Z0035"
    DEFAULT_VALUE: ""
    FIELD_ADDITION: Object
    FIELD_BUSI_PLAT: ""
    FIELD_CONTROL: "0"
    FIELD_DICT: ""
    FIELD_DICT_FILTER: ""
    FIELD_FUNCTION: ""
    FIELD_ID: "TEL"
    FIELD_REQUIRED: "0"
    FIELD_SEQ: "20"
    FIELD_TITLE: "固定电话"
    FIELD_TYPE: "telephone"
    IS_SHOW_BUTTON: false
    MODULE_ID: "CUST_LINK_INFO"
    PLACE_HOLDER: ""
    USER_TYPE: "0"
    VALID_TYPE: "tel"
    correct: "true"
    message: ""
    showchange: false
    showerr: false
    telPhoneType: 0

<template>
    <telephone-input-item :field.sync="field" :isBaseUI="isBaseUI" @field-change="fieldChange" />
</template>

<script>
import telephoneInputItem from '../preEntry/telephoneInputItem'
import kMixins from './kMixins';

export default {
    mixins: [kMixins],
    data() {
        return {
            isBaseUI: true,
            field: {
                DEFAULT_VALUE: this.value,
                FIELD_ADDITION: {},
                FIELD_CONTROL: this.hide ? "1" : (this.disabled ? "2" : "0"),
                FIELD_ID: this.id,
                FIELD_REQUIRED: this.required ? "1" : "0",
                FIELD_TITLE: this.label,
                showchange: this.change,
                correct: true,
                message: "",
                showerr: false,
                telPhoneType: this.telphonetype
            }
        }
    },
    props: {
        id: String,             // 字段id，必填
        label: String,          // 字段标题，必填
        value: String,          // 字段值
        change: Boolean,        // 字段是否显示改变状态
        required: Boolean,      // 字段是否显示必填状态
        disabled: Boolean,      // 字段是否禁止
        hide: Boolean,          // 字段是否隐藏
        telphonetype: {
            type: Number,
            default: 0
        },   // 字段号码类型 0显示国际区号和城市区号 1只显示城市区号 2只显示电话
        fieldChange: {
            type: Function,
            default: () => {}
        },                      // 字段值变化事件
    },
    components: {
        telephoneInputItem
    },
    watch: {
        'field.DEFAULT_VALUE'(val) {
            this.$emit('update:value', val)
        },
        value(val) {
            this.field["DEFAULT_VALUE"] = val
        },
        telphonetype(val) {
            this.field["telPhoneType"] = this.telphonetype
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