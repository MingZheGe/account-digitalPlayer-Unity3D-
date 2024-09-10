/**
 * 长城谷歌银行卡半插入读卡的封装 @wangmx
 */

import Device from "./common/device"

class NonConcatCard extends Device {
  constructor() {
    super();
  }
  bankCardInstance(callback) {
    this.bindEvent("rfcardChipPowerOver", function (args) {
        try {
          let returnCardData = {
            cardNum: ""
          };
          let candidateList = _$("rfcard").PbocGetCandidateList();
          console.log("获取到的候选应用列表" + candidateList);
          candidateList = JSON.parse(candidateList);
          console.dir(candidateList);
          if (candidateList.result == 0) {
            let resultSelet = candidateList.outinfo.split("|");
            console.log("候选应用的值" + resultSelet);
            let appInfo = _$("rfcard").PbocSelectApplication(resultSelet[2]);
            console.info(appInfo);
            appInfo = JSON.parse(appInfo);
            if (appInfo.result == 0) {
              console.log("选择应用");
              let applicationInfo = _$("rfcard").PbocInitiateApplicationInfo(resultSelet);
              console.info(applicationInfo);
              applicationInfo = JSON.parse(applicationInfo);
              if (applicationInfo.result == 0) {
                let pbocInfo = _$("rfcard").PbocGetValueByTag("0x57");
                pbocInfo = JSON.parse(pbocInfo);
                if (pbocInfo.result == 0) {
                  console.log("读到的卡的信息:" + pbocInfo.outinfo.substring(0, pbocInfo.outinfo.indexOf("D")));
                  returnCardData.cardNum = pbocInfo.outinfo.substring(0, pbocInfo.outinfo.indexOf("D"));
                  console.log("芯片的读卡方式" + returnCardData.cardNum);
                  // _.isFunction(that.strageUser.ReadRawDataComplete) && that.strageUser.ReadRawDataComplete.call(that, returnCardData);
                  callback({
                    type: "AcceptAndReadTracksOver",
                    msg: "读卡成功",
                    returnCardData: returnCardData,
                  })
  
                } else {
                  console.log("获取标签失败");
                }
              } else {
                console.log("初始化应用失败");
              }
            } else {
              console.log("选择应用失败");
            }
          } else {
            console.log("获取到的候选应用列表失败");
          }
        } catch (e) {
          callback({
            type: "DeviceError",
            msg: "纯芯片读卡失败",
          })
          console.log("出错了" + e);
        }
    })
    this.bindEvent("rfcardAcceptAndReadTracksOver", function (args) {
        console.info("读取到磁道数据");
        console.info("card info + AcceptAndReadTracksOver+ args:" + args);
        //_$("rfcard").ChipPower(2);
        try {
          let returnCardData = {
            cardNum: ""
          };
          let candidateList = _$("rfcard").PbocGetCandidateList();
          console.log("获取到的候选应用列表" + candidateList);
          candidateList = JSON.parse(candidateList);
          console.dir(candidateList);
          if (candidateList.result == 0) {
            let resultSelet = candidateList.outinfo.split("|");
            console.log("候选应用的值" + resultSelet);
            let appInfo = _$("rfcard").PbocSelectApplication(resultSelet[2]);
            console.info(appInfo);
            appInfo = JSON.parse(appInfo);
            if (appInfo.result == 0) {
              console.log("选择应用");
              let applicationInfo = _$("rfcard").PbocInitiateApplicationInfo(resultSelet);
              console.info(applicationInfo);
              applicationInfo = JSON.parse(applicationInfo);
              if (applicationInfo.result == 0) {
                let pbocInfo = _$("rfcard").PbocGetValueByTag("0x57");
                pbocInfo = JSON.parse(pbocInfo);
                if (pbocInfo.result == 0) {
                  console.log("读到的卡的信息:" + pbocInfo.outinfo.substring(0, pbocInfo.outinfo.indexOf("D")));
                  returnCardData.cardNum = pbocInfo.outinfo.substring(0, pbocInfo.outinfo.indexOf("D"));
                  console.log("芯片的读卡方式" + returnCardData.cardNum);
                  // _.isFunction(that.strageUser.ReadRawDataComplete) && that.strageUser.ReadRawDataComplete.call(that, returnCardData);
                  callback({
                    type: "AcceptAndReadTracksOver",
                    msg: "读卡成功",
                    returnCardData: returnCardData,
                  })
  
                } else {
                  console.log("获取标签失败");
                }
              } else {
                console.log("初始化应用失败");
              }
            } else {
              console.log("选择应用失败");
            }
          } else {
            console.log("获取到的候选应用列表失败");
          }
        } catch (e) {
          callback({
            type: "DeviceError",
            msg: "纯芯片读卡失败",
          })
          console.log("出错了" + e);
        }
    })
    this.bindEvent("rfcardOpenConnectionOver", function () {
        console.log("open ok!");
        console.log("请插卡");
        //芯片卡。如果要读取多磁道信息，则用“|”连接，例如“ 0x02|0x04 ”表示同时读取2,3磁道信息 。0x80表示后进卡
        _$("rfcard").AcceptAndReadTracks(0x08, 0); //开始读卡 
    })
    this.bindEvent("rfcardCardTaken", function(args){
      console.log("半插入是读卡，卡片取走事件");
    })
    this.initNativeBridge('rfcard', 'ICCardReader310');
  }
}

const load = function () {
  if (!window.nonconcatcard) {
    let nonconcatcard = new NonConcatCard();
    window.nonconcatcard = nonconcatcard;
  }
}

export default {
  load,
}
