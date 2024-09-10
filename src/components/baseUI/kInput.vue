通用输入框

ID_CODE: Object
    BUSI_CODE: "V0011"
    DEFAULT_VALUE: "430800198512159657"
    FIELD_ADDITION: Object
    FIELD_BUSI_PLAT: ""
    FIELD_CONTROL: "0"
    FIELD_DICT: ""
    FIELD_DICT_FILTER: ""
    FIELD_FUNCTION: "GET_CUST_INFO|CHECK_ID_CODE"
    FIELD_ID: "ID_CODE"
    FIELD_REQUIRED: "1"
    FIELD_SEQ: "40"
    FIELD_TITLE: "证件号码"
    FIELD_TYPE: "normalinput"
    IS_SHOW_BUTTON: false
    MODULE_ID: "CUST_BASIC_INFO_STEP1"
    PLACE_HOLDER: ""
    USER_TYPE: "0"
    VALID_TYPE: "cardno[true]|length[6,30]|on-blur"
    component: "normalinput"
    correct: "true"
    message: ""
    showchange: false
    showerr: false

<template>
  <normal-input-item
    :ref="field.FIELD_ID"
    :field.sync="field"
    :isBaseUI="isBaseUI"
    @click-button="clickButton"
    @field-change="fieldChange"
  />
</template>

<script>
import normalInputItem from '../preEntry/normalInputItem'
import kMixins from './kMixins';

export default {
  mixins: [kMixins],
  data () {
    return {
      isBaseUI: true,
      field: {
        DEFAULT_VALUE: this.value,
        MODULE_ID: this.moduleId,
        FIELD_CONTROL: this.hide ? "1" : (this.disabled ? "2" : "0"),
        FIELD_ID: this.id,
        FIELD_REQUIRED: this.required ? "1" : "0",
        FIELD_TITLE: this.label,
        IS_SHOW_BUTTON: typeof this.buttontxt != 'undefined',
        FIELD_BUTTON_TXT: this.buttontxt,
        PLACE_HOLDER: this.placeholder,
        VALID_TYPE: this.validtype,
        BUTTON_ENABLE: this.buttonEnable,
        MESSAGE_REMINDER: this.messageReminder,
        showchange: this.change,
        correct: true,
        message: "",
        showerr: false,
        promptValue: '',
      }
    }
  },
  props: {
    id: String,             // 字段id，必填
    moduleId: String,        // 模块id，非必填
    label: String,          // 字段标题，必填
    value: [String, Number],// 字段值
    placeholder: String,    // 字段留空值
    buttontxt: String,      // 字段按钮值，不填按钮隐藏
    buttonEnable: Boolean,   // 字段按钮是否可点击
    validtype: String,      // 字段校验类型
    change: Boolean,        // 字段是否显示改变状态
    required: Boolean,      // 字段是否显示必填状态
    disabled: Boolean,      // 字段是否禁止
    hide: Boolean,          // 字段是否隐藏
    prompt: String,//二次确认框的值
    messageReminder: String,  //组件下方一直显示的提示信息 比如银行卡输入组件下面的 ‘请确认签约的银行卡已开通电话银行，并已设置电话银行密码’。
    clickButton: {
      type: Function,
      default: () => { }
    },                      // 字段按钮点击事件
    fieldChange: {
      type: Function,
      default: () => { }
    },                      // 字段值变化事件
  },
  components: {
    normalInputItem
  },
  watch: {
    'field.DEFAULT_VALUE' (val) {
      this.$emit('update:value', val)
    },
    value (val) {
      this.field["DEFAULT_VALUE"] = val
    },
    placeholder (val) {
      this.field["PLACE_HOLDER"] = val
    },
    buttontxt (val) {
      this.field["FIELD_BUTTON_TXT"] = val
    },
    buttonEnable (val) {
      this.field["BUTTON_ENABLE"] = val
    },
    validtype (val) {
      this.field["VALID_TYPE"] = val
    },
    change (val) {
      this.field["showchange"] = val
    },
    required (val) {
      this.field["FIELD_REQUIRED"] = this.required ? "1" : "0"
    },
    disabled (val) {
      this.field["FIELD_CONTROL"] = this.hide ? "1" : (this.disabled ? "2" : "0")
    },
    hide (val) {
      this.field["FIELD_CONTROL"] = this.hide ? "1" : (this.disabled ? "2" : "0")
    },
    messageReminder (val) {
      this.field["MESSAGE_REMINDER"] = val
    },
    prompt (val) {
      this.field["promptValue"] = val
    }
  },
  methods: {
    fieldChangeWrap (field) {
      let that = this;
      return new Promise(function (resolve, reject) {
        resolve(that.fieldChange(field));
      })
    }
  },
}
</script>

<style lang="less">
</style>
