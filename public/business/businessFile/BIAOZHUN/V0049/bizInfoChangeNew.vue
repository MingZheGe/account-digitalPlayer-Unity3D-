<template>
  <el-container class="bizInfoChange-page">
    <el-main class="changeinfo-contrainer">
      <template>
        <div class='infochange-table-List'>
          <div class = "table-title">请确认本次修改的内容</div>
          <div class="infochanged-table">
            <el-table :data="changeDataArr" class="table-box" style="width: 100%" :row-class-name="tableRowClassName">
              <el-table-column prop="title" align="left" label="" class-name="fields-column" width="260"></el-table-column>
              <el-table-column prop="oldVal"  align="left" class-name="old-value-column" width="540" label="修改前"></el-table-column>
              <el-table-column prop="newVal"  align="left" class-name="new-value-column" width="540" label="修改后"></el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </el-main>
  </el-container>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      changeDataArr: [],
      changeDataArr1:[]
    };
  },
  created() {
    this.getchangeDiff();
  },
  activated () {
    this.getchangeDiff();
  },
  deactivated() {
    console.log("deactivated")
  },
  props: ["bizData", "historyData", "oppBusiData","groupDatas"],
  computed: {
    busiCode() {
      return this.$store.state.busicode;
    },
    userType() { // 用户类型 0个人/1机构/2产品
      return this.$store.state.usertype;
    },
    /**
     * @computed {Object} qsVersionName 券商机构名称
     */
    qsVersionName(){
       return this.$bizcfg.getBizConfigName(this.$definecfg.QSJGDM_CONST[this.$basecfg.qsVersion]);
    },

    bizConfig() {
      return this.$bizcfg.getBizConfig(this.busiCode, this.userType);
    },
    bizRouteTable() {
      return this.$store.state.bizRouteTable;
    },

  },
  methods: {
    //资料变更 个人数据处理
    getCustData() {
      let arr = [];
      //个人基本信息
      let basicChangeDiff = _.get(this.bizData, "CUST_INFO.CUST_BASIC_CHANGE_INFO.DIFF_INFO", []);
      //身份证件信息
      let cardData = _.filter(_.cloneDeep(basicChangeDiff), {MODULE_ID: "CUST_CARD_INFO"});
      let cardDiff = this.getInfoChangeDiff(cardData, "身份证件信息", ["INOUTSIDE_IDENTITY", "SUBJECT_IDENTITY", "VOCATION_AML_REMARK"]);
      //辅证件信息
      let fzCardData = _.filter(_.cloneDeep(basicChangeDiff), {MODULE_ID: "CUST_FZCARD_INFO"});
      let fzCardDiff = this.getInfoChangeDiff(fzCardData, "辅证件信息", ["INOUTSIDE_IDENTITY", "SUBJECT_IDENTITY", "VOCATION_AML_REMARK"]);
      //基本信息
      let basicData = _.filter(_.cloneDeep(basicChangeDiff), {MODULE_ID: "CUST_EXPERIENCE_INFO"});
      let basicDiff = this.getInfoChangeDiff(basicData, "基本信息", ["INOUTSIDE_IDENTITY", "SUBJECT_IDENTITY", "VOCATION_AML_REMARK"]);
      //诚信记录
      let creditRecordDiff0 = this.getArrInfoChangeDiff(_.get(this.bizData, "RELA_INFO.CREDIT_RECORD_CHANGE_INFO.INFO", []), "诚信记录来源信息", ["RECORD_SCORE","RECORD_NUM"]);
      let creditRecordDiff  = _.filter(creditRecordDiff0, item => {
        return !(item.newVal == item.oldVal && item.title == '诚信备注');
      })
      //联系信息
      let custLinkDiff = this.getInfoChangeDiff(_.get(this.bizData, "CUST_INFO.CUST_LINK_CHANGE_INFO.DIFF_INFO", []), "联系信息", ["AML_REMARK", "LINK_AML_REMARK"]);
      //其他联系人信息
      let custOtherLinkDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "RELA_INFO.CUST_OTHER_LINK_CHANGE_INFO.INFO", []), "联系人信息", ["LINKMAN_NO"]);
      //实际控制人
      let custControlerDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "RELA_INFO.CUST_CONTROLER_CHANGE_INFO.SHOW_INFO", []), "实际控制人信息", ["CONTROLER_NUM"]);
      //受益人
      let custBeneficiaryDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "RELA_INFO.CUST_BENEFICIARY_CHANGE_INFO.SHOW_INFO", []), "受益人信息", ["BENEFICIARY_NO"]);
      //涉税信息
      let custTaxInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "RELA_INFO.CUST_TAX_CHANGE_INFO.showDiffInfo", []), "税收居民身份", ["GET_INVEST_CERFLAG"]);
      custTaxInfoDiff = this.detailTaxInfo(_.cloneDeep(custTaxInfoDiff), false);
      let custTaxInfoDeleteDiff = this.getInfoChangeDiff(_.get(this.bizData, "RELA_INFO.CUST_TAX_CHANGE_INFO.deleteDiff", []), "税收居民身份(删除)", ["GET_INVEST_CERFLAG"]);
      custTaxInfoDeleteDiff = this.detailTaxInfo(_.cloneDeep(custTaxInfoDeleteDiff), true);
      arr = _.concat(cardDiff, fzCardDiff, basicDiff, creditRecordDiff, custLinkDiff, custOtherLinkDiff, custControlerDiff, custBeneficiaryDiff, custTaxInfoDiff, custTaxInfoDeleteDiff);
      return _.cloneDeep(arr);
    },
    //资料变更 机构数据处理
    getOrgData() {
      let arr = [];
      //证件信息
      let docInfoField = ["CUST_FNAME", "CUST_NAME", "ID_TYPE", "ID_CODE", 
                          "ID_EXP_DATE", "ORG_ID_CODE", "ORG_ID_EXP_DATE", 
                          "BUSINESS_RANGE", "REGISTER_CURRENCY", "REGISTER_FUND", 
                          "BIRTHDAY", "CITIZENSHIP", "CORP_ADDR"];
      let docInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "BASIC_WEB_SHOW", []), "证件信息", [], docInfoField);
      //主体身份信息
      let subjectIdentityInfoField = ["LEGAL_REP_TYPE", "SZORG_TYPE", "TRADE", "CORP_TYPE",
                                      "NATIONAL_ATTR", "CAPITAL_ATTR", "SMFUND_MANAGER_ID"];
      let subjectIdentityInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "BASIC_WEB_SHOW", []), "主体身份信息", [], subjectIdentityInfoField);
      //诚信记录
      let creditRecordDiff0 = this.getArrInfoChangeDiff(_.get(this.bizData, "RELA_INFO.CREDIT_RECORD_CHANGE_INFO.INFO", []), "诚信记录来源信息", ["RECORD_SCORE","RECORD_NUM"]);
      let creditRecordDiff  = _.filter(creditRecordDiff0, item => {
        return !(item.newVal == item.oldVal && item.title == '诚信备注');
      })
      //联系信息
      let linkInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "LINK_WEB_SHOW", []), "联系信息", []);
      //联系人信息
      let linkManInfoDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "LINK_MAN_WEB_SHOW", []), "联系人信息", ["LINKMAN_NO"]);
      //法定代表人信息
      let legalRepInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "LEGAL_REP_INFO_WEB_SHOW", []), "法定代表人信息", []);
      //委派代表信息
      let legaLClientInfoTypeDiff = this.getInfoChangeDiff(_.get(this.bizData, "LEGAL_CLIENT_INFO_WEB_SHOW", []), "委派代表信息", []);
      //负责人信息
      let responsiblePeronInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "RESPONSIBLE_PERSON_INFO_WEB_SHOW", []), "负责人信息", ["MODULE_RADIO_BUTTON"]);
      //合伙人信息
      let partnerInfoDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "PARTNER_INFO_WEB_SHOW", []), "合伙人信息", ["PARTNER_NO"]);
      //受益所有人类型         
      let amlInfoWebShow = _.filter(_.get(this.bizData, "BASIC_WEB_SHOW", []), basicItem => {
        return basicItem.FIELD == "AML_CUST_TYPE";
      })
      let benTypeWebShow = _.get(this.bizData, "BENEFICIARY_OWNER_INFO_WEB_SHOW[0].DIFF_INFO", []);
      benTypeWebShow = _.filter(benTypeWebShow, benWebShowItem => {
        return benWebShowItem.FIELD == "BENEFICIARY_TYPE";
      })
      let amlInfoInfoDiff = this.getInfoChangeDiff(_.concat([], amlInfoWebShow, benTypeWebShow), "受益所有人类型", []);
      //受益所有人信息 
      let beneficiaryOwnerInfoDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "BENEFICIARY_OWNER_INFO_WEB_SHOW", []), "受益所有人信息", ["BENEFICIARY_NO", "BENEFICIARY_TYPE"]); 
      //控股股东信息 
      let stockholderInfoDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "STOCKHOLDER_INFO_WEB_SHOW", []), "控股股东信息", ["CONTROLLER_NO", "MODULE_RADIO_BUTTON"]);
      //实际控制人信息 
      let actualControllerInfoDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "ACTUAL_CONTROLLER_INFO_WEB_SHOW", []), "实际控制人信息", ["CONTROLER_NUM", "MODULE_RADIO_BUTTON"]);
      //涉税信息
      let orgTaxInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "taxInfoArrChange.WEB_SHOW[0].showDiffInfo", []), "税收居民身份", ["GET_INVEST_CERFLAG"]);
      orgTaxInfoDiff = this.detailTaxInfo(_.cloneDeep(orgTaxInfoDiff), false);
      let orgTaxInfoDeleteDiff = this.getInfoChangeDiff(_.get(this.bizData, "taxInfoArrChange.WEB_SHOW[0].deleteDiff", []), "税收居民身份(删除)", ["GET_INVEST_CERFLAG"]);
      orgTaxInfoDeleteDiff = this.detailTaxInfo(_.cloneDeep(orgTaxInfoDeleteDiff), true);
      //控制人涉税信息
      let controlldiifArr = [];
      _.each(_.get(this.bizData, "controllerTaxInfoArrChange.WEB_SHOW", []), (webShowItem, key) => {
        let num = key == "0" ? "" : (key + 1);
        let title = "控制人税收居民身份" + num;
        let controlOrgTaxInfoDiff = this.getInfoChangeDiff(webShowItem.showDiffInfo, title, ["GET_INVEST_CERFLAG"]);
        controlOrgTaxInfoDiff = this.detailTaxInfo(_.cloneDeep(controlOrgTaxInfoDiff), false, "控制人" + num + "税收居民国/地区信息");
        let controlOrgTaxInfoDeleteDiff = this.getInfoChangeDiff(webShowItem.deleteDiff, title + "(删除)", ["GET_INVEST_CERFLAG"]);
        controlOrgTaxInfoDeleteDiff = this.detailTaxInfo(_.cloneDeep(controlOrgTaxInfoDeleteDiff), true, "控制人" + num + "税收居民国/地区信息");
        controlldiifArr = _.concat([], controlldiifArr, controlOrgTaxInfoDiff, controlOrgTaxInfoDeleteDiff);
      })
      arr = _.concat([], docInfoDiff, subjectIdentityInfoDiff, creditRecordDiff, linkInfoDiff, 
                                  linkManInfoDiff, legalRepInfoDiff, legaLClientInfoTypeDiff, responsiblePeronInfoDiff,
                                  partnerInfoDiff, amlInfoInfoDiff, beneficiaryOwnerInfoDiff, stockholderInfoDiff, actualControllerInfoDiff,
                                  orgTaxInfoDiff, orgTaxInfoDeleteDiff, controlldiifArr)
      return _.cloneDeep(arr);
    },
    //资料变更 产品数据处理
    getProData() {
      let arr = [];
      //证件信息
      let docInfoField = ["CUST_FNAME", "CUST_NAME", "ID_TYPE", "ID_CODE"];
      let docInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "BASIC_WEB_SHOW", []), "证件信息", [], docInfoField);
      //产品信息
      let productInfoField = ["PRO_NAME", "PRO_CLS", "PRO_SIZE", "PRO_CREAT_DATE", "PRO_EXP_DATE", "PRO_BAK_ORG", "PRO_BAK_CODE", "PRO_BAK_DATE", "FUND_CODE"];
      let productInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "BASIC_WEB_SHOW", []), "产品信息", [], productInfoField);
      //受益所有人类型         
      let amlInfoWebShow = _.filter(_.get(this.bizData, "BASIC_WEB_SHOW", []), basicItem => {
        return basicItem.FIELD == "AML_CUST_TYPE";
      })
      let benTypeWebShow = _.get(this.bizData, "BENEFICIARY_OWNER_INFO_WEB_SHOW[0].DIFF_INFO", []);
      benTypeWebShow = _.filter(benTypeWebShow, benWebShowItem => {
        return benWebShowItem.FIELD == "BENEFICIARY_TYPE";
      })
      let amlInfoInfoDiff = this.getInfoChangeDiff(_.concat([], amlInfoWebShow, benTypeWebShow), "受益所有人类型", []);
      //受益所有人信息 
      let beneficiaryOwnerInfoDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "BENEFICIARY_OWNER_INFO_WEB_SHOW", []), "受益所有人信息", ["BENEFICIARY_NO", "BENEFICIARY_TYPE"]);
      //管理人证件信息
      let managerDocInfoField = ["PRO_MANAGER_NAME", "PRO_MANAGER_ID_TYPE", "PRO_MANAGER_ID_CODE", "PRO_MANAGER_ID_EXP_DATE",
                                 "PRO_MANAGER_ASSI_CODE", "BIRTHDAY", "REGISTER_CURRENCY", "REGISTER_FUND", "CORP_ADDR", "BUSINESS_RANGE", "CITIZENSHIP"];
      let managerDocInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "MANAGER_BASIC_WEB_SHOW", []), "管理人证件信息", [], managerDocInfoField);
      //管理人基本信息
      let managerBasicInfoField = ["LEGAL_REP_TYPE", "SZORG_TYPE", "TRADE", "SMFUND_MANAGER_ID", "OFFICE_TEL_INSIDE", "EMAIL", "OFFICE_ADDR", "ZIP_CODE", "MOBILE_TEL", "OFFICE_TEL"];
      let managerBasicInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "MANAGER_BASIC_WEB_SHOW", []), "管理人基本信息", [], managerBasicInfoField);
      //法定代表人信息
      let legalRepInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "LEGAL_REP_INFO_WEB_SHOW", []), "法定代表人信息", []);
      //委派代表信息
      let legaLClientInfoTypeDiff = this.getInfoChangeDiff(_.get(this.bizData, "LEGAL_CLIENT_INFO_WEB_SHOW", []), "委派代表信息", []);
      //负责人信息
      let responsiblePeronInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "RESPONSIBLE_PERSON_INFO_WEB_SHOW", []), "负责人信息", ["MODULE_RADIO_BUTTON"]);
      //合伙人信息
      let partnerInfoDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "PARTNER_INFO_WEB_SHOW", []), "合伙人信息", ["PARTNER_NO"]);
      //控股股东信息 
      let stockholderInfoDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "STOCKHOLDER_INFO_WEB_SHOW", []), "控股股东信息", ["CONTROLLER_NO", "MODULE_RADIO_BUTTON"]);
      //实际控制人信息 
      let actualControllerInfoDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "ACTUAL_CONTROLLER_INFO_WEB_SHOW", []), "实际控制人信息", ["CONTROLER_NUM", "MODULE_RADIO_BUTTON"]);
      //诚信记录
      let creditRecordDiff0 = this.getArrInfoChangeDiff(_.get(this.bizData, "RELA_INFO.CREDIT_RECORD_CHANGE_INFO.INFO", []), "诚信记录来源信息", ["RECORD_SCORE","RECORD_NUM"]);
      let creditRecordDiff  = _.filter(creditRecordDiff0, item => {
        return !(item.newVal == item.oldVal && item.title == '诚信备注');
      })
      //托管人信息
      let trusteeInfoDiff = this.getInfoChangeDiff(_.get(this.bizData, "TRUSTEE_INFO_WEB_SHOW", []), "托管人信息", []);
      //产品联系人信息
      let linkManInfoDiff = this.getArrInfoChangeDiff(_.get(this.bizData, "LINK_MAN_WEB_SHOW", []), "产品联系人信息", ["LINKMAN_NO"]);
      arr = _.concat([], docInfoDiff, productInfoDiff, amlInfoInfoDiff, beneficiaryOwnerInfoDiff, managerDocInfoDiff, 
                    managerBasicInfoDiff, legalRepInfoDiff, legaLClientInfoTypeDiff, responsiblePeronInfoDiff, partnerInfoDiff,
                    stockholderInfoDiff, actualControllerInfoDiff, creditRecordDiff, trusteeInfoDiff, linkManInfoDiff)
      return _.cloneDeep(arr);
    },
    //处理变更数据
    getchangeDiff() {
      let changeDataArrTpl = [];
      if(this.userType == "0") {
        changeDataArrTpl = this.getCustData();
      }
      if (this.userType == "1") {
        changeDataArrTpl = this.getOrgData();
      }
      if (this.userType == "2") {
        changeDataArrTpl = this.getProData();
      }
      this.changeDataArr = _.cloneDeep(changeDataArrTpl);
    },
    //涉税信息处理
    detailTaxInfo(taxDiffInfo, isDetele, infoTitle = "税收居民国/地区信息") {
      let taxInfoCitizenshipOne = [];
      let taxInfoCitizenshipTwo = [];
      let taxInfoCitizenshipThree = [];
      let arr = ["CITIZENSHIP",
            "CITIZENSHIP2",
            "CITIZENSHIP3",
            "TAXPAYER_IDNO",
            "TAXPAYER_IDNO2",
            "TAXPAYER_IDNO3",
            "NO_TAXPAYERID_REASON",
            "NO_TAXPAYERID_REASON2",
            "NO_TAXPAYERID_REASON3",
            "HAS_TAXPAYER_IDNO",
            "HAS_TAXPAYER_IDNO2",
            "HAS_TAXPAYER_IDNO3",
            "OPP_NO_TAXPAYERID_REASON",
            "OPP_NO_TAXPAYERID_REASON2",
            "OPP_NO_TAXPAYERID_REASON3"
      ]
      taxDiffInfo = _.filter(taxDiffInfo, taxDiffInfoItem => {
        if (arr.indexOf(taxDiffInfoItem.FIELD) > -1) {
          if (taxDiffInfoItem.FIELD.indexOf("2") > -1) {
            if (_.isEmpty(taxInfoCitizenshipTwo)) {
              let title = _.cloneDeep(infoTitle) + "(2)"
              if(isDetele) {
                title = title + "(删除)"
              }
              taxInfoCitizenshipTwo.push({"title": title, newVal: "", oldVal: "", rowType: "1"});
            }
            taxInfoCitizenshipTwo.push(taxDiffInfoItem);
          }
          if (taxDiffInfoItem.FIELD.indexOf("3") > -1) {
            if (_.isEmpty(taxInfoCitizenshipThree)) {
              let title = _.cloneDeep(infoTitle) +"(3)"
              if(isDetele) {
                title = title + "(删除)"
              }
              taxInfoCitizenshipThree.push({"title": title, newVal: "", oldVal: "", rowType: "1"});
            }
            taxInfoCitizenshipThree.push(taxDiffInfoItem);
          }
          if (taxDiffInfoItem.FIELD.indexOf("3") == -1 && taxDiffInfoItem.FIELD.indexOf("2") == -1) {
            if (_.isEmpty(taxInfoCitizenshipOne)) {
              let title = _.cloneDeep(infoTitle)
              if(isDetele) {
                title = title + "(删除)"
              }
              taxInfoCitizenshipOne.push({"title": title, newVal: "", oldVal: "", rowType: "1"});
            }
            taxInfoCitizenshipOne.push(taxDiffInfoItem);
          }
        }
        return arr.indexOf(taxDiffInfoItem.FIELD) == -1
      })
      if (taxDiffInfo.length == 1) {
        taxDiffInfo = [];
      }
      return _.concat([], taxDiffInfo, taxInfoCitizenshipOne, taxInfoCitizenshipTwo, taxInfoCitizenshipThree);
    },
    
    getInfoChangeDiff(changeDiff, title, ignoreFields = [], saveFields = []) {
      let diff = [];
      let changeDiffTpl = _.cloneDeep(changeDiff);
      changeDiffTpl = _.filter(changeDiffTpl, changeDiffTplItem => {
        return _.isEmpty(ignoreFields) ? true : ignoreFields.indexOf(changeDiffTplItem.FIELD) == -1;
      })
      changeDiffTpl = _.filter(changeDiffTpl, changeDiffTplItem => {
        return _.isEmpty(saveFields) ? true : saveFields.indexOf(changeDiffTplItem.FIELD) > -1;
      })
      diff = _.concat(diff, changeDiffTpl);
      diff = _.map(diff, diffItem => {
        return {FIELD: diffItem.FIELD, title: diffItem.FIELD_TITLE || diffItem.FIELD, newVal: diffItem.NEW_TEXT || diffItem.NEW || "-", oldVal: diffItem.OLD_TEXT || diffItem.OLD || "-"}
      })
      if (diff.length > 0) {
        diff = _.concat([{title: title, newVal: "", oldVal: "", rowType: "1"}], diff);
      }
      return diff;
    },
    getArrInfoChangeDiff(changeDiff, title, ignoreFields) {
      let diff = [];
      let changeDiffTpl = _.cloneDeep(changeDiff);
      _.each(changeDiffTpl, item => {
        //如果是删除
        if (item.OPER_TYPE == "2") {
          diff = _.concat(diff, [{title: title+"(删除)", newVal: "", oldVal: "", rowType: "1"}]);
          let deleteDiff = _.filter( _.get(item, "deleteDiff", []), deleteDiffItem => {
            return _.isEmpty(ignoreFields) ? true : ignoreFields.indexOf(deleteDiffItem.FIELD) == -1;
          });
          let deleteDiffInfo = _.map( deleteDiff, diffItem => {
            return {FIELD: diffItem.FIELD, title: diffItem.FIELD_TITLE || diffItem.FIELD, newVal: diffItem.NEW_TEXT || diffItem.NEW || "-", oldVal: diffItem.OLD_TEXT || diffItem.OLD || "-"}
          });
          diff = _.concat(diff, deleteDiffInfo)
          return true;
        }        
        let diffInfo = _.filter(item.DIFF_INFO, diffInfoItem => {
          return _.isEmpty(ignoreFields) ? true : ignoreFields.indexOf(diffInfoItem.FIELD) == -1;
        })
        if (diffInfo.length > 0) {
          diff = _.concat(diff, [{title: title, newVal: "", oldVal: "", rowType: "1"}]);
        }
        let diffItem = _.map(diffInfo, diffItem => {
          return {FIELD: diffItem.FIELD, title: diffItem.FIELD_TITLE || diffItem.FIELD, newVal: diffItem.NEW_TEXT || diffItem.NEW || "-", oldVal: diffItem.OLD_TEXT || diffItem.OLD || "-"}
        })
        diff = _.concat(diff, diffItem)
      })
      return diff
    },
    beforeSave(_this, params, baseData) {
      //受理凭条展示数据
      params.changeDiffInfo = _this.$refs.bizInfoChangeNew.changeDataArr;
    },
    tableRowClassName({row, rowIndex}) {
      if (row.rowType == "1") {
        return "field-title-row";
      }
      return "";
    },
    async validate(_this) {
      //根据我司一人多户客户账户信息管理要求，本次修改的信息将同步至您本人名下xxxx、xxxx账户
      let topacctInfo = _this.oppBusiData.topacctInfo || [];
      let promiseTopFlag = true;
      if (topacctInfo.length > 1) {
          let acctArr = []
          _.each(topacctInfo, item => {
              acctArr.push(item.CUST_CODE);
          })
          let promiseTop = () => {
              return new Promise( (resolve, reject) => {
                  _this.loading = false;
                  _this.messageBox({
                      hasMask:true,
                      messageText: `根据我司一人多户客户账户信息管理要求，本次修改的信息将同步至您本人名下${acctArr.join("、")}账户`,
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      typeMessage: "warn", 
                      showMsgBox: true,
                      confirmedAction: () => {
                          _this.loading = true;
                          resolve(true)
                      },
                      canceledAction: () => {
                          resolve(false)
                      }
                  })
              })
          } 
          promiseTopFlag = await promiseTop();
      }
      return Promise.all([promiseTopFlag]).then( res => {
          if (_.includes(res, false)) {
              return false;
          }
          return true;
      })
    },
    preValidate(_this) {
      if(_this.busiCode == "V0049") {
          _this.$router.goRoute("信息列表");
          return false;
        }
    }
  },
};
</script>

<style lang="less">
.bizInfoChange-page {
  .changeinfo-contrainer {
    background: #ffffff;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 45px;
    height: 85%;
    .infochange-table-List {
      width: 1350px;
      margin: 0 auto;
      flex: 1;
      flex-basis: 0%;
      overflow: auto;
      -ms-overflow-style: none;
      .table-title {
        font-family: Alibaba PuHuiTi;
        font-weight: 700;
        color: #252525;
        font-size: 42px;
        line-height: 68px;
        text-align: center;
      }
      .infochanged-table {
        width: 1350px;
        margin-top: 30px;
        background-color:#ffffff;
        border: 1px solid;
        border-color: #d9d9d9;
        border-radius: 8px;
        box-shadow: 0px 3px 22px rgba(0, 0, 0, 0.03);
        .table-box {
          td {
            border: none;
          }
          .field-title-row{
            background-color: #f7f7fa;
            .fields-column {
              .cell {
                font-weight: 700;
                color: #252525;
              }
            }
          }
          .cell {
            font-family: Alibaba PuHuiTi;
            font-size: 24px;
            line-height: 35px;
            padding: 0;
            color: #252525;
          }
          .fields-column {
            padding: 26px 38px 26px 58px;
            
          }
          .old-value-column {
            padding-right: 68px;
          }
          .new-value-column {
            padding-right: 144px;
            .cell {
              color: #c93e2c;
            }
          }
        }
      }
      
    }
  }

}
</style>