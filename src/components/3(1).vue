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
   <div style="position: absolute; top: 250px; left: 37.5%;">
   <el-button style="width: 200px;" @click="self1">
    本人
    </el-button>
   </div>



   <div style="position: absolute; top: 250px; left: 62.5%;">
   <el-button style="width: 200px;" @click="nonself1">
    非本人
    </el-button>
   </div>

    <!-- 收益人 -->
   <div style="position: absolute; top: 680px; left: 37.5%;">
   <el-button style="width: 200px;" @click="self2">
    本人
    </el-button>
   </div>

   <div style="position: absolute; top: 680px; left: 62.5%;">
   <el-button style="width: 200px;" @click="nonself2">
    非本人
    </el-button>
   </div>



    </div>
  </el-main>
        </el-container>
    </el-container>

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