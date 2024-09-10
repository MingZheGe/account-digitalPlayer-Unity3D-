
import oppService from '../../../../../service/opp-service'
const required_BIAOZHUN = "BENEFICIARY_RELATION,BENEFICIARY_NAME,BENEFICIARY_ID_TYPE,BENEFICIARY_ID_NO,BENEFICIARY_ID_EXP_DATE";
const required_YINHE = "";
const fieldControl_YINHE = ["BENEFICIARY_ID_EXP_DATE","REG_DATE","BENEFICIARY_EMAIL", "OCCU_TYPE", "ZIP_CODE","REG_ADDR","SEX","NATION","BIRTHDAY","BENEFICIARY_ADDR","EMAIL"];
const fieldControl_BIAOZHUN = ["BENEFICIARY_EMAIL", "OCCU_TYPE", "REG_ADDR", "ZIP_CODE"];

const addBenficiaryItem = function(_this, bData) {
    _.each(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO, moduleData => {
        let benficiaryRela = moduleData.FIELDS.BENEFICIARY_RELA
        // “与本人关系”屏蔽掉：子公司、母公司、关联公司、其他（13）；
        benficiaryRela.FIELD_DICT_FILTER = _.map(_.filter(moduleData.FIELDS.BENEFICIARY_RELA.FIELD_DICT_NAME, v => {
            return v.DICT_ITEM.charAt("0") == "0" && ["10","11", "12", "13"].indexOf(v.DICT_ITEM) === -1;
        }), 'DICT_ITEM')
    })
}
const checkOneSelf = function(_this, fieldDatas) {
    let existFlag = false, existCount = 0;
    _.each(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO, o => {
        o.FIELDS.BENEFICIARY_RELA.DEFAULT_VALUE == '0Z' ? existCount++ : '';
        if (existCount == 2) {
            existFlag = true;
            return false;
        }
    })
    fieldDatas.BENEFICIARY_ID_TYPE.notCheck = true

    let fieldControl = ["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion])!= -1? fieldControl_YINHE : fieldControl_BIAOZHUN;
    let requiredArr = ["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion])!= -1? required_YINHE : required_BIAOZHUN;
        
    if (existFlag) {
        _this.$blMethod.showMsgBox(_this, "受益人已经存在“本人”的记录，不能重复添加！")
    } else {
        // 回填本人信息
        _.each(fieldDatas, field => {
            if (field.FIELD_ID in _this.oppBusiData.ONESELF_DATA_OBJ) {
                field.DEFAULT_VALUE = _this.oppBusiData.ONESELF_DATA_OBJ[field.FIELD_ID]
                field.FIELD_ID != 'BENEFICIARY_RELA' ? field.FIELD_CONTROL = '2' : field.FIELD_CONTROL = '0'
                if (field.FIELD_ID != "BENEFICIARY_RELA" && !field.DEFAULT_VALUE) {
                    field.FIELD_REQUIRED = '0';
                    field.correct = true;
                    field.message = '';
                }
            }
            if (fieldControl.indexOf(field.FIELD_ID) > -1 && field.FIELD_ID != 'BENEFICIARY_RELA') {
                field.FIELD_CONTROL = "1"
            }
        })
    }
}
export default {
    openBizCustBenficiaryBeforeLoadBiz(_this) {
        let MAX_LENGTH = oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray, "MAX_BENEFICIARY") || "3";
        _this.groupDatas.CUST_INFO.BENEFICIARY_INFO[0].MAX_LENGTH = MAX_LENGTH;
        let BENEFICIARY_ID_TYPE= _this.groupDatas.CUST_INFO.BENEFICIARY_INFO[0].FIELDS.BENEFICIARY_ID_TYPE;

        //证件类型去掉“军官证、士兵证、户口本、台胞证、解放军文职干部、武警文职干部、社会保障号、文职证、警官证”
        BENEFICIARY_ID_TYPE.FIELD_DICT_FILTER = _.map(_.filter(_.cloneDeep(BENEFICIARY_ID_TYPE.FIELD_DICT_NAME), v => {
            return v.DICT_ITEM.charAt("0") == "0" && (["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) != -1  ? ["02","03","05","07","0f","0g","0h"].indexOf(v.DICT_ITEM) == -1 : true);
        }),"DICT_ITEM");
        _this.groupDatasTpl.CUST_INFO.BENEFICIARY_INFO[0].FIELDS.BENEFICIARY_ID_TYPE = BENEFICIARY_ID_TYPE;

        return new Promise(reslove => {
            reslove();
        })
    },

    openBizCustBenficiaryAfterLoadBiz(_this) {
        let bdata = {
            "CUST_INFO": {}
        };
        let benficiaryInfo = _this.historyData.RELA_INFO && _this.historyData.RELA_INFO.CUST_BENEFICIARY_INFO || [];
        bdata.CUST_INFO.BENEFICIARY_INFO = benficiaryInfo
        if (!_.isEmpty(bdata.CUST_INFO.BENEFICIARY_INFO)) {
            _this.$blMethod.parseOldBiz(_this, _this.groupDatas, bdata)
            addBenficiaryItem(_this)
        }
    },

    openBizCustBenficiaryPageActivated(_this) {
         // 本人为实际控制人信息
         let CUST_BASIC_INFO = _this.historyData.CUST_INFO.CUST_BASIC_INFO && _this.historyData.CUST_INFO.CUST_BASIC_INFO[0] || {};
         let CUST_LINK_INFO = _this.historyData.CUST_INFO.CUST_LINK_INFO && _this.historyData.CUST_INFO.CUST_BASIC_INFO[0] || {};
         let ONESELF_DATA_OBJ = {
            BENEFICIARY_RELA: "0Z",
            BENEFICIARY_ID: _.get(CUST_BASIC_INFO, "ID_CODE"),
            BENEFICIARY_NAME: _.get(CUST_BASIC_INFO, "CUST_FNAME"),
            BENEFICIARY_ID_TYPE: _.get(CUST_BASIC_INFO, "ID_TYPE"),
            BENEFICIARY_EXP_DATE: _.get(CUST_BASIC_INFO, "ID_EXP_DATE"),
            BENEFICIARY_TEL: _.get(CUST_LINK_INFO, "MOBILE_TEL"),
            BENEFICIARY_ADDR: _.get(CUST_LINK_INFO, "ADDRESS"),
            EMAIL: _.get(CUST_LINK_INFO, "EMAIL"),//邮箱
            NATION: _.get(CUST_BASIC_INFO, "CITIZENSHIP"),//国家
            OCCU_TYPE: _.get(CUST_BASIC_INFO, "OCCU_TYPE"),//职业
            ZIP_CODE: _.get(CUST_LINK_INFO, "ZIP_CODE"),//邮编
            SEX: _.get(CUST_BASIC_INFO, "SEX"),//性别
            BIRTHDAY: _.get(CUST_BASIC_INFO, "BIRTHDAY")//出生日期
         }
         _this.oppBusiData.ONESELF_DATA_OBJ = ONESELF_DATA_OBJ
         if (!(_this.historyData.RELA_INFO && _this.historyData.RELA_INFO.CUST_BENEFICIARY_INFO)) {
            _this.$blMethod.parseGroupsMouduleData(_this, ['BENEFICIARY_INFO'], ONESELF_DATA_OBJ)
            addBenficiaryItem(_this)
         } 
    },

    openBizCustBenficiaryValidate(_this) {
        let formDataArr = [];
        _.each(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO, (c, v) => {
            let custBeneficiaryInfoObj = {};
            _this.$blMethod.changeObjKeys(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO[v].FIELDS, custBeneficiaryInfoObj);
            formDataArr.push(custBeneficiaryInfoObj.BENEFICIARY_ID);
        })
        if (_.uniq(formDataArr).length < _this.groupDatas.CUST_INFO.BENEFICIARY_INFO.length) {
            _this.$blMethod.showMsgBox(_this,"受益人信息的证件号码有重复记录，请删掉重复记录！",()=>{
            })
            return false;
        }
        return true;
    },

    openBizCustBenficiaryBeforeSave(_this, params) {
        let tempSaveBenficiaryArr = [];
        _.each(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO, (c, v) => {
            let tempSaveBenficiaryObject = {};
            _this.$blMethod.changeObjKeys(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO[v].FIELDS, tempSaveBenficiaryObject);
            let saveObj = {
                OPER_TYPE: "0"
            }
            tempSaveBenficiaryArr.push(_.extend({}, tempSaveBenficiaryObject, saveObj));
        })
        let BENEFICIARY_IMG_IS_MUST = _.filter(tempSaveBenficiaryArr, function (obj) {  //只要存在非本人 就需要采集身份证明文件
            return obj.BENEFICIARY_RELA !== "0Z";
          }).length ? "1" : "0";
        params.RELA_INFO.CUST_BENEFICIARY_INFO = tempSaveBenficiaryArr
        params.BENEFICIARY_IMG_IS_MUST = BENEFICIARY_IMG_IS_MUST
    },

    'CHECK_BENEFICIARY_RELA': (_this, field, fieldDatas) => {
        if (field.DEFAULT_VALUE == '0Z') {
            checkOneSelf(_this, fieldDatas);
        } else {
            let fieldControl = ["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion])!= -1? fieldControl_YINHE : fieldControl_BIAOZHUN;
            _.each(fieldDatas, field_each => {
                field_each.FIELD_ID != 'BENEFICIARY_RELA' ? field_each.DEFAULT_VALUE = '' : ''
                field_each.FIELD_CONTROL = '0'
                if (fieldControl.indexOf(field_each.FIELD_ID) > -1 && field_each.FIELD_ID != 'BENEFICIARY_RELA') {
                    field_each.FIELD_CONTROL = "1"
                }
            })

            if (["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) == -1 ){
                fieldDatas.CONTROLER_EMAIL.FIELD_REQUIRED = '1';
                fieldDatas.CONTROLER_TEL.FIELD_REQUIRED = '1';
            }
        }
        //	增加多条受益人信息时，“与本人关系”为“配偶”只能有一条
        let merry = 0;
        _.each(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO,(item)=> {
            let rela =  _.get(item.FIELDS.BENEFICIARY_RELATION,"DEFAULT_VALUE","")
            if( rela== "0Z") {
                // 读卡按钮（与本人关系为非本人时显示）
                _this.groupDatas.CUST_INFO.BENEFICIARY_INFO[0].MODULE_CUSTOMIZE = true;
                _this.groupDatas.CUST_INFO.BENEFICIARY_INFO[0].MODULE_READ = true;
            } else {
                merry++;
            }
        })
        if(merry>1){
            field.message = "与本人关系为“配偶”只能有一条";
            field.DEFAULT_VALUE = "";
            return 
        }
    },
    'CHECK_BENEFICIARY_ID_TYPE': (_this, field, fieldDatas) => {
        if (!field.notCheck) {
            if (["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) == -1) {
                fieldDatas.SEX.FIELD_CONTROL = '0'
                fieldDatas.SEX.DEFAULT_VALUE = ''
                fieldDatas.BIRTHDAY.FIELD_CONTROL = '0'
                fieldDatas.BIRTHDAY.DEFAULT_VALUE = ''
            }
        }
        field.notCheck = false
    },
    'CHECK_BENEFICIARY_ID_NO': (_this, field, fieldDatas) => {
        //	若与本人关系为非本人，实际控制人证件号码不能与本人证件号码相同；
        if (fieldDatas.BENEFICIARY_RELA.DEFAULT_VALUE != "0Z" && field.DEFAULT_VALUE == _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"][0].FIELDS["ID_CODE"].DEFAULT_VALUE) {
            field.message = "非本人时，实际控制人证件号码不能是本人证件号码！";
            return;
        }
        //增加多条受益人信息时，各个受益人的证x件号码不能有重复的
        let tem = []
        let flag = false;
        _.each(_this.groupDatas.CUST_INFO.BENEFICIARY_INFO,(item,index)=> {
            let rela =  _.get(item.FIELDS.BENEFICIARY_ID_NO,"DEFAULT_VALUE","")
            tem.push(rela)
        })
        if( tem.length != _.uniq(tem).length) {
            field.message = "各个受益人的证件号码不能有重复的";
            field.correct = false;
        } else {
            field.correct = true;
        }
    },
}