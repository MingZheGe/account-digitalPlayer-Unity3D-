
<template>
  <el-form-item 
      :id="field.FIELD_ID" 
      :ref="field.FIELD_ID" 
      class="mobile-table"
      :class="itemClass" 
      v-show="isShow"
      :rules="rules"
      :prop="field.FIELD_ID">
      <el-table :data="tableData"  ref="multipleTable"  :border="field.border?field.border:false"
       :row-class-name="tableRowClassName" :header-row-class-name='tableHeaderRowClassName'  @select="handleSelectionChange" @select-all="handleSelectionAll"> 
        <el-table-column
          type="selection"
          width="55"
          v-if='isShowSelector'>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in colConfigs"
          :key="item.prop+index"
          :prop="item.prop"
          :label="item.label" type='item.type' show-overflow-tooltip>
          <template slot-scope="scope" >
            <span class='content' v-if="item.type!='edit'">{{ scope.row[item.prop] }}</span>
            <div v-if="item.type=='edit'"  @click="handleEdit(scope.$index, scope.row, item.prop)">
              <span v-if="scope.row[item.prop]!=''">{{ scope.row[item.prop] }}</span>
              <el-button size="mini"
                @click="handleEdit(scope.$index, scope.row, item.prop)" >修改</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
  </el-form-item>
</template>
// 使用说明初始化之前 必须给字段构造table属性，table的数据结构，其中tableData为列表数据，colConfigs为表头数据，
// isShowSelector是否显示多选框，border是否显示竖直方向的边框
// this.field.table={
//       tableData:[{
//         STK_NAME: "华控赛格",
//         STK_AVL: '1000',
//         ORDER_QTY: '9'
//         }, {
//           STK_NAME: "华控赛格2",
//           STK_AVL: '10001',
//           ORDER_QTY: '29'
//       }],
//       colConfigs:[
//         { prop: 'STK_NAME', label: '持仓证券' ,type:"normal"},
//         { prop: 'STK_AVL', label: '可转数量',type:"normal" },
//         { prop: 'ORDER_QTY', label: '托管数量',type:"edit"},
//       ],
//       isShowSelector:true,
//     }
<script>
import validateRules from './validateRules'

export default {
  components: {
  },
  data() {
    return {
      itemClass: "self-selector",
      colConfigs:[],
      tableData: [],
      multipleSelection:[],
      rules: [],
      triggerType: "custom",
      tableRowClassName({row, rowIndex}) {
        return 'normal-row ' + 'normal-row' + rowIndex;
      },
      tableHeaderRowClassName({row, rowIndex}) {
        return 'normal-header-row'  
      },
    }
  },
  props: ["field", "index"],
  created() {
    this.rules.push({validator: this.validatorField, trigger: this.triggerType});
    if(this.isRequired)
      this.itemClass += " self-table-required";
  },
  mounted() {
    this.initTable();
    this.multipleSelection = this.field.DEFAULT_VALUE
    //回填勾选的数据
    let rows = _.intersectionWith(this.tableData, this.multipleSelection, _.isEqual);
    let that = this;
    setTimeout(() => {
      if(rows.length){
        rows.forEach(row => {
          that.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    }, 500); 
  },
  computed: {
    isShowSelector: function () {
      return this.field && this.field.table && this.field.table.isShowSelector;
    },
    title: function () {
      return this.field.FIELD_TITLE + "："
    },
    isRequired: function () {
      return parseInt(this.field.FIELD_REQUIRED) ? true : false;
    },
    isShow: function() {
      let fieldControl = parseInt(this.field.FIELD_CONTROL);
      if(fieldControl === 0 || fieldControl === 2){
        return true;
      } else {
        return false;
      }
    },
    tableChange: function() {
      return this.field.table || this.field.table.tableData || this.table.colConfigs;
    },
    dataChange: function(){
      return this.field.DEFAULT_VALUE;
    },
    messageChange: function(){
      return this.field.message;
    },
    maxValueKey: function(){//限制输入最大值的key 例如如果你要让表格编辑按钮 输入的值不能大于可转股数 STK_AVL的值，只需要设置field.maxValueKey='STK_AVL'
      return this.field.maxValueKey;
    },
  },
  watch: {
    isRequired: function(val) {
      if(val){
        this.itemClass += " self-tableItem-required";
      } else {
        this.itemClass = this.itemClass.replace(/self-tableItem-required/g, "");
      }
    },
    tableChange: function(val) {
      this.initTable();
    },
    messageChange: function(val) {
      this.$refs[this.field.FIELD_ID].validate('custom'); // 自定义触发校验事件
    },
    dataChange: function(val) {
      this.field.message = "";
      this.$refs[this.field.FIELD_ID].validate('custom'); // 自定义触发校验事件
    },
    tableData: function(val){
      //表格数据变了 需要同步更改字段的默认值
      let rows = _.intersectionWith(val, this.multipleSelection, _.isEqual); 
      let newArray = []
      if(this.field.DEFAULT_VALUE){
        this.field.DEFAULT_VALUE.forEach(function(v){
          //找出表格中相同股份名称的股份
          let newObj = _.find(val, v)
          if(newObj){
            newArray.push(newObj)
          }
        });
        this.field.DEFAULT_VALUE = newArray;
      }
    }
  },
  methods:{
    initTable(){
      this.colConfigs = this.field.table.colConfigs;
      this.tableData = this.field.table.tableData;
    },
    handleEdit(index, row, key) {
      console.log(key, row);
      let that = this;
      that.messageBox({
        messageText: this.field.table.tipText || "请输入",
        confirmButtonText:'确定',
        showMsgBox: true,
        typeMessage:'prompt', 
        cancelButtonText:"取消",
        confirmedAction:function(value){
          let maxValue = row[that.field.maxValueKey] || "999999999"
          if(parseFloat(value) <= parseFloat(row[that.field.maxValueKey]) && parseFloat(value) > 0){
            //修改列表数据
            row[key] = parseFloat(value).toString();
            console.log("表格默认值为",that.field.DEFAULT_VALUE)
          } else {
            that.messageBox({
              hasMask: true,
              messageText: "请客户输入正确转托管数量",
              confirmButtonText: "确定",
              typeMessage:'warn-noImg',
              showMsgBox: true
            });
            console.log("表格默认值为",that.field.DEFAULT_VALUE)
          }
         
        },
        validateAction: function(value) {
          let errorTip = '';
          let rule = validateRules['int'];
          if (rule && _.trim(value) !== "") {
             let isError = !rule.valid(value);
             if (isError) {
               errorTip = rule.msg;
             }
          }
          return errorTip;
        }
      })
    },
    handleSelectionChange(selection, row) {//勾选了选择狂
      this.multipleSelection = selection;
      console.log("勾选了第"+selection+"行")
      this.field.DEFAULT_VALUE = this.multipleSelection;
    },
    handleSelectionAll(selection){
      this.multipleSelection = selection;
      console.log("全选勾选了"+selection+"行")
      this.field.DEFAULT_VALUE = this.multipleSelection;
    },
    validatorField: function (rule, value, callback) {
      //隐藏的字段不校验
      // if(!this.isShow){
      //   return;
      // }
      console.log("触发了table组件校验", this.field.DEFAULT_VALUE)
      value = this.field.DEFAULT_VALUE;
      if(_.trim(value) === "" && this.isRequired && this.isShow) {
        this.showErrorMsg = this.field.FIELD_TITLE + "为必填项";
        this.field.correct = false;
        this.field.showerr = true;
        this.field.FIELD_CONTROL = "0";
        return callback(new Error(this.showErrorMsg));
      } else if(this.field.message) { // 关联逻辑判断中传过来要显示的message
        this.showErrorMsg = this.field.message;
        this.field.correct = false;
        this.field.showerr = true;
        return callback(new Error(this.showErrorMsg));
      } else {
        this.field.correct = true;
        this.showErrorMsg = "";
        this.field.message = "";
        this.field.showerr = false;
        this.$store.commit(this.$types.UPDATE_FIELD_CHANGE, { field_id:this.field.FIELD_ID, module_id:this.field.MODULE_ID, index:this.index });
        return callback();
      }
    },
  }
}
</script>
<style lang='less' >
.self-module .el-main .mobile-table,.mobile-table{
    width: 100% !important;
    .el-form-item__content{
      width: 100% !important;
      .el-table {
        width: 100% !important;
        .el-table__body{
          .normal-row{
            height: 110px;
            line-height: 110px;         
            font-size: 32px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #6d7c8a;
            padding: 0;
            td,.cell{
              // height: 110px;
              line-height: 110px;
              padding: 0;
            }
            td .cell .el-button{
              font-size: 28px;
              letter-spacing: 0px;
              color: #589dfc;
              padding: 0;
            }
            td .cell .el-checkbox span{
              width: 32px;
              height: 32px;
              border-radius: 5px;
              ::after{
                height: 15px;
                left: 12px;
                top: 5px;
                width: 6px;
              }
            }
          }
        }
        .el-table__header-wrapper{
          width: 100% !important;
          .normal-header-row{
            font-size: 32px;
            color: #6d7c8a;
            th,.cell{
              // height: 110px;
              // line-height: 110px;
              // padding: 0;
            }
            th .cell .el-checkbox span{
              // width: 32px;
              // height: 32px;
              // border-radius: 5px;
              // ::after{
              //   height: 15px;
              //   left: 12px;
              //   top: 5px;
              //   width: 6px;
              // }
              // ::before{
              //   top: 14px;
              // }
            }
          }
        }
      }
    //  .el-table__header tr,
    //     .el-table__header th {
    //       padding: 0;
    //       height: 110px;
    //   }
    //   .el-table__body tr,
    //     .el-table__body td {
    //       padding: 0;
    //       height: 110px;
    //   }
    }
    .el-checkbox {
      .el-checkbox__input {
        span {
           border-color: #96a4bf;
        }
      }
    }
  }

</style>
