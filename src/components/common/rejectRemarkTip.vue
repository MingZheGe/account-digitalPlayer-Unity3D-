通用驳回提示

<template>
    <div class="tip" v-if="showTip">
        <div class="toggle" @click="toggle"><div :class="toggledClass"></div></div>
        <div class="remark" v-show="toggled"><b>驳回原因：</b><br>{{remark}}</div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            toggled: true,
            showTip: false,
            remark: "",
        }
    },
    mounted() {
        this.initTip();
    },
    computed: {
        toggledClass() {
            return this.toggled ? "ic toggled" : "ic"
        },
        rejectRemark() {
            return this.$store.state.rejectRemark;
        },
    },
    methods: {
        toggle() {
            this.toggled = !this.toggled;
        },
        initTip() {
            if(this.rejectRemark) {
                this.showTip = true;
                this.remark = this.rejectRemark;
                this.$store.commit(this.$types.UPDATE_REJECT_REMARK, ""); // 重置清空驳回信息
            }
        }
    },
    watch: {
        rejectRemark(val) {
            if(val) {
                this.initTip();
            }
        }
    }
}
</script>

<style lang="less" scoped>
.tip {
    position: fixed;
    display: flex;
    right: 59px;
    background-image:linear-gradient(270.53deg,#ff9b65 0%,#f56c23 100%);
    border-radius:8px 0px 0px 8px;
    box-shadow:0px 4px 16px rgba(0, 0, 0, 0.06);
    top: 119px;
    z-index: 2;
    .remark {
        width: 440px;
        line-height: 38px;
        padding: 16px 0 16px 30px;
        background: #fff;
        font-family:Alibaba PuHuiTi;
        font-weight:700;
        color:#666;
        font-size:22px;
        b {
            color:#f56d25;
        }
    }
    .toggle {
        min-width:52px;
        min-height:94px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image:linear-gradient(270.53deg,#ff9b65 0%,#f56c23 100%);
        border-radius:8px 0px 0px 8px;
        box-shadow:0px 4px 16px rgba(0, 0, 0, 0.06);
        .ic {
            width: 19px;
            height: 19px;
            background-image: url('../../icons/common/arrow.svg');
            transform: rotate(180deg);
        }
        .toggled {
            transform: rotate(0);
        }
    }
}
</style>
