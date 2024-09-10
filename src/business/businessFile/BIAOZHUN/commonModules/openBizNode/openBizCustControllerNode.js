
import oppService from '../../../../../service/opp-service';
import date from '../../../../../tools/date.js'

const  required_BIAOZHUN = "CONTROLER_RELATION,CONTROLER_NAME,CONTROLER_ID_TYPE,CONTROLER_ID_NO,CONTROLER_ID_EXP_DATE";
const required_YINHE = "";
const fieldControl_YINHE = ["CONTROLER_ID_EXP_DATE","REG_DATE","CONTROLER_EMAIL", "OCCU_TYPE", "ZIP_CODE","REG_ADDR","CONTROLER_SEX","NATION","CONTROLER_SEX","REG_DATE"];
const fieldControl_BIAOZHUN = ["CONTROLER_EMAIL", "OCCU_TYPE", "REG_ADDR", "ZIP_CODE"];


const addControllerItem = function(_this) {
    _.each(_this.groupDatas.CUST_INFO.CONTROLER_INFO, moduleData => {
        let CONTROLER_RELATION = moduleData.FIELDS.CONTROLER_RELATION;
        if (_this.oppBusiData.UN_ONESELF_FLAG) {
            CONTROLER_RELATION.FIELD_DICT_FILTER = _.map(_.filter(CONTROLER_RELATION.FIELD_DICT_NAME, v => {
                return v.DICT_ITEM.charAt("0") == "0" && v.DICT_ITEM != "0Z"  &&  ["00","01","02","03"].indexOf(v.DICT_ITEM) !== -1;
            }), 'DICT_ITEM')
        } else {
            //银河个性化 保留本人、父母、子女、配偶、其他亲戚关系，其他的屏蔽不展示
            CONTROLER_RELATION.FIELD_DICT_FILTER = _.map(_.filter(CONTROLER_RELATION.FIELD_DICT_NAME, v => {
                return v.DICT_ITEM.charAt("0") == "0" && (["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) != -1 ? ["00","01","02","03","0Z"].indexOf(v.DICT_ITEM) !== -1 : true);
            }), 'DICT_ITEM')
        }
    })
}

const checkOneSelf = function(_this, fieldDatas) {
    let existFlag = false, existCount = 0; 
    _.each(_this.groupDatas.CUST_INFO.CUST_CONTROL_INFO, o => {
        o.FIELDS.CONTROLER_RELATION.DEFAULT_VALUE == '0Z' ? existCount++ : '';
        if (existCount == 2) {
            existFlag = true;
            return false;
        }
    })
    if (existFlag) {
        _this.$blMethod.showMsgBox(_this, "已经存在“本人”的记录，不能重复添加！")
    } else {
        // 回填本人信息
        _this.groupDatas.CUST_INFO.CONTROLER_INFO[0].MODULE_ADD = '0'
        fieldDatas.CONTROLER_ID_TYPE.notCheck = true

            
        let fieldControl = ["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion])!= -1? fieldControl_YINHE : fieldControl_BIAOZHUN;
        let requiredArr = ["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion])!= -1? required_YINHE : required_BIAOZHUN;
        _.each(fieldDatas, field => {
            if (field.FIELD_ID in _this.oppBusiData.ONESELF_DATA_OBJ) {
                field.DEFAULT_VALUE = _this.oppBusiData.ONESELF_DATA_OBJ[field.FIELD_ID]
                field.FIELD_ID != 'CONTROLER_RELATION' ? field.FIELD_CONTROL = '2' : field.FIELD_CONTROL = '0'
                if (requiredArr.indexOf(field.FIELD_ID) == -1 && !field.DEFAULT_VALUE) {
                    field.FIELD_REQUIRED = '0';
                    field.correct = true;
                    field.message = ''; 
                }
            }
            if (fieldControl.indexOf(field.FIELD_ID) > -1 && field.FIELD_ID != 'CONTROLER_RELATION' ) {
                field.FIELD_CONTROL = "1"
            }
        })
        if (_this.oppBusiData.IS_DISABLE_ONESELF && _this.oppBusiData.IS_ONESELF_FLAG) {
            fieldDatas.CONTROLER_RELATION.FIELD_CONTROL = '2'
        }
    }
}
export default {
    openBizCustControllerBeforeLoadBiz(_this) {
        let MAX_LENGTH = oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray, "MAX_CONTROLER") || "3";
        _this.groupDatas.CUST_INFO.CONTROLER_INFO[0].MAX_LENGTH = MAX_LENGTH;
        let CONTROLER_ID_TYPE = _this.groupDatas.CUST_INFO.CONTROLER_INFO[0].FIELDS.CONTROLER_ID_TYPE;

        //证件类型去掉“军官证、士兵证、户口本、台胞证、解放军文职干部、武警文职干部、社会保障号、文职证、警官证”
        CONTROLER_ID_TYPE.FIELD_DICT_FILTER = _.map(_.filter(CONTROLER_ID_TYPE.FIELD_DICT_NAME, v => {
            return v.DICT_ITEM.charAt("0") == "0" && (["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) != -1  ? ["02","03","05","07","0f","0g","0h"].indexOf(v.DICT_ITEM) == -1 : true);
        }),"DICT_ITEM");
        _this.groupDatasTpl.CUST_INFO.CONTROLER_INFO[0].FIELDS.CONTROLER_ID_TYPE = CONTROLER_ID_TYPE;
        return new Promise(reslove => {
            reslove();
        })
    },

    openBizCustControllerAfterLoadBiz(_this) {
       
    },

    openBizCustControllerPageActivated(_this) {
         // 本人为实际控制人信息
        let CUST_BASIC_INFO = _this.historyData.CUST_INFO.CUST_BASIC_INFO && _this.historyData.CUST_INFO.CUST_BASIC_INFO[0] || {};
        let CUST_LINK_INFO = _this.historyData.CUST_INFO.CUST_LINK_INFO && _this.historyData.CUST_INFO.CUST_BASIC_INFO[0] || {};
        let ONESELF_DATA_OBJ = {
            CONTROLER_NAME: _.get(CUST_BASIC_INFO, "CUST_FNAME"),
            CONTROLER_ID_TYPE: _.get(CUST_BASIC_INFO, "ID_TYPE"),
            CONTROLER_ID_NO: _.get(CUST_BASIC_INFO, "ID_CODE"),
            CONTROLER_ID_EXP_DATE: _.get(CUST_BASIC_INFO, "ID_EXP_DATE"),
            CONTROLER_RELATION: "0Z",
            CONTROLER_TEL: _.get(CUST_LINK_INFO, "MOBILE_TEL"),
            CONTROLER_EMAIL: _.get(CUST_LINK_INFO, "EMAIL"),//邮箱
            NATION: _.get(CUST_BASIC_INFO, "CITIZENSHIP"),//国家
            OCCU_TYPE: _.get(CUST_BASIC_INFO, "OCCU_TYPE"),//职业
            ZIP_CODE: _.get(CUST_LINK_INFO, "ZIP_CODE"),//邮编
            CONTROLER_SEX: _.get(CUST_BASIC_INFO, "SEX"),//性别
            REG_DATE: _.get(CUST_BASIC_INFO, "BIRTHDAY"),//出生日期
            REG_ADDR: _.get(CUST_LINK_INFO, "ADDRESS")//联系地址
         }
        _this.oppBusiData['ONESELF_DATA_OBJ'] = ONESELF_DATA_OBJ;
        _this.oppBusiData['UNDER_AGE'] = _.get(_this.groupDatas.CUST_INFO.CUST_OTHER_INFO[0].FIELDS.UNDER_AGE, 'DEFAULT_VALUE', "");
        _this.oppBusiData['AGE'] = date.getDifferYears(CUST_BASIC_INFO.BIRTHDAY, date.getClientDate())
        _this.oppBusiData['IS_DISABLE_ONESELF'] = true;
        if (["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) != -1 ) {
            //	未成年客户（16岁以下）、16到18岁遗产继承/公司股东，与本人关系只能为非本人；
            //	16到18岁有劳动收入、18以上具备完全民事行为能力的，与本人关系需自行选择，为本人的，填充本人信息，不为本人的，需合规经理及营业部负责人审批。(为非本人的续配置相应影像采集，控制人身份证明文件必采）；
            _this.oppBusiData['IS_DISABLE_ONESELF'] = false;
            _this.oppBusiData['IS_ONESELF_FLAG'] = false;
            _this.oppBusiData['UN_ONESELF_FLAG'] = false;
            if (_this.oppBusiData['AGE'] < 16 || (_this.oppBusiData.AGE >= 16 && _this.oppBusiData.AGE < 18 && _this.oppBusiData.UNDER_AGE != "2")) {
                _this.oppBusiData.IS_DISABLE_ONESELF = true;
                _this.oppBusiData.UN_ONESELF_FLAG = true;
            }
        } else {
            // 与本人关系只能为本人：16到18岁有劳动收入、18以上70岁以下，
            _this.oppBusiData.IS_ONESELF_FLAG = (_this.oppBusiData.AGE >= 16 && _this.oppBusiData.AGE < 18 && _this.oppBusiData.UNDER_AGE == "2") || (_this.oppBusiData.AGE >= 18 && _this.oppBusiData.AGE < 70);
            // 与本人关系只能为非本人：未成年客户（16岁以下）、16到18岁遗产继承/公司股东
            _this.oppBusiData.UN_ONESELF_FLAG = _this.oppBusiData.AGE < 16 || (_this.oppBusiData.AGE >= 16 && _this.oppBusiData.AGE < 18 && (_this.oppBusiData.UNDER_AGE == "0" || _this.oppBusiData.UNDER_AGE == "1"));
        }

        let tempObj = _this.historyData.RELA_INFO && _this.historyData.RELA_INFO.CUST_CONTROLER_INFO && _this.historyData.RELA_INFO.CUST_CONTROLER_INFO.length && _this.historyData.RELA_INFO.CUST_CONTROLER_INFO[0] || {}
        let recoverFlag = _this.oppBusiData['IS_ONESELF_FLAG'] === (tempObj.IS_ONESELF_FLAG == true || tempObj.IS_ONESELF_FLAG == "true") &&
        _this.oppBusiData['UN_ONESELF_FLAG'] === (tempObj.UN_ONESELF_FLAG == true || tempObj.UN_ONESELF_FLAG == "true") &&
        _this.oppBusiData['IS_DISABLE_ONESELF'] === (tempObj.IS_DISABLE_ONESELF == true || tempObj.IS_DISABLE_ONESELF == "true");
        if (recoverFlag && !_.isEmpty(tempObj)) { 
            let tempModuleData = _.cloneDeep(_this.groupDatasTpl.CUST_INFO.CONTROLER_INFO[0])
            let bData = {
                CUST_INFO: {
                    CONTROLER_INFO: _this.historyData.RELA_INFO.CUST_CONTROLER_INFO
                }
            }
            let tempGroupData = {
                CUST_INFO: {
                    CONTROLER_INFO: [tempModuleData]
                }
            }
            _this.$blMethod.parseOldBiz(_this, tempGroupData, bData)
            _this.groupDatas.CUST_INFO.CONTROLER_INFO.splice(0, _this.groupDatas.CUST_INFO.CONTROLER_INFO.length)
            _.each(tempGroupData.CUST_INFO.CONTROLER_INFO, temp => _this.groupDatas.CUST_INFO.CONTROLER_INFO.push(temp))
        } else {
            let oneSelfDataArr = !_this.oppBusiData.UN_ONESELF_FLAG ? ONESELF_DATA_OBJ : []
            if (["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) != -1 ) {
                if (_this.oppBusiData.AGE >= 16 && _this.oppBusiData.AGE < 18 && _this.oppBusiData.UNDER_AGE === "2" || _this.oppBusiData.AGE >=18) {
                    oneSelfDataArr = []
                }
            }
            let tempModuleData = _.cloneDeep(_this.groupDatasTpl.CUST_INFO.CONTROLER_INFO[0])
            let bData = {
                CUST_INFO: {
                    CONTROLER_INFO: [oneSelfDataArr]
                }
            }
            let tempGroupData = {
                CUST_INFO: {
                    CONTROLER_INFO: [tempModuleData]
                }
            }
            _this.$blMethod.parseOldBiz(_this, tempGroupData, bData)
            _this.groupDatas.CUST_INFO.CONTROLER_INFO.splice(0, _this.groupDatas.CUST_INFO.CONTROLER_INFO.length)
            _.each(tempGroupData.CUST_INFO.CONTROLER_INFO, temp => _this.groupDatas.CUST_INFO.CONTROLER_INFO.push(temp))
        }
        // 变更关系子段字典项过滤
        addControllerItem(_this)
    },

    openBizCustControllerValidate(_this) {
        return true;
    },

    openBizCustControllerBeforeSave(_this, params) {
        let tempSaveControlerArr = [];
        _.each(_this.moduleDatas.CONTROLER_INFO, (c, v) => {
            let tempSaveControlerObject = {};
            _this.$blMethod.changeObjKeys(_this.moduleDatas.CONTROLER_INFO[v].FIELDS, tempSaveControlerObject);
            let saveObj = {
                IS_DISABLE_ONESELF: _this.oppBusiData.IS_DISABLE_ONESELF,
                UN_ONESELF_FLAG: _this.oppBusiData.UN_ONESELF_FLAG,
                IS_ONESELF_FLAG: _this.oppBusiData.IS_ONESELF_FLAG,
                OPER_TYPE: "0"
            }
            tempSaveControlerArr.push(_.extend({}, tempSaveControlerObject, saveObj));
        })
        let controllerImgIsMust = _.filter(tempSaveControlerArr, function (obj) {  //只要存在非本人 就需要采集身份证明文件
            return obj.CONTROLER_RELATION !== "0Z";
          }).length ? "1" : "0";
        let resultObj = {
            FLOW_TURN_FLAG: 0,
            BLACK_INFO: [],
            NEW_IS_AGENT: "0", //是否开通代理人 用于影像采集
            NEW_AGT_ID_TYPE: "",
            AGENT_CSDC_VALID_FLAG: "",
            // 由于适当性信息拆分独立节点，需要拓展进去，避免覆盖适当性信息节点内容
            RELA_INFO: Object.assign({}, params.RELA_INFO, {
                CUST_CONTROLER_INFO: tempSaveControlerArr,
                CUST_OTHER_LINK_INFO: [],
                CUST_GUARDIAN_INFO: [],
                CUST_OTHER_INFO: {},
                ASSIGN_INFO: {}
            }),
            CONTROLLER_IMG_IS_MUST: controllerImgIsMust, //控制人身份证必采
          }
          Object.assign(params, resultObj);
    },

    'CHECK_CONTROLER_RELATION': (_this, field, fieldDatas) => {
        if (field.DEFAULT_VALUE == '0Z') {
            checkOneSelf(_this, fieldDatas);
        } else {
            let fieldControl = ["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) != -1? fieldControl_YINHE : fieldControl_BIAOZHUN;
            let requiredArr = ["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) != -1? required_YINHE : required_BIAOZHUN;
        
            _.each(fieldDatas, (field_each) => {
                field_each.FIELD_ID != 'CONTROLER_RELATION' ? field_each.DEFAULT_VALUE = '' : ''
                field_each.FIELD_CONTROL = '0'
                if (fieldControl.indexOf(field_each.FIELD_ID) > -1 && field_each.FIELD_ID != 'CONTROLER_RELATION') {
                    field_each.FIELD_CONTROL = "1"
                }
            })
            if (["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) != -1 ){
                fieldDatas.CONTROLER_EMAIL.FIELD_REQUIRED = '1';
                fieldDatas.CONTROLER_TEL.FIELD_REQUIRED = '1';
            }
        }

        let merry = 0;
        _.each(_this.groupDatas.CUST_INFO.CONTROLER_INFO,(item)=> {
            let rela =  _.get(item.FIELDS.CONTROLER_RELATION,"DEFAULT_VALUE","")
            if( rela== "0Z") {
                // 读卡按钮（与本人关系为非本人时显示）
                _this.groupDatas.CUST_INFO.CONTROLER_INFO[0].MODULE_CUSTOMIZE = true;
                _this.groupDatas.CUST_INFO.CONTROLER_INFO[0].MODULE_READ = true;
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
    'CHECK_CONTROLER_ID_TYPE': (_this, field, fieldDatas) => {
        if (!field.notCheck) {
            if (["YINHE"].indexOf(_this.$definecfg.QSJGDM_CONST[_this.$basecfg.qsVersion]) == -1) {
                fieldDatas.CONTROLER_SEX.FIELD_CONTROL = '0'
                fieldDatas.CONTROLER_SEX.DEFAULT_VALUE = ''
                fieldDatas.REG_DATE.FIELD_CONTROL = '0'
                fieldDatas.REG_DATE.DEFAULT_VALUE = ''
            }
        }
        field.notCheck && (field.notCheck = false)
    },
    'CHECK_CONTROLER_ID_NO': (_this, field, fieldDatas) => {
        //	若与本人关系为非本人，实际控制人证件号码不能与本人证件号码相同；
        if (fieldDatas.CONTROLER_RELATION.DEFAULT_VALUE != "0Z" && field.DEFAULT_VALUE == _this.groupDatas["CUST_INFO"]["CUST_BASIC_INFO"][0].FIELDS["ID_CODE"].DEFAULT_VALUE) {
            field.message = "非本人时，实际控制人证件号码不能是本人证件号码！";
            return;
        }
        let tem = []
        let flag = false;
        _.each(_this.groupDatas.CUST_INFO.CONTROLER_INFO,(item,index)=> {
            let rela =  _.get(item.FIELDS.CONTROLER_ID_NO,"DEFAULT_VALUE","")
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