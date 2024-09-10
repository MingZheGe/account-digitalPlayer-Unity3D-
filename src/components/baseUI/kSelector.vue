下拉选择框

IDCARD_TYPE: Object
    BUSI_CODE: "V0011"
    DEFAULT_VALUE: "2"
    FIELD_ADDITION: Object
    FIELD_BUSI_PLAT: ""
    FIELD_CONTROL: "1"
    FIELD_DICT: "IDCARD_TYPE"
    FIELD_DICT_FILTER: ""
    FIELD_DICT_NAME: Array(4)
        0:
            DICT_CODE: "IDCARD_TYPE"
            DICT_ITEM: "*"
            DICT_ITEM_NAME: "未归类"
            DICT_ORD: "0"
            ORG_CODE: "0000"
        1:
            DICT_CODE: "IDCARD_TYPE"
            DICT_ITEM: "1"
            DICT_ITEM_NAME: "第一代证件"
            DICT_ORD: "0"
            ORG_CODE: "0000"
        2: {…}
        3: {…}
    FIELD_FUNCTION: ""
    FIELD_ID: "IDCARD_TYPE"
    FIELD_REQUIRED: "1"
    FIELD_SEQ: "90"
    FIELD_TITLE: "证件标识"
    FIELD_TYPE: "selector"
    IS_SHOW_BUTTON: false
    MODULE_ID: "CUST_BASIC_INFO_STEP1"
    PLACE_HOLDER: ""
    USER_TYPE: "0"
    VALID_TYPE: ""
    component: "selector"
    correct: "true"
    message: ""
    showchange: false
    showerr: false


<template>
    <selector-item :field.sync="field" :isBaseUI="isBaseUI" @field-change="fieldChange" />
</template>

<script>
import selectorItem from '../preEntry/selectorItem'
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
                PLACE_HOLDER: this.placeholder,
                showchange: this.change,
                correct: true,
                message: "",
                showerr: false,
                FIELD_DICT_FILTER: this.dictfilter,
                FIELD_DICT_NAME: this.dicts,
                hideDictItem: this.hideDictItem
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
        placeholder: String,    // 字段留空值
        change: Boolean,        // 字段是否显示改变状态
        required: Boolean,      // 字段是否显示必填状态
        disabled: Boolean,      // 字段是否禁止
        hide: Boolean,          // 字段是否隐藏
        dictfilter: {           // 字典过滤项
            type: Array,
            default: () => []
        },
        dicts: Array,           // 字典项，已经转换成对应字典对象
        hideDictItem:Boolean,
        fieldChange: {
            type: Function,
            default: () => {}
        },                      // 字段值变化事件
    },
    components: {
        selectorItem
    },
    watch: {
        'field.DEFAULT_VALUE'(val) {
            this.$emit('update:value', val)
        },
        value(val) {
            this.field["DEFAULT_VALUE"] = val
        },
        placeholder(val) {
            this.field["PLACE_HOLDER"] = val
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
        dictfilter(val) {
            this.field["FIELD_DICT_FILTER"] = val
        },
        dicts(val) {
            this.field["FIELD_DICT_NAME"] = val
        },
        hideDictItem(val){
            this.field.hideDictItem = val;
        }
    }
}
</script>

<style lang="less">

</style>
