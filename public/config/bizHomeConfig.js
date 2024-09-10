/**
 * 首页的配置文件，不同券商可能有不同的首页，这里用配置做区分
 * @author  yangyp
 */
import defineConfig from './defineConfig'
import baseConfig from './baseConfig'
const getHomeConfig = function () {
    let bizConfig = {};
    switch (defineConfig.$definecfg.QSJGDM_CONST[baseConfig.$basecfg.qsVersion]) {
        case 'GUOXIN':
            bizConfig = "";
            break;
        case 'ANXIN':
            bizConfig = "";
            break;
        case 'ZHONGTAI':
            bizConfig = "";
            break;
        default:
            bizConfig = "/commonHome";
            break;
    };
    return bizConfig;
}

const getHomeCustomerConfig = function () {
    let bizConfig = {};
    switch (defineConfig.$definecfg.QSJGDM_CONST[baseConfig.$basecfg.qsVersion]) {
        case 'GUOXIN':
            bizConfig = "";
            break;
        case 'ANXIN':
            bizConfig = "";
            break;
        case 'ZHONGTAI':
            bizConfig = "";
            break;
        default:
            bizConfig = "/commonCustHome";
            break;
    };
    return bizConfig;
}
const getFirstLevelBizConfig = function() {
    let bizConfig = {};
    switch (defineConfig.$definecfg.QSJGDM_CONST[baseConfig.$basecfg.qsVersion]) {
        case 'GUOXIN':
            bizConfig = "";
            break;
        case 'ANXIN':
            bizConfig = "";
            break;
        case 'ZHONGTAI':
            bizConfig = "";
            break;
        default:
            bizConfig = "/firstLevelBiz/99660000";
            break;
    };
    return bizConfig;
}
const bizHomeCfg = {
    getHomeConfig: getHomeConfig,
    getHomeCustomerConfig:getHomeCustomerConfig,
    getFirstLevelBizConfig:getFirstLevelBizConfig
}

const plugin = {
    install(Vue) {
        //添加全局方法或属性
        Vue.bizHomeCfg = bizHomeCfg
        //添加实例方法
        Vue.prototype.$bizhomecfg = bizHomeCfg
    },
    $bizhomecfg: bizHomeCfg
}

export default plugin
export const install = plugin.install
