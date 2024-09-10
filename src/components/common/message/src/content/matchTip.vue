<template>
    <div class="match-tip">
        <div class="match-title">
            {{title}}
        </div>
        <div class="match-box">
            <div class="match-content">
                {{content}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    props: ['title', 'content'],
    mounted() {
    },
}
</script>

<style lang="less">
.match-tip {
    font-family: Alibaba PuHuiTi;
    width: 100%;
    height: 248px;
    position: relative;
    .match-title {
        font-family: Alibaba PuHuiTi;
        font-weight: 700;
        color: #222222;
        font-size: 32px;
        line-height: 32px;
        text-align: center;
        position: absolute;
        top: -34px;
        left: 40%;
    }
    .match-box {
        background-color: #f7f7fa;
        border-radius: 4px;
        width: 100%;
        height: 180px;
        font-family: Alibaba PuHuiTi;
        color: #666666;
        font-size: 24px;
        line-height: 42px;
        position: absolute;
        top: 47px;
        .match-content {
            text-indent: 46px;
            padding-left: 35px;
            padding-right: 20px;
            text-align: left;
            margin-top: 41px;
        }
    }
}
</style>