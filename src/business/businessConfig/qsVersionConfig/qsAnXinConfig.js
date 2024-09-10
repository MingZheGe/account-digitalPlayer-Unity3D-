// 通用安信业务配置表
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
    ANXIN : {
        //标准版创业板交易权限开通
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