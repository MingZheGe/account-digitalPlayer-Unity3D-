<template>
  <div class="cust-eval-wrap">
    <header class="header">
      <p class="title">{{title}}</p>
      <p class="info">
        <span v-if="info&&info.length>0">
          <i class="el-icon-warning"></i>
          {{info}}
        </span>
      </p>
    </header>
    <div class="limitTimes" v-html="remainingEvalText" v-show="parseInt(intervalDays) > 0"></div>
    <div class="art-wrap flex flex-middle">
      <div class="table-title">{{surveyName}}</div>
      <table class="eval-content">
        <tr>
          <td class="td">
            <p class="padding">测评分数 :</p>
            <p class="result bold" :class="{warn:info}">{{score}}</p>
          </td>
          <td class="td">
            <p class="padding">测评日期 :</p>
            <p class="result bold" :class="{warn:info}">{{lvDate}}</p>
          </td>
        </tr>
        <tr>
          <td class="td">
            <p class="padding">风险等级 :</p>
            <p class="result bold" :class="{warn:info}">{{lv}}</p>
          </td>
          <td class="td">
            <p class="padding">测评有效期 :</p>
            <p class="result bold" :class="{warn:info}">{{lvExpDate}}</p>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: "",
    lv: "",
    score: "",
    lvDate: "",
    lvExpDate: "",
    remainingEval: "",
    info: "",
    surveyName: "",
    intervalDays: ""
  },
  data(){
    return {
      remainingEvalText: ""
    }
  },
  mounted () {
    this.remainingEvalText = '您今日剩余<b style="color:#c93e2c;padding:0 6px">' + this.remainingEval + '</b>次测评机会，请根据您的实际情况审慎测评！'
  }
}
</script>
<style lang="less" scoped>
.cust-eval-wrap {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .header{
    width: 100%;
    .title {
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      color: #252525;
      line-height: 36px;
      margin: 0;
    }
  }
  .art-wrap {
    width: 884px;
    background: #f7f7fa;
    border-radius:4px;
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .table-title{
      width: 818px;
      height: 114px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size:26px;
      line-height:35px;
      font-weight:500;
      color: #3b6aff;
      border-bottom: 1px solid #eaeaea;
    }
    .eval-content {
      display: flex;
      width: 100%;
      padding: 0;
      font-size: 26px;
      flex-direction: column;
      tr {
        display: flex;
        td {
          display: flex;
          width: 50%;
          height: 90px;
          align-items: center;
          p {
            display: inline-block;
            width: 210px;
          }
          .padding {
            text-align: right;
            font-weight: 500;
            color: #6e767d;
          }
          .result {
            text-align: left;
            padding-left: 10px;
            color: #232323;
          }
        }
      }
    }
  }
  .limitTimes {
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: 24px;
    line-height:32px;
    color: #666666;
  }
}
</style>