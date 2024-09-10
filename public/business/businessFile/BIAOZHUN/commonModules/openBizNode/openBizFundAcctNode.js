/**
 * 业务名称：基金开户 模块
 * @author qinguojun
 */
// import sysConfig from "../../../../../config/sysConfig";
// import storage from "../../../../tools/storage";
// import defineConfig from "../../../../config/defineConfig";
// import custService from "../../../../service/cust-service";
import bizPublicMethod from "../../../../businessTools/bizPublicMethod.js"
/**
 * 获取客户下所基金账户资料
 * @param cust_code   客户代码
 */
const W0000143 = (_this, param) => {
  return _this.$syscfg.K_Request('W0000143', param);
}

const W0000134 = (_this, param) => {
  return _this.$syscfg.K_Request('W0000134', param);
}
const getAllFundInfo = function (_this) {
  return _this.$syscfg.K_Request("Y1001888", {
    "ORG_TYPE": '3',
    "NEED_CHECK": "1"
  }).then(function (data) {
    return data && data.Data && data.Data.length && data.Data || [];
  })
}
const initData = (_this, allFundCompany) => {
  let openFundAcct = _this.oppBusiData.openFundAcct;
  let allFundCompanyFilter = _.filter(allFundCompany, function (item) {
    return item.ORG_NAME.charCodeAt(0) >= 65 && item.ORG_CLS !== '50'; // 过滤基金公司  银河证券不展示机构类别为50-基金代销的基金公司
  })
  _this.oppBusiData.allFundCompany = allFundCompanyFilter;
  _this.$storage.setSession(_this.$definecfg.ALL_FUND_COMPANY, allFundCompanyFilter);
  // _this.$storage.setSession(_this.$definecfg.FUND_LIST,[]);
  _.each(openFundAcct, function (fundItem) {
    let openFundAcctData = _.filter(_this.oppBusiData.allFundCompany, function (val) {
      return fundItem.TA_CODE == parseInt(val.ORG_CODE);
    });
    Object.assign(fundItem, {
      "TA_NAME": openFundAcctData[0].ORG_NAME
    });
  });

}

const getBaseRequestData = (_this) => {
  // 获取业务基本数据
  let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
  let basedata = {
    "BUSI_CODE": _this.busiCode,
    // "CUST_CODE": customerInfo != null ? customerInfo.USER_TYPE : _this.userType,
    "CUST_CODE": "",
    "ID_TYPE": customerInfo != null ? customerInfo.ID_TYPE : _this.oppBusiData.ID_TYPE,
    "ID_CODE": customerInfo != null ? customerInfo.ID_CODE : _this.oppBusiData.ID_CODE,
    "CUST_CODE": customerInfo != null ? customerInfo.CUST_CODE : "",
    "CUST_FNAME": customerInfo != null ? customerInfo.USER_FNAME : _this.oppBusiData.CUST_FNAME,
    "INT_ORG": customerInfo && customerInfo.INT_ORG ? customerInfo.INT_ORG : ""
  }
  return basedata;
}
// getData
const getData = function (_this, params) {
  let that = _this,
    FUNDACCT_INFO_LIST = [],
    //基金账户类别，
    // 1.仅开通上海和深圳（98，99）则为0，
    // 2.仅开通非上海和深圳（非98，99）为1，
    // 3.既开通98，99又开通非98和99的为2
    selectAllVal = "";
  let modules = _this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1;
  let busiCommonParamsArray = {};
  _.each(_this.$storage.getJsonSession(_this.$definecfg.BUSI_COMM_PARAM), function (item) {
    busiCommonParamsArray[item.PARAM_CODE] = item;
  })
  _.each(modules, function (module) {
    let formData = {
      OF_ACCT: module.FIELDS.OF_ACCT.DEFAULT_VALUE,
      TA_CODE: module.FIELDS.TA_CODE.DEFAULT_VALUE,
    }
    if (formData.TA_CODE.length) {
      let moduleFundInfo = _.find(module.FIELDS.TA_CODE.FIELD_DICT_NAME, v => {
        return v.ORG_CODE == formData.TA_CODE
      })
      FUNDACCT_INFO_LIST.push(_.extend(formData, {
        BILL_MAIL_TYPE: busiCommonParamsArray["SHOW_EMAIL_WAY"].PARAM_VALUE != "1" ? busiCommonParamsArray["DEFAULT_BILL_MAIL_TYPE"].PARAM_VALUE : formData.BILL_MAIL_TYPE,//邮寄类型类型不显示时，取业务公共参数的默认值（DEFAULT_BILL_MAIL_TYPE）
        DIV_METHOD: busiCommonParamsArray["SHOW_EMAIL_WAY"].PARAM_VALUE != "1" ? busiCommonParamsArray["DEFAULT_DIV_METHOD"].PARAM_VALUE : formData.DIV_METHOD,//分红方式不显示时，取业务公共参数的默认值（DEFAULT_DIV_METHOD）
        ORG_SPELL: moduleFundInfo && moduleFundInfo.ORG_SPELL && moduleFundInfo.ORG_SPELL[0].toLowerCase(),
        TA_CODE_SNO: moduleFundInfo.CHECK_OBJ && moduleFundInfo.CHECK_OBJ.TA_CODE_SNO || "",
        SYS_CODES: moduleFundInfo.SYS_CODES || "",
        SPEC_ORG_CODE: moduleFundInfo.SPEC_ORG_CODE || "",
        ORG_PREFIX: moduleFundInfo.ORG_PREFIX || "",
        TA_CODE_TEXT: moduleFundInfo ? moduleFundInfo.ORG_NAME : "",
        TA_ORG_CLS: moduleFundInfo.CHECK_OBJ && moduleFundInfo.CHECK_OBJ.TA_ORG_CLS || "",    //用来储存基金公司类型，是否是迁移的
      }));
    }
  });
  let returnObj = {
    SELECT_ALL_VAL: selectAllVal,//是否勾选【全选】基金公司，1：勾选，否则未勾选
    SELECT_ORG_NUM: modules[0].FIELDS.TA_CODE.DEFAULT_VALUE.length ? modules.length + "" : "0", //选择的基金公司个数，驳回使用
    FUNDACCT_FLAG: _this.oppBusiData.syscodesFlag ? 1 : 0,  //1、需要签署203电子协议、201电子约定书 0 不需要签
    IS_OPEN_FUNDACCT_FLAG: FUNDACCT_INFO_LIST && FUNDACCT_INFO_LIST.length > 0 ? "1" : "0",
    SYNC_OPEN_FUND_AGMT: "" //银河需要自动开通基金自动开户协议
  };
  JSON.stringify(returnObj)
  console.log(JSON.stringify(returnObj))

  let FUNDACCT_TYPE = "";
  let TEM_SZ_SH_FUND = "";
  let TEM_BIAOZHUN_FUND = "";

  _this.$syscfg.getSysConfig("SZ_SH_FUND", "10").then((response) => {
    TEM_SZ_SH_FUND = response.Data[0].PAR_VAL;
    // console.log(response.Data[0].PAR_VAL);
    var temArr = TEM_SZ_SH_FUND.split(",");
    var tem_1 = temArr[0].split("|");
    var tem_2 = temArr[1].split("|");
    var tem_SZ_FUND = [tem_1[0], tem_1[0] * 1, ("0000" + tem_1[0]).substring(("0000" + tem_1[0]).length - 4)];
    var tem_SH_FUND = [tem_2[0], tem_2[0] * 1, ("0000" + tem_2[0]).substring(("0000" + tem_2[0]).length - 4)];

    TEM_BIAOZHUN_FUND = _.concat(tem_SZ_FUND, tem_SH_FUND);

    tem_1 = tem_2 = "";
    _.each(FUNDACCT_INFO_LIST, function (form) {
      if (_.compact(_.values(form)).length) {
        if (_.indexOf(TEM_BIAOZHUN_FUND, form.TA_CODE) > -1) {
          tem_1 = "0";
        } else {
          tem_2 = "1";
        }
      }
    })
    FUNDACCT_TYPE = (tem_1 !== "" && tem_2 !== "") ? "2" : (tem_1 || tem_2);
    returnObj.FUNDACCT_TYPE = FUNDACCT_TYPE;
    params.ACCT_INFO.FUNDACCT_INFO_LIST = FUNDACCT_INFO_LIST;
    return Object.assign(params, returnObj);
  });

  // Object.assign(params, returnObj);
}
export default {
  'openBizFundAcctNodeBeforeLoadBiz': (_this) => {
    return Promise.all([
      // W0000143(_this,getBaseRequestData(_this)),
      // W0000134(_this,getBaseRequestData(_this)),
      getAllFundInfo(_this)
    ]).then(res => {
      if (res.length && res[0]) {
        let allFundCompany = res[0];

        initData(_this, allFundCompany);
      }
    })
  },
  'openBizFundAcctNodeAfterLoadBiz': (_this) => {
    if (_this.historyData && _this.historyData.FUNDACCT_INFO_LIST) {
      bizPublicMethod.$blMethod.parseOldBiz(_this, _this.groupDatas, { "CUACCT_INFO": { "CUACCT_BASIC_INFO_STEP1": _this.historyData.FUNDACCT_INFO_LIST } });
    }
  },
  'openBizFundAcctNodePageActivated': (_this) => {
    _this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[0].MODULE_READ = "1";
    _this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[0].MODULE_CONTROL_TXT = "选择";
    _this.$nextTick(() => {
      let sessionFundList = _this.$storage.getJsonSession(_this.$definecfg.FUND_LIST) || [];
      if (sessionFundList.length == 0) {
        _this.$router.goModule("addFund");
      } else {
        //先将机构登记字段 清空 再通过选择列表进行回填
        _.each(_this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[0].FIELDS, function (field) {
          if(field.FIELD_ID != 'TA_CODE'){
            _this.$delete(_this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[0].FIELDS, field.FIELD_ID); 
          }
        })
        // 遍历增加基金机构o
        _.each(sessionFundList, (orgItem, index) => {
          let fieldModule = _.cloneDeep(_this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[0].FIELDS.TA_CODE);
          let FIELD_SEQ = parseInt(fieldModule.FIELD_SEQ) + (index + 1) + '';
          let DEFAULT_VALUE = orgItem.ORG_CODE + ' - ' + orgItem.ORG_NAME;
          let config = {"FIELD_ID":"TA_CODE_"+(index+1),"FIELD_TITLE":"基金公司","FIELD_SEQ":FIELD_SEQ,"DEFAULT_VALUE":DEFAULT_VALUE,"FIELD_CONTROL":"0",'FIELD_TYPE':'normalinput','IS_SHOW_BUTTON':true,'FIELD_BUTTON_TXT':'删除'};
          _this.$set(_this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[0].FIELDS, "TA_CODE_" + (index + 1), Object.assign({}, fieldModule, config));
        })
      }
      // let MODULE_SEQ = 10;
      // let length = _this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1.length
      // let newCuacctGroup = [];
      // _.each(sessionFundList, function (item, index) {
      //   let oldcuacctInfo = _.cloneDeep(_this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[length - 1]);
      //   if (!_this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[0].FIELDS.TA_CODE.DEFAULT_VALUE.length && item.ORG_CODE.length) {
      //     _this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[index].FIELDS.TA_CODE.DEFAULT_VALUE = item.ORG_CODE;
      //     _this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[index].FIELDS.TA_CODE.fieldName = item.ORG_CODE + "-" + item.ORG_NAME;
      //     _this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[index].moduleFundInfo = item;
      //   } else {
      //     oldcuacctInfo.MODULE_READ = "0";
      //     oldcuacctInfo.MODULE_SEQ = MODULE_SEQ + 10;
      //     MODULE_SEQ = oldcuacctInfo.MODULE_SEQ;
      //     oldcuacctInfo.FIELDS.TA_CODE.DEFAULT_VALUE = item.ORG_CODE;
      //     oldcuacctInfo.FIELDS.TA_CODE.fieldName = item.ORG_CODE + "-" + item.ORG_NAME;
      //     oldcuacctInfo.moduleFundInfo = item;
      //     newCuacctGroup.push(oldcuacctInfo);

      //     _this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1.push(oldcuacctInfo);
      //   }
      // })
    })

  },
  'openBizFundAcctNodeValidate': (_this) => {
    let that = _this,
      validFlag = true;
    _this.oppBusiData.syscodesFlag = false;
    let cuacctInfo = _this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1;
    if (!_this.oppBusiData.syscodesFlag) {
      _.each(cuacctInfo, function (item) {
        if (item.moduleFundInfo && item.moduleFundInfo.SYS_CODES && _.indexOf(item.moduleFundInfo.SYS_CODES.split(","), "40") != -1) {
          _this.oppBusiData.syscodesFlag = true;
        }
      })
    }
    _this.$storage.setSession(_this.$definecfg.FUND_LIST, []);
    return true
  },
  'openBizFundAcctNodeBeforeSave': (_this, params) => {
    getData(_this, params);
    console.log(params)
  },
  'CHECK_OPENED_FUND_ACCOUNT__CLICK': (_this) => {
    _this.$router.goModule("showAllFundCompanyModule");
  },
  'CHECK_FUND_COMPANY__CLICK': (_this, curField, fields) => {
    _this.$delete(_this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP2[0].FIELDS, curField.FIELD_ID);
    let size = _.size(_this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP2[0].FIELDS);
    // 当前没有选择的基金公司,将按钮设为灰色且不可点击
    _this.disableNext = size == 1 ? true : false;
  },
  // 按钮触发添加字段
  'readModule': (_this) => {
    console.log("按钮触发添加字段")
    // 跳转前先设置session
    // _this.$storage.setSession(_this.$definecfg.FUND_LIST,);
    if (!_this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1[0].FIELDS.TA_CODE.DEFAULT_VALUE.length) {
      _this.$storage.setSession(_this.$definecfg.FUND_LIST, []);
    } else {
      _this.$storage.setSession(_this.$definecfg.FUND_LIST, _this.groupDatas.CUACCT_INFO.CUACCT_BASIC_INFO_STEP1);
    }

    _this.$router.goModule("selectFundModule");
  },

}
