import baseConfig from "../config/baseConfig"
// 业务双录模板配置查询                
export const checkRecordMoudle = (busiScope) => {
    return sysConfig.$syscfg.K_Request("W0000117", sysCust);
}

//客户风险评测业务答案提交               
export const submitEvaluating = (sysCust) => {
    return sysConfig.$syscfg.K_Request("Y3000904", sysCust);
}


// 业务流程提交
export const submitTask = function(param) {
        return sysConfig.$syscfg.K_Request("Y1001096", {
            B_SNO: param.B_SNO,
            BUSI_CODE: param.BUSI_CODE,
            HANDLE_CODE: param.HANDLE_CODE,
            // processInstanceId: param.processInstanceId,
            // taskId: param.taskId,
            // NODE_KEY: param.NODE_KEY,
            // NODE_NAME: param.NODE_NAME,
            // "object.PROC_VAR": param.PROC_VAR,
            APP_REMARK: param.APP_REMARK,
            OP_START_TIME: param.OP_START_TIME || '',
            "object.FLOW_VARS": param.FLOW_VARS || ''
        });
    }
    // 查询业务的当前流程
export const getHistoryBizs = function(param) {
        // return sysConfig.$syscfg.K_Request("YG003780", param);
        return sysConfig.$syscfg.K_Request("W0000114", param);
    }
    // 提交风险测评答案后，同步相关信息
export const synEvaluatingInfo = function(param) {
        return sysConfig.$syscfg.K_Request("YG000904", param);
    }
    // 开户业务提交风险测评答案后，同步相关信息
export const openSynEvaluatingInfo = function(param) {
        return sysConfig.$syscfg.K_Request("Y1190109", param);
    }
    // 业务流程节点查询字典
export const getFlowDic = function(dic) {
        if (dic == "01") {
            return "受理";
        } else if (dic == "02") {
            return "预受理";
        } else if (dic == "03") {
            return "待审批";
        } else if (dic == "04") {
            return "审批中";
        } else if (dic == "05") {
            return "待审核";
        } else if (dic == "06") {
            return "审核中";
        } else if (dic == "07") {
            return "待复核";
        } else if (dic == "08") {
            return "复核中";
        } else if (dic == "09") {
            return "待差错处理";
        } else if (dic == "10") {
            return "差错处理中";
        } else if (dic == "11") {
            return "驳回";
        } else if (dic == "12") {
            return "预受理驳回";
        } else if (dic == "13") {
            return "完成";
        }
    }
    //生成分屏页面或者像分屏页面传递数据
export const openView = function(params) {
    //VTM 
    if (baseConfig.$basecfg.platform == "vtm") {
        if (popupwin) {
            popupwin.postMessage(params, window.location.protocol+"//" + window.location.host);
        } else {
            window.popupwin = window.open("second.html", 'videoRecord', 'height=1080,width=1920,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no,fullscreen=yes,channelmode=yes,titlebar=no');
            setTimeout(function() {
                window.popupwin.postMessage(params, window.location.protocol + "//" + window.location.host);
            }, 2000)
        }
    }
}