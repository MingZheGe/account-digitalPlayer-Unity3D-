<template>
    <div class = "table-box">
        <div class="table-box-title">{{title}}</div>
        <div class="table-box-content"> 
            <el-table
                :header-cell-class-name = "tableHeaderCellClassName"
                :row-class-name = "tableRowClassName"
                :cell-class-name = "tableCellClassName"
                :border="false"
                :data="tableData"
                style="width: 100%">
                <template v-for="item in headerTableData">
                    <el-table-column
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width">
                    </el-table-column>
                </template>
            </el-table>
        </div>
        
    </div>
</template>
<script>
export default {
    props: ["title", "option", "headerTableData", "tableData"],
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {
        tableHeaderCellClassName({row, column, rowIndex, columnIndex}) {
            if (columnIndex == "0") {
                return "headCellStyle"
            }
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return "rowColorOne"
            }
        },
        tableCellClassName({row, column, rowIndex, columnIndex}) {
            if (columnIndex == "0") {
                return "bodyCellStyle"
            }
        }
    }
}
</script>
<style lang="less">
.table-box {
    width: 100%;
    .table-box-title {
        margin-top: 60px;
        margin-bottom: 30px;
        font-family: Alibaba PuHuiTi;
        font-weight: 700;
        color: #252525;
        font-size: 42px;
        line-height: 58px;
        text-align: center;
    }
    .table-box-content {
        width: 100%;
        min-height: 200px;
        max-height: 494px;
        border: 1px solid #d9d9d9;
        border-radius:8px;
        box-shadow:0px 3px 22px rgba(0, 0, 0, 0.03);
        overflow: scroll;
    }
    .el-table td{
        border-bottom: 0px;
    }
    .el-table {
        .rowColorOne {
            background-color:#f7f7fa;
        }
        .headCellStyle {
            .cell {
                padding-left: 52px;
            }
            
        }
        .bodyCellStyle {
            .cell {
                padding-left: 52px;
            }
        }
        &:before {
            height: 0px;
        }
        tr {
            height: 88px;
        }
        thead {
            font-family:Alibaba PuHuiTi;
            font-weight:700;
            color:#666666;
            font-size:26px;
        }
        tbody {
            font-family:Alibaba PuHuiTi;
            color:#252525;
            font-size:24px;
        }
        
        
    }
}
</style>