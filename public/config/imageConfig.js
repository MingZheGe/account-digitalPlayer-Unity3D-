// 通用图标配置表
import baseConfig from './baseConfig'
const imageConfig = {
    "100223":{
        'leftMenuLogo': require('../images/qsLogo/anXinLogoWhite.png'),
        'rightMenuLogo': require('../images/qsLogo/anxinContactNumber.png')
    },
    "100081":{//中泰
        'leftMenuLogo': require('../images/qsLogo/zt_left_logo.png'),
        'rightMenuLogo': require('../icons/home/zhongTaicontactNumber.svg'),
        'readFaceLogo': require('../images/qsLogo/faceImage_zt.svg')
    },
    "000000":{//标准版
        'leftMenuLogo': require('../icons/jinzVTM/logo-jz.svg'),
        'rightMenuLogo': require('../icons/home/contactNumber.svg'),
        'readFaceLogo': require('../images/faceImage.png')
    },
    "100225":{//银河
        'leftMenuLogo': require('../images/yinhe/logo-yinhe.svg'),
        'rightMenuLogo': require('../images/yinhe/yinHeNum.svg'),
        'readFaceLogo': require('../images/faceImage.png')
    },
    "getImageLogo": function (key) {
        let qsVersion = baseConfig.$basecfg.qsVersion
        if (key) {
            return this[qsVersion] && this[qsVersion][key] || this['000000'][key] || ''
        }
        return '';
    }
}

const plugin = {
    install(Vue) {
        //添加全局方法或属性
        Vue.imgcfg = imageConfig
            //添加实例方法
        Vue.prototype.$imgcfg = imageConfig
    },
    $imgcfg: imageConfig
}

export default plugin
export const install = plugin.install