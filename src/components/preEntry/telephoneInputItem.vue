电话输入框，包含国号，区号和号码

<template>
  <div 
    :id="field.FIELD_ID" 
    :class="itemClass + ' ' + field.FIELD_ID" 
    v-show="isShow"
    class="telephone-input-item"
    >
    <kui-telinput
      :ref="field.FIELD_ID"
      :options="{
        title: title,
        required: isRequired,
        width: field.width,
        validType: field.VALID_TYPE,
        field: field.FIELD_ID,
        validatorField: validatorField,
        isShowCountryCode: isShowCountryCode,
        countryChange: countryChange,
        onChange: onChange,
        labelWidth: field.labelWidth || 200,
        disabled: isDisabled,
        isVertical: field.isVertical === false? false : true,
      }"
    ></kui-telinput>
  </div>
</template>

<script>
import validateRules from './validateRules'

export default {
  data() {
    return {
      itemClass: "self-telephoneInput",
      isDisabled: false,
      triggerType: ["change","blur"],
      rules: [],
      phoneNoMaxLength: 8
    }
  },
  props: ["field", "index", "isBaseUI"],
  created() {
    this.countryNo = "+86"
  },
  mounted() {
    this.field.DEFAULT_VALUE && this.$refs[this.field.FIELD_ID].setValue(this.field.DEFAULT_VALUE);
    this.itemClass += " " + this.field.FIELD_ID;

    if(this.isRequired)
      this.itemClass += " self-telephoneInput-required";

    if(this.isShowChange)
      this.itemClass += " self-telephoneInput-changed";

      this.$nextTick( () => {
        //由于组件写死了校验 这里重新重置校验规则
        this.$refs[this.field.FIELD_ID].$refs.AREA_CODE.textinput({validType: "num[3,5]", onBlur: this.onBlur});
        if (!this.field.VALID_TYPE) {
          this.$refs[this.field.FIELD_ID].$refs.TEL_CODE.textinput({validType: "", onBlur: this.onBlur});
          this.$refs[this.field.FIELD_ID].$refs.TEL_CODE.options.maxlength = 32;
        }
        //客户需求去除必填项提示
        this.$refs[this.field.FIELD_ID].$refs.AREA_CODE.$refs.validatebox.$watch("validateMsg", (newValue, oldValue) => {
          if (newValue.indexOf("必填项") > -1) {
            this.$refs[this.field.FIELD_ID].$refs.AREA_CODE.$refs.validatebox.validateMsg = "";
            this.$refs[this.field.FIELD_ID].$refs.AREA_CODE.$refs.validatebox.isShowTips = false;
          }
        })
        this.$refs[this.field.FIELD_ID].validate();
      })

  },
  computed: {
    title: function () {
      this.field.FIELD_TITLE = this.field.FIELD_TITLE.replace("\\n", "\n");
      return _.trim(this.field.FIELD_TITLE) ? this.field.FIELD_TITLE : "";
    },
    isRequired: function () {
      return parseInt(this.field.FIELD_REQUIRED) ? true : false;
    },
    isShow: function() {
      let fieldControl = parseInt(this.field.FIELD_CONTROL);
      if(fieldControl == 2){
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
      
      if(fieldControl === 0 || fieldControl === 2){
        return true;
      } else {
        return false;
      }
    },
    dataChange: function() {
      return this.field.DEFAULT_VALUE;
    },
    isShowChange: function() {
      return this.field.showchange;
    },
    isShowCountryCode:function(){
      //telPhoneType 0显示国际区号和城市区号
      if(this.field.telPhoneType == 0){
        return true;
      }else{
        return false;
      }
    },
    isShowCode:function(){
      //telPhoneType 0显示国际区号和城市区号 1只显示城市区号 2只显示电话
      if(this.field.telPhoneType == 0 || this.field.telPhoneType == 1){
        return true;
      }else{
        return false;
      }
    }
  },
  methods: {
    validatorField: function (isValidTrue) {
      if (isValidTrue && !this.checkTelPhone()) {
        isValidTrue = false;
      }
      // this.$nextTick(() => {
        if(isValidTrue){
          this.field.correct = true;
          this.field.showerr = false;
          this.field.message = "";
          if(this.isBaseUI) {
            this.$emit('field-change', this.field)
          } else {
            this.$store.commit(this.$types.UPDATE_FIELD_CHANGE, { field_id:this.field.FIELD_ID, module_id:this.field.MODULE_ID, index:this.index });
          }
        }else{
          this.field.correct = false;
          this.field.showerr = true;
          if(_.trim(this.field.DEFAULT_VALUE) === "" && this.isRequired && this.isShow){
            this.field.FIELD_CONTROL = '0';
          }
        }
      // });
    },
    onBlur(value,e) {
      setTimeout(() => {
        this.$refs[this.field.FIELD_ID].validate();
      }, 0);
    },
    //电话号码校验规则 组件添加了相关规则可以删除
    checkTelPhone() {
      let phoneVal = this.$refs[this.field.FIELD_ID].$refs.TEL_CODE.getValue() || "";
      let areaVal = this.$refs[this.field.FIELD_ID].$refs.AREA_CODE.getValue() || "";
      //校验提示
      //没有填写区号 填写了电话
      if (!areaVal && phoneVal) {
        this.$nextTick( () => {
          this.$refs[this.field.FIELD_ID].$refs.TEL_CODE.showTips("请输入电话区号");
        })
        return false;
      }
      //有区号 无电话
      if (areaVal && !phoneVal) {
        this.$nextTick( () => {
          this.$refs[this.field.FIELD_ID].$refs.TEL_CODE.showTips("");
        })
        return false;
      }
      //有区号有电话
      let telLength = areaVal.length + phoneVal.length;
      if (areaVal && phoneVal && (telLength < 10 ||telLength > 16) && _.isEmpty(this.field.VALID_TYPE)) {
        this.$nextTick( () => {
          this.$refs[this.field.FIELD_ID].$refs.TEL_CODE.showTips("加上区号请输入10到16个数字");
        })
        return false;
      }
      return true;
     
    },
    countryChange(val){
        let newValue = _.cloneDeep(val) || "";
        let newValueArr = newValue.split("-") || [];
        if (newValueArr.length > 2) {
            let phoneVal = newValueArr.pop();
            let areaVal = newValueArr.pop();
            let quhaoVAl = newValueArr.pop();
            if(quhaoVAl && quhaoVAl.indexOf("86") > -1) {
              newValue = areaVal ? areaVal + "-" + phoneVal : phoneVal;
            }else {
                newValue = val;
            }
        }else {
           newValue = val;
        }
       this.field.DEFAULT_VALUE = newValue;
    },
    onChange(val){
        let newValue = _.cloneDeep(val) || "";
        let newValueArr = newValue.split("-") || [];
        if (newValueArr.length > 2) {
            let phoneVal = newValueArr.pop() || "";
            let areaVal = newValueArr.pop() || "";
            let quhaoVAl = newValueArr.pop() || "";
            if(quhaoVAl && quhaoVAl.indexOf("86") > -1) {
                newValue = areaVal ? areaVal + "-" + phoneVal : phoneVal;
            }else {
                newValue = val
            }
        }else {
            newValue = val
        }
        this.field.DEFAULT_VALUE = newValue;
        //onchange的时候会隐藏提示信息 重新校验一遍
        this.$refs[this.field.FIELD_ID].validate();
    }
  },
  watch: {
    isRequired: function(val) {
      if(val){
        this.itemClass += " self-telephoneInput-required";
      } else {
        this.itemClass = this.itemClass.replace(/self-telephoneInput-required/g, "");
      }
    },
    isShowChange: function(val) {
      if(val) {
        this.itemClass += " self-telephoneInput-changed";
      } else {
        this.itemClass = this.itemClass.replace(/self-telephoneInput-changed/g, "");
      }
    },
    "field.FIELD_CONTROL": function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      val == 2? fieldRef.combobox("setDisabled") : fieldRef.combobox("setEnabled");
    },
    'field.FIELD_REQUIRED': function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      parseInt(val) ? fieldRef.changeRequired(true) : fieldRef.changeRequired(false);
    }
  }
};
</script>

<style lang="less">
.self-telephoneInput {
  .el-input-group__append {
    color: #fff;
    background: #217fff;
  }
}
</style>