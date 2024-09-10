/**
 * 定义常量用于sessionStorage 或 localStorage存储的名称
 * @author  lij
 */

const defines = {
    IS_OPEN_ACCT_BIZ:"IS_OPEN_ACCT_BIZ",   //0-新开客户、1是存量客户
    USER_INFO: 'USER_INFO', //柜员信息
    DEVICE_INFO:'DEVICE_INFO', //VTM设备信息（设备id、设备名称）
    RECORD_USER_INFO: 'RECORD_USER_INFO', //本地双录业务现场柜员信息
    CUSTOMER_INFO: 'CUSTOMER_INFO', //客户基本信息
    TEMP_LOGIN_FLAG: 'TEMP_LOGIN_FLAG', //客户临时登录标志，从我的业务列表续办的都是临时登录
    CUST_ALL_INFO: 'CUST_ALL_INFO', //客户全量信息（账户）
    SEATSIDE_INFO: 'SEATSIDE_INFO', //坐席端信息
    IMAGE_INFO: 'IMAGE_INFO', //图像信息
    BUSI_INFO: "BUSI_INFO", //业务提交信息
    BUSI_INFO_YGT: 'BUSI_INFO_YGT',  //将vtm预录入数据结构转成一柜通数据结构（包括数据对比DIFF_INFO）
    OPP_BUSI_DATA: 'OPP_BUSI_DATA', //业务页面间的临时数据，用于从影像回退之后避免因该数据丢失造成逻辑错乱
    CUSTOMER_RATING_INFO: 'CUSTOMER_RATING_INFO', //客户风险等级（适当性）
    KIDMURL: 'KIDMURL', //影像地址
    VERSION_FLAG: 'VERSION_FLAG', //版本标识
    POSTNAME_DICT: 'POSTNAME_DICT', //柜员字典
    ENCRYPT_KEY: 'ENCRYPT_KEY', //动态秘钥
    F_CUST_ORG_CODE: 'F_CUST_ORG_CODE', //客户所属机构
    OPEN_ORG_INFO: 'OPEN_ORG_INFO',//开户业务所选机构
    BUSI_SCOPE: 'BUSI_SCOPE',
    B_SNO: 'B_SNO', //业务流水号
    IS_DOUBLE_RECORD: 'IS_DOUBLE_RECORD', //判断是否为双录业务
    TASK_CUSTOMER_INFO: 'TASK_CUSTOMER_INFO', //经办业务中的客户信息
    ALL_MENU: 'ALL_MENU', //一级二级三级菜单
    SYS_DICT_CACHE: 'SYS_DICT_CACHE', //系统数据字典缓存
    IMG_ERR_PATH: 'IMG_ERR_PATH', //视频见证失败时的路由
    IMG_ADV_DATA:'IMG_ADV_DATA', //首页以及上屏的广告数据
    READ_CARD: 'READ_CARD', //读卡标志
    READ_BANK_INFO: 'READ_BANK_INFO', //读取到的银行卡信息
    IS_OPENAGAIN_CHECK_FLAG : 'IS_OPENAGAIN_CHECK_FLAG',
    IS_MUST_ASSIGNPERSON: 'IS_MUST_ASSIGNPERSON',//是否有机构经办人节点
    ORG_CURRENT_AGENT: 'ORG_CURRENT_AGENT', //当前的机构经办人
    BUSI_COMM_PARAM: 'BUSI_COMM_PARAM', // 业务公共参数
    BUSI_COMM_PARAM_OBJS: 'BUSI_COMM_PARAM_OBJS',//业务公共参数对象
    SYS_COMM_PARAM_OBJS: 'SYS_COMM_PARAM_OBJS',//系统公共参数对象
    BUSI_PROCESS_DATA : 'BUSI_PROCESS_DATA',  //业务流程数据
    SUITBALY_RESULT:'SUITBALY_RESULT', //适当性匹配结果
    FACE_IMAGE: 'FACE_IMAGE',
    OPEN_FUND_ACCT: 'OPEN_FUND_ACCT', //所有已开基金公司
    FUND_LIST:'FUND_LIST', // 所有已选择基金公司
    ALL_FUND_COMPANY:'ALL_FUND_COMPANY', //所有基金公司
    ALL_OTC_ORG : 'ALL_OTC_ORG', //所有的OTC登记机构
    OTC_ORG_LIST : 'OTC_ORG_LIST', //所有已选择的登记机构
    ALL_OTC_REG_ORG : 'ALL_OTC_REG_ORG', //所有OTC 注册登记机构
    OTC_REG_ORG_LIST : 'OTC_REG_ORG_LIST', //所有已选择的OTC 注册登记机构
    CUACCT_CODE: 'CUACCT_CODE', //查询登记机构是否进行过登记需要传入资金账号
    NEED_SHOW_EVALUAT_BEFORE_INPAGE:'NEED_SHOW_EVALUAT_BEFORE_INPAGE',//风险测评进入业务之前判断是否显示测评结果页
    EVALUAT_ANSWER:'EVALUAT_ANSWER', //风险测评提交的答案
    EVALUATE_SN:'EVALUATE_SN', //风险测评试题编号
    CUSTOMER_FLOW_INFO:'CUSTOMER_FLOW_INFO',
    BUSI_NAME:'BUSI_NAME', //业务中文名称
    DATA_FROM: 'DATA_FROM', //当前业务初始来源：VTM，JTY (金太阳)
    TODAY_TIME:'TODAY_TIME', //获取今天的时间
    MATCH_BIZ_TYPE:'MATCH_BIZ_TYPE', // 适当性匹配类型
    APPT_SN:'APPT_SN', // 预约表数据的唯一标识
    PREVIOUS_BUSI_CODE: 'PREVIOUS_BUSI_CODE', //展示长期不适用客户的资料之前的业务代码
    HAS_REMIND_CUST: 'HAS_REMIND_CUST', //已经提示过失联客户的标识
    BUSI_DEF_INFO: 'BUSI_DEF_INFO', //业务基础配置 add：linjinbin 标准版一柜通驳回 查看驳回节点时候 需要该数据中的一个参数PROCDEF_KEY
    PRE_MODULE_DATA_CACHE: 'PRE_MODULE_DATA_CACHE',//预录入模块配置缓存
    PRE_GROUP_DATA_CACHE: 'PRE_GROUP_DATA_CACHE',//预录入分组字段配置缓存
    WITNESS_VIDEO_ID: 'WITNESS_VIDEO_ID',//视频见证是坐席ID
    SURVEY_SCORE_CONFIG: 'SURVEY_SCORE_CONFIG', //知识测评 配置的及格分数
    SURVEY_RISK_DATA: 'SURVEY_RISK_DATA', //科创板 知识测评账户测评数据回填
    CSDC_CHECKED_FLAG:'CSDC_CHECKED_FLAG',//中登校验标志，1为校验成功，0为失败，undefined代表没有启用中登校验
    IMG_ALL_ARR:'IMG_ALL_ARR', //保存当前流水采集的影像类别数组
    IMG_RUL_REUSE: 'IMG_RUL_REUSE', // 部分影像图片复用
    IMG_REUSE_DATE: 'IMG_REUSE_DATE', // 部分影像图片复用日期
    MATCH_OBJ: "MATCH_OBJ", //适当性匹配信息
    AGMT_TYPE: "AGMT_TYPE", // 适当性匹配参数
    LOGIN_TYPE: "LOGIN_TYPE", // 登录类型 是法定代表人还是 代理人登录..
    IS_PASSWORD_LOGIN: "IS_PASSWORD_LOGIN", // 是否是使用密码进行登录的
    IS_ADD_AGENT: "IS_ADD_AGENT", // 是否是点击新增代理人
    IMG_CLS_DATA: "IMG_CLS_DATA", // 上传的双录视频影像信息
    KH_SURVEY_SN: "KH_SURVEY_SN", // 主风险试题对象
    IS_CONTINUE_BUSI: "IS_CONTINUE_BUSI", // 是否是继续办理
    IS_LOGIN: "IS_LOGIN", //柜员是否登录 1为登录 0为未登录
    IS_CUST_LOGIN: "IS_CUST_LOGIN", //客户是否登录 1为登录 0为未登录
    POLICE_VALID_PASS_FLAG: "POLICE_VALID_PASS_FLAG", // 公安联网校验标识0-不通过，1-校验通过
    POLICE_IMG_DATA: "POLICE_IMG_DATA",  //公安联网返回的照片数据
    ALL_BUSI_LIST: "ALL_BUSI_LIST", //客户可以续办的业务列表
    IS_REJECT: "IS_REJECT", // 是否驳回
    REJECT_MODULE_INFO: "REJECT_MODULE_INFO", //驳回的模块信息
    IS_REFRESH_SYS: "IS_REFRESH_SYS", // 是否刷新公共参数
    AVAILABLE_MENU_ID: "AVAILABLE_MENU_ID", // 客户规范性检查准入可以办理的菜单id列表
    HISTORY_IMG_SRC: "HISTORY_IMG_SRC", // 历史现场照
    DOWNLOAD_SUCCESS_ADVERT: "DOWNLOAD_SUCCESS_ADVERT", // 下载整个了的视频信息
    PLAY_ADVERT_LIST: "PLAY_ADVERT_LIST", // 播放的广告列表
    QSJGDM_CONST: {
        BIAOZHUN: "000000",     // 标准版
        "000000": "BIAOZHUN",
        CHANGCHENG: "100010",   // 长城证券
        "100010": "CHANGCHENG",
        GUANGZHOU: "1025",      // 广州证券
        "1025": "GUANGZHOU",
        GUOXIN: "100041",       // 国信证券
        "100041": "GUOXIN",
        GUOYUAN: "100042",      // 国元证券
        "100042": "GUOYUAN",
        HUAXI: "100059",        // 华西证券
        "100059": "HUAXI",
        HUAXIN: "100138",       // 华信证券
        "100138": "HUAXIN",
        WUKUANG: "100102",      // 五矿证券
        "100102": "WUKUANG",
        YINHE: "100225",        // 银河证券
        "100225": "YINHE",
        ZHONGSHAN: "100127",    // 中山证券
        "100127": "ZHONGSHAN",
        ZHONGTAI: "100081",     // 中泰证券
        "100081": "ZHONGTAI",
        ZHONGTOU: "zhongtou",   // 中投证券
        ANXIN: "100223",         // 安信证券
        "100223": 'ANXIN',
        LIANXUN: "100071",      // 联讯证券
        "100071": "LIANXUN",
        HUALIN: "100056",       // 华林证券
        "100056": "HUALIN",
        HUARONG: "100228",      // 华融证券
        "100228": "HUARONG",
        HONGTA: "100052",       // 红塔证券
        "100052": "HONGTA",
        YICHUANG: "100020",     // 一创证券
        "100020": "YICHUANG",
        JIANTOU: "100212",      //中信建投
        "100212": "JIANTOU",
    },
    HANDWARE_TYPE: {
       HIGHCAMERA : "highcamera",
    },
}

const plugin = {
    install(Vue) {
        //添加全局方法或属性
        Vue.definecfg = defines
            //添加实例方法
        Vue.prototype.$definecfg = defines
    },
    $definecfg: defines
}

export default plugin
export const install = plugin.install