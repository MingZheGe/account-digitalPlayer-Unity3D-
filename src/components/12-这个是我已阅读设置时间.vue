<template>
  <div class="container">
    <div class="content-wrapper">
      <iframe :src="currentProtocol" width="100%" height="100%" scrolling="auto" id="ifr1"></iframe>
      <div class="button-group">
        <button @click="previousProtocol" :disabled="currentIndex === 0" class="styled-button">上一页</button>
        <button @click="markAsRead" :disabled="!canMarkAsRead" class="styled-button">我已阅读</button>
        <button @click="nextProtocol" :disabled="currentIndex === protocols.length - 1" class="styled-button">跳过</button>
      </div>
    </div>
    <div class="protocol-list">
      <div class="protocol-title">协议列表</div>
      <div 
        v-for="(protocol, index) in protocols" 
        :key="protocol.name" 
        @click="changeProtocol(index)"
        class="protocol-item"
        :class="{ 'active': currentIndex === index }"
      >
        {{ protocol.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      canMarkAsRead: false,
      protocols: [
        { name: '投资者风险承受能力评估问卷', file: '/pingguDocument.html'},
        { name: '投资者声明及风险揭示书', file: '/gerenshuishou.html' },
        { name: '投资者适当性评估', file: '/shidangxingDocument.html' },
        { name: '个人税收居民身份声明文件', file: '/shuishouDocument.html' },
        { name: '个人投资者基本信息表', file: '/gebulinDocument.html' },
        { name: '承诺书', file: '/chengshouDocument.html' },
        { name: '签署页', file: '/qianshuDocument.html' },
        { name: '评估', file: '/touzizheDocument.html' },
      ]
    }
  },
  computed: {
    currentProtocol() {
      return this.protocols[this.currentIndex].file;
    }
  },
  methods: {
    changeProtocol(index) {
      this.currentIndex = index;
      this.resetReadTimer();
    },
    previousProtocol() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.resetReadTimer();
      }
    },
    nextProtocol() {
      if (this.currentIndex < this.protocols.length - 1) {
        this.currentIndex++;
        this.resetReadTimer();
      }
    },
    markAsRead() {
      // 在这里添加标记为已读的逻辑
      console.log('Marked as read');
      this.nextProtocol();
    },
    resetReadTimer() {
      this.canMarkAsRead = false;
      setTimeout(() => {
        this.canMarkAsRead = true;
      }, 5000);
    }
  },
  mounted() {
    this.resetReadTimer();
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: 70vh;
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  margin: 10px;
  position: relative;
}

iframe {
  flex-grow: 1;
  border: none;
}

.button-group {
  display: flex;
  justify-content: center;
  padding: 10px;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.styled-button {
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.styled-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.styled-button:not(:disabled):hover {
  background-color: #357ab8;
}

.protocol-list {
  width: 200px;
  background-color: #f0f0f0;
  padding: 10px;
  border-left: 1px solid #ddd;
}

.protocol-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  background-color: #e0e0e0;
  padding: 5px;
  border-radius: 4px;
}

.protocol-item {
  padding: 8px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 4px;
}

.protocol-item:hover {
  background-color: #e0e0e0;
}

.protocol-item.active {
  background-color: #4a90e2;
  color: white;
}
</style>