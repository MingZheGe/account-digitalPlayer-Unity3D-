import * as THREE from 'three';
export default class ThreeJs{
    
    constructor(id){
        //根据传入的id，去获取他的dom节点，用来加载三维模型
        this.id=id;
        this.dom=document.getElementById(id);
    }

    initThree(){
        //这个初始化的是场景
        this.scene= new THREE.Scene();
        this.width=this.dom.offsetWidth;
        this.height=this.dom.offsetHeight;
        this.camera= new THREE.PerspectiveCamera(45,this.width/this.height,1,1000);

        this.camera.position.set(10,10,10);
        this.camera.lookAt(0,0,0);

        //追加webGL的渲染器，他是用来调用浏览器的GPU，去进行实时渲染（前提浏览器已经支持GPU）
        //antialias:是否开启锯齿，alpha：是否开启透明，logarithmicDepthBuffer：是否开启对数深度缓存
        this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,logarithmicDepthBuffer:true})
        // 设置渲染器的像素比
        this.renderer.setPixelRatio(window.devicePixelRatio);
        //渲染器的输出颜色
        this.renderer.outputEncoding=THREE.sRGBEncoding;
        //设置渲染器的大小
        this.renderer.setSize(this.width,this.height);
        //将渲染器的dom元素，添加至我们div的dom元素中
        this.dom.append(this.renderer.domElement);

        // 监听浏览器大小，去更新相机的矩阵
        window.addEventListener('resize',()=>{
            // 更新相机的宽高比
            this.camera.aspect=this.dom.offsetWidth/this.dom.offsetHeight;
            this.camera.updateProjectionMatrix();
            //更新渲染器的大小
            this.renderer.setSize(this.dom.offsetWidth,this.dom.offsetHeight);
            if(this.cssRenderer){
                this.cssRenderer.setSize(this.dom.offsetWidth,this.dom.offsetHeight);
            }
        })
    }

        initHelper(helperSize=1000){
            this.scene.add(new THREE.AxesHelper(helperSize));
        }
        render(callback){
            callback();
            requestAnimationFrame(()=>this.render(callback));
        }
    
    

   
}
