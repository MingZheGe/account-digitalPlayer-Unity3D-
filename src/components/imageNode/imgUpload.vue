<template>
    <div ref="imgUpload" class="upload-warp" @click="changeStatus" :class="[status == 1 ? 'fail' : '', hidden ? 'hidden' : '']">
        <div class="upload-btn">
            <div class="btn-icon">
                <img src="@icons/yinheVTM/imageNode/icon-upload.svg"/>
            </div>
            <div class="btn-text" :class="status == 1 ? 'fail' : ''">
                {{ text }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            text: "上传列表",
            status: 0,
            hidden: true
        }
    },
    mounted() {
        let that = this;
        let startX = 0, startY = 0, clientStartX = 0, clientStartY = 0, clientEndX = 0, clientEndY = 0;
        let pageH = document.getElementsByTagName('body')[0].clientHeight,
            pageW = document.getElementsByTagName('body')[0].clientWidth,
            uploadW = that.$refs.imgUpload.clientWidth + 2 * that.$refs.imgUpload.clientLeft,
            uploadH = that.$refs.imgUpload.clientHeight + 2 * that.$refs.imgUpload.clientTop;
        that.$refs.imgUpload.addEventListener('touchstart', (event) => {
            uploadW = that.$refs.imgUpload.clientWidth + 2 * that.$refs.imgUpload.clientLeft,
            uploadH = that.$refs.imgUpload.clientHeight + 2 * that.$refs.imgUpload.clientTop;
            // 开始 记录起始位置
            clientStartX = event.touches[0].clientX;
            clientStartY = event.touches[0].clientY;
            startX = event.currentTarget.offsetLeft;
            startY = event.currentTarget.offsetTop;
            // event.preventDefault()
        })
        that.$refs.imgUpload.addEventListener('touchmove', (event) => {
            // 过程中
            clientEndX = event.touches[0].clientX;
            clientEndY = event.touches[0].clientY;

            let x = clientEndX - clientStartX;
            let y = clientEndY - clientStartY;

            // 边界处理
            startX = startX + x;
            startY = startY + y;
            startX < 0 ? (startX = 0) : ""
            startX > (pageW - uploadW) ? (startX = pageW - uploadW) : ""
            startY < 0 ? (startY = 0) : ""
            startY > (pageH - uploadH) ? (startY = pageH - uploadH) : ""

            // 每隔300ms计算一次
            that.$refs.imgUpload.style.left = startX + "px";
            that.$refs.imgUpload.style.top = startY + "px";

            
            clientStartX = clientEndX;
            clientStartY = clientEndY;

            // event.preventDefault()
        })
    },
    methods: {
        changeStatus() {
            this.$emit('changeStatus')
        },
        changeUploadStatus(val) {
            if (val === false) {
                this.status = 1
                this.text = "上传失败"
            } else{
                this.status  =0
                this.text = "上传列表"
            }
        },
        changeBallStatus(val) {
            this.hidden = val;
        }
    }
}
</script>

<style lang="less">

.upload-warp {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 1812px;
    top: 484px;
    background: linear-gradient(320.94deg,#d8e5ff 0%,#f8fbff 100%);
    border: 5px solid;
    border-color: #ffffff;
    box-shadow: 0px 3px 8px rgba(12, 26, 98, 0.16);
    border-radius: 50%;
    z-index: 10000;
    &.fail {
        background: linear-gradient(318deg,#e37e7e,#e8f2ff)
    }
    &.hidden {
        width: 0px;
        height: 0px;
        overflow: hidden;
        border: 0;
    }
    .upload-btn {
        width: 100px;
        height: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .btn-icon {
            padding-bottom: 8px;
        }
        .btn-text {
            font-family: Alibaba PuHuiTi;
            font-weight: 700;
            color: #3b6aff;
            font-size: 18px;
            line-height: 11px;
            &.fail {
                color: #c9624a
            }
        }
    }
}

</style>