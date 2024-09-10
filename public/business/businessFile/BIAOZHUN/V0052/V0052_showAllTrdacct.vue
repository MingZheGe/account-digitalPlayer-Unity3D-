/**
    显示所有已开账户
    qinguojun
 */
<template>
    <el-container style="width:100%">
      <el-header>中登查询结果</el-header>
      <el-main style="width:100%">
        <div class="table-wrap">
          <el-table
            max-height="620"
            :data="oppBusiData.csdcTrdacctArr"
            :header-cell-style="{'background-color':'#e8f0ff','color':'#222222','padding-left':'38px','font-size':'26px'}"
            :cell-style="{'padding':'25px 38px','font-size':'24px','color':'#222222'}">
            <el-table-column
              prop="YMT_CODE"
              label="一码通"
              >
            </el-table-column>
            <el-table-column
              prop="ACCT_TYPE_TEXT"
              label="证券账户类型"
             >
            </el-table-column>
            <el-table-column
              prop="TRDACCT"
              label="证券账户账号"
              >
            </el-table-column>
            <el-table-column
              prop="TRDACCT_STATUS_TEXT"
              label="证券账户状态"
             >
            </el-table-column>
            <!-- <el-table-column
              prop="RELATION_FLAG"
              label="关联关系确认"
              >
            </el-table-column> -->
            <!-- <el-table-column
              prop="ZHIDING"
              label="指定交易"
             > -->
            <!-- </el-table-column> -->
          </el-table>
        </div>
      </el-main>
    </el-container>
</template>
<script>
export default {
    data() {
        return {
          trdacctList : [],
        }
    },
    //bizData 是流水数据可读写，用作保存流水  historyData是历史数据，只读 oppBusiData用作中转挂载数据
    props: ["bizData", "historyData", "oppBusiData"],
    computed: {
    },
    created() {
    },
    methods: {
        pageActivated(_this) {
          // _this.isShowNext = false;
          _this.$router.hideRoute("查看所有");
          //  _this.$el.getElementsByClassName("next")[0].parentElement.style.display = "none";
        },
        validate() {
        },
        beforeSave(_this, params, baseData) {
        }
    }
}
</script>
<style lang="less" scoped>
  .el-container{
    .el-header{
      margin: 50px auto 0 auto;
      text-align: center;
      // color: #3e72bf;
      color:#222222;
      font-size: 28px;
      line-height: 60px;
    }
    .el-main{
      .table-wrap{
        width:80%;
        margin-left:10%;
        border-radius: 10px;
        border: 1px solid #9a9898;
        .el-table{
          max-height: 600px;
          background-color: #ffffff;
          box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
          border-radius: 4px;
          border: solid 1px #b1cef7;
          height: 1900px;
          .el-table__header-wrapper{
            width: 100%;
            background-color: #000000;
            .el-table__header{
                width: 100%;
                background-color: #74c5da;
            }
            .el-table__body{
                width: 100%;
            }
          }
        }
      }
    }
  }
</style>