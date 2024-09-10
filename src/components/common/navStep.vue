<template>
  <el-row class="kmsp-step">
    <el-steps :active="stepIndex" finish-status="success" process-status="process" space="auto">
      <el-step :title="item" v-for="(item,index) in stepsObj" :key="index">
      </el-step>
    </el-steps>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      stepIndex: 0,
      stepsObj: [],
    }
  },
  mounted() {
    this.initSteps();
  },
  activated () {
    this.initSteps();
  },
  deactivated () {
    this.$destroy();
  },
  computed: {
    navTitle() {
      return this.$route.meta.name
    },
    navRouteTable() {
      // return ["身份识别", "资料录入", "影像采集", "视频录制", "员工见证", "协议签署"]
      return this.$store.state.navRouteTable
    },
    isRightShow() {
      return "rightOptions" in this.$route.meta;
    },
    maxItem() {
      return this.isRightShow ? 5 : 6;
    },
  },
  watch: {
    navRouteTable() {
      this.initSteps();
    },
    navTitle() {
      this.initSteps();
    },
    maxItem() {
      this.initSteps();
    }
  },
  methods: {
    initSteps() {
      if(this.navRouteTable && this.navRouteTable.indexOf(this.navTitle) >= 0) {
        let steps = this.navRouteTable
        let currentSIdx = steps.indexOf(this.navTitle)
        if(steps.length > this.maxItem) { // 超过maxItem个节点自动划分为5节点
          let startIdx = _.min([_.max([0, currentSIdx - 2]), steps.length - this.maxItem])
          steps = steps.slice(startIdx, startIdx + this.maxItem);
          currentSIdx = steps.indexOf(this.navTitle);
        }

        this.stepIndex = currentSIdx;
        this.stepsObj = steps;

        // let steps = _.union(_.map(_.filter(this.bizRouteTable, function(o) { 
        //       return o.show && (o.path != "/bizComplete" && !_.endsWith(o.path, "/bizCheck"))
        //     }), function(o) { return o.name }))
        // let currentSName = this.bizRouteTable[this.bizRouteIndex].name;
        // let currentSIdx = steps.indexOf(currentSName)
        // if(steps.length > this.maxItem) { // 超过maxItem个节点自动划分为5节点
        //   let startIdx = _.min([_.max([0, currentSIdx - 2]), steps.length - this.maxItem])
        //   steps = steps.slice(startIdx, startIdx + this.maxItem);
        //   currentSIdx = steps.indexOf(currentSName);
        // }

        // this.stepIndex = currentSIdx;
        // this.stepsObj = [];
        // for(let i = 0; i < steps.length; i++) {
        //   this.stepsObj.push({
        //     title: steps[i],
        //     slash: i < steps.length - 1,
        //   })
        // }

      }
    }
  }
}
</script>

<style lang="less">
  .kmsp-step {
    .el-steps.el-steps--horizontal {
      height: 30px;
      justify-content: flex-start;
      .el-step.is-horizontal {
        display: flex;
        justify-content: center;
        padding: 0 40px 0 5px;
        .el-step__head {
          width: auto;
          display: flex;
          align-items: center;
          .el-step__line {
            background: #8182D6;
            width: 30px;
            top: 14px;
            left: 116px;
          }
          .el-step__line-inner {
            background: #8182D6;
            border-color: #8182D6;
          }
          &.is-success {
            .el-step__icon.is-text {
              border: 0;
              font-size: 16px;
              font-weight: bolder
            } 
          }
          &.is-process {
            .el-step__line {
              left: 160px;
            }
            .el-step__icon.is-text {
              width: 40px;
              height: 40px;
              font-size: 23px;
              background: #F3800E;
              border: 2px solid #FFF;
              color: #FFF;
            } 
          }
          &.is-wait {
            .el-step__icon.is-text {
              background: transparent;
              border: 1px solid #CACBED;
              color: #CACBED;
            } 
          }
        }
        .el-step__main {
          display: flex;
          align-items: center;
          .el-step__title {
            display: flex;
            height: 30px;
            line-height: 30px;
            padding: 0 8px;
            white-space: pre;
            font-size: 18px;
            &.is-success {
              color: #FFF;
              font-weight: bold;
            }
            &.is-process {
              color: #FFF;
              font-size: 26px;
              font-weight: bold;
            }
            &.is-wait {
              color: #CACBED;
            }
          }
          .el-step__description {
            display: none;
          }
        }
      }
    }
  }
</style>