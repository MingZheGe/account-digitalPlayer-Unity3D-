<template>
    <div class="container">
      <div class="content-wrapper">
        <iframe :src="currentProtocol" width="100%" height="100%" scrolling="auto" id="ifr1" ref="ifr1" @load="onIframeLoad"></iframe>
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
    props: {
        nextClick: Number
    },
    data() {
      return {
        currentIndex: 0,
        canMarkAsRead: false,
        protocols: [
          { name: '投资者风险承受能力评估问卷', file: '/投资者风险承受能力评估问卷.html' },
          { name: '投资者声明及风险揭示书', file: '/投资者基本信息表.html' },
          { name: '投资者适当性评估', file: '/投资者适当性匹配意见及风险警示确认书.html' },
          { name: '个人税收居民身份声明文件', file: '/个人税收居民身份声明文件.html' },
          { name: '个人投资者基本信息表', file: '/投资者基本信息表.html' },
          { name: '承诺书', file: '/投资者适当性匹配意见及风险警示确认书.html' },
          { name: '签署页', file: '/开户受理凭条.html' },
          { name: '评估', file: '/投资者风险承受能力评估结果告知函.html' },
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
        this.resetReadState();
      },
      previousProtocol() {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.resetReadState();
        }
      },
      nextProtocol() {
        if (this.currentIndex < this.protocols.length - 1) {
          this.currentIndex++;
          this.resetReadState();
        }
      },
      markAsRead() {
        console.log('Marked as read');
        this.nextProtocol();
      },
      resetReadState() {
        this.canMarkAsRead = false;
        this.addScrollEventListener();
      },
      addScrollEventListener() {
        const iframe = this.$refs.ifr1;
        iframe.addEventListener('load', this.onIframeLoad);
      },
      onIframeLoad() {
        const iframe = this.$refs.ifr1;
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframeDocument.addEventListener('scroll', this.checkIfScrolledToBottom);
      },
      checkIfScrolledToBottom() {
        const iframe = this.$refs.ifr1;
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const scrollHeight = iframeDocument.documentElement.scrollHeight;
        const scrollTop = iframeDocument.documentElement.scrollTop;
        const clientHeight = iframeDocument.documentElement.clientHeight;
  
        if (scrollTop + clientHeight >= scrollHeight - 1) {
          this.canMarkAsRead = true;
          iframeDocument.removeEventListener('scroll', this.checkIfScrolledToBottom);
        }
      }
    },
    mounted() {
      this.addScrollEventListener();
      const doActionTimeout = setTimeout(() => {
        wife.doAction("停止站立说话");
    }, 3000);

      wife.doAction("站立说话")
      wife.doAction("站立说话", doActionTimeout);
      let signSucc = new Audio()
     signSucc.src = require("../asset/video/13.wav")
     signSucc.play()
    },
    watch: {
        nextClick: {
            handler(newVal, oldVal) {
                this.$emit('approve', 'ok')
            },
            deep: true
        }
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
    background-color: aqua;
    color: black;
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
    background-color: #FFF;
    padding: 10px;
    border-left: 1px solid #FFF;
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
    background-color: aqua;
    color: black;
  }
  .span-a4{
    background: transparent;
    color:white;
  }
  </style>