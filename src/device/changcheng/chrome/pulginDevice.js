/**
 * 长城谷歌扩展接口的封装 ,通过这个js方法总体调用
 * @author wangmx
 */

import {
  Device,
  QtPlugins
} from "./common/base/plugins.umd";

import PluginList from "./common/base/plugins.json";

class dvPluginEx {
  constructor() {
    this.FilePlugin = QtPlugins.FilePlugin;
    this.methods = (PluginList);
    this.method = '';
    this.params = {};
    this.className = "GWI_Plugin";
    this.obj = 'GWI_Plugin';
  }
  //封装获取设备信息相关的demo
  initDeviePlugins(v) {
    this.method = v;
    if (this.methods[this.method]) {
      this.params = this.methods[this.method].params;
      if (this.methods[this.method].value == 'facecheck') {
        this.className = 'faceRecognitionplugins';
      } else if (this.methods[this.method].value == 'GWILog') {
        this.className = 'GWILog';
      } else {
        this.className = 'GWI_Plugin';
      }
    } else {
      this.params = {};
    }
  }
  //同步的方法，第二个参数，指定属性  格式按照plugins.json 里面的格式传，一定要按照指定的字段，不然可能有问题
  onExecPromise(p, param) {
    param = param || {};
    let that = this;
    that.initDeviePlugins(p);
    that.params = Object.assign({}, this.params, param);
    return new Promise((resolve, reject) => {
      that.FilePlugin.execPromise(that.obj, p, that.params, that.className).then(
        res => {
          if (res && res.success == "true") {
            if (that.method == "readregarb") {
              resolve(res.data[0]);
            } else {
              resolve(res);
            }
          } else {
            reject({
              msg: "执行失败"
            })
          }
        }
      ).catch(e => {
        reject(e);
      })
    })
  }

  //同步的方法，第二个参数，指定属性  格式按照plugins.json 里面的格式传，一定要按照指定的字段，不然可能有问题
  async onExec(p, param) {
    let that = this;
    param = param || {};
    that.initDeviePlugins(p);
    that.params = Object.assign({}, that.params, param);
    let re = await that.FilePlugin.execPromise(that.obj, p, that.params, that.className);
    return re;
  }
  getVtmDeviceInfo() {
    let that = this;
    return Promise.all([
      that.onExecPromise("getlocalip"),
      that.onExecPromise("getmac"),
      // that.onExecPromise("gethdid"),
      // that.onExecPromise("getcpuid"),
      // that.onExecPromise("getcomputername"),
    ]).then(res => {
      console.log("================================================设备信息start================================================");
      console.log(res);
      let deviceInfo = {
        MAC: '',
        LOCALIP: ''
      }
      let ipRes = res[0];
      let macRes = res[1];
      // 获取ip成功
      if (ipRes.success == "true" && macRes.success == "true") {
        let ipArr = ipRes.data ? ipRes.data.split(";") : [];
        let ipIndex = -1;
        _.each(ipArr, (item, index) => {
          // 打印机ip不统计
          if (item.indexOf("179.24") == -1) {
            ipIndex = index;
            deviceInfo.LOCALIP = item;
            return false;
          }
        })
        let macArr = macRes.data ? macRes.data.split("|") : [];
        if (ipIndex > -1) {
          deviceInfo.MAC = macArr[ipIndex];
        }
      }
      console.log("================================================设备信息end================================================");
      return deviceInfo;
    }).catch(err => {
      console.log("================================================获取设备信息失败================================================");
      return {
        MAC: '',
        LOCALIP: ''
      }
    })
  }
  //内存检查的
  restartClient() {
    console.log("内存检查的接口调用,暂时还没有这个接口");
  }
}
const load = function () {
  if (!window.utyDevice) {
    window.utyDevice = new dvPluginEx();
  }
}
export default {
  load,
}
