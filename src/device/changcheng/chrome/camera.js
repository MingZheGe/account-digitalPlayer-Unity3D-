import Device from "./common/device";

// 双录摄像头
class carmeraEx extends Device {
  constructor() {
    super();
    this.recordFlag = "";
    this.strageUser = {
      index: 0,
      lpszRecordFile: "D:/KIOSK/Camera/record.mp4",
      wFps:30, 
      wHpixel:640,
      wVpixel:480,
      wAudioOption: 1,
      iwidth: 737,
      iheight: 677,
      ileft: 0,
      itop: 0
    };
  }
  cameraInstance(callback, strageUser) {
    this.strageUser = Object.assign({}, strageUser);
    let that = this;
    try {
      that.bindEvent("cameraOpenConnectionOver", function (args) {
        console.warn("打开设备");
        // 打开连接完毕直接设置预览窗口
        // 签名见证不展示预览窗口 直接进行录制
        // 修改将签名预览打开
        // if (that.strageUser.index == 0) {
        //   callback({
        //     type: "OpenDisplayOver",
        //     msg: "打开预览窗口完成",
        //   })
        // } else {
          that.openHighCamera();
        //}
      })
      that.bindEvent("cameraSetVideoDisplayOver", function (args) {
        console.log("hahaha")
        console.log(args)
        console.warn("设置图像显示完成");
        callback({
          type: "OpenDisplayOver",
          msg: "打开预览窗口完成",
        })
        /*
        if (args.Action == "0") {
          callback({
            type: "OpenDisplayOver",
            msg: "打开预览窗口完成",
          })
        }
        */
      })
      that.bindEvent("cameraSetVideoGrabOver", function (args) {
        console.log(args)
        //let grabBase64 = await this.getGrab();
        callback({
          type: "SetGrabOver",
          msg: "截图完成",
          //data: grabBase64
        });
      })
      that.bindEvent("cameraSetVideoRecordOver", async function (args){
        console.warn("开始录制视频回调事件");
        // 通过Action判断是 开始录制还是结束录制
        if (args.result == 0 && that.recordFlag == "startrecord") {
          that.recordFlag = "";
          callback({
            type: "StartVideoRecordOver",
            msg: "开始录制视频",
          })
        } else if (args.result == 0 && that.recordFlag == "stoprecord") {
          that.recordFlag = "";
          let collectVideo = await that.getRecordVideo();
          callback({
            type: "StopVideoRecordOver",
            msg: "结束录制视频",
            data: collectVideo
          })
        }
      })
      that.bindEvent("cameraDeviceError", function (args) {
        callback({
          type: "DeviceError",
          msg: "硬件错误，错误码：" + args.errorcode,
        })
      });
      that.initNativeBridge('camera', 'Camera310');
    } catch (e) {
      console.error("初始化设备失败:" + e);
    }
  }
  // 设置预览画面
  openHighCamera() {
    console.log("开始打开摄像头画面");
    try {
      let params = {
        Camera: 0,
        Camera1: this.strageUser.index,
        Action: 0,
        Width: this.strageUser.iwidth,
        Height: this.strageUser.iheight,
        X: this.strageUser.ileft, 
        Y: this.strageUser.itop
      }
      _$("camera").execute("SetVideoDisplay", params);
    } catch (e) {
      console.error("高拍仪设置画面失败");
    }
  }
  closeConnection() {
    try {
      console.log("开始关闭全景摄像头了");
      _$("camera").CloseConnection();
    } catch (e) {
      console.error("关闭长城摄像头");
    }
  }
  // 开始录制
  startVideoRecord() {
    try {
      let params = {
        wCamera: 0,
        wCamera1: this.strageUser.index,
        wAction: 0,
        wAudioOption: this.strageUser.wAudioOption,
        lpszRecordFile: this.strageUser.lpszRecordFile,
        wHpixel: this.strageUser.wHpixel,
        wVpixel: this.strageUser.wVpixel, 
        xFps: this.strageUser.wFps,
        lpszWaterColour: "red",
        lpszWaterText: "",
      }
      this.recordFlag = "startrecord";
      _$("camera").execute("SetVideoRecord", params);
    } catch(err) {
      console.error(err)
      console.error("开始录制视频失败")
    }
  }
  // 停止录制
  stopVideoRecord() {
    try {
      let params = {
        wCamera: 0,
        wCamera1: this.strageUser.index,
        wAction: 1,
        wAudioOption: this.strageUser.wAudioOption,
        lpszRecordFile: this.strageUser.lpszRecordFile,
        wHpixel: this.strageUser.wHpixel,
        wVpixel: this.strageUser.wVpixel, 
        xFps: this.strageUser.wFps,
        lpszWaterColour: "red",
        lpszWaterText: "",
      }
      this.recordFlag = "stoprecord";
      _$("camera").execute("SetVideoRecord", params);
    } catch (err) {
      console.error(err)
      console.error("结束录制视频失败")
    }
  }
  setGrab() {
    try{
      _$("camera").execute("SetVideoGrab", {
        "lpszGrabFile": "D:/KIOSK/Camera/grab.jpg"
      });
    } catch(err) {
      console.error(err);
      console.error("截图失败")
    }
  }
  async getGrab() {
    try{
      let picVal = await utyDevice.onExec("readfile64", {
        "filename": "D:/KIOSK/Camera/grab.jpg"
      });
      console.log(picVal)
      // 截图的base64码
      return picVal.data;
    } catch(err) {
      console.error(err)
      console.error("获取截图失败!");
    }
  }
  // 获取录制视频
  async getRecordVideo() {
    try{
      let picVal = await utyDevice.onExec("readfile64", {
        "filename": "D:/KIOSK/Camera/record.mp4"
      });
      console.log(picVal)
      // video的base64码
      return picVal.data;
    } catch(err) {
      console.error(err)
      console.error("获取录制视频失败!!!");
    }
  }
}
const load = function () {
  if (!window.camera) {
    window.camera = new carmeraEx();
  }
}
export default {
  load,
}
