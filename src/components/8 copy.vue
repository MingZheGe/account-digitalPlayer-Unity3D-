<template>
    <div>
                     <h1>存管银行签约</h1>
                     <div>
                         <p class="choose">请选择签约银行：</p>
                         <div class="container">
                             <!-- Iterate over banks and show a dialog on button click -->
                             <el-dialog :visible.sync="dialogVisible" @open="resetForm" >
     <span slot="title">
         <span>选择银行</span>
         <span style="float: right; margin-top: -3px;">
             <i class="el-dialog__headerbtn el-icon-close" @click="dialogVisible = false"></i>
         </span>
     </span>
                                 <div class="bank-dialog">
                                     <div v-for="bank in banks" :key="bank.id" @click="selectBank(bank.id)" 
                                         :class="{ selected: selectedBank === bank.id }">
                                         <img v-if="bank.id === 1" src="../asset/image/bj.png" alt="Bank Image">
                                         <img v-if="bank.id === 2" src="../asset/image/gh.png" alt="Bank Image">
                                         <img v-if="bank.id === 3" src="../asset/image/zx.png" alt="Bank Image">
                                         <img v-if="bank.id === 4" src="../asset/image/gd.png" alt="Bank Image">
                                         <img v-if="bank.id === 5" src="../asset/image/zh.png" alt="Bank Image">
                                         <img v-if="bank.id === 6" src="../asset/image/nb.png" alt="Bank Image">
                                         <img v-if="bank.id === 7" src="../asset/image/hx.png" alt="Bank Image">
                                         <img v-if="bank.id === 8" src="../asset/image/jt.png" alt="Bank Image">
                                         <img v-if="bank.id === 9" src="../asset/image/js.png" alt="Bank Image">
                                         <img v-if="bank.id === 10" src="../asset/image/ms.png" alt="Bank Image">
                                         <img v-if="bank.id === 11" src="../asset/image/ny.png" alt="Bank Image">
                                         <img v-if="bank.id === 12" src="../asset/image/nj.png" alt="Bank Image">
                                         <img v-if="bank.id === 13" src="../asset/image/gf.png" alt="Bank Image">
                                         <img v-if="bank.id === 14" src="../asset/image/pf.png" alt="Bank Image">
                                         <img v-if="bank.id === 15" src="../asset/image/p'an.png" alt="Bank Image">
                                         <img v-if="bank.id === 16" src="../asset/image/sh.png" alt="Bank Image">
                                         <img v-if="bank.id === 17" src="../asset/image/sf.png" alt="Bank Image">
                                         <img v-if="bank.id === 18" src="../asset/image/xy.png" alt="Bank Image">
                                         <img v-if="bank.id === 19" src="../asset/image/yc.png" alt="Bank Image">
                                         <img v-if="bank.id === 20" src="../asset/image/zs.png" alt="Bank Image">
                                         {{ bank.name }}
                                     </div>
                                 </div>
                             </el-dialog>
                             <button @click="dialogVisible = true" class="choose-button">选择银行</button>
                         </div>
                         <!-- Form to input bank card number -->
                         <form @submit.prevent="submitForm" v-if="selectedBank">
                             <h3>已选择银行：{{ selectedBankName }}</h3>
                             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                                 <el-form-item label="请输入银行卡账号：" prop="bankcardid">
                                     <el-input v-model="ruleForm.bankcardid"></el-input>
                                 </el-form-item>
                             </el-form>
                             <button type="submit">确认签约</button>
                         </form>
                     </div>
                 </div>
 </template>
 
 
 
 
 <script>
 import {bindbank} from '../util/connect'
 
 export default {
     data() {
         return {
             banks: [
                 { id: 1, name: '北京银行存管' },
                 { id: 2, name: '工行存管' },
                 { id: 3, name: '中信存管' },
                 { id: 4, name: '光大存管' },
                 { id: 5, name: '中行存管' },
                 { id: 6, name: '宁波银行存管' },
                 { id: 7, name: '华夏存管' },
                 { id: 8, name: '交行存管' },
                 { id: 9, name: '建行存管' },
                 { id: 10, name: '民生存管' },
                 { id: 11, name: '农行存管' },
                 { id: 12, name: '南京银行存管' },
                 { id: 13, name: '广发存管' },
                 { id: 14, name: '浦发存管' },
                 { id: 15, name: '平安银行存管' },
                 { id: 16, name: '上行存管' },
                 { id: 17, name: '深发存管' },
                 { id: 18, name: '兴业存管' },
                 { id: 19, name: '邮储银行存管' },
                 { id: 20, name: '招行存管' }
             ],
             dialogVisible: false,
             showError: false,
             selectedBank: null,
             accountNumber: '',
             ruleForm: {
                 bankcardid: ''
             },
             rules: {
       bankcardid: [
         { required: true, message: '必填', trigger: 'blur' },
         {
           validator: (rule, value, callback) => {
             if (!/^\d{16,19}$/.test(value)) {
               callback(new Error('请输入正确的银行卡号'));
             } else {
               callback();
             }
           },
           trigger: 'blur'
         }
       ]
     }
     
             
         };
        
     },
     computed: {
         selectedBankName() {
             return this.banks.find(bank => bank.id === this.selectedBank).name;
         }
     },
     mounted() {
          bindbank("fcd8a87fd36b4bebbacb4b64cd7723fb","123456541233212345","中信存管")

     },
     methods: {
     selectBank(id) {
         this.selectedBank = id;
         this.ruleForm.bankcardid = ''; // 选择银行后重置银行卡账号
         this.dialogVisible = false; // Close the dialog after bank selection
         this.resetForm(); // Reset the form on bank selection
     },
     resetForm() {
         this.ruleForm.bankcardid = ''; // Reset form fields
     },
    //  mounted() {
    //     alert("hhh")
    
    //       bindbank("c14bd150ba12406f8eb9e689023c65e5","123456541233212345","中信存管")

    //  },
 
     submitForm() {
         // 表单验证逻辑
         if (this.ruleForm.bankcardid) {
             // 提交表单逻辑
             console.log('选择的银行：' + this.selectedBankName);
             console.log('银行卡账号：' + this.ruleForm.bankcardid);
            //  bindbank("localStorage.getItem("UserId")","this.ruleForm.bankcardid","this.selectedBankName")
         } else {
             console.log('请填写银行卡账号');
         }
     }
     
 }
 
 };
 </script>
 
 <style scoped>
 h1 {
     text-align: center;
     font-size: 50px;
 }
 
 h3 {
     display: flex;
     justify-content: center;
     align-items: center;
     font-size: 35px;
     white-space: nowrap;
 }
 
 .container {
     display: flex;
     justify-content: center;
     align-items: center;
     flex-wrap: wrap;
     justify-content: flex-start;
     height: 700px;
 }
 
 button {
     flex: 0 0 35%;
     /* 设置按钮宽度为固定的百分比值，以便每行放置四个按钮 */
     padding-bottom: 25px;
     padding-top: 20px;
     padding-left: 30px;
     padding-right: 0px;
     background-color: #007bff;
     color: #fff;
     border: none;
     cursor: pointer;
     margin: 20px 0px;
     /* 调整按钮之间的垂直间距 */
     margin-left: 100px;
     font-size: 30px;
     text-align: left;
     width: 50%;
 }
 
 button.selected {
     background-color: #28a745;
 }
 
 form {
     max-width: 300px;
     margin: 0 auto;
 }
 
 label {
     display: block;
     margin: 20px;
     margin-left: 0%;
     font-size: 30px;
     white-space: nowrap;
     label-font-size: 30px;
 }
 
 input {
     width: 100%;
     padding: 8px;
     margin: 10px;
     margin-left: 0%;
     font-size: 30px;
     box-sizing: border-box;
     /* 包含padding和border在内的盒模型计算 */
 }
 
 
 button[type="submit"] {
     padding: 10px 16px;
     background-color: #007bff;
     color: #fff;
     border: none;
     cursor: pointer;
     font-size: 20px;
     display: block;
     margin: 0 auto;
     /* 将按钮水平居中 */
     margin-top: 50px;
     text-align: center;
     /* 设置按钮与上方元素的垂直间距 */
 }
 
 .account-label {
     font-size: 30px;
     margin-bottom: 10px;
 }
 
 
 .choose {
     font-size: 35px;
     margin-bottom: 20px;
     text-align: center;
 }
 
 .input-container {
     position: relative;
     width: 400px;
 }
 
 .error-message {
     position: absolute;
     top: 30px;
     left: 0;
     color: red;
     font-size: 18px;
 }
 
 .account-label {
     font-size: 20px;
     margin-bottom: 10px;
 }
 
 .demo-ruleForm{
     font-size: 20px;
 }
 
 .el-form-item__label{
     font-size: 20px;
 }
 
 .bank-info img {
     width: 50px;
     height: 50px;
     margin-right: 10px;
 }
 
 .container img {
     width: 50px;
     height: 50px;
     margin-bottom: -12px;
     justify-content: flex-start;
 }
 .bank-dialog {
     display: flex;
     flex-wrap: wrap;
     justify-content: flex-start;
 }
 .bank-dialog div {
     flex: 0 0 35%; /* Adjust the width as needed */
     cursor: pointer;
     text-align: center;
     margin: 10px;
 }
 .choose-button {
     background-color: #007bff;
     color: #fff;
     border: none;
     cursor: pointer;
     font-size: 20px;
     text-align: center;
     padding: 10px 20px;
     margin: 0 auto;
 }
 .choose-button:hover {
     background-color: #0056b3;
 }
 
 .el-dialog__headerbtn.el-icon-close {
   /* Remove the font-family style */
   font-family:none;
 }
 
 </style>