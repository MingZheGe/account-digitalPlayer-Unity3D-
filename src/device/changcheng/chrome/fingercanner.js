import Device from "./common/device";
import Vue from 'vue'
const vueInstance = new Vue();

// 指纹对接
class FingerScanner extends Device {
  constructor() {
    super();
    this.storePath = '';
    this.strage = {
      OpenConnectionOver: function () {
        console.log('OpenConnectionOver')
      },
      CloseConnectionOver: function () {
        console.log('CloseConnectionOver')
      },
      MediaPresented: function () {
        console.log('MediaPresented')
      },
      Timeout: function () {
        console.log('Timeout')
      },
      MediaTakend: function () {
        console.log('MediaTakend')
      },
      ReadImageComplete: function () {
        console.log('ReadImageComplete')
      },
      ResetComplete: function () {
        console.log("ResetComplete")
      },
      GetFingerTempleteOver: function () {
        console.log("GetFingerTempleteOver");
      },
      GetFingerFeatureOver: function () {
        console.log("GetFingerFeatureOver");
      },
      CompareFingerOver: function () {
        console.log("CompareFingerOver");
      },
      ErrorInfoReceived: function () {
        console.log("ErrorInfoReceived");
      },
      DeviceError: function () {
        console.log("DeviceError");
      },
      FingerPresentedEx: function () {
        console.log("FingerPresentedEx");
      },
      // storePath: "", //如果不传这个参数，则默认生菜在c盘下的这个路径
    };
  }
  //新增自己封装的底层方法
  handleWithPath(path, jointStr) {
    console.log('path入参：' + path)
    var arr = path.split('\\'),
      str = '';
    arr.forEach((item, index) => {
      if (index == arr.length - 1) {
        str += item;
        return;
      }
      str += (item + jointStr);
    })
    console.log(str)
    return str;
  }
  initFingerTuoch(strageObj) {
    let that = this;
    that.strageUser = strageObj ? Object.assign({}, that.strage, strageObj) : Object.assign({}, that.strage);
    try {
      that.bindEvent("fingerscannerOpenConnectionOver", function () {
        console.log("open ok!");
        //打开指纹灯
        siu.ControlGuideLightSync(14, 4)
        _.isFunction(that.strageUser.OpenConnectionOver) && that.strageUser.OpenConnectionOver.call(that);
      });
      that.bindEvent("fingerscannerDeviceError", function (args) {
        console.log("执行:" + args.cmdName + "出错" + args.errorcode);
        _.isFunction(that.strageUser.DeviceError) && that.strageUser.DeviceError.call(that, "执行:" + args.cmdName + "出错" + args.errorcode);
      });
      that.bindEvent("fingerscannerGetFingerTempleteOver", async function (args) {
        //录完指纹特征就要保存下来了
        console.log("录入指纹完成！");
        var datalen = args.datalen;
        var outdata = args.outdata;
        //这个是默认生产的bmp文件 ，默认生成路径为=c:\\\\finger.bmp
        let saveResult = _$("fingerscanner").SaveFingerDataSync(datalen, outdata);
        console.info(saveResult);
        saveResult = JSON.parse(saveResult);
        let result = {
          datalen: args.datalen,
          outdata: args.outdata,
          saveResult: saveResult.result
        };
        console.log("原始的保存的数据成功之后");
        //关闭指纹灯
        siu.ControlGuideLightSync(14, 1)
        //通过resultdata.saveResult 的值，传给回调，告诉调用的信息，这个是否是写入成功了
        _.isFunction(that.strageUser.GetFingerTempleteOver) && that.strageUser.GetFingerTempleteOver.call(that, result);
      })
      that.bindEvent("fingerscannerGetFingerFeatureOver", function (args) {
        console.log("输入指纹特征完成！");
        let result1 = {
          outdata: args.outdata,
          datalen: args.datalen
        };
        _.isFunction(that.strageUser.GetFingerFeatureOver) && that.strageUser.GetFingerFeatureOver.call(that, result1);
      })

      that.bindEvent("fingerscannerCompareFingerOver", function (args) {
        let result = "";
        if (args.MatchResult == -1) {
          result = "比对失败";
        } else if (args.MatchResult == -2) {
          result = "没有找到指纹模板文件";
        }
        console.log("对比指纹数据结果:" + result);
        _.isFunction(that.strageUser.CompareFingerOver) && that.strageUser.CompareFingerOver.call(that, args.MatchResult, that.storePath);
      })

      that.bindEvent("fingerscannerFingerPresentedEx", function () {
        console.log("fingerscannerFingerPresentedEx");
        _.isFunction(that.strageUser.FingerPresentedEx) && that.strageUser.FingerPresentedEx.call(that);
      })
      that.initNativeBridge('fingerscanner', 'FingerScanner310');
    } catch (e) {
      console.error("初始化指纹仪设备失败:" + e);
    }
  }
  //指纹录入模块初始化
  getFingerModel(success, fail, openConnection, checkFinger) {
    this.initFingerTuoch({
      DeviceError: function (cmdName) {
        vueInstance.$notify({
          title: '录入错误，请重试！',
        });
        //失败就调一下重置方法
        console.log('this')
        console.dir(this)
        // this.Reset();
        fail(cmdName)
      },
      FingerPresentedEx: function () {
        //获取模板时需要按三次
        //检测手指
        checkFinger.call(this, arguments);
      },
      OpenConnectionOver: function () {
        //打开指纹设备ok
        openConnection.call(this, arguments);
      },
      GetFingerTempleteOver: function (arg) {
        console.log("devicetest，模板 获取完成了，保存的的效果")
        console.log("deviceTest ===", arg.datalen);
        console.log("devicetest == ", arg.outdata);
        if (arg.saveResult == "0") {
          vueInstance.$notify({
            title: '指纹录入成功',
          });
          success(1, "devicetest保存成功");
        } else {
          //失败就调一下重置方法
          // this.Reset();
          fail("devicetest保存失败");
        }
      },
      GetFingerFeatureOver: function (arg) {
        console.log("devicetest，特征 获取完成了")
        console.log("deviceTest ===长度" + arg.datalen);
        console.log("deviceTest ===数据" + arg.outdata);
        success(2, "devicetest，特征 获取完成了")
      },
      CompareFingerOver: function (arg, path) {
        //  0：比对成功；-1：与上次的特征比对失败； -2：没有找到指纹模板文件。
        console.log("devicetest，对比结果")
        console.log("deviceTest ===" + arg);
        let newPathArr = path.split("/"),
          oa = newPathArr[2].split('.')[0].split('-')[0];
        success(3, arg, oa, path)
      }
    })
  }
  //指纹模板登记
  getFingerTemp(filePath) {
    try {
      this.storePath = filePath.replace(/\\/g, "/");
      console.log("开始调用指纹模板登记的方法:" + this.storePath);
      _$("fingerscanner").GetFingerTemplete(this.storePath, 0);
    } catch (e) {
      console.error("获取指纹模板失败,原因：" + e)
    }
  }
  //指纹特征获取
  getFingerSpecial() {
    try {
      _$("fingerscanner").GetFingerFeature();
    } catch (e) {
      console.log("获取模板特征失败,原因：" + e)
    }
  }
  fingerCompaireWithLocal(path) {
    try { //默认会生成的到这个路径下边
      console.info("即将要对比的路径:" + path);
      this.storePath = path;
      _$("fingerscanner").CompareFinger(path);
    } catch (e) {
      console.error("指纹对比失败原因：" + e)
    }
  }
  handleWithComparePath = (fingerObj, path) => {
    let newPath = "C:/finger/" + path + '.bmp';
    console.log('fielPathArr[i]：' + newPath)
    fingerObj.fingerCompaireWithLocal(newPath);
  }
  //指纹对比
  compareFingerData = (filePathArr, onSuccess, onFail, fingerInstance, curNum = 0) => {
    console.log("---------------- " + curNum)
    //首先获取指纹特征
    var fingerObj = null;
    let that = this;
    console.log('当前指纹对象实例：' + fingerInstance)
    console.dir(fingerInstance)
    if (fingerInstance) {
      fingerInstance.getFingerSpecial();
      return;
    }
    //初始化对象
    that.getFingerModel(function (type, arg, oa, matchPath) {
      console.log('type: ' + type)
      if (type == 2) { //指纹特征获取成功
        console.log('获取指纹特征成功')
        console.log('curNum ' + curNum)
        console.log('filePathArr')
        console.dir(filePathArr)
        that.handleWithComparePath(fingerObj, filePathArr[curNum])
      } else if (type == 3) {
        //指纹对比成功
        console.dir('指纹对比成功')
        console.dir(arg)

        if (arg == 0) {
          console.log("matchPath: " + matchPath)
          // curNum = filePathArr.length;
          curNum = 0;
          onSuccess(3, oa, matchPath)
        } else {
          curNum++;
          if (curNum < filePathArr.length) {
            console.log('curNum ' + curNum)
            console.log('filePathArr')
            console.dir(filePathArr)
            that.handleWithComparePath(fingerObj, filePathArr[curNum])
          } else {
            curNum = 0;
            onFail('无匹配');
          }
        }
      }

    }, function (err) {
      //失败回调
      onFail(err);
    }, function () {
      //获取指纹特征
      onSuccess.call(this, 'openOk');
      fingerObj = this;
      this.getFingerSpecial();
    });
  }

  //指纹删除
  removeFingerData = async (fingerPath, onSuccess, onFail) => {
    //删除文件的接口
    var res = await utyDevice.onExec("deletefile", {
      filename: fingerPath,
    });
    if (res) {
      console.warn("删除指纹成功")
    } else {
      console.error("删除指纹失败");
    }
  }
  CloseDevice() {
    try {
      _$("fingerscanner").CloseConnection();
      //关闭指纹灯
      siu.ControlGuideLightSync(14, 1)
    } catch (e) {
      console.error("关闭连接失败,原因：" + e)
    }
  }
}

const load = function () {
  if (!window.fingerscanner) {
    var fingerscanner = new FingerScanner();
    window.fingerscanner = fingerscanner;
  }
}

export default {
  load,
}
