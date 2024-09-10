<template>
  <div class="check-code-wrap">
    <div class="title">{{checkCode.title}}</div>
    <div class="img-box">
      <img :src="checkCode.imgSrc" alt="点击重新获取验证码" @click="update" />
    </div>
    <div class="input-box">
      <el-input id="unique-check-code" v-model="code" ref="checkInput"></el-input>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    checkCode: {
      type: Object,
      default: {
        title: "",
        imgSrc: ""
      }
    }
  },
  data () {
    return {
      code: ""
    }
  },
  mounted () {
    this.$refs.checkInput.focus();
  },
  methods: {
    update: _.debounce(function () {
      this.$emit("additonalAction")
    }, 1000)
  }
}
</script>
<style lang="less" scoped>
.check-code-wrap {
  .title {
    margin-top: 14px;
    box-sizing: border-box;
    font-size: 40px;
    color: #000;
    letter-spacing: 0;
    line-height: 54px;
  }
  .img-box {
    margin: 20px 0;
    img {
      display: inline-block;
      width: 160px;
      height: 50px;
    }
  }
  .input-box {
    .el-input {
      /deep/ .el-input__inner {
        width: 180px;
        height: 54px;
        font-size: 24px;
        background: linear-gradient(
          180deg,
          rgba(238, 242, 244, 1),
          rgba(245, 246, 248, 1)
        );
        border: 2px solid rgba(161, 166, 185, 1);
        box-shadow: inset 0px 3px 2px 0px rgba(34, 49, 89, 0.2);
        border-radius: 4px;
      }
    }
  }
}
</style>