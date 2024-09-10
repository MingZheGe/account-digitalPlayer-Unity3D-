<template>
  <el-container style="height: 100vh; solid #eee">
    <el-aside width="15vw" style="background-color: #545c64;padding: 10px">
      <el-steps direction="vertical" finish-status="success">
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
        <div>
          <div class="prompt">请正视摄像头</div>
          <div class="camera-wrapper">
            <video ref="video" autoplay></video>
          </div>
          <div>
            <button @click="startRecognize">确认</button>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    startRecognize() {
      // 在这里实现点击确认按钮后的逻辑
      // 弹出提示框：识别中
      alert("识别中...");
    },
  },

  mounted() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.$refs.video.srcObject = stream;
    });
  }
}
</script>

<style>
.prompt {
  text-align: center;
  margin-bottom: 20px;
  font-size: 60px;
}

.camera-wrapper {
  position: relative;
  width: 600px;
  height: 700px;
  overflow: hidden;
  border-radius: 50%;
  top: center;
  left: 650px;
}

.camera-wrapper video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(3) rotate(0deg);
  width: 100%;
  height: auto;
}

.waiting {
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 50%;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.content {
  position: relative;
  top: 05%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

/*添加 新的样式 */
div button {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style> 