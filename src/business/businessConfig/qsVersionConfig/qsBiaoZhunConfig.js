// 通用中泰业务配置表
// 机构和产品所需的证件公共资料
import txtConfig from '../../../config/txtConfig'
import sysConfig from '../../../config/sysConfig'
import baseConfig from '../../../config/baseConfig'
const commonList = {
    "0": [{
        "name": "本人有效身份证明文件：<b>身份证</b>/港澳台居民居住证/港澳台居民通行证/港澳居民身份证/外国人永久居留证/护照"
    }],
    "1": [{
        "name": "机构有效身份证明文件：公司制法人为加载统一社会信用代码的新版营业执照，社团法人为社团法人登记证书，事业法人为事业单位法人证书，机关法人为机关法人成立批文等及复印件"
    }, {
        "name": "法定代表人/负责人证明书：需加盖公章"
    }, {
        "name": "法定代表人/负责人授权委托书：需加盖公章及法定代表人/负责人签章"
    }, {
        "name": "法定代表人/负责人的有效身份证明文件：加盖公章的复印件"
    }, {
        "name": "代理人有效身份证明文件"
    }],
    "2": [{
        "name": "产品有效身份证明文件：中登开户时提供的身份证明文件"
    }, {
        "name": "法定代表人/负责人证明书（管理人）：需加盖公章"
    }, {
        "name": "法定代表人/负责人授权委托书（管理人）：需加盖公章及法定代表人/负责人签章"
    }, {
        "name": "法定代表人/负责人的有效身份证明文件（管理人）：加盖公章的复印件"
    }, {
        "name": "代理人有效身份证明文件"
    }]
}
const qsConfig = {
    BIAOZHUN: {
        //客户资料变更
        "V0049": {
            open: true,
            pageCount: 20,
            notify: "",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人",
                "list": [{
                    "business": [ //业务需要的部分
                        { //业务需要的部分
                            "name": "发证机关提供的有效变更证明：变更姓名、证件类型、证件号码时提供"
                        }
                    ],
                    'commonList': commonList[0]
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构",
                //"forbid": true,
                "list": [{
                    "business": [{ //业务需要的部分
                        "name": "发证机关提供的有效变更证明：变更名称、证件类型、证件号码时提供"
                    }],
                    'commonList': commonList[1]
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品",
                // "forbid": true,
                "list": [{
                    "business": [ //业务需要的部分
                        { //业务需要的部分
                            "name": "变更证明：变更名称、证件类型、证件号码、管理人相关信息时提供"
                        }
                    ],
                    'commonList': commonList[2]
                }]
            }],
            bizRoutes: {
                "0": [{
                        name: "信息列表",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizPage/V0049",
                        isCommit: true,
                        isShowNext: false,
                        title: "资料录入",
                        autoNext: false,
                    }, {
                        name: "证件信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/10",
                        group: "CUST_INFO",
                        modules: ["CUST_CARD_INFO", "CUST_FZCARD_INFO"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //是否展示上一步按钮
                        isShowPrev: false,
                        //下一步按钮文字显示
                        nextBtnText: '保存修改',
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "custCardNavNode",
                        fromName: "证件信息",
                        beginFieldValidate: true,
                        //展示or隐藏
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "基本信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/20",
                        group: "CUST_INFO",
                        modules: ["CUST_EXPERIENCE_INFO", "HAS_CREDIT_RECORD", "CREDIT_RECORD_INFO"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //是否展示上一步按钮
                        isShowPrev: false,
                        //下一步按钮文字显示
                        nextBtnText: '保存修改',
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "custInfoNavNode",
                        fromName: "基本信息",
                        beginFieldValidate: true,
                        //展示or隐藏
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "联系信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/30",
                        group: "LINK_INFO",
                        modules: ["CUST_LINK_INFO", "CUST_OTHER_LINK_INFO"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //是否展示上一步按钮
                        isShowPrev: false,
                        //下一步按钮文字显示
                        nextBtnText: '保存修改',
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "linkInfoNavNode",
                        fromName: "联系信息",
                        beginFieldValidate: true,
                        //展示or隐藏
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    {
                        name: "关联人信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/40",
                        group: "RELA_INFO",
                        modules: ["CUST_CONTROLER_INFO", "CUST_BENEFICIARY_INFO"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //是否展示上一步按钮
                        isShowPrev: false,
                        //下一步按钮文字显示
                        nextBtnText: '保存修改',
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "relaInfoNavNode",
                        fromName: "关联人信息",
                        beginFieldValidate: true,
                        //展示or隐藏
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    { // 涉税信息
                        name: "税收居民身份",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/60",
                        group: "APPR_INFO",
                        modules: ["ORG_TAX_INFO"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //是否展示上一步按钮
                        isShowPrev: false,
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "apprInfoNavNode",
                        fromName: "涉税信息",
                        // beginFieldValidate: true,
                        //展示or隐藏
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    { // 涉税信息
                        name: "客户出生信息/现居国家信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/70",
                        group: "APPR_INFO",
                        modules: ["CUST_TAX_INFO_MODULE3", "CUST_TAX_INFO_MODULE2"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "apprInfoNavNode",
                        fromName: "涉税信息",
                        // beginFieldValidate: true,
                        //展示or隐藏
                        show: false,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    { // 涉税信息
                        name: "税收居民国/地区信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/90",
                        group: "APPR_INFO",
                        modules: ["CUST_TAX_INFO_MODULE4"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //下一步按钮文字显示
                        nextBtnText: '保存修改',
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "apprInfoNavNode",
                        fromName: "涉税信息",
                        beginFieldValidate: true,
                        //展示or隐藏
                        show: false,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    { // 涉税信息
                        name: "涉税资产信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/100",
                        group: "APPR_INFO",
                        modules: ["TAX_ASSET_INFO", "TAX_PAYMENT_INFO"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "apprInfoNavNode",
                        fromName: "涉税信息",
                        //展示or隐藏
                        show: false,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "修改对比",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizPage/bizInfoChangeNew",
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        show: true,
                        //下一步按钮文字显示
                        nextBtnText: '确认修改',
                        prevBtnText: '返回修改',
                        isShowNext: true
                    }
                ],
                "1": [{
                        name: "信息列表",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizPage/V0049_ORG",
                        isCommit: true,
                        isShowNext: false,
                        title: "资料录入",
                        autoNext: false,
                    },
                    {
                        name: "证件信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/10",
                        group: "ORG_INFO",
                        modules: ["DOC_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: false,
                        nextBtnText: '保存修改',
                        isShowPageIndex: true,
                        from: "orgDocNavNode",
                        fromName: "证件信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false

                    }, {
                        name: "基本信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/20",
                        group: "ORG_INFO",
                        modules: ["SUBJECT_IDENTITY_INFO", "HAS_CREDIT_RECORD", "CREDIT_RECORD_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: false,
                        nextBtnText: '保存修改',
                        isShowPageIndex: true,
                        from: "orgBasicNavNode",
                        fromName: "基本信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "联系信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/30",
                        group: "LINK_INFO",
                        modules: ["ORG_LINK_INFO", "LINKMAN_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: false,
                        nextBtnText: '保存修改',
                        isShowPageIndex: true,
                        from: "linkInfoNavNode",
                        fromName: "联系信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "关联人信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/40",
                        group: "RELA_INFO",
                        modules: ["LEGAL_REP_INFO", "LEGAL_CLIENT_INFO",
                         "RESPONSIBLE_PERSON_INFO", "PARTNER_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: false,
                        nextBtnText: '保存修改',
                        isShowPageIndex: true,
                        from: "relaInfoNavNode",
                        fromName: "关联人信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "控股股东/实际控制人信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/50",
                        group: "EQUITY_INFO",
                        modules: ["STOCKHOLDER_INFO", "ACTUAL_CONTROLLER_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: false,
                        nextBtnText: '保存修改',
                        isShowPageIndex: true,
                        from: "equityInfoNavNode",
                        fromName: "控股股东/实际控制人信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "受益所有人信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/60",
                        group: "RELA_INFO",
                        modules: ["AML_INFO", "BENEFICIARY_OWNER_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: false,
                        nextBtnText: '保存修改',
                        isShowPageIndex: true,
                        from: "relaInfo2NavNode",
                        fromName: "受益所有人信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    { // 涉税信息
                        name: "税收居民身份",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/70",
                        group: "TAX_INFO",
                        modules: ["ORG_TAX_INFO"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //是否展示上一步按钮
                        isShowPrev: false,
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "apprInfoNavNode",
                        fromName: "涉税信息",
                        // beginFieldValidate: true,
                        //展示or隐藏
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    { // 涉税信息
                        name: "税收居民基本信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/80",
                        group: "TAX_INFO",
                        modules: ["ORG_TAX_BASIC_INFO"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "apprInfoNavNode",
                        fromName: "涉税信息",
                        // beginFieldValidate: true,
                        //展示or隐藏
                        show: false,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    { // 涉税信息
                        name: "税收居民国/地区信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/90",
                        group: "TAX_INFO",
                        modules: ["ORG_TAX_COUNTRY_INFO"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //页面页码展示
                        isShowPageIndex: true,
                        //下一步按钮文字显示
                        nextBtnText: '保存修改',
                        //左侧导航栏归类
                        from: "apprInfoNavNode",
                        fromName: "涉税信息",
                        beginFieldValidate: true,
                        //展示or隐藏
                        show: false,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    { //控制人涉税
                        name: "控制人涉税声明信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizPage/V0049_orgControllerTaxInfo",
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //是否展示上一步按钮
                        isShowPrev: false,
                        //下一步按钮文字显示
                        nextBtnText: '保存修改',
                        //左侧导航栏归类
                        from: "controlTaxInfoNavNodeHome",
                        fromName: "控制人涉税信息",
                        isShowNext: true,
                        //展示or隐藏
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    { //控制人涉税
                        name: "控制人涉税居民身份信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/100",
                        group: "CONTROLLER_TAX_INFO",
                        modules: ["ORG_TAX_CONTROLER_MODULE1"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //上一步按钮文字显示
                        prevBtnText: '返回',
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "controlTaxInfoNavNode",
                        fromName: "控制人涉税信息",
                        // beginFieldValidate: true,
                        //展示or隐藏
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    { // 控制人涉税
                        name: "控制人出生/现居国家信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/110",
                        group: "CONTROLLER_TAX_INFO",
                        modules: ["ORG_TAX_CONTROLER_MODULE2", "ORG_TAX_CONTROLER_MODULE3", "ORG_TAX_CONTROLER_MODULE4"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "controlTaxInfoNavNode",
                        fromName: "控制人涉税信息",
                        // beginFieldValidate: true,
                        //展示or隐藏
                        show: false,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    { // 控制人涉税
                        name: "控制人税收居民国/地区信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/120",
                        group: "CONTROLLER_TAX_INFO",
                        modules: ["ORG_TAX_CONTROLER_MODULE5"],
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        //是否显示返回列表按钮
                        isShowBackList: true,
                        //下一步按钮文字显示
                        nextBtnText: '保存修改',
                        //页面页码展示
                        isShowPageIndex: true,
                        //左侧导航栏归类
                        from: "controlTaxInfoNavNode",
                        fromName: "控制人涉税信息",
                        beginFieldValidate: true,
                        //展示or隐藏
                        show: false,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    },
                    {
                        name: "修改对比",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizPage/bizInfoChangeNew",
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        show: true,
                        //下一步按钮文字显示
                        nextBtnText: '确认修改',
                        prevBtnText: '返回修改',
                        isShowNext: true
                    }
                ],
                "2": [{
                        name: "信息列表",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizPage/V0049_PRO",
                        isCommit: true,
                        isShowNext: false,
                        title: "资料录入",
                        autoNext: false,
                    },
                    {
                        name: "产品信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/10",
                        group: "PRO_INFO",
                        modules: ["DOC_INFO", "PRODUCT_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: false,
                        nextBtnText: '保存修改',
                        isShowPageIndex: true,
                        from: "proInfo",
                        fromName: "产品信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "受益所有人信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/20",
                        group: "BENEFICIARY_INFO",
                        modules: ["AML_INFO", "BENEFICIARY_OWNER_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: false,
                        nextBtnText: '保存修改',
                        isShowPageIndex: true,
                        from: "beneficiaryInfo",
                        fromName: "受益所有人信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "管理人身份信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/30",
                        group: "MANAGER_INFO",
                        modules: ["MANAGER_DOC_INFO", "MANAGER_BASIC_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: false,
                        isShowPageIndex: true,
                        from: "managerPersonInfo",
                        fromName: "管理人信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "管理人关联人信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/40",
                        group: "MANAGER_INFO",
                        modules: ["LEGAL_REP_INFO", "LEGAL_CLIENT_INFO", "RESPONSIBLE_PERSON_INFO", "PARTNER_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: true,
                        isShowPageIndex: true,
                        from: "managerRelaInfo",
                        fromName: "管理人信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "控股股东信息/实际控制人",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/50",
                        group: "MANAGER_INFO",
                        modules: ["STOCKHOLDER_INFO", "ACTUAL_CONTROLLER_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: true,
                        isShowPageIndex: true,
                        from: "stockHolderInfo",
                        fromName: "管理人信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "诚信记录",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/60",
                        group: "MANAGER_INFO",
                        modules: ["HAS_CREDIT_RECORD", "CREDIT_RECORD_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: true,
                        nextBtnText: '保存修改',
                        isShowPageIndex: true,
                        from: "creditInfo",
                        fromName: "管理人信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "其他信息",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizEntry/40",
                        group: "OTHER_INFO",
                        modules: ["TRUSTEE_INFO", "LINKMAN_INFO"],
                        isCommit: true,
                        isShowBackList: true,
                        isShowPrev: false,
                        nextBtnText: '保存修改',
                        isShowPageIndex: true,
                        from: "other",
                        fromName: "其他信息",
                        beginFieldValidate: true,
                        show: true,
                        // 对应续办时是否保存 path 到流水中
                        savePath: false
                    }, {
                        name: "修改对比",
                        path: "/bizFlow/:busiCode/:userType/baseInfoNode/bizPage/bizInfoChangeNew",
                        //下一步是否提交保存到数据库
                        isCommit: true,
                        show: true,
                        //下一步按钮文字显示
                        nextBtnText: '确认修改',
                        prevBtnText: '返回修改',
                        isShowNext: true
                    }
                ],
            }
        },
    }
}

const plugin = {
    install(Vue) {
        //添加全局方法或属性
        Vue.qsConfig = qsConfig
            //添加实例方法
        Vue.prototype.$qsConfig = qsConfig
    },
    $qsConfig: qsConfig
}

export default plugin
export const install = plugin.install