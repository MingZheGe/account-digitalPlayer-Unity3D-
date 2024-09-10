/**
 * localStorage 和 sessionStorage的封装方法
 * @author  lij
 */


const storageFunc = {
  /**
   * 存储localStorage
   */
  setLocal : (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
  },
  /**
   * 获取localStorage
   */
  getLocal : name => {
    if (!name) return;
    return window.localStorage.getItem(name);
  },
  /**
 * 获取localStorage的JSON值
 */
  getJsonLocal: name => {
    if (!name) return;
    var result = null
    try {
      result = JSON.parse(window.localStorage.getItem(name))
    } catch (error) {
      result = null
    }
    return result;
  },
  /**
   * 删除localStorage
   */
  removeLocal : name => {
    if (!name) return;
    window.localStorage.removeItem(name);
  },
  /**
   * 从localStorage删除所有保存的数据
   */
  removeAllLocal : name => {
    window.localStorage.clear();
  },
  /**
   * 存储sessionStorage
   */
  setSession : (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
  },

  /**
   * 获取sessionStorage
   */
  getSession : name => {
    if (!name) return;
    return window.sessionStorage.getItem(name);
  },

  /**
   * 获取sessionStorage的JSON值
   */
  getJsonSession : name => {
    if (!name) return;
    let result = null;
    try {
      result = JSON.parse(window.sessionStorage.getItem(name))
    } catch (error) {
      result = null;
    }
    return result;
  },

  /**
   * 删除sessionStorage
   */
  removeSession : name => {
    if (!name) return;
    window.sessionStorage.removeItem(name);
  },

  /**
   * 从sessionStorage删除所有保存的数据
   */
  removeAllSession : name => {
    window.sessionStorage.clear();
  }
}

const plugin = {
    install (Vue) {
        //添加全局方法或属性
        Vue.storage = storageFunc
        //添加实例方法
        Vue.prototype.$storage = storageFunc
    },
    $storage : storageFunc
}

export default plugin
export const install = plugin.install