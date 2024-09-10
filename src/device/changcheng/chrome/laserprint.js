/**
 * @author liwei2 
 * @description 长城谷歌打印机模块js封装
 */
import DeviceEx from './common/device'
import printDeviceConf from "@/pages/imageAcquisition/common/print-device-conf";

class Laserprint extends DeviceEx {
  constructor() {
    super();
  }
  /**
   * 自定义封装函数
   */

  /**
   * 取消打印任务
   */
  cancelWait() {
    try {
      _$("baselaserprint").CancelWait();
    } catch (err) {
      console.error("取消打印机设备失败，原因：" + err.message);
    }
  }
  /**
   * @desc 初始化打印设备
   * callback({type: "printSuccess",msg: ""}) type: printError/printSuccess
   */
  initPrintDevice(callback) {
    let that = this;
    console.log("正在连接激光打印机－1－－－－－－－");
    try {
      /**
       *  //打印成功之后的回调函数
       */
      this.bindEvent("baselaserprintControlMediaOver", function () {
        siu.ControlGuideLightSync(10, 1);
        //打印成功之后的回调函数
        callback({
          type: "printSuccess",
          msg: "打印成功"
        });
        that.cancelWait();
      });
      this.bindEvent("baselaserprintMediaTaken", function () {
        siu.ControlGuideLightSync(10, 1);
        //打印成功之后的回调函数
        callback({
          type: "printSuccess",
          msg: "打印成功"
        });
        that.cancelWait();
      });

      this.bindEvent("baselaserprintOpenConnectionOver", function () {
        console.log('长城打印机打开成功-------------------')
        // 处理连接设备完成后的操作
        callback.call(that, {
          type: "OpenConnectionComplete",
          msg: '打开打印机链接成功'
        });
      });

      this.bindEvent("baselaserprintDeviceError", function (args) {
        callback({
          type: "HWError",
          msg: "执行:" + args.cmdName + "出错" + args.errorcode
        });
        try {
          that.cancelWait();
        } catch (err) {
          console.error("取消打印机设备失败，原因：" + err.message);
          that.closePrintDevice(false);
        }
      });

      _$("baselaserprint").OpenConnection("HtmPrinter310", 0);
      console.log("正在初始化激光打印机－2－－－－－－－");

    } catch (err) {
      console.error("打印机设备初始化失败，原因:" + err.message);
      callback({
        type: "printInitError",
        msg: "打印机设备初始化失败,原因：" + err
      });
    }
  }

  /**
   * @desc 创建打印文件
   */
  async createPrintFile(htmlSrc) {
    console.log("创建打印文件（createPrintFile）");
    try {
      htmlSrc = htmlSrc.replace(/@charset "UTF-8"/gi, '@charset "GB2312"')
                       .replace(/@charset "UTF-8"/gi, '@charset "GB2312"')
                       .replace(/charset="UTF-8"/gi, '@charset "GB2312"')
                       .replace(/charset='UTF-8'/gi, '@charset "GB2312"')
                       .replace(/charset 'UTF-8'/gi, '@charset "GB2312"');

      let res = await utyDevice.onExec("writefile", {
        "filename": "c:\\\\printFile\\\\printFile.html",
        "content": htmlSrc
      });

      console.log("创建打印文件：", res)
      console.dir(res)
      
      if (res && res.success == 'true') {
        console.log("创建打印的文件成功");
      } else {
        console.log("创建打印的文件失败1,错误码：" + res && res.errno);
      }
    } catch (err) {
      console.error("创建打印文件失败2,原因：" + err)
    }
  }

  /**
   * @desc 打印文件
   */
  printFile(clsPrintConf) {
    siu.ControlGuideLightSync(10, 8);
    console.log("打印文件（printFile）");
    try {
      console.log("正在设置激光打印机参数－3－－－－－－－");
      let setting = Object.assign({
          PaperNum: (clsPrintConf && clsPrintConf.pageNum) || "1", //打印总页数
          //不知道长城的抽什么风 之前是用作盖章类型 现在作为控制打印的方向 1是横向 2是纵向
          PrintType: (clsPrintConf && clsPrintConf.stampType) || printDeviceConf.printType,
          Stamp: (clsPrintConf && clsPrintConf.isStamp && "1") || "0", // 1-盖章，0-不盖章
          FileMode: (clsPrintConf && clsPrintConf.FileMode) || "multifile", //singlefile- 合并文件，multifile-不合并文件
          Mode: "file", //file-打印文件；buffer-打印文本
        }),
        /**
         * 打印的份数
         * 
         * ["c:\\\\printFile\\\\printFile.html","c:\\\\printFile\\\\printFile.html"]
         * 
         *  */
        numberCopies = new Array((clsPrintConf && clsPrintConf.numberOfCopy) || 1).fill("c:\\\\printFile\\\\printFile.html"),
        fielString = '';
      for (let _pathKey in numberCopies) {
        fielString += `File[${_pathKey}]=${numberCopies[_pathKey]};`
      };
      console.log(setting.PrintType)

      // _$("baselaserprint").SetRawData(setting, new Array((clsPrintConf && clsPrintConf.numberOfCopy) || 1).fill("c:\\\\printFile\\\\printFile.html"));
      _$("baselaserprint").SetRawData(`PaperNum=${setting.PaperNum};PrintType=${setting.PrintType};Stamp=${setting.Stamp};${fielString}WaitNum=1`);
      console.log("正在打印－4－－－－－－－");

      setTimeout(function () {
        console.log("1秒后开始执行ControlMedia")
        _$("baselaserprint").ControlMedia(1);
      }, 1000)
    } catch (err) {
      console.error("打印的时候打印机出异常了,错误：" + err);
    }
  }

  /**
   * @desc 关闭打印设备
   */
  closePrintDevice(flag) {
    try {
      _$("baselaserprint").CancelWait();
      if (flag) {
        _$("baselaserprint").CloseConnection();
      }
    } catch (e) {
      console.error("打印设备关闭失败,原因：" + e);
    }
  }


  /**
   * 处理设备状态的函数
   */
  handelWithDeviceStatus() {
    var deviceStatusResult,
      paperResult,
      tonerResult,
      stampResult,
      paperNumResult;

    deviceStatusResult = _$("baselaserprint").getAttribute("StDeviceStatus");
    paperNumResult = _$("baselaserprint").getAttribute("StPaperEx");
    paperResult = _$("baselaserprint").getAttribute('StMedia');
    tonerResult = _$("baselaserprint").getAttribute("StToner");
    stampResult = _$("baselaserprint").getAttribute("StInk");

    try {
      console.log("============获取设备的状态============" + deviceStatusResult);
      console.log("============获取纸张数量的状态============" + paperNumResult);
      console.log("============获取碳粉的状态============" + tonerResult);
      console.log("============获取印章油墨的状态============" + stampResult);

      if ("HEALTHY" !== deviceStatusResult && "BUSY" !== deviceStatusResult) {
        return {
          message: "打印机设备异常，原因：" +
            printDeviceConf.DeviceStatus[deviceStatusResult] || "未知",
          code: -1
        };
      } else if (!paperNumResult || !paperNumResult.includes("FULL")) {
        if (!paperNumResult || paperNumResult == "UNKNOWN") {
          return {
            message: "打印机纸盒纸量异常，原因：未知",
            code: -1
          };
        } else if (paperNumResult.includes("LOW")) {
          return {
            message: "打印机纸盒纸量偏少，请联系相关工作人员处理！",
            code: 0
          };
        } else {
          let printSta = paperNumResult.split("|")[0];
          return {
            message: "打印机纸盒纸量异常，原因：" + printDeviceConf["paperNumStatus"][printSta],
            code: -1
          };
        }
      } else if (paperResult && "PRESENT" !== paperResult) {
        return {
          message: "打印机纸盒纸量异常，原因：" +
            printDeviceConf.paperStatus[paperResult] || "未知",
          code: -1
        };
      } else if (!tonerResult || !tonerResult.includes("FULL")) {
        return {
          message: tonerResult.includes("LOW") ?
            "打印机墨粉不足，请联系工作人员进行处理！" : "打印机墨粉异常，原因：" +
            printDeviceConf[this.deviceType]["tonerStatus"] || "未知",
          code: tonerResult.includes("LOW") ? 0 : -1
        };
      } else if (!stampResult.includes("FULL")) {
        return {
          message: stampResult.includes("LOW") ?
            "打印机盖章油墨不足，请联系工作人员进行处理！" : "打印机盖章油墨异常，原因：" +
            printDeviceConf.LCstampStatus[stampResult] || "未知",
          code: stampResult.includes("LOW") ? 0 : -1
        };
      } else {
        return {
          message: "打印机正常",
          code: 1
        };
      }
    } catch (e) {
      return {
        message: "获取打印机状态异常,原因：" + e,
        code: -1
      };
    }
  }

}

const load = function () {
  if (!window.laserprint) {
    window.laserprint = new Laserprint();
  }
};


export default {
  load
};
