<template>
    
    <div>
      <!-- 添加标题，绝对定位到左上角 -->
   <div style="position:static; top: 0; left: 0; margin: 10px;">
     <i class="el-icon-s-promotion"></i>
     基本信息
   </div>
   <div style="position:relative; top: 200px; left: 0; margin: 10px;">
     <i class="el-icon-s-promotion"></i>
     诚信记录
   </div>
     <!-- 在这里添加一个空行 -->
     <div style="height: 1rem;"></div>
 
     <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
             
         <div class="demo" style="display: flex; width: 100%;">
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
 
 
 
 <el-form-item label="是否有不良诚信记录" prop="record" style="position:relative; top: 65px; left: 90px; margin: 10px;">
     <el-radio-group v-model="ruleForm.record">
       <el-radio label="是" @change="initRecords"></el-radio> <!-- 选择“是”时初始化记录 -->
       <el-radio label="否"></el-radio> <!-- 选择“否”时清空记录 -->
     </el-radio-group>
     <!-- 条件渲染不良诚信记录的表单 -->
     <div v-if="ruleForm.record === '是'">
       <div v-for="(record, index) in ruleForm.records" :key="index" style="display: flex; align-items: center;">
         <el-select v-model="record.type" placeholder="请选择不良诚信记录类型" class="record-select">
           <!-- 填充下拉框选项 -->
           <el-option label="选项1" value="1"></el-option>
           <el-option label="选项2" value="2"></el-option>
           <el-option label="选项3" value="3"></el-option>
         </el-select>
         <el-input v-model="record.remark" placeholder="不良诚信备注" class="record-input"></el-input>
         <!-- 如果不是第一个记录，显示删除按钮 -->
         <el-button v-if="index !== 0" type="danger" icon="el-icon-delete" @click="removeRecord(index)" style="display:flex">
             删除</el-button>
       </div>
       <!-- 添加按钮 -->
       <el-button type="primary" @click="addRecord">添加</el-button>
     </div>
   
 
 
 </el-form-item>
 
 
 <el-form-item>
     <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
     <el-button @click="resetForm('ruleForm')">重置</el-button>
   </el-form-item>
 
 </el-form>
         </div>
 </template>
 
 
 
 <script>
 export default {
     data() {
         return {
             ruleForm: {
                 education: '',
                 nationality: '',
                 vocation:'',
                 annualincome:'',
                 
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