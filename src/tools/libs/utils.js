/**
 * ##utils模块，包含一些前端的工具方法##
 * @module core/utils
 * @author liuqing leiy
 */

import md5 from './md5'
import json from './json'

let des = require('@/tools/libs/des'),
  fsenc = require('@/tools/libs/fs-enc')

// ajax = require("./ajax"),
// numPre = require("./num-pre"),

const utils = {

  // 所有的URL参数都加密标记
  isEn: true,

  slice: function (arrLike, start, end /* 不包含end */) {
    return Array.prototype.slice.call(arrLike, start, end)
  },
  /**
   * **计算字符串对应的MD5值**
   * @method md5
   * @param {string} str 需要计算的字符串
   * @return {string} 字符串对应的MD5
   */
  md5: md5,

  /**
   * **将json字符串转换成对象，详细请参考：[www.json.org](http://www.json.org/)，[json项目](https://github.com/douglascrockford/JSON-js)**
   * @method parseJSON
   * @param {string} param 需要转换的json字符串
   * @return {object} 字符串对应的javascript对象
   */
  parseJSON: json.parse,

  /**
   * **将对象转换成json字符串，详细请参考：[www.json.org](http://www.json.org/)，[json项目](https://github.com/douglascrockford/JSON-js)**
   * @method toJSON
   * @param {object} obj 需要转换的javascript对象
   * @return {string} javascript对象对象对应的json字符串
   */
  toJSON: json.stringify,

  /**
   * **使用[DES算法](http://zh.wikipedia.org/wiki/DES)加密字符串**
   * @method encrypt
   * @param {string} str 需要加密的字符串
   * @param {string} key 密钥
   * @return {string} 密文
   */
  encrypt: des.encrypt,

  fsEncrypt: fsenc.encrypt,

  /**
   * **解密字符串**
   * @method decrypt
   * @param {string} str 密文
   * @param {string} key 密钥
   * @return {string} 明文
   */
  decrypt: des.decrypt,

  /**
   * **使用html的a标签解析URL**
   * @method parseUrl
   * @param {string} url 需要解析的URL地址
   * @return {object} 解析后的URL对象
   */
  parseUrl: function (url) {
    url = url || window.location.href
    var a = document.createElement('a'),
      isHttps, urlPort
    a.href = utils.escape(url)
    isHttps = a.protocol.replace(':', '') === 'https'
    urlPort = (a.port === '0' || a.port === '') ? (isHttps ? 443 : 80) : a.port // a.port 可能会解析不一样的
    return {
      source: url,
      protocol: a.protocol.replace(':', ''),
      host: a.hostname,
      port: urlPort,
      query: utils.unescape(a.search),
      params: (function () {
        var ret = {},
          seg = utils.unescape(a.search).replace(/^\?/, '').split('&'),
          len = seg.length,
          i = 0,
          s
        for (; i < len; i++) {
          if (!seg[i]) {
            continue
          }
          s = seg[i].split('=')

          // 解析加密过的
          if (s[0] === utils.getParamKey() && utils.isEn) {
            var tmpStr = utils.decrypt(decodeURIComponent(s[1]), utils.getKey())
            _.each(tmpStr.split('&'), function (item) {
              ret[item.split('=')[0]] = decodeURIComponent(item.split('=')[1])
            })
          } else {
            ret[s[0]] = decodeURIComponent(s[1])
          }
        }
        return ret
      })(),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
      hash: a.hash.replace('#', ''),
      path: a.pathname.replace(/^([^\/])/, '/$1'),
      relative: (utils.unescape(a.href).match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
      segments: a.pathname.replace(/^\//, '').split('/')
    }
  },

  /**
   * **获取URL的参数信息**
   * @method getUrlParam
   * @param {string} url 需要解析的URL地址
   * @return {object} 解析后的参数对象
   */
  getUrlParam: function (url) {
    return utils.parseUrl(url).params
  },

  /**
   * **根据参数构建URL地址**
   * @method buildUrl
   * @param {string} url 需要构建的URL地址
   * @param {object} [params] URL参数
   * @param {string} [hash] 信息片段（hash）
   * @return {string} 构建后的URL地址
   */
  buildUrl: function (url, params, hash, opts) {
    if (!url) {
      return ''
    }
    // add by liuyc 2020.04.17 一站通跳转到标准版应用的菜单链接参数不用加密
    if (url.indexOf('bzb/apps') > -1) {
      return url
    }

    opts = (_.isObject(hash) ? hash : opts) || {}

    var that = this,

      parsed = that.parseUrl(url),

      hashStr = (function () {
        if ($.type(hash) === 'string') {
          return hash ? '#' + hash : ''
        }
        return parsed.hash ? '#' + parsed.hash : ''
      })(),

      qryStr = (function () {
        var str, obj = $.extend({}, parsed.params, params)
        if ($.isEmptyObject(obj)) {
          return ''
        }
        str = that.buildQueryString(obj, _.isUndefined(opts.encodeFlag) ? true : opts.encodeFlag)

        return '?' + (utils.isEn ? that.encryptUrlParam(str) : str)
      })()

    return url.replace(/(\?|\#).*/, '') + qryStr + hashStr
  },

  getKey: function () {
    return top.ajax.encKey || (function () {
      var str = utils.encKey
      if (str) {
        return str
      }

      str = String(new Date() / 1)
      return str = str.substr(str.length - 6, 6)
    })()
  },

  getParamKey: function () {
    return 'param'
  },

  // 对URL参数加密
  encryptUrlParam: function (str) {
    var keytep = utils.getKey()
    var urlParam = utils.encrypt(str, keytep)
    urlParam = encodeURIComponent(urlParam)
    return utils.getParamKey() + '=' + urlParam
  },

  /**
   * **根据参数构建URL的查询字符串**
   * @method buildQueryString
   * @param {object} obj 参数
   * @return {string} 查询字符串
   */
  buildQueryString: function (obj, encodeFlag) {
    var arr = []
    $.each(obj, function (k, v) {
      // 中文转义
      if (String(v).match(/[\u4e00-\u9fa5]/)) {
        arr.push(k + '=' + (encodeFlag ? encodeURIComponent(v) : v))
      } else {
        arr.push(k + '=' + v)
      }
    })
    return arr.join('&')
  },

  /**
   * **根据格式化字符串将日期对象转成字符串**
   * @method formatDate
   * @param dateTime{date} 需要格式化的日期
   * @param fmt {string} 格式化的格式 默认 yyyy-MM-dd hh:mm:ss
   * @returns {*|string} 格式化后的日期或直接返回格式
   */
  formatDate: function (dateTime, fmt) {
    fmt = fmt || 'yyyy-MM-dd hh:mm:ss'

    if (_.isString(dateTime)) {
      dateTime = this.parseDate(dateTime)
    }

    if (!_.isDate(dateTime)) {
      return dateTime
    }

    var o = {
      'M+': dateTime.getMonth() + 1, // 月份
      'd+': dateTime.getDate(), // 日
      'h+': dateTime.getHours(), // 小时
      'm+': dateTime.getMinutes(), // 分
      's+': dateTime.getSeconds(), // 秒
      'q+': Math.floor((dateTime.getMonth() + 3) / 3), // 季度
      'S': dateTime.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (dateTime.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }

    return fmt
  },

  /**
   * **字符串转换成日期对象**
   * @method parseDate
   * @param text{string}  传入的日期字符串 支持yyyy-MM-dd hh:mm:ss、 yyyyMMdd hh:mm:ss 、 yyyy/MM/dd hh:mm:ss格式的字符串
   * @returns {Date} 根据日期字符串返回日期
   */
  parseDate: function (text) {
    var dt = text.split(' '),
      hh = 0,
      mm = 0,
      ss = 0,
      matchD, year, month, dd, hmsStr, hms, ymdStr = dt[0]
    if (dt.length == 2) {
      hmsStr = dt[1]
    }

    if (matchD = ymdStr.match(/^(\d{4})\D(\d{1,2})\D(\d{1,2})$/)) {
      year = matchD[1]
      month = matchD[2]
      dd = matchD[3]
    } else {
      if (ymdStr.length === 8) {
        year = ymdStr.substring(0, 4)
        month = ymdStr.substring(4, 6)
        dd = ymdStr.substring(6, 8)
      }
    }
    if (hmsStr) {
      hms = hmsStr.match(/^(\d{2})\D(\d{2})\D(\d{2})/)
      hh = hms[1]
      mm = hms[2]
      ss = hms[3]
    }
    return new Date(year, month - 1, dd, hh, mm, ss)
  },

  /**
   * **类的继承实现**
   * @method inherit
   * @param Base{function}  父类
   * @param Sub{function}  子类
   * @returns {undefined}
   */
  inherit: function (Base, Sub) {
    if (!_.isFunction(Base) || !_.isFunction(Sub)) {
      return
    }

    var TempClass = $.noop

    TempClass.prototype = Base.prototype
    Sub.prototype = new TempClass()
    Sub.prototype.constructor = Sub
  },

  /**
   * **获取字符长度，一个中文算两个字符**
   * @method getCharLength
   * @param str{string} 输入字符串
   * @returns {number} 字符数
   */
  getCharLength: function (str) {
    return _.isString(str) ? str.replace(/[^\x00-\xff]/g, '**').length : 0
  },

  /**
   * **替换字符串中的转义字符**
   * @method escape
   * @param str{string} 输入字符串
   * @returns {string} 转义后的字符串
   */
  escape: function (str) {
    if (!str) {
      return ''
    }
    return $('<div></div>').text($.trim(str + '')).html().replace(/\"/g, '&quot;')
  },

  /**
   * **字符串反转义**
   * @method escape
   * @param str{string} 输入字符串
   * @returns {string} 反转义后的字符串
   */
  unescape: function (str) {
    if (!str) {
      return ''
    }
    return $('<div></div>').html($.trim(str + '')).text()
  },

  /**
   * **获取客户端浏览器日期**
   * @method getClientDate
   * @param formate{string} 输出日期格式
   * @returns {string} 日期字符串
   */
  getClientDate: function (formate) {
    return this.formatDate(new Date(), formate || 'yyyyMMdd')
  },

  /**
   * **获取客户端浏览器时间**
   * @method getClientTime
   * @param formate{string} 输出时间格式
   * @returns {string} 时间字符串
   */
  getClientTime: function (formate) {
    return this.formatDate(new Date(), formate || 'hh:mm:ss')
  },

  // 获取客户端日期时间
  getClientDateTime: function (formate) {
    return this.formatDate(new Date(), formate || 'yyyyMMdd hh:mm:ss')
  },

  /**
   * **获取两个日期之间相差的月数**
   * @method getDifMonths
   * @param start{string|Date} 开始日期
   * @param end{string|Date} 结束日期
   * @returns {number} 相差的月数
   */
  getDifferMonths: function (start, end) {
    var sDate = _.isString(start) ? this.parseDate(start) : start,
      eDate = _.isString(end) ? this.parseDate(end) : end,
      sTime = sDate.getTime(),
      eTime = eDate.getTime(),

      sYear, sMonth, sDay,
      eYear, eMonth, eDay,
      sMonthDays, eMonthDays

    if (sTime === eTime) { // 日期相等，返回0
      return 0
    }

    if (sTime > eTime) { // 起始日期大，返回-1
      return -1
    }

    sYear = sDate.getFullYear()
    sMonth = sDate.getMonth() + 1
    sDay = sDate.getDate()

    eYear = eDate.getFullYear()
    eMonth = eDate.getMonth() + 1
    eDay = eDate.getDate()

    sMonthDays = this.getMonthDays(sYear, sMonth)
    eMonthDays = this.getMonthDays(eYear, eMonth)

    return eYear > sYear
      ? (eYear - sYear - 1) * 12 + (eMonth + (eDay >= sDay || (eDay === eMonthDays && sDay <= sMonthDays) ? 12 - sMonth : 12 - sMonth - 1))
      : (eMonth === sMonth ? 0 : eMonth - sMonth - (eDay >= sDay || (eDay === eMonthDays && sDay <= sMonthDays) ? 0 : 1))
  },

  /**
   * **获取两个日期之间相差的年数**
   * @method getDifMonths
   * @param start{string|Date} 开始日期
   * @param end{string|Date} 结束日期
   * @returns {number} 相差的年数
   */
  getDifferYears: function (start, end) {
    var difMonths = this.getDifferMonths(start, end)
    return difMonths >= 0 ? parseInt(difMonths / 12) : -1
  },

  /**
   * **判断给定年份是否是润年**
   * @method isLeapYear
   * @param year{number} 年份
   * @returns {boolean}
   */
  isLeapYear: function (year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 100 === 0 && year % 400 === 0)
  },

  /**
   * **获取某一年某一月的总天数**
   * @method getMonthDays
   * @param year{number} 年份
   * @param month{number} 月份
   * @returns {number} 天数
   */
  getMonthDays: function (year, month) {
    return [undefined, 31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
  },

  /**
   * **比较两个日期**
   * @method compareDate
   * @param dateStr1{string} 日期1
   * @param dateStr2{string} 日期2
   * @returns {number} 0 相等 1 大于 -1 小于
   */
  compareDate: function (dateStr1, dateStr2) {
    var msec1 = this.parseDate(dateStr1).getTime(),
      msec2 = this.parseDate(dateStr2).getTime(),
      dif = msec1 - msec2

    return dif > 0 ? 1 : dif < 0 ? -1 : 0
  },

  /**
   * **获取两个日期之间相差的天数**
   * @method getDifDays
   * @param dateStr1{string|date} 日期1
   * @param dateStr2{string|date} 日期2
   * @returns {number} 0 相等 1 大于 -1 小于
   */
  getDifDays: function (date1, date2) {
    var time1 = (_.isDate(date1) ? date1 : utils.parseDate(date1)).getTime(),
      time2 = (_.isDate(date2) ? date1 : utils.parseDate(date2)).getTime()

    return parseInt((time2 - time1) / (24 * 60 * 60 * 1000))
  },

  /**
   * 判断当前时间是否在范围内
   * @param startTime
   * @param endTime
   * @param curTime
   * @returns {boolean}
   */
  isInTime: function (startTime, endTime, curTime) {
    var staSec = this.timeToSecond(startTime),
      endSec = this.timeToSecond(endTime),
      curSec = this.timeToSecond(curTime)
    return staSec <= curSec && curSec <= endSec
  },

  /**
   * 比较两个时间的大小
   * @param time1
   * @param time2
   * @returns {number}
   */
  compareTime: function (time1, time2) {
    var msec1 = this.timeToSecond(time1),
      msec2 = this.timeToSecond(time2),
      dif = msec1 - msec2
    return dif > 0 ? 1 : dif < 0 ? -1 : 0
  },

  /**
   * 将时分秒转化为秒
   * @param time
   * @returns {number}
   */
  timeToSecond: function (time) {
    var sec = 0
    if (_.isString(time)) {
      var arr = time.split(':'),
        len = arr.length
      if (len == 3) {
        // 时分秒
        sec = Number(arr[0]) * 3600 + Number(arr[1]) * 60 + Number(arr[2])
      } else if (len == 2) {
        // 分秒
        sec = Number(arr[0]) * 60 + Number(arr[1])
      } else {
        // 秒
        sec = Number(arr[0])
      }
    } else {
      sec = Number(time) || 0
    }
    return sec
  },

  /**
   * **将金额数字转换成对应的金额中文大写**
   * @method convertMoney
   * @param value{string|number} 输入数据
   * @param isChinese{boolean} 是否是人民币大写，不传默认为true
   * @returns {string} 金额中文大写
   */
  convertMoney: function (value, isChinese) {
    isChinese = _.isUndefined(isChinese) ? true : !!isChinese

    var strVal = $.trim((value + '')).replace(/,/g, ''),
      numVal = Number(strVal),
      units = '零壹贰叁肆伍陆柒捌玖',
      suffix = '万仟佰拾亿仟佰拾万仟佰拾圓角分',
      dotIdx,
      retStr = ''

    if (isNaN(numVal)) {
      return ''
    }

    if (numVal > 9999999999999.99 || numVal < -9999999999999.99) {
      return ''
    }

    if (numVal < 0) {
      strVal = strVal.substring(1, strVal.length)
    }

    strVal += '00'

    if ((dotIdx = strVal.indexOf('.')) >= 0) {
      strVal = strVal.substring(0, dotIdx) + strVal.substr(dotIdx + 1, 2)
    }

    for (var i = 0, l = strVal.length; i < l; i++) {
      retStr += units.charAt(strVal.charAt(i)) + suffix.substr(suffix.length - strVal.length).charAt(i)
    }

    retStr = retStr === '零圓零角零分'
      ? '零圓' : retStr.replace(/零(仟|佰|拾|角)/g, '零')
        .replace(/(零)+/g, '零').replace(/零(万|亿|圓)/g, '$1')
        .replace(/(亿)万/g, '$1')
        .replace(/^圓零?|零分/g, '')
        .replace(/圓$/g, '圓整')

    if (!isChinese) {
      if (retStr.indexOf('角') !== -1 || retStr.indexOf('分') !== -1) {
        retStr = retStr.replace(/(角|分)/g, '').replace(/(圓|圓整)/g, '点')
      } else {
        retStr = retStr.replace(/(圓整|圓)/g, '')
      }
    }

    return retStr && numVal < 0 ? '负' + retStr : retStr
  },

  /**
   * **将数字转换成对应的金额千位符格式**
   * @method formatNumber
   * @param num{string|number} 输入数据
   * @returns {string} 金额千位符格式
   */
  formatNumber: function (num) {
    if (!/^(\+|-)?(\d+)(,\d{3})*(\.|\.\d+)?$/.test(num)) {
      return num
    }
    var re = /(\d)(\d{3})(,|$)/,
      a = RegExp.$1,
      b = RegExp.$2,
      c = RegExp.$4
    while (re.test(b)) {
      b = b.replace(re, '$1,$2$3')
    }
    return a + '' + b + '' + c
  },

  /**
   * **将金额千位符格式转换成对应的数字**
   * @method formatMoney
   * @param strVal{string} 输入数据
   * @returns {string} 普通数字
   */
  formatMoney: function (strVal) {
    return strVal.replace(/,/g, '')
  },

  /**
   * **15位身份证升级18位的**
   * @method updateCardNo
   * @param idcard  15位身份证
   * @returns {string} 升级后的身份证或者false
   */
  updateCardNo: function (idcard) {
    var SS, Y, M, JYM, ereg,
      idcard_array = new Array()
    if (idcard.length !== 15) {
      return false
    }

    if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
      ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/ // 测试出生日期的合法性
    } else {
      ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/ // 测试出生日期的合法性
    }
    if (!ereg.test(idcard)) {
      return false
    }
    idcard = idcard.substr(0, 6) + '19' + idcard.substr(6)
    idcard_array = idcard.split('')
    // 计算校验位
    SS = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3
    Y = SS % 11
    M = 'F'
    JYM = '10X98765432'
    M = JYM.substr(Y, 1) // 判断校验位
    return idcard + M
  },

  /**
   * **18位身份证降位15位的**
   * @method updateCardNo
   * @param idcard  18位身份证
   * @returns {string} 降位后的身份证或者false
   */
  downCardNo: function (idcard) {
    if (!this.isCardNo(idcard, false)) {
      return false // 不是18位身份证
    }
    return idcard.substring(0, 6) + '' + idcard.substring(8, 17)
  },

  /**
   * **校验是否为身份证号**
   * @method value
   * @param isLen18 是否只判断是18位身份证；
   * @returns {boolean}
   */
  isCardNo: function (value, isLen18) {
    var value = $.trim(value)
    // 校验身份证号码
    function iscardno (s) {
      var area = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外'
      }
      var idcard = s,
        Y, JYM
      var SS, M
      var idcard_array = new Array()
      idcard_array = idcard.split('')
      // 地区检验
      if (area[parseInt(idcard.substr(0, 2))] == null) {
        return false
      }
      // 身份号码位数及格式检验
      switch (idcard.length) {
        case 15:
          if (isLen18) {
            return false
          }
          if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/ // 测试出生日期的合法性
          } else {
            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/ // 测试出生日期的合法性
          }
          if (ereg.test(idcard)) {
            return true
          } else {
            return false
          }
        case 18:
          // 18位身份号码检测
          // 出生日期的合法性检查
          // 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
          // 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
          if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/ // 闰年出生日期的合法性正则表达式
          } else {
            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/ // 平年出生日期的合法性正则表达式
          }
          // 测试出生日期的合法性
          if (ereg.test(idcard)) {
            // 计算校验位
            SS = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3
            Y = SS % 11
            M = 'F'
            JYM = '10X98765432'
            M = JYM.substr(Y, 1) // 判断校验位
            if (M == idcard_array[17]) { // 检测ID的校验位
              return true
            } else {
              return false
            }
          } else {
            return false
          }
        default:
          return false
      }
    }

    if (iscardno(value)) {
      return true
    } else {
      return false
    }
  },

  // 校验是否是统一社会信用代码；
  isUniformSocialCreditCode: function (value) {
    var regularExpression = /(^[A-Z0-9]{18}|^[A-Z0-9]{24})+$/
    return regularExpression.test($.trim(value))
  },
  // // 设置缓存
  // setLocalStorage: function (key, obj) {
  //   if (window.localStorage) {
  //     window.localStorage.setItem(key, utils.toJSON(obj))
  //   } else {
  //     if (!top.kjdp.localStorage) {
  //       top.kjdp.localStorage = {}
  //     }
  //     top.kjdp.localStorage[key] = obj
  //   }
  // },
  // // 获取缓存
  // getLocalStorage: function (key) {
  //   if (window.localStorage) {
  //     return utils.parseJSON(window.localStorage.getItem(key))
  //   } else {
  //     return top.kjdp.localStorage[key]
  //   }
  // },
  // // 删除缓存
  // delLocalStorage: function (key) {
  //   if (window.localStorage) {
  //     window.localStorage.removeItem(key)
  //   } else {
  //     delete top.kjdp.localStorage[key]
  //   }
  // },
  // // 清空所有缓存
  // clearLocalStorage: function () {
  //   if (window.localStorage) {
  //     window.localStorage.clear()
  //   } else {
  //     top.kjdp.localStorage = {}
  //   }
  // },
  /**
   * 获取当前日期的前N天，或后N天
   * @param: days，正整数表示今天后第N天，负数表示今天的前N天
   */
  getDateBeforeToday: function (days) {
    if (isNaN(days)) {
      return ''
    }
    var myDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
    var year = myDate.getFullYear() + ''
    var month = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1).toString() : '0' + (myDate.getMonth() + 1)
    var date = myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate()
    return year + month + date
  },

  /**
   * 判断是否是双改，需要参数，newParamObj,oldParamObj,USER_TYPE
   * 修改客户全称或组织机构代码证不属于双改，现系统判断为双改（构双改要求：机构名称、营业执照号码、组织机构代码证号码
   （1）变更机构名称+证件号码/组织机构代码证号码=双改
   （2）变更组织机构代码证号码+机构名称/营业执照号码=双改
   （3）变更证件类型+营业执照号码/组织机构代码/机构名称≠双改
   （4）营业执照号码/组织机构代码变更成统一社会信用代码的，不属于双改情况之一）
   *个人 ：
   * （1）变更客户全称+证件号码 =双改；
   *  2）变更客户全称+身份证正常升位 ≠双改
   * @param oldParamObj
   * @param newParamObj
   */

  isModifyTwoItems: function (newParamObj, oldParamObj, USER_TYPE) {
    var status = '',
      newCustObj = {
        CUST_FNAME: newParamObj.CUST_FNAME,
        ID_CODE: newParamObj.ID_CODE,
        ID_TYPE: newParamObj.ID_TYPE,
        ORG_ID_CODE: newParamObj.ORG_ID_CODE || ''
      },
      oldCustObj = {
        CUST_FNAME: oldParamObj.CUST_FNAME,
        ID_CODE: oldParamObj.ID_CODE,
        ID_TYPE: oldParamObj.ID_TYPE,
        ORG_ID_CODE: oldParamObj.ORG_ID_CODE || ''
      },
      isIdCodeType = function (id_type) {
        return !!(id_type === '00' || id_type === '0J')
      },

      // 如果是正常升位则可认为非双改；
      getPersonModify = function () {
        return {
          status: '',
          flag: !(isIdCodeType(newCustObj.ID_TYPE) && oldCustObj.ID_CODE.length === 15 &&
            utils.isCardNo(oldCustObj.ID_CODE) && newCustObj.ID_CODE === utils.updateCardNo(oldCustObj.ID_CODE))
        }
      },

      getOrgModify = function () {
        // 如果是规范为统一信用代码证则提示警示信息；
        if (utils.isUniformSocialCreditCode(newCustObj.ID_CODE)) {
          var tempOrgIdCode = newCustObj.ID_CODE.length === 24 ? newCustObj.ID_CODE.substring(15, 23) + '-' + newCustObj.ID_CODE.substring(23, 24)
            : newCustObj.ID_CODE.substring(8, 16) + '-' + newCustObj.ID_CODE.substring(16, 17)
          // 24位工商营业执照截取第16至23位+“-”+第24位
          if (tempOrgIdCode === newCustObj.ORG_ID_CODE) {
            status = '0' // 表示正常将三证和一情况；
          }
        }
        return {
          status: status,
          flag: true
        }
      }

    /**
     * 客户姓名+证件号码
     * 客户姓名+组织机构代码证
     */
    if (oldCustObj.CUST_FNAME !== newCustObj.CUST_FNAME && (oldCustObj.ID_CODE !== newCustObj.ID_CODE ||
        oldCustObj.ORG_ID_CODE !== newCustObj.ORG_ID_CODE)) {
      if (USER_TYPE === '0') {
        return getPersonModify()
      } else if (USER_TYPE === '1') {
        return getOrgModify()
      }
    }
    /**
     * 证件号码和组织机构代码证；
     */
    if (USER_TYPE === '1' && oldCustObj.ID_CODE !== newCustObj.ID_CODE && oldCustObj.ORG_ID_CODE !== newCustObj.ORG_ID_CODE) {
      return getOrgModify()
    }

    return {
      status: '',
      flag: false
    }
  },

  // json格式化
  formatJson: function (json, options) {
    var reg,
      formatted = '',
      pad = 0,
      PADDING = '    ' // one can also use '\t' or a different number of spaces

    // optional settings
    options = options || {}
    // remove newline where '{' or '[' follows ':'
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true)
    // use a space after a colon
    options.spaceAfterColon = options.spaceAfterColon !== false

    // begin formatting...
    if (typeof json !== 'string') {
      // make sure we start with the JSON as a string
      json = JSON.stringify(json)
    } else {
      // is already a string, so parse and re-stringify in order to remove extra whitespace
      json = JSON.parse(json)
      json = JSON.stringify(json)
    }

    // add newline before and after curly braces
    reg = /([\{\}])/g
    json = json.replace(reg, '\r\n$1\r\n')

    // add newline before and after square brackets
    reg = /([\[\]])/g
    json = json.replace(reg, '\r\n$1\r\n')

    // add newline after comma
    reg = /(\,)/g
    json = json.replace(reg, '$1\r\n')

    // remove multiple newlines
    reg = /(\r\n\r\n)/g
    json = json.replace(reg, '\r\n')

    // remove newlines before commas
    reg = /\r\n\,/g
    json = json.replace(reg, ',')

    // optional formatting...
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
      reg = /\:\r\n\{/g
      json = json.replace(reg, ':{')
      reg = /\:\r\n\[/g
      json = json.replace(reg, ':[')
    }
    if (options.spaceAfterColon) {
      reg = /\:/g
      json = json.replace(reg, ': ')
    }
    // 去除首尾的换行
    json = json.substr(2, json.length - 4)

    $.each(json.split('\r\n'), function (index, node) {
      var i = 0,
        indent = 0,
        padding = ''

      if (node.match(/\{$/) || node.match(/\[$/)) {
        indent = 1
      } else if (node.match(/\}/) || node.match(/\]/)) {
        if (pad !== 0) {
          pad -= 1
        }
      } else {
        indent = 0
      }

      for (i = 0; i < pad; i++) {
        padding += PADDING
      }

      formatted += padding + node + '\r\n'
      pad += indent
    })

    return formatted
  }

}

export default $.extend({}, utils, {

  /**
   * 补零
   * @param str
   * @param num 默认补齐4位
   * @returns {string}
   */
  addZero: function (str, num) {
    num = num || 4
    for (var i = 0; i < num; i++) {
      str = '0' + str
    }
    return str.substr(str.length - num)
  },

  /**
   * 获取系统服务器时间日期
   * @returns {*}
   */
  // getSysDateTime: function () {
  //   return ajax.post({
  //     req: {
  //       bex_codes: 'dateTimeBex'
  //     }
  //   });
  // },

  getCurrDate: function (format, separator) {
    separator = separator || ''
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate(),
      sysdate, tragetDate
    if (!format) {
      return ''
    }
    switch (format) {
      case ':month_first':
        d = 1
        break
      case ':month_last':
        var a = y,
          b = m
        if (m == 12) {
          a += 1
          b = 1
        }
        d = 32 - new Date(a, b - 1, 32).getDate()
        break
      case ':week_last':
        d = d <= 7 ? 1 : d - 7
        break
      case ':next_year':
        y = y + 1
        break
        // 增加上个月addby liusy (20161031)
      case ':last_month':
        m = m - 1
        if (m == 0) {
          m = 1
          y = y - 1
        }
        d = d == new Date(y, m, 0).getDate() ? d : new Date(y, m, 0).getDate()
        break
      case ':curr_date':
        break
      case ':r_sys_date':
        tragetDate = getDate('R_SYS_STATUS', 'SYSDATE')
        return tragetDate
      case ':w_sys_date':
        tragetDate = getDate('W_SYS_STATUS', 'SYSDATE')
        return tragetDate
      case ':u_sys_date':
        tragetDate = getDate('U_SYS_STATUS', 'SYSDATE')
        return tragetDate
      case ':a_trd_date':
        tragetDate = getDate('A_SYS_STATUS', 'TRD_DATE')
        return tragetDate
      case ':a_sett_date':
        tragetDate = getDate('A_SYS_STATUS', 'SETT_DATE')
        return tragetDate
    }

    function getDate (key, field) {
      sysdate = top.kjdp.sysStatus && top.kjdp.sysStatus[key][field] ||
        y + separator + (m < 10 ? ('0' + m) : m) + separator + (d < 10 ? ('0' + d) : d)
      return sysdate.substring(0, 4) + separator + sysdate.substring(4, 6) + separator + sysdate.substring(6, 8)
    }
    return y + separator + (m < 10 ? ('0' + m) : m) + separator + (d < 10 ? ('0' + d) : d)
  },

  valueReplace: utils.escape,

  serialize2Json: function (param, seperator, vFilter, target) {
    seperator = seperator || ','
    vFilter = vFilter || $.noop

    var ret = {},
      pairsArr = param.split('&'),
      pair, idx, key, value
    $.each(pairsArr, function () {
      idx = this.indexOf('=')
      if (idx === -1) {
        return true
      }
      key = this.substring(0, idx)
      value = this.substring(idx + 1, this.length)
      // 参数值解密
      key = decParam(key)
      value = decParam(value)
      value = vFilter.call(param, key, value) || value
      if (ret[key]) {
        var sep = seperator,
          $combo = $(target).find('.kui-combobox[comboname=' + key + ']').length > 0 ? $(target).find('.kui-combobox[comboname=' + key + ']') : $(target).find('input[comboname=' + key + ']')
        if (target && $combo.length > 0) {
          var opts = $combo.data('combo').options
          if (opts && opts.singleByte == true) {
            sep = ''
          } else {
            sep = opts.submitSeparator || opts.seperator || seperator
          }
        }
        // modify by pengqc 20160822： 修复当字符串类似包含1,10,100,100……字符时候，会误判的问题
        // if(-1 === ret[key].indexOf(value)) {
        if (_.indexOf(ret[key].split(sep), value) === -1) {
          ret[key] = ret[key] + sep + value
        }
      } else {
        ret[key] = value
      }
    })

    function decParam (v) {
      try {
        return decodeURIComponent(v)
      } catch (ex) {
        return v
      }
    }
    $.each(ret, function (key, val) {
      var $combo = $('.kui-combobox[comboname=' + key + ']', target)
      if ($combo.length > 0) {
        var opts = $combo.data('combobox').options,
          panel = $combo.combo('panel')
        if (opts.atIsAll) {
          var flag = true,
            sep = opts.singleByte ? '' : (opts.submitSeparator || opts.seperator || ','),
            checkVal = val.split(sep)
          if (checkVal.length == panel.find('.combobox-item').length) {
            ret[key] = '@'
          }
          //                        panel.find(".combobox-item").each(function() {
          //                            var v = $(this).attr("value");
          //                            if(_.indexOf(checkVal,v) == -1){
          //                                flag = false;
          //                                return false;
          //                            }
          //                        });
          //                        if(flag){
          //                            ret[key] = "@";
          //                        }
        }
      }
    })
    return ret
  },

  quickSort: function (arr, field, useLocaleCompare) {
    if (arr.length <= 1) {
      return arr
    }
    var pivotIndex = Math.floor(arr.length / 2)
    var pivot = arr[pivotIndex]
    var left = []
    var right = []
    for (var i = 0; i < arr.length; i++) {
      if (i == pivotIndex) continue
      var flag
      if (useLocaleCompare) {
        flag = (new String(arr[i][field]).localeCompare(pivot[field]) == -1) // 不同版本不同地区实现不一致，不建议使用
      } else {
        flag = (new String(arr[i][field]) < pivot[field]) // 按unicode进行比较
      }
      if (flag) {
        left.push(arr[i])
      } else {
        right.push(arr[i])
      }
    }
    return kui.quickSort(left, field).concat([pivot], kui.quickSort(right, field))
  },
  /**
   * ** 根据key 获取url的hash值**
   * @method getUrlHashByKey
   * @param key{string} hash的key
   * @returns {string}
   */
  getHashValByKey: function (key) {
    var hashVal
    if (key && _.isString(key)) {
      hashVal = window.location.hash.match(new RegExp(key + '=\\w+'))
      hashVal = hashVal ? hashVal[0].replace(key + '=', '') : null
    }
    return hashVal
  },
  /**
   * 屏幕占满时，获取指定元素所占高宽
   * @param $el 指定元素
   * @param marginFlag 是否计算margin 默认为false
   * @returns {{width: number, height: number}}
   */
  getElBoxSize: function ($el, marginFlag) {
    var difHeight = 0,
      difWidth = 0

    function dif ($el) {
      if (!$el || $el.is('body')) {
        return
      }
      var par = $el.parent(),
        sib = $el.siblings()
      sib.each(function () {
        var $box = $(this)
        if ($box.is(':hidden') || $box.css('position') == 'absolute' || $box.hasClass('window-mask')) {
          return
        }
        if ($box.css('float') == 'left' || $box.css('float') == 'right') {
          difWidth += $box.outerWidth()
        } else {
          difHeight += $box.outerHeight()
        }
        if (marginFlag === true) {
          if ($box.css('float') == 'left' || $box.css('float') == 'right') {
            difWidth += Number($box.css('marginLeft').replace(/\D/g, ''))
            difWidth += Number($box.css('marginRight').replace(/\D/g, ''))
          } else {
            difHeight += Number($box.css('marginTop').replace(/\D/g, ''))
            difHeight += Number($box.css('marginBottom').replace(/\D/g, ''))
          }
        }
      })
      dif(par)
    }
    dif($el)
    return {
      width: $(window).width() - difWidth,
      height: $(window).height() - difHeight
    }
  },

  /**
   * 根据机构编码获取分支结构编码
   * @param orgids
   */
  // refreshBrhid: function (orgids, callback) {
  //   ajax.post({
  //     req: {
  //       bex_codes: 'YGT_W0110134',
  //       brhid: '',
  //       orgid: ''
  //     }
  //   }).done(function (data) {
  //     if (data[0] && data[0].length > 0) {
  //       var allOrg = data[0],
  //         resOrg = _.chain(allOrg).filter(function (o) {
  //           return _.indexOf(orgids.split(","), o.ORGID) != -1;
  //         }).value();
  //       _.isFunction(callback) && callback(resOrg);
  //     }
  //   });
  // },

  // 把错误的数据转正
  // strip: numPre.strip,

  // 返回小数位位数
  // digitLength: numPre.digitLength,

  // 把小数转成整数
  // floatToInt: numPre.floatToInt,

  // 精确乘法
  // multi: numPre.multi,

  // 精确加法
  // add: numPre.add,

  // 精确减法
  // sub: numPre.sub,

  // 精确除法
  // divide: numPre.divide,

  // 四舍五入
  // round: numPre.round,
  // 字符串做xss转义
  $escape: function (value) {
    var escapeMap = {
        '<': '&#60;',
        '>': '&#62;',
        '"': '&#34;',
        "'": '&#39;',
        '&': '&#38;'
      },
      escapeFn = function (s) {
        return escapeMap[s]
      },
      escapeHTML = function (content) {
        return String(content)
          .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn)
      }

    return escapeHTML(value)
  },
  /**
   * 获取指定日期的前N天，或后N天
   * @param: days，正整数表示今天后第N天，负数表示今天的前N天；datetime传入
   */
  getDateBeforeToday: function (days, dateTime) {
    var myDate
    if (isNaN(days)) {
      return ''
    }
    myDate = dateTime ? new Date(utils.parseDate(dateTime).getTime() + days * 24 * 60 * 60 * 1000) : new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
    var year = myDate.getFullYear() + ''
    var month = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1).toString() : '0' + (myDate.getMonth() + 1)
    var date = myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate()
    return year + month + date
  },
  /**
   * 获取指定日期的前N月，或后N月
   * @param: months，正整数表示今天后第N月，负数表示今天的前N月
   */
  getMonthBeforeToday: function (months, dateTime) {
    if (isNaN(months)) {
      return ''
    }
    var myDate = dateTime ? utils.parseDate(dateTime) : new Date()
    myDate.setMonth(myDate.getMonth() + months * 1)
    var year = myDate.getFullYear() + ''
    var month = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1).toString() : '0' + (myDate.getMonth() + 1)
    var date = myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate()
    return year + month + date
  },
  /**
   * 判断是否为通用业务
   * @param busiCls
   * @returns {*|boolean}
   */
  isGeneralReviewBusi: function (busiCls) {
    return (this.isGeneralReviewAcceptBusi(busiCls) || this.isGeneralReviewManageBusi(busiCls))
  },

  /**
   * 判断是否为通用受理业务
   * @param busiCls
   * @param getClsFlag
   * @returns {boolean}
   */
  isGeneralReviewAcceptBusi: function (busiCls, getClsFlag) {
    var clsArr = top.kjdp.GENERAL_REVIEW_ACCEPT_BUSI_CLS ? top.kjdp.GENERAL_REVIEW_ACCEPT_BUSI_CLS.split(',') : [],
      busiClsArr = _.chain(clsArr).uniq().compact().value()
    return !getClsFlag ? _.indexOf(busiClsArr, busiCls) != -1 : clsArr
  },

  /**
   * 判断是否为通用管理业务
   * @param busiCls
   * @param getClsFlag
   * @returns {boolean}
   */
  isGeneralReviewManageBusi: function (busiCls, getClsFlag) {
    var clsArr = top.kjdp.GENERAL_REVIEW_MANAGE_BUSI_CLS ? top.kjdp.GENERAL_REVIEW_MANAGE_BUSI_CLS.split(",") : [],
      busiClsArr = _.chain(clsArr).uniq().compact().value();
    return !getClsFlag ? _.indexOf(busiClsArr, busiCls) != -1 : clsArr;
  },
  /**
   * 去除字符串前后空格
   * @param {*} str
   * @returns
   */
  trim: function (str) {
    if (typeof str !== 'string') {
      return str
    }
    return str.replace(/^\s+|\s+$/gm, '')
  },
  // ------------------- 复用一站通代码 core.js num-pre ------------------------
  digitLength: function (e) {
    var t = e.toString().split(/[eE]/),
      r = (t[0].split(".")[1] || "").length - (t[1] || 0);
    return 0 < r ? r : 0
  },
  floatToInt: function (e) {
    if (-1 === e.toString().indexOf("e"))
      return Number(e.toString().replace(".", ""));
    var t = this.digitLength(e);
    return 0 < t ? e * Math.pow(10, t) : e
  },
  multi: function (e, t) {
    var r = this.floatToInt(e),
      n = this.floatToInt(t),
      i = this.digitLength(e) + this.digitLength(t);
    return r * n / Math.pow(10, i)
  },
  add: function (e, t) {
    var r = Math.pow(10, Math.max(this.digitLength(e), this.digitLength(t)));
    return (this.multi(e, r) + this.multi(t, r)) / r
  },
  sub: function (e, t) {
    var r = Math.pow(10, Math.max(this.digitLength(e), this.digitLength(t)));
    return (this.multi(e, r) - this.multi(t, r)) / r
  },
})
