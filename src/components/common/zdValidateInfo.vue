<template>
    <el-dialog :visible.sync="isShow" title="中登身份校验结果" style="text-align: center;" class="zd-validate-info" :modal-append-to-body='false'>
        <div class = "zd-validate-wrap">
            <el-table :data="zdValidateInfo.result">
                <el-table-column prop="FIELD_TXT" label="信息名称"></el-table-column>
                <el-table-column prop="input" label="身份证信息"></el-table-column>
                <el-table-column prop="output" label="中登查询信息"></el-table-column>
                <el-table-column prop="flag" label="校验结果"></el-table-column>
            </el-table>
            <!-- <el-avatar shape="square" :size="300" :src="zdValidateInfo.url"></el-avatar> -->
            <div style="display: inline-block">
                <div class="avatar-title">中登头像信息</div>
                <img :src="zdValidateInfo.url || defaultImg" width="220" height="304">
            </div>
        </div>
        <div class="footer">
            <kui-button v-if='showCloseBtn' :options = "{buttonGroup:[{text:'确  定',handler:closeHandler,width:200,type:'primary'}]}" />  
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: ['zdValidateInfo'],
    data() {
        return {
            isShow: false,
            showCloseBtn:true,
            defaultImg:require('../../images/default-photo.png')
        }
    },
    methods: {
        show() {
            this.isShow = true;
        },
        closeHandler(){
            this.isShow= false;
        }
    }
}
</script>
<style lang="less">
.zd-validate-info {
    z-index: 9999 !important;
    .el-dialog__header {
        padding-top: 40px;
        padding-bottom: 0;
    }
}
.zd-validate-wrap {
    .el-table {
        display: inline-block;
        width: 70%;
    }
    .avatar-title {
        text-align: center;
        padding: 10px;
    }
}
.footer {
    margin-top: 30px;
    display: inline-block;
    .button {
        width: 20%;
        height: 100%;
        border-radius:60px;
        font-size: 20px;
        font-weight: 500;
        color: #FFF;
    }
    .sure-button {
        width: 248px;
        background-color: #c52727;
        box-shadow: 0px 6px 32px 0px 
        rgba(197, 39, 39, 0.18);
        border-radius: 6px;
    }
}
</style>