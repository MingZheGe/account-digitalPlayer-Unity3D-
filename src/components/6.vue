<template>
  <div class="outer-container">
    <div class="container">
      <h2 class="title">投资者风险承受能力评估结果告知函</h2>
      (提示：本表由证券公司填写，证券公司和客户双方各自留存。)<br />
      <table class="assessment-table">
        <tr>
          <td class="cell center-cell">投资者风险承受能力评估结果</td>
          <td class="cell">
            尊敬的客户(姓名/名称：刘干 客户代码：360300004404)：<br />
            根据您填写的《投资者风险承受能力评估问卷》，我司对您的风险承受能力进行了综合评估，现得到评估结果如下：<br />
            您的风险承受能力为：<b>{{ riskLevel }} {{ riskScore }}分</b><br /><br />
            【客户风险承受能力划分标准】<br />
            保守型(C1)，0-19分(含风险承受能力最低类别的投资者)；
            相对保守型(C2)，20-39分；
            稳健型(C3)，40-59分；
            相对积极型(C4)，60-79分；
            积极型(C5)，80-100分。<br /><br />
            我司在此郑重提醒，我司向您销售的金融产品或提供的金融服务将以您的风险承受能力等级为基础，若您提供的信息发生任何重大变化，您都应当及时书面通知我司。我司建议您审慎评判自身风险承受能力、结合自身投资行为，作出审慎的投资判断。<br />
            如您在审慎考虑后同意我司的评估结果，请认真阅读下列内容，并签字以示同意。<br />
            <div class="align-right">xxxx证券股份有限公司</div>
          </td>
        </tr>
        <tr>
          <td class="cell center-cell">客户确认</td>
          <td class="cell">
            xxxx证券股份有限公司：<br />
            本人/本机构在贵公司的提示下对自身风险承受能力进行了综合评估，已经审慎考虑自身的风险承受能力并在此确认：<br />
            本人/本机构的风险承受能力为：<b>{{ riskLevel }}</b>；<br />
            本人/本机构经贵公司告知，已充分知晓贵公司向本人/本机构销售的金融产品或提供的金融服务将以本人/本机构此次确认的风险承受能力等客户确认级为基础。若本人/本机构提供的信息发生任何重大变化，本人/本机构都会及时书面通知贵公司。本确认函系本人/本机构独立、自主、真实的意思表示，特此确认。本人/本机构已经审慎考虑自身的风险承受能力以及过往的投资行为，并确认已知晓本人/本机构风险承受能力。本人/本机构经贵公司提示，已充分知晓贵公司为本人/本机构提供的金融产品或金融服务将以本人/本机构此次确认的风险承受能力等级为基础。<br /><br />
            <div class="align-right">
              客户确认签字：刘干<br />
              日期：{{ currentDate }}<br />
            </div>
          </td>
        </tr>
      </table>
      <div id="radar" style="width: 600px; height: 400px; margin: 20px auto;"></div>
      <div class="note">
        注：若自然人客户风险承受能力等级为保守型(C1)且满足以下情形之一时，我司则将其认定为风险承受能力最低类别投资者，仅提供符合其风险承受能力的低风险等级产品或服务：<br />
        (一)不具有完全民事行为能力；<br />
        (二)没有风险容忍度或者不愿承受任何投资损失；<br />
        (三)法律、行政法规规定的其他情形。<br /><br />
        市场有风险，投资需谨慎
      </div>
      <div class="confirmation">
        <el-checkbox id="agree" name="agree" v-model="isAgreed" />
        <label for="agree" class="confirmation-text">本人已认真阅读并理解上述内容</label>
      </div>
      <!-- <div :class="['button-container', { 'highlight': isAgreed }]">
              <button :class="{ active: isAgreed }" @click="accept" :disabled="!isAgreed">我接受</button>
            </div> -->
    </div>
  </div>
</template>


<script>
import * as echarts from 'echarts';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { askGet } from '../util/connect'
import TWEEN from '@tweenjs/tween.js';

export default {
  props: {
    nextClick: Number
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      raycaster: null,
      mouse: new THREE.Vector2(),
      bubbles: [],
      features: [
        { name: '投资经验（Investment experience）', value: 60 },
        { name: '风险承受能力（Dedication and bearing capacity）', value: 60 },
        { name: '投资目标（Investment objectives）', value: 60 },
        { name: '财务情况（Financial situation）', value: 60 },
        { name: '心理承受能力（Psychological endurance）', value: 60 },
        { name: '金融知识（Financial knowledge）', value: 60 }
      ],
      colors: [
        '#00FFFF', '#00FFFF', '#00FFFF',
        '#00FFFF', '#00FFFF', '#00FFFF'
      ],
      selectedBubble: null,
      isAgreed: false,
      riskLevel: '稳健型',
      riskScore: 47,
      currentDate: this.formatDate(new Date()), // 设置默认值为当前日期
      active: 0, // 新增的 active 属性
      option: {
        title: {
          text: "基础雷达图",
          textStyle: {
      color: '#00FFFF' // 设置标题颜色为 #00FFFF
    }
        },
        tooltip: {},
        legend: {
          data: ["预算分配（Allocated Budget）", "实际开销（Actual Spending）"],
          textStyle: {
      color: '#00FFFF' // 设置图例项颜色为 #00FFFF
    }
        },
        radar: {
          indicator: [
            { name: "投资经验（Investment experience）", max: 6500 },
            { name: "风险承受能力（dica bear）", max: 16000 },
            { name: "投资目标（Ivs objectives）", max: 30000 },
            { name: "财务情况（Financial situation）", max: 38000 },
            { name: "心理承受能力（Psychological endurance）", max: 52000 },
            { name: "金融知识（Financial knowledge）", max: 25000 }
          ],
          axisLabel: {
            color: '#00FFFF' // 标签颜色设置为红色
          },
          name: {
            textStyle: {
              color: '#00FFFF' // 标签名称颜色设置为红色
            }
          }
        },
        series: [{
          name: "预算 vs 开销（Budget vs spending）",
          type: "radar",
          itemStyle: {
      color: '#00FFFF' // 这是设置整个 series 的颜色
    },
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: "预算分配（Allocated Budget）",
              lineStyle: {
          color: '#00FFFF' // 设置线条颜色
        },
        areaStyle: {
          color: 'rgba(0, 255, 255, 0.3)' // 设置区域颜色，使用透明度
        }
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: "实际开销（Actual Spending）",
              lineStyle: {
          color: '#00FFFF' // 设置线条颜色
        },
        areaStyle: {
          color: 'rgba(0, 255, 255, 0.3)' // 设置区域颜色，使用透明度
        }
            }
          ]
        }]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initRadarChart();
      this.initThreeJS();
      //let answer = askGet("111")
     
    });
    wife.doAction("开心");
      let signSucc = new Audio()
     signSucc.src = require("../asset/video/7.wav")
     signSucc.play()
  },
  methods: {
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    initRadarChart() {
      const radarChart = echarts.init(document.getElementById('radar'));
      radarChart.setOption(this.option);
    },
    initThreeJS() {
      const container = this.$refs.sceneContainer;

      // 创建场景
      this.scene = new THREE.Scene();

      // 创建相机
      this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      this.camera.position.z = 5;

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      // 创建轨道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      // 创建光源
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 5, 5).normalize();
      this.scene.add(light);

      // 创建多个气泡
      for (let i = 0; i < this.features.length; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: this.colors[i] });
        const bubble = new THREE.Mesh(geometry, material);
        bubble.position.set(
          Math.random() * 4 - 2,
          Math.random() * 4 - 2,
          Math.random() * 4 - 2
        );
        this.scene.add(bubble);
        this.bubbles.push(bubble);
      }

      // 设置光线投射器
      this.raycaster = new THREE.Raycaster();

      // 事件监听
      window.addEventListener('resize', this.onWindowResize, false);
      container.addEventListener('mousemove', this.onMouseMove, false);
      container.addEventListener('click', this.onClick, false);

      // 开始动画循环
      this.animate();
    },
    onWindowResize() {
      const container = this.$refs.sceneContainer;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    },
    onMouseMove(event) {
      event.preventDefault();
      const container = this.$refs.sceneContainer;
      this.mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
      this.mouse.y = - (event.clientY / container.clientHeight) * 2 + 1;
    },
    onClick(event) {
      event.preventDefault();
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.bubbles);

      if (intersects.length > 0) {
        const selectedBubble = intersects[0].object;
        if (this.selectedBubble) {
          this.selectedBubble.material.color.set('#ffffff'); // 重置上一个选中的气泡颜色
        }
        selectedBubble.material.color.set('#ff0000'); // 设置选中的气泡颜色
        this.selectedBubble = selectedBubble;
      }
    },
    animate() {
      requestAnimationFrame(this.animate);
      TWEEN.update();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
    accept() {
      // 处理确认按钮点击事件
      console.log('User accepted the terms.');
    }
  },
  watch: {
    nextClick: {
      handler(newVal, oldVal) {
        if (this.isAgreed) {
          this.$emit('approve', 'ok')
        } else {
          alert('请先同意用户协议')
        }

      },
      deep: true
    }
  }

};

</script>

<style scoped>
.outer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
}

.container {
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
}

.assessment-table {
  width: 100%;
  border-collapse: collapse;
  color: white
}

.cell {
  padding: 10px;
  border: 1px solid #ccc;
}

.center-cell {
  text-align: center;
  font-weight: bold;
}

.align-right {
  text-align: right;
}

.note {
  margin-top: 20px;
  font-size: 12px;
  color: white;
}

.confirmation {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.confirmation-text {
  margin-left: 10px;
}

.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.button-container.highlight button {
  background-color: #409eff;
  color: #ffffff;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.active {
  background-color: #409eff;
  color: #ffffff;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
  color: aqua;
}

::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: aqua;
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

</style>

