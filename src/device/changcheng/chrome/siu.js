/**
 * @author liwei2
 * @description 长城谷歌siu人体感应模块
 */
/**
 *  ControlGuideLightSync(Index, fwCommand, TimeOut)
 *  Index
 *  0. 读卡器
 *  1. 密码键盘
 *  2. 证件扫描
 *  3. 高拍仪补光
 *  4. 凭条口
 *  9. 广告灯
 *  10. 表单出口
 *  12. 文件扫描回收
 *  15. 身份证读卡
 * 
 *  fwCommand
 *  存在 1 关闭 4 慢 8 中 16 快 128 连续
 * 
 */
import Device from './common/device'
class Siu extends Device {
  constructor() {
    super();
  }
  SetSIUEventSync(EventType, EventIndex, EventValue) {
    _$("siu").SetSIUEventSync(EventType, EventIndex, EventValue);
  }
  ControlGuideLightSync(Index, fwCommand, TimeOut) {
    console.error("进入了siu模块")

    _$("siu").ControlGuideLightSync(Index, fwCommand, TimeOut);
  }
  CloseAllSync() {
    // _$("siu").CloseAllSync();
    let allGuideLightIndex = [0, 1, 2, 3, 4, 9, 10, 11, 12, 15];
    allGuideLightIndex.forEach(function(item) {
      _$("siu").ControlGuideLightSync(item, 1);
    })
  }
}
const load = function () {
  if (!window.siu) {
    window.siu = new Siu();
  }
};

const init = function (vueInstance) {
  siu.bindEvent("siuDeviceError", function (args) {
    vueInstance.alert('人体感应初始化失败');
    console.error("系统硬件错误:" + args);
  });
  siu.bindEvent("siuOpenConnectionOver", function () {
    console.log("siuOpenConnectionOver");
    console.log("打开设备完成!,现在设置人体感应事件");
    // siu.SetSIUEventSync(1, 5, 1);
    _$('siu').execute("SetSIUEventSync", {
      EventType: "1",
      EventIndex: "5",
      EventValue: "1",
      TimeOut: 5000
    });

  });
  siu.bindEvent("siuPortStatusChanged", function (args) {
    console.log("人体感应 " + " 类型:", args.PortStatus);
    //vueInstance.$store.commit("UPDATE_HAS_PERSON", args.PortStatus);
    callback({
      type: "changePeople",
      msg: "111"
    })
  });

  siu.bindEvent("siuStatusChanged", function (args) {
    console.log("siuStatusChanged");
    console.dir(args);
  });


  siu.initNativeBridge('siu', 'SIU310');
  return true;
}

export default {
  load,
  init
};
