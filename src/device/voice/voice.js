
import baseConfig from '../../config/baseConfig';
import sysConfig from '../../config/sysConfig'


// 创建语音
export const createVoice = function(text, callback) {
    console.log(text)
    return sysConfig.$syscfg.K_KDXF_REQUEST(baseConfig.$basecfg.audioUrl, {
        key: "createVoice",
        txt: text,
        type: 0,
        param: '',
        num: 0,
        serialNum: "123"
    }).then(res => {
        console.log("创建语音成功")
        setTimeout(() => {
            callback && callback(res)
        }, 200);
    }).catch(err => {
        console.error("创建失败")
    });
}
// 创建并播放语音
export const playVoice = function(text) {
    console.log("尝试创建播放语音....");
    return createVoice(text, function(res) {
        console.log("playVoice" + JSON.stringify(res));
        justPlayVoice(res); 
    })
}
// 单独播放语音
export const justPlayVoice = function (res, callback) {
    console.log(decodeURIComponent(res.filepath))
    return jsonp(baseConfig.$basecfg.audioUrl + "?key=playVoice&filepath=" + decodeURIComponent(res.filepath)).then(res => {
        console.log("justPlayVoice" + JSON.stringify(res));
        setTimeout(() => {
            callback && callback();
        }, 200)
    }).catch(err => {
        console.error("单独播放失败")
        console.log(err)
    })
}
// 获取语音长度
export const getVoiceLength = function () {
    return new Promise(async function(resolve, reject) {
        return jsonp(baseConfig.$basecfg.audioUrl, {
            key: "getVoiceLength"
        }).then(res => {
            console.log("获取的语音长度" + res.iRet);
            resolve(res.iRet);
        })
    })
}
//暂停语音播放
export const stopPlayVoice = function () {
    console.log("尝试停止播放语音.....");
    return jsonp(baseConfig.$basecfg.audioUrl, {
        key: "closeVoice"
    }).then(res => {
        console.log("停止语音播放成功")
    })
}
//清空语音文件
export const clearVoiceFile = function () {
    console.log("清空所有播放语音");
    var removeUrl = baseConfig.$basecfg.audioUrl 
                    + "?key=removeVoice&filepath=" 
                    + baseConfig.$basecfg.localUrl;
    console.log("url:" + removeUrl)
    return jsonp(removeUrl).then(res => {
        console.log("移除成功");
    }).catch(err => {
        console.error("移除失败" + err);
    })
}
export const googlePlayVoice = function (text, callbackObj) {
    if (window.NativeSpeakerText) {
        window.NativeSpeakerText(text);
    } else {
        var speaker = new SpeechSynthesisUtterance();
        if (_.isEmpty(callbackObj)) callbackObj = {};
        speaker.onstart = function(){
            console.log("开始", new Date());
            callbackObj.onstart && callbackObj.onstart();
        };
        
        speaker.onpause = function(){
            console.log("暂停", new Date());
            callbackObj.onpause && callbackObj.onpause();
        };
        
        speaker.onresume = function(){
            console.log("重新开始", new Date());
            callbackObj.onresume && callbackObj.onresume();
        };
        
        speaker.onend = function(){
            console.log("结束", new Date());
            callbackObj.onend && callbackObj.onend();
        };
        speaker.onerror = function(er){
            console.log("error:", er);
            callbackObj.onerror && callbackObj.onerror();
        }
        speaker.volume = 0.9;
        speaker.text = text;
        speechSynthesis.speak(speaker);
    }
}

export const googleStopVoice = function() {
    if (window.NativeSpeakerStop) {
        window.NativeSpeakerStop();
    } else {
        speechSynthesis.cancel()
    }
}
