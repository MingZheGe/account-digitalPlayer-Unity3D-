/**
 * @author wangmx
 * @description 二维码扫描
 */
import DeviceEx from './common/device'
class Barcode extends DeviceEx {
  constructor() {
    super();
    this.justCapImage = false;
  }
  /**
   * @desc 初始化长城的二代证的方法
   * callback({type: "printSuccess",msg: ""}) type: printError/printSuccess
   */
  BarcodeInstance(callback, type) {
    let that = this;
    console.log("进入了二维码扫描的页面")
    try {
 
      this.bindEvent("barcodeOpenConnectionOver", function (args) {
        callback({
            type: "OpenConnectionOver",
            msg: "打开成功",
        })
        that.ScanBarcode();
      });
      this.bindEvent("barcodeScanBarcodeOver", function(args){
        console.log("识别二维码结果", args);
        callback({
            type: "ScanBarcodeOver",
            msg: "扫码成功",
            data: args,
        })
      })
      this.bindEvent("barcodTimeout", function (args) {
        console.log("操作" + args.cmdName + "超时");
        callback({
          type: "Timeout",
          msg: "操作超时,请重新识别二维码",
        })
      })
      this.bindEvent("barcodeResetOver", function () {
        console.log("设备reset barcode完毕重新连接设备");
        callback({
          type: "ResetOver",
          msg: "重置完成了",
        })
      })
      this.bindEvent("barcodeDeviceError", function (args) {
        callback({
          type: "DeviceError",
          msg: "硬件错误，错误码：" + args.errorcode,
        })
      });
      this.bindEvent("barcodeScanBarcodeCancelled", function(args){
        console.log("取消扫描了", args);
        callback({
            type: "ScanBarcodeCancelled",
            msg: "硬件错误，错误码：" + args.errorcode,
          })
      })
      this.initNativeBridge('barcode', 'Barcode310');
    } catch (err) {
      console.error("条形码扫描器初始化失败，原因:" + err.message);
      callback({
        type: "DeviceError",
        msg: "条形码扫描器初始化失败,原因：" + err
      });
    }
  }
  CancelScan(){
    _$("barcode").CancelScan();
  }
  ScanBarcode(){
    _$("barcode").ScanBarcode();
  }
}
const load = function () {
  if (!window.barcode) {
    window.barcode = new Barcode();
  }
};

export default {
  load
};
