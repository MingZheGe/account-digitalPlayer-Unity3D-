/*
 *   产品管理人重要信息模块
 *   方法封装
 *   @author  yangyp
 */

import date from '../../../../../../../tools/date.js'
import * as utils from "../../../../../../../tools/util"
import bizPublicSaveMethod from '../../../../../../businessTools/bizPublicSaveMethod.js'
import bizPublicMethod from "../../../../../../businessTools/bizPublicMethod.js"
import custInfoModel from '../../common/cust-info-model.js'


//开户和非开户 字段数据加载 公共操作
const bizProManagerImportantInfoNodeBeforeLoadBizCommon = (_this) => {
    
}

export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizProManagerImportantInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProManagerImportantInfoNodeBeforeLoadBiz: function (_this) {
        bizProManagerImportantInfoNodeBeforeLoadBizCommon(_this)
        var proManagerImportantInfo = custInfoModel.getOriginaProManagerImportantInfo(_this.oppBusiData.oldBusiData)
        if(!_.isEmpty(proManagerImportantInfo)){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["PRO_MANAGER_IMPORT_INFO"], proManagerImportantInfo);      
        }

    },
    bizProManagerImportantInfoNodeBeforeLoadBizOpenAcct: function (_this) {
        bizProManagerImportantInfoNodeBeforeLoadBizCommon(_this)
    },
    /*
     *@method bizProManagerImportantInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizProManagerImportantInfoNodeAfterLoadBiz: function (_this) {
        if(_.get(_this.oppBusiData.newBusiData, "MANAGER_INFO.PRO_MANAGER_IMPORT_INFO", "")
            && Object.keys(_this.oppBusiData.newBusiData.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO).length){
            bizPublicMethod.$blMethod.parseGroupsMouduleData(_this, ["PRO_MANAGER_IMPORT_INFO"], _this.oppBusiData.newBusiData.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO);      
        }
    },
    /*
     *@method bizProManagerImportantInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProManagerImportantInfoNodeBeforeSave: function (_this, params) {
        let proManagerImportInfo = bizPublicSaveMethod.getModuleObjctFoyKey(_this, "PRO_MANAGER_IMPORT_INFO");
        let isOpenAcct = _this.$storage.getJsonSession(_this.$definecfg.IS_OPEN_ACCT_BIZ);
        if (proManagerImportInfo.LAND_TAX_NO == "") {
            proManagerImportInfo.LAND_TAX_NO_EXP_DATE = "";
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.LAND_TAX_NO_EXP_DATE.DEFAULT_VALUE = "";
        }
        let busiData = _this.oppBusiData.newBusiData;
        let managerInfo = busiData.MANAGER_INFO || {};
        managerInfo.PRO_MANAGER_IMPORT_INFO = proManagerImportInfo;

        if(isOpenAcct == "1") {
            var managerImportantDiffInfo = bizPublicMethod.$blMethod.compareInfo2(custInfoModel.getOriginaProManagerImportantInfo(_this.oppBusiData.oldBusiData), proManagerImportInfo);
            managerInfo.PRO_MANAGER_IMPORT_CHANGE_INFO  = Object.assign({}, proManagerImportInfo, {
                DIFF_INFO:managerImportantDiffInfo
            })
        }

        Object.assign(params.MANAGER_INFO, managerInfo);
    },
    /*
     *@method bizProManagerImportantInfoNodeAfterSave
     *@desc 钩子函数 自定义保存数
     */
    bizProManagerImportantInfoNodeAfterSave: (_this, newData) => {
        if (_this.oppBusiData.newBusiData) {
            let newObj = { 
                MANAGER_INFO: _.get(newData, "MANAGER_INFO", {})
            }
            _.assign(_this.oppBusiData.newBusiData, newObj);
        }
    },
    /*
     *@method bizProManagerImportantInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProManagerImportantInfoNodeValidate: function (_this) {
      
    },

    /*
     *@method bizProManagerImportantInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizProManagerImportantInfoNodePageActivated: function (_this, groupId) {
        
    },

    bizProManagerImportantInfoNodePreValidate: function(_this) {
    },
    //----------------------业务函数----------------------------------//
    /**
     *   若选择工商营业执照/事业法人/社团法人/机关法人。
        若录入18账号，自动填充组织机构代码、国税登记证。
        若为15位账户，组织机构代码、税务登记证由其分别选择手动录入，不自动填充。
        必填项，若基本信息中证件类型为组织机构代码证1A则系统自动变更，不可编辑
        根据统一社会信用代码编码规则， 18 位
        社会信用代码由登记管理部门代码（第 1 位）、机构类别代码（第 2位）、登记管理机关行政区划码（第 3—8 位）、
        主体标识码（组织机构代码）（第 9—17 位）、校验码（第 18 位）五部分组成。
        税务登记证号码与统一社会信用的代码证一致
    * @param idTypeVal
    * @param idCodeVal
    */
    setBusinessTaxNo: function (_this, idTypeVal, idCodeVal) {
        let fieldArr = ["PRO_MANAGER_ASSI_CODE", "PRO_MANAGER_ASSI_EXP", "BUSINESS_TAX_NO", "TAX_NO_EXP_DATE"];
        // 机构户证件类型为 10 ，证件号码18位时自动填充
        if (_.indexOf(["10"], idTypeVal) !== -1 && idCodeVal.length === 18) {
            //主体标识码（组织机构代码）（第 9—17 位）
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.PRO_MANAGER_ASSI_CODE.DEFAULT_VALUE = idCodeVal.substring(8, 16) + "-" + idCodeVal.substring(16, 17);
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.BUSINESS_TAX_NO.DEFAULT_VALUE = idCodeVal
            if (_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion] == "ZHONGSHAN") {
                //中山个性化：国税地税需要自动填充该营业执照号的第3-17位（置灰，不可修改）
                _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.PRO_MANAGER_ASSI_CODE.DEFAULT_VALUE = idCodeVal.substring(2, 17);
                _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.BUSINESS_TAX_NO.DEFAULT_VALUE = idCodeVal.substring(2, 17)
                _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.LAND_TAX_NO.FIELD_CONTROL = "2";
                _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.LAND_TAX_NO_EXP_DATE.FIELD_CONTROL = "2";
            }
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.PRO_MANAGER_ASSI_CODE.FIELD_CONTROL = "2";
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.PRO_MANAGER_ASSI_EXP.FIELD_CONTROL = "2";
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.BUSINESS_TAX_NO.FIELD_CONTROL = "2";
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.TAX_NO_EXP_DATE.FIELD_CONTROL = "2";
        } else {
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.PRO_MANAGER_ASSI_CODE.FIELD_CONTROL = "0";
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.PRO_MANAGER_ASSI_EXP.FIELD_CONTROL = "0";
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.BUSINESS_TAX_NO.FIELD_CONTROL = "0";
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.TAX_NO_EXP_DATE.FIELD_CONTROL = "0";
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.LAND_TAX_NO.FIELD_CONTROL = "0";
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.LAND_TAX_NO_EXP_DATE.FIELD_CONTROL = "0";
            _.each(fieldArr, fieldId => {
                _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS[fieldId].DEFAULT_VALUE = "";
            })
        }
    },
    /**
     * 设置组织机构代码证、国税有效期
     * @param idTypeVal
     * @param idCodeVal
     * @param idExpDate
     */
    setTaxNoExpDate: function (_this, idTypeVal, idCodeVal, idExpDate) {
        if (_.indexOf(["10"], idTypeVal) !== -1 && idCodeVal.length === 18) {
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.PRO_MANAGER_ASSI_EXP.DEFAULT_VALUE = idExpDate;
            _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.TAX_NO_EXP_DATE.DEFAULT_VALUE = idExpDate;
            if (_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion] == "ZHONGSHAN") { 
                _this.groupDatas.MANAGER_INFO.PRO_MANAGER_IMPORT_INFO[0].FIELDS.LAND_TAX_NO_EXP_DATE.DEFAULT_VALUE = idExpDate;
            }
        }
    }
}
