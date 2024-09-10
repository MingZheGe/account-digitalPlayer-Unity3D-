/*
 *   个人基本信息模块
 *   方法封装
 *   @author  yangyp
 */

import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import bizPublicSaveMethod from "../../../../../../businessTools/bizPublicSaveMethod.js"
import date from "../../../../../../../tools/date"
let idType = '';
let legalClientIdType = '';

const controlIdTypeAndIdCode = (_this, fieldIdType, loadFlag) => {
  let dictItem = _.map(fieldIdType.FIELD_DICT_NAME, 'DICT_ITEM');
  // 不进行过滤
  if (!loadFlag) {
      fieldIdType.FIELD_DICT_FILTER = dictItem;
  } else {
      // 过滤字典
      fieldIdType.FIELD_DICT_FILTER = _.filter(dictItem, function(item) {
          return loadFlag === "0" ? item.charAt(0) == "0" : item.charAt(0) != "0"
      });
  }
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@methodbizOrgLegalInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
   bizOrgLegalInfoNodeBeforeLoadBiz: function (_this) {
      if(_this.oppBusiData.oldBusiData && 
        _this.oppBusiData.oldBusiData.LEGAL_INFO && 
        _this.oppBusiData.oldBusiData.LEGAL_INFO.length){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["LEGAL_INFO"] , _this.oppBusiData.oldBusiData.LEGAL_INFO[0]);
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["LEGAL_CLIENT"] , _this.oppBusiData.oldBusiData.LEGAL_INFO[0]);
      }
    },
    /*
     *@methodbizOrgLegalInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
   bizOrgLegalInfoNodeAfterLoadBiz: function (_this) {
      //重新解析历史数据
      if(_this.oppBusiData.newBusiData && 
        _this.oppBusiData.newBusiData.LEGAL_INFO){
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["LEGAL_INFO"] , _this.oppBusiData.newBusiData.LEGAL_INFO);
        bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["LEGAL_CLIENT"] , _this.oppBusiData.newBusiData.LEGAL_INFO);
      }
    },
    /*
     *@methodbizOrgLegalInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
   bizOrgLegalInfoNodeBeforeSave: function (_this, params) {
        //数据保存
        let that = this;
        if (_this.moduleId.indexOf("LEGAL_INFO") != -1) {
          let legalInfo = {},
              legalClientInfo = {},
              OPER_TYPE,
              diffInfo; // 新值
          bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.ORG_INFO.LEGAL_INFO[0].FIELDS, legalInfo);
          bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.ORG_INFO.LEGAL_CLIENT[0].FIELDS, legalClientInfo);
          // 将法人 和 委托信息合并在一起处理
          legalInfo = _.extend({}, legalInfo, legalClientInfo);
          // 如果用户法人信息不存在 则设置为修改
          if (_this.oppBusiData.oldBusiData.LEGAL_INFO && _this.oppBusiData.oldBusiData.LEGAL_INFO.length > 0) {
            diffInfo = bizPublicMethod.$blMethod.compareInfoZT(_this.oppBusiData.oldBusiData.LEGAL_INFO[0], legalInfo) || [];
            if (diffInfo.length > 0) {
              OPER_TYPE = "1";
            } else {
              OPER_TYPE = "3";
            }
          } else {
            diffInfo = bizPublicMethod.$blMethod.compareInfoZT({}, legalInfo) || [];
            OPER_TYPE = "1";
          }
          // let legalData = Object.assign(_this.oppBusiData.oldBusiData.LEGAL_INFO && _this.oppBusiData.oldBusiData.LEGAL_INFO[0] || {}, legalInfo)
          params.LEGAL_INFO = Object.assign({},{
            DIFF_INFO: diffInfo,
            IS_MODIFY: that.filterDiffInfo(diffInfo),
            titleFlag: _this.oppBusiData.modelFlag !== undefined ? _this.oppBusiData.modelFlag : _.get(_this.oppBusiData.newBusiData, "LEGAL_INFO.titleFlag", false), // bizOrgBasicInfoNode=>changeLegalModelInfo方法保存
            OPER_TYPE: OPER_TYPE,
          }, legalInfo);
        }
    },
    filterDiffInfo: function (diffInfo) {
      let diffInfo1 = diffInfo || [];
      if (diffInfo1.length) {
          let temp1Data = ["LEGAL_REP", "LEGAL_REP_ID_TYPE", "LEGAL_REP_ID_CODE", "LEGAL_REP_ID_EXP_DATE"],
              flag1 = false,//法定代表人
              temp2Data = ["LEGAL_CLIENT_NAME", "LEGAL_CLIENT_ID_TYPE", "LEGAL_CLIENT_ID_CODE", "LEGAL_CLIENT_EXP_DATE"],
              flag2 = false;  //委派代表
          diffInfo1.forEach((item, index) => {
            if (!flag1 && temp1Data.includes(item.FIELD)) {
                flag1 = true;
            } else if (!flag2 && temp2Data.includes(item.FIELD)) {
                flag2 = true;
            }
          });
          return flag1 && flag2 ? "ALL" : (flag1 ? "REP" : (flag2 ? "CLIENT" : ""));
      }
      return "";
  },
    /*
     *@methodbizOrgLegalInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgLegalInfoNodeValidate: function (_this) {
    },

    /*
     *@methodbizOrgLegalInfoNodeGetData
     *@desc 拼接数据
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
   bizOrgLegalInfoNodeGetData: function (_this, params) {
      
    },

    /*
     *@methodbizOrgLegalInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
   bizOrgLegalInfoNodePageActivated: function (_this, groupId) {   
      let fields = _this.groupDatas.ORG_INFO.LEGAL_INFO[0].FIELDS;
      fields.LEGAL_REP_ID_CODE.firstValidate = true;
      _this.$refs.flowTip.flowTips = [];
      if (fields.LEGAL_REP_ID_EXP_DATE.DEFAULT_VALUE && date.compareDate(fields.LEGAL_REP_ID_EXP_DATE.DEFAULT_VALUE, date.getClientDate("yyyyMMdd")) == -1 ) {
          _this.pushFlowTip({
              title:"法定代表人的证件有效期截止日期[" + fields.LEGAL_REP_ID_EXP_DATE.DEFAULT_VALUE + "]小于当前系统日期[" + date.getClientDate("yyyyMMdd") + "]！",
              key:'warningTip',
              type:'warning'
          })
      }
      
      fields["LEGAL_REP_ID_EXP_DATE"].VALID_TYPE = "end";
      fields.LEGAL_REP.VALID_TYPE = "val[4,32]|on-blur";
      fields.LEGAL_REP_ID_CODE.VALID_TYPE = 'on-prompt|on-blur';
      fields.LEGAL_REP_ID_CODE.promptValue = fields.LEGAL_REP_ID_CODE.DEFAULT_VALUE;
      let modelFlag = _this.oppBusiData.modelFlag !== undefined ? _this.oppBusiData.modelFlag : _.get(_this.oppBusiData.newBusiData, "LEGAL_INFO.titleFlag", false);
      controlIdTypeAndIdCode(_this, fields.LEGAL_REP_ID_TYPE, modelFlag ? "" : "0");

      // 产品户过滤证件类型
      if (_this.userType == "2") {
        let dictItem = _.map(fields.LEGAL_REP_ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM');
        // 过滤字典
        fields.LEGAL_REP_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function(item) {
          return item.charAt(0) == "0";
        });
      }
      if (fields.LEGAL_REP_ID_TYPE.FIELD_DICT_FILTER && _.indexOf(fields.LEGAL_REP_ID_TYPE.FIELD_DICT_FILTER, fields.LEGAL_REP_ID_TYPE.DEFAULT_VALUE) == -1) {
        fields.LEGAL_REP_ID_TYPE.DEFAULT_VALUE = "";
        fields.LEGAL_REP_ID_CODE.DEFAULT_VALUE = "";
      }
      //过滤证件类型
      let legalClientFields = _this.groupDatas.ORG_INFO.LEGAL_CLIENT[0].FIELDS;
      legalClientFields["LEGAL_CLIENT_EXP_DATE"].VALID_TYPE = "end";
      let dictItem = _.map(legalClientFields.LEGAL_CLIENT_ID_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')
      legalClientFields.LEGAL_CLIENT_ID_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function(item) {
          return item.charAt(0) == '0'
      });
    },

    
   bizOrgLegalInfoNodeGetCustInfo: function (_this, groupId) {},

  "CHECK_LEGAL_REP_ID_TYPE": function(_this, field, fieldData) {
      if (_.indexOf(["0b", "0c"], field.DEFAULT_VALUE) !== -1) {
        _this.groupDatas.ORG_INFO.LEGAL_INFO[0].FIELDS.LEGAL_REP_ID_CODE.VALID_TYPE = 'fixedNumLength[9]|on-prompt|on-blur'
      } else if(field.DEFAULT_VALUE == '0d') {
          _this.groupDatas.ORG_INFO.LEGAL_INFO[0].FIELDS.LEGAL_REP_ID_CODE.VALID_TYPE = 'fixedNumLength[8]|on-prompt|on-blur'
      } else if (field.DEFAULT_VALUE == '00' || field.DEFAULT_VALUE == '08') {
          _this.groupDatas.ORG_INFO.LEGAL_INFO[0].FIELDS.LEGAL_REP_ID_CODE.VALID_TYPE = 'iscard|on-prompt|on-blur'
      } else if (field.DEFAULT_VALUE == '10') {
        _this.groupDatas.ORG_INFO.LEGAL_INFO[0].FIELDS.LEGAL_REP_ID_CODE.VALID_TYPE = 'licensecode|on-prompt|on-blur'
      } else {
          _this.groupDatas.ORG_INFO.LEGAL_INFO[0].FIELDS.LEGAL_REP_ID_CODE.VALID_TYPE = 'charMinus[0,32]|on-prompt|on-blur'
      }
      if(idType && field.DEFAULT_VALUE != idType) {
        fieldData.LEGAL_REP_ID_CODE.DEFAULT_VALUE = '';
        fieldData.LEGAL_REP_ID_CODE.promptValue = '';
      }
      idType = field.DEFAULT_VALUE;
      if (field.DEFAULT_VALUE == ""){
        return;
      }
      //  || field.DEFAULT_VALUE == ""
      if (field.DEFAULT_VALUE.charAt(0) === "0") {
        // 不展示合约人模块
        _this.groupDatas.ORG_INFO.LEGAL_CLIENT[0].MODULE_CONTROL = "0";
        let legalClientInfo = _this.groupDatas.ORG_INFO.LEGAL_CLIENT[0].FIELDS;
        legalClientInfo.LEGAL_CLIENT_NAME.DEFAULT_VALUE = "";
        legalClientInfo.LEGAL_CLIENT_ID_TYPE.DEFAULT_VALUE = "";
        legalClientInfo.LEGAL_CLIENT_ID_CODE.DEFAULT_VALUE = "";
        legalClientInfo.LEGAL_CLIENT_EXP_DATE.DEFAULT_VALUE = "";
      } else {
        // 展示合约人模块
        _this.groupDatas.ORG_INFO.LEGAL_CLIENT[0].MODULE_CONTROL = "1";
      }

  },
  "CHECK_LEGAL_CLIENT_ID_TYPE": function(_this, field, fieldData) {
    if (_.indexOf(["0b", "0c"], field.DEFAULT_VALUE) !== -1) {
      _this.groupDatas.ORG_INFO.LEGAL_CLIENT[0].FIELDS.LEGAL_CLIENT_ID_CODE.VALID_TYPE = 'fixedNumLength[9]|on-prompt|on-blur'
    } else if(field.DEFAULT_VALUE == '0d') {
        _this.groupDatas.ORG_INFO.LEGAL_CLIENT[0].FIELDS.LEGAL_CLIENT_ID_CODE.VALID_TYPE = 'fixedNumLength[8]|on-prompt|on-blur'
    } else if (field.DEFAULT_VALUE == '00' || field.DEFAULT_VALUE == '08') {
        _this.groupDatas.ORG_INFO.LEGAL_CLIENT[0].FIELDS.LEGAL_CLIENT_ID_CODE.VALID_TYPE = 'iscard|on-prompt|on-blur'
    } else if (field.DEFAULT_VALUE == '10') {
      _this.groupDatas.ORG_INFO.LEGAL_CLIENT[0].FIELDS.LEGAL_CLIENT_ID_CODE.VALID_TYPE = 'licensecode|on-prompt|on-blur'
    } else {
        _this.groupDatas.ORG_INFO.LEGAL_CLIENT[0].FIELDS.LEGAL_CLIENT_ID_CODE.VALID_TYPE = 'charMinus[0,32]|on-prompt|on-blur'
    }
    if(legalClientIdType && field.DEFAULT_VALUE != legalClientIdType) {
      fieldData.LEGAL_CLIENT_ID_CODE.DEFAULT_VALUE = '';
      fieldData.LEGAL_CLIENT_ID_CODE.promptValue = '';
    }
    legalClientIdType = field.DEFAULT_VALUE;
  },
  "CHECK_LEGAL_REP_ID_CODE" : function(_this, field, fieldData) {
    
  } 
}
