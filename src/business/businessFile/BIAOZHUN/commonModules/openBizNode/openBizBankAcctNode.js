/* 
*   银行模块
*   注意：方法名称与V0035一样的，需要加前缀，不能覆盖V0035的方法，比如bankAcctountPageActivated
*   方法封装
*   @author  linsc
*/
import * as utils from "../../../../../tools/util"

const getCommExtOrgData = function (_this, params) {
  return _this.$syscfg.K_Request("Y3000058", params);
}

const getBankAcctConf = function (_this, param) {
  return _this.$syscfg.K_Request('Y3000015', param);
}
export default {
  openBizBankAcctNodeAfterLoadBiz: function (_this) {
  },
  openBizBankAcctNodeBeforeLoadBiz: function (_this) {
    let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO);
    let OPEN_ORG_INFO = _this.$storage.getJsonSession(_this.$definecfg.OPEN_ORG_INFO) || {};
    let orgCode = OPEN_ORG_INFO.ORG_CODE || userInfo.ORG_CODE;
    return Promise.all([
      getCommExtOrgData(_this, { INT_ORG: orgCode, CURRENCY: "0", CUBSB_TYPE: "1" }),
      _this.$syscfg.getSysConfig("CREDIT_BANKS", "10"),
      _this.$syscfg.getSysConfig("OPEN_FILTER_CREDIT_BANKS", "10"),
      _this.$syscfg.getSysConfig("DORMANT_VIRTUAL_BANKCODE", "10"),
      _this.$syscfg.getSysConfig("UNQULIFIED_VIRTUAL_BANKCODE", "10"),
    ]).then(res => {
      let creditBanks = _.find(res[1].Data, v => {
        return v.PAR_CODE == "CREDIT_BANKS";
      });
      let openFilterCreditBanks = _.find(res[2].Data, v => {
        return v.PAR_CODE == "OPEN_FILTER_CREDIT_BANKS";
      });
      let dormantVirtualBankcode = _.find(res[3].Data, v => {
        return v.PAR_CODE == "DORMANT_VIRTUAL_BANKCODE";
      });
      let unqulifiedVirtualBankcode = _.find(res[4].Data, v => {
        return v.PAR_CODE == "UNQULIFIED_VIRTUAL_BANKCODE";
      });
      let creditBanksArr = [];
      _.each(creditBanks.PAR_VAL.split(","), v => {
        creditBanksArr.push(utils.addZero(v));
      })
      let tempData = _.chain(res[0].Data).filter(item => {
        if (openFilterCreditBanks && openFilterCreditBanks.PAR_VAL == "0") {
          return true;
        } else {
          return _.indexOf(creditBanksArr, item.EXT_ORG) == -1;
        }
      }).filter(item => {
        dormantVirtualBankcode = (dormantVirtualBankcode && dormantVirtualBankcode.PAR_VAL) || "";
        unqulifiedVirtualBankcode = (unqulifiedVirtualBankcode && unqulifiedVirtualBankcode.PAR_VAL) || "";
        return dormantVirtualBankcode.indexOf(item.EXT_ORG) == -1 && unqulifiedVirtualBankcode.indexOf(item.EXT_ORG) == -1;
      }).filter(item => {
        return Object.getOwnPropertyNames(item).length >= 3
      }).sortBy("EXT_ORG").value();
      
      // 目前开户之能开 人民币 不能开外币
      _this.oppBusiData.bankList = tempData;

      //业务参数中配置不支持一步式的普通存管银行
      _this.oppBusiData.notAllowOneStepBanks = (_this.oppBusiData.busiCommonParams.NOT_ALLOW_ONESTEP_BANKS || "").split(",");
      _this.oppBusiData.justAllowTwoSteps = _this.oppBusiData.busiCommonParams.JUST_ALLOW_TWO_STEPS || "0";
    
    }).catch(err => {
      console.error(err);
    })
  },
}