<template>
  <div class="prof-tips-wrap">
    <div class="prof-title">{{profMessageContent.messageTitle}}</div>
    <div class="prof-box">
      <div class="prof-type">{{profMessageContent.messageProfType}}</div>
      <div class="prof-exp-date">{{profMessageContent.messageExpDate}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    profMessageContent: {
      type: Object,
      default: {
        messageTitle: "请确认本次申请的专业投资者类型",
        messageProfType: "",
        messageExpDate: "",
      }
    }
  },
  data () {
    return {
      
    }
  },
  mounted () {
    console.log("profTips --------");
  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
.prof-tips-wrap {
    font-family: Alibaba PuHuiTi;
    .prof-title {
        font-weight: 700;
        color: #252525;
        font-size: 32px;
        line-height: 32px;
        text-align: center;
    }
    .prof-box {
        width: 722px;
        height: 200px;
        margin: 0 auto;
        margin-top: 38px;
        background-color: #f7f7fa;
        border-radius: 4px;
        .prof-type {
            padding-top: 42px;
            font-weight: 700;
            color: #252525;
            font-size: 32px;
            text-align: center;
        }
        .prof-exp-date {
            padding-top: 32px;
            color: #252525;
            font-size: 24px;
            text-align: center;
        }
    }
}
</style>