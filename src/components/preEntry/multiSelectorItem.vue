多选下拉选择框

<template>
  <div
    :id="field.FIELD_ID" 
    :class="itemClass" 
    class="el-form-item"
  >
    <kui-combobox
      :ref="field.FIELD_ID"
      class="el-form-item_content"
      :options="{
        title: title,
        clearable: isClear,
        multiple: true,
        filterable: true,
        allowCreate: allowCreate,
        disabled: isDisabled,
        placeholder: field.PLACE_HOLDER,
        required: isRequired,
        dict: field.FIELD_DICT,
        valueField: 'DICT_ITEM',
        textField: 'DICT_ITEM,DICT_ITEM_NAME',
        data: field.FIELD_DICT_NAME,
        width: field.width,
        loadFilter: field.FIELD_DICT_FILTER,
        validType: field.VALID_TYPE, //&& field.VALID_TYPE.split('|')[0],
        onChange: onChange,
        labelWidth: field.labelWidth ||  200,
        isVertical:  field.isVertical === false? false : true,
        width: field.width
      }"
    ></kui-combobox>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemClass: "self-multiselector",
      options: [],
      optionsAll: [],
      isDisabled: false,
      triggerType: "custom",
      rules: [],
    }
  },
  props: ["field", "index", "isBaseUI"],
  created() {
  },
  mounted() {
    this.$refs[this.field.FIELD_ID].setValue(this.field.DEFAULT_VALUE);
    this.itemClass += " " + this.field.FIELD_ID;

    if(this.isRequired)
      this.itemClass += " self-multiselector-required";

    if(this.isShowChange)
      this.itemClass += " self-multiselector-changed";
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
      }else {
        this.isDisabled = false;
      }

      if(fieldControl === 0 || fieldControl === 2){
        return true;
      } else {
        return false;
      }
    },
    dictFilterChange: function() {
      return this.field.FIELD_DICT_FILTER 
    },
    dictNameChange: function() {
      return this.field.FIELD_DICT_FILTER || this.field.FIELD_DICT_NAME;
    },
    messageChange: function(){
      return this.field.message;
    },
    dataChange: function(){
      return this.field.DEFAULT_VALUE;
    },
    isShowChange: function() {
      return this.field.showchange;
    }
  },
  methods: {
    validatorField: function (isValidTrue) {
      if(isValidTrue){
        this.field.correct = true;
        this.field.message = "";
        this.field.showerr = false;
        if(this.isBaseUI) {
          this.$emit('field-change', this.field)
        } else {
          this.$store.commit(this.$types.UPDATE_FIELD_CHANGE, { field_id:this.field.FIELD_ID, module_id:this.field.MODULE_ID, index:this.index });
        }
      }else{
        this.field.correct = false;
        this.field.showerr = true;
        if(_.trim(value) === "" && this.isRequired && this.isShow){
          this.field.FIELD_CONTROL = "0";
        }
      }
    },
    onChange: function(val){
      this.field.DEFAULT_VALUE = val;
    }
  },
  watch: {
    isRequired: function(val) {
      if(val){
        this.itemClass += " self-multiselector-required";
      } else {
        this.itemClass = this.itemClass.replace(/self-multiselector-required/g, "");
      }
    },
    isShowChange: function(val) {
      if(val) {
        this.itemClass += " self-multiselector-changed";
      } else {
        this.itemClass = this.itemClass.replace(/self-multiselector-changed/g, "");
      }
    },
    dictFilterChange: function(val) {
      this.$refs[this.field.FIELD_ID].loadData(this.dictNameChange);
    },
    dictNameChange: function(val){
      this.$refs[this.field.FIELD_ID].loadData(val);
    },
    messageChange: function(val) {
      // if(val){
        this.$refs[this.field.FIELD_ID].validate(); // 自定义触发校验事件
      // }
    },
    dataChange: function(val) {
      this.field.message = "";
      this.$refs[this.field.FIELD_ID].validate(); // 自定义触发校验事件
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
</style>
