通用输入框

<template>
  <div
    :id="field.FIELD_ID"
    :class="itemClass + ' ' + field.FIELD_ID"
    v-show="isShow"
  >
    <kui-textinput
      :ref="field.FIELD_ID"
      :options="{
        title: title,
        isVertical: field.isVertical === false? false : true,
        field: field.FIELD_ID,
        val: field.DEFAULT_VALUE,
        required: isRequired,
        FIELD_REQUIRED: field.FIELD_REQUIRED,
        FIELD_CONTROL: field.FIELD_CONTROL,
        placeholder: field.PLACE_HOLDER,
        buttonText: fieldButtonTxt,
        width: field.width,
        promptValue: field.promptValue,
        clearable: field.clearable,
        showPassword: field.showPassword,
        maxlength: maxLength,
        suffixIcon: suffixIcon,
        disabled: isDisabled,
        fieldAutoSize: fieldAutoSize,
        onChange: onChange,
        onBlur: onBlur,
        onFocus: onFocus,
        onButtonClick: clickButton,
        buttonEnable: buttonEnable,
        validType: field.VALID_TYPE,
        validatorField: validatorField,
        isNeedSecondInput: isNeedSecondInput,
        labelWidth: field.labelWidth || 200,
        confirmHandler:confirmHandler,
        inputType: getType,
      }"
    ></kui-textinput>
    <div v-if='field.MESSAGE_REMINDER' class="message-reminder el-icon-warning" v-html='field.MESSAGE_REMINDER'></div> 
  </div>
</template>

<script>
import {aliRecognizeVoice,stopAliSpeechTransfer} from "../../service/image-service";

export default {
  data() {
    return {
      checkInput: false,
      itemClass: "self-normalInput",
      isDisabled: false,
      rules: [],
      timeInterval: '',
      buttonEnable: false,
      buttonEnableTwo: false,
      voiceInpuButtonEnable: false,
      checkEnable: false,
      isNeedSecondInput: false,
      isValidTrue: false
    };
  },
  props: ["field", "index", "isBaseUI"],
  created() {
  },
  mounted() {
    if (!this.field.BUTTON_ENABLE) {
        this.itemClass += " self-normalInput-button-enable";
      } else {
        this.itemClass = this.itemClass.replace(
          /self-normalInput-button-enable/g,
          ""
        );
      }
  },
  beforeDestroy() {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
         this.changeBtnEnabled(false)
        this.field.FIELD_BUTTON_TXT = '发送验证码';
        this.field.codeStatus = '';
      }
        
  },
  destroyed() {
  },
  computed: {
    fieldButtonTxt(){
      return this.field.IS_SHOW_BUTTON? this.field.FIELD_BUTTON_TXT : ''
    },
    messageChange: function(){
      return this.field.message;
    },
    dataChange: function(){
      return this.field.DEFAULT_VALUE;
    },
    title: function () {
      this.field.FIELD_TITLE =
        (this.field.FIELD_TITLE &&
          this.field.FIELD_TITLE.replace("\\n", "\n")) ||
        "";
      return _.trim(this.field.FIELD_TITLE)? this.field.FIELD_TITLE : "";
    },
 
    isShowVoiceInputButton: function() {
      return this.field.IS_SHOW_VOICEINPUT_BUTTON;
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
      //如果全局设置为置灰，则按钮也置灰
      if (
        this.$parent.$parent.$parent.moduleItem &&
        this.$parent.$parent.$parent.moduleItem.MODULE_ASH == true
      ) {
         this.changeBtnEnabled(true)
        this.buttonEnableTwo = true;
        this.voiceInpuButtonEnable = true;
        this.checkEnable = true;
      } 

      if(fieldControl === 0 || fieldControl === 2){
        return true;
      } else {
        return false;
      }
    },
    getType: function() {
      let type = "text";
      let vTypes = this.field.VALID_TYPE.split("|");
      for(let i = 0; i < vTypes.length; i++) {
        switch (vTypes[i].split("[")[0]) {
          case "password":
            type = "password";
            break;
          case "num":
            type = "number";
            break;
          case "text":
            type = "textarea";
            break;
          default:
            // type = "text";
            break;
        }
      }
      
      return type;
    },
    isShowChange: function() {
      return this.field.showchange;
    },
    triggerType:function(){
        let triggerArr = [];
        if (this.field.VALID_TYPE.indexOf("focus") > -1) {
            triggerArr.push("focus");
        }
        if (this.field.VALID_TYPE.indexOf("blur") > -1) {
            triggerArr.push("blur");
        }
        if (this.field.VALID_TYPE.indexOf("change") > -1) {
            triggerArr.push("change");
        }
        triggerArr.length == 0 && (triggerArr = ['change','blur'])
        return  triggerArr
    },
    //是否显示icon
    suffixIcon: function(){
        return this.field.SUFFIX_ICON;
    },
    // 设置最大长度
    maxLength: {
      get: function () {
        return this.field.MAX_LENGTH;
      },
      set: function () {
      }
    },
    //是否显示勾选框
    isShowCheck: function () {
      return this.field.isShowCheck;
    },
    fieldAutoSize: function () {
        return this.field.FIELD_AUTOSIZE || false
    },
  },
  methods: {
    clickButton(){
      //如果校验没有通过，无需触发button事件
      this.$refs[this.field.FIELD_ID].validate();
      if(!this.isValidTrue){
        return;
      }
      if(this.isBaseUI) {
        this.$emit('click-button')
      } else {
        let data = {};  
        data["MODULE_ID"] = this.field.MODULE_ID;
        data["index"] = this.index;
        data["FIELD_ID"] = this.field.FIELD_ID;
        data["GROUP_ID"] = this.$parent.$parent.moduleItem.GROUP_ID;
        this.$store.commit(this.$types.UPDATE_COMPONENT_BUTTON_CLICK, data);
      }
    },
    clickVoiceInputButton() {
      let that = this,
          allSysComParam = this.$storage.getJsonSession(this.$definecfg.SYS_COMM_PARAM_OBJS),
          aliVoiceAdr = allSysComParam.APP_ALI_VOICE_RECORD_URL;
      console.log("recognizeVoice");
      aliRecognizeVoice(aliVoiceAdr).then((text)=>{
          that2.field.DEFAULT_VALUE += text;
          stopAliSpeechTransfer();      //停止语音输入
      }).catch((err)=>{
          console.error("系统出现问题，请联系管理员");
          this.$message({ type: 'error', message: '系统暂不支持语音输入' });
      })
    },
  
    validatorField: function (isValidTrue) {
      this.isValidTrue = isValidTrue;
      let value = this.field.DEFAULT_VALUE;
      if(isValidTrue){//校验通过，再进行二次校验
        this.lastValidate();
      }else{
        //自定义校验显示
        let fieldRef = this.$refs[this.field.FIELD_ID];
        if (this.field.changeMessage && this.field.DEFAULT_VALUE) {
            let changeMessage = this.field.changeMessage;
            changeMessage ? fieldRef.showTips(changeMessage) : null;
        }
        this.field.correct = false;
        this.field.showerr = true;
        //错误显示 同步到 message
        this.field.message = fieldRef.$refs.validatebox.validateMsg || "";
        if(_.trim(value) === "" && this.isRequired && this.isShow){
          this.field.FIELD_CONTROL = "0";
        }
      }
    },
    lastValidate() {
      //新增优化 过滤掉非必填和不可编辑的
      //如果该字段需要二次输入，且二次输入值不等于字段的值，则校验失败
      if (
        !this.isBaseUI &&
        !this.$parent.$parent.$parent.$parent.$parent.$parent
          .isRunFieldRules
      ) {
        if (
          this.field.VALID_TYPE.indexOf("prompt") > -1 &&
          this.field.promptValue != this.field.DEFAULT_VALUE &&
          this.field.FIELD_REQUIRED == "1" &&
          this.field.FIELD_CONTROL == "0"
        ) {
          this.showErrorMsg = this.field.message = "请再次输入";
          this.field.correct = false;
          this.field.showerr = true;
          this.$refs[this.field.FIELD_ID].showTips(this.showErrorMsg)
          return false
        }
      }
   
      this.field.correct = true;
      this.showErrorMsg = "";
      this.field.message = "";
      this.field.showerr = false;
      if(this.isBaseUI) {
        let that = this;
        //这里支持组件拿取关联异步函数的返回值
        that.$parent.fieldChangeWrap(that.field).then(function (err) {
          if(err){
            that.field.correct = false;
            that.field.showerr = true;
            this.$refs[this.field.FIELD_ID].showTips(err)
            return false
          }
          return true
        });
      } else {
        this.$store.commit(this.$types.UPDATE_FIELD_CHANGE, {
          field_id: this.field.FIELD_ID,
          module_id: this.field.MODULE_ID,
          index: this.index,
        });
      }
      return true
    },
    onFocus: function (e) {
      this.field.currentValid = "focus";
      // 获取焦点，判断是否应用失焦触发校验
      // if (this.field.VALID_TYPE.indexOf("on-blur") > -1) {
      //   // this.$refs[this.field.FIELD_ID]["rules"][0]["trigger"] = "blur";
      //   // this.$refs[this.field.FIELD_ID].onBlur(e);
      // }
      // if (this.field.VALID_TYPE.indexOf("on-focus") > -1) {
      //   // this.$refs[this.field.FIELD_ID]["rules"][0]["trigger"] = "focus";
      //   //看了elenet-ui form源码 发现不支持foucus 所以手动校验一下 @liwei 2019/1/7
      //   // this.$refs[this.field.FIELD_ID].$el.querySelector('input').blur();
      //   setTimeout(
      //     function () {
            
      //       // this.validatorField({}, "", new Function());
      //       this.$refs[this.field.FIELD_ID].validate();
      //     }.bind(this),
      //     300
      //   );
      // }
    },
    onBlur: function (value,e) {
      //  输入框是否需要二次输入校验
      this.field.DEFAULT_VALUE = value;
      console.log("触发失去焦点事件", this.field.FIELD_ID);
      console.log(
        "e.relatedTarget",
        e && e.relatedTarget && e.relatedTarget.className
      );
      this.field.currentValid = "blur";

      //如果为空值 判断是否要还原清空的值
      this.field.DEFAULT_VALUE =
        this.field.OLD_DEFAULT_VALUE && !this.field.DEFAULT_VALUE
          ? this.field.OLD_DEFAULT_VALUE
          : this.field.DEFAULT_VALUE;

      //只要不是弹窗的都响应，修复输入框输入，然后直接点击按钮不执行blur事件 linsc
      if (
        !(
          e.relatedTarget &&
          e.relatedTarget.className == "el-message-box__headerbtn"
        )
      ) {
        this.field.message = "";
        //如果设置了二次输入确认，需要再次输入 隐藏跟禁止编辑的除外
        
        if(this.field.FIELD_CONTROL == "0" && this.field.VALID_TYPE.indexOf("prompt") > -1) {
            this.isNeedSecondInput = true;
        }
      }
    },
    onChange: function(val){
      if (this.field.DEFAULT_VALUE == val && (!this.field.VALIDATE_AT_SAME_VALUE)) {
        this.$refs[this.field.FIELD_ID].validate("blur");
      }
      if (this.field.DEFAULT_VALUE != val) {
        this.field.promptValue = '';
      }
      this.field.DEFAULT_VALUE = val;

    },
    confirmHandler: function(val){
      this.field.promptValue = val;
    },
    changeBtnEnabled(flag) {
      this.buttonEnable = flag;
      this.getType == 'text' &&  this.$refs[this.field.FIELD_ID] && this.$refs[this.field.FIELD_ID].textinput(flag ? "btnEnabled":"btnDisabled");
    },
    changeBtnText(text) {
      var tempText =  (text || this.field.FIELD_BUTTON_TXT);
      this.getType == 'text' && this.$refs[this.field.FIELD_ID] && this.$refs[this.field.FIELD_ID].textinput('changeBtnText',tempText);
    },
    hideBtn() {
      this.getType == 'text' && this.$refs[this.field.FIELD_ID] && this.$refs[this.field.FIELD_ID].textinput('changeBtnText',"");
    }
  },
  watch: {
    isRunFieldRules: function(val){
      console.log(val)
    },
    'field.BUTTON_ENABLE': function(val) {
      this.changeBtnEnabled(val)
      if (!val) {
        this.itemClass += " self-normalInput-button-enable";
      } else {
        this.itemClass = this.itemClass.replace(
          /self-normalInput-button-enable/g,
          ""
        );
      }
    },
    'field.IS_SHOW_BUTTON': function(val) {
        val ? this.changeBtnText() : this.hideBtn()
    },
    'field.FIELD_BUTTON_TXT': function(text) {
       this.field.IS_SHOW_BUTTON && this.changeBtnText(text)
    },
    isRequired: function (val) {
      if (val) {
        this.itemClass += " self-normalInput-required";
        this.$refs[this.field.FIELD_ID] && this.$refs[this.field.FIELD_ID].validate();
      } else {
        this.itemClass = this.itemClass.replace(
          /self-normalInput-required/g,
          ""
        );
      }
    },
    isShowChange: function (val) {
      if (val) {
        this.itemClass += " self-normalInput-changed";
      } else {
        this.itemClass = this.itemClass.replace(
          /self-normalInput-changed/g,
          ""
        );
      }
    },
    dataChange: function (val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      fieldRef && fieldRef.setValue(val);
      fieldRef && (fieldRef.promptValue = this.field.promptValue)
    },
    suffixIcon: function (val) {},
    checkInput: function (val) {
      if (this.isShowCheck) {
        if (val == false) {
          // this.isDisabled = true;
          this.field.DEFAULT_VALUE = '无'
          this.field.FIELD_REQUIRED = '0'
          this.field.FIELD_CONTROL = '2';
          this.field.message = '';
        } else {
          this.field.DEFAULT_VALUE = this.field.DEFAULT_VALUE == '无' ? '' : this.field.DEFAULT_VALUE
          // this.isDisabled = false;
          this.field.FIELD_REQUIRED = '1'
          // 如果check是置灰的不对其对应控制的字段进行修改控制状态
          if (!this.checkEnable) {
            this.field.FIELD_CONTROL = '0';
          }
        }
      }
      
    },
    //监控验证码参数 如果改变且值为codeStart 则开启倒计时
    'field.codeStatus': function(val) {
        if(val == 'codeStart') {
            this.timeInterval && clearInterval(this.timeInterval);
            let remainTime = this.field.mobileValidTime || 60;
            this.timeInterval = setInterval(() =>{
                remainTime--
                if (remainTime >= 0) {
                    this.changeBtnEnabled(true)
                    this.changeBtnText(`${remainTime}秒`)
                    return;
                }
                 this.changeBtnEnabled(false)
                 this.changeBtnText("发送验证码")
                this.field.codeStatus = '';
                clearInterval(this.timeInterval);
            }, 1000)
        }
        if (val == 'codeEnd') {
            this.timeInterval && clearInterval(this.timeInterval)
             this.changeBtnEnabled(false)
            this.changeBtnText("发送验证码")
            this.field.codeStatus = '';
        }
    },
    'field.VALID_TYPE': function(val) {
      this.$refs[this.field.FIELD_ID].changeValid(val)
    },
    'field.FIELD_REQUIRED': function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      parseInt(val) ? fieldRef.changeRequired(true) : fieldRef.changeRequired(false);
    },
    "field.FIELD_CONTROL": function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      parseInt(val) == 2? fieldRef.setDisabled() : fieldRef.setEnabled();
    },
    "field.showerr": function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      //自定义校验显示
      if (this.field.changeMessage && this.field.DEFAULT_VALUE) {
          this.field.showErrorMsg = this.field.changeMessage;
      }
      this.field.correct = !val;
      val && this.field.showErrorMsg? fieldRef.showTips(this.field.showErrorMsg) : null;
      !val && fieldRef.hideTips();
    }
  }
};
</script>

<style lang="less">
.self-normalInput {
  
  &.self-normalInput-button-enable {
    .el-input-group__append {
      color: #fff;
      background: #217fff;
    }
  }
  .el-textarea {
    font-size: 22px;    
    .el-textarea__inner {
      line-height: 42px;
      border-radius: 0;
      font-family: Arial;
    }
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type="number"] {
    -moz-appearance: textfield;
}

</style>
