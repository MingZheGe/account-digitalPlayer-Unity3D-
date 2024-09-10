/**
 * @author liwei2 
 * @description 长城谷歌身份证模块js封装
 */
import DeviceEx from './common/device'
import useStore from '@/config/store'

    

class IdCard extends DeviceEx {
  constructor() {
    super();
    this.justCapImage = false;
  }
  reRead() {
    // siu.ControlGuideLightSync(15, 8); 读卡器的灯是没有了的
    _$("idcard").setAttribute('StReadDataType', 0);
    _$("idcard").AcceptAndReadTracks(776, -1);
  }
  /**
   * @desc 初始化长城的二代证的方法
   * callback({type: "printSuccess",msg: ""}) type: printError/printSuccess
   */
  IdCardInstance(callback, type) {
    let cardData = "",
      isSuccess = false,
      that = this;
    try {
      this.bindEvent("idcardOpenConnectionOver", function () {
        console.log("设备已打开!");
        console.log("正在读取身份证...");
        // siu.ControlGuideLightSync(15, 8);
        _$("idcard").setAttribute('StReadDataType', 0);
        callback({
          type: "OpenConnectionOver",
          msg: "打开设备成功",
        })
        if (type == 768) {
          this.justCapImage = true;
        }
        // 776 - 8   只做扫描不做读取
        _$("idcard").AcceptAndReadTracks(type, -1);
      })
      this.bindEvent("idcardAcceptAndReadTracksOver", function (args) {
        console.log("卡读到FORM或者磁道数据");
        console.log("此处获取身份证信息card info:" + JSON.stringify(args));
        console.dir(args);

        if (args == undefined || args == "") {
          callback({
            type: "hasNodata",
            msg: "读取到的身份证信息为空,请重新插拔你的身份证",
          })
          return;
        }
        var jsdata = args;
        var cardDatas = eval(jsdata.chipdata).datas;
        var cardDataMap = that.getCardData(cardDatas);
        cardData = {
          CUST_FNAME: cardDataMap.Name,
          USER_FNAME: cardDataMap.Name,
          SEX: (cardDataMap.Sex && cardDataMap.Sex + "性") || "其他",
          NATIONALITY: (_.trim(cardDataMap.Nation) && _.trim(cardDataMap.Nation) + "族") || "",
          BIRTHDAY: cardDataMap.Born,
          ID_ADDR: cardDataMap.Address,
          ID_CODE: cardDataMap.IDCardNo,
          ID_ISS_AGCY: cardDataMap.GrantDept,
          ID_BEG_DATE: cardDataMap.UserLifeBegin,
          ID_EXP_DATE: cardDataMap.UserLifeEnd == "长期" ? "30001231" : cardDataMap.UserLifeEnd,
          ID_TYPE: cardDataMap.IDType == "0" ? "00" : cardDataMap.IDType == "1" ? "0e" : cardDataMap.IDType == "2" ? "0s" : ""
        };
        console.log("民族:" + cardDataMap.Nation);
        console.log(cardDataMap)
        //后加的
        const store = useStore()
        store.setCardData(cardDataMap);
        console.log("存储的数据" + store.cardData);
        console.log(store.cardData);
        //到这里
        console.log("未转换之前的值" + cardDataMap.UserLifeEnd);
        console.log("证件有效期的代码转换" + cardData.ID_EXP_DATE);
        var faceImage = cardDataMap.PhotoFileName || "";
        var frontImage = eval(jsdata.frontimage).datas;
        var backImage = eval(jsdata.backimage).datas;
        cardData.IMAGE_INFO = JSON.stringify({
          frontImage: frontImage,
          backImage: backImage,
          faceImage: faceImage,
        });
        isSuccess = true;
        console.log("读卡成功,身份证信息为" + cardData + "请取走你的身份证");
             //setTimeout(() => {
        //   _$("idcard").Eject(1); // 执行弹出身份证
        // }, 200);
        callback({
          type: "AcceptAndReadTracksOver",
          msg: "读卡成功",
          cardData: cardData,
        })
      })
      this.bindEvent("idcardCardInvalid", function () {
        console.log("检测到非法磁道数据!111");
        callback({
          type: "CardInvalid",
          msg: "检测到非法磁道数据,请重新插拔你的身份证",
        });
        _$("idcard").Eject(1);
      })
      this.bindEvent("idcardCardTaken", function () {
        console.log("卡片被取走!");
        console.log("底层回调的的是否的cardtaken 的回调是否" + isSuccess);
        // siu.ControlGuideLightSync(15, 1);
        //卡片取走后,自动跳到下一页
        if (isSuccess) {
          isSuccess && callback({
            type: "readCardSuccess",
            msg: "读卡成功",
            cardData: cardData,
          });
        } else {
          callback({
            type: "CardTaken",
            msg: "已经取走卡片了",
          })
        }
        isSuccess = false;
        // siu.CloseAllSync();
      })
      this.bindEvent("idcardCardInserted", function () {
        console.log("有卡插入!");
        callback({
          type: "CardInserted",
          msg: '已经插卡了',
        })
      })
      this.bindEvent("idcardTimeout", function (args) {
        console.log("操作" + args.cmdName + "超时");
        callback({
          type: "Timeout",
          msg: "操作超时,请重新插拔你的身份证",
        })
      })
      this.bindEvent("idcardResetOver", function () {
        console.log("设备reset完毕重新连接设备");
        callback({
          type: "ResetOver",
          msg: "重置完成了",
        })
      })
      this.bindEvent("idcardDeviceError", function (args) {
        callback({
          type: "DeviceError",
          msg: "硬件错误，错误码：" + args.errorcode,
        })
      });
      // idcard.execute("OpenConnection", -1);
      this.initNativeBridge('idcard', 'IDCardReader310');
    } catch (err) {
      console.error("身份证初始化失败，原因:" + err.message);
      callback({
        type: "printInitError",
        msg: "身份证初始化失败,原因：" + err
      });
    }
  }
  getCardData(cardData) {
    var keyArr = ["Name", "Sex", "Nation", "Born", "Address", "IDCardNo", "GrantDept", "UserLifeBegin", "UserLifeEnd", "PhotoFileName", "IDType"]
    var obj = {};
    _.each(keyArr, function (value, index) {
      var arr = cardData.split(value + "=");
      obj[value] = (arr.length > 1 && arr[1].split("|")[0]) || "";
    });
    return obj;
  }
  CancelAccept() {
    // siu.ControlGuideLightSync(15, 1);
    _$("idcard").CancelAccept();
  }
  Eject(param) {
    _$("idcard").Eject(param);
  }
  Reset(action) {
    _$("idcard").Reset(action);
  }
}


const load = function () {
  if (!window.idcard) {
    window.idcard = new IdCard();
  }
};


export default IdCard;