<template>
  <div class="refresh_content">
    <div class="coverbox">
      <div class="refresh_box">
        <img :src="imgsrc" alt="">
        <div class="errtext">{{messageText}}</div>
        <el-button class="refresh" @click.native="reloadPage" v-if="haveButton">刷新</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default
  {
    data () {
      return {
        imgsrc:"",
        haveButton:"",
      }
    },
    components: {
    },
    props:['messageType','messageText'],
    computed: {
    },
    mounted(){
      console.log("错误的类型1111111",this.messageType);
      switch (this.messageType) {
        case "loadFail":
            this.imgsrc = require('../../icons/common/pic_no_network.svg');
            this.haveButton = true;
            break;
        case "noInfo":
            this.imgsrc = require('../../icons/common/pic_no_information.svg');
            this.haveButton = false;
            break;
      };
      // document.getElementsByClassName("coverbox")[0].setAttribute("max-height",document.body.clientHeight);
      // console.log("获取的节点高度",document.getElementsByClassName("coverbox")[0].style.height);
    },
    watch:{
      messageType:function(){
        switch (this.messageType) {
          case "loadFail":
              this.imgsrc = require('../../icons/common/pic_no_server.svg');
              this.haveButton = true;
              break;
          case "noInfo":
              this.imgsrc = require('../../icons/common/pic_no_information.svg');
              this.haveButton = false;
              break;
        };
      }
    },
    methods: {
      reloadPage() {
        this.$emit('reloadPage');
      }
    }
  };
</script>
<style lang="less">
  .refresh_content{
    position: absolute;
    top:120px;
    left: 10px;
    right: 10px;
    bottom:10px;
    border-radius: 10px;
    // width: 100%;
    // height: 100%;
    background-color: #fff;
    z-index: 100;
    .coverbox{
      width: 100%;
      height: 100%;
      max-height:768px;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .refresh_box{
        width: 8.8rem;
        .errtext{
          text-align: center;
        }
        .refresh{
          width: 8.8rem;
          height: 2.2rem;
          border: 0.5px solid #508cee;
          background-color: #fff;
          border-radius: 1.1rem;
          font-size: 16px;
          line-height: 2.2rem;
          color: #508cee;
          text-align: center;
          padding: 0px;
        }
      }
    }
  }
</style>
