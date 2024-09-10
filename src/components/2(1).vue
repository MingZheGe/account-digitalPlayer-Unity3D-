<template>
  <el-container style="height: 100vh; solid #eee">
    <el-aside width="15vw" style="background-color: #545c64;padding: 10px">
      <el-steps :active="active" direction="vertical" finish-status="success">
        <!--<el-step title="资料录入" icon="el-icon-edit"></el-step>-->
        <el-step title="资料录入证件信息"></el-step>
        <el-step title="资料录入基本信息"></el-step>
        <el-step title="资料录入联系信息"></el-step>
        <el-step title="资料录入关联人信息"></el-step>

        <!--<el-step title="风险测评" icon="el-icon-upload"></el-step>-->
        <el-step title="风险测评答题"></el-step>
        <el-step title="风险测评测评结果"></el-step>

        <!--<el-step title="账户信息" icon="el-icon-edit"></el-step>-->
        <el-step title="开立证券账户"></el-step>
        <el-step title="存管银行签约"></el-step>
        <el-step title="设置交易账户密码"></el-step>

        <el-step title="视频录入" icon="el-icon-picture"></el-step>
        <el-step title="证件采集" icon="el-icon-picture"></el-step>
        <el-step title="签署协议" icon="el-icon-picture"></el-step>
        <el-step title="业务提交" icon="el-icon-picture"></el-step>
      </el-steps>

    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>王小虎</span>
      </el-header>
      <el-main>

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
                <el-select v-model="ruleForm.education" style="flex: 1;" placeholder="必填">
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
                <el-select v-model="ruleForm.nationality" style="flex: 1;" placeholder="必填">
                  <el-option label="中国" value="china"></el-option>
                  <el-option label="英国" value="england"></el-option>
                  <el-option label="法国" value="france"></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="demo" style="display: flex; width: 100%;">
              <el-form-item label="职业" label-width="150px" prop="vocation">
                <el-select v-model="ruleForm.vocation" style="flex: 1;" placeholder="必填">
                  <el-option label="工人" value="gongren"></el-option>
                  <el-option label="教师" value="jiaoshi"></el-option>
                  <el-option label="商人" value="shangren"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="年收入（元）" label-width="150px" prop="annualincome">
                <el-select v-model="ruleForm.annualincome" style="flex: 1;" placeholder="必填">
                  <el-option label="0——10万" value="0-10"></el-option>
                  <el-option label="10——30万" value="10-30"></el-option>
                  <el-option label="30——50万" value="30-50"></el-option>
                </el-select>
              </el-form-item>
            </div>



            <el-form-item label="是否有不良诚信记录" prop="record"
              style="position:relative; top:90px; left: 90px; margin: 10px;">
              <el-radio-group v-model="ruleForm.record">
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
                  <el-select v-model="record.type" style="width: 200px;" placeholder="请选择不良诚信记录类型"
                    class="record-select">
                    <!-- 填充下拉框选项 -->
                    <el-option label="选项1" value="1"></el-option>
                    <el-option label="选项2" value="2"></el-option>
                    <el-option label="选项3" value="3"></el-option>
                  </el-select>
                  <el-input v-model="record.remark" style="width: 400px;" placeholder="不良诚信备注"
                    class="record-input"></el-input>
                  <!-- 如果不是第一个记录，显示删除按钮 -->
                  <el-button v-if="index !== 0" type="danger" icon="el-icon-delete" @click="removeRecord(index)"
                    style="display: flex; position: relative; top:0px; left: 50px;" >
                    删除</el-button>
                </div>
               
              </div>

              <div style="display: flex;position:relative;top:260px; width: 100%;"  >
                <el-form-item label="手机号码" label-width="120px" prop="phone" style="margin-left: -210px;">
                  <el-input v-model="ruleForm.phone" style="flex: 1;" placeholder="必填"></el-input>
                </el-form-item>

                <el-form-item label="固定电话" label-width="120px" prop="fixedphone" style="margin-left: -35px;">
                  <el-input v-model="ruleForm.fixedphone" style="flex: 1; position: relative; "></el-input>
                </el-form-item>
              </div>

              <div style="display: flex;position:relative;top:280px">
              <el-form-item label="电子邮箱" label-width="120px" prop="mailbox" style="margin-left: -210px;">
                <el-input v-model="ruleForm.mailbox" class="demo" style="display: flex; width: 495px;"></el-input>
              </el-form-item>
              </div>

              <div style="display: flex;position:relative;top:300px">
              <el-form-item label="联系地址" label-width="120px" prop="calladdr" style="margin-left: -210px;">
                <el-input v-model="ruleForm.calladdr" class="demo" style="display: flex; width: 496px;"></el-input>
              </el-form-item>
            </div>

            <div style="display: flex;position:relative;top:320px">
              <el-form-item label="邮政编码" label-width="120px" prop="postcard" style="margin-left: -210px;">
                <el-input v-model="ruleForm.postcard" class="demo" style="display: flex; width: 496px;"></el-input>
              </el-form-item>
            </div>

              <!-- 原p3页面 -->
              <!-- <div style="position: relative;">
                <div style="position: absolute; top: 230px; left: 0;"  label-width="150">
                  <el-form-item label="手机号码"  prop="phone">
                    <el-input v-model="ruleForm.phone"  placeholder="必填"></el-input>
                  </el-form-item>

                  <el-form-item label="固定电话"  prop="fixedphone">
                    <el-input v-model="ruleForm.fixedphone"></el-input>
                  </el-form-item>




                  <el-form-item label="电子邮箱" prop="mailbox">
                    <el-input v-model="ruleForm.mailbox" class="demo" ></el-input>
                  </el-form-item>

                  <el-form-item label="联系地址" prop="calladdr">
                    <el-input v-model="ruleForm.calladdr" class="demo" ></el-input>
                  </el-form-item>


                  <el-form-item label="邮政编码" prop="postcard">
                    <el-input v-model="ruleForm.postcard" class="demo" ></el-input>
                  </el-form-item>
                </div>
              </div> -->
            </el-form-item>



            <!--准入验证-->
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>

          </el-form>
           <!--小标题联系信息-->
           <div style="position:relative; top: 27.5px; left: 0; margin: 10px; font-size: 25px;">
            <i class="el-icon-s-promotion"></i>
            联系信息
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>



<script>
export default {
  data() {
    return {
      ruleForm: {
        education: '',
        nationality: '',
        vocation: '',
        annualincome: '',

        record: '', // 默认为 '否'
        records: [
          { type: '', remark: '' } // 初始化一个空记录
        ],
        phone: '',

        mailbox: '',
        calladdr: '',
        postcard: ''

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
          { required: true, message: '请输入正确的手机号', trigger: 'blur' }
        ],

        mailbox: [
          { required: false, message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        calladdr: [
          { required: true, message: '请输入联系地址', trigger: 'blur' }
        ],
        postcard: [
          { required: true, message: '请输入格式正确的邮政编码', trigger: 'blur' }
        ]
      }
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
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
  }
}


</script>