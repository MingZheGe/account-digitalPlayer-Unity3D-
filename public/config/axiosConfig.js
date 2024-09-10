/**
 * axios请求配置文件
 * @author  lij
 */

import Qs from 'qs'
import baseConfig from './baseConfig'
import axios from 'axios'

const CancelToken = axios.CancelToken;

//添加请求拦截器
axios.interceptors.request.use(config => {
    config.id = Math.floor(Math.random() * 1000000);
    let params = _.cloneDeep(config.params) || {};
    config.retry = params.retry;
    config.retryDelay = params.retryDelay;
    config.__retryCount = params.__retryCount;
    config.isCancel = params.isCancel;
    delete params.retry;
    delete params.retryDelay;
    delete params.__retryCount;
    delete params.isCancel;
    config.params = params;
    config.cancelToken = new CancelToken((c) => {
        // 请求前加队列这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
        if (typeof (window.ajaxQueue) == "undefined"){
            window.ajaxQueue = [];
        }
        if (config.isCancel) {
            window.ajaxQueue.push({
                index: config.baseURL + '&' + config.id,
                cancel: c
            });
        }
    });

    return config;
}, error => {
    return Promise.reject(error);
});
//添加响应拦截器
axios.interceptors.response.use(response => {
    let config = response.config;
    let index = config.baseURL + '&' + config.id;
    //把已经完成的请求从队列中中移除
    if (window.ajaxQueue.find((v) => {
            return v.index == index
        }) != undefined) {
        _.remove(window.ajaxQueue, function (n) {
            return n.index == index;
        });
    }

    let bcfg = require("./baseConfig")
    if (bcfg.default.$basecfg.runtimeType == "record") {
        let reqData = JSON.parse(response.config.data);
        let service = reqData["REQUESTS"][0]["REQ_COMM_DATA"]["service"];
        delete reqData["REQUESTS"][0]["REQ_COMM_DATA"]["__RandomNo"]; // 删除时间和随机数一类的标识参数
        delete reqData["REQUESTS"][0]["REQ_COMM_DATA"]["OP_START_TIME"]; // 删除时间和随机数一类的标识参数
        delete reqData["REQUESTS"][0]["REQ_COMM_DATA"]["OPER_TIME"]; // 删除时间和随机数一类的标识参数
        reqData = JSON.stringify(reqData);
        let respData = JSON.stringify(response.data);

        let mockData = _storage.$storage.getJsonLocal("_MOCK_DATA");
        if (mockData) {
            if (!mockData.hasOwnProperty(service)) {
                mockData[service] = {};
            }
        } else {
            mockData = {};
            mockData[service] = {};
        }

        mockData[service][reqData] = respData;
        _storage.$storage.setLocal("_MOCK_DATA", mockData);
    }

    return response;
}, function axiosRetryInterceptor(err) {
    const { config, code, message } = err;
    //请求失败也要从队列中移除该请求
    if (err.config) {
        //把已经完成的请求从队列中中移除
        let index = config.baseURL + '&' + config.id;
        if (window.ajaxQueue.find((v) => {
                return v.index == index
            }) != undefined) {
            _.remove(window.ajaxQueue, function (n) {
                return n.index == index;
            });
        }
    }
    if (err.message == "cancel") {
        return Promise.reject(err);
    } else {
        // If config does not exist or the retry option is not set, reject
        if (!config || !config.retry) return Promise.reject(err);

        // Set the variable for keeping track of the retry count
        config.__retryCount = config.__retryCount || 0;

        // Check if we've maxed out the total number of retries
        if (config.__retryCount >= config.retry) {
            // Reject with the error
            return Promise.reject(err);
        }

        // Increase the retry count
        config.__retryCount += 1;

        // Create new promise to handle exponential backoff
        var backoff = new Promise(function(resolve) {
            setTimeout(function() {
                resolve();
            }, config.retryDelay || 1);
        });
        config.params = _.assign({}, config.params, {
            retry: config.retry,
            retryDelay: config.retryDelay,
            __retryCount: config.__retryCount
        })
        // Return the promise in which recalls axios to retry the request
        return backoff.then(function() {
            return axios(config);
        });
    }
});
let axiosConfig = {

    url: '/',
    method: 'POST', // default 
    baseURL: baseConfig.$basecfg.httpConfig.baseUrl, // + ':' + baseConfig.$basecfg.httpConfig.basePort,

    // `transformRequest`允许在请求数据发送到服务器之前对其进行更改
    // 这只适用于请求方法'PUT'，'POST'和'PATCH'
    // 数组中的最后一个函数必须返回一个字符串，一个 ArrayBuffer或一个 Stream
    transformRequest: [function(data) {
        if (typeof(data) == "string") {
            return data;
        } else if (typeof(data) == "object") {
            data = Qs.stringify(data);
            return data;
        }
    }],

    // `transformResponse`允许在 then / catch之前对响应数据进行更改
    transformResponse: [function(data) {
        if (typeof(data) == "string") {
            data = JSON.parse(data);
            return data;
        } else if (typeof(data) == "object") {
            return data;
        }
    }],

    // `headers` are custom headers to be sent 
    headers: {
        'Content-Type': 'text/plain; charset=utf-8'
    },

    // `params` are the URL parameters to be sent with the request 
    // Must be a plain object or a URLSearchParams object 
    params: {},

    // `paramsSerializer`是一个可选的函数，负责序列化`params`
    paramsSerializer: function(params) {
        return Qs.stringify(params)
    },

    data: {},

    timeout: 120000,
    retryDelay: 1000, //超时请求重试延时时间，单位ms
    retry: 0, //超时请求重试次数
    // `withCredentials`指示是否跨站点访问控制请求
    withCredentials: false, // default 

    // `auth'表示应该使用 HTTP 基本认证，并提供凭据。
    // 这将设置一个`Authorization'头，覆盖任何现有的`Authorization'自定义头，使用`headers`设置。
    // auth: {
    //   username: 'janedoe',
    //   password: 's00pers3cret'
    // },

    // “responseType”表示服务器将响应的数据类型
    // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream' 
    responseType: 'json', // default 

    //`xsrfCookieName`是要用作 xsrf 令牌的值的cookie的名称
    // xsrfCookieName: 'XSRF-TOKEN', // default 

    // `xsrfHeaderName`是携带xsrf令牌值的http头的名称
    // xsrfHeaderName: 'X-XSRF-TOKEN', // default 

    // `onUploadProgress`允许处理上传的进度事件
    // onUploadProgress: function (progressEvent) {
    //   // Do whatever you want with the native progress event 
    // },

    // `onDownloadProgress`允许处理下载的进度事件 
    // onDownloadProgress: function (progressEvent) {
    //   // Do whatever you want with the native progress event 
    // },

    // `maxContentLength`定义允许的http响应内容的最大大小 
    maxContentLength: 20000,

    // `validateStatus`定义是否解析或拒绝给定的promise
    // HTTP响应状态码。如果`validateStatus`返回`true`（或被设置为`null` promise将被解析;否则，promise将被
    // 拒绝。
    validateStatus: function(status) {
        return status >= 200 && status < 300; // default 
    },

    // `maxRedirects`定义在node.js中要遵循的重定向的最大数量。
    // 如果设置为0，则不会遵循重定向。 
    maxRedirects: 5, // default 

    // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http 
    // and https requests, respectively, in node.js. This allows options to be added like 
    // `keepAlive` that are not enabled by default. 
    // httpAgent: new http.Agent({ keepAlive: true }),
    // httpsAgent: new https.Agent({ keepAlive: true }),

    // 'proxy'定义代理服务器的主机名和端口
    // `auth`表示HTTP Basic auth应该用于连接到代理，并提供credentials。
    // 这将设置一个`Proxy-Authorization` header，覆盖任何使用`headers`设置的现有的`Proxy-Authorization` 自定义 headers
    // proxy: {
    //   host: '127.0.0.1',
    //   port: 81,
    //   auth: {
    //     username: 'mikeymike',
    //     password: 'rapunz3l'
    //   }
    // },

    // “cancelToken”指定可用于取消请求的取消令牌
    // (see Cancellation section below for details) 
    // cancelToken: new CancelToken(function (cancel) {
    // })
}


const plugin = {
    install(Vue) {
        //添加全局方法或属性
        Vue.axioscfg = axiosConfig
            //添加实例方法
        Vue.prototype.$axioscfg = axiosConfig
    },
    $axioscfg: axiosConfig
}

export default plugin
export const install = plugin.install