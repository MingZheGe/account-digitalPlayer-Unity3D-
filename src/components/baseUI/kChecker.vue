通用勾选框

TAX_RESIDENT_TYPE: Object
    BUSI_CODE: "V0011"
    DEFAULT_VALUE: "1"
    FIELD_ADDITION: Object
    FIELD_BUSI_PLAT: ""
    FIELD_CONTROL: "0"
    FIELD_DICT: "TAX_FLAG"
    FIELD_DICT_FILTER: "["1","2","3","4"]"
    FIELD_DICT_NAME: Array(5)
        0:
            DICT_CODE: "TAX_FLAG"
            DICT_ITEM: "1"
            DICT_ITEM_NAME: "仅为中国税收居民"
            DICT_ORD: "0"
            ORG_CODE: "0000"
        1:
            DICT_CODE: "TAX_FLAG"
            DICT_ITEM: "2"
            DICT_ITEM_NAME: "仅为非居民"
            DICT_ORD: "0"
            ORG_CODE: "0000"
        2:
            DICT_CODE: "TAX_FLAG"
            DICT_ITEM: "3"
            DICT_ITEM_NAME: "既是中国税收居民又是其他国家(地区)税收居民"
            DICT_ORD: "0"
            ORG_CODE: "0000"
    FIELD_FUNCTION: "CHECK_TAX_FLAG"
    FIELD_ID: "TAX_RESIDENT_TYPE"
    FIELD_REQUIRED: "1"
    FIELD_SEQ: "10"
    FIELD_TITLE: "客户涉税居民身份"
    FIELD_TYPE: "checker"
    IS_SHOW_BUTTON: false
    MODULE_ID: "CUST_TAX_INFO_STEP1"
    PLACE_HOLDER: ""
    USER_TYPE: "0"
    VALID_TYPE: ""
    correct: "true"
    message: ""
    showchange: false
    showerr: false

<template>
    <checker-item :field.sync="field" :isBaseUI="isBaseUI" @field-change="fieldChange" />
</template>

<script>
import checkerItem from '../preEntry/checkerItem'
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
                showchange: this.change,
                isShowAllBtn: this.isShowAllBtn, 
                correct: true,
                message: "",
                showerr: false,
                FIELD_DICT_FILTER: this.dictfilter,
                FIELD_DICT_NAME: this.dicts,
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
        dictfilter: {           // 字典过滤项
            type: String,
            default: ""
        },
        isShowAllBtn:{          //是否展示全选按钮
            type: Boolean,
            default: false
        },
        dicts: Array,           // 字典项，已经转换成对应字典对象
        fieldChange: {
            type: Function,
            default: () => {}
        },                     // 字段值变化事件
    },
    components: {
        checkerItem
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
        dictfilter(val) {
            this.field["FIELD_DICT_FILTER"] = val
        },
        dicts(val) {
            this.field["FIELD_DICT_NAME"] = val
        },
    }
}
</script>

<style lang="less">

</style>
