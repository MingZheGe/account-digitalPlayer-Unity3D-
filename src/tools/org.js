import storage from "../tools/storage";
import sysConfig from "../config/sysConfig";
import baseConfig from "../config/baseConfig"

/**
 * org模块，支持前端缓存
 * @author liwei
 */

let isWin = baseConfig.isWin; //是否是windows
const org = {

/** 
***根据机构编号获取机构名称**
* @method getOrgData
* @param {string} isSort 是否排序
*
*/
getOrgData : function(isSort){
   
    return new Promise((resolve,reject) => {

        let cacheArr = storage.$storage.getJsonSession('OrgData') || [];

        if(cacheArr.length){
            resolve(cacheArr);
        }else{
            sysConfig.$syscfg.K_Request("Y1000200").then(function(data) {
            
                let d = data.Data;
    
                cacheArr = false !== isSort ?_.chain(d).sortBy(function(v) {
                    return parseInt(v.ORG_CODE);
                }).value() : d;
    
                storage.$storage.setSession('OrgData', cacheArr);
                
                resolve(cacheArr);
    
            }).catch(err => {
                console.error(err);
                reject(err);
            })
        }

    })   
},


/*
*
* @method transOrgCode
* @param {string} orgCode 机构编号
*
*
*/
transOrgCode : function(orgCode){
    if(orgCode && orgCode.length<4 && isWin){
        var tmp = '0000'+orgCode;
        return tmp.substring(tmp.length-4);
    }else{
        return orgCode;
    }
},

 /**
 * **根据机构编号获取机构信息**
 *
 * 使用方法：
 * ```javascript
 * org.getOrgDataById("1001").then(function(orgObj) {
 *  console.log(orgObj);
 * });
 * ```
 * @method getOrgDataById
 * @param {string} orgCode 机构编号
 * @param {string} isSort 是否排序
 * @param {string} orgType 机构类型
 * @return {Object} **[Deferred Object](http://api.jquery.com/category/deferred-object/)**
 */
getOrgDataById : function(orgCode, isSort, orgType){
    return new Promise((resolve,reject) => {
        org.getOrgData(isSort).then(function(orgArr) {
            resolve( _.chain(orgArr).find(function(v) {
                return Number(v.ORG_CODE) === Number(orgCode) && (orgType ? v.ORG_TYPE == orgType : true);
            }).value() || {});
        }); 
    })
},

 /**
 * **根据机构类型获取机构信息**
 *
 * 使用方法：
 * ```javascript
 * org.getOrgDataByType("1").then(function(orgArr) {
 *  console.log(orgArr);
 * });
 * ```
 * @method getOrgDataByType
 * @param {string} orgType 机构类型
 * @return {Object} **[Deferred Object](http://api.jquery.com/category/deferred-object/)**
 */
getOrgDataByType : function(orgType, isSort){
    return new Promise((resolve,reject) => {
        org.getOrgData(isSort).then(function(orgArr) {
            resolve( _.chain(orgArr).filter(function(v) {
                return v.ORG_TYPE === orgType;
            }).value() || []);
        });
    })
},

  /**
 * **翻译机构数据**
 *
 * 使用方法：
 * ```javascript
 * org.transFormData({ORG_CODE:'101'}).then(function(data) {
 *  console.log(data);
 * });
 * ```
 * @method transFormData
 * @param {object|array} arg 需要转换的数据
 * @param {string} codekey 机构编号字段名称
 * @param {string} orgType 机构类型字段名称
 * @param {boolean} shallow 是否使用浅拷贝
 * @return {Object} **[Deferred Object](http://api.jquery.com/category/deferred-object/)**
 */
transFormData : function(arg, codekey, orgType, shallow){

    return new Promise((resolve,reject) => {

        var isArray = Array.isArray(arg),
            orgCodeKey = codekey || "ORG_CODE",
            data = shallow ? Object.assign([], isArray ? arg : [arg]) : _.defaultsDeep([], isArray ? arg : [arg]);
        orgType = orgType || "0";
        org.getOrgData().then(function(orgData) {
        
            data.map(item => {
                let orgObj;
                if(!item[orgCodeKey]) {
                    return true;
                }
                orgObj = _.chain(orgData).find(function(v) {
                    return org.transOrgCode(v.ORG_CODE) === org.transOrgCode(item[orgCodeKey]) && v.ORG_TYPE === orgType;
                }).value();

                if(orgObj) {
                    item[orgCodeKey + "_TEXT"] = orgObj.ORG_NAME;
                }else{
                    item[orgCodeKey + "_TEXT"] = ""; //避免前端text值为undefined
                }
                return item;
            })

            resolve(isArray ? data : data[0])
        })
        
    });
}

}

export default org