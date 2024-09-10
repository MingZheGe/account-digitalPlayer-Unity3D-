<template>
  <div style="position: relative; top: 200px;">
       <!-- 添加标题，绝对定位到左上角 -->
    <div style="position:static; top: 0; left: 0; margin: 10px;">
      <i class="el-icon-s-promotion"></i>
      实际控制人信息
    </div>
 
 
    <div style="position:relative; top: 400px; left: 0; margin: 10px;">
     <i class="el-icon-s-promotion"></i>
     受益人信息
   </div>
    <!-- 在这里添加一个空行 -->
    <div style="height: 2rem;"></div>
 
    <!-- 实际控制人 -->
    <div style="position: absolute; top: 250px; left: 125px;">
    <el-button class="cyberpunk2" :class="{selected: self1 === 1, 'not-selected': self1 !== 1}" 
    style="width: 200px;height:50px;" @click="setSelf1">
     本人
     </el-button>
    </div>
 
 
 
    <div style="position: absolute; top: 250px; left: 360px;">
    <el-button class="cyberpunk2" :class="{'not-self-selected': self1 === 2}" 
    style="width: 200px;height:50px;" @click="nonself1">
     非本人
     </el-button>
    </div>
 
     <!-- 收益人 -->
    <div style="position: absolute; top: 680px; left: 125px;">
    <el-button class="cyberpunk2" :class="{selected: self2 === 1, 'not-selected': self2 !== 1}" 
    style="width: 200px;height:50px;" @click="setSelf2">
     本人
     </el-button>
    </div>
 
    <div style="position: absolute; top: 680px; left: 360px;">
    <el-button class="cyberpunk2" :class="{'not-self-selected': self2 === 2}" 
    style="width: 200px;height:50px;" @click="nonself2">
     非本人
     </el-button>
    </div>
 
 
 
     </div>
 
 
 </template>
 
 <script>
 export default {
   mounted(){
     //relatedUpload(localStorage.getItem("UserId"))
     wife.doAction("伸右手说话")
     let signSucc = new Audio()
     signSucc.src = require("../asset/video/3.wav")
     signSucc.play()
 
   },
   props: {
     nextClick: Number
   },
   data() {
     return {
       self1: 0,
       self2: 0,
       hasShownControlNotification: false, // 跟踪实际控制人弹窗状态
       hasShownBeneficiaryNotification: false, // 跟踪受益人弹窗状态
     }
   },
   methods: {
     showNotificationIfNotShown() {
       if (!this.hasShownNotification) {
         this.$notify({
           title: '提示！',
           message: '账户实际控制人不为本人，请您前往柜台办理。',
           duration: 0
         });
         this.hasShownNotification = true; // 标记通知已显示
       }
     },
     setSelf1() {
       this.self1 = 1;
       // 如果self1之前是2，重置hasShownControlNotification
       if (this.self1 === 1 && this.self1 !== 2) {
         this.hasShownControlNotification = false;
       }
     },
     setSelf2() {
       this.self2 = 1;
       // 如果self2之前是2，重置hasShownBeneficiaryNotification
       if (this.self2 === 1 && this.self2 !== 2) {
         this.hasShownBeneficiaryNotification = false;
       }
     },
     nonself1() {
       this.self1 = 2
       this.$notify({
         title: '提示！',
         message: '账户实际控制人不为本人，请您前往柜台办理。',
         duration: 0
       });
       this.showNotificationIfNotShown();
       wife.doAction("沮丧")
       let signSucc = new Audio()
     signSucc.src = require("../asset/video/4.wav")
     signSucc.play()
     },
     nonself2() {
       this.self2 = 2
       this.$notify({
         title: '提示！',
         message: '账户受益人不为本人，请您前往柜台办理。',
         duration: 0
       });
       this.showNotificationIfNotShown();
       wife.doAction("沮丧")
       let signSucc = new Audio()
     signSucc.src = require("../asset/video/5.wav")
     signSucc.play()
       
     }
 
   },
 
  
 
   watch: {
     nextClick: {
       handler(newVal, oldVal) {
         if (this.self1 == 1 && this.self2 == 1) {
           this.$emit('approve', 'ok')
 
         }
 
 
 
       },
       deep: true
     }
   }
 
 
 
 }
 
 </script>
 
 <style>
 /* 你可以在<style>标签中添加这些样式 */

 

 .not-self-selected {
   background-color: #ff4949; /* 非本人被选中的按钮背景色 */
 }
  .cyberpunk2 {
  padding: 5px;
  position: relative;
  font-size: 1.2rem;
  color: var(--yellow-color);
  border: 30px solid var(--yellow-color);
  border-right: 5px solid var(--yellow-color);
  border-left: 5px solid var(--yellow-color);
  border-bottom: 24px solid var(--yellow-color);
  clip-path: polygon(0px 25px, 26px 0px, calc(60% - 25px) 0px, 60% 10px, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) calc(100% - 10px), calc(80% - 30px) calc(100% - 10px), calc(80% - 35px) 100%, 80px calc(100% - 0px), 65px calc(100% - 15px), 0% calc(100% - 15px));

  }
 .cyberpunk2.inverse {
  border: none;
  padding: 40px 15px 30px;
  background-color: var(--yellow-color);
  border-right: 2px solid var(--border-color);
}
.el-form-item__label{
    color: aqua;
}
.el-button{
  color: #000;
}
 
 
 </style>