<template>
    <div @click="tioazhuan()" style="width: 100vw;height:100vh;">
        <div class="img1"></div>
        <div class="img2"></div>
        <div class="img3"></div>
        <div class="img4"></div>
    </div>
</template>

<!--http-server -p 8000 --cors 运行-->

<style>


/*先尝试4张图，一共3次动画，1个4秒，1.5s动画 2.5s展示*/
/*第一张图和最后一张是一个图，关键帧得三个帧*/
.img1 {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background: url(../asset/image/ad1.jpg);
    background-size: cover;
}

.img2 {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background: url(../asset/image/ad2.jpg);
    background-size: cover;
    -webkit-mask: url(../asset/image/AYJuRke.png);
    -webkit-mask-size: 3000% 100%;
    mask: url(../asset/image/AYJuRke.png);
    mask-size: 3000% 100%;
    animation: maskMove 12s steps(29) infinite;
    -webkit-animation: maskMove 12s steps(29) infinite;
}

.img3 {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background: url(../asset/image/ad3.jpg);
    background-size: cover;
    -webkit-mask: url(../asset/image/AYJuRke.png);
    -webkit-mask-size: 3000% 100%;
    mask: url(../asset/image/AYJuRke.png);
    mask-size: 3000% 100%;
    animation: maskMoveTest 12s steps(29) infinite;
    -webkit-animation: maskMoveTest 12s steps(29) infinite;
}

.img4 {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background: url(../asset/image/ad1.jpg);
    background-size: cover;
    -webkit-mask: url(../asset/image/AYJuRke.png);
    -webkit-mask-size: 3000% 100%;
    mask: url(../asset/image/AYJuRke.png);
    mask-size: 3000% 100%;
    animation: maskMoveTest2 12s steps(29) infinite;
    -webkit-animation: maskMoveTest2 12s steps(29) infinite;
}

/*
        @keyframes maskMove {
            from {
                mask-position: 0 0;
            }

            to {
                mask-position: 100% 0;
            }
        }

        @-webkit-keyframes maskMove {
            from {
                -webkit-mask-position: 0 0;
            }

            to {
                -webkit-mask-position: 100% 0;
            }
        }
        */
@keyframes maskMove {
    0% {
        mask-position: 0 0;
    }


    12.5% {
        mask-position: 100% 0;

    }


    33% {
        mask-position: 100% 0;
    }
}

@-webkit-keyframes maskMove {
    0% {
        mask-position: 0 0;
    }


    12.5% {
        mask-position: 100% 0;

    }


    33% {
        mask-position: 100% 0;
    }
}

@keyframes maskMoveTest {
    33% {
        mask-position: 0 0;
    }

    45.5% {
        mask-position: 100% 0;

    }

    66% {
        mask-position: 100% 0;
    }
}

@-webkit-keyframes maskMoveTest {
    33% {
        mask-position: 0 0;
    }

    45.5% {
        mask-position: 100% 0;

    }

    66% {
        mask-position: 100% 0;
    }
}

@keyframes maskMoveTest2 {
    66% {
        mask-position: 0 0;
    }

    78.5% {
        mask-position: 0 0;

    }


    99% {
        mask-position: 100% 0;
    }
}

@-webkit-keyframes maskMoveTest2 {
    66% {
        mask-position: 0 0;
    }

    78.5% {
        mask-position: 0 0;

    }


    99% {
        mask-position: 100% 0;
    }
}</style>

<script>
export default {
    methods:{
        tioazhuan(){
            this.$router.push({path:'/mainPage'})
        }
    }
}

</script>
