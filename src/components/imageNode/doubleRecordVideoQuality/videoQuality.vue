//双录视频质检组件 @liwei2
<template>
    <div class="video-quality-wrapper">
        <div ref='videoTagWrapper' id='videoTag_box'></div>
        <div class="button-group">
            <el-button @click="videoHasPassed">确认无误</el-button>
            <el-button type="danger" @click="reRecord">重新录制</el-button>
        </div>
    </div>  
</template>
<script>
import oppService from '../../../service/opp-service';
import mp4Tag from './mp4Tag'
export default {
    props:['fielTagName','bSno'],
    data() {
        return {
            qualityVideoResult:{ //质检结果对象
     
            },
            
        }
    },
    mounted() {
        this.queryVideoQualityResult();
    },
    methods: {
        videoHasPassed(){
            //客户点击确认无误，需要柜员登陆验证（userLogin） toDO

        },
        reRecord(){
            let that = this;
            that.confirm({
                messageText:'该阶段的视频资料将被清楚，确定重新录制',
                cancelButtonText:'确定重录',
                confirmButtonText:'我再想想', 
                canceledAction:function(){
                    //重新录制
                    that.$emit('reRecord', true);
                }
            })
        },
        createVideoPlayer(){
            let tagList = this.qualityVideoResult &&  this.qualityVideoResult.QUALITY_RESULT 
            && this.qualityVideoResult.QUALITY_RESULT.length && this.qualityVideoResult.QUALITY_RESULT[0]  && this.qualityVideoResult.QUALITY_RESULT[0].content
            && this.qualityVideoResult.QUALITY_RESULT[0].content.tagdata || {};
					tagList.status == '1' && mp4Tag.createdVideo(this.$refs.videoTagWrapper,this.qualityVideoResult.VIDEO_URL,tagList,0,document);
        },
        //质检结果查询
        queryVideoQualityResult(){
            let that = this;
            let doubleRecordUploadType = oppService.getBusiCommonParamsFromCacheObjs('DOUBLE_RECORD_UPLOAD_TYPE') || '0';
            if(doubleRecordUploadType != "1"){ //不需要质检的直接跳下一路由
                //goNext
                that.$emit('goNextAfterVideoQuality', true);
                return false;
            }
			//质检结果需要10s 所以循环调用直到拿到结果
			that.$emit('goNextAfterVideoQuality', fasle); //退出anychat
			that.myLoading('视频质检中。。。');
            var videoQuaTimer = setInterval(function(){
                that.$syscfg.K_Request("W0000100", {
                    SERVICE_CODE: 'QS0011',
                    TRADE_NO: that.bSno || '',
                    TAG_FILENAME: that.fielTagName
                }).then((response) => {
                    if (response.Code=="0"&&response.Data.length>0) {
						let data = response.Data[0].QUALITY_RESULT && response.Data[0].QUALITY_RESULT.length && response.Data[0].QUALITY_RESULT[0];
						if (data && data.errorcode == 0 && data.content && data.content.tagdata && data.content.tagdata.taglist.length > 0) {
							clearInterval(videoQuaTimer);
							that.myLoading({ showLoading: false });
							that.qualityVideoResult = response.Data[0];
							console.log('质检结果'+JSON.stringify(that.qualityVideoResult))
							that.createVideoPlayer();
						}
                      
                    }else{
                        console.log("质检结果查询失败！原因："+ response.Data.Msg);
                        throw ("质检结果查询失败！原因："+ response.Data.Msg);
                    }
                })
            }, 2000);
        },
    },
}
</script>
<style>
.video-quality-wrapper{
    position: relative;
    height: 100%;
}
.video-quality-wrapper .button-group{
    position: absolute;
    bottom: 40px;
    right: 0;
    width: 44%;
    display: flex;
    justify-content: center;
}
.video-quality-wrapper .button-group .el-button{
    font-size: 18px;
    margin: 0 15px;
}
#videoTag_box{
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: #262e43;
	display: block;
}

#videoTag_box .videoShow{
	/* width: 98%; */
	height: 98%;
	padding: 10px 5px;
	position: relative;
	display: flex;
	justify-content: space-between;
	flex-wrap: nowrap;
	padding-bottom: 0px;
}
#videoTag_box .videoArea{
	width: 100%;
	height: 60%;
}
#videoTag_box .videoArea video{
	width: 100%;
	height: 100%;
	object-fit: fill;
}
#videoTag_box .control{
	width: 100%;
	height: 8%;
	background: #999;
	box-sizing: border-box;
	background-image: linear-gradient(180deg, #1C1F20,#000);
	color: #fff;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-around;
}
#videoTag_box .textCompare{
	width: 44%;
	height: 98%;
	background: #15151d;
}
#videoTag_box .leftArea{
	width: 55%;
	height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
#videoTag_box .textTitle{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 6%;
	border-bottom: 2px solid #333333;
	color: #fff;
}
#videoTag_box .textContent{
	width: 100%;
	box-sizing: border-box;
	height: 93%;
	overflow: hidden;
	overflow-y: auto;
	padding: 0 2%;
}
#videoTag_box .control{
	width: 100%;
	height: 8%;
	background: #999;
	box-sizing: border-box;
	background-image: linear-gradient(180deg, #1C1F20,#000);
	color: #fff;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-around;
}
.control>div{
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.control>div:nth-child(1),.control>div:nth-child(2),.control>div:nth-child(6),.control>div:nth-child(7){
	cursor: pointer;
}
.control .playBtn{
	width: 5%;
}
.control .stopBtn{
	width: 5%;
}
.control .fullBtn{
	width: 5%;
}
.control .volumeBtn{
	width: 5%;
}
.control .endTime{
	width: 15%;
}
.control .nowTime{
	width: 15%;
}
.control .progressVideo{
	width: 45%;
	position: relative;
}
.control .progressVideo .timebar{
	width: 100%;
	height: 5px;
	position: absolute;
	top: 50%;
	background: #626262;
	cursor: pointer;
	left:0;
}
.control .progressVideo .actived{
	width: 0%;
	height: 5px;
	position: absolute;
	top: 50%;
	background: #6feafc;
	left: 0;
	cursor: pointer;
}
.control .progressVideo .progressBtn{
	width: 10px;
	height: 10px;
	margin-left: -5px;
	background: #6feafc;
	position: absolute;
	top: 42%;
	left: 0%;
	border-radius: 50%;
	border: 2px solid #fff;
	cursor: pointer;
	z-index: 100;
	user-select: none;
}
.control .progressVideo .recordTag{
	width: 100%;
	position: absolute;
	top: 50%;
	left:0;
}
.control .progressVideo .tagProgress{
	width: 7px;
	height: 5px;
	position: absolute;
	top: 50%;
	background: #c91d42;
	border-radius: 25%;
	cursor: pointer
}
</style>