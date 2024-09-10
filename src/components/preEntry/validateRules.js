import { parseAddress } from '../../tools/util'

const validateRules = {
    "val": {
        valid: function (value, param) {
            if (!param) {
                param = [1, 16];
            }
            //将允许出现的字符转换成1个空格
            function keepchar (v, k) {
                $.each(k, function (index, val) {
                    v = v.replace(k[index], " ");
                });
                return v;
            }
            //验证是否有特殊字符  但是能输入. -   _   （） ()
            function checkunval (t) {
                // var regularExpression = /^[^@。，,？?【】《》<>：；\[\]{}!！+=—~|\/\'\\\"#$%&\^\*]+$/;
                //修改原因 跟一柜通保持一致 如有变更 再改回来
                var regularExpression = /^[^<>\[\]{}+=~|\/\'\\\"$%\^]+$/;
                return regularExpression.test(t);
            }
            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }
            if (checkunval(value)) {
                var len = change2star(value).length;
                !param[1] && (param = [1, param[0]]);
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }

        },
        msg: "请输入 {0} 到 {1}个字符,且不能输入特殊字符(中文算两个字符)"
    },
    "email": { // 邮箱
        valid: function (value, param) { // param[0] 邮箱最大长度设置
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }

            var len = change2star(value).length;
            if (param && param.length == 1) {
                return len <= param[0] && /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
            } else if (param && param.length == 2) {
                return len >= param[0] && len <= param[1] && /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
            } else {
                return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
            }
        },
        msg: "请输入正确的邮箱地址",
    },
    "mobile": { // 手机号
        valid: function (value) {
            return /^([+]?[\d]{1,3}-|[ ])?((13[0-9]{9})|(18[0-9]{9})|(15[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(16[0-9]{9})|(19[0-9]{9}))$/.exec(value);
        },
        limitLength: 11,
        msg: "请输入正确的手机号码"
    },
    "tel": { // 电话号码
        valid: function (value) {
            return /^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{1,}))?$/.test(value);
        },
        msg: "请输入正确的电话号码"
    },
    "numchar": { // 只含有数字或者英文字母
        valid: function (value, param) { // param[0] 设定最小字符数， param[1] 设定最大字符数
            //校验数字或字符
            function isnumchar (s) {
                var regularExpression = /^([\w])+$/;
                return regularExpression.test(s);
            }

            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }
            if (isnumchar(value)) {
                var len = change2star(value).length;
                if (param.length == 1) {
                    return len == param[0];
                } else {
                    if (param[0] === param[1]) {
                        this.msg = "请输入{0}位长度的数字或英文字符";
                    }
                    return len >= param[0] && len <= param[1];
                }
            } else {
                return false;
            }
        },
        msg: "请输入 {0} 到 {1}个字符,只能输入数字或英文字符"
    },
    "number": { // 任意数字
        valid: function (value, param) { // param[0] 设定小数前多少位，设定小数后多少位
            param = param != undefined ? param : [100, 10] // 默认小数点前100位，后10位

            var value = _.trim(value);
            //校验数字（带小数点）,可带正负号；s为字符串,p1为小数点前位数,p2为小数点后位数
            function isnumber (s, p1, p2) {
                var regularExpression = '/^(-)?(\\d){1,' + parseFloat(p1) + '}(\\.)?(\\d){0,' + parseFloat(p2) + '}$/';
                return eval(regularExpression).test(s);
            }

            //校验数字（不带小数点）,可带正负号；s为字符串,p1为小数点前位数
            function isnumber2 (s, p1) {
                var regularExpression = '/^(-)?(\\d){1,' + parseInt(p1) + '}$/';
                return eval(regularExpression).test(s);
            }

            //当校验类型规定了长度的时候 要提示出来 @liwei2 2019/08/21
            if (param && 1 === param.length) {
                this.msg = '请输入正确的数字，整数位最多{0}位';
            } else if (param && 2 === param.length) {
                this.msg = '请输入正确的数字，整数位最多{0}位，小数位最多{1}位';
            }



            var flag = value.indexOf('.') != -1 ? isnumber(value, param[0], param[1]) : isnumber2(value, param[0]);
            if (!flag) {
                return false;
            } else if (value.indexOf('.') == value.length - 1) {
                return false;
            } else {
                return true;
            }
        },
        msg: "请输入正确的数字"
    },
    //任意数字
    "numberex": {
        valid: function (value, param) {
            this.msg = getMessage(param);
            var value = _.trim(value);
            //校验数字（带小数点）,可带正负号；s为字符串,p0为标志,p1为小数点前位数,p2为小数点后位数
            function isnumber (s, p0, p1, p2) {
                if (p0 == "0" || !p0) {
                    //正,负,0
                    var regularExpression = '^(-)?(\\d){1,' + parseFloat(p1) + '}(\\.)(\\d){0,' + parseFloat(p2) + '}$',
                        regularExpression2 = '^(-)?(\\d){1,' + parseFloat(p1) + '}$';
                    return (new RegExp(regularExpression).test(s) || new RegExp(regularExpression2).test(s));
                } else if (p0 == "10") {
                    //大于等于0
                    var regularExpression = '^(\\d){1,' + parseFloat(p1) + '}(\\.)(\\d){0,' + parseFloat(p2) + '}$',
                        regularExpression2 = '^(\\d){1,' + parseFloat(p1) + '}$'
                    return (new RegExp(regularExpression).test(s) || new RegExp(regularExpression2).test(s));
                } else if (p0 == "-10") {
                    //小于等于0
                    var regularExpression = '^(-)(\\d){1,' + parseFloat(p1) + '}(\\.)(\\d){0,' + parseFloat(p2) + '}$',
                        regularExpression2 = '^(-)(\\d){1,' + parseFloat(p1) + '}$';
                    return (new RegExp(regularExpression).test(s) || new RegExp(regularExpression2).test(s));
                } else if (p0 == "1") {
                    //大于0
                    var regularExpression = '^(\\d){1,' + parseFloat(p1) + '}(\\.)(\\d){0,' + parseFloat(p2) + '}$',
                        regularExpression2 = '^(\\d){1,' + parseFloat(p1) + '}$';
                    return (new RegExp(regularExpression).test(s) || new RegExp(regularExpression2).test(s)) && Number(s) > 0;
                } else if (p0 == "-1") {
                    //小于0
                    var regularExpression = '^(-)(\\d){1,' + parseFloat(p1) + '}(\\.)(\\d){1,' + parseFloat(p2) + '}$',
                        regularExpression2 = '^(-)(\\d){1,' + parseFloat(p1) + '}$';
                    return (new RegExp(regularExpression).test(s) || new RegExp(regularExpression2).test(s)) && Number(s) < 0;
                } else if (p0 == "2") {
                    //小于1大于等于0
                    if (value < 1 && value >= 0) {
                        var regularExpression = '^(\\d){1,' + parseFloat(p1) + '}(\\.)?(\\d){0,' + parseFloat(p2) + '}$';
                        return new RegExp(regularExpression).test(s);
                    } else {
                        return false;
                    }
                } else if (p0 == "3") {
                    //小于等于1大于0
                    if (value <= 1 && value > 0) {
                        var regularExpression = '^(\\d){1,' + parseFloat(p1) + '}(\\.)(\\d){0,' + parseFloat(p2) + '}$',
                            regularExpression2 = '^(\\d){1,' + parseFloat(p1) + '}$';
                        return (new RegExp(regularExpression).test(s) || new RegExp(regularExpression2).test(s)) && Number(s) > 0;
                    } else {
                        return false;
                    }
                } else if (p0 == "4") {
                    //小于1大于0
                    if (value < 1 && value > 0) {
                        var regularExpression = '^(\\d){1,' + parseFloat(p1) + '}(\\.)(\\d){0,' + parseFloat(p2) + '}$';
                        return new RegExp(regularExpression).test(s);
                    } else {
                        return false;
                    }
                } else if (p0 == "5") {
                    //小于等于1大于等于0
                    if (value <= 1 && value >= 0) {
                        var regularExpression = '^(\\d){1,' + parseFloat(p1) + '}(\\.)?(\\d){0,' + parseFloat(p2) + '}$';
                        return new RegExp(regularExpression).test(s);
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }

            //校验数字（不带小数点）,可带正负号；s为字符串,p0为标志,p1为小数点前位数
            function isnumber2 (s, p0, p1) {
                if (p0 == "0" || !p0) {
                    //可能正负
                    var regularExpression = '/^(-)?(\\d){1,' + parseInt(p1) + '}$/';
                    return eval(regularExpression).test(s);
                } else if (p0 == "10") {
                    //大于等于0
                    var regularExpression = '/^(\\d){1,' + parseInt(p1) + '}$/';
                    return eval(regularExpression).test(s);
                } else if (p0 == "-10") {
                    //小于等于0
                    var regularExpression = '/(^0$)|(^(-)(\\d){1,' + parseInt(p1) + '}$)/';
                    return eval(regularExpression).test(s);
                } else if (p0 == "1") {
                    //大于0
                    var regularExpression = '/^[1-9](\\d){0,' + (parseInt(p1) - 1) + '}$/';
                    return eval(regularExpression).test(s);
                } else if (p0 == "-1") {
                    //小于0
                    var regularExpression = '/^(-)[1-9](\\d){1,' + (parseInt(p1) - 1) + '}$/';
                    return eval(regularExpression).test(s);
                } else if (p0 == "2") {
                    //小于1大于0
                    if (value < 1 && value >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }

            }

            //根据校验参数获取校验提示
            function getMessage (param) {
                if (2 === param.length) {
                    return (
                        "0" == param[0] ? "请输入正确的整数，最多{1}位" :
                            "10" == param[0] ? "请输入大于等于0的整数，最多{1}位" :
                                "-10" == param[0] ? "请输入小于等于0的整数，最多{1}位" :
                                    "1" == param[0] ? "请输入正确的正整数，最多{1}位" :
                                        "-1" == param[0] ? "请输入正确的负整数，最多{1}位" :
                                            "2" == param[0] ? "请输入大于0且小于1的数字" :
                                                "请输入正确的数字"
                    )
                } else if (3 === param.length) {
                    return (
                        "0" == param[0] ? "请输入正确的数字，小数点前最多{1}位，小数点后最多{2}位" :
                            "10" == param[0] ? "请输入大于等于0的数字，小数点前最多{1}位，小数点后最多{2}位" :
                                "-10" == param[0] ? "请输入小于等于0的数字，小数点前最多{1}位，小数点后最多{2}位" :
                                    "1" == param[0] ? "请输入大于0的数字，小数点前最多{1}位，小数点后最多{2}位" :
                                        "-1" == param[0] ? "请输入小于0的数字，小数点前最多{1}位，小数点后最多{2}位" :
                                            "2" == param[0] ? "请输入大于等于0且小于1的数字，小数点前最多{1}位，小数点后最多{2}位" :
                                                "3" == param[0] ? "请输入大于0且小于等于1的数字，小数点前最多{1}位，小数点后最多{2}位" :
                                                    "4" == param[0] ? "请输入大于0且小于1的数字，小数点前最多{1}位，小数点后最多{2}位" :
                                                        "5" == param[0] ? "请输入大于等于0且小于等于1的数字，小数点前最多{1}位，小数点后最多{2}位" :
                                                            "请输入正确的数字"
                    )
                }

                return "请输入正确的数字";  //默认校验提示
            }

            if (!(/^(\+|-)?(\d+)(,\d{3})*(\.\d+)?$/).test(value)) {
                return false;
            } else {
                if (value.indexOf(',') > 0) value = value.replace(/,/g, '');
            }
            /*var flag = value.indexOf('.') != -1 ?
                isnumber(value, param[0], param[1], param[2] || 0) : //小数
                isnumber2(value, param[0], param[1]); //非小数*/
            var flag = param.length > 2 ?
                isnumber(value, param[0], param[1], param[2] || 0) : //小数
                isnumber2(value, param[0], param[1]); //非小数

            if (!flag) {
                return false;
            } else if (value.indexOf('.') == value.length - 1) {
                return false;
            } else {
                return true;
            }
        },
        msg: "请输入正确的数字"
    },
    "money": { // 金额
        valid: function (value, param) { // param[0] 设定小数前多少位，param[1]设定小数后多少位
            param = param != undefined ? param : [20, 10] // 默认小数点前20位，后10位

            var value = _.trim(value);
            //校验数字（带小数点）,可带正负号；s为字符串,p1为小数点前位数,p2为小数点后位数
            function isnumber (s, p1, p2) {
                var regularExpression = '/^(-)?(\\d){1,' + parseFloat(p1) + '}(\\.)?(\\d){0,' + parseFloat(p2) + '}$/';
                return eval(regularExpression).test(s);
            }

            //校验数字（不带小数点）,可带正负号；s为字符串,p1为小数点前位数
            function isnumber2 (s, p1) {
                var regularExpression = '/^(-)?[1-9](\\d){0,' + (parseInt(p1) - 1) + '}$/';
                return eval(regularExpression).test(s);
            }

            var flag = value.indexOf('.') != -1 ? isnumber(value, param[0], param[1]) : isnumber2(value, param[0]);
            if (!flag) {
                return false;
            } else if (value.indexOf('.') == value.length - 1) {
                return false;
            } else {
                return true;
            }
        },
        msg: "请输入整数位最多{0}位且小数位最多{1}位的金额"
    },
    "zmoney": { // 金额 不可为负数
        valid: function (value, param) { // param[0] 设定小数前多少位，param[1]设定小数后多少位
            param = param != undefined ? param : [20, 10] // 默认小数点前20位，后10位

            var value = _.trim(value);
            //校验数字（带小数点）；s为字符串,p1为小数点前位数,p2为小数点后位数
            function isnumber (s, p1, p2) {
                var regularExpression = '/^(\\d){1,' + parseFloat(p1) + '}(\\.)?(\\d){0,' + parseFloat(p2) + '}$/';
                return eval(regularExpression).test(s);
            }

            //校验数字（不带小数点）；s为字符串,p1为小数点前位数
            function isnumber2 (s, p1) {
                var regularExpression = '/^[1-9](\\d){0,' + (parseInt(p1) - 1) + '}$/';
                return eval(regularExpression).test(s);
            }

            var flag = value.indexOf('.') != -1 ? isnumber(value, param[0], param[1]) : isnumber2(value, param[0]);
            if (!flag) {
                return false;
            } else if (value.indexOf('.') == value.length - 1) {
                return false;
            } else {
                return true;
            }
        },
        msg: "请输入不为负数的正确金额"
    },
    "int": { // 整数
        valid: function (value, param) { // param[0] 最大整数位数
            if (value.indexOf(',') > 0) value = value.replace(/,/g, '');
            //校验整数（含0）
            function isint (s) {
                var regularExpression = /^(-)?\d*$/;
                /////^[1-9]\d*$/;
                return regularExpression.test(s);
            }

            if (isint(value)) {
                var len = value.length;
                if (param && len > param[0]) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        msg: "请输入正确的整数"
    },
    //正整数（含0）
    'zint': {
        valid: function (value, param) {
            //校验正整数（含0）
            if (value.indexOf(',') > 0) value = value.replace(/,/g, '');

            function iszint (s) {
                var regularExpression = /^[1-9]\d*$/;
                return regularExpression.test(s);
            }

            if (iszint(value)) {
                var len = value.length;
                if (len > param[0]) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        msg: "请输入正确的正整数,最大{0}位"
    },
    //正负整数（含0和不含0）
    "intex": {
        valid: function (value, param) {
            //校验非负整数:10,非正整数:-10,正整数::1,负整数:-1
            function iszint (s, p1) {
                //非负整数:10
                if (p1 == "10") {
                    var regularExpression = /^[0-9]\d*$/;
                    return regularExpression.test(s);
                } else if (p1 == "-10") {
                    //非正整数
                    var regularExpression = /^(-)[0-9]\d*$/;
                    return regularExpression.test(s);
                } else if (p1 == "1") {
                    //正整数
                    var regularExpression = /^[1-9]\d*$/;
                    return regularExpression.test(s);
                } else if (p1 == "-1") {
                    //负整数
                    var regularExpression = /^(-)[1-9]\d*$/;
                    return regularExpression.test(s);
                } else {
                    return false;
                }
            }
            if (!(/^(\+|-)?(\d+)(,\d{3})*(\.\d+)?$/).test(value)) {
                return false;
            } else {
                if ((value + '').indexOf(",") > 0) value = value.replace(/,/g, '');
            }

            if (iszint(value, param[1])) {
                var len = value.length;
                if (len > param[0]) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        message: "请输入正确的整数,最大{0}位"
    },
    //确切位数字
    "num": {
        valid: function (value, param) {
            //校验确切位数数字。
            function isnum (s, data) {
                var regularExpression = '/^(\\d){' + parseFloat(data) + '}$/';
                return eval(regularExpression).test(s);
            }

            function isnum1 (s, data) {
                var regularExpression = '/^(\\d){' + parseFloat(param[0]) + ',' + parseFloat(param[1]) + '}$/';
                return eval(regularExpression).test(s);
            }
            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }
            if (param.length == 1) {
                if (isnum(value, param[0])) {
                    var itemValue = change2star(value);
                    if (itemValue.length >= param[0]) {
                        return true;
                    } else {
                        this.msg = "请输入{0}位数字";
                        return false;
                    }
                } else {
                    this.msg = "请输入{0}位数字";
                    return false;
                }
            } else {
                var itemValue = change2star(value);
                if (isnum1(value, param[0])) {
                    if (itemValue.length >= param[0] && itemValue.length <= param[1]) {
                        return true;
                    } else {
                        this.msg = "请输入{0} 到 {1}位数字";
                        return false;
                    }
                } else {
                    this.msg = "请输入{0} 到 {1}位数字";
                    return false;
                }
            }
        },
        msg: "请输入{0}位数字"
    },
    "postcode": { //邮政编码
        valid: function (value) {
            var value = _.trim(value);
            //校验邮政编码
            function ispostcode (s) {
                var patrn = /^[0-9]\d{5}$/;
                if (!patrn.exec(s)) {
                    return false;
                }
                return true
            }

            if (ispostcode(value)) {
                return true;
            } else {
                return false;
            }
        },
        limitLength: 6,
        msg: "请输入正确的邮政编码,只能输入6位数字"
    },
    "cardno": { // 身份证号码
        valid: function (value, isLen18) { // isLen18[0] = true 强制校验18位身份证
            var value = _.trim(value);
            //校验身份证号码
            function iscardno (s) {
                var area = {
                    11: "北京",
                    12: "天津",
                    13: "河北",
                    14: "山西",
                    15: "内蒙古",
                    21: "辽宁",
                    22: "吉林",
                    23: "黑龙江",
                    31: "上海",
                    32: "江苏",
                    33: "浙江",
                    34: "安徽",
                    35: "福建",
                    36: "江西",
                    37: "山东",
                    41: "河南",
                    42: "湖北",
                    43: "湖南",
                    44: "广东",
                    45: "广西",
                    46: "海南",
                    50: "重庆",
                    51: "四川",
                    52: "贵州",
                    53: "云南",
                    54: "西藏",
                    61: "陕西",
                    62: "甘肃",
                    63: "青海",
                    64: "宁夏",
                    65: "新疆",
                    71: "台湾",
                    81: "香港",
                    82: "澳门",
                    91: "国外"
                }
                var idcard = s,
                    Y, JYM;
                var SS, M;
                var idcard_array = new Array();
                idcard_array = idcard.split("");
                //地区检验
                if (area[parseInt(idcard.substr(0, 2))] == null) {
                    return false;
                }
                //身份号码位数及格式检验
                let ereg;
                switch (idcard.length) {
                    case 15:
                        if (isLen18 && isLen18[0]) {
                            return false;
                        }
                        if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
                        } else {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
                        }
                        if (ereg.test(idcard)) {
                            return true;
                        } else {
                            return false;
                        }
                    case 18:
                        //18位身份号码检测
                        //出生日期的合法性检查
                        //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                        //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                        if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                        } else {
                            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                        }
                        //测试出生日期的合法性
                        if (ereg.test(idcard)) {
                            //计算校验位
                            SS = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
                            Y = SS % 11;
                            M = "F";
                            JYM = "10X98765432";
                            M = JYM.substr(Y, 1); //判断校验位
                            if (M == idcard_array[17]) { //检测ID的校验位
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    default:
                        return false;
                }
            }

            if (iscardno(value)) {
                return true;
            } else {
                return false;
            }
        },
        msg: "请输入正确的身份证号"
    },
    "ABCcardno": { // 港澳台居民居住证号码校验
        valid: function (value, isLen18) { // isLen18[0] = true 强制校验18位身份证
            var value = _.trim(value);
            function iscardno (s) {
                var area = {
                    83: "台湾",
                    81: "香港",
                    82: "澳门",
                }
                var idcard = s,
                    Y, JYM;
                var SS, M;
                var idcard_array = new Array();
                idcard_array = idcard.split("");
                //地区检验
                if (area[parseInt(idcard.substr(0, 2))] == null) {
                    return false;
                }
                //身份号码位数及格式检验
                let ereg;
                switch (idcard.length) {
                    case 15:
                        if (isLen18 && isLen18[0]) {
                            return false;
                        }
                        if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
                        } else {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
                        }
                        if (ereg.test(idcard)) {
                            return true;
                        } else {
                            return false;
                        }
                    case 18:
                        //18位身份号码检测
                        //出生日期的合法性检查
                        //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                        //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                        if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                        } else {
                            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                        }
                        //测试出生日期的合法性
                        if (ereg.test(idcard)) {
                            //计算校验位
                            SS = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
                            Y = SS % 11;
                            M = "F";
                            JYM = "10X98765432";
                            M = JYM.substr(Y, 1); //判断校验位
                            if (M == idcard_array[17]) { //检测ID的校验位
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    default:
                        return false;
                }
            }

            if (iscardno(value)) {
                return true;
            } else {
                return false;
            }
        },
        msg: "请输入正确的居住证号码"
    },
    "ABCcardnoJT": {
        valid: function (value) {
            var value = _.trim(value);
            function isABCcardnoJT (s) {
                var patrn = /^[a-zA-Z0-9]{9}$/;
                if (!patrn.test(s)) {
                    return false;
                }
                return true
            }
            if (isABCcardnoJT(value)) {
                return true;
            } else {
                return false;
            }
        },
        msg: "请输入9个字符，只能输入数字或英文字符"
    },
    "orgcode": { // 机构编码
        valid: function (value) {
            var regularExpression = /^[1-9]\d*$/;
            if (regularExpression.test(value) && value < 32767) {
                return true;
            }
            return false;
        },
        msg: ""
    },
    "cnchar": { // 中文字符
        valid: function (value) {
            return /^[\u4e00-\u9fa5]+$/.test(value);
        },
        msg: "只能输入中文字符"
    },
    //验证英文字母或者汉字  不能输入特殊字符
    "en_ch": {
        valid: function (value, param) {
            //验证是否有特殊字符  但是能输入.和-_
            function checkunval (t) {
                var regularExpression = /[^\u4e00-\u9fa5a-zA-Z\-\_\.]+/;
                return !regularExpression.test(t);
            }

            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }

            if (checkunval(value)) {
                var itemValue = change2star(value);
                var len = change2star(value).length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }
        },
        msg: "请输入 {0} 到 {1}个字符,只能输入中文或英文且不能输入特殊字符"
    },
    "name": { // 中英文姓名
        valid: function (value) {
            return /^((([\u4e00-\u9fa5a-zA-Z\-\_\.\s])+)·?)+$/.test(value);
        },
        msg: "请输入正确的姓名"
    },
    "cnname": { // 中文姓名
        valid: function (value) {
            return /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+){0,3}[\u4e00-\u9fa5]$/.test(value);
        },
        msg: "请输入正确的中文姓名"
    },
    "fixedNumLength": {
        valid: function (value, params) {
            if (/^[A-Za-z0-9]*$/.test(value)) {
                if (value.length !== params[0]) {
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }
        },
        msg: "请输入{0}位字符，只能输入数字或英文字符"
    },
    "iscard": {
        valid: function (value, param) {
            function isIdCard (str, param) {
                let isCheckNum = false;//是否校验位数 如果param数组里面有则匹配位数 如果没有 则匹配所有
                if (param && param.length > 0) {
                    isCheckNum = true;
                }
                var area = {
                    11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁",
                    22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽",
                    35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南",
                    44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州",
                    53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏",
                    65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
                }, ereg, Y, JYM, SS, M, arr = str.split("");

                //地区检验
                if (area[parseInt(str.substr(0, 2))] == null) {
                    return false;
                }

                let checkNum = () => {
                    return isCheckNum && param.indexOf(str.length) > -1 || !isCheckNum
                }
                //身份号码位数及格式检验
                switch (str.length) {
                    case 15:
                        if ((parseInt(str.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(str.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(str.substr(6, 2)) + 1900) % 4 == 0)) {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
                        } else {
                            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
                        }
                        return checkNum() && ereg.test(str)
                    case 18:
                        //18位身份号码检测
                        //出生日期的合法性检查
                        //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                        //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                        if (parseInt(str.substr(6, 4)) % 4 == 0 || (parseInt(str.substr(6, 4)) % 100 == 0 && parseInt(str.substr(6, 4)) % 4 == 0)) {
                            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                        } else {
                            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                        }
                        //测试出生日期的合法性
                        if (checkNum() && ereg.test(str)) {
                            //计算校验位
                            SS = (parseInt(arr[0]) + parseInt(arr[10])) * 7 + (parseInt(arr[1]) + parseInt(arr[11])) * 9 + (parseInt(arr[2]) + parseInt(arr[12])) * 10 + (parseInt(arr[3]) + parseInt(arr[13])) * 5 + (parseInt(arr[4]) + parseInt(arr[14])) * 8 + (parseInt(arr[5]) + parseInt(arr[15])) * 4 + (parseInt(arr[6]) + parseInt(arr[16])) * 2 + parseInt(arr[7]) * 1 + parseInt(arr[8]) * 6 + parseInt(arr[9]) * 3;
                            Y = SS % 11;
                            M = "F";
                            JYM = "10X98765432";
                            M = JYM.substr(Y, 1); //判断校验位

                            return M === arr[17]
                        }
                        return false;
                    default:
                        return false;
                }
            }
            return isIdCard(value, param)
        },
        limitLength: 18,
        msg: '请输入正确的身份证号码'
    },
    //工商营业执照效验 统一社会信用编码
    "licensecode": {
        valid: function (value) {
            var Code = value.trim();
            var patrn = /^[0-9A-Z]+$/;
            //18位校验及大写校验
            if ((Code.length != 18) || (patrn.test(Code) == false)) {
                return false;
            }
            return true;
        },
        msg: "请输入有效的统一社会信用编码"
    },
    "length": { // 设定长度
        valid: function (value, param) { // param[0] 设定最小字符数，param[1] 设定最大字符数
            function change2star (s) {
                var str = s + "";
                return str.replace(/[^\x00-\xff]/g, "**");
            }

            var len = change2star(value).length;
            return len >= param[0] && len <= param[1];
        },
        msg: "请输入 {0} 到 {1} 个字符，1个中文算2个字符",
    },
    //验证只含有数字或者英文字母或者汉字和 ‘#’、‘-’、‘.’ 、‘（’、 ‘）’特殊字符地址
    "address": {
        valid: function(value, param) {
            //验证是否有特殊字符  但是能输入 ‘#’、‘-’、‘.’
            function checkunval(t) {
                var regularExpression = /^[^@。，,？?【】《》<>：；\[\]{}!！+=~|\/\'\\\"$%&\^\*]+$/;
                return regularExpression.test(t);
            }
            //将字符串中的汉字转化为2个“*”
            function change2star(s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }
            if (checkunval(value)) {
                var itemValue = change2star(value);
                var len = itemValue.length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }
        },
        message: "请输入 {0} 到 {1}个字符,且不能输入除（'#'、'-'、'.'、'()'）以外的特殊字符"
    },
    //只含有数字或者英文字母和特殊字符'-'
    "numCharMinus": {
        valid: function (value, param) {
            //校验数字或字符或者'-'
            function isNumcharMinus (s) {
                var regularExpression = /^([\w\-\.\(\)\（\）])+$/;
                return regularExpression.test(s);
            }
            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }
            // update function by lipr on 20170817
            function getStrLength (s) {
                if (!s || toString.call(s) !== "[object String]") {
                    return 0;
                }
                var len = 0;
                for (var i = 0, l = s.length; i < l; i++) {
                    var charCode = s.charCodeAt(i);
                    charCode >= 0 && charCode <= 127 ? len++ : len += 2;
                }
                return len;
            }
            if (isNumcharMinus(value)) {
                var len = getStrLength(value);
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }
        },
        msg: "请输入{0}到{1}个字符,只能输入数字或英文字符或者'- .()（）'"
    },
    //只含有数字或者英文字母和特殊字符'--.()（）'
    "charMinus": {
        valid: function (value, param) {
            //校验数字或字符或者'-.()（）'
            function isNumcharMinus (s) {
                var regularExpression = /^([\w\-\.\(\)\（\）])+$/;
                return regularExpression.test(s);
            }
            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }
            if (isNumcharMinus(value)) {
                var len = change2star(value).length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }
        },
        msg: "请输入 {0} 到 {1}个字符,只能输入数字或英文字符或者'-.()（）'"
    },
    "tel1": { // 电话号码
        valid: function (value) {
            return /^([0\+]\d{2,3})$/.test(value);
        },
        msg: "请输入正确的国际编号"
    },
    "tel2": { // 电话号码
        // valid : function (value) {
        //     return /^(0\d{2,3})$/.test(value);
        // },
        valid: function (value) { // param[0] 设定最小字符数，param[1] 设定最大字符数
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }
            var len = change2star(value).length;
            return len >= 3 && len <= 5;
        },
        msg: "请输入 3 到 5 位数字的区号"
    },
    "tel3": { // 电话号码
        valid: function (value, telPhoneType) {
            if (telPhoneType == 1 || telPhoneType == 2) {
                this.msg = "请输入正确的电话号码，格式为“+国际区号-区号-电话号码"
                return /^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{1,}))?$/.exec(value);
            } else {
                this.msg = "加上区号请输入 10 到 16 个数字"
                return /^(\d{10,16})(-(\d{1,}))?$/.test(value);
            }
        },
        msg: "加上区号请输入 10 到 16 个数字"
    },
    "JTtel1": {
        valid: function (value) {
            return /^([0\+]\d{2,3})$/.test(value);
        },
        msg: "请输入正确的国际编号"
    },
    "JTtel2": {
        valid: function (value) { // param[0] 设定最小字符数，param[1] 设定最大字符数

            function isnum1 (s, data) {
                var regularExpression = '/^(\\d){' + parseFloat(param[0]) + ',' + parseFloat(param[1]) + '}$/';
                return eval(regularExpression).test(s);
            }
            var param = [3, 5];
            if (isnum1(value, param[0])) {
                if (value.length >= param[0] && value.length <= param[1]) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        msg: "请输入 3 到 5 位数字的区号"
    },
    "JTtel3": {
        valid: function (value) { // param[0] 设定最小字符数，param[1] 设定最大字符数
            var param = [5, 8];
            value = value.split("-")[1] || value;
            function isnum1 (s, data) {
                var regularExpression = '/^(\\d){' + parseFloat(param[0]) + ',' + parseFloat(param[1]) + '}$/';
                return eval(regularExpression).test(s);
            }
            if (isnum1(value, param[0])) {
                if (value.length >= param[0] && value.length <= param[1]) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        msg: "请输入 5 到 8 位数字的电话号码"

    },
    "en_name_addr": {// 拼音或英文 不能输入汉字
        valid: function (value, param) {
            if (param && param.length > 1) {
                let len = value.length;
                if (len < param[0] || len > param[1]) {
                    this.msg = "请输入 {0} 到 {1} 个字符，1个中文算2个字符";
                    return false;
                } else {
                    this.msg = "请输入 {0} 到 {1}个字符，只能包含英文字母，逗号，句号，双引号，空格。";
                }
            }
            return /^[0-9a-zA-Z,()-\.\s'"]+$/.test(value);
        },
        msg: "请输入 {0} 到 {1}个字符，只能包含英文字母，逗号，句号，双引号，空格。"
    },
    "en_name": {// 拼音或英文 不能输入汉字 姓或名
        valid: function (value, param) {
            if (param && param.length > 1) {
                let len = value.length;
                if (len < param[0] || len >= param[1]) {
                    this.msg = "请输入 {0} 到 {1} 个字符";
                    return false;
                } else {
                    this.msg = "请输入正确的字符，只能包含数字,英文字母，逗号，句号，括号，短横线，双引号,斜杠。";
                }
            }
            return /^[0-9a-zA-Z,()-\.\s'"]+$/.test(value);
        },
        // valid: function (value) {
        //     return /^[0-9a-zA-Z,()-\.\s"\/]+$/.test(value);
        // },
        msg: "请输入正确的字符，只能包含英文字母，逗号，句号，括号，短横线，双引号，斜杠。"
    },
    "valFirst": {//验证必须字符开头
        valid: function (value, param) {
            function checkfirstval (t) {
                return /(^[\u4e00-\u9fa5a-zA-Z]+)([^\n]*)$/.test(value);
            }
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }
            if (checkfirstval(value)) {
                var itemValue = change2star(value);
                var len = change2star(value).length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }
        },
        msg: "请输入 {0} 到 {1}个字符,且必须输入以字符开头"
    },
    //国信经纪开户增加字段录入规则
    //不能输入负数、小数、乱码（*）、空格
    ch_en_num_syms: {
        valid: function (value, param) {
            function checkunval (t) {
                var regularExpression1 = /^[^\s\*]+$/;
                var regularExpression2 = /^((-\d+)|(-\d+\.\d+)|(\d+\.\d+)?)?$/;
                return regularExpression1.test(t) && !regularExpression2.test(t);
            }

            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }

            if (checkunval(value)) {
                var itemValue = change2star(value);
                var len = change2star(value).length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }

        },
        msg: "请输入 {0} 到 {1}个字符,不能输入负数、小数、乱码（*）、空格"
    },
    //不能输入负数、小数、乱码（*）
    ch_en_num_sym: {
        valid: function (value, param) {
            function checkunval (t) {
                var regularExpression1 = /^[^\*]+$/;
                var regularExpression2 = /^((-\d+)|(-\d+\.\d+)|(\d+\.\d+)?)?$/;
                return regularExpression1.test(t) && !regularExpression2.test(t);
            }

            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }

            if (checkunval(value)) {
                var itemValue = change2star(value);
                var len = change2star(value).length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }

        },
        msg: "请输入 {0} 到 {1}个字符,不能输入负数、小数、乱码（*）"
    },
    //不能输入负数、小数、英文、乱码（*）
    ch_num_sym: {
        valid: function (value, param) {
            function checkunval (t) {
                var regularExpression1 = /^[^\*A-Za-z]+$/;
                var regularExpression2 = /^((-\d+)|(-\d+\.\d+)|(\d+\.\d+)?)?$/;
                return regularExpression1.test(t) && !regularExpression2.test(t);
            }

            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }

            if (checkunval(value)) {
                var itemValue = change2star(value);
                var len = change2star(value).length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }

        },
        msg: "请输入 {0} 到 {1}个字符,不能输入负数、小数、英文、乱码（*）"
    },
    //不能输入负数、小数、中文、乱码（*）
    en_num_sym: {
        valid: function (value, param) {
            function checkunval (t) {
                var regularExpression1 = /^[^\*\u4e00-\u9fa5]+$/;
                // var regularExpression2 = /^(-[0-9\.{0,1}]+)?(\d+(\.{0,1}\d+){0,1})$/;
                var regularExpression2 = /^((-\d+)|(-\d+\.\d+)|(\d+\.\d+)?)?$/;
                return regularExpression1.test(t) && !regularExpression2.test(t);
            }

            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }

            if (checkunval(value)) {
                var itemValue = change2star(value);
                var len = change2star(value).length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }

        },
        msg: "请输入 {0} 到 {1}个字符,不能输入负数、小数、中文、乱码（*）"
    },
    //不能输入负数、小数、中文、英文、乱码（*）
    num_sym: {
        valid: function (value, param) {
            function checkunval (t) {
                var regularExpression1 = /^[^\*A-Za-z\u4e00-\u9fa5]+$/;
                var regularExpression2 = /^((-\d+)|(-\d+\.\d+)|(\d+\.\d+)?)?$/;
                return regularExpression1.test(t) && !regularExpression2.test(t);
            }

            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }

            if (checkunval(value)) {
                var itemValue = change2star(value);
                var len = change2star(value).length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }

        },
        msg: "请输入 {0} 到 {1}个字符,不能输入负数、小数、中文、英文、乱码（*）"
    },
    //不能输入负数、英文、乱码（*）
    numex_ch_sym: {
        valid: function (value, param) {
            function checkunval (t) {
                var regularExpression1 = /^[^\*A-Za-z]+$/;
                var regularExpression2 = /^(-[0-9\.{0,1}]+)$/;
                return regularExpression1.test(t) && !regularExpression2.test(t);
            }

            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }

            if (checkunval(value)) {
                var itemValue = change2star(value);
                var len = change2star(value).length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }

        },
        msg: "请输入 {0} 到 {1}个字符,不能输入负数、英文、乱码（*）"
    },
    //不能输入乱码（*）
    val_sym: {
        valid: function (value, param) {
            function checkunval (t) {
                var regularExpression = /^[^\*]+$/;
                return regularExpression.test(t);
            }

            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }

            if (checkunval(value)) {
                var itemValue = change2star(value);
                var len = change2star(value).length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }

        },
        msg: "请输入 {0} 到 {1}个字符,不能输入乱码（*）"
    },
    //控制不能只输入纯数字字符串
    en_num_addr: {
        valid: function (value, param) {
            function checkunval (t) {
                var regularExpression = /^.*[^\d].*$/;
                return regularExpression.test(t);
            }

            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }

            if (checkunval(value)) {
                var itemValue = change2star(value);
                var len = change2star(value).length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }

        },
        msg: "请输入 {0} 到 {1}个字符,不能全部输入数字字符"
    },

    //开始日期不能大于当天
    compareBegAndCurrDate: {
        valid: function (value, current) {
            //校验确切位数数字。
            return current >= value;
        },
        msg: "开始日期不能大于当天"
    },

    //结束日期不能小于当天
    compareEndAndCurrDate: {
        valid: function (value, current) {
            //校验确切位数数字。
            return value >= current;
        },
        msg: "结束日期不能小于当天"
    },
    //正整数的最大值以及最小值
    "zintsize": {
        valid: function (value, param) { // param[0] 设定最小数值，param[1] 设定最大数值
            var value = _.trim(value);
            function isnumber (s) {
                var regularExpression = /^[0-9]\d*$/;
                return eval(regularExpression).test(s);
            }

            var flag = isnumber(value);
            if (!flag) {
                this.msg = "请输入正确的正整数"
                return false;
            }
            if (value >= param[0] && value <= param[1]) {
                return true;
            } else {
                this.msg = "最小值为{0}，最大值为{1}"
                return false;
            }
        },
        msg: "请输入正确的正整数",
    },
    "emailZT": {
        valid: function (value, param) {
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }
            var len = change2star(value).length;
            if (param && param.length > 0) {
                if (len < param[0] || len > param[1]) {
                    this.msg = "请输入4到32个字符，1个中文算两个字符";
                } else {
                    this.msg = "请输入正确的邮箱地址";
                }
                return len <= param[1] && /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
            } else {
                return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
            }
        },
        msg: "请输入正确的邮箱地址",
    },
    //校验普通电话、传真号码:可以“+”开头,除数字外,可含有“-”
    "telZT": {
        valid: function (value) {
            return /^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{1,}))?$/.exec(value);
        },
        msg: "请输入正确的电话号码，格式为“+国际区号-区号-电话号码”"
    },
    //校验手机号码:必须以数字开头,除数字外,可含有“-” 不能输入空格
    "mobileortel": {
        valid: function (value) {
            var mobileReg = /^([+]?[\d]{1,3}-|[ ])?((13[0-9]{9})|(18[0-9]{9})|(15[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(16[0-9]{9})|(19[0-9]{9}))$/;
            var telReg = /^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{1,}))?$/;
            return mobileReg.test(value) || telReg.test(value);
        },
        msg: "请输入正确的手机号码或者电话号码"
    },
    //验证只含有数字或者英文字母或者汉字 特殊符号.
    "valZT": {
        valid: function (value, param) {
            if (!param) {
                param = [1, 16];
            }
            //将允许出现的字符转换成1个空格
            function keepchar (v, k) {
                $.each(k, function (index, val) {
                    v = v.replace(k[index], " ");
                });
                return v;
            }
            //验证是否有特殊字符  但是能输入.和-_
            function checkunval (t) {
                var regularExpression = /^([\u4e00-\u9fa5\da-zA-Z\.])+$/;
                return regularExpression.test(t);
            }
            //将字符串中的汉字转化为2个“*”
            function change2star (s) {
                return s.replace(/[^\x00-\xff]/g, "**");
            }
            if (checkunval(value)) {
                var len = change2star(value).length;
                !param[1] && (param = [1, param[0]]);
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }

        },
        msg: "请输入 {0} 到 {1}个字符,且不能输入除了.以外的其他特殊字符(中文算两个字符)"
        //message: "不能输入特殊字符"
    },
    //组织机构字段填写逻辑 xxxxxxxx-x(x为0-9的数字)
    "zzcode": {
        valid: function (value, param) {
            var value = _.trim(value);
            function isnumber (s) {
                var regularExpression = /^[0-9]\d*$/;
                return eval(regularExpression).test(s);
            }
            if (value.length != 10
                || value.substring(8, 9) != '-'
                || !isnumber(value.substring(0, 8))
                || !isnumber(value.substring(9, 10))) {
                this.msg = "请输入正确的组织机构代码,格式为XXXXXXXX-X(其中X为0-9的数字)!"
                return false;
            } else {
                return true;
            }

        }
    },
    "addressZT": {
        valid: function (value, param) {
            function checkunval (t) {
                var regularExpression = /^[^@。，,？?【】《》<>：；\[\]{}!！+=~|\/\'\\\"$%&\^\*]+$/;
                return regularExpression.test(t);
            }
            function change2star (s) {
                var reg = new RegExp('不详', "g")
                return s.replace(reg, "").replace(/[^\x00-\xff]/g, "**");
            }
            if (checkunval(value)) {
                var itemValue = change2star(value);
                var len = itemValue.length;
                return len >= param[0] && len <= param[1];
            } else {
                return false;
            }
        },
        msg: "请输入{0}到{1}个字符，1个中文算2个字符，“不详”算0个字符"
    },
    "en_name_addrZT": {
        valid: function (value, param) {
            if (param && param.length > 1) {
                let len = value.length;
                if (len < param[0] || len >= param[1]) {
                    this.msg = "请输入 {0} 到 {1} 个字符，1个中文算2个字符";
                    return false;
                } else {
                    this.msg = "请输入正确的字符，只能包含英文字母，逗号，句号，括号，短横线，双引号,斜杠。";
                }
            }
            return /^[0-9a-zA-Z,()-\.\s'"\/]+$/.test(value);
        },
        message: "请输入正确的字符，只能包含英文字母，逗号，句号，括号，短横线，双引号,斜杠。"
    },
    "min_num": {
        valid: function (value, param) {
            if (!!value) {
                while (value.indexOf(",") > -1) {
                    value = value.replace(",", "")
                }
            }
            if (isNaN(value)) {
                return false;
            }

            if (!!param[1]) {
                var index = value.indexOf('.');
                if (index != -1 && value.substring(index + 1).length > param[1]) {
                    return false;
                }
            }
            return value >= param[0];

        },
        msg: "请输入正确的数字,最小值为{0},最多{1}位小数"
    },
    "url": {
        valid: function (value) {
            return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
        },
        msg: "请输入正确的网址"
    },
    "contactNumber": {
        valid: function (value) {
            function checkTel(value) {
                return /^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{1,}))?$/.test(value);
            }

            function checkMobileTel(value) {
                return /^([+]?[\d]{1,3}-|[ ])?((13[0-9]{9})|(18[0-9]{9})|(15[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(16[0-9]{9})|(19[0-9]{9}))$/.exec(value);
            }
            return checkTel(value) || checkMobileTel(value);
        },
        msg: "请输入正确的联系电话"
    }
}

export default validateRules
