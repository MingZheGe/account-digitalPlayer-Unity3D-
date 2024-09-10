/* 
*   个人和机构涉税业务函数公共方法
*   方法封装
*   @author  yangyp
*/
import stringConfig from "../../../src/tools/stringConfig"
import dict from '../../tools/dict.js'
import oppService from '../../service/opp-service.js'
import countryData from '../../components/preEntry/countryselect-data'
import stringPinyinConfig from '../../tools/stringPinyinConfig.js'

export default  {

    /**
     * @description 隐藏涉税某个分组下面的某些模块（针对涉税具有大概相同的模块名称的分组，例如 CUST_TAX_INFO_MODULE3，CUST_TAX_INFO_MODULE4）
     * @param {*} orginGroup 要操作的分组
     * @param {*} moduleName 要操作的模块名称
     * @param {*} beginIndex 
     * @param {*} endIndex 
     * @author liwei2
     */
    hideSomeModulesByIndex(orginGroup, moduleName, beginIndex, endIndex){
        let newGroup = {};
        for(let i = beginIndex; i<= endIndex; i++ ){
            newGroup[moduleName+i] = orginGroup[moduleName+i]
        }
        for(let key in newGroup){
            _.forEach(newGroup[key], function(obj){
                obj.MODULE_CONTROL = '0';
            })
        }
        
    },
    //基本信息校验
    isSyncYMTFlag :function(_this,oldBaseForm,newBaseForm) {
        //职业，联系地址，邮编，学历 需要同步中登
        if(_this.userType == "0"){
            return (oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE
                || oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE
                || oldBaseForm.ID_ADDR != newBaseForm.ID_ADDR.DEFAULT_VALUE
                || oldBaseForm.MAIL_ZIP_CODE != newBaseForm.MAIL_ZIP_CODE.DEFAULT_VALUE
                || oldBaseForm.OCCU_TYPE != newBaseForm.OCCU_TYPE.DEFAULT_VALUE
                || oldBaseForm.TRADE != newBaseForm.CIF_TRADE.DEFAULT_VALUE
                || oldBaseForm.EDUCATION != newBaseForm.EDUCATION.DEFAULT_VALUE)?"1":"0";
        }else {
            return (oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE
                || oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE
                || oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE)?"1":"0";
        }
    } ,
  
    //判断银行证件是否与证件信息一致
    check_Bank_Module_Radio_flag : function(_this){
        if(_this.userType == "0"){
            return _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.IDTYPE.DEFAULT_VALUE == _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE
                && _this.groupDatas.CUST_INFO_PAGE2.CUST_BANK_INFO[0].FIELDS.FULLNAME.DEFAULT_VALUE == _this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE || "";
        }else{
            return _this.groupDatas.CUST_BASIC_INFO.CUST_BANK_INFO[0].FIELDS.IDTYPE.DEFAULT_VALUE == _this.groupDatas.CUST_BASIC_INFO.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_TYPE.DEFAULT_VALUE
                && _this.groupDatas.CUST_BASIC_INFO.CUST_BANK_INFO[0].FIELDS.IDNO.DEFAULT_VALUE == _this.groupDatas.CUST_BASIC_INFO.CUST_BASIC_INFO_STEP1[0].FIELDS.ID_CODE.DEFAULT_VALUE
                && _this.groupDatas.CUST_BASIC_INFO.CUST_BANK_INFO[0].FIELDS.FULLNAME.DEFAULT_VALUE == _this.groupDatas.CUST_BASIC_INFO.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE || "";
        }
    },

    //基本信息校验
    isSyncBankFlag :function (_this,bankAcctInfoForm,newBaseForm){
        //客户全称或者身份证号码有一个不一致就要同步银行
        let tempBool = "0";
        _.forEach(bankAcctInfoForm,function(item){
            if(item.FULLNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE
                || item.IDNO != newBaseForm.ID_CODE.DEFAULT_VALUE
                || item.IDTYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE){
                // let asynchronyBankStr= oppService.getBusiCommonParamsByCode(_this.oppBusiData.busiCommonParamsArray,'ASYNCHRONY_BANK');
                // let asynchronyBankArr = asynchronyBankStr.split(",");
                // if(_this.oppBusiData.bankSignInfo && _this.oppBusiData.bankSignInfo.length){
                //     _this.oppBusiData.bankSignInfo.forEach(element => {
                //         if(_.indexOf(asynchronyBankArr,element.EXT_ORG) == -1 && element.CONTRACT_STATUS == "0"){
                //             //如果不在这个列表，就需要进行同步银行
                //             tempBool = "1";
                //             return false;
                //         }
                //     });
                // }
                tempBool = "1";
                return false;
            }
        });
        
        return tempBool;
    },
    //判断三要素信息是否有修改
    checkImportantInfoChange : function(oldBaseForm,newBaseForm) {        
        return oldBaseForm.USER_FNAME != newBaseForm.USER_FNAME.DEFAULT_VALUE
            || oldBaseForm.ID_TYPE != newBaseForm.ID_TYPE.DEFAULT_VALUE
            || oldBaseForm.ID_CODE != newBaseForm.ID_CODE.DEFAULT_VALUE;
    },

    check_Module_Radio_flag : function(_this,fieldData){
        let tempTaxLinkFields = fieldData;
        let nameObj = stringConfig.getFirstName(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE);//过滤姓
        return  (tempTaxLinkFields.BIRTHDAY.DEFAULT_VALUE != "" && tempTaxLinkFields.BIRTHDAY.DEFAULT_VALUE != undefined
            && tempTaxLinkFields.LAST_NAME.DEFAULT_VALUE != "" && tempTaxLinkFields.LAST_NAME.DEFAULT_VALUE != undefined
            && tempTaxLinkFields.FIRST_NAME.DEFAULT_VALUE != "" && tempTaxLinkFields.FIRST_NAME.DEFAULT_VALUE != undefined
            && tempTaxLinkFields.FIRST_NAME_EN.DEFAULT_VALUE != "" && tempTaxLinkFields.FIRST_NAME_EN.DEFAULT_VALUE != undefined
            && tempTaxLinkFields.LAST_NAME_EN.DEFAULT_VALUE != "" && tempTaxLinkFields.LAST_NAME_EN.DEFAULT_VALUE != undefined)
            && (_this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0].FIELDS.BIRTHDAY.DEFAULT_VALUE == tempTaxLinkFields.BIRTHDAY.DEFAULT_VALUE
            || (nameObj&&_.isObject(nameObj)&&(nameObj[0] == tempTaxLinkFields.LAST_NAME.DEFAULT_VALUE))
            || (nameObj&&_.isObject(nameObj)&&(nameObj[1] == tempTaxLinkFields.FIRST_NAME.DEFAULT_VALUE))
            || stringPinyinConfig.ConvertPinyin(nameObj[0]) == tempTaxLinkFields.FIRST_NAME_EN.DEFAULT_VALUE
            || stringPinyinConfig.ConvertPinyin(nameObj[1])  == tempTaxLinkFields.LAST_NAME_EN.DEFAULT_VALUE);
    },

    check_Module_Radio_flag2 : function(_this,fieldData){
        let nameObj = stringConfig.getFirstName(_this.groupDatas.CUST_INFO_PAGE1.CUST_BASIC_INFO_STEP1[0].FIELDS.USER_FNAME.DEFAULT_VALUE);//过滤姓
        return  (  fieldData.NAME_ENG.DEFAULT_VALUE != "" && fieldData.NAME_ENG.DEFAULT_VALUE != undefined
                && fieldData.SURNAME_ENG.DEFAULT_VALUE != "" && fieldData.SURNAME_ENG.DEFAULT_VALUE != undefined
                && stringPinyinConfig.ConvertPinyin(nameObj[0]) == fieldData.NAME_ENG.DEFAULT_VALUE
                && stringPinyinConfig.ConvertPinyin(nameObj[1])  == fieldData.SURNAME_ENG.DEFAULT_VALUE
                && fieldData.ADDRESS === _this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0].FIELDS.MAIL_ADDR.DEFAULT_VALUE);
    },

    check_Module_Radio_flag3 : function(_this,fieldData){
        let nameObj = {};
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        nameObj = stringConfig.getFirstName(custInfo.CUST_FNAME);//过滤
        return  (  fieldData.NAME_ENG.DEFAULT_VALUE != "" && fieldData.NAME_ENG.DEFAULT_VALUE != undefined
                && fieldData.SURNAME_ENG.DEFAULT_VALUE != "" && fieldData.SURNAME_ENG.DEFAULT_VALUE != undefined
                && stringPinyinConfig.ConvertPinyin(nameObj[0]) == fieldData.NAME_ENG.DEFAULT_VALUE
                && stringPinyinConfig.ConvertPinyin(nameObj[1])  == fieldData.SURNAME_ENG.DEFAULT_VALUE);
    },
    //获取涉税国信息，通过涉税数组封装字符串TAX_ID_CONTENT的方法
    getTaxIDContent : function(fieldData){
        let taxIDContent = "",newArr = [];
        _.each(fieldData, function(curFieldItem){
            if(!(stringConfig.isEmptyStr(curFieldItem.FIELDS["TAX_ID"].DEFAULT_VALUE) && stringConfig.isEmptyStr(curFieldItem.FIELDS["TAX_CITIZENSHIP"].DEFAULT_VALUE))){
                let saveItemObj ={"TAX_ID":stringConfig.isNotEmptyStr(curFieldItem.FIELDS["TAX_ID"].DEFAULT_VALUE)&& curFieldItem.FIELDS["TAX_ID"].DEFAULT_VALUE||"","TAX_CITIZENSHIP":stringConfig.isNotEmptyStr(curFieldItem.FIELDS["TAX_CITIZENSHIP"].DEFAULT_VALUE)&& curFieldItem.FIELDS["TAX_CITIZENSHIP"].DEFAULT_VALUE ||"","OPER_TYPE":"3"};
                newArr.push(saveItemObj);
            }
        });
        // TAX_ID_CONTENT: "1:AGO 123456"
        for(let i = 0 ;i < newArr.length ; i ++){
        let tempItem = newArr[i];
        taxIDContent = taxIDContent + (i+1) + ":" + tempItem.TAX_CITIZENSHIP + " " + tempItem.TAX_ID;
            if(i < newArr.length -1 ){
                taxIDContent = taxIDContent + ",";
            }
        }
        return taxIDContent;
    },

    getTaxContentDiffInfo : function(newInfo,oldInfo){
        let diffInfo = [];
        console.log('JSON.stringify(oldInfo) ===', JSON.stringify(oldInfo) );
        if(JSON.stringify(oldInfo) != "{}"){
          _.forEach(oldInfo, function(oldValue,oldKey) {
            _.forEach(newInfo, function(newValue,newKey) {
              if(newKey == oldKey){
                if(newValue != oldValue){
                  let saveDifObj = {"FIELD":oldKey,"OLD":oldValue,"NEW":newValue };
                  diffInfo.push(saveDifObj);
                  return false;
                }
              }
            });
          });
        }else{
          _.forEach(newInfo, function(newValue,newKey) {
            if(newValue && newValue != ""){
              let saveDifObj = {"FIELD":newKey,"OLD":"","NEW":newValue };
              diffInfo.push(saveDifObj);
            }
          });
        }
        return diffInfo;
    },

    getHolderInfoDiff : function(newInfo,oldInfo){
        let diffInfo = [];
        _.forEach(oldInfo, function(oldValue,oldKey) {
            _.forEach(newInfo, function(newValue,newKey) {
                if(newKey == oldKey){
                    if(newValue != oldValue){
                        let saveDifObj = {"FIELD":oldKey,"OLD":oldValue,"NEW":newValue };
                        diffInfo.push(saveDifObj);
                        return false;
                    }
                }
            });
        });
        return diffInfo;
    },
      
    getCustBasicDiffInfo : function(newInfo,oldInfo){
        let diffInfo = [];
        _.forEach(oldInfo, function(oldValue,oldKey) {
            _.forEach(newInfo, function(newValue,newKey) {
                if(newKey == oldKey){
                    if(newValue != oldValue){
                        let saveDifObj = {"FIELD":oldKey,"OLD":oldValue,"NEW":newValue };
                        diffInfo.push(saveDifObj);
                        return false;
                    }
                }
            });
        });
        return diffInfo;
    },
        
    getCountryArrDiff : function(fieldData,oldArr){
        let saveArr = [];
        if(oldArr.length == 0){
            //一个都没有，就是新增
            _.each(fieldData, function(curFieldItem){
            if(stringConfig.isNotEmptyStr(curFieldItem.FIELDS["TAX_ID"].DEFAULT_VALUE)&& stringConfig.isNotEmptyStr(curFieldItem.FIELDS["TAX_CITIZENSHIP"].DEFAULT_VALUE)){
                let saveItemObj ={"TAX_ID":curFieldItem.FIELDS["TAX_ID"].DEFAULT_VALUE,"TAX_CITIZENSHIP":curFieldItem.FIELDS["TAX_CITIZENSHIP"].DEFAULT_VALUE,"OPER_TYPE":"1","DIFF_INFO":[{"FIELD":"TAX_CITIZENSHIP","OLD":"","NEW":curFieldItem.FIELDS["TAX_CITIZENSHIP"].DEFAULT_VALUE},{"FIELD":"TAX_ID","OLD":"","NEW":curFieldItem.FIELDS["TAX_ID"].DEFAULT_VALUE}]};
                saveArr.push(saveItemObj);
            }
            });
        }else{
            //有值，如果是判断完全相同，就是不变=== 3  如果是判断数据在原有里面完全没有 ==== 2   其他类型均为1
            //把现有的数据 先同步写进来，然后在写对比数据
            let newArr=[];
            _.each(fieldData, function(curFieldItem){
                let saveItemObj ={"TAX_ID":curFieldItem.FIELDS["TAX_ID"].DEFAULT_VALUE,"TAX_CITIZENSHIP":curFieldItem.FIELDS["TAX_CITIZENSHIP"].DEFAULT_VALUE,"OPER_TYPE":"3","DIFF_INFO":[]};
                newArr.push(saveItemObj);
            });
        
        
            //先获取新增的模型数组
            let addModArr = _.differenceWith(newArr,oldArr,function(a,b){
                return (a.TAX_ID === b.TAX_ID) &&(a.TAX_CITIZENSHIP === b.TAX_CITIZENSHIP);
            });
            //再获取删除的模型数组
            let delModArr = _.differenceWith(oldArr,newArr,function(a,b){
                return (a.TAX_ID === b.TAX_ID) && (a.TAX_CITIZENSHIP === b.TAX_CITIZENSHIP);
            });
        
            //求交集，NUM相等的而且字段不同的就是发生了模块变更
            let modModArr = [];
            _.intersectionWith(oldArr,newArr,function(a,b){
                // //先遍历每个字段看是否有错误
                if(a.TAX_ID === b.TAX_ID){
                    if((b.TAX_CITIZENSHIP != a.TAX_CITIZENSHIP && typeof b.TAX_CITIZENSHIP != "object" ) 
                        || !(_.isEqual(b.TAX_CITIZENSHIP ,a.TAX_CITIZENSHIP))) { // 有修改
                        modModArr.push({"TAX_ID":b.TAX_ID,"TAX_CITIZENSHIP":b.TAX_CITIZENSHIP,"OPER_TYPE":"1","DIFF_INFO":[{"FIELD":"TAX_CITIZENSHIP","old" : a.TAX_CITIZENSHIP, "new":b.TAX_CITIZENSHIP}]});
                    }
                }
            })
        
            if(addModArr.length){
                console.log("新增的数组===",addModArr);
                _.each(addModArr, function(addItem){
                    let upDataBool = false;
                    _.each(saveArr, function(saveItem){
                        //去重复
                        if(addItem.TAX_ID == saveItem.TAX_ID && addItem.TAX_CITIZENSHIP == saveItem.TAX_CITIZENSHIP){
                            upDataBool = true;
                            return false;
                        }
                    })
                    if(!upDataBool){
                        let defObj = {"TAX_ID":addItem.TAX_ID,"TAX_CITIZENSHIP":addItem.TAX_CITIZENSHIP,"OPER_TYPE":"1","DIFF_INFO":[{"FIELD":"TAX_ID","OLD":"","NEW":addItem.TAX_ID },{"FIELD":"TAX_CITIZENSHIP","OLD":"","NEW":addItem.TAX_CITIZENSHIP }]};
                        saveArr.push(defObj);
                    }
                })
            }
            console.log("删除的数组===",saveArr);
            if(delModArr.length){
                _.each(delModArr, function(addItem){
                    let upDataBool = false;
                    _.each(saveArr, function(saveItem){
                        //去重复
                        if(addItem.TAX_ID == saveItem.TAX_ID && addItem.TAX_CITIZENSHIP == saveItem.TAX_CITIZENSHIP){
                            upDataBool = true;
                            return false;
                        }
                    })
                    if(!upDataBool){
                        let defObj = {"TAX_ID":addItem.TAX_ID,"TAX_CITIZENSHIP":addItem.TAX_CITIZENSHIP,"OPER_TYPE":"2","DIFF_INFO":[]};
                        saveArr.push(defObj);
                    }
                })
            }
            console.log("删除的数组===",saveArr);
            if(modModArr.length){
                _.each(modModArr, function(addItem){
                    let upDataBool = false;
                    _.each(saveArr, function(saveItem){
                        //去重复
                        if(addItem.TAX_ID == saveItem.TAX_ID && addItem.TAX_CITIZENSHIP == saveItem.TAX_CITIZENSHIP){
                            upDataBool = true;
                            return false;
                        }
                    })
                    if(!upDataBool){
                        saveArr.push(addItem);
                    }
                })
            }
        
            //最后合并没有修改的数据
            _.each(newArr, function(newItem){
                let upDataBool = false;
                _.each(saveArr, function(saveItem){
                    //去重复
                    if(newItem.TAX_ID == saveItem.TAX_ID && newItem.TAX_CITIZENSHIP == saveItem.TAX_CITIZENSHIP){
                        upDataBool = true;
                        return false;
                    }
                })
                if(!upDataBool){
                    saveArr.push(newItem);
                }
            })
        }
        return saveArr;
    },

    getCustTaxData : function(_this,oldBaseInfo){
        let that = this;
        var CUST_NUM_INFO = [];
        if(_this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP6[0].FIELDS.TAX_ID_FLAG.DEFAULT_VALUE == "1"){
            CUST_NUM_INFO = that.getCountryArrDiff(_this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP7,_this.oppBusiData.custNumInfo);
        }
        let CUST_TAX_INFO = that.getCustTaxArrDiff(_this);
        let CUST_BASIC_INFO =  that.getCustBasicArrDiff(_this,oldBaseInfo);
        let rebackResponse = {  "CUST_TAX_INFO": CUST_TAX_INFO || {},
                                "CUST_NUM_INFO": CUST_NUM_INFO || [],
                                "CUST_BASIC_INFO":CUST_BASIC_INFO || {},
                                "IS_TAX_FLAG": _this.groupDatas.RELA_INFO_PAGE1.CUST_TAX_INFO_STEP1[0].FIELDS.TAX_RESIDENT_TYPE.DEFAULT_VALUE};
        //判断当前是新增还是修改 OPER_TYPE 1-新增 1-修改 2-删除 3-不变
        return rebackResponse;
    },
    getCustTaxArrDiff : function(_this) {
        let addressTextInfo = _this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP5[0].FIELDS.ADDRESS_TEXT.addressInfo;
        let birthAddressTextInfo = _this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP5[0].FIELDS.BIRTH_ADDRESS_TEXT.addressInfo;
        let tempCustTaxInfo = {};
        for(let gk in _this.groupDatas) {
            if(gk == "RELA_INFO_PAGE1" || gk == "RELA_INFO_PAGE2" || gk == "RELA_INFO_PAGE3"){
                for (let md in _this.groupDatas[gk]){
                    for(let fk in _this.groupDatas[gk][md][0]["FIELDS"]){
                        if(fk == "MODULE_RADIO_BUTTON" || fk == "TAX_CITIZENSHIP" || fk == "TAX_ID"){
                            //不做处理
                        }else if(fk == "TAX_RESIDENT_TYPE"){
                            let saveValue = _this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"];
                            tempCustTaxInfo["TAX_FLAG"] = stringConfig.isNotEmptyStr(saveValue)?saveValue:"";
                        }else{
                            let saveID = _this.groupDatas[gk][md][0]["FIELDS"][fk]["FIELD_ID"] ;
                            let saveValue = _this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"];
                            if(saveID == "BIRTHDAY"){
                                tempCustTaxInfo["BIRTH_DAY"] = stringConfig.isNotEmptyStr(saveValue)?saveValue:"";
                            }else{
                                tempCustTaxInfo[saveID] = stringConfig.isNotEmptyStr(saveValue)?saveValue:"";
                            }
                            
                        }
                    }
                }
            }
        }
        // "["澳大利亚",["天津市","辖县","蓟县"],"三大发生的发生地方","301906"]"
        if(addressTextInfo && addressTextInfo[0]){
            _.forEach(countryData,function(item){
                if(item.cnName == addressTextInfo[0]){
                    tempCustTaxInfo.COUNTRY = item.code;
                    return false;
                }
            });
        }

        tempCustTaxInfo.PROVINCE = addressTextInfo && addressTextInfo[1][0] || "";
        tempCustTaxInfo.CITY = addressTextInfo && addressTextInfo[1][1] || ""; 
        tempCustTaxInfo.STREET1 = addressTextInfo && addressTextInfo[1][2] || "";
        tempCustTaxInfo.STREET2 = addressTextInfo && addressTextInfo[2] || "";

        if(birthAddressTextInfo && birthAddressTextInfo[0]){
            _.forEach(countryData,function(item){
                if(item.cnName == birthAddressTextInfo[0]){
                    tempCustTaxInfo.BRH_COUNTRY = item.code;
                    return false;
                }
            });
        }
        tempCustTaxInfo.BRH_PROVINCE = birthAddressTextInfo && birthAddressTextInfo[1][0] || "";
        tempCustTaxInfo.BRH_CITY = birthAddressTextInfo && birthAddressTextInfo[1][1] || "";
        tempCustTaxInfo.BRH_STREET1 = birthAddressTextInfo && birthAddressTextInfo[1][2] || "";
        tempCustTaxInfo.BRH_STREET2 = birthAddressTextInfo && birthAddressTextInfo[2] || ""; 
        // tempCustTaxInfo.TAX_ID_RESON = "";//TODO 其他原因这部分逻辑没加
        tempCustTaxInfo.ADDRESS = "";
        tempCustTaxInfo.BIRTH_ADDRESS = "";
        //zky TAX->TAX_RESIDENT_TYPE
        tempCustTaxInfo.TAX_FLAG = _this.groupDatas.RELA_INFO_PAGE1.CUST_TAX_INFO_STEP1[0].FIELDS.TAX_RESIDENT_TYPE.DEFAULT_VALUE;
        tempCustTaxInfo.TAX_ID_CONTENT = this.getTaxIDContent(_this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP7);
        tempCustTaxInfo.ADDRESS_TEXT = _this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP5[0].FIELDS.ADDRESS_TEXT.DEFAULT_VALUE||"";
        tempCustTaxInfo.BIRTH_ADDRESS_TEXT = _this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP5[0].FIELDS.BIRTH_ADDRESS_TEXT.DEFAULT_VALUE||"";
        tempCustTaxInfo.TAX_SIGN_TYPE = "1";
     
        if(stringConfig.isEmptyStr(_this.oppBusiData.custTaxInfo.TAX_FLAG)){
            tempCustTaxInfo.DECLARE_FILE_FLAG = "0";
        }else{
            tempCustTaxInfo.DECLARE_FILE_FLAG =_this.oppBusiData.custTaxInfo.DECLARE_FILE_FLAG;
        }
        if(parseInt(_this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP6[0].FIELDS.TAX_ID_FLAG.DEFAULT_VALUE) != 1){
            tempCustTaxInfo.TAX_ID_CONTENT = "";
        }
        let tempDiffInfo =  this.getTaxContentDiffInfo(tempCustTaxInfo,(_this.oppBusiData.custTaxInfo || {}));
        tempCustTaxInfo.DIFF_INFO = tempDiffInfo;
        if(_this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP5[0].FIELDS.ADDRESS_TEXT.FIELD_CONTROL == "0"){
            tempCustTaxInfo.ADDRESS_EN_TEXT = _this.groupDatas.RELA_INFO_PAGE2.CUST_TAX_INFO_STEP3[0].FIELDS.COUNTRY_EN.DEFAULT_VALUE 
                                            + '     ' + _this.groupDatas.RELA_INFO_PAGE2.CUST_TAX_INFO_STEP3[0].FIELDS.PROVINCE_EN.DEFAULT_VALUE
                                            + '     ' + _this.groupDatas.RELA_INFO_PAGE2.CUST_TAX_INFO_STEP3[0].FIELDS.CITY_EN.DEFAULT_VALUE
                                            + '     ' + _this.groupDatas.RELA_INFO_PAGE2.CUST_TAX_INFO_STEP3[0].FIELDS.STREET1_EN.DEFAULT_VALUE
                                            + '     ' + _this.groupDatas.RELA_INFO_PAGE2.CUST_TAX_INFO_STEP3[0].FIELDS.STREET2_EN.DEFAULT_VALUE
        }

        if(_this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP5[0].FIELDS.BIRTH_ADDRESS_TEXT.FIELD_CONTROL == "0"){
            tempCustTaxInfo.BIRTH_ADDRESS_EN_TEXT = _this.groupDatas.RELA_INFO_PAGE2.CUST_TAX_INFO_STEP4[0].FIELDS.BRH_COUNTRY_EN.DEFAULT_VALUE 
                                            + '     ' +  _this.groupDatas.RELA_INFO_PAGE2.CUST_TAX_INFO_STEP4[0].FIELDS.BRH_PROVINCE_EN.DEFAULT_VALUE
                                            + '     ' +  _this.groupDatas.RELA_INFO_PAGE2.CUST_TAX_INFO_STEP4[0].FIELDS.BRH_CITY_EN.DEFAULT_VALUE
                                            + '     ' +  _this.groupDatas.RELA_INFO_PAGE2.CUST_TAX_INFO_STEP4[0].FIELDS.BRH_STREET1_EN.DEFAULT_VALUE
                                            + '     ' +  _this.groupDatas.RELA_INFO_PAGE2.CUST_TAX_INFO_STEP4[0].FIELDS.BRH_STREET2_EN.DEFAULT_VALUE
        }
    
        tempCustTaxInfo.NO_TAXPAYERID_TYPE = parseInt(_this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP6[0].FIELDS.TAX_ID_FLAG.DEFAULT_VALUE) -1;
        if(tempCustTaxInfo.NO_TAXPAYERID_TYPE == 2){
            tempCustTaxInfo.NO_TAXPAYERID_REASON = _this.groupDatas.RELA_INFO_PAGE3.CUST_TAX_INFO_STEP6[0].FIELDS.TAX_ID_RESON.DEFAULT_VALUE;
        }
        
        return tempCustTaxInfo;
    },
    /*
     *@Description: 添加通用解析涉税模块
     *@Author: yangyp  getParseCommonTaxInfoData
     *@Date: 2019-07-12 10:33:24
    */
   getParseCommonTaxInfoData:function(_this,groupData){
        let addressTextInfo = groupData.CUST_TAX_INFO_MOUDLE5[0].FIELDS.ADDRESS.addressInfo;
        let birthAddressTextInfo = groupData.CUST_TAX_INFO_MOUDLE5[0].FIELDS.BRH_ADDRESS.addressInfo;
        let tempCustTaxInfo = {};
        for (let md in groupData){
            for(let fk in groupData[md][0]["FIELDS"]){
                if(fk == "MODULE_RADIO_BUTTON" || fk == "TAX_CITIZENSHIP" || fk == "TAX_ID"){
                    //不做处理
                }else if(fk == "TAX_RESIDENT_TYPE"){
                    let saveValue = groupData[md][0]["FIELDS"][fk]["DEFAULT_VALUE"];
                    tempCustTaxInfo["TAX_FLAG"] = stringConfig.isNotEmptyStr(saveValue)?saveValue:"";
                }else{
                    let saveID = groupData[md][0]["FIELDS"][fk]["FIELD_ID"] ;
                    let saveValue = groupData[md][0]["FIELDS"][fk]["DEFAULT_VALUE"];
                    if(saveID == "BIRTHDAY"){
                        tempCustTaxInfo["BIRTH_DAY"] = stringConfig.isNotEmptyStr(saveValue)?saveValue:"";
                    }else{
                        tempCustTaxInfo[saveID] = stringConfig.isNotEmptyStr(saveValue)?saveValue:"";
                    }
                    
                }
            }
        }
        // "["澳大利亚",["天津市","辖县","蓟县"],"三大发生的发生地方","301906"]"
        if(addressTextInfo && addressTextInfo[0]){
            _.forEach(countryData,function(item){
                if(item.cnName == addressTextInfo[0]){
                    tempCustTaxInfo.COUNTRY = item.code;
                    return false;
                }
            });
        }

        tempCustTaxInfo.PROVINCE = addressTextInfo && addressTextInfo[1][0] || "";
        tempCustTaxInfo.CITY = addressTextInfo && addressTextInfo[1][1] || ""; 
        tempCustTaxInfo.STREET1 = addressTextInfo && addressTextInfo[1][2] || "";
        tempCustTaxInfo.STREET2 = addressTextInfo && addressTextInfo[2] || "";

        if(birthAddressTextInfo && birthAddressTextInfo[0]){
            _.forEach(countryData,function(item){
                if(item.cnName == birthAddressTextInfo[0]){
                    tempCustTaxInfo.BRH_COUNTRY = item.code;
                    return false;
                }
            });
        }
        tempCustTaxInfo.BRH_PROVINCE = birthAddressTextInfo && birthAddressTextInfo[1][0] || "";
        tempCustTaxInfo.BRH_CITY = birthAddressTextInfo && birthAddressTextInfo[1][1] || "";
        tempCustTaxInfo.BRH_STREET1 = birthAddressTextInfo && birthAddressTextInfo[1][2] || "";
        tempCustTaxInfo.BRH_STREET2 = birthAddressTextInfo && birthAddressTextInfo[2] || ""; 
        // tempCustTaxInfo.TAX_ID_RESON = "";//TODO 其他原因这部分逻辑没加
        tempCustTaxInfo.ADDRESS = "";
        tempCustTaxInfo.BRH_ADDRESS = "";
        tempCustTaxInfo.TAX_FLAG = groupData.CUST_TAX_INFO_MOUDLE1[0].FIELDS.TAX_RESIDENT_TYPE.DEFAULT_VALUE;
        tempCustTaxInfo.TAX_ID_CONTENT = this.getTaxIDContent(groupData.CUST_TAX_INFO_MOUDLE7);
        // tempCustTaxInfo.ADDRESS_TEXT = groupData.CUST_TAX_INFO_MOUDLE5[0].FIELDS.ADDRESS_TEXT.DEFAULT_VALUE||"";
        // tempCustTaxInfo.BIRTH_ADDRESS_TEXT = groupData.CUST_TAX_INFO_MOUDLE5[0].FIELDS.BIRTH_ADDRESS_TEXT.DEFAULT_VALUE||"";
        tempCustTaxInfo.ADDRESS = groupData.CUST_TAX_INFO_MOUDLE5[0].FIELDS.ADDRESS.DEFAULT_VALUE||"";
        tempCustTaxInfo.BRH_ADDRESS = groupData.CUST_TAX_INFO_MOUDLE5[0].FIELDS.BRH_ADDRESS.DEFAULT_VALUE||"";
        tempCustTaxInfo.TAX_SIGN_TYPE = "1";
    
        if(stringConfig.isEmptyStr(_this.oppBusiData.custTaxInfo.TAX_FLAG)){
            tempCustTaxInfo.DECLARE_FILE_FLAG = "0";
        }else{
            tempCustTaxInfo.DECLARE_FILE_FLAG =_this.oppBusiData.custTaxInfo.DECLARE_FILE_FLAG;
        }
        if(parseInt(groupData.CUST_TAX_INFO_MOUDLE6[0].FIELDS.TAX_ID_FLAG.DEFAULT_VALUE) != 1){
            tempCustTaxInfo.TAX_ID_CONTENT = "";
        }
        let tempDiffInfo =  this.getTaxContentDiffInfo(tempCustTaxInfo,(_this.oppBusiData.custTaxInfo || {}));
        tempCustTaxInfo.DIFF_INFO = tempDiffInfo;
        if(groupData.CUST_TAX_INFO_MOUDLE5[0].FIELDS.ADDRESS.FIELD_CONTROL == "0"){
            tempCustTaxInfo.ADDRESS_EN_TEXT = groupData.CUST_TAX_INFO_MOUDLE3[0].FIELDS.COUNTRY_EN.DEFAULT_VALUE 
                                            + '     ' + groupData.CUST_TAX_INFO_MOUDLE3[0].FIELDS.PROVINCE_EN.DEFAULT_VALUE
                                            + '     ' + groupData.CUST_TAX_INFO_MOUDLE3[0].FIELDS.CITY_EN.DEFAULT_VALUE
                                            + '     ' + groupData.CUST_TAX_INFO_MOUDLE3[0].FIELDS.STREET1_EN.DEFAULT_VALUE
                                            + '     ' + groupData.CUST_TAX_INFO_MOUDLE3[0].FIELDS.STREET2_EN.DEFAULT_VALUE
        }

        if(groupData.CUST_TAX_INFO_MOUDLE5[0].FIELDS.BRH_ADDRESS.FIELD_CONTROL == "0"){
            tempCustTaxInfo.BIRTH_ADDRESS_EN_TEXT = groupData.CUST_TAX_INFO_MOUDLE4[0].FIELDS.BRH_COUNTRY_EN.DEFAULT_VALUE 
                                            + '     ' +  groupData.CUST_TAX_INFO_MOUDLE4[0].FIELDS.BRH_PROVINCE_EN.DEFAULT_VALUE
                                            + '     ' +  groupData.CUST_TAX_INFO_MOUDLE4[0].FIELDS.BRH_CITY_EN.DEFAULT_VALUE
                                            + '     ' +  groupData.CUST_TAX_INFO_MOUDLE4[0].FIELDS.BRH_STREET1_EN.DEFAULT_VALUE
                                            + '     ' +  groupData.CUST_TAX_INFO_MOUDLE4[0].FIELDS.BRH_STREET2_EN.DEFAULT_VALUE
        }

        tempCustTaxInfo.NO_TAXPAYERID_TYPE = parseInt(groupData.CUST_TAX_INFO_MOUDLE6[0].FIELDS.TAX_ID_FLAG.DEFAULT_VALUE) -1;
        if(tempCustTaxInfo.NO_TAXPAYERID_TYPE == 2){
            tempCustTaxInfo.NO_TAXPAYERID_REASON = groupData.CUST_TAX_INFO_MOUDLE6[0].FIELDS.TAX_ID_RESON.DEFAULT_VALUE;
        }
        
        return tempCustTaxInfo;
   },

    getCustBasicArrDiff : function(_this,oldBaseInfo){
        let tempCustBasicInfo = {};
        for(let gk in _this.groupDatas) {
            if(gk == "CUST_BASIC_INFO" || gk == "CUST_INFO_PAGE1" || gk == "CUST_INFO_PAGE2"){
                for (let md in _this.groupDatas[gk]){
                    for(let fk in _this.groupDatas[gk][md][0]["FIELDS"]){
                        let saveID = _this.groupDatas[gk][md][0]["FIELDS"][fk]["FIELD_ID"] ;
                        let saveValue = _this.groupDatas[gk][md][0]["FIELDS"][fk]["DEFAULT_VALUE"];
                        tempCustBasicInfo[saveID] = saveValue;
                    }
                }
            }
        }
        tempCustBasicInfo.IDCARD_TYPE = _this.oppBusiData.IDCARD_TYPE;
        tempCustBasicInfo.SUBJECT_IDENTITY = oldBaseInfo.SUBJECT_IDENTITY;
        if(_this.userType == "0"){
            tempCustBasicInfo.TRADE = (_this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0].FIELDS.CIF_TRADE&&_this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0].FIELDS.CIF_TRADE.DEFAULT_VALUE)?_this.groupDatas.CUST_INFO_PAGE2.CUST_BASIC_INFO_STEP3[0].FIELDS.CIF_TRADE.DEFAULT_VALUE:"";
        }
        tempCustBasicInfo.DIFF_INFO = this.getCustBasicDiffInfo(tempCustBasicInfo,oldBaseInfo);
        return tempCustBasicInfo;
    },
    getOldBankAcct:function(_this){
        // _this.oppBusiData.bankAcctInfo
        let oldBankInfo = _this.oppBusiData.bankAcctInfo;
        _.forEach(oldBankInfo, function(oldItem) {
            _.forEach(_this.oppBusiData.bankData, function(sysItem) {
                if(oldItem.BANKCODE == sysItem.EXT_ORG){
                    oldItem.ORG_NAME = sysItem.ORG_NAME;
                    return false;
                }
            })
        })

        return oldBankInfo;
       
    },
    // getBankBasicArrDiff :function(_this,oldBankInfo){
    //     let tempBankBasicInfo = oldBankInfo;
    //     tempBankBasicInfo.DIFF_INFO = this.getBankBasicDiffInfo(_this,oldBankInfo);
    //     return tempCustBasicInfo;
    // },

    // getBankBasicDiffInfo:function(_this,oldBankInfo){
    //     let diffInfo = [];
    //     let newinfo = {  "IDNO":newBaseForm.IDNO.DEFAULT_VALUE,
    //                      "IDTYPE":newBaseForm.IDTYPE.DEFAULT_VALUE,
    //                      "FULLNAME":newBaseForm.FULLNAME.DEFAULT_VALUE}
    //     _.forEach(oldBankInfo, function(oldValue,oldKey) {
    //         _.forEach(newInfo, function(newValue,newKey) {
    //             if(newKey == oldKey){
    //                 if(newValue != oldValue){
    //                     let saveDifObj = {"FIELD":oldKey,"OLD":oldValue,"NEW":newValue };
    //                     diffInfo.push(saveDifObj);
    //                     return false;
    //                 }
    //             }
    //         });
    //     });
    //     return diffInfo;
    // },

    getTaxIDContentArrayByString:function(taxCountryStr){
        let custTaxMoudleArray = [];
        if(taxCountryStr){
            let itemTaxIDArray= new Array(); //定义一数组 
            itemTaxIDArray=taxCountryStr.split(","); //字符分割 
            for (let i=0;i<itemTaxIDArray.length ;i++ ){ 
                let taxObj = {TAX_CITIZENSHIP:"",TAX_ID:""};
                console.log('itemStr', itemStr);
                let itemStr = itemTaxIDArray[i];
                let itemIndexArray = new Array();
                itemIndexArray=itemStr.split(" ");
                for (let j=0;j<itemIndexArray.length;j++ ){ 
                    let itemIndexStr = itemIndexArray[j];
                    if(j == 0){
                        let tempTexItemArray = itemIndexStr.split(":");
                        for (let m=0;m<tempTexItemArray.length;m++ ){
                            if(m == 1){
                                taxObj.TAX_CITIZENSHIP = tempTexItemArray[m];
                            }
                        }
                    }else{
                        taxObj.TAX_ID = itemIndexArray[j];
                    }
                }
                if (!(taxObj.TAX_ID == "" && taxObj.TAX_CITIZENSHIP  ==""))
                    custTaxMoudleArray.push(taxObj);
            }
        }
        return custTaxMoudleArray;
    },
    //杨云鹏
    //获取一个空的对象分组模块的对象
    getEmptyGroupFieldObj:function(_this,fieldData){
        if(_.isEmpty(fieldData)){
            return {};
        }
        let fieldObj = {
            BUSI_CODE: fieldData.BUSI_CODE,
            FIELDS:fieldData.FIELDS,
            GROUP_BUSI_PLAT: fieldData.GROUP_BUSI_PLAT,
            GROUP_ID: fieldData.GROUP_ID,
            GROUP_TIPS: fieldData.GROUP_TIPS,
            MODULE_ADD: fieldData.MODULE_ADD,
            MODULE_BUSI_PLAT: fieldData.MODULE_BUSI_PLAT,
            MODULE_CLEAN: fieldData.MODULE_CLEAN,
            MODULE_CONTROL:fieldData.MODULE_CONTROL,
            MODULE_DELETE: fieldData.MODULE_DELETE,
            MODULE_ID: fieldData.MODULE_ID,
            MODULE_NUM: fieldData.MODULE_NUM,
            MODULE_READ:fieldData.MODULE_READ,
            MODULE_SEQ: fieldData.MODULE_SEQ,
            MODULE_TITLE: fieldData.MODULE_TITLE,
            USER_TYPE: fieldData.USER_TYPE,
            MODULE_CUSTOMIZE: fieldData.MODULE_CUSTOMIZE,
            MODULE_CUSTOMIZE_TXT: fieldData.MODULE_CUSTOMIZE_TXT,
            
        }

        for(let fk in fieldObj.FIELDS) {
            fieldObj.FIELDS[fk]["DEFAULT_VALUE"] = "";
        }
        return fieldObj;
    },
    /**
     *parseCountyContentArray 解析涉税国模块数据
    * @param _this
    * 杨云鹏
    */
    parseCountyContentArray:function(_this,moudletpl,orgTaxMoudleArray){
        if(!orgTaxMoudleArray){
            return;
        }
        if(orgTaxMoudleArray.length > moudletpl.length){
            let mdtpl =  this.getEmptyGroupFieldObj(_this,moudletpl[0]);
            for(let i = 0; i < orgTaxMoudleArray.length; i++) {
                let bdd = orgTaxMoudleArray[i];
                let mdd = _.cloneDeep(mdtpl);
                mdd["MODULE_NUM"] = String(i);
                if(i > 0){
                    mdd.MODULE_SEQ = String(parseInt(mdd["MODULE_SEQ"])  + i);
                }
                
                for(let fk in bdd) {
                    if(fk in mdd.FIELDS && bdd[fk] !== null) {
                        mdd["FIELDS"][fk]["DEFAULT_VALUE"] = bdd[fk];
                    }
                }
                //3   i = 2  moudletpl =1
               
                if(i > moudletpl.length -1 ){
                    if(i == 1 && orgTaxMoudleArray.length == 2){
                        mdd.MODULE_ADD = "1";  
                    }else {
                        mdd.MODULE_ADD = "0";
                    }
                    
                    mdd.MODULE_DELETE = "1";
                    moudletpl.push(mdd);
                    
                } else{
                    if(orgTaxMoudleArray.length == 1){
                        mdd.MODULE_ADD = "1";
                        mdd.MODULE_DELETE = "0";
                    }else{
                
                        if(orgTaxMoudleArray.length && i ==  orgTaxMoudleArray.length -1 ){
                            mdd.MODULE_ADD = "1"; 
                            mdd.MODULE_DELETE = "1"; 
                        }else {
                            mdd.MODULE_ADD = "0";
                        }
                     
                    }
                    moudletpl[i] = mdd;
                }
            }
        }else{
            for(let i = 0; i < moudletpl.length; i++) {
                moudletpl[i]["MODULE_NUM"] = String(i);
                if(i < orgTaxMoudleArray.length){
                    let bdd = orgTaxMoudleArray[i];
                    for(let fk in bdd) {
                        if(fk in moudletpl[i].FIELDS && bdd[fk] !== null) {
                            moudletpl[i]["FIELDS"][fk]["DEFAULT_VALUE"] = bdd[fk];
                        }
                    }
                }else{
                    for(let fk in moudletpl[i].FIELDS) {
                        moudletpl[i]["FIELDS"][fk]["DEFAULT_VALUE"] = moudletpl[i].FIELDS[fk].DEFAULT_VALUE;
                    }
                    moudletpl[i]["MODULE_NUM"] = String(i);
                }
                
                //3   i = 2  moudletpl =1
               
                if(i > orgTaxMoudleArray.length -1){
                    if(orgTaxMoudleArray.length && i == orgTaxMoudleArray.length -1 ){
                        moudletpl[i].MODULE_ADD = "1";  
                    }else {
                        moudletpl[i].MODULE_ADD = "0";
                    }
                    moudletpl[i].MODULE_DELETE = "1";
                } else{
                    if(orgTaxMoudleArray.length == 1){
                        moudletpl[i].MODULE_ADD = "1";
                        moudletpl[i].MODULE_DELETE = "0";
                    }else{
                
                        if(i == 1 && orgTaxMoudleArray.length == 2){
                            moudletpl[i].MODULE_ADD = "1"; 
                            moudletpl[i].MODULE_DELETE = "1"; 
                        }else {
                            moudletpl[i].MODULE_ADD = "0";
                        }
                    }
                }
    
                if(i > 0){
                    moudletpl[i].MODULE_SEQ = String(parseInt(moudletpl[i]["MODULE_SEQ"])  + 1);
                } 
            }
        }
        
    },
    /**
    *parseTaxControlerCountryItem 中泰机构涉税控制人，点击单个时进行赋值
    * @param _this
    * 杨云鹏
    */
   parseTaxControlerCountryItem:function(_this,moudletpl,outData){
        if(!outData){
            return moudletpl;
        }
        let orgTaxControlerInfo = _.cloneDeep(outData);  

        let gedDictKey = (FIELD_DICT_NAME, DEFAULT_VALUE) => {
            if (FIELD_DICT_NAME && DEFAULT_VALUE) {
                let defaultDict = _.find(FIELD_DICT_NAME, item => {
                    return item.DICT_ITEM_NAME == DEFAULT_VALUE;
                })
                return defaultDict && defaultDict.DICT_ITEM || DEFAULT_VALUE; 
            }
            return '';
        }
        //先去掉原因输入框文字
        orgTaxControlerInfo.NO_TAXPAYERID_REASON = orgTaxControlerInfo.NO_TAXPAYERID_REASON&&orgTaxControlerInfo.NO_TAXPAYERID_REASON.split(":")&&orgTaxControlerInfo.NO_TAXPAYERID_REASON.split(":")[0];
        orgTaxControlerInfo.NO_TAXPAYERID_REASON2 = orgTaxControlerInfo.NO_TAXPAYERID_REASON2&&orgTaxControlerInfo.NO_TAXPAYERID_REASON2.split(":")&&orgTaxControlerInfo.NO_TAXPAYERID_REASON2.split(":")[0];
        orgTaxControlerInfo.NO_TAXPAYERID_REASON3 = orgTaxControlerInfo.NO_TAXPAYERID_REASON3&&orgTaxControlerInfo.NO_TAXPAYERID_REASON3.split(":")&&orgTaxControlerInfo.NO_TAXPAYERID_REASON3.split(":")[0];
        if(orgTaxControlerInfo.HAS_TAXPAYER_IDNO == "0"){
            //如果没有取得识别号，NO_TAXPAYERID_REASON：账户持有人未能取得纳税人识别号:123，NO_TAXPAYERID_REASON_INPUT: "123"
            //根据字典转换
            orgTaxControlerInfo.NO_TAXPAYERID_REASON = gedDictKey(moudletpl[0].FIELDS.NO_TAXPAYERID_REASON.FIELD_DICT_NAME, orgTaxControlerInfo.NO_TAXPAYERID_REASON)
        }
         if(orgTaxControlerInfo.HAS_TAXPAYER_IDNO2 == "0"){
            orgTaxControlerInfo.NO_TAXPAYERID_REASON2 = gedDictKey(moudletpl[0].FIELDS.NO_TAXPAYERID_REASON.FIELD_DICT_NAME, orgTaxControlerInfo.NO_TAXPAYERID_REASON2)
        }
         if(orgTaxControlerInfo.HAS_TAXPAYER_IDNO3 == "0"){
            orgTaxControlerInfo.NO_TAXPAYERID_REASON3 = gedDictKey(moudletpl[0].FIELDS.NO_TAXPAYERID_REASON.FIELD_DICT_NAME, orgTaxControlerInfo.NO_TAXPAYERID_REASON3)
        }
        console.log("还原后的数据", orgTaxControlerInfo)
        let bdd = orgTaxControlerInfo; //流水涉税国数据
        let mdtpl =  this.getEmptyGroupFieldObj(_this,moudletpl[0]); //页面空对象，重新赋值
        let mdd = _.cloneDeep(mdtpl);  
        moudletpl = [];

        if(bdd.CITIZENSHIP){
            //如果有两个涉税国，则第一个只显示删除按钮
            for(let fk in bdd) {
                if(fk in mdd.FIELDS && bdd[fk] !== null) {
                    if(fk == "CITIZENSHIP" || fk == "HAS_TAXPAYER_IDNO" || fk == "NO_TAXPAYERID_REASON_INPUT" || fk == "TAXPAYER_IDNO" || fk == "NO_TAXPAYERID_REASON"){
                        mdd["FIELDS"][fk]["DEFAULT_VALUE"] = bdd[fk];
                    }
                }
            }
            if(bdd.CITIZENSHIP2){
                mdd. MODULE_ADD = "0";
                mdd.MODULE_DELETE = "1"; 
                moudletpl.push(mdd);
            }else{
               
                //如果涉税国第二个为空，则第一个涉税国只展示添加按钮
                mdd.MODULE_ADD = "1";
                mdd.MODULE_DELETE = "0";   
                moudletpl.push(mdd);
                return moudletpl;
            }
        }else{
            mdd.MODULE_ADD = "1";
            mdd.MODULE_DELETE = "0";  
            moudletpl.push(mdd);
            return moudletpl;
        }
        
        if(bdd.CITIZENSHIP2){
            let mdd2 = _.cloneDeep(mdtpl);  
            mdd2.MODULE_SEQ = parseInt(mdd2["MODULE_SEQ"]) + 1 + "";
            //如果有两个涉税国，则第一个只显示删除按钮
            for(let fk in bdd) {
                if(fk in mdd2.FIELDS && bdd[fk] !== null) {
                    if(fk == "CITIZENSHIP"){
                        mdd2["FIELDS"][fk]["DEFAULT_VALUE"] = bdd["CITIZENSHIP2"];
                    }else if(fk == "HAS_TAXPAYER_IDNO"){
                        mdd2["FIELDS"][fk]["DEFAULT_VALUE"] = bdd["HAS_TAXPAYER_IDNO2"];
                    }else if(fk == "TAXPAYER_IDNO"){
                        mdd2["FIELDS"][fk]["DEFAULT_VALUE"] = bdd["TAXPAYER_IDNO2"];
                    }else if(fk == "NO_TAXPAYERID_REASON"){
                        mdd2["FIELDS"][fk]["DEFAULT_VALUE"] = bdd["NO_TAXPAYERID_REASON2"];
                    }else if( fk == "NO_TAXPAYERID_REASON_INPUT"){
                        mdd2["FIELDS"][fk]["DEFAULT_VALUE"] = bdd["NO_TAXPAYERID_REASON2_INPUT"];
                    }
                }
            }
            if(bdd.CITIZENSHIP3){
                mdd2.MODULE_ADD = "0";
                mdd2.MODULE_DELETE = "1"; 
                moudletpl.push(mdd2);
            }else{
                //如果涉税国第二个为空，则第一个涉税国只展示添加按钮
                mdd2. MODULE_ADD = "1";
                mdd2.MODULE_DELETE = "1";   
                moudletpl.push(mdd2);
                return moudletpl;
            }       
        }
        
        if(bdd.CITIZENSHIP3){
            let mdd3 = _.cloneDeep(mdtpl);  
            mdd3.MODULE_SEQ = parseInt(mdd3["MODULE_SEQ"]) + 2 + "";
            //如果有两个涉税国，则第一个只显示删除按钮
            for(let fk in bdd) {
                if(fk in mdd3.FIELDS && bdd[fk] !== null) {
                    if(fk == "CITIZENSHIP"){
                        mdd3["FIELDS"][fk]["DEFAULT_VALUE"] = bdd["CITIZENSHIP3"];
                    }else if(fk == "HAS_TAXPAYER_IDNO"){
                        mdd3["FIELDS"][fk]["DEFAULT_VALUE"] = bdd["HAS_TAXPAYER_IDNO3"];
                    }else if(fk == "TAXPAYER_IDNO"){
                        mdd3["FIELDS"][fk]["DEFAULT_VALUE"] = bdd["TAXPAYER_IDNO3"];
                    }else if(fk == "NO_TAXPAYERID_REASON"){
                        mdd3["FIELDS"][fk]["DEFAULT_VALUE"] = bdd["NO_TAXPAYERID_REASON3"];
                    }else if( fk == "NO_TAXPAYERID_REASON_INPUT"){
                        mdd3["FIELDS"][fk]["DEFAULT_VALUE"] = bdd["NO_TAXPAYERID_REASON3_INPUT"];
                    }
                }
            }
            mdd3.MODULE_ADD = "0";
            mdd3.MODULE_DELETE = "1";   
            moudletpl.push(mdd3);
            return moudletpl;
        }
        return moudletpl;
    },

    /*
     *@Description: 只做涉税国的数据解析  通过解析初始化涉税国模块
     *@Author: yangyp
     *@Date: 2019-08-07 18:57:55
    */
    parseInitCountyContentArray:function(_this,moudletpl,orgTaxMoudleArray){
        let mdtpl =  this.getEmptyGroupFieldObj(_this,moudletpl[0]);
        if(orgTaxMoudleArray&&orgTaxMoudleArray.length){
            moudletpl = [];
        }
      
        if(!orgTaxMoudleArray || !orgTaxMoudleArray.length){
            return moudletpl;
        }
        for(let i = 0; i < orgTaxMoudleArray.length; i++) {
            let bdd = orgTaxMoudleArray[i];
            let mdd = _.cloneDeep(mdtpl);
            mdd["MODULE_NUM"] = String(i);
            if(i > 0){
                mdd.MODULE_SEQ = String(parseInt(mdd["MODULE_SEQ"])  + i);
            }
            
            for(let fk in bdd) {
                if(fk in mdd.FIELDS && bdd[fk] !== null) {
                    mdd["FIELDS"][fk]["DEFAULT_VALUE"] = bdd[fk];
                }
            }
            //3   i = 2  moudletpl =1
           
            if(i ==  orgTaxMoudleArray.length -1  ){
                if(i < 2){
                    mdd. MODULE_ADD = "1";  
                }else {
                    mdd.MODULE_ADD = "0";
                }
            } else{
                mdd.MODULE_ADD = "0";
            }
            if(orgTaxMoudleArray.length != 1){
                mdd.MODULE_DELETE = "1";
            }else{
                mdd.MODULE_ADD = "1";
            }
            
            moudletpl.push(mdd);
        }
        return moudletpl;
    },
    /*
    *@Description: 中泰涉税国模块解析
    *@Author: yangyp
    *@Date: 2020-01-29 18:57:55
    *moudletpl 为页面显示对象
    *orgTaxMoudleArray获取的涉税国数组
    */
    parseInitCountyContentForZTArray:function(_this,moudletpl,orgTaxMoudleArray){
        let mdtpl =  this.getEmptyGroupFieldObj(_this,moudletpl[0]);
        if(orgTaxMoudleArray&&orgTaxMoudleArray.length){
            moudletpl = [];
        }
    
        if(!orgTaxMoudleArray || !orgTaxMoudleArray.length){
            return moudletpl;
        }
        for(let i = 0; i < orgTaxMoudleArray.length; i++) {
            let bdd = orgTaxMoudleArray[i];
            let mdd = _.cloneDeep(mdtpl);
            mdd["MODULE_NUM"] = String(i);
            if(i > 0){
                mdd.MODULE_SEQ = String(parseInt(mdd["MODULE_SEQ"])  + i);
            }
            
            for(let fk in bdd) {
                if(fk in mdd.FIELDS && bdd[fk] !== null) {
                    mdd["FIELDS"][fk]["DEFAULT_VALUE"] = bdd[fk];
                }
            }
            //3   i = 2  moudletpl =1
        
            if(i ==  orgTaxMoudleArray.length -1  ){
                if(i < 2){
                    mdd. MODULE_ADD = "1";  
                }else {
                    mdd.MODULE_ADD = "0";
                }
            } else{
                mdd.MODULE_ADD = "0";
            }
            if(orgTaxMoudleArray.length != 1){
                mdd.MODULE_DELETE = "1";
            }else{
                mdd.MODULE_ADD = "1";
            }
            
            moudletpl.push(mdd);
        }
        return moudletpl;
    },
    //保存涉税控制人的数据到数据表中
    saveTaxControlData : function(_this){
        for(let i = 0; i < _this.$store.state.bizRouteTable.length; i++) {
            if(i == _this.$router.getCurrentRouteIndex()){
                let r = _this.$store.state.bizRouteTable[i];
                if(r.group == "ORG_TAX_CONTROL_INFO"){
                    for (let j = 0; j< r.modules.length; j++){
                        for(let fk in _this.groupDatas[r.group][r.modules[j]][0].FIELDS) {
                            _this.oppBusiData.newControllerTaxInfo[_this.oppBusiData.tempControlTaxPageIndex][fk] = _this.groupDatas[r.group][r.modules[j]][0]["FIELDS"][fk]["DEFAULT_VALUE"]||"";
                        }  
                        
                    }
                    if(_.indexOf(r.modules,"ORG_CONTROL_INFO_MODULE2") != -1){
                        _this.oppBusiData.newControllerTaxInfo[_this.oppBusiData.tempControlTaxPageIndex].ORG_TAX_INFO = this.getTaxIDContent(_this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_CONTROL_INFO_MODULE2);
                    }else if(_.indexOf(r.modules,"ORG_TAX_CONTROLER_MODULE7") != -1){
                        _this.oppBusiData.newControllerTaxInfo[_this.oppBusiData.tempControlTaxPageIndex].CONTROL_TAX_INFO = this.getTaxIDContent(_this.groupDatas.ORG_TAX_CONTROL_INFO.ORG_TAX_CONTROLER_MODULE7);
                    }
                }

                break;
            }
        }
        //这里要保存流水信息要流水表中
        return oppService.saveBizData(_this.oppBusiData).then((response) =>{
            console.log('这里要保存流水信息要流水表中 response', response);
        });
    },
      //保存涉税控制人的数据到数据表中
      saveOpenTaxControlData : function(_this){
        for(let i = 0; i < _this.$store.state.bizRouteTable.length; i++) {
            if(i == _this.$router.getCurrentRouteIndex()){
                let r = _this.$store.state.bizRouteTable[i];
                if(r.group == "ORG_TAX_CONTROL_INFO"){
                    for (let j = 0; j< r.modules.length; j++){
                        for(let fk in _this.groupDatas[r.group][r.modules[j]][0].FIELDS) {
                            _this.oppBusiData.newControllerTaxInfo[_this.oppBusiData.tempControlTaxPageIndex][fk] = _this.groupDatas[r.group][r.modules[j]][0]["FIELDS"][fk]["DEFAULT_VALUE"]||"";
                        }  
                        
                    }
                }

                break;
            }
        }
        //这里要保存流水信息要流水表中
        return oppService.saveBizData(_this.oppBusiData).then((response) =>{
            console.log('这里要保存流水信息要流水表中 response', response);
        });
    },
    updateControllerTaxInfo:function(_this){  
        let fitlersArray = ["CONTROLER_NAME"," CONTROL_ORG_ADDRESS", "CONTROL_ORG_NAME"," ORG_TAX_INFO","TAX_FLAG"];
        for(let i = 0;i<_this.oppBusiData.newControllerTaxInfo.length ;i++){
            _this.oppBusiData.newControllerTaxInfo[i].DIFF_INFO  = [];
            let tempNewObj = _this.oppBusiData.newControllerTaxInfo[i];
            tempNewObj.OPER_TYPE = "1"
            if(i < _this.oppBusiData.CONTROLLER_INFO.length){
                for(let j = 0; j< _this.oppBusiData.CONTROLLER_INFO.length ;j ++){
                    let tempOldObj = _this.oppBusiData.CONTROLLER_INFO[j];
                    if(_.indexOf(["1","4"],tempNewObj.TAX_FLAG) != -1) {
                        _.forEach(tempOldObj, function(oldValue,oldKey) {
                            if(_.indexOf(fitlersArray,oldKey) != -1){
                                _.forEach(tempNewObj, function(newValue,newKey) {
                                    if(newKey == oldKey && newKey != "DIFF_INFO" && newKey != "ORG_TAX_NUM_INFO" && newKey != "CTRL_TAX_NUM_INFO"){
                                        if(newValue != oldValue){
                                            if(newValue == undefined){
                                                newValue = "";
                                            }
                                            let saveDifObj = {"FIELD":oldKey,"OLD":oldValue,"NEW":newValue };
                                            let hasPushObjBool = false;
                                            _.forEach(_this.oppBusiData.newControllerTaxInfo[i].DIFF_INFO ,function(indexInfo){
                                                if(indexInfo.FIELD == newKey){
                                                    hasPushObjBool = true;
                                                    return false;
                                                }
                                            })
                                            if(!hasPushObjBool){
                                                _this.oppBusiData.newControllerTaxInfo[i].DIFF_INFO .push(saveDifObj);
                                            }
                                            return false;
                                        }
                                    }
                                });
                            }
                        });
                    }else{
                        _.forEach(tempOldObj, function(oldValue,oldKey) {
                            _.forEach(tempNewObj, function(newValue,newKey) {
                                if(newKey == oldKey && newKey != "DIFF_INFO"){
                                    if(newValue != oldValue){
                                        let saveDifObj = {"FIELD":oldKey,"OLD":oldValue,"NEW":newValue };
                                        _this.oppBusiData.newControllerTaxInfo[i].DIFF_INFO .push(saveDifObj);
                                        return false;
                                    }
                                }
                            });
                        });
                    }                  
                  
                }
            }else{
                _.forEach(tempNewObj, function(newValue,newKey) {
                    if(newKey != "DIFF_INFO" && newKey != "ORG_TAX_NUM_INFO" && newKey != "CTRL_TAX_NUM_INFO"){
                        let saveDifObj = {"FIELD":newKey,"OLD":"","NEW":newValue };
                        _this.oppBusiData.newControllerTaxInfo[i].DIFF_INFO .push(saveDifObj);
                    }
                    
                });
            }
            if(_this.oppBusiData.newControllerTaxInfo[i].ORG_TAX_INFO){
                _this.oppBusiData.newControllerTaxInfo[i].ORG_TAX_NUM_INFO = this.getTaxIDContentArrayByString(_this.oppBusiData.newControllerTaxInfo[i].ORG_TAX_INFO);
            }
            
            if(_this.oppBusiData.newControllerTaxInfo[i].CONTROL_TAX_INFO){
                _this.oppBusiData.newControllerTaxInfo[i].CTRL_TAX_NUM_INFO = this.getTaxIDContentArrayByString(_this.oppBusiData.newControllerTaxInfo[i].CONTROL_TAX_INFO);
            }
            _this.oppBusiData.newControllerTaxInfo[i].DECLARE_FILE_FLAG = "0";
        };
    },
    validateOrgTaxFlagData:function(_this){
        if(_this.groupDatas.ORG_TAX_INFO.ORG_TYPE_MODULE[0].FIELDS.ORG_TYPE.DEFAULT_VALUE == "1"
        ||_this.groupDatas.ORG_TAX_INFO.ORG_TYPE_MODULE[0].FIELDS.ORG_TYPE.DEFAULT_VALUE == "2"){
            _this.groupDatas.ORG_TAX_INFO.ORG_TAX_FLAG_MODULE[0].FIELDS.TAX_FLAG.FIELD_CONTROL = "0";
        }else{
            _this.groupDatas.ORG_TAX_INFO.ORG_TAX_FLAG_MODULE[0].FIELDS.TAX_FLAG.DEFAULT_VALUE = "4";
            _this.groupDatas.ORG_TAX_INFO.ORG_TAX_FLAG_MODULE[0].FIELDS.TAX_FLAG.FIELD_CONTROL = "2"; 
        }
        _this.$router.goRoute("涉税信息2");
        return false;
    },
    getOrgControlEmptyObject:function(){
        return {
            TAX_RESIDENT_TYPE:"",
            ADDRESS_TYPE:"",
            CTRL_NON_RESIDENT:"",
            CTRL_SHARE_RATIO:"",
            CTRL_TYPE:"",
            CUST_NAME:"",
            GET_INVEST_CERFLAG:"",
            NAME_ENG:"",
            REG_COUNTRY:"",
            SURNAME_ENG:"",
            BIRTHDAY:"",
            BIRTH_ADDRESS:"",
            BIRTH_COUNTRY:"",
            BIRTH_ADDRESS_EN:"",
            BIRTH_CITY_EN:"",
            BIRTH_PROVINCE_EN:"",
            OP_REMARK:"",
            OPERATOR_TYPE: "0",//新增标志位
            CITIZENSHIP:"",
            TAXPAYER_IDNO:"",
            HAS_TAXPAYER_IDNO:"",
            NO_TAXPAYERID_REASON:"",
            NO_TAXPAYERID_REASON_INPUT:"",
            CITIZENSHIP2:"",
            TAXPAYER_IDNO2:"",
            HAS_TAXPAYER_IDNO2:"",
            NO_TAXPAYERID_REASON2:"",
            NO_TAXPAYERID_REASON2_INPUT:"",
            CITIZENSHIP3:"",
            TAXPAYER_IDNO3:"",
            HAS_TAXPAYER_IDNO3:"",
            NO_TAXPAYERID_REASON3:"",
            NO_TAXPAYERID_REASON3_INPUT:"",
        }
    },
}