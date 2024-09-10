// 密码键盘

import Device from "./common/device";

// 人脸识别摄像头
class encryptor extends Device {
    constructor() {
        super();
        this.isAuto = 0; // 是否自动调用InputPINOver事件  0 不自动调用 1 自动调用
        this.maxLength = 8; // 密码最大长度
        this.minLength = 6; // 密码最小长度
        this.cardNum = "0000000000000000000"; // pinblock的加密串 尽量设置19位   去除后面两位后  往前数12位 用作异或操作
        this.isCustCancle = true;
    }
    initEncryptor(callback, pwdValue) {
        let that = this;
        that.isCustCancle = true;
        that.bindEvent("pinpadLoadKeyOver", function (args) {
            console.log("pinpadLoadKeyOver ==== " + JSON.stringify(args));
            that.inputPIN();
        });
        that.bindEvent("pinpadKeyPressed", function (args) {
            console.log("pinpadKeyPressed ==== " + JSON.stringify(args));
            // 取消怎么做 取消键  key27
            if (args.KeyCode == 0x00000800) {
                // 
            }
            // 确认怎么做 确认键 13
            else if (args.KeyCode == 0x00000400){
                // 
            } 
            // 其他功能键不做处理
            else if (args.KeyCode == 0x00001000 
                || args.KeyCode == 0x00002000
                || args.KeyCode == 0x00010000) {
                    //
            }
            // 其他键 其他键
            else {
                pwdValue += "*"; 
                callback(pwdValue)
            }
        });
        that.bindEvent("pinpadOpenConnectionOver", function (args) {
            console.log("pinpadOpenConnectionOver ======" + JSON.stringify(args));
            that.loadKey();
        });
        that.bindEvent("pinpadInputPINOver", function (args) {
            console.log("pinpadInputPINOver =======" + JSON.stringify(args));
            // 调用了 pinpadInputPINOver
            // 调用失败   
            let lpbuffer = args.lpbuffer;
            if (lpbuffer.usDigits == 0 && that.isCustCancle) {
                pwdValue = ""; 
                callback(pwdValue)
            } 
            // 不是客户手动触发的  还是需要获取 值
            else if (lpbuffer.usDigits == 0 && !that.isCustCancle) {
                that.getPINBlock();
            }
            // 调用成功 
            else {
                that.getPINBlock();
            }
        });
        that.bindEvent("pinpadCancelInputOver", function (args) {
            that.getPINBlock();
        })
        that.bindEvent('pinpadTimeOut', function (args) {
            console.log("pinpadTimeOut =======" + JSON.stringify(args));
            pwdValue = ""; 
            callback(pwdValue)
        })
        that.bindEvent('pinpadGetPINBlockOver', function (args) {
            console.log("pinpadGetPINBlockOver =======" + JSON.stringify(args));
            that.getLastResult(args.PINBlock);
        })
        that.bindEvent('pinpadDecryptOver', function (args) {
            console.log("pinpadDecryptOver =======" + JSON.stringify(args));
            // 这里之后执行异或操作
            let inputValue = args.CryptData;
            if (inputValue) {
                pwdValue = inputValue.substr(2, inputValue.substr(0,2));
                callback(pwdValue);
            }
        })
        that.initNativeBridge('pinpad', 'Encryptor310');
    }
    // 加载秘钥
    loadKey() {
        _$("pinpad").LoadKey("PIN_ENC", "0123456789ABCDEF08192A3B4C5D6E7F", 1);
    }
    // 开始输入值
    inputPIN() {
        // minlen maxlen  0 不自动触发 1 自动触发over事件
        _$("pinpad").InputPIN(this.maxLength, this.minLength, this.isAuto);
    }
    // 取消输入
    cancelInput() {
        this.isCustCancle = false;
        _$("pinpad").CancelInput();
        this.getPINBlock();
    }
    // 获取PINBLock
    getPINBlock() {
        // 选择工作区间 密钥槽 1 位加密
        _$("pinpad").SelectWorkKeySync(1);
        // 一般采用 ANSI编码-0x0002
        _$("pinpad").GetPINBlock(this.cardNum, 0x0002);
    }
    getLastResult(pinPlockData) {
        // 1 为密钥槽  0x0040 为解密方式
        _$("pinpad").Decrypt(pinPlockData, 1, "", "", 0x0040);
        // 得到数据后再进行 异或 操作 如果输入的不是全 0  则需要再做一次异或
    }
} 
const load = function () {
    if (!window.encryptor) {
        window.encryptor = new encryptor();
    }
}
export default {
    load,
}