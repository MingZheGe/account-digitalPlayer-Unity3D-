<template>
  <div class="risk-assessment">
    <div class="fixed-index">
      <el-card class="index-card" shadow="never">
        <div class="question-index">
          <el-link 
            v-for="(question, index) in questions" 
            :key="index"
            :class="{ 'answered': isQuestionAnswered(question.id), 'active': currentQuestion === index }" 
            @click="scrollToQuestion(index)"
          >
            {{ index + 1 }}
          </el-link>
        </div>
      </el-card>
    </div>

    <el-card class="box-card" shadow="hover">
      <div class="header">
        <h2>风险评测问卷</h2>
      </div>
      
      <el-form ref="form" :model="form" @submit.native.prevent="submitForm">
        <transition-group name="fade-questions" tag="div">
          <div v-for="(question, index) in questions" :key="index" class="question-item" :ref="'question' + index">
            <el-form-item :prop="question.id" :rules="{ required: true, message: '请回答此问题', trigger: 'change' }">
              <label class="question-label">{{ index + 1 }}. {{ question.text }}</label>
              <el-checkbox-group v-if="question.id === 'q12'" v-model="form[question.id]" class="checkbox-group">
                <transition-group name="fade-options" tag="div">
                  <div v-for="option in question.options" :key="option.value" class="checkbox-wrapper">
                    <el-checkbox :label="option.value" class="checkbox-option">
                      {{ option.text }}
                    </el-checkbox>
                  </div>
                </transition-group>
              </el-checkbox-group>
              <el-radio-group v-else v-model="form[question.id]" class="radio-group">
                <transition-group name="fade-options" tag="div">
                  <div v-for="option in question.options" :key="option.value" class="radio-wrapper">
                    <el-radio :label="option.value" class="radio-option">
                      {{ option.text }}
                    </el-radio>
                  </div>
                </transition-group>
              </el-radio-group>
            </el-form-item>
          </div>
        </transition-group>
        
        <el-progress :percentage="progressPercentage" :format="format" class="progress-bar"></el-progress>
        
        <el-form-item prop="confirm" :rules="{ required: true, message: '请确认信息真实性', trigger: 'change' }">
          <div class="checkbox-container">
            <el-checkbox v-model="form.confirm"></el-checkbox>
            <span class="checkbox-text">
              本人已经了解并愿意遵守国家有关证券市场管理的法律、法规、规章及相关业务规则，本人在此郑重承诺以上填写的内容真实、准确、完整并对其负责。若本人提供的信息发生任何重大变化，本人将及时书面通知贵公司。
            </span>
          </div>
        </el-form-item>
        
        <el-form-item class="button-group">
          <el-button type="primary" @click="previousQuestion" :disabled="currentQuestion === 0">上一题</el-button>
          <el-button type="primary" @click="nextQuestion" :disabled="currentQuestion === questions.length - 1">下一题</el-button>
          <el-button type="success" @click="saveProgress">保存进度</el-button>
          <el-button type="warning" @click="loadProgress">加载进度</el-button>
          <el-button type="danger" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>

      <div v-if="showResult" class="result-section">
        <h3>评估结果</h3>
        <p>您的得分: {{ score }}</p>
        <p>投资者类型: {{ investorType }}</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import { askUpload } from '../util/connect'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    form: {
      confirm: false,
      q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '',
      q11: '', q12: [], q13: '', q14: '', q15: '', q16: '', q17: '', q18: '', q19: '', q20: ''
    },
    questions: [
      // 问题数据在这里
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
    ],
    currentQuestion: 0
  },
  mutations: {
    updateForm(state, payload) {
      state.form = { ...state.form, ...payload }
    },
    setCurrentQuestion(state, index) {
      state.currentQuestion = index
    }
  },
  actions: {
    saveProgress({ state }) {
      localStorage.setItem('riskAssessmentProgress', JSON.stringify(state.form))
    },
    loadProgress({ commit }) {
      const savedProgress = localStorage.getItem('riskAssessmentProgress')
      if (savedProgress) {
        commit('updateForm', JSON.parse(savedProgress))
      }
    }
  }
})

export default {
  name: 'RiskAssessment',
  store,
  props: {
    nextClick: Number
  },

  data() {
    return {
      questions: this.$store.state.questions,
      score: 0,
      investorType: '',
      showResult: false,
      worker: null
    }
  },

  computed: {
    form: {
      get() {
        return this.$store.state.form
      },
      set(value) {
        this.$store.commit('updateForm', value)
      }
    },
    completedQuestions() {
      return Object.entries(this.form).filter(([key, value]) =>
        key !== 'confirm' && this.isQuestionAnswered(key)
      ).length
    },
    totalQuestions() {
      return this.questions.length
    },
    currentQuestion: {
      get() {
        return this.$store.state.currentQuestion
      },
      set(value) {
        this.$store.commit('setCurrentQuestion', value)
      }
    },
    progressPercentage() {
      return (this.completedQuestions / this.totalQuestions) * 100
    }
  },

  created() {
    this.initializeWorker()
  },

  mounted() {
    this.loadProgress()
    var list = [{ "quesOrder": 1, "optionCode": "A" }, { "quesOrder": 2, "optionCode": "B" }]
    askUpload("c14bd150ba12406f8eb9e689023c65e5", list)
  },

  methods: {
    initializeWorker() {
      if (typeof Worker !== 'undefined') {
        this.worker = new Worker('/scoreWorker.js')
        this.worker.onmessage = (e) => {
          this.score = e.data.score
          this.investorType = e.data.type
          this.showResult = true
        }
      } else {
        console.error('Web Workers are not supported in this environment.')
        // Fallback method for calculating score
      }
    },
    isQuestionAnswered(questionId) {
      const answer = this.form[questionId]
      return Array.isArray(answer) ? answer.length > 0 : !!answer
    },
    async submitForm() {
      try {
        await this.$refs.form.validate()
        if (this.worker) {
          this.worker.postMessage(this.form)
        } else {
          // Fallback method for calculating score
        }
        this.$message.success('评测完成！')
        this.$emit('approve', 'ok')
      } catch (error) {
        this.$message.error('请回答所有问题并确认信息真实性。')
      }
    },
    scrollToQuestion(index) {
      const question = this.$refs['question' + index]
      if (question && question[0]) {
        question[0].scrollIntoView({ behavior: 'smooth' })
      }
      this.currentQuestion = index
    },
    previousQuestion() {
      if (this.currentQuestion > 0) {
        this.scrollToQuestion(this.currentQuestion - 1)
      }
    },
    nextQuestion() {
      if (this.currentQuestion < this.questions.length - 1) {
        this.scrollToQuestion(this.currentQuestion + 1)
      }
    },
    saveProgress() {
      this.$store.dispatch('saveProgress')
      this.$message.success('进度已保存')
    },
    loadProgress() {
      this.$store.dispatch('loadProgress')
      this.$message.success('进度已加载')
    },
    format(percentage) {
      return percentage === 100 ? '已完成' : `${percentage}%`
    }
  },

  watch: {
    nextClick: {
      handler() {
        this.submitForm()
      },
      immediate: true
    }
  },

  beforeDestroy() {
    if (this.worker) {
      this.worker.terminate()
    }
  }
}
</script>

<style scoped>
.risk-assessment {
  max-width: 950px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 70px;
}

.fixed-index {
  position: fixed;
  top: 0;
  left: 57%;
  transform: translateX(-50%);
  z-index: 1000;
  background-color: #fff;
  width: 100%;
  max-width: 900px;
}

.index-card {
  margin-bottom: 0;
  border-radius: 0;
}

.question-index {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  flex-wrap: wrap; 
}

.question-index .el-link {
  margin: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  background-color: #f0f2f5;
  color: #606266;
  text-decoration: none;
}

.question-index .el-link.answered {
  background-color: #67c23a;
  color: #fff;
}

.question-index .el-link.active {
  background-color: #409eff;
  color: #fff;
}

.box-card {
  margin-bottom: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h2 {
  color: #303133;
  font-size: 24px;
}

.question-item {
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.question-label {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
  display: block;
}

.radio-group, .checkbox-group {
  display: block;
}

.radio-wrapper, .checkbox-wrapper {
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.radio-wrapper:hover, .checkbox-wrapper:hover {
  background-color: #f5f7fa;
}

.radio-option, .checkbox-option {
  display: block;
  color:#606266;
  font-size: 14px;
}
/* 单选按钮选中后的样式 */
.radio-option ::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: aqua;
}

/* 复选框选中后的样式 */
.checkbox-option ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: aqua;
}

/* 单选按钮选中后的圆点颜色 */
.radio-option ::v-deep .el-radio__input.is-checked .el-radio__inner {
  border-color: aqua;
  background: aqua;
}

/* 复选框选中后的勾选颜色 */
.checkbox-option ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: aqua;
  background-color: aqua;
}


.checkbox-container {
  display: flex;
  align-items: flex-start;
  line-height: 1.5;
  margin-top: 20px;
}

.checkbox-text {
  margin-left: 10px;
  color: #606266;
  font-size: 14px;
}

.progress-bar {
  margin-top: 20px;
}
.progress-bar  :deep() .el-progress-bar__inner {
  background-color: green;
}
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.result-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f0f9eb;
  border-radius: 4px;
}

.fade-questions-enter-active, .fade-questions-leave-active,
.fade-options-enter-active, .fade-options-leave-active {
  transition: all 0.3s;
}

.fade-questions-enter, .fade-questions-leave-to,
.fade-options-enter, .fade-options-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-questions-move, .fade-options-move {
  transition: transform 0.3s;
}
</style>