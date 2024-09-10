/**
 * 字符串封装处理的一些方法定义
 * @author  yangyp
 */
       
export default  {
    //字符串非空
    isNotEmptyStr:function(str){
        if(str != "" && str != undefined){
            return true;
        }else{
            return false;
        }
    },
    //字符串是空
    isEmptyStr:function(str){
        if(str == "" || str == undefined){
            return true;
        }else{
            return false;
        }
    },
    //计算字符串长度
    strLen : function(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255 || str.charCodeAt(i) < 0) len += 2; else len ++;
        }
        return len;
    },
   

    //判断某个字符是否是汉字
    isCHS : function(str,i){
        if (str.charCodeAt(i) > 255 || str.charCodeAt(i) < 0) 
            return true;
        else
            return false;
    },
    //截取字符串（从start字节到end字节）
    subCHString : function(passStr,start, end){
        var len = 0;
        var str = "";

        //将字符串拆成字符，并存到数组中
        var chars = new Array();
        for (var i = 0; i < passStr.length; i++){
            chars[i] = [passStr.substr(i, 1), this.isCHS(passStr,i)];
        }

        for (var i = 0; i < passStr.length; i++) {
            if(chars[i][1])
                len += 2;
            else
                len++;
            if (end < len)
                return str;
            else if (start < len)
                str += chars[i][0];
        }
        return str;
    },
    //截取字符串（从start字节截取length个字节）
    subCHStr : function(str,start, length){
        return this.subCHString(str,start, start + length);
    },
    getFirstName :function(fullname) {    
        let hyphenated = ['欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫', '万俟', '闻人',
                        '夏侯', '诸葛', '尉迟', '公羊', '赫连', '澹台', '皇甫', '宗政', '濮阳', '公冶',
                        '太叔', '申屠', '公孙', '慕容', '仲孙', '钟离', '长孙', '宇文', '城池', '司徒', 
                        '鲜于', '司空', '汝嫣', '闾丘', '子车', '亓官', '司寇', '巫马', '公西', '颛孙',
                        '壤驷', '公良', '漆雕', '乐正', '宰父', '谷梁', '拓跋', '夹谷', '轩辕', '令狐', 
                        '段干', '百里', '呼延', '东郭', '南门', '羊舌', '微生', '公户', '公玉', '公仪',
                        '梁丘', '公仲', '公上', '公门', '公山', '公坚', '左丘', '公伯', '西门', '公祖',
                        '第五', '公乘', '贯丘', '公皙', '南荣', '东里', '东宫', '仲长', '子书', '子桑', 
                        '即墨', '达奚', '褚师']; 
        let hyset = new Set(hyphenated);
        let vLength = fullname.length;   
        // 前为姓,后为名  
        let lastname = '', firstname = '';
        if (vLength > 2){    
            var preTwoWords = fullname.substr(0, 2);
            // 取命名的前两个字,看是否在复姓库中    
            if (hyset.has(preTwoWords)){    
                firstname = preTwoWords;    
                lastname = fullname.substr(2);    
            }else{    
                firstname = fullname.substr(0, 1);    
                lastname = fullname.substr(1);    
            }    
        }else if (vLength === 2){
            // 全名只有两个字时,以前一个为姓,后一下为名    
            firstname = fullname.substr(0, 1);    
            lastname = fullname.substr(1);    
        }else{    
            firstname = fullname;    
        }    
        return [firstname, lastname];    
    }
}
