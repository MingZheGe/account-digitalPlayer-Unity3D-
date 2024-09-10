/**
 * 业务简介
 * 办理业务所需证件资料
 * 
 * @author  yangyp
 */
import defineConfig from './defineConfig'
import baseConfig from './baseConfig'
import qsZhongTaiConfig from './../business/businessConfig/qsVersionConfig/qsZhongTaiConfig'
import qsAnXinConfig from './../business/businessConfig/qsVersionConfig/qsAnXinConfig'
import qsGuoXinConfig from './../business/businessConfig/qsVersionConfig/qsGuoXinConfig'
import qsBiaoZhunConfig from './../business/businessConfig/qsVersionConfig/qsBiaoZhunConfig'
const getBizConfig = function (busiCode, userType) {
    let bizConfig = {};
    switch (defineConfig.$definecfg.QSJGDM_CONST[baseConfig.$basecfg.qsVersion]) {
        case 'GUOXIN':
            bizConfig = qsGuoXinConfig.$qsConfig.GUOXIN;
            break;
        case 'ANXIN':
            bizConfig = qsAnXinConfig.$qsConfig.ANXIN;
            break;
        case 'ZHONGTAI':
            bizConfig = qsZhongTaiConfig.$qsConfig.ZHONGTAI;
            break;
        default:
            bizConfig = qsBiaoZhunConfig.$qsConfig.BIAOZHUN;
            break;
    };
    let key = (busiCode in bizConfig) ? busiCode : (busiCode + "-" + userType);
    if (bizConfig[key]) {
        bizConfig = bizConfig[key];
    } else {
        return null;
    }
    return bizConfig;
}


const getBizConfigName = function (configName) {
    //edit linjinbin 如果为空则自动获取配置文件的版本配置
    if (!configName) {
        configName = defineConfig.$definecfg.QSJGDM_CONST[baseConfig.$basecfg.qsVersion];
    }
    let tempName = configName;
    switch (configName) {
        case 'GUOXIN':
            tempName = "GUOXIN";
            break;
        case 'ZHONGTAI':
            tempName = "ZHONGTAI";
            break;
        case 'ANXIN':
            tempName = "ANXIN";
            break;
        default://银河中山以及其他的都走标准版逻辑
            tempName = "BIAOZHUN";
            break;
    };
    return tempName;
}

const bizCfgObj = {
    getBizConfig: getBizConfig,
    getBizConfigName: getBizConfigName
}

const plugin = {
    install(Vue) {
        //添加全局方法或属性
        Vue.bizcfg = bizCfgObj
        //添加实例方法
        Vue.prototype.$bizcfg = bizCfgObj
    },
    $bizcfg: bizCfgObj
}

export default plugin
export const install = plugin.install
