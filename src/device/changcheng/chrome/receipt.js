/**
 * @author liwei2
 * @description 长城谷歌凭条
 */
import Device from './common/device'
class Receipt extends Device {
  constructor() {
    super();
    this.AttrList = {
      'ServiceName': 'ReceiptPrinter310',
      'Binnum': '0',
      'InstanceName': '',
      'alignment': '0',
      'offsetX': '0',
      'offsetY': '0',
      'resolution': '2',
      'dwMediaControl': '4'
    };
    this.strage = {
      OpenConnectionComplete: function () {
        console.log('OpenConnectionComplete')
      },
      CloseConnectionComplete: function () {
        console.log('CloseConnectionComplete')
      },
      FatalError: function () {
        console.log('FatalError')
      },
      HWError: function () {
        console.log('PauseTakePictureOver')
      },
      GetDataComplete: function () {
        console.log('GetDataComplete')
      },
      GetPinComplete: function () {
        console.log('GetPinComplete')
      },
      EjectComplete: function () {
        console.log('EjectComplete')
      },
      InitializeComplete: function () {
        console.log('InitializeComplete')
      },
      ResetComplete: function () {
        console.log("ResetComplete")
      },
      PrintFormComplete: function () {
        console.log("PrintFormComplete");
      },
      PrintRawDataComplete: function () {
        console.log("PrintRawDataComplete");
      },
    };
  }

  //自定义函数
  getAttribute(key) {
    return _$("receipt").getAttribute(key);
  }
  PrintForm(formName, mediaName, fields, timeout) {
    if (siu) {
      siu.ControlGuideLightSync(4, this.g_siu_speed);
    };
    _$("receipt").PrintForm(formName, mediaName, this.AttrList.alignment, this.AttrList.offsetX, this.AttrList.offsetY, this.AttrList.resolution, this.AttrList.dwMediaControl, fields, timeout);
  }
  printFormAsyncEx(formName, formMedia, fieldsObj, Time) {
    let Timeout = Time || 0;
    //打印表单，把相应的表单打印出来 长城这边，直接就是切纸的了，不用再调用切纸事件，不过这个待确定
    try {
      // var fields = 'custName=客户姓名:王秀键&custCode=资金号:110000000000&busiName=业务名称:创业板&time=打印时间：2012/11/07 18:46:32&custOrg=营业网点:深圳市宝安支行&deviceID=设备名称：VTM自助设备001';
      //-------------看这里----------------------
      //注意，长城这边暂时不需要调用切纸的方法，打印的方法，默认就会切纸了，不用调用其他的东西了
      let fields = "";
      // let fields = "custName=客户姓名：王秀键&custCode=客户号:110090383738&b_sno=流水号：201904080001&orgName=网点名：深圳宝安支行&deviceName=设备名称：c001号";
      for (let key in fieldsObj) {
        fields = fields + key + "=" + fieldsObj[key] + "&";
      }
      //把最后的一个 & 字符去除
      fields = fields.substring(0, fields.length - 1);

      console.log(fields);
      console.log("js开始打印form" + fields);
      console.log(formName, formMedia);
      receipt.PrintForm(formName, formMedia, fields, Timeout);
    } catch (e) {
      console.error("打印拼条from失败" + e);
    }
  }
  printReceiptForm(fieldsObj, success, fail, notUseCache) {
    this.strage.fieldsObj = fieldsObj;
    this.getObjCache(success, fail, notUseCache);
  }
  getObjCache(success, fail, notUseCache) {
    this.initReceipt({
      PrintFormComplete: function (arg) {
        console.log("deviceTest打印.form文件完成 aaaaaaa");
        success(0)
      },
      PrintRawDataComplete: function (arg) {
        console.log("deviceTest打印html表单完成 aaaaaaa")
      },
      EjectComplete: function (arg) {
        console.log("deviceTest弹出纸张完成 aaaaaa");
        success(1)
      },
      MediaListOver: function (arg) {
        console.log("deviceTest媒介获取完成了");
      },
      FormListOver: function (arg) {
        console.log("deviceTest列表获取完成")
      },
      HWError: function (deviceErrObj) {
        console.log("deviceTest设备异常"); //进行设备异常后的操作
        if (deviceErrObj.deviceErr && deviceErrObj.deviceErr != "") {
          fail("设备故障" + deviceErrObj.deviceErr);
        }
        if (deviceErrObj.StPaper && deviceErrObj.StPaper != "") {
          if (deviceErrObj.StPaper == "PAPEROUT") {
            fail("凭条打印机纸张用完了")
          }
          if (deviceErrObj.StPaper == "PAPERJAMED") {
            fail("凭条打印机卡纸")
          }
        }
      },
    })
  }
  initReceipt(strageObj) {
    let that = this;
    that.strageUser = strageObj ? Object.assign({}, that.strage, strageObj) : Object.assign({}, that.strage);
    try {
      receipt.bindEvent("receiptOpenConnectionOver", function () {
        console.log("open ok!");
        //获取form的列表
        console.log("获取相应的设备状态");
        let StDeviceStatus = receipt.getAttribute('StDeviceStatus');
        let StPaper = receipt.getAttribute('StPaper');
        let StMedia = receipt.getAttribute('StMedia');
        console.log("卡机设备状态StDeviceStatus:" + StDeviceStatus);
        console.log("纸源状态StPaper :" + StPaper);
        console.log("纸张状态StMedia:" + StMedia);
        let deViceErrorObj = {
          deviceErr: "",
          StPaper: "",
        }
        //设备异常的处理
        //HEALTHY : 正常 FATAL : 故障 BUSY : 忙 NODEVICE : 无设备
        if (StDeviceStatus != "HEALTHY") {
          console.log("设备故障");
          deViceErrorObj.deviceErr = StDeviceStatus;
          _.isFunction(that.strageUser.HWError) && that.strageUser.HWError.call(that, deViceErrorObj);
          return;
        }
        //PAPERFULL : 纸满  PAPERLOW : 纸少 PAPEROUT : 缺纸  PAPERNOTSUPP : 纸检测不支持 PAPERUNKNOWN : 纸状态不确定 PAPERJAMED : 卡纸
        if (StPaper == "PAPEROUT" || StPaper == "PAPERJAMED") {
          deViceErrorObj.StPaper = StPaper;
          _.isFunction(that.strageUser.HWError) && that.strageUser.HWError.call(that, deViceErrorObj);
          return;
        }
        that.printFormAsyncEx("yhForm", "yhMedia", that.strageUser.fieldsObj, 0)
      })
      receipt.bindEvent("receiptMediaTaken", function () {
        siu.ControlGuideLightSync(4, 1);
        console.log("纸张被弹出后，检测到纸张被取走");
        _.isFunction(that.strageUser.EjectComplete) && that.strageUser.EjectComplete.call(that);
      })
      receipt.bindEvent("receiptFormListOver", function (args) {
        console.log("---------------获取form的列表完成了");
        console.log(args);
        _.isFunction(that.strageUser.FormListOver) && that.strageUser.FormListOver.call(that);
      })
      receipt.bindEvent("receiptMediaListOver", function (args) {
        console.log("---------------获取MediaList完成---------------" + args);
        _.isFunction(that.strageUser.MediaListOver) && that.strageUser.MediaListOver.call(that);
      })
      receipt.bindEvent("receiptPrintFormOver", function () {
        console.log("js打印完成");
        _.isFunction(that.strageUser.PrintFormComplete) && that.strageUser.PrintFormComplete.call(that);
      })
      receipt.bindEvent("receiptDeviceError", function (args) {
        console.log("执行:" + args.cmdName + "出错" + args.errorcode);
        let error = {
          deviceErr: args.errorcode
        }
        _.isFunction(that.strageUser.HWError) && that.strageUser.HWError.call(that, error);
      })

      receipt.initNativeBridge('receipt', 'ReceiptPrinter310');
    } catch (e) {
      console.error("初始化拼条打印设备失败:" + e);
    }
  }
}


const load = function () {
  if (!window.receipt) {
    window.receipt = new Receipt();
  }
}



export default {
  load,
}
