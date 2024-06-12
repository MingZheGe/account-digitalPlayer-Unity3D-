<template>
    <div>
      <div class="prompt">请正视摄像头</div>
      <div class="camera-wrapper">
        <video ref="video" autoplay></video>
      </div>
      <div>
        <button @click="startRecognize">确认</button>
      </div>
    </div>
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