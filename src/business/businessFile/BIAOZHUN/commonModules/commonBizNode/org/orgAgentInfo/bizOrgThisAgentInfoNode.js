/*
 *   本次业务办理信息
 *   方法封装
 *   @author  yangyp
 */

import bizPublicMethod from "../../../../../../../business/businessTools/bizPublicMethod.js"
import bizPublicSaveMethod from "../../../../../../businessTools/bizPublicSaveMethod.js"

const fieldInit = function(_this) {
    let loginTypeInfo =  _this.$storage.getJsonSession(_this.$definecfg.LOGIN_TYPE_INFO);
    // 授权方式 为代理人的时候是必填项
    _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_DELEGATE"].FIELD_REQUIRED = "0";

    if(loginTypeInfo && loginTypeInfo.region == "0"){
        //法定代表人
        _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_TYPE.FIELD_CONTROL = "2";
        _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_DELEGATE.FIELD_CONTROL = "2";
        _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_NAME.FIELD_CONTROL = "2";
    }else if(loginTypeInfo && loginTypeInfo.region == "1"){
        //代理人
        if(loginTypeInfo.agentNum == "新增代理人"){
            _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_TYPE"].FIELD_CONTROL = "2";
            _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_NAME"].FIELD_CONTROL = "2";
            _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_DELEGATE"].FIELD_CONTROL = "0";

            _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_DELEGATE"].FIELD_REQUIRED = "1";
        }else{
            _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_TYPE"].FIELD_CONTROL = "2";
            _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_NAME"].FIELD_CONTROL = "2";
            _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_DELEGATE"].FIELD_CONTROL = "0";
            _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_DELEGATE"].FIELD_REQUIRED = "1";
        }
    }else{ 
        _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_TYPE"].FIELD_CONTROL = "0";
        _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_NAME"].FIELD_CONTROL = "2";
        _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_DELEGATE"].FIELD_CONTROL = "2";
        _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_TYPE.FIELD_REQUIRED = "1";
        _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_TYPE.FIELD_FUNCTION = "CHECK_OPEN_AGENT_TYPE"
        let dictItem = _.map(_this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_TYPE.FIELD_DICT_NAME, 'DICT_ITEM')
        _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_TYPE.FIELD_DICT_FILTER = _.filter(dictItem, function(item) {
            return item != '2'
        })
    }
}
export default {
    //----------------------------------钩子函数----------------------//
    /*
     *@method bizOrgThisAgentInfoNodeBeforeLoadBiz
     *@desc 钩子函数 加载历史数据之前触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgThisAgentInfoNodeBeforeLoadBiz: function (_this) {
        this.bizOrgThisAgentInfoNodeLoadBizData(_this, _this.oppBusiData.oldBusiData)
    },
    /*
     *@method bizOrgThisAgentInfoNodeAfterLoadBiz
     *@desc  钩子函数  加载历史数据后触发
     *@MethodAuthor  yangyp
     *@Date: 2019-06-13 09:42:56
     */
    bizOrgThisAgentInfoNodeAfterLoadBiz: function (_this) {
        //重新解析历史数据
        this.bizOrgThisAgentInfoNodeLoadBizData(_this, _this.oppBusiData.newBusiData)
    },
    /*
     *@method bizOrgThisAgentInfoNodeBeforeSave
     *@desc 钩子函数 自定义保存数
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgThisAgentInfoNodeBeforeSave: function (_this, params) {
        //数据保存
        let obj1 = {}, 
            obj2 = {};
        bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.ORG_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS, obj1); // 将数据转换为Object
        bizPublicMethod.$blMethod.changeObjKeys(_this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS, obj2); // 将数据转换为Object
        let obj = Object.assign({}, obj1, obj2);
        if(obj2.AGENT_TYPE && obj2.AGENT_TYPE=="1") {
            params.THIS_AGENT_INFO = Object.assign({}, obj1, {
                AGENT_TYPE : obj2.AGENT_TYPE || "",
                AGENT_DELEGATE: obj2.AGENT_DELEGATE|| "",
                AGENT_NAME: obj2.AGENT_NAME || ""
            })
        }else {
            params.THIS_AGENT_INFO = Object.assign({}, {
                AGENT_TYPE : obj2.AGENT_TYPE || "",
                USER_CODE: "",
                AGENT_DELEGATE: ""
            })
        }
        if(_this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_TYPE.DEFAULT_VALUE == "0") {
            params.AGENT_INFO = [];
        }
    },
    /*
     *@method bizOrgThisAgentInfoNodeValidate
     *@desc 钩子函数 下一步验证
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgThisAgentInfoNodeValidate: function (_this) {
       
    },

    /*
     *@method bizOrgThisAgentInfoNodeGetData
     *@desc 拼接数据
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgThisAgentInfoNodeGetData: function (_this, params) {
      
    },

    /*
     *@method bizOrgThisAgentInfoNodePageActivated
     *@desc 钩子函数：页面激活
     *@MethodAuthor  yangyp
     *@Date: 2019-06-11 15:19:09
     */
    bizOrgThisAgentInfoNodePageActivated: function (_this, groupId) {
        fieldInit(_this);
        if(_this.moduleId.indexOf("THIS_AGENT_INFO") != -1){
            let loginTypeInfo =  _this.$storage.getJsonSession(_this.$definecfg.LOGIN_TYPE_INFO);
            if(loginTypeInfo && loginTypeInfo.region == "1"){
                _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_NAME"].DEFAULT_VALUE = _this.groupDatas["ORG_AGENT_INFO"]["CUST_AGENT_INFO"]["0"]["FIELDS"]["USER_NAME"].DEFAULT_VALUE;
            }
        }
    },

    bizOrgThisAgentInfoNodeGetCustInfo: function (_this, groupId) {},

    /**
     * bizOrgThisAgentInfoNodeLoadBizData 数据解析或回填
     * @param _this
     */
    bizOrgThisAgentInfoNodeLoadBizData: async function (_this, busiData) {
        if (!busiData || _.isEmpty(busiData)) {
            return;
        }
        let loginTypeInfo =  _this.$storage.getJsonSession(_this.$definecfg.LOGIN_TYPE_INFO);
        _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_DELEGATE"].FIELD_REQUIRED = "0";
 
        if(loginTypeInfo && loginTypeInfo.region == "0"){
            //法定代表人
            _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_TYPE.DEFAULT_VALUE = loginTypeInfo.region;
        }else if(loginTypeInfo && loginTypeInfo.region == "1"){
            //代理人
            if(loginTypeInfo.agentNum == "新增代理人"){
                _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_TYPE"].DEFAULT_VALUE = "1";
                _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_DELEGATE"].DEFAULT_VALUE = busiData && busiData.THIS_AGENT_INFO && busiData.THIS_AGENT_INFO.AGENT_DELEGATE
            }else{
                _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_TYPE"].DEFAULT_VALUE = "1";
                _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_NAME"].DEFAULT_VALUE = busiData.THIS_AGENT_INFO && busiData.THIS_AGENT_INFO.USER_NAME || "";
                _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_DELEGATE"].DEFAULT_VALUE = busiData.THIS_AGENT_INFO && busiData.THIS_AGENT_INFO.AGENT_DELEGATE || "";
            }
        }else{ 
            _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_TYPE"].DEFAULT_VALUE = busiData.THIS_AGENT_INFO && busiData.THIS_AGENT_INFO.AGENT_TYPE || "";
            _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_DELEGATE"].DEFAULT_VALUE = busiData.THIS_AGENT_INFO && busiData.THIS_AGENT_INFO.AGENT_DELEGATE || "";
            _this.groupDatas["ORG_AGENT_INFO"]["THIS_AGENT_INFO"]["0"]["FIELDS"]["AGENT_NAME"].DEFAULT_VALUE = busiData.THIS_AGENT_INFO && busiData.THIS_AGENT_INFO.AGENT_NAME || "";
        }
    },
    bizOrgThisAgentInfoNodePreValidate: function(_this) {
        if(_this.userType == "1") {
            // _this.$router.goRoute("控制人涉税声明信息");
            _this.$router.replace({ path: '/bizFlow/V9998/1/baseInfoNode/bizPage/V9998_controlTaxInfoNode' });
        }
        // if(_this.groupDatas.ORG_AGENT_INFO.CUST_AGENT_INFO[0].MODULE_CONTROL == "0"){
        //     _this.$router.goRoute("联系信息");
        // }
    },
    "CHECK_OPEN_AGENT_TYPE":(_this, field, fieldData) => {
        _this.$refs.flowTip.flowTips = [];
        // 当代理人资料模块隐藏 
        if(field.DEFAULT_VALUE != "1"){
            // TODO 否则不进行展示，清除 代理人资料模块的内容 并隐藏代理人资料模块
            _this.groupDatas.ORG_AGENT_INFO.CUST_AGENT_INFO[0].MODULE_CONTROL = "0";
            _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_DELEGATE.DEFAULT_VALUE = "";
            _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_DELEGATE.FIELD_CONTROL = "2";
            // 非代理人 为非必填
            _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_DELEGATE.FIELD_REQUIRED = "0";

            _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_NAME.DEFAULT_VALUE = "";

            let fieldDataAgentInfo = _this.groupDatas.ORG_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS;
            for(let field in fieldDataAgentInfo) {
                fieldDataAgentInfo[field].DEFAULT_VALUE = "";
                if (fieldDataAgentInfo[field].VALID_TYPE.indexOf('prompt')) {
                    fieldDataAgentInfo[field].promptValue = "";
                }
            }
            _this.oppBusiData.currentAgentMobile = "";
            _this.oppBusiData.agentValid && (_this.oppBusiData.agentValid.msg_valid_switch == "1" || _this.oppBusiData.agentValid.msg_valid_switch == "2") && _this.$set(fieldDataAgentInfo.MOBILE_TEL,'SUFFIX_ICON',"el-icon-warning red");
        }else{
            if(field.DEFAULT_VALUE != ""){
                _this.groupDatas.ORG_AGENT_INFO.CUST_AGENT_INFO[0].MODULE_CONTROL = "1";
                _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_DELEGATE.FIELD_CONTROL = "0";
                // 为代理人时为必填
                _this.groupDatas.ORG_AGENT_INFO.THIS_AGENT_INFO[0].FIELDS.AGENT_DELEGATE.FIELD_REQUIRED = "1";
                _this.pushFlowTip({
                    title:"★新增代理人信息需和实际办理业务的代理人一致",
                    key:'US1',
                    // type:'warning'
                    type:'warning'
                })
                if (_this.userType == '0') {
                    _this.pushFlowTip({
                        title:"★此处仅能新增公证授权代理人，非公证授权代理人需使用非组合业务添加非公证授权代理人（自然人）菜单进行操作",
                        key:'US2',
                        // type:'warning'
                        type:'warning'
                    })
                }
                _this.pushFlowTip({
                    title:"★如果修改为其他代理人，该笔业务所有影像均需要重新采集",
                    key:'US3',
                    // type:'warning'
                    type:'warning'
                })
            }
            if(field.DEFAULT_VALUE == "1" &&  !_this.groupDatas.ORG_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE.length) {
                _this.groupDatas.ORG_AGENT_INFO.CUST_AGENT_INFO[0].FIELDS.CITIZENSHIP.DEFAULT_VALUE = "CHN";
            }
        }
    }
}
