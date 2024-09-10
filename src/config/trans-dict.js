/**
 * 前端常见字段翻译
 *
 */
define(function (require, exports, module) {

    //格式化日期
    exports.formatDate = function (Date){
        Date = Date || "";
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(Date)){
            return Date;
        }else{
            switch(Date){
                case "":
                case "0":
                    return "";
                    break;
                case "30001231":
                    return "长期";
                    break;
                default:
                    return utils.formatDate(Date, "yyyy年MM月dd日");
                    break;
            }
        }
    }

    exports.transCitizenship = function(CITIZENSHIP){
        CITIZENSHIP = CITIZENSHIP || "";
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(CITIZENSHIP)){
            return CITIZENSHIP;
        }else{
            switch(CITIZENSHIP){
                case "ABW" :  CITIZENSHIP = "阿鲁巴";   break;
                case "AFG" :  CITIZENSHIP = "阿富汗";   break;
                case "AGO" :  CITIZENSHIP = "安哥拉";   break;
                case "AIA" :  CITIZENSHIP = "安圭拉";   break;
                case "ALB" :  CITIZENSHIP = "阿尔巴尼亚";   break;
                case "AND" :  CITIZENSHIP = "安道尔";   break;
                case "ANT" :  CITIZENSHIP = "荷属安的列斯";   break;
                case "ARE" :  CITIZENSHIP = "阿拉伯联合酋长国";   break;
                case "ARG" :  CITIZENSHIP = "阿根廷";   break;
                case "ARM" :  CITIZENSHIP = "亚美尼亚";   break;
                case "ASM" :  CITIZENSHIP = "美属萨摩亚";   break;
                case "ATA" :  CITIZENSHIP = "南极洲";   break;
                case "ATF" :  CITIZENSHIP = "法属南部领土";   break;
                case "ATG" :  CITIZENSHIP = "安提瓜和巴布达";   break;
                case "AUS" :  CITIZENSHIP = "澳大利亚";   break;
                case "AUT" :  CITIZENSHIP = "奥地利";   break;
                case "AZE" :  CITIZENSHIP = "阿塞拜疆";   break;
                case "BDI" :  CITIZENSHIP = "布隆迪";   break;
                case "BEL" :  CITIZENSHIP = "比利时";   break;
                case "BEN" :  CITIZENSHIP = "贝宁";   break;
                case "BFA" :  CITIZENSHIP = "布基纳法索";   break;
                case "BGD" :  CITIZENSHIP = "孟加拉国";   break;
                case "BGR" :  CITIZENSHIP = "保加利亚";   break;
                case "BHR" :  CITIZENSHIP = "巴林";   break;
                case "BHS" :  CITIZENSHIP = "巴哈马";   break;
                case "BIH" :  CITIZENSHIP = "波斯尼亚和黑塞哥维那";   break;
                case "BLR" :  CITIZENSHIP = "白俄罗斯";   break;
                case "BLZ" :  CITIZENSHIP = "伯利兹";   break;
                case "BMU" :  CITIZENSHIP = "百慕大";   break;
                case "BOL" :  CITIZENSHIP = "玻利维亚";   break;
                case "BRA" :  CITIZENSHIP = "巴西";   break;
                case "BRB" :  CITIZENSHIP = "巴巴多斯";   break;
                case "BRN" :  CITIZENSHIP = "文莱";   break;
                case "BTN" :  CITIZENSHIP = "不丹";   break;
                case "BVT" :  CITIZENSHIP = "布维岛";   break;
                case "BWA" :  CITIZENSHIP = "博茨瓦纳";   break;
                case "CAF" :  CITIZENSHIP = "中非";   break;
                case "CAN" :  CITIZENSHIP = "加拿大";   break;
                case "CCK" :  CITIZENSHIP = "科科斯(基林)群岛";   break;
                case "CHE" :  CITIZENSHIP = "瑞士";   break;
                case "CHL" :  CITIZENSHIP = "智利";   break;
                case "CHN" :  CITIZENSHIP = "中国";   break;
                case "CIV" :  CITIZENSHIP = "科特迪瓦";   break;
                case "CMR" :  CITIZENSHIP = "喀麦隆";   break;
                case "CNI" :  CITIZENSHIP = "海峡群岛";   break;
                case "COD" :  CITIZENSHIP = "刚果（金）";   break;
                case "COG" :  CITIZENSHIP = "刚果";   break;
                case "COK" :  CITIZENSHIP = "库克群岛";   break;
                case "COL" :  CITIZENSHIP = "哥伦比亚";   break;
                case "COM" :  CITIZENSHIP = "科摩罗";   break;
                case "CPV" :  CITIZENSHIP = "佛得角";   break;
                case "CRI" :  CITIZENSHIP = "哥斯达黎加";   break;
                case "CSR" :  CITIZENSHIP = "圣诞岛";   break;
                case "CTN" :  CITIZENSHIP = "中国台湾";   break;
                case "CUB" :  CITIZENSHIP = "古巴";   break;
                case "CYM" :  CITIZENSHIP = "开曼群岛";   break;
                case "CYP" :  CITIZENSHIP = "塞浦路斯";   break;
                case "CZE" :  CITIZENSHIP = "捷克";   break;
                case "DEU" :  CITIZENSHIP = "德国";   break;
                case "DJI" :  CITIZENSHIP = "吉布提";   break;
                case "DMA" :  CITIZENSHIP = "多米尼克";   break;
                case "DNK" :  CITIZENSHIP = "丹麦";   break;
                case "DOM" :  CITIZENSHIP = "多米尼加共和国";   break;
                case "DZA" :  CITIZENSHIP = "阿尔及利亚";   break;
                case "ECU" :  CITIZENSHIP = "厄瓜多尔";   break;
                case "EGY" :  CITIZENSHIP = "埃及";   break;
                case "ERI" :  CITIZENSHIP = "厄立特里亚";   break;
                case "ESH" :  CITIZENSHIP = "西撒哈拉";   break;
                case "ESP" :  CITIZENSHIP = "西班牙";   break;
                case "EST" :  CITIZENSHIP = "爱沙尼亚";   break;
                case "ETH" :  CITIZENSHIP = "埃塞俄比亚";   break;
                case "FIN" :  CITIZENSHIP = "芬兰";   break;
                case "FJI" :  CITIZENSHIP = "斐济";   break;
                case "FLK" :  CITIZENSHIP = "马尔维纳斯群岛(福克兰群岛)";   break;
                case "FRA" :  CITIZENSHIP = "法国";   break;
                case "FRO" :  CITIZENSHIP = "法罗群岛";   break;
                case "FSM" :  CITIZENSHIP = "密克罗尼西亚";   break;
                case "GAB" :  CITIZENSHIP = "加蓬";   break;
                case "GBR" :  CITIZENSHIP = "英国";   break;
                case "GEO" :  CITIZENSHIP = "格鲁吉亚";   break;
                case "GHA" :  CITIZENSHIP = "加纳";   break;
                case "GIB" :  CITIZENSHIP = "直布罗陀";   break;
                case "GIN" :  CITIZENSHIP = "几内亚";   break;
                case "GLP" :  CITIZENSHIP = "瓜德罗普";   break;
                case "GMB" :  CITIZENSHIP = "冈比亚";   break;
                case "GNB" :  CITIZENSHIP = "几内亚比绍";   break;
                case "GNQ" :  CITIZENSHIP = "赤道几内亚";   break;
                case "GRC" :  CITIZENSHIP = "希腊";   break;
                case "GRD" :  CITIZENSHIP = "格林纳达";   break;
                case "GRL" :  CITIZENSHIP = "格陵兰";   break;
                case "GTM" :  CITIZENSHIP = "危地马拉";   break;
                case "GUF" :  CITIZENSHIP = "法属圭亚那";   break;
                case "GUM" :  CITIZENSHIP = "关岛";   break;
                case "GUS" :  CITIZENSHIP = "格恩西";   break;
                case "GUY" :  CITIZENSHIP = "圭亚那";   break;
                case "HKG" :  CITIZENSHIP = "香港";   break;
                case "HMD" :  CITIZENSHIP = "赫德岛和麦克唐纳岛";   break;
                case "HND" :  CITIZENSHIP = "洪都拉斯";   break;
                case "HRV" :  CITIZENSHIP = "克罗地亚";   break;
                case "HTI" :  CITIZENSHIP = "海地";   break;
                case "HUN" :  CITIZENSHIP = "匈牙利";   break;
                case "IDN" :  CITIZENSHIP = "印度尼西亚";   break;
                case "IND" :  CITIZENSHIP = "印度";   break;
                case "INE" :  CITIZENSHIP = "尼维斯岛";   break;
                case "IOM" :  CITIZENSHIP = "马恩岛";   break;
                case "IOT" :  CITIZENSHIP = "英属印度洋领土";   break;
                case "IRL" :  CITIZENSHIP = "爱尔兰";   break;
                case "IRN" :  CITIZENSHIP = "伊朗";   break;
                case "IRQ" :  CITIZENSHIP = "伊拉克";   break;
                case "ISL" :  CITIZENSHIP = "冰岛";   break;
                case "ISR" :  CITIZENSHIP = "以色列";   break;
                case "ITA" :  CITIZENSHIP = "意大利";   break;
                case "JAM" :  CITIZENSHIP = "牙买加";   break;
                case "JOR" :  CITIZENSHIP = "约旦";   break;
                case "JPN" :  CITIZENSHIP = "日本";   break;
                case "JSY" :  CITIZENSHIP = "泽西";   break;
                case "KAZ" :  CITIZENSHIP = "哈萨克斯坦";   break;
                case "KEN" :  CITIZENSHIP = "肯尼亚";   break;
                case "KGZ" :  CITIZENSHIP = "吉尔吉斯斯坦";   break;
                case "KHM" :  CITIZENSHIP = "柬埔寨";   break;
                case "KIR" :  CITIZENSHIP = "基里巴斯";   break;
                case "KNA" :  CITIZENSHIP = "圣基茨和尼维斯";   break;
                case "KOR" :  CITIZENSHIP = "韩国";   break;
                case "KWT" :  CITIZENSHIP = "科威特";   break;
                case "LAO" :  CITIZENSHIP = "老挝";   break;
                case "LBN" :  CITIZENSHIP = "黎巴嫩";   break;
                case "LBR" :  CITIZENSHIP = "利比里亚";   break;
                case "LBY" :  CITIZENSHIP = "利比亚";   break;
                case "LCA" :  CITIZENSHIP = "圣卢西亚";   break;
                case "LIE" :  CITIZENSHIP = "列支敦士登";   break;
                case "LKA" :  CITIZENSHIP = "斯里兰卡";   break;
                case "LSO" :  CITIZENSHIP = "莱索托";   break;
                case "LTU" :  CITIZENSHIP = "立陶宛";   break;
                case "LUX" :  CITIZENSHIP = "卢森堡";   break;
                case "LVA" :  CITIZENSHIP = "拉脱维亚";   break;
                case "MAC" :  CITIZENSHIP = "澳门";   break;
                case "MAN" :  CITIZENSHIP = "曼岛";   break;
                case "MAR" :  CITIZENSHIP = "摩洛哥";   break;
                case "MCO" :  CITIZENSHIP = "摩纳哥";   break;
                case "MDA" :  CITIZENSHIP = "摩尔多瓦";   break;
                case "MDG" :  CITIZENSHIP = "马达加斯加";   break;
                case "MDV" :  CITIZENSHIP = "马尔代夫";   break;
                case "MEX" :  CITIZENSHIP = "墨西哥";   break;
                case "MHL" :  CITIZENSHIP = "马绍尔群岛";   break;
                case "MKD" :  CITIZENSHIP = "马斯顿";   break;
                case "MLI" :  CITIZENSHIP = "马里";   break;
                case "MLT" :  CITIZENSHIP = "马耳他";   break;
                case "MMR" :  CITIZENSHIP = "缅甸";   break;
                case "MNG" :  CITIZENSHIP = "蒙古";   break;
                case "MNP" :  CITIZENSHIP = "北马里亚纳";   break;
                case "MOZ" :  CITIZENSHIP = "莫桑比克";   break;
                case "MRT" :  CITIZENSHIP = "毛里塔尼亚";   break;
                case "MSR" :  CITIZENSHIP = "蒙特塞拉特";   break;
                case "MTQ" :  CITIZENSHIP = "马提尼克";   break;
                case "MUS" :  CITIZENSHIP = "毛里求斯";   break;
                case "MWI" :  CITIZENSHIP = "马拉维";   break;
                case "MYS" :  CITIZENSHIP = "马来西亚";   break;
                case "MYT" :  CITIZENSHIP = "马约特";   break;
                case "NAM" :  CITIZENSHIP = "纳米比亚";   break;
                case "NCL" :  CITIZENSHIP = "新喀里多尼亚";   break;
                case "NER" :  CITIZENSHIP = "尼日尔";   break;
                case "NFK" :  CITIZENSHIP = "诺福克岛";   break;
                case "NGA" :  CITIZENSHIP = "尼日利亚";   break;
                case "NIC" :  CITIZENSHIP = "尼加拉瓜";   break;
                case "NIU" :  CITIZENSHIP = "纽埃";   break;
                case "NLA" :  CITIZENSHIP = "荷兰属地";   break;
                case "NLD" :  CITIZENSHIP = "荷兰";   break;
                case "NOR" :  CITIZENSHIP = "挪威";   break;
                case "NPL" :  CITIZENSHIP = "尼泊尔";   break;
                case "NRU" :  CITIZENSHIP = "瑙鲁";   break;
                case "NZL" :  CITIZENSHIP = "新西兰";   break;
                case "OTH" :  CITIZENSHIP = "其他";   break;
                case "OWN" :  CITIZENSHIP = "阿曼";   break;
                case "PAK" :  CITIZENSHIP = "巴基斯坦";   break;
                case "PAN" :  CITIZENSHIP = "巴拿马";   break;
                case "PCN" :  CITIZENSHIP = "皮特凯恩群岛";   break;
                case "PER" :  CITIZENSHIP = "秘鲁";   break;
                case "PHL" :  CITIZENSHIP = "菲律宾";   break;
                case "PLW" :  CITIZENSHIP = "贝劳";   break;
                case "PNG" :  CITIZENSHIP = "巴布亚新几内亚";   break;
                case "POL" :  CITIZENSHIP = "波兰";   break;
                case "PRI" :  CITIZENSHIP = "波多黎各";   break;
                case "PRK" :  CITIZENSHIP = "朝鲜";   break;
                case "PRT" :  CITIZENSHIP = "葡萄牙";   break;
                case "PRY" :  CITIZENSHIP = "巴拉圭";   break;
                case "PST" :  CITIZENSHIP = "巴勒斯坦";   break;
                case "PYF" :  CITIZENSHIP = "法属波利尼西亚";   break;
                case "QAT" :  CITIZENSHIP = "卡塔尔";   break;
                case "REU" :  CITIZENSHIP = "留尼汪";   break;
                case "ROM" :  CITIZENSHIP = "罗马尼亚";   break;
                case "RUS" :  CITIZENSHIP = "俄罗斯";   break;
                case "RWA" :  CITIZENSHIP = "卢旺达";   break;
                case "SAU" :  CITIZENSHIP = "沙竺阿拉伯";   break;
                case "SDN" :  CITIZENSHIP = "苏丹";   break;
                case "SEN" :  CITIZENSHIP = "塞内加尔";   break;
                case "SGP" :  CITIZENSHIP = "新加坡";   break;
                case "SGS" :  CITIZENSHIP = "南乔治亚岛和南桑德韦奇岛";   break;
                case "SHN" :  CITIZENSHIP = "圣赫勒拿";   break;
                case "SJM" :  CITIZENSHIP = "斯瓦尔巴群岛";   break;
                case "SLB" :  CITIZENSHIP = "所罗门群岛";   break;
                case "SLE" :  CITIZENSHIP = "塞拉利昂";   break;
                case "SLV" :  CITIZENSHIP = "萨尔瓦多";   break;
                case "SMR" :  CITIZENSHIP = "圣马力诺";   break;
                case "SOM" :  CITIZENSHIP = "索马里";   break;
                case "SPM" :  CITIZENSHIP = "圣皮埃尔和密克隆";   break;
                case "STp" :  CITIZENSHIP = "圣多美和普林西比";   break;
                case "SUR" :  CITIZENSHIP = "苏里南";   break;
                case "SVK" :  CITIZENSHIP = "斯洛伐克";   break;
                case "SVN" :  CITIZENSHIP = "斯洛文尼亚";   break;
                case "SWE" :  CITIZENSHIP = "瑞典";   break;
                case "SWZ" :  CITIZENSHIP = "斯威士兰";   break;
                case "SYC" :  CITIZENSHIP = "塞舌尔";   break;
                case "SYR" :  CITIZENSHIP = "叙利亚";   break;
                case "TCA" :  CITIZENSHIP = "特克斯科斯群岛";   break;
                case "TCD" :  CITIZENSHIP = "乍得";   break;
                case "TGO" :  CITIZENSHIP = "多哥";   break;
                case "THA" :  CITIZENSHIP = "泰国";   break;
                case "TJK" :  CITIZENSHIP = "塔吉克斯坦";   break;
                case "TKL" :  CITIZENSHIP = "托克劳";   break;
                case "TKM" :  CITIZENSHIP = "土库曼斯坦";   break;
                case "TMP" :  CITIZENSHIP = "东帝汶";   break;
                case "TON" :  CITIZENSHIP = "汤加";   break;
                case "TTO" :  CITIZENSHIP = "特立尼达和多巴哥";   break;
                case "TUN" :  CITIZENSHIP = "突尼斯";   break;
                case "TUR" :  CITIZENSHIP = "土耳其";   break;
                case "TUV" :  CITIZENSHIP = "图瓦卢";   break;
                case "TZA" :  CITIZENSHIP = "坦桑尼亚";   break;
                case "UGA" :  CITIZENSHIP = "乌干达";   break;
                case "UKR" :  CITIZENSHIP = "乌克兰";   break;
                case "UMI" :  CITIZENSHIP = "美属太平洋各群岛";   break;
                case "URY" :  CITIZENSHIP = "乌拉圭";   break;
                case "USA" :  CITIZENSHIP = "美国";   break;
                case "UZB" :  CITIZENSHIP = "乌兹别克斯坦";   break;
                case "VAT" :  CITIZENSHIP = "梵蒂冈";   break;
                case "VCT" :  CITIZENSHIP = "圣文森特和格林纳丁斯";   break;
                case "VEN" :  CITIZENSHIP = "委内瑞拉";   break;
                case "VGB" :  CITIZENSHIP = "英属维尔京群岛";   break;
                case "VIR" :  CITIZENSHIP = "美属维尔京群岛";   break;
                case "VNM" :  CITIZENSHIP = "越南";   break;
                case "VUT" :  CITIZENSHIP = "瓦努阿图";   break;
                case "WLF" :  CITIZENSHIP = "瓦利斯和富图纳群岛";   break;
                case "WSM" :  CITIZENSHIP = "西萨摩亚";   break;
                case "YEM" :  CITIZENSHIP = "也门";   break;
                case "YUG" :  CITIZENSHIP = "南斯拉夫";   break;
                case "ZAF" :  CITIZENSHIP = "南非";   break;
                case "ZAR" :  CITIZENSHIP = "扎伊尔";   break;
                case "ZMB" :  CITIZENSHIP = "赞比亚";   break;
                case "ZWE" :  CITIZENSHIP = "津巴布韦";   break;
                default:      CITIZENSHIP = "中国";break;
            }
            return CITIZENSHIP;
        }
    }

    exports.transTRADE = function(TRADE){
        TRADE = TRADE || "";
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(TRADE)){
            return TRADE;
        }else{
            switch(TRADE){
                case "0" :  TRADE = "IT信息技术";   break;
                case "1" :  TRADE = "机械行业";   break;
                case "2" :  TRADE = "其它";   break;
                case "3" :  TRADE = "农业";   break;
                case "4" :  TRADE = "林业";   break;
                case "5" :  TRADE = "畜牧业";   break;
                case "6" :  TRADE = "渔业";   break;
                case "7" :  TRADE = "农、林、牧、渔服务业";   break;
                case "8" :  TRADE = "煤炭采选业";   break;
                case "9" :  TRADE = "石油和天然气开采业";   break;
                case "A" :  TRADE = "黑色金属冶炼及压延加工业";   break;
                case "B" :  TRADE = "有色金属冶炼及压延加工业";   break;
                case "C" :  TRADE = "金属制品业";   break;
                case "D" :  TRADE = "普通机械制造业";   break;
                case "E" :  TRADE = "专用设备制造业";   break;
                case "F" :  TRADE = "交通运输设备制造业";   break;
                case "G" :  TRADE = "电器机械及器材制造业";   break;
                case "H" :  TRADE = "仪器仪表及文化、办公用机械制造业";   break;
                case "I" :  TRADE = "医药制造业";   break;
                case "J" :  TRADE = "生物制品业";   break;
                case "K" :  TRADE = "娱乐服务业";   break;
                case "L" :  TRADE = "电力、蒸汽、热水的生产和供应业";   break;
                case "M" :  TRADE = "煤气生产和供应业";   break;
                case "N" :  TRADE = "自来水的生产和供应业";   break;
                case "O" :  TRADE = "土木工程建筑业";   break;
                case "P" :  TRADE = "装修装饰业";   break;
                case "Q" :  TRADE = "通信服务业";   break;
                case "R" :  TRADE = "公路运输业";   break;
                case "S" :  TRADE = "管道运输业";   break;
                case "T" :  TRADE = "水上运输业";   break;
                case "U" :  TRADE = "航空运输业";   break;
                case "V" :  TRADE = "交通运输辅助业";   break;
                case "W" :  TRADE = "信息传播服务业";   break;
                case "X" :  TRADE = "食品、饮料、烟草和家庭用品批发业";   break;
                case "Y" :  TRADE = "通信及相关设备制造业";   break;
                case "Z" :  TRADE = "计算机及相关设备制造业";   break;
                case "a" :  TRADE = "黑色金属矿采选业";   break;
                case "b" :  TRADE = "有色金属矿采选业";   break;
                case "c" :  TRADE = "非金属矿采选业";   break;
                case "d" :  TRADE = "零售业";   break;
                case "e" :  TRADE = "采掘服务业";   break;
                case "f" :  TRADE = "食品加工业";   break;
                case "g" :  TRADE = "食品制造业";   break;
                case "h" :  TRADE = "饮料制造业";   break;
                case "i" :  TRADE = "纺织业";   break;
                case "j" :  TRADE = "房地产开发与经营业";   break;
                case "k" :  TRADE = "皮革、毛皮、羽绒及制品制造业";   break;
                case "l" :  TRADE = "木材加工及竹、藤、棕、草制品业";   break;
                case "m" :  TRADE = "家具制造业";   break;
                case "n" :  TRADE = "造纸及纸制品业";   break;
                case "o" :  TRADE = "印刷业";   break;
                case "p" :  TRADE = "文教体育用品制造业";   break;
                case "q" :  TRADE = "石油加工及炼焦业";   break;
                case "r" :  TRADE = "化学原料及化学制品制造业";   break;
                case "s" :  TRADE = "化学纤维制造业";   break;
                case "t" :  TRADE = "橡胶制造业";   break
                case "u" :  TRADE = "塑料制造业";   break;
                case "v" :  TRADE = "电子元器件制造业";   break;
                case "w" :  TRADE = "日用电子器具制造业";   break;
                case "x" :  TRADE = "餐饮业";   break;
                case "y" :  TRADE = "电子设备修理业";   break;
                default:      TRADE = "非金属矿物制品业";break;
            }
            return TRADE;
        }
    }

    exports.transIdType = function (ID_TYPE){
        ID_TYPE = ID_TYPE || "";
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(ID_TYPE) ){
            return ID_TYPE;
        }else{
            switch(ID_TYPE){
                case "00":
                    ID_TYPE = "身份证";
                    break;
                case "01":
                    ID_TYPE = "护照号";
                    break;
                case "02":
                    ID_TYPE = "军官证";
                    break;
                case "03":
                    ID_TYPE = "士兵证";
                    break;
                case "04":
                    ID_TYPE = "回乡证";
                    break;
                case "0b":
                    ID_TYPE = "香港居民通行证";
                    break;
                case "0C":
                    ID_TYPE = "澳门居民通行证";
                    break;
                case "0i":
                    ID_TYPE = "香港居民身份证";
                    break;
                case "0j":
                    ID_TYPE = "澳门居民身份证";
                    break;
                case "0d":
                    ID_TYPE = "台湾居民通行证";
                    break;
	            case "0s":
		            ID_TYPE = "港澳台居民居住证";
		            break;    
                case "10":
                    ID_TYPE = "工商营业执照";
                    break;
                case "11":
                    ID_TYPE = "社团法人注册登记证书";
                    break;
                case "12":
                    ID_TYPE = "机关法人成立批文";
                    break;
                case "13":
                    ID_TYPE = "事业法人成立批文";
                    break;
                case "14":
                    ID_TYPE = "境外有效商业登记证明";
                    break;
                case "15":
                    ID_TYPE = "武警";
                    break;
                case "16":
                    ID_TYPE = "军队";
                    break;
                case "17":
                    ID_TYPE = "基金会";
                    break;
                case "18":
                    ID_TYPE = "技术监督局号码";
                    break;
                case "19":
                    ID_TYPE = "其它证件";
                    break;
                case "1A":
                    ID_TYPE = "组织机构代码证";
                    break;
                case "1B":
                    ID_TYPE = "税务登记证";
                    break;
                case "1Z":
                    ID_TYPE = "批文";
                    break
                case "2a":
                    ID_TYPE = "注册号";
                    break
                default:
                    ID_TYPE = "其他";
                    break;
            }
        }
        return ID_TYPE;
    }

    exports.transSex = function (sex){
        sex = sex || "";
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(sex) ){
            return sex;
        }
        if( "0" === sex){
            sex = "男";
        }else if("1" === sex){
            sex = "女";
        }else{
            sex = "其他";
        }
        return sex;
    }

    exports.transOccuType = function (position){
        position = position || "";
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(position)){
            return position;
        }
        if("01" == position){
            position = "文教科卫专业人员";
        }else if("02" == position){
            position = "党政机关干部";
        }else if("03" == position){
            position = "企事业单位干部";
        }else if("04" == position){
            position = "行政企事业单位工人";
        }else if("05" == position){
            position = "农民";
        }else if("06" == position){
            position = "个体";
        }else if("07" == position){
            position = "无业";
        }else if("08" == position){
            position = "军人";
        }else if("09" == position){
            position = "学生";
        }else if("0A" == position){
            position = "自由职业者";
        }else if("10" == position){
            position = "证券从业人员";
        }else if("11" == position){
            position = "离退休";
        }else{
            position = "其他";
        }
        return position;
    }

    exports.transEducation = function (education){
        education = education || ""
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(education)){
            return education;
        }
        if(education == "0"){
            education = "博士";
        }else if(education == "1"){
            education = "硕士";
        }else if(education == "2"){
            education = "本科";
        }else if(education == "3"){
            education = "大专";
        }else if(education == "4"){
            education = "中专";
        }else if(education == "5"){
            education = "高中";
        }else  if(education == "6"){
            education = "初中及以下";
        }else{
            education = "其他";
        }
        return education;
    }
    exports.transNatiAttr = function (NATIONAL_ATTR){
        education = NATIONAL_ATTR || ""
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(NATIONAL_ATTR)){
            return NATIONAL_ATTR;
        }
        //中登国有属性改造将其字典值进行调整
        if(NATIONAL_ATTR == "1"){
            //NATIONAL_ATTR = "国务院国资委管辖";
            NATIONAL_ATTR = "国有股东（SS）";
        }else if(NATIONAL_ATTR == "2"){
            //NATIONAL_ATTR = "地方国资委管辖";
            NATIONAL_ATTR = "国有实际控股股东（CS）";
        }else if(NATIONAL_ATTR == "3"){
            //NATIONAL_ATTR = "其他国有企业";
            NATIONAL_ATTR = "暂未分类的国有股东";
        }else if(NATIONAL_ATTR == "4"){
            //NATIONAL_ATTR = "非国有";
            NATIONAL_ATTR = "非国有或非国有实际控股股东";
        }
        return NATIONAL_ATTR;
    }

    //境内外身份INOUTSIDE_IDENTITY
    exports.transInoutsideIdentity = function (INOUTSIDE_IDENTITY){
        education = INOUTSIDE_IDENTITY || ""
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(INOUTSIDE_IDENTITY)){
            return INOUTSIDE_IDENTITY;
        }else if(INOUTSIDE_IDENTITY == "0"){
            INOUTSIDE_IDENTITY = "境内";
        }else if(INOUTSIDE_IDENTITY == "1"){
            INOUTSIDE_IDENTITY = "境外";
        }
        return INOUTSIDE_IDENTITY;
    }

    //法人类别LEGAL_REP_EXTYPE
    exports.transLegalRepType = function (LEGAL_REP_TYPE){
        education = LEGAL_REP_TYPE || ""
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(LEGAL_REP_TYPE)){
            return LEGAL_REP_TYPE;
        }else{
            switch (LEGAL_REP_TYPE){
                case "01":	LEGAL_REP_TYPE="一般机构法人";break;
                case "02":	LEGAL_REP_TYPE="特殊法人机构";break;
                case "03":	LEGAL_REP_TYPE="金融机构法人";break;
                case "04":	LEGAL_REP_TYPE="事业法人";break;
                case "05":	LEGAL_REP_TYPE="社团法人";break;
                case "06":	LEGAL_REP_TYPE="机关法人";break;
                case "07":	LEGAL_REP_TYPE="境外法人";break;
                case "08":	LEGAL_REP_TYPE="非法人机构";break;
                case "09":	LEGAL_REP_TYPE="非法人创投企业";break;
                case "88":	LEGAL_REP_TYPE="产品";break;
                default:	LEGAL_REP_TYPE="其它";break;
            }
        }
        return LEGAL_REP_TYPE;
    }

    //主体身份SUBJECT_IDENTITY
    exports.transSubjectIdentity = function (SUBJECT_IDENTITY){
        education = SUBJECT_IDENTITY || ""
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(SUBJECT_IDENTITY)){
            return SUBJECT_IDENTITY;
        }else{
            switch (SUBJECT_IDENTITY){
                case "0":	SUBJECT_IDENTITY = "普通";break;
                case "1":	SUBJECT_IDENTITY = "未成年";break;
                case "2":	SUBJECT_IDENTITY = "年长者";break;
                case "3":	SUBJECT_IDENTITY = "残疾人";break;
                case "4":	SUBJECT_IDENTITY = "员工";break;
                case "5":	SUBJECT_IDENTITY = "从业人员";break;
                case "6":	SUBJECT_IDENTITY = "境外战略投资者";break;
                case "7":	SUBJECT_IDENTITY = "合格境外投资者";break;
                case "8":	SUBJECT_IDENTITY = "私募基金";break;
                case "9":	SUBJECT_IDENTITY = "其他特殊参与市场的主体";break;
                default:	SUBJECT_IDENTITY ="其它";break;
            }
        }
        return SUBJECT_IDENTITY;
    }
    //机构类别SZORG_TYPE
    exports.transSzorgType = function (SZORG_TYPE){
        education = SZORG_TYPE || ""
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(SZORG_TYPE)){
            return SZORG_TYPE;
        }else{
            switch (SZORG_TYPE){
                case "01":	SZORG_TYPE="企业法人";break;
                case "02":	SZORG_TYPE="机关法人";break;
                case "03":	SZORG_TYPE="事业法人";break;
                case "04":	SZORG_TYPE="社团法人";break;
                case "05":	SZORG_TYPE="工会法人";break;
                case "09":	SZORG_TYPE="其他非金融机构法人";break;
                case "10":	SZORG_TYPE="证券公司";break;
                case "11":	SZORG_TYPE="银行";break;
                case "12":	SZORG_TYPE="信托投资公司";break;
                case "13":	SZORG_TYPE="基金管理公司";break;
                case "14":	SZORG_TYPE="保险公司";break;
                case "15":	SZORG_TYPE="做市商";break;
                case "19":	SZORG_TYPE="其他金融机构法人";break;
                case "21":	SZORG_TYPE="普通合伙企业";break;
                case "22":	SZORG_TYPE="特殊普通合伙企业";break;
                case "23":	SZORG_TYPE="有限合伙企业";break;
                case "24":	SZORG_TYPE="非法人非合伙制创投企业";break;
                case "25":	SZORG_TYPE="私募基金管理人(企业法人)";break;
                case "25a":SZORG_TYPE="私募基金管理人(合伙企业)";break;
                case "25b":SZORG_TYPE="私募基金管理人(特殊机构)";break;
                case "31":	SZORG_TYPE="境外一般机构";break;
                case "32":	SZORG_TYPE="境外代理人";break;
                case "33":	SZORG_TYPE="境外证券公司";break;
                case "34":	SZORG_TYPE="境外基金公司";break;
                case "41":	SZORG_TYPE="破产管理人";break;
                case "51":	SZORG_TYPE="中国金融期货交易所";break;
                case "52":	SZORG_TYPE="境外结算机构";break;
                case "61":	SZORG_TYPE="基金管理公司子公司";break;
                case "62":	SZORG_TYPE="财务公司";break;
                case "63":	SZORG_TYPE="证券公司子公司";break;
                case "64":	SZORG_TYPE="期货公司子公司";break;
                case "65":	SZORG_TYPE="产品";break;

                case "7A":	SZORG_TYPE="其他境内金融机构";break;
                case "7B":	SZORG_TYPE="非金融类非法人机构";break;
                case "7C":	SZORG_TYPE="境外金融机构";break;
                case "7D":	SZORG_TYPE="外国战略投资者";break;
                case "7E":	SZORG_TYPE="境外非金融机构";break;

                case "99":	SZORG_TYPE="其他";break;
                case "99a":SZORG_TYPE="境外机构战略投资者";break;
                case "99b":SZORG_TYPE="上市公司回购专用账户";break;

                case "QH":	SZORG_TYPE="期货公司";break;
                default:	SZORG_TYPE=SZORG_TYPE;break;
            }
        }
        return SZORG_TYPE;
    }

    exports.transListAtr = function (LISTED_ATTR){
        education = LISTED_ATTR || ""
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(LISTED_ATTR)){
            return LISTED_ATTR;
        }
        if(LISTED_ATTR == "1"){
            LISTED_ATTR = "上市";
        }else if(LISTED_ATTR == "2"){
            LISTED_ATTR = "非上市";
        }
        return LISTED_ATTR;
    }

    exports.transCapiAttr = function (CAPITAL_ATTR){
        education = CAPITAL_ATTR || ""
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(CAPITAL_ATTR)){
            return CAPITAL_ATTR;
        }
        if(CAPITAL_ATTR == "1"){
            CAPITAL_ATTR = "境内资本";
        }else if(CAPITAL_ATTR == "2"){
            CAPITAL_ATTR = "三资（合资、合作、外资）";
        }else if(CAPITAL_ATTR == "3"){
            CAPITAL_ATTR = "境外资本";
        }
        return CAPITAL_ATTR;
    }
    exports.transNationality = function (nationality){
        nationality = nationality || "";
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(nationality) ){
            return nationality;
        }else {
            switch (nationality) {
                case "00":
                    nationality = "汉族";
                    break;
                case "01":
                    nationality = "蒙古族";
                    break;
                case "02":
                    nationality = "回族";
                    break;
                case "03":
                    nationality = "藏族";
                    break;
                case "04":
                    nationality = "维吾尔族";
                    break;
                case "05":
                    nationality = "苗族";
                    break;
                case "06":
                    nationality = "彝族";
                    break;
                case "07":
                    nationality = "壮族";
                    break;
                case "08":
                    nationality = "布依族";
                    break;
                case "09":
                    nationality = "朝鲜族";
                    break;
                case "10":
                    nationality = "满族";
                    break;
                case "11":
                    nationality = "侗族";
                    break;
                case "12":
                    nationality = "瑶族";
                    break;
                case "13":
                    nationality = "白族";
                    break;
                case "14":
                    nationality = "土家族";
                    break;
                case "15":
                    nationality = "哈尼族";
                    break;
                case "16":
                    nationality = "哈萨克族";
                    break;
                case "17":
                    nationality = "傣族";
                    break;
                case "18":
                    nationality = "黎族";
                    break;
                case "19":
                    nationality = "傈僳族";
                    break;
                case "20":
                    nationality = "佤族";
                    break;
                case "21":
                    nationality = "畲族";
                    break;
                case "22":
                    nationality = "高山族";
                    break;
                case "23":
                    nationality = "拉祜族";
                    break;
                case "24":
                    nationality = "水族";
                    break;
                case "25":
                    nationality = "东乡族";
                    break;
                case "26":
                    nationality = "纳西族";
                    break;
                case "27":
                    nationality = "景颇族";
                    break;
                case "28":
                    nationality = "柯尔克孜族";
                    break;
                case "29":
                    nationality = "土族";
                    break;
                case "30":
                    nationality = "达斡尔族";
                    break;
                case "31":
                    nationality = "仫佬族";
                    break;
                case "32":
                    nationality = "羌族";
                    break;
                case "33":
                    nationality = "布朗族";
                    break;
                case "34":
                    nationality = "撒拉族";
                    break;
                case "35":
                    nationality = "毛南族";
                    break;
                case "36":
                    nationality = "仡佬族";
                    break;
                case "37":
                    nationality = "锡伯族";
                    break;
                case "38":
                    nationality = "阿昌族";
                    break;
                case "39":
                    nationality = "普米族";
                    break;
                case "40":
                    nationality = "塔吉克族";
                    break;
                case "41":
                    nationality = "怒族";
                    break;
                case "42":
                    nationality = "乌兹别克族";
                    break;
                case "43":
                    nationality = "俄罗斯族";
                    break;
                case "44":
                    nationality = "鄂温克族";
                    break;
                case "45":
                    nationality = "德昂族";
                    break;
                case "46":
                    nationality = "保安族";
                    break;
                case "47":
                    nationality = "裕固族";
                    break;
                case "48":
                    nationality = "京族";
                    break;
                case "49":
                    nationality = "塔塔尔族";
                    break;
                case "50":
                    nationality = "独龙族";
                    break;
                case "51":
                    nationality = "鄂伦春族";
                    break;
                case "52":
                    nationality = "赫哲族";
                    break;
                case "53":
                    nationality = "门巴族";
                    break;
                case "54":
                    nationality = "珞巴族";
                    break;
                case "55":
                    nationality = "基诺族";
                    break;
                default:
                    nationality = "其它";
                    break;

            }
            return nationality;
        }
    }

    // 产品户管理人资质类型
    exports.transProcductGlrzzType = function (PRO_GLRZZ_TYPE){
        PRO_GLRZZ_TYPE = PRO_GLRZZ_TYPE || ""
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(PRO_GLRZZ_TYPE)){
            return PRO_GLRZZ_TYPE;
        }else{
            switch (PRO_GLRZZ_TYPE){
                case "1":	PRO_GLRZZ_TYPE="证券公司资产管理";break;
                case "2":	PRO_GLRZZ_TYPE="基金管理公司(公募)";break;
                case "3":	PRO_GLRZZ_TYPE="私募基金管理公司";break;
                case "4":	PRO_GLRZZ_TYPE="商业银行";break;
                case "5":	PRO_GLRZZ_TYPE="信托投资公司";break;
                case "6":	PRO_GLRZZ_TYPE="期货公司";break;
                case "7":	PRO_GLRZZ_TYPE="保险公司";break;
                case "8":	PRO_GLRZZ_TYPE="其他";break;
            }
        }
        return PRO_GLRZZ_TYPE;
    }

    // 产品户托管人资质类型
    exports.transProcductTgrzzType = function (PRO_TGRZZ_TYPE){
        PRO_TGRZZ_TYPE = PRO_TGRZZ_TYPE || ""
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(PRO_TGRZZ_TYPE)){
            return PRO_TGRZZ_TYPE;
        }else{
            switch (PRO_TGRZZ_TYPE){
                case "1":	PRO_TGRZZ_TYPE="商业银行托管";break;
                case "2":	PRO_TGRZZ_TYPE="证券公司托管(公募)";break;
            }
        }
        return PRO_TGRZZ_TYPE;
    }

    // 产品户产品类别
    exports.transProcductType = function (PRO_TYPE){
        PRO_TYPE = PRO_TYPE || ""
        if(/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(PRO_TYPE)){
            return PRO_TYPE;
        }else{
            switch (PRO_TYPE){
                case "01":	PRO_TYPE="证券公司集合理财产品";break;
                case "02":	PRO_TYPE="证券公司专项资产管理计划";break;
                case "03":	PRO_TYPE="基金公司特定客户资产管理产品";break;
                case "04":	PRO_TYPE="基金公司特定客户资产管理产品（保险）";break;
                case "05":	PRO_TYPE="基金公司特定客户资产管理产品（信托）";break;
                case "06":	PRO_TYPE="封闭式证券投资基金";break;
                case "07":	PRO_TYPE="开放式证券投资基金";break;
                case "08":	PRO_TYPE="私募基金";break;
                case "09":	PRO_TYPE="其他证券投资基金";break;
                case "10":	PRO_TYPE="全国社保基金";break;
                case "11":	PRO_TYPE="地方社保基金";break;
                case "12":	PRO_TYPE="信托产品";break;
                case "13":	PRO_TYPE="保险产品";break;
                case "14":	PRO_TYPE="保险资产管理产品";break;
                case "15":	PRO_TYPE="期货资产管理产品(多客户)";break;
                case "16":	PRO_TYPE="期货资产管理产品（单一）";break;
                case "17":	PRO_TYPE="企业年金计划";break;
                case "18":	PRO_TYPE="QFII";break;
                case "19":	PRO_TYPE="RQFII";break;
                case "20":	PRO_TYPE="养老金产品";break;
                case "21":	PRO_TYPE="银行理财产品";break;
                case "22":	PRO_TYPE="上市公司员工持股计划";break;
                case "99":	PRO_TYPE="其他";break;
            }
        }
        return PRO_TYPE;
    }

});
