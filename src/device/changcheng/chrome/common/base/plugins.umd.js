(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory(require("@/config/config"), require("lodash"));
  else if (typeof define === 'function' && define.amd)
    define(["@/config/config", "lodash"], factory);
  else if (typeof exports === 'object')
    exports["plugins"] = factory(require("@/config/config"), require("lodash"));
  else
    root["plugins"] = factory(root["Config"], root["_"]);
})((typeof self !== 'undefined' ? self : this), function (__WEBPACK_EXTERNAL_MODULE__5547__, __WEBPACK_EXTERNAL_MODULE__60bb__) {
  return /******/ (function (modules) { // webpackBootstrap
    /******/ // The module cache
    /******/
    var installedModules = {};
    /******/
    /******/ // The require function
    /******/
    function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/
      if (installedModules[moduleId]) {
        /******/
        return installedModules[moduleId].exports;
        /******/
      }
      /******/ // Create a new module (and put it into the cache)
      /******/
      var module = installedModules[moduleId] = {
        /******/
        i: moduleId,
        /******/
        l: false,
        /******/
        exports: {}
        /******/
      };
      /******/
      /******/ // Execute the module function
      /******/
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /******/
      /******/ // Flag the module as loaded
      /******/
      module.l = true;
      /******/
      /******/ // Return the exports of the module
      /******/
      return module.exports;
      /******/
    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/ // define getter function for harmony exports
    /******/
    __webpack_require__.d = function (exports, name, getter) {
      /******/
      if (!__webpack_require__.o(exports, name)) {
        /******/
        Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter
        });
        /******/
      }
      /******/
    };
    /******/
    /******/ // define __esModule on exports
    /******/
    __webpack_require__.r = function (exports) {
      /******/
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
        /******/
      }
      /******/
      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      /******/
    };
    /******/
    /******/ // create a fake namespace object
    /******/ // mode & 1: value is a module id, require it
    /******/ // mode & 2: merge all properties of value into the ns
    /******/ // mode & 4: return value when already ns object
    /******/ // mode & 8|1: behave like require
    /******/
    __webpack_require__.t = function (value, mode) {
      /******/
      if (mode & 1) value = __webpack_require__(value);
      /******/
      if (mode & 8) return value;
      /******/
      if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
      /******/
      var ns = Object.create(null);
      /******/
      __webpack_require__.r(ns);
      /******/
      Object.defineProperty(ns, 'default', {
        enumerable: true,
        value: value
      });
      /******/
      if (mode & 2 && typeof value != 'string')
        for (var key in value) __webpack_require__.d(ns, key, function (key) {
          return value[key];
        }.bind(null, key));
      /******/
      return ns;
      /******/
    };
    /******/
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/
    __webpack_require__.n = function (module) {
      /******/
      var getter = module && module.__esModule ?
        /******/
        function getDefault() {
          return module['default'];
        } :
        /******/
        function getModuleExports() {
          return module;
        };
      /******/
      __webpack_require__.d(getter, 'a', getter);
      /******/
      return getter;
      /******/
    };
    /******/
    /******/ // Object.prototype.hasOwnProperty.call
    /******/
    __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ // __webpack_public_path__
    /******/
    __webpack_require__.p = "";
    /******/
    /******/
    /******/ // Load entry module and return exports
    /******/
    return __webpack_require__(__webpack_require__.s = "fb15");
    /******/
  })
  /************************************************************************/
  /******/
  ({

    /***/
    "0029":
      /***/
      (function (module, exports) {

        // IE 8- don't enum bug keys
        module.exports = (
          'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
        ).split(',');


        /***/
      }),

    /***/
    "0185":
      /***/
      (function (module, exports, __webpack_require__) {

        // 7.1.13 ToObject(argument)
        var defined = __webpack_require__("e5fa");
        module.exports = function (it) {
          return Object(defined(it));
        };


        /***/
      }),

    /***/
    "01f9":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var LIBRARY = __webpack_require__("2d00");
        var $export = __webpack_require__("5ca1");
        var redefine = __webpack_require__("2aba");
        var hide = __webpack_require__("32e9");
        var Iterators = __webpack_require__("84f2");
        var $iterCreate = __webpack_require__("41a0");
        var setToStringTag = __webpack_require__("7f20");
        var getPrototypeOf = __webpack_require__("38fd");
        var ITERATOR = __webpack_require__("2b4c")('iterator');
        var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
        var FF_ITERATOR = '@@iterator';
        var KEYS = 'keys';
        var VALUES = 'values';

        var returnThis = function () {
          return this;
        };

        module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
          $iterCreate(Constructor, NAME, next);
          var getMethod = function (kind) {
            if (!BUGGY && kind in proto) return proto[kind];
            switch (kind) {
              case KEYS:
                return function keys() {
                  return new Constructor(this, kind);
                };
              case VALUES:
                return function values() {
                  return new Constructor(this, kind);
                };
            }
            return function entries() {
              return new Constructor(this, kind);
            };
          };
          var TAG = NAME + ' Iterator';
          var DEF_VALUES = DEFAULT == VALUES;
          var VALUES_BUG = false;
          var proto = Base.prototype;
          var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
          var $default = $native || getMethod(DEFAULT);
          var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
          var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
          var methods, key, IteratorPrototype;
          // Fix native
          if ($anyNative) {
            IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
            if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
              // Set @@toStringTag to native iterators
              setToStringTag(IteratorPrototype, TAG, true);
              // fix for some old engines
              if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
            }
          }
          // fix Array#{values, @@iterator}.name in V8 / FF
          if (DEF_VALUES && $native && $native.name !== VALUES) {
            VALUES_BUG = true;
            $default = function values() {
              return $native.call(this);
            };
          }
          // Define iterator
          if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
            hide(proto, ITERATOR, $default);
          }
          // Plug for library
          Iterators[NAME] = $default;
          Iterators[TAG] = returnThis;
          if (DEFAULT) {
            methods = {
              values: DEF_VALUES ? $default : getMethod(VALUES),
              keys: IS_SET ? $default : getMethod(KEYS),
              entries: $entries
            };
            if (FORCED)
              for (key in methods) {
                if (!(key in proto)) redefine(proto, key, methods[key]);
              } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
          }
          return methods;
        };


        /***/
      }),

    /***/
    "02f4":
      /***/
      (function (module, exports, __webpack_require__) {

        var toInteger = __webpack_require__("4588");
        var defined = __webpack_require__("be13");
        // true  -> String#at
        // false -> String#codePointAt
        module.exports = function (TO_STRING) {
          return function (that, pos) {
            var s = String(defined(that));
            var i = toInteger(pos);
            var l = s.length;
            var a, b;
            if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
            a = s.charCodeAt(i);
            return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ?
              TO_STRING ? s.charAt(i) : a :
              TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
          };
        };


        /***/
      }),

    /***/
    "0390":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var at = __webpack_require__("02f4")(true);

        // `AdvanceStringIndex` abstract operation
        // https://tc39.github.io/ecma262/#sec-advancestringindex
        module.exports = function (S, index, unicode) {
          return index + (unicode ? at(S, index).length : 1);
        };


        /***/
      }),

    /***/
    "061b":
      /***/
      (function (module, exports, __webpack_require__) {

        module.exports = __webpack_require__("7017");

        /***/
      }),

    /***/
    "07c8":
      /***/
      (function (module, exports, __webpack_require__) {

        // 19.1.3.19 Object.setPrototypeOf(O, proto)
        var $export = __webpack_require__("d13f");
        $export($export.S, 'Object', {
          setPrototypeOf: __webpack_require__("6494").set
        });


        /***/
      }),

    /***/
    "0a0a":
      /***/
      (function (module, exports, __webpack_require__) {

        var global = __webpack_require__("da3c");
        var core = __webpack_require__("a7d3");
        var LIBRARY = __webpack_require__("b457");
        var wksExt = __webpack_require__("fda1");
        var defineProperty = __webpack_require__("3adc").f;
        module.exports = function (name) {
          var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
          if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, {
            value: wksExt.f(name)
          });
        };


        /***/
      }),

    /***/
    "0bfb":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        // 21.2.5.3 get RegExp.prototype.flags
        var anObject = __webpack_require__("cb7c");
        module.exports = function () {
          var that = anObject(this);
          var result = '';
          if (that.global) result += 'g';
          if (that.ignoreCase) result += 'i';
          if (that.multiline) result += 'm';
          if (that.unicode) result += 'u';
          if (that.sticky) result += 'y';
          return result;
        };


        /***/
      }),

    /***/
    "0d58":
      /***/
      (function (module, exports, __webpack_require__) {

        // 19.1.2.14 / 15.2.3.14 Object.keys(O)
        var $keys = __webpack_require__("ce10");
        var enumBugKeys = __webpack_require__("e11e");

        module.exports = Object.keys || function keys(O) {
          return $keys(O, enumBugKeys);
        };


        /***/
      }),

    /***/
    "0f89":
      /***/
      (function (module, exports, __webpack_require__) {

        var isObject = __webpack_require__("6f8a");
        module.exports = function (it) {
          if (!isObject(it)) throw TypeError(it + ' is not an object!');
          return it;
        };


        /***/
      }),

    /***/
    "103a":
      /***/
      (function (module, exports, __webpack_require__) {

        var document = __webpack_require__("da3c").document;
        module.exports = document && document.documentElement;


        /***/
      }),

    /***/
    "11e9":
      /***/
      (function (module, exports, __webpack_require__) {

        var pIE = __webpack_require__("52a7");
        var createDesc = __webpack_require__("4630");
        var toIObject = __webpack_require__("6821");
        var toPrimitive = __webpack_require__("6a99");
        var has = __webpack_require__("69a8");
        var IE8_DOM_DEFINE = __webpack_require__("c69a");
        var gOPD = Object.getOwnPropertyDescriptor;

        exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
          O = toIObject(O);
          P = toPrimitive(P, true);
          if (IE8_DOM_DEFINE) try {
            return gOPD(O, P);
          } catch (e) {
            /* empty */
          }
          if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
        };


        /***/
      }),

    /***/
    "12fd":
      /***/
      (function (module, exports, __webpack_require__) {

        var isObject = __webpack_require__("6f8a");
        var document = __webpack_require__("da3c").document;
        // typeof document.createElement is 'object' in old IE
        var is = isObject(document) && isObject(document.createElement);
        module.exports = function (it) {
          return is ? document.createElement(it) : {};
        };


        /***/
      }),

    /***/
    "12fd9":
      /***/
      (function (module, exports) {



        /***/
      }),

    /***/
    "1495":
      /***/
      (function (module, exports, __webpack_require__) {

        var dP = __webpack_require__("86cc");
        var anObject = __webpack_require__("cb7c");
        var getKeys = __webpack_require__("0d58");

        module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
          anObject(O);
          var keys = getKeys(Properties);
          var length = keys.length;
          var i = 0;
          var P;
          while (length > i) dP.f(O, P = keys[i++], Properties[P]);
          return O;
        };


        /***/
      }),

    /***/
    "1991":
      /***/
      (function (module, exports, __webpack_require__) {

        var ctx = __webpack_require__("9b43");
        var invoke = __webpack_require__("31f4");
        var html = __webpack_require__("fab2");
        var cel = __webpack_require__("230e");
        var global = __webpack_require__("7726");
        var process = global.process;
        var setTask = global.setImmediate;
        var clearTask = global.clearImmediate;
        var MessageChannel = global.MessageChannel;
        var Dispatch = global.Dispatch;
        var counter = 0;
        var queue = {};
        var ONREADYSTATECHANGE = 'onreadystatechange';
        var defer, channel, port;
        var run = function () {
          var id = +this;
          // eslint-disable-next-line no-prototype-builtins
          if (queue.hasOwnProperty(id)) {
            var fn = queue[id];
            delete queue[id];
            fn();
          }
        };
        var listener = function (event) {
          run.call(event.data);
        };
        // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
        if (!setTask || !clearTask) {
          setTask = function setImmediate(fn) {
            var args = [];
            var i = 1;
            while (arguments.length > i) args.push(arguments[i++]);
            queue[++counter] = function () {
              // eslint-disable-next-line no-new-func
              invoke(typeof fn == 'function' ? fn : Function(fn), args);
            };
            defer(counter);
            return counter;
          };
          clearTask = function clearImmediate(id) {
            delete queue[id];
          };
          // Node.js 0.8-
          if (__webpack_require__("2d95")(process) == 'process') {
            defer = function (id) {
              process.nextTick(ctx(run, id, 1));
            };
            // Sphere (JS game engine) Dispatch API
          } else if (Dispatch && Dispatch.now) {
            defer = function (id) {
              Dispatch.now(ctx(run, id, 1));
            };
            // Browsers with MessageChannel, includes WebWorkers
          } else if (MessageChannel) {
            channel = new MessageChannel();
            port = channel.port2;
            channel.port1.onmessage = listener;
            defer = ctx(port.postMessage, port, 1);
            // Browsers with postMessage, skip WebWorkers
            // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
          } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
            defer = function (id) {
              global.postMessage(id + '', '*');
            };
            global.addEventListener('message', listener, false);
            // IE8-
          } else if (ONREADYSTATECHANGE in cel('script')) {
            defer = function (id) {
              html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
                html.removeChild(this);
                run.call(id);
              };
            };
            // Rest old browsers
          } else {
            defer = function (id) {
              setTimeout(ctx(run, id, 1), 0);
            };
          }
        }
        module.exports = {
          set: setTask,
          clear: clearTask
        };


        /***/
      }),

    /***/
    "1b55":
      /***/
      (function (module, exports, __webpack_require__) {

        var store = __webpack_require__("7772")('wks');
        var uid = __webpack_require__("7b00");
        var Symbol = __webpack_require__("da3c").Symbol;
        var USE_SYMBOL = typeof Symbol == 'function';

        var $exports = module.exports = function (name) {
          return store[name] || (store[name] =
            USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
        };

        $exports.store = store;


        /***/
      }),

    /***/
    "1b8f":
      /***/
      (function (module, exports, __webpack_require__) {

        var toInteger = __webpack_require__("a812");
        var max = Math.max;
        var min = Math.min;
        module.exports = function (index, length) {
          index = toInteger(index);
          return index < 0 ? max(index + length, 0) : min(index, length);
        };


        /***/
      }),

    /***/
    "1d73":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";

        // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.replace.js
        var es6_regexp_replace = __webpack_require__("a481");

        // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.constructor.js
        var es6_regexp_constructor = __webpack_require__("3b2b");

        // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.promise.js
        var es6_promise = __webpack_require__("551c");

        // EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
        var web_dom_iterable = __webpack_require__("ac6a");

        // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
        var es6_object_assign = __webpack_require__("f751");

        // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/classCallCheck.js
        var classCallCheck = __webpack_require__("d225");

        // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/createClass.js
        var createClass = __webpack_require__("b0b4");

        // EXTERNAL MODULE: ./src/platform/kernel/qt/plugins/device.js
        var device = __webpack_require__("5710");

        // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.name.js
        var es6_function_name = __webpack_require__("7f7f");

        // CONCATENATED MODULE: ./src/platform/kernel/device/simulator/simulator.js





        /**
         * 导入模拟数据（text为requirejs的插件text.js，如需修改环境，需修改此处的import）
         */
        // import SimulatorData =  require("./devices.json")
        // import SimulatorData from "@/../public/mock/devices/devices.json"

        /**
         * HTTP读取文件
         * @param sendData
         * @param URL
         */
        function sendHttpWebSocket(sendData, URL) {
          var response = "";
          var xmlhttp = new XMLHttpRequest();

          xmlhttp.onreadystatechange = function () {
            if (xmlhttp.status == 200 || xmlhttp.status == 0) {
              response = xmlhttp.responseText;
            } else if (xmlhttp.status == 400) {
              console.warn("Bad Request(parameter is not json format)");
            } else if (xmlhttp.status == 500) {
              console.warn("Bad Request(parameter is not json array)");
            }
          };

          xmlhttp.open("GET", URL, false);
          xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xmlhttp.send(sendData);
          return response;
        }

        var allSimulatorData;

        try {
          //allSimulatorData = JSON.parse(sendHttpWebSocket('', 'static/mock/devices/devices.json'));
          allSimulatorData = {};
        } catch (e) {
          console.error(e); // let SimulatorData = import('@/../public/mock/devices/devices.json');
          // console.log('SimulatorData:')
          // console.log(SimulatorData)

          allSimulatorData = {};
        }
        /**
         * 设备JS模拟器
         */


        var simulator_CSimulator =
          /*#__PURE__*/
          function () {
            // /**
            //  * 构造器
            //  * @param devName 设备对象名
            //  * @param serviceName 设备逻辑名
            //  */
            // constructor(devName: string, serviceName: string, onEvent: (cmd: string, params: object) => void) {
            //     if (devName) {
            //         this.devName = devName;
            //     }
            //     if (serviceName) {
            //         this.serviceName = serviceName;
            //     }
            //     if (onEvent) {
            //         this.onEvent = onEvent;
            //     }
            //     this.simulatorData = allSimulatorData[this.devName] || allSimulatorData.common;
            //     this.setSimulator((this.simulatorData && typeof(this.simulatorData.switch) == "string") ? 'on' == this.simulatorData.switch : ('on' == allSimulatorData.switch && 'off' != allSimulatorData.switch));
            // }

            /**
             * 构造器
             * @param devName 设备对象名
             * @param serviceName 设备逻辑名
             */
            function CSimulator(moduleObj) {
              Object(classCallCheck["a" /* default */ ])(this, CSimulator);

              /**
               * @property {string} devName 设备对象名
               */
              this.devName = 'magcard';
              /**
               * @property {string} devName 设备逻辑名，对应SP逻辑名
               */

              this.serviceName = 'none';
              /**
               * @property {object} simulatorData 当前对象模拟数据
               */

              this.simulatorData = {};
              /**
               * @property {boolean} _isSimulator 是否使用设备模拟
               */

              this._isSimulator = false;
              /**
               * 模块对象
               */

              this.moduleObj = null;

              if (moduleObj) {
                this.moduleObj = moduleObj;
              }

              if (moduleObj.devName) {
                this.devName = moduleObj.devName;
              }

              if (moduleObj.serviceName) {
                this.serviceName = moduleObj._serviceName;
              }

              if (moduleObj.onEvent) {
                this.onEvent = moduleObj.onEvent;
              }

              if (moduleObj.triggerEvent) {
                this.triggerEvent = moduleObj.triggerEvent;
              }

              this.simulatorData = allSimulatorData[this.devName] || allSimulatorData.common;
              this.setSimulator(this.simulatorData && typeof this.simulatorData.switch == "string" ? 'on' == this.simulatorData.switch : 'on' == allSimulatorData.switch && 'off' != allSimulatorData.switch);
            }

            Object(createClass["a" /* default */ ])(CSimulator, [{
              key: "triggerEvent",
              value: function triggerEvent(cmd, params) {
                console.log('triggerEvent in simulator.cmd:' + cmd + ';params:' + params);
              }
            }, {
              key: "onEvent",
              value: function onEvent(cmd, params) {
                console.log('onEvent in simulator.cmd:' + cmd + ';params:' + params);
              }
              /**
               * 当前是否使用模拟器
               */

            }, {
              key: "isSimulator",
              value: function isSimulator() {
                return this._isSimulator;
              }
              /**
               * 设置是否启用模拟器
               * @param isSimulator
               */

            }, {
              key: "setSimulator",
              value: function setSimulator(isSimulator) {
                this._isSimulator = isSimulator;
              }
              /**
               * 执行this.dev.exec方法,传入命令和参数
               * @param {string} cmd
               * @param {any} param
               * @return 调用动作的结果，0表示成功，其他数值表示调用失败
               */

            }, {
              key: "execute",
              value: function execute(cmd, param) {
                var _this = this;

                var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (error, response) {};
                console.debug("========= into simulator execute   ================");
                var simulatorData = this.simulatorData;
                var expectEvent = cmd + 'Over';
                if (expectEvent && callback) this.moduleObj.addEventListener(expectEvent, callback, true);

                if (!simulatorData.execute[cmd] || !simulatorData.execute[cmd].events) {
                  setTimeout(function () {
                    _this.moduleObj.triggerEvent && _this.moduleObj.triggerEvent(null, {
                      msgName: cmd + simulatorData.execute.common,
                      param: simulatorData.execute.value
                    });
                    _this.onEvent && _this.onEvent(cmd + simulatorData.execute.common, simulatorData.execute.value);
                  }, simulatorData.execute.delay || 2000);
                } else {
                  var events = simulatorData.execute[cmd].events;
                  events.forEach(function (event) {
                    setTimeout(function () {
                      _this.moduleObj.triggerEvent && _this.moduleObj.triggerEvent(null, {
                        msgName: event.name,
                        param: event.value
                      });
                      _this.onEvent && _this.onEvent(event.name, event.value);
                    }, event.delay || 2000);
                  });
                }

                console.log(simulatorData);
                console.debug("========= end simulator execute ================");
              }
              /**
               * 执行this.dev.exec方法,传入命令和参数
               * @param {string} cmd
               * @param {any} param
               * @return 调用动作的结果，0表示成功，其他数值表示调用失败
               */

            }, {
              key: "executeAsync",
              value: function executeAsync(cmd, param) {
                var _this2 = this;

                var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (error, response) {};
                console.debug("========= into simulator execute   ================");
                var simulatorData = this.simulatorData;

                if (!simulatorData.execute[cmd] || !simulatorData.execute[cmd].events) {
                  setTimeout(function () {
                    _this2.onEvent && _this2.onEvent(cmd + simulatorData.execute.common, simulatorData.execute.value);
                  }, simulatorData.execute.delay || 2000);
                } else {
                  var events = simulatorData.execute[cmd].events;
                  events.forEach(function (event) {
                    setTimeout(function () {
                      _this2.onEvent && _this2.onEvent(event.name, event.value);
                    }, event.delay || 2000);
                  });
                }

                console.debug("========= end simulator execute ================");
              }
              /**
               *执行this.dev.getInfo方法，传入命令和参数
               *@param {string} cmd
               *@param {any} param
               *@return 返回""表示获取属性失败，否则为获取到的动作结果
               */

            }, {
              key: "getInfo",
              value: function getInfo(cmd, param) {
                var info = '';
                var simulatorData = this.simulatorData;

                if (simulatorData.getInfo) {
                  if (!simulatorData.getInfo[cmd]) {
                    info = simulatorData.getInfo.common;
                  } else {
                    info = simulatorData.getInfo[cmd];
                  }
                } else {
                  info = '{"result":"0","outinfo":"0|1|2|3"}';
                }

                return info;
              }
              /**
               *执行this.dev.getInfo方法，传入命令和参数
               *@param {string} cmd
               *@param {any} param
               *@return 返回""表示获取属性失败，否则为获取到的动作结果
               */

            }, {
              key: "getInfoAsync",
              value: function getInfoAsync(cmd, param) {
                var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (error, response) {};
                var info = '';
                var simulatorData = this.simulatorData;

                if (simulatorData.getInfo) {
                  if (!simulatorData.getInfo[cmd]) {
                    info = simulatorData.getInfo.common;
                  } else {
                    info = simulatorData.getInfo[cmd];
                  }
                } else {
                  info = '{"result":"0","outinfo":"0|1|2|3"}';
                }

                return info;
              }
              /**
               * @description 获取对应的设备属性，传入为属性名称，
               * @param {string} Name
               * @return 返回""表示获取属性失败，否则为获取到的结果
               */

            }, {
              key: "getAttribute",
              value: function getAttribute(name) {
                var property = 'HEALTHY';
                var simulatorData = this.simulatorData;

                if (simulatorData.getAttribute) {
                  if (!simulatorData.getAttribute[name]) {
                    property = simulatorData.getAttribute.common;
                  } else {
                    property = simulatorData.getAttribute[name];
                  }
                }

                return property;
              }
              /**
               *获取对应的设备属性，传入为属性名称，
               *@param ｛string｝ Name
               *@return 返回""表示获取属性失败，否则为获取到的结果
               */

            }, {
              key: "getAttributeAsync",
              value: function getAttributeAsync(name) {
                var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (error, response) {};
                var property = 'HEALTHY';
                var simulatorData = this.simulatorData;

                if (simulatorData.getAttribute) {
                  if (!simulatorData.getAttribute[name]) {
                    property = simulatorData.getAttribute.common;
                  } else {
                    property = simulatorData.getAttribute[name];
                  }
                }

                return property;
              }
              /**
               *设置对应的设备属性，传入属性名称，属性值
               *@param {string} name
               *@param {string} value
               *@return 设置设备属性结果，0表示成功，其他表示调⽤用失败
               */

            }, {
              key: "setAttribute",
              value: function setAttribute(name, value) {
                var ret = 'OK';
                console.debug("setAttribute.ret:" + ret);
                return ret;
              }
              /**
               *设置对应的设备属性，传入属性名称，属性值
               *@param {string} name
               *@param {string} value
               *@return 设置设备属性结果，0表示成功，其他表示调⽤用失败
               */

            }, {
              key: "setAttributeAsync",
              value: function setAttributeAsync(name, value) {
                var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (error, response) {};
                var ret = 'OK';
                return ret;
              }
              /**
               * 打开设备连接
               * @param serviceName
               * @param successback
               * @param errorback
               */

            }, {
              key: "OpenConnection",
              value: function OpenConnection(serviceName) {
                var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (error, response) {};
                console.debug("========= end simulator OpenConnection   ================");
                this.executeAsync('OpenConnection', {}, callback);
              }
              /**
               * 关闭设备连接
               * @param successback
               * @param errorback
               */

            }, {
              key: "CloseConnection",
              value: function CloseConnection() {
                var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (error, response) {};
                this.executeAsync('CloseConnection', {}, callback);
              }
            }]);

            return CSimulator;
          }();

        /* harmony default export */
        var simulator_simulator = (simulator_CSimulator); // export default CSimulator;
        // EXTERNAL MODULE: external {"commonjs":"lodash","commonjs2":"lodash","amd":"lodash","root":"_"}
        var external_commonjs_lodash_commonjs2_lodash_amd_lodash_root_ = __webpack_require__("60bb");

        // EXTERNAL MODULE: external {"commonjs":"@/config/config","commonjs2":"@/config/config","amd":"@/config/config","root":"Config"}
        var config_root_Config_ = __webpack_require__("5547");
        var config_root_Config_default = /*#__PURE__*/ __webpack_require__.n(config_root_Config_);

        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/XfsEventHandler.js



        /**
         * @file CXfsEventHandler
         * @author dailin
         * @copyright gwi
         * @createDate 2018-06
         */

        /**
         * @description 事件处理类，支持添加、删除和分发事件
         */
        var XfsEventHandler_CXfsEventHandler =
          /*#__PURE__*/
          function () {
            /**
             * @description 事件名称
             * @param {string} evtName 事件名称
             */
            function CXfsEventHandler(evtName) {
              Object(classCallCheck["a" /* default */ ])(this, CXfsEventHandler);

              this.evtName = evtName;
              this.listeners = [];
            }
            /**
             * @description 添加事件监听器
             * @param {function} listener 事件监听器
             * @param {boolean} once 是否只触发一次
             */


            Object(createClass["a" /* default */ ])(CXfsEventHandler, [{
              key: "addEventListener",
              value: function addEventListener(listener) {
                var once = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                this.listeners.push({
                  "listener": listener,
                  "once": once
                });
              }
              /**
               * @description 删除事件监听器
               * @param {function} listener 事件监听
               */

            }, {
              key: "removeEventListener",
              value: function removeEventListener(listener) {
                for (var i = 0; i < this.listeners.length; i++) {
                  if (this.listeners[i].listener === listener) {
                    // Remove the listener from our queue
                    this.listeners.splice(i, 1);
                    return;
                  }
                }
              }
              /**
               * 存在监听器
               */

            }, {
              key: "existEventListener",
              value: function existEventListener() {
                return this.listeners.length > 0;
              }
              /**
               * @description 分发事件
               * @param {Object} context 事件分发上下文
               * @param {Object} error 错误信息
               * @param {Object|string|number} response 正常响应或事件
               */

            }, {
              key: "triggerEvent",
              value: function triggerEvent(context, error, response) {
                // Notify all listeners about this event
                for (var i = 0; i < this.listeners.length; i++) {
                  typeof this.listeners[i].listener === 'function' && this.listeners[i].listener.apply(context, [error, response]);

                  if (this.listeners[i].once) {
                    this.listeners.splice(i, 1);
                    --i;
                    break;
                  }
                }
              }
            }]);

            return CXfsEventHandler;
          }();

        /* harmony default export */
        var XfsEventHandler = (XfsEventHandler_CXfsEventHandler);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/basedev.js












        /**
         * 设备调用接口基类
         */

        var basedev_CBaseDev =
          /*#__PURE__*/
          function () {
            /**
             * @constructor  CBaseDev
             * @description DevInterface接口类，与C提供的接口一致
             * @param {string} serviceName 对应DevInterface中的devName
             */
            function CBaseDev(serviceName) {
              var devName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'basedev';

              Object(classCallCheck["a" /* default */ ])(this, CBaseDev);

              /**
               * @property {number} SIU 类型
               */
              this.siuType = 4;
              /**
               * @property {number} 是否手工控制siu灯控（如果其它sp中已经调用siu，则不需要手工调用，置为false）
               */

              this.lightSiuByHand = true;
              /**
               * {boolean} 是否模拟器模式
               */

              this._isSimulator = false;

              this.devExtend = function (n, o) {
                for (var p in o) {
                  n[p] = o[p];
                }

                return n;
              };

              this._serviceName = serviceName;
              this.events = {};
              /**
               * 事件缓存，用于自管理事件管理器
               */

              this.eventsCached = {};
              this.siuSpeed = 4;
              this.AttrList = {
                filename: ''
              };
              this.devName = devName;
              this.dev = device["a" /* default */ ]; // let simulator = new Simulator(this.devName, this._serviceName, this.onEvent)

              var simulator = new simulator_simulator(this);
              this.setSimulator(simulator.isSimulator());

              if (simulator.isSimulator()) {
                Object.assign(this, simulator); // 使用模拟器方法覆盖真实设备方法

                this.execute = simulator.execute;
                this.getAttribute = simulator.getAttribute;
                this.getInfo = simulator.getInfo;
                this.setAttribute = simulator.setAttribute;
              }

              CBaseDev.allObjects = CBaseDev.allObjects || {};
              CBaseDev.allObjects[this.devName] = this;
            }
            /**
             * @property {string} _serviceName 设备服务名称
             */


            Object(createClass["a" /* default */ ])(CBaseDev, [{
              key: "getServiceName",
              value: function getServiceName() {
                return this._serviceName;
              }
              /**
               * 设置服务名（SP逻辑名）
               * @property {string} _serviceName 设备服务名称
               */

            }, {
              key: "setServiceName",
              value: function setServiceName(serviceName) {
                this._serviceName = serviceName;
              }
              /**
               * 当前是否使用模拟器
               */

            }, {
              key: "isSimulator",
              value: function isSimulator() {
                return this._isSimulator;
              }
              /**
               * 设置是否启用模拟器
               * @param isSimulator
               */

            }, {
              key: "setSimulator",
              value: function setSimulator(isSimulator) {
                this._isSimulator = isSimulator;
              }
              /**
               * 获取事件绑定对象（全局绑定时使用）
               */

            }, {
              key: "getToBindTarget",
              value: function getToBindTarget() {
                var toBindTarget = null;
                var $App = window.$App;
                var eventBus = window.EventBus;
                var $ = window.$;
                var JQMM = window.JQMM;

                try {
                  if ($App && $App.vu) {
                    toBindTarget = $App.vu;
                    toBindTarget.trigger = toBindTarget.$emit;
                  } else if ($ && $(':mobile-pagecontainer') && $(':mobile-pagecontainer').pagecontainer && $(':mobile-pagecontainer').pagecontainer("getActivePage").trigger) {
                    // jqm当前激活页面
                    toBindTarget = $(':mobile-pagecontainer').pagecontainer("getActivePage");
                  } else if (JQMM && JQMM.App && JQMM.App.trigger) {
                    // 应用全局对象
                    toBindTarget = JQMM.App;
                  } else {
                    toBindTarget = null;
                  }

                  toBindTarget = toBindTarget ? [toBindTarget] : [];

                  if (eventBus && eventBus.bindEvent && eventBus._events) {
                    eventBus.trigger = eventBus.$emit;
                    toBindTarget.push(eventBus);
                  }
                } catch (e) {
                  console.error('Failed to run getToBindTarget: ' + e);
                }

                return toBindTarget;
              }
              /**
               * 传统分发事件处理
               * @param eventName 事件名
               * @param param 事件参数
               * @emits 事件名 moduleName + eventName
               */

            }, {
              key: "dispatchEvent",
              value: function dispatchEvent(eventName, param) {
                var _this = this;

                var bindTarget = this.getToBindTarget();

                if (bindTarget && bindTarget.length > 0) {
                  // 存在可绑定事件对象(改为数组了，可能存在多个事件绑定对象)
                  bindTarget.forEach(function (element) {
                    element.trigger(_this.devName + eventName, param);
                  });
                } else {
                  this.callCustomerFunc(this.devName + eventName, param);
                }
              }
              /**
               * 设备调用完成后响应事件调用定义
               * 如
               * "CardCaptured":"cardCaptureOver"
               *
               * @param {string} cmd
               * @param {object} args
               */

            }, {
              key: "onEvent",
              value: function onEvent(cmd, args) {
                console.info('========= into basedev onEvent   ================'); //获取各设备组件定义的事件

                console.info("========= into basedev cmd=[".concat(cmd, "]"));
                var cmdOver = this.events && this.events[cmd] || cmd;
                console.info("========= into basedev cmdOver=[".concat(cmdOver, "]")); //如果定义的只是一个字符串方法名就动态转换后调用

                if (typeof cmdOver === 'string') {
                  cmdOver = this.devName + cmdOver.trim(); // 字符串自动加上设备对象名

                  var bindTarget = this.getToBindTarget();

                  if (bindTarget && bindTarget.length > 0) {
                    // 存在可绑定事件对象
                    bindTarget.forEach(function (element) {
                      element.trigger(cmdOver, args);
                    });
                  } else {
                    if (window && window[cmdOver]) {
                      if (window && window[cmdOver]) window[cmdOver].call(window, args);
                    } else {
                      console.warn("no global method [".concat(cmdOver, "] defined!!!"));
                    }
                  }
                } else if (typeof cmdOver === 'function') {
                  //如果是一个方法的话,则直接调用
                  cmdOver.call(this, args);
                }
              }
              /**
               * 通用设备调用完成后响应事件(测试工具专用)
               * @param {object} response {msgName: 'AcceptAndReadTracksOver', devName: 'CardReader', param: {cmdName: 'AcceptAndReadTracks', track1: ...}}
               */

            }, {
              key: "dispatchAllEvent",
              value: function dispatchAllEvent(response) {
                console.info('========= into basedev dispatchAllEvent for testtools  ================');
                var bindTarget = this.getToBindTarget();

                if (bindTarget && bindTarget.length > 0) {
                  // 存在可绑定事件对象
                  bindTarget.forEach(function (element) {
                    element.trigger("allDispatchedEvents", response);
                  });
                } else {
                  if (window && window["allDispatchedEvents"]) {
                    if (window && window["allDispatchedEvents"]) window["allDispatchedEvents"].call(window, response);
                  } else {
                    console.warn("no global method [allDispatchedEvents] defined!!!");
                  }
                }
              }
              /**
               * @description 错误事件
               * @param message 错误信息
               */

            }, {
              key: "onError",
              value: function onError(message) {
                console.error('========= into basedev onError   ===' + message);
              }
              /**
               * 执行this.dev.exec方法,传入命令和参数
               * @param {string} cmd
               * @param {any} param
               * @return 调用动作的结果，0表示成功，其他数值表示调用失败
               */

            }, {
              key: "execute",
              value: function execute(cmd, param) {
                var _this2 = this;

                var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (error, response) {};
                console.info('========= into basedev execute   ================');
                var serviceName = this._serviceName;
                console.info(serviceName + ':' + cmd + '.....' + JSON.stringify(external_commonjs_lodash_commonjs2_lodash_amd_lodash_root_ && external_commonjs_lodash_commonjs2_lodash_amd_lodash_root_["omit"](param, 'CustomData', 'KeyValue', 'fingerdata', 'featuredata', 'templetedata', 'data') || param));
                var expectEvent = cmd + 'Over';
                if (expectEvent && callback) this.addEventListener(expectEvent, callback, true); // 自动添加执行完成事件监听

                this.dev.exec(serviceName, cmd, JSON.stringify(param), 0, function (result) {
                  var resultObj = typeof result === 'string' ? JSON.parse(result) : result;

                  if (resultObj.hResult == undefined || resultObj.hResult == 0) {
                    console.info('basedev execute success result=' + JSON.stringify(external_commonjs_lodash_commonjs2_lodash_amd_lodash_root_ && external_commonjs_lodash_commonjs2_lodash_amd_lodash_root_["omit"](resultObj, 'CustomData', 'KeyValue', 'param.field55', 'param.icTrack2', 'param.PINBlock', 'param.chipdata.datas', 'param.track1.datas', 'param.track2.datas', 'param.track3.datas', 'param.outdata') || resultObj));
                  } else {
                    console.info('basedev execute success result=' + JSON.stringify(resultObj));
                  }

                  if (config_root_Config_default.a && config_root_Config_default.a.testMode === true) {
                    _this2.dispatchAllEvent(resultObj);
                  }

                  _this2.transformEventMapping(cmd, resultObj); // 转换事件名处理


                  CBaseDev.staticSuccessCallback(resultObj); // 回调处理
                }, function (result) {
                  console.error('basedev execute error result=' + result);
                  var resultObj = {
                    error: result,
                    moduleName: _this2.devName,
                    param: {
                      cmdName: cmd
                    },
                    serviceName: _this2._serviceName
                  };
                  CBaseDev.staticFailedCallback(resultObj);
                });
                console.info('========= end basedev execute ================');
              }
              /**
               *执行this.dev.getInfo方法，传入命令和参数
               *@param {string} cmd
               *@param {object} param
               *@param {boolean} sync 是否同步调用,默认是
               *@return 同步调用返回""表示获取属性失败，否则为获取到的动作结果，异步调用返回promise对象
               */

            }, {
              key: "getInfo",
              value: function getInfo(cmd, param) {
                var _this3 = this;

                var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (error, response) {};
                var serviceName = this._serviceName;
                console.info('getInfo.serviceName:' + serviceName + ':' + cmd + '.....' + JSON.stringify(param));

                if (sync && typeof sync !== 'function') {
                  // 为function的话，则使用回调方式
                  var info = this.dev.getInfo(serviceName, cmd, param, 0);

                  try {
                    info = info && undefined != JSON.parse(info).value ? JSON.parse(info).value : info;
                  } catch (e) {
                    console.error(e);
                  }

                  console.info("getInfo.info:" + info);

                  if (!info || info === "") {
                    info = JSON.stringify({
                      result: '-1',
                      StDeviceStatus: 'NODEVICE',
                      StMediaStatus: 'NOTPRESENT'
                    });
                    console.warn("getInfo.blank.info:" + info);
                  }

                  return info;
                } else if (typeof sync === 'function') {
                  // 传参时直接覆盖sync为callback
                  callback = sync;
                  return this.dev.getInfoAsync(serviceName, cmd, JSON.stringify(param), 0, function (response) {
                    if (callback) callback(null, response);
                  }, function (error) {
                    if (callback) callback(error, {});
                  });
                } else {
                  var promise = new Promise(function (resolve, reject) {
                    try {
                      _this3.dev.getInfoAsync(serviceName, cmd, JSON.stringify(param), 0, resolve, reject);
                    } catch (e) {
                      reject(e);
                    }
                  });
                  return promise;
                }
              }
              /**
               * @description 获取对应的设备属性，传入为属性名称，
               * @param {string} Name
               * @param {boolean} sync 是否同步调用,默认是
               * @return 同步调用时返回""表示获取属性失败，否则为获取到的结果，异步调用返回promise对象
               */

            }, {
              key: "getAttribute",
              value: function getAttribute(name) {
                var _this4 = this;

                var sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (error, response) {};
                var _serviceName = this._serviceName;
                console.info('getAttribute: ' + _serviceName + ':' + name);

                if (sync && typeof sync !== 'function') {
                  var property = this.dev.getPriority(_serviceName, name, function (status) {
                    console.info("getPriority.successCallback");
                  }, function (status) {
                    console.info("getPriority.errorCallback");
                  }, true);
                  console.info("getAttribute.property:" + property);
                  return property;
                } else if (typeof sync === 'function') {
                  // 传参时直接覆盖sync为callback
                  callback = sync;
                  return this.dev.getPriorityAsync(_serviceName, name, null, 0, function (response) {
                    if (callback) callback(null, response);
                  }, function (error) {
                    if (callback) callback(error, {});
                  });
                } else {
                  var promise = new Promise(function (resolve, reject) {
                    try {
                      _this4.dev.getPriorityAsync(_serviceName, name, null, 0, resolve, reject);
                    } catch (e) {
                      reject(e);
                    }
                  });
                  return promise;
                }
              }
              /**
               *设置对应的设备属性，传入属性名称，属性值
               *@param {string} name
               *@param {any} value
               *@param {boolean} sync 是否同步调用,默认是
               *@return 同步调用时，0表示成功，其他表示调⽤用失败，异步调用返回promise对象
               */

            }, {
              key: "setAttribute",
              value: function setAttribute(name, value) {
                var _this5 = this;

                var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (error, response) {};
                var _serviceName = this._serviceName;
                console.info('setAttribute' + _serviceName + ':' + name + '=' + value);

                if (sync && typeof sync !== 'function') {
                  var ret = this.dev.setPriority(_serviceName, name, value, null, null, true);
                  console.info("setAttribute.ret:" + ret);
                  return ret;
                } else if (typeof sync === 'function') {
                  // 传参时直接覆盖sync为successback, successback 覆盖为 errorback
                  callback = sync;
                  return this.dev.setPriorityAsync(_serviceName, name, null, 0, function (response) {
                    if (callback) callback(null, response);
                  }, function (error) {
                    if (callback) callback(error, {});
                  });
                } else {
                  var promise = new Promise(function (resolve, reject) {
                    try {
                      _this5.dev.setPriorityAsync(_serviceName, name, JSON.stringify(value), 0, resolve, reject);
                    } catch (e) {
                      reject(e);
                    }
                  });
                  return promise;
                }
              }
              /**
               * 打开设备连接
               * @param serviceName
               * @param successback
               * @param errorback
               */

            }, {
              key: "OpenConnection",
              value: function OpenConnection(serviceName) {
                var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (error, response) {};
                console.info('========= into basedev OpenConnection   ================');
                this._serviceName = serviceName;
                var ret = this.execute('OpenConnection', {
                  'ServiceName': this._serviceName
                }, callback);
                console.info('========= end basedev OpenConnection   ================ ret:' + ret);
                return ret;
              }
              /**
               * 关闭设备连接
               * @param callback
               */

            }, {
              key: "CloseConnection",
              value: function CloseConnection(callback) {
                console.info('========= into basedev CloseConnection   ================');
                return this.execute('CloseConnection', {}, callback);
              }
              /**
               * 打开设备连接——同步接口
               * @param serviceName 逻辑名
               */

            }, {
              key: "OpenConnectionSync",
              value: function OpenConnectionSync(serviceName) {
                console.info('========= into basedev OpenConnectionSync   ================');
                this._serviceName = serviceName;
                return this.getInfo('OpenConnectionSync', {
                  'ServiceName': this._serviceName
                });
              }
              /**
               * 关闭设备连接——同步接口
               */

            }, {
              key: "CloseConnectionSync",
              value: function CloseConnectionSync() {
                console.info('========= into basedev CloseConnectionSync   ================');
                return this.getInfo('CloseConnectionSync', {});
              }
              /**
               * 转换事件映射
               * @param cmd 指令名
               * @param resultObj 指令返回的结果对象 {msgname: '', devName: '', param: {result: 0, cmdName: '', errorcode: -53}}
               */

            }, {
              key: "transformEventMapping",
              value: function transformEventMapping(cmd, resultObj) {
                var msgName = resultObj.msgName;
                var cmdName = cmd;
                var errorcode = 0;

                if (!(config_root_Config_default.a && config_root_Config_default.a.errorEventsDontTransform)) {
                  // 默认进行事件名转换
                  if (resultObj && resultObj.param && (resultObj.param.hResult != undefined || resultObj.param.result != undefined)) {
                    var hResult = resultObj.param.hResult || resultObj.param.result || resultObj.param.Result || 0;

                    if (hResult < 0 && hResult != -1316) {
                      // -1316: 没有放钞
                      switch (hResult) {
                        case -48:
                          // Timeout event
                          msgName = 'Timeout';
                          errorcode = hResult;
                          break;

                        case -4:
                          // Cancelled
                          msgName = 'Cancelled';
                          errorcode = hResult;
                          break;

                        case 0:
                          // keep as the same of ...Over event Name
                          msgName = resultObj.msgName;
                          break;

                        default:
                          // else < 0, 
                          msgName = 'DeviceError';
                          errorcode = hResult;
                          break;
                      }

                      cmdName = resultObj.cmdName || resultObj.param.cmdName || cmdName; // 确保cmdName不为空且优先获取中间件返回的cmdName

                      Object.assign(resultObj.param, {
                        cmdName: cmdName,
                        errorcode: errorcode
                      }); // 添加
                    }
                  }
                } else {
                  // 不转换事件名
                  var result = errorcode = resultObj.param.hResult || resultObj.param.result || resultObj.param.Result || 0;
                  Object.assign(resultObj.param, {
                    result: result,
                    errorcode: errorcode
                  }); // 添加errorcode
                } // fireEvent.apply(thisDev, [msgName, resultObj.param])


                resultObj.msgName = msgName;
                resultObj.moduleName = this.devName; // 设备模块名（不同于逻辑名）
              }
              /**
               * @description 添加事件监听函数
               * @param {string} evtName 事件名称
               * @param {(error, response)=>void} listener 事件处理函数
               * @param {boolean} once 是否只触发一次
               */

            }, {
              key: "addEventListener",
              value: function addEventListener(evtName, listener) {
                var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

                if (typeof this.eventsCached[evtName] === "undefined") {
                  this.eventsCached[evtName] = new XfsEventHandler(evtName);
                }

                this.eventsCached[evtName].addEventListener(listener, once);
              }
              /**
               * @description 删除事件监听函数
               * @param {string} evtName 事件名称
               * @param {(result:any)=>void} listener 事件处理函数
               */

            }, {
              key: "removeEventListener",
              value: function removeEventListener(evtName, listener) {
                if (typeof this.eventsCached[evtName] !== "undefined") {
                  this.eventsCached[evtName].removeEventListener(listener);
                }
              }
              /**
               * @description 删除事件监听函数
               * @param {string} evtName 事件名称
               * @param {(result:any)=>void} listener 事件处理函数
               */

            }, {
              key: "removeAllEventListener",
              value: function removeAllEventListener() {
                this.eventsCached = {};
              }
              /**
               * @description 分发事件或响应数据
               * @param {Object} error 错误信息对象
               * @param {Object} response 响应或事件
               */

            }, {
              key: "triggerEvent",
              value: function triggerEvent(error, response) {
                if (error) {
                  var evtName = error.param.cmdName + "Over";

                  if (typeof this.eventsCached[evtName] !== "undefined") {
                    this.eventsCached[evtName].triggerEvent(this, error, null);
                  } else {
                    console.warn("unhandle error message " + error.param.cmdName + " for " + error.serviceName);
                  }
                } else if (response) {
                  // 由于某些正在执行的任务，取消后其msgName不是以下两种取消报文应答格式返回，所有做了msgName映射处理
                  // if (response.msgName && this.eventsCachedMapper && this.eventsCachedMapper[response.msgName]) {
                  //     response.msgName = this.eventsCachedMapper[response.msgName];
                  // }
                  // 1. 对应的处理函数
                  if (typeof this.eventsCached[response.msgName] !== "undefined") {
                    this.eventsCached[response.msgName].triggerEvent(this, null, response);
                  } // 2. 第一种取消应答报文格式(Printer使用的取消格式)，将其处理成{cmdName}Over的格式返回给应用
                  else if (response.msgName === "WaitCancelled") {
                    var cmdName = response.param.cmdName + "Over";
                    response.msgName = cmdName;
                    response.param = null;
                    if (this.eventsCached[cmdName]) this.eventsCached[cmdName].triggerEvent(this, response, null);
                  } // 3. 第二种取消应答报文格式
                  else if (/\w+?Cancelled$/.test(response.msgName)) {
                    var subStr = new RegExp("Cancelled$");
                    var msgName = response.msgName.replace(subStr, "Over");
                    if (this.eventsCached[msgName]) this.eventsCached[msgName].triggerEvent(this, response, null);
                  } // 4.无法处理的
                  else {
                    console.warn("unhandle response message " + response.msgName + " for " + response.devName);
                  }
                }
              }
              /**
               * @description 成功回调函数
               * @param {Object} response 应答或事件对象
               */

            }, {
              key: "extend",
              value: function extend(o) {
                return this.devExtend.apply(this, [this, o]);
              }
              /**
               * 获取能力
               */

            }, {
              key: "GetCapabilities",
              value: function GetCapabilities() {
                return this.getInfo('GetCapabilities', {});
              }
              /**
               * 同步获取状态
               */

            }, {
              key: "GetStatusSync",
              value: function GetStatusSync(callback) {
                return this.getInfo('GetStatusSync', {}, callback);
              }
              /**
               * 异步获取状态
               */

            }, {
              key: "GetStatus",
              value: function GetStatus(callback) {
                return this.execute('GetStatus', {}, callback);
              }
              /**
               * 控制siu指示灯速度
               * @param {object} speed
               */

            }, {
              key: "controlGuideLight",
              value: function controlGuideLight(speed) {
                if (this.lightSiuByHand) {
                  var _$ = window._$;

                  if (_$ && _$('siu')) {
                    if (config_root_Config_default.a && config_root_Config_default.a.controlGuideLightByName) {
                      _$('siu').ControlGuideLightByName(this._serviceName, speed);
                    } else {
                      _$('siu').ControlGuideLightSync(this.siuType, speed);
                    }
                  } else {
                    console.warn("_$ is ".concat(_$, " or _$('siu') is ").concat(_$('siu')));
                  }
                }
              }
              /**
               * 用于各设备组件中事件响应调用定义
               * 如:
               *  "CardTaken":function(param){
                      this.controlGuideLight(1);
                      this.callCustomerFunc('cardTakenOver',param);
                  }
               *
               */

            }, {
              key: "callCustomerFunc",
              value: function callCustomerFunc(funname, args) {
                if (arguments.length > 0) {
                  // 至少传入一个方法名
                  var bindTarget = this.getToBindTarget();

                  if (bindTarget && bindTarget.length > 0) {
                    // 存在可绑定事件对象
                    bindTarget.forEach(function (element) {
                      element.trigger(funname, args);
                    });
                  } else {
                    if (window && window[funname]) window[funname].call(window, args);
                  }
                }
              }
            }], [{
              key: "staticSuccessCallback",
              value: function staticSuccessCallback(response) {
                if (CBaseDev.allObjects[response.moduleName] instanceof CBaseDev) {
                  if (response && response.error) {
                    // 错误处理事件，在catch中处理
                    CBaseDev.allObjects[response.moduleName].triggerEvent(response, null);
                  } else {
                    // 正常事件
                    CBaseDev.allObjects[response.moduleName].triggerEvent(null, response);
                  }
                } else {
                  console.warn("unhandle response: " + JSON.stringify(response));
                } // 原先的全局事件管理


                CBaseDev.allObjects[response.moduleName].onEvent(response.msgName, response.param);
              }
              /**
               * @description 错误回调用函数
               * @param {Object} response 错误对象 error: 错误信息
               */

            }, {
              key: "staticFailedCallback",
              value: function staticFailedCallback(response) {
                console.error("staticFailedCallback.response".concat(JSON.stringify(response)));
                CBaseDev.staticSuccessCallback(response);
                CBaseDev.allObjects[response.moduleName].onError(response.error);
              }
            }]);

            return CBaseDev;
          }();

        /* harmony default export */
        var basedev = __webpack_exports__["a"] = (basedev_CBaseDev);

        /***/
      }),

    /***/
    "1eef":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */
        var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a481");
        /* harmony import */
        var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */
        var core_js_modules_es6_regexp_search__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("386d");
        /* harmony import */
        var core_js_modules_es6_regexp_search__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_regexp_search__WEBPACK_IMPORTED_MODULE_1__);
        /* harmony import */
        var core_js_modules_es6_regexp_match__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("4917");
        /* harmony import */
        var core_js_modules_es6_regexp_match__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_regexp_match__WEBPACK_IMPORTED_MODULE_2__);
        /* harmony import */
        var _cordova__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("7290");
        /* harmony import */
        var _qwebchannel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("8a22");
        /* harmony import */
        var _http11__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("6dd1");
        /* harmony import */
        var _config_config__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("5547");
        /* harmony import */
        var _config_config__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/ __webpack_require__.n(_config_config__WEBPACK_IMPORTED_MODULE_6__);




        /*
         *  Copyright 2011 Wolfgang Koller - http://www.gofg.at/
         *
         *  Licensed under the Apache License, Version 2.0 (the "License");
         *  you may not use this file except in compliance with the License.
         *  You may obtain a copy of the License at
         *
         *      http://www.apache.org/licenses/LICENSE-2.0
         *
         *  Unless required by applicable law or agreed to in writing, software
         *  distributed under the License is distributed on an "AS IS" BASIS,
         *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
         *  See the License for the specific language governing permissions and
         *  limitations under the License.
         */




        var GlobalConfig = {
          nativeTunnel: 'ws',
          // ws, local, ocx, cordova
          nativeWsUrl: 'ws://localhost:12345',
          nativeHttpUrl: 'http://localhost:12346'
        };

        if (_config_config__WEBPACK_IMPORTED_MODULE_6___default.a && _config_config__WEBPACK_IMPORTED_MODULE_6___default.a.nativeTunnel) {
          GlobalConfig = _config_config__WEBPACK_IMPORTED_MODULE_6___default.a;
        }

        var userAgent = navigator.userAgent;

        if (userAgent && userAgent.indexOf("volcano") >= 0) {
          GlobalConfig.nativeTunnel = GlobalConfig.volcanoNativeTunnel || "local";
        } else if (userAgent && userAgent.toLowerCase().match(/android/i) == "android") {
          GlobalConfig.nativeTunnel = GlobalConfig.androidNativeTunnel || "http";
        }

        var nativeTunnel = GlobalConfig.nativeTunnel;
        var nativeWsUrl = GlobalConfig.nativeWsUrl;
        var NATIVE_HTTP_URL_DEFAULT = 'http://localhost:12346';
        var nativeHttpUrl = GlobalConfig.nativeHttpUrl;
        var ws_successcallback = []; //各个设备模块对应的websocket回调处理(中间事件，如按键事件、插卡、退卡事件等)

        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt = {
          callbacks: {
            success: [],
            failure: []
          }
        };
        var qWebChannel = null;
        /**
         * intilize Remote NativeBridge
         */

        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.init = function (callback, cancle) {
          console.info('NativeBridge.Qt.init');
          var baseUrl = '';

          if (location.search != "") {
            var matched = /[?&]webChannelBaseUrl=([A-Za-z0-9\-:/.]+)/.exec(location.search);

            if (matched && matched.length > 1) {
              baseUrl = matched[1];
            } else {
              baseUrl = "ws://localhost:12345";
            }
          } else {
            baseUrl = "ws://localhost:12345";
          }

          if (nativeWsUrl) {
            baseUrl = nativeWsUrl;
          }

          var lockReconnect = false;

          try {
            var socket = new window.WebSocket(baseUrl);

            socket.onclose = function (e) {
              cancle(reconnect)
              //reconnect();
              console.warn("web channel closed. code:" + e.code + ' reason:' + e.reason + ' isUserClose:' + e.wasClean);
            };

            socket.onerror = function (e) {
              callback(e, null); // reconnect();

              console.warn("web channel error. code:" + e.code + ' reason:' + e.reason + ' isUserClose:' + e.wasClean);
            };

            socket.onopen = function () {
              console.info('socket.onopen');

              if (nativeTunnel != 'http') {
                if (qWebChannel == null) {
                  qWebChannel = new _qwebchannel__WEBPACK_IMPORTED_MODULE_4__[ /* default */ "a"](socket, function (channel) {
                    _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.remote = channel.objects.cordova;
                    _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.remote.executeJS.connect(function (js) {
                      // console.log("run javascript: " + js);
                      if (js) {
                        js = js.replace(/Cordova/g, "NativeBridge");
                      }

                      eval(js);
                    });
                    _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.remote.loadFinished(true);
                    if (callback) callback(null, _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"]);
                  });
                } else {
                  console.warn("qWebChannel existed!!!");
                  window.setTimeout(function () {
                    if (callback) callback(null, _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"]);
                  }, 2000);
                }
              } else {
                // http协议，同样需要callback，通知websocket连接成功
                if (callback) callback(null, _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"]);
              }
            };

            if (nativeTunnel === 'http') {
              socket.onmessage = function (message) {
                console.info('received socket data===' + message.data);
                var obj = JSON.parse(message.data);

                if (obj && obj.devName) {
                  if (typeof ws_successcallback[obj.devName] === 'function') {
                    console.info(obj.devName + ' start callback function');
                    ws_successcallback[obj.devName](message.data);
                  } else {
                    console.info(obj.devName + ' no callback function');
                  }
                } else {
                  console.error('parse JSON data error!');
                }
              };
            }
          } catch (error) {
            console.error(error);
          }

          function reconnect() {
            if (lockReconnect) {
              return;
            }

            qWebChannel = null;
            lockReconnect = true;
            setTimeout(function () {
              _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.init(callback, cancle);
            }, 10000);
          }
        };
        /**
         * intilize Remote NativeBridge
         */


        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.initLocal = function (callback) {
          if (qWebChannel == null) {
            try {
              qWebChannel = new _qwebchannel__WEBPACK_IMPORTED_MODULE_4__[ /* default */ "a"](qt.webChannelTransport, function (channel) {
                _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.remote = channel.objects.cordova;
                _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.remote.executeJS.connect(function (js) {
                  // console.log("run javascript: " + js);
                  if (js) {
                    js = js.replace(/Cordova/g, "NativeBridge");
                  }

                  eval(js);
                });
                _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.remote.loadFinished(true);
                callback(null, _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"]);
              });
            } catch (error) {
              console.error(error);
            }
          } else {
            console.error("qWebChannel existed!!!");
          }
        };
        /**
         * Execute a call to a plugin function
         * @return bool true on success, false on error (e.g. function doesn't exist)
         */


        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.exec = function (successCallback, errorCallback, pluginName, functionName, parameters) {
          // Store a reference to the callback functions    
          _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbackId = _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbackId || Math.floor(Math.random() * 20000);
          if (_cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbackId >= 0) ++_cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbackId;
          else _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbackId = 0;
          var callbackId = _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbackId;

          if (nativeTunnel === 'http') {
            if (typeof successCallback === 'function') {
              if (parameters[0] == "SIU310") {
                if (parameters[1] != 'ControlGuideLightSync') {
                  ws_successcallback[parameters[0]] = successCallback;
                }
              } else {
                ws_successcallback[parameters[0]] = successCallback;
              }
            }

            var obj = {
              methodType: 1,
              //异步
              callID: callbackId,
              pluginName: pluginName,
              pluginMethod: functionName,
              devName: parameters[0],
              actionName: parameters[1],
              param: parameters[2]
            };
            sendHttp(JSON.stringify(obj), true, successCallback, errorCallback, parameters[3], parameters[0].indexOf("GWILog") >= 0 ? "/CallClient" : "/CallDevice");
            return;
          } // check remote object is ready


          if (typeof _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.remote == "undefined" || typeof _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.remote.exec != "function") {
            console.warn('warnning: no NativeBridge.init method be invoked!!!');
            return false;
          }

          _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbacks.success[callbackId] = successCallback;
          _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbacks.failure[callbackId] = errorCallback;
          _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.remote.exec(callbackId, pluginName, functionName, JSON.stringify(parameters));
          return true;
        };

        if (nativeTunnel === 'local') {
          // local方式
          _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].init = _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.initLocal;
        } else {
          // websocket方式
          _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].init = _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.init;
        }

        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].exec = _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.exec;
        /**
         * NativeBridge.exe callback
         */

        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callback = function () {
          var callbackId = arguments[0];
          var success = arguments[1];
          var callbackRef = null;
          var parameters = [];

          for (var i = 2; i < arguments.length; i++) {
            //debug.log( "Adding parameter " + arguments[i] );
            parameters[i - 2] = arguments[i];
          } // Keep reference to callback


          if (success) {
            callbackRef = _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbacks.success[callbackId];
          } else {
            callbackRef = _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbacks.failure[callbackId];
          } // Finally run the callback


          if (typeof callbackRef == "function") callbackRef.apply(this, parameters);
        };
        /**
         * When call success, then use NativeBridge.Qt.callback.succ
         */


        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callback.succ = function () {
          _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callback.apply(_cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt, arguments);
        };
        /**
         * When call failed, then use NativeBridge.Qt.callback.fail
         */


        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callback.fail = function () {
          _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callback.apply(_cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt, arguments);
        };
        /**
         * Delete callback function, Because of the need to support a function call the callback for several times
         */


        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callback.finish = function (callbackId) {
          // NativeBridge.Qt.callbacks.success.splice(callbackId, 1);
          // NativeBridge.Qt.callbacks.failure.splice(callbackId, 1);
          _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbacks.success[callbackId] = null;
          _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callbacks.failure[callbackId] = null;
        };

        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].callback.succ = _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callback.succ;
        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].callback.fail = _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callback.fail;
        _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].callback.finish = _cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"].Qt.callback.finish;
        /**
         * http方式通讯
         * @param {*} sendData 发送数据
         * @param {Boolean} bAsync 是否异步请求
         */

        function sendHttp(sendData, bAsync, successCallback, errorCallback, timeout, serviceName) {
          var response = "";
          var baseUrl = '';

          if (location.search != "") {
            var matched = /[?&]httpBaseUrl=([A-Za-z0-9\-:/.]+)/.exec(location.search);

            if (matched && matched.length > 1) {
              baseUrl = matched[1];
            } else {
              baseUrl = NATIVE_HTTP_URL_DEFAULT;
            }
          } else {
            baseUrl = NATIVE_HTTP_URL_DEFAULT;
          }

          baseUrl = nativeHttpUrl || baseUrl;

          if (serviceName) {
            baseUrl += serviceName;
          }

          var xmlhttp = GlobalConfig.nativeTunnelUseHttp11 ? Object(_http11__WEBPACK_IMPORTED_MODULE_5__[ /* default */ "a"])({
            method: "POST",
            baseUrl: baseUrl,
            bAsync: bAsync,
            requestHeaders: {
              "Content-Type": "application/json;charset=utf-8"
            }
          }) : new XMLHttpRequest();

          if (timeout > 0) {
            timeout += 3000; //通讯本身超时事件多加3秒
          }

          if (bAsync) {
            try {
              xmlhttp.timeout = timeout;

              xmlhttp.ontimeout = function (e) {
                console.warn("sendHttp.ontimeout: ");
                console.warn(e);

                if (errorCallback) {
                  errorCallback(xmlhttp);
                }
              };
            } catch (error) {
              console.error(error);
            }
          }

          xmlhttp.onerror = function (e) {
            console.error("sendHttp.onerror: ");
            console.error(e);

            if (bAsync) {
              if (errorCallback) {
                errorCallback(xmlhttp);
              }
            }
          };

          xmlhttp.onreadystatechange = function () {
            if ((xmlhttp.status == 200 || xmlhttp.status == 0) && xmlhttp.readyState == 4) {
              response = xmlhttp.responseText;

              if (response && bAsync && successCallback) {
                var respObj = typeof response === 'string' ? JSON.parse(response) : response;
                successCallback(respObj);
              }
            } else if (xmlhttp.status == 400) {
              console.warn("Bad Request(parameter is not json format)");

              if (bAsync && errorCallback) {
                errorCallback(xmlhttp);
              }
            } else if (xmlhttp.status == 500) {
              console.warn("Bad Request(parameter is not json array)");

              if (bAsync && errorCallback) {
                errorCallback(xmlhttp);
              } else {
                console.warn(xmlhttp.status);
              }
            }
          };

          if (!GlobalConfig.nativeTunnelUseHttp11) {
            xmlhttp.open("POST", baseUrl, bAsync);
            xmlhttp.setRequestHeader("Content-type", "application/json;charset=utf-8");
          }

          try {
            xmlhttp.send(sendData);
          } catch (error) {
            console.error(error);

            if (bAsync && errorCallback) {
              errorCallback(xmlhttp);
            }
          }

          return response;
        }

        /* harmony default export */
        __webpack_exports__["a"] = (_cordova__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"]); // end of NativeBridge

        /***/
      }),

    /***/
    "1fa8":
      /***/
      (function (module, exports, __webpack_require__) {

        // call something on iterator step with safe closing on error
        var anObject = __webpack_require__("cb7c");
        module.exports = function (iterator, fn, value, entries) {
          try {
            return entries ? fn(anObject(value)[0], value[1]) : fn(value);
            // 7.4.6 IteratorClose(iterator, completion)
          } catch (e) {
            var ret = iterator['return'];
            if (ret !== undefined) anObject(ret.call(iterator));
            throw e;
          }
        };


        /***/
      }),

    /***/
    "214f":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        __webpack_require__("b0c5");
        var redefine = __webpack_require__("2aba");
        var hide = __webpack_require__("32e9");
        var fails = __webpack_require__("79e5");
        var defined = __webpack_require__("be13");
        var wks = __webpack_require__("2b4c");
        var regexpExec = __webpack_require__("520a");

        var SPECIES = wks('species');

        var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
          // #replace needs built-in support for named groups.
          // #match works fine because it just return the exec results, even if it has
          // a "grops" property.
          var re = /./;
          re.exec = function () {
            var result = [];
            result.groups = {
              a: '7'
            };
            return result;
          };
          return ''.replace(re, '$<a>') !== '7';
        });

        var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
          // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
          var re = /(?:)/;
          var originalExec = re.exec;
          re.exec = function () {
            return originalExec.apply(this, arguments);
          };
          var result = 'ab'.split(re);
          return result.length === 2 && result[0] === 'a' && result[1] === 'b';
        })();

        module.exports = function (KEY, length, exec) {
          var SYMBOL = wks(KEY);

          var DELEGATES_TO_SYMBOL = !fails(function () {
            // String methods call symbol-named RegEp methods
            var O = {};
            O[SYMBOL] = function () {
              return 7;
            };
            return '' [KEY](O) != 7;
          });

          var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
            // Symbol-named RegExp methods call .exec
            var execCalled = false;
            var re = /a/;
            re.exec = function () {
              execCalled = true;
              return null;
            };
            if (KEY === 'split') {
              // RegExp[@@split] doesn't call the regex's exec method, but first creates
              // a new one. We need to return the patched regex when creating the new one.
              re.constructor = {};
              re.constructor[SPECIES] = function () {
                return re;
              };
            }
            re[SYMBOL]('');
            return !execCalled;
          }) : undefined;

          if (
            !DELEGATES_TO_SYMBOL ||
            !DELEGATES_TO_EXEC ||
            (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
            (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
          ) {
            var nativeRegExpMethod = /./ [SYMBOL];
            var fns = exec(
              defined,
              SYMBOL,
              '' [KEY],
              function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
                if (regexp.exec === regexpExec) {
                  if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                    // The native String method already delegates to @@method (this
                    // polyfilled function), leasing to infinite recursion.
                    // We avoid it by directly calling the native @@method method.
                    return {
                      done: true,
                      value: nativeRegExpMethod.call(regexp, str, arg2)
                    };
                  }
                  return {
                    done: true,
                    value: nativeMethod.call(str, regexp, arg2)
                  };
                }
                return {
                  done: false
                };
              }
            );
            var strfn = fns[0];
            var rxfn = fns[1];

            redefine(String.prototype, KEY, strfn);
            hide(RegExp.prototype, SYMBOL, length == 2
              // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
              // 21.2.5.11 RegExp.prototype[@@split](string, limit)
              ?
              function (string, arg) {
                return rxfn.call(string, this, arg);
              }
              // 21.2.5.6 RegExp.prototype[@@match](string)
              // 21.2.5.9 RegExp.prototype[@@search](string)
              :
              function (string) {
                return rxfn.call(string, this);
              }
            );
          }
        };


        /***/
      }),

    /***/
    "230e":
      /***/
      (function (module, exports, __webpack_require__) {

        var isObject = __webpack_require__("d3f4");
        var document = __webpack_require__("7726").document;
        // typeof document.createElement is 'object' in old IE
        var is = isObject(document) && isObject(document.createElement);
        module.exports = function (it) {
          return is ? document.createElement(it) : {};
        };


        /***/
      }),

    /***/
    "2312":
      /***/
      (function (module, exports, __webpack_require__) {

        module.exports = __webpack_require__("8ce0");


        /***/
      }),

    /***/
    "23c6":
      /***/
      (function (module, exports, __webpack_require__) {

        // getting tag from 19.1.3.6 Object.prototype.toString()
        var cof = __webpack_require__("2d95");
        var TAG = __webpack_require__("2b4c")('toStringTag');
        // ES3 wrong here
        var ARG = cof(function () {
          return arguments;
        }()) == 'Arguments';

        // fallback for IE11 Script Access Denied error
        var tryGet = function (it, key) {
          try {
            return it[key];
          } catch (e) {
            /* empty */
          }
        };

        module.exports = function (it) {
          var O, T, B;
          return it === undefined ? 'Undefined' : it === null ? 'Null'
            // @@toStringTag case
            :
            typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
            // builtinTag case
            :
            ARG ? cof(O)
            // ES3 arguments fallback
            :
            (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
        };


        /***/
      }),

    /***/
    "2418":
      /***/
      (function (module, exports, __webpack_require__) {

        // false -> Array#indexOf
        // true  -> Array#includes
        var toIObject = __webpack_require__("6a9b");
        var toLength = __webpack_require__("a5ab");
        var toAbsoluteIndex = __webpack_require__("1b8f");
        module.exports = function (IS_INCLUDES) {
          return function ($this, el, fromIndex) {
            var O = toIObject($this);
            var length = toLength(O.length);
            var index = toAbsoluteIndex(fromIndex, length);
            var value;
            // Array#includes uses SameValueZero equality algorithm
            // eslint-disable-next-line no-self-compare
            if (IS_INCLUDES && el != el)
              while (length > index) {
                value = O[index++];
                // eslint-disable-next-line no-self-compare
                if (value != value) return true;
                // Array#indexOf ignores holes, Array#includes - not
              } else
                for (; length > index; index++)
                  if (IS_INCLUDES || index in O) {
                    if (O[index] === el) return IS_INCLUDES || index || 0;
                  } return !IS_INCLUDES && -1;
          };
        };


        /***/
      }),

    /***/
    "245b":
      /***/
      (function (module, exports) {

        module.exports = function (done, value) {
          return {
            value: value,
            done: !!done
          };
        };


        /***/
      }),

    /***/
    "2621":
      /***/
      (function (module, exports) {

        exports.f = Object.getOwnPropertySymbols;


        /***/
      }),

    /***/
    "2695":
      /***/
      (function (module, exports, __webpack_require__) {

        var has = __webpack_require__("43c8");
        var toIObject = __webpack_require__("6a9b");
        var arrayIndexOf = __webpack_require__("2418")(false);
        var IE_PROTO = __webpack_require__("5d8f")('IE_PROTO');

        module.exports = function (object, names) {
          var O = toIObject(object);
          var i = 0;
          var result = [];
          var key;
          for (key in O)
            if (key != IE_PROTO) has(O, key) && result.push(key);
          // Don't enum bug & hidden keys
          while (names.length > i)
            if (has(O, key = names[i++])) {
              ~arrayIndexOf(result, key) || result.push(key);
            }
          return result;
        };


        /***/
      }),

    /***/
    "27ee":
      /***/
      (function (module, exports, __webpack_require__) {

        var classof = __webpack_require__("23c6");
        var ITERATOR = __webpack_require__("2b4c")('iterator');
        var Iterators = __webpack_require__("84f2");
        module.exports = __webpack_require__("8378").getIteratorMethod = function (it) {
          if (it != undefined) return it[ITERATOR] ||
            it['@@iterator'] ||
            Iterators[classof(it)];
        };


        /***/
      }),

    /***/
    "28a5":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";


        var isRegExp = __webpack_require__("aae3");
        var anObject = __webpack_require__("cb7c");
        var speciesConstructor = __webpack_require__("ebd6");
        var advanceStringIndex = __webpack_require__("0390");
        var toLength = __webpack_require__("9def");
        var callRegExpExec = __webpack_require__("5f1b");
        var regexpExec = __webpack_require__("520a");
        var fails = __webpack_require__("79e5");
        var $min = Math.min;
        var $push = [].push;
        var $SPLIT = 'split';
        var LENGTH = 'length';
        var LAST_INDEX = 'lastIndex';
        var MAX_UINT32 = 0xffffffff;

        // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
        var SUPPORTS_Y = !fails(function () {
          RegExp(MAX_UINT32, 'y');
        });

        // @@split logic
        __webpack_require__("214f")('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
          var internalSplit;
          if (
            'abbc' [$SPLIT](/(b)*/)[1] == 'c' ||
            'test' [$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
            'ab' [$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
            '.' [$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
            '.' [$SPLIT](/()()/)[LENGTH] > 1 ||
            '' [$SPLIT](/.?/)[LENGTH]
          ) {
            // based on es5-shim implementation, need to rework it
            internalSplit = function (separator, limit) {
              var string = String(this);
              if (separator === undefined && limit === 0) return [];
              // If `separator` is not a regex, use native split
              if (!isRegExp(separator)) return $split.call(string, separator, limit);
              var output = [];
              var flags = (separator.ignoreCase ? 'i' : '') +
                (separator.multiline ? 'm' : '') +
                (separator.unicode ? 'u' : '') +
                (separator.sticky ? 'y' : '');
              var lastLastIndex = 0;
              var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
              // Make `global` and avoid `lastIndex` issues by working with a copy
              var separatorCopy = new RegExp(separator.source, flags + 'g');
              var match, lastIndex, lastLength;
              while (match = regexpExec.call(separatorCopy, string)) {
                lastIndex = separatorCopy[LAST_INDEX];
                if (lastIndex > lastLastIndex) {
                  output.push(string.slice(lastLastIndex, match.index));
                  if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
                  lastLength = match[0][LENGTH];
                  lastLastIndex = lastIndex;
                  if (output[LENGTH] >= splitLimit) break;
                }
                if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
              }
              if (lastLastIndex === string[LENGTH]) {
                if (lastLength || !separatorCopy.test('')) output.push('');
              } else output.push(string.slice(lastLastIndex));
              return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
            };
            // Chakra, V8
          } else if ('0' [$SPLIT](undefined, 0)[LENGTH]) {
            internalSplit = function (separator, limit) {
              return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
            };
          } else {
            internalSplit = $split;
          }

          return [
            // `String.prototype.split` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.split
            function split(separator, limit) {
              var O = defined(this);
              var splitter = separator == undefined ? undefined : separator[SPLIT];
              return splitter !== undefined ?
                splitter.call(separator, O, limit) :
                internalSplit.call(String(O), separator, limit);
            },
            // `RegExp.prototype[@@split]` method
            // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
            //
            // NOTE: This cannot be properly polyfilled in engines that don't support
            // the 'y' flag.
            function (regexp, limit) {
              var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
              if (res.done) return res.value;

              var rx = anObject(regexp);
              var S = String(this);
              var C = speciesConstructor(rx, RegExp);

              var unicodeMatching = rx.unicode;
              var flags = (rx.ignoreCase ? 'i' : '') +
                (rx.multiline ? 'm' : '') +
                (rx.unicode ? 'u' : '') +
                (SUPPORTS_Y ? 'y' : 'g');

              // ^(? + rx + ) is needed, in combination with some S slicing, to
              // simulate the 'y' flag.
              var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
              var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
              if (lim === 0) return [];
              if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
              var p = 0;
              var q = 0;
              var A = [];
              while (q < S.length) {
                splitter.lastIndex = SUPPORTS_Y ? q : 0;
                var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
                var e;
                if (
                  z === null ||
                  (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
                ) {
                  q = advanceStringIndex(S, q, unicodeMatching);
                } else {
                  A.push(S.slice(p, q));
                  if (A.length === lim) return A;
                  for (var i = 1; i <= z.length - 1; i++) {
                    A.push(z[i]);
                    if (A.length === lim) return A;
                  }
                  q = p = e;
                }
              }
              A.push(S.slice(p));
              return A;
            }
          ];
        });


        /***/
      }),

    /***/
    "2a4e":
      /***/
      (function (module, exports, __webpack_require__) {

        var toInteger = __webpack_require__("a812");
        var defined = __webpack_require__("e5fa");
        // true  -> String#at
        // false -> String#codePointAt
        module.exports = function (TO_STRING) {
          return function (that, pos) {
            var s = String(defined(that));
            var i = toInteger(pos);
            var l = s.length;
            var a, b;
            if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
            a = s.charCodeAt(i);
            return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ?
              TO_STRING ? s.charAt(i) : a :
              TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
          };
        };


        /***/
      }),

    /***/
    "2aba":
      /***/
      (function (module, exports, __webpack_require__) {

        var global = __webpack_require__("7726");
        var hide = __webpack_require__("32e9");
        var has = __webpack_require__("69a8");
        var SRC = __webpack_require__("ca5a")('src');
        var $toString = __webpack_require__("fa5b");
        var TO_STRING = 'toString';
        var TPL = ('' + $toString).split(TO_STRING);

        __webpack_require__("8378").inspectSource = function (it) {
          return $toString.call(it);
        };

        (module.exports = function (O, key, val, safe) {
          var isFunction = typeof val == 'function';
          if (isFunction) has(val, 'name') || hide(val, 'name', key);
          if (O[key] === val) return;
          if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
          if (O === global) {
            O[key] = val;
          } else if (!safe) {
            delete O[key];
            hide(O, key, val);
          } else if (O[key]) {
            O[key] = val;
          } else {
            hide(O, key, val);
          }
          // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
        })(Function.prototype, TO_STRING, function toString() {
          return typeof this == 'function' && this[SRC] || $toString.call(this);
        });


        /***/
      }),

    /***/
    "2aeb":
      /***/
      (function (module, exports, __webpack_require__) {

        // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
        var anObject = __webpack_require__("cb7c");
        var dPs = __webpack_require__("1495");
        var enumBugKeys = __webpack_require__("e11e");
        var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
        var Empty = function () {
          /* empty */
        };
        var PROTOTYPE = 'prototype';

        // Create object with fake `null` prototype: use iframe Object with cleared prototype
        var createDict = function () {
          // Thrash, waste and sodomy: IE GC bug
          var iframe = __webpack_require__("230e")('iframe');
          var i = enumBugKeys.length;
          var lt = '<';
          var gt = '>';
          var iframeDocument;
          iframe.style.display = 'none';
          __webpack_require__("fab2").appendChild(iframe);
          iframe.src = 'javascript:'; // eslint-disable-line no-script-url
          // createDict = iframe.contentWindow.Object;
          // html.removeChild(iframe);
          iframeDocument = iframe.contentWindow.document;
          iframeDocument.open();
          iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
          iframeDocument.close();
          createDict = iframeDocument.F;
          while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
          return createDict();
        };

        module.exports = Object.create || function create(O, Properties) {
          var result;
          if (O !== null) {
            Empty[PROTOTYPE] = anObject(O);
            result = new Empty();
            Empty[PROTOTYPE] = null;
            // add "__proto__" for Object.getPrototypeOf polyfill
            result[IE_PROTO] = O;
          } else result = createDict();
          return Properties === undefined ? result : dPs(result, Properties);
        };


        /***/
      }),

    /***/
    "2b4c":
      /***/
      (function (module, exports, __webpack_require__) {

        var store = __webpack_require__("5537")('wks');
        var uid = __webpack_require__("ca5a");
        var Symbol = __webpack_require__("7726").Symbol;
        var USE_SYMBOL = typeof Symbol == 'function';

        var $exports = module.exports = function (name) {
          return store[name] || (store[name] =
            USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
        };

        $exports.store = store;


        /***/
      }),

    /***/
    "2d00":
      /***/
      (function (module, exports) {

        module.exports = false;


        /***/
      }),

    /***/
    "2d95":
      /***/
      (function (module, exports) {

        var toString = {}.toString;

        module.exports = function (it) {
          return toString.call(it).slice(8, -1);
        };


        /***/
      }),

    /***/
    "2ea1":
      /***/
      (function (module, exports, __webpack_require__) {

        // 7.1.1 ToPrimitive(input [, PreferredType])
        var isObject = __webpack_require__("6f8a");
        // instead of the ES6 spec version, we didn't implement @@toPrimitive case
        // and the second argument - flag - preferred type is a string
        module.exports = function (it, S) {
          if (!isObject(it)) return it;
          var fn, val;
          if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
          if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
          if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
          throw TypeError("Can't convert object to primitive value");
        };


        /***/
      }),

    /***/
    "2fdb":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";
        // 21.1.3.7 String.prototype.includes(searchString, position = 0)

        var $export = __webpack_require__("5ca1");
        var context = __webpack_require__("d2c8");
        var INCLUDES = 'includes';

        $export($export.P + $export.F * __webpack_require__("5147")(INCLUDES), 'String', {
          includes: function includes(searchString /* , position = 0 */ ) {
            return !!~context(this, searchString, INCLUDES)
              .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
          }
        });


        /***/
      }),

    /***/
    "308d":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";

        // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/typeof.js
        var esm_typeof = __webpack_require__("7618");

        // CONCATENATED MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/assertThisInitialized.js
        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return self;
        }
        // CONCATENATED MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/possibleConstructorReturn.js
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function () {
          return _possibleConstructorReturn;
        });


        function _possibleConstructorReturn(self, call) {
          if (call && (Object(esm_typeof["a" /* default */ ])(call) === "object" || typeof call === "function")) {
            return call;
          }

          return _assertThisInitialized(self);
        }

        /***/
      }),

    /***/
    "31c2":
      /***/
      (function (module, exports) {

        exports.f = Object.getOwnPropertySymbols;


        /***/
      }),

    /***/
    "31f4":
      /***/
      (function (module, exports) {

        // fast apply, http://jsperf.lnkit.com/fast-apply/5
        module.exports = function (fn, args, that) {
          var un = that === undefined;
          switch (args.length) {
            case 0:
              return un ? fn() :
                fn.call(that);
            case 1:
              return un ? fn(args[0]) :
                fn.call(that, args[0]);
            case 2:
              return un ? fn(args[0], args[1]) :
                fn.call(that, args[0], args[1]);
            case 3:
              return un ? fn(args[0], args[1], args[2]) :
                fn.call(that, args[0], args[1], args[2]);
            case 4:
              return un ? fn(args[0], args[1], args[2], args[3]) :
                fn.call(that, args[0], args[1], args[2], args[3]);
          }
          return fn.apply(that, args);
        };


        /***/
      }),

    /***/
    "32e9":
      /***/
      (function (module, exports, __webpack_require__) {

        var dP = __webpack_require__("86cc");
        var createDesc = __webpack_require__("4630");
        module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
          return dP.f(object, key, createDesc(1, value));
        } : function (object, key, value) {
          object[key] = value;
          return object;
        };


        /***/
      }),

    /***/
    "33a4":
      /***/
      (function (module, exports, __webpack_require__) {

        // check on default Array iterator
        var Iterators = __webpack_require__("84f2");
        var ITERATOR = __webpack_require__("2b4c")('iterator');
        var ArrayProto = Array.prototype;

        module.exports = function (it) {
          return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
        };


        /***/
      }),

    /***/
    "3846":
      /***/
      (function (module, exports, __webpack_require__) {

        // 21.2.5.3 get RegExp.prototype.flags()
        if (__webpack_require__("9e1e") && /./g.flags != 'g') __webpack_require__("86cc").f(RegExp.prototype, 'flags', {
          configurable: true,
          get: __webpack_require__("0bfb")
        });


        /***/
      }),

    /***/
    "386d":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";


        var anObject = __webpack_require__("cb7c");
        var sameValue = __webpack_require__("83a1");
        var regExpExec = __webpack_require__("5f1b");

        // @@search logic
        __webpack_require__("214f")('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
          return [
            // `String.prototype.search` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.search
            function search(regexp) {
              var O = defined(this);
              var fn = regexp == undefined ? undefined : regexp[SEARCH];
              return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
            },
            // `RegExp.prototype[@@search]` method
            // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
            function (regexp) {
              var res = maybeCallNative($search, regexp, this);
              if (res.done) return res.value;
              var rx = anObject(regexp);
              var S = String(this);
              var previousLastIndex = rx.lastIndex;
              if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
              var result = regExpExec(rx, S);
              if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
              return result === null ? -1 : result.index;
            }
          ];
        });


        /***/
      }),

    /***/
    "38fd":
      /***/
      (function (module, exports, __webpack_require__) {

        // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
        var has = __webpack_require__("69a8");
        var toObject = __webpack_require__("4bf8");
        var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
        var ObjectProto = Object.prototype;

        module.exports = Object.getPrototypeOf || function (O) {
          O = toObject(O);
          if (has(O, IE_PROTO)) return O[IE_PROTO];
          if (typeof O.constructor == 'function' && O instanceof O.constructor) {
            return O.constructor.prototype;
          }
          return O instanceof Object ? ObjectProto : null;
        };


        /***/
      }),

    /***/
    "3adc":
      /***/
      (function (module, exports, __webpack_require__) {

        var anObject = __webpack_require__("0f89");
        var IE8_DOM_DEFINE = __webpack_require__("a47f");
        var toPrimitive = __webpack_require__("2ea1");
        var dP = Object.defineProperty;

        exports.f = __webpack_require__("7d95") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
          anObject(O);
          P = toPrimitive(P, true);
          anObject(Attributes);
          if (IE8_DOM_DEFINE) try {
            return dP(O, P, Attributes);
          } catch (e) {
            /* empty */
          }
          if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
          if ('value' in Attributes) O[P] = Attributes.value;
          return O;
        };


        /***/
      }),

    /***/
    "3b2b":
      /***/
      (function (module, exports, __webpack_require__) {

        var global = __webpack_require__("7726");
        var inheritIfRequired = __webpack_require__("5dbc");
        var dP = __webpack_require__("86cc").f;
        var gOPN = __webpack_require__("9093").f;
        var isRegExp = __webpack_require__("aae3");
        var $flags = __webpack_require__("0bfb");
        var $RegExp = global.RegExp;
        var Base = $RegExp;
        var proto = $RegExp.prototype;
        var re1 = /a/g;
        var re2 = /a/g;
        // "new" creates a new object, old webkit buggy here
        var CORRECT_NEW = new $RegExp(re1) !== re1;

        if (__webpack_require__("9e1e") && (!CORRECT_NEW || __webpack_require__("79e5")(function () {
            re2[__webpack_require__("2b4c")('match')] = false;
            // RegExp constructor can alter flags and IsRegExp works correct with @@match
            return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
          }))) {
          $RegExp = function RegExp(p, f) {
            var tiRE = this instanceof $RegExp;
            var piRE = isRegExp(p);
            var fiU = f === undefined;
            return !tiRE && piRE && p.constructor === $RegExp && fiU ? p :
              inheritIfRequired(CORRECT_NEW ?
                new Base(piRE && !fiU ? p.source : p, f) :
                Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f), tiRE ? this : proto, $RegExp);
          };
          var proxy = function (key) {
            key in $RegExp || dP($RegExp, key, {
              configurable: true,
              get: function () {
                return Base[key];
              },
              set: function (it) {
                Base[key] = it;
              }
            });
          };
          for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
          proto.constructor = $RegExp;
          $RegExp.prototype = proto;
          __webpack_require__("2aba")(global, 'RegExp', $RegExp);
        }

        __webpack_require__("7a56")('RegExp');


        /***/
      }),

    /***/
    "41a0":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var create = __webpack_require__("2aeb");
        var descriptor = __webpack_require__("4630");
        var setToStringTag = __webpack_require__("7f20");
        var IteratorPrototype = {};

        // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
        __webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () {
          return this;
        });

        module.exports = function (Constructor, NAME, next) {
          Constructor.prototype = create(IteratorPrototype, {
            next: descriptor(1, next)
          });
          setToStringTag(Constructor, NAME + ' Iterator');
        };


        /***/
      }),

    /***/
    "43c8":
      /***/
      (function (module, exports) {

        var hasOwnProperty = {}.hasOwnProperty;
        module.exports = function (it, key) {
          return hasOwnProperty.call(it, key);
        };


        /***/
      }),

    /***/
    "4588":
      /***/
      (function (module, exports) {

        // 7.1.4 ToInteger
        var ceil = Math.ceil;
        var floor = Math.floor;
        module.exports = function (it) {
          return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
        };


        /***/
      }),

    /***/
    "4630":
      /***/
      (function (module, exports) {

        module.exports = function (bitmap, value) {
          return {
            enumerable: !(bitmap & 1),
            configurable: !(bitmap & 2),
            writable: !(bitmap & 4),
            value: value
          };
        };


        /***/
      }),

    /***/
    "4917":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";


        var anObject = __webpack_require__("cb7c");
        var toLength = __webpack_require__("9def");
        var advanceStringIndex = __webpack_require__("0390");
        var regExpExec = __webpack_require__("5f1b");

        // @@match logic
        __webpack_require__("214f")('match', 1, function (defined, MATCH, $match, maybeCallNative) {
          return [
            // `String.prototype.match` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.match
            function match(regexp) {
              var O = defined(this);
              var fn = regexp == undefined ? undefined : regexp[MATCH];
              return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
            },
            // `RegExp.prototype[@@match]` method
            // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
            function (regexp) {
              var res = maybeCallNative($match, regexp, this);
              if (res.done) return res.value;
              var rx = anObject(regexp);
              var S = String(this);
              if (!rx.global) return regExpExec(rx, S);
              var fullUnicode = rx.unicode;
              rx.lastIndex = 0;
              var A = [];
              var n = 0;
              var result;
              while ((result = regExpExec(rx, S)) !== null) {
                var matchStr = String(result[0]);
                A[n] = matchStr;
                if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                n++;
              }
              return n === 0 ? null : A;
            }
          ];
        });


        /***/
      }),

    /***/
    "4a59":
      /***/
      (function (module, exports, __webpack_require__) {

        var ctx = __webpack_require__("9b43");
        var call = __webpack_require__("1fa8");
        var isArrayIter = __webpack_require__("33a4");
        var anObject = __webpack_require__("cb7c");
        var toLength = __webpack_require__("9def");
        var getIterFn = __webpack_require__("27ee");
        var BREAK = {};
        var RETURN = {};
        var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
          var iterFn = ITERATOR ? function () {
            return iterable;
          } : getIterFn(iterable);
          var f = ctx(fn, that, entries ? 2 : 1);
          var index = 0;
          var length, step, iterator, result;
          if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
          // fast case for arrays with default iterator
          if (isArrayIter(iterFn))
            for (length = toLength(iterable.length); length > index; index++) {
              result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
              if (result === BREAK || result === RETURN) return result;
            } else
              for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
                result = call(iterator, f, step.value, entries);
                if (result === BREAK || result === RETURN) return result;
              }
        };
        exports.BREAK = BREAK;
        exports.RETURN = RETURN;


        /***/
      }),

    /***/
    "4aa6":
      /***/
      (function (module, exports, __webpack_require__) {

        module.exports = __webpack_require__("af7e");

        /***/
      }),

    /***/
    "4bf8":
      /***/
      (function (module, exports, __webpack_require__) {

        // 7.1.13 ToObject(argument)
        var defined = __webpack_require__("be13");
        module.exports = function (it) {
          return Object(defined(it));
        };


        /***/
      }),

    /***/
    "4d16":
      /***/
      (function (module, exports, __webpack_require__) {

        module.exports = __webpack_require__("a438");

        /***/
      }),

    /***/
    "4e2b":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";

        // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/create.js
        var create = __webpack_require__("4aa6");
        var create_default = /*#__PURE__*/ __webpack_require__.n(create);

        // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/set-prototype-of.js
        var set_prototype_of = __webpack_require__("4d16");
        var set_prototype_of_default = /*#__PURE__*/ __webpack_require__.n(set_prototype_of);

        // CONCATENATED MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/setPrototypeOf.js

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = set_prototype_of_default.a || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };

          return _setPrototypeOf(o, p);
        }
        // CONCATENATED MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/inherits.js
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function () {
          return _inherits;
        });


        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
          }

          subClass.prototype = create_default()(superClass && superClass.prototype, {
            constructor: {
              value: subClass,
              writable: true,
              configurable: true
            }
          });
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        /***/
      }),

    /***/
    "50e9":
      /***/
      (function (module, exports, __webpack_require__) {

        var $export = __webpack_require__("d13f");
        // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
        $export($export.S, 'Object', {
          create: __webpack_require__("7108")
        });


        /***/
      }),

    /***/
    "5147":
      /***/
      (function (module, exports, __webpack_require__) {

        var MATCH = __webpack_require__("2b4c")('match');
        module.exports = function (KEY) {
          var re = /./;
          try {
            '/./' [KEY](re);
          } catch (e) {
            try {
              re[MATCH] = false;
              return !'/./' [KEY](re);
            } catch (f) {
              /* empty */
            }
          }
          return true;
        };


        /***/
      }),

    /***/
    "520a":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";


        var regexpFlags = __webpack_require__("0bfb");

        var nativeExec = RegExp.prototype.exec;
        // This always refers to the native implementation, because the
        // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
        // which loads this file before patching the method.
        var nativeReplace = String.prototype.replace;

        var patchedExec = nativeExec;

        var LAST_INDEX = 'lastIndex';

        var UPDATES_LAST_INDEX_WRONG = (function () {
          var re1 = /a/,
            re2 = /b*/g;
          nativeExec.call(re1, 'a');
          nativeExec.call(re2, 'a');
          return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
        })();

        // nonparticipating capturing group, copied from es5-shim's String#split patch.
        var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

        var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

        if (PATCH) {
          patchedExec = function exec(str) {
            var re = this;
            var lastIndex, reCopy, match, i;

            if (NPCG_INCLUDED) {
              reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
            }
            if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

            match = nativeExec.call(re, str);

            if (UPDATES_LAST_INDEX_WRONG && match) {
              re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
            }
            if (NPCG_INCLUDED && match && match.length > 1) {
              // Fix browsers whose `exec` methods don't consistently return `undefined`
              // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
              // eslint-disable-next-line no-loop-func
              nativeReplace.call(match[0], reCopy, function () {
                for (i = 1; i < arguments.length - 2; i++) {
                  if (arguments[i] === undefined) match[i] = undefined;
                }
              });
            }

            return match;
          };
        }

        module.exports = patchedExec;


        /***/
      }),

    /***/
    "52a7":
      /***/
      (function (module, exports) {

        exports.f = {}.propertyIsEnumerable;


        /***/
      }),

    /***/
    "551c":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var LIBRARY = __webpack_require__("2d00");
        var global = __webpack_require__("7726");
        var ctx = __webpack_require__("9b43");
        var classof = __webpack_require__("23c6");
        var $export = __webpack_require__("5ca1");
        var isObject = __webpack_require__("d3f4");
        var aFunction = __webpack_require__("d8e8");
        var anInstance = __webpack_require__("f605");
        var forOf = __webpack_require__("4a59");
        var speciesConstructor = __webpack_require__("ebd6");
        var task = __webpack_require__("1991").set;
        var microtask = __webpack_require__("8079")();
        var newPromiseCapabilityModule = __webpack_require__("a5b8");
        var perform = __webpack_require__("9c80");
        var userAgent = __webpack_require__("a25f");
        var promiseResolve = __webpack_require__("bcaa");
        var PROMISE = 'Promise';
        var TypeError = global.TypeError;
        var process = global.process;
        var versions = process && process.versions;
        var v8 = versions && versions.v8 || '';
        var $Promise = global[PROMISE];
        var isNode = classof(process) == 'process';
        var empty = function () {
          /* empty */
        };
        var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
        var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

        var USE_NATIVE = !! function () {
          try {
            // correct subclassing with @@species support
            var promise = $Promise.resolve(1);
            var FakePromise = (promise.constructor = {})[__webpack_require__("2b4c")('species')] = function (exec) {
              exec(empty, empty);
            };
            // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
            return (isNode || typeof PromiseRejectionEvent == 'function') &&
              promise.then(empty) instanceof FakePromise
              // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
              // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
              // we can't detect it synchronously, so just check versions
              &&
              v8.indexOf('6.6') !== 0 &&
              userAgent.indexOf('Chrome/66') === -1;
          } catch (e) {
            /* empty */
          }
        }();

        // helpers
        var isThenable = function (it) {
          var then;
          return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
        };
        var notify = function (promise, isReject) {
          if (promise._n) return;
          promise._n = true;
          var chain = promise._c;
          microtask(function () {
            var value = promise._v;
            var ok = promise._s == 1;
            var i = 0;
            var run = function (reaction) {
              var handler = ok ? reaction.ok : reaction.fail;
              var resolve = reaction.resolve;
              var reject = reaction.reject;
              var domain = reaction.domain;
              var result, then, exited;
              try {
                if (handler) {
                  if (!ok) {
                    if (promise._h == 2) onHandleUnhandled(promise);
                    promise._h = 1;
                  }
                  if (handler === true) result = value;
                  else {
                    if (domain) domain.enter();
                    result = handler(value); // may throw
                    if (domain) {
                      domain.exit();
                      exited = true;
                    }
                  }
                  if (result === reaction.promise) {
                    reject(TypeError('Promise-chain cycle'));
                  } else if (then = isThenable(result)) {
                    then.call(result, resolve, reject);
                  } else resolve(result);
                } else reject(value);
              } catch (e) {
                if (domain && !exited) domain.exit();
                reject(e);
              }
            };
            while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
            promise._c = [];
            promise._n = false;
            if (isReject && !promise._h) onUnhandled(promise);
          });
        };
        var onUnhandled = function (promise) {
          task.call(global, function () {
            var value = promise._v;
            var unhandled = isUnhandled(promise);
            var result, handler, console;
            if (unhandled) {
              result = perform(function () {
                if (isNode) {
                  process.emit('unhandledRejection', value, promise);
                } else if (handler = global.onunhandledrejection) {
                  handler({
                    promise: promise,
                    reason: value
                  });
                } else if ((console = global.console) && console.error) {
                  console.error('Unhandled promise rejection', value);
                }
              });
              // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
              promise._h = isNode || isUnhandled(promise) ? 2 : 1;
            }
            promise._a = undefined;
            if (unhandled && result.e) throw result.v;
          });
        };
        var isUnhandled = function (promise) {
          return promise._h !== 1 && (promise._a || promise._c).length === 0;
        };
        var onHandleUnhandled = function (promise) {
          task.call(global, function () {
            var handler;
            if (isNode) {
              process.emit('rejectionHandled', promise);
            } else if (handler = global.onrejectionhandled) {
              handler({
                promise: promise,
                reason: promise._v
              });
            }
          });
        };
        var $reject = function (value) {
          var promise = this;
          if (promise._d) return;
          promise._d = true;
          promise = promise._w || promise; // unwrap
          promise._v = value;
          promise._s = 2;
          if (!promise._a) promise._a = promise._c.slice();
          notify(promise, true);
        };
        var $resolve = function (value) {
          var promise = this;
          var then;
          if (promise._d) return;
          promise._d = true;
          promise = promise._w || promise; // unwrap
          try {
            if (promise === value) throw TypeError("Promise can't be resolved itself");
            if (then = isThenable(value)) {
              microtask(function () {
                var wrapper = {
                  _w: promise,
                  _d: false
                }; // wrap
                try {
                  then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
                } catch (e) {
                  $reject.call(wrapper, e);
                }
              });
            } else {
              promise._v = value;
              promise._s = 1;
              notify(promise, false);
            }
          } catch (e) {
            $reject.call({
              _w: promise,
              _d: false
            }, e); // wrap
          }
        };

        // constructor polyfill
        if (!USE_NATIVE) {
          // 25.4.3.1 Promise(executor)
          $Promise = function Promise(executor) {
            anInstance(this, $Promise, PROMISE, '_h');
            aFunction(executor);
            Internal.call(this);
            try {
              executor(ctx($resolve, this, 1), ctx($reject, this, 1));
            } catch (err) {
              $reject.call(this, err);
            }
          };
          // eslint-disable-next-line no-unused-vars
          Internal = function Promise(executor) {
            this._c = []; // <- awaiting reactions
            this._a = undefined; // <- checked in isUnhandled reactions
            this._s = 0; // <- state
            this._d = false; // <- done
            this._v = undefined; // <- value
            this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
            this._n = false; // <- notify
          };
          Internal.prototype = __webpack_require__("dcbc")($Promise.prototype, {
            // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
            then: function then(onFulfilled, onRejected) {
              var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
              reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
              reaction.fail = typeof onRejected == 'function' && onRejected;
              reaction.domain = isNode ? process.domain : undefined;
              this._c.push(reaction);
              if (this._a) this._a.push(reaction);
              if (this._s) notify(this, false);
              return reaction.promise;
            },
            // 25.4.5.1 Promise.prototype.catch(onRejected)
            'catch': function (onRejected) {
              return this.then(undefined, onRejected);
            }
          });
          OwnPromiseCapability = function () {
            var promise = new Internal();
            this.promise = promise;
            this.resolve = ctx($resolve, promise, 1);
            this.reject = ctx($reject, promise, 1);
          };
          newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
            return C === $Promise || C === Wrapper ?
              new OwnPromiseCapability(C) :
              newGenericPromiseCapability(C);
          };
        }

        $export($export.G + $export.W + $export.F * !USE_NATIVE, {
          Promise: $Promise
        });
        __webpack_require__("7f20")($Promise, PROMISE);
        __webpack_require__("7a56")(PROMISE);
        Wrapper = __webpack_require__("8378")[PROMISE];

        // statics
        $export($export.S + $export.F * !USE_NATIVE, PROMISE, {
          // 25.4.4.5 Promise.reject(r)
          reject: function reject(r) {
            var capability = newPromiseCapability(this);
            var $$reject = capability.reject;
            $$reject(r);
            return capability.promise;
          }
        });
        $export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
          // 25.4.4.6 Promise.resolve(x)
          resolve: function resolve(x) {
            return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
          }
        });
        $export($export.S + $export.F * !(USE_NATIVE && __webpack_require__("5cc5")(function (iter) {
          $Promise.all(iter)['catch'](empty);
        })), PROMISE, {
          // 25.4.4.1 Promise.all(iterable)
          all: function all(iterable) {
            var C = this;
            var capability = newPromiseCapability(C);
            var resolve = capability.resolve;
            var reject = capability.reject;
            var result = perform(function () {
              var values = [];
              var index = 0;
              var remaining = 1;
              forOf(iterable, false, function (promise) {
                var $index = index++;
                var alreadyCalled = false;
                values.push(undefined);
                remaining++;
                C.resolve(promise).then(function (value) {
                  if (alreadyCalled) return;
                  alreadyCalled = true;
                  values[$index] = value;
                  --remaining || resolve(values);
                }, reject);
              });
              --remaining || resolve(values);
            });
            if (result.e) reject(result.v);
            return capability.promise;
          },
          // 25.4.4.4 Promise.race(iterable)
          race: function race(iterable) {
            var C = this;
            var capability = newPromiseCapability(C);
            var reject = capability.reject;
            var result = perform(function () {
              forOf(iterable, false, function (promise) {
                C.resolve(promise).then(capability.resolve, reject);
              });
            });
            if (result.e) reject(result.v);
            return capability.promise;
          }
        });


        /***/
      }),

    /***/
    "5537":
      /***/
      (function (module, exports, __webpack_require__) {

        var core = __webpack_require__("8378");
        var global = __webpack_require__("7726");
        var SHARED = '__core-js_shared__';
        var store = global[SHARED] || (global[SHARED] = {});

        (module.exports = function (key, value) {
          return store[key] || (store[key] = value !== undefined ? value : {});
        })('versions', []).push({
          version: core.version,
          mode: __webpack_require__("2d00") ? 'pure' : 'global',
          copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
        });


        /***/
      }),

    /***/
    "5547":
      /***/
      (function (module, exports) {

        module.exports = __WEBPACK_EXTERNAL_MODULE__5547__;

        /***/
      }),

    /***/
    "565d":
      /***/
      (function (module, exports, __webpack_require__) {

        // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
        var toIObject = __webpack_require__("6a9b");
        var gOPN = __webpack_require__("d876").f;
        var toString = {}.toString;

        var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames ?
          Object.getOwnPropertyNames(window) : [];

        var getWindowNames = function (it) {
          try {
            return gOPN(it);
          } catch (e) {
            return windowNames.slice();
          }
        };

        module.exports.f = function getOwnPropertyNames(it) {
          return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
        };


        /***/
      }),

    /***/
    "5710":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */
        var _tunnel_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6c67");
        window.psPlugin = window.psPlugin || {};

        var DEV_INNER_MODULE_NAME = 'com.gwi.device';
        /**
         * 插件接口类
         * @module psPlugin.device
         */

        window.psPlugin.device = {
          /**
           * exec异步接口
           * @param devName 逻辑名
           * @param actionName 命令
           * @param param 参数
           * @param timeout 超时
           * @param succ 成功回调方法
           * @param error 失败回调方法
           **/
          exec: function exec(devName, actionName, param, timeout, succ, error) {
            _tunnel_proxy__WEBPACK_IMPORTED_MODULE_0__[ /* tunnelAsync */ "b"].exec(succ, error, DEV_INNER_MODULE_NAME, "exec", [devName, actionName, param || {}, timeout]);
          },

          /**
           *getInfo同步接口
           * @param devName 逻辑名
           * @param actionName 命令
           * @param param 参数
           * @param timeout 超时
           **/
          getInfo: function getInfo(devName, actionName, param, timeout) {
            return Object(_tunnel_proxy__WEBPACK_IMPORTED_MODULE_0__[ /* tunnelSync */ "c"])(DEV_INNER_MODULE_NAME, 'getInfo', devName, actionName, param, timeout || 0);
          },

          /**
           * getInfo异步接口
           * @param devName 逻辑名
           * @param actionName 命令
           * @param param 参数
           * @param timeout 超时
           * @param succ 成功回调方法
           * @param error 失败回调方法
           **/
          getInfoAsync: function getInfoAsync(devName, actionName, param, timeout, succ, error) {
            return _tunnel_proxy__WEBPACK_IMPORTED_MODULE_0__[ /* tunnelAsync */ "b"].exec(succ, error, DEV_INNER_MODULE_NAME, "getInfo", [devName, actionName, param || {}, timeout]);
          },

          /**
           *获取属性同步接口
           * @param devName 逻辑名
           * @param priorityName 属性名
           **/
          getPriority: function getPriority(devName, priorityName) {
            return Object(_tunnel_proxy__WEBPACK_IMPORTED_MODULE_0__[ /* tunnelSync */ "c"])(DEV_INNER_MODULE_NAME, 'getPriority', devName, priorityName);
          },

          /**
           * 获取属性异步接口
           * @param devName 逻辑名
           * @param priorityName 属性名
           * @param param 参数
           * @param timeout 超时
           * @param succ 成功回调方法
           * @param error 失败回调方法
           **/
          getPriorityAsync: function getPriorityAsync(devName, priorityName, param, timeout, succ, error) {
            return _tunnel_proxy__WEBPACK_IMPORTED_MODULE_0__[ /* tunnelAsync */ "b"].exec(succ, error, DEV_INNER_MODULE_NAME, "getPriority", [devName, priorityName, param || {}, timeout]);
          },

          /**
           *设置属性同步接口
           * @param devName 逻辑名
           * @param priorityName 属性名
           * @param priorityValue 属性值
           **/
          setPriority: function setPriority(devName, priorityName, priorityValue) {
            return Object(_tunnel_proxy__WEBPACK_IMPORTED_MODULE_0__[ /* tunnelSync */ "c"])(DEV_INNER_MODULE_NAME, 'setPriority', devName, priorityName, priorityValue || '');
          },

          /**
           * 设置属性异步接口
           * @param devName 逻辑名
           * @param priorityName 属性名
           * @param priorityValue 属性值
           * @param timeout 超时
           * @param succ 成功回调方法
           * @param error 失败回调方法
           **/
          setPriorityAsync: function setPriorityAsync(devName, priorityName, priorityValue, timeout, succ, error) {
            return _tunnel_proxy__WEBPACK_IMPORTED_MODULE_0__[ /* tunnelAsync */ "b"].exec(succ, error, DEV_INNER_MODULE_NAME, "setPriority", [devName, priorityName, priorityValue || '', timeout]);
          }
        };
        /* harmony default export */
        __webpack_exports__["a"] = (window.psPlugin.device);

        /***/
      }),

    /***/
    "5927":
      /***/
      (function (module, exports, __webpack_require__) {

        __webpack_require__("93c4");
        __webpack_require__("b42c");
        module.exports = __webpack_require__("fda1").f('iterator');


        /***/
      }),

    /***/
    "5ca1":
      /***/
      (function (module, exports, __webpack_require__) {

        var global = __webpack_require__("7726");
        var core = __webpack_require__("8378");
        var hide = __webpack_require__("32e9");
        var redefine = __webpack_require__("2aba");
        var ctx = __webpack_require__("9b43");
        var PROTOTYPE = 'prototype';

        var $export = function (type, name, source) {
          var IS_FORCED = type & $export.F;
          var IS_GLOBAL = type & $export.G;
          var IS_STATIC = type & $export.S;
          var IS_PROTO = type & $export.P;
          var IS_BIND = type & $export.B;
          var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
          var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
          var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
          var key, own, out, exp;
          if (IS_GLOBAL) source = name;
          for (key in source) {
            // contains in native
            own = !IS_FORCED && target && target[key] !== undefined;
            // export native or passed
            out = (own ? target : source)[key];
            // bind timers to global for call from export context
            exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
            // extend global
            if (target) redefine(target, key, out, type & $export.U);
            // export
            if (exports[key] != out) hide(exports, key, exp);
            if (IS_PROTO && expProto[key] != out) expProto[key] = out;
          }
        };
        global.core = core;
        // type bitmap
        $export.F = 1; // forced
        $export.G = 2; // global
        $export.S = 4; // static
        $export.P = 8; // proto
        $export.B = 16; // bind
        $export.W = 32; // wrap
        $export.U = 64; // safe
        $export.R = 128; // real proto method for `library`
        module.exports = $export;


        /***/
      }),

    /***/
    "5cc5":
      /***/
      (function (module, exports, __webpack_require__) {

        var ITERATOR = __webpack_require__("2b4c")('iterator');
        var SAFE_CLOSING = false;

        try {
          var riter = [7][ITERATOR]();
          riter['return'] = function () {
            SAFE_CLOSING = true;
          };
          // eslint-disable-next-line no-throw-literal
          Array.from(riter, function () {
            throw 2;
          });
        } catch (e) {
          /* empty */
        }

        module.exports = function (exec, skipClosing) {
          if (!skipClosing && !SAFE_CLOSING) return false;
          var safe = false;
          try {
            var arr = [7];
            var iter = arr[ITERATOR]();
            iter.next = function () {
              return {
                done: safe = true
              };
            };
            arr[ITERATOR] = function () {
              return iter;
            };
            exec(arr);
          } catch (e) {
            /* empty */
          }
          return safe;
        };


        /***/
      }),

    /***/
    "5ce7":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var create = __webpack_require__("7108");
        var descriptor = __webpack_require__("f845");
        var setToStringTag = __webpack_require__("c0d8");
        var IteratorPrototype = {};

        // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
        __webpack_require__("8ce0")(IteratorPrototype, __webpack_require__("1b55")('iterator'), function () {
          return this;
        });

        module.exports = function (Constructor, NAME, next) {
          Constructor.prototype = create(IteratorPrototype, {
            next: descriptor(1, next)
          });
          setToStringTag(Constructor, NAME + ' Iterator');
        };


        /***/
      }),

    /***/
    "5d58":
      /***/
      (function (module, exports, __webpack_require__) {

        module.exports = __webpack_require__("5927");

        /***/
      }),

    /***/
    "5d8f":
      /***/
      (function (module, exports, __webpack_require__) {

        var shared = __webpack_require__("7772")('keys');
        var uid = __webpack_require__("7b00");
        module.exports = function (key) {
          return shared[key] || (shared[key] = uid(key));
        };


        /***/
      }),

    /***/
    "5dbc":
      /***/
      (function (module, exports, __webpack_require__) {

        var isObject = __webpack_require__("d3f4");
        var setPrototypeOf = __webpack_require__("8b97").set;
        module.exports = function (that, target, C) {
          var S = target.constructor;
          var P;
          if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
            setPrototypeOf(that, P);
          }
          return that;
        };


        /***/
      }),

    /***/
    "5f1b":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";


        var classof = __webpack_require__("23c6");
        var builtinExec = RegExp.prototype.exec;

        // `RegExpExec` abstract operation
        // https://tc39.github.io/ecma262/#sec-regexpexec
        module.exports = function (R, S) {
          var exec = R.exec;
          if (typeof exec === 'function') {
            var result = exec.call(R, S);
            if (typeof result !== 'object') {
              throw new TypeError('RegExp exec method returned something other than an Object or null');
            }
            return result;
          }
          if (classof(R) !== 'RegExp') {
            throw new TypeError('RegExp#exec called on incompatible receiver');
          }
          return builtinExec.call(R, S);
        };


        /***/
      }),

    /***/
    "60bb":
      /***/
      (function (module, exports) {

        module.exports = __WEBPACK_EXTERNAL_MODULE__60bb__;

        /***/
      }),

    /***/
    "613b":
      /***/
      (function (module, exports, __webpack_require__) {

        var shared = __webpack_require__("5537")('keys');
        var uid = __webpack_require__("ca5a");
        module.exports = function (key) {
          return shared[key] || (shared[key] = uid(key));
        };


        /***/
      }),

    /***/
    "626a":
      /***/
      (function (module, exports, __webpack_require__) {

        // fallback for non-array-like ES3 and non-enumerable old V8 strings
        var cof = __webpack_require__("2d95");
        // eslint-disable-next-line no-prototype-builtins
        module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
          return cof(it) == 'String' ? it.split('') : Object(it);
        };


        /***/
      }),

    /***/
    "626e":
      /***/
      (function (module, exports, __webpack_require__) {

        var pIE = __webpack_require__("d74e");
        var createDesc = __webpack_require__("f845");
        var toIObject = __webpack_require__("6a9b");
        var toPrimitive = __webpack_require__("2ea1");
        var has = __webpack_require__("43c8");
        var IE8_DOM_DEFINE = __webpack_require__("a47f");
        var gOPD = Object.getOwnPropertyDescriptor;

        exports.f = __webpack_require__("7d95") ? gOPD : function getOwnPropertyDescriptor(O, P) {
          O = toIObject(O);
          P = toPrimitive(P, true);
          if (IE8_DOM_DEFINE) try {
            return gOPD(O, P);
          } catch (e) {
            /* empty */
          }
          if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
        };


        /***/
      }),

    /***/
    "6277":
      /***/
      (function (module, exports, __webpack_require__) {

        var META = __webpack_require__("7b00")('meta');
        var isObject = __webpack_require__("6f8a");
        var has = __webpack_require__("43c8");
        var setDesc = __webpack_require__("3adc").f;
        var id = 0;
        var isExtensible = Object.isExtensible || function () {
          return true;
        };
        var FREEZE = !__webpack_require__("d782")(function () {
          return isExtensible(Object.preventExtensions({}));
        });
        var setMeta = function (it) {
          setDesc(it, META, {
            value: {
              i: 'O' + ++id, // object ID
              w: {} // weak collections IDs
            }
          });
        };
        var fastKey = function (it, create) {
          // return primitive with prefix
          if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
          if (!has(it, META)) {
            // can't set metadata to uncaught frozen object
            if (!isExtensible(it)) return 'F';
            // not necessary to add metadata
            if (!create) return 'E';
            // add missing metadata
            setMeta(it);
            // return object ID
          }
          return it[META].i;
        };
        var getWeak = function (it, create) {
          if (!has(it, META)) {
            // can't set metadata to uncaught frozen object
            if (!isExtensible(it)) return true;
            // not necessary to add metadata
            if (!create) return false;
            // add missing metadata
            setMeta(it);
            // return hash weak collections IDs
          }
          return it[META].w;
        };
        // add metadata on freeze-family methods calling
        var onFreeze = function (it) {
          if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
          return it;
        };
        var meta = module.exports = {
          KEY: META,
          NEED: false,
          fastKey: fastKey,
          getWeak: getWeak,
          onFreeze: onFreeze
        };


        /***/
      }),

    /***/
    "6494":
      /***/
      (function (module, exports, __webpack_require__) {

        // Works with __proto__ only. Old v8 can't work with null proto objects.
        /* eslint-disable no-proto */
        var isObject = __webpack_require__("6f8a");
        var anObject = __webpack_require__("0f89");
        var check = function (O, proto) {
          anObject(O);
          if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
        };
        module.exports = {
          set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
            function (test, buggy, set) {
              try {
                set = __webpack_require__("bc25")(Function.call, __webpack_require__("626e").f(Object.prototype, '__proto__').set, 2);
                set(test, []);
                buggy = !(test instanceof Array);
              } catch (e) {
                buggy = true;
              }
              return function setPrototypeOf(O, proto) {
                check(O, proto);
                if (buggy) O.__proto__ = proto;
                else set(O, proto);
                return O;
              };
            }({}, false) : undefined),
          check: check
        };


        /***/
      }),

    /***/
    "6762":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        // https://github.com/tc39/Array.prototype.includes
        var $export = __webpack_require__("5ca1");
        var $includes = __webpack_require__("c366")(true);

        $export($export.P, 'Array', {
          includes: function includes(el /* , fromIndex = 0 */ ) {
            return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
          }
        });

        __webpack_require__("9c6c")('includes');


        /***/
      }),

    /***/
    "67bb":
      /***/
      (function (module, exports, __webpack_require__) {

        module.exports = __webpack_require__("b258");

        /***/
      }),

    /***/
    "6821":
      /***/
      (function (module, exports, __webpack_require__) {

        // to indexed object, toObject with fallback for non-array-like ES3 strings
        var IObject = __webpack_require__("626a");
        var defined = __webpack_require__("be13");
        module.exports = function (it) {
          return IObject(defined(it));
        };


        /***/
      }),

    /***/
    "69a8":
      /***/
      (function (module, exports) {

        var hasOwnProperty = {}.hasOwnProperty;
        module.exports = function (it, key) {
          return hasOwnProperty.call(it, key);
        };


        /***/
      }),

    /***/
    "6a99":
      /***/
      (function (module, exports, __webpack_require__) {

        // 7.1.1 ToPrimitive(input [, PreferredType])
        var isObject = __webpack_require__("d3f4");
        // instead of the ES6 spec version, we didn't implement @@toPrimitive case
        // and the second argument - flag - preferred type is a string
        module.exports = function (it, S) {
          if (!isObject(it)) return it;
          var fn, val;
          if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
          if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
          if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
          throw TypeError("Can't convert object to primitive value");
        };


        /***/
      }),

    /***/
    "6a9b":
      /***/
      (function (module, exports, __webpack_require__) {

        // to indexed object, toObject with fallback for non-array-like ES3 strings
        var IObject = __webpack_require__("8bab");
        var defined = __webpack_require__("e5fa");
        module.exports = function (it) {
          return IObject(defined(it));
        };


        /***/
      }),

    /***/
    "6b54":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        __webpack_require__("3846");
        var anObject = __webpack_require__("cb7c");
        var $flags = __webpack_require__("0bfb");
        var DESCRIPTORS = __webpack_require__("9e1e");
        var TO_STRING = 'toString';
        var $toString = /./ [TO_STRING];

        var define = function (fn) {
          __webpack_require__("2aba")(RegExp.prototype, TO_STRING, fn, true);
        };

        // 21.2.5.14 RegExp.prototype.toString()
        if (__webpack_require__("79e5")(function () {
            return $toString.call({
              source: 'a',
              flags: 'b'
            }) != '/a/b';
          })) {
          define(function toString() {
            var R = anObject(this);
            return '/'.concat(R.source, '/',
              'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
          });
          // FF44- RegExp#toString has a wrong name
        } else if ($toString.name != TO_STRING) {
          define(function toString() {
            return $toString.call(this);
          });
        }


        /***/
      }),

    /***/
    "6bb5":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function () {
          return _getPrototypeOf;
        });
        /* harmony import */
        var _core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("061b");
        /* harmony import */
        var _core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */
        var _core_js_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4d16");
        /* harmony import */
        var _core_js_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_core_js_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_1__);


        function _getPrototypeOf(o) {
          _getPrototypeOf = _core_js_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_1___default.a ? _core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_0___default.a : function _getPrototypeOf(o) {
            return o.__proto__ || _core_js_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_0___default()(o);
          };
          return _getPrototypeOf(o);
        }

        /***/
      }),

    /***/
    "6c67":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "b", function () {
          return tunnelAsync;
        });
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "c", function () {
          return tunnelSync;
        });
        /* harmony import */
        var core_js_modules_es6_regexp_search__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("386d");
        /* harmony import */
        var core_js_modules_es6_regexp_search__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_regexp_search__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */
        var core_js_modules_es6_regexp_match__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4917");
        /* harmony import */
        var core_js_modules_es6_regexp_match__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_regexp_match__WEBPACK_IMPORTED_MODULE_1__);
        /* harmony import */
        var _cordova_qt_webchannel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("1eef");
        /* harmony import */
        var _http11__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6dd1");
        /* harmony import */
        var _config_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("5547");
        /* harmony import */
        var _config_config__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/ __webpack_require__.n(_config_config__WEBPACK_IMPORTED_MODULE_4__);





        var GlobalConfig = {
          nativeTunnel: 'ws',
          // ws, local, ocx, cordova
          initCordovaByHand: false,
          // 是否手动initCordova 
          nativeHttpTimeout: 30000,
          nativeWsUrl: 'ws://localhost:12345',
          nativeHttpUrl: 'http://localhost:12346'
        };

        if (_config_config__WEBPACK_IMPORTED_MODULE_4___default.a && _config_config__WEBPACK_IMPORTED_MODULE_4___default.a.nativeTunnel) {
          GlobalConfig = _config_config__WEBPACK_IMPORTED_MODULE_4___default.a;
        }

        var userAgent = navigator.userAgent;

        if (userAgent && userAgent.indexOf("volcano") >= 0) {
          GlobalConfig.nativeTunnel = GlobalConfig.volcanoNativeTunnel || "local";
        } else if (userAgent && userAgent.toLowerCase().match(/android/i) == "android") {
          GlobalConfig.nativeTunnel = GlobalConfig.androidNativeTunnel || "http";
        } // const NATIVE_WS_URL_DEFAULT = 'ws://localhost:12345';


        var NATIVE_HTTP_URL_DEFAULT = 'http://localhost:12346';
        var nativeTunnel = GlobalConfig.nativeTunnel; //const initCordovaByHand = GlobalConfig.initCordovaByHand;

        var nativeHttpTimeout = GlobalConfig.nativeHttpTimeout; // const nativeWsUrl = GlobalConfig.nativeWsUrl;

        var nativeHttpUrl = GlobalConfig.nativeHttpUrl;
        var tunnelAsync = nativeTunnel === 'cordova' ? window.cordova : _cordova_qt_webchannel__WEBPACK_IMPORTED_MODULE_2__[ /* default */ "a"];
        var callid = 0; // if(!initCordovaByHand && nativeTunnel !== 'cordova') {// 自动初始化Cordova
        //   tunnelAsync.init(function(msg) {
        //     console.log('tunnelAsync.init.msg:' + (msg || 'tunnelAsync connected!'));
        //   });
        // } else {
        //   console.warn("请在所有业务开始前手工调用NativeBridge.init(function(msg) {// 此处开始你的业务})，否则修改config.initCordovaByHand = false，由平台自动调用，需延时5秒后再开始本地化API调用！");
        // }

        /**
         * http websocket方式通讯
         * @param {*} sendData 发送数据
         * @param {Boolean} bAsync 是否异步请求
         */

        function sendHttpWebSocket(sendData, bAsync, successCallback, errorCallback, serviceName) {
          var response = "";
          var baseUrl = '';

          if (location.search != "") {
            var matched = /[?&]httpBaseUrl=([A-Za-z0-9\-:/.]+)/.exec(location.search);

            if (matched && matched.length > 1) {
              baseUrl = matched[1];
            } else {
              baseUrl = NATIVE_HTTP_URL_DEFAULT;
            }
          } else {
            baseUrl = NATIVE_HTTP_URL_DEFAULT;
          }

          baseUrl = nativeHttpUrl || baseUrl;

          if (nativeTunnel === 'http' && serviceName) {
            baseUrl += serviceName;
          }

          var xmlhttp = GlobalConfig.nativeTunnelUseHttp11 ? Object(_http11__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"])({
            method: "POST",
            baseUrl: baseUrl,
            bAsync: bAsync,
            requestHeaders: {
              "Content-Type": nativeTunnel === 'http' ? "application/json;charset=utf-8" : "application/x-www-form-urlencoded"
            }
          }) : new XMLHttpRequest();

          if (bAsync) {
            try {
              xmlhttp.timeout = nativeHttpTimeout;

              xmlhttp.ontimeout = function (e) {
                console.warn("sendHttpWebSocket.ontimeout: ");
                console.warn(e);

                if (errorCallback) {
                  errorCallback(xmlhttp);
                }
              };
            } catch (error) {
              console.error(error);
            }
          }

          xmlhttp.onerror = function (e) {
            console.error("sendHttpWebSocket.onerror: ");
            console.error(e);

            if (bAsync) {
              if (errorCallback) {
                errorCallback(xmlhttp);
              }
            }
          };

          xmlhttp.onreadystatechange = function () {
            if ((xmlhttp.status == 200 || xmlhttp.status == 0) && xmlhttp.readyState == 4) {
              response = xmlhttp.responseText;

              if (response && bAsync && successCallback) {
                var respObj = typeof response === 'string' ? JSON.parse(response) : response;
                successCallback(respObj);
              }
            } else if (xmlhttp.status == 400) {
              console.warn("Bad Request(parameter is not json format)");

              if (bAsync && errorCallback) {
                errorCallback(xmlhttp);
              }
            } else if (xmlhttp.status == 500) {
              console.warn("Bad Request(parameter is not json array)");

              if (bAsync && errorCallback) {
                errorCallback(xmlhttp);
              } else {
                console.warn(xmlhttp.status);
              }
            }
          };

          if (!GlobalConfig.nativeTunnelUseHttp11) {
            xmlhttp.open("POST", baseUrl, bAsync);
            xmlhttp.setRequestHeader("Content-type", nativeTunnel === 'http' ? "application/json;charset=utf-8" : "application/x-www-form-urlencoded");
          }

          try {
            xmlhttp.send(sendData);
          } catch (error) {
            console.error(error);

            if (bAsync && errorCallback) {
              errorCallback(xmlhttp);
            }
          }

          return response;
        }
        /**
         * 同步通道
         */


        function tunnelSync(pluginName, pluginMethod, moduleName, moduleMethod, args, timeout) {
          var ret = -1;
          pluginName = pluginName || "com.gwi.device";
          pluginMethod = pluginMethod || "getPriority";

          if (args && typeof args !== 'string') {
            if (nativeTunnel === 'http' && args) {
              args.timeout = timeout;
            }

            args = JSON.stringify(args || {});
          }

          var params = [moduleName, moduleMethod];

          if (args) {
            params.push(args);
          }

          if (timeout != undefined) {
            params.push(timeout);
          }

          if (nativeTunnel === 'local') {
            ret = prompt(JSON.stringify(params), 'gap:' + JSON.stringify([pluginName, pluginMethod]));
          } else if (nativeTunnel === 'cordova') {
            ret = tunnelAsync.exec(null, null, pluginName, pluginMethod, params, true);
          } else if (nativeTunnel === 'ws') {
            ret = sendHttpWebSocket("plugin=" + pluginName + "&method=" + pluginMethod + "&parameter=" + encodeURIComponent(JSON.stringify(params)));
          } else if (nativeTunnel === 'http') {
            callid = callid == 0 ? Math.floor(Math.random() * 20000) : callid + 1;
            var methodType = 0;

            if ("setPriority" === pluginMethod) {
              methodType = 2;
            }

            if ("getPriority" === pluginMethod) {
              methodType = 3;
            }

            var obj = {
              methodType: methodType,
              //同步
              callID: callid,
              pluginName: pluginName,
              pluginMethod: pluginMethod,
              devName: moduleName,
              actionName: moduleMethod,
              param: args
            };
            ret = sendHttpWebSocket(JSON.stringify(obj), false, null, null, moduleMethod.indexOf("GWILog") >= 0 ? "/CallClient" : "/CallDevice");
          } else {
            ret = sendHttpWebSocket("plugin=" + pluginName + "&method=" + pluginMethod + "&parameter=" + encodeURIComponent(JSON.stringify(params)));
          }

          return ret;
        }


        /* harmony default export */
        __webpack_exports__["a"] = (tunnelAsync);

        /***/
      }),

    /***/
    "6dd1":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* unused harmony export setRequestHeader */
        //单例模式抽象，分离创建对象的函数和判断对象是否已经创建
        var _globalHttp11 = {
          xhr: undefined
        };

        var getSingle = function getSingle(fn) {
          return function () {
            return _globalHttp11.xhr || (_globalHttp11.xhr = fn.apply(this, arguments));
          };
        };

        function createXhr(args) {
          var xmlhttp = new XMLHttpRequest(); // xmlhttp.setRequestHeader("Connection", "keepalive");
          // xmlhttp.setRequestHeader("Keep-Alive", "86400");// 24 * 60 * 60秒

          xmlhttp.open(args.method || "POST", args.baseUrl, args.bAsync);
          setRequestHeader(xmlhttp, args.requestHeaders || { // "Connection": "keepalive",
            // "Keep-Alive": "86400"// 24 * 60 * 60秒
          });
          return xmlhttp;
        }

        var getXhr = function getXhr(args) {
          return getSingle(createXhr)(args);
        };

        function setRequestHeader(xmlhttp, params) {
          for (var key in params) {
            if (params.hasOwnProperty(key)) {
              var element = params[key];
              xmlhttp.setRequestHeader(key, element);
            }
          }
        }


        /* harmony default export */
        __webpack_exports__["a"] = (getXhr);

        /***/
      }),

    /***/
    "6e1f":
      /***/
      (function (module, exports) {

        var toString = {}.toString;

        module.exports = function (it) {
          return toString.call(it).slice(8, -1);
        };


        /***/
      }),

    /***/
    "6f8a":
      /***/
      (function (module, exports) {

        module.exports = function (it) {
          return typeof it === 'object' ? it !== null : typeof it === 'function';
        };


        /***/
      }),

    /***/
    "7017":
      /***/
      (function (module, exports, __webpack_require__) {

        __webpack_require__("85cd");
        module.exports = __webpack_require__("a7d3").Object.getPrototypeOf;


        /***/
      }),

    /***/
    "7108":
      /***/
      (function (module, exports, __webpack_require__) {

        // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
        var anObject = __webpack_require__("0f89");
        var dPs = __webpack_require__("f568");
        var enumBugKeys = __webpack_require__("0029");
        var IE_PROTO = __webpack_require__("5d8f")('IE_PROTO');
        var Empty = function () {
          /* empty */
        };
        var PROTOTYPE = 'prototype';

        // Create object with fake `null` prototype: use iframe Object with cleared prototype
        var createDict = function () {
          // Thrash, waste and sodomy: IE GC bug
          var iframe = __webpack_require__("12fd")('iframe');
          var i = enumBugKeys.length;
          var lt = '<';
          var gt = '>';
          var iframeDocument;
          iframe.style.display = 'none';
          __webpack_require__("103a").appendChild(iframe);
          iframe.src = 'javascript:'; // eslint-disable-line no-script-url
          // createDict = iframe.contentWindow.Object;
          // html.removeChild(iframe);
          iframeDocument = iframe.contentWindow.document;
          iframeDocument.open();
          iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
          iframeDocument.close();
          createDict = iframeDocument.F;
          while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
          return createDict();
        };

        module.exports = Object.create || function create(O, Properties) {
          var result;
          if (O !== null) {
            Empty[PROTOTYPE] = anObject(O);
            result = new Empty();
            Empty[PROTOTYPE] = null;
            // add "__proto__" for Object.getPrototypeOf polyfill
            result[IE_PROTO] = O;
          } else result = createDict();
          return Properties === undefined ? result : dPs(result, Properties);
        };


        /***/
      }),

    /***/
    "7290":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /*
         *  Copyright 2011 Wolfgang Koller - http://www.gofg.at/
         *
         *  Licensed under the Apache License, Version 2.0 (the "License");
         *  you may not use this file except in compliance with the License.
         *  You may obtain a copy of the License at
         *
         *      http://www.apache.org/licenses/LICENSE-2.0
         *
         *  Unless required by applicable law or agreed to in writing, software
         *  distributed under the License is distributed on an "AS IS" BASIS,
         *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
         *  See the License for the specific language governing permissions and
         *  limitations under the License.
         */
        var NativeBridge = {
          plugins: {},
          constructors: {},
          callbacks: []
        };
        /*
         * Execute a callback function & remove it from the NativeBridge object
         */

        NativeBridge.callback = function () {
          var scId = arguments[0];
          var callbackRef = null;
          var parameters = [];

          for (var i = 1; i < arguments.length; i++) {
            //debug.log( "Adding parameter " + arguments[i] );
            parameters[i - 1] = arguments[i];
          } // Keep reference to callback


          callbackRef = NativeBridge.callbacks[scId]; // Even IDs are success-, odd are error-callbacks - make sure we remove both

          if (scId % 2 !== 0) {
            scId = scId - 1;
          } // Remove both the success as well as the error callback from the stack


          NativeBridge.callbacks.splice(scId, 2); // Finally run the callback

          if (typeof callbackRef == "function") callbackRef.apply(this, parameters);
        };
        /*
         * Enable a plugin for use within NativeBridge
         */


        NativeBridge.enablePlugin = function (pluginName) {
          // Enable the plugin
          NativeBridge.plugins[pluginName] = true; // Run constructor for plugin if available

          if (typeof NativeBridge.constructors[pluginName] == "function") NativeBridge.constructors[pluginName]();
        };
        /*
         * Add a plugin-specific constructor function which is called once the plugin is loaded
         */


        NativeBridge.addConstructor = function (pluginName, constructor) {
          NativeBridge.constructors[pluginName] = constructor;
        };
        /**
         * Event interface - http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event
         */


        NativeBridge.Event = function () {};

        NativeBridge.Event.CAPTURING_PHASE = 1;
        NativeBridge.Event.AT_TARGET = 2;
        NativeBridge.Event.BUBBLING_PHASE = 3;
        NativeBridge.Event.prototype.type = "unknown";
        NativeBridge.Event.prototype.target = NativeBridge;
        NativeBridge.Event.prototype.currentTarget = NativeBridge;
        NativeBridge.Event.prototype.eventPhase = NativeBridge.Event.AT_TARGET;
        NativeBridge.Event.prototype.bubbles = false;
        NativeBridge.Event.prototype.cancelable = false;
        NativeBridge.Event.prototype.timeStamp = 0;

        NativeBridge.Event.prototype.stopPropagation = function () {};

        NativeBridge.Event.prototype.preventDefault = function () {};

        NativeBridge.Event.prototype.initEvent = function (eventTypeArg, canBubbleArg, cancelableArg) {
          this.type = eventTypeArg;
          this.timeStamp = new Date().getMilliseconds();
        };
        /*
         * EventHandler interface - handles one type of event
         * Not W3C defined, but required in order to handle our custom events
         */


        NativeBridge.EventHandler = function (p_type) {
          this.type = p_type;
          this.listeners = [];
        };

        NativeBridge.EventHandler.prototype.type = "unknown";
        NativeBridge.EventHandler.prototype.listeners = [];

        NativeBridge.EventHandler.prototype.addEventListener = function (p_listener, p_capture) {
          if (p_capture) {
            this.listeners.unshift(p_listener);
          } else {
            this.listeners.push(p_listener);
          }
        };

        NativeBridge.EventHandler.prototype.removeEventListener = function (p_listener, p_capture) {
          // Try to find the event listener in our list
          for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] === p_listener) {
              // Remove the listener from our queue
              this.listeners.splice(i, 1);
              return;
            }
          }
        };

        NativeBridge.EventHandler.prototype.dispatchEvent = function () {
          var event = new NativeBridge.Event();
          event.initEvent(this.type, false, false); // Notify all listeners about this event

          for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i].apply(NativeBridge, arguments);
          }
        };
        /*
         * Create the custom NativeBridge events
         */


        NativeBridge.events = {
          deviceready: new NativeBridge.EventHandler("deviceready"),
          resume: new NativeBridge.EventHandler("resume"),
          pause: new NativeBridge.EventHandler("pause"),
          online: new NativeBridge.EventHandler("online"),
          offline: new NativeBridge.EventHandler("offline"),
          backbutton: new NativeBridge.EventHandler("backbutton"),
          batterycritical: new NativeBridge.EventHandler("batterycritical"),
          batterylow: new NativeBridge.EventHandler("batterylow"),
          batterystatus: new NativeBridge.EventHandler("batterystatus"),
          menubutton: new NativeBridge.EventHandler("menubutton"),
          searchbutton: new NativeBridge.EventHandler("searchbutton"),
          startcallbutton: new NativeBridge.EventHandler("startcallbutton"),
          endcallbutton: new NativeBridge.EventHandler("endcallbutton"),
          volumedownbutton: new NativeBridge.EventHandler("volumedownbutton"),
          volumeupbutton: new NativeBridge.EventHandler("volumeupbutton")
        };
        /*
         * EventTarget interface - http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
         */
        //Keep references to the original EventTarget implementations

        NativeBridge.doc_addEventListener = document.addEventListener;
        NativeBridge.doc_removeEventListener = document.removeEventListener;
        NativeBridge.doc_dispatchEvent = document.dispatchEvent;

        document.addEventListener = function (type, listener, useCapture) {
          if (typeof NativeBridge.events[type] !== "undefined") {
            NativeBridge.events[type].addEventListener(listener, useCapture);
          } else {
            NativeBridge.doc_addEventListener.call(document, type, listener, useCapture);
          }
        };

        document.removeEventListener = function (type, listener, useCapture) {
          if (typeof NativeBridge.events[type] !== "undefined") {
            NativeBridge.events[type].removeEventListener(listener, useCapture);
          } else {
            NativeBridge.doc_removeEventListener.call(document, type, listener, useCapture);
          }
        };

        document.dispatchEvent = function (evt) {
          if (typeof NativeBridge.events[evt.type] !== "undefined") {
            NativeBridge.events[evt.type].dispatchEvent();
          } else {
            NativeBridge.doc_dispatchEvent.call(document, evt);
          }
        };
        /*
         * Trigger the global deviceready event - fired from native code
         */


        NativeBridge.deviceready = function () {
          NativeBridge.events.deviceready.dispatchEvent();
        };

        NativeBridge.resumeOccured = function () {
          console.log("NativeBridge.resumeOccured");
          NativeBridge.events.resume.dispatchEvent();
        };

        NativeBridge.pauseOccured = function () {
          console.log("NativeBridge.pauseOccured");
          NativeBridge.events.pause.dispatchEvent();
        };

        NativeBridge.onlineOccured = function () {
          console.log("NativeBridge.onlineOccured");
          NativeBridge.events.online.dispatchEvent();
        };

        NativeBridge.offlineOccured = function () {
          console.log("NativeBridge.offlineOccured");
          NativeBridge.events.offline.dispatchEvent();
        };

        NativeBridge.batteryStatusChanged = function (level, isPlugged, forceStatus) {
          console.log("NativeBridge.batteryStatusChanged: " + level + ", " + isPlugged + ", " + forceStatus);
          if (level < 3 && !forceStatus) NativeBridge.events.batterycritical.dispatchEvent({
            level: level,
            isPlugged: isPlugged
          });
          else if (level < 40 && !forceStatus) NativeBridge.events.batterylow.dispatchEvent({
            level: level,
            isPlugged: isPlugged
          });
          NativeBridge.events.batterystatus.dispatchEvent({
            level: level,
            isPlugged: isPlugged
          });
        };

        NativeBridge.menuKeyPressed = function () {
          console.log("NativeBridge.menuKeyPressed");
          NativeBridge.events.menubutton.dispatchEvent();
        };

        NativeBridge.backKeyPressed = function () {
          console.log("NativeBridge.backKeyPressed");
          NativeBridge.events.backbutton.dispatchEvent();
        };

        NativeBridge.searchKeyPressed = function () {
          console.log("NativeBridge.searchKeyPressed");
          NativeBridge.events.searchbutton.dispatchEvent();
        };

        NativeBridge.callKeyPressed = function () {
          console.log("NativeBridge.callKeyPressed");
          NativeBridge.events.startcallbutton.dispatchEvent();
        };

        NativeBridge.hangupKeyPressed = function () {
          console.log("NativeBridge.hangupKeyPressed");
          NativeBridge.events.endcallbutton.dispatchEvent();
        };

        NativeBridge.volumeUpKeyPressed = function () {
          console.log("NativeBridge.volumeUpKeyPressed");
          NativeBridge.events.volumeupbutton.dispatchEvent();
        };

        NativeBridge.volumeDownKeyPressed = function () {
          console.log("NativeBridge.volumeDownKeyPressed");
          NativeBridge.events.volumedownbutton.dispatchEvent();
        }; // (function (root, factory) {
        //     if (typeof define === 'function' && define.amd) {
        //         // AMD
        //         define([], factory);
        //     } else if (typeof exports === 'object') {
        //         // Node, CommonJS-like
        //         module.exports = factory(require());
        //     } else {
        //         // Browser globals (root is window)
        //         root.returnExports = factory();
        //     }
        //     }(this, function () {
        //         return NativeBridge;
        //     })
        // );


        window.NativeBridge = NativeBridge;
        /* harmony default export */
        __webpack_exports__["a"] = (NativeBridge);

        /***/
      }),

    /***/
    "7333":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        // 19.1.2.1 Object.assign(target, source, ...)
        var getKeys = __webpack_require__("0d58");
        var gOPS = __webpack_require__("2621");
        var pIE = __webpack_require__("52a7");
        var toObject = __webpack_require__("4bf8");
        var IObject = __webpack_require__("626a");
        var $assign = Object.assign;

        // should work with symbols and should have deterministic property order (V8 bug)
        module.exports = !$assign || __webpack_require__("79e5")(function () {
          var A = {};
          var B = {};
          // eslint-disable-next-line no-undef
          var S = Symbol();
          var K = 'abcdefghijklmnopqrst';
          A[S] = 7;
          K.split('').forEach(function (k) {
            B[k] = k;
          });
          return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
        }) ? function assign(target, source) { // eslint-disable-line no-unused-vars
          var T = toObject(target);
          var aLen = arguments.length;
          var index = 1;
          var getSymbols = gOPS.f;
          var isEnum = pIE.f;
          while (aLen > index) {
            var S = IObject(arguments[index++]);
            var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
            var length = keys.length;
            var j = 0;
            var key;
            while (length > j)
              if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
          }
          return T;
        } : $assign;


        /***/
      }),

    /***/
    "7618":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function () {
          return _typeof;
        });
        /* harmony import */
        var _core_js_symbol_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5d58");
        /* harmony import */
        var _core_js_symbol_iterator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_core_js_symbol_iterator__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */
        var _core_js_symbol__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("67bb");
        /* harmony import */
        var _core_js_symbol__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_core_js_symbol__WEBPACK_IMPORTED_MODULE_1__);



        function _typeof2(obj) {
          if (typeof _core_js_symbol__WEBPACK_IMPORTED_MODULE_1___default.a === "function" && typeof _core_js_symbol_iterator__WEBPACK_IMPORTED_MODULE_0___default.a === "symbol") {
            _typeof2 = function _typeof2(obj) {
              return typeof obj;
            };
          } else {
            _typeof2 = function _typeof2(obj) {
              return obj && typeof _core_js_symbol__WEBPACK_IMPORTED_MODULE_1___default.a === "function" && obj.constructor === _core_js_symbol__WEBPACK_IMPORTED_MODULE_1___default.a && obj !== _core_js_symbol__WEBPACK_IMPORTED_MODULE_1___default.a.prototype ? "symbol" : typeof obj;
            };
          }
          return _typeof2(obj);
        }

        function _typeof(obj) {
          if (typeof _core_js_symbol__WEBPACK_IMPORTED_MODULE_1___default.a === "function" && _typeof2(_core_js_symbol_iterator__WEBPACK_IMPORTED_MODULE_0___default.a) === "symbol") {
            _typeof = function _typeof(obj) {
              return _typeof2(obj);
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj && typeof _core_js_symbol__WEBPACK_IMPORTED_MODULE_1___default.a === "function" && obj.constructor === _core_js_symbol__WEBPACK_IMPORTED_MODULE_1___default.a && obj !== _core_js_symbol__WEBPACK_IMPORTED_MODULE_1___default.a.prototype ? "symbol" : _typeof2(obj);
            };
          }

          return _typeof(obj);
        }

        /***/
      }),

    /***/
    "7633":
      /***/
      (function (module, exports, __webpack_require__) {

        // 19.1.2.14 / 15.2.3.14 Object.keys(O)
        var $keys = __webpack_require__("2695");
        var enumBugKeys = __webpack_require__("0029");

        module.exports = Object.keys || function keys(O) {
          return $keys(O, enumBugKeys);
        };


        /***/
      }),

    /***/
    "7726":
      /***/
      (function (module, exports) {

        // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
        var global = module.exports = typeof window != 'undefined' && window.Math == Math ?
          window : typeof self != 'undefined' && self.Math == Math ? self
          // eslint-disable-next-line no-new-func
          :
          Function('return this')();
        if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


        /***/
      }),

    /***/
    "7772":
      /***/
      (function (module, exports, __webpack_require__) {

        var core = __webpack_require__("a7d3");
        var global = __webpack_require__("da3c");
        var SHARED = '__core-js_shared__';
        var store = global[SHARED] || (global[SHARED] = {});

        (module.exports = function (key, value) {
          return store[key] || (store[key] = value !== undefined ? value : {});
        })('versions', []).push({
          version: core.version,
          mode: __webpack_require__("b457") ? 'pure' : 'global',
          copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
        });


        /***/
      }),

    /***/
    "77f1":
      /***/
      (function (module, exports, __webpack_require__) {

        var toInteger = __webpack_require__("4588");
        var max = Math.max;
        var min = Math.min;
        module.exports = function (index, length) {
          index = toInteger(index);
          return index < 0 ? max(index + length, 0) : min(index, length);
        };


        /***/
      }),

    /***/
    "79e5":
      /***/
      (function (module, exports) {

        module.exports = function (exec) {
          try {
            return !!exec();
          } catch (e) {
            return true;
          }
        };


        /***/
      }),

    /***/
    "7a56":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var global = __webpack_require__("7726");
        var dP = __webpack_require__("86cc");
        var DESCRIPTORS = __webpack_require__("9e1e");
        var SPECIES = __webpack_require__("2b4c")('species');

        module.exports = function (KEY) {
          var C = global[KEY];
          if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
            configurable: true,
            get: function () {
              return this;
            }
          });
        };


        /***/
      }),

    /***/
    "7b00":
      /***/
      (function (module, exports) {

        var id = 0;
        var px = Math.random();
        module.exports = function (key) {
          return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
        };


        /***/
      }),

    /***/
    "7d95":
      /***/
      (function (module, exports, __webpack_require__) {

        // Thank's IE8 for his funny defineProperty
        module.exports = !__webpack_require__("d782")(function () {
          return Object.defineProperty({}, 'a', {
            get: function () {
              return 7;
            }
          }).a != 7;
        });


        /***/
      }),

    /***/
    "7f20":
      /***/
      (function (module, exports, __webpack_require__) {

        var def = __webpack_require__("86cc").f;
        var has = __webpack_require__("69a8");
        var TAG = __webpack_require__("2b4c")('toStringTag');

        module.exports = function (it, tag, stat) {
          if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
            configurable: true,
            value: tag
          });
        };


        /***/
      }),

    /***/
    "7f7f":
      /***/
      (function (module, exports, __webpack_require__) {

        var dP = __webpack_require__("86cc").f;
        var FProto = Function.prototype;
        var nameRE = /^\s*function ([^ (]*)/;
        var NAME = 'name';

        // 19.2.4.2 name
        NAME in FProto || __webpack_require__("9e1e") && dP(FProto, NAME, {
          configurable: true,
          get: function () {
            try {
              return ('' + this).match(nameRE)[1];
            } catch (e) {
              return '';
            }
          }
        });


        /***/
      }),

    /***/
    "8079":
      /***/
      (function (module, exports, __webpack_require__) {

        var global = __webpack_require__("7726");
        var macrotask = __webpack_require__("1991").set;
        var Observer = global.MutationObserver || global.WebKitMutationObserver;
        var process = global.process;
        var Promise = global.Promise;
        var isNode = __webpack_require__("2d95")(process) == 'process';

        module.exports = function () {
          var head, last, notify;

          var flush = function () {
            var parent, fn;
            if (isNode && (parent = process.domain)) parent.exit();
            while (head) {
              fn = head.fn;
              head = head.next;
              try {
                fn();
              } catch (e) {
                if (head) notify();
                else last = undefined;
                throw e;
              }
            }
            last = undefined;
            if (parent) parent.enter();
          };

          // Node.js
          if (isNode) {
            notify = function () {
              process.nextTick(flush);
            };
            // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
          } else if (Observer && !(global.navigator && global.navigator.standalone)) {
            var toggle = true;
            var node = document.createTextNode('');
            new Observer(flush).observe(node, {
              characterData: true
            }); // eslint-disable-line no-new
            notify = function () {
              node.data = toggle = !toggle;
            };
            // environments with maybe non-completely correct, but existent Promise
          } else if (Promise && Promise.resolve) {
            // Promise.resolve without an argument throws an error in LG WebOS 2
            var promise = Promise.resolve(undefined);
            notify = function () {
              promise.then(flush);
            };
            // for other environments - macrotask based on:
            // - setImmediate
            // - MessageChannel
            // - window.postMessag
            // - onreadystatechange
            // - setTimeout
          } else {
            notify = function () {
              // strange IE + webpack dev server bug - use .call(global)
              macrotask.call(global, flush);
            };
          }

          return function (fn) {
            var task = {
              fn: fn,
              next: undefined
            };
            if (last) last.next = task;
            if (!head) {
              head = task;
              notify();
            }
            last = task;
          };
        };


        /***/
      }),

    /***/
    "8378":
      /***/
      (function (module, exports) {

        var core = module.exports = {
          version: '2.6.4'
        };
        if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


        /***/
      }),

    /***/
    "83a1":
      /***/
      (function (module, exports) {

        // 7.2.9 SameValue(x, y)
        module.exports = Object.is || function is(x, y) {
          // eslint-disable-next-line no-self-compare
          return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
        };


        /***/
      }),

    /***/
    "84f2":
      /***/
      (function (module, exports) {

        module.exports = {};


        /***/
      }),

    /***/
    "85cd":
      /***/
      (function (module, exports, __webpack_require__) {

        // 19.1.2.9 Object.getPrototypeOf(O)
        var toObject = __webpack_require__("0185");
        var $getPrototypeOf = __webpack_require__("ff0c");

        __webpack_require__("c165")('getPrototypeOf', function () {
          return function getPrototypeOf(it) {
            return $getPrototypeOf(toObject(it));
          };
        });


        /***/
      }),

    /***/
    "85f2":
      /***/
      (function (module, exports, __webpack_require__) {

        module.exports = __webpack_require__("ec5b");

        /***/
      }),

    /***/
    "8614":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */
        var core_js_modules_es6_regexp_split__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("28a5");
        /* harmony import */
        var core_js_modules_es6_regexp_split__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_regexp_split__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */
        var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("a481");
        /* harmony import */
        var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_1__);
        /* harmony import */
        var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6b54");
        /* harmony import */
        var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_2__);
        /* harmony import */
        var E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("d225");
        /* harmony import */
        var E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("b0b4");
        /* harmony import */
        var E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("308d");
        /* harmony import */
        var E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("6bb5");
        /* harmony import */
        var E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("4e2b");
        /* harmony import */
        var _basedev__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("1d73");
        /* harmony import */
        var _config_config__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("5547");
        /* harmony import */
        var _config_config__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/ __webpack_require__.n(_config_config__WEBPACK_IMPORTED_MODULE_9__);










        /**
         * 激光打印机类
         */

        var CLaserPrinter =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__[ /* default */ "a"])(CLaserPrinter, _CBaseDev);

            function CLaserPrinter(serviceName, devName, siuType) {
              var _this;

              Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"])(this, CLaserPrinter);

              _this = Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__[ /* default */ "a"])(this, Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__[ /* default */ "a"])(CLaserPrinter).call(this, serviceName, devName));
              _this.__cur_paper_num = 0;
              _this.siuType = siuType;
              _this.events = {
                /**
                 * 媒介插入事件
                 * @param param
                 */
                'MediaInserted': function MediaInserted(param) {
                  this.dispatchEvent('MediaInserted', param);
                },

                /**
                 * 媒介存在事件
                 * @param param
                 */
                'MediaPresented': function MediaPresented(param) {
                  this.dispatchEvent('MediaPresented', param);
                },

                /**
                 * 媒介拿走事件
                 * @param param
                 */
                'MediaTaken': function MediaTaken(param) {
                  this.dispatchEvent('MediaTaken', param);
                },
                "PrintTextOver": function PrintTextOver(param) {
                  this.controlGuideLight(1);
                  this.dispatchEvent('PrintTextOver', param);
                },
                "PrintFormOver": function PrintFormOver(param) {
                  this.controlGuideLight(1);
                  this.dispatchEvent('PrintFormOver', param);
                },

                /**
                 * 纸张阈值事件
                 * @param param
                 */
                'PaperThreshHold': function PaperThreshHold(param) {
                  this.dispatchEvent('PaperThreshHold', param);
                },

                /**
                 * 回收箱阈值事件
                 * @param param
                 */
                'RetractBinThreshHold': function RetractBinThreshHold(param) {
                  this.dispatchEvent('RetractBinThreshHold', param);
                },

                /**
                 * 等待取消事件
                 * @param param
                 */
                'WaitCancelled': function WaitCancelled(param) {
                  this.dispatchEvent('WaitCancelled', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              _this.__PAGE_FORMATS = {
                '1': {
                  'height': '9.7CM'
                },
                '2': {
                  'height': '20CM'
                },
                '3': {
                  'height': '14CM'
                },
                '4': {
                  'height': '28.5CM'
                },
                '5': {
                  'height': '28.5CM'
                },
                '6': {
                  'height': '28.5CM'
                },
                '7': {
                  'height': '28.5CM'
                },
                '8': {
                  'height': '28.5CM'
                },
                '9': {
                  'height': '28.5CM'
                }
              };
              _this.__page_formats = _this.__PAGE_FORMATS;
              _this.__cur_all_file_list = []; // to backup the current file list to print, including all cfg and file path

              _this.__cur_paper_num = 0; // need to print paper count.

              _this.portion = {
                rgr: function rgr(exObj) {
                  this.__exObj = exObj;
                },
                is: function is(obj, type) {
                  return type === "Null" && obj === null || type === "Undefined" && obj === void 0 || type === "Number" && isFinite(obj) || Object.prototype.toString.call(obj).slice(8, -1) === type;
                },
                genCfgStr: function genCfgStr(cfg) {
                  var thisObj = this;
                  var c = '';

                  if (!cfg.BkIdx && 0 != cfg.BkIdx) {
                    // to set the backup print type index to zero
                    cfg.BkIdx = 0;
                  } // for(let elem in cfg) {
                  // 	if('Mode' != elem && 'MultiPage' != elem && 'FileMode' != elem && 'BkIdx' != elem) {
                  // 		if('PrintType' == elem) {
                  // 			c += (elem + "=" + (thisObj.is(cfg.PrintType, "Array") ? cfg.PrintType[cfg.BkIdx] : cfg.PrintType) + ";");
                  // 		} else {
                  // 			c += (elem +"=" + cfg[elem] + ";");
                  // 		}
                  // 	}
                  // }


                  var paperNumFilter = cfg.PaperNumFilter;

                  for (var elem in cfg) {
                    if ('PaperNumFilter' != elem && 'Mode' != elem && 'MultiPage' != elem && 'FileMode' != elem && 'BkIdx' != elem && 'batchno' != elem && 'batchCnt' != elem) {
                      if ('PrintType' == elem) {
                        c += elem + "=" + (thisObj.is(cfg.PrintType, "Array") ? cfg.PrintType[cfg.BkIdx] : cfg.PrintType) + ";";
                      } else if ('PaperNum' == elem) {
                        if (paperNumFilter) {
                          c += '';
                        } else {
                          c += elem + "=" + cfg[elem] + ";";
                        }
                      } else {
                        c += elem + "=" + cfg[elem] + ";";
                      }
                    }
                  }

                  return c;
                },
                getLogTime: function getLogTime() {
                  Date.prototype.Format = function (formatStr) {
                    var str = formatStr;
                    var Week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                    str = str.replace(/yyyy|YYYY/, this.getFullYear());
                    str = str.replace(/yy|YY/, this.getYear() % 100 > 9 ? (this.getYear() % 100).toString() : '0' + this.getYear() % 100);
                    str = str.replace(/MM/, this.getMonth() + 1 > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
                    str = str.replace(/M/g, this.getMonth() + 1);
                    str = str.replace(/w|W/g, Week[this.getDay()]);
                    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
                    str = str.replace(/d|D/g, this.getDate());
                    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
                    str = str.replace(/h|H/g, this.getHours());
                    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
                    str = str.replace(/m/g, this.getMinutes());
                    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
                    str = str.replace(/s|S/g, this.getSeconds());
                    return str;
                  };

                  var str = "yyyyMMddHHmmss";
                  var now = new Date().Format(str);
                  return now;
                },
                genRandomFileName: function genRandomFileName(seq) {
                  var file = "";
                  var path = _config_config__WEBPACK_IMPORTED_MODULE_9___default.a && _config_config__WEBPACK_IMPORTED_MODULE_9___default.a.laserprintTargetPath || "D:/KIOSK/Data/Abm/target/";
                  var suffix = ".html";
                  file += path + "report_" + this.getLogTime() + "_" + seq + suffix;
                  return file;
                },
                registerBatchCfg: function registerBatchCfg(fileList, cfg) {
                  var bactchCfg = {
                    PaperNum: 0,
                    PrintType: 0,
                    Stamp: 1
                  };
                  bactchCfg.PaperNum = cfg.PaperNum;
                  bactchCfg.PrintType = cfg.PrintType;
                  bactchCfg.Stamp = cfg.Stamp;
                  fileList.push({
                    "cfg": bactchCfg,
                    "files": []
                  });
                },
                savePrintBuffer: function savePrintBuffer(paperCount, buffer) {
                  var fileName = this.genRandomFileName(paperCount); // let param = { "FileName": fileName, "FileData": buffer };

                  this.__exObj.SaveFileDataSync(fileName, buffer);

                  var setRawdataParam = {
                    "prtData": "File[0]=" + fileName
                  };

                  this.__exObj.getInfo('SetRawData', setRawdataParam);
                },
                cacheFileList: function cacheFileList(fileList, paperCount, buffer) {
                  var fileName = this.genRandomFileName(paperCount); // let param = { "FileName": fileName, "FileData": buffer };

                  this.__exObj.SaveFileDataSync(fileName, buffer);

                  fileList[fileList.length - 1].files.push(fileName);
                },
                cacheFileNameList: function cacheFileNameList(fileList, files) {
                  for (var i = 0; i < files.length; i++) {
                    fileList[fileList.length - 1].files.push(files[i]);
                  }
                },
                concatAndFlush: function concatAndFlush(fileList) {
                  var thisObj = this;

                  for (var i = 0; i < fileList.length; i++) {
                    var type = fileList[i];
                    var param = {
                      "prtData": thisObj.genCfgStr(type.cfg)
                    };

                    thisObj.__exObj.getInfo('SetRawData', param);

                    thisObj.concatFiles(type);
                  }
                },
                justToFlush: function justToFlush(fileList) {
                  var thisObj = this;

                  for (var i = 0; i < fileList.length; i++) {
                    var type = fileList[i];
                    var param = {
                      "prtData": thisObj.genCfgStr(type.cfg)
                    };

                    thisObj.__exObj.getInfo('SetRawData', param);

                    for (var j = 0; j < type.files.length; j++) {
                      var _param = {
                        "prtData": 'File[0]=' + type.files[j]
                      };

                      thisObj.__exObj.getInfo('SetRawData', _param);
                    }
                  }
                },
                concatFiles: function concatFiles(type) {
                  var FORMAT = this.__exObj.__page_formats;
                  var insertT3 = "<table height='0.00CM'><tr><td>&nbsp;</td></tr></table>";
                  var page = '';
                  var pageStart = '<html>\n' + '<head>\n' + '<meta http-equiv="Content-Type" content="text/html; charset=GB2312" />\n' + '<style type="text/css" media="print">\n' + 'body {border:NONE; padding:0px; margin:0px;}\n' + '.PageEnd { PAGE-BREAK-AFTER: always;}\n' + '</style>\n' + '</head>\n' + '<body>\n';
                  var pageEnd = '</body></html>';
                  var divStartBreak = '<div class="PageEnd">\n';
                  var divStart = '<div style="overflow:hidden; height:' + (FORMAT[type.cfg.PrintType] ? FORMAT[type.cfg.PrintType].height : FORMAT['2'].height) + ';">\n';
                  var divEnd = '</div>\n';
                  page += pageStart;

                  for (var index = 0; index < type.files.length; index++) {
                    var iframe = '<iframe id="' + '" width="100%" style="height:' + (FORMAT[type.cfg.PrintType] ? FORMAT[type.cfg.PrintType].height : FORMAT['2'].height) + '" frameborder="0" scrolling="no" src="' + type.files[index] + '"></iframe>\n';

                    if (0 != index) {}

                    if (type.files.length - 1 == index) {
                      page += divStart;
                    } else {
                      page += divStartBreak;
                    }

                    page += iframe;
                    page += divEnd;
                  }

                  page += pageEnd;
                  this.savePrintBuffer("type_" + type.cfg.PrintType, page); // let filedata = '[';
                  // filedata = filedata  + type.cfg.PrintType  + ',';
                  // for(let index = 0; index < type.files.length; index++) {
                  // 	//filedata = filedata + type.files[index];
                  // 	if(index == type.files.length -1)
                  // 		filedata = filedata + '"' + (type.files[index]).replace(/\\/g,'//') + '"';
                  // 	else
                  // 		filedata = filedata + '"' + type.files[index] + '"' + ',';
                  // }
                  // filedata = filedata + "]";
                  // console.log(filedata);
                  // this.savePrintBuffer("type_" + type.cfg.PrintType, filedata.toString());
                },
                top_paperOutHook: function top_paperOutHook(param) {
                  return this.__exObj.BackupPrint();
                },
                top_DeviceErrorHook: function top_DeviceErrorHook(param) {
                  this.__exObj.clearAllFileList();
                },
                top_ControlMediaOverHook: function top_ControlMediaOverHook(param) {
                  this.__exObj.clearAllFileList();
                },
                __bHookSet: false,
                top_setLaserprintHooks: function top_setLaserprintHooks() {
                  var thisObj = this;

                  if (thisObj.__bHookSet) {
                    return;
                  }

                  var pageOnEvent = thisObj.__exObj.onEvent;

                  thisObj.__exObj.onEvent = function (evt, args) {
                    var param = eval(args);

                    switch (evt) {
                      case 'ControlMediaOver':
                        thisObj.top_ControlMediaOverHook(param);
                        break;

                      case 'DeviceError':
                        if ((-123 == param.errorcode || -102 == param.errorcode) && thisObj.top_paperOutHook(param)) {
                          // if paperout and exist backup print handle, to handle it
                          return;
                        }

                        thisObj.top_DeviceErrorHook(param);
                        break;

                      default:
                        break;
                    }

                    if (pageOnEvent) {
                      // go on to execute the page event 
                      pageOnEvent(evt, args);
                    }
                  };

                  thisObj.__bHookSet = true;
                }
              };
              return _this;
            }
            /**
             * 插入打印页配置
             * @param page_id 页id
             * @param page_format 格式 { 'height': '20CM' }
             */


            Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__[ /* default */ "a"])(CLaserPrinter, [{
              key: "insertPageFormat",
              value: function insertPageFormat(page_id, page_format) {
                this.__page_formats[page_id] = page_format;
              }
              /**
               * 删除页配置
               * @param page_id
               */

            }, {
              key: "deletePageFormat",
              value: function deletePageFormat(page_id) {
                return delete this.__page_formats[page_id];
              }
              /**
               * 清除页配置
               */

            }, {
              key: "clearPageFormats",
              value: function clearPageFormats() {
                this.__page_formats = {};
              }
              /**
               * 重置页配置
               */

            }, {
              key: "resetPageFormats",
              value: function resetPageFormats() {
                this.__page_formats = this.__PAGE_FORMATS;
              }
              /**
               * 合并页配置
               * @param page_formats {
               * "999": { 'height': '20CM' }
               * }
               */

            }, {
              key: "mergePageFormats",
              value: function mergePageFormats(page_formats) {
                for (var id in page_formats) {
                  this.__page_formats[id] = page_formats[id];
                }
              }
              /**
               * 获取当前页配置
               */

            }, {
              key: "getPageFormats",
              value: function getPageFormats() {
                return this.__page_formats;
              }
              /**
               * 清除打印文件列表
               */

            }, {
              key: "clearAllFileList",
              value: function clearAllFileList() {
                this.__cur_all_file_list = []; // to backup the current file list to print, including all cfg and file path

                this.__cur_paper_num = 0; // need to print paper count.
              }
              /**
               * 备用打印（主纸箱无纸时启用备用纸箱打印）
               */

            }, {
              key: "BackupPrint",
              value: function BackupPrint() {
                var thisObj = this;
                this.portion.rgr(this);
                var printedPaper = thisObj.CheckPaperCountSync(); // the printed paper out

                var paperCount = 0;
                var allFileList = thisObj.__cur_all_file_list;

                if (allFileList && allFileList.length > 0) {
                  // enter the backup print routine.
                  // 1.remeber to shrink the printed page out first!!!
                  for (var curIdx = 0; curIdx < allFileList.length; curIdx++) {
                    if (printedPaper < (paperCount += allFileList[curIdx].cfg.PaperNum)) {
                      // shrink the files array, rebuild the allFileList.
                      var curFilePrinted = paperCount - printedPaper;
                      var curType = allFileList.shift();

                      if (curType) {
                        if (0 == curType.cfg.BkIdx) {
                          curType.cfg.BkIdx++;
                        } else if (!curType.cfg.BkIdx) {
                          // undefined or null 
                          curType.cfg.BkIdx = 1;
                        } else {
                          curType.cfg.BkIdx++;
                        }

                        if (curType.cfg.BkIdx >= curType.cfg.PrintType.length) {
                          // no backup box available
                          return 0;
                        }

                        curType.cfg.PaperNum = curType.cfg.PaperNum - curFilePrinted;
                        curType.files = curType.files.splice(0, curFilePrinted); // shrink the first printed files.

                        allFileList.unshift(curType); // unshift the modified elements to the allFileList
                      }

                      break;
                    } else {
                      // remove the printed type.
                      allFileList.shift();
                    }
                  } // 2.reflush the file to print to sp.


                  for (var _curIdx = 0; _curIdx < allFileList.length; _curIdx++) {
                    if ("multifile" != allFileList[_curIdx].cfg.FileMode) {
                      this.portion.concatAndFlush(allFileList);
                    } else {
                      // just to flush the file, not to concat it
                      this.portion.justToFlush(allFileList);
                    }
                  } // 3.to invoke the ControlMedia to start print job.


                  thisObj.__cur_paper_num -= printedPaper;
                  thisObj.ControlMedia(thisObj.__cur_paper_num, 1);
                  return 1;
                } else {
                  // just to indicate the app to quit the print routine.
                  return 0;
                }
              }
              /**
               * 异步复位
               * @param ResetAction 初始化动作, 详见 ControlMedia 中的mediaCtrol参数说明
               * @param binNumber 回收计数
               */

            }, {
              key: "Reset",
              value: function Reset(ResetAction) {
                var param = {
                  ResetAction: ResetAction,
                  "binNumber": 0
                };
                this.execute('Reset', param);
              }
              /**
               * 同步以HTML的格式保存文件数据
               * @param FileName 文件名(含路径)
               * @param FileData 文件数据，HTML格式，注意转义字符的处理
               */

            }, {
              key: "SaveFileDataSync",
              value: function SaveFileDataSync(FileName, FileData) {
                return this.getInfo('SaveFileDataSync', {
                  FileName: FileName,
                  FileData: FileData
                });
              }
              /**
               * 检测出纸张数
               */

            }, {
              key: "CheckPaperCountSync",
              value: function CheckPaperCountSync() {
                var result = this.getInfo('CheckPaperCountSync', {});
                return result && JSON.parse(result).PaperOutCount || 8;
              }
              /**
               * 更新注册表中打印配置
               * @param cfg  {result: 0,  outinfo:{
               *              'typename': '该项名称，无实际作用，可无',
                              'flag': '盖章机盖横章还是竖章，0为横章1为竖章',
                              'stampnum': '盖章机的盖章数量，0至3对应A4纸上盖0到3个章。'
                              'startpos': '盖章机的盖章起始位置，请根据实际效果控制。'
                              'distance': '盖章机的盖的每个章的间距，请根据实际效果控制。'
                              'box': '打印所使用的纸盒，从1起。'
                              'pagesize': '打印的纸张尺寸，A4为9，A5为11，其他自定义尺寸请参考打印首选项。'
                              'rotate': '是否旋转180°，值为0或1。'
                              'mediatype': '打印的纸张类型，三星打印机可以填272，利盟打印机对应四个纸盒请填272至275。'
                              'orientation': '是否旋转90°，值为1或2。'
                              'copies': '任务的重复打印份数，若无则使用默认值。'
                              'duplex': '双面打印设置，根据不同的打印机，请尝试0、1、2、3等，会有不同的双面效果。'
                              'fontsize': '字体大小'
                              'leftmargin': '左边距'
                              'topmargin': '顶边距'
                              'lineheight': '行高'
                              }
                          }
               */

            }, {
              key: "UpdatePrintConfigSync",
              value: function UpdatePrintConfigSync(cfg) {
                var param = {
                  cfg: cfg
                };
                var result = this.getInfo('UpdatePrintConfigSync', param);
                return !result && JSON.parse(result).result || 0;
              }
              /**
               * 同步获取打印机类型
               * @param type 类型
               * @returns
               * {result: 0,
               *  outinfo:{
               *              'typename': '该项名称，无实际作用，可无',
                              'flag': '盖章机盖横章还是竖章，0为横章1为竖章',
                              'stampnum': '盖章机的盖章数量，0至3对应A4纸上盖0到3个章。'
                              'startpos': '盖章机的盖章起始位置，请根据实际效果控制。'
                              'distance': '盖章机的盖的每个章的间距，请根据实际效果控制。'
                              'box': '打印所使用的纸盒，从1起。'
                              'pagesize': '打印的纸张尺寸，A4为9，A5为11，其他自定义尺寸请参考打印首选项。'
                              'rotate': '是否旋转180°，值为0或1。'
                              'mediatype': '打印的纸张类型，三星打印机可以填272，利盟打印机对应四个纸盒请填272至275。'
                              'orientation': '是否旋转90°，值为1或2。'
                              'copies': '任务的重复打印份数，若无则使用默认值。'
                              'duplex': '双面打印设置，根据不同的打印机，请尝试0、1、2、3等，会有不同的双面效果。'
                              'fontsize': '字体大小'
                              'leftmargin': '左边距'
                              'topmargin': '顶边距'
                              'lineheight': '行高'
                              }
                          }
                   */

            }, {
              key: "GetPrintType",
              value: function GetPrintType(type) {
                return this.getInfo('GetPrintType', {
                  type: type
                });
              }
              /**
               * 批量设置打印数据
               * @param cfg 打印配置
               * @param files 打印文件
               */

            }, {
              key: "SetRawData",
              value: function SetRawData(cfg, files) {
                var thisObj = this;
                var paperNum = 0;
                var allFileList = [];
                this.portion.rgr(this);

                try {
                  if (thisObj.portion.is(cfg.PrintType, "Array")) {
                    // contains backup print routine
                    if (!cfg.BkIdx && 0 != cfg.BkIdx) {
                      // to set the backup print type index to zero
                      cfg.BkIdx = 0;
                    }

                    thisObj.portion.top_setLaserprintHooks();
                  }

                  if ('file' == cfg.Mode) {
                    paperNum = files.length;

                    if (true == cfg.MultiPage) {
                      paperNum = cfg.PaperNum;
                    }

                    cfg.PaperNum = paperNum;
                    thisObj.portion.registerBatchCfg(allFileList, cfg);
                    thisObj.portion.cacheFileNameList(allFileList, files);

                    if ("multifile" != cfg.FileMode) {
                      thisObj.portion.concatAndFlush(allFileList);
                    } else {
                      thisObj.portion.justToFlush(allFileList);
                    }
                  } else {
                    var startTag = "<html>";
                    var endTag = "</html>";
                    var spliterLen = startTag.length;
                    var insertT1 = "<table height='20px'><tr><td></td></tr></table>";
                    var insertT2 = "<table height='37px'><tr><td></td></tr></table>";
                    var offset = 1;
                    var paperCount = 0;
                    var allSinglePaperNum = 0;
                    var allPrintData = [];

                    for (var i = 0; i < files.length; i++) {
                      var ar = files[i].split(endTag, -1);
                      ar.pop();
                      var size = ar.length;
                      allSinglePaperNum += size;
                      allPrintData = allPrintData.concat(ar);
                    }

                    var curPrintType = thisObj.portion.is(cfg.PrintType, "Array") ? cfg.PrintType[cfg.BkIdx] : cfg.PrintType;

                    if (4 == curPrintType) {
                      offset = 3;
                      paperNum = Math.floor(allSinglePaperNum / 3) + (0 == allSinglePaperNum % 3 ? 0 : 1);
                      cfg.PaperNum = paperNum - (0 == allSinglePaperNum % 3 ? 0 : 1);

                      if (cfg.PaperNum > 0) {
                        thisObj.portion.registerBatchCfg(allFileList, cfg);
                      }
                    } else {
                      offset = 1;
                      paperNum = allSinglePaperNum;
                      cfg.PaperNum = paperNum;
                      thisObj.portion.registerBatchCfg(allFileList, cfg);
                    }

                    for (var index = 0; index < allSinglePaperNum; index += offset) {
                      if (1 == offset) {
                        paperCount++;
                        thisObj.portion.cacheFileList(allFileList, paperCount, allPrintData[index] + endTag);
                      } else if (3 == offset) {
                        curPrintType = 5;
                        var combined = allPrintData[index];

                        if (index + 1 < allSinglePaperNum && null != allPrintData[index + 1] && allPrintData[index + 1].length >= spliterLen) {
                          combined += insertT1 + allPrintData[index + 1].substring(allPrintData[index + 1].indexOf(startTag) + spliterLen);
                          curPrintType = 6;
                        }

                        if (index + 2 < allSinglePaperNum && null != allPrintData[index + 2] && allPrintData[index + 2].length >= spliterLen) {
                          combined += insertT2 + allPrintData[index + 2].substring(allPrintData[index + 2].indexOf(startTag) + spliterLen);
                          curPrintType = 4;
                        }

                        combined += endTag;

                        if (5 == curPrintType || 6 == curPrintType) {
                          cfg.PaperNum = 1;

                          if (thisObj.portion.is(cfg.PrintType, "Array")) {
                            cfg.PrintType[cfg.BkIdx] = curPrintType; // BkIdx => cfg.BkIdx

                            cfg.PrintType[cfg.BkIdx + 1] = curPrintType + 5; // hard encode 10, 11, no other way?
                          } else {
                            cfg.PrintType = curPrintType;
                          }

                          thisObj.portion.registerBatchCfg(allFileList, cfg);
                        }

                        paperCount++;
                        thisObj.portion.cacheFileList(allFileList, paperCount, combined);
                      }
                    }

                    if ("multifile" != cfg.FileMode) {
                      thisObj.portion.concatAndFlush(allFileList);
                    } else {
                      thisObj.portion.justToFlush(allFileList);
                    }
                  }
                } catch (e) {
                  paperNum = 0;
                }

                if (thisObj.portion.is(cfg.PrintType, "Array")) {
                  thisObj.__cur_paper_num += paperNum;
                  thisObj.__cur_all_file_list = thisObj.__cur_all_file_list.concat(allFileList); // to record the file list to laserprint member letiable
                }

                return paperNum;
              }
              /**
               * 异步控制介质，该命令用来控制通过设备绘制的表单（例如阅读或终止某应用程序请求）。
               * 如果弹出操作被指定，那么，当媒介被移到出口时，该弹出操作即完成。当媒介已经被用户取走时
               * （只有当结构WFSPTRCAPS中规定的字段bMediaTaken等于TRUE时），就会生成一个服务事件。
               * @param paperNum 出纸张数
               * @param mediaCtrol  取值如下：
              *       1 : 对应WOSA定义WFS_PTR_CTRLEJECT，打印还未根据先前的WFS_CMD_PTR_PRINT_FORM或 WFS_CMD_PTR_PRINT_RAW_FILE命令打印的数据，然后弹出媒介。
                  2 : 对应WOSA定义WFS_PTR_CTRLPERFORATE，按上述要求打印数据，然后在媒介上打眼。
                  4 : 对应WOSA定义WFS_PTR_CTRLCUT，按上述要求打印数据，然后切纸。 对于具有堆放多重切纸并将它们作为单独一沓交给客户能力的打印机而言， 切割是因为要将媒介堆放起来，而弹出是因为要将一沓纸移到出口。
                  8 : 对应WOSA定义WFS_PTR_CTRLSKIP，按上述要求打印数据，然后跳媒介到黑标。
                  16 : 对应WOSA定义WFS_PTR_CTRLFLUSH，打印打印机还未根据先前的WFS_CMD_PTR_PRINT_FORM或WFS_CMD_PTR_PRINT_RAW_FILE命令打印的数据。
                  32 : 对应WOSA定义WFS_PTR_CTRLRETRACT，按上述要求打印数据，然后回收媒介到1::回收盒，如果媒介必须回收到另一个回收盒而非1::回收盒， 则设备需要一个以上的回收盒，就必须采用WFS_CMD_PTR_RETRACT_MEDIA命令。
                  64 : 对应WOSA定义WFS_PTR_CTRLSTACK，按上述要求打印数据，然后将媒介移到内部堆放器上。
                  128 : 对应WOSA定义WFS_PTR_CTRLPARTIALCUT，按上述要求打印数据，然后对媒介进行部分切割。
                  256 : 对应WOSA定义WFS_PTR_CTRLALARM，导致打印机响铃、发出哔哔声或发出声音警报。
                  512 : 对应WOSA定义WFS_PTR_CTRLATPFORWARD，按上述要求打印数据，然后向前翻一页。
                  1024 : 对应WOSA定义WFS_PTR_CTRLATPBACKWARD，按上述要求打印数据，然后向后翻一页。
                  2048 : 对应WOSA定义WFS_PTR_CTRLTURNMEDIA，按上述要求打印数据，然后插入媒介。
                  4096 : 对应WOSA定义WFS_PTR_CTRLSTAMP，按上述要求打印数据，然后在插入的媒介上压印。
                  8192 : 对应WOSA定义WFS_PTR_CTRLPARK，将媒介放入纸盒。
                  16384 : 对应WOSA定义WFS_PTR_CTRLEXPEL，按上述要求打印数据，然后将媒介从出口吐出来。
                  32768 : 对应WOSA定义WFS_PTR_CTRLEJECTTOTRANSPORT，按上述要求打印数据，然后将媒介移到出 口正后面的通道上的某个位置
               */

            }, {
              key: "ControlMedia",
              value: function ControlMedia(paperNum, mediaCtrol) {
                if (0 == paperNum) {
                  this.execute('ControlMedia', '{"mediaCtrol":' + 0x20 + '}');
                  return;
                }

                if (1 == mediaCtrol) {
                  this.controlGuideLight(8);
                  var param = {
                    "prtData": 'WaitNum=' + paperNum + ';'
                  };
                  this.getInfo('SetRawData', param);
                  var ctrlParam = {
                    "mediaCtrol": mediaCtrol
                  };
                  this.execute('ControlMedia', ctrlParam);
                } else {
                  if (32 == mediaCtrol) {
                    this.controlGuideLight(1);
                  }

                  var _param2 = {
                    "mediaCtrol": mediaCtrol
                  };
                  this.execute('ControlMedia', _param2);
                }
              }
              /**
               * 异步打印文件
               * @param FileName 文件名
               */

            }, {
              key: "PrintRawFile",
              value: function PrintRawFile(FileName) {
                return this.execute('PrintRawFile', {
                  FileName: FileName
                });
              }
              /**
               * 异步打印数据
               * @param prtData 打印内容
               */

            }, {
              key: "PrintText",
              value: function PrintText(prtData) {
                this.controlGuideLight(this.siuSpeed);
                return this.execute('PrintText', {
                  prtData: prtData
                });
              }
              /**
               * 同步打印数据
               * @param prtData 打印内容
               */

            }, {
              key: "PrintTextSync",
              value: function PrintTextSync(prtData) {
                return this.getInfo('PrintTextSync', {
                  prtData: prtData
                });
              }
              /**
               * 同步取消所有异步请求
               */

            }, {
              key: "CancelWait",
              value: function CancelWait() {
                return this.getInfo('CancelWait', {});
              }
              /**
               * 同步取消所有异步请求
               */

            }, {
              key: "CancelAsyncRequest",
              value: function CancelAsyncRequest() {
                return this.getInfo('CancelAsyncRequest', {});
              }
              /**
               * 获取PTR状态 ，异步接口
               * @preturns 触发GetStatusOver
               */

            }, {
              key: "GetStatus",
              value: function GetStatus() {
                return this.execute('GetStatus', {});
              }
              /**
               * 获取PTR能力，异步接口
               */

            }, {
              key: "GetCapabilities",
              value: function GetCapabilities() {
                return this.execute('GetCapabilities', {});
              }
            }]);

            return CLaserPrinter;
          }(_basedev__WEBPACK_IMPORTED_MODULE_8__[ /* default */ "a"]);

        /* harmony default export */
        __webpack_exports__["a"] = (CLaserPrinter);

        /***/
      }),

    /***/
    "86cc":
      /***/
      (function (module, exports, __webpack_require__) {

        var anObject = __webpack_require__("cb7c");
        var IE8_DOM_DEFINE = __webpack_require__("c69a");
        var toPrimitive = __webpack_require__("6a99");
        var dP = Object.defineProperty;

        exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
          anObject(O);
          P = toPrimitive(P, true);
          anObject(Attributes);
          if (IE8_DOM_DEFINE) try {
            return dP(O, P, Attributes);
          } catch (e) {
            /* empty */
          }
          if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
          if ('value' in Attributes) O[P] = Attributes.value;
          return O;
        };


        /***/
      }),

    /***/
    "8a22":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* WEBPACK VAR INJECTION */
        (function (module) {
          /* unused harmony export QWebChannel */
          /* harmony import */
          var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ac6a");
          /* harmony import */
          var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_0__);
          /* harmony import */
          var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7f7f");
          /* harmony import */
          var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_1__);
          /* harmony import */
          var core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c5f6");
          /* harmony import */
          var core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_2__);
          /* harmony import */
          var E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("7618");





          /****************************************************************************
           **
           ** Copyright (C) 2016 The Qt Company Ltd.
           ** Copyright (C) 2016 Klarälvdalens Datakonsult AB, a KDAB Group company, info@kdab.com, author Milian Wolff <milian.wolff@kdab.com>
           ** Contact: https://www.qt.io/licensing/
           **
           ** This file is part of the QtWebChannel module of the Qt Toolkit.
           **
           ** $QT_BEGIN_LICENSE:LGPL$
           ** Commercial License Usage
           ** Licensees holding valid commercial Qt licenses may use this file in
           ** accordance with the commercial license agreement provided with the
           ** Software or, alternatively, in accordance with the terms contained in
           ** a written agreement between you and The Qt Company. For licensing terms
           ** and conditions see https://www.qt.io/terms-conditions. For further
           ** information use the contact form at https://www.qt.io/contact-us.
           **
           ** GNU Lesser General Public License Usage
           ** Alternatively, this file may be used under the terms of the GNU Lesser
           ** General Public License version 3 as published by the Free Software
           ** Foundation and appearing in the file LICENSE.LGPL3 included in the
           ** packaging of this file. Please review the following information to
           ** ensure the GNU Lesser General Public License version 3 requirements
           ** will be met: https://www.gnu.org/licenses/lgpl-3.0.html.
           **
           ** GNU General Public License Usage
           ** Alternatively, this file may be used under the terms of the GNU
           ** General Public License version 2.0 or (at your option) the GNU General
           ** Public license version 3 or any later version approved by the KDE Free
           ** Qt Foundation. The licenses are as published by the Free Software
           ** Foundation and appearing in the file LICENSE.GPL2 and LICENSE.GPL3
           ** included in the packaging of this file. Please review the following
           ** information to ensure the GNU General Public License requirements will
           ** be met: https://www.gnu.org/licenses/gpl-2.0.html and
           ** https://www.gnu.org/licenses/gpl-3.0.html.
           **
           ** $QT_END_LICENSE$
           **
           ****************************************************************************/
          var QWebChannelMessageTypes = {
            signal: 1,
            propertyUpdate: 2,
            init: 3,
            idle: 4,
            debug: 5,
            invokeMethod: 6,
            connectToSignal: 7,
            disconnectFromSignal: 8,
            setProperty: 9,
            response: 10
          };

          var QWebChannel = function QWebChannel(transport, initCallback) {
            if (Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"])(transport) !== "object" || typeof transport.send !== "function") {
              console.error("The QWebChannel expects a transport object with a send function and onmessage callback property." + " Given is: transport: " + Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"])(transport) + ", transport.send: " + Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"])(transport.send));
              return;
            }

            var channel = this;
            this.transport = transport;

            this.send = function (data) {
              if (typeof data !== "string") {
                data = JSON.stringify(data);
              }

              channel.transport.send(data);
            };

            this.transport.onmessage = function (message) {
              var data = message.data;

              if (typeof data === "string") {
                data = JSON.parse(data);
              }

              switch (data.type) {
                case QWebChannelMessageTypes.signal:
                  channel.handleSignal(data);
                  break;

                case QWebChannelMessageTypes.response:
                  channel.handleResponse(data);
                  break;

                case QWebChannelMessageTypes.propertyUpdate:
                  channel.handlePropertyUpdate(data);
                  break;

                default:
                  console.error("invalid message received:", message.data);
                  break;
              }
            };

            this.execCallbacks = {};
            this.execId = 0;

            this.exec = function (data, callback) {
              if (!callback) {
                // if no callback is given, send directly
                channel.send(data);
                return;
              }

              if (channel.execId === Number.MAX_VALUE) {
                // wrap
                channel.execId = Number.MIN_VALUE;
              }

              if (data.hasOwnProperty("id")) {
                console.error("Cannot exec message with property id: " + JSON.stringify(data));
                return;
              }

              data.id = channel.execId++;
              channel.execCallbacks[data.id] = callback;
              channel.send(data);
            };

            this.objects = {};

            this.handleSignal = function (message) {
              var object = channel.objects[message.object];

              if (object) {
                object.signalEmitted(message.signal, message.args);
              } else {
                console.warn("Unhandled signal: " + message.object + "::" + message.signal);
              }
            };

            this.handleResponse = function (message) {
              if (!message.hasOwnProperty("id")) {
                console.error("Invalid response message received: ", JSON.stringify(message));
                return;
              }

              channel.execCallbacks[message.id](message.data);
              delete channel.execCallbacks[message.id];
            };

            this.handlePropertyUpdate = function (message) {
              for (var i in message.data) {
                var data = message.data[i];
                var object = channel.objects[data.object];

                if (object) {
                  object.propertyUpdate(data.signals, data.properties);
                } else {
                  console.warn("Unhandled property update: " + data.object + "::" + data.signal);
                }
              }

              channel.exec({
                type: QWebChannelMessageTypes.idle
              });
            };

            this.debug = function (message) {
              channel.send({
                type: QWebChannelMessageTypes.debug,
                data: message
              });
            };

            channel.exec({
              type: QWebChannelMessageTypes.init
            }, function (data) {
              for (var objectName in data) {
                var object = new QObject(objectName, data[objectName], channel);
              } // now unwrap properties, which might reference other registered objects


              for (var _objectName in channel.objects) {
                channel.objects[_objectName].unwrapProperties();
              }

              if (initCallback) {
                initCallback(channel);
              }

              channel.exec({
                type: QWebChannelMessageTypes.idle
              });
            });
          };

          function QObject(name, data, webChannel) {
            this.__id__ = name;
            webChannel.objects[name] = this; // List of callbacks that get invoked upon signal emission

            this.__objectSignals__ = {}; // Cache of all properties, updated when a notify signal is emitted

            this.__propertyCache__ = {};
            var object = this; // ----------------------------------------------------------------------

            this.unwrapQObject = function (response) {
              if (response instanceof Array) {
                // support list of objects
                var ret = new Array(response.length);

                for (var i = 0; i < response.length; ++i) {
                  ret[i] = object.unwrapQObject(response[i]);
                }

                return ret;
              }

              if (!response || !response["__QObject*__"] || response.id === undefined) {
                return response;
              }

              var objectId = response.id;
              if (webChannel.objects[objectId]) return webChannel.objects[objectId];

              if (!response.data) {
                console.error("Cannot unwrap unknown QObject " + objectId + " without data.");
                return;
              }

              var qObject = new QObject(objectId, response.data, webChannel);
              qObject.destroyed.connect(function () {
                if (webChannel.objects[objectId] === qObject) {
                  delete webChannel.objects[objectId]; // reset the now deleted QObject to an empty {} object
                  // just assigning {} though would not have the desired effect, but the
                  // below also ensures all external references will see the empty map
                  // NOTE: this detour is necessary to workaround QTBUG-40021

                  var propertyNames = [];

                  for (var propertyName in qObject) {
                    propertyNames.push(propertyName);
                  }

                  for (var idx in propertyNames) {
                    delete qObject[propertyNames[idx]];
                  }
                }
              }); // here we are already initialized, and thus must directly unwrap the properties

              qObject.unwrapProperties();
              return qObject;
            };

            this.unwrapProperties = function () {
              for (var propertyIdx in object.__propertyCache__) {
                object.__propertyCache__[propertyIdx] = object.unwrapQObject(object.__propertyCache__[propertyIdx]);
              }
            };

            function addSignal(signalData, isPropertyNotifySignal) {
              var signalName = signalData[0];
              var signalIndex = signalData[1];
              object[signalName] = {
                connect: function connect(callback) {
                  if (typeof callback !== "function") {
                    console.error("Bad callback given to connect to signal " + signalName);
                    return;
                  }

                  object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || [];

                  object.__objectSignals__[signalIndex].push(callback);

                  if (!isPropertyNotifySignal && signalName !== "destroyed") {
                    // only required for "pure" signals, handled separately for properties in propertyUpdate
                    // also note that we always get notified about the destroyed signal
                    webChannel.exec({
                      type: QWebChannelMessageTypes.connectToSignal,
                      object: object.__id__,
                      signal: signalIndex
                    });
                  }
                },
                disconnect: function disconnect(callback) {
                  if (typeof callback !== "function") {
                    console.error("Bad callback given to disconnect from signal " + signalName);
                    return;
                  }

                  object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || [];

                  var idx = object.__objectSignals__[signalIndex].indexOf(callback);

                  if (idx === -1) {
                    console.error("Cannot find connection of signal " + signalName + " to " + callback.name);
                    return;
                  }

                  object.__objectSignals__[signalIndex].splice(idx, 1);

                  if (!isPropertyNotifySignal && object.__objectSignals__[signalIndex].length === 0) {
                    // only required for "pure" signals, handled separately for properties in propertyUpdate
                    webChannel.exec({
                      type: QWebChannelMessageTypes.disconnectFromSignal,
                      object: object.__id__,
                      signal: signalIndex
                    });
                  }
                }
              };
            }
            /**
             * Invokes all callbacks for the given signalname. Also works for property notify callbacks.
             */


            function invokeSignalCallbacks(signalName, signalArgs) {
              var connections = object.__objectSignals__[signalName];

              if (connections) {
                connections.forEach(function (callback) {
                  callback.apply(callback, signalArgs);
                });
              }
            }

            this.propertyUpdate = function (signals, propertyMap) {
              // update property cache
              for (var propertyIndex in propertyMap) {
                var propertyValue = propertyMap[propertyIndex];
                object.__propertyCache__[propertyIndex] = propertyValue;
              }

              for (var signalName in signals) {
                // Invoke all callbacks, as signalEmitted() does not. This ensures the
                // property cache is updated before the callbacks are invoked.
                invokeSignalCallbacks(signalName, signals[signalName]);
              }
            };

            this.signalEmitted = function (signalName, signalArgs) {
              invokeSignalCallbacks(signalName, this.unwrapQObject(signalArgs));
            };

            function addMethod(methodData) {
              var methodName = methodData[0];
              var methodIdx = methodData[1];

              object[methodName] = function () {
                var args = [];
                var callback;

                for (var i = 0; i < arguments.length; ++i) {
                  var argument = arguments[i];
                  if (typeof argument === "function") callback = argument;
                  else if (argument instanceof QObject && webChannel.objects[argument.__id__] !== undefined) args.push({
                    "id": argument.__id__
                  });
                  else args.push(argument);
                }

                webChannel.exec({
                  "type": QWebChannelMessageTypes.invokeMethod,
                  "object": object.__id__,
                  "method": methodIdx,
                  "args": args
                }, function (response) {
                  if (response !== undefined) {
                    var result = object.unwrapQObject(response);

                    if (callback) {
                      callback(result);
                    }
                  }
                });
              };
            }

            function bindGetterSetter(propertyInfo) {
              var propertyIndex = propertyInfo[0];
              var propertyName = propertyInfo[1];
              var notifySignalData = propertyInfo[2]; // initialize property cache with current value
              // NOTE: if this is an object, it is not directly unwrapped as it might
              // reference other QObject that we do not know yet

              object.__propertyCache__[propertyIndex] = propertyInfo[3];

              if (notifySignalData) {
                if (notifySignalData[0] === 1) {
                  // signal name is optimized away, reconstruct the actual name
                  notifySignalData[0] = propertyName + "Changed";
                }

                addSignal(notifySignalData, true);
              }

              Object.defineProperty(object, propertyName, {
                configurable: true,
                get: function get() {
                  var propertyValue = object.__propertyCache__[propertyIndex];

                  if (propertyValue === undefined) {
                    // This shouldn't happen
                    console.warn("Undefined value in property cache for property \"" + propertyName + "\" in object " + object.__id__);
                  }

                  return propertyValue;
                },
                set: function set(value) {
                  if (value === undefined) {
                    console.warn("Property setter for " + propertyName + " called with undefined value!");
                    return;
                  }

                  object.__propertyCache__[propertyIndex] = value;
                  var valueToSend = value;
                  if (valueToSend instanceof QObject && webChannel.objects[valueToSend.__id__] !== undefined) valueToSend = {
                    "id": valueToSend.__id__
                  };
                  webChannel.exec({
                    "type": QWebChannelMessageTypes.setProperty,
                    "object": object.__id__,
                    "property": propertyIndex,
                    "value": valueToSend
                  });
                }
              });
            } // ----------------------------------------------------------------------


            data.methods.forEach(addMethod);
            data.properties.forEach(bindGetterSetter);
            data.signals.forEach(function (signal) {
              addSignal(signal, false);
            });

            for (var _name in data.enums) {
              object[_name] = data.enums[_name];
            }
          } //required for use with nodejs


          if ((false ? undefined : Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_3__[ /* default */ "a"])(module)) === 'object') { // module.exports = {
            //     QWebChannel: QWebChannel
            // };
          }

          // (function (root, factory) {
          //     if (typeof define === 'function' && define.amd) {
          //         // AMD
          //         define([], factory);
          //     } else if (typeof exports === 'object') {
          //         // Node, CommonJS-like
          //         module.exports = factory(require());
          //     } else {
          //         // Browser globals (root is window)
          //         root.returnExports = factory();
          //     }
          //     }(this, function () {
          //         return QWebChannel;
          //     })
          // );

          /* harmony default export */
          __webpack_exports__["a"] = (QWebChannel);
          /* WEBPACK VAR INJECTION */
        }.call(this, __webpack_require__("dd40")(module)))

        /***/
      }),

    /***/
    "8b97":
      /***/
      (function (module, exports, __webpack_require__) {

        // Works with __proto__ only. Old v8 can't work with null proto objects.
        /* eslint-disable no-proto */
        var isObject = __webpack_require__("d3f4");
        var anObject = __webpack_require__("cb7c");
        var check = function (O, proto) {
          anObject(O);
          if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
        };
        module.exports = {
          set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
            function (test, buggy, set) {
              try {
                set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
                set(test, []);
                buggy = !(test instanceof Array);
              } catch (e) {
                buggy = true;
              }
              return function setPrototypeOf(O, proto) {
                check(O, proto);
                if (buggy) O.__proto__ = proto;
                else set(O, proto);
                return O;
              };
            }({}, false) : undefined),
          check: check
        };


        /***/
      }),

    /***/
    "8bab":
      /***/
      (function (module, exports, __webpack_require__) {

        // fallback for non-array-like ES3 and non-enumerable old V8 strings
        var cof = __webpack_require__("6e1f");
        // eslint-disable-next-line no-prototype-builtins
        module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
          return cof(it) == 'String' ? it.split('') : Object(it);
        };


        /***/
      }),

    /***/
    "8ce0":
      /***/
      (function (module, exports, __webpack_require__) {

        var dP = __webpack_require__("3adc");
        var createDesc = __webpack_require__("f845");
        module.exports = __webpack_require__("7d95") ? function (object, key, value) {
          return dP.f(object, key, createDesc(1, value));
        } : function (object, key, value) {
          object[key] = value;
          return object;
        };


        /***/
      }),

    /***/
    "9050":
      /***/
      (function (module, exports) {

        var gwi = window.gwi || {};
        gwi.crytper = {
          getInstance: function getInstance(successCallBack, errorCallback, provider, bSync) {
            return this.exec(successCallBack, errorCallback, "GWICrypter", "getInstance", {
              "provider": provider
            }, bSync);
          },

          /**
           * 设置密钥
           */
          setKey: function setKey(successCallBack, errorCallback, key, bSync) {
            return this.exec(successCallBack, errorCallback, "GWICrypter", "setKey", {
              "key": key
            }, bSync);
          },
          getKey: function getKey(successCallBack, errorCallback, content, bSync) {
            return this.exec(successCallBack, errorCallback, "GWICrypter", "getKey", {
              "content": content
            }, bSync);
          },

          /**
           * 加密
           */
          encrypt: function encrypt(successCallBack, errorCallback, data, bSync) {
            return this.exec(successCallBack, errorCallback, "GWICrypter", "encrypt", {
              "data": data
            }, bSync);
          },

          /**
           * 解密
           */
          decrypt: function decrypt(successCallBack, errorCallback, data, bSync) {
            return this.exec(successCallBack, errorCallback, "GWICrypter", "decrypt", {
              "data": data
            }, bSync);
          },

          /**
           * 密码软加密
           */
          encryptPIN: function encryptPIN(successCallBack, errorCallback, cardno, pin, bSync) {
            return this.exec(successCallBack, errorCallback, "GWICrypter", "encryptPIN", {
              "cardno": cardno,
              "pin": pin
            }, bSync);
          },

          /**
           * 异或
           */
          XOR: function XOR(successCallBack, errorCallback, source1, source2, bSync) {
            return this.exec(successCallBack, errorCallback, "GWICrypter", "XOR", {
              "source1": source1,
              "source2": source2
            }, bSync);
          },

          /**
           * Function: getSTDMac
           * 得到通信STAND 方式MAC值,算法：
           * 首先将Buff数据分成若干个64位的数据段，最后一个数据段(N) 不足64位的
           * 在后面加零补够64位。然后计算MAC=DES(MAC_KEY，…… DES(MacKey,
           * DES(MacKey,DES(MacKey，数据段1) XOR 数据段2)XOR 数据段3)…… 数据段N)
           * 如果MacKey值为NULL，则不做DES，只异或，此时与GetBPIMac函数结果相同
           * In Parameter: Buff byte[Buflen] 需做MAC的包文
           * Buflen int 做MAC包文的长度(不含MAC),
           * MacKey byte[8] key used for mac
           * Out Parameter: Mac byte[8] Mac value
           */
          getSTDMac: function getSTDMac(successCallBack, errorCallback, data, mackey, bSync) {
            return this.exec(successCallBack, errorCallback, "GWICrypter", "getSTDMac", {
              "data": data,
              "mackey": mackey
            }, bSync);
          },

          /**
           * Function: getBPIMac
           * 得到通信BPI 方式MAC值,算法：
           * 首先将Buff数据分成若干个64位的数据段，最后一个数据段(N)
           * 不足64位的在后面加零补够64位。然后计算MAC=DES(MacKey，
           * (((数据段1 XOR 数据段2)XOR 数据段3)…… 数据段N))
           * 如果MacKey值为NULL，则不做DES，只异或，此时与GetSTDMac函数结果相同
           * In Parameter: Buff byte[Buflen] 需做MAC的包文
           * Buflen int 做MAC包文的长度(不含MAC),
           * MacKey byte[8] key used for mac
           * Out Parameter: Mac byte[8] Mac value
           */
          getBPIMac: function getBPIMac(successCallBack, errorCallback, data, mackey, bSync) {
            return this.exec(successCallBack, errorCallback, "GWICrypter", "getBPIMac", {
              "data": data,
              "mackey": mackey
            }, bSync);
          },
          getEncTrack: function getEncTrack(successCallBack, errorCallback, track, devId, mackey, bSync) {
            return this.exec(successCallBack, errorCallback, "GWICrypter", "getEncTrack", {
              "track": track,
              "devId": devId,
              "mackey": mackey
            }, bSync);
          },
          getMacBy3DES: function getMacBy3DES(successCallBack, errorCallback, data, mackey, bSync) {
            return this.exec(successCallBack, errorCallback, "GWICrypter", "getMacBy3DES", {
              "data": data,
              "mackey": mackey
            }, bSync);
          },
          exec: function exec(successCallBack, errorCallback, obj, method, parameter, bSync) {
            return Cordova.exec(successCallBack, errorCallback, "GWICrypter", "execute", [obj, method, parameter], bSync);
          }
        };

        /***/
      }),

    /***/
    "9093":
      /***/
      (function (module, exports, __webpack_require__) {

        // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
        var $keys = __webpack_require__("ce10");
        var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

        exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
          return $keys(O, hiddenKeys);
        };


        /***/
      }),

    /***/
    "93c4":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var $at = __webpack_require__("2a4e")(true);

        // 21.1.3.27 String.prototype[@@iterator]()
        __webpack_require__("e4a9")(String, 'String', function (iterated) {
          this._t = String(iterated); // target
          this._i = 0; // next index
          // 21.1.5.2.1 %StringIteratorPrototype%.next()
        }, function () {
          var O = this._t;
          var index = this._i;
          var point;
          if (index >= O.length) return {
            value: undefined,
            done: true
          };
          point = $at(O, index);
          this._i += point.length;
          return {
            value: point,
            done: false
          };
        });


        /***/
      }),

    /***/
    "990b":
      /***/
      (function (module, exports, __webpack_require__) {

        // all object keys, includes non-enumerable and symbols
        var gOPN = __webpack_require__("9093");
        var gOPS = __webpack_require__("2621");
        var anObject = __webpack_require__("cb7c");
        var Reflect = __webpack_require__("7726").Reflect;
        module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
          var keys = gOPN.f(anObject(it));
          var getSymbols = gOPS.f;
          return getSymbols ? keys.concat(getSymbols(it)) : keys;
        };


        /***/
      }),

    /***/
    "9b43":
      /***/
      (function (module, exports, __webpack_require__) {

        // optional / simple context binding
        var aFunction = __webpack_require__("d8e8");
        module.exports = function (fn, that, length) {
          aFunction(fn);
          if (that === undefined) return fn;
          switch (length) {
            case 1:
              return function (a) {
                return fn.call(that, a);
              };
            case 2:
              return function (a, b) {
                return fn.call(that, a, b);
              };
            case 3:
              return function (a, b, c) {
                return fn.call(that, a, b, c);
              };
          }
          return function ( /* ...args */ ) {
            return fn.apply(that, arguments);
          };
        };


        /***/
      }),

    /***/
    "9c6c":
      /***/
      (function (module, exports, __webpack_require__) {

        // 22.1.3.31 Array.prototype[@@unscopables]
        var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
        var ArrayProto = Array.prototype;
        if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
        module.exports = function (key) {
          ArrayProto[UNSCOPABLES][key] = true;
        };


        /***/
      }),

    /***/
    "9c80":
      /***/
      (function (module, exports) {

        module.exports = function (exec) {
          try {
            return {
              e: false,
              v: exec()
            };
          } catch (e) {
            return {
              e: true,
              v: e
            };
          }
        };


        /***/
      }),

    /***/
    "9def":
      /***/
      (function (module, exports, __webpack_require__) {

        // 7.1.15 ToLength
        var toInteger = __webpack_require__("4588");
        var min = Math.min;
        module.exports = function (it) {
          return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
        };


        /***/
      }),

    /***/
    "9e1e":
      /***/
      (function (module, exports, __webpack_require__) {

        // Thank's IE8 for his funny defineProperty
        module.exports = !__webpack_require__("79e5")(function () {
          return Object.defineProperty({}, 'a', {
            get: function () {
              return 7;
            }
          }).a != 7;
        });


        /***/
      }),

    /***/
    "a25f":
      /***/
      (function (module, exports, __webpack_require__) {

        var global = __webpack_require__("7726");
        var navigator = global.navigator;

        module.exports = navigator && navigator.userAgent || '';


        /***/
      }),

    /***/
    "a438":
      /***/
      (function (module, exports, __webpack_require__) {

        __webpack_require__("07c8");
        module.exports = __webpack_require__("a7d3").Object.setPrototypeOf;


        /***/
      }),

    /***/
    "a47f":
      /***/
      (function (module, exports, __webpack_require__) {

        module.exports = !__webpack_require__("7d95") && !__webpack_require__("d782")(function () {
          return Object.defineProperty(__webpack_require__("12fd")('div'), 'a', {
            get: function () {
              return 7;
            }
          }).a != 7;
        });


        /***/
      }),

    /***/
    "a481":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";


        var anObject = __webpack_require__("cb7c");
        var toObject = __webpack_require__("4bf8");
        var toLength = __webpack_require__("9def");
        var toInteger = __webpack_require__("4588");
        var advanceStringIndex = __webpack_require__("0390");
        var regExpExec = __webpack_require__("5f1b");
        var max = Math.max;
        var min = Math.min;
        var floor = Math.floor;
        var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
        var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

        var maybeToString = function (it) {
          return it === undefined ? it : String(it);
        };

        // @@replace logic
        __webpack_require__("214f")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
          return [
            // `String.prototype.replace` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.replace
            function replace(searchValue, replaceValue) {
              var O = defined(this);
              var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
              return fn !== undefined ?
                fn.call(searchValue, O, replaceValue) :
                $replace.call(String(O), searchValue, replaceValue);
            },
            // `RegExp.prototype[@@replace]` method
            // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
            function (regexp, replaceValue) {
              var res = maybeCallNative($replace, regexp, this, replaceValue);
              if (res.done) return res.value;

              var rx = anObject(regexp);
              var S = String(this);
              var functionalReplace = typeof replaceValue === 'function';
              if (!functionalReplace) replaceValue = String(replaceValue);
              var global = rx.global;
              if (global) {
                var fullUnicode = rx.unicode;
                rx.lastIndex = 0;
              }
              var results = [];
              while (true) {
                var result = regExpExec(rx, S);
                if (result === null) break;
                results.push(result);
                if (!global) break;
                var matchStr = String(result[0]);
                if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
              }
              var accumulatedResult = '';
              var nextSourcePosition = 0;
              for (var i = 0; i < results.length; i++) {
                result = results[i];
                var matched = String(result[0]);
                var position = max(min(toInteger(result.index), S.length), 0);
                var captures = [];
                // NOTE: This is equivalent to
                //   captures = result.slice(1).map(maybeToString)
                // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
                // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
                // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
                for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
                var namedCaptures = result.groups;
                if (functionalReplace) {
                  var replacerArgs = [matched].concat(captures, position, S);
                  if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
                  var replacement = String(replaceValue.apply(undefined, replacerArgs));
                } else {
                  replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
                }
                if (position >= nextSourcePosition) {
                  accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
                  nextSourcePosition = position + matched.length;
                }
              }
              return accumulatedResult + S.slice(nextSourcePosition);
            }
          ];

          // https://tc39.github.io/ecma262/#sec-getsubstitution
          function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
            var tailPos = position + matched.length;
            var m = captures.length;
            var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
            if (namedCaptures !== undefined) {
              namedCaptures = toObject(namedCaptures);
              symbols = SUBSTITUTION_SYMBOLS;
            }
            return $replace.call(replacement, symbols, function (match, ch) {
              var capture;
              switch (ch.charAt(0)) {
                case '$':
                  return '$';
                case '&':
                  return matched;
                case '`':
                  return str.slice(0, position);
                case "'":
                  return str.slice(tailPos);
                case '<':
                  capture = namedCaptures[ch.slice(1, -1)];
                  break;
                default: // \d\d?
                  var n = +ch;
                  if (n === 0) return match;
                  if (n > m) {
                    var f = floor(n / 10);
                    if (f === 0) return match;
                    if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
                    return match;
                  }
                  capture = captures[n - 1];
              }
              return capture === undefined ? '' : capture;
            });
          }
        });


        /***/
      }),

    /***/
    "a5ab":
      /***/
      (function (module, exports, __webpack_require__) {

        // 7.1.15 ToLength
        var toInteger = __webpack_require__("a812");
        var min = Math.min;
        module.exports = function (it) {
          return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
        };


        /***/
      }),

    /***/
    "a5b8":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        // 25.4.1.5 NewPromiseCapability(C)
        var aFunction = __webpack_require__("d8e8");

        function PromiseCapability(C) {
          var resolve, reject;
          this.promise = new C(function ($$resolve, $$reject) {
            if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
            resolve = $$resolve;
            reject = $$reject;
          });
          this.resolve = aFunction(resolve);
          this.reject = aFunction(reject);
        }

        module.exports.f = function (C) {
          return new PromiseCapability(C);
        };


        /***/
      }),

    /***/
    "a7d3":
      /***/
      (function (module, exports) {

        var core = module.exports = {
          version: '2.6.9'
        };
        if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


        /***/
      }),

    /***/
    "a812":
      /***/
      (function (module, exports) {

        // 7.1.4 ToInteger
        var ceil = Math.ceil;
        var floor = Math.floor;
        module.exports = function (it) {
          return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
        };


        /***/
      }),

    /***/
    "aa77":
      /***/
      (function (module, exports, __webpack_require__) {

        var $export = __webpack_require__("5ca1");
        var defined = __webpack_require__("be13");
        var fails = __webpack_require__("79e5");
        var spaces = __webpack_require__("fdef");
        var space = '[' + spaces + ']';
        var non = '\u200b\u0085';
        var ltrim = RegExp('^' + space + space + '*');
        var rtrim = RegExp(space + space + '*$');

        var exporter = function (KEY, exec, ALIAS) {
          var exp = {};
          var FORCE = fails(function () {
            return !!spaces[KEY]() || non[KEY]() != non;
          });
          var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
          if (ALIAS) exp[ALIAS] = fn;
          $export($export.P + $export.F * FORCE, 'String', exp);
        };

        // 1 -> String#trimLeft
        // 2 -> String#trimRight
        // 3 -> String#trim
        var trim = exporter.trim = function (string, TYPE) {
          string = String(defined(string));
          if (TYPE & 1) string = string.replace(ltrim, '');
          if (TYPE & 2) string = string.replace(rtrim, '');
          return string;
        };

        module.exports = exporter;


        /***/
      }),

    /***/
    "aae3":
      /***/
      (function (module, exports, __webpack_require__) {

        // 7.2.8 IsRegExp(argument)
        var isObject = __webpack_require__("d3f4");
        var cof = __webpack_require__("2d95");
        var MATCH = __webpack_require__("2b4c")('match');
        module.exports = function (it) {
          var isRegExp;
          return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
        };


        /***/
      }),

    /***/
    "ac6a":
      /***/
      (function (module, exports, __webpack_require__) {

        var $iterators = __webpack_require__("cadf");
        var getKeys = __webpack_require__("0d58");
        var redefine = __webpack_require__("2aba");
        var global = __webpack_require__("7726");
        var hide = __webpack_require__("32e9");
        var Iterators = __webpack_require__("84f2");
        var wks = __webpack_require__("2b4c");
        var ITERATOR = wks('iterator');
        var TO_STRING_TAG = wks('toStringTag');
        var ArrayValues = Iterators.Array;

        var DOMIterables = {
          CSSRuleList: true, // TODO: Not spec compliant, should be false.
          CSSStyleDeclaration: false,
          CSSValueList: false,
          ClientRectList: false,
          DOMRectList: false,
          DOMStringList: false,
          DOMTokenList: true,
          DataTransferItemList: false,
          FileList: false,
          HTMLAllCollection: false,
          HTMLCollection: false,
          HTMLFormElement: false,
          HTMLSelectElement: false,
          MediaList: true, // TODO: Not spec compliant, should be false.
          MimeTypeArray: false,
          NamedNodeMap: false,
          NodeList: true,
          PaintRequestList: false,
          Plugin: false,
          PluginArray: false,
          SVGLengthList: false,
          SVGNumberList: false,
          SVGPathSegList: false,
          SVGPointList: false,
          SVGStringList: false,
          SVGTransformList: false,
          SourceBufferList: false,
          StyleSheetList: true, // TODO: Not spec compliant, should be false.
          TextTrackCueList: false,
          TextTrackList: false,
          TouchList: false
        };

        for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
          var NAME = collections[i];
          var explicit = DOMIterables[NAME];
          var Collection = global[NAME];
          var proto = Collection && Collection.prototype;
          var key;
          if (proto) {
            if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
            if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
            Iterators[NAME] = ArrayValues;
            if (explicit)
              for (key in $iterators)
                if (!proto[key]) redefine(proto, key, $iterators[key], true);
          }
        }


        /***/
      }),

    /***/
    "af7e":
      /***/
      (function (module, exports, __webpack_require__) {

        __webpack_require__("50e9");
        var $Object = __webpack_require__("a7d3").Object;
        module.exports = function create(P, D) {
          return $Object.create(P, D);
        };


        /***/
      }),

    /***/
    "b0b4":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function () {
          return _createClass;
        });
        /* harmony import */
        var _core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("85f2");
        /* harmony import */
        var _core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0__);


        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;

            _core_js_object_define_property__WEBPACK_IMPORTED_MODULE_0___default()(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        /***/
      }),

    /***/
    "b0c5":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var regexpExec = __webpack_require__("520a");
        __webpack_require__("5ca1")({
          target: 'RegExp',
          proto: true,
          forced: regexpExec !== /./.exec
        }, {
          exec: regexpExec
        });


        /***/
      }),

    /***/
    "b22a":
      /***/
      (function (module, exports) {

        module.exports = {};


        /***/
      }),

    /***/
    "b258":
      /***/
      (function (module, exports, __webpack_require__) {

        __webpack_require__("d256");
        __webpack_require__("12fd9");
        __webpack_require__("d127");
        __webpack_require__("d24f");
        module.exports = __webpack_require__("a7d3").Symbol;


        /***/
      }),

    /***/
    "b3e7":
      /***/
      (function (module, exports) {

        module.exports = function () {
          /* empty */
        };


        /***/
      }),

    /***/
    "b42c":
      /***/
      (function (module, exports, __webpack_require__) {

        __webpack_require__("fa54");
        var global = __webpack_require__("da3c");
        var hide = __webpack_require__("8ce0");
        var Iterators = __webpack_require__("b22a");
        var TO_STRING_TAG = __webpack_require__("1b55")('toStringTag');

        var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
          'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
          'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
          'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
          'TextTrackList,TouchList').split(',');

        for (var i = 0; i < DOMIterables.length; i++) {
          var NAME = DOMIterables[i];
          var Collection = global[NAME];
          var proto = Collection && Collection.prototype;
          if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
          Iterators[NAME] = Iterators.Array;
        }


        /***/
      }),

    /***/
    "b457":
      /***/
      (function (module, exports) {

        module.exports = true;


        /***/
      }),

    /***/
    "b5aa":
      /***/
      (function (module, exports, __webpack_require__) {

        // 7.2.2 IsArray(argument)
        var cof = __webpack_require__("6e1f");
        module.exports = Array.isArray || function isArray(arg) {
          return cof(arg) == 'Array';
        };


        /***/
      }),

    /***/
    "bc25":
      /***/
      (function (module, exports, __webpack_require__) {

        // optional / simple context binding
        var aFunction = __webpack_require__("f2fe");
        module.exports = function (fn, that, length) {
          aFunction(fn);
          if (that === undefined) return fn;
          switch (length) {
            case 1:
              return function (a) {
                return fn.call(that, a);
              };
            case 2:
              return function (a, b) {
                return fn.call(that, a, b);
              };
            case 3:
              return function (a, b, c) {
                return fn.call(that, a, b, c);
              };
          }
          return function ( /* ...args */ ) {
            return fn.apply(that, arguments);
          };
        };


        /***/
      }),

    /***/
    "bcaa":
      /***/
      (function (module, exports, __webpack_require__) {

        var anObject = __webpack_require__("cb7c");
        var isObject = __webpack_require__("d3f4");
        var newPromiseCapability = __webpack_require__("a5b8");

        module.exports = function (C, x) {
          anObject(C);
          if (isObject(x) && x.constructor === C) return x;
          var promiseCapability = newPromiseCapability.f(C);
          var resolve = promiseCapability.resolve;
          resolve(x);
          return promiseCapability.promise;
        };


        /***/
      }),

    /***/
    "bd26":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */
        var core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c5f6");
        /* harmony import */
        var core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */
        var core_js_modules_es6_regexp_split__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("28a5");
        /* harmony import */
        var core_js_modules_es6_regexp_split__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_regexp_split__WEBPACK_IMPORTED_MODULE_1__);
        /* harmony import */
        var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("a481");
        /* harmony import */
        var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_2__);
        /* harmony import */
        var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6b54");
        /* harmony import */
        var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_3__);
        /* harmony import */
        var E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("d225");
        /* harmony import */
        var E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("b0b4");
        /* harmony import */
        var E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("308d");
        /* harmony import */
        var E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("6bb5");
        /* harmony import */
        var E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("4e2b");
        /* harmony import */
        var _basedev__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("1d73");










        /**
         * 读卡器
         */

        var CCardReader =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_8__[ /* default */ "a"])(CCardReader, _CBaseDev);

            /**
             * 构造器
             * @param serviceName 设备逻辑名
             * @param devName 设备对象名（magcard, magcardex, rfcard等）
             * @param siuType siu指示灯序号
             */
            function CCardReader(serviceName, devName, siuType) {
              var _this;

              Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_4__[ /* default */ "a"])(this, CCardReader);

              _this = Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__[ /* default */ "a"])(this, Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__[ /* default */ "a"])(CCardReader).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                'CardBackInserted': 'BackInserted',
                'CardInserted': function CardInserted(param) {
                  this.controlGuideLight(1);
                  this.dispatchEvent('CardInserted', param);
                },
                'AcceptAndReadTracksOver': function AcceptAndReadTracksOver(param) {
                  if (param) {
                    if ('80' == param.backinserted) {
                      return;
                    }

                    this.dispatchEvent('AcceptAndReadTracksOver', param);
                  }
                },
                'CardTaken': function CardTaken(param) {
                  this.controlGuideLight(1);
                  this.dispatchEvent('CardTaken', param);
                },
                'CardCaptured': function CardCaptured(param) {
                  this.controlGuideLight(1);
                  this.dispatchEvent('CardCaptured', param);
                },
                'CardAcceptCancelled': function CardAcceptCancelled(param) {
                  this.controlGuideLight(1);
                  this.dispatchEvent('CardAcceptCancelled', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              }, _this.AttrList = {
                filename: ''
              };
              return _this;
            }
            /**
             * 异步读取磁道数据和芯片数据等   触发事件AcceptAndReadTracksOver CardInvalid
             * @param {number} TrackMap 0x01：1磁道, 0x02：2磁道, 0x04：3磁道, 0x08：读芯片卡, 0x20：仅进卡, 0x40：读存储卡, 0x100:读二代证正面图片（存在该值时表示读取二代证）, 0x200:读二代证背面图片（存在该值时表示读取二代证）。未设置此字段默认为 1|2|4|8。如果要读取多磁道信息, 则用"|"连接, 例如11（0x01|0x02|0x08）表示同时读取IC卡的 1磁道、二磁道、芯片数据，776（0x08|0x100|0x200）表示同时读二代证的芯片数据、正面图片、背面图片。
             * @param {number} TimeOut 等待卡插入的超时时间（单位：毫秒）, 如果在卡被插入前超时，将发送超时事件，并且不能再次进卡, ,默认为0（无限超时）
             * @param {number} DevType [可选] 设备类型 1：接触读卡器 2：非接读卡器 3：刷卡器 4：二代证 5：PSAM卡
             * @returns 异步进卡读卡完成事件 AcceptAndReadTracksOver( string &pszParam)
                其中pszParam JSON串参数：
                RequestID:请求ID
                dwCommandCode:指令ID
                eventType:事件ID
                eventName:事件名 TakePictureFaceOver
                result:执行结果，0表示成功，其他参考WOSA错误码
                track1 返回的数据源
                track2 返回的数据源
                track3 返回的数据源
                chipdata 返回的数据源
                frontimage 返回的数据源正面图片路径
                backimage 返回的数据源反面图片路径
                datas 返回的数据，取值：字符串
                len 返回的数据长度 ，取值：整数
                status 返回的数据状态    "DATAOK",表示读取正常;"BLANK"为空;"INVALID"为无效;"NOTREAD"为未读取
                {"RequestID":15,"chipdata":{"datas":"313233343536373839","len":"9","status":"DATAOK"},"dwCommandCode":207,"eventName":"AcceptAndReadTracksOver","eventType":1032,"hService":1,"result":0,"track1":{"datas":"1111111111111111111","len":"19","status":"DATAOK"},"track2":{"datas":"2222222222222222","len":"16","status":"DATAOK"},"track3":{"datas":"333333333333333","len":"15","status":"DATAOK"}}
                * @example 入参示例
                var pszParam = {"TrackMap" : 11,"TimeOut" : 30000,"DevType": 1};
             */


            Object(E_xsh_2020_code_kiosk_cli_platform_node_modules_babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_5__[ /* default */ "a"])(CCardReader, [{
              key: "AcceptAndReadTracks",
              value: function AcceptAndReadTracks(TrackMap, TimeOut, DevType, callback) {
                this.controlGuideLight(this.siuSpeed);
                var param = {
                  TrackMap: TrackMap,
                  TimeOut: TimeOut,
                  DevType: DevType
                };
                return this.execute('AcceptAndReadTracks', param, callback);
              }
              /**
               * 同步读取磁道数据和芯片数据等
               * @param {number} TrackMap 0x01：1磁道, 0x02：2磁道, 0x04：3磁道, 0x08：读芯片卡, 0x20：仅进卡, 0x40：读存储卡, 0x100:读二代证正面图片（存在该值时表示读取二代证）, 0x200:读二代证背面图片（存在该值时表示读取二代证）。未设置此字段默认为 1|2|4|8。如果要读取多磁道信息, 则用"|"连接, 例如11（0x01|0x02|0x08）表示同时读取IC卡的 1磁道、二磁道、芯片数据，776（0x08|0x100|0x200）表示同时读二代证的芯片数据、正面图片、背面图片。
               * @param {number} TimeOut 等待卡插入的超时时间（单位：毫秒）, 如果在卡被插入前超时，将发送超时事件，并且不能再次进卡, ,默认为0（无限超时）
               * @param {number} DevType [可选] 设备类型 1：接触读卡器 2：非接读卡器 3：刷卡器 4：二代证 5：PSAM卡
               * @returns 异步进卡读卡完成事件 AcceptAndReadTracksOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 AcceptAndReadTracksOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  track1 返回的数据源
                  track2 返回的数据源
                  track3 返回的数据源
                  chipdata 返回的数据源
                  frontimage 返回的数据源正面图片路径
                  backimage 返回的数据源反面图片路径
                  datas 返回的数据，取值：字符串
                  len 返回的数据长度 ，取值：整数
                  status 返回的数据状态    "DATAOK",表示读取正常;"BLANK"为空;"INVALID"为无效;"NOTREAD"为未读取
                  {"RequestID":15,"chipdata":{"datas":"313233343536373839","len":"9","status":"DATAOK"},"dwCommandCode":207,"eventName":"AcceptAndReadTracksOver","eventType":1032,"hService":1,"result":0,"track1":{"datas":"1111111111111111111","len":"19","status":"DATAOK"},"track2":{"datas":"2222222222222222","len":"16","status":"DATAOK"},"track3":{"datas":"333333333333333","len":"15","status":"DATAOK"}}
                  * @example 入参示例
                  var pszParam = {"TrackMap" : 11,"TimeOut" : 30000,"DevType": 1};
               */

            }, {
              key: "AcceptAndReadTracksSync",
              value: function AcceptAndReadTracksSync(TrackMap, TimeOut, DevType, callback) {
                this.controlGuideLight(this.siuSpeed);
                var param = {
                  TrackMap: TrackMap,
                  TimeOut: TimeOut,
                  DevType: DevType
                };
                return this.getInfo('AcceptAndReadTracksSync', param, callback);
              }
              /**
               * 同步取消进卡
               * @returns 同步取消进卡完成事件 WaitCancelled( string &pszParam)
                  其中pszParam JSON串参数：
                  cmdName:被取消的接口名
                  {"cmdName":"AcceptAndReadTracks"}
               */

            }, {
              key: "CancelAccept",
              value: function CancelAccept(callback) {
                this.controlGuideLight(1);
                var param = {};
                return this.getInfo('CancelAccept', param, callback);
              }
              /**
               * 退卡 触发事件 EjectOver CardTaken
               * @param {number} position 退卡位置： 1: 进卡口; 2: 传输通道; 其他: 进卡口
               * @returns 退卡完成事件 EjectOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 EjectOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":20,"dwCommandCode":203,"eventName":"EjectOver","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"position":"1","ejectpos":"1"};
               */

            }, {
              key: "Eject",
              value: function Eject(position, callback) {
                this.controlGuideLight(this.siuSpeed);
                var param = {
                  position: position,
                  ejectpos: position
                };
                return this.execute('Eject', param, callback);
              }
              /**
               * 吞卡（接触式读卡器使用）
               * @returns 退卡完成事件 CaptureOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 CaptureOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  Position：返回的被吞卡片位置
                      PRESENT 介质在读卡器内
                      NOTPRESENT 介质不在读卡器内
                      JAMMED 介质堵塞
                      NOTSUPP 介质状态不支持
                      UNKNOWN 介质状态未知
                      INJAW 介质在设备口
                      LATCHED 介质在上电状态
                  usCount：返回的吞卡数量
                  {"Position":"UNKNOWN","RequestID":23,"dwCommandCode":204,"eventName":"CaptureOver","eventType":1032,"hService":1,"result":0,"usCount":7};
               */

            }, {
              key: "Capture",
              value: function Capture(callback) {
                var param = {};
                return this.execute('Capture', param, callback);
              }
              /**
               * 设置检磁标志位（接触式读卡器使用）
               * @param Action 检磁标志, 取值: 1: 检磁 其他: 不检磁
               */

            }, {
              key: "CheckMagic",
              value: function CheckMagic(Action, callback) {
                var param = {
                  'Action': Action
                };
                return this.getInfo('CheckMagic', param, callback);
              }
              /**
               * 异步Chip数据交互
               * @param {number} ChipProtocols 芯片卡交互协议, 取值: 0：字符传输协 1：块传输协议
               * @param ChipInData 芯片交换的数据，必须是扩展的ASCII码
               * @param {number} PsamNo （仅用于PSAM卡操作)PSAM卡座号
               * @returns CHIPIO完成事件 ChipIoOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ChipIoOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  ChipDataLength:返回数据长度
                  ChipProtocol:chip交互协议
                  chipOutData:返回chip数据
                  {"ChipDataLength":5,"ChipProtocol":1,"RequestID":35,"chipOutData":"3132333434","dwCommandCode":209,"eventName":"ChipIoOver","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"PsamNo":1,"ChipProtocols":0,"ChipInData":"0084000008"};
               */

            }, {
              key: "ChipIo",
              value: function ChipIo(ChipProtocols, ChipInData) {
                var PsamNo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0x00;
                var callback = arguments.length > 3 ? arguments[3] : undefined;
                var param = {
                  ChipProtocols: ChipProtocols,
                  ChipInData: ChipInData,
                  PsamNo: PsamNo
                };
                return this.execute('ChipIo', param, callback);
              }
              /**
               * 同步Chip数据交互
               * @param {number} ChipProtocols 芯片卡交互协议, 取值: 0：字符传输协 1：块传输协议
               * @param ChipInData 芯片交换的数据，必须是扩展的ASCII码
               * @param {number} PsamNo （仅用于PSAM卡操作)PSAM卡座号
               * @returns CHIPIO完成事件 ChipIoOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ChipIoOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  ChipDataLength:返回数据长度
                  ChipProtocol:chip交互协议
                  chipOutData:返回chip数据
                  {"ChipDataLength":5,"ChipProtocol":1,"RequestID":35,"chipOutData":"3132333434","dwCommandCode":209,"eventName":"ChipIoOver","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"PsamNo":1,"ChipProtocols":0,"ChipInData":"0084000008"};
               */

            }, {
              key: "ChipIoSync",
              value: function ChipIoSync(ChipProtocols, ChipInData) {
                var PsamNo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0x00;
                var callback = arguments.length > 3 ? arguments[3] : undefined;
                var param = {
                  ChipProtocols: ChipProtocols,
                  ChipInData: ChipInData,
                  PsamNo: PsamNo
                };
                return this.getInfo('ChipIoSync', param, callback);
              }
              /**
               * 异步上电
               * @param {number} ChipAction 上电动作, 取值: 2：冷启动（上电）; 4：热启动（上电）; 8：下电
               * @param {number} PsamNo （仅用于PSAM卡操作)PSAM卡座号
               * @returns 上电完成事件 ChipPowerOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ChipPowerOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  atrData:上电数据
                  ChipDataLength:上电数据长度
                  {"ChipDataLength":9,"RequestID":33,"atrData":"313233343536373839","dwCommandCode":211,"eventName":"ChipPowerOver","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"PsamNo":1,"ChipAction":2};
               */

            }, {
              key: "ChipPower",
              value: function ChipPower(ChipAction) {
                var PsamNo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0x00;
                var callback = arguments.length > 2 ? arguments[2] : undefined;
                var param = {
                  ChipAction: ChipAction,
                  PsamNo: PsamNo
                };
                return this.execute('ChipPower', param, callback);
              }
              /**
               * 异步更新设备状态
               * @returns 获取状态完成事件 GetStatusOver
               StDeviceStatus：设备状态
                  HEALTHY 正常
                  NODEVICE 无设备
                  BUSY 忙
                  FATAL 故障
               StMediaStatus：介质状态
                  PRESENT 介质在读卡器内
                  NOTPRESENT 介质不在读卡器内
                  JAMMED 介质堵塞 NOTSUPP 介质状态不支持 UNKNOWN 介质状态未知
                  INJAW 介质在设备口
                  LATCHED 介质在上电状态
              StChipStatus：CHIP状态
                  ONLINE 芯片存在并通电 POWEROFF 芯片存在，未通电 BUSY 芯片存在并通电，但出于忙状态 NOCHIP 芯片不存在 ERROR 芯片状态错误 UNKNOWN 芯片状态未知
                  StBinStatus： 回收箱状态
                  OK 正常 NOTSUPP 不支持回收箱
                  FULL 回收箱已满
                  HIGH 回收箱高
                  BINMISSING 回收箱缺失
                  UNKOWN 回收箱状态未知
              StBinCount： 卡箱个数
              {"DriverVersion":"V1.0.0.1_20171120","FirmwareVersion":"V1.0.0.1_20171205 | ","FrameVersion":"1.0.2.3_20190617","LastErrorCode":"0000000000","LastErrorDetail":"0000000000 | Device is online","LastErrorPosition":"","RequestID":5,"SPVersion":"1.0.0.6-20190306","StBinCount":6,"StBinStatus":"OK","StChipStatus":"UNKNOWN","StDeviceStatus":"HEALTHY","StMediaStatus":"PRESENT","dwCommandCode":201,"eventName":"PriorityString","eventType":1031,"hService":1,"result":0}
               */

            }, {
              key: "GetStatus",
              value: function GetStatus(callback) {
                var param = {};
                return this.execute('GetStatus', param, callback);
              }
              /**
               * 同步更新设备状态
               * @returns 获取状态完成事件 GetStatusOver
               StDeviceStatus：设备状态
                  HEALTHY 正常
                  NODEVICE 无设备
                  BUSY 忙
                  FATAL 故障
               StMediaStatus：介质状态
                  PRESENT 介质在读卡器内
                  NOTPRESENT 介质不在读卡器内
                  JAMMED 介质堵塞 NOTSUPP 介质状态不支持 UNKNOWN 介质状态未知
                  INJAW 介质在设备口
                  LATCHED 介质在上电状态
              StChipStatus：CHIP状态
                  ONLINE 芯片存在并通电 POWEROFF 芯片存在，未通电 BUSY 芯片存在并通电，但出于忙状态 NOCHIP 芯片不存在 ERROR 芯片状态错误 UNKNOWN 芯片状态未知
                  StBinStatus： 回收箱状态
                  OK 正常 NOTSUPP 不支持回收箱
                  FULL 回收箱已满
                  HIGH 回收箱高
                  BINMISSING 回收箱缺失
                  UNKOWN 回收箱状态未知
              StBinCount： 卡箱个数
              {"DriverVersion":"V1.0.0.1_20171120","FirmwareVersion":"V1.0.0.1_20171205 | ","FrameVersion":"1.0.2.3_20190617","LastErrorCode":"0000000000","LastErrorDetail":"0000000000 | Device is online","LastErrorPosition":"","RequestID":5,"SPVersion":"1.0.0.6-20190306","StBinCount":6,"StBinStatus":"OK","StChipStatus":"UNKNOWN","StDeviceStatus":"HEALTHY","StMediaStatus":"PRESENT","dwCommandCode":201,"eventName":"PriorityString","eventType":1031,"hService":1,"result":0}
               
               */

            }, {
              key: "GetStatusSync",
              value: function GetStatusSync(callback) {
                var param = {};
                return this.getInfo('GetStatusSync', param, callback);
              }
              /**
               * 异步复位
               * @param {number} ResetAction  复位动作, 取值： 1: 无动作; 2: 退卡; 3: 吞卡
               * @returns 复位完成事件 ResetOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ResetOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":5,"dwCommandCode":108,"eventName":"ResetOver","eventType":1032,"hService":1,"lpbuffer":"","result":0}
               * @example 入参示例
                  var pszParam = {"ResetAction":3};
                  */

            }, {
              key: "Reset",
              value: function Reset(ResetAction, callback) {
                return this.execute('Reset', {
                  ResetAction: ResetAction
                }, callback);
              }
              /**
               * 同步清除回收计数
               * @returns
                 usCount: 已回收的卡片数
               */

            }, {
              key: "ResetBinCountSync",
              value: function ResetBinCountSync(callback) {
                return this.getInfo('ResetBinCountSync', {}, callback);
              }
              /**
               * 写入多个磁道信息
               * @param {object} TrackData 磁道相关数据 非空
                          json字符串的数组,Json格式： "[{‘DataSource’:‘磁道编号’,’Data’:’磁道数据’,’ WriteMethod’:’ 写方式’}...]"
                           DataSource："TRACK1","TRACK2","TRACK3",之其中一个或者多个组合;
                           Data：要写入的磁道数据，如"1234567890";
                           WriteMethod：写的方式，是低抗磁，高抗磁，自动等，对应值为：" LOCO"，" HICO"，" AUTO"；
                          示例：[{‘DataSource’:‘TRACK1’,’Data’:’xxxxx’,’ WriteMethod’:’ LOCO’}, {‘DataSource’:‘TRACK2’,’Data’:’yyyyyy,’ WriteMethod’:’ HICO’}, {‘DataSource’:‘TRACK3’,’Data’:’xxxxx’,’ WriteMethod’:’ AUTO’}]
               */

            }, {
              key: "WriteTracks",
              value: function WriteTracks(TrackData, callback) {
                var param = {
                  TrackData: TrackData
                };
                this.execute('WriteTracks', param, callback);
              }
              /**
               * 写入单个磁道信息
               * @param trackid 磁道号 非空 ：一磁道；2：二磁道；3：三磁道；
               * @param data 待写入的磁道数据 非空 如"12343435324=32423=43252542342
               * @param mode 写入方法 非空 "HICO"：高抗磁；"LOCO"： 低抗磁；"AUTO"： 自动选择；
               */

            }, {
              key: "WriteTrack",
              value: function WriteTrack(trackid, data, mode, callback) {
                var param = {
                  trackid: trackid,
                  data: data,
                  mode: mode
                };
                this.execute('WriteTrack', param, callback);
              }
              /**
               * 异步获取候选应用列表
               * @param val
               * @return  触发 GetCandidateListOver 事件 事件参数为：json字符串：'{'result':0, 'msgerror':'', 'outinfo':'…|…|…'}' outinfo: 应用个数 | 应用1的名称 | 应用1的AID | 应用1的lable | 应用2的名称 | 应用2的AID | 应用2的lable | …
               */

            }, {
              key: "GetCandidateList",
              value: function GetCandidateList(val, callback) {
                val = val || {};
                return this.execute('GetCandidateList', val, callback);
              }
              /**
               * 异步获取ARQC
               * @param pbocParams = {
                                      'appId': appId, 应用AID;
                                      'dateTime': dateTime, 日期时间 yyyyMMddHHmmssSSS;
                                      'accType': '00', 账户类型;
                                      'tranType': '00', 交易类型;
                                      'amount': '0', 金额;
                                      'field55Tags': field55Tags ['9F26', '9F27', '9F10', '9F37', '9F36', '95', '9A', '9C', '9F02', '5F2A', '82', '9F1A', '9F03', '9F33', '9F34', '9F35', '84', '9F09']
                                  };
               * @return 触发GetPbocARQCOver事件 事件参数为 {serialNo: '01', validDate: '', icTrack2: '', field55: '', elebanlance: '', ecupperLimit: ''}
               */

            }, {
              key: "GetPbocARQC",
              value: function GetPbocARQC(pbocParams, callback) {
                return this.execute('GetPbocARQC', pbocParams, callback);
              }
              /**
               * IC卡个人化——异步
               * @param DGI 个人化数据，JSON格式，动态变化
               */

            }, {
              key: "ICCardPersonal",
              value: function ICCardPersonal(DGI, callback) {
                var param = {
                  DGI: DGI
                };
                return this.execute('ICCardPersonal', param, callback);
              }
              /**
               * IC卡个人化——同步
               * @param DGI 个人化数据，JSON格式，动态变化
               */

            }, {
              key: "ICCardPersonalSync",
              value: function ICCardPersonalSync(DGI, callback) {
                var param = {
                  DGI: DGI
                };
                return this.getInfo('ICCardPersonalSync', param, callback);
              }
              /**
               * 社保卡读卡——异步
               * @param SSCard 读卡参数，JSON格式
               * 传入参数（示例）：
                  {
                  "TAGNUM": "61",
                  "TAGDATA": [
                      {
                          "TAG": "BeginDate",
                          "VALUE": "20191010"
                      },
                      {
                          "TAG": "EndDate",
                          "VALUE": "20391010"
                      },
                      ........
                      {
                          "TAG": "Name",
                          "VALUE": "张三"
                      }
                      ]
                  *传出参数（示例）：
                  {
                  "result":0,	//0成功，其他失败
                  "message":"写卡成功"
                  }
               */

            }, {
              key: "SSCardRead",
              value: function SSCardRead(SSCard, callback) {
                var param = {
                  SSCard: SSCard
                };
                return this.execute('SSCardRead', param, callback);
              }
              /**
               * 社保卡写卡——异步
               * @param SSCard 写入参数，JSON格式
               * 传入参数（示例）：
                  {
                  "TAGNUM": "61",
                  "TAGS": [
                      {
                          "TAG": "BeginDate"
                      },
                      {
                          "TAG": "EndDate"
                      },
                      ........
                      {
                          "TAG": "Name"
                      }
                      ]
                  }
               * 传出参数（示例）：
                  {
                  "result":0,	//0成功，其他失败，当为0时才存在TAGDATA
                  "message":"读卡成功",
                  "TAGDATA": [
                      {
                          "TAG": "BeginDate",
                          "VALUE": "20191010"
                      },
                      {
                          "TAG": "EndDate",
                          "VALUE": "20391010"
                      },
                      ........
                      {
                          "TAG": "Name",
                          "VALUE": "张三"
                      }
                      ]
                  }
               */

            }, {
              key: "SSCardWrite",
              value: function SSCardWrite(SSCard, callback) {
                var param = {
                  SSCard: SSCard
                };
                return this.execute('SSCardWrite', param, callback);
              }
              /**
               * 更新IC卡KMC密钥——异步
               * @param KMC KMC密钥
               */

            }, {
              key: "UpdateKmc",
              value: function UpdateKmc(KMC, callback) {
                var param = {
                  KMC: KMC
                };
                return this.execute('UpdateKmc', param, callback);
              }
              /**
               * 更新IC卡KMC密钥——同步
               * @param KMC KMC密钥
               */

            }, {
              key: "UpdateKmcSync",
              value: function UpdateKmcSync(KMC, callback) {
                var param = {
                  KMC: KMC
                };
                return this.getInfo('UpdateKmcSync', param, callback);
              }
              /**
               * PBOC获取应用列表，同步接口
               * @param input 保留，传入卡片协议类型 当卡的Type=0的卡时，则传“0”，Type=1时传“1”
               * @return  json字符串：
                  result: 0:程序正常 非0:程序出错
                  msgerror:空
                  outinfo: 应用个数 | 应用1的名称 | 应用1的AID | 应用1的lable | 应用2的名称 | 应用2的AID | 应用2的lable | …
                  {'result':0, 'msgerror':'', 'outinfo':'…|…|…'}
               */

            }, {
              key: "PbocGetCandidateList",
              value: function PbocGetCandidateList(input) {
                return this.getInfo('PbocGetCandidateList', {
                  inbuf: input
                });
              }
              /**
               * PBOC选择应用，同步接口
               * @param input 应用AID
               * @return  json字符串：
                result:0:程序正常 非0:程序出错
                msgerror:空
                outinfo:DEBIT_CREDIT_EC表示该应用为借贷记应用（支持电子现金）DEBIT_CREDIT表示该应用为借贷记应用（不支持电子现金）PURSE_DEPOSIT表示该应用为电子钱包/电子存折
                {"msgerror":"","outinfo":"DEBIT_CREDIT_EC","result":0}
                */

            }, {
              key: "PbocSelectApplication",
              value: function PbocSelectApplication(input) {
                return this.getInfo('PbocSelectApplication', {
                  inbuf: input
                });
              }
              /**
               * PBOC选择账户类型，同步接口
               * @param input 00：默认-未指定  10：储蓄账户  20：支票账户/借记账户 30：信用账户 其它值：保留
               * @return  json字符串：'{'result':0, 'msgerror':'', 'outinfo':'…|…|…'}'
               */

            }, {
              key: "PbocSelectAccountType",
              value: function PbocSelectAccountType(input) {
                return this.getInfo('PbocSelectAccountType', {
                  inbuf: input
                });
              }
              /**
               * PBOC初始化应用信息，同步接口
               * @param input 保留，空
               * @return  json字符串：'{'result':0, 'msgerror':'', 'outinfo':'…|…|…'}'
               */

            }, {
              key: "PbocInitiateApplicationInfo",
              value: function PbocInitiateApplicationInfo(input) {
                return this.getInfo('PbocInitiateApplicationInfo', {
                  inbuf: input
                });
              }
              /**
               * PBOC选择交易类型，同步接口
               * @param input 交易类型（具体设置需根据具体项目了解）  30：余额查询  40：转账  60：圈存
               * @return  json字符串：'{'result':0, 'msgerror':'', 'outinfo':'…|…|…'}'
               */

            }, {
              key: "PbocSelectTransaction",
              value: function PbocSelectTransaction(input) {
                return this.getInfo('PbocSelectTransaction', {
                  inbuf: input
                });
              }
              /**
               * PBOC设置交易金额，如果为查询则将交易金额设为0，同步接口
               * @param input  交易金额   0：查询    其余：设置的交易金额
               * @return  json字符串：'{'result':0, 'msgerror':'', 'outinfo':'…|…|…'}'
               */

            }, {
              key: "PbocInputAmount",
              value: function PbocInputAmount(input) {
                return this.getInfo('PbocInputAmount', {
                  inbuf: input
                });
              }
              /**
               * PBOC交易设置, 同步接口，执行脱机数据认证，处理限制，持卡人认证，终端风险管理，终端行为分析，卡片行为分析（此接口用来执行一系列PBOC校验，根据校验结果用来判断该次操作是进行联机处理（ARQC）还是脱机批准(TC)还是脱机拒绝(AAC)。 调用该接口后，可以调用GWI_GetValueByTag或GWI_GetValuesByTagsLengths将服务器所需要的数据取出）
               * @param input  空
               * @return  json字符串：
                 outinfo: ARQC请求联机处理    AAC交易脱机拒绝  TC交易脱机批准
                 {'result':0, 'msgerror':'', 'outinfo':'ARQC'}
               */

            }, {
              key: "PbocExcutePBOCCoreDispose",
              value: function PbocExcutePBOCCoreDispose(input) {
                return this.getInfo('PbocExcutePBOCCoreDispose', {
                  inbuf: input
                });
              }
              /**
               * PBOC处理服务器返回的发卡行认证数据及脚本和联机结果及主机授权码，同步接口
               * @param input 发卡行认证数据|脚本|联机结果|主机授权码
               * @return  json字符串：
                 outinfo: AAC交易脱机拒绝  TC交易脱机批准
                 {'result':0, 'msgerror':'', 'outinfo':'TC'}
               */

            }, {
              key: "PbocWriteARPCAndScript",
              value: function PbocWriteARPCAndScript(input) {
                return this.getInfo('PbocWriteARPCAndScript', {
                  inbuf: input
                });
              }
              /**
               * PBOC处理服务器返回的发卡行认证数据及脚本和联机结果及主机授权码，同步接口
               * @param input 联机结果|联机交易返回的IC发卡域的值
               * @return  json字符串：
                 outinfo: AAC交易脱机拒绝  TC交易脱机批准
                 {'result':0, 'msgerror':'', 'outinfo':'TC'}
               */

            }, {
              key: "PbocWriteARPCAndScriptEx",
              value: function PbocWriteARPCAndScriptEx(input) {
                return this.getInfo('PbocWriteARPCAndScriptEx', {
                  inbuf: input
                });
              }
              /**
               * PBOC获取交易明细，获取到的交易格式由卡片决定，同步接口
               * @param input  空
               * @return  json字符串：
                 outinfo: 明细数据项个数 | 交易日期^交易日期长度 | 交易时间^交易时间长度 | 授权金额^授权金额长度 | 其他金额^其他金额长度 | 终端国家代码^终端国家代码长度 | 交易明细个数 | 交易明细1 | 交易明细2”,(排序不固定，由卡片决定)
                 {'result':0, 'msgerror':'', 'outinfo':'……|……'}
               */

            }, {
              key: "PbocGetTransDetail",
              value: function PbocGetTransDetail(input) {
                return this.getInfo('PbocGetTransDetail', {
                  inbuf: input
                });
              }
              /**
               * PBOC获取脚本执行结果，同步接口
               * @param input 空
               * @return  json字符串：
                 outinfo: 正常时返回脚本执行结果（长度与脚本个数有关）发卡行脚本结果字节 1:脚本结果高4位：终端所执行的发卡行脚本处理结果： ——‘0’= 脚本未被处理;——‘1’= 脚本处理失败;——‘2’= 脚本处理成功; 低4位：脚本命令序号——‘0’ = 没有指定;——‘1’到‘E’= 1 到 14 的脚本序号;——‘F’ = 15 或以上的脚本序号;字节 2 – 5：脚本标识终端收到的发卡行脚本的脚本标识，如没有则填0。如果终端收到不止一个发卡行脚本则必须有对每个终端处理的发卡行脚本都有如上5的倍数个字节的脚本结果（按照返回的格式解析即可）
                 {'result':0, 'msgerror':'', 'outinfo':'FFFFFFFFFF'}
               */

            }, {
              key: "PbocGetScriptResults",
              value: function PbocGetScriptResults(input) {
                return this.getInfo('PbocGetScriptResults', {
                  inbuf: input
                });
              }
              /**
               * PBOC标签取值，同步接口
               * @param input  PBOC TLV 标签, 格式为：“0XFF33”，tag一定要加0x，表示16进制
               * @return  json字符串：
                  outinfo:正常时返回该标签对应的值
                 {'result':0, 'msgerror':'', 'outinfo':'…'}
               */

            }, {
              key: "PbocGetValueByTag",
              value: function PbocGetValueByTag(input) {
                return this.getInfo('PbocGetValueByTag', {
                  inbuf: input
                });
              }
              /**
               * PBOC标签设置值，同步接口
               * @param tag  标签
               * @param Value   值
               * @return  json字符串：'{'result':0, 'msgerror':'', 'outinfo':'…|…|…'}'
               */

            }, {
              key: "PbocSetValueByTag",
              value: function PbocSetValueByTag(tag, Value) {
                var param = {
                  'tag': tag,
                  'Value': Value
                };
                return this.getInfo('PbocSetValueByTag', param);
              }
              /**
               * 接口保留
               * @param input 多个标签 格式为：“个数#tag ^ length#tag ^ length#....”，tag一定要加0x或0X，表示16进制，如“3#0XFF33 ^ 10#0XFF34 ^ 10#0XFF35 ^ 10”
               * @return  json字符串：
                  outinfo:正常时返回该多个标签对应的值，返回的值根据输入参数每个tag的length进行截取即可
                 {'result':0, 'msgerror':'', 'outinfo':'…'}
               */

            }, {
              key: "PbocGetValuesByTagsLengths",
              value: function PbocGetValuesByTagsLengths(input) {
                return this.getInfo('PbocGetValuesByTagsLengths', {
                  inbuf: input
                });
              }
              /**
               * PBOC获取电子现金余额，同步接口
               * @param input 空
               * @return  json字符串：
                  outinfo:正常时返回余额（当选择的应用为电子钱包/电子存折时，返回电子钱包/电子存折余额，当选择的应用为借贷记应用时，返回电子现金的余额）
                 {'result':0, 'msgerror':'', 'outinfo':'000000000001'}
               */

            }, {
              key: "PbocGetELEBalance",
              value: function PbocGetELEBalance(input) {
                return this.getInfo('PbocGetELEBalance', {
                  inbuf: input
                });
              }
              /**
               * PBOC获取电子现金应用的标签值，同步接口
               * @param input 空
               * @return  json字符串：
                  outinfo:正常时返回电子现金应用的标签值
                 {'result':0, 'msgerror':'', 'outinfo':'000000000001'}
               */

            }, {
              key: "PbocGetELETagValue",
              value: function PbocGetELETagValue(input) {
                input = input.substr(2, 6);
                return this.getInfo('PbocGetELETagValue', {
                  inbuf: input
                });
              }
              /**
               * PBOC获取电子现金余额上限，同步接口
               * @param input  空
               * @return  json字符串：
                  outinfo:正常时返回余额上限
                 {'result':0, 'msgerror':'', 'outinfo':'000000100000'}
               */

            }, {
              key: "PbocGetECUpperLimit",
              value: function PbocGetECUpperLimit(input) {
                return this.getInfo('PbocGetECUpperLimit', {
                  inbuf: input
                });
              }
              /**
               * 清除XML节点值
               * @param filename xml文件名
               * @param nodepath 节点路径
               */

            }, {
              key: "ClearXMLNode",
              value: function ClearXMLNode(filename, nodepath) {
                var param = {
                  filename: filename,
                  nodepath: nodepath
                };
                return this.getInfo('ClearXMLNode', param);
              }
              /**
               * 设置terminal.xml节点值
               * @param nodePath
               * @param ifdNdType
               * @param fdNdname
               * @param fdNdValue
               * @param iType
               * @param name
               * @param value
               */

            }, {
              key: "PbocSetXMLNodeValueByEx",
              value: function PbocSetXMLNodeValueByEx(nodePath, ifdNdType, fdNdname, fdNdValue, iType, name, value) {
                if (this.getAttribute('CpPboc3_0') !== 'true') {
                  return 1;
                }

                var param = {
                  filename: this.AttrList.filename,
                  nodePath: nodePath,
                  ifdNdType: ifdNdType,
                  fdNdname: fdNdname,
                  fdNdValue: fdNdValue,
                  iType: iType,
                  name: name,
                  value: value
                };
                return this.getInfo('SetXMLNodeValueByEx', param);
              }
              /**
               * 获取xml节点值
               * @param nodePath
               * @param ifdNdType
               * @param fdNdname
               * @param fdNdValue
               * @param iType
               * @param name
               */

            }, {
              key: "PbocGetXMLNodeValueByEx",
              value: function PbocGetXMLNodeValueByEx(nodePath, ifdNdType, fdNdname, fdNdValue, iType, name) {
                if (this.getAttribute('CpPboc3_0') !== 'true') {
                  return '';
                }

                var param = {
                  filename: this.AttrList.filename,
                  nodePath: nodePath,
                  ifdNdType: ifdNdType,
                  fdNdname: fdNdname,
                  fdNdValue: fdNdValue,
                  iType: iType,
                  name: name
                };
                return this.getInfo('GetXMLNodeValueByEx', param);
              }
              /*
                  ==============magcard，magcardex,rfcard 通用方法================================================
                  */

              /**
               * PBOC获取55域
               * @param taglist 标签列表，不传默认：['9F26', '9F27', '9F10', '9F37', '9F36', '95', '9A', '9C', '9F02', '5F2A', '82', '9F1A', '9F03', '9F33', '9F34', '9F35', '84', '9F09']
               */

            }, {
              key: "PbocGet8583Filed55",
              value: function PbocGet8583Filed55(taglist) {
                if (!taglist || taglist.length <= 0) {
                  taglist = ['9F26', '9F27', '9F10', '9F37', '9F36', '95', '9A', '9C', '9F02', '5F2A', '82', '9F1A', '9F03', '9F33', '9F34', '9F35', '84', '9F09'];
                }

                var tagvalue = '';

                for (var i = 0; i < taglist.length; i++) {
                  var args = this.PbocGetValueByTag('0X' + taglist[i]);
                  args = JSON.parse(args);

                  if (args.result == 0) {
                    var len = args.outinfo.length / 2;
                    var lenStr = '';

                    if (len < 16) {
                      lenStr = '0' + len.toString(16);
                    } else {
                      lenStr = len.toString(16);
                    }

                    tagvalue += taglist[i] + lenStr + args.outinfo;
                  } else {
                    tagvalue += taglist[i] + '00';
                  }
                }

                return tagvalue;
              }
              /*
                      ==============magcard，magcardex,rfcard 通用方法================================================
                      */

              /**
               * PBOC获取55域
               * @param taglist 不传默认['9F26', '9F27', '9F10', '9F37', '9F36', '95', '9A', '9C', '9F02', '5F2A', '82', '9F1A', '9F03', '9F33', '9F34', '9F35', '84', '9F09']
               */

            }, {
              key: "PbocGet8583Filed55JSON",
              value: function PbocGet8583Filed55JSON(taglist) {
                if (!taglist || taglist.length <= 0) {
                  taglist = ['9F26', '9F27', '9F10', '9F37', '9F36', '95', '9A', '9C', '9F02', '5F2A', '82', '9F1A', '9F03', '9F33', '9F34', '9F35', '84', '9F09'];
                }

                var tagvalue = {};

                for (var i = 0; i < taglist.length; i++) {
                  var args = this.PbocGetValueByTag('0X' + taglist[i]);
                  args = JSON.parse(args);

                  if (args.result == 0) {
                    var len = args.outinfo.length / 2;
                    var lenStr = '';

                    if (len < 16) {
                      lenStr = '0' + len.toString(16);
                    } else {
                      lenStr = len.toString(16);
                    } //tagvalue += taglist[i] + len + args.outinfo;
                    // tagvalue[taglist[i]] = len + args.outinfo;


                    tagvalue[taglist[i]] = args.outinfo;
                  } else {
                    //tagvalue += taglist[i] + '00';
                    tagvalue[taglist[i]] = '00';
                  }
                }

                return tagvalue;
              }
              /**
               * ？
               * @param arqc
               * @param arpc
               * @param arpcResult
               */

            }, {
              key: "getCUP55Data",
              value: function getCUP55Data(arqc, arpc, arpcResult) {
                var taglist = ['9F1E', '9F41', '9F74', '9F63'];
                var tagvalue = arqc;

                for (var i = 0; i < taglist.length; i++) {
                  var args = this.PbocGetValueByTag('0X' + taglist[i]);
                  args = eval(args);

                  if (args.result == 0) {
                    var len = args.outinfo.length / 2;
                    var lenStr = '';

                    if (len < 16) {
                      lenStr = '0' + len.toString(16);
                    } else {
                      lenStr = len.toString(16);
                    }

                    tagvalue += taglist[i] + lenStr + args.outinfo;
                  } else {
                    tagvalue += taglist[i] + '00';
                  }
                }

                if (arpc != null && arpc != '') {
                  tagvalue += arpc;
                  var pos = arpc.toUpperCase().indexOf('9F18');
                  var tag9F18Value = '';

                  if (pos != -1) {
                    var tag9F18Valuelen = arpc.substring(pos + 4, pos + 6);
                    var tag9F18ValuelenInt = parseInt(tag9F18Valuelen, 16);
                    tag9F18Value = arpc.substring(pos + 6, pos + 6 + tag9F18ValuelenInt);

                    if (arpcResult.toUpperCase() == 'OK' || arpcResult.toUpperCase() == 'TRUE') {
                      tag9F18Value = 'DF310302' + tag9F18Value;
                    } else {
                      tag9F18Value = 'DF310301' + tag9F18Value;
                    }

                    tagvalue += tag9F18Value;
                  }
                }

                return tagvalue;
              }
              /**
               * 获取PBOC日志
               * @param input
               * @deprecated
               */

            }, {
              key: "PbocGetQLog",
              value: function PbocGetQLog(input) {
                return this.getInfo('PbocGetQLog', {
                  inbuf: input
                });
              }
              /**
               * PBOC设置xml节点
               * @param nodePath
               * @param iType
               * @param name
               * @param value
               * @param nodeIndex
               */

            }, {
              key: "PbocSetXMLNodeValueEx",
              value: function PbocSetXMLNodeValueEx(nodePath, iType, name, value, nodeIndex) {
                var param = {
                  filename: this.AttrList.filename,
                  nodePath: nodePath,
                  iType: iType,
                  name: name,
                  value: value,
                  nodeIndex: nodeIndex
                };
                return this.getInfo('SetXMLNodeValueEx', param);
              }
            }, {
              key: "PbocGetXMLNodeValueEx",
              value: function PbocGetXMLNodeValueEx(nodePath, iType, name, nodeIndex) {
                var param = {
                  filename: this.AttrList.filename,
                  nodePath: nodePath,
                  iType: iType,
                  name: name,
                  value: '',
                  nodeIndex: nodeIndex
                };
                return this.getInfo('GetXMLNodeValueEx', param);
              }
            }, {
              key: "PbocOpenXMLFile",
              value: function PbocOpenXMLFile(xmlfile) { // PBOC2.0升级为PBOC3.0库删除
              }
            }, {
              key: "PbocGetXMLNode",
              value: function PbocGetXMLNode(xmlhandler, nodepath) { // PBOC2.0升级为PBOC3.0库删除
              }
            }, {
              key: "PbocGetXMLPropertyValue",
              value: function PbocGetXMLPropertyValue(xmlhandler, propertyName) {}
            }, {
              key: "PbocAddXMLNode",
              value: function PbocAddXMLNode(xmlhandler, nodename) {}
            }, {
              key: "PbocSetXMLNodeValue",
              value: function PbocSetXMLNodeValue(xmlhandler, nodeValue) {}
            }, {
              key: "PbocSetXMLProperty",
              value: function PbocSetXMLProperty(xmlhandler, propertyName, propertyValue) {}
            }, {
              key: "PbocClearXMLProcessor",
              value: function PbocClearXMLProcessor() {}
            }, {
              key: "PbocAddAID",
              value: function PbocAddAID(AID) {
                return 0;
              } //========OTP和保险卡=======BEGIN===========

            }, {
              key: "InitApp",
              value: function InitApp(strAID, callback) {
                var SelAID = '00A4040009A0000000038698070300';
                var strRet = this.ChipIoSync(0, SelAID, 0x00, callback);

                if ('9000' == strRet.substring(strRet.length - 4)) {
                  return 0;
                } else {
                  return -1;
                }
              } //----保险卡----

            }, {
              key: "ReadBinaryFile",
              value: function ReadBinaryFile(nSFI, Offset) {
                var param = {
                  nSFI: nSFI,
                  Start: Offset
                };
                return this.getInfo('PbocReadBinary', param);
              }
            }, {
              key: "ReadRecordFile",
              value: function ReadRecordFile(nSFI, nRecordNo) {
                var param = {
                  nSFI: nSFI,
                  Start: nRecordNo
                };
                return this.getInfo('PbocReadRecord', param);
              }
            }, {
              key: "readCardTrack",
              value: function readCardTrack(param) {
                var objVal = {};
                objVal['pbocFlag'] = '0';
                objVal['track2'] = ''; //

                objVal['arqc'] = '';
                objVal['pbocTrac2'] = '';
                objVal['pbocCardNo'] = '';
                objVal['FALLBACKFLAG'] = '';

                if (param.chipdata && param.chipdata.status == 'DATAOK') {
                  // chipOn
                  objVal['pbocFlag'] = '1';
                  objVal = this.pbocOperator(objVal);
                }

                if (param.track2 && param.track2.status == 'DATAOK') {
                  objVal['track2'] = param.track2.datas.replace('>', '=');
                }

                return objVal;
              }
            }, {
              key: "pbocOperator",
              value: function pbocOperator(objVal) {
                objVal['arqc'] = '';
                objVal['pbocTrac2'] = '';
                objVal['pbocCardNo'] = '';
                var pbocOperFlag = true;
                var aids = this.PbocGetCandidateList('');
                aids = eval(aids);

                if (aids.result == 0) {
                  var aid = this.getAid(aids.outinfo);

                  if (aid != '') {
                    var selectReult = this.PbocSelectApplication(aid);
                    selectReult = eval(selectReult);

                    if (selectReult.result == 0) {
                      this.PbocInitiateApplicationInfo('');
                      var authFlag = eval(this.PbocExcutePBOCCoreDispose(''));

                      if (authFlag.result == 0 && authFlag.outinfo == 'ARQC') {
                        var arqc = this.PbocGet8583Filed55([]);
                        var pbocTrac2 = this.PbocGetValueByTag('0X57');
                        pbocTrac2 = eval(pbocTrac2);
                        pbocTrac2.outinfo = pbocTrac2.outinfo.replace('D', '=').replace('F', '');
                        var pbocCardNo = this.PbocGetValueByTag('0X5F34');
                        pbocCardNo = eval(pbocCardNo);

                        if (pbocCardNo.result == 0 || pbocTrac2.result == 0) {
                          objVal['arqc'] = arqc;
                          objVal['pbocTrac2'] = pbocTrac2.outinfo;
                          objVal['pbocCardNo'] = pbocCardNo.outinfo;
                        } else {
                          pbocOperFlag = false;
                        }
                      } else {
                        pbocOperFlag = false;
                      }
                    } else {
                      pbocOperFlag = false;
                    }
                  } else {
                    pbocOperFlag = false;
                  }
                } else {
                  pbocOperFlag = false;
                }

                if (!pbocOperFlag) {
                  objVal['FALLBACKFLAG'] = '2';
                } else {
                  objVal['FALLBACKFLAG'] = '0';
                }

                objVal['pbocOperFlag'] = pbocOperFlag;
                return objVal;
              }
            }, {
              key: "getAid",
              value: function getAid(aidStr) {
                var aids = aidStr.split('|');

                if (Number(aids[0]) >= 1) {
                  return aids[2];
                } else {
                  return '';
                }
              }
            }]);

            return CCardReader;
          }(_basedev__WEBPACK_IMPORTED_MODULE_9__[ /* default */ "a"]);

        /* harmony default export */
        __webpack_exports__["a"] = (CCardReader);

        /***/
      }),

    /***/
    "be13":
      /***/
      (function (module, exports) {

        // 7.2.1 RequireObjectCoercible(argument)
        module.exports = function (it) {
          if (it == undefined) throw TypeError("Can't call method on  " + it);
          return it;
        };


        /***/
      }),

    /***/
    "c0d8":
      /***/
      (function (module, exports, __webpack_require__) {

        var def = __webpack_require__("3adc").f;
        var has = __webpack_require__("43c8");
        var TAG = __webpack_require__("1b55")('toStringTag');

        module.exports = function (it, tag, stat) {
          if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
            configurable: true,
            value: tag
          });
        };


        /***/
      }),

    /***/
    "c165":
      /***/
      (function (module, exports, __webpack_require__) {

        // most Object methods by ES6 should accept primitives
        var $export = __webpack_require__("d13f");
        var core = __webpack_require__("a7d3");
        var fails = __webpack_require__("d782");
        module.exports = function (KEY, exec) {
          var fn = (core.Object || {})[KEY] || Object[KEY];
          var exp = {};
          exp[KEY] = exec(fn);
          $export($export.S + $export.F * fails(function () {
            fn(1);
          }), 'Object', exp);
        };


        /***/
      }),

    /***/
    "c366":
      /***/
      (function (module, exports, __webpack_require__) {

        // false -> Array#indexOf
        // true  -> Array#includes
        var toIObject = __webpack_require__("6821");
        var toLength = __webpack_require__("9def");
        var toAbsoluteIndex = __webpack_require__("77f1");
        module.exports = function (IS_INCLUDES) {
          return function ($this, el, fromIndex) {
            var O = toIObject($this);
            var length = toLength(O.length);
            var index = toAbsoluteIndex(fromIndex, length);
            var value;
            // Array#includes uses SameValueZero equality algorithm
            // eslint-disable-next-line no-self-compare
            if (IS_INCLUDES && el != el)
              while (length > index) {
                value = O[index++];
                // eslint-disable-next-line no-self-compare
                if (value != value) return true;
                // Array#indexOf ignores holes, Array#includes - not
              } else
                for (; length > index; index++)
                  if (IS_INCLUDES || index in O) {
                    if (O[index] === el) return IS_INCLUDES || index || 0;
                  } return !IS_INCLUDES && -1;
          };
        };


        /***/
      }),

    /***/
    "c5f6":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var global = __webpack_require__("7726");
        var has = __webpack_require__("69a8");
        var cof = __webpack_require__("2d95");
        var inheritIfRequired = __webpack_require__("5dbc");
        var toPrimitive = __webpack_require__("6a99");
        var fails = __webpack_require__("79e5");
        var gOPN = __webpack_require__("9093").f;
        var gOPD = __webpack_require__("11e9").f;
        var dP = __webpack_require__("86cc").f;
        var $trim = __webpack_require__("aa77").trim;
        var NUMBER = 'Number';
        var $Number = global[NUMBER];
        var Base = $Number;
        var proto = $Number.prototype;
        // Opera ~12 has broken Object#toString
        var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
        var TRIM = 'trim' in String.prototype;

        // 7.1.3 ToNumber(argument)
        var toNumber = function (argument) {
          var it = toPrimitive(argument, false);
          if (typeof it == 'string' && it.length > 2) {
            it = TRIM ? it.trim() : $trim(it, 3);
            var first = it.charCodeAt(0);
            var third, radix, maxCode;
            if (first === 43 || first === 45) {
              third = it.charCodeAt(2);
              if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
            } else if (first === 48) {
              switch (it.charCodeAt(1)) {
                case 66:
                case 98:
                  radix = 2;
                  maxCode = 49;
                  break; // fast equal /^0b[01]+$/i
                case 79:
                case 111:
                  radix = 8;
                  maxCode = 55;
                  break; // fast equal /^0o[0-7]+$/i
                default:
                  return +it;
              }
              for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
                code = digits.charCodeAt(i);
                // parseInt parses a string to a first unavailable symbol
                // but ToNumber should return NaN if a string contains unavailable symbols
                if (code < 48 || code > maxCode) return NaN;
              }
              return parseInt(digits, radix);
            }
          }
          return +it;
        };

        if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
          $Number = function Number(value) {
            var it = arguments.length < 1 ? 0 : value;
            var that = this;
            return that instanceof $Number
              // check on 1..constructor(foo) case
              &&
              (BROKEN_COF ? fails(function () {
                proto.valueOf.call(that);
              }) : cof(that) != NUMBER) ?
              inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
          };
          for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
              // ES3:
              'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
              // ES6 (in case, if modules with ES6 Number statics required before):
              'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
              'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
            ).split(','), j = 0, key; keys.length > j; j++) {
            if (has(Base, key = keys[j]) && !has($Number, key)) {
              dP($Number, key, gOPD(Base, key));
            }
          }
          $Number.prototype = proto;
          proto.constructor = $Number;
          __webpack_require__("2aba")(global, NUMBER, $Number);
        }


        /***/
      }),

    /***/
    "c698":
      /***/
      (function (module, exports, __webpack_require__) {

        // 26.1.11 Reflect.ownKeys(target)
        var $export = __webpack_require__("5ca1");

        $export($export.S, 'Reflect', {
          ownKeys: __webpack_require__("990b")
        });


        /***/
      }),

    /***/
    "c69a":
      /***/
      (function (module, exports, __webpack_require__) {

        module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
          return Object.defineProperty(__webpack_require__("230e")('div'), 'a', {
            get: function () {
              return 7;
            }
          }).a != 7;
        });


        /***/
      }),

    /***/
    "ca5a":
      /***/
      (function (module, exports) {

        var id = 0;
        var px = Math.random();
        module.exports = function (key) {
          return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
        };


        /***/
      }),

    /***/
    "cadf":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var addToUnscopables = __webpack_require__("9c6c");
        var step = __webpack_require__("d53b");
        var Iterators = __webpack_require__("84f2");
        var toIObject = __webpack_require__("6821");

        // 22.1.3.4 Array.prototype.entries()
        // 22.1.3.13 Array.prototype.keys()
        // 22.1.3.29 Array.prototype.values()
        // 22.1.3.30 Array.prototype[@@iterator]()
        module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
          this._t = toIObject(iterated); // target
          this._i = 0; // next index
          this._k = kind; // kind
          // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
        }, function () {
          var O = this._t;
          var kind = this._k;
          var index = this._i++;
          if (!O || index >= O.length) {
            this._t = undefined;
            return step(1);
          }
          if (kind == 'keys') return step(0, index);
          if (kind == 'values') return step(0, O[index]);
          return step(0, [index, O[index]]);
        }, 'values');

        // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
        Iterators.Arguments = Iterators.Array;

        addToUnscopables('keys');
        addToUnscopables('values');
        addToUnscopables('entries');


        /***/
      }),

    /***/
    "cb7c":
      /***/
      (function (module, exports, __webpack_require__) {

        var isObject = __webpack_require__("d3f4");
        module.exports = function (it) {
          if (!isObject(it)) throw TypeError(it + ' is not an object!');
          return it;
        };


        /***/
      }),

    /***/
    "ce10":
      /***/
      (function (module, exports, __webpack_require__) {

        var has = __webpack_require__("69a8");
        var toIObject = __webpack_require__("6821");
        var arrayIndexOf = __webpack_require__("c366")(false);
        var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

        module.exports = function (object, names) {
          var O = toIObject(object);
          var i = 0;
          var result = [];
          var key;
          for (key in O)
            if (key != IE_PROTO) has(O, key) && result.push(key);
          // Don't enum bug & hidden keys
          while (names.length > i)
            if (has(O, key = names[i++])) {
              ~arrayIndexOf(result, key) || result.push(key);
            }
          return result;
        };


        /***/
      }),

    /***/
    "d127":
      /***/
      (function (module, exports, __webpack_require__) {

        __webpack_require__("0a0a")('asyncIterator');


        /***/
      }),

    /***/
    "d13f":
      /***/
      (function (module, exports, __webpack_require__) {

        var global = __webpack_require__("da3c");
        var core = __webpack_require__("a7d3");
        var ctx = __webpack_require__("bc25");
        var hide = __webpack_require__("8ce0");
        var has = __webpack_require__("43c8");
        var PROTOTYPE = 'prototype';

        var $export = function (type, name, source) {
          var IS_FORCED = type & $export.F;
          var IS_GLOBAL = type & $export.G;
          var IS_STATIC = type & $export.S;
          var IS_PROTO = type & $export.P;
          var IS_BIND = type & $export.B;
          var IS_WRAP = type & $export.W;
          var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
          var expProto = exports[PROTOTYPE];
          var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
          var key, own, out;
          if (IS_GLOBAL) source = name;
          for (key in source) {
            // contains in native
            own = !IS_FORCED && target && target[key] !== undefined;
            if (own && has(exports, key)) continue;
            // export native or passed
            out = own ? target[key] : source[key];
            // prevent global pollution for namespaces
            exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
              // bind timers to global for call from export context
              :
              IS_BIND && own ? ctx(out, global)
              // wrap global constructors for prevent change them in library
              :
              IS_WRAP && target[key] == out ? (function (C) {
                var F = function (a, b, c) {
                  if (this instanceof C) {
                    switch (arguments.length) {
                      case 0:
                        return new C();
                      case 1:
                        return new C(a);
                      case 2:
                        return new C(a, b);
                    }
                    return new C(a, b, c);
                  }
                  return C.apply(this, arguments);
                };
                F[PROTOTYPE] = C[PROTOTYPE];
                return F;
                // make static versions for prototype methods
              })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
            // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
            if (IS_PROTO) {
              (exports.virtual || (exports.virtual = {}))[key] = out;
              // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
              if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
            }
          }
        };
        // type bitmap
        $export.F = 1; // forced
        $export.G = 2; // global
        $export.S = 4; // static
        $export.P = 8; // proto
        $export.B = 16; // bind
        $export.W = 32; // wrap
        $export.U = 64; // safe
        $export.R = 128; // real proto method for `library`
        module.exports = $export;


        /***/
      }),

    /***/
    "d225":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function () {
          return _classCallCheck;
        });

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        /***/
      }),

    /***/
    "d24f":
      /***/
      (function (module, exports, __webpack_require__) {

        __webpack_require__("0a0a")('observable');


        /***/
      }),

    /***/
    "d256":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        // ECMAScript 6 symbols shim
        var global = __webpack_require__("da3c");
        var has = __webpack_require__("43c8");
        var DESCRIPTORS = __webpack_require__("7d95");
        var $export = __webpack_require__("d13f");
        var redefine = __webpack_require__("2312");
        var META = __webpack_require__("6277").KEY;
        var $fails = __webpack_require__("d782");
        var shared = __webpack_require__("7772");
        var setToStringTag = __webpack_require__("c0d8");
        var uid = __webpack_require__("7b00");
        var wks = __webpack_require__("1b55");
        var wksExt = __webpack_require__("fda1");
        var wksDefine = __webpack_require__("0a0a");
        var enumKeys = __webpack_require__("d2d6");
        var isArray = __webpack_require__("b5aa");
        var anObject = __webpack_require__("0f89");
        var isObject = __webpack_require__("6f8a");
        var toObject = __webpack_require__("0185");
        var toIObject = __webpack_require__("6a9b");
        var toPrimitive = __webpack_require__("2ea1");
        var createDesc = __webpack_require__("f845");
        var _create = __webpack_require__("7108");
        var gOPNExt = __webpack_require__("565d");
        var $GOPD = __webpack_require__("626e");
        var $GOPS = __webpack_require__("31c2");
        var $DP = __webpack_require__("3adc");
        var $keys = __webpack_require__("7633");
        var gOPD = $GOPD.f;
        var dP = $DP.f;
        var gOPN = gOPNExt.f;
        var $Symbol = global.Symbol;
        var $JSON = global.JSON;
        var _stringify = $JSON && $JSON.stringify;
        var PROTOTYPE = 'prototype';
        var HIDDEN = wks('_hidden');
        var TO_PRIMITIVE = wks('toPrimitive');
        var isEnum = {}.propertyIsEnumerable;
        var SymbolRegistry = shared('symbol-registry');
        var AllSymbols = shared('symbols');
        var OPSymbols = shared('op-symbols');
        var ObjectProto = Object[PROTOTYPE];
        var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
        var QObject = global.QObject;
        // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
        var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

        // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
        var setSymbolDesc = DESCRIPTORS && $fails(function () {
          return _create(dP({}, 'a', {
            get: function () {
              return dP(this, 'a', {
                value: 7
              }).a;
            }
          })).a != 7;
        }) ? function (it, key, D) {
          var protoDesc = gOPD(ObjectProto, key);
          if (protoDesc) delete ObjectProto[key];
          dP(it, key, D);
          if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
        } : dP;

        var wrap = function (tag) {
          var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
          sym._k = tag;
          return sym;
        };

        var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
          return typeof it == 'symbol';
        } : function (it) {
          return it instanceof $Symbol;
        };

        var $defineProperty = function defineProperty(it, key, D) {
          if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
          anObject(it);
          key = toPrimitive(key, true);
          anObject(D);
          if (has(AllSymbols, key)) {
            if (!D.enumerable) {
              if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
              it[HIDDEN][key] = true;
            } else {
              if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
              D = _create(D, {
                enumerable: createDesc(0, false)
              });
            }
            return setSymbolDesc(it, key, D);
          }
          return dP(it, key, D);
        };
        var $defineProperties = function defineProperties(it, P) {
          anObject(it);
          var keys = enumKeys(P = toIObject(P));
          var i = 0;
          var l = keys.length;
          var key;
          while (l > i) $defineProperty(it, key = keys[i++], P[key]);
          return it;
        };
        var $create = function create(it, P) {
          return P === undefined ? _create(it) : $defineProperties(_create(it), P);
        };
        var $propertyIsEnumerable = function propertyIsEnumerable(key) {
          var E = isEnum.call(this, key = toPrimitive(key, true));
          if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
          return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
        };
        var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
          it = toIObject(it);
          key = toPrimitive(key, true);
          if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
          var D = gOPD(it, key);
          if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
          return D;
        };
        var $getOwnPropertyNames = function getOwnPropertyNames(it) {
          var names = gOPN(toIObject(it));
          var result = [];
          var i = 0;
          var key;
          while (names.length > i) {
            if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
          }
          return result;
        };
        var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
          var IS_OP = it === ObjectProto;
          var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
          var result = [];
          var i = 0;
          var key;
          while (names.length > i) {
            if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
          }
          return result;
        };

        // 19.4.1.1 Symbol([description])
        if (!USE_NATIVE) {
          $Symbol = function Symbol() {
            if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
            var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
            var $set = function (value) {
              if (this === ObjectProto) $set.call(OPSymbols, value);
              if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
              setSymbolDesc(this, tag, createDesc(1, value));
            };
            if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, {
              configurable: true,
              set: $set
            });
            return wrap(tag);
          };
          redefine($Symbol[PROTOTYPE], 'toString', function toString() {
            return this._k;
          });

          $GOPD.f = $getOwnPropertyDescriptor;
          $DP.f = $defineProperty;
          __webpack_require__("d876").f = gOPNExt.f = $getOwnPropertyNames;
          __webpack_require__("d74e").f = $propertyIsEnumerable;
          $GOPS.f = $getOwnPropertySymbols;

          if (DESCRIPTORS && !__webpack_require__("b457")) {
            redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
          }

          wksExt.f = function (name) {
            return wrap(wks(name));
          };
        }

        $export($export.G + $export.W + $export.F * !USE_NATIVE, {
          Symbol: $Symbol
        });

        for (var es6Symbols = (
            // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
            'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
          ).split(','), j = 0; es6Symbols.length > j;) wks(es6Symbols[j++]);

        for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

        $export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
          // 19.4.2.1 Symbol.for(key)
          'for': function (key) {
            return has(SymbolRegistry, key += '') ?
              SymbolRegistry[key] :
              SymbolRegistry[key] = $Symbol(key);
          },
          // 19.4.2.5 Symbol.keyFor(sym)
          keyFor: function keyFor(sym) {
            if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
            for (var key in SymbolRegistry)
              if (SymbolRegistry[key] === sym) return key;
          },
          useSetter: function () {
            setter = true;
          },
          useSimple: function () {
            setter = false;
          }
        });

        $export($export.S + $export.F * !USE_NATIVE, 'Object', {
          // 19.1.2.2 Object.create(O [, Properties])
          create: $create,
          // 19.1.2.4 Object.defineProperty(O, P, Attributes)
          defineProperty: $defineProperty,
          // 19.1.2.3 Object.defineProperties(O, Properties)
          defineProperties: $defineProperties,
          // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
          getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
          // 19.1.2.7 Object.getOwnPropertyNames(O)
          getOwnPropertyNames: $getOwnPropertyNames,
          // 19.1.2.8 Object.getOwnPropertySymbols(O)
          getOwnPropertySymbols: $getOwnPropertySymbols
        });

        // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
        // https://bugs.chromium.org/p/v8/issues/detail?id=3443
        var FAILS_ON_PRIMITIVES = $fails(function () {
          $GOPS.f(1);
        });

        $export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
          getOwnPropertySymbols: function getOwnPropertySymbols(it) {
            return $GOPS.f(toObject(it));
          }
        });

        // 24.3.2 JSON.stringify(value [, replacer [, space]])
        $JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
          var S = $Symbol();
          // MS Edge converts symbol values to JSON as {}
          // WebKit converts symbol values to JSON as null
          // V8 throws on boxed symbols
          return _stringify([S]) != '[null]' || _stringify({
            a: S
          }) != '{}' || _stringify(Object(S)) != '{}';
        })), 'JSON', {
          stringify: function stringify(it) {
            var args = [it];
            var i = 1;
            var replacer, $replacer;
            while (arguments.length > i) args.push(arguments[i++]);
            $replacer = replacer = args[1];
            if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
            if (!isArray(replacer)) replacer = function (key, value) {
              if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
              if (!isSymbol(value)) return value;
            };
            args[1] = replacer;
            return _stringify.apply($JSON, args);
          }
        });

        // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
        $Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__("8ce0")($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
        // 19.4.3.5 Symbol.prototype[@@toStringTag]
        setToStringTag($Symbol, 'Symbol');
        // 20.2.1.9 Math[@@toStringTag]
        setToStringTag(Math, 'Math', true);
        // 24.3.3 JSON[@@toStringTag]
        setToStringTag(global.JSON, 'JSON', true);


        /***/
      }),

    /***/
    "d2c8":
      /***/
      (function (module, exports, __webpack_require__) {

        // helper for String#{startsWith, endsWith, includes}
        var isRegExp = __webpack_require__("aae3");
        var defined = __webpack_require__("be13");

        module.exports = function (that, searchString, NAME) {
          if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
          return String(defined(that));
        };


        /***/
      }),

    /***/
    "d2d6":
      /***/
      (function (module, exports, __webpack_require__) {

        // all enumerable object keys, includes symbols
        var getKeys = __webpack_require__("7633");
        var gOPS = __webpack_require__("31c2");
        var pIE = __webpack_require__("d74e");
        module.exports = function (it) {
          var result = getKeys(it);
          var getSymbols = gOPS.f;
          if (getSymbols) {
            var symbols = getSymbols(it);
            var isEnum = pIE.f;
            var i = 0;
            var key;
            while (symbols.length > i)
              if (isEnum.call(it, key = symbols[i++])) result.push(key);
          }
          return result;
        };


        /***/
      }),

    /***/
    "d3f4":
      /***/
      (function (module, exports) {

        module.exports = function (it) {
          return typeof it === 'object' ? it !== null : typeof it === 'function';
        };


        /***/
      }),

    /***/
    "d53b":
      /***/
      (function (module, exports) {

        module.exports = function (done, value) {
          return {
            value: value,
            done: !!done
          };
        };


        /***/
      }),

    /***/
    "d74e":
      /***/
      (function (module, exports) {

        exports.f = {}.propertyIsEnumerable;


        /***/
      }),

    /***/
    "d782":
      /***/
      (function (module, exports) {

        module.exports = function (exec) {
          try {
            return !!exec();
          } catch (e) {
            return true;
          }
        };


        /***/
      }),

    /***/
    "d876":
      /***/
      (function (module, exports, __webpack_require__) {

        // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
        var $keys = __webpack_require__("2695");
        var hiddenKeys = __webpack_require__("0029").concat('length', 'prototype');

        exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
          return $keys(O, hiddenKeys);
        };


        /***/
      }),

    /***/
    "d8e8":
      /***/
      (function (module, exports) {

        module.exports = function (it) {
          if (typeof it != 'function') throw TypeError(it + ' is not a function!');
          return it;
        };


        /***/
      }),

    /***/
    "da3c":
      /***/
      (function (module, exports) {

        // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
        var global = module.exports = typeof window != 'undefined' && window.Math == Math ?
          window : typeof self != 'undefined' && self.Math == Math ? self
          // eslint-disable-next-line no-new-func
          :
          Function('return this')();
        if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


        /***/
      }),

    /***/
    "dcbc":
      /***/
      (function (module, exports, __webpack_require__) {

        var redefine = __webpack_require__("2aba");
        module.exports = function (target, src, safe) {
          for (var key in src) redefine(target, key, src[key], safe);
          return target;
        };


        /***/
      }),

    /***/
    "dd40":
      /***/
      (function (module, exports) {

        module.exports = function (originalModule) {
          if (!originalModule.webpackPolyfill) {
            var module = Object.create(originalModule);
            // module.parent = undefined by default
            if (!module.children) module.children = [];
            Object.defineProperty(module, "loaded", {
              enumerable: true,
              get: function () {
                return module.l;
              }
            });
            Object.defineProperty(module, "id", {
              enumerable: true,
              get: function () {
                return module.i;
              }
            });
            Object.defineProperty(module, "exports", {
              enumerable: true
            });
            module.webpackPolyfill = 1;
          }
          return module;
        };


        /***/
      }),

    /***/
    "e11e":
      /***/
      (function (module, exports) {

        // IE 8- don't enum bug keys
        module.exports = (
          'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
        ).split(',');


        /***/
      }),

    /***/
    "e341":
      /***/
      (function (module, exports, __webpack_require__) {

        var $export = __webpack_require__("d13f");
        // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
        $export($export.S + $export.F * !__webpack_require__("7d95"), 'Object', {
          defineProperty: __webpack_require__("3adc").f
        });


        /***/
      }),

    /***/
    "e4a9":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var LIBRARY = __webpack_require__("b457");
        var $export = __webpack_require__("d13f");
        var redefine = __webpack_require__("2312");
        var hide = __webpack_require__("8ce0");
        var Iterators = __webpack_require__("b22a");
        var $iterCreate = __webpack_require__("5ce7");
        var setToStringTag = __webpack_require__("c0d8");
        var getPrototypeOf = __webpack_require__("ff0c");
        var ITERATOR = __webpack_require__("1b55")('iterator');
        var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
        var FF_ITERATOR = '@@iterator';
        var KEYS = 'keys';
        var VALUES = 'values';

        var returnThis = function () {
          return this;
        };

        module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
          $iterCreate(Constructor, NAME, next);
          var getMethod = function (kind) {
            if (!BUGGY && kind in proto) return proto[kind];
            switch (kind) {
              case KEYS:
                return function keys() {
                  return new Constructor(this, kind);
                };
              case VALUES:
                return function values() {
                  return new Constructor(this, kind);
                };
            }
            return function entries() {
              return new Constructor(this, kind);
            };
          };
          var TAG = NAME + ' Iterator';
          var DEF_VALUES = DEFAULT == VALUES;
          var VALUES_BUG = false;
          var proto = Base.prototype;
          var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
          var $default = $native || getMethod(DEFAULT);
          var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
          var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
          var methods, key, IteratorPrototype;
          // Fix native
          if ($anyNative) {
            IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
            if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
              // Set @@toStringTag to native iterators
              setToStringTag(IteratorPrototype, TAG, true);
              // fix for some old engines
              if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
            }
          }
          // fix Array#{values, @@iterator}.name in V8 / FF
          if (DEF_VALUES && $native && $native.name !== VALUES) {
            VALUES_BUG = true;
            $default = function values() {
              return $native.call(this);
            };
          }
          // Define iterator
          if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
            hide(proto, ITERATOR, $default);
          }
          // Plug for library
          Iterators[NAME] = $default;
          Iterators[TAG] = returnThis;
          if (DEFAULT) {
            methods = {
              values: DEF_VALUES ? $default : getMethod(VALUES),
              keys: IS_SET ? $default : getMethod(KEYS),
              entries: $entries
            };
            if (FORCED)
              for (key in methods) {
                if (!(key in proto)) redefine(proto, key, methods[key]);
              } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
          }
          return methods;
        };


        /***/
      }),

    /***/
    "e5fa":
      /***/
      (function (module, exports) {

        // 7.2.1 RequireObjectCoercible(argument)
        module.exports = function (it) {
          if (it == undefined) throw TypeError("Can't call method on  " + it);
          return it;
        };


        /***/
      }),

    /***/
    "ebd6":
      /***/
      (function (module, exports, __webpack_require__) {

        // 7.3.20 SpeciesConstructor(O, defaultConstructor)
        var anObject = __webpack_require__("cb7c");
        var aFunction = __webpack_require__("d8e8");
        var SPECIES = __webpack_require__("2b4c")('species');
        module.exports = function (O, D) {
          var C = anObject(O).constructor;
          var S;
          return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
        };


        /***/
      }),

    /***/
    "ec5b":
      /***/
      (function (module, exports, __webpack_require__) {

        __webpack_require__("e341");
        var $Object = __webpack_require__("a7d3").Object;
        module.exports = function defineProperty(it, key, desc) {
          return $Object.defineProperty(it, key, desc);
        };


        /***/
      }),

    /***/
    "f2fe":
      /***/
      (function (module, exports) {

        module.exports = function (it) {
          if (typeof it != 'function') throw TypeError(it + ' is not a function!');
          return it;
        };


        /***/
      }),

    /***/
    "f568":
      /***/
      (function (module, exports, __webpack_require__) {

        var dP = __webpack_require__("3adc");
        var anObject = __webpack_require__("0f89");
        var getKeys = __webpack_require__("7633");

        module.exports = __webpack_require__("7d95") ? Object.defineProperties : function defineProperties(O, Properties) {
          anObject(O);
          var keys = getKeys(Properties);
          var length = keys.length;
          var i = 0;
          var P;
          while (length > i) dP.f(O, P = keys[i++], Properties[P]);
          return O;
        };


        /***/
      }),

    /***/
    "f605":
      /***/
      (function (module, exports) {

        module.exports = function (it, Constructor, name, forbiddenField) {
          if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
            throw TypeError(name + ': incorrect invocation!');
          }
          return it;
        };


        /***/
      }),

    /***/
    "f6fd":
      /***/
      (function (module, exports) {

        // document.currentScript polyfill by Adam Miller

        // MIT license

        (function (document) {
          var currentScript = "currentScript",
            scripts = document.getElementsByTagName('script'); // Live NodeList collection

          // If browser needs currentScript polyfill, add get currentScript() to the document object
          if (!(currentScript in document)) {
            Object.defineProperty(document, currentScript, {
              get: function () {

                // IE 6-10 supports script readyState
                // IE 10+ support stack trace
                try {
                  throw new Error();
                } catch (err) {

                  // Find the second match for the "at" string to get file src url from stack.
                  // Specifically works with the format of stack traces in IE.
                  var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

                  // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
                  for (i in scripts) {
                    if (scripts[i].src == res || scripts[i].readyState == "interactive") {
                      return scripts[i];
                    }
                  }

                  // If no match, return null
                  return null;
                }
              }
            });
          }
        })(document);


        /***/
      }),

    /***/
    "f751":
      /***/
      (function (module, exports, __webpack_require__) {

        // 19.1.3.1 Object.assign(target, source)
        var $export = __webpack_require__("5ca1");

        $export($export.S + $export.F, 'Object', {
          assign: __webpack_require__("7333")
        });


        /***/
      }),

    /***/
    "f845":
      /***/
      (function (module, exports) {

        module.exports = function (bitmap, value) {
          return {
            enumerable: !(bitmap & 1),
            configurable: !(bitmap & 2),
            writable: !(bitmap & 4),
            value: value
          };
        };


        /***/
      }),

    /***/
    "fa54":
      /***/
      (function (module, exports, __webpack_require__) {

        "use strict";

        var addToUnscopables = __webpack_require__("b3e7");
        var step = __webpack_require__("245b");
        var Iterators = __webpack_require__("b22a");
        var toIObject = __webpack_require__("6a9b");

        // 22.1.3.4 Array.prototype.entries()
        // 22.1.3.13 Array.prototype.keys()
        // 22.1.3.29 Array.prototype.values()
        // 22.1.3.30 Array.prototype[@@iterator]()
        module.exports = __webpack_require__("e4a9")(Array, 'Array', function (iterated, kind) {
          this._t = toIObject(iterated); // target
          this._i = 0; // next index
          this._k = kind; // kind
          // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
        }, function () {
          var O = this._t;
          var kind = this._k;
          var index = this._i++;
          if (!O || index >= O.length) {
            this._t = undefined;
            return step(1);
          }
          if (kind == 'keys') return step(0, index);
          if (kind == 'values') return step(0, O[index]);
          return step(0, [index, O[index]]);
        }, 'values');

        // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
        Iterators.Arguments = Iterators.Array;

        addToUnscopables('keys');
        addToUnscopables('values');
        addToUnscopables('entries');


        /***/
      }),

    /***/
    "fa5b":
      /***/
      (function (module, exports, __webpack_require__) {

        module.exports = __webpack_require__("5537")('native-function-to-string', Function.toString);


        /***/
      }),

    /***/
    "fab2":
      /***/
      (function (module, exports, __webpack_require__) {

        var document = __webpack_require__("7726").document;
        module.exports = document && document.documentElement;


        /***/
      }),

    /***/
    "fb15":
      /***/
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);

        // CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
        // This file is imported into lib/wc client bundles.

        if (typeof window !== 'undefined') {
          if (true) {
            __webpack_require__("f6fd")
          }

          var setPublicPath_i
          if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
            __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
          }
        }

        // Indicate to webpack that this file can be concatenated
        /* harmony default export */
        var setPublicPath = (null);

        // EXTERNAL MODULE: ./src/platform/kernel/qt/plugins/device.js
        var device = __webpack_require__("5710");

        // EXTERNAL MODULE: ./src/platform/kernel/qt/tunnel-proxy.js
        var tunnel_proxy = __webpack_require__("6c67");

        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/log.js
        var psPlugin = window.psPlugin || {};

        var INNER_MODULE_NAME = 'GWILog';
        var PLUGIN_DLL_NAME = 'GWILog';
        /**
         * 插件接口类
         * @module psPlugin.log
         */

        psPlugin.log = {
          info: function info(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, INNER_MODULE_NAME, "info", content);
          },
          debug: function debug(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, INNER_MODULE_NAME, "debug", content);
          },
          error: function error(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, INNER_MODULE_NAME, "error", content);
          },
          warn: function warn(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, INNER_MODULE_NAME, "warn", content);
          },
          trace: function trace(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, INNER_MODULE_NAME, "trace", content);
          },
          exec: function exec(successCallBack, errorCallback, obj, method, content) {
            return tunnel_proxy["a" /* default */ ].exec(successCallBack, errorCallback, PLUGIN_DLL_NAME, "execute", [obj, method, content]);
          }
        };
        /* harmony default export */
        var log = (psPlugin.log);
        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/flowlog.js
        var flowlog_psPlugin = window.psPlugin || {};

        var flowlog_INNER_MODULE_NAME = 'flowGWILog';
        var flowlog_PLUGIN_DLL_NAME = 'GWILog';
        /**
         * 插件接口类
         * @module psPlugin.flowlog
         */

        flowlog_psPlugin.flowlog = {
          info: function info(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, flowlog_INNER_MODULE_NAME, "info", content);
          },
          debug: function debug(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, flowlog_INNER_MODULE_NAME, "debug", content);
          },
          error: function error(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, flowlog_INNER_MODULE_NAME, "error", content);
          },
          warn: function warn(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, flowlog_INNER_MODULE_NAME, "warn", content);
          },
          trace: function trace(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, flowlog_INNER_MODULE_NAME, "trace", content);
          },
          exec: function exec(successCallBack, errorCallback, obj, method, content) {
            return tunnel_proxy["a" /* default */ ].exec(successCallBack, errorCallback, flowlog_PLUGIN_DLL_NAME, "execute", [obj, method, content]);
          }
        };
        /* harmony default export */
        var flowlog = (flowlog_psPlugin.flowlog);
        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/operatelog.js
        var operatelog_psPlugin = window.psPlugin || {};

        var operatelog_INNER_MODULE_NAME = 'operateGWILog';
        var operatelog_PLUGIN_DLL_NAME = 'GWILog';
        operatelog_psPlugin.operatelog = {
          info: function info(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, operatelog_INNER_MODULE_NAME, "info", content);
          },
          debug: function debug(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, operatelog_INNER_MODULE_NAME, "debug", content);
          },
          error: function error(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, operatelog_INNER_MODULE_NAME, "error", content);
          },
          warn: function warn(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, operatelog_INNER_MODULE_NAME, "warn", content);
          },
          trace: function trace(successCallBack, errorCallback, content) {
            this.exec(successCallBack, errorCallback, operatelog_INNER_MODULE_NAME, "trace", content);
          },
          exec: function exec(successCallBack, errorCallback, obj, method, content) {
            return tunnel_proxy["a" /* default */ ].exec(successCallBack, errorCallback, operatelog_PLUGIN_DLL_NAME, "execute", [obj, method, content]);
          }
        };
        /* harmony default export */
        var operatelog = (operatelog_psPlugin.operatelog);
        // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.split.js
        var es6_regexp_split = __webpack_require__("28a5");

        // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.promise.js
        var es6_promise = __webpack_require__("551c");

        // EXTERNAL MODULE: external {"commonjs":"lodash","commonjs2":"lodash","amd":"lodash","root":"_"}
        var external_commonjs_lodash_commonjs2_lodash_amd_lodash_root_ = __webpack_require__("60bb");

        // EXTERNAL MODULE: external {"commonjs":"@/config/config","commonjs2":"@/config/config","amd":"@/config/config","root":"Config"}
        var config_root_Config_ = __webpack_require__("5547");
        var config_root_Config_default = /*#__PURE__*/ __webpack_require__.n(config_root_Config_);

        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/plugin.js

        var plugin_psPlugin = window.psPlugin || {};



        var GlobalConfig = {
          deviceMode: 'qt',
          usePlugins: true,
          pluginsDemo: false
        };

        if (config_root_Config_default.a) {
          GlobalConfig = config_root_Config_default.a;
        }

        var pluginName = GlobalConfig.nativePluginName || (GlobalConfig.deviceMode == 'qt' ? 'GWI_Plugin' : 'LocalUtilsPlugin');
        var timeout = 20000;

        function promiseHelper(method, params, dllName) {
          params = params || [];
          var promise = new Promise(function (resolve, reject) {
            try {
              if (!GlobalConfig.usePlugins || GlobalConfig.pluginsDemo) {
                resolve.apply(null, [{
                  "success": "true",
                  "data": {},
                  "description": "just mock return by psPlugin.plugin",
                  "value": "0.68"
                }]);
                return;
              }

              tunnel_proxy["b" /* tunnelAsync */ ].exec(function () {
                resolve.apply(null, arguments);
              }, function () {
                reject.apply(null, arguments);
              }, dllName || pluginName, method, params);
            } catch (e) {
              reject(e);
            }
          });
          return promise;
        }
        /**
         * 插件接口类
         * @module psPlugin.plugin
         */


        plugin_psPlugin.plugin = {
          /**
           * 配置(方便继承使用)
           */
          config: GlobalConfig,

          /**
           * 同步执行接口
           * @param {*} moduleName 内部模块名
           * @param {*} method 方法
           * @param {*} args 参数 {*}
           * @param {*} dllName 插件动态库名（默认不需要传则使用GWI_Plugin）
           * @function execSync
           */
          execSync: function execSync(moduleName, method, args, dllName, successCallBack, errorCallback) {
            if (!GlobalConfig.usePlugins || GlobalConfig.pluginsDemo) {
              return '{"success": true, "data": {}, "description": "just mock return by psPlugin.plugin", "value": "0.68"}';
            }

            if ('qt' == GlobalConfig.deviceMode) {
              // qt方式采用prompt同步
              return Object(tunnel_proxy["c" /* tunnelSync */ ])(dllName || pluginName, 'execute', moduleName, method, args);
            } else {
              // tunnelAsync 同步调用
              var bSync = true; // 同步调用

              return tunnel_proxy["b" /* tunnelAsync */ ].exec(successCallBack, errorCallback, dllName || pluginName, 'execute', [moduleName, method, JSON.stringify(args || {}), timeout], bSync);
            }
          },

          /**
           * 异步执行接口
           * @param {*} moduleName 内部模块名
           * @param {*} method 方法
           * @param {*} args 参数 {*}
           * @param {*} dllName 插件动态库名（默认不需要传则使用GWI_Plugin）
           * @function exec
           */
          exec: function exec(successCallBack, errorCallback, moduleName, method, args, dllName) {
            if (!GlobalConfig.usePlugins || GlobalConfig.pluginsDemo) {
              successCallBack({
                "success": true,
                "data": {},
                "description": "just mock return by psPlugin.plugin",
                "value": "0.68"
              });
              return;
            }

            if ('qt' == GlobalConfig.deviceMode) {
              return tunnel_proxy["b" /* tunnelAsync */ ].exec(successCallBack, errorCallback, dllName || pluginName, 'execute', [moduleName, method, JSON.stringify(args || {})]);
            } else {
              return tunnel_proxy["b" /* tunnelAsync */ ].exec(successCallBack, errorCallback, dllName || pluginName, 'execute', [moduleName, method, JSON.stringify(args || {}), timeout]);
            }
          },

          /**
           * Promise异步执行接口
           * @param {*} moduleName 内部模块名
           * @param {*} method 方法
           * @param {*} args 参数 {*}
           * @param {*} dllName 插件动态库名（默认不需要传则使用GWI_Plugin）
           * @function execPromise
           */
          execPromise: function execPromise(moduleName, method, args, dllName) {
            var promise = null;

            if ('qt' == GlobalConfig.deviceMode) {
              promise = promiseHelper('execute', [moduleName, method, JSON.stringify(args || {})], dllName);
            } else {
              promise = promiseHelper('execute', [moduleName, method, JSON.stringify(args || {}), timeout], dllName);
            }

            return promise;
          },
          extend: function extend(extendedObj) {
            function _extend(o, n) {
              for (var p in o) {
                n[p] = o[p];
              }

              return n;
            }

            return _extend(extendedObj, this);
          }
        };
        /* harmony default export */
        var plugins_plugin = (plugin_psPlugin.plugin);
        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/file.js

        var file_psPlugin = window.psPlugin || {};

        var file_INNER_MODULE_NAME = 'psPluginFile';
        /**
         * 插件接口类
         * @module psPlugin.file
         */

        file_psPlugin.file = plugins_plugin.extend({
          /**
           * 读取ini文件
           * @param {Object} args 输入参数 filename 配置文件名; section 要读取的区间; key 要读取的项; value 默认值  格式：{'filename':'',section:'','key':'','value':''} 
           * 
           */
          readini: function readini(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'readini', args);
          },

          /**
           * 写ini文件
           * @param {Object} args 输入参数 filename 配置文件名; section:要设置的区间; key 要设置的项; value 值  格式：{'filename':'',section:'','key':'','value':''} 
           */
          writeini: function writeini(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'writeini', args);
          },

          /**
           * 读取属性文件*.properties
           * @param {Object} args 输入参数 filename 配置文件名; key 要读取的项; value 默认值  格式：{'filename':'','key':'','value':''} 
           */
          readproperties: function readproperties(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'readproperties', args);
          },

          /**
           * 写属性文件*.properties
           * @param {Object} args 输入参数 filename 配置文件名; key 要读取的项; value 默认值  格式：{'filename':'','key':'','value':''} 
           */
          writeproperties: function writeproperties(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'writeproperties', args);
          },
          readxml: function readxml(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'readxml', args);
          },
          writexml: function writexml(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'writexml', args);
          },
          createfolder: function createfolder(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'createfolder', args);
          },
          deletefolder: function deletefolder(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'deletefolder', args);
          },
          createfile: function createfile(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'createfile', args);
          },
          deletefile: function deletefile(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'deletefile', args);
          },
          readfile: function readfile(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'readfile', args);
          },
          readfileSync: function readfileSync(args) {
            return this.execSync(file_INNER_MODULE_NAME, 'readfile', args);
          },
          writefile: function writefile(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'writefile', args);
          },
          writefileSync: function writefileSync(args) {
            return this.execSync(file_INNER_MODULE_NAME, 'writefile', args);
          },
          copyfile: function copyfile(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'copyfile', args);
          },
          movefile: function movefile(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'movefile', args);
          },
          checkfolder: function checkfolder(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'checkfolder', args);
          },
          checkfile: function checkfile(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'checkfile', args);
          },

          /**
           * 读取文件内容为base64串
           * @param {Object} args 输入参数 {} 
           */
          readfile64: function readfile64(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'readfile64', args);
          },
          base64tofile: function base64tofile(args) {
            return this.execPromise(file_INNER_MODULE_NAME, '64tofile', args);
          },

          /**
           * 图片格式转换
           */
          transferimg: function transferimg(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'transferimg', args);
          },

          /**
           * 修改图片dpi值
           */
          altpicdpi: function altpicdpi(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'altpicdpi', args);
          },

          /**
           * 旋转图片
           */
          rotatepic: function rotatepic(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'rotatepic', args);
          },

          /**
           * 拼接图片
           * @param {Object} args  输入参数 {"srcfile": "file1|file2|file3|...","destfile":"","cattype":""}
           * srcfile 原图片文件列表，用'|'分隔；
           * destfile 目标图片文件；
           * cattype 旋转角度 0:垂直方向拼接；1：横向拼接；2：一行两张拼接；3：一行三张拼接;
           */
          catpic: function catpic(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'catpic', args);
          },

          /**
           * 获取文件md5值
           * @param {Object}}  args 输入参数 {"filename": "D:/file.ini"} 
           */
          getmd5: function getmd5(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'getmd5', args);
          },

          /**
           * 获取文件二进制数据
           * @param {Object} args 输入参数 {"fullpath":"d:/1.jpg"} 
           */
          readbinaryfile: function readbinaryfile(args) {
            return this.execPromise(file_INNER_MODULE_NAME, 'readbinaryfile', args, 'filesystem');
          },

          /**
           * 自动创建多层目录
           * @param {Object}  args 输入参数 '{"path": "D:/psPlugin/zip/"}' 
           */
          mkdirs: function mkdirs(args) {
            var fullPath = args.path;
            var directories = fullPath.split('/');
            var dynamicPath = '';

            var _meObj = this;

            function loopArray(x) {
              dynamicPath += directories[x] + '/';
              return _meObj.createfolder({
                path: dynamicPath
              }).then(function (res) {
                x++;

                if (x < directories.length) {
                  console.log("当前异步完成了，可以进行下次循环");
                  return loopArray(x);
                } else {
                  return res;
                }
              }).catch(function () {});
            }

            return loopArray(0);
          }
        });
        /* harmony default export */
        var file = (file_psPlugin.file);
        // EXTERNAL MODULE: ./src/platform/kernel/qt/plugins/crypter.js
        var crypter = __webpack_require__("9050");
        var crypter_default = /*#__PURE__*/ __webpack_require__.n(crypter);

        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/db.js

        var db_psPlugin = window.psPlugin || {};


        var db_GlobalConfig = {
          deviceMode: 'qt',
          usePlugins: true,
          pluginsDemo: false,
          nativeHttpTimeout: 30000
        };

        if (config_root_Config_default.a && config_root_Config_default.a.nativeHttpTimeout) {
          db_GlobalConfig = config_root_Config_default.a;
        }

        var nativeHttpTimeout = db_GlobalConfig.nativeHttpTimeout;
        var NATIVE_HTTP_URL_DB_SELECT = 'http://localhost:38080/selectsql';
        var NATIVE_HTTP_URL_DB_UPDATE = 'http://localhost:38080/updatesql';
        /**
         * http websocket方式通讯
         * @param {*} sendData 发送数据
         * @param {Boolean} bAsync 是否异步请求
         */

        function httpCall(url, sendData, bAsync, successCallback, errorCallback) {
          var response = "";
          var xmlhttp = new XMLHttpRequest();

          if (bAsync) {
            try {
              xmlhttp.timeout = nativeHttpTimeout;

              xmlhttp.ontimeout = function (e) {
                console.warn("sendHttpWebSocket.ontimeout: ");
                console.warn(e);
                errorCallback(xmlhttp);
              };
            } catch (error) {
              console.error(error);
            }
          }

          xmlhttp.onerror = function (e) {
            console.error("sendHttpWebSocket.onerror: ");
            console.error(e);

            if (bAsync) {
              errorCallback(xmlhttp);
            }
          };

          var baseUrl = url;

          xmlhttp.onreadystatechange = function () {
            if ((xmlhttp.status == 200 || xmlhttp.status == 0) && xmlhttp.readyState == 4) {
              response = xmlhttp.responseText;

              if (response && bAsync && errorCallback) {
                successCallback(response);
              }
            } else if (xmlhttp.status == 400) {
              console.warn("Bad Request(parameter is not json format)");

              if (bAsync && errorCallback) {
                errorCallback(xmlhttp);
              }
            } else if (xmlhttp.status == 500) {
              console.warn("Bad Request(parameter is not json array)");

              if (bAsync && errorCallback) {
                errorCallback(xmlhttp);
              } else {
                console.warn(xmlhttp.status);
              }
            }
          };

          xmlhttp.open("POST", baseUrl, bAsync);
          xmlhttp.setRequestHeader("Content-type", "application/json");
          xmlhttp.send(sendData);
          return response;
        }

        function db_promiseHelper(doThing, url, sendData, bAsync) {
          var promise = new Promise(function (resolve, reject) {
            if (doThing) {
              httpCall(url, JSON.stringify(sendData), bAsync, function (res) {
                resolve.apply(null, [JSON.parse(res)]);
              }, function (err) {
                reject.apply(null, [err]);
              });
            } else {
              resolve.apply(null, [{
                "success": "true",
                "data": {},
                "description": "just mock return by psPlugin.db",
                "value": "0.68"
              }]);
            }
          });
          return promise;
        }

        var db_INNER_MODULE_NAME = 'psPluginDb';
        /**
         * 插件接口类
         * @module psPlugin.db
         */

        db_psPlugin.db = plugins_plugin.extend({
          open: function open(args) {
            if (this.config.useDbHttpService) {
              return db_promiseHelper();
            } else {
              return this.execPromise(db_INNER_MODULE_NAME, 'open', args);
            }
          },
          exeselect: function exeselect(args) {
            if (this.config.useDbHttpService) {
              if (args) {
                args.filename = this.config.localDBPath;
              } else {
                console.warn('no args pass!!!');
                return null;
              }

              return db_promiseHelper(true, this.config.dbSelectUrl || NATIVE_HTTP_URL_DB_SELECT, args, true);
            } else {
              return this.execPromise(db_INNER_MODULE_NAME, 'exeselect', args);
            }
          },
          exeselectSync: function exeselectSync(args) {
            return this.execSync(db_INNER_MODULE_NAME, 'exeselect', args);
          },
          exeupdate: function exeupdate(args) {
            // console.debug('exeupdate.args:' + JSON.stringify(args));
            if (this.config.useDbHttpService) {
              if (args) {
                args.filename = this.config.localDBPath;
              } else {
                console.warn('no args pass!!!');
                return null;
              }

              return db_promiseHelper(true, this.config.dbUpdateUrl || NATIVE_HTTP_URL_DB_UPDATE, args, true);
            } else {
              return this.execPromise(db_INNER_MODULE_NAME, 'exeupdate', args);
            }
          },
          exeupdateSync: function exeupdateSync(args) {
            // console.debug('exeupdateSync.args:' + JSON.stringify(args));
            return this.execSync(db_INNER_MODULE_NAME, 'exeupdate', args);
          },
          close: function close(args) {
            if (this.config.useDbHttpService) {
              return db_promiseHelper();
            } else {
              return this.execPromise(db_INNER_MODULE_NAME, 'close', args);
            }
          }
        });
        /* harmony default export */
        var db = (db_psPlugin.db);
        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/facereco.js
        var facereco_psPlugin = window.psPlugin || {};

        facereco_psPlugin.facereco = plugins_plugin.extend({
          /**
           * 人脸比对（同步方法）
           * @param {*} args  {"filename1":"文件1全路径","filename2":"文件2全路径"}    
           */
          facecheckSync: function facecheckSync(args) {
            return this.execSync('faceRecognitionplugins', 'facecheck', args, 'faceRecognitionplugins');
          }
        });
        /* harmony default export */
        var facereco = (facereco_psPlugin.facereco);
        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/ftp.js
        var ftp_psPlugin = window.psPlugin || {};

        var ftp_INNER_MODULE_NAME = 'psPluginFtp';
        ftp_psPlugin.ftp = plugins_plugin.extend({
          ftpopen: function ftpopen(args) {
            return this.execPromise(ftp_INNER_MODULE_NAME, 'ftpopen', args);
          },
          cd: function cd(args) {
            return this.execPromise(ftp_INNER_MODULE_NAME, 'cd', args);
          },
          uploaddir: function uploaddir(args) {
            return this.execPromise(ftp_INNER_MODULE_NAME, 'uploaddir', args);
          },
          uploadfile: function uploadfile(args) {
            return this.execPromise(ftp_INNER_MODULE_NAME, 'uploadfile', args);
          },
          downloaddir: function downloaddir(args) {
            return this.execPromise(ftp_INNER_MODULE_NAME, 'downloaddir', args);
          },
          downloadfile: function downloadfile(args) {
            return this.execPromise(ftp_INNER_MODULE_NAME, 'downloadfile', args);
          },
          ftpclose: function ftpclose(args) {
            return this.execPromise(ftp_INNER_MODULE_NAME, 'ftpclose', args);
          }
        });
        /* harmony default export */
        var ftp = (ftp_psPlugin.ftp);
        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/netkit.js
        var netkit_psPlugin = window.psPlugin || {};

        var netkit_INNER_MODULE_NAME = 'psPluginNetKit';
        /**
         * 插件接口类
         * @module psPlugin.netkit
         */

        netkit_psPlugin.netkit = plugins_plugin.extend({
          getlocalip: function getlocalip(args) {
            return this.execPromise(netkit_INNER_MODULE_NAME, 'getlocalip', args);
          },
          getmac: function getmac(args) {
            return this.execPromise(netkit_INNER_MODULE_NAME, 'getmac', args);
          },

          /**
           * 获取cpuid，与agent获取cpuid规则一致，保证注册终端与agent一致 
           * @param {*} args 空即可
           * @returns {Object} 返回值 {success: true, errno: "0000000000", data: "54E1ABCF120A", description: "描述"}
           */
          getcpuid: function getcpuid(args) {
            return this.execPromise(netkit_INNER_MODULE_NAME, 'getcpuid', args);
          },

          /**
           * 获取ip、mac映射 
           * @param {*} args 空即可
           * @returns {Object} 返回值 {success: true, errno: "0000000000", data: [{IP: "", MAC: ""}, {IP: "", MAC: ""}], description: "描述"}
           */
          getipmac: function getipmac(args) {
            return this.execPromise(netkit_INNER_MODULE_NAME, 'getipmac', args);
          },
          getMacAddress: function getMacAddress(successCallback, failureCallback, args) {
            return this.exec(successCallback, failureCallback, netkit_INNER_MODULE_NAME, 'getMacAddress', args);
          },
          getIpAddress: function getIpAddress(successCallback, failureCallback, args) {
            return this.exec(successCallback, failureCallback, netkit_INNER_MODULE_NAME, 'getIpAddress', args);
          },

          /**
           * url下载文件
           * @param {*} args {url: 'http://localhost:8080/pdf/test.pdf', path: 'D:/KIOSK/Data/pdf/test.pdf', timeout: 30000} 
           */
          urldownloadfile: function urldownloadfile(args) {
            return this.execPromise(netkit_INNER_MODULE_NAME, 'urldownloadfile', args);
          }
        });
        /* harmony default export */
        var netkit = (netkit_psPlugin.netkit);
        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/system.js
        var system_psPlugin = window.psPlugin || {};

        var system_INNER_MODULE_NAME = 'psPluginSystem';
        /**
         * 插件接口类
         * @module psPlugin.system
         */

        system_psPlugin.system = plugins_plugin.extend({
          /**
           * 获取系统时间
           * @param args {}
           *  
           */
          getsystime: function getsystime(args) {
            return this.execSync(system_INNER_MODULE_NAME, 'getsystime', args);
          },

          /**
           * 设置系统时间
           * @param {*} args  {"time": "20180504091200123"}
           */
          setsystime: function setsystime(args) {
            return this.execSync(system_INNER_MODULE_NAME, 'setsystime', args);
          },

          /**
           * 服务初始化
           * @param {*} args 
           */
          systeminit: function systeminit(successCallBack, errorCallback, args) {
            // advice:: args:timerflag=disable
            return this.exec(successCallBack, errorCallback, system_INNER_MODULE_NAME, 'systeminit', args);
          },

          /**
           * 服务空闲
           * @param {*} args 
           */
          systemfree: function systemfree(successCallBack, errorCallback, args) {
            // advice:: args:timerflag=enable
            return this.exec(successCallBack, errorCallback, system_INNER_MODULE_NAME, 'systemfree', args);
          },

          /**
           * 服务忙
           * @param {*} args 
           */
          systembusy: function systembusy(successCallBack, errorCallback, args) {
            // advice:: args:timerflag=disable
            return this.exec(successCallBack, errorCallback, system_INNER_MODULE_NAME, 'systembusy', args);
          },

          /**
           * 停止服务
           * @param {*} args 
           */
          systemstopservice: function systemstopservice(successCallBack, errorCallback, args) {
            // advice:: args:timerflag=enable
            return this.exec(successCallBack, errorCallback, system_INNER_MODULE_NAME, 'systemstopservice', args);
          },

          /**
           * 暂停服务
           * @param {*} args 
           */
          systempause: function systempause(successCallBack, errorCallback, args) {
            // advice:: args:timerflag=enable
            return this.exec(successCallBack, errorCallback, system_INNER_MODULE_NAME, 'systempause', args); // return prompt(([args]), "gap:" + (["psPluginSystem", "pause"]));
          },

          /**
           * 进入管理界面
           * @param {*} args 
           */
          systemmanaging: function systemmanaging(successCallBack, errorCallback, args) {
            // advice:: args:timerflag=disable
            return this.exec(successCallBack, errorCallback, system_INNER_MODULE_NAME, 'systemmanaging', args);
          },

          /**
           * 退出应用
           * @param {*} args 
           */
          desktop: function desktop(args) {
            return this.execPromise(system_INNER_MODULE_NAME, 'desktop', args);
          },

          /**
           * 重启
           * @param {*} args 
           */
          restart: function restart(args) {
            return this.execPromise(system_INNER_MODULE_NAME, 'restart', args);
          },

          /**
           * 关机
           * @param {*} args 
           */
          shutdown: function shutdown(args) {
            return this.execPromise(system_INNER_MODULE_NAME, 'shutdown', args);
          },

          /**
           * 执行程序
           * @param {*} args 
           */
          execprogram: function execprogram(args) {
            return this.execPromise(system_INNER_MODULE_NAME, 'exec', args);
          },

          /**
           * 获取系统屏幕信息
           * @param {*} args {}
           * @returns Promise then res {sucess: true, data: [{id: 1, main: true, model: 'NVIDIA GeForce GT 630', left: 0, top: 0, width: 1024, height: 768}, {id: 2, main: false, model: 'AMD', left: 1024, top: 0, width: 1024, height: 768]}
           */
          getscreeninfo: function getscreeninfo(args) {
            return this.execPromise(system_INNER_MODULE_NAME, 'getscreeninfo', args);
          }
        });
        /* harmony default export */
        var system = (system_psPlugin.system);
        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/zip.js
        var zip_psPlugin = window.psPlugin || {};

        /**
         * 插件接口类
         * @module psPlugin.zip
         */

        var zip_INNER_MODULE_NAME = 'psPluginZip';
        zip_psPlugin.zip = plugins_plugin.extend({
          zip: function zip(args) {
            return this.execPromise(zip_INNER_MODULE_NAME, 'zip', args);
          },
          unzip: function unzip(args) {
            return this.execPromise(zip_INNER_MODULE_NAME, 'unzip', args);
          }
        });
        /* harmony default export */
        var zip = (zip_psPlugin.zip);
        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/ime.js
        var ime_psPlugin = window.psPlugin || {};

        var ime_INNER_MODULE_NAME = 'IMEPlugin';
        var ime_PLUGIN_DLL_NAME = 'IMEPlugin';
        /**
         * 插件接口类
         * @module psPlugin.ime(输入法插件IMEPlugin)
         */

        ime_psPlugin.ime = plugins_plugin.extend({
          /**
           * 显示输入法
           * @param {*} args   参数：{ "mode":"启动的输入法布局（预留，可不传入）",  "width":宽度, "height":高度,  "x":左上角x坐标, "y":左上角y坐标 }
           */
          IMEShow: function IMEShow(args) {
            return this.execPromise(ime_INNER_MODULE_NAME, 'IMEShow', args, ime_PLUGIN_DLL_NAME);
          },

          /**
           * 隐藏输入法
           * @param {*} args  {}
           */
          IMEHide: function IMEHide(args) {
            return this.execPromise(ime_INNER_MODULE_NAME, 'IMEHide', args, ime_PLUGIN_DLL_NAME);
          }
        });
        /* harmony default export */
        var ime = (ime_psPlugin.ime);
        // CONCATENATED MODULE: ./src/platform/kernel/qt/plugins/version.js
        var version_psPlugin = window.psPlugin || {};

        /**
         * 插件接口类
         * @module psPlugin.version
         */

        var version_INNER_MODULE_NAME = 'psPluginVersion';
        version_psPlugin.version = plugins_plugin.extend({
          /**
           * 获取版本签名
           * @param {*} args  输入参数 path：版本路径  extInfo：扩展信息 outPath：版本信息输出目录 exts：版本包含文件的扩展名列表，冒号分割 excluded：版本不包含的文件的文件列表，冒号分割
           */
          signGen: function signGen(args) {
            return this.execPromise(version_INNER_MODULE_NAME, 'signGen', args);
          },

          /**
           * 检查版本
           * @param {*} args  输入参数 path：版本路径  md5Path：md5文件路径
           */
          checkVersion: function checkVersion(args) {
            return this.execPromise(version_INNER_MODULE_NAME, 'checkVersion', args);
          }
        });
        /* harmony default export */
        var version = (version_psPlugin.version);
        // CONCATENATED MODULE: ./src/platform/kernel/qt/index.js
















        var TunnelProxy = {
          tunnelAsync: tunnel_proxy["b" /* tunnelAsync */ ],
          tunnelSync: tunnel_proxy["c" /* tunnelSync */ ]
          /**
           * 插件导出
           * @module qt.plugin(插件导出列表)
           */

        };
        /* harmony default export */
        var qt = ({
          /**
           * 设备插件
           */
          DevicePlugin: device["a" /* default */ ],

          /**
           * 日志插件
           */
          LogPlugin: log,

          /**
           * 流水日志插件
           */
          FlowlogPlugin: flowlog,

          /**
           * 操作日志插件
           */
          OperatelogPlugin: operatelog,

          /**
           * 文件插件
           */
          FilePlugin: file,

          /**
           * 加密插件
           */
          CrypterPlugin: crypter_default.a,

          /**
           * 本地数据库插件
           */
          DbPlugin: db,

          /**
           * 人脸识别插件
           */
          FacerecoPlugin: facereco,

          /**
           * ftp插件
           */
          FtpPlugin: ftp,

          /**
           * 网络工具插件
           */
          NetkitPlugin: netkit,

          /**
           * 系统工具插件
           */
          SystemPlugin: system,

          /**
           * 压缩插件
           */
          ZipPlugin: zip,

          /**
           * 输入法插件
           */
          IMEPlugin: ime,

          /**
           * 版本校验插件
           */
          VersionPlugin: version,

          /**
           * 插件基类
           */
          Plugin: plugins_plugin,

          /**
           * 通道
           */
          TunnelProxy: TunnelProxy
        });
        // EXTERNAL MODULE: ./src/platform/kernel/device/modules/basedev.js + 2 modules
        var basedev = __webpack_require__("1d73");

        // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/classCallCheck.js
        var classCallCheck = __webpack_require__("d225");

        // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/createClass.js
        var createClass = __webpack_require__("b0b4");

        // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/possibleConstructorReturn.js + 1 modules
        var possibleConstructorReturn = __webpack_require__("308d");

        // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/getPrototypeOf.js
        var getPrototypeOf = __webpack_require__("6bb5");

        // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/inherits.js + 1 modules
        var inherits = __webpack_require__("4e2b");

        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/barcode.js






        /**
         * 条码扫描仪
         */

        var barcode_CBarcode =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CBarcode, _CBaseDev);

            function CBarcode(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CBarcode);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CBarcode).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 复位,异步接口
             *
             */


            Object(createClass["a" /* default */ ])(CBarcode, [{
              key: "Reset",
              value: function Reset() {
                return this.execute('Reset', {});
              }
              /**
               * 扫描条码，异步接口
               * @param BarcodeDataMode 数据格式, 0:数据直接返回, 1:数据以16进制格式返回
               * @param TimeOut 超时时间, 单位毫秒(ms), 取值为0, 永不超时
               */

            }, {
              key: "ScanBarcode",
              value: function ScanBarcode(BarcodeDataMode, TimeOut) {
                var param = {
                  BarcodeDataMode: BarcodeDataMode,
                  TimeOut: TimeOut
                };
                return this.execute('ScanBarcode', param);
              }
              /**
               * 取消扫描，异步接口
               */

            }, {
              key: "CancelScan",
              value: function CancelScan() {
                return this.execute('CancelScan', {});
              }
              /**
               * 异步更新状态
               */

            }, {
              key: "GetStatus",
              value: function GetStatus() {
                return this.execute('GetStatus', {});
              }
            }]);

            return CBarcode;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var barcode = (barcode_CBarcode);
        // EXTERNAL MODULE: ./src/platform/kernel/device/modules/cardreader.js
        var cardreader = __webpack_require__("bd26");

        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/carddispenser.js






        /**
         * 发卡机
         */

        var carddispenser_CCardDispenser =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CCardDispenser, _CBaseDev);

            function CCardDispenser(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CCardDispenser);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CCardDispenser).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                /**
                 * KEY移动事件
                 * @param param
                 */
                'CardMoved': function CardMoved(param) {
                  this.dispatchEvent('CardMoved', param);
                },

                /**
                 * KEY箱错误事件
                 * @param param
                 */
                'CardUnitError': function CardUnitError(param) {
                  this.dispatchEvent('CardUnitError', param);
                },

                /**
                 * KEY箱改变事件
                 * @param param
                 */
                'CardUnitInfoChanged': function CardUnitInfoChanged(param) {
                  this.dispatchEvent('CardUnitInfoChanged', param);
                },

                /**
                 * KEY箱阈值事件
                 * @param param
                 */
                'CardUnitThreshold': function CardUnitThreshold(param) {
                  this.dispatchEvent('CardUnitThreshold', param);
                },

                /**
                 * 复位时介质检测事件
                 * @param param
                 */
                'MediaDetected': function MediaDetected(param) {
                  this.dispatchEvent('MediaDetected', param);
                },

                /**
                 * 介质移走事件
                 * @param param
                 */
                'UKeyTaken': function UKeyTaken(param) {
                  this.dispatchEvent('UKeyTaken', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 异步吞卡
             * @param {number} usNumber 回收箱号, 由设备决定
             * @returns 吞卡完成事件 CaptureOver( string &pszParam)
                其中pszParam JSON串参数：
                RequestID:请求ID
                dwCommandCode:指令ID
                eventType:事件ID
                eventName:事件名 CaptureOver
                result:执行结果，0表示成功，其他参考错误码
                { "RequestID":13, "dwCommandCode":1403, "eventName":"CaptureOver", "eventType":1032, "result":0 }
             * @example 入参示例
                var pszParam = {"usNumber" : 3 };
             */


            Object(createClass["a" /* default */ ])(CCardDispenser, [{
              key: "Capture",
              value: function Capture(usNumber) {
                return this.execute('Capture', {
                  usNumber: usNumber
                });
              }
              /**
               * 指定范围清卡, 此接口保留 （乱序发卡机接口，暂不实现）
               * @param usStartPos 起始槽号，值范围为 0-1999
               * @param usEndPos 结束槽号,值范围为 0-1999
               */

            }, {
              key: "ClearSlotCard",
              value: function ClearSlotCard(usStartPos, usEndPos) {
                return this.execute('ClearSlotCard', {
                  usStartPos: usStartPos,
                  usEndPos: usEndPos
                });
              }
              /**
               * 存卡（乱序发卡机接口）
               * @param usSlotNo 存入的槽号，值范围为 0-1999
               */

            }, {
              key: "DepositSlotCard",
              value: function DepositSlotCard(usSlotNo) {
                return this.execute('DepositSlotCard', {
                  usSlotNo: usSlotNo
                });
              }
              /**
               * 异步发卡
               * @param usNumber 卡箱号, 由设备决定
               * @param bPresent 发卡位置 true: 发卡到卡口,直接发卡给用户, false: 发卡到通道
               * @returns 发卡完成事件 DispenseCardOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 DispenseCardOver
                  result:执行结果，0表示成功，其他参考错误码
                   { "RequestID":13, "dwCommandCode":1405, "eventName":"DispenseCardOver", "eventType":1032, "result":0 };
               * @example 入参示例
                  var pszParam = {"usNumber" : 1, "bPresent": true };
               */

            }, {
              key: "DispenseCard",
              value: function DispenseCard(usNumber, bPresent) {
                return this.execute('DispenseCard', {
                  usNumber: usNumber,
                  bPresent: bPresent
                });
              }
              /**
               * 出卡
               * @param usSlotNo 存入的槽号，值范围为 0-1999;
               * @param bPresent 是否递卡，若为 TRUE，则卡退到读卡器口，否则停留在读卡器内部
               */

            }, {
              key: "DispenseSlotCard",
              value: function DispenseSlotCard(usSlotNo, bPresent) {
                return this.execute('DispenseSlotCard', {
                  usSlotNo: usSlotNo,
                  bPresent: bPresent
                });
              }
              /**
               * 异步退卡
               * @returns 退卡完成事件 EjectOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 EjectOver
                  result:执行结果，0表示成功，其他参考错误码
                  { "RequestID":20, "dwCommandCode":1402, "eventName":"EjectOver", "eventType":1032, "result":0 };
               */

            }, {
              key: "Eject",
              value: function Eject() {
                return this.execute('Eject', {});
              }
              /**
               * 获取卡箱单元信息——同步
               * @returns
               *  cardUnitInfo: '卡箱信息',
                  usNumber: 发卡箱中卡片数量，(整形)
                  usType: 卡箱类型，(整形)  1: 发卡箱, 2: 回收箱
                  ulCount: 发卡箱中卡片数量，(整形)
                  ulRetain:  回收箱中卡片数量，(整形)
                  usStatus: 卡箱状态，(整形)
                      0: 卡箱正常
                      1: 发卡箱卡少
                      2: 发卡箱空
                      3: 发卡箱或回收箱无效
                      4: 发卡箱或回收箱丢失
                      5: 回收箱将满
                      6: 回收箱满
                      7: 未知
                  { "RequestID":22, "cardUnitInfo":[ {"ulCount":8, "ulRetain":1, "usNumber":1,
                  "usStatus":0, "usType":1 }, {"ulCount":0, "ulRetain":0, "usNumber":2,
                  "usStatus":0, "usType":1 }, {"ulCount":1, "ulRetain":0, "usNumber":3,
                  "usStatus":0, "usType":2 }], "dwCommandCode":1403,
                  "eventName":"GetCardUnitInfoOver", "eventType":1031, "hService":1,
                  "result":0 }
               */

            }, {
              key: "GetCRDUnitInfoSync",
              value: function GetCRDUnitInfoSync() {
                return this.getInfo('GetCRDUnitInfoSync', {});
              }
              /**
               * 获取卡箱单元信息——异步
               * @returns 获取卡箱信息完成事件 GetCRDUnitInfoOver
               * cardUnitInfo: '卡箱信息',
                  usNumber: 发卡箱中卡片数量，(整形)
                  usType: 卡箱类型，(整形)  1: 发卡箱, 2: 回收箱
                  ulCount: 发卡箱中卡片数量，(整形)
                  ulRetain:  回收箱中卡片数量，(整形)
                  usStatus: 卡箱状态，(整形)
                      0: 卡箱正常
                      1: 发卡箱卡少
                      2: 发卡箱空
                      3: 发卡箱或回收箱无效
                      4: 发卡箱或回收箱丢失
                      5: 回收箱将满
                      6: 回收箱满
                      7: 未知
                   { "RequestID":22, "cardUnitInfo":[ {"ulCount":8, "ulRetain":1,
                   "usNumber":1, "usStatus":0, "usType":1 }, {"ulCount":0,
                   "ulRetain":0, "usNumber":2, "usStatus":0, "usType":1 },
                   {"ulCount":1, "ulRetain":0, "usNumber":3, "usStatus":0, "usType":2 }],
                    "dwCommandCode":1403, "eventName":"GetCardUnitInfoOver",
                     "eventType":1031, "hService":1, "result":0 }
               */

            }, {
              key: "GetCRDUnitInfo",
              value: function GetCRDUnitInfo() {
                return this.execute('GetCRDUnitInfo', {});
              }
              /**
               * 同步获取卡槽槽位状态 （乱序发卡机接口）
               * @returns  参数内容包含每个槽位状态 fwSlotStatus 1：卡槽有卡 2: 卡槽无卡 3: 卡槽卡未知
               */

            }, {
              key: "GetSlotInfoSync",
              value: function GetSlotInfoSync() {
                return this.getInfo('GetSlotInfoSync', {});
              }
              /**
               *
               * @param wMoveOption: 卡位置, 取值：1：读卡器至暂存 2：暂存到读卡器 3：暂存到回收箱
               */

            }, {
              key: "MoveCard",
              value: function MoveCard(wMoveOption) {
                return this.execute('MoveCard', {
                  wMoveOption: wMoveOption
                });
              }
              /**
               * 异步复位
               * @param ResetAction 复位动作, 取值：1: 无动作 2: 退卡 3: 吞卡
               * @returns 复位完成事件 ResetOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ResetOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  { "RequestID":40, "dwCommandCode":1404, "eventName":"ResetOver", "eventType":1032, "result":0 }
               * @example 入参示例
                  var pszParam = { "ResetAction":"3" };
               */

            }, {
              key: "Reset",
              value: function Reset(ResetAction) {
                return this.execute('Reset', {
                  ResetAction: ResetAction
                });
              }
              /**
               * 设置卡箱单元计数-同步
               * @param usNumber 卡箱号, 取值有设备决定
               * @param ulCount  卡数量
               * @returns result: 返回结果
                  {"result":0}
               * @example 入参示例
                  var pszParam = { "usNumber":1, "ulCount":10};
               */

            }, {
              key: "SetCRDUnitInfoSync",
              value: function SetCRDUnitInfoSync(usNumber, ulCount) {
                return this.getInfo('SetCRDUnitInfoSync', {
                  usNumber: usNumber,
                  ulCount: ulCount
                });
              }
              /**
               * 设备低功耗失败
               * @param usMaxPowerSaveRecoveryTime 低功耗时间
               */

            }, {
              key: "PowerSaveControl",
              value: function PowerSaveControl(usMaxPowerSaveRecoveryTime) {
                var param = {
                  usMaxPowerSaveRecoveryTime: usMaxPowerSaveRecoveryTime
                };
                return this.execute('PowerSaveControl', param);
              }
              /**
               * 批量盘点，异步接口
               * @param usStartPos 起始卡槽号，取值范围0-(卡槽个数-1)
               * @param usEndPos 结束卡槽号，取值范围0-(卡槽个数-1)
               * @param flags 读磁标志位，0-不读卡; 1-读磁卡; 2-读IC卡,操作PBOC; 3-读磁卡并操作PBOC
               */

            }, {
              key: "BatchCheckCard",
              value: function BatchCheckCard(usStartPos, usEndPos, flags) {
                var param = {
                  usStartPos: usStartPos,
                  usEndPos: usEndPos,
                  flags: flags
                };
                return this.execute('BatchCheckCard', param);
              }
              /**
               * 批量清卡，异步接口
               * @param usStartPos 起始卡槽号，取值范围0-(卡槽个数-1)
               * @param usEndPos 结束卡槽号，取值范围0-(卡槽个数-1)
               * @param flags 读磁标志位，0-不读卡; 1-读磁卡; 2-读IC卡,操作PBOC; 3-读磁卡并操作PBOC
               */

            }, {
              key: "BatchClearCard",
              value: function BatchClearCard(usStartPos, usEndPos, flags) {
                var param = {
                  usStartPos: usStartPos,
                  usEndPos: usEndPos,
                  flags: flags
                };
                return this.execute('BatchClearCard', param);
              }
              /**
               * 批量存卡，异步接口
               * @param usSlotNo 卡槽号，取值范围0-(卡槽个数-1)
               */

            }, {
              key: "BatchDepositCard",
              value: function BatchDepositCard(usSlotNo) {
                var param = {
                  usSlotNo: usSlotNo
                };
                return this.execute('BatchDepositCard', param);
              }
              /**
               * 取消批量操作，异步接口
               */

            }, {
              key: "CancelOperate",
              value: function CancelOperate() {
                var param = {};
                return this.execute('CancelOperate', param);
              }
              /**
               * 从读卡器吞卡到退卡模块卡槽（异步）
               * @param szCardNo 吞卡卡号信息字符串
               * @param szRetractTime 吞卡时间字符串
               * @param TimeOut 超时（单位毫秒）
               * @emits RetractCardOver/DeviceError/TimeOut
               */

            }, {
              key: "RetractCard",
              value: function RetractCard(szCardNo, szRetractTime, TimeOut) {
                var param = {
                  szCardNo: szCardNo,
                  szRetractTime: szRetractTime,
                  TimeOut: TimeOut
                };
                return this.execute('RetractCard', param);
              }
              /**
               * 从卡槽退卡到读卡器（异步）
               * @param szCardNo 吞卡卡号信息字符串
               * @param TimeOut 超时（单位毫秒）
               * @emits HandBackCardOver/DeviceError/TimeOut
               */

            }, {
              key: "HandBackCard",
              value: function HandBackCard(szCardNo, TimeOut) {
                var param = {
                  szCardNo: szCardNo,
                  TimeOut: TimeOut
                };
                return this.execute('HandBackCard', param);
              }
              /**
               * 从卡槽清卡到回收箱（异步）
               * @param wNum 0-清除所有卡片;1-清存在时间最久的卡片
               * @param TimeOut 超时（单位毫秒）
               * @emits ClearRetractCardOver/DeviceError/TimeOut
               */

            }, {
              key: "ClearRetractCard",
              value: function ClearRetractCard(wNum, TimeOut) {
                var param = {
                  wNum: wNum,
                  TimeOut: TimeOut
                };
                return this.execute('ClearRetractCard', param);
              }
            }]);

            return CCardDispenser;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var carddispenser = (carddispenser_CCardDispenser);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/printer.js






        /**
         * 打印机类
         */

        var printer_CPrinter =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CPrinter, _CBaseDev);

            function CPrinter(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CPrinter);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CPrinter).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                /**
                 * 媒介插入事件
                 * @param param
                 */
                'MediaInserted': function MediaInserted(param) {
                  this.dispatchEvent('MediaInserted', param);
                },

                /**
                 * 媒介存在事件
                 * @param param
                 */
                'MediaPresented': function MediaPresented(param) {
                  this.dispatchEvent('MediaPresented', param);
                },

                /**
                 * 媒介拿走事件
                 * @param param
                 */
                'MediaTaken': function MediaTaken(param) {
                  this.dispatchEvent('MediaTaken', param);
                },
                "PrintTextOver": function PrintTextOver(param) {
                  this.controlGuideLight(1);
                  this.dispatchEvent('PrintTextOver', param);
                },
                "PrintFormOver": function PrintFormOver(param) {
                  this.controlGuideLight(1);
                  this.dispatchEvent('PrintFormOver', param);
                },

                /**
                 * 纸张阈值事件
                 * @param param
                 */
                'PaperThreshHold': function PaperThreshHold(param) {
                  this.dispatchEvent('PaperThreshHold', param);
                },

                /**
                 * 回收箱阈值事件
                 * @param param
                 */
                'RetractBinThreshHold': function RetractBinThreshHold(param) {
                  this.dispatchEvent('RetractBinThreshHold', param);
                },

                /**
                 * 等待取消事件
                 * @param param
                 */
                'WaitCancelled': function WaitCancelled(param) {
                  this.dispatchEvent('WaitCancelled', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 异步控制介质，该命令用来控制通过设备绘制的表单（例如阅读或终止某应用程序请求）。
             * 如果弹出操作被指定，那么，当媒介被移到出口时，该弹出操作即完成。当媒介已经被用户取走时
             * （只有当结构WFSPTRCAPS中规定的字段bMediaTaken等于TRUE时），就会生成一个服务事件。
             *
             * @param {Number} mediaCtrol  取值如下：
                1 : 对应WOSA定义WFS_PTR_CTRLEJECT，打印还未根据先前的WFS_CMD_PTR_PRINT_FORM或 WFS_CMD_PTR_PRINT_RAW_FILE命令打印的数据，然后弹出媒介。
                2 : 对应WOSA定义WFS_PTR_CTRLPERFORATE，按上述要求打印数据，然后在媒介上打眼。
                4 : 对应WOSA定义WFS_PTR_CTRLCUT，按上述要求打印数据，然后切纸。 对于具有堆放多重切纸并将它们作为单独一沓交给客户能力的打印机而言， 切割是因为要将媒介堆放起来，而弹出是因为要将一沓纸移到出口。
                8 : 对应WOSA定义WFS_PTR_CTRLSKIP，按上述要求打印数据，然后跳媒介到黑标。
                16 : 对应WOSA定义WFS_PTR_CTRLFLUSH，打印打印机还未根据先前的WFS_CMD_PTR_PRINT_FORM或WFS_CMD_PTR_PRINT_RAW_FILE命令打印的数据。
                32 : 对应WOSA定义WFS_PTR_CTRLRETRACT，按上述要求打印数据，然后回收媒介到1::回收盒，如果媒介必须回收到另一个回收盒而非1::回收盒， 则设备需要一个以上的回收盒，就必须采用WFS_CMD_PTR_RETRACT_MEDIA命令。
                64 : 对应WOSA定义WFS_PTR_CTRLSTACK，按上述要求打印数据，然后将媒介移到内部堆放器上。
                128 : 对应WOSA定义WFS_PTR_CTRLPARTIALCUT，按上述要求打印数据，然后对媒介进行部分切割。
                256 : 对应WOSA定义WFS_PTR_CTRLALARM，导致打印机响铃、发出哔哔声或发出声音警报。
                512 : 对应WOSA定义WFS_PTR_CTRLATPFORWARD，按上述要求打印数据，然后向前翻一页。
                1024 : 对应WOSA定义WFS_PTR_CTRLATPBACKWARD，按上述要求打印数据，然后向后翻一页。
                2048 : 对应WOSA定义WFS_PTR_CTRLTURNMEDIA，按上述要求打印数据，然后插入媒介。
                4096 : 对应WOSA定义WFS_PTR_CTRLSTAMP，按上述要求打印数据，然后在插入的媒介上压印。
                8192 : 对应WOSA定义WFS_PTR_CTRLPARK，将媒介放入纸盒。
                16384 : 对应WOSA定义WFS_PTR_CTRLEXPEL，按上述要求打印数据，然后将媒介从出口吐出来。
                32768 : 对应WOSA定义WFS_PTR_CTRLEJECTTOTRANSPORT，按上述要求打印数据，然后将媒介移到出 口正后面的通道上的某个位置
             * @param {Number} TimeOut 超时时间（毫秒），0表示无限超时
             * @returns 控制介质完成事件 ControlMediaOver( string &pszParam)
                其中pszParam JSON串参数：
                RequestID:请求ID
                dwCommandCode:指令ID
                eventType:事件ID
                eventName:事件名 ControlMediaOver
                result:执行结果，0表示成功，其他参考WOSA错误码
                {"RequestID":45,"dwCommandCode":101,"eventName":"ControlMediaOver","eventType":1032,"hService":5,"lpbuffer":"","result":-56}
             * @example 入参示例
                var pszParam = {"mediaCtrol" :1,"TimeOut":5000};
             */


            Object(createClass["a" /* default */ ])(CPrinter, [{
              key: "ControlMedia",
              value: function ControlMedia(mediaCtrol, TimeOut) {
                return this.execute('ControlMedia', {
                  mediaCtrol: mediaCtrol,
                  TimeOut: TimeOut
                });
              }
              /**
               * 异步打印数据
               * @param prtData 打印内容  待打印的文本字符串
                普通回单打印机打文本说明，设置参数以分号分隔：
                pagesource=A4:纸张类型
                copies=1 (2,3,4...):份数
                file[0]=url:文件路径
                stamp=0/1(0:盖章 1:不盖章)
                duplex=1/2(1:单面打印 2：双面打印)
                color=0/1(0:黑白 1:彩色)
                direction=0/1(0:纵向 1:横向)
               * @param {Number} TimeOut 超时时间（毫秒），0表示无限超时
               * @returns 打印文本完成事件 PrintTextOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 PrintTextOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":64,"dwCommandCode":104,"eventName":"PrintTextOver","eventType":1032,"hService":7,"lpbuffer":"","result":0}
               * @example 入参示例
                  var pszParam = {"TimeOut":30000,"prtText":"pagesource=A4;copies=1;file[0]=C:\ssts\1.html;stamp=0;duplex=1;color=0;direction=0"}
               */

            }, {
              key: "PrintText",
              value: function PrintText(prtData) {
                this.controlGuideLight(this.siuSpeed);
                return this.execute('PrintText', {
                  prtData: prtData
                });
              }
              /**
               * 同步打印数据
               * @param prtData 打印内容
               */

            }, {
              key: "PrintTextSync",
              value: function PrintTextSync(prtData) {
                return this.getInfo('PrintTextSync', {
                  prtData: prtData
                });
              }
              /**
              * 异步清空回收计数
              * @returns 清回收计数完成事件 ResetCountOver( string &pszParam)
                 其中pszParam JSON串参数：
                 RequestID:请求ID
                 dwCommandCode:指令ID
                 eventType:事件ID
                 eventName:事件名 ResetCountOver
                 result:执行结果，0表示成功，其他参考WOSA错误码
                 {"RequestID":9,"dwCommandCode":106,"eventName":"ResetCountOver","eventType":1032,"hService":1,"result":0}
              */

            }, {
              key: "ResetCount",
              value: function ResetCount() {
                return this.execute('ResetCount', {});
              }
              /**
               * 同步清空回收计数
               */

            }, {
              key: "ResetCountSync",
              value: function ResetCountSync() {
                return this.getInfo('ResetCountSync', {});
              }
              /**
               * 异步复位
               * @param {Number} ResetAction 初始化动作, 详见 ControlMedia 中的mediaCtrol参数说明
               * @param {Number} binNumber 回收计数
               * @returns 复位打印机（异步、打印类通用接口，所有打印机均适用） ResetOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ResetOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":47,"dwCommandCode":108,"eventName":"ResetOver","eventType":1032,"hService":5,"result":0}
               * @example 入参示例
                  var pszParam = {"ResetAction":1 ,"binNumber":0};
               */

            }, {
              key: "Reset",
              value: function Reset(ResetAction, binNumber) {
                return this.execute('Reset', {
                  ResetAction: ResetAction,
                  binNumber: binNumber
                });
              }
              /**
               * 异步回收介质
               * @param {Number} TimeOut 超时时间（毫秒），0表示无限超时
               * @returns 回收介质完成事件 RetractMediaOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 RetractMediaOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":9,"dwCommandCode":109,"eventName":"RetractMediaOver","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"TimeOut":30000}
               */

            }, {
              key: "RetractMedia",
              value: function RetractMedia() {
                return this.execute('RetractMedia', {});
              }
              /**
               * 异步打印文件
               * @param FileName 文件名
               * @returns 打印文件完成事件 PrintRawFileOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 PrintRawFileOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":9,"dwCommandCode":112,"eventName":"PrintRawFileOver",
                  "eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"FileName":"C:\333.txt,"TimeOut":30000}
               */

            }, {
              key: "PrintRawFile",
              value: function PrintRawFile(FileName) {
                return this.execute('PrintRawFile', {
                  FileName: FileName
                });
              }
              /**
               * 获取Form的名称列表(异步)
               * @returns 查询form列表完成事件 FormListOver( string &pszParam)
                  其中pszParam JSON串参数：
                  FormList：返加form列表数组
                  count: 返回的form个数
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 FormListOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"FormList":["CheckPrinterOcrForm","ChequeForm","GWIPassbookForm","GWIReceiptForm_example","ReadPassBook","ReceiptMXCX","form1"],"RequestID":6,"count":7,"dwCommandCode":103,"eventName":"FormListOver","eventType":1031,"hService":1,"result":0}
               */

            }, {
              key: "FormList",
              value: function FormList() {
                return this.execute('FormList', {});
              }
              /**
               * 查询form的详细信息(异步)
               * @param formName 名称，可通过接口 FormList 查询form名称列表
               * @returns 查询form完成事件 QueryFormOver( string &pszParam)
                  其中pszParam JSON串参数：
                  fieldname: form中的字段名数组
                  fieldcount: form中字段个数
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 PrintRawFileOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":12,"alignment":"TOPLEFT","base":"ROWCOLUMN","charsupport":"ASCII","dwCommandCode":105,"eventName":"QueryFormOver","eventType":1031,"fieldcount":3,"fieldname":[""Magstripe",""Track2",""Track3"],"hService":1,"height":40,"languageid":0,"name":"ReadPassBook","offsetx":0,"offsety":0,"orientation":"PORTRAIT","result":0,"unitx":1,"unity":1,"userprompt":"","versionmajor":0,"versionminor":0,"width":80}
               * @example 入参示例
                  var pszParam = {"FileName":"GWI_Receipt_Form"}
               */

            }, {
              key: "QueryForm",
              value: function QueryForm(formName) {
                return this.execute('QueryForm', {
                  formName: formName
                });
              }
              /**
               * 获取media的名称列表(异步)
               * @returns 查询Media列表完成事件 MediaListOver( string &pszParam)
                  其中pszParam JSON串参数：
                  MediaList: 返加Media列表数组
                  count: 返回的Media个数
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 FormListOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"MediaList":["ChequeMedia","GWIPassbookMedia","GWIReceiptMedia_example","MDMX","PassbookMedia","media1","media2"],"RequestID":7,"count":7,"dwCommandCode":104,"eventName":"MediaListOver","eventType":1031,"hService":1,"result":0}
               */

            }, {
              key: "MediaList",
              value: function MediaList() {
                return this.execute('MediaList', {});
              }
              /**
               * 查询form中Field详细信息(异步)
               * @param formName form名称，可通过接口 FormList 查询form名称列表
               * @param fieldName field名称
               * @returns 查询Field完成事件 QueryFieldOver( string &pszParam)
                  其中pszParam JSON串参数：
                  fieldname: form中的字段名数组
                  fieldcount: form中字段个数
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 PrintRawFileOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":12,"alignment":"TOPLEFT","base":"ROWCOLUMN","charsupport":"ASCII","dwCommandCode":105,"eventName":"QueryFormOver","eventType":1031,"fieldcount":3,"fieldname":[""Magstripe",""Track2",""Track3"],"hService":1,"height":40,"languageid":0,"name":"ReadPassBook","offsetx":0,"offsety":0,"orientation":"PORTRAIT","result":0,"unitx":1,"unity":1,"userprompt":"","versionmajor":0,"versionminor":0,"width":80}
               * @example 入参示例
                  var pszParam = {"formName":"GWIReceiptForm_example","fieldName":"HEAD"}
               */

            }, {
              key: "QueryField",
              value: function QueryField(formName, fieldName) {
                return this.execute('QueryField', {
                  formName: formName,
                  fieldName: fieldName
                });
              }
              /**
               * 异步查询media
               * @param mediaName media名称，可通过接口 MediaList 查询media名称列表
               * @returns 查询Media完成事件 QueryFieldOver( string &pszParam)
                  其中pszParam JSON串参数：
                  media中详细信息
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 QueryFieldOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":13,"base":"ROWCOLUMN","dwCommandCode":106,"eventName":"QueryMediaOver","eventType":1031,"foldtype":"HORIZONTAL","hService":1,"linecount":0,"mediatype":"GENERIC","pagecount":0,"papersource":"ANY","printareaheight":45,"printareawidth":85,"printareax":0,"printareay":0,"restrictedareaheight":0,"restrictedareawidth":0,"restrictedareax":0,"restrictedareay":0,"result":0,"sizeheight":45,"sizewidth":85,"stagger":0,"unitx":1,"unity":1}
               * @example 入参示例
                  var pszParam = {"mediaName":"GWIReceiptMedia_example"}
               */

            }, {
              key: "QueryMedia",
              value: function QueryMedia(mediaName) {
                return this.execute('QueryMedia', {
                  mediaName: mediaName
                });
              }
              /**
               * 打印Form.（异步，凭条打印机、存折打印机、日志打印机适用）
               * @param formName form名称，可通过接口 FormList 查询form名称列表
               * @param mediaName media名称，可通过接口 MediaList 查询media名称列表
               * @param {Number} alignment 对齐方式，取值如下：
               *      0 : 对应WOSA定义WFS_PTR_ALNUSEFORMDEFN，采用表单定义中指定的对齐基准。
               *      1 : 对应WOSA定义WFS_PTR_ALNTOPLEFT，表单与实体媒介的左上边对齐。
               *      2 : 对应WOSA定义WFS_PTR_ALNTOPRIGHT，表单与实体媒介的右上边对齐。
               *      3 : 对应WOSA定义WFS_PTR_ALNBOTTOMLEFT，表单与实体媒介的左下边对齐。
               *      4 : 对应WOSA定义WFS_PTR_ALNBOTTOMRIGHT， 表单与实体媒介的右下边对齐。
               * @param {Number} offsetX 指定表单的水平向偏移，与wAlignment规定的水平基准对应，采用水平分辨率单位（来自表单定义）；通常为正数（即如果与媒介的右边对齐，则意味着表单向左偏移）。 WFS_PTR_OFFSETUSEFORMDEFN这个值表示必须采用来自表单定义的xoffset值。
               * @param {Number} offsetY 指定表单的垂直向偏移，与wAlignment规定的垂直基准对应，采用垂直分辨率单位（来自表单定义）；通常为正数（即如果与媒介的底边对齐，则意味着表单向上偏移）。 WFS_PTR_OFFSETUSEFORMDEFN这个值表示必须采用来自表单定义的xoffset值。
               * @param {Number} resolution 指定打印表单时采用的分辨率。取值如下：
               *      1 : 对应WOSA定义WFS_PTR_RESLOW，以低分辨率打印表单。
                      2 : 对应WOSA定义WFS_PTR_RESMED，以中等分辨率打印表单。
                      4 : 对应WOSA定义WFS_PTR_RESHIGH，以高分辨率打印表单。
                      8 : 对应WOSA定义WFS_PTR_RESVERYHIGH，以极高的分辨率打印表单。
                 * @param mediaCtrl 指定打印完后媒介的控制方式，做为WFS_CMD_PTR_CONTROL_MEDIA下描述的组合标志。 在单页纸上打印多个表单时，该参数为0值表示什么动作都不做。
               * @param fields field名称
               * @param {Number} TimeOut 超时时间（毫秒），0表示无限超时
               * @returns 打印form完成事件 PrintFormOver( string &pszParam)
                  其中pszParam JSON串参数：
                  media中详细信息
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 PrintFormOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":35,"dwCommandCode":102,"eventName":"PrintFormOver","eventType":1032,"hService":3,"result":0}
               * @example 入参示例
                  var pszParam = {"TimeOut":30000,"alignment": 0,"fields": "","formName": "checkform","mediaCtrl": 1,"mediaName": "checkmedia","offsetX": 0,"offsetY": 0,"resolution": 2 }
               */

            }, {
              key: "PrintForm",
              value: function PrintForm(formName, mediaName, alignment, offsetX, offsetY, resolution, mediaCtrl, fields, TimeOut) {
                this.controlGuideLight(this.siuSpeed);
                return this.execute('PrintForm', {
                  formName: formName,
                  mediaName: mediaName,
                  alignment: alignment,
                  offsetX: offsetX,
                  offsetY: offsetY,
                  resolution: resolution,
                  mediaCtrl: mediaCtrl,
                  fields: fields,
                  TimeOut: TimeOut
                });
              }
              /**
               * 读取form （异步，存折打印机适用）
               * @param formName 表单名称，可通过接口 FormList 查询form名称列表
               * @param fieldName 字段名称列表
               * @param mediaName 媒介名称，可通过接口 MediaList 查询media名称列表
               * @param {Number} TimeOut 超时时间（毫秒），0表示无限超时
               * @param {Number} mediaCtrl 指定打印完后媒介的控制方式，做为WFS_CMD_PTR_CONTROL_MEDIA下描述的组合标志。 在单页纸上打印多个表单时，该参数为0值表示什么动作都不做
               * @returns 打印form完成事件 PrintFormOver( string &pszParam)
                  其中pszParam JSON串参数：
                  field: field信息，JSON串数组，数量与count一致。 name:field的名字。 value:field的值
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 PrintFormOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":6,"count":3,"dwCommandCode":103,"eventName":"ReadFormOver","eventType":1032,"field":[{"name":"Magstripe","value":" "},{"name":"Track2","value":"22222"},{"name":"Track3","value":"333335"}],"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"fields": "",formName: "ReadPassBook",mediaName: "PassbookMedia",mediaCtrl: 0}
               */

            }, {
              key: "ReadForm",
              value: function ReadForm(formName, fieldName, mediaName, TimeOut) {
                return this.execute('ReadForm', {
                  formName: formName,
                  mediaName: mediaName,
                  fieldName: fieldName,
                  TimeOut: TimeOut
                });
              }
              /**
               * 异步读取图像数据
               * @param FrontImageFile 正面图像的储存位置
               * @param BackImageFile 背面图像的储存位置
               * @param {Number} wFrontImageType 正面图像的格式，取值如下：
                      1: 对应WOSA定义WFS_PTR_IMAGETIF，返回的图像为TIF 6.0 格式。
                      2: 对应WOSA定义WFS_PTR_IMAGEWMF，返回的图像为WMF （Windows Metafile） 格式。
                      4: 对应WOSA定义WFS_PTR_IMAGEBMP，返回的图像为BMP格式。
                      8: 对应WOSA定义WFS_PTR_IMAGEJPG，返回的图像为 JPG 格式。
                 * @param wBackImageType 背面图像的格式，取值同wFrontImageType
               * @param {Number} wFrontImageColorFormat 正面图像的颜色格式，取值如下：
               *      1: 对应WOSA定义WFS_PTR_IMAGECOLORBINARY，扫描图象须以二进位返回（图像包含两种颜色，通常是黑色和白色）。
                      2: 对应WOSA定义WFS_PTR_IMAGECOLORGRAYSCALE，扫描图象须以灰度标返回（图像包含多重灰色）。
                      4: 对应wosA定义WFS_PTR_IMAGECOLORFULL，扫描图象须以全色返回（图像包含红色、绿色、蓝色等颜色）。
                 * @param wBackImageColorFormat 背面图像的颜色格式，取值同wFrontImageColorFormat。
               * @param {Number} wCodelineFormat 代码行（MICR数据）格式，取值如下：
               *      1: 对应WOSA定义WFS_PTR_CODELINECMC7，读取CMC7代码行。
                      2: 对应WOSA定义WFS_PTR_CODELINEE13B，读取E13B代码行。
                      4: 对应WOSA定义WFS_PTR_CODELINEOCR，利用OCR读取代码行。
                 * @param {Number} fwImageSource 图像源，取值如下：
                      1: 对应WOSA定义WFS_PTR_IMAGEFRONT，请求文件的正面图像。
                      2: 对应WOSA定义WFS_PTR_IMAGEBACK，请求文件的背面图像。
                      4: 对应WOSA定义WFS_PTR_CODELINE，请求文件的代码行。
                 * @param TimeOut 超时时间（毫秒），0表示无限超时
               * @returns 读取图像完成事件 ReadImageOver( string &pszParam)
                  其中pszParam JSON串参数：
                  wImageSource: 返回的图像源
                  outdata: 返回的数据，取值：字符串。
                  datalen: 返回的数据长度 ，取值：整数
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ReadImageOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":9,"dwCommandCode":107,"eventName":"ReadImageOver","eventType":1032,"hService":1,"wImageSource":4，"datalen":14,"outdata":"11111111111111","result":0}
               * @example 入参示例
                  var pszParam = {"FrontImageFile":"C:\111.bmp","BackImageFile":"C:\222.bmp","wFrontImageType":4,"wBackImageType":1,"wFrontImageColorFormat":4,"wBackImageColorFormat":1,"wCodelineFormat":1,"fwImageSource":1,"TimeOut":30000};
               */

            }, {
              key: "ReadImage",
              value: function ReadImage(FrontImageFile, BackImageFile, wFrontImageType, wBackImageType, wFrontImageColorFormat, wBackImageColorFormat, wCodelineFormat, fwImageSource, TimeOut) {
                return this.execute('ReadImage', {
                  FrontImageFile: FrontImageFile,
                  BackImageFile: BackImageFile,
                  wFrontImageType: wFrontImageType,
                  wBackImageType: wBackImageType,
                  wFrontImageColorFormat: wFrontImageColorFormat,
                  wBackImageColorFormat: wBackImageColorFormat,
                  wCodelineFormat: wCodelineFormat,
                  fwImageSource: fwImageSource,
                  TimeOut: TimeOut
                });
              }
              /**
               * 同步取消所有异步请求
               *  @returns result 执行结果，0，成功，<0，失败
               */

            }, {
              key: "CancelWait",
              value: function CancelWait() {
                return this.getInfo('CancelWait', {});
              }
              /**
               * 同步取消所有异步请求
               */

            }, {
              key: "CancelAsyncRequest",
              value: function CancelAsyncRequest() {
                return this.getInfo('CancelAsyncRequest', {});
              }
              /**
               * 同步更新打印配置
               * @param cfg 配置信息
               */

            }, {
              key: "UpdatePrintConfigSync",
              value: function UpdatePrintConfigSync(cfg) {
                return this.getInfo('UpdatePrintConfigSync', {
                  cfg: cfg
                });
              }
              /**
               * 同步获取纸张计数
               */

            }, {
              key: "CheckPaperCountSync",
              value: function CheckPaperCountSync() {
                return this.getInfo('CheckPaperCountSync', {});
              }
              /**
               * 同步以HTML的格式保存文件数据
               * @param FileName 文件名(含路径)
               * @param FileData 文件数据，HTML格式，注意转义字符的处理
               */

            }, {
              key: "SaveFileDataSync",
              value: function SaveFileDataSync(FileName, FileData) {
                return this.getInfo('SaveFileDataSync', {
                  FileName: FileName,
                  FileData: FileData
                });
              }
              /**
               * 设置打印类型、传入打印任务（但不发送任务到打印机，仅缓存数据），支持打印数据、打印文件及等待打印份数等的设置。传入完成后。需调用ControlMedia方法开始打印。（异步,适用于回单激光打印机）
               * @param prtData 传入的打印数据（不直接打印）该接口采用关键字形式，即“key1=value1;key2=value2...”  "PaperNum=2;PrintType=1;Stamp=1;File[0]=http://.....html"
                   PrintType：改变打印效果，与注册表中的值相对应。从调用者的角度来看，即从注册表含有的多种打印盖章效果中选择一种。调用该指令之后的File指令>打印盖章的效果将发生变化。
                   PaperNum：该项表示使用对应的打印效果（PrintType）会打印多少张纸。出现该项表示使用批量盖章方式。如果使用该项，必须紧接PrintType之前出现，并且每个PrintType之前均应出现。如果能力bStamp为0，则该项无效。批量盖章目前最多只支持设置4批。
                   Stamp：是否盖章，1为盖章，0为不盖章，必须紧接PrintType之后出现，若不出现默认为不盖章。如果能力bStamp为0，则该项无效。
                   File[0]：带路径文件名，可连续传多个，数组下标从0递增。调用该指令将发送一个打印任务。
                   WaitNum：等待出纸数量。调用该指令将等到检测到已打印指定数量的纸张才会继续执行队列，若没等到则直接返回失败。如果能力bCountPaper为0，则该项无效。
               * @param {Number} TimeOut  超时时间（毫秒），0表示无限超时
               * @returns 向物理设备发送原始数据完成事件 SetRawDataOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 SetRawDataOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":64,"dwCommandCode":104,"eventName":"SetRawDataOver","eventType":1032,"hService":7,"lpbuffer":"","result":0}
               * @example 入参示例
                  var pszParam = {"TimeOut":30000,"prtData":"PaperNum=3;PrintType=3;Stamp=0,File[0]=c:\A4_1.pdf,WaitNum=1"}
               */

            }, {
              key: "SetRawData",
              value: function SetRawData(prtData) {
                return this.getInfo('SetRawData', {
                  prtData: prtData
                });
              }
              /**
               * 同步获取打印机类型
               * @param type 类型
               * @returns
               * {result: 0,
               *  outinfo:{
               *              'typename': '该项名称，无实际作用，可无',
                              'flag': '盖章机盖横章还是竖章，0为横章1为竖章',
                              'stampnum': '盖章机的盖章数量，0至3对应A4纸上盖0到3个章。'
                              'startpos': '盖章机的盖章起始位置，请根据实际效果控制。'
                              'distance': '盖章机的盖的每个章的间距，请根据实际效果控制。'
                              'box': '打印所使用的纸盒，从1起。'
                              'pagesize': '打印的纸张尺寸，A4为9，A5为11，其他自定义尺寸请参考打印首选项。'
                              'rotate': '是否旋转180°，值为0或1。'
                              'mediatype': '打印的纸张类型，三星打印机可以填272，利盟打印机对应四个纸盒请填272至275。'
                              'orientation': '是否旋转90°，值为1或2。'
                              'copies': '任务的重复打印份数，若无则使用默认值。'
                              'duplex': '双面打印设置，根据不同的打印机，请尝试0、1、2、3等，会有不同的双面效果。'
                              'fontsize': '字体大小'
                              'leftmargin': '左边距'
                              'topmargin': '顶边距'
                              'lineheight': '行高'
                              }
                          }
                   */

            }, {
              key: "GetPrintType",
              value: function GetPrintType(type) {
                return this.getInfo('GetPrintType', {
                  type: type
                });
              }
              /**
               * 同步根据加密数据生成图像文件
               * @param base64Str 图像base64加密数据
               * @param filePath 文件名
               */

            }, {
              key: "GenerateImage",
              value: function GenerateImage(base64Str, filePath) {
                return this.getInfo('GenerateImage', {
                  base64Str: base64Str,
                  filePath: filePath
                });
              }
              /**
               * 同步接口，将指定bmp图像文件转换为单色bmp格式文件
               * @param FileName 文件名，格式为bmp
               */

            }, {
              key: "ChangeToTrueBmp",
              value: function ChangeToTrueBmp(FileName) {
                return this.getInfo('ChangeToTrueBmp', {
                  FileName: FileName
                });
              }
              /**
               * 同步接口，缩放指定文件，原文件也会被缩放
               * @param tofile 缩放后文件名，需要为jpg和bmp格式文件
               * @param srcfile 原文件名
               * @param szscale 缩放尺寸，字符串格式，e.g: '10.0'
               */

            }, {
              key: "ChangeFile",
              value: function ChangeFile(tofile, srcfile, szscale) {
                return this.getInfo('ChangeFile', {
                  tofile: tofile,
                  srcfile: srcfile,
                  szscale: szscale
                });
              }
              /**
               * 获取PTR状态 ，异步接口
               * @returns 获取状态完成事件 GetStatusOver( string &pszParam)
               "StDeviceStatus": 设备状态，取值:字符串，取值如下：
                  HEALTHY： 正常
                  FATAL： 故障
                  BUSY： 忙
                  NODEVICE： 无设备
               "StMedia": 介质状态，取值:字符串，取值如下：
                  PRESENT： 介质在通道
                  NOTPRESENT： 无介质
                  JAMMED： 卡介质
                  NOTSUPP： 不支持
                  UNKNOWN： 未知
                  EXITING： 介质在出口
                  RETRACTED 介质被回收(复位时)
               "StToner": 碳带状态，取值:字符串，取值如下：
                  TONERFULL： 碳带满
                  TONERLOW： 碳带少
                  TONEROUT： 缺碳带
                  TONERNOTSUPP： 不支持碳带检测
                  TONERUNKNOWN： 碳带未知
               "StInk": 墨盒状态，取值:字符串，取值如下：
                  INKFULL： 墨盒满
                  INKLOW： 墨盒少
                  INKOUT： 缺墨盒
                  INKNOTSUPP： 不支持墨盒检测
                  INKUNKNOWN： 墨盒未知
               "StPaper": 第一个纸盒状态，取值:字符串，取值如下：
                  PAPERFULL： 纸满
                  PAPERLOW： 少纸
                  PAPEROUT： 缺纸
                  PAPERNOTSUPP： 不支持纸箱检测
                  PAPERJAMMED： 卡纸
                  PAPERUNKNOWN： 纸箱未知
               "StPaperEx": 所有纸箱的状态，1~16个纸箱的状态，中间采用“|”分隔，取值:字符串。
                  如：PAPERFULL|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|...,每个纸箱状态取值同"StPaper".
               "StDeviceExStatus": 设备扩展状态。采用“|”分隔，第一个为设备的状态，第二个为盖章机的状态，后面为设备扩展的状态。
                  "LastErrorCode“: 最后一个10位的错误代码，取值：字符串。
                  ”LastErrorDetail“: 最后一个0位的错误代码及说明，取值：字符串。
               "RequestID":请求ID
               "dwCommandCode":指令ID
               "eventType":事件ID
               "eventName":事件名称 GetStatusOver
               "result":执行结果，0表示成功，<0失败
               {"DriverDllVersion":"[PassBook_Virtual_Driver.dll|1.0.0.2-20180628]","FirmwareVersion":"[HCC_PR 7.23.021]","FrameDllVersion":"[GWIPTRFrame9.dll|2019_04_19 v1.0.1.3 GWIPTRFrame9 for SP]","LastErrorCode":"0000000000","LastErrorDetail":"0000000000|success","LogicDllVersion":"[GWI_PTR_PassBook_XFS9.dll|1.0.0.7-20181227]","Name":"PTR_Passbook_XFS","RequestID":17,"StDeviceExStatus":"HEALTHY|NODEVICE|Name=PTR_Passbook_XFS|LastErrorCode=0000000000|LastErrorDetail=0000000000|success|FrameDllVersion=[GWIPTRFrame9.dll|2019_04_19 v1.0.1.3 GWIPTRFrame9 for SP]|LogicDllVersion=[GWI_PTR_PassBook_XFS9.dll|1.0.0.7-20181227]|DriverDllVersion=[PassBook_Virtual_Driver.dll|1.0.0.2-20180628]|FirmwareVersion=[HCC_PR 7.23.021]","StDeviceStatus":"HEALTHY","StInk":"INKNOTSUPP","StMedia":"EXITING","StPaper":"PAPERNOTSUPP","StPaperEx":"PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP|PAPERNOTSUPP","StToner":"TONERNOTSUPP","dwCommandCode":101,"eventName":"GetStatusOver","eventType":1031,"hService":1,"result":0}
               */

            }, {
              key: "GetStatus",
              value: function GetStatus() {
                return this.execute('GetStatus', {});
              }
              /**
               * 获取PTR能力，异步接口
               * @returns 获取能力完成事件 GetCapabilitiesOver( string &pszParam)
                  其中pszParam JSON串参数：
                  wClass: PTR类
                  fwType: 设备类型
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 GetCapabilitiesOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RarewordPrinter":"TRUE","RequestID":27,"bAcceptMedia":1,"bCompound":0,"bDispensePaper":0,"bMediaTaken":1,"bMultiPage":0,"dwCommandCode":102,"dwGuidLights":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"eventName":"GetCapabilitiesOver","eventType":1031,"fwBackImageColorFormat":0,"fwCharSupport":3,"fwCodelineFormat":0,"fwControl":17,"fwExtents":2,"fwFrontImageColorFormat":0,"fwImageSource":0,"fwPaperSources":2,"fwReadForm":4,"fwType":"PASSBOOK","fwWriteForm":16,"hService":3,"lpusMaxRetract":false,"result":0,"usMaxMediaOnStacker":0,"usRetractBins":0,"wClass":"PTR","wResolution":2}
               */

            }, {
              key: "GetCapabilities",
              value: function GetCapabilities() {
                return this.execute('GetCapabilities', {});
              }
              /**新增的发票领用和打印模块 */

              /**
               * 向前或向后走特定页数的纸张（异步）
               * @param prtData String(In) 传入要走纸的参数
               * “PageNum=10”:表示一次走纸十页。
               * “ForwardType=0”:表示向前走纸。0表示向前走纸，1表示向后走纸。
               * “CheckNoType=0”:识别票号类型，0表示不识别票号，1表示识别第一张和最后一张的票号。2表示识别每一张的票号。
               * “PageLen=5.4”:票的宽度，单位为英寸
               * “ScanLocation=0.7”:票号的位置，单位为英寸
               * @param {Number} TimeOut  超时时间（毫秒），0表示无限超时
               * @returns 走纸完成事件 ForwardPaperOver( string &pszParam)
                  其中pszParam JSON串参数：
                  CheckNoData: 返回的票号数据，字符串。格式为：Num|CheckNo& Num|CheckNo……。Num表示序号，CheckNo表示票号。
                  DataLength: 返回的数据长度 ，取值：整数。
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ForwardPaperOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                 {"RequestID":64,"dwCommandCode":104,"eventName":"ForwardPaperOver","eventType":1032,
                 "hService":7, "CheckNoData" : "1|27315842&2|27315843&3|27315843"," DataLength ": 32,result":0}
               * @example 入参示例
                  var pszParam = {"TimeOut":30000,"prtData":" PageNum=10; ForwardType=0; CheckNoType=1; PageLen=5.5; ScanLocation=2.7"}
               */

            }, {
              key: "ForwardPaper",
              value: function ForwardPaper(prtData, TimeOut) {
                return this.execute('ForwardPaper', {
                  prtData: prtData,
                  TimeOut: TimeOut
                });
              } //{"TimeOut":30000,"prtData":" PageNum=10; ForwardType=0; CheckNoType=1; PageLen=5.4; ScanLocation=0.7"};    

              /**
               * 获取发票票号
               * @param ScanLocation 识别票号的走纸位置，单位：英寸。可不传，采用默认值
               * @param {Number} TimeOut 超时时间（毫秒），0表示无限超时
               * @returns 获取票号完成事件 GetCheckNoOver( string &pszParam)
                  其中pszParam JSON串参数：
                  wImageSource: 返回的图像源
                  outdata: 返回的数据，取值：字符串。
                  datalen: 返回的数据长度 ，取值：整数
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 GetCheckNoOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                 {"RequestID":22,"datalen":8,"dwCommandCode":107,"eventName":"GetCheckNoOver",
                 "eventType":1032,"hService":1,"outdata":"27315842","result":0,"wImageSource":4}
               * @example 入参示例
                  var pszParam = {"TimeOut":30000, "ScanLocation"：2.7 };
               */

            }, {
              key: "GetCheckNo",
              value: function GetCheckNo(ScanLocation, TimeOut) {
                return this.execute('GetCheckNo', {
                  ScanLocation: ScanLocation,
                  TimeOut: TimeOut
                });
              }
            }]);

            return CPrinter;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var printer = (printer_CPrinter);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/pinpad.js






        /**
         * 密码键盘
         */

        var pinpad_CPinPad =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CPinPad, _CBaseDev);

            function CPinPad(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CPinPad);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CPinPad).call(this, serviceName, devName));
              /**
               * 算法模式：sm4: 国密; des: 国际
               */

              _this._algorithmMode = 'des';
              _this.MainKeys = ['mnk0'];
              _this.WorkKeys = ['wk0'];
              _this.KeyUsage = 0x27;
              _this.KeyCount = 16;
              _this.showMore = 0;

              for (var i = 0; i < _this.KeyCount; i++) {
                _this.MainKeys[i] = 'mnk' + i;
              }

              for (var j = 0; j < _this.KeyCount; j++) {
                _this.WorkKeys[i] = 'wk' + j;
              }

              _this.curKeysGroup = {
                'mainkey': 'mnk0',
                'workkey': 'wk0'
              };
              _this.siuType = siuType;
              _this.events = {
                /**
                 * 按键事件
                 * @param param
                 */
                'KeyPressed': function KeyPressed(param) {
                  this.dispatchEvent('KeyPressed', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 国密加载密钥事件转换
                 * @param param
                 */
                'LoadKeyExOver': function LoadKeyExOver(param) {
                  this.dispatchEvent('LoadKeyOver', param);
                },

                /**
                 * 国密获取pinblock事件转换
                 * @param param
                 */
                'GetPINBlockExOver': function GetPINBlockExOver(param) {
                  this.dispatchEvent('GetPINBlockOver', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 设置加密算法模式（设备JS封装的接口，此处不调用设备接口）
             * @param {string} algorithmMode 算法模式：sm4: 国密; 3des: 国际3des; des: 国际des
             */


            Object(createClass["a" /* default */ ])(CPinPad, [{
              key: "setAlgorithmMode",
              value: function setAlgorithmMode(algorithmMode) {
                this._algorithmMode = algorithmMode;
              }
              /**
               * 获取当前加密算法模式（设备JS封装的接口，此处不调用设备接口）
               * @return 算法模式：sm4: 国密; 3des: 国际3des; des: 国际des
               */

            }, {
              key: "getAlgorithmMode",
              value: function getAlgorithmMode() {
                return this._algorithmMode;
              }
              /**
               * 复位设备
               * @return 0: 成功，<0: 失败
               */

            }, {
              key: "ResetSync",
              value: function ResetSync() {
                //this.controlGuideLight(this.siuSpeed);
                var param = {};
                return this.getInfo('ResetSync', param);
              }
              /**
               * 复位设备
               * @return
                  复位事件 ResetOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ResetOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":122,"dwCommandCode":418,"eventName":"ResetOver","eventType":1032,
                  "hService":1,"result":0}
               */

            }, {
              key: "Reset",
              value: function Reset() {
                //this.controlGuideLight(this.siuSpeed);
                var param = {};
                return this.execute('Reset', param);
              }
              /**
               * 同步初始化密钥，注意：此接口会清空所有密钥！！！
               * @return 0: 成功，<0: 失败
               */

            }, {
              key: "InitializeSync",
              value: function InitializeSync() {
                return this.getInfo('InitializeSync', {});
              }
              /**
               * 异步初始化密钥，注意：此接口会清空所有密钥！！！
               * @param {String} Ident [可选] 向量数据
               * @param {String} KeyName [可选] 密钥名称，如果不选默认清空所有密钥
               * @return
                  初始化密钥事件 InitializeOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 InitializeOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":76,"dwCommandCode":409,"eventName":"InitializeOver",
                  "eventType":1032,"hService":1,"result":0}
               */

            }, {
              key: "Initialize",
              value: function Initialize(Ident, KeyName) {
                var param = {
                  Ident: Ident,
                  KeyName: KeyName
                };
                return this.execute('Initialize', param);
              }
              /**
               * 异步导入密钥（注：国密算法需要通过setAlgorithmMode设置，不设置默认是国际算法）
               * @param {String} Type MAIN_ENC:密文主密钥; MAIN:明文主密钥; PIN: 明文PIN密钥; PIN_ENC: 密文PIN密钥;MAC: 明文MAC密钥；MAC_ENC:密文MAC密钥
               * @param {String} KeyValue 密钥数据
               * @param {Number} keyno 密钥号:0,1,2...
               * @param {Number} KeyCheckMode 用于生成KCV的模式，可为以下取值：0：没有 KCV；1：用密钥自身加密；2：用0值加密密钥(国密模式时需要此参数)
               * @param {String} KeyCheckValue KCV数据(国密模式时需要此参数)
               * @returns event LoadKeyOver
                 加载密钥完成事件 LoadKeyOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 LoadKeyOver
                  usLength:数据长度
                  lpbData:KCV校验值
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":108,"dwCommandCode":403,"eventName":"LoadKeyOver","eventType":1032,
                  "hService":1,"lpbData":"801BB0A28632102F","result":0,"usLength":16}
               */

            }, {
              key: "LoadKey",
              value: function LoadKey(Type, KeyValue, keyno, KeyCheckMode, KeyCheckValue) {
                var param;
                var LOADKEY = 'sm4' === this.getAlgorithmMode() ? 'LoadKeyEx' : 'LoadKey';

                switch (Type) {
                  case 'MAIN_ENC':
                    param = {
                      "KeyName": this.ReflectMainKey(keyno),
                      "KeyUsage": 0x21,
                      "KeyValue": KeyValue,
                      "KeyEncKeyName": this.curKeysGroup.mainkey,
                      "KeyCheckMode": KeyCheckMode,
                      "KeyCheckValue": KeyCheckValue
                    };
                    this.execute(LOADKEY, param);
                    break;

                  case 'MAIN':
                    param = {
                      "KeyName": this.ReflectMainKey(keyno),
                      "KeyUsage": 0x21,
                      "KeyValue": KeyValue,
                      "KeyEncKeyName": '',
                      "KeyCheckMode": KeyCheckMode,
                      "KeyCheckValue": KeyCheckValue
                    };
                    this.execute(LOADKEY, param);
                    break;

                  case 'PIN':
                    param = {
                      "KeyName": this.ReflectWorkKey(keyno),
                      "KeyUsage": 0x03,
                      "KeyValue": KeyValue,
                      "KeyEncKeyName": '',
                      "KeyCheckMode": KeyCheckMode,
                      "KeyCheckValue": KeyCheckValue
                    };
                    this.execute(LOADKEY, param);
                    break;

                  case 'PIN_ENC':
                    param = {
                      "KeyName": this.ReflectWorkKey(keyno),
                      "KeyUsage": 0x03,
                      "KeyValue": KeyValue,
                      "KeyEncKeyName": this.curKeysGroup.mainkey,
                      "KeyCheckMode": KeyCheckMode,
                      "KeyCheckValue": KeyCheckValue
                    };
                    this.execute(LOADKEY, param);
                    break;

                  case 'MAC':
                    param = {
                      "KeyName": this.ReflectWorkKey(keyno),
                      "KeyUsage": 0x05,
                      "KeyValue": KeyValue,
                      "KeyEncKeyName": '',
                      "KeyCheckMode": KeyCheckMode,
                      "KeyCheckValue": KeyCheckValue
                    };
                    this.execute(LOADKEY, param);
                    break;

                  case 'MAC_ENC':
                    param = {
                      "KeyName": this.ReflectWorkKey(keyno),
                      "KeyUsage": 0x05,
                      "KeyValue": KeyValue,
                      "KeyEncKeyName": this.curKeysGroup.mainkey,
                      "KeyCheckMode": KeyCheckMode,
                      "KeyCheckValue": KeyCheckValue
                    };
                    this.execute(LOADKEY, param);
                    break;

                  case 'WORK':
                    param = {
                      "KeyName": this.ReflectWorkKey(keyno),
                      "KeyUsage": this.KeyUsage,
                      "KeyValue": KeyValue,
                      "KeyEncKeyName": '',
                      "KeyCheckMode": KeyCheckMode,
                      "KeyCheckValue": KeyCheckValue
                    };
                    this.execute(LOADKEY, param);
                    break;

                  case 'WORK_ENC':
                  default:
                    param = {
                      "KeyName": this.ReflectWorkKey(keyno),
                      "KeyUsage": this.KeyUsage,
                      "KeyValue": KeyValue,
                      "KeyEncKeyName": this.curKeysGroup.mainkey,
                      "KeyCheckMode": KeyCheckMode,
                      "KeyCheckValue": KeyCheckValue
                    };
                    this.execute(LOADKEY, param);
                    break;
                }
              }
              /**
               * 异步密文输入，在调用此接口前，需要设置如下属性：
               *
               * @param {Number} MINLength 最小长度，如果PIN输入长度小于MinLen，则忽略确认键。有效值为1~12。
               * @param {Number} MAXLength 最大长度，有效值为 1 ~ 12，但不能小于MinLen
               * @param {Number} bAutoEnd 是否自动结束
               * @param {Number} TimeOut 输入超时时间（单位：毫秒）
               * @param {Number} fdkeys  激活侧键
               * @param {Number} activeKeys  激活键
               * @returns event InputPINOver KeyPressed
               * @returns 初始化密钥事件 InputPINOver( string &pszParam)
                  其中pszParam JSON串参数：
                  field: field信息，JSON串数组，数量与count一致。 name:field的名字。 value:field的值
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 InputPINOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":99,"dwCommandCode":405,"eventName":"InputPINOver","eventType":1032,"hService":1,
                  "lpbuffer":{"usDigits":6,"wCompletion":0},"result":0}
               * @example 入参示例
                  var pszParam = {"MINLength" : 4,"MAXLength" : 6,"bAutoEnd" : 1,"ActiveKeys" : 81919,
                  "TerminateKeys" : 1024,"TimeOut": 30000}
               */

            }, {
              key: "InputPIN",
              value: function InputPIN(MAXLength, MINLength, bAutoEnd, TimeOut, fdkeys) {
                var activeKeys = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 8191;
                this.controlGuideLight(128);
                var ActiveKeys = activeKeys; // let TerminateKeys = undefined;

                var TerminateKeys = 0x00000400 | 0x00000800; // 启用返回键跟确认键为结束键

                var ActiveFDKeys = fdkeys;
                var TerminateFDKeys = undefined;
                var param = {
                  MAXLength: MAXLength,
                  MINLength: MINLength,
                  bAutoEnd: bAutoEnd,
                  TimeOut: TimeOut,
                  ActiveKeys: ActiveKeys,
                  TerminateKeys: TerminateKeys,
                  ActiveFDKeys: ActiveFDKeys,
                  TerminateFDKeys: TerminateFDKeys
                };
                return this.execute('InputPIN', param);
              }
              /**
               * 异步明文输入，在调用此接口前，需要设置如下属性：
               * @param {Number} TimeOut 输入超时时间（单位：毫秒）
               * @param {Number} ActiveKeys [可选] 激活主键，不传默认为：0x000BFFF(49151)，激活多个时值相加
                 0x00000001(WFS_PIN_FK_0)
                 0x00000002(WFS_PIN_FK_1)
                 0x00000004(WFS_PIN_FK_2)
                 0x00000008(WFS_PIN_FK_3)
                 0x00000010(WFS_PIN_FK_4)
                 0x00000020(WFS_PIN_FK_5)
                 0x00000040(WFS_PIN_FK_6)
                 0x00000080(WFS_PIN_FK_7)
                 0x00000100(WFS_PIN_FK_8)
                 0x00000200(WFS_PIN_FK_9)
                 0x00000400(WFS_PIN_FK_ENTER)
                 0x00000800(WFS_PIN_FK_CANCEL)
                 0x00001000(WFS_PIN_FK_CLEAR)
                 0x00002000(WFS_PIN_FK_BACKSPACE)
                 0x00010000(WFS_PIN_FK_00)
               * @param {String} fdkeys [可选] 激活侧键，一般不激活
               * @returns 明文输入完成事件 InputDataOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 InputDataOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":99,"dwCommandCode":408,"eventName":"InputDataOver","eventType":1032,
                  "hService":1,"lpbuffer":{"usDigits":6,"wCompletion":0},"result":0}
               * @example 入参示例
                  var pszParam = {"ActiveKeys" : 81919,"TimeOut": 30000}
               */

            }, {
              key: "InputData",
              value: function InputData(TimeOut, ActiveKeys, fdkeys) {
                var MINLength = 0;
                var MAXLength = undefined;
                var bAutoEnd = 0;

                if (!ActiveKeys) {
                  ActiveKeys = 114687 - 8192;
                }

                var TerminateKeys = 0;
                var ActiveFDKeys = fdkeys;
                var TerminateFDKeys = undefined;
                var param = {
                  MINLength: MINLength,
                  MAXLength: MAXLength,
                  bAutoEnd: bAutoEnd,
                  TimeOut: TimeOut,
                  ActiveKeys: ActiveKeys,
                  TerminateKeys: TerminateKeys,
                  ActiveFDKeys: ActiveFDKeys,
                  TerminateFDKeys: TerminateFDKeys
                };
                return this.execute('InputData', param);
              }
              /**
               * 取消所有异步请求
               * @returns 取消异步输入（明文或密文）完成事件 CancelInputOver( string &pszParam)
                  其中pszParam JSON串参数：
                  cmdName 返回取消的方法名，取值：InputPIN，InputData
                  {"cmdName":"InputData"}
               */

            }, {
              key: "CancelInput",
              value: function CancelInput() {
                return this.getInfo('CancelInput', {});
              }
              /**
               * 异步获取PinBlock，在调用此接口前，需要设置如下属性：
               * @param {String} CustomData 客户数据，如卡号
               * @param {Number} PinFormat [必选] PIN块格式，值如下，一般为0x0002(ANSI) 0x0001 (IBM3624) 0x0002 (ANSI) 0x0004 (ISO0) 0x0008 (ISO1) 0x0010 (ECI2) 0x0080 (DIEBOLD) 0x0100 (DIEBOLDCO) 0x2000 (ISO3) 0x8000 (ANSI-1)
               * @param {Number} TimeOut 超时时间（毫秒），不传默认为30s
               * @returns 获取扩展PinBlock完成事件 GetPINBlockOver( string &pszParam)
                  其中pszParam JSON串参数：
                  PINBlock: 加密结果，格式：16进制可见字符串
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 GetPINBlockOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"PINBlock":"AEE61354745CE973","RequestID":74,"dwCommandCode":407,
                  "eventName":"GetPINBlockOver","eventType":1032,"hService":1,"result":0,
                  "usLength":16}
               * @example 入参示例
                  var pszParam = {"CustomData" :"1234567891234567","PinFormat" : 2,"TimeOut": 30000}
               */

            }, {
              key: "GetPINBlock",
              value: function GetPINBlock(CustomData) {
                var PinFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0x0002;
                var TimeOut = arguments.length > 2 ? arguments[2] : undefined;
                this.controlGuideLight(1);
                var KeyEncKeyName = '';
                var GET_PIN_BLOCK = 'sm4' === this.getAlgorithmMode() ? 'GetPINBlockEx' : 'GetPINBlock';
                var param;

                if (CustomData.indexOf(';') != -1) {
                  //@tcice 这里应该不用在支持';'这个需求
                  param = {
                    KeyName: "wk0;wk2",
                    CustomData: CustomData,
                    PinFormat: PinFormat,
                    TimeOut: TimeOut
                  };
                  this.execute(GET_PIN_BLOCK, param);
                } else {
                  param = {
                    KeyEncKeyName: KeyEncKeyName,
                    KeyName: this.curKeysGroup.workkey,
                    CustomData: CustomData,
                    PinFormat: PinFormat,
                    TimeOut: TimeOut
                  };
                  this.execute(GET_PIN_BLOCK, param);
                }
              }
              /**
               * 异步解密数据，在调用此接口前，需要设置如下属性：
               * -- KeyName [必选] 密钥名称，一般为导入的工作密钥名称，如mackey，或者pinkey，或者mackey等
               * @param {String} CryptData[必选] 需要加密的数据，16进制可见字符串
               * @param {Number} Algorithm[必选] 算法 0x0001 - DESECB算法； 0x0002 - DESCBC算法； 0x0004 - DESCFB算法； 0x0040 - 3DESECB算法； 0x0080 - 3DESCBC算法； 0x0100 - 3DESCFB算法； 0x1000 - SM4算法；
               * @param {Number} keyno[必选] 密钥号 0~16
               * @param {Number} PadChar[必选] 填充字符，一般为：0x00或者0x0F
               * @param {Number} KeyEncKey[可选] 加密密钥，KeyEncKey为空时表示使用KeyName作为加解密计算；否则，使用名称为KeyName的密钥解密KeyEncKey，并将解密结果作为加/解密密钥，如masterkey
               * @param {String} StartValueKeyName[可选] 解密StartValue的密钥名称，将StartValue解密后的数据作为初始化向量，一般为NULL
               * @param {Number} EncryptMode[可选] 加密模式，1 - 加密
               * @param {String} StartValue[可选] 初始化向量，一般为NULL
               * @returns 解密数据完成事件 DecryptOver( string &pszParam)
                  其中pszParam JSON串参数：
                  CryptData: 解密结果，格式：16进制可见字符串
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 DecryptOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"CryptData":"51DBDA1AE1976DFCDB1AFC5A24F9339F","RequestID":53,"dwCommandCode":401,
                  "eventName":"DecryptOver","eventType":1032,"hService":1,"result":0,"usLength":32}
               * @example 入参示例
                  var pszParam = {"KeyName" :"pinkey","CryptData" : "12345678123456781234567812345678",
                  "Algorithm" : 1,"PadChar" : 0,"KeyEncKey"："","StartValueKeyName":"","StartValue"："",
                  "TimeOut": 30000}
               */

            }, {
              key: "Decrypt",
              value: function Decrypt(CryptData) {
                var keyno = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var keyEncKeyno = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
                var EncryptMode = arguments.length > 3 ? arguments[3] : undefined;
                var Algorithm = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0x0001;
                var PadChar = arguments.length > 5 ? arguments[5] : undefined;
                var StartValueKeyName = arguments.length > 6 ? arguments[6] : undefined;
                var StartValue = arguments.length > 7 ? arguments[7] : undefined;
                var KeyName = this.ReflectWorkKey(keyno);
                var KeyEncKeyName = '';

                if (-1 != keyEncKeyno) {
                  KeyEncKeyName = this.ReflectMainKey(keyEncKeyno);
                }

                if ('sm4' === this.getAlgorithmMode()) {
                  // 国密固定0x1000
                  Algorithm = 0x1000;
                }

                var param = {
                  KeyName: KeyName,
                  CryptData: CryptData,
                  KeyEncKeyName: KeyEncKeyName,
                  EncryptMode: EncryptMode,
                  Algorithm: Algorithm,
                  PadChar: PadChar,
                  StartValueKeyName: StartValueKeyName,
                  StartValue: StartValue
                };
                return this.execute('Decrypt', param);
              }
              /**
               * 异步加密数据，在调用此接口前，需要设置如下属性：
               * -- KeyName [必选] 密钥名称，一般为导入的工作密钥名称，如mackey，或者pinkey，或者mackey等
               * @param {String} CryptData[必选] 需要加密的数据，16进制可见字符串
               * @param {Number} Algorithm[必选] 算法 0x0001 - DESECB算法； 0x0002 - DESCBC算法； 0x0004 - DESCFB算法； 0x0040 - 3DESECB算法； 0x0080 - 3DESCBC算法； 0x0100 - 3DESCFB算法； 0x1000 - SM4算法；
               * @param {Number} PadChar[必选] 填充字符，一般为：0x00或者0x0F
               * @param {Number} keyno[必选] 密钥号 0~16
               * @param {Number} KeyEncKey[可选] 加密密钥，KeyEncKey为空时表示使用KeyName作为加解密计算；否则，使用名称为KeyName的密钥解密KeyEncKey，并将解密结果作为加/解密密钥，如masterkey
               * @param {String} StartValueKeyName[可选] 解密StartValue的密钥名称，将StartValue解密后的数据作为初始化向量，一般为NULL
               * @param {Number} EncryptMode[可选] 加密模式，1 - 加密
               * @param {String} StartValue[可选] 初始化向量，一般为NULL
               * @param {String} StartValue[可选] 初始化向量，一般为NULL
               * @returns 加密数据完成事件 EncryptOver( string &pszParam)
                  其中pszParam JSON串参数：
                  CryptData: 加密结果，格式：16进制可见字符串
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 EncryptOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"CryptData":"D13EB9174702E36B4E846D1CED8695D9","RequestID":62,"dwCommandCode":401,
                  "eventName":"EncryptOver","eventType":1032,"hService":1,"result":0,"usLength":32}
               * @example 入参示例
                  var pszParam = {"KeyName" :"pinkey","CryptData" : "12345678123456781234567812345678",
                  "Algorithm" : 1,"PadChar" : 0,"KeyEncKey"："","StartValueKeyName":"","StartValue"："",
                  "TimeOut": 30000}
                 */

            }, {
              key: "Encrypt",
              value: function Encrypt(CryptData) {
                var keyno = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var keyEncKeyno = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
                var EncryptMode = arguments.length > 3 ? arguments[3] : undefined;
                var Algorithm = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0x0001;
                var PadChar = arguments.length > 5 ? arguments[5] : undefined;
                var StartValueKeyName = arguments.length > 6 ? arguments[6] : undefined;
                var StartValue = arguments.length > 7 ? arguments[7] : undefined;
                var KeyName = this.ReflectWorkKey(keyno);
                var KeyEncKey = '';

                if (-1 != keyEncKeyno) {
                  KeyEncKey = this.ReflectMainKey(keyEncKeyno);
                }

                if ('sm4' === this.getAlgorithmMode()) {
                  // 国密固定0x1000
                  Algorithm = 0x1000;
                }

                var param = {
                  KeyName: KeyName || this.curKeysGroup.workkey,
                  CryptData: CryptData,
                  KeyEncKey: KeyEncKey,
                  EncryptMode: EncryptMode,
                  Algorithm: Algorithm,
                  PadChar: PadChar,
                  StartValueKeyName: StartValueKeyName,
                  StartValue: StartValue
                };
                return this.execute('Encrypt', param);
              }
              /**
               * 异步生成MAC数据
               * -- KeyName [必选] 密钥名称，一般为导入的工作密钥名称
               * @param {String} CryptData [必选] 需要加密的数据，数据类型：16进制可见字符串
               * @param {Number} PadChar [必选] 填充字符，一般为：0x00或者0x0F
               * @param {Number} Algorithm [可选] 接口内部已自动判断算法模式，可不传参数；算法 0x0020(32) - DESMAC算法； 0x0200(512) - 3DESMAC算法； 0x2000(8192) - SM4MAC算法；
               * @param {String} KeyEncKey [可选] 加密密钥，KeyEncKey为空时表示使用KeyName作为加解密计算；否则，使用名称为KeyName的密钥解密KeyEncKey，并将解密结果作为加/解密密钥
               * @param {String} StartValueKeyName [可选] 解密StartValue的密钥名称，将StartValue解密后的数据作为初始化向量，一般为NULL
               * @param {Number} EncryptMode [可选] 加密模式，1 - 加密
               * @param {String} StartValue [可选] 初始化向量，一般为NULL
               * @returns 生成MAC完成事件 GenerateMACOver( string &pszParam)
                  其中pszParam JSON串参数：
                  CryptData: MAC计算结果，格式：16进制可见字符串
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 GenerateMACOver
                  usLength：数据长度
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"CryptData":"3D0FD7A0D35FC759","RequestID":64,"dwCommandCode":401,"eventName":"GenerateMACOver",
                  "eventType":1032,"hService":1,"result":0,"usLength":16}
               * @example 入参示例
                  var pszParam = {"KeyName" :"pinkey","CryptData" : "12345678123456781234567812345678",
                  "Algorithm" : 512,"PadChar" : 0,"KeyEncKey"："","StartValueKeyName":"","StartValue"："",
                  "TimeOut": 30000}
               */

            }, {
              key: "GenerateMAC",
              value: function GenerateMAC(CryptData) {
                var PadChar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0x00;
                var Algorithm = arguments.length > 2 ? arguments[2] : undefined;
                var KeyEncKey = arguments.length > 3 ? arguments[3] : undefined;
                var StartValueKeyName = arguments.length > 4 ? arguments[4] : undefined;
                var EncryptMode = arguments.length > 5 ? arguments[5] : undefined;
                var StartValue = arguments.length > 6 ? arguments[6] : undefined;

                if (!Algorithm) {
                  Algorithm = 0x0200;

                  switch (this.getAlgorithmMode()) {
                    case 'sm4':
                      Algorithm = 0x2000;
                      break;

                    case '3des':
                      Algorithm = 0x0200;
                      break;

                    case 'des':
                      Algorithm = 0x0020;
                      break;
                  }
                }

                var param = {
                  "KeyName": this.curKeysGroup.workkey,
                  "CryptData": CryptData,
                  PadChar: PadChar,
                  Algorithm: Algorithm,
                  KeyEncKey: KeyEncKey,
                  StartValueKeyName: StartValueKeyName,
                  EncryptMode: EncryptMode,
                  StartValue: StartValue
                };
                return this.execute('GenerateMAC', param);
              }
              /**
               * 同步生成MAC数据，在调用此接口前，需要设置如下属性
               */

            }, {
              key: "GenerateMACSync",
              value: function GenerateMACSync(CryptData, Algorithm) {
                var KeyEncKeyName = '';
                var param = {
                  KeyEncKeyName: KeyEncKeyName,
                  KeyName: this.curKeysGroup.workkey,
                  CryptData: CryptData,
                  Algorithm: Algorithm
                };
                return this.getInfo('GenerateMACSync', param);
              }
              /**
               * 异步加密客户数据，在调用此接口前，需要设置如下属性
               * @param {String} CardNo 卡序号
               * @param {String} Pin 个人密码
               * @param {Number} keyno 存储的密钥号（wk0）
               * @returns event CustomEncryptOver
               */

            }, {
              key: "CustomEncrypt",
              value: function CustomEncrypt(CardNo, Pin) {
                var keyno = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var KeyEncKeyName = '';
                var KeyName = this.ReflectWorkKey(keyno);
                var param = {
                  KeyEncKeyName: KeyEncKeyName,
                  KeyName: KeyName || this.curKeysGroup.workkey,
                  CardNo: CardNo,
                  Pin: Pin
                };
                return this.execute('CustomEncrypt', param);
              }
              /**
               * 异步更新设备状态, 此接口不对外使用
               * @ignore
               */

            }, {
              key: "UpdateStatus",
              value: function UpdateStatus() {
                return this.execute('UpdateStatus', {});
              }
              /**
               * 选择主密钥号
               * @param {Number} keyno 主密钥号 0~16
               */

            }, {
              key: "SelectMainKeySync",
              value: function SelectMainKeySync(keyno) {
                if (undefined == keyno || isNaN(keyno) || keyno < 0 || keyno >= this.KeyCount) {
                  this.curKeysGroup.mainkey = 'mnk0';
                } else {
                  this.curKeysGroup.mainkey = 'mnk' + keyno;
                }
              }
              /**
               * 从主密钥号映射主密钥名
               * @param {Number} keyno 主密钥号 0~16
               */

            }, {
              key: "ReflectMainKey",
              value: function ReflectMainKey(keyno) {
                return 'mnk' + this.getKeyNo(keyno);
              }
              /**
               * 选择工作密钥号
               * @param {Number} keyno 工作密钥号 0~16
               */

            }, {
              key: "SelectWorkKeySync",
              value: function SelectWorkKeySync(keyno) {
                if (undefined == keyno || isNaN(keyno) || keyno < 0 || keyno >= this.KeyCount) {
                  this.curKeysGroup.workkey = 'wk0';
                } else {
                  this.curKeysGroup.workkey = 'wk' + keyno;
                }
              }
              /**
               * 从工作密钥号映射密钥名
               * @param {Number} keyno 工作密钥号 0~16
               */

            }, {
              key: "ReflectWorkKey",
              value: function ReflectWorkKey(keyno) {
                if (undefined == keyno || isNaN(keyno) || keyno < 0 || keyno >= this.KeyCount) {
                  return 'wk0';
                } else {
                  return 'wk' + keyno;
                }
              }
              /**
               * @ignore
               * @param value
               */

            }, {
              key: "setShowMore",
              value: function setShowMore(value) {
                this.showMore = value;
              }
              /**
               * 获取密钥号
               * @param {Number} keyno  工作密钥号 0~16
               */

            }, {
              key: "getKeyNo",
              value: function getKeyNo(keyno) {
                if (undefined == keyno || isNaN(keyno) || keyno < 0 || keyno >= this.KeyCount) {
                  return 0;
                } else {
                  return keyno;
                }
              }
              /**
               * 获取密钥信息
               * @param {Number} keyno 密钥号
               * @param {Number} TimeOut 超时时间（毫秒），不传默认30000
               */

            }, {
              key: "GetKeyDetail",
              value: function GetKeyDetail(keyno) {
                var TimeOut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30000;
                var KeyName = this.ReflectWorkKey(keyno);
                var param = {
                  KeyName: KeyName,
                  TimeOut: TimeOut
                };
                return this.execute('GetKeyDetail', param);
              }
              /**
               * 导出Epp公钥以及序列号
               * @param {String} Name 公钥名称
               * @param {Number} wExportItemType 导出公钥类型，可为以下取值：WFS_PIN_EXPORT_EPP_ID(1)：获取键盘ID及签名数据，WFS_PIN_EXPORT_PUBLIC_KEY(2)：获取键盘公钥及签名数据，数据类型：整形，不选默认为2
               * @param {String} SigKey 签名密钥名称，数据类型：字符串，不选默认为NULL
               * @param {Number} SignatureAlgorithm 签名算法，可为以下取值：WFS_PIN_SIGN_NA(0)，WFS_PIN_SIGN_RSASSA_PKCS1_V1_5(1)，WFS_PIN_SIGN_RSASSA_PSS（2）,数据类型：整形，不选默认为1
               * @param {Number} TimeOut 超时时间（毫秒），不传默认为30s，数据类型：整型
               * @returns ExportRSAEppSignedItemOver( string &pszParam)
               * @example 入参示例
                  var pszParam = {"Name" : "","wExportItemType" : 2,"SigKey" : "","SignatureAlgorithm" : 1,"TimeOut": 30000}
               */

            }, {
              key: "ExportRSAEppSignedItem",
              value: function ExportRSAEppSignedItem() {
                var Name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'NULL';
                var wExportItemType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
                var SigKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'NULL';
                var SignatureAlgorithm = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
                var TimeOut = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 30000;
                var param = {
                  Name: Name,
                  wExportItemType: wExportItemType,
                  SigKey: SigKey,
                  SignatureAlgorithm: SignatureAlgorithm,
                  TimeOut: TimeOut
                };
                return this.execute('ExportRSAEppSignedItem', param);
              }
              /**
               * 导出厂商公钥以及序列号
               * @param {String} Name 公钥名称
               * @param {Number} wExportItemType 导出公钥类型，可为以下取值：WFS_PIN_EXPORT_EPP_ID(1)：获取键盘ID及签名数据，WFS_PIN_EXPORT_PUBLIC_KEY(2)：获取键盘公钥及签名数据，数据类型：整形，不选默认为2
               * @param {Number} TimeOut 超时时间（毫秒），不传默认为30s，数据类型：整型
               * @returns  ExportRSAIssuerSignedItemOver( string &pszParam)
               * @example 入参示例
                  var pszParam = {"Name" : "","wExportItemType" : 2,"TimeOut": 30000};
               */

            }, {
              key: "ExportRSAIssuerSignedItem",
              value: function ExportRSAIssuerSignedItem() {
                var Name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'NULL';
                var wExportItemType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
                var TimeOut = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30000;
                var param = {
                  Name: Name,
                  wExportItemType: wExportItemType,
                  TimeOut: TimeOut
                };
                return this.execute('ExportRSAIssuerSignedItem', param);
              }
              /**
              * 导入主机RSA公钥
              * @param {String} PublicKeyName 主机公钥名，最大长度为24字节，数据类型：字符串
              * @param {Number} PublicKeyUsage 公钥用途,可为以下取值：WFS_PIN_USERSAPUBLICVERIFY[0x8000000(134217728)]，WFS_PIN_USERSAPUBLIC[0x20000(131072)]数据类型：整形，不选默认为0x8000000
              * @param {String} PublicKeydata 公钥数据，数据类型：16进制可见字符串
              * @param {String} SigKeyName 用于验签的公钥名，数据类型：字符串
              * @param {Number} SignatureAlgorithm 用于生成签名数据的算法,可为以下取值：WFS_PIN_SIGN_NA(0),WFS_PIN_SIGN_RSASSA_PKCS1_V1_5(1),WFS_PIN_SIGN_RSASSA_PSS(2),数据类型：整形,不选默认为1
              * @param {String} SignatureData 公钥签名数据，数据类型：16进制可见字符串
              * @param {Number} TimeOut 超时时间（毫秒），不传默认为30s，数据类型：整型
               * @returns   ImportRSAPublicKeyOver( string &pszParam)
               * @example 入参示例
                  var pszParam = {"PublicKeyName" : "HostPublicKey","PublicKeyUsage" :134217728 ,
                  "PublicKeydata" : "12345678...","SigKeyName" : "_SigIssuerVendor","SignatureAlgorithm":1,
                  "SignatureData" : "12345678...","TimeOut": 30000};
               */

            }, {
              key: "ImportRSAPublicKey",
              value: function ImportRSAPublicKey(PublicKeyName) {
                var PublicKeyUsage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 134217728;
                var PublicKeydata = arguments.length > 2 ? arguments[2] : undefined;
                var SigKeyName = arguments.length > 3 ? arguments[3] : undefined;
                var SignatureAlgorithm = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
                var SignatureData = arguments.length > 5 ? arguments[5] : undefined;
                var TimeOut = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 30000;
                var param = {
                  PublicKeyName: PublicKeyName,
                  PublicKeyUsage: PublicKeyUsage,
                  PublicKeydata: PublicKeydata,
                  SigKeyName: SigKeyName,
                  SignatureAlgorithm: SignatureAlgorithm,
                  SignatureData: SignatureData,
                  TimeOut: TimeOut
                };
                return this.execute('ImportRSAPublicKey', param);
              }
              /**
              * 导入RSA签名的DES密钥
              * @param {Number} keyno 密钥号
              * @param {Number} KeyUsage DES密钥的用途,可为以下取值：WFS_PIN_USECRYPT[0x1(1)]，WFS_PIN_USEFUNCTION[0x2(2)],WFS_PIN_USEMACING[0x4(4)],WFS_PIN_USEKEYENCKEY[0x0020(32)],数据类型：整形，不选默认为1
              * @param {String} DecryptKeyName 用于解密的RSA私钥名
              * @param {Number} EncipherAlgorithm 指定用RSA私钥解密的算法，可为以下取值：WFS_PIN_SIGN_RSASSA_PKCS1_V1_5[0x1(1)],WFS_PIN_CRYPT_RSAES_OAEP[0x2(2)],数据类型：整形,不选默认为1
              * @param {String} KeyData 要导入的DES密钥的密文数据, 数据类型：16进制可见字符串
              * @param {String} SigKeyName 用于验签的公钥名
              * @param {Number} SignatureAlgorihtm 用于生成签名数据的算法,可为以下取值：WFS_PIN_SIGN_NA(0),WFS_PIN_SIGN_RSASSA_PKCS1_V1_5(1),WFS_PIN_SIGN_RSASSA_PSS(2),数据类型：整形,不选默认为1
              * @param {String} SignatureData 要导入密钥的签名数据,数据类型：16进制可见字符串
              * @param {Number} TimeOut 超时时间（毫秒），不传默认为30s，数据类型：整型
               * @returns  ImportRSASignedDesKeyOver( string &pszParam)
               * @example 入参示例
                  var pszParam = {"KeyName" : "MasterKey","KeyUsage" :1 ,"DecryptKeyName" : "_EPPCryptKey",
                  "EncipherAlgorithm" : 1,"KeyData":"123...","SigKeyName" : "HostPublicKey",
                  "SignatureAlgorihtm" : 1,"SignatureData" : "123456...","TimeOut": 30000};
               */

            }, {
              key: "ImportRSASignedDesKey",
              value: function ImportRSASignedDesKey(keyno) {
                var KeyUsage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
                var DecryptKeyName = arguments.length > 2 ? arguments[2] : undefined;
                var EncipherAlgorithm = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
                var KeyData = arguments.length > 4 ? arguments[4] : undefined;
                var SigKeyName = arguments.length > 5 ? arguments[5] : undefined;
                var SignatureAlgorihtm = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
                var SignatureData = arguments.length > 7 ? arguments[7] : undefined;
                var TimeOut = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 30000;
                var KeyName = this.ReflectWorkKey(keyno);
                var param = {
                  KeyName: KeyName,
                  KeyUsage: KeyUsage,
                  DecryptKeyName: DecryptKeyName,
                  EncipherAlgorithm: EncipherAlgorithm,
                  KeyData: KeyData,
                  SigKeyName: SigKeyName,
                  SignatureAlgorihtm: SignatureAlgorihtm,
                  SignatureData: SignatureData,
                  TimeOut: TimeOut
                };
                return this.execute('ImportRSASignedDesKey', param);
              }
            }]);

            return CPinPad;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var pinpad = (pinpad_CPinPad);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/camera.js






        /**
         * 摄像头
         */

        var camera_CCamera =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CCamera, _CBaseDev);

            function CCamera(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CCamera);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CCamera).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 复位,异步接口
             *
             */


            Object(createClass["a" /* default */ ])(CCamera, [{
              key: "Reset",
              value: function Reset() {
                return this.execute('Reset', {});
              }
              /**
               * 复位,同步接口
               *
               */

            }, {
              key: "ResetSync",
              value: function ResetSync() {
                return this.getInfo('ResetSync', {});
              }
              /**
               * 设置拍照预览窗口大小
               * @param {number} num 摄像头编号类型0~3，默认传0
               *        0：环境摄像头，监控整个设备区域
                        1：人脸摄像头，监控人员区域
                        2：出口摄像头，监控设备出口槽区域
                        3：扩展摄像头，其他区域
               * @param {number} action  窗口预览动作0~3，默认传0
                        0: 创建窗口
                        1: 销毁窗口
                        2: 暂停显示窗口
                        3: 恢复显示窗口
               * @param {number} width 窗口宽度，不传默认为300
               * @param {number} height 窗口高度，不传默认为400
               * @param {number} x [可选] 窗口左上角X坐标
               * @param {number} y [可选] 窗口左上角Y坐标
               * @param {number} Hpixel [可选] 水平分辨率，不传默认为320
               * @param {number} Vpixel [可选] 垂直分辨率，不传默认为480
               * @param {number} TimeOut 超时时间（毫秒），不传默认为30000，传0无限超时
               * @returns 开始预览完成事件 SetVideoDisplayOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 SetVideoDisplayOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"Action":0,"RequestID":5,"dwCommandCode":1099,"eventName":"SetVideoDisplayOver","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"Camera" : 0,"Action" : 0,"Width" : 480,"Height":320,"X" : 10,"Y" : 10,"TimeOut": 30000};
               */

            }, {
              key: "SetVideoDisplay",
              value: function SetVideoDisplay() {
                var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var width = arguments.length > 2 ? arguments[2] : undefined;
                var height = arguments.length > 3 ? arguments[3] : undefined;
                var x = arguments.length > 4 ? arguments[4] : undefined;
                var y = arguments.length > 5 ? arguments[5] : undefined;
                var Hpixel = arguments.length > 6 ? arguments[6] : undefined;
                var Vpixel = arguments.length > 7 ? arguments[7] : undefined;
                var TimeOut = arguments.length > 8 ? arguments[8] : undefined;
                var param = {
                  Camera: num,
                  Action: action,
                  Width: width,
                  Height: height,
                  X: x,
                  Y: y,
                  Hpixel: Hpixel,
                  Vpixel: Vpixel,
                  TimeOut: TimeOut
                };
                return this.execute('SetVideoDisplay', param);
              }
              /**
               * 拍照（普通摄像头），活体检测拍照（双目摄像头），并存储成文件。在拍照之前，必须先执行SetVideoDisplay方法
               * @param {number} num 摄像头编号0~3，默认传0：0 - 环境摄像头；1 - 人脸摄像头； 2 - 出口摄像头；3 - 扩展摄像头
               * @param path 图片文件存储路径(含文件名)，如"C:\picturepath.jpg"
               * @param {number} command 拍照图片的大小和形状
               *        0:WFS_CAM_SIZEALL
                        1:WFS_CAM_SIZEA4
                        2:WFS_CAM_SIZEA5
                        3:WFS_CAM_SIZEA6
                        4:WFS_CAM_SIZEA7
                        5:WFS_CAM_SIZECALLINGCARD
                        6:WFS_CAM_SIZEEID
                        7:WFS_CAM_SIZECUSTOM
                        8:WFS_CAM_SIZEAJUSTEDTOWINDOW
                        9:WFS_CAM_SIZEAJUSTEDTOFRAME
                  @param {number} TimeOut 超时时间(毫秒)，不传默认为30s，传0无限超时
                * @returns 拍照完成事件 TakePictureOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 SetVideoDisplayOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":7,"dwCommandCode":1003,"eventName":"TakePictureOver","eventType":1032,"hService":1,"result":0}
                 * @example 入参示例
                  var pszParam = {"Camera" : 0,"PictureSaveToPath" : "C:\picturepath.jpg","TimeOut": 30000};
               */

            }, {
              key: "TakePicture",
              value: function TakePicture(num, path, command, TimeOut) {
                var param = {
                  Camera: num,
                  PictureSaveToPath: path,
                  ScanSize: command,
                  TimeOut: TimeOut
                };
                return this.execute('TakePicture', param);
              }
              /**
               * 双录
               * @param {number} num 摄像头编号0~3
               * @param path 录像文件存储路径(含文件名)
               * @param {number} scoreset
               */

            }, {
              key: "TakePictureB",
              value: function TakePictureB(num, path, scoreset) {
                var param = {
                  Camera: num,
                  PictureSaveToPath: path,
                  livenessScoreSet: scoreset
                };
                return this.execute('TakePictureB', param);
              }
              /**
               * 高拍仪专用 - 打开摄像头，显示预览画面
               **@param {number} wAction 预览动作。数据类型：整形。取值说明： -- 0:开始预览
               * @param {number} wCamera  高拍仪索引。数据类型：整型。取值说明： -- 3:高拍仪
               * @param {number} wWidth 预览宽度。数据类型：整型
               * @param {number} wHeight 预览高度。数据类型：整型
               * @param {number} wX 预览起始横坐标。数据类型：整型
               * @param {number} wY 预览起始纵坐标。数据类型：整型
               * @param hWnd 父窗口句柄，可以为空。数据类型：整型
               * @param {number} TimeOut 超时时间（毫秒），不传默认为30000，传0无限超时。数据类型：整型
               * @returns 开始预览完成事件 StartTakePictureOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 StartTakePictureOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
               * @example 示例
                  var pszParam = {"wAction":0,"wCamera":3,"wWidth":320,"wHeight":400,"wX":10,"wY":10,"hWnd":0,"TimeOut":5000};
               */

            }, {
              key: "StartTakePicture",
              value: function StartTakePicture(wAction, wCamera, wWidth, wHeight, wX, wY, hWnd, TimeOut) {
                var param = {
                  wAction: wAction,
                  wCamera: wCamera,
                  wWidth: wWidth,
                  wHeight: wHeight,
                  wX: wX,
                  wY: wY,
                  hWnd: hWnd,
                  TimeOut: TimeOut
                };
                return this.execute('StartTakePicture', param);
              }
              /**
               * 高拍仪专用 - 拍摄照片，将照片存到指定位置
               * @param {number} wCamera 高拍仪索引。数据类型：整型。取值说明： -- 3:高拍仪
               * @param {number} wScanSize 取照片大小 非空 0,1,2,3,4,5,6,7分别对应 "All"， "A4"，"A5"，"A6"，"A7"，"名片"，"身份证"，"自定义
               * @param lpszCamData  图片中需加入的文本。数据类型：字符串
               * @param pathname 图片文件存储路径(含文件名)，图片格式支持bmp，jgp 非空
               * @param {number} TimeOut  超时时间（毫秒），不传默认为30000，传0无限超时。数据类型：整型
               */

            }, {
              key: "GetPictureSync",
              value: function GetPictureSync(wCamera, wScanSize, lpszCamData, pathname, TimeOut) {
                var param = {
                  wCamera: wCamera,
                  wScanSize: wScanSize,
                  lpszCamData: lpszCamData,
                  pathname: pathname,
                  TimeOut: TimeOut
                };
                return this.execute('GetPictureSync', param);
              }
              /**
               * 高拍仪专用 - 暂停预览，画面停住
               * @param {number} wAction 预览动作。数据类型：整形。取值说明： -- 2:暂停预览
               * @param {number} wCamera  高拍仪索引。数据类型：整型。取值说明： -- 3:高拍仪
               * @param {number} wWidth 预览宽度。数据类型：整型
               * @param {number} wHeight 预览高度。数据类型：整型
               * @param {number} wX 预览起始横坐标。数据类型：整型
               * @param {number} wY 预览起始纵坐标。数据类型：整型
               * @param hWnd 父窗口句柄，可以为空。数据类型：整型
               * @param {number} TimeOut 超时时间（毫秒），不传默认为30000，传0无限超时。数据类型：整型
               * @returns 暂停预览完成事件 PauseTakePictureOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 PauseTakePictureOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
               * @example 示例
                  var pszParam = {"wAction":2,"wCamera":3,"wWidth":320,"wHeight":400,"wX":10,"wY":10,"hWnd":0,"TimeOut":5000};
               */

            }, {
              key: "PauseTakePicture",
              value: function PauseTakePicture(wAction, wCamera, wWidth, wHeight, wX, wY, hWnd, TimeOut) {
                var param = {
                  wAction: wAction,
                  wCamera: wCamera,
                  wWidth: wWidth,
                  wHeight: wHeight,
                  wX: wX,
                  wY: wY,
                  hWnd: hWnd,
                  TimeOut: TimeOut
                };
                return this.execute('PauseTakePicture', param);
              }
              /**
               * 高拍仪专用 - 恢复预览
               * @param {number} wAction 预览动作。数据类型：整形。取值说明： --  3:恢复预览
               * @param {number} wCamera  高拍仪索引。数据类型：整型。取值说明： -- 3:高拍仪
               * @param {number} wWidth 预览宽度。数据类型：整型
               * @param {number} wHeight 预览高度。数据类型：整型
               * @param {number} wX 预览起始横坐标。数据类型：整型
               * @param {number} wY 预览起始纵坐标。数据类型：整型
               * @param hWnd 父窗口句柄，可以为空。数据类型：整型
               * @param {number} TimeOut 超时时间（毫秒），不传默认为30000，传0无限超时。数据类型：整型
               * @returns 恢复预览完成事件 ResumeTakePictureOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ResumeTakePictureOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
               * @example 示例
                  var pszParam = {"wAction":3,"wCamera":3,"wWidth":320,"wHeight":400,"wX":10,"wY":10,"hWnd":0,"TimeOut":5000} ;
               */

            }, {
              key: "ResumeTakePicture",
              value: function ResumeTakePicture(wAction, wCamera, wWidth, wHeight, wX, wY, hWnd, TimeOut) {
                var param = {
                  wAction: wAction,
                  wCamera: wCamera,
                  wWidth: wWidth,
                  wHeight: wHeight,
                  wX: wX,
                  wY: wY,
                  hWnd: hWnd,
                  TimeOut: TimeOut
                };
                return this.execute('ResumeTakePicture', param);
              }
              /**
               * 高拍仪专用 - 关闭预览画面
               * @param {number} wAction 预览动作。数据类型：整形。取值说明： --   1:停止预览
               * @param {number} wCamera  高拍仪索引。数据类型：整型。取值说明： -- 3:高拍仪
               * @param {number} wWidth 预览宽度。数据类型：整型
               * @param {number} wHeight 预览高度。数据类型：整型
               * @param {number} wX 预览起始横坐标。数据类型：整型
               * @param {number} wY 预览起始纵坐标。数据类型：整型
               * @param hWnd 父窗口句柄，可以为空。数据类型：整型
               * @param {number} TimeOut 超时时间（毫秒），不传默认为30000，传0无限超时。数据类型：整型
               * @returns 关闭预览完成事件 ResumeTakePictureOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ResumeTakePictureOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
               * @example 示例
                  var pszParam = {"wAction":3,"wCamera":3,"wWidth":320,"wHeight":400,"wX":10,"wY":10,"hWnd":0,"TimeOut":5000} ;
               */

            }, {
              key: "StopTakePicture",
              value: function StopTakePicture(wAction, wCamera, wWidth, wHeight, wX, wY, hWnd, TimeOut) {
                var param = {
                  wAction: wAction,
                  wCamera: wCamera,
                  wWidth: wWidth,
                  wHeight: wHeight,
                  wX: wX,
                  wY: wY,
                  hWnd: hWnd,
                  TimeOut: TimeOut
                };
                return this.execute('StopTakePicture', param);
              }
              /**
               * 人脸识别专用 - 人脸识别(xfs320)
               * @param {number} Camera [必选] 摄像头索引0-3，默认传0：0 - 环境摄像头；1 - ⼈脸摄像头； 2 - 出⼝摄像头；3 - 扩展摄像头；数据类型：整型
               * @param PictureSaveToPath 图片保存路径
               * @param {number} TimeOut 超时时间（毫秒），不传默认为30000，传0无限超时
               * @param {number} wScanSize [必选] 图像控制参数: 0 - 普通摄像头拍照；8 - 普通摄像头截屏；9 - 普通摄像头拍照；10 - 双⽬摄像头活体拍照；不传默认为10，数据类型：整型
               * @returns 拍照（普通摄像头），活体检测拍照（双目摄像头）完成事件 TakePictureFaceOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 TakePictureFaceOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":7,"dwCommandCode":1095,"eventName":"TakePictureFaceOver","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"Camera" : 1,"PictureSaveToPath" : "C:\picturepath.jpg","TimeOut": 30000, "wScanSize"：10};
               */

            }, {
              key: "TakePictureFace",
              value: function TakePictureFace(Camera, PictureSaveToPath, TimeOut) {
                var wScanSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
                var param = {
                  Camera: Camera,
                  PictureSaveToPath: PictureSaveToPath,
                  wScanSize: wScanSize,
                  TimeOut: TimeOut
                };
                return this.execute('TakePictureFace', param);
              }
              /**
               * 人脸识别专用 - 拍照（普通摄像头），活体检测拍照并返回分数（双目摄像头）（异步）(华泰证券使用)
               * @param {number} Camera [必选] 摄像头索引0-3，默认传0：0 - 环境摄像头；1 - ⼈脸摄像头； 2 - 出⼝摄像头；3 - 扩展摄像头；数据类型：整型
               * @param PictureSaveToPath [必选]图片保存路径
               * @param {number} wScore [必选]活体检测分数（最佳人脸分数）: 取值为0-100；不传默认为0，数据类型：整型
               * @param lpszCamData [可选] 指令显示在照片上的文本数据，不传默认无，数据类型：字符串
               * @param {number} TimeOut 超时时间（毫秒），不传默认为30000，传0无限超时
               * @returns 事件 TakePictureFaceBOver ( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 TakePictureFaceBOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
               * {"wScore":98,"RequestID":38,"eventName":"TakePictureFaceBOver","result":0}
              * @example 入参示例
                  var pszParam = {"Camera" : 1,"PictureSaveToPath" : "C:\picturepath.jpg",wScore：70,"TimeOut": 30000};
               */

            }, {
              key: "TakePictureFaceB",
              value: function TakePictureFaceB(Camera, PictureSaveToPath, wScore, TimeOut) {
                var param = {
                  Camera: Camera,
                  PictureSaveToPath: PictureSaveToPath,
                  wScore: wScore,
                  TimeOut: TimeOut
                };
                return this.execute('TakePictureFaceB', param);
              }
              /**
               * 人脸识别专用 - 活体检测（xfs310，工行使用）
               * @param {number} num
               * @param {number} action
               * @param path
               * @param {number} TimeOut 超时时间（毫秒），不传默认为30000，传0无限超时
               */

            }, {
              key: "TakePictureLive",
              value: function TakePictureLive(num, action, path, TimeOut) {
                var actionnum = action * 100 + 100 + num;
                var param = {
                  actionnum: actionnum,
                  path: path,
                  TimeOut: TimeOut
                };
                return this.execute('TakePictureFace', param);
              }
              /**
               * 人脸识别专用 - 取消人脸识别
               */

            }, {
              key: "CancelTakePicture",
              value: function CancelTakePicture() {
                return this.execute('CancelTakePicture', {});
              }
              /**
               * 人脸比对接口
               * @param {number} wCamera [必选] 摄像头编号类型0~3
                        0：环境摄像头，监控整个设备区域
                        1：人脸摄像头，监控人员区域
                        2：出口摄像头，监控设备出口槽区域
                        3：扩展摄像头，其他区域
               * @param lpszPictureFileA [必选] 活体检测实时生成图片路径，非空
               * @param lpszPictureFileB [必选] 如身份证照等本地用于比对的图片路径， 非空
               * @param {number} TimeOut 超时时间（毫秒），不传默认为30000，传0无限超时
               * @returns 事件 FaceComparisonOver ( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 FaceComparisonOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":5,"dwCommandCode":1088,"eventName":"FaceComparisonOver","eventType":1032,"hService":1,"result":0}
              * @example 入参示例
                  var pszParam = {"Camera" : 1,"lpszPictureFileA" : "C:\picturepathA.jpg","lpszPictureFileB" : "C:\picturepathB.jpg","TimeOut": 30000};
               *
               */

            }, {
              key: "FaceComparison",
              value: function FaceComparison(wCamera, lpszPictureFileA, lpszPictureFileB, TimeOut) {
                var param = {
                  wCamera: wCamera,
                  lpszPictureFileA: lpszPictureFileA,
                  lpszPictureFileB: lpszPictureFileB,
                  TimeOut: TimeOut
                };
                return this.execute('FaceComparison', param);
              }
              /**
               * @description 录制音视频功能(异步)(xfs320)
               * @param {number} wCamera [必选] 摄像头索引0-3； 取值：0（环境摄像头）、1（人脸摄像头）、2（出口摄像头）、3（扩展摄像头）；默认值：0
               * @param {number} wAction [必选] 录制动作0-3；取值：0(开始录制)、1（结束录制）、2（暂停录制）、3（恢复录制）； 默认值：0
               * @param {number} wHpixel [可选] 水平像素；取值：整数；默认值：0
               * @param {number} wVpixel [可选] 垂直像素；取值：整数；默认值：0
               * @param {number} xFps [可选] 帧率；取值：整数；默认值：30
               * @param {number} wAudioOption [必选] 是否录音0-1；取值：0（不录音）、1（录音）；默认值：1
               * @param lpszRecordFile [必选]保存录像文件的绝对路径；取值：字符串；默认值：NULL
               * @param {number} TimeOut 超时时间（毫秒），不传默认为30000，传0无限超时
                 * @returns 事件 SetVideoRecordOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 SetVideoRecordOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  Action：录制动作，0(开始录制)、1（结束录制）、2（暂停录制）、3（恢复录制）
                  {"Action":1,""RequestID":5,"dwCommandCode":1098,"eventName":"SetVideoRecordOver","eventType":1032,"hService":1,"result":0}
               * @example 示例
                  var pszParam = {"wCamera" : 0,"wAction":0, " wHpixel ":640，" wVpixel":,480，" wFps ":30, " wAudioOption ":1, " lpszRecordFile":"c:\Record.avi","TimeOut": 30000};
               */

            }, {
              key: "SetVideoRecord",
              value: function SetVideoRecord(wCamera, wAction, wAudioOption, lpszRecordFile, wHpixel, wVpixel) {
                var xFps = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 30;
                var param = {
                  wCamera: wCamera,
                  wAction: wAction,
                  wAudioOption: wAudioOption,
                  lpszRecordFile: lpszRecordFile,
                  wHpixel: wHpixel,
                  wVpixel: wVpixel,
                  xFps: xFps
                };
                this.execute('SetVideoRecord', param);
              }
            }]);

            return CCamera;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var camera = (camera_CCamera);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/fingerscanner.js






        /**
         * 指纹模块
         */

        var fingerscanner_CFingerScanner =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CFingerScanner, _CBaseDev);

            function CFingerScanner(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CFingerScanner);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CFingerScanner).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                /**
                 * 手指按下事件
                 * @param param
                 */
                'FingerInserted': function FingerInserted(param) {
                  this.dispatchEvent('FingerInserted', param);
                },

                /**
                 * 手指离开事件
                 * @param param
                 */
                'FingerTaken': function FingerTaken(param) {
                  this.dispatchEvent('FingerTaken', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 初始化指纹仪，异步接口
             * @returns 复位完成事件 ResetOver( string &pszParam)
                其中pszParam JSON串参数：
                RequestID:请求ID
                dwCommandCode:指令ID
                eventType:事件ID
                eventName:事件名 ResetOver
                result:执行结果，0表示成功，其他参考WOSA错误码
                {"RequestID":47,"dwCommandCode":108,"eventName":"ResetOver",
                "eventType":1032,"hService":5,"result":0}
             * @example 入参示例
                var pszParam = {"TimeOut":30000,"prtData":"PaperNum=3;PrintType=3;
                Stamp=0,File[0]=c:\A4_1.pdf,WaitNum=1"}
             */


            Object(createClass["a" /* default */ ])(CFingerScanner, [{
              key: "Reset",
              value: function Reset() {
                return this.execute('Reset', {});
              }
              /**
               * 获取指纹模板，异步接口，需要用户输出三次指纹
               * @param {String} filepath 指纹保存路径，字符串，取值：字符串,默认值：空字符串。不传入则不保存，传入保存到该路径
               * @param {Number} TimeOut 超时时间（毫秒），0表示无限超时
               * @returns 获得模板完成事件 GetFingerTempleteOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 GetFingerTempleteOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  outdata:指纹模板数据
                  {"RequestID":5"datalen":8"dwCommandCode":107"eventName":"GetFingerTempleteOver",
                  "eventType":1032,"hService":1,"outdata":"12345678","result":0}
               * @example 入参示例
                  var pszParam = {"filepath": "C:\Templete.bmp", "TimeOut":30000}
               */

            }, {
              key: "GetFingerTemplete",
              value: function GetFingerTemplete(filepath, TimeOut) {
                this.controlGuideLight(this.siuSpeed);
                return this.execute('GetFingerTemplete', {
                  filepath: filepath,
                  TimeOut: TimeOut
                });
              }
              /**
               * 基线接口——获取指纹特征，异步接口
               * 加密接口——获取特征数据密文，生成指纹特征图片，并将图片保存默认的路径中。通过GetFingerFeatureOver事件返回指纹特征值密文
               * @param {String} fullpath 基线接口——指纹保存路径（不传入则不保存，传入保存到该路径）；加密接口——random 随机数
               * @param {Number} TimeOut 超时时间（毫秒），0表示无限超时
               * @returns 获取特征完成事件 GetFingerFeatureOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 GetFingerFeatureOver
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  outdata:指纹特征数据
                 {"RequestID":5,"datalen":8,"dwCommandCode":107,"eventName":"GetFingerFeatureOver",
                 "eventType":1032,"hService":1,"outdata":"12345678","result":0}
               * @example 入参示例
                  var pszParam = {"filepath": "C:\Templete.bmp", "TimeOut":30000}
               */

            }, {
              key: "GetFingerFeature",
              value: function GetFingerFeature(fullpath, TimeOut) {
                this.controlGuideLight(this.siuSpeed);
                var param = {
                  fullpath: fullpath,
                  random: fullpath,
                  TimeOut: TimeOut
                };
                return this.execute('GetFingerFeature', param);
              }
              /**
               * 取消异步请求
               *  @returns result 执行结果，0，成功，<0，失败
               */

            }, {
              key: "CancelWait",
              value: function CancelWait() {
                return this.execute('CancelWait', {});
              }
              /**
               * 保存指纹数据，同步接口
               * @param {Number} datalen 数据长度
               * @param {String} fingerdata 指纹数据
               * @param {String} filepath 表示保存的路径
               * @returns result 执行结果，0，成功，<0，失败
               * @example 入参示例
                  var pszParam = {"fingerdata":"123456","datalen":6,"filepath":"C:\1.bmp"}
               */

            }, {
              key: "SaveFingerDataSync",
              value: function SaveFingerDataSync(datalen, fingerdata, filepath) {
                var param = {
                  datalen: datalen,
                  fingerdata: fingerdata,
                  filepath: filepath
                };
                return this.getInfo('SaveFingerDataSync', param);
              }
              /**
               * 对比指纹特征，异步接口(传入的是保存模板数据的文件路径。特征数据已由前面调用GetFingerFeature()保存在内存中)
               * @param filepath 保存模板数据的文件路径,该文件需存在且有效，否则比对返回失败
               * @returns 模板和特征对比完成事件 CompareFingerOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 CompareFingerOver
                  result:执行结果，0表示成功，其他失败
                 {"RequestID":5,"datalen":8,"dwCommandCode":107,"eventName":"CompareFingerOver",
                 "eventType":1032,"hService":1,"outdata":"12345678","result":0}
               * @example 入参示例
                  var pszParam = {"filepath": "C:\Templete.bmp"}
               */

            }, {
              key: "CompareFinger",
              value: function CompareFinger(filepath) {
                var param = {
                  filepath: filepath
                };
                return this.execute('CompareFinger', param);
              }
              /**
               * 对比指纹数据，异步接口（指纹仪对比指纹特征数据和模板数据，传入的是模板数据。特征数据已由前面调用GetFingerFeature()保存在内存中）
               * @param datalen 数据长度
               * @param fingerdata 指纹数据
               * @returns 模板和特征对比完成事件 CompareFingerOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 CompareFingerOver
                  result:执行结果，0表示成功，其他失败
                 {"RequestID":5,"datalen":8,"dwCommandCode":107,"eventName":"CompareFingerOver",
                 "eventType":1032,"hService":1,"outdata":"12345678","result":0}
               * @example 入参示例
                  var pszParam = {"fingerdata": "123456", "datalen":6}
               */

            }, {
              key: "CompareFingerEx",
              value: function CompareFingerEx(datalen, fingerdata) {
                var param = {
                  datalen: datalen,
                  fingerdata: fingerdata
                };
                return this.execute('CompareFingerEx', param);
              }
              /**
               * 对比指纹数据，异步接口(传入的是模板数据和特征数据)
               * @param featuredata 特征数据
               * @param templetedata 模板数据
               * @returns 模板和特征对比完成事件 CompareFingerOver( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 CompareFingerOver
                  result:执行结果，0表示成功，其他失败
                 {"RequestID":5,"datalen":8,"dwCommandCode":107,"eventName":"CompareFingerOver",
                 "eventType":1032,"hService":1,"outdata":"12345678","result":0}
               * @example 入参示例
                  var pszParam = {"featuredata": "123456", "templetedata":"123456"}
               */

            }, {
              key: "CompareFingerEx2",
              value: function CompareFingerEx2(featuredata, templetedata) {
                var param = {
                  featuredata: featuredata,
                  templetedata: templetedata
                };
                return this.execute('CompareFingerEx2', param);
              }
              /**
               * 加密指纹仪专用——下载密钥
               * @param Ver  表示密钥版本 例：LoadDEK=0002 非空
               * @param Name 表示密钥名称 例：DFK_JZT998000_0002 非空
               * @param Key 表示密钥数据 例：fIyqk1HWcvwKaPyNzZ8rg1/WsaFb5MVQ 非空
               * @param KeyMAC 表示密钥MAC信息 可空
               */

            }, {
              key: "LoadKeySync",
              value: function LoadKeySync(Ver, Name, Key, KeyMAC) {
                var param = {
                  Ver: Ver,
                  Name: Name,
                  Key: Key,
                  KeyMAC: KeyMAC
                };
                return this.getInfo('LoadKeySync', param);
              }
              /**
               * 设置设备ID号
               * @param deviceid 表示设备ID号 非空
               */

            }, {
              key: "SetDeviceIDSync",
              value: function SetDeviceIDSync(deviceid) {
                var param = {
                  deviceid: deviceid
                };
                return this.getInfo('SetDeviceIDSync', param);
              }
              /**
               * 获取扩展状态
               * StatusItem - String(In) StatusItem 设备的哪种状态 非空
                          StatusItem包括以下几种：
                          FactoryID :指纹仪厂家ID
                          DeviceTypeID :设备类型ID
                          FactoryInfo :厂家英文缩写
                          DeviceModel :设备类型号
                          FirmVersion :固件版本
                          DeviceID :设备ID号
                          DFK :出厂密钥
                          DMK :主密钥
                          DEK :加密密钥
                          DAK :MAC密钥
               */

            }, {
              key: "GetExtendedStatusSync",
              value: function GetExtendedStatusSync(StatusItem) {
                // let param = {
                //     StatusItem, 
                //     FactoryID: StatusItem, 
                //     DeviceTypeID: StatusItem, 
                //     FactoryInfo: StatusItem, 
                //     DeviceModel: StatusItem, 
                //     FirmVersion: StatusItem, 
                //     DeviceID: StatusItem, 
                //     DFK: StatusItem,
                //     DMK: StatusItem, 
                //     DEK: StatusItem,
                //     DAK: StatusItem
                // };
                return this.getInfo('GetExtendedStatusSync', StatusItem);
              }
            }]);

            return CFingerScanner;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var fingerscanner = (fingerscanner_CFingerScanner);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/ukeyreader.js






        /**
         * 读key模块
         */

        var ukeyreader_CUKeyReader =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CUKeyReader, _CBaseDev);

            function CUKeyReader(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CUKeyReader);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CUKeyReader).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                /**
                 * 读取到的UKEY信息非法
                 * @param param
                 */
                'UKeyInvalid': function UKeyInvalid(param) {
                  this.dispatchEvent('UKeyInvalid', param);
                },

                /**
                 * 回收箱状态变化事件
                 * @param param
                 */
                'UKeyRetainThreshHold': function UKeyRetainThreshHold(param) {
                  this.dispatchEvent('UKeyRetainThreshHold', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 更新设备状态，异步接口
             */


            Object(createClass["a" /* default */ ])(CUKeyReader, [{
              key: "GetStatus",
              value: function GetStatus() {
                return this.execute('GetStatus', {});
              }
              /**
               * 更新设备状态，同步接口
               */

            }, {
              key: "GetStatusSync",
              value: function GetStatusSync() {
                return this.getInfo('GetStatusSync', {});
              }
              /**
               * 读UKey，异步接口
               */

            }, {
              key: "ReadUKey",
              value: function ReadUKey() {
                return this.execute('ReadUKey', {});
              }
              /**
               * 清除回收计数，同步接口
               */

            }, {
              key: "ResetBinCountSync",
              value: function ResetBinCountSync() {
                return this.getInfo('ResetBinCountSync', {});
              }
            }]);

            return CUKeyReader;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var ukeyreader = (ukeyreader_CUKeyReader);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/ukeydispenser.js






        /**
         * 发key模块
         */

        var ukeydispenser_CUKeyDispenser =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CUKeyDispenser, _CBaseDev);

            function CUKeyDispenser(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CUKeyDispenser);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CUKeyDispenser).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                /**
                 * KEY移动事件
                 * @param param
                 */
                'CardMoved': function CardMoved(param) {
                  this.dispatchEvent('CardMoved', param);
                },

                /**
                 * KEY箱错误事件
                 * @param param
                 */
                'CardUnitError': function CardUnitError(param) {
                  this.dispatchEvent('CardUnitError', param);
                },

                /**
                 * KEY箱改变事件
                 * @param param
                 */
                'CardUnitInfoChanged': function CardUnitInfoChanged(param) {
                  this.dispatchEvent('CardUnitInfoChanged', param);
                },

                /**
                 * KEY箱阈值事件
                 * @param param
                 */
                'CardUnitThreshold': function CardUnitThreshold(param) {
                  this.dispatchEvent('CardUnitThreshold', param);
                },

                /**
                 * 复位时介质检测事件
                 * @param param
                 */
                'MediaDetected': function MediaDetected(param) {
                  this.dispatchEvent('MediaDetected', param);
                },

                /**
                 * 介质移走事件
                 * @param param
                 */
                'UKeyTaken': function UKeyTaken(param) {
                  this.dispatchEvent('UKeyTaken', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 发KEY，异步接口
             * @param usNumber KEY箱号
             * @param bPresent true: 直接发KEY给用户, false: 发KEY至读KEY位置
             */


            Object(createClass["a" /* default */ ])(CUKeyDispenser, [{
              key: "DispenseUKey",
              value: function DispenseUKey(usNumber) {
                var bPresent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                var param = {
                  usNumber: usNumber,
                  bPresent: bPresent
                };
                return this.execute('DispenseUKey', param);
              }
              /**
               * 退KEY,异步接口
               */

            }, {
              key: "Eject",
              value: function Eject() {
                return this.execute('Eject', {});
              }
              /**
               * 吞KEY，异步接口
               * @param usNumber 回收KEY箱号
               */

            }, {
              key: "Capture",
              value: function Capture(usNumber) {
                var param = {
                  usNumber: usNumber
                };
                return this.execute('Capture', param);
              }
              /**
               * 移动KEY操作，异步接口
               * @param wMoveOption KEY位置, 取值：
               *                      1：读卡器至暂存
                                      2：暂存到读卡器
                                      3：暂存到回收箱
               */

            }, {
              key: "MoveCard",
              value: function MoveCard(wMoveOption) {
                var param = {
                  wMoveOption: wMoveOption
                };
                return this.execute('MoveCard', param);
              }
              /**
               * 复位，异步接口
               * @param ResetAction  复位动作, 取值： 1: 无动作; 2: 退卡; 3: 吞卡
               */

            }, {
              key: "Reset",
              value: function Reset(ResetAction) {
                return this.execute('Reset', {
                  ResetAction: ResetAction
                });
              }
              /**
               * 获取KEY箱单元信息，同步接口
               * @returns
               *  {
               *  cardUnitInfo: '卡箱信息',
                  usNumber: 卡箱号
                  usType: 卡箱类型
                  ulCount: 卡箱计数
                  ulRetain: 回收计数
                  usStatus: 卡箱状态
                  }
               */

            }, {
              key: "GetCRDUnitInfoSync",
              value: function GetCRDUnitInfoSync() {
                return this.getInfo('GetCRDUnitInfoSync', {});
              }
              /**
               * 设置KEY箱单元计数，同步接口
               * @param usNumber KEY箱号, 取值由设备决定
               * @param ulCount  计数
               */

            }, {
              key: "SetCRDUnitInfoSync",
              value: function SetCRDUnitInfoSync(usNumber, ulCount) {
                return this.getInfo('SetCRDUnitInfoSync', {
                  usNumber: usNumber,
                  ulCount: ulCount
                });
              }
            }]);

            return CUKeyDispenser;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var ukeydispenser = (ukeydispenser_CUKeyDispenser);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/tablet.js






        /**
         * 手写签名
         */

        var tablet_CTablet =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CTablet, _CBaseDev);

            function CTablet(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CTablet);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CTablet).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }

            Object(createClass["a" /* default */ ])(CTablet, [{
              key: "StartSign",
              value: function StartSign(WinType, ishWnd, SignTip, SignTipAttribute, TimeOut) {
                var param = {
                  WinType: WinType,
                  ishWnd: ishWnd,
                  SignTip: SignTip || undefined,
                  SignTipAttribute: SignTipAttribute || undefined,
                  TimeOut: TimeOut || undefined
                };
                return this.execute('StartSignMore', param);
              }
            }, {
              key: "StartSignEx",
              value: function StartSignEx(sUrl, dlgX, dlgY, dlgW, dlgH, imgX, imgY, imgW, imgH, SignTip, SignTipAttribute, TimeOut) {
                var param = {
                  sUrl: sUrl,
                  dlgX: dlgX,
                  dlgY: dlgY,
                  dlgW: dlgW,
                  dlgH: dlgH,
                  imgX: imgX,
                  imgY: imgY,
                  imgW: imgW,
                  imgH: imgH,
                  SignTip: SignTip || undefined,
                  SignTipAttribute: SignTipAttribute || undefined,
                  TimeOut: TimeOut || undefined
                };
                return this.execute('StartSign', param);
              }
            }, {
              key: "StartSignExSync",
              value: function StartSignExSync(WinType, ishWnd, pathname, TimeOut, SignTip, SignTipAttribute) {
                var param = {
                  WinType: WinType,
                  ishWnd: ishWnd,
                  pathname: pathname,
                  TimeOut: TimeOut,
                  SignTip: SignTip || undefined,
                  SignTipAttribute: SignTipAttribute || undefined
                };
                return this.getInfo('StartSignExSync', param);
              }
            }, {
              key: "StartSignSync",
              value: function StartSignSync(sUrl, dlgX, dlgY, dlgW, dlgH, imgX, imgY, imgW, imgH, SignTip, SignTipAttribute) {
                var param = {
                  sUrl: sUrl,
                  dlgX: dlgX,
                  dlgY: dlgY,
                  dlgW: dlgW,
                  dlgH: dlgH,
                  imgX: imgX,
                  imgY: imgY,
                  imgW: imgW,
                  imgH: imgH,
                  SignTip: SignTip || undefined,
                  SignTipAttribute: SignTipAttribute || undefined
                };
                return this.getInfo('StartSignSync', param);
              }
              /**
               * ICBC 特供，与StartSignSync接口一致，为其异步版本
               */

            }, {
              key: "StartSignAsyncX",
              value: function StartSignAsyncX(sUrl, dlgX, dlgY, dlgW, dlgH, imgX, imgY, imgW, imgH, SignTip, SignTipAttribute, TimeOut) {
                var param = {
                  sUrl: sUrl,
                  dlgX: dlgX,
                  dlgY: dlgY,
                  dlgW: dlgW,
                  dlgH: dlgH,
                  imgX: imgX,
                  imgY: imgY,
                  imgW: imgW,
                  imgH: imgH,
                  SignTip: SignTip || undefined,
                  SignTipAttribute: SignTipAttribute || undefined,
                  TimeOut: TimeOut || undefined
                };
                return this.execute('StartSignAsyncX', param);
              }
            }, {
              key: "StartSignSyncEx",
              value: function StartSignSyncEx(dlgX, dlgY, dlgW, dlgH, SignTip, SignTipAttribute) {
                var param = {
                  dlgX: dlgX,
                  dlgY: dlgY,
                  dlgW: dlgW,
                  dlgH: dlgH,
                  SignTip: SignTip || undefined,
                  SignTipAttribute: SignTipAttribute || undefined
                };
                return this.execute('StartSignSyncEx', param);
              }
            }, {
              key: "StartSignOnly",
              value: function StartSignOnly(dlgX, dlgY, dlgW, dlgH, SignTip, SignTipAttribute, TimeOut) {
                var param = {
                  dlgX: dlgX,
                  dlgY: dlgY,
                  dlgW: dlgW,
                  dlgH: dlgH,
                  SignTip: SignTip || undefined,
                  SignTipAttribute: SignTipAttribute || undefined,
                  TimeOut: TimeOut || undefined
                };
                return this.execute('StartSignEx', param);
              }
              /**
               * 暂停签名
               */

            }, {
              key: "PauseSign",
              value: function PauseSign() {
                return this.execute('PauseSign', {});
              }
              /**
               * 恢复签名
               */

            }, {
              key: "ResumeSign",
              value: function ResumeSign() {
                return this.execute('ResumeSign', {});
              }
              /**
               * 停止签名
               */

            }, {
              key: "StopSign",
              value: function StopSign() {
                var param = {
                  wAction: 1
                };
                return this.execute('StopSign', param);
              }
            }, {
              key: "StopSignEx",
              value: function StopSignEx() {
                return this.execute('StopSignEx', {});
              }
              /**
               * 同步获取签名图片
               * @param WinType 窗口类型， 默认传"3""
               * @param pathname 生成目标路径
               * @param TimeOut 超时时间(毫秒)
               * @param lpszTrackFile 签字轨迹文件
               */

            }, {
              key: "GetSigntureSync",
              value: function GetSigntureSync(WinType, pathname, TimeOut, lpszTrackFile) {
                var param = {
                  WinType: WinType,
                  pathname: pathname,
                  TimeOut: TimeOut,
                  lpszTrackFile: lpszTrackFile
                };
                return this.getInfo('GetSigntureSync', param);
              }
            }, {
              key: "SetOddNumber",
              value: function SetOddNumber(oddNumber) {
                var param = {
                  oddNumber: oddNumber
                };
                return this.getInfo('SetOddNumber', param);
              }
            }, {
              key: "GetImageHash",
              value: function GetImageHash(iteration) {
                var param = {
                  iteration: iteration
                };
                return this.getInfo('GetImageHash', param);
              }
            }, {
              key: "GetImageData",
              value: function GetImageData() {
                return this.getInfo('GetImageData', {});
              }
            }, {
              key: "SetImageDir",
              value: function SetImageDir(path) {
                var param = {
                  path: path
                };
                return this.getInfo('SetImageDir', param);
              }
            }, {
              key: "CompositeImage",
              value: function CompositeImage(sUrl, signpath, ImgX, ImgY, ImgW, ImgH) {
                var param = {
                  sUrl: sUrl,
                  ImgX: ImgX,
                  ImgY: ImgY,
                  ImgW: ImgW,
                  ImgH: ImgH,
                  signpath: signpath
                };
                return this.getInfo('CompositeImage', param);
              }
              /**
               * 清除签名
               */

            }, {
              key: "ClearSign",
              value: function ClearSign() {
                var param = {};
                return this.execute('ClearSign', param);
              }
              /**
               * 复位
               */

            }, {
              key: "Reset",
              value: function Reset() {
                var param = {};
                return this.execute('Reset', param);
              }
            }]);

            return CTablet;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var tablet = (tablet_CTablet);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/check.js






        /**
         * 支票模块
         */

        var check_CCheck =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CCheck, _CBaseDev);

            function CCheck(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CCheck);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CCheck).call(this, serviceName, devName));
              _this.siuType = siuType;
              return _this;
            }
            /**
             * 扫描鉴别支票，异步接口
             * @param {String} FrontImageFile 正面图像的储存位置
             * @param {String} BackImageFile 背面图像的储存位置
             * @param fwImageSource 图像源，取值如下：
                        1: 对应WOSA定义WFS_PTR_IMAGEFRONT，请求文件的正面图像。
                        2: 对应WOSA定义WFS_PTR_IMAGEBACK，请求文件的背面图像。
                        8000: 对应WOSA定义WFS_PTR_IMAGETYPE0 ，票据类别：存单票据类型
             * @param TimeOut 超时时间
             */


            Object(createClass["a" /* default */ ])(CCheck, [{
              key: "ScanVerifyCheck",
              value: function ScanVerifyCheck(FrontImageFile, BackImageFile, fwImageSource, TimeOut) {
                var param = {
                  FrontImageFile: FrontImageFile,
                  BackImageFile: BackImageFile,
                  fwImageSource: fwImageSource,
                  TimeOut: TimeOut
                };
                return this.execute('ScanVerifyCheck', param);
              }
              /**
               * 获取支票票号，异步接口
               * @param wCodelineFormat 码行（MICR数据）格式：
                              4: 对应WOSA定义WFS_PTR_CODELINEOCR，利用OCR读取代码行。
               * @param fwImageSource 图像源，取值如下：
                               4: 对应WOSA定义WFS_PTR_CODELINE，请求文件的代码行
               * @param TimeOut 超时时间
               */

            }, {
              key: "GetCheckNo",
              value: function GetCheckNo(wCodelineFormat, fwImageSource, TimeOut) {
                var param = {
                  wCodelineFormat: wCodelineFormat,
                  fwImageSource: fwImageSource,
                  TimeOut: TimeOut
                };
                return this.execute('GetCheckNo', param);
              }
              /**
               * 打印支票
               * @param prtData
               *  copies 打印张数（copies=1）
               *  code 控制打印图片，内容以"|"分隔，第一个内容为横坐标，第二个内容为纵坐标，第三个内容为图片路径（code=10|10|c:\1.bmp）
               *  value 控制打印文字，内容以"|"分隔，第一个内容为横坐标，第二个内容为纵坐标，第三个内容为打印内容（value[0]= 10|10|打印内容）
               *  magcode 控制打印磁码，内容以"|"分隔，第一个内容为横坐标，第二个内容为纵坐标，第三个内容为磁码内容（value[1]=10|10|打印内容）
               * @return 触发PrintCheckOver事件
               */

            }, {
              key: "PrintCheck",
              value: function PrintCheck(prtData) {
                var param = {
                  prtData: prtData
                };
                return this.execute('PrintCheck', param);
              }
            }, {
              key: "PrintText",
              value: function PrintText(slotnum, checkcount, checkstartno, twoDimCodePicDir, twoDimCodePicXPos, twoDimCodePicYPos, checkWidth, checkHeight, adjX, adjY, checktype, magcodeX, magcodeY, magcodeList, chcontent) {
                console.log("========= into checkprinter executePrintText Function   ================");
                var param = {
                  "SlotNum": slotnum,
                  "CheckCount": checkcount,
                  "CheckStartNo": checkstartno,
                  "TwoDimCodePicDir": twoDimCodePicDir,
                  "TwoDimCodePicXPos": twoDimCodePicXPos,
                  "TwoDimCodePicYPos": twoDimCodePicYPos,
                  "CheckWidth": checkWidth,
                  "CheckHeight": checkHeight,
                  "AdjX": adjX,
                  "AdjY": adjY,
                  "CheckType": checktype,
                  "MagCodeX": magcodeX,
                  "MagCodeY": magcodeY,
                  "pchMagCodeList": magcodeList,
                  "pchContent": chcontent
                };
                console.log("========= start checkprinter executePrintText Function   ================");
                this.execute('PrintText', JSON.stringify(param));
              }
            }, {
              key: "PrintTextSync",
              value: function PrintTextSync(slotnum, checkcount, checkstartno, twoDimCodePicDir, twoDimCodePicXPos, twoDimCodePicYPos, checkWidth, checkHeight, adjX, adjY, checktype, magcodeX, magcodeY, magcodeList, chcontent) {
                console.log("========= into checkprinter executePrintTextSync Function   ================");
                var param = {
                  "SlotNum": slotnum,
                  "CheckCount": checkcount,
                  "CheckStartNo": checkstartno,
                  "TwoDimCodePicDir": twoDimCodePicDir,
                  "TwoDimCodePicXPos": twoDimCodePicXPos,
                  "TwoDimCodePicYPos": twoDimCodePicYPos,
                  "CheckWidth": checkWidth,
                  "CheckHeight": checkHeight,
                  "AdjX": adjX,
                  "AdjY": adjY,
                  "CheckType": checktype,
                  "MagCodeX": magcodeX,
                  "MagCodeY": magcodeY,
                  "pchMagCodeList": magcodeList,
                  "pchContent": chcontent
                };
                console.log("========= start checkprinter executePrintTextSync Function   ================");
                this.execute('PrintTextSync', JSON.stringify(param));
              }
            }, {
              key: "PrintTextJson",
              value: function PrintTextJson(jsonparam) {
                // *********张家口银行存单***********
                // jsonparam只需传CheckCount和pchContent
                // pchContent格式如：
                // 172|18|20|40|建行深圳分行营业部&172|23|20|40|44250100003400000049&172|46|20|40|105584000005
                // 格式说明：
                // 建行深圳分行营业部：打印内容
                // 172：打印位置横坐标
                // 18：打印位置纵坐标
                // 20：字体宽度
                // 40：字体高度
                console.log("========= into checkprinter executePrintTextJson Function   ================");
                this.execute('PrintText', JSON.stringify(jsonparam));
                console.log("========= start checkprinter executePrintTextJson Function   ================");
              }
            }, {
              key: "PrintTextSyncJson",
              value: function PrintTextSyncJson(jsonparam) {
                // 同PrintTextJson
                console.log("========= into checkprinter executePrintTextSyncJson Function   ================");
                this.execute('PrintTextSync', JSON.stringify(jsonparam));
                console.log("========= start checkprinter executePrintTextSyncJson Function   ================");
              }
              /**
               * 异步读取图像数据
               * @param FrontImageFile 正面图像的储存位置
               * @param BackImageFile 背面图像的储存位置
               * @param wFrontImageType 正面图像的格式，取值如下：
                      1: 对应WOSA定义WFS_PTR_IMAGETIF，返回的图像为TIF 6.0 格式。
                      2: 对应WOSA定义WFS_PTR_IMAGEWMF，返回的图像为WMF （Windows Metafile） 格式。
                      4: 对应WOSA定义WFS_PTR_IMAGEBMP，返回的图像为BMP格式。
                      8: 对应WOSA定义WFS_PTR_IMAGEJPG，返回的图像为 JPG 格式。
                 * @param wBackImageType 背面图像的格式，取值同wFrontImageType
               * @param wFrontImageColorFormat 正面图像的颜色格式，取值如下：
               *      1: 对应WOSA定义WFS_PTR_IMAGECOLORBINARY，扫描图象须以二进位返回（图像包含两种颜色，通常是黑色和白色）。
                      2: 对应WOSA定义WFS_PTR_IMAGECOLORGRAYSCALE，扫描图象须以灰度标返回（图像包含多重灰色）。
                      4: 对应wosA定义WFS_PTR_IMAGECOLORFULL，扫描图象须以全色返回（图像包含红色、绿色、蓝色等颜色）。
                 * @param wBackImageColorFormat 背面图像的颜色格式，取值同wFrontImageColorFormat。
               * @param wCodelineFormat 代码行（MICR数据）格式，取值如下：
               *      1: 对应WOSA定义WFS_PTR_CODELINECMC7，读取CMC7代码行。
                      2: 对应WOSA定义WFS_PTR_CODELINEE13B，读取E13B代码行。
                      4: 对应WOSA定义WFS_PTR_CODELINEOCR，利用OCR读取代码行。
                 * @param fwImageSource 图像源，取值如下：
                      1: 对应WOSA定义WFS_PTR_IMAGEFRONT，请求文件的正面图像。
                      2: 对应WOSA定义WFS_PTR_IMAGEBACK，请求文件的背面图像。
                      4: 对应WOSA定义WFS_PTR_CODELINE，请求文件的代码行。
                 * @param TimeOut 超时时间
                 */

            }, {
              key: "ReadImage",
              value: function ReadImage(FrontImageFile, BackImageFile, wFrontImageType, wBackImageType, wFrontImageColorFormat, wBackImageColorFormat, wCodelineFormat, fwImageSource, TimeOut) {
                return this.execute('ReadImage', {
                  FrontImageFile: FrontImageFile,
                  BackImageFile: BackImageFile,
                  wFrontImageType: wFrontImageType,
                  wBackImageType: wBackImageType,
                  wFrontImageColorFormat: wFrontImageColorFormat,
                  wBackImageColorFormat: wBackImageColorFormat,
                  wCodelineFormat: wCodelineFormat,
                  fwImageSource: fwImageSource,
                  TimeOut: TimeOut
                });
              }
              /**
               * 异步控制介质，该命令用来控制通过设备绘制的表单（例如阅读或终止某应用程序请求）。
               * 如果弹出操作被指定，那么，当媒介被移到出口时，该弹出操作即完成。当媒介已经被用户取走时
               * （只有当结构WFSPTRCAPS中规定的字段bMediaTaken等于TRUE时），就会生成一个服务事件。
               *
               * @param mediaCtrol  取值如下：
              *       1 : 对应WOSA定义WFS_PTR_CTRLEJECT，打印还未根据先前的WFS_CMD_PTR_PRINT_FORM或 WFS_CMD_PTR_PRINT_RAW_FILE命令打印的数据，然后弹出媒介。
                  2 : 对应WOSA定义WFS_PTR_CTRLPERFORATE，按上述要求打印数据，然后在媒介上打眼。
                  4 : 对应WOSA定义WFS_PTR_CTRLCUT，按上述要求打印数据，然后切纸。 对于具有堆放多重切纸并将它们作为单独一沓交给客户能力的打印机而言， 切割是因为要将媒介堆放起来，而弹出是因为要将一沓纸移到出口。
                  8 : 对应WOSA定义WFS_PTR_CTRLSKIP，按上述要求打印数据，然后跳媒介到黑标。
                  16 : 对应WOSA定义WFS_PTR_CTRLFLUSH，打印打印机还未根据先前的WFS_CMD_PTR_PRINT_FORM或WFS_CMD_PTR_PRINT_RAW_FILE命令打印的数据。
                  32 : 对应WOSA定义WFS_PTR_CTRLRETRACT，按上述要求打印数据，然后回收媒介到1::回收盒，如果媒介必须回收到另一个回收盒而非1::回收盒， 则设备需要一个以上的回收盒，就必须采用WFS_CMD_PTR_RETRACT_MEDIA命令。
                  64 : 对应WOSA定义WFS_PTR_CTRLSTACK，按上述要求打印数据，然后将媒介移到内部堆放器上。
                  128 : 对应WOSA定义WFS_PTR_CTRLPARTIALCUT，按上述要求打印数据，然后对媒介进行部分切割。
                  256 : 对应WOSA定义WFS_PTR_CTRLALARM，导致打印机响铃、发出哔哔声或发出声音警报。
                  512 : 对应WOSA定义WFS_PTR_CTRLATPFORWARD，按上述要求打印数据，然后向前翻一页。
                  1024 : 对应WOSA定义WFS_PTR_CTRLATPBACKWARD，按上述要求打印数据，然后向后翻一页。
                  2048 : 对应WOSA定义WFS_PTR_CTRLTURNMEDIA，按上述要求打印数据，然后插入媒介。
                  4096 : 对应WOSA定义WFS_PTR_CTRLSTAMP，按上述要求打印数据，然后在插入的媒介上压印。
                  8192 : 对应WOSA定义WFS_PTR_CTRLPARK，将媒介放入纸盒。
                  16384 : 对应WOSA定义WFS_PTR_CTRLEXPEL，按上述要求打印数据，然后将媒介从出口吐出来。
                  32768 : 对应WOSA定义WFS_PTR_CTRLEJECTTOTRANSPORT，按上述要求打印数据，然后将媒介移到出 口正后面的通道上的某个位置
               * @param TimeOut 超时时间
               */

            }, {
              key: "ControlMedia",
              value: function ControlMedia(mediaCtrol, TimeOut) {
                return this.execute('ControlMedia', {
                  mediaCtrol: mediaCtrol,
                  TimeOut: TimeOut
                });
              }
              /**
               * 同步取消所有异步请求
               */

            }, {
              key: "CancelWait",
              value: function CancelWait() {
                return this.getInfo('CancelWait', {});
              }
              /**
               * 异步复位
               * @param ResetAction 初始化动作, 详见 ControlMedia 中的mediaCtrol参数说明
               * @param binNumber 回收计数
               */

            }, {
              key: "Reset",
              value: function Reset(ResetAction, binNumber) {
                return this.execute('Reset', {
                  ResetAction: ResetAction,
                  binNumber: binNumber
                });
              }
              /**
               * 重置计数
               */

            }, {
              key: "ResetCountSync",
              value: function ResetCountSync() {
                this.execute('ResetCountSync', {});
              }
              /**
               * 获取状态
               */

            }, {
              key: "GetStatus",
              value: function GetStatus() {
                this.execute('GetStatus', {});
              }
              /**
               * 更新状态
               */

            }, {
              key: "UpdateStatus",
              value: function UpdateStatus() {
                return this.getInfo('UpdateStatus', {});
              }
            }]);

            return CCheck;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var check = (check_CCheck);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/cashacceptor.js






        /**
         * 收钞模块
         */

        var cashacceptor_CCashAcceptor =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CCashAcceptor, _CBaseDev);

            /**
             * 构造器
             * @param serviceName 设备逻辑名
             * @param devName 设备对象名
             * @param siuType siu指示灯序号
             */
            function CCashAcceptor(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CCashAcceptor);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CCashAcceptor).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                /**
                 * 设备已准备好进钞
                 * @param param
                 */
                'AcceptCashPrepared': function AcceptCashPrepared(param) {
                  this.dispatchEvent('AcceptCashPrepared', param);
                },

                /**
                 * 设备仍处于cashin激活状态
                 * @param param
                 */
                'AcceptCashAlreadyActive': function AcceptCashAlreadyActive(param) {
                  this.dispatchEvent('AcceptCashAlreadyActive', param);
                },

                /**
                 * 钞票放入
                 * @param param
                 */
                'CashInserted': function CashInserted(param) {
                  this.dispatchEvent('CashInserted', param);
                },

                /**
                 * 调用AcceptCash 方法后一些现金被成功地接收并识别时触发
                 * @param param JSON格式，TotalItems 接收现金 (通常指纸币或硬币) 的总计数. 对于接收现金的详情请参考 LastAcceptItems 集合.
                    PartRefused	在接收操作完成期间指出是否有拒钞的标志.  如果 PartRefused为假,那么所有的现金被成功地识别.  如果 PartRefused为真, 那么一些现金被拒绝应用该调用 EjectRefusedCash 来返回拒钞给客户.
                 */
                'CashAccepted': function CashAccepted(param) {
                  this.dispatchEvent('CashAccepted', param);
                },

                /**
                 * 在AcceptCash 操作里进入的钞票没有被识别后触发
                 * @param param
                 */
                'CashRefused': function CashRefused(param) {
                  this.dispatchEvent('CashRefused', param);
                },

                /**
                 * 未完成的AcceptCash 操作被取消，并且无钞票被接收
                 * @param param
                 */
                'CashAcceptCancelled': function CashAcceptCancelled(param) {
                  this.dispatchEvent('CashAcceptCancelled', param);
                },

                /**
                 * 接收的钞票从暂存位置被移走并成功存入钞箱
                 * @param param
                 */
                'EscrowedCashStored': function EscrowedCashStored(param) {
                  this.dispatchEvent('EscrowedCashStored', param);
                },

                /**
                 * 回退的钞票递钞成功
                 * @param param
                 */
                'CashPresented': function CashPresented(param) {
                  this.dispatchEvent('CashPresented', param);
                },

                /**
                 * 钞票被拿走
                 * @param param
                 */
                'CashTaken': function CashTaken(param) {
                  this.dispatchEvent('CashTaken', param);
                },

                /**
                 * 钞票被回收
                 * @param param
                 */
                'CashRetracted': function CashRetracted(param) {
                  this.dispatchEvent('CashRetracted', param);
                },

                /**
                 * 钞票成功地从暂存位置移动到输出位置
                 * @param param
                 */
                'EscrowedCashEjected': function EscrowedCashEjected(param) {
                  this.dispatchEvent('EscrowedCashEjected', param);
                },

                /**
                 * 拒钞成功地移动到输出位置
                 * @param param
                 */
                'RefusedCashEjected': function RefusedCashEjected(param) {
                  this.dispatchEvent('RefusedCashEjected', param);
                },

                /**
                 * 闸门成功地打开
                 * @param param
                 */
                'ShutterOpened': function ShutterOpened(param) {
                  this.dispatchEvent('ShutterOpened', param);
                },

                /**
                 * 闸门成功地关闭
                 * @param param
                 */
                'ShutterClosed': function ShutterClosed(param) {
                  this.dispatchEvent('ShutterClosed', param);
                },

                /**
                 * 输出闸门成功地打开
                 * @param param
                 */
                'OutputShutterOpened': function OutputShutterOpened(param) {
                  this.dispatchEvent('OutputShutterOpened', param);
                },

                /**
                 * 输出闸门成功地关闭
                 * @param param
                 */
                'OutputShutterClosed': function OutputShutterClosed(param) {
                  this.dispatchEvent('OutputShutterClosed', param);
                },

                /**
                 * 钞箱信息改变
                 * @param param
                 */
                'CashUnitInfoChanged': function CashUnitInfoChanged(param) {
                  this.dispatchEvent('CashUnitInfoChanged', param);
                },

                /**
                 * 钞箱越过临界值并改变状态时触发
                 * @param param
                 */
                'CashUnitThresholdCrossed': function CashUnitThresholdCrossed(param) {
                  this.dispatchEvent('CashUnitThresholdCrossed', param);
                },

                /**
                 * 复位完成
                 * @param param
                 */
                'ResetComplete': function ResetComplete(param) {
                  this.dispatchEvent('ResetComplete', param);
                },

                /**
                 * 钞箱成功进入更换状态
                 * @param param
                 */
                'ExchangeInitiated': function ExchangeInitiated(param) {
                  this.dispatchEvent('ExchangeInitiated', param);
                },

                /**
                 * 钞箱退出更换状态
                 * @param param
                 */
                'ExchangeCompleted': function ExchangeCompleted(param) {
                  this.dispatchEvent('ExchangeCompleted', param);
                },

                /**
                 * 钞箱更换操作已被完成但失败
                 * @param param
                 */
                'ExchangeFailed': function ExchangeFailed(param) {
                  this.dispatchEvent('ExchangeFailed', param);
                },

                /**
                 * 钞箱数据已被重置
                 * @param param
                 */
                'UnitCountsReset': function UnitCountsReset(param) {
                  this.dispatchEvent('UnitCountsReset', param);
                },

                /**
                 * 保险柜门已关闭
                 * @param param
                 */
                'SafeDoorClosed': function SafeDoorClosed(param) {
                  this.dispatchEvent('SafeDoorClosed', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                },

                /**
                 * 打开连接
                 * @param param
                 */
                'ConnectionOpened': function ConnectionOpened(param) {
                  this.dispatchEvent('OpenConnectionOver', param);
                }
              };
              return _this;
            }
            /**
             * 存款（异步） 允许进钞，等待钞票放入，异步接口  返回事件CashAccepted/CashAcceptCancelled
             * @param Timeout 等待放入钞票的时间（毫秒），缺省为30秒  0表示无限等待.
             * @returns void
                存款接收完成事件 CashAccepted( string &pszParam)
                其中pszParam JSON串参数：
                result: 执行结果，0，成功，<0: 错误编码
                RequestID: 请求ID
                dwCommandCode: 指令ID
                hService: 服务句柄
                eventType: 事件类型
                eventName:事件名称
                TotalItems: 存款接收的钞票总张数
                Items: 当次存款的钞票张数
                TotalAmount: 存款接收的钞票总金额
                Amount: 当次存款的钞票金额
                PartRefused: 当次存款是否有拒钞 true:有 false:无
                DevError: 当次存款是否故障 true:有 false:无
                CashLimited: 存款是否达到限额 true:有 false:无
                cmdName: 当前执行方法
                {"Amount":3900,"CashLimited":false,"DevError":false,"Items":39,"PartRefused":false,
                "RequestID":1700,"TotalAmount":3900,"TotalItems":39,"cmdName":"AcceptCash","dwCommandCode":1302,
                "eventName":"CashAccepted","eventType":1032,"hService":57,"result":0}
                  存款取消事件 CashAcceptCancelled( string &pszParam)
                其中pszParam JSON串参数：
                result: 执行结果，0，成功，<0: 错误编码
                RequestID: 请求ID
                dwCommandCode: 指令ID
                hService: 服务句柄
                eventType: 事件类型
                eventName: 事件名称
                {"RequestID":1868,"dwCommandCode":1302,"eventName":"CashAcceptCancelled","eventType":1032,
                "hService":57,"result":-4}
               * @example 入参示例
                var pszParam = {"Timeout":30000};
             */


            Object(createClass["a" /* default */ ])(CCashAcceptor, [{
              key: "AcceptCash",
              value: function AcceptCash(Timeout) {
                var param = {
                  Timeout: Timeout
                };
                return this.execute('AcceptCash', param);
              }
              /**
               * 取消允许进钞，取消当前进行的操作（同步），同步接口
               * @returns 0： 成功；<0
               */

            }, {
              key: "CancelCashInSync",
              value: function CancelCashInSync() {
                this.controlGuideLight(1);
                return this.getInfo("CancelCashInSync", {});
              }
              /**
               * 同步 触发检测纸币插入事件
               */

            }, {
              key: "CashInsertedSync",
              value: function CashInsertedSync() {
                return this.getInfo("CashInsertedSync", {});
              }
              /**
               * 异步 设置BV可识别的币种ID
               * @param NoteIDToConfigure 字符串, 钞票ID数组,钞票ID参考属性ItemTypes
               * @returns void
                  BV可识别钞票ID配置完成事件 NoteTypesConfigured( string &pszParam)
                  其中pszParam JSON串参数：
                  result: 执行结果，0，成功，<0: 错误编码
                  RequestID: 请求ID
                  dwCommandCode: 指令ID
                  hService: 服务句柄
                  eventType: 事件类型
                  eventName: 事件名称
                  {"RequestID":124,"dwCommandCode":1315,"eventName":"NoteTypesConfigured","eventType":1032,
                  "hService":44,"result":0}
               * @example 入参示例
                  var pszParam = {"NoteIDToConfigure":[4,13,5,6,7]}
               */

            }, {
              key: "ConfigureNoteTypes",
              value: function ConfigureNoteTypes(NoteIDToConfigure) {
                var param = {
                  NoteIDToConfigure: NoteIDToConfigure
                };
                return this.getInfo("ConfigureNoteTypes", param);
              }
              /**
               * 异步 获取钞票类型
               */

            }, {
              key: "GetBankNoteTypes",
              value: function GetBankNoteTypes() {
                return this.execute('GetBankNoteTypes', {});
              }
              /**
               * 获取钞箱信息，同步接口
               * @returns pszParam为JSON串字段
                CashUnitInfo: 钞箱信息
                  usNumber：钞箱逻辑号
                  fwType：设置钞箱的类型
                      循环箱：WFS_CIM_TYPERECYCLING (1)
                      只存箱：WFS_CIM_TYPECASHIN (2)
                      补给箱：WFS_CIM_TYPEREPCONTAINER (3)
                      回收箱：WFS_CIM_TYPERETRACTCASSETTE (4)
                  ulCount：钞箱的当前张数
                  ulMaximum：钞箱的最大张数
                  ulCashInCount：钞箱的入钞张数
                  ulValues：钞箱的面额
                  cCurrency：钞箱的纸币类型
                  usStatus：钞箱的状态
                      钞箱正常：WFS_CIM_STATCUOK (0)
                      钞箱满：WFS_CIM_STATCUFULL (1)
                      钞箱将满：WFS_CIM_STATCUHIGH (2)
                      钞箱将空：WFS_CIM_STATCULOW (3)
                      钞箱空：WFS_CIM_STATCUEMPTY (4)
                      钞箱不可操作：WFS_CIM_STATCUINOP (5)
                      钞箱丢失：WFS_CIM_STATCUMISSING (6)
                      钞箱维护：WFS_CIM_STATCUMANIP (9)
                  phyNumber：钞箱的物理名
                  NoteNumber；钞箱的入钞信息,Json数组,内部Json例如{"usNoteID":4,"ulCount":10}
                      usNoteID:纸币对应ID
                      ulCount:张数
                  {"CashUnitInfo":[{"NoteNumber":[{"ulCount":1390,"usNoteID":4},{"ulCount":0,"usNoteID":13}],
                  "cCurrency":"CNY","fwType":1,"phyNumber":"Hopper1A","ulCashInCount":3126,"ulCount":1959,
                  "ulMaximum":2800,"ulValues":100,"usNumber":1,"usStatus":0},{"NoteNumber":[{"ulCount":0,
                  "usNoteID":4},{"ulCount":0,"usNoteID":13}],"cCurrency":"CNY","fwType":1,"phyNumber":"Hopper2A",
                  "ulCashInCount":0,"ulCount":0,"ulMaximum":2800,"ulValues":100,"usNumber":2,"usStatus":4},
                  {"NoteNumber":[{"ulCount":0,"usNoteID":4},{"ulCount":0,"usNoteID":13}],"cCurrency":"CNY",
                  "fwType":1,"phyNumber":"Hopper3A","ulCashInCount":0,"ulCount":0,"ulMaximum":2800,"ulValues":100,
                  "usNumber":3,"usStatus":4},{"NoteNumber":[{"ulCount":118,"usNoteID":4},{"ulCount":0,"usNoteID":13},
                  {"ulCount":0,"usNoteID":14},{"ulCount":0,"usNoteID":7},{"ulCount":0,"usNoteID":12},{"ulCount":5,
                  "usNoteID":5},{"ulCount":0,"usNoteID":11},{"ulCount":1,"usNoteID":6},{"ulCount":0,"usNoteID":10},
                  {"ulCount":0,"usNoteID":9},{"ulCount":0,"usNoteID":15},{"ulCount":0,"usNoteID":8},{"ulCount":0,
                  "usNoteID":128}],"cCurrency":"CNY","fwType":4,"phyNumber":"Hopper4A","ulCashInCount":6,"ulCount":124,
                  "ulMaximum":2800,"ulValues":0,"usNumber":4,"usStatus":0},{"NoteNumber":[{"ulCount":0,"usNoteID":4},
                  {"ulCount":0,"usNoteID":13}],"cCurrency":"CNY","fwType":1,"phyNumber":"Hopper5A","ulCashInCount":0,
                  "ulCount":0,"ulMaximum":2800,"ulValues":100,"usNumber":5,"usStatus":4}],"RequestID":1732,
                  "dwCommandCode":1303,"eventType":1031,"hService":5,"result":0}
               */

            }, {
              key: "GetCashUnitInfoSync",
              value: function GetCashUnitInfoSync() {
                return this.getInfo('GetCashUnitInfoSync', {});
              }
              /**
               * 异步 设置黑名单
               * @param SetListInfo 冠字号记录数组,缺省为NULL表示删除目前黑名单
               */

            }, {
              key: "SetBlackList",
              value: function SetBlackList(SetListInfo) {
                var param = {
                  SetListInfo: SetListInfo
                };
                return this.execute('SetBlackList', param);
              }
              /**
               * 异步 限制存款
               * @param CountLimit 张数限制,缺省为0
               * @param Currency 纸币类型,缺省为"CNY"
               * @param AmountLimit 金额限制,缺省为0
               * @returns void
                  存款限额完成事件 CashInLimitSeted( string &pszParam)
                  其中pszParam JSON串参数：
                  result: 执行结果，0，成功，<0: 错误编码
                  RequestID: 请求ID
                  dwCommandCode: 指令ID
                  hService: 服务句柄
                  eventType: 事件类型
                  eventName: 事件名称
                  {"RequestID":1,"dwCommandCode":1322,"hService":1,"result":0,"eventType":1032,
                  "eventName":"CashInLimitSeted"}
               * @example 入参示例
                  var pszParam = {"CountLimit":0,"Currency":"CNY","AmountLimit":1000}
               */

            }, {
              key: "SetCashInLimit",
              value: function SetCashInLimit() {
                var CountLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var Currency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'CNY';
                var AmountLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var param = {
                  CountLimit: CountLimit,
                  Currency: Currency,
                  AmountLimit: AmountLimit
                };
                return this.execute('SetCashInLimit', param);
              }
              /**
               * 同步 设置冠字号处理相关路径
               *@param SerialPath 生成冠字号SNRInfo.ini文件目录
               *@param UploadPath 将处理后的冠字号相关文件保存目录
               */

            }, {
              key: "SetConfigPathSync",
              value: function SetConfigPathSync(SerialPath, UploadPath) {
                var param = {
                  SerialPath: SerialPath,
                  UploadPath: UploadPath
                };
                return this.execute('SetConfigPathSync', param);
              }
              /**
               * 同步 设置当前交易流水等信息
               *@param TranInfo: 当前交易流水等信息,此数据将和冠字号信息生成一同生成特定格式txt文件
               */

            }, {
              key: "SetTransNoSync",
              value: function SetTransNoSync(TranInfo) {
                var param = {
                  TranInfo: TranInfo
                };
                return this.execute('SetTransNoSync', param);
              }
              /**
               * 将钞票从暂存移到钞箱，异步接口
               * @returns void
                  结束存款完成事件 EscrowedCashStored( string &pszParam)
                  其中pszParam JSON串参数：
                  TotalAmount: 存款总额
                  SerialNo: 存款交易号
                  result: 执行结果，0，成功，<0: 错误编码
                  RequestID: 请求ID
                  dwCommandCode: 指令ID
                  hService: 服务句柄
                  eventType: 事件类型
                  eventName: 事件名称
                  {"RequestID":14498,"SerialNo":"20191223133058","TotalAmount":8900,"dwCommandCode":1303,
                  "eventName":"EscrowedCashStored","eventType":1032,"hService":107,"result":0}
               */

            }, {
              key: "StoreEscrowedCash",
              value: function StoreEscrowedCash() {
                this.controlGuideLight(1);
                return this.execute('StoreEscrowedCash', {});
              }
              /**
               * 回滚，将钞票从暂存退回给客户并等待客户取走吐出的钞票，异步接口
               * @param Timeout 全部退钞完成的超时时间（毫秒）
               * @param RollbackTakenTimeOut 退钞后等待拿走钞票的超时时间（毫秒）
               * @returns void
                  存款限额完成事件 CashInLimitSeted( string &pszParam)
                  其中pszParam JSON串参数：
                  result: 执行结果，0，成功，<0: 错误编码
                  RequestID: 请求ID
                  dwCommandCode: 指令ID
                  hService: 服务句柄
                  eventType: 事件类型
                  eventName: 事件名称
                  {"RequestID":5522,"Result":true,"dwCommandCode":1304,"eventName":"EscrowedCashEjected",
                  "eventType":1032,"hService":74,"result":0}
               * @example 入参示例
                  var pszParam = {"Timeout":30000,"RollbackTakenTimeOut":30000}
                 */

            }, {
              key: "EjectEscrowedCash",
              value: function EjectEscrowedCash(Timeout, RollbackTakenTimeOut) {
                var param = {
                  Timeout: Timeout,
                  RollbackTakenTimeOut: RollbackTakenTimeOut
                };
                return this.execute("EjectEscrowedCash", param);
              }
              /**
               * 设置\还原强存模式，异步接口
               * @param DepositMode 0表示正常模式，1表示强存模式
               * @returns void
                  存款模式设置完成事件 SetDepositModeOver( string &pszParam)
                  其中pszParam JSON串参数：
                  result: 执行结果，0，成功，<0: 错误编码
                  RequestID: 请求ID
                  dwCommandCode: 指令ID
                  hService: 服务句柄
                  eventType: 事件类型
                  eventName: 事件名称
                  {"RequestID":5522,"Result":true,"dwCommandCode":1304,"eventName":"SetDepositModeOver",
                  "eventType":1032,"hService":74,"result":0}
               * @example 入参示例
                  var pszParam = {"DepositMode":0}
               */

            }, {
              key: "SetDepositMode",
              value: function SetDepositMode(DepositMode) {
                var param = {
                  DepositMode: DepositMode
                };
                return this.execute('SetDepositMode', param);
              }
              /**
               * 获取当前模式，同步接口
               * @returns pszParam为字符串; "0"-普存 "1"-强存
               */

            }, {
              key: "GetDepositMode",
              value: function GetDepositMode() {
                return this.getInfo('GetDepositMode', {});
              }
              /**
               * 打开闸门，异步接口
               * @param {String} Position 钞门位置，默认DEFAULT
                  取值范围：DEFAULT、INLEFT、INRIGHT、INCENTER、INTOP、INFRONT、INBOTTOM、INFRONT、LEFT、RIGHT、CENTER、TOP、BOTTOM、FRONT、REAR、LASH
                  "DEFAULT“ WFS_CIM_POSNULL
                  "INLEFT" WFS_CIM_POSINLEFT
                  "INRIGHT" WFS_CIM_POSINRIGHT
                  "INCENTER" WFS_CIM_POSINCENTER
                  "INTOP" WFS_CIM_POSINTOP
                  "INBOTTOM" WFS_CIM_POSINBOTTOM
                  "INFRONT" WFS_CIM_POSINFRONT
                  "INREAR" WFS_CIM_POSINREAR
                  "LEFT" WFS_CIM_POSOUTRIGHT
                  "RIGHT" WFS_CIM_POSINTOP
                  "CENTER" WFS_CIM_POSOUTCENTER
                  "TOP" WFS_CIM_POSOUTTOP
                  "BOTTOM" WFS_CIM_POSOUTBOTTOM
                  "FRONT" WFS_CIM_POSOUTFRONT
                  "REAR" WFS_CIM_POSOUTREAR
                  * @returns 闸门打开事件 ShutterOpened( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ShutterOpened
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":307,"eventName":"ShutterOpened","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"Position":"DEFAULT"};
               */

            }, {
              key: "OpenShutter",
              value: function OpenShutter() {
                var Position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "DEFAULT";
                var param = {
                  Position: Position
                };
                return this.execute('OpenShutter', param);
              }
              /**
               * 关闭闸门，异步接口
               * @param {String} Position 钞门位置，默认DEFAULT
                  取值范围：DEFAULT、INLEFT、INRIGHT、INCENTER、INTOP、INFRONT、INBOTTOM、INFRONT、LEFT、RIGHT、CENTER、TOP、BOTTOM、FRONT、REAR、LASH
                  "DEFAULT“ WFS_CIM_POSNULL
                  "INLEFT" WFS_CIM_POSINLEFT
                  "INRIGHT" WFS_CIM_POSINRIGHT
                  "INCENTER" WFS_CIM_POSINCENTER
                  "INTOP" WFS_CIM_POSINTOP
                  "INBOTTOM" WFS_CIM_POSINBOTTOM
                  "INFRONT" WFS_CIM_POSINFRONT
                  "INREAR" WFS_CIM_POSINREAR
                  "LEFT" WFS_CIM_POSOUTRIGHT
                  "RIGHT" WFS_CIM_POSINTOP
                  "CENTER" WFS_CIM_POSOUTCENTER
                  "TOP" WFS_CIM_POSOUTTOP
                  "BOTTOM" WFS_CIM_POSOUTBOTTOM
                  "FRONT" WFS_CIM_POSOUTFRONT
                  "REAR" WFS_CIM_POSOUTREAR
               * @returns 闸门关闭事件 ShutterClosed( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ShutterClosed
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":308,"eventName":"ShutterClosed","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"Position":"DEFAULT"};
               */

            }, {
              key: "CloseShutter",
              value: function CloseShutter() {
                var Position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "DEFAULT";
                var param = {
                  Position: Position
                };
                return this.execute('CloseShutter', param);
              }
              /**
               * 打开指定位置的闸门（异步）
               * @param {String} Position 钞门位置，默认DEFAULT
                  取值范围：DEFAULT、INLEFT、INRIGHT、INCENTER、INTOP、INFRONT、INBOTTOM、INFRONT、LEFT、RIGHT、CENTER、TOP、BOTTOM、FRONT、REAR、LASH
                  "DEFAULT“ WFS_CIM_POSNULL
                  "INLEFT" WFS_CIM_POSINLEFT
                  "INRIGHT" WFS_CIM_POSINRIGHT
                  "INCENTER" WFS_CIM_POSINCENTER
                  "INTOP" WFS_CIM_POSINTOP
                  "INBOTTOM" WFS_CIM_POSINBOTTOM
                  "INFRONT" WFS_CIM_POSINFRONT
                  "INREAR" WFS_CIM_POSINREAR
                  "LEFT" WFS_CIM_POSOUTRIGHT
                  "RIGHT" WFS_CIM_POSINTOP
                  "CENTER" WFS_CIM_POSOUTCENTER
                  "TOP" WFS_CIM_POSOUTTOP
                  "BOTTOM" WFS_CIM_POSOUTBOTTOM
                  "FRONT" WFS_CIM_POSOUTFRONT
                  "REAR" WFS_CIM_POSOUTREAR
                  * @returns 闸门打开事件 ShutterOpened( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ShutterOpened
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":307,"eventName":"ShutterOpened","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"Position":"DEFAULT"};
               */

            }, {
              key: "OpenOutputShutter",
              value: function OpenOutputShutter() {
                var Position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "DEFAULT";
                var param = {
                  Position: Position
                };
                return this.execute('OpenOutputShutter', param);
              }
              /**
               * 关闭指定位置的闸门（异步）
               * @param {String} Position 钞门位置，默认DEFAULT
                  取值范围：DEFAULT、INLEFT、INRIGHT、INCENTER、INTOP、INFRONT、INBOTTOM、INFRONT、LEFT、RIGHT、CENTER、TOP、BOTTOM、FRONT、REAR、LASH
                  "DEFAULT“ WFS_CIM_POSNULL
                  "INLEFT" WFS_CIM_POSINLEFT
                  "INRIGHT" WFS_CIM_POSINRIGHT
                  "INCENTER" WFS_CIM_POSINCENTER
                  "INTOP" WFS_CIM_POSINTOP
                  "INBOTTOM" WFS_CIM_POSINBOTTOM
                  "INFRONT" WFS_CIM_POSINFRONT
                  "INREAR" WFS_CIM_POSINREAR
                  "LEFT" WFS_CIM_POSOUTRIGHT
                  "RIGHT" WFS_CIM_POSINTOP
                  "CENTER" WFS_CIM_POSOUTCENTER
                  "TOP" WFS_CIM_POSOUTTOP
                  "BOTTOM" WFS_CIM_POSOUTBOTTOM
                  "FRONT" WFS_CIM_POSOUTFRONT
                  "REAR" WFS_CIM_POSOUTREAR
               * @returns 闸门关闭事件 ShutterClosed( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ShutterClosed
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":308,"eventName":"ShutterClosed","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"Position":"DEFAULT"};
               */

            }, {
              key: "CloseOutputShutter",
              value: function CloseOutputShutter() {
                var Position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "DEFAULT";
                var param = {
                  Position: Position
                };
                return this.execute('CloseOutputShutter', param);
              }
              /**
               * 复位，异步接口
               * @param {String} RetractArea 回收区域，缺省为空不回收
               * 可能值和含义：
                  'RETRACT': 回收箱
                  'TRANSPORT': 传输通道
                  'ESCROW': 暂存
                  'CASHUNITS': 循环钞箱
               * @param {Number} TimeOut 回收执行时间（毫秒）,缺省为30秒
               * @param {Number} ID  如果回收区域为"RETRACT"或"CASHUNITS",则此值表示回收箱逻辑号,缺省为0
               * @returns 复位完成事件 ResetComplete( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ResetComplete
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":14767,"dwCommandCode":1313,"eventName":"ResetComplete",
                  "eventType":1032,"hService":121,"result":0}
               * @example 入参示例
                  var pszParam = {""};
               */

            }, {
              key: "Reset",
              value: function Reset() {
                var RetractArea = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'RETRACT';
                var TimeOut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30000;
                var ID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var param = {
                  RetractArea: RetractArea,
                  TimeOut: TimeOut,
                  ID: ID
                };
                return this.execute('Reset', param);
              }
              /**
               * 将钞票从出钞口位置移到指定的回收区域，异步接口
               * @param {String} RetractArea 回收区域，缺省为"RETRACT"
               * 可能值和含义：
                  'RETRACT': 回收箱
                  'TRANSPORT': 传输通道
                  'ESCROW': 暂存
                  'CASHUNITS': 循环钞箱
                  'REJECT': 拒钞箱
               * @param {Number} TimeOut 回收执行时间（毫秒）,缺省为30秒
               * @param {Number} ID 如果回收目的区域为"RETRACT",则此值表示回收箱序号,缺省为1
               * @returns 回收完成事件 CashRetracted( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 CashRetracted
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  Count: 回收后钞箱数目改变个数
                  Length: 同Count意思相同
                  UnitItem: 改变数目的钞箱相关信息, JSON数组, 内部JSON串
                      usNumber: 钞箱逻辑号
                      fwType: 钞箱类型
                      fwItemType: 接收钞票的类型
                      cCurrency: 钞箱钞票类型
                      ulValues: 钞箱钞票面额
                      ulCashInCount: 钞箱当前接收钞票的张数
                      ulCount: 钞箱当前钞票的张数
                      CashItem: 钞箱当前接收的钞票详情, JSON字符串
                          Count: 钞箱的钞票信息条数
                          Length: 钞箱的钞票信息条数
                          Item: 钞箱的钞票信息, JSON数组, 内部JSON串字段
                              Currency: 钞票类型
                              Denomination: 钞票面额
                              ulCount: 钞票张数
                              usNoteID: 钞票ID
                  {"RequestID":14767,"dwCommandCode":1313,"eventName":"CashRetracted",
                  "eventType":1032,"hService":121,"result":0}
               * @example 入参示例
                  var pszParam = {"RetractArea":"RETRACT","TimeOut":30000,"ID":1};
               */

            }, {
              key: "Retract",
              value: function Retract() {
                var RetractArea = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'RETRACT';
                var ID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
                var param = {
                  RetractArea: RetractArea,
                  ID: ID
                };
                return this.execute('Retract', param);
              }
              /**
               *获取已退钞信息，同步接口
               */

            }, {
              key: "GetEjectInfoSync",
              value: function GetEjectInfoSync() {
                return this.getInfo('GetEjectInfoSync', {});
              }
              /**
               * 在暂存中接收的指定的货币和有效现金总数，同步接口
               * @param Currency 钞票类型,缺省为"CNY"
               * @param Validity 钞票真伪类型,缺省为"VALID"，取值范围为'VALID'，'COUNTERFEIT' 或 'SUSPICIOUS'
               * @returns
                  其中pszParam JSON串参数：
                  pszParam 为输入钞票类型的总额
                  {"pszParam ":1000}
               * @example 入参示例
                  var pszParam = {"Currency":"CNY","Validity":"VALID"};
               */

            }, {
              key: "GetLastAcceptedAmountSync",
              value: function GetLastAcceptedAmountSync() {
                var Currency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'CNY';
                var Validity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'VALID';
                var param = {
                  Currency: Currency,
                  Validity: Validity
                };
                return this.getInfo('GetLastAcceptedAmountSync', param);
              }
              /**
               * 获取设备状态扩展信息，同步接口
               * @returns
                  其中pszParam JSON串参数：
                  Firmware 固件版本
                  {"Firmware":"v1.0.0.3",...}
               */

            }, {
              key: "GetExtendedInfoSync",
              value: function GetExtendedInfoSync() {
                return this.getInfo('GetExtendedInfoSync', {});
              }
              /**
               * 获取设备状态扩展信息中具体域值，同步接口
               * @param FieldName 具体域名
               * @returns
                  pszParam 为获取到的具体域值：
                  {"v1.0.0.3"}
               * @example 入参示例
                  var pszParam = {"FieldName":"Firmware"};
               */

            }, {
              key: "GetExtendedInfoFieldsSync",
              value: function GetExtendedInfoFieldsSync(FieldName) {
                var param = {
                  FieldName: FieldName
                };
                return this.getInfo('GetExtendedInfoFieldsSync', param);
              }
              /**
               * 使设备进入 exchanging 状态，并允许钞箱被清空，异步接口
               * @param {String} CashUnitsToExchange 钞箱编号数组,缺省则为当前所有钞箱
               * @param {String} ExchangeType 加钞方式,缺省为"EXBYHAND"，值为'EXBYHAND'、'EXTOCASSETTES'、'CLEARRECYCLER'或'DEPOSITINTO'
               * @param {Number} LogicalNumber 此参数当加钞类型为"CLEARRECYCLER"时设置有效,表示需要清空的逻辑钞箱序号
               * @param {String} Position 此参数当加钞类型为"CLEARRECYCLER"时设置有效,缺省为"DEFAULT",表示清空的钞箱纸币需要转移到的输出位置
               * @param {Number} usNumber 此参数当加钞类型为"CLEARRECYCLER"且Position位置为"DEFAULT"时设置有效,缺省为0,表示清空的钞箱纸币需要转移到的钞箱逻辑号
               * @param {Number} TimeOut 执行时间（毫秒）,缺省为30秒
               * @returns 开始交换钞箱完成事件 ExchangeInitiated( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ExchangeInitiated
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  CashUnitInfo: 钞箱信息, Json数组, 内部Json字段：
                  usNumber: 钞箱逻辑号
                  fwType: 钞箱类型
                  ulCount: 钞箱的当前张数
                  ulMaximum: 钞箱的最大张数
                  ulCashInCount: 钞箱的入钞张数
                  ulValues: 钞箱钞票面额
                  cCurrency: 钞箱的纸币类型
                  usStatus: 钞箱的状态
                  phyNumber: 钞箱的物理名
                  NoteNumber: 钞票信息, Json数组, 内部Json字段：
                      usNoteID: 钞票ID
                      ulCount: 钞票张数
                  {"CashUnitInfo":[{"NoteNumber":[{"ulCount":0,"usNoteID":4},{"ulCount":0,"usNoteID":13}],
                  "cCurrency":"CNY","fwType":1,"phyNumber":"Hopper1A","ulCashInCount":0,"ulCount":0,"ulMaximum":2800,
                  "ulValues":100,"usNumber":1,"usStatus":4},{"NoteNumber":[{"ulCount":0,"usNoteID":4},
                  {"ulCount":0,"usNoteID":13}],"cCurrency":"CNY","fwType":1,"phyNumber":"Hopper2A","ulCashInCount":0,
                  "ulCount":0,"ulMaximum":2800,"ulValues":100,"usNumber":2,"usStatus":4},{"NoteNumber":[{"ulCount":0,
                  "usNoteID":4},{"ulCount":0,"usNoteID":13}],"cCurrency":"CNY","fwType":1,"phyNumber":"Hopper3A",
                  "ulCashInCount":0,"ulCount":0,"ulMaximum":2800,"ulValues":100,"usNumber":3,"usStatus":4},
                  {"NoteNumber":[{"ulCount":140,"usNoteID":4},{"ulCount":0,"usNoteID":13},{"ulCount":0,"usNoteID":14},
                  {"ulCount":0,"usNoteID":7},{"ulCount":0,"usNoteID":12},{"ulCount":5,"usNoteID":5},
                  {"ulCount":0,"usNoteID":11},{"ulCount":1,"usNoteID":6},{"ulCount":0,"usNoteID":10},
                  {"ulCount":0,"usNoteID":9},{"ulCount":0,"usNoteID":15},{"ulCount":0,"usNoteID":8},
                  {"ulCount":0,"usNoteID":128}],"cCurrency":"CNY","fwType":4,"phyNumber":"Hopper4A","ulCashInCount":0,
                  "ulCount":0,"ulMaximum":2800,"ulValues":0,"usNumber":4,"usStatus":4},{"NoteNumber":[{"ulCount":0,
                  "usNoteID":4},{"ulCount":0,"usNoteID":13}],"cCurrency":"CNY","fwType":1,"phyNumber":"Hopper5A",
                  "ulCashInCount":0,"ulCount":0,"ulMaximum":2800,"ulValues":100,"usNumber":5,"usStatus":4}],
                  "RequestID":1313,"dwCommandCode":1310,"eventName":"ExchangeInitiated","eventType":1032,"hService":44,
                  "result":0}
               * @example 入参示例
                  var pszParam = {"CashUnitsToExchange":"[1,2,3,4,5]","ExchangeType":"EXBYHAND"};
               */

            }, {
              key: "InitiateCashUnitExchange",
              value: function InitiateCashUnitExchange(CashUnitsToExchange) {
                var ExchangeType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EXBYHAND';
                var LogicalNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
                var Position = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "DEFAULT";
                var usNumber = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
                var TimeOut = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 30000;
                var param = {
                  CashUnitsToExchange: CashUnitsToExchange,
                  ExchangeType: ExchangeType,
                  LogicalNumber: LogicalNumber,
                  Position: Position,
                  usNumber: usNumber,
                  TimeOut: TimeOut
                };
                return this.execute('InitiateCashUnitExchange', param);
              }
              /**
               * 结束钞箱信息更新，异步接口
               * @param {Object} CashUnitInfo: 需要更改的钞箱信息：Json数组, 内部Json字段
                  usNumber-需更改的钞箱逻辑号
                  ulCount-设置钞箱的当前张数,可选项,缺省值为0
                  ulValues-设置钞箱的面额
                  fwType-设置钞箱的类型
                  lpNoteID-设置钞箱的可接收币种ID,可选项,缺省为更改前的值
                  TimeOut: 执行时间（毫秒）,缺省为30秒
               * @returns 交换钞箱完成事件 ExchangeCompleted( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ExchangeCompleted
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":123,"dwCommandCode":1311,"eventName":"ExchangeCompleted",
                  "eventType":1032,"hService":44,"result":0}
               * @example 入参示例
                  var pszParam = {"CashUnitInfo":"[{"usNumber":1,"fwType":1,"ulCount":0},
                  {"usNumber":2,"fwType":1,"ulCount":0},{"usNumber":3,"fwType":1,"ulCount":0},{"usNumber":4,"fwType":4,
                  "ulCount":0},{"usNumber":5,"fwType":1,"ulCount":0}"};
               */

            }, {
              key: "CompletedCashUnitExchange",
              value: function CompletedCashUnitExchange(CashUnitInfo) {
                this.setAttribute('CashUnitInfo', CashUnitInfo);
                return this.execute('CompletedCashUnitExchange', {});
              }
              /**
               * 重置钞箱计数，异步接口
               * @param {String} CashUnitsToReset 需清空的钞箱的逻辑号数组,缺省则为当前所有钞箱
               * @param {Number} TimeOut 执行时间（毫秒）,缺省为30秒
               * @returns 清除钞箱张数完成事件 UnitCountsReset( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 UnitCountsReset
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":14767,"dwCommandCode":1313,"eventName":"UnitCountsReset",
                  "eventType":1032,"hService":121,"result":0}
               * @example 入参示例
                  var pszParam = {"CashUnitsToReset":"[1,2,3,4,5]","TimeOut":30000};
               */

            }, {
              key: "ResetUnitCounts",
              value: function ResetUnitCounts() {
                var CashUnitsToReset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "[1,2,3,4,5]";
                var TimeOut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30000;
                var param = {
                  CashUnitsToReset: CashUnitsToReset,
                  TimeOut: TimeOut
                };
                return this.execute('ResetUnitCounts', param);
              }
              /**
               * 更新状态，同步接口
               * @returns  pszParam为JSON串字段
                 {"RequestID":1862,"StDeviceStatus":"HEALTHY","StDispenserStatus":"DEGRADED","StOutputStatus":"EMPTY",
                 "StSafeDoorStatus":"CLOSED","StShutterStatus":"OPEN","StStackerStatus":"EMPTY",
                 "StTransportStatus":"HEALTHY","dwCommandCode":301,"eventName":"GetStatusOver","eventType":1031,
                 "hService":7,"result":0}
               */

            }, {
              key: "GetStatusSync",
              value: function GetStatusSync() {
                return this.getInfo('GetStatusSync', {});
              }
              /**
               * 分次获取冠字号，同步接口
               * @param {Number} CurrentTimes 当前次数
               * @param {Number} NumPerTime  每次获取多少个冠字号
               * @returns pszParam为JSON串字段:
                  SerialNumber: 每次获取的冠字号信息
                  {"SerialNumber":{"SumTimes":3,"Count"100:,"DataIsEnd":0,
                  "Number":[{"Value":100,"Currency":"CNY",...},...]}}
               * @example 入参示例
                  var pszParam = {"NumPerTime":100,"CurrentTimes":1};
               */

            }, {
              key: "GetSerialNumberSync",
              value: function GetSerialNumberSync() {
                var CurrentTimes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
                var NumPerTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
                var param = {
                  CurrentTimes: CurrentTimes,
                  NumPerTime: NumPerTime
                };
                return this.getInfo('GetSerialNumberSync', param);
              }
              /**
               * 获取冠字号批次信息，同步接口
               * @returns pszParam为JSON串字段:
                  SerialNo: 当前冠字号批次序列号,为当前交易时间点字符串
                  {"SerialNo":"20191231150623"}
               */

            }, {
              key: "GetBatchNoSync",
              value: function GetBatchNoSync() {
                return this.getInfo('GetBatchNoSync', {});
              }
              /**
               * 清点钞箱， 异步接口
               * @param {String} CashUnitsToRecount 需清点的钞箱逻辑号数组, 可缺省
               * @param {Number} TimeOut 操作时间(毫秒), 缺省为30秒
               * @returns
                  钞箱盘库完成事件 CashUnitRecounted( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 CashUnitRecounted
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":125,"dwCommandCode":1323,"eventName":"CashUnitRecounted","eventType":1032,
                  "hService":44,"result":0}
               * @example 入参示例
                  var pszParam = {"CashUnitsToRecount":"[1,2,3]","TimeOut":30000};
               */

            }, {
              key: "RecountUnitCash",
              value: function RecountUnitCash(CashUnitsToRecount, TimeOut) {
                return this.execute('RecountUnitCash', {
                  CashUnitsToRecount: CashUnitsToRecount,
                  TimeOut: TimeOut
                });
              }
              /**
               * 开始存款 （异步）
               *  @param OutputPosition 拒钞位置
               * @param InputPosition 入钞位置
               * @returns
                  准备存款完成事件 AcceptCashPrepared( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 AcceptCashPrepared
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":1301,"hService":1,"result":0,
                  "eventType":1032,"eventName":"AcceptCashPrepared"}
                    存款准备已经激活事件 AcceptCashAlreadyActive( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 AcceptCashPrepared
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":1301,"hService":1,"result":-1325,"eventType":1032,
                  "eventName":"AcceptCashAlreadyActive"}
               * @example 入参示例
                  var pszParam = {"OutputPosition":"DEFAULT","InputPosition":"DEFAULT"}或{""}
               */

            }, {
              key: "PrepareForAcceptCash",
              value: function PrepareForAcceptCash() {
                var OutputPosition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "DEFAULT";
                var InputPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "DEFAULT";
                var param = {
                  OutputPosition: OutputPosition,
                  InputPosition: InputPosition
                };
                return this.execute('PrepareForAcceptCash', param);
              }
              /**
              * 开始存款 （同步）
              *  @param OutputPosition 拒钞位置,取值参照属性StOutputPosition(#closeconnectionover "CloseConnectionOver"),缺省为"DEFAULT"
              *  @param InputPosition 入钞位置入钞位置,取值参照属性StInputPosition(#closeconnectionover "CloseConnectionOver"),缺省为"DEFAULT"
              *  @returns pszParam JSON串参数：
              RequestID:请求ID
              dwCommandCode:指令ID
              eventType:事件ID
              eventName:事件名 CashUnitRecounted
              result:执行结果，0表示成功，其他参考WOSA错误码
              {"RequestID":1,"dwCommandCode":1301,"hService":1,"result":0}
              *  @example 入参示例
              var pszParam = {"OutputPosition":"DEFAULT","InputPosition":"DEFAULT"}或{""}
              */

            }, {
              key: "PrepareForAcceptCashSync",
              value: function PrepareForAcceptCashSync() {
                var OutputPosition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "DEFAULT";
                var InputPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "DEFAULT";
                var param = {
                  OutputPosition: OutputPosition,
                  InputPosition: InputPosition
                };
                return this.getInfo('PrepareForAcceptCashSync', param);
              }
            }]);

            return CCashAcceptor;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var cashacceptor = (cashacceptor_CCashAcceptor);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/cashdispenser.js






        /**
         * 出钞模块
         */

        var cashdispenser_CCashDispenser =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CCashDispenser, _CBaseDev);

            function CCashDispenser(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CCashDispenser);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CCashDispenser).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                /**
                 * 配钞完成
                 * @param param
                 */
                'MixComplete': function MixComplete(param) {
                  this.dispatchEvent('MixComplete', param);
                },

                /**
                 * 不可出钞
                 * @param param
                 */
                'Notdispensable': function Notdispensable(param) {
                  this.dispatchEvent('Notdispensable', param);
                },

                /**
                 * 挖钞完成
                 * @param param
                 */
                'CashDispensed': function CashDispensed(param) {
                  this.controlGuideLight(this.siuSpeed);
                  this.dispatchEvent('CashDispensed', param);
                },

                /**
                 * 子挖钞成功
                 * @param param
                 */
                'SubDispensed': function SubDispensed(param) {
                  this.controlGuideLight(this.siuSpeed);
                  this.dispatchEvent('SubDispensed', param);
                },

                /**
                 * 递钞完成
                 * @param param
                 */
                'CashPresented': function CashPresented(param) {
                  this.controlGuideLight(this.siuSpeed);
                  this.dispatchEvent('CashPresented', param);
                },

                /**
                 * 钞票被拿走
                 * @param param
                 */
                'CashTaken': function CashTaken(param) {
                  this.dispatchEvent('CashTaken', param);
                },

                /**
                 * 钞票被回收
                 * @param param
                 */
                'CashRetracted': function CashRetracted(param) {
                  this.dispatchEvent('CashRetracted', param);
                },

                /**
                 * 闸门成功地打开
                 * @param param
                 */
                'ShutterOpened': function ShutterOpened(param) {
                  this.dispatchEvent('ShutterOpened', param);
                },

                /**
                 * 闸门成功地关闭
                 * @param param
                 */
                'ShutterClosed': function ShutterClosed(param) {
                  this.dispatchEvent('ShutterClosed', param);
                },

                /**
                 * 扎把机闸门成功地打开
                 * @param param
                 */
                'BundleShutterOpened': function BundleShutterOpened(param) {
                  this.dispatchEvent('BundleShutterOpened', param);
                },

                /**
                 * 扎把机闸门成功地关闭
                 * @param param
                 */
                'BundleShutterClosed': function BundleShutterClosed(param) {
                  this.dispatchEvent('BundleShutterClosed', param);
                },

                /**
                 * 钞箱信息改变
                 * @param param
                 */
                'CashUnitInfoChanged': function CashUnitInfoChanged(param) {
                  this.dispatchEvent('CashUnitInfoChanged', param);
                },

                /**
                 * 钞箱越过临界值并改变状态时触发
                 * @param param
                 */
                'CashUnitThresholdCrossed': function CashUnitThresholdCrossed(param) {
                  this.dispatchEvent('CashUnitThresholdCrossed', param);
                },

                /**
                 * 复位完成
                 * @param param
                 */
                'ResetComplete': function ResetComplete(param) {
                  this.dispatchEvent('ResetComplete', param);
                },

                /**
                 * 钞箱成功进入更换状态
                 * @param param
                 */
                'ExchangeInitiated': function ExchangeInitiated(param) {
                  this.dispatchEvent('ExchangeInitiated', param);
                },

                /**
                 * 钞箱退出更换状态
                 * @param param
                 */
                'ExchangeCompleted': function ExchangeCompleted(param) {
                  this.dispatchEvent('ExchangeCompleted', param);
                },

                /**
                 * 钞箱更换操作已被完成但失败
                 * @param param
                 */
                'ExchangeFailed': function ExchangeFailed(param) {
                  this.dispatchEvent('ExchangeFailed', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                },

                /**
                 * 打开连接
                 * @param param
                 */
                'ConnectionOpened': function ConnectionOpened(param) {
                  this.dispatchEvent('OpenConnectionOver', param);
                }
              };
              return _this;
            }
            /**
             * 打开闸门，异步接口
             * @param {String} Position 钞门位置，默认DEFAULT 取值范围：DEFAULT、LEFT、RIGHT、CENTER、TOP、BOTTOM、FRONT、REAR、LASH
             * @returns 闸门打开事件 ShutterOpened( string &pszParam)
                其中pszParam JSON串参数：
                RequestID:请求ID
                dwCommandCode:指令ID
                eventType:事件ID
                eventName:事件名 ShutterOpened
                result:执行结果，0表示成功，其他参考WOSA错误码
                {"RequestID":1,"dwCommandCode":307,"eventName":"ShutterOpened","eventType":1032,"hService":1,"result":0}
             * @example 入参示例
                var pszParam = {"Position":"DEFAULT"};
             */


            Object(createClass["a" /* default */ ])(CCashDispenser, [{
              key: "OpenShutter",
              value: function OpenShutter() {
                var Position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'DEFAULT';
                var param = {
                  Position: Position
                };
                return this.execute('OpenShutter', param);
              }
              /**
               * 关闭闸门，异步接口
               * @param {String} Position 钞门位置，默认DEFAULT 取值范围：DEFAULT、LEFT、RIGHT、CENTER、TOP、BOTTOM、FRONT、REAR、LASH
               * @returns 闸门关闭事件 ShutterClosed( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ShutterClosed
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":308,"eventName":"ShutterClosed","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"Position":"DEFAULT"};
               */

            }, {
              key: "CloseShutter",
              value: function CloseShutter() {
                var Position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'DEFAULT';
                var param = {
                  Position: Position
                };
                return this.execute('CloseShutter', param);
              }
              /**
               * 打开扎把机闸门，异步接口
               * @param {String} Position 钞门位置，默认LASH 取值范围：DEFAULT、LEFT、RIGHT、CENTER、TOP、BOTTOM、FRONT、REAR、LASH
               * @returns 闸门打开事件 ShutterOpened( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ShutterOpened
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":307,"eventName":"ShutterOpened","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"Position":"LASH"};
               */

            }, {
              key: "OpenBundleShutter",
              value: function OpenBundleShutter() {
                var Position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'LASH';
                var param = {
                  Position: Position
                };
                return this.execute('OpenBundleShutter', param);
              }
              /**
               * 关闭扎把机闸门，异步接口
               * @param {String} Position 钞门位置，默认LASH 取值范围：DEFAULT、LEFT、RIGHT、CENTER、TOP、BOTTOM、FRONT、REAR、LASH
               * @returns 闸门关闭事件 ShutterClosed( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ShutterClosed
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":308,"eventName":"ShutterClosed","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"Position":"LASH"};
               */

            }, {
              key: "CloseBundleShutter",
              value: function CloseBundleShutter() {
                var Position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'LASH';
                var param = {
                  Position: Position
                };
                return this.execute('CloseBundleShutter', param);
              }
              /**
               * 复位，异步接口
               * @param {String} RetractArea 回收区域，不传默认为RETRACT
               * 可能值和含义：
                  'RETRACT': 回收箱
                  'REJECT': 拒钞箱
               * @param {Number} ID 回收箱编号，不传默认为1
               * @returns 复位完成事件 ResetComplete( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ResetComplete
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":321,"eventName":"ResetComplete","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"RetractArea":"RETRACT","ID":0};
               */

            }, {
              key: "Reset",
              value: function Reset() {
                var RetractArea = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'RETRACT';
                var ID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
                var param = {
                  RetractArea: RetractArea,
                  ID: ID
                };
                return this.execute('Reset', param);
              }
              /**
              * 将钞票从出钞口位置移到指定的回收区域，异步接口
              * @param {Number} RetractArea 回收区域，不传默认为1
              * 可能值和含义：
                 1 回收箱
                 2 传输通道
                 4 暂存区域
                 8 拒钞箱
                 16 不支持
              * @param {Number} usIndex 回收箱编号，不传默认为0
              * @returns 回收钞票完成事件 CashRetracted( string &pszParam)
                 其中pszParam JSON串参数：
                 RequestID:请求ID
                 dwCommandCode:指令ID
                 eventType:事件ID
                 eventName:事件名 CashRetracted
                 result:执行结果，0表示成功，其他参考WOSA错误码
                 {"RequestID":1,"dwCommandCode":305,"eventName":"CashRetracted","eventType":1032,"hService":1,"result":0}
              * @example 入参示例
                 var pszParam = {"RetractArea":1,"usIndex":0};
              */

            }, {
              key: "Retract",
              value: function Retract() {
                var RetractArea = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
                var usIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var param = {
                  RetractArea: RetractArea,
                  usIndex: usIndex
                };
                return this.execute('Retract', param);
              }
              /**
               * 配钞
               * @param {Number} Amount 要出钞的总额
               * @param {String} Currency ISO 格式的币种，如"CNY"、“USD” or “GBP”，默认人民币CNY
               * @param {Number} MixAlgorithm 配钞算法，默认使用第1种
               * @returns 配钞完成事件 MixComplete( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 MixComplete
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  MixInfo: 配钞结果
                  {"RequestID":1,"dwCommandCode":301,"eventName":"MixComplete","eventType":1032,"hService":1,"result":0,"MixInfo":[1,0,0,0,0]}
               * @example 入参示例
                  var pszParam = {"Amount":1000,"Currency":"CNY","MixAlgorithm":1};
               */

            }, {
              key: "Mix",
              value: function Mix(Amount) {
                var Currency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'CNY';
                var MixAlgorithm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1';
                var param = {
                  Amount: Amount,
                  Currency: Currency,
                  MixAlgorithm: MixAlgorithm
                };
                return this.execute('Mix', param);
              }
              /**
               * 配钞后出钞
               * @param {Number} Amount 要出钞的总额
               * @param {String} Currency ISO 格式的币种，比如"CNY"、“USD” or “GBP”，默认人民币CNY
               * @param {Number} MixAlgorithm 配钞算法，默认使用第1种
               * @param {Number} TimeOut 指令执行超时时间 默认为0，无限超时
               * @param {Number} TakenTimeOut 大额出钞时子出钞等待拿钞超时时间，默认为30s超时
               * @returns 出钞完成事件 CashDispensed( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 CashDispensed
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  SubDispenseTimes: 出钞次数
                  {"RequestID":1,"dwCommandCode":302,"eventName":"CashDispensed","eventType":1032,"hService":1,"result":0,"SubDispenseTimes":1}
               * @example 入参示例
                  var pszParam = {"Amount":1000,"Currency":"CNY","MixAlgorithm":1,"TimeOut":0,"TakenTimeOut":30000};
               */

            }, {
              key: "MixAndDispense",
              value: function MixAndDispense(Amount) {
                var Currency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'CNY';
                var MixAlgorithm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1';
                var param = {
                  Amount: Amount,
                  Currency: Currency,
                  MixAlgorithm: MixAlgorithm
                };
                return this.execute('MixAndDispense', param);
              }
              /**
              * 挖钞
              * @param {Number} Amount 要出钞的总额
              * @param NoteCounts JSON格式数组， 配钞算法为0时，每个钞箱单元要出的钞票数量列表
              * @param {String} Currency ISO 格式的币种，如"CNY"、“USD” or “GBP”，默认CNY
              * @param {Number} MixAlgorithm 配钞算法，默认使用第1种
              * @param {Number} TimeOut 指令执行超时时间 默认为0，无限超时
              * @param {Number} TakenTimeOut 大额出钞时子出钞等待拿钞超时时间，默认为30s超时
              * @returns 出钞完成事件 CashDispensed( string &pszParam)
                 其中pszParam JSON串参数：
                 RequestID:请求ID
                 dwCommandCode:指令ID
                 eventType:事件ID
                 eventName:事件名 CashDispensed
                 result:执行结果，0表示成功，其他参考WOSA错误码
                 SubDispenseTimes: 出钞次数
                 {"RequestID":1,"dwCommandCode":302,"eventName":"CashDispensed","eventType":1032,"hService":1,"result":0,"SubDispenseTimes":1}
              * @example 入参示例
                 var pszParam = {"Amount":1000,"Currency":"CNY","MixAlgorithm":1,"NoteCounts":"[0,0,0,0,0]","TimeOut":0,"TakenTimeOut":30000};
              */

            }, {
              key: "Dispense",
              value: function Dispense(Amount, NoteCounts) {
                var Currency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'CNY';
                var MixAlgorithm = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '1';
                var param = {
                  Amount: Amount,
                  NoteCounts: NoteCounts,
                  Currency: Currency,
                  MixAlgorithm: MixAlgorithm
                };
                return this.execute('Dispense', param);
              }
              /**
               * 递钞
               * @param {Number} TimeOut 递钞成功后等待拿走钞票的超时时间
               * @returns 递钞完成事件 CashPresented( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 CashPresented
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":303,"eventName":"CashPresented","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"TimeOut":30000};
               */

            }, {
              key: "Present",
              value: function Present(TimeOut) {
                var param = {
                  TimeOut: TimeOut
                };
                return this.execute('Present', param);
              }
              /**
               * 挖钞并递钞
               * @param {Number} Amount 要出钞的总额
               * @param NoteCounts JSON格式数组，配钞算法为0时，每个钞箱单元要出的钞票数量列表
               * @param {String} Currency ISO 格式的币种，比如"CNY"、“USD” or “GBP”，默认CNY
               * @param {Number} MixAlgorithm 配钞算法，默认使用第1种
               * @param {Number} DispenseTimeOut 总的挖钞完成超时时间
               * @param {Number} TakenTimeOut 递钞成功后等待拿走钞票的超时时间
               * @returns 出钞完成事件 CashDispensed( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 CashDispensed
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  SubDispenseTimes: 出钞次数
                  {"RequestID":1,"dwCommandCode":302,"eventName":"CashDispensed","eventType":1032,"hService":1,"result":0,"SubDispenseTimes":1}
               * @example 入参示例
                  var pszParam = {"Amount":1000,"NoteCounts":"[0,0,0,0,0]","Currency":"CNY","MixAlgorithm":1,"DispenseTimeOut":0,"TakenTimeOut":30000};
               */

            }, {
              key: "DispenseAndPresent",
              value: function DispenseAndPresent(Amount, NoteCounts) {
                var Currency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'CNY';
                var MixAlgorithm = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '1';
                var DispenseTimeOut = arguments.length > 4 ? arguments[4] : undefined;
                var TakenTimeOut = arguments.length > 5 ? arguments[5] : undefined;
                var param = {
                  Amount: Amount,
                  NoteCounts: NoteCounts,
                  Currency: Currency,
                  MixAlgorithm: MixAlgorithm,
                  DispenseTimeOut: DispenseTimeOut,
                  TakenTimeOut: TakenTimeOut
                };
                return this.execute('DispenseAndPresent', param);
              }
              /**
              * 使设备进入 exchanging 状态，并允许钞箱被清空，异步接口
              * @param CashUnitsToExchange 将要被交换或者更新的钞箱编号数组
              * @returns 开始交换钞箱完成事件 ExchangeInitiated( string &pszParam)
                 其中pszParam JSON串参数：
                 RequestID:请求ID
                 dwCommandCode:指令ID
                 eventType:事件ID
                 eventName:事件名 ExchangeInitiated
                 result:执行结果，0表示成功，其他参考WOSA错误码
                 PUPhysicalNumber: 物理钞箱名称列表
                 CUNumber: 逻辑钞箱号列表
                 CUNoteValue: 钞箱面额列表
                 CUNoteCount: 物理当前张数列表
                 CashUnitInfo: 物理信息列表
                 {"RequestID":1,"dwCommandCode":311,"eventName":"ExchangeInitiated","eventType":1032,"hService":1,"result":0,"CUNumber":"[1,2,3,4,5]",...}
              * @example 入参示例
                 var pszParam = {"CashUnitsToExchange":"[1,2,3,4,5]"};
              */

            }, {
              key: "InitiateCashUnitExchange",
              value: function InitiateCashUnitExchange(CashUnitsToExchange) {
                var param = {
                  CashUnitsToExchange: CashUnitsToExchange
                };
                return this.execute('InitiateCashUnitExchange', param);
              }
              /**
               * 结束钞箱信息更新，异步接口
               * @param CashUnitInfo 需要修改的钞箱信息列表
               * @returns 交换钞箱完成事件 ExchangeCompleted( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 ExchangeCompleted
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":312,"eventName":"ExchangeCompleted","eventType":1032,"hService":1,"result":0}
               * @example 入参示例
                  var pszParam = {"CashUnitInfo":"[{"usNumber":1,"usType":12,"ulCount":0},{"usNumber":2,"usType":12,"ulCount":0},{"usNumber":3,"usType":12,"ulCount":0},{"usNumber":4,"usType":6,"ulCount":0},{"usNumber":5,"usType":12,"ulCount":0}"};
               */

            }, {
              key: "CompletedCashUnitExchange",
              value: function CompletedCashUnitExchange(CashUnitInfo) {
                this.setAttribute('CashUnitInfo', CashUnitInfo);
                return this.execute('CompletedCashUnitExchange', {});
              }
              /**
               * 获取钞箱信息，同步接口
               * @returns CashUnitInfo: 钞箱信息
                  usNumber：钞箱逻辑编号
                  usType：钞箱类型
                      拒钞箱：WFS_CDM_TYPEREJECTCASSETTE (2)
                      取款箱：WFS_CDM_TYPEBILLCASSETTE (3)
                      硬币循环箱：WFS_CDM_TYPECOINCYLINDER (4)
                      发币箱: WFS_CDM_TYPECOINDISPENSER (5)
                      回收箱：WFS_CDM_TYPERETRACTCASSETTE (6)
                      补给箱：WFS_CDM_TYPEREPCONTAINER (11)
                      循环箱：WFS_CDM_TYPERECYCLING (12)
                  ulCount：钞箱计数
                  ulInitialCount：初始钞箱计数
                  ulRejectCount： 拒钞数
                  ulValues： 面额
                  cCurrency：币种
                  ulMinNum：最小张数
                  ulMaxNum：最大张数
                  phyNumber：钞箱物理位置
                  usStatus：状态
                      正常：WFS_CDM_STATCUOK (0)
                      满：WFS_CDM_STATCUFULL (1)
                      将满：WFS_CDM_STATCUHIGH (2)
                      将空：WFS_CDM_STATCULOW (3)
                      空：WFS_CDM_STATCUEMPTY (4)
                      不可用：WFS_CDM_STATCUINOP (5)
                      丢失：WFS_CDM_STATCUMISSING (6)
                      维护：WFS_CDM_STATCUMANIP (9)
                  {"CashUnitInfo":"[{"cCurrency":"CNY","phyNumber":"Hopper1A","ulCount":10,"ulInitialCount":10,"ulMaxNum":2800,"ulMinNum":30,"ulRejectCount":0,"ulValues":100,"usNumber":1,"usStatus":4,"usType":12},{"cCurrency":"CNY","phyNumber":"Hopper2A","ulCount":19,"ulInitialCount":10,"ulMaxNum":2800,"ulMinNum":30,"ulRejectCount":0,"ulValues":100,"usNumber":2,"usStatus":4,"usType":12},{"cCurrency":"CNY","phyNumber":"Hopper3A","ulCount":10,"ulInitialCount":10,"ulMaxNum":2800,"ulMinNum":30,"ulRejectCount":0,"ulValues":50,"usNumber":3,"usStatus":4,"usType":12},{"cCurrency":" ","phyNumber":"Hopper4A","ulCount":10,"ulInitialCount":10,"ulMaxNum":2800,"ulMinNum":30,"ulRejectCount":0,"ulValues":0,"usNumber":4,"usStatus":0,"usType":6},{"cCurrency":"CNY","phyNumber":"Hopper5A","ulCount":10,"ulInitialCount":10,"ulMaxNum":2800,"ulMinNum":30,"ulRejectCount":0,"ulValues":50,"usNumber":5,"usStatus":4,"usType":12}]"}
              */

            }, {
              key: "GetCashUnitInfoSync",
              value: function GetCashUnitInfoSync() {
                return this.getInfo('GetCashUnitInfoSync', {});
              }
              /**
              * 更新状态，同步接口
               * @returns 设备状态信息
                {"RequestID":1862,"StDeviceStatus":"HEALTHY","StDispenserStatus":"DEGRADED","StOutputStatus":"EMPTY","StSafeDoorStatus":"CLOSED","StShutterStatus":"OPEN","StStackerStatus":"EMPTY","StTransportStatus":"HEALTHY","dwCommandCode":301,"eventName":"GetStatusOver","eventType":1031,"hService":7,"result":0}
              */

            }, {
              key: "GetStatusSync",
              value: function GetStatusSync() {
                return this.getInfo('GetStatusSync', {});
              }
              /**
               * 分次获取冠字号，同步接口
               * @param {Number} CurrentTimes 当前次数，默认为1
               * @param {Number} NumPerTime  每次获取多少个冠字号，默认为300
               * @returns
                  SerialNumber: 每次获取的冠字号信息
                  {"SerialNumber":{"SumTimes":3,"Count"100:,"DataIsEnd":0,"Number":[{"Value":100,"Currency":"CNY",...},...]}};
               * @example 入参示例
                  var pszParam = {"NumPerTime":100,"CurrentTimes":1};
               */

            }, {
              key: "GetSerialNumberSync",
              value: function GetSerialNumberSync() {
                var CurrentTimes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
                var NumPerTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
                var param = {
                  CurrentTimes: CurrentTimes,
                  NumPerTime: NumPerTime
                };
                return this.getInfo('GetSerialNumberSync', param);
              }
              /**
               * 获取冠字号批次信息，同步接口
               */

            }, {
              key: "GetBatchNoSync",
              value: function GetBatchNoSync() {
                return this.getInfo('GetBatchNoSync', {});
              }
              /**
               * 取消等待取钞 (异步)
               * @returns 取消监听拿钞事件 WaitCancelled( string &pszParam)
               */

            }, {
              key: "CancelWaitForCashTaken",
              value: function CancelWaitForCashTaken() {
                return this.execute('CancelWaitForCashTaken', {});
              }
              /**
               * 拒钞 (异步)
               * @returns 拒钞完成事件 CashRejected( string &pszParam)
                  其中pszParam JSON串参数：
                  RequestID:请求ID
                  dwCommandCode:指令ID
                  eventType:事件ID
                  eventName:事件名 CashPresented
                  result:执行结果，0表示成功，其他参考WOSA错误码
                  {"RequestID":1,"dwCommandCode":304,"eventName":"CashRejected","eventType":1032,"hService":1,"result":0}
               */

            }, {
              key: "Reject",
              value: function Reject() {
                return this.execute('Reject', {});
              }
            }]);

            return CCashDispenser;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var cashdispenser = (cashdispenser_CCashDispenser);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/siu.js






        /**
         * siu
         */

        var siu_CSIU =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CSIU, _CBaseDev);

            function CSIU(serviceName, devName) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CSIU);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CSIU).call(this, serviceName, devName));
              _this.events = {
                /**
                 * port状态变化
                 * @param param
                 */
                'PortStatusChanged': function PortStatusChanged(param) {
                  this.dispatchEvent('PortStatusChanged', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 控制指示灯，同步接口
             * @param Index 索引
             * @param fwCommand  (1 关。2 开)
             * @param TimeOut 超时时间（毫秒，默认1000）
             */


            Object(createClass["a" /* default */ ])(CSIU, [{
              key: "ControlGuideLightSync",
              value: function ControlGuideLightSync(Index, fwCommand) {
                var TimeOut = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
                var param = {
                  Index: Index,
                  fwCommand: fwCommand,
                  TimeOut: TimeOut
                };
                return this.getInfo('ControlGuideLightSync', param, false);
              }
              /**
               * 根据指示器名称控制指示灯，同步接口
               * @param szGLName 指示器名称。数据类型：字符串
               * @param fwCommand  (1 关。2 开)
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "ControlGuideLightByName",
              value: function ControlGuideLightByName(szGLName, fwCommand) {
                var TimeOut = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
                var param = {
                  szGLName: szGLName,
                  fwCommand: fwCommand,
                  TimeOut: TimeOut
                };
                return this.getInfo('ControlGuideLightByName', param, false);
              }
              /**
               * 控制指示器，同步接口
               * @param Index 索引
               * @param fwCommand (1 关。2 开)
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "ControlIndicatorSync",
              value: function ControlIndicatorSync(Index, fwCommand) {
                var TimeOut = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
                var param = {
                  Index: Index,
                  fwCommand: fwCommand,
                  TimeOut: TimeOut
                };
                return this.getInfo('ControlIndicatorSync', param, false);
              }
              /**
               * 控制广告灯
               * @param fwCommand (1 关。2 开)
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "ControlFasciaLightSync",
              value: function ControlFasciaLightSync(fwCommand) {
                var TimeOut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
                var param = {
                  fwCommand: fwCommand,
                  TimeOut: TimeOut
                };
                return this.getInfo('ControlFasciaLightSync', param, false);
              }
              /**
               * 控制远程指示灯
               * @param fwCommand (1 关。2 开)
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "ControlRemoteStatusLightSync",
              value: function ControlRemoteStatusLightSync(fwCommand) {
                var TimeOut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
                var param = {
                  fwCommand: fwCommand,
                  TimeOut: TimeOut
                };
                return this.getInfo('ControlRemoteStatusLightSync', param, false);
              }
              /**
               * 辅助指示灯，同步接口
               * @param Index 索引
               * @param fwCommand (1 关。2 开)
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "SetAuxiliary",
              value: function SetAuxiliary(Index, fwCommand) {
                var TimeOut = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
                var param = {
                  Index: Index,
                  fwCommand: fwCommand,
                  TimeOut: TimeOut
                };
                return this.getInfo('SetAuxiliary', param, false);
              }
              /**
               * 设置SIU Event
               * @param EventType 类型，1/2/4/8/16(SENSORS/DOORS/INDICATORS/AUXILIARIES/SIU_GUIDLIGHTS)
               * @param EventIndex 索引
               * @param EventValue 值，0/1/2(WFS_SIU_NO_CHANGE/WFS_SIU_ENABLE_EVENT/WFS_SIU_DISABLE_EVENT)
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "SetSIUEventSync",
              value: function SetSIUEventSync(EventType, EventIndex, EventValue) {
                var TimeOut = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;
                var param = {
                  EventType: EventType,
                  EventIndex: EventIndex,
                  EventValue: EventValue,
                  TimeOut: TimeOut
                };
                return this.getInfo('SetSIUEventSync', param, false);
              }
              /**
               * 工行UCR应用js提供——启用现金门磁事件
               */

            }, {
              key: "EnableSIUEventAll",
              value: function EnableSIUEventAll() {
                var param = {
                  "EventType": 1,
                  "EventIndex": 0,
                  "Value": 1
                }; //switch开关

                this.getInfo('SetSIUEventSync', param); //let param = {"EventType":1,"EventIndex":5,"Value":1};//人体感应
                //this.getInfo('SetSIUEventSync',JSON.stringify(param));

                param = {
                  "EventType": 2,
                  "EventIndex": 0,
                  "Value": 1
                }; //电子门

                this.getInfo('SetSIUEventSync', param);
                param = {
                  "EventType": 2,
                  "EventIndex": 1,
                  "Value": 1
                }; //保险门

                this.getInfo('SetSIUEventSync', param);
                param = {
                  "EventType": 2,
                  "EventIndex": 3,
                  "Value": 1
                }; //前门

                this.getInfo('SetSIUEventSync', param);
              }
              /**
               * 工行UCR应用js提供——禁用现金门磁事件
               */

            }, {
              key: "DisableSIUEventAll",
              value: function DisableSIUEventAll() {
                var param = {
                  "EventType": 1,
                  "EventIndex": 0,
                  "Value": 0
                }; // switch开关

                this.getInfo('SetSIUEventSync', param);
                param = {
                  "EventType": 1,
                  "EventIndex": 5,
                  "Value": 0
                }; //人体感应

                this.getInfo('SetSIUEventSync', param);
                param = {
                  "EventType": 2,
                  "EventIndex": 0,
                  "Value": 0
                }; //电子门

                this.getInfo('SetSIUEventSync', param);
                param = {
                  "EventType": 2,
                  "EventIndex": 1,
                  "Value": 0
                }; //保险门

                this.getInfo('SetSIUEventSync', param);
                param = {
                  "EventType": 2,
                  "EventIndex": 3,
                  "Value": 0
                }; //前门

                this.getInfo('SetSIUEventSync', param);
              }
              /**
               * 获取状态，同步接口
               * @param PortType
               * @param PortIndex
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "GetSIUStatusSync",
              value: function GetSIUStatusSync(PortType, PortIndex) {
                var TimeOut = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
                var param = {
                  PortType: PortType,
                  PortIndex: PortIndex,
                  TimeOut: TimeOut
                };
                return this.getInfo('GetSIUStatusSync', param, false);
              }
              /**
               * 获取UPS状态，同步接口
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "UPSGetStatusSync",
              value: function UPSGetStatusSync() {
                var TimeOut = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
                return this.getInfo('UPSGetStatusSync', {
                  TimeOut: TimeOut
                }, false);
              }
              /**
               * UPS断电
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "UPSPowerDownSync",
              value: function UPSPowerDownSync() {
                var TimeOut = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
                return this.getInfo('UPSPowerDownSync', {
                  TimeOut: TimeOut
                }, false);
              }
              /**
               * UPS上电
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "UPSPowerUpSync",
              value: function UPSPowerUpSync() {
                var TimeOut = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
                return this.getInfo('UPSPowerUpSync', {
                  TimeOut: TimeOut
                }, false);
              }
              /**
               * 复位，同步接口
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "ResetSync",
              value: function ResetSync() {
                var TimeOut = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
                return this.getInfo('ResetSync', {
                  TimeOut: TimeOut
                }, false);
              }
              /**
               * 关闭所有灯，同步接口
               * @param TimeOut 超时时间（毫秒，默认1000）
               */

            }, {
              key: "CloseAllSync",
              value: function CloseAllSync() {
                var TimeOut = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
                return this.getInfo('CloseAllSync', {
                  TimeOut: TimeOut
                }, false);
              }
            }]);

            return CSIU;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var siu = (siu_CSIU);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/ttu.js






        /**
         * TTU
         */

        var ttu_CTTU =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CTTU, _CBaseDev);

            function CTTU(serviceName, devName) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CTTU);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CTTU).call(this, serviceName, devName));
              /**
               * 激活键
               * @property {string} ActiveKeys
               */

              _this.ActiveKeys = '0123456789ABCDEF';
              /**
               * 激活命令键
               * @property {number[]} ActiveCommandKeys
               */

              _this.ActiveCommandKeys = [1, 2, 3, 4, 24, 25, 26, 27, 28, 29, 30, 31];
              /**
               * 激活结束键
               * @property {number[]} ActiveTerminateCommandKeys
               */

              _this.ActiveTerminateCommandKeys = [1, 2];
              _this.events = {
                /**
                 * 按键事件
                 * @param param
                 */
                'KeyPressed': function KeyPressed(param) {
                  this.dispatchEvent('KeyPressed', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }

            Object(createClass["a" /* default */ ])(CTTU, [{
              key: "Reset",
              value: function Reset() {
                return this.execute('Reset', {});
              }
            }, {
              key: "Cancel",
              value: function Cancel() {
                return this.execute('Cancel', {});
              }
            }, {
              key: "ClearScreen",
              value: function ClearScreen(wPositionX, wPositionY, wWidth, wHeight) {
                var param = {
                  wPositionX: wPositionX,
                  wPositionY: wPositionY,
                  wWidth: wWidth,
                  wHeight: wHeight
                };
                return this.execute('ClearScreen', param);
              }
            }, {
              key: "SetBeep",
              value: function SetBeep(wBeep) {
                var param = {
                  wBeep: wBeep
                };
                return this.execute('SetBeep', param);
              }
            }, {
              key: "DispLight",
              value: function DispLight(Mode) {
                var param = {
                  Mode: Mode
                };
                return this.execute('DispLight', param);
              }
            }, {
              key: "SetLED",
              value: function SetLED(LEDNo, Command) {
                var param = {
                  LEDNo: LEDNo,
                  Command: Command
                };
                return this.execute('SetLED', param);
              }
            }, {
              key: "SetResolution",
              value: function SetResolution(wSizeX, wSizeY) {
                var param = {
                  wSizeX: wSizeX,
                  wSizeY: wSizeY
                };
                return this.execute('SetResolution', param);
              }
            }, {
              key: "WriteForm",
              value: function WriteForm(FormName, ClearScreen, Fields) {
                var param = {
                  FormName: FormName,
                  ClearScreen: ClearScreen,
                  Fields: Fields
                };
                return this.execute('WriteForm', param);
              }
            }, {
              key: "ReadForm",
              value: function ReadForm(FormName, FieldNames) {
                var param = {
                  FormName: FormName,
                  FieldNames: FieldNames
                };
                return this.execute('ReadForm', param);
              }
            }, {
              key: "Write",
              value: function Write(Mode, PosX, PosY, TextAttr, Text) {
                var param = {
                  Mode: Mode,
                  PosX: PosX,
                  PosY: PosY,
                  TextAttr: TextAttr,
                  Text: Text
                };
                return this.execute('Write', param);
              }
            }, {
              key: "WriteParam",
              value: function WriteParam(param) {
                return this.execute('Write', {
                  param: param
                });
              }
            }, {
              key: "ReadParam",
              value: function ReadParam(param) {
                return this.execute('Read', {
                  param: param
                });
              }
            }, {
              key: "Read",
              value: function Read(NumOfChars, Mode, PosX, PosY) {
                var EchoMode = 0; //WFS_TTU_ECHOTEXT

                var EchoAttr = 0; //

                var Cursor = 1; //TRUE

                var Flush = 1; //TRUE

                var AutoEnd = 0; //FALSE

                var param = {
                  NumOfChars: NumOfChars,
                  Mode: Mode,
                  PosX: PosX,
                  PosY: PosY,
                  EchoMode: EchoMode,
                  EchoAttr: EchoAttr,
                  Cursor: Cursor,
                  Flush: Flush,
                  AutoEnd: AutoEnd,
                  ActiveKeys: this.ActiveKeys,
                  ActiveCommandKeys: this.ActiveCommandKeys,
                  ActiveTerminateCommandKeys: this.ActiveTerminateCommandKeys
                };
                return this.execute('Read', param);
              }
            }, {
              key: "FormList",
              value: function FormList() {
                return this.getInfo('FormList', {});
              }
            }, {
              key: "QueryForm",
              value: function QueryForm(formName) {
                var param = {
                  "formName": formName
                };
                return this.getInfo('QueryForm', param);
              }
            }, {
              key: "QueryField",
              value: function QueryField(formName, fieldName) {
                var param = {
                  formName: formName,
                  fieldName: fieldName
                };
                return this.getInfo('QueryField', param);
              }
            }, {
              key: "QueryKeyDetail",
              value: function QueryKeyDetail() {
                return this.getInfo('QueryKeyDetail', {});
              }
            }]);

            return CTTU;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var ttu = (ttu_CTTU);
        // CONCATENATED MODULE: ./src/platform/kernel/device/macro/xfs.js
        //namespace XFS {

        /**
         * @description 符合WOSA规范的SIU指示灯控制命令
         */
        var WFS_SIU_COMMAND;

        (function (WFS_SIU_COMMAND) {
          WFS_SIU_COMMAND[WFS_SIU_COMMAND["WFS_SIU_OFF"] = 1] = "WFS_SIU_OFF";
          WFS_SIU_COMMAND[WFS_SIU_COMMAND["WFS_SIU_ON"] = 2] = "WFS_SIU_ON";
          WFS_SIU_COMMAND[WFS_SIU_COMMAND["WFS_SIU_SLOW_FLASH"] = 4] = "WFS_SIU_SLOW_FLASH";
          WFS_SIU_COMMAND[WFS_SIU_COMMAND["WFS_SIU_MEDIUM_FLASH"] = 8] = "WFS_SIU_MEDIUM_FLASH";
          WFS_SIU_COMMAND[WFS_SIU_COMMAND["WFS_SIU_QUICK_FLASH"] = 16] = "WFS_SIU_QUICK_FLASH";
          WFS_SIU_COMMAND[WFS_SIU_COMMAND["WFS_SIU_CONTINUOUS"] = 128] = "WFS_SIU_CONTINUOUS";
        })(WFS_SIU_COMMAND || (WFS_SIU_COMMAND = {}));
        /**
         * @description 符合WOSA规范的SIU指示灯模块名称
         */


        var WFS_SIU_GUIDLIGHTS;

        (function (WFS_SIU_GUIDLIGHTS) {
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_CARDUNIT"] = 0] = "WFS_SIU_CARDUNIT";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_PINPAD"] = 1] = "WFS_SIU_PINPAD";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_NOTESDISPENSER"] = 2] = "WFS_SIU_NOTESDISPENSER";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_COINDISPENSER"] = 3] = "WFS_SIU_COINDISPENSER";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_RECEIPTPRINTER"] = 4] = "WFS_SIU_RECEIPTPRINTER";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_PASSBOOKPRINTER"] = 5] = "WFS_SIU_PASSBOOKPRINTER";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_ENVDEPOSITORY"] = 6] = "WFS_SIU_ENVDEPOSITORY";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_CHEQUEUNIT"] = 7] = "WFS_SIU_CHEQUEUNIT";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_BILLACCEPTOR"] = 8] = "WFS_SIU_BILLACCEPTOR";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_ENVDISPENSER"] = 9] = "WFS_SIU_ENVDISPENSER";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_DOCUMENTPRINTER"] = 10] = "WFS_SIU_DOCUMENTPRINTER";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_COINACCEPTOR"] = 11] = "WFS_SIU_COINACCEPTOR";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_SCANNER"] = 12] = "WFS_SIU_SCANNER";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_CARDUNIT_EX"] = 13] = "WFS_SIU_CARDUNIT_EX";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_FINGERSCANNER"] = 14] = "WFS_SIU_FINGERSCANNER";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_IDCARD"] = 15] = "WFS_SIU_IDCARD";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_UKEY"] = 16] = "WFS_SIU_UKEY";
          WFS_SIU_GUIDLIGHTS[WFS_SIU_GUIDLIGHTS["WFS_SIU_STRIPECARD"] = 17] = "WFS_SIU_STRIPECARD"; //自定义的
        })(WFS_SIU_GUIDLIGHTS || (WFS_SIU_GUIDLIGHTS = {}));
        /**
         * @description 符合WOSA规范的SIU类型
         */


        var WFS_SIU_TYPES;

        (function (WFS_SIU_TYPES) {
          WFS_SIU_TYPES[WFS_SIU_TYPES["WFS_SIU_SENSORS"] = 1] = "WFS_SIU_SENSORS";
          WFS_SIU_TYPES[WFS_SIU_TYPES["WFS_SIU_DOORS"] = 2] = "WFS_SIU_DOORS";
          WFS_SIU_TYPES[WFS_SIU_TYPES["WFS_SIU_INDICATORS"] = 4] = "WFS_SIU_INDICATORS";
          WFS_SIU_TYPES[WFS_SIU_TYPES["WFS_SIU_AUXILIARIES"] = 8] = "WFS_SIU_AUXILIARIES";
          WFS_SIU_TYPES[WFS_SIU_TYPES["WFS_SIU_GUIDLIGHTS"] = 16] = "WFS_SIU_GUIDLIGHTS";
        })(WFS_SIU_TYPES || (WFS_SIU_TYPES = {})); //}
        // EXTERNAL MODULE: ./src/platform/kernel/device/modules/laserprinter.js
        var laserprinter = __webpack_require__("8614");

        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/videochat.js






        /**
         * VideoChat(anychat封装)
         */

        var videochat_CVideoChat =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CVideoChat, _CBaseDev);

            function CVideoChat(serviceName, devName) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CVideoChat);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CVideoChat).call(this, serviceName, devName));
              _this.events = {
                /**
                 * 按键事件
                 * @param param
                 */
                'OnLogin': function OnLogin(param) {
                  this.dispatchEvent('OnLogin', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'OnConnected': function OnConnected(param) {
                  this.dispatchEvent('OnConnected', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'OnDisconnected': function OnDisconnected(param) {
                  this.dispatchEvent('OnDisconnected', param);
                }
              };
              return _this;
            }

            Object(createClass["a" /* default */ ])(CVideoChat, [{
              key: "SDKInit",
              value: function SDKInit() {
                return this.execute('SDKInit', {});
              }
            }, {
              key: "SDKLogin",
              value: function SDKLogin(ServerIp, UserName, Password) {
                var hr = this.execute('SDKInit', {});
                var param = {
                  ServerIp: ServerIp,
                  UserName: UserName,
                  Password: Password
                };
                return this.execute('SDKLogin', param);
              }
            }, {
              key: "SDKEnterRoom",
              value: function SDKEnterRoom(roomID) {
                var param = {
                  roomID: roomID
                };
                return this.execute('SDKEnterRoom', param);
              }
            }, {
              key: "SetDisplay",
              value: function SetDisplay(x, y, w, h) {
                var param = {
                  x: x,
                  y: y,
                  w: w,
                  h: h
                };
                return this.execute('SetDisplay', param);
              }
            }, {
              key: "SendRequest",
              value: function SendRequest(data) {
                return this.execute('SendRequest', data);
              }
            }, {
              key: "SendRequestEx",
              value: function SendRequestEx(data) {
                return this.execute('SendRequestEx', data);
              }
            }, {
              key: "LeaveRoom",
              value: function LeaveRoom() {
                return this.execute('LeaveRoom', {});
              }
            }, {
              key: "GetConnectFlag",
              value: function GetConnectFlag() {
                return this.getInfo('GetConnectFlagSync', {});
              }
            }]);

            return CVideoChat;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var videochat = (videochat_CVideoChat);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/uchat.js






        /**
         * uchat
         *
         * 事件列表
        2.1.getAvailableQueuerOver
        事件描述
        获取队列目标完成事件
        事件参数
        [out] pszParam JSON串参数
        "pUserId":排队用户ID
        "pUsrerIdEx":被请求者用户ID
        "pRoomId":房间号ID
        "nResult":执行结果 取值如下： -- 0:成功 -- 1:失败
        示例：{"nResult":"1065000","pUsrerIdEx":"1065001","pRoomId":"1111","result":0}
        2.2.makeCallOver
        事件描述
        呼叫完成事件
        事件参数
        [out] pszParam JSON串参数
        "nResult":呼叫结果 取值如下： -- 0:成功 -- 1:失败
        "nVideoIndex":视频流ID
        "nAudioIndex":音频流ID
        示例：{"nResult":0,"nVideoIndex":1,"nAudioIndex":1}
        2.3.answerCallOver
        事件描述
        应答完成事件
        事件参数
        [out] pszParam JSON串参数
        "nResult":应答结果 取值如下： -- 0:成功 -- 1:失败
        "nVideoIndex":视频流ID
        "nAudioIndex":音频流ID
        示例：{"nResult":0,"nVideoIndex":1,"nAudioIndex":1}
        2.4.inviteRemoteUserOver
        事件描述
        邀请完成事件
        事件参数
        [out] pszParam JSON串参数
        "nResult":应答结果 取值如下： -- 0:成功 -- 1:失败
        "nVideoIndex":视频流ID
        "nAudioIndex":音频流ID
        示例：{"nResult":0,"nVideoIndex":1,"nAudioIndex":1}
        2.5.answerRemoteShareOver
        事件描述
        远程协作应答完成事件
        事件参数
        [out] pszParam JSON串参数
        "nResult":应答结果 取值如下： -- 0:成功 -- 1:失败
        "nShareIndex":共享画面视频流ID
        示例：{"nResult":0,"nShareIndex":1}
        2.6.CallComing
        事件描述
        来电事件
        事件参数
        [out] pszParam JSON串参数
        "pUsrId":用户ID
        示例：{"pUsrId":"1065000"}
        2.7.UChatRecvMessage
        事件描述
        收到文本事件
        事件参数
        [out] pszParam JSON串参数
        "pUsrId":用户ID
        "pMessage":文本内容
        示例：{"pUsrId":"1065000", "pMessage":"文本内容"}
        2.8.queryStatusOver
        事件描述
        查询状态返回
        事件参数
        [out] pszParam JSON串参数
        "nResult":查询是否成功，0 成功 其它失败
        "nStatus":连接状态，0 连接 1 未连接
        示例：{"nStatus":0， "nResult":0}
        2.9.getCameraListOver
        事件描述
        查询摄像头列表返回
        事件参数
        [out] pszParam JSON串参数
        [out] 作为输出参数时，输出以下字段：
        nCameraNum : 摄像头个数
        CameraList : 摄像头名称 -- CameraList0 表示摄像头1 CameraList1 表示摄像头2 以此类推
        示例：{"nCameraNum":3, "CameraList0":"cam0", "CameraList1":"cam1", "CameraList2":"cam2"}
        2.10.loginOver
        事件描述
        登陆返回事件
        事件参数
        [out] pszParam JSON串参数
        [out] 作为输出参数时，输出以下字段：
        LoginStatus : 登陆状态 Success 表示成功 Failed 表示失败
        nResult : 登陆状态 0 表示成功 1 表示失败 -- CameraList0 表示摄像头1 CameraList1 表示摄像头2
        以此类推
        示例：{"LoginStatus":"Success", "nResult":0}
        2.11.ClientTimeout
        事件描述
        超时事件
        事件参数
        [out] pszParam JSON串参数
        [out] 作为输出参数时，输出以下字段：
        EventID : 超时 ClientTimeout
        示例：{"ClientTimeout":"ClientTimeout"}
        2.12.ClientConnected
        事件描述
        用户连接事件
        事件参数
        [out] pszParam JSON串参数
        [out] 作为输出参数时，输出以下字段：
        pUsrId : 用户id
        示例：{"pUsrId":"1065000"}
        2.13.ClientDisconnected
        事件描述
        用户断开事件
        事件参数
        [out] pszParam JSON串参数
        [out] 作为输出参数时，输出以下字段：
        pUsrId : 用户id
        示例：{"pUsrId":"1065000"}
        2.14.RcsStatusEvent
        事件描述
        Rsc连接事件
        事件参数
        [out] pszParam JSON串参数
        [out] 作为输出参数时，输出以下字段：
        RcsStatus : RCS连接状态 Connected 成功连接 DisConnected 连接断开 ReConnected 重新连接
        nResult : RCS连接状态 0 成功连接 1 连接断开 2 重新连接
        示例：{"RcsStatus":"Connected", "nResult":0}
        2.15.RcsRegistedEvent
        事件描述
        Rsc注册事件
        事件参数
        [out] pszParam JSON串参数
        [out] 作为输出参数时，输出以下字段：
        RcsStatus : RCS注册状态 Registed 注册成功 UnRegisted 注册失败
        nResult : RCS注册状态 0 成功连接 1 连接断开 2 重新连接
        示例：{"pUsrId":"1065000"}
        2.15.RcsRegistedEvent
        事件描述
        Rsc注册事件
        事件参数
        [out] pszParam JSON串参数
        [out] 作为输出参数时，输出以下字段：
        RcsStatus : RCS注册状态 Registed 注册成功 UnRegisted 注册失败
        nResult : RCS注册状态 0 成功连接 1 连接断开 2 重新连接
        示例：{"pUsrId":"1065000"}

         */

        var uchat_CUChat =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CUChat, _CBaseDev);

            function CUChat(serviceName, devName) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CUChat);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CUChat).call(this, serviceName, devName));
              _this.events = {};
              return _this;
            }
            /**
             * 初始化⾳视频环境
             */


            Object(createClass["a" /* default */ ])(CUChat, [{
              key: "init",
              value: function init() {
                return this.getInfo('init', {});
              }
              /**
               * 登录
               * @param pIP 服务器IP
               * @param pPort 服务器端⼝
               * @param pUserId ⽤户id
               * @param pPasswrod ⽤户密码
               * @param pRcsIP RscIP
               * @param pRcsPort Rsc端口
               * @param nIdentity 取值如下： -- 0:客户席 -- 1:坐席
               * @param nDeviceState 取值如下： -- 1:上线 -- 2:下线 -- 3:呼叫中 -- 4:就绪 -- 5:不就绪
               */

            }, {
              key: "login",
              value: function login(pIP, pPort, pUserId, pPasswrod, pRcsIP, pRcsPort, nIdentity, nDeviceState) {
                var param = {
                  pIP: pIP,
                  pPort: pPort,
                  pUserId: pUserId,
                  pPasswrod: pPasswrod,
                  pRcsIP: pRcsIP,
                  pRcsPort: pRcsPort,
                  nIdentity: nIdentity,
                  nDeviceState: nDeviceState
                };
                return this.execute('login', param);
              }
              /**
               * 进⼊队列
               * @param nIdentity 取值如下： -- 0:客户席 -- 1:坐席
               * @param nBusiness 业务范围码
               * @param pOrganization 机构号，队列范围
               */

            }, {
              key: "queue",
              value: function queue(nIdentity, nBusiness, pOrganization) {
                var param = {
                  nIdentity: nIdentity,
                  nBusiness: nBusiness,
                  pOrganization: pOrganization
                };
                return this.getInfo('queue', param);
              }
              /**
               * 获取队列⽬标
               * @param nIdentity 取值如下： -- 0:客户席 -- 1:坐席
               * @param nBusiness 业务范围码
               * @param pOrganization 机构号，队列范围
               */

            }, {
              key: "getAvailableQueuer",
              value: function getAvailableQueuer(nIdentity, nBusiness, pOrganization) {
                var param = {
                  nIdentity: nIdentity,
                  nBusiness: nBusiness,
                  pOrganization: pOrganization
                };
                return this.execute('getAvailableQueuer', param);
              }
              /**
               * 呼叫
               * @param pRoomId 房间id,保留
               * @param pUserId 业务范围码
               * @param flag 取值如下： -- 0:视频及⾳频 -- 1:仅视频 -- 2:仅⾳频
               * @param nX 显⽰起始位置X
               * @param nY 显⽰起始位置Y
               * @param nWidth 显⽰宽度
               * @param nHeight 显⽰⾼度
               * @param hWnd 窗⼝句柄
               */

            }, {
              key: "makeCall",
              value: function makeCall(pRoomId, pUserId, flag, nX, nY, nWidth, nHeight, hWnd) {
                var param = {
                  pRoomId: pRoomId,
                  pUserId: pUserId,
                  flag: flag,
                  nX: nX,
                  nY: nY,
                  nWidth: nWidth,
                  nHeight: nHeight,
                  hWnd: hWnd
                };
                return this.execute('makeCall', param);
              }
              /**
               * 设置画⾯区域
               * @param nVideoIndex 视频流ID
               * @param nX 显⽰起始位置X
               * @param nY 显⽰起始位置Y
               * @param nWidth 显⽰宽度
               * @param nHeight 显⽰⾼度
               * @param hWnd 窗⼝句柄
               *
               */

            }, {
              key: "setVedioPos",
              value: function setVedioPos(nVideoIndex, nX, nY, nWidth, nHeight, hWnd) {
                var param = {
                  nVideoIndex: nVideoIndex,
                  nX: nX,
                  nY: nY,
                  nWidth: nWidth,
                  nHeight: nHeight,
                  hWnd: hWnd
                };
                return this.execute('setVedioPos', param);
              }
              /**
               * 应答
               * @param pUserId ⽤户ID
               * @param nFlag 取值如下： -- 0:接⼊ -- 1:拒绝
               * @param nX 显⽰起始位置X
               * @param nY 显⽰起始位置Y
               * @param nWidth 显⽰宽度
               * @param nHeight 显⽰⾼度
               * @param hWnd 窗⼝句柄
               */

            }, {
              key: "answerCall",
              value: function answerCall(pUserId, nFlag, nX, nY, nWidth, nHeight, hWnd) {
                var param = {
                  pUserId: pUserId,
                  nFlag: nFlag,
                  nX: nX,
                  nY: nY,
                  nWidth: nWidth,
                  nHeight: nHeight,
                  hWnd: hWnd
                };
                return this.execute('answerCall', param);
              }
              /**
               * 视频流展⽰控制
               * @param nVideoIndex 视频流ID
               * @param nControlFlag 取值如下： -- 0:展⽰ -- 1:关闭展⽰
               */

            }, {
              key: "setVedioDisplay",
              value: function setVedioDisplay(nVideoIndex, nControlFlag) {
                var param = {
                  nVideoIndex: nVideoIndex,
                  nControlFlag: nControlFlag
                };
                return this.getInfo('setVedioDisplay', param);
              }
              /**
               * ⾳频流控制
               * @param nAudioIndex ⾳频流ID
               * @param nControlFlag 取值如下： -- 0:展⽰ -- 1:关闭展⽰
               */

            }, {
              key: "setAudioControl",
              value: function setAudioControl(nAudioIndex, nControlFlag) {
                var param = {
                  nAudioIndex: nAudioIndex,
                  nControlFlag: nControlFlag
                };
                return this.getInfo('setAudioControl', param);
              }
              /**
               * 本地视频流控制
               * @param nControlFlag 取值如下： -- 0:展⽰ -- 1:关闭展⽰
               * @param nX 显⽰起始位置X
               * @param nY 显⽰起始位置Y
               * @param nWidth 显⽰宽度
               * @param nHeight 显⽰⾼度
               * @param hWnd 窗⼝句柄
               *
               */

            }, {
              key: "setLocalVedioDisplay",
              value: function setLocalVedioDisplay(nControlFlag, nX, nY, nWidth, nHeight, hWnd) {
                var param = {
                  nControlFlag: nControlFlag,
                  nX: nX,
                  nY: nY,
                  nWidth: nWidth,
                  nHeight: nHeight,
                  hWnd: hWnd
                };
                return this.getInfo('setLocalVedioDisplay', param);
              }
              /**
               * 本地⾳频流
               * @param nControlFlag 取值如下： -- 0:上送 -- 1:不上送
               *
               */

            }, {
              key: "setLocalAudioControl",
              value: function setLocalAudioControl(nControlFlag) {
                var param = {
                  nControlFlag: nControlFlag
                };
                return this.getInfo('setLocalAudioControl', param);
              }
              /**
               * 邀请
               * @param pUserId ⽤户ID
               *
               */

            }, {
              key: "inviteRemoteUser",
              value: function inviteRemoteUser(pUserId) {
                var param = {
                  pUserId: pUserId
                };
                return this.execute('inviteRemoteUser', param);
              }
              /**
               * 挂起
               * @param pUserId ⽤户ID
               */

            }, {
              key: "hangOn",
              value: function hangOn(pUserId) {
                var param = {
                  pUserId: pUserId
                };
                return this.getInfo('hangOn', param);
              }
              /**
               * 恢复通话
               * @param pUserId ⽤户ID
               */

            }, {
              key: "recoverCall",
              value: function recoverCall(pUserId) {
                var param = {
                  pUserId: pUserId
                };
                return this.getInfo('recoverCall', param);
              }
              /**
               * 转办
               * @param pUserId 转办的⽤户ID
               * @param chargeUserId 接管者⽤户ID
               */

            }, {
              key: "turnToCharge",
              value: function turnToCharge(pUserId, chargeUserId) {
                var param = {
                  pUserId: pUserId,
                  chargeUserId: chargeUserId
                };
                return this.getInfo('turnToCharge', param);
              }
              /**
               * 连接状态查询
               * @param pUserId ⽤户ID
               * @returns event queryStatusOver nStatus 连接状态，0 连接 1 未连接 nResult 查询是否成功，0 成功 其它失败
               */

            }, {
              key: "queryStatus",
              value: function queryStatus(pUserId) {
                var param = {
                  pUserId: pUserId
                };
                return this.execute('queryStatus', param);
              }
              /**
               * 释放⽤户
               * @param pUserId ⽤户ID
               */

            }, {
              key: "dropUser",
              value: function dropUser(pUserId) {
                var param = {
                  pUserId: pUserId
                };
                return this.getInfo('dropUser', param);
              }
              /**
               * ⽂本消息发送
               * @param pUserId ⽤户ID
               * @param pMessage 发送内容⽂本字符串
               * @param pExtendField 扩展字段，保留
               */

            }, {
              key: "sendMessage",
              value: function sendMessage(pUserId, pMessage, pExtendField) {
                var param = {
                  pUserId: pUserId,
                  pMessage: pMessage,
                  pExtendField: pExtendField
                };
                return this.getInfo('sendMessage', param);
              }
              /**
               * ⽂本消息发送
               * @param pUserId ⽤户ID
               * @param nRecordFlag 取值如下： -- 0:启动录像 -- 1:停⽌录像
               * @param pPath 保存路径
               * @param recordParam 取值如下： -- 0:视频录制 -- 1:⾳频录制 -- 2:视频流录制 -- 3:服务器录制 --4:录制⾳频时，将其它所有⽤户的声⾳混⾳后录制 -- 5:录制视频时，将其它所有⽤户的视频迭
               加后录制 -- 6:录制视频时，将其它所有⽤户的视频并列录制 -- 7:录制⾳频时，将其它所有⽤户
               的声⾳混合为⽴体
               */

            }, {
              key: "streamRecord",
              value: function streamRecord(pUserId, nRecordFlag, pPath, recordParam) {
                var param = {
                  pUserId: pUserId,
                  nRecordFlag: nRecordFlag,
                  pPath: pPath,
                  recordParam: recordParam
                };
                return this.getInfo('streamRecord', param);
              }
              /**
               * 获取本地摄像头列表
               * @returns  event getCameraListOver nCameraNum 摄像头个数 CameraList 摄像头名称 -- CameraList0 表⽰摄像头1 CameraList1 表⽰摄像头2 以此类推
               */

            }, {
              key: "getCameraList",
              value: function getCameraList() {
                var param = {};
                return this.execute('getCameraList', param);
              }
              /**
               * 切换摄像头
               * @param cameraName 摄像头名称 ⽰例：{"CameraList0":"cam0"}
               */

            }, {
              key: "switchCamera",
              value: function switchCamera(cameraName) {
                var param = {
                  cameraName: cameraName
                };
                return this.getInfo('switchCamera', param);
              }
              /**
               * 远程共享
               * @param pUserId ⽤户ID
               * @param nControlFlag 取值如下： -- 0:展示 -- 1:关闭展示
               * @param pExtendField 扩展字段，保留
               */

            }, {
              key: "remoteShare",
              value: function remoteShare(pUserId, nControlFlag, pExtendField) {
                var param = {
                  pUserId: pUserId,
                  nControlFlag: nControlFlag,
                  pExtendField: pExtendField
                };
                return this.getInfo('remoteShare', param);
              }
              /**
               * 远程控制
               * @param pUserId ⽤户ID
               * @param nControlFlag 取值如下： -- 0:展示 -- 1:关闭展示
               * @param pExtendField 扩展字段，保留
               */

            }, {
              key: "remoteShareControl",
              value: function remoteShareControl(pUserId, nControlFlag, pExtendField) {
                var param = {
                  pUserId: pUserId,
                  nControlFlag: nControlFlag,
                  pExtendField: pExtendField
                };
                return this.getInfo('remoteShareControl', param);
              }
              /**
               * 远程白板
               * @param pUserId ⽤户ID
               * @param nTransparence 白板透明度
               * @param nX 显⽰起始位置X
               * @param nY 显⽰起始位置Y
               * @param nWidth 显⽰宽度
               * @param nHeight 显⽰⾼度
               * @param hWnd 窗⼝句柄
               * @param nControlFlag 取值如下： -- 0:展示 -- 1:关闭展示
               * @param pExtendField 扩展字段，保留
               */

            }, {
              key: "whiteBoardShare",
              value: function whiteBoardShare(pUserId, nTransparence, nX, nY, nWidth, nHeight, hWnd, nControlFlag, pExtendField) {
                var param = {
                  pUserId: pUserId,
                  nTransparence: nTransparence,
                  nX: nX,
                  nY: nY,
                  nWidth: nWidth,
                  nHeight: nHeight,
                  hWnd: hWnd,
                  nControlFlag: nControlFlag,
                  pExtendField: pExtendField
                };
                return this.getInfo('whiteBoardShare', param);
              }
              /**
               * 远程协作应答
               * @param nFlag 取值如下： -- 0:同意 -- 1:拒绝
               */

            }, {
              key: "answerRemoteShare",
              value: function answerRemoteShare(nFlag) {
                var param = {
                  nFlag: nFlag
                };
                return this.execute('answerRemoteShare', param);
              }
              /**
               * 挂断
               * @param pUserId ⽤户ID
               */

            }, {
              key: "hangUp",
              value: function hangUp(pUserId) {
                var param = {
                  pUserId: pUserId
                };
                return this.getInfo('hangUp', param);
              }
              /**
               * 释放连接
               */

            }, {
              key: "logout",
              value: function logout() {
                var param = {};
                return this.getInfo('logout', param);
              }
            }]);

            return CUChat;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var uchat = (uchat_CUChat);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/uplay.js






        /**
         * uplay
         *
         */

        var uplay_CPlay =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CPlay, _CBaseDev);

            function CPlay(serviceName, devName) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CPlay);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CPlay).call(this, serviceName, devName));
              _this.events = {
                /**
                 * 播放视频开始事件
                 * @param param
                 */
                'PlayVideoeOver': function PlayVideoeOver(param) {
                  this.dispatchEvent('PlayVideoOver', param);
                },

                /**
                 * 播放视频开始事件
                 * @param param
                 */
                'PlayVideoOver': function PlayVideoOver(param) {
                  this.dispatchEvent('PlayVideoOver', param);
                },

                /**
                 * 播放视频完成事件
                 * @param param
                 */
                'PlayFinished': function PlayFinished(param) {
                  this.dispatchEvent('PlayFinished', param);
                }
              };
              return _this;
            }
            /**
             * 播放视频
             * @param wAction  播放动作，取值如下： -- 0:开始播放 -- 1:停⽌播放 -- 2:暂停播放 -- 3:恢复播放
             * @param pPath  播放⽂件路径(开始播放时有效)
             * @param bPalyAudio 是否播放声⾳(pPath为视频⽂件时有效) 0 不播放 1 播放
             * @param bShowWindow  是否显⽰窗⼝ 0 不显⽰ 1 显⽰
             * @param nX 显⽰起始位置X
             * @param nY  显⽰起始位置Y
             * @param nWidth 显⽰宽度
             * @param nHeight 显⽰⾼度
             * @param hWnd 窗⼝句柄(可以为空)
             */


            Object(createClass["a" /* default */ ])(CPlay, [{
              key: "PlayVideo",
              value: function PlayVideo(wAction, pPath, bPalyAudio, bShowWindow, nX, nY, nWidth, nHeight, hWnd) {
                var param = {
                  wAction: wAction,
                  pPath: pPath,
                  bPalyAudio: bPalyAudio,
                  bShowWindow: bShowWindow,
                  nX: nX,
                  nY: nY,
                  nWidth: nWidth,
                  nHeight: nHeight,
                  hWnd: hWnd
                };
                return this.execute('PlayVideo', param);
              }
            }]);

            return CPlay;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var uplay = (uplay_CPlay);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/dws.js






        /**
         * 快递扫描
         */

        var dws_CDWS =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CDWS, _CBaseDev);

            function CDWS(serviceName, devName, siuType) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CDWS);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CDWS).call(this, serviceName, devName));
              _this.siuType = siuType;
              _this.events = {
                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 获取状态,异步接口
             *
             */


            Object(createClass["a" /* default */ ])(CDWS, [{
              key: "GetStatus",
              value: function GetStatus() {
                return this.execute('GetStatus', {});
              }
              /**
               * 工业相机读码，异步接口
               * @param TimeOut 超时时间, 单位毫秒(ms), 取值为0, 永不超时
               */

            }, {
              key: "MVIDCodeReader",
              value: function MVIDCodeReader(TimeOut) {
                var param = {
                  TimeOut: TimeOut
                };
                return this.execute('MVIDCodeReader', param);
              }
              /**
               * 双目体积计算，异步接口
               * @param TimeOut 超时时间, 单位毫秒(ms), 取值为0, 永不超时
               */

            }, {
              key: "VolMeasure",
              value: function VolMeasure(TimeOut) {
                var param = {
                  TimeOut: TimeOut
                };
                return this.execute('VolMeasure', param);
              }
              /**
               * 计算重量，异步接口
               * @param TimeOut 超时时间, 单位毫秒(ms), 取值为0, 永不超时
               */

            }, {
              key: "CalculateWeight",
              value: function CalculateWeight(TimeOut) {
                var param = {
                  TimeOut: TimeOut
                };
                return this.execute('CalculateWeight', param);
              }
              /**
               * 普通摄像头拍照，异步接口
               * @param TimeOut 超时时间, 单位毫秒(ms), 取值为0, 永不超时
               */

            }, {
              key: "TakePictureEx",
              value: function TakePictureEx(PictureSaveToPath, TimeOut) {
                var param = {
                  PictureSaveToPath: PictureSaveToPath,
                  TimeOut: TimeOut
                };
                return this.execute('TakePictureEx', param);
              }
              /**
               *
               * @param ShowData 要显示的内容
               * @param TimeOut 超时时间, 单位毫秒(ms), 取值为0, 永不超时
               */

            }, {
              key: "AutoShowData",
              value: function AutoShowData(ShowData, TimeOut) {
                var param = {
                  ShowData: ShowData,
                  TimeOut: TimeOut
                };
                return this.execute('AutoShowData', param);
              }
            }]);

            return CDWS;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var dws = (dws_CDWS);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/setsiutools.js






        /**
         * SetSIUTools
         */

        var setsiutools_CSetSIUTools =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CSetSIUTools, _CBaseDev);

            function CSetSIUTools(serviceName, devName) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CSetSIUTools);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CSetSIUTools).call(this, serviceName, devName));
              _this.events = {
                /**
                 * 打开设备完成事件
                 * @param param  JSON串参数 "result":执行结果，0表示成功 "ErrorDetail":错误描述； 示例：{"result":0,"ErrorDetail":"Success"}
                 */
                'OpenDeviceOver': function OpenDeviceOver(param) {
                  this.dispatchEvent('OpenDeviceOver', param);
                },

                /**
                 * 关闭设备完成事件
                 * @param param  JSON串参数 "result":执行结果，0表示成功 "ErrorDetail":错误描述； 示例：{"result":0,"ErrorDetail":"Success"}
                 */
                'CloseDeviceOver': function CloseDeviceOver(param) {
                  this.dispatchEvent('CloseDeviceOver', param);
                },

                /**
                 * 获取设备版本事件
                 * @param param  JSON串参数 "Version":版本号， "result":执行结果，0表示成功， 示例：{"Version":"SCU v1.40","result":0}
                 */
                'GetFirmVersionExOver': function GetFirmVersionExOver(param) {
                  this.dispatchEvent('GetFirmVersionExOver', param);
                },

                /**
                 * 获取传感器状态事件
                 * @param param  JSON串参数 "Sensor":传感器值， "ChangeNum": 与上一次传感器比较变化位， 示例：{"Sensor":"000000","ChangeNum":0}
                 */
                'GetSensorStatusAllOver': function GetSensorStatusAllOver(param) {
                  this.dispatchEvent('GetSensorStatusAllOver', param);
                },

                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 打开设备（异步）
             * @param pSerialport 串口号
             * @param pSerialParam  串口参数
             * @param pXMLPath XML文件路径
             * @param TimeOut 超时时间（毫秒）
             * @example pSerialport: "8", pSerialParam: "9600,n,8,1", pXMLPath: "C:\KIOSK\Devservice\SIUDriver\GWI_SIU_XFS.xml"
             * @emits OpenDeviceOver
             */


            Object(createClass["a" /* default */ ])(CSetSIUTools, [{
              key: "OpenDevice",
              value: function OpenDevice(pSerialport, pSerialParam, pXMLPath, TimeOut) {
                var param = {
                  pSerialport: pSerialport,
                  pSerialParam: pSerialParam,
                  pXMLPath: pXMLPath,
                  TimeOut: TimeOut
                };
                return this.execute('OpenDevice', param);
              }
              /**
               * 关闭设备（异步）
               * @param TimeOut 超时时间（毫秒）
               * @emits CloseDeviceOver
               */

            }, {
              key: "CloseDevice",
              value: function CloseDevice(TimeOut) {
                var param = {
                  TimeOut: TimeOut
                };
                return this.execute('CloseDevice', param);
              }
              /**
               * 获取固件版本（异步）
               * @param TimeOut 超时时间（毫秒）
               * @emits GetFirmVersionExOver
               */

            }, {
              key: "GetFirmVersionEx",
              value: function GetFirmVersionEx(TimeOut) {
                var param = {
                  TimeOut: TimeOut
                };
                return this.execute('GetFirmVersionEx', param);
              }
              /**
               * 获取传感器状态（异步）
               * @param TimeOut 超时时间（毫秒）
               * @emits GetSensorStatusAllOver
               */

            }, {
              key: "GetSensorStatusAll",
              value: function GetSensorStatusAll(TimeOut) {
                var param = {
                  TimeOut: TimeOut
                };
                return this.execute('GetSensorStatusAll', param);
              }
              /**
               * 设置门磁参数列表（同步）
               * @param nIndex 门磁索引,取值如下： <br/>
                              -- WFS_SIU_CABINET:0 (厢体门) <br/>
                              -- WFS_SIU_SAFE:1 (安全门) <br/>
                              -- WFS_SIU_VANDALSHIELD:2 (防护面罩门) <br/>
                              -- WFS_SIU_CABINET_FRONT:3 (前门) <br/>
                              -- WFS_SIU_CABINET_REAR:4 (后门) <br/>
                              -- WFS_SIU_CABINET_LEFT:5 (左门) <br/>
                              -- WFS_SIU_CABINET_RIGHT:6 (右门) <br/>
               * @param ChangeNum 值(获取传感器状态后与上一次比较变化位)
               * @param Change 中值，取值范围-1、0、1
               * @param SiuIndex  中值，取值范围0、1
               * @param TimeOut 超时时间（毫秒，默认1000毫秒）
               * @example nIndex: 0, ChangeNum: 6, Change: 0, SiuIndex: 0
               */

            }, {
              key: "SetDoorParam",
              value: function SetDoorParam(nIndex, ChangeNum, Change, SiuIndex) {
                var TimeOut = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1000;
                var param = {
                  nIndex: nIndex,
                  ChangeNum: ChangeNum,
                  Change: Change,
                  SiuIndex: SiuIndex,
                  TimeOut: TimeOut
                };
                return this.getInfo('SetDoorParam', param);
              }
              /**
               * 设置传感器参数列表（同步）
               * @param nIndex 传感器索引,取值如下：<br/>
                          -- WFS_SIU_OPERATORSWITCH:0 (维护开关) <br/>
                          -- WFS_SIU_TAMPER:1 (内部篡改传感器) <br/>
                          -- WFS_SIU_INTTAMPER:2 (内部篡改传感器) <br/>
                          -- WFS_SIU_SEISMIC:3 (震动传感器) <br/>
                          -- WFS_SIU_HEAT:4 (热传感器) <br/>
                          -- WFS_SIU_PROXIMITY:5 (人接近传感器) <br/>
                          -- WFS_SIU_AMBLIGHT:6 (环境光传感器) <br/>
                          -- WFS_SIU_ENHANCEDAUDIO:7 (音频传感器) <br/>
                          -- WFS_SIU_BOOT_SWITCH:8 (启动开关传感器) <br/>
                          -- WFS_SIU_CONSUMER_DISPLAY:9 (显示器改传感器) <br/>
                          -- WFS_SIU_OPERATOR_CALL_BUTTON:10 (操作员调用按钮传感器) <br/>
                          -- WFS_SIU_HANDSETSENSOR:11 (手持设备传感器) <br/>
                          -- WFS_SIU_GENERALINPUTPORT:12 (输入端口传感器) <br/>
               * @param ChangeNum 值(获取传感器状态后与上一次比较变化位)
               * @param Change 选项,取值如下： <br/>
                          -- -1:不使用 <br/>
                          -- 0: 维护开关默认(仅选择维护开关时有效) <br/>
                          -- 1: 维护开关指定(仅选择维护开关时有效) <br/>
               * @param SiuIndex  中值，取值范围0、1
               * @param TimeOut 超时时间（毫秒，默认1000毫秒）
               * @example nIndex: 5, ChangeNum: 6, Change: 0, SiuIndex: 0
               */

            }, {
              key: "SetSensorParam",
              value: function SetSensorParam(nIndex, ChangeNum, Change, SiuIndex) {
                var TimeOut = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1000;
                var param = {
                  nIndex: nIndex,
                  ChangeNum: ChangeNum,
                  Change: Change,
                  SiuIndex: SiuIndex,
                  TimeOut: TimeOut
                };
                return this.getInfo('SetSensorParam', param);
              }
              /**
               * 控制导向灯（同步）
               * @param nIndex 导向灯索引(取值范围0-31)
               * @param fwCommand 导向灯状态,取值如下： <br/>
                              -- 0: 关闭 <br/>
                              -- 4: 慢闪 <br/>
                              -- 8: 中闪 <br/>
                              -- 16: 快闪 <br/>
                              -- 128: 常亮 <br/>
               * @param TimeOut 超时时间（毫秒，默认1000毫秒）
               * @example nIndex: 0, fwCommand: 128
               */

            }, {
              key: "ControlGuidLight",
              value: function ControlGuidLight(nIndex, fwCommand) {
                var TimeOut = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
                var param = {
                  nIndex: nIndex,
                  fwCommand: fwCommand,
                  TimeOut: TimeOut
                };
                return this.getInfo('ControlGuidLight', param);
              }
              /**
               * 设置导向灯参数（同步）
               * @param nIndex 导向灯索引 ,取值如下： <br/>
                          -- WFS_SIU_CARDUNIT:0 (卡单元导向灯) <br/>
                          -- WFS_SIU_PINPAD:1 (密码键盘导向灯) <br/>
                          -- WFS_SIU_NOTESDISPENSER:2 (纸币出钞导向灯) <br/>
                          -- WFS_SIU_COINDISPENSER:3 (硬币出口导向灯) <br/>
                          -- WFS_SIU_RECEIPTPRINTER:4 (凭条导向灯) <br/>
                          -- WFS_SIU_PASSBOOKPRINTER:5 (存折导向灯) <br/>
                          -- WFS_SIU_ENVDEPOSITORY:6 (信封存储导向灯) <br/>
                          -- WFS_SIU_CHEQUEUNIT:7 (支票导向灯) <br/>
                          -- WFS_SIU_BILLACCEPTOR:8 (纸币入钞导向灯)2020/2/5 USetSIUTools <br/>
                          -- WFS_SIU_ENVDISPENSER:9 (信封入口导向灯) <br/>
                          -- WFS_SIU_DOCUMENTPRINTER:10 (文档打印机导向灯) <br/>
                          -- WFS_SIU_COINACCEPTOR:11 (硬币入口导向灯) <br/>
                          -- WFS_SIU_SCANNER:12 (扫描仪导向灯) <br/>
                          -- WFS_SIU_CHECKSCANNER:13 (二维码阅读器向灯) <br/>
                          -- WFS_SIU_FINGERPRINT:14 (指纹仪导向灯) <br/>
                          -- WFS_SIU_USBCONTROL:15 (USB通断电控制) <br/>
                          -- WFS_SIU_CAMERA:16 (摄像头补光灯) <br/>
                          -- WFS_SIU_HIGHCAMERA:17 (高拍仪指示灯) <br/>
                          -- WFS_SIU_CARDBOX:18 (发卡盒指示灯) <br/>
                          -- WFS_SIU_PASSBOOKREADER:19 (刷折器指示灯) <br/>
                          -- WFS_SIU_ENVELOPEDEPOSITORY:20 (强存模块指示灯) <br/>
                          -- WFS_SIU_NEWCOINACCEPTOR:21 (硬币存款模块指示灯) <br/>
                          -- WFS_SIU_NEWCOINDISPENSER:22 (硬币取款模块指示灯) <br/>
                          -- WFS_SIU_GL_023:23 (23号导向灯) <br/>
                          -- WFS_SIU_GL_024:24 (24号导向灯) <br/>
                          -- WFS_SIU_GL_025:25 (25号导向灯) <br/>
                          -- WFS_SIU_GL_026:26 (26号导向灯) <br/>
                          -- WFS_SIU_GL_027:27 (27号导向灯) <br/>
                          -- WFS_SIU_GL_028:28 (28号导向灯) <br/>
                          -- WFS_SIU_GL_029:29 (29号导向灯) <br/>
                          -- WFS_SIU_GL_030:30 (30号导向灯) <br/>
                          -- WFS_SIU_GL_031:31 (31号导向灯) <br/>
                  * @param nValue 导向灯参数配置值(对应SetSensorParam接口中的nIndex值)
                  * @param SiuIndex 取值范围0、1
                  * @example nIndex : 0, nValue: 12, SiuIndex: 0
               */

            }, {
              key: "SetGuidLightParam",
              value: function SetGuidLightParam(nIndex, nValue, SiuIndex) {
                var TimeOut = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;
                var param = {
                  nIndex: nIndex,
                  nValue: nValue,
                  SiuIndex: SiuIndex,
                  TimeOut: TimeOut
                };
                return this.getInfo('SetGuidLightParam', param);
              }
              /**
               * 控制指示灯/辅助指示灯（同步）
               * @param nIndex 索引,取值如下： <br/>
                          -- 0: LED100(红) <br/>
                          -- 1: LED101(绿) <br/>
                          -- 2: LED102(黄) <br/>
                          -- 3: LED201(招牌灯) <br/>
                          -- 4: 不使用(-1) <br/>
                          -- 5: H1(工作/故障指示灯) <br/>
                          -- 6: H2(脸部照明灯) <br/>
                          -- 7: H3(环境照明灯) <br/>
                          -- 8: H4(预留照明灯) <br/>
              * @param fwCommand 指示灯状态,取值如下： <br/>
                          -- 0: 关闭 <br/>
                          -- 1: 开启 <br/>
              * @param TimeOut 超时时间（毫秒）
              * @example nIndex: 0, fwCommand: 128
              */

            }, {
              key: "ControlIndiAux",
              value: function ControlIndiAux(nIndex, fwCommand) {
                var TimeOut = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
                var param = {
                  nIndex: nIndex,
                  fwCommand: fwCommand,
                  TimeOut: TimeOut
                };
                return this.getInfo('ControlIndiAux', param);
              }
              /**
               * 设置指示灯/辅助指示灯参数（同步）
               * @param nIndex 导向灯索引 ,取值如下： <br/>
                          -- WFS_SIU_CARDUNIT:0 (卡单元导向灯) <br/>
                          -- WFS_SIU_PINPAD:1 (密码键盘导向灯) <br/>
                          -- WFS_SIU_NOTESDISPENSER:2 (纸币出钞导向灯) <br/>
                          -- WFS_SIU_COINDISPENSER:3 (硬币出口导向灯) <br/>
                          -- WFS_SIU_RECEIPTPRINTER:4 (凭条导向灯) <br/>
                          -- WFS_SIU_PASSBOOKPRINTER:5 (存折导向灯) <br/>
                          -- WFS_SIU_ENVDEPOSITORY:6 (信封存储导向灯) <br/>
                          -- WFS_SIU_CHEQUEUNIT:7 (支票导向灯) <br/>
                          -- WFS_SIU_BILLACCEPTOR:8 (纸币入钞导向灯) <br/>
                          -- WFS_SIU_ENVDISPENSER:9 (信封入口导向灯) <br/>
                          -- WFS_SIU_DOCUMENTPRINTER:10 (文档打印机导向灯) <br/>
                          -- WFS_SIU_COINACCEPTOR:11 (硬币入口导向灯) <br/>
                          -- WFS_SIU_SCANNER:12 (扫描仪导向灯) <br/>
                          -- WFS_SIU_CHECKSCANNER:13 (二维码阅读器向灯) <br/>
                          -- WFS_SIU_FINGERPRINT:14 (指纹仪导向灯) <br/>
                          -- WFS_SIU_USBCONTROL:15 (USB通断电控制) <br/>
                          -- WFS_SIU_CAMERA:16 (摄像头补光灯) <br/>
                          -- WFS_SIU_HIGHCAMERA:17 (高拍仪指示灯) <br/>
                          -- WFS_SIU_CARDBOX:18 (发卡盒指示灯) <br/>
                          -- WFS_SIU_PASSBOOKREADER:19 (刷折器指示灯) <br/>
                          -- WFS_SIU_ENVELOPEDEPOSITORY:20 (强存模块指示灯) <br/>
                          -- WFS_SIU_NEWCOINACCEPTOR:21 (硬币存款模块指示灯) <br/>
                          -- WFS_SIU_NEWCOINDISPENSER:22 (硬币取款模块指示灯) <br/>
                          -- WFS_SIU_GL_023:23 (23号导向灯) <br/>
                          -- WFS_SIU_GL_024:24 (24号导向灯) <br/>
                          -- WFS_SIU_GL_025:25 (25号导向灯) <br/>
                          -- WFS_SIU_GL_026:26 (26号导向灯) <br/>
                          -- WFS_SIU_GL_027:27 (27号导向灯) <br/>
                          -- WFS_SIU_GL_028:28 (28号导向灯) <br/>
                          -- WFS_SIU_GL_029:29 (29号导向灯) <br/>
                          -- WFS_SIU_GL_030:30 (30号导向灯) <br/>
                          -- WFS_SIU_GL_031:31 (31号导向灯)
              * @param fwCommand 导向灯参数配置值,取值如下： <br/>
                          -- 0: LED100(红) <br/>
                          -- 1: LED101(绿) <br/>
                          -- 2: LED102(黄) <br/>
                          -- 3: LED201(招牌灯) <br/>
                          -- 4: 不使用(-1) <br/>
                          -- 5: H1(工作/故障指示灯) <br/>
                          -- 6: H2(脸部照明灯) <br/>
                          -- 7: H3(环境照明灯) <br/>
                          -- 8: H4(预留照明灯) <br/>
               * @param SiuIndex 取值范围0、1
               * @param TimeOut 超时时间（毫秒，默认1000毫秒）
               * @example nIndex: 1, fwCommand: 5, SiuIndex: 0
               */

            }, {
              key: "SetIndiAuxParam",
              value: function SetIndiAuxParam(nIndex, fwCommand, SiuIndex) {
                var TimeOut = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;
                return this.getInfo('SetIndiAuxParam', {
                  nIndex: nIndex,
                  fwCommand: fwCommand,
                  SiuIndex: SiuIndex,
                  TimeOut: TimeOut
                });
              }
            }]);

            return CSetSIUTools;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var setsiutools = (setsiutools_CSetSIUTools);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/foreigncurrencytaken.js






        /**
         * ForeignCurrencyTaken
         *
         * 事件列表
         * OnCleanOverEvent <br/>
         * 事件描述  <br/>
        全盘扫描完成事件,在调用FC_ScanAll方法后，返回全盘扫描并且抓取最新的存储槽信息的动作执行结果。  <br/>
        事件参数 <br/>
        [out] pszParam JSON串参数 <br/>
        "eventName":事件名称 <br/>
        "hResult": 全盘扫描并且抓取最新的存储槽信息的动作执行是否执行成功（0=成功，-14=硬 <br/>
        件故障，其他=其他原因导致复位失败）"usCount": 该模块拥有的存储槽个数，如36. <br/>
        "AllSlotsInfo": 所有槽位信息，JSON数组，数组内信息如下： <br/>
        CardInfo : 封包二维码信息（如“CR20193232323”） <br/>
        ReatinCardInfo: 超时回收回，扫描到二维码信息（如“CR20193232323”） <br/>
        Position: 该槽位所在位置（如“A01”） <br/>
        RestoreTime: 该槽位最近一次重新扫描的时间（如“20190325175523”） <br/>
        RetainTime: 该槽位上的封包最近一次发生超时忘取被回收的时间（“20190325175523”） <br/>
        fwIsRetained: 此包是否被超时忘取回收过 <br/>
        fwStatus: 该存储槽是否有封包。 <br/>
        0：存储槽没有存封包 <br/>
        1：存储槽存有封包 <br/>
        usNumber: 存储槽序号 <br/>
        OnFCDispenseOverEvent <br/>
        事件描述 <br/>
        整个发包流程的完成事件,在调用FC_Dispense方法后，返回发包流程整体结束的详细情况。事件参数 <br/>
        [out] pszParam JSON串参数 <br/>
        "eventName":事件名称 <br/>
        hResult 将指定包（输入二维码信息）发到通道，并且进行扫描，比对输入的二维码信息和扫 <br/>
        描到的二维码信息是否一致（0=成功发包到出包口，并被拿走，并且最后成功将空抽屉返回 <br/>
        原位；-14=硬件故障；其他=发包整体过程中出现了失败） <br/>
        OnFCDispenseToTansportOver <br/>
        事件描述 <br/>
        发包到通道的完成事件。在调用FC_Dispense方法后，返回发送到通道并扫描二维码的情况。 <br/>
        事件参数 <br/>
        [out] pszParam JSON串参数"EnvelopInfor" 当封包成功发到通道，但两者二维码不一致（既hResult = -259）时，返回的 <br/>
        实际扫描到的二维码信息 <br/>
        "wType" 当封包成功发到通道，但两者二维码不一致（既hResult = -259）时,返回信息的类型 <br/>
        （0=存储位置，1=封包的二维码信息） <br/>
        "eventName":事件名称 <br/>
        "hResult": 将指定包（输入二维码信息）发到通道，并且进行扫描，比对输入的二维码信息和 <br/>
        扫描到的二维码信息是否一致（0=成功发到通道并且两个二维码一致；-259=成功发到通 <br/>
        道，但两者二维码不一致；其他=发包到通道失败）. <br/>
        OnEjectOutSucess <br/>
        事件描述 <br/>
        成功退包到出包口，并且成功打开阀门的完成事件。在调用 FC_Dispense方法后，返回退包并关 <br/>
        闭阀门的动作执行情况。 <br/>
        事件参数此事件无输出参数（既输出参数为“”），只要收到该事件，即可认为成功退包到出包口，并且 <br/>
        成功打开了阀门. <br/>
        OnEjectOutFailed <br/>
        事件描述 <br/>
        退包到出包口，并且打开阀门的完成事件。在调用FC_Dispense方法后，返回退包并关闭阀门的 <br/>
        动作执行情况。 <br/>
        事件参数 <br/>
        [out] pszParam JSON串参数 <br/>
        "hResult": 退包的执行结果（0=成功退包到出包口，并且打开阀门，-257=成功退包到出包 <br/>
        口，但打开阀门失败，-14=硬件未连接或其他硬件故障导致退包失败，其他=退包到出包口失 <br/>
        败）。 <br/>
        OnFCRestoreEvent <br/>
        事件描述 <br/>
        将未发出的包送回原位的完成事件。在调用FC_RestoreBox方法后，返回存储盘还原的情况。 <br/>
        事件参数 <br/>
        hResult 存储盘送回原位的完成情况（0=成功完成将存储盘返回原位，-257 =因关闭阀门导致还原 <br/>
        失败 ，其他=硬件故障）。 <br/>
        OnFCCaptureEmptyBoxEvent <br/>
        事件描述 <br/>
        客户成功取走封包后，将空存储盘放回原位的完成事件。在调用 FC_Dispense方法后，返回将空 <br/>
        存储盘放回原位动作执行的情况。 <br/>
        事件参数"hResult": 空存储盘送回原位的完成情况（0=成功完成将存储盘返回原位，-257 =因关闭阀门导致 <br/>
        还原失败 ，其他=硬件故障）。 <br/>
        OnFCCaptureImpurityEvent <br/>
        事件描述 <br/>
        客户成功取走封包后，又重新向盘中放入了异物，此时再将存储盘放回原位的完成事件。在调用 <br/>
        FC_Dispense方法后，返回将空存储盘放回原位动作执行的情况。 <br/>
        事件参数 <br/>
        [out] pszParam JSON串参数 <br/>
        "hResult": 空存储盘送回原位的完成情况（0=成功完成将存储盘返回原位，-257 =因关闭阀门 <br/>
        导致还原失败 ，其他=硬件故障）。 <br/>
        OnWaitForTakenTimeout <br/>
        事件描述 <br/>
        等待客户将封包拿走的超时事件。在调用FC_Dispense方法后，成功将包送出，但是客户在设置 <br/>
        时间内并未取包。 <br/>
        事件参数 <br/>
        此事件无输出参数（既输出参数为""），只要收到该事件，即可认为等待客户将封包拿走时，发 <br/>
        生了超时； <br/>
        OnFCCaptureForgottenBoxInvaliedMedia <br/>
        事件描述 <br/>
        超时忘取回收的盒子返回未扫描到二维码事件。在调用FC_Dispense方法后，成功将包送出，但 <br/>
        是客户在设置时间内并未取包，触发超时忘取回收机制，但是回收扫描的过程中，发现传送小车 <br/>
        上存储盒中的封包二维码无法识别。事件参数 <br/>
        此事件无输出参数（既输出参数为“”），只要收到该事件，即可认为超时忘取回收盒子时，未扫描 <br/>
        到二维码； <br/>
        OnFCCaptureForgottenBoxNoMedia <br/>
        事件描述 <br/>
        超时忘取回收过程中，发现回收的盒子中未检测到有包。 <br/>
        在调用FC_Dispense方法后，成功将包送出，但是客户在设置时间内并未取包，触发超时忘取回 <br/>
        收机制，但是回收扫描的过程中，发现传送小车上存储盒中的并无封包。 <br/>
        事件参数 <br/>
        此事件无输出参数（既输出参数为“”），只要收到该事件，即可认为超时忘取回收盒子时，发现回 <br/>
        收的盒子中未检测到有包；OnFCCaptureForgottenBoxShutterBlocked <br/>
        事件描述 <br/>
        超时忘取回收的盒子过程，发生阀门阻塞的事件。 <br/>
        在调用FC_Dispense方法后，成功将包送出，但是客户在设置时间内并未取包，触发超时忘取回 <br/>
        收机制，但是回收扫描的过程中，发现因防夹手导致阀门无法关闭。 <br/>
        事件参数 <br/>
        此事件无输出参数（既输出参数为“”），只要收到该事件，即可认为超时忘取回收盒子，进行关闭 <br/>
        阀门时被手阻塞； <br/>
        OnFCCaptureForgottenBoxSuccess <br/>
        事件描述 <br/>
        超时忘取回收的盒子被回收成功的事件。 <br/>
        在调用FC_Dispense方法后，成功将包送出，但是客户在设置时间内并未取包，触发超时忘取回收机制，盒子和封包被成功回收 <br/>
        事件参数 <br/>
        此事件无输出参数（既输出参数为“”），只要收到该事件，即可认为超时忘取回收盒子，将封包及 <br/>
        活动抽屉返回到原位； <br/>
        OnFCEnvelopTakenEvent <br/>
        事件描述 <br/>
        发包到出包口，客户成功取走封包的事件。 <br/>
        在调用FC_Dispense方法后，封包成功退至发包口并打开阀门，最终客户将封包成功取走。 <br/>
        事件参数 <br/>
        此事件无输出参数（既输出参数为“”），只要收到该事件，即可认为客户已经成功将封包拿走。 <br/>
        OnFCModuleResetOverEvent <br/>
        事件描述 <br/>
        模块整体复位的事件。 <br/>
        在调用FC_RestModule方法后，返回模块整体复位的情况。 <br/>
        事件参数 <br/>
        [out] pszParam JSON串参数 <br/>
        hResult 模块整体的动作是否执行成功（0=成功，-14=硬件故障，其他=其他原因导致复位失 <br/>
        败）。 <br/>
        错误编码 <br/>
        -999 找不到设备服务，原因设备服务名不存在 <br/>
        -998 无法连接到设备服务，或设备服务未打开-1 应用已经调用过WFSStartUp并且之后并未调用WFSCleanUp <br/>
        -2 应用要求的XFS API版本过高 <br/>
        -3 应用要求的XFS API版本过低 <br/>
        -4 请求被取消 <br/>
        -5 hKey并未对应当前打开的key(注册表项) <br/>
        -6 在当前的key中不存在指定的lpszValueName(键名) <br/>
        -7 在当前的key中不存在指定的lpszSubKey(子键) <br/>
        -8 在当前的key中不存在指定的键值 <br/>
        -9 待删除的key包含子键,无法删除 <br/>
        -10 返回的键名字符串的长度超过了缓存的长度 <br/>
        -11 本项已经为最后一项,没有下一项 <br/>
        -12 返回的键值数据的长度超过了缓存的长度 <br/>
        -13 函数必须的设备访问，但设备尚未准备好或已超时 <br/>
        -14 函数必须的设备访问，但设备出错 <br/>
        -15 XFS子系统内发生的内部不一致或其他异常错误 <br/>
        -16 lpvOriginal地址参数错误,未指向上次申请的缓存 <br/>
        -17 无效的应用句柄(例如由不当的函数调用顺序引起) <br/>
        -18 lpvData参数未指向一个申请的缓存结构 <br/>
        -19 当前的服务类(service class)不支持dwCategory参数-20 当前的服务类不支持发出的dwCommand <br/>
        -21 当前的服务类不支持dwEventClass指定的一个或多个事件类 <br/>
        -22 hService参数是无效的服务句柄 <br/>
        -23 hProvider参数是无效的Provier句柄 <br/>
        -24 hWnd参数是无效的窗口句柄 <br/>
        -25 hWndReg参数是无效的窗口句柄 <br/>
        -26 指针参数不指向可访问内存 <br/>
        -27 RequestID参数不符合对服务的未处理请求 <br/>
        -28 lpResult参数不是一个指向WFSRESULT结构的指针 <br/>
        -29 SP的文件无效或损坏 <br/>
        -30 hWnd与usTimerID没有对应当前活动的timer <br/>
        -31 dwTraceLevel参数的值为无效值 <br/>
        -32 服务被另一个hService锁定 <br/>
        -33 调用被阻塞 <br/>
        -34 SP的文件不存在 <br/>
        -35 指定的线程不存在 <br/>
        -36 timer创建失败 <br/>
        -37 应用请求解锁,而此设备并未被加锁 <br/>
        -38 XFS卸载SP DLL失败-39 应用程序此前还没有成功的执行WFSStartUp <br/>
        -40 hWndReg窗口没有指定接收任何事件类 <br/>
        -41 在该线程上有一个阻塞操作正在进行；此时只允许WFSCancelBlockingCall和 <br/>
        WFSIsBlocking <br/>
        -42 申请的空间不足 <br/>
        -43 逻辑名无效 <br/>
        -44 SPI版本过高 <br/>
        -45 SPI版本过低 <br/>
        -46 应用请求的服务版本过高 <br/>
        -47 应用请求的服务版本过低 <br/>
        -48 超时周期到期 <br/>
        -49 dwCategory虽然有效,但不被SP支持 <br/>
        -50 尽管发出的dwCommand对此服务类别有效，但此服务提供程序或设备不支持发出的 <br/>
        dwCommand <br/>
        -51 服务中的两个模块版本不匹配 <br/>
        -52 输入参数中包含无效数据 <br/>
        -53 函数必须的配置信息访问，但软件出错 <br/>
        -54 与服务的连接丢失 <br/>
        -55 用户在阻止设备的正确操作-56 尽管作为输入参数传递的数据结构对此服务类别有效，但此服务提供程序或设备不支持 <br/>
        该数据结构 <br/>
        -57 一些设备能够识别试图欺骗获得重要信息或媒介的恶意物理攻击。在这些情况下，将返 <br/>
        回此错误代码，显示用户试图对该设备采取欺骗行为 <br/>
        -58 此时被请求的操作无效，或在设备当时的状态下，被请求的操作无效 <br/>
        -200 WFS_ERR_IDC_MEDIAJAM 介质发生阻塞 请人工清除封包阻塞的情况后，再进行其 <br/>
        他操作 <br/>
        -201 WFS_ERR_IDC_NOMEDIA 通道中无介质 弹封包或吞封包之前，请先确保通道中有介 <br/>
        质存在 <br/>
        -202 WFS_ERR_IDC_MEDIARETAINED 介质在尝试弹出之前已经被吞入吞封包箱 <br/>
        -203 WFS_ERR_IDC_RETAINBINFULL 吞封包箱已满 请清空吞封包箱后再进行其他操作 <br/>
        -204 WFS_ERR_IDC_INVALIDDATA 传入的数据无效 请检查输入的数据 <br/>
        -205 WFS_ERR_IDC_INVALIDMEDIA 插入的介质无效或者介质没有读到信息 请检查介质是 <br/>
        否有效，确保介质有效的情况下，检查封包机是否正常 <br/>
        -206 WFS_ERR_IDC_FORMNOTFOUND 指定的FORM未找到 检查FORM文件 <br/>
        -207 WFS_ERR_IDC_FORMINVALID 指定的FORM无效 检查FORM文件 <br/>
        -208 WFS_ERR_IDC_DATASYNTAX lpstrTrackData 指定的数据语法错误或者与表单定义不 <br/>
        一致 检查指定的数据是否合法-209 WFS_ERR_IDC_SHUTTERFAIL 由于操作失误或者硬件故障，而未能成功打开或关闭 <br/>
        封包口 需要操作人员的干预 <br/>
        -210 WFS_ERR_IDC_SECURITYFAIL 安全模式没能成功读取封包的安全标识。 检查介质是 <br/>
        否有安全标识或设备的安全模块是否正常 <br/>
        -218 WFS_ERR_IDC_INVALID_PORT 端口无效 <br/>
        -219 WFS_ERR_IDC_POWERSAVETOOSHORT 因设备不能从指定的带有 <br/>
        usMaxPowerSaveRecoveryTime值的省电模式下恢复，省电模式未被激活 检查模块是否支 <br/>
        持省电模式 <br/>
        -220 WFS_ERR_IDC_POWERSAVEMEDIAPRESENT 在有介质在通道的时候就尝试进入省 <br/>
        电模式 请先将介质处理（退出或吞掉），再进入省电模式 <br/>
        -259 WFS_ERR_MCR_CODENOTMATCH 发包时，上层传入的二维码信息与取到的封包二 <br/>
        维码信息不一致 <br/>
        -256 WFS_ERR_MCR_SHUTTERBLOCKED 超时忘取，触发回收机制专用吞包接口，关闭 <br/>
        阀门，触发夹手错误 <br/>
        WFS_ERR_IDC_INVALIDMEDIA 时忘取，触发回收机制专用吞包接口。关闭阀门，回收扫 <br/>
        描时，发现有包但扫描失败 <br/>
        -251 WFS_ERR_MCR_NOMEDIA 时忘取，触发回收机制专用吞包接口。关闭阀门，回收扫 <br/>
        描时，发现无包 <br/>
        -260 WFS_ERR_MCR_CAPTUREIMPURITY 回收空盘时，发现托盘上存在异物 <br/>
         */

        var foreigncurrencytaken_CForeignCurrencyTaken =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(CForeignCurrencyTaken, _CBaseDev);

            function CForeignCurrencyTaken(serviceName, devName) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, CForeignCurrencyTaken);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(CForeignCurrencyTaken).call(this, serviceName, devName));
              _this.events = {
                /**
                 * 设备超时
                 * @param param
                 */
                'Timeout': function Timeout(param) {
                  this.dispatchEvent('Timeout', param);
                },

                /**
                 * 设备故障
                 * @param param
                 */
                'DeviceError': function DeviceError(param) {
                  this.dispatchEvent('DeviceError', param);
                },

                /**
                 * 收到错误信息
                 * @param param
                 */
                'ErrorInfoReceived': function ErrorInfoReceived(param) {
                  this.dispatchEvent('ErrorInfoReceived', param);
                },

                /**
                 * 状态改变
                 * @param param
                 */
                'StatusChanged': function StatusChanged(param) {
                  this.dispatchEvent('StatusChanged', param);
                }
              };
              return _this;
            }
            /**
             * 模块复位（异步）
             * @param TimeOut 超时时间（毫秒）
             * @example
             * @emits OnFCModuleResetOverEvent
             */


            Object(createClass["a" /* default */ ])(CForeignCurrencyTaken, [{
              key: "FC_RestModule",
              value: function FC_RestModule(TimeOut) {
                var param = {
                  TimeOut: TimeOut
                };
                return this.execute('FC_RestModule', param);
              }
              /**
               * 获取该模块的所有封包槽信息状态(同步)
               * @returns "hResult": 获取该模块的所有状态和能力的执行结果；0或99：方法执行成功，其他：方法执 <br/>
                          行失败，如-14表示硬件故障，-15表示内部软件错误 <br/>
                          "usCount": 该模块拥有的存储槽个数,取值：整型. <br/>
                          "AllSlotsInfo": 所有槽位信息，JSON数组，数组内信息如下： <br/>
                          CardInfo : 封包二维码信息（如“CR20193232323”） <br/>
                          ReatinCardInfo: 超时回收回，扫描到二维码信息（如“CR20193232323”） <br/>
                          Position: 该槽位所在位置（如“A01”） <br/>
                          RestoreTime: 该槽位最近一次重新扫描的时间（如“20190325175523”） <br/>
                          RetainTime: 该槽位上的封包最近一次发生超时忘取被回收的时间（“20190325175523”） <br/>
                          fwIsRetained: 此包是否被超时忘取回收过 <br/>
                          fwStatus: 该存储槽是否有封包。0：存储槽没有存封包 <br/>
                          1：存储槽存有封包 <br/>
                          usNumber: 存储槽序号 <br/>
                          0： 成功；<0：错误编码
               * @example
               */

            }, {
              key: "FC_GeAllSlotsInforSync",
              value: function FC_GeAllSlotsInforSync() {
                var param = {};
                return this.getInfo('FC_GeAllSlotsInforSync', param);
              }
              /**
               * 进行全盘扫描，并且扫描完成后，返回最新的封包槽信息。（异步）
               * @param TimeOut 超时时间（毫秒）
               * @example
               * @emits OnCleanOverEvent
               */

            }, {
              key: "FC_ScanAll",
              value: function FC_ScanAll(TimeOut) {
                var param = {
                  TimeOut: TimeOut
                };
                return this.execute('FC_ScanAll', param);
              }
              /**
               * 整体发包接口，详细步骤可以区分为： <br/>
                  第一步：将指定的封包发到通道并进行扫描，将扫描到的信息与传入的信息比对，如一致，则返回成功；如两者不一致，返回扫描到的二维码。 <br/>
                  第二步：将包退到客户区，并且自动打开阀门（应用输入等待客户拿走的超时时间）后，发送OnEjectOutSucess事件，等待客户拿走； <br/>
                  第三步：如在设定的超时时间范围内，客户取走并手离开，发送OnFCEnvelopTakenEvent事件， <br/>
                  此时应用可提示等待设备结束发包中，硬件将空盘存回原位后，会发送OnFCCaptureEmptyBoxEvent事件；如在设定的超时时间范围内，客户忘记取包，会发送OnWaitForTakenTimeout事件； <br/>
                  而后开始关闭阀门，将回收的封包再次扫描二维码，并记录，最终将封包返回原位，如此过程均成功，发送OnFCCaptureForgottenBoxSuccess事件，如超时回收过程中，发现存包已被拿走， <br/>
                  发送事件OnFCCaptureForgottenBoxNoMedia，如超时回收过程中，发现存包二维码无法识别，发送事件OnFCCaptureForgottenBoxInvaliedMedia，如超时回收过程中，因阀门被挡住而导致无 <br/>
                  法回收，发送OnFCCaptureForgottenBoxShutterBlocked事件 <br/>
               * @param DataType 输入信息的类型（0=存储位置，1=封包的二维码信息）
               * @param FCash 待取出的封包信息，如："CR20193232323"
               * @param TimeOutForTaken 等待客户拿走的超时时间（单位为毫秒，如60000）
               * @param TimeOut 超时时间（毫秒）
               * @example DataType： 0, FCash: "CR20193232323"， TimeOutForTaken: 600000
               * @emits OnFCDispenseOverEvent,OnFCEjectOverEvent,OnFCEnvelopTakenEvent,OnFCCaptureEmptyBoxEvent,OnWaitForTakenTimeout,OnFCCaptureForgottenBoxSuccess,OnFCCaptureForgottenBoxNoMedia,OnFCCaptureForgottenBoxInvaliedMedia,OnFCCaptureForgottenBoxShutterBlocked
               * @returns hResult 异步发包的动作下发结果；0：方法下发成功，其他：方法下发失败，-15表示内部软件错误；该发包动作的真实执行结果请以异步完成事件为准。
               */

            }, {
              key: "FC_Dispense",
              value: function FC_Dispense(DataType, FCash, TimeOutForTaken, TimeOut) {
                var param = {
                  DataType: DataType,
                  FCash: FCash,
                  TimeOutForTaken: TimeOutForTaken,
                  TimeOut: TimeOut
                };
                return this.execute('FC_Dispense', param);
              }
              /**
               * 将存储盘放回原位（异步）
               * @param TimeOut 超时时间（毫秒）
               * @example
               * @emits OnFCRestoreEvent
               */

            }, {
              key: "FC_RestoreBox",
              value: function FC_RestoreBox(TimeOut) {
                var param = {
                  TimeOut: TimeOut
                };
                return this.execute('FC_RestoreBox', param);
              }
            }]);

            return CForeignCurrencyTaken;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var foreigncurrencytaken = (foreigncurrencytaken_CForeignCurrencyTaken);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/nhmakecard.js






        /**
         * 社保制卡
         */

        var nhmakecard_NHMAKECARD =
          /*#__PURE__*/
          function (_CBaseDev) {
            Object(inherits["a" /* default */ ])(NHMAKECARD, _CBaseDev);

            function NHMAKECARD(serviceName, devName) {
              var _this;

              Object(classCallCheck["a" /* default */ ])(this, NHMAKECARD);

              _this = Object(possibleConstructorReturn["a" /* default */ ])(this, Object(getPrototypeOf["a" /* default */ ])(NHMAKECARD).call(this, serviceName, devName));
              _this.events = {
                /**
                 * 制卡返回的事件
                 * @param param  data：制卡结果描述  result:执行结果，0表示成功，其他失败
                 */
                'iWriteOver': function iWriteOver(param) {
                  this.dispatchEvent('iWriteOver', param);
                }
              };
              return _this;
            }
            /**
             * 制卡接口
             * @param iHtml 卡管接口地址串
             * @param iUser 卡管分配的接口用户
             * @param iPass 卡管分配的接口密码
             * @param iOprt 复合参数
             * @param iAAB301 发卡城市
             * @param iAAC002 社会保障号
             * @param iIprt 打印参数项
             */


            Object(createClass["a" /* default */ ])(NHMAKECARD, [{
              key: "iWrite",
              value: function iWrite(iHtml, iUser, iPass, iOprt, iAAB301, iAAC002, iIprt) {
                var param = {
                  iHtml: iHtml,
                  iUser: iUser,
                  iPass: iPass,
                  iOprt: iOprt,
                  iAAB301: iAAB301,
                  iAAC002: iAAC002,
                  iIprt: iIprt
                };
                return this.execute('iWrite', param);
              }
            }]);

            return NHMAKECARD;
          }(basedev["a" /* default */ ]);

        /* harmony default export */
        var nhmakecard = (nhmakecard_NHMAKECARD);
        // EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/typeof.js
        var esm_typeof = __webpack_require__("7618");

        // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.to-string.js
        var es6_regexp_to_string = __webpack_require__("6b54");

        // EXTERNAL MODULE: ./node_modules/core-js/modules/es7.array.includes.js
        var es7_array_includes = __webpack_require__("6762");

        // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.includes.js
        var es6_string_includes = __webpack_require__("2fdb");

        // EXTERNAL MODULE: ./node_modules/core-js/modules/es6.reflect.own-keys.js
        var es6_reflect_own_keys = __webpack_require__("c698");

        // CONCATENATED MODULE: ./src/platform/kernel/device/promise-wrapper/promise-wrapper.js







        /**
         * @file promise-wrapper.js
         */
        var promiseWrapper = {
          /**
           * @description 通过promise封装函数
           * @param procedure 函数
           * @param object 所属对象
           * @param procName 函数名称
           */
          PromiseProcedure: function PromiseProcedure(procedure, object, procName) {
            return function () {
              var key = procName;
              var args = Array.prototype.slice.apply(arguments);
              return new Promise(function (resolve, reject) {
                args.push(function (error, response) {
                  if (response) resolve(response);
                  else reject(error);
                });
                object[key].apply(object, args);
              });
            };
          },

          /**
           * @description promise封装器，将object中的函数添加Promise方法
           * object函数必须满足第一个函数为回调函数，且其参数为(error, success)，
           * 封装后的方法名为：原方法名+Await
           * @param object 需要被封装的对象
           * @param filters 过滤器，所在过滤其中的函数不会被封装成Promise方法
           * @returns true封装成功，false，不支持Promise,封装失败
           */
          PromiseWrapper: function PromiseWrapper(object, filters) {
            if (Promise) {
              var i;
              var i;

              var _ret = function () {
                filters = filters || ['constructor'];
                var keys = Reflect.ownKeys(object); // Object.keys(object);

                for (i = 0; i < keys.length; i++) {
                  if (filters.includes(keys[i])) continue;

                  (function (key) {
                    if (typeof object[keys[i].toString()] === "function") {
                      object[keys[i].toString() + "Await"] = promiseWrapper.PromiseProcedure(object[keys[i].toString()], object, key);
                    }
                  })(keys[i].toString());
                }

                var protoObj = object.__proto__;
                var protoKeys = Reflect.ownKeys(protoObj);

                for (i = 0; i < protoKeys.length; i++) {
                  if (protoKeys[i].toString().indexOf("Await") >= 0) continue;
                  if (filters.includes(protoKeys[i])) continue;

                  (function (key) {
                    if (typeof protoObj[protoKeys[i].toString()] === "function") {
                      object[protoKeys[i].toString() + "Await"] = promiseWrapper.PromiseProcedure(protoObj[protoKeys[i].toString()], object, key);
                    }
                  })(protoKeys[i].toString());
                }

                return {
                  v: true
                };
              }();

              if (Object(esm_typeof["a" /* default */ ])(_ret) === "object") return _ret.v;
            } else {
              return false;
            }
          },

          /**
           * @description 预定义对象过滤器
           */
          XfsFilters: ['constructor', 'staticSuccessCallback', 'staticFailedCallback', 'addEventListener', 'transformEventMapping', 'removeEventListener', 'dispatchEvent', 'triggerEvent', 'devExtend', 'onEvent', 'onError', 'toString']
        }; // /**
        //  * @description 判断数组是否包含某一元素
        // */
        // (Array as any).prototype.contains = function(obj) {
        //     var i = this.length;
        //     while (i--) {
        //         if (this[i] === obj) {
        //             return true;
        //         }
        //     }
        //     return false;
        // }

        var PromiseProcedure = promiseWrapper.PromiseProcedure;
        var promise_wrapper_PromiseWrapper = promiseWrapper.PromiseWrapper;
        var XfsFilters = promiseWrapper.XfsFilters;

        /* harmony default export */
        var promise_wrapper = (promiseWrapper);
        // CONCATENATED MODULE: ./src/platform/kernel/device/modules/module-quoter.js


























        /**
         * 设备对象池
         */

        var devPool = {
          /**
           * 条码(二维码)扫描器
           */
          barcode: new barcode('Barcode', 'barcode', -1),

          /**
           * 1号读卡器
           */
          magcard: new cardreader["a" /* default */ ]('CardReader', 'magcard', WFS_SIU_GUIDLIGHTS.WFS_SIU_CARDUNIT),

          /**
           * 2号读卡器
           */
          magcardex: new cardreader["a" /* default */ ]('CardReaderEx', 'magcardex', WFS_SIU_GUIDLIGHTS.WFS_SIU_CARDUNIT_EX),

          /**
           * psam卡阅读模块
           */
          psamcardreader: new cardreader["a" /* default */ ]('PSAMCardReader', 'psamcardreader', -1),

          /**
           * 1号发卡器
           */
          crdcard: new carddispenser('CardDispenser', 'crdcard', WFS_SIU_GUIDLIGHTS.WFS_SIU_CARDUNIT),

          /**
           * 2号发卡器
           */
          crdcardex: new carddispenser('CardDispenserEx', 'crdcardex', WFS_SIU_GUIDLIGHTS.WFS_SIU_CARDUNIT_EX),

          /**
           * 非接读卡器
           */
          rfcard: new cardreader["a" /* default */ ]('RFCardReader', 'rfcard', -1),

          /**
           * 刷卡器
           */
          stripecard: new cardreader["a" /* default */ ]('StripeCardReader', 'stripecard', WFS_SIU_GUIDLIGHTS.WFS_SIU_STRIPECARD),

          /**
           * 身份证阅读器(非接触式或插入式)
           */
          idcard: new cardreader["a" /* default */ ]('IDCardReader', 'idcard', WFS_SIU_GUIDLIGHTS.WFS_SIU_IDCARD),

          /**
           * 凭条打印机
           */
          receipt: new printer('ReceiptPrinter', 'receipt', WFS_SIU_GUIDLIGHTS.WFS_SIU_RECEIPTPRINTER),

          /**
           * 流水打印机
           */
          journal: new printer('JournalPrinter', 'journal', -1),

          /**
           * 存折打印机
           */
          passbook: new printer('Passbook', 'passbook', WFS_SIU_GUIDLIGHTS.WFS_SIU_PASSBOOKPRINTER),

          /**
           * 普通激光打印机
           */
          baselaserprint: new printer('HtmPrinter', 'baselaserprint', WFS_SIU_GUIDLIGHTS.WFS_SIU_DOCUMENTPRINTER),

          /**
           * 回单激光打印机
           */
          laserprint: new laserprinter["a" /* default */ ]('HtmPrinter', 'laserprint', WFS_SIU_GUIDLIGHTS.WFS_SIU_DOCUMENTPRINTER),

          /**
           * 密码键盘
           */
          pinpad: new pinpad('Encryptor', 'pinpad', WFS_SIU_GUIDLIGHTS.WFS_SIU_PINPAD),

          /**
           * 摄像头
           */
          camera: new camera('Camera', 'camera', -1),

          /**
           * 高拍仪
           */
          highcamera: new camera('HighCamera', 'highcamera', -1),

          /**
           * 指纹仪
           */
          fingerscanner: new fingerscanner('FingerScanner', 'fingerscanner', WFS_SIU_GUIDLIGHTS.WFS_SIU_FINGERSCANNER),

          /**
           * 指静脉
           */
          fingerveinscanner: new fingerscanner('FingerVeinScanner', 'fingerveinscanner', WFS_SIU_GUIDLIGHTS.WFS_SIU_FINGERSCANNER),

          /**
           * UKEY读取模块
           */
          ukeyreader: new ukeyreader('UKeyReader', 'ukeyreader', -1),

          /**
           * UKEY发放模块
           */
          ukeydispenser: new ukeydispenser('UKeyDispenser', 'ukeydispenser', WFS_SIU_GUIDLIGHTS.WFS_SIU_UKEY),

          /**
           *电子令牌读取模块
           */
          ukeyreaderex: new ukeyreader('UKeyReaderEx', 'ukeyreaderex', -1),

          /**
           * 电子令牌发放模块
           */
          ukeydispenserex: new ukeydispenser('UKeyDispenserEx', 'ukeydispenserex', WFS_SIU_GUIDLIGHTS.WFS_SIU_UKEY),

          /**
           * 电子签名
           */
          tablet: new tablet('Tablet', 'tablet', -1),

          /**
           * 存单(支票)发放模块
           */
          checkprinter: new check('CheckDispenser', 'checkprinter', WFS_SIU_GUIDLIGHTS.WFS_SIU_CHEQUEUNIT),

          /**
           * 存单(支票)受理模块
           */
          checkscanner: new check('CheckScanner', 'checkscanner', WFS_SIU_GUIDLIGHTS.WFS_SIU_BILLACCEPTOR),

          /**
           * 纸币存款模块
           */
          cashacceptor: new cashacceptor('CashAcceptor', 'cashacceptor', WFS_SIU_GUIDLIGHTS.WFS_SIU_NOTESDISPENSER),

          /**
           * 纸币出钞模块
           */
          cashdispenser: new cashdispenser('CashDispenser', 'cashdispenser', WFS_SIU_GUIDLIGHTS.WFS_SIU_NOTESDISPENSER),

          /**
           * 硬币存款模块
           */
          coinacceptor: new cashacceptor('CoinAcceptor', 'coinacceptor', WFS_SIU_GUIDLIGHTS.WFS_SIU_COINACCEPTOR),

          /**
           * 硬币出钞模块
           */
          coindispenser: new cashdispenser('CoinDispenser', 'coindispenser', WFS_SIU_GUIDLIGHTS.WFS_SIU_COINDISPENSER),

          /**
           * 指示灯和传感器
           */
          siu: new siu('SensorsAndIndicators', 'siu'),

          /**
           * 后台控制器
           */
          ttu: new ttu('OperatorPanel', 'ttu'),

          /**
           * 制卡读卡器
           */
          cardprinteridc: new cardreader["a" /* default */ ]('CardPrinterIDC', 'cardprinteridc', WFS_SIU_GUIDLIGHTS.WFS_SIU_CARDUNIT),

          /**
           * 制卡发卡器
           */
          cardprintercrd: new carddispenser('CardPrinterCRD', 'cardprintercrd', WFS_SIU_GUIDLIGHTS.WFS_SIU_CARDUNIT_EX),

          /**
           * 制卡打印机
           */
          cardprinterptr: new printer('CardPrinterPTR', 'cardprinterptr', WFS_SIU_GUIDLIGHTS.WFS_SIU_RECEIPTPRINTER),

          /**
           * 乱序读卡器
           */
          disorderidc: new cardreader["a" /* default */ ]('DisorderIDC', 'disorderidc', WFS_SIU_GUIDLIGHTS.WFS_SIU_CARDUNIT),

          /**
           * 乱序发卡器
           */
          disordercrd: new carddispenser('DisorderCRD', 'disordercrd', WFS_SIU_GUIDLIGHTS.WFS_SIU_CARDUNIT_EX),

          /**anychat 控件封装 */
          videochat: new videochat('VideoChat', 'videochat'),

          /** uchat 视频通话*/
          uchat: new uchat('UChat', 'uchat'),

          /** uplay 视频播放*/
          uplay: new uplay('UPlay', 'uplay'),

          /** dws 快递扫描*/
          dws: new dws('Dwscan', 'dws', -1),

          /**  siu设置工具 */
          setsiutools: new setsiutools('SetSIUTools', 'setsiutools'),

          /** 外币模块*/
          foreigncurrencytaken: new foreigncurrencytaken('ForeignCurrencyTaken', 'foreigncurrencytaken'),

          /** 社保制卡*/
          nhmakecard: new nhmakecard('NHMakeCard', 'nhmakecard')
        };

        for (var key in devPool) {
          if (devPool.hasOwnProperty(key)) {
            var module_quoter_element = devPool[key];
            promise_wrapper_PromiseWrapper(module_quoter_element, XfsFilters);
          }
        }
        /**
         * 全局引用
         * @param devName 设备对象名
         */


        function _$(devName) {
          return devPool[devName];
        }
        /**
         * 挂载到window对象
         */


        window._$ = _$;
        /**
         * 注册事件
         * @param obj
         * @param ready
         * @param target
         */

        function eventListener(obj, ready, target) {
          if (obj) {
            for (var p in obj) {
              target ? target[p] = obj[p] : window[p] = obj[p];
            }
          }

          ready.apply(target || window, []);
        }
        /**
         * 类定义池
         */


        var classPool = {
          /**
           * 设备模块基类
           */
          CBaseDev: basedev["a" /* default */ ],

          /**
           * 条码类
           */
          CBarcode: barcode,

          /**
           * 读卡类
           */
          CCardReader: cardreader["a" /* default */ ],

          /**
           * 发卡类
           */
          CCardDispenser: carddispenser,

          /**
           * 打印类
           */
          CPrinter: printer,

          /**
           * 密码键盘类
           */
          CPinPad: pinpad,

          /**
           * 摄像头类
           */
          CCamera: camera,

          /**
           * 指纹类
           */
          CFingerScanner: fingerscanner,

          /**
           * UKey 读卡类
           */
          CUKeyReader: ukeyreader,

          /**
           * UKey 发放类
           */
          CUKeyDispenser: ukeydispenser,

          /**
           * 电子签名笔类
           */
          CTablet: tablet,

          /**
           * 支票类
           */
          CCheck: check,

          /**
           * 收钞模块类
           */
          CCashAcceptor: cashacceptor,

          /**
           * 出钞模块类
           */
          CCashDispenser: cashdispenser,

          /**
           * SIU类
           */
          CSIU: siu,

          /**
           * TTU类
           */
          CTTU: ttu,

          /**
           * 激光打印机类
           */
          CLaserPrinter: laserprinter["a" /* default */ ],

          /**
           * 视频聊天类
           */
          CVideoChat: videochat,

          /**
           * uchat
           */
          CUChat: uchat,

          /**
           * uplay
           */
          CUPlay: uplay,

          /**
           * dws
           */
          CDWS: dws,

          /**
           * CSetSIUTools
           */
          CSetSIUTools: setsiutools,

          /**
           * 外币模块
           */
          CForeignCurrencyTaken: foreigncurrencytaken,

          /**
           * 社保制卡
           */
          CNHMakeCard: nhmakecard
        };

        // CONCATENATED MODULE: ./src/platform/kernel/device/index.js
        /**
         * cpdl(cross-platform-device-layers)
         *
         * 请查看[[module-quoter]]
         */


        /**
         * 版本号
         */

        var device_version = '0.1.3';
        /* harmony default export */
        var kernel_device = ({
          version: device_version,

          /**
           * 全局对象引用方法
           */
          _$: _$,

          /**
           * 事件注册方法（保留）
           * @ignore
           */
          eventListener: eventListener,

          /**
           * 模块池
           * 请查看[[module-quoter]] 的 devPool对象池
           */
          modules: devPool,

          /**
           * 类定义池
           */
          classPool: classPool,

          /**
           * macro 宏定义
           */
          XFS: {
            WFS_SIU_COMMAND: WFS_SIU_COMMAND,
            WFS_SIU_GUIDLIGHTS: WFS_SIU_GUIDLIGHTS,
            WFS_SIU_TYPES: WFS_SIU_TYPES
          }
        });
        // CONCATENATED MODULE: ./src/platform/kernel/index.js


        var kernel_version = '0.1.3';

        /* harmony default export */
        var kernel = ({
          version: kernel_version,
          QtPlugins: qt,
          Device: kernel_device
        });
        // CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js
        /* concated harmony reexport version */
        __webpack_require__.d(__webpack_exports__, "version", function () {
          return kernel_version;
        });
        /* concated harmony reexport QtPlugins */
        __webpack_require__.d(__webpack_exports__, "QtPlugins", function () {
          return qt;
        });
        /* concated harmony reexport Device */
        __webpack_require__.d(__webpack_exports__, "Device", function () {
          return kernel_device;
        });


        /* harmony default export */
        var entry_lib = __webpack_exports__["default"] = (kernel);



        /***/
      }),

    /***/
    "fda1":
      /***/
      (function (module, exports, __webpack_require__) {

        exports.f = __webpack_require__("1b55");


        /***/
      }),

    /***/
    "fdef":
      /***/
      (function (module, exports) {

        module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
          '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


        /***/
      }),

    /***/
    "ff0c":
      /***/
      (function (module, exports, __webpack_require__) {

        // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
        var has = __webpack_require__("43c8");
        var toObject = __webpack_require__("0185");
        var IE_PROTO = __webpack_require__("5d8f")('IE_PROTO');
        var ObjectProto = Object.prototype;

        module.exports = Object.getPrototypeOf || function (O) {
          O = toObject(O);
          if (has(O, IE_PROTO)) return O[IE_PROTO];
          if (typeof O.constructor == 'function' && O instanceof O.constructor) {
            return O.constructor.prototype;
          }
          return O instanceof Object ? ObjectProto : null;
        };


        /***/
      })

    /******/
  });
});
//# sourceMappingURL=plugins.umd.js.map
