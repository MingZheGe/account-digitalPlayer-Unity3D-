<template>
  <div class="read-card-msg">
    <div class="read-card-msg-title">{{title}}</div>
    <div class="read-card-msg-content">
      <div class="list-item">
        <div class="label">姓名</div>
        <div class="val">
          <div class="card">
            读卡值：
            <span>{{readCardMsg.cardName}}</span>
          </div>
          <div class="sys">
            系统值：
            <span>{{readCardMsg.custName}}</span>
          </div>
        </div>
      </div>
      <div class="list-item">
        <div class="label">证件号码</div>
        <div class="val">
          <div class="card">
            读卡值：
            <span>{{readCardMsg.cardIdCode}}</span>
          </div>
          <div class="sys">
            系统值：
            <span>{{readCardMsg.custIdCode}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    readCardMsg: {
      type: Object,
      default: {}
    }
  },
  computed: {
    title () {
      return this.readCardMsg.title || "系统信息校验结果"
    }
  }
}
</script>
<style lang="less">
.read-card-msg {
  padding: 0 56px;
  .read-card-msg-title {
    margin: 60px 0 48px 0;
    font-size: 40px;
    font-weight: bold;
    color: #232323;
    line-height: 1;
  }
  .read-card-msg-content {
    .list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 28px;
      font-weight: bold;
      color: #808992;
      .val {
        flex: 0 0 452px;
        padding: 28px 0 28px 48px;
        text-align: left;
        background-color: #eff2f6;
        border-radius: 4px;
        word-break: break-all;
        .card {
          margin-bottom: 18px;
          color: #232323;
        }
        .sys {
          span {
            color: #c22115;
          }
        }
      }
    }
    .list-item:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}
</style>