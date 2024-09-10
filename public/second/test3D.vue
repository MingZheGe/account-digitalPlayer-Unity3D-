<template>
    <div style="width:700px;height: 950px;position: absolute;background:transparent;">
        <div style="width:100%;height: 100%;">
            <div class="bodys" id="bodys"></div>
        </div>

    </div>
</template>

<script>
// 导入整个three.js核心库
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


export default {
    name: 'DemoOne',
    data() {
        return {
            // 页面标题
            title: 'ThreeJs演示页面一',
            // 场景
            scene: null,
            // 坐标辅助器
            axesHelper: null,
            // 相机
            camera: null,
            // WebGL渲染器
            renderer: null,
            // 轨道控制器
            control: null,
            // 动画混合器
            mixer: null
        };
    },
    mounted() {
        // 加载场景
        this.init();
        // 动画渲染
        this.animat();
    },
    methods: {
        init() {
            // 1、创建一个场景
            this.scene = new THREE.Scene();
            // this.scene.background = new THREE.Color(0,0,0,0);

            // 2、创建坐标辅助器 - 模拟xyz坐标轴
            let axesHelper = new THREE.AxesHelper(70);
            // 添加到场景中
            //this.scene.add(axesHelper);

            // 3、定义画布尺寸 - 高宽
            const width = document.getElementById('bodys').offsetWidth;
            const height = document.getElementById('bodys').offsetHeight;

            // 4、创建一个透视投影相机
            this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
            // 设置相机的位置，将 y 坐标下移
            this.camera.position.set(0, 5, 33); // 第二个参数是 y 坐标，将其减小(2是黄线1是绿线3是蓝线)
            // 设置相机的观察点坐标
            this.camera.lookAt(0, 0, 0); // 确保相机的观察点在场景中心

            // 5、创建一个WebGL渲染器 - 渲染你制作的场景
            this.renderer = new THREE.WebGLRenderer({ alpha: true });
            // 设置渲染画布的尺寸
            this.renderer.setSize(width, height);
            this.renderer.setClearColor(0x000000, 0);//(:color,:alpha)
            //setAnimationLoop(null)暂停动画
            // 把渲染结果添加到页面上
            document.getElementById('bodys').appendChild(this.renderer.domElement);
            //document.getElementById("myDIV").style.position = "absolute"
            console.log(document)
            // 设置画布的背景色
            //this.renderer.setClearColor(0x000000, 0);
            // 6、创建轨道控制器 - 方便操作场景物体
            this.control = new OrbitControls(this.camera, this.renderer.domElement);

            // 7、添加光源
            // 添加环境光
            const ambientLight = new THREE.AmbientLight(0xffffff, 1);
            this.scene.add(ambientLight);

            // 添加方向光
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(10, 10, 10);
            this.scene.add(directionalLight);

            // 8、加载GLTF模型
            const loader = new GLTFLoader();
            loader.load(
                '/model/dance1.glb',
                gltf => {
                    const model = gltf.scene;
                    model.scale.set(10, 10, 10);
                    model.position.set(0, -8, 0);
                    this.scene.add(model);

                    // 初始化动画混合器
                    this.mixer = new THREE.AnimationMixer(model);

                    // 获取并播放动画
                    const animations = gltf.animations;
                    if (animations && animations.length) {
                        animations.forEach(clip => {
                            const action = this.mixer.clipAction(clip);
                            action.play();
                        });
                    }
                },
                undefined,
                error => {
                    console.error('An error occurred while loading the model:', error);
                }
            );

            // 设置时钟
            this.clock = new THREE.Clock();
        },

        animat() {
            // 获取时钟的变化时间
            const delta = this.clock.getDelta();

            // 更新动画混合器
            if (this.mixer) {
                this.mixer.update(delta);
            }

            // 渲染场景
            this.renderer.render(this.scene, this.camera);
            // requestAnimationFrame - 周期性执行，默认每秒60次
            // 渲染下一帧 - 再次执行渲染函数
            requestAnimationFrame(this.animat);
        }
    }
};
</script>

<style scoped>
.bodys {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
}
</style>


