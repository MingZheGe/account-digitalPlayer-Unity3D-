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
                <div style="width:80vw;height: 70vh;background-color: aqua;border: 3px solid #000000;">


                    <form1 v-if="this.active === 0" />
                    <form2 v-if="this.active === 1" />
                    <form3 v-if="this.active === 2" />
                    <form4 v-if="this.active === 3" />
                    <questionire v-if="this.active === 4" />
                    <questionireResult v-if="this.active === 5" />
                    <stockAccount v-if="this.active === 6" />
                    <bank v-if="this.active === 7" />
                    <videooo v-if="this.active === 8" />
                    <photoIDcard v-if="this.active === 9" />
                    <deal v-if="this.active === 10" />
                    <makeSure v-if="this.active === 11" />
                    <setPassword v-if="this.active === 12" />

                </div>
                <div style="position: absolute; top:90%; left: 60%;">
                    <button @click="next" id="tech">下一步</button>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>
  
<style>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}

#tech,
#tech::after {
    width: 100px;
    height: 40px;
    font-size: 10px;
    background: linear-gradient(45deg, transparent 5%, #FF013C 5%);
    border: 0;
    color: #fff;
    letter-spacing: 3px;
    line-height: 18px;
    box-shadow: 6px 0px 0px #00E6F6;
    outline: transparent;
    position: relative;
    bottom: 0;

}

#tech::after {
    --slice-0: inset(50% 50% 50% 50%);
    --slice-1: inset(80% -6px 0 0);
    --slice-2: inset(50% -6px 30% 0);
    --slice-3: inset(10% -6px 85% 0);
    --slice-4: inset(40% -6px 43% 0);
    --slice-5: inset(80% -6px 5% 0);
    content: '下一步';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    background: linear-gradient(45deg, transparent 3%, #00E6F6 3%, #00E6F6 5%, #FF013C 5%);
    text-shadow: -3px -3px 0px #F8F005, 3px 3px 0px #00E6F6;
    clip-path: var(--slice-0);
    animation: 5s glitch infinite;
    animation-timing-function: steps(2, end);
}

/*
#tech:hover::after {
  animation: 1s glitch2;
  animation-timing-function: steps(2, end);
}
  */

@keyframes glitch {
    0% {
        clip-path: var(--slice-1);
        transform: translate(-20px, -10px);
    }

    2% {
        clip-path: var(--slice-3);
        transform: translate(10px, 10px);
    }

    4% {
        clip-path: var(--slice-1);
        transform: translate(-10px, 10px);
    }

    6% {
        clip-path: var(--slice-3);
        transform: translate(0px, 5px);
    }

    8% {
        clip-path: var(--slice-2);
        transform: translate(-5px, 0px);
    }

    10% {
        clip-path: var(--slice-3);
        transform: translate(5px, 0px);
    }

    12% {
        clip-path: var(--slice-4);
        transform: translate(5px, 10px);
    }

    14% {
        clip-path: var(--slice-2);
        transform: translate(-10px, 10px);
    }

    16% {
        clip-path: var(--slice-5);
        transform: translate(20px, -10px);
    }

    18% {
        clip-path: var(--slice-1);
        transform: translate(-10px, 0px);
    }

    20% {
        clip-path: var(--slice-1);
        transform: translate(0);
    }
}
</style>
  

<script>
import form1 from '../components/1.vue';//证件信息
import form2 from '../components/2.vue';//基本信息
import form3 from '../components/3.vue';//联系信息
import form4 from '../components/4.vue';//关联人信息
import questionire from '../components/5.vue';//风险测评答题
import questionireResult from '../components/6.vue';//风险测评结果
import stockAccount from '../components/7.vue';//开立证券账户
import bank from '../components/8.vue';//存管银行签约
import videooo from '../components/9.vue';//视频录入
import photoIDcard from '../components/10.vue';//证件采集
import deal from '../components/11.vue';//协议签署
import makeSure from '../components/12.vue';//业务提交
import setPassword from '../components/13.vue';//设置交易账户密码
export default {
    components: {
        questionire,
        form1,
        form2,
        form3,
        form4,
        questionireResult,
        stockAccount,
        bank,
        setPassword,
        videooo,
        photoIDcard,
        deal,
        makeSure
    },
    mounted() {

    },
    data() {
        return {
            active: 0
        };
    },

    methods: {
        next() {
            console.log(this.active)
            if (this.active++ > 12) this.active = 0;

        }
    }
}
</script>









