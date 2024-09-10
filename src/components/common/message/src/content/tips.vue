<template>
  <div class="tips-warp">
    <div class="tips-title">特别提示</div>
    <div class="tips-sec-title">请您按照提示正确填写协议内容</div>
    <div class="tips-list">
      <div class="tips-item" v-for="(item, index) in tipList" :key="index"><span v-html="item"></span></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tipList'],
  data() {
    return {

    }
  },
  methods: {
    
  }
}
</script>

<style lang="less">
.tips-warp {
    width: 1390px;
    height: 700px;
    .tips-title {
      line-height: 58px;
      font-family: Alibaba PuHuiTi;
      font-weight: bold;
      color: #252525;
      font-size: 42px;
      margin: 14px 0 0;
    }
    .tips-sec-title {
      line-height: 45px;
      font-family: Alibaba PuHuiTi;
      color: #666666;
      font-size: 26px;
      margin: 13px auto 24px
    }
    .tips-item {
      width: 1140px;
      min-height: 100px;
      margin: 0 auto 30px;
      padding: 10px 33px 10px 70px;

      display: flex;
      align-items: center;
      background-color: #ebf0ff;
      border-radius: 8px;

      box-sizing: border-box;
      font-size: 24px;
      font-weight: 700;
      color: #252525;
      line-height: 32px;
      span {
        text-align: left;
      }
    }
}
</style>