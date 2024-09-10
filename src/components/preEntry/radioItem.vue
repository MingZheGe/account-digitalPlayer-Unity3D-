<!--单选框组件 by linsc 
1.使用方法，字段的FIELD_TYPE设置为radio
2.给字段的FIELD_DICT_NEMA字典赋值即可
-->
<template>
  <div
    :id="field.FIELD_ID" 
    :class="itemClass + ' ' + field.FIELD_ID" 
    v-show="isShow"
  >
    <kui-checkbox
      :ref="field.FIELD_ID"
      :options="{
        title: !isOneCheck? title : '',
        required: isRequired,
        validType: field.VALID_TYPE,
        dict: field.FIELD_DICT,
        width: field.width,
        multiple: isMultiple,
        isMuti: isMuti,
        data: dictNameChange,
        disabled: isDisabled,
        onSelect: onSelect,
        onUnSelect: onUnSelect,
        valueField: field.valueField,
        textField: field.showDictItem == '1' ? 'DICT_ITEM,DICT_ITEM_NAME' : 'DICT_ITEM_NAME',
        validatorField,validatorField,
        labelWidth: field.labelWidth || 340,
        isVertical: field.isVertical === false? false : true,
        loadFilter: loadFilter
      }"
    ></kui-checkbox>
    <span class="checkboxText" v-if="isOneCheck">{{title}}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemClass: "self-radio",
      isDisabled: false,
      isMuti:false,  //是否是多选
      optionsAll:'',
      options:'',
      chooseAll:false,
      triggerType: "custom",//校验类型 custom是自定义的
      rules: [],
      isOneCheck: false //是否为单个checkbox
    }
  },
  props: ["field", "index", "isBaseUI"],
  created() {
  },
  mounted(){
    this.$refs[this.field.FIELD_ID].setValue(this.field.DEFAULT_VALUE);
    this.itemClass += " " + this.field.FIELD_ID;
    if(this.isRequired){
      this.itemClass += " self-radio-required";
    }
    this.initData();
  },
  computed: {
    title: function () {
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
    messageChange: function(){
      return this.field.message;
    },
    dictFilterChange: function() {
      return this.field.FIELD_DICT_FILTER;
    },
    dictNameChange: function() {
      return this.field.FIELD_DICT_NAME;
    },
    dataChange: function() {
      return this.field.DEFAULT_VALUE;
    },
    isMultiple: function(){
      return this.field.FIELD_TYPE != "radio"
    }
  },
  methods: {
    validatorField: function (isValidTrue) {
      let value = this.field.DEFAULT_VALUE;
      
      if(isValidTrue){
        this.field.correct = true;
        this.field.message = "";
        this.field.showerr = false;
      }else{
        this.field.correct = false;
        this.field.showerr = true;
        if(_.trim(value) === "" && this.isRequired && this.isShow){
          this.field.FIELD_CONTROL = "0";
        }
      }
    },
    clickitem(e){
      //单选组件 默认必须选一个，重复点击无效
      //但是允许特殊情况，设置了允许取消且非禁止编辑状态可以取消勾选
      if(!e.isDisable && this.field.allowCancel){
        this.field.DEFAULT_VALUE = e === this.field.DEFAULT_VALUE?  '' : e
        console.log("e==="+e+"DEFAULT_VALUE"+this.field.DEFAULT_VALUE)
      }
    },
    onSelect(value){
      this.field.DEFAULT_VALUE = value.value;
      if(this.isBaseUI) { 
        this.$emit('field-change', this.field)
      } else {
        this.$store.commit(this.$types.UPDATE_FIELD_CHANGE, { field_id:this.field.FIELD_ID, module_id:this.field.MODULE_ID, index:this.index });
      }
    },
    onUnSelect(value){
      this.field.DEFAULT_VALUE = value.value;
      if(this.isBaseUI) { 
        this.$emit('field-change', this.field)
      } else {
        this.$store.commit(this.$types.UPDATE_FIELD_CHANGE, { field_id:this.field.FIELD_ID, module_id:this.field.MODULE_ID, index:this.index });
      }
    },
    setOneCheckboxVal(text,value){
      this.isOneCheck = true;
      this.itemClass += " oneCheckbox"
        this.$nextTick(() => {
          this.$refs[this.field.FIELD_ID].loadData([{text: text, value: 'true'}]).then(() => {
            this.$refs[this.field.FIELD_ID].setValue( value + '',true)
          })
        })
    },
    initData () {
      if(this.field.DEFAULT_VALUE === ("true" || true)){
        this.setOneCheckboxVal('',this.field.DEFAULT_VALUE);
      } else if(this.field.DEFAULT_VALUE === ("false" || false)) {
        this.setOneCheckboxVal('',this.field.DEFAULT_VALUE);
      }else if(this.field.FIELD_DICT_NAME && this.field.FIELD_DICT_NAME.length == 0 && this.field.DEFAULT_VALUE == ""){
        //如果默认值为空字符，而且没有设置字典项则视为单选
        this.setOneCheckboxVal('', 'false');
      } else if(!this.field.FIELD_DICT_NAME && this.field.DEFAULT_VALUE == ""){
        this.setOneCheckboxVal('','false');
      }else  { //多选
        this.$refs[this.field.FIELD_ID].setValue(this.field.DEFAULT_VALUE);
      }
    },
    loadFilter: function(data) {
      let filterVal = this.field.FIELD_DICT_FILTER;
      if (_.isArray(filterVal) && filterVal.length != 0) {
          filterVal = filterVal.join(",")
      }
      if (_.isString(filterVal) && filterVal) {
          let isMove = false;
          if (filterVal.charAt(0) == "!") {
              isMove = true;
          }
          return _.filter(data, item => {
              return isMove ? (filterVal.indexOf(item.DICT_ITEM) == -1) : (filterVal.indexOf(item.DICT_ITEM) != -1)
          })
      }
      return data;
    }
  },
  watch: {
    isRequired: function(val) {
      if(val){
        this.itemClass += " self-radio-required";
      } else {
        this.itemClass = this.itemClass.replace(/self-radio-required/g, "");
      }
    },
    messageChange: function(val) {
      // if(val){
        this.$refs[this.field.FIELD_ID].validate('custom'); // 自定义触发校验事件
      // }
    },
    dataChange: function(val) {
      this.initData();
    },
    dictNameChange: function(val) {
      this.$refs[this.field.FIELD_ID].loadData(val);
    },
    dictFilterChange: function (val) {
      this.$refs[this.field.FIELD_ID].loadData(this.dictNameChange);
    },
    'field.FIELD_CONTROL': function(val) {
      let radioRef = this.$refs[this.field.FIELD_ID];
      val == 2? radioRef.setDisabled() : radioRef.setEnabled();
    },
    'field.FIELD_REQUIRED': function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      parseInt(val) ? fieldRef.changeRequired(true) : fieldRef.changeRequired(false);
    }
  }
};
</script>

<style lang="less">
.self-radio {
  &.oneCheckbox{
    .kui-checkbox{
      display: inline-block;
      .checkbox-multiple-wrap /deep/ .el-checkbox-group .el-checkbox{
        padding-right: 0;
      }
    }
    .checkboxText{
      font-size: 17px;
      color: #222;
    }
  }
}

</style>
