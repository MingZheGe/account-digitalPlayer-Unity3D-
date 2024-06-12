<template>
  <div class="outer-container">
      <div class="container">
          <h1 class="title">投资者风险承受能力评估结果告知函</h1>
          (提示：本表由证券公司填写，证券公司和客户双方各自留存。)<br />
          <table class="assessment-table">
              <tr>
                  <td class="cell center-cell">投资者风险承受能力评估结果</td>
                  <td class="cell">

                      尊敬的客户(姓名/名称：刘干 客户代码：360300004404)：<br />
                      根据您填写的《投资者风险承受能力评估问卷》，我司对您的风险承受能力进行了综合评估，现得到评估结果如下：<br />
                      您的风险承受能力为：<b>{{ riskLevel }} {{ riskScore }}分</b><br /><br />
                      【客户风险承受能力划分标准】<br />
                      保守型(C1)，0-19分(含风险承受能力最低类别的投资者)；
                      相对保守型(C2)，20-39分；
                      稳健型(C3)，40-59分；
                      相对积极型(C4)，60-79分；
                      积极型(C5)，80-100分。<br /><br />
                      我司在此郑重提醒，我司向您销售的金融产品或提供的金融服务将以您的风险承受能力等级为基础，若您提供的信息发生任何重大变化，您都应当及时书面通知我司。我司建议您审慎评判自身风险承受能力、结合自身投资行为，作出审慎的投资判断。<br />
                      如您在审慎考虑后同意我司的评估结果，请认真阅读下列内容，并签字以示同意。<br />
                      <div class="align-right">xxxx证券股份有限公司</div>
                  </td>
              </tr>
              <tr>
                  <td class="cell center-cell">客户确认</td>
                  <td class="cell">
                      xxxx证券股份有限公司：<br />
                      本人/本机构在贵公司的提示下对自身风险承受能力进行了综合评估，已经审慎考虑自身的风险承受能力并在此确认：<br />
                      本人/本机构的风险承受能力为：<b>{{ riskLevel }}</b>；<br />
                      本人/本机构经贵公司告知，已充分知晓贵公司向本人/本机构销售的金融产品或提供的金融服务将以本人/本机构此次确认的风险承受能力等客户确认级为基础。若本人/本机构提供的信息发生任何重大变化，本人/本机构都会及时书面通知贵公司。本确认函系本人/本机构独立、自主、真实的意思表示，特此确认。本人/本机构已经审慎考虑自身的风险承受能力以及过往的投资行为，并确认已知晓本人/本机构风险承受能力。本人/本机构经贵公司提示，已充分知晓贵公司为本人/本机构提供的金融产品或金融服务将以本人/本机构此次确认的风险承受能力等级为基础。<br /><br />
                      <div class="align-right">
                          客户确认签字：刘干<br />
                          日期：{{ currentDate }}<br />
                      </div>
                  </td>
              </tr>
          </table>
          <div class="note">
              注：若自然人客户风险承受能力等级为保守型(C1)且满足以下情形之一时，我司则将其认定为风险承受能力最低类别投资者，仅提供符合其风险承受能力的低风险等级产品或服务：<br />
              (一)不具有完全民事行为能力；<br />
              (二)没有风险容忍度或者不愿承受任何投资损失；<br />
              (三)法律、行政法规规定的其他情形。<br /><br />
              市场有风险，投资需谨慎
          </div>
          <div class="confirmation">
              <input type="checkbox" id="agree" name="agree" v-model="isAgreed">
              <label for="agree" class="confirmation-text">本人已认真阅读并理解上述内容</label>
          </div>
          <div :class="['button-container', { 'highlight': isAgreed }]">
              <button :class="{ active: isAgreed }" @click="accept" :disabled="!isAgreed">我接受</button>
          </div>
      </div>
  </div>
</template>

<script>
//riskLevel和riskScore被定义为组件的data属性。
//在mounted钩子中，从props中的riskData对象中获取值。后端可以通过传递riskData对象来提供这两个值。
export default {
  data() {
      return {
          isAgreed: false,
          riskLevel: '默认型',
          riskScore: 0,
          currentDate: this.formatDate(new Date())// 设置默认值为当前日期
      };
  },
  props: {
      riskData: {
          type: Object,
          required: true
      }
  },
  mounted() {
      this.riskLevel = this.riskData.riskLevel;
      this.riskScore = this.riskData.riskScore;

      // 检查是否有传入的日期，如果有则覆盖默认的当前日期
      if (this.riskData.date) {
          this.currentDate = this.riskData.date;
      }
  },


  methods: {
      formatDate(date) {
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          return `${year}年${month}月${day}日`;
      },
      accept() {
          if (this.isAgreed) {
              alert('您已接受评估结果');
          }
      }
  }
}
</script>

<style scoped>
.outer-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.container {
  background-color: white;
  padding: 20px;
  border: 1px solid black;
  max-width: 800px;
  width: 100%;
  font-family: Arial, sans-serif;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.assessment-table {
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.cell {
  border: 1px solid black;
  padding: 10px;
  vertical-align: top;
}

.center-cell {
  text-align: center;
  vertical-align: middle;
}

.align-right {
  text-align: right;
}

.note {
  margin-top: 20px;
  line-height: 1.6;
  border: 1px solid black;
  padding: 10px;
}

.confirmation {
  margin-top: 20px;
  border: 1px solid black;
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 18px;
}

.confirmation input {
  margin-right: 10px;
}

.button-container {
  text-align: center;
  margin-top: 20px;
  border: 1px solid black;
  padding: 10px;
  max-width: 100%;
  background-color: transparent;
}

.button-container.highlight {
  text-align: center;
  margin-top: 20px;
  border: 1px solid black;
  padding: 10px;
  max-width: 100%;
  background-color: lightgray;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: lightgray;
  border: none;
}

button.active {
  background-color: #409eff;
  color: white;
}

button:disabled {
  cursor: not-allowed;
  background-color: lightgray;
  color: gray;
}
</style>