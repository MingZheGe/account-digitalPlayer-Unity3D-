<template>
    <div class="letter-content">
        <div class="title" v-if="title">
            <span>{{title}}</span>
        </div>
        <div class="letter-content" v-if="letterContent"> 
            <span v-html="letterContent"></span>
        </div>
        <div class="tip" v-if="tip">
            <span>{{tip}}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    props: ['title', 'letterContent', 'tip'],
    methods: {
        
    }
}
</script>

<style lang="less">
.letter-content {
    font-family: Alibaba PuHuiTi;
    width: 100%;
    .title {
        color:#222222;
        font-size:26px;
        line-height: 35px;
        margin-top: 23px;
        text-align: left;
        margin-bottom: 10px;
    }
    .letter-content {
        width: 100%;
        background-color:#f5f5f5;
        border-radius:4px;
        padding: 20px 8px 20px 30px;
        box-sizing: border-box;
        span {
            display: block;
            margin: auto;
            color:#666666;
            font-size:24px;
            line-height:38px;
            text-align: left;
        }
    }
    .tip {
        margin-top: 30px;
        height:44px;
        font-weight:500;
        color:#222222;
        font-size:32px;
        line-height:32px;
        text-align:center;
    }
}

</style>