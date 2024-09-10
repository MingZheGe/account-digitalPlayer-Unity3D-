/**
 * 对接短信平台接口
 * @author liwei
 * time 2018-12-08
 */
import sysConfig from "../config/sysConfig.js";
import { isObject } from "util";
import storage from '../tools/storage.js'
const smsService = {


    /**
     * 获取短信验证码
     * @param {Object} params
     * params 入参对象 {
     *          ORG_CODE:机构代码,
     *          MOBILE:手机号(必要入参),
     *          AUTH_LENGTH:验证码长度 默认6位  入参5=5位  入参4=4位
     *          TPL_ID：模板编号
     *          REMARK：备注信息
     *          EXP_SECS：有效期，默认为120秒
     *       }
     * @returns {Object}
     * Object 输出对象 {
     *          SEND_FLAG:发送成功标志 (1为成功，其他为失败),
     *          SEND_MSG:发送信息
     *          AUTH_ID：验证码唯一标识，验证时需要
     *      }
     */
    getSmsValidCode(params){
        params = params || {};
        return sysConfig.$syscfg.K_Request("W0000108", params).then((data) => {
            var obj = null;
            if(data.Code=='0'){
                obj = data.Data && data.Data[0]
            }
            return obj;
        })
    },

    /**
     * 检验短信验证码
     * @param {Object} params
     * params 入参对象 {
     *          AUTH_ID:验证码唯一标识,
     *          AUTH_CODE:验证码,
     *          MOBILE:手机号(必要入参),
     *       }
     * @returns {Object}
     * Object 输出对象 {
     *          CHECK_FLAG:检验结果 (0失败,1成功),
     *          CHECK_MSG:检验信息(1.验证码校验失败,验证码已过期!2.验证码校验失败,请输入正确验证码!3.验证码校验成功!)
     *      }
     */
    checkUpValidCode(params){
        params = params || {};
        return sysConfig.$syscfg.K_Request("W0000109", params).then((data) => {
            var obj = null;
            if(data.Code=='0'){
                obj = data.Data && data.Data[0]
            }
            return obj;
        })
    },


    /**
     * 发送短信
     * @param {Object} params
     * params 入参对象 {
     *          CONTENT:短信内容,
     *          MOBILE:手机号(必要入参),
     *       }
     * @returns {Object}
     * Object 输出对象 {
*               SEND_FLAG:发送成功标志 (1为成功，其他为失败),
     *          SEND_MSG:发送信息
     *      }
     */
    sendSMS(params){
        params = params || {};
        return sysConfig.$syscfg.K_Request("W0000110", params).then(data => {
            var obj = null;
            if(data.Code=='0'){
                obj = data.Data && data.Data[0]
            }
            return obj;
        })
    }

}


export default smsService;