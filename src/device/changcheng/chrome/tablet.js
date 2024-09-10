import Device from "./common/device";
// 长城签名封装

class tablet extends Device {
    constructor() {
        super();
        // 参数列表 default
        this.strageUser = {
            timeout:0,
            dlgy:100,
            dlgw:800,
            dlgh:200,
            dlgx:30,
            imgx:30,
            imgy:30,
            imgw:800,
            imgh:500,
            pathname: "D:/KIOSK/Tablet/sign.jpg",
            wintype:"",
            lpszTrackFile: "D:/KIOSK/Tablet/sign.txt",
        };
    }
    /**
     * 下方是自己封装的方法,把相应的回调方法暴露出去
     */
    TabletInstance(callback, strageUser) {
        let that = this;
        that.strageUser = Object.assign({}, that.strageUser, strageUser);
        console.log("设置的参数情况: " + JSON.stringify(taht.strageUser))
        try{
            // 打开连接over事件
            that.bindEvent("tabletOpenConnectionOver", function() {
                console.log("打开连接成功");
                that.startSignTable();
                callback({
                    type: "OpenConnectionOver",
                    msg: "连接签名板成功..."
                })
            });
            // 签名接口打开完成事件
            that.bindEvent("tabletStartSignExOver", function() {
                console.log("打开签字板成功")
                callback({
                    type: "StartSignOver",
                    msg: "签名板打开成功逻辑..."
                });
            })
            that.bindEvent("tabletClearSignOver", function() {
                console.log("清除签名信息成功")
                callback({
                    type: "ClearSignOver",
                    msg: "清除签名信息成功"
                })
            })
            // 关闭预览窗口成功
            that.bindEvent("tabletStopSignOver", function() {
                console.log("关闭预览窗口成功");
                _$("tablet").CloseConnection();
                callback({
                    type: "StopSignOver",
                    msg: "关闭预览窗口成功"
                })
            })
            // 关闭连接成功
            that.bindEvent("tabletCloseConnectionOver", function() {
                console.log("关闭连接成功");
                callback({
                    type: "CloseConnectionOver",
                    msg: "关闭连接成功"
                })
            })
            // 打开连接
            that.initNativeBridge('tablet', 'Tablet310');
        } catch(err) {
            console("连接签字板设备出错");
        }
    }
    // 打开签字板事件
    startSignTable() {
        try {
            _$("tablet").StartSignOnly(this.strageUser.dlgx,
                this.strageUser.dlgy, this.strageUser.dlgw, this.strageUser.dlgh, this.strageUser.stip, this.strageUser.stipattribute, this.strageUser.timeout);    
        } catch(err) {
            console.log("打开签字板错误...")
        }
    }
    // 签名完成事件
    async getSigntureSync() {
        try {
            let status = _$("tablet").GetSigntureSync(this.strageUser.wintype, this.strageUser.pathname, this.strageUser.timeout, this.strageUser.lpszTrackFile);
            // 如果签名成功
            if (status.result == "0") {
                // 根据图片路劲读取图片base64码
                let picVal = await utyDevice.onExec("readfile64", {
                    "filename": this.strageUser.pathname
                });
                // 签名轨迹值
                let trackVal = await utyDevice.onExec("readfile64", {
                    "filename": this.strageUser.lpszTrackFile
                });
                let collectedImage = picVal.data;
                let signTrack = trackVal.data;
                console.log("拍照签名图片的结果====", collectedImage);
                return {
                    result: 0,
                    msg: "获取签名数据成功",
                    collectedImage: collectedImage,
                    signTrack: signTrack,
                }
            }
            // 获取签名结果为-1091，客户未签字
            else if (status.result == "-1091") {
                return {
                    result: -1,
                    msg: "获取签名数据失败",
                }
            }
        } catch(err) {
            console.log("获取签名失败..");
        }
    }
    // 重新签名
    reSign() {
        console.log("重新签名");
        try {
            _$("tablet").ClearSign();
        } catch(err) {
            console.log("清除签名信息失败")
        }
    }
    // 关闭预览窗口 以及关闭连接
    closeSign() {
        console.log("关闭预览窗口");
        try {
            _$("tablet").StopSign();
        } catch(err) {
            console.log("关闭预览窗口失败");
        }
    }
}

const load = function () {
    if (!window.tablet) {
        let tablet = new tablet();
        window.tablet = tablet;
    }
}

export default {
    load,
}