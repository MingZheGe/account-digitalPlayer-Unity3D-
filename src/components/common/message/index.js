import _ from 'lodash'
import Vue from 'vue';
import message from './src/message';
let Message = Vue.extend(message);
const instance = new Message();
instance.vm = instance.$mount();
document.body.appendChild(instance.vm.$el);


function init(options) {

    const defaultOptions = {
        showMsgBox: true,
        confirmedAction: function() {
            console.log("可选的确认按钮点击事件")
        },
        canceledAction: function() {
            console.log("可选的取消按钮点击事件")
        },
        hasMask: true,
    };

    if (_.isString(options)) {
        defaultOptions.messageText = options;
    }

    //删除loading节点
    let currentLoadingNode = document.getElementById('loadingNode');
    if (currentLoadingNode) {
        document.body.removeChild(currentLoadingNode);
    }

    return Object.assign(defaultOptions, options)
};
const dialog = function(options) {
    let obj = {
        ownClass: '',
        msg_icon: 'question',
        cancelButtonText: '',
        confirm_icon: "",
        cancel_icon: "",
        confirmButtonText: '确定',
        clickModalAction: function() {
            console.log("可选的遮罩层点击事件")
        },
        canceledAction: function() {
            console.log("可选的取消按钮点击事件")
        }
    }
    Object.assign(instance, obj, init(options), {
        "typeMessage": 'dialog'
    });
}
const custEval = function(opt = {}) {
    let obj = {
        ownClass: '',
        confirm_icon: '',
        cancel_icon: '',
        cancelButtonText: '返回首页',
        confirmButtonText: '重新测评'
    };
    let custEvaluate = {
        title: opt.title,
        lv: opt.lv,
        score: opt.score,
        lvDate: opt.lvDate,
        lvExpDate: opt.lvExpDate,
        remainingEval: opt.remainingEval,
        surveyName: opt.surveyName,
        intervalDays: opt.intervalDays,
        msg_icon: opt.msg_icon || "question"
    }
    Object.assign(instance, obj, init(opt), {
        "typeMessage": 'custEval',
        custEvaluate
    });
}
const profTips = function(options = {}) {
    let obj = {
        msg_icon: 'warn',
        profMessageContent: {
            messageTitle: options.messageTitle,
            messageProfType: options.messageProfType,
            messageExpDate: options.messageExpDate,
        },
        cancelButtonText: '取消',
        confirmButtonText: '确认',
    }
    Object.assign(instance, obj, init(options), {
        "typeMessage": 'profTips',
    });
}
const password = function(options = {}) {
    let obj = {
        msg_icon: 'lock',
        password: {
            title: options.title,
            showForget: options.showForget || false,
        },
        cancelButtonText: '取消',
        confirmButtonText: '确认',
    }
    Object.assign(instance, obj, init(options), {
        "typeMessage": 'password',
    });
}
const passwordInput = function(options = {}) {
    let obj = {
        msg_icon: 'lock',
        password: {
            title: options.title,
            showForget: options.showForget || false,
            passwordTips: options.passwordTips || ""
        },
        cancelButtonText: '取消',
        confirmButtonText: '确认',
    }
    Object.assign(instance, obj, init(options), {
        "typeMessage": 'passwordInput',
    });
}
const matchTip = function (opt = {}) {
    let obj = {
        msg_icon: 'warn',
        cancelButtonText: opt.cancelButtonText || '返回首页',
        confirmButtonText: opt.confirmButtonText || '确定',
    };
    let tip = {
        title: opt.title,
        content: opt.content
    }
    Object.assign(instance, obj, init(opt), {
        "typeMessage": 'matchTip',
        tip
    });
}
const messageBox = function(options = {}) {
    let obj = {
        msg_icon: options.typeMessage || 'info',
        messageBoxContent: {
            imageTipName: options.imageTipName,
            messageText: options.messageText,
            secondTip: options.secondTip
        },
        cancelButtonText: options.cancelButtonText || '',
        confirmButtonText: options.confirmButtonText || '返回首页',
    }
    Object.assign(instance, obj, init(options), {
        "typeMessage": 'messageBox',
    });
}

const messageBoxNew = function(options = {}) {
    let obj = {
        msg_icon: options.typeMessage || 'info',
        messageBoxNewContent: {
            title: options.title,
            imageTipName: options.imageTipName,
            messageText: options.messageText,
            secondTip: options.secondTip
        },
        cancelButtonText: options.cancelButtonText || '',
        confirmButtonText: options.confirmButtonText || '返回首页',
    }
    Object.assign(instance, obj, init(options), {
        "typeMessage": 'messageBoxNew',
    });
}

const editBox = function(options = {}) {
    let obj = {
        msg_icon: options.msg_icon || 'edit',
        cancelButtonText: options.cancelButtonText || '',
        confirmButtonText: '确认',
    }
    let editBox = {
        title: options.title,
        options: options.options,
    }
    Object.assign(instance, obj, init(options), {
        "typeMessage": 'editBox',
        editBox
    });
}
const tableBox = function(options = {}) {
    let obj = {
        cancelButtonText: options.cancelButtonText || '',
        confirmButtonText: '确认',
        title: options.title,
        headerTableData: options.headerTableData,
        tableData: options.tableData,
    }
    let tableBox = {
        title: options.title,
        headerTableData: options.headerTableData,
        tableData: options.tableData,
    }
    Object.assign(instance, obj, init(options), {
        "typeMessage": 'tableBox',
        "msg_icon": "",
        tableBox
    });
}

const letterBox = function(options = {}) {
    let obj = {
        msg_icon: options.msg_icon || 'question',
        cancelButtonText: options.cancelButtonText || '',
        confirmButtonText: '确认',
    }
    let letterBox = {
        title: options.title,
        letterContent: options.letterContent,
        tip: options.tip,
    }
    Object.assign(instance, obj, init(options), {
        "typeMessage": 'letterBox',
        letterBox
    });
}

const excl = function(options = {}) {
    let excl = {
        exclTitle: options.exclTitle || '',
        exclArr: options.exclArr || []
    };
    Object.assign(instance,  init(options), {
        "typeMessage": 'excl',
        excl
    });
}
const userVerify = function(options = {}) {
    let userVerifyInfo = {
        errorText: options.errorText
    };
    Object.assign(instance, init(options), {
        "typeMessage": "userVerify",
        userVerifyInfo
    })
}
const tips = function(options = {}) {
    let tipsInfo = {
        tipList: options.tipList
    };
    Object.assign(instance, init(options), {
        "typeMessage": "tips",
        tipsInfo
    })
}
//关闭所有弹窗
const closeMessage = function() {
    instance.close();
}
const plugin = {
    install(Vue) {
        //添加实例方法
        Vue.prototype.custEval = custEval;
        Vue.prototype.profTips = profTips;
        Vue.prototype.dialog = dialog;
        Vue.prototype.password = password;
        Vue.prototype.passwordInput = passwordInput;
        Vue.prototype.messageBox = messageBox;
        Vue.prototype.messageBoxNew = messageBoxNew;
        Vue.prototype.closeMessage = closeMessage;
        Vue.prototype.editBox = editBox;
        Vue.prototype.tableBox = tableBox;
        Vue.prototype.letterBox = letterBox;
	    Vue.prototype.matchTip = matchTip;
        Vue.prototype.excl = excl;
        Vue.prototype.userVerify = userVerify;
        Vue.prototype.tips = tips;
    },
    custEval: custEval,
    profTips: profTips,
    dialog: dialog,
    password: password,
    passwordInput: passwordInput,
    messageBox: messageBox,
    messageBoxNew: messageBoxNew,
    closeMessage: closeMessage,
    editBox: editBox,
    tableBox: tableBox,
    letterBox: letterBox,
    matchTip: matchTip,
    excl: excl,
    userVerify: userVerify,
    tips: tips
}

export default plugin
export const install = plugin.install