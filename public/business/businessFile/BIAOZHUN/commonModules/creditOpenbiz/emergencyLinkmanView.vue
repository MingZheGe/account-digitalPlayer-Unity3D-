/**
* 业务代码：V0024
* 业务名称：关联人信息模块--紧急联系人信息
* @author tsy
* @date 2021-08-04
*/
<template>
    <div class="V0024-emergency-linkman">
        <kui-fieldset :options="{title:'紧急联系人信息',theme:'concise'}">
            <div class="linkman-info-box" v-for="(linkManInfo,index) in emergencyLinkInfoList" :key="index">

                <kui-form :ref="'linkmanForm'+ index" class="linkman-info-form-wrap">
                    <kui-textinput :ref="'CRITICALER_NAME'+index" :options="{title:'姓名',labelWidth:200,width:400,required:true,field:'CRITICALER_NAME',validType:'length[4,128]'}" />
                    <kui-textinput :ref="'MOBILE_TEL'+index" :options="{title:'手机',labelWidth:200,width:400,required:true,field:'MOBILE_TEL',validType:'mobileortel'}" />
                    <!-- <kui-combobox :ref="'RELAKIND_COMM'+index" :options="{title:'联系人类别',labelWidth:200,width:400,required:true,field:'RELAKIND_COMM',dict:'RELAKIND_COMM'}" />-->
                    <kui-combobox :ref="'ID_TYPE'+index" :options="{title:'证件类型',labelWidth:200,width:400,required:true,field:'ID_TYPE',dict:'ID_TYPE', loadFilter: loadFilter}" />
                    <kui-textinput :ref="'ID_CODE'+index" :options="{title:'证件号码',labelWidth:200,width:400,required:true,field:'ID_CODE'}" /> 
                    <div class="linkman-info-btn" v-if="emergencyLinkInfoList.length > 1">
                        <img :src="require('@icons/yinheVTM/icon-area-del-normal.svg')" @click="removeEmergencyLinkInfoHandler(index)">
                    </div>
                </kui-form>

            </div>
            <div class="add-bank-info" v-if="emergencyLinkInfoList.length < maxEmergencyLinkMan">
                <span class='add-bank-text' @click="addEmergencyLinkInfoHandler"><i class='el-icon-circle-plus-outline' />添加联系人信息</span>
            </div>
        </kui-fieldset>
    </div>
</template>

<script>
export default {
    name: "v0024EmergencyLinkman",
    data() {
        return {
            emergencyLinkInfoList: []
        };
    },
    components: {

    },
    props: ['bizData', 'historyData', 'oppBusiData', 'groupDatas', 'busiCode'],
    mounted() {
        this.initDomLinkManInfo();
        this.show();
    },
    computed: {
        maxEmergencyLinkMan() {
            return parseInt(this.oppBusiData.MAX_EMERGENCY_LINKMAN || 3) || 3
        },
        customerInfo() {
            return this.$storage.getJsonSession(this.$definecfg.CUSTOMER_INFO) || {}
        },
        validateCustName() {
            return this.customerInfo.CUST_NAME;
        },
        validateCustFname() {
            return this.customerInfo.CUST_FNAME;
        },
        validateCustMobiletel() {
            return this.customerInfo.MOBILE_TEL;
        }
    },
    watch: {
        emergencyLinkInfoList(val) {
            this.$nextTick(() => {
                this.bindEvents()
            })
        }
    },
    methods: {
        loadFilter(data) {
            return _.filter(data, (item) => {
                return "0" == item.DICT_ITEM.charAt(0);
            })
        },
        show() {
            this.setData();
        },
        bindEvents() {
            let that = this;

            _.each(that.emergencyLinkInfoList, (obj, index) => {
                var $CRITICALER_NAME_REFS = that.$refs["CRITICALER_NAME" + index] && that.$refs["CRITICALER_NAME" + index][0];
                var $MOBILE_TEL_REFS = that.$refs["MOBILE_TEL" + index] && that.$refs["MOBILE_TEL" + index][0];
                var $ID_TYPE = that.$refs["ID_TYPE" + index] && that.$refs["ID_TYPE" + index][0];
                var $ID_CODE = that.$refs["ID_CODE" + index] && that.$refs["ID_CODE" + index][0];
                $CRITICALER_NAME_REFS && $CRITICALER_NAME_REFS.textinput({
                    onBlur(value) {
                        let emergencyLinkInfoListDom = that.getDomData();
                        var sameLinkManNameList = _.filter(emergencyLinkInfoListDom, obj => {
                            return obj.MOBILE_TEL == $MOBILE_TEL_REFS.textinput("getValue") && obj.CRITICALER_NAME == value;
                        });
                        if (value && sameLinkManNameList.length >= 2) {
                            $MOBILE_TEL_REFS && $MOBILE_TEL_REFS.textinput("showTips", "不允许添加相同重复的联系人信息").textinput("clear");
                            $MOBILE_TEL_REFS && $CRITICALER_NAME_REFS.textinput("showTips", "不允许添加相同重复的联系人信息").textinput("clear");
                            return false;
                        }
                        // if (value === that.validateCustName || value === that.validateCustFname) {
                        //     $CRITICALER_NAME_REFS && $CRITICALER_NAME_REFS.textinput("showTips", "紧急联系人信息的姓名不能是您本人的姓名！").textinput("clear")
                        //     return false;
                        // }

                    }
                })
                $ID_TYPE && $ID_TYPE.combobox({
                    onChange(value) {
                        if (value === "00") {
                            $ID_CODE && $ID_CODE.textinput("changeValid", "cardno[true]");
                        } else {
                            $ID_CODE && $ID_CODE.textinput("changeValid", "address[0,48]");
                        }
                    }
                })
                $ID_CODE && $ID_CODE.textinput({
                    onBlur(value) {
                        let emergencyLinkInfoListDom = that.getDomData();
                        var sameIdCodeList = _.filter(emergencyLinkInfoListDom, obj => {
                            return obj.ID_CODE == value;
                        });
                        if (value && sameIdCodeList.length >= 2) {
                            $ID_CODE && $ID_CODE.textinput("showTips", "紧急联系人证件号码已经存在，不能重复添加").textinput("clear");
                            return false;
                        }
                    }
                })
            })

            _.each(that.emergencyLinkInfoList, (obj, index) => {
                var $MOBILE_TEL_REFS = that.$refs["MOBILE_TEL" + index] && that.$refs["MOBILE_TEL" + index][0];
                var $CRITICALER_NAME_REFS = that.$refs["CRITICALER_NAME" + index] && that.$refs["CRITICALER_NAME" + index][0];
                $MOBILE_TEL_REFS && $MOBILE_TEL_REFS.textinput({
                    onBlur(value) {
                        let emergencyLinkInfoListDom = that.getDomData();
                        var sameLinkManNameList = _.filter(emergencyLinkInfoListDom, obj => {
                            return obj.MOBILE_TEL == value && obj.CRITICALER_NAME == $CRITICALER_NAME_REFS.textinput("getValue");
                        });
                        if (value && sameLinkManNameList.length >= 2) {
                            $MOBILE_TEL_REFS && $MOBILE_TEL_REFS.textinput("showTips", "不允许添加相同重复的联系人信息").textinput("clear");
                            $MOBILE_TEL_REFS && $CRITICALER_NAME_REFS.textinput("showTips", "不允许添加相同重复的联系人信息").textinput("clear");
                            return false;
                        }

                        if (value === that.validateCustMobiletel) {
                            $MOBILE_TEL_REFS && $MOBILE_TEL_REFS.textinput("showTips", "联系人手机不能与您本人的手机一致").textinput("clear")
                            return false;
                        }
                    }
                })
            })
        },
        setData() {
            if (this.historyData.QUOTA_INFO && this.historyData.QUOTA_INFO.EMERGENCY_INFO && !_.isEmpty(this.historyData.QUOTA_INFO.EMERGENCY_INFO)) {
                this.emergencyLinkInfoList = _.filter(this.historyData.QUOTA_INFO.EMERGENCY_INFO, obj => obj.OPER_TYPE !== "2");
            } else if (!_.isEmpty(this.oppBusiData.EMERGENCY_INFO)) {

                this.emergencyLinkInfoList = _.map(this.oppBusiData.EMERGENCY_INFO, obj => {
                    return Object.assign({}, obj)
                });
            }
            this.$nextTick(() => {
                _.each(this.emergencyLinkInfoList, (obj, index) => {
                    this.$refs["linkmanForm" + index] && this.$refs["linkmanForm" + index][0].form("loadData", obj)
                })
            })
        },
        initDomLinkManInfo() {
            this.emergencyLinkInfoList.push(this.getEmptyLinkManInfo())
        },
        getEmptyLinkManInfo() {
            return {
                CRITICALER_NAME: "",
                MOBILE_TEL: ""
            }
        },
        addEmergencyLinkInfoHandler() {
            if (this.emergencyLinkInfoList.length >= this.maxEmergencyLinkMan) {
                that.dialog({
                    hasMask: true,
                    messageText: "最多只能添加 " + this.maxEmergencyLinkMan + " 个紧急联系人信息",
                    confirmButtonText: '确定'
                });
                return;
            }

            return this.validateDomForm().then((flag) => {
                if (flag == false) {
                    that.dialog({
                        hasMask: true,
                        messageText: '请先完善已有记录信息再添加！',
                        confirmButtonText: '确定'
                    });
                    return;
                }
                this.initDomLinkManInfo()
            })
        },
        removeEmergencyLinkInfoHandler(index) {
            var that = this;
            that.dialog({
                hasMask: true,
                messageText: "确认是否删除此条紧急联系人信息？",
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                confirmedAction: function () {
                    that.$delete(that.emergencyLinkInfoList, index)
                },
                canceledAction: function () {
                }
            });
        },
        validateDomForm() {
            var syncValidateFunc = [];
            var that = this;
            _.each(that.emergencyLinkInfoList, (obj, index) => {
                var linkmanForm = that.$refs["linkmanForm" + index] && that.$refs["linkmanForm" + index][0];
                linkmanForm && syncValidateFunc.push(linkmanForm.form("validate"));
            })
            return Promise.all(syncValidateFunc).then((flags) => {
                if (_.includes(flags, false)) {
                    return false;
                }
            })
        },
        validate() {
            let that = this;
            console.log("进来emergencyLinkmanViewRef----》");
            return that.validateDomForm().then(flag => {
                if (flag === false) {
                    return false;
                }
                var linkmanInfoData = that.getDomData();
                var domLinkManNameList = _.chain(linkmanInfoData).map("CRITICALER_NAME").uniq().value();
                var domLinkManMobileList = _.chain(linkmanInfoData).map("MOBILE_TEL").uniq().value();

                if (domLinkManNameList.length < linkmanInfoData.length || domLinkManMobileList.length < linkmanInfoData.length) {
                    that.dialog({
                        hasMask: true,
                        messageText: '紧急联系人信息有重复记录，请删掉重复记录。',
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                return true;
            })
        },

        getChangeOtherLinkInfo(newDataArr, oldDataArr) {
            var changeResultArr = [];
            _.each(newDataArr, (newData) => {
                var curOldOtherLinkInfo = _.find(oldDataArr, obj => obj.CRITICALER_NAME == newData.CRITICALER_NAME);
                if (newData.CRITICALER_ID) {
                    newData.OPER_TYPE = _.chain(oldDataArr).find(obj => obj.CRITICALER_ID == newData.CRITICALER_ID).pick(_.keys(newData)).isEqual(newData).value() ? "3" : "1";
                } else if (!!curOldOtherLinkInfo) {
                    newData.CRITICALER_ID = curOldOtherLinkInfo.CRITICALER_ID;
                    newData.OPER_TYPE = _.chain(oldDataArr).find(obj => obj.CRITICALER_ID == newData.CRITICALER_ID).pick(_.keys(newData)).isEqual(newData).value() ? "3" : "1"
                } else {
                    newData.OPER_TYPE = "0"
                }
                changeResultArr.push(newData)
            })
            _.each(oldDataArr, obj => {
                if (!_.find(newDataArr, newObj => newObj.CRITICALER_ID ? (newObj.CRITICALER_ID == obj.CRITICALER_ID) : newObj.CRITICALER_NAME == obj.CRITICALER_NAME)) {
                    changeResultArr.push(Object.assign({}, obj, {
                        OPER_TYPE: "2"
                    }))
                }
            });
            return changeResultArr;

        },
        getDomData() {
            var emergencyLinkInfoListDom = [];
            var that = this;
            _.each(that.emergencyLinkInfoList, (obj, index) => {
                var linkInfoData = that.$refs["linkmanForm" + index] && that.$refs["linkmanForm" + index][0].form("getData")
                linkInfoData && emergencyLinkInfoListDom.push(_.extend({}, linkInfoData, { CRITICALER_ID: "", RELAKIND_COMM: "" }));
            })
            return emergencyLinkInfoListDom;
        },
        getData() {
            let that = this, params = {};
            let emergencyLinkInfoListDom = that.getDomData();

            var changeOtherLinkInfo = that.getChangeOtherLinkInfo(emergencyLinkInfoListDom, (that.oppBusiData.EMERGENCY_INFO || []));

            Object.assign(params, {
                EMERGENCY_INFO: changeOtherLinkInfo
            });
            return params;
        }
    }
}
</script>

<style lang="less" >
.V0024-emergency-linkman {
    .kui-fieldset .fieldset-legend .fieldset-legend-title {
        width: 281px;
        height: 35px;
        font-family: Alibaba PuHuiTi;
        font-weight: 500;
        color: #1f59db;
        font-size: 26px;
    }

    .linkman-info-box {
        // position: relative;
        &:last-child {
            border-bottom: none;
        }

        .linkman-info-form-wrap {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            width: 1416px;
            height: 154px;
            background-color: #f7f7fa;
            border-radius: 4px;
            margin-bottom: 20px;

            padding-top: 10px;
            padding-bottom: 10px;
            .kui-textinput-wrap {
                .kui-textinput-title {
                    width: 118px;
                    height: 33px;
                    font-family: Alibaba PuHuiTi;
                    color: #252525;
                    font-size: 24px;
                    //line-height: 68px;
                    text-align: right;
                }
            }
        }
    }

    .add-bank-info {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 1416px;
        height: 60px;
        background-color: #f8faff;
        border: 1px solid #bed0ff;
        border-radius: 4px;
        box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.03);
        .add-bank-text {
            display: flex;
            align-items: center;
            width: 250px;
            height: 35px;
            font-family: Alibaba PuHuiTi;
            color: #3b6aff;
            font-size: 26px;
        }
    }
    &:first-child {
        margin-top: 0px;
    }
}
</style>
