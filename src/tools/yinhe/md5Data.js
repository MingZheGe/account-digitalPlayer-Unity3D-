import utils from '@/tools/libs/utils'

const bizObjectKeys = {
    // 融资融券额度变更
    'V0346': ["APP_TOT_ASSET_TRANS", "APP_TOT_CREDIT_TRANS", "SX_TOT_CREDIT_TRANS"],
    'V0050': ["ACCT_INFO.CNY_BANK_INFO.EXT_ORG", "ACCT_INFO.CNY_BANK_INFO.BANK_ACCT", 
              "ACCT_INFO.CNY_BANK_INFO.CUST_NAME", "ACCT_INFO.CNY_BANK_INFO.ID_TYPE", 
              "ACCT_INFO.CNY_BANK_INFO.ID_CODE"],
},
//业务对象中子对象里面排除某个字段不算作md5
bizObjectOutKeys = {

};
//根据配置排除的key过滤业务数据不对比的数据
function filteDataAttrByKey(data) {
    var loopFilter,
      outkeys = bizObjectOutKeys[data.BUSI_CODE] || [];
  
    //递归运行查找到删除相应的key
    var loopFilter = function (keys, data) {
      var tmp = data[keys[0]];
      if (keys.length === 1) {
        delete data[keys[0]];
        return;
      }
      if ($.isPlainObject(tmp)) {
        keys.shift();
        loopFilter(keys, tmp);
  
      }
      if ($.isArray(tmp)) {
        keys.shift();
        $.each(tmp, function (i, item) {
          loopFilter(keys, item);
        });
      }
    };
  
    $.each(outkeys, function (i, key) {
      loopFilter(key.split("."), data);
    });
    return data;
}
//递归循环object排序里面所有key属性值
function loopSortObjectKeys(sortData, outKeys) {
    var keys = _.keys(sortData);
  
    sortData = _.pick(sortData, keys.sort()); //修改对象内按key排序
  
    $.each(keys.sort(), function (i, k) {
      if ($.inArray(k, outKeys) > -1) {
        sortData[k] = undefined;
        return;
      }
      var v = sortData[k],
        subKeys = v instanceof Object ? _.keys(v) : 0;
      sortData[k] = subKeys.length ? loopSortObjectKeys(v, outKeys) : v;
    });
  
    //数组再次排序
    if ($.isArray(sortData)) {
      sortData.sort(function (a, b) {
        var md5A = utils.md5($.isPlainObject(a) ? utils.toJSON(a) : ""),
          md5B = utils.md5($.isPlainObject(b) ? utils.toJSON(b) : "");
        return md5A > md5B ? 1 : 0;
      });
    }
    return sortData;
  };
  
  
  //对比当前受理和以往受理数据是否改变
  function compBusiData(initialData, busiData) {
    var objectKeys, newDataA, newDataB,
      cloneDataA = $.extend(true, {}, initialData),
      cloneDataB = $.extend(true, {}, busiData);
  
    objectKeys = bizObjectKeys[busiData.BUSI_CODE];
  
    //排除对比的属性y
    cloneDataA = filteDataAttrByKey(cloneDataA);
    cloneDataB = filteDataAttrByKey(cloneDataB);
  
    //提取对比的属性
    newDataA = _.pick(cloneDataA, objectKeys);
    newDataB = _.pick(cloneDataB, objectKeys);
  
    return !_.isEqual(newDataA, newDataB);
  }
  
  
  /**
   * 计算其业务数据的MD5值，可用于对比当前受理和以往受理数据是否改变
   * @param busiData 业务数据
   * @returns md5
   */
  function md5Data(busiData) {
    try {
      var newData, tmpStr,
        BUSI_CODE = busiData.BUSI_CODE,
        objectKeys = bizObjectKeys[BUSI_CODE],
        outObjectKeys = bizObjectOutKeys[BUSI_CODE],
        cloneData = $.extend(true, {}, busiData);
  
      if (!objectKeys) {
        return objectKeys;
      }
  
      cloneData = filteDataAttrByKey(cloneData);
  
      newData = _.pick(cloneData, objectKeys);
  
      newData = loopSortObjectKeys(newData, outObjectKeys);
  
      tmpStr = utils.toJSON(newData);
      /*for (var i=0;i<100;i++){
          console.log("测试md5值" + i + "： " + utils.md5(tmpStr));
      }*/
      // console.log("计算md5的字符串： " + utils.encrypt(tmpStr, "888888"));
    } catch (err) {
      console.error(err)
    }
  
    return utils.md5(tmpStr);
  };
  export default {
    compBusiData,
    md5Data
}