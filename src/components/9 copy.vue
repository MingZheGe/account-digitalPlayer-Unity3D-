<template> 
    
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
mounted() {
wife.doAction("伸右手说话")
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
wife.doAction("沮丧");
} else {
callback();
}
},
// 提交表单的方法
submitForm(formName) {
this.$refs[formName].validate((valid) => {
if (valid) {
  alert('密码设置成功!');
  wife.doAction("开心");
} else {
  this.$message.error('密码设置存在错误，请根据提示修改！');
  wife.doAction("沮丧");
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