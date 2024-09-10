export default {

        /**
         * **根据格式化字符串将日期对象转成字符串**
         * @method formatDate
         * @param dateTime{date} 需要格式化的日期
         * @param fmt {string} 格式化的格式 默认 yyyy-MM-dd hh:mm:ss
         * @returns {*|string} 格式化后的日期或直接返回格式
         */
        formatDate : function(dateTime, fmt){
            fmt = fmt || "yyyy-MM-dd hh:mm:ss";

            if(!dateTime){
                return dateTime;
            }
            if(_.isString(dateTime)) {
                dateTime = this.parseDate(dateTime);
            }

            if(!_.isDate(dateTime)) {
                return dateTime;
            }

            var o = {
                "M+" : dateTime.getMonth() + 1,                   //月份
                "d+" : dateTime.getDate(),                    //日
                "h+" : dateTime.getHours(),                   //小时
                "m+" : dateTime.getMinutes(),                 //分
                "s+" : dateTime.getSeconds(),                 //秒
                "q+" : Math.floor((dateTime.getMonth()+3)/3), //季度
                "S"  : dateTime.getMilliseconds()             //毫秒
            };

            if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (dateTime.getFullYear()+"").substr(4 - RegExp.$1.length));
            }

            for(var k in o) {
                if(new RegExp("("+ k +")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }

            return fmt;
        },

        /**
         * **字符串转换成日期对象**
         * @method parseDate
         * @param text{string}  传入的日期字符串 支持yyyy-MM-dd hh:mm:ss、 yyyyMMdd hh:mm:ss 、 yyyy/MM/dd hh:mm:ss格式的字符串
         * @returns {Date} 根据日期字符串返回日期
         */
        parseDate: function(text) {
            var dt = text.split(" "),
                hh = 0,mm = 0,ss = 0,
                matchD,year,month,dd,hmsStr,hms,ymdStr = dt[0];
            if(dt.length == 2) {
                hmsStr = dt[1];
            }

            if(matchD = ymdStr.match(/^(\d{4})\D(\d{1,2})\D(\d{1,2})$/)){
                year = matchD[1];
                month = matchD[2];
                dd = matchD[3];
            } else {
                if(ymdStr.length === 8){
                    year = ymdStr.substring(0,4);
                    month = ymdStr.substring(4,6);
                    dd = ymdStr.substring(6,8);
                }
            }
            if(hmsStr) {
                hms = hmsStr.match(/^(\d{2})\D(\d{2})\D(\d{2})/);
                hh = hms[1];
                mm = hms[2];
                ss = hms[3];
            }

            return new Date(year, month - 1, dd, hh, mm, ss);
        },
        /**
         * **获取客户端浏览器日期**
         * @method getClientDate
         * @param formate{string} 输出日期格式
         * @returns {string} 日期字符串
         */
        getClientDate: function(formate) {
            return this.formatDate(new Date(), formate || "yyyyMMdd");
        },

        /**
         * **获取客户端浏览器时间**
         * @method getClientTime
         * @param formate{string} 输出时间格式
         * @returns {string} 时间字符串
         */
        getClientTime: function(formate) {
            return this.formatDate(new Date(), formate || "hh:mm:ss");
        },

        //获取客户端日期时间
        getClientDateTime: function(formate) {
            return this.formatDate(new Date(), formate || "yyyyMMdd hh:mm:ss");
        },
        /**
         * 获取两个时间相差的天数
         * @param start
         * @param end
         * @returns {*}
         */
        getDifferDays: function(start, end) {
            var sDate = _.isString(start) ? this.parseDate(start) : start,
                eDate = _.isString(end) ? this.parseDate(end) : end,
                sTime = sDate.getTime(),
                eTime = eDate.getTime(),
                dMS = eTime - sTime;
            if (dMS === 0) {   //日期相等，返回0
                return 0;
            }
            if (dMS < 0) { //起始日期大，返回-1
                return -1;
            }
            return Math.floor(dMS / (24 * 3600 * 1000));
        },
        /**
         * **获取两个日期之间相差的月数**
         * @method getDifMonths
         * @param start{string|Date} 开始日期
         * @param end{string|Date} 结束日期
         * @returns {number} 相差的月数
         */
        getDifferMonths: function(start, end) {
            var sDate = _.isString(start) ? this.parseDate(start) : start,
                eDate = _.isString(end) ? this.parseDate(end) : end,
                sTime = sDate.getTime(),
                eTime = eDate.getTime(),

                sYear, sMonth, sDay,
                eYear, eMonth, eDay,
                sMonthDays, eMonthDays;

            if(sTime === eTime) {   //日期相等，返回0
                return 0;
            }

            if(sTime > eTime) { //起始日期大，返回-1
                return -1;
            }

            sYear = sDate.getFullYear();
            sMonth = sDate.getMonth() + 1;
            sDay = sDate.getDate();

            eYear = eDate.getFullYear();
            eMonth = eDate.getMonth() + 1;
            eDay = eDate.getDate();

            sMonthDays = this.getMonthDays(sYear, sMonth);
            eMonthDays = this.getMonthDays(eYear, eMonth);

            return eYear > sYear ?
                (eYear - sYear - 1) * 12 + (eMonth + (eDay >= sDay || (eDay === eMonthDays && sDay <= sMonthDays) ? 12 - sMonth : 12 - sMonth - 1)) :
                (eMonth === sMonth ? 0 : eMonth - sMonth - (eDay >= sDay || (eDay === eMonthDays && sDay <= sMonthDays) ? 0 : 1));
        },

        /**
         * **获取两个日期之间相差的年数**
         * @method getDifMonths
         * @param start{string|Date} 开始日期
         * @param end{string|Date} 结束日期
         * @returns {number} 相差的年数
         */
        getDifferYears: function(start, end) {
            var difMonths = this.getDifferMonths(start, end);
            return difMonths >= 0 ? parseInt(difMonths / 12) : -1;
        },

        /**
         * **判断给定年份是否是润年**
         * @method isLeapYear
         * @param year{number} 年份
         * @returns {boolean}
         */
        isLeapYear: function(year) {
            return (0 === year % 4 && 0 !== year % 100) || (0 === year % 100 && 0 === year % 400);
        },

        /**
         * **获取某一年某一月的总天数**
         * @method getMonthDays
         * @param year{number} 年份
         * @param month{number} 月份
         * @returns {number} 天数
         */
        getMonthDays: function(year, month) {
            return [undefined, 31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },

        /**
         * **比较两个日期**
         * @method compareDate
         * @param dateStr1{string} 日期1
         * @param dateStr2{string} 日期2
         * @returns {number} 0 相等 1 大于 -1 小于
         */
        compareDate: function(dateStr1, dateStr2) {
            var msec1 = this.parseDate(dateStr1).getTime(),
                msec2 = this.parseDate(dateStr2).getTime(),
                dif = msec1 - msec2;

            return dif > 0 ? 1 : dif < 0 ? -1 : 0;
        },

        /**
         * **是否为有效日期(Invalid Date?)**
         * @method isValidDate
         * @param date{Date} 日期1
         * @returns {boolean} true 是  false否
         */
        isValidDate: function (date) {
            return _.isDate(date) && !isNaN(date.getTime())
        },

        /**
         * **获取两个日期之间相差的天数**
         * @method getDifDays
         * @param dateStr1{string|date} 日期1
         * @param dateStr2{string|date} 日期2
         * @returns {number} 0 相等 1 大于 -1 小于
         */
        getDifDays: function(date1, date2) {
            var time1 = (_.isDate(date1) ? date1 : this.parseDate(date1)).getTime(),
                time2 = (_.isDate(date2) ? date1 : this.parseDate(date2)).getTime();

            return parseInt((time2 - time1) / (24 * 60 * 60 * 1000));
        },

        addMonths: function(date, months) {
            date = this.parseDate(date);
            months = parseInt(months);

            var year = date.getFullYear()
            var month = date.getMonth() + 1;
            var day = date.getDate();

            for(var i = months; i > 0; i--) {
                month++;
                if(13 === month) {
                    month = 1;
                    year++;
                }
            }

            var monthDays = this.getMonthDays(year, month);
            if(monthDays < day) {
                day = monthDays;
            }

            function format(num) {
                if(num < 10) {
                    return "0" + num;
                }
                return num + "";
            }

            return year + "" + format(month) + format(day);
        },

        addDays: function(date, days, format) {
            var time = this.parseDate(date).getTime();
            return this.formatDate(new Date(time + (parseInt(days) * 24 * 60 * 60 * 1000)), format || "yyyyMMdd");
        },
        addDateDays: function(t, days, format) {
            var date = _.isString(t) ? this.parseDate(t) : t, time = date.getTime(), addDays = Number(days) || 0, newTime = time + addDays * 24 * 3600 * 1e3;
            return this.formatDate(new Date(newTime), format || "yyyyMMdd");
        },
        /**
         * 获取当前日期的前N天，或后N天
         * @param: days，正整数表示今天后第N天，负数表示今天的前N天
         */
        getDateBeforeToday: function (days, dateTime) {
            if (isNaN(days)) {
                return "";
            }
            var myDate = dateTime ? new Date(this.parseDate(dateTime).getTime() + days * 24 * 60 * 60 * 1000) : new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
            var year = myDate.getFullYear() + "";
            var month = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1).toString() : '0' + (myDate.getMonth() + 1);
            var date = myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate();
            return year + month + date;
        },
        /**
        * 获取指定日期的前N月，或后N月
        * @param: months，正整数表示今天后第N月，负数表示今天的前N月
        */
        getMonthBeforeToday: function (months,dateTime) {
            if (isNaN(months)) {
                return "";
            }
            var myDate = dateTime ? this.parseDate(dateTime): new Date();
            myDate.setMonth(myDate.getMonth() + months*1);
            var year = myDate.getFullYear() + "";
            var month = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1).toString() : '0' + (myDate.getMonth() + 1);
            var date = myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate();
            return year + month + date;
        },

        /**
        * 是否在某个时间段内
        * @param  date  [beginDateStr] [开始时间]
        * @param  date  [endDateStr]  [结束时间]
        * @return  Boolean
        */
         isDuringTimeSlot: function (beginDateStr, endDateStr) {
            let curDate = new Date();
            let beginDate = new Date(beginDateStr);
            let endDate = new Date(endDateStr);
            if(curDate >= beginDate && curDate <= endDate) {
                return true;
            }
            return false;
        },

}