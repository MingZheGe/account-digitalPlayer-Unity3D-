import axios from "axios";
const CryptoJS = require('crypto-js')
//加密
export function encryptionValue(value, key = 'NHWYYGMSNHWYYGMS', iv = 'NHWYYGMSNHWYYGMS') {
  value = value.toString() // 数字加密会报错，转成字符串
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  const encrypted = CryptoJS.AES.encrypt(value, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString()
}
//解密
export function decryptionValue(value, key = 'NHWYYGMSNHWYYGMS', iv = 'NHWYYGMSNHWYYGMS') {
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  const decrypt = CryptoJS.AES.decrypt(value, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return decrypt.toString(CryptoJS.enc.Utf8)
}



// 开户客户登录、扫描身份证登录
export const loginIdcode = (idType, idCode, userName) => {
  const url = 'http://47.121.189.158:8089/login/idcode';
  const data = {
    idType: idType,
    idCode: idCode,
    userName: userName
  };

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      console.log("哈哈哈");
      console.log("解密前");
      console.log(response.data.data.userId);
      // 解密
      console.log("解密后");
      console.log(JSON.parse(decryptionValue(response.data.data)));
      // localStorage.setItem("UserId", response.data.data.userId);//
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

// 资料录入-证件信息上传接口、完善客户资料-证件信息上传接口
export const documentUpload = (idType, idCode, userName, userId, idAddress, idBeginDate, idExpDate) => {
  const url = 'http://192.168.7.199:8089/document/upload';
  const data = {
    idType:idType,
    idCode:idCode,
    userName:userName,
    userId:userId,
    idAddress:idAddress,
    idBeginDate:idBeginDate,
    idExpDate:idExpDate
  };
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

// 资料录入-证件信息已有数据获取接口、完善客户资料-证件信息已有数据获取接口
export const documentGet = (userId) => {
  const url = 'http://192.168.7.199:8089/document/get';
  const data = {
    userId:userId
  };
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

// 资料录入-基本信息上传接口、完善客户资料-基本信息上传接口
export const basicUpload = (userId, citizenship, education, career, income) => {
  const url = 'http://192.168.7.199:8089/basic/upload';
  const data = {
    userId,
    citizenship,
    education,
    career,
    income
  };
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

// 资料录入-基本信息已有数据获取接口、完善客户资料-基本信息已有数据获取接口
export const basicGet = (userId) => {
  const url = 'http://192.168.7.199:8089/basic/get';
  const data = {
    userId:userId
  };
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

// 资料录入-联系信息上传接口、完善客户资料-联系信息上传接口
export const contactUpload = (userId, mobileTel, email, address, zipCode, lineTel) => {
  const url = 'http://192.168.7.199:8089/contact/upload';
  const data = {
    userId:userId,
    mobileTel:mobileTel,
    email:email,
    address:address,
    zipCode:zipCode,
    lineTel:lineTel
  };
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

// 资料录入-联系信息已有数据获取接口、完善客户资料-联系信息已有数据获取接口
export const contactGet = (userId) => {
  const url = 'http://192.168.7.199:8089/contact/get';
  const data = {
    userId:userId
  };
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

// 资料录入-关联人信息上传接口
export const relatedUpload = (userId) => {
  const url = 'http://192.168.7.199:8089/related/upload';
  const data = {
    userId:userId
  };
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

// 风险测评-答题题目获取接口
export const questionGet = (userId) => {
  const url = 'http://192.168.7.199:8089/question/get';
  const data = {
    userId:userId
  };
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

// 风险测评-答题上传接口
export const askUpload = (userId, options) => {
  const url = 'http://192.168.7.199:8081/ask/upload';
  const data = {
    userId:userId,
    options:options
  };
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};
// 风险测评-答题获取接口
export const askGet = (userId) => {
  const url = 'http://192.168.7.199:8089/ask/get';
  const data = {
    userId
  };
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};


export const idCardPhoto = (userId,fileType, fileName,fileId,fileContext,fileState) => {
  const url = 'http://192.168.7.199:8082/certificate/upload';
  const data = {
    userId:userId,
    fileType:fileType,
    fileName:fileName,
    fileId:fileId,
    fileContext:fileContext,
    fileState:fileState

  };
  const arr = {
    "files":[]
  }
  arr['files'][0] = data
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return axios.post(url, encryptionValue(JSON.stringify(arr)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

//存管银行
export const bindbank = (userId, cardId, bank) => {
  const url = 'http://192.168.7.199:8081/bank/upload';
  const data = {
    userId:userId,
    cardId:cardId,
    bank:bank
  };
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

export const getText = () => {
  const url = 'http://192.168.7.199:8082/protocol/get';
    const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const data = {
    userId:"hahaha",


  };

  return axios.post(url, encryptionValue(JSON.stringify(data)), config)
    .then(response => {
      console.log("解密后");
      console.log(JSON.parse(decryptionValue(response.data.data)));
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};