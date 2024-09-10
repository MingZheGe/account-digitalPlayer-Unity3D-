/* 
*   机构开户-机构基本信息模块
*   方法封装
*   @author  linsc
*/

import date from "../../../../../tools/date"
import * as utils from "../../../../../tools/util"
import * as openBizPubTools from "./openBizPublicTools"


export default {
    //----------------------------------钩子函数----------------------//
    /*
    *@method openBizProInfoNodeBeforeLoadBiz
    *@desc 钩子函数 加载历史数据之前触发
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    openBizProInfoNodeBeforeLoadBiz: function (_this) {
        _this.oppBusiData.busiCommonParams = {};
        //业务公共参数数组 转为对象
        _.each(_this.oppBusiData.busiCommonParamsArray, function (obj) {
            _this.oppBusiData.busiCommonParams[obj.PARAM_CODE] = obj.PARAM_VALUE
        });
        //默认填写客户三要素
        _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.CUST_FNAME.DEFAULT_VALUE = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO).CUST_FNAME;
        _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.ID_TYPE.DEFAULT_VALUE = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO).ID_TYPE;
        _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.ID_CODE.DEFAULT_VALUE = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO).ID_CODE;
        //给国籍排序，中国优先
        let newArray = [];
        let array = _.filter(_this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.CITIZENSHIP.FIELD_DICT_NAME, function (o) {
            if (["中国", "香港", "中国台湾", "澳门"].indexOf(o.DICT_ITEM_NAME) !== -1) {
                newArray.push(o);
                return false;
            } else {
                return true;
            }
        });
        //设置证件号码为失去焦点校验
        _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]["FIELDS"]["ID_CODE"]["VALID_TYPE"] = _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]["FIELDS"]["ID_CODE"]["VALID_TYPE"] + "|on-blur";
        //重新给初始化字段配置数据赋值
        _this.groupDatasTpl = _this.groupDatas;
        //保存读卡信息
        if (_this.cardData) {
            _this.oppBusiData.cardData = _this.cardData;
        }
        //初始化数据
        _this.oppBusiData["busiData"] = {};
        _this.oppBusiData["busiData"]["isLoadHistoryData"] = false;
        // //根据版本设置关联信息分组id
        // let gk = "RELA_INFO";
        // if (_this.$syscfg.isQSJG(_this.$definecfg.QSJGDM_CONST.ZHONGSHAN) || _this.$syscfg.isQSJG(_this.$definecfg.QSJGDM_CONST.ZHONGTAI)) {
        //     gk = "APPR_INFO";
        // }
        let gk = "APPR_INFO";
        _this.oppBusiData["busiData"]["relaInfoGroupId"] = gk;
        //手动隐藏原始模板的涉税 资产信息的金额和货币代码
        _this.groupDatasTpl[gk].TAX_ASSET_INFO[0].FIELDS["MONAMNT"].FIELD_CONTROL = '1';
        _this.groupDatasTpl[gk].TAX_ASSET_INFO[0].FIELDS["CURR_CODE"].FIELD_CONTROL = '1';

        // if (_this.groupDatas["RELA_INFO"]["ORG_AML_INFO"]) {
        //     let amlInfo = _this.groupDatas["RELA_INFO"]["ORG_AML_INFO"];
        //     let amlInfoTpl = _this.groupDatasTpl["RELA_INFO"]["ORG_AML_INFO"];
        //     amlInfo[0].FIELDS.USER_NAME.VALID_TYPE = "length[4,128]";
        //     amlInfoTpl[0].FIELDS.USER_NAME.VALID_TYPE = "length[4,128]";
        //     //由于基础模块跟反洗钱模块共用ID_TYPE字段，但是不共用关联函数，所以需要更改反洗钱模块字段关联函数
        //     amlInfo[0].FIELDS.ID_TYPE.FIELD_FUNCTION = "CHECK_AML_ID_TYPE";
        //     amlInfoTpl[0].FIELDS.ID_TYPE.FIELD_FUNCTION = "CHECK_AML_ID_TYPE";
        //     //由于基础模块跟反洗钱模块共用ID_CODE字段，但是不共用关联函数，所以需要更改反洗钱模块字段关联函数
        //     amlInfo[0].FIELDS.ID_CODE.FIELD_FUNCTION = "CHECK_AML_ID_CODE";
        //     amlInfoTpl[0].FIELDS.ID_CODE.FIELD_FUNCTION = "CHECK_AML_ID_CODE";
        // }

        return _this.$syscfg.K_Request_ALL([
            openBizPubTools.getAcctOpenInitData(_this),
            openBizPubTools.getValidIdTypeData(_this),
            _this.$syscfg.getSysConfig("AML_ENABLE")
        ]).then((res) => {
            console.log("开户逻辑res", res)
            if (res[0].Data.length == 0) {
                _this.$blMethod.showMsgBox(_this, "开户逻辑配置为空！")
            }
            //开户逻辑
            if (res[0].Code == "0" && res[1].Code == "0" && res[0].Data && res[1].Data && res[2] && res[2].Code == "0") {
                _this.oppBusiData["allAcctOpenLogicData"] = res[0].Data[0].openLogicData;
                _this.oppBusiData["busiCommParams"] = {};
                _.each(res[0].Data[0].busiCommParam, function (item) {
                    if (item.PARAM_CODE && item.PARAM_VALUE) {
                        _this.oppBusiData["busiCommParams"][item.PARAM_CODE] = item["PARAM_VALUE"];
                    }
                });

                if (!_this.oppBusiData["allAcctOpenLogicData"] || _.isEmpty(_this.oppBusiData["busiCommParams"])) {
                    _this.$blMethod.showMsgBox(_this, "开户逻辑配置或者业务公共参数为空！")
                }
                console.log("显示风险评测参数为==", _this.oppBusiData["busiCommParams"]["IS_SHOW_SURVEY_RISK"])
                //证件类型 分类
                var validIdTypeObj = { "0": [], "1": [], "2": [] };
                res[1] && res[1].Data.forEach((v) => {
                    validIdTypeObj[v.USER_TYPE].push(v.ID_TYPE)
                })
                //个人证件类型数组
                _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"] = validIdTypeObj["0"]
                //机构证件类型编码数组
                _this["oppBusiData"]["VALID_ID_TYPE_FOR_ORG"] = validIdTypeObj["1"]
                //产品证件类型编码数组  10
                if (validIdTypeObj["2"] && validIdTypeObj["2"].length) {
                    _this["oppBusiData"]["VALID_ID_TYPE_FOR_PRO"] = validIdTypeObj["2"]
                } else {
                    _this["oppBusiData"]["VALID_ID_TYPE_FOR_PRO"] = validIdTypeObj["1"]
                }
                //机构+个人 证件类型合并数组
                _this["oppBusiData"]["VALID_ID_TYPE_FOR_BOTH"] = validIdTypeObj["0"].concat(validIdTypeObj["1"])

                // //系统公参决定是否显示反洗钱跟受益所有人模块 1为显示 0隐藏
                // if (res[2] && res[2].Data) {
                //     _this.oppBusiData["AML_FLAG"] = res[2].Data[0].PAR_VAL == "1" ? true : false;
                //     let moduleControl = _this.oppBusiData["AML_FLAG"] ? "1" : "0";
                //     let fieldControl = _this.oppBusiData["AML_FLAG"] ? "0" : "1";
                //     _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.AML_CUST_TYPE.FIELD_CONTROL = fieldControl
                //     if (_this.userType == "2") {
                //         //产品户 受益所有人在基础信息分组下
                //         openBizPubTools.setModulesControl(_this, "ORG_INFO", "ORG_BENEFICIARY_OWNER_INFO", moduleControl)
                //         if (openBizPubTools.getBusiCommParam(_this, "MAX_BENEFICIARY_OWNER")) {
                //             //设置收益所有人模块 最大分组数量
                //             _this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_OWNER_INFO"][0]["MAX_LENGTH"] = openBizPubTools.getBusiCommParam(_this, "MAX_BENEFICIARY_OWNER");
                //         }
                //     }
                //     //显示或隐藏 反洗钱专有信息模块
                //     openBizPubTools.setModulesControl(_this, "RELA_INFO", "ORG_AML_INFO", moduleControl)
                //     if (openBizPubTools.getBusiCommParam(_this, "MAX_AML")) {
                //         //设置收益所有人模块 最大分组数量
                //         _this.groupDatas["RELA_INFO"]["ORG_AML_INFO"][0]["MAX_LENGTH"] = openBizPubTools.getBusiCommParam(_this, "MAX_AML");
                //     }
                // }

            } else {
                _this.$blMethod.showMsgBox(_this, "获取开户初始化数据失败！")
            }

            //暂时屏蔽选择开户机构列表
            // if (_this.groupDatas["CUST_ORG_INFO"] && _this.groupDatas["CUST_ORG_INFO"]["CUST_ORG_INFO"]) {
            //   _this.groupDatas["CUST_ORG_INFO"]["CUST_ORG_INFO"][0].MODULE_CONTROL = "0";
            // }
        }).catch((err) => {
            console.error("---------OPENBIZPROINFONODE 产品开户 开户初始化错误:---------", err.toString());
            _this.$blMethod.showMsgBox(_this, "获取开户初始化数据失败:" + JSON.stringify(err))
            throw err;
        }).finally(() => {
            console.log("custInfoBeforeLoadBiz end")
            // resolve()
        });
    },
    /*
     *@method openBizProInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  linsc
     *@Date: 2019-06-13 09:42:56
    */
    openBizProInfoNodeAfterLoadBiz: function (_this) {
        //如果历史流水里有一人多户信息，需要展示出来
        if (_this.historyData && _this.historyData.CHECK_ARR && _this.historyData.CHECK_ARR[0]) {
            let checkArr = _this.groupDatas.ORG_INFO.CHECK_ARR;
            for (let i = 0; i < checkArr.length; i++) {
                checkArr[i].MODULE_CONTROL = "1";
                let allfds = checkArr[i].FIELDS;
                allfds.CHECK_STATUS.FIELD_DICT_NAME = [{ DICT_ITEM: "0", DICT_ITEM_NAME: "否" }, { DICT_ITEM: "1", DICT_ITEM_NAME: "是" }]
                allfds.INT_ORG.FIELD_DICT_NAME = _this.groupDatas.ORG_INFO.CUST_ACCT_INFO[0].FIELDS["CUST_ORG_CODE"].FIELD_DICT_NAME
                for (let fk in allfds) {
                    allfds[fk].FIELD_TYPE = "normalText";
                }
            }

        }
        //重新解析历史数据
        this.openBizProInfoNodeLoadBizData(_this, _this.historyData)
        // 控制人模块，受益人模块，还有账户信息模块移动到股东账户信息下面进行展示
        // _this.groupDatas.ACCT_INFO["CUST_CONTROLLER_INFO"] =  _this.groupDatas.ORG_INFO["CUST_CONTROLLER_INFO"] 
        // _this.groupDatas.ACCT_INFO["CUST_BENEFICIARY_INFO"] =  _this.groupDatas.ORG_INFO["CUST_BENEFICIARY_INFO"] 
        // _this.groupDatas.ACCT_INFO["CUST_ACCT_INFO"] =  _this.groupDatas.ORG_INFO["CUST_ACCT_INFO"] 
          //三要素 不可编辑
        _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.CUST_FNAME.FIELD_CONTROL = "1"
        // _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.CUST_NAME.FIELD_CONTROL = "2"
        _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.ID_TYPE.FIELD_CONTROL = "2"
        _this.groupDatas.ORG_INFO.ORG_BASIC_INFO[0].FIELDS.ID_CODE.FIELD_CONTROL = "2"
        
        let gk = _this.oppBusiData.busiData.relaInfoGroupId;
        //产品户 需要根据公共参数 控制是否进行风险评测
        if (_this.oppBusiData["busiCommParams"]["IS_SHOW_SURVEY_RISK"] == "0") {
            _this.$router.hideRoute("风险测评");
        }
        //产品户 需要根据公共参数 控制是否显示涉税
        if (_this.oppBusiData["busiCommParams"]["IS_SHOW_TAX_INFO"] == "0") {
            let apprInfo = _this.groupDatas[gk];
            for (let d in apprInfo) {
                if (d == "CREDIT_RECORD_INFO") continue;
                let md = apprInfo[d];
                md[0].MODULE_CONTROL = '0';
            }
        }
    },
    /*
    *@method openBizProInfoNodeBeforeSave
    *@desc 钩子函数 自定义保存数
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    openBizProInfoNodeBeforeSave: async function (_this, params) {
        //数据保存
        let gk = _this.oppBusiData.busiData.relaInfoGroupId;
        // 一柜通不进行回填，这个字段只是方便操作而已 不会在账户系统落地
        // 将产品户 客户信息分组下 账户实际操作人 受益人 两个模块的一致按钮值转为一柜通的USESAME_INFO
        if (_this.moduleId.indexOf("ORG_ACTUAL_CONTROLER_INFO") != -1 || _this.moduleId.indexOf("ORG_BENEFICIARY_INFO") != -1) {
            params["SAME_FLAG_ACTUAL_CONTROLER"] = params["ORG_INFO"]["ORG_ACTUAL_CONTROLER_INFO"][0]["MODULE_RADIO_BUTTON"] == "true" ? "1" : "0";
            params["SAME_FLAG_BENEFICIARY"] = params["ORG_INFO"]["ORG_BENEFICIARY_INFO"][0]["MODULE_RADIO_BUTTON"] == "true" ? "1" : "0";
            //需要把投资者类型 放到最外层作为影像过滤条件 机构户后面会 放，但是产品没有显示这个子弹所以要手动放还要强制为1
            params["PROF_INVESTOR_SOURCE"] = "10"
        }
        //开户时，需要把客户资料保存到sessionStorage里和客户资料里
        let fks = ["ID_CODE", "ID_TYPE", "CUST_FNAME", "CUST_NAME", "SUBJECT_IDENTITY"]
        let custInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO) || {};
        for (let gl in _this.groupDatas) {
            for (let md in _this.groupDatas[gl]) {
                let mdd = _this.groupDatas[gl][md][0];
                if (mdd.MODULE_ID == "CUST_BASIC_INFO" || mdd.MODULE_ID == "ORG_BASIC_INFO" || mdd.MODULE_ID == "PRO_BASIC_INFO") {
                    fks.map((v) => {
                        if (v in mdd["FIELDS"] && mdd["FIELDS"][v].DEFAULT_VALUE != "") {
                            custInfo[v] = mdd["FIELDS"][v].DEFAULT_VALUE;
                            params[v] = mdd["FIELDS"][v].DEFAULT_VALUE;
                        }
                    });
                }
            }
        }
        //产品开户没有客户简称字段，直接截取全称前16位
        custInfo["CUST_NAME"] = utils.cutCustFullName(custInfo["CUST_FNAME"]);
        params["ORG_INFO"]["ORG_BASIC_INFO"][0]["CUST_NAME"] = custInfo["CUST_NAME"]
        params["CUST_NAME"] = custInfo["CUST_NAME"]
        //需要把投资者类型 放到最外层作为影像过滤条件 机构户后面会 放，但是产品没有显示这个子弹所以要手动放还要强制为10
        params["PROF_INVESTOR_SOURCE"] = "10"

        //法人相关的影像 过滤条件
        // params["MOBILE_LEGAL_REP_TYPE"] = params["LEGAL_REP_TYPE"];
        // baseData["LEGAL_REP_TYPE"] = params["LEGAL_REP_TYPE"];

        let userInfo = _this.$storage.getJsonSession(_this.$definecfg.USER_INFO) || {};
        custInfo["INT_ORG"] = userInfo["ORG_CODE"];
        custInfo["ORG_FULL_NAME"] = userInfo["ORG_FULL_NAME"];
        custInfo["USER_TYPE"] = _this.userType;
        custInfo["USER_FNAME"] = custInfo["CUST_FNAME"];
        if (_this.userType == "1" || _this.userType == "2") {
            custInfo["CUST_ORG_NAME"] = userInfo["ORG_FULL_NAME"];
        }
        //一些客户的基础字段也要放到流水里的最外层
        params["CUST_ORG_CODE"] = params["CUST_ORG_CODE"] || userInfo["ORG_CODE"];
        params["ORG_FULL_NAME"] = params["ORG_FULL_NAME"] && userInfo["ORG_FULL_NAME"];
        params["USER_TYPE"] = "1";
        _this.$storage.setSession(_this.$definecfg.CUSTOMER_INFO, custInfo);
        //传生成的或者历史流水中复用的客户代码（CUST_CODE）
        if ("CUST_CODE" in _this.historyData || "CUST_CODE" in params) {
            params["CUST_CODE"] = _this.historyData["CUST_CODE"]; // 如果历史流水中有生成的客户代码，直接复用
            custInfo["CUST_CODE"] = _this.historyData["CUST_CODE"]; // 如果历史流水中有生成的客户代码，直接复用
        } else {
            let res = await openBizPubTools.getNewCustCode(_this);
            if (res.Code == "0") {
                params["CUST_CODE"] = res.Data && res.Data[0] && res.Data[0].USER_CODE || "";
                custInfo["CUST_CODE"] = res.Data && res.Data[0] && res.Data[0].USER_CODE || "";
                console.log("生成新的客户号", params["CUST_CODE"]);
            } else {
                console.error("生成客户号,接口报错", res.Msg);
                throw "生成客户号,接口报错" + res.Msg
            }
        }
        //中山个性化 传生成的或者历史流水中复用的合同编码（CUST_CODE）
        if (_this.$syscfg.isQSJG == "ZHONGSHAN") {
            if ("PRE_CONTRACT_SN" in _this.historyData || "PRE_CONTRACT_SN" in params) {
                params["PRE_CONTRACT_SN"] = _this.historyData["PRE_CONTRACT_SN"]; // 如果历史流水中有生成的客户代码，直接复用
            } else {
                let res = await openBizPubTools.getContractSN(_this);
                if (res.Code == "0") {
                    // 把合同编号存起来
                    let conNum = res.Data && res.Data[1];
                    _this.$storage.setSession(_this.$definecfg.CONTRACTNUM, conNum);
                    //更新导航栏的编号
                    _this.$store.commit(_this.$types.UPDATE_CONTRACT_NUM, conNum); // 更新流程节点
                    params["PRE_CONTRACT_SN"] = conNum;
                    console.log("获取到合同编号", res);
                } else {
                    console.error("生成合同编号 接口报错", res.Msg);
                    throw "生成合同编号接口报错-" + res.Msg
                }
            }
        }
    },
    /*
    *@method openBizProInfoNodeValidate
    *@desc 钩子函数 下一步验证
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    openBizProInfoNodeValidate: function (_this) {
        return true;
    },

    /*
    *@method openBizProInfoNodeGetData
    *@desc 拼接数据
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    openBizProInfoNodeGetData: function (_this, params) {
    },

    /*
    *@method openBizProInfoNodePageActivated
    *@desc 钩子函数：页面激活
    *@MethodAuthor  linsc
    *@Date: 2019-06-11 15:19:09
    */
    openBizProInfoNodePageActivated: function (_this, groupId) {
        console.log("openBizProInfoNodePageActivated")
        _this.groupDatas["ORG_INFO"]["ORG_LINK_INFO"][0]["FIELDS"]["OFFICE_ADDR"].FIELD_FUNCTION = "CHECK_OFFICE_ADDR";
        if (_this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"]) {
            _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0]["FIELDS"]["ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PRO"]
        }
        // 判断实际控制人  
        if (_this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"]) {
            _this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"][0]["FIELDS"]["CONTROLER_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"]
            //如果是广州 实际控制人显示邮箱 电话必填 如果是中山则隐藏邮箱 电话不必填
            if (_this.$syscfg.isQSJG(_this.$definecfg.QSJGDM_CONST.GUANGZHOU)) {
                _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_TEL.FIELD_REQUIRED = '1';
                _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_EMAIL.FIELD_CONTROL = '0';
            } else {
                _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_TEL.FIELD_REQUIRED = '0';
                _this.groupDatas.ORG_INFO.ORG_CONTROLER_INFO[0].FIELDS.CONTROLER_EMAIL.FIELD_CONTROL = '1';
            }
        }
        //判断实际操作人
        if (_this.groupDatas["ORG_INFO"]["ORG_ACTUAL_CONTROLER_INFO"]) {
            _this.groupDatas["ORG_INFO"]["ORG_ACTUAL_CONTROLER_INFO"][0]["FIELDS"]["CONTROLER_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"]
        }
        // 判断受益人所有人  
        if (_this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_INFO"]) {
            _this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_INFO"][0]["FIELDS"]["BENEFICIARY_ID_TYPE"].FIELD_DICT_FILTER = _this["oppBusiData"]["VALID_ID_TYPE_FOR_PERSON"]
        }
    },

    //----------------------业务函数----------------------------------/
    /**
    * openBizProInfoNodeLoadBizData 数据解析或回填
    * @param _this
    */
    openBizProInfoNodeLoadBizData: async function (_this, busiData) {
        if (!busiData) {
            return;
        }
        //由于涉税信息模块与控制人涉税信息模块 提交的数据结构与配置的字段结构不同，所以加载历史数据之前要先处理一下
        if ((_this.userType == "1" || _this.userType == "2") && busiData["RELA_INFO"] && busiData["RELA_INFO"]["ORG_TAX_INFO"]) {
            //还原机构户的客户涉税的子模块 税收居民国/地区模块信息
            let orgTaxInfo = _.cloneDeep(busiData["RELA_INFO"]["ORG_TAX_INFO"][0]);
            if (orgTaxInfo) {
                busiData["RELA_INFO"]["ORG_TAX_COUNTRY_INFO"] = transTaxInfoToArr(orgTaxInfo);
                busiData["RELA_INFO"]["TAX_ASSET_INFO"] = transTaxAssetInfoToArr(orgTaxInfo, _this);
                if (busiData["RELA_INFO"]["TAX_ASSET_INFO"].length == 0) {
                busiData["RELA_INFO"]["TAX_ASSET_INFO"].push({});
                }
                //手动还原资产信息第一个分组的 
                busiData["RELA_INFO"]["TAX_ASSET_INFO"][0]["MONAMNT"] = busiData["RELA_INFO"]["ORG_TAX_INFO"][0]["MONAMNT"]
                busiData["RELA_INFO"]["TAX_ASSET_INFO"][0]["CURR_CODE"] = busiData["RELA_INFO"]["ORG_TAX_INFO"][0]["CURR_CODE"]
            }
            //如果存在控制人涉税也要同样处理
            if (busiData["RELA_INFO"]["ORG_TAX_INFO"].length > 1) {
                //还原机构户的实际控制人涉税的子模块 税收居民国/地区模块信息
                let contrlOrgTaxCountryInfo = _.cloneDeep(busiData["RELA_INFO"]["ORG_TAX_INFO"][1]);
                busiData["RELA_INFO"]["CONTROL_ORG_TAX_INFO"] = [];
                busiData["RELA_INFO"]["CONTROL_ORG_TAX_INFO"].push(contrlOrgTaxCountryInfo);
                if (contrlOrgTaxCountryInfo) {
                let taxCountryInfo = transTaxInfoToArr(contrlOrgTaxCountryInfo);
                busiData["RELA_INFO"]["CONTROL_ORG_TAX_COUNTRY_INFO"] = taxCountryInfo;
                }
                //删掉多余数据
                busiData["RELA_INFO"]["ORG_TAX_INFO"].splice(1, 1);
            }
            //如果是移动平台 gk=“ARRP_INFO" 需要把涉税几个模块跟诚信记录从RELA_INFO分组移动到"APPR_INFO"里
            //复制适当性里的涉税信息和诚信记录到关联信息分组
            let modIds = ["ORG_TAX_INFO", "ORG_TAX_COUNTRY_INFO", "CONTROL_ORG_TAX_COUNTRY_INFO", "CONTROL_ORG_TAX_INFO", "CREDIT_RECORD_INFO", "TAX_ASSET_INFO"];
            if (busiData["RELA_INFO"]) {
                let relaInfos = busiData["RELA_INFO"];
                busiData[gk] = {}
                modIds.map(function (v) {
                    if (busiData["RELA_INFO"][v]) {
                        busiData[gk][v] = _.cloneDeep(busiData["RELA_INFO"][v]);
                        delete busiData["RELA_INFO"][v]
                    }
                });
            }
        }
        _this.historyData = Object.assign(_this.historyData, busiData);

        _this.oppBusiData.CUST_CODE = busiData.CUST_CODE;
        _this.oppBusiData.CUST_ORG_CODE = busiData.CUST_ORG_CODE;
        //加载流水
        let customerInfo = _this.$storage.getJsonSession(_this.$definecfg.CUSTOMER_INFO);
        //手动转换为VTM数据
        let custOtherInfo = {};
        let custOtherIdInfo = {}
        if (busiData.ORG_INFO && busiData.ORG_INFO.ORG_BASIC_INFO) {
            custOtherInfo = {
                CREDIT_TYPE: busiData.ORG_INFO.ORG_BASIC_INFO[0].CREDIT_TYPE, //诚信记录
                CREDIT_TYPE_EXP: busiData.ORG_INFO.ORG_BASIC_INFO[0].CREDIT_TYPE_EXP, //其他的诚信记录
                EDUCATION: busiData.ORG_INFO.ORG_BASIC_INFO[0].EDUCATION,
                INDUS_TYPE: busiData.ORG_INFO.ORG_BASIC_INFO[0].INDUS_TYPE,
                OCCU_TYPE: busiData.ORG_INFO.ORG_BASIC_INFO[0].OCCU_TYPE,
                POSITION: busiData.ORG_INFO.ORG_BASIC_INFO[0].POSITION,
                CITIZENSHIP: busiData.ORG_INFO.ORG_BASIC_INFO[0].CITIZENSHIP,
                NATIVE_PLACE: busiData.ORG_INFO.ORG_BASIC_INFO[0].NATIVE_PLACE,
                WORKPLACE: busiData.ORG_INFO.ORG_BASIC_INFO[0].WORKPLACE,//工作单位
                INOUTSIDE_IDENTITY: busiData.ORG_INFO.ORG_BASIC_INFO[0].INOUTSIDE_IDENTITY,//境内外标志
                SUBJECT_IDENTITY: busiData.ORG_INFO.ORG_BASIC_INFO[0].SUBJECT_IDENTITY,//主体身份
            }
            custOtherIdInfo = {
                OTHER_ID_TYPE: busiData.ORG_INFO.ORG_BASIC_INFO[0].OTHER_ID_TYPE, //辅助证件类型
                OTHER_ID_CODE: busiData.ORG_INFO.ORG_BASIC_INFO[0].OTHER_ID_CODE, //辅助证件号码
                OTHER_ID_EXP_DATE: busiData.ORG_INFO.ORG_BASIC_INFO[0].OTHER_ID_EXP_DATE,//辅助证件有效期
                OTHER_CUST_NAME: busiData.ORG_INFO.ORG_BASIC_INFO[0].OTHER_CUST_NAME//辅助证件姓名
            }
        }
        let custAcctInfo = {
            CUST_ORG_CODE: busiData.CUST_ORG_CODE || ""
        }
        let vtmData = {
            ORG_INFO: {
                CUST_OTHER_ID_INFO: [custOtherIdInfo],
                CUST_OTHER_INFO: [custOtherInfo],//其他信息模块
                CUST_ACCT_INFO: [custAcctInfo],//账户信息模块
            }
        }
        busiData = _.merge(busiData, vtmData)
        //账户信息模块
        if (busiData.RELA_INFO) {
            //根据实际控制人信息 自动回填 账户实际控制人字段是否为本人
            if (busiData.RELA_INFO && busiData.RELA_INFO.CUST_CONTROLLER_INFO && busiData.RELA_INFO.CUST_CONTROLLER_INFO[0]) {
                busiData.ORG_INFO.CUST_CONTROLLER_INFO = busiData.RELA_INFO.CUST_CONTROLLER_INFO
                busiData.ORG_INFO.CUST_CONTROLLER_INFO[0].IS_MYSELF = busiData.ORG_INFO.CUST_CONTROLLER_INFO[0].ASSOCIATE_NAME == busiData.ORG_INFO.ORG_BASIC_INFO[0].CUST_FNAME ? "1" : "0"
            }
            if (busiData.RELA_INFO && busiData.RELA_INFO.CUST_CONTROLLER_INFO && busiData.RELA_INFO.CUST_BENEFICIARY_INFO[0]) {
                busiData.ORG_INFO.CUST_BENEFICIARY_INFO = busiData.RELA_INFO.CUST_BENEFICIARY_INFO
                busiData.ORG_INFO.CUST_BENEFICIARY_INFO[0].IS_MYSELF = busiData.ORG_INFO.CUST_BENEFICIARY_INFO[0].BENEFICIARY_NAME == busiData.ORG_INFO.ORG_BASIC_INFO[0].CUST_FNAME ? "1" : "0"
            }
        }
        //保存数据到缓存
        if (busiData.ORG_INFO.ORG_BASIC_INFO[0].ID_TYPE == "00" || busiData.ORG_INFO.ORG_BASIC_INFO[0].ID_TYPE == "0s") {
            //身份证跟港澳台居住证，直接根据证件号码计算出生日期跟年龄
            let codeObject = _this.$blMethod.analyzeIDCard(busiData.ORG_INFO.ORG_BASIC_INFO[0].ID_CODE);
            _this.$blMethod.saveCustInfoTosession(_this, "AGE", codeObject.age);
            _this.$blMethod.saveCustInfoTosession(_this, "BIRTHDAY", codeObject.birthDay);
            _this.$blMethod.saveCustInfoTosession(_this, "SEX", codeObject.sex);
        } else if (busiData.ORG_INFO.ORG_BASIC_INFO[0].BIRTHDAY) {
            //其他证件 应该是需要选择出生日期的，根据出生日期计算年龄
            _this.$blMethod.saveCustInfoTosession(_this, "AGE", date.getDifferYears(busiData.ORG_INFO.ORG_BASIC_INFO[0].BIRTHDAY, date.getClientDate()))
        }
        let custFname = busiData.ORG_INFO.ORG_BASIC_INFO[0].CUST_FNAME
        //将数据保存到客户信息里
        busiData["CUST_CODE"] && _this.$blMethod.saveCustInfoTosession(_this, "CUST_CODE", busiData["CUST_CODE"])
        busiData["CUST_CODE"] && _this.$blMethod.saveCustInfoTosession(_this, "CUACCT_CODE", busiData["CUST_CODE"])
        busiData["CUACCT_CODE"] = busiData["CUST_CODE"]
        busiData.CUST_ORG_CODE && _this.$blMethod.saveCustInfoTosession(_this, "CUST_ORG_CODE", busiData["CUST_ORG_CODE"])
        busiData.CUST_ORG_CODE && _this.$blMethod.saveCustInfoTosession(_this, "INT_ORG", busiData["CUST_ORG_CODE"])
        busiData.CUST_ORG_NAME && _this.$blMethod.saveCustInfoTosession(_this, "CUST_ORG_NAME", busiData["CUST_ORG_NAME"])
        _this.$blMethod.saveCustInfoTosession(_this, "CUST_NAME", utils.cutCustFullName(custFname))
        //重新加载转换之后的历史数据
        _this.historyData = busiData;
        return this.openBizProInfoNodeParseOldBiz(_this, busiData)
    },

    /**
    * openBizProInfoNodeParseOldBiz 重新加载转换之后的历史数据
    * @param _this
    */
    openBizProInfoNodeParseOldBiz: function (_this, bdata) { // 解析身份证读卡数据
        console.log("openBizProInfoNodeParseOldBiz==========开始")
        for (let bk in bdata) {
            if (bk in _this.groupDatas) {
                let bd = bdata[bk];
                let md = _this.groupDatas[bk];
                for (let bdk in bd) {
                    if (bdk in md) {
                        let mdtpl = _.cloneDeep(md[bdk][0]);
                        mdtpl["MODULE_NUM"] = ""; //先清掉module_num
                        for (let i = 0; i < bd[bdk].length; i++) {
                            let bdd = bd[bdk][i];
                            let mdd = i < md[bdk].length ? md[bdk][i] : _.cloneDeep(mdtpl);
                            for (let fk in bdd) {
                                if (fk in mdd.FIELDS && bdd[fk] !== null) {
                                    //需要根据数据类型来赋值
                                    mdd["FIELDS"][fk]["DEFAULT_VALUE"] = (typeof (bdd[fk]) === 'object' && Object.prototype.toString.call(bdd[fk]) !== '[object Array]') ? bdd[fk]["newVal"] : bdd[fk];
                                    // 如果当前历史数据模块字段里面为null为删除模块，中断并过滤此模块
                                    if (mdd["FIELDS"][fk]["DEFAULT_VALUE"] === null) {
                                        mdd = null;
                                        break;
                                    }
                                } else if ("MODULE_NUM_FIELD" in mdd && fk === mdd["MODULE_NUM_FIELD"]) { // 多组数据，取出一柜通NUM字段值并赋值MODULE_NUM
                                    mdd["MODULE_NUM"] = bdd[fk];
                                }
                            }

                            if (i > 0 && mdd)
                                mdd.MODULE_SEQ = parseInt(mdd["MODULE_SEQ"]) + i + "";

                            // md[bdk][i] = mdd;
                            md[bdk][i] = mdd;
                        }
                        md[bdk] = _.filter(md[bdk], (item) => { return item !== null });
                    }
                }
            }
        }
        console.log("openBizProInfoNodeParseOldBiz==========结束")
    },
    //--------------------------------------------------检查逻辑--------------------------------------------------
    //证件号码的关联逻辑，检查黑名单和重复开户
    "CHECK_CUST_INFO": (_this, field, fieldData) => {
        //字段为空 或者 不是基础信息模块下的字段 不做校验
        if (field.DEFAULT_VALUE == "" || (["CUST_BASIC_INFO", "ORG_BASIC_INFO"].indexOf(field.MODULE_ID) == -1)) {
            return;
        }
        let code = field.DEFAULT_VALUE;
        let type = fieldData.ID_TYPE.DEFAULT_VALUE;
        let custName = fieldData.CUST_FNAME.DEFAULT_VALUE;
        if (code == "") {
            return;
        }
        openBizPubTools.checkBlackListAndRepeat(_this, code, type, custName, fieldData.CITIZENSHIP.DEFAULT_VALUE)
    },
    /**
        *【CHECK_ID_CODE】证件号码相关逻辑
        * a)证件类型为“身份证”时，根据号码自动计算出性别、出生日期，且为不可编辑状态，自动填充主体身份，可编辑
        * b)有效证明文件为18位或24位“工商营业执照”时，《重要信息》组中“组织机构代码证”及对应的“有效期”自动填充且不可编辑，其他的都可编辑
        * c)有效证明文件为18位或24位“工商营业执照”时，《重要信息》组中自动填充“国税登记号码”及“有效期”且不可编辑。若为15位账号，“组织机构代码证税务登记号码”由其手动录入，必填
        */
    "CHECK_ID_CODE": (_this, field, fieldData) => {
        //证件号码检查
        if (field.MODULE_ID == "ORG_BASIC_INFO") {
            _this.$blMethod.saveCustInfoTosession(_this, "ID_CODE", field.DEFAULT_VALUE);
            _this.oppBusiData["ID_CODE"] = field.DEFAULT_VALUE;
        }
    },
    /** 【CHECK_ID_TYPE】#证件类型@有效证明文件!有效证明文件：
        * a)为“身份证”和“临时身份证”时，境内外标志默认为“境内”，国籍默认为“中国”且不可编辑，民族必填
        * b)为“12-机关法人成立批文”时，主体身份默认为“普通”，机构类别默认“02-机关法人”，法人类别默认“内资企业法人”。社团法人和事业法人同理。
        * c)为“19-其他证件”时，机构类别可选项[字典过滤]：01-企业法人、02、03、04、05、09、21、22、23、24
        * d)为“境外有效商业证明文件”时注册国家需要客户选填，其他情况下为默认填充且不可更改。
        * e)如果客户年龄18以上70岁以下或16到18岁有劳动收入, 将证件类型填充到实际控制人的姓名
        * g)证件类型为身份证是，民族必填，其他为非必填
        */
    "CHECK_ID_TYPE": (_this, field, fieldData) => {
        //字段为空 或者 不是基础信息模块下的字段 不做校验
        if (field.DEFAULT_VALUE == "" || (["ORG_BASIC_INFO"].indexOf(field.MODULE_ID) == -1)) {
            return;
        }
        _this.$blMethod.saveCustInfoTosession(_this, "ID_TYPE", field.DEFAULT_VALUE)
        //给证件号码 动态设置校验规则
        openBizPubTools.filterIdCode(_this, field, fieldData["ID_CODE"], fieldData)
        //清空证件起始日期
        fieldData["ID_BEG_DATE"] && (fieldData["ID_BEG_DATE"].DEFAULT_VALUE = "");
        fieldData["ID_EXP_DATE"] && (fieldData["ID_EXP_DATE"].DEFAULT_VALUE = "");
        if (fieldData["CITIZENSHIP"] && field.DEFAULT_VALUE == "14") {
            fieldData["CITIZENSHIP"].DEFAULT_VALUE = "";
            fieldData["CITIZENSHIP"].FIELD_CONTROL = "0";
        }
        // 根据证件类型对主体身份、民族、国籍、法人类别、机构类别进行字典过滤
        if (_this.userType == "2") {
            let val = field.DEFAULT_VALUE;
            // 选择证件类型后，必须先清空关键信息数据，避免获取配置的时候筛选错误
            let tmpFields = ["CITIZENSHIP", "INOUTSIDE_IDENTITY", "PRO_CLS"];
            tmpFields.forEach((v) => {
                if (fieldData[v]) {
                    fieldData[v].DEFAULT_VALUE = "";
                }
            })
            fieldData["CITIZENSHIP"].FIELD_DICT_FILTER = [];
            //选择“境外商业注册登记证明或机构注册文件”类型开户的，境内外标示默认显示“境外”，其他证件默认为境内
            if (_.indexOf(["14", "19"], val) != -1) {//14境外 19其他
                fieldData["CITIZENSHIP"].FIELD_CONTROL = "0";
                if (val == "19") { // 其他证件，默认中国
                    fieldData["CITIZENSHIP"].DEFAULT_VALUE = "";
                } else {
                    // 过滤出不包含中国的国籍地区
                    var outDitizenshipData = _.map(_.filter(fieldData["CITIZENSHIP"].FIELD_DICT_NAME, function (v) {
                        return _.indexOf(["CHN"], v.DICT_ITEM) == -1;
                    }), "DICT_ITEM");
                    fieldData["CITIZENSHIP"].FIELD_DICT_FILTER = outDitizenshipData;
                    fieldData["INOUTSIDE_IDENTITY"].FIELD_DICT_FILTER = ["1"]
                    fieldData["INOUTSIDE_IDENTITY"].DEFAULT_VALUE = "1";
                }
            } else {
                fieldData["INOUTSIDE_IDENTITY"].FIELD_DICT_FILTER = ["0"]
                fieldData["INOUTSIDE_IDENTITY"].DEFAULT_VALUE = "0";
                fieldData["CITIZENSHIP"].DEFAULT_VALUE = "CHN";
                fieldData["CITIZENSHIP"].FIELD_CONTROL = "2"
            }
            // // 若展示了发证机关，需要根据所选择的证件类型控制是否必填
            // if (openBizPubTools.getBusiCommParam(_this, "SHOW_ID_ISS_AGCY_FIELDS") == "1") {
            //   fieldData["ID_ISS_AGCY"].FIELD_CONTROL =  val == "10" ? "1" :"0";
            // }
            //中山广州证券个性化：当选择的证件类型为“营业执照”时，证件号码需控制只允许输入18位的数字或字母
            // 过了配置的开户信息数据
            openBizPubTools.loadAcctOpenLogicData(_this, field, fieldData, tmpFields, _this.oppBusiData["allAcctOpenLogicData"]);
            return;
        }
        _this.oppBusiData["ID_TYPE"] = field.DEFAULT_VALUE;
    },
    /** 
        * CHECK_AML_CUST_TYPE#反洗钱客户类型
        */
    "CHECK_AML_CUST_TYPE": (_this, field, fieldData) => {
        let AML_CUST_TYPE = field.DEFAULT_VALUE;
        let beneficiaryType = [];
        switch (AML_CUST_TYPE) {//反洗钱客户类型
            case "2"://2-公司
                beneficiaryType = ["1", "2", "3"];
                break;
            case "3"://3-合伙企业
                beneficiaryType = ["4", "5", "6"];
                break;
            case "4"://4-个体工商户、个人独资企业、不具备法人资格的专业服务机构
            case "5"://5-经营农林渔牧产业的非公司制农民专业合作组织
            case "6"://6-受政府控制的企事业单位
                beneficiaryType = ["7"];
                break;
            case "7"://7-信托
                beneficiaryType = ["8"];
                break;
            case "8"://8-基金
                beneficiaryType = ["9", "a"];
                break;
            case "9"://9-其他金融产品
                beneficiaryType = ["b"];
                break;
            case "a"://a-其他类型的机构、组织
                beneficiaryType = ["!!"];
                break;
        }
        _this.groupDatas.ORG_INFO.ORG_BENEFICIARY_OWNER_INFO[0].FIELDS.BENEFICIARY_TYPE.FIELD_DICT_FILTER = beneficiaryType;

        // //基本信息中的“反洗钱客户类型”选择的是“1-特定客户-可不识别”，则不展示受益所有人信息
        // if (_this.oppBusiData["AML_FLAG"]) {
        //     let moduleControl = AML_CUST_TYPE == "1" ? "0" : "1"
        //     //产品户 受益所有人在基础信息分组下
        //     openBizPubTools.setModulesControl(_this, "ORG_INFO", "ORG_BENEFICIARY_OWNER_INFO", moduleControl)
        // }
    },
    /**
   * CHECK_NATIONAL_ATTR  国有属性
   */
    "CHECK_NATIONAL_ATTR": (_this, filed, fieldData) => {
        fieldData["CAPITAL_ATTR"].DEFAULT_VALUE = "";
        let dictKeys = [];
        fieldData["CAPITAL_ATTR"].FIELD_DICT_NAME.forEach((v) => {
            dictKeys.push(v.DICT_ITEM)
        })

        if (filed.DEFAULT_VALUE == "1" || filed.DEFAULT_VALUE == "2") {
            fieldData.CAPITAL_ATTR.FIELD_DICT_FILTER = _.filter(dictKeys, function (obj) { return obj == "1"; })
        } else if (filed.DEFAULT_VALUE == "3") {
            fieldData.CAPITAL_ATTR.FIELD_DICT_FILTER = _.filter(dictKeys, function (obj) { return obj != "3"; })
        } else {
            //全部显示
            fieldData.CAPITAL_ATTR.FIELD_DICT_FILTER = dictKeys;
        }
    },
    /**
    * 【CHECK_SUBJECT_IDENTITY】主体身份：
    */
    "CHECK_SUBJECT_IDENTITY": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "") {
            return;
        }
        let tmpFields = ["INOUTSIDE_IDENTITY", "TRADE", "PRO_CLS"];
        //过滤前 先清除字段的值
        tmpFields.forEach((v) => {
            if (fieldData[v]) {
                fieldData[v].DEFAULT_VALUE = "";
            }
        })
        //根据主体身份对法人类别、机构类别、行业类别进行字典过滤
        openBizPubTools.loadAcctOpenLogicData(_this, field, fieldData, tmpFields, _this.oppBusiData["allAcctOpenLogicData"]);
        _this.oppBusiData["SUBJECT_IDENTITY"] = field.DEFAULT_VALUE;
    },
    /**
     * 【CHECK_CUST_FNAME】客户全称
     */
    "CHECK_CUST_FNAME": (_this, field, fieldData) => {
        if (!field.DEFAULT_VALUE) {
            return
        }
        if (fieldData.CUST_NAME) {
            fieldData.CUST_NAME.DEFAULT_VALUE = utils.cutCustFullName(field.DEFAULT_VALUE);
        }
        _this.oppBusiData["CUST_FNAME"] = field.DEFAULT_VALUE;
        _this.oppBusiData["CUST_NAME"] = utils.cutCustFullName(field.DEFAULT_VALUE);
        //存到session里
        if (field.MODULE_ID == "ORG_BASIC_INFO") {
            _this.$blMethod.saveCustInfoTosession(_this, "CUST_FNAME", field.DEFAULT_VALUE)
            _this.$blMethod.saveCustInfoTosession(_this, "USER_FNAME", field.DEFAULT_VALUE)
            _this.$blMethod.saveCustInfoTosession(_this, "USER_TYPE", "2")
        }
    },
    /**
    * 【ID_EXP_DATE】证件结束日期
    */
    "CHECK_ID_EXP_DATE": (_this, field, fieldData) => {
        if (!field.DEFAULT_VALUE) {
            return;
        }
        if (date.compareDate(field.DEFAULT_VALUE, date.getClientDate()) == "-1") {
            _this.$blMethod.showMsgBox(_this, "证件已过期", function () {
                field.DEFAULT_VALUE = "";
            });
            _this.$blMethod.changeFieldError(field, false, "证件已过期")
        } else {
            let nowDate = new Date(),
                newValue = field.DEFAULT_VALUE,
                dataYear = nowDate.getFullYear(),
                dataMonth = (nowDate.getMonth() + 4) < 10 ? "0" + (nowDate.getMonth() + 4) : (nowDate.getMonth() + 4),
                dataString = dataYear + "" + dataMonth,
                cardExpDate = newValue.substring(0, 6),
                today = +newValue.substring(6, 8);
            if (cardExpDate && (+dataString) - (+cardExpDate) >= 0) {
                _this.$nextTick(() => {
                    _this.$blMethod.changeFieldError(field, true, "")
                })
                _this.$blMethod.showMsgBox(_this, "证件有效期不足三个月！")
            } else {
                //正常
                _this.$blMethod.changeFieldError(field, true, "")
            }
        }
        let idTypeVal = fieldData["ID_TYPE"].DEFAULT_VALUE,
            idCodeVal = fieldData["ID_CODE"].DEFAULT_VALUE,
            idExpDate = field.DEFAULT_VALUE,
            importfs = _this.groupDatas["MANAGER_INFO"]["PRO_MANAGER_IMPORT_INFO"][0]["FIELDS"];
        let orgExpdateField;
        orgExpdateField = importfs["PRO_MANAGER_ASSI_EXP"]
        if (_.indexOf(["10"], idTypeVal) !== -1 && idCodeVal.length === 18) {
            orgExpdateField.DEFAULT_VALUE = idExpDate;
            importfs["TAX_NO_EXP_DATE"].DEFAULT_VALUE = idExpDate;
            importfs["LAND_TAX_NO_EXP_DATE"].DEFAULT_VALUE = idExpDate;
        }
    },
    /**
     * 【CHECK_CUST_FNAME】客户全称
     */
    "CHECK_CUST_FNAME": (_this, field, fieldData) => {
        if (!field.DEFAULT_VALUE) {
            return
        }
        if (fieldData.CUST_NAME) {
            fieldData.CUST_NAME.DEFAULT_VALUE = utils.cutCustFullName(field.DEFAULT_VALUE);
        }
        _this.oppBusiData["CUST_FNAME"] = field.DEFAULT_VALUE;
        _this.oppBusiData["CUST_NAME"] = utils.cutCustFullName(field.DEFAULT_VALUE);
        //存到session里
        if (field.MODULE_ID == "ORG_BASIC_INFO") {
            _this.$blMethod.saveCustInfoTosession(_this, "CUST_FNAME", field.DEFAULT_VALUE)
            _this.$blMethod.saveCustInfoTosession(_this, "USER_FNAME", field.DEFAULT_VALUE)
            _this.$blMethod.saveCustInfoTosession(_this, "USER_TYPE", "1")
        }
    },
    /**
     * 【CHECK_CITIZENSHIP】税收居民国/地区
     */
    "CHECK_CITIZENSHIP": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE == "") {
            return;
        }
        if (field.MODULE_ID == "ORG_BASIC_INFO" && _this.groupDatas["ORG_INFO"] && _this.groupDatas["ORG_INFO"]["ORG_LINK_INFO"]) {
            let linkAddr = _this.groupDatas["ORG_INFO"]["ORG_LINK_INFO"][0].FIELDS.OFFICE_ADDR;
            linkAddr["showAddrSelector"] = field.DEFAULT_VALUE == "CHN" ? true : false;
            let linkTel = _this.groupDatas["ORG_INFO"]["ORG_LINK_INFO"][0].FIELDS.OFFICE_TEL;
            linkTel["telPhoneType"] = field.DEFAULT_VALUE == "CHN" ? 0 : 2;
            let FAX = _this.groupDatas["ORG_INFO"]["ORG_LINK_INFO"][0].FIELDS.FAX;
            FAX["telPhoneType"] = field.DEFAULT_VALUE == "CHN" ? 0 : 2;
            _this.$blMethod.saveCustInfoTosession(_this, "CITIZENSHIP", field.DEFAULT_VALUE)
        }
    },
    /*
     *@method CHECK_NORMAL_BUTTON__CLICK
     *@desc 普通按钮点击事件
     *@MethodAuthor  linsc
     *@Date: 2019-07-16 10:52:58
    */
    "CHECK_NORMAL_BUTTON__CLICK": (_this, field, fieldData) => {
        if (field.MODULE_ID == "CNY_BANK_INFO") {
            //执行银行模块对应的关联函数
            _this.busiLogic.CHECK_NORMAL_BUTTON__CLICK_BANK(_this, field, fieldData)
        }
    },
    /**
     * 【CONTROLER_RELATION】实际控制人信息-与本人关系
     *  如果选择本人, 填写本人信息，且不可编辑
     *  如果不是本人, 数据清空
     */
    // "CHECK_CONTROLER_RELATION": (_this, field, fieldData) => {
    //     //_this.busiLogic["CHECK_CONTROLER_ID_NO"](_this, fieldData["CONTROLER_ID_NO"], fieldData);
    // },

    /**
     * 【CHECK_CONTROLER_ID_TYPE】实际控制人证件类别：
     *  a)如果实际控制人证件类别是身份证、临时身份证，实际控制人证件号码的验证类型是身份证。
     */
    "CHECK_CONTROLER_ID_TYPE": (_this, field, fieldData) => {
        openBizPubTools.filterIdCode(_this, field, fieldData["CONTROLER_ID_NO"], fieldData)
        //如果 没有勾选与XXX信息保持一致 清空证件号码
        if ("MODULE_RADIO_BUTTON" in fieldData && fieldData["MODULE_RADIO_BUTTON"].DEFAULT_VALUE == "false") {
            fieldData["CONTROLER_ID_NO"].DEFAULT_VALUE = "";
        }
        if (field.MODULE_ID == "ORG_CONTROLER_INFO") {
            //产品户同步实际控制人信息到 账户实际操作人 产品受益人模块
            openBizPubTools.syncControlerInfo(_this);
            //受益所有人信息与实际控制代表信息一致
            let module1 = _this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"];
            let module2 = _this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
            openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
        }
    },
    /**
     * 【CONTROLER_ID_NO】实际控制人证件号码
     *  非本人时，实际控制人证件号码不能是本人证件号码
     *  实际控制人证件号码不能重复
     */
    "CHECK_CONTROLER_ID_NO": (_this, field, fieldData) => {
        let controlerInfo = _this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"];
        let formDataArr = [];
        // 实际控制人信息
        for (let i = 0; i < controlerInfo.length; i++) {
            formDataArr.push(controlerInfo[i]["FIELDS"]["CONTROLER_ID_NO"].DEFAULT_VALUE)
        }
        if (_.uniq(formDataArr).length < formDataArr.length) {
            field.correct = false;
            field.message = "实际控制人证件号码已经存在，不能重复添加！";
            return;
        } else {
            field.correct = true;
            field.showerr = false;
            field.message = "";
        }
        if (field.MODULE_ID == "ORG_CONTROLER_INFO") {
            //同步
            openBizPubTools.syncControlerInfo(_this);
            //受益所有人信息与实际控制代表信息一致
            let module1 = _this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"];
            let module2 = _this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
            openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
        }
    },

    /**
     * 【CHECK_CONTROLER_ID_EXP_DATE】实际控制人证件有效期
     */
    "CHECK_CONTROLER_ID_EXP_DATE": (_this, field, fieldData) => {
        if (field.MODULE_ID == "ORG_CONTROLER_INFO") {
            //同步
            openBizPubTools.syncControlerInfo(_this);
            //受益所有人信息与实际控制代表信息一致
            let module1 = _this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"];
            let module2 = _this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
            openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
        }
    },
    /**
     * 【CHECK_CONTROLER_TEL】实际控制人电话
     */
    "CHECK_CONTROLER_TEL": (_this, field, fieldData) => {
        if (field.MODULE_ID == "ORG_CONTROLER_INFO") {
            //同步
            openBizPubTools.syncControlerInfo(_this);
            //受益所有人信息与实际控制代表信息一致
            let module1 = _this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"];
            let module2 = _this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
            openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
        }
    },
    /**
     * 【CHECK_CONTROLER_NAME】实际控制人名称
     */
    "CHECK_CONTROLER_NAME": (_this, field, fieldData) => {
        if (field.MODULE_ID == "ORG_CONTROLER_INFO") {
            //同步
            openBizPubTools.syncControlerInfo(_this);
            //受益所有人信息与实际控制代表信息一致
            let module1 = _this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"];
            let module2 = _this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
            openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
        }
    },  /**
    * 【CHECK_BENEFICIARY_ID_TYPE】受益人证件类别：
    *  a)如果受益人证件类别是身份证、临时身份证，受益人证件号码的验证类型是身份证。
    */
    "CHECK_BENEFICIARY_ID_TYPE": (_this, field, fieldData) => {
        openBizPubTools.filterIdCode(_this, field, fieldData["BENEFICIARY_ID"], fieldData)
        //如果 没有勾选与XXX信息保持一致 清空证件号码
        if ("MODULE_RADIO_BUTTON" in fieldData && fieldData["MODULE_RADIO_BUTTON"].DEFAULT_VALUE == "false") {
            fieldData["BENEFICIARY_ID"].DEFAULT_VALUE = "";
        }
    },
    /**
     * 【BENEFICIARY_ID】受益人证件号码
     *  非本人时，受益人证件号码不能是本人证件号码
     *  受益人证件号码不能重复
     */
    "CHECK_BENEFICIARY_ID": (_this, field, fieldData) => {
        let moudleId = field.MODULE_ID; //增加模块ID 这里有可能是受益人和收益所有人 处理逻辑一样
        let beneficiaryInfo = _this.groupDatas["ORG_INFO"][moudleId];
        let formDataArr = [];
        // 受益人信息
        for (let i = 0; i < beneficiaryInfo.length; i++) {
            let benType = beneficiaryInfo[i]["FIELDS"]["BENEFICIARY_ID_TYPE"];
            let benId = beneficiaryInfo[i]["FIELDS"]["BENEFICIARY_ID"];
            formDataArr.push({ "ID_TYPE": benType.DEFAULT_VALUE, "ID_CODE": benId.DEFAULT_VALUE })
        }
        if (_.unionWith(formDataArr, function (item1, item2) { return item1["ID_TYPE"] == item2["ID_TYPE"] && item1["ID_CODE"] == item2["ID_CODE"] }).length < formDataArr.length) {
            field.correct = false;
            field.message = "同样的受益人证件类型和证件号码已经存在，不能重复添加！";
        } else {
            field.correct = true;
            field.showerr = false;
            field.message = "";
        }
    },
    /**
     * 【BENEFICIARY_TYPE】受益所有人类型
     */
    "CHECK_BENEFICIARY_TYPE": (_this, field, fieldData) => {
        // 若第一条信息的“受益所有人类型”发生变更，后需添加的多条数据该项信息需要进行联动修改
        console.log(field);
        console.log(fieldData);
        
    },
    /**
    * 【CHECK_INOUTSIDE_IDENTITY】境内外标识：
    *  a)为“境外”时不显示“组织机构代码证、国税登记证和地税登记证信息”。
    */
    "CHECK_INOUTSIDE_IDENTITY": (_this, field, fieldData) => {
        let tmpFields = ["OCCU_TYPE"];
        if (field.DEFAULT_VALUE == "") {
            return;
        }
        if (_this.userType == 0) {
        } else if (_this.userType == 1) {
            tmpFields = ["LEGAL_REP_TYPE", "SZORG_TYPE"]
            openBizPubTools.isShowOrgImportantDom(_this, field.DEFAULT_VALUE, fieldData.ID_TYPE.DEFAULT_VALUE, fieldData.ID_CODE.DEFAULT_VALUE);
        } else if (_this.userType == 2) {
            tmpFields = ["CITIZENSHIP", "PRO_CLS"];
        }
        //过滤前 先清除字段的值
        tmpFields.forEach((v) => {
            if (fieldData[v]) {
                fieldData[v].DEFAULT_VALUE = "";
            }
        })
        //根据主体身份对法人类别、机构类别、行业类别进行字典过滤
        openBizPubTools.loadAcctOpenLogicData(_this, field, fieldData, tmpFields, _this.oppBusiData["allAcctOpenLogicData"]);
        // if(_this.userType == "1"){
        //   let idTypeVal = fieldData.ID_TYPE.DEFAULT_VALUE;
        //   let idCodeVal = fieldData.ID_CODE.DEFAULT_VALUE;
        //   let inoutsideVal = fieldData.INOUTSIDE_IDENTITY.DEFAULT_VALUE;
        //   if (idCodeVal.length && (idTypeVal == "10" && idCodeVal.length != 18 || _.indexOf(["11", "12", "13"], idTypeVal) != -1 || "19" == idTypeVal && inoutsideVal == "0")) {
        //     let msg = "该身份证明文件未加载统一社会信用代码，请受理人员通过“全国企业信用信息公示系统”或“全国组织机构代码证管理中心—信息核查系统”核验该客户是否已换发加载统一社会信用代码的新版证照。如已换发新版证照，应要求其使用新版证照办理业务"
        //     if(_this.$basecfg.platform == "vtm"){
        //       _this.messageBox({
        //         hasMask:true,
        //         messageText: msg,
        //         confirmButtonText:'确定',
        //         typeMessage:'warn', 
        //         showMsgBox:true, 
        //       })
        //     }else{
        //       _this.$vux.alert.show({
        //         content: msg
        //       });
        //     }
        //   }
        // }
    },
    /**
     * 地址组件点击使用证件地址
     */
    "USE_ID_ADDRESS__CLICK": (_this, field, fieldData) => {
        if (_this.userType == "1" || _this.userType == "2") {
            if ("ID_ADDR" in _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0].FIELDS) {
                field.DEFAULT_VALUE = _this.groupDatas["ORG_INFO"]["ORG_BASIC_INFO"][0].FIELDS["ID_ADDR"].DEFAULT_VALUE;
            }
        }
        if (fieldData.ZIP_CODE && field.ZIP_CODE) {
            fieldData.ZIP_CODE.DEFAULT_VALUE = field.ZIP_CODE;
        }
    },
    // Z0035  点击添加模块按钮
    "addModule": (_this, moduleld, fieldData) => {
        //受益所有人可增加多条信息,数量上限由参数进行控制
        if(moduleld == 'ORG_BENEFICIARY_OWNER_INFO') {
            let MAX_BENEFICIARY = _this.oppBusiData.busiCommonParams['MAX_BENEFICIARY'];
            // 如果当前长度已经是最大人数，甚至超出上限， 则提示
            if(_this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_OWNER_INFO"].length >=  MAX_BENEFICIARY) {
                _this.$vux.alert.show({
                    content: "受益所有人数量超出上限"
                })
                return false;
            }else
                return true;
        }
        else if (moduleld == "CREDIT_RECORD_INFO") {
            //自定义 诚信记录 添加模块 检查逻辑
            if (fieldData.RECORD_SOURCE.DEFAULT_VALUE === "") {
                _this.$vux.alert.show({
                    content: "请填写完已有记录再添加！"
                })
                return false;
            } else {
                return true;
            }
        } else if (moduleld == "ORG_PARTNER_INFO") {
            //自定义 合伙人 添加模块 检查逻辑
            for (let fk in fieldData) {
                if (fieldData[fk] == "") {
                    _this.$vux.alert.show({
                        content: "请填写完整的合伙企业资料！"
                    })
                    return false;
                }
            }
            return true;
        }
        return true;
    },
    "addModuleFinished": (_this, moduleData) => {
        // 后续添加的“受益所有人类型”自动填充第一条受益所有人信息的选项，且置灰不可编辑
        if(moduleData.MODULE_ID == 'ORG_BENEFICIARY_OWNER_INFO') {
            moduleData.FIELDS.BENEFICIARY_TYPE = _.cloneDeep(_this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_OWNER_INFO"][0].FIELDS.BENEFICIARY_TYPE);
            moduleData.FIELDS.BENEFICIARY_TYPE.FIELD_CONTROL = '2';
        }
    },
    /**
     * 地址组件触发函数
     */
    "USE_ID_ADDRESS": (_this, field, fieldData) => {
        if (fieldData.ZIP_CODE && "ZIP_CODE" in field) {
            //如果正在加载历史流水数据不能清除
            fieldData.ZIP_CODE.DEFAULT_VALUE = field.ZIP_CODE;
        }
    },
    /**
     * 办公地址组件触发函数
     */
    "CHECK_OFFICE_ADDR": (_this, field, fieldData) => {
        if (fieldData.ZIP_CODE && "ZIP_CODE" in field) {
            //如果正在加载历史流水数据不能清除
            fieldData.ZIP_CODE.DEFAULT_VALUE = field.ZIP_CODE;
        }
    },
    /**
     * 与某个模块保持一致单选按钮
     */
    "CHECK_MODULE_RADIO": (_this, field, fieldData) => {
        if (field.DEFAULT_VALUE !== "true") {
            for (let fk in fieldData) {
                if (fk != "MODULE_RADIO_BUTTON") {
                    fieldData[fk].DEFAULT_VALUE = "";
                    fieldData[fk].FIELD_CONTROL = fieldData[fk].FIELD_CONTROL == "1" ? "1" : "0";
                }
            }
            return;
        }
        if (_this.userType == '2') {
            let modules = ["ORG_BENEFICIARY_INFO", "ORG_ACTUAL_CONTROLER_INFO"]
            if (modules.indexOf(field.MODULE_ID) != -1) {
                // 受益人信息，受益人所有人信息 实际操作人信息与实际控制人信息一致
                openBizPubTools.syncControlerInfo(_this);
            }
            if (field.MODULE_ID == "ORG_STOCKHOLDER_INFO") {
                //  控股股东信息与法人代表信息一致
                openBizPubTools.syncOrgLegalRepInfo(_this);
            }
            if (field.MODULE_ID == "ORG_BENEFICIARY_OWNER_INFO") {
                //受益所有人信息与实际控制代表信息一致
                let module1 = _this.groupDatas["ORG_INFO"]["ORG_CONTROLER_INFO"];
                let module2 = _this.groupDatas["ORG_INFO"]["ORG_BENEFICIARY_OWNER_INFO"];
                openBizPubTools.syncModule1Tomodule2(_this, module1, module2, "CONTROLER", "BENEFICIARY", [], [["CONTROLER_ID_NO", "BENEFICIARY_ID"], ["CONTROLER_ID_EXP_DATE", "BENEFICIARY_EXP_DATE"]]);
            }
        }
    },
    /**
     * 【CHECK_PRO_CLS】产品类别：
     * 
     */
    "CHECK_PRO_CLS": (_this, field, fieldData) => {
        if (_this.userType == "2" && field.MODULE_ID == "ORG_BASIC_INFO") {
            // 产品类别选择私募基金管理人 才显示私募基金管理人编码
            isShowPrivateFundManager(fieldData, field.DEFAULT_VALUE == "08");
        }
    },
    /**
     * 【CHECK_STRUCT_PRO_FLAG】是否结构化产品：
     *  1）选择是结构化产品 初始杠杆率 必填
     */
    "CHECK_STRUCT_PRO_FLAG": (_this, field, fieldData) => {
        if (_this.userType == "2" && field.MODULE_ID == "ORG_BASIC_INFO") {
            fieldData["INIT_LEVERAGE"].FIELD_REQUIRED = field.DEFAULT_VALUE == "1" ? "1" : "0"
        }
    },
}