资料录入分组

<template>
  <div class="self-module" v-show="isShow">
    <kui-fieldset ref="moduleFieldSet" :options="{
      title: title,
      theme: 'concise',
      toolbar: toolbar,
      isShowButton: true,
      isDisabled: isDisabled,
      isShowToolbarActive: false
      }">
      <div :is="field.component" :ref="field.FIELD_ID" :field.sync="fields[fieldIndex]" 
                                :key="field.FIELD_SEQ" v-for="(field, fieldIndex) in fields" 
                                :index="index" :groupId="module.GROUP_ID" 
                                :busiLogic='busiLogic' 
                                :name="module.MODULE_ID+'-'+module.MODULE_SEQ+'-'+field.FIELD_ID" 
                                class="self-item"></div>
    </kui-fieldset>
     <flowTip :ref="moduleFlowTipName"></flowTip>
  </div>
</template>

<script>
import addressInputItem from '../../components/preEntry/addressInputItem'
import checkerItem from '../../components/preEntry/checkerItem'
import radioItem from '../../components/preEntry/radioItem'
import datePickItem from '../../components/preEntry/datePickItem'
import normalInputItem from '../../components/preEntry/normalInputItem'
import selectorItem from '../../components/preEntry/selectorItem'
import multiSelectorItem from '../../components/preEntry/multiSelectorItem'
import telephoneInputItem from '../../components/preEntry/telephoneInputItem'
import normalTextItem from '../../components/preEntry/normalTextItem'
import normalButtonItem from '../../components/preEntry/normalButtonItem'
import messageBox from '../common/messageBox'
import flowTip from '../../components/common/flowTip';
import kInputNew from '../baseUI/kInputNew'

const comps = {
  "addressInput": addressInputItem,
  "checker": checkerItem,
  "radio": radioItem,
  "date": datePickItem,
  "normalinput": normalInputItem,
  "selector": selectorItem,
  "multiSelector": multiSelectorItem,
  "telephone": telephoneInputItem,
  "normalText": normalTextItem,
  "normalButton": normalButtonItem,
  "messageBox": messageBox,
  "flowTip": flowTip,
  "kInputNew": kInputNew,
}

export default {
  data() {
    return {
      moduleInit: {},
      fields: [],
      module: this.moduleItem,
      isZDCustomize: false,
      isCustomize: false
    }
  },
  mounted() {
    this.moduleInit = _.cloneDeep(this.parentPage.groupDatasTpl[this.module.GROUP_ID][this.module.MODULE_ID][0]);
    this.parseModule(this.module.FIELDS);
  },
  activated() {
    this.module = this.moduleItem;
    this.parseModule(this.module.FIELDS);
  },
  props: ["moduleItem", "index",'busiLogic'],
  components: comps,
  computed: {
    isShow: function() {
      return parseInt(this.module.MODULE_CONTROL) ? true : false;
    },
    isAdd: function() {
      return parseInt(this.module.MODULE_ADD) ? true : false;
    },
    isDelete: function() {
      return parseInt(this.module.MODULE_DELETE) ? true : false;
    },
    isClear: function() {
      return parseInt(this.module.MODULE_CLEAN) ? true : false;
    },
    /**
     * 置灰按钮
     */
    isDisabled: function() {
      return parseInt(this.module.MODULE_DISABLED) ? true : false;
    },
    isRead: function() {
    //   //安卓的不显示拍照填写，iOS的才显示
    //   if(this.$basecfg.platform === "android"){
    //     return false;     
    //   }
      return parseInt(this.module.MODULE_READ) ? true : false;
    },
    // isCustomize: function() {
    //     return parseInt(this.module.MODULE_CUSTOMIZE) ? true : false;
    // },
    maxLength: function() { // 最大可添加组数 默认为3组
      return this.module.MAX_LENGTH || 3;
    },
    moduleOrder: function() {
      if(this.parentPage.moduleDatas[this.module.MODULE_ID].length > 1
         && this.parentPage.moduleDatas[this.module.MODULE_ID][0]["MODULE_TITLE"] == this.parentPage.moduleDatas[this.module.MODULE_ID][1]["MODULE_TITLE"]) { // 一柜通有同一个数据结构但不同模块，需要单独处理分开下
        return "(" + (this.index+1) + ")";
      } 
      else {
        return "";
      }
    },
    parentPage: function() {
      return this.$parent.$parent.$parent.$parent;
    },
    moduleFlowTipName(){
      return this.moduleItem.MODULE_ID + '_FLOW_TIP';
    },
    toolbar() {
      var that = this;
      let btnList = [{
        show: this.isDelete,
        icon: 'el-icon-delete',
        text: '删除',
        handler(){
          return that.deleteModule(that.module)
        }
      },{
        show: this.isAdd,
        icon: 'el-icon-plus',
        text: '添加',
        handler(){
          return that.addModule()
        }
      },{
        show: this.isRead,
        text: this.module.MODULE_CONTROL_TXT || '读卡',
        handler(){
          return that.readModule()
        }
      },{
        show: this.isClear,
        text: '清空',
        handler(){
          return that.clearModule()
        }
      },{
        show: this.isZDCustomize,
        text: this.module.MODULE_ZDCUSTOMIZE_TXT || '中登身份校验',
        handler(){
          return that.ZDCustomizeModule()
        }
      },{
        show: this.isCustomize,
        text: this.module.MODULE_CUSTOMIZE_TXT || "公安联网校验",
        handler(){
          return that.customizeModule()
        }
      }];
      return btnList
    },
    title(){
      return this.module.MODULE_TITLE + this.moduleOrder || ''
    }
  },
  watch: {
    title(val){
      this.$refs.moduleFieldSet && this.$refs.moduleFieldSet.fieldset({title: this.title})
    },
    toolbar(newVal){
        this.$refs.moduleFieldSet && this.$refs.moduleFieldSet.fieldset({toolbar: newVal, title: this.title})
    },
    'module.MODULE_CUSTOMIZE': {
        handler(newVal, oldVal) {
            this.isCustomize = parseInt(this.module.MODULE_CUSTOMIZE) ? true : false;
        },
        deep: true,
        immediate: true
    },
    'module.MODULE_ZDCUSTOMIZE': {
        handler(newVal, oldVal) {
            this.isZDCustomize = parseInt(this.module.MODULE_ZDCUSTOMIZE) ? true : false;
        },
        deep: true,
        immediate: true
    },
    moduleItem(v){
      this.module = v;
      this.parseModule(this.module.FIELDS);
    }
  },
  methods: {
    /**
     * @method getTypeLength
     * @desc 把流程提示组件的方法直接挂载到bizEntry实例上
     * @param  {String} type 提示类型 success/warning/info/error
     * @return {Number} 如果有就是对应项目的index 否则返回0
     */
    getTypeLength(type){
      return this.$refs[moduleFlowTipName].getTypeLength(type);
    },
    /**
     * @method pushFlowTip
     * @desc 添加提示信息
     * @param  {Object} tip 提示内容对象
     */
    pushFlowTip(tip){
      this.$refs[moduleFlowTipName].pushFlowTip(tip);
    },
    /**
     * @method removeFlowTip
     * @desc 删除提示信息
     * @param  {Object} tip 提示内容对象
     */
    removeFlowTip(key){
      this.$refs[moduleFlowTipName].removeFlowTip(key);
    },
    readModule(){
      //更改state的值，触发全局的字段赋值事件
      let data = {};  
      data["MODULE_ID"] = this.moduleItem.MODULE_ID;
      data["GROUP_ID"] = this.moduleItem.GROUP_ID;
      data["MODULE_SEQ"] = this.moduleItem.MODULE_SEQ;
      this.$store.commit(this.$types.UPDATE_MODULE_BUTTON_CLICK, data);
    },
    customizeModule() {
      //更改state的值，触发全局的字段赋值事件
      let data = {};  
      data["MODULE_ID"] = this.moduleItem.MODULE_ID;
      data["GROUP_ID"] = this.moduleItem.GROUP_ID;
      data["MODULE_SEQ"] = this.moduleItem.MODULE_SEQ;
      this.$store.commit(this.$types.UPDATE_MODULE_CUSTOMIZE_BUTTON_CLICK, data);
    },
    ZDCustomizeModule() {
      //更改state的值，触发全局的字段赋值事件
      let data = {};  
      data["MODULE_ID"] = this.moduleItem.MODULE_ID;
      data["GROUP_ID"] = this.moduleItem.GROUP_ID;
      data["MODULE_SEQ"] = this.moduleItem.MODULE_SEQ;
      this.$store.commit(this.$types.UPDATE_MODULE_ZDCUSTOMIZE_BUTTON_CLICK, data);
    },

    clearModule(){
       //更改state的值，触发全局的字段赋值事件
      if(this.parentPage.moduleDatas[this.module.MODULE_ID].length > this.index){
        for (let fk in this.parentPage.moduleDatas[this.module.MODULE_ID][this.index].FIELDS) {
          this.parentPage.moduleDatas[this.module.MODULE_ID][this.index].FIELDS[fk]["DEFAULT_VALUE"] = "";
        }
      }
    },
    addModule: function() {
      let that = this;
      Promise.resolve().then(() => {
        let data = {};  
        data["MODULE_ID"] = that.moduleItem.MODULE_ID;
        data["GROUP_ID"] = that.moduleItem.GROUP_ID;
        data["INDEX"] = that.parentPage.moduleDatas[that.module.MODULE_ID].length - 1;
        return that.parentPage.addModuleClick(data); // 
      }).then((isAllow) => {
        //如果通过了自定义的检查，还需要过通用检查才能添加分组
        if(isAllow){
          // 要先判断这添加前的组该填的都已经填写
          let flag = true;
          let totalVisibleField = 0;//显示的可见的字段数量
          let emptyField = 0;//空值的字段总数
          for(let fsName in that.module.FIELDS) {
            let fs = that.module.FIELDS[fsName];
            if(fs.FIELD_CONTROL == "0" || fs.FIELD_CONTROL == "2") {
              totalVisibleField++;
              if(fs.DEFAULT_VALUE == "" || fs.DEFAULT_VALUE == undefined) {
                if(fs.FIELD_REQUIRED == "1") {
                  flag = false;
                  break;
                } else {
                  emptyField++;
                }
              }
            }
          }
          if(emptyField == totalVisibleField){
            //如果非必填且为空值的字段数量跟显示的可见的字段数量一致,
            //说明当前模块字段均为非必填且全部空值,此时至少要填写一个值才能添加下一个分组
            flag = false;
       	    that.messageBox({
              hasMask:true,
              messageText:'请填写至少一个或以上字段',
              confirmButtonText:'确定',
              typeMessage:'warn', 
              showMsgBox:true  
            })
            return;
          }   
          // 添加分组
          if(flag) {
            that.module["MODULE_ADD"] = "0"; // 把当前的添加按钮关闭，只留最后一个
            that.module["MODULE_DELETE"] = "1"; // 把当前的删除按钮开启
            for (let fk in that.moduleInit.FIELDS) {
              //先更新过滤项在增加模块
              that.moduleInit.FIELDS[fk].FIELD_DICT_FILTER = that.parentPage.moduleDatas[that.module.MODULE_ID][0].FIELDS[fk].FIELD_DICT_FILTER
            }
            let module2 = _.cloneDeep(that.moduleInit);
            _.each(module2 && module2.FIELDS, field => {
              field.DEFAULT_VALUE = "";
            });
            module2["MODULE_DELETE"] = "1";
            if(that.maxLength && (that.parentPage.moduleDatas[that.module.MODULE_ID].length + 1) > that.maxLength)
              module2["MODULE_ADD"] = "0";
            else
              module2["MODULE_ADD"] = "1";
            //强制显示新增的分组
            module2["MODULE_CONTROL"] = "1";
            module2["MODULE_SEQ"] = parseInt(that.module["MODULE_SEQ"]) + 1 + "";
            module2["MODULE_NUM"] = ""//parseInt(that.module["MODULE_NUM"]) + 1 + ""; //去掉MODULE_NUM 添加序号赋值，为空默认新增模块
            //隐藏与XX一致单选框
            if(module2.FIELDS.MODULE_RADIO_BUTTON != undefined){
              module2.FIELDS.MODULE_RADIO_BUTTON.FIELD_CONTROL = "1";
            }
            //如果当前有自定义按钮则添加的时候继承自定义按钮的展示以及文字
            if (that.moduleInit["MODULE_CUSTOMIZE"]) {
                module2.MODULE_CUSTOMIZE = '1';
                module2.MODULE_CUSTOMIZE_TXT = that.module.MODULE_CUSTOMIZE_TXT;
            }
            if (that.moduleInit["MODULE_ZDCUSTOMIZE"]) {
                module2.MODULE_ZDCUSTOMIZE = '1';
                module2.MODULE_ZDCUSTOMIZE_TXT = that.module.MODULE_ZDCUSTOMIZE_TXT;
            }


            //moduleinit是取自服务器最原始的分组字段结构，有些字段默认是隐藏的，新增模块也不应该显示出来，如有特殊需求可在各自业务的addModuleFinished钩子函数实现 by林思聪
            // Object.getOwnPropertyNames(module2.FIELDS).map(item =>{
            //   // if(item !== "MODULE_RADIO_BUTTON" && item !== "LINKMAN_NO" && item !== "CONTROLER_NUM" &&
            //   //  item !== "BENEFICIARY_NO" && item !== "STOCKHOLDER_NO" && item !== "LINKMAN_INFO_NO" && 
            //   //  item !== "CONTROLLER_NO" && item !== "BENEFICIARY_OWNER"){
            //     // module2.FIELDS[item].DEFAULT_VALUE ="";
            //     // module2.FIELDS[item].FIELD_CONTROL="0";
            //   // }
            // });
            //添加的新结构
            that.parentPage.moduleDatas[that.module.MODULE_ID].push(module2);
            that.parentPage.addModuleFinished(module2); //添加完成的回调钩子，可以在业务V00XX.js中回调响应，根据业务需求自己处理
            that.$nextTick(() => {
               var container = document.getElementsByClassName("bizEntry-main")[0];
              container.scrollTop = container.scrollHeight;
            });
          } else {
            that.messageBox({
              hasMask:true,
              messageText:'请先填写完必填字段',
              confirmButtonText:'确定',
              typeMessage:'warn', 
              showMsgBox:true  
            })
          } 
        }
        //  else {
        //   that.messageBox({
        //     hasMask:true,
        //     messageText:'请先填写完必填字段',
        //     confirmButtonText:'确定',
        //     typeMessage:'warn', 
        //     showMsgBox:true  
        //   })
        //   return;
        // }    
      })
      .catch(err => {
        console.error("-------------增加模块出错了--------------", err);
      });
    },
    deleteModule: function (module) {
      var that = this;
      this.messageBox({
        hasMask: true,
        messageText: module.MODULE_TITLE.length ? `是否确定删除此条${module.MODULE_TITLE}?` : `您确定要删除此条记录吗?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        typeMessage: 'warn',
        confirmedAction: function () {
          Promise.resolve().then(() => {
            let data = {};
            data["MODULE_ID"] = that.moduleItem.MODULE_ID;
            data["GROUP_ID"] = that.moduleItem.GROUP_ID;
            data["INDEX"] = that.index;
            return that.parentPage.deleteModuleClick(data); // 
          }).then((isAllow) => {
            if (isAllow) {
              let deleteObj = that.parentPage.moduleDatas[that.module.MODULE_ID][0];
              let isClear = false;;
              if (that.parentPage.moduleDatas[that.module.MODULE_ID] && that.parentPage.moduleDatas[that.module.MODULE_ID].length == 1) {
                //如果只有一个模块了，删除了就没了，页面无法继续添加,默认是不能再删除了，点击删除实际上等同于清除模块的字段数据
                that.clearModule();
                isClear = true;
              } else {
                deleteObj = that.parentPage.moduleDatas[that.module.MODULE_ID].splice(that.index, 1);
              }
              if (that.parentPage.moduleDatas[that.module.MODULE_ID].length == 1) {
                //如果只有一个模块了，则不显示删除按钮
                that.parentPage.moduleDatas[that.module.MODULE_ID][0].MODULE_DELETE = "0"
              }
              that.parentPage.moduleDatas[that.module.MODULE_ID][that.parentPage.moduleDatas[that.module.MODULE_ID].length - 1].MODULE_ADD = "1";
              that.parentPage.deleteModuleFinished(deleteObj, isClear); //删除完成的回调钩子，可以在业务V00XX.js中回调响应，根据业务需求自己处理
              that.$store.commit(that.$types.UPDATE_FIELD_CHANGE, { module_id: that.module.MODULE_ID, field_id: null, index: null });
              // that.parentPage.moduleDatas[that.module.MODULE_ID].splice(that.index, 1);
              // that.parentPage.deleteModuleFinished(); //添加完成的回调钩子，可以在业务V00XX.js中回调响应，根据业务需求自己处理
              // that.parentPage.moduleDatas[that.module.MODULE_ID][that.parentPage.moduleDatas[that.module.MODULE_ID].length - 1].MODULE_ADD = "1";
              // that.$store.commit(that.$types.UPDATE_FIELD_CHANGE, { module_id: that.module.MODULE_ID, field_id: null, index: null });
            }

              })
                
            },
        showMsgBox:true  
      })
    },
    parseModule: function(data) {
      if(this.isAdd 
          && this.index == (this.parentPage.moduleDatas[this.module.MODULE_ID].length - 1) 
          && (this.maxLength == 0 || (this.index + 1) < this.maxLength))
        this.module["MODULE_ADD"] = "1"; // 最后一组显示添加按钮
      else
        this.module["MODULE_ADD"] = "0";

      if (this.parentPage.moduleDatas[this.module.MODULE_ID].length > 1 && this.moduleInit["MODULE_ADD"] == "1" || (this.moduleInit["showDelete"] && this.moduleInit["MODULE_ADD"] == "1"))
        this.module["MODULE_DELETE"] = "1"; // 如果长度大于一组显示删除按钮
      else
        this.module["MODULE_DELETE"] = "0";

      // data.sort(this.by("FIELD_SEQ")); 现在已按后台排序？
      for(let i in data) {
        var d = data[i];
        if(d.FIELD_TYPE in comps)
          d.component = d.FIELD_TYPE;
        else // 默认通用输入框
          d.component = "normalinput";
      }

      this.fields = data;
    },
    // by: function(name){ // 用于数组字典排序
    //  return function(o, p){
    //     var a, b;
    //     if (typeof o === "object" && typeof p === "object" && o && p) {
    //       a = o[name];
    //       b = p[name];
    //       if (a === b) {
    //         return 0;
    //       }
    //       a = parseInt(a);
    //       b = parseInt(b);
    //       return a < b ? -1 : 1;
    //     }
    //     else {
    //       throw ("error");
    //     }
    //   }
    // }
  }
};
</script>

<style lang="less">
.kui-fieldset-wrap{
  display: flex;
  flex-wrap: wrap;
}
</style>
