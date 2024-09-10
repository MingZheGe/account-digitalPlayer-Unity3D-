import sysConfig from '../config/sysConfig';
import defineConfig from '../config/defineConfig';
import baseConfig from '../config/baseConfig';
// import dict from '../tools/dict'
import dateFormat from '../tools/format.js';
import oppService from '../service/opp-service'
import date from '../tools/date';
import { jsonp } from 'vue-jsonp';
import store from '../vuex'
import storage from '../tools/storage.js'

let fsEncrypt = require("../tools/libs/fs-enc");

//根据业务流水号获取业务需要采集的所有影像类别
export const getImgClass = (params) => {
    if(params.BUSI_CODE == 'V0121'){
        return new Promise((resolve, reject)=>{
            let res = {Code: "0", Msg: "业务影像类别查询成功", Data: [{
                "IMG_GROUP":"00","CSDC_PAPER":"","BITMAP_XDPI_MIN":"0","WATER_MARK":"0","PRINT_ADDR":"","REUSE_FLAG":"0","BITMAP_YDPI_MIN":"0","YZT_CHANNELS":"4,1,3","IS_DELETE":"1","BITMAP_XDPI_MAX":"100","BITMAP_YDPI_MAX":"100","CREATE_PDF_FILE_WAY":"0","MAX_PAGENUM":"2","EXAM_ADDR":"","REF_BUSI_TYPE":"","E_SIGN_ADDR":"","IS_PAPER_VIDEO":" ","IMG_ORDER":"1","VALID_TIME":"0","IMG_TYPE":"2","BITMAP_XPIX_MAX":"100","MERGE_FLAG":"1","COMPARE_FLAG":"0","BITMAP_TYPE":"0","BITMAP_XPIX_MIN":"0","IS_SINGLE_SIGN":"0","IS_PRINT":"0","BUSI_SCOPE":"","IMG_CLS_NAME":"客户资产证明","IMG_GET_MODE":"8","COLLECT_MUST":"0","LEGAL_ID":"0","USE_FLAG":"1","PICTURE_SIZE":"614400","IMG_CLS":"x099","IMPORT_FLAG":"1","REUSE_TIME_TYPE":"0","MIN_PAGENUM":"1","BITMAP_YPIX_MAX":"100","VIDEO_FLAG":"1","REVIEW_FLAG":"0",
                "ADDITIONAL":" ","IMG_FMT":"5","BITMAP_YPIX_MIN":"0","IS_TPL":"1","IS_DEFINED_CLS":"0","BUSI_CODE":"V0121","ADDITIONAL_REVIEW":"0","BITMAP_BITS":"24"
            }]};
            resolve(res)
        })
    }
    return sysConfig.$syscfg.K_Request("W0000111", params);
}
//获取业务影像信息
export const getImgInfo = (bSno, busiType) => {
    return sysConfig.$syscfg.K_Request("Y1002034", {
        B_SNO: bSno,
        REF_BUSI_TYPE: busiType || ""
    });
}
//获取无纸化配置
export const paperlessQuery = (flag, paperlessCode) => {
    return sysConfig.$syscfg.K_Request("YG001111", {
        ORG_BUSI_FLAG: flag,
        PAPERLESS_CODE: paperlessCode
    });
}
// 拼装影像地址
export const assembledImaUrl = (item) => {
    return sysConfig.$syscfg.getImgUrl(true).then((imgConfig) => {
        let buildUrl = imgConfig.kidmDownload + '?',
            queryParam = "IMG_SN=" + item.IMG_SN + (item.PAGE_NUM ? ("&PAGE_NUM=" + item.PAGE_NUM) : '');

        return buildUrl + (item.isEncode ? 'param=' + encodeURIComponent(fsEncrypt.encrypt(queryParam)) : queryParam);
    });
}
//根据客户标识和影像类别获取可复用的影像 sysCustNo, imgCls
export const getCollectedImgData = (B_SNO, imgCls, relaImgCls) => {
    return sysConfig.$syscfg.K_Request("W0000100", {
        SERVICE_CODE: "D1000552",
        // SYS_CUST_NO: sysCustNo,
        // IMG_SN: imgSn
        B_SNO: B_SNO,
        IMG_CLS: imgCls,
        RELA_IMG_CLS: relaImgCls || ""
    });
}
//OCR识别获取客户信息
export const ocrGetInfo = (type, img) => { ////////
    return sysConfig.$syscfg.K_Request("W0000100", {
        SERVICE_CODE: "D9900016",
        ID_TYPE: type,
        IMG_PHOTO1: img,
    });
}
//OCR识别获取客户信息
export const ocrGetInfoByYinhe = function(type, img) { ////////
    let imgType = "";
    if(type == "face"){
        imgType = "30001";
    }else if(type == "back"){
        imgType = "30002";
    }else if(type == "10"){
        imgType = "30004";
    }
    if(imgType == ""){
        return;
    }
    return sysConfig.$syscfg.K_Request("W0000356", {
        SERVICE_CODE: "I9900003",
        SERVICE_NUMBER: imgType,
        IMG_PHOTO1: img,
    });
}
//保存或更新业务数据到影像系统
export const saveBusiData = function (busiData) {
    return sysConfig.$syscfg.K_Request("W0000100", {
        service: "W0000100",
        SERVICE_CODE: "D1000596",
        B_SNO: busiData.B_SNO,
        BUSI_CODE: busiData.BUSI_CODE,
        BUSI_DETAIL: busiData.BUSI_DETAIL || "",
        SYS_CUST_NO: busiData.CUST_CODE,
        ORG_CODE: busiData.ORG_CODE,
        CUST_NAME: busiData.CUST_NAME,
        ID_TYPE: busiData.ID_TYPE,
        USER_TYPE: busiData.USER_TYPE,
        ID_CARD: busiData.ID_CODE,
        SYS_CODE: busiData.SYS_CODE,
        CHANNEL: busiData.CHANNEL || "10",  //优先取流水数据里面的CHANNEL 没有的话默认是账户系统字典CHANEL字典项V 表示vtm业务渠道 0表示柜台系统
        ACCEPT_PARAM: busiData.ACCEPT_PARAM,
        DEAL_PARAM: ""
    });
};
//获取业务双录配置 @param busiCode  业务代码 @param orgCode  机构代码 @returns Object查询本地表 OPP_BUSI_DEF
export const getBusiVideoDef = function (params) {
    let { busiCode, orgCode, refBusiCode } = params;
    // 先查当前机构 如果没有查到再去查询总部
    if (refBusiCode != undefined || refBusiCode != null) {
        return sysConfig.$syscfg.K_Request("YG003930", {
            REF_BUSI_CODE: refBusiCode,
            ORG_CODE: orgCode,
            CHECK_PERMISSION: "0"
        }).then(res => {
            let busiVideoDef = res.Data[0];
            if (_.isEmpty(busiVideoDef)) {
                return sysConfig.$syscfg.K_Request("YG003930", {
                    REF_BUSI_CODE: refBusiCode,
                    ORG_CODE: "0000",
                    CHECK_PERMISSION: "0"
                }).then(res => {
                    return res.Data[0];
                })
            } else {
                return busiVideoDef;
            }
        })
    } else {
        return sysConfig.$syscfg.K_Request("YG003945", {
            BUSI_CODE: busiCode,
            ORG_CODE: orgCode
        }).then(res => {
            return res.Data[0];
        })
    }
}
// 上传影像到影像系统
export const uploadMedia = (ft, mediaPath, mediaUriOption, onSuccess, onError, onProgress, mimeType) => {
    mimeType = mimeType || 'image/jpeg'

    sysConfig.$syscfg.getImgUrl().then((cfg) => {
        var uri = ''
        for (var key in mediaUriOption) {
            var value = mediaUriOption[key]
            if (uri == '') {
                uri += '?' + key + '=' + value
            } else {
                uri += '&' + key + '=' + value
            }
        }

        uri = cfg.kidmUpload + uri

        var options = new FileUploadOptions()
        options.fileKey = 'file'
        options.fileName = mediaPath.substr(mediaPath.lastIndexOf('/') + 1)
        options.mimeType = mimeType
        options.chunkedMode = false

        // var ft = new FileTransfer();
        ft.onprogress = onProgress
        ft.upload(mediaPath, uri, onSuccess, onError, options, true)
    }).catch((err) => {
        onError(err)
        alert(err)
        console.log('catch错误====' + err)
    })
}
// 中泰更新视频上传日志表
export const updateVideoUploadLog = (imgObj) => {
    return sysConfig.$syscfg.K_Request("Y1002112", {
        B_SNO: imgObj.B_SNO,
        IMG_CLS: imgObj.IMG_CLS,
        FILE_IDX: imgObj.FILE_IDX,
        IS_UPLOAD: "1",
        IMG_SN: imgObj.IMG_SN || null
    })
}

//提交anychat录制影像到影像系统 || 安信上传双录视频地址
export const commonSaveVideoSingle = (sysCust) => {
    return sysConfig.$syscfg.K_Request("W0000100", Object.assign({ SERVICE_CODE: "D1000543" }, sysCust));
}
// 分段上传影像信息
export const uploadImgSlice = (params, isCancel) => {
    return sysConfig.$syscfg.K_Request("W0000100", Object.assign({ SERVICE_CODE: "D9900082" }, params), false, {isCancel})
}
// 提交图像信息到影像系统
export const upCollectedImgData = (sysCust, isCancel) => {
    return sysConfig.$syscfg.K_Request("W0000100", Object.assign({ SERVICE_CODE: "D1000602" }, sysCust), false, {isCancel});
}
// 删除影像系统影像
export const deleteCollectedImgData = (sysCust, isCancel) => {
    return sysConfig.$syscfg.K_Request("W0000100", Object.assign({ SERVICE_CODE: "D1000553" }, sysCust), false,{ isCancel });
}
// 根据IMG_SN和 PAGE_NUM获取base64
export const getImgBase64 = (params) => {
    return sysConfig.$syscfg.K_Request("W0000100", Object.assign({ SERVICE_CODE: "D1000513" }, params))
}
//把影像已经保存成功的信息回传给一柜通
export const uploadImgInfo = (param, isCancel) => {
    return new Promise(function (resolve, reject) {
        sysConfig.$syscfg.K_Request("W0000123", Object.assign({
            IMG_STATUS: "1",
            IMG_PAGE_CNT: 0,
            IMG_SIZE: 0,
            IMG_WIDTH: 0,
            IMG_HEIGHT: 0,
            BITMAP_TYPE: 0,
            BITMAP_BITS: 0,
            BITMAP_XDPI: 0,
            BITMAP_YDPI: 0,
            IMG_UPLOAD: ""
        }, param), false, {isCancel}).then(function (data) {
            resolve(data);
        }).catch(function (e) {
            console.error(e)
            reject(e)
        });
    })
}
// 查询影像对应的签名信息
export const queryVideoFile = (param, isCancel) => {
    return sysConfig.$syscfg.K_Request("W0000100", {
        SERVICE_CODE: "D1000592",
        B_SNO: param.B_SNO,
        IMG_CLS: param.IMG_CLS,
        RELA_IMG_CLS: param.RELA_IMG_CLS
    }, false, { isCancel })
}
//删除一柜通影像
export const deleteImgInfo = (param) => {
    return new Promise(function (resolve, reject) {
        sysConfig.$syscfg.K_Request("W0000112", param).then(function (data) {
            resolve(data);
        }).catch(function (e) {
            reject(data)
        });
    })
}
//人脸识别上传接口
export const uploadFaceRecog = function (param) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D9900017",
            CUST_NAME: param.CUST_NAME,
            ID_CODE: param.ID_CODE,
            IS_LIVINGBODY_CHECK: param.IS_LIVINGBODY_CHECK || "0",
            IMG_PHOTO1: param.photo1,
            IMG_PHOTO2: param.photo2,
        }).then(function (data) {
            if (data.Code == "0" && data.Data && data.Data[0]) {
                resolve(data);
            } else {
                reject(data.Msg);
            }
        }).catch(function (data) {
            reject(data.Msg);
        })
    })
}
// 免冠照和证件照进行对比
export const uploadFaceCompare = function(param) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000356", {
            "SERVICE_CODE":"I9000009",
            "RULE_CODES":"10002",
            "CUST_NAME": param.CUST_NAME,
            "ID_CARD": param.ID_CODE,
            "ID_TYPE": param.ID_TYPE,
            "SYS_CUST_NO": param.CUST_CODE,
            "IMG_PHOTO1": param.IMG_PHOTO1,
            "IMG_PHOTO2": param.IMG_PHOTO2
        }).then(data => {
            if (data.Code == "0" && data.Data && data.Data[0]) {
                resolve(data);
            } else {
                reject(data.Msg);
            }
        }).catch(function (data) {
            reject(data.Msg);
        })
    })
}
// 免冠照和历史现场照对比
export const uploadFaceHistoryCompare = function(param) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000356", {
            "SERVICE_CODE":"I9000009",
            "RULE_CODES": "10002",
            "CUST_NAME": param.CUST_NAME,
            "ID_CARD": param.ID_CODE,
            "ID_TYPE": param.ID_TYPE,
            "SYS_CUST_NO": param.CUST_CODE,
            "IMG_PHOTO1": param.IMG_PHOTO1
        }).then(data => {
            if (data.Code == "0" && data.Data && data.Data[0]) {
                resolve(data);
            } else {
                reject(data.Msg);
            }
        }).catch(function (data) {
            reject(data.Msg);
        })
    })
}
// 检查现场照是否合格
export const checkImageStatus = function(param) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000356", {
            "SERVICE_CODE":"I9000009",
            "RULE_CODES": "10009",
            "CUST_NAME": param.CUST_NAME,
            "ID_CARD": param.ID_CODE,
            "ID_TYPE": param.ID_TYPE,
            "SYS_CUST_NO": param.CUST_CODE,
            "IMG_PHOTO1": param.IMG_PHOTO1
        }).then(data => {
            if (data.Code == "0" && data.Data && data.Data[0]) {
                resolve(data);
            } else {
                resolve(data.Msg);
            }
        }).catch(function (data) {
            resolve(data.Msg);
        })
    })
}
// 检测证件是否合格
export const checkIDCardStatus = function(param) {
    return sysConfig.$syscfg.K_Request("W0000356", {
        "SERVICE_CODE":"I9000009",
        "RULE_CODES": param.RULE_CODE,
        "CUST_NAME": param.CUST_NAME,
        "ID_CARD": param.ID_CODE,
        "ID_TYPE": param.ID_TYPE,
        "SYS_CUST_NO": param.CUST_CODE,
        "IMG_PHOTO1": param.IMG_PHOTO1
    }).then(data => {
        if (data.Code == "0" && data.Data && data.Data[0]) {
            return data;
        } else {
            return data.Msg;
        }
    }).catch(err => {
        throw err;
    })
}

export const reuseImage = (sysCust) => {
    return sysConfig.$syscfg.K_Request("W0000100", Object.assign({ SERVICE_CODE: "D1000551" }, sysCust));
}
/* 
 *获取影像系统影像类别模块
 */

export const getKidmImgClsTpl = (param) => {
    let newParam = {
        SERVICE_CODE: "D1000535",
        IMG_CLS: param.IMG_CLS,
        USER_TYPE: param.USER_TYPE,
    }
    if (oppService.getSysCommonParamsFromCacheObjs("SHOW_CENTER") == "1") {
        newParam.SHOW_CENTER = "1"; //传1，影像后台会自动给模板添加head和body
    }
    // TODO: 标准版还没有配置这几个公参
    // 如果影像系统渠道配置了VTM或者移动渠道，就需要在一柜通配置对应的公参包括渠道跟总部代码
    // 表单y007需要走VTM渠道的表单 即 10表单 这个表单改动比较频繁和pc共用维护比较难
    if (['y007'].indexOf(param.IMG_CLS) > -1) {
        newParam.CHANNEL = oppService.getSysCommonParamsFromCacheObjs("IMG_CHANNEL") || "10";
    } else {
        newParam.CHANNEL = oppService.getSysCommonParamsFromCacheObjs("IMG_CHANNEL") || "0";
    }
    newParam.ORG_CODE = oppService.getSysCommonParamsFromCacheObjs("ORG_CODE") || "0000";

    newParam.CONDITION_VALUE = param.CONDITION_VALUE   //影像模板条件值，可用于三方存管协议
    return sysConfig.$syscfg.K_Request("W0000100", newParam).then((data) => {
        return (data.Code == "0" && data.Data.length) ? data.Data[0] : undefined;
    }).catch(err => {
        // 优先获取 10 vtm渠道的模板，在没有的情况下再获取pc的模板
        newParam.CHANNEL = "0";
        return sysConfig.$syscfg.K_Request("W0000100", newParam).then((data) => {
            return (data.Code == "0" && data.Data.length) ? data.Data[0] : undefined;
        })
    });
}

//获取本地影像模板
export const getLocalTpl = (imgCls, isPrint) => {
    return new Promise((resolve, reject) => {
        var qsVersion = defineConfig.$definecfg.QSJGDM_CONST[baseConfig.$basecfg.qsVersion];
        if(baseConfig.$basecfg.isStandard){
            qsVersion = 'BIAOZHUN';
        }
        var imgClsCss = imgCls || "9999" 
        var baseUrl = baseConfig.$basecfg.isProd ? '' : 'static/';
        var types = isPrint ? "prints" : "signs";
        var url = baseUrl + "busi-paper/" + types + "/" + qsVersion + "/" + imgClsCss + ".html";
        sysConfig.$syscfg.K_Request_Get(url).then(function (res) {
            resolve({
                IMG_CLS: imgCls,
                BUSI_DATE: res.request.responseText,
                APPLY_DATE: date.getClientDate(),
                VERSION: "1.0.0"
            });
        }).catch(function (err) {
            reject(err);
        });
    });
}

export const getUserDefineClsArr = function(params) {
    return new Promise((resolve, reject) => {
        return sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D1000711",
            IS_DEFINED_CLS: "1"
        }).then(res => {
            resolve(res.Data);
        }).catch(err => {
            reject(err);
        })
    })
}

//HTML转PDF
export const transPdf = function (params) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            "SERVICE_CODE":  "D1000524",
            "IMG_FMT": "6",
            "BUSI_CODE":  params.BUSI_CODE,
            "BUSI_DATA": params.BUSI_DATA,
            "B_SNO":  params.KIDM_SNO,
            "ORG_CODE": params.ORG_CODE,
            "VERSION":  params.VERSION,
            "IMG_CLS":  params.IMG_CLS
        }).then(function (data) {
            
        }).catch(function (err) {
            reject(err)
        })
    })
};
//   * 获取电子申请、电子协议、电子签名协议签署数组 
export const getApplyAndAgreementAndSignInfo = function (B_SNO, BUSI_CODE) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D1000545",
            B_SNO: B_SNO,
            BUSI_CODE: BUSI_CODE
        }).then(function (data) {
            if (data.Code != 0) {
                reject(data.Msg)
            } else if (data.Data) {
                resolve(data.Data);
            }
        }).catch(function (err) {
            reject(err)
        })
    })
};
// * 查询影像无纸化协议表 
export const getEContractInfo = function () {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            // @qgj--一柜通接口换了，这里也得换，保持一致性
            // SERVICE_CODE: "D3000504",
            // USE_FLAG: "1"
            SERVICE_CODE: "D1000520",
        }).then(function (data) {
            if (data.Code == "0") {
                resolve(data.Data)
            } else {
                reject(data.Msg)
            }
        }).catch(function (data) {
            reject(data);
        })
    })
}
/**
 * 保存模板HTML数据到影像系统
 * @param param
 * @returns Object
 */
export const saveTplHtmlDataToServer = (param, isCancel) => {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D1000524",
            BUSI_DATA: encodeURIComponent(param.BUSI_DATA),
            B_SNO: param.B_SNO,
            IMG_CLS: param.IMG_CLS,
            IMG_FMT: "6",
            ORG_CODE: param.ORG_CODE,
            VERSION: param.VERSION
        }, false, { isCancel }).then(function (data) {
            console.log("保存模板HTML数据到影像系统(D1000524)----" + JSON.stringify(data));
            if (data.Code == "0") {
                resolve(data.Data[0])
            } else {
                reject(data.Msg)
            }
        }).catch(function (data) {
            reject(data);
        })
    })
};

/**
 * 保存客户表单信息到影像系统
 * @param param
 * @returns Object
 */
export const saveCustFormInfoToKidm = function (param, isCancel) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D2100003",
            B_SNO: param.B_SNO,
            BUSI_CODE: param.BUSI_CODE,
            BUSI_DETAIL: param.BUSI_DETAIL || "000",
            SYS_CUST_NO: param.SYS_CUST_NO || "0",
            ORG_CODE: param.ORG_CODE,
            CUST_NAME: param.CUST_NAME,
            ID_TYPE: param.ID_TYPE,
            ID_CARD: param.ID_CARD,
            IMG_CLS: param.IMG_CLS,
            SYS_CODE: param.SYS_CODE || "99",
            CHANNEL: param.CHANNEL || "10",
            REVIEW_STATUS: '1',
        }, false, { isCancel }).then(function (data) {
            console.log("保存客户表单信息到影像系统(D2100003)----" + JSON.stringify(data));
            if (data.Code == "0") {
                resolve(data.Data[0])
            } else {
                reject(data.Msg)
            }
        }).catch(function (data) {
            reject(data);
        })
    })
}

/**
 * 从影像系统获取客户签名规则配置(D2000008)
 * @param param
 * @returns Object
 */
export const getCustSignConfigFromKidm = function (param, isCancel) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D2000008",
            // ORG_CODE: oppService.getSysCommonParamsFromCacheObjs("ORG_CODE") || "0000",
            IMG_CLS: param.IMG_CLS
        }, false, { isCancel }).then(function (data) {
            console.log("从影像系统获取客户签名规则配置(D2000008)----" + JSON.stringify(data));
            if (data.Code == "0") {
                resolve(data.Data)
            } else {
                reject(data.Msg)
            }
        }).catch(function (data) {
            reject(data);
        })
    })
}
/**
 * 从影像系统获取客户签名规则配置（D2000020）
 * D2000008 给内容调用的  D2000020 一般情况下
 */
export const getCustSignConfig = function(param, isCancel) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D2000020",
            ORG_CODE: oppService.getSysCommonParamsFromCacheObjs("ORG_CODE") || "0000",
            IMG_CLS: param.IMG_CLS
        }, false, { isCancel }).then(function (data) {
            console.log("从影像系统获取客户签名规则配置(D2000008)----" + JSON.stringify(data));
            if (data.Code == "0") {
                resolve(data.Data)
            } else {
                reject(data.Msg)
            }
        }).catch(function (data) {
            reject(data);
        })
    })
}

/**
 * 任务与客户签名规则保存到印象系统(D2100000)
 * @param param
 * @returns Object
 */

export const saveCustSignRolesToKidm = function (param, isCancel) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D2100000",
            B_SNO: param.B_SNO,
            IMG_CLS: param.IMG_CLS,
            RULE_INFO_USER: param.RULE_INFO_USER,
            IS_SINGLE_SIGN: param.IS_SINGLE_SIGN || "0",
            REMARK: ""
        }, false, { isCancel }).then(function (data) {
            console.log("任务与客户签名规则保存到印象系统(D2100000)----" + JSON.stringify(data));
            if (data.Code == "0") {
                resolve(data.Data[0])
            } else {
                reject(data.Msg)
            }
        }).catch(function (data) {
            reject(data);
        })
    })
}

/**
 * 保存客户签名图片信息到影像系统(D2100001)
 * @param param
 * @returns Object
 */
export const saveCustSignImagInfoToKidm = function (param, isCancel) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D2100001",
            B_SNO: param.B_SNO,
            SIGN_IMAGE: param.SIGN_IMAGE,
            SYS_CUST_NO: param.CUST_CODE,
            CUST_NAME: param.CUST_NAME,
            ID_TYPE: param.ID_TYPE,
            ID_CARD: param.ID_CARD,
            USER_TYPE: param.USER_TYPE,
            IS_SINGLE_SIGN: param.IS_SINGLE_SIGN || "0",
            IMG_CLS: param.IMG_CLS,
            SING_IMG_TRACK: param.SING_IMG_TRACK,
            RULE_INFO_USER_ID: param.RULE_INFO_USER_ID,
            IS_NOTATION: param.IS_NOTATION
        }, false, { isCancel }).then(function (data) {
            console.log("保存客户签名图片信息到影像系统(D2100001)----" + JSON.stringify(data));
            if (data.Code == "0") {
                resolve(data.Data[0])
            } else {
                reject(data.Msg)
            }
        }).catch(function (data) {
            reject(data);
        })
    })
}

/**
 * 批量添加客户证书和签名图片(D2100002)
 * @param param
 * @returns Object
 */
export const saveAddCustSealInfo = function (param, isCancel) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D2100002",
            B_SNO: param.B_SNO,
            IMG_CLS: param.IMG_CLS,
            IS_CHANGE_SIGN: "1",
            IS_SINGLE_SIGN: param.IS_SINGLE_SIGN || "0",
            RULE_INFO_USER_ID: param.RULE_INFO_USER_ID
        }, false, { isCancel }).then(function (data) {
            console.log(" 批量添加客户证书和签名图片(D2100002)----" + JSON.stringify(data));
            if (data.Code == "0") {
                resolve(data.Data[0])
            } else {
                reject(data.Msg)
            }
        }).catch(function (data) {
            reject(data);
        })
    })
}

/**
 * 保存客户签字的数据到影像系统
 * @param param
 * @returns Object
 */
export const saveSignDataToKidm = function (param) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000090", param).then(function (data) {
            if (data.Code == "0") {
                resolve(data.Data.length && data.Data[0] || {})
            } else {
                reject(data.Msg);
            }
        }).catch(function (e) {
            reject(e && e.message || e)
        })

    })
}
/**
 * 保存客户签字的数据到影像系统
 * @param param
 * @returns Object
 */
export const localPdfSaveSignDataToKidm = function (param) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000324", param).then(function (data) {
            if (data.Code == "0") {
                resolve(data.Data.length && data.Data[0] || {})
            } else {
                reject(data.Msg);
            }
        }).catch(function (e) {
            reject(e && e.message || e)
        })

    })
}
export const addSealToSignPdf = function (param) {
    return new Promise((resolve, reject) => {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D2001016",
            IMG_SN: param.IMG_SN,
            ORG_CODE: param.ORG_CODE,
            SEAL_TYPE: "000",
            USER_TYPE: param.USER_TYPE,
            B_SNO: param.B_SNO,
            OP_NAME: param.OP_NAME
        }).then(function (data) {
            resolve(data.Data[0]);
        }).catch(function (data) {
            reject(data.Msg);
        })
    })
}

/**
 * 将html转pdf的接口
 * @param param
 * @returns Object
 */
export const htmlToPdf = function (param, isCancel) {
    return saveTplHtmlDataToServer({
        B_SNO: param.B_SNO,
        IMG_CLS: param.IMG_CLS,
        ORG_CODE: param.ORG_CODE,
        VERSION: param.VERSION,
        BUSI_DATA: param.BUSI_DATA
    }, isCancel).then(function (data) {
        return saveCustFormInfoToKidm({
            B_SNO: param.B_SNO,
            BUSI_CODE: param.BUSI_CODE,
            BUSI_DETAIL: param.BUSI_DETAIL,
            SYS_CUST_NO: param.SYS_CUST_NO,
            ORG_CODE: param.ORG_CODE,
            CUST_NAME: param.CUST_NAME,
            ID_TYPE: param.ID_TYPE,
            ID_CARD: param.ID_CARD,
            IMG_CLS: param.IMG_CLS,
            SYS_CODE: param.SYS_CODE,
            CHANNEL: param.CHANNEL,
        }, isCancel)
    })
}
//获取客户端下电子协议名称
export const getDianZiFileName = function (imgCls, userType, orgCode) {
    return new Promise(function (resolve, reject) {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D3000506",
            CONTRACT_TYPE: imgCls,
            USER_TYPE: userType,
            ORG_CODE: orgCode
        }).then(function (data) {
            if (data.Code == "0") {
                resolve(data.Data[0])
            } else {
                reject(data.Msg)
            }
        }).catch(function (err) {
            reject(err)
        })
    });
}
//影像系统新增电子协议信息
export const insertKidmImgInfo = function (params) {
    return new Promise(function (resolve, reject) {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D3000507",
            B_SNO: params.B_SNO,
            CONTRACT_TYPE: params.CONTRACT_TYPE,
            BUSI_CODE: params.BUSI_CODE,
            USER_TYPE: params.USER_TYPE,
            ORG_CODE: params.ORG_CODE
        }).then(function (data) {
            if (data.Code == "0") {
                resolve(data.Data[0])
            } else {
                reject(data.Msg)
            }
        }).catch(function (err) {
            reject(err)
        })
    });
}
//查询影像系统的影像编号
export const queryKIDMImgSn = function (params) {
    return new Promise(function (resolve, reject) {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D1000536",
            B_SNO: params.B_SNO,
            IMG_CLS: params.IMG_CLS,
            BUSI_CODE: params.BUSI_CODE
        }).then(function (data) {
            if (data.Code == "0") {
                resolve(data.Data[0])
            } else {
                reject(data.Msg)
            }
        }).catch(function (err) {
            reject(err)
        })
    });
}
/**
 * 将pdf转图片的接口
 * @param param
 * @returns Object
 */
export const pdfTransToImage = function (param) {
    return new Promise(function (resolve, reject) {
        sysConfig.$syscfg.K_Request("W0000100", {
            SERVICE_CODE: "D9900011",
            B_SNO: param.B_SNO,
            IMG_CLS: param.IMG_CLS
        }).then(function (data) {
            if (data.Code == "0") {
                resolve(data.Data[0])
            } else {
                reject(data.Msg)
            }
        }).catch(function (data) {
            reject(data);
        })
    });
}
const getDictValue = function (key, dictCode, busiDict) {
    for (var i = 0; i < busiDict[dictCode].length; i++) {
        if (key == busiDict[dictCode][i].DICT_ITEM) {
            return busiDict[dictCode][i].DICT_ITEM_NAME;
        }
    }

}

//中泰获取人脸识别加密参数
export const getFaceCompaParams = (busiClass, version) => {
    return sysConfig.$syscfg.K_Request("W0000100", {
        "SERVICE_CODE": "D9900021",
        "BUSI_CLASS": busiClass,
        "VERSION": version,
    });
}
//中泰获取人脸识别对比结果
export const getFaceCompaeResult = (busiClass, data, hash, extra, transId) => {
    return sysConfig.$syscfg.K_Request("W0000100", {
        "SERVICE_CODE": "D9900019",
        "BUSI_CLASS": busiClass,
        "DATA": data,
        "HASH": hash,
        "EXTRA": extra,
        "TRANS_ID": transId,
    });
}
//语音文字字典替换
export const replaceVoiceInfo = function (tempText, busiData, busiDict) {
    tempText = tempText.replace(/(?:#|\^){(\w+)}/g, function ($1, $2, $3) {
        console.log("匹配的值", $1, $2, $3);
        if ($2 == "CUST_NAME") {
            return busiData.CUST_FNAME || busiData.CUST_NAME;
        }
        if ($2 == "CUST_FNAME") {
            return busiData.CUST_FNAME || busiData.CUST_NAME;
        }
        if ($2 == "REF_BUSI_NAME") {
            return "";
        }
        if ($2 == "POST_NAME") {
            return busiData.USER_NAME;
        }
        if ($2 == "USER_TYPE") {
            return busiData.USER_TYPE == "0" ? "本人" : "本单位";
        }
        if ($2 == "OP_ORG_FULL_NAME") {
            return busiData.ORG_FULL_NAME;
        }
        if ($2 == "OP_USER_NAME") {
            return busiData.OP_USER_NAME;
        }
        if ($2 == "MATCH_BIZ_TYPE_TEXT") {
            // return busiData.BUSI_NAME;
            if (busiData.BUSI_NAME) {
                return busiData.BUSI_NAME;
            } else if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.MATCH_BIZ_TYPE_TEXT) {
                return busiData.MATCH_OBJ.MATCH_BIZ_TYPE_TEXT;
            } else {
                return false;
            }
        }
        if ($2 == "MATCH_RESULT") {
            if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.MATCH_RESULT) {
                return busiData.MATCH_OBJ.MATCH_RESULT;
            } else {
                return false;
            }
        }
        if ($2 == "RATING_LVL_TEXT") {//客户风险承受能力为
            var ratingLvlName = "";
            if (busiData.MATCH_OBJ.RATING_LVL) {
                switch (busiData.MATCH_OBJ.RATING_LVL) {
                    case "1":
                        ratingLvlName = "C1";
                        break;
                    case "2":
                        ratingLvlName = "C2";
                        break;
                    case "3":
                        ratingLvlName = "C3";
                        break;
                    case "4":
                        ratingLvlName = "C4";
                        break;
                    case "5":
                        ratingLvlName = "C5";
                        break;
                }
                return ratingLvlName;
            } else {
                // this.$alert("获取客户风险等级失败！");
                return false;
            }
        }
        if ($2 == "INVEST_LMT_TEXT") {//客户投资期限偏好
            if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.INVEST_LMT_TEXT) {
                return busiData.MATCH_OBJ.INVEST_LMT_TEXT;
            } else {
                // this.$alert("获取客户投资期限失败！");
                return false;
            }
        }
        if ($2 == "INVEST_PRO_TEXT") { //客户投资品种偏好
            if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.INVEST_PRO_TEXT) {
                return busiData.MATCH_OBJ.INVEST_PRO_TEXT
            } else {
                // this.$alert("获取客户投资品种失败！");
                return false;
            }
        }


        if ($2 == "PRATING_LVL_TEXT") { //产品风险等级
            if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.CHK_RATING_LVL_NAME) {
                return busiData.MATCH_OBJ.CHK_RATING_LVL_NAME;
            } else {
                // this.$alert("获取业务风险等级！");
                return false;
            }
        }
        if ($2 == "RATING_LVL_NAME") { //产品风险等级
            if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.BUSIRATING_LVL) {
                return busiData.MATCH_OBJ.BUSIRATING_LVL;
            } else {
                // this.$alert("获取业务风险等级！");
                return false;
            }
        }
        if ($2 == "PINVEST_LMT_TEXT") {//产品投资期限
            if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.CHK_INVEST_LMT_TEXT) {
                return busiData.MATCH_OBJ.CHK_INVEST_LMT_TEXT;
            } else {
                // this.$alert("获取客户投资期限失败！");
                return false;
            }
        }
        if ($2 == "PINVEST_PRO_TEXT") {//产品投资品种
            if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.CHK_INVEST_PRO_TEXT) {
                return busiData.MATCH_OBJ.CHK_INVEST_PRO_TEXT
            } else {
                // this.$alert("获取客户投资品种失败！");
                return false;
            }
        }

        if ($2 == "EXPECT_INCOME") {
            if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.EXPECT_INCOME) {
                // return busiData.MATCH_OBJ.EXPECT_INCOME_TEXT;
                return getDictValue(busiData.MATCH_OBJ.EXPECT_INCOME, "EXPECT_INCOME", busiDict) || busiData.MATCH_OBJ.EXPECT_INCOME_TEXT;
            } else {
                // this.$alert("获取客户期望收益失败！");
                return false;
            }
        }
        if ($2 == "INVEST_PRO") {
            if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.INVEST_PRO) {
                // return busiData.MATCH_OBJ.INVEST_PRO_TEXT
                return getDictValue(busiData.MATCH_OBJ.INVEST_PRO, "INVEST_PRO", busiDict) || busiData.MATCH_OBJ.INVEST_PRO_TEXT;
            } else {
                // this.$alert("获取客户投资品种失败！");
                return false;
            }
        }
        if ($2 == "RATING_LVL") {
            var ratingLvlName = "";
            if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.RATING_LVL) {
                switch (busiData.MATCH_OBJ.RATING_LVL) {
                    case "1":
                        ratingLvlName = "C1";
                        break;
                    case "2":
                        ratingLvlName = "C2";
                        break;
                    case "3":
                        ratingLvlName = "C3";
                        break;
                    case "4":
                        ratingLvlName = "C4";
                        break;
                    case "5":
                        ratingLvlName = "C5";
                        break;
                }
                return ratingLvlName;
            } else {
                // this.$alert("获取客户风险等级失败！");
                return false;
            }
        }
        if ($2 == "BUSI_EXPECT_INCOME") {
            if (busiData.MATCH_OBJ && busiData.MATCH_OBJ.BUSI_EXPECT_INCOME) {
                // return busiData.MATCH_OBJ.CHK_EXPECT_INCOME_TEXT;
                return getDictValue(busiData.MATCH_OBJ.BUSI_EXPECT_INCOME, "EXPECT_INCOME", busiDict) || busiData.MATCH_OBJ.EXPECT_INCOME_TEXT;
            } else {
                // this.$alert("获取产品期望收益失败！");
                return false;
            }
        }
        if ($2 == "BUSI_DATE") {
            var busiDate = new Date(busiData.OPER_TIME.replace(/-/g, '/')),
                year = busiDate.getFullYear() + "",
                month = busiDate.getMonth() + 1,
                day = busiDate.getDate(),
                week = busiDate.getDay(),
                tempYear, tempDay,
                chineseDay = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一",
                    "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "二十一",
                    "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九", "三十", "三十一"
                ];
            tempYear = year.split("");
            _.each(tempYear, function (obj, i) {
                var index = Number(tempYear[i]);
                return tempYear[i] = chineseDay[index];
            });
            month = chineseDay[month];
            tempDay = chineseDay[day];
            if (week == 0) {
                week = "日";
            } else if (week == 1) {
                week = "一";
            }
            return tempYear.join("") + "年" + month + "月" + tempDay + "日" + "星期" + week;
        }
        if ($2 == "ID_CODE") {
            let idcode = String(busiData.ID_CODE);
            console.log("获取到的客户信息", idcode);
            return idcode.substring(idcode.length - 4);
        }
        if ($2 == "ID_TYPE") {
            var idTypeName = "";
            if (busiData.ID_TYPE) {
                switch (busiData.ID_TYPE) {
                    case "00":
                        idTypeName = "身份证";
                        break;
                    case "01":
                        idTypeName = "护照";
                        break;
                    case "02":
                        idTypeName = "军官证";
                        break;
                    case "03":
                        idTypeName = "士兵证";
                        break;
                    case "04":
                        idTypeName = "回乡证";
                        break;
                    case "05":
                        idTypeName = "户口本";
                        break;
                    case "09":
                        idTypeName = "其他证件";
                        break;
                    case "10":
                        idTypeName = "工商营业执照";
                        break;
                    case "11":
                        idTypeName = "社团法人注册登记证书";
                        break;
                    case "12":
                        idTypeName = "机关法人成立批文";
                        break;
                    case "13":
                        idTypeName = "事业法人成立批文";
                        break;
                    case "14":
                        idTypeName = "境外有效商业登记证明";
                        break;
                    case "15":
                        idTypeName = "武警";
                        break;
                    case "16":
                        idTypeName = "军队";
                        break;
                    case "17":
                        idTypeName = "基金会";
                        break;
                    case "18":
                        idTypeName = "技术监督局号码";
                        break;
                    case "19":
                        idTypeName = "其他证件";
                        break;
                    case "1A":
                        idTypeName = "组织机构代码证";
                        break;
                    case "1B":
                        idTypeName = "税务登记证";
                        break;
                    case "1H":
                        idTypeName = "下属机构";
                        break;
                    case "1Z":
                        idTypeName = "批文";
                        break;
                    case "0k":
                        idTypeName = "外国人永久居留证";
                        break;
                    case "0b":
                        idTypeName = "香港居民身份证";
                        break;
                    case "0c":
                        idTypeName = "澳门居民身份证";
                        break;
                    case "0d":
                        idTypeName = "台湾居民身份证";
                        break;
                    case "0g":
                        idTypeName = "文职证";
                        break;
                    case "0h":
                        idTypeName = "警官证";
                        break;
                    case "0i":
                        idTypeName = "香港居民身份证";
                        break;
                    case "0j":
                        idTypeName = "澳门居民身份证";
                        break;
                    case "0s":
                        idTypeName = "港澳台居民居住证";
                        break;

                }
                return idTypeName;
            } else {
                // this.$alert("获取客户风险等级失败！");
                return false;
            }
        }
        if ($2 == "MOBILE_TEL") {
            return busiData.MOBILE_TEL
        }
        if ($2 == "CUST_AGMT_TYPE" && busiData.BUSI_CODE == "Z0215") {
            var custAgmtType = busiData.CUST_AGMT_TYPE[0].CUST_AGMT_TYPE,
                agmtScriptObj = _.find(that.AgmtScriptDef, function (obj) {
                    return obj.CUST_AGMT_TYPE == custAgmtType;
                });
            if (agmtScriptObj) {
                return agmtScriptObj.AGMT_SCRIPT;
            } else {
                // this.$alert("该协议未配置话术！");
                return "";
            }
        }
        let busiCommonParams = storage.$storage.getJsonSession(defineConfig.$definecfg.BUSI_COMM_PARAM_OBJS) || {};
        let REL_MATCH_LVL = busiCommonParams.REL_MATCH_LVL || {};
        try {
            REL_MATCH_LVL = JSON.parse(REL_MATCH_LVL);
        } catch (err) {
            REL_MATCH_LVL = {};
        }
        let RATINT_LVL_FLAG = _.get(busiData, "RISK_INFO[0].RATING_LVL", "");
        let refRatLvlName = REL_MATCH_LVL["REF_RAL_LVL_NAME_" + RATINT_LVL_FLAG];
        let notRatLvlName = REL_MATCH_LVL["NOT_REF_RAL_LVL_NAME_" + RATINT_LVL_FLAG];
        if (sysConfig.$syscfg.isOpenDobuleBiz(busiData.BUSI_CODE)) {
            if($2 == "REF_RAL_LVL_NAME") {            
                return busiData.REF_RAL_LVL_NAME;
            }
            if($2 == "NOT_REF_RAL_LVL_NAME") {
                return busiData.NOT_REF_RAL_LVL_NAME;
            }
            if ($2 == "CUST_RATING_LVL_NAME") {//客户投资期限偏好
                return busiData.CUST_RATING_LVL_NAME;
            }
        }
        if($2 == "REF_RAL_LVL_NAME") {            
            return refRatLvlName;
        }
        if($2 == "NOT_REF_RAL_LVL_NAME") {
            return notRatLvlName;
        }
        if ($2 == "CUST_RATING_LVL_NAME") {//客户投资期限偏好
            if (busiData.RATING_LVL_NAME) {
                return busiData.RATING_LVL_NAME;
            } else {
                // this.$alert("获取客户投资期限失败！");
                return false;
            }
        }
    });
    return tempText;
}
//查看签名时是否开启自动录像
export const isSignRecordVideo2 = function (param) {
    return sysConfig.$syscfg.K_Request("W0000243", {
        IMG_CLS: param.IMG_CLS
    });
};
//查询影像哈希值
export const queryHashCode = function (BUSI_CODE, B_SNO) {
    return sysConfig.$syscfg.K_Request("W0000246", {
        B_SNO: B_SNO,
        BUSI_CODE: BUSI_CODE
    });
};

export const checkBusiDoubleRecord = function(executeParam, busiData) {
    return sysConfig.$syscfg.K_Request("Y1192165", Object.assign({
        EXECUTE_PARAM: executeParam
    }, busiData));
}
export const aliRecognizeVoice = function(url,voiceType){
    voiceType = voiceType||"2";     //默认读取语音识别的中间结果
    return new Promise((resolve,reject)=>{
      console.log("recognizeVoice");
      if(baseConfig.$basecfg.platform === "ios" &&  typeof navigator.iosUtil !== "undefined") {
        //跳转原生的识别界面
        navigator.iosUtil.skipToNVC(function(success){},function(error) {
            console.log(error);
          },{methodNames: "recognizeVoice"}
        );
      }else if ( baseConfig.$basecfg.platform === "android" && typeof window.NativeMethod !== "undefined") {
        window.NativeMethod.startAliSpeechTransfer({
              "appKey":"default",//阿里实时语音识别appKey
              "token":"default",//阿里实时语音识别token
              "url":url,//阿里实时语音识别服务器URL
              "noise_threshold":"0",//可选，噪音参数阈值，参数范围：[-1,1]。取值说明如下：取值越趋于-1，噪音被判定为语音的概率越大。取值越趋于+1，语音被判定为噪音的概率越大；该参数属高级参数，调整需慎重并重点测试
              "max_sentence_silence":"800",//可选，语音断句检测阈值，静音时长超过该阈值会被认为断句，参数范围200ms～2000ms，默认值800ms
            }, function(result) {
                console.log(result);
                switch(result.EVENT){
                  case "START":
                    console.log("识别开始");
                    break;
                  case "END_RESULT":
                    console.log("识别最终结果：" + JSON.parse(result.msg).payload.result);
                    voiceType=="1"&&resolve(JSON.parse(result.msg).payload.result);
                    break;
                  case "PARTIAL_RESULT":
                    // console.log("识别实时结果：" +JSON.parse(result.msg).payload.result);
                    // that.speechTransferResult = JSON.parse(result.msg).payload.result;
                    voiceType=="2"&&resolve(JSON.parse(result.msg).payload.result);
                    break;
                  case "ERROR":
                    // console.log("错误：" + result.msg);
                    console.error(result.msg);
                    reject(result.msg);
                    break;
                  default:
                    break;
                }
            },function(error){
                console.error(error);
                reject(error);
            });
      }else{
        resolve("是的");
      }
    })
}
export const stopAliSpeechTransfer = function(){
    console.log("stopAliSpeechTransfer");
    if(baseConfig.$basecfg.platform === "ios" &&  typeof navigator.iosUtil !== "undefined") {
      //跳转原生的识别界面
      navigator.iosUtil.skipToNVC(function(success){},function(error) {
          console.log(error);
        },{methodNames: "stopAliSpeechTransfer"}
      );
    }else if ( baseConfig.$basecfg.platform === "android" && typeof window.NativeMethod !== "undefined") {
      // TODO  安卓跳转原生双录
      window.NativeMethod.stopAliSpeechTransfer({},
      function(result) {
        console.log(result);
      },function(error){
          console.log(error);
          console.error(error);
      });
    }
}
// 已经采集的影像 B_SNO 为待补采业务数据的影像业务号
export const getImgData = function (KIDM_SNO) {
    return sysConfig.$syscfg.K_Request("W0000100", {
        SERVICE_CODE: "D1001568",
        B_SNO: KIDM_SNO
    });
}

// 根据业务代码获取业务所有影像类别数据
export const getImgClsDataByBusiCode = function(busiCode,userType) {
    return sysConfig.$syscfg.K_Request("YG000681", {
        BUSI_CODE: busiCode,
        USER_TYPE:userType
    });
}