/**
 * 长城输入法的封装 @wangmx
 */

import pulginDevice from "./pulginDevice";

// 输入框
class ccChromeInput {
  constructor() {
    pulginDevice.load();
  }
  keyboardShow(offsetY) {
    let width = 900;
    let height = 400;
    let left = (document.body.clientWidth - width) / 2;
    let top = "";
    if (offsetY && offsetY > document.body.clientHeight / 2) {
      top = 50;
    } else {
      top = document.body.clientHeight - height - 10;
    }
    // skbord.KeyMode(3); //设置输入模式(1-英文,2-手写板,3-拼音,4-五笔)
    // console.log("当前设置的参数",width,height,left,top,document.body.clientHeight);
    // this.skbord.SetPos(left, top, width, height, 1);
    let positionStr = "-x " + left + " -y " + top + " -cx " + width + " -cy " + height;
    let param = {
      path: "C:/KIOSK/TermTools/gwiwrite",
      "file": "GWIIMEApp.exe",
      "waitfor": "false",
      "param": positionStr,
    }
    utyDevice.onExec("exec", param)
  }
  keyboardHide() {
    let param = {
      path: "C:/KIOSK/TermTools/gwiwrite",
      "file": "GWIIMEApp.exe",
      "waitfor": "false",
      "param": "-hide ",
    }
    utyDevice.onExec("exec", param)
  }
}
/**
 * 后续输入法用skbord来做全局变量
 */
const load = function () {
  if (!window.skbord) {
    let skbord = new ccChromeInput();
    window.skbord = skbord;
  }
}

const init = function () {
  skbord.keyboardHide();
}

export default {
  load,
  init,
}
