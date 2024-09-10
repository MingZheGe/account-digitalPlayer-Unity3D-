<template>
    <div class="page-background">
      <div class='radar-container'>
        <div class='radar' id="radar"></div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  let myChart = null;
  export default {
    components: {},
    data() {
      return {
        option: {
          title: {
            text: "基础雷达图",
            textStyle: {
              color: "#fff"
            }
          },
          tooltip: {},
          legend: {
            data: ["预算分配（Allocated Budget）", "实际开销（Actual Spending）"],
            textStyle: {
              color: "#fff"
            }
          },
          radar: {
            name: {
              textStyle: {
                color: "#fff",
                backgroundColor: "#999",
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [
              { name: "投资经验（Investment experience）", max: 6500 },
              { name: "风险承受能力（Dedication and bearing capacity）", max: 16000 },
              { name: "投资目标（Investment objectives）", max: 30000 },
              { name: "财务情况（Financial situation）", max: 38000 },
              { name: "心理承受能力（Psychological endurance）", max: 52000 },
              { name: "金融知识（Financial knowledge）", max: 25000 }
            ]
          },
          series: [
            {
              name: "标准数据 vs 您的数据（Budget vs spending）",
              type: "radar",
              data: [
                {
                  value: [4300, 10000, 28000, 35000, 50000, 19000],
                  name: "预算分配（Allocated Budget）",
                  label: {
                    show: true,
                    position: "top",
                    formatter: function(params) {
                      return params.value;
                    },
                    textStyle: {
                      color: "#FF0000",
                      fontSize: 12
                    }
                  }
                },
                {
                  value: [5000, 14000, 28000, 31000, 42000, 21000],
                  name: "实际开销（Actual Spending）",
                  label: {
                    show: true,
                    position: "top",
                    formatter: function(params) {
                      return params.value;
                    },
                    textStyle: {
                      color: "#333",
                      fontSize: 12
                    }
                  }
                }
              ]
            }
          ]
        }
      };
    },
    methods: {
      drawradar() {
        if (myChart) {
          myChart.setOption(this.option);
        }
      },
      resizeChart() {
        if (myChart) {
          myChart.resize();
        }
      }
    },
    mounted() {
      // 确保 DOM 已准备好
      this.$nextTick(() => {
        // 基于准备好的 DOM，初始化 echarts 实例
        const radarElement = document.getElementById("radar");
        if (radarElement) {
          myChart = echarts.init(radarElement);
          this.drawradar();
          // 窗口改变时重新绘制
          window.addEventListener("resize", this.resizeChart);
        }
      });
    },
    beforeDestroy() {
      // 移除窗口改变事件监听
      window.removeEventListener("resize", this.resizeChart);
      if (myChart) {
        myChart.dispose();
      }
    }
  };
  </script>
  
  <style scoped>
  .page-background {
    background-image: url('./static/bg4.jpg');
    background-size: cover; /* 背景图片覆盖整个元素 */
    background-position: center; /* 背景图片居中 */
    background-repeat: no-repeat; /* 不重复背景图片 */
    height: 100vh; /* 可以根据需要设置高度 */
    width: 100%; /* 可以根据需要设置宽度 */
  }
  
  .radar-container {
    width: 100%;
    height: 100vh; /* 确保容器有非零尺寸 */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .radar {
    width: 80%;
    height: 80%;
  }
  </style>
  