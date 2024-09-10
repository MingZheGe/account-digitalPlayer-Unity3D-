/**
 * 一些系统方法定义
 * @author  lij
 */

import axios from 'axios'
import baseConfig from './baseConfig'
import axiosConfig from './axiosConfig'
import defineConfig from './defineConfig'
import _storage from '../tools/storage'
import bizcfg from './bizConfig'

import {
    isObject,
    isString
} from 'util';
import Vue from 'vue'

let fsEncrypt = require("../tools/libs/fs-enc")

const vueInstance = (function initVueInstance(){
    return new Vue();
})



let configObject = {
    consts: function() {
        let baseUrl = baseConfig.$basecfg.httpConfig.baseUrl + ':' + baseConfig.$basecfg.httpConfig.proxyPort;
        return {
            /**
             * **kjdp_upload接口地址**
             * @type string
             */
            KJDP_UPLOAD_URL: baseUrl + "kjdp_upload",

            /**
             * **kjdp_download接口地址**
             * @type string
             */
            KJDP_DOWNLOAD_URL: baseUrl + "kjdp_download",

            /**
             * **kjdp_validate接口地址**
             * @type string
             */
            KJDP_VALIDATE_URL: baseUrl + "kjdp_validate",

            /**
             * **kjdp_userInfo接口地址**
             * @type string
             */
            KJDP_USER_INFO_URL: baseUrl + "kjdp_userInfo",

            /**
             * **kjdp_encrypkey接口地址**
             * @type string
             */
            ENCRYPT_KEY_URL: baseUrl + "kjdp_encrypkey",

            /**
             *  ** kjdp_cache接口地址 **
             */
            CACHE_URL: baseUrl + "kjdp_cache",

            /**
             * **kjdp_login接口地址**
             * @type string
             */
            LOGIN_URL: baseUrl + "kjdp_login",

            /**
             * **kjdp_session接口地址**
             * @type string
             */
            SESSION_URL: baseUrl + "kjdp_session",

            /**
             * **kjdp_ajax接口地址**
             * @type string
             */
            AJAX_URL: baseUrl + "kjdp_ajax",

            /**
             * **kjdp_logout接口地址**
             * @type string
             */
            LOGOUT_URL: baseUrl + "kjdp_logout",

            /**
             * ** kjdp_unlock接口地址 **
             * @type string
             */
            UNLOCK: baseUrl + "kjdp_unlock",

            /**
             * ** kjdp_modeler接口地址 **
             * @type string
             */
            MODELER_URL: baseUrl + "kjdp_modeler",

            /**
             * ** kjdp_getData接口地址 **
             * @type string
             */
            GET_DATA_URL: baseUrl + "kjdp_getData",

            /**
             * **标识一个字符串常量"service"**
             * @type string
             */
            SERVICE: "service",

            /**
             * **标识一个字符串常量"bex_codes"**
             * @type string
             */
            BEX_CODES: "bex_codes",

            /**
             * **标识一个字符串常量"menuId"**
             * @type string
             */
            PROGRAM: "menuId",

            /**
             * **标识一个字符串常量"json"**
             * @type string
             */
            REQ_TYPE_JSON: "json",

            /**
             * **标识一个字符串常量"xml"**
             * @type string
             */
            REQ_TYPE_XML: "xml",
            //系统编号
            SYS_CODE: {
                KDOP: '99', //一柜通
                KUAS: '10', //账户系统
                KSPB: '6', //win版交易
                KFIS: '20', //win版融资融券
                KGOB: '8', //U版交易
                KGIS: '22', //U版融资融券
                KFMS: '18', //资金管理系统
                KBOS: '30', //订单系统
                KOTC: '40', //OTC系统
                KSOT: '50', //个股期权系统
                KCSS: '60', //清算系统
                KCIF: '80' //CIF系统
            }
        };
    },
    getImgUrl: function(useLocalHost) {
        return new Promise((resolve, reject) => {
            this.getImgConfig(true,useLocalHost).then((kidmUrl) => {
                console.log("---------kidmUrl-----------", JSON.stringify(kidmUrl));
                resolve({
                    //使用IMG_SN获取图片
                    kidmDownload: kidmUrl + "/kjdp_kidmDownload",
                    //使用IMG_CLS、CUST_CODE、PAGE_NUM获取图片
                    kidmNewImgClsDownload: kidmUrl + "/kjdp_kidmDownload",
                    //使用USER_CODE、F_CUST_ORG_CODE获取历史影像
                    KidmServerUrl: kidmUrl + "/kjdp_ajax",
                    //使用ORG_CODE、IMG_CLS、B_SNO、F_OP_CODE、F_ORG_CODE
                    kidmUpload: kidmUrl + "/kjdp_kidmUpload",
                    //影像的html转pdf
                    kidmHtmlToPdfController: kidmUrl + "/kjdp_kidmHtmlToPdfController"
                });
            }).catch((err) => {
                console.error("----------getImgUrl err----------", err)
                reject(err)
            });
        });
    },
    getImgConfig: function(useCache, useLocalHost) {
        return new Promise((resolve, reject) => {
            useCache = useCache != undefined ? useCache : true;
            let kidmUrl = "";
            let commonkidmUrl = _storage.$storage.getSession(defineConfig.$definecfg.KIDMURL);
            if (useCache && commonkidmUrl) {
                resolve(commonkidmUrl);
            }else if(useLocalHost){ //使用本机host
                resolve(window.location.protocol+ "//" +window.location.host + "/vtm");
            }else {
                // this.K_Request("W0000124", {"properties": "kidm.server.url"})
                let urlArr = ["kidm.server.url","app.kidm.server.url"]
                this.K_Request("W0000128",{
                    service:"W0000128",
                    properties:urlArr.join(",")
                }).then((items) => {
                    // console.log("---------items-----------",JSON.stringify(items));
                    if (items.Code == "0"&&items.Data[0]) {
                        kidmUrl = items.Data[0]["app.kidm.server.url"] ? items.Data[0]["app.kidm.server.url"] : items.Data[0]["kidm.server.url"];
                        _storage.$storage.setSession(defineConfig.$definecfg.KIDMURL, kidmUrl);
                        resolve(kidmUrl);
                    } else {
                        _storage.$storage.setSession(defineConfig.$definecfg.KIDMURL, kidmUrl);
                        reject("获取影像地址失败"+items.Msg);
                    }
                })
            }
        });
    },
    isQSJG: function(qsVersion) {
        return baseConfig.$basecfg.qsVersion === qsVersion;
    },
    isLogin: function() { //检查客户端的登录状态
        let loginstatus = _storage.$storage.getJsonSession(defineConfig.$definecfg.IS_LOGIN) == "1";
        if (!loginstatus) {
            return 0; // 未登录
        } else {
            return 1; // 已登录
        }
    },
    //检查客户是否登录
    isCustLogin: function(){
        let loginstatus = _storage.$storage.getJsonSession(defineConfig.$definecfg.IS_CUST_LOGIN) == "1";
        if (!loginstatus) {
            return false; // 未登录
        } else {
            return true; // 已登录
        }
    },
    //获取系统参数
    getSysConfig: function(par_code, sys_code) {
        return this.K_Request("W0000099", {
            SYS_CODE: sys_code != undefined ? sys_code : "99", //子系统代码，默认99一柜通
            PAR_CODE: par_code, //参数代码,
            PAR_NAME: "", // 参数名称
        })
    },
    /**
     *
     * **获取动态密钥，适用KJDP**
     *
     * @method getEncryptKey
     * @param {boolean} useCache 是否使用缓存
     * @return {object} **[Deferred Object](http://api.jquery.com/category/deferred-object/)**
     */
    getEncryptKey: function(useCache) {
        return new Promise((resolve, reject) => {
            useCache = useCache != undefined ? useCache : true;
            let encKey = _storage.$storage.getSession(defineConfig.$definecfg.ENCRYPT_KEY);
            if (useCache && encKey) {
                resolve(encKey)
            } else {
                resolve(axios.post(this.consts().ENCRYPT_KEY_URL, {}, axiosConfig.$axioscfg));
            }
        });
    },
    /***
     * **获取单次ajaxRequest请求调用的公共参数**
     * @method getReqHead
     * @param {object} sReq 一次ajaxRequest调用的参数
     *  @param {string} sReq.service 接口编号
     *  @param {string} sReq.menuId  菜单编号
     * @return {object} **公共参数**
     */
    getReqHead: function(sReq) {
        var userInfo = _storage.$storage.getJsonSession(defineConfig.$definecfg.USER_INFO);
        return {
            F_OP_CODE: userInfo.USER_CODE || "",
            F_OP_ROLE: userInfo.USER_ROLE || "",
            F_OP_BRANCH: userInfo.ORG_CODE || "",
            F_OP_SITE: userInfo.LOG_IP || "",
            F_SESSION: userInfo.USER_TICKET_INFO || "",
            F_OP_WAY: '1',
            F_OP_LANGUAGE: '1',
            F_OP_PROGRAM: sReq[this.consts().PROGRAM] || "",
            F_SERVER_ID: sReq[this.consts().SERVICE] || "",
            F_MSG_ID: sReq[this.consts().SERVICE] || "",
            // F_CUST_ORG_CODE: urlParam.F_CUST_ORG_CODE || sReq.F_CUST_ORG_CODE || ""
            F_CUST_ORG_CODE: sReq.F_CUST_ORG_CODE || ""
        };
    },
    /***
     * **生成请求参数json格式**
     * @method makeJsonRequest
     * @param {object|object[]} req 请求参数
     * @return {string} **json格式的请求串**
     */
    makeJsonRequest: function(req) {
        let reqJson = [];
        let that = this;
        req = _.isArray(req) ? req : [req];
        _(req).forEach(function(n) {
            reqJson.push({
                REQ_MSG_HDR: that.getReqHead(n),
                REQ_COMM_DATA: n
            });
        });
        return JSON.stringify({
            REQUESTS: reqJson
        });
    },
    /***
     * **生成请求参数xml格式**
     * @method makeXmlRequest
     * @param {object|object[]} req 请求参数
     * @return {string} **xml格式的请求串**
     */
    makeXmlRequest: function (req) {
        return "<?xml version='1.0' encoding='UTF-8'?><requests><![CDATA[" +
            JSON.stringify(_.isArray(req) ? {
                req: req
            } : {
                req: [req]
            }) +
            "]]></requests>";
    },
    /**
     * **解析服务器返回结果方法，适用KJDP**
     * @method resolveParam
     * @param {object} param 服务器返回结果
     *  @param {array} [param.ANSWERS] 服务器返回结果
     * @return undefined
     */
    resolveParam: function(ansData) {
        let that = this,
            answers = ansData && ansData.ANSWERS;

        if (!answers || !answers.length) {
            return [];
        }

        return _.chain(answers).map(function(answer) {
            let ansMsgHdr = answer.ANS_MSG_HDR,
                ansCommData = answer.ANS_COMM_DATA;

            return {
                data: that.isSuccess(ansMsgHdr) && 2 === ansCommData.length && !ansCommData[0].BPM_DATA.length ? [
                    []
                ].concat(ansCommData) : ansCommData,
                head: ansMsgHdr
            }
        }).value();
    },
    /**
     * **判断请求是否成功**
     * @method isSuccess
     * @param {object} head 请求返回头
     * @return {boolean} **业务执行成功返回true否则返回false**
     */
    isSuccess: function(head, extMsgCode) {
        let msgCodeArr = ["0", "100", "9010001", "-130011", "-404", "106192", "-9000002", "22003005"].concat(
            _.isString(extMsgCode) ?
            extMsgCode.split(",") :
            _.isArray(extMsgCode) ? extMsgCode : []
        );

        if (!head || !head.MSG_CODE) {
            return false;
        }

        return -1 !== _.indexOf(msgCodeArr, head.MSG_CODE)
    },
    //请求后台接口通用方法 增加axioscfg参数
    K_Request: function(serviceId, busData, ignoreError, axioscfg) {
        let that = this;
        //所有一柜通接口，通过kmsp后台W0000001接口转发请求
        if(that.isQSJG(defineConfig.$definecfg.QSJGDM_CONST.GUOXIN)){
            if(serviceId != "W0000097" && serviceId != "W0000098"){
                if(busData && busData.USER_TYPE && busData.USER_TYPE == "2"){
                    busData.USER_TYPE = "1";
                }
            } 
        }
        if (_.startsWith(serviceId, 'Y') || _.startsWith(serviceId, 'KSCS') || _.startsWith(serviceId, 'Z') || _.startsWith(serviceId, 'QS') || _.startsWith(serviceId, 'F')) {
            busData = _.extend({}, busData, {
                "YGT_SERVICE_CODE": serviceId
            })
            serviceId = 'W0000001';
        }
        return new Promise((resolve, reject) => {
            //请求数据
            let data = fsEncrypt.encrypt(that.buildReqData(serviceId, busData))
            console.log("发请求了！",serviceId, busData)
            // console.log('所有的请求数据===', data);
            let cfg = _.merge(_.cloneDeep(axiosConfig.$axioscfg), (axioscfg || {}))
            cfg.params = {
                retry: cfg.retry || "",
                retryDelay: cfg.retryDelay || "",
                isCancel: (axioscfg && axioscfg.isCancel === false) ? false : true,
                __retryCount: cfg.__retryCount || ""
            }
            axios.post('/', data, cfg).then(ansData => {
                let ans = ansData.data.ANSWERS[0];
                let ans_head = ans.ANS_MSG_HDR;
                let ans_data = ans.ANS_COMM_DATA[0];
                let response = {
                    "Code": ans_head.MSG_CODE,
                    "Msg": ans_head.MSG_TEXT,
                    "Data": ans_data
                }
                //有些业务接口需要自己处理错误信息，只要ignoreError为true即可
                if(!that.isSuccess(ans_head) && !ignoreError){
                    reject(ans_head.MSG_TEXT);
                }else{
                    resolve(response);
                }
            }).catch(error => {
                console.error("请求失败了" + serviceId + "|" + busData.YGT_SERVICE_CODE);
                console.error(error);
                if (axios.isCancel(error)) {
                    console.error("请求取消了======================");
                } else {
                    reject(error);
                }
            })
        });
    },

    //请求后台接口并发多个请求通用方法
    K_Request_ALL: function(args) {
        return Promise.all(args);
    },
    //请求后台并发多个请求通用函数，中台去并发请求前端只请求一次
    K_Request_ALL2: function(serviceList) {
        return this.K_Request('W0000351', {"serviceList":serviceList});
    },
    //get请求通用方法
    K_Request_Get: function(url) {
        return axios.get(url);
    },
    //请求影像系统接口
    K_ImageRequest: function(param, url, singleMode) {
        let that = this;
        return new Promise((resolve, reject) => {
            //请求数据
            let data = fsEncrypt.encrypt(this.makeJsonRequest(param), "888888");
            this.getImgUrl().then((imgConfig) => {
                axios.post(imgConfig.KidmServerUrl + "?returnType=json", data, axiosConfig.$axioscfg).then((res) => {
                    let ansRet = this.resolveParam(res.data);
                    if (ansRet.length) {
                        resolve([ansRet[0].data, ansRet[0].head, ansRet])
                    } else {
                        reject([ansRet[0].data, ansRet[0].head, ansRet]);
                    }
                })
            }).catch((err) => {
                reject(err);
            })
        });
    },
    // 中后台组装请求数据
    buildReqData: function (bus_code, bus_data) {
        let busi_data = isObject(bus_data) ? bus_data : {};
        busi_data["service"]     = bus_code;
        busi_data["__RandomNo"]  = new Date().getTime();
        let REQ_MSG_HDR          = {};
        var userInfo = _storage.$storage.getJsonSession(defineConfig.$definecfg.USER_INFO);
        var custInfo = _storage.$storage.getJsonSession(defineConfig.$definecfg.CUSTOMER_INFO);
        var deviceInfo = _storage.$storage.getJsonSession(defineConfig.$definecfg.DEVICE_INFO);
        if(userInfo) {
            REQ_MSG_HDR["OP_CODE"]                = userInfo.OP_CODE;
            REQ_MSG_HDR["CURRENT_POST"]           = userInfo.CURRENT_POST;
            // REQ_MSG_HDR["USER_ROLE"]              = userInfo.USER_ROLE || "2";//客户登录接口会报错，除非注释掉这个参数或者改为1
            REQ_MSG_HDR["ORG_CODE"]               = userInfo.ORG_CODE;
            REQ_MSG_HDR["LOG_IP"]                 = userInfo.LOG_IP;
            REQ_MSG_HDR["F_OP_SITE"]              = deviceInfo && deviceInfo.LOCALIP || "";
            REQ_MSG_HDR["F_SESSION"]              = userInfo.USER_TICKET_INFO;
            REQ_MSG_HDR["F_OP_USER_ENC"]          = userInfo.F_OP_USER_ENC;
            REQ_MSG_HDR["F_OP_BRANCH"]            = userInfo.ORG_CODE;         
            REQ_MSG_HDR["F_OP_WAY"]               = "";         
            REQ_MSG_HDR["F_OP_LANGUAGE"]          = "";         
            REQ_MSG_HDR["F_OP_PROGRAM"]           = "0";        
            REQ_MSG_HDR["F_CHANNEL"]              = "0";//传给账户的操作渠道都是0 柜台系统    
            REQ_MSG_HDR["F_YZT_CHANNEL"]          = this.getYztChannel()
            REQ_MSG_HDR["F_CUST_ORG_CODE"]        = custInfo && custInfo.INT_ORG || userInfo.ORG_CODE;
            REQ_MSG_HDR["F_OP_USER"]              = userInfo.OP_CODE;
            REQ_MSG_HDR["USER_POST"]              = userInfo.USER_POST;
            REQ_MSG_HDR["USER_CODE"]              = userInfo.OP_CODE;
            REQ_MSG_HDR["USER_ROLE"]              = userInfo.USER_ROLE || '';
            REQ_MSG_HDR["F_OP_ROLE"]              = userInfo.USER_ROLE || "2";
        } else {
            REQ_MSG_HDR["OP_CODE"]                = "";
            REQ_MSG_HDR["CURRENT_POST"]           = "";
            // REQ_MSG_HDR["USER_ROLE"]              = "2";
            REQ_MSG_HDR["ORG_CODE"]               = "";
            REQ_MSG_HDR["LOG_IP"]                 = "";         //
            REQ_MSG_HDR["F_SESSION"]              = "";
            REQ_MSG_HDR["F_OP_BRANCH"]            = "";
            REQ_MSG_HDR["F_OP_WAY"]               = "";         //
            REQ_MSG_HDR["F_OP_LANGUAGE"]          = "";         //
            REQ_MSG_HDR["F_OP_PROGRAM"]           = "0";        //
            REQ_MSG_HDR["F_CHANNEL"]              = "0";        //
            REQ_MSG_HDR["F_YZT_CHANNEL"]          = this.getYztChannel();        //
            REQ_MSG_HDR["F_CUST_ORG_CODE"]        = custInfo && custInfo.INT_ORG || "";
            REQ_MSG_HDR["F_OP_USER"]              = "";
            REQ_MSG_HDR["USER_POST"]              = "";
            REQ_MSG_HDR["USER_CODE"]              = "";
            REQ_MSG_HDR["USER_ROLE"]              = '';
            REQ_MSG_HDR["F_OP_ROLE"]              = "2";
        }
        let that = this;
        if (deviceInfo) {
            REQ_MSG_HDR["netaddr"] = that.getDeviceInfoFormat1(deviceInfo);
            REQ_MSG_HDR["netaddr2"] = that.getDeviceInfoFormat2(deviceInfo);
        }

        let REQ_COMM_DATA = busi_data;
        let request = {
            "REQUESTS": [{
                "REQ_MSG_HDR": REQ_MSG_HDR,
            "REQ_COMM_DATA": REQ_COMM_DATA
        }]
        };

        return JSON.stringify(request);
    },

    getDeviceInfoReplace(key, value) {
        if (key == 'ICCID' || key == 'IMSI' || key == 'IIP') {
            if (!value) {
                return "200";
            }
            return value;
        }
        return value;
    },
    getDeviceInfoExtendReplace(key, value) {
        if (!value) {
            return "";
        }
        value = value.replace(/\\/g, "\\\\");
        value = value.replace(/@/g, "\\@");
        value = value.replace(/\^/g, "\\^");
        value = value.replace(/;/g, "\\;");
        value = value.replace(/=/g, "\\=");
        return value;
    },
    getDeviceInfoFormat1(deviceInfo) {
        let that = this;
        let result = that.getDeviceInfoReplace("DEVICE_TYPE", deviceInfo.DEVICE_TYPE) + ";"
       // result = result + "IIP=" + that.getDeviceInfoReplace("IIP", deviceInfo.NETIP) + ";";
	    result = result + "IIP=#" + "200;";
		result = result + "IPORT=#" + "200;";
        result = result + "LIP=" + that.getDeviceInfoReplace("LIP", deviceInfo.LOCALIP) + ";";
        result = result + "MAC=" + that.getDeviceInfoReplace("MAC", deviceInfo.MAC) + ";";
        result = result + "IMEI=" + that.getDeviceInfoReplace("IMEI", deviceInfo.IMEI) + ";";
        result = result + "RMPN=#" + "200;";
        result = result + "UMPN=#" + "200;";
       // result = result + "ICCID=" + that.getDeviceInfoReplace("ICCID", deviceInfo.ICCID) + ";";
        result = result + "OSV=" + that.getDeviceInfoReplace("OSV", deviceInfo.OSV) + "";
       //  result = result + "IMSI=" + that.getDeviceInfoReplace("IMSI", deviceInfo.IMSI) + "";
	    let versionCode=deviceInfo.APPVCODE+"";
		versionCode=versionCode.replace(/\./g,"");
        result = result + "@KMSP;"+versionCode+";SCD=0F";
        return result;
    },
    getDeviceInfoFormat2(deviceInfo) {
        let that = this;
        return that.getDeviceInfoFormat1(deviceInfo);
    },
    //获取数据库日期和时间
    getSysDateTime: function () {
        return this.K_Request("W0000163", {}).then((data) => {
            return data && data.Data[0] && data.Data[0].DB_DATE + ' ' + data.Data[0].DB_TIME;
        });
    },
    //获取数据库日期
    getSysDate: function () {
        return this.K_Request("W0000163", {}).then((data) => {
            return data.Data[0] && data.Data[0].DB_DATE;
        });
    },
    //获取数据库时间
    getSysTime: function () {
        return this.K_Request("W0000163", {}).then((data) => {
            return data.Data[0] && data.Data[0].DB_TIME;
        });
    },
    isDoubleBiz: function(busiCode) {
        return ['V1001','V1002','V1003','V1004','V1005','V1006','V1007','V1008','V1009','V1010',
        'V1011','V1012','V1013','V1014','V1015','V1016','V1017','V1018','V1019','V1020','V1021','V1022','V1023','V1024'].indexOf(busiCode) > -1;
    },
    // 是否开户双录业务
    isOpenDobuleBiz: function(busiCode) {
        return ['V1022','V1023','V1024'].indexOf(busiCode) > -1;
    },
    //是否开户业务 包括个人 机构 产品开户 true 是开户业务 false 不是开户业务
    isOpenAcctBiz: function (busiCode) {
        return this.isPersonOpenAcctBiz(busiCode) || this.isOrgOpenAcctBiz(busiCode) || this.isProOpenAcctBiz(busiCode)
    },
    //是否个人开户业务
    isPersonOpenAcctBiz: function (busiCode) {
        let openBiz = ["V0052"]
        return openBiz.indexOf(busiCode) != -1
    },
    //是否机构开户业务
    isOrgOpenAcctBiz: function(busiCode){
        let openBiz = ["V0050"]
        return openBiz.indexOf(busiCode) != -1
    },
    //是否产品开户业务
    isProOpenAcctBiz: function(busiCode){
        let openBiz = ["V0051"]
        return openBiz.indexOf(busiCode) != -1
    },
    //是否是修改资料业务
    isCustInfoModify: function(busiCode){
        let modifyBiz = ["V0049", "V0163"]
        return modifyBiz.indexOf(busiCode) != -1

    },
    //是否是资料变更类业务 关键信息变更 密码重置等
    isBusiChangeBiz:function(busiCode){
        let changeBiz = ["V0009","V0011","V0005","V0055"]
        return changeBiz.indexOf(busiCode) != -1
    },
    //流程模式 国信VTM是预受理模式，国信移动端是预录入模式，中泰移动端是预受理模式 ,中山移动版是预录入模式 
    //预受理模式 新建流程状态为02预受理，预录入模式新建流水状态为00预录入
    getFlowModel: function(){
        if(this.isQSJG(defineConfig.$definecfg.QSJGDM_CONST.ZHONGTAI)){
            if(baseConfig.$basecfg.isMobileFlag){
                return "02"
            }
        }else if(this.isQSJG(defineConfig.$definecfg.QSJGDM_CONST.GUOXIN)){
            if(baseConfig.$basecfg.isMobileFlag){
                return "00"
            }else{
                return "02"
            }
        }else if(this.isQSJG(defineConfig.$definecfg.QSJGDM_CONST.ZHONGSHAN)){
            if(baseConfig.$basecfg.isMobileFlag){
                return "00"
            }
        }else if(this.isQSJG(defineConfig.$definecfg.QSJGDM_CONST.ANXIN)){
            //安信将VTM提交的改为01受理状态，02预受理安信模式不能提交发起流程
            return '01'
        }else{
            //标准版 受理模式
            return "02"
        }
    },
    //获取操作渠道，移动为3，vtm为4  
    getYztChannel: function(){
        return baseConfig.$basecfg.isMobileFlag ? "3" : "4"
    },
    isWeb: function(){
        return typeof window.broadcaster == "undefined";
    },
    //是否為xx券商 ，name="GUANGZHOU" name=["GUANGZHOU","BIAOZHUN"]
    isQSMZ: function(name){
        return _.includes(name,defineConfig.$definecfg.QSJGDM_CONST[baseConfig.$basecfg.qsVersion])
    },
    K_KDXF_REQUEST (param) {
        // url = encodeURI(url);
        let data=param||{};
        let baseUrl = "http://127.0.0.1:8769";
        let axioscfgObj = Object.assign({}, axiosConfig.$axioscfg);
        // axioscfgObj.headers && (axioscfgObj.headers["Content-Type"] = "json");
        axioscfgObj.baseURL && (axioscfgObj.baseURL = baseUrl);
        return new Promise((resolve, reject) => {
          axios.post("/", data, axioscfgObj).then(resdata => {
            if (resdata.status == 200) {
              resolve(resdata.data);
            } else {
              reject({
                msg: "请求失败了",
              });
            }
          }).catch(err => {
            reject(err);
          });
        });
    },
}

const plugin = {
    install(Vue) {
        //添加全局方法或属性
        Vue.syscfg = configObject
            //添加实例方法
        Vue.prototype.$syscfg = configObject
    },
    $syscfg: configObject
}

export default plugin
export const install = plugin.install