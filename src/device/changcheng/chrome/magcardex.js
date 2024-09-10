/**
 * 长城谷歌银行卡模块的封装 @wangmx
 */

import Device from "./common/device"

class Magcardex extends Device {
  constructor() {
    super();
  }
  /**
   * 自定义的封装的方法
   */
  EjectCardAsync() {
    _$("magcardex").Eject(1);
  }
  ReadCard() {
    _$("magcardex").AcceptAndReadTracks(0x08, 0); //0x01 | 0x02 | 0x04 | 
  }
  Reset(action) {
    _$("magcardex").Reset(action);
  }
  CancelAccept() {
    _$("magcardex").CancelAccept();
  }
  bankCardInstance(callback) {
    this.bindEvent("magcardexCardInserted", function (args) {
      callback({
        type: "CardInserted",
        msg: "有卡插入",
      })
    })

    this.bindEvent("magcardexCardInvalid", function (args) {
      callback({
        type: "CardInvalid",
        msg: "CardInvalid检测到非法磁道数据",
      })
    })
    this.bindEvent("magcardexCardTaken", function (args) {
      callback({
        type: "CardTaken",
        msg: "卡片被取走",
      })
    })

    this.bindEvent("magcardexResetOver", function (args) {
      callback({
        type: "ResetOver",
        msg: "复位成功",
      })
    })

    // this.bindEvent("magcardexChipPowerOver", function (args) {
    //   try {
    //     let returnCardData = {
    //       cardNum: ""
    //     };
    //     let candidateList = _$("magcardex").PbocGetCandidateList();
    //     console.log("获取到的候选应用列表" + candidateList);
    //     candidateList = JSON.parse(candidateList);
    //     console.dir(candidateList);
    //     if (candidateList.result == 0) {
    //       let resultSelet = candidateList.outinfo.split("|");
    //       console.log("候选应用的值" + resultSelet);
    //       let appInfo = _$("magcardex").PbocSelectApplication(resultSelet[2]);
    //       console.info(appInfo);
    //       appInfo = JSON.parse(appInfo);
    //       if (appInfo.result == 0) {
    //         console.log("选择应用");
    //         let applicationInfo = _$("magcardex").PbocInitiateApplicationInfo(resultSelet);
    //         console.info(applicationInfo);
    //         applicationInfo = JSON.parse(applicationInfo);
    //         if (applicationInfo.result == 0) {
    //           let pbocInfo = _$("magcardex").PbocGetValueByTag("0x57");
    //           pbocInfo = JSON.parse(pbocInfo);
    //           if (pbocInfo.result == 0) {
    //             console.log("读到的卡的信息:" + pbocInfo.outinfo.substring(0, pbocInfo.outinfo.indexOf("D")));
    //             returnCardData.cardNum = pbocInfo.outinfo.substring(0, pbocInfo.outinfo.indexOf("D"));
    //             console.log("芯片的读卡方式" + returnCardData.cardNum);
    //             // _.isFunction(that.strageUser.ReadRawDataComplete) && that.strageUser.ReadRawDataComplete.call(that, returnCardData);
    //             callback({
    //               type: "AcceptAndReadTracksOver",
    //               msg: "读卡成功",
    //               returnCardData: returnCardData,
    //             })

    //           } else {
    //             console.log("获取标签失败");
    //           }
    //         } else {
    //           console.log("初始化应用失败");
    //         }
    //       } else {
    //         console.log("选择应用失败");
    //       }
    //     } else {
    //       console.log("获取到的候选应用列表失败");
    //     }
    //   } catch (e) {
    //     callback({
    //       type: "DeviceError",
    //       msg: "纯芯片读卡失败",
    //     })
    //     console.log("出错了" + e);
    //   }
    // })
    this.bindEvent("magcardexAcceptAndReadTracksOver", function (args) {
      console.info("读取到磁道数据");
      console.info("card info + AcceptAndReadTracksOver+ args:" + args);
      let returnCardData = {
        status: "",
        cardNum: ""
      };
      try {
        //返回的数据格式有（） 号，先处理一下，记得反馈这个问题
        let cardData = args;
        try {
          let returnCardData = {
            cardNum: ""
          };
          let candidateList = _$("magcardex").PbocGetCandidateList();
          console.log("获取到的候选应用列表" + candidateList);
          candidateList = JSON.parse(candidateList);
          console.dir(candidateList);
          if (candidateList.result == 0) {
            let resultSelet = candidateList.outinfo.split("|");
            console.log("候选应用的值" + resultSelet);
            let appInfo = _$("magcardex").PbocSelectApplication(resultSelet[2]);
            console.info(appInfo);
            appInfo = JSON.parse(appInfo);
            if (appInfo.result == 0) {
              console.log("选择应用");
              let applicationInfo = _$("magcardex").PbocInitiateApplicationInfo(resultSelet);
              console.info(applicationInfo);
              applicationInfo = JSON.parse(applicationInfo);
              if (applicationInfo.result == 0) {
                let pbocInfo = _$("magcardex").PbocGetValueByTag("0x57");
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
      } catch (e) {
        console.log("json格式转换错误" + e);
      }
    })
    this.bindEvent("magcardexOpenConnectionOver", function () {
      console.log("open ok!");
      console.log("请插卡");
      //芯片卡。如果要读取多磁道信息，则用“|”连接，例如“ 0x02|0x04 ”表示同时读取2,3磁道信息 。0x80表示后进卡
      _$("magcardex").AcceptAndReadTracks(0x08, 0); //开始读卡,新版的是只读芯片  //0x01 | 0x02 | 0x04 | 
    });
    this.initNativeBridge('magcardex', 'CardReader310');
  }
}

const load = function () {
  if (!window.magcardex) {
    let magcardex = new Magcardex();
    window.magcardex = magcardex;
  }
}

export default {
  load,
}
