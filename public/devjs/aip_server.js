/*
 * 方法中的参数解释
 * p1,CallBack,CallData,ErrMsg
 *
 * p1代表的方法实际参数,
 * CallBack表示方法执行完成后,的回调函数
 * CallData 表示方法执行完成后的的返回参数
 * ErrMsg 表示方法执行出错后的错误信息
 * for example
 * 控件中有一个方法(打开文件):LoadFile(p1,CallBack,CallData,ErrMsg)
 * 有一个回调函数 afterLoadFile(retData)
 * 如何调用打开文件方法
 * LoadFile('',afterLoadFile,"","打开出错")//打开文件异常时,会弹出打开出错对话框
 *
 */

var idSetShowView = 1;
var idGetShowView = 536870913;
var idSetShowToolBar = 2;
var idGetShowToolBar = 536870914;
var idSetShowFullScreen = 3;
var idGetShowFullScreen = 536870915;
var idSetCurrPage = 4;
var idGetCurrPage = 536870916;
var idGetPageCount = 5;
var idSetCurrPenWidth = 8;
var idGetCurrPenWidth = 536870920;
var idSetShowDefMenu = 9;
var idGetShowDefMenu = 536870921;
var idGetLVersion = 10;
var idSetTextSmooth = 11;
var idGetTextSmooth = 536870923;
var idSetPressurelevel = 12;
var idGetPressurelevel = 536870924;
var idSetShowScrollBarButton = 13;
var idGetShowScrollBarButton = 536870925;
var idGetCurrDocType = 14;
var idSetPathName = 15;
var idGetPathName = 536870927;
var idSetShowRevisions = 20;
var idGetShowRevisions = 536870932;
var idSetAppendTipInfo = 21;
var idGetSetAppendTipInfo = 536870933;
var idLoadFile = 22;
var idSetValue = 23;
var idGetValue = 24;
var idIsSaved = 25;
var idIsOpened = 26;
var idGetDocText = 27;
var idModifyName = 28;
var idIsLogin = 29;
var idGetCurrUserID = 30;
var idGetUserRemoteAddr = 31;
var idIsUserExist = 32;
var idGetUserInfo = 33;
var idShowAllNotes = 34;
var idSaveTo = 35;
var idGetNextUser = 36;
var idPrintDoc = 37;
var idCanUndo = 38;
var idCanRedo = 39;
var idUndo = 40;
var idRedo = 41;
var idUndoAll = 42;
var idRedoAll = 43;
var idCloseDoc = 44;
var idLogin = 45;
var idGetNextNote = 46;
var idSetPageMode = 47;
var idGetPageMode = 48;
var idGetOriginalFile = 49;
var idGetOriginalFileName = 50;
var idGetOriginalFileCount = 51;
var idSetUserVisible = 53;
var idAddDocProperty = 54;
var idDelDocProperty = 55;
var diGetNextDocProperty = 56;
var idHttpAddPostFile = 57;
var idHttpAddPostValue = 58;
var idHttpAddPostString = 59;
var idHttpAddPostBuffer = 60;
var idHttpInit = 61;
var idHttpPost = 62;
var idFtpConnect = 63;
var idFtpDisConnect = 64;
var idFtpGetFile = 65;
var idFtpPutFile = 66;
var idHttpAddPostCurrFile = 67;
var idLoadFileEx = 68;
var idSetCurrUserVisibilityForUser = 69;
var idSetCurrUserVisibilityPwd = 70;
var idShowFileInfo = 71;
var idShowFileSecurity = 72;
var idLoadOriginalFile = 74;
var idHideMenuItem = 75;
var idProtectDoc = 76;
var idGetCurrUserAccess = 78;
var idCopySelectText = 79;
var idSearchText = 80;
var idLogout = 81;
var idChangeCurrUserPwd = 82;
var idGetDocumentObject = 83;
var idConvertToAip = 84;
var idInputHotKey = 85;
var idLoginEx = 87;
var idInsertEmptyPage = 88;
var idMergeFile = 89;
var idGetCurrServer = 90;
var idAcceptAllRevisions = 91;
var idSetSaved = 92;
var idGetCurrFileBase64 = 93;
var idLoadFileBase64 = 94;
var idSetFieldValue = 95;
var idAddQifengSeal = 96;
var idPrintDocEx = 98;
var idInsertNote = 99;
var idSetNotePos = 101;
var idDeleteLocalFile = 102;
var idGetTempFileName = 103;
var idGetNoteNum = 105;
var idInsertDepartmentCopy = 106;
var idSetPrintCopyList = 107;
var idDeleteNote = 108;
var idGrayData = 109;
var idGetRotateType = 110;
var idSetRotateType = 111;
var idSaveToTiff = 112;
var idGetNotePosX = 113;
var idGetNotePosY = 114;
var idGetErrorString = 115;
var idSetValueEx = 116;
var idIsProtect = 117;
var idGetNoteWidth = 118;
var idGetNoteHeight = 119;
var idGetValueEx = 120;
var idMergerPage = 121;
var idGetPageWidth = 122;
var idGetPageHeight = 123;
var idSetJSEnv = 125;
var idGetJSEnv = 536871037;
var idSetJSValue = 126;
var idGetJSValue = 536871038;
var idJSGetPageMode = 128;
var idJSGetCurrServer = 129;
var idShowMessage = 130;
var idGetCurrFileSize = 131;
var idGetFileSize = 132;
var idGetSerialNumber = 133;
var idBeforeConvert = 134;
var idAfterConvert = 135;
var idSleepSecond = 137;
var idProtectObject = 138;
var idConvertXYModeW = 139;
var idConvertXYModeH = 140;
var idGetUserInfoEx = 141;
var idSetUserInfoEx = 142;
var idSetCustomColour = 143;
var idGetCustomColour = 144;
var idSetWaterMarkMode = 146;
var idGetWaterMarkMode = 536871058;
var idSetWaterMarkAlpha = 147;
var idGetWaterMarkAlpha = 536871059;
var idSetWaterMarkTextOrPath = 148;
var idGetWaterMarkTextOrPath = 536871060;
var idSetWaterMarkTxtHOrImgZoom = 150;
var idGetWaterMarkTxtHOrImgZoom = 536871062;
var idSetWaterMarkPosX = 151;
var idGetWaterMarkPosX = 536871063;
var idSetWaterMarkPosY = 152;
var idGetWaterMarkPosY = 536871064;
var idSetWaterMarkTextColor = 153;
var idGetWaterMarkTextColor = 536871065;
var idSetWaterMarkAngle = 154;
var idGetWaterMarkAngle = 536871066;
var idSetCurrXYMode = 155;
var idGetCurrXYMode = 536871067;
var idDeletePage = 158;
var idSetCurrTime = 160;
var idSetInDesignMode = 161;
var idGetInDesignMode = 536871073; //536870912
var idInsertPicture = 162;
var idInsertNoteEx = 163;
var idRunCommand = 164;
var idSetCurrTextEditUser = 166;
var idGetCurrTextEditUser = 536871078; //536870912
var idSaveAsBase64 = 167;
var idBeforeConvertEx = 169;
var idInsertNote2 = 170;
var idShowDialog = 171;
var idVerifyNotes = 172;
var idGetOriginalFileType = 173;
var idGetHttpPostData = 177;
var idGetCurrSubjectName = 176;
var idGetCurrSerialNumber = 175;
var idSetBackgroundDoc = 178;
var idGotoPosition = 179;
var idGetBMPos = 180;
var idPartialProtect = 181;
var idGetFileBase64 = 182;
var idSaveBinaryFileFromBase64 = 183;
var idGetFileListUnderDir = 184;
var idStartDrawDoc = 185;
var idStartDrawPage = 186;
var idEndDrawPage = 187;
var idEndDrawDoc = 188;
var idExportEditNodeValue = 189;
var idGetPrinterList = 190;
var idGetPrinterStatusByStr = 191;
var idGetJobInfoByStr = 192;
var idResetPrinterByStr = 193;
var idSignData = 194;
var idVerifyData = 195;
var idForceSignType3 = 196;
var idSplitPages = 197;
var idVerifyDocText = 198;
var idGetCurrPagePos = 199;
var idSetCurrPagePos = 200;

var idFindText = 201;
var idSetFieldShowInfo = 202;
var idHideBarItems = 203;
var idIsEmptyDoc = 204;
var idLoadOriginalFileAsync = 205;
var idLoadFileExAsync = 206;
var idZipDir = 207;
var idUnzipFile = 208;
var idEncFile = 209;
var idDecFile = 210;
var idUpdateAllField = 211;
var idSaveLoadOri = 212;
var idShowPaperFile = 213;
var idClosePaperFile = 214;
var idAddSealByDir = 215;
var idLoadBinary = 218;
var idLoadBinary2 = 219;
var idWriteLocalFile = 220;
var idReadLocalFile = 221;
var idHttpAddPostCurrFileEx = 222;
var idStartDownloadFile = 223;
var idStopDownloadFile = 224;
var idCreateFolder = 225;
var idDeleteFolder = 226;
var idCopyLocalFile = 227;
var idGetNoteByIndex = 228;
var idSaveBinary = 229; //返回一个byte数组
var idExecuteCmd = 232;
var idSetPrnBarInfo = 233;
var idInsertEmbFile = 234;
var idGetSheetCount = 235;
var idGetSheetName = 236;
var idGetSheetIndex = 237;
var idGetSheetRangeText = 238;
var idGetSheetRangeValue = 239;
var idGetSheetRangeFormula = 240;
var idProtectSheet = 241;
var idIsFolderExist = 242;
var idGetFileInfo = 243;

var idShowWnd = 990;
var idShowMax = 991;
var idShowToSec = 992;
var idShowToSecMax = 993;
var idHideWnd = 994;

var idSetDispidShowWndLevel = 996;
var idSetDispidShowWndPos = 997;
var iddispidEnableCloseBtn = 998;
var idSetDispidHideTitle = 999;
var idCheckApp = 1000;


var DSP_MODE_PRIMARY_MAX = 1;
var DSP_MODE_PRIMARY_LEFTTOP = 2;
var DSP_MODE_PRIMARY_LEFTCENTER = 3;
var DSP_MODE_PRIMARY_LEFTBOTTOM = 4;
var DSP_MODE_PRIMARY_RIGHTTOP = 5;
var DSP_MODE_PRIMARY_RIGHTCENTER = 6;
var DSP_MODE_PRIMARY_RIGHTBOTTOM = 7;
var DSP_MODE_PRIMARY_MIDDLETOP = 8;
var DSP_MODE_PRIMARY_MIDDLECENTER = 9;
var DSP_MODE_PRIMARY_MIDDLEBOTTOM = 10;
var DSP_MODE_SEC_MAX = 11;
var DSP_MODE_SEC_LEFTTOP = 12;
var DSP_MODE_SEC_LEFTCENTER = 13;
var DSP_MODE_SEC_LEFTBOTTOM = 14;
var DSP_MODE_SEC_RIGHTTOP = 15;
var DSP_MODE_SEC_RIGHTCENTER = 16;
var DSP_MODE_SEC_RIGHTBOTTOM = 17;
var DSP_MODE_SEC_MIDDLETOP = 18;
var DSP_MODE_SEC_MIDDLECENTER = 19;
var DSP_MODE_SEC_MIDDLEBOTTOM = 20;

/*事件id
 [id(1)] void NotifyClick(BSTR pcName);
 [id(2)] void NotifyChangeValue(BSTR pcName, BSTR pcNewValue);
 [id(3)] void NotifyReset(BSTR pcName);
 [id(4)] void NotifySumbit(BSTR pcName);
 [id(5)] void NotifyDocOpened(long lOpenResult);
 [id(6)] void NotifyChangePage();
 [id(7)] void NotifyChangeCurrUser();
 [id(8)] void NotifyCloseDoc();
 [id(9)] void NotifyChangePenColor();
 [id(10)] void NotifyChangePenWidth();
 [id(11)] void NotifyCtrlReady();
 [id(12)] void NotifyMenuMsg(long lCmd, long* plContinue);
 [id(13)] void NotifyModifyStatus();
 [id(14)] void NotifyFullScreen();
 [id(15)] void NotifyPosChange(BSTR pcNoteName);
 [id(16)] void NotifySelect(BSTR pcName, long lNoteType);
 [id(17)] void JSNotifyMenuMsg(long lCmd);
 [id(18)] void NotifyBeforeAction(long lActionType, long lType, BSTR strName, BSTR strValue, long* plContinue);
 [id(19)] void JSNotifyBeforeAction(long lActionType, long lType, BSTR strName, BSTR strValue);
 [id(20)] void NotifyLineAction(long lPage, long lStartPos, long lEndPos);
 [id(21)] void NotifyDocumentEvent(BSTR strName);
 [id(22)] void NotifyAfterAction(long lActionType, long lType, BSTR strName, BSTR strValue);
 [id(23)] void NotifyChangeStatus(long lStatusType);
 [id(24)] void NotifyPressPen(long lScreenX, long lScreenY, long lPress);
 [id(25)] void NotifyAsyncCall(long lCallID, long lRet, BSTR strRet);
 [id(30)] aip窗口关闭事件
 */

/**
 * 盖章对象信息
 * @param sealType 盖章类型 1绝对坐标盖章, 2文字定位盖章, 3多页绝对坐标盖章, 4多页骑缝章 5 手动盖章
 * @param sealArgs 盖章所需参数
 * @param isSeal 是否正在盖章
 * @constructor
 */
function SealInfo(sealType, sealArgs, isSeal) {
  this.sealType = sealType;
  this.sealArgs = sealArgs;
  this.isSeal = isSeal;
}




function handleMessage(backObj) {
  if (!backObj) {
    alert("调用失败,无法获取返回结果");
    return;
  }

  var callBackData = backObj.data;
  if (!callBackData) {
    alert("调用失败,无法获取返回结果");
    return;
  }
  var callBackFunc = callBackData.CallBack;
  var nextFunc = new Function("" + callBackFunc + "('" + JSON.stringify(callBackData) + "')");
  nextFunc();
}

/*
 * 向aip组件发送信息
 * @param cmddata 组件命令
 * @param callBack  回调函数
 * @param callData 回传数据
 * @param ErrMsgData 调用失败后显示的数据
 * @constructor
 */
function InvokePPAPI(cmddata, callBack, callData, ErrMsgData) {
  var plugin = document.getElementById('djPPAPI');
  plugin.postMessage({
    cmdbody: "CMDDATA:" + cmddata,
    CallBack: callBack,
    CallData: callData,
    ErrMsg: ErrMsgData
  });
}


/**
 * 默认回调函数
 * @param callBackData
 * @constructor
 */
function HWCallBack(callBackData) {}

/**
 * 默认点击事件
 * 解决chrome浏览器无法获取焦点问题
 */
function defaultClick() {
  console.log(1233444);
}


/**
 * 不再使用
 * @param nMode  显示aip窗体
 * @param nWRadio 窗体占比
 * @param nHRadio 窗体占比
 * @param CallBack
 * @param CallData
 * @param ErrMsg
 * @constructor
 */
function ShowAipWnd(nMode, nWRadio, nHRadio, CallBack, CallData, ErrMsg) {
  var cmddata = "990;|;2," + nMode + "|;|2," + nWRadio + "|;|2," + nHRadio;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

function ShowAipWndMax(CallBack, CallData, ErrMsg) {
  var cmddata = "991;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

function ShowAipWndToSec(CallBack, CallData, ErrMsg) {
  var cmddata = "992;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

function ShowAipWndToSecMax(CallBack, CallData, ErrMsg) {
  var cmddata = "993;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

function HideAipWnd(CallBack, CallData, ErrMsg) {
  var cmddata = "994;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}


/*
 * 文档视图设置
 * @param p1 参数
 * @param CallBack
 * @param CallData
 * @param ErrMsg
 * @constructor
 */
function SetShowView(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "1;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

/*
 *返回文档视图
 * @param CallBack
 * @param CallData
 * @param ErrMsg
 * @constructor
 */
function GetShowView(CallBack, CallData, ErrMsg) {
  var cmddata = "536870913;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置工具栏显示状态
function SetShowToolBar(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "2;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置控件菜单显示状态。
function SetShowDefMenu(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "9;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回控件菜单显示状态。
function GetShowDefMenu(CallBack, CallData, ErrMsg) {
  var cmddata = "536870921;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

/*
 * 获取工具栏显示状态
 * @param CallBack
 * @param CallData
 * @param ErrMsg
 * @constructor
 */
function GetShowToolBar(CallBack, CallData, ErrMsg) {
  var cmddata = "536870914;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置全屏显示状态
function SetShowFullScreen(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "3;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回全屏显示状态
function GetShowFullScreen(CallBack, CallData, ErrMsg) {
  var cmddata = "536870915;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置当前页索引（0,1,2,...）。
function SetCurrPage(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "3;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置或返回当前页索引从0开始
function GetCurrPage(CallBack, CallData, ErrMsg) {
  var cmddata = "536870916;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回当前文档的总页数
function GetPageCount(CallBack, CallData, ErrMsg) {
  var cmddata = "536870917;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置当前笔的宽度(用户必须登录)。
function SetCurrPenWidth(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "8;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回当前笔的宽度(用户必须登录)。
function GetCurrPenWidth(CallBack, CallData, ErrMsg) {
  var cmddata = "536870920;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置操作状态。
function CurrAction(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "6;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回当前版本号。
function GetLVersion(CallBack, CallData, ErrMsg) {
  var cmddata = "536870922;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置当前文字平滑状态。
function SetTextSmooth(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "11;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回当前文字平滑状态。
function GetTextSmooth(CallBack, CallData, ErrMsg) {
  var cmddata = "536870923;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置当前压感灵敏度级别。
function SetPressurelevel(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "12;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回当前压感灵敏度级别。
function GetPressurelevel(CallBack, CallData, ErrMsg) {
  var cmddata = "536870924;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置滚动条状态。
function SetShowScrollBarButton(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "13;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回滚动条状态。
function GetShowScrollBarButton(CallBack, CallData, ErrMsg) {
  var cmddata = "536870925;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取当前文档类型（必须以LoadOriginalFile装入文档)。
function GetCurrDocType(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "536870926;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}


//设置当前打开的文件的路径。
function SetPathName(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "15;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回当前打开的文件的路径。
function GetPathName(CallBack, CallData, ErrMsg) {
  var cmddata = "536870927;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置当前word文件的修订显示状态。此属性只针对word。
function SetShowRevisions(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "20;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//退出或者进入修订状态
function TractRevisions(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "18;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回当前word文件的修订显示状态。此属性只针对word。
function GetShowRevisions(CallBack, CallData, ErrMsg) {
  var cmddata = "536870932;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置附加信息
function SetAppendTipInfo(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "21;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回附加信息
function GetAppendTipInfo(CallBack, CallData, ErrMsg) {
  var cmddata = "536870933;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}


function LoadFile(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "22;|;3," + p1; //控件中打开文件的cmd命令
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置参数对应的内容
function SetValue(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "23;|;3," + p1 + "|;|3," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得参数对应的值
function GetValue(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "24;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//文件是否被修改
function IsSaved(CallBack, CallData, ErrMsg) {
  var cmddata = "25;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//判断当前是否打开文件
function IsOpened(CallBack, CallData, ErrMsg) {
  var cmddata = "26;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回当前打开的文件中的所有文字
function GetDocText(CallBack, CallData, ErrMsg) {
  var cmddata = "27;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//修改节点的名称
function ModifyName(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "28;|;3," + p1 + "|;3," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//判断当前是否登录
function IsLogin(CallBack, CallData, ErrMsg) {
  var cmddata = "29;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回当前登录用户的用户名
function GetCurrUserID(CallBack, CallData, ErrMsg) {
  var cmddata = "30;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取当前登录用户的远程地址
function GetUserRemoteAddr(CallBack, CallData, ErrMsg) {
  var cmddata = "31;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取是否存在登录用户
function IsUserExist(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "32;|;3," + p1 + "|;|2," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取用户 pcUserID 的用户的相关信息
function GetUserInfo(p1, p2, p3, p4, p5, p6, CallBack, CallData, ErrMsg) {
  var cmddata = "33;|;3," + p1 + "|;|3," + p2 + "|;|2," + p3 + "|;|2," + p4 + "|;|2," + p5 + "|;|2," + p6;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//显示或隐藏所有用户的节点信息
function ShowAllNotes(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "34;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//文件另存
function SaveTo(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "35;|;3," + p1 + "|;|3," + p2 + "|;|2," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取用户 pcUserID 的下一个用户ID
function GetNextUser(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "36;|;3," + p1 + "|;|2," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//打印当前文档
function PrintDoc(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "37;|;2," + p1 + "|;|2," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//判断操作是否可以撤销
function CanUndo(CallBack, CallData, ErrMsg) {
  var cmddata = "38;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//判断操作是否可以恢复
function CanRedo(CallBack, CallData, ErrMsg) {
  var cmddata = "39;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//单步撤销操作
function Undo(CallBack, CallData, ErrMsg) {
  var cmddata = "40;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//单步恢复操作。
function Redo(CallBack, CallData, ErrMsg) {
  var cmddata = "41;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//撤销本次所有操作。
function UndoAll(CallBack, CallData, ErrMsg) {
  var cmddata = "42;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//恢复所有撤销的操作。
function RedoAll(CallBack, CallData, ErrMsg) {
  var cmddata = "43;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//关闭当前文档。
function CloseDoc(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "44;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//登录当前系统。只有登录用户才可以对AIP文件进行操作(批注|盖章... ...)。
function Login(p1, p2, p3, p4, p5, CallBack, CallData, ErrMsg) {
  var cmddata = "45;|;3," + p1 + "|;|2," + p2 + "|;|2," + p3 + "|;|3," + p4 + "|;|3," + p5;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取下一个节点信息。
function GetNextNote(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "46;|;3," + p1 + "|;|2," + p2 + "|;|2," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置页面显示模式。
function SetPageMode(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "47;|;2," + p1 + "|;|2," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取页面显示模式信息。JS环境下需调用JSGetPageMode
function GetPageMode(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "48;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取原始文件
function GetOriginalFile(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "49;|;3," + p1 + "|;|2," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取原始文件名
function GetOriginalFileName(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "50;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取原始文件个数
function GetOriginalFileCount(CallBack, CallData, ErrMsg) {
  var cmddata = "51;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置特定用户的节点信息是否显示
function SetUserVisible(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "53;|;3," + p1 + "|;|2," + p2 + "|;|2," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//添加当前文件的属性和值
function AddDocProperty(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "54;|;3," + p1 + "|;|3," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//删除文件属性
function DelDocProperty(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "55;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取当前属性的下一个属性
function GetNextDocProperty(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "56;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置通过Http上传的文件
function HttpAddPostFile(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "57;|;3," + p1 + "|;|3," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置通过Http上传的数字变量
function HttpAddPostValue(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "58;|;3," + p1 + "|;|2," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置通过Http上传的字符串变量
function HttpAddPostString(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "59;|;3," + p1 + "|;|3," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置通过Http上传的字符串变量
function HttpAddPostBuffer(p1, p2, p3, p4, CallBack, CallData, ErrMsg) {
  var cmddata = "60;|;3," + p1 + "|;|3," + p2 + "|;|3," + p3 + "|;|2," + p4;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//初始化Http,在调用Http的时候必须首先初始化
function HttpInit(CallBack, CallData, ErrMsg) {
  var cmddata = "61;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//触发Http上传Post操作
function HttpPost(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "62;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//连接FTP服务器
function FtpConnect(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "63;|;3," + p1 + "|;|3," + p2 + "|;|3," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//断开FTP服务器连接
function FtpDisConnect(CallBack, CallData, ErrMsg) {
  var cmddata = "64;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//通过FTP下载服务器文件
function FtpGetFile(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "65;|;3," + p1 + "|;|3," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//通过FTP上传本地文件
function FtpPutFile(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "66;|;3," + p1 + "|;|3," + p2 + "|;|2," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置Http上传当前打开的AIP文件
function HttpAddPostCurrFile(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "67;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//打开AIP文件, 如果打开的不是 AIP 文件, 将进行自动转化
function LoadFileEx(p1, p2, p3, p4, CallBack, CallData, ErrMsg) {
  var cmddata = "68;|;3," + p1 + "|;|3," + p2 + "|;|2," + p3 + "|;|2," + p4;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置当前用户的操作对特定用户的可见性
function SetCurrUserVisibilityForUser(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "69;|;3," + p1 + "|;|2," + p2 + "|;|2," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置显示当前用户操作信息的密码。（只有当前登录用户才可以设置）。
function SetCurrUserVisibilityPwd(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "70;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//显示文件属性。
function ShowFileInfo(CallBack, CallData, ErrMsg) {
  var cmddata = "71;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//显示文件安全设置对话框
function ShowFileSecurity(CallBack, CallData, ErrMsg) {
  var cmddata = "72;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//以原始文件打开方式打开或创建文件，不转化为aip文件
function dispidLoadOriginalFile(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "74;|;3," + p1 + "|;|3," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//隐藏指定菜单
function HideMenuItem(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "75;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//保护或解除文档保护
function ProtectDoc(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "76;|;2," + p1 + "|;|3," + p2 + "|;|2," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取当前用户的权限（请参阅方法Login）。
function GetCurrUserAccess(CallBack, CallData, ErrMsg) {
  var cmddata = "78;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//拷贝当前选择的文字到剪贴板
function CopySelectText(CallBack, CallData, ErrMsg) {
  var cmddata = "79;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//查找文字
function SearchText(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "80;|;3," + p1 + "|;|2," + p2 + "|;|2," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//用户退出
function Logout(CallBack, CallData, ErrMsg) {
  var cmddata = "81;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//修改当前用户的登陆密码   参数：原密码，新密码
function ChangeCurrUserPwd(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "82;|;3," + p1 + "|;|3," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//把当前通过LoadOriginalFile打开的原始文件直接转化成AIP文件 参数：blAddOri：0不装载，1装载原始文件 ，blNormal 0不解析文档的书签 1解析文档的书签
function ConvertToAip(blAddOri, blNorma, CallBack, CallData, ErrMsg) {
  var cmddata = "84;|;2," + blAddOri + "|;|2," + blNorma;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//执行菜单快捷键操作 参数 lType
function InputHotKey(lType, CallBack, CallData, ErrMsg) {
  var cmddata = "85;|;2," + lType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//用于登录AIP网络版服务器
function LoginEx(pcRemoteAddr, pLoginData, lDataLen, CallBack, CallData, ErrMsg) {
  var cmddata = "87;|;3," + pcRemoteAddr + "|;|3," + pLoginData + "|;|3," + lDataLen;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//创建空白页面，批示页，编辑页。(必须用户登录)
function InsertEmptyPage(lPageIndex, lType, lWidth, lHeight, CallBack, CallData, ErrMsg) {
  var cmddata = "88;|;2," + lPageIndex + "|;|2," + lType + "|;|2," + lWidth + "|;|2," + lHeight;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//插入批示页。或者合并AIP文件(必须用户登录)。
function MergeFile(lPageStartIndex, pcFileName, CallBack, CallData, ErrMsg) {
  var cmddata = "89;|;2," + lPageStartIndex + "|;|3," + pcFileName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得当前服务序列号对应的服务名。我们为每一服务器用户分配了32位唯一表示符号。
function GetCurrServer(plServerID, CallBack, CallData, ErrMsg) {
  var cmddata = "90;|;2," + plServerID;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//如当前是通过LoadOriginalFile打开的原始文件，通过此接口可以接受文件的全部修订
function AcceptAllRevisions(CallBack, CallData, ErrMsg) {
  var cmddata = "91;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置文档是否被修改
function SetSaved(blSaved, CallBack, CallData, ErrMsg) {
  var cmddata = "92;|;2," + blSaved;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取当前文件的Base64编码的字符串,与LoadFileBase64对应
function GetCurrFileBase64(CallBack, CallData, ErrMsg) {
  var cmddata = "93;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//加载Base64编码的字符串
function LoadFileBase64(pcBase64String, CallBack, CallData, ErrMsg) {
  var cmddata = "94;|;3," + pcBase64String;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置书签的内容。只针对word和wps
function SetFieldValue(strFieldName, strValue, strSheetName, CallBack, CallData, ErrMsg) {
  var cmddata = "95;|;3," + strFieldName + "|;|3," + strValue + "|;|3," + strSheetName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//添加骑缝章和普通印章接口（必须打开文件且用户已登录）
function AddQifengSeal(lFrom, pcPages, pcOriSealName, pcSealName, CallBack, CallData, ErrMsg) {
  var cmddata = "96;|;2," + lFrom + "|;|3," + pcPages + "|;|3," + pcOriSealName + "|;|3," + pcSealName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//打印文档，提供更详细的打印控制
function PrintDocEx(strPrinterName, lPrintFlag, blShowDlg, blZoom, lFromPage, lToPage, blOriSize, lCopys, blCollate, blTranFirst, blDulpex, CallBack, CallData, ErrMsg) {
  var cmddata = "98;|;3," + strPrinterName + "|;|2," + lPrintFlag + "|;|2," + blShowDlg + "|;|2," + blZoom + "|;|2," + lFromPage + "|;|2," + lToPage + "|;|2," + blOriSize + "|;|2," + lCopys + "|;|2," + blCollate + "|;|2," + blTranFirst + "|;|2," + blDulpex;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//动态添加编辑域|手写域|超链接.(必须登录)。
function InsertNote(pcName, lPageIndex, lType, lPosx, lPosy, lWidth, lHeight, CallBack, CallData, ErrMsg) {
  var cmddata = "99;|;3," + pcName + "|;|2," + lPageIndex + "|;|2," + lType + "|;|2," + lPosx + "|;|2," + lPosy + "|;|2," + lWidth + "|;|2," + lHeight;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置添加区域的位置
function SetNotePos(pcNoteName, lLeft, lTop, lWidth, lHeight, CallBack, CallData, ErrMsg) {
  var cmddata = "101;|;3," + pcNoteName + "|;|2," + lLeft + "|;|2," + lTop + "|;|2," + lWidth + "|;|2," + lHeight;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//删除本地文件。
function DeleteLocalFile(pcFileName, CallBack, CallData, ErrMsg) {
  var cmddata = "102;|;3," + pcFileName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//随机生成一个唯一的临时文件名。
function GetTempFileName(pcFileType, CallBack, CallData, ErrMsg) {
  var cmddata = "103;|;3," + pcFileType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取节点个数。
function GetNoteNum(lNoteType, CallBack, CallData, ErrMsg) {
  var cmddata = "105;|;2," + lNoteType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//获取用户127
function JSGetNextUser(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "127;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置各部门打印份数。可重复调用，本接口只有网络版有效
function InsertDepartmentCopy(pcDepName, lCopys, CallBack, CallData, ErrMsg) {
  var cmddata = "106;|;3," + pcDepName + "|;|2," + lCopys;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//保留。
function SetPrintCopyList(CallBack, CallData, ErrMsg) {
  var cmddata = "107;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//删除指定节点。
function DeleteNote(strNoteName, CallBack, CallData, ErrMsg) {
  var cmddata = "108;|;3," + strNoteName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//使AIP文档中指定类型变成灰色
function GrayData(lGrayType, CallBack, CallData, ErrMsg) {
  var cmddata = "109;|;2," + lGrayType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取指定节点或页面的旋转类型
function GetRotateType(pcName, CallBack, CallData, ErrMsg) {
  var cmddata = "110;|;3," + pcName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置指定节点或页面的旋转类型。
function SetRotateType(pcName, sRotateType, CallBack, CallData, ErrMsg) {
  var cmddata = "111;|;3," + pcName + "|;|,3" + sRotateType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//将AIP文件保存为TIFF格式。
function SaveToTiff(pcFileName, xDPI, yDPI, nBpp, blGray, CallBack, CallData, ErrMsg) {
  var cmddata = "112;|;3," + pcFileName + "|;|,3" + xDPI + "|;|,2" + yDPI + "|;|,2" + nBpp + "|;|,2" + blGray;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取指定节点的X逻辑坐标位置(坐标单位由CurrXYMode指定)。
function GetNotePosX(pcName, CallBack, CallData, ErrMsg) {
  var cmddata = "113;|;3," + pcName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取指定节点的X逻辑坐标位置(坐标单位由CurrXYMode指定)。
function GetNotePosY(pcName, CallBack, CallData, ErrMsg) {
  var cmddata = "114;|;3," + pcName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//根据错误ID来返回错误的信息
function GetErrorString(lErrorNo, CallBack, CallData, ErrMsg) {
  var cmddata = "115;|;2," + lErrorNo;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置参数对应的内容。
function SetValueEx(pcName, lType, lParam, pParam, CallBack, CallData, ErrMsg) {
  var cmddata = "116;|;3," + pcName + "|;|2," + lType + "|;|2," + lParam + "|;|3," + pParam;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//查看文件、用户、节点进行保护限制的状态
function IsProtect(pcName, lSource, lType, CallBack, CallData, ErrMsg) {
  var cmddata = "117;|;3," + pcName + "|;|2," + lSource + "|;|2," + lType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//查看文件、用户、节点进行保护限制的状态
function GetNoteWidth(pcName, CallBack, CallData, ErrMsg) {
  var cmddata = "118;|;3," + pcName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取指定节点的逻辑高度(单位基于当前坐标系)。
function GetNoteHeight(pcName, CallBack, CallData, ErrMsg) {
  var cmddata = "119;|;3," + pcName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取指纹图片base64值。
function GetValueEx(pcName, lValuetype, pcValueName, lParam, pcParam, CallBack, CallData, ErrMsg) {
  var cmddata = "120;|;3," + pcName + "|;|2," + lValuetype + "|;|3," + pcValueName + "|;|2," + lParam + "|;|3," + pcParam;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取指定节点的逻辑高度(单位基于当前坐标系)。
function MergerPage(pcName, lValuetype, pcValueName, lParam, pcParam, CallBack, CallData, ErrMsg) {
  var cmddata = "121;|;3," + pcName + "|;|,2" + lValuetype + "|;|,3" + pcValueName + "|;|,3" + lParam + "|;|,2" + pcParam;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}


//获取指定页面的宽度(像素)。。
function GetPageWidth(lPageIndex, CallBack, CallData, ErrMsg) {
  var cmddata = "122;|;2," + lPageIndex;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取指定页面的高度(像素)。。
function GetPageHeight(lPageIndex, CallBack, CallData, ErrMsg) {
  var cmddata = "123;|;2," + lPageIndex;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置当前环境是否为JS环境
function SetJSEnv(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "125;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//返回当前环境是否为JS环境
function GetJSEnv(CallBack, CallData, ErrMsg) {
  var cmddata = "536871037;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置当前环境是否为JS环境
function SetJSValue(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "126;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回当前环境是否为JS环境
function GetJSValue(CallBack, CallData, ErrMsg) {
  var cmddata = "536871038;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//显示消息提示对话框
function ShowMessage(pcMessage, pcCaption, lType, CallBack, CallData, ErrMsg) {
  var cmddata = "130;|;3," + pcMessage + "|;|3," + pcCaption + "|;|2," + lType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}


//取得当前文件大小，单位字节。
function GetCurrFileSize(CallBack, CallData, ErrMsg) {
  var cmddata = "131;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//取得目标文件大小，单位字节。
function GetFileSize(strFilePath, CallBack, CallData, ErrMsg) {
  var cmddata = "132;|;3," + strFilePath;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取当前智能卡的证书序列号。
function GetSerialNumber(CallBack, CallData, ErrMsg) {
  var cmddata = "133;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//将控件虚拟打印机设置为系统默认打印机，并保存原打印机设置。 在  AfterConvert  后恢复。
function BeforeConvert(pcPaperName, CallBack, CallData, ErrMsg) {
  var cmddata = "134;|;3," + pcPaperName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//在BeforeConvert后，默认打印机恢复为原打印机，并读取设置。
function AfterConvert(CallBack, CallData, ErrMsg) {
  var cmddata = "135;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//控件进入等待状态。
function SleepSecond(lSecond, CallBack, CallData, ErrMsg) {
  var cmddata = "137;|;2," + lSecond;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//对文件、用户、节点进行保护限制。
function ProtectObject(pcName, lSource, lType, pcOld, pcNew, CallBack, CallData, ErrMsg) {
  var cmddata = "138;|;3," + pcName + "|;|2," + lSource + "|;|2," + lType + "|;|3," + pcOld + "|;|3," + pcNew;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//将宽度由原单位换算为新的单位。
function ConvertXYModeW(lPageIndex, lW, lSXYMode, lDXYMode, CallBack, CallData, ErrMsg) {
  var cmddata = "139;|;2," + lPageIndex + "|;|2," + lW + "|;|2," + lSXYMode + "|;|2," + lDXYMode;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//将高度由原单位换算为新的单位。
function ConvertXYModeH(lPageIndex, lW, lSXYMode, lDXYMode, CallBack, CallData, ErrMsg) {
  var cmddata = "140;|;2," + lPageIndex + "|;|2," + lW + "|;|2," + lSXYMode + "|;|2," + lDXYMode;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//获取指定类型的用户信息
function GetUserInfoEx(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "141;|;3," + p1 + "|;|2," + p2 + "|;|2," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置指定类型的用户信息
function SetUserInfoEx(p1, p2, p3, p4, CallBack, CallData, ErrMsg) {
  var cmddata = "142;|;3," + p1 + "|;|2," + p2 + "|;|2," + p3 + "|;|3," + p4;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置用户界面颜色
function SetCustomColour(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "143;|;2," + p1 + "|;|2," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//获取用户界面颜色
function GetCustomColour(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "144;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置水印模式
function SetWaterMarkMode(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "146;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

function GetWaterMarkMode(CallBack, CallData, ErrMsg) {
  var cmddata = "536871058;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置水印透明度147
function SetWaterMarkAlpha(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "147;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//返回水印透明度
function GetWaterMarkAlpha(CallBack, CallData, ErrMsg) {
  var cmddata = "536871059;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置水印的内容
function SetWaterMarkTextOrPath(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "148;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//返回水印的内容
function GetWaterMarkTextOrPath(CallBack, CallData, ErrMsg) {
  var cmddata = "536871060;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置水印缩放比例
function SetWaterMarkTxtHOrImgZoom(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "150;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//返回水印缩放比例
function GetWaterMarkTxtHOrImgZoom(CallBack, CallData, ErrMsg) {
  var cmddata = "536871062;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置输出的水印在文档的x坐标位置
function SetWaterMarkPosX(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "151;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//返回输出的水印在文档的x坐标位置
function GetWaterMarkPosX(CallBack, CallData, ErrMsg) {
  var cmddata = "536871063;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置或返回输出的水印在文档的y坐标位置
function SetWaterMarkPosY(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "152;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//返回输出的水印在文档的y坐标位置
function GetWaterMarkPosY(CallBack, CallData, ErrMsg) {
  var cmddata = "536871064;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置输出的水印文字颜色设置或返回输出的水印文字颜色
function SetWaterMarkTextColor(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "153;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//返回输出的水印文字颜色设置或返回输出的水印文字颜色
function GetWaterMarkTextColor(CallBack, CallData, ErrMsg) {
  var cmddata = "536871065;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置水印旋转角度（X0.1度）。
function SetWaterMarkAngle(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "154;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//返回水印旋转角度（X0.1度）。
function GetWaterMarkAngle(CallBack, CallData, ErrMsg) {
  var cmddata = "536871066;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置页面位置单位类型值
function SetCurrXYMode(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "155;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//返回页面位置单位类型值
function GetCurrXYMode(CallBack, CallData, ErrMsg) {
  var cmddata = "536871067;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//删除指定页面
function DeletePage(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "158;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置当前系统时间
function SetCurrTime(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "160;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//设置设计模式
function SetInDesignMode(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "161;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//返回设计模式
function GetInDesignMode(CallBack, CallData, ErrMsg) {
  var cmddata = "536871073;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//插入图片（用户必须登录）。
function InsertPicture(pcPicName, pcPicValue, lPage, lLeft, lTop, lZoom, CallBack, CallData, ErrMsg) {
  var cmddata = "162;|;3," + pcPicName + "|;|3," + pcPicValue + "|;|2," + lPage + "|;|2," + lLeft + "|;|2," + lTop + "|;|2," + lZoom;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//插入节点
function InsertNoteEx(pcName, lNoteType, lTagType, pcTagName, lLevel, CallBack, CallData, ErrMsg) {
  var cmddata = "163;|;3," + pcName + "|;|2," + lNoteType + "|;|2," + lTagType + "|;|3," + pcTagName + "|;|2," + lLevel
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//执行控件内部菜单
function RunCommand(lCmdType, lCmdCode, lRunMode, CallBack, CallData, ErrMsg) {
  var cmddata = "164;|;2," + lCmdType + "|;|2," + lCmdCode + "|;|2," + lRunMode;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置当前编辑用户。这个名称会显示在附加用户信息的编辑框里
function SetCurrTextEditUser(lCmdType, CallBack, CallData, ErrMsg) {
  var cmddata = "166;|;3," + lCmdType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//将对应的页保存为相应类型图片，以字符串方式返回
function SaveAsBase64(pcSaveType, lPageStart, lPageEnd, lPageWidth, lPageHeight, lZoomPercent, pcReserve, CallBack, CallData, ErrMsg) {
  var cmddata = "167;|;3," + pcSaveType + "|;|2," + lPageStart + "|;|2," + lPageEnd + "|;|2," + lPageWidth + "|;|2," + lPageHeight + "|;|2," + lZoomPercent + "|;|3," + pcReserve;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//将控件虚拟打印机设置为系统默认打印机，并保存原打印机设置。 在AfterConvert后恢复
function SetCurrTextEditUser(lPaperWidth, lPaperHeight, CallBack, CallData, ErrMsg) {
  var cmddata = "169;|;2," + lPaperWidth + "|;|2," + lPaperHeight;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//插入节点
function InsertNote2(pcName, lNoteType, pcValue, lStartPage, lEndPage, lTagType, pcTagName, lOffset, lZoom, CallBack, CallData, ErrMsg) {
  var cmddata = "170;|;3," + pcName + "|;|2," + lNoteType + "|;|3," + pcValue + "|;|2," + lStartPage + "|;|2," + lEndPage + "|;|2," + lTagType + "|;|3," + pcTagName + "|;|2," + lOffset + "|;|2," + lZoom;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//显示文件选择框
function ShowDialog(lDialogType, pcTitle, pcInitValue, pcFilter, CallBack, CallData, ErrMsg) {
  var cmddata = "171;|;2," + lDialogType + "|;|3," + pcTitle + "|;|3," + pcInitValue + "|;|3," + pcFilter;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}


//校验文档中的节点
function VerifyNotes(pcNoteName, pcParam, lParam, CallBack, CallData, ErrMsg) {
  var cmddata = "172;|;3," + pcNoteName + "|;|3," + pcParam + "|;|2," + lParam;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取原始文档类型
function GetOriginalFileType(lOriginalIndex, CallBack, CallData, ErrMsg) {
  var cmddata = "173;|;2," + lOriginalIndex;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取当前的证书序列号
function GetCurrSerialNumber(CallBack, CallData, ErrMsg) {
  var cmddata = "175;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}


//获取当前证书授予者名称
function GetCurrSubjectName(CallBack, CallData, ErrMsg) {
  var cmddata = "176;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取当前证书授予者名称
function GetHttpPostData(lParam, strParam, CallBack, CallData, ErrMsg) {
  var cmddata = "177;|;2," + lParam + "|;|3," + strParam;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}



//获取当前证书授予者名称
function SetBackgroundDoc(pcFileNameOrUrl, pcType, lPageIndex, CallBack, CallData, ErrMsg) {
  var cmddata = "178;|;3," + pcFileNameOrUrl + "|;|3," + pcType + "|;|2," + lPageIndex;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//定位到参数指定的位置
function GotoPosition(lType, pcName, lPageIndex, lPosX, lPosY, CallBack, CallData, ErrMsg) {
  var cmddata = "179;|;2," + lType + "|;|3," + pcName + "|;|2," + lPageIndex + "|;|2," + lPosX + "|;|2," + lPosY;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取当前证书授予者名称
function GetBMPos(strBMName, lPosType, CallBack, CallData, ErrMsg) {
  var cmddata = "180;|;3," + strBMName + "|;|2," + lPosType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//部分保护word文档内容。
function PartialProtect(strPosList, strPWD, strParam, CallBack, CallData, ErrMsg) {
  var cmddata = "181;|;3," + strPosList + "|;|3," + strPWD + "|;|3," + strParam;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获取文件的base64串。
function GetFileBase64(strFilePath, blCompress, CallBack, CallData, ErrMsg) {
  var cmddata = "182;|;3," + strFilePath + "|;|2," + blCompress;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//将base64解开并存储到本地文件。
function SaveBinaryFileFromBase64(strFilePath, strBase64, CallBack, CallData, ErrMsg) {
  var cmddata = "183;|;3," + strFilePath + "|;|3," + strBase64;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得指定目录下的所有文件列表。
function GetFileListUnderDir(pcDir, CallBack, CallData, ErrMsg) {
  var cmddata = "184;|;3," + pcDir;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//导出文档中所有区域的字符串数据。
function ExportEditNodeValue(pcOpenFileName, pcSaveFileName, lWithHeader, CallBack, CallData, ErrMsg) {
  var cmddata = "189;|;3," + pcOpenFileName + "|;|3," + pcSaveFileName + "|;|2," + lWithHeader;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得所有打印机。
function GetPrinterList(CallBack, CallData, ErrMsg) {
  var cmddata = "190;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得打印机的任务列表和状态。
function GetPrinterStatusByStr(pcPrintName, CallBack, CallData, ErrMsg) {
  var cmddata = "191;|;3," + pcPrintName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得打印机的任务详细信息。
function GetJobInfoByStr(pcPrintName, dwJobID, CallBack, CallData, ErrMsg) {
  var cmddata = "192;|;3," + pcPrintName + "|;|2," + dwJobID;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得打印机的任务详细信息。
function ResetPrinterByStr(pcPrintName, CallBack, CallData, ErrMsg) {
  var cmddata = "193;|;3," + pcPrintName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//对指定字符串数据签名(GBK编码) 。
function SignData(pcData, pcPin, CallBack, CallData, ErrMsg) {
  var cmddata = "194;|;3," + pcData + "|;|3," + pcPin;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//校验针对指定字符串数据的签名(GBK编码)。
function VerifyData(pcData, pcSignData, pcCert, CallBack, CallData, ErrMsg) {
  var cmddata = "195;|;3," + pcData + "|;|3," + pcSignData + "|;|3," + pcCert;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//将当前文档的指定页保存。（暂时仅支持保存为PDF）
function SplitPages(pcPages, pcSavePath, pcSaveType, CallBack, CallData, ErrMsg) {
  var cmddata = "197;|;3," + pcPages + "|;|3," + pcSavePath + "|;|3," + pcSaveType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//（保留）。
function VerifyDocText(pcDocText, pcBorderText, CallBack, CallData, ErrMsg) {
  var cmddata = "198;|;3," + pcPages + "|;|3," + pcBorderText;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得文档窗口的指定位置在页面上的坐标。
function GetCurrPagePos(lPagePosType, CallBack, CallData, ErrMsg) {
  var cmddata = "199;|;2," + lPagePosType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置指定页面的位置到指定窗口位置。
function SetCurrPagePos(lPagePosType, pcPagePos, CallBack, CallData, ErrMsg) {
  var cmddata = "200;|;2," + lPagePosType + "|;|3," + pcPagePos;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//查找指定文字并返回文字位置。
function FindText(p1, p2, p3, p4, p5, p6, p7, p8, p9, CallBack, CallData, ErrMsg) {
  var cmddata = "201;|;3," + p1 + "|;|2," + p2 + "|;|2," + p3 + "|;|2," + p4 + "|;|2," + p5 + "|;|2," + p6 + "|;|2," + p7 + "|;|2," + p8 + "|;|2," + p9;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置书签的选择信息（保留）。
function SetFieldShowInfo(p1, p2, p3, p4, p5, p6, CallBack, CallData, ErrMsg) {
  var cmddata = "202;|;3," + p1 + "|;|2," + p2 + "|;|2," + p3 + "|;|2," + p4 + "|;|2," + p5 + "|;|2," + p6;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//隐藏指定工具条按钮
function HideBarItems(p1, p2, p3, p4, p5, p6, CallBack, CallData, ErrMsg) {
  var cmddata = "203;|;2," + p1 + "|;|2," + p2 + "|;|2," + p3 + "|;|2," + p4 + "|;|2," + p5 + "|;|2," + p6;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//判定是否为空白文档。
function IsEmptyDoc(CallBack, CallData, ErrMsg) {
  var cmddata = "204;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//异步打开原始文件
function LoadOriginalFileAsync(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "205;|;3," + p1 + "|;|3," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//判定是否为空白文档。
function LoadFileExAsync(p1, p2, p3, p4, CallBack, CallData, ErrMsg) {
  var cmddata = "206;|;3," + p1 + "|;|3," + p2 + "|;|2," + p3 + "|;|2," + p4;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//（保留）。
function ZipDir(p1, p2, p3, p4, p5, p6, CallBack, CallData, ErrMsg) {
  var cmddata = "207;|;3," + p1 + "|;|3," + p2 + "|;|3," + p3 + "|;|2," + p4 + "|;|3," + p5 + "|;|3," + p6;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//解压缩。
function UnzipFile(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "208;|;3," + p1 + "|;|3," + p2 + "|;|3," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//加密文件。
function UnEncFile(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "209;|;3," + p1 + "|;|3," + p2 + "|;|3," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//解密文件
function UnDecFile(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "210;|;3," + p1 + "|;|3," + p2 + "|;|3," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//更新所有的word书签域（保留）。
function UpdateAllField(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "211;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//（保留）。
function SaveLoadOri(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "212;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//（保留）。
function ShowPaperFile(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "213;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//（保留）。
function ClosePaperFile(CallBack, CallData, ErrMsg) {
  var cmddata = "214;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//（保留）。
function AddSealByDir(p1, p2, p3, p4, CallBack, CallData, ErrMsg) {
  var cmddata = "215;|;3," + p1 + "|;|3," + p2 + "|;|3," + p3 + "|;|3," + p4;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//（保留）。
function LoadBinary(p1, p2, p3, p4, CallBack, CallData, ErrMsg) {
  var cmddata = "218;|;3," + p1 + "|;|3," + p2 + "|;|3," + p3 + "|;|3," + p4;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//（保留）。
function LoadBinary(p1, p2, p3, p4, CallBack, CallData, ErrMsg) {
  var cmddata = "219;|;3," + p1 + "|;|3," + p2 + "|;|3," + p3 + "|;|3," + p4;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//将数据写入文件。
function WriteLocalFile(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "220;|;3," + p1 + "|;|3," + p2 + "|;|2," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//读取文件数据
function ReadLocalFile(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "221;|;3," + p1 + "|;|2," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//加入当前文件到待上传列表
function HttpAddPostCurrFileEx(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "222;|;3," + p1 + "|;|3," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//开始下载文件
function StartDownloadFile(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "223;|;3," + p1 + "|;|3," + p2 + "|;|2," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//停止当前的异步下载线程
function StopDownloadFile(CallBack, CallData, ErrMsg) {
  var cmddata = "224;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//创建文件夹
function CreateFolder(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "225;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//删除文件夹
function DeleteFolder(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "226;|;3," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//拷贝本地文件
function CopyLocalFile(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "227;|;3," + p1 + "|;|3," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//根据序号获得节点
function GetNoteByIndex(p1, p2, CallBack, CallData, ErrMsg) {
  var cmddata = "228;|;2," + p1 + "|;|2," + p2;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//执行shell命令
function ExecuteCmd(p1, p2, p3, CallBack, CallData, ErrMsg) {
  var cmddata = "232;|;3," + p1 + "|;|3," + p2 + "|;|2," + p3;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//插入附件
function InsertEmbFile(p1, p2, p3, p4, p5, p6, CallBack, CallData, ErrMsg) {
  var cmddata = "234;|;3," + p1 + "|;|3," + p2 + "|;|3," + p3 + "|;|2," + p4 + "|;|2," + p5 + "|;|2," + p6;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}
//获得sheet数量（excel）。
function GetSheetCount(CallBack, CallData, ErrMsg) {
  var cmddata = "235;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得sheet名称（excel）。
function GetSheetName(lSheetIndex, CallBack, CallData, ErrMsg) {
  var cmddata = "236;|;2," + lSheetIndex;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//根据Sheet名称获得sheet序号
function GetSheetIndex(pcSheetName, CallBack, CallData, ErrMsg) {
  var cmddata = "237;|;3," + pcSheetName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得指定范围的文字（excel）。
function GetSheetRangeText(lSheetIndex, pcRngName, CallBack, CallData, ErrMsg) {
  var cmddata = "238;|;2," + lSheetIndex + "|;|3," + pcRngName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得指定范围的值（excel）。
function GetSheetRangeValue(lSheetIndex, pcRngName, CallBack, CallData, ErrMsg) {
  var cmddata = "239;|;2," + lSheetIndex + "|;|3," + pcRngName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//获得指定范围的公式（excel）。
function GetSheetRangeFormula(lSheetIndex, pcRngName, CallBack, CallData, ErrMsg) {
  var cmddata = "240;|;2," + lSheetIndex + "|;|3," + pcRngName;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//保护或者解除保护指定的sheet（excel）。
function ProtectSheet(lSheetIndex, pcPwd, blProtect, CallBack, CallData, ErrMsg) {
  var cmddata = "241;|;2," + lSheetIndex + "|;|3," + pcPwd + "|;|2," + blProtect;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//保护或者解除保护指定的sheet（excel）。
function IsFolderExist(strFolder, CallBack, CallData, ErrMsg) {
  var cmddata = "242;|;3," + strFolder;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//返回文件的修改/创建日期
function GetFileInfo(strFilePath, lType, CallBack, CallData, ErrMsg) {
  var cmddata = "243;|;3," + strFilePath + "|;|2," + lType;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}


//获取vba接口对象
function GetDocumentObject(CallBack, CallData, ErrMsg) {
  var cmddata = "83;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//设置显示窗口大小四个整数参数:x,y,w,h屏幕坐标
function SetDispidShowWndPos(p1, p2, p3, p4, CallBack, CallData, ErrMsg) {
  var cmddata = "997;|;2," + p1 + "|;|2," + p2 + "|;|2," + p3 + "|;|2," + p4;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//隐藏或者显示winaip上面地址栏
function SetDispidHideTitle(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "999;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}

//判断服务是否启动
function CheckApp(CallBack, CallData, ErrMsg) {
  var cmddata = "1000;|;";
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}


//设置winaip_serv窗口显示层级   参数为1表示始终置顶层  2表示显示在最外层但可以被新窗口遮挡  0退出置顶
function SetDispidShowWndLevel(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "996;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}


//设置是否可以点击×
function dispidEnableCloseBtn(p1, CallBack, CallData, ErrMsg) {
  var cmddata = "998;|;2," + p1;
  InvokePPAPI(cmddata, CallBack, CallData, ErrMsg);
}


/**
 * 
 * @param {*} 点聚签名相关代码
 */

function Reb_Handwritten_login() {
  console.log("点具有签字板用户登录");
  console.log(window.djUserId)
  Login(window.djUserId, 4, 65535, "DEMO", "", "Reb_Handwritten_SetValue_1", "", "");
}

//删除手写数据必须签名配置。
function Reb_Handwritten_SetValue_1(callBackData) {
  console.log("用户登录结果", callBackData);
  SetValue("DEL_FORCETYPE_VALUE", "1", "Reb_Handwritten_SetValue_2", "", "");
}

//添加手写数据不要签名配置。
function Reb_Handwritten_SetValue_2(callBackData) {
  console.log("SetValue_1结果", callBackData);
  SetValue("ADD_FORCETYPE_VALUE", "8", "Reb_Handwritten_SetValue_4", "", "");
}

function Reb_Handwritten_SetValue_3(callBackData) {
  console.log("SetValue_2结果", callBackData);
  //改动
  //SetValue("SET_HWSCREEN", "0", "Reb_Handwritten_SetValue_4", "", "");
  //SetValue("SET_HWSCREEN_INDEX", "0", "Reb_Handwritten_CurrAction", "", "");
  SetValue("SET_HWSCREEN_INDEX", "0", "Reb_Handwritten_SetValue_4", "", "");
}

function Reb_Handwritten_SetValue_4(callBackData) {
  console.log("SetValue_3结果", callBackData);
  SetValue("ADD_FORCETYPE_VALUE6", "5242880", "Reb_Handwritten_CloseDoc", "", "");
}

function Reb_Handwritten_CloseDoc(callBackData) {
  console.log("SetValue_4结果", callBackData);
  console.log("关闭当前文档");
  CloseDoc(0, "Reb_Handwritten_InsertEmptyPage", "", "");
}

function Reb_Handwritten_InsertEmptyPage() {
  console.log("插入空白页");
  //改动
  //InsertEmptyPage(0, 1, 0, 0, "Reb_Handwritten_InsertNote", "", "");
  InsertEmptyPage(0, 1, 0, 0, "Reb_Handwritten_InsertNote", "", "");
}

function Reb_Handwritten_InsertNote() {
  console.log("插入Sign节点");
  InsertNote("sign", 0, 2, 0, 0, 50000, 50000, "Reb_Handwritten_SetValue_Note_Field_1", "", "");
}

function Reb_Handwritten_SetValue_Note_Field_1(callBackData) {
  console.log("SetValue_2结果", callBackData);
  SetValue("sign", ":PROP:BORDER:0", "Reb_Handwritten_SetValue_Note_Field_2", "", "");
}

function Reb_Handwritten_SetValue_Note_Field_2(callBackData) {
  console.log("设置节点属性1结果", callBackData);
  // SetValue("sign", ":PROP::CLICKPOP:1", "Reb_Handwritten_CurrAction", "", "");
  SetValue("sign", ":PROP::CLICKPOP:0", "SET_HWSCREEN_INDEX_SetValue", "", "");
}
//配置手写屏索引
function SET_HWSCREEN_INDEX_SetValue(callBackData) {
	console.log("SetValue_2结果", callBackData);
	SetValue("SET_HWSCREEN_INDEX", "0", "Reb_Handwritten_CurrAction", "", "");
}
function Reb_Handwritten_CurrAction() {
  console.log("设置全屏手写");
  CurrAction(264, "Reb_Handwritten_CurrPenWidth", "", "")
}
// function Reb_Handwritten_SetValue_Note_Field_2(callBackData) {
//   console.log("设置节点属性1结果", callBackData);
//   // SetValue("sign", ":PROP::CLICKPOP:1", "Reb_Handwritten_CurrAction", "", "");
//   SetValue("sign", ":PROP::CLICKPOP:0", "Reb_Handwritten_CurrAction", "", "");
// }

// function Reb_Handwritten_CurrAction() {
//   console.log("设置全屏手写");
//   CurrAction(264, "Reb_Handwritten_CurrPenWidth", "", "")
// }

function Reb_Handwritten_CurrPenWidth() {
  console.log("设置手写笔宽");
  SetCurrPenWidth(8, "", "", "");
}

function Reb_Handwritten_SetValue_Activate() {
  console.log("激活手写节点");
  SetValue("sign", ":PROP:ACTIVATE:2", "", "", "");
}
