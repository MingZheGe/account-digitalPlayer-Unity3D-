/*eslint-disable*/
import DigitalPlayer from "./DigitalPlayer.js";
import HZRecorder from "./HZRecorder.js";
import sysConfig from "../config/sysConfig";
import defineConfig from "../config/defineConfig.js";
import storage from "../tools/storage";
import stringPinyin from "../tools/stringPinyinConfig";
import router from'../../src/router'


let voiceFirm = "kdxf";
let recorder;
let digitalPlayer;
let digitalShow = true;//数字热你是否显示
let isDigitalOpen = false;//数字人服务是否开启
let isDigitalResume = false;//数字人是否唤醒，唤醒则开启语音识别服务，否则只开启语音合成
let isVoicePlay = false;//数字人是否在说话，说话时，停止语音识别，避免把数字人的话术也识别进去
let audio;
let autoFlowsPlay = false;//是否正在自动播报流程话术
let audioCallback;
//文本不能带#
let originText = "";
let matchType = 1;
let netTimeout = 60000;//网络请求超时
let subPageName = "/";//路由下子页面名称
let isMaskDialogShow = false, isMaskLoadingShow = false;//弹窗或者loading时，禁止其他话术跳转
let maskDialogQA = [];//弹窗问答
let currentTTSText;
let isRecordTime = "0";
let normalMaskDialogQA = [{//基础弹窗问答
	"question": "是的,是,好的,好,好吧,我清楚了,我知道了,知道了,知道,确定,确认,可以,行",//客户问题
	"action": "clickId:confirm-btn"
}, {
	"question": "不,不是,否,不知道,不确定,不确认,不可以,不行,取消,返回",//客户问题
	"action": "clickId:cancel-btn"
}];
//语音合成缓冲队列
let voiceQueue = [];
//是否正在创建语音中
let isCreating = false;
let guideData;//配置的路由数据-流程话术数据-字段数据-问答数据

//与数字人C#脚本进行通信
let sendMsg = function () {
	if (digitalPlayer) {
		digitalPlayer.sendMsg("您好，我是网页！");
	}
};

//设置默认语音合成厂商
let setDefaultVoiceFirm = function (firm) {
	if (type) {
		voiceFirm = firm;
	} else {
		voiceFirm = "kdxf";//默认科大讯飞
	}
};

//设置数字人位置、大小、方向
let setPlayerState = function (params) {
	if (digitalPlayer) {
		digitalPlayer.setPlayerState(params);
		syncMoveDigitalDiv(params);
	}
};

let turnRight = function () {
	if (digitalPlayer) {
		digitalPlayer.turnRight();
	}
};

let turnLeft = function () {
	if (digitalPlayer) {
		digitalPlayer.turnLeft();
	}
};

let moveUp = function () {
	if (digitalPlayer) {
		digitalPlayer.moveUp();
	}
};

let moveDown = function () {
	if (digitalPlayer) {
		digitalPlayer.moveDown();
	}
};

let moveRight = function () {
	if (digitalPlayer) {
		digitalPlayer.moveRight();
	}
};

let moveLeft = function () {
	if (digitalPlayer) {
		digitalPlayer.moveLeft();
	}
};

let enlarge = function () {
	if (digitalPlayer) {
		digitalPlayer.enlarge();
	}
};

let narrow = function () {
	if (digitalPlayer) {
		digitalPlayer.narrow();
	}
};

//显示或隐藏数字人
let setDigitalShow = function (show) {
	if (digitalPlayer) {
		digitalPlayer.showOrHide(show);
		if (show) {
			document.getElementById("moveDigitalDiv") && (document.getElementById("moveDigitalDiv").style.visibility = "visible");
		} else {
			document.getElementById("moveDigitalDiv") && (document.getElementById("moveDigitalDiv").style.visibility = "hidden");
			setDigitalDialogShow(show);//数字人关闭，气泡必关闭
		}
	}
};

//设置显示或隐藏数字人气泡对话框
var setDigitalDialogShow = function (show) {
	if (show) {
		document.getElementById("digitalDialog") && (document.getElementById("digitalDialog").style.visibility = "visible");
	} else {
		document.getElementById("digitalDialog") && (document.getElementById("digitalDialog").style.visibility = "hidden");
	}
};

let doAllAction = function () {
	if (digitalPlayer) {
		digitalPlayer.doAllAction();
	}
};

let guideIndex = 0, guideType = 0;

//初始化数字人页面资源
let load = function () {

	addDigitalView();
};

//加载数字人并显示
let loadDigitalPlayer = function (params) {
	initDigitalPlayer(params);
	initGuide();
	isDigitalOpen = true;
};

//初始化数字人布局，音频回调监听
var addDigitalView = function () {
	document.getElementById("digitalContainer").style.visibility = "visible";
	document.getElementById("digitalContainer").innerHTML =
	"<audio controls autoplay style=\"visibility:hidden;\"></audio>" +
		"<div id=\"guideCover\" class=\"guideCover\"></div>" +
		"<div id=\"guideBar\" class=\"guideBar\"  style=\"display:none\">" +
		"<div id=\"guideNext\" class=\"guideNext\">我知道了</div>" +
		"<div id=\"guideClose\" class=\"guideClose\">退出</div>" +
		"</div>" +
		"<div id=\"digitalPlayer\" class=\"webgl-content\" style=\"width:100%; height: 100%;pointer-events: none;position:fixed;z-index: 1001;\">" +
		"<div id=\"unityContainer\" style=\"width:100%; height: 100%;\"></div>" +
		"<div id=\"moveDigitalDiv\" style=\"position:fixed;background:none;width:220px;height:950px;pointer-events: all;left:0;top:0;visibility:hidden;\">" +
		"<div id=\"digitalDialog\" style=\"position:relative;display:inline-flex;width:464px;height:188px;pointer-events: none;left:-380px;top:-190px;visibility:hidden;\">" +
		"<div id=\"digitalDialogTip\" style=\"position:relative;background:none;font-weight: 500;display:inline-block;height:140px;pointer-events: none;left:0;top:0;padding:20px 15px;margin:5px;box-sizing:border-box;word-break:break-all;text-align:justify;font-size:28px;line-height:38px;color:white;\">" +
		"您好，我是您的业务助手小金，点击右侧按钮，让我为您提供帮助吧~ <div id=\"digitalDialogTipImg\"></div>" +
		"</div>" +
		"<div id=\"startDigitalBtn\" style=\"position:relative;background:linear-gradient(45deg, #3C61DD, #4D71E8);font-weight: 500;border-radius:0 4px 4px 0;display:inline-block;height:160px;pointer-events: all;left:0;top:0;font-size:28px;line-height:34px;text-align:center;padding:10px 26px;box-sizing:border-box;border:none;color:#FEFEFE;margin:3px;\">" +
		"启用小金" +
		"</div>" +
		"</div>" +
		"<div id=\"digitalDialogMsg\" style=\"position:relative;font-weight: bold;display:inline-flex;white-space: nowrap;height:100px;min-width:330px;max-width:530px;pointer-events: none;float:right;right: 50px;top:-280px;padding:18px 35px;box-sizing:border-box;word-break:break-all;text-align:justify;font-size:26px;line-height:38px;color:#ffffff;visibility:hidden;\">" +
		"<div id=\"digitalDialogMsgImg\"></div>“&nbsp;<div id=\"digitalDialogMsgTx\" style=\"color:#4667E9;\"></div>&nbsp;”" +
		"</div>" +
		"</div>";
	audio = document.querySelector("audio:not(#voicAudio)");
	if (audio) {
	
		audio.addEventListener("loadeddata", function () {
			voicePrepare();
		}, false);

		audio.addEventListener("pause", function () {
			voiceStop();
		}, false);

		audio.addEventListener("play", function () {
			voicePlay();
		}, false);

		audio.addEventListener("ended", function () {
			console.log("audio ended");
			voiceEnd("ended");
		}, false);

		audio.addEventListener("abort", function () {
			console.log("audio abort");
			if (isRecordTime == "0") {
				voiceEnd("abort");
			}

		}, false);

		audio.addEventListener("error", function () {
			console.log("audio error");

			if (isRecordTime == "0") {
				voiceEnd("error");
			}
		}, false);

		audio.addEventListener("suspend", function () {
			console.log("audio suspend");
			if (isRecordTime == "0") {
				voiceEnd("suspend");
			}

		}, false);

		audio.addEventListener("empted", function () {
			console.log("audio empted");
			if (isRecordTime == "0") {
				voiceEnd("empted");
			}

		}, false);
	}
};

function voicePrepare() {
	if (audioCallback) {
		audioCallback("loadeddata");
	}
}

function voicePause() {
	isVoicePlay = false;
	if (audioCallback) {
		audioCallback("pause");
	}
	if (recorder) {
		recorder.isVoicePlay = isVoicePlay;
	}
}

function voicePlay() {
	isVoicePlay = true;
	if (audioCallback) {
		audioCallback("play", Math.ceil(audio.duration));
	}
	if (recorder) {
		recorder.isVoicePlay = isVoicePlay;
	}
}


function voiceEnd(result) {
	console.log("voiceEnd");
	isVoicePlay = false;
	if (recorder) {
		recorder.isVoicePlay = isVoicePlay;
	}
	if (autoFlowsPlay && result == "ended") {
		setTimeout(autoPlayGuideFlows, 800);
	}
	if (!result && audioCallback) {
		audioCallback("ended");
	}
}

function voiceStop() {
	isVoicePlay = false;
	// ("s播放停止");
	if (recorder) {
		recorder.isVoicePlay = isVoicePlay;
	}
	if (audioCallback) {
		audioCallback("stop");
	}
}

//隐藏弹窗及蒙版
let hideGuide = function () {
	document.getElementById("guideCover").style.visibility = "hidden";
	document.getElementById("guideBar").style.visibility = "hidden";
};
//显示弹窗及蒙版
let showGuide = function () {
	initGuideType();
	document.getElementById("guideCover").style.visibility = "visible";
	document.getElementById("guideBar").style.visibility = "visible";

};
//初始化数字人实例
var initDigitalPlayer = function (params) {
	if (!digitalPlayer) {
		DigitalPlayer.init("digitalPlayer", "unityContainer", audio, function (instance) {
			digitalPlayer = instance;
			if (params && params.playerState) {
				digitalPlayer.setStartState(params.playerState);
			}
			digitalPlayer.setInitComplteListener(function () {
				let state = digitalPlayer.getPlayerState();
				initMoveDigitalEvent(state);
			});
		});
	} else {
		setDigitalShow(true);
	}
};

let moveStore;

//数字人移动组件与数字人位置大小同步
var syncMoveDigitalDiv = function (state) {
	let moveDigitalDiv = document.getElementById("moveDigitalDiv");
	if (moveDigitalDiv && state) {
		let initScale = state.scale.x;
		let initWidth = 220 * initScale;
		let initHeight = 950 * initScale;
		let initLeft = state.position.x - initWidth / 2;
		let initTop = (window.innerHeight - state.position.y - initHeight);

		//设置移动块位置
		moveDigitalDiv.style.left = initLeft + "px";
		moveDigitalDiv.style.top = initTop + "px";
		moveDigitalDiv.style.width = initWidth + "px";
		moveDigitalDiv.style.height = initHeight + "px";
		moveStore = {
			scale: initScale,
			initScale: initScale,
			initWidth: initWidth,
			initHeight: initHeight,
			initLeft: initLeft,
			initTop: initTop,
			startLeft: initLeft,
			startTop: initTop,
			currentLeft: initLeft,
			currentTop: initTop,
		};
	}
	return moveDigitalDiv;
};

//初始化数字人移动、缩放、气泡事件
var initMoveDigitalEvent = function (state) {
	let moveDigitalDiv = syncMoveDigitalDiv(state);
	if (moveDigitalDiv) {
		document.getElementById("digitalDialog").style.visibility = "visible";
		document.getElementById("startDigitalBtn").addEventListener("click", function () {
			console.log("启用小金");
			resumeDigital();
			createAndPlayText("小金开始为您服务，您可以对我说您要办理的事请！");
			window.isShowDigital = true;
		});
		moveDigitalDiv.style.visibility = "visible";
		// 缩放-移动事件的处理
		moveDigitalDiv.style.visibility = "visible";
		// 缩放-移动事件的处理
		moveDigitalDiv.addEventListener("touchstart", function (event) {
			let touches = event.touches;
			let events = touches[0];
			let events2 = touches[1];

			// event.preventDefault();

			// 第一个触摸点的坐标
			moveStore.pageX = events.pageX;
			moveStore.pageY = events.pageY;

			moveStore.moveable = true;

			if (events2) {//双指记录位置
				moveStore.pageX2 = events2.pageX;
				moveStore.pageY2 = events2.pageY;
			} else {//单指移动记录起始位置
				moveStore.startLeft = parseInt(moveDigitalDiv.style.left);
				moveStore.startTop = parseInt(moveDigitalDiv.style.top);
			}
			moveStore.originScale = moveStore.scale || 1;
		});

		let lastTime = new Date().getTime();
		moveDigitalDiv.addEventListener("touchmove", function (event) {
			if (!moveStore.moveable) {
				return;
			}
			//限流
			let nowTime = new Date().getTime();
			if (nowTime - lastTime < 250) {
				return;
			} else {
				lastTime = nowTime;
			}
			event.preventDefault();
			let touches = event.touches;
			let events = touches[0];
			let events2 = touches[1];
			// 双指缩放
			if (events2) {
				// 第2个指头坐标在touchmove时候获取
				if (!moveStore.pageX2) {
					moveStore.pageX2 = events2.pageX;
				}
				if (!moveStore.pageY2) {
					moveStore.pageY2 = events2.pageY;
				}
				// 获取坐标之间的举例
				let getDistance = function (start, stop) {
					return Math.hypot(stop.x - start.x, stop.y - start.y);
				};
				// 双指缩放比例计算
				let zoom = getDistance({
					x: events.pageX,
					y: events.pageY
				}, {
					x: events2.pageX,
					y: events2.pageY
				}) /
					getDistance({
						x: moveStore.pageX,
						y: moveStore.pageY
					}, {
						x: moveStore.pageX2,
						y: moveStore.pageY2
					});
				// 应用在元素上的缩放比例
				let newScale = moveStore.originScale * zoom;
				// 最大缩放比例限制
				if (newScale > 1.5) {
					newScale = 1.5;
				}
				if (newScale < 1.0) {
					newScale = 1.0;
				}
				// 记住使用的缩放值
				moveStore.scale = newScale;
				// 图像应用缩放效果
				//更新移动块的大小和位置
				moveDigitalDiv.style.left = moveStore.currentLeft + (moveStore.initWidth - moveStore.initWidth / moveStore.initScale * newScale) / 2 + "px";
				moveDigitalDiv.style.width = moveStore.initWidth / moveStore.initScale * newScale + "px";
				moveDigitalDiv.style.top = moveStore.currentTop + (moveStore.initHeight - moveStore.initHeight / moveStore.initScale * newScale) + "px";
				moveDigitalDiv.style.height = moveStore.initHeight / moveStore.initScale * newScale + "px";
				//同步数字人的大小和位置
				if (digitalPlayer && state) {
					state.scale.x = newScale;
					state.scale.y = newScale;
					state.scale.z = newScale;
					digitalPlayer.setPlayerState(state);
				}
			} else {//单指设置移动块的位置
				let deltaX = parseInt(events.clientX) - moveStore.pageX;
				let deltaY = parseInt(events.clientY) - moveStore.pageY;
				let moveLeft = moveStore.startLeft + deltaX;
				let moveTop = moveStore.startTop + deltaY;
				if (moveLeft < 80 - parseInt(moveDigitalDiv.style.width)) {
					moveLeft = 80 - parseInt(moveDigitalDiv.style.width);
				}
				if (moveLeft > window.innerWidth - 80) {
					moveLeft = window.innerWidth - 80;
				}
				if (moveTop < 80 - parseInt(moveDigitalDiv.style.height)) {
					moveTop = 80 - parseInt(moveDigitalDiv.style.height);
				}
				if (moveTop > window.innerHeight - 80) {
					moveTop = window.innerHeight - 80;
				}
				moveDigitalDiv.style.left = moveLeft + "px";
				moveDigitalDiv.style.top = moveTop + "px";
				moveStore.currentLeft = parseInt(moveDigitalDiv.style.left);
				moveStore.currentTop = parseInt(moveDigitalDiv.style.top);
				//同步数字人的位置，数字人的起点为脚部中间，参考系左下角为(0,0),与屏幕左上角(0,0)不一样
				if (digitalPlayer && state) {
					state.position.x = parseInt(moveDigitalDiv.style.left) + parseInt(moveDigitalDiv.style.width) / 2;
					state.position.y = window.innerHeight - parseInt(moveDigitalDiv.style.top) - parseInt(moveDigitalDiv.style.height);
					digitalPlayer.setPlayerState(state);
				}
			}
		});

		document.addEventListener("touchend", function () {
			moveStore.moveable = false;
			delete moveStore.pageX2;
			delete moveStore.pageY2;
		});

		document.addEventListener("touchcancel", function () {
			moveStore.moveable = false;
			delete moveStore.pageX2;
			delete moveStore.pageY2;
		});

	}
};

//初始化弹窗类型，椭圆或矩形
var initGuideType = function () {
	if (guideType == 0) {
		document.getElementById("guideCover").className = "guideCover guideType0";
	} else {
		document.getElementById("guideCover").className = "guideCover guideType1";
	}
};

//切换至下一流程，并弹窗
let changeGuide = function () {
	let currentUrl = getUrlRouter();
	let subPageUrl = subPageName || "/";
	if (guideData && guideData.url == currentUrl && guideData.pages && guideData.pages[subPageUrl] && guideData.pages[subPageUrl].flows) {
		if (!guideData.pages[subPageUrl].flows["flow_" + guideIndex]) {
			guideIndex = 0;
		}
		guidePoint(guideData.pages[subPageUrl].flows["flow_" + guideIndex]);
		guideIndex++;
	}
};

//表单字段引导弹窗
let formGuide = function (params) {
	let currentUrl = getUrlRouter();
	let subPageUrl = subPageName || "/";
	if (guideData && guideData.url == currentUrl && guideData.pages && guideData.pages[subPageUrl] && guideData.pages[subPageUrl].forms) {
		if (!guideData.pages[subPageUrl].forms[params.viewId]) {
			return;
		}
		guideFormPoint(guideData.pages[subPageUrl].forms[params.viewId], params);
	} else if (params.popupForce) {//强制引导弹窗，不管是否有配置数据
		guideFormPoint({ IS_SPEAK: "1", PRIORITY: 1 }, params);
	}
};

//跳到指定流程话术
let goGuide = function (index) {
	let currentUrl = getUrlRouter();
	let subPageUrl = subPageName || "/";
	if (guideData && guideData.url == currentUrl && guideData.pages && guideData.pages[subPageUrl] && guideData.pages[subPageUrl].flows) {
		if (guideData.pages[subPageUrl].flows["flow_" + index]) {
			guidePoint(guideData.pages[subPageUrl].flows["flow_" + guideIndex]);
		}
	}
};

//开始自动播放流程话术
let autoStartGuideFlows = function () {
	console.log("autoStartGuideFlows");
	setTimeout(() => {
		if (isDigitalOpen) {
			let currentUrl = getUrlRouter();
			let subPageUrl = subPageName || "/";;
			//guideData = testData[currentUrl];
			guideIndex = 0;
			if (guideData && guideData.url == currentUrl && guideData.pages && guideData.pages[subPageUrl] && guideData.pages[subPageUrl].isFlowsAuto === "1") {
				autoFlowsPlay = true;
				autoPlayGuideFlows();
			} else {
				autoFlowsPlay = false;
				hideGuide();
			}
		}
	}, 1000);
};

//获取路由路径
var getUrlRouter = function () {
	return transformRouterUrl(reachRouter);
};

//自动播放流程话术
var autoPlayGuideFlows = function () {
	if (isDigitalOpen) {
		let currentUrl = getUrlRouter();
		let subPageUrl = subPageName || "/";
		if (guideData && guideData.url == currentUrl && guideData.pages && guideData.pages[subPageUrl] && guideData.pages[subPageUrl].flows) {
			if (!guideData.pages[subPageUrl].flows["flow_" + guideIndex]) {
				guideIndex = 0;
				autoFlowsPlay = false;
			} else if (autoFlowsPlay) {
				guidePoint(guideData.pages[subPageUrl].flows["flow_" + guideIndex]);
				guideIndex++;
			}
		}
	}
};


//开始引导
let startGuide = function () {
	showGuide();
	changeGuide();
};

//初始化引导点击事件
var initGuide = function () {
	document.getElementById("guideNext").addEventListener("click", () => {
		changeGuide();
	});

	document.getElementById("guideClose").addEventListener("click", () => {
		hideGuide();
	});
};

//播报话术、显示弹窗、执行动作
var guidePoint = function (item) {
	if (item && item.IS_SPEAK === "1" && item.SPEAK_TEXT) {
		createAndPlayTextNow(item.SPEAK_TEXT, "1", function (result) {
			if (result == "play") {
				showGuidePoint(item);
			}
		});
	} else {
		showGuidePoint(item);
	}
	if (item && item.ACTION) {
		takeAction(item.ACTION);
	}
};

//显示弹窗引导
var showGuidePoint = function (item) {
	if (item && (item.IS_SHOW_POPUP === "1" && item.POPUP_TYPE != undefined) || item.POPUP_FORCE) {
		guideType = item.POPUP_TYPE;
		initGuideType();
		if (item.POPUP_VIEW_ID) {
			coverGuide(document.getElementById("guideCover"), document.getElementById(item.POPUP_VIEW_ID) || document.getElementsByName(item.POPUP_VIEW_ID)[0]);
		} else {
			coverGuideByPoint(document.getElementById("guideCover"), item.POPUP_X, item.POPUP_Y, item.POPUP_WIDTH, item.POPUP_HEIGHT);
		}
	}
};

//表单字段显示弹窗引导
var guideFormPoint = function (item, params) {
	if (params.popupViewId) {
		item.POPUP_VIEW_ID = params.popupViewId;
		item.POPUP_TYPE = "1";
		item.POPUP_FORCE = params.popupForce;
	}
	let ttsCb = function (result) {
		if (result == "play") {
			showGuidePoint(item);
		}
	};
	if (item && item.IS_SPEAK === "1") {
		if (params.priority && (params.priority > item.PRIORITY)) {
			createAndPlayText(params.text, params.filetype || "1", ttsCb);
		} else {
			if (params.action == "focus") {
				createAndPlayText(item.OTHER_TEXT, params.filetype || "1", ttsCb);
			} else if (params.action == "right") {
				createAndPlayText(item.RIGHT_TEXT, params.filetype || "1", ttsCb);
			} else if (params.action == "wrong") {
				createAndPlayText(item.WRONG_TEXT, params.filetype || "1", ttsCb);
			} else if (params.action == "click") {
				createAndPlayText(item.OTHER_TEXT, params.filetype || "1", ttsCb);
			}
		}
	} else {
		showGuidePoint(item);
	}
};

//切换弹窗类型
let changeGuideType = function () {
	if (guideType == 0) {
		guideType = 1;
	} else {
		guideType = 0;
	}
};

//根据组件定位弹窗
var coverGuide = function (guideCover, target) {
	let body = document.body, doc = document.documentElement;
	if (guideCover && target) {
		// target size(width/height)
		let targetWidth = target.clientWidth,
			targetHeight = target.clientHeight;

		// page size
		let pageHeight = doc.scrollHeight,
			pageWidth = doc.scrollWidth;

		// offset of target    
		let offsetTop = target.getBoundingClientRect().top + (body.scrollTop || doc.scrollTop),
			offsetLeft = target.getBoundingClientRect().left + (body.scrollLeft || doc.scrollLeft);

		// set size and border-width
		guideCover.style.width = targetWidth + "px";
		guideCover.style.height = targetHeight + "px";
		guideCover.style.borderWidth =
			offsetTop + "px " +
			(pageWidth - targetWidth - offsetLeft) + "px " +
			(pageHeight - targetHeight - offsetTop) + "px " +
			offsetLeft + "px";

		guideCover.style.display = "block";
		showViewTime(guideCover, 1500);


		// resize
		if (!guideCover.isResizeBind) {
			if (window.addEventListener) {
				window.addEventListener("resize", function () {
					coverGuide(guideCover, target);
				});
				guideCover.isResizeBind = true;
			} else if (window.attachEvent) {
				window.attachEvent("onresize", function () {
					coverGuide(guideCover, target);
				});
				guideCover.isResizeBind = true;

				// IE7, IE8 box-shadow hack
				guideCover.innerHTML = "<img src=\"guide-shadow.png\">";
			}
		}
	}
};

//根据坐标宽高定位弹窗
var coverGuideByPoint = function (guideCover, x, y, width, height) {
	x = parseInt(x);
	y = parseInt(y);
	width = parseInt(width);
	height = parseInt(height);
	let body = document.body, doc = document.documentElement;
	if (body && doc) {
		// target size(width/height)
		let targetWidth = width,
			targetHeight = height;

		// page size
		let pageHeight = doc.scrollHeight,
			pageWidth = doc.scrollWidth;

		// offset of target    
		let offsetTop = y + (body.scrollTop || doc.scrollTop),
			offsetLeft = x + (body.scrollLeft || doc.scrollLeft);

		// set size and border-width
		guideCover.style.width = targetWidth + "px";
		guideCover.style.height = targetHeight + "px";
		guideCover.style.borderWidth =
			offsetTop + "px " +
			(pageWidth - targetWidth - offsetLeft) + "px " +
			(pageHeight - targetHeight - offsetTop) + "px " +
			offsetLeft + "px";

		guideCover.style.display = "block";
		showViewTime(guideCover, 3000);
	}
};

//弹窗定时显示，自动隐藏
let viewTimer;
var showViewTime = function (view, time) {
	if (view && view.style) {
		view.style.visibility = "visible";
		if (viewTimer) {
			viewTimer = undefined;
			clearTimeout(viewTimer);
		}
		if (time) {
			viewTimer = setTimeout(() => {
				if (viewTimer) {
					viewTimer = undefined;
					clearTimeout(viewTimer);
				}
				view.style.visibility = "hidden";
			}, time);
		}
	}
};

//应用视窗大小改变，考虑重新设置数字人画布大小，避免失真
let resize = function () {
	if (digitalPlayer) {
		setTimeout(() => {
			digitalPlayer.changeCanvas();
		}, 500);
	}
};

//设置数字人匹配模式，0-中文匹配，1-指令匹配；中文匹配即是直接匹配文字，然后做相应动作；指令匹配，则是匹配类似[a0005]的指令，做相应的动作
let setMathType = function (type) {
	matchType = type;
	digitalPlayer.matchType = type;
};

// var kdxfPlayTimer = undefined;
//语音合成接口
function createAndPlayText(text, filetype = "1", audioCb, recordTime = "0") {
	isRecordTime = recordTime;
	autoFlowsPlay = false;
	createAndPlayTextNow(text, filetype, audioCb);
}
//语音合成队列
function createAndPlayTextQueue(text, filetype = "1", audioCb) {
	//每次创建语音之前，先把audio的src的属性清空，防止出问题
	audio.src = "";
	if (viewTimer) {
		document.getElementById("guideCover").style.visibility = "hidden";
		clearTimeout(viewTimer);
		viewTimer = undefined;
	}
	if (audioCb) {
		audioCallback = audioCb;
	} else {
		audioCallback = undefined;
	}
	text = text + "";

	if (voiceFirm == "aliyun") {
		//语音合成 需要根据是否开启数字人区别处理，如果开启了数字人，就需要保留动作，如果未开启就不保留动作
		let aliText = isDigitalOpen ? digitalPlayer.aliyunDealTag(text) : aliyunDealTag(text);
		aliyunTts(aliText, function (voiceData) {
			if (voiceData) {
				if (voiceData == "net-error" && audioCallback) {
					audioCallback("error");
				} else {
					//开启数字人 调用数字人内部播放函数
					isDigitalOpen ? digitalPlayer.ttsAndPlay(text, audio, voiceData) : (audio.src = "data:audio/wav;base64," + voiceData);
				}
			}
		});
	} else if (voiceFirm == "kdxf") {
		//voiceQueue.push([text, audioCb]);
		//科大讯飞 增加排队机制，播放话术时如果上一条话术还没创建成功（目前不支持多线程）就直接返回。
		// if(isCreating){
		//   return;
		// }
		// isCreating = true;
		(function (text) {
			//语音合成 需要根据是否开启数字人区别处理，如果开启了数字人，就需要保留动作，如果未开启就不保留动作
			let kdxfText = isDigitalOpen ? digitalPlayer.kdxfDealTag(text) : kdxfDealTag(text);
			kdxfRequestVoice(kdxfText, filetype, async function (filePath) {
				// isCreating = false;
				//创建成功，从缓冲数组里删除
				// voiceQueue.splice(0,1);
				// //如果缓冲数组里还有数据，继续请求创建，不播放,这样可以保证播放的是最新的语音
				// if(!!voiceQueue.length){
				//   voiceQueue = [voiceQueue[0]];
				//   createAndPlayTextQueue(voiceQueue[0][0], filetype, voiceQueue[0][1]);
				//   return;
				// }
				let voiceData = "";
				if (filePath && window.utyDevice && filetype == "0") {//filetype="0" 返回的是文件路径
					if (filePath == "net-error" && audioCallback) {
						audioCallback("error");
					} else {
						filePath = decodeURIComponent(filePath);
						voiceData = await utyDevice.EncodeBase64(filePath);
						if (voiceData) {
							isDigitalOpen ? digitalPlayer.ttsAndPlay(text, audio, voiceData) : (audio.src = "data:audio/wav;base64," + voiceData);
						}
					}
				} else if (filePath && filetype == "1") {//filetype=1返回的是base64
					//替换返回数据的音频头
					voiceData = filePath.replace("data:audio/wav;base64,", "");
					if (voiceData == "" || voiceData == "net-error") {
						//无论开不开数字人都要失败回调
						audioCallback && audioCallback("net-error");
					} else {
						//数字人开启则播放语音并做动作，否则只播放语音
						isDigitalOpen ? digitalPlayer.ttsAndPlay(text, audio, voiceData) : (audio.src = "data:audio/wav;base64," + voiceData);
					}
				}
			});
		}(text));
	}
}


function createAndPlayTextNow(text, filetype = "1", audioCb) {
	// if(voiceFirm == "kdxf"){
	//   voiceQueue.push([text, audioCb]);
	// }
	createAndPlayTextQueue(text, filetype, audioCb);
}

//阿里云语音合成时，处理科大讯飞的多音字、动作、音译标记，html标记
function aliyunDealTag(str) {
	str = str.replace(/<div>|<\/div>|<p>|<\/p>/g, "");
	str = str.replace(/\[[=|a|n].+?\]/g, "");
	return str.trim();
}

//科大讯飞语音合成时，处理英文发音、动作标记，html标记
function kdxfDealTag(str) {
	str = str.replace(/<div>|<\/div>|<p>|<\/p>/g, "");
	str = str.replace(/\[[&|a].+?\]/g, "");
	return str.trim();
}

//停止播放语音，数字人停止动作
function stopPlay() {
	// digitalPlayer.endSpeakProcess();
	//先停止动作
	try {
		digitalPlayer.stopSpeak();
	} catch (err) {
	}
	//延迟等动作结束后再停止播放
	setTimeout(() => {
		if (audio) {
			audio.pause();
			audio.src = "";
		};
	}, 300);
}

//开始录音并自动识别
function startRecording(parms) {
	if (!recorder) {
		HZRecorder.get(function (rec) {
			recorder = rec;
			intRecordData(parms);
			recorder.start();
		}, parms.errorCallback);
	} else {
		intRecordData(parms);
		recorder.start();
	}
}

//暂停录音和识别
function pauseRecording() {
	if (recorder) {
		recorder.pause();
	}
}

//停止录音和识别
function stopRecording() {
	if (recorder) {
		recorder.stop();
	}
}

//播放录音
function playRecording() {
	if (recorder) {
		recorder.play(audio);
	}
}

//上传录音进行识别
function uploadAudio() {
	if (recorder) {
		recorder.upload();
	}
}

function removeSentenceEndPunctuation(str) {
    return str.replace(/[.?!。？！]$/, ''); // 匹配句末的 . ? ! 。？！
}

//阿里云语音识别请求
function aliyunRecord(voiceBase64, callback) {
	console.log("阿里云语音识别请求");
	return sysConfig.$syscfg.K_Request("W0000356", {
		"SERVICE_CODE":"I9900003",
		"SERVICE_NUMBER":"50005",
		"IMG_PHOTO1": voiceBase64,
	}).then(function (d) {
		let result = d.Code == "0" && d.Data && d.Data[0] && d.Data[0].RESULT_TEXT;
		result = removeSentenceEndPunctuation(result);
		//result = "hahaha"
		console.log("阿里云语音识别结果", result);
		console.log(result)
		callback(result);
		return result;
	}).catch((error) => {
		console.error("语音识别失败", error);
		callback("net-error");
	});
	//window.socket.on('connect',()=>{})
	//window.socket.on('message',(data)=>{
		//callback(data)
		//return data})

}

//阿里云语音合成请求
function aliyunTts(text, callback) {
	currentTTSText = text;
	return sysConfig.$syscfg.K_Request("W0000358", {
		text: text,
	}).then(function (d) {
		let result = d.Code == "0" && d.Data && d.Data[0] && d.Data[0].result;
		if (currentTTSText != text) {
			callback("");
		} else {
			callback(result);
		}
		return result;
	}).catch((error) => {
		console.error(error);
		callback("net-error");
	});
}
//科大讯飞语音合成请求 创建语音，filetype 0-路径，1-base64
// text 话术 处理数字 格式： [n*]   (*=0/1/2)
// 参数： 0 – 自动判断
//                1 – 数字作号码处理
//                2 – 数字作数值处理
// 说明： 默认为自动判断。
// 文本举例：
//         [n2]123[n1]456[n0] 其中，123将会按照数值处理，456则会按照号码处理，而后的文本中的数字，均会自动判断
const kdxfRequestVoice = function (text, filetype = "1", callback) {
	currentTTSText = text;
	return sysConfig.$syscfg.K_KDXF_REQUEST({
		key: "createVoice",
		txt: text,
		type: 0,
		param: null,
		num: 0,
		filetype: filetype,
		callback: null,
	}).then(res => {
		if (currentTTSText != text) {
			callback("");
		} else {
			callback(filetype == "1" ? res && res[0].Base64Str : res && res[0].filepath);
		}
		return filetype == "1" ? res && res[0].Base64Str : res[0].filepath;
	}).catch(err => {
		console.log("kdxf语音合成请求失败", err);
		callback("net-error");
	});
};

//科大讯飞语音播放请求
// var kdxfPlayVocie = function (filepath) {
//   return  sysConfig.$syscfg.K_KDXF_REQUEST("?key=playVoice&filepath=" + decodeURIComponent(filepath) + "&callback=?").then(res => {
//     return true;
//   }).catch(err => {
//   })
// }

//科大讯飞语音停止播放请求
// var kdxfStopPlayvoice = function () {
//   return  sysConfig.$syscfg.K_KDXF_REQUEST("?key=closeVoice&callback=?").then(res => {
//     return true;
//   }).catch(err => {
//   })
// }

//科大讯飞获取语音长度
// var kdxfGetVoiceLen = function(){
//   return sysConfig.$syscfg.K_KDXF_REQUEST("?key=getVoiceLength&callback=?").then(res2=>{
//     return res2.iRet;
//   }).catch(err => {
//   })
// }

//初始化录音数据，说话事件间隔、录音阈值、回调事件
function intRecordData(parms) {
	if (recorder) {
		if (parms && parms.speakInterval) {
			recorder.speakInterval = parms.speakInterval;
		}
		if (parms && parms.speakThreshold) {
			recorder.speakThreshold = parms.speakThreshold;
		}
		recorder.setRecordCallback(aliyunRecord, function (recorgnizeResult) {
			//识别成功的回调
			console.log("识别结果", recorgnizeResult);
			if (recorgnizeResult == "net-error" && parms && parms.errorCallback) {
				parms.errorCallback("net-error");
				console.log("走的1")
			} else if (parms && parms.recorgnizeCallback) {
				console.log("走的2")
				console.log(recorgnizeResult)
				parms.recorgnizeCallback(recorgnizeResult);
			}
			if (parms && parms.isDigitalAnswer && isDigitalResume) {
				console.log("走的3")
				answerTheQuestion(recorgnizeResult);
			}
		}, function (voiceVal) {
			if (parms && parms.recordCallback) {
				parms.recordCallback(voiceVal);
			}
		});
	}
}
//根据客户的指令 获取对应的执行规则
function answerTheQuestion(question) {
	console.log("question", question);
	//let test = ["我要", "我想", "请问", "怎么", "怎样", "办理","我有"];
// 	let test = ["开户","开会","超酷"]
// 	for(let i of test){
// 		//if (question.indexOf(i)) {
// 			if (question.indexOf(i) != -1) {
// 			console.log("哈哈哈")
// 			wife.doAction("开心")
// 			let signSucc = new Audio()
// 			signSucc.src = require("../../src/asset/video/身份证件信息是否无误.wav")
// 			signSucc.play()
// 			router.push('/idlogin');
// 			//this.$router.push({path:"/kaihu"})
// 	}
// }
		
	if (!question) {
		return;
	}
	if (isDigitalOpen) {
		question = (question + "").toLowerCase();
		if (!getMaskDialogShow() && !getMaskLoadingShow()) {//非dialog和loading状态的问答事件
			let currentUrl = getUrlRouter();
			let subPageUrl = subPageName || "/";
			let commonRules = null;
			if (guideData && guideData.url == currentUrl && guideData.pages && guideData.pages[subPageUrl] && guideData.pages[subPageUrl].dialogs) {
				let dialogs = guideData.pages[subPageUrl].dialogs;
				for (let i = 0; i < dialogs.length; i++) {//路由配置数据优先完全匹配
					let questions = dialogs[i].QUESTION.split("&&");
					for (let j = 0; j < questions.length; j++) {
						if (questions[j] === question) {
							effectiveOperation();
							if (dialogs[i].ANSWER) {
								createAndPlayText(dialogs[i].ANSWER);
							}
							if (dialogs[i].ACTION) {
								takeAction(dialogs[i].ACTION);
							}
							return;
						} else if (questions[j] == "任意内容") {
							commonRules = dialogs[i];
						}
					}
				}
				for (let i = 0; i < dialogs.length; i++) {//路由配置数据模糊匹配
					let questions = dialogs[i].QUESTION.split("&&");
					for (let j = 0; j < questions.length; j++) {
						if (questions[j].startsWith("%") && questions[j].endsWith("%")) {
							let realQuestion = questions[j].slice(1, questions[j].length - 1);
							let matchIndex = question.indexOf(realQuestion);
							if (matchIndex > -1 && !hasNegativeWord(question.substring(matchIndex - 1, matchIndex))) {
								effectiveOperation();
								if (dialogs[i].ANSWER) {
									createAndPlayText(dialogs[i].ANSWER);
								}
								if (dialogs[i].ACTION) {
									takeAction(dialogs[i].ACTION);
								}
								return;
							}
						}
					}
				}
			}
			if (commonRules) {
				takeAction(commonRules.ACTION, question);
			} else {
				queryCommonAnswer(question);
			}
		} else if (isMaskDialogShow) {//dialog弹窗问答
			for (let i = 0; i < maskDialogQA.length; i++) {
				let qItems = maskDialogQA[i].question.split(",");
				for (let j = 0; j < qItems.length; j++) {
					if (qItems[j] == question) {
						effectiveOperation();
						takeAction(maskDialogQA[i].action);
						return;
					}
				}
			}
		}
	}
	
}

//模糊匹配时，处理前置否定词
function hasNegativeWord(word) {
	let negativeWords = ["不", "没", "无", "莫", "非", "别"];
	for (let i = 0; i < negativeWords.length; i++) {
		if (negativeWords[i] == word) {
			return true;
		}
	}
	return false;
}

//执行动作指令
//type:params
function takeAction(action, question) {
	let actions = action.split(":");
	if (actions[0]) {
		switch (actions[0]) {
			case "clickId":
				let viewId = actions[1];
				//支持配置多个id 按次序查找
				if (viewId.indexOf("|") > -1) {
					let clickViewId = viewId.split("|"),
						firstMatchId = _.find(clickViewId, function (id) {
							if (document.getElementById(id)) {
								return id;
							}
						});
					firstMatchId && document.getElementById(firstMatchId).click();
				} else {
					document.getElementById(viewId) && document.getElementById(viewId).click();
				}
				break;
			case "clickClass":
				let viewClass = actions[1];
				document.getElementsByClassName(viewClass)
					&& document.getElementsByClassName(viewClass)[0]
					&& document.getElementsByClassName(viewClass)[0].click();
				break;
			case "function":
				let fun = actions[1];
				eval(fun + "()");
				break;
			case "forms":
				let formViewId = actions[1], actionType = actions[2];
				formAction({
					viewId: formViewId,
					action: actionType || "click"
				});
				break;
			case "goHome":
				setTimeout(() => {
					if (reachRouter != "/") {
						goRouter("/");
					}
				}, 1000);
				break;
			case "goBiz":
				if (commonFunctions.jumpToBiz) {
					let busiCode = actions[1];
					commonFunctions.jumpToBiz(busiCode);
				}
				break;
			case "goSeachTab":
				if (commonFunctions.jumpToSystem) {
					let tabIndex = actions[1];
					commonFunctions.jumpToSystem(tabIndex);
				}
				break;
			case "closeDigital"://关闭小金
				if (window.isOpenDigital && isDigitalResume && vm.$route.name != "commonHome") {//数字人打开且唤醒则隐藏数字人，并关闭语音识别
					closeDigitalPlayer();
				}
				break;
			default:
				//任意内容无匹配操作则查询公共话术
				if (_.isFunction(commonFunctions.diCommonAction)) {
					commonFunctions.diCommonAction(question, action[1], function (isTake) {
						if (isTake) {
							effectiveOperation();
						} else {
							queryCommonAnswer(question);
						}
					});
				} else {
					queryCommonAnswer(question);
				}
				break;
		}
	}
}

//既无路由配置响应也无任意内容响应则查询公共话术
function queryCommonAnswer(question) {
	getCommonAnswer(question, (result) => {
		if (result && Object.keys(result).length > 0) {
			effectiveOperation();
			if (result.ANSWER) {
				createAndPlayText(result.ANSWER);
			}
			if (result.ACTION) {
				takeAction(result.ACTION);
			}
		} else {
			//语音识别 自动回填语音内容到输入框
			let supportVoiceInputEl = [
				".self-normalInput .el-input input[type*=text]:focus", //文本输入
				".self-normalInput .el-textarea textarea:focus", //文本域输入
				".self-normalInput .el-input input[type=number]:focus",//数字输入
				".self-normalInput .el-input input[type=tel]:focus", //电话输入
				".self-telephoneInput .el-input input[type=number]:focus", //公司电话输入
				".self-addressInput .el-input input[type*=text]:focus", //详细地址输入
			],
				focusInput = document.querySelector(supportVoiceInputEl.join(","));
			if (focusInput && window.lastFocusInput && focusInput == window.lastFocusInput && storage.$storage.getSession(defineConfig.$definecfg.VTM_VOICE_INPUT) === "1") {
				let newQuestion = question, oldVal = _.cloneDeep(focusInput.value || ""), currIndex = focusInput.selectionStart || oldVal.length;
				//对于数字或电话输入，只过滤数字
				if (["number", "tel"].includes(focusInput.type)) {
					newQuestion = newQuestion.replace(/[^0-9]/ig, "");
				}
				//对于英文或拼音输入
				else if (focusInput.id && focusInput.id.includes("_ENG")) {
					newQuestion = stringPinyin.ConvertPinyin(newQuestion)
				}
				if (newQuestion.length) {
					//按光标位置插入
					focusInput.value = oldVal.slice(0, currIndex) + newQuestion + oldVal.slice(currIndex);
					//检查输入类型是否支持selectionStart
					/text|password|search|tel|url/.test(focusInput.type) && (focusInput.selectionStart = focusInput.selectionEnd = currIndex + newQuestion.length);
					focusInput.dispatchEvent && focusInput.dispatchEvent(new InputEvent("input"));
				}
			}
			//查不到内容，收入收纳箱
			showDigitalDialogMsg(question);
			questionCollect(question);
		}
	});
}
let questionCollectStartWord = ["我要", "我想", "请问", "怎么", "怎样", "办理"];
//根据问题前缀将问题收纳
function questionCollect(question) {
	for (let i = 0; i < questionCollectStartWord.length; i++) {
		if (question.startsWith(questionCollectStartWord[i])) {
			return sysConfig.$syscfg.K_Request("W0000001", {
				YGT_SERVICE_CODE: "KSCS0085",
				QUESTION: question,
				ROUTE_PATH: reachRouter + (subPageName == "/" ? "" : "@" + subPageName),
				BUSI_CODE: ((reachRouter == "/commonHome" || reachRouter == "/commonCustHome") && subPageName == "/") ? "V0000" : vm.$store.state.busicode,
			}).then(function (d) {
				let result = d.Code == "0" && d.Data && d.Data[0];
				return result;
			}).catch((error) => {
				console.log("questionCollect 报错", error);
			});
		}
	}
}

//弹窗定时显示，自动隐藏
let dialogMsgTimer;
var showDigitalDialogMsg = function (question) {
	let view = document.getElementById("digitalDialogMsg");
	let text = question.length > 13 ? question.slice(0, 10) + "..." : question;
	document.getElementById("digitalDialogMsgTx").innerHTML = text;
	if (view && view.style) {
		view.style.visibility = "visible";
		if (dialogMsgTimer) {
			dialogMsgTimer = undefined;
			clearTimeout(dialogMsgTimer);
		}
		dialogMsgTimer = setTimeout(() => {
			if (dialogMsgTimer) {
				dialogMsgTimer = undefined;
				clearTimeout(dialogMsgTimer);
			}
			view.style.visibility = "hidden";
		}, 2000);
	}
};


//跳转路由
function goRouter(path) {
	if (window.vm) {
		window.vm.$router.replace({ path: path });
	}
}

//表单字段事件
function formAction(params) {
	formGuide(params);
}

let reachRouter = window.location.hash.replace("#","");

function routerBeforeEach(to, from, next) {
	window.isOpenDigital && stopPlay();
	voiceQueue = [];
	isCreating = false;
	reachRouter = to.path;
	subPageName = "/";
	audioCallback = undefined;
	guideData = undefined;
	if (window.isOpenDigital && (reachRouter == "/")) {//首页未登录，数字人打开
		if (isDigitalResume) {//唤醒则数字人重置计时器
			effectiveOperation();
		} else {//没唤醒则显示数字人并显示气泡按钮
			openDigitalPlayer();
			setDigitalDialogShow(true);
			setTimeout(() => {//设置延时播放语音
				if (window.isOpenDigital && (reachRouter == "/") && !isDigitalResume) {//首页未登录，数字人打开且没唤醒则显示数字人，并提醒服务
					createAndPlayText("[a0003]您好，我是您的业务助手小金，点击右侧按钮，让我为您提供帮助吧");
				}
			}, 1500);
		}
	} else {
		if (window.isOpenDigital && !isDigitalResume && !(reachRouter == "/")) {//非首页未登录，数字人打开但没唤醒则隐藏数字人，并关闭语音识别
			closeDigitalPlayer();
		}
	}
	if (window.isOpenDigital && isDigitalOpen && isDigitalResume && reachRouter && !isBlackRouter(reachRouter)) {
		getRouterData(reachRouter, function (result) {
			guideData = result;
			autoStartGuideFlows();
		});
	}
}

//路由黑名单，不进行路由数据的获取
function isBlackRouter(router) {
	let blackRouters = ["/vtmBind"];
	for (let i = 0; i < blackRouters.length; i++) {
		if (router == blackRouters[i]) {
			return true;
		}
	}
	return false;
}

function routerAfterEach(to) {
}

//设置子页面名称，表示路由下显示子页面，并执行配置的流程话术与动作
let setPageTimer = undefined;
function setSubPageNameAndGuide(name) {
	let lastHash = location.hash.split("?")[0];
	if ("#" + reachRouter == lastHash) {
		if (setPageTimer) {
			clearTimeout(setPageTimer);
			setPageTimer = undefined;
		}
		setPageTimer = setTimeout(() => {
			if ("#" + reachRouter == lastHash) {
				if (name) {
					subPageName = name;
				} else {
					subPageName = "/";
				}

				clearTimeout(setPageTimer);
				setPageTimer = undefined;
				audioCallback = undefined;
				autoStartGuideFlows();
			}
		}, 1200);
	}
}

//只设置子页面名称，表示路由下显示子页面
function setSubPageName(name) {
	if (setPageTimer) {
		clearTimeout(setPageTimer);
		setPageTimer = undefined;
	}
	setPageTimer = setTimeout(() => {
		if (name) {
			subPageName = name;
		} else {
			subPageName = "/";
		}
		clearTimeout(setPageTimer);
		setPageTimer = undefined;
	}, 1000);
}

//设置蒙版loading显示与隐藏
let loadingTimer;
function setMaskLoadingShow(params) {
	isMaskLoadingShow = params.show;
	if (!isDigitalResume) {
		return;
	}
	if (isMaskLoadingShow) {
		if (params.text) {
			if (loadingTimer) {
				clearTimeout(loadingTimer);
				loadingTimer = undefined;
			}
			loadingTimer = setTimeout(() => {
				if (getMaskLoadingShow()) {
					createAndPlayText(params.text);
				}
				clearTimeout(loadingTimer);
				loadingTimer = undefined;
			}, 700);//loading显示至少700ms才播放loading的话术
		}
	}
}

//设置蒙版弹窗显示与隐藏,并配置问答话术
function setMaskDialogShow(params) {
	isMaskDialogShow = params.show;
	if (!isDigitalResume) {
		return;
	}
	maskDialogQA = [];
	if (isMaskDialogShow) {
		if (params.confirmText) {
			maskDialogQA.push({
				//voiceFullyMatch 话术完全匹配则不拼接通用问题
				question: params.confirmText + (!params.voiceFullyMatch ? ("," + normalMaskDialogQA[0].question) : ""),
				answers: normalMaskDialogQA[0].answers,
				action: normalMaskDialogQA[0].action,
			});
		}
		if (params.cancelText) {
			maskDialogQA.push({
				question: params.cancelText + (!params.voiceFullyMatch ? ("," + normalMaskDialogQA[1].question) : ""),
				answers: normalMaskDialogQA[1].answers,
				action: normalMaskDialogQA[1].action,
			});
		}
		if (params.text && !params.noPlayVoice) {
			createAndPlayText(params.text);
		}
	}
}

function getMaskDialogShow() {
	if (isMaskDialogShow || document.getElementById("messageNode")) {
		isMaskDialogShow = true;
	} else {
		isMaskDialogShow = false;
	}
	return isMaskDialogShow;
}

function getMaskLoadingShow() {
	if (isMaskLoadingShow || document.getElementById("loadingNode")) {
		isMaskLoadingShow = true;
	} else {
		isMaskLoadingShow = false;
	}
	return isMaskLoadingShow;
}

function getSubPageName() {
	return subPageName;
}

// 根据需要转换路由
function transformRouterUrl(router) {
	if (!router || !router.includes("bizFlow")) {
		return router;
	}
	let busiCode = router.replace("/bizFlow/", "").substr(0, 5),
		userType = router.replace("/bizFlow/", "").substr(6, 1),
		newRouter = "";
	if (!userType) {
		return router;
	}
	switch (busiCode) {
		case "V0020": case "V0005": case "V0024":
			newRouter = router.replace(`/${userType}`, "/{{USER_TYPE}}");
			break;
		default:
			break;
	}
	return newRouter || router;
}

//查询路由配置数据
function getRouterData(router, callback) {
	return sysConfig.$syscfg.K_Request("W0000001", {
		BUSI_CODE: "",
		ROUTE_PATH: transformRouterUrl(router) || reachRouter,
		YGT_SERVICE_CODE: "KSCS0101"
	}).then(function (d) {
		let result = d.Code == "0" && d.Data && d.Data[0];
		callback(result);
		return result;
	}).catch((error) => {
		console.error(error);
		callback("net-error");
	});
}

//请求查询公共话术
function getCommonAnswer(question, callback) {
	return sysConfig.$syscfg.K_Request("W0000001", {
		YGT_SERVICE_CODE: "KSCS0100",
		QUESTION: question
	}).then(function (d) {
		let result = d.Code == "0" && d.Data && d.Data[0];
		callback(result);
		return result;
	}).catch((error) => {
		console.error(error);
		callback("net-error");
	});
}

//打开数字人并显示，openRecorder控制是否启用小金，autoPlay控制是否自动播放流程话术
function openDigitalPlayer(params) {
	loadDigitalPlayer(params);//加载数字人
	setDigitalDialogShow(true);
	if (params && params.openRecorder) {
		resumeDigital(params, params.autoPlay);
	}
}

//唤醒小金并启用语音识别
function resumeDigital(params, autoPlay) {
	setDigitalDialogShow(false);
	effectiveOperation();
	startRecording({//启动录音
		isDigitalAnswer: true,//数字人是否自动回答；
		speakThreshold:10,//说话音量阈值
		speakInterval:500,//说话间隔
		recorgnizeCallback: function (result) {//语音识别结果
			if (params && params.recorgnizeCallback) {
				params.recorgnizeCallback(result);
			}
		},
		recordCallback: function (voiceVal) {//识别时，音量变化值
			if (params && params.recordCallback) {
				params.recordCallback(voiceVal);
			}
		},
		errorCallback: function (error) {
			if (params && params.errorCallback) {
				params.errorCallback(error);
			}
		}
	});
	if (!guideData && reachRouter && !isBlackRouter(reachRouter)) {
		getRouterData(reachRouter, function (result) {
			guideData = result;
			if (autoPlay) {
				autoStartGuideFlows();
			}
		});
	}
	isDigitalResume = true;
}

//暂停但是不隐藏小金，并停止语音识别和当前的语音播放
function pasueDigital() {
	setDigitalDialogShow(true);
	stopRecording();
	stopPlay();
	isDigitalResume = false;
}

//识别的话术或指令是否有效，有效则重置定时器，3分钟后停用小金
let perationTimer = undefined;
function effectiveOperation() {
	console.log("effectiveOperation");
	if (reachRouter == "/commonHome") {
		if (perationTimer) {
			clearTimeout(perationTimer);
			perationTimer = undefined;
		}
		perationTimer = setTimeout(() => {
			if (isDigitalResume && reachRouter == "/commonHome") {
				if (!isVoicePlay) {
					createAndPlayText("小金先休息一会，有需要请再叫我！");
				}
				setTimeout(() => {
					if (isDigitalResume && reachRouter == "/commonHome") {
						window.isShowDigital = false;
						pasueDigital();
					}
				}, 6000);
			}
			clearTimeout(perationTimer);
			perationTimer = undefined;
		}, 60000 * 3);
	}
}

//关闭并隐藏数字人
function closeDigitalPlayer() {
	pasueDigital();
	setDigitalShow(false);
	setDigitalDialogShow(false);
	isDigitalOpen = false;
	guideData = undefined;
}
//卸载数字人
function destoryDigital() {
	// let container = document.getElementById("digitalContainer");
	// container&&container.parentNode&&container.parentNode.removeChild(container)
	// removejscssfile("style.css","css")
	removejscssfile("UnityProgress.js", "js");
	removejscssfile("UnityLoader.js", "js");
	digitalPlayer = null;
}
//移除已经加载过的js/css
function removejscssfile(filename, filetype) {
	let targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";
	let targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";
	let allsuspects = document.getElementsByTagName(targetelement);
	for (let i = allsuspects.length; i >= 0; i--) {
		if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
			allsuspects[i].parentNode.removeChild(allsuspects[i]);
	}
}
//公共函数对象，注册了函数用完后要记得注销，设置为undefined
var commonFunctions = {

};

window.answerTheQuestion = answerTheQuestion;
//对外暴露的接口
let DigitalInstance = {
	initDigitalService: function () {//初始化数字人服务
		load();//初始化数字人视图资源和音频服务
		openDigitalPlayer();
	},
	destoryDigital: destoryDigital,//销毁数字人
	loadDigitalPlayer: loadDigitalPlayer,//加载数字人,调用则初始化数字人资源，并显示
	openDigitalPlayer: openDigitalPlayer,//加载数字人并开启语音识别和语音播报
	closeDigitalPlayer: closeDigitalPlayer,//隐藏数字人，停止语音识别和语音播放
	startRecording: startRecording,//开始麦克风录音，并识别结果
	pauseRecording: pauseRecording,//暂停麦克风录音
	stopRecording: stopRecording,//停止麦克风录音
	createAndPlayText: createAndPlayText,//将文字转成语音并播报
	stopPlay: stopPlay,//停止语音播报
	playRecording: playRecording,//播放录音
	narrow: narrow,//数字人缩小
	enlarge: enlarge,//数字人放大
	moveLeft: moveLeft,//数字人左移
	moveRight: moveRight,//数字人右移
	moveDown: moveDown,//数字人下移
	moveUp: moveUp,//数字人上移
	turnLeft: turnLeft,//数字人左转
	turnRight: turnRight,//数字人右转
	setPlayerState: setPlayerState,//数字人位置、大小、角度
	sendMsg: sendMsg,//数字人js脚本与C#脚本进行通信
	takeAction: takeAction,//执行指令
	formAction: formAction,//执行表单指令
	setDigitalShow: setDigitalShow,//数字人显示或隐藏
	routerBeforeEach: routerBeforeEach,//路由到达前执行函数
	routerAfterEach: routerAfterEach,//路由到达后执行函数
	autoStartGuideFlows: autoStartGuideFlows,//自动执行导向流程
	setSubPageName: setSubPageName,//设置子页面的名字
	setSubPageNameAndGuide: setSubPageNameAndGuide,//设置子页面的名字，并自动轮播子页面流程话术
	getSubPageName: getSubPageName,//获取子页面的名字
	setMaskDialogShow: setMaskDialogShow,//设置蒙版dialog显示或隐藏状态
	getMaskDialogShow: getMaskDialogShow,//获取蒙版dialog显示或隐藏的状态
	setMaskLoadingShow: setMaskLoadingShow,//设置蒙版loading显示或隐藏状态
	getMaskLoadingShow: getMaskLoadingShow,//获取蒙版loading显示或隐藏的状态
	setMathType: setMathType, //设置话术匹配模式，0-纯文本匹配，1-指令匹配。默认1
	guideFormPoint: guideFormPoint,//设置指定位置遮罩并播报
	commonFunctions: commonFunctions,
	resumeDigital: resumeDigital, //界面上启用数字人的方法，给本地双录用的
};

const plugin = {
	install(Vue) {
		//添加全局方法或属性
		Vue.digitalService = DigitalInstance;
		//添加实例方法
		Vue.prototype.$digitalService = DigitalInstance;
	},
	$digitalService: DigitalInstance
};

export default plugin;
export const install = plugin.install;
export const DigitalService = DigitalInstance;
