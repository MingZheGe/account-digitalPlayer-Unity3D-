//长城谷歌中间件
import ccChromeCamera from "./changcheng/chrome/camera";
import ccChromeFinger from "./changcheng/chrome/fingercanner";
import ccChromeHighcamera from "./changcheng/chrome/highcamera";
import ccChromeBankCard from "./changcheng/chrome/magcardex"
import ccChromeIdCard from './changcheng/chrome/idcard';
import ccChromeSiu from './changcheng/chrome/siu';
//import ccChromePrinter from './changcheng/chrome/laserprint';
import ccChromeReceipt from './changcheng/chrome/receipt';
import ccChromeUty from './changcheng/chrome/pulginDevice';
import ccChromeCameraYc from './changcheng/chrome/cameraYc';
import ccChromeInput from './changcheng/chrome/ccChromeInput';
import ccShell from './changcheng/chrome/shell'
import ccNonConcat from './changcheng/chrome/nonConcatCard'
import CCbarcode from "./changcheng/chrome/barcode"; //二维码扫描仪
// import encryptor from './changcheng/chrome/encryptorTest'

const deviceObj = {
  "changcheng": {
    "chrome": [
      ccChromeCamera,
      ccChromeFinger,
      ccChromeHighcamera,
      ccChromeBankCard,
      ccChromeIdCard,
      ccChromeSiu,
     // ccChromePrinter,
      ccChromeReceipt,
      ccChromeUty,
      ccChromeCameraYc,
      ccChromeInput,
      ccShell,
      ccNonConcat,
      CCbarcode,
      // encryptor
    ]
  },
}

const commonFunction = function (cmder, devicePath, vueInstance) {
  let deviceType = devicePath.split("/")[0],
    devicePath_ = devicePath.split("/")[1];
  deviceObj[deviceType][devicePath_].map(device => {
    let st = _.isFunction(device[cmder]) && device[cmder](vueInstance) || '1';
    if (cmder == 'init' && !st) {
      console.error('device 设置逻辑名打开链接失败，重试中...')
      device[cmder](vueInstance);
    }
  });
}

export default {
  load(devicePath) {
    commonFunction('load', devicePath)
  },
  init(devicePath, vueInstance) {
    commonFunction('init', devicePath, vueInstance)
  }
}
