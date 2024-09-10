(function (window) {
	//兼容
	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	let errorCallback = undefined;

	let HZRecorder = function (stream, config) {
		config = config || {};
		config.sampleBits = config.sampleBits || 16;      //采样数位 8, 16
		config.sampleRate = config.sampleRate || (8000);   //采样率(1/6 44100)


		let context = new AudioContext();
		let audioInput = context.createMediaStreamSource(stream);
		let recorder = context.createScriptProcessor(4096, 1, 1);
		let isStop = false;
		let voiceVal = 0;//音量大小
		let isSpeaking = false;//是否正在说话
		let speakInterval = 500;//说话间隔
		let speakTimer = undefined;//说话间隔计时器
		let speakThreshold = 20;//人声录入阈值（即音量大于多少才算有人说话）
		let maxBufferLength = 200;//语音识别缓存数据最大长度
		let that = this;
		let recordCallback = undefined;
		let uploadFunction = undefined;
		let uploadCallback = undefined;
		this.speakInterval = speakInterval;
		this.speakThreshold = speakThreshold;
		this.isVoicePlay = false;


		let audioData = {
			size: 0          //录音文件长度
			, buffer: []     //录音缓存
			, preSize: 0		//音频数据前置数据长度
			, preBuffer: []  //音频数据前置数据缓存
			, preBufferMaxLen: 3 //音频数据前置数据数组最大长度
			, inputSampleRate: context.sampleRate    //输入采样率
			, inputSampleBits: 16       //输入采样数位 8, 16
			, outputSampleRate: config.sampleRate    //输出采样率
			, oututSampleBits: config.sampleBits       //输出采样数位 8, 16
			, input: function (data) {
				if (isSpeaking) {
					console.log("isSpeaking")
					this.buffer.push(new Float32Array(data));
					this.size += data.length;
				} else {
					//记录非说话期间，指定长度的语音数据
					if (this.preBuffer.length >= this.preBufferMaxLen) {
						this.preBuffer.shift();
					}
					this.preBuffer.push(new Float32Array(data));
					this.preSize = data.length * this.preBuffer.length;
				}

			}
			, compress: function () { //合并压缩
				//说话期间数据前面合并前面一小段数据，防止第一个字识别不出
				this.buffer = this.preBuffer.concat(this.buffer);
				this.size = this.preSize + this.size;
				//合并
				let data = new Float32Array(this.size);
				let offset = 0;
				for (let i = 0; i < this.buffer.length; i++) {
					data.set(this.buffer[i], offset);
					offset += this.buffer[i].length;
				}
				//压缩
				let compression = parseInt(this.inputSampleRate / this.outputSampleRate);
				let length = data.length / compression;
				let result = new Float32Array(length);
				let index = 0, j = 0;
				while (index < length) {
					result[index] = data[j];
					j += compression;
					index++;
				}
				return result;
			}
			, encodeWAV: function () {
				let sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
				let sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
				let bytes = this.compress();
				let dataLength = bytes.length * (sampleBits / 8);
				let buffer = new ArrayBuffer(44 + dataLength);
				let data = new DataView(buffer);


				let channelCount = 1;//单声道
				let offset = 0;


				let writeString = function (str) {
					for (let i = 0; i < str.length; i++) {
						data.setUint8(offset + i, str.charCodeAt(i));
					}
				};

				// 资源交换文件标识符 
				writeString("RIFF"); offset += 4;
				// 下个地址开始到文件尾总字节数,即文件大小-8 
				data.setUint32(offset, 36 + dataLength, true); offset += 4;
				// WAV文件标志
				writeString("WAVE"); offset += 4;
				// 波形格式标志 
				writeString("fmt "); offset += 4;
				// 过滤字节,一般为 0x10 = 16 
				data.setUint32(offset, 16, true); offset += 4;
				// 格式类别 (PCM形式采样数据) 
				data.setUint16(offset, 1, true); offset += 2;
				// 通道数 
				data.setUint16(offset, channelCount, true); offset += 2;
				// 采样率,每秒样本数,表示每个通道的播放速度 
				data.setUint32(offset, sampleRate, true); offset += 4;
				// 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8 
				data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true); offset += 4;
				// 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8 
				data.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
				// 每样本数据位数 
				data.setUint16(offset, sampleBits, true); offset += 2;
				// 数据标识符 
				writeString("data"); offset += 4;
				// 采样数据总数,即数据总大小-44 
				data.setUint32(offset, dataLength, true); offset += 4;
				// 写入采样数据 
				if (sampleBits === 8) {
					for (var i = 0; i < bytes.length; i++, offset++) {
						var s = Math.max(-1, Math.min(1, bytes[i]));
						let val = s < 0 ? s * 0x8000 : s * 0x7FFF;
						val = parseInt(255 / (65535 / (val + 32768)));
						data.setInt8(offset, val, true);
					}
				} else {
					for (var i = 0; i < bytes.length; i++, offset += 2) {
						var s = Math.max(-1, Math.min(1, bytes[i]));
						data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
					}
				}


				return new Blob([data], { type: "audio/wav" });
			},
			getVoiceVal: function (buffer) {
				let maxVal = 0;
				maxVal = Math.max.apply(Math, buffer);
				return Math.round(maxVal * 100);
			}
		};


		//开始录音
		this.start = function () {
			if (isStop) {
				this.clearAudioData();
				isStop = false;
			}
			audioInput.connect(recorder);
			recorder.connect(context.destination);
			isSpeaking = false;
		};


		//停止
		this.stop = function () {
			isStop = true;
			recorder.disconnect();
			audioInput.disconnect();
		};

		//暂停
		this.pause = function () {
			recorder.disconnect();
			isSpeaking = false;
		};

		//获取音频文件
		this.pauseAndGetBlob = function () {
			this.pause();
			return audioData.encodeWAV();
		};

		//获取音频文件
		this.getBlob = function () {
			return audioData.encodeWAV();
		};

		//回放
		this.play = function (audio) {
			audio.src = window.URL.createObjectURL(this.pauseAndGetBlob());
		};

		//清空音频数据
		this.clearAudioData = function () {
			audioData.buffer = [];
			audioData.size = 0;
			audioData.preBuffer = [];
			audioData.preSize = 0;
		};

		this.blobToDataURI = function (blob, callback) {
			let reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = function (e) {
				callback(e.target.result);
			};
		};

		//上传
		this.setRecordCallback = function (uploadFunction, uploadCallback, recordCallback) {
			this.uploadFunction = uploadFunction;
			this.uploadCallback = uploadCallback;
			this.recordCallback = recordCallback;
		};

		//上传
		this.upload = function () {
			that.toUpLoad(that.getBlob(), that.uploadFunction, that.uploadCallback);
		};

		this.toUpLoad = function (voiceBlob, uploadFunction, uploadCallback) {
			this.blobToDataURI(voiceBlob, function (voiceBase64) {
				if (uploadFunction) {
					uploadFunction(voiceBase64.replace("data:audio/wav;base64,", ""), uploadCallback);
				}
			});
		};

		//音频采集
		recorder.onaudioprocess = function (e) {
			if (that.isVoicePlay) {
				return;
			}
			audioData.input(e.inputBuffer.getChannelData(0));
			voiceVal = audioData.getVoiceVal(e.inputBuffer.getChannelData(0));
			if (that.recordCallback) {
				that.recordCallback(voiceVal);
			}
			//record(e.inputBuffer.getChannelData(0));
			//console.log("voiceVal", voiceVal);
			if (voiceVal > that.speakThreshold) {
				//console.log("voiceVal", voiceVal);
				isSpeaking = true;

				if (speakTimer) {
					clearTimeout(speakTimer);
					speakTimer = undefined;
				}
				if (audioData.buffer.length === 0) {
					window.lastFocusInput = document.querySelector("input:focus,textarea:focus") || null;
				}
				if (audioData.buffer.length >= maxBufferLength) {
					that.toUpLoad(that.getBlob(), that.uploadFunction, that.uploadCallback);
					that.clearAudioData();
				}
			} else {
				if (isSpeaking) {
					if (!speakTimer) {
						speakTimer = setTimeout(() => {
							isSpeaking = false;
							that.toUpLoad(that.getBlob(), that.uploadFunction, that.uploadCallback);
							that.clearAudioData();
						}, that.speakInterval);
					}
				}

			}
		};


	};
	//抛出异常
	HZRecorder.throwError = function (message) {
		console.log("数字人，HZRecorder throwError", message);
		//throw new function () { this.toString = function () { return message; } }
	};
	//是否支持录音
	HZRecorder.canRecording = (navigator.getUserMedia != null);
	//获取录音机
	HZRecorder.get = function (callback, errorCb, config) {
		errorCallback = errorCb;
		if (callback) {
			if (navigator.getUserMedia) {
				navigator.getUserMedia(
					{ audio: true } //只启用音频
					, function (stream) {
						let rec = new HZRecorder(stream, config);
						callback(rec);
					}
					, function (error) {
						switch (error.code || error.name) {
							case "PERMISSION_DENIED":
							case "PermissionDeniedError":
								recordError("用户拒绝提供信息。");
								//HZRecorder.throwError('用户拒绝提供信息。');
								break;
							case "NOT_SUPPORTED_ERROR":
							case "NotSupportedError":
								recordError("浏览器不支持硬件设备。");
								//HZRecorder.throwError('浏览器不支持硬件设备。');
								break;
							case "MANDATORY_UNSATISFIED_ERROR":
							case "MandatoryUnsatisfiedError":
								recordError("无法发现指定的硬件设备。");
								//HZRecorder.throwError('无法发现指定的硬件设备。');
								break;
							default:
								recordError("无法打开麦克风。异常信息:" + (error.code || error.name));
								//HZRecorder.throwError('无法打开麦克风。异常信息:' + (error.code || error.name));
								break;
						}
					});
			} else {
				recordError("当前浏览器不支持录音功能。");
				//HZRecorder.throwErr('当前浏览器不支持录音功能。'); return;
			}
		}
	};

	var recordError = function (error) {
		if (errorCallback) {
			errorCallback(error);
		}
	};


	window.HZRecorder = HZRecorder;


})(window);

export default window.HZRecorder;