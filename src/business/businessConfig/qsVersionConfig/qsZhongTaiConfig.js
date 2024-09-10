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
    ZHONGTAI: {
        // 创业板交易权限开通
        "V0001": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您办理首次开通注册制创业板权限，请在我司现场工作人员协助下完成权限办理。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }]
            },  
                {
                        img: require("../../../images/organization.png"),
                        type: "ID_TYPE",
                        name: "机构客户",
                        list: [
                            {
                                business: [
                                ],
                                commonList: commonList,
                            },
                        ],
                    },
                    {
                        img: require("../../../images/produce.png"),
                        type: "ID_TYPE",
                        name: "产品客户",
                        list: [
                            {
                                business: [
                                    {
                                        name: "产品管理人营业执照复印件",
                                    },
                                ],
                                commonList: commonList,
                            },
                        ],
                    },
                ],
            bizRoutes: [{
                name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0001",
                    nextBtnText: "确认无误",
                }
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
                        "business": [ //业务需要的部分
                        ],
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
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            }]
        },
        // 客户密码重置
        "V0005": {
            open: true,
            pageCount: 20,
            explain: "<div>本功能适用于为您临柜办理密码维护业务，您需要携带身份证明文件到营业网点现场办理。</div><div style=\"color:red\"></div><div>密码维护过程中请您再次核对您的账户信息（行业、职业、学历等）是否准确无误；</div>",
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
            explain: "本功能适用于客户办理三方存管银行变更业务，支持选择的新存管银行如下：中国工商银行、中国银行、中国农业银行、中国建设银行等，其它银行请前往柜台办理。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                        "name": "1.  身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                    },
                    {
                        "name": "2.	 新存管银行银行卡"
                    }
                ]

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
                    name: "原存管银行",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    isCommit: false,
                },
                {
                    name: "新存管银行",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1"
                },
                {
                    name: "银证账户信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    group: ["BUSI_DATA"],
                    modules: ["BNAK_SECUACCT_INFO"]
                },
                // {
                //     name: "修改对比",
                //     path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                //     show: true,
                //     ignorePrev: true,
                // }
            ]
        },
        // 关键信息变更
        "V0009": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您办理关键资料变更业务，关键资料包含姓名、证件类型及证件号码（简称三要素）；您可通过该功能办理三要素变更（不能同时修改姓名、证件号码）、一代身份证换二代身份证、15位身份证升级为18位身份证。<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp办理该业务前请确保您满足以下条件：<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp1.	确保您的资金账户状态正常，可以正常登录交易终端<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp2.	因中国结算要求，请确保您的证券账户关联关系都处于已确认；（可咨询现场人员或95538）<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp3.	若您之前曾向中国结算申请并修改了姓名或证件号码中的一项，也不能办理此业务<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp4.不存在其他导致业务办理失败的原因",
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
            explain: "本功能适用于更新和完善风险测评。<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp您还可以通过网上营业厅、手机齐富通APP自助办理本业务。",
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
                path: "/bizFlow/:busiCode/:userType/customerEvaluating",
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
        //挂牌公司股份转让权限开通
        V0017: {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您办理挂牌公司（包括挂牌公司合格投资者与挂牌公司受限投资者）股份转让权限开通业务。<div color='#EA384C'>办理时间：交易日9:00 – 16:00。</div> 成功申请成为挂牌公司合格投资者后，您可以参与全国中小企业股份转让系统内各类证券的交易。若您已经是公司挂牌前的股东或通过定向发行持有挂牌公司股份的股东，但因不符合参与挂牌公司股票公开转让条件而无法申请成为挂牌公司合格投资者的，您可以办理挂牌公司受限投资者交易权限，办理成功后，您方可以买卖已持有的挂牌公司股票。",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [{
                            name: "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                        },
                        {
                            name: "2.	10个转让日日均金融资产500万元以上相关证明材料（挂牌公司受限投资者无需提供）",
                        },
                        {
                            name: "3.	2年以上投资经历或2年以上金融相关工作经历或金融机构高管任职经历证明材料（挂牌公司受限投资者无需提供）",
                        },
                    ],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [{
                        business: [{
                            name: "会计师事务所最90近日内出具的验资报告或最近一期审计报告（需满足实收资本/实收股本/实缴出资总额500万元人民币以上）（挂牌公司受限投资者或专业投资者1类无需提供）",
                        }, ],
                        commonList: commonList,
                    }, ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [{
                        business: [{
                            name: "产品成立或备案文件等证明材料",
                        }, ],
                        commonList: commonList,
                    }, ],
                },
            ],
            bizRoutes: {
                "0": [{
                        name: "资料采集",
                        path: "/bizFlow/:busiCode/:userType",
                        nextBtnText: "确认无误",
                    },
                    {
                        name: "风险测评",
                        path: "/bizFlow/:busiCode/:userType/customerEvaluating",
                        prevBtnText: "上一步",
                    },
                ],
                "1": [{
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType",
                    nextBtnText: "确认无误",
                }, ],
                "2": [{
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType",
                    nextBtnText: "确认无误",
                }, ],
            },
        },
        // 沪深债券合格投资者权限开通
        "V0018": {
            open: true,
            pageCount: 20,
            explain: "<div>本功能适用于为您办理债券合格投资者权限开通业务；</div>",
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
                    'commonList': [{
                        "name": "投资者有效身份证明文件（公司制法人为加载统一社会信用代码的新版营业执照，社团法人为社团法人登记证书，事业法人为事业单位法人证书，机关法人为机关法人成立批文等）及复印件;"
                    }, {
                        "name": "法定代表人证明书、法定代表人授权委托书和法定代表人的有效身份证明文件复印件（需加盖公章，授权委托书还需法定代表人签章）;"
                    }, {
                        "name": "经办人有效身份证明文件及复印件;"
                    }]
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分

                    ],
                    'commonList': [{
                        "name": "投资者有效身份证明文件（公司制法人为加载统一社会信用代码的新版营业执照，社团法人为社团法人登记证书，事业法人为事业单位法人证书，机关法人为机关法人成立批文等）及复印件;"
                    }, {
                        "name": "法定代表人证明书、法定代表人授权委托书和法定代表人的有效身份证明文件复印件（需加盖公章，授权委托书还需法定代表人签章）;"
                    }, {
                        "name": "经办人有效身份证明文件及复印件;"
                    }]
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0"
            }, {
                name: "资料采集2",
                path: "/bizFlow/:busiCode/:userType/bizEntry/1"
            }]
        },
        //V0019 非关键信息变更
        "V0019": {
            open: true,
            pageCount: 20,
            isReview: 1, //0-不需要预约审核；1-需要预约审核
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
                    'commonList': [ //业务共用部分，产品和机构是一样的
                        {
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
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分
                    ],
                    'commonList': [ //业务共用部分，产品和机构是一样的
                        {
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
                }]
            }],
            bizRoutes: {
                "0": [{
                    name: "身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    show: true,
                    group: "CUST_INFO",
                    modules: ["CUST_BASIC_INFO"],
                    nextBtnText: '下一步',
                    isCommit: true,
                    checkFieldChange: true,

                }, {
                    name: "联系信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    show: true,
                    group: "CUST_LINK_INFO",
                    modules: ["CUST_LINK_INFO"],
                    nextBtnText: '下一步',
                    isCommit: true,
                    checkFieldChange: true,
                }, { //涉税信息2
                    name: "其他联系人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    group: "RELA_INFO",
                    modules: ["CUST_OTHER_LINK_INFO"],
                    isCommit: true,
                    checkFieldChange: true,
                }, { // 信息同步页面
                    name: "信息同步",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    group: "SYNC_INFO_PAGE",
                    modules: ["SYNC_INFO_MODULE"],
                    isCommit: true,
                    checkFieldChange: true,
                }, {
                    name: "修改对比",
                    path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                    show: true,
                    ignorePrev: true,
                }],
                "1": [{
                    name: "身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    show: true,
                    group: "ORG_CUST_INFO",
                    modules: ["ORG_CUST_BASIC_MODULE"],
                    nextBtnText: '下一步',
                    isCommit: true,
                    checkFieldChange: true,

                }, {
                    name: "重要信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    show: true,
                    group: "ORG_IMPORT_INFO",
                    modules: ["ORG_IMPORT_INFO_MODULE"],
                    nextBtnText: '下一步',
                    isCommit: true,
                    checkFieldChange: true,
                }, {
                    name: "联系信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    show: true,
                    group: "ORG_CUST_LINK_INFO",
                    modules: ["ORG_CUST_LINK_MODULE"],
                    nextBtnText: '下一步',
                    isCommit: true,
                    checkFieldChange: true,
                }, { //涉税信息2
                    name: "法人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    group: "ORG_LEGAL_INFO",
                    modules: ["ORG_LEGAL_MODULE"],
                    isCommit: true,
                    checkFieldChange: true,
                }, {
                    name: "实际控制自然人",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                    show: true,
                    group: "ORG_CONTROLLER_INFO",
                    modules: ["ORG_CONTROLLER_MODULE"],
                    isCommit: true,
                    checkFieldChange: true,
                }, { //涉税信息2
                    name: "联系人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/5",
                    group: "ORG_RELA_INFO",
                    modules: ["ORG_LINK_INFO"],
                    isCommit: true,
                    checkFieldChange: true,
                }, { // 信息同步页面
                    name: "信息同步",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/6",
                    group: "SYNC_INFO_PAGE",
                    modules: ["SYNC_INFO_MODULE"],
                    isCommit: true,
                    checkFieldChange: true,
                }, {
                    name: "修改对比",
                    path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                    show: true,
                    ignorePrev: true,
                }],
                "2": [{
                    name: "身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    show: true,
                    group: "PRO_CUST_INFO",
                    modules: ["PRO_CUST_INFO_MODULE"],
                    nextBtnText: '下一步',
                    isCommit: true,
                    checkFieldChange: true,

                }, {
                    name: "重要信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    show: true,
                    group: "PRO_IMPORT_INFO",
                    modules: ["PRO_IMPORT_INFO_MODULE"],
                    nextBtnText: '下一步',
                    isCommit: true,
                    checkFieldChange: true,
                }, {
                    name: "联系信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    show: true,
                    group: "PRO_LINK_INFO",
                    modules: ["PRO_LINK_INFO_MODULE"],
                    nextBtnText: '下一步',
                    isCommit: true,
                    checkFieldChange: true,
                }, { //涉税信息2
                    name: "法人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    group: "PRO_LEGAL_INFO",
                    modules: ["PRO_LEGAL_INFO_MODULE"],
                    isCommit: true,
                    checkFieldChange: true,
                }, {
                    name: "实际控制自然人",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                    show: true,
                    group: "PRO_CONTROLLER_INFO",
                    modules: ["PRO_CONTROLLER_INFO_MODULE"],
                    isCommit: true,
                    checkFieldChange: true,
                }, { // 联系人信息
                    name: "联系人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/5",
                    group: "PRO_RELA_INFO",
                    modules: ["PRO_RELA_INFO_MODULE"],
                    isCommit: true,
                    checkFieldChange: true,
                }, { // 产品信息
                    name: "产品信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/6",
                    group: "PRO_INFO",
                    modules: ["PRO_INFO_MODULE1", "PRO_INFO_MODULE2", "PRO_INFO_MODULE3"],
                    isCommit: true,
                    checkFieldChange: true,
                }, { // 信息同步页面
                    name: "信息同步",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/7",
                    group: "SYNC_INFO_PAGE",
                    modules: ["SYNC_INFO_MODULE"],
                    isCommit: true,
                    checkFieldChange: true,
                }, {
                    name: "修改对比",
                    path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                    show: true,
                    ignorePrev: true,
                }],

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
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    group: "OPEN_OPTION_ACCOUNT_ADMITTANCE",
                    modules: ["CUST_MATCH", "RISK_ASSESSMENT"]
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    group: "OPEN_OPTION_ACCOUNT_ADMITTANCE",
                    modules: ["OPEN_OPTION_ACCOUNT_TYPE", "SH_OPTION_ACCOUNT", "SZ_OPTION_ACCOUNT"]
                },
                {
                    name: "证券账户展示",
                    path: "/bizFlow/:busiCode/:userType/bizPage/accout_page",
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    group: "OPEN_OPTION_ACCOUNT_CUSTINFO",
                    modules: ["CUSTINFO_BASIC"]
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    group: "OPEN_OPTION_ACCOUNT_MANAGER",
                    modules: ["MANAGER"]
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                    group: "OPEN_OPTION_ACCOUNT_OTHER",
                    modules: ["ORDEROPTITLE", "SETTOPTITLE", "FUNDOPTITLE"]
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/5",
                    group: "OPEN_OPTION_ACCOUNT_EXT",
                    modules: ["CUSTINFO_EXT"]
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/6",
                    group: "OPEN_OPTION_ACCOUNT_PWD",
                    modules: ["CUSTINFO_ACCOUNT_PWD", "EMAIL_PWD"]
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/7",
                    group: "OPEN_OPTION_ACCOUNT_CONTRACT",
                    modules: ["SH_CUSTINFO_ACCOUNT_INFO", "SZ_CUSTINFO_ACCOUNT_INFO"]
                },
                // {
                //     name: "适当性匹配结果",
                //     path: "/custMatchResult"
                // }
            ]

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
        //机构开户
        "V0050": {
            open: true,
            pageCount: 9999,
            seeMore: '查看全部支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            explain: "本功能适用于为境内持工商营业执照等证件的普通机构开立沪深A股东卡、沪深封闭式基金账户，用以买卖股票及场内基金。<p>办理该业务前请确保您符合以下条件：</p><p>1.具有处于有效期内的工商营业执照等证件；</p><p>2.不存在其他导致业务办理失败的原因</p>",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            seeMore: '支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": []
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            name: '签约银行银行卡潜影'
                        }
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
                    name: "开户经办人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/10",
                    group: "RELA_INFO",
                    isCommit: true,
                    beginFieldRuels: false,
                    modules: ["ORG_ASSIGN_PERSON_INFO"],
                }, {
                    name: "信息列表",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0050",
                    query: {
                        currentNum: "0"
                    },
                }, {
                    name: "基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/20",
                    group: "ORG_INFO",
                    isCommit: true,
                    modules: ["CUST_INFO_WRAP"]
                }, {
                    name: "基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/30",
                    group: "ORG_INFO",
                    isCommit: true,
                    modules: ["ORG_BASIC_INFO"]
                }, {
                    name: "重要信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/40",
                    group: "ORG_INFO",
                    isCommit: true,
                    modules: ["ORG_IMPORT_INFO", "ORG_LINK_INFO"]
                },
                {
                    name: "法人代表信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/50",
                    group: "RELA_INFO",
                    isCommit: true,
                    modules: ["ORG_LEGAL_REP_INFO", "ORG_CONTROLER_INFO"]
                }, {
                    name: "实际控制人和受益人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/60",
                    group: "RELA_INFO",
                    isCommit: true,
                    modules: ["ORG_BENEFICIARY_INFO", "ORG_LINKMAN_INFO"]
                }, {
                    name: "其他联系人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/70",
                    group: "RELA_INFO",
                    isCommit: true,
                    modules: ["ORG_PARTNER_INFO"]
                }, {
                    name: "诚信信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/80",
                    group: "RELA_INFO",
                    isCommit: true,
                    modules: ["CREDIT_RECORD_INFO"]
                }, {
                    name: "税收居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/90",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_PASSIVE_INFO", "ORG_TAX_INFO"]
                }, {
                    name: "客户身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/100",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_TAX_ADDRESS_INFO"]
                }, {
                    name: "税收信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/110",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_TAX_COUNTRY_INFO"]
                }, {
                    name: "涉税控制人涉税信息",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0050_controlTaxInfoNode",
                    isCommit: true,
                    show: true,
                }, {
                    name: "控制人涉税居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/120",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE1", "ORG_TAX_CONTROLER_MODULE2"],
                    isCommit: true,
                    checkFieldChange: true,
                    show: true,
                }, { //涉税信息
                    name: "控制人出生信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/130",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE3"],
                    isCommit: true,
                    checkFieldChange: true,
                    show: true,
                }, { //涉税信息
                    name: "控制人税收联系地址",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/140",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE4"],
                    isCommit: true,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步',
                    show: true,
                }, { //涉税信息
                    name: "控制人税收信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/145",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE5"],
                    isCommit: true,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步',
                    show: true,
                }, {
                    name: "风险测评",
                    path: "/bizFlow/:busiCode/:userType/customerEvaluating"
                }, {
                    name: "交易市场",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/150",
                    isCommit: false,
                    group: "TRADE_MARKET_INFO",
                    modules: ['TRADE_MARKET_INFO_STEP1', "TRADE_MARKET_INFO_STEP2"],
                    isCommit: true,
                }, {
                    name: "查看所有",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0050_showAllTrdacct",
                    show: false,
                    isShowNext: false,
                    prevBtnText: '返回',
                }, {
                    name: "新增加挂",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/160",
                    group: "ADDING_WAY_SELECT",
                    isCommit: true,

                }, {
                    name: "账户加挂",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/163",
                    group: "MOUNTED_ACCOUNT_SELECT",
                    isCommit: true,
                }, {
                    name: "网络服务",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/166",
                    group: "ACCT_INFO",
                    modules: ["NET_INFO"]
                }, {
                    name: "存管银行",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/170",
                    group: "ACCT_INFO",
                    isCommit: true,
                    modules: ["CNY_BANK_INFO", "HK_BANK_INFO", "US_BANK_INFO"]
                }, { //设置账户密码
                    name: "设置账户密码",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/180",
                    group: "ACCT_INFO",
                    isCommit: true,
                    modules: ["CUST_PWD_INFO"],
                }
                /*, {
                                    name: "适当性匹配结果",
                                    path: "/custMatchResult",
                                    group: "MOUNTED_ACCOUNT_SELECT",
                                    modules: ["MOUNTED_ACCOUNT_SELECT_STEP1"]
                                },*/
            ]
        },
        //V0051 产品户开户业务
        "V0051": {
            open: true,
            pageCount: 9999,
            explain: "本功能适用于为境内持工商营业执照等证件的普通机构开立沪深A股东卡、沪深封闭式基金账户，用以买卖股票及场内基金。<br>办理该业务前请确保您符合以下条件：<br>1.具有处于有效期内的工商营业执照等证件；<br>2.不存在其他导致业务办理失败的原因。",
            notify: "",
            extraTip: "", //特别提示
            seeMore: '支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            supportIdType: ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1A", "1B", "1H", "1Z", "1L"],
            infoList: [{
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                // "list": [{
                //         "name": "1. 营业执照副本原件（标注为“统一社会信用代码”），留存加盖公章的营业执照副本复印件；"
                //     },
                //     {
                //         "name": "2. 公司章程，留存加盖机构公章的原件；"
                //     },
                //     {
                //         "name": "3. 法定代表人证明书，留存加盖公章的原件；"
                //     },
                //     {
                //         "name": "4. 法定代表人的有效身份证明材料原件，留存加盖公章的复印件；"
                //     },
                //     {
                //         "name": "5. 法定代表人授权委托书（附表25），留存加盖公章的原件；"
                //     },
                //     {
                //         "name": "6. 经办人有效身份证明材料原件，留存加盖公章的复印件；"
                //     },
                //     {
                //         "name": "7. 机构控股股东、机构实际控制人、机构受益人的证明文件原件，留加盖公章复印件；或者能证明机构控股股东、机构实际控制人、机构受益人的其他材料；"
                //     },
                //     {
                //         "name": "8. 机构控股股东、机构实际控制人、机构受益人的身份证明文件原件，留加盖公章复印件；"
                //     },
                //     {
                //         "name": "9. 存管银行开立的法人结算账户资料原件，留存加盖公章法人结算账户资料复印件；"
                //     },
                //     {
                //         "name": "10. 《印鉴卡》原件；"
                //     },
                //     {
                //         "name": "11. 机构投资者属于私募基金管理人的还应提供产品管理人备案证明原件，留存加盖公章的复印件。"
                //     }
                // ],
                "list": []
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "机构客户",
                // "list": [{
                //         "name": "1. 机构有效身份证明文件；"
                //     },
                //     {
                //         "name": "2. 合伙协议或投资各方签署的创业投资企业合同及章程，留存加盖机构公章的原件；"
                //     },
                //     {
                //         "name": "3. 全体合伙人或投资者名单，留存加盖机构公章的原件；"
                //     },
                //     {
                //         "name": "4. 全体合伙人有效身份证明文件原件，留存加盖公章的复印件；"
                //     },
                //     {
                //         "name": "5. 执行事务合伙人或负责人证明书，留存加盖机构公章的原件；"
                //     },
                //     {
                //         "name": "6. 执行事务合伙人或负责人有效身份证明文件原件，留存加盖机构公章的复印件；"
                //     },
                //     {
                //         "name": "7. 执行事务合伙人或负责人对经办人的授权委托书，留存加盖机构公章的原件；"
                //     },
                //     {
                //         "name": "8. 经办人有效身份证明材料原件，留存加盖机构公章的复印件；"
                //     },
                //     {
                //         "name": "9. 机构控股股东、机构实际控制人、机构受益人的证明文件原件，留存加盖公章复印件；或者能证明其机构控股股东、机构实际控制人、机构受益人的其他材料；"
                //     },
                //     {
                //         "name": "10. 机构控股股东、机构实际控制人、机构受益人的身份证明文件原件，留存加盖公章复印件；"
                //     },
                //     {
                //         "name": "11. 提供存管银行开立的法人结算账户资料原件，留存加盖公章复印件；"
                //     },
                //     {
                //         "name": "12. 《印鉴卡》原件；"
                //     }
                // ],
                "list": []
            }, {
                "img": require("../../../images/organization.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                // "list": [{
                //         "name": "1. 处于有效期内的工商营业执照（含统一社会信息代码）；"
                //     },
                //     {
                //         "name": "2. 中国结算开立的证券账户确认单原件；"
                //     },
                //     {
                //         "name": "3. 金融机构营业许可证或经营许可证；"
                //     },
                //     {
                //         "name": "4. 公司章程；"
                //     },
                //     {
                //         "name": "5. 法定代表人证明书，留存加盖公章的原件；"
                //     },
                //     {
                //         "name": "6. 法定代表人有效身份证明，留存加盖公章的复印件；"
                //     },
                //     {
                //         "name": "7. 法定代表人授权委托书，留存加盖公章的原件；"
                //     },
                //     {
                //         "name": "8. 经办人有效身份证明，留存加盖公章的复印件；"
                //     },
                //     {
                //         "name": "9. 机构控股股东、机构实际控制人、机构受益人的证明文件原件，留存加盖公章复印件；或者能证明其机构控股股东、机构实际控制人、机构受益人的其他材料；"
                //     },
                //     {
                //         "name": "10. 机构控股股东、机构实际控制人、机构受益人的身份证明文件原件，留存加盖公章复印件；"
                //     },
                //     {
                //         "name": "11. 存管银行开立的法人结算账户资料原件，留存加盖公章复印件；"
                //     },
                //     {
                //         "name": "12. 《印鉴卡》原件；"
                //     }
                // ],
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "《印鉴卡》原件；"
                        }
                    ],
                    'commonList': [{
                            "name": "处于有效期内的工商营业执照（含统一社会信息代码）；"
                        },
                        {
                            "name": "中国结算开立的证券账户确认单原件；"
                        },
                        {
                            "name": "金融机构营业许可证或经营许可证；"
                        },
                        {
                            "name": "公司章程；"
                        },
                        {
                            "name": "法定代表人证明书，留存加盖公章的原件；"
                        },
                        {
                            "name": "法定代表人有效身份证明，留存加盖公章的复印件；"
                        },
                        {
                            "name": "法定代表人授权委托书，留存加盖公章的原件；"
                        },
                        {
                            "name": "经办人有效身份证明，留存加盖公章的复印件；"
                        },
                        {
                            "name": "机构控股股东、机构实际控制人、机构受益人的证明文件原件，留存加盖公章复印件；或者能证明其机构控股股东、机构实际控制人、机构受益人的其他材料；"
                        },
                        {
                            "name": "机构控股股东、机构实际控制人、机构受益人的身份证明文件原件，留存加盖公章复印件；"
                        },
                        {
                            "name": "存管银行开立的法人结算账户资料原件，留存加盖公章复印件；"
                        },

                    ]
                }]
            }],
            bizRoutes: [{
                    name: "开户经办人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/10",
                    group: "RELA_INFO",
                    modules: ["ORG_ASSIGN_PERSON_INFO"],
                    beginFieldRuels: false,
                }, {
                    name: "信息列表",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0051",
                    query: {
                        currentNum: "0"
                    },
                }, {
                    name: "基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/20",
                    group: "ORG_INFO",
                    isCommit: true,
                    modules: ["CUST_INFO_WRAP"]
                }, {
                    name: "基本信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/30",
                    group: "ORG_INFO",
                    modules: ["ORG_BASIC_INFO"]
                }, {
                    name: "重要信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/40",
                    group: "ORG_INFO",
                    modules: ["ORG_IMPORT_INFO", "ORG_LINK_INFO"]
                }, {
                    name: "法人代表信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/50",
                    group: "RELA_INFO",
                    modules: ["ORG_LEGAL_REP_INFO"]
                }, {
                    name: "实际控制人",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/60",
                    group: "RELA_INFO",
                    modules: ["ORG_CONTROLER_INFO", "ORG_BENEFICIARY_INFO"]
                }, {
                    name: "产品联系人信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/80",
                    group: "RELA_INFO",
                    modules: ["ORG_LINKMAN_INFO", "ORG_PARTNER_INFO"]
                }, {
                    name: "产品信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/85",
                    group: "RELA_INFO",
                    modules: ["PRODUCT_INFO"]
                }, {
                    name: "诚信信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/90",
                    group: "RELA_INFO",
                    modules: ["CREDIT_RECORD_INFO"]
                }, {
                    name: "税收居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/100",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_PASSIVE_INFO", "ORG_TAX_INFO"]
                }, {
                    name: "客户身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/110",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_TAX_ADDRESS_INFO"]
                }, {
                    name: "税收信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/120",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_TAX_COUNTRY_INFO"]
                }, {
                    name: "涉税控制人涉税信息",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0051_controlTaxInfoNode",
                    show: true,
                }, {
                    name: "控制人涉税居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/130",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE1", "ORG_TAX_CONTROLER_MODULE2"],
                    isCommit: true,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "控制人出生信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/140",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE3"],
                    isCommit: true,
                    checkFieldChange: true,
                }, { //涉税信息
                    name: "控制人税收联系地址",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/145",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE4"],
                    isCommit: true,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步'
                }, { //涉税信息
                    name: "控制人税收信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/150",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE5"],
                    isCommit: true,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步'
                }, {
                    name: "风险测评",
                    path: "/bizFlow/:busiCode/:userType/customerEvaluating"
                }, {
                    name: "交易市场",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/160",
                    isCommit: false,
                    group: "TRADE_MARKET_INFO",
                    modules: ['TRADE_MARKET_INFO_STEP1', "TRADE_MARKET_INFO_STEP2"],
                    isCommit: true,
                }, {
                    name: "查看所有",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0051_showAllTrdacct",
                    show: false,
                    isShowNext: false,
                    prevBtnText: '返回',
                }, {
                    name: "新增加挂",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/170",
                    group: "ADDING_WAY_SELECT",
                    isCommit: true,

                }, {
                    name: "账户加挂",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/173",
                    group: "MOUNTED_ACCOUNT_SELECT",
                    isCommit: true,
                }, {
                    name: "网络服务",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/175",
                    group: "ACCT_INFO",
                    modules: ["NET_INFO"]
                }, {
                    name: "存管银行",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/180",
                    group: "ACCT_INFO",
                    modules: ["CNY_BANK_INFO", "HK_BANK_INFO", "US_BANK_INFO"]
                }, { //设置账户密码
                    name: "设置账户密码",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/200",
                    group: "ACCT_INFO",
                    modules: ["CUST_PWD_INFO"],
                }
                /*, {
                                    name: "适当性匹配结果",
                                    path: "/custMatchResult",
                                    group: "MOUNTED_ACCOUNT_SELECT",
                                    modules: ["MOUNTED_ACCOUNT_SELECT_STEP1"]
                                },*/
            ]
        },
        "V0052": {
            open: true,
            pageCount: 9999,
            seeMore: '查看全部支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            explain: "本功能适用于持境内居民身份证等证件的个人开立沪深A股东卡、沪深封闭式基金账户，用以买卖股票及场内基金。<br>办理该业务前请确保您满足以下条件：<br>1.	具有处于有效期境内居民身份证等证件<br>2.	不存在其他导致业务办理失败的原因",
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
                "0": [{
                        name: "信息列表",
                        path: "/bizFlow/:busiCode/:userType/bizPage/V0052",
                        query: {
                            currentNum: "0"
                        },
                        isCommit: false,
                    }, {
                        name: "客户基本信息",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                        group: "CUST_INFO",
                        isCommit: true,
                        modules: ["CUST_INFO_WRAP"]
                    }, { // 客户基本信息
                        name: "客户基本信息",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/10",
                        group: "CUST_INFO",
                        modules: ["CUST_BASIC_INFO"],
                        isCommit: true,
                    }, { // 客户基本信息
                        name: "客户基本信息",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/20",
                        group: "CUST_INFO",
                        modules: ["CUST_OTHER_INFO", "CUST_PROF_INVESTOR_INFO"],
                        isCommit: true,
                    }, {
                        name: "客户联系信息",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/30",
                        group: "CUST_INFO",
                        modules: ["CUST_LINK_INFO", "CUST_OTHER_ID_INFO"],
                        isCommit: true,
                    }, {
                        //实际控制人+实际受益人
                        name: "关联人信息",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/40",
                        group: "RELA_INFO",
                        modules: ["CUST_CONTROLER_INFO", "CUST_OTHER_LINK_INFO"],
                        isCommit: true,
                    }, {
                        //其他联系人+诚信记录
                        name: "联系人信息",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/50",
                        group: "RELA_INFO",
                        modules: ["CUST_BENEFICIARY_INFO", "CREDIT_RECORD_INFO"],
                        isCommit: true,
                    }, {
                        //监护人信息
                        name: "监护人信息",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/60",
                        group: "RELA_INFO",
                        modules: ["CUST_GUARDIAN_INFO"],
                        isCommit: true,
                    }, { // 个人路由
                        name: "客户涉税信息",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/70",
                        isCommit: true,
                        checkFieldChange: true,
                        group: "TAX_INFO",
                        modules: ["CUST_TAX_INFO_MODULE1", "CUST_TAX_INFO_MODULE2"],
                    }, { // 个人路由
                        name: "联系地址",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/80",
                        isCommit: true,
                        checkFieldChange: true,
                        group: "TAX_INFO",
                        modules: ["CUST_TAX_INFO_MODULE3", "CUST_TAX_INFO_MODULE4"],
                    }, { // 个人路由
                        name: "税收信息",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/90",
                        isCommit: true,
                        checkFieldChange: true,
                        group: "TAX_INFO",
                        modules: ["CUST_TAX_INFO_MODULE5"],
                    }, {
                        name: "风险测评",
                        path: "/bizFlow/:busiCode/:userType/customerEvaluating"
                    },
                    {
                        name: "交易市场",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/100",
                        isCommit: false,
                        group: "TRADE_MARKET_INFO",
                        modules: ['TRADE_MARKET_INFO_STEP1', "TRADE_MARKET_INFO_STEP2"],
                        isCommit: true,
                    }, {
                        name: "查看所有",
                        path: "/bizFlow/:busiCode/:userType/bizPage/V0052_showAllTrdacct",
                        show: false,
                        isShowNext: false,
                        prevBtnText: '返回',
                    }, {
                        name: "新增加挂",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/110",
                        group: "ADDING_WAY_SELECT",
                        isCommit: true,

                    }, {
                        name: "账户加挂",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/120",
                        group: "MOUNTED_ACCOUNT_SELECT",
                        isCommit: true,
                    }, {
                        name: "网络服务",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/125",
                        group: "ACCT_INFO",
                        modules: ["NET_INFO"]
                    }, {
                        name: "存管银行",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/130",
                        group: "ACCT_INFO",
                        modules: ["CNY_BANK_INFO", "HK_BANK_INFO", "US_BANK_INFO"]
                    }, {
                        name: "设置账户密码",
                        path: "/bizFlow/:busiCode/:userType/bizEntry/140",
                        group: "ACCT_INFO",
                        modules: ["CUST_PWD_INFO"],
                        isCommit: true,
                    },
                ],
            }
        },
        // 证券转托管
        "V0053": {
            open: true,
            explain: `本功能适用于为您办理深圳市场的证券转托管业务。
        办理转托管前请确保您的账户满足以下条件：<br/>
        1.账户状态正常，不存在异常情形（如休眠、不合格或司法冻结等）；<br/>
        2.账户不存在未完成清算或交收的情形（如当日有交易或有未完成的新股申购、配股等）；<br/>
        3.账户不存在未了结债权债务的情形；<br/>
        4.其他导致不能转托管的情形`,
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
                name: "证券转托管",
                path: "/bizFlow/:busiCode/:userType/bizPage/V0053",
                query: {
                    stkbd: "ztg"
                },
                // prevBtnText: '下一步'
                nextBtnText: '下一步'
            }, ]
        },
        // 指定交易撤销
        "V0054": {
            open: true,
            explain: `本功能适用于为您办理上海市场证券账户的指定交易撤销业务。
        办理撤指定前请确保您的账户满足以下条件：<br/>
        1.账户状态正常，不存在异常情形（如休眠、不合格或司法冻结等）；<br/>
        2.账户不存在未完成清算或交收的情形（如当日有交易或有未完成的新股申购、配股等）；<br/>
        3.账户不存在未了结债权债务的情形；<br/>
        4.其他导致不能撤指定的情形`,
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
                name: "指定交易撤销",
                path: "/bizFlow/:busiCode/:userType",
                isCommit: true,
                nextBtnText: '下一步'
            }, ]
        },
        // 客户密码解锁
        "V0055": {
            open: true,
            pageCount: 40,
            explain: "<div>本功能适用于为您临柜办理密码解锁业务，您需要携带身份证明文件到营业网点现场办理。</div><div>密码解锁过程中请您再次核对您的账户信息（行业、职业、学历等）是否准确无误；</div>",
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
                name: "业务类型选择",
                path: "/bizFlow/:busiCode/:userType",
                isCommit: true,
                checkFieldChange: true,
            }]
        },
        // 指定交易
        "V0056": {
            open: true,
            explain: "本功能适用于为您办理上海市场证券账户的业务：账户指定交易业务",
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
                name: "账户指定交易",
                path: "/bizFlow/:busiCode/:userType",
                isCommit: true,
                nextBtnText: '下一步'
            }, ]
        },
        // 客户征信
        "V0057": {
            open: true,
            explain: `
            本功能适用于为您办理客户征信业务 `,
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
                name: "准入信息",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                group: "CUST_INFO_BASE",
                modules: ["CREDIT_CUST_INFO"],
            }, {
                name: "限售股信息",
                path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                group: "CUST_INFO_BASE",
                modules: ["HAVE_RES_STOCK_INFO", "RES_STOCK_INFO"],
            }, {
                name: "紧急联系人信息",
                path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                group: "CUST_INFO",
                beginFieldRuels: false, //页面激活 不执行关联逻辑，防止清除数据
                modules: ["LINKMAN_INFO"],
            }, {
                name: "关联人信息",
                path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                group: "CUST_INFO",
                beginFieldRuels: false, //页面激活 不执行关联逻辑，防止清除数据
                modules: ["HAVE_RELATION_INFO", "RELATION_INFO"],
            }, {
                name: "上市公司关联人信息",
                path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                group: "CUST_INFO",
                beginFieldRuels: false, //页面激活 不执行关联逻辑，防止清除数据
                modules: ["HAVE_RELATED_PERSON_INFO", "RELATED_PERSON_INFO"],
            }, {
                name: "知识测评",
                path: "/bizFlow/:busiCode/:userType/customerEvaluating"
            }, {
                name: "级别评定",
                path: "/bizFlow/:busiCode/:userType/bizEntry/5",
                group: "CREDIT_INFO_NODE",
                modules: ["CREDIT_INFO"],
            }, {
                name: "额度申请",
                path: "/bizFlow/:busiCode/:userType/bizEntry/6",
                group: "CREDIT_ASSET",
                modules: ["CREDIT_LINE_INFO", "TOTAL_ASSET", "INT_RATE_INFO"]
            }, ]
        },
        // 信用账户开户
        "V0058": {
            open: true,
            explain: `
            本功能适用于为您办理信用账户开户业务 `,
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
                name: "资料检查1",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                group: "INFO_CHECK",
                modules: ["CUST_INFO_CHECK", "CUACCT_INFO_CHECK"],
            }, {
                name: "资料检查2",
                path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                group: "INFO_CHECK",
                modules: ["TRDACCT_INFO_CHECK"],
            }, {
                name: "资料同步",
                path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                group: "ACCT_INFO",
                modules: ["INFO_SYNC"],
            }, {
                name: "开户信息",
                path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                group: "ACCT_INFO",
                modules: ["TRDACCT_INFO", "BANK_SECURITIES", "BANK_ACCT_INFO"],
            }, {
                name: "密码设置",
                path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                group: "ACCT_INFO",
                modules: ["PWD_INFO"]
            }, {
                name: "合同录入",
                path: "/bizFlow/:busiCode/:userType/bizEntry/5",
                group: "ACCT_INFO",
                modules: ["CON_INFO"],
                isCommit: false
            }, ]
        },
        // 股东账户开户
        "V0059": {
            open: true,
            pageCount: 20,
            explain: `本功能适用于为您设置添加股东账户。
            <div>如果您是个人客户，您还可以通过网上营业厅、手机齐富通APP自助办理设置添加股东账户。</div>
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
                path: "/bizFlow/:busiCode/:userType/bizPage/V0059",
                show: false,
                isShowNext: false,
                prevBtnText: '返回',
            }, {
                name: "添加方式",
                path: "/bizFlow/:busiCode/:userType/bizEntry/1",
            }, {
                name: "账户加挂",
                path: "/bizFlow/:busiCode/:userType/bizEntry/2",
            }, ]
        },
        // OTC账户开户
        "V0060": {
            open: true,
            pageCount: 40,
            explain: "<div>本功能适用于为您临柜办理OTC交易开户业务，您需要携带身份证明文件到营业网点现场办理。",
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
            }, {
                name: "风险测评",
                path: "/bizFlow/:busiCode/:userType/customerEvaluating",
                prevBtnText: '上一步',
            }]
        },
        //资产账户开户
        "V0061": {
            open: true,
            pageCount: 40,
            explain: "<div>本功能适用于为您临柜办理资产账户开户业务，您需要携带身份证明文件到营业网点现场办理。",
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
                name: "账户信息",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0"
            }, {
                name: "存管信息",
                path: "/bizFlow/:busiCode/:userType/bizEntry/1"
            }]
        },
        //存管账户开户
        "V0062": {
            open: true,
            pageCount: 40,
            explain: "<div>本功能适用于为您临柜办理存管账户开户业务，您需要携带身份证明文件到营业网点现场办理。</div>",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [{
                "img": require("../../../images/person.png"),
                "type": "ID_TYPE",
                "name": "个人客户",
                "list": [{
                    "name": "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证"
                }, {
                    "name": "2.新存管银行银行卡"
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
                    name: "业务类型选择",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    isCommit: true,
                    nextBtnText: '下一步'
                },
                // {
                //     name: "修改对比",
                //     path: "/bizFlow/:busiCode/:userType/bizInfoChange",
                //     show: true,
                //     ignorePrev: true,
                // }
            ]
        },
        //V0063 三方存管开户(产品户专用)
        "V0063": {
            open: true,
            pageCount: 40,
            explain: "本功能适用于为您开通三方存管开户(产品户专用)功能。如有疑问，请与营业部现场人员联系，由现场人员协助完成；",
            information: "有效身份证明文件，发证机关或有权机构出具的变更证明（修改姓名、证件类型、证件号码时需出具）",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
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
                "list": [{
                    "business": [ //业务需要的部分
                        {
                            "name": "客户银行账户复印件"
                        },
                    ],
                    'commonList': [{
                        "name": "投资者有效身份证明文件（公司制法人为加载统一社会信用代码的新版营业执照，社团法人为社团法人登记证书，事业法人为事业单位法人证书，机关法人为机关法人成立批文等）及复印件；"
                    }, {
                        "name": "法定代表人证明书、法定代表人授权委托书和法定代表人的有效身份证明文件复印件（需加盖公章，授权委托书还需法定代表人签章）；"
                    }, {
                        "name": "经办人有效身份证明文件及复印件;"
                    }]
                }]
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType",
            }]
        },
        //客户额度激活
        "V0064": {
            open: true,
            pageCount: 40,
            explain: "<div>本功能适用于为您临柜办理客户额度激活业务，您需要携带身份证明文件到营业网点现场办理。</div>",
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
                name: "业务类型选择",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                isCommit: true,
                nextBtnText: '下一步'
            }]
        },
        //客户额度激活
        "V0064": {
            open: true,
            pageCount: 40,
            explain: "<div>本功能适用于为您临柜办理客户额度激活业务，您需要携带身份证明文件到营业网点现场办理。</div>",
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
                name: "业务类型选择",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                isCommit: true,
                nextBtnText: '下一步'
            }]
        },
        // 科创板交易权限开通
        "V0065": {
            open: true,
            pageCount: 20,
            explain: "科创板交易权限开通",
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
                    name: "系统内沪A证券",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0065",
                    //ignorePrev: true,
                    nextBtnText: '确认无误'
                },
                {
                    name: "风险测评",
                    path: "/bizFlow/:busiCode/:userType/customerEvaluating",
                    prevBtnText: '上一步',
                }
            ]
        },
        //产品销售双录
        "V0066": {
            open: true,
            pageCount: 40,
            explain: "<div>本功能适用于为您临柜办理产品销售业务，您需要携带身份证明文件到营业网点现场办理。",
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
        "V0067": {
            open: true,
            pageCount: 9999,
            explain: "您可以通过本功能开通合约账户。如您在办理过程中遇到问题，请详询现场工作人员",
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
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                    group: "OPEN_OPTION_ACCOUNT_ADMITTANCE",
                    modules: ["CUST_MATCH", "RISK_ASSESSMENT"]
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                    group: "OPEN_OPTION_ACCOUNT_ADMITTANCE",
                    modules: ["OPEN_OPTION_ACCOUNT_TYPE", "SH_OPTION_ACCOUNT", "SZ_OPTION_ACCOUNT"]
                },
                {
                    name: "证券账户展示",
                    path: "/bizFlow/:busiCode/:userType/bizPage/accout_page"
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/2",
                    group: "OPEN_OPTION_ACCOUNT_CUSTINFO",
                    modules: ["CUSTINFO_BASIC"]
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/3",
                    group: "OPEN_OPTION_ACCOUNT_MANAGER",
                    modules: ["MANAGER"]
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/4",
                    group: "OPEN_OPTION_ACCOUNT_EXT",
                    modules: ["CUSTINFO_EXT"]
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/5",
                    group: "OPEN_OPTION_ACCOUNT_PWD",
                    modules: ["CUSTINFO_ACCOUNT_PWD"]
                },
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/6",
                    group: "OPEN_OPTION_ACCOUNT_CONTRACT",
                    modules: ["SH_CUSTINFO_ACCOUNT_INFO", "SZ_CUSTINFO_ACCOUNT_INFO"]
                },
                // {
                //     name: "适当性匹配结果",
                //     path: "/custMatchResult"
                // }
            ]

        },
        // 股转转托管
        "V0068": {
            open: true,
            explain: `本功能适用于为您办理股转转托管业务。
            办理转托管前请确保您的账户满足以下条件：<br/>
            1.账户状态正常，不存在异常情形（如休眠、不合格或司法冻结等）；<br/>
            2.账户不存在未完成清算或交收的情形（如当日有交易或有未完成的新股申购、配股等）；<br/>
            3.账户不存在未了结债权债务的情形；<br/>
            4.其他导致不能转托管的情形`,
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
                name: "股转转托管",
                path: "/bizFlow/:busiCode/:userType/bizPage/V0068",
                query: {
                    stkbd: "ztg"
                },
                // prevBtnText: '下一步'
                nextBtnText: '下一步'
            }, ]
        },
        // 场外柜台登记账户开户
        "V0069": {
            open: true,
            pageCount: 40,
            explain: "<div>本功能适用于为您临柜办理场外柜台登记账户开户业务，您需要携带身份证明文件到营业网点现场办理。",
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
            }, {
                name: "风险测评",
                path: "/bizFlow/:busiCode/:userType/customerEvaluating",
                prevBtnText: '上一步',
            }]
        },
        //非居民涉税信息
        "V0070": {
            open: true,
            pageCount: 9999,
            seeMore: '查看全部支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
            explain: "本功能适用于为境内持工商营业执照等证件的普通机构开立沪深A股东卡、沪深封闭式基金账户，用以买卖股票及场内基金。<p>办理该业务前请确保您符合以下条件：</p><p>1.具有处于有效期内的工商营业执照等证件；</p><p>2.不存在其他导致业务办理失败的原因</p>",
            notify: "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            seeMore: '支持银行', //资料详情页面 发送短信下面根据这个开关展示显示更多银行
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
            bizRoutes: {
                "0": [{ // 个人路由
                    name: "客户涉税信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/10",
                    isCommit: true,
                    checkFieldChange: true,
                    group: "TAX_INFO",
                    modules: ["CUST_TAX_INFO_MODULE1", "CUST_TAX_INFO_MODULE2"],
                }, { // 个人路由
                    name: "联系地址",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/20",
                    isCommit: true,
                    checkFieldChange: true,
                    group: "TAX_INFO",
                    modules: ["CUST_TAX_INFO_MODULE3", "CUST_TAX_INFO_MODULE4"],
                }, { // 个人路由
                    name: "税收信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/30",
                    isCommit: true,
                    checkFieldChange: true,
                    group: "TAX_INFO",
                    modules: ["CUST_TAX_INFO_MODULE5"],
                }],
                "1": [{
                    name: "税收居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/10",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_PASSIVE_INFO", "ORG_TAX_INFO"]
                }, {
                    name: "客户身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/20",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_TAX_ADDRESS_INFO"]
                }, {
                    name: "税收信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/30",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_TAX_COUNTRY_INFO"]
                }, {
                    name: "涉税控制人涉税信息",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0070_controlTaxInfoNode",
                    isCommit: true,
                    show: true,
                }, {
                    name: "控制人涉税居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/40",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE1", "ORG_TAX_CONTROLER_MODULE2"],
                    isCommit: true,
                    checkFieldChange: true,
                    show: true,
                }, { //涉税信息
                    name: "控制人出生信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/50",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE3"],
                    isCommit: true,
                    checkFieldChange: true,
                    show: true,
                }, { //涉税信息
                    name: "控制人税收联系地址",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/60",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE4"],
                    isCommit: true,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步',
                    show: true,
                }, { //涉税信息
                    name: "控制人税收信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/70",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE5"],
                    isCommit: true,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步',
                    show: true,
                }],
                "2": [{
                    name: "税收居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/10",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_PASSIVE_INFO", "ORG_TAX_INFO"]
                }, {
                    name: "客户身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/20",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_TAX_ADDRESS_INFO"]
                }, {
                    name: "税收信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/30",
                    group: "APPR_INFO",
                    isCommit: true,
                    modules: ["ORG_TAX_COUNTRY_INFO"]
                }, {
                    name: "涉税控制人涉税信息",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0070_controlTaxInfoNode",
                    isCommit: true,
                    show: true,
                }, {
                    name: "控制人涉税居民身份信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/40",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE1", "ORG_TAX_CONTROLER_MODULE2"],
                    isCommit: true,
                    checkFieldChange: true,
                    show: true,
                }, { //涉税信息
                    name: "控制人出生信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/50",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE3"],
                    isCommit: true,
                    checkFieldChange: true,
                    show: true,
                }, { //涉税信息
                    name: "控制人税收联系地址",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/60",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE4"],
                    isCommit: true,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步',
                    show: true,
                }, { //涉税信息
                    name: "控制人税收信息",
                    path: "/bizFlow/:busiCode/:userType/bizEntry/70",
                    group: "ORG_TAX_CONTROL_INFO",
                    modules: ["ORG_TAX_CONTROLER_MODULE5"],
                    isCommit: true,
                    checkFieldChange: true,
                    prevBtnText: '上一步',
                    nextBtnText: '下一步',
                    show: true,
                }]
            }
        },
        //V0071 大宗交易权限开通
        "V0071": {
            open: true,
            pageCount: 20,
            explain: `本业务可以为客户开通大宗交易权限`,
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
            }]
        },
        //V0072 私募产品合格投资者资质开通
        "V0072": {
            open: true,
            pageCount: 20,
            explain: `本业务可以为客户开通私募产品合格投资者资质权限`,
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
            }]
        },
        //专业投资者开通
        "V0073": {
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
            }],
            bizRoutes: [{
                name: "资料采集",
                path: "/bizFlow/:busiCode/:userType"
            },
            {
                name: "知识测评",
                path: "/bizFlow/:busiCode/:userType/customerEvaluating",
                prevBtnText:"上一步",
                show: false,
            }
        ]
        },
        //V0074 投顾业务签约
        "V0074": {
            open: true,
            pageCount: 20,
            explain: `本业务可以为客户开立投顾业务`,
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
                name: "投顾业务已签约信息",
                path: "/bizFlow/:busiCode/:userType/bizPage/V0074",
                show: true,
                isCommit: false,
            }, {
                name: "适当性信息",
                groupId: "CHECK_INFO",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                show: true
            }, {
                name: "签约信息",
                groupId: "SIGN_INFO",
                path: "/bizFlow/:busiCode/:userType/bizEntry/1",
                show: true
            }, ]
        },
        //V0075 证券账户开立
        "V0075": {
            open: true,
            pageCount: 20,
            explain: `本业务可以为客户开立证券账户`,
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
                "list": []
            }]
        },
        //V0076 证券账户查询
        "V0076": {
            open: true,
            pageCount: 20,
            explain: `本业务可以查询客户所开立的所有股东账户`,
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
                name: "证券账户查询",
                path: "/bizFlow/:busiCode/:userType/bizEntry/0",
                show: true,
                isCommit: false
            }, {
                name: "证券账户信息",
                path: "/bizFlow/:busiCode/:userType/bizPage/V0076",
                show: true,
                isCommit: false,
                isShowNext: false
            }]
        },
        //V0077 0.证券账户使用信息新增
        "V0077": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您办理证券账户使用信息新增业务",
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
                name: "证券账户使用信息新增",
                path: "/bizFlow/:busiCode/:userType/bizPage/V0077_accout_page",
                isCommit: true
            }]
        },
        //V0078 0.证券账户使用信息查询
        "V0078": {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您办理证券账户使用信息查询业务",
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
                name: "证券账户使用信息查询",
                path: "/bizFlow/:busiCode/:userType/bizPage/V0078_accout_page",
                isShowNext: false, //隐藏下一步按钮
                isCommit: false
            }]
        },
        //V0083 私募投资基金合格投资者资质开通
        V0083: {
            open: true,
            pageCount: 20,
            explain: `本业务可以为客户开通私募投资基金合格投资者资质权限`,
            information: "",
            notify: "",
            extraTip: "", //特别提示
            infoList: [
                {
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [
                        {
                            name:
                                "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                        },
                    ],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                            ],
                            commonList: commonList,
                        },
                    ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                            ],
                            commonList: commonList,
                        },
                    ],
                },
            ],
        },
        //V0084 私募资管产品合格投资者资质开通
        V0084: {
            open: true,
            pageCount: 20,
            explain: `本业务可以为客户开通私募资管产品合格投资者资质权限`,
            information: "",
            notify: "",
            extraTip: "", //特别提示
            infoList: [
                {
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [
                        {
                            name:
                                "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                        },
                    ],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                            ],
                            commonList: commonList,
                        },
                    ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                            ],
                            commonList: commonList,
                        },
                    ],
                },
            ],
        },
        //双录-私募产品风险揭示
        V0085: {
            open: true,
            pageCount: 40,
            explain:
                "<div>本功能适用于为您办理产品销售业务",
            notify:
                "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [
                {
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [
                        {
                            name:
                                "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                        },
                    ],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                            ],
                            commonList: commonList,
                        },
                    ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                                {
                                    name: "产品管理人营业执照复印件",
                                },
                            ],
                            commonList: commonList,
                        },
                    ],
                },
            ],
            bizRoutes: [
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType",
                },
            ],
        },

        //私募产品合同文件签署
        V0086: {
            open: true,
            pageCount: 40,
            explain:
                "<div>本功能适用于为你办理产品销售业务，您需要携带身份证明文件到营业网点现场办理。",
            notify:
                "请携带本人二代身份证办理（如证件账户类型为其他，请携带有效身份证明证件）",
            extraTip: "", //特别提示
            infoList: [
                {
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [
                        {
                            name:
                                "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                        },
                    ],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                            ],
                            commonList: commonList,
                        },
                    ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                                {
                                    name: "产品管理人营业执照复印件",
                                },
                            ],
                            commonList: commonList,
                        },
                    ],
                },
            ],
            bizRoutes: [
                {
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType",
                },
            ],
        },
        V0088: {
            open: true,
            explain:
                "您可通过本功能完成港股通交易权限开通。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
            infoList: [
                {
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [
                        {
                            name:
                                "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                        },
                    ],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [
                        {
                            business: [
                            ],
                            commonList: commonList,
                        },
                    ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [
                        {
                            business: [
                                {
                                    name: "产品管理人营业执照复印件",
                                },
                            ],
                            commonList: commonList,
                        },
                    ],
                },
            ],
            bizRoutes: {
                "0": [{
                        name: "资料采集",
                        path: "/bizFlow/:busiCode/:userType/bizPage/V0088",
                        nextBtnText: "确认无误",
                    },
                    {
                        name: "风险测评",
                        path: "/bizFlow/:busiCode/:userType/customerEvaluating",
                        prevBtnText: "上一步",
                    },
                ],
                "1": [{
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0088",
                    nextBtnText: "确认无误",
                }, ],
                "2": [{
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0088",
                    nextBtnText: "确认无误",
                }, ],
            },
        },
		V0089: {
            open: true,
            explain:
                "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
            infoList: [
                {
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [
                        {
                            name:
                                "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                        },
                    ],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [
                        {
                            business: [
                            ],
                            commonList: commonList,
                        },
                    ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [
                        {
                            business: [
                                {
                                    name: "产品管理人营业执照复印件",
                                },
                            ],
                            commonList: commonList,
                        },
                    ],
                },
            ],
            bizRoutes: [{
                name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0089",
                    nextBtnText: "确认无误",
                }
            ]
        },
        //客户退市整理交易权限开通
        V0090: {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您办理客户退市整理交易权限开通业务。",
            notify: "有效身份证明文件。",
            extraTip: "", //特别提示
            infoList: [{
                img: require("../../../images/person.png"),
                type: "ID_TYPE",
                name: "个人客户",
                list: [{
                    name: "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                }
                ],
            },
            {
                img: require("../../../images/organization.png"),
                type: "ID_TYPE",
                name: "机构客户",
                list: [{
                    business: [],
                    commonList: commonList,
                },],
            },
            {
                img: require("../../../images/produce.png"),
                type: "ID_TYPE",
                name: "产品客户",
                list: [{
                    business: [{
                        name: "产品管理人营业执照复印件",
                    }],
                    commonList: commonList,
                },],
            },
            ],
            bizRoutes: [{
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0090",
                    nextBtnText: "确认无误",
                }
                ]
        },
		V0091: {
            open: true,
            explain:
                "您可通过本功能开通上海风险警示协议。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
            infoList: [
                {
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [
                        {
                            name:
                                "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                        },
                    ],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [
                        {
                            business: [
                            ],
                            commonList: commonList,
                        },
                    ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [
                        {
                            business: [
                                {
                                    name: "产品管理人营业执照复印件",
                                },
                            ],
                            commonList: commonList,
                        },
                    ],
                },
            ],
            bizRoutes: [{
                name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0091",
                    nextBtnText: "确认无误",
                }
            ]
        },
        //私募债合格投资者开通
        V0093: {
            open: true,
            pageCount: 20,
            explain: "本功能适用于为您办理私募债合格投资者开通业务。",
            notify: "有效身份证明文件。",
            extraTip: "", //特别提示
            infoList: [{
                img: require("../../../images/person.png"),
                type: "ID_TYPE",
                name: "个人客户",
                list: [{
                    name: "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                }
                ],
            },
            {
                img: require("../../../images/organization.png"),
                type: "ID_TYPE",
                name: "机构客户",
                list: [{
                    business: [],
                    commonList: commonList,
                },],
            },
            {
                img: require("../../../images/produce.png"),
                type: "ID_TYPE",
                name: "产品客户",
                list: [{
                    business: [{
                        name: "产品管理人营业执照复印件",
                    }],
                    commonList: commonList,
                },],
            },
            ],
            bizRoutes: [{
                    name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0093",
                    nextBtnText: "确认无误",
                }
                ]
        },
        // 资产支持证券权限开通
        V0094: {
            open: true,
            pageCount: 20,
            explain: `本业务可以为客户开通资产支持证券权限`,
            information: "",
            notify: "",
            extraTip: "", //特别提示
            infoList: [
                {
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [
                        {
                            name:
                                "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                        },
                    ],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                            ],
                            commonList: commonList,
                        },
                    ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                            ],
                            commonList: commonList,
                        },
                    ],
                },
            ],
            bizRoutes: [{
                name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0094",
                    nextBtnText: "确认无误",
                }
            ]
        },
        V0095: {
            open: true,
            explain:
                "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
            infoList: [
                {
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [
                        {
                            name:
                                "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                        },
                    ],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [
                        {
                            business: [
                            ],
                            commonList: commonList,
                        },
                    ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [
                        {
                            business: [
                                {
                                    name: "产品管理人营业执照复印件",
                                },
                            ],
                            commonList: commonList,
                        },
                    ],
                },
            ],
            bizRoutes: [{
                name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0095",
                    nextBtnText: "确认无误",
                }
            ]
        },
        // 机构户暂停上市债券买入开通
        V0097: {
            open: true,
            pageCount: 20,
            explain: `本业务可以为客户开通机构户暂停上市债券买入权限`,
            information: "",
            notify: "",
            extraTip: "", //特别提示
            infoList: [
                {
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                            ],
                            commonList: commonList,
                        },
                    ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                            ],
                            commonList: commonList,
                        },
                    ],
                },
            ],
            bizRoutes: [{
                name: "资料采集",
                    path: "/bizFlow/:busiCode/:userType/bizPage/V0097",
                    nextBtnText: "确认无误",
                }
            ]
        },
        // 双录-分级基金交易权限开通
        "P9001": {
            open: true,
            explain: "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
            infoList: [{
                    "img": require("../../../images/person.png"),
                    "type": "ID_TYPE",
                    "name": "个人客户",
                    "list": [{
                        "business": [ //业务需要的部分
                        ],
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
        },
        // 双录-创业板交易权限开通
        "P9004": {
            open: true,
            explain: "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理创业板交易权限开通业务需有效身份证明文件，如办理转签可直接通过我公司网上营业厅（掌中投或官网）办理，无需亲临营业部现场。",
            extraTip: "",
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
        },
        //双录-非公开发行的优先股合格投资者权限开通
        "P0003": {
            open: true,
            explain: "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
            // bizRoutes: [{
            //     name: "适当性匹配结果",
            //     path: "/custMatchResult"
            // }, ]
        },
        // 双录-融资融券资格申请
        "P0050": {
            open: true,
            explain: "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
        },
        // 双录-股票期权开户
        "P0051": {
            open: true,
            explain: "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
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
        },
        // 双录-债券合格投资者权限开通
        "P9008": {
            open: true,
            explain: "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
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
                    'commonList': [{
                        "name": "投资者有效身份证明文件（公司制法人为加载统一社会信用代码的新版营业执照，社团法人为社团法人登记证书，事业法人为事业单位法人证书，机关法人为机关法人成立批文等）及复印件;"
                    }, {
                        "name": "法定代表人证明书、法定代表人授权委托书和法定代表人的有效身份证明文件复印件（需加盖公章，授权委托书还需法定代表人签章）;"
                    }, {
                        "name": "经办人有效身份证明文件及复印件;"
                    }]
                }]
            }, {
                "img": require("../../../images/produce.png"),
                "type": "ID_TYPE",
                "name": "产品客户",
                "list": [{
                    "business": [ //业务需要的部分

                    ],
                    'commonList': [{
                        "name": "投资者有效身份证明文件（公司制法人为加载统一社会信用代码的新版营业执照，社团法人为社团法人登记证书，事业法人为事业单位法人证书，机关法人为机关法人成立批文等）及复印件;"
                    }, {
                        "name": "法定代表人证明书、法定代表人授权委托书和法定代表人的有效身份证明文件复印件（需加盖公章，授权委托书还需法定代表人签章）;"
                    }, {
                        "name": "经办人有效身份证明文件及复印件;"
                    }]
                }]
            }],
        },
        // 双录-挂牌公司股份转让交易权限开通
        "P9011": {
            open: true,
            explain: "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
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
        },
        //P9014 双录-港股通交易权限开通
        "P9014": {
            open: true,
            explain:
                "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
            infoList: [
                {
                    img: require("../../../images/person.png"),
                    type: "ID_TYPE",
                    name: "个人客户",
                    list: [
                        {
                            name:
                                "1.身份证/港澳台居民居住证/港澳台居民通行证/外国人永久居留证/护照/港澳居民身份证",
                        },
                    ],
                },
                {
                    img: require("../../../images/organization.png"),
                    type: "ID_TYPE",
                    name: "机构客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                            ],
                            commonList: commonList,
                        },
                    ],
                },
                {
                    img: require("../../../images/produce.png"),
                    type: "ID_TYPE",
                    name: "产品客户",
                    list: [
                        {
                            business: [
                                //业务需要的部分
                                {
                                    name: "产品管理人营业执照复印件",
                                },
                            ],
                            commonList: commonList,
                        },
                    ],
                    
                },
            ],
        },
        // 双录-科创板股票交易权限开通
        "P9021": {
            open: true,
            explain: "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
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
        },
         // 双录-退市整理期交易权限开通
         "P9009": {
            open: true,
            explain: "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
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
            }]



        },
        // 双录-特定债券转让权限开通
        "P9027": {
            open: true,
            explain: "您可通过本功能完成相关业务权限开通或产品购买的录音录像。办理该业务请与营业部现场人员联系，由现场人员协助完成。",
            information: "有效身份证明文件。",
            notify: "办理双录业务需有效身份证明文件。",
            extraTip: "",
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
            }]
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
