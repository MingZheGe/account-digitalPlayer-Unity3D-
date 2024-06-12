<template>
    <div>
      <div style="display: flex; align-items: center; justify-content: center; height: 10vh;">
        <p style="font-size: 60px; position: fixed; top: 5%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">请将身份证放置于NFC读取区域</p>
         <div  class="id-card-container">
          <div class="id-card">
           <div class="placeholder" :style="{ transform: `scale(${scale})` }"></div>
            <!-- 在这里添加动态图 -->
            <img :src="src" :style="{ filter: isReading ? '' : '' }" alt="Dynamic Image" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" v-if="showDynamicImage" />
          </div>
        </div>
      </div>
      <button @click="startReading" style="position: fixed; bottom: 20px; right: 20px;">确认</button>
      <div class="reading-indicator" v-if="isReading" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);">正在读取身份证信息...</div>
    </div>
  
  </template>
  
  <script>
  export default {
    data() {
      return {
        isReading: false, // 是否正在读取身份证信息
        scale: 1, // 动画缩放比例
        src: '/IDcard.jpg', // 动态图的路径
        showDynamicImage: true, // 是否显示动态图
      };
    },
    methods: {
      /**
       * 对身份证动画进行初始化和设置
   */
          animateCard() {
        const scaleStart = 1;
        const scaleEnd = 0.5;
        const duration = 1000;
        const easing = 'ease-in-out';
  
        const animation = {
          from: { transform: `scale(${scaleStart})` },
          to: { transform: `scale(${scaleEnd})` },
          duration,
          easing
        };
  
        const idCard = document.querySelector('.id-card .placeholder');
        idCard.animate(animation);
      },
      startReading() {
        this.isReading = true;
        this.showDynamicImage = true;
        this.showMask = true;
        // 在这里添加读取身份证信息的代码
        // 更改动态图的路径为loading.jpg
        this.src = '/loading.jpg';
      },
      toggleMask() {
        this.showMask = !this.showMask;
      }
    },
    mounted() {
      this.animateCard();
    }
  };
  </script>
  
  <style>
  .reading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    margin-top: 100%;
  }
  .id-card-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100vh;
  }
  
  .id-card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  </style>