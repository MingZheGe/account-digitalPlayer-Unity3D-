// 通用中泰业务配置表
// 机构和产品所需的证件公共资料
import txtConfig from '../../../config/txtConfig'
import sysConfig from '../../../config/sysConfig'
import baseConfig from '../../../config/baseConfig'
const commonList = [{
    "name": "营业执照副本原件（或者能够证明机构法人资格的其他材料），以及加盖公章的营业执照副本复印件"
},
{
    "name": "法定代表人证明书加盖公章的原件"
},
{
    "name": "法定代表人的有效身份证明材料原件，以及加盖公章的复印件"
},
{
    "name": "法定代表人授权委托书加盖公章和法定代表人签章的原件"
},
{
    "name": "经办人有效身份证明材料原件，以及加盖机构公章的有效身份证明材料复印件"
},
]
const qsConfig = {
    GUOXIN : {
        // 创业板交易权限开通
        "V0001": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您办理首次开通创业板权限，若您已开通过创业板权限，可通过我司手机金太阳-业务办理-创业板转签功能自助为普通深A证券账户及信用证券账户开通创业板权限。临柜办理首次开通创业板权限需要我司现场工作人员协助完成。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "特别提示：若您在我司未留存紧急联系人或需要变更紧急联系人的，在完善紧急联系人信息时，需要发送短信验证码给紧急联系人，请提前告知对方并做好接收短信的准备。", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": []
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": []
            }],
            bizRoutes: [{
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType"
                },
                {
                    name: "适当性匹配结果",
                    path: "/custMatchResult"
                },
            ]
        },
        // 分级基金交易权限开通
        "V0002": {
            open: true,
            explain: "本功能适用于为您办理分级基金权限（包括分级基金的子份额买入和基础份额分拆权限）开通业务。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                    "img": require("../../../images/person.png"),
                    "type": "ID_TYPE",
                    "name": "个人客户",
                    "list": [{
                        "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                    }]
                },
                {
                    "img": require("../../../images/organization.png"),
                    "type": "ID_TYPE",
                    "name": "机构客户",
                    "list": [{
                        "business": [ //业务需要的部分
                        ],
                        'commonList': commonList
                    }]
                },
                {
                    "img": require("../../../images/produce.png"),
                    "type": "ID_TYPE",
                    "name": "产品客户",
                    "list": []
                }
            ],
            bizRoutes: [{
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType"
                },
                {
                    name: "适当性匹配结果",
                    path: "/custMatchResult"
                }
            ]
        },
        // 转托管撤指定
        "V0003": {
            open: true,
            explain: `本功能适用于为您办理深圳市场的A股、B股转托管、上海市场证券账户的A股、C1类B股撤指定业务，通过VTM办理本业务需要先通过金太阳APP进行预约。
            办理转托管及撤指定前请确保您的账户满足以下条件：<br/>
            1.账户状态正常，不存在异常情形（如休眠、不合格或司法冻结等）；<br/>
            2.账户不存在未完成清算或交收的情形（如当日有交易或有未完成的新股申购、配股等）；<br/>
            3.账户不存在未了结债权债务的情形；<br/>
            4.其他导致不能转托管及撤指定的情形`,
            notify: "",
            extraTip: "", //特别提示
            infoList: [{
                    "img": require("../../../images/person.png"),
                    "type": "ID_TYPE",
                    "name": "个人客户",
                    "list": [{
                        "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                    }]
                },
                {
                    "img": require("../../../images/organization.png"),
                    "type": "ID_TYPE",
                    "name": "机构客户",
                    "list": [{
                        "business": [ //除去经办人和法人以外的自己单独配到business里面
                        ],
                        'commonList': commonList
                    }]
                },
                {
                    "img": require("../../../images/produce.png"),
                    "type": "ID_TYPE",
                    "name": "产品客户",
                    "list": [{
                        "business": [ //除去经办人和法人以外的自己单独配到business里面
                        ],
                        'commonList': commonList
                    }]
                }
            ],
            bizRoutes: [{
                    name: "沪A转托管",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0003",
                    query: {
                        stkbd: "shA_czd"
                    },
                    isCommit: false,
                    nextBtnText: '下一页'
                },
                {
                    name: "沪B转托管",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0003",
                    query: {
                        stkbd: "shB_czd"
                    },
                    isCommit: false,
                    prevBtnText: '上一页',
                    nextBtnText: '下一页'
                },
                {
                    name: "深A转托管",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0003",
                    query: {
                        stkbd: "szA_ztg"
                    },
                    isCommit: false,
                    prevBtnText: '上一页',
                    nextBtnText: '下一页'
                },
                {
                    name: "深B转托管",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0003",
                    query: {
                        stkbd: "szB_ztg"
                    },
                    prevBtnText: '上一页',
                    nextBtnText: '确认无误'
                },
            ]
        },
        // 市价委托开通业务
        "V0004": {
            open: true,
            explain: " 本功能适用于为您市价委托权限开通业务。如您的年龄在18-70周岁之间，您还可以通过网上营业厅、手机金太阳APP自助办理本权限的开通。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                    "img": require("../../../images/person.png"),
                    "type": "ID_TYPE",
                    "name": "个人客户",
                    "list": [{
                        "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                    }]
                },
                {
                    "img": require("../../../images/organization.png"),
                    "type": "ID_TYPE",
                    "name": "机构客户",
                    "list": [{
                        "business": [ //业务需要的部分
                        ],
                        'commonList': commonList
                    }]
                },
                {
                    "img": require("../../../images/produce.png"),
                    "type": "ID_TYPE",
                    "name": "产品客户",
                    "list": [{
                        "business": [ //业务需要的部分
                        ],
                        'commonList': commonList
                    }]
                }
            ],
            bizRoutes: [{
                name: "开通市价格委托",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0",
            }]
        },
        // 客户密码重置
        "V0005": {
            open: true,
            pageCount: 20,
            explain: "<div>本功能适用于为您临柜办理密码重置业务，您需要携带身份证明文件到营业网点现场办理。</div><div style=\"color:red\">融资融券业务密码暂不支持重置，请临柜办理。</div><div>密码重置过程中请您再次核对您的账户信息（行业、职业、学历等）是否准确无误；</div>",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "产品管理人营业执照复印件"
                        },
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }]
        },
        // 三方存管变更
        "V0006": {
            open: true,
            seeMore: '查看全部支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            pageCount: 5,
            explain: "本功能适用于个人客户在营业网点现场办理三方存管银行变更业务，VTM自助办理支持选择的新存管银行如下：中国工商银行、中国银行、中国农业银行、中国建设银行等，其它银行请前往柜台办理。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                        "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                    },
                    {
                        "name": "2.	 新存管银行银行卡"
                    }
                ]
    
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": []
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": []
            }],
            bizRoutes: [{
                    name: "原存管银行",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    isCommit: false,
                },
                // {
                //     name: "读取银行卡",
                //     path: "/readBankCard"
                // },
                {
                    name: "新存管银行",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1"
                }
            ]
        },
        //证券账户关联关系确认
        "V0007": {
            open: true,
            pageCount: 99999,
            explain: "<div>本功能适用于您办理证券账户关联关系，即您申请确认名下沪深A/B股等证券账户与您一码通账户之间关联关系的业务。</div><div>办理时间：交易日9:00 – 16:00</div>",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                }, {
                    "name": "2.	《证券资产权属证明》（非必须）"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "《证券资产权属证明》（非必须）"
                        },
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "《证券资产权属证明》（非必须）"
                        },
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }]
        },
        //一码通合并
        "V0008": {
            open: true,
            pageCount: 99999,
            explain: "<div>       本功能适用于为您办理名下多个一码通账户的合并业务（即，通过完成关联关系转挂及注销多余一码通账户的业务办理，最终实现多个一码通账户的合并）。</div><div>办理时间：交易日9:00 – 16:00</div>",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }]
        },
        // 关键信息变更
        "V0009": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您在营业网点现场办理关键资料变更业务，关键资料包含姓名、证件类型及证件号码（简称三要素）；您可通过该功能办理三要素变更（不能同时修改姓名、证件号码）、一代身份证换二代身份证、15位身份证升级为18位身份证。<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp办理该业务前请确保您满足以下条件：<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp1.	确保您的资金账户状态正常，可以正常登录交易终端<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp2.	因中国结算要求，请确保您的证券账户关联关系都处于已确认；（可咨询现场人员或95536）<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp3.	若您之前曾向中国结算申请并修改了姓名或证件号码中的一项，也不能办理此业务<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp4.不存在其他导致业务办理失败的原因",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证 "
                }, {
                    "name": "2.	若需变更姓名和证件号码任意一项，则需要提供变更证明"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "若需变更客户名称和证件号码任意一项，则需要提供变更证明"
                        },
                        {
                            "name": "详询现场工作人员或致电95536。"
                        }
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "若需变更客户名称和证件号码任意一项，则需要提供变更证明"
                        },
                        {
                            "name": "详询现场工作人员或致电95536。"
                        }
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType",
                isCommit: false,
                checkFieldChange: true,
            }, {
                name: "修改对比",
                path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                show: true,
                ignorePrev: true,
            }]
        },
        // 客户风险测评
        "V0010": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于更新和完善风险测评。<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp您还可以通过网上营业厅、手机金太阳APP自助办理本业务。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
    
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "风险测评",
                path: "/bizFlow/:busiCode/:userType/customerEvaluating"
            }]
        },
        // 客户资料完善
        "V0011": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于您在办理业务前规范您在我公司的证件有效期（含正常升位）、非居民涉税信息以及风险测评信息，若您符合下列情形时需要先完成本业务：<br>1.	您的证件过期或仍为第一代居民身份证；<br>2.	您的非居民涉税信息不完整时；<br>3.	您的风险测评已过期。<br>如有疑问，请详询现场工作人员！",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "若需变更客户名称和证件号码任意一项，则需要提供变更证明"
                        },
                        {
                            "name": "详询现场工作人员或致电95536。"
                        }
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "若需变更客户名称和证件号码任意一项，则需要提供变更证明"
                        },
                        {
                            "name": "详询现场工作人员或致电95536。"
                        }
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: {
                "0": [{ // 个人路由
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType",
                    isCommit: false,
                    checkFieldChange: true,
                }, {
                    name: "修改对比",
                    path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                    show: true,
                    ignorePrev: true,
                }, {
                    name: "风险测评",
                    path: "/bizFlow/:busiCode/:userType/customerEvaluating"
                }],
                "1": [{ // 客户基本信息
                    name: "客户基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    group: "CUST_BASIC_INFO",
                    modules: ["CUST_BASIC_INFO_STEP1"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //银行信息
                    name: "银证信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    group: "CUST_BASIC_INFO",
                    modules: ["CUST_BANK_INFO"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "账户持有人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    group: "ORG_TAX_INFO",
                    modules: ["ACCOUT_HOLDER_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "涉税信息1",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TYPE_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息2
                    name: "涉税信息2",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_FLAG_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "涉税信息3",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/5",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_INFO_MODULE1", "ORG_TAX_INFO_MODULE2", "ORG_TAX_INFO_MODULE3"],
                    isCommit: false,
                    checkFieldChange: true,
                }, {
                    name: "涉税控制人涉税信息",
                    path: "/bizFlow/:busiCode/:userType/bizOrgTaxControlInfo",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_CONTROL_INFO"],
                    show: true,
                }, { // 客户基本信息
                    name: "所控机构信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/6",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_CONTROL_INFO_MODULE1", "ORG_CONTROL_INFO_MODULE2"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //银行信息
                    name: "控制人涉税居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/7",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE1", "ORG_TAX_CONTROLER_MODULE2"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "控制人涉税联系地址",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/8",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE3", "ORG_TAX_CONTROLER_MODULE4"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "控制人涉税序列号",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/9",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE5", "ORG_TAX_CONTROLER_MODULE6", "ORG_TAX_CONTROLER_MODULE7"],
                    isCommit: false,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步'
                }, {
                    name: "修改对比",
                    path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                    show: true,
                    ignorePrev: true,
                }, {
                    name: "风险测评",
                    path: "/bizFlow/:busiCode/:userType/customerEvaluating"
                }],
                "2": [{ // 客户基本信息
                    name: "客户基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    group: "CUST_BASIC_INFO",
                    modules: ["CUST_BASIC_INFO_STEP1"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //银行信息
                    name: "银证信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    group: "CUST_BASIC_INFO",
                    modules: ["CUST_BANK_INFO"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "账户持有人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    group: "ORG_TAX_INFO",
                    modules: ["ACCOUT_HOLDER_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "涉税信息1",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TYPE_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息2
                    name: "涉税信息2",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_FLAG_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "涉税信息3",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/5",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_INFO_MODULE1", "ORG_TAX_INFO_MODULE2", "ORG_TAX_INFO_MODULE3"],
                    isCommit: false,
                    checkFieldChange: true,
                }, {
                    name: "涉税控制人涉税信息",
                    path: "/bizFlow/:busiCode/:userType/bizOrgTaxControlInfo",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_CONTROL_INFO"],
                    show: true,
                }, { // 客户基本信息
                    name: "所控机构信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/6",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_CONTROL_INFO_MODULE1", "ORG_CONTROL_INFO_MODULE2"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //银行信息
                    name: "控制人涉税居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/7",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE1", "ORG_TAX_CONTROLER_MODULE2"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "控制人涉税联系地址",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/8",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE3", "ORG_TAX_CONTROLER_MODULE4"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "控制人涉税序列号",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/9",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE5", "ORG_TAX_CONTROLER_MODULE6", "ORG_TAX_CONTROLER_MODULE7"],
                    isCommit: false,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步'
                }, {
                    name: "修改对比",
                    path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                    show: true,
                    ignorePrev: true,
                }]
            }
        },
        // 修改手机号码
        "V0012": {
            open: true,
            pageCount: 20,
            explain: "<div>本功能适用于为个人客户办理修改手机号码业务。</div><div>手机号码分一般手机号码、认证手机号码。认证手机号码是识别您的身份的重要信息。修改认证手机号码需验证您的原、新手机号，如果您原认证手机号码无法验证，需要进行视频验证。</div>",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": []
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": []
            }],
            bizRoutes: [{
                name: "验证方式",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                isCommit: false
            }, {
                name: "验证原手机",
                path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                isCommit: false
            }, {
                name: "验证新手机",
                path: "/bizFlow/:busiCode/:userType/bizEntry/2"
            }]
        },
        //基金账户开户
        "V0013": {
            open: true,
            pageCount: 99999,
            explain: "<div>本功能适用于为您开通开放式基金账户的业务办理。如您是办理产品账户开通开放式基金账户，请与营业部现场人员联系，由现场人员协助完成。</div>",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "托管人或管理人有效身份证明文件"
                        },
                        {
                            "name": "法人代表证明书（加盖公章）"
                        },
                        {
                            "name": "法人代表授权委托书（加盖公章和法定代表人签章）"
                        },
                        {
                            "name": "法人代表身份证明文件复印件（加盖公章）"
                        },
                        {
                            "name": "经办人身份证明文件"
                        },
                    ],
                    'commonList': [ //业务共用部分，产品和机构是一样的
    
                    ]
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }]
        },
        //专业投资者开通
        "V0014": {
            open: true,
            pageCount: 99999,
            explain: " <div>本功能适用于为您申请成为专业投资者。</div><div>办理时间：交易日9:00 – 16:00。</div>专业投资者分为三类：<br><div>专业投资者Ⅰ类为经有关金融监管部门批准设立的金融机构及其理财产品，以及社会公益基金等；</div><div>专业投资者Ⅱ类为具有2年以上投资/工作经历的机构（最近1年末净资产不低于2000万元且金融资产不低于1000万元）或个人（金融资产不低于500万元或最近3年个人年均收入不低于50万元）；</div><div>专业投资者Ⅲ类为具有1年以上投资/工作经历的机构（最近1年末净资产不低于1000万元且金融资产不低于500万元）或个人（金融资产不低于300万元或最近3年个人年均收入不低于30万元）。</div>",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }, {
                    "name": "2.	 资产或收入证明（非必须）"
                }, {
                    "name": "3.	 投资经验证明或专业背景证明（非必须）"
                }, {
                    "name": "4. 	 专业资格证书（如CFA、CIIA、证券从业资格等）（非必须）"
                }]
            }, {
                /**
                 * 
                 * 新的需求是这样的，机构和产品户是有公共部分加上业务所带的资料
                 */
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "最近一年经审计的财务报表"
                        },
                        {
                            "name": "投资经验证明（非必须）"
                        },
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": []
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }, {
                name: "风险测评",
                path: "/bizFlow/:busiCode/:userType/customerEvaluating"
            }]
        },
        //销户
        "V0015": {
            open: true,
            explain: `本功能适用于为您预约办理一站式销户业务。本业务仅支持撤销您在我司的全部账户（包含：股东卡、开放式基金账户、资金账号等），在办理本业务前请确保您满足以下条件：</br>
            1.您的证券、基金股份已全部转出，上海市场指定交易已经撤销；</br>
            2.您的账户状态状态正常，不存在异常情况（如休眠、不合格或司法冻结等）；</br>
            3.您的账户不存在未完成委托或清算或交收的情形（如当前有交易或有未完成的新股申购、配股、委托、交收、融资等）；</br>
            4.您的账户不存在未撤销的业务权限（如沪、深债券合格投资者权限，小微贷权限，约定购回权限，金天利扫到权限，港股通权限、金三方权限等）；</br>
            5.您的证券账户未配号融资融券账户、股票期权账户；</br>
            6.您资金账户资金余额为零（今天有红利、派息及结息到账的不能办理）；</br>
            7.不存在其他导致业务办理不成功的情况。`,
            notify: "",
            extraTip: "", //特别提示
            infoList: [{
                    "img": require("../../../images/person.png"),
                    "type": "ID_TYPE",
                    "name": "个人客户",
                    "list": [{
                        "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                    }]
                },
                {
                    "img": require("../../../images/organization.png"),
                    "type": "ID_TYPE",
                    "name": "机构客户",
                    "list": [{
                        "business": [ //除去经办人和法人以外的自己单独配到business里面
                        ],
                        'commonList': commonList
                    }]
                },
                {
                    "img": require("../../../images/produce.png"),
                    "type": "ID_TYPE",
                    "name": "产品客户",
                    "list": [{
                        "business": [ //除去经办人和法人以外的自己单独配到business里面
                        ],
                        'commonList': commonList
                    }]
                }
            ],
            bizRoutes: [{
                    name: "系统内证券账户",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0015_0",
                    isCommit: false,
                    ignorePrev: true,
                    nextBtnText: '确认无误'
                },
                {
                    name: "中登内证券账户",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0015_1",
                    prevBtnText: '上一步',
                    nextBtnText: '跳过'
                },
            ]
        },
        //两网及退市公司股份转让权限开通
        "V0016": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您办理两网及退市公司股份转让权限开通业务。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }, ]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType"
                },
                {
                    name: "适当性匹配结果",
                    path: "/custMatchResult"
                },
            ]
        },
        //挂牌公司股份转让权限开通
        "V0017": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您办理挂牌公司（包括挂牌公司合格投资者与挂牌公司受限投资者）股份转让权限开通业务。<div color='#EA384C'>办理时间：交易日9:00 – 16:00。</div> 成功申请成为挂牌公司合格投资者后，您可以参与全国中小企业股份转让系统内各类证券的交易。若您已经是公司挂牌前的股东或通过定向发行持有挂牌公司股份的股东，但因不符合参与挂牌公司股票公开转让条件而无法申请成为挂牌公司合格投资者的，您可以办理挂牌公司受限投资者交易权限，办理成功后，您方可以买卖已持有的挂牌公司股票。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }, {
                    "name": "2.	10个转让日日均金融资产500万元以上相关证明材料（挂牌公司受限投资者无需提供）"
                }, {
                    "name": "3.	2年以上投资经历或2年以上金融相关工作经历或金融机构高管任职经历证明材料（挂牌公司受限投资者无需提供）"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "会计师事务所最90近日内出具的验资报告或最近一期审计报告（需满足实收资本/实收股本/实缴出资总额500万元人民币以上）（挂牌公司受限投资者或专业投资者1类无需提供）"
                        },
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "产品成立或备案文件等证明材料"
                        },
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }, {
                name: "适当性匹配结果",
                path: "/custMatchResult"
            }]
        },
        // 沪深债券合格投资者权限开通
        "V0018": {
            open: true,
            pageCount: 20,
            explain: "<div>本功能适用于为您办理债券合格投资者权限开通业务；</div><div style='color:red'>办理时间：交易日9:00-16:00</div>",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }, {
                    "name": "2. 20个交易日日均金融资产500万元以上相关证明材料或最近3年年均收入不低于50万元证明材料"
                }, {
                    "name": "3. 2年以上投资经历或2年以上金融相关工作经历或金融机构高管任职经历证明或从事金融相关业务的注册会计师、律师职业资格证书（非必须）。"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "最近一年经审计的财务报表（需能够体现净资产不低于2000万元人民币，同时金融资产不低于1000万元人民币。注：专业投资者I类机构客户无需提供）"
                        },
                        {
                            "name": "期货、黄金、外汇市场两年以上投资交易经历证明。"
                        }
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "产品成立或备案文件等证明材料。"
                        }
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }, {
                name: "风险测评",
                path: "/bizFlow/:busiCode/:userType/customerEvaluating"
            }, {
                name: "适当性匹配结果",
                path: "/custMatchResult"
            }, ]
        },
        //V0019期权开户双录
        "V0019": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于您修改留存在我司的账户非关键信息。若您符合下列情形时需要先完成本业务：<br>办理该业务前请确保您符合以下条件：<br>1.有效的身份证明文件；<br>2.不存在其他导致业务办理失败的原因。<br>如有疑问，请详询现场工作人员！",
            notify: "",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: {
                "0": [{
                    name: "业务导航",
                    path: "/bizFlow/:busiCode/:userType/bizChangeNavigation",
                    show: true,
                    ignorePrev: true,
                    isShowPrev: true,
                    isShowNext: true,
                    prevBtnText: '继续修改',
                    nextBtnText: '确认无误'
                }, {
                    name: "身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    show: true,
                    ignorePrev: true,
                }, {
                    name: "联系信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    show: true,
                    ignorePrev: true,
                }, {
                    name: "其他联系人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    show: true,
                    ignorePrev: true,
                }, {
                    name: "税收居民身份",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    show: true,
                    ignorePrev: true,
                }, {
                    name: "修改对比",
                    path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                    show: true,
                    ignorePrev: true,
                }],
                "1": [{ // 客户基本信息
                    name: "客户基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    group: "CUST_BASIC_INFO",
                    modules: ["CUST_BASIC_INFO_STEP1"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //银行信息
                    name: "银证信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    group: "CUST_BASIC_INFO",
                    modules: ["CUST_BANK_INFO"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "账户持有人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    group: "ORG_TAX_INFO",
                    modules: ["ACCOUT_HOLDER_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "涉税信息1",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TYPE_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息2
                    name: "涉税信息2",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_FLAG_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "涉税信息3",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/5",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_INFO_MODULE1", "ORG_TAX_INFO_MODULE2", "ORG_TAX_INFO_MODULE3"],
                    isCommit: false,
                    checkFieldChange: true,
                }, {
                    name: "涉税控制人涉税信息",
                    path: "/bizFlow/:busiCode/:userType/bizOrgTaxControlInfo",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_CONTROL_INFO"],
                    show: true,
                }, { // 客户基本信息
                    name: "所控机构信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/6",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_CONTROL_INFO_MODULE1", "ORG_CONTROL_INFO_MODULE2"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //银行信息
                    name: "控制人涉税居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/7",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE1", "ORG_TAX_CONTROLER_MODULE2"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "控制人涉税联系地址",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/8",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE3", "ORG_TAX_CONTROLER_MODULE4"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "控制人涉税序列号",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/9",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE5", "ORG_TAX_CONTROLER_MODULE6", "ORG_TAX_CONTROLER_MODULE7"],
                    isCommit: false,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步'
                }, {
                    name: "修改对比",
                    path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                    show: true,
                    ignorePrev: true,
                }, {
                    name: "风险测评",
                    path: "/bizFlow/:busiCode/:userType/customerEvaluating"
                }],
                "2": [{ // 客户基本信息
                    name: "客户基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    group: "CUST_BASIC_INFO",
                    modules: ["CUST_BASIC_INFO_STEP1"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //银行信息
                    name: "银证信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    group: "CUST_BASIC_INFO",
                    modules: ["CUST_BANK_INFO"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "账户持有人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    group: "ORG_TAX_INFO",
                    modules: ["ACCOUT_HOLDER_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "涉税信息1",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TYPE_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息2
                    name: "涉税信息2",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_FLAG_MODULE"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "涉税信息3",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/5",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_INFO_MODULE1", "ORG_TAX_INFO_MODULE2", "ORG_TAX_INFO_MODULE3"],
                    isCommit: false,
                    checkFieldChange: true,
                }, {
                    name: "涉税控制人涉税信息",
                    path: "/bizFlow/:busiCode/:userType/bizOrgTaxControlInfo",
                    group: "ORG_TAX_INFO",
                    modules: ["ORG_TAX_CONTROL_INFO"],
                    show: true,
                }, { // 客户基本信息
                    name: "所控机构信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/6",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_CONTROL_INFO_MODULE1", "ORG_CONTROL_INFO_MODULE2"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //银行信息
                    name: "控制人涉税居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/7",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE1", "ORG_TAX_CONTROLER_MODULE2"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "控制人涉税联系地址",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/8",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE3", "ORG_TAX_CONTROLER_MODULE4"],
                    isCommit: false,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "控制人涉税序列号",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/9",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE5", "ORG_TAX_CONTROLER_MODULE6", "ORG_TAX_CONTROLER_MODULE7"],
                    isCommit: false,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步'
                }, {
                    name: "修改对比",
                    path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                    show: true,
                    ignorePrev: true,
                }, {
                    name: "风险测评",
                    path: "/bizFlow/:busiCode/:userType/customerEvaluating"
                }]
            }
        },
        "V0020": {
            open: true,
            pageCount: 9999,
            explain: "您可以通过本功能开通股票期权账户。如您在办理过程中遇到问题，请详询现场工作人员",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }, {
                    "name": "2.	银行卡（签约银行仅支持工行、农行、中行、建行、交行、招行、中信、浦发、兴业）"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "提供存管银行开立的法人结算账户资料原件，以及加盖机构公章法人结算账户资料复印件；"
                        },
                        {
                            "name": "公司上一季度末经审计的资产负债表；（如未经审计的需要临柜办理）"
                        },
                        {
                            "name": txtConfig.$txtcfg[baseConfig.$basecfg.qsVersion].v0020BizInfo
                        },
                        {
                            "name": "相关监管机构、主管机关的批准文件或者证明文件（如私募投资基金管理人登记证明、金融机构经营许可证等）复印件（加盖公章）（机构期权专业投资者）"
                        }
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "提供存管银行开立的法人结算账户资料原件，以及加盖机构公章法人结算账户资料复印件；"
                        },
                        {
                            "name": "产品备案函以及合同复印件（加盖公章）"
                        }
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                    name: "期权专业投资者",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0020",
                    show: false,
                    isShowPrev: false,
                }, {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType",
                },
                {
                    name: "适当性匹配结果",
                    path: "/custMatchResult"
                }
            ]
    
        },
        //V0021 在境内工作生活的港澳台居民开户（居住证）
        "V0021": {
            open: true,
            isReview: 1, //需要审核
            pageCount: 9999,
            seeMore: '查看全部支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            explain: "本功能适用于为在境内工作生活的港澳台开立沪深AB股东卡、沪深封闭式基金账户，用以买卖股票及场内基金。<br>办理该业务前请确保您满足以下条件：<br>1.	具有处于有效期的港澳居民居住证或台湾居民居住证<br>2.	不存在其他导致业务办理失败的原因",
            extraTip: "", //特别提示
            seeMore: '支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.港澳台居民居住证"
                }, {
                    "name": "2.香港居民通行证/澳门居民通行证/台湾居民通行证"
                }]
            }],
            bizRoutes: {
                "0": [{ // 客户基本信息
                        name: "资料填写",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                        group: "CUST_INFO",
                        useNavStep: true,
                        modules: ["CUST_BASIC_INFO", "CUST_OTHER_ID_INFO", "CUST_LINK_INFO", "CUST_OTHER_INFO", "CUST_ACCT_INFO"],
                    },
                    { //涉税信息
                        name: "资料填写",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                        group: "CUST_TAX_INFO",
                        useNavStep: true,
                        modules: ["CUST_TAX_INFO_MODULE1", "CUST_TAX_INFO_MODULE2", "CUST_TAX_INFO_MODULE3", "CUST_TAX_INFO_MODULE4", "CUST_TAX_INFO_MODULE5", "CUST_TAX_INFO_MODULE6", "CUST_TAX_INFO_MODULE7"],
                    },
                    { //三方存管信息
                        name: "资料填写",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                        group: "ACCT_INFO",
                        useNavStep: true,
                        modules: ["CNY_BANK_INFO"],
                    }, { //证券市场信息
                        name: "选择开户市场",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                        group: "ACCT_INFO",
                        useNavStep: true,
                        modules: ["CUST_TRDACCT_INFO"],
                    }, { //设置账户密码
                        name: "设置账户密码",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/5",
                        group: "ACCT_INFO",
                        modules: ["CUST_PWD_INFO"],
                    }, {
                        name: "适当性匹配结果",
                        path: "/custMatchResult"
                    }
                ],
            }
        },
        "V0026": {
            open: true,
            pageCount: 99999,
            explain: " 本功能适用于为您办理沪/深退市整理期股票交易权限开通业务（您也可以通过网上营业厅自助开通本权限）。<div style='color:#ea384c'>办理时间：交易日9:00-16:00</div>",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                /**
                 * 
                 * 新的需求是这样的，机构和产品户是有公共部分加上业务所带的资料
                 */
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分    
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分    
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }, {
                name: "适当性匹配结果",
                path: "/custMatchResult"
            }]
        },
        //上海风险警示期权限开通
        "V0027": {
            open: true,
            pageCount: 99999,
            explain: "本功能适用于为您预约办理上海市场风险警示股票买入权限开通业务。您也可以通过网上营业厅自助办理本权限的开通。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                /**
                 * 
                 * 新的需求是这样的，机构和产品户是有公共部分加上业务所带的资料
                 */
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分    
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分    
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                    name: "系统内沪A证券",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0027",
                    ignorePrev: true,
                    nextBtnText: '确认无误'
                },
                {
                    name: "适当性匹配结果",
                    path: "/custMatchResult"
                }
            ]
        },
        //V0030 内存账户开户
        "V0030": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您开通内存交易系统的交易功能。如有疑问，请与营业部现场人员联系，由现场人员协助完成；办理时间： 交易日09: 00 - 11: 30； 13: 00 - 15: 00 ",
            information: "有效身份证明文件，发证机关或有权机构出具的变更证明（修改姓名、证件类型、证件号码时需出具）",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }, {
                    "name": "2.	监护人身份证明文件（未成年人需提供）"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                        // {"name": "提供存管银行开立的法人结算账户资料原件，以及加盖机构公章法人结算账户资料复印件；"},
                        // {"name": "相关监管机构、主管机关的批准文件或者证明文件（如私募投资基金管理人登记证明、金融机构经营许可证等）复印件（加盖公章）"}
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                        // {"name": "提供存管银行开立的法人结算账户资料原件，以及加盖机构公章法人结算账户资料复印件；"},
                        // {"name": "产品备案函以及合同复印件（加盖公章）"}
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }]
        },
        //V0031 内存交易权限注销
        "V0031": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您办理注销内存交易系统的交易功能。如有疑问，请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件，发证机关或有权机构出具的变更证明（修改姓名、证件类型、证件号码时需出具）",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                        // {"name": "提供存管银行开立的法人结算账户资料原件，以及加盖机构公章法人结算账户资料复印件；"},
                        // {"name": "相关监管机构、主管机关的批准文件或者证明文件（如私募投资基金管理人登记证明、金融机构经营许可证等）复印件（加盖公章）"}
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                        // {"name": "提供存管银行开立的法人结算账户资料原件，以及加盖机构公章法人结算账户资料复印件；"},
                        // {"name": "产品备案函以及合同复印件（加盖公章）"}
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }]
        },
        "V0032": {
            open: true,
            pageCount: 99999,
            explain: " 本功能适用于为您办理专业投资者资格取消业务，您由专业投资者转化为普通投资者后，需重新进行一次风险承受能力评估。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                /**
                 * 
                 * 新的需求是这样的，机构和产品户是有公共部分加上业务所带的资料
                 */
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分    
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": []
            }],
            bizRoutes: [{
                name: "专业投资者注销",
                path: "/bizFlow/:busiCode/:userType/bizPage/V0032",
                nextBtnText: '确认无误'
            }, {
                name: "风险测评",
                path: "/bizFlow/:busiCode/:userType/customerEvaluating"
            }]
        },
        "V0033": {
            open: true,
            pageCount: 99999,
            explain: " 本功能适用于为您办理优先股合格投资者权限开通业务。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                /**
                 * 
                 * 新的需求是这样的，机构和产品户是有公共部分加上业务所带的资料
                 */
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分    
                        {
                            "name": "经审计的最新的年度资产负债表以及公司章程（需能够体现实收资本/实收股本总额、或者实缴出资总额不低于人民币500万元）"
                        },
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分    
                        {
                            "name": "产品成立或备案文件等证明材料"
                        },
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }, {
                name: "适当性匹配结果",
                path: "/custMatchResult"
            }]
        },
        //V0034 账户查询
        // "V0034": {
        //     open: true,
        //     pageCount: 20,
        //     explain: "本功能适用于为您办理账户查询业务，包括：客户信息查询、账户信息查询、账户资产查询等。",
        //     notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
        //     extraTip: "", //特别提示
        //     infoList: [{
        //         "img": require("../../../images/person.png"),
        //         "type": "ID_TYPE",
        //         "name": "个人客户",
        //         "list": [{
        //             "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
        //         }]
        //     }, {
        //         "img": require("../../../images/organization.png"),
        //         "type": "ID_TYPE",
        //         "name": "机构客户",
        //         "list": [{
        //             "business": [ //业务需要的部分
        //                 // {"name": "提供存管银行开立的法人结算账户资料原件，以及加盖机构公章法人结算账户资料复印件；"},
        //                 //{"name": "相关监管机构、主管机关的批准文件或者证明文件（如私募投资基金管理人登记证明、金融机构经营许可证等）复印件（加盖公章）"}
        //             ],
        //             'commonList': commonList
        //         }]
        //     }, {
        //         "img": require("../../../images/produce.png"),
        //         "type": "ID_TYPE",
        //         "name": "产品客户",
        //         "list": [{
        //             "business": [ //业务需要的部分
        //                 // {"name": "提供存管银行开立的法人结算账户资料原件，以及加盖机构公章法人结算账户资料复印件；"},
        //                 //{"name": "产品备案函以及合同复印件（加盖公章）"}
        //             ],
        //             'commonList': commonList
        //         }]
        //     }],
        //     bizRoutes: [{
        //             name: "要查询的账户信息",
        //             path: "/bizFlow/:busiCode/:userType/bizPage/V0034_type_page",
        //             isCommit: false
        //         },
        //         {
        //             name: "基本信息",
        //             path: "/bizFlow/:busiCode/:userType/bizEntry/0",
        //             prevBtnText: '上一页',
        //             nextBtnText: '下一页',
        //             isCommit: false
        //         },
        //         {
        //             name: "账户信息",
        //             path: "/bizFlow/:busiCode/:userType/bizPage/V0034_accout_page",
        //             prevBtnText: '上一页',
        //             nextBtnText: '下一页',
        //             isCommit: false
        //         },
        //         {
        //             name: "资产信息",
        //             path: "/bizFlow/:busiCode/:userType/bizPage/V0034_found_page",
        //             pageIndex: "isShowFoundMessage",
        //             prevBtnText: '上一页',
        //             isCommit: false
        //         },
        //     ]
        // },
        //V0035 普通个人开户
        "V0035-0": {
            open: true,
            pageCount: 9999,
            seeMore: '查看全部支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            explain: "本功能适用于为年龄介于18周岁（含）至70周岁（含）持境内居民身份证的个人开立沪深A股东卡、沪深封闭式基金账户，用以买卖股票及场内基金。<br>办理该业务前请确保您满足以下条件：<br>1.	具有处于有效期境内居民身份证<br>2.	不存在其他导致业务办理失败的原因",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            seeMore: '支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }, {
                    "name": "2.	银行卡（签约银行仅支持工行、农行、中行、建行、交行、招行、中信、浦发、兴业）"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": []
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": []
            }],
            bizRoutes: {
                "0": [{ // 客户基本信息
                    name: "客户基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    group: "CUST_INFO",
                    modules: ["BASIC_TITLE_MODULE", "CUST_BASIC_INFO", "CUST_LINK_INFO", "CUST_OTHER_INFO", "CUST_ACCT_INFO"],
                }, { //涉税信息
                    name: "税收居民身份",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    group: "CUST_TAX_INFO",
                    modules: ["TAX_TITLE_MODULE", "CUST_TAX_INFO_MODULE1", "CUST_TAX_INFO_MODULE2", "CUST_TAX_INFO_MODULE3", "CUST_TAX_INFO_MODULE4", "CUST_TAX_INFO_MODULE5", "CUST_TAX_INFO_MODULE6", "CUST_TAX_INFO_MODULE7"],
                }, { //三方存管信息
                    name: "三方存管信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    group: "ACCT_INFO",
                    modules: ["CNY_BANK_INFO"],
                }, { //证券市场信息
                    name: "证券市场信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    group: "ACCT_INFO",
                    modules: ["CUST_TRDACCT_INFO"],
                }, { //设置账户密码
                    name: "设置账户密码",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                    group: "ACCT_INFO",
                    modules: ["CUST_PWD_INFO"],
                }],
            }
        },
        //V0043 长期不使用客户标识检查资料展示
        "V0043": {
            open: true,
            pageCount: 9999,
            seeMore: '查看全部支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            explain: "本功能适用于为年龄介于18周岁（含）至70周岁（含）持境内居民身份证的个人开立沪深A股东卡、沪深封闭式基金账户，用以买卖股票及场内基金。<br>办理该业务前请确保您满足以下条件：<br>1.	具有处于有效期境内居民身份证<br>2.	不存在其他导致业务办理失败的原因",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            seeMore: '支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }, {
                    "name": "2.	银行卡（签约银行仅支持工行、农行、中行、建行、交行、招行、中信、浦发、兴业）"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": []
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": []
            }],
            bizRoutes: {
                "0": [{ // 客户基本信息
                    name: "客户基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    group: "CUST_INFO",
                    modules: ["BASIC_TITLE_MODULE", "CUST_BASIC_INFO", "CUST_LINK_INFO", "CUST_OTHER_INFO", "CUST_ACCT_INFO"],
                    isCommit: false
                }, { //涉税信息
                    name: "税收居民身份",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    group: "CUST_TAX_INFO",
                    modules: ["TAX_TITLE_MODULE", "CUST_TAX_INFO_MODULE1", "CUST_TAX_INFO_MODULE2", "CUST_TAX_INFO_MODULE3", "CUST_TAX_INFO_MODULE4", "CUST_TAX_INFO_MODULE5", "CUST_TAX_INFO_MODULE6", "CUST_TAX_INFO_MODULE7"],
                    isCommit: false
                    // },{ //三方存管信息
                    //     name: "三方存管信息",
                    //     path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    //     group: "ACCT_INFO",
                    //     modules: ["CNY_BANK_INFO"],
                    // isCommit: false
                    // },{ //证券市场信息
                    //     name: "证券市场信息",
                    //     path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    //     group: "ACCT_INFO",
                    //     modules: ["CUST_TRDACCT_INFO"],
                        // isCommit: false
                }],
                "1": [{
                    name: "机构基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    group: "CUST_INFO",
                    modules: ["CUST_BASE_INFO", "CUST_IMPORTANT_INFO", "CUST_LINK_INFO"],
                    isCommit: false
                }, {
                    name: "机构法人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    group: "LEGAL_INFO",
                    isCommit: false
                }, {
                    name: "机构涉税信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    group: "CUST_TAX_INFO",
                    modules: ["CUST_HOLDER_NAME", "ORG_TAX_INFO", "CONTROLLER_TAX_INFO", "CONTROLLER_INFO", "CONTROL_ORG_INFO", "TAX_NUM_INFO"],
                    isCommit: false
                }]
            }
        },
        //V0038 签署电子签名约定书
        "V0038": {
            open: true,
            pageCount: 20,
            explain: `本功能适用于自然人投资者办理签署电子签名约定书（经纪）业务。`,
            information: "",
            notify: "",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": []
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": []
            }],
            bizRoutes: [{
                name: "签署电子签名约定书（经纪）",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0",
            }]
        },
        //V0039 协议补签
        "V0039": {
            open: true,
            pageCount: 20,
            explain: `本功能适用于为您办理协议补签业务，包括开户文本补签、三方存管协议补签。
                      <div>如有疑问，请详询现场工作人员！</div>`,
            information: "",
            notify: "",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "协议补签",
                path: "/bizFlow/:busiCode/:userType/bizPage/V0039",
            }]
        },
        // 增加市场
        "V0040": {
            open: true,
            pageCount: 20,
            explain: `本功能适用于为您设置添加股东账户。
                      <div>如果您是个人客户，您还可以通过网上营业厅、手机金太阳APP自助办理设置添加股东账户。</div>
                      <div style='color:red'>办理时间：交易日9:00 – 16:00</div>`,
            information: "",
            notify: "",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "交易市场",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0",
            }, {
                name: "查看所有",
                path: "/bizFlow/:busiCode/:userType/bizPage/V0040",
                show: false,
                isShowNext: false,
                prevBtnText: '返回',
            }, {
                name: "添加方式",
                path: "/bizFlow/:busiCode/:userType/bizEntry/1",
            }, {
                name: "账户加挂",
                path: "/bizFlow/:busiCode/:userType/bizEntry/2",
            }, {
                name: "适当性匹配结果",
                path: "/custMatchResult"
            }, ]
        },
        //V0041 设置主股东
        "V0041": {
            open: true,
            pageCount: 20,
            explain: `本功能适用为已在我司开立多个深A股东账户或沪A股东账户的客户，设置在委托买卖股份时默认使用的证券账户，进而方便客户进行委托交易与账户管理。
                      <br>办理该业务前请确保您符合以下条件：
                      <br>1.在我司具有多个深A股东账户或多个沪A股东账户；
                      <br>2.不存在其他导致业务办理失败的原因。`,
            information: "",
            notify: "",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': commonList
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }]
        },
    
        //V0042 港股通权限开通
        "V0042": {
            open: true,
            pageCount: 20,
            explain: "港股通交易权限可通过手机金太阳app、网上营业厅、国信金太阳网上交易客户端自助开通，无需临柜办理。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;详询现场工作人员或致电95536",
            notify: "",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": []
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": []
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": []
            }],
            bizRoutes: []
        },
        //V0050 机构开户业务 
        "V0050": {
            open: true,
            pageCount: 9999,
            explain: "本功能适用于为境内持工商营业执照的普通机构开立沪深A股东卡、沪深封闭式基金账户，用以买卖股票及场内基金。<br>办理该业务前请确保您符合以下条件：<br>1.具有处于有效期内的工商营业执照；<br>2.不存在其他导致业务办理失败的原因。",
            notify: "",
            extraTip: "", //特别提示
            seeMore: '支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            supportIdType: ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1A", "1B", "1H", "1Z"],
            infoList: [{
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "境内持工商营业执照的普通机构法人开户",
                "list": [{
                        "name": "1. 营业执照副本原件（标注为“统一社会信用代码”），留存加盖公章的营业执照副本复印件；"
                    },
                    {
                        "name": "2. 公司章程，留存加盖机构公章的原件；"
                    },
                    {
                        "name": "3. 法定代表人证明书，留存加盖公章的原件；"
                    },
                    {
                        "name": "4. 法定代表人的有效身份证明材料原件，留存加盖公章的复印件；"
                    },
                    {
                        "name": "5. 法定代表人授权委托书（附表25），留存加盖公章的原件；"
                    },
                    {
                        "name": "6. 经办人有效身份证明材料原件，留存加盖公章的复印件；"
                    },
                    {
                        "name": "7. 机构控股股东、机构实际控制人、机构受益人的证明文件原件，留加盖公章复印件；或者能证明机构控股股东、机构实际控制人、机构受益人的其他材料；"
                    },
                    {
                        "name": "8. 机构控股股东、机构实际控制人、机构受益人的身份证明文件原件，留加盖公章复印件；"
                    },
                    {
                        "name": "9. 存管银行开立的法人结算账户资料原件，留存加盖公章法人结算账户资料复印件；"
                    },
                    {
                        "name": "10. 《印鉴卡》原件；"
                    },
                    {
                        "name": "11. 机构投资者属于私募基金管理人的还应提供产品管理人备案证明原件，留存加盖公章的复印件。"
                    }
                ]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "境内持工商营业执照的合伙及创投企业开户",
                "list": [{
                        "name": "1. 机构有效身份证明文件；"
                    },
                    {
                        "name": "2. 合伙协议或投资各方签署的创业投资企业合同及章程，留存加盖机构公章的原件；"
                    },
                    {
                        "name": "3. 全体合伙人或投资者名单，留存加盖机构公章的原件；"
                    },
                    {
                        "name": "4. 全体合伙人有效身份证明文件原件，留存加盖公章的复印件；"
                    },
                    {
                        "name": "5. 执行事务合伙人或负责人证明书，留存加盖机构公章的原件；"
                    },
                    {
                        "name": "6. 执行事务合伙人或负责人有效身份证明文件原件，留存加盖机构公章的复印件；"
                    },
                    {
                        "name": "7. 执行事务合伙人或负责人对经办人的授权委托书，留存加盖机构公章的原件；"
                    },
                    {
                        "name": "8. 经办人有效身份证明材料原件，留存加盖机构公章的复印件；"
                    },
                    {
                        "name": "9. 机构控股股东、机构实际控制人、机构受益人的证明文件原件，留存加盖公章复印件；或者能证明其机构控股股东、机构实际控制人、机构受益人的其他材料；"
                    },
                    {
                        "name": "10. 机构控股股东、机构实际控制人、机构受益人的身份证明文件原件，留存加盖公章复印件；"
                    },
                    {
                        "name": "11. 提供存管银行开立的法人结算账户资料原件，留存加盖公章复印件；"
                    },
                    {
                        "name": "12. 《印鉴卡》原件；"
                    }
                ]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "境内特殊机构开户",
                "list": [{
                        "name": "1. 处于有效期内的工商营业执照（含统一社会信息代码）；"
                    },
                    {
                        "name": "2. 中国结算开立的证券账户确认单原件；"
                    },
                    {
                        "name": "3. 金融机构营业许可证或经营许可证；"
                    },
                    {
                        "name": "4. 公司章程；"
                    },
                    {
                        "name": "5. 法定代表人证明书，留存加盖公章的原件；"
                    },
                    {
                        "name": "6. 法定代表人有效身份证明，留存加盖公章的复印件；"
                    },
                    {
                        "name": "7. 法定代表人授权委托书，留存加盖公章的原件；"
                    },
                    {
                        "name": "8. 经办人有效身份证明，留存加盖公章的复印件；"
                    },
                    {
                        "name": "9. 机构控股股东、机构实际控制人、机构受益人的证明文件原件，留存加盖公章复印件；或者能证明其机构控股股东、机构实际控制人、机构受益人的其他材料；"
                    },
                    {
                        "name": "10. 机构控股股东、机构实际控制人、机构受益人的身份证明文件原件，留存加盖公章复印件；"
                    },
                    {
                        "name": "11. 存管银行开立的法人结算账户资料原件，留存加盖公章复印件；"
                    },
                    {
                        "name": "12. 《印鉴卡》原件；"
                    }
                ]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "境内持其他证件的机构法人开户",
                "list": [{
                        "name": "1. 处于有效期内的社团法人登记证明或事业单位登记证明或机关法人成立批文。（标注为“统一社会信用代码”），留存加盖公章的营业执照副本复印件；"
                    },
                    {
                        "name": "2. 公司章程，留存加盖机构公章的原件；"
                    },
                    {
                        "name": "3. 法定代表人的有效身份证明材料原件，留存加盖公章的复印件；"
                    },
                    {
                        "name": "4. 法定代表人授权委托书，留存加盖公章的原件；"
                    },
                    {
                        "name": "5. 经办人有效身份证明材料原件，留存加盖公章的复印件；"
                    },
                    {
                        "name": "6. 机构控股股东、机构实际控制人、机构受益人的证明文件原件，留加盖公章复印件；或者能证明机构控股股东、机构实际控制人、机构受益人的其他材料；"
                    },
                    {
                        "name": "7. 机构控股股东、机构实际控制人、机构受益人的身份证明文件原件，留加盖公章复印件；"
                    },
                    {
                        "name": "8. 存管银行开立的法人结算账户资料原件，留存加盖公章法人结算账户资料复印件；"
                    },
                    {
                        "name": "9. 《印鉴卡》原件；"
                    }
                ]
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "持境外身份证件的普通境外机构开户",
                "list": [{
                        "name": "1. 投资者有效身份证明文件（经认证或公证的有效商业登记证明文件）原件，留存加盖公章的复印件；"
                    },
                    {
                        "name": "2. 经公证或认证的公司章程、董事会决议、股东会决议等能够证明授权主体具有合法授权资格的相关证明文件原件，留存加盖公章的原件；"
                    },
                    {
                        "name": "3. 授权人有效身份证明文件，留存加盖公章的复印件；"
                    },
                    {
                        "name": "4. 经公证或认证的董事会或董事、主要股东等出具的授权委托书，或符合规定的其他相关授权书，留存加盖公章的原件；"
                    },
                    {
                        "name": "5. 经办人有效身份证明文件原件，留存加盖公章的复印件；"
                    },
                    {
                        "name": "6. 机构控股股东、机构实际控制人、机构受益人的证明文件原件，留存加盖公章复印件；或者能证明其机构控股股东、机构实际控制人、机构受益人的其他材料；"
                    },
                    {
                        "name": "7. 机构控股股东、机构实际控制人、机构受益人的身份证明文件原件，留加盖公章复印件；"
                    },
                    {
                        "name": "8. 《印鉴卡》原件；"
                    },
                    {
                        "name": "9. 客户提供材料非中文应按要求提供并留存中文译本；"
                    },
                ]
            }],
            bizRoutes: [{
                    name: "开户经办人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    group: "RELA_INFO",
                    modules: ["ORG_ACCOUNT_MANAGER_INFO"],
                    // isCommit: false,
                },
                {
                    name: "业务导航",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0050",
                    show: true,
                    nextBtnText: '提交',
                    isCommit: false,
                    // checkFieldChange: true,
                },
                {
                    name: "基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    group: "CUST_INFO",
                    modules: ["CUST_BASIC_INFO", "CUST_IMPORTANT_INFO", "CUST_LINK_INFO"],
                    // isCommit: false,
                }
            ]
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