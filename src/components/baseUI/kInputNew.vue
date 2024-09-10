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
    <kui-textinput :options.sync="options" />
</template>

<script>

export default {
    data() {
        return {
            options: {
                title: this.field.FIELD_TITLE,
                required: this.field.FIELD_REQUIRED == '1' ? true : false,
                disabled: this.field.FIELD_REQUIRED == '2' ? true : false ,
                field: this.field.FIELD_ID,
                buttonText: this.field.FIELD_BUTTON_TXT,
                placeholder: this.field.PLACE_HOLDER,
                btnDisabled: this.field.BUTTON_ENABLE,
                validType: this.field['VALID_TYPE'] || telephone,
                onChange: this.busiLogic[this.field.FIELD_FUNCTION] || new Function(),
                onButtonClick: this.busiLogic[this.field.FIELD_FUNCTION+'__CLICK'] || new Function(),
            }
        }
    },
    props: ['field','busiLogic'],
    mounted() {
        //手动赋值
        this.$children[0].setValue(this.field.DEFAULT_VALUE);
    },
    methods: {
        
    },
}
</script>

<style lang="less">

</style>
