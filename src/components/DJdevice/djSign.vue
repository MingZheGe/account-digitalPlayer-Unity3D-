<template>
  <div class="mask-wrap dj-sign">
      <div class="true-mask"></div>
      <div class="signature-box" :style="{ left: djsignBoxLeft }">
        <!-- 签名时展示 -->
          <div class="signature-header" v-show="!isNotation">
              <h1 class="title">
              协议签署
              </h1>
              <h1 v-if="isNeedVideo">请您摘下口罩、帽子等面部遮挡物，注视上方摄像头后，以正楷体笔画清晰地在下方签名框内进行签名</h1>
              <h1 v-else>请您以正楷体，笔画清晰地在下方签名框内进行签名</h1>
              <img class="signShowImg" :src="signShowImg">
              <span class="ic-close" @click="closeMask"></span>
          </div>
          <!-- 批注时展示 -->
          <div class="notation-header" v-show="isNotation">
            <span class="ic-close" @click="closeMask"></span>
            <div class="notation-title">请您仔细阅读理解协议内容，并在<B>空缺处</B>抄写<B>红色</B>汉字（正楷字体书写）:</div>
            <div class="notation-content"><span v-html="notationContentLabel[notationCurrentIndex]"></span></div>
            <div class="notation-sign">
                <canvas id="imageCanvas" width="1200" height="160"></canvas>
                <canvas id="imageCanvasTM" height="160"></canvas>
            </div>
          </div>
          <div class="signature-body">
              <div id="dj_api_container" class="panel">
                  <!-- <object
                       id="djPPAPI"
                      type="application/x-ppapi-djsoft"
                      style="left: 210px; top: 210px;"
                      width="1080"
                      height="349"
                  ></object> -->
              </div>
          </div>
          <!-- 签名是展示 -->
          <div class="footer" v-if="!isNotation">
            <el-button class="btn btn1" @click="signEmpty">
              清空
            </el-button>
            <el-button class="btn btn2" @click="signSave">
              确定
            </el-button>
          </div>
          <!-- 批注时展示 批注时对应的功能-->
          <div class="notation-footer" v-if="isNotation">
            <el-button class="btn btn1" @click="signEmpty">
              清空
            </el-button>
            <el-button class="btn btn2" @click="signPrev" v-if="notationCurrentIndex > 0">
              上一页
            </el-button>
            <el-button class="btn btn2" @click="signNext">
              {{ nextBtnText }}
            </el-button>
          </div>
      </div>
      <div class="signSure-box" v-show="signConfirm">
          <div class="titleTxt">请再次确认您的签名是否清晰完整</div>
          <div class="imgBox">
              <img :src="signValImg" alt class="imageSure" />
          </div>
          <div class="signatrue-footer">
              <el-button class="btn-rewrite" @click="signAgain">重写</el-button>
              <el-button class="btn-confirm" @click="signOk">确定</el-button>
          </div>
      </div>
      <div class="signImageBox">
          <canvas id="signCanvas">
              <img src alt id="signImageDom" />
          </canvas>
      </div>
  </div>
</template>

<script>
import djSignObj from "../../device/plugins/djSignMd.js"
export default {
data () {
    return {
        signConfirm: false, //显示签字再次确认标志位
        signValImg: "", //确认时展示的签字图片
        djSignInstance: null, //点聚签名实例
        djsignBoxLeft: "50%",
        signvaltag: "", //处理后的签名数据
        signShowImg: require('../../icons/yinheVTM/sign/icon-sign-sample.svg'),
        showDjBox: true,
        // ---------批注相关的参数-----------
        // 是签名还是批注
        isNotation: false,
        // notationContent: "",
        notationContentLabel: [],
        notationContentText: "",
        notationSignArr: [],
        notationCurrentIndex: 0,
        notationSignLen: 0,
        nextBtnText: "下一页"
    }
},
props: ["isNeedVideo", "oppBusiData", "notationContent"],
created() {
  console.log("点聚签名创建");
},
mounted() {
  if (this.notationContent.length > 0) {
    this.isNotation = true;
    this.setNotation();
    this.setNotationLabel();
    this.startSign()
  } else {
    if (this.isNeedVideo) {
      this.messageBox({
        typeMessage: 'warn',
        messageText: '即将进行签名视频录制，请<span class="blur">摘下口罩、帽子等面部遮挡物并抬头注视上方摄像头</span>后再进行签字',
        confirmButtonText: "签名",
        confirmedAction: () => {
          this.startSign()
        }
      })
    } else {
      this.startSign()
    }
  }
  
},
beforeDestroy() {
  this.djSignInstance.logOut();
},
destroyed() {
  
},
watch: {
  signConfirm (v) {
    this.djsignBoxLeft = v ? '-50%' : "50%";
  },
  showDjBox (v) {
    this.djsignBoxLeft = v ? '50%' : "-50%";
  }
},
methods: {
  setNotationLabel() {
    let text = this.notationContent.replace(/<pen>/ig, "<span>").replace(/<\/>/ig, "</span>");
    let signKeyArr = text.match(/<span>.*?<\/span>/ig);
    let signRedKeyArr = [];
    _.each(signKeyArr, item => {
      signRedKeyArr.push(item.replace(/<span>/, '<span style="color:red;font-size:48px;font-weight:700">'))
    })
    this.notationSignLen = signKeyArr.length;
    for(let i = 0; i < signKeyArr.length; i++) {
      this.notationContentLabel.push(text.replace(signKeyArr[i], signRedKeyArr[i]))
    }
  },
  // 处理批注
  setNotation() {
    let that = this;
    // 空格以宽度 10.25 占一个字符  文字以宽度24占一个字符 
    this.notationContentText = this.notationContent.replace(/<PEN>.*?<\/>/ig, "      ")
    let signCanvas = document.getElementById("imageCanvas")
    let ctx = signCanvas.getContext("2d");
    ctx.clearRect(0, 0, signCanvas.width, signCanvas.height)
      ctx.font = "normal bold 36px 楷体"
    let strArr = this.notationNextLine(this.notationContentText);
    for(let i = 0; i < strArr.length; i++) {
        ctx.fillText(strArr[i].text, 40, 50 * (i + 1), 10000);
    }
    let setSignTm = function(signImage) {
        var imageCanvasTM = document.getElementById("imageCanvasTM");
        var ctxTM = imageCanvasTM.getContext("2d");
        // 背景颜色
        const rgba = [255, 255, 255, 255];
        // 容差大小
        const tolerance = 5;
        const [r0, g0, b0, a0] = rgba;
        ctxTM.drawImage(signImage, 0, 0, signImage.naturalWidth - 1, signImage.naturalHeight - 1, 0, 0, signImage.naturalWidth * 0.3, signImage.naturalHeight * 0.3)
        let imageData = ctxTM.getImageData(0, 0, 
                            signImage.naturalWidth - 1, 
                            signImage.naturalHeight - 1),
                        data = imageData.data;
        for(let i = 0; i < data.length; i+=4) {
            let r = data[i], g = data[i+1], b = data[i+2] , a = data[i+3];
            const t = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2 + (a - a0) ** 2);
            // if([r,g,b].every(v => v < 256 && v > 245)) data[i+3] = 0
            if (t < tolerance) {
              data[i+3] = 0;
            }
        }
        // 将修改后的代码复制回画布中
        ctxTM.putImageData(imageData, 0, 0);
        let targetData = imageCanvasTM.toDataURL();
        ctxTM.clearRect(0, 0, imageCanvasTM.width, imageCanvasTM.height)
        let image = new Image();
        image.src = targetData
        return image;
    }
    if (!this.notationSignArr.length) {
      return;
    }
    let imageArr = _.cloneDeep(this.notationSignArr) || [];
    _.each(strArr, (item, index) => {
      if (item.signStartArr && item.signStartArr.length) {
        item.imageArr = imageArr.splice(0, item.signStartArr.length) || []
      }
    })
    /*
    [{
      signStartArr: [192, 335.75, 839.5],
      text: "本人/机构已认真       并完全       客户须知、风险揭示中的各项内容，愿意       证券市场",
      imageArr: [signImage, signImage2, signImage, signImage2]
    }, {
      signStartArr: [192, 335.75, 839.5],
      text: "本人/机构已认真       并完全       客户须知、风险揭示中的各项内容，愿意       证券市场",
      imageArr: [signImage, signImage2, signImage, signImage2]
    }]
    */
    let signOverNum = 0; 
    let lvlHeight = [20, 70, 110]
    _.each(strArr, (item, index) => {
      if (item.imageArr && item.imageArr.length) {
        for(let i = 0; i < item.imageArr.length; i++) {
          let imageMid = new Image();
          imageMid.onload = function() {
              signOverNum++
              ctx.drawImage(imageMid, 0, 0, imageMid.naturalWidth - 1, imageMid.naturalHeight - 1, 
                item.signStartArr[i] + 24, lvlHeight[index], imageMid.naturalWidth * 0.07, imageMid.naturalHeight * 0.07);
              // let image = setSignTm(imageMid)
              // image.onload = function() {
              //   signOverNum++
              //   ctx.drawImage(image, item.signStartArr[i], lvlHeight[index]);
              // }
          }
          imageMid.src = item.imageArr[i];
        }
      }
    })
  },
  // 根据上传文字内容对文字进行换行处理 假设用一行展示宽度为 1152 超过这个则需要换行
  notationNextLine(notationContent) {
    let charStr = 36, nonStr = 18, maxLength = 1080;
    let start = 0;
    let strArr = [], signStartArr = [];
    let currentLineLen = 40;
    for(let i = 0; i < notationContent.length; i++) {
      // 为空格
      if (notationContent[i] === " ") {
        if (!notationContent[i - 1] || notationContent[i - 1] != " ") {
          signStartArr.push(currentLineLen)
        }
        currentLineLen += nonStr;
      } else {
        if(notationContent.charCodeAt(i) > 255) {
          currentLineLen += charStr;
        } else {
          currentLineLen += nonStr;
        }
        if (currentLineLen > maxLength) {
          strArr.push({
            text: notationContent.substring(start, i + 1),
            signStartArr: signStartArr
          })
          start = i + 1;
          currentLineLen = 40;
          signStartArr = [];
        }
      }
    }
    if (start < notationContent.length) {
      strArr.push({
        text: notationContent.substring(start),
        signStartArr: signStartArr
      })
    }
    return strArr;
  },
  startSign() {
    this.createDJObject();
    //this.initAipSign();
    // 初始化点聚签名
    this.$nextTick(() => {
      setTimeout(() => {
          this.initAipSign();
      }, 300);
    })
  },
  createDJObject() {
    console.error("设置djdom开始")
    console.log("设置djdom开始")
    let djContent = document.getElementById('dj_api_container')
    let dj = document.createElement('object')
    dj.id = 'djPPAPI'
    dj.type = 'application/x-ppapi-djsoft'
    dj.width = '1080'
    dj.height = '349'
    //background: red;
    dj.style = 'left: 210px; top: 210px;'
    djContent.appendChild(dj)
    console.log("设置djdom结束")
    console.error("设置djdom结束")
  },
  closeMask () {
    this.$emit("closeMask");
  },
  // 初始化点聚电子签名
  initAipSign() {
    let that = this;
    that.signConfirm = false;
    console.log("djSignObj")
    try {
      that.djSignInstance = djSignObj.initAndOpenAipSign(that.oppBusiData.CUST_CODE);
      console.log('成功初始化点聚电子签名设备');
    } catch (err) {
      console.error("初始化电子签名设备失败，原因：" + err.message);
    }
  },
  // 清空签名数据
  signEmpty() {
    console.log('清除签名数据');
    this.djSignInstance.clearSign();
  },
  // 上一页
  signPrev() {
    this.djSignInstance.clearSign();
    if (this.nextBtnText == "提交") {
      this.nextBtnText = "下一页"
    } else {
      this.notationCurrentIndex--;
    }
  },
  // 下一页
  signNext() {
    if (this.nextBtnText == "提交") {
      let signCanvas = document.getElementById("imageCanvas");
      let signImage = signCanvas.toDataURL();
      this.djSignInstance.logOut();
      this.$emit("notationOver", signImage);
    } else {
      this.signSave()
    }
  },
  // 重新签名
  signAgain() {
    this.signConfirm = false;
    this.djSignInstance.clearSign();
  },
  // 保存签名
  signSave() {
    let that = this
    console.log("开始获取点聚签名图片");
    that.djSignInstance.getValueEx().then(signVal => {
      if ((that.isNotation && !that.notationSignArr[that.notationCurrentIndex] && signVal == "") 
          || (!that.isNotation && signVal == "")) {
        console.log("请先签名");
        that.showDjBox = false;
        that.$emit('show-msg-box', {
              messageText: that.isNotation ? '请您先进行签字' : '请您先进行签名',
          confirmButtonText: '确定',
          callback: () => {
            that.showDjBox = true;
          }
        });
      } else {
        if (that.isNotation) {
          that.getScalSign(signVal);
        } else {
          that.signConfirm = true;
          that.getScalSign(signVal);
        }
      } 
    });
  },
  signOk() {
    let that = this,
        imageSure = document.getElementsByClassName("imageSure")[0];
    
    that.djSignInstance.getSignTrack().then((signTrackVal) => {
      console.log("获取到的点聚签名轨迹");
      console.log(signTrackVal);
      if (
          that.signvaltag &&
          signTrackVal &&
          imageSure.naturalWidth > 30 &&
          imageSure.naturalHeight > 5
      ) {
          that.djSignInstance.logOut();
          that.$emit("signOkLoading", that.signvaltag, signTrackVal);
      } else {
          that.messageBox({
              confirmButtonText: "确定",
              typeMessage: "error",
              messageText: "签名数据不规范，请重新签署！",
              confirmedAction: function () {
                  that.signAgain();
              }
          });
      }
    })
  },
  getScalSign(val) {
    let that = this;
    if (that.isNotation && val == "") {
      if (that.notationCurrentIndex < that.notationSignLen - 1) {
        that.notationCurrentIndex++
      } else {
        that.nextBtnText = "提交"
      }
      return;
    }
    let signImage = document.getElementById("signImageDom");
    let signCanvas = document.getElementById("signCanvas");
    let ctx = signCanvas.getContext("2d");
    let draw = function(scale) {
      console.log("开始绘制点聚签名canvas")
      let signWidth = parseInt(signImage.naturalWidth * scale);
      let signHeight = parseInt(signImage.naturalHeight * scale);
      signCanvas.width = signWidth + 1;
      signCanvas.height = signHeight + 1;
      ctx.drawImage(
          signImage,
          0,
          0,
          signImage.naturalWidth - 1,
          signImage.naturalHeight - 1,
          0,
          0,
          signWidth,
          signHeight
      );
      // 背景颜色
      const rgba = [255, 255, 255, 255];
      // 容差大小
      const tolerance = 60;
      const [r0, g0, b0, a0] = rgba;
      let imageData = ctx.getImageData(0, 0, 
                            signImage.naturalWidth - 1, 
                            signImage.naturalHeight - 1),
                      data = imageData.data;
      for(let i = 0; i < data.length; i+=4) {
        // let r = data[i], g = data[i+1], b = data[i+2];
        // if([r,g,b].every(v => v < 256 && v > 245)) data[i+3] = 0
        let r = data[i], g = data[i+1], b = data[i+2] , a = data[i+3];
        const t = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2 + (a - a0) ** 2);
        // if([r,g,b].every(v => v < 256 && v > 245)) data[i+3] = 0
        if (t < tolerance) {
          data[i+3] = 0;
        }
      }
      // 将修改后的代码复制回画布中
      ctx.putImageData(imageData, 0, 0)
      let targetData = signCanvas.toDataURL();
      return targetData;
    }
    that.$nextTick(() => {
        if (signImage.complete) {
            console.log("signImage.complete")
        }
        signImage.onerror = function () {
            console.log("signImage.onerror")
        }
        signImage.onabort = function () {
            console.log("signImage.onabort")
        }
        signImage.onload = function () {
            let targetData = draw(that.isNotation ? 1 : 0.1);
            console.log(targetData)
            if(that.isNotation) {
              if (!that.notationSignArr[that.notationCurrentIndex]) {
                that.notationSignArr.push(targetData)
              } else {
                that.notationSignArr[that.notationCurrentIndex] = targetData
              }
              
              that.setNotation();
              that.djSignInstance.clearSign();
              if (that.notationCurrentIndex < that.notationSignLen - 1) {
                that.notationCurrentIndex++
              } else {
                that.nextBtnText = "提交"
              }
            } else {
              that.signvaltag = targetData.split(",")[1];
              console.log("签名的图片处理后的base64：" + that.signvaltag);
              targetData = draw(0.2);
              that.signValImg = "data:image/gif;base64," + targetData.split(",")[1];
            }
        }
        signImage.src = "data:image/gif;base64," + val;
    });
  },
}, 
}

</script>

<style lang="less" >
.mask-wrap.dj-sign {
width: 100%;
height: 100%;
z-index: 2020;
position: fixed;

.true-mask {
  height: 1080px;
  z-index: 2017;
  opacity: 0.8;
  position: fixed;
  top: 0;
  bottom: 60px;
  left: 0;
  right: 0;
  background: linear-gradient(
    30deg,
    rgba(113, 65, 193, 0.8) 0%,
    rgba(68, 135, 236, 0.8) 100%
  );
}
.signature-box {
  z-index: 2018;
  width: 1300px;
  height: 810px;
  padding: 0;
  background-color: white;
  position: absolute;
  bottom: 110px;
  left: 50%;
  transform: translateX(-50%);
  .signature-header {
    padding: 0;
    font-size: 30px;
    color: #4a90e2;
    letter-spacing: -0.58px;
    text-align: center;
    position: relative;
    .signShowImg {
      padding-top: 20px;
    }
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: rgba(121, 121, 121, 1);
      line-height: 36px;
      &.title {
        margin: 87px 0 26px 0;
        font-size: 50px;
        text-align: center;
        font-weight: bold;
        color: rgba(35, 35, 35, 1);
        .icon {
          width: 24px;
          height: 18px;
          display: inline-block;
          margin-bottom: 9px;
          background: no-repeat
            linear-gradient(
              45deg,
              rgba(243, 162, 66, 1),
              rgba(255, 190, 111, 1)
            );
          &.arrow-left {
            margin-right: 12px;
            //background-image: url("~@img/protocol/01handwrite/icon_zuo.png");
          }
          &.arrow-right.icon {
            margin-left: 15px;
            //background-image: url("~@img/protocol/01handwrite/icon_you.png");
          }
        }
      }
    }
    .ic-close {
      position: absolute;
      top: -146px;
      right: -62px;
      content: " ";
      width: 70px;
      height: 70px;
      display: block;
      background: no-repeat;
      background-image: url("~@img/yinhe/imageNode/idcard/icon_guanbi.png");
    }
  }
  .notation-header {
    height: 270px;
    
    .notation-title {
      padding-left: 94px;
      font-size: 30px;
      padding-top: 28px;
      padding-bottom: 10px;
    }
    .notation-content {
      padding-left: 94px;
      font-size: 36px;
      width: 1107px;
    }
    .ic-close {
      position: absolute;
      top: -54px;
      right: -62px;
      content: " ";
      width: 70px;
      height: 70px;
      display: block;
      background: no-repeat;
      background-image: url("~@img/yinhe/imageNode/idcard/icon_guanbi.png");
    }
  }
  .signature-body {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 26px;
    width: 1080px;
    height: 349px;
    border: 1px solid;
    border-image: linear-gradient(
        -45deg,
        rgba(180, 187, 200, 1),
        rgba(172, 179, 193, 1)
      )
      1 1;
    border-radius: 4px;
    .sign-tip {
      position: absolute;
      top: 250px;
      left: 50%;
      margin: 0 0 0 -227px;
      font-size: 40px;
      text-align: center;
      font-weight: bold;
      color: red;
    }
  }
  .footer, .notation-footer {
    width: 100%;
    text-align: center;
    margin-top: 50px;
    .btn {
      font-size: 24px;
      width: 180px;
      height: 60px;
    }
    .btn1 {
      border: 1px solid #1f59db;
      color: #1f59db;
      margin-right: 10px;
    }
    .btn2 {
      background-image: linear-gradient(270deg,#1f59db,#217fff);
      color: white;
    }
  }
}
.signImageBox {
  position: fixed;
  top: -130%;
  left: -130%;
}
.signSure-box {
  z-index: 2018;
  width: 826px;
  height: 475px;
  margin: auto;
  padding-top: 77px;
  box-sizing: border-box;
  position: relative;
  background: #fff;
  border-radius: 4px;
  .titleTxt {
    width: 100%;
    font-size: 30px;
    color: #508cee;
    text-align: center;
    margin-bottom: 60px;
  }
  .imgBox {
    width: 100%;
    text-align: center;
    .imageSure {
      //width: 100%;
      //transform: scale(1.5, 1.5);
    }
  }
  .signatrue-footer {
    position: absolute;
    text-align: center;
    left: 0;
    bottom: 40px;
    width: 100%;
    .el-button {
      height: 54px;
      width: 162px;
      border-radius: 4px;
      &.btn-confirm {
        font-size: 24px;
        letter-spacing: -0.58px;
        margin-left: 3.1%;
        background-image: linear-gradient(270deg,#1f59db,#217fff);
        border-width: 0px;
        color: #ffffff;
        border-width: 0px;
      }
      &.btn-rewrite {
        border-radius: 4px;
        font-size: 24px;
        letter-spacing: -0.58px;
        border: 1px solid #b0b0b0;
        color: #b0b0b0;
        background-color: #ffffff;
      }
    }
  }
}
}
</style>