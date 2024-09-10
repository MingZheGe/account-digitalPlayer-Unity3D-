<template>
  <el-container>
    <el-aside width="270px" class="fixed-index">
      <el-scrollbar>
        <div class="index-list">
          <div v-for="(question, index) in questions" :key="index" class="index-item">
            <el-link :class="{ 'answered': form[question.id].length !== 0 }" @click.native="scrollToQuestion(index)">
              第{{ index + 1 }}题
            </el-link>
          </div>

          <div class="index-item">
            <el-link @click.native="scrollToSubmit">
              提交
            </el-link>
          </div>
        </div>
      </el-scrollbar>
    </el-aside>
    <el-main>
      <div class="risk-assessment">
        <!-- 标题区域 -->
        <div class="header">
          <h2>风险评测问卷</h2>
        </div>
        <el-form ref="form" :model="form" @submit.native.prevent="submitForm">
          <el-card class="box-card" style="background: transparent;color:white">
            <!-- 问题列表 -->
            <div v-for="(question, index) in questions" :key="index" class="question-item" :ref="'question' + index">
              <el-form-item>
                <label class="question-label">{{ index + 1 }}. {{ question.text }}</label>

                <!-- 修改：第12题多选 -->
                <el-checkbox-group v-if="question.id === 'q12'" v-model="form[question.id]" class="checkbox-group">
                  <div v-for="option in question.options" :key="option.value" class="checkbox-wrapper">
                    <el-checkbox :label="option.value" class="checkbox-option">
                      {{ option.text }}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>

                <!-- 其他题目单选 -->
                <el-radio-group v-else v-model="form[question.id]" class="radio-group">
                  <div v-for="option in question.options" :key="option.value" class="radio-wrapper">
                    <el-radio :label="option.value" class="radio-option">
                      {{ option.text }}
                    </el-radio>
                  </div>
                </el-radio-group>
              </el-form-item>
            </div>
            <p class="completed-status">已完成 {{ completedQuestions }}/{{ totalQuestions }} 道题</p><br />
            <!-- 确认部分 -->
            <el-form-item>
              <div class="checkbox-container">
                <el-checkbox v-model="form.confirm"></el-checkbox>
                <span class="checkbox-text">
                  本人已经了解并愿意遵守国家有关证券市场管理的法律、法规、规章及相关业务规则，本人在此郑重承诺以上填写的内容真实、准确、完整并对其负责。若本人提供的信息发生任何重大变化，本人将及时书面通知贵公司。
                </span>
              </div>
            </el-form-item>
            <!-- 提交按钮 -->
            <!-- <el-form-item class="submit-button" ref="submitButton">
              <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item> -->
          </el-card>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios';
import { askUpload } from '../util/connect'

export default {
  props: {
    nextClick: Number
  },

  mounted() {
    var list = [{ "quesOrder": 1, "optionCode": "A" }, { "quesOrder": 2, "optionCode": "B" }]
    askUpload("c14bd150ba12406f8eb9e689023c65e5", list)
    wife.doAction("伸右手说话")
    let signSucc = new Audio()
     signSucc.src = require("../asset/video/6.wav")
     signSucc.play()

  },




  data() {
    return {
      form: {
        confirm: false,
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: '',
        q6: '',
        q7: '',
        q8: '',
        q9: '',
        q10: '',
        q11: '',
        q12: [],
        q13: '',
        q14: '',
        q15: '',
        q16: '',
        q17: '',
        q18: '',
        q19: '',
        q20: ''
      },
      questions: [
        {
          "id": "q1",
          "text": "您的主要收入来源是：",
          "options": [
            { "text": "工资(含退休金)、劳务报酬、社会养老保险", "value": "A" },
            { "text": "生产经营所得", "value": "B" },
            { "text": "利息、股息、转让证券等金融性资产收入", "value": "C" },
            { "text": "出租、出售房地产等非金融性资产收入", "value": "D" },
            { "text": "无固定收入", "value": "E" }
          ]
        },
        {
          "id": "q2",
          "text": "最近您家庭预计进行金融投资的资金占家庭现有总资产(不含自住、自用房产及汽车等固定资产)的比例是：",
          "options": [
            { "text": "70%(含)以上", "value": "A" },
            { "text": "50%(含)-70%(不含)", "value": "B" },
            { "text": "30%(含) -50%(不含)", "value": "C" },
            { "text": "10%(含) -30%(不含)", "value": "D" },
            { "text": "10%(不含)以下", "value": "E" }
          ]
        },
        {
          "id": "q3",
          "text": "您是否有尚未清偿的数额较大的债务，如有，其性质是：",
          "options": [
            { "text": "没有", "value": "A" },
            { "text": "住房抵押贷款等长期定额债务", "value": "B" },
            { "text": "信用卡欠款、消费信贷等短期信用债务", "value": "C" },
            { "text": "亲朋之间借款", "value": "D" }
          ]
        },
        {
          "id": "q4",
          "text": "您可用于金融投资的人民币资产数额(包括金融资产)为：",
          "options": [
            { "text": "50万元(不含)以下", "value": "A" },
            { "text": "50万元(含)-300万元(不含)", "value": "B" },
            { "text": "300万元(含)-1000万元(不含)", "value": "C" },
            { "text": "1000万元(含)以上", "value": "D" }
          ]
        },
        {
          "id": "q5",
          "text": "以下描述中何种符合您的实际情况：",
          "options": [
            { "text": "现在或此前曾从事金融、经济或财会等与金融产品投资相关的工作超过两年", "value": "A" },
            { "text": "已取得金融、经济或财会等与金融产品投资相关专业学士以上学位", "value": "B" },
            { "text": "取得证券从业资格、基金从业资格、期货从业资格、注册会计师证书(CPA)或注册金融分析师证书(CFA)中的一项及以上", "value": "C" },
            { "text": "我不符合以上任何一项描述", "value": "D" }
          ]
        },
        {
          "id": "q6",
          "text": "参与股票、基金等金融产品有风险，请问您投资除低风险(如银行存款、国债等)以外的股票、基金等权益类以及其他金融产品或金融服务的经验有几年?",
          "options": [
            { "text": "无经验", "value": "A" },
            { "text": "2年(不含)以下", "value": "B" },
            { "text": "2年(含)-5年(不含)", "value": "C" },
            { "text": "5年(含)以上", "value": "D" }
          ]
        },
        {
          "id": "q7",
          "text": "有一位投资者一个月内做了15笔交易(同一品种买卖各一次算一笔)，您认为这样的交易频率：",
          "options": [
            { "text": "太高了", "value": "A" },
            { "text": "偏高", "value": "B" },
            { "text": "正常", "value": "C" },
            { "text": "偏低", "value": "D" }
          ]
        },
        {
          "id": "q8",
          "text": "过去一年时间内，您购买的不同产品或接受的不同服务(含同一类型的不同产品或服务)的数量是：",
          "options": [
            { "text": "5个及以下", "value": "A" },
            { "text": "6-10个", "value": "B" },
            { "text": "11-15个", "value": "C" },
            { "text": "16个及以上", "value": "D" }
          ]
        },
        {
          "id": "q9",
          "text": "您的投资经验可以被概括为：",
          "options": [
            { "text": "有限：除银行活期账户、定期存款和国债外，我基本没有其他投资经验", "value": "A" },
            { "text": "一般：除银行活期账户、定期存款和国债外，我购买过基金、债券、保险等固定收益类理财产品，但还需要进一步的指导", "value": "B" },
            { "text": "丰富：我是一位有经验的投资者，参与过股票、基金等权益类投资品种的交易，并倾向于自己做出投资决策", "value": "C" },
            { "text": "非常丰富：我是一位非常有经验的投资者，参与过权证、期货、期权、融资融券等金融衍生品交易", "value": "D" },
            { "text": "极其丰富：其他高风险或复杂金融产品交易", "value": "E" }
          ]
        },
        {
          "id": "q10",
          "text": "如果您曾经从事过金融市场投资，在交易较为活跃的月份，人民币平均月交易额大概是多少：",
          "options": [
            { "text": "10万元(不含)以下", "value": "A" },
            { "text": "10万元(含)-30万元(不含)", "value": "B" },
            { "text": "30万元(含)-100万元(不含)", "value": "C" },
            { "text": "100万元(含)以上", "value": "D" },
            { "text": "从未从事过金融市场投资", "value": "E" }
          ]
        },
        {
          "id": "q11",
          "text": "您用于证券投资的大部分资金不会用作其它用途的时间段为：",
          "options": [
            { "text": "不超过1年(含)", "value": "A" },
            { "text": "1年(不含)-5年(含)", "value": "B" },
            { "text": "无特别要求", "value": "C" }
          ]
        },
        {
          "id": "q12",
          "text": "您打算重点投资于哪些种类的投资品种?(注：本题可多选，但评分以其中最高分值选项为准。)",
          "options": [
            { "text": "债券、货币市场基金、债券基金等固定收益类投资品种", "value": "A" },
            { "text": "股票、混合型基金、偏股型基金、股票型基金等权益类投资品种", "value": "B" },
            { "text": "期货、期权、融资融券、股票质押、行权融资等", "value": "C" },
            { "text": "高风险金融产品或服务", "value": "D" },
            { "text": "其他高风险或复杂金融产品或服务", "value": "E" }
          ]
        },
        {
          "id": "q13",
          "text": "假设有两种不同的投资：投资A期望获得 5%的收益，有可能承担非常小的损失；投资B期望获得20%的收益，但有可能面临25%甚至更高的亏损。您将您的投资资产分配为：",
          "options": [
            { "text": "全部投资于A", "value": "A" },
            { "text": "大部分投资于A", "value": "B" },
            { "text": "两种投资各一半", "value": "C" },
            { "text": "大部分投资于B", "value": "D" },
            { "text": "全部投资于B", "value": "E" }
          ]
        },
        {
          "id": "q14",
          "text": "当您进行投资时，您的期望收益目标是：",
          "options": [
            { "text": "尽可能保证本金安全", "value": "A" },
            { "text": "产生一定的收益", "value": "B" },
            { "text": "产生较多的收益", "value": "C" },
            { "text": "实现资产大幅增长", "value": "D" }
          ]
        },
        {
          "id": "q15",
          "text": "您认为出现多大投资损失时会感到焦虑?",
          "options": [
            { "text": "较小的投资损失", "value": "A" },
            { "text": "一定的投资损失", "value": "B" },
            { "text": "较大的投资损失", "value": "C" },
            { "text": "损失可能超过本金(或任何情况下均不会感到焦虑)", "value": "D" }
          ]
        },
        {
          "id": "q16",
          "text": "您打算将自己的投资回报主要用于：",
          "options": [
            { "text": "改善生活", "value": "A" },
            { "text": "个体生产经营或证券投资以外的投资行为", "value": "B" },
            { "text": "履行扶养、抚养或赡养义务", "value": "C" },
            { "text": "本人养老或医疗", "value": "D" },
            { "text": "偿付债务", "value": "E" }
          ]
        },
        {
          "id": "q17",
          "text": "您的年龄是：",
          "options": [
            { "text": "18岁(含)-30岁(含)", "value": "A" },
            { "text": "30岁(不含)-40岁(含)", "value": "B" },
            { "text": "40岁(不含)-50岁(含)", "value": "C" },
            { "text": "50岁(不含)-60岁(含)", "value": "D" },
            { "text": "超过60岁(不含)或未满18岁(不含)", "value": "E" }
          ]
        },
        {
          "id": "q18",
          "text": "今后五年时间内，您的父母、配偶以及未成年子女等需负法定抚养、扶养和赡养义务的人数为：",
          "options": [
            { "text": "2人及以下", "value": "A" },
            { "text": "3-4人", "value": "B" },
            { "text": "5人及以上", "value": "C" }
          ]
        },
        {
          "id": "q19",
          "text": "您的最高学历是：",
          "options": [
            { "text": "高中、中专或以下", "value": "A" },
            { "text": "大学专科", "value": "B" },
            { "text": "大学本科", "value": "C" },
            { "text": "硕士及以上", "value": "D" }
          ]
        },
        {
          "id": "q20",
          "text": "您家庭的就业状况是：",
          "options": [
            { "text": "您与配偶(如有)均有稳定收入的工作", "value": "A" },
            { "text": "您与配偶(如有)其中一人有稳定收入的工作", "value": "B" },
            { "text": "您与配偶(如有)均没有稳定收入的工作或者已退休", "value": "C" },
            { "text": "未婚，但有稳定收入的工作", "value": "D" }
          ]
        }
      ]
    };
  },
  methods: {
    async submitForm() {
      // 修改：检查是否所有问题都已回答
      for (let key in this.form) {
        if (key !== 'confirm' && (Array.isArray(this.form[key]) ? this.form[key].length === 0 : !this.form[key])) {
          this.$message.warning('请回答完所有问题后再提交。');
          return;
        }
      }
      if (!this.form.confirm) {
        this.$message.warning('请确认以上内容为真实填写，并愿意为其负责。');
        return;
      }
      this.$message.success('评测完成！');
      this.$emit('approve', 'ok')

      // 使用await关键字等待axios.post()请求的完成。
      // 通过axios.post()方法发起一个POST请求，目标URL是'https://'
/*
      try {
        console.log(this.form)
        const response = await axios.post('https://', JSON.stringify(this.form), {
          headers: {
            'Content-Type': 'application/json' //定义请求头，指定内容类型为JSON。
          }
        });
        console.log('服务器返回:', JSON.stringify(response.data)); //打印从服务器接收到的响应数据。
        this.$message.success('评测完成！');
      } catch (error) {
        console.error('提交错误:', error);
        this.$message.error('提交失败，请稍后重试。');
      }
      */
    },
    scrollToQuestion(index) {
      const question = this.$refs['question' + index];
      if (question) {
        question[0].scrollIntoView({ behavior: 'smooth' });
      }
    },
    scrollToSubmit() {
      const submitButton = this.$refs.submitButton;
      if (submitButton) {
        submitButton.$el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  computed: {
    completedQuestions() {
      return Object.entries(this.form).filter(([key, value]) =>
        key !== 'confirm' && (Array.isArray(value) ? value.length > 0 : value)
      ).length;
    },
    totalQuestions() {
      return this.questions.length;
    }
  },
  watch: {
    nextClick: {
      handler(newVal, oldVal) {
        this.submitForm()
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.risk-assessment {
  max-width: 950px;
  margin: 0 auto;
  padding: 0px;
}

.header {
  text-align: center;
  margin-bottom: 1px;
}

.question-item {
  margin-bottom: 20px;
}

.question-label {
  font-size: 18px;
  font-weight: bold;
}

.radio-group {
  display: block;
}

.checkbox-group {
  display: block;

}

.radio-wrapper {
  margin-top: 10px;
  margin-left: 20px;
  margin-bottom: 10px;
}

.checkbox-wrapper {
  margin-top: -10px;
  margin-left: 20px;

}

.radio-option {
  display: block;
  color: #666;
  font-size: 16px;
  margin-bottom: 10px;
}

.checkbox-option {
  display: block;
  color: #666;
  font-size: 16px;

}

.submit-button {
  text-align: center;
  margin-top: 20px;
}

.checkbox-text {
  white-space: normal;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  line-height: 1.5;
}

.checkbox-text {
  white-space: normal;
  display: inline-block;
  margin-left: 5px;
}

.completed-status {
  text-align: center;
}

/* 新增索引列表样式 */
.index-list {
  padding: 100px;
}

.index-item {
  margin-bottom: 20px;
}

.index-item .el-link {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  position: relative;
}



.index-item .el-link.answered {
  color: aqua;
}

.index-item .el-link:hover:after,
.index-item .el-link:focus:after {
  content: "";
  display: block;
  width: 50%;
  position: absolute;
  bottom: -2px;
  border-bottom: 2px solid #409eff;
  left: 50%;
  transform: translateX(-50%);
  transition: width 1s ease;
}

.fixed-index {
  position: fixed;
  top: 25px;
  bottom: 20px;
  left: 70px;
  overflow: hidden;
  /* 隐藏滚动条 */
}

.el-form {
  margin: 20px;
  /* 上下20px的边距 */
  padding: 20px;
  /* 内边距20px */
}
::v-deep .el-radio__label{
  color:white
}
::v-deep .el-checkbox__label{
  color: white;
}
.el-card{
  border: none;
}
::v-deep .el-radio__input.is-checked+.el-radio__label{
  color:aqua
}
::v-deep .el-radio__input.is-checked .el-radio__inner{
  background:aqua
}
::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
  color: aqua;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background: aqua;
}
</style>