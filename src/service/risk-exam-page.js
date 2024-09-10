/**
 * 风险测评页面模块
 * @author linbk
 * 风险测评页面包括三大模块：调查表选择类型模块  快速录入模块  测试题模块
 * -调查表模块
 * ---调查表类型选择级联加载调查表编号下拉列表，选择对应的调查表编号加载出对应的试题
 * ---通过入参控制是否显示，默认不显示，支持指定一个调查表编号
 * -快速录入模块
 * ---通过入参控制是否显示，默认显示支持快速录入
 * ---快速录入框是多个框框组成，有单选和多选区分，输入一个框，填好对应的题勾选后自动跳到下一题，且改变已答题数字
 * ---快速录入的一些题是不需要作答，是系统根据客户信息计算判断对应的选项的
 * ---快速录入框默认提示题号
 * -测试题模块
 * ---包括显示和回调答案功能
 * ---测试标题部分，显示测试标题内容
 * ---测试题号题目和选项，通过迭代测试题数据，显示题目和选项，选择选项的复选框和选项内容都需要触发勾选事件
 * ---测试题提交答案按钮，点击提交按钮，需要获取页面数据计算答题总分数，并弹出分数提示框
 */


import sysConfig from "../config/sysConfig";
import dict from "../tools/dict";
import custService from "../service/cust-service"

export default {
    surveyClsData: [], //调查表类别数据
    surveySnData: [],  //调查表编号数据
    /**
     * 获取调查表类型
     * @returns {*}
     */
    getSurveyClsInfo: function() {
        var that = this;
        return dict.getDictByKey("SURVEY_CLS").then(function(data){
            that.set("surveyClsData",data);
        });
    },
    /**
     * 根据调查表类型获取测评题信息
     * 查询本地的的调查表信息
     * @param surveyCls
     * @param opts
     * @returns {*}
     */
    getSurveySnInfo: function(surveyCls,opts,userType) {
        var that = this;
        return sysConfig.$syscfg.K_Request("YGT_A1100083", {
            SURVEY_CLS: SURVEY_CLS
        }).then(function(data){
            if(data && data.length > 0){
                that.set("surveySnData",_.filter(data,function(o){
                    return (!$.trim(o.USER_TYPE) || o.USER_TYPE === '@' || o.USER_TYPE === (userType || opts.USER_TYPE));
                }))
            }
        })
    },
    /**
     * 根据调查表编号获取测评题信息
     * 查询本地的的调查表信息
     * @param surveySn
     * @returns {*}
     */
    getSurveyData: function (surveySn) {
        var that = this;
        return sysConfig.$syscfg.K_Request("YGT_A1100083", {
            SURVEY_SN: surveySn
        }).then(function(data){
            that.set("surveyData", data[0]);
        })
    },
    /**
     * 获取对应的试卷题的所有题目
     * 调用原子业务获取题目和选项
     * @param surveySn
     * @returns {*}
     */
    getSurveyColData: function (surveySn) {
        var that = this;
        return sysConfig.$syscfg.K_Request("Y3000902", {
            SURVEY_SN: surveySn
        }).then(function (data) {
            that.set("surveyColData", data[0]);
        });
    },
    /**
     * 获取客户评测数据结果（一柜通）
     * 联表查询
     * @param param
     */
    getCustRiskData: function (param) {
        return sysConfig.$syscfg.K_Request("Y3000902", {
            service: "YG003144",
            ID_TYPE: param.ID_TYPE,  //证件类型
            ID_CODE: param.ID_CODE, //用户证件号码
            SURVEY_SN: param.SURVEY_SN
        }).then(function (data) {
            return data[0][0] || null;
        });
    },
    /**
     * 获取客户评测数据结果（账户）
     * 获取存量客户测评数据结果
     * @param param
     */
    getCustAccountRiskData: function (param) {
        return custService.getCustSurveyData(param).then(function(data){
            return data && data[0] || null;
        });
    },
    /**
     * 获取客户评测数据结果（账户）360
     * 获取存量客户测评数据结果
     * @param param
     */
    getAllAccountRiskData: function (param, ordinal) {
        return sysConfig.$syscfg.K_Request("Y3000045", {
            service:"Y3000045",
            F_FUNCTION:"980300120",
            QUERY_MODE:"QUERY",
            END_DATE:param.END_DATE,
            INT_ORGES:param.INT_ORG,
            CUST_CODE:param.CUST_CODE
        }).then(function(data){
            return _.find(data && data[0] || [], function(v){return v.ORDINAL == ordinal}) || {};
        });
    },
    /**
     * 获取客户评测数据明细（一柜通）
     * @param param
     * @returns {*}
     */
    getCustSurveyColData: function (param) {
        return sysConfig.$syscfg.K_Request("YG003150", {
            service: "YG003150",
            ID_TYPE: param.ID_TYPE,
            ID_CODE: param.ID_CODE,
            SURVEY_SN: param.SURVEY_SN
        }).then(function (data) {
            return data[0][0] ? data[0] : null;
        });
    },

    
    /**
     * 根据分数获取评测等级信息
     * 调用原子业务，根据分数算等级信息
     * @param param
     * @returns {*}
     */
    getRatingData: function (param) {
        return sysConfig.$syscfg.K_Request("Y3000903", {
            service: 'Y3000903',
            SURVEY_SN: param.SURVEY_SN,
            SURVEY_SCORE: param.SCORE + ""
        }).then(function (data) {
            return data[0][0];
        });
    },
    
    /**
     * 获取流水数据
     * @param param
     * @returns {*}
     */
    W0000114:function(param){
        return sysConfig.$syscfg.K_Request("W0000114", param).then(function (data) {
            return data;
        });
    },
    /**
     * 通过客户ID获取客户已经答过的测评题目
     * 调用原子业务，根据分数算等级信息
     * @param param
     * @returns {*}
     */
    W0000157:function(param){
        return sysConfig.$syscfg.K_Request("W0000157", param);
    },

    /**
     * 提交测评题到一柜通
     * @param param
     * @returns {*}
     */
    W0000159:function(param){
        return sysConfig.$syscfg.K_Request("W0000159", param);
    },
    /**
     * 获取测评题互斥数据
     */
    getSurveyExclData: function (surveySn){
        if(!surveySn){
            return [];
        }
        return sysConfig.$syscfg.K_Request("Y3000001", {
            LBM: "YGT_A1000003",
            F_FUNCTION: "990000153",
            TAB_CODE: "SURVEY_EXCL",
            SURVEY_SN: surveySn
        }).then(res => {
            return res.Data
        })
    },
};
