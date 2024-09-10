<template>
    <div class="container">
      <p class="scan-instruction" v-if="showInstructionText">
        请扫描:居民身份证(请将证件横向放入扫描箱)
      </p>
      <div class="image-container" v-if="showText">
        <p class="text-center">{{ instructionText }}</p>
      </div>
      <div class="camera-wrapper" v-if="showText">
        <video ref="video" autoplay></video>
      </div>
      <div v-if="showText" class="button-container">
        <button @click="confirmAndToggle">确认</button>
      </div>
      <div class="images-container" v-if="!showText">
        <div class="image-container">
          <img src="../asset/image/front.jpg" alt="Front Image" @click="toggleImagesAndText('front')" />
        </div>
        <div class="image-container">
          <img src="../asset/image/back.jpg" alt="Back Image" @click="toggleImagesAndText('back')" />
        </div>
      </div>
    </div>
  </template>
  
  
  
  <script>
  export default {
    data() {
      return {
        showText: false,
        showInstructionText: true,
        videoStream: null,
        instructionText: "请将身份证正面向上放入扫描箱"
      };
    },
    methods: {
      toggleImagesAndText(type) {
        if (type === 'front') {
          this.showText = true;
          this.showInstructionText = false;
          this.instructionText = "请将身份证正面正面向上放入扫描箱";
          this.startVideo();
        } else if (type === 'back') {
          this.showText = true;
          this.showInstructionText = false;
          this.instructionText = "请将身份证背面正面向上放入扫描箱";
          this.startVideo();
        }
      },
      confirmAndToggle() {
        this.stopVideo();
        this.showText = false;
        this.showInstructionText = true;
      },
      startVideo() {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            this.videoStream = stream; // Save the stream to access it later
            this.$refs.video.srcObject = stream;
          })
          .catch(error => {
            console.error("Error accessing camera: ", error);
          });
      },
      stopVideo() {
        if (this.videoStream) {
          let tracks = this.videoStream.getTracks();
          tracks.forEach(track => track.stop());
          this.videoStream = null; // Reset the stream
        }
      }
    },
    mounted() {
      // Video starts initially only if showText is true
      if (this.showText) {
        this.startVideo();
      }
    },
    beforeDestroy() {
      // Clean up - stop video when component is destroyed
      this.stopVideo();
    }
  };
  
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    flex-direction: column; /* Arrange items in a column */
  }
  
  .scan-instruction {
    font-size:40px;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .images-container {
    display: flex; /* Arrange images side by side */
    justify-content: center;
    align-items: center;
  }
  
  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 10px; /* Add some margin between images */
  }
  
  .image-container img {
    width: 400px;
    height: 250px;
    cursor: pointer;
  }
  
  .text-center {
    position: absolute;
    top: 10%;
    left: 13%;
    right: 0;
    text-align: center; /* Center text horizontally */
    font-size: 50px;
    margin: 0;
  }
  
  .camera-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40%; /* Set width to 40% of the container */
    height: 40%; /* Set height to 40% of the container */
  }
  
  .camera-wrapper video {
    width: 100%; /* Let the video fill its parent container */
    height: 100%; /* Let the video fill its parent container */
    object-fit: cover; /* Keep video aspect ratio and fill the area */
  }
  
  .button-container {
    margin-top: 20px; /* Add some space above the button */
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  