<template>
    <div class="pdf-wrap" ref = 'pdfWrap'>
        <div class="pdf-detail" id="pdfDetail">
            <div id="pdfcanvas" ref="pdfcanvas">
                <canvas id="canvasBox" ref="canvasBox" v-show="isLargePdf"></canvas>
            </div>
        </div>
        <div class="pageButton" v-show="isLargePdf">
            <el-button @click="prePage">上一页</el-button>
            <el-button @click="nextPage">下一页</el-button>
            <div class="pageInfo"><span>{{pageNumber}}</span><span>/</span><span>{{numPages}}</span></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'vue-pdf',
        props: {
            // visible: Boolean,
            pdfurl:'',
            htmlObj: null,
        },
        data () {
            return {
                isLargePdf:false,
                pageNumber: 1,
                numPages : 0,
                pdf : "",
            }
        },
        mounted() {
            this.$nextTick(()=>{
                this.getPdf()
            })
        },
        computed(){
            
        },
        watch: {
            
        },
        methods: {
            getPage (pdf,pageNumber,container,numPages) { //获取pdf
                let that = this
                pdf.getPage(pageNumber).then((page) => {
                    let scale = container&&(container.offsetWidth/page.view[2]);
                    let viewport = page.getViewport(scale)
                    let canvas = document.createElement("canvas")
                    canvas.width= viewport.width
                    canvas.height= viewport.height
                    container.appendChild(canvas)
                    // 不是最后一页都需要添加分割线
                    if (pageNumber != numPages) {
                        let line = document.createElement("div");
                        line.style.height='20px'
                        line.style.background='rgb(234, 236, 240)'
                        container.appendChild(line)
                    }
                    let ctx = canvas.getContext('2d');
                    var renderContext = {
                        canvasContext: ctx,
                        viewport: viewport,
                    };
                    page.render(renderContext).then(() => {
                        that.$refs.pdfWrap.scrollTop =1;
                        pageNumber +=1
                        if(pageNumber<=numPages) {
                            that.getPage(pdf,pageNumber,container,numPages)
                        } else {
                            that.$emit("showPdfSuccess", true);
                        }
                    })
                })
            },
            getLargePage(){
                let container = this.$refs.pdfcanvas;
                let that = this
                this.pdf.getPage(this.pageNumber).then((page) => {
                    let scale = container&&(container.offsetWidth/page.view[2]);
                    let viewport = page.getViewport(scale)
                    let canvas = this.$refs.canvasBox;
                    canvas.width= viewport.width
                    canvas.height= viewport.height
                    // container.appendChild(canvas)
                    let ctx = canvas.getContext('2d');
                    var renderContext = {
                        canvasContext: ctx,
                        // transform: [1, 0, 0, 1, 0, 0],
                        viewport: viewport,
                        // intent: 'print'
                    };
                    page.render(renderContext).then(() => {
                        that.$emit("showPdfSuccess", true);
                        console.log("PDF显示成功")
                        this.$refs.pdfcanvas.scrollTop =0;
                    })
                })
            },
            getPdf () {
                // 此中方式接受流形式返回
                let that = this;
                if(!that.$refs.pdfcanvas){
                    return;
                }
                that.$refs.pdfcanvas.scrollTop =0
                if (that.htmlObj.pdf) {
                    that.renderPdf(that.htmlObj.pdf);
                } else {
                    let url = that.pdfurl;
                    let loadingTask = pdfjsLib.getDocument(url)
                    loadingTask.promise.then((pdf) =>{
                        that.$emit("savePdf", pdf);
                        that.renderPdf(pdf);
                    }, function (reason) {
                        that.$emit('pdferr',reason)
                    });
                }
            },
            renderPdf(pdf) {
                let numPages = pdf.numPages
                let container = document.getElementById('pdfcanvas')
                let pageNumber = 1
                if(numPages >= 50){
                    this.isLargePdf = true;
                    this.pageNumber = 1;
                    this.numPages = numPages;
                    this.pdf = pdf
                    container&&this.getLargePage();
                }else{
                    container&&this.getPage(pdf,pageNumber,container,numPages)
                }
            },
            prePage(){
                if(this.pageNumber>1){
                    this.pageNumber--;
                    this.getLargePage();
                }
            },
            nextPage(){
               if(this.pageNumber<this.numPages){
                    this.pageNumber++;
                    this.getLargePage();
                } 
            }
        },
        created () {
        }
    }
</script>

<style lang="less">
    .pdf-wrap {
        width: 94%;
        height: 100%;
        margin: 0 auto;
        overflow: scroll;
        padding: 0;
    }
    .pdf-wrap .pdf-detail {
        margin: 0 auto;
        max-width: 100%;
        height: auto;
    }
    .contract-btns{
        height: 50px;
        background-color:  #fff;
        text-align: center;
        padding-bottom:44px;
        padding-top:10px;
    }
    #pdfcanvas {
        min-height: 50vh;
        background: #fff;
    }
    canvas{
        margin: 0 auto;
        display: block;
    }
    .pageButton{
        position: fixed;
        top: 0px;
        padding-top: 10px;
        left: 90px;
        right: 90px;
        background: #fff;
        height: 36px;
        text-align: center;
        .pageInfo{
            display: inline-block;
            font-size: 24px;
        }
        .el-button{
            width: 80px;
            height: 36px;
            margin-right: 20px;
            background: #dcdcdc;
        }
    }
</style>