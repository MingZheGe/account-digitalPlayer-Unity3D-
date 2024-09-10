// 密码键盘

import Device from "./common/device";

// 人脸识别摄像头
class encryptor extends Device {
    constructor() {
        super();
        this.maxLength = 8; // 密码最大长度
        this.minLength = 6; // 密码最小长度
        this.isAuto = 0; // 是否自动调用InputPINOver事件  0 不自动调用 1 自动调用
        this.map = {
            0x00000001: "0",
            0x00000002: "1",
            0x00000004: "2", 
            0x00000008: "3",
            0x00000010: "4",
            0x00000020: "5",
            0x00000040: "6",
            0x00000080: "7",
            0x00000100: "8",
            0x00000200: "9"
        }
    }
    initEncryptor(callback, pwdValue) {
        let that = this;
        that.pwdValue = pwdValue;
        that.bindEvent("pinpadLoadKeyOver", function (args) {
            console.log("pinpadLoadKeyOver ==== &&&&&&&&&&&&&&&&&&&&&" + JSON.stringify(args));
            that.inputData();
        });
        that.bindEvent("pinpadKeyPressed", function (args) {
            console.log("pinpadKeyPressed ==== &&&&&&&&&&&&&&&&&&&&&" + JSON.stringify(args));
            // 取消怎么做 取消键  key27
            if (args.KeyCode == 0x00000800) {
                that.pwdValue = "";
                callback({
                    type: "cancle"
                })
                console.log("取消哦");
            }
            // 确认怎么做 确认键 13
            else if (args.KeyCode == 0x00000400){
                callback({
                    type: "confirm"
                })
                console.log("确认哦");
            } 
            // 其他功能键不做处理
            else if (args.KeyCode == 0x00001000 
                || args.KeyCode == 0x00002000
                || args.KeyCode == 0x00010000) {
                    //
            }
            // 其他键 其他键
            else {
                console.log("其他数据=====&&&&&&&&&&&&&&&&&&&&&" + JSON.stringify(args));
                that.pwdValue = that.pwdValue + that.map[args.KeyCode];
                callback({
                    value: that.pwdValue,
                    type: "value"
                });
            }
        });
        that.bindEvent("pinpadInputDataOver", function (args) {
            console.log("&&&&&&&&&&&&&&&&&&&&&pinpadInputDataOver ======" + JSON.stringify(args));
        });
        that.bindEvent("pinpadOpenConnectionOver", function (args) {
            console.log("&&&&&&&&&&&&&&&&&&&&&pinpadOpenConnectionOver ======" + JSON.stringify(args));
            that.loadKey();
        });
        that.bindEvent("pinpadCancelInputOver", function (args) {
            console.log("&&&&&&&&&&&&&&&&&&&&&pinpadCancelInputOver");
        })
        that.bindEvent('pinpadTimeOut', function (args) {
            console.log("&&&&&&&&&&&&&&&&&&&&&pinpadTimeOut =======" + JSON.stringify(args));
        })
        that.initNativeBridge('pinpad', 'Encryptor310');
    }
    // 加载秘钥
    loadKey() {
        _$("pinpad").LoadKey("PIN", "0123456789ABCDEF08192A3B4C5D6E7F", 1);
    }
    inputData() {
        _$("pinpad").InputData(30000, 8191);
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