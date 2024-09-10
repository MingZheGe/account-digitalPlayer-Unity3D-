import Device from "./common/device";

// 人脸识别摄像头
class cameraYC extends Device {
  constructor() {
    super();
    this.strageUser = "";
    this.canstopTakepic = false;
    this.canClick = false;
    this.cameraAction = "0"; //默认是打开得
  }
  cameraInstance(callback, strageUser) {
    this.strageUser = Object.assign({}, strageUser);
    console.error("进入摄像头模块");
    this.canstopTakepic = false;
    this.canClick = false;
    let that = this;
    try {
      that.bindEvent("cameraOpenConnectionOver", function (args) {
        console.error("打开设备 ok!" + JSON.stringify(args));
        that.openHighCamera();
      })
      that.bindEvent("cameraSetVideoDisplayOver", function (args) {
        console.error("设置图像显示完成!" + JSON.stringify(args));
        that.canstopTakepic = true;
        // 是展示预览则 拍照 否则不进行
        if (that.cameraAction == "0") {
          // siu.ControlGuideLightSync(9, 128);
          that.cameraAction = "1";
          callback({
            type: "StartTakePictureOver",
            msg: "打开人脸完成",
          })
        } 
        // 是关闭预览窗口则关闭连接
        else if (that.cameraAction == "1") {
          // siu.ControlGuideLightSync(9, 1);
          //that.CloseConnection();
        }
      })
      that.bindEvent("cameraTakePictureFaceOver", async function (args) {
        console.dir(args);
        console.log("拍照成功，回调方法");
        // 环境照
        let picVal = await utyDevice.onExec("readfile64", {
          "filename": "D://facePicture/people.jpg"
        });
        // 现场人脸照
        // let faceVal = await utyDevice.onExec("readfile64", {
        //   "filename": "D://facePicture/Face.jpg"
        // });
        that.canClick = true;
        let collectedImage = picVal.data;
        // let faceImage = faceVal.data;
        // console.log("人脸照====", faceImage);
        console.log("环境照====", collectedImage);
        callback({
          type: "TakePictureOver",
          msg: "拍照成功了",
          collectedImage: collectedImage,
          // faceImage: faceImage
        })
        siu.ControlGuideLightSync(9, 1);
        that.hidCameraWin();
      });

      that.bindEvent("cameraTakePictureOver", async function () {
        console.log("拍照成功，回调方法");
        let picVal = await utyDevice.onExec("readfile64", {
          "filename": "C:/highcameraImage/scanImage.jpeg"
        })
        that.canClick = true;
        let collectedImage = picVal.data;
        console.log("拍照获取图片的结果====", collectedImage);
        callback({
          type: "TakePictureOver",
          msg: "拍照成功了",
          collectedImage: collectedImage
        })
        console.log("拍照完成!");
      });
      that.bindEvent("cameraDeviceError", function (args) {
        callback({
          type: "DeviceError",
          msg: "硬件错误" + args.errorcode,
        })
      });
      that.initNativeBridge('camera', 'FaceCamera');
    } catch (e) {
      console.error("初始化设备失败:" + e);
    }
  }
  //设置人脸画面 宽高一类的窗口 打开人脸浮动窗口
  openHighCamera() {
    console.log("开始打开摄像头画面");
    try {
      this.cameraAction = "0";
      _$("camera").SetVideoDisplay(1, 0, this.strageUser.iwidth, this.strageUser.iheight, this.strageUser.ileft, this.strageUser.itop);
      this.canClick = true; //可以开始采集
    } catch (e) {
      console.error("人脸设置画面失败");
    }
  }
  //隐藏人脸窗口
  hidCameraWin() {
    try {
      this.cameraAction = "1";
      _$("camera").SetVideoDisplay(1, 1, this.strageUser.iwidth, this.strageUser.iheight, this.strageUser.ileft, this.strageUser.itop);
      this.canClick = true; //可以开始采集
    } catch (e) {
      console.log("结束预览失败：" + e);
    }
  }
  CloseConnection() {
    try {
      console.log("开始关闭全景摄像头了");
      this.cameraAction = "1";
      _$("camera").CloseConnection();
    } catch (e) {
      console.error("关闭长城摄像头");
    }
  }
  //拍照 转base64
  Capture() {
    console.log("是否可以拍照" + this.canClick);
    if (this.canClick) {
      this.canClick = false;
      var creatSrc = "D://facePicture/people.jpg";
      try {
        console.log("调用了拍照的方法");
        _$("camera").TakePictureFace(1, creatSrc, 0, 10);
        this.canClick = true;
      } catch (e) {
        //即使是拍照失败 也可以重新拍照
        this.canClick = true;
        console.error("人脸拍照失败" + e)
      }
    }
  }
}
const load = function () {
  if (!window.cameraYC) {
    window.cameraYC = new cameraYC();
  }
}
const init = function (vueInstance) {
  window.cameraYC.bindEvent("cameraMediaThreshold", function (args) {
    console.log(JSON.stringify(args))
    vueInstance.$store.commit("UPDATE_FACE_STATUS", args.DetectStatus);
  })
}
export default {
  load,
  init
}
