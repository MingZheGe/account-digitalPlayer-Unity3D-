/**
 * 流程任务接口封装
 * 任务的流转接口
 * @author zhubc chenk
 */
define(function(require, exports, module) {
    // var flowService = require("./flow-service-web2");

    // /**
    //  * 业务受理最后一步提交任务
    //  * @param busiData
    //  * @returns {*}
    //  */
    // function acceptTaskSubmit(busiData){
    //     return ajax.post({
    //         req : $.extend({
    //             service : "YG003630"
    //         },busiData)
    //     });
    // }

    // /**
    //  * 业务受理提交至受理提交中
    //  * @param busiData
    //  * @returns {*}
    //  */
    // function acceptTaskSubmit2(busiData){
    //     return ajax.post({
    //         req : $.extend({
    //             service : "YG003638"
    //         },busiData)
    //     });
    // }

    // /**
    //  * 业务受理提交至待双录
    //  * @param busiData
    //  * @returns {*}
    //  */
    // function acceptTaskSubmit3(busiData){
    //     return ajax.post({
    //         req : $.extend({
    //             service : "YG003640"
    //         },busiData)
    //     });
    // }

    // /**
    //  * 业务数据修改
    //  * @param busiData
    //  * @returns {*}
    //  */
    // function busiDataUpdate(busiData){
    //     return ajax.post({
    //         req : $.extend({
    //             service : "Y1001032"
    //         },busiData)
    //     });
    // }

    // /**
    //  * 认领业务抢单
    //  * 需要业务基本信息，用来展示审核界面
    //  * @param param
    //  * @returns {*}
    //  */
    // function grabClaimTask(param){
    //     return ajax.post({
    //         req : $.extend({
    //             service : "YG003631"
    //         },param)
    //     }).then(function(data){
    //         return data && data[0] && data[0][0];
    //     });
    // }

    // /**
    //  * 抢单认领任务，不需要返回数据
    //  * @param param
    //  * @returns {*}
    //  */
    // function grabClaimTaskSingle(param){
    //     return ajax.post({
    //         req : $.extend({
    //             service : "YG003632"
    //         },param)
    //     });
    // }

    // /**
    //  * 任务取消认领
    //  * @param param
    //  * @returns {*}
    //  */
    // function cancelClaimTask(param){
    //     return ajax.post({
    //         req : $.extend({
    //             service : "YG003633"
    //         },param)
    //     });
    // }

    // /**
    //  * 驳回认领任务
    //  * @param param
    //  * @returns {*}
    //  */
    // function rejectClaimTask(param){
    //     return ajax.post({
    //         req : $.extend({
    //             service : "YG003634"
    //         },param)
    //     });
    // }

    // /**
    //  * 审核提交任务
    //  * @param param
    //  */
    // function dealTaskSubmit(param){
    //     return ajax.post({
    //         req : $.extend({
    //             service : "YG003635"
    //         },param)
    //     });
    // }

    /**
     * 任务作废
     * @param param
     * @returns {*}
     */
    function deleteClaimTask(_this, param){
        return _this.$syscfg.K_Request("YG003636", param)
    }

    // /**
    //  * 驳回任务重新办理
    //  * @param param
    //  * @returns {*}
    //  */
    // function rejectTaskAccept(param){
    //     return ajax.post({
    //         req : $.extend({
    //             service : "YG003639"
    //         },param)
    //     });
    // }


    // /**
    //  * 业务抽检认领任务
    //  * @param param
    //  * @returns {*}
    //  */
    // function checkClaimTask(param){
    //     return ajax.post({
    //         req: $.extend({
    //             service : "YG003526"
    //         },param)
    //     }).then(function(data) {
    //         return data && data[0] && data[0][0];
    //     });
    // }

    // /**
    //  * 业务抽检取消认领任务
    //  * @param param
    //  * @returns {*}
    //  */
    // function checkCancelClaimTask(param){
    //     return ajax.post({
    //         req: $.extend({
    //             service : "YG003527"
    //         },param)
    //     }).then(function(data) {
    //         return data && data[0] && data[0][0];
    //     });
    // }

    // /**
    //  * 业务抽检认领任务
    //  * @param param
    //  * @returns {*}
    //  */
    // function checkErrorClaimTask(param){
    //     return ajax.post({
    //         req: $.extend({
    //             service : "YG003528"
    //         },param)
    //     }).then(function(data) {
    //         return data && data[0] && data[0][0];
    //     });
    // }

    // /**
    //  * 业务抽检取消认领任务
    //  * @param param
    //  * @returns {*}
    //  */
    // function checkErrorCancelClaimTask(param){
    //     return ajax.post({
    //         req: $.extend({
    //             service : "YG003529"
    //         },param)
    //     }).then(function(data) {
    //         return data && data[0] && data[0][0];
    //     });
    // }


    // /**
    //  * 判断当前审核节点处于一审还是二审状态
    //  * @param urlParam
    //  * @returns {number}
    //  */
    // function getAppvTaskNum(urlParam){
    //     switch (urlParam.NODE_KEY){
    //         case "appvTask1" :
    //             return 1;
    //         case "appvTask2" :
    //             return 2;
    //         case "appvTask3" :
    //             return 3;
    //         case "corrTask" :
    //             return 4;
    //         default :
    //             return 0;   //其他状态
    //     }
    // }



    // /**
    //  * 认领任务，返回业务基本信息
    //  * @param param 认领的任务参数
    //  */
    // function claimTask(param){
    //     return ajax.post({
    //         req: $.extend({
    //             service : "Y1001087"
    //         },param)
    //     }).then(function(data) {
    //         return  $.extend({},data[0][0],data[1][0]);
    //     });
    // }

    // /**
    //  * 取消认领任务
    //  * @param param
    //  */
    // function unclaimTask(param){
    //     return ajax.post({
    //         req: $.extend({
    //             service : "YG003303"
    //         },param)
    //     });
    // }

    // /**
    //  * 驳回任务
    //  * @param param
    //  * @returns {*}
    //  */
    // function rejectTask(param){
    //     return ajax.post({
    //         req: $.extend({
    //             service : "Y1001088",
    //             PROC_VAR: {
    //                 APPROVE_1: "0"
    //             }
    //         },param)
    //     });
    // }

    // /**
    //  * 获取任务信息
    //  * @param taskId 任务号
    //  * @returns object 任务信息
    //  */
    // function getTaskInfo(taskId){
    //     return ajax.post({
    //         req: {
    //             service: "Y1001100",
    //             processInstanceId: taskId
    //         }
    //     }).then(function(data) {
    //         return data[0][0] || {};
    //     });
    // }

    // /**
    //  * 发起任务
    //  * @param param 发起任务的参数
    //  */
    // function startTask(param){
    //     return flowService.getAcceptData(param.B_SNO).then(function(data) {
    //         var tmpObj = data;

    //         if(!tmpObj) {
    //             throw "没有获取到业务数据！";
    //         }

    //         //已经发起过流程，直接返回数据
    //         if(tmpObj.EXECUTION_ID) {
    //             return {
    //                 processInstanceId: tmpObj.EXECUTION_ID
    //             }
    //         }

    //         return ajax.post({
    //             req: {
    //                 service: "Y1001090",    //发起流程
    //                 B_SNO: param.B_SNO,
    //                 BUSI_CODE: param.BUSI_CODE,
    //                 PROCESS_KEY: param.PROCESS_KEY,
    //                 PROC_VAR: param.PROC_VAR,
    //                 ID_TYPE:param.ID_TYPE || data.ID_TYPE,
    //                 ID_CODE:param.ID_CODE || data.ID_CODE,
    //                 CUST_CODE:param.CUST_CODE,
    //                 FLOW_VARS: param.FLOW_VARS
    //             }
    //         }).then(function(data) {
    //             return data && data[0] && data[0][0] || {};
    //         });
    //     });
    // }

    // /**
    //  * 作废远程业务账户流程状态
    //  * @param param
    //  * */
    // function deleteAcctSysProcStatus(params) {
    //     return ajax.post({
    //         req: {
    //            service: "YG003605",
    //            "STATUS": "Z",
    //            "NS_BIZ": params.NS_BIZ,
    //            "SERIAL_NO": params.SERIAL_NO
    //         }
    //     })
    // }

    // /**
    //  * 挂起任务
    //  * @param param
    //  */
    // function suspendTask(param){
    //     return ajax.post({
    //         req: {
    //             service: "Y1001099",
    //             B_SNO: param.B_SNO,
    //             HANDLE_CODE: param.HANDLE_CODE,
    //             APP_REMARK: param.APP_REMARK
    //         }
    //     }).then(function(data) {
    //         return data[0][0] || {};
    //     });
    // }




    // /**
    //  * 提交任务
    //  * @param param
    //  */
    // function submitTask(param){
    //     return ajax.post({
    //         req: {
    //             service: "YG003310",
    //             ORG_CODE: param.ORG_CODE,
    //             BUSI_CODE: param.BUSI_CODE
    //         }
    //     }).then(function(data){
    //         var flowVars = param.FLOW_VARS || {};
    //         if (param.FLOW_VARS) {
    //             flowVars = $.extend(flowVars, param.FLOW_VARS);
    //         }
    //         if(data && data[0] && data[0][0] && !$.isEmptyObject(data[0][0])){
    //             $.extend(flowVars,{REVIEW_MODE:data[0][0].REVIEW_MODE});
    //         }
    //         return ajax.post({
    //             req: {
    //                 service: "Y1001096",
    //                 B_SNO: param.B_SNO,
    //                 BUSI_CODE: param.BUSI_CODE,
    //                 HANDLE_CODE: param.HANDLE_CODE,
    //                 processInstanceId: param.processInstanceId,
    //                 taskId: param.taskId,
    //                 NODE_KEY: param.NODE_KEY,
    //                 NODE_NAME: param.NODE_NAME,
    //                 PROC_VAR: param.PROC_VAR,
    //                 APP_REMARK: param.APP_REMARK,
    //                 OP_START_TIME:param.OP_START_TIME|| '',
    //                 FLOW_VARS : flowVars
    //             }
    //         });
    //     });
    // }

    // /**
    //  * 同步外部系统（任务提交，pushlet执行）
    //  */
    // function syncExtSys(param){
    //     var defObj = $.Deferred(),
    //         plInst,
    //         bizResultArr;

    //     //判断是否是最后一个任务
    //     function isLast(sequ) {
    //         if(!bizResultArr || !bizResultArr.length) {
    //             return false;
    //         }

    //         var index = _.findIndex(bizResultArr, function(v) {
    //             return v.SEQU === sequ;
    //         });

    //         return index === (bizResultArr.length - 1);
    //     }

    //     function getSyncObj(sequ) {
    //         if(!bizResultArr || !bizResultArr.length) {
    //             return;
    //         }
    //         return _.find(bizResultArr, function(v) {
    //             return v.SEQU === sequ
    //         });
    //     }
    //     $.when(
    //         param.NODE_KEY ?
    //         {NODE_KEY: param.NODE_KEY} :
    //             getTaskInfo(param.processInstanceId)
    //     ).then(function(taskObj) {
    //             //使用pushlet发送请求
    //             plInst = pushlet.request({
    //                 req: {
    //                     service: "Y1001097",
    //                     B_SNO: param.B_SNO,
    //                     BUSI_CODE: param.BUSI_CODE,
    //                     processInstanceId: param.processInstanceId,
    //                     NODE_KEY: taskObj.NODE_KEY,
    //                     PROC_VAR: param.PROC_VAR,
    //                     PROC_STATUS: param.PROC_STATUS,
    //                     F_CUST_ORG_CODE:param.F_CUST_ORG_CODE||''
    //                 },
    //                 callback: function(data, head) {
    //                     var tmpObj = data[0] || {HANDLE_STATUS: "2"};

    //                     if(tmpObj.syncExtSys) { //是否同步外部系统结果集
    //                         if("true" !== tmpObj.syncExtSys) {  //没有同步外部系统，调用外部的done
    //                             defObj.resolveWith(this, [{
    //                                 syncExtSys: false,
    //                                 isPreacceptance: "true" === tmpObj.isPreacceptance
    //                             }, head]);
    //                         }
    //                     } else if(tmpObj.B_SNO) {   //后台推送的同步详情数据，调用外部的progress
    //                         bizResultArr = data;
    //                         defObj.notifyWith(this, [data, head]);

    //                         var lastObj = data[data.length - 1];
    //                         if("0" !== lastObj.HANDLE_STATUS && "2" !== lastObj.HANDLE_STATUS) {
    //                             defObj.resolveWith(this, [{
    //                                 syncExtSys: true,
    //                                 isPreacceptance: false
    //                             }, head]);
    //                             plInst.leave();
    //                         }
    //                     } else {

    //                         if(!tmpObj.BUSI_CODE) {
    //                             pushlet.isSuccess(head) ? defObj.resolveWith(this, [{
    //                                 syncExtSys: false,
    //                                 isPreacceptance: false
    //                             }, head]) : defObj.rejectWith(this, [tmpObj, head]);
    //                             plInst.leave();
    //                         }

    //                         //历史处理状态为1-成功或3-跳过的不通知外部回调
    //                         var tmpSyncObj = getSyncObj(tmpObj.SEQU) || {};
    //                         if("1" === tmpSyncObj.HANDLE_STATUS || "3" === tmpSyncObj.HANDLE_STATUS) {
    //                             return;
    //                         }

    //                         //单个任务执行成功或3-跳过，调用外部的progress
    //                         if("3" === tmpObj.HANDLE_STATUS || pushlet.isSuccess(head)) {
    //                             defObj.notifyWith(this, [tmpObj, head]);
    //                             if(isLast(tmpObj.SEQU)) {   //全部执行完成，调用外部的done
    //                                 defObj.resolveWith(this, [{
    //                                     syncExtSys: true,
    //                                     isPreacceptance: false
    //                                 }, head]);
    //                                 plInst.leave();
    //                             }
    //                         } else {    //单个执行不成功，调用外部的progress和fail
    //                             defObj.notifyWith(this, [tmpObj, head]);
    //                             defObj.rejectWith(this, [tmpObj, head]);
    //                             plInst.leave();
    //                         }
    //                     }
    //                 }
    //             });
    //         }).fail(function() {
    //             defObj.rejectWith(this, arguments);
    //         });

    //     return defObj.promise();
    // }

    // /**
    //  * 查询同步外部系统结果
    //  * @param bSno 流水号
    //  * @param busiCode 业务代码
    //  * @returns Array
    //  */
    // function getSyncResult(bSno, busiCode){
    //     return ajax.post({
    //         req: {
    //             service: "Y1001105",
    //             B_SNO: bSno,
    //             BUSI_CODE: busiCode
    //         }
    //     }).then(function(data) {
    //         return data[0] || [];
    //     });
    // }
    // function cancelTask(bSno, remark) {
    //     if(!bSno){
    //         alert("作废任务失败,业务流水号没有传入！");
    //         return $.Deferred().rejectWith(this,[false]);
    //     } else if(!remark) {
    //         alert("作废任务失败,作废原因没有传入！");
    //         return $.Deferred().rejectWith(this,[false]);
    //     } else {
    //         return ajax.post({
    //             req: {
    //                 service: "Y1001093",
    //                 B_SNO: bSno,
    //                 APP_REMARK: remark
    //             }
    //         })
    //     }

    // }
    /**
     * 是否是新的
     * */
    function isNew(busiData,isBusi) {
        return !(busiData.B_SNO);
    }
    // /**
    //  * 是否是只读的流程
    //  * @param busiData 流程数据对象
    //  * @returns boolean 是否是只读的流程
    //  * */
    // function isReadonly(busiData) {
    //     return !isNew(busiData)
    //         && !isRejected(busiData) && !isAccept(busiData) && !isImageFill(busiData)&& !isCsdc(busiData);
    // }
    /**
     * 判断流程是否是受理中状态
     * @param busiData 流程数据对象
     * @returns boolean 判断流程是否是受理中状态
     * */
    function isAccept(busiData) {
        return !isNew(busiData) && "01" === busiData.PROC_STATUS/*受理中*/;
    }
    /**
     * 判断流程是否是预录入状态 
     * @param busiData 流程数据对象
     * @returns boolean 判断流程是否是预录入
     * */
    function isPreInput(busiData) {
        return !isNew(busiData) && "00" === busiData.PROC_STATUS/*预录入*/;
    }
      /**
     * 判断流程是否是预受理状态 
     * @param busiData 流程数据对象
     * @returns boolean 判断流程是否是预受理状态
     * */
    function isPreAccept(busiData) {
        return !isNew(busiData) && "02" === busiData.PROC_STATUS/*预受理*/;
    }
    // /**
    //  * 判断流程是否是受理提交中状态
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断流程是否是受理提交中状态
    //  * */
    // function isAcceptSumbiting(busiData) {
    //     return !isNew(busiData) && "18" === busiData.PROC_STATUS/*受理提交中*/;
    // }
    // /**
    //  * 判断流程是否是影像补采
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断流程是否是影像补采
    //  * */
    // function isAdditional(busiData){
    //     return !isNew(busiData) && "09" === busiData.PROC_STATUS/*影像补采*/;
    // }
    /**
     * 判断流程是否是预受理驳回状态
     * @param busiData 流程数据对象
     * @returns boolean 判断流程是否是驳回状态
     * */
     function isPreRejected(busiData) {
        return !isNew(busiData)
        && "12" === busiData.PROC_STATUS/*预受理驳回*/;
        // return !isNew(busiData)
            // && ("11" === busiData.PROC_STATUS/*驳回*/ || "12" === busiData.PROC_STATUS/*预受理驳回*/);
    }
    /**
     * 判断流程是否是驳回状态
     * @param busiData 流程数据对象
     * @returns boolean 判断流程是否是驳回状态
     * */
    function isRejected(busiData) {
      return !isNew(busiData)
            && ("11" === busiData.PROC_STATUS/*驳回*/ || "12" === busiData.PROC_STATUS/*预受理驳回*/); 
    }
    // /**
    //  * 判断流程是否是完成状态
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断流程是否是完成状态
    //  * */
    // function isFinished(busiData) {
    //     return !isNew(busiData) && "13" === busiData.PROC_STATUS;
    // }
    // /**
    //  * 判断流程是否是挂起状态
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断流程是否是挂起状态
    //  * */
    // function isSuspend(busiData) {
    //     return !isNew(busiData) && "14" === busiData.PROC_STATUS;
    // }
    // /**
    //  * 判断流程是否是废除状态
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断流程是否是废除状态
    //  * */
    // function isCanceled(busiData) {
    //     return !isNew(busiData) && "15" === busiData.PROC_STATUS;
    // }
    // /**
    //  * 判断流程是否是影像采集状态
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断流程是否是影像采集状态
    //  * */
    // function isImageFill(busiData) {
    //     return !isNew(busiData) && "09" === busiData.PROC_STATUS;
    // }
    // /**
    //  * 判断流程是否是代理中登业务状态
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断流程是否是代理中登业务状态
    //  * */
    // function isCsdc(busiData) {
    //     return !isNew(busiData) && busiData.BUSI_CODE.charAt("0") === "D";
    // }
    // /**
    //  * 判断是否是审核节点  一审 二审 三审 满足其一
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断是否是审核节点
    //  * */
    // function isAppvTaskNode(param) {
    //     return isAppvTask1Node(param) || isAppvTask2Node(param) || isAppvTask3Node(param);
    //     //return !!(param && "appvTask" === param.NODE_KEY);
    // }
    // /**
    //  * 判断是否是受理提交节点
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断是否是受理提交节点
    //  * */
    // function isAccepterTaskNode(param) {
    //     return !!(param && "accepterTask" === param.NODE_KEY);
    // }
    // /**
    //  * 判断是否是复核节点
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断是否是复核节点
    //  * */
    // function isRepAppvTaskNode(param) {
    //     return !!(param && "repAppvTask" === param.NODE_KEY);
    // }
    // /**
    //  * 判断是否是营业部不复核节点
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断是否是营业部不复核节点
    //  * */
    // function isDeptAppvTaskNode(param) {
    //     return !!(param && "deptAppvTask" === param.NODE_KEY);
    // }
    // /**
    //  * 判断是否是差错处理节点
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断是否是差错处理节点
    //  * */
    // function isErrorAppvTaskNode(param) {
    //     return !!(param && "corrTask" === param.NODE_KEY);
    // }
    // /**
    //  * 判断是否在审批中-04、审核中-06、复核中-08状态
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断是否在审批中-04、审核中-06、复核中-08状态
    //  * */
    // function isWorkingStatus(busiData) {
    //     return !isNew(busiData) && ("04,06,08".indexOf(busiData.PROC_STATUS) != -1);
    // }
    // /**
    //  * 判断是否是一审节点(国信)
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断是否是一审节点
    //  * */
    // function isAppvTask1Node(param) {
    //     return !!(param && "appvTask1" === param.NODE_KEY);
    // }
    // /**
    //  * 判断是否是二审节点(国信)
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断是否是二审节点
    //  * */
    // function isAppvTask2Node(param) {
    //     return !!(param && "appvTask2" === param.NODE_KEY);
    // }
    // /**
    //  * 判断是否是三审节点(国信)
    //  * @param busiData 流程数据对象
    //  * @returns boolean 判断是否是三审节点
    //  * */
    // function isAppvTask3Node(param) {
    //     return !!(param && "appvTask3" === param.NODE_KEY);
    // }

    module.exports = {
        // acceptTaskSubmit: acceptTaskSubmit,
        // acceptTaskSubmit2: acceptTaskSubmit2,
        // acceptTaskSubmit3: acceptTaskSubmit3,
        // busiDataUpdate:busiDataUpdate,
        // grabClaimTask: grabClaimTask,
        // grabClaimTaskSingle: grabClaimTaskSingle,
        // cancelClaimTask: cancelClaimTask,
        // rejectClaimTask: rejectClaimTask,
        // dealTaskSubmit: dealTaskSubmit,
        deleteClaimTask: deleteClaimTask,
        // rejectTaskAccept : rejectTaskAccept,
        // getAppvTaskNum : getAppvTaskNum,
        // checkClaimTask : checkClaimTask,
        // checkCancelClaimTask : checkCancelClaimTask,
        // checkErrorClaimTask : checkErrorClaimTask,
        // checkErrorCancelClaimTask : checkErrorCancelClaimTask,
        // isNew: isNew,
        // isReadonly: isReadonly,
        isAccept: isAccept,
        isPreAccept: isPreAccept,
        // isAcceptSumbiting: isAcceptSumbiting,
        // isAdditional: isAdditional,
        isPreRejected: isPreRejected,
        isRejected: isRejected,
        isPreInput: isPreInput,
        // isFinished: isFinished,
        // isSuspend: isSuspend,
        // isCanceled: isCanceled,
        // isImageFill: isImageFill,
        // isCsdc: isCsdc,
        // isAppvTaskNode: isAppvTaskNode,
        // isAccepterTaskNode: isAccepterTaskNode,
        // isRepAppvTaskNode: isRepAppvTaskNode,
        // isDeptAppvTaskNode: isDeptAppvTaskNode,
        // isErrorAppvTaskNode: isErrorAppvTaskNode,
        // isWorkingStatus: isWorkingStatus,
        // getTaskInfo : getTaskInfo,
        // startTask : startTask,
        // claimTask : claimTask,
        // isAppvTask1Node: isAppvTask1Node,
        // isAppvTask2Node: isAppvTask2Node,
        // isAppvTask3Node: isAppvTask3Node,
        // suspendTask : suspendTask,
        // rejectTask : rejectTask,
        // unclaimTask : unclaimTask,
        // submitTask : submitTask,
        // syncExtSys : syncExtSys,
        // deleteAcctSysProcStatus: deleteAcctSysProcStatus,
        // getSyncResult : getSyncResult,
        // cancelTask: cancelTask
    }
});
