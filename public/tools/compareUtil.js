import {
    getApplyAndAgreementAndSignInfo,
    getEContractInfo,
} from "@/service/image-service";
import storage from "@/tools/storage";
import define from "@/config/defineConfig";

export default {
    async getData(busiCode, userType, imgCls, busiData) {
        let config = require(`../business/${imgCls}/${busiCode}.js`).default;
        return config[userType].getData(busiData);
    },
    async compare(busiCode, userType, imgCls, busiData) {
        let config = require(`../business/${imgCls}/${busiCode}.js`).default;
        let oldData = busiData.HISTORY_SIGN_DATA[imgCls];
        return config[userType].compare(busiData, oldData);
    },
    async compareContract(busiCode, userType, newBusi) {
        let that = this;
        if (!newBusi.CONTRACT_SIGN_HISTORY) {
            return true;
        }
        let oldContractIndex = {};
        for (let i = 0; i < newBusi.CONTRACT_SIGN_HISTORY.length; i++) {
            oldContractIndex[newBusi.CONTRACT_SIGN_HISTORY[i].CONTRACT_NAME] =
                newBusi.CONTRACT_SIGN_HISTORY[i];
        }
        let currentContractInfo = await that.getCurrentContractInfo(newBusi, newBusi.CONTRACT_SIGN_HISTORY_CLS);
        if (
            currentContractInfo.length != newBusi.CONTRACT_SIGN_HISTORY.length
        ) {
            return false;
        }
        for (let index = 0; index < currentContractInfo.length; index++) {
            let item = currentContractInfo[index];
            let old = oldContractIndex[item.CONTRACT_NAME];
            if (!old) {
                return false;
            }
            if (
                item.CONTRACT_MD5 != old.CONTRACT_MD5 ||
                item.VERSION != old.VERSION
            ) {
                return false;
            }
        }
        return true;
    },
    async getCurrentContractInfo(busiData, imgCls) {
        if (imgCls == '220') {
            return await Promise.all([getApplyAndAgreementAndSignInfo(busiData.B_SNO, busiData.BUSI_CODE)]).then(function (data) {
                //md5 去重
                let contractArr = _.uniqBy(data[0] || [], "IMG_CLS")
                let imgClsShow = storage.$storage.getJsonSession(define.$definecfg.IMG_ALL_ARR)
                if (imgClsShow && imgClsShow.length > 0) {
                    contractArr = _.filter(contractArr, function (v) {
                        return imgClsShow.includes(v.IMG_CLS);
                    });
                }
                console.log("获取签署协议列表1");
                return contractArr;
            });
        } else {
            var tempContractInfo = await Promise.all([
                getApplyAndAgreementAndSignInfo(busiData.B_SNO, busiData.BUSI_CODE),
            ]).then(function (data) {
                let contractArr = _.uniqBy(data[0] || [], "IMG_CLS");
                let imgClsShow = storage.$storage.getJsonSession(
                    define.$definecfg.IMG_ALL_ARR
                );
                if (imgClsShow && imgClsShow.length > 0) {
                    contractArr = _.filter(contractArr, function (v) {
                        return imgClsShow.includes(v.IMG_CLS);
                    });
                }
                return contractArr;
            });
            let contractInfo = await getEContractInfo().then(function (res) {
                let eContractInfo = res || {}; //静态md5
                let contractFilterInfo = tempContractInfo;
                contractFilterInfo = _.map(contractFilterInfo, function (info) {
                    let filterData = _.filter(eContractInfo, function (fdata) {
                        return (
                            fdata.IMG_CLS == info.IMG_CLS &&
                            fdata.USER_TYPE == "1" &&
                            (info.VERSION ? fdata.VERSION == info.VERSION : true)
                        );
                    });
                    let data = _.maxBy(filterData, function (v) {
                        return v.BEGIN_DATE;
                    });
                    if (data) {
                        info = _.extend({}, info, {
                            VERSION: data.VERSION,
                            STANDARD_MD5: data.MD5_CODE,
                        });
                    }
                    return info;
                });
                return contractFilterInfo && contractFilterInfo.length > 0 ?
                    contractFilterInfo : [];
            });
            console.log("获取签署协议列表2");
            return contractInfo;
        }
    },
};
