/**
 * 配置业务预录入字段关联
 * @author  lij
 *
 * 格式样例：
 * "Z0035":{                                      // 业务代码
 *   "0": {                                       // 客户类型
 *     "ID_TYPE": [{                              // 证件类型对应的关联
 *       "FIELD": "SUBJECT_IDENTITY",             // 关联主体身份
 *       "FILTER": [{                             // 字典过滤选项
 *         "CONDITION": ["00","08"],              // 数组类型：过滤条件 [身份证、临时身份证]
 *         "VALUE": ["0","1","2","3","4","9"],    // 设置主体身份的可选值
 *         "DISABLED": "1",                       // DISABLED为字段控制值
 *         "REQUIRED": "1",                       // REQUIRED为字段必填值
 *         "DEFAULT": "",                         // 设置默认值
 *       },{                                      // 对象类型：过滤条件 [ID_TYPE == "10" && SUBJECT_IDENTITY in "0,1"]
 *         "CONDITION": {"ID_TYPE":["10"],"SUBJECT_IDENTITY":["0","1"]},
 *         "VALUE": ["01","02","08"],
 *         "DEFAULT": "",
 *       },{
 *         "CONDITION": "'[key]' != '8'",         //字符类型：过滤条件：ID_TYPE != '8'
 *         "VALUE": ["0","1","2","3"], 
 *       }]
 *     }]
 *   }
 * }
 * 
 */


const fieldConfig = {
  // 业务代码
  "Z0035": {
    // 客户类别 个人/机构/产品
    "0": {
      //  税收居民身份变化引起的关联数组
      "TAX_RESIDENT_TYPE": [{
        // 关联税收居民国
        "FIELD": "CITIZENSHIP",
        // 字典过滤选项
        "FILTER": [{
          "CONDITION": ["1"],
          "DEFAULT": "CHN",
          "DISABLED": "2"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联是否纳税人识别号
        "FIELD": "HAS_TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          "DEFAULT": ""
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0",
          "DEFAULT": "0"
        }]
      },
      {
        // 关联纳税人识别编号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          "DEFAULT": ""
        }]
      }, {
        // 关联未取得纳税人识别编号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          "DEFAULT": ""
        }]
      }, {
        // 关联无纳税人识别编号原因
        "FIELD": "OPP_NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          "DEFAULT": ""
        }]
      },
      {
        // 关联名
        "FIELD": "NAME_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联姓
        "FIELD": "SURNAME_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生日期 BIRTHDAY
        "FIELD": "BIRTHDAY",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生地
        "FIELD": "BIRTH_ADDRESS",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生地(英文/拼音)
        "FIELD": "BIRTH_ADDRESS_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联现居地址
        "FIELD": "ADDRESS",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联现居地址(英文/拼音)
        "FIELD": "ADDRESS_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }],
      //  是否纳税人识别号变化引起的关联数组
      "HAS_TAXPAYER_IDNO": [{
        // 关联无纳税人识别号原因
        "FIELD": "OPP_NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["0"],
          "DISABLED": "0",
          "DEFAULT": "2"
        }, {
          "CONDITION": ["1"],
          "DISABLED": "1",
          "DEFAULT": ""
        }]
      }, {
        // 关联未取得纳税人识别编号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }]
      }, {
        // 关联纳税人识别号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["0"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["1"],
          "DISABLED": "0"
        }]
      }],
      //  无纳税人识别号原因变化引起的关联数组
      "OPP_NO_TAXPAYERID_REASON": [{
        // 关联未取得纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2"],
          "DISABLED": "0"
        }]
      }],
    },
    "1": {
      "ID_TYPE": [{
        "FIELD": "CITIZENSHIP",
        "FILTER": [{
          "CONDITION": ["10", "11", "12", "13"],
          // "DEFAULT": "CHN",
          "DISABLED": "2",
        }, {
          "CONDITION": ["14"],
          "DISABLED": "0",
        }]
      },
      ],
      "SUBJECT_IDENTITY": [
        {
          "FIELD": "TRADE",
          "FILTER": [{
            "CONDITION": ["8"],
            "VALUE": ["A"],
            "DEFAULT": "A",
          }, {
            "CONDITION": "'[key]' != '8'",   //["0","6","7"]
            "VALUE": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "Z"],
            // "DEFAULT": "",
          }]
        }
      ],
      //  税收居民身份变化引起的关联数组
      "TAX_RESIDENT_TYPE": [{
        // 关联税收居民国
        "FIELD": "CITIZENSHIP",
        // 字典过滤选项
        "FILTER": [{
          "CONDITION": ["1"],
          "DEFAULT": "CHN",
          "DISABLED": "2"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联是否纳税人识别号
        "FIELD": "HAS_TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0",
          "DEFAULT": "0"
        }]
      }, {
        // 关联纳税人识别编号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联未取得纳税人识别编号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联无纳税人识别编号原因
        "FIELD": "OPP_NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联名
        "FIELD": "NAME_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联姓
        "FIELD": "SURNAME_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生日期 BIRTHDAY
        "FIELD": "BIRTHDAY",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生地
        "FIELD": "BIRTH_ADDRESS",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生地(英文/拼音)
        "FIELD": "BIRTH_ADDRESS_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联现居地址
        "FIELD": "ADDRESS",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联现居地址(英文/拼音)
        "FIELD": "ADDRESS_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }],
      //  是否纳税人识别号变化引起的关联数组
      "HAS_TAXPAYER_IDNO": [{
        // 关联无纳税人识别号原因
        "FIELD": "OPP_NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["0"],
          "DISABLED": "0",
          "DEFAULT": "2"
        }, {
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联未取得纳税人识别编号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }]
      }, {
        // 关联纳税人识别号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["0"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["1"],
          "DISABLED": "0"
        }]
      }],
      //  无纳税人识别号原因变化引起的关联数组
      "OPP_NO_TAXPAYERID_REASON": [{
        // 关联未取得纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2"],
          "DISABLED": "0"
        }]
      }],
    },
    "2": {
      "ID_TYPE": [{
        "FIELD": "CITIZENSHIP",
        "FILTER": [{
          "CONDITION": ["10", "11", "12", "13"],
          "DEFAULT": "CHN",
          "DISABLED": "2",
        }, {
          "CONDITION": ["14"],
          "DISABLED": "0",
        }]
      }, {
        "FIELD": "SUBJECT_IDENTITY",
        "FILTER": [{
          "CONDITION": ["10"],
          "VALUE": ["0", "8"],
          "DEFAULT": "",
        },
        {
          "CONDITION": ["11", "12", "13"],
          "VALUE": ["0"],
          "DEFAULT": "0",
        },
        {
          "CONDITION": ["14"],
          "VALUE": ["0", "6", "7"],
          "DEFAULT": "",
        }]
      }
      ],
      "SUBJECT_IDENTITY": [{
        "FIELD": "TRADE",
        "FILTER": [{
          "CONDITION": ["8"],
          "VALUE": ["A"],
          "DEFAULT": "A",
        }, {
          "CONDITION": ["0", "6", "7"],
          "VALUE": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "Z"],
          // "DEFAULT": "",
        }]
      }
      ],
      //  税收居民身份变化引起的关联数组
      "TAX_RESIDENT_TYPE": [{
        // 关联税收居民国
        "FIELD": "CITIZENSHIP",
        // 字典过滤选项
        "FILTER": [{
          "CONDITION": ["1"],
          "DEFAULT": "CHN",
          "DISABLED": "2"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联是否纳税人识别号
        "FIELD": "HAS_TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0",
          "DEFAULT": "0"
        }]
      }, {
        // 关联纳税人识别编号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联未取得纳税人识别编号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联无纳税人识别编号原因
        "FIELD": "OPP_NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联名
        "FIELD": "NAME_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联姓
        "FIELD": "SURNAME_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生日期 BIRTHDAY
        "FIELD": "BIRTHDAY",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生地
        "FIELD": "BIRTH_ADDRESS",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生地(英文/拼音)
        "FIELD": "BIRTH_ADDRESS_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联现居地址
        "FIELD": "ADDRESS",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联现居地址(英文/拼音)
        "FIELD": "ADDRESS_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }],
      //  是否纳税人识别号变化引起的关联数组
      "HAS_TAXPAYER_IDNO": [{
        // 关联无纳税人识别号原因
        "FIELD": "OPP_NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["0"],
          "DISABLED": "0",
          "DEFAULT": "2"
        }, {
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联未取得纳税人识别编号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }]
      }, {
        // 关联纳税人识别号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["0"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["1"],
          "DISABLED": "0"
        }]
      }],
      //  无纳税人识别号原因变化引起的关联数组
      "OPP_NO_TAXPAYERID_REASON": [{
        // 关联未取得纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2"],
          "DISABLED": "0"
        }]
      }],
    },
  },
  "V0050": {
    // 客户类别 
    "1": {
      "ID_TYPE": [{
        "FIELD": "CITIZENSHIP",
        "FILTER": [{
          "CONDITION": ["10", "11", "12", "13"],
          // "DEFAULT": "CHN",
          "DISABLED": "2",
        }, {
          "CONDITION": ["14"],
          "DISABLED": "0",
        }]
      },
      ],
      "SUBJECT_IDENTITY": [
        {
          "FIELD": "TRADE",
          "FILTER": [{
            "CONDITION": ["8"],
            "VALUE": ["A"],
            "DEFAULT": "A",
          }, {
            "CONDITION": "'[key]' != '8'",   //["0","6","7"]
            "VALUE": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "Z"],
            // "DEFAULT": "",
          }]
        }
      ],
      //  税收居民身份变化引起的关联数组
      "TAX_RESIDENT_TYPE": [{
        // 关联税收居民国
        "FIELD": "CITIZENSHIP",
        // 字典过滤选项
        "FILTER": [{
          "CONDITION": ["1"],
          "DEFAULT": "CHN",
          "DISABLED": "2"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联是否纳税人识别号
        "FIELD": "HAS_TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0",
          "DEFAULT": "0"
        }]
      }, {
        // 关联纳税人识别编号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联未取得纳税人识别编号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联无纳税人识别编号原因
        "FIELD": "OPP_NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联名
        "FIELD": "NAME_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联姓
        "FIELD": "SURNAME_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生日期 BIRTHDAY
        "FIELD": "BIRTHDAY",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生地
        "FIELD": "BIRTH_ADDRESS",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生地(英文/拼音)
        "FIELD": "BIRTH_ADDRESS_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联现居地址
        "FIELD": "ADDRESS",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联现居地址(英文/拼音)
        "FIELD": "ADDRESS_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }],
      //税收居民身份变化引起的关联数组
      //税收居民国
      "CITIZENSHIP": [{
        // 关联纳税识别号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "1",
        }]
      }, {
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "0"
        }]
      }],
      //纳税识别号
      "TAXPAYER_IDNO": [{
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "0",
          "REQUIRED": "1"
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "DEFAULT": "",
          "REQUIRED": "0"
        }]
      }],
      //  无纳税人识别号原因变化引起的关联数组
      "NO_TAXPAYERID_REASON": [{
        // 关联未取得纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON_INPUT",
        "FILTER": [{
          "CONDITION": "'[KEY]'!=='2'",
          "DISABLED": "1",
          "DEFAULT":"",
        }, {
          "CONDITION": ["2"],
          "DISABLED": "0",
        }]
      }, {
        // 关联纳税人识别号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",// 如果原因为空，则识别号必填
          "REQUIRED": "1",
          "DISABLED": "0",
        }, {
          "CONDITION": "'[key]' !== ''",
          "DISABLED": "0",
          "REQUIRED": "0",
          "DEFAULT": "",
        }]
      }],
      // 税收居民身份2变化引起的关联数组
      //税收居民国2
      "CITIZENSHIP2": [{   // 关联纳税识别号
        "FIELD": "TAXPAYER_IDNO2",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "1",
        }]
      }, {
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON2",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "0"
        }]
      }],
      //纳税识别号
      "TAXPAYER_IDNO2": [{
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON2",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "0",
          "REQUIRED": "1"
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "DEFAULT": "",
          "REQUIRED": "0"
        }]
      }],
      //  无纳税人识别号原因变化引起的关联数组
      "NO_TAXPAYERID_REASON2": [{
        // 关联未取得纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON2_INPUT",
        "FILTER": [{
          "CONDITION": "'[KEY]'!=='2'",
          "DISABLED": "1",
          "DEFAULT":"",
        }, {
          "CONDITION": ["2"],
          "DISABLED": "0"
        }]
      }, {
        // 关联纳税人识别号
        "FIELD": "TAXPAYER_IDNO2",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",// 如果原因为空，则识别号必填
          "REQUIRED": "1",
          "DISABLED": "0",
        }, {
          "CONDITION": "'[key]' !== ''",
          "DISABLED": "0",
          "REQUIRED": "0",
          "DEFAULT": "",
        }]
      }],
      // 税收居民身份3变化引起的关联数组
      //税收居民国3
      "CITIZENSHIP3": [{
        // 关联纳税识别号
        "FIELD": "TAXPAYER_IDNO3",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "1",
        }]
      }, {
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON3",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "0"
        }]
      }],
      //纳税识别号
      "TAXPAYER_IDNO3": [{
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON3",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "0",
          "REQUIRED": "1"
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "DEFAULT": "",
          "REQUIRED": "0"
        }]
      }],
      //  无纳税人识别号原因变化引起的关联数组
      "NO_TAXPAYERID_REASON3": [{
        // 关联未取得纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON3_INPUT",
        "FILTER": [{
          "CONDITION": "'[KEY]'!=='2'",
          "DISABLED": "1",
          "DEFAULT":"",
        }, {
          "CONDITION": ["2"],
          "DISABLED": "0"
        }]
      },{
        // 关联纳税人识别号
        "FIELD": "TAXPAYER_IDNO3",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",// 如果原因为空，则识别号必填
          "REQUIRED": "1",
          "DISABLED": "0",
        }, {
          "CONDITION": "'[key]' !== ''",
          "DISABLED": "0",
          "REQUIRED": "0",
          "DEFAULT": "",
        }]
      }],
    },
  },
  "V0051": {
    // 客户类别 
    "2": {
      "ID_TYPE": [{
        "FIELD": "CITIZENSHIP",
        "FILTER": [{
          "CONDITION": ["10", "11", "12", "13"],
          "DEFAULT": "CHN",
          "DISABLED": "2",
        }, {
          "CONDITION": ["14"],
          "DISABLED": "0",
        }]
      }, {
        "FIELD": "SUBJECT_IDENTITY",
        "FILTER": [{
          "CONDITION": ["10"],
          "VALUE": ["0", "8"],
          "DEFAULT": "",
        },
        {
          "CONDITION": ["11", "12", "13"],
          "VALUE": ["0"],
          "DEFAULT": "0",
        },
        {
          "CONDITION": ["14"],
          "VALUE": ["0", "6", "7"],
          "DEFAULT": "",
        }]
      }
      ],
      "SUBJECT_IDENTITY": [{
        "FIELD": "TRADE",
        "FILTER": [{
          "CONDITION": ["8"],
          "VALUE": ["A"],
          "DEFAULT": "A",
        }, {
          "CONDITION": ["0", "6", "7"],
          "VALUE": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "Z"],
          // "DEFAULT": "",
        }]
      }],
      //  税收居民身份变化引起的关联数组
      "TAX_RESIDENT_TYPE": [{
        // 关联税收居民国
        "FIELD": "CITIZENSHIP",
        // 字典过滤选项
        "FILTER": [{
          "CONDITION": ["1"],
          "DEFAULT": "CHN",
          "DISABLED": "2"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联是否纳税人识别号
        "FIELD": "HAS_TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0",
          "DEFAULT": "0"
        }]
      }, {
        // 关联纳税人识别编号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联未取得纳税人识别编号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联无纳税人识别编号原因
        "FIELD": "OPP_NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联名
        "FIELD": "NAME_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联姓
        "FIELD": "SURNAME_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生日期 BIRTHDAY
        "FIELD": "BIRTHDAY",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生地
        "FIELD": "BIRTH_ADDRESS",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联出生地(英文/拼音)
        "FIELD": "BIRTH_ADDRESS_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联现居地址
        "FIELD": "ADDRESS",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }, {
        // 关联现居地址(英文/拼音)
        "FIELD": "ADDRESS_ENG",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2", "3"],
          "DISABLED": "0"
        }]
      }],
      //  是否纳税人识别号变化引起的关联数组
      "HAS_TAXPAYER_IDNO": [{
        // 关联无纳税人识别号原因
        "FIELD": "OPP_NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["0"],
          "DISABLED": "0",
          "DEFAULT": "2"
        }, {
          "CONDITION": ["1"],
          "DISABLED": "1",
          // "DEFAULT": ""
        }]
      }, {
        // 关联未取得纳税人识别编号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }]
      }, {
        // 关联纳税人识别号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": ["0"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["1"],
          "DISABLED": "0"
        }]
      }],
      //  无纳税人识别号原因变化引起的关联数组
      "OPP_NO_TAXPAYERID_REASON": [{
        // 关联未取得纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": ["1"],
          "DISABLED": "1"
        }, {
          "CONDITION": ["2"],
          "DISABLED": "0"
        }]
      }],
    },
  },
  "V0052": {
  //税收居民身份变化引起的关联数组
      //税收居民国
      "CITIZENSHIP": [{
        // 关联纳税识别号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "1",
        }]
      }, {
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "0"
        }]
      }],
      //纳税识别号
      "TAXPAYER_IDNO": [{
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "0",
          "REQUIRED": "1"
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "DEFAULT": "",
          "REQUIRED": "0"
        }]
      }],
      //  无纳税人识别号原因变化引起的关联数组
      "NO_TAXPAYERID_REASON": [{
        // 关联未取得纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON_INPUT",
        "FILTER": [{
          "CONDITION": "'[KEY]'!=='2'",
          "DISABLED": "1",
          "DEFAULT":"",
        }, {
          "CONDITION": ["2"],
          "DISABLED": "0",
        }]
      }, {
        // 关联纳税人识别号
        "FIELD": "TAXPAYER_IDNO",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",// 如果原因为空，则识别号必填
          "REQUIRED": "1",
          "DISABLED": "0",
        }, {
          "CONDITION": "'[key]' !== ''",
          "DISABLED": "0",
          "REQUIRED": "0",
          "DEFAULT": "",
        }]
      }],
      // 税收居民身份2变化引起的关联数组
      //税收居民国2
      "CITIZENSHIP2": [{   // 关联纳税识别号
        "FIELD": "TAXPAYER_IDNO2",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "1",
        }]
      }, {
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON2",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "0"
        }]
      }],
      //纳税识别号
      "TAXPAYER_IDNO2": [{
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON2",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "0",
          "REQUIRED": "1"
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "DEFAULT": "",
          "REQUIRED": "0"
        }]
      }],
      //  无纳税人识别号原因变化引起的关联数组
      "NO_TAXPAYERID_REASON2": [{
        // 关联未取得纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON2_INPUT",
        "FILTER": [{
          "CONDITION": "'[KEY]'!=='2'",
          "DISABLED": "1",
          "DEFAULT":"",
        }, {
          "CONDITION": ["2"],
          "DISABLED": "0"
        }]
      }, {
        // 关联纳税人识别号
        "FIELD": "TAXPAYER_IDNO2",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",// 如果原因为空，则识别号必填
          "REQUIRED": "1",
          "DISABLED": "0",
        }, {
          "CONDITION": "'[key]' !== ''",
          "DISABLED": "0",
          "REQUIRED": "0",
          "DEFAULT": "",
        }]
      }],
      // 税收居民身份3变化引起的关联数组
      //税收居民国3
      "CITIZENSHIP3": [{
        // 关联纳税识别号
        "FIELD": "TAXPAYER_IDNO3",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "1",
        }]
      }, {
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON3",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "2",
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "REQUIRED": "0"
        }]
      }],
      //纳税识别号
      "TAXPAYER_IDNO3": [{
        // 关联无纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON3",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",
          "DISABLED": "0",
          "REQUIRED": "1"
        }, {
          "CONDITION": "'[key]' != ''",
          "DISABLED": "0",
          "DEFAULT": "",
          "REQUIRED": "0"
        }]
      }],
      //  无纳税人识别号原因变化引起的关联数组
      "NO_TAXPAYERID_REASON3": [{
        // 关联未取得纳税人识别号原因
        "FIELD": "NO_TAXPAYERID_REASON3_INPUT",
        "FILTER": [{
          "CONDITION": "'[KEY]'!=='2'",
          "DISABLED": "1",
          "DEFAULT":"",
        }, {
          "CONDITION": ["2"],
          "DISABLED": "0"
        }]
      },{
        // 关联纳税人识别号
        "FIELD": "TAXPAYER_IDNO3",
        "FILTER": [{
          "CONDITION": "'[key]' == ''",// 如果原因为空，则识别号必填
          "REQUIRED": "1",
          "DISABLED": "0",
        }, {
          "CONDITION": "'[key]' !== ''",
          "DISABLED": "0",
          "REQUIRED": "0",
          "DEFAULT": "",
        }]
      }],
  },
}



export default fieldConfig
