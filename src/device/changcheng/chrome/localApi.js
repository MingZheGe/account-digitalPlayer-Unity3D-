var baseVoicePath = "D:/KIOSK/voice"

// 创建文件夹
export const createFolder = function(path) {
    path = path || "D:/KIOSK/voice"
    return utyDevice.onExec("createfolder", {
        "path": path,
        "timeout": "60"
    });
}
// 检查文件夹是否存在
export const checkFloder = function (path) {
    return utyDevice.onExec("checkfolder", {
        "path": path
    })
}
// 检查文件是否存在
export const checkFile = function (path) {
    return utyDevice.onExec("checkfile", {
        "filename": path 
    })
}
// 获取某个文件的md5码
export const getMd5 = function(path) {
    return utyDevice.onExec("getmd5", {
        filename: path
    })
}
export const movefile = function(path1, path2) {
    return utyDevice.onExec("movefile", {
        filename: path1,
        targetname: path2,
    })
}
// 创建语音文件
export const stopVoice = function(name) {
    let path = baseVoicePath + "/" + name + ".wav";
    console.log("结束:" + path)
    return utyDevice.onExec("stoprecordwav", {
        "filepath": path,
        "timeout": "60"
    });
}
// 听语音文件
export const startVoice = function(name) {
    let path = baseVoicePath + "/" + name + ".wav";
    console.log("开始:" + path)
    return utyDevice.onExec("startrecordwav", {
        "filepath": path,
        "timeout": "60"
    });
}
export const deleteAllCustFile = function() {
    // 删除客户证件数据 双录数据 等留存在机器上的客户个人信息
    let cameraPath = "D:/KIOSK/Camera";
    deleteCustFile(cameraPath, cameraPath + "/Face.jpg");
    deleteCustFile(cameraPath, cameraPath + "/people.jpg");
    deleteCustFile(cameraPath, cameraPath + "/record.mp4");
    let idPath = "D:/KIOSK/Data/IDCard"
    deleteCustFile(idPath, idPath + "/IDback.jpg");
    deleteCustFile(idPath, idPath + "/IDfront.jpg");
    deleteCustFile(idPath, idPath + "/IDhead.jpg");
}
export const deleteCustFile = function(path, filename) {
    return utyDevice.onExec("deletefile", {
        "filepath": path,
        "filename": filename
    })
}
// 删除语音文件
export const deleteFile = function (fileArr = ["temp1.wav", "temp2.wav"]) {
    let resultArr = []
    _.each(fileArr, async (item) => {
        let result = await utyDevice.onExec("deletefile", {
            "filepath": baseVoicePath,
            "filename": baseVoicePath + "/" + item
        });
        resultArr.push(result)
        console.log(result);
    })
    return resultArr;
}
// 全路径删除 需要两个参数 一个是所在目录路径 另一个是文件路径
export const deleteFileByAllPath = async function(dirPath, filepath) {
    let result = await utyDevice.onExec("deletefile", {
        "filepath": dirPath,
        "filename": filepath
    });
    console.log(result);
}
// 执行python文件
export const executeStartPy = function(path, file) {
    let param = {
        path: path,
        file: file,
        waitfor: "false",
        param: "",
    }
    return utyDevice.onExec("exec", param)
}
export const killProcess = function (path) {
    let param = {
        "filename": path
    };
    return utyDevice.onExec("killprocess", param)
}
export const localHtmlToPdf = async function (htmlStr, pdfName) {
    let result = await utyDevice.onExec("htmltopdf", {
        htmltext: htmlStr,
        htmlpath: "",// D:/KIOSK/test.html
        pdfpath: "D:/KIOSK/pdf/" + pdfName +".pdf",
    });
    console.log(result + "localHtmlToPdf=======================" + htmlStr + "===========" + pdfName);
}

export const readFileBase64 = async function(filepath) {
    let result = await utyDevice.onExec("readfile64", {
        "filename": filepath
    });
    return result;
}
export const readfile = async function(filepath) {
    let result = await utyDevice.onExec("readfile", {
        "filename": filepath
    });
    return result;
}
export const writefile = async function(filepath, contentStr) {
    let result = await utyDevice.onExec("writefile", {
        "filename": filepath,
        "content": contentStr
    })
}