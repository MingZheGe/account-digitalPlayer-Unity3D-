
const moduleConfig = {
  // 客户资料变更
  "Z0004":{
    // 客户类别 个人/机构/产品
    "0": {
      "CUST_OTHER_LINK_INFO": { // 其他联系人信息
        "MAX_LENGTH": 3, // 最大可添加3组
        "MODULE_NUM_FIELD": "LINKMAN_NO",
      },
      "CUST_BENEFICIARY_INFO": { // 受益人信息
        "MAX_LENGTH": 3,
        "MODULE_NUM_FIELD": "BENEFICIARY_NO",
      },
      "CUST_GUARDIAN_INFO": { // 监护人信息
        "MAX_LENGTH": 3,
        "MODULE_NUM_FIELD": "GUARDIAN_NO",
      },
      "CUST_CREDIT_RECORD": { // 诚信记录
        "MODULE_NUM_FIELD": "RECORD_NUM",
      }
    },
  },
}

export default moduleConfig