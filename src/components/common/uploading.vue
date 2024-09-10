<template>
   <div class="uploading-wrap" >
       <div class="loading-icon"></div>
       <span>上传中</span>
   </div>
</template>
<script >
export default {
    data() {
        return {
            
        }
    },
    props: {
      
    },
    watch: {
       
    },
    mounted() {
        
    },
    methods: {
    
    }
}
</script>

<style lang="less" scoped>
.uploading-wrap{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.60);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    left: 0;
    top:0;
    .loading-icon{
        width: 100px;
        height: 100px;
        background: url('../../../src/icons/loadingIcon.png') no-repeat center;
        animation: rotation 1s infinite steps(10);
    }
    span{
        color: #fff;
        margin-top: 10px;
    }
}

@keyframes rotation {
    from {
        -webkit-transform: none;
        -ms-transform: none;
    }
    to {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
    }
}
</style>
