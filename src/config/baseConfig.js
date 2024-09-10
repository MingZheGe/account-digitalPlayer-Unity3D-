/**
 * 基础配置文件、中台地址、平台、版本等内容。
 * @author  lij
 */
import defineConfig from "./defineConfig";

let parseUrl = function () {
    let protocol = window.location.protocol;
    let host = window.location.host;
    return protocol + '//' + host + "/kmsp/";
};
// 后台系统地址
 window.ajaxUrl = parseUrl();
//window.ajaxUrl = "http://10.203.88.49:8088/kmsp/";
let httpConfig = {
    baseUrl: window.ajaxUrl + 'services/RestService'
}
let updateUrl = httpConfig.baseUrl.replace("services/RestService", "appUpdate");
window.isValidSession = "0";
let kmspUrl = httpConfig.baseUrl.replace("services/RestService", "");
// 设备平台标识
let platform = typeof cordova === 'undefined' ? 'vtm' : cordova.platformId;
let isMobileFlag = platform === "vtm" ? false : true;
// 一柜通券商版本标识，为空默认为标准版
let qsVersion = defineConfig.$definecfg.QSJGDM_CONST.YINHE;
// U版 还是W版
let isWin = false;
//是否采用国密加密
let isSm4Encrypt = false;
//是否是生产环境 谷歌浏览器调试时记得改为false
let isProd = false;
let isStandard = true;

let bizPlatform = "1"; // 0：预约；1：预受理

let runtimeType = "normal"; // normal：正常运行模式；record：记录请求数据模式；mock：模拟请求数据模式

// 科大讯飞语音服务地址
let audioUrl = "http://127.0.0.1:8769";
let localUrl = "D:\\kdspeechserver\\temp\\voice"
let baseRecordUrl = "D:/KIOSK/Camera"
let baseVideoPath = "D:/KIOSK/video"
let basePdfUrl = "D:/KIOSK/pdf"
const baseConfig = {
    httpConfig,
    platform,
    qsVersion,
    runtimeType,
    isWin,
    isSm4Encrypt,
    isMobileFlag,
    isProd,
    bizPlatform,
    updateUrl,
    isStandard,
    audioUrl,
    localUrl,
    kmspUrl,
    baseVideoPath,
    baseRecordUrl,
    basePdfUrl
};

const plugin = {
    install(Vue) {
        // 添加全局方法或属性
        Vue.basecfg = baseConfig;
        // 添加实例方法
        Vue.prototype.$basecfg = baseConfig;
    },
    $basecfg: baseConfig,
};

export default plugin;
export const install = plugin.install;
