<template>
   <div style="position:relative;top: 200px;" >
          <!-- 小标题基本信息 -->
          <div style="position:static; top: 0; left: 0; margin: 10px; font-size: 25px;">
            <i class="el-icon-s-promotion"></i>
            基本信息
          </div>
          <!--小标题诚信记录-->
          <div style="position:relative; top: 200px; left: 0; margin: 10px; font-size: 25px;">
            <i class="el-icon-s-promotion"></i>
            诚信记录
          </div>
       
         

         
          <!--主题输入框-->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">

            <div class="demo" style="display: flex;position: relative;top: 5px; width: 100%;">
              <el-form-item label="学历" label-width="150px" prop="education">
                <el-select class="cyberpunk" v-model="ruleForm.education" style="flex: 1;" placeholder="必填">
                  <el-option label="博士" value="boshi"></el-option>
                  <el-option label="硕士" value="shuoshi"></el-option>
                  <el-option label="本科" value="benke"></el-option>
                  <el-option label="大专" value="dazhuan"></el-option>
                  <el-option label="中专" value="zhongzhuan"></el-option>
                  <el-option label="高中" value="gaozhong"></el-option>
                  <el-option label="初中及以下" value="chuzhong"></el-option>
                  <el-option label="其他" value="qita"></el-option>
                </el-select>
              </el-form-item>


              <el-form-item label="国籍" label-width="150px" prop="nationality">
                <el-select class="cyberpunk" v-model="ruleForm.nationality" disabled style="flex: 1;" placeholder="必填">
                  <el-option label="中国" value="china"></el-option>
                  <el-option label="英国" value="england"></el-option>
                  <el-option label="法国" value="france"></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="demo" style="display: flex; width: 100%;">
              <el-form-item label="职业" label-width="150px" prop="vocation">
                <el-select class="cyberpunk" v-model="ruleForm.vocation" style="flex: 1;" placeholder="必填">
                  <el-option label="党政机关负责人及管理人员" value="po1"></el-option>
                  <el-option label="企事业单位负责人及管理人员" value="po2"></el-option>
                  <el-option label="民主党派和工商联负责人及管理人员" value="po3"></el-option>
                  <el-option label="人民团体或群众团体负责人及管理人员" value="po4"></el-option>
                  <el-option label="社会组织（社会团体、基金会、社会服务机构、外国商会等）负责人及管理人员" value="po5"></el-option>
                  <el-option label="科学研究及教学人员" value="po6"></el-option>
                  <el-option label="文学艺术、体育专业人员" value="po7"></el-option>
                  <el-option label="新闻出版、文化专业人员" value="po8"></el-option>
                  <el-option label="卫生专业技术人员" value="po9"></el-option>
                  <el-option label="工程、农业专业人员" value="po10"></el-option>
                  <el-option label="法律、会计、审计、税务专业人员" value="po12"></el-option>
                  <el-option label="证券从业人员" value="po13"></el-option>
                  <el-option label="经济和金融专业人员" value="po14"></el-option>
                  <el-option label="宗教人士等特殊职业人员" value="po15"></el-option>
                  <el-option label="其他专业技术人员" value="po16"></el-option>
                  <el-option label="党政机关、企事业单位行政工作人员" value="po17"></el-option>
                  <el-option label="民主党派、工商联、人民团体或社会组织等单位工作人员" value="po18"></el-option>
                  <el-option label="人民警察、消防、应急救援人员" value="po19"></el-option>
                  <el-option label="批发与零售服务人员" value="po20"></el-option>
                  <el-option label="房地产服务人员" value="po21"></el-option>
                  <el-option label="旅游、住宿和餐饮服务人员" value="po22"></el-option>
                  <el-option label="珠宝、黄金等贵金属行业服务人员" value="po23"></el-option>
                  <el-option label="文化、体育和娱乐服务人员" value="po24"></el-option>
                  <el-option label="典当、拍卖行业服务人员" value="po25"></el-option>
                  <el-option label="艺术品或文物收藏行业服务人员" value="po26"></el-option>
                  <el-option label="废品、旧货回收服务人员" value="po27"></el-option>
                  <el-option label="交通运输、仓储、邮政业服务人员" value="po28"></el-option>
                  <el-option label="信息运输、软件和信息技术服务人员" value="po29"></el-option>
                  <el-option label="居民、健康服务人员" value="po30"></el-option>
                  <el-option label="其他社会生产和社会服务人员" value="po31"></el-option>
                  <el-option label="农、林、牧、渔业生产及辅助人员" value="po32"></el-option>
                  <el-option label="生产制造及有关人员" value="po33"></el-option>
                  <el-option label="军人" value="po34"></el-option>
                  <el-option label="国际组织工作人员" value="po35"></el-option>
                  <el-option label="离退休人员" value="po36"></el-option>
                  <el-option label="个体工商户（含淘宝店自营等）" value="po37"></el-option>
                  <el-option label="无业" value="po38"></el-option>
                  <el-option label="学生" value="po39"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="年收入（元）" label-width="150px" prop="annualincome">
                <el-select class="cyberpunk" v-model="ruleForm.annualincome" style="flex: 1;" placeholder="必填">
                  <el-option label="0——10万" value="0-10"></el-option>
                  <el-option label="10——30万" value="10-30"></el-option>
                  <el-option label="30——50万" value="30-50"></el-option>
                  <el-option label="50——100万" value="50-100"></el-option>
                  <el-option label="100——200万" value="100-200"></el-option>
                  <el-option label="200——500万" value="200-500"></el-option>
                  <el-option label="500万以上" value="500"></el-option>
                </el-select>
              </el-form-item>
            </div>



            <el-form-item label="是否有不良诚信记录" prop="record"
              style="position:relative; top:90px; left: 90px; margin: 10px;">
              <el-radio-group v-model="ruleForm.record" >
                <el-radio label="是" @change="initRecords"></el-radio> <!-- 选择“是”时初始化记录 -->
                <el-radio label="否"></el-radio> <!-- 选择“否”时清空记录 -->
              </el-radio-group>
              <!-- 条件渲染不良诚信记录的表单 -->
              <div v-if="ruleForm.record === '是'">
                 <!-- 添加按钮 -->
                 <el-button type="primary" @click="addRecord" style="display: flex; position: relative; top: -38.5px;left: 140px;">
                  添加</el-button>
                <div v-for="(record, index) in ruleForm.records" :key="index"
                  style="display: flex; position: relative;top: 20px;left: -150px; margin-top: 10px;margin-left: 10px;" >
                  <el-select class="cyberpunk" v-model="record.type" style="width: 200px;" placeholder="请选择不良诚信记录类型">
                    <!-- 填充下拉框选项 -->
                    <el-option label="证券经营机构内部诚信记录" value="section1"></el-option>
                    <el-option label="中国人民银行征信中心" value="section2"></el-option>
                    <el-option label="最高人民法院失信被执行人名单" value="section3"></el-option>
                    <el-option label="工商行政管理机构" value="section4"></el-option>
                    <el-option label="税务管理机构" value="section5"></el-option>
                    <el-option label="监管机构、自律组织" value="section6"></el-option>
                    <el-option label="恶意维权等不当行为信息" value="section7"></el-option>
                    <el-option label="其他" value="section8"></el-option>
                  </el-select>
                  <el-input class="cyberpunk" v-model="record.remark" style="width: 400px;" placeholder="不良诚信备注"></el-input>
                  <!-- 如果不是第一个记录，显示删除按钮 -->
                  <el-button v-if="index !== 0" type="danger" icon="el-icon-delete" @click="removeRecord(index)"
                    style="display: flex; position: relative; top:0px; left: 50px;" >
                    删除</el-button>
                </div>
               
              </div>

              <div style="display: flex;position:relative;top:260px; width: 100%;"  >
                <el-form-item label="手机号码" label-width="120px" prop="phone" style="margin-left: -210px;">
                  <el-input class="cyberpunk" v-model="ruleForm.phone" style="flex: 1;" placeholder="必填"></el-input>
                </el-form-item>

                <el-form-item label="固定电话" label-width="120px" prop="fixedphone" style="margin-left: -35px;">
                  <el-input class="cyberpunk" v-model="ruleForm.fixedphone" style="flex: 1; position: relative; "></el-input>
                </el-form-item>
              </div>

              <div style="display: flex;position:relative;top:280px">
              <el-form-item label="电子邮箱" label-width="120px" prop="mailbox" style="margin-left: -210px;">
                <el-input class="cyberpunk" v-model="ruleForm.mailbox"  style="display: flex; width: 495px;"></el-input>
              </el-form-item>
              </div>

              <div style="display: flex;position:relative;top:300px">
              <el-form-item label="联系地址" label-width="120px" prop="calladdr" style="margin-left: -210px;">
                <el-input class="cyberpunk" v-model="ruleForm.calladdr"  style="display: flex; width: 496px;" placeholder="必填"></el-input>
              </el-form-item>
            </div>

            <div style="display: flex;position:relative;top:320px">
              <el-form-item label="邮政编码" label-width="120px" prop="postcard" style="margin-left: -210px;">
                <el-input class="cyberpunk" v-model="ruleForm.postcard"  style="display: flex; width: 496px;" placeholder="必填"></el-input>
              </el-form-item>
            </div>
            </el-form-item>



            <!-- 准入验证
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item> -->

          </el-form>
           <!--小标题联系信息-->
           <div style="position:relative; top: 27.5px; left: 0; margin: 10px; font-size: 25px;">
            <i class="el-icon-s-promotion"></i>
            联系信息
          </div>
        </div>
</template>
 
 
 
<script>
import {basicUpload,basicGet,contactUpload,contactGet}  from '../util/connect'
export default {
  mounted() {
    //basicGet(localStorage.getItem("UserId"))
    //contactGet(localStorage.getItem("UserId"))
    wife.doAction("伸右手说话");
    let signSucc = new Audio()
    signSucc.src = require("../asset/video/2.wav")
    signSucc.play()
  },

  props: {
    nextClick: Number
  },
  data() {
    return {
      ruleForm: {
        education: '',
        nationality: '中国',
        vocation: '',
        annualincome: '',
        phone: '',
        fixedphone: '',
        mailbox: '',
        calladdr: '',
        postcard: '',

        record: '', // 默认为 '否'
        records: [
          { type: '', remark: '' } // 初始化一个空记录
        ]

      },
      isLongTerm: false,
      rules: {
        education: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        nationality: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        vocation: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        annualincome: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        record: [
          { required: true, message: '必选', trigger: 'change' }
        ],
        phone: [
        { required: true, message: '请输入正确的手机号', trigger: 'blur' },
        { validator: this.validatePhone, trigger: 'blur' }
        ],
        /*
        fixedphone: [
          { required: false, message: '', trigger: 'blur' }
        ],
        */
        mailbox: [
          { required: false, message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        calladdr: [
          { required: true, message: '请输入联系地址', trigger: 'blur' }
        ],
        postcard: [
        { required: true, message: '请输入格式正确的邮政编码', trigger: 'blur' },
        { validator: this.validatePostcard, trigger: 'blur' }
        ]
      }
    };
  },

  methods: {
    validatePhone(rule, value, callback) {
      if (!value) {
        callback(new Error('手机号码不能为空'));
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('手机号码格式不正确'));
      } else {
        callback();
      }
    },
    validatePostcard(rule, value, callback) {
      // 假设邮政编码格式为5位数字
      const postcardRegex = /^\d{5}$/;
      if (value === '') {
        callback(new Error('邮政编码不能为空'));
      } else if (!postcardRegex.test(value)) {
        callback(new Error('邮政编码格式不正确'));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
       // basicUpload(localStorage.getItem("UserId"), "测试","测试")
       //contactUpload(localStorage.getItem("UserId"), "测试","测试")
        if (valid) {
          alert('提交成功');
          this.$emit('approve', 'ok')
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    initRecords() {
      if (this.ruleForm.record === '是' && this.ruleForm.records.length === 0) {
        this.ruleForm.records.push({ type: '', remark: '' }); // 初始化一个不良诚信记录
      }
    },
    addRecord() {
      this.ruleForm.records.push({ type: '', remark: '' }); // 添加新的不良诚信记录
    },
    removeRecord(index) {
      this.ruleForm.records.splice(index, 1); // 删除指定索引的不良诚信记录
    }
  },
  watch: {
    nextClick: {
      handler(newVal, oldVal) {
        this.submitForm('ruleForm')

      },
      deep: true
    }
  }
}


</script>

<style >
.cyberpunk {
  padding: 5px;
  position: relative;
  font-size: 1.2rem;
  color: var(--yellow-color);
  border: 30px solid var(--yellow-color);
  border-right: 5px solid var(--yellow-color);
  border-left: 5px solid var(--yellow-color);
  border-bottom: 24px solid var(--yellow-color);
  background-color: #000;
  clip-path: polygon(0px 25px, 26px 0px, calc(60% - 25px) 0px, 60% 10px, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) calc(100% - 10px), calc(80% - 30px) calc(100% - 10px), calc(80% - 35px) 100%, 80px calc(100% - 0px), 65px calc(100% - 15px), 0% calc(100% - 15px));

  }
.cyberpunk.inverse {
  border: none;
  padding: 40px 15px 30px;
  color: #000;
  background-color: var(--yellow-color);
  border-right: 2px solid var(--border-color);
}

</style>