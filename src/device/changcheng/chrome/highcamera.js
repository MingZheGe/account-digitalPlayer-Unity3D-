/**
 * 长城谷歌高拍仪的封装
 *  @author wangmx
 */
import Device from "./common/device";
class highCamera extends Device {
  constructor() {
    super();
    this.strageUser = "";
    this.canstopTakepic = false;
    this.canClick = false;
  }
  /**
   * 下方是自己封装的方法,把相应的回调方法暴露出去
   */
  HighCameraInstance(callback, strageUser) {
    let that = this;
    that.strageUser = Object.assign({}, strageUser);
    that.canstopTakepic = false;
    that.canClick = false;
    console.log("传进来的参数");
    console.log("({width:" + this.strageUser.iwidth + ",height:" + this.strageUser.iheight + ",top:" + this.strageUser.itop + ",left:" + this.strageUser.ileft + "})")
    try {
      that.bindEvent("highcameraOpenConnectionOver", function () {
        siu.ControlGuideLightSync(3, 128) //1:关；4：慢速；8：中速；16：快速；128：连续；
        that.openHighCamera();
        callback({
          type: "OpenConnectionOver",
          msg: "打开高拍仪成功",
        })
      })
      that.bindEvent("highcameraStartTakePictureOver", function () {
        that.canstopTakepic = true;
        console.log("StartTakePictureOver事件")
        callback({
          type: "StartTakePictureOver",
          msg: "打开预览成功"
        })
      })
      that.bindEvent("highcameStopTakePictureOver", function () {
        var st = "({width:0,height:0,top:0,left:0})";
        _$("highcamera").updateOcxStlye(st);
        _$("highcamera").updateStlye(st);
        callback({
          type: "StopTakePictureOver",
          msg: "停止预览成功"
        })
      })
      that.bindEvent("highcameraDeviceError", function (args) {
        callback({
          type: "DeviceError",
          msg: "高拍仪硬件错误:" + args.errorcode,
          errorCode: args.errorcode
        })
      })
      that.bindEvent("highcameraErrorInfoReceived", function () {
        callback({
          type: "DeviceError",
          msg: "高拍仪硬件错误:" + "ErrorInfoReceived",
        })
      })

      that.bindEvent("highcameraGetPictureSyncOver", async function (args) {
        console.log("拍照成功的回调事件");
        console.info("执行拍照事件完成了");
        console.dir(args);
        if (args.result == "0") {
          let result = "0",
            picVal;
          picVal = await utyDevice.onExec("readfile64", {
            "filename": "C:/highcameraImage/scanImage.jpeg"
          })
          console.log("高拍仪拍照成功,并且把图片转换成base64", picVal);

          if (picVal.success == "true") {
            result = "0";
          } else {
            result = "1";
          }
          callback({
            type: "GetPictureSyncOver",
            collectedImage: picVal.data,
            result: result,
          })
        } else {
          callback({
            type: "GetPictureSyncOver",
            msg: "拍照失败",
            result: "1",
          })
        }
      })

      that.initNativeBridge('highcamera', 'HighCamera310');
    } catch (e) {
      console.error("初始化设备失败:" + e);
    }
  }
  //展示高拍仪窗口的方法
  openHighCamera() {
    let st = "({width:" + this.strageUser.iwidth + ",height:" + this.strageUser.iheight + ",top:0,left:0})";
    console.log("第一个st" + st);
    try {
      _$("highcamera").StartTakePicture(0, 3, this.strageUser.iwidth, this.strageUser.iheight, this.strageUser.ileft, this.strageUser.itop, true, 0);
      this.canClick = true; //可以开始采集
    } catch (e) {
      console.error("高拍仪设置画面失败,原因：" + e);
    }
  }
  //隐藏高拍仪窗口
  hidCameraWin() {
    try {
      siu.ControlGuideLightSync(3, 1) //1:关；4：慢速；8：中速；16：快速；128：连续；
      _$("highcamera").StopTakePicture(1, 3, this.strageUser.iwidth, this.strageUser.iheight, this.strageUser.ileft, this.strageUser.itop, true, 0);
      this.canClick = true; //可以开始采集
    } catch (e) {
      console.log("结束预览失败：" + e);
    }
  }
  // 显示高拍仪窗口
  showHighCamera() {
    siu.ControlGuideLightSync(3, 128)
    this.canClick = true; //可以开始采集
    console.log("showHighCamera" + "显示高拍仪窗口");
    this.openHighCamera();
  }
  // 关闭高拍仪窗口
  destroyHighCamera() {
    try {
      if (this.canstopTakepic) {
        siu.ControlGuideLightSync(3, 1) //1:关；4：慢速；8：中速；16：快速；128：连续；
        _$("highcamera").StopTakePicture(1, 3, this.strageUser.iwidth, this.strageUser.iheight, this.strageUser.ileft, this.strageUser.itop, true, 0);
      }
    } catch (e) {
      console.error("停止拍照失败！" + e)
    }
  }
  //拍照 转base64
  async Capture() {
    console.log("是否可以拍照" + this.canClick);
    if (this.canClick) {
      this.canClick = false;
      var creatSrc = "c:\\\\highcameraImage\\\\scanImage.jpeg";
      var re, picVal;
      // path为存储路径，type为采集方式：0,1,2,3,4,5,6,7分别对应all,A4,A5,A6,A7,名片，身份证，自定义
      try {
        re = _$("highcamera").GetPictureSync(3, 0, "", creatSrc, 0);
        this.canClick = true;

      } catch (e) {
        //即使是拍照失败 也可以重新拍照
        this.canClick = true;
        console.error("高拍仪拍照失败" + e)
      }
    }
  }
}
const load = function () {
  if (!window.highcamera) {
    let highcamera = new highCamera();
    window.highcamera = highcamera;
  }
}

export default {
  load,
}
