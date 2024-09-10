日期选择框，可用于身份证有效期等，如用身份证有效期去加个长期勾选框

ID_BEG_DATE: Object
    BUSI_CODE: "V0011"
    DEFAULT_VALUE: "20190102"
    FIELD_ADDITION: Object
    FIELD_BUSI_PLAT: ""
    FIELD_CONTROL: "0"
    FIELD_DICT: ""
    FIELD_DICT_FILTER: ""
    FIELD_FUNCTION: "GROUP_READ_DATA"
    FIELD_ID: "ID_BEG_DATE"
    FIELD_REQUIRED: "1"
    FIELD_SEQ: "50"
    FIELD_TITLE: "证件开始日期"
    FIELD_TYPE: "date"
    IS_SHOW_BUTTON: false
    MODULE_ID: "CUST_BASIC_INFO_STEP1"
    PLACE_HOLDER: ""
    USER_TYPE: "0"
    VALID_TYPE: "begin"
    correct: "true"
    message: ""
    showchange: false
    showerr: false

<template>
    <date-pick-item :field.sync="field" :isBaseUI="isBaseUI" @field-change="fieldChange" />
</template>

<script>
import datePickItem from '../preEntry/datePickItem'
import kMixins from './kMixins';

export default {
    mixins: [kMixins],
    data() {
        return {
            isBaseUI: true,
            field: {
                DEFAULT_VALUE: this.value,
                FIELD_CONTROL: this.hide ? "1" : (this.disabled ? "2" : "0"),
                FIELD_ID: this.id,
                FIELD_REQUIRED: this.required ? "1" : "0",
                FIELD_TITLE: this.label,
                VALID_TYPE: this.longTime ? "end" : (this.disableFuture ? "begin" : ""),
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
        value: {
            type: String,
            default: "0"
        },                      // 字段值
        change: Boolean,        // 字段是否显示改变状态
        required: Boolean,      // 字段是否显示必填状态
        disabled: Boolean,      // 字段是否禁止
        hide: Boolean,          // 字段是否隐藏
        longTime: Boolean,        // 字段是否是长期日期
        disableFuture: Boolean, // 字段是否日期只往前显示
        fieldChange: {
            type: Function,
            default: () => {}
        },                      // 字段值变化事件
    },
    components: {
        datePickItem
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
        },
        longTime(val) {
            this.field["VALID_TYPE"] = this.longTime ? "end" : (this.disableFuture ? "begin" : "")
        },
        disableFuture(val) {
            this.field["VALID_TYPE"] = this.disableFuture ? "begin" : (this.longTime ? "end" : "")
        }
    }
}
</script>

<style lang="less">

</style>
