/* eslint-disable*/
(function (window) {
	let DigitalPlayer = function (digitalPlayer, container, audio) {
		let unityInstance = UnityLoader.instantiate(container, "./digitalPlayer/Build/web.json", { onProgress: UnityProgress });
		let actions = ["站立", "再见", "开心", "沮丧", "伸右手", "伸左手", "伸右手说话", "伸左手说话", "伸右手说话始", "伸右手说话终", "伸左手说话始", "伸左手说话终", "站立说话"];
		let currentAction = 0;
		let filePath = "";
		//var originText = "您好，我是数字人一号，哈哈？回头见!";
		//var originText = "如果正则表达式匹配成功的话,会返回一个数组,而数组里的数据有两种形式,对应着匹配方式:全局匹配";
		//var originText0 = "您好，亲爱用户[=&11&3]goodmorning，我是金证机器人，小金，我喜欢唱歌、跳舞、还有[=&3&1]rap。";//1个字1/6秒，1个标点1/2秒, 1个标点等于3个字   7个 + 6*3 = 25个字 ~4秒
		let processTimer = undefined;
		let replaceChar = "@@";//标点符号替换符，校准速度。一个标点的长度约等于2个字符的长度
		let isVoicePlay = false;//语音是否在播放
		let englishWordIndexMatchArr = [];//英文单词匹配，因为英文单词字符长度与发音长度不一致，所以如果需要校准英文单词，则需要标记。如[=&11&3]goodmorning表示goodmorning有11个字符，发音长度为3
		let animatePoint = {};//匹配到关键词或指令的位置集合
		let lastIndex = -1,//播放过程中，匹配到上一个动作的下标
			step = 3,//跳步匹配动作步长，即提前匹配动作，提前做动作，现在提前3个字符
			endRange = 2;//提前结束动作范围，现在提前2个字符结束动作
		let currentTimer = undefined;
		let that = this;
		this.testAnimateHasMap = {};//动作匹配结果集
		//关键词匹配动作集合
		this.testAnimateHasMap0 = { "伸左手": "很好，做得好", "OK手势": "好吧，即可，好的，没问题", "伸右手": "您好，你好，好哦", "开心": "goodmorning，goodafternnon，很高兴，见到您很高兴，见到你很高兴，很高兴认识你，很高兴认识您，高兴，哈哈，呵呵，嘻嘻", "再见": "再见，拜拜，下次见，回头见" };
		//指令匹配动作集合
		this.testAnimateHasMap1 = { "站立": "[a0001]", "沮丧": "[a0002]", "开心": "[a0003]", "伸左手": "[a0004]", "伸右手": "[a0005]", "再见": "[a0006]", "站立说话": "[a0007]", "伸左手说话始": "[a0008]", "伸左手说话终": "[a0009]", "伸右手说话始": "[a0010]", "伸右手说话终": "[a0011]" };
		this.originText = "";//原始本文
		this.speakText = "";
		this.dealText = "";//处理后的文本
		this.matchType = 1;//匹配方式, 0-关键词匹配, 1-指令匹配
		this.isDigitalShow = true;
		let initComplteListener;//数字人加载完毕回调
		let kdxfVoiceEnd;//科大讯飞语音播放结束回调
		//数字人初始化位置、大小、方向
		let startState = {
			position: { x: 880, y: 20, z: 3 },
			angle: { x: 0, y: 0, z: 0 },
			scale: { x: 1.2, y: 1.2, z: 1.2 }//1.2
		};

		/*
			position: { x: 1820, y: 120, z: 3 },
			angle: { x: 0, y: 20, z: 0 },
			scale: { x: 1.2, y: 1.2, z: 1.2 }
		*/ 

		this.setStartState = function (state) {
			startState = state;
		};

		this.setInitComplteListener = function (listener) {
			initComplteListener = listener;
		};

		//数字人同步初始化位置大小方向信息
		let playerInitState = {
			position: { x: 0, y: 0, z: 0 },
			angle: { x: 0, y: 0, z: 0 },
			scale: { x: 0, y: 0, z: 0 },
		};

		//数字人同步实时位置大小方向信息
		let playerState = {
			position: { x: 0, y: 0, z: 0 },
			angle: { x: 0, y: 0, z: 0 },
			scale: { x: 0, y: 0, z: 0 },
		};

		this.getPlayerState = function () {
			return playerState;
		};
		var stopSpeak = function () {
			let parms = { action: "stopSpeak" };
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
			}
		};

		this.stopSpeak = stopSpeak;
		var mathStr = function (str) {//封装函数，避免匹配漏缺
			let re = /\[=&.+?\]/g;
			return re.exec(str);
		};
		//播放开始，按平均单字播放时间长度，循环匹配动作
		var GetProcess = async function (allTime) {
			//开始说话前先停止原来的动作
			startSpeak();//数字人开启说话动作
			if (!processTimer) {
				let englishWordIndex = 0;
				let index = 0;
				lastIndex = -1;
				that.dealText = DeletePolyPhone(that.dealText);
				let averageTime = allTime && (allTime * 1000 / that.dealText.length) || 167;
				processTimer = setInterval(async () => {
					if (index >= that.dealText.length - endRange || !isVoicePlay) {
						stopSpeak();//文字最后2个字符或语音停止播放时，提前结束数字人说话动作
					}
					if (index >= that.dealText.length || !isVoicePlay) {
						endSpeakProcess();//文字匹配完毕或语音停止播放时结束循环
					} else {
						let lastChat = that.dealText.substring(index - 1, index);//上一个字符
						let currentChar = that.dealText.substring(index, index + 1);//当前字符
						if (currentChar == "#") {//匹配到英文动作下标
						} else {
							if (currentChar != "#" && lastChat == "#") {
								englishWordIndex++;
							}
						}
						if (index > lastIndex) {//当前下标大于匹配到的上一个动作下标
							let actionMap;
							//跨步长匹配动作指令
							for (let i = step; i >= 0; i--) {
								let stepIndex = index + i;
								actionMap = animatePoint[stepIndex];
								if (actionMap) {
									lastIndex = stepIndex;
									break;
								}
							}
							//匹配到动作则执行动作
							if (actionMap) {
								let parms = { action: "doUnitAnimation", animate: actionMap.animateKey };
								if (unityInstance) {
									unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
								}
							}
						}
						index++;
					}
				}, averageTime);
			}
		};

		var endSpeakProcess = function () {
			clearInterval(processTimer);
			processTimer = undefined;
			isVoicePlay = false;
		};

		//处理文本，包括标点符号、英文单词，并获取动作位置集合。
		var toDealText = function () {
			that.dealText = that.originText.replace(/\，|\,|\。|\.{6}|\.{3}|\.|\!|\！|\.+?/g, replaceChar).replace(/\.+3/g, replaceChar).replace(/、/g, "");
			that.dealText = findEnglishWordMatchPoint(that.dealText);
			if (that.matchType == 0) {
				that.testAnimateHasMap = that.testAnimateHasMap0;
				step = 3;
				animatePoint = GetAnimatePoint(that.dealText, that.testAnimateHasMap);//匹配中文关键词，获取动作及位置集合
			} else if (that.matchType == 1) {
				that.testAnimateHasMap = that.testAnimateHasMap1;
				step = 3;
				animatePoint = GetAnimateOrderPoint(that.dealText, that.testAnimateHasMap);//匹配指令词，获取动作及位置集合
			}
			//整合英文单词节点，得到所有动作和位置的集合
			animatePoint = { ...animatePoint, ...GetEngliAnimatePoint(englishWordIndexMatchArr, that.testAnimateHasMap) };
		};
		//数字人执行动作动画，action为动作名称，如："伸左手"
		var doAction = function (action) {
			let parms = { action: "doUnitAnimation", animate: action };
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
			}
		};

		this.doAction = doAction;

		var dealActionTag = function (str) {//处理动作标记
			str = str.replace(/\[a.+?\]/g, "[n0000]");
			str = str.replace(/<div>|<\/div>|<p>|<\/p>/g, "");
			return str.trim();
		};

		//获取英文单词关键词的动作位置集合
		var GetEngliAnimatePoint = function (englishList, animateList) {
			let resKeysMap = {};
			for (let animateKey in animateList) {
				let animateListItem = animateList[animateKey];
				let animateStr = animateListItem.split("，");
				for (let i = 0; i < animateStr.length; i++) {
					let animateStrItem = animateStr[i];
					for (let j = 0; j < englishList.length; j++) {
						let englishObj = englishList[j];
						if (englishObj.speakText && englishObj.speakText === animateStrItem) {
							//英文单词存在且是匹配项
							let keyItem = {};
							keyItem["animateKey"] = animateKey;
							keyItem["animateValue"] = animateStrItem;
							resKeysMap[englishObj.point] = keyItem;
						}
					}
				}

			};
			return resKeysMap;
		};


		this.voicePrepare = function () {
			stopSpeak();
			endSpeakProcess();
			toDealText();
		};


		this.voicePause = function () {
			if (audio && audio.currentTime == audio.duration) {
				audio.currentTime = 0;
			}
			isVoicePlay = false;
		};

		this.voicePlay = function () {
			isVoicePlay = true;
			let allTime;
			if (audio) {
				allTime = audio.duration;
			}
			GetProcess(allTime);
		};

		this.voiceEnd = function () {
			isVoicePlay = false;
		};


		if (audio) {
			audio.addEventListener("loadeddata", function () {
				that.voicePrepare();
			}, false);

			audio.addEventListener("pause", function () {
				that.voicePause();
			}, false);

			audio.addEventListener("play", function () {
				that.voicePlay();
			}, false);

			audio.addEventListener("ended", function () {
				that.voiceEnd();
			}, false);
		}

		//发送信息到数字人，更新位置、大小、方向
		this.setPlayerState = function (playerState) {
			let initPostion = { action: "setPosition", x: playerState.position.x, y: playerState.position.y, z: playerState.position.z };
			let initAngles = { action: "setPlayerAngles", x: playerState.angle.x, y: playerState.angle.y, z: playerState.angle.z };
			let initScale = { action: "setScale", x: playerState.scale.x, y: playerState.scale.y, z: playerState.scale.z };
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(initPostion));
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(initAngles));
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(initScale));
			}
		};

		//发送信息到数字人
		this.sendMsg = function (msg) {
			var msg = { action: "sendMsg", msg: msg };
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(msg));
			}
		};

		this.turnRight = function () {
			let parms = { action: "setPlayerAngles", x: playerState.angle.x, y: playerState.angle.y, z: playerState.angle.z };
			parms.y += 20;
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
			}
		};

		this.turnLeft = function () {
			let parms = { action: "setPlayerAngles", x: playerState.angle.x, y: playerState.angle.y, z: playerState.angle.z };
			parms.y -= 20;
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
			}
		};

		this.moveUp = function () {
			let parms = { action: "setPosition", x: playerState.position.x, y: playerState.position.y, z: playerState.position.z };
			parms.y += 50;
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
			}
		};

		this.moveDown = function () {
			let parms = { action: "setPosition", x: playerState.position.x, y: playerState.position.y, z: playerState.position.z };
			parms.y -= 50;
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
			}
		};


		this.moveLeft = function () {
			let parms = { action: "setPosition", x: playerState.position.x, y: playerState.position.y, z: playerState.position.z };
			parms.x -= 50;
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
			}
		};

		this.moveRight = function () {
			let parms = { action: "setPosition", x: playerState.position.x, y: playerState.position.y, z: playerState.position.z };
			parms.x += 50;
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
			}
		};

		this.enlarge = function () {
			let maxScale = 2.0;
			if (playerState.scale.x >= maxScale) {
				return;
			}
			let parms = { action: "setScale", x: playerState.scale.x, y: playerState.scale.y, z: playerState.scale.z };
			parms.x += 0.3;
			parms.y += 0.3;
			parms.z += 0.3;
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
			}
		};

		this.narrow = function () {
			let minScale = 1.0;
			if (playerState.scale.x <= minScale) {
				return;
			}
			let parms = { action: "setScale", x: playerState.scale.x, y: playerState.scale.y, z: playerState.scale.z };
			parms.x -= 0.3;
			parms.y -= 0.3;
			parms.z -= 0.3;
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
			}
		};

		let startSpeak = function () {
			let parms = { action: "startSpeak" };
			if (unityInstance) {
				unityInstance.SendMessage("DigitalPlayer", "OnWebMsg", JSON.stringify(parms));
			}
		};

		this.startSpeak = startSpeak;

		//循环执行数字人动作
		let doAllAction = function () {
			currentAction++;
			if (currentAction >= actions.length) {
				currentAction = 0;
			}
			let action = actions[currentAction];
			alert(action);
			doAction(action);
			// var parms = {action:"doUnitAnimation",animate:actions[currentAction]};
			// if(unityInstance){
			// 	unityInstance.SendMessage("DigitalPlayer","OnWebMsg",JSON.stringify(parms));
			// }
		};

		this.doAllAction = doAllAction;

		//获取关键词的动作和位置集合
		var GetAnimatePoint = function (speakText, animateList) {
			let resKeysMap = {};
			for (let animateKey in animateList) {
				let animateListItem = animateList[animateKey];
				let animateStr = animateListItem.split("，");
				for (let i = 0; i < animateStr.length; i++) {
					let animateStrItem = animateStr[i];
					for (let j = -1; (j = speakText.indexOf(animateStrItem, j + 1)) != -1; ++j) {
						let hasAdd = false;
						for (let k in resKeysMap) {//避免重复匹配，子集匹配的问题，k,开始索引k
							let tempAnimateValue = resKeysMap[k]["animateValue"];
							if (animateStrItem.length < tempAnimateValue.length) {//当前的字符短
								if (tempAnimateValue.indexOf(animateStrItem) > -1) {//当前的为子集
									if (j >= k && j <= k + tempAnimateValue.length) {
										hasAdd = true;
									}
								}
							} else if (animateStrItem.length > tempAnimateValue.length) {//当前的字符长
								if (animateStrItem.indexOf(tempAnimateValue) > -1) {//当前的为父集
									if (j <= k && k <= j + tempAnimateValue.length) {
										delete resKeysMap[k];//如果用HashMap则会出现线程安全问题。
									}
								}
							} else {//长度相等
								if (animateStrItem === tempAnimateValue) {//字符相等
									if (j == k) {//起点相等
										hasAdd = true;
									}
								}
							}
						}
						if (!hasAdd) {
							let keyItem = {};
							keyItem["animateKey"] = animateKey;
							keyItem["animateValue"] = animateStrItem;
							resKeysMap[j] = keyItem;
						}
					}

				}

			};
			return resKeysMap;
		};

		//获取指令词的动作和位置集合
		var GetAnimateOrderPoint = function (speakText, animateList) {
			let resKeysMap = {}, matchInfoArr = [], match = {};
			while ((match = mathActionStr(speakText)) != null) {
				let matchInfo = {
					point: match.index,
					matchLen: Number(match[0].length),
					matchText: match[0]
				};
				speakText = speakText.substring(0, matchInfo.point) + speakText.substring((matchInfo.point + matchInfo.matchLen));
				matchInfoArr.push(matchInfo);
			}
			for (let i = 0; i < matchInfoArr.length; i++) {
				for (let animateKey in animateList) {
					let animateValue = animateList[animateKey];
					if (matchInfoArr[i].matchText == animateValue) {
						let keyItem = {};
						keyItem["animateKey"] = animateKey;
						keyItem["animateValue"] = animateValue;
						resKeysMap[matchInfoArr[i].point] = keyItem;
						break;
					}
				};
			}
			return resKeysMap;
		};

		//数字人显示或隐藏
		this.showOrHide = function (isShow) {
			if (isShow) {
				document.getElementById(digitalPlayer).style.visibility = "visible";
				that.isDigitalShow = true;
			} else {
				document.getElementById(digitalPlayer).style.visibility = "hidden";
				that.isDigitalShow = false;
			}
		};



		//接手数字人发送过来的信息
		this.getUnityMsg = function (msg) {
			return msg;
		};

		window.getUnityMsg = this.getUnityMsg;


		//数字人状态同步
		this.WebPlayerStateSync = function (positionJson, rotationJson, scaleJson) {
			let position = JSON.parse(positionJson);
			let angle = JSON.parse(rotationJson);
			let scale = JSON.parse(scaleJson);
			playerState.position.x = Number(position.x.toFixed(2));
			playerState.position.y = Number(position.y.toFixed(2));
			playerState.position.z = Number(position.z.toFixed(2));
			playerState.angle.x = Number(angle.x.toFixed(2));
			playerState.angle.y = Number(angle.y.toFixed(2));
			playerState.angle.z = Number(angle.z.toFixed(2));
			playerState.scale.x = Number(scale.x.toFixed(3));
			playerState.scale.y = Number(scale.y.toFixed(3));
			playerState.scale.z = Number(scale.z.toFixed(3));
		};

		window.WebPlayerStateSync = this.WebPlayerStateSync;

		//数字人起始状态同步
		this.WebPlayerStart = function (positionJson, rotationJson, scaleJson) {
			let position = JSON.parse(positionJson);
			let angle = JSON.parse(rotationJson);
			let scale = JSON.parse(scaleJson);
			playerInitState.position.x = Number(position.x.toFixed(2));
			playerInitState.position.y = Number(position.y.toFixed(2));
			playerInitState.position.z = Number(position.z.toFixed(2));
			playerInitState.angle.x = Number(angle.x.toFixed(2));
			playerInitState.angle.y = Number(angle.y.toFixed(2));
			playerInitState.angle.z = Number(angle.z.toFixed(2));
			playerInitState.scale.x = Number(scale.x.toFixed(3));
			playerInitState.scale.y = Number(scale.y.toFixed(3));
			playerInitState.scale.z = Number(scale.z.toFixed(3));
			//that.changeCanvas();
			that.setPlayerState(startState);
			if (initComplteListener) {
				initComplteListener();
			}
		};

		window.WebPlayerStart = this.WebPlayerStart;

		//查找动作是否在动作列表内
		let findAction = function (originText) {
			if (that.matchType == 0) {
				that.testAnimateHasMap = that.testAnimateHasMap0;
			} else if (that.matchType == 1) {
				that.testAnimateHasMap = that.testAnimateHasMap1;
			}
			let action = originText.trim();
			if (that.testAnimateHasMap[action]) {
				return that.testAnimateHasMap[action];
			} else {
				for (let key in that.testAnimateHasMap) {
					if (that.testAnimateHasMap[key] === action) {
						return key;
					}
				}
			}
		};

		//查找英文单词的动作位置，将发音长度标记处理，并将单词替换为发音长度个"#"
		let findEnglishWordMatchPoint = function (str) {
			englishWordIndexMatchArr = [];
			let match = {};
			while ((match = mathStr(str)) != null) {
				let matchInfo = {
					point: match.index,
					match: match[0],
					matchLen: Number(match[0].length),
					textLen: Number(match[0].replace("[=&", "").replace("]", "").split("&")[0]),
					speakLen: Number(match[0].replace("[=&", "").replace("]", "").split("&")[1]),
					//speakText:str.substring((match.index+Number(match[0].length)),(match.index+Number(match[0].length)) + Number(match[0].replace("[=","").replace("]","").split("&")[0]))
				};
				matchInfo.speakText = str.substring(matchInfo.point + matchInfo.matchLen, matchInfo.point + matchInfo.matchLen + matchInfo.textLen);
				englishWordIndexMatchArr.push(matchInfo);
				let midStr = "";
				for (let i = 0; i <= matchInfo.speakLen; i++) {
					midStr += "#";
				}
				str = str.substring(0, matchInfo.point) + midStr + str.substring((matchInfo.point + matchInfo.matchLen + matchInfo.textLen));
			}
			return str.trim();
		};

		let kdxfDealTag = function (str) {//科大讯飞处理标记
			str = dealActionTag(str);
			str = str.replace(/\[=&.+?\]/g, "");
			return str.trim();
		};

		this.kdxfDealTag = kdxfDealTag;

		let aliyunDealTag = function (str) {//阿里云处理标记
			str = dealActionTag(str);
			str = str.replace(/\[[=|n].+?\]/g, "");
			return str.trim();
		};

		this.aliyunDealTag = aliyunDealTag;

		let DeletePolyPhone = function (str) {//处理标记
			str = dealActionTag(str);
			str = str.replace(/\[[=|n].+?\]/g, "");
			return str.trim();
		};

		this.stopPlay = function () {
			if (audio) {
				audio.pause();
			}

		};

		var mathActionStr = function (str) {//封装函数，避免匹配漏缺
			let re = /\[a.+?\]/g;
			return re.exec(str);
		};

		//按比例缩放数字人画布
		this.changeCanvas = function () {
			let scale = 1.25;
			let width = document.getElementById("#canvas").width;
			let height = document.getElementById("#canvas").height;
			document.getElementById("#canvas").width = width * scale;
			document.getElementById("#canvas").height = height * scale;
			document.getElementById("#canvas").style.marginLeft = (width * scale - width) / 2 + "px";
			document.getElementById("#canvas").style.marginTop = (height - height * scale) / 2 + "px";
		};

		//数字人开始播放话术，并执行动作匹配process
		this.ttsAndPlay = function (playText, audio, voiceData) {
			that.originText = playText;
			if (that.originText && voiceData) {
				audio.src = "data:audio/wav;base64," + voiceData;
			} else if (playText) {
				let action = findAction(that.originText);
				if (action) {
					doAction(action);
				}
			}
		};

		//科大讯飞语音播放
		this.kdxfTtsAndPlay = function (playText, requestPlay, endCB) {
			that.originText = playText;
			if (that.originText && requestPlay) {
				setTimeout(() => {
					that.voicePlay();
				}, 100);
				that.voicePrepare();
				requestPlay();
				if (endCB) {
					kdxfVoiceEnd = endCB;
				} else {
					kdxfVoiceEnd = undefined;
				}
			} else if (playText) {
				let action = findAction(that.originText);
				if (action) {
					doAction(action);
				}
			}
		};
	};

	DigitalPlayer.init = function (digitalPlayer, container, audio, callback) {
		let digital = new DigitalPlayer(digitalPlayer, container, audio);
		window.wife = digital
		callback(digital);
		console.log("嗨嗨嗨我生出来")
	};


	window.DigitalPlayer = DigitalPlayer;
	//import io from 'socket.io-client'
	// window.socket=io('http://127.0.0.1:5000/')
})(window);

export default window.DigitalPlayer;
