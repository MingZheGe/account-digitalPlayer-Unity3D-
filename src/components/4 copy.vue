<template> 
    
    <div>
      <!-- 添加标题，绝对定位到左上角 -->
   <div style="position:static; top: 0; left: 0; margin: 10px;">
     <i class="el-icon-s-promotion"></i>
     实际控制人信息
   </div>


   <div style="position:relative; top: 100px; left: 0; margin: 10px;">
    <i class="el-icon-s-promotion"></i>
    受益人信息
  </div>
   <!-- 在这里添加一个空行 -->
   <div style="height: 2rem;"></div>

   <!-- 实际控制人 -->
   <div style="position: absolute; top: 30%; left: 37.5%;">
   <el-button style="width: 200px;" @click="self1">
    本人
    </el-button>
   </div>



   <div style="position: absolute; top: 30%; left: 52.5%;">
   <el-button style="width: 200px;" @click="nonself1">
    非本人
    </el-button>
   </div>

    <!-- 收益人 -->
   <div style="position: absolute; top: 48.5%; left: 37.5%;">
   <el-button style="width: 200px;" @click="self2">
    本人
    </el-button>
   </div>

   <div style="position: absolute; top: 48.5%; left: 52.5%;">
   <el-button style="width: 200px;" @click="nonself2">
    非本人
    </el-button>
   </div>



    </div>

</template>

<script>
export default {
    methods: {
        nonself1() {
        this.$notify({
          title: '提示！',
          message: '账户实际控制人不为本人，请您前往柜台办理。',
          duration: 0
        });
      },
      nonself2() {
        this.$notify({
          title: '提示！',
          message: '账户受益人不为本人，请您前往柜台办理。',
          duration: 0
        });
      }
        
    },


}
    
</script>