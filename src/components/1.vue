<template>
        <div style="margin-top: 200px;">
                    <!-- 添加标题，绝对定位到左上角 -->
                    <div style="position:static; top: 100px; left: 0; margin: 50px;font-size:25px;">
                        <i class="el-icon-s-promotion"></i>
                        身份证件信息
                    </div>
                    <!-- 在这里添加一个空行 -->
                    <div style="height: 2rem;"></div>

                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">

                       
                            <!-- 假设每个表单项的标签宽度为100px -->
                                  

                            <el-form-item label="姓名" label-width="150px" prop="name" style="width: 500px;">
                                <el-input class="cyberpunk"  v-model="ruleForm.name" style="flex: 1;" ></el-input>
                            </el-form-item>
                            
                            <el-form-item label="简称" label-width="150px" prop="nickname" style="width: 500px;">
                                <el-input class="cyberpunk" v-model="ruleForm.nickname" style="flex: 1;"></el-input>
                            </el-form-item>
                       

                            <el-form-item label="证件类型" label-width="150px" prop="IDtype" >
                                <el-select class="cyberpunk" v-model="ruleForm.IDtype" style="width: 350px;" placeholder="请选择证件类型">
                                    <el-option label="居民身份证" value="jumin"></el-option>
                                    <el-option label="临时身份证" value="gangao"></el-option>
                                    <el-option label="护照" value="huzhao"></el-option>
                                    <el-option label="香港居民通行证" value="hktong"></el-option>
                                    <el-option label="澳门居民通行证" value="aomentong"></el-option>
                                    <el-option label="台湾居民通行证" value="taiwantong"></el-option>
                                    <el-option label="外国人永久居住证" value="foreign"></el-option>
                                    <el-option label="香港居民身份证" value="hkshenfen"></el-option>
                                    <el-option label="澳门居民身份证" value="aomenshenfen"></el-option>
                                    <el-option label="台湾居民身份证" value="taiwanshenfen"></el-option>
                                    <el-option label="港澳台居民居住证" value="gangaotai"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="证件号码" label-width="150px" prop="IDnum" style="width: 500px;">
                                <el-input class="cyberpunk" v-model="ruleForm.IDnum" readonly style="flex: 1;"
                                    placeholder="请输入证件号码"></el-input>
                            </el-form-item>
                        
                        
                            <el-form-item label="证件开始日期" label-width="150px" required >
                                <el-form-item prop="date1">
                                    <el-input class="cyberpunk"  style="width: 350px;" placeholder="选择日期" 
                                     :value="formattedDate1" 
                                    @input="ruleForm.date1 = $event.target.value">>
                                    </el-input>
                                </el-form-item>

                            </el-form-item>

                            <el-form-item label="证件结束日期" label-width="150px" required>
                                <el-form-item prop="date2">
                                    <el-input class="cyberpunk" style="width: 350px;" placeholder="选择日期" 
                                    :value="formattedDate2" 
                                    @input="ruleForm.date2 = $event.target.value">> >
                                </el-input>
                                </el-form-item>

                            </el-form-item>
                       

                        <el-form-item label="证件地址" label-width="150px" prop="IDaddr" style="width: 500px;">
                            <el-input class="cyberpunk" v-model="ruleForm.IDaddr" placeholder="请输入证件地址" ></el-input>
                        </el-form-item>

                        
                            <el-form-item label="出生日期" label-width="150px" required >

                                <el-form-item prop="date3">
                                    <el-input class="cyberpunk" style="width: 350px;" placeholder="选择日期" 
                                    :value="formattedDate3" 
                                    @input="ruleForm.date3 = $event.target.value">>>
                                </el-input>
                                </el-form-item>
                            </el-form-item>

                            <el-form-item label="性别" label-width="150px" prop="sex" >
                                <el-select class="cyberpunk" v-model="ruleForm.sex" style="width: 350px;">
                                    <el-option label="男" value="nan"></el-option>
                                    <el-option label="女" value="nv"></el-option>
                                </el-select>
                            </el-form-item>
                    
                    </el-form>
                </div>
</template>
 
 
<script>
import useStore from '@/config/store'
import axios from 'axios';
import {documentUpload,documentGet} from '../util/connect'
export default {
    props: {
        nextClick: Number
    },
    data() {
        return {
            store: '',
            ruleForm: {
                name: '王大锤',
                nickname: '',
                IDtype: 'jumin',
                IDnum: '371728200308051396',
                date1: '',
                date2: '',
                IDaddr: '',
                date3: '',
                sex: ''

            },
            isLongTerm: false,
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                nickname: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],

                IDtype: [
                    { required: true, message: '请选择证件类型', trigger: 'change' }
                ],
                IDnum: [
                    { required: true, message: '请输入证件号码', trigger: 'blur' }
                ],
                date1: [
                    { required: true, message: '请选择日期', trigger: 'blur' }
                ],
                date2: [
                    { required: true,message:'请选择日期', trigger: 'blur' }
                ],
                IDaddr: [
                    { required: true, message: '请输入证件地址', trigger: 'blur' }
                ],
                date3: [
                    { required: true, message: '请选择日期', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '必填', trigger: 'change' }
                ]

            }
        };
    },
    computed: {
  formattedDate1() {
    const year = this.ruleForm.date1.substring(0, 4);
    const month = this.ruleForm.date1.substring(4, 6);
    const day = this.ruleForm.date1.substring(6, 8);
    return `${year}年${month}月${day}日`;
  },
  formattedDate2() {
    const year = this.ruleForm.date2.substring(0, 4);
    const month = this.ruleForm.date2.substring(4, 6);
    const day = this.ruleForm.date2.substring(6, 8);
    return `${year}年${month}月${day}日`;
  },
  formattedDate3() {
    const year = this.ruleForm.date3.substring(0, 4);
    const month = this.ruleForm.date3.substring(4, 6);
    const day = this.ruleForm.date3.substring(6, 8);
    return `${year}年${month}月${day}日`;
  }
},
    mounted() {
       // documentGet(localStorage.getItem("UserId"))
        
        this.store = useStore()
        this.ruleForm.name = this.store.cardData.Name
       // this.ruleForm.IDtype = this.store.cardData.IDType
        this.ruleForm.IDnum = this.store.cardData.IDCardNo
        this.ruleForm.date1 = this.store.cardData.UserLifeBegin
        this.ruleForm.date2 = this.store.cardData.UserLifeEnd
        this.ruleForm.IDaddr = this.store.cardData.Address
        this.ruleForm.date3 = this.store.cardData.Born
        this.ruleForm.sex = this.store.cardData.Sex
        wife.doAction("伸右手说话");
        let signSucc = new Audio()
        signSucc.src = require("../asset/video/1.wav")
        signSucc.play()

    },

    methods: {
        submitForm(formName) {
            console.log(this.ruleForm)
            this.$refs[formName].validate((valid) => {
                console.log(formName)
                console.log(valid)
               // documentUpload("1","葛","1",localStorage.getItem("UserId"))
               this.$emit('approve', 'ok')
                if (valid) {
                   
             /*   
const connect = {
  eroll: (ref) => {
    const url = 'http://192.168.7.171:8089/document/upload';
    const data = {
      userId: "4",
      userType: "1",
      userState: "1",
      idAddress: "1",
      idBeginDate: this.ruleForm.date1,
      idExpDate:  this.ruleForm.date2,
      idType: this.ruleForm.IDtype,
      idCode: "1",
      userName: this.ruleForm.name

    }
    return axios.post(url, data);
  },
}
connect.eroll()
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
  
*/



                    this.$emit('approve', 'ok')
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

    },
    watch: {
        nextClick: {
            handler(newVal, oldVal) {
                this.submitForm('ruleForm')

            },
            deep: true
        }
    }

}

</script>
<style >
.cyberpunk {
  padding: 5px;
  position: relative;
  font-size: 1.2rem;
  color: var(--yellow-color);
  border: 30px solid var(--yellow-color);
  border-right: 5px solid var(--yellow-color);
  border-left: 5px solid var(--yellow-color);
  border-bottom: 24px solid var(--yellow-color);
  background-color: #000;
  clip-path: polygon(0px 25px, 26px 0px, calc(60% - 25px) 0px, 60% 10px, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) calc(100% - 10px), calc(80% - 30px) calc(100% - 10px), calc(80% - 35px) 100%, 80px calc(100% - 0px), 65px calc(100% - 15px), 0% calc(100% - 15px));

  }
.cyberpunk.inverse {
  border: none;
  padding: 40px 15px 30px;
  color: #000;
  background-color: var(--yellow-color);
  border-right: 2px solid var(--border-color);
}
.el-form-item__label{
    color: aqua;
}
</style>