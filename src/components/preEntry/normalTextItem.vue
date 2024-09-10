通用文本展示

<template>
    <div
      :class="itemClass"
      :id="field.FIELD_ID" 
       v-show="isShow"
       class="el-form-item"
    >
      <span>{{showVal}}</span>
      <kui-button
        :ref="field.FIELD_ID" 
        v-if="isShowButton"
        class="use-check-button"
        :options="{
          title: title,
        }"
      ></kui-button>
    </div>
  
</template>

<script>
export default {
  data() {
    return {
      showVal : "",
      itemClass: "self-text",
    }
  },
  props: ["field", "index", "isBaseUI"],
  created() {
    //默认值改变，如果是字典则要转为对应中文
    this.initData(this.field.DEFAULT_VALUE);
  },
  mounted() {
    this.itemClass += " " + this.field.FIELD_ID;
  },
  computed: {
    isShowButton: function() {
      return this.field.IS_SHOW_BUTTON;
    },
    //ljc
    fieldButtonTxt:{
      get:function(){
        return this.field.FIELD_BUTTON_TXT;
      },
      set: function(){

      }
    },
    title: function () {
      this.field.FIELD_TITLE = this.field.FIELD_TITLE.replace("\\n", "\n");
      return _.trim(this.field.FIELD_TITLE) ? this.field.FIELD_TITLE
          + (_.intersection(this.field.FIELD_TITLE.split(""), ["：", ":"]).length ? "" : "：") : ""
    },
    isShow: function() {
      let fieldControl = parseInt(this.field.FIELD_CONTROL);
      if(fieldControl === 0 || fieldControl === 2){
        return true;
      } else {
        return false;
      }
    },
    dataChange: function(){
      return this.field.DEFAULT_VALUE;
    },
    buttonGroup: function() {
        let btnList = [];
        btnList.push({
            text: this.fieldButtonTxt || '校验', 
            handler: this.clickButton,
            disabled: this.isDisabled
            });
        return btnList
    },
  },
  methods: {
    clickButton(){
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
    validatorField: function (rule, value, callback) {},
    initData: function(vals){
      let newVal = ""
      //默认值改变，如果是字典则要转为对应中文
      if(vals != "" && _.isString(vals) && this.field.FIELD_DICT_NAME && this.field.FIELD_DICT_NAME.length){
        let valueArr = vals.split(",")
        let spliceWord = valueArr.length > 1 ? ";" : ""
        valueArr.forEach(value => {
          let item = _.find(this.field.FIELD_DICT_NAME, {DICT_ITEM : value});
          newVal = newVal + (item && item.DICT_ITEM_NAME || value) + spliceWord;
        });
        console.log("newVal===",newVal)
      }else{
        newVal = vals;
      }
      this.showVal = newVal
    }
  },
  dataChange: function(val) {
    //默认值改变，如果是字典则要转为对应中文
    this.initData(val);
  },
  watch:{
    fieldButtonTxt:function(val){
      this.fieldButtonTxt = val;
    },
    'field.BUTTON_ENABLE': {
      handler(newVal, oldVal) {
       this.buttonEnable = newVal;
      },
      immediate: true
    },
    'field.DEFAULT_VALUE': {
      handler(newVal, oldVal) {
       this.showVal = newVal;
      },
      immediate: true
    },
  }
};
</script>

<style lang="less">
</style>
