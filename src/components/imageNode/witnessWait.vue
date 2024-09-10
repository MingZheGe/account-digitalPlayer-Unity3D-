<!-- 
    若当前签入的客户只有一个，排队服务器不会返回207，即不会更新当前waitNum，此种情况videoQueue中使用默认值0，
    若当前签入的客户大于一个，排队服务器返回207代码，附带的返回数据中waitNum是当前签入的客户数减去1的，
    综上，本页面中显示的witnessNum需要加上1才符合正常逻辑。
 -->
<template>
    <div class="waitConnect">
      <div class="loadingNum">
        <img src="../../icons/common/witness.svg" alt="">
      </div>
    <div class="loadingLog" v-show="showLoading">
        <img class="loadingImage" src="../../icons/common/loading-white.svg" alt="">
      </div>
      <div class="promptInfo">
      <p class="textOne" v-show="!showLoading">您当前排在第<span>{{witnessNum}}</span>位</p>
        <p class="textTwo">{{prompText}}</p>
      </div>
    <div class="btn-group">
      <el-button class="requeue-btn" @click.native="requeue">重新排队</el-button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
  },
  created () {
  },
  data () {
    return {
      prompText:"",
      witnessNum:0,
      showLoading:false
    }
  },
  props:["waitNum"],
  mounted(){
    let that = this;
    if(that.waitNum){
      that.witnessNum = that.waitNum;
    }else{
      that.showLoading = true;
      that.prompText = "正在连接，请稍候！"
      setTimeout(function(){
        console.log("当前排队等待的人数",that.waitNum + 1)
        that.showLoading = false;
          that.witnessNum = that.waitNum + 1;
      },5000)
    }
  },
  components: {
  },
  deactivated () {
  },
  destroyed(){
  },
  computed:{

  },
  watch:{
    waitNum:function(val){
      this.witnessNum = this.waitNum + 1;
    },
    witnessNum:function(val){
      if(this.witnessNum>2){
        this.prompText = "我们正在飞速赶来，请您稍候，并做好视频准备。";
      }else if(this.witnessNum>0){
        this.prompText = "千万别走开，我们马上为您连通视频，请做好视频准备。";
      };
    }
  },
  methods: {
    // 关闭排队重新启动
    requeue(){
      let that = this;
      that.showLoading = true;
      that.prompText = "正在连接，请稍候！"
      that.$store.commit(that.$types.UPDATE_IMAGE_NODE_SET,false);
      // 关掉后要设置延迟才能启动，不然关闭无效，不会触发相应逻辑。里面那个setTimeout是为了等待排队的响应
      setTimeout(()=>{
        that.$store.commit(that.$types.UPDATE_IMAGE_NODE_SET,true);
        setTimeout(function(){
          that.showLoading = false;
            that.witnessNum = that.waitNum + 1;
        },5000)
      },2000);
    }
  }
}
</script>
<style lang="less">
  .waitConnect{
    width:100%;
    .loadingNum{
      height:250px;
      width:100%;
      text-align: center;
      color:#fff;
      .number{
        font-size:72px;
        line-height:80px;
      }
      .unit{
        font-size:42px;
        line-height:60px;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
    .loadingLog{
      width:72px;
      height:72px;
      left: 50%;
      margin-left: -36px;
      position:relative;
      margin-top:50px;
      .loadingImage{
        width: 100%;
        height: 100%;
        left: 0;
        top:0;
        position: absolute;
        animation:rotation 0.75s infinite steps(10);
        -moz-animation:rotation 0.75s infinite steps(10); /* Firefox */
        -webkit-animation:rotation 0.75s infinite steps(10); /* Safari and Chrome */
        -o-animation:rotation 0.75s infinite steps(10); /* Opera */
      }
    }
    .promptInfo{
      text-align:center;
      color:#FFFFFF;
      margin-top: 20px;
      .textOne{
        font-size:42px;
        line-height:60px;
        letter-spacing: 3px;
        margin: 0;
        span{
          font-size:72px;
          line-height:80px;
          margin: 10px;
        }
      }
      .textTwo{
        font-size:24px;
        line-height:56px;
      }
    }
  .btn-group{
        text-align: center;
    margin-top: 50px;
    .requeue-btn{
        width:162px;
        height:54px;
        font-size:24px;
        color:#fff;
      border: #4a90e2;
        background-image: linear-gradient(90deg, #4A90E2 0%, #497EE7 100%);
        box-shadow: 0 8px 20px 0 rgba(0,0,0,0.25);
        border-radius: 100px;
    }
  }
}
@-webkit-keyframes rotation{
  from { -webkit-transform: none; }
  to { -webkit-transform: rotate(360deg); }
}
@keyframes rotation{
  from {transform: none; }
  to {transform: rotate(360deg); }
}
</style>
