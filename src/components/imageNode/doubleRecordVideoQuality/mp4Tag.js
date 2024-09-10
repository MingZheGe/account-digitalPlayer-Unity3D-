/**
 * 
 * @param {插入视频div元素id值} videoClass 
 * @param {视频的全路径} outerUrl 
 * @param {标签结果对象} tagdata 
 * @param {提前打点时间} advanceTime 
 * @param {是否进行问题校验布尔值} isCheckQuestion
 */

function createdVideo(videoClass, outerUrl, tagdata, advanceTime, doc) {
    var taglist = tagdata.taglist,
        status = tagdata.status,
        videoObj, playBtn, volumeBtn,
        timewidth, timeLeft, canMove,
        doc = doc || document, isCheckQuestion = false,
        videoHtml = '';


  
    taglist.forEach(function (elem) {
        elem.type == 1 && (isCheckQuestion = true);
    });
    console.log(isCheckQuestion)
  
    //节流函数
    function throttle(method, duration) {
        var timer = null;
        var begin = new Date();
        return function () {
            var _this = this;
            var current = new Date();
            clearTimeout(timer);
            if (current - begin >= duration) {
                method.apply(_this);
                begin = current;
            } else {
                timer = setTimeout(function () {
                    method.apply(_this);
                }, duration);
            }
        }
    };
    videoHtml += '<div class="videoShow"> \
            <div class="leftArea"> \
                <div class="videoArea"> \
                    <video controlslist="nodownload" autoplay="autoplay" id="video" src="' + outerUrl + '"></video> \
                </div> \
                <!-- 进度条 --> \
                <div class="control"> \
                    <div class="playBtn"> \
                        <svg t="1522723140269" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1453" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css"></style></defs><path d="M256 832c-11.712 0-23.36-3.2-33.664-9.536A64.170667 64.170667 0 0 1 192 768V256c0-22.208 11.52-42.816 30.336-54.464a64.298667 64.298667 0 0 1 62.272-2.816l512 256a64.064 64.064 0 0 1 0 114.56l-512 256c-8.96 4.48-18.88 6.72-28.608 6.72z" fill="#ffffff" p-id="1454"></path></svg> \
                    </div> \
                    <div class="stopBtn"> \
                        <svg t="1522724412167" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4375" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css"></style></defs><path d="M256 192h512c35.392 0 64 28.608 64 64v512c0 35.392-28.608 64-64 64H256c-35.392 0-64-28.608-64-64V256c0-35.392 28.608-64 64-64z" fill="#ffffff" p-id="4376"></path></svg> \
                    </div> \
                    <div class="nowTime"> \
                        <span>00:00:00</span> \
                    </div> \
                    <div class="progressVideo"> \
                        <div class="timebar"></div> \
                        <div class="actived"></div> \
                        <div class="progressBtn"></div> \
                        <div class="recordTag"></div> \
                    </div> \
                    <div class="endTime"> \
                    </div> \
                    <div class="volumeBtn"> \
                        <svg t="1522725043045" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7704" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css"></style></defs><path d="M128 384v256h170.666667l213.333333 213.333333V170.666667L298.666667 384H128z m576 128c0-76.8-42.666667-140.8-106.666667-170.666667v341.333334c64-29.866667 106.666667-93.866667 106.666667-170.666667zM597.333333 136.533333v89.6c123.733333 38.4 213.333333 149.333333 213.333334 285.866667s-89.6 247.466667-213.333334 285.866667v89.6c170.666667-38.4 298.666667-192 298.666667-375.466667s-128-337.066667-298.666667-375.466667z" p-id="7705" fill="#ffffff"></path></svg> \
                    </div> \
                    <div class="fullBtn"> \
                        <span></span> \
                    </div> \
                </div> \
            </div>';
    if (taglist) {
        videoHtml += '<div class="textCompare"> \
                        <div class="textTitle"> \
                            <span>语言文字对比</span> \
                        </div> \
                        <div class="textContent"> \
                        <p><span style="color:yellow;font-size:20px;">质检总结果：</span><span style=";font-size:20px;color:' + (status == 0 ? 'green' : 'red') + '">' + (status == 0 ? '通过' : '不通过') + '</span></p> \
                        <div id="tagArea" style="color:white;font-size:20px;"> ';
        // videoHtml += '<p><span style="color:yellow">质检总结果：</span><span style="color:' + (status == 0 ? 'green' : 'red') + '">' + (status == 0 ? '通过' : '不通过') + '</span></p>'
        taglist.forEach(function (elem) {
            if (elem.type == 1) {
                videoHtml += '<p data-time="' + elem.timestamp + '"><span style="color:yellow">[' + timestampTran(elem.timestamp) + ']问题：</span><span style="color:yellow">';
                if (elem.quesCompareIndexs != null && elem.quesCompareIndexs != '') {
                    var seatMaps = JSON.parse(elem.quesCompareIndexs);
                    var errorIndex1 = []
                    var textArr1 = elem.checkQuestion.split('');
                    seatMaps.forEach(function (elem) {
                        for (var i1 = elem.index; i1 < elem.index + elem.length; i1++) {
                            errorIndex1.push(i1);
                        }
                    });
                    textArr1.forEach(function (elem, i) {
                        if (errorIndex1.indexOf(i) > -1) {
                            videoHtml += '<span style="color:red">' + elem + '</span>';
                        } else {
                            videoHtml += '<span>' + elem + '</span>';
                        }
                    });
                } else {
                    videoHtml += elem.checkQuestion;
                };
                videoHtml += '</span></p>';
                videoHtml += '<p data-time="' + elem.timestamp + '"><span style="color:yellow">[' + timestampTran(elem.timestamp) + ']问题校验：</span><span style="color:yellow">';
                if (elem.quescheckCompareIndexs != null && elem.quescheckCompareIndexs != '') {
                    var questionMaps = JSON.parse(elem.quescheckCompareIndexs);
                    var errorIndex2 = []
                    var textArr2 = elem.content.split('');
                    questionMaps.forEach(function (elem) {
                        for (var i2 = elem.index; i2 < elem.index + elem.length; i2++) {
                            errorIndex2.push(i2);
                        }
                    });
                    textArr2.forEach(function (elem, i) {
                        if (errorIndex2.indexOf(i) > -1) {
                            videoHtml += '<span style="color:red">' + elem + '</span>';
                        } else {
                            videoHtml += '<span>' + elem + '</span>';
                        }
                    });
                } else {
                    videoHtml += elem.content;
                }
                ;
                videoHtml += '</span></p>'
                if (elem.flags == 4352) {
                    elem.checkFaceParam && (videoHtml += '<p data-time="' + elem.timestamp + '"><span style="color:yellow">[' + (timestampTran(elem.timestamp)) + ']</span><span style="color:yellow">在框：</span><span style="color:' + (JSON.parse(elem.checkFaceParam).status == 0 ? 'green' : 'red') + '">' + (JSON.parse(elem.checkFaceParam).status == 0 ? '通过' : '不通过') + '</span></p>')
                };
            }
            ;
            if (elem.type == 2) {
                !isCheckQuestion && (videoHtml += '<p data-time="' + null + '"><span style="color:white;cursor:default;">问题：</span><span style="color:white;cursor:default;">' + elem.checkQuestion + '</span></p>');
                videoHtml += '<p data-time="' + elem.timestamp + '"><span style="color:yellow">[' + (timestampTran(elem.timestamp)) + ']</span><span style="color:yellow">客户：</span><span style="color:' + (elem.checkStatus == 0 ? 'green' : 'red') + '">' + (!elem.content ? '' : elem.content) + '</span></p>';

                elem.checkFaceParam && (videoHtml += '<p data-time="' + elem.timestamp + '"><span style="color:yellow">[' + (timestampTran(elem.timestamp)) + ']</span><span style="color:yellow">在框：</span><span style="color:' + (JSON.parse(elem.checkFaceParam).status == 0 ? 'green' : 'red') + '">' + (JSON.parse(elem.checkFaceParam).status == 0 ? '通过' : '不通过') + '</span></p>');
            }
        });
        videoHtml += `</div><div style="width:100%;margin:5px 0;"><hr style="border:1px dashed #fff;width:100%;"></div>`;
        taglist.forEach(function (item) {
            if (item.flags == 101) {
                videoHtml += '<p><span style="color:yellow">[' + (timestampTran(item.timestamp)) + ']</span><span style="color:white">在框检测异常提示：</span><span style="color:white">人脸数量为' + (JSON.parse(item.content).facenum) + '</span></p>'
            }
        })
        videoHtml += '</div></div>';


    }
    videoHtml += '</div>';
    console.log($)
    $(videoClass).html(videoHtml);

    videoObj = new videoInit('video');

    //打标签
    function createTag() {
        var recordTag = $(videoClass).find('.recordTag');
        if (taglist) {
            var tagHtml = ''
            for (var i = 0; i < taglist.length; i++) {
                if (taglist[i].flags == 101) {
                    continue;
                }
                if (taglist[i].checkStatus == 0) {
                    continue;
                }
                var cssLeft = (taglist[i].questionTimestamp - advanceTime) / videoObj.allTime * 100 + '%';
                // tagHtml += `<div class="tagProgress" style="left:${cssLeft};background:${taglist[i].type == 1 ? 'red' : 'white'}"></div>`
                tagHtml += "<div class=\"tagProgress\" style=\"left:" + cssLeft + ";background:" + (taglist[i].type == 1 ? 'white' : 'red') + "\"></div>";
            }
        }
        recordTag.html(tagHtml)
    }


    playBtn = $(videoClass).find('.playBtn');
    volumeBtn = $(videoClass).find('.volumeBtn');

    //video构造函数
    function videoInit(id) {
        this.video = doc.getElementById(id);
        this.isPlaying = false;
        this.isVolume = false;
        this.allTime = 0;
        this.nowTime = 0;
        this.playPercent = 0;
    }

    //全屏
    function FullScreen() {
        if (videoObj.video.requestFullscreen) {
            videoObj.video.requestFullscreen();
        } else if (videoObj.video.mozRequestFullScreen) {
            videoObj.video.mozRequestFullScreen();
        } else if (videoObj.video.webkitRequestFullScreen) {
            videoObj.video.webkitRequestFullScreen();
        }
    }

    //时间戳转日期
    function timestampTran(longNum) {
        var time = '00:00';
        if (longNum > 60 * 60 * 1000) {
            var hour = longNum / 1000 / 60 / 60;
            var min = longNum / 1000 / 60 % 60;
            var s = longNum / 1000 % 60 % 60;
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (min < 10) {
                min = '0' + min;
            }
            if (s < 10) {
                s = '0' + s;
            }
            time = hour + ':' + min + ':' + s;
        } else if (longNum > 60 * 1000 && longNum < 60 * 60 * 1000) {
            var min = parseInt(longNum / 1000 / 60);
            var s = parseInt(longNum / 1000 % 60);
            if (min < 10) {
                min = '0' + min;
            }
            if (s < 10) {
                s = '0' + s;
            }
            time = '00:' + min + ':' + s;
        } else {
            var s = parseInt(longNum / 1000);
            if (s < 10) {
                time = '00:00:0' + s;
            } else {
                time = '00:00:' + s;
            }
        }
        return time;
    }

    //video回调
    videoObj.video.onloadeddata = function () {
        videoObj.allTime = this.duration * 1000;
        createTag();
        var allTime = timestampTran(videoObj.allTime);
        var html = '<span>' + allTime + '</span>';
        $(videoClass).find('.endTime').html(html)
    }
    videoObj.video.ontimeupdate = function () {
        console.log('--------------------------')
        videoObj.nowTime = this.currentTime * 1000;
        var nowTime = timestampTran(videoObj.nowTime)
        var html = '<span>' + nowTime + '</span>';
        $(videoClass).find('.nowTime').html(html)
        videoObj.playPercent = videoObj.nowTime / videoObj.allTime;
        $(videoClass).find('.progressBtn').css('left', videoObj.playPercent * 100 + '%');
        $(videoClass).find('.progressBtn').css('margin-left', '-5px');
        $(videoClass).find('.actived').css('width', videoObj.playPercent * 100 + '%');
    }
    //video事件
    //进度条总长度
    timewidth = parseInt($(videoClass).find('.progressVideo').css('width'));
    //进度条距离左侧文档边缘距离
    timeLeft = $(videoClass).find('.progressVideo').offset().left;
    canMove = false
    $(videoClass).find('.progressBtn').on('mousedown', function () {
        canMove = true;
        var x1 = timeLeft;
        var percent = 0;
        $(doc).on('mousemove', function (e) {
            var x2 = e.pageX;
            percent = (x2 - x1) / timewidth * 100;
            percent < 0 && (percent = 0);
            percent > 100 && (percent = 100);
            percent = percent + '%'
            $(videoClass).find('.progressBtn').css('left', percent)
            videoObj.playPercent = parseInt(percent) / 100;
            videoObj.nowTime = videoObj.playPercent * videoObj.allTime;
            videoObj.video.currentTime = videoObj.nowTime / 1000
        })
        $(doc).on('mouseup', function () {
            console.log(percent)

            $(doc).off('mousemove')
        })
    })

    $(videoClass).find('.timebar').on('click', function (e) {
        var progress = $(videoClass).find('.timebar')
        //dom距离document的距离
        var x1 = progress.offset().left
        //鼠标距离document的距离
        var x2 = e.pageX
        //var progressWidth = parseInt(progress.css('width'));
        videoObj.playPercent = (x2 - x1) / timewidth;
        videoObj.nowTime = videoObj.playPercent * videoObj.allTime;
        videoObj.video.currentTime = videoObj.nowTime / 1000
    })
    $(videoClass).find('.actived').on('click', function (e) {
        var actived = $(videoClass).find('.actived')
        //dom距离document的距离
        var x1 = actived.offset().left
        //鼠标距离document的距离
        var x2 = e.pageX
        //var activedWidth = parseInt(actived.css('width'));
        videoObj.playPercent = (x2 - x1) / timewidth;
        videoObj.nowTime = videoObj.playPercent * videoObj.allTime;
        videoObj.video.currentTime = videoObj.nowTime / 1000
    })
    $(videoClass).find('.recordTag').on('click', '.tagProgress', function (e) {
        //dom距离document的距离
        var x1 = timeLeft
        //鼠标距离document的距离
        var x2 = e.pageX
        //var activedWidth = parseInt(actived.css('width'));
        videoObj.playPercent = (x2 - x1) / timewidth;
        videoObj.nowTime = videoObj.playPercent * videoObj.allTime;
        videoObj.video.currentTime = videoObj.nowTime / 1000
    })

    $(videoClass).find('.playBtn').on('click', function () {
        if (!videoObj.isPlaying) {
            var html = '<svg t="1522723227273" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2851" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css"></style></defs><path d="M448 871.6 448 152.2c0-13.4-10.8-24.2-24.4-24.2l-143.2 0c-13.6 0-24.4 10.8-24.4 24.2l0 719.4c0 13.4 10.8 24.4 24.4 24.4l143.2 0C437.2 896 448 885.2 448 871.6z" p-id="2852" fill="#ffffff"></path><path d="M743.6 128l-143.2 0c-13.4 0-24.4 10.8-24.4 24.2l0 719.4c0 13.4 10.8 24.4 24.4 24.4l143.2 0c13.4 0 24.4-10.8 24.4-24.4L768 152.2C768 138.8 757.2 128 743.6 128z" p-id="2853" fill="#ffffff"></path></svg>'
            playBtn.html(html);
            videoObj.video.play();
            videoObj.isPlaying = !videoObj.isPlaying;
        } else {
            var html = '<svg t="1522723140269" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1453" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css"></style></defs><path d="M256 832c-11.712 0-23.36-3.2-33.664-9.536A64.170667 64.170667 0 0 1 192 768V256c0-22.208 11.52-42.816 30.336-54.464a64.298667 64.298667 0 0 1 62.272-2.816l512 256a64.064 64.064 0 0 1 0 114.56l-512 256c-8.96 4.48-18.88 6.72-28.608 6.72z" fill="#ffffff" p-id="1454"></path></svg>'
            playBtn.html(html);
            videoObj.video.pause();
            videoObj.isPlaying = !videoObj.isPlaying;
        }
    })
    $(videoClass).find('.stopBtn').on('click', function () {
        var html = '<svg t="1522723140269" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1453" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css"></style></defs><path d="M256 832c-11.712 0-23.36-3.2-33.664-9.536A64.170667 64.170667 0 0 1 192 768V256c0-22.208 11.52-42.816 30.336-54.464a64.298667 64.298667 0 0 1 62.272-2.816l512 256a64.064 64.064 0 0 1 0 114.56l-512 256c-8.96 4.48-18.88 6.72-28.608 6.72z" fill="#ffffff" p-id="1454"></path></svg>'
        playBtn.html(html);
        videoObj.video.pause();
        videoObj.video.currentTime = 0;
        videoObj.isPlaying = false;
    })
    $(videoClass).find('.volumeBtn').on('click', function () {
        if (!videoObj.isVolume) {
            var html = '<svg t="1522725056645" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7857" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css"></style></defs><path d="M512 170.666667L422.826667 259.84 512 349.013333M182.186667 128L128 182.186667 329.813333 384H128v256h170.666667l213.333333 213.333333v-287.146666l181.333333 181.76c-28.586667 21.76-60.586667 39.68-96 49.92v88.32c58.88-13.653333 112.213333-40.533333 157.013334-77.226667L841.813333 896 896 841.813333l-384-384M810.666667 512c0 40.106667-8.533333 77.653333-23.04 112.64l64.426666 64.426667A380.416 380.416 0 0 0 896 512c0-182.613333-128-335.36-298.666667-374.186667v87.893334c123.306667 36.693333 213.333333 151.04 213.333334 286.293333m-106.666667 0c0-75.52-42.666667-140.373333-106.666667-171.946667v94.293334l104.533334 104.533333c2.133333-8.533333 2.133333-17.92 2.133333-26.88z" fill="#ffffff" p-id="7858"></path></svg>'
            volumeBtn.html(html)
            videoObj.video.volume = 0;
            videoObj.isVolume = !videoObj.isVolume;
        } else {
            var html = '<svg t="1522725043045" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7704" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css"></style></defs><path d="M128 384v256h170.666667l213.333333 213.333333V170.666667L298.666667 384H128z m576 128c0-76.8-42.666667-140.8-106.666667-170.666667v341.333334c64-29.866667 106.666667-93.866667 106.666667-170.666667zM597.333333 136.533333v89.6c123.733333 38.4 213.333333 149.333333 213.333334 285.866667s-89.6 247.466667-213.333334 285.866667v89.6c170.666667-38.4 298.666667-192 298.666667-375.466667s-128-337.066667-298.666667-375.466667z" p-id="7705" fill="#ffffff"></path></svg>'
            volumeBtn.html(html)
            videoObj.video.volume = 1;
            videoObj.isVolume = !videoObj.isVolume;
        }
    })
    // $('.fullBtn').on('click',function(){
    //     FullScreen()
    // })
    $(videoClass).find('#videoClose').on('click', function () {
        $(videoClass).find('.stopBtn').trigger('click');
        $(videoClass).find('#videoTag_box').css('display', 'none');
    })
    //点击质检结果跳转视频事件
    $(videoClass).find('#tagArea').children('p').css('cursor', 'pointer').on('click', throttle(function () {
        var time = $(this).data('time');
        if (!time) return;
        videoObj.video.currentTime = time / 1000;
    }, 500))
}

export default { createdVideo };


