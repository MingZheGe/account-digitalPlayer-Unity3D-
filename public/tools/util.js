/**
 * 工具类的封装方法
 * @author  lij
 */



 /**
 * **15位身份证升级18位的**
 * @method updateCardNo
 * @param idcard  15位身份证
 * @returns {string} 升级后的身份证或者false
 */
export const updateCardNo = (idcard) => {
    var SS, Y, M, JYM, ereg,
        idcard_array = new Array();
    if (idcard.length !== 15) {
        return idcard;
    }

    if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
    } else {
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
    }
    if (!ereg.test(idcard)) {
        return idcard;
    }
    idcard = idcard.substr(0, 6) + "19" + idcard.substr(6);
    idcard_array = idcard.split("");
    //计算校验位
    SS = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
    Y = SS % 11;
    M = "F";
    JYM = "10X98765432";
    M = JYM.substr(Y, 1); //判断校验位
    return idcard + M;
}

/**
 * object 转换为数组
 * 例子： 转换前： {"SURVEY_COL":"1"} 
 *        转换后： [{key:'SURVEY_COL',value:'1'}]
 */
export const objToArr = object => {
  let arr = [];

  for(var key in object) {
    let item = {};
    item.key = key;
    item.value = object.key
    arr.push(item);
  }

  return arr;
};

/**
 * hasClass(class,element)
 * class: 类
 * element：Element 对象
 * 判断在Element对象中是否存在class
 */
export const hasClass = (cla, element) => {
    if(element.className.trim().length === 0) return false;
    var allClass = element.className.trim().split(" ");
    return allClass.indexOf(cla) > -1;
};

/**
 * addClass(class,element)
 * class: 类
 * element：Element 对象
 * 在Element对象中增加class
 */
export const addClass = (cla,element) => {
    if(!this.hasClass(cla,element)){
        if(element.setAttribute){
            element.setAttribute("class",element.getAttribute("class")+" "+cla);
        }else{
            element.className = element.className+" "+cla;
        }
    }
};

/**
 * removeClass(class,element)
 * class: 类
 * element：Element 对象
 * 在Element对象中删除class
 */
export const removeClass = (cla, element) => {
    if (this.hasClass(cla, element)) {
        var reg = new RegExp("(\\s|^)" + cla + "(\\s|$)");
        element.className = element.className.replace(reg, "");
    }
};

/**
 * isJSON(str)
 * str: 字符串
 * 判断str是否为JSON格式
 */
export const isJSON = (str) => {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(str.indexOf('{')>-1){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            // console.log(e);
            return false;
        }
    }
    return false;
};

/**
 * getAge(strBirthday)
 * strBirthday: 字符串
 * 根据出生日期算出年龄
 */
export const getAge = (strBirthday) => {
    let returnAge,birthYear,birthMonth,birthDay;  
    let d = new Date();  
    let nowYear = d.getFullYear();  
    let nowMonth = d.getMonth() + 1;  
    let nowDay = d.getDate();  
    // 将出生日期强制转为字符串，防止传入的是数值
    strBirthday += "";
    //去掉出生日期的斜杆和- 分隔号
    strBirthday = strBirthday.replace(/\//g,"").replace(/-/g,"");
    if(strBirthday.length == 8){
      birthYear = strBirthday.substring(0,4);  
      birthMonth = strBirthday.substring(4,6);  
      birthDay = strBirthday.substring(6,8);  
    }
      
    if(nowYear == birthYear){  
        returnAge = 0;//同年 则为0岁  
    } else {  
        let ageDiff = nowYear - birthYear ; //年之差  
        if(ageDiff > 0){  
            if(nowMonth == birthMonth) {  
                var dayDiff = nowDay - birthDay;//日之差  
                if(dayDiff < 0)   {  
                    returnAge = ageDiff - 1;  
                } else {  
                    returnAge = ageDiff ;  
                }  
            } else {  
                let monthDiff = nowMonth - birthMonth;//月之差  
                if(monthDiff < 0) {  
                    returnAge = ageDiff - 1;  
                } else {  
                    returnAge = ageDiff ;  
                }  
            }  
        } else {  
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天  
        }  
    }  
    return returnAge;//返回周岁年龄  
};
/**
 * getSex(value)
 * value: 字符串
 * 根据身份证计算性别
 */
export const getSex = (value) => {
  let sexno,sex;
  if(value.length == 18){
    sexno = value.substring(16,17)
  }else if(value.length == 15){
    sexno = value.substring(14,15)
  }else{
      //不是身份证
      return "";
  }
  let tempid = sexno % 2;
  if(tempid == 0){
    sex='F'
  }else{
    sex='M'
  }
  return sex
};

/**
 * getBirthday(value)
 * value: 字符串
 * 根据身份证计算出生日期
 */
export const getBirthday = (value) => {
  let birthdayno,birthdaytemp
  if(value.length == 18){
    birthdayno = value.substring(6,14)
  } else if(value.length == 15) {
    birthdaytemp = value.substring(6,12)
    birthdayno = "19" + birthdaytemp
  } else{
    return "";
  }
  let birthday = birthdayno.substring(0,4) + birthdayno.substring(4,6) + birthdayno.substring(6,8)
  return birthday
};
/**
 * 截取客户全称作为客户简称
 * @param custFullName
 * @returns {*}
 */
export const cutCustFullName = (custFullName) => {
    return cutStrByByteLength(custFullName, 16);
};
/**
 * 根据字节长度截取字符串
 *  @param str 字符串
 *  @param length 字节长度
 * */
export const cutStrByByteLength = (str, length ) => {
    if(!str){
        return str
    }
    var result = '',
        strlen = str.length, // 字符串长度
        chrlen = str.replace(/[^\x00-\xff]/g,'**').length; // 字节长度

    if(chrlen<=length) {
        return str;
    }

    for(var i=0,j=0;i<strlen;i++){
        var chr = str.charAt(i);
        if(/[\x00-\xff]/.test(chr)){
            j++; // ascii码为0-255，一个字符就是一个字节的长度
        }else{
            j+=2; // ascii码为0-255以外，一个字符就是两个字节的长度
        }
        if(j<=length){ // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
            result += chr;
        }else{ // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
            return result;
        }
    }
};
import gxRegionData from '../components/preEntry/citySelectData/cityselect-data'
import RegionData from '../components/preEntry/citySelectData/zt-cityselect-data'
import countryData from '../components/preEntry/countryselect-data'
import capitalData from '../components/preEntry/provincialCapital-data'
export const getCityData = (qsName) => {
    let regionData = RegionData;
    if (qsName=="ZHONGTAI") {
        return _.cloneDeep(regionData);
    } else {
        regionData = window.oppCityData
        return _.cloneDeep(regionData);
    }
    
}
export const parseAddress = (value, qsName) => {
    let regionData = getCityData(qsName);
    
    if(value && typeof(value) == "string") {
        let addrValue = value;
        let country = "";
        let region = [];
        let street = "";
        let zipCode = "";

        for(let i = 0; i < countryData.length; i++) {
            let data = countryData[i]
            if(addrValue.indexOf(data.cnName) === 0) {
                country = data.cnName
                addrValue = addrValue.substr(data.cnName.length);
                break;
            }
        }

        street = addrValue;
        var parseRegion = function(cityData, value) {
            _.each(cityData, function (data) {
                //地址截取到“市”：比如：山东省青岛市
                let provinceCity = value.substr(0, value.indexOf("市") + 1) || "";
                //判断是否是省会城市(排除直辖市)
                let capitalCity = _.find(capitalData, o => provinceCity.indexOf(o.capital) > -1) || {};


                //如果直辖市地址中不包含“市辖区”也要支持回填
                if (value && (value.indexOf(data.label) === 0 || data.label == "市辖区" || data.label == "辖县" || 
                (value.indexOf("市") > -1 && provinceCity.length > 2 && !!capitalCity && capitalCity.province === data.label))) {
                    if (value.indexOf(data.label) === 0) {
                        region.push(data.label);
                    }else if(!!capitalCity){
                        region.push(capitalCity.province);
                    }
            
                    if (value.indexOf(data.label) === 0) {
                        street = value.substr(data.label.length);
                    } else if(!!capitalCity){
                        street = value;
                    }
            
                    if (data.code) {
                        zipCode = data.code;
                    }
            
                    if (data["children"] && data["children"].length) {
                        parseRegion(data["children"], street);
                    } else {
                        return false;
                    }
                }
            });
          };
        parseRegion(regionData, addrValue);
        // 如果 region 只存了一个，且不为台湾省、香港、澳门等地，说明该地址可能不包含地级市，省之后直接到县级
        if (region.length == 1 && "台湾省,澳门特别行政区,不详".indexOf(region[0]) == -1) {
            let city = getCity(_.find(regionData, obj => {
                return obj.value == region[0];
            }), street);
            if (city && city.length == 2) {
                region.push(city[0].label);
                region.push(city[1].label);
                street = street.substr(city[1].label.length);
                if (city[1].code) {
                    zipCode = city[1].code;
                }
            }
        }
        return [country, region, street, zipCode];
    } else {
        return ["", [],"", ""];
    }
}
/**
 * 获取地址对应的地级市
 * @param {Ojbect} cityData 某省下的所有地级市、县级市数据
 * @param {String} address 以县级市开头的地址
 * @returns {Ojbect} [{...}, {...}] / undefine;
 */
function getCity(cityData, address) {
    for (var i = 0; i < cityData["children"].length; i++) {
        for (var j = 0; j < cityData["children"][i]["children"].length; j++) {
            if (cityData["children"][i]["children"][j] && 
            address.indexOf(cityData["children"][i]["children"][j].value) === 0) {
                return [cityData["children"][i], cityData["children"][i]["children"][j]];
            }
        }
    }
}

export const getAddressStr = (value) => {
    let addr = '';
    for(var i = 0; i < value.length; i++) {
      addr += CodeToText[value[i]];
    }

    return addr;
}
/**
 * **将数字转换成对应的金额千位符格式**
 * @method formatNumber
 * @param num{string|number} 输入数据
 * @returns {string} 金额千位符格式
 */
export const formatNumber = (num) => {
    if (!/^(\+|-)?(\d+)(,\d{3})*(\.|\.\d+)?$/.test(num)) {
        return num;
    }
    var re = /(\d)(\d{3})(,|$)/,
        a = RegExp.$1,
        b = RegExp.$2,
        c = RegExp.$4;
    while (re.test(b)) {
        b = b.replace(re, "$1,$2$3");
    }
    return a + "" + b + "" + c;
}

/**
 * 精确乘法
 * @param num1 输入数1
 * @param num2 输入数2
 * multi(1.005, 100) 或者 multi(multi(1.005, 100), 3)
 */
export const multi = function (num1, num2) {
    var num1Changed = floatToInt(num1);
    var num2Changed = floatToInt(num2);
    var baseNum = digitLength(num1) + digitLength(num2);
    return num1Changed * num2Changed / Math.pow(10, baseNum);
}
/**
 * 精确除法
 * @param num1 输入数1
 * @param num2 输入数2
 * divide(2.1 , 0.3) 或者 divide(divide(2.1 ,0.3), 1)
 */
export const divide = function (num1, num2) {
    var num1Changed = floatToInt(num1);
    var num2Changed = floatToInt(num2);
    return multi(num1Changed / num2Changed, Math.pow(10, digitLength(num2) - digitLength(num1)));
}
/**
 * 四舍五入（注：返回值为字符串）
 * @param num 输入数
 * @param ratio 保留小数位数
 * round(4.55)
 */
export const round = function (num, ratio) {
    var base = Math.pow(10, ratio);
    return divide(Math.round(multi(num, base)), base);
}
/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 * @param num 输入数
 * floatToInt(0.1)=1
 */
export const floatToInt = function (num) {
    if (num.toString().indexOf('e') === -1) {
        return Number(num.toString().replace('.', ''));
    }
    var dLen = digitLength(num);
    return dLen > 0 ? num * Math.pow(10, dLen) : num;
}
/**
 * 返回小数位位数，支持科学计数法
 * @param num 输入数
 * digitLength(0.099)=3
 */
export const digitLength = function (num) {
    var eSplit = num.toString().split(/[eE]/);
    var len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0);
    return len > 0 ? len : 0;
}

/**
 * **获取字符长度，一个中文算两个字符**
 * @method getCharLength
 * @param str{string} 输入字符串
 * @param n{number} 中文算几个字符
 * @returns {number} 字符数
 */
export const getCharLength = function (str, n) {
    return _.isString(str) ? str.replace(/[^\x00-\xff]/g, "1234567890".substr(0,n || 2) ).length : 0;
}
/**
 * *验证是否是身份证**
 * @method getCharLength
 * @param num 输入字符串
 * @returns true 是身份证
 */
export const IDCardCheck = function (num) {
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。   
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
    //下面分别分析出生日期和校验位 
    var len, re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确 
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            return false;
        }
        else {
            //将15位身份证转成18位 
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确 
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            return false;
        }
        else {
            //检验18位身份证的校验码是否正确。 
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                return false;
            }
            return true;
        }
    }
    return false;
}
/**
 * 转换时间格式
 * @param dataStr  输入的时间格
 */
export const transDate = function (dateStr){
    dateStr = dateStr || "";
    if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(dateStr)){
        return dateStr;
    }else{
        switch(dateStr){
            case "":
            case "0":
                return "";
                break;
            case "30001231":
                return "长期";
                break;
            default:
                return formatDate(dateStr, "yyyy年MM月dd日")
                break;
        }
    }
}

/**
 * **根据格式化字符串将日期对象转成字符串**
 * @method formatDate
 * @param dateTime{date} 需要格式化的日期
 * @param fmt {string} 格式化的格式 默认 yyyy-MM-dd hh:mm:ss
 * @returns {*|string} 格式化后的日期或直接返回格式
 */
export const formatDate = function (dateTime, fmt){
    fmt = fmt || "yyyy-MM-dd hh:mm:ss";
    if(_.isString(dateTime)) {
        dateTime = parseDate(dateTime);
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
}
export const parseDate = function(text){
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
    }else{
        if(ymdStr.length === 8){
            year = ymdStr.substring(0,4);
            month = ymdStr.substring(4,6);
            dd = ymdStr.substring(6,8);
        }
    }
    if(hmsStr){
        hms = hmsStr.match(/^(\d{2})\D(\d{2})\D(\d{2})/);
        hh = hms[1];
        mm = hms[2];
        ss = hms[3];
    }

    return new Date(year, month - 1, dd, hh, mm, ss);
}

export const getCustName = function(custFullName) {
    var tmpStr = "", curStr;
    if (getCharLength(custFullName) <= 16) {
        return custFullName;
    }

    for (var i = 0, l = custFullName.length; i < l; i++) {
        curStr = custFullName.charAt(i);

        if (lenToFourteen && /^[\u4e00-\u9fa5]*$/.test(curStr)) { //长度为16并且为中文return;
            return tmpStr

        } else {
            tmpStr += curStr;

            if (15 === getCharLength(tmpStr)) {  //如果长度有15位给一个变量
                var lenToFourteen = true;
            }
            if (getCharLength(tmpStr) >= 16) {
                return tmpStr;
            }
        }

    }
}
//数字转大写
export const convertMoney =  (a, b) => {
    b = _.isUndefined(b) ? !0 : !!b;
    var c, d = (a + "").trim().replace(/,/g, ""),
        e = Number(d),
        f = "零壹贰叁肆伍陆柒捌玖",
        g = "万仟佰拾亿仟佰拾万仟佰拾元角分",
        h = "";
    if (isNaN(e)) return "";
    if (e > 9999999999999.99 || -9999999999999.99 > e) return "";
    0 > e && (d = d.substring(1, d.length)),
    d += "00",
    (c = d.indexOf(".")) >= 0 && (d = d.substring(0, c) + d.substr(c + 1, 2));
    for (var i = 0,j = d.length; j > i; i++) h += f.charAt(d.charAt(i)) + g.substr(g.length - d.length).charAt(i);
    return h = "零元零角零分" === h ? "零元": h.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万/g, "$1").replace(/^元零?|零分/g, "").replace(/元$/g, "元整"),
    b || (h = -1 !== h.indexOf("角") || -1 !== h.indexOf("分") ? h.replace(/(角|分)/g, "").replace(/(元|元整)/g, "点") : h.replace(/(元整|元)/g, "")),
    h && 0 > e ? "负" + h: h
}

/**
 * 精确加法
 * @param num1 输入数1
 * @param num2 输入数2
 * add(2.3, 2.4) 或者 add(add(2.3, 2.4), 3)
 */
export const add = function (num1, num2) {
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (multi(num1, baseNum) + multi(num2, baseNum)) / baseNum;
}

/**
 * 补零
 * @param str
 * @param num 默认补齐4位
 * @returns {string}
 */
export const addZero = function (str, num) {
    num = num || 4;
    for (var i = 0; i < num; i++) {
        str = "0" + str;
    }
    return str.substr(str.length - num);
}

/**
 * 精确减法
 * @param num1 输入数1
 * @param num2 输入数2
 * sub(1, 0.9) 或者 sub(sub(1, 0.9), 0.03)
 */
export const sub = function (num1, num2) {
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (multi(num1, baseNum) - multi(num2, baseNum)) / baseNum;
}

export const buildUrl = function (url, params, hash, opts) {
    if (!url) {
        return "";
    }
    opts = (_.isObject(hash) ? hash : opts) || {};
        let parsed = parseUrl(url),
        hashStr = (function () {
            if ("string" === typeof(hash)) {
                return hash ? "#" + hash : "";
            }
            return parsed.hash ? "#" + parsed.hash : "";
        })(),
        qryStr = (function () {
            var obj = _.extend({}, parsed.params, params);
            return _.isEmpty(obj) ?
                "" : "?" + buildQueryString(obj, _.isUndefined(opts.encodeFlag) ? true : opts.encodeFlag);
        })();

    return url.replace(/(\?|\#).*/, "") + qryStr + hashStr;
}
/**
 * **根据参数构建URL的查询字符串**
 * @method buildQueryString
 * @param {object} obj 参数
 * @return {string} 查询字符串
 */
export const buildQueryString = function (obj, encodeFlag) {
    var arr = [];
    _.each(obj, function (value, key) {
        arr.push(key + "=" + (encodeFlag ? encodeURIComponent(value) : value));
    });
    return arr.join("&");
}

/**
 * **使用html的a标签解析URL**
 * @method parseUrl
 * @param {string} url 需要解析的URL地址
 * @return {object} 解析后的URL对象
 */
export const parseUrl = function(url) {
    var a = document.createElement('a');
    a.href = url = (url || window.location.href);
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: (a.port == "0" || a.port == "") ? 80 : a.port,  // a.port 可能会解析不一样的
        query: a.search,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = decodeURIComponent(s[1]);
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}


/**
 * 
 * @param {*} num 要转换的数字
 * @des 数字转汉字
 */
export const toChinesNum = (num) => {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = (temp) => {
      let strArr = temp.toString().split("").reverse();
      let newNum = "";
      for (var i = 0; i < strArr.length; i++) {
        newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
      }
      return newNum;
    }
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) {
      noWan = "0" + noWan;
    }
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

/**
 * 判断是否有生僻字的写法：
 * 包含全角括号，且括号内部为英文字符（大写或小写），括号左右两边为任意长度的字符
 */
export const isCommonChar = function (str) {
    var flag = /^.*(（[a-zA-Z]+）).*$/.test(str);
    return !flag;
}
//身份证降位
export const lowerCardNo = function (idCard) {
    if (!idCard || idCard.length !== 18) {
        return idCard;
    }

    return idCard.substr(0, 6) + idCard.substr(8, 9);
}
//全角转半角
export const toCDB = function(str) {
    var tmp = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
        }
        else {
            tmp += String.fromCharCode(str.charCodeAt(i));
        }
    }
    return tmp
  }