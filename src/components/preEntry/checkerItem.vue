通用勾选框

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
        optionsAll: optionsAll,
        isShowAllBtn: field.isShowAllBtn,
        data: dictNameChange,
        disabled: isDisabled,
        checkboxBtn:isCheckboxBtn,
        onSelect: onSelect,
        radioIsCanReverseSelect:radioIsCanReverseSelect,
        onUnSelect: onUnSelect,
        validatorField: validatorField,
        separator: separator,
        valueField: field.valueField || 'DICT_ITEM',
        textField: field.showDictItem == '1' ? 'DICT_ITEM,DICT_ITEM_NAME' : 'DICT_ITEM_NAME',
        labelWidth: field.labelWidth || 280,
        loadFilter: loadFilter,
        isVertical:  field.isVertical === false? false : true,
      }"
    ></kui-checkbox>
    <span class="checkboxText" v-if="isOneCheck">{{title}}</span>
  </div>
</template>

<script>

export default {
  data() {
    return {
      itemClass: "self-checker",
      checked: false,
      isDisabled: false,
      optionsAll:'',
      isMultipleBtnType:false,
      options:'',
      mutiDatas:[],  //当前多选选中的数据
      chooseAll:false,
      mutiDatasHistory:[], //多选框历史数据
      isOneCheck: false, //是否为单个checkbox
      // triggerType: "custom",//校验类型 custom是自定义的
      // rules: [],
      //showCheckValue: true //true:  “00-身份证”；  false： “身份证”
    }
  },
  props: ["field", "index", "isBaseUI"],
  created() {
  },
  mounted(){
    this.itemClass += " " + this.field.FIELD_ID;
    if(typeof(this.field.DEFAULT_VALUE) == "string")
      this.mutiDatasHistory = _.cloneDeep(this.field).DEFAULT_VALUE.split(','); //保存勾选前的历史数据 以便反选

    if(this.isRequired){
      this.itemClass += " self-checker-required";
    }
      
    this.initData()
  },
  computed: {
    checkerClass:function(){
      return this.field.BUSI_CODE+'-check-all-box check-box-'+this.index;
    },
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
        this.isDisabled = "";
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
      return this.field.FIELD_DICT_FILTER
    },
    dictNameChange: function() {
      return this.field.FIELD_DICT_NAME
    },
    dataChange: function() {
      return this.field.DEFAULT_VALUE;
    },
    isMultiple: function(){
      return  this.field.FIELD_RADIO_TYPE == undefined ? this.field.FIELD_TYPE != "radio" : this.field.FIELD_RADIO_TYPE ;
    },
    isCheckboxBtn: function(){
      return this.field.FIELED_CHECKBOX_BOTTON == true;
    },
    radioIsCanReverseSelect:function(){
      return this.field.FIELD_REVERSE_SELECT == true;
    },
    separator: function(){
      return this.field.separator || "|"
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
    handleChecked (value) {
      this.field.DEFAULT_VALUE = "" + value;
    },
    onUnSelect(data) {
      this.$nextTick(() => {
        let values = this.$refs[this.field.FIELD_ID].getValue();
        this.field.DEFAULT_VALUE = this.isMultiple ? values : this.radioIsCanReverseSelect ? "" : data.value;
        //单选的情况下，默认值设置为false
        if(this.isOneCheck){
          this.field.DEFAULT_VALUE = 'false'
        }
        if(this.isBaseUI) { // 多选框选中和都不选中都广播值变更事件
          this.$emit('field-change', this.field)
        } else {
          this.$store.commit(this.$types.UPDATE_FIELD_CHANGE, { field_id:this.field.FIELD_ID, module_id:this.field.MODULE_ID, index:this.index });
        }
      })
    },
    onSelect(data) {
      this.$nextTick(() => {
        let values = this.$refs[this.field.FIELD_ID].getValue();
        this.field.DEFAULT_VALUE = this.isMultiple ? values : data.value;;
        //单选的情况下，默认值设置为false
        if(this.isOneCheck){
          this.field.DEFAULT_VALUE = 'true'
        }
         if(this.isBaseUI) { // 多选框选中和都不选中都广播值变更事件
            this.$emit('field-change', this.field)
          } else {
            this.$store.commit(this.$types.UPDATE_FIELD_CHANGE, { field_id:this.field.FIELD_ID, module_id:this.field.MODULE_ID, index:this.index });
          }
      })
    },
    //设置单个checkbox的data，并且设置初始值
    setOneCheckboxVal(text,value){
      this.isOneCheck = true
      this.itemClass += " oneCheckbox"
        this.$nextTick(() => {
          this.$refs[this.field.FIELD_ID].loadData([{DICT_ITEM_NAME: text, DICT_ITEM: 'true'}]).then(() => {
            this.$refs[this.field.FIELD_ID].setValue( value + '', true, true)
            let checkerRef = this.$refs[this.field.FIELD_ID];
            this.field.FIELD_CONTROL == 2? checkerRef.setDisabled() : checkerRef.setEnabled();
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
        this.$refs[this.field.FIELD_ID].setValue(this.field.DEFAULT_VALUE,true, true);
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
        this.itemClass += " self-checker-required";
      } else {
        this.itemClass = this.itemClass.replace(/self-checker-required/g, "");
      }
    },
    dictFilterChange: function(val){
      this.$refs[this.field.FIELD_ID].loadData(this.dictNameChange);
    },
    dictNameChange: function(val) {
      this.$refs[this.field.FIELD_ID].loadData(val)
    },
    dataChange: function(val) {
      this.field.message = "";
      let dictNameChange = _.cloneDeep(this.dictNameChange);
      this.isOneCheck && (dictNameChange = [{DICT_ITEM_NAME: "", DICT_ITEM: 'true'}])
      this.$refs[this.field.FIELD_ID].loadData(this.dictNameChange).then( () => {
        this.$refs[this.field.FIELD_ID].setValue(val, false, false);;
        if (this.isOneCheck) {
          this.initData()
        }
      })
      
    },
    'field.FIELD_CONTROL': function(val) {
      let checkerRef = this.$refs[this.field.FIELD_ID];
      let dictNameChange = _.cloneDeep(this.dictNameChange);
      this.isOneCheck && (dictNameChange = [{DICT_ITEM_NAME: "", DICT_ITEM: 'true'}])
      checkerRef.loadData(dictNameChange).then( () => {
        val == 2? checkerRef.setDisabled() : checkerRef.setEnabled();
      }) 
    },
    'field.FIELD_REQUIRED': function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      parseInt(val) ? fieldRef.changeRequired(true) : fieldRef.changeRequired(false);
    }
  }
};
</script>

<style lang="less">
.self-checker {
  &.oneCheckbox{
    .kui-checkbox{
      padding: 0;
      display: inline-block;
      .checkbox-multiple-wrap .el-checkbox-group .el-checkbox {
        padding-right: 0px;
        margin-right: 0px;
        .el-checkbox__input .el-checkbox__inner{
          width: 30px;
          height: 30px;
          box-sizing: content-box;
        }
      } 
    }
    .checkboxText{
      font-family: Alibaba PuHuiTi;
      color: #252525;
      font-size: 24px;
      vertical-align: middle;
      margin-left: 17px;
    }
  }
}


</style>
