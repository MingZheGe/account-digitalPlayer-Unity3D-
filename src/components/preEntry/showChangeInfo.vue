展示修改信息
/*
 //changedData 数据结构示范 
 [
    mouduleID1：[
      {"type":"新增/删除/变更","title"："模块名称",items:
        [{"type":""新增/删除/变更",FIELDS:
          [{"title":"字段名称","newVal":"新值","oldVal":"旧值"},
          {"title":"字段名称","newVal":"新值","oldVal":"旧值"}]
        }]
      },
      {"type":"新增/删除/变更","title"："模块名称",items:
        [{"type":""新增/删除/变更",FIELDS:
          [{"title":"字段名称","newVal":"新值","oldVal":"旧值"},
          {"title":"字段名称","newVal":"新值","oldVal":"旧值"}]
        }]
    ]
    moduleID2：...]
 */
<template>
  <div class='infochange-table-List'>
    <div class = "table-title">请确认本次修改的内容</div>
    <div class="infochanged-table">
          <el-table :data="changeDataArr" class="table-box" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column prop="title" align="left" label="" class-name="fields-column" width="280"></el-table-column>
            <el-table-column prop="oldVal"  align="left" class-name="old-value-column" width="540" label="修改前"></el-table-column>
            <el-table-column prop="newVal"  align="left" class-name="new-value-column" width="540" label="修改后"></el-table-column>
          </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      changeDataArr: [],
    }

  },
  mounted() {
  },
  activated() {
  },
  props: ["changedData"],
  computed: {
  },
  mounted() {

    
  },
  activated() {
  },
  watch: {
    changedData() {
      let changedData = _.cloneDeep(this.changedData);
      let newChangeData = [];
      _.each(changedData, changeInfoArr => {

        _.each(changeInfoArr, changeInfo => {
          newChangeData.push({"title": changeInfo.title, newVal: "", oldVal: "", rowType: "1"})
          _.each(changeInfo.items, item => {
            _.each(item.FIELDS, field => {
                field.oldVal = field.oldVal || "-";
                field.newVal = field.newVal || "-"
                newChangeData.push(field);
            })
          })
        })
      })
      this.changeDataArr = newChangeData;
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.rowType == "1") {
        return "field-title-row";
      }
      return "";
    }
  }
};
</script>

<style lang="less">
.infochange-table-List {
  width: 1350px;
  margin: 0 auto;
  flex: 1;
  flex-basis: 0%;
  overflow: auto;
  -ms-overflow-style: none;
  .table-title {
    font-family: Alibaba PuHuiTi;
    font-weight: 700;
    color: #252525;
    font-size: 42px;
    line-height: 68px;
    text-align: center;
  }
  .infochanged-table {
    width: 1350px;
    margin-top: 30px;
    background-color:#ffffff;
    border: 1px solid;
    border-color: #d9d9d9;
    border-radius: 8px;
    box-shadow: 0px 3px 22px rgba(0, 0, 0, 0.03);
    .table-box {
      td {
        border: none;
      }
      .field-title-row{
        background-color: #f7f7fa;
        .fields-column {
          .cell {
            font-weight: 700;
            color: #252525;
          }
        }
      }
      .cell {
        font-family: Alibaba PuHuiTi;
        font-size: 24px;
        line-height: 35px;
        padding: 0;
        color: #252525;
      }
      .fields-column {
        padding: 26px 38px 26px 58px;
        
      }
      .old-value-column {
        padding-right: 68px;
      }
      .new-value-column {
        padding-right: 144px;
        .cell {
          color: #c93e2c;
        }
      }
    }
  }
  
}
</style>
