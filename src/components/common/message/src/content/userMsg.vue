<template>
  <div class="wrap flex flex-space-between">
    <div class="left-box">
      <img class="avatar" v-if="user_img" :src="user_img" />
    </div>
    <div class="right-box">
      <h2 class="title">信息校验结果</h2>
      <ul class="msg-box">
        <li class="msg-title">姓名</li>
        <li class="msg">
          <span class="label">输入值:</span>
          {{enter_name}}
        </li>
        <li class="msg c-red">
          <span class="label">返回值:</span>
          {{return_name}}
        </li>
      </ul>
      <ul class="msg-box">
        <li class="msg-title">身份证号</li>
        <li class="msg">
          <span class="label">输入值:</span>
          {{enter_code}}
        </li>
        <li class="msg c-red">
          <span class="label">返回值:</span>
          {{return_code}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    user_img: '',
    enter_name: '',
    return_name: '',
    enter_code: '',
    return_code: ''
  },

}
</script>
<style lang="less" scoped>
.c-red {
  color: #c22115;
}
.wrap {
  align-items: center;
  .left-box {
    .avatar {
      width: 224px;
      height: 307px;
    }
    margin-right: 10px;
  }
  .right-box {
    // width: 300px;
    text-align: left;
    flex: 1;
    .title {
      color: #232323;
      font-size: 32px;
      font-weight: bold;
    }
    .msg-box {
      padding: 0;
      margin-top: 32px;
      .msg-title {
        font-size: 18px;
        font-weight: bold;
      }
      .msg {
        font-size: 24px;
        line-height: 44px;
        .label {
          color: #808992;
        }
      }
    }
  }
}
</style>