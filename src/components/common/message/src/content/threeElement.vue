客户三要素确认弹框
@lindw
<template>
  <div class="threeElement-mask flex flex-middle flex-center">
    <el-container class="threeElement-wrap">
      <el-header>
        <div class="title">
          <span>{{title}}</span>
        </div>
      </el-header>
      <el-main>
        <div class="content">
          <el-form>
            <el-form-item v-for="field in custInfo" :key="field.item" :label="field.label">
              <span>{{field.value}}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>



<script>
import dict from "../../../../../tools/dict"
export default {
  data () {
    return {
    }
  },
  props: {
    custInfo: {
      type: Array
    },
    title: '',
  },
  computed: {
  },
  methods: {
    close () {
      this.$emit("close");
    },
    skip () {
      this.$emit("skip");
    },
  },
}
</script>

<style lang="less">
.sign-loading-wrap--threeElement {
  width: auto !important;
  min-width: 760px;
  .threeElement-wrap {
    .el-header {
      height: auto;
      .title {
        span {
          font-size: 40px;
          font-weight: bold;
        }
      }
    }
    .content {
      margin-top: 25px;
      .el-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: auto;
        min-height: 270px;
        background: #f0f3f8;
        border: 2px solid rgba(206, 210, 225, 1);
        border-radius: 4px;
        .el-form-item {
          width: 100%;
          display: flex;
          height: auto;
          min-height: 90px;
          margin-bottom: 0;
          .el-form-item__label {
            font-size: 32px;
            width: 35%;
            text-align: left;
            padding-left: 30px;
            font-weight: 500;
            height: auto;
            min-height: 90px;
            color: rgba(110, 118, 125, 1);
            display: flex;
            align-items: center;
          }
          .el-form-item__content {
            font-size: 32px;
            width: 60%;
            text-align: left;
            display: flex;
            align-items: center;
            height: auto;
            min-height: 90px;
            font-weight: bold;
            color: rgba(35, 35, 35, 1);
          }
          &:not(:first-child) {
            border-top: 2px solid rgba(206, 210, 225, 1);
          }
        }
      }
    }
  }
}
</style>