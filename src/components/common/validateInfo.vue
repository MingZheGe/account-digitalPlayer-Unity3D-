<template>
    <div class="telConfirm">
        <el-dialog class="dialog" :visible.sync="isShow" title="中登手机号码核查">
            <div>
                <el-table :data="validateInfo.result">
                    <el-table-column prop="busiCode" label="业务类别"></el-table-column>
                    <el-table-column prop="checkRes" label="检验结果"></el-table-column>
                    <el-table-column prop="output" label="返回信息"></el-table-column>
                </el-table>
            
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="goClose()">关 闭</el-button>
            </span>
        </el-dialog>

    </div>

</template>

<script>
export default {
    props: ['validateInfo'],
    data() {
        return {
            isShow: false,
        }
    },
    methods: {
        show() {
            this.isShow = true;
        },
        goClose() {
            console.log("asdas")
	    this.isShow = false;
        },
    }
}
</script>
<style lang="less">
.telConfirm {
    .avatar-title {
        text-align: center;
        padding: 10px;
    }
    .el-dialog__wrapper {
        background: rgba(0, 0, 0, .3);
        .el-dialog {
            background: #fff;
            z-index: 2;
            .el-table {
                display: inline-block;  
            }
        }
    }

}

</style>