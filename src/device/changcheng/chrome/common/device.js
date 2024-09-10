/**
 * @author liwei2
 * @description 封装长城谷歌底层基础js
 */

import {
  Device,
  QtPlugins
} from "./base/plugins.umd";

import Vue from 'vue'

/** 全局消息总线 */
window.EventBus = new Vue({});

/**
 * 全局事件绑定 可覆盖原有事件
 */
window.EventBus.bindEvent = function (event, bindfunction, target) {
  let eventBus = window.EventBus;
  if (eventBus._events && eventBus._events[event]) {
    console.info("eventBus bindEvent off first: " + event);
    eventBus.$off(event);
  }
  eventBus.$on(event, params => {
    bindfunction.apply(target || eventBus, [params]);
  });
};

/**
 * 全局事件解绑
 */
window.EventBus.unbindEvent = function (event) {
  let eventBus = window.EventBus;
  if (eventBus._events && eventBus._events[event]) {
    console.info("eventBus bindEvent off: " + event);
    eventBus.$off(event);
  }
};

class DeviceEx {
  constructor() {
    this._$ = Device._$;
    this.g_siu_speed = 4;
    this.g_pboc_path = "C:\\gwixfs\\ocx\\";
  }
  showResult(info) {
    console.log(info)
  }
  bindEvent(cmder, cb) {
    window.EventBus.bindEvent(cmder, cb);
  }
  initNativeBridge(moduleName, logicName) {
    // 打开连接
    _$(moduleName).OpenConnection(logicName, 0);
  }
}

export default DeviceEx;
