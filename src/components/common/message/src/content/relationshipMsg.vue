<template>
  <div class="relationship-msg-wrap">
    <i class="close-btn" @click.self="canceled()"></i>
    <header class="header">
      <p class="title">{{title}}</p>
      <p class="info">
        <span v-if="info&&info.length>0">
          <i class="el-icon-warning"></i>
          {{info}}
        </span>
      </p>
    </header>
    <article class="art-wrap flex">
      <div class="message flex">
        <strong>以下账户需提供对应券商出具的“资产权属证明”或“证券持有查询结果（无证券余额）”</strong>
      </div>
      <div class="sz-tips flex tips" v-show="szTips.length>0">
        <div class="sz-tips__label tips__label">
          <span class="placeholder"></span>
          <strong>深市账户：</strong>
        </div>
        <ul class="sz-tips-group tips-group">
          <li v-for="(item, index) in szTips" :key="index" class="sz-tips__content tips__content">
            <strong>证券账户：</strong>
            {{item.TRDACCT}}，&nbsp;
            <span v-if="item.isNone">未查询到委托交易券商</span>
            <span v-else>
              <strong>委托交易券商：</strong>
              {{item.ORG_NAME}}
            </span>
          </li>
        </ul>
      </div>
      <div class="sh-tips flex tips" v-show="shTips.length>0">
        <div class="sh-tips__label tips__label">
          <span class="placeholder"></span>
          <strong>沪市账户：</strong>
        </div>
        <ul class="sh-tips-group tips-group">
          <li v-for="(item, index) in shTips" :key="index" class="sh-tips__content tips__content">
            <strong>证券账户：</strong>
            {{item.TRDACCT}}，&nbsp;
            <span v-if="item.isNone">未查询到指定交易券商</span>
            <span v-else>
              <strong>指定交易券商：</strong>
              {{item.ORG_NAME}}
            </span>
          </li>
        </ul>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  props: {
    title: "",
    szTips: {
      type: Array
    },
    shTips: {
      type: Array
    },
    info: "",
  },
  methods: {
    canceled () {
      this.$emit("canceled");
    }
  }
}
</script>
<style lang="less">
.sign-loading-wrap--relationship {
  overflow: unset !important;
}
.relationship-msg-wrap {
  .close-btn {
    position: absolute;
    top: 0px;
    right: -100px;
    display: block;
    width: 70px;
    height: 70px;
    background-size: 100% 100%;
    background: url("~@img/message/icon_guanbi.png");
  }
  .header {
    margin-top: 30px;
    height: 80px;
    line-height: 80px;
    .title {
      font-size: 40px;
      font-weight: bold;
      color: #232323;
    }
  }
  .art-wrap {
    margin: 20px 20px 20px;
    height: 550px;
    border-radius: 10px;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    padding: 0 20px;
    color: #232323;
    overflow-y: auto;
    .message {
      width: 100%;
      height: 60px;
      font-size: 23px;
      line-height: 60px;
    }
    .tips {
      width: 100%;
      margin: 0 0 20px 0;
      padding: 30px;
      flex-wrap: wrap;
      align-items: flex-start;
      align-content: flex-start;
      font-size: 24px;
      background-color: #eff2f6;
      border-radius: 4px;
      box-sizing: border-box;
      .tips__label {
        width: 100%;
        text-align: left;
        .placeholder {
          display: inline-block;
          width: 15px;
          height: 15px;
          margin-right: 10px;
          background: black;
        }
      }
      .tips-group {
        margin: 20px 0 0;
        padding: 0;
        .tips__content {
          text-align: start;
          margin-bottom: 20px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>