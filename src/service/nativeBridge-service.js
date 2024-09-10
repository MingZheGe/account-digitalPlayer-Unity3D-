import dict from '../tools/dict'

//中泰读卡
export const readCardZT = function(_this){
    
    return new Promise((resolve,reject)=>{
        if (_this.$basecfg.platform === "android" && typeof window.broadcaster !== "undefined") {
            // TODO  安卓跳转原生双
            console.log( "broadcsater start" );
            window.broadcaster.fireNativeEvent( "webView.event", { 
                "event":'READ_CARD_TAB',
                "data":{
                    "bsno":"dukazhaopian",
                    "tab":"0", // "0" 蓝牙读卡
                    "height": document.getElementsByClassName("customer-search-contenet")[0].getBoundingClientRect().height + "",
                    "y":document.getElementsByClassName("customer-search-contenet")[0].getBoundingClientRect().top + ""
                }
            }, function() {
                console.log( "发送广播成功，回调" );
            } );
            var readCardTabSuccess = function( e ) {
                //log: didShow received! userInfo: {"data":"test"}
                console.log( "读卡成功readCardTabSuccess: " + JSON.stringify(e));
                return dict.getDictData("NATIONALITY").then(nationalityDict => {
                    console.log('获取民族数据字典', nationalityDict&&nationalityDict.NATIONALITY||[]);
                    let custInfo = transformCardData(e, nationalityDict&&nationalityDict.NATIONALITY||[]);
                    resolve(custInfo)
                })
            }
            window.broadcaster.addSingleEventListener( "readCardTabSuccess", readCardTabSuccess);
            var closeReadCardTabSuccess = function( e ) {
                //log: didShow received! userInfo: {"data":"test"}
                console.log( "关闭读卡结果closeReadCardTabSuccess: " + JSON.stringify(e));
                if(e.retCode !== "0"){
                    _this.$blMethod.showMsgBox(_this, "读卡失败，原因"+e.tips)
                    reject( "读卡失败，原因"+e.tips)
                }
            }
            window.broadcaster.addSingleEventListener( "closeReadCardTabSuccess", closeReadCardTabSuccess);
        } else {
            //pc 模拟原生读卡
            let testData =  {}
            return dict.getDictData("NATIONALITY").then(nationalityDict => {
                console.log('获取民族数据字典', nationalityDict&&nationalityDict.NATIONALITY||[]);
                let custInfo = transformCardData(testData, nationalityDict&&nationalityDict.NATIONALITY||[]);
                resolve(custInfo)
            })
        }         
    })
}

export const closeReadCardTab = function(_this){
   if(_this.$basecfg.platform === "ios" &&  typeof navigator.iosUtil !== "undefined") {
      //跳转原生的识别界面
      navigator.iosUtil.skipToNVC(function(success){},function(error) {
          console.log(error);
        },{methodNames: "searchTab"}
      );
    }else if ( _this.$basecfg.platform === "android"&& typeof window.broadcaster !== "undefined") {
      // TODO  安卓跳转原生双录
        console.log( "broadcsater start" );
        window.broadcaster.fireNativeEvent( "webView.event", { 
            "event":'READ_CARD_TAB',
            "data":{
                "bsno":"dukazhaopian",
                "tab":"1" //"1 搜索识别 便是关闭蓝牙跟ocr界面
            }
        }, function() {
            console.log( "发送广播成功，回调" );
        } );
    }
}
export const transformCardData = function(cardData, nationalityDict){
    if(!cardData || cardData.retCode !== "0"){
        return null
    }
    let NATIONALITY_TEXT = cardData.nation !== "其他" ? cardData.nation + "族" : "其他";
    let item = _.find(nationalityDict, {DICT_ITEM_NAME:NATIONALITY_TEXT})
    let NATIONALITY = _.get(item, 'DICT_ITEM','00')
    let custInfo = {
        CUST_FNAME:cardData.chineseName,
        ID_TYPE: cardData.cardType == "0" ? "00" : cardData.cardType == "1" ? "0e" : "0s",
        ID_TYPE_TEXT: cardData.cardType == "0" ? "身份证" : cardData.cardType == "1" ? "外国人永久居住证" : "港澳台居民居住证",
        ID_CODE: cardData.cardId,
        ID_ADDR: cardData.address,
        NATIONALITY: NATIONALITY,
        NATIONALITY_TEXT:NATIONALITY_TEXT,
        SEX_TEXT: cardData.sex,//读卡返回的是汉字
        SEX: cardData.sex.includes("男") ? "0" : cardData.sex.includes("女") ? "1" : "2",//男0 女1 其他2
        BIRTHDAY: cardData.birthDay&&cardData.birthDay.replace(/[^0-9]/mg, '').match(/.{8}/)[0],//去掉一体设备日期中的年月日，2013年12月20日=》20131220
        ID_ISS_AGCY: cardData.idIssue,
        imgPath: cardData.imgPath,
        ID_BEG_DATE:cardData.validDate && cardData.validDate.split("-")[0],
        ID_EXP_DATE:cardData.validDate && cardData.validDate.split("-")[1]
    }
    custInfo.ID_BEG_DATE = custInfo.ID_BEG_DATE.replace(/\./g,'')//去掉一体设备日期的. 2015.09.02-》20150902
    custInfo.ID_EXP_DATE = custInfo.ID_EXP_DATE.replace(/\./g,'')//去掉一体设备日期的. 2015.09.02-》20150902
    console.log("转换后的读卡数据",custInfo)
    return custInfo;
}
//获取原生的视图是否为第一响应者
export const getNativeViewShow = function(_this){
    console.log("getNativeViewShow");
    return new Promise((resolve, reject)=>{
        if(_this.$basecfg.platform === "ios" &&  typeof navigator.iosUtil !== "undefined") {
            //跳转原生的识别界面
            navigator.iosUtil.skipToNVC(function(success){},function(error) {
                console.log(error);
              },{methodNames: "getNativeViewShow"}
            );
        }else if (_this.$basecfg.platform === "android" && typeof window.broadcaster !== "undefined") {
            var getNativeViewShow = function( e ) {
                console.log( "getNativeViewShow: ", e);//isShow:true-false    
                resolve(e.isShow)
            }
            window.broadcaster.addSingleEventListener( "getNativeViewShow", getNativeViewShow);
            // TODO  安卓跳转原生双录
            window.broadcaster.fireNativeEvent( "webView.event", { 
                "event":'NATIVE_VIEW_SHOW',
                "data":{
                "bsno":"none"
                }
            }, function() {
                console.log( "发送广播成功，回调" );
            } );
        
        }else{
            resolve("false")
        }  
    })
}
//显示原生的弹窗
export const showNativeMessageDialog=function(_this, messageText,confirmButtonText,cancelButtonText,typeMessage,confirmedAction, canceledAction){
    let that = _this;
    console.log("getNativeViewShow");
   if(that.$basecfg.platform === "ios" &&  typeof navigator.iosUtil !== "undefined") {
      //跳转原生的识别界面
      navigator.iosUtil.skipToNVC(function(success){},function(error) {
          console.log(error);
        },{methodNames: "getNativeViewShow"}
      );
    }else if ( that.$basecfg.platform === "android" && typeof window.NativeDialog !== "undefined") {
        // TODO  安卓跳转原生双录
        window.NativeDialog.showDialog({
            "messageText":messageText||"",//"标题",
            "confirmButtonText":confirmButtonText,//"确定",
            "cancelButtonText":cancelButtonText,//"取消",
            "typeMessage":typeMessage,//"warn"
        }, function(confirm) {
            console.log( "对话框点击确认");
            confirmedAction();
        },function(cancel){
            console.log( "对话框点击取消");
            canceledAction();
        });
    }
}
//清除原生的缓存
export const clearFileStorage = function(_this){
    let that = _this;
    console.log("clearFileStorage");
    if(that.$basecfg.platform === "ios" &&  typeof navigator.iosUtil !== "undefined") {
        //跳转原生的识别界面
        navigator.iosUtil.skipToNVC(function(success){},function(error) {
            console.log(error);
        },{methodNames: "clearFileStorage"}
        );
    }else if ( that.$basecfg.platform === "android" && typeof window.broadcaster !== "undefined") {
        // TODO  安卓跳转原生双录
        window.broadcaster.fireNativeEvent( "webView.event", { 
        "event":'CLEAR_FILE_STORAGE',
        }, function() {
        console.log( "发送广播成功，回调" );
        } );
    }
}

