/*
 *   个人基本信息模块
 *   方法封装
 *   @author  yangyp
 */

import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import custService from "../../../../../../../service/cust-service.js"

//获取开户机构
const getOpenOrgCode = (_this) => {
    let customerInfo = JSON.parse(_this.$storage.getSession(_this.$definecfg.CUSTOMER_INFO));
    if (!customerInfo.CUST_CODE) {
        //开户业务，客户代码不存在，选择柜员有权限的机构
        return _this.$syscfg.K_Request('Y1000200', _.extend({
            ORG_TYPE: "0",
            RIGHT_TYPE: "3"
        }));
    }else {
        //客户代码存在，展示客户的开户机构
        return _this.$syscfg.K_Request('Y1000200', _.extend({
            ORG_TYPE: "0"
        }));
    }

}
let groupId = "CUST_INFO_WRAP"
let templateId = "CUST_INFO_WRAP"

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizCustInfoWrapNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustInfoWrapNodeBeforeLoadBiz: function (_this) {
        // //对客户性质赋值
        // _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.USER_TYPE.DEFAULT_VALUE = _.get(_this.oppBusiData.oldBusiData,"CUST_BASIC_INFO.USER_TYPE","");
        // if (!_.isEmpty(_this.oppBusiData.oldBusiData.CUST_BASIC_INFO.USER_TYPE)) {
        //     _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.USER_TYPE.FIELD_CONTROL = "2";
        // }
        // //对客户代码赋值
        // _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.CUST_CODE.DEFAULT_VALUE = _.get(_this.oppBusiData.oldBusiData,"CUST_BASIC_INFO.CUST_CODE","");
        // //对客户状态赋值
        // _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.CUST_STATUS.DEFAULT_VALUE = _.get(_this.oppBusiData.oldBusiData,"CUST_BASIC_INFO.CUST_STATUS","");
        // //客户基本分类
        // _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.PROF_INVESTOR_TYPE.DEFAULT_VALUE = _.get(_this.oppBusiData.oldBusiData,"PROF_INVESTOR_TYPE.PROF_INVESTOR_TYPE","");
        // //客户分类来源
        // _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.PROF_INVESTOR_SOURCE.DEFAULT_VALUE = _.get(_this.oppBusiData.oldBusiData,"PROF_INVESTOR_TYPE.PROF_INVESTOR_SOURCE","");

        // if (_.isEmpty(_this.oppBusiData.oldBusiData.CUST_BASIC_INFO && _this.oppBusiData.oldBusiData.CUST_BASIC_INFO.CUST_CODE)) {
        //     _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.ORG_CODE.FIELD_CONTROL = "0";
        //     _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.CUST_CODE.FIELD_CONTROL = "1";
        //     _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.CUST_STATUS.FIELD_CONTROL = "1";
        //     _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.PROF_INVESTOR_TYPE.FIELD_CONTROL = "1";
        //     _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.PROF_INVESTOR_SOURCE.FIELD_CONTROL = "1";
        // }
        
        // //对开户机构进行赋值
        // return getOpenOrgCode(_this).then(res => {
        //     let allOrgCode = res.Data;
        //     allOrgCode.map(v => {
        //         v.DICT_ITEM = v.ORG_CODE;
        //         v.DICT_ITEM_NAME = v.ORG_NAME;
        //         return v;
        //     })
        //     _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.ORG_CODE.FIELD_DICT_NAME = allOrgCode;
        //     _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.ORG_CODE.DEFAULT_VALUE =  _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO).INT_ORG;
        // }).catch(err => {
        //     _this.loading = false;
        //     console.log("开户数据国籍字典获取失败", err.toString())
        //     throw "开户数据国籍字典获取失败"
        // });
    },
    // 开户历史数据加载
    bizCustInfoWrapNodeBeforeLoadBizOpenAcct: function(_this) {
        //展示生成客户代码按钮
        _this.groupDatas.CUST_INFO_WRAP.CUST_INFO_WRAP[0].FIELDS.CUST_CODE.FIELD_BUTTON_TXT = "生成"
        _this.groupDatas.CUST_INFO_WRAP.CUST_INFO_WRAP[0].FIELDS.CUST_CODE.IS_SHOW_BUTTON = true;
        return getOpenOrgCode(_this).then(res => {
            let allOrgCode = res.Data;

            allOrgCode.map(v => {
                v.DICT_ITEM = v.ORG_CODE;
                v.DICT_ITEM_NAME = v.ORG_NAME;
                return v;
            })
            _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.ORG_CODE.FIELD_DICT_NAME = allOrgCode;
            // 开户时 机构可以选择，默认为当前登录柜员的所在机构  如果为存量户 则为对应客户所在的开户机构
            let intOrg = _this.oppBusiData.newBusiData.CUST_INFO_WARP && _this.oppBusiData.newBusiData.CUST_INFO_WARP.INT_ORG || "";

            _this.groupDatas[groupId].CUST_INFO_WRAP[0].FIELDS.ORG_CODE.DEFAULT_VALUE = intOrg || _this.$storage.getJsonSession(_this.$definecfg.USER_INFO).ORG_CODE;
        }).catch(err => {
            _this.loading = false;
            throw "开户数据字典获取失败"
        });
    },
    /*
     *@method bizCustInfoWrapNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizCustInfoWrapNodeAfterLoadBiz: function (_this) {
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);  //0-新开客户、1是存量客户
        if (isOpenAcct == '0') {
            let intOrg = _this.oppBusiData.newBusiData.CUST_INFO_WRAP && _this.oppBusiData.newBusiData.CUST_INFO_WRAP.INT_ORG || "";
            let custCode = _.get(_this.oppBusiData.newBusiData, "CUST_INFO_WRAP.CUST_CODE", "");
            _this.groupDatas.CUST_INFO_WRAP.CUST_INFO_WRAP[0].FIELDS.CUST_CODE.DEFAULT_VALUE = custCode;
            if(custCode) {
                _this.groupDatas.CUST_INFO_WRAP.CUST_INFO_WRAP[0].FIELDS.CUST_CODE.IS_SHOW_BUTTON = false;
                _this.groupDatas.CUST_INFO_WRAP.CUST_INFO_WRAP[0].FIELDS.CUST_CODE.FIELD_CONTROL = "2";
            }
            // 回填历史数据时  将保存的INT_ORG 重新放入 CUSTOMER_INFO 中
            // 往客户信息里添加 开户机构
            let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            Object.assign(custInfo, {INT_ORG: intOrg});
            _this.$storage.setSession(_this.$definecfg.CUSTOMER_INFO, custInfo);
        }
    },
    /*
     *@method bizCustInfoWrapNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustInfoWrapNodeBeforeSave: async function (_this, params) {
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);  //0-新开客户、1是存量客户
        //数据保存
        if (_this.moduleId.indexOf("CUST_INFO_WRAP") != -1) {
            let custInfoWrap = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "CUST_INFO_WRAP");
            if(params.CUST_INFO == undefined){
                params.CUST_INFO = {};
            }
            let openTemplateData = _this.oppBusiData.openTemplateData || [];
            let custOpenTemplate = _.find(openTemplateData, {OPENTMPL_CFG: custInfoWrap.OPEN_TEMPLATE});
            Object.assign(custOpenTemplate, {
                RMB_INT_RATE_SN: _this.oppBusiData.RMB_INT_RATE_SN,
                HK_INT_RATE_SN: _this.oppBusiData.HK_INT_RATE_SN,
                US_INT_RATE_SN: _this.oppBusiData.US_INT_RATE_SN,
                RMB_DR_RATE_GRP: _this.oppBusiData.RMB_DR_RATE_GRP,
                HK_DR_RATE_GRP: _this.oppBusiData.HK_DR_RATE_GRP,
                US_DR_RATE_GRP: _this.oppBusiData.US_DR_RATE_GRP
            })
            let orgInfoWrap = _this.groupDatas.CUST_INFO_WRAP.CUST_INFO_WRAP[0].FIELDS || {};
            let orgCode = orgInfoWrap.ORG_CODE || {};
            params.ORG_CODE = custInfoWrap.ORG_CODE;
            params.CUST_CODE = custInfoWrap.CUST_CODE;
            params.CUST_ORG_NAME = _.find(orgCode.FIELD_DICT_NAME, {DICT_ITEM: custInfoWrap.ORG_CODE}).ORG_NAME || "";
            let busiData = _this.oppBusiData.newBusiData;
            let orgInfo = busiData && busiData.CUST_INFO || {};
            orgInfo.ORG_OPEN_TEMPLATE = custOpenTemplate;
            Object.assign(params.CUST_INFO, orgInfo);
            // 往客户信息里添加 开户机构和客户代码
            let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
            Object.assign(custInfo, {INT_ORG: custInfoWrap.ORG_CODE})
            _this.$storage.setSession(_this.$definecfg.CUSTOMER_INFO, custInfo);
            _this.$storage.setSession(_this.$definecfg.CUST_ACCT_INFO, {
                CUST_CODE: params.CUST_CODE,
                CUACCT_CODE: params.CUST_CODE
            });
        }
    },
    /*
     *@method bizCustInfoWrapNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizCustInfoWrapNodeAfterSave: (_this, newData) => {
        if (_this.oppBusiData.newBusiData) {
            let newObj = { 
                CUST_INFO: _.get(newData, "CUST_INFO", {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },
    /*
     *@method bizCustInfoWrapNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustInfoWrapNodeValidate: function (_this) {

    },

    /*
     *@method bizCustInfoWrapNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizCustInfoWrapNodePageActivated: function (_this, groupId) {
    },

    //-----------------业务字段关联逻辑-------------------//
    /** 【CHECK_OPEN_TEMPLATE】开户机构选择：
    */
   "CHECK_ORG_CODE": (_this, field, fieldData) => {
    let defaultValut = field.DEFAULT_VALUE || "";
    if (!defaultValut) return;
    let customerInfo = _this.$storage.getSession(_this.$definecfg.CUSTOMER_INFO) || {};
    let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO) || {};
    _this.loading = true;
    _this.loadingText = "正在获取开户模版，请稍候……";
    Promise.all([
        custService.getCustModelSet( {
            ORG_CODE: defaultValut,
            USER_TYPE: customerInfo.USER_TYPE || "0",
            CUACCT_ATTR: "0",
            F_CUST_ORG_CODE: defaultValut
        }),
        custService.getOpenTemplateData(defaultValut, customerInfo.USER_TYPE || "0")
    ]).then( ([data, rateObj]) => {
        _this.oppBusiData.openTemplateData = data;
        let templateDict = _.map(data, item =>  {
            return {
                DICT_ITEM: item.OPENTMPL_CFG,
                DICT_ITEM_NAME: item.OPENTMPL_CFG + "-" + item.OPENTMPL_NAME 
            }
        })
        fieldData.OPEN_TEMPLATE.FIELD_DICT_NAME = templateDict || [];
        // 若流程数据未存在客户模版 或 选择的机构跟原机构代码不一致，则默认第一个
        if (!fieldData.OPEN_TEMPLATE.DEFAULT_VALUE || defaultValut != userInfo.ORG_CODE) {
            fieldData.OPEN_TEMPLATE.DEFAULT_VALUE = _.get(data, "[0].OPENTMPL_CFG", "");
        }
         // 设置币种利率
         _this.oppBusiData.RMB_INT_RATE_SN = rateObj.RMB_INT_RATE_SN || "";
         _this.oppBusiData.HK_INT_RATE_SN = rateObj.HK_INT_RATE_SN || "";
         _this.oppBusiData.US_INT_RATE_SN = rateObj.US_INT_RATE_SN || "";

         _this.oppBusiData.RMB_DR_RATE_GRP = rateObj.RMB_DR_RATE_GRP || "";
         _this.oppBusiData.HK_DR_RATE_GRP = rateObj.HK_DR_RATE_GRP || "";
         _this.oppBusiData.US_DR_RATE_GRP = rateObj.US_DR_RATE_GRP || "";
    }).finally( () => {
        _this.loading = false;
    })
},
"CHECK_CUST_CODE__CLICK": (_this, field, fieldData) => {
    let curOrgCode = fieldData.ORG_CODE.DEFAULT_VALUE || "";
    if (!curOrgCode) {
        _this.pushFlowTip({
            title:"生成客户代码前，请先选择开户机构！",
            key: 'noOrgCode',
            type: 'warning'
        })
        return;
    }
    _this.loading = true;
    custService.getNewCustCode(curOrgCode).then( data => {
        field.DEFAULT_VALUE = _.get(data, "[0].USER_CODE");
        _this.groupDatas.CUST_INFO_WRAP.CUST_INFO_WRAP[0].FIELDS.CUST_CODE.IS_SHOW_BUTTON = false;
        _this.groupDatas.CUST_INFO_WRAP.CUST_INFO_WRAP[0].FIELDS.CUST_CODE.FIELD_CONTROL = "2";
    }).finally( () => {
        _this.loading = false;
    })
}
}

