
import sysConfig from "../config/sysConfig";

const mobile = {
    mobileValidate : function(param){
        var inputObj = _.extend({}, param);
        if (inputObj && inputObj.ID_TYPE == "08") {
            inputObj = _.extend({}, inputObj, {ID_TYPE: '00',noProcess:true});
        }
        return new Promise((resolve,reject) => {
            sysConfig.$syscfg.K_Request("YG210071",inputObj).then((data) => {
                var output = data.Data,
                    tmpArr = [],
                    flag = "1";

                    _.each(output,function (v) {
                        var returnFlag = "1";
                        if (v.RETURN_CODE != "0") {
                            flag = "0";
                            returnFlag = "0";
                        }
                        var keyObj = {};
                        if (v.ACCTBIZ_CLS == "01") {
                            keyObj.NAME = "手机状态查询";
                        } else if (v.ACCTBIZ_CLS == "02" && !param.JIZHU_FLAG) {
                            keyObj.NAME = "手机+名称核查";
                        } else if (v.ACCTBIZ_CLS == "03" && !param.JIZHU_FLAG) {
                            keyObj.NAME = "手机+证件核查";
                        } else if (v.ACCTBIZ_CLS == "02" && param.JIZHU_FLAG) {
                            keyObj.NAME = "手机+机主姓名核查";
                        } else if (v.ACCTBIZ_CLS == "03" && param.JIZHU_FLAG) {
                            keyObj.NAME = "手机+机主证件核查";
                        }

                        keyObj.OUTPUT = v.RETURN_MSG || "";
                        keyObj.FLAG = returnFlag;
                        tmpArr.push(keyObj);
                    });
                    resolve([{
                        result: tmpArr,
                        flag: flag
                    }]);
            }).catch(err=> {
                reject(err);
            })
        })
    },
}
export default mobile