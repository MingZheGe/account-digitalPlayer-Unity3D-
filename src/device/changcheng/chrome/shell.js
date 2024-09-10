/**
 * @author wangmx
 * @description 读写注册表的封装
 */

import pulginDevice from "./pulginDevice";

class shellEx {
  constructor() {
    pulginDevice.load();
  }
  // 下划线转换驼峰
  toHump(name) {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
  }
  RegRead(key) {
    let keyArr = key.split(/\\/g);
    // 取第一个元素进行转换 作为location 并做转换 HKEY 并将后面半段转成驼峰形式
    // 如HKEY_CURRENT_USER 转为 currentUser
    let first = keyArr[0];
    let location = this.toHump(first.substr(first.indexOf("_") + 1));
    // 移除一个元素
    keyArr.shift();
    // 取最后一个元素作为key
    let last = keyArr.pop();
    let path = "";
    _.each(keyArr, function (val) {
      path += val + "\\\\"
    })
    path = path.substr(0, path.length - 2);
    path = path.replace(/\\/g, "\\\\");
    console.log(path);
    let param = {
      "location": location,
      "path": path,
      "key": last,
      "value": "nothing"
    }
    return utyDevice.onExecPromise("readregarb", param);
  }
  RegWrite(fullPath, value) {
    let keyArr = fullPath.split(/\\/g);
    // 取第一个元素进行转换 作为location 并做转换 HKEY 并将后面半段转成驼峰形式
    // 如HKEY_CURRENT_USER 转为 currentUser
    let first = keyArr[0];
    let location = this.toHump(first.substr(first.indexOf("_") + 1));
    // 移除一个元素
    keyArr.shift();
    // 取最后一个元素作为key
    let last = keyArr.pop();
    let path = "";
    _.each(keyArr, function (val) {
      path += val + "\\\\"
    })
    path = path.substr(0, path.length - 2);
    path = path.replace(/\\/g, "\\\\");
    console.log(path);
    let param = {
      "location": location,
      "path": path,
      "key": last,
      "value": value
    }
    return utyDevice.onExecPromise("writeregarb", param);
  }
}

const load = function () {
  if (!window.shell) {
    window.shell = new shellEx();
  }
}
export default {
  load,
}
