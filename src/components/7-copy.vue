<template>
    <el-container style="height: 100vh; solid #eee">
        <el-aside width="15vw" style="background-color: #545c64;padding: 10px">
            <el-steps  direction="vertical" finish-status="success">
                <!--<el-step title="资料录入" icon="el-icon-edit"></el-step>-->
                <el-step title="资料录入证件信息"></el-step>
                <el-step title="资料录入基本信息"></el-step>
                <el-step title="资料录入联系信息"></el-step>
                <el-step title="资料录入关联人信息"></el-step>

                <!--<el-step title="风险测评" icon="el-icon-upload"></el-step>-->
                <el-step title="风险测评答题"></el-step>
                <el-step title="风险测评测评结果"></el-step>

                <!--<el-step title="账户信息" icon="el-icon-edit"></el-step>-->
                <el-step title="开立证券账户"></el-step>
                <el-step title="存管银行签约"></el-step>
                <el-step title="设置交易账户密码"></el-step>

                <el-step title="视频录入" icon="el-icon-picture"></el-step>
                <el-step title="证件采集" icon="el-icon-picture"></el-step>
                <el-step title="签署协议" icon="el-icon-picture"></el-step>
                <el-step title="业务提交" icon="el-icon-picture"></el-step>
            </el-steps>

        </el-aside>
        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>查看</el-dropdown-item>
                        <el-dropdown-item>新增</el-dropdown-item>
                        <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span>王小虎</span>
            </el-header>
<el-main ><div style="    font-family: sai;
    font-size: 60px;border-left: 10px dashed blue;
    margin: 2vh;    padding: 0vh 0vw;">请选择你要新增的市场</div><div><table style="font-family: sai;
    font-size: 30px; border: 1px solid rgb(0, 0, 0); border-radius: 5px; width: -webkit-fill-available; margin: 3% 2%; padding: 0% 2%;"><tbody id="page7tbody" style="display: flex; flex-direction: column;">

</tbody></table></div>
<button @click='next()'>下一步</button>
</el-main>

                   </el-container>
    </el-container>
    
</template>

<script>
import useStore from '@/config/store'
import axios from 'axios';
import $ from 'jquery'

const CryptoJS = require('crypto-js')
// AES对称加密
export function encryptionValue(value, key = 'NHWYYGMSNHWYYGMS', iv = 'NHWYYGMSNHWYYGMS') {
  value = value.toString() // 数字加密会报错，转成字符串
  // value = CryptoJS.enc.Utf8.parse(value)
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  // key = CryptoJS.enc.Latin1.parse(key)
  // iv = CryptoJS.enc.Latin1.parse(iv)
  const encrypted = CryptoJS.AES.encrypt(value, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString()
}

export function decryptionValue(value, key = 'NHWYYGMSNHWYYGMS', iv = 'NHWYYGMSNHWYYGMS') {
  // value = CryptoJS.enc.Utf8.parse(value)
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  // key = CryptoJS.enc.Latin1.parse(key)
  // iv = CryptoJS.enc.Latin1.parse(iv)
  const decrypt = CryptoJS.AES.decrypt(value, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return decrypt.toString(CryptoJS.enc.Utf8)
}

export default {
    mounted() {


["深A","沪A","京A/股转A","股转B","深基金","沪基金"].map((item,index)=>{
$('#page7tbody').append(`<div id="page7tr${index}" style="padding: 4% 0% 4% 0%; ${index==5?"":"border-bottom: 1px dashed blue;"} display: flex; flex-direction: row; align-items: center;"><input id="page7tr${index}choose" type="radio" value="${index}" name="market" style="
    zoom: 2;
"><div style="padding: 0vh 1vw;text-align: justify;width: 18vw;display: inline-block;text-align-last: justify;text-wrap: nowrap;">${item}</div><button id="page7tr${index}button1" style="bottom: auto;right: auto;text-align: justify;text-wrap: nowrap;width: 15vw;margin: 0vh 2vw;font-family: sai;font-size: 25px;">新开证券账户</button><button id="page7tr${index}button2" disabled style="text-wrap: nowrap;bottom: auto;right: auto;text-align: justify;width: 15vw;margin: 0vh 2vw;font-family: sai;font-size: 25px;">使用已有账户</button><input id="page7tr${index}stk" value="" title="证券账户" disabled="disabled" style="text-wrap: nowrap;width: 15vw;font-family: sai;font-size: 25px;">
</div>
`)    
})


const API_BASE_URL='http://192.168.7.199:8081'
var data={
    userId:"1"
}
    
$.ajax({
    url:API_BASE_URL+'/security/get',
    type:"POST",
    contentType:"application/json",
     data:encryptionValue(JSON.stringify(data)),
    dataType:"json",
    success(res){
        
        if(res.code==='666'){
           
    localStorage.setItem("page7data",res.data);
    JSON.parse(decryptionValue(res.data)).stks.map((item,index)=>{
        var element = $(`#page7tr${item.stkMarket}`)
        if(element!==null){
            $(`#page7tr${item.stkMarket}button1`).attr("disabled","disabled");
            $(`#page7tr${item.stkMarket}button2`).removeAttr("disabled");
            $(`#page7tr${item.stkMarket}stk`).val(item.stkId);

        }

    })
}
    }

})
       


    },methods:{

 next(){
    const API_BASE_URL='http://192.168.7.199:8081'
var pam={
    userId:"1",
    stks:[]
}
var choose
[0,1,2,3,4,5].map((item,index)=>{
    choose=$(`#page7tr${item}choose`)
    if(choose.prop("checked")){
pam.stks.push({stkId:$(`#page7tr${choose.val()}stk`).val(),acctBind:"1",stkMarket:choose.val()})
    }
})
if(pam.stks.length>0){
$.ajax({
    url:API_BASE_URL+'/security/upload',
    type:"POST",
    data:encryptionValue(JSON.stringify(pam)),
    dataType:"json",
    contentType:"application/json",
    success(res){
        location.href="/#/8"
    }

})
}
else{
    alert("请您选择证券市场")
}

}

    }
}
</script>