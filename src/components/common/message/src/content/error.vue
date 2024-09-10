<template>
  <div class="wrap">
    <header class="header">
      <p class="title">{{title}}</p>
      <p class="info">{{info}}</p>
    </header>
    <article class="art-wrap flex flex-middle">
      <div v-if="text">
        <p v-for="item in msg" :key="item" class="content">{{item}}</p>
      </div>
    </article>
  </div>
</template>
<script>
export default {
  name: "error-content",
  props: {
    title: "",
    info: "",
    text: ""
  },
  computed: {
    msg () {
      return this.text.split('&')
    }
  }
};
</script>
<style lang="less" scoped>
.wrap {
  .header {
    .title {
      font-size: 40px;
      color: #232323;
    }
    .info {
      margin-top: 14px;
      font-size: 24px;
      color: #81848c;
      &::before,
      &::after {
        content: "-";
        padding: 0 10px;
      }
    }
  }
  .art-wrap {
    box-sizing: border-box;
    width: 604px;
    min-height: 226px;
    margin-top: 35px;
    padding: 20px 50px;
    border: 2px solid #e46060;
    border-radius: 4px;
    background-color: #ffe8e8;
    .content {
      text-align: left;
      font-size: 24px;
      color: #d51212;
      line-height: 36px;
      font-weight: 500;
    }
  }
}
</style>