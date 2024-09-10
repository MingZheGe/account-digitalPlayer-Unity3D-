下拉选择框

<template>
  <div
    :id="field.FIELD_ID" 
    :class="itemClass + ' ' + field.FIELD_ID"
    v-show="isShow"
    >
    <kui-combobox
      :ref="field.FIELD_ID"
      :options="{
        title: title,
        clearable: isClear,
        multiple: false,
        isVertical: field.isVertical === false? false : true,
        filterable: isFilterable,
        allowCreate: allowCreate,
        disabled: isDisabled,
        remote: field.remote,
        reserveKeyword: field.reserveKeyword,
        placeholder: field.PLACE_HOLDER,
        remoteMethod: field.remoteMethod,
        collapseTags: field.collapseTags,
        required: isRequired,
        //dict: field.FIELD_DICT,
        valueField: 'DICT_ITEM',
        textField: field.showDictItem == '1' ? 'DICT_ITEM,DICT_ITEM_NAME' : 'DICT_ITEM_NAME',
        data: field.FIELD_DICT_NAME,
        width: field.width,
        validType: field.VALID_TYPE, //&& field.VALID_TYPE.split('|')[0],
        onChange: onChange,
        validatorField: validatorField,
        loadFilter: filterFn(),
        labelWidth: field.labelWidth || 200
      }"
    ></kui-combobox>
    <kui-checkbox
      v-if="isShowSelectCheck"
      ref="kui-select-check"
      :options="{
        multiple: true,
        data: [{text: '认证', value: checkSelect}]
      }"
    ></kui-checkbox>
    <kui-button
      class="use-id-button"
      v-if="isShowButton"
      :options="{
          buttonGroup: buttonGroup
        }"
    ></kui-button>
  </div>
</template>

<script>
import oppService from '../../service/opp-service'

export default {
  data() {
    return {
      itemClass: "self-selector",
      options: [],
      isDisabled: false,
      triggerType: "custom",
      rules: [],
      checkSelect: this.field.ischeckSelect,
      isShowSelectCheck: this.field.isShowSelectCheck || false
    }
  },
  props: ["field", "index", "groupId", "isBaseUI"],
  created() {
  },
  mounted() {
    this.$refs[this.field.FIELD_ID].setValue(this.field.DEFAULT_VALUE);
  },
  computed: {
    //是否允许用户创建条目
    allowCreate:function(){
        return this.field.FIELD_ALLOW_CREATE ? true : false;
    },
    title: function () {
      this.field.FIELD_TITLE = this.field.FIELD_TITLE.replace("\\n", "\n");
      return  _.trim(this.field.FIELD_TITLE) ? this.field.FIELD_TITLE : "";
    },
    isRequired: function () {
      return parseInt(this.field.FIELD_REQUIRED) ? true : false;
    },
    isShow: function() {
      let fieldControl = parseInt(this.field.FIELD_CONTROL);
      if(fieldControl == 2){
        this.isDisabled = true;
         this.$refs[this.field.FIELD_ID] && this.$refs[this.field.FIELD_ID].combobox("setDisabled")
      }else {
        this.$refs[this.field.FIELD_ID] && this.$refs[this.field.FIELD_ID].combobox("setEnabled")
        this.isDisabled = false;
      }
      if(this.isShowButton){
        this.isDisabled = true;
        this.$refs[this.field.FIELD_ID] && this.$refs[this.field.FIELD_ID].combobox("setDisabled")
      }
      if(fieldControl === 0 || fieldControl === 2){
        return true;
      } else {
        return false;
      }
    },
    dictFilterChange: function() {
      return this.field.FIELD_DICT_FILTER;
    },
    dictNameChange: function() {
      return this.field.FIELD_DICT_NAME;
    },
    dataChange: function(){
      return this.field.DEFAULT_VALUE;
    },
    messageChange: function(){
      return this.field.message;
    },
    isShowChange: function() {
      return this.field.showchange;
    },
    isShowButton: function() {
      return this.field.FIELD_FUNCTION&&this.field.FIELD_FUNCTION.indexOf("USE_ID_BUTTON") != -1;
    },
    isClear: function() {
      return this.field.FIELD_CLEARABLE !== false;
    },
    isFilterable: function () {
      if(this.field.FIELD_DICT_NAME&&this.field.FIELD_DICT_NAME.length > 20) {
        return true;
      }
    },
    buttonGroup: function() {
      let btnList = [];
      btnList.push({text: '选择银行', handler: this.useSelectButton});
      return btnList
    },
  },
  methods: {
    filterFn: function () {
      let filterVal = this.field.FIELD_DICT_FILTER;
      filterVal = _.isArray(filterVal) && filterVal.length > 0? filterVal.join(',') : (_.isString(filterVal)? filterVal.replace('\'','') : filterVal);
      return filterVal || "!";
    },
    validatorField: function (isValidTrue) {
      if(isValidTrue){
        if (!this.field.noChangeCorrect) {
          this.field.correct = true;
        } else {
          this.field.noChangeCorrect = false;
        }
        this.field.message = "";
        this.field.showerr = false;
      }else{
        this.field.correct = false;
        this.field.showerr = true;
        if(_.trim(this.field.DEFAULT_VALUE) === "" && this.isRequired && this.isShow){
          this.field.FIELD_CONTROL = "0";
        }
      }
      //selectorItem只要值发生改变，无论是否校验成功，都要触发fieldChange
      if(this.isBaseUI) { // 多选框选中和都不选中都广播值变更事件
        this.$emit('field-change', this.field)
      } else {
        this.$store.commit(this.$types.UPDATE_FIELD_CHANGE, { field_id:this.field.FIELD_ID, module_id:this.field.MODULE_ID, index:this.index });
      }
    },
       //使用证件地址 按钮
    useSelectButton: function() {
      if(this.isBaseUI) {
        this.$emit('use-id-button', this.field)
      } else {
        //更改state的值，触发全局的字段赋值事件
        let data = {};  
        data["FIELD_ID"] = this.field.FIELD_ID;
        data["GROUP_ID"] = this.groupId;
        data["MODULE_ID"] = this.field.MODULE_ID;
        data["index"] = "0";
        this.$store.commit(this.$types.UPDATE_COMPONENT_BUTTON_CLICK, data);
      }
    },
    clear: function() {
      this.field.DEFAULT_VALUE = ""
      console.log(this.field)
    },
    onChange: function(val){
        //自己选择的时候触发的onChange
        if (val != this.field.DEFAULT_VALUE) {
            //由于组件清空了原值 这里重新赋值 并且不触发onChange
            this.$refs[this.field.FIELD_ID].setValue(val, true);
            this.field.DEFAULT_VALUE = val;
            return
        }
        //setValue触发的onChange即直接赋值default_value
        //触发校验validatorField
        this.validatorField(true);
    }
  },
  watch: {
    isRequired: function(val) {
      if(val){
        this.itemClass += " self-selector-required";
      } else {
        this.itemClass = this.itemClass.replace(/self-selector-required/g, "");
      }
    },
    isShowChange: function(val) {
      this.isShowSelectCheck = this.field.isShowSelectCheck;
      if(val) {
        this.itemClass += " self-selector-changed";
      } else {
        this.itemClass = this.itemClass.replace(/self-selector-changed/g, "");
      }
    },
    dictFilterChange: function(val) {
      val = this.filterFn(val)
      this.$refs[this.field.FIELD_ID].combobox({loadFilter: val}).loadData(this.dictNameChange)
    },
    dataChange: function(val) {
      if(!this.allowCreate){
        //当不允许手动创建条目时，值改变的时候判断是否在字典内
        let dict = this.field.FIELD_DICT_NAME || [];
        let filterDict = this.field.FIELD_DICT_FILTER || "";
        let dictVal = _.find(dict, {DICT_ITEM: val}) || {};
        if (_.isEmpty(dictVal) || 
            !_.isEmpty(filterDict) && (filterDict.indexOf("!") > -1 && filterDict.indexOf(val) > -1 || 
            filterDict.indexOf("!") == -1 && filterDict.indexOf(val) == -1)) {
                this.field.DEFAULT_VALUE = "";
        }
        this.field.message = "";
      }

      this.$refs[this.field.FIELD_ID].setValue(val, false);
      
      //如果当前DEFAULT与组件值一样 则不触发setValue赋值
      // let getValue = this.$refs[this.field.FIELD_ID].getValue()
      // if (getValue != val) {
      //     this.$refs[this.field.FIELD_ID].setValue(val, false);
      // }
      //值的变化，不会自动进行校验，如果选择框有值并且非错误的情况下，隐藏存在的校验信息
      this.$nextTick(() => {
        if(val && !this.field.showerr && this.field.correct){
          this.$refs[this.field.FIELD_ID].hideTips()
        }
      })
    },
    checkSelect: function (val) {
      this.field.ischeckSelect = val;
    },
    dictNameChange: function(val){
      this.$refs[this.field.FIELD_ID] && this.$refs[this.field.FIELD_ID].loadData(val);
    },
    'field.VALID_TYPE': function(val) {
      this.$refs[this.field.FIELD_ID].combobox({validType: val})
    },
    "field.FIELD_CONTROL": function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      val == 2? fieldRef.combobox("setDisabled") : fieldRef.combobox("setEnabled");
    },
    'field.FIELD_REQUIRED': function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      parseInt(val) ? fieldRef.changeRequired(true) : fieldRef.changeRequired(false);
    },
    "field.showerr": function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      //自定义校验显示
      if (this.field.changeMessage && this.field.DEFAULT_VALUE) {
          this.field.showErrorMsg = this.field.changeMessage;
      }
      this.field.correct = !val;
      if (val && !this.field.correct) {
          this.field.correct = false;
          this.field.noChangeCorrect = true;
      }
      val && this.field.showErrorMsg? fieldRef.showTips(this.field.showErrorMsg) : null;
    }
  }
};
</script>

<style lang="less">
</style>
