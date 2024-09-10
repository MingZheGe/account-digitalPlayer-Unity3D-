<template>
<div>
  <el-row :gutter="20">
    <el-col :span="8" v-for="(item, index) in tableData" :key="index">
      <el-card>
        <div>
          <p style="margin-bottom:10px"><strong>证件类型:</strong> {{ item.idType }}</p>
          <p style="margin-bottom:10px"><strong>证件号码:</strong> {{ item.idCode }}</p>
          <p style="margin-bottom:10px"><strong>姓名:</strong> {{ item.userName }}</p>
          <p style="margin-bottom:10px"><strong>手机号码:</strong> {{ item.mobileTel }}</p>
          <p style="margin-bottom:10px"><strong>邮箱:</strong> {{ item.email }}</p>
          <p style="margin-bottom:10px"><strong>联系地址:</strong> {{ item.address }}</p>
          <p style="margin-bottom:10px"><strong>证券账户编号:</strong> {{ item.stkId }}</p>
          <p style="margin-bottom:10px"><strong>银行卡号:</strong> {{ item.cardId }}</p>
          <p style="margin-bottom:10px"><strong>存管银行:</strong> {{ item.bank }}</p>
          <p style="margin-bottom:10px"><strong>交易密码:</strong> {{ item.tradePd }}</p>
          <p style="margin-bottom:10px"><strong>资金密码:</strong> {{ item.acctPd }}</p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</div>

</template>

<script>
//import {uploadShow} from '../util/connect'
export default {
    props: {
        nextClick: Number
    },
    mounted(){
      wife.doAction("伸右手说话")

      let signSucc = new Audio()
     signSucc.src = require("../asset/video/15.wav")
     signSucc.play()

    },
// data() {
//   return {
//     tableData: [
//       {
//         idType: "身份证",
//         idCode: "1234567890",
//         userName: "张三",
//         mobileTel: "13800138000",
//         email: "zhangsan@example.com",
//         address: "北京市朝阳区",
//         stks: ["账户1", "账户2"],
//         stkId: "0001",
//         cardId: "6222021234567890",
//         bank: "中国银行",
//         tradePd: "123456",
//         acctPd: "654321"
//       },
//       // 你可以在这里添加更多数据
//     ]
//   };
// },


data() {
return {
  tableData: [{
      idType: "身份证",
      idCode: "210104200303060016",
      userName: "范思扬",
      mobileTel: "13909839702",
      email: "zhangsan@example.com",
      address: "北京市朝阳区",
      stkId: "0001",
      cardId: "6222021234567890",
      bank: "中信存管",
      tradePd: "123456",
      acctPd: "123456"
    }]
};
},
created() {
// 假设你已经有了userId，这里使用假设的值
const userId = '757397fbbeb944e392817748a809580b';

// 调用fetchData方法，并传递userId参数
this.fetchData(userId);

},
methods: {
fetchData(userId) {
  console.log("wcnmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
  let result = uploadShow(userId);
 result.then((a)=>{
    console.log(a)

  var temp={
      idType: "身份证",
      idCode: "220381200307142612",
      userName: "葛铭哲",
      mobileTel: "15242619895",
      email: "3051463327@qq.com",
      address: "吉林省公主岭市",
      stkId: "0001",
      cardId: "6222021234567890",
      bank: "中信存管",
      tradePd: "123456",
      acctPd: "123456"
    }

    this.tableData[0]=a
    alert(this.tableData[0].idType)
    // this.tableData.idType = a.idType;
    // this.tableData.idCode = a.idCode;
    // this.tableData.userName = a.userName;
    // this.tableData.mobileTel = a.mobileTel;
    // this.tableData.email = a.email;
    // this.tableData.address = a.address;
    // this.tableData.stks = a.stks;
    // this.tableData.stkId = a.stkId;
    // this.tableData.cardId = a.cardId;
    // this.tableData.bank = a.bank;
    // this.tableData.tradePd = a.tradePd;// 假设你的API返回类似当前tableData结构的数据数组

  });
  console.log(uploadShow("757397fbbeb944e392817748a809580b"));
// axios.post('https://localhost:8089/upload/show',{ userId })
//   .then(response => {
//     this.tableData.idType = response.data.idType;
//     this.tableData.idCode = response.data.idCode;
//     this.tableData.userName = response.data.userName;
//     this.tableData.mobileTel = response.data.mobileTel;
//     this.tableData.email = response.data.email;
//     this.tableData.address = response.data.address;
//     this.tableData.stks = response.data.stks;
//     this.tableData.stkId = response.data.stkId;
//     this.tableData.cardId = response.data.cardId;
//     this.tableData.bank = response.data.bank;
//     this.tableData.tradePd = response.data.tradePd;// 假设你的API返回类似当前tableData结构的数据数组
//   })
//   .catch(error => {
//     console.error('获取数据时出错：', error);
//   });
},






// sayHello() {
//   console.log("你好");
//   this.fetchData("757397fbbeb944e392817748a809580b");
// },
// sayGoodbye() {
//   console.log("再见");
// }
},

watch: {
        nextClick: {
            handler(newVal, oldVal) {
                this.$emit('approve', 'ok')
            },
            deep: true
        }
    }

}
;
</script>



<style scoped>
button {
margin: 10px;
}

.el-card {
margin: 20px 0;
width:50vw;
height:70vh;
background: transparent;
font-size: 30px;
color:white;
}
</style>




