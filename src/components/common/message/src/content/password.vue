<template>
  <div>
    <input
      type="password"
      v-model="new_psd"
      class="input PASSWORD"
      ref="input"
      maxlength="6"
    />
    <header class="header">
      <h2 class="title">{{title}}</h2>
    </header>
    <article class="input-wrap">
      <ul class="flex flex-center" @click="focus">
        <li
          v-for="val in arr"
          class="rect flex flex-middle flex-center"
          :class="{active:val.fill}"
          :key="val.id"
        ></li>
      </ul>
      <p v-show="err" class="error">
        {{errorText}}
      </p>
      <p v-show="showForgetButton" class="forget-button" @click="forgetPassword">
        忘记密码？
      </p>
    </article>
  </div>
</template>
<script>
import des from '@/tools/libs/des'

export default {
  data () {
    return {
      new_psd: '',
      arr: [],
      err: false,
      errorText: "",
      showForgetButton: false,
    }
  },
  created () {
    this.arr = [
      { fill: false, id: 0 },
      { fill: false, id: 1 },
      { fill: false, id: 2 },
      { fill: false, id: 3 },
      { fill: false, id: 4 },
      { fill: false, id: 5 }
    ]
  },
  mounted () {
    let that = this;
    this.$refs.input.focus();
    this.$nextTick(() => {
      that.$emit('success', false);
    })
  },
  props: {
    title: "",
    showForget: true,
  },
  methods: {
    focus (e) {
      this.$refs.input.focus();
    },
    beforeConfirmAction () {
      let that = this;
      if (that.new_psd.length < 6) {
        that.errorText = "请输入6位密码"
        that.err = true;
        return false;
      }else{
        return {
          password: that.new_psd
        };
      }
    },
    afterConfirmAction (res){
      let that = this;
      if (res.checkResult === false) {
        that.new_psd = "";
        that.errorText = res.errorText;
        that.err = true
        return false;
      } else{
        return true;
      }
    },
    forgetPassword() {
      this.$emit('forgetPassword');
    }
  },
  watch: {
    new_psd (val) {
      let len = val.length;
      this.arr.forEach((val, i) => {
        if (i < len) {
          this.arr[i].fill = true
        } else {
          this.arr[i].fill = false
        }
      })
    },
    err (val) {
      if(val  && this.showForget){
        this.showForgetButton = true;
      }
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  font-size: 40px;
  color: #232323;
  margin: 0;
}
.info {
  margin-top: 24px;
  font-size: 24px;
  color: #81848c;
}
.rect {
  width: 64px;
  height: 64px;
  background-image: url("~@img/message/xinxikuang.png");
  background-size: 100% auto;

  &.active::after {
    content: " ";
    display: block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: black;
  }
}
.error {
  color: #e82d2d;
  font-size: 22px;
}
.el-icon-error {
  margin-right: 10px;
}
.input {
  width: 0px;
  height: 0px;
  border: none;
  opacity: 0;
}
.flex{
  display: flex;
}
.flex-center{
  justify-content: center;
}
.flex-middle{
  align-items: center;
}
.header{
    position: relative;
    top: -50px;
}
.input-wrap{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 740px;
  background: #f7f7fa;
  padding: 70px 140px;
  box-sizing: border-box;    margin-bottom: 50px;
  ul{
    margin: 0;
    padding: 0;
    width: 100%;
    justify-content: space-between;
  }
  .error{
    width: 100%;
    margin: 0;
    height: 0px;
    position: relative;
    top: 20px;
  }
  .forget-button{
    width: 100%;
    margin: 0;
    height: 0;
    position: relative;
    top: 1.042vw;
    left: 270px;
    font-size: 26px;
    color: #3b6aff;
  }
}
</style>