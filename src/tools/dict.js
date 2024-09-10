import { isString } from "util";
import storage from "../tools/storage";
import sysConfig from "../config/sysConfig";
import defineConfig from "../config/defineConfig";
import { isObject } from "util";

/**
 * ##dict模块##
 * @author yexiaoqing
 */
const getDictDataByOrgCode = function (dictData, orgCode) {
    var tmpData = {};

    if (!orgCode) {
        return dictData;
    }


    _.forEach(dictData, function (dictArr, key) {
        var arr = dictArr.filter(function (dictObj) {
            return orgCode === dictObj.ORG_CODE;
        });

        arr.length && (tmpData[key] = arr);
    });

    return tmpData;
}
const isSingleByte = function (value, dictData) {
    if (-1 !== value.indexOf(",")) {
        return false;
    }

    var flag = true;
    dictData.forEach(function (obj, i) {
        if (obj.DICT_ITEM.length > 1) {
            return flag = false;
        }
    });

    return flag;
}

const getDictText = function (value, dictData) {
    var valArr = Array.isArray(value) ? value : isString(value) ? value.split(isSingleByte(value, dictData) ? "" : ",") : [],
        txtArr = [];

    valArr.length && valArr.forEach(function (v) {
        var obj = dictData.find(function (dictObj) {
            return dictObj.DICT_ITEM === v;
        });

        obj && txtArr.push(obj.DICT_ITEM_NAME);
    });

    return txtArr.length ? txtArr.join("，") : "";
}

export default {

    /**
     * **获取数据字典**
     * @method getDictData
     * @param {string|array} arg 数据字典的key
     * @return {Object}
     */
    getDictData: function (arg, orgCode) {
        var cacheObj = storage.$storage.getJsonLocal(defineConfig.$definecfg.SYS_DICT_CACHE) || {},
            args = _.cloneDeep(arg),
            arrKeys = [],
            retObj = {},
            reqArrKeys = [],
            tmpObj = orgCode ? getDictDataByOrgCode(cacheObj, orgCode) : cacheObj;
        return new Promise(function (resolve, reject) {
            if (!args) {
                resolve(null)
            }
            if (Array.isArray(args)) {
                arrKeys = args;
            }
            if (isString(args)) {
                arrKeys = args.split(",");
            }
            arrKeys.forEach(function (v, i) {    //优先从缓存取
                if (tmpObj[v]) {
                    retObj[v] = tmpObj[v];
                    return;
                }
                reqArrKeys.push(v);
            });
            if (!reqArrKeys.length) {    //没有要请求的数据直接触发done回调
                resolve(retObj);
                return;
            }
            sysConfig.$syscfg.K_Request("W0000006", {
                cacheType: "dictCache",
                keyCode: reqArrKeys.join(",")
            }).then(function (data) {
                var dataStr = data && data.Data && data.Data[0] && data.Data[0].cache;
                var linesDictData = dataStr && JSON.parse(dataStr) || {};
                if (isObject(linesDictData) && !Object.keys(linesDictData).length) {
                    resolve(retObj)
                }
                var tempObj = Object.assign({}, cacheObj, orgCode ? getDictDataByOrgCode(linesDictData, orgCode) : linesDictData);
                storage.$storage.setLocal(defineConfig.$definecfg.SYS_DICT_CACHE, tempObj);
                resolve(Object.assign({}, retObj, orgCode ? getDictDataByOrgCode(linesDictData, orgCode) : linesDictData));
            }).catch(function () {
                reject(arguments)
            });
        })
    },

    /**
     * **根据数据字典key 获取对应的数据字典项**
     * ```
     * @method getDictByKey
     * @param {string} key 数据字典的key
     * @return {Object}
     */
    getDictByKey: function (key, orgCode) {
        var that = this;
        return new Promise(function (resolve, reject) {
            if (!key || !isString(key)) {
                resolve(null);
            }
            that.getDictData([key], orgCode).then(function (obj) {
                resolve(obj && obj[key]);
            }).catch(function () {
                reject(arguments);
            });
        })
    },

    /**
     * 转换字典的DICT_ITEM、DICT_ITEM_NAME 为 dict_val、dict_des
     * @param dictData
     * @returns {Array} 字典数据
     */
    transformDictDes: function (dictData) {
        for (var i = 0; i < dictData.length; i++) {
            dictData[i]['dict_val'] = dictData[i]['DICT_ITEM'];
            dictData[i]['dict_des'] = dictData[i]['DICT_ITEM_NAME'];
        }
        return dictData;
    },

    /**
     * 转换字典的SUBITEM、SUBITEMNAME 为 dict_val、dict_des
     * @param dictData
     * @returns {Array} 字典数据
     */
    transformFundDictDes: function (dictData) {
        for (var i = 0; i < dictData.length; i++) {
            dictData[i]['dict_val'] = dictData[i]['SUBITEM'];
            dictData[i]['dict_des'] = dictData[i]['SUBITEMNAME'];
        }
        return dictData;
    },


    /**
     * **翻译数据中的字典项目**
     * @method transformDict
     * @param {string|array} data 需要替换的数据
     * @param {string|array} dictKeys 查找的数据字典
     * @param {string|array} shallow 是否使用浅拷贝
     * @return {Object} 
     */
    transformDict: function (data, dictKeys, orgCode, shallow) {
        var that = this,
            isArray = data && Array.isArray(data),
            keysObj,
            dictKeys,
            retData;
        return new Promise(function (resolve, reject) {
            if (isArray && !data.length || !data) {
                resolve(data)
            }

            if (!isArray && isObject(data) && !(Object.keys(data).length)) {
                resolve(data)
            }
            var tempData = isArray ? data : [data];
            retData = !shallow ? JSON.parse(JSON.stringify(tempData)) : tempData;
            keysObj = (function () {
                var retObj = {};
                var dictKeysArr = Array.isArray(dictKeys) ? dictKeys : isString(dictKeys) ? dictKeys.split(",") : [dictKeys];
                dictKeysArr.forEach(function (v) {
                    if (isObject(v)) {
                        Object.assign(retObj, v);
                    } else if (isString(v)) {
                        //*号为通配符
                        retObj[v] = v.replace("*", "");
                    }
                });
                return retObj;
            })();
            that.getDictData(dictKeys = Array.from(new Set(Object.values(keysObj))), orgCode).then(function (dictObj) {
                retData.forEach(function (sData) {
                    _.each(keysObj, function(val, key) {
                        var dictKey = val;
                        var dictText;

                        //*号为通配符,不论前后
                        if (key.indexOf("*") > -1) {
                            key = key.replace("*", "");
                            if (!dictObj[dictKey]) {
                                return;
                            }
                            if (isObject(sData)) {
                                for (const name in sData) {
                                    var value = sData[name];
                                    if (name.indexOf(key) > -1) {
                                        (dictText = that.getDictText(value, dictObj[dictKey]))
                                            && (sData[name + "_TEXT"] = dictText);
                                    }
                                }
                            }

                        } else {
                            if (!dictObj[dictKey] || !sData || !sData[key]) {
                                return;
                            }
                            (dictText = that.getDictText(sData[key], dictObj[dictKey]))
                                && (sData[key + "_TEXT"] = dictText);
                        }
                    })
                })
                resolve(isArray ? retData : retData[0])
            }).catch(function () {
                reject(arguments)
            });
        })
    },
    /**
     * **获取字典值对应的文本**
     *
     * @method getDictText
     * @return {string} 字典文本
     */
    getDictText: getDictText,


    /**
     * **获取到字典数据**
     *
     * @method requestDict
     * @param {string} dictCode 数据字典的key
     * @return {Array} 字典数据
     */
    requestDict: function (dictCode) {
        var dicts = [];
        return new Promise(function (resolve, reject) {
            sysConfig.$syscfg.K_Request("W0000006", {
                cacheType: "dictCache",
                keyCode: dictCode
            }).then(function (data) {
                var linesDictData = JSON.parse(data && data.Data && data.Data[0] && data.Data[0].cache || {});
                var ret = linesDictData[dictCode] || [];
                for (var i = 0; ret && i < ret.length; i++) {
                    dicts.push({ "dict_val": ret[i]["DICT_ITEM"], "dict_des": ret[i]["DICT_ITEM_NAME"], "dict_org": ret[i]["INT_ORG"] });
                }
                resolve(dicts)
            }).catch(function () {
                resolve(dicts)
            })
        })

    },
    /**
 * ** 根据获取字典项的val获取对应的文本，当val为undefine时获取字典数据
 * @method getSysDict
 * @param {string} dictCode 数据字典的key
 * @param {string} val 数据字典项的key
 * @return {Array|String} 数组为数据字典集合，当val有有效时为对应的文本数据
 */
    getSysDict: function (dictCode, val) {
        var that = this;
        var dictCodeName = dictCode;
        var rexp = "";
        var g_dicts = storage.$storage.getJsonLocal(defineConfig.$definecfg.SYS_DICT_CACHE) || {};
        var comString = "";
        if (dictCode.indexOf('[') > -1) {
            dictCodeName = dictCode.substring(0, dictCode.indexOf("["))
            rexp = dictCode.substring(dictCode.indexOf("[") + 1, dictCode.indexOf("]"));
            if (rexp.substr(0, 1) == "!") {
                comString = rexp.substr(1);
            } else {
                comString = rexp;
            }
        }

        var dicts =  [];
        (g_dicts[dictCodeName] || []).forEach(function(v) {
            dicts.push({ "dict_val": v["DICT_ITEM"], "dict_des": v["DICT_ITEM_NAME"], "dict_org": v["INT_ORG"] });
        });
      
        if (!val) {
            if (rexp != "") {
                var finaldicts = new Array();
                for (var i = 0; i < dicts.length; i++) {
                    if (rexp.substr(0, 1) == "!") {
                        if (dicts[i]['dict_val'].substr(0, comString.length) != comString) {
                            finaldicts.push(dicts[i]);
                        }
                    } else {
                        if (dicts[i]['dict_val'].substr(0, comString.length) == comString) {
                            finaldicts.push(dicts[i]);
                        }
                    }
                }
                dicts = finaldicts;
            }

            return dicts;
        }
        if (dicts) {
            for (var i = 0; i < dicts.length; i++) {
                if (dicts[i]['dict_val'] == val) {
                    return dicts[i]['dict_des'];
                }
            }
        }
        return val;
    },
    /**
     * 清空数据字典前端缓存
     */
    clearCache: function () {
        storage.$storage.removeLocal(defineConfig.$definecfg.SYS_DICT_CACHE)
    }
};
