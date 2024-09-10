<template>
   
        <div class="progress">
            <img  src="../asset/image/loading.gif"/>
            <div><span>完成百分比:</span>
                <progress id="p" max=100></progress>
                <span id="span">0%</span>
                <p class="bar"></p>
            </div>
        </div>

</template>
<script>
import useStore from '@/config/store'

export default {
    data() {
        return {
            store: '',
            i: 0
        }
    },
    methods: {
        button_onclick() {
            let progressBar = document.getElementById('p');
            if (this.i < 100) {
                this.i++;
                progressBar.value = this.i;
                document.getElementById('span').innerHTML = this.i + "%";
            }
        }

    },
    created() {
        setInterval(this.button_onclick, 50)
    },
    mounted() {

    },
}
</script>

<style>
.progress {
    width: 420px;
    margin: 50px auto;
    text-align: center;
}

div {
    position: relative;
}

.bar {
    position: absolute;
    top: -14px;
    left: 154px;
    width: 30px;
    height: 16px;
    /*background-image: linear-gradient(-45deg, transparent, rgba(255, 255, 255, 0.8), transparent);*/
    animation: shadow 2s 5 normal linear forwards;
}

@keyframes shadow {
    0% {
        left: 154px;
    }

    100% {
        left: 313px;
    }
}

/* 修改进度条的颜色 */
progress {
    width: 50%;
    height: 10px;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 10px;
    /* 圆角 */
    overflow: hidden;
    /* 隐藏圆角外的部分 */
}

progress::-webkit-progress-bar {
    background-color: #564f4f5e;
}

progress::-webkit-progress-value {
    background: linear-gradient(15deg, #d8e400, #1000f0);
}

progress::-moz-progress-bar {
    background: linear-gradient(15deg, #d8e400, #1000f0);
}
</style>
