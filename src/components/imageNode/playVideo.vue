<template>
  <div class="videoPlayer">
    <video-player class="vjs-custom-skin" ref="videoPlayer" 
    :options="playerOptions" 
    @timeupdate="onPlayerTimeupdate" 
    @pause="onplayerpause" 
    @play="onplayerplay"
    >
    </video-player>
  </div>
    
</template>

<script>
import 'video.js/dist/video-js.css';
import {videoPlayer} from 'vue-video-player'
export default {
  directives: {
  },
  data () {
    return {
      playerEnd:false, 
      playerOptions: {
        start: 0,
        playsinline: true,
        muted: false,
        loop:false,
        autoplay:true,
        language: 'zh-CN',
        playbackRates: [1.0, 1.25, 1.5, 1.75, 2.0],
        controlBar: {
          fullscreenToggle: false,  // 全屏按钮是否可用
          volumeMenuButton: false,  // 声音按钮是否可用
          remainingTimeDisplay: false,  // 视频倒计时是否显示
          playbackRateMenuButton: true,
        },
        sources: [{
          type: "video/mp4",
          src: this.videoUrl
        }],
        poster:this.videoScreenshot,
      },
      startX: 0,
      startY: 0,
      isPlay: true,
      videoDuration:0,
      ispause:false,
      isMousedown:false,
      isMouseup:false,
      oldTime:0,
      maxTime:0,


    }
  },
  props:['videoUrl','videoScreenshot',"cannotdrag"],
  mounted(){
    let that = this;
    let controlDomBox = document.getElementsByClassName("vjs-progress-control")[0];
    let displayDom = document.createElement("div");
    if(!this.cannotdrag){
      displayDom.className = "coverDomaa";
    }else{
      displayDom.className = "coverDom";
    }
    controlDomBox.appendChild(displayDom);
    that.$refs.videoPlayer.player.on("error",function(e){
      console.error("播放失败地址"+that.videoUrl)
      setTimeout(function(){
        that.$refs.videoPlayer.player.load();
      },1000)
    })
  },
  components: {
    videoPlayer 
  },
  computed: {
  },
  wtach:{
    cannotdrag:function(val){
      let coverDomd = document.getElementsByClassName("coverDom")[0];
      if(val){
        coverDomd.className = "coverDom";
      }else{
        coverDomd.className = "coverDomww";
      }
    }
  },
  methods: {
    onPlayerEnded() {
      console.log('player ended!')
      this.playerEnd = true;
    },
    onplayerpause(){
      // if(this.isMousedown == false) {
      //   let currenttime = this.$refs.videoPlayer.player.currentTime();
      // 　this.oldTime = currenttime;
      // }
    },
    onplayerplay(){
      // let currenttime = this.$refs.videoPlayer.player.currentTime();
      // this.isMousedown = false;
      // if(this.cannotdrag&&!this.isMouseup&&currenttime>this.oldTime){
      //   this.$refs.videoPlayer.player.currentTime(this.oldTime);
      // }
      // this.isMouseup = false;
    },
    onPlayerTimeupdate(){
    },
  }
}
</script>

<style lang="less">
.videoPlayer {
  width: 100%;
  height: 100%;
  .video-player {
    width: 100%;
    height: 100%;
    .video-js {
      width: 100%;
      height: 100%;
      .vjs-big-play-button {
        width: 2em;
        border-radius: 100px;
        margin-left:-1rem;
      }
    }
  }
  .self-node {
    position: absolute;
    position: relative;
    display: block;
    // height: 100%;
    background-color: #fff;
    border-radius: 10px;
    height:6px;
    margin: 0;
    padding: 0;
    // width: 0;
    width:10px;
    // left:47.5%;
    // left: 0;
    top: 0;
  }
  .self-control-bar-show {
    display: flex;
    opacity: 1 !important;
    transition: visibility 0.1s, opacity 0.1s;
  }
  .coverDom{
    width: 100%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1000;
  }
}

</style>
