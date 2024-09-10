
const getAllMapInfo = function(qsName) {
    return _.extend(mappingConfig["COMMON"], mappingConfig[qsName]);
}

/**
 * 一柜通业务号与VTM业务号映射 做双录查询 双录类别与语音模板时需要用到
 */
const mappingConfig = {
    // 每个券商相同得映射
    "COMMON": {
        "V0001": {
            "YGT_BUSI_CODE": "Z0001A",
            "YGT_BUSI_NAME": "创业板交易权限开通"
        },
        "V0005": {
            "YGT_BUSI_CODE": "Z0005",
            "YGT_BUSI_NAME": "客户密码管理"
        },
        "V0006": {
            "YGT_BUSI_CODE": "Z0002",
            "YGT_BUSI_NAME": "三方存管变更"
        },
        "V0010": {
            "YGT_BUSI_CODE": "Z0210",
            "YGT_BUSI_NAME": "客户风险测评"
        },
        "V0014": {
            "YGT_BUSI_CODE": "Z0006",
            "YGT_BUSI_NAME": "专业投资者开通"
        },
        "V0016": {
            "YGT_BUSI_CODE": "Z0118",
            "YGT_BUSI_NAME": "两网及退市公司股份转让权限开通"
        },
        "V0017": {
            "YGT_BUSI_CODE": "Z0011A",
            "YGT_BUSI_NAME": "挂牌公司股份转让交易权限开通"
        },
        "V0020": {
            "YGT_BUSI_CODE": "S0011",
            "YGT_BUSI_NAME": "股票期权开户"
        },
        "V0024": {
            "YGT_BUSI_CODE": "Z0468",
            "YGT_BUSI_NAME": "信用账户开户"
        },
        "V0049": {
            "YGT_BUSI_CODE": "Z0004",
            "YGT_BUSI_NAME": "客户资料变更"
        },
        "V0050": {
            "YGT_BUSI_CODE": "Z0035",
            "YGT_BUSI_NAME": "经纪业务开户"
        },
        "V0052": {
            "YGT_BUSI_CODE": "Z0035",
            "YGT_BUSI_NAME": "经纪业务开户"
        },
        "V0065": {
            "YGT_BUSI_CODE": "Z0059",
            "YGT_BUSI_NAME": "科创板交易权限开通"
        },
        "V0122": {
            "YGT_BUSI_CODE": "Z0526",
            "YGT_BUSI_NAME": "基金自动开户协议设置"
        },
        "V0123": {
            "YGT_BUSI_CODE": "Z0363",
            "YGT_BUSI_NAME": "私募基金合格投资者权限开通"
        },
        "V0124": {
            "YGT_BUSI_CODE": "Z0014",
            "YGT_BUSI_NAME": "客户协议设置"
        },
        "V0132": {
            "YGT_BUSI_CODE": "Z0600",
            "YGT_BUSI_NAME": "可转债交易权限开通"
        },
        // 特殊处理  信用可转债只双录
        "Z0602": {
            "YGT_BUSI_CODE": "Z0602",
            "YGT_BUSI_NAME": "信用可转债交易权限开通"
        },
        "V0042": {
            "YGT_BUSI_CODE": "Z0150",
            "YGT_BUSI_NAME": "港股通交易权限开通"
        },
        "V0026": {
            "YGT_BUSI_CODE": "Z0307",
            "YGT_BUSI_NAME": "退市整理期交易权限开通"
        },
        "V0027": {
            "YGT_BUSI_CODE": "Z0038A",
            "YGT_BUSI_NAME": "风险警示股交易权限开通"
        },
        "V0135": {
            "YGT_BUSI_CODE": "Z0019",
            "YGT_BUSI_NAME": "北交所股票交易权限开通"
        },
        "V0033": {
            "YGT_BUSI_CODE": "Z0583",
            "YGT_BUSI_NAME": "公开发行优先股交易权限开通"
        },
        "V0153": {
            "YGT_BUSI_CODE": "Z0380",
            "YGT_BUSI_NAME": "质押式报价回购权限开通"
        },
        "V0166": {
            "YGT_BUSI_CODE": "Z0119",
            "YGT_BUSI_NAME": "非公开发行优先股交易权限开通"
        },
        "V0271": {
            "YGT_BUSI_CODE": "Z0145",
            "YGT_BUSI_NAME": "退市整理期可转债交易权限开通"
        },
        "V1001": {
            "YGT_BUSI_CODE": "P0004",
            "YGT_BUSI_NAME": "双录-创业板交易权限开通"
        },
        "V1002": {
            "YGT_BUSI_CODE": "P0029",
            "YGT_BUSI_NAME": "双录-创业板交易权限开通"
        },
        "V1003": {
            "YGT_BUSI_CODE": "P0002",
            "YGT_BUSI_NAME": "双录-退市板块股票交易权限开通"
        },
        "V1004": {
            "YGT_BUSI_CODE": "P0011",
            "YGT_BUSI_NAME": "双录-挂牌公司股份转让交易权限开通"
        },
        "V1005": {
            "YGT_BUSI_CODE": "P0009",
            "YGT_BUSI_NAME": "双录-退市整理期交易权限开通"
        },
        "V1006": {
            "YGT_BUSI_CODE": "P0010",
            "YGT_BUSI_NAME": "双录-风险警示股票交易权限开通"
        },
        "V1007": {
            "YGT_BUSI_CODE": "P9905",
            "YGT_BUSI_NAME": "双录-公开发行优先股交易权限开通"
        },
        "V1008": {
            "YGT_BUSI_CODE": "P0014",
            "YGT_BUSI_NAME": "双录-港股通交易权限开通"
        },
        "V1009": {
            "YGT_BUSI_CODE": "P0059",
            "YGT_BUSI_NAME": "双录-科创板股票交易权限开通"
        },
        "V1010": {
            "YGT_BUSI_CODE": "P0080",
            "YGT_BUSI_NAME": "双录-可转换公司债券交易权限开通（信用）"
        },
        "V1011": {
            "YGT_BUSI_CODE": "P0079",
            "YGT_BUSI_NAME": "双录-可转换公司债券交易权限开通"
        },
        "V1012": {
            "YGT_BUSI_CODE": "P0231",
            "YGT_BUSI_NAME": "双录-北交所股票交易权限开通"
        },
        "V1013": {
            "YGT_BUSI_CODE": "P0084",
            "YGT_BUSI_NAME": "双录-质押式报价回购权限开通"
        },
        "V1014": {
            "YGT_BUSI_CODE": "P0003",
            "YGT_BUSI_NAME": "双录-非公开发行优先股合格投资者权限开通"
        },
        "V1015": {
            "YGT_BUSI_CODE": "P0099",
            "YGT_BUSI_NAME": "双录-退市整理可转债交易权限开通"
        },
        "V1016": {
            "YGT_BUSI_CODE": "P0051",
            "YGT_BUSI_NAME": "双录-股票期权开户"
        },
        "V1017": {
            "YGT_BUSI_CODE": "P0055",
            "YGT_BUSI_NAME": "双录-信用一站式开户"
        },
        "V1018": {
            "YGT_BUSI_CODE": "P0098",
            "YGT_BUSI_NAME": "双录-信用账户北交所股票交易权限开通"
        },
        "V1019": {
            "YGT_BUSI_CODE": "P0093",
            "YGT_BUSI_NAME": "双录-行权融资征信"
        },
        "V1020": {
            "YGT_BUSI_CODE": "P0094",
            "YGT_BUSI_NAME": "双录-融资行权权限开通"
        },
        "V1021": {
            "YGT_BUSI_CODE": "P0036",
            "YGT_BUSI_NAME": "双录-股票质押回购交易权限开通"
        },
        "V1022": {
            "YGT_BUSI_CODE": "P0012",
            "YGT_BUSI_NAME": "双录-个人开户"
        },
        "V1023": {
            "YGT_BUSI_CODE": "P0012",
            "YGT_BUSI_NAME": "双录-机构开户"
        },
        "V1024": {
            "YGT_BUSI_CODE": "P0012",
            "YGT_BUSI_NAME": "双录-产品开户"
        },

    },
    // 存在个性化得业务映射
    "YINHE": {
        
    },
    getAllMapInfo: getAllMapInfo,
}

const plugin = {
    install(Vue) {
        //添加全局方法或属性
        Vue.mappingcfg = mappingConfig
        //添加实例方法
        Vue.prototype.$mappingcfg = mappingConfig
    },
    $mappingcfg: mappingConfig
}

export default plugin
export const install = plugin.install