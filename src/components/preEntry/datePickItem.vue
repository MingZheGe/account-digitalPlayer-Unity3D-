日期选择框，可用于身份证有效期等，如用身份证有效期去加个长期勾选框

<template>
    <div :id="field.FIELD_ID" :class="itemClass + ' ' + field.FIELD_ID" v-show="isShow">
        <kui-datebox
          :ref ="field.FIELD_ID"
          :options="{
              isShowLongTime: isShowLong,
              title: title,
              required: isRequired,
              validType: 'date',
              width: field.width,
              editable: false,
              disabled: isDisabled,
              isCurrentDateMin: isCurrentDateMin,
              isCurrentDateMax: isCurrentDateMax,
              field: field.FIELD_ID,
              setLongTime: setLongTime,
              onChange: onChange,
              isVertical:  field.isVertical === false? false : true,
              validatorField: validatorField,
              labelWidth: field.labelWidth || 200
          }"
        ></kui-datebox>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                itemClass: "self-datePick",
                longTime: false,
                disablePast: this.field.VALID_TYPE == "end",
                disableFuture: (this.field.VALID_TYPE == "begin" || this.field.VALID_TYPE == "birthday"),
                during: this.field.VALID_TYPE.indexOf("during") != -1,
                isDisabled: false,
                triggerType: "custom",
                rules: [],
                pickerOptions: {
                    disabledDate: null
                }
            }
        },
        props: ["field", "index", "isBaseUI"],
        created() {
            if (this.field.DEFAULT_VALUE == "0" || this.field.DEFAULT_VALUE.length != 8) {
                this.field.DEFAULT_VALUE = "";
            }
        },
        mounted() {
            this.$refs[this.field.FIELD_ID].setValue(this.field.DEFAULT_VALUE, true);
            this.itemClass += " " + this.field.FIELD_ID;

            if (this.isRequired)
                this.itemClass += " self-datePick-required";

            if (this.isShowChange)
                this.itemClass += " self-datePick-changed";

            if (this.isShowLong)
                this.itemClass += " self-datePick-showlong";
        },
        computed: {
            title: function () {
                this.field.FIELD_TITLE = this.field.FIELD_TITLE.replace("\\n", "\n");
                return  _.trim(this.field.FIELD_TITLE) ? this.field.FIELD_TITLE : "";
            },
            isRequired: function () {
                return parseInt(this.field.FIELD_REQUIRED) ? true : false;
            },
            isShowLong: function () {
                return this.field.VALID_TYPE == "end";
            },
            isShow: function () {
                let fieldControl = parseInt(this.field.FIELD_CONTROL);
                if (fieldControl == 2) {
                    this.isDisabled = true;
                } else {
                    this.isDisabled = false;
                }

                if (fieldControl === 0 || fieldControl === 2) {
                    return true;
                } else {
                    return false;
                }
            },
            messageChange: function () {
                return this.field.message;
            },
            dataChange: function () {
                return this.field.DEFAULT_VALUE;
            },
            isShowChange: function () {
                return this.field.showchange;
            },
            isCurrentDateMin: function() {
                return this.disablePast;
            },
            isCurrentDateMax: function() {
                return this.disableFuture;
            }
        },
        methods: {
            validatorField: function (isValidTrue) {
                if(isValidTrue){
                    this.field.correct = true;
                    this.field.message = "";
                    this.field.showerr = false;
                    if (this.isBaseUI) {
                        this.$emit('field-change', this.field)
                    } else {
                        this.$store.commit(this.$types.UPDATE_FIELD_CHANGE, {
                            field_id: this.field.FIELD_ID,
                            module_id: this.field.MODULE_ID,
                            index: this.index
                        });
                    }
                    return true
                }else{
                    this.field.correct = false;
                    this.field.showerr = true;
                    if (_.trim(this.field.DEFAULT_VALUE) === "" && this.isRequired && this.isShow){
                        this.field.FIELD_CONTROL = "0";
                    }
                }
                return false
            },
            setLongTime(val) {
                this.field.DEFAULT_VALUE = val;
            },
            onChange(val){
                this.field.DEFAULT_VALUE = val;
            }
        },
        watch: {
            isRequired: function (val) {
                if (val) {
                    this.itemClass += " self-datePick-required";
                } else {
                    this.itemClass = this.itemClass.replace(/self-datePick-required/g, "");
                }
            },
            isShowChange: function (val) {
                if (val) {
                    this.itemClass += " self-datePick-changed";
                } else {
                    this.itemClass = this.itemClass.replace(/self-datePick-changed/g, "");
                }
            },
            dataChange: function (val) {
                // this.initData();
                this.field.message = "";
                 // 自定义触发校验事件
                this.$refs[this.field.FIELD_ID].setValue(val, false);
            },
            'field.FIELD_REQUIRED': function(val) {
                let fieldRef = this.$refs[this.field.FIELD_ID];
                parseInt(val) ? fieldRef.changeRequired(true) : fieldRef.changeRequired(false);
            },
            "field.FIELD_CONTROL": function(val) {
                let fieldRef = this.$refs[this.field.FIELD_ID];
                val == 2? fieldRef.datebox("setDisabled") : fieldRef.datebox("setEnabled");
            },
            "field.showerr": function(val) {
                let fieldRef = this.$refs[this.field.FIELD_ID];
                //自定义校验显示
                if (this.field.changeMessage && this.field.DEFAULT_VALUE) {
                    this.field.showErrorMsg = this.field.changeMessage;
                }
                this.field.correct = !val;
                val && this.field.showErrorMsg? fieldRef.showTips(this.field.showErrorMsg) : null;
            }
            // messageChange: function (val) {
            //     this.$refs[this.field.FIELD_ID].validate(); // 自定义触发校验事件
            // },
            // longTime: function (val) {
            //     if (val) {
            //         this.field.DEFAULT_VALUE = "30001231"

            //     } else if (this.field.DEFAULT_VALUE == "30001231") {
            //         let d = new Date();
            //         let month = d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)
            //         let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
            //         let date = d.getFullYear() + month + day + "";
            //         //取消长期则显示当前日期(中信建投需求：取消不显示当前日期 显示空)
            //         this.field.DEFAULT_VALUE = ""
            //     }
            // },
        }
    };
</script>

<style lang="less">

</style>
