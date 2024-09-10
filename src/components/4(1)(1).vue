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
  
            <div style="margin-top: 200px;">
                    <!-- 添加标题，绝对定位到左上角 -->
                    <div style="position:static; top: 100px; left: 0; margin: 50px;font-size:25px;">
                        <i class="el-icon-s-promotion"></i>
                        设置账户密码
                    </div>
                    <!-- 在这里添加一个空行 -->
                    <div style="height: 2rem;"></div>

                    <div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">

                       
                            <!-- 假设每个表单项的标签宽度为100px -->
                            <el-form-item label="交易密码" label-width="150px" prop="transactionpw" style="width: 500px; 
                           margin-bottom: 30px;">
                                <el-input type="password" v-model="ruleForm.transactionpw" style="flex: 1;" 
                                autocomplete="new-password"></el-input>
                            </el-form-item>

                            <el-form-item label="交易密码确认" label-width="150px" prop="transactionpwconfirmation" style="width: 500px;
                            margin-bottom: 30px;">
                                <el-input type="password" v-model="ruleForm.transactionpwconfirmation" style="flex: 1;"></el-input>
                            </el-form-item>

                            <el-form-item label="资金密码" label-width="150px" prop="fundpw" style="width: 500px;
                            margin-bottom: 30px;">
                                <el-input type="password" v-model="ruleForm.fundpw" style="flex: 1;"
                                autocomplete="new-password"></el-input>
                            </el-form-item>


                            <el-form-item label="资金密码确认" label-width="150px" prop="fundpwconfirmation" style="width: 500px;
                            margin-bottom: 30px;">
                                <el-input type="password" v-model="ruleForm.fundpwconfirmation" style="flex: 1;"></el-input>
                            </el-form-item>
                


                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>

                        </el-form-item>



                    </el-form>
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
        transactionpw: '',
        fundpw: ''
      },
      rules: {
        transactionpw: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: this.validatePassword, trigger: 'blur' }
        ],
        transactionpwconfirmation: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: this.comparePasswords, trigger: 'blur' }
         
        ],
        fundpw: [
          { required: true, message: '必填', trigger: 'blur'},
          { validator: this.validatePassword, trigger: 'blur' }
        ],
        fundpwconfirmation: [
          { required: true, message: '必填', trigger: 'blur'},
          { validator: this.comparePasswords, trigger: 'blur' }
        
        ]

      }
    }
  },
  methods: {
    // 验证密码格式的方法
    validatePassword(rule, value, callback) {
      const regex = /^\d{6}$/;
      if (regex.test(value)) {
        callback();
      } else {
        callback(new Error('密码必须为6位数字！'));
      }
    },
    // 比较密码是否一致的方法
    comparePasswords(rule, value, callback) {
      if (value !== this.ruleForm[rule.field.replace('confirmation', '')]) {
        callback(new Error('密码输入不一致'));
      } else {
        callback();
      }
    },
    // 提交表单的方法
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('密码设置成功!');
        } else {
          this.$message.error('密码设置存在错误，请根据提示修改！');
          return false;
        }
      });
    },
    // 重置表单的方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
//   methods: {
    
//     // 检查密码是否一致的方法
//     checkPasswordEquality(field, confirmationField) {
//       return this.ruleForm[field] === this.ruleForm[confirmationField];
//     },
//     submitForm(formName) {
//       let isFormValid = false;
//       this.$refs[formName].validate((valid) => {
//         if (valid) {
//           // 如果表单验证通过，检查密码是否一致
//           if (!this.checkPasswordEquality('transactionpw', 'transactionpwconfirmation')) {
//             this.$message.error('交易密码输入不一致，请重新输入！');
//             isFormValid = false;
//             return;
//           }
//           if (!this.checkPasswordEquality('fundpw', 'fundpwconfirmation')) {
//             this.$message.error('资金密码输入不一致，请重新输入！');
//             isFormValid = false;
//             return;
//           }
//           // 如果所有检查都通过，可以在这里添加提交表单的逻辑
//           isFormValid = true;
//           alert('密码设置成功!');
//         } else {
//           console.error('表单验证失败!');
//         }
//       });
//       // 如果表单验证没有通过，阻止表单提交
//       return isFormValid;
//     },
//     resetForm(formName) {
//       this.$refs[formName].resetFields();
//     }
//   }
// }  
</script>