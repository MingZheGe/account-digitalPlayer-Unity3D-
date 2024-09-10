
class AipSign {
    constructor(idName) {
        this.aipObject = document.getElementById(idName);
        this.aipObject.addEventListener('message', handleMessage, false);
    }

    getValueEx() {
        return new Promise((resolve, reject) => {
            window.getValueExCb = function (signData) {
                resolve(JSON.parse(signData).retstr);
            }
            GetValueEx("sign", 14, "jpg", 0, "", "getValueExCb", "", "");
        })
    }

    // 获取签名轨迹
    getSignTrack() {
        return new Promise((resolve, reject) => {
            //获取手写矢量数据
            window.getValueExCb = function (signData) {
                resolve(JSON.parse(signData).retstr);
            }
            GetValue("sign", "getValueExCb", "", "");
        })
    }

    //关闭退出签名
    logOut() {
        Logout("", "", "");
        CloseDoc(0, "", "", "");
        //HideAip Wnd("", "", "");
    }

    //清除签名
    clearSign() {
        SetValue("sign", "");
    }
}

const initAndOpenAipSign = function (custCode) {
    let idName = "djPPAPI",
        aipSign = new AipSign(idName),
        userId = "HWSEALDEMO_" + (custCode || "888888") + "sys";
    console.error("此段不记录错误---手写演示开始。。。");
    console.error("此段不记录错误---隐藏滚动条");
    console.log("此段不记录错误---隐藏滚动条");
    window.djUserId = userId; 
    SetShowScrollBarButton(2, "", "", "");
    SetShowDefMenu(0, '', '', '');
    SetShowToolBar(0, '', '', '');
    SetValue("CHANGE_FORCE_IN_PDFMODE_STATE", "1"); //文档默认转换为pdf
    // SetValue("SET_TEMPFLAG_MODE_ADD", "8"); //尽量不获取焦点儿
    // SetValue("SET_TEMPFLAG_MODE_ADD", "128");
    setTimeout(() => {
        console.error("此段不记录错误---登录点聚签名")
        console.log("此段不记录错误---登录点聚签名");
        Reb_Handwritten_login();
    }, 1000)
    return aipSign;
}

export default {
    initAndOpenAipSign
}