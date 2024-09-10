<template>
    <el-container style="height: 100vh; solid #eee">
        <el-aside width="15vw" style="background-color: #545c64;padding: 10px">
            <el-steps :active="active" direction="vertical" finish-status="success">
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
            <el-main>
<!--这里是需要复用的，这一个div-->
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
                                <el-input v-model="ruleForm.name" style="flex: 1;"></el-input>
                            </el-form-item>
                            
                            <el-form-item label="简称" label-width="150px" prop="nickname" style="width: 500px;">
                                <el-input v-model="ruleForm.nickname" style="flex: 1;"></el-input>
                            </el-form-item>
                       

                            <el-form-item label="证件类型" label-width="150px" prop="IDtype" >
                                <el-select v-model="ruleForm.IDtype" style="width: 350px;" placeholder="请选择证件类型">
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
                                <el-input v-model="ruleForm.IDnum" readonly style="flex: 1;"
                                    placeholder="请输入证件号码"></el-input>
                            </el-form-item>
                        
                        
                            <el-form-item label="证件开始日期" label-width="150px" required >
                                <el-form-item prop="date1">
                                    <el-input  style="width: 350px;" placeholder="选择日期" 
                                     :value="formattedDate1" 
                                    @input="ruleForm.date1 = $event.target.value">>
                                    </el-input>
                                </el-form-item>

                            </el-form-item>

                            <el-form-item label="证件结束日期" label-width="150px" required>
                                <el-form-item prop="date2">
                                    <el-input style="width: 350px;" placeholder="选择日期" 
                                    :value="formattedDate2" 
                                    @input="ruleForm.date2 = $event.target.value">> >
                                </el-input>
                                </el-form-item>

                            </el-form-item>
                       

                        <el-form-item label="证件地址" label-width="150px" prop="IDaddr" style="width: 500px;">
                            <el-input v-model="ruleForm.IDaddr" placeholder="请输入证件地址" ></el-input>
                        </el-form-item>

                        
                            <el-form-item label="出生日期" label-width="150px" required >

                                <el-form-item prop="date3">
                                    <el-input style="width: 350px;" placeholder="选择日期" 
                                    :value="formattedDate3" 
                                    @input="ruleForm.date3 = $event.target.value">>>
                                </el-input>
                                </el-form-item>
                            </el-form-item>

                            <el-form-item label="性别" label-width="150px" prop="sex" >
                                <el-select v-model="ruleForm.sex" style="width: 350px;">
                                    <el-option label="男" value="nan"></el-option>
                                    <el-option label="女" value="nv"></el-option>
                                </el-select>
                            </el-form-item>
                        


                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>

                        </el-form-item>



                    </el-form>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>
 




  
 
<script>
import useStore from '@/config/store'
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
//         const connect = {
//   eroll: (ref) => {
//     const url = 'http://10.110.4.0:8089/document/upload';
//     const data = {
//   "userId": "2115155151",
//   "userType": "2",
//   "userState": "1",
//   "idAddress": "12152",
//   "idBeginDate": "124412",
//   "idExpDate": "155212",
//   "idType": "1",
//   "idCode": "12121215152",
//   "userName": "121151"
// }
//     return axios.post(url, data);
//   },
// }
// connect.eroll()
//   .then((res) => {
//     console.log(res.data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
        this.store = useStore()
        this.ruleForm.name = this.store.cardData.Name
        this.ruleForm.IDnum = this.store.cardData.IDCardNo
        this.ruleForm.date1 = this.store.cardData.UserLifeBegin
        this.ruleForm.date2 = this.store.cardData.UserLifeEnd
        this.ruleForm.IDaddr = this.store.cardData.Address
        this.ruleForm.date3 = this.store.cardData.Born
        this.ruleForm.sex = this.store.cardData.Sex



    },
   

    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                    //  this.$emit('approve', 'ok')
                    const connect = {
  eroll: (ref) => {
    const url = 'http://10.110.4.0:8089/document/upload';
    const data = {
  "userId": "21",
  "userType": "21",
  "userState": "1212",
  "idAddress": "1212",
  "idBeginDate": "1212",
  "idExpDate": "1212",
  "idType": "1",
  "idCode": "12121212",
  "userName": "121"
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
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
        // validateDate2(rule, value, callback) {
        //     if (!this.isLongTerm && !value) {
        //         callback(new Error('请选择日期'));
        //     } else {
        //         callback();
        //     }
        // }
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