地址输入框，包含国家，省，市，街道等分段输入框

ID_ADDR: Object
    BUSI_CODE: "V0011"
    DEFAULT_VALUE: "江西省南昌市新建县"
    FIELD_ADDITION: Object
    FIELD_BUSI_PLAT: ""
    FIELD_CONTROL: "0"
    FIELD_DICT: ""
    FIELD_DICT_FILTER: ""
    FIELD_FUNCTION: ""
    FIELD_ID: "ID_ADDR"
    FIELD_REQUIRED: "1"
    FIELD_SEQ: "80"
    FIELD_TITLE: "证件地址"
    FIELD_TYPE: "addressInput"
    IS_SHOW_BUTTON: false
    MODULE_ID: "CUST_BASIC_INFO_STEP1"
    PLACE_HOLDER: ""
    USER_TYPE: "0"
    VALID_TYPE: ""
    component: "addressInput"
    correct: "true"
    message: ""
    showRegionSelector: true
    showCountrySelector: true
    showchange: false
    showerr: false

<template>
    <address-input-item :field.sync="field" :isBaseUI="isBaseUI" @use-id-address="useIDAddress" @field-change="fieldChange" />
</template>

<script>
import addressInputItem from '../preEntry/addressInputItem'
import kMixins from './kMixins';

export default {
    mixins: [kMixins],
    data() {
        return {
            isBaseUI: true,
            field: {
                DEFAULT_VALUE: this.value,
                FIELD_CONTROL: this.hide ? "1" : (this.disabled ? "2" : "0"),
                FIELD_FUNCTION: this.useidaddr ? "USE_ID_ADDRESS" : "",
                FIELD_ID: this.id,
                FIELD_REQUIRED: this.required ? "1" : "0",
                FIELD_TITLE: this.label,
                index:this.index,
                showchange: this.change,
                showRegionSelector: this.showRegion,
                showCountrySelector: this.showCountry,
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
        useidaddr: Boolean,     // 字段按钮，是否使用证件地址
        change: Boolean,        // 字段是否显示改变状态
        required: Boolean,      // 字段是否显示必填状态
        disabled: Boolean,      // 字段是否禁止
        hide: Boolean,          // 字段是否隐藏
        index: Number,            //有多个重复证件地址的index值   
        showRegion: {
            type: Boolean,
            default: true
        },                      // 字段地址是否显示省市区选择
        showCountry: Boolean,   // 字段地址是否显示国家选择
        useIDAddress: {
            type: Function,
            default: () => {}
        },                      // 字段按钮点击使用证件地址事件
        fieldChange: {
            type: Function,
            default: () => {}
        },                      // 字段值变化事件
    },
    components: {
        addressInputItem
    },
    watch: {
        'field.DEFAULT_VALUE'(val) {
            this.$emit('update:value', val)
        },
        value(val) {
            this.field["DEFAULT_VALUE"] = val
        },
        useidaddr(val) {
            this.field["FIELD_FUNCTION"] = this.useidaddr ? "USE_ID_ADDRESS" : ""
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
